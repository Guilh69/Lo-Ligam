// Module 1.3 · A1 · « D'ont siás ? » : unité 1 (Adieu !), rédigé par Claude
// le 2026-10-25 sur le modèle du module 1.1 (même chemin en six étapes,
// carte de l'A1 §3). Forme du jour : èsser au singulier (soi, siás, es).
// Jeu du jour : « Ont es ? », placer les villes et découvrir leur nom.
// ⚠️ Occitan vérifié par l'API de lo Congrès, noms de villes par Wikidata
// (libellés occitans), à valider par Romain.

export const modul13 = {
	id: 'modul-1-3',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-3',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.3',
	oc: 'D’ont siás ?',
	fr: 'D’où es-tu ? Dire d’où l’on est et où l’on habite',
	cando:
		'Je peux dire d’où je suis et où j’habite, le demander, dire d’où est quelqu’un d’autre, et reconnaître le nom occitan des grandes villes.',
	durada: '~50 min · 6 étapes',
	nomsPropris: ['Núria', 'Karim', 'Loís', 'Marià', 'Lisa'],
	notesRelecture: [
		'*siás* pour « tu es », comme le cadre (§3) ; l’accueil du site dit *siès* (ton choix du 22-10). On garde *siás* dans les leçons ?',
		'*Soi de…* (origine) et *Demòri a…* (habiter) : *demorar* te va pour « habiter » en A1 ?',
		'Noms de villes pris dans Wikidata, dans la forme de leur dialecte : *Limòtges* (limousin), *Niça* (niçois), *Bordèu* (gascon). Prononciations à confirmer, surtout *Limòtges* et *Niça*.',
		'Son du jour : *o* se dit « ou », *ò* se dit « o ». Je n’ai pas utilisé d’exemple qui s’appuie sur le français standard.',
		'Proverbe ajouté à la Cultura le 2026-11-04 (« Petit dictionnaire insolite », page 87) : le livre écrit *Roda* et *pais* sans accent ; j’ai mis *Ròda* et *país*, les formes de lo Congrès. Il te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des modules 1.1 et 1.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Comment t’appelles-tu ?',
							options: ['Cossí te dison ?', 'Cossí vas ?', 'Cossí anatz ?'],
							correct: 0,
							oc: true,
							choses: ['cossi-te-dison'],
							explain: '*Cossí te dison ?* (ou *Cossí t’apèlas ?*)'
						},
						{
							q: 'Une femme dit « enchantée » :',
							options: ['Encantada !', 'Encantat !'],
							correct: 0,
							oc: true,
							choses: ['encantat'],
							explain: '*Encantada* pour une femme, *Encantat* pour un homme.'
						},
						{
							q: 'Tu vouvoies : comment allez-vous ?',
							options: ['Cossí anatz ?', 'Cossí vas ?'],
							correct: 0,
							oc: true,
							choses: ['cossi-anatz'],
							explain: 'La fin en *-atz* dit « vous ».'
						},
						{
							q: '*Ieu, m’apèli Lisa.* Le mot *Ieu* veut dire…',
							options: ['moi', 'toi', 'bonjour'],
							correct: 0,
							choses: ['ieu'],
							explain: '*Ieu* : moi, pour insister.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 2. Escota
		{
			title: 'Escota',
			fr: 'écoute',
			minutes: 10,
			blocks: [
				{
					type: 'dialogue',
					title: 'Sur la place, après la fête',
					intro:
						'Le lendemain de la fête, Núria et Karim se retrouvent sur la place. Ils parlent de là d’où ils viennent, et de Loís et Marià. Écoute deux fois, puis lis.',
					scenes: [
						{
							title: 'Núria e Karim',
							subtitle: '(Núria et Karim, qui se tutoient)',
							lines: [
								{ oc: 'Núria, d’ont siás ?', sound: 'NOU-ria, doun SYOS ?', fr: 'Núria, d’où es-tu ?' },
								{ oc: 'Soi de Barcelona ! E tu, Karim ?', sound: 'souï dé bar-sé-LOU-no ! é TU, ka-RIM ?', fr: 'Je suis de Barcelone ! Et toi, Karim ?' },
								{ oc: 'Ieu, soi de Besièrs. Mas demòri a Tolosa.', sound: 'YÉOU, souï dé bé-ZYÈS. mas dé-MÒ-ri a tou-LOU-zo.', fr: 'Moi, je suis de Béziers. Mais j’habite à Toulouse.' },
								{ oc: 'E Loís, d’ont es ?', sound: 'é lou-ÍS, doun ÉS ?', fr: 'Et Loís, d’où est-il ?' },
								{ oc: 'Loís es del vilatge. Demòra aquí.', sound: 'lou-ÍS és dél bi-LA-djé. dé-MÒ-ro a-KI.', fr: 'Loís est du village. Il habite ici.' },
								{ oc: 'E Marià, es d’aquí ?', sound: 'é ma-ri-A, és da-KI ?', fr: 'Et Marià, elle est d’ici ?' },
								{ oc: 'Òc, Marià es del país.', sound: 'OK, ma-ri-A és dél pa-ÍS.', fr: 'Oui, Marià est du pays.' }
							]
						}
					],
					glossary: [
						{ oc: 'Barcelona', sound: 'bar-sé-LOU-no', fr: 'Barcelone, en Catalogne' },
						{ oc: 'mas', sound: 'MAS', fr: 'mais' },
						{ oc: 'òc', sound: 'OK', fr: 'oui' },
						{ oc: 'aquí', sound: 'a-KI', fr: 'ici' },
						{ oc: 'del', sound: 'dél', fr: 'du (de + lo)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui vient de Barcelone ?',
							options: ['Núria', 'Karim', 'Loís'],
							correct: 0,
							explain: '*Soi de Barcelona !* dit Núria.'
						},
						{
							q: 'Karim est de Béziers. Où habite-t-il ?',
							options: ['à Toulouse', 'à Béziers', 'au village'],
							correct: 0,
							choses: ['demori-a'],
							explain: '*Mas demòri a Tolosa* : mais j’habite à Toulouse.'
						},
						{
							q: 'Et Loís ?',
							options: ['il est du village et il y habite', 'il est de Toulouse'],
							correct: 0,
							choses: ['es-de'],
							explain: '*Loís es del vilatge. Demòra aquí.*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Obsèrva
		{
			title: 'Obsèrva',
			fr: 'observe',
			minutes: 10,
			blocks: [
				{
					type: 'qcm',
					title: 'La forme te dit qui parle',
					intro: 'En occitan, on ne dit pas « je », « tu », « il » : la fin du verbe suffit. Regarde.',
					items: [
						{
							q: '*Soi de Besièrs.* Qui est de Béziers ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['soi-de'],
							explain: '*soi* : je suis.'
						},
						{
							q: '*D’ont siás ?* On demande à qui ?',
							options: ['à moi', 'à toi', 'à lui ou à elle'],
							correct: 1,
							noShuffle: true,
							choses: ['d-ont-sias'],
							explain: '*siás* : tu es.'
						},
						{
							q: '*Marià es del país.* Qui est du pays ?',
							options: ['moi', 'toi', 'Marià'],
							correct: 2,
							noShuffle: true,
							choses: ['es-de'],
							explain: '*es* : il ou elle est.'
						},
						{
							q: '*Soi de Besièrs* ou *Demòri a Tolosa* : lequel dit où l’on habite ?',
							options: ['Demòri a Tolosa', 'Soi de Besièrs'],
							correct: 0,
							oc: true,
							choses: ['demori-a'],
							explain: '*Soi de…* : d’où l’on vient. *Demòri a…* : où l’on habite.'
						}
					]
				},
				{
					type: 'table',
					title: 'Ton premier verbe : être, au singulier',
					head: ['', 'être', 'habiter'],
					rows: [
						['je', '*soi*', '*demòri*'],
						['tu', '*siás*', '*demòras*'],
						['il, elle', '*es*', '*demòra*']
					],
					notes: [
						'On ajoute *Ieu* seulement pour insister : *Ieu, soi de Besièrs* (moi, je suis de Béziers).',
						'*de* devient *d’* devant une voyelle : *D’ont siás ?* *Soi d’aquí.*',
						'*de* + *lo* se disent *del* : *del vilatge*, *del país*.',
						'Dans d’autres régions, et dans la grammaire de référence, tu trouveras aussi *ès* pour « tu es » : *D’ont ès ?*'
					],
					glosa: { ès: 'tu es (autre forme de *siás*)' }
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales.',
					items: [
						{ id: 'soi-de', oc: 'Soi de…', sound: 'souï dé', fr: 'je suis de… (d’où je viens)' },
						{ id: 'd-ont-sias', oc: 'D’ont siás ?', sound: 'doun SYOS', fr: 'd’où es-tu ?' },
						{ id: 'es-de', oc: 'Es de… · Loís es del vilatge.', sound: 'és dé · lou-ÍS és dél bi-LA-djé', fr: 'il ou elle est de… · Loís est du village.' },
						{ id: 'demori-a', oc: 'Demòri a… · Demòra a…', sound: 'dé-MÒ-ri a · dé-MÒ-ro a', fr: 'j’habite à… · il ou elle habite à…' },
						{ id: 'ont-demoras', oc: 'Ont demòras ?', sound: 'oun dé-MÒ-ros', fr: 'où habites-tu ?' },
						{ id: 'soi-d-aqui', oc: 'Soi d’aquí.', sound: 'souï da-KI', fr: 'je suis d’ici.' },
						{ id: 'vilatge-vila-pais', oc: 'lo vilatge · la vila · lo país', sound: 'lou bi-LA-djé · la BI-lo · lou pa-ÍS', fr: 'le village · la ville · le pays' },
						{ id: 'noms-vilas', oc: 'Tolosa · Montpelhièr · Besièrs · Carcassona', sound: 'tou-LOU-zo · moun-pé-LYÈ · bé-ZYÈS · car-ca-SOU-no', fr: 'Toulouse, Montpellier, Béziers, Carcassonne : chaque ville a son nom occitan' }
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 10,
			blocks: [
				{
					type: 'carta',
					title: 'Ont es ? (où est-ce ?)',
					intro:
						'Voici le pays d’òc. On te donne une ville en français : touche-la sur la carte et découvre son nom occitan. La zone la plus dorée est celle du languedocien, l’occitan de ce cours.',
					choses: ['noms-vilas'],
					items: [
						{ fr: 'Toulouse', oc: 'Tolosa', sound: 'tou-LOU-zo', lon: 1.443, lat: 43.604, cap: 'n' },
						{ fr: 'Montpellier', oc: 'Montpelhièr', sound: 'moun-pé-LYÈ', lon: 3.877, lat: 43.611, cap: 'e', nota: 'le r final ne se dit pas' },
						{ fr: 'Béziers', oc: 'Besièrs', sound: 'bé-ZYÈS', lon: 3.216, lat: 43.343, cap: 's', nota: 'le r ne se dit pas, le s oui' },
						{ fr: 'Carcassonne', oc: 'Carcassona', sound: 'car-ca-SOU-no', lon: 2.351, lat: 43.216, cap: 'o' },
						{ fr: 'Rodez', oc: 'Rodés', sound: 'rou-DÉS', lon: 2.574, lat: 44.35, cap: 'e', nota: 'en Rouergue' },
						{ fr: 'Nîmes', oc: 'Nimes', sound: 'NI-més', lon: 4.36, lat: 43.838, cap: 'n' },
						{ fr: 'Marseille', oc: 'Marselha', sound: 'mar-SÉ-lyo', lon: 5.376, lat: 43.297, cap: 's', nota: 'en Provence' },
						{ fr: 'Nice', oc: 'Niça', sound: 'NI-sso', lon: 7.268, lat: 43.702, cap: 'n', nota: 'on y parle le niçois' },
						{ fr: 'Bordeaux', oc: 'Bordèu', sound: 'bour-DÈOU', lon: -0.579, lat: 44.838, cap: 'e', nota: 'en Gascogne' },
						{ fr: 'Limoges', oc: 'Limòtges', sound: 'li-MOT-djés', lon: 1.262, lat: 45.834, cap: 'e', nota: 'en Limousin' }
					],
					lien: { href: '/carta', texte: 'Ta ville n’y est pas ? Cherche son nom occitan sur la grande carte du site.' }
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 10,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Pour ta ville, écris le nom que tu connais.',
					items: [
						{ consigne: 'Dis d’où tu es : je suis de… (ta ville).', debut: ['Soi de', 'Soi d’'], choses: ['soi-de'], explain: '*Soi de…*, puis ta ville.' },
						{ consigne: 'Dis où tu habites : j’habite à… (ta ville).', debut: ['Demòri a'], choses: ['demori-a'], explain: '*Demòri a…*, puis ta ville.' },
						{ consigne: 'Demande à ton amie d’où elle est.', answers: ['D’ont siás ?'], choses: ['d-ont-sias'] },
						{ consigne: 'Demande-lui où elle habite.', answers: ['Ont demòras ?'], choses: ['ont-demoras'] },
						{ consigne: 'Je suis d’ici.', answers: ['Soi d’aquí.'], choses: ['soi-d-aqui'] },
						{ consigne: 'Loís est du village.', answers: ['Loís es del vilatge.'], choses: ['es-de', 'vilatge-vila-pais'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Je suis de Béziers, mais j’habite à Toulouse.',
							tiles: ['Soi', 'de', 'Besièrs,', 'mas', 'demòri', 'a', 'Tolosa.'],
							choses: ['soi-de', 'demori-a'],
							explain: '*Soi de Besièrs, mas demòri a Tolosa.*'
						},
						{
							prompt: 'Marià est du pays.',
							tiles: ['Marià', 'es', 'del', 'país.'],
							choses: ['es-de', 'vilatge-vila-pais'],
							explain: '*Marià es del país.*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Présente une personne que tu connais : son nom, d’où elle est, où elle habite. Puis compare au modèle.',
					items: [
						{
							q: 'Ton ami, ou ton amie.',
							a: 'Par exemple : *Me dison Lisa. Soi de Nimes, mas demòri a Montpelhièr. Loís es del vilatge : demòra aquí.*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 8,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Le son du jour : o et ò',
					paragraphs: [
						'Sans accent, *o* se dit « ou » : *Tolosa* « tou-LOU-zo », *Carcassona* « car-ca-SOU-no ».',
						'Avec l’accent grave, *ò* se dit « o » : *demòri* « dé-MÒ-ri », *òc* « OK ».',
						'Écoute, puis répète : *Tolosa*, *demòri*, *Tolosa*, *òc*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Tolosa* se dit…',
							options: ['tou-LOU-zo', 'to-LO-za'],
							correct: 0,
							noShuffle: true,
							explain: '*o* sans accent : « ou ». Et le *a* final sonne « o » (module 1.1).'
						},
						{
							q: '*Demòra* se dit…',
							options: ['dé-MÒ-ro', 'dé-MOU-ro'],
							correct: 0,
							noShuffle: true,
							explain: 'Avec l’accent grave, *ò* se dit « o », et la voix appuie dessus.'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul.',
					items: [
						'dire d’où je suis et où j’habite',
						'demander à quelqu’un d’où il est et où il habite',
						'dire d’où est une autre personne',
						'reconnaître le nom occitan de quelques villes'
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : le mot qui a donné son nom à la langue',
					glosa: { lenga: 'langue' },
					paragraphs: [
						'*Òc* veut dire « oui ». Au Moyen Âge, on a nommé les langues d’après leur façon de dire oui : au nord la langue d’oïl, au sud la *lenga d’òc* (la langue d’òc). L’occitan porte son « oui » dans son nom.',
						'Un proverbe dit l’attachement au pays : *Ròda que rodaràs, dins ton país tornaràs*. Tu auras beau tourner, tu reviendras dans ton pays. Source : « Petit dictionnaire insolite de l’occitan et des Occitans », page 87.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire d’où tu es et où tu habites.',
						'Si tu en as envie : demande *D’ont siás ?* à une personne de ton entourage, puis réponds à ton tour : *Soi de…* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
