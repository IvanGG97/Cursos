import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { canManage, getViewer } from "@/lib/access";
import { createServiceClient, isServiceConfigured } from "@/lib/supabase/admin";
import { AdminNav } from "./_ui";
import "./admin.css";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  // Solicitudes de admisión pendientes (número en la pestaña). Sin la migración: 0.
  let pending = 0;
  if (viewer.kind === "user" && canManage(viewer) && isServiceConfigured) {
    const { count } = await createServiceClient()
      .from("access_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    pending = count ?? 0;
  }

  return (
    <SiteShell>
      <div className="admin-head">
        <div className="kicker-sm">Panel de administración</div>
        <AdminNav pending={pending} />
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
