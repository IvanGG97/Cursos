// Arranca la plataforma en esta compu para dar la clase SIN INTERNET (ver SIN-INTERNET.md).
// Antes, con internet: npm run sin-internet:preparar
// Uso: npm run sin-internet            (en http://localhost:3000)
//      npm run sin-internet -- 3001    (en otro puerto, si el 3000 está ocupado)
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const manifest = "public/sin-internet/manifest.json";
if (!existsSync(manifest)) {
  console.error("Todavía no está preparado. Primero, CON internet:  npm run sin-internet:preparar");
  process.exit(1);
}
const { generado } = JSON.parse(readFileSync(manifest, "utf8"));
const port = Number(process.argv[2]) || 3000;

console.log(`\nCopias preparadas el ${new Date(generado).toLocaleString("es-AR")}.`);
console.log(`Cuando diga "Ready", abrí en el navegador:  http://localhost:${port}`);
console.log("La primera vez que abrís cada clase tarda unos segundos: abrilas antes de que lleguen los alumnos.");
console.log("Para cerrar: Ctrl + C en esta ventana.\n");

const child = spawn(`npx next dev --port ${port}`, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_SIN_INTERNET: "1", NEXT_TELEMETRY_DISABLED: "1" },
});
child.on("exit", (code) => process.exit(code ?? 0));
