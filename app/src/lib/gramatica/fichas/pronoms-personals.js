// Les pronoms personnels (unité 2, puis tout l'A1). Phrases reprises du
// parcours (modules 1.1, 1.2, 3.1, 5.4, 6.1, 6.3). Règle : Gramatica,
// pages 43 à 45. Occitan à relire par Romain.
export default {
	id: 'pronoms-personals',
	capitol: 'pronoms-personals',
	titol: 'Los pronoms personals',
	fr: 'Les pronoms personnels',
	resumit: 'Ieu, tu, el, ela… qu’on dit rarement ; me, te, se devant le verbe ; vos pour vouvoyer.',
	validada: true,
	colors: { fort: 'pruna', feble: 'oliva', vos: 'blau' },
	ecrans: [
		{
			titol: 'Ieu, tu, el, ela',
			blocs: [
				{
					type: 'intro',
					text: 'En occitan, la fin du verbe dit déjà qui parle. On dit **ieu**, **tu**, **el**… seulement pour **insister**, ou après un petit mot comme *per* ou *amb*.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'D’habitude, sans pronom',
							frasas: [
								{ oc: 'Parli occitan.', fr: 'je parle occitan' },
								{ oc: 'Demòri a Tolosa.', fr: 'j’habite à Toulouse' }
							]
						},
						{
							titol: 'Pour insister',
							frasas: [
								{ oc: 'E **tu** ?', fr: 'et toi ?' },
								{ oc: 'Per **ieu**, un cafè.', fr: 'pour moi, un café' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 43' }
			]
		},
		{
			titol: 'Las formas',
			blocs: [
				{
					type: 'intro',
					text: 'Voici les **six personnes**, et **vos** pour vouvoyer une personne.'
				},
				{
					type: 'cartas',
					items: [
						{ titol: 'une personne', gros: 'ieu tu', color: 'fort', exemples: [['ieu', 'je, moi'], ['tu', 'tu, toi'], ['el', 'il, lui'], ['ela', 'elle']] },
						{ titol: 'plusieurs', gros: 'nosautres', color: 'fort', exemples: [['nosautres, nosautras', 'nous'], ['vosautres, vosautras', 'vous'], ['eles', 'ils, eux'], ['elas', 'elles']] },
						{ titol: 'vouvoyer', gros: 'vos', color: 'vos', exemples: [['E vos ?', 'et vous ?'], ['Cossí anatz ?', 'comment allez-vous ?']] }
					]
				},
				{ type: 'indic', text: 'Touche une carte pour voir les formes.' },
				{
					type: 'nota',
					text: '*nosautras*, *vosautras* et *elas* : pour un groupe de femmes seulement. Un groupe d’hommes et de femmes se dit au masculin : *nosautres*.'
				},
				{ type: 'font', pages: 'pages 43 et 44' }
			]
		},
		{
			titol: 'Me, te, se',
			blocs: [
				{
					type: 'intro',
					text: 'Devant le verbe, on emploie des formes courtes : **me**, **te**, **se**, **nos**, **vos**.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Le nom',
							frasas: [
								{ oc: 'Cossí **te** dison ?', fr: 'comment t’appelles-tu ?' },
								{ oc: '**Me** dison Núria.', fr: 'je m’appelle Núria' }
							]
						},
						{
							titol: 'Le matin',
							frasas: [
								{ oc: '**Me** lèvi a sèt oras.', fr: 'je me lève à sept heures' },
								{ oc: 'Mon fraire **se** lèva a sèt oras.', fr: 'mon frère se lève à sept heures' }
							]
						}
					]
				},
				{
					type: 'nota',
					text: 'Devant une voyelle, *me* devient *m’* : *M’agradan fòrça, las olivas !*'
				},
				{ type: 'font', pages: 'pages 44 et 45' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque pronom dans sa phrase. La traduction t’aide. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Pronoms à placer',
					linhas: [
						{ oc: 'Per …, un cafè.', fr: 'pour moi, un café', forma: '|ieu:fort', sens: 'Per ieu, un cafè.', indici: 'après per : la forme longue' },
						{ oc: 'E … ?', fr: 'et toi ?', forma: '|tu:fort', sens: 'E tu ?', indici: 'pour renvoyer la question à une personne qu’on tutoie' },
						{ oc: '… dison Lisa.', fr: 'je m’appelle Lisa', forma: '|Me:feble', sens: 'Me dison Lisa.', indici: 'devant le verbe : la forme courte' },
						{ oc: 'Cossí … dison ?', fr: 'comment t’appelles-tu ?', forma: '|te:feble', sens: 'Cossí te dison ?', indici: 'la forme courte de tu' },
						{ oc: 'Karim … lèva a sèt oras.', fr: 'Karim se lève à sept heures', forma: '|se:feble', sens: 'Karim se lèva a sèt oras.', indici: 'pour une autre personne : se' },
						{ oc: 'E …, cossí anatz ?', fr: 'et vous, comment allez-vous ?', forma: '|vos:vos', sens: 'E vos, cossí anatz ?', indici: 'pour vouvoyer : vos' }
					],
					mescla: ['te', 'vos', 'ieu', 'se', 'tu', 'Me'],
					bravo: 'Six sur six. Formes longues et formes courtes, tu les tiens.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**Ieu, tu, el, ela, nosautres, vosautres, eles, elas** : pour insister, ou après *per*, *amb*. Devant le verbe : **me, te, se, nos, vos**. Pour vouvoyer : **vos**.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 1.2 te fait dire ton nom](/aprene/modul/1-2).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, pages 43 à 45.'
		},
		{ de: 'Les phrases', text: 'le parcours de Lo Ligam, unités 1 à 6.' }
	]
};
