// Les démonstratifs (pour aller plus loin). Formes du languedocien courant,
// mots du parcours. Règle : Gramatica, pages 46 et 47. Occitan à relire par
// Romain.
export default {
	id: 'demonstratius',
	capitol: 'demonstratius',
	titol: 'Los demonstratius',
	fr: 'Les démonstratifs',
	resumit: 'Aqueste, aquel, aquò : montrer ce qui est près ou plus loin, et désigner une chose sans la nommer.',
	validada: false,
	colors: { pres: 'oliva', luenh: 'pruna', neutre: 'blau' },
	ecrans: [
		{
			titol: 'Aqueste o aquel ?',
			blocs: [
				{
					type: 'intro',
					text: 'Pour montrer, l’occitan dit la distance : **aqueste** pour ce qui est **près**, **aquel** pour ce qui est **plus loin**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Près de moi',
							frasas: [
								{ oc: '**Aqueste** ostal es grand.', fr: 'cette maison-ci est grande' },
								{ oc: '**Aquesta** taula es nòva.', fr: 'cette table-ci est neuve' }
							]
						},
						{
							titol: 'Plus loin',
							frasas: [
								{ oc: '**Aquel** can es negre.', fr: 'ce chien-là est noir' },
								{ oc: '**Aquela** carrièra es longa.', fr: 'cette rue-là est longue' }
							]
						}
					]
				},
				{ type: 'font', pages: 'pages 46 et 47' }
			]
		},
		{
			titol: 'Las formas',
			blocs: [
				{
					type: 'intro',
					text: 'Comme l’adjectif, le démonstratif prend la marque du **féminin** et du **pluriel**.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'près', gros: 'aqueste', color: 'pres', exemples: [['aquest|e ostal', 'cette maison-ci'], ['aquest|a taula', 'cette table-ci'], ['aquest|es amics', 'ces amis-ci'], ['aquest|as pomas', 'ces pommes-ci']] },
						{ titol: 'plus loin', gros: 'aquel', color: 'luenh', exemples: [['aquel can', 'ce chien-là'], ['aquel|a carrièra', 'cette rue-là'], ['aquel|es legums', 'ces légumes-là'], ['aquel|as olivas', 'ces olives-là']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les quatre formes.' },
				{ type: 'nota', text: 'Dans les livres, tu croiseras aussi *aiceste*, *aicesta* : tout près de celui qui parle.' },
				{ type: 'font', pages: 'page 46' }
			]
		},
		{
			titol: 'Aquò, aiçò',
			blocs: [
				{
					type: 'intro',
					text: 'Pour désigner une chose **sans la nommer** : **aquò** (cela, ça) et **aiçò** (ceci). Ces deux mots ne changent jamais.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une chose',
							frasas: [
								{ oc: '**Aquò** es vertat.', fr: 'c’est vrai' },
								{ oc: '**Aiçò** es per tu.', fr: 'ceci est pour toi' }
							]
						},
						{
							titol: 'Celui, celle',
							frasas: [
								{ oc: '**Lo** de ton fraire', fr: 'celui de ton frère' },
								{ oc: '**La** que vesi', fr: 'celle que je vois' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Devant *de* ou *que*, pas besoin de démonstratif : *lo*, *la*, *los*, *las* suffisent.' },
				{ type: 'font', pages: 'page 47' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque démonstratif en face de ce qu’il montre. Près ou loin, masculin ou féminin. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ostal, près', fr: 'cette maison-ci', forma: 'aquest|e:pres', sens: 'aqueste ostal', indici: 'près, masculin : aqueste' },
						{ oc: 'taula, près', fr: 'cette table-ci', forma: 'aquest|a:pres', sens: 'aquesta taula', indici: 'près, féminin : aquesta' },
						{ oc: 'can, plus loin', fr: 'ce chien-là', forma: '|aquel:luenh', sens: 'aquel can', indici: 'plus loin, masculin : aquel' },
						{ oc: 'carrièra, plus loin', fr: 'cette rue-là', forma: 'aquel|a:luenh', sens: 'aquela carrièra', indici: 'plus loin, féminin : aquela' },
						{ oc: 'olivas, plus loin', fr: 'ces olives-là', forma: 'aquel|as:luenh', sens: 'aquelas olivas', indici: 'plus loin, féminin pluriel : aquelas' },
						{ oc: 'une chose, sans la nommer', fr: 'cela, ça', forma: '|aquò:neutre', sens: 'Aquò es vertat.', indici: 'le mot qui ne change jamais' }
					],
					mescla: ['aquelas', 'aquò', 'aqueste', 'aquel', 'aquesta', 'aquela'],
					bravo: 'Six sur six. Tu montres du doigt en occitan.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Près** : *aqueste, aquesta, aquestes, aquestas*. **Plus loin** : *aquel, aquela, aqueles, aquelas*. **Sans nommer** : *aquò*, *aiçò*.'
				},
				{ type: 'seguida', text: 'Voir aussi : [les possessifs](/apren/gramatica/possessius), qui se placent eux aussi devant le nom.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 46 et 47.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, vérifiés avec lo Congrès.' }
	]
};
