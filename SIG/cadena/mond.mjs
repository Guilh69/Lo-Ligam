// Europa e lo mond, pel dezoom de la carta (demanda de Romain, 2026-10-08) :
// contorns dels païses de world-atlas 2.0.2 (Natural Earth, domeni public ;
// paquet ISC), telecargats dins SIG/brut/mond/ :
//   https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json
//   https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
// Sortidas : app/static/data/mond-europa.json (1:50 M, Euròpa e Mediterranèa,
// coordenadas a 0,01°) e app/static/data/mond.json (1:110 M, lo mond, a 0,1°).
// Noms occitans dels païses : proposats per Claude, de validar per Romain
// (SIG/mond/noms-a-validar.csv).
// Usatge : node SIG/cadena/mond.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const SIG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRUT = path.join(SIG, 'brut/mond');
const DATA = path.resolve(SIG, '../app/static/data');

const NOMS = {
	Spain: ['Espanha', 'Espagne'],
	Portugal: ['Portugal', 'Portugal'],
	France: ['França', 'France'],
	Andorra: ['Andòrra', 'Andorre'],
	Monaco: ['Mónegue', 'Monaco'],
	Italy: ['Itàlia', 'Italie'],
	'San Marino': ['Sant Marin', 'Saint-Marin'],
	Switzerland: ['Soïssa', 'Suisse'],
	Liechtenstein: ['Liechtenstein', 'Liechtenstein'],
	Austria: ['Àustria', 'Autriche'],
	Germany: ['Alemanha', 'Allemagne'],
	Belgium: ['Bèlgica', 'Belgique'],
	Netherlands: ['Païses Basses', 'Pays-Bas'],
	Luxembourg: ['Luxemborg', 'Luxembourg'],
	'United Kingdom': ['Reialme Unit', 'Royaume-Uni'],
	Ireland: ['Irlanda', 'Irlande'],
	Iceland: ['Islàndia', 'Islande'],
	Norway: ['Norvègia', 'Norvège'],
	Sweden: ['Suècia', 'Suède'],
	Finland: ['Finlàndia', 'Finlande'],
	Denmark: ['Danemarc', 'Danemark'],
	Poland: ['Polonha', 'Pologne'],
	Czechia: ['Chequia', 'Tchéquie'],
	Slovakia: ['Eslovaquia', 'Slovaquie'],
	Hungary: ['Ongria', 'Hongrie'],
	Slovenia: ['Eslovènia', 'Slovénie'],
	Croatia: ['Croàcia', 'Croatie'],
	'Bosnia and Herz.': ['Bòsnia e Ercegovina', 'Bosnie-Herzégovine'],
	Serbia: ['Serbia', 'Serbie'],
	Montenegro: ['Montenegre', 'Monténégro'],
	Kosovo: ['Kosovo', 'Kosovo'],
	Albania: ['Albania', 'Albanie'],
	Macedonia: ['Macedònia del Nòrd', 'Macédoine du Nord'],
	'North Macedonia': ['Macedònia del Nòrd', 'Macédoine du Nord'],
	Greece: ['Grècia', 'Grèce'],
	Bulgaria: ['Bulgaria', 'Bulgarie'],
	Romania: ['Romania', 'Roumanie'],
	Moldova: ['Moldàvia', 'Moldavie'],
	Ukraine: ['Ucraïna', 'Ukraine'],
	Belarus: ['Bielorussia', 'Biélorussie'],
	Lithuania: ['Lituània', 'Lituanie'],
	Latvia: ['Letònia', 'Lettonie'],
	Estonia: ['Estònia', 'Estonie'],
	Russia: ['Russia', 'Russie'],
	Turkey: ['Turquia', 'Turquie'],
	Cyprus: ['Chipre', 'Chypre'],
	Malta: ['Malta', 'Malte'],
	Morocco: ['Marròc', 'Maroc'],
	Algeria: ['Argeria', 'Algérie'],
	Tunisia: ['Tunisia', 'Tunisie'],
	Libya: ['Libia', 'Libye'],
	Egypt: ['Egipte', 'Égypte'],
	Georgia: ['Georgia', 'Géorgie'],
	Armenia: ['Armenia', 'Arménie'],
	Azerbaijan: ['Azerbaitjan', 'Azerbaïdjan'],
	Israel: ['Israèl', 'Israël'],
	Lebanon: ['Liban', 'Liban'],
	Syria: ['Siria', 'Syrie'],
	Jordan: ['Jordania', 'Jordanie']
};

function decodar(topo) {
	const t = topo.transform;
	const arcs = topo.arcs.map((arc) => {
		if (!t) return arc;
		let x = 0,
			y = 0;
		return arc.map(([dx, dy]) => [(x += dx) * t.scale[0] + t.translate[0], (y += dy) * t.scale[1] + t.translate[1]]);
	});
	const anel = (idx) => {
		const pts = [];
		for (const i of idx) {
			const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
			for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]);
		}
		return pts;
	};
	return topo.objects.countries.geometries.map((g) => ({
		nom: g.properties?.name ?? '',
		poligons: g.type === 'Polygon' ? [g.arcs.map(anel)] : g.type === 'MultiPolygon' ? g.arcs.map((p) => p.map(anel)) : []
	}));
}
const aira = (a) => Math.abs(a.reduce((s, [x0, y0], i) => s + x0 * a[(i + 1) % a.length][1] - a[(i + 1) % a.length][0] * y0, 0) / 2);

// ponch per l'etiqueta : lo ponch dedins lo pus luènh dels bòrds (sus una
// grasilha), dins lo pus grand tròç
function ponchEti(anels) {
	const o = anels[0];
	let x0 = Infinity,
		y0 = Infinity,
		x1 = -Infinity,
		y1 = -Infinity;
	for (const [x, y] of o) {
		x0 = Math.min(x0, x);
		y0 = Math.min(y0, y);
		x1 = Math.max(x1, x);
		y1 = Math.max(y1, y);
	}
	const dedins = (x, y) => {
		let c = false;
		for (const a of anels)
			for (let i = 0, j = a.length - 1; i < a.length; j = i++)
				if (a[i][1] > y !== a[j][1] > y && x < ((a[j][0] - a[i][0]) * (y - a[i][1])) / (a[j][1] - a[i][1]) + a[i][0]) c = !c;
		return c;
	};
	const dist = (x, y) => {
		let m = Infinity;
		for (const a of anels)
			for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
				const [ax, ay] = a[i],
					[bx, by] = a[j],
					dx = bx - ax,
					dy = by - ay,
					l = dx * dx + dy * dy;
				const t = l ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l)) : 0;
				m = Math.min(m, (ax + t * dx - x) ** 2 + (ay + t * dy - y) ** 2);
			}
		return m;
	};
	let melhor = [(x0 + x1) / 2, (y0 + y1) / 2],
		dm = -1;
	const n = 24;
	for (let i = 1; i < n; i++)
		for (let j = 1; j < n; j++) {
			const x = x0 + ((x1 - x0) * i) / n,
				y = y0 + ((y1 - y0) * j) / n;
			if (!dedins(x, y)) continue;
			const d = dist(x, y);
			if (d > dm) {
				dm = d;
				melhor = [x, y];
			}
		}
	return melhor;
}

const arr = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
function escriure(entrada, sortida, dec, bbox, ambNoms) {
	const païses = decodar(JSON.parse(fs.readFileSync(path.join(BRUT, entrada), 'utf8')));
	const out = [];
	for (const p of païses) {
		let pols = p.poligons.filter((pl) => pl[0].length >= 4);
		if (bbox) pols = pols.filter((pl) => pl[0].some(([x, y]) => x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3]));
		if (!pols.length) continue;
		const r = pols
			.map((pl) =>
				pl
					.map((a) => a.map(([x, y]) => [arr(x, dec), arr(y, dec)]).filter((q, i, t) => !i || q[0] !== t[i - 1][0] || q[1] !== t[i - 1][1]))
					.filter((a) => a.length >= 4)
			)
			.filter((pl) => pl.length);
		if (!r.length) continue;
		const gros = r.reduce((m, pl) => (aira(pl[0]) > aira(m[0]) ? pl : m), r[0]);
		const [oc, fr] = (ambNoms && NOMS[p.nom]) || [null, null];
		const e = ponchEti(gros);
		out.push({ n: p.nom, oc, fr, eti: [arr(e[0], 2), arr(e[1], 2)], p: r });
	}
	fs.writeFileSync(path.join(DATA, sortida), JSON.stringify({ font: 'Natural Earth (domeni public), via world-atlas', païses: out }));
	console.log(sortida, out.length, 'païses', fs.statSync(path.join(DATA, sortida)).size, 'octets');
	return out;
}

const eu = escriure('countries-50m.json', 'mond-europa.json', 2, [-25, 27, 50, 72], true);
escriure('countries-110m.json', 'mond.json', 1, null, false);

// L'outra mar (retorn de Romain : « dommage de les faire disparaître ») : a
// 1:110 M, Guadalope, Martinica, la Reünion, Maiòta, la Polinesia… i son
// pas. Venon de 1:50 M, a 0,01° : los tròces de França fòra d'Euròpa (levat
// la Guiana, ja dins 1:110 M) e los territòris nomenats a despart.
const OUTRA_MAR = ['St. Pierre and Miquelon', 'Wallis and Futuna Is.', 'St-Martin', 'St-Barthélemy', 'Fr. Polynesia', 'Fr. S. Antarctic Lands'];
{
	const p50 = decodar(JSON.parse(fs.readFileSync(path.join(BRUT, 'countries-50m.json'), 'utf8')));
	const fòraEuròpa = (pl) => pl[0].every(([x, y]) => x < -25 || x > 50 || y < 27 || y > 72);
	const guiana = (pl) => pl[0].every(([x, y]) => x > -55 && x < -51 && y > 1.5 && y < 6.5);
	const mond = JSON.parse(fs.readFileSync(path.join(DATA, 'mond.json'), 'utf8'));
	let n = 0;
	for (const p of p50) {
		let pols = null;
		if (p.nom === 'France') pols = p.poligons.filter((pl) => fòraEuròpa(pl) && !guiana(pl));
		else if (OUTRA_MAR.includes(p.nom)) pols = p.poligons;
		if (!pols?.length) continue;
		const r = pols
			.map((pl) => pl.map((a) => a.map(([x, y]) => [arr(x, 2), arr(y, 2)]).filter((q, i, t) => !i || q[0] !== t[i - 1][0] || q[1] !== t[i - 1][1])).filter((a) => a.length >= 4))
			.filter((pl) => pl.length);
		if (!r.length) continue;
		const gros = r.reduce((m, pl) => (aira(pl[0]) > aira(m[0]) ? pl : m), r[0]);
		const e = ponchEti(gros);
		mond.païses.push({ n: p.nom + ' (outra mar)', oc: null, fr: null, eti: [arr(e[0], 2), arr(e[1], 2)], p: r });
		n += r.length;
	}
	fs.writeFileSync(path.join(DATA, 'mond.json'), JSON.stringify(mond));
	console.log('outra mar :', n, 'tròces apondus ; mond.json', fs.statSync(path.join(DATA, 'mond.json')).size, 'octets');
}
fs.mkdirSync(path.join(SIG, 'mond'), { recursive: true });
fs.writeFileSync(
	path.join(SIG, 'mond/noms-a-validar.csv'),
	'nom_angles;oc;fr;nota\n' +
		eu
			.filter((p) => p.oc)
			.map((p) => `${p.n};${p.oc};${p.fr};proposat per Claude, de validar`)
			.join('\n') +
		'\n'
);
console.log('sens nom (contorn sol) :', eu.filter((p) => !p.oc).map((p) => p.n).join(', '));
