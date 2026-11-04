// Relier deux idées : les conjonctions (unité 2, puis tout le parcours).
// Phrases reprises du parcours (modules 2.4, 3.2, 3.3, 6.2, 7.x). Règle :
// Gramatica, pages 58 à 61. Occitan à relire par Romain.
export default {
	id: 'conjoncions',
	capitol: 'conjoncions',
	titol: 'Las conjoncions',
	fr: 'Les conjonctions',
	resumit: 'E, mas, o, ni pour relier ; puèi, perque, quand pour enchaîner.',
	validada: false,
	colors: { e: 'pruna', mas: 'oliva', o: 'blau' },
	ecrans: [
		{
			titol: 'E, mas, o',
			blocs: [
				{
					type: 'intro',
					text: 'Une **conjonction** relie deux mots ou deux idées. Les plus courantes tiennent en une ou deux lettres.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'et', gros: 'e', color: 'e', exemples: [['Parla catalan e espanhòl.', 'il ou elle parle catalan et espagnol'], ['ma maire e mon fraire', 'ma mère et mon frère']] },
						{ titol: 'mais', gros: 'mas', color: 'mas', exemples: [['Es de Nimes, mas demòra a Montpelhièr.', 'elle est de Nîmes, mais habite à Montpellier'], ['Non ai pas de can, mas ai una cata.', 'je n’ai pas de chien, mais j’ai une chatte']] },
						{ titol: 'ou', gros: 'o', color: 'o', exemples: [['Un tè o un cafè ?', 'un thé ou un café ?']] },
						{ titol: 'ni… ni', gros: 'ni', color: 'e', exemples: [['Non ai ni can ni cata.', 'je n’ai ni chien ni chat']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir des phrases.' },
				{
					type: 'nota',
					text: 'Attention aux homonymes : *e* (et) n’a pas d’accent ; *es* veut dire « il est ». Et *o* (ou) n’est pas *ò*.'
				},
				{ type: 'font', pages: 'pages 58 et 59' }
			]
		},
		{
			titol: 'Puèi, perque, quand',
			blocs: [
				{
					type: 'intro',
					text: 'D’autres petits mots enchaînent les idées : **puèi** (puis), **perque** (parce que), **quand** (quand).'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'L’ordre',
							frasas: [
								{ oc: 'Tot drech, **puèi** vira a drecha.', fr: 'tout droit, puis tourne à droite' },
								{ oc: 'Dejuni, **puèi** vau al trabalh.', fr: 'je déjeune, puis je vais au travail' }
							]
						},
						{
							titol: 'La raison, le moment',
							frasas: [
								{ oc: 'Parli occitan **perque** ma mameta lo parla.', fr: 'je parle occitan parce que ma grand-mère le parle' },
								{ oc: 'Demòri a l’ostal **quand** plòu.', fr: 'je reste à la maison quand il pleut' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: '*Perque*, en un mot, répond. *Per qué ?*, en deux mots avec un accent, demande : « pourquoi ? »'
				},
				{ type: 'font', pages: 'pages 59 à 61' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque petit mot dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Mots à placer',
					linhas: [
						{ oc: 'Parla catalan … espanhòl.', fr: 'il parle catalan et espagnol', forma: '|e:e', sens: 'Parla catalan e espanhòl.', indici: 'et : e' },
						{ oc: 'Es de Nimes, … demòra a Tolosa.', fr: 'elle est de Nîmes, mais habite à Toulouse', forma: '|mas:mas', sens: 'Es de Nimes, mas demòra a Tolosa.', indici: 'mais : mas' },
						{ oc: 'Un tè … un cafè ?', fr: 'un thé ou un café ?', forma: '|o:o', sens: 'Un tè o un cafè ?', indici: 'ou : o, sans accent' },
						{ oc: 'Tot drech, … vira a drecha.', fr: 'tout droit, puis tourne à droite', forma: '|puèi:e', sens: 'Tot drech, puèi vira a drecha.', indici: 'puis : puèi' },
						{ oc: 'Parli occitan … ma mameta lo parla.', fr: 'je parle occitan parce que ma grand-mère le parle', forma: '|perque:mas', sens: 'Parli occitan perque ma mameta lo parla.', indici: 'parce que : perque, en un mot' },
						{ oc: 'Demòri a l’ostal … plòu.', fr: 'je reste à la maison quand il pleut', forma: '|quand:o', sens: 'Demòri a l’ostal quand plòu.', indici: 'quand : quand' }
					],
					mescla: ['quand', 'mas', 'puèi', 'e', 'perque', 'o'],
					bravo: 'Six sur six. Tes phrases peuvent maintenant s’enchaîner.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**e** (et), **mas** (mais), **o** (ou), **ni** (ni) relient. **puèi** (puis), **perque** (parce que), **quand** (quand) enchaînent.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 2.4 enchaîne six phrases sur une personne](/aprene/modul/2-4).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 58 à 61.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 2 à 7.' }
	]
};
