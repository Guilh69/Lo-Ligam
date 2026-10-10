// Alsacian e francic : dos SVG tirats de « Alemannic-Dialects-Map-German.svg »
// (Wikimedia Commons, Pyrokrat 2010 d'aprèp Sémhur, CC BY-SA 3.0) per lo calatge :
//  - alem-zonas.svg : sonque lo jaç « zone » (las airas dels dialèctes), sens
//    las flèchas grisas transparentas (que mesclarián las colors) ;
//  - alem-limits.svg : sonque lo jaç « region » (frontièras e limits, traits gris).
//   node SIG/cadena/alsacian-alem-svg.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const SP = process.env.SCRATCH || path.resolve(CADENA, '../brut/alsacian');
// La pagina del document (viewBox) talha l'oèst de la carta (Vòsges, Alsàcia) :
// l'espandissèm per veire tot lo dessenh (x de -140 a 403, y de -20 a 361).
const s = fs.readFileSync(path.resolve(CADENA, '../brut/alsacian/fonts/Alemannic-Dialects-Map-German.svg'), 'utf8')
	.replace(/width="1400"\s+height="1000"\s+viewBox="6\.281 20\.246 397 341"/, 'width="3829" height="2687" viewBox="-140 -20 543 381"')
	.replace(/enable-background="new 6\.281 20\.246 397 341"/, '');
if (!s.includes('viewBox="-140 -20 543 381"')) throw new Error('viewBox pas cambiat');
const amagar = (t, ids) => ids.reduce((x, id) => x.replace(new RegExp(`<g\\s+style="display:inline"(\\s+inkscape:label="[^"]*"\\s+id="${id}")`), '<g style="display:none"$1'), t);
let zonas = amagar(s, ['layer1', 'layer5', 'layer6', 'layer2']);
// flèchas : camins negres d'opacitat 0,2
let n = 0;
zonas = zonas.replace(/<path\b[^>]*?style="[^"]*fill:#000000[^"]*opacity:0\.2[^"]*"[^>]*\/>/g, () => { n++; return ''; });
zonas = zonas.replace(/<path\b[^>]*?style="[^"]*opacity:0\.2[^"]*fill:#000000[^"]*"[^>]*\/>/g, () => { n++; return ''; });
fs.writeFileSync(path.join(SP, 'alem-zonas.svg'), zonas);
const limits = amagar(s, ['layer4', 'layer5', 'layer6', 'layer2']);
fs.writeFileSync(path.join(SP, 'alem-limits.svg'), limits);
// jaç « riviere » (lacs e flumes) : ponches de calatge (lacs)
fs.writeFileSync(path.join(SP, 'alem-aiga.svg'), amagar(s, ['layer4', 'layer1', 'layer6', 'layer2']));
console.log(`flèchas levadas : ${n}`);
