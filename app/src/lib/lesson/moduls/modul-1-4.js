// Module 1.4 · A1 · « E tu ? » : la tâche de l'unité 1 (Adieu !), rédigée
// par Claude le 2026-10-25 sur le modèle du module 1.1 (même chemin en six
// étapes, carte de l'A1 §3). Rien de nouveau : on assemble les modules 1.1
// à 1.3 pour se présenter en six phrases. Jeu du jour : écrire sa
// présentation, que la page rassemble à la fin.
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul14 = {
	id: 'modul-1-4',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-4',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.4 · la tâche',
	oc: 'E tu ?',
	fr: 'Et toi ? Te présenter en six phrases',
	cando:
		'Je peux me présenter en six phrases, à l’oral et à l’écrit : saluer, dire mon nom, d’où je suis, où j’habite, retourner la question, partir.',
	durada: '~45 min · 6 étapes',
	nomsPropris: ['Karim', 'Núria', 'Lisa'],
	notesRelecture: [
		'Le titre du module est la question qui revient dans toute l’unité : *E tu ?* Il ne demande aucun mot nouveau (la tâche n’en apprend pas).',
		'La présentation modèle de Karim reprend uniquement les phrases des modules 1.1 à 1.3.'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 6,
			blocks: [
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'Rien de nouveau aujourd’hui : on rassemble. De mémoire, une question à la fois.',
					items: [
						{
							q: 'Le matin, au marchand, que tu vouvoies :',
							options: ['Bonjorn !', 'Adieu !', 'Bon ser !'],
							correct: 0,
							oc: true,
							choses: ['bonjorn'],
							explain: '*Adieu* est familier : entre amis, entre jeunes.'
						},
						{
							q: 'Je m’appelle Lisa :',
							options: ['M’apèli Lisa.', 'Soi de Lisa.', 'Demòri a Lisa.'],
							correct: 0,
							oc: true,
							choses: ['m-apeli'],
							explain: '*M’apèli…* ou *Me dison…*'
						},
						{
							q: 'D’où es-tu ?',
							options: ['D’ont siás ?', 'Ont demòras ?', 'Cossí vas ?'],
							correct: 0,
							oc: true,
							choses: ['d-ont-sias'],
							explain: '*Ont demòras ?* demande où tu habites.'
						},
						{
							q: 'J’habite à Toulouse :',
							options: ['Demòri a Tolosa.', 'Soi de Tolosa.'],
							correct: 0,
							oc: true,
							choses: ['demori-a'],
							explain: '*Soi de…* dit d’où l’on vient ; *Demòri a…* où l’on habite.'
						},
						{
							q: 'Une dame âgée te dit *Encantada !* Tu es un homme :',
							options: ['Encantat !', 'Encantada !'],
							correct: 0,
							oc: true,
							choses: ['encantat'],
							explain: 'Un homme dit *Encantat*.'
						},
						{
							q: 'Tu quittes un groupe, tu les revois demain :',
							options: ['A deman ! Adieu-siatz !', 'A lèu ! Adieu !'],
							correct: 0,
							oc: true,
							choses: ['a-deman', 'adieu-siatz'],
							explain: 'Demain précisément : *A deman*. Plusieurs personnes : *Adieu-siatz*.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 2. Escota
		{
			title: 'Escota',
			fr: 'écoute',
			minutes: 8,
			blocks: [
				{
					type: 'dialogue',
					title: 'Karim se présente',
					intro: 'Karim se présente à Núria, qu’il ne connaît pas encore. Six phrases. Écoute deux fois, puis lis.',
					scenes: [
						{
							title: 'Karim',
							subtitle: '(Karim se présente)',
							lines: [
								{ oc: 'Adieu !', sound: 'a-DIOU !', fr: 'Salut !' },
								{ oc: 'Me dison Karim.', sound: 'mé DI-zoun ka-RIM.', fr: 'Je m’appelle Karim.' },
								{ oc: 'Soi de Besièrs.', sound: 'souï dé bé-ZYÈS.', fr: 'Je suis de Béziers.' },
								{ oc: 'Mas demòri a Tolosa.', sound: 'mas dé-MÒ-ri a tou-LOU-zo.', fr: 'Mais j’habite à Toulouse.' },
								{ oc: 'E tu, cossí te dison ? D’ont siás ?', sound: 'é TU, cou-si té DI-zoun ? doun SYOS ?', fr: 'Et toi, comment t’appelles-tu ? D’où es-tu ?' },
								{ oc: 'Encantat ! A lèu !', sound: 'én-can-TAT ! a LÈOU !', fr: 'Enchanté ! À bientôt !' }
							]
						}
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Karim tutoie Núria. Quel mot te le montre ?',
							options: ['Adieu', 'Adieu-siatz', 'Bon ser'],
							correct: 0,
							oc: true,
							choses: ['adieu'],
							explain: '*Adieu* : un salut familier, entre jeunes. Il dit aussi *E tu ?*'
						},
						{
							q: 'Karim habite…',
							options: ['à Toulouse', 'à Béziers'],
							correct: 0,
							choses: ['demori-a'],
							explain: 'Il est de Béziers (*Soi de Besièrs*), mais il habite à Toulouse (*demòri a Tolosa*).'
						},
						{
							q: 'Combien de questions pose-t-il à Núria ?',
							options: ['deux', 'une', 'aucune'],
							correct: 0,
							noShuffle: true,
							choses: ['cossi-te-dison', 'd-ont-sias'],
							explain: '*Cossí te dison ?* et *D’ont siás ?*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Obsèrva
		{
			title: 'Obsèrva',
			fr: 'observe',
			minutes: 8,
			blocks: [
				{
					type: 'table',
					title: 'Une présentation en six phrases',
					head: ['', 'Karim dit', 'tu peux dire aussi'],
					rows: [
						['1. saluer', '*Adieu !*', '*Bonjorn !* · *Bon ser !*'],
						['2. ton nom', '*Me dison Karim.*', '*M’apèli…*'],
						['3. d’où tu es', '*Soi de Besièrs.*', '*Soi d’aquí.*'],
						['4. où tu habites', '*Mas demòri a Tolosa.*', '*Demòri a…*'],
						['5. retourner la question', '*E tu, cossí te dison ? D’ont siás ?*', '*E tu, ont demòras ?*'],
						['6. partir', '*Encantat ! A lèu !*', '*Encantada !* · *A deman !*']
					],
					notes: [
						'*mas* (mais) relie l’origine et le lieu de vie : *Soi de Besièrs, mas demòri a Tolosa.*',
						'À une personne âgée qu’on ne connaît pas, on vouvoie : *Bonjorn !*, *E vos ?*, *Adieu-siatz !*'
					]
				},
				{
					type: 'order',
					title: 'Remets la présentation dans l’ordre',
					intro: 'Ici, chaque tuile est une phrase entière.',
					items: [
						{
							prompt: 'Salut ! Je m’appelle Núria. Je suis de Barcelone. Mais j’habite ici. Et toi ? À bientôt !',
							tiles: ['Adieu !', 'M’apèli Núria.', 'Soi de Barcelona.', 'Mas demòri aquí.', 'E tu ?', 'A lèu !'],
							choses: ['adieu', 'm-apeli', 'soi-de', 'demori-a', 'va-plan-e-tu', 'a-leu'],
							explain: 'Saluer, le nom, l’origine, le lieu de vie, la question, partir.'
						}
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
					type: 'escriure',
					title: 'Escriu (écris ta présentation)',
					intro:
						'Six phrases, une à la fois, avec tes vrais nom et ville. À la fin, la page les rassemble : c’est ta présentation.',
					recap: 'Ta présentation, à dire à voix haute :',
					items: [
						{
							consigne: '1. Salue.',
							answers: ['Adieu !', 'Bonjorn !', 'Bon ser !', 'Adieu-siatz !'],
							choses: ['adieu', 'bonjorn', 'bon-ser']
						},
						{
							consigne: '2. Dis ton nom.',
							debut: ['Me dison', 'M’apèli', 'Ieu, me dison', 'Ieu, m’apèli'],
							choses: ['me-dison', 'm-apeli'],
							explain: 'Puis ton prénom.'
						},
						{
							consigne: '3. Dis d’où tu es.',
							answers: ['Soi d’aquí.'],
							debut: ['Soi de', 'Soi d’', 'Ieu, soi de', 'Ieu, soi d’'],
							choses: ['soi-de'],
							explain: 'Avec ta ville, ou *Soi d’aquí.*'
						},
						{
							consigne: '4. Dis où tu habites.',
							answers: ['Demòri aquí.'],
							debut: ['Demòri a', 'Mas demòri a'],
							choses: ['demori-a']
						},
						{
							consigne: '5. Retourne une question.',
							answers: ['E tu ?', 'E tu, cossí te dison ?', 'E tu, d’ont siás ?', 'E tu, ont demòras ?', 'E tu, cossí t’apèlas ?', 'E vos ?'],
							choses: ['va-plan-e-tu']
						},
						{
							consigne: '6. Pars.',
							answers: ['A lèu !', 'A deman !', 'Adieu !', 'Adieu-siatz !', 'Encantat ! A lèu !', 'Encantada ! A lèu !'],
							choses: ['a-leu', 'a-deman']
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 8,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'La tâche de l’unité : te présenter',
					paragraphs: [
						'Dis ta présentation à voix haute, d’une traite, puis enregistre-la sur ton téléphone. Réécoute-la demain, et coche les critères toi-même.',
						'Garde ce premier enregistrement : tu le réécouteras dans quelques mois, avec le sourire.',
						'Pour aller plus loin : présente-toi une deuxième fois en vouvoyant, comme devant une personne âgée.'
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'les six phrases y sont, dans un ordre naturel',
						'*Soi de…* pour l’origine, *Demòri a…* pour le lieu de vie',
						'le « tu » ou le « vous » reste le même du début à la fin',
						'la prononciation : le *a* final sonne « o », le *o* sonne « ou », la syllabe forte est marquée'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde un exemple.',
							a: '*Bonjorn ! Me dison Lisa. Soi de Nimes, mas demòri a Montpelhièr. E tu, cossí te dison ? D’ont siás ? Encantada ! A lèu !*'
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
					title: 'Les trois sons de l’unité',
					list: [
						'le *a* final sonne « o » : *la plaça* « la PLA-ço » (module 1.1) ;',
						'la syllabe forte, que l’accent écrit montre : *m’apèli* « ma-PÈ-li » (module 1.2) ;',
						'*o* sonne « ou », *ò* sonne « o » : *Tolosa*, *demòri* (module 1.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Carcassona* se dit…',
							options: ['car-ca-SOU-no', 'car-ca-SO-na'],
							correct: 0,
							noShuffle: true,
							explain: 'Le *o* sonne « ou », et le *a* final sonne « o ».'
						},
						{
							q: 'Dans *Encantada*, la voix appuie sur…',
							options: ['TA', 'EN', 'DA'],
							correct: 0,
							noShuffle: true,
							explain: '« én-can-TA-do » : l’avant-dernière syllabe.'
						},
						{
							q: '*Òc* se dit…',
							options: ['OK', 'OUK'],
							correct: 0,
							noShuffle: true,
							explain: 'Avec l’accent grave, *ò* sonne « o ».'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 1 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'saluer et partir, le matin ou le soir, en tutoyant ou en vouvoyant',
						'demander comment ça va, et répondre',
						'demander et dire le nom',
						'dire d’où je suis et où j’habite',
						'me présenter en six phrases d’affilée'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de l’unité 1',
					glosa: { òsca: 'bravo' },
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais te présenter en occitan. Dans l’unité 2, tu parleras des langues et des pays : qui parle quoi, et comment se débrouiller quand on ne comprend pas. Puis viendra la première halte, pour tout ressortir.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant te présenter en six phrases.',
						'Si tu en as envie : présente-toi en occitan à une personne de ton entourage, même si elle ne le parle pas, puis demande-lui *E tu ?* Quand ? Où ? Choisis-le maintenant.'
					]
				},
				// Mémo de l'unité (regles-redaccion-A1.md §3) : pas d'id ici, les id
				// vivent dans les encadrés de 1.1 à 1.3.
				{
					type: 'table',
					title: 'Mémo de l’unité 1 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['saluer', '*Adieu !* · *Adieu-siatz !* · *Bonjorn !* · *Bon ser !*'],
						['demander comment ça va', '*Cossí vas ?* · *Cossí anatz ?*'],
						['répondre', '*Vau plan, mercés !* · *Va plan. E tu ?* · *E vos ?*'],
						['remercier', '*Mercés !* · *Plan mercés !*'],
						['partir', '*A lèu !* · *A deman !* · *Al còp que ven !*'],
						['demander le nom', '*Cossí te dison ?* · *Cossí t’apèlas ?* · *Cossí vos dison ?*'],
						['dire son nom', '*Me dison…* · *M’apèli…* · *Encantat !* · *Encantada !*'],
						['dire d’où on est', '*D’ont siás ?* · *Soi de…* · *Soi d’aquí.*'],
						['dire où on habite', '*Ont demòras ?* · *Demòri a…*']
					]
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'salut !', 'comment vas-tu ?', 'merci !'],
					rows: [
						['languedocien (ton cours)', '*Adieu !*', '*Cossí vas ?*', '*Mercés !*'],
						['gascon', '*Adiu !*', '*Com vas ?* · *Quin te va ?*', '*Mercés !*'],
						['provençal', '*Adieu !*', '*Coma vas ?*', '*Mercé !* · *Grandmercé !*'],
						['limousin', '*Adieu !*', '*Coma vas ?*', '*Mercés !*'],
						['auvergnat', '*Adiu !* · *Mainatja !*', '*Coma vas ?*', '*Bien brave !* · *Gramarcés !*'],
						['vivaro-alpin', '*Adieu !*', '*Coma vas ?*', '*Mercí !* · *Grandmercí !*']
					],
					notes: [
						'*Adieu* devient *Adiu* en gascon et en auvergnat (qui dit aussi *Mainatja !*).',
						'« Comment » : *cossí* chez toi, *com* ou *quin* en gascon, *coma* dans les autres dialectes.',
						'Merci : *mercé* en provençal, *mercí* en vivaro-alpin ; en auvergnat, on dit aussi *Bien brave !*',
						'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc).'
					],
					glosa: {
						adiu: 'salut, au revoir (gascon, auvergnat)',
						'com vas': 'comment vas-tu ? (gascon)',
						'quin te va': 'comment vas-tu ? (gascon)',
						'coma vas': 'comment vas-tu ?',
						mercé: 'merci (provençal)',
						grandmercé: 'merci beaucoup (provençal)',
						mainatja: 'salut, au revoir (auvergnat)',
						'bien brave': 'merci (auvergnat)',
						gramarcés: 'merci beaucoup (auvergnat)',
						mercí: 'merci (vivaro-alpin)',
						grandmercí: 'merci beaucoup (vivaro-alpin)'
					}
				}
			]
		}
	]
};
