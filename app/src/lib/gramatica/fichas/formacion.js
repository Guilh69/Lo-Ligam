// Comment se forment les mots : diminutifs, augmentatifs, métiers (pour
// aller plus loin). Règle : Gramatica, pages 27 à 31. Mots du parcours
// (fornièr, cosinièra, module 4.2). Occitan à relire par Romain.
export default {
	id: 'formacion',
	capitol: 'formacion',
	titol: 'La formacion dels mots',
	fr: 'Comment se forment les mots',
	resumit: 'Un suffixe change le sens : ostalet, ostalàs, cantaire, fornièr.',
	validada: true,
	colors: { dim: 'oliva', aug: 'pruna', mestier: 'blau' },
	ecrans: [
		{
			titol: 'Pichon e polit',
			blocs: [
				{
					type: 'intro',
					text: 'Un **suffixe** ajoute un sens au mot. Pour dire **petit**, souvent avec tendresse : **-et**, **-on**, **-òt**.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'ostal|et:dim', fr: 'une maisonnette' },
						{ mot: 'gat|on:dim', fr: 'un chaton' },
						{ mot: 'paur|òt:dim', fr: 'un pauvre petit' },
						{ mot: 'pichon|eta:dim', fr: 'toute petite' }
					],
					noms: [
						{ oc: 'lo mot', fr: 'le mot de départ' },
						{ oc: 'lo sufixe', fr: 'le sens qui s’ajoute' }
					]
				},
				{ type: 'nota', text: 'Au féminin, le suffixe prend un *-a* : *-eta*, *-ona*, *-òta*.' },
				{ type: 'font', pages: 'page 31' }
			]
		},
		{
			titol: 'Grand, e un pauc marrit',
			blocs: [
				{
					type: 'intro',
					text: 'Pour dire **gros**, souvent avec une pointe de moquerie : **-às**, **-assa**.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'ostal|às:aug', fr: 'une grande bâtisse' },
						{ mot: 'can|às:aug', fr: 'un gros chien' },
						{ mot: 'grand|às:aug', fr: 'un grand gaillard' }
					],
					noms: [
						{ oc: 'lo mot', fr: 'le mot de départ' },
						{ oc: 'lo sufixe', fr: 'gros, un peu moqueur' }
					]
				},
				{ type: 'font', pages: 'page 31' }
			]
		},
		{
			titol: 'Qual o fa ?',
			blocs: [
				{
					type: 'intro',
					text: 'Pour dire **qui fait** : **-aire**, **-aira** (celui ou celle qui fait l’action) ; **-ièr**, **-ièra** (le métier, souvent tiré d’un objet).'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'qui fait l’action', gros: '-aire', color: 'mestier', exemples: [['cant|aire', 'chanteur (cantar)'], ['cant|aira', 'chanteuse'], ['parl|aire', 'locuteur, qui parle une langue']] },
						{ titol: 'le métier', gros: '-ièr', color: 'mestier', exemples: [['forn|ièr', 'boulanger (lo forn, le four)'], ['forn|ièra', 'boulangère'], ['cosin|ièra', 'cuisinière (la cosina)']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{ type: 'font', pages: 'pages 27 et 28' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Fabrique chaque mot : le mot de départ, plus le bon suffixe. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: 'ostal, en petit', fr: 'une maisonnette', forma: 'ostal|et:dim', sens: 'ostalet', indici: 'petit : -et' },
						{ oc: 'gat, en petit', fr: 'un chaton', forma: 'gat|on:dim', sens: 'gaton', indici: 'petit : -on' },
						{ oc: 'can, en gros', fr: 'un gros chien', forma: 'can|às:aug', sens: 'canàs', indici: 'gros : -às' },
						{ oc: 'cantar, qui le fait', fr: 'un chanteur', forma: 'cant|aire:mestier', sens: 'cantaire', indici: 'qui fait l’action : -aire' },
						{ oc: 'cantar, celle qui le fait', fr: 'une chanteuse', forma: 'cant|aira:mestier', sens: 'cantaira', indici: 'au féminin : -aira' },
						{ oc: 'forn, le métier', fr: 'un boulanger', forma: 'forn|ièr:mestier', sens: 'fornièr', indici: 'le métier : -ièr' }
					],
					mescla: ['cantaira', 'gaton', 'fornièr', 'ostalet', 'cantaire', 'canàs'],
					bravo: 'Six sur six. Tu fabriques des mots comme un vrai parlaire.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Petit : **-et**, **-on**, **-òt**. Gros : **-às**. Qui fait : **-aire**, **-aira**. Le métier : **-ièr**, **-ièra**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 4.2 te présente les métiers](/aprene/modul/4-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 27 à 31.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, vérifiés avec lo Congrès.' }
	]
};
