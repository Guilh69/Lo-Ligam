// Le subjonctif (pour aller plus loin). Formes conjuguées avec vèrb'Òc
// (lengadocian : canten au pluriel). Règle : Gramatica, pages 74 à 78.
// Exemples écrits pour la fiche. Occitan à relire par Romain.
export default {
	id: 'subjonctiu',
	capitol: 'subjonctiu',
	titol: 'Lo subjonctiu',
	fr: 'Le subjonctif',
	resumit: 'Ce qui n’est pas encore réel : vòli que vengas, cal que partisca. En -e pour les verbes en -ar, en -a pour les autres.',
	validada: true,
	colors: { ar: 'pruna', autres: 'oliva', irr: 'blau' },
	ecrans: [
		{
			titol: 'Vòli que vengas',
			blocs: [
				{
					type: 'intro',
					text: 'Le **subjonctif** dit ce qui n’est **pas encore réel** : un souhait, un besoin, une crainte. Il vient presque toujours après **que**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Un souhait',
							frasas: [
								{ oc: 'Vòli que **vengas**.', fr: 'je veux que tu viennes' },
								{ oc: 'Volèm que **parletz** occitan.', fr: 'nous voulons que vous parliez occitan' }
							]
						},
						{
							titol: 'Un besoin',
							frasas: [
								{ oc: 'Cal que **partisca**.', fr: 'il faut qu’il parte' },
								{ oc: 'Cal que **siás** aquí.', fr: 'il faut que tu sois là' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Tu le connais déjà : dans *Non vires pas !*, *vires* est un subjonctif.' },
				{ type: 'font', pages: 'pages 74 et 77' }
			]
		},
		{
			titol: 'Los vèrbes en -ar',
			blocs: [
				{
					type: 'intro',
					text: 'Les verbes en **-ar** prennent un **e**. Les autres prennent un **a**.'
				},
				{
					type: 'marcas',
					linhas: [
						['e', 'ieu', 'cante'],
						['es', 'tu', 'cantes'],
						['e', 'el, ela', 'cante'],
						['em', 'nosautres, nosautras', 'cantem'],
						['etz', 'vosautres, vosautras', 'cantetz'],
						['en', 'eles, elas', 'canten']
					]
				},
				{ type: 'font', pages: 'page 74' }
			]
		},
		{
			titol: 'Los autres vèrbes',
			blocs: [
				{
					type: 'intro',
					text: 'Les autres verbes prennent **-a**, souvent avec un **-isc-** ou un **-g-** devant.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'finir, partir', gros: '-isca', color: 'autres', exemples: [['fin|isca', 'que je finisse'], ['part|iscas', 'que tu partes']] },
						{ titol: 'venir, prene', gros: '-ga', color: 'autres', exemples: [['ven|ga', 'que je vienne'], ['pren|gas', 'que tu prennes']] },
						{ titol: 'èsser, aver', gros: 'siá aja', color: 'irr', exemples: [['siá', 'que je sois'], ['siás', 'que tu sois'], ['aja', 'que j’aie']] },
						{ titol: 'far, poder', gros: 'faga pòsca', color: 'irr', exemples: [['faga', 'que je fasse'], ['pòsca', 'que je puisse']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les formes.' },
				{ type: 'nota', text: '*siás* sert aussi au présent (*tu siás*, tu es) : la phrase fait la différence.' },
				{ type: 'font', pages: 'pages 74 et 75' }
			]
		},
		{
			titol: 'Lo subjonctiu imperfach',
			blocs: [
				{
					type: 'intro',
					text: 'Pour ce qui est **presque impossible**, ou pour un regret : prends le passé simple et change **-r-** en **-ss-**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Passé simple',
							frasas: [
								{ oc: '*cantèri*', fr: 'je chantai' },
								{ oc: '*poguèri*', fr: 'je pus' }
							]
						},
						{
							titol: 'Subjonctif imparfait',
							frasas: [
								{ oc: '*cantèsse*', fr: 'que je chantasse' },
								{ oc: 'Se **poguèsses** venir !', fr: 'si seulement tu pouvais venir !' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 75' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Complète chaque phrase avec le subjonctif. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'Vòli que tu … (venir).', fr: 'que tu viennes', forma: 'ven|gas:autres', sens: 'Vòli que vengas.', indici: 'venir : ven-, puis -gas' },
						{ oc: 'Cal que ieu … (cantar).', fr: 'que je chante', forma: 'cant|e:ar', sens: 'Cal que cante.', indici: 'verbe en -ar : -e' },
						{ oc: 'Volèm que vosautres … (parlar).', fr: 'que vous parliez', forma: 'parl|etz:ar', sens: 'Volèm que parletz.', indici: 'verbe en -ar, vosautres : -etz' },
						{ oc: 'Cal qu’el … (partir).', fr: 'qu’il parte', forma: 'part|isca:autres', sens: 'Cal que partisca.', indici: 'partir : -isca' },
						{ oc: 'Cal que tu … aquí (èsser).', fr: 'que tu sois là', forma: '|siás:irr', sens: 'Cal que siás aquí.', indici: 'èsser : siá, siás…' },
						{ oc: 'Vòli que nosautres … la fèsta (far).', fr: 'que nous fassions la fête', forma: 'fag|am:irr', sens: 'Vòli que fagam la fèsta.', indici: 'far : fag-, puis -am' }
					],
					mescla: ['partisca', 'siás', 'cante', 'fagam', 'vengas', 'parletz'],
					bravo: 'Six sur six. Pourvu que ça dure !'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Après **que**, pour un souhait ou un besoin. **-ar** : *cante, cantes, cante, cantem, cantetz, canten*. **Les autres** : *-a* (*finisca*, *venga*). **èsser** : *siá* ; **aver** : *aja*.'
				},
				{ type: 'seguida', text: 'Voir aussi : [l’impératif](/apren/gramatica/imperatiu) et [exprimer une condition](/apren/gramatica/condicion).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 74 à 78.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
