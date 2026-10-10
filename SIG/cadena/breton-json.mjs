// Breton, étape 4 : fiche des dialectes et des zones hachurées, à partir du
// tableau des communes (SIG/breton/dialectes-breton.csv).
//
//   node SIG/cadena/breton-json.mjs
//
// Sortie : SIG/breton/dialectes-breton.json
// Noms occitans : propositions, vérifiées le 2026-10-10 avec l'API de lo Congrès
// (app/scripts/verificar-oc.mjs) ; « a_validar » dit ce que le dictionnaire ne connaît pas.
import fs from 'fs';
import { fileURLToPath } from 'url';

const SIG = fileURLToPath(new URL('../', import.meta.url));
const linhas = fs.readFileSync(SIG + 'breton/dialectes-breton.csv', 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
// lecture CSV simple (champs entre guillemets possibles)
function camps(l) {
	const o = [];
	let c = '', q = false;
	for (let i = 0; i < l.length; i++) {
		const x = l[i];
		if (q) {
			if (x === '"' && l[i + 1] === '"') { c += '"'; i++; }
			else if (x === '"') q = false;
			else c += x;
		} else if (x === '"') q = true;
		else if (x === ';') { o.push(c); c = ''; }
		else c += x;
	}
	o.push(c);
	return o;
}
const cap = camps(linhas[0]);
const rows = linhas.slice(1).map((l) => Object.fromEntries(camps(l).map((v, i) => [cap[i], v])));
const per = (f) => rows.filter(f).map((r) => r.codi);

const dialectes = [
	{
		kod: 'leoneg', br: 'leoneg', br_alt: 'brezhoneg Leon', fr: 'léonard', oc: 'leonés', evesquat_fr: 'Léon',
		parlars: [
			{ kod: 'eusa', br: 'Eusa', fr: 'Ouessant' },
			{ kod: 'molenez', br: 'Molenez', fr: 'Molène' },
			{ kod: 'enez-vaz', br: 'Enez-Vaz', fr: 'île de Batz' }
		]
	},
	{
		kod: 'tregerieg', br: 'tregerieg', br_alt: 'brezhoneg Treger', fr: 'trégorrois', oc: 'tregorés', evesquat_fr: 'Tréguier, et partie bretonnante de Saint-Brieuc (Goëlo)',
		parlars: [
			{ kod: 'goelo', br: 'Goueloù', fr: 'Goëlo (évêché de Saint-Brieuc)' },
			{ kod: 'enez-vriad', br: 'Enez-Vriad', fr: 'île de Bréhat' }
		]
	},
	{
		kod: 'kerneveg', br: 'kerneveg', br_alt: 'brezhoneg Kerne', fr: 'cornouaillais', oc: 'cornoalhés', evesquat_fr: 'Cornouaille',
		parlars: [{ kod: 'enez-sun', br: 'Enez-Sun', fr: 'île de Sein' }]
	},
	{
		kod: 'gwenedeg', br: 'gwenedeg', br_alt: 'brezhoneg Gwened', fr: 'vannetais', oc: 'vanetés', evesquat_fr: 'Vannes',
		parlars: [
			{ kod: 'groe', br: 'Groe', fr: 'Groix' },
			{ kod: 'ar-gerveur', br: 'Ar Gerveur', fr: 'Belle-Île' },
			{ kod: 'enez-houad', br: 'Enez Houad', fr: 'Houat' },
			{ kod: 'edig', br: 'Edig', fr: 'Hœdic' },
			{ kod: 'enizenach', br: "Enizenac'h", fr: 'Île-aux-Moines' },
			{ kod: 'an-arzh', br: 'An Arzh', fr: "Île-d'Arz" },
			{ kod: 'gwenrann', br: 'brezhoneg Gwenrann', fr: 'breton de Batz, ou guérandais (éteint)', istoric: true }
		]
	}
];
for (const d of dialectes) {
	d.comunas = rows.filter((r) => r.dialecte === d.kod && (r.domeni === 'breton' || r.domeni === 'mixta')).length;
	for (const p of d.parlars) p.comunas = rows.filter((r) => r.parlar === p.kod).length;
}

const transicions = [
	{
		clau: 'Tmixta', kod: 'trans-mixta', domeni: 'mixta',
		fr: 'bande mixte : communes partagées entre breton et gallo en 1886', oc: 'zòna mixta breton / galo',
		entre: ['breton', 'galo'], comunas: per((r) => r.domeni === 'mixta'),
		nota: "communes que la limite de Sébillot (1886) coupe en parts notables (de un tiers à deux tiers) ou où l'on prêchait dans les deux langues : à hachurer"
	},
	{
		clau: 'Tgalo', kod: 'trans-galo', codi_csv: 'galo',
		fr: 'communes bretonnantes au bord de la limite de 1886', oc: 'contacte breton / galo',
		entre: ['breton', 'galo'], comunas: per((r) => r.domeni === 'breton' && r.transicio.split(',').includes('galo')),
		nota: "bretonnantes pour Sébillot, mais la limite les touche ou les entame de quelques villages : couleur pleine, contour éventuel"
	},
	{
		clau: 'Tvesina', kod: 'vesina', domeni: 'vesina',
		fr: 'communes gallèses de la limite (villages ou familles bretonnants en 1886)', oc: 'comunas vesinas',
		entre: ['galo', 'breton'], comunas: per((r) => r.domeni === 'vesina'), defora: true,
		nota: "hors du domaine breton : listées pour mémoire (Sébillot les cite), à ne pas colorier en breton"
	},
	{
		clau: 'Tkg', kod: 'trans-kerneveg-gwenedeg', codi_csv: 'kerneveg-gwenedeg',
		fr: 'cornouaillais teinté de vannetais, ou vannetais aux marges de la Cornouaille', oc: 'transicion cornoalhés / vanetés',
		entre: ['kerneveg', 'gwenedeg'], comunas: per((r) => r.transicio.split(',').includes('kerneveg-gwenedeg')),
		nota: "cantons du Faouët et de Gourin et arrondissement de Quimperlé (Sébillot), Neulliac et Kergrist (évêché de Cornouaille), Mellionnec, Plélauff, Lescouët-Gouarec (évêché de Vannes)"
	},
	{
		clau: 'Tlt', kod: 'trans-leoneg-tregerieg', codi_csv: 'leoneg-tregerieg',
		fr: 'léonard au contact du trégorrois', oc: 'transicion leonés / tregorés',
		entre: ['leoneg', 'tregerieg'], comunas: per((r) => r.transicio.split(',').includes('leoneg-tregerieg')),
		nota: "Morlaix (ville sur les deux évêchés, léonard selon Sébillot) ; Ouessant (Léon, mais parenté avec le trégorrois selon Luzel)"
	},
	{
		clau: 'Tlk', kod: 'trans-leoneg-kerneveg', codi_csv: 'leoneg-kerneveg',
		fr: 'léonard au contact du cornouaillais', oc: 'transicion leonés / cornoalhés',
		entre: ['leoneg', 'kerneveg'], comunas: per((r) => r.transicio.split(',').includes('leoneg-kerneveg')),
		nota: 'Landerneau : deux paroisses de Léon, une de Cornouaille'
	},
	{
		clau: 'Tist', kod: 'istoric', domeni: 'desaparegut',
		fr: 'breton éteint (zone historique)', oc: 'breton escantit',
		entre: ['gwenedeg', 'galo'], comunas: per((r) => r.domeni === 'desaparegut'),
		nota: "Batz-sur-Mer (breton parlé en 1886, éteint dans les années 1960) et communes où le breton est attesté au XIXe siècle (Le Pouliguen, Piriac, Mesquer, Assérac, Saint-Molf, Férel, Camoël, Pénestin) : teinte pâle, comme l'alavais"
	}
];

const out = {
	font: "Breton : domaine de 1886 d'après Paul Sébillot, « La langue bretonne, limites et statistique », Revue d'ethnographie, t. V, 1886 (domaine public) ; dialectes d'après les anciens évêchés (listes de paroisses de la Wikipédia en français, d'après Kerhervé, Roudaut et Tanguy 1978, Courson 1863, Merlet 1951), corrigés par Sébillot ; breton éteint du pays de Guérande d'après la Wikipédia en français (« Breton de Batz-sur-Mer ») ; communes IGN ADMIN EXPRESS COG CARTO 2026 (Licence ouverte 2.0) ; noms bretons : Wikipédia bretonne via Wikidata (CC0), à défaut OpenStreetMap (ODbL)",
	a_validar: "noms occitans absents du Basic (API de lo Congrès, 2026-10-10) : leonés, tregorés, cornoalhés, vanetés, galo ; vérifiés : breton, dialècte, zòna, mixta, contacte, transicion, illa, parlar, comuna et vesina (au pluriel dans « comunas vesinas »), escantit (participe d'escantir), amb, de ; « lo » et « la » : erreur de l'API, non vérifiés. Noms bretons des parlers : titres de la Wikipédia bretonne (Goueloù, Ar Gerveur, Brezhoneg Gwenrann…) ou noms des communes, à relire par un brittophone. Classement des communes : voir SIG/breton/FONTS.md, « À valider »",
	dialectes,
	apart: null,
	transicions
};
fs.writeFileSync(SIG + 'breton/dialectes-breton.json', JSON.stringify(out, null, '\t') + '\n');
console.log(dialectes.map((d) => `${d.kod} ${d.comunas}`).join(', '));
console.log(transicions.map((t) => `${t.clau} ${t.comunas.length}`).join(', '));
