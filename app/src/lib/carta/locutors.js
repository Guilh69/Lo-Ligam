// La lecture « Uèi » de la carte (Romain, 2026-10-22, cahier §11) : la part de
// locuteurs de l'occitan par département, enquête sociolinguistique de l'OPLO
// (2020, 8 000 personnes de 15 ans et plus, 22 départements + Val d'Aran).
// Recopié de SIG/oplo-2020/locutors-2020.csv (validé par Romain le 22-10 ; la
// notice LEGIR-ME.md donne les pages du rapport) : le corriger là d'abord.
// Là où aucune enquête n'existe, rien n'est indiqué (décision de Romain,
// 2026-10-23) ; les Pyrénées-Orientales occitanes ont une enquête mais pas de
// taux de locuteurs publié (effectifs trop faibles) : rien non plus.
// Occitan vérifié par l'API de lo Congrès (departament, enquèsta, locutor,
// comprenon, declaran…) ; « uèi » validé par Romain (2026-10-23).

export const FONT_LOCUTORS = {
	url: 'https://www.ofici-occitan.eu/wp-content/uploads/2020/09/OPLO_Enquete-sociolingusitique-occitan-2020_Resultats.pdf',
	oc: 'Enquèsta de l’OPLO (2020)',
	fr: 'Enquête sociolinguistique de l’OPLO (2020)'
};

// code → [locuteurs %, comprennent parfaitement ou facilement %, note]
export const LOCUTORS = {
	'09': [11, 21],
	11: [11, 21],
	12: [18, 30],
	16: [15, 38, 'part'],
	19: [11, 23],
	23: [11, 28],
	24: [9, 19],
	30: [5, 10],
	31: [3, 8],
	32: [8, 16],
	33: [2, 6],
	34: [4, 9],
	40: [12, 20],
	46: [12, 23],
	47: [4, 14],
	48: [22, 36],
	64: [12, 17, 'part'],
	65: [11, 18],
	81: [14, 28],
	82: [8, 16],
	87: [9, 22],
	ARAN: [62, 73]
};

// Cinq classes, du plus clair (peu de locuteurs) au plus foncé, dans tous les
// thèmes (Romain, 23-10 : avec une transparence, en sombre, les départements
// les plus sombres semblaient les plus parlants) ; en bleu pour le daltonisme
export const CLASSAS = [0, 5, 10, 15, 20];
const GAMAS = {
	color: ['#f3cfc8', '#e3978c', '#cf5f52', '#ad3030', '#7a1420'],
	dalt: ['#d4e4f2', '#9cc3e0', '#5f9dcc', '#2f6fae', '#0d3f7a']
};
export const gamaLocutors = (dalt) => (dalt ? GAMAS.dalt : GAMAS.color);
// (un peu de transparence : le relief et les rivières restent visibles)
export const alfaLocutors = (clar) => (clar ? 0.72 : 0.82);
export const classaDe = (pct) => CLASSAS.findLastIndex((m) => pct >= m);

const TX = {
	oc: {
		sota: (l, c) => `${l} % de locutors · ${c} % comprenon`,
		part: 'partida occitana sonque',
		def: 'Part de las personas de 15 ans e mai que declaran parlar occitan sens dificultat o pro per una conversacion simpla.'
	},
	fr: {
		sota: (l, c) => `${l} % de locuteurs · ${c} % comprennent`,
		part: 'partie occitane seulement',
		def: 'Part des personnes de 15 ans et plus qui déclarent parler occitan sans difficulté ou suffisamment pour tenir une conversation simple.'
	}
};

/** L'encadré du survol (ou du toucher) d'un département. */
export function infoLocutors(code, nom_oc, nom_fr) {
	const d = LOCUTORS[code];
	if (!d) return null;
	const [l, c, nota] = d;
	const linha = (g) => TX[g].sota(l, c) + (nota ? ` (${TX[g].part})` : '');
	return {
		kod: 'loc-' + code,
		oc: nom_oc,
		fr: nom_fr,
		sota_oc: linha('oc'),
		sota_fr: linha('fr'),
		encadrat: { oc: `${FONT_LOCUTORS.oc} : ${TX.oc.def}`, fr: `${FONT_LOCUTORS.fr} : ${TX.fr.def}` },
		mix: true
	};
}
