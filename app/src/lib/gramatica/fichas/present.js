// Le présent, avec èsser et aver (unités 1 à 4). Phrases reprises du
// parcours (modules 1.3, 2.4, 3.1, 3.2, 4.1, 6.2). Formes : Gramatica,
// pages 67 et 68, sauf *siás* (choix de Romain du 2026-11-02, cahier §11).
// Occitan à relire par Romain.
export default {
	id: 'present',
	capitol: 'present',
	titol: 'Lo present',
	fr: 'Le présent',
	resumit: 'Ce qui se passe maintenant ou d’habitude ; èsser, aver, et un verbe en -ar.',
	validada: false,
	colors: { esser: 'pruna', aver: 'oliva', ar: 'blau' },
	ecrans: [
		{
			titol: 'Lo present',
			blocs: [
				{
					type: 'intro',
					text: 'Le **présent** dit ce qui se passe maintenant, et aussi ce qu’on fait d’habitude.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Maintenant',
							frasas: [
								{ picto: 'ieu', oc: '**Parli** occitan.', fr: 'je parle occitan' },
								{ oc: '**Fa** caud, uèi !', fr: 'il fait chaud aujourd’hui !' }
							]
						},
						{
							titol: 'D’habitude',
							frasas: [
								{ oc: 'Lo tantòst, **trabalhi** totjorn.', fr: 'l’après-midi, je travaille toujours' },
								{ oc: '**Me lèvi** a sèt oras.', fr: 'je me lève à sept heures' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Le plus souvent, on ne dit pas *ieu* (je) ni *tu* : la fin du verbe suffit. *Parli*, c’est déjà « je parle ».'
				},
				{ type: 'font', pages: 'page 68' }
			]
		},
		{
			titol: 'Èsser',
			blocs: [
				{
					type: 'intro',
					text: '**Èsser** (être) ne ressemble à aucun autre verbe. On l’apprend par cœur, dans de petites phrases.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une personne',
							frasas: [
								{ picto: 'ieu', oc: '**Soi** de Tolosa.', fr: 'je suis de Toulouse' },
								{ oc: 'D’ont **siás** ?', fr: 'd’où es-tu ?' },
								{ oc: 'Lisa **es** francesa.', fr: 'Lisa est française' }
							]
						},
						{
							titol: 'Plusieurs',
							frasas: [
								{ picto: 'grops', oc: '**Sèm** aquí.', fr: 'nous sommes ici' },
								{ oc: '**Sètz** de Montpelhièr ?', fr: 'vous êtes de Montpellier ?' },
								{ oc: '**Son** a Tolosa.', fr: 'ils ou elles sont à Toulouse' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Pour « tu es », tu entendras aussi *ès*. Le parcours dit *siás*, la forme du languedocien.'
				},
				{ type: 'font', pages: 'page 68' }
			]
		},
		{
			titol: 'Aver',
			blocs: [
				{
					type: 'intro',
					text: '**Aver** (avoir) sert pour ce qu’on a, et aussi pour l’âge : *Ai vint ans*, j’ai vingt ans.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une personne',
							frasas: [
								{ picto: 'ieu', oc: '**Ai** vint ans.', fr: 'j’ai vingt ans' },
								{ oc: '**As** de fraires ?', fr: 'as-tu des frères ?' },
								{ oc: 'Mon fraire **a** quinze ans.', fr: 'mon frère a quinze ans' }
							]
						},
						{
							titol: 'Plusieurs',
							frasas: [
								{ picto: 'grops', oc: '**Avèm** un can.', fr: 'nous avons un chien' },
								{ oc: '**Avètz** set ?', fr: 'vous avez soif ?' },
								{ oc: '**An** una cata.', fr: 'ils ou elles ont une chatte' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 68' }
			]
		},
		{
			titol: 'Un vèrb en -ar',
			blocs: [
				{
					type: 'intro',
					text: 'Les verbes en **-ar** sont les plus nombreux. Au présent, ils prennent tous les mêmes fins :'
				},
				{
					type: 'marcas',
					linhas: [
						['i', 'ieu', 'parli'],
						['as', 'tu', 'parlas'],
						['a', 'el, ela', 'parla'],
						['am', 'nosautres, nosautras', 'parlam'],
						['atz', 'vosautres, vosautras', 'parlatz'],
						['an', 'eles, elas', 'parlan']
					]
				},
				{
					type: 'nota',
					text: 'Les verbes en *-ir*, en *-re* et en *-er* ont des fins un peu différentes : tu les rencontreras au fil du parcours.'
				},
				{ type: 'font', pages: 'page 68' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme dans sa phrase : *èsser* ou *aver* ? La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: '… de Tolosa.', fr: 'je suis de Toulouse', forma: '|Soi:esser', sens: 'Soi de Tolosa.', indici: 'je suis : èsser, pour ieu' },
						{ oc: 'D’ont … ?', fr: 'd’où es-tu ?', forma: '|siás:esser', sens: 'D’ont siás ?', indici: 'tu es : èsser, pour tu' },
						{ oc: '… vint ans.', fr: 'j’ai vingt ans', forma: '|Ai:aver', sens: 'Ai vint ans.', indici: 'l’âge se dit avec aver' },
						{ oc: '… de fraires ?', fr: 'as-tu des frères ?', forma: '|As:aver', sens: 'As de fraires ?', indici: 'tu as : aver, pour tu' },
						{ oc: 'Lisa … francesa.', fr: 'Lisa est française', forma: '|es:esser', sens: 'Lisa es francesa.', indici: 'elle est : èsser, pour el ou ela' },
						{ oc: 'Karim e Núria … a Tolosa.', fr: 'Karim et Núria sont à Toulouse', forma: '|son:esser', sens: 'Karim e Núria son a Tolosa.', indici: 'ils sont : èsser, pour eles ou elas' }
					],
					mescla: ['As', 'son', 'Soi', 'es', 'Ai', 'siás'],
					bravo: 'Six sur six. Avec ces deux verbes, tu peux déjà te présenter.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Èsser** : *soi, siás, es, sèm, sètz, son*. **Aver** : *ai, as, a, avèm, avètz, an*. Les verbes en **-ar** : *-i, -as, -a, -am, -atz, -an*.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 1.3 te fait dire *Soi de…*](/aprene/modul/1-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 67 et 68.'
		},
		{ de: 'La forme *siás*', text: 'le languedocien du parcours, choix de Romain (2 novembre 2026).' },
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 1 à 6.' }
	]
};
