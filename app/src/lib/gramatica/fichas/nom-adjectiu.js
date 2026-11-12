// Le nom et l'adjectif : féminin, pluriel, accord (unité 2, puis 3 et 7).
// Mots repris du parcours (modules 1.2, 2.1, 3.2, 7.1). Règle : Gramatica,
// pages 33 à 35. Occitan à relire par Romain.
export default {
	id: 'nom-adjectiu',
	capitol: 'nom-adjectiu',
	titol: 'Lo nom e l’adjectiu',
	fr: 'Le nom et l’adjectif',
	resumit: 'Le féminin en -a, le pluriel en -s, et l’adjectif qui s’accorde.',
	validada: true,
	colors: { f: 'pruna', pl: 'oliva', m: 'blau' },
	ecrans: [
		{
			titol: 'Lo femenin',
			blocs: [
				{
					type: 'intro',
					text: 'Pour passer au **féminin**, la plupart des mots prennent un **-a**.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'on ajoute', gros: '+a', color: 'f', exemples: [['occitan|a', 'occitane'], ['espanhòl|a', 'espagnole'], ['italian|a', 'italienne'], ['frances|a', 'française (francés)']] },
						{ titol: 'le -e devient', gros: '-a', color: 'f', exemples: [['dròll|a', 'fille (lo dròlle, le garçon)'], ['paur|a', 'pauvre (paure)']] },
						{ titol: 'la fin change un peu', gros: 't › d', color: 'f', exemples: [['Encantad|a', 'enchantée (Encantat)'], ['amig|a', 'amie (amic)'], ['nòv|a', 'neuve (nòu)']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des exemples.' },
				{
					type: 'nota',
					text: '*francés* perd son accent au féminin : *francesa* suit la règle de la syllabe forte, plus besoin d’accent écrit.'
				},
				{ type: 'font', pages: 'pages 33 et 34' }
			]
		},
		{
			titol: 'Lo plural',
			blocs: [
				{
					type: 'intro',
					text: 'Pour passer au **pluriel**, on ajoute un **-s**, au nom comme à l’article.'
				},
				{
					type: 'copas',
					items: [
						{ mot: 'poma|s:pl', fr: 'pommes' },
						{ mot: 'sòrre|s:pl', fr: 'sœurs' },
						{ mot: 'ostal|s:pl', fr: 'maisons' },
						{ mot: 'dròlle|s:pl', fr: 'enfants' }
					],
					noms: [
						{ oc: 'lo singular', fr: 'le singulier' },
						{ oc: 'la marca del plural', fr: 'la marque du pluriel' }
					]
				},
				{
					type: 'nota',
					text: 'Un groupe d’hommes et de femmes se dit au masculin : *los dròlles*. Après un *s*, le pluriel prend *-es* : *un francés*, *dos franceses*.'
				},
				{ type: 'font', pages: 'pages 34 et 35' }
			]
		},
		{
			titol: 'L’acòrd',
			blocs: [
				{
					type: 'intro',
					text: 'L’adjectif prend le genre et le nombre du nom : il **s’accorde**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Masculin',
							frasas: [
								{ oc: 'Karim es **francés**.', fr: 'Karim est français' },
								{ oc: 'Lo canapè es **nòu**.', fr: 'le canapé est neuf' },
								{ oc: 'L’apartament es **vièlh**.', fr: 'l’appartement est vieux' }
							]
						},
						{
							titol: 'Féminin',
							frasas: [
								{ oc: 'Núria es **catalana**.', fr: 'Núria est catalane' },
								{ oc: 'La taula es **nòva**.', fr: 'la table est neuve' },
								{ oc: 'La cosina es **jauna**.', fr: 'la cuisine est jaune' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 33' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de son mot. Féminin ou pluriel ? La traduction le dit. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'occitan', fr: 'au féminin', forma: 'occitan|a:f', sens: 'occitane', indici: 'on ajoute -a' },
						{ oc: 'espanhòl', fr: 'au féminin', forma: 'espanhòl|a:f', sens: 'espagnole', indici: 'on ajoute -a, l’accent reste' },
						{ oc: 'francés', fr: 'au féminin', forma: 'frances|a:f', sens: 'française', indici: 'on ajoute -a, et l’accent écrit tombe' },
						{ oc: 'Encantat !', fr: 'au féminin', forma: 'Encantad|a:f', sens: 'Enchantée !', indici: 'le t devient d devant -a' },
						{ oc: 'lo dròlle', fr: 'le garçon : et la fille ?', forma: 'la dròll|a:f', sens: 'la fille', indici: 'le -e devient -a' },
						{ oc: 'la sòrre', fr: 'au pluriel', forma: 'las sòrre|s:pl', sens: 'les sœurs', indici: 'on ajoute -s au nom et à l’article' }
					],
					mescla: ['Encantada', 'las sòrres', 'occitana', 'la dròlla', 'francesa', 'espanhòla'],
					bravo: 'Six sur six. Le -a et le -s font presque tout le travail.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{ type: 'intro', text: 'Deux marques à retenir, sur le nom comme sur l’adjectif :' },
				{
					type: 'marcas',
					linhas: [
						['a', 'femenin', 'occitana'],
						['s', 'plural', 'sòrres'],
						['as', 'femenin plural', 'occitanas']
					]
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 2.1 te fait dire ta nationalité](/aprene/modul/2-1).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 33 à 35.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, unités 1 à 7.' }
	]
};
