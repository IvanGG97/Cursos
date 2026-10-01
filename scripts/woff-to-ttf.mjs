// Convierte fuentes WOFF (1.0) a TTF/OTF. Uso: node scripts/woff-to-ttf.mjs <archivo.woff>...
// react-pdf (fontkit) no lee bien los WOFF de @fontsource; con TTF funciona.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

function woffToSfnt(woff) {
  if (woff.readUInt32BE(0) !== 0x774f4646) throw new Error("No es un WOFF 1.0");
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);

  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 44 + i * 20;
    const tag = woff.readUInt32BE(o);
    const offset = woff.readUInt32BE(o + 4);
    const compLength = woff.readUInt32BE(o + 8);
    const origLength = woff.readUInt32BE(o + 12);
    const checksum = woff.readUInt32BE(o + 16);
    const raw = woff.subarray(offset, offset + compLength);
    const data = compLength < origLength ? inflateSync(raw) : raw;
    tables.push({ tag, checksum, data });
  }

  const pow2 = 2 ** Math.floor(Math.log2(numTables));
  const header = Buffer.alloc(12 + numTables * 16);
  header.writeUInt32BE(flavor, 0);
  header.writeUInt16BE(numTables, 4);
  header.writeUInt16BE(pow2 * 16, 6);
  header.writeUInt16BE(Math.log2(pow2), 8);
  header.writeUInt16BE(numTables * 16 - pow2 * 16, 10);

  const chunks = [header];
  let offset = header.length;
  tables.forEach((t, i) => {
    const r = 12 + i * 16;
    header.writeUInt32BE(t.tag, r);
    header.writeUInt32BE(t.checksum, r + 4);
    header.writeUInt32BE(offset, r + 8);
    header.writeUInt32BE(t.data.length, r + 12);
    const padded = Buffer.alloc((t.data.length + 3) & ~3);
    t.data.copy(padded);
    chunks.push(padded);
    offset += padded.length;
  });
  return Buffer.concat(chunks);
}

for (const file of process.argv.slice(2)) {
  const out = file.replace(/\.woff$/, ".ttf");
  writeFileSync(out, woffToSfnt(readFileSync(file)));
  console.log(`${file} -> ${out}`);
}
