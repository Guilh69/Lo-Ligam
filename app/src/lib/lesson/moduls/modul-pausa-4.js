// Halte 4 · A1 · « Pausa 4 » : réemploi des unités 7 et 8 dans une situation
// nouvelle, un visiteur à accompagner dans la ville (carte de l'A1 §5 ;
// cursus/lexic-A1.md, Halte 4), puis le bilan de tout l'A1. Rédigée par
// Claude le 2026-11-02. Aucun mot nouveau : seulement l'« À retenir » des
// modules 0 à 8.4 (les `choses` portent leurs id).
// Chemin d'une halte (comme les haltes 1 à 3) : Révision du jour · Escota ·
// Lo jòc del jorn (l'itinéraire à remettre dans l'ordre, puis dialogue à choix
// avec le tour « rester en occitan », règle 13) · A tu ! · Lo bilanç (une
// question par unité de l'A1, ce que je sais faire, puis le carnet).
// Personnages cohérents avec les unités 1 à 7 : Lisa, ingénieure à
// Montpellier (6.2), et Núria, étudiante à Toulouse, qui travaille le samedi
// et cuisine le samedi soir avec Lisa (4.3, 4.4) ; Jordi, 17 ans, le frère de
// Núria (3.4). Écrite en même temps que les unités 7 et 8 : à harmoniser si
// elles disent autre chose.
// ⚠️ Occitan à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modulPausa4 = {
	id: 'modul-pausa-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: 'pausa-4',
	unitat: 'Pausa 4',
	nivel: 'A1 · Pausa 4 · unitats 7 e 8',
	oc: 'Pausa 4',
	fr: 'Halte 4 : réemploi des unités 7 et 8, puis bilan',
	cando:
		'Je peux accueillir quelqu’un en ville : lui indiquer le chemin, commander au café, lui montrer la maison, dire où sont les choses et de quelle couleur.',
	durada: '~40 min · 5 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Lisa', 'Núria', 'Jordi', 'Mimí', 'Inès'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Lisa dort sur le canapé rouge de Núria (*Ta cambra… es lo canapè roge, dins la sala !*) : la plaisanterie te va ?',
		'Jordi, le frère de Núria (3.4), parle catalan et un peu occitan ; il dort une nuit chez l’apprenant ou l’apprenante. D’accord ?',
		'Pour appeler le serveur : *Se vos plai !* D’accord ?',
		'*Un cafè sus la plaça, prèp de la gara* (près de la gare) : *prèp de* te va ?',
		'*Mercés per tot !* (merci pour tout) : d’accord ?',
		'*Benvengut !* tout seul, pour accueillir un garçon (*Benvenguda !* pour une fille) : d’accord ?',
		'Tes choix du 2026-11-02 (grammaire de référence), repris ici : *la dosena carrièra*, *un suc de frucha*, *fa caud* « CAOUT ». À relire.'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'De mémoire',
					intro: 'Avant la ville, trois questions sur les unités 7 et 8. Une à la fois.',
					items: [
						{
							q: 'Mimí, la chatte d’Inès, dort sous la table. Elle est…',
							options: ['jos la taula', 'sus la taula', 'davant la taula'],
							correct: 0,
							oc: true,
							choses: ['jos', 'la-taula'],
							explain: '*Jos* : sous. *Sus*, c’est sur ; *davant*, devant.'
						},
						{
							q: 'La porte est rouge. Tu complètes : *La pòrta es…*',
							options: ['roja', 'roge', 'blava'],
							correct: 0,
							oc: true,
							choses: ['roge-roja', 'la-porta'],
							explain: '*La pòrta*, au féminin : *roja*. *Roge*, c’est au masculin (*lo canapè roge*) ; *blava*, bleue.'
						},
						{
							q: 'Au café, tu commandes un thé pour toi. Tu dis…',
							options: ['Per ieu, un tè.', 'Per tu, un tè.', 'Per ela, un tè.'],
							correct: 0,
							oc: true,
							choses: ['per-ieu', 'un-te'],
							explain: '*Per ieu* : pour moi. *Per tu*, c’est pour toi ; *per ela*, pour elle.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'De mémoire (écris)',
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Dans la rue, aborde quelqu’un poliment, et demande-lui où est la gare.',
							answers: ['Perdon… Ont es la gara ?'],
							choses: ['perdon', 'la-gara'],
							explain: '*Perdon…* pour aborder quelqu’un, puis *Ont es…?* : où est… ?'
						},
						{
							consigne: 'Indique le chemin : tourne à gauche, puis tout droit.',
							answers: ['Vira a esquèrra, puèi tot drech.'],
							choses: ['vira', 'a-esquerra', 'tot-drech'],
							explain: '*Vira* : tourne. *A esquèrra* : à gauche ; *tot drech* : tout droit.'
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
					title: 'Lisa à Toulouse',
					intro:
						'Un samedi, Lisa vient de Montpellier passer la soirée chez Núria, à Toulouse. Núria a fini sa journée de travail : elle l’attend à la gare. Lis une première fois pour répondre à une seule question : où Lisa va-t-elle dormir ?',
					scenes: [
						{
							title: 'A la gara',
							subtitle: '(samedi, six heures du soir ; elles se tutoient)',
							lines: [
								{ oc: 'Adieu, Lisa ! Cossí vas ?', sound: 'a-DIOU, LI-za ! cou-si BAS ?', fr: 'Salut, Lisa ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! Mas ai set, e fa caud…', sound: 'baou PLA, mér-SÉS ! mas aï SÉT, é fa CAOUT…', fr: 'Je vais bien, merci ! Mais j’ai soif, et il fait chaud…' },
								{
									oc: 'Un cafè ? I a un cafè sus la plaça, prèp de la gara.',
									sound: 'un ca-FÈ ? YA un ca-FÈ sus la PLA-ço, PRÈP dé la GA-ro.',
									fr: 'Un café ? Il y a un café sur la place, près de la gare.'
								},
								{ oc: 'Es luènh ?', sound: 'és LUÈN ?', fr: 'C’est loin ?' },
								{ oc: 'Non ! Tot drech, puèi a drecha.', sound: 'NOU ! tout DRÉTCH, PUÈÏ a DRÉ-tcho.', fr: 'Non ! Tout droit, puis à droite.' }
							]
						},
						{
							title: 'Al cafè',
							subtitle: '(sur la place ; Núria appelle le serveur, qu’elle vouvoie)',
							lines: [
								{ oc: 'Qué prenes, Lisa ?', sound: 'ké PRÉ-nés, LI-za ?', fr: 'Qu’est-ce que tu prends, Lisa ?' },
								{ oc: 'Un veire d’aiga… e un suc de frucha !', sound: 'un BÉÏ-ré DAÏ-go… é un SUC dé FRU-tcho !', fr: 'Un verre d’eau… et un jus de fruit !' },
								{
									oc: 'Se vos plai ! Per ieu, un tè ; per ela, un veire d’aiga e un suc de frucha.',
									sound: 'sé bous PLAÏ ! pér YÉOU, un TÈ ; pér É-lo, un BÉÏ-ré DAÏ-go é un SUC dé FRU-tcho.',
									fr: 'S’il vous plaît ! Pour moi, un thé ; pour elle, un verre d’eau et un jus de fruit.'
								},
								{ oc: 'E ton ostal, es luènh ?', sound: 'é toun ous-TAL, és LUÈN ?', fr: 'Et ta maison, c’est loin ?' },
								{
									oc: 'Non, es prèp : darrièr la glèisa. L’addicion, se vos plai !',
									sound: 'NOU, és PRÈP : da-RRYÈ la GLÈÏ-zo. la-di-SYOU, sé bous PLAÏ !',
									fr: 'Non, c’est près : derrière l’église. L’addition, s’il vous plaît !'
								}
							]
						},
						{
							title: 'A l’ostal',
							subtitle: '(chez Núria)',
							lines: [
								{ oc: 'Vaquí l’ostal ! Es pichon, mas m’agrada.', sound: 'ba-KI lous-TAL ! és pi-TCHOU, mas ma-GRA-do.', fr: 'Voilà la maison ! Elle est petite, mais je l’aime bien.' },
								{ oc: 'E ieu ? Ont es ma cambra ?', sound: 'é YÉOU ? oun ÉS ma CAM-bro ?', fr: 'Et moi ? Où est ma chambre ?' },
								{
									oc: 'Ta cambra… es lo canapè roge, dins la sala !',
									sound: 'ta CAM-bro… és lou ca-na-PÈ ROU-djé, dins la SA-lo !',
									fr: 'Ta chambre… c’est le canapé rouge, dans le séjour !'
								},
								{ oc: 'Lo canapè ? M’agrada !', sound: 'lou ca-na-PÈ ? ma-GRA-do !', fr: 'Le canapé ? Ça me plaît !' },
								{
									oc: 'E l’armari blau, al costat de la fenèstra, es per tu.',
									sound: 'é lar-MA-ri BLAOU, al cous-TAT dé la fé-NÈS-tro, és pér TU.',
									fr: 'Et l’armoire bleue, à côté de la fenêtre, est pour toi.'
								},
								{ oc: 'Mercés ! E ara ?', sound: 'mér-SÉS ! é A-ro ?', fr: 'Merci ! Et maintenant ?' },
								{ oc: 'Ara… cosinam !', sound: 'A-ro… cou-zi-NAN !', fr: 'Maintenant… on cuisine !' }
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
							q: 'Où Lisa va-t-elle dormir ?',
							options: ['sur le canapé rouge, dans le séjour', 'dans une chambre bleue', 'dans la cuisine'],
							correct: 0,
							choses: ['lo-canape', 'la-sala', 'roge-roja'],
							explain: 'Núria plaisante : *Ta cambra… es lo canapè roge, dins la sala !* Sa chambre, c’est le canapé rouge, dans le séjour. Et Lisa répond : *M’agrada !*'
						},
						{
							q: 'Au café, Lisa prend…',
							options: ['un verre d’eau et un jus de fruit', 'un thé', 'un café'],
							correct: 0,
							choses: ['un-veire-de', 'l-aiga', 'suc-de-fruta'],
							explain: '*Un veire d’aiga… e un suc de frucha !* Le thé, c’est pour Núria : *Per ieu, un tè.*'
						},
						{
							q: 'La maison de Núria est…',
							options: ['derrière l’église', 'devant l’église', 'loin, derrière la gare'],
							correct: 0,
							choses: ['darrier', 'la-gleisa', 'es-luenh'],
							explain: '*Es prèp : darrièr la glèisa* : c’est près, derrière l’église.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 10,
			blocks: [
				{
					// Jeu de 8.2 : l'itinéraire, mêlé aux lieux et aux couleurs de l'unité 7.
					type: 'order',
					title: 'L’itinéraire, dans l’ordre',
					intro: 'Pour aller chez toi depuis la gare. Touche les mots dans l’ordre. Un mauvais choix tremble, rien de grave.',
					items: [
						{
							prompt: 'De la gare : tout droit, puis tourne à gauche.',
							tiles: ['De', 'la gara :', 'tot drech,', 'puèi', 'vira', 'a esquèrra.'],
							choses: ['la-gara', 'tot-drech', 'vira', 'a-esquerra'],
							explain: 'D’abord *tot drech* (tout droit), *puèi* (ensuite) *vira a esquèrra* (tourne à gauche).'
						},
						{
							prompt: 'Prends la deuxième rue : la maison est à côté de l’église.',
							tiles: ['Pren', 'la dosena', 'carrièra :', 'l’ostal', 'es', 'al costat de', 'la glèisa.'],
							choses: ['pren', 'primier-segond', 'la-carriera', 'al-costat-de', 'la-gleisa'],
							explain: '*Pren la dosena carrièra* : prends la deuxième rue (*dosena* au féminin, comme *carrièra*).'
						},
						{
							prompt: 'La porte est verte, entre le café et l’église.',
							tiles: ['La pòrta', 'es', 'verda,', 'entre', 'lo cafè', 'e', 'la glèisa.'],
							choses: ['la-porta', 'verd-verda', 'entre'],
							explain: '*La pòrta*, au féminin : *verda*. Et *entre… e…* : entre… et…'
						}
					]
				},
				{
					type: 'causida',
					title: 'Jordi arrive',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Jordi te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Jordi',
					tours: [
						{
							situacion:
								'Un samedi, Núria travaille : c’est toi qui accueilles son frère Jordi, à la gare. Il a dix-sept ans, il parle catalan, et un peu occitan ; ce soir, il dort chez toi. Vous vous tutoyez.',
							ditz: 'Adieu ! Ieu, me dison Jordi.',
							options: [
								{ oc: 'Adieu, Jordi ! Benvengut !', bon: true },
								{ oc: 'Adieu, Jordi ! Benvenguda !', reaccion: 'Jordi rit : *benvenguda*, c’est pour une fille !' },
								{ oc: 'Adieu-siatz, Jordi !', reaccion: 'Jordi se retourne : tu parles à quelqu’un d’autre ? Entre jeunes, on se tutoie… et il vient d’arriver !' }
							],
							choses: ['adieu'],
							explain: '*Adieu* entre jeunes, et *Benvengut !* (bienvenue !) à un garçon ; à une fille, *Benvenguda !*'
						},
						{
							situacion: 'Le café que tu connais est sur la place : tout droit, puis à droite.',
							ditz: 'Ai set ! I a un cafè, prèp de la gara ?',
							options: [
								{ oc: 'Òc, sus la plaça : tot drech, puèi a drecha.', bon: true },
								{ oc: 'Òc, sus la plaça : tot drech, puèi a esquèrra.', reaccion: 'Jordi part à gauche… et revient : de ce côté, pas de place, pas de café.' },
								{ oc: 'Òc, jos la plaça : tot drech, puèi a drecha.', reaccion: 'Jordi rit : un café sous la place ? Dans une cave, alors ?' }
							],
							choses: ['sus-sul', 'la-placa', 'tot-drech', 'a-drecha'],
							explain: '*Sus la plaça* : sur la place. *Tot drech, puèi a drecha* : tout droit, puis à droite.'
						},
						{
							situacion: 'Au café, sur la place.',
							ditz: 'Ieu, vòli un suc de frucha. E tu, qué prenes ?',
							options: [
								{ oc: 'Preni un cafè.', bon: true },
								{ oc: 'Prenes un cafè.', reaccion: 'Jordi fronce les sourcils : c’est lui qui prend un café ? Il voulait un jus de fruit.' },
								{ oc: 'Pren un cafè.', reaccion: 'Jordi regarde autour de lui : qui prend un café ? Lui, il veut un jus de fruit.' }
							],
							choses: ['prene-singular', 'un-cafe'],
							explain: '*Preni* : je prends. *Prenes*, c’est tu prends ; *pren*, il prend.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Le serveur arrive. Il a entendu de l’occitan, mais il passe au français, vite : « Bonjour ! Alors, deux cafés, c’est ça ? »',
							options: [
								{ oc: 'Non : per ieu, un cafè ; per el, un suc de frucha, se vos plai.', bon: true },
								{ oc: 'Non compreni pas.', reaccion: 'Le serveur répète en français, plus fort… et la conversation passe au français. Tu avais pourtant compris : réponds-lui en occitan !' },
								{ oc: 'Òc, òc…', reaccion: 'Le serveur apporte deux cafés. Jordi fait la grimace : il voulait un jus de fruit.' }
							],
							choses: ['per-ieu', 'un-cafe', 'suc-de-fruta', 'se-vos-plai'],
							explain: 'Pour rester en occitan, réponds en occitan, tout simplement : le serveur te suit. *Per ieu… per el…* : pour moi… pour lui…'
						},
						{
							situacion: 'Ta maison est dans la deuxième rue à gauche, après le café.',
							ditz: 'E ton ostal, es luènh ?',
							options: [
								{ oc: 'Non, es prèp : la dosena carrièra a esquèrra.', bon: true },
								{ oc: 'Non, es prèp : la primièra carrièra a esquèrra.', reaccion: 'Jordi file dans la première rue à gauche… et tombe sur une impasse. C’était la deuxième !' },
								{ oc: 'Òc, es luènh : la dosena carrièra a esquèrra.', reaccion: 'Jordi soupire en regardant son gros sac : loin ? La deuxième rue, ce n’est pourtant pas loin.' }
							],
							choses: ['es-luenh', 'primier-segond', 'la-carriera', 'a-esquerra'],
							explain: '*Es prèp* : c’est près. *La dosena carrièra* : la deuxième rue.'
						},
						{
							situacion: 'Chez toi. La chambre de Jordi est à côté de la salle de bain.',
							ditz: 'Òsca ! E ma cambra, ont es ?',
							options: [
								{ oc: 'Es al costat de la sala de banh.', bon: true },
								{ oc: 'Es jos la taula.', reaccion: 'Jordi se penche sous la table, perplexe : il n’est pas un chat !' },
								{ oc: 'Es dins lo jardin.', reaccion: 'Jordi regarde par la fenêtre : dormir dans le jardin, sous les étoiles ? Il préférerait un lit.' }
							],
							choses: ['al-costat-de', 'la-sala-de-banh', 'la-cambra'],
							explain: '*Al costat de* : à côté de. *La sala de banh* : la salle de bain.'
						},
						{
							situacion: 'Dans sa chambre, il y a une armoire verte, vide : elle est pour lui.',
							ditz: 'L’armari verd es per ieu ?',
							options: [
								{ oc: 'Òc, es per tu !', bon: true },
								{ oc: 'Òc, es per ieu !', reaccion: 'Jordi, gêné, repose son sac par terre : l’armoire est à toi, alors ?' },
								{ oc: 'Non, es blau.', reaccion: 'Jordi regarde l’armoire, puis toi : elle est bien verte !' }
							],
							choses: ['l-armari', 'verd-verda', 'per-ieu'],
							explain: 'Il dit *per ieu* (pour moi) ; toi, tu réponds *per tu* (pour toi).'
						},
						{
							ditz: 'Mercés per tot !',
							options: [
								{ oc: 'De res ! Benvengut, Jordi !', bon: true },
								{ oc: 'Mercés ! Benvengut, Jordi !', reaccion: 'Jordi sourit : c’est lui qui te remercie, pas l’inverse !' },
								{ oc: 'De res ! Adieu-siatz, Jordi !', reaccion: 'Jordi rit : il ne s’en va pas, il dort ici ! Et vous vous tutoyez.' }
							],
							choses: ['de-res', 'adieu-siatz'],
							explain: 'On te dit merci (*Mercés per tot !* : merci pour tout) : *De res !* (de rien). Et *Benvengut !* pour finir l’accueil.'
						}
					],
					fin: 'Bravo ! Jordi a bu son jus de fruit et trouvé sa chambre, tout en occitan, même quand le serveur est passé au français. Núria peut finir sa journée tranquille.'
				}
			]
		},

		// ————————————————————————————————— 4. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 9,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Dis ce qu’il y a dans ta maison : au moins deux pièces.',
							debut: ['I a'],
							choses: ['i-a', 'la-cosina', 'la-cambra'],
							explain: 'Par exemple : *I a una cosina, una sala e una cambra.*'
						},
						{
							consigne: 'Dis : ma chambre est à côté de la salle de bain.',
							answers: ['Ma cambra es al costat de la sala de banh.'],
							choses: ['la-cambra', 'al-costat-de', 'la-sala-de-banh'],
							explain: '*Al costat de* : à côté de.'
						},
						{
							consigne: 'Dis : la porte est bleue, et la fenêtre est verte.',
							answers: ['La pòrta es blava, e la fenèstra es verda.'],
							choses: ['la-porta', 'blau-blava', 'la-fenestra', 'verd-verda'],
							explain: 'Deux mots féminins : *blava*, *verda*.'
						},
						{
							consigne: 'Dans la rue, aborde quelqu’un poliment : l’église, c’est loin ? Comment j’y vais ?',
							answers: ['Perdon… La glèisa, es luènh ? Cossí i vau ?', 'Perdon… Es luènh, la glèisa ? Cossí i vau ?'],
							choses: ['perdon', 'la-gleisa', 'es-luenh', 'cossi-i-vau'],
							explain: '*Perdon…* pour aborder ; *Es luènh ?* : c’est loin ? *Cossí i vau ?* : comment j’y vais ?'
						},
						{
							consigne: 'On te répond : prends la première rue à droite.',
							answers: ['Pren la primièra carrièra a drecha.'],
							choses: ['pren', 'primier-segond', 'la-carriera', 'a-drecha'],
							explain: '*Primièra* au féminin, comme *carrièra*.'
						},
						{
							consigne: 'Au café : pour toi, un verre d’eau. Puis demande l’addition.',
							answers: ['Per ieu, un veire d’aiga. L’addicion, se vos plai !'],
							choses: ['per-ieu', 'un-veire-de', 'l-aiga', 'l-addicion'],
							explain: '*Un veire d’aiga* : un verre d’eau (*d’* devant une voyelle). Puis *L’addicion, se vos plai !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Accueille quelqu’un',
					intro:
						'Un ami ou une amie arrive chez toi pour la première fois. Dis à voix haute, en cinq phrases : bienvenue, le chemin depuis la gare, ce qu’il y a dans la maison, où est sa chambre, ce que tu proposes à boire. Puis compare au modèle.',
					items: [
						{
							q: 'Ton accueil, en cinq phrases.',
							a: 'Par exemple : *Benvengut !* (à une amie : *Benvenguda !*) *L’ostal es prèp : tot drech, puèi la dosena carrièra a esquèrra. I a una cosina, una sala e una cambra per tu. Ta cambra es al costat de la sala de banh. Un cafè ? Un veire d’aiga ?*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. Lo bilanç
		{
			title: 'Lo bilanç',
			fr: 'le bilan',
			minutes: 8,
			blocks: [
				{
					type: 'reveal',
					title: 'Tout l’A1, une question par unité',
					intro: 'Avant le bilan, fais le tour de ton A1 : une question par unité. Réponds à voix haute, puis compare au modèle.',
					items: [
						{
							q: 'Unité 1 · Le soir, salue une dame âgée que tu vouvoies, et demande-lui comment elle va.',
							a: 'Par exemple : *Bon ser ! Cossí anatz ?*'
						},
						{
							q: 'Unité 2 · Dis quelles langues tu parles, et que tu comprends bien.',
							a: 'Par exemple : *Parli francés, e un pauc occitan. Compreni plan !*'
						},
						{
							q: 'Unité 3 · Présente quelqu’un de ta famille, avec son âge.',
							a: 'Par exemple : *Es ma sòrre. A dotze ans.*'
						},
						{
							q: 'Unité 4 · Dis ton métier, et ce que tu fais le dimanche.',
							a: 'Par exemple : *Soi infirmièr. Lo dimenge, cosini amb mon paire.*'
						},
						{
							q: 'Unité 5 · Au marché, demande poliment un kilo de tomates, et leur prix.',
							a: 'Par exemple : *Volriái un quilò de tomatas, se vos plai. Quant còstan ?*'
						},
						{
							q: 'Unité 6 · Dis l’heure (15 h 30), et le temps qu’il fait.',
							a: 'Par exemple : *Son tres oras e mièja. Plòu, e fa freg.*'
						},
						{
							q: 'Unité 7 · Décris ta chambre : où est le lit, de quelle couleur est la porte.',
							a: 'Par exemple : *Lo lièch es al costat de la fenèstra. La pòrta es blanca.*'
						},
						{
							q: 'Unité 8 · Au café, commande pour toi et pour ton amie, puis demande l’addition.',
							a: 'Par exemple : *Per ieu, un cafè ; per ela, un tè. L’addicion, se vos plai !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais déjà faire.',
					items: [
						'montrer une maison, et dire où sont les choses',
						'dire de quelle couleur, de quelle taille sont les choses',
						'demander et indiquer le chemin',
						'commander au café, et demander l’addition',
						'rester en occitan quand quelqu’un passe au français'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de la halte 4',
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant accueillir quelqu’un : lui montrer le chemin, l’inviter au café, lui faire visiter la maison. Tu as fait le tour de l’A1. La suite : la mission A1.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Tout ton carnet de l’A1',
					paragraphs: [
						'Ton carnet de révision garde toutes les choses de l’A1, des saluts de l’unité 1 au café de l’unité 8. Il marche sans compte : il reste dans ton navigateur.',
						'Avant la mission, passe-le en revue : les cartes qui te résistent encore, c’est le moment de les revoir.'
					],
					lien: { href: '/aprene/carnet', texte: 'Ouvrir mon carnet de révision' }
				}
			]
		}
	]
};
