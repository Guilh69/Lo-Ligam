// Prononciation 3 : les consonnes qui sonnent autrement (unités 1 à 6, un
// « son du jour » par module). Prononciations reprises du parcours, choisies
// par Romain. Règles : Gramatica, pages 11 à 15. Précisions de Chabbert
// (2026-11-04) : le s entre « s » et « ch », lh et nh sur les panneaux
// (Graulhet, Milhau : top'Òc), pas de k, w, y pour les mots occitans (le CLO
// les admet pour les mots étrangers, cursus/09) ni de h initial (pages
// 49, 55 et 60). Occitan à relire par Romain.
import { CHABBERT } from '../libres.js';

export default {
	id: 'consonantas',
	capitol: 'sons',
	ordre: 3,
	titol: 'Las consonantas',
	fr: 'Les consonnes',
	resumit: 'v qui sonne « b », j et g « dj », ch « tch », s et z, lh, nh, r roulé, tz, cc, qu.',
	validada: false,
	colors: { b: 'pruna', s: 'oliva', l: 'blau' },
	ecrans: [
		{
			titol: 'V, J, CH',
			blocs: [
				{
					type: 'intro',
					text: 'La plupart des consonnes se disent comme tu les attends. Trois surprises dès le début : **v** sonne « b », **j** sonne « dj », **ch** sonne « tch ».'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'v sonne « b »', gros: 'v', color: 'b', exemples: [['vint', 'BIN'], ['vau', 'BAOU'], ['la vila', 'la BI-lo'], ['lo caval', 'lou ca-BAL']] },
						{ titol: 'j, et g devant e ou i', gros: 'j g', color: 's', exemples: [['jardin', 'djar-DI'], ['dijòus', 'di-DJÒOUS'], ['dimenge', 'di-MÉN-djé'], ['regent', 'ré-DJÉN']] },
						{ titol: 'ch', gros: 'ch', color: 'l', exemples: [['un chic', 'un TCHIK'], ['ochanta', 'ou-TCHAN-to'], ['la frucha', 'la FRU-tcho'], ['a drecha', 'a DRÉ-tcho']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{ type: 'font', pages: 'pages 11 à 14' }
			]
		},
		{
			titol: 'S, SS, Z, Ç',
			blocs: [
				{
					type: 'intro',
					text: 'Entre deux voyelles, un seul **s** sonne « z ». Pour garder le son « s », on double : **ss**. Devant *a*, *o*, *u*, le **ç** sonne « s ».'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le son « s »',
							frasas: [
								{ oc: '*mercés*', fr: 'mér-SÉS' },
								{ oc: '*Carcassona*', fr: 'car-ca-SOU-no' },
								{ oc: '*seissanta*', fr: 'séï-SAN-to' },
								{ oc: '*la plaça*', fr: 'la PLA-ço' }
							]
						},
						{
							titol: 'Le son « z »',
							frasas: [
								{ oc: '*Tolosa*', fr: 'tou-LOU-zo' },
								{ oc: '*francesa*', fr: 'fran-SÉ-zo' },
								{ oc: '*dosena*', fr: 'dou-ZÉ-no' },
								{ oc: '*Besièrs*', fr: 'bé-ZYÈS' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Le *s* occitan se dit avec la pointe de la langue : un son entre le « s » et le « ch » du français, comme en espagnol.'
				},
				{ type: 'font', pages: 'page 14' },
				{ type: 'font', libre: CHABBERT, pages: 'page 55' }
			]
		},
		{
			titol: 'LH, NH, R, RR',
			blocs: [
				{
					type: 'intro',
					text: 'Deux lettres pour un seul son : **lh** sonne « ly », **nh** sonne « gn ». Le **r** se roule, et **rr** encore plus fort.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'lh', gros: 'lh', color: 'b', exemples: [['la familha', 'la fa-MI-lyo'], ['Montpelhièr', 'moun-pé-LYÈ'], ['d’alh', 'DAL (à la fin, « l »)']] },
						{ titol: 'nh', gros: 'nh', color: 's', exemples: [['espanhòl', 'es-pa-GNÒL'], ['espanhòla', 'es-pa-GNÒ-lo']] },
						{ titol: 'r roulé', gros: 'r rr', color: 'l', exemples: [['carrièra', 'ca-RRYÈ-ro'], ['esquèrra', 'es-KÈ-rro'], ['sòrre', 'SÒ-rré']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{ type: 'nota', text: 'Tu les vois encore sur les panneaux : *Graulhet*, *Milhau* (Millau).' },
				{ type: 'font', pages: 'pages 13 à 15' },
				{ type: 'font', libre: CHABBERT, pages: 'page 49' }
			]
		},
		{
			titol: 'TZ, CC, QU',
			blocs: [
				{
					type: 'intro',
					text: '**tz** et **cc** sonnent « ts ». **qu** sonne « k », sans « ou ». Et la fin **-cion** se dit « -SYOU ».'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le son « ts »',
							frasas: [
								{ oc: '*parlatz*', fr: 'par-LATS' },
								{ oc: '*Adieu-siatz*', fr: 'a-di-SSIATS' },
								{ oc: '*occitan*', fr: 'ou-tsi-TA' }
							]
						},
						{
							titol: 'Le son « k », la fin -cion',
							frasas: [
								{ oc: '*aquò*', fr: 'a-KÒ' },
								{ oc: '*quatre*', fr: 'KA-tré' },
								{ oc: '*l’addicion*', fr: 'la-di-SYOU' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Pour ses propres mots, l’occitan n’emploie ni *k*, ni *w*, ni *y* : le son « k » s’écrit *c* ou *qu*. Pas de *ph* non plus (*fotografia*), ni de *h* au début d’un mot : *ièr* (hier), *èrba* (herbe).'
				},
				{ type: 'font', pages: 'pages 11, 13 et 14' },
				{ type: 'font', libre: CHABBERT, pages: 'page 60' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'vint', fr: 'vingt', forma: 'BIN|:b', sens: 'vint', indici: 'v sonne « b »' },
						{ oc: 'jardin', fr: 'jardin', forma: 'djar-DI|:s', sens: 'jardin', indici: 'j sonne « dj »' },
						{ oc: 'ochanta', fr: 'quatre-vingts', forma: 'ou-TCHAN-to|:l', sens: 'ochanta', indici: 'ch sonne « tch »' },
						{ oc: 'francesa', fr: 'française', forma: 'fran-SÉ-zo|:s', sens: 'francesa', indici: 'un s entre deux voyelles sonne « z »' },
						{ oc: 'la familha', fr: 'la famille', forma: 'la fa-MI-lyo|:b', sens: 'la familha', indici: 'lh sonne « ly »' },
						{ oc: 'parlatz', fr: 'vous parlez', forma: 'par-LATS|:l', sens: 'parlatz', indici: 'tz sonne « ts »' }
					],
					mescla: ['la fa-MI-lyo', 'par-LATS', 'BIN', 'fran-SÉ-zo', 'ou-TCHAN-to', 'djar-DI'],
					bravo: 'Six sur six. Tu lis les consonnes comme on les dit.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**v** « b » ; **j**, **g** devant *e* ou *i* « dj » ; **ch** « tch » ; **s** entre voyelles « z », **ss** « s » ; **lh** « ly », **nh** « gn » ; **tz**, **cc** « ts » ; **qu** « k ».'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 3.1 te fait entendre le v qui sonne « b »](/aprene/modul/3-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'Les règles',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 11 à 15.'
		},
		{ de: 'Des précisions', text: '_Lire & écrire l’Occitan_, Raymond Chabbert, pages 49, 55 et 60.' },
		{ de: 'Les noms de lieux', text: 'vérifiés avec top’Òc (lo Congrès).' },
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
