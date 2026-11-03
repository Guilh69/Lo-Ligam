// L'infinitif et les marques de personne : la première fiche de
// grammaire (essai du 2026-11-03 sur /ensag/gramatica, d'après la grammaire
// cognitive du CPNL, puis habillée à la manière de Lo Ligam). Formes reprises
// de l'A1 (4.1, 5.3) et de la trame (10.2, 10.3, 11.3), vérifiées avec lo
// Congrès et vèrb'Òc ; occitan à relire par Romain avant « validada: true ».
export default {
	id: 'infinitiu',
	capitol: 'verb',
	titol: 'L’infinitiu',
	fr: 'L’infinitif',
	resumit: 'Les trois groupes de verbes, le radical et la terminaison, les marques de personne.',
	validada: false,
	// les trois groupes du livre (p. 63) : -ar ; -ir, avec ou sans -iss- ; -re et -er
	colors: { ar: 'pruna', ir: 'oliva', re: 'blau', er: 'blau' },
	ecrans: [
		{
			titol: 'L’infinitiu',
			blocs: [
				{
					type: 'intro',
					text: 'Pour nommer un verbe, on le dit à l’**infinitif**, comme dans le dictionnaire. En occitan, il finit par [|-ar:ar], [|-ir:ir], [|-re:re] ou [|-er:er] : trois groupes de verbes.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: '1er groupe', gros: '-ar', color: 'ar', exemples: [['parl|ar', 'parler'], ['cant|ar', 'chanter'], ['trabalh|ar', 'travailler'], ['manj|ar', 'manger'], ['escot|ar', 'écouter']] },
						{ titol: '2e groupe', gros: '-ir', color: 'ir', exemples: [['leg|ir', 'lire'], ['fin|ir', 'finir'], ['caus|ir', 'choisir'], ['ven|ir', 'venir'], ['sent|ir', 'sentir']] },
						{ titol: '3e groupe', gros: '-re -er', color: 're', exemples: [['beu|re', 'boire'], ['vend|re', 'vendre'], ['escriu|re', 'écrire'], ['vol|er', 'vouloir'], ['pod|er', 'pouvoir'], ['av|er', 'avoir']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{
					type: 'nota',
					text: '**Un groupe**, c’est une famille de verbes qui se conjuguent de la même façon. Le deuxième en cache deux : *legir* prend *-iss-* (*legissi*, je lis), *venir* non (*veni*, je viens).'
				},
				{
					// l'encart culture du module 4.1, tel quel (texte déjà vérifié)
					type: 'cultura',
					titol: 'Cultura : troubadour, un nom de métier',
					paragrafes: [
						'Le mot « troubadour » vient de l’occitan *trobador* : celui qui compose, de *trobar*, « trouver », un verbe en -ar comme *cantar*. Le français l’a emprunté : sa première trace écrite date de 1575.',
						'Source : TLFi, article « troubadour ».'
					]
				},
				{ type: 'font', pages: 'pages 63 et 64' }
			]
		},
		{
			titol: 'Lo radical e la terminason',
			blocs: [
				{
					type: 'intro',
					text: 'Un infinitif a deux parties : le **radical**, qui porte le sens, et la **terminaison**, qui change quand on conjugue.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'parl|ar', fr: 'parler', picto: 'forum' },
						{ mot: 'leg|ir', fr: 'lire', picto: 'wiki' },
						{ mot: 'vend|re', fr: 'vendre', picto: 'vendre' },
						{ mot: 'vol|er', fr: 'vouloir', picto: 'voler' }
					],
					noms: [
						{ oc: 'lo radical', fr: 'le radical' },
						{ oc: 'la terminason', fr: 'la terminaison' }
					]
				}
			]
		},
		{
			titol: 'Conjugar un vèrb',
			blocs: [
				{
					type: 'intro',
					text: '**Conjuguer**, c’est changer la terminaison de l’infinitif. La nouvelle fin dit **qui** fait l’action, et **quand**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Qui ?',
							frasas: [
								{ picto: 'ieu', oc: '[Parl|i:ar] occitan.', fr: 'je parle occitan' },
								{ picto: 'grops', oc: '[Parl|am:ar] occitan.', fr: 'nous parlons occitan' }
							]
						},
						{
							titol: 'Quand ?',
							frasas: [
								{ picto: 'escotar', oc: 'Abans, [escot|avi:ar].', fr: 'avant, j’écoutais' },
								{ picto: 'forum', oc: 'Ara, [parl|i:ar] !', fr: 'maintenant, je parle !' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 63' },
				{
					type: 'indic',
					text: 'Le plus souvent, le radical reste et la fin change. La couleur rappelle le groupe de l’infinitif : *parlar*, *escotar*.'
				}
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne. Tu ne connais pas tous ces verbes ? Regarde la fin : elle suffit. L’œil montre la réponse d’une ligne.'
				},
				{
					// chaque forme a sa personne ; la fin suffit à la trouver
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu', fr: 'je', forma: 'parl|i:ar', sens: 'je parle', indici: 'la marque -i, c’est ieu' },
						{ oc: 'tu', fr: 'tu', forma: 'legiss|es:ir', sens: 'tu lis', indici: 'la marque -s, c’est tu' },
						{ oc: 'el, ela', fr: 'il, elle', forma: 'vòl|:er', sens: 'il ou elle veut', indici: 'ni -i, ni -s, ni -m, ni -tz, ni -n : c’est el ou ela' },
						{ oc: 'nosautres, nosautras', fr: 'nous', forma: 'cant|am:ar', sens: 'nous chantons', indici: 'la marque -m, c’est nosautres ou nosautras' },
						{ oc: 'vosautres, vosautras', fr: 'vous', forma: 'bev|ètz:re', sens: 'vous buvez', indici: 'la marque -tz, c’est vosautres ou vosautras' },
						{ oc: 'eles, elas', fr: 'ils, elles', forma: 'vend|on:re', sens: 'ils ou elles vendent', indici: 'la marque -n, c’est eles ou elas' }
					],
					mescla: ['bevètz', 'parli', 'vendon', 'vòl', 'legisses', 'cantam'],
					bravo: 'Six sur six. La fin suffisait, même pour les verbes que tu ne connais pas encore.'
				},
				{ type: 'font', pages: 'page 63, les marques de personne' }
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'La toute dernière lettre du verbe, ou les deux dernières, dit qui parle : c’est la **marque de la personne**. La même pour presque tous les verbes :'
				},
				{
					// les marques de personne du livre (p. 63) : i, s, rien, m, tz, n
					type: 'marcas',
					linhas: [
						['i', 'ieu', 'parli'],
						['s', 'tu', 'parlas'],
						['', 'el, ela', 'parla, vòl, legís'],
						['m', 'nosautres, nosautras', 'parlam'],
						['tz', 'vosautres, vosautras', 'parlatz'],
						['n', 'eles, elas', 'parlan']
					]
				},
				{ type: 'indic', text: 'Même *èsser* suit la règle : *soi, siás, es, sèm, sètz, son*.' },
				{ type: 'seguida', text: 'Dans le parcours : [le module 4.1 fait parler les verbes en -ar](/aprene/modul/4-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 63 et 64.'
		},
		{
			de: 'La forme des écrans',
			text: 'inspirée de la grammaire cognitive du CPNL (Consorci per a la Normalització Lingüística, Catalogne), de Magda Aragonès i Ros et Maria Badia Rabassa, avec l’équipe de grammaire cognitive du CPNL et l’aide de Lourdes Miquel et Carles Vilches : [cpnl.cat/gramatica](https://www.cpnl.cat/gramatica/). Le CPNL s’inspire lui-même de la _es:Gramática básica del estudiante de español_ (Difusión) et de la _ca:Gramàtica pràctica del català_ (Teide).'
		},
		{ de: 'Le mot *trobador*', text: 'TLFi, article « troubadour ».' }
	]
};
