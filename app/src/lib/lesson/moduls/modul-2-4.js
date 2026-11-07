// Module 2.4 · A1 · « Quina lenga parla ? » : unité 2 (Parlas occitan ?), la
// tâche, rédigée par Claude le 2026-11-01 sur le modèle de 1.4. Aucun mot
// nouveau. Chemin commun : 1 révision du jour · 2 Escota · 3 Obsèrva ·
// 4 Lo jòc del jorn · 5 A tu ! · 6 Lo son e lo bilanç, puis le mémo de
// l'unité et l'encart Alhors en Occitània (cursus/alhors-en-occitania-A1.md).
// Premier tour « rester en occitan » (règle 13 de la recherche) : le causida
// de l'étape 4, où Loís passe au français.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul24 = {
	id: 'modul-2-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '2-4',
	unitat: 'Unitat 2 · Parlas occitan ?',
	nivel: 'A1 · Modul 2.4 · la tâche',
	oc: 'Quina lenga parla ?',
	fr: 'Quelle langue parle-t-il, parle-t-elle ? Présenter les langues de quelqu’un',
	cando:
		'Je peux présenter les langues de quelqu’un en six phrases, à l’oral et à l’écrit, et garder la conversation en occitan quand l’autre passe au français.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Núria', 'Marià', 'Giulia', 'Loís', 'Lisa'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'L’intrus (étape 1) : quatre séries de quatre mots, faites avec les mots de l’unité. Chaque famille doit être nette et l’intrus plausible : dis si une série a deux réponses possibles.',
		'Titre du module : *Quina lenga parla ?* (quelle langue parle-t-il, parle-t-elle ?), proposé par le lexique à la place de *Tasca*. Il te va ?',
		'Tour où Loís passe au français (règle 13) : la bonne réplique est *Pòdes repetir en occitan, se te plai ?*, vue en 2.3. Elle te va ?',
		'Fiche « langues » en six phrases, à la troisième personne : *Es Núria. Es catalana : es de Barcelona, mas demòra a Tolosa. Parla catalan e espanhòl. Parla tanben un pauc occitan, e compren plan. Non parla pas anglés !* Tu valides l’enchaînement ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 7,
			blocks: [
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Il est espagnol :',
							options: ['Es espanhòl.', 'Es espanhòla.', 'Es portugués.'],
							correct: 0,
							oc: true,
							choses: ['espanhol-espanhola'],
							explain: 'Un homme : *espanhòl*, sans *-a*.'
						},
						{
							q: 'Tu n’as pas compris ce qu’on vient de te dire :',
							options: ['Pòdes repetir, se te plai ?', 'Qu’es aquò ?', 'Non sabi pas.'],
							correct: 0,
							oc: true,
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir, se te plai ?* : tu peux répéter ? *Qu’es aquò ?* demande ce qu’est une chose.'
						},
						{
							q: 'Elle comprend bien :',
							options: ['Compren plan.', 'Compreni plan.', 'Comprenes plan.'],
							correct: 0,
							oc: true,
							choses: ['comprene-singular', 'un-pauc-plan'],
							explain: '*Compren* : elle comprend. *Compreni* : je comprends ; *comprenes* : tu comprends.'
						}
					]
				},
				{
					// L’intrus (chantier 33, 07-11) : conçu avec lo Basic et sinonimes
					// (scripts/intrus-verificar.mjs), rien de leurs réponses n’est gardé.
					type: 'intrus',
					title: 'L’intrús (l’intrus)',
					intro: 'Quatre mots : trois font une famille, le quatrième n’a rien à faire là. Touche l’intrus.',
					items: [
						{
							mots: ['catalana', 'francesa', 'italian', 'espanhòla'],
							intrus: 2,
							familha: 'au féminin, en *-a*',
							choses: ['catalan-catalana', 'frances-francesa', 'italian-italiana', 'espanhol-espanhola'],
							explain: '*Italian* est au masculin ; au féminin, *italiana*.'
						},
						{
							mots: ['parli', 'compreni', 'parlas', 'demòri'],
							intrus: 2,
							familha: '« je » : la fin en *-i*',
							choses: ['parlar-singular', 'comprene-singular', 'demori-a'],
							explain: '*Parlas* : « tu parles ».'
						},
						{
							mots: ['Cossí se ditz… ?', 'Qué vòl dire… ?', 'D’ont siás ?', 'Pòdes repetir, se te plai ?'],
							intrus: 2,
							familha: 'pour se débrouiller quand on ne comprend pas',
							choses: ['cossi-se-ditz', 'que-vol-dire', 'd-ont-sias', 'podes-repetir'],
							explain: '*D’ont siás ?* demande d’où l’on est.'
						},
						{
							mots: ['ieu', 'el', 'mas', 'ela'],
							intrus: 2,
							familha: 'des personnes : moi, lui, elle',
							choses: ['ieu', 'el-ela', 'mas'],
							explain: '*Mas* veut dire « mais ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{ consigne: 'Je ne parle pas anglais.', answers: ['Non parli pas anglés.'], choses: ['pas', 'angles-anglesa'] },
						{ consigne: 'Quelle langue parles-tu ?', answers: ['Quina lenga parlas ?'], choses: ['quin-quina', 'la-lenga'] }
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
					title: 'Karim présente une amie',
					intro:
						'Marià veut en savoir plus sur la jeune femme de Barcelone. Karim la lui présente. Lis une première fois pour répondre à une seule question : de qui parle Karim ?',
					scenes: [
						{
							title: 'Karim e Marià',
							subtitle: '(Karim présente Núria à Marià)',
							lines: [
								{ oc: 'Marià, es Núria. Es catalana : es de Barcelona, mas demòra a Tolosa.', sound: 'ma-ri-A, és NOU-ria. és ca-ta-LA-no : és dé bar-sé-LOU-no, mas dé-MÒ-ro a tou-LOU-zo.', fr: 'Marià, c’est Núria. Elle est catalane : elle est de Barcelone, mais elle habite à Toulouse.' },
								{ oc: 'Encantada, Núria ! E parla occitan ?', sound: 'én-can-TA-do, NOU-ria ! é PAR-lo ou-tsi-TA ?', fr: 'Enchantée, Núria ! Et elle parle occitan ?' },
								{ oc: 'Parla catalan e espanhòl. Parla tanben un pauc occitan, e compren plan.', sound: 'PAR-lo ca-ta-LA é es-pa-GNÒL. PAR-lo tam-BÉ un PAOUK ou-tsi-TA, é coum-PRÉ(N) PLA.', fr: 'Elle parle catalan et espagnol. Elle parle aussi un peu occitan, et elle comprend bien.' },
								{ oc: 'E anglés ?', sound: 'é an-GLÉS ?', fr: 'Et anglais ?' },
								{ oc: 'Non parla pas anglés !', sound: 'nou PAR-lo PAS an-GLÉS !', fr: 'Non, elle ne parle pas anglais !' }
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
							q: 'De qui parle Karim ?',
							options: ['de son amie Núria', 'de lui-même', 'de Marià'],
							correct: 0,
							explain: '*Marià, es Núria.* Karim présente Núria : d’où elle est, où elle habite, ses langues.'
						},
						{
							q: 'Núria et l’occitan :',
							options: ['elle le parle un peu, et le comprend bien', 'elle le parle bien', 'elle ne le comprend pas'],
							correct: 0,
							choses: ['un-pauc-plan', 'comprene-singular'],
							explain: '*Parla tanben un pauc occitan, e compren plan.*'
						},
						{
							q: 'Quelle langue Núria ne parle-t-elle pas ?',
							options: ['l’anglais', 'l’espagnol', 'le catalan'],
							correct: 0,
							choses: ['pas'],
							explain: '*Non parla pas anglés !* Pour répondre non, un seul *non* suffit, devant le verbe.'
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
					type: 'qcm',
					title: 'Elle, ou moi ?',
					intro: 'Karim parle de Núria : « il » ou « elle ». Regarde la fin des verbes.',
					items: [
						{
							q: '*Parla catalan.* Qui parle catalan ?',
							options: ['elle, Núria', 'moi, Karim', 'toi'],
							correct: 0,
							noShuffle: true,
							choses: ['parlar-singular'],
							explain: '*parla* : il ou elle parle. De lui-même, Karim dirait *parli*.'
						},
						{
							q: 'Karim dit de Núria : *demòra a Tolosa.* De lui-même, il dirait…',
							options: ['Demòri a Tolosa.', 'Demòra a Tolosa.', 'Demòras a Tolosa.'],
							correct: 0,
							oc: true,
							choses: ['demori-a'],
							explain: '*demòri* : j’habite. *demòra* : il ou elle habite.'
						},
						{
							q: 'Pour toi : « je comprends bien ».',
							options: ['Compreni plan.', 'Compren plan.', 'Comprenes plan.'],
							correct: 0,
							oc: true,
							choses: ['comprene-singular'],
							explain: '*Compreni* pour toi ; *compren* pour Núria.'
						},
						{
							q: '*Es catalana* : Karim parle…',
							options: ['d’une femme', 'd’un homme'],
							correct: 0,
							noShuffle: true,
							choses: ['catalan-catalana'],
							explain: '*catalana*, avec *-a* : une femme. Pour un homme : *Es catalan.*'
						}
					]
				},
				{
					type: 'table',
					title: 'Une fiche « langues » en six phrases',
					head: ['', 'Karim dit', 'tu peux dire aussi'],
					rows: [
						['qui c’est', '*Es Núria.*', '*Es Giulia.* · *Es Loís.*'],
						['sa nationalité', '*Es catalana.*', '*Es italiana.* · *Es francés.*'],
						['d’où il ou elle est, où il ou elle habite', '*Es de Barcelona, mas demòra a Tolosa.*', '*Es d’aquí.* · *Demòra a Montpelhièr.*'],
						['ses langues', '*Parla catalan e espanhòl.*', '*Parla francés e occitan.*'],
						['un peu, aussi', '*Parla tanben un pauc occitan, e compren plan.*', '*Compren un pauc.* · *Parla plan italian.*'],
						['ce qu’il ou elle ne parle pas', '*Non parla pas anglés !*', '*Non parla pas catalan.* · *Non compren pas.*']
					],
					notes: [
						'Tout est à la troisième personne : *es*, *demòra*, *parla*, *compren*. Pour toi, ce serait *soi*, *demòri*, *parli*, *compreni*.',
						'La nationalité s’accorde : *Es catalana* pour une femme, *Es catalan* pour un homme. Le nom de la langue, lui, ne change pas : *Parla catalan.*'
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
				// jeu prévu par la carte : présenter la fiche « langues » d'un personnage,
				// remettre la présentation dans l'ordre (version simple : order, une
				// tuile par phrase).
				{
					type: 'order',
					title: 'Remets la fiche dans l’ordre',
					intro: 'Ici, chaque tuile est une phrase entière. Touche-les dans l’ordre du texte français.',
					items: [
						{
							prompt: 'C’est Giulia. Elle est italienne. Elle parle italien et occitan. Elle parle aussi un peu français. Mais elle ne parle pas anglais.',
							tiles: ['Es Giulia.', 'Es italiana.', 'Parla italian e occitan.', 'Parla tanben un pauc francés.', 'Mas non parla pas anglés.'],
							choses: ['italian-italiana', 'parlar-singular', 'tanben', 'pas'],
							explain: 'Qui, la nationalité, les langues, ce qu’elle parle un peu, ce qu’elle ne parle pas.'
						},
						{
							prompt: 'C’est Karim. Il est de Béziers, mais il habite à Toulouse. Il parle français et occitan. Il ne parle pas catalan, mais il comprend un peu.',
							tiles: ['Es Karim.', 'Es de Besièrs,', 'mas demòra a Tolosa.', 'Parla francés e occitan.', 'Non parla pas catalan,', 'mas compren un pauc.'],
							choses: ['es-de', 'demori-a', 'parlar-singular', 'pas', 'mas', 'comprene-singular'],
							explain: 'Deux fois *mas* : le premier pour la ville, le second pour le catalan.'
						}
					]
				},
				// Règle 13 de la recherche (rester en occitan) : au 4e tour, Loís passe
				// au français ; la bonne réplique, déjà vue en 2.3, ramène l'occitan.
				{
					type: 'causida',
					title: 'Giulia rencontre Loís',
					intro:
						'C’est toi qui parles. Tu es à la foire avec Giulia, et Loís ne la connaît pas encore. Choisis chaque réplique : si elle ne va pas, Loís te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Loís',
					tours: [
						{
							situacion: 'Loís arrive. Il te tutoie, et il regarde ton amie.',
							ditz: 'Adieu ! Qui es ?',
							options: [
								{ oc: 'Es Giulia.', bon: true },
								{ oc: 'Soi Giulia.', reaccion: 'Loís te regarde, perplexe : c’est toi, Giulia ?' },
								{ oc: 'Non sabi pas.', reaccion: 'Loís rit : tu ne connais pas le nom de ton amie ?' }
							],
							choses: ['qui-es'],
							explain: '*Qui es ?* : qui est-ce ? Tu réponds par un nom : *Es Giulia.*'
						},
						{
							ditz: 'Es francesa ?',
							options: [
								{ oc: 'Non, es italiana.', bon: true },
								{ oc: 'Non, es italian.', reaccion: 'Loís sourit : *italian*, pour une femme ?' },
								{ oc: 'Òc, es italiana.', reaccion: 'Loís fronce les sourcils : française, ou italienne ?' }
							],
							choses: ['oc-non', 'italian-italiana'],
							explain: '*Non*, puis le féminin : *es italiana*.'
						},
						{
							ditz: 'Quina lenga parla ?',
							options: [
								{ oc: 'Parla italian e occitan.', bon: true },
								{ oc: 'Parli italian e occitan.', reaccion: 'Loís s’étonne : toi aussi ? Il voulait savoir les langues de Giulia.' },
								{ oc: 'Es italiana.', reaccion: 'Loís hoche la tête : ça, il le sait déjà. Il veut savoir ses langues.' }
							],
							choses: ['quin-quina', 'parlar-singular'],
							explain: '*Parla* : elle parle.'
						},
						{
							situacion:
								'Loís n’en revient pas. Il passe au français, et parle très vite : « Attends, attends : une Italienne qui parle occitan ? Mais elle l’a appris où, ça ? »',
							options: [
								{ oc: 'Pòdes repetir en occitan, se te plai ?', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Loís continue en français, de plus en plus vite. La conversation file en français : l’occitan attendra.' },
								{ oc: 'Mercés !', reaccion: 'Loís sourit et poursuit en français : on dirait que tu le remercies de changer de langue.' }
							],
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir en occitan, se te plai ?* : sans reproche, tu ramènes la conversation en occitan. Loís rit, et reprend en occitan, plus lentement.'
						},
						{
							ditz: 'E parla plan occitan ?',
							options: [
								{ oc: 'Òc, parla plan !', bon: true },
								{ oc: 'Òc, parli plan !', reaccion: 'Loís rit : bravo pour toi, mais il parlait de Giulia.' },
								{ oc: 'Non compren pas.', reaccion: 'Giulia proteste en riant : elle vient de tout comprendre.' }
							],
							choses: ['un-pauc-plan', 'parlar-singular'],
							explain: '*Parla plan* : elle parle bien.'
						},
						{
							ditz: 'E tu, parlas italian ?',
							options: [
								{ oc: 'Un pauc. E tu ?', bon: true },
								{ oc: 'Non parli pas italian. E tu ?', bon: true },
								{ oc: 'Non parla pas italian.', reaccion: 'Loís éclate de rire : Giulia est italienne ! Il te demandait si toi, tu parles italien.' }
							],
							choses: ['parlar-singular', 'pas'],
							explain: '*Un pauc* ou *Non parli pas italian*, selon ce qui est vrai pour toi. Puis *E tu ?*'
						},
						{
							ditz: 'Ieu ? Non parli pas italian… mas compreni un pauc ! A lèu, Giulia !',
							options: [
								{ oc: 'A lèu, Loís !', bon: true },
								{ oc: 'Bonjorn !', reaccion: 'Loís s’arrête, surpris : il s’en allait. C’est le moment de dire au revoir.' },
								{ oc: 'Pòdes repetir, se te plai ?', reaccion: 'Loís répète en riant, plus lentement : *A lèu !*' }
							],
							choses: ['a-leu'],
							explain: '*A lèu* : à bientôt.'
						}
					],
					fin: 'Bravo ! Tu as présenté Giulia, et tu as gardé l’occitan quand Loís est passé au français.'
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
					title: 'La tâche de l’unité : présenter les langues de quelqu’un',
					paragraphs: [
						'Choisis une personne que tu connais bien : une amie, ton grand-père, une collègue… Tu vas présenter ses langues à Marià, en six phrases, comme Karim avec Núria.',
						'Puis, pour de vrai : redis-la à la personne à qui tu pensais au début de l’unité (module 2.1).'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris sa fiche « langues »)',
					intro:
						'Six phrases, une à la fois, sur une personne que tu connais. À la fin, la page les rassemble : c’est sa fiche « langues ».',
					recap: 'Sa fiche « langues », à dire à voix haute :',
					items: [
						{ consigne: '1. Dis qui c’est.', debut: ['Es'], explain: 'Par exemple : *Es Lisa.*' },
						{
							consigne: '2. Dis sa nationalité.',
							debut: ['Es', 'El es', 'Ela es'],
							explain: 'Avec le *-a* pour une femme : *Es francesa.* · *Es francés.*'
						},
						{
							consigne: '3. Dis d’où il ou elle est, et où il ou elle habite.',
							answers: ['Es d’aquí.', 'Demòra aquí.'],
							debut: ['Es de', 'Es d’', 'Demòra a', 'Mas demòra a'],
							choses: ['es-de', 'demori-a'],
							explain: 'Par exemple : *Es de Nimes, mas demòra a Montpelhièr.*'
						},
						{
							consigne: '4. Dis les langues qu’il ou elle parle.',
							debut: ['Parla'],
							choses: ['parlar-singular'],
							explain: 'Par exemple : *Parla francés e anglés.*'
						},
						{
							consigne: '5. Dis ce qu’il ou elle parle un peu, ou comprend.',
							debut: ['Parla tanben', 'Parla un pauc', 'Parla plan', 'Compren'],
							choses: ['un-pauc-plan', 'comprene-singular'],
							explain: 'Par exemple : *Parla tanben un pauc occitan, e compren plan.*'
						},
						{
							consigne: '6. Dis une langue qu’il ou elle ne parle pas.',
							debut: ['Non parla pas', 'Mas non parla pas'],
							choses: ['pas'],
							explain: 'Par exemple : *Mas non parla pas italian !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde un exemple.',
							a: '*Es Lisa. Es francesa : es de Nimes, mas demòra a Montpelhièr. Parla francés e anglés. Parla tanben un pauc occitan, e compren plan. Mas non parla pas italian !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'les six phrases y sont, dans un ordre naturel',
						'tout est à la troisième personne : *es*, *demòra*, *parla*, *compren*',
						'la nationalité est accordée : *-a* pour une femme',
						'*non* vient devant le verbe, *pas* après',
						'à voix haute : *nh* sonne « gn », *é* reste fermé, *è* est ouvert'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Redis-la sans regarder',
					paragraphs: [
						'Cache ton texte. Redis la fiche d’une traite, deux fois. Enregistre la seconde sur ton téléphone, puis coche les critères toi-même.',
						'Pour aller plus loin : fais la fiche d’une deuxième personne, un homme si la première était une femme, ou l’inverse.'
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 10,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Les trois sons de l’unité',
					list: [
						'*nh* sonne « gn » : *espanhòl* « es-pa-GNÒL » (module 2.1) ;',
						'*é* est fermé, *è* est ouvert : *francés* « fran-SÉS », *Besièrs* « bé-ZYÈS » (module 2.2) ;',
						'sans petit mot pour questionner, la voix monte : *Parlas occitan ?* (module 2.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Alemanha* (l’Allemagne) se dit…',
							options: ['a-lé-MA-gno', 'a-lé-MAN-a'],
							correct: 0,
							noShuffle: true,
							explain: '*nh* sonne « gn », et le *a* final sonne « o ».'
						},
						{
							q: '*Anglés* se dit…',
							options: ['an-GLÉS', 'an-GLÈS'],
							correct: 0,
							noShuffle: true,
							explain: 'Accent aigu : *é* fermé. Et le *s* final se dit.'
						},
						{
							q: 'Laquelle fait monter la voix à la fin ?',
							options: ['Parlas occitan ?', 'Parli occitan.'],
							correct: 0,
							noShuffle: true,
							explain: 'Une question sans petit mot pour questionner : la voix monte. *Parli occitan.* affirme.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis d’une traite, en soignant les trois sons : *Parlas espanhòl ? Òc, e francés tanben.* Puis regarde.',
							a: '« PAR-los es-pa-GNÒL ? OK, é fran-SÉS tam-BÉ. » La voix monte sur la question, *nh* sonne « gn », *é* reste fermé.'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 2 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'dire ma nationalité, et celle des autres',
						'dire les langues que je parle, un peu ou bien, et celles que je ne parle pas',
						'faire répéter, demander un mot ou ce qu’il veut dire',
						'présenter les langues de quelqu’un en six phrases',
						'garder la conversation en occitan quand l’autre passe au français'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant parler des langues : les tiennes, et celles des autres.',
						'Si tu en as envie : la prochaine fois que quelqu’un te répond en français, dis-lui *Pòdes repetir en occitan, se te plai ?* À qui ? Quand ? Où ? Choisis-le maintenant.'
					]
				},
				// Mémo de l'unité (regles-redaccion-A1.md §3) : pas d'id ici, les id
				// vivent dans les encadrés de 2.1 à 2.3 (lexic-A1.md §0, point 3).
				{
					type: 'table',
					title: 'Mémo de l’unité 2 : les blocs tout faits',
					intro:
						'*Òsca !* (bravo !) Tu as fini l’unité 2. Voici ses blocs tout faits ; la première halte, juste après, te les fera ressortir avec ceux de l’unité 1.',
					head: ['pour…', 'les blocs tout faits'],
					rows: [
						['dire sa nationalité', '*Soi francés.* · *Soi occitana.* · *Es catalana.* · *El es portugués.*'],
						['répondre', '*Òc !* · *Non !*'],
						['parler des langues', '*Parlas occitan ?* · *Parli un pauc occitan.* · *Compreni plan.* · *Non parli pas anglés.* · *Parli tanben catalan.*'],
						['se débrouiller', '*Pòdes repetir, se te plai ?* · *Qué vòl dire… ?* · *Cossí se ditz… en occitan ?* · *Non sabi pas.*'],
						['questionner', '*Qu’es aquò ?* · *Qui es ?* · *Qual es ?* · *Quina lenga parlas ?* · *Occitan o francés ?*']
					]
				},
				{
					type: 'table',
					title: 'Le mini-tableau',
					head: ['', 'être', 'parler', 'comprendre'],
					rows: [
						['je', '*soi*', '*parli*', '*compreni*'],
						['tu', '*siás*', '*parlas*', '*comprenes*'],
						['il, elle', '*es*', '*parla*', '*compren*']
					],
					notes: ['Au féminin, on ajoute *-a* : *occitan*, *occitana*.', '*non* devant le verbe, *pas* après : *Non compreni pas.*']
				},
				// Encart de l'unité 2, collé tel quel depuis cursus/alhors-en-occitania-A1.md.
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'un peu', 'bien'],
					rows: [
						['languedocien (ton cours)', '*un pauc*', '*plan*'],
						['gascon', '*un chic*', '*plan*'],
						['provençal', '*un pauc*', '*ben*'],
						['limousin', '*un pauc*', '*ben* · *plan*'],
						['auvergnat', '*un pauc*', '*ben*'],
						['vivaro-alpin', '*un pauc*', '*ben*']
					],
					notes: [
						'« Un peu » se dit souvent *un chic* en gascon ; partout ailleurs, *un pauc*.',
						'« Bien » : *plan* chez toi et en gascon, *ben* en provençal, en auvergnat et en vivaro-alpin ; le limousin dit les deux.',
						'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
					],
					glosa: { 'un chic': 'un peu (gascon)', ben: 'bien' }
				}
			]
		}
	]
};
