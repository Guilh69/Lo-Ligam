// La place de l'adjectif (unité 7, puis A2). Mots du parcours (modules
// 7.1 à 7.3 : un ostal vièlh, una taula nòva, les couleurs). Règle :
// Gramatica, page 40 ; exemples de sens qui change choisis pour la fiche.
// Occitan à relire par Romain.
export default {
	id: 'placa-adjectiu',
	capitol: 'placa-adjectiu',
	titol: 'La plaça de l’adjectiu',
	fr: 'La place de l’adjectif',
	resumit: 'Après le nom d’habitude, même pour la taille et l’âge ; devant, le sens change.',
	validada: true,
	colors: { apres: 'oliva', davant: 'pruna' },
	ecrans: [
		{
			titol: 'Aprèp lo nom',
			blocs: [
				{
					type: 'intro',
					text: 'D’habitude, l’adjectif se met **après le nom**. Même pour la taille et l’âge, qui passent devant en français.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Les couleurs',
							frasas: [
								{ oc: 'un can **negre**', fr: 'un chien noir' },
								{ oc: 'la cosina **jauna**', fr: 'la cuisine jaune' }
							]
						},
						{
							titol: 'La taille, l’âge',
							frasas: [
								{ oc: 'un ostal **vièlh**', fr: 'une vieille maison' },
								{ oc: 'una taula **nòva**', fr: 'une table neuve' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Les noms de lieux le gardent : *Vilanòva* (Villeneuve), *Castèlnòu* (Castelnau, « le château neuf »).'
				},
				{ type: 'font', pages: 'page 40' }
			]
		},
		{
			titol: 'Davant lo nom',
			blocs: [
				{
					type: 'intro',
					text: 'Placé **devant** le nom, l’adjectif dit plutôt un sentiment qu’un fait : le sens change.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Après : le fait',
							frasas: [
								{ oc: 'un òme **paure**', fr: 'un homme pauvre, sans argent' },
								{ oc: 'un amic **vièlh**', fr: 'un ami âgé' }
							]
						},
						{
							titol: 'Devant : le sentiment',
							frasas: [
								{ oc: 'un **paure** òme', fr: 'un pauvre homme, à plaindre' },
								{ oc: 'un **vièlh** amic', fr: 'un vieil ami, de longue date' }
							]
						}
					]
				},
				{ type: 'nota', text: 'Dans le doute, mets l’adjectif après le nom : c’est presque toujours juste.' },
				{ type: 'font', pages: 'page 40' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque groupe en face de sa traduction. Après le nom, sauf quand le sens change. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Groupes à placer',
					linhas: [
						{ oc: 'ostal, vièlh', fr: 'une vieille maison', forma: 'un ostal |vièlh:apres', sens: 'un ostal vièlh', indici: 'l’âge se met après le nom' },
						{ oc: 'taula, nòu', fr: 'une table neuve', forma: 'una taula |nòva:apres', sens: 'una taula nòva', indici: 'après le nom, et au féminin : nòva' },
						{ oc: 'can, negre', fr: 'un chien noir', forma: 'un can |negre:apres', sens: 'un can negre', indici: 'la couleur se met après le nom' },
						{ oc: 'cosina, jaune', fr: 'la cuisine jaune', forma: 'la cosina |jauna:apres', sens: 'la cosina jauna', indici: 'après le nom, au féminin : jauna' },
						{ oc: 'òme, paure', fr: 'un pauvre homme, à plaindre', forma: 'un |paure òme:davant', sens: 'un paure òme', indici: 'un sentiment : devant le nom' },
						{ oc: 'amic, vièlh', fr: 'un vieil ami, de longue date', forma: 'un |vièlh amic:davant', sens: 'un vièlh amic', indici: 'un lien ancien : devant le nom' }
					],
					mescla: ['un paure òme', 'una taula nòva', 'un vièlh amic', 'la cosina jauna', 'un ostal vièlh', 'un can negre'],
					bravo: 'Six sur six. Tu places l’adjectif comme on le fait en occitan.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: 'L’adjectif se met **après le nom** : *un ostal vièlh*, *un can negre*. **Devant**, il dit un sentiment : *un paure òme*.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 7.3 décrit une maison](/aprene/modul/7-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 40.'
		},
		{ de: 'Les mots', text: 'le parcours de Lo Ligam, unité 7.' }
	]
};
