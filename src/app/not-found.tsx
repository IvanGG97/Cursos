import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="page-head">
        <div className="kicker-sm">Error 404</div>
        <h1>No encontramos esa página</h1>
        <p>Puede que el link esté mal escrito o que el curso todavía no esté publicado.</p>
      </div>
      <Link href="/" className="btn">← Volver al inicio</Link>
    </SiteShell>
  );
}
