// Module 4.3 · A1 · « Qué fas lo dimenge ? » : unité 4 (Qué fas ?), rédigé
// par Claude le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six
// étapes, carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : les jours ; lo dimenge = chaque dimanche (l'habitude), sans
// article = un jour précis ; jogar (ò sous l'accent, gu devant i).
// Scène : la semaine de Loís (cuisinier, il travaille du mardi au dimanche),
// puis celle de Karim et de Núria.
// Jeu du jour : mots mêlés des jours (qcm, une ligne de la grille à la fois).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique, 4.3 ; rugbi, balèti,
// cartas glosés en passant), à valider par Romain.

export const modul43 = {
	id: 'modul-4-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '4-3',
	unitat: 'Unitat 4 · Qué fas ?',
	nivel: 'A1 · Modul 4.3',
	oc: 'Qué fas lo dimenge ?',
	fr: 'Que fais-tu le dimanche ? Dire ce qu’on fait dans la semaine',
	cando:
		'Je peux dire les jours de la semaine, ce que je fais un jour précis ou chaque semaine, et avec qui.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Loís', 'Núria', 'Karim', 'Marià', 'Lisa'],
	notesRelecture: [
		'*Dissabte, dançam ?* (ce samedi-là) contre *Lo dissabte, trabalhi* (chaque samedi) : c’est bien ton usage ?',
		'*La setmana, trabalhi de dimars a dimenge* (« de… a… » pour « du… au… ») : ça te va ?',
		'*Jògui al rugbi*, *jogam a las cartas* : *al* et *a las* après *jogar*, d’accord ?',
		'Son : *dijòus* « di-DJÒOUS », *dimenge* « di-MÉN-djé » : c’est bien ton usage ?',
		'*Camini amb Yasmine* pour « je me promène avec Yasmine » : ça te va, sans verbe de plus ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 4.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Pour demander son métier à quelqu’un :',
							options: ['Qué fas dins la vida ?', 'Qué fas ?', 'Ont trabalhas ?'],
							correct: 0,
							oc: true,
							choses: ['que-fas-dins-la-vida'],
							explain: '*Qué fas ?* tout court peut vouloir dire « en ce moment ». *Ont trabalhas ?* : où travailles-tu ?'
						},
						{
							q: 'Une boulangère :',
							options: ['una fornièra', 'una vendeira', 'una obrièra'],
							correct: 0,
							oc: true,
							choses: ['fornier-forniera'],
							explain: '*fornièr, fornièra* : le pain. *Vendeira* : elle vend ; *obrièra* : elle travaille à l’usine.'
						},
						{
							q: '*Fa de vinhairon.* Il…',
							options: ['travaille la vigne', 'fait le pain', 'soigne les gens'],
							correct: 0,
							choses: ['vinhairon'],
							explain: '*lo vinhairon* : le vigneron.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Je suis à la retraite.',
							answers: ['Soi a la retirada.', 'Ieu, soi a la retirada.'],
							choses: ['a-la-retirada']
						},
						{
							consigne: 'Écris : Lisa est ingénieure.',
							answers: ['Lisa fa d’engenhaira.', 'Lisa es engenhaira.'],
							choses: ['engenhaire-engenhaira', 'far-singular'],
							explain: '*d’engenhaira* : *de* devient *d’* devant une voyelle.'
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
					title: 'La semaine de Loís',
					intro:
						'Au village, Yasmine croise Loís devant la boulangerie. Plus tard, à Toulouse, Núria retrouve Karim à la sortie de l’hôpital (le village de Yasmine et de Marià est à vingt minutes de Toulouse en train : Núria y revient souvent). Lis une première fois pour répondre à une seule question : quel jour Loís ne travaille-t-il pas ?',
					scenes: [
						{
							title: 'Yasmine e Loís',
							subtitle: '(au village ; ils se tutoient)',
							lines: [
								{ oc: 'Loís, qué fas lo dimenge ?', sound: 'lou-ÍS, ké FAS lou di-MÉN-djé ?', fr: 'Loís, que fais-tu le dimanche ?' },
								{ oc: 'Lo dimenge ? Trabalhi ! La setmana, trabalhi de dimars a dimenge.', sound: 'lou di-MÉN-djé ? tra-BA-lyi ! la sém-MA-no, tra-BA-lyi dé di-MAS a di-MÉN-djé.', fr: 'Le dimanche ? Je travaille ! La semaine, je travaille du mardi au dimanche.' },
								{ oc: 'E lo diluns ?', sound: 'é lou di-LUNS ?', fr: 'Et le lundi ?' },
								{ oc: 'Lo diluns, trabalhi pas : jògui al rugbi amb los amics. E lo ser, canti a la corala.', sound: 'lou di-LUNS, tra-BA-lyi PAS : DJÒ-gui al RUG-bi am lou-za-MITS. é lou SÉ, CAN-ti a la cou-RA-lo.', fr: 'Le lundi, je ne travaille pas : je joue au rugby avec les amis. Et le soir, je chante à la chorale.' },
								{ oc: 'E dissabte, dançam al balèti ?', sound: 'é di-SAT-té, dan-SAN al ba-LÈ-ti ?', fr: 'Et samedi, on danse au bal ?' },
								{ oc: 'Dissabte, trabalhi… Mas diluns, òc !', sound: 'di-SAT-té, tra-BA-lyi… mas di-LUNS, OK !', fr: 'Samedi, je travaille… Mais lundi, oui !' },
								{ oc: 'I a pas de balèti lo diluns, Loís !', sound: 'ya PAS dé ba-LÈ-ti lou di-LUNS, lou-ÍS !', fr: 'Il n’y a pas de bal le lundi, Loís !' }
							]
						},
						{
							title: 'Núria e Karim',
							subtitle: '(à Toulouse ; ils se tutoient)',
							lines: [
								{ oc: 'Karim, qué fas lo dimenge ?', sound: 'ka-RIM, ké FAS lou di-MÉN-djé ?', fr: 'Karim, que fais-tu le dimanche ?' },
								{ oc: 'Lo dimècres e lo dimenge, jògui al rugbi. Jogam a Tolosa.', sound: 'lou di-MÈ-crés é lou di-MÉN-djé, DJÒ-gui al RUG-bi. djou-GAN a tou-LOU-zo.', fr: 'Le mercredi et le dimanche, je joue au rugby. Nous jouons à Toulouse.' },
								{ oc: 'E lo dissabte ?', sound: 'é lou di-SAT-té ?', fr: 'Et le samedi ?' },
								{ oc: 'Lo dissabte, trabalhi a l’espital. E tu ?', sound: 'lou di-SAT-té, tra-BA-lyi a lés-pi-TAL. é TU ?', fr: 'Le samedi, je travaille à l’hôpital. Et toi ?' },
								{ oc: 'Ieu, lo dimenge, camini amb Yasmine. E lo dijòus, Marià e ieu jogam a las cartas !', sound: 'YÉOU, lou di-MÉN-djé, ca-MI-ni am yas-MI-ne. é lou di-DJÒOUS, ma-ri-A é YÉOU djou-GAN a las CAR-tos !', fr: 'Moi, le dimanche, je me promène avec Yasmine. Et le jeudi, Marià et moi, nous jouons aux cartes !' },
								{ oc: 'Marià jòga a las cartas ?', sound: 'ma-ri-A DJÒ-go a las CAR-tos ?', fr: 'Marià joue aux cartes ?' },
								{ oc: 'Òc ! E Marià jòga plan !', sound: 'OK ! é ma-ri-A DJÒ-go PLA !', fr: 'Oui ! Et Marià joue bien !' }
							]
						}
					],
					glossary: [
						{ oc: 'de dimars a dimenge', sound: 'dé di-MAS a di-MÉN-djé', fr: 'du mardi au dimanche' },
						{ oc: 'amb los amics', sound: 'am lou-za-MITS', fr: 'avec les amis' },
						{ oc: 'lo rugbi', sound: 'lou RUG-bi', fr: 'le rugby' },
						{ oc: 'lo balèti', sound: 'lou ba-LÈ-ti', fr: 'le bal' },
						{ oc: 'las cartas', sound: 'las CAR-tos', fr: 'les cartes (à jouer)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Quel jour Loís ne travaille-t-il pas ?',
							options: ['le lundi', 'le samedi', 'le dimanche'],
							correct: 0,
							choses: ['diluns'],
							explain: '*Trabalhi de dimars a dimenge* : du mardi au dimanche. *Lo diluns, trabalhi pas.*'
						},
						{
							q: 'Le lundi, Loís…',
							options: ['joue au rugby avec les amis', 'danse au bal', 'marche avec Yasmine'],
							correct: 0,
							choses: ['jogar', 'amb', 'amic-amiga'],
							explain: '*Lo diluns… jògui al rugbi amb los amics.* Et le soir, il chante à la chorale.'
						},
						{
							q: 'Le jeudi, Núria…',
							options: ['joue aux cartes avec Marià', 'se promène avec Yasmine', 'joue au rugby'],
							correct: 0,
							choses: ['dijous', 'jogar'],
							explain: '*E lo dijòus, Marià e ieu jogam a las cartas !* Avec Yasmine, c’est le dimanche.'
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
					title: 'Une fois, ou chaque semaine ?',
					intro: 'Regarde le petit mot devant le jour.',
					items: [
						{
							q: '*Lo dimenge, trabalhi*, dit Loís. Il travaille…',
							options: ['chaque dimanche', 'ce dimanche seulement', 'jamais le dimanche'],
							correct: 0,
							choses: ['dimenge'],
							explain: '*lo dimenge* : le dimanche, chaque dimanche. C’est l’habitude.'
						},
						{
							q: '*Dissabte, dançam al balèti ?* propose Yasmine. Elle parle…',
							options: ['de ce samedi', 'de tous les samedis'],
							correct: 0,
							noShuffle: true,
							choses: ['dissabte'],
							explain: 'Sans *lo* : un jour précis, ce samedi. Avec *lo* : chaque samedi, comme *Lo dissabte, trabalhi a l’espital*.'
						},
						{
							q: '*I a pas de balèti lo diluns*, répond Yasmine. Ça veut dire…',
							options: ['il n’y a jamais de bal le lundi', 'il n’y a pas de bal ce lundi'],
							correct: 0,
							noShuffle: true,
							choses: ['diluns'],
							explain: '*lo diluns* : le lundi, tous les lundis. Yasmine taquine Loís.'
						},
						{
							q: '*La setmana, trabalhi de dimars a dimenge.* *La setmana*, c’est…',
							options: ['la semaine', 'le mois', 'la journée'],
							correct: 0,
							choses: ['la-setmana'],
							explain: '*la setmana* : la semaine. *de dimars a dimenge* : du mardi au dimanche.'
						},
						{
							q: 'Les jours ont tous le même début. Lequel ?',
							options: ['« di »', '« lo »', '« la »'],
							correct: 0,
							noShuffle: true,
							choses: ['diluns', 'dimenge'],
							explain: '*diluns, dimars, dimenge*… : « di », c’est le jour, du latin « diēs ». *Lo* et *la* viennent devant.'
						},
						{
							q: '*Jògui al rugbi*, dit Karim, mais *jogam a Tolosa*. Pourquoi *ò* d’un côté, *o* de l’autre ?',
							options: ['la voix appuie sur « JÒ » dans *jògui*, pas dans *jogam*', 'parce que Karim parle de lui seul'],
							correct: 0,
							noShuffle: true,
							choses: ['jogar'],
							explain: '« DJÒ-gui », mais « djou-GAN » : sous la voix, *ò* sonne « o » ; sinon, *o* sonne « ou ». Comme *demòri*, *demoram*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Une fois, ou chaque semaine',
					intro: 'Tout est dans le petit mot *lo*.',
					head: ['', 'une fois (ce jour-là)', 'chaque semaine'],
					rows: [
						['samedi', '*Dissabte, dançam ?*', '*Lo dissabte, trabalhi.*'],
						['lundi', '*Mas diluns, òc !*', '*Lo diluns, trabalhi pas.*'],
						['dimanche', '*Dimenge, canti.*', '*Lo dimenge, trabalhi.*']
					],
					notes: [
						'Sans *lo* : un jour précis, celui qui vient. Avec *lo* : chaque semaine, l’habitude.',
						'Les sept jours commencent tous par « di » : *diluns, dimars, dimècres, dijòus, divendres, dissabte, dimenge*.',
						'*jogar* : *jògui, jògas, jòga, jogam, jogatz, jògan*. Un *ò* quand la voix appuie dessus, et « gu » devant *i* pour garder le son « g ».'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'la-setmana', oc: 'la setmana', sound: 'la sém-MA-no', fr: 'la semaine' },
						{ id: 'dimenge', oc: 'dimenge · lo dimenge', sound: 'di-MÉN-djé · lou di-MÉN-djé', fr: 'dimanche · le dimanche (chaque dimanche)' },
						{ id: 'dissabte', oc: 'dissabte', sound: 'di-SAT-té', fr: 'samedi' },
						{ id: 'diluns', oc: 'diluns', sound: 'di-LUNS', fr: 'lundi' },
						{ id: 'jogar', oc: 'jogar : jògui · jògas · jòga · jogam · jogatz · jògan', sound: 'djou-GA : DJÒ-gui · DJÒ-gos · DJÒ-go · djou-GAN · djou-GATS · DJÒ-gon', fr: 'jouer (*jògui* : le u garde le son « g »)' }
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
					type: 'chunks',
					title: 'À retenir : les quatre autres jours',
					intro: 'Avec *diluns*, *dissabte* et *dimenge*, tu as toute la semaine.',
					items: [
						{ id: 'dimars', oc: 'dimars', sound: 'di-MAS', fr: 'mardi' },
						{ id: 'dimecres', oc: 'dimècres', sound: 'di-MÈ-crés', fr: 'mercredi' },
						{ id: 'dijous', oc: 'dijòus', sound: 'di-DJÒOUS', fr: 'jeudi' },
						{ id: 'divendres', oc: 'divendres', sound: 'di-BÉN-drés', fr: 'vendredi' }
					]
				},
				// jeu prévu par la carte : mots mêlés des jours (à coder).
				// Version simple : qcm, une ligne de la grille à la fois ; on
				// trouve le jour caché, puis on dit lequel c'est.
				{
					type: 'qcm',
					title: 'Mots mêlés : les jours',
					intro: 'Dans chaque ligne de la grille, un jour se cache parmi d’autres lettres. Trouve-le, puis dis quel jour c’est.',
					items: [
						{
							q: 'Ligne 1 : « T A D I L U N S O »',
							options: ['lundi', 'mardi', 'jeudi'],
							correct: 0,
							choses: ['diluns'],
							explain: '*diluns* : lundi.'
						},
						{
							q: 'Ligne 2 : « O D I M A R S E L »',
							options: ['mardi', 'mercredi', 'samedi'],
							correct: 0,
							choses: ['dimars'],
							explain: '*dimars* : mardi.'
						},
						{
							q: 'Ligne 3 : « L D I M È C R E S U »',
							options: ['mercredi', 'mardi', 'vendredi'],
							correct: 0,
							choses: ['dimecres'],
							explain: '*dimècres* : mercredi.'
						},
						{
							q: 'Ligne 4 : « A S D I J Ò U S T »',
							options: ['jeudi', 'lundi', 'dimanche'],
							correct: 0,
							choses: ['dijous'],
							explain: '*dijòus* : jeudi.'
						},
						{
							q: 'Ligne 5 : « M D I V E N D R E S »',
							options: ['vendredi', 'mercredi', 'samedi'],
							correct: 0,
							choses: ['divendres'],
							explain: '*divendres* : vendredi.'
						},
						{
							q: 'Ligne 6 : « E D I S S A B T E R »',
							options: ['samedi', 'vendredi', 'mardi'],
							correct: 0,
							choses: ['dissabte'],
							explain: '*dissabte* : samedi.'
						},
						{
							q: 'Ligne 7 : « D I M E N G E L A S »',
							options: ['dimanche', 'lundi', 'jeudi'],
							correct: 0,
							choses: ['dimenge'],
							explain: '*dimenge* : dimanche.'
						}
					]
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
					type: 'chunks',
					title: 'À retenir : avec qui ?',
					intro: 'Pour dire avec qui tu fais les choses.',
					items: [
						{ id: 'amb', oc: 'amb', sound: 'AM(B)', fr: 'avec (*amb mon fraire*)' },
						{ id: 'amic-amiga', oc: 'l’amic · l’amiga · los amics · las amigas', sound: 'la-MIC · la-MI-go · lou-za-MITS · la-za-MI-gos', fr: 'l’ami · l’amie · les amis · les amies' }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Les sept jours, de lundi à dimanche.',
							tiles: ['diluns', 'dimars', 'dimècres', 'dijòus', 'divendres', 'dissabte', 'dimenge'],
							choses: ['diluns', 'dimars', 'dimecres', 'dijous', 'divendres', 'dissabte', 'dimenge'],
							explain: '*diluns, dimars, dimècres, dijòus, divendres, dissabte, dimenge* : la semaine commence le lundi.'
						},
						{
							prompt: 'Le jeudi, Marià joue aux cartes avec Núria.',
							tiles: ['Lo', 'dijòus,', 'Marià', 'jòga', 'a', 'las', 'cartas', 'amb', 'Núria.'],
							choses: ['dijous', 'jogar', 'amb'],
							explain: '*Lo dijòus* : chaque jeudi. *jòga* : la voix appuie sur « DJÒ ».'
						},
						{
							prompt: 'La semaine, je travaille ; le dimanche, je joue avec les amis.',
							tiles: ['La', 'setmana,', 'trabalhi ;', 'lo', 'dimenge,', 'jògui', 'amb', 'los', 'amics.'],
							choses: ['la-setmana', 'dimenge', 'jogar', 'amic-amiga'],
							explain: '*amb los amics* : avec les amis.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Que fais-tu le dimanche ? Réponds pour toi : *Lo dimenge, …*',
							debut: ['Lo dimenge', 'Ieu, lo dimenge'],
							choses: ['dimenge'],
							explain: 'Par exemple : *Lo dimenge, trabalhi.* · *Lo dimenge, camini.* · *Lo dimenge, jògui a las cartas.*'
						},
						{
							consigne: 'Demande à une amie ce qu’elle fait le dimanche.',
							answers: ['Qué fas lo dimenge ?', 'E tu, qué fas lo dimenge ?'],
							choses: ['dimenge', 'far-singular']
						},
						{
							consigne: 'Une seule fois, ce mardi : « Mardi, je travaille. »',
							answers: ['Dimars, trabalhi.'],
							choses: ['dimars'],
							explain: 'Sans *lo* : ce mardi-là. *Lo dimars, trabalhi* voudrait dire chaque mardi.'
						},
						{
							consigne: 'Chaque mercredi : « Le mercredi, il joue au rugby. »',
							answers: ['Lo dimècres, jòga al rugbi.'],
							choses: ['dimecres', 'jogar'],
							explain: '*Lo dimècres* : chaque mercredi. *jòga* : il ou elle joue.'
						},
						{
							consigne: 'Écris : le vendredi, nous dansons avec les amies.',
							answers: ['Lo divendres, dançam amb las amigas.'],
							choses: ['divendres', 'amb', 'amic-amiga'],
							explain: '*las amigas* : les amies ; *los amics* : les amis, ou un groupe mêlé.'
						},
						{
							consigne: 'Écris : le samedi, je me promène avec ma sœur.',
							answers: ['Lo dissabte, camini amb ma sòrre.'],
							choses: ['dissabte', 'amb'],
							explain: '*amb ma sòrre* : avec ma sœur.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : ta semaine',
					intro: 'Dis trois jours de ta semaine : ce que tu fais, et avec qui. Puis compare au modèle.',
					items: [
						{
							q: 'Trois jours, trois habitudes.',
							a: 'Par exemple : *Lo diluns, trabalhi. Lo dimècres, jògui a las cartas amb mon fraire. Lo dimenge, camini amb las amigas.*'
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
					title: 'Le son du jour : j, et g devant e ou i, sonnent « dj »',
					paragraphs: [
						'Le *j*, et le *g* devant *e* ou *i*, sonnent « dj » : *dijòus* « di-DJÒOUS », *dimenge* « di-MÉN-djé ».',
						'Tu l’entends depuis longtemps : *vilatge* « bi-LA-djé », *mangi* « MAN-dji », *regent* « ré-DJÉN ».',
						'Écoute, puis répète : *dijòus*, *dimenge*, *jògui*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*dijòus* se dit…',
							options: ['di-DJÒOUS', 'di-JOUS'],
							correct: 0,
							noShuffle: true,
							explain: '« di-JOUS », c’est la lecture à la française. En occitan, le *j* sonne « dj », et *ò* sonne « o » : « di-DJÒOUS ».'
						},
						{
							q: '*dimenge* se dit…',
							options: ['di-MÉN-djé', 'di-MANJ'],
							correct: 0,
							noShuffle: true,
							explain: '« di-MANJ », c’est la lecture à la française. En occitan, « ge » sonne « djé », et le *e* final se dit : « di-MÉN-djé ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Lo dijòus, jògui amb Marià.*',
							a: '« lou di-DJÒOUS, DJÒ-gui am ma-ri-A » : deux « dj », dans *dijòus* et *jògui*.'
						},
						{
							q: '*Lo dimenge, mangi amb los amics, al vilatge.*',
							a: '« lou di-MÉN-djé, MAN-dji am lou-za-MITS, al bi-LA-djé » : trois « dj », sans forcer.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : les jours viennent du latin',
					paragraphs: [
						'*Diluns* vient du latin « diēs Lūnae », le jour de la Lune ; *dimars*, de « diēs Mārtis », le jour de Mars ; *dimenge*, de « diēs Dominicus », le jour du Seigneur. Le catalan fait de même (« dilluns », « diumenge »), et le français aussi : « dimanche ».',
						'Source : Wiktionnaire (en anglais), articles « diluns », « dimars », « dimenge ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire les sept jours de la semaine',
						'dire ce que je fais un jour précis, ou chaque semaine avec *lo*',
						'demander à quelqu’un ce qu’il fait le dimanche',
						'dire avec qui je fais les choses'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ce que tu fais dans la semaine, et avec qui.',
						'Si tu en as envie : demande *Qué fas lo dimenge ?* à une personne précise, ta voisine, un ami du club, ta sœur. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
