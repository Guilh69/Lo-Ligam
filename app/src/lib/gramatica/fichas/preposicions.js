// Les prépositions (unité 1, puis tout l'A1). Phrases reprises du parcours
// (modules 1.3, 3.2, 5.4, 6.2…). Règle : Gramatica, page 62. Occitan à
// relire par Romain.
export default {
	id: 'preposicions',
	capitol: 'preposicions',
	titol: 'Las preposicions',
	fr: 'Les prépositions',
	resumit: 'Les petits mots qui relient : a, de, dins, amb, per, et leurs formes al et del.',
	validada: true,
	colors: { a: 'pruna', de: 'oliva', dins: 'blau', amb: 'pruna', per: 'oliva' },
	ecrans: [
		{
			titol: 'Las preposicions',
			blocs: [
				{
					type: 'intro',
					text: 'Une **préposition** est un petit mot qui relie les mots entre eux. Elle dit où, d’où, avec qui, pour qui.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'où l’on est, où l’on va', gros: 'a', color: 'a', exemples: [['Demòri a Tolosa.', 'j’habite à Toulouse'], ['Benvenguda a Tolosa !', 'bienvenue à Toulouse !'], ['A deman !', 'à demain !']] },
						{ titol: 'd’où, de qui', gros: 'de', color: 'de', exemples: [['Soi de Nimes.', 'je suis de Nîmes'], ['un suc de frucha', 'un jus de fruit'], ['la sala de banh', 'la salle de bain']] },
						{ titol: 'dedans', gros: 'dins', color: 'dins', exemples: [['dins un apartament', 'dans un appartement'], ['dins lo jardin', 'dans le jardin'], ['Qué fas dins la vida ?', 'que fais-tu dans la vie ?']] },
						{ titol: 'avec', gros: 'amb', color: 'amb', exemples: [['Demòri amb dos amics.', 'j’habite avec deux amis'], ['Dinni amb ma sòrre.', 'je déjeune avec ma sœur']] },
						{ titol: 'pour', gros: 'per', color: 'per', exemples: [['Per ieu, un cafè.', 'pour moi, un café'], ['Per ela, un suc de frucha.', 'pour elle, un jus de fruit']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des phrases du parcours.' },
				{ type: 'font', pages: 'page 62' }
			]
		},
		{
			titol: 'Al e del',
			blocs: [
				{
					type: 'intro',
					text: 'Devant *lo* (le), *a* et *de* se soudent à l’article : **a + lo = al**, **de + lo = del**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'a + lo = al',
							frasas: [
								{ oc: 'Vau [a|l:a] trabalh.', fr: 'je vais au travail' },
								{ oc: '[A|l:a] còp que ven !', fr: 'à la prochaine !' }
							]
						},
						{
							titol: 'de + lo = del',
							frasas: [
								{ oc: 'lo mètge [de|l:de] vilatge', fr: 'le médecin du village' },
								{ oc: 'Es la lenga [de|l:de] país.', fr: 'c’est la langue du pays' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Devant *la*, rien ne se soude : *a la plaça*, *de la sala*. Au pluriel, *a + los = als*, *de + los = dels*.'
				},
				{ type: 'font', pages: 'pages 23 et 62' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque petit mot dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Petits mots à placer',
					linhas: [
						{ oc: 'Demòri … Tolosa.', fr: 'j’habite à Toulouse', forma: '|a:a', sens: 'Demòri a Tolosa.', indici: 'devant une ville où l’on habite : a' },
						{ oc: 'Soi … Nimes.', fr: 'je suis de Nîmes', forma: '|de:de', sens: 'Soi de Nimes.', indici: 'd’où l’on vient : de' },
						{ oc: 'Demòri … un apartament.', fr: 'j’habite dans un appartement', forma: '|dins:dins', sens: 'Demòri dins un apartament.', indici: 'dedans : dins' },
						{ oc: 'Dinni … ma sòrre.', fr: 'je déjeune avec ma sœur', forma: '|amb:amb', sens: 'Dinni amb ma sòrre.', indici: 'avec : amb' },
						{ oc: 'Un cafè … ieu, se vos plai.', fr: 'un café pour moi, s’il vous plaît', forma: '|per:per', sens: 'Un cafè per ieu, se vos plai.', indici: 'pour : per' },
						{ oc: 'Vau … trabalh.', fr: 'je vais au travail', forma: '|al:a', sens: 'Vau al trabalh.', indici: 'a + lo se soudent' }
					],
					mescla: ['dins', 'al', 'per', 'a', 'amb', 'de'],
					bravo: 'Six sur six. Ces petits mots reviennent dans presque toutes les phrases.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**a** : où l’on est, où l’on va. **de** : d’où, de qui. **dins** : dedans. **amb** : avec. **per** : pour. Devant *lo* : **al**, **del**.'
				},
				{
					type: 'indic',
					text: 'Il y en a bien d’autres : *davant* (devant), *darrièr* (derrière), *prèp* (près)… Tu les rencontreras dans le parcours.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 1.3 te fait dire d’où tu es](/aprene/modul/1-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 23 et 62.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 1 à 6.' }
	]
};
