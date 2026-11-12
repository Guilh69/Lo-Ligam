// Le passé simple (pour aller plus loin). Formes conjuguées avec vèrb'Òc
// (lengadocian). Règle : Gramatica, page 69 ; irréguliers pages 94 à 98.
// Occitan à relire par Romain.
export default {
	id: 'preterit',
	capitol: 'preterit',
	titol: 'Lo preterit',
	fr: 'Le passé simple',
	resumit: 'Raconter ce qui arrive, du début à la fin : cantèri, prenguèri, foguèt.',
	validada: true,
	colors: { ar: 'pruna', autres: 'oliva', irr: 'blau' },
	ecrans: [
		{
			titol: 'Lo temps del raconte',
			blocs: [
				{
					type: 'intro',
					text: 'Le **passé simple** raconte une action **terminée**, vue en entier. C’est le temps du récit, à l’écrit comme à l’oral. L’imparfait pose le décor ; le passé simple dit ce qui arrive.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le décor : imparfait',
							frasas: [
								{ oc: '**Fasiá** caud…', fr: 'il faisait chaud…' },
								{ oc: '**Èra** tard…', fr: 'il était tard…' }
							]
						},
						{
							titol: 'Ce qui arrive : passé simple',
							frasas: [
								{ oc: '…quand **arribèrem** a Tolosa.', fr: '…quand nous sommes arrivés à Toulouse' },
								{ oc: '…e **prenguèri** lo tren.', fr: '…et j’ai pris le train' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 69' }
			]
		},
		{
			titol: 'Los vèrbes en -ar',
			blocs: [
				{
					type: 'intro',
					text: 'Les verbes en **-ar** prennent un **è** à toutes les personnes.'
				},
				{
					type: 'marcas',
					linhas: [
						['èri', 'ieu', 'cantèri'],
						['ères', 'tu', 'cantères'],
						['èt', 'el, ela', 'cantèt'],
						['èrem', 'nosautres, nosautras', 'cantèrem'],
						['èretz', 'vosautres, vosautras', 'cantèretz'],
						['èron', 'eles, elas', 'cantèron']
					]
				},
				{ type: 'nota', text: 'La voix appuie toujours sur le *è*.' },
				{ type: 'font', pages: 'page 69' }
			]
		},
		{
			titol: 'Lo -gu- dels autres',
			blocs: [
				{
					type: 'intro',
					text: 'Beaucoup d’autres verbes glissent un **-gu-** avant la même terminaison : *prenguèri*, *foguèri*.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'finir', gros: '-iguèri', color: 'autres', exemples: [['fin|iguèri', 'je finis'], ['fin|iguèt', 'il, elle finit']] },
						{ titol: 'prene, venir', gros: '-guèri', color: 'autres', exemples: [['pren|guèri', 'je pris'], ['ven|guèt', 'il, elle vint']] },
						{ titol: 'èsser, aver', gros: 'foguèri', color: 'irr', exemples: [['fo|guèri', 'je fus'], ['fo|guèt', 'il, elle fut'], ['a|guèri', 'j’eus']] },
						{ titol: 'far, dire', gros: 'faguèri', color: 'irr', exemples: [['fa|guèri', 'je fis'], ['di|guèt', 'il, elle dit']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les formes.' },
				{ type: 'font', pages: 'pages 69 et 94 à 98' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu (parlar)', fr: 'je parlai', forma: 'parl|èri:ar', sens: 'parlèri', indici: 'verbe en -ar, ieu : -èri' },
						{ oc: 'el (arribar)', fr: 'il arriva', forma: 'arrib|èt:ar', sens: 'arribèt', indici: 'verbe en -ar, el : -èt' },
						{ oc: 'eles (cantar)', fr: 'ils chantèrent', forma: 'cant|èron:ar', sens: 'cantèron', indici: 'verbe en -ar, eles : -èron' },
						{ oc: 'ieu (prene)', fr: 'je pris', forma: 'pren|guèri:autres', sens: 'prenguèri', indici: 'prene glisse un -gu-' },
						{ oc: 'el (èsser)', fr: 'il fut', forma: 'fo|guèt:irr', sens: 'foguèt', indici: 'èsser : fo-, puis -guèt' },
						{ oc: 'nosautres (far)', fr: 'nous fîmes', forma: 'fa|guèrem:irr', sens: 'faguèrem', indici: 'far : fa-, puis -guèrem' }
					],
					mescla: ['faguèrem', 'parlèri', 'prenguèri', 'cantèron', 'foguèt', 'arribèt'],
					bravo: 'Six sur six. Tu peux raconter une histoire.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**-ar** : *-èri, -ères, -èt, -èrem, -èretz, -èron*. Beaucoup d’autres glissent **-gu-** : *prenguèri*, *foguèri*, *faguèri*. L’imparfait pose le décor, le passé simple dit ce qui arrive.'
				},
				{ type: 'seguida', text: 'Voir aussi : [l’imparfait](/apren/gramatica/imperfach) et [le passé composé](/apren/gramatica/tempses-compausats).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 69 et 94 à 98.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
