import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getViewer } from "@/lib/access";
import { googleAuthEnabled } from "@/lib/supabase/config";
import { safeNext } from "@/lib/urls";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

const ERRORS: Record<string, string> = {
  link: "El link venció o ya se usó. Pedí uno nuevo.",
  google: "No pudimos conectar con Google. Probá con tu mail.",
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next: rawNext, error } = await searchParams;
  const next = safeNext(rawNext);

  const viewer = await getViewer();
  if (viewer.kind !== "anon") redirect(next);

  return (
    <SiteShell>
      <div className="auth-box">
        <div className="kicker-sm">Ingresar</div>
        <h1>Hola</h1>
        <p>
          {googleAuthEnabled
            ? "Entrá con tu cuenta de Google: la misma que usás en el celular. No hace falta crear ninguna contraseña."
            : "No hace falta contraseña: te mandamos un link a tu mail y entrás con un toque."}
        </p>
        {error && ERRORS[error] && (
          <div className="notice err" style={{ marginBottom: 20 }}>{ERRORS[error]}</div>
        )}
        <LoginForm next={next} google={googleAuthEnabled} />
      </div>
    </SiteShell>
  );
}
