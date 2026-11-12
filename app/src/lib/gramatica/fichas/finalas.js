// Prononciation 4 : la fin des mots et les liaisons (unités 1 à 6). Toutes
// les prononciations sont celles du parcours, choisies par Romain (caud
// « CAOUT » : choix du 2026-11-02). Règles : Gramatica, pages 11 à 14.
// Précisions de Chabbert (2026-11-04) : voyelle jamais nasale devant un n
// qui se dit, lh et nh finals « l » et « n », lach ou lait (pages 50, 52,
// 53 et 59). Occitan à relire par Romain.
import { CHABBERT } from '../libres.js';

export default {
	id: 'finalas',
	capitol: 'sons',
	ordre: 4,
	titol: 'La fin dels mots',
	fr: 'La fin des mots',
	resumit: 'Les lettres finales qui se taisent, celles qui sonnent, celles qui changent, et les liaisons.',
	validada: true,
	colors: { tais: 'pruna', son: 'oliva', cambia: 'blau' },
	ecrans: [
		{
			titol: 'Las letras mudas',
			blocs: [
				{
					type: 'intro',
					text: 'À la fin d’un mot, certaines consonnes **se taisent**. Ce sont presque toujours les mêmes.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'le r des verbes et des métiers', gros: '-r', color: 'tais', exemples: [['cantar', 'can-TA'], ['anar', 'a-NA'], ['cosinièr', 'cou-zi-NYÈ'], ['fornièr', 'four-NYÈ']] },
						{ titol: 'le n', gros: '-n', color: 'tais', exemples: [['lo can', 'lou CA'], ['lo pan', 'lou PA'], ['deman', 'dé-MA'], ['jardin', 'djar-DI']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{
					type: 'nota',
					text: 'Au féminin, une voyelle suit, et la lettre revient : *cosinièr* « cou-zi-NYÈ », *cosinièra* « cou-zi-NYÈ-ro ». Le *t* après un *n* se tait aussi : tu le verras avec les suites de consonnes.'
				},
				{ type: 'font', pages: 'pages 12 et 13' }
			]
		},
		{
			titol: 'Las letras que sonan',
			blocs: [
				{
					type: 'intro',
					text: 'D’autres finales **se disent toujours**. Et le *r* comme le *n* reviennent dans quelques cas bien précis.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'le t après une voyelle', gros: '-t', color: 'son', exemples: [['Encantat', 'én-can-TAT'], ['al costat', 'al cous-TAT'], ['set', 'SÉT']] },
						{ titol: 'le s', gros: '-s', color: 'son', exemples: [['ans', 'ANS'], ['dos', 'DOUS'], ['las pomas', 'las POU-mos']] },
						{ titol: 'le l', gros: '-l', color: 'son', exemples: [['l’ostal', 'lous-TAL'], ['lo caval', 'lou ca-BAL'], ['l’aucèl', 'laou-SÈL']] },
						{ titol: 'le r d’un mot court', gros: 'ser', color: 'son', exemples: [['Bon ser', 'bou(n) SÉR'], ['car', 'CAR']] },
						{ titol: 'le n de « ils, elles »', gros: '-an -on', color: 'son', exemples: [['parlan', 'PAR-lon'], ['dison', 'DI-zoun']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{
					type: 'nota',
					text: 'Quand le *n* se dit, la voyelle devant lui garde son son : elle ne change pas comme en français dans « parent » ou « ancien ». *vint* « BIN » : un « i », puis un « n ».'
				},
				{ type: 'font', pages: 'pages 12 à 14' },
				{ type: 'font', libre: CHABBERT, pages: 'pages 52 et 53' }
			]
		},
		{
			titol: 'Las letras que cambian',
			blocs: [
				{
					type: 'intro',
					text: 'Quelques finales **changent de son** : on les écrit d’une façon, on les dit d’une autre.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'd sonne « t »', gros: 'd › t', color: 'cambia', exemples: [['fa caud', 'fa CAOUT'], ['verd', 'BÉRT']] },
						{ titol: 'ch et g sonnent « tch »', gros: 'ch g', color: 'cambia', exemples: [['lo lach', 'lou LATCH'], ['tot drech', 'tout DRÉTCH'], ['fa freg', 'fa FRÉTCH'], ['uèch', 'UÈTCH']] },
						{ titol: 'm sonne « n »', gros: 'm › n', color: 'cambia', exemples: [['parlam', 'par-LAN'], ['jogam', 'djou-GAN']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{ type: 'nota', text: 'À la fin, *lh* sonne « l » et *nh* sonne « n » : *solelh* « sou-LÉL ».' },
				{
					type: 'nota',
					text: 'Vers Toulouse et le Lauragais, *ch* devient *it* ou *t* : *lach* ou *lait*, *nuèch* ou *nuèit*. Les deux formes s’écrivent, et les deux sont justes.'
				},
				{ type: 'font', pages: 'pages 11 à 14' },
				{ type: 'font', libre: CHABBERT, pages: 'pages 50 et 59' }
			]
		},
		{
			titol: 'D’un mot a l’autre',
			blocs: [
				{
					type: 'intro',
					text: 'Quand le mot suivant commence par une voyelle, la consonne finale **s’accroche** à lui : c’est la liaison. Le *s* y sonne « z ».'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 's devient « z »',
							frasas: [
								{ oc: '*las olivas*', fr: 'la-zou-LI-bos' },
								{ oc: '*tres oras*', fr: 'TRÉ-zou-ros' },
								{ oc: '*los amics*', fr: 'lou-za-MITS' }
							]
						},
						{
							titol: 'tz devient « dz », c reste « k »',
							frasas: [
								{ oc: '*dètz oras*', fr: 'DÈ-dzou-ros' },
								{ oc: '*cinc oras*', fr: 'SIN-kou-ros' },
								{ oc: '*uèch oras*', fr: 'UÈ-tchou-ros' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 14' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. Regarde la dernière lettre, et la suivante. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'cantar', fr: 'chanter', forma: 'can-TA|:tais', sens: 'cantar', indici: 'le r des verbes se tait' },
						{ oc: 'lo pan', fr: 'le pain', forma: 'lou PA|:tais', sens: 'lo pan', indici: 'le n final se tait' },
						{ oc: 'Encantat', fr: 'enchanté', forma: 'én-can-TAT|:son', sens: 'Encantat', indici: 'le t après une voyelle se dit' },
						{ oc: 'fa caud', fr: 'il fait chaud', forma: 'fa CAOUT|:cambia', sens: 'fa caud', indici: 'le d final sonne « t »' },
						{ oc: 'parlam', fr: 'nous parlons', forma: 'par-LAN|:cambia', sens: 'parlam', indici: 'le m final sonne « n »' },
						{ oc: 'tres oras', fr: 'trois heures', forma: 'TRÉ-zou-ros|:son', sens: 'tres oras', indici: 'liaison : le s sonne « z »' }
					],
					mescla: ['par-LAN', 'lou PA', 'TRÉ-zou-ros', 'can-TA', 'fa CAOUT', 'én-can-TAT'],
					bravo: 'Six sur six. Tu entends déjà la musique de la phrase.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Se taisent : le **r** des verbes et des métiers, le **n**. Se disent : le **t** après une voyelle, le **s**, le **l**. Changent : **d** « t », **m** « n », **ch** et **g** « tch ». Liaison : le **s** sonne « z ».'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 4.2 t’apprend le r final qui se tait](/aprene/modul/4-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'Les règles',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 11 à 14.'
		},
		{ de: 'Des précisions', text: '_Lire & écrire l’Occitan_, Raymond Chabbert, pages 50, 52, 53 et 59.' },
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
