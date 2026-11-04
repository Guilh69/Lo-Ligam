// Prononciation 2 : la syllabe forte et l'accent écrit (unité 1, revue en
// 4.1 et 8.2). Les prononciations sont celles des « sons du jour » du
// parcours, déjà choisies par Romain : usage vivant, pas de comparaison avec
// le français standard. Règle : Gramatica, page 22. Occitan à relire par Romain.
export default {
	id: 'sons',
	capitol: 'sons',
	ordre: 2,
	titol: 'La sillaba fòrta e l’accent',
	fr: 'La syllabe forte et l’accent écrit',
	resumit: 'La fin du mot dit où la voix appuie ; l’accent écrit signale les exceptions.',
	validada: false,
	colors: { avant: 'pruna', fin: 'oliva', accent: 'blau' },
	ecrans: [
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
					text: 'Dans les prononciations du site, la syllabe forte est en CAPITALES. Le *-a* final, où la voix n’appuie jamais, sonne alors « o ».'
				},
				{ type: 'font', pages: 'page 22' }
			]
		},
		{
			titol: 'Las terminasons',
			blocs: [
				{
					type: 'intro',
					text: 'La règle marche aussi pour les verbes : avec *nosautres* et *vosautres*, la voix appuie **sur la terminaison** ; avec les autres personnes, **avant**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'La voix appuie avant',
							frasas: [
								{ oc: 'tu *parlas*', fr: 'PAR-los' },
								{ oc: 'tu *prenes*', fr: 'PRÉ-nés' },
								{ oc: 'ils *parlan*', fr: 'PAR-lon' }
							]
						},
						{
							titol: 'La voix appuie sur la fin',
							frasas: [
								{ oc: 'nosautres *parlam*', fr: 'par-LAN' },
								{ oc: 'vosautres *parlatz*', fr: 'par-LATS' },
								{ oc: 'vosautres *anatz*', fr: 'a-NATS' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Le *-n* de *parlan* ne déplace pas la voix : c’est un *-n* de verbe, comme le *-s* d’un pluriel.' },
				{ type: 'font', pages: 'page 22' }
			]
		},
		{
			titol: 'L’accent escrich',
			blocs: [
				{
					type: 'intro',
					text: 'Quand un mot ne suit pas la règle, un **accent écrit** le dit. La voix appuie sur la voyelle qui le porte.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'à la fin malgré le -s', gros: 'é', color: 'accent', exemples: [['mercés', 'mér-SÉS'], ['francés', 'fran-SÉS']] },
						{ titol: 'avant la fin', gros: 'è', color: 'accent', exemples: [['apèli', 'a-PÈ-li'], ['cafè', 'ca-FÈ'], ['apèlas', 'a-PÈ-los']] },
						{ titol: 'avant la fin', gros: 'ò', color: 'accent', exemples: [['demòri', 'dé-MÒ-ri'], ['pòdi', 'PÒ-di'], ['vòli', 'BÒ-li']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{
					type: 'nota',
					text: 'Un *è* ou un *ò* est **toujours** sur la syllabe forte. Et un mot d’une seule syllabe n’a pas besoin d’accent pour ça.'
				},
				{ type: 'font', pages: 'page 22' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. Regarde la fin du mot, et les accents. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'Tolosa', fr: 'Toulouse', forma: 'tou-LOU-zo|:avant', sens: 'Tolosa', indici: 'une voyelle à la fin : la voix appuie avant' },
						{ oc: 'parlas', fr: 'tu parles', forma: 'PAR-los|:avant', sens: 'parlas', indici: 'un -s à la fin : la voix appuie avant' },
						{ oc: 'parlam', fr: 'nous parlons', forma: 'par-LAN|:fin', sens: 'parlam', indici: 'un -m à la fin : la voix appuie sur la fin' },
						{ oc: 'cantar', fr: 'chanter', forma: 'can-TA|:fin', sens: 'cantar', indici: 'un -r à la fin : la voix appuie sur la fin' },
						{ oc: 'demòri', fr: 'j’habite', forma: 'dé-MÒ-ri|:accent', sens: 'demòri', indici: 'l’accent écrit montre la syllabe forte' },
						{ oc: 'mercés', fr: 'merci', forma: 'mér-SÉS|:accent', sens: 'mercés', indici: 'l’accent écrit tire la voix vers la fin' }
					],
					mescla: ['can-TA', 'mér-SÉS', 'PAR-los', 'dé-MÒ-ri', 'tou-LOU-zo', 'par-LAN'],
					bravo: 'Six sur six. Tu sais où poser la voix.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Voyelle, **-s** ou **-n** à la fin : la voix appuie **avant**. Autre consonne : **sur la fin**. Un accent écrit : **là où il est**.'
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
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 22.'
		},
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
