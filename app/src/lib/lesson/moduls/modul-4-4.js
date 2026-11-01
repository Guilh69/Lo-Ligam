// Module 4.4 · A1 · « Qué fa lo dimenge ? » : la tâche de l'unité 4 (Qué
// fas ?), rédigée par Claude le 2026-11-01 sur le modèle de l'unité 1 (même
// chemin en six étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Rien de nouveau : on assemble 4.1 à 4.3 (et la famille de l'unité 3) pour
// mener un petit sondage « Qué fas lo dimenge ? » et le raconter.
// far n'est vu qu'au singulier : pour vouvoyer ou parler à plusieurs, on
// passe par les verbes en -ar (lexique, 4.4).
// Jeu du jour : dialogue à choix (causida) avec Núria, puis on raconte à
// Yasmine ; un tour « rester en occitan » (règle 13).
// Fin du module : le mémo de l'unité, puis l'encart Alhors en Occitània
// (repris tel quel de cursus/alhors-en-occitania-A1.md).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique), à valider par Romain.

export const modul44 = {
	id: 'modul-4-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '4-4',
	unitat: 'Unitat 4 · Qué fas ?',
	nivel: 'A1 · Modul 4.4 · la tâche',
	oc: 'Qué fa lo dimenge ?',
	fr: 'Que fait-il, que fait-elle le dimanche ? Mener un petit sondage et le raconter',
	cando:
		'Je peux demander à plusieurs personnes ce qu’elles font le dimanche, puis raconter leurs réponses : qui fait quoi, quel jour, avec qui.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Loís', 'Marià', 'Yasmine', 'Karim', 'Núria', 'Lisa'],
	notesRelecture: [
		'Titre du module : *Qué fa lo dimenge ?* (que fait-il, que fait-elle le dimanche ?), comme le propose le lexique. Ça te va ?',
		'Loís vouvoie Marià sans le pluriel de *far*, pas encore vu : *E vos, lo dimenge, cantatz ?* Ça sonne juste ?',
		'Tour « rester en occitan » : Núria passe au français, très vite ; la bonne réplique est *Pòdes repetir, se te plai ?* (2.3), comme dans la halte 1. D’accord ?',
		'La tâche : penser à trois proches (ou leur demander, même en français), écrire leur dimanche en occitan, puis le raconter à une personne choisie, le prof au cours en visio par exemple. Ça te va ?',
		'*Òsca !* (glosé en 1.4) dans la bouche de Loís : d’accord ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Tu demandes à deux amis où ils travaillent :',
							options: ['Ont trabalhatz ?', 'Ont trabalhas ?', 'Ont trabalham ?'],
							correct: 0,
							oc: true,
							choses: ['trabalhar', 'parlar-plural'],
							explain: '*-atz* : vous, à plusieurs. *Trabalhas* : tu ; *trabalham* : nous.'
						},
						{
							q: '*Fa d’infirmièra.* Elle…',
							options: ['soigne à l’hôpital', 'fait le pain', 'fait la classe'],
							correct: 0,
							choses: ['infirmier-infirmiera'],
							explain: '*infirmièra* : infirmière. Le pain, c’est *la fornièra* ; la classe, *la regenta*.'
						},
						{
							q: 'Chaque samedi :',
							options: ['lo dissabte', 'dissabte', 'lo dimenge'],
							correct: 0,
							oc: true,
							noShuffle: true,
							choses: ['dissabte'],
							explain: 'Avec *lo* : chaque samedi, l’habitude. Sans *lo* : ce samedi-là.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Nous mangeons avec les amis.',
							answers: ['Manjam amb los amics.', 'Nosautres, manjam amb los amics.'],
							choses: ['manjar', 'amb', 'amic-amiga'],
							explain: '*manjam* : nous mangeons ; *amb los amics* : avec les amis.'
						},
						{
							consigne: 'Il est vigneron.',
							answers: ['Fa de vinhairon.', 'Es vinhairon.'],
							choses: ['vinhairon', 'far-singular'],
							explain: '*Fa de vinhairon* : mot à mot, il fait de vigneron.'
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
					title: 'Le sondage de Loís',
					intro:
						'Loís a une idée : demander à tout le village ce que chacun fait le dimanche. Il commence par Marià, puis il raconte tout à Yasmine. Lis une première fois pour répondre à une seule question : qui travaille le dimanche ?',
					scenes: [
						{
							title: 'Loís e Marià',
							subtitle: '(sur la place ; Loís vouvoie Marià)',
							lines: [
								{ oc: 'Bonjorn, Marià ! E vos, lo dimenge, cantatz ?', sound: 'boun-DJOUR, ma-ri-A ! é BOUS, lou di-MÉN-djé, can-TATS ?', fr: 'Bonjour, Marià ! Et vous, le dimanche, vous chantez ?' },
								{ oc: 'Lo dimenge ? Canti pas : danci ! Al balèti, amb las amigas.', sound: 'lou di-MÉN-djé ? CAN-ti PAS : DAN-si ! al ba-LÈ-ti, am la-za-MI-gos.', fr: 'Le dimanche ? Je ne chante pas : je danse ! Au bal, avec les amies.' },
								{ oc: 'E la setmana ?', sound: 'é la sém-MA-no ?', fr: 'Et la semaine ?' },
								{ oc: 'Lo dijòus, jògui a las cartas amb Núria.', sound: 'lou di-DJÒOUS, DJÒ-gui a las CAR-tos am NOU-ria.', fr: 'Le jeudi, je joue aux cartes avec Núria.' },
								{ oc: 'Òsca ! Mercés, Marià !', sound: 'ÒS-co ! mér-SÉS, ma-ri-A !', fr: 'Bravo ! Merci, Marià !' },
								{ oc: 'A lèu, Loís !', sound: 'a LÈOU, lou-ÍS !', fr: 'À bientôt, Loís !' }
							]
						},
						{
							title: 'Yasmine e Loís',
							subtitle: '(le soir ; Loís raconte son sondage)',
							lines: [
								{ oc: 'Loís, qué fa Marià lo dimenge ?', sound: 'lou-ÍS, ké FA ma-ri-A lou di-MÉN-djé ?', fr: 'Loís, que fait Marià le dimanche ?' },
								{ oc: 'Marià dança al balèti, amb las amigas ! E lo dijòus, jòga a las cartas amb Núria.', sound: 'ma-ri-A DAN-so al ba-LÈ-ti, am la-za-MI-gos ! é lou di-DJÒOUS, DJÒ-go a las CAR-tos am NOU-ria.', fr: 'Marià danse au bal, avec les amies ! Et le jeudi, elle joue aux cartes avec Núria.' },
								{ oc: 'E Karim ?', sound: 'é ka-RIM ?', fr: 'Et Karim ?' },
								{ oc: 'Karim jòga al rugbi, lo dimècres e lo dimenge. Lo dissabte, trabalha a l’espital.', sound: 'ka-RIM DJÒ-go al RUG-bi, lou di-MÈ-crés é lou di-MÉN-djé. lou di-SAT-té, tra-BA-lyo a lés-pi-TAL.', fr: 'Karim joue au rugby, le mercredi et le dimanche. Le samedi, il travaille à l’hôpital.' },
								{ oc: 'E Núria, qué fa lo dimenge ?', sound: 'é NOU-ria, ké FA lou di-MÉN-djé ?', fr: 'Et Núria, que fait-elle le dimanche ?' },
								{ oc: 'Núria ? Camina amb tu, Yasmine !', sound: 'NOU-ria ? ca-MI-no am TU, yas-MI-ne !', fr: 'Núria ? Elle se promène avec toi, Yasmine !' },
								{ oc: 'Òc ! E tu, Loís, qué fas lo dimenge ?', sound: 'OK ! é TU, lou-ÍS, ké FAS lou di-MÉN-djé ?', fr: 'Oui ! Et toi, Loís, que fais-tu le dimanche ?' },
								{ oc: 'Ieu ? Lo dimenge, trabalhi !', sound: 'YÉOU ? lou di-MÉN-djé, tra-BA-lyi !', fr: 'Moi ? Le dimanche, je travaille !' }
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
							q: 'Qui travaille le dimanche ?',
							options: ['Loís', 'Karim', 'Marià'],
							correct: 0,
							choses: ['dimenge'],
							explain: '*Ieu ? Lo dimenge, trabalhi !* Karim, lui, travaille le samedi.'
						},
						{
							q: 'Le dimanche, Marià…',
							options: ['danse au bal avec les amies', 'joue aux cartes avec Núria', 'chante à la chorale'],
							correct: 0,
							choses: ['dancar', 'amic-amiga'],
							explain: '*Lo dimenge ? Canti pas : danci !* Les cartes, c’est le jeudi.'
						},
						{
							q: 'Le samedi, Karim…',
							options: ['travaille à l’hôpital', 'joue au rugby', 'se promène avec Yasmine'],
							correct: 0,
							choses: ['dissabte', 'trabalhar'],
							explain: '*Lo dissabte, trabalha a l’espital.* Le rugby, c’est le mercredi et le dimanche.'
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
					title: 'Raconter : du « je » au « il »',
					intro: 'Marià dit *danci* ; Loís raconte : *Marià dança*. Pour raconter ton sondage, c’est tout ce qui change.',
					head: ['', 'on te dit', 'tu racontes'],
					rows: [
						['danser', '*Danci al balèti.*', '*Dança al balèti.*'],
						['jouer', '*Jògui a las cartas.*', '*Jòga a las cartas.*'],
						['travailler', '*Lo dissabte, trabalhi.*', '*Lo dissabte, trabalha.*'],
						['faire', '*Fau de cosinièr.*', '*Fa de cosinièr.*'],
						['être', '*Soi a la retirada.*', '*Es a la retirada.*']
					],
					notes: [
						'La fin du verbe change : *-i* (je) devient *-a* (il ou elle) : *danci*, *dança* ; *jògui*, *jòga*.',
						'*far* : *fau* devient *fa* ; et *soi* devient *es*.',
						'Pour deux personnes ou plus, *-an* : *Marià e Núria jògan a las cartas.*'
					]
				},
				{
					type: 'qcm',
					title: 'Tu racontes',
					intro: 'Quelqu’un te répond ; toi, tu le racontes.',
					items: [
						{
							q: '*Camini amb Yasmine*, dit Núria. Tu racontes :',
							options: ['Núria camina amb Yasmine.', 'Núria camini amb Yasmine.', 'Núria caminas amb Yasmine.'],
							correct: 0,
							oc: true,
							choses: ['caminar', 'amb'],
							explain: '*camini* (je) devient *camina* (elle).'
						},
						{
							q: '*Lo dimenge, trabalhi*, dit Loís. Tu racontes :',
							options: ['Lo dimenge, Loís trabalha.', 'Lo dimenge, Loís trabalhi.', 'Lo dimenge, Loís trabalham.'],
							correct: 0,
							oc: true,
							choses: ['trabalhar', 'dimenge'],
							explain: '*trabalhi* (je) devient *trabalha* (il).'
						},
						{
							q: '*Fau d’infirmièr*, dit Karim. Tu racontes :',
							options: ['Karim fa d’infirmièr.', 'Karim fau d’infirmièr.', 'Karim fas d’infirmièr.'],
							correct: 0,
							oc: true,
							choses: ['far-singular', 'infirmier-infirmiera'],
							explain: '*fau* (je) devient *fa* (il) ; *fas*, c’est « tu ».'
						},
						{
							q: '*Jogam a las cartas*, disent Marià et Núria. Tu racontes :',
							options: ['Jògan a las cartas.', 'Jògas a las cartas.', 'Jogatz a las cartas.'],
							correct: 0,
							oc: true,
							choses: ['jogar'],
							explain: '*jogam* (nous) devient *jògan* (elles), « DJÒ-gon ».'
						}
					]
				},
				{
					type: 'order',
					title: 'Raconte dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Le jeudi, Marià et Núria jouent aux cartes.',
							tiles: ['Lo', 'dijòus,', 'Marià', 'e', 'Núria', 'jògan', 'a', 'las', 'cartas.'],
							choses: ['dijous', 'jogar'],
							explain: '*jògan* : elles jouent, toutes les deux.'
						},
						{
							prompt: 'Le dimanche, Marià danse avec les amies.',
							tiles: ['Lo', 'dimenge,', 'Marià', 'dança', 'amb', 'las', 'amigas.'],
							choses: ['dimenge', 'dancar', 'amb', 'amic-amiga'],
							explain: '*Lo dimenge* : chaque dimanche. *dança* : elle danse.'
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
					type: 'causida',
					title: 'Ton sondage : Núria',
					intro:
						'C’est toi qui mènes le sondage : choisis chaque réplique. Si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Núria',
					tours: [
						{
							situacion: 'Au marché du village, tu croises Núria. Salue-la, et pose ta question du jour.',
							options: [
								{ oc: 'Adieu, Núria ! Qué fas lo dimenge ?', bon: true },
								{ oc: 'Adieu, Núria ! Qué fas dins la vida ?', reaccion: 'Núria répond qu’elle est étudiante… Mais ton sondage, c’était sur le dimanche.' },
								{ oc: 'Adieu, Núria ! Ont trabalhas ?', reaccion: 'Núria rit : elle ne travaille pas, elle étudie. Et ton sondage, c’était sur le dimanche !' }
							],
							choses: ['dimenge', 'far-singular'],
							explain: '*Qué fas lo dimenge ?* : que fais-tu le dimanche, chaque dimanche ?'
						},
						{
							ditz: 'Lo dimenge ? Camini amb Yasmine. E lo ser, manjam amb los amics.',
							options: [
								{ oc: 'E lo dissabte ?', bon: true },
								{ oc: 'E dissabte ?', reaccion: 'Núria hésite : ce samedi-ci ? Elle ne sait pas encore. Toi, tu voulais ses habitudes.' },
								{ oc: 'E lo dimenge ?', reaccion: 'Núria fronce les sourcils : le dimanche, elle vient de te le dire !' }
							],
							choses: ['dissabte'],
							explain: '*lo dissabte* : chaque samedi. Sans *lo*, ce serait ce samedi-là.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Núria répond, mais très vite. Tu hésites ; alors elle passe au français, plus vite encore : « Le samedi ? Je bosse à Toulouse, et le soir, enfin, ça dépend, c’est compliqué ! »',
							options: [
								{ oc: 'Pòdes repetir, se te plai ?', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Núria continue en français, ravie… et ton sondage aussi passe au français. Demande-lui plutôt de répéter : elle le fera en occitan.' },
								{ oc: 'Compreni pas.', reaccion: 'Núria, gentille, te réexplique tout en français. Demande-lui plutôt de répéter : elle le fera en occitan, plus lentement.' }
							],
							choses: ['podes-repetir'],
							explain: 'Pour rester en occitan : *Pòdes repetir, se te plai ?*'
						},
						{
							ditz: 'Lo dissabte, trabalhi a Tolosa. E lo ser, cosini amb Lisa.',
							options: [
								{ oc: 'Mercés, Núria ! A lèu !', bon: true },
								{ oc: 'E lo dimenge ?', reaccion: 'Núria rit : le dimanche, elle te l’a déjà dit, elle se promène avec Yasmine !' },
								{ oc: 'Qué fas dins la vida ?', reaccion: 'Núria répond qu’elle est étudiante… mais ton sondage portait sur la semaine.' }
							],
							choses: ['a-leu'],
							explain: 'Tu as tes réponses : tu remercies, et tu pars. *A lèu !* : à bientôt !'
						},
						{
							situacion: 'Le soir, Yasmine te demande : *E Núria, qué fa lo dissabte ?* Raconte-lui.',
							options: [
								{ oc: 'Lo dissabte, trabalha a Tolosa. E lo ser, cosina amb Lisa.', bon: true },
								{ oc: 'Lo dissabte, trabalhi a Tolosa. E lo ser, cosini amb Lisa.', reaccion: 'Yasmine écarquille les yeux : toi, tu travailles à Toulouse le samedi ? Elle parlait de Núria.' },
								{ oc: 'Lo dissabte, trabalham a Tolosa. E lo ser, cosinam amb Lisa.', reaccion: 'Yasmine sourit : « nous » ? Tu travailles avec Núria, maintenant ?' }
							],
							choses: ['trabalhar', 'cosinar', 'dissabte'],
							explain: 'Tu racontes : *-i* devient *-a* : *trabalha*, *cosina*.'
						},
						{
							situacion: 'Yasmine veut savoir pour Marià aussi : *E Marià, qué fa lo dimenge ?* Tu te souviens de sa réponse.',
							options: [
								{ oc: 'Dança al balèti, amb las amigas.', bon: true },
								{ oc: 'Danci al balèti, amb las amigas.', reaccion: 'Yasmine éclate de rire : toi, au bal tous les dimanches ? Elle parlait de Marià.' },
								{ oc: 'Jòga a las cartas amb Núria.', reaccion: 'Yasmine hoche la tête : oui, mais ça, c’est le jeudi. Et le dimanche ?' }
							],
							choses: ['dancar', 'dimenge'],
							explain: '*Dança* : elle danse. Le dimanche, Marià va au *balèti*.'
						}
					],
					fin: 'Sondage fait : tu as demandé, puis raconté. La suite, c’est avec tes proches.'
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 12,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'La tâche de l’unité : ton petit sondage',
					paragraphs: [
						'Pense à trois personnes que tu connais bien : ta sœur, un collègue, ton grand-père… Que font-elles le dimanche ? Tu le sais, ou tu leur demandes, même en français.',
						'Écris leurs réponses en occitan ci-dessous, puis raconte ton sondage à voix haute.',
						'Choisis maintenant à qui tu le raconteras pour de vrai : ton prof, au prochain cours en visio, ou une personne qui apprend l’occitan avec toi.'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris ton sondage)',
					intro: 'Une phrase à la fois, avec les vraies réponses. À la fin, la page les rassemble : c’est ton récit.',
					recap: 'Ton sondage, à raconter à voix haute :',
					items: [
						{
							consigne: '1. La question que tu as posée.',
							answers: ['Qué fas lo dimenge ?', 'E tu, qué fas lo dimenge ?'],
							choses: ['dimenge', 'far-singular']
						},
						{
							consigne: '2. Ta première personne, le dimanche. Commence par *Lo dimenge,* puis son prénom (ou *mon fraire*, *ma sòrre*…) et ce qu’elle fait.',
							debut: ['Lo dimenge'],
							choses: ['dimenge'],
							explain: 'Par exemple : *Lo dimenge, mon fraire jòga al rugbi.*'
						},
						{
							consigne: '3. Ta deuxième personne, un autre jour si tu veux : *Lo dissabte, …*',
							debut: ['Lo diluns', 'Lo dimars', 'Lo dimècres', 'Lo dijòus', 'Lo divendres', 'Lo dissabte', 'Lo dimenge'],
							choses: ['dissabte'],
							explain: 'Par exemple : *Lo dissabte, ma sòrre camina amb las amigas.*'
						},
						{
							consigne: '4. Ta troisième personne : son métier. Commence par *Fa…* ou *Es…*',
							debut: ['Fa', 'Es', 'Ela fa', 'El fa', 'Ela es', 'El es'],
							choses: ['far-singular'],
							explain: 'Par exemple : *Fa de regent.* · *Fa d’engenhaira.* · *Es a la retirada.*'
						},
						{
							consigne: '5. Et toi ? Ce que tu fais, toi, le dimanche.',
							debut: ['E ieu, lo dimenge', 'Ieu, lo dimenge', 'Lo dimenge, ieu'],
							choses: ['dimenge'],
							explain: 'Par exemple : *E ieu, lo dimenge, trabalhi !*'
						},
						{
							consigne: '6. Pour finir, salue la personne à qui tu racontes.',
							answers: ['A lèu !', 'A deman !', 'Adieu !', 'Al còp que ven !', 'Adieu-siatz !'],
							choses: ['a-leu', 'a-deman']
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde le sondage de Loís.',
							a: '*Qué fas lo dimenge ? Lo dimenge, Marià dança al balèti, amb las amigas. Lo dissabte, Karim trabalha a l’espital ; lo dimenge, jòga al rugbi. Núria es estudianta : lo dimenge, camina amb Yasmine. E ieu, lo dimenge, trabalhi ! A lèu !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'la question *Qué fas lo dimenge ?* y est',
						'trois personnes, chacune avec ce qu’elle fait, et quand',
						'*lo* devant le jour quand c’est une habitude : *lo dimenge*',
						'la fin du verbe change quand tu racontes : *jògui*, mais *jòga*',
						'la prononciation : « dj » dans *dimenge*, et le *r* final muet de *fornièr*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Redis-le sans regarder',
					paragraphs: [
						'Cache l’écran, et raconte ton sondage d’une traite, à voix haute. Un mot oublié ? Regarde, puis recommence depuis le début.'
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 7,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Les trois sons de l’unité',
					paragraphs: [
						'La voix appuie sur la fin de *parlam*, *parlatz* (« par-LAN », « par-LATS »), mais pas de *parlan* (« PAR-lon ») : module 4.1.',
						'Le *r* final se tait : *fornièr* « four-NYÈ » ; il revient au féminin : *fornièra* « four-NYÈ-ro » (module 4.2).',
						'Le *j*, et le *g* devant *e* ou *i*, sonnent « dj » : *dijòus*, *dimenge* (module 4.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« DJÒ-gon a las CAR-tos » : qui joue ?',
							options: ['ils ou elles : *jògan*', 'nous : *jogam*'],
							correct: 0,
							noShuffle: true,
							explain: 'La voix appuie au début, « DJÒ-gon » : *jògan*, ils ou elles. *Jogam* se dit « djou-GAN », appuyé à la fin.'
						},
						{
							q: '*cosinièr* se dit…',
							options: ['cou-zi-NYÈ', 'cou-zi-NYÈR'],
							correct: 0,
							noShuffle: true,
							explain: '« cou-zi-NYÈR », c’est la lecture à la française. En occitan, le *r* final se tait.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Lo dijòus, lo fornièr e la fornièra jògan a las cartas.*',
							a: '« lou di-DJÒOUS, lou four-NYÈ é la four-NYÈ-ro DJÒ-gon a las CAR-tos » : les trois sons de l’unité dans une seule phrase.'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 4 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'dire ce que je fais, et le demander, à une personne ou à plusieurs',
						'dire mon métier, et demander celui des autres',
						'dire les jours, et ce que je fais chaque semaine',
						'mener un petit sondage, puis le raconter'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander à quelqu’un ce qu’il fait, et le raconter.',
						'Si tu en as envie : pose *Qué fas lo dimenge ?* à une personne de ta famille, ce dimanche. Quand ? Où ? Choisis-le maintenant. Ensuite vient la halte 2 : un dimanche en famille, où tout ressort.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 4 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['demander ce qu’on fait', '*Qué fas ?* · *Qué fas aquí ?*'],
						['demander où on travaille', '*Ont trabalhas ?* · *Trabalhi a Tolosa.*'],
						['demander le métier', '*Qué fas dins la vida ?* · *Fau de regent.*'],
						['dire qu’on ne travaille plus', '*Soi a la retirada.*'],
						['parler d’une habitude', '*Qué fas lo dimenge ?* · *Lo dimenge, jògui.*'],
						['dire avec qui', '*amb los amics* · *amb ma sòrre*']
					]
				},
				{
					type: 'table',
					title: 'Mémo : deux verbes à six personnes',
					head: ['', '*parlar*', '*jogar*'],
					rows: [
						['je', '*parli*', '*jògui*'],
						['tu', '*parlas*', '*jògas*'],
						['il, elle', '*parla*', '*jòga*'],
						['nous', '*parlam*', '*jogam*'],
						['vous', '*parlatz*', '*jogatz*'],
						['ils, elles', '*parlan*', '*jògan*']
					],
					notes: [
						'*far*, au singulier seulement pour l’instant : *fau, fas, fa*. À plusieurs, passe par un autre verbe : *Lo dimenge, cantam.*'
					]
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'que fais-tu ?', 'le dimanche'],
					rows: [
						['languedocien (ton cours)', '*Qué fas ?*', '*lo dimenge*'],
						['gascon', '*Que hès ?*', '*lo dimenge*'],
						['provençal', '*Qué fas ?*', '*lo dimenge*'],
						['limousin', '*Qué fas ?*', '*lo diumenc*'],
						['auvergnat', '*Da que fases ?*', '*lo dumenche*'],
						['vivaro-alpin', '', '*lo dimenche*'] // « que fais-tu ? » : pas de source sûre
					],
					notes: [
						'En gascon, *far* devient *har* : *Que hès ?* En auvergnat, la question commence par *Da que* : *Da que fases ?*',
						'Le dimanche change d’un pays à l’autre : *diumenc* en limousin, *dumenche* en auvergnat, *dimenche* en vivaro-alpin.',
						'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
					],
					glosa: {
						far: 'faire',
						har: 'faire (gascon)',
						'que hès': 'que fais-tu ? (gascon)',
						'da que fases': 'que fais-tu ? (auvergnat)',
						'lo diumenc': 'le dimanche (limousin)',
						'lo dumenche': 'le dimanche (auvergnat)',
						'lo dimenche': 'le dimanche (vivaro-alpin)'
					}
				}
			]
		}
	]
};
