import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Annotations } from "@/content/types";
import { isOffline } from "./supabase/config";

// Copias para dar la clase sin internet (`npm run sin-internet:preparar`, ver SIN-INTERNET.md): las
// imágenes cargadas desde el panel, la última versión publicada desde el editor de cada clase y el
// estilo elegido. Solo se leen en el modo "sin internet".

export type OfflineMedia = { src: string; mime: string; position: number; annot?: Annotations };

export type OfflineManifest = {
  generado: string;
  /** curso → lugar de imagen → imágenes en orden */
  media: Record<string, Record<string, OfflineMedia[]>>;
  /** curso → número de clase → diapositivas publicadas desde el editor */
  versiones: Record<string, Record<string, unknown>>;
  /** curso → número de clase → estilo */
  estilos: Record<string, Record<string, string>>;
};

let cached: OfflineManifest | null | undefined;

/** Las copias, si se está en modo "sin internet" y ya se prepararon (si no, null). */
export function offlineManifest(): OfflineManifest | null {
  if (!isOffline) return null;
  if (cached !== undefined) return cached;
  const file = path.join(process.cwd(), "public", "sin-internet", "manifest.json");
  cached = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as OfflineManifest) : null;
  return cached;
}
