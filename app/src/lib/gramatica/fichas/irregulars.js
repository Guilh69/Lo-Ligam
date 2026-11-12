// Les verbes irréguliers au présent (pour aller plus loin). Formes
// conjuguées avec vèrb'Òc (lengadocian) ; far : fau, fas, fa comme dans le
// parcours (module 4.2). Règle : Gramatica, pages 94 à 98. Occitan à relire
// par Romain.
export default {
	id: 'irregulars',
	capitol: 'irregulars',
	titol: 'Los vèrbes irregulars',
	fr: 'Les verbes irréguliers',
	resumit: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure : leurs formes au présent, et un truc pour nosautres.',
	validada: true,
	colors: { mov: 'pruna', dire: 'oliva', voler: 'blau' },
	ecrans: [
		{
			titol: 'Anar, far, dire, veire',
			blocs: [
				{
					type: 'intro',
					text: 'Les verbes les plus utiles sont souvent **irréguliers** : leur début change d’une personne à l’autre. Les fins, elles, restent familières.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'anar (aller)', gros: 'vau', color: 'mov', exemples: [['vau', 'je vais'], ['vas', 'tu vas'], ['va', 'il, elle va'], ['anam', 'nous allons'], ['anatz', 'vous allez'], ['van', 'ils, elles vont']] },
						{ titol: 'far (faire)', gros: 'fau', color: 'mov', exemples: [['fau', 'je fais'], ['fas', 'tu fais'], ['fa', 'il, elle fait'], ['fasèm', 'nous faisons'], ['fasètz', 'vous faites'], ['fan', 'ils, elles font']] },
						{ titol: 'dire', gros: 'disi', color: 'dire', exemples: [['disi', 'je dis'], ['dises', 'tu dis'], ['ditz', 'il, elle dit'], ['disèm', 'nous disons'], ['disètz', 'vous dites'], ['dison', 'ils, elles disent']] },
						{ titol: 'veire (voir)', gros: 'vesi', color: 'dire', exemples: [['vesi', 'je vois'], ['veses', 'tu vois'], ['vei', 'il, elle voit'], ['vesèm', 'nous voyons'], ['vesètz', 'vous voyez'], ['veson', 'ils, elles voient']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir le verbe entier.' },
				{ type: 'font', pages: 'pages 94 à 98' }
			]
		},
		{
			titol: 'Poder, voler, saber, venir',
			blocs: [
				{
					type: 'intro',
					text: 'Quatre verbes de tous les jours. Avec *pòdi*, *vòli*, la voyelle change dès que la voix quitte le début : *podèm*, *volèm*.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'poder (pouvoir)', gros: 'pòdi', color: 'voler', exemples: [['pòdi', 'je peux'], ['pòdes', 'tu peux'], ['pòt', 'il, elle peut'], ['podèm', 'nous pouvons'], ['podètz', 'vous pouvez'], ['pòdon', 'ils, elles peuvent']] },
						{ titol: 'voler (vouloir)', gros: 'vòli', color: 'voler', exemples: [['vòli', 'je veux'], ['vòles', 'tu veux'], ['vòl', 'il, elle veut'], ['volèm', 'nous voulons'], ['volètz', 'vous voulez'], ['vòlon', 'ils, elles veulent']] },
						{ titol: 'saber (savoir)', gros: 'sabi', color: 'dire', exemples: [['sabi', 'je sais'], ['sabes', 'tu sais'], ['sap', 'il, elle sait'], ['sabèm', 'nous savons'], ['sabètz', 'vous savez'], ['sabon', 'ils, elles savent']] },
						{ titol: 'venir', gros: 'veni', color: 'mov', exemples: [['veni', 'je viens'], ['venes', 'tu viens'], ['ven', 'il, elle vient'], ['venèm', 'nous venons'], ['venètz', 'vous venez'], ['venon', 'ils, elles viennent']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir le verbe entier.' },
				{ type: 'nota', text: 'C’est [la voyelle qui change](/apren/gramatica/alternanca), comme dans *demòri*, *demoram*.' },
				{ type: 'font', pages: 'pages 94 à 98' }
			]
		},
		{
			titol: 'Un truc : nosautres',
			blocs: [
				{
					type: 'intro',
					text: 'Même chez les irréguliers, **nosautres** et **vosautres** sont sages : un début, puis **-èm**, **-ètz** (pour *anar* : *anam*, *anatz*). Si tu connais l’un, tu devines l’autre.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le début change',
							frasas: [
								{ oc: 'ieu **preni**, el **pren**', fr: 'je prends, il prend' },
								{ oc: 'ieu **bevi**, el **beu**', fr: 'je bois, il boit' }
							]
						},
						{
							titol: 'nosautres, vosautres : -èm, -ètz',
							frasas: [
								{ oc: '**prenèm**, **prenètz**', fr: 'nous prenons, vous prenez' },
								{ oc: '**bevèm**, **bevètz**', fr: 'nous buvons, vous buvez' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Pour *èsser* et *aver*, va voir [le présent](/apren/gramatica/present).' },
				{ type: 'font', pages: 'pages 94 à 98' }
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
						{ oc: 'ieu (anar)', fr: 'je vais', forma: '|vau:mov', sens: 'vau', indici: 'anar commence tout autrement : vau' },
						{ oc: 'el (dire)', fr: 'il dit', forma: '|ditz:dire', sens: 'ditz', indici: 'dire, el : ditz' },
						{ oc: 'ela (veire)', fr: 'elle voit', forma: '|vei:dire', sens: 'vei', indici: 'veire, ela : vei' },
						{ oc: 'tu (poder)', fr: 'tu peux', forma: 'pòd|es:voler', sens: 'pòdes', indici: 'poder, tu : pòd-, puis -es' },
						{ oc: 'el (saber)', fr: 'il sait', forma: '|sap:dire', sens: 'sap', indici: 'saber, el : sap' },
						{ oc: 'nosautres (beure)', fr: 'nous buvons', forma: 'bev|èm:voler', sens: 'bevèm', indici: 'nosautres : un début, puis -èm' }
					],
					mescla: ['sap', 'vau', 'bevèm', 'ditz', 'pòdes', 'vei'],
					bravo: 'Six sur six. Les irréguliers n’ont qu’à bien se tenir.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '*vau*, *fau*, *disi*, *vesi*, *pòdi*, *vòli*, *sabi*, *veni*, *preni*, *bevi* : le début change. Avec **nosautres** et **vosautres**, presque toujours **-èm**, **-ètz**.'
				},
				{ type: 'seguida', text: 'Voir aussi : [le futur](/apren/gramatica/futur), où certains changent aussi de début.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 94 à 98.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
