// L'impératif (unité 8, en bloc ; la règle en A2). Formes du parcours
// (module 8.2 : pren, vira) et conjuguées avec vèrb'Òc. Règle : Gramatica,
// pages 78 à 80. Occitan à relire par Romain.
export default {
	id: 'imperatiu',
	capitol: 'imperatiu',
	titol: 'L’imperatiu',
	fr: 'L’impératif',
	resumit: 'Pren, vira, prenètz, viratz : donner une indication ; et la défense, non vires pas.',
	validada: false,
	colors: { tu: 'pruna', vos: 'oliva', non: 'blau' },
	ecrans: [
		{
			titol: 'Pren, vira !',
			blocs: [
				{
					type: 'intro',
					text: 'L’**impératif** sert à donner une indication ou un conseil. Il n’a que trois personnes : **tu**, **nosautres**, **vosautres**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'À une personne qu’on tutoie',
							frasas: [
								{ oc: '**Pren** la primièra carrièra.', fr: 'prends la première rue' },
								{ oc: '**Vira** a drecha.', fr: 'tourne à droite' }
							]
						},
						{
							titol: 'À plusieurs, ou en vouvoyant',
							frasas: [
								{ oc: '**Prenètz** la primièra carrièra.', fr: 'prenez la première rue' },
								{ oc: '**Viratz** a drecha.', fr: 'tournez à droite' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Pas de pronom devant : le verbe vient en premier.' },
				{ type: 'font', pages: 'pages 78 et 79' }
			]
		},
		{
			titol: 'Las formas',
			blocs: [
				{
					type: 'intro',
					text: 'Pour un verbe en **-ar**, la forme *tu* est celle de *el* au présent : *canta*. Avec *nosautres*, on s’encourage : *cantem*, chantons.'
				},
				{
					type: 'marcas',
					linhas: [
						['a', 'tu', 'canta'],
						['em', 'nosautres, nosautras', 'cantem'],
						['atz', 'vosautres, vosautras', 'cantatz']
					]
				},
				{ type: 'nota', text: 'Les autres verbes ont leurs formes : *pren*, *prenètz* (prene). Le parcours te les donne au fur et à mesure.' },
				{ type: 'font', pages: 'page 79' }
			]
		},
		{
			titol: 'Non vires pas !',
			blocs: [
				{
					type: 'intro',
					text: 'Pour **défendre**, l’impératif change de forme : on dit *non vires pas*, et non « non vira pas ».'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Fais-le',
							frasas: [
								{ oc: '**Vira** a esquèrra !', fr: 'tourne à gauche !' },
								{ oc: '**Parla** occitan !', fr: 'parle occitan !' }
							]
						},
						{
							titol: 'Ne le fais pas',
							frasas: [
								{ oc: '**Non vires pas** a esquèrra !', fr: 'ne tourne pas à gauche !' },
								{ oc: '**Non parles pas** francés !', fr: 'ne parle pas français !' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Ces formes en *-es* viennent du subjonctif, que tu verras plus loin. Pour l’instant, retiens-les en bloc.' },
				{ type: 'font', pages: 'page 80' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa situation. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'tu (virar)', fr: 'tourne !', forma: 'vir|a:tu', sens: 'Vira !', indici: 'tu : comme el au présent' },
						{ oc: 'vosautres (virar)', fr: 'tournez !', forma: 'vir|atz:vos', sens: 'Viratz !', indici: 'vosautres : -atz' },
						{ oc: 'tu (prene)', fr: 'prends !', forma: 'pren|:tu', sens: 'Pren !', indici: 'la forme courte du parcours' },
						{ oc: 'vosautres (prene)', fr: 'prenez !', forma: 'pren|ètz:vos', sens: 'Prenètz !', indici: 'vosautres : -ètz pour ce verbe' },
						{ oc: 'nosautres (cantar)', fr: 'chantons !', forma: 'cant|em:vos', sens: 'Cantem !', indici: 'nosautres : -em' },
						{ oc: 'tu, pour défendre (virar)', fr: 'ne tourne pas !', forma: 'non vir|es pas:non', sens: 'Non vires pas !', indici: 'pour défendre : non… -es pas' }
					],
					mescla: ['prenètz', 'non vires pas', 'vira', 'cantem', 'viratz', 'pren'],
					bravo: 'Six sur six. Tu peux guider quelqu’un jusqu’à la gare.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**tu** : *vira*, *pren* ; **nosautres** : *cantem* ; **vosautres** : *viratz*, *prenètz*. Pour défendre : **non vires pas**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 8.2 te fait indiquer le chemin](/aprene/modul/8-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 78 à 80.'
		},
		{ de: 'Les formes', text: 'le parcours de Lo Ligam, conjuguées avec vèrb’Òc (lo Congrès).' }
	]
};
