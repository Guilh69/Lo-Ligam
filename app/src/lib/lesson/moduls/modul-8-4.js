// Module 8.4 · A1 · « Per tu, un cafè ? » : la tâche de l'unité 8 (En vila),
// la dernière de l'A1, rédigée par Claude le 2026-11-02 sur le modèle de 4.4
// (même chemin en six étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Rien de nouveau : on assemble l'unité 1 (saluer), 6.2 (le temps), 5.2 (les
// prix), 8.1 et 8.2 (le chemin), 8.3 (le café) pour accueillir quelqu'un.
// Scène : Núria accueille Giulia (unité 2) à la gare, puis au café de Bernat.
// Jeu du jour : jeu de rôle, adapté en causida (Loís arrive à Toulouse), avec
// le tour « rester en occitan » (règle 13).
// Fin du module : le mémo de l'unité, puis l'encart Alhors en Occitània
// (repris tel quel de cursus/alhors-en-occitania-A1.md).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique), à valider par Romain.
// ⚠️ Godolin : vers lu sur des numérisations anciennes, à contrôler sur une
// édition savante (cursus/cultura-A1.md, unité 8). Consistori : nom historique
// cité tel quel (consistòri absent du Basic).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul84 = {
	id: 'modul-8-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '8-4',
	unitat: 'Unitat 8 · En vila',
	nivel: 'A1 · Modul 8.4 · la tâche',
	oc: 'Per tu, un cafè ?',
	fr: 'Pour toi, un café ? Accueillir quelqu’un : le chemin, puis le café',
	cando:
		'Je peux accueillir quelqu’un à la gare, lui expliquer le chemin jusqu’au café, commander pour nous deux et payer, puis lui dire au revoir : tout en occitan.',
	durada: '~60 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Giulia', 'Bernat', 'Loís', 'Karim', 'Inès', 'Lisa'],
	notesRelecture: [
		'Titre du module : *Per tu, un cafè ?* (pour toi, un café ?), comme le propose le lexique. Ça te va ?',
		'Giulia (unité 2) insiste pour payer : *Per tu, lo tè… e per ieu, l’addicion !* La plaisanterie te va ?',
		'Tour « rester en occitan » : Loís passe au français ; deux bonnes répliques, *Pòdes repetir, se te plai ?* (2.3) et *En occitan, se te plai !* D’accord ?',
		'Godolin, *Béni t’en admira la Bilo de Toulouso* : vers lu sur des numérisations anciennes, pas encore contrôlé sur une édition savante (⚠️). On le garde ?',
		'*Consistori del Gay Saber* : nom historique cité tel quel (*consistòri* est absent du Basic, ⚠️). D’accord ?',
		'La tâche : accueillir pour de vrai une personne choisie (ou le prof, au cours en visio), de la gare au café. Ça te va ?',
		'Tes choix du 2026-11-02 (grammaire de référence), repris ici : *la dosena*, *un suc de frucha*, *Fa caud* « fa CAOUT ». À relire.'
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
							q: 'Tu abordes une passante pour trouver l’église :',
							options: ['Perdon… Ont es la glèisa ?', 'De res… Ont es la glèisa ?', 'Perdon… Ont es la gara ?'],
							correct: 0,
							oc: true,
							choses: ['perdon', 'la-gleisa'],
							explain: '*Perdon…* pour aborder ; *la glèisa* : l’église (*la gara*, c’est la gare).'
						},
						{
							q: '*Pren la dosena a drecha.*',
							options: ['prends la deuxième à droite', 'prends la première à droite', 'tourne deux fois à droite'],
							correct: 0,
							choses: ['pren', 'primier-segond'],
							explain: '*Pren !* : prends ! *la dosena* : la deuxième.'
						},
						{
							q: '*Ela pren un tè.*',
							options: ['elle prend un thé', 'je prends un thé', 'elle prend un café'],
							correct: 0,
							choses: ['prene-singular', 'un-te'],
							explain: '*pren* : il ou elle prend ; *un tè* : un thé. Un café, c’est *un cafè*.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Demande comment aller à la gare.',
							answers: ['Cossí i vau ?', 'La gara ? Cossí i vau ?', 'Perdon… La gara ? Cossí i vau ?'],
							choses: ['cossi-i-vau'],
							explain: '*Cossí i vau ?* : comment j’y vais ?'
						},
						{
							consigne: 'Au café, demande l’addition, puis remercie.',
							answers: ['L’addicion, se vos plai. Mercés !', 'L’addicion, se vos plai. Plan mercés !'],
							choses: ['l-addicion', 'merce'],
							explain: '*L’addicion, se vos plai*, puis *Mercés !*'
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
					title: 'Giulia à Toulouse',
					intro:
						'Giulia, l’amie italienne et occitane que Núria a rencontrée à la foire (unité 2), vient la voir à Toulouse. Núria l’attend à la gare, puis l’emmène au café de Bernat. Lis une première fois pour répondre à une seule question : au café, qui paie ?',
					scenes: [
						{
							title: 'A la gara',
							subtitle: '(Núria et Giulia se tutoient)',
							lines: [
								{ oc: 'Adieu, Giulia ! Benvenguda a Tolosa !', sound: 'a-DIOU, DJOU-lia ! bém-bén-GU-do a tou-LOU-zo !', fr: 'Salut, Giulia ! Bienvenue à Toulouse !' },
								{ oc: 'Adieu, Núria ! Cossí vas ?', sound: 'a-DIOU, NOU-ria ! cou-si BAS ?', fr: 'Salut, Núria ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! E tu ?', sound: 'BAOU PLA, mér-SÉS ! é TU ?', fr: 'Je vais bien, merci ! Et toi ?' },
								{ oc: 'Va plan ! Mas fa caud, uèi… Ai set !', sound: 'ba PLA ! mas fa CAOUT, UÈÏ… aï SÉT !', fr: 'Ça va ! Mais il fait chaud, aujourd’hui… J’ai soif !' },
								{ oc: 'Un cafè ? Lo cafè de Bernat es sus la plaça.', sound: 'un ca-FÈ ? lou ca-FÈ dé bér-NAT és sus la PLA-ço.', fr: 'Un café ? Le café de Bernat est sur la place.' },
								{ oc: 'Es luènh ?', sound: 'és LUÈN ?', fr: 'C’est loin ?' },
								{ oc: 'Un pauc. Mas es tot drech, a pè !', sound: 'un PAOUK. mas és tout DRÉTCH, a PÈ !', fr: 'Un peu. Mais c’est tout droit, à pied !' }
							]
						},
						{
							title: 'Al cafè',
							subtitle: '(Bernat, le serveur, vouvoie ses clientes)',
							lines: [
								{ oc: 'Bonjorn ! Qué volètz ?', sound: 'boun-DJOUR ! ké bou-LÈTS ?', fr: 'Bonjour ! Que voulez-vous ?' },
								{ oc: 'Bonjorn, Bernat ! Giulia, qué prenes ?', sound: 'boun-DJOUR, bér-NAT ! DJOU-lia, ké PRÉ-nés ?', fr: 'Bonjour, Bernat ! Giulia, que prends-tu ?' },
								{ oc: 'Per ieu, un suc de frucha… e un veire d’aiga, se vos plai !', sound: 'pér YÉOU, un SUC dé FRU-tcho… é un BÉÏ-ré DAÏ-go, sé bous PLAÏ !', fr: 'Pour moi, un jus de fruit… et un verre d’eau, s’il vous plaît !' },
								{ oc: 'E per ieu, un tè.', sound: 'é pér YÉOU, un TÈ.', fr: 'Et pour moi, un thé.' },
								{ oc: 'Vaquí ! Quicòm mai ?', sound: 'ba-KI ! ki-CÒM MAÏ ?', fr: 'Voilà ! Autre chose ?' },
								{ oc: 'Es tot, mercés. L’addicion, se vos plai.', sound: 'és TOUT, mér-SÉS. la-di-SYOU, sé bous PLAÏ.', fr: 'C’est tout, merci. L’addition, s’il vous plaît.' },
								{ oc: 'Non, non ! Per tu, lo tè… e per ieu, l’addicion !', sound: 'NOU, NOU ! pér TU, lou TÈ… é pér YÉOU, la-di-SYOU !', fr: 'Non, non ! Pour toi, le thé… et pour moi, l’addition !' },
								{ oc: 'Cinc euros.', sound: 'sin-KÉOU-rous.', fr: 'Cinq euros.' },
								{ oc: 'Vaquí ! Mercés, Bernat !', sound: 'ba-KI ! mér-SÉS, bér-NAT !', fr: 'Voilà ! Merci, Bernat !' }
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
							q: 'Au café, qui paie ?',
							options: ['Giulia : elle insiste', 'Núria : elle invite Giulia', 'personne : Bernat les invite'],
							correct: 0,
							choses: ['l-addicion', 'per-ieu'],
							explain: 'Núria demande l’addition, mais Giulia insiste : *Per tu, lo tè… e per ieu, l’addicion !*'
						},
						{
							q: 'Pourquoi Núria propose-t-elle un café ?',
							options: ['Giulia a soif : il fait chaud', 'Giulia est fatiguée du voyage', 'Bernat est un ami de Giulia'],
							correct: 0,
							choses: ['ai-set', 'fa-caud'],
							explain: '*Mas fa caud, uèi… Ai set !* : mais il fait chaud, aujourd’hui… J’ai soif !'
						},
						{
							q: 'Le café de Bernat est…',
							options: ['sur la place : un peu loin, mais tout droit', 'tout près, à droite de la gare', 'loin : il faut prendre le bus'],
							correct: 0,
							choses: ['es-luenh', 'tot-drech', 'a-pe'],
							explain: '*Sus la plaça… Un pauc. Mas es tot drech, a pè !*'
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
					type: 'table',
					title: 'Accueillir quelqu’un, en six temps',
					intro: 'Tout est déjà dans tes modules : il suffit de le mettre bout à bout.',
					head: ['', 'tu dis', 'vu dans'],
					rows: [
						['accueillir', '*Adieu, Giulia ! Benvenguda a Tolosa !*', 'l’unité 1, le module 8.1'],
						['prendre des nouvelles', '*Cossí vas ?* · *Vau plan, mercés ! E tu ?*', 'l’unité 1'],
						['parler du temps', '*Fa caud, uèi !* · *Ai set !*', 'l’unité 6, le module 8.3'],
						['montrer le chemin', '*Es un pauc luènh, mas es tot drech.* · *Vira a drecha.*', 'les modules 8.1 et 8.2'],
						['commander, payer', '*Qué prenes ?* · *Per ieu, un tè.* · *L’addicion, se vos plai.*', 'le module 8.3'],
						['se quitter', '*Mercés ! Al còp que ven !*', 'l’unité 1']
					],
					notes: [
						'Pour accueillir : *Benvengut !* à un homme, *Benvenguda !* à une femme.',
						'À ton amie, *tu* : *Qué prenes ?*, *se te plai*. Au serveur, qu’on vouvoie : *Qué volètz ?*, *se vos plai*.'
					],
					glosa: { benvengut: 'bienvenu', benvenguda: 'bienvenue' }
				},
				{
					type: 'qcm',
					title: 'Tu, ou vous ?',
					intro: 'Au café, on tutoie son amie, et on vouvoie le serveur. Choisis.',
					items: [
						{
							q: 'Tu proposes un café à ton amie Giulia :',
							options: ['Un cafè, Giulia ? Qué prenes ?', 'Un cafè, Giulia ? Qué volètz ?', 'Un cafè, Giulia ? Qué pren ?'],
							correct: 0,
							oc: true,
							choses: ['prene-singular', 'un-cafe'],
							explain: 'À une amie, *tu* : *Qué prenes ?* *Qué volètz ?*, c’est pour vouvoyer ; *Qué pren ?*, « que prend-il ? ».'
						},
						{
							q: 'Tu commandes à Bernat, le serveur :',
							options: ['Per ieu, un tè, se vos plai.', 'Per ieu, un tè, se te plai.', 'Per tu, un tè, se vos plai.'],
							correct: 0,
							oc: true,
							choses: ['per-ieu', 'un-te'],
							explain: 'À Bernat, on dit *vos* : *se vos plai*. *Per ieu* : pour moi ; *per tu*, pour toi.'
						},
						{
							q: 'Giulia descend du train. Tu l’accueilles :',
							options: ['Adieu, Giulia ! Benvenguda !', 'Adieu, Giulia ! Benvengut !', 'A deman, Giulia !'],
							correct: 0,
							oc: true,
							choses: ['adieu', 'a-deman'],
							explain: 'Giulia est une femme : *Benvenguda !* Et *A deman*, c’est pour se quitter.'
						}
					]
				},
				{
					type: 'order',
					title: 'La visite, dans l’ordre',
					intro: 'Touche les répliques dans l’ordre de la visite.',
					items: [
						{
							prompt: 'À la gare : de l’accueil jusqu’au chemin.',
							tiles: ['Benvenguda a Tolosa !', 'Cossí vas ?', 'Vau plan, mercés !', 'Ai set…', 'Un cafè ?', 'Es tot drech, a pè.'],
							choses: ['cossi-vas', 'vau-plan', 'ai-set', 'tot-drech', 'a-pe'],
							explain: 'On accueille, on prend des nouvelles ; puis on propose un café, et on montre le chemin.'
						},
						{
							prompt: 'Au café : de la commande jusqu’au départ.',
							tiles: ['Qué volètz ?', 'Per ieu, un suc de frucha.', 'Quicòm mai ?', 'Es tot.', 'L’addicion, se vos plai.', 'Al còp que ven !'],
							choses: ['per-ieu', 'suc-de-fruta', 'l-addicion', 'al-cop-que-ven'],
							explain: 'Le serveur demande, tu commandes ; puis l’addition, et on se quitte.'
						},
						{
							prompt: 'Ce n’est pas loin : tout droit, puis tourne à droite.',
							tiles: ['Non', 'es', 'pas', 'luènh :', 'tot drech,', 'puèi', 'vira', 'a drecha.'],
							choses: ['es-luenh', 'tot-drech', 'vira', 'a-drecha'],
							explain: '*Non es pas luènh* : ce n’est pas loin. Puis le chemin, dans l’ordre où on le fait.'
						}
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
				// jeu prévu par la carte : jeu de rôle enregistré (à coder : s'enregistrer,
				// puis se réécouter). Version simple : `causida` (on choisit ses répliques),
				// puis, à l'étape suivante, la tâche écrite et dite à voix haute.
				{
					type: 'causida',
					title: 'Loís à Toulouse',
					intro:
						'Loís, le cuisinier du village, vient passer la journée à Toulouse. C’est toi qui l’accueilles à la gare, à dix heures du matin. Choisis chaque réplique ; si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Loís',
					tours: [
						{
							situacion: 'Dix heures du matin, à la gare. Loís descend du train : accueille-le.',
							options: [
								{ oc: 'Adieu, Loís ! Benvengut a Tolosa !', bon: true },
								{ oc: 'Adieu, Loís ! Benvenguda a Tolosa !', reaccion: 'Loís regarde derrière lui, amusé : tu accueilles une dame qu’il n’a pas vue ?' },
								{ oc: 'Bon ser, Loís ! Benvengut a Tolosa !', reaccion: 'Loís regarde l’horloge de la gare : *Bon ser*, à dix heures du matin ?' }
							],
							choses: ['adieu', 'bon-ser'],
							explain: 'Loís est un homme : *Benvengut !* Et le matin : *Adieu* ou *Bonjorn*.'
						},
						{
							ditz: 'Mercés ! Cossí vas ?',
							options: [
								{ oc: 'Vau plan, mercés ! E tu ?', bon: true },
								{ oc: 'Vau plan, mercés ! E vos ?', reaccion: 'Loís hausse un sourcil : depuis quand vous vous vouvoyez ?' },
								{ oc: 'Vau a la gara.', reaccion: 'Loís sourit : tu y es déjà, à la gare ! Il te demandait comment tu vas.' }
							],
							choses: ['vau-plan', 'va-plan-e-tu', 'anar-singular'],
							explain: '*Vau plan* : je vais bien. *Vau a…* : je vais à… C’est le même verbe, *anar*.'
						},
						{
							ditz: 'Va plan ! Mas fa caud… Ai set !',
							options: [
								{ oc: 'Ieu tanben ! Un cafè, sus la plaça ?', bon: true },
								{ oc: 'Ieu tanben ! Un veire de vin, a dètz oras ?', reaccion: 'Loís éclate de rire : du vin, à dix heures du matin ? Il préfère un café.' },
								{ oc: 'Ieu tanben ! Non sabi pas…', reaccion: 'Loís attend une idée… C’est toi qui connais la ville : propose-lui quelque chose !' }
							],
							choses: ['un-cafe', 'ai-set'],
							explain: 'Il a soif : tu lui proposes *Un cafè, sus la plaça ?*'
						},
						{
							ditz: 'Òc ! Es luènh ?',
							options: [
								{ oc: 'Un pauc. Mas es tot drech, a pè !', bon: true },
								{ oc: 'Non sabi pas.', reaccion: 'Loís te regarde, étonné : c’est toi qui l’accueilles, et tu ne sais pas ?' },
								{ oc: 'Vira a esquèrra, puèi vira a esquèrra, puèi vira a esquèrra !', reaccion: 'Loís tourne sur lui-même : à gauche, à gauche, à gauche… et le voilà revenu devant la gare !' }
							],
							choses: ['es-luenh', 'tot-drech', 'a-pe'],
							explain: '*Un pauc* : un peu. La place est au bout de la grande rue : *tot drech*.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'En chemin, Loís s’arrête et passe au français, très vite : « Attends, attends : c’est lequel, ton café ? Il y en a trois, sur la place ! »',
							options: [
								{ oc: 'Pòdes repetir, se te plai ?', bon: true },
								{ oc: 'En occitan, se te plai !', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Loís continue en français, soulagé… et toute la matinée passe au français. Ramène-le vers l’occitan !' },
								{ oc: 'Non compreni pas.', reaccion: 'Loís, gentil, réexplique tout en français, plus lentement. Ramène-le plutôt vers l’occitan !' }
							],
							choses: ['podes-repetir'],
							explain: 'Pour rester en occitan : *Pòdes repetir, se te plai ?*, ou *En occitan, se te plai !* Loís reprend aussitôt en occitan.'
						},
						{
							ditz: 'Perdon ! Ont es lo cafè ?',
							options: [
								{ oc: 'Sus la plaça, al costat de la glèisa.', bon: true },
								{ oc: 'Sus la plaça, darrièr la gara.', reaccion: 'Loís se retourne : derrière la gare ? Mais la gare est à l’autre bout de la grande rue !' },
								{ oc: 'Al costat de l’espital, a drecha.', reaccion: 'Loís fronce les sourcils : l’hôpital ? Il voulait un café, pas une piqûre !' }
							],
							choses: ['al-costat-de', 'la-placa', 'la-gleisa'],
							explain: '*al costat de* : à côté de. Le café de Bernat est sur la place, à côté de l’église.'
						},
						{
							situacion: 'Au café. Bernat arrive. Demande d’abord à Loís ce qu’il prend.',
							options: [
								{ oc: 'Loís, qué prenes ?', bon: true },
								{ oc: 'Loís, qué preni ?', reaccion: 'Loís rit : comment saurait-il ce que toi, tu veux ?' },
								{ oc: 'Loís, qué volètz ?', reaccion: 'Loís se retourne pour voir à qui tu parles, puis rit : depuis quand tu le vouvoies ?' }
							],
							choses: ['prene-singular'],
							explain: '*Qué prenes ?* : que prends-tu ? À Loís, on dit *tu*.'
						},
						{
							situacion: 'Loís veut un café. Toi, tu as soif. Commande pour vous deux.',
							options: [
								{ oc: 'Per el, un cafè. E per ieu, un veire d’aiga, se vos plai !', bon: true },
								{ oc: 'Per ieu, un cafè. E per el, un veire d’aiga, se vos plai !', reaccion: 'Bernat pose le café devant toi, et l’eau devant Loís. Loís regarde son verre d’eau, déçu.' },
								{ oc: 'Per el, un cafè. E per ieu, un veire de vin, se vos plai !', reaccion: 'Bernat hausse un sourcil : du vin, à dix heures et demie ? Loís, lui, rit de bon cœur.' }
							],
							choses: ['per-ieu', 'un-cafe', 'un-veire-de', 'l-aiga'],
							explain: '*Per el* : pour lui ; *per ieu* : pour moi.'
						},
						{
							situacion: 'Bernat apporte tout. Plus tard, tu veux payer : appelle-le.',
							options: [
								{ oc: 'L’addicion, se vos plai !', bon: true },
								{ oc: 'De res, se vos plai !', reaccion: 'Bernat s’approche, perplexe : « de rien, s’il vous plaît » ? Il attend la suite.' },
								{ oc: 'Un cafè, se vos plai !', reaccion: 'Bernat apporte un deuxième café à Loís, ravi. Mais toi, tu voulais payer !' }
							],
							choses: ['l-addicion'],
							explain: '*L’addicion, se vos plai* : pour payer.'
						},
						{
							ditz: 'Mercés per lo cafè ! Parlas plan occitan, ara !',
							options: [
								{ oc: 'Plan mercés ! Al còp que ven, Loís !', bon: true },
								{ oc: 'De res ! A lèu, Loís !', bon: true },
								{ oc: 'Benvengut, Loís !', reaccion: 'Loís rit : bienvenu, maintenant qu’il repart ? Il est arrivé il y a deux heures !' }
							],
							choses: ['merce', 'al-cop-que-ven', 'a-leu'],
							explain: '*Plan mercés !* : merci beaucoup. *Al còp que ven !* : à la prochaine !'
						}
					],
					fin: 'Loís repart, content. Accueillir, guider, commander, payer, se quitter : tu viens de tout faire en occitan.'
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
					title: 'La tâche de l’unité : accueillir quelqu’un',
					paragraphs: [
						'Pense à une personne réelle qui pourrait venir te voir : ta sœur, un ami, une collègue, ton prof d’occitan… Tu l’accueilles à la gare de ta ville (ou de la plus proche), tu lui montres le chemin du café, tu commandes, tu paies, et vous vous quittez.',
						'Écris ci-dessous ce que tu lui dis, une phrase à la fois. Puis dis tout à voix haute, comme si elle était devant toi.',
						'Choisis maintenant à qui tu le diras pour de vrai : à cette personne, si elle apprend l’occitan, ou à ton prof, au prochain cours en visio.'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris ton accueil)',
					intro: 'Une phrase à la fois, pour la personne que tu as choisie. À la fin, la page les rassemble : c’est ce que tu lui diras.',
					recap: 'Ton accueil, à dire à voix haute :',
					items: [
						{
							consigne: '1. À la gare : salue la personne par son prénom, et souhaite-lui la bienvenue (*Benvengut !* à un homme, *Benvenguda !* à une femme).',
							debut: ['Adieu', 'Bonjorn', 'Benvengut', 'Benvenguda'],
							choses: ['adieu'],
							explain: 'Par exemple : *Adieu, Lisa ! Benvenguda a Tolosa !*'
						},
						{
							consigne: '2. Demande-lui comment elle va.',
							answers: ['Cossí vas ?', 'E tu, cossí vas ?', 'Cossí anatz ?'],
							choses: ['cossi-vas'],
							explain: '*Cossí vas ?* ; et si tu la vouvoies, *Cossí anatz ?*'
						},
						{
							consigne: '3. Dis-lui le temps qu’il fait aujourd’hui.',
							answers: ['Fa caud.', 'Fa freg.', 'Fa bèl.', 'Fa solelh.', 'Fa vent.', 'Plòu.', 'Nèva.'],
							debut: ['Uèi', 'Fa', 'Plòu', 'Nèva'],
							choses: ['uei'],
							explain: 'Par exemple : *Uèi, fa caud !* · *Uèi, plòu…*'
						},
						{
							consigne: '4. Propose-lui un café, et explique-lui le chemin jusqu’au café.',
							debut: ['Un cafè', 'Lo cafè', 'Es', 'Tot drech', 'Pren', 'Vira', 'Per tu'],
							choses: ['un-cafe', 'tot-drech'],
							explain: 'Par exemple : *Un cafè ? Es prèp : tot drech, puèi vira a drecha.*'
						},
						{
							consigne: '5. Au café, demande-lui ce qu’elle prend.',
							answers: ['Qué prenes ?', 'E tu, qué prenes ?', 'Qué vòls ?'],
							choses: ['prene-singular'],
							explain: '*Qué prenes ?* : que prends-tu ?'
						},
						{
							consigne: '6. Commande pour vous deux, poliment.',
							debut: ['Per ieu', 'Per el', 'Per ela', 'Volriái', 'Un cafè', 'Un tè', 'Un suc'],
							choses: ['per-ieu'],
							explain: 'Par exemple : *Per ieu, un tè ; per ela, un cafè, se vos plai.*'
						},
						{
							consigne: '7. Demande l’addition.',
							answers: ['L’addicion, se vos plai.'],
							choses: ['l-addicion'],
							explain: 'Au serveur : *se vos plai*.'
						},
						{
							consigne: '8. Pour finir, remercie, et dis-lui au revoir.',
							answers: ['Plan mercés ! Al còp que ven !', 'Mercés ! A lèu !', 'A lèu !', 'Al còp que ven !', 'A deman !', 'Adieu !', 'Adieu-siatz !'],
							debut: ['Mercés', 'Plan mercés', 'Adieu', 'A lèu', 'A deman', 'Al còp que ven'],
							choses: ['merce', 'al-cop-que-ven'],
							explain: 'Par exemple : *Plan mercés ! Al còp que ven !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde l’accueil de Karim : sa petite sœur Inès, douze ans, vient passer la journée à Toulouse.',
							a: '*Adieu, Inès ! Benvenguda a Tolosa ! Cossí vas ? … Uèi, fa caud ! Un suc de frucha ? Lo cafè es sus la plaça : es un pauc luènh, mas es tot drech. … Inès, qué prenes ? … Per ela, un suc de frucha ; per ieu, un cafè, se vos plai. … L’addicion, se vos plai. … Mercés, Bernat ! … Al còp que ven, Inès !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'l’accueil : le prénom, et *Benvengut !* ou *Benvenguda !*',
						'le chemin : *tot drech*, *a drecha* ou *a esquèrra*, et si c’est loin',
						'au café : *Qué prenes ?*, *Per ieu…*, *L’addicion, se vos plai*',
						'*tu* pour la personne que tu accueilles, *vos* pour le serveur',
						'la prononciation : « tch » dans *drecha*, et *set* « SÉT » (la soif)'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Redis-le sans regarder',
					paragraphs: [
						'Cache l’écran, et dis ton accueil d’une traite, à voix haute. Un mot oublié ? Regarde, puis recommence depuis le début.'
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
					glosa: { ch: 'se dit « tch »' },
					paragraphs: [
						'Le *ch* sonne « tch » : *drecha* « DRÉ-tcho », *tot drech* « tout DRÉTCH » (module 8.1).',
						'Un accent écrit montre où la voix appuie : *carrièra* « ca-RRYÈ-ro », *esquèrra* « es-KÈ-rro » (module 8.2).',
						'Le *e* fermé et le *è* ouvert : *set* « SÉT » (la soif), *sèt* « SÈT » (sept), *cafè* « ca-FÈ » (module 8.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*lo lach* (le lait) se dit…',
							options: ['lou LATCH', 'lou LACH'],
							correct: 0,
							noShuffle: true,
							explain: '« lou LACH », c’est la lecture à la française. *ch* sonne « tch », comme dans *drecha*.'
						},
						{
							q: '« aï SÈT » : on te dit…',
							options: ['j’en ai sept', 'j’ai soif'],
							correct: 0,
							noShuffle: true,
							explain: '« SÈT », ouvert : *sèt*, sept. Pour la soif, c’est « SÉT », fermé : *Ai set.*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Perdon… Lo cafè ? Tot drech, puèi vira a drecha : es prèp !*',
							a: '« pér-DOU… lou ca-FÈ ? tout DRÉTCH, PUÈÏ BI-ro a DRÉ-tcho : és PRÈP ! » : le « tch », la syllabe forte, et le *è* ouvert, dans une seule phrase.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : Toulouse, ville de poésie',
					glosa: {
						'consistori del gay saber': 'le Consistoire du Gai Savoir (nom historique)',
						'lou ramelet moundi': 'titre du recueil de Godolin (orthographe du XVIIe siècle)',
						'béni t’en admira la bilo de toulouso': 'viens admirer la ville de Toulouse (orthographe du XVIIe siècle)'
					},
					paragraphs: [
						'En 1323, à Toulouse, sept troubadours fondent le *Consistori del Gay Saber* (le Consistoire du Gai Savoir), avec la protection des capitouls, qui gouvernent la ville : il s’agit de rendre vie à la poésie en langue d’oc. Le premier concours a lieu le 3 mai 1324.',
						'Le *Consistori* est devenu l’Académie des Jeux floraux, qui passe pour la plus ancienne société littéraire d’Europe. Chaque 3 mai, elle remet encore ses fleurs, en français et en occitan.',
						'Au XVIIe siècle, le poète toulousain Pèire Godolin invite son lecteur, dans son recueil *Lou Ramelet moundi* : *Béni t’en admira la Bilo de Toulouso* (viens admirer la ville de Toulouse). C’est l’orthographe de son temps : le *v* qui sonne « b » s’y écrit même *b* !',
						'Sources : Wikipédia, articles « Académie des Jeux floraux » et « Pierre Goudouli ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 8 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'demander mon chemin, et comprendre la réponse',
						'expliquer un chemin : à droite, à gauche, tout droit, la deuxième rue',
						'commander au café, pour moi et pour quelqu’un, puis payer',
						'accueillir quelqu’un, de la gare jusqu’au café'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de l’unité 8, et de l’A1',
					glosa: { òsca: 'bravo' },
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant te débrouiller en ville en occitan : demander ton chemin, l’expliquer, commander au café, accueillir quelqu’un.',
						'Regarde le chemin parcouru : *Adieu !*, *Parlas occitan ?*, *La familha*, *Qué fas ?*, *Al mercat*, *La jornada*, *L’ostal*, *En vila*. Huit unités : tu peux déjà vivre une journée entière en occitan.',
						'Il reste la halte 4, puis la mission A1 : une fête de village, où tout ce que tu sais va servir.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant accueillir quelqu’un en occitan, de la gare jusqu’au café.',
						'Si tu en as envie : la prochaine fois que tu retrouves une personne qui parle occitan, ou ton prof au cours en visio, propose-lui *Per tu, un cafè ?* Quand ? Où ? Choisis-le maintenant.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 8 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['aborder quelqu’un', '*Perdon…*'],
						['demander où est un lieu', '*Ont es la gara ?* · *Es luènh ?* · *Es prèp.*'],
						['demander le chemin', '*Cossí i vau ?*'],
						['indiquer le chemin', '*tot drech* · *Vira a drecha !* · *Pren la dosena carrièra a esquèrra.* · *a pè*'],
						['commander', '*Qué prenes ?* · *Per ieu, un cafè.* · *un veire d’aiga* · *Ai set.*'],
						['payer', '*L’addicion, se vos plai.*']
					]
				},
				{
					type: 'table',
					title: 'Mémo : deux verbes au singulier',
					head: ['', '*anar* (aller)', '*prene* (prendre)'],
					rows: [
						['je', '*vau*', '*preni*'],
						['tu', '*vas*', '*prenes*'],
						['il, elle', '*va*', '*pren*']
					],
					notes: [
						'Pour guider : *Vira !* (tourne !) et *Pren !* (prends !), deux ordres tout faits.',
						'Pour vous : *anatz*, comme dans *Cossí anatz ?* Le reste du pluriel viendra plus tard.'
					]
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'où est la gare ?', 'la rue', 'à droite, à gauche'],
					rows: [
						['languedocien (ton cours)', '*Ont es la gara ?*', '*la carrièra*', '*a drecha, a esquèrra*'],
						['gascon', '*On ei la gara ?*', '*la carrèra*', '*a dreta, a esquèrra*'],
						['provençal', '*Ont es la gara ?*', '*la carriera*', '*a drecha, a senèstra*'],
						['limousin', '*Ent es la gara ?*', '*la charriera*', '*a drecha, a gaucha*'],
						['auvergnat', '*Ont es la gara ?*', '*la charreira*', '*a dreita, a gaucha*'],
						['vivaro-alpin', '*Ont’es la gara ?*', '*la charriera*', '*a drecha, a senestra*']
					],
					notes: [
						'En gascon, « où est » se dit *on ei* : *On ei la gara ?* ; en limousin, *Ent es la gara ?*',
						'Au nord, la rue est la *charriera* (limousin, vivaro-alpin) ou la *charreira* (auvergnat) : encore le « ca » qui passe à « cha ».',
						'« À gauche » change de mot : *senèstra* en provençal (*senestra* en vivaro-alpin), *gaucha* en limousin et en auvergnat ; en gascon, *drecha* devient *dreta*.',
						'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc).'
					],
					glosa: {
						'on ei': 'où est (gascon)',
						'ent es': 'où est (limousin)',
						'ont’es': 'où est (vivaro-alpin)',
						'la carrèra': 'la rue (gascon)',
						'la carriera': 'la rue (provençal)',
						'la charriera': 'la rue (limousin, vivaro-alpin)',
						'la charreira': 'la rue (auvergnat)',
						'a dreta': 'à droite (gascon)',
						'a dreita': 'à droite (auvergnat)',
						'a senèstra': 'à gauche (provençal)',
						'a senestra': 'à gauche (vivaro-alpin)',
						'a gaucha': 'à gauche (limousin, auvergnat)',
						dreta: 'droite (gascon)'
					}
				}
			]
		}
	]
};
