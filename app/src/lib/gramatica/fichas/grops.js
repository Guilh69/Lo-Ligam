// Prononciation 5 : les suites de consonnes (unités 1 à 7). Toutes les
// prononciations sont celles du parcours, choisies par Romain (setmana
// « sém-MA-no », miègjorn « myèd-DJOUR », blanc « BLANK » : choix du
// 2026-11-02). Règles : Gramatica, pages 12 à 19. Occitan à relire par Romain.
export default {
	id: 'grops',
	capitol: 'sons',
	ordre: 5,
	titol: 'Las consonantas que se seguisson',
	fr: 'Les suites de consonnes',
	resumit: 'Deux consonnes côte à côte : au milieu du mot, la première se fond dans la seconde ; au bout, souvent une seule s’entend.',
	validada: false,
	colors: { mitan: 'pruna', fin: 'oliva', dj: 'blau' },
	ecrans: [
		{
			titol: 'Al mitan del mot',
			blocs: [
				{
					type: 'intro',
					text: 'Au milieu d’un mot, quand deux consonnes se suivent, **la première prend le son de la seconde** : on entend une seule consonne, plus longue.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'bt sonne « tt »', gros: 'bt', color: 'mitan', exemples: [['dissabte', 'di-SAT-té'], ['lo dissabte', 'lou di-SAT-té']] },
						{ titol: 'tm sonne « mm »', gros: 'tm', color: 'mitan', exemples: [['la setmana', 'la sém-MA-no']] },
						{ titol: 'gj sonne « ddj »', gros: 'gj', color: 'mitan', exemples: [['miègjorn', 'myèd-DJOUR'], ['A miègjorn !', 'a myèd-DJOUR !']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots. Le tiret coupe les syllabes, la syllabe en CAPITALES est la forte.' },
				{
					type: 'nota',
					text: 'Parfois, l’écriture a déjà suivi la prononciation : on écrit *dinnar* (déjeuner), « di-NA ».'
				},
				{ type: 'font', pages: 'pages 16 et 17' }
			]
		},
		{
			titol: 'Doas letras, un son',
			blocs: [
				{
					type: 'intro',
					text: '**tg** et **tj** ne font qu’un son : « dj ». Le *t* ne s’entend pas à part.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'tg',
							frasas: [
								{ oc: '*lo vilatge*', fr: 'lou bi-LA-djé' },
								{ oc: '*lo formatge*', fr: 'lou four-MA-djé' }
							]
						},
						{
							titol: 'tj',
							frasas: [{ oc: '*totjorn*', fr: 'tout-DJOUR' }]
						}
					]
				},
				{ type: 'font', pages: 'page 15' }
			]
		},
		{
			titol: 'Al cap del mot',
			blocs: [
				{
					type: 'intro',
					text: 'Au bout d’un mot, de deux consonnes, **souvent une seule s’entend**. Quand une voyelle les suit, au féminin, toutes reviennent.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'nd, nt : on entend « n »', gros: 'nd nt', color: 'fin', exemples: [['grand', 'GRAN'], ['granda', 'GRAN-do'], ['vint', 'BIN'], ['fa vent', 'fa BÉN']] },
						{ titol: 'rn : on entend « r »', gros: 'rn', color: 'fin', exemples: [['Bonjorn', 'boun-DJOUR'], ['totjorn', 'tout-DJOUR']] },
						{ titol: 'rd : on entend « rt »', gros: 'rd', color: 'fin', exemples: [['verd', 'BÉRT'], ['verda', 'BÉR-do']] },
						{ titol: 'nc : on entend « nk »', gros: 'nc', color: 'fin', exemples: [['blanc', 'BLANK'], ['blanca', 'BLAN-co'], ['cinc', 'SINK']] },
						{ titol: 'cs : on entend « ts »', gros: 'cs', color: 'fin', exemples: [['los amics', 'lou-za-MITS'], ['als amics', 'al-za-MITS']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des mots.' },
				{ type: 'font', pages: 'pages 12 à 19' }
			]
		},
		{
			titol: 'En frasa',
			blocs: [
				{
					type: 'intro',
					text: 'Dans une phrase, tout s’enchaîne. Lis à voix haute, puis compare avec la prononciation.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Au milieu du mot',
							frasas: [
								{ oc: '*E dissabte, dançam al balèti ?*', fr: 'é di-SAT-té, dan-SAN al ba-LÈ-ti ?' },
								{ oc: '*A miègjorn, Karim !*', fr: 'a myèd-DJOUR, ka-RIM !' },
								{ oc: '*Aquí, al vilatge.*', fr: 'a-KI, al bi-LA-djé.' }
							]
						},
						{
							titol: 'Au bout du mot',
							frasas: [
								{ oc: '*A Tolosa, fa vent, e fa freg.*', fr: 'a tou-LOU-zo, fa BÉN, é fa FRÉTCH.' },
								{ oc: '*Bonjorn ! Qué volètz ?*', fr: 'boun-DJOUR ! ké bou-LÈTS ?' },
								{ oc: '*Vint-e-cinc euros lo quilò.*', fr: 'bin-té-SINK ÉOU-rous lou ki-LÒ.' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Dans *vint-e-cinc*, le *t* revient : une voyelle le suit. C’est la même règle qu’au féminin.' },
				{ type: 'font', pages: 'pages 12 à 19' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque mot en face de sa prononciation. Cherche les deux consonnes qui se suivent. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Prononciations à placer',
					linhas: [
						{ oc: 'dissabte', fr: 'samedi', forma: 'di-SAT-té|:mitan', sens: 'dissabte', indici: 'bt sonne « tt »' },
						{ oc: 'la setmana', fr: 'la semaine', forma: 'la sém-MA-no|:mitan', sens: 'la setmana', indici: 'tm sonne « mm »' },
						{ oc: 'lo vilatge', fr: 'le village', forma: 'lou bi-LA-djé|:dj', sens: 'lo vilatge', indici: 'tg sonne « dj »' },
						{ oc: 'grand', fr: 'grand', forma: 'GRAN|:fin', sens: 'grand', indici: 'au bout, nd : on entend « n »' },
						{ oc: 'verd', fr: 'vert', forma: 'BÉRT|:fin', sens: 'verd', indici: 'au bout, rd : on entend « rt »' },
						{ oc: 'blanc', fr: 'blanc', forma: 'BLANK|:fin', sens: 'blanc', indici: 'au bout, nc : on entend « nk »' }
					],
					mescla: ['BÉRT', 'lou bi-LA-djé', 'GRAN', 'di-SAT-té', 'BLANK', 'la sém-MA-no'],
					bravo: 'Six sur six. Le plus difficile de la prononciation est derrière toi.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'Au milieu : **bt** « tt », **tm** « mm », **gj** « ddj » ; **tg**, **tj** « dj ». Au bout : **nd**, **nt** « n », **rn** « r », **rd** « rt », **nc** « nk », **cs** « ts ». Une voyelle derrière, et tout revient.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 7.3 t’apprend la consonne du bout](/aprene/modul/7-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'Les règles',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 12 à 19.'
		},
		{ de: 'Les prononciations', text: 'celles du parcours de Lo Ligam, en languedocien, choisies par Romain.' }
	]
};
