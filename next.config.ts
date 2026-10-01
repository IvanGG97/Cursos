import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pdf usa módulos de Node que no conviene empaquetar.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Las fuentes del PDF se leen del disco en runtime: hay que incluirlas en el deploy.
  outputFileTracingIncludes: {
    "/cursos/[curso]/[clase]/resumen": ["./src/lib/pdf/fonts/**"],
  },
};

export default nextConfig;
