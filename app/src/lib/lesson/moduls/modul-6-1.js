// Module 6.1 · A1 · « Quina ora es ? » : unité 6 (La jornada), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : Es una ora (une seule heure) ; Son doas oras, son tres
// oras… (son : elles sont) ; e quart, e mièja, mens lo quart ; a + l'heure
// (lexic-A1.md, 6.1).
// Scène de l'unité : une journée, du matin au soir. Ici, un mardi au village :
// le matin, Loís croise Yasmine (paysanne, au travail depuis cinq heures) ; le
// soir, Marià et Yasmine attendent Loís (cuisinier, il finit tard).
// Jeu du jour : placer les aiguilles (qcm, la position des aiguilles en mots).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01, plus
// bona le 2026-11-02), à valider par Romain.

export const modul61 = {
	id: 'modul-6-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '6-1',
	unitat: 'Unitat 6 · La jornada',
	nivel: 'A1 · Modul 6.1',
	oc: 'Quina ora es ?',
	fr: 'Quelle heure est-il ? Demander l’heure, la dire, et dire à quelle heure',
	cando:
		'Je peux demander l’heure et la dire (et quart, et demie, moins le quart), dire midi et minuit, et dire à quelle heure je fais quelque chose.',
	durada: '~50 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25), comme en 1.1.
	ouverture: {
		numero: 6,
		bloc: { oc: 'Lo monde a l’entorn', fr: 'le monde autour' },
		titre: 'La jornada',
		fr: 'la journée',
		question: 'Quina ora es ?',
		questionFr: 'quelle heure est-il ?',
		phrase:
			'Une journée, du matin au soir, avec ceux que tu connais. En quatre modules, tu sauras dire l’heure, le temps qu’il fait, raconter ta journée, puis la redire sans regarder, de plus en plus vite. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Loís', 'Marià', 'Karim'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Liaisons proposées : *cinc oras* « SIN-kou-ros », *uèch oras* « UÈ-tchou-ros », *dètz oras* « DÈ-dzou-ros », comme *tres oras* « TRÉ-zou-ros » du lexique ; mais *nòu oras* « NÒOU OU-ros ». C’est ton usage ?',
		'*Bona jornada !* (bonne journée), glosé dans la scène et repris dans le jeu : d’accord ?',
		'*Ara, Loís trabalha* (en ce moment, Loís travaille), dit Yasmine : naturel pour toi ?',
		'Le jeu « placer les aiguilles » est en mots (petite aiguille sur le 3…), en attendant une horloge à toucher : ça te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des unités 4 et 5',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Au marché, tu demandes le prix d’un fromage :',
							options: ['Quant còsta ?', 'Quant còstan ?', 'Quant as d’ans ?'],
							correct: 0,
							oc: true,
							choses: ['quant-costa'],
							explain: '*Quant còsta ?* : une seule chose. *Quant còstan ?* : plusieurs. *Quant as d’ans ?*, c’est l’âge.'
						},
						{
							q: 'Deux sœurs :',
							options: ['doas sòrres', 'dos sòrres', 'dos fraires'],
							correct: 0,
							oc: true,
							choses: ['nombre-2', 'la-sorre'],
							explain: '*doas* devant un nom féminin, *dos* devant un masculin : *dos fraires*, *doas sòrres*. Garde *doas* en tête : il revient aujourd’hui.'
						},
						{
							q: 'Chaque jeudi, je joue aux cartes :',
							options: ['Lo dijòus, jògui a las cartas.', 'Dijòus, jògui a las cartas.', 'Lo dijòus, jòga a las cartas.'],
							correct: 0,
							oc: true,
							choses: ['dijous', 'jogar'],
							explain: '*Lo dijòus* : chaque jeudi, l’habitude. Sans *lo* : ce jeudi-là. *jòga*, c’est « il » ou « elle ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Écris en lettres : 8.',
							answers: ['uèch'],
							choses: ['nombre-8'],
							explain: '*uèch* : 8, « UÈTCH ». Les nombres de 1 à 12 te servent aujourd’hui à dire l’heure.'
						},
						{
							consigne: 'Le samedi (chaque samedi), Karim travaille.',
							answers: ['Lo dissabte, Karim trabalha.', 'Karim trabalha lo dissabte.'],
							choses: ['dissabte', 'trabalhar'],
							explain: '*Lo dissabte* : chaque samedi. *trabalha* : il travaille.'
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
					title: 'Une journée au village',
					intro:
						'Un mardi, au village. Le matin, Loís croise Yasmine sur la place : elle revient déjà des champs. Le soir, Marià et Yasmine attendent Loís pour manger ; il arrive en retard. Bien plus tard, on se demande l’heure. Lis une première fois pour répondre à une seule question : qui commence à travailler le plus tôt ?',
					scenes: [
						{
							title: 'Lo matin',
							subtitle: '(le matin, sur la place : Loís et Yasmine)',
							lines: [
								{ oc: 'Bonjorn, Yasmine ! Quina ora es ?', sound: 'boun-DJOUR, yas-MI-ne ! KI-no OU-ro ÉS ?', fr: 'Bonjour, Yasmine ! Quelle heure est-il ?' },
								{ oc: 'Son nòu oras e quart.', sound: 'soun NÒOU OU-ros é KART.', fr: 'Il est neuf heures et quart.' },
								{ oc: 'Trabalhi a dètz oras. E tu, a quina ora trabalhas ?', sound: 'tra-BA-lyi a DÈ-dzou-ros. é TU, a KI-no OU-ro tra-BA-lyos ?', fr: 'Je travaille à dix heures. Et toi, à quelle heure travailles-tu ?' },
								{ oc: 'Ieu ? A cinc oras !', sound: 'YÉOU ? a SIN-kou-ros !', fr: 'Moi ? À cinq heures !' },
								{ oc: 'A cinc oras ? Òsca ! E a miègjorn, manjam amb Marià ?', sound: 'a SIN-kou-ros ? ÒS-co ! é a myèd-DJOUR, man-DJAN am ma-ri-A ?', fr: 'À cinq heures ? Bravo ! Et à midi, on mange avec Marià ?' },
								{ oc: 'A miègjorn, cosinas, tu ! Lo ser, a uèch oras ?', sound: 'a myèd-DJOUR, cou-ZI-nos, TU ! lou SÉ, a UÈ-tchou-ros ?', fr: 'À midi, tu cuisines, toi ! Le soir, à huit heures ?' },
								{ oc: 'A uèch oras e mièja. Bona jornada, Yasmine !', sound: 'a UÈ-tchou-ros é MYÈ-djo. BOU-no djour-NA-do, yas-MI-ne !', fr: 'À huit heures et demie. Bonne journée, Yasmine !' },
								{ oc: 'Bona jornada !', sound: 'BOU-no djour-NA-do !', fr: 'Bonne journée !' }
							]
						},
						{
							title: 'Lo ser',
							subtitle: '(le soir, chez Marià : Marià et Yasmine attendent ; puis Loís arrive)',
							lines: [
								{ oc: 'Quina ora es, Yasmine ?', sound: 'KI-no OU-ro ÉS, yas-MI-ne ?', fr: 'Quelle heure est-il, Yasmine ?' },
								{ oc: 'Son nòu oras mens lo quart.', sound: 'soun NÒOU OU-ros méns lou KART.', fr: 'Il est neuf heures moins le quart.' },
								{ oc: 'E Loís ? Manjam a uèch oras e mièja !', sound: 'é lou-ÍS ? man-DJAN a UÈ-tchou-ros é MYÈ-djo !', fr: 'Et Loís ? On mange à huit heures et demie !' },
								{ oc: 'Ara, Loís trabalha : es cosinièr !', sound: 'A-ro, lou-ÍS tra-BA-lyo : és cou-zi-NYÈ !', fr: 'En ce moment, Loís travaille : il est cuisinier !' },
								{ oc: 'Marià, Yasmine, adieu-siatz ! Soi aquí !', sound: 'ma-ri-A, yas-MI-ne, a-di-SSIATS ! souï a-KI !', fr: 'Marià, Yasmine, bonsoir ! Je suis là !' }
							]
						},
						{
							title: 'Mièjanuèch ?',
							subtitle: '(bien plus tard, à table)',
							lines: [
								{ oc: 'Quina ora es, Marià ? Mièjanuèch ?', sound: 'KI-no OU-ro ÉS, ma-ri-A ? myè-dja-NUÈTCH ?', fr: 'Quelle heure est-il, Marià ? Minuit ?' },
								{ oc: 'Non, Loís : es una ora !', sound: 'NOU, lou-ÍS : é-ZU-no OU-ro !', fr: 'Non, Loís : il est une heure !' },
								{ oc: 'Una ora ? E deman, trabalhi a cinc oras…', sound: 'U-no OU-ro ? é dé-MA, tra-BA-lyi a SIN-kou-ros…', fr: 'Une heure ? Et demain, je travaille à cinq heures…' }
							]
						}
					],
					glossary: [
						{ oc: 'Bona jornada !', sound: 'BOU-no djour-NA-do', fr: 'bonne journée ! (on se la souhaite en se quittant, le matin)' },
						{ oc: 'Òsca !', sound: 'ÒS-co', fr: 'bravo !' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui commence à travailler le plus tôt ?',
							options: ['Yasmine, à cinq heures', 'Loís, à dix heures', 'Marià, à huit heures et demie'],
							correct: 0,
							choses: ['a-quina-ora'],
							explain: '*A cinc oras !* répond Yasmine : elle est paysanne. Loís commence *a dètz oras*. Marià, elle, est à la retraite : à huit heures et demie, elle attend Loís pour manger.'
						},
						{
							q: 'Le matin, sur la place, il est…',
							options: ['neuf heures et quart', 'neuf heures moins le quart', 'cinq heures'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*Son nòu oras e quart* : 9 h 15. *Nòu oras mens lo quart*, c’est le soir, chez Marià.'
						},
						{
							q: 'À la fin de la soirée, il est…',
							options: ['une heure du matin', 'minuit', 'neuf heures moins le quart'],
							correct: 0,
							choses: ['es-una-ora'],
							explain: '*Es una ora !* dit Marià. Loís croyait qu’il était minuit, *mièjanuèch*. Et Yasmine se lève dans quatre heures…'
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
					title: 'Une heure, plusieurs heures',
					intro: 'Regarde le petit mot devant l’heure, et ce qui vient après.',
					items: [
						{
							q: '*Es una ora*, dit Marià. Pour 2 heures, on dit…',
							options: ['Son doas oras.', 'Es doas oras.', 'Son dos oras.'],
							correct: 0,
							oc: true,
							choses: ['son-doas-oras'],
							explain: 'Une heure : *es*. Plusieurs heures : *son* (elles sont). Et *doas*, car *ora* est féminin, comme *doas sòrres*.'
						},
						{
							q: '*Son nòu oras e quart.* Il est…',
							options: ['9 h 15', '9 h 45', '8 h 45'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*e quart* : et quart.'
						},
						{
							q: '*Son nòu oras mens lo quart.* Il est…',
							options: ['8 h 45', '9 h 15', '9 h 45'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*mens lo quart* : moins le quart. Il manque un quart d’heure pour arriver à neuf heures : 8 h 45.'
						},
						{
							q: '*Manjam a uèch oras e mièja.* On mange…',
							options: ['à 8 h 30', 'à 8 h 15', 'à 7 h 30'],
							correct: 0,
							choses: ['e-mieja', 'a-quina-ora'],
							explain: '*e mièja* : et demie. Et *a* devant l’heure : à huit heures.'
						},
						{
							q: '*A quina ora trabalhas ?* demande Loís. Il veut savoir…',
							options: ['à quelle heure Yasmine travaille', 'quelle heure il est maintenant', 'où Yasmine travaille'],
							correct: 0,
							choses: ['a-quina-ora'],
							explain: '*A quina ora… ?* : à quelle heure, pour une habitude ou un rendez-vous. *Quina ora es ?* : quelle heure est-il, maintenant.'
						},
						{
							q: '*Ara, Loís trabalha*, dit Yasmine. *Ara* veut dire…',
							options: ['en ce moment', 'demain', 'à huit heures'],
							correct: 0,
							choses: ['ara'],
							explain: '*ara* : maintenant, en ce moment. Loís est encore en cuisine.'
						},
						{
							q: '*Es miègjorn* : il est…',
							options: ['midi', 'minuit', 'une heure'],
							correct: 0,
							choses: ['miegjorn'],
							explain: '*miègjorn* : le milieu du jour, midi. *mièjanuèch* : le milieu de la nuit, minuit.'
						}
					]
				},
				{
					type: 'table',
					title: 'L’heure en occitan',
					intro: 'Tu l’as entendu dans la scène : une heure, *es* ; plusieurs heures, *son*.',
					head: ['', 'en occitan', 'ça sonne comme'],
					rows: [
						['1 h', '*Es una ora.*', '« é-ZU-no OU-ro »'],
						['2 h, 3 h…', '*Son doas oras.* · *Son tres oras.*', '« soun DOUOS OU-ros » · « soun TRÉ-zou-ros »'],
						['12 h · 0 h', '*Es miègjorn.* · *Es mièjanuèch.*', '« és myèd-DJOUR » · « és myè-dja-NUÈTCH »'],
						['3 h 15', '*Son tres oras e quart.*', '« … é KART »'],
						['3 h 30', '*Son tres oras e mièja.*', '« … é MYÈ-djo »'],
						['2 h 45', '*Son tres oras mens lo quart.*', '« … méns lou KART »'],
						['à 7 h', '*A sèt oras.*', '« a SÈ-tou-ros »']
					],
					notes: [
						'Une heure : *es* (il est). Plusieurs heures : *son* (elles sont). *Son* est le seul pluriel du verbe « être » de l’A1 : il sert pour l’heure.',
						'*ora* est féminin : *una ora*, *doas oras*, comme *una sòrre*, *doas sòrres*. *mièja* aussi : *e mièja*.',
						'Moins le quart : on part de l’heure qui arrive. *Son tres oras mens lo quart* : il manque un quart d’heure pour arriver à trois heures.',
						'Pour dire quand on fait quelque chose : *a* et l’heure. *Trabalhi a nòu oras.* *Lo dijòus, a uèch oras, canti.*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'quina-ora-es', oc: 'Quina ora es ?', sound: 'KI-no OU-ro ÉS', fr: 'quelle heure est-il ?' },
						{ id: 'es-una-ora', oc: 'Es una ora.', sound: 'é-ZU-no OU-ro', fr: 'il est une heure.' },
						{ id: 'son-doas-oras', oc: 'Son doas oras. · Son tres oras.', sound: 'soun DOUOS OU-ros · soun TRÉ-zou-ros', fr: 'il est deux heures. · il est trois heures. (*son* : ils sont, elles sont)' },
						{ id: 'e-mieja', oc: '… e mièja', sound: 'é MYÈ-djo', fr: '… et demie' },
						{ id: 'e-quart', oc: '… e quart · … mens lo quart', sound: 'é KART · méns lou KART', fr: '… et quart · … moins le quart' }
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
					title: 'À retenir : midi, l’heure du rendez-vous, et la journée',
					intro: 'Quatre de plus : tu en as besoin pour jouer.',
					items: [
						{ id: 'miegjorn', oc: 'miègjorn · mièjanuèch', sound: 'myèd-DJOUR · myè-dja-NUÈTCH', fr: 'midi · minuit' },
						{ id: 'a-quina-ora', oc: 'A quina ora ? · A sèt oras.', sound: 'a KI-no OU-ro · a SÈ-tou-ros', fr: 'à quelle heure ? · à sept heures.' },
						{ id: 'ara', oc: 'ara', sound: 'A-ro', fr: 'maintenant' },
						{ id: 'la-jornada', oc: 'la jornada', sound: 'la djour-NA-do', fr: 'la journée (titre de l’unité)' }
					]
				},
				// jeu prévu par la carte : placer les aiguilles sur une horloge (à coder).
				// Version simple avec `qcm` : la position des aiguilles en mots, dans un
				// sens (l'heure dite → les aiguilles), puis dans l'autre (la montre →
				// ce qu'on répond). Les mauvais choix inversent les aiguilles ou
				// confondent e quart, e mièja et mens lo quart : la forme est le jeu.
				{
					type: 'qcm',
					title: 'Place les aiguilles',
					intro:
						'Une horloge à aiguilles : la petite donne l’heure, la grande les minutes. On te dit l’heure en occitan : choisis où vont les aiguilles. Puis, à l’inverse, tu lis ta montre et tu réponds.',
					items: [
						{
							q: '*Son tres oras.*',
							options: ['petite aiguille sur le 3, grande sur le 12', 'petite aiguille sur le 12, grande sur le 3', 'petite aiguille sur le 3, grande sur le 6'],
							correct: 0,
							choses: ['son-doas-oras'],
							explain: 'L’heure pile : la grande aiguille en haut, sur le 12 ; la petite sur le 3.'
						},
						{
							q: '*Son sièis oras e mièja.*',
							options: ['petite entre le 6 et le 7, grande sur le 6', 'petite sur le 6, grande sur le 12', 'petite entre le 5 et le 6, grande sur le 6'],
							correct: 0,
							choses: ['e-mieja'],
							explain: '*e mièja* : la grande aiguille descend sur le 6, et la petite a fait la moitié du chemin vers le 7.'
						},
						{
							q: '*Son dètz oras e quart.*',
							options: ['petite juste après le 10, grande sur le 3', 'petite juste avant le 10, grande sur le 9', 'petite sur le 3, grande sur le 10'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*e quart* : la grande aiguille sur le 3, un quart du tour. Juste avant le 10, grande sur le 9, ce serait *dètz oras mens lo quart*.'
						},
						{
							q: '*Son sèt oras mens lo quart.*',
							options: ['petite juste avant le 7, grande sur le 9', 'petite juste après le 7, grande sur le 3', 'petite juste avant le 8, grande sur le 9'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*mens lo quart* : il manque un quart d’heure pour arriver à sept heures. Il est 6 h 45 : la grande aiguille sur le 9, la petite tout près du 7.'
						},
						{
							q: '*Es una ora.*',
							options: ['petite sur le 1, grande sur le 12', 'petite sur le 12, grande sur le 1', 'petite sur le 1, grande sur le 6'],
							correct: 0,
							choses: ['es-una-ora'],
							explain: 'Une seule heure, *es una ora* : la petite aiguille sur le 1, la grande sur le 12.'
						},
						{
							q: '*Es miègjorn.*',
							options: ['les deux aiguilles sur le 12, en plein jour', 'les deux aiguilles sur le 12, en pleine nuit', 'petite sur le 12, grande sur le 6'],
							correct: 0,
							choses: ['miegjorn'],
							explain: '*miègjorn* : midi. En pleine nuit, ce serait *mièjanuèch*.'
						},
						{
							ditz: { qui: 'Loís', oc: 'Quina ora es, ara ?' },
							q: 'Ta montre : petite aiguille entre le 4 et le 5, grande sur le 6. Tu réponds :',
							options: ['Son quatre oras e mièja.', 'Son cinc oras e mièja.', 'Son quatre oras e quart.'],
							correct: 0,
							oc: true,
							choses: ['quina-ora-es', 'ara', 'e-mieja'],
							explain: 'La petite a passé le 4, la grande est sur le 6 : 4 h 30, *quatre oras e mièja*.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Quina ora es ?' },
							q: 'Ta montre : petite aiguille juste avant le 9, grande sur le 9. Tu réponds :',
							options: ['Son nòu oras mens lo quart.', 'Son nòu oras e quart.', 'Son uèch oras mens lo quart.'],
							correct: 0,
							oc: true,
							choses: ['quina-ora-es', 'e-quart'],
							explain: 'Presque neuf heures, la grande sur le 9 : 8 h 45, *nòu oras mens lo quart*. On part de l’heure qui arrive.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'A quina ora manjam ?' },
							q: 'Vous aviez dit midi. Tu réponds :',
							options: ['A miègjorn.', 'Es miègjorn.', 'A mièjanuèch.'],
							correct: 0,
							oc: true,
							choses: ['a-quina-ora', 'miegjorn'],
							explain: '*A quina ora ?* appelle *a* et l’heure : *A miègjorn.* *Es miègjorn*, c’est l’heure qu’il est maintenant.'
						},
						{
							ditz: { qui: 'Loís, en partant le matin', oc: 'Bona jornada !' },
							q: 'Tu réponds :',
							options: ['Bona jornada !', 'Bon ser !', 'Bonjorn !'],
							correct: 0,
							oc: true,
							choses: ['la-jornada'],
							explain: '*Bona jornada* : bonne journée, quand on se quitte le matin. *Bon ser*, c’est pour le soir ; *Bonjorn*, pour arriver.'
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
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Demande l’heure à ton ami.',
							answers: ['Quina ora es ?', 'Quina ora es, ara ?', 'Ara, quina ora es ?'],
							choses: ['quina-ora-es'],
							explain: 'Mot à mot : quelle heure est ?'
						},
						{
							consigne: 'Réponds : il est une heure.',
							answers: ['Es una ora.'],
							choses: ['es-una-ora'],
							explain: 'Une seule heure : *es*.'
						},
						{
							consigne: 'Il est deux heures et demie.',
							answers: ['Son doas oras e mièja.'],
							choses: ['son-doas-oras', 'e-mieja'],
							explain: '*son* et *doas* : plusieurs heures, au féminin.'
						},
						{
							consigne: 'Il est midi.',
							answers: ['Es miègjorn.'],
							choses: ['miegjorn'],
							explain: '*miègjorn* : le milieu du jour.'
						},
						{
							consigne: 'Maintenant, il est sept heures.',
							answers: ['Ara, son sèt oras.', 'Son sèt oras, ara.'],
							choses: ['ara', 'son-doas-oras'],
							explain: '*ara* : maintenant. Et *son*, car sept heures, c’est plusieurs heures.'
						},
						{
							consigne: 'Demande à ton amie à quelle heure elle travaille.',
							answers: ['A quina ora trabalhas ?', 'E tu, a quina ora trabalhas ?'],
							choses: ['a-quina-ora', 'trabalhar'],
							explain: '*A quina ora… ?*, puis le verbe : *trabalhas*, tu travailles.'
						},
						{
							consigne: 'Et toi ? À quelle heure travailles-tu, ou étudies-tu ? Commence par *Trabalhi a…* (ou bien : je ne travaille pas).',
							answers: ['Trabalhi pas.'],
							debut: ['Trabalhi a', 'Lo matin, trabalhi a', 'Ieu, trabalhi a'],
							choses: ['a-quina-ora', 'trabalhar'],
							explain: 'Par exemple : *Trabalhi a nòu oras.* Ou *Trabalhi pas.*'
						},
						{
							consigne: 'Ton voisin part travailler. Souhaite-lui une bonne journée.',
							answers: ['Bona jornada !'],
							choses: ['la-jornada'],
							explain: '*Bona jornada !* : bonne journée !'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Il est six heures moins le quart.',
							tiles: ['Son', 'sièis', 'oras', 'mens', 'lo', 'quart.'],
							choses: ['e-quart', 'son-doas-oras'],
							explain: '*mens lo quart* : il est 5 h 45.'
						},
						{
							prompt: 'Le jeudi, à huit heures et demie, je chante.',
							tiles: ['Lo', 'dijòus,', 'a', 'uèch', 'oras', 'e', 'mièja,', 'canti.'],
							choses: ['a-quina-ora', 'e-mieja', 'dijous'],
							explain: '*a uèch oras e mièja* : à huit heures et demie. *Lo dijòus* : chaque jeudi.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Dis à quelle heure une personne que tu connais travaille, mange, joue ou chante. Puis compare au modèle.',
					items: [
						{
							q: 'Ta sœur, ton voisin, une collègue…',
							a: 'Par exemple : *Ma sòrre trabalha a uèch oras. A una ora, manja amb los amics. Lo dimenge, a cinc oras, jòga al rugbi.*'
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
					title: 'Le son du jour : le o sans accent',
					paragraphs: [
						'Sans accent, le *o* sonne « ou » : *ora* se dit « OU-ro », *dos* « DOUS », *Tolosa* « tou-LOU-zo ».',
						'Avec l’accent grave, *ò* garde le son « o » : *nòu* « NÒOU », *dijòus* « di-DJÒOUS ».',
						'Écoute, puis répète : *ora*, *doas oras*, *Tolosa*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*ora* se dit…',
							options: ['OU-ro', 'O-ra'],
							correct: 0,
							noShuffle: true,
							explain: '« O-ra », c’est la lecture à la française. En occitan, le *o* sans accent sonne « ou », et le *a* final sonne « o ».'
						},
						{
							q: '*Son doas oras* se dit…',
							options: ['soun DOUOS OU-ros', 'son DOAS O-ras'],
							correct: 0,
							noShuffle: true,
							explain: 'Trois *o* sans accent : trois fois « ou ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Quina ora es ? Son doas oras.*',
							a: '« KI-no OU-ro ÉS ? soun DOUOS OU-ros » : le *o* sans accent sonne « ou », quatre fois.'
						},
						{
							q: '*A Tolosa, lo dijòus, a nòu oras.*',
							a: '« a tou-LOU-zo, lou di-DJÒOUS, a NÒOU OU-ros » : sans accent, « ou » ; avec l’accent, *ò* garde le son « o ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : midi… et le Sud',
					glosa: { miejournau: 'vent du midi, vent du sud (provençal, dans l’orthographe de Mistral)' },
					paragraphs: [
						'*miègjorn*, c’est le milieu du jour : midi. Et, comme en français, c’est aussi le Sud. Dans son grand dictionnaire, Frédéric Mistral appelle *miejournau* le vent du midi, le vent du sud.',
						'Le mot français « midi » a fait le même chemin : le milieu du jour vers 1100, le Sud vers 1140, puis « le Midi », le sud de la France, en 1793.',
						'Sources : TLFi, article « midi » ; Mistral, le Trésor du Félibrige.'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander l’heure, et la dire',
						'dire et quart, et demie, moins le quart',
						'dire à quelle heure je fais quelque chose',
						'distinguer *Es una ora* et *Son doas oras*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander l’heure, et la dire.',
						'Si tu en as envie : demande *Quina ora es ?* à une personne précise, ta fille, un collègue, ton voisin. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
