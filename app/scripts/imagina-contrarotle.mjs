// Contrôle de la perspective calculée par la page Imaginar, hors navigateur (2026-11-13).
// Le même code que la page (src/lib/imagina/perspectiva.js) tourne sur la photo en ligne ; l'image écrite montre
// les traits trouvés, la grille posée sur le mur et le rectangle couché. La grille doit suivre les pierres et les
// fenêtres : c'est la preuve à regarder avant de croire un chiffre.
//
//   cd app
//   node scripts/imagina-contrarotle.mjs <clau> <x0,y0,x1,y1> [sortie.jpg] [--phi <degrés>]
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PAISATGES } from "../src/lib/paisatges/paisatges.js";
import {
  gris,
  segments,
  camera,
  preparar,
  perspectiva,
  grasilha,
} from "../src/lib/imagina/perspectiva.js";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iPhi = args.indexOf("--phi");
const phiForce = iPhi >= 0 ? Number(args.splice(iPhi, 2)[1]) : null;
const [clau, z, sortie = `contrarotle-${clau}.jpg`] = args;
const foto = PAISATGES.find((p) => p.clau === clau);
if (!foto || !z) {
  console.error(
    "Usage : node scripts/imagina-contrarotle.mjs <clau> <x0,y0,x1,y1> [sortie.jpg] [--phi <degrés>]",
  );
  process.exit(1);
}
const zona = z.split(",").map(Number);
const focales = JSON.parse(
  readFileSync(join(ICI, "../src/lib/imagina/focales.json"), "utf8"),
);

const fichier = join(
  ICI,
  `../static/apren/paisatges/${clau}-${foto.amples[process.env.GRAND ? foto.amples.length - 1 : 0]}.webp`,
);
const { data, info } = await sharp(fichier)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const t0 = performance.now();
const segs = segments(
  gris(data, info.width, info.height),
  info.width,
  info.height,
);
const t1 = performance.now();
const cam = camera(foto, focales[clau]);
const trachs = preparar(segs, cam);
const p = perspectiva(trachs, cam, zona, phiForce);
const t2 = performance.now();

console.log(
  `${clau} ${info.width}×${info.height} : ${segs.length} traits en ${Math.round(t1 - t0)} ms, perspective en ${Math.round(t2 - t1)} ms`,
);
console.log(
  `  focale ${cam.mesurada ? "relevée" : "supposée"} : ${cam.f.toFixed(3)} largeurs`,
);
console.log(
  `  verticale : [${p.dv.map((v) => v.toFixed(4)).join(", ")}] sur ${p.montants} montants`,
);
console.log(
  `  mur tourné de ${p.phi.toFixed(1)}° ${p.manual ? "(donné)" : `(${p.nombre} traits, part ${(p.part * 100).toFixed(0)} %, ${p.fisable ? "fiable" : "peu sûr"} ; autres : ${p.autras.map((x) => x.toFixed(1)).join(", ") || "aucune"})`}`,
);
console.log(
  `  proportion réelle ${p.proporcion.toFixed(2)} ; coins ${p.quad.map((c) => c.map((v) => v.toFixed(4)).join(",")).join(" ")}`,
);

const W = info.width,
  H = info.height;
const L = ([x1, y1, x2, y2], c, e) =>
  `<line x1="${x1 * W}" y1="${y1 * H}" x2="${x2 * W}" y2="${y2 * H}" stroke="${c}" stroke-width="${e}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${segs.map((s) => L(s, "rgba(255,255,0,0.55)", 1)).join("")}
${grasilha(cam, p.dv, p.phi, zona)
  .map((s) => L(s, "rgba(0,225,255,0.9)", 1))
  .join("")}
<rect x="${zona[0] * W}" y="${zona[1] * H}" width="${(zona[2] - zona[0]) * W}" height="${(zona[3] - zona[1]) * H}" fill="none" stroke="white" stroke-width="1" stroke-dasharray="4 3"/>
<polygon points="${p.quad.map(([x, y]) => `${x * W},${y * H}`).join(" ")}" fill="rgba(181,61,23,0.35)" stroke="#ff3b1f" stroke-width="2"/>
</svg>`;
await sharp(fichier)
  .composite([{ input: Buffer.from(svg) }])
  .jpeg({ quality: 88 })
  .toFile(sortie);
console.log("  image de contrôle :", sortie);
