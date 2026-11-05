// Module 7.1 · A1 · « Qué i a dins l’ostal ? » : unité 7 (L’ostal), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : i a + nom (revu de 3.3) ; dins (vu en bloc en 4.2) ; l’
// devant une voyelle (lexic-A1.md, 7.1).
// Scène de l'unité : une semaine dans la maison de Marià. La famille de Karim
// part en voyage ; Marià garde Mimí, la chatte d'Inès, la petite sœur de
// Karim (3.3). Ici, Karim amène Mimí, et Marià lui fait visiter la maison.
// Karim vouvoie Marià, qui tutoie volontiers les jeunes (comme en 2.2 et 4.1).
// Jeu du jour : toucher l'objet dans la scène (qcm, voir le commentaire).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01 ; plus
// benvenguda, benvengut le 2026-11-02 ; cadièras : pluriel de cadièra ✓),
// à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul71 = {
	id: 'modul-7-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '7-1',
	unitat: 'Unitat 7 · L’ostal',
	nivel: 'A1 · Modul 7.1',
	oc: 'Qué i a dins l’ostal ?',
	fr: 'Qu’y a-t-il dans la maison ? Nommer les pièces et les meubles',
	cando:
		'Je peux nommer les pièces d’une maison et les meubles, dire ce qu’il y a dans une pièce, ou ce qu’il n’y a pas, et faire visiter.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25), comme en 1.1.
	ouverture: {
		numero: 7,
		bloc: { oc: 'Lo monde a l’entorn', fr: 'le monde autour' },
		titre: 'L’ostal',
		fr: 'la maison, et ceux qui y vivent',
		question: 'Qué i a dins l’ostal ?',
		questionFr: 'qu’y a-t-il dans la maison ?',
		phrase:
			'Une semaine chez Marià, avec Mimí, la chatte d’Inès. En quatre modules, tu sauras nommer les pièces et les meubles, dire où sont les choses et de quelle couleur, puis décrire ton logement en huit phrases. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Marià', 'Mimí', 'Inès'],
	notesRelecture: [
		'Scène de l’unité : la famille de Karim part une semaine, et Marià garde Mimí, la chatte d’Inès (3.3). Mimí se cache partout (7.2), puis Inès revient la chercher (7.3). Ça te va ?',
		'La blague de Marià : *La cosina… o ta cosina ?* (la cuisine, ou ta cousine ?). On la garde ?',
		'*Mimí es d’aquí, ara !* (Mimí est d’ici, maintenant), pour une chatte qui a déjà pris ses aises : naturel pour toi ?',
		'Son du jour : le *l* final se dit « l » en languedocien (*ostal* « ous-TAL »), « ou » ailleurs (*ostau*). C’est bien ton usage ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient de l’unité 6',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Il est huit heures et demie :',
							options: ['Son uèch oras e mièja.', 'Son uèch oras e quart.', 'Es una ora e mièja.'],
							correct: 0,
							oc: true,
							choses: ['son-doas-oras', 'e-mieja'],
							explain: '*e mièja* : et demie ; *e quart* : et quart. Et *son* : plusieurs heures.'
						},
						{
							q: 'Il fait froid, il neige :',
							options: ['Fa freg, nèva.', 'Fa caud, nèva.', 'Fa freg, plòu.'],
							correct: 0,
							oc: true,
							choses: ['fa-freg', 'neva'],
							explain: '*Fa freg* : il fait froid. *Nèva* : il neige ; *plòu*, il pleut.'
						},
						{
							q: 'Le matin, je prends mon petit déjeuner :',
							options: ['Lo matin, dejuni.', 'Lo matin, sopi.', 'Lo ser, dejuni.'],
							correct: 0,
							oc: true,
							choses: ['lo-matin', 'dejunar'],
							explain: '*dejunar* : le repas du matin ; *sopar* : celui du soir.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Je me lève à sept heures.',
							answers: ['Me lèvi a sèt oras.'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: '*Me lèvi*, puis *a* et l’heure : *a sèt oras*.'
						},
						{
							consigne: 'Il n’y a pas de chien.',
							answers: ['Non i a pas de can.'],
							choses: ['i-a', 'lo-can'],
							explain: '*I a* : il y a (unité 3). Aujourd’hui, il revient dans chaque phrase.'
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
					type: 'fotos',
					// Photos de Romain (05-11), sans GPS : static/aprene/fotos/
					imatges: [
						{ clau: '7-1-ostal', amples: [720, 1200], l: 720, h: 454, oc: 'l’ostal', fr: 'la maison', alt: 'Une maison de pierre au soleil, une grande table de bois devant, sous les arbres.' }
					]
				},
				{
					type: 'dialogue',
					title: 'Mimí chez Marià',
					intro:
						'La famille de Karim part une semaine en voyage : Marià garde Mimí, la chatte d’Inès, la petite sœur de Karim. Karim amène Mimí, et Marià lui fait visiter sa maison. Karim vouvoie Marià ; elle le tutoie, comme elle tutoie volontiers les jeunes. Lis une première fois pour répondre à une seule question : à la fin, où est Mimí ?',
					scenes: [
						{
							title: 'A la pòrta',
							subtitle: '(Karim arrive, Mimí dans les bras)',
							lines: [
								{ oc: 'Adieu, Karim ! Cossí vas ?', sound: 'a-DIOU, ka-RIM ! cou-si BAS ?', fr: 'Salut, Karim ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! E vos ?', sound: 'baou PLA, mér-SÉS ! é BOUS ?', fr: 'Je vais bien, merci ! Et vous ?' },
								{ oc: 'Va plan ! E Mimí, ont es ?', sound: 'ba PLA ! é mi-MI, oun ÉS ?', fr: 'Ça va bien ! Et Mimí, où est-elle ?' },
								{ oc: 'Vaquí Mimí !', sound: 'ba-KI mi-MI !', fr: 'Voilà Mimí !' },
								{ oc: 'Benvenguda dins l’ostal, Mimí !', sound: 'bén-bén-GU-do dins lous-TAL, mi-MI !', fr: 'Bienvenue dans la maison, Mimí !' }
							]
						},
						{
							title: 'Dins l’ostal',
							subtitle: '(Marià fait visiter)',
							lines: [
								{ oc: 'Aquí, i a la sala : lo canapè, la taula, las cadièras…', sound: 'a-KI, ya la SA-lo : lou ca-na-PÈ, la TAOU-lo, las ca-DYÈ-ros…', fr: 'Ici, il y a le séjour : le canapé, la table, les chaises…' },
								{ oc: 'E la cosina, ont es ?', sound: 'é la cou-ZI-no, oun ÉS ?', fr: 'Et la cuisine, où est-elle ?' },
								{ oc: 'La cosina… o ta cosina ?', sound: 'la cou-ZI-no… ou ta cou-ZI-no ?', fr: 'La cuisine… ou ta cousine ?' },
								{ oc: 'La cosina ! Mimí manja dins la cosina ?', sound: 'la cou-ZI-no ! mi-MI MAN-djo dins la cou-ZI-no ?', fr: 'La cuisine ! Mimí mange dans la cuisine ?' },
								{ oc: 'Òc, amb ieu ! E aquí, i a la cambra, e la sala de banh.', sound: 'OK, am YÉOU ! é a-KI, ya la CAM-bro, é la SA-lo dé BAN.', fr: 'Oui, avec moi ! Et ici, il y a la chambre, et la salle de bain.' },
								{ oc: 'I a un can, dins l’ostal ?', sound: 'ya un CA, dins lous-TAL ?', fr: 'Il y a un chien, dans la maison ?' },
								{ oc: 'Non i a pas de can. Mas i a un jardin !', sound: 'nou ya PAS dé CA. mas ya un djar-DI !', fr: 'Non, il n’y a pas de chien. Mais il y a un jardin !' },
								{ oc: 'E Mimí ? Ont es ?', sound: 'é mi-MI ? oun ÉS ?', fr: 'Et Mimí ? Où est-elle ?' },
								{ oc: 'Es dins l’armari… Non ! Es a la fenèstra !', sound: 'és dins lar-MA-ri… NOU ! és a la fé-NÈS-tro !', fr: 'Elle est dans l’armoire… Non ! Elle est à la fenêtre !' },
								{ oc: 'E ara… es dins lo jardin !', sound: 'é A-ro… és dins lou djar-DI !', fr: 'Et maintenant… elle est dans le jardin !' },
								{ oc: 'Mimí es d’aquí, ara !', sound: 'mi-MI és da-KI, A-ro !', fr: 'Mimí est d’ici, maintenant !' }
							]
						}
					],
					glossary: [
						{ oc: 'Benvenguda ! · Benvengut !', sound: 'bén-bén-GU-do · bén-bén-GUT', fr: 'bienvenue ! (à une femme, ou à une chatte · à un homme)' },
						{ oc: 'las cadièras', sound: 'las ca-DYÈ-ros', fr: 'les chaises (le pluriel : -a devient -as, comme las pomas)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'À la fin, où est Mimí ?',
							options: ['dans le jardin', 'dans l’armoire', 'dans la cuisine'],
							correct: 0,
							choses: ['lo-jardin', 'dins'],
							explain: 'Marià la croit *dins l’armari*, puis la voit *a la fenèstra*… et la voilà *dins lo jardin*.'
						},
						{
							q: '*E la cosina, ont es ?* demande Karim. Pourquoi Marià répond-elle *o ta cosina ?*',
							options: ['*la cosina*, c’est aussi « la cousine »', 'elle n’a pas de cuisine', 'la cuisine est dans le jardin'],
							correct: 0,
							choses: ['la-cosina'],
							explain: 'Le même mot pour la cuisine et pour la cousine (3.2). Marià s’amuse.'
						},
						{
							q: 'Karim s’inquiète pour Mimí. Dans la maison, il n’y a pas…',
							options: ['de chien', 'de jardin', 'de salle de bain'],
							correct: 0,
							choses: ['i-a', 'lo-can'],
							explain: '*Non i a pas de can* : pas de chien. Mais *i a un jardin* !'
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
					title: 'Trois petits mots',
					intro: 'Regarde les phrases de la visite : trois petits mots portent tout.',
					items: [
						{
							q: '*I a la cambra, e la sala de banh*, dit Marià. *I a*, c’est…',
							options: ['il y a', 'il a', 'elle est'],
							correct: 0,
							choses: ['i-a'],
							explain: '*I a* : il y a, comme en 3.3. Une chose ou plusieurs, il ne change pas : *I a la cambra*, *I a las cadièras*.'
						},
						{
							q: '*Dins*, tu l’as déjà dit dans une question de l’unité 4. Laquelle ?',
							options: ['*Qué fas dins la vida ?*', '*Qué fas lo dimenge ?*', '*Ont trabalhas ?*'],
							correct: 0,
							choses: ['dins', 'que-fas-dins-la-vida'],
							explain: '*dins la vida* : dans la vie. Aujourd’hui : *dins la cosina*, *dins l’armari*.'
						},
						{
							q: '*Mimí manja dins la cosina ?* demande Karim. Mimí mangerait…',
							options: ['dans la cuisine', 'avec la cousine', 'à côté de la cuisine'],
							correct: 0,
							choses: ['dins', 'la-cosina'],
							explain: '*dins* : dans. Et ici, *la cosina* est la cuisine : on y mange !'
						},
						{
							q: '*l’ostal*, *l’armari*, mais *lo jardin*. Pourquoi *l’* ?',
							options: ['devant une voyelle, *lo* devient *l’*', '*ostal* et *armari* sont féminins', '*l’* veut dire « un »'],
							correct: 0,
							choses: ['l-ostal', 'l-armari', 'articles-lo-la'],
							explain: 'Comme *l’oncle* (3.2) et *l’amiga* (4.3) : devant une voyelle, *lo* et *la* deviennent *l’*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Trois repères, pas de grammaire',
					head: ['', 'dans la scène', 'à retenir'],
					rows: [
						['*i a* : il y a', '*I a un jardin.* · *Non i a pas de can.*', 'une chose ou plusieurs, *i a* ne change pas ; après *pas*, on dit *de*'],
						['*dins* : dans', '*dins la cosina* · *dins l’armari*', 'comme *dins la vida* (unité 4)'],
						['*l’* : le, la', '*l’ostal* · *l’armari*', 'devant une voyelle ; on ne voit plus si le mot est masculin ou féminin']
					],
					notes: [
						'*Ostal* et *armari* sont masculins : *un ostal*, *un armari*. *Amiga* est féminin : *una amiga*. Avec *l’*, retiens-les avec *un* ou *una*.',
						'*La cosina* : la cuisine, et aussi la cousine. C’est la phrase qui dit laquelle : *Ma cosina es dins la cosina !*',
						'Pour faire visiter : *Aquí, i a la sala.* On montre, et on nomme.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : la maison et ses pièces',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'l-ostal', oc: 'l’ostal', sound: 'lous-TAL', fr: 'la maison, et ceux qui y vivent (titre de l’unité)' },
						{ id: 'dins', oc: 'dins', sound: 'DINS', fr: 'dans (*dins la vida*, *dins la cosina*)' },
						{ id: 'la-cosina', oc: 'la cosina', sound: 'la cou-ZI-no', fr: 'la cuisine (le même mot que la cousine !)' },
						{ id: 'la-cambra', oc: 'la cambra', sound: 'la CAM-bro', fr: 'la chambre' },
						{ id: 'la-sala', oc: 'la sala', sound: 'la SA-lo', fr: 'la salle, le séjour' }
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
					title: 'À retenir : la salle de bain, le jardin, deux meubles',
					intro: 'Marià va te les montrer.',
					items: [
						{ id: 'la-sala-de-banh', oc: 'la sala de banh', sound: 'la SA-lo dé BAN', fr: 'la salle de bain' },
						{ id: 'lo-jardin', oc: 'lo jardin', sound: 'lou djar-DI', fr: 'le jardin' },
						{ id: 'la-taula', oc: 'la taula', sound: 'la TAOU-lo', fr: 'la table' },
						{ id: 'la-cadiera', oc: 'la cadièra', sound: 'la ca-DYÈ-ro', fr: 'la chaise' }
					]
				},
				// jeu prévu par la carte : toucher l'objet dans la scène (à coder ; essai
				// /ensag/scena, à brancher). Version simple : qcm ; Marià parle, et chaque
				// choix croise la chose et la pièce, pour qu'on ne puisse pas réussir sans
				// comprendre les deux noms et dins.
				{
					type: 'qcm',
					title: 'Marià te fait visiter',
					intro:
						'Imagine la scène : Marià te montre sa maison. Touche ce qu’elle te montre : la bonne chose, dans la bonne pièce.',
					items: [
						{
							ditz: { qui: 'Marià', oc: 'Dins la cosina, i a una taula.' },
							q: 'Elle te montre…',
							options: ['la table, dans la cuisine', 'la chaise, dans la cuisine', 'la table, dans le séjour'],
							correct: 0,
							choses: ['la-taula', 'la-cosina', 'dins'],
							explain: '*la taula* : la table ; *dins la cosina* : dans la cuisine.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins la cambra, i a una cadièra.' },
							q: 'Elle te montre…',
							options: ['une chaise, dans la chambre', 'une chaise, dans la cuisine', 'une table, dans la chambre'],
							correct: 0,
							choses: ['la-cadiera', 'la-cambra'],
							explain: '*la cadièra* : la chaise ; *la cambra* : la chambre.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins la sala, i a una taula.' },
							q: 'Elle te montre…',
							options: ['une table, dans le séjour', 'une table, dans la salle de bain', 'une chaise, dans le séjour'],
							correct: 0,
							choses: ['la-sala', 'la-taula'],
							explain: '*la sala* seule : le séjour. *La sala de banh*, c’est la salle de bain.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins lo jardin, i a una galina !' },
							q: 'Elle te montre…',
							options: ['une poule, dans le jardin', 'une chatte, dans le jardin', 'une poule, dans la cuisine'],
							correct: 0,
							choses: ['lo-jardin', 'la-galina'],
							explain: '*la galina* : la poule (3.3). Mimí, elle, la regarde déjà.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins la sala de banh, non i a pas de cadièra.' },
							q: 'Elle te dit…',
							options: ['pas de chaise dans la salle de bain', 'une chaise dans la salle de bain', 'pas de chaise dans le séjour'],
							correct: 0,
							choses: ['la-sala-de-banh', 'la-cadiera', 'i-a'],
							explain: '*Non i a pas de cadièra* : il n’y a pas de chaise. Après *pas*, on dit *de*.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Ma cosina es dins la cosina !' },
							q: 'Elle te dit…',
							options: ['ma cousine est dans la cuisine', 'ma cousine est dans le jardin', 'ma tante est dans la cuisine'],
							correct: 0,
							choses: ['la-cosina', 'cosin-cosina'],
							explain: 'Le même mot, deux sens : *ma cosina*, ma cousine ; *la cosina*, la cuisine.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Qué i a dins l’ostal ?' },
							q: 'Elle te demande…',
							options: ['ce qu’il y a dans la maison', 'où est la maison', 'qui habite la maison'],
							correct: 0,
							choses: ['l-ostal'],
							explain: '*Qué i a* : qu’y a-t-il ? *l’ostal* : la maison. C’est la question de l’unité.'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : quatre de plus',
					intro: 'Ils étaient dans la visite. Mimí les connaît déjà.',
					items: [
						{ id: 'lo-canape', oc: 'lo canapè', sound: 'lou ca-na-PÈ', fr: 'le canapé' },
						{ id: 'l-armari', oc: 'l’armari', sound: 'lar-MA-ri', fr: 'l’armoire' },
						{ id: 'la-porta', oc: 'la pòrta', sound: 'la PÒR-to', fr: 'la porte' },
						{ id: 'la-fenestra', oc: 'la fenèstra', sound: 'la fé-NÈS-tro', fr: 'la fenêtre' }
					]
				},
				{
					type: 'qcm',
					title: 'La visite continue',
					intro: 'Touche ce que Marià te montre.',
					items: [
						{
							ditz: { qui: 'Marià', oc: 'Dins la sala, i a lo canapè.' },
							q: 'Elle te montre…',
							options: ['le canapé, dans le séjour', 'le canapé, dans la chambre', 'la chaise, dans le séjour'],
							correct: 0,
							choses: ['lo-canape', 'la-sala'],
							explain: '*lo canapè* : le canapé, « ca-na-PÈ ».'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins la cambra, i a l’armari.' },
							q: 'Elle te montre…',
							options: ['l’armoire, dans la chambre', 'l’armoire, dans la cuisine', 'la fenêtre, dans la chambre'],
							correct: 0,
							choses: ['l-armari', 'la-cambra'],
							explain: '*l’armari* : l’armoire, et c’est un mot masculin : *un armari*.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Dins la cosina, non i a pas de fenèstra.' },
							q: 'Elle te dit…',
							options: ['pas de fenêtre dans la cuisine', 'une fenêtre dans la cuisine', 'pas de porte dans la cuisine'],
							correct: 0,
							choses: ['la-fenestra', 'i-a'],
							explain: '*la fenèstra* : la fenêtre. *Non i a pas de fenèstra* : il n’y en a pas.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Mimí es a la pòrta.' },
							q: 'Mimí est…',
							options: ['à la porte', 'à la fenêtre', 'dans l’armoire'],
							correct: 0,
							choses: ['la-porta'],
							explain: '*la pòrta* : la porte, « PÒR-to ». Mimí veut sortir !'
						}
					]
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
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Chez toi, il y a un jardin ? Réponds pour toi : il y en a un, ou il n’y en a pas.',
							answers: ['I a un jardin.', 'Òc, i a un jardin.', 'Non i a pas de jardin.'],
							choses: ['lo-jardin', 'i-a'],
							explain: '*I a un jardin*, ou *Non i a pas de jardin* : après *pas*, on dit *de*.'
						},
						{
							consigne: 'Il y a une table dans la cuisine.',
							answers: ['I a una taula dins la cosina.', 'Dins la cosina, i a una taula.'],
							choses: ['la-taula', 'dins', 'la-cosina']
						},
						{
							consigne: 'Demande ce qu’il y a dans la chambre.',
							answers: ['Qué i a dins la cambra ?'],
							choses: ['la-cambra', 'dins'],
							explain: '*Qué i a… ?* : qu’y a-t-il… ? Comme la question de l’unité.'
						},
						{
							consigne: 'Le canapé est dans le séjour.',
							answers: ['Lo canapè es dins la sala.'],
							choses: ['lo-canape', 'la-sala']
						},
						{
							consigne: 'Mimí est dans l’armoire !',
							answers: ['Mimí es dins l’armari !'],
							choses: ['l-armari', 'dins'],
							explain: '*l’armari* : *lo* devient *l’* devant la voyelle.'
						},
						{
							consigne: 'la porte et la fenêtre',
							answers: ['la pòrta e la fenèstra'],
							choses: ['la-porta', 'la-fenestra'],
							explain: 'Deux *ò* et *è* ouverts : « la PÒR-to é la fé-NÈS-tro ».'
						},
						{
							consigne: 'Il n’y a pas de chaise dans la salle de bain.',
							answers: ['Non i a pas de cadièra dins la sala de banh.', 'Dins la sala de banh, non i a pas de cadièra.'],
							choses: ['la-cadiera', 'la-sala-de-banh']
						},
						{
							consigne: 'Tu fais visiter : « Ici, il y a la cuisine. »',
							answers: ['Aquí, i a la cosina.'],
							choses: ['la-cosina', 'i-a'],
							explain: '*Aquí, i a…* : on montre, et on nomme, comme Marià.'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Dans la maison, il y a une cuisine, une chambre et une salle de bain.',
							tiles: ['Dins', 'l’ostal,', 'i', 'a', 'una', 'cosina,', 'una', 'cambra', 'e', 'una', 'sala', 'de', 'banh.'],
							choses: ['l-ostal', 'la-cosina', 'la-cambra', 'la-sala-de-banh'],
							explain: '*Dins l’ostal, i a…* : toute la visite en une phrase.'
						},
						{
							prompt: 'La chatte est dans le jardin, et le chien est dans la maison.',
							tiles: ['La', 'cata', 'es', 'dins', 'lo', 'jardin,', 'e', 'lo', 'can', 'es', 'dins', 'l’ostal.'],
							choses: ['lo-jardin', 'l-ostal', 'dins'],
							explain: '*dins lo jardin*, mais *dins l’ostal* : *lo* devient *l’* devant la voyelle.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : fais visiter',
					intro:
						'Fais visiter, à voix haute, une maison que tu connais : la tienne, celle d’une amie, celle de tes grands-parents. Trois phrases, puis compare au modèle.',
					items: [
						{
							q: 'Trois phrases, à voix haute : *Aquí, i a…*',
							a: 'Par exemple : *Aquí, i a la cosina : i a una taula e una cadièra. Dins la sala, i a un canapè. E i a un jardin, amb un can !*'
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
					title: 'Le son du jour : le l final',
					paragraphs: [
						'À la fin d’un mot, le *l* se dit bien « l » : *l’ostal* « lous-TAL », *l’aucèl* « laou-SÈL », *lo caval* « lou ca-BAL ».',
						'Ailleurs en Occitanie, ce *l* devient souvent « ou » : *l’ostau*. En languedocien, on garde le « l ».',
						'Écoute, puis répète : *l’ostal*, *espanhòl*, *l’aucèl*, *lo caval*.'
					],
					glosa: { 'l’ostau': 'la maison, dans d’autres dialectes (gascon, provençal…)' }
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*L’ostal* se dit, en languedocien…',
							options: ['lous-TAL', 'lous-TAOU'],
							correct: 0,
							noShuffle: true,
							explain: '« lous-TAOU », c’est *l’ostau*, la forme d’autres pays d’oc. Ici, le *l* final reste « l ».'
						},
						{
							q: '*Lo caval* se dit…',
							options: ['lou ca-BAL', 'lo ca-VAL'],
							correct: 0,
							noShuffle: true,
							explain: '« lo ca-VAL », c’est la lecture à la française. En occitan, *o* sonne « ou », *v* sonne « b », et le *l* final s’entend.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Benvenguda dins l’ostal, Mimí !*',
							a: '« bén-bén-GU-do dins lous-TAL, mi-MI ! » : le *l* de *ostal*, bien net.'
						},
						{
							q: '*L’aucèl e lo caval son dins lo jardin.*',
							a: '« laou-SÈL é lou ca-BAL soun dins lou djar-DI » : deux *l* finaux, et le *n* de *jardin* qui s’efface.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : l’ostal, la maison et la famille',
					paragraphs: [
						'Pour Mistral, *oustau* (en languedocien, *ostal*) veut dire la maison, le logis ; le mot vient du latin « hospitaculum ». Et la maison, c’est aussi la famille : on disait *cap d’oustau* pour le chef de maison, l’aîné, et *noum d’oustau* pour le nom de famille.',
						'Des noms de famille béarnais en viennent : Loustau, Loustaunau, Deloustau.',
						'Source : Frédéric Mistral, *Lou Trésor dóu Felibrige*, tome II, article OUSTAU.'
					],
					glosa: {
						'cap d’oustau': 'le chef de maison (provençal, dans la graphie de Mistral)',
						'noum d’oustau': 'le nom de famille (provençal, dans la graphie de Mistral)',
						'Lou Trésor dóu Felibrige': 'Le Trésor du Félibrige, le dictionnaire de Mistral (1879)'
					},
					lien: { href: 'https://archive.org/details/loutrsordufelibr02mist', texte: 'Le Trésor du Félibrige, tome II (Internet Archive)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'nommer les pièces d’une maison et les meubles',
						'dire ce qu’il y a dans une pièce, et ce qu’il n’y a pas',
						'faire visiter : *Aquí, i a la sala.*',
						'dire bien net le *l* final de *ostal*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ce qu’il y a dans une maison, et la faire visiter.',
						'Si tu en as envie : fais visiter ta maison en occitan à une personne précise, ta fille, un ami, ton chat même : *Aquí, i a la cosina.* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
