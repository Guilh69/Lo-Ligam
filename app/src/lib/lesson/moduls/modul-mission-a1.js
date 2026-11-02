// Mission A1 · au format du DCL, en plus court (carte de l'A1 §5 ;
// cursus/lexic-A1.md, Mission A1 ; revisions/2026-10-24-progression-catala.md
// §2.9). Rédigée par Claude le 2026-11-02. Aucun mot nouveau : seulement
// l'« À retenir » des modules 0 à 8.4 ; *mission* est glosé (même mot qu'en
// français).
// Les épreuves du DCL, en petit : lire (une affiche de fête), écouter (un
// message, ici lu, avec son « ça sonne comme »), préparer sa présentation pour
// la visio et répondre aux questions (dialogue à choix, avec le tour « rester
// en occitan », règle 13), écrire (un court message). Le DCL commence à l'A2 :
// ici, c'est un entraînement, pas un diplôme ; rien n'est noté.
// Giulia, l'amie italienne et occitane de l'unité 2 (2.1, 2.4), vient à la
// fête du village. La condition passe par une question (*Plòu ? Lo balèti
// es…*) : *se* au sens de « si » n'est pas enseigné à l'A1.
// ⚠️ Occitan à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modulMissionA1 = {
	id: 'modul-mission-a1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: 'mission-a1',
	unitat: 'Mission A1',
	nivel: 'A1 · Mission',
	oc: 'Mission A1',
	fr: 'Mission A1 au format du DCL (lire, écouter, parler, écrire)',
	cando:
		'Je peux lire une affiche de fête, comprendre un message, présenter un petit programme à quelqu’un en visio et lui écrire un court message, avec les mots de l’A1.',
	durada: '~45 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Giulia'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'*Mission* en occitan, le même mot qu’en français, dit « mi-SYOU » comme *l’addicion* « la-di-SYOU » : d’accord ?',
		'Sur l’affiche, la condition passe par une question : *Plòu ? Lo balèti es dins la sala del vilatge.* (*se* au sens de « si » n’est pas enseigné à l’A1). D’accord ?',
		'*A dissabte !* (à samedi !) pour finir un message : d’accord ?',
		'Dans son message, Giulia dit *Dissabte, soi a la gara a onze oras e mièja* (« je suis à la gare » pour « j’arrive », le verbe *arribar* n’étant pas enseigné à l’A1) : d’accord ?',
		'Giulia n’aime pas le cassoulet (*Mas lo caçolet… m’agrada pas.*) : la touche d’humour te va ?',
		'La dernière note propose de présenter la mission en visio, avec toi dans le rôle de Giulia : d’accord ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Ta mission
		{
			title: 'Ta mission',
			minutes: 3,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'Ta mission',
					glosa: { mission: 'mission' },
					paragraphs: [
						'Giulia, ton amie italienne et occitane, vient à la fête de ton village, samedi et dimanche. Elle t’a laissé un message. Ta mission : lire l’affiche de la fête, écouter son message, lui choisir un programme, le lui présenter en visio, puis lui écrire.',
						'C’est le format du DCL, le diplôme de compétence en langue occitane : lire, écouter, présenter, discuter, écrire. Le DCL commence au niveau A2 : ici, c’est un entraînement, pas un diplôme, et rien n’est noté.',
						'En occitan aussi, c’est une *mission* : le même mot, qui se dit « mi-SYOU », comme *l’addicion* « la-di-SYOU ». Un conseil du DCL : tu ne comprendras pas tout, et ce n’est pas grave. Cherche ce qui sert à ta mission.'
					]
				}
			]
		},

		// ————————————————————————————————— 2. Legís
		{
			title: 'Legís',
			fr: 'lis',
			minutes: 7,
			blocks: [
				{
					type: 'note',
					variant: 'info',
					title: 'L’affiche de la fête',
					paragraphs: [
						'**Fèsta del vilatge · dissabte e dimenge**',
						'**Dissabte**',
						'*A dètz oras : mercat sus la plaça.*',
						'*A miègjorn : caçolet davant la glèisa. Dètz euros.*',
						'*A quatre oras : la corala canta dins la glèisa.*',
						'*Lo ser, a nòu oras : balèti sus la plaça. Cinc euros.*',
						'*Plòu ? Lo balèti es dins la sala del vilatge.*',
						'**Dimenge**',
						'*A onze oras : cartas, al cafè de la plaça.*',
						'*A tres oras : rugbi, darrièr la gara.*'
					]
				},
				{
					type: 'qcm',
					title: 'La grille de lecture',
					intro: 'Comme au DCL : des questions pour vérifier ce que tu as lu. Relis l’affiche autant que tu veux.',
					items: [
						{
							q: 'La fête dure…',
							options: ['deux jours : samedi et dimanche', 'un jour : le samedi', 'toute la semaine'],
							correct: 0,
							choses: ['dissabte', 'dimenge'],
							explain: 'Tout en haut : *dissabte e dimenge*, samedi et dimanche.'
						},
						{
							q: 'Le bal commence à…',
							options: ['21 h', '19 h', '9 h'],
							correct: 0,
							choses: ['a-quina-ora', 'lo-ser'],
							explain: '*Lo ser, a nòu oras* : le soir, à neuf heures, donc 21 h.'
						},
						{
							q: 'S’il pleut, le bal a lieu…',
							options: ['dans la salle du village', 'sur la place', 'dans l’église'],
							correct: 0,
							choses: ['plou', 'la-sala'],
							explain: '*Plòu ? Lo balèti es dins la sala del vilatge* : il pleut ? Le bal est dans la salle du village.'
						},
						{
							q: 'Le cassoulet de midi coûte…',
							options: ['10 €', '5 €', '12 €'],
							correct: 0,
							choses: ['nombre-10', 'euro-centim'],
							explain: '*Caçolet davant la glèisa. Dètz euros.* Cinq euros, c’est le bal ; douze (*dotze*), personne ne le dit.'
						},
						{
							q: 'La chorale chante…',
							options: ['dans l’église, samedi à 16 h', 'sur la place, samedi à 16 h', 'dans l’église, dimanche à 14 h'],
							correct: 0,
							choses: ['dins', 'la-gleisa'],
							explain: 'Samedi : *A quatre oras : la corala canta dins la glèisa*, à quatre heures, dans l’église.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Escota
		{
			title: 'Escota',
			fr: 'écoute',
			minutes: 6,
			blocks: [
				{
					type: 'dialogue',
					title: 'Le message de Giulia',
					intro:
						'Jeudi soir, Giulia t’a laissé un message sur ton téléphone. Ici, le message est écrit : touche une phrase pour voir comment elle sonne. Lis une première fois pour répondre à une seule question : qu’est-ce que Giulia te demande ?',
					scenes: [
						{
							title: 'Giulia',
							subtitle: '(message sur ton téléphone, jeudi soir)',
							lines: [
								{ oc: 'Adieu ! Es Giulia. Cossí vas ?', sound: 'a-DIOU ! és DJOU-lia. cou-si BAS ?', fr: 'Salut ! C’est Giulia. Comment vas-tu ?' },
								{
									oc: 'Dissabte, soi a la gara a onze oras e mièja.',
									sound: 'di-SAT-té, souï a la GA-ro a oun-ZOU-ros é MYÈ-djo.',
									fr: 'Samedi, je suis à la gare à onze heures et demie.'
								},
								{
									oc: 'La fèsta, es luènh de la gara ? Cossí i vau ?',
									sound: 'la FÈS-to, és LUÈN dé la GA-ro ? cou-si i BAOU ?',
									fr: 'La fête, c’est loin de la gare ? Comment j’y vais ?'
								},
								{
									oc: 'M’agrada lo balèti… e canti dins una corala !',
									sound: 'ma-GRA-do lou ba-LÈ-ti… é CAN-ti dins U-no cou-RA-lo !',
									fr: 'J’aime le bal… et je chante dans une chorale !'
								},
								{ oc: 'Mas lo caçolet… m’agrada pas.', sound: 'mas lou ca-sou-LÉT… ma-GRA-do PAS.', fr: 'Mais le cassoulet… je n’aime pas.' },
								{
									oc: 'Dimenge, a doas oras, vau a la gara.',
									sound: 'di-MÉN-djé, a DOUOS OU-ros, baou a la GA-ro.',
									fr: 'Dimanche, à deux heures, je vais à la gare.'
								},
								{ oc: 'E quin temps fa, al vilatge ?', sound: 'é kin TÉMS FA, al bi-LA-djé ?', fr: 'Et quel temps fait-il, au village ?' },
								{ oc: 'Mercés, e a dissabte !', sound: 'mér-SÉS, é a di-SAT-té !', fr: 'Merci, et à samedi !' }
							]
						}
					]
				},
				{
					type: 'qcm',
					title: 'La grille d’écoute',
					intro: 'Une question à la fois. Tu peux relire le message.',
					items: [
						{
							q: 'Qu’est-ce que Giulia te demande ?',
							options: ['le chemin de la gare à la fête, et le temps qu’il fait', 'le prix du bal, et l’heure du cassoulet', 'où elle va dormir'],
							correct: 0,
							choses: ['cossi-i-vau', 'quin-temps-fa'],
							explain: 'Deux questions : *Cossí i vau ?* (comment j’y vais ?) et *Quin temps fa, al vilatge ?* (quel temps fait-il, au village ?).'
						},
						{
							q: 'Samedi, Giulia est à la gare à…',
							options: ['11 h 30', '11 h 15', '12 h 30'],
							correct: 0,
							choses: ['e-mieja', 'a-quina-ora'],
							explain: '*A onze oras e mièja* : à onze heures et demie.'
						},
						{
							q: 'Qu’est-ce que Giulia n’aime pas ?',
							options: ['le cassoulet', 'le bal', 'chanter'],
							correct: 0,
							choses: ['m-agrada'],
							explain: '*Mas lo caçolet… m’agrada pas* : le cassoulet, elle n’aime pas. Le bal, elle aime ; et elle chante dans une chorale.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 4. A tu ! (présenter, discuter)
		{
			title: 'A tu !',
			fr: 'prépare ta visio',
			minutes: 15,
			blocks: [
				{
					type: 'qcm',
					title: 'Choisis pour Giulia',
					intro: 'Repense au message, et relis l’affiche si tu veux : quel programme proposes-tu à Giulia ?',
					items: [
						{
							q: 'Le bon programme pour Giulia :',
							options: [
								'Dissabte, la corala a quatre oras, e lo balèti a nòu oras. Dimenge, las cartas a onze oras.',
								'Dissabte, lo caçolet a miègjorn, e lo balèti a nòu oras. Dimenge, lo rugbi a tres oras.',
								'Dissabte, lo mercat a dètz oras, e la corala a quatre oras. Dimenge, lo rugbi a tres oras.'
							],
							correct: 0,
							oc: true,
							choses: ['a-quina-ora'],
							explain: 'Le cassoulet, elle n’aime pas. Le marché, à dix heures, elle n’est pas encore là (*a onze oras e mièja*). Le rugby, à trois heures, elle est déjà repartie (*Dimenge, a doas oras, vau a la gara*). Restent la chorale, le bal… et les cartes !'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris ta présentation)',
					intro:
						'Six phrases, une à la fois. Quand c’est libre, écris tes vraies idées. À la fin, la page les rassemble : c’est ce que tu diras à Giulia en visio.',
					recap: 'Ta présentation, à dire à voix haute :',
					items: [
						{
							consigne: 'Salue Giulia (vous vous tutoyez), et demande-lui comment elle va.',
							answers: ['Adieu, Giulia ! Cossí vas ?'],
							choses: ['adieu', 'cossi-vas'],
							explain: '*Adieu* quand on se tutoie, et *Cossí vas ?*'
						},
						{
							consigne: 'Propose-lui le programme de samedi après-midi.',
							debut: ['Dissabte', 'A quatre oras'],
							choses: ['dissabte', 'a-quina-ora'],
							explain: 'Par exemple : *Dissabte, a quatre oras, la corala canta dins la glèisa.*'
						},
						{
							consigne: 'Et samedi soir ? Dis l’heure, et le prix.',
							debut: ['Lo ser', 'A nòu oras', 'Dissabte'],
							choses: ['lo-ser', 'quant-costa'],
							explain: 'Par exemple : *Lo ser, a nòu oras, i a lo balèti, sus la plaça. Còsta cinc euros.*'
						},
						{
							consigne: 'Et dimanche matin ?',
							debut: ['Dimenge', 'A onze oras'],
							choses: ['dimenge', 'i-a'],
							explain: 'Par exemple : *Dimenge, a onze oras, i a las cartas, al cafè de la plaça.*'
						},
						{
							consigne: 'Dis-lui qu’il y a une chambre pour elle, chez toi.',
							answers: ['I a una cambra per tu.'],
							choses: ['i-a', 'la-cambra', 'per-ieu'],
							explain: '*I a una cambra per tu* : il y a une chambre pour toi.'
						},
						{
							consigne: 'Pour finir, dis ce que tu aimes, toi, à la fête.',
							debut: ['M’agrada', 'M’agradan'],
							choses: ['m-agrada'],
							explain: 'Par exemple : *M’agrada lo caçolet !* (Giulia, elle, n’aime pas.)'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'je salue Giulia, et je reste au « tu » jusqu’au bout',
						'je propose au moins trois moments de la fête, chacun avec son heure',
						'je dis où sont les choses : *sus la plaça*, *dins la glèisa*…',
						'je dis où elle dort',
						'la prononciation : *oras* sonne « OU-ros », la syllabe forte est marquée'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde un exemple.',
							a: '*Adieu, Giulia ! Cossí vas ? Dissabte, a quatre oras, la corala canta dins la glèisa. Lo ser, a nòu oras, i a lo balèti, sus la plaça : còsta cinc euros. Dimenge, a onze oras, i a las cartas, al cafè de la plaça. I a una cambra per tu. E ieu, m’agrada lo caçolet !*'
						}
					]
				},
				{
					type: 'causida',
					title: 'Giulia te pose des questions',
					intro:
						'En visio, après ta présentation, Giulia te pose des questions. C’est toi qui réponds : choisis chaque réplique. Si elle ne va pas, Giulia te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Giulia',
					tours: [
						{
							situacion: 'Sur l’affiche : *Lo ser, a nòu oras : balèti sus la plaça. Cinc euros.*',
							ditz: 'Lo balèti, quant còsta ?',
							options: [
								{ oc: 'Cinc euros.', bon: true },
								{ oc: 'Cinc oras.', reaccion: 'Giulia rit : elle demandait le prix, pas l’heure !' },
								{ oc: 'Cinquanta euros.', reaccion: 'Giulia ouvre de grands yeux : cinquante euros, pour un bal de village ?' }
							],
							choses: ['quant-costa', 'nombre-5', 'euro-centim'],
							explain: '*Quant còsta ?* : combien ça coûte ? *Cinc euros* : cinq euros.'
						},
						{
							situacion: 'La radio annonce de la pluie pour samedi soir. Sur l’affiche : *Plòu ? Lo balèti es dins la sala del vilatge.*',
							ditz: 'E dissabte, quin temps fa ?',
							options: [
								{ oc: 'Plòu… mas lo balèti es dins la sala del vilatge.', bon: true },
								{ oc: 'Fa bèl ! Lo balèti es sus la plaça.', reaccion: 'Giulia fronce les sourcils : chez elle, la radio annonce de la pluie au village…' },
								{ oc: 'Plòu… e i a pas de balèti.', reaccion: 'Giulia, déçue : pas de bal ? Pourtant, l’affiche le dit : s’il pleut, il a lieu dans la salle du village.' }
							],
							choses: ['plou', 'quin-temps-fa', 'la-sala'],
							explain: '*Plòu* : il pleut. *Mas lo balèti es dins la sala del vilatge* : mais le bal est dans la salle du village.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Giulia hésite, puis passe au français, plus vite : « Et dimanche matin, il y a quelque chose, avant mon train ? »',
							options: [
								{ oc: 'Dimenge, a onze oras, i a las cartas, al cafè de la plaça.', bon: true },
								{ oc: 'Compreni pas.', reaccion: 'Giulia répète en français, plus lentement… et la visio glisse vers le français. Tu avais pourtant compris : réponds-lui en occitan !' },
								{ oc: 'Dimenge, a tres oras, i a lo rugbi.', reaccion: 'Giulia secoue la tête : à trois heures, elle sera déjà dans le train !' }
							],
							choses: ['dimenge', 'i-a', 'a-quina-ora'],
							explain: 'Elle passe au français ; toi, tu restes en occitan, avec des mots qu’elle connaît. *Dimenge, a onze oras* : dimanche, à onze heures.'
						},
						{
							situacion: 'Chez toi, c’est à côté de l’église, tout près de la place.',
							ditz: 'E ton ostal, es luènh de la plaça ?',
							options: [
								{ oc: 'Non, es prèp : al costat de la glèisa.', bon: true },
								{ oc: 'Òc, es luènh : al costat de la glèisa.', reaccion: 'Giulia s’étonne : loin ? L’église est juste à côté de la place !' },
								{ oc: 'Non, es prèp : jos la glèisa.', reaccion: 'Giulia rit : tu habites sous l’église ? Dans la crypte ?' }
							],
							choses: ['es-luenh', 'al-costat-de', 'la-gleisa'],
							explain: '*Es prèp* : c’est près. *Al costat de la glèisa* : à côté de l’église.'
						},
						{
							ditz: 'Òsca ! Mercés, e a dissabte !',
							options: [
								{ oc: 'De res ! A dissabte, Giulia !', bon: true },
								{ oc: 'De res ! A dimenge, Giulia !', reaccion: 'Giulia rit : dimanche ? Elle arrive samedi, à onze heures et demie !' },
								{ oc: 'Mercés ! Adieu-siatz, Giulia !', reaccion: 'Giulia sourit : *Adieu-siatz* ? Vous vous tutoyez, depuis le temps !' }
							],
							choses: ['de-res', 'adieu-siatz'],
							explain: 'Elle te dit merci : *De res !* (de rien). Et *A dissabte !* : à samedi !'
						}
					],
					fin: 'Bravo ! Giulia sait tout : le programme, le prix du bal, le temps qu’il fera et où tu habites. Toute la visio en occitan, même quand elle est passée au français.'
				}
			]
		},

		// ————————————————————————————————— 5. Escriu
		{
			title: 'Escriu',
			fr: 'écris',
			minutes: 8,
			blocks: [
				{
					type: 'escriure',
					title: 'Ton message à Giulia',
					intro:
						'Après la visio, réponds à son message : le rendez-vous, le chemin, le temps. Cinq phrases, une à la fois ; à la fin, la page les rassemble : c’est ton message.',
					recap: 'Ton message à Giulia :',
					items: [
						{
							consigne: 'Commence ton message : salue Giulia.',
							answers: ['Adieu, Giulia !', 'Bonjorn, Giulia !'],
							choses: ['adieu', 'bonjorn'],
							explain: 'Quand on se tutoie : *Adieu, Giulia !*'
						},
						{
							consigne: 'Le rendez-vous : samedi, à onze heures et demie, tu es à la gare.',
							answers: ['Dissabte, a onze oras e mièja, soi a la gara.', 'Dissabte, soi a la gara a onze oras e mièja.'],
							choses: ['dissabte', 'e-mieja', 'la-gara'],
							explain: '*Soi a la gara* : je suis à la gare. Et l’heure : *a onze oras e mièja*.'
						},
						{
							consigne: 'Réponds à sa première question : la fête est près de la gare ; donne le chemin.',
							debut: ['Es prèp', 'Non, es prèp', 'La fèsta es prèp'],
							choses: ['es-luenh', 'tot-drech', 'primier-segond', 'la-carriera'],
							explain: 'Par exemple : *La fèsta es prèp de la gara : tot drech, puèi la primièra carrièra a drecha.*'
						},
						{
							consigne: 'Réponds à son autre question : le temps qu’il fait au village.',
							debut: ['Fa', 'Plòu', 'Nèva', 'Uèi', 'Al vilatge'],
							choses: ['quin-temps-fa', 'uei'],
							explain: 'Par exemple : *Uèi, fa bèl, mas fa freg.* Ou : *Plòu… mas lo balèti es dins la sala del vilatge !*'
						},
						{
							consigne: 'Finis ton message.',
							debut: ['A dissabte', 'A lèu', 'Al còp que ven', 'Mercés'],
							choses: ['a-leu', 'al-cop-que-ven'],
							explain: '*A dissabte !* (à samedi !), ou *A lèu !* (à bientôt !).'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde un exemple.',
							a: '*Adieu, Giulia ! Dissabte, a onze oras e mièja, soi a la gara. La fèsta es prèp de la gara : tot drech, puèi la primièra carrièra a drecha. Uèi, fa bèl, mas fa freg. A dissabte !*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo bilanç
		{
			title: 'Lo bilanç',
			fr: 'le bilan',
			minutes: 4,
			blocks: [
				{
					type: 'checklist',
					key: 'bilan',
					title: 'À la fin de l’A1, je peux…',
					intro: 'Coche seulement ce que tu sais déjà faire.',
					items: [
						'me présenter, et présenter ma famille et mes proches',
						'parler de mon métier, de mes journées, de ce que j’aime',
						'acheter au marché, et commander au café',
						'demander et indiquer le chemin, et dire où sont les choses',
						'comprendre une affiche ou un message simple, et y répondre'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Fin de l’A1 : présente ta mission en visio',
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant te présenter, parler de ta journée, faire tes courses, trouver ton chemin et accueillir quelqu’un, tout en occitan. La suite : l’A2, le premier niveau du DCL.',
						'Avant, présente ta mission en visio : prends rendez-vous avec Romain pour un cours ; il joue le rôle de Giulia. Tu lui présentes ton programme, il te pose des questions, puis tu lui lis ton message.',
						'C’est un entraînement : rien n’est noté. Garde ta préparation sous les yeux.'
					],
					lien: { href: '/apren/visio', texte: 'Prendre rendez-vous en visio' }
				}
			]
		}
	]
};
