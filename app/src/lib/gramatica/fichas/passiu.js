// La voix passive (pour aller plus loin). Participes conjugués avec vèrb'Òc
// (lengadocian). Règle : Gramatica, page 85. Exemples écrits pour la fiche.
// Occitan à relire par Romain.
export default {
	id: 'passiu',
	capitol: 'passiu',
	titol: 'La votz passiva',
	fr: 'La voix passive',
	resumit: 'Lo pan es fach pel fornièr ; et plus souvent, une tournure avec se : aquí se vend de pan.',
	validada: true,
	colors: { passiu: 'pruna', se: 'blau', per: 'oliva' },
	ecrans: [
		{
			titol: 'Qual fa l’accion ?',
			blocs: [
				{
					type: 'intro',
					text: 'À la **voix passive**, le sujet **subit** l’action. On la forme avec **èsser** et le **participe passé**. Celui qui agit vient après **per**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Voix active',
							frasas: [
								{ oc: 'Lo fornièr fa lo pan.', fr: 'le boulanger fait le pain' },
								{ oc: 'Maria escriu la letra.', fr: 'Marie écrit la lettre' }
							]
						},
						{
							titol: 'Voix passive',
							frasas: [
								{ oc: 'Lo pan es **fach** pel fornièr.', fr: 'le pain est fait par le boulanger' },
								{ oc: 'La letra es **escricha** per Maria.', fr: 'la lettre est écrite par Marie' }
							]
						}
					]
				},
				{ type: 'nota', text: '*pel*, c’est *per* et *lo* en un seul mot.' },
				{ type: 'font', pages: 'page 85' }
			]
		},
		{
			titol: 'L’acòrd',
			blocs: [
				{
					type: 'intro',
					text: 'Le participe s’accorde avec le **sujet**, comme toujours avec *èsser*.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Masculin',
							frasas: [
								{ oc: 'Lo pan es **fach**.', fr: 'le pain est fait' },
								{ oc: 'Los pans son **fachs**.', fr: 'les pains sont faits' }
							]
						},
						{
							titol: 'Féminin',
							frasas: [
								{ oc: 'La sopa es **facha**.', fr: 'la soupe est faite' },
								{ oc: 'Las letras son **escrichas**.', fr: 'les lettres sont écrites' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 85' }
			]
		},
		{
			titol: 'Puslèu amb se',
			blocs: [
				{
					type: 'intro',
					text: 'Souvent, l’occitan préfère une tournure plus légère avec **se**, sans dire qui agit.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Voix passive',
							frasas: [{ oc: 'Lo pan es vendut aquí.', fr: 'le pain est vendu ici' }]
						},
						{
							titol: 'Avec se',
							frasas: [
								{ oc: 'Aquí **se vend** de pan.', fr: 'ici, on vend du pain' },
								{ oc: 'Aquò **se ditz** pas.', fr: 'ça ne se dit pas' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Les autres façons de dire « on » sont dans la fiche [des indéfinis](/apren/gramatica/indefinits).' },
				{ type: 'font', pages: 'page 85' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa phrase. Regarde le genre et le nombre du sujet. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'Lo pan … (far)', fr: 'le pain est fait', forma: 'es fa|ch:passiu', sens: 'Lo pan es fach.', indici: 'masculin singulier : fach' },
						{ oc: 'La sopa … (far)', fr: 'la soupe est faite', forma: 'es fa|cha:passiu', sens: 'La sopa es facha.', indici: 'féminin : facha' },
						{ oc: 'Las letras … (escriure)', fr: 'les lettres sont écrites', forma: 'son escrich|as:passiu', sens: 'Las letras son escrichas.', indici: 'féminin pluriel : -as' },
						{ oc: 'Lo pan … aquí (vendre)', fr: 'le pain est vendu ici', forma: 'es vend|ut:passiu', sens: 'Lo pan es vendut aquí.', indici: 'participe de vendre : vendut' },
						{ oc: 'Lo pan es fach … fornièr.', fr: 'par le boulanger', forma: '|pel:per', sens: 'Lo pan es fach pel fornièr.', indici: 'per et lo en un seul mot' },
						{ oc: 'Aquò … pas (dire).', fr: 'ça ne se dit pas', forma: '|se ditz:se', sens: 'Aquò se ditz pas.', indici: 'la tournure avec se' }
					],
					mescla: ['son escrichas', 'pel', 'es vendut', 'es fach', 'se ditz', 'es facha'],
					bravo: 'Six sur six. Le travail est fait, et bien fait.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**èsser + participe**, accordé avec le sujet : *lo pan es fach*, *la sopa es facha*. Celui qui agit : **per**, **pel**. Plus léger : **se** (*aquí se vend de pan*).'
				},
				{ type: 'seguida', text: 'Voir aussi : [le passé composé](/apren/gramatica/tempses-compausats), qui utilise les mêmes participes.' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 85.'
		},
		{ de: 'Les formes', text: 'conjuguées avec vèrb’Òc (lo Congrès), en languedocien.' }
	]
};
