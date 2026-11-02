// Module 4.1 · A1 · « Ont trabalhas ? » : unité 4 (Qué fas ?), rédigé par
// Claude le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : le présent des verbes en -ar, six personnes (lexic-A1.md, 4.1).
// Scène de l'unité : la semaine de Loís. Ici, le soir, à la chorale du village.
// Jeu du jour : remettre dans l'ordre, tuiles de verbes (order).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01, plus
// trobador, trobar, corala, espital le 2026-11-01), à valider par Romain.

export const modul41 = {
	id: 'modul-4-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '4-1',
	unitat: 'Unitat 4 · Qué fas ?',
	nivel: 'A1 · Modul 4.1',
	oc: 'Ont trabalhas ?',
	fr: 'Où travailles-tu ? Dire ce qu’on fait, aux six personnes',
	cando:
		'Je peux dire où je travaille et ce que je fais le soir, le demander, et parler de nous, de vous ou d’eux : un verbe en -ar à ses six personnes.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25), comme en 1.1.
	ouverture: {
		numero: 4,
		bloc: { oc: 'Ieu e los meus', fr: 'moi et les miens' },
		titre: 'Qué fas ?',
		fr: 'que fais-tu ?',
		question: 'Ont trabalhas ?',
		questionFr: 'où travailles-tu ?',
		phrase:
			'Une semaine avec Loís. En quatre modules, tu sauras dire ce que tu fais, ton métier, ce que tu fais le dimanche, puis tu mèneras ton petit sondage. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Marià', 'Núria', 'Yasmine'],
	notesRelecture: [
		'*vosautres, vosautras* : l’API a renvoyé une erreur (⚠️, déjà signalé dans le lexique). Tu les valides tels quels ?',
		'*nautres, vautres* : absents du Basic (⚠️), montrés seulement en note avec leurs pays (Rouergue, Quercy, Albigeois), comme le cadre §3. On les garde ?',
		'Sons proposés : *parlam* « par-LAN » (le m final sonne « n ») et *parlan* « PAR-lon ». C’est bien ton usage ?',
		'*Non canti pas plan* (je ne chante pas bien), dit Karim : naturel pour toi ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des unités 2 et 3',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Tu parles occitan ?',
							options: ['Parlas occitan ?', 'Parli occitan ?', 'Parla occitan ?'],
							correct: 0,
							oc: true,
							choses: ['parlar-singular'],
							explain: '*Parlas* : tu parles. Retiens la fin *-as* : elle revient aujourd’hui.'
						},
						{
							q: 'Ma sœur a douze ans :',
							options: ['Ma sòrre a dotze ans.', 'Ma sòrre a tretze ans.', 'Mon fraire a dotze ans.'],
							correct: 0,
							oc: true,
							choses: ['la-sorre', 'a-ans', 'nombre-12'],
							explain: '*sòrre* : sœur ; *dotze* : 12 (*tretze*, c’est 13).'
						},
						{
							q: 'La mère de ton père, c’est…',
							options: ['la mameta', 'la tanta', 'la cosina'],
							correct: 0,
							oc: true,
							choses: ['papeta-mameta'],
							explain: '*la mameta* : la grand-mère ; *lo papeta* : le grand-père.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Je n’ai pas de chien.',
							answers: ['Non ai pas de can.'],
							choses: ['ai-pas-de', 'lo-can'],
							explain: 'Après *pas*, on dit *de* : *Non ai pas de can.*'
						},
						{
							consigne: 'Demande à une amie quel âge elle a.',
							answers: ['Quant as d’ans ?'],
							choses: ['quant-as-d-ans'],
							explain: 'Mot à mot : combien as-tu d’ans ?'
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
					title: 'Le soir, à la chorale',
					intro:
						'C’est le soir, au village : la chorale répète. Karim, venu de Toulouse, est là pour écouter ; Loís l’accueille. Puis Marià arrive : elle chante dans la chorale depuis toujours, et Karim la vouvoie. Lis une première fois pour répondre à une seule question : qui chante, et qui écoute ?',
					scenes: [
						{
							title: 'Loís e Karim',
							subtitle: '(Loís et Karim, qui se tutoient)',
							lines: [
								{ oc: 'Adieu, Karim ! Qué fas aquí ?', sound: 'a-DIOU, ka-RIM ! ké FAS a-KI ?', fr: 'Salut, Karim ! Que fais-tu ici ?' },
								{ oc: 'Adieu ! Escoti la corala. Non canti pas plan…', sound: 'a-DIOU ! es-COU-ti la cou-RA-lo. nou CAN-ti pas PLA…', fr: 'Salut ! J’écoute la chorale. Je ne chante pas bien…' },
								{ oc: 'Aquí, cantam en occitan. Parlas occitan ?', sound: 'a-KI, can-TAN én ou-tsi-TA. PAR-los ou-tsi-TA ?', fr: 'Ici, nous chantons en occitan. Tu parles occitan ?' },
								{ oc: 'Òc, un pauc. E tu, ont trabalhas ?', sound: 'OK, un PAOUK. é TU, oun tra-BA-lyos ?', fr: 'Oui, un peu. Et toi, où travailles-tu ?' },
								{ oc: 'Trabalhi aquí, al vilatge : cosini !', sound: 'tra-BA-lyi a-KI, al bi-LA-djé : cou-ZI-ni !', fr: 'Je travaille ici, au village : je cuisine !' },
								{ oc: 'Ieu, trabalhi a Tolosa, a l’espital.', sound: 'YÉOU, tra-BA-lyi a tou-LOU-zo, a lés-pi-TAL.', fr: 'Moi, je travaille à Toulouse, à l’hôpital.' }
							]
						},
						{
							title: 'Marià e Karim',
							subtitle: '(Marià parle à Karim et à Loís ; Karim répond)',
							lines: [
								{ oc: 'Bon ser ! Vosautres, parlatz o cantatz ?', sound: 'bou(n) SÉR ! bou-ZAOU-trés, par-LATS ou can-TATS ?', fr: 'Bonsoir ! Vous deux, vous parlez ou vous chantez ?' },
								{ oc: 'Parlam ! Loís canta… e ieu, escoti.', sound: 'par-LAN ! lou-ÍS CAN-to… é YÉOU, es-COU-ti.', fr: 'Nous parlons ! Loís chante… et moi, j’écoute.' },
								{ oc: 'Aquí, non escotam pas : cantam ! Ont trabalhatz, vosautres ?', sound: 'a-KI, nou es-cou-TAN PAS : can-TAN ! oun tra-ba-LYATS, bou-ZAOU-trés ?', fr: 'Ici, on n’écoute pas : on chante ! Où travaillez-vous, vous deux ?' },
								{ oc: 'Ieu, trabalhi a Tolosa, e Loís trabalha aquí. E vos ?', sound: 'YÉOU, tra-BA-lyi a tou-LOU-zo, é lou-ÍS tra-BA-lyo a-KI. é BOUS ?', fr: 'Moi, je travaille à Toulouse, et Loís travaille ici. Et vous ?' },
								{ oc: 'Ieu ? Non trabalhi pas : canti, camini ! Yasmine e Núria cantan tanben.', sound: 'YÉOU ? nou tra-BA-lyi PAS : CAN-ti, ca-MI-ni ! yas-MI-ne é NOU-ria CAN-ton tam-BÉ.', fr: 'Moi ? Je ne travaille pas : je chante, je marche ! Yasmine et Núria chantent aussi.' },
								{ oc: 'E parlan occitan ?', sound: 'é PAR-lon ou-tsi-TA ?', fr: 'Et elles parlent occitan ?' },
								{ oc: 'Òc ! Aquí, parlam occitan, e cantam en occitan.', sound: 'OK ! a-KI, par-LAN ou-tsi-TA, é can-TAN én ou-tsi-TA.', fr: 'Oui ! Ici, nous parlons occitan, et nous chantons en occitan.' }
							]
						}
					],
					glossary: [
						{ oc: 'la corala', sound: 'la cou-RA-lo', fr: 'la chorale' },
						{ oc: 'l’espital', sound: 'lés-pi-TAL', fr: 'l’hôpital' },
						{ oc: 'al vilatge', sound: 'al bi-LA-djé', fr: 'au village (a + lo = al)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui chante, et qui écoute ?',
							options: ['Loís et Marià chantent, Karim écoute.', 'Karim chante, Loís écoute.', 'Marià écoute, Karim chante.'],
							correct: 0,
							choses: ['cantar', 'escotar'],
							explain: 'Karim : *Escoti la corala. Non canti pas plan…* Marià : *Aquí, non escotam pas : cantam !*'
						},
						{
							q: '*Qué fas aquí ?* demande Loís. Karim répond…',
							options: ['qu’il écoute la chorale', 'qu’il travaille à l’hôpital', 'qu’il habite à Toulouse'],
							correct: 0,
							choses: ['que-fas'],
							explain: '*Qué fas ?* : que fais-tu ? Karim : *Escoti la corala.*'
						},
						{
							q: 'Au village, Loís travaille : il…',
							options: ['cuisine', 'chante', 'écoute la chorale'],
							correct: 0,
							choses: ['trabalhar', 'cosinar'],
							explain: '*Trabalhi aquí, al vilatge : cosini !* Le soir, il chante ; c’est Karim qui écoute.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Obsèrva
		{
			title: 'Obsèrva',
			fr: 'observe',
			minutes: 12,
			blocks: [
				{
					type: 'qcm',
					title: 'La fin du verbe dit qui',
					intro:
						'En occitan, pas besoin de « je » ou de « nous » : la fin du verbe dit qui fait l’action. Regarde la fin, et écoute où la voix appuie.',
					items: [
						{
							q: '*Escoti la corala*, dit Karim. Qui écoute ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['escotar'],
							explain: '*-i* : je. Comme *parli*, *compreni*.'
						},
						{
							q: '*Aquí, cantam en occitan.* Qui chante ?',
							options: ['nous', 'ils ou elles', 'vous'],
							correct: 0,
							choses: ['cantar'],
							explain: '*-am* : nous. La voix appuie sur la fin : « can-TAN ».'
						},
						{
							q: '*Ont trabalhatz ?* Marià demande à…',
							options: ['Karim et Loís : vous', 'Karim seul : tu', 'elle-même : je'],
							correct: 0,
							choses: ['trabalhar'],
							explain: '*-atz* : vous, à plusieurs ou en vouvoyant. Tu le connais déjà : *Cossí anatz ?*'
						},
						{
							q: '*Yasmine e Núria cantan tanben.* La fin *-an* dit…',
							options: ['ils ou elles', 'nous', 'vous'],
							correct: 0,
							choses: ['cantar'],
							explain: '*-an* : ils ou elles. Ici la voix appuie avant la fin : « CAN-ton ».'
						},
						{
							q: '*Parlam* ou *parlan* : lequel veut dire « nous parlons » ?',
							options: ['parlam', 'parlan'],
							correct: 0,
							oc: true,
							choses: ['parlar-plural'],
							explain: 'Nous : *parlam*, avec un *m*, et la voix appuie sur la fin, « par-LAN ». *Parlan* « PAR-lon », c’est « ils parlent ».'
						},
						{
							q: '*Vosautres, parlatz o cantatz ?* Le mot *vosautres* sert à…',
							options: ['insister sur « vous »', 'dire « nous »', 'dire « eux »'],
							correct: 0,
							choses: ['pronoms-plural'],
							explain: '*vosautres* : vous. Il sert seulement à insister : *parlatz* suffit.'
						}
					]
				},
				{
					type: 'table',
					title: 'Six personnes, six fins : parlar',
					intro: 'Tu l’as entendu dans la scène : on enlève -ar, et on ajoute la fin qui dit qui parle.',
					head: ['', 'la fin', '*parlar*', 'ça sonne comme'],
					rows: [
						['je', '-i', '*parli*', '« PAR-li »'],
						['tu', '-as', '*parlas*', '« PAR-los »'],
						['il, elle', '-a', '*parla*', '« PAR-lo »'],
						['nous', '-am', '*parlam*', '« par-LAN » : la voix appuie sur la fin'],
						['vous', '-atz', '*parlatz*', '« par-LATS » : la voix appuie sur la fin'],
						['ils, elles', '-an', '*parlan*', '« PAR-lon »']
					],
					notes: [
						'Même chose pour les autres verbes en -ar de la scène, *trabalhar*, *escotar*, *cosinar* : *trabalhi, trabalhas, trabalha, trabalham, trabalhatz, trabalhan*.',
						'Pour insister seulement : *ieu*, *tu*, *el* ou *ela*, *nosautres* ou *nosautras*, *vosautres* ou *vosautras*, *eles* ou *elas*. On entend aussi *nautres* et *vautres* (Rouergue, Quercy, Albigeois).',
						'Deux détails d’écriture, pour garder le même son devant *i* : *manjar*, mais *mangi* ; *dançar*, mais *danci*.'
					],
					// formes d'autres pays du languedocien (cadre §3) : ⚠️ absentes du Basic
					glosa: { nautres: 'nous (Rouergue, Quercy, Albigeois)', vautres: 'vous (Rouergue, Quercy, Albigeois)' }
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'que-fas', oc: 'Qué fas ?', sound: 'ké FAS', fr: 'que fais-tu ? (titre de l’unité : le verbe s’explique au module suivant)' },
						{ id: 'trabalhar', oc: 'trabalhar : trabalhi · trabalhas · trabalha · trabalham · trabalhatz · trabalhan', sound: 'tra-ba-LYA : tra-BA-lyi · tra-BA-lyos · tra-BA-lyo · tra-ba-LYAN · tra-ba-LYATS · tra-BA-lyon', fr: 'travailler : je travaille, tu travailles, il ou elle travaille, nous travaillons, vous travaillez, ils ou elles travaillent' },
						{ id: 'parlar-plural', oc: 'parlam · parlatz · parlan', sound: 'par-LAN · par-LATS · PAR-lon', fr: 'nous parlons · vous parlez · ils ou elles parlent' },
						{ id: 'pronoms-plural', oc: 'nosautres, nosautras · vosautres, vosautras · eles, elas', sound: 'nou-ZAOU-trés, nou-ZAOU-tros · bou-ZAOU-trés, bou-ZAOU-tros · É-lés, É-los', fr: 'nous · vous · eux, elles (pour insister seulement : la fin du verbe suffit)' }
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 12,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir : cinq verbes de plus',
					intro: 'Ils font tous comme parlar.',
					items: [
						{ id: 'cantar', oc: 'cantar : canti · cantas · canta · cantam · cantatz · cantan', sound: 'can-TA : CAN-ti · CAN-tos · CAN-to · can-TAN · can-TATS · CAN-ton', fr: 'chanter' },
						{ id: 'manjar', oc: 'manjar : mangi · manjas · manja · manjam · manjatz · manjan', sound: 'man-DJA : MAN-dji · MAN-djos · MAN-djo · man-DJAN · man-DJATS · MAN-djon', fr: 'manger (*mangi* : g devant i)' },
						{ id: 'dancar', oc: 'dançar : danci · danças · dança · dançam · dançatz · dançan', sound: 'dan-SA : DAN-si · DAN-sos · DAN-so · dan-SAN · dan-SATS · DAN-son', fr: 'danser (*danci* : c devant i)' },
						{ id: 'caminar', oc: 'caminar : camini · caminas · camina · caminam · caminatz · caminan', sound: 'ca-mi-NA : ca-MI-ni · ca-MI-nos · ca-MI-no · ca-mi-NAN · ca-mi-NATS · ca-MI-non', fr: 'marcher' },
						{ id: 'demorar-plural', oc: 'demoram · demoratz · demòran', sound: 'dé-mou-RAN · dé-mou-RATS · dé-MÒ-ron', fr: 'nous habitons · vous habitez · ils ou elles habitent' }
					]
				},
				{
					type: 'qcm',
					title: 'Échauffement : qui ?',
					intro: 'Regarde la fin du verbe, puis choisis.',
					items: [
						{
							q: '*Manjam !*',
							options: ['nous mangeons', 'ils mangent', 'vous mangez'],
							correct: 0,
							choses: ['manjar'],
							explain: '*-am* : nous, « man-DJAN ».'
						},
						{
							q: '*Non danci pas.*',
							options: ['je ne danse pas', 'elle ne danse pas', 'tu ne danses pas'],
							correct: 0,
							choses: ['dancar'],
							explain: '*-i* : je. On écrit *c* devant *i*, pour garder le son « s ».'
						},
						{
							q: '*Caminatz lo ser ?*',
							options: ['Vous marchez le soir ?', 'Tu marches le soir ?', 'Ils marchent le soir ?'],
							correct: 0,
							choses: ['caminar'],
							explain: '*-atz* : vous, « ca-mi-NATS ».'
						},
						{
							q: '*Demòran a Tolosa.*',
							options: ['ils habitent à Toulouse', 'nous habitons à Toulouse', 'vous habitez à Toulouse'],
							correct: 0,
							choses: ['demorar-plural'],
							explain: '*-an* : ils ou elles. Le *ò* revient quand la voix appuie dessus : « dé-MÒ-ron ».'
						}
					]
				},
				// jeu prévu par la carte : remettre dans l'ordre (tuiles de verbes).
				// Version simple avec `order` : les tuiles sont les formes d'un verbe,
				// à toucher dans l'ordre des personnes demandé (la forme est le jeu).
				{
					type: 'order',
					title: 'Tuiles de verbes',
					intro: 'Touche les formes dans l’ordre des personnes demandé. Une mauvaise tuile tremble, rien de grave.',
					items: [
						{
							prompt: '*cantar*, dans l’ordre : je, tu, il ou elle, nous, vous, ils ou elles.',
							tiles: ['canti', 'cantas', 'canta', 'cantam', 'cantatz', 'cantan'],
							choses: ['cantar'],
							explain: 'Les six fins : -i, -as, -a, -am, -atz, -an.'
						},
						{
							prompt: '*trabalhar*, dans cet ordre : vous, je, ils ou elles, tu, nous, il ou elle.',
							tiles: ['trabalhatz', 'trabalhi', 'trabalhan', 'trabalhas', 'trabalham', 'trabalha'],
							choses: ['trabalhar'],
							explain: 'Le piège : *trabalham* (nous), *trabalhan* (ils ou elles).'
						},
						{
							prompt: '*manjar*, dans cet ordre : nous, je, elles, tu.',
							tiles: ['manjam', 'mangi', 'manjan', 'manjas'],
							choses: ['manjar'],
							explain: '*mangi* : un *g* devant *i*, pour garder le son « dj ».'
						},
						{
							prompt: '*dançar*, dans cet ordre : elle, vous, je, nous.',
							tiles: ['dança', 'dançatz', 'danci', 'dançam'],
							choses: ['dancar'],
							explain: '*danci* : un *c* devant *i*, pour garder le son « s ».'
						},
						{
							prompt: '*demorar* (habiter), dans cet ordre : nous, ils, vous.',
							tiles: ['demoram', 'demòran', 'demoratz'],
							choses: ['demorar-plural'],
							explain: '*demòran* : la voix appuie sur « MÒ ». Dans *demoram* et *demoratz*, elle appuie sur la fin, et le *o* sonne « ou ».'
						}
					],
					glosa: { demorar: 'habiter (demòri, demoram…)' }
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
					type: 'chunks',
					title: 'À retenir : deux verbes de la scène',
					intro: 'Tu les as entendus à la chorale.',
					items: [
						{ id: 'escotar', oc: 'escotar : escoti · escotas · escota · escotam · escotatz · escotan', sound: 'es-cou-TA : es-COU-ti · es-COU-tos · es-COU-to · es-cou-TAN · es-cou-TATS · es-COU-ton', fr: 'écouter' },
						{ id: 'cosinar', oc: 'cosinar : cosini · cosinas · cosina · cosinam · cosinatz · cosinan', sound: 'cou-zi-NA : cou-ZI-ni · cou-ZI-nos · cou-ZI-no · cou-zi-NAN · cou-zi-NATS · cou-ZI-non', fr: 'cuisiner' }
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Dis où tu travailles : je travaille à… (ta ville). Ou bien : je ne travaille pas.',
							answers: ['Non trabalhi pas.', 'Trabalhi aquí.'],
							debut: ['Trabalhi a', 'Ieu, trabalhi a', 'Non trabalhi pas', 'Ieu, non trabalhi pas'],
							choses: ['trabalhar'],
							explain: '*Trabalhi a…*, puis ta ville. Ou *Non trabalhi pas.*'
						},
						{
							consigne: 'Demande à ton amie où elle travaille.',
							answers: ['Ont trabalhas ?', 'E tu, ont trabalhas ?'],
							choses: ['trabalhar'],
							explain: '*-as* : tu.'
						},
						{
							consigne: 'Ton ami est là, à la chorale : demande-lui ce qu’il fait ici.',
							answers: ['Qué fas aquí ?', 'Qué fas ?', 'E tu, qué fas aquí ?'],
							choses: ['que-fas'],
							explain: '*Qué fas aquí ?* : la question de Loís à Karim.'
						},
						{
							consigne: 'Tu cuisines ? Réponds pour toi : je cuisine, je cuisine un peu, ou je ne cuisine pas.',
							answers: ['Cosini.', 'Òc, cosini.', 'Cosini un pauc.', 'Cosini plan.', 'Non cosini pas.'],
							choses: ['cosinar'],
							explain: '*Cosini* ; pour dire non : *Non cosini pas*, avec *non* devant le verbe et *pas* après.'
						},
						{
							consigne: 'Et le soir, tu marches ? Réponds pour toi.',
							answers: ['Òc, camini.', 'Camini.', 'Lo ser, camini.', 'Non camini pas.', 'Lo ser, non camini pas.'],
							choses: ['caminar'],
							explain: '*Lo ser, camini* : le soir, je marche.'
						},
						{
							consigne: 'Demande à deux amis où ils travaillent.',
							answers: ['Ont trabalhatz ?', 'E vosautres, ont trabalhatz ?', 'Vosautres, ont trabalhatz ?', 'Vosautras, ont trabalhatz ?'],
							choses: ['trabalhar'],
							explain: '*-atz* : vous, à plusieurs.'
						},
						{
							consigne: 'Après la chorale, Loís dit : « Nous mangeons ici ! » Écris-le.',
							answers: ['Manjam aquí !', 'Nosautres, manjam aquí !'],
							choses: ['manjar'],
							explain: '*manjam* : nous, « man-DJAN ».'
						},
						{
							consigne: 'À la chorale : nous écoutons, nous ne parlons pas !',
							answers: ['Escotam, non parlam pas !', 'Nosautres, escotam, non parlam pas !', 'Nosautras, escotam, non parlam pas !'],
							choses: ['escotar', 'parlar-plural'],
							explain: '*-am* deux fois : *escotam*, *parlam*.'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Marià et moi, nous habitons ici ; Karim habite à Toulouse.',
							tiles: ['Marià', 'e', 'ieu,', 'demoram', 'aquí ;', 'Karim', 'demòra', 'a', 'Tolosa.'],
							choses: ['demorar-plural'],
							explain: '*demoram* (nous), *demòra* (il) : le *ò* revient quand la voix appuie dessus.'
						},
						{
							prompt: 'Vous, vous parlez ; nous, nous chantons !',
							tiles: ['Vosautres,', 'parlatz ;', 'nosautres,', 'cantam !'],
							choses: ['pronoms-plural', 'parlar-plural', 'cantar'],
							explain: '*Vosautres*, *nosautres* : pour insister, comme Marià à la chorale.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Présente une personne que tu connais : où elle travaille, ce qu’elle fait le soir, si elle parle occitan. Puis compare au modèle.',
					items: [
						{
							q: 'Ton frère, ta voisine, une collègue…',
							a: 'Par exemple : *Mon fraire trabalha a Tolosa. Lo ser, cosina, canta e dança. Parla un pauc occitan.*'
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
					title: 'Le son du jour : la syllabe forte des terminaisons',
					paragraphs: [
						'Pour nous et vous, la voix appuie sur la fin : *parlam* « par-LAN », *parlatz* « par-LATS », comme *anatz* « a-NATS » dans *Cossí anatz ?*',
						'Pour les autres personnes, elle appuie avant : *parlas* « PAR-los », *parlan* « PAR-lon ».',
						'C’est la syllabe forte qui sépare *parlam* (nous) de *parlan* (ils) : à l’oreille, ils ne se ressemblent plus.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Cantam* (nous chantons) se dit…',
							options: ['can-TAN', 'CAN-ton'],
							correct: 0,
							noShuffle: true,
							explain: 'Nous : la voix appuie sur la fin. « CAN-ton », c’est *cantan* (ils chantent).'
						},
						{
							q: '*Trabalhan* (ils travaillent) se dit…',
							options: ['tra-BA-lyon', 'tra-ba-LYAN'],
							correct: 0,
							noShuffle: true,
							explain: 'Ils : la voix appuie avant la fin. « tra-ba-LYAN », c’est *trabalham* (nous).'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase en appuyant au bon endroit, puis regarde.',
					items: [
						{
							q: '*Parlam occitan, e cantan en occitan.*',
							a: '« par-LAN ou-tsi-TA, é CAN-ton én ou-tsi-TA » : nous parlons occitan, et ils chantent en occitan.'
						},
						{
							q: '*Vosautres, parlatz o cantatz ?*',
							a: '« bou-ZAOU-trés, par-LATS ou can-TATS ? » : deux fois, la voix appuie sur la fin.'
						},
						{
							q: '*Demoram aquí, e demòran a Tolosa.*',
							a: '« dé-mou-RAN a-KI, é dé-MÒ-ron a tou-LOU-zo » : nous habitons ici, et ils habitent à Toulouse. La voix recule, et le *o* devient *ò*.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : troubadour, un nom de métier',
					glosa: { trobador: 'troubadour, poète et compositeur', trobar: 'trouver, composer' },
					paragraphs: [
						'Le mot « troubadour » vient de l’occitan *trobador* : celui qui compose, de *trobar*, « trouver », un verbe en -ar comme *cantar*. Le français l’a emprunté : sa première trace écrite date de 1575.',
						'Source : TLFi, article « troubadour ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire où je travaille, et le demander',
						'dire ce que je fais le soir : chanter, cuisiner, marcher…',
						'faire parler un verbe en -ar à ses six personnes',
						'entendre la différence entre *parlam* et *parlan*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ce que tu fais, et le demander aux autres.',
						'Si tu en as envie : demande *Ont trabalhas ?* à une personne précise, un ami, une collègue, ton cousin. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
