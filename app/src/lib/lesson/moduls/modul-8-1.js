// Module 8.1 · A1 · « Ont es la gara ? » : unité 8 (En vila), rédigé par
// Claude le 2026-11-02 sur le modèle des unités 1 et 4 (même chemin en six
// étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : a drecha, a esquèrra, tot drech ; Es luènh ? · Es prèp.
// (lexic-A1.md, 8.1). Scène de l'unité : une journée à Toulouse, de la gare
// au café. Ici, Yasmine arrive en train et demande son chemin.
// Jeu du jour : « Ont es ? » sur un plan de ville (le plan en tableau, puis qcm).
// Le plan de l'unité (le même en 8.2, 8.3 et 8.4) : de la gare, la grande rue
// monte tout droit jusqu'à la place (l'église, le café de Bernat). Première rue :
// la boutique à gauche, l'hôpital à droite (près). Deuxième rue : le marché à
// gauche, l'école à droite (loin).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique ; benvengut, benvenguda,
// sabi, òsca le 2026-11-02), à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul81 = {
	id: 'modul-8-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '8-1',
	unitat: 'Unitat 8 · En vila',
	nivel: 'A1 · Modul 8.1',
	oc: 'Ont es la gara ?',
	fr: 'Où est la gare ? Demander son chemin',
	cando:
		'Je peux aborder quelqu’un poliment, demander où est un lieu de la ville, comprendre « à droite, à gauche, tout droit », et demander si c’est loin.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25), comme en 1.1.
	ouverture: {
		numero: 8,
		bloc: { oc: 'Lo monde a l’entorn', fr: 'le monde autour' },
		titre: 'En vila',
		fr: 'en ville',
		question: 'Ont es la gara ?',
		questionFr: 'où est la gare ?',
		phrase:
			'Une journée à Toulouse, de la gare au café. En quatre modules, tu sauras demander ton chemin, l’expliquer, commander au café, puis accueillir quelqu’un dans ta ville. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Karim', 'Núria'],
	notesRelecture: [
		'*Es luènh ?* · *Un pauc.* (c’est loin ? un peu) : naturel pour toi ?',
		'Son proposé pour *Benvenguda* (glosé en passant) : « bém-bén-GU-do ». C’est ton usage ?',
		'Karim plaisante : *Òsca, Yasmine ! Ara, siás de Tolosa !* (bravo, maintenant tu es de Toulouse). La touche d’humour te va ?',
		'Culture : le métro de Toulouse annonce les stations en occitan, sans date (aucune source sûre ne la donne). D’accord ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des unités 1 et 7',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Le chat est sous la table.',
							options: ['Lo cat es jos la taula.', 'Lo cat es sus la taula.', 'Lo cat es davant la taula.'],
							correct: 0,
							oc: true,
							choses: ['jos', 'lo-cat', 'la-taula'],
							explain: '*jos* : sous. *sus*, c’est sur ; *davant*, devant.'
						},
						{
							q: '*La pòrta es al costat de la fenèstra.*',
							options: ['La porte est à côté de la fenêtre.', 'La porte est devant la fenêtre.', 'La porte est derrière la fenêtre.'],
							correct: 0,
							choses: ['al-costat-de', 'la-porta', 'la-fenestra'],
							explain: '*al costat de* : à côté de. Devant, c’est *davant* ; derrière, *darrièr*.'
						},
						{
							q: 'La ville, en occitan :',
							options: ['la vila', 'lo vilatge', 'lo país'],
							correct: 0,
							oc: true,
							choses: ['vilatge-vila-pais'],
							explain: '*la vila* : la ville, comme dans le titre de l’unité, *En vila*. *Lo vilatge* : le village ; *lo país* : le pays.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Le chien est derrière la porte.',
							answers: ['Lo can es darrièr la pòrta.'],
							choses: ['darrier', 'lo-can', 'la-porta'],
							explain: '*darrièr* : derrière. Le *r* final se tait : « da-RRYÈ ».'
						},
						{
							consigne: 'Une amie parle trop vite : demande-lui de répéter, poliment.',
							answers: ['Pòdes repetir, se te plai ?'],
							choses: ['podes-repetir'],
							explain: 'À une amie : *se te plai*. Cette phrase va te servir en ville.'
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
					title: 'Yasmine à Toulouse',
					intro:
						'Yasmine, la paysanne, passe la journée à Toulouse. Karim l’attend devant l’hôpital, où il travaille ; Núria l’attend sur la place. À la gare, Yasmine aborde un monsieur, et le vouvoie. Lis une première fois pour répondre à une seule question : où va Yasmine en premier ?',
					scenes: [
						{
							title: 'A la gara',
							subtitle: '(Yasmine descend du train ; elle aborde un monsieur et le vouvoie)',
							lines: [
								{ oc: 'Perdon… Bonjorn ! Ont es l’espital, se vos plai ?', sound: 'pér-DOU… boun-DJOUR ! oun és lés-pi-TAL, sé bous PLAÏ ?', fr: 'Pardon… Bonjour ! Où est l’hôpital, s’il vous plaît ?' },
								{ oc: 'L’espital ? A drecha. Es prèp.', sound: 'lés-pi-TAL ? a DRÉ-tcho. és PRÈP.', fr: 'L’hôpital ? À droite. C’est près.' },
								{ oc: 'A drecha… E la plaça de la glèisa ? Es a esquèrra ?', sound: 'a DRÉ-tcho… é la PLA-ço dé la GLÈÏ-zo ? és a es-KÈ-rro ?', fr: 'À droite… Et la place de l’église ? C’est à gauche ?' },
								{ oc: 'Non, non : tot drech. Es la carrièra de la glèisa.', sound: 'NOU, NOU : tout DRÉTCH. és la ca-RRYÈ-ro dé la GLÈÏ-zo.', fr: 'Non, non : tout droit. C’est la rue de l’église.' },
								{ oc: 'Es luènh ?', sound: 'és LUÈN ?', fr: 'C’est loin ?' },
								{ oc: 'Un pauc. Mas es tot drech !', sound: 'un PAOUK. mas és tout DRÉTCH !', fr: 'Un peu. Mais c’est tout droit !' },
								{ oc: 'Mercés !', sound: 'mér-SÉS !', fr: 'Merci !' },
								{ oc: 'De res. Adieu-siatz !', sound: 'dé RÉS. a-di-SSIATS !', fr: 'De rien. Au revoir !' }
							]
						},
						{
							title: 'Davant l’espital',
							subtitle: '(Karim attend Yasmine ; ils se tutoient. Puis une jeune femme aborde Yasmine.)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Benvenguda a Tolosa !', sound: 'a-DIOU, yas-MI-ne ! bém-bén-GU-do a tou-LOU-zo !', fr: 'Salut, Yasmine ! Bienvenue à Toulouse !' },
								{ oc: 'Adieu, Karim ! E Núria, ont es ?', sound: 'a-DIOU, ka-RIM ! é NOU-ria, oun ÉS ?', fr: 'Salut, Karim ! Et Núria, où est-elle ?' },
								{ oc: 'Es sus la plaça, davant la glèisa.', sound: 'és sus la PLA-ço, da-BAN la GLÈÏ-zo.', fr: 'Elle est sur la place, devant l’église.' },
								{ oc: 'Tot drech, sabi !', sound: 'tout DRÉTCH, SA-bi !', fr: 'Tout droit, je sais !' },
								{ oc: 'Perdon… Ont es la gara, se vos plai ?', sound: 'pér-DOU… oun és la GA-ro, sé bous PLAÏ ?', fr: 'Pardon… Où est la gare, s’il vous plaît ?' },
								{ oc: 'La gara ? Es aquí, darrièr vos !', sound: 'la GA-ro ? és a-KI, da-RRYÈ BOUS !', fr: 'La gare ? Elle est ici, derrière vous !' },
								{ oc: 'Mercés ! Adieu-siatz !', sound: 'mér-SÉS ! a-di-SSIATS !', fr: 'Merci ! Au revoir !' },
								{ oc: 'Òsca, Yasmine ! Ara, siás de Tolosa !', sound: 'ÒS-co, yas-MI-ne ! A-ro, SYOS dé tou-LOU-zo !', fr: 'Bravo, Yasmine ! Maintenant, tu es de Toulouse !' }
							]
						}
					],
					glossary: [
						{ oc: 'l’espital', sound: 'lés-pi-TAL', fr: 'l’hôpital' },
						{ oc: 'Benvengut ! · Benvenguda !', sound: 'bém-bén-GUT · bém-bén-GU-do', fr: 'bienvenu ! · bienvenue ! (à un homme · à une femme)' },
						{ oc: 'sabi', sound: 'SA-bi', fr: 'je sais (*Sabi pas* : je ne sais pas)' },
						{ oc: 'Òsca !', sound: 'ÒS-co', fr: 'bravo !' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Où va Yasmine en premier ?',
							options: ['à l’hôpital, retrouver Karim', 'sur la place, retrouver Núria', 'à l’église, dans la grande rue'],
							correct: 0,
							choses: ['perdon', 'la-placa'],
							explain: 'Elle demande *Ont es l’espital ?* : Karim l’attend devant l’hôpital. Núria, ce sera après, *sus la plaça*.'
						},
						{
							q: '*Es luènh ?* demande Yasmine, pour la place. Le monsieur répond…',
							options: ['un peu, mais c’est tout droit', 'non, c’est tout près, à droite', 'oui, très loin, à gauche'],
							correct: 0,
							choses: ['es-luenh', 'tot-drech'],
							explain: '*Un pauc. Mas es tot drech !* : un peu. Mais c’est tout droit !'
						},
						{
							q: 'La jeune femme cherche la gare. Yasmine lui répond qu’elle est…',
							options: ['juste derrière elle', 'à droite, près de l’hôpital', 'sur la place, devant l’église'],
							correct: 0,
							choses: ['la-gara'],
							explain: '*Es aquí, darrièr vos !* La jeune femme tournait le dos à la gare. Karim rit : *Ara, siás de Tolosa !*'
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
					title: 'Où, et à quelle distance ?',
					intro: 'Relis ce que dit le monsieur de la gare. Trois petits mots suffisent pour guider quelqu’un.',
					items: [
						{
							q: '*L’espital ? A drecha.* L’hôpital est…',
							options: ['à droite', 'à gauche', 'tout droit'],
							correct: 0,
							choses: ['a-drecha'],
							explain: '*a drecha* : à droite. Le *ch* sonne « tch » : « a DRÉ-tcho ».'
						},
						{
							q: 'Yasmine demande : *Es a esquèrra ?* Elle croit que la place est…',
							options: ['à gauche', 'à droite', 'derrière la gare'],
							correct: 0,
							choses: ['a-esquerra'],
							explain: '*a esquèrra* : à gauche. Le monsieur la détrompe : *Non, non : tot drech.*'
						},
						{
							q: '*Tot drech* veut dire…',
							options: ['tout droit', 'à droite', 'tout près'],
							correct: 0,
							choses: ['tot-drech'],
							explain: '*drech* et *drecha*, c’est comme « droit » et « droite » : *tot drech*, tout droit ; *a drecha*, à droite.'
						},
						{
							q: '*Es la carrièra de la glèisa*, ajoute le monsieur. Il parle…',
							options: ['de la rue qui mène à l’église', 'de la place de l’église', 'de la porte de l’église'],
							correct: 0,
							choses: ['la-carriera', 'la-gleisa'],
							explain: '*la carrièra* : la rue. *La plaça*, c’est la place ; *la pòrta*, la porte.'
						},
						{
							q: '*Es luènh ?* demande Yasmine. *Un pauc*, répond le monsieur. La place est…',
							options: ['un peu loin', 'tout près', 'à gauche'],
							correct: 0,
							choses: ['es-luenh'],
							explain: '*Es luènh ?* : c’est loin ? Le contraire : *Es prèp.* (c’est près).'
						},
						{
							q: 'Pour aborder un inconnu dans la rue, Yasmine commence par…',
							options: ['Perdon…', 'De res.', 'Mercés !'],
							correct: 0,
							oc: true,
							choses: ['perdon'],
							explain: '*Perdon…* : pour aborder quelqu’un poliment. *Mercés* vient à la fin, et *De res* répond à *Mercés*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Pour demander, pour répondre',
					intro: 'Tout est dans les deux scènes :',
					head: ['pour…', 'tu dis'],
					rows: [
						['aborder quelqu’un', '*Perdon…* puis *Bonjorn !*'],
						['demander où est un lieu', '*Ont es la gara ?* · *Ont es l’espital, se vos plai ?*'],
						['indiquer la direction', '*a drecha* · *a esquèrra* · *tot drech*'],
						['dire si c’est loin', '*Es luènh ?* · *Es prèp.* · *Un pauc.*'],
						['remercier, et répondre', '*Mercés !* · *De res.*']
					],
					notes: [
						'*drech*, *drecha* : comme « droit », « droite ». *Tot drech*, tout droit ; *a drecha*, à droite.',
						'À une personne inconnue, on dit *vos* : *se vos plai*. À une amie, *se te plai*, comme dans *Pòdes repetir, se te plai ?*',
						'Pour dire « tourne » ou « prends la rue », il faut des verbes : c’est le module suivant.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'perdon', oc: 'Perdon…', sound: 'pér-DOU', fr: 'pardon…, excuse-moi… (pour aborder quelqu’un)' },
						{ id: 'es-luenh', oc: 'Es luènh ? · Es prèp.', sound: 'és LUÈN · és PRÈP', fr: 'c’est loin ? · c’est près.' },
						{ id: 'tot-drech', oc: 'tot drech', sound: 'tout DRÉTCH', fr: 'tout droit' },
						{ id: 'a-drecha', oc: 'a drecha', sound: 'a DRÉ-tcho', fr: 'à droite' },
						{ id: 'a-esquerra', oc: 'a esquèrra', sound: 'a es-KÈ-rro', fr: 'à gauche' }
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
					title: 'À retenir : quatre lieux de la ville',
					intro: 'Tous féminins : *la*. Tu les retrouves sur le plan, juste en dessous.',
					items: [
						{ id: 'la-gara', oc: 'la gara', sound: 'la GA-ro', fr: 'la gare' },
						{ id: 'la-carriera', oc: 'la carrièra', sound: 'la ca-RRYÈ-ro', fr: 'la rue' },
						{ id: 'la-placa', oc: 'la plaça', sound: 'la PLA-ço', fr: 'la place' },
						{ id: 'la-gleisa', oc: 'la glèisa', sound: 'la GLÈÏ-zo', fr: 'l’église' }
					]
				},
				// jeu prévu par la carte : « Ont es ? » sur un plan de ville (à coder :
				// un plan dessiné où l'on touche le lieu). Version simple : le plan en
				// tableau, puis un qcm : on lit l'indication d'un passant, on trouve le lieu.
				{
					type: 'table',
					title: 'Le plan : de la gare à la place',
					fiches: false, // un plan reste un plan, même sur téléphone
					intro:
						'Tu sors de la gare : la grande *carrièra* monte tout droit jusqu’à la place. Lis le plan de bas en haut : tu es en bas, à la gare.',
					head: ['', '*a esquèrra*', '*tot drech*', '*a drecha*'],
					rows: [
						['au bout, *luènh*', '', '*la plaça*, avec *la glèisa*', ''],
						['*luènh*', '*lo mercat*', '↑', '*l’escòla* (l’école)'],
						['*prèp*', '*la botiga* (la boutique)', '↑', '*l’espital* (l’hôpital)'],
						['tu es ici', '', '*la gara*', '']
					],
					glosa: { 'l’escòla': 'l’école', 'la botiga': 'la boutique', 'l’espital': 'l’hôpital' }
				},
				{
					type: 'qcm',
					title: 'Ont es ? (où est-ce ?)',
					intro:
						'Tu es à la gare, le plan sous les yeux. Des passants t’indiquent le chemin : trouve de quel lieu ils parlent, ou ce qu’ils vont te répondre.',
					items: [
						{
							q: 'Sur le plan, la grande rue qui monte de la gare jusqu’à la place, c’est…',
							options: ['*la carrièra*', '*la plaça*', '*la glèisa*'],
							correct: 0,
							choses: ['la-carriera'],
							explain: '*la carrièra* : la rue. Au bout, *la plaça* (la place), avec *la glèisa* (l’église).'
						},
						{
							ditz: { qui: 'une passante', oc: 'A drecha. Es prèp.' },
							q: 'D’après le plan, elle t’indique…',
							options: ['*l’espital*', '*l’escòla*', '*la botiga*'],
							correct: 0,
							choses: ['a-drecha', 'es-luenh'],
							explain: 'À droite et *prèp* : l’hôpital, à la première rue. L’école est à droite aussi, mais *luènh*.'
						},
						{
							ditz: { qui: 'un passant', oc: 'A esquèrra. Es luènh.' },
							q: 'D’après le plan, il t’indique…',
							options: ['*lo mercat*', '*la botiga*', '*l’escòla*'],
							correct: 0,
							choses: ['a-esquerra', 'es-luenh'],
							explain: 'À gauche et *luènh* : le marché. La boutique est à gauche aussi, mais *prèp*.'
						},
						{
							ditz: { qui: 'un enfant', oc: 'Tot drech ! Es luènh…' },
							q: 'D’après le plan, il t’indique…',
							options: ['*la plaça*', '*la botiga*', '*l’espital*'],
							correct: 0,
							choses: ['tot-drech', 'la-placa'],
							explain: '*Tot drech*, au bout de la grande rue : la place, avec l’église.'
						},
						{
							q: 'Tu demandes : *Perdon… Ont es la glèisa ?* D’après le plan, on te répond…',
							options: ['Tot drech, sus la plaça.', 'A drecha. Es prèp.', 'A esquèrra. Es luènh.'],
							correct: 0,
							oc: true,
							choses: ['la-gleisa', 'tot-drech'],
							explain: 'L’église est au bout de la grande rue, *sus la plaça* : sur la place.'
						},
						{
							q: 'Te voilà sur la place, devant l’église. Une dame te demande : *Perdon… Ont es la gara ?* Tu réponds…',
							options: ['Tot drech : es un pauc luènh.', 'A drecha : es prèp.', 'Es aquí, darrièr vos.'],
							correct: 0,
							oc: true,
							choses: ['la-gara', 'tot-drech', 'es-luenh'],
							explain: 'De la place, la gare est au bout de la grande rue, dans l’autre sens : *tot drech*, et un peu loin.'
						},
						{
							q: 'Un ami te demande : *L’escòla ?* Tu regardes le plan, et tu réponds…',
							options: ['A drecha, mas es luènh.', 'A drecha, e es prèp.', 'A esquèrra, mas es luènh.'],
							correct: 0,
							oc: true,
							choses: ['a-drecha', 'es-luenh'],
							explain: 'L’école : à droite, à la deuxième rue, donc *luènh*. À droite et *prèp*, c’est l’hôpital.'
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
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Aborde une passante, et demande-lui où est la gare.',
							answers: ['Perdon… Ont es la gara ?', 'Perdon… Ont es la gara, se vos plai ?', 'Perdon, bonjorn ! Ont es la gara ?', 'Perdon, bonjorn ! Ont es la gara, se vos plai ?'],
							choses: ['perdon', 'la-gara'],
							explain: '*Perdon…* pour l’aborder, puis *Ont es la gara ?* Avec *se vos plai*, c’est encore plus poli.'
						},
						{
							consigne: 'Demande si c’est loin.',
							answers: ['Es luènh ?'],
							choses: ['es-luenh'],
							explain: '*Es luènh ?* : c’est loin ?'
						},
						{
							consigne: 'Un ami cherche l’hôpital (regarde le plan). Réponds-lui : à droite, c’est près.',
							answers: ['A drecha, es prèp.', 'Es a drecha, es prèp.', 'L’espital es a drecha, es prèp.', 'A drecha. Es prèp.'],
							choses: ['a-drecha', 'es-luenh'],
							explain: '*a drecha* : à droite ; *Es prèp* : c’est près.'
						},
						{
							consigne: 'Un passant cherche la boutique. Réponds-lui : à gauche, c’est près.',
							answers: ['A esquèrra, es prèp.', 'Es a esquèrra, es prèp.', 'La botiga es a esquèrra, es prèp.'],
							choses: ['a-esquerra', 'es-luenh'],
							explain: '*a esquèrra* : à gauche. L’accent sur *è* montre où la voix appuie : « es-KÈ-rro ».'
						},
						{
							consigne: 'Une passante cherche la place. Réponds-lui : tout droit, ce n’est pas loin.',
							answers: ['Tot drech, es pas luènh.', 'Es tot drech, es pas luènh.', 'Tot drech. Es pas luènh.'],
							choses: ['tot-drech', 'es-luenh'],
							explain: '*Es pas luènh* : ce n’est pas loin. *Pas* après le verbe, comme toujours.'
						},
						{
							consigne: 'Dis : l’église est sur la place.',
							answers: ['La glèisa es sus la plaça.'],
							choses: ['la-gleisa', 'la-placa', 'sus-sul'],
							explain: '*sus* : sur. *La glèisa*, *la plaça* : deux mots féminins.'
						},
						{
							consigne: 'Et chez toi ? Dis si la gare est loin ou près. (S’il n’y en a pas, dis-le : *I a pas de…*)',
							answers: ['Es luènh.', 'Es prèp.', 'Es pas luènh.', 'La gara es luènh.', 'La gara es prèp.', 'La gara es pas luènh.', 'I a pas de gara.'],
							debut: ['La gara es', 'Es', 'I a pas de gara'],
							choses: ['la-gara', 'es-luenh'],
							explain: 'Par exemple : *La gara es prèp.* · *I a pas de gara !*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Pardon… Où est la rue de l’église ?',
							tiles: ['Perdon…', 'Ont', 'es', 'la carrièra', 'de', 'la glèisa ?'],
							choses: ['perdon', 'la-carriera', 'la-gleisa'],
							explain: '*Perdon…* d’abord, pour aborder ; puis la question.'
						},
						{
							prompt: 'La gare ? Tout droit, puis à gauche. C’est près.',
							tiles: ['La gara ?', 'Tot drech,', 'puèi', 'a esquèrra.', 'Es prèp.'],
							choses: ['la-gara', 'tot-drech', 'a-esquerra', 'es-luenh'],
							explain: '*puèi* : puis. Le chemin se dit dans l’ordre où on le fait.'
						},
						{
							prompt: 'L’église ? Tout droit, sur la place. C’est un peu loin.',
							tiles: ['La glèisa ?', 'Tot drech,', 'sus la plaça.', 'Es', 'un pauc', 'luènh.'],
							choses: ['la-gleisa', 'tot-drech', 'la-placa', 'es-luenh'],
							explain: '*Es un pauc luènh* : c’est un peu loin.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : guide quelqu’un',
					intro:
						'Pense à une personne que tu connais, qui arrive dans ta ville ou ton village. Où est la place, ou l’église ? Explique-le-lui à voix haute, puis compare au modèle.',
					items: [
						{
							q: 'Ta voisine, un cousin, une collègue…',
							a: 'Par exemple : *La plaça ? Es pas luènh : tot drech, puèi a drecha. La glèisa es sus la plaça.*'
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
					title: 'Le son du jour : ch sonne « tch »',
					glosa: { ch: 'se dit « tch »' },
					paragraphs: [
						'En occitan, *ch* sonne toujours « tch » : *a drecha* « a DRÉ-tcho », *tot drech* « tout DRÉTCH ».',
						'Tu l’as déjà dit sans y penser : *uèch* (huit) « UÈTCH », *lo lach* (le lait) « lou LATCH », *Vau al lièch* (je vais au lit) « LYÈTCH ».',
						'Jamais le « ch » de « chat » : *drecha* ne se dit pas « DRÉ-cho ».'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*a drecha* se dit…',
							options: ['a DRÉ-tcho', 'a DRÉ-cho'],
							correct: 0,
							noShuffle: true,
							explain: '« a DRÉ-cho », c’est la lecture à la française. En occitan, *ch* sonne « tch ».'
						},
						{
							q: '*uèch* (huit) se dit…',
							options: ['UÈTCH', 'UÈCH'],
							correct: 0,
							noShuffle: true,
							explain: 'Le même « tch » que dans *drecha* : « UÈTCH ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Perdon… La plaça ? Tot drech, puèi a drecha.*',
							a: '« pér-DOU… la PLA-ço ? tout DRÉTCH, PUÈÏ a DRÉ-tcho » : deux fois « tch ».'
						},
						{
							q: '*Uèch, drech, lach, lièch.*',
							a: '« UÈTCH, DRÉTCH, LATCH, LYÈTCH » : quatre mots, un seul son.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : la ville parle aussi occitan',
					lien: { href: 'https://metropole.toulouse.fr/sortir/culture-et-loisirs/culture-occitane', texte: 'La culture occitane à Toulouse (Toulouse Métropole)' },
					paragraphs: [
						'À Toulouse, le métro annonce les stations en français, puis en occitan. Et plusieurs rues du centre portent des noms de métiers venus de l’occitan : la rue Peyrolières, c’est la rue des chaudronniers.',
						'Dans une enquête de 2020 de l’Office public de la langue occitane (OPLO), 70 % des personnes interrogées sont favorables à l’occitan dans les lieux publics : sur les panneaux, et dans les annonces des transports.',
						'Sources : OPLO, enquête de 2020 (synthèse) ; Toulouse Métropole, page « Culture occitane ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'aborder quelqu’un poliment : *Perdon…*',
						'demander où est la gare, l’église ou la place',
						'comprendre et dire : à droite, à gauche, tout droit',
						'demander si c’est loin, et répondre',
						'dire *ch* « tch », comme dans *drecha*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander ton chemin, et comprendre la réponse.',
						'Si tu en as envie : demande *Perdon… Ont es la glèisa ?* à une personne qui parle occitan, ou joue la scène avec un ami, dans ta ville. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
