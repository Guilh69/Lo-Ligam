// Les accords : le verbe et son sujet, le groupe mêlé (pour aller plus
// loin). Règle : Gramatica, pages 36 et 37. Exemples écrits pour la fiche.
// Occitan à relire par Romain.
export default {
	id: 'acords',
	capitol: 'acords',
	titol: 'Los acòrds',
	fr: 'Les accords',
	resumit: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.',
	validada: false,
	colors: { sg: 'oliva', pl: 'pruna' },
	ecrans: [
		{
			titol: 'Lo vèrbe e son subjècte',
			blocs: [
				{
					type: 'intro',
					text: 'Le verbe s’accorde avec son **sujet**. Deux personnes ensemble comptent comme *nosautres* ou *vosautres*.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une personne',
							frasas: [
								{ oc: '**Parli** occitan.', fr: 'je parle occitan' },
								{ oc: 'Ma sòrre **parla** catalan.', fr: 'ma sœur parle catalan' }
							]
						},
						{
							titol: 'Deux personnes ensemble',
							frasas: [
								{ oc: 'Tu e ieu **parlam** occitan.', fr: 'toi et moi, nous parlons occitan' },
								{ oc: 'Tu e ela **parlatz** catalan.', fr: 'toi et elle, vous parlez catalan' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Avec *ieu* dans le groupe : *nosautres*. Avec *tu*, sans *ieu* : *vosautres*.' },
				{ type: 'font', pages: 'page 36' }
			]
		},
		{
			titol: 'Masculin e femenin ensems',
			blocs: [
				{
					type: 'intro',
					text: 'Quand un participe ou un adjectif va avec **un masculin et un féminin**, il se met au **masculin pluriel**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Que des féminins',
							frasas: [
								{ oc: 'Maria e Joana son **arribadas**.', fr: 'Marie et Jeanne sont arrivées' },
								{ oc: 'La taula e la cadièra son **nòvas**.', fr: 'la table et la chaise sont neuves' }
							]
						},
						{
							titol: 'Un masculin dans le groupe',
							frasas: [
								{ oc: 'Pèire e Maria son **arribats**.', fr: 'Pierre et Marie sont arrivés' },
								{ oc: 'Lo can e la gata son **negres**.', fr: 'le chien et la chatte sont noirs' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 36' }
			]
		},
		{
			titol: 'Lo subjècte aprèp lo vèrbe',
			blocs: [
				{
					type: 'intro',
					text: 'Le sujet passe souvent **après le verbe**, pour mettre l’action en avant. Le verbe s’accorde quand même avec lui.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Sujet avant',
							frasas: [
								{ oc: 'Lo tren **arriba**.', fr: 'le train arrive' },
								{ oc: 'Los amics **arriban**.', fr: 'les amis arrivent' }
							]
						},
						{
							titol: 'Sujet après',
							frasas: [
								{ oc: '**Arriba** lo tren.', fr: 'le train arrive (on insiste sur l’arrivée)' },
								{ oc: '**Arriban** los amics.', fr: 'les amis arrivent (même accord)' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 37' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de son sujet. Compte les personnes, regarde les genres. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'Tu e ieu, parlar', fr: 'toi et moi, nous parlons', forma: 'parl|am:pl', sens: 'Tu e ieu parlam.', indici: 'tu e ieu = nosautres' },
						{ oc: 'Tu e el, parlar', fr: 'toi et lui, vous parlez', forma: 'parl|atz:pl', sens: 'Tu e el parlatz.', indici: 'tu e el = vosautres' },
						{ oc: 'Ma sòrre, parlar', fr: 'ma sœur parle', forma: 'parl|a:sg', sens: 'Ma sòrre parla.', indici: 'une seule personne' },
						{ oc: 'Maria e Joana son…', fr: 'arrivées', forma: 'arrib|adas:pl', sens: 'son arribadas', indici: 'que des féminins : -adas' },
						{ oc: 'Pèire e Maria son…', fr: 'arrivés', forma: 'arrib|ats:pl', sens: 'son arribats', indici: 'un masculin dans le groupe : -ats' },
						{ oc: '… los amics (arribar)', fr: 'les amis arrivent', forma: 'arrib|an:pl', sens: 'Arriban los amics.', indici: 'sujet après, verbe quand même au pluriel' }
					],
					mescla: ['arribats', 'parla', 'parlatz', 'arriban', 'parlam', 'arribadas'],
					bravo: 'Six sur six. Tout le monde est d’accord.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '*tu e ieu* = **nosautres** ; *tu e el* = **vosautres**. Masculin et féminin ensemble : **masculin pluriel**. Sujet avant ou après, le verbe s’accorde.'
				},
				{ type: 'seguida', text: 'Voir aussi : [le nom et l’adjectif](/apren/gramatica/nom-adjectiu) et [le passé composé](/apren/gramatica/tempses-compausats).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 36 et 37.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
