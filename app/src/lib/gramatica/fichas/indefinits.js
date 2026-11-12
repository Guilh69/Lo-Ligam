// Les indéfinis : quelque chose, rien, tout, chaque, un peu, beaucoup,
// « on » (unité 5, puis A2). Phrases reprises du parcours (modules 1.1,
// 2.3, 5.1, 5.3). Règle : Gramatica, pages 51 à 53. Occitan à relire par
// Romain.
export default {
	id: 'indefinits',
	capitol: 'indefinits',
	titol: 'Los indefinits',
	fr: 'Les indéfinis',
	resumit: 'Quicòm, res, tot, cada ; un pauc, fòrça, tròp ; et les façons de dire « on ».',
	validada: true,
	colors: { q: 'pruna', n: 'oliva', o: 'blau' },
	ecrans: [
		{
			titol: 'Quicòm, res, tot',
			blocs: [
				{
					type: 'intro',
					text: 'Les **indéfinis** parlent des choses et des gens sans les nommer : quelque chose, rien, tout, chaque.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'quelque chose', gros: 'quicòm', color: 'q', exemples: [['Quicòm mai ?', 'autre chose ?']] },
						{ titol: 'rien', gros: 'res', color: 'n', exemples: [['De res !', 'de rien !'], ['Non i a res.', 'il n’y a rien']] },
						{ titol: 'tout', gros: 'tot', color: 'o', exemples: [['Es tot.', 'c’est tout'], ['tot lo mond', 'tout le monde'], ['totas las setmanas', 'toutes les semaines']] },
						{ titol: 'chaque', gros: 'cada', color: 'q', exemples: [['cada jorn', 'chaque jour'], ['cada dimenge', 'chaque dimanche']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{
					type: 'nota',
					text: '*Tot* s’accorde : *tot*, *tota*, *totes*, *totas*. *Cada* ne change jamais.'
				},
				{ type: 'font', pages: 'pages 51 et 52' }
			]
		},
		{
			titol: 'Un pauc, fòrça, tròp',
			blocs: [
				{
					type: 'intro',
					text: 'Pour dire **combien**, sans compter : un peu, beaucoup, assez, trop.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Peu',
							frasas: [{ oc: 'un **pauc** de formatge', fr: 'un peu de fromage' }]
						},
						{
							titol: 'Beaucoup, assez, trop',
							frasas: [
								{ oc: 'M’agradan **fòrça**.', fr: 'je les aime beaucoup' },
								{ oc: '**pro** de pan', fr: 'assez de pain' },
								{ oc: '**tròp** de mond', fr: 'trop de monde' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Devant un nom, ils prennent *de* : *un pauc de formatge*, *tròp de mond*.' },
				{ type: 'font', pages: 'pages 52 et 53' }
			]
		},
		{
			titol: 'Òm, se, dison',
			blocs: [
				{
					type: 'intro',
					text: 'Le « on » du français se dit de plusieurs façons. Tu en connais déjà deux sans le savoir.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'òm, se',
							frasas: [
								{ oc: '**Òm** parla occitan aquí.', fr: 'on parle occitan ici' },
								{ oc: 'Cossí **se** ditz en occitan ?', fr: 'comment dit-on en occitan ?' }
							]
						},
						{
							titol: 'eles, sans le dire',
							frasas: [{ oc: 'Me **dison** Núria.', fr: 'on m’appelle Núria' }]
						}
					]
				},
				{
					type: 'nota',
					text: '*Me dison Núria*, mot à mot : « ils me disent Núria ». C’est la façon la plus courante de dire son nom.'
				},
				{ type: 'font', pages: 'page 53' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: '… mai ?', fr: 'autre chose ?', forma: '|Quicòm:q', sens: 'Quicòm mai ?', indici: 'quelque chose : quicòm' },
						{ oc: 'De … !', fr: 'de rien !', forma: '|res:n', sens: 'De res !', indici: 'rien : res' },
						{ oc: 'Es … .', fr: 'c’est tout', forma: '|tot:o', sens: 'Es tot.', indici: 'tout : tot' },
						{ oc: '… jorn', fr: 'chaque jour', forma: '|cada:q', sens: 'cada jorn', indici: 'chaque : cada' },
						{ oc: 'un … de formatge', fr: 'un peu de fromage', forma: '|pauc:n', sens: 'un pauc de formatge', indici: 'un peu : un pauc' },
						{ oc: 'M’agradan … .', fr: 'je les aime beaucoup', forma: '|fòrça:o', sens: 'M’agradan fòrça.', indici: 'beaucoup : fòrça' }
					],
					mescla: ['fòrça', 'tot', 'Quicòm', 'pauc', 'res', 'cada'],
					bravo: 'Six sur six. Tu peux faire tes courses sans compter.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**quicòm** (quelque chose), **res** (rien), **tot** (tout), **cada** (chaque) ; **un pauc**, **fòrça**, **pro**, **tròp** ; pour « on » : **òm**, **se**, ou le verbe en *-on* (*dison*).'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 5.1 t’emmène au marché](/aprene/modul/5-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 51 à 53.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 1 à 5.' }
	]
};
