// Données de l'esquisse « page presque blanche » (nuit du 2026-10-22,
// revisions/2026-10-22-proposicion-pagina-blanca.md, points 7, 8 et 13).
// Tout l'occitan vient du site (donadas.js de l'accueil, planSite.js,
// routes/+page.svelte) ou des noms des fiches Canva de Romain ; les mots
// dont la graphie a été rétablie (Plòu, Jòia, Còr, Nèu) sont passés par
// l'API de lo Congrès le 22-10, à valider par Romain. Ce qui n'existe pas
// est écrit « [a escriure per Romain] » ou « [a causir per Romain] ».
import { LUOCS, COSTA } from '$lib/acuelh/carta-estelas.js';

export { RESERVAR, MANIFEST } from '$lib/acuelh/donadas.js';
export { LO_LIGAM } from '$lib/data/planSite.js';

export const ESCRIURE = '[a escriure per Romain]';
export const CAUSIR = '[a causir per Romain]';

// Bloc 1 : la fiche de la semaine (étiquette « Lo mot de la setmana », à
// valider par Romain). Image : design-stock/canva-vf/11-Meteo/Plou.png.
export const MOT_SETMANA = { mot: 'Plòu', img: 'plou', href: '/mots' };

// Bloc 2 : onze mots des fiches Canva (noms de fichiers de canva-vf/),
// [a causir per Romain]. Chaque mot mène aux Mots en imatges.
export const BANDEL = ['Plòu', 'Solelh', 'Nèu', 'Jòia', 'Ostal', 'Còr', 'Tomata', 'Montanha', 'Gat', 'Caval', 'Familha'];

// Bloc 5 : les trois façons d'apprendre, textes de routes/+page.svelte (section 02)
export const BIAIS = [
	{ n: 'I', titol: 'En visio, amb ieu', tèxt: 'De corses en dirècte, en pichon grop o sol a sol. Lo primièr es ofèrt.', ligam: 'Prene rendètz-vos', href: 'RESERVAR' },
	{ n: 'II', titol: 'A ton ritme', tèxt: 'Un parcors autonòm, de zèro fins al nivèl B1, leiçon per leiçon, per contunhar entre dos corses.', ligam: 'Començar lo parcors', href: '/aprene' },
	{ n: 'III', titol: 'Sus mesura', tèxt: 'Visio, parcors autonòm e rescontres en persona se sèm dins la meteissa vila : ara, soi a Lion.', ligam: 'Ne parlar amassa', href: 'RESERVAR' }
];

// Bloc 6 : six fiches Canva en tuiles, [a causir per Romain]. Copies
// réduites : app/static/ensag/blanc/<img>.webp. Dossiers Canva d'origine :
// 14-Emocions, 33-Ostal, 03-Cos-uman, 04-Manjam-uei, 01-Entre-cel-e-montanhas, 11-Meteo
// (les noms de thèmes ne sont pas affichés : leur graphie reste à valider).
export const TEULAS = [
	{ mot: 'Jòia', img: 'joia' },
	{ mot: 'Ostal', img: 'ostal' },
	{ mot: 'Còr', img: 'cor' },
	{ mot: 'Tomata', img: 'tomata' },
	{ mot: 'Montanha', img: 'montanha' },
	{ mot: 'Plòu', img: 'plou' }
];

// Bloc 4 : la carte en étoiles, en SVG immobile (pas de canevas). Même
// cadre que le moteur de l'accueil (motor.js, GEO) : les 304 lieux de
// carta-estelas.js et le trait de côte, projetés en équirectangulaire.
const GEO = { lon0: -1.6, lon1: 7.55, lat0: 42.65, lat1: 46.4, kx: Math.cos((44.5 * Math.PI) / 180) };
const S = 100;
const px = (lon) => +((lon - GEO.lon0) * GEO.kx * S).toFixed(1);
const py = (lat) => +((GEO.lat1 - lat) * S).toFixed(1);
// 40 unités de plus à droite : la place du nom de Niça
export const VISTA = `0 0 ${Math.round((GEO.lon1 - GEO.lon0) * GEO.kx * S) + 40} ${Math.round((GEO.lat1 - GEO.lat0) * S)}`;
export const ESTELAS = LUOCS.map(([lon, lat, nom, vila]) => ({ x: px(lon), y: py(lat), nom, vila: vila === 1 }));

// Le trait de côte, coupé au cadre (une sous-ligne par passage dans le cadre,
// pour ne jamais tirer un trait à travers la zone coupée)
const dedins = ([lon, lat]) => lon > GEO.lon0 - 0.4 && lon < GEO.lon1 + 0.4 && lat > GEO.lat0 - 0.4 && lat < GEO.lat1 + 0.4;
export const COSTA_D = COSTA.map((linha) => {
	const tròces = [];
	let actual = [];
	for (const p of linha) {
		if (dedins(p)) actual.push(p);
		else if (actual.length) { tròces.push(actual); actual = []; }
	}
	if (actual.length) tròces.push(actual);
	return tròces.filter((t) => t.length > 1).map((t) => 'M' + t.map(([lon, lat]) => `${px(lon)} ${py(lat)}`).join('L')).join('');
}).join('');
