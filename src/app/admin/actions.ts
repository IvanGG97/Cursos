"use server";

import { revalidatePath } from "next/cache";
import { getCourse } from "@/content/registry";
import { adminCtx, audit, parseEmails, randomCode, type ActionResult, type AdminCtx } from "@/lib/admin";
import { fromLocalInput } from "@/lib/site";

// Todas las acciones del panel. Cada una verifica admin acá Y en la base (RLS + funciones protegidas),
// deja registro en admin_audit y devuelve un mensaje para mostrar en el formulario.

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/** Envuelve una acción: verifica admin, captura errores como mensaje y refresca las páginas. */
function action(fn: (ctx: AdminCtx, f: FormData) => Promise<string | ActionResult>): Action {
  return async (_prev, formData) => {
    try {
      const ctx = await adminCtx();
      const res = await fn(ctx, formData);
      revalidatePath("/", "layout");
      return typeof res === "string" ? { ok: res } : res;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Algo salió mal. Probá de nuevo." };
    }
  };
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

function courseFrom(f: FormData) {
  const course = getCourse(str(f, "slug"));
  if (!course) throw new Error("Curso inexistente.");
  return course;
}

function classFrom(f: FormData) {
  const course = courseFrom(f);
  const num = Number(str(f, "num"));
  const clase = course.classes.find((c) => c.num === num);
  if (!clase) throw new Error("Clase inexistente.");
  return { course, clase };
}

function check(error: { message: string; code?: string } | null, friendly?: Record<string, string>) {
  if (!error) return;
  throw new Error((error.code && friendly?.[error.code]) || error.message);
}

/** Los cursos nacen en el repo: la fila en la base se crea la primera vez que se toca algo. */
async function ensureCourseRow(ctx: AdminCtx, slug: string) {
  const { error } = await ctx.supabase.from("courses").upsert({ slug }, { onConflict: "slug", ignoreDuplicates: true });
  check(error);
}

// ---------------------------------------------------------------------------
// Cursos
// ---------------------------------------------------------------------------

/** Modo del curso: hidden (sin publicar) · enrolled (publicado, con inscripción) · public (libre, sin registro). */
export const setCourseMode = action(async (ctx, f) => {
  const course = courseFrom(f);
  const mode = str(f, "mode");
  if (!["hidden", "enrolled", "public"].includes(mode)) throw new Error("Modo inválido.");
  await ensureCourseRow(ctx, course.slug);
  const patch =
    mode === "hidden" ? { published: false } : { published: true, access: mode === "public" ? "public" : "enrolled" };
  check((await ctx.supabase.from("courses").update(patch).eq("slug", course.slug)).error, {
    PGRST204: "Falta correr la migración 20261002000000_course_access.sql en Supabase.",
    "42703": "Falta correr la migración 20261002000000_course_access.sql en Supabase.",
  });
  await audit(ctx, `course.mode.${mode}`, course.slug);
  return {
    hidden: "Curso sin publicar: ya no aparece en el catálogo.",
    enrolled: "Curso publicado: se ve en el catálogo y hace falta inscribirse.",
    public: "Curso libre: cualquiera ve las clases liberadas, sin registrarse.",
  }[mode]!;
});

/** Libera de una vez todas las clases que tienen contenido. */
export const releaseAllClasses = action(async (ctx, f) => {
  const course = courseFrom(f);
  const ready = course.classes.filter((c) => c.slides.length > 0);
  if (ready.length === 0) throw new Error("Este curso todavía no tiene clases con contenido.");
  await ensureCourseRow(ctx, course.slug);
  const now = new Date().toISOString();
  check(
    (
      await ctx.supabase.from("class_releases").upsert(
        ready.map((c) => ({ course_slug: course.slug, class_num: c.num, visible: true, visible_from: null, updated_at: now })),
      )
    ).error,
  );
  await audit(ctx, "class.release_all", course.slug, { classes: ready.map((c) => c.num) });
  return `${ready.length} clase(s) liberada(s).`;
});

export const setEnrollCode = action(async (ctx, f) => {
  const course = courseFrom(f);
  const generate = str(f, "generate") === "1";
  const code = generate ? randomCode() : str(f, "code").toUpperCase();
  if (!/^[A-Z0-9-]{4,32}$/.test(code)) throw new Error("El código tiene que tener entre 4 y 32 letras, números o guiones.");
  await ensureCourseRow(ctx, course.slug);
  check(
    (await ctx.supabase.from("course_codes").upsert({ course_slug: course.slug, code })).error,
    { "23505": "Ese código ya lo usa otro curso." },
  );
  await audit(ctx, "course.code.set", course.slug, { code });
  return `Código activo: ${code}`;
});

export const removeEnrollCode = action(async (ctx, f) => {
  const course = courseFrom(f);
  check((await ctx.supabase.from("course_codes").delete().eq("course_slug", course.slug)).error);
  await audit(ctx, "course.code.remove", course.slug);
  return "Código desactivado: nadie más puede inscribirse con código.";
});

// ---------------------------------------------------------------------------
// Clases
// ---------------------------------------------------------------------------

export const setRelease = action(async (ctx, f) => {
  const { course, clase } = classFrom(f);
  const visible = str(f, "visible") === "true";
  const visibleFrom = visible ? fromLocalInput(str(f, "visible_from")) : null;
  await ensureCourseRow(ctx, course.slug);
  check(
    (
      await ctx.supabase.from("class_releases").upsert({
        course_slug: course.slug,
        class_num: clase.num,
        visible,
        visible_from: visibleFrom,
        updated_at: new Date().toISOString(),
      })
    ).error,
  );
  await audit(ctx, "class.release", `${course.slug}/clase-${clase.num}`, { visible, visible_from: visibleFrom });
  if (!visible) return `Clase ${clase.num} oculta.`;
  return visibleFrom && new Date(visibleFrom) > new Date()
    ? `Clase ${clase.num} programada.`
    : `Clase ${clase.num} liberada.`;
});

// ---------------------------------------------------------------------------
// Inscripciones e invitaciones
// ---------------------------------------------------------------------------

/** Inscribe por mail: quien ya tiene cuenta queda inscripto; quien no, queda invitado. */
export const addPeople = action(async (ctx, f) => {
  const course = courseFrom(f);
  const { valid, invalid } = parseEmails(str(f, "emails"));
  if (valid.length === 0) throw new Error("No encontré ningún mail válido.");
  if (valid.length > 200) throw new Error("Máximo 200 mails por vez.");
  await ensureCourseRow(ctx, course.slug);

  const { data: existing, error } = await ctx.supabase.from("profiles").select("id, email").in("email", valid);
  check(error);
  const byEmail = new Map((existing ?? []).map((p) => [p.email as string, p.id as string]));
  const toEnroll = valid.filter((e) => byEmail.has(e));
  const toInvite = valid.filter((e) => !byEmail.has(e));

  if (toEnroll.length) {
    // Si ya estaban (aunque suspendidos), quedan activos.
    check(
      (
        await ctx.supabase.from("enrollments").upsert(
          toEnroll.map((e) => ({
            user_id: byEmail.get(e),
            course_slug: course.slug,
            status: "active",
            source: "admin",
            updated_at: new Date().toISOString(),
          })),
          { onConflict: "user_id,course_slug" },
        )
      ).error,
    );
    await audit(ctx, "enrollment.add", course.slug, { emails: toEnroll });
  }
  if (toInvite.length) {
    check(
      (
        await ctx.supabase.from("enrollment_invites").upsert(
          toInvite.map((email) => ({ email, course_slug: course.slug, created_by: ctx.viewer.id })),
          { onConflict: "email,course_slug", ignoreDuplicates: true },
        )
      ).error,
    );
    await audit(ctx, "enrollment.invite", course.slug, { emails: toInvite });
  }

  const parts = [];
  if (toEnroll.length) parts.push(`${toEnroll.length} inscripta(s)`);
  if (toInvite.length) parts.push(`${toInvite.length} invitada(s): quedan inscriptas cuando entren por primera vez`);
  if (invalid.length) parts.push(`ignoré ${invalid.length} que no parecen mails: ${invalid.slice(0, 5).join(", ")}`);
  return parts.join(" · ") + ".";
});

export const setEnrollmentStatus = action(async (ctx, f) => {
  const course = courseFrom(f);
  const user = str(f, "user");
  const status = str(f, "status") === "suspended" ? "suspended" : "active";
  check(
    (
      await ctx.supabase
        .from("enrollments")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("user_id", user)
        .eq("course_slug", course.slug)
    ).error,
  );
  await audit(ctx, status === "suspended" ? "enrollment.suspend" : "enrollment.activate", course.slug, { user });
  return status === "suspended" ? "Inscripción suspendida." : "Inscripción reactivada.";
});

export const removeEnrollment = action(async (ctx, f) => {
  const course = courseFrom(f);
  const user = str(f, "user");
  check((await ctx.supabase.from("enrollments").delete().eq("user_id", user).eq("course_slug", course.slug)).error);
  await audit(ctx, "enrollment.remove", course.slug, { user });
  return "Inscripción quitada.";
});

/** Inscribir a una persona puntual (desde su ficha). */
export const enrollUser = action(async (ctx, f) => {
  const course = courseFrom(f);
  const user = str(f, "user");
  await ensureCourseRow(ctx, course.slug);
  check(
    (
      await ctx.supabase.from("enrollments").upsert(
        { user_id: user, course_slug: course.slug, status: "active", source: "admin", updated_at: new Date().toISOString() },
        { onConflict: "user_id,course_slug" },
      )
    ).error,
  );
  await audit(ctx, "enrollment.add", course.slug, { user });
  return `Inscripta en "${course.title}".`;
});

export const cancelInvite = action(async (ctx, f) => {
  const course = courseFrom(f);
  const email = str(f, "email").toLowerCase();
  check((await ctx.supabase.from("enrollment_invites").delete().eq("email", email).eq("course_slug", course.slug)).error);
  await audit(ctx, "invite.cancel", course.slug, { email });
  return "Invitación cancelada.";
});

// ---------------------------------------------------------------------------
// Acceso individual a clases
// ---------------------------------------------------------------------------

export const setGrant = action(async (ctx, f) => {
  const { course, clase } = classFrom(f);
  const user = str(f, "user");
  const on = str(f, "on") === "true";
  await ensureCourseRow(ctx, course.slug);
  const q = ctx.supabase.from("class_grants");
  check(
    (
      on
        ? await q.upsert(
            { user_id: user, course_slug: course.slug, class_num: clase.num, created_by: ctx.viewer.id },
            { onConflict: "user_id,course_slug,class_num", ignoreDuplicates: true },
          )
        : await q.delete().eq("user_id", user).eq("course_slug", course.slug).eq("class_num", clase.num)
    ).error,
  );
  await audit(ctx, on ? "grant.add" : "grant.remove", `${course.slug}/clase-${clase.num}`, { user });
  return on ? `Acceso individual a la clase ${clase.num} habilitado.` : `Acceso individual a la clase ${clase.num} quitado.`;
});

// ---------------------------------------------------------------------------
// Personas
// ---------------------------------------------------------------------------

export const setRole = action(async (ctx, f) => {
  const user = str(f, "user");
  const role = str(f, "role") === "admin" ? "admin" : "student";
  check((await ctx.supabase.rpc("admin_set_role", { p_user: user, p_role: role })).error);
  await audit(ctx, "user.role", user, { role });
  return role === "admin" ? "Ahora es administrador." : "Ahora es alumno.";
});

export const setUserStatus = action(async (ctx, f) => {
  const user = str(f, "user");
  const status = str(f, "status") === "blocked" ? "blocked" : "active";
  check((await ctx.supabase.rpc("admin_set_status", { p_user: user, p_status: status })).error);
  await audit(ctx, status === "blocked" ? "user.block" : "user.unblock", user);
  return status === "blocked" ? "Cuenta suspendida: no puede ver ninguna clase." : "Cuenta reactivada.";
});
