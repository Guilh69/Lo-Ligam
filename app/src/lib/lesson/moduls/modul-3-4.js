// Module 3.4 · A1 · la tâche · « E ta familha ? » : unité 3 (La familha),
// rédigé par Claude le 2026-11-01 sur le modèle du module 1.4 (même chemin
// en six étapes, carte de l'A1 §3, règles de cursus/regles-redaccion-A1.md).
// Aucun mot nouveau : tout revient des modules 3.1 à 3.3, de l'unité 1
// (d'où l'on est, où l'on habite) et de l'unité 2 (langues, nationalités).
// Tâche : présenter sa famille, vraie ou inventée, en huit phrases.
// Jeu du jour : écrire sous son arbre.
// Scène : fin du repas chez Mameta, Núria présente sa famille ; puis Inès
// pose ses questions (règle 13 : elle passe au français, vite).
// Fin du module : mémo de l'unité, puis l'encart « Alhors en Occitània »
// (cursus/alhors-en-occitania-A1.md, bloc collé tel quel).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul34 = {
	id: 'modul-3-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '3-4',
	unitat: 'Unitat 3 · La familha',
	nivel: 'A1 · Modul 3.4 · la tâche',
	oc: 'E ta familha ?',
	fr: 'Et ta famille ? Présenter sa famille en huit phrases',
	cando:
		'Je peux présenter ma famille, ou une famille inventée, en huit phrases : qui est qui, les âges, d’où l’on vient, les langues, les animaux, puis retourner la question.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages et noms de lieux : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Joana', 'Jordi', 'Inès', 'Karim', 'Mimí', 'Lisa', 'Marc', 'Samuel', 'Lina', 'Val d’Aran', 'Aran'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Titre proposé : *E ta familha ?* (et ta famille ?), en écho au *E tu ?* du module 1.4.',
		'La grand-mère de Núria est du Val d’Aran (*la Val d’Aran*), en Catalogne, où l’occitan est langue officielle : ça te va ? Prononciation de *Aran* à confirmer : j’ai noté « da-RAN », avec le « n » aranais.',
		'Deux exemples de présentation : Lisa (du module 1.4) avec sa mère et son frère, et une famille inventée avec deux pères (*dos paires*, glosé) : ça te va ?',
		'Règle 13 : Inès passe au français, vite ; la bonne réponse est *Pòdes repetir, se te plai ?* (module 2.3).',
		'Joana reprend la blague de Mameta du module 3.1 (*vint ans, quatre còps*) : ça te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'escriure',
					title: 'De mémoire (écris)',
					intro: 'Deux phrases du module 3.3, sans regarder. Un accent oublié, on te le montre.',
					items: [
						{ consigne: 'J’ai un frère et une sœur.', answers: ['Ai un fraire e una sòrre.'], choses: ['un-una-article', 'lo-fraire', 'la-sorre'] },
						{ consigne: 'Il n’y a pas de chien.', answers: ['Non i a pas de can.'], choses: ['i-a', 'lo-can'] }
					]
				},
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'La sœur de ta mère, c’est…',
							options: ['ta tanta', 'ta sòrre', 'ta cosina'],
							correct: 0,
							oc: true,
							choses: ['oncle-tanta'],
							explain: 'La sœur de ta mère : *ta tanta*, ta tante.'
						},
						{
							q: '*dètz-e-uèch* :',
							options: ['18', '8', '10'],
							correct: 0,
							choses: ['nombre-18'],
							explain: '« dix et huit » : 18.'
						},
						{
							q: 'Tu demandes à Joana si elle a un chat :',
							options: ['As un cat ?', 'A un cat ?', 'I a un cat ?'],
							correct: 0,
							oc: true,
							choses: ['aver-singular', 'lo-cat'],
							explain: '*As* : tu as. *A un cat ?* : il ou elle a un chat ? *I a un cat ?* : il y a un chat ?'
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
					title: 'La famille de Núria',
					intro:
						'Le repas se termine. Joana veut tout savoir sur la famille de Núria, et Núria répond en huit phrases. Lis une première fois pour répondre à une seule question : qui, dans la famille de Núria, parle occitan ?',
					scenes: [
						{
							title: 'Joana',
							subtitle: '(au dessert)',
							lines: [{ oc: 'Núria, e ta familha ?', sound: 'NOU-ria, é ta fa-MI-lyo ?', fr: 'Núria, et ta famille ?' }]
						},
						{
							title: 'Núria',
							subtitle: '(elle présente sa famille)',
							lines: [
								{ oc: 'Ma familha es de Barcelona.', sound: 'ma fa-MI-lyo és dé bar-sé-LOU-no.', fr: 'Ma famille est de Barcelone.' },
								{ oc: 'Mon paire es catalan, e ma maire es espanhòla.', sound: 'moun PAÏ-ré és ca-ta-LA, é ma MAÏ-ré és es-pa-GNÒ-lo.', fr: 'Mon père est catalan, et ma mère est espagnole.' },
								{ oc: 'Ai un fraire, Jordi : a dètz-e-sèt ans.', sound: 'aï un FRAÏ-ré, JOR-di : a dèts-é-SÈT ANS.', fr: 'J’ai un frère, Jordi : il a dix-sept ans.' },
								{ oc: 'Non ai pas de sòrre.', sound: 'nou aï PAS dé SÒ-rré.', fr: 'Je n’ai pas de sœur.' },
								{ oc: 'Ma mameta es de la Val d’Aran : parla occitan !', sound: 'ma ma-MÉ-to és dé la BAL da-RAN : PAR-lo ou-tsi-TA !', fr: 'Ma grand-mère est du Val d’Aran : elle parle occitan !' },
								{ oc: 'Ieu, parli catalan, espanhòl… e un pauc occitan.', sound: 'YÉOU, PAR-li ca-ta-LA, es-pa-GNÒL… é un PAOUK ou-tsi-TA.', fr: 'Moi, je parle catalan, espagnol… et un peu occitan.' },
								{ oc: 'Ai un aucèl, mas non ai pas de can.', sound: 'aï u-naou-SÈL, mas nou aï PAS dé CA.', fr: 'J’ai un oiseau, mais je n’ai pas de chien.' },
								{ oc: 'E tu, Joana ?', sound: 'é TU, djou-A-no ?', fr: 'Et toi, Joana ?' }
							]
						},
						{
							title: 'Joana e Mameta',
							subtitle: '(Mameta s’en mêle)',
							lines: [
								{ oc: 'Ieu ? Ai doas maires… e un can !', sound: 'YÉOU ? aï DOUOS MAÏ-rés… é un CA !', fr: 'Moi ? J’ai deux mères… et un chien !' },
								{ oc: 'E ieu, ai un caval, sèt galinas…', sound: 'é YÉOU, aï un ca-BAL, SÈT ga-LI-nos…', fr: 'Et moi, j’ai un cheval, sept poules…' },
								{ oc: '…e vint ans, quatre còps !', sound: '…é BIN ANS, KA-tré COPS !', fr: '…et vingt ans, quatre fois !' }
							]
						}
					],
					glossary: [
						{ oc: 'la Val d’Aran', sound: 'la BAL da-RAN', fr: 'le Val d’Aran, une vallée de Catalogne où l’on parle occitan' },
						{ oc: 'doas maires', sound: 'DOUOS MAÏ-rés', fr: 'deux mères' },
						{ oc: 'sèt galinas', sound: 'SÈT ga-LI-nos', fr: 'sept poules' },
						{ oc: 'quatre còps', sound: 'KA-tré COPS', fr: 'quatre fois (la blague de Mameta, module 3.1)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui, dans la famille de Núria, parle occitan ?',
							options: ['sa grand-mère', 'son frère', 'son père'],
							correct: 0,
							choses: ['papeta-mameta', 'parlar-singular'],
							explain: '*Ma mameta es de la Val d’Aran : parla occitan !* Le Val d’Aran est en Catalogne : on y parle occitan, et c’est une langue officielle.'
						},
						{
							q: 'Jordi, le frère de Núria, a…',
							options: ['17 ans', '7 ans', '19 ans'],
							correct: 0,
							choses: ['a-ans', 'nombre-17'],
							explain: '*a dètz-e-sèt ans* : il a 17 ans. Núria, elle, en a 19.'
						},
						{
							q: 'Le père de Núria est…',
							options: ['catalan', 'espagnol', 'occitan'],
							correct: 0,
							choses: ['lo-paire', 'catalan-catalana'],
							explain: '*Mon paire es catalan, e ma maire es espanhòla* : son père est catalan, sa mère espagnole.'
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
					type: 'table',
					title: 'Une présentation en huit phrases',
					intro: 'Ce que dit Núria, et ce que tu peux dire, toi. Choisis ce qui te va.',
					head: ['', 'Núria dit', 'tu peux dire aussi'],
					rows: [
						['1. d’où vient la famille', '*Ma familha es de Barcelona.*', '*Ma familha es d’aquí.* · *Demòri a Tolosa.*'],
						['2. les parents', '*Mon paire es catalan, e ma maire es espanhòla.*', '*Ai doas maires.* · *Lo companh de ma maire es de Besièrs.*'],
						['3. frères et sœurs', '*Ai un fraire, Jordi : a dètz-e-sèt ans.*', '*Ai una sòrre.* · *Ai dos fraires.*'],
						['4. ce qu’on n’a pas', '*Non ai pas de sòrre.*', '*Non ai pas de fraire.*'],
						['5. grands-parents, oncles, tantes', '*Ma mameta es de la Val d’Aran : parla occitan !*', '*Mon papeta demòra a Carcassona.* · *Ma tanta es italiana.*'],
						['6. toi', '*Ieu, parli catalan, espanhòl… e un pauc occitan.*', '*Ai vint ans.* · *Parli francés.*'],
						['7. les animaux', '*Ai un aucèl, mas non ai pas de can.*', '*I a un cat.* · *Non ai pas de can.*'],
						['8. une question pour finir', '*E tu, Joana ?*', '*E tu, as de fraires ?* · *E ta familha ?*']
					],
					notes: [
						'Il n’y a pas de famille modèle : chacun présente la sienne, ou celle qu’il invente.',
						'Tu ne dis que ce que tu veux : une phrase peut parler d’un cousin, d’une voisine ou d’un chat.'
					]
				},
				{
					type: 'order',
					title: 'La présentation d’Inès',
					intro: 'Inès présente sa famille à son tour. Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Mon père est marocain, et ma mère est d’ici.',
							tiles: ['Mon', 'paire', 'es', 'marroquin,', 'e', 'ma', 'maire', 'es', 'd’aquí.'],
							choses: ['lo-paire', 'la-maire', 'possessius-mon-ma'],
							explain: '*marroquin* : marocain (unité 2). *d’aquí* : d’ici (unité 1).'
						},
						{
							prompt: 'J’ai un frère, Karim : il a vingt ans.',
							tiles: ['Ai', 'un', 'fraire,', 'Karim :', 'a', 'vint', 'ans.'],
							choses: ['un-una-article', 'lo-fraire', 'a-ans'],
							explain: '*a vint ans* : il a vingt ans, « BIN ANS ».'
						},
						{
							prompt: 'Ma grand-mère parle occitan, et j’ai une chatte.',
							tiles: ['Ma', 'mameta', 'parla', 'occitan,', 'e', 'ai', 'una', 'cata.'],
							choses: ['papeta-mameta', 'parlar-singular', 'lo-cat'],
							explain: '*parla* : il ou elle parle (unité 2).'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// Jeu prévu par la carte : écrire sous son arbre (à coder : l'arbre
		// dessiné, chaque phrase écrite vient se poser sous sa branche).
		// Version simple : les huit phrases, rassemblées à la fin par « recap ».
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 10,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris ta famille)',
					intro:
						'Mameta se tourne vers toi : *E ta familha ?* Huit phrases, une à la fois. Ta vraie famille, celle que tu choisis, ou une famille inventée : c’est toi qui décides. Toutes les familles vont : *Ai doas maires*, *Ai dos paires* (deux pères), *Ma familha : ma maire e ieu*… À la fin, la page les rassemble.',
					glosa: { paires: 'pères (paire au pluriel)' },
					recap: 'Ta famille en huit phrases, à dire à voix haute :',
					items: [
						{
							consigne: '1. D’où vient ta famille ? Ou bien : où habites-tu ?',
							answers: ['Ma familha es d’aquí.', 'Demòri aquí.'],
							debut: ['Ma familha es de', 'Ma familha es d’', 'Demòri a'],
							choses: ['la-familha', 'es-de', 'demori-a'],
							explain: 'Par exemple : *Ma familha es de Tolosa.*'
						},
						{
							consigne: '2. Les parents, ou les adultes de ta famille.',
							answers: ['Ai doas maires.', 'Ai dos paires.'],
							debut: ['Mon paire', 'Ma maire', 'Ma familha', 'Lo companh de', 'La companha de'],
							choses: ['lo-paire', 'la-maire', 'possessius-mon-ma'],
							explain: 'Par exemple : *Mon paire es marroquin.* ou *Ma familha : ma maire e ieu.*'
						},
						{
							consigne: '3. Frères et sœurs : combien ?',
							answers: ['Non ai pas de fraire.', 'Non ai pas de sòrre.', 'Non ai pas de fraire e non ai pas de sòrre.'],
							debut: ['Ai un', 'Ai una', 'Ai dos', 'Ai doas', 'Ai tres'],
							choses: ['aver-singular', 'un-una-article', 'lo-fraire', 'la-sorre'],
							explain: 'Par exemple : *Ai un fraire, Jordi.*'
						},
						{
							consigne: '4. Leur âge, ou ce que tu n’as pas.',
							debut: ['Mon fraire a', 'Ma sòrre a', 'A', 'Non ai pas de'],
							choses: ['a-ans', 'ai-pas-de'],
							explain: 'Par exemple : *Ma sòrre a nòu ans.* ou *Non ai pas de sòrre.*'
						},
						{
							consigne: '5. Un grand-parent, un oncle, une tante, un cousin…',
							debut: ['Mon papeta', 'Ma mameta', 'Lo papeta', 'La mameta', 'Mon oncle', 'L’oncle', 'Ma tanta', 'La tanta', 'Mon cosin', 'Ma cosina'],
							choses: ['papeta-mameta', 'oncle-tanta', 'cosin-cosina'],
							explain: 'Par exemple : *Ma mameta parla occitan.* ou *Mon oncle demòra a Besièrs.*'
						},
						{
							consigne: '6. Toi : ton âge, ou les langues que tu parles.',
							debut: ['Ai', 'Ieu, ai', 'Parli', 'Ieu, parli'],
							choses: ['quant-as-d-ans', 'parlar-singular'],
							explain: 'Par exemple : *Ieu, ai vint ans e parli francés.*'
						},
						{
							consigne: '7. Les animaux, vrais ou rêvés.',
							answers: ['Non ai pas de can.', 'Non ai pas de cat.', 'Non i a pas de can.'],
							debut: ['Ai un', 'Ai una', 'Non ai pas de', 'I a'],
							choses: ['aver-singular', 'i-a', 'lo-can', 'lo-cat'],
							explain: 'Par exemple : *Ai una cata, mas non ai pas de can.*'
						},
						{
							consigne: '8. Une question pour finir.',
							answers: ['E tu ?', 'E ta familha ?', 'E tu, as de fraires ?', 'E tu, quant as d’ans ?', 'E tu, as un can ?', 'E vos ?'],
							choses: ['quant-as-d-ans', 'aver-singular'],
							explain: 'Une question qui rend la parole : *E tu ?* ou *E ta familha ?*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 14,
			blocks: [
				{
					type: 'reveal',
					title: 'Deux exemples',
					glosa: { paires: 'pères (paire au pluriel)' },
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde un premier exemple : Lisa, que tu connais depuis l’unité 1.',
							a: '*Demòri a Montpelhièr. Ma familha : ma maire, mon fraire e ieu. Mon fraire a quinze ans. Non ai pas de sòrre. Ma mameta es de Nimes : parla occitan ! Ieu, ai vint ans e parli francés. Non ai pas de can, mas ai una cata. E tu, as de fraires ?*'
						},
						{
							q: 'Et un deuxième, avec une famille inventée.',
							a: '*Ma familha es de Besièrs. Ai dos paires, Marc e Samuel.* (deux pères) *Ai una sòrre, Lina : a nòu ans. Non ai pas de fraire. Mon papeta es portugués. Ieu, ai dètz-e-uèch ans e parli francés. I a un can e un cat. E ta familha ?*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'les huit phrases y sont : la famille, frères et sœurs, un grand-parent ou un oncle, toi, les animaux, une question',
						'*mon* et *ma* devant le bon mot : *mon paire*, *ma maire*',
						'*Non ai pas de…* pour ce que tu n’as pas',
						'*Ai… ans*, *a… ans* pour l’âge',
						'la prononciation : *vint* « BIN », *familha* « fa-MI-lyo », *can* « CA »'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'La tâche de l’unité : présenter ta famille',
					paragraphs: [
						'Redis ta présentation à voix haute, sans regarder, puis enregistre-la sur ton téléphone. Réécoute-la demain, et coche les critères toi-même.',
						'Choisis maintenant à qui tu la diras : une grand-mère ou un voisin qui parle occitan, ton professeur, ou un ami du cours en visio.',
						'Pour aller plus loin : présente la famille d’un personnage que tu aimes, dans un film ou un livre.'
					]
				},
				{
					type: 'causida',
					title: 'Inès te pose des questions',
					intro:
						'Après le repas, Inès, 12 ans, vient s’asseoir à côté de toi. C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Inès te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Inès',
					tours: [
						{
							ditz: 'Adieu ! Quant as d’ans ?',
							options: [
								{ oc: 'Ai… ans. E tu ?', bon: true },
								{ oc: 'Non ai pas de fraire.', reaccion: 'Inès rit : elle te demande ton âge, pas tes frères.' },
								{ oc: 'Es ma sòrre.', reaccion: 'Inès regarde autour d’elle : qui ça ? Elle te demande ton âge.' }
							],
							choses: ['quant-as-d-ans'],
							explain: 'Elle te demande ton âge : *Ai… ans*, puis tu retournes la question : *E tu ?*'
						},
						{
							ditz: 'Ai dotze ans. As de fraires ?',
							options: [
								{ oc: 'Òc, ai un fraire.', bon: true },
								{ oc: 'Non ai pas de fraire.', bon: true },
								{ oc: 'Òc, a un fraire.', reaccion: 'Inès fronce les sourcils : *a*, c’est « il ou elle a ». Pour toi, on dit *ai*.' }
							],
							choses: ['aver-singular', 'ai-pas-de'],
							explain: '*Ai un fraire* ou *Non ai pas de fraire* : les deux vont, c’est ta réponse.'
						},
						{
							situacion:
								'Tout à coup, Inès passe au français, très vite : « Ah ouais ? Moi, mon frère, c’est Karim, il habite à Toulouse, il vient presque jamais… Et toi, t’as des animaux ? »',
							options: [
								{ oc: 'Pòdes repetir, se te plai ?', bon: true },
								{ oc: 'Non compreni pas.', reaccion: 'Inès, gentille, te réexplique tout… en français, encore plus vite. Demande-lui plutôt de répéter.' },
								{ oc: 'Òc !', reaccion: 'Inès attend la suite : quels animaux ? Tu as répondu un peu au hasard.' }
							],
							choses: ['podes-repetir'],
							explain: 'Quelqu’un passe au français, ou parle trop vite ? *Pòdes repetir, se te plai ?* : la personne répète, et en occitan.'
						},
						{
							situacion: 'Inès répète, lentement, en occitan :',
							ditz: 'As un can ? O un cat ?',
							options: [
								{ oc: 'Ai un cat.', bon: true },
								{ oc: 'Non ai pas de can.', bon: true },
								{ oc: 'Ai una sòrre.', reaccion: 'Inès rit : une sœur, ce n’est pas un animal !' }
							],
							choses: ['lo-can', 'lo-cat', 'ai-pas-de'],
							explain: '*Ai un cat*, *Ai un can* ou *Non ai pas de can* : c’est ta réponse, vraie ou inventée.'
						},
						{
							ditz: 'Ieu, ai una cata, Mimí. E ta familha ?',
							options: [
								{ oc: 'Ma familha es d’aquí.', bon: true },
								{ oc: 'Es mon paire.', reaccion: 'Inès regarde autour d’elle : qui ça ? Elle te demande d’où vient ta famille.' },
								{ oc: 'A deman !', reaccion: 'Inès s’étonne : tu pars déjà ? Elle te demandait ta famille.' }
							],
							choses: ['la-familha', 'soi-d-aqui'],
							explain: 'Une phrase de ta présentation : *Ma familha es d’aquí*, *Ma familha es de Tolosa*…'
						},
						{
							ditz: 'Parlas plan occitan, tu ! A lèu !',
							options: [
								{ oc: 'Mercés ! A lèu !', bon: true },
								{ oc: 'Bonjorn !', reaccion: 'Inès rit : on s’est déjà dit bonjour. C’est le moment de dire au revoir.' },
								{ oc: 'Quant as d’ans ?', reaccion: 'Inès soupire : douze ans, elle te l’a déjà dit !' }
							],
							choses: ['merce', 'a-leu'],
							explain: '*Mercés ! A lèu !* : merci ! À bientôt !'
						}
					],
					fin: 'Bravo ! Tu as parlé de ta famille avec Inès. Et quand elle est passée au français, une seule phrase l’a ramenée à l’occitan.'
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
						'le « v » sonne « b » : *vint* « BIN » (module 3.1) ;',
						'« lh » sonne « ly » : *la familha* « la fa-MI-lyo » (module 3.2) ;',
						'le « n » final s’efface le plus souvent : *lo can* « lou CA » (module 3.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Vint !* se dit…',
							options: ['BIN', 'VIN'],
							correct: 0,
							noShuffle: true,
							explain: '« VIN », c’est la lecture à la française. En occitan, le « v » sonne « b » : « BIN ».'
						},
						{
							q: '*la familha* se dit…',
							options: ['la fa-MI-lyo', 'la fa-MIL-a'],
							correct: 0,
							noShuffle: true,
							explain: '« lh » sonne « ly », et le *a* final sonne « o » : « la fa-MI-lyo ».'
						},
						{
							q: '*deman* se dit…',
							options: ['dé-MA', 'dé-MAN'],
							correct: 0,
							noShuffle: true,
							explain: 'Le « n » final s’efface : « dé-MA », comme dans *A deman !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis à voix haute : *Ai vint ans. Ma familha. Non ai pas de can.*',
							a: '« aï BIN ANS », « ma fa-MI-lyo », « nou aï PAS dé CA ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : la langue passe par la famille',
					paragraphs: [
						'Selon l’enquête de l’Office public de la langue occitane (OPLO, 2020), l’occitan se transmet surtout dans la famille. Cette transmission reste faible, mais elle a progressé de 9 points en dix ans.',
						'Dans les foyers avec des enfants de moins de 18 ans, 14 % des enfants suivent ou ont suivi des cours d’occitan. Source : OPLO, enquête sociolinguistique 2020, synthèse.'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 3 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'dire mon âge et demander celui des autres : *Quant as d’ans ?*',
						'compter jusqu’à vingt',
						'nommer les gens d’une famille avec *mon, ma, ton, ta*',
						'dire ce que j’ai et ce que je n’ai pas : *Ai un can*, *Non ai pas de cat*',
						'présenter une famille, la mienne ou une famille inventée, en huit phrases'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de l’unité 3',
					glosa: { òsca: 'bravo' },
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant parler d’une famille en occitan : la tienne, ou celle que tu inventes. Dans l’unité 4, tu suivras la semaine de Loís : ce qu’on fait, jour après jour.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant présenter une famille en huit phrases.',
						'Si tu en as envie : demande *E ta familha ?* à la personne que tu as choisie, et écoute sa réponse. Puis dis-lui la tienne. Quand ? Où ? Choisis-le maintenant.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 3',
					intro: 'Tout ce que tu sais dire maintenant, sur une seule page.',
					head: ['', 'en occitan', 'en français'],
					rows: [
						['l’âge', '*Quant as d’ans ?* · *Ai vint ans.* · *Ela a sèt ans.*', 'quel âge as-tu ? · j’ai vingt ans. · elle a sept ans.'],
						['compter', '*un, una* · *dos, doas* · *tres*… *dètz*… *vint*', '1 · 2 (au masculin, au féminin) · 3… 10… 20'],
						['qui est-ce ?', '*Qual es ?* · *Es mon paire.*', 'qui est-ce ? · c’est mon père.'],
						['le, la, les', '*lo* · *la* · *l’* · *los* · *las*', 'le · la · l’ · les (masculin) · les (féminin)'],
						['à moi, à toi', '*mon paire, ma maire* · *ton fraire, ta sòrre*', 'mon père, ma mère · ton frère, ta sœur'],
						['la famille', '*lo paire, la maire, lo fraire, la sòrre, lo filh, la filha, lo papeta, la mameta, l’oncle, la tanta, lo cosin, la cosina, los dròlles, lo companh, la companha*', 'le père, la mère, le frère, la sœur, le fils, la fille, le grand-père, la grand-mère, l’oncle, la tante, le cousin, la cousine, les enfants, le compagnon, la compagne'],
						['avoir', '*ai* · *as* · *a*', 'j’ai · tu as · il ou elle a'],
						['il y a', '*I a un caval.* · *Non i a pas de cat.*', 'il y a un cheval. · il n’y a pas de chat.'],
						['ne… pas de', '*Non ai pas de can.*', 'je n’ai pas de chien.'],
						['les bêtes', '*lo can, lo cat, la cata, l’aucèl, lo caval, la galina*', 'le chien, le chat, la chatte, l’oiseau, le cheval, la poule']
					]
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'le père, la mère', 'la fille', 'le chien'],
					rows: [
						['languedocien (ton cours)', '*lo paire, la maire*', '*la filha*', '*lo can*'],
						['gascon', '*lo pair, la mair*', '*la hilha*', '*lo can*'],
						['provençal', '*lo paire, la maire*', '*la filha*', '*lo can* · *lo chin*'],
						['limousin', '*lo paire, la maire*', '*la filha*', '*lo chen* · *lo chin*'],
						['auvergnat', '*lo paire, la maire*', '*la filha*', '*lo chin*'],
						['vivaro-alpin', '*lo paire, la maire*', '*la filha*', '*lo chin*']
					],
					notes: [
						'Le gascon dit *pair* et *mair*, sans le *-e* final.',
						'En gascon, le *f* du début devient *h* : *filha* devient *hilha*.',
						'Au nord (limousin, auvergnat, vivaro-alpin), beaucoup de mots en « ca » passent à « ch » : le chien y est *lo chin* ; le provençal connaît *can* et *chin*.',
						'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
					],
					glosa: {
						'lo pair, la mair': 'le père, la mère (gascon)',
						'la hilha': 'la fille (gascon)',
						'lo chin': 'le chien',
						'lo chen': 'le chien (limousin)'
					}
				}
			]
		}
	]
};
