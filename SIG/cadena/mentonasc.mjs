// Le pays mentonnais en zone de transition (demande de Romain, 2026-10-12,
// à propos de la voix de Roquebrune dans l'Atlas sonore) : le mentonasc est
// un parler de transition entre l'occitan alpin (le gavot de l'arrière-pays
// niçois) et le ligure intémélien de Vintimille (Wikipédia « Mentonnais » ;
// Forner, « Le mentonnais entre toutes les chaises ? » et Morphologie
// comparée du mentonnais et du ligurien alpin, 2022 ; Dalbera). Il reste
// dans le domaine, sur le vivaro-alpin, en quadrillage comme la Roya.
// Communes : Menton, Roquebrune-Cap-Martin, Gorbio, Sainte-Agnès (canton de
// Menton). Castellar manque dans nos communes ; Castillon, Sospel et
// Moulinet, parfois rattachés au mentonasc, restent à vérifier.
// Contours : app/static/data/comunas/06.json (TopoJSON), fusionnés sans
// leurs limites communes. S'applique APRÈS mixtas.py ; se relance sans risque.
// Usage : node SIG/cadena/mentonasc.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app/static/data');
const COMUNAS = ['06083', '06104', '06067', '06113'];

const T = JSON.parse(fs.readFileSync(path.join(DATA, 'comunas', '06.json'), 'utf8'));
const [sx, sy] = T.transform.scale,
	[tx, ty] = T.transform.translate;
// les arcs TopoJSON : positions quantifiées et cumulées
const arcs = T.arcs.map((a) => {
	let x = 0,
		y = 0;
	return a.map(([dx, dy]) => ((x += dx), (y += dy), [x * sx + tx, y * sy + ty]));
});

// Fusion : un arc partagé par deux communes choisies est une limite
// intérieure (il disparaît) ; les autres font le tour de la zone.
const geoms = T.objects.comunas.geometries.filter((g) => COMUNAS.includes(g.properties.i));
if (geoms.length !== COMUNAS.length) throw new Error('communes trouvées : ' + geoms.map((g) => g.properties.fr).join(', '));
const anels = geoms.flatMap((g) => (g.type === 'Polygon' ? g.arcs : g.arcs.flat()));
const usatges = new Map();
for (const anel of anels) for (const r of anel) usatges.set(r < 0 ? ~r : r, (usatges.get(r < 0 ? ~r : r) ?? 0) + 1);
const restants = anels.flat().filter((r) => usatges.get(r < 0 ? ~r : r) === 1);
const coords = (r) => (r < 0 ? [...arcs[~r]].reverse() : arcs[r]);
const clau = ([x, y]) => x.toFixed(7) + ',' + y.toFixed(7);
const perDebut = new Map(restants.map((r) => [clau(coords(r)[0]), r]));
const vist = new Set();
const torns = [];
for (const r0 of restants) {
	if (vist.has(r0)) continue;
	let anel = [];
	let r = r0;
	while (r !== undefined && !vist.has(r)) {
		vist.add(r);
		const c = coords(r);
		anel = anel.concat(anel.length ? c.slice(1) : c);
		r = perDebut.get(clau(c[c.length - 1]));
	}
	if (anel.length >= 4) torns.push(anel.map(([x, y]) => [Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4]));
}

const pZ = path.join(DATA, 'zonas-mixtas.geojson');
const Z = JSON.parse(fs.readFileSync(pZ, 'utf8'));
Z.features = Z.features.filter((f) => f.properties.kod !== 'mix-mentonasc');
Z.features.push({
	type: 'Feature',
	properties: {
		kod: 'mix-mentonasc',
		mena: 'mixta',
		// (occitan proposé par Claude, à valider par Romain : « mentonasc »,
		// « gavòt », « intemelian » absents du Basic de lo Congrès)
		oc: 'País mentonasc',
		fr: 'Pays mentonnais',
		sota_oc: "parlar de transicion entre l'occitan alpin (gavòt) e lo ligur intemelian",
		sota_fr: "parler de transition entre l'occitan alpin (gavot) et le ligure intémélien",
		eti: [7.468, 43.785]
	},
	geometry: { type: 'MultiPolygon', coordinates: torns.map((a) => [a]) }
});
fs.writeFileSync(pZ, JSON.stringify(Z));
console.log('mix-mentonasc :', geoms.map((g) => g.properties.fr).join(', '), '→', torns.length, 'contour(s),', torns.map((a) => a.length).join('+'), 'points');
