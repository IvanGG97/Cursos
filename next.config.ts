import type { NextConfig } from "next";

// "Sin internet" (ver SIN-INTERNET.md): su propia carpeta de compilación y sin el botón de Next en
// pantalla, que se vería en el proyector.
const sinInternet = process.env.NEXT_PUBLIC_SIN_INTERNET === "1";

const nextConfig: NextConfig = {
  ...(sinInternet ? { distDir: ".next-sin-internet", devIndicators: false as const } : {}),
  // react-pdf usa módulos de Node que no conviene empaquetar.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Las fuentes del PDF se leen del disco en runtime: hay que incluirlas en el deploy.
  outputFileTracingIncludes: {
    "/cursos/[curso]/[clase]/resumen": ["./src/lib/pdf/fonts/**"],
  },
};

export default nextConfig;
