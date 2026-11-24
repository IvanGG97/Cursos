// Prepara la plataforma para dar la clase SIN INTERNET (ver SIN-INTERNET.md). Correrlo CON internet,
// antes de ir a la sala: baja a `public/sin-internet/` las imágenes, GIFs y videos cargados desde el
// panel, la última versión publicada desde el editor de cada clase y el estilo elegido de cada clase.
// Usa las claves de `.env.local` (la secreta, para leer las versiones). No modifica nada en la base.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "sin-internet");

if (!existsSync(".env.local")) {
  console.error("Falta el archivo .env.local con las claves de Supabase (ver .env.example).");
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^\s*[A-Z_]+\s*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]),
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = env.SUPABASE_SECRET_KEY;
if (!URL_ || !SECRET) {
  console.error("En .env.local faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY.");
  process.exit(1);
}
const svc = createClient(URL_, SECRET, { auth: { persistSession: false, autoRefreshToken: false } });

const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "image/svg+xml": "svg", "video/mp4": "mp4", "video/webm": "webm" };
const publicUrl = (p) => (/^https:\/\//i.test(p) ? p : `${URL_}/storage/v1/object/public/media/${p}`);

async function main() {
  console.log("Preparando la plataforma para usarla sin internet…");
  const { data: rows, error } = await svc.from("slide_media").select("*");
  if (error) throw error;

  // Se baja todo a una carpeta nueva y recién al final reemplaza a la anterior: si se corta internet
  // a la mitad, la copia anterior sigue sirviendo.
  const tmp = `${OUT}-nuevo`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  const media = {};
  let n = 0;
  let bytes = 0;
  for (const r of rows) {
    const res = await fetch(publicUrl(r.path));
    if (!res.ok) {
      console.warn(`  No se pudo bajar ${r.course_slug}/${r.media_id} (${res.status}): queda sin esa imagen.`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = r.mime || res.headers.get("content-type") || "image/png";
    const pos = r.position ?? 0;
    const file = `${r.media_id}-${pos}.${EXT[mime] ?? "bin"}`;
    mkdirSync(path.join(tmp, r.course_slug), { recursive: true });
    writeFileSync(path.join(tmp, r.course_slug, file), buf);
    ((media[r.course_slug] ??= {})[r.media_id] ??= []).push({ src: `/sin-internet/${r.course_slug}/${file}`, mime, position: pos, annot: r.annotations ?? undefined });
    n++;
    bytes += buf.length;
    if (n % 20 === 0) console.log(`  ${n} de ${rows.length} archivos…`);
  }
  for (const course of Object.values(media)) for (const list of Object.values(course)) list.sort((a, b) => a.position - b.position);

  // La última versión de cada clase: si es "volver al código" (slides = null), no hace falta copiarla.
  const versiones = {};
  const { data: vers, error: e2 } = await svc.from("class_versions").select("course_slug, class_num, slides, id").order("id", { ascending: false });
  if (e2) console.warn("  No se pudieron leer las versiones del editor: se usa el contenido del código.");
  const seen = new Set();
  for (const v of vers ?? []) {
    const k = `${v.course_slug}/${v.class_num}`;
    if (seen.has(k)) continue;
    seen.add(k);
    if (v.slides) (versiones[v.course_slug] ??= {})[v.class_num] = v.slides;
  }

  const estilos = {};
  const { data: st } = await svc.from("class_styles").select("course_slug, class_num, style");
  for (const s of st ?? []) (estilos[s.course_slug] ??= {})[s.class_num] = s.style;

  writeFileSync(path.join(tmp, "manifest.json"), JSON.stringify({ generado: new Date().toISOString(), media, versiones, estilos }));
  rmSync(OUT, { recursive: true, force: true });
  const { renameSync } = await import("node:fs");
  renameSync(tmp, OUT);

  const editadas = Object.entries(versiones).flatMap(([c, v]) => Object.keys(v).map((num) => `${c} clase ${num}`));
  console.log(`\nListo: ${n} archivos (${(bytes / 1024 / 1024).toFixed(1)} MB) en public/sin-internet.`);
  if (editadas.length) console.log(`Clases con cambios hechos desde el editor (copiados): ${editadas.join(", ")}.`);
  console.log("\nEn la sala, sin internet:  npm run sin-internet");
}

main().catch((e) => {
  console.error("\nNo se pudo preparar:", e.message ?? e, "\n¿Hay internet? Probá de nuevo.");
  process.exit(1);
});
