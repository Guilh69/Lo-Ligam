// Les sons et la syllabe forte (unité 1). Les prononciations sont celles
// des « sons du jour » du parcours (modules 0.1 à 6.3), déjà choisies par
// Romain : usage vivant, pas de comparaison avec le français standard.
// Règle de l'accent écrit : Gramatica, page 22. Occitan à relire par Romain.
export default {
	id: 'sons',
	capitol: 'sons',
	titol: 'Los sons e l’accent',
	fr: 'Les sons et l’accent écrit',
	resumit: 'Les lettres qui sonnent autrement, la fin des mots, la syllabe où la voix appuie.',
	validada: false,
	colors: { a: 'pruna', o: 'oliva', nh: 'blau', v: 'pruna', fin: 'oliva' },
	ecrans: [
		{
			titol: 'Los sons',
			blocs: [
				{
					type: 'intro',
					text: 'L’occitan s’écrit presque comme il se prononce. Quelques lettres ont **leur son à elles** : une fois connues, tu peux lire à voix haute n’importe quel mot.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'à la fin du mot', gros: '-a', color: 'a', exemples: [['plaç|a', 'la PLA-ço'], ['Tolos|a', 'tou-LOU-zo'], ['familh|a', 'fa-MI-lyo'], ['pom|as', 'las POU-mos']] },
						{ titol: 'sans ou avec accent', gros: 'o ò', color: 'o', exemples: [['Tolosa', 'tou-LOU-zo'], ['ora', 'OU-ro'], ['demòri', 'dé-MÒ-ri'], ['òc', 'OK']] },
						{ titol: 'deux lettres, un son', gros: 'nh lh', color: 'nh', exemples: [['espanhòl', 'es-pa-GNÒL'], ['Montpelhièr', 'moun-pé-LYÈ'], ['familha', 'fa-MI-lyo'], ['lo filh', 'lou FIL']] },
						{ titol: 'consonnes', gros: 'v j', color: 'v', exemples: [['vint', 'BIN'], ['vau', 'BAOU'], ['dijòus', 'di-DJÒOUS'], ['dimenge', 'di-MÉN-djé']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte : chaque mot, et comment il sonne.' },
				{
					type: 'nota',
					text: 'Le *a* final sonne « o » seulement quand la voix n’appuie pas dessus : *va plan* se dit « ba PLA ». Le *g* devant *e* ou *i* sonne « dj », comme le *j*.'
				},
				{ type: 'font', pages: 'pages 9 à 21' }
			]
		},
		{
			titol: 'La fin dels mots',
			blocs: [
				{
					type: 'intro',
					text: 'À la fin d’un mot, certaines consonnes **se taisent**. D’autres se disent, même en finale.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Elle se tait',
							frasas: [
								{ oc: '*cantar*', fr: 'can-TA : le r final se tait' },
								{ oc: '*can*', fr: 'CA : le n final s’efface' },
								{ oc: '*vint*', fr: 'BIN : après un n, le t se tait' }
							]
						},
						{
							titol: 'Elle se dit',
							frasas: [
								{ oc: '*Bon ser*', fr: 'bou(n) SÉR : un mot d’une syllabe garde son r' },
								{ oc: '*ans*', fr: 'ANS : le s final se dit' },
								{ oc: '*Encantat*', fr: 'én-can-TAT' }
							]
						}
					]
				},
				{ type: 'font', pages: 'pages 11 à 21' }
			]
		},
		{
			titol: 'La sillaba fòrta',
			blocs: [
				{
					type: 'intro',
					text: 'Dans chaque mot, la voix appuie sur **une syllabe**. Pas besoin de l’apprendre mot par mot : la fin du mot te dit où elle est.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une voyelle, un -s ou un -n à la fin : la voix appuie avant',
							frasas: [
								{ oc: '*Tolosa*', fr: 'tou-LOU-zo' },
								{ oc: '*parlas*', fr: 'PAR-los' },
								{ oc: '*dison*', fr: 'DI-zoun' }
							]
						},
						{
							titol: 'Une autre consonne à la fin : la voix appuie sur la fin',
							frasas: [
								{ oc: '*Encantat*', fr: 'én-can-TAT' },
								{ oc: '*cantar*', fr: 'can-TA' },
								{ oc: '*parlam*', fr: 'par-LAN' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Quand un mot ne suit pas la règle, un **accent écrit** le dit : *apèli* « a-PÈ-li », *demòri* « dé-MÒ-ri ». Un *è* ou un *ò* est toujours sur la syllabe forte.'
				},
				{ type: 'font', pages: 'page 22' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. Regarde la fin du mot, les accents, les lettres doubles. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'Tolosa', fr: 'Toulouse', forma: 'tou-LOU-zo|:o', sens: 'Toulouse', indici: 'le o sans accent sonne « ou », le a final « o »' },
						{ oc: 'parlas', fr: 'tu parles', forma: 'PAR-los|:a', sens: 'tu parles', indici: 'un -s à la fin : la voix appuie avant' },
						{ oc: 'parlam', fr: 'nous parlons', forma: 'par-LAN|:fin', sens: 'nous parlons', indici: 'un -m à la fin : la voix appuie sur la fin, et le m sonne « n »' },
						{ oc: 'cantar', fr: 'chanter', forma: 'can-TA|:fin', sens: 'chanter', indici: 'le r final se tait' },
						{ oc: 'demòri', fr: 'j’habite', forma: 'dé-MÒ-ri|:o', sens: 'j’habite', indici: 'l’accent écrit montre la syllabe forte' },
						{ oc: 'la familha', fr: 'la famille', forma: 'la fa-MI-lyo|:nh', sens: 'la famille', indici: 'lh sonne « ly »' }
					],
					mescla: ['can-TA', 'la fa-MI-lyo', 'PAR-los', 'dé-MÒ-ri', 'tou-LOU-zo', 'par-LAN'],
					bravo: 'Six sur six. Tu sais lire l’occitan à voix haute.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Retiens trois choses : le **a** final sonne « o », le **o** sans accent sonne « ou », et la **fin du mot** dit où la voix appuie.'
				},
				{
					type: 'indic',
					text: 'Tu entendras d’autres façons de dire : l’occitan change d’un pays à l’autre. Ici, on suit le languedocien du cours.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 1.2 t’apprend la syllabe forte](/aprene/modul/1-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'Les règles',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 9 à 22.'
		},
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
