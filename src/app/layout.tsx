import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import { cookies } from "next/headers";
import { SITE_NAME, THEME_COOKIE, type Theme } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Cursos prácticos para usar la tecnología en el día a día.",
};

export async function generateViewport(): Promise<Viewport> {
  const light = (await cookies()).get(THEME_COOKIE)?.value === "light";
  return { themeColor: light ? "#f4f6f9" : "#0b0f14", viewportFit: "cover" };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // El modo elegido viaja en una cookie: el HTML ya sale con el tema correcto (sin parpadeo).
  const theme: Theme = (await cookies()).get(THEME_COOKIE)?.value === "light" ? "light" : "dark";
  return (
    <html lang="es" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
