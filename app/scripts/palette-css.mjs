// Régénère src/lib/styles/palette.css depuis src/lib/styles/palette.js, la
// palette unique du site (2026-11-07). À lancer depuis app/ après toute
// modification de la palette : node scripts/palette-css.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cssPalette } from '../src/lib/styles/palette.js';

const cible = fileURLToPath(new URL('../src/lib/styles/palette.css', import.meta.url));
writeFileSync(cible, cssPalette());
console.log('palette.css régénéré :', cible);
