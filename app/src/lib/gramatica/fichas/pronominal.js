// Les verbes pronominaux : me lèvi (unité 6, puis A2). Formes du parcours
// (modules 1.2, 6.3), conjuguées avec vèrb'Òc. Règle : Gramatica, page 84.
// Occitan à relire par Romain.
export default {
	id: 'pronominal',
	capitol: 'pronominal',
	titol: 'Los vèrbs pronominals',
	fr: 'Les verbes pronominaux',
	resumit: 'Me lèvi, te lèvas, se lèva : le petit pronom qui répète la personne.',
	validada: false,
	colors: { p: 'pruna', f: 'oliva' },
	ecrans: [
		{
			titol: 'Me lèvi',
			blocs: [
				{
					type: 'intro',
					text: 'Un verbe **pronominal** a devant lui un petit pronom qui répète la personne : **me** lèvi, **te** lèvas, **se** lèva.'
				},
				{
					type: 'colonas',
					items: [
						{
							titol: 'Une personne',
							frasas: [
								{ picto: 'ieu', oc: '**Me** lèvi a sèt oras.', fr: 'je me lève à sept heures' },
								{ oc: '**Te** lèvas d’ora ?', fr: 'tu te lèves tôt ?' },
								{ oc: 'Mon fraire **se** lèva a sèt oras.', fr: 'mon frère se lève à sept heures' }
							]
						},
						{
							titol: 'Plusieurs',
							frasas: [
								{ picto: 'grops', oc: '**Nos** levam tard.', fr: 'nous nous levons tard' },
								{ oc: 'A quina ora **vos** levatz ?', fr: 'à quelle heure vous levez-vous ?' },
								{ oc: '**Se** lèvan a sièis oras.', fr: 'ils ou elles se lèvent à six heures' }
							]
						}
					]
				},
				{ type: 'font', pages: 'page 84' }
			]
		},
		{
			titol: 'Las sièis formas',
			blocs: [
				{
					type: 'intro',
					text: 'Le verbe se conjugue comme d’habitude ; on ajoute seulement **me, te, se, nos, vos, se** devant.'
				},
				{
					type: 'marcas',
					linhas: [
						['i', 'ieu', 'me lèvi'],
						['as', 'tu', 'te lèvas'],
						['a', 'el, ela', 'se lèva'],
						['am', 'nosautres, nosautras', 'nos levam'],
						['atz', 'vosautres, vosautras', 'vos levatz'],
						['an', 'eles, elas', 'se lèvan']
					]
				},
				{
					type: 'nota',
					text: 'Devant une voyelle : *m’*, *t’*, *s’* (*Cossí t’apèlas ?*). Et *lèvi* mais *levam* : la voyelle suit la syllabe forte, comme dans la fiche « La vocala que càmbia ».'
				},
				{ type: 'font', pages: 'page 84' }
			]
		},
		{
			titol: 'Activitat',
			blocs: [
				{
					type: 'intro',
					text: 'Mets chaque forme en face de sa personne : le petit pronom et la fin doivent aller ensemble. L’œil montre la réponse d’une ligne.'
				},
				{
					type: 'relacionar',
					etiqueta: 'Formes à placer',
					linhas: [
						{ oc: 'ieu', fr: 'je me lève', forma: 'me lèv|i:p', sens: 'me lèvi', indici: 'me… -i, c’est ieu' },
						{ oc: 'tu', fr: 'tu te lèves', forma: 'te lèv|as:p', sens: 'te lèvas', indici: 'te… -as, c’est tu' },
						{ oc: 'el, ela', fr: 'il ou elle se lève', forma: 'se lèv|a:p', sens: 'se lèva', indici: 'se… -a, c’est el ou ela' },
						{ oc: 'nosautres, nosautras', fr: 'nous nous levons', forma: 'nos lev|am:f', sens: 'nos levam', indici: 'nos… -am' },
						{ oc: 'vosautres, vosautras', fr: 'vous vous levez', forma: 'vos lev|atz:f', sens: 'vos levatz', indici: 'vos… -atz' },
						{ oc: 'eles, elas', fr: 'ils ou elles se lèvent', forma: 'se lèv|an:p', sens: 'se lèvan', indici: 'se… -an, c’est eles ou elas' }
					],
					mescla: ['vos levatz', 'se lèva', 'me lèvi', 'se lèvan', 'te lèvas', 'nos levam'],
					bravo: 'Six sur six. Toute la maison est levée.'
				}
			]
		},
		{
			titol: 'Resumit',
			blocs: [
				{
					type: 'intro',
					text: '**me, te, se, nos, vos, se** devant le verbe conjugué : *me lèvi*, *nos levam*. Plus tard, au passé composé, ces verbes prennent *èsser* : *me soi levat*, *me soi levada*.'
				},
				{ type: 'seguida', text: 'Dans le parcours : [le module 6.3 raconte ta journée](/aprene/modul/6-3).' },
				{ type: 'fonts' }
			]
		}
	],
	fonts: [
		{
			de: 'La règle',
			text: '_oc:Gramatica de l’occitan estandard_, Collègi d’Occitania et Academia Occitana, sous la direction de Florian Vernet, page 84.'
		},
		{ de: 'Les formes', text: 'le parcours de Lo Ligam, conjuguées avec vèrb’Òc (lo Congrès).' }
	]
};
