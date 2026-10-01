import Link from "next/link";
import { canManage, getViewer } from "@/lib/access";
import { SITE_NAME } from "@/lib/site";

/** Cabecera + pie de las páginas del sitio (no se usa en el visor de diapositivas). */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();

  return (
    <>
      {viewer.kind === "local" && (
        <div className="dev-banner">
          Modo local: Supabase no está configurado — sin login y con acceso de admin. Ver .env.example
        </div>
      )}
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">{SITE_NAME}</Link>
          <nav className="nav">
            {canManage(viewer) && <Link href="/admin" className="btn btn-sm">Admin</Link>}
            {viewer.kind === "user" && (
              <>
                <span className="who">{viewer.email}</span>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="btn btn-sm">Salir</button>
                </form>
              </>
            )}
            {viewer.kind === "anon" && <Link href="/login" className="btn btn-sm btn-primary">Ingresar</Link>}
          </nav>
        </div>
      </header>
      <main className="page container">{children}</main>
      <footer className="site-footer">
        <div className="container">{SITE_NAME}</div>
      </footer>
    </>
  );
}
