import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getViewer } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { JoinLiveForm } from "./JoinForm";
import { openSessionByCode } from "./sessions";
import "./vivo.css";

export const metadata: Metadata = { title: "Clase en vivo" };

type Props = { searchParams: Promise<{ c?: string }> };

export default async function LiveJoinPage({ searchParams }: Props) {
  const { c = "" } = await searchParams;
  const code = c.replace(/\D/g, "").slice(0, 4);
  const viewer = await getViewer();

  if (viewer.kind === "local") {
    return (
      <SiteShell>
        <div className="notice warn">La clase en vivo necesita Supabase configurado.</div>
      </SiteShell>
    );
  }

  // Llegó desde el QR: se une directo. El admin no se registra como alumno: va a la partida, donde
  // elige volver a presentar.
  let error: string | undefined;
  if (code.length === 4) {
    const supabase = await createClient();
    if (viewer.kind === "user" && viewer.isAdmin) {
      const id = await openSessionByCode(code);
      if (id) redirect(`/vivo/${id}`);
    }
    const { data } = await supabase.rpc("join_live", { p_code: code });
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.session_id) redirect(`/vivo/${row.session_id}`);
    error = "Ese código no corresponde a ninguna clase en vivo. Revisalo en la pantalla.";
  }

  return (
    <SiteShell>
      <div className="live-wrap">
        <div className="kicker-sm">Clase en vivo</div>
        <h1 className="live-h1">Sumate a la clase</h1>
        <p className="muted">Escribí el número de 4 cifras que aparece en la pantalla del aula.</p>
        <JoinLiveForm initialCode={code} initialError={error} />
        {viewer.kind === "anon" && (
          <p className="hint">
            Podés participar sin cuenta. Si querés que quede registrada tu <strong>asistencia</strong>,{" "}
            <Link href={`/login?next=${encodeURIComponent(`/vivo${code ? `?c=${code}` : ""}`)}`}>ingresá con Google</Link>{" "}
            antes de entrar.
          </p>
        )}
      </div>
    </SiteShell>
  );
}
