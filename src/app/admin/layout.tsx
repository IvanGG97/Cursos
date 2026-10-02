import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getViewer } from "@/lib/access";
import { AdminNav } from "./_ui";
import "./admin.css";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();

  return (
    <SiteShell>
      <div className="admin-head">
        <div className="kicker-sm">Panel de administración</div>
        <AdminNav />
      </div>
      {viewer.kind === "local" ? (
        <div className="notice warn">
          <strong>Modo local.</strong> El panel necesita Supabase (ver README y .env.example). Mientras tanto podés ver
          y presentar todas las clases desde el catálogo.
        </div>
      ) : (
        children
      )}
    </SiteShell>
  );
}
