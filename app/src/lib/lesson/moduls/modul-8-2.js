// Module 8.2 · A1 · « Cossí i vau ? » : unité 8 (En vila), rédigé par Claude
// le 2026-11-02 sur le modèle des unités 1 et 4 (même chemin en six étapes ;
// règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : anar au singulier (vau, vas, va, déjà entendus dans Vau plan
// et Cossí vas ?), i (y), et deux ordres en bloc : Vira… (tourne), Pren… (prends).
// Pas de pluriel d'anar, sauf anatz (connu depuis 1.1).
// Scène : Lisa arrive à la gare de Toulouse et appelle Núria ; puis Karim
// appelle Yasmine. Le plan est celui de 8.1.
// Jeu du jour : remettre l'itinéraire dans l'ordre (order), plan sous les yeux.
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique ; bastida, bastir le
// 2026-11-02), à valider par Romain. Dosen, dosena (deuxième) : grammaire de
// référence p52, choix de Romain du 2026-11-02 ; absents du Basic, dicodòc (Laus) ✓.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul82 = {
	id: 'modul-8-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '8-2',
	unitat: 'Unitat 8 · En vila',
	nivel: 'A1 · Modul 8.2',
	oc: 'Cossí i vau ?',
	fr: 'Comment j’y vais ? Expliquer un chemin simple',
	cando:
		'Je peux demander comment aller quelque part, dire où je vais, et expliquer un chemin simple : tourne à droite, prends la deuxième rue, on y va à pied.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Lisa', 'Núria', 'Yasmine', 'Karim'],
	notesRelecture: [
		'*Pren la dosena carrièra a esquèrra* (prends la deuxième rue à gauche), puis *la dosena a esquèrra* sans redire *carrièra* : naturel pour toi ?',
		'*I anatz a pè* (vous y allez à pied), dit Karim à Yasmine et à ses amies : naturel ?',
		'*lo cafè* paraît ici avec une glose, un module avant d’être appris (8.3) : d’accord ?',
		'*A miègjorn !* (à midi !) pour se quitter quand on se revoit à midi : naturel ?',
		'Son du jour : *vira* « BI-ro », *esquèrra* « es-KÈ-rro », *dosena* « dou-ZÉ-no ». C’est bien ton usage ?',
		'Ton choix du 2026-11-02 (grammaire de référence, p52) : *dosen*, *dosena* pour « deuxième », à la place de *segond*, *segonda*, gardés dans l’encadré pour « le second », quand il n’y en a que deux. Sons « dou-ZÉN », « dou-ZÉ-no » (le *n* de *dosen* se dit, comme dans *seten*, p11). À relire.'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 8.1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'À droite :',
							options: ['a drecha', 'a esquèrra', 'tot drech'],
							correct: 0,
							oc: true,
							choses: ['a-drecha'],
							explain: '*a drecha* : à droite, « a DRÉ-tcho ». *A esquèrra* : à gauche ; *tot drech* : tout droit.'
						},
						{
							q: '*Es luènh ?*',
							options: ['C’est loin ?', 'C’est près ?', 'C’est à gauche ?'],
							correct: 0,
							choses: ['es-luenh'],
							explain: '*luènh* : loin ; *prèp* : près.'
						},
						{
							q: '*I a una glèisa sus la plaça.*',
							options: ['Il y a une église sur la place.', 'Il y a une gare sur la place.', 'Il y a une église dans la rue.'],
							correct: 0,
							choses: ['i-a', 'la-gleisa', 'la-placa'],
							explain: '*I a* : il y a. *La glèisa* : l’église ; *la plaça* : la place ; *la carrièra*, ce serait la rue.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Aborde un passant, et demande-lui où est la place.',
							answers: ['Perdon… Ont es la plaça ?', 'Perdon… Ont es la plaça, se vos plai ?', 'Perdon, bonjorn ! Ont es la plaça ?', 'Perdon, bonjorn ! Ont es la plaça, se vos plai ?'],
							choses: ['perdon', 'la-placa'],
							explain: '*Perdon…* pour l’aborder, puis *Ont es…?*'
						},
						{
							consigne: 'C’est tout droit, mais c’est loin.',
							answers: ['Es tot drech, mas es luènh.', 'Tot drech, mas es luènh.'],
							choses: ['tot-drech', 'es-luenh'],
							explain: '*mas* : mais. *Es luènh* : c’est loin.'
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
					title: 'Au téléphone',
					intro:
						'Lisa arrive de Montpellier, par le train. À la gare de Toulouse, elle appelle Núria, qui est au marché avec Yasmine. Un peu plus tard, Karim appelle Yasmine. Lis une première fois pour répondre à une seule question : comment Lisa va-t-elle au marché ?',
					scenes: [
						{
							title: 'Lisa e Núria',
							subtitle: '(au téléphone ; elles se tutoient)',
							lines: [
								{ oc: 'Adieu, Núria ! Soi a la gara. E tu, ont siás ?', sound: 'a-DIOU, NOU-ria ! souï a la GA-ro. é TU, oun SYOS ?', fr: 'Salut, Núria ! Je suis à la gare. Et toi, où es-tu ?' },
								{ oc: 'Al mercat, amb Yasmine. Benvenguda a Tolosa !', sound: 'al mér-CAT, am yas-MI-ne. bém-bén-GU-do a tou-LOU-zo !', fr: 'Au marché, avec Yasmine. Bienvenue à Toulouse !' },
								{ oc: 'Mercés ! Lo mercat… Cossí i vau ?', sound: 'mér-SÉS ! lou mér-CAT… cou-si i BAOU ?', fr: 'Merci ! Le marché… Comment j’y vais ?' },
								{ oc: 'Non es pas luènh : i vas a pè. Tot drech, e pren la dosena carrièra a esquèrra.', sound: 'nou és pas LUÈN : i BAS a PÈ. tout DRÉTCH, é PRÉ(N) la dou-ZÉ-no ca-RRYÈ-ro a es-KÈ-rro.', fr: 'Ce n’est pas loin : tu y vas à pied. Tout droit, et prends la deuxième rue à gauche.' },
								{ oc: 'La primièra a esquèrra ?', sound: 'la pri-MYÈ-ro a es-KÈ-rro ?', fr: 'La première à gauche ?' },
								{ oc: 'Non, la dosena ! A la primièra, i a una botiga.', sound: 'NOU, la dou-ZÉ-no ! a la pri-MYÈ-ro, YA U-no bou-TI-go.', fr: 'Non, la deuxième ! À la première, il y a une boutique.' },
								{ oc: 'Òc : la dosena a esquèrra. A lèu !', sound: 'OK : la dou-ZÉ-no a es-KÈ-rro. a LÈOU !', fr: 'Oui : la deuxième à gauche. À bientôt !' }
							]
						},
						{
							title: 'Karim e Yasmine',
							subtitle: '(un peu plus tard, Karim appelle Yasmine ; ils se tutoient)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Ont siás ?', sound: 'a-DIOU, yas-MI-ne ! oun SYOS ?', fr: 'Salut, Yasmine ! Où es-tu ?' },
								{ oc: 'Al mercat, amb Lisa e Núria. E tu, ont vas ?', sound: 'al mér-CAT, am LI-zo é NOU-ria. é TU, oun BAS ?', fr: 'Au marché, avec Lisa et Núria. Et toi, où vas-tu ?' },
								{ oc: 'Vau a la plaça. A miègjorn, manjam al cafè ?', sound: 'BAOU a la PLA-ço. a myèd-DJOUR, man-DJAN al ca-FÈ ?', fr: 'Je vais sur la place. À midi, on mange au café ?' },
								{ oc: 'Òc ! Mas cossí i vau ?', sound: 'OK ! mas cou-si i BAOU ?', fr: 'Oui ! Mais comment j’y vais ?' },
								{ oc: 'Es prèp : tot drech, puèi vira a esquèrra.', sound: 'és PRÈP : tout DRÉTCH, PUÈÏ BI-ro a es-KÈ-rro.', fr: 'C’est près : tout droit, puis tourne à gauche.' },
								{ oc: 'E Lisa e Núria ?', sound: 'é LI-zo é NOU-ria ?', fr: 'Et Lisa et Núria ?' },
								{ oc: 'Elas tanben ! I anatz a pè : non es pas luènh.', sound: 'É-los tam-BÉ ! i a-NATS a PÈ : nou és pas LUÈN.', fr: 'Elles aussi ! Vous y allez à pied : ce n’est pas loin.' },
								{ oc: 'A miègjorn, Karim !', sound: 'a myèd-DJOUR, ka-RIM !', fr: 'À midi, Karim !' }
							]
						}
					],
					glossary: [
						{ oc: 'una botiga', sound: 'U-no bou-TI-go', fr: 'une boutique' },
						{ oc: 'al cafè', sound: 'al ca-FÈ', fr: 'au café (le lieu ; le mot s’apprend au module suivant)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Comment Lisa va-t-elle au marché ?',
							options: ['à pied : ce n’est pas loin', 'en bus : c’est loin', 'avec Karim, en voiture'],
							correct: 0,
							choses: ['a-pe', 'cossi-i-vau'],
							explain: '*I vas a pè* : tu y vas à pied. *Non es pas luènh* : ce n’est pas loin.'
						},
						{
							q: 'Pour aller au marché, Lisa prend…',
							options: ['la deuxième rue à gauche', 'la première rue à gauche', 'la deuxième rue à droite'],
							correct: 0,
							choses: ['pren', 'primier-segond'],
							explain: '*Pren la dosena carrièra a esquèrra.* Lisa hésite, *La primièra ?*, et Núria insiste : *la dosena !*'
						},
						{
							q: 'Karim va sur la place. Il propose à Yasmine…',
							options: ['de manger au café, à midi', 'de venir le chercher à l’hôpital', 'de reprendre le train'],
							correct: 0,
							choses: ['anar-singular'],
							explain: '*Vau a la plaça. A miègjorn, manjam al cafè ?* : je vais sur la place. À midi, on mange au café ?'
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
					title: 'Le verbe aller, et un petit i',
					intro: 'Tu connais déjà ce verbe sans le savoir. Regarde qui va où.',
					items: [
						{
							q: '*Vau a la plaça*, dit Karim. Qui va sur la place ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['anar-singular'],
							explain: '*vau* : je vais. Comme dans *Vau plan* : je vais bien.'
						},
						{
							q: '*E tu, ont vas ?* demande Yasmine. *Vas*, c’est…',
							options: ['tu vas', 'je vais', 'il ou elle va'],
							correct: 0,
							choses: ['anar-singular'],
							explain: '*vas* : tu vas, comme dans *Cossí vas ?* (comment vas-tu ?).'
						},
						{
							q: '*Cossí i vau ?* Le petit mot *i* veut dire…',
							options: ['y', 'et', 'il'],
							correct: 0,
							choses: ['cossi-i-vau'],
							explain: '*i* : y. Tu le connais depuis *I a…* (il y a). « Et », c’est *e* ; « il », *el*.'
						},
						{
							q: '*Pren la dosena carrièra*, dit Núria à Lisa. Elle veut dire…',
							options: ['prends la deuxième rue', 'je prends la deuxième rue', 'la deuxième rue est loin'],
							correct: 0,
							choses: ['pren', 'primier-segond'],
							explain: '*Pren !* : prends ! Pour guider quelqu’un, on lui dit quoi faire.'
						},
						{
							q: '*Vira a esquèrra*, dit Karim. *Vira !*, c’est…',
							options: ['tourne !', 'prends !', 'tout droit !'],
							correct: 0,
							choses: ['vira'],
							explain: '*Vira !* : tourne ! *Pren !*, c’est « prends ! » ; *tot drech*, « tout droit ».'
						},
						{
							q: '*I anatz a pè*, dit Karim. Il veut dire…',
							options: ['vous y allez à pied', 'tu y vas à pied', 'il y va à pied'],
							correct: 0,
							choses: ['a-pe'],
							explain: '*anatz* : vous allez, comme dans *Cossí anatz ?* ; *a pè* : à pied.'
						}
					]
				},
				{
					type: 'table',
					title: 'Le verbe anar (aller), au singulier',
					intro: 'Il était caché dans tes toutes premières phrases :',
					head: ['', '*anar*', 'ça sonne comme', 'tu le connais déjà'],
					rows: [
						['je', '*vau*', '« BAOU »', '*Vau plan.* · *Vau al trabalh.*'],
						['tu', '*vas*', '« BAS »', '*Cossí vas ?*'],
						['il, elle', '*va*', '« BA »', '*Va plan.*']
					],
					notes: [
						'Le *v* sonne « b » : *vau* « BAOU », *vas* « BAS », *va* « BA ».',
						'Pour vous : *anatz*, comme dans *Cossí anatz ?* Le reste du pluriel viendra plus tard.',
						'*i* (y) se met devant le verbe : *I vau a pè* (j’y vais à pied) ; *Cossí i vas ?* (comment y vas-tu ?).'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'cossi-i-vau', oc: 'Cossí i vau ?', sound: 'cou-si i BAOU', fr: 'comment j’y vais ? (*i* : y)' },
						{ id: 'anar-singular', oc: 'anar : vau · vas · va', sound: 'a-NA : BAOU · BAS · BA', fr: 'aller : je vais · tu vas · il ou elle va (comme dans *Vau plan* et *Cossí vas ?*)' },
						{ id: 'a-pe', oc: 'a pè', sound: 'a PÈ', fr: 'à pied' }
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
					title: 'À retenir : pour guider quelqu’un',
					intro: 'Deux ordres tout faits, et de quoi compter les rues.',
					glosa: { segond: 'le second', segonda: 'la seconde' },
					items: [
						{ id: 'vira', oc: 'Vira a drecha ! · Vira a esquèrra !', sound: 'BI-ro a DRÉ-tcho · BI-ro a es-KÈ-rro', fr: 'tourne à droite ! · tourne à gauche !' },
						{ id: 'pren', oc: 'Pren la carrièra…', sound: 'PRÉ(N) la ca-RRYÈ-ro', fr: 'prends la rue…' },
						{ id: 'primier-segond', oc: 'lo primièr · la primièra · lo dosen · la dosena', sound: 'lou pri-MYÈ · la pri-MYÈ-ro · lou dou-ZÉN · la dou-ZÉ-no', fr: 'le premier · la première · le deuxième · la deuxième (*lo segond*, *la segonda* : le second, quand il n’y en a que deux)' }
					]
				},
				// jeu prévu par la carte : remettre l'itinéraire dans l'ordre sur le plan
				// (à coder : tracer le chemin du doigt sur un plan dessiné). Version
				// simple : le plan en tableau, puis `order` (l'itinéraire en tuiles).
				{
					type: 'table',
					title: 'Le plan, avec ses rues',
					fiches: false, // un plan reste un plan, même sur téléphone
					intro: 'Le même plan qu’au module 8.1. En partant de la gare : la première rue, puis la deuxième.',
					head: ['', '*a esquèrra*', '*tot drech*', '*a drecha*'],
					rows: [
						['au bout', '', '*la plaça* : *la glèisa*, *lo cafè*', ''],
						['*la dosena carrièra*', '*lo mercat*', '↑', '*l’escòla* (l’école)'],
						['*la primièra carrièra*', '*la botiga* (la boutique)', '↑', '*l’espital* (l’hôpital)'],
						['départ', '', '*la gara*', '']
					]
				},
				{
					type: 'order',
					title: 'L’itinéraire, dans l’ordre',
					intro: 'Regarde le plan, puis touche les tuiles dans l’ordre du chemin. Une mauvaise tuile tremble, rien de grave.',
					items: [
						{
							prompt: 'Tu es à la gare. Explique le chemin jusqu’à l’école.',
							tiles: ['Tot drech,', 'puèi', 'pren', 'la dosena carrièra', 'a drecha.'],
							choses: ['tot-drech', 'pren', 'primier-segond', 'a-drecha'],
							explain: 'L’école : la deuxième rue, à droite. *Pren* : prends.'
						},
						{
							prompt: 'Tu es à la gare. Explique le chemin jusqu’à la boutique.',
							tiles: ['Pren', 'la primièra carrièra', 'a esquèrra.', 'Es', 'prèp.'],
							choses: ['pren', 'primier-segond', 'a-esquerra'],
							explain: 'La boutique : la première rue à gauche, tout près de la gare.'
						},
						{
							prompt: 'Yasmine sort du marché, face à la grande rue. Explique-lui le chemin jusqu’à la place.',
							tiles: ['Tot drech,', 'puèi', 'vira', 'a esquèrra.'],
							choses: ['vira', 'tot-drech', 'a-esquerra'],
							explain: 'Le chemin de Karim : *tot drech, puèi vira a esquèrra*, et la grande rue monte jusqu’à la place.'
						},
						{
							prompt: 'Lisa demande comment aller au marché. Núria lui répond : à pied !',
							tiles: ['Cossí', 'i', 'vau ?', 'I', 'vas', 'a', 'pè.'],
							choses: ['cossi-i-vau', 'anar-singular', 'a-pe'],
							explain: '*Cossí i vau ?* : comment j’y vais ? *I vas a pè* : tu y vas à pied.'
						},
						{
							prompt: 'Karim sort de l’hôpital, face à la grande rue. Il dit où il va, et par où.',
							tiles: ['Vau', 'a la plaça :', 'tot drech,', 'puèi', 'vira', 'a drecha.'],
							choses: ['anar-singular', 'vira', 'a-drecha'],
							explain: '*Vau a la plaça* : je vais sur la place. En sortant de l’hôpital, la grande rue monte à droite, jusqu’à la place.'
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
							consigne: 'Tu veux aller au marché : demande comment y aller.',
							answers: ['Cossí i vau ?', 'Lo mercat ? Cossí i vau ?', 'Perdon… Cossí i vau ?'],
							choses: ['cossi-i-vau'],
							explain: '*Cossí i vau ?* : comment j’y vais ?'
						},
						{
							consigne: 'Dis à une amie : tourne à droite !',
							answers: ['Vira a drecha !'],
							choses: ['vira', 'a-drecha'],
							explain: '*Vira !* : tourne ! Puis la direction : *a drecha*.'
						},
						{
							consigne: 'Explique : prends la première rue à gauche.',
							answers: ['Pren la primièra carrièra a esquèrra.', 'Pren la primièra a esquèrra.'],
							choses: ['pren', 'primier-segond', 'a-esquerra'],
							explain: '*la carrièra* est féminin : *la primièra*.'
						},
						{
							consigne: 'Dis : je vais à la gare à pied.',
							answers: ['Vau a la gara a pè.', 'Ieu, vau a la gara a pè.', 'A pè, vau a la gara.'],
							choses: ['anar-singular', 'la-gara', 'a-pe'],
							explain: '*Vau* : je vais. *a pè* : à pied.'
						},
						{
							consigne: 'Et toi, aujourd’hui, où vas-tu ? Commence par *Vau…*',
							answers: ['Vau al trabalh.', 'Vau al mercat.', 'Vau a la gara.'],
							debut: ['Vau', 'Uèi, vau', 'Ieu, vau', 'Uèi, ieu, vau'],
							choses: ['anar-singular'],
							explain: 'Par exemple : *Vau al trabalh.* · *Uèi, vau al mercat a pè.*'
						},
						{
							consigne: 'Ta sœur va au marché : dis-le.',
							answers: ['Ma sòrre va al mercat.', 'Ma sòrre va al mercat a pè.'],
							choses: ['anar-singular', 'la-sorre'],
							explain: '*va* : il ou elle va. *a* + *lo* = *al* : *al mercat*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : le chemin d’une personne que tu connais',
					intro: 'Pense à une personne que tu connais : où va-t-elle le matin, et comment ? Dis-le, puis compare au modèle.',
					items: [
						{
							q: 'Ton frère, une voisine, ta collègue…',
							a: 'Par exemple : *Lo matin, mon fraire va al trabalh a pè. Es prèp : tot drech, puèi vira a drecha.*'
						},
						{
							q: 'Et toi : de chez toi jusqu’à la place, ou jusqu’à la gare ?',
							a: 'Par exemple : *Vau a la gara a pè. Tot drech, puèi pren la dosena carrièra a esquèrra. Non es pas luènh !*'
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
					title: 'Le son du jour : la syllabe forte, revue',
					paragraphs: [
						'Dans chaque mot, la voix appuie plus fort sur une syllabe : *vira* « BI-ro », *anar* « a-NA ».',
						'Un accent écrit montre où appuyer : *carrièra* « ca-RRYÈ-ro », *esquèrra* « es-KÈ-rro », *primièra* « pri-MYÈ-ro ».',
						'Sans accent écrit, un mot qui finit par *a* se dit appuyé juste avant : *dosena* « dou-ZÉ-no », *drecha* « DRÉ-tcho ».'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*vira* (tourne) se dit…',
							options: ['BI-ro', 'bi-RA'],
							correct: 0,
							noShuffle: true,
							explain: '« bi-RA », c’est la lecture à la française, appuyée à la fin. Le mot finit par *a* : la voix appuie juste avant, « BI-ro ».'
						},
						{
							q: '*esquèrra* (gauche) se dit…',
							options: ['es-KÈ-rro', 'es-kè-RRA'],
							correct: 0,
							noShuffle: true,
							explain: 'L’accent écrit sur le *è* montre où appuyer : « es-KÈ-rro ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase en appuyant au bon endroit, puis regarde.',
					items: [
						{
							q: '*Pren la primièra carrièra a esquèrra, puèi vira a drecha.*',
							a: '« PRÉ(N) la pri-MYÈ-ro ca-RRYÈ-ro a es-KÈ-rro, PUÈÏ BI-ro a DRÉ-tcho » : la voix appuie sur les accents écrits, et juste avant le *a* final.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : les bastides, des villes neuves',
					glosa: { bastida: 'bastide, ville neuve', bastir: 'construire' },
					lien: { href: 'https://fr.wikipedia.org/wiki/Bastide_(ville)', texte: 'Lire l’article « Bastide (ville) » sur Wikipédia' },
					paragraphs: [
						'Dans le Sud-Ouest, entre 1222 et 1373, on a fondé des centaines de villes neuves : les bastides, de l’occitan *bastida*, du verbe *bastir*, construire. On en compte entre trois cents et cinq cents, presque toutes dans quatorze départements d’aujourd’hui.',
						'Si tu te promènes dans l’une d’elles, *tot drech* et *la dosena a drecha* te serviront.',
						'Source : Wikipédia, article « Bastide (ville) ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander comment aller quelque part : *Cossí i vau ?*',
						'dire où je vais : *Vau a la gara*, *Vau al trabalh*',
						'expliquer un chemin : *Vira a drecha*, *Pren la dosena carrièra*',
						'dire qu’on y va à pied',
						'appuyer au bon endroit : *carrièra*, *esquèrra*, *vira*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander ton chemin, et l’expliquer à ton tour.',
						'Si tu en as envie : la prochaine fois qu’un ami t’invite, demande-lui *Cossí i vau ?*, et fais-toi expliquer le chemin en occitan. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
