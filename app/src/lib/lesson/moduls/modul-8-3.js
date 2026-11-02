// Module 8.3 · A1 · « Qué prenes ? » : unité 8 (En vila), rédigé par Claude
// le 2026-11-02 sur le modèle des unités 1 et 4 (même chemin en six étapes ;
// règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : prene au singulier (preni, prenes, pren), comme comprene (2.2).
// Pas de pluriel de prene. Pour commander : Per ieu, …
// Scène : midi, au café de la place (le plan de 8.1). Karim, Yasmine, puis
// Núria et Lisa ; Bernat, le serveur, vouvoie ses clients.
// Jeu du jour : dialogue à choix avec le serveur (causida).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique), à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul83 = {
	id: 'modul-8-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '8-3',
	unitat: 'Unitat 8 · En vila',
	nivel: 'A1 · Modul 8.3',
	oc: 'Qué prenes ?',
	fr: 'Que prends-tu ? Commander au café',
	cando:
		'Je peux commander au café pour moi et pour quelqu’un d’autre, demander à quelqu’un ce qu’il prend, dire que j’ai soif, et demander l’addition.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Yasmine', 'Núria', 'Lisa', 'Bernat'],
	notesRelecture: [
		'Le serveur dit *Qué volètz ?* (que voulez-vous ?) à ses clients : ça te va ?',
		'*Per Yasmine, un tè* (pour Yasmine, un thé), pour commander pour quelqu’un : naturel ?',
		'Bernat, le serveur du café de la place : prénom nouveau, qui revient en 8.4. D’accord ?',
		'Chanson : *Parla patois* (Massilia Sound System, 1992), sur la page du groupe. Elle te va, ou tu préfères une chanson sur Toulouse ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des modules 8.1 et 8.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Tourne à gauche !',
							options: ['Vira a esquèrra !', 'Vira a drecha !', 'Tot drech !'],
							correct: 0,
							oc: true,
							choses: ['vira', 'a-esquerra'],
							explain: '*Vira !* : tourne ! *esquèrra* : gauche ; *drecha* : droite.'
						},
						{
							q: '*Cossí i vau ?*',
							options: ['Comment j’y vais ?', 'Comment vas-tu ?', 'Où vas-tu ?'],
							correct: 0,
							choses: ['cossi-i-vau'],
							explain: '*i* : y ; *vau* : je vais. « Comment vas-tu ? », c’est *Cossí vas ?* ; « où vas-tu ? », *Ont vas ?*'
						},
						{
							q: 'la deuxième rue :',
							options: ['la segonda carrièra', 'la primièra carrièra', 'lo segond carrièra'],
							correct: 0,
							oc: true,
							choses: ['primier-segond', 'la-carriera'],
							explain: '*la carrièra* est féminin : *la segonda*. *Lo segond* va avec un mot masculin.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Dis : je vais sur la place, à pied.',
							answers: ['Vau a la plaça a pè.', 'A pè, vau a la plaça.', 'Ieu, vau a la plaça a pè.'],
							choses: ['anar-singular', 'la-placa', 'a-pe'],
							explain: '*Vau* : je vais ; *a pè* : à pied.'
						},
						{
							consigne: 'Demande à un ami où il va.',
							answers: ['Ont vas ?', 'E tu, ont vas ?'],
							choses: ['anar-singular'],
							explain: '*Ont vas ?* : où vas-tu ? *Cossí vas ?*, c’est « comment vas-tu ? ».'
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
					title: 'Au café de la place',
					intro:
						'Midi, sur la place. Karim et Yasmine s’installent à la terrasse du café ; Núria et Lisa arrivent du marché. Puis Bernat, le serveur, vient prendre la commande : il vouvoie ses clients. Lis une première fois pour répondre à une seule question : qui prend quoi ?',
					scenes: [
						{
							title: 'Karim e Yasmine',
							subtitle: '(à la terrasse ; ils se tutoient)',
							lines: [
								{ oc: 'Fa caud, uèi ! Ai set.', sound: 'fa CAOU, UÈÏ ! aï SÉT.', fr: 'Il fait chaud, aujourd’hui ! J’ai soif.' },
								{ oc: 'Ieu tanben ! Qué prenes ?', sound: 'YÉOU tam-BÉ ! ké PRÉ-nés ?', fr: 'Moi aussi ! Que prends-tu ?' },
								{ oc: 'Un cafè !', sound: 'un ca-FÈ !', fr: 'Un café !' },
								{ oc: 'Un cafè ? Fa caud !', sound: 'un ca-FÈ ? fa CAOU !', fr: 'Un café ? Il fait chaud !' },
								{ oc: 'Preni totjorn un cafè : lo matin, lo tantòst, lo ser…', sound: 'PRÉ-ni tout-DJOUR un ca-FÈ : lou ma-TI, lou tan-TÒST, lou SÉR…', fr: 'Je prends toujours un café : le matin, l’après-midi, le soir…' },
								{ oc: 'Ieu, preni un tè. E Núria ?', sound: 'YÉOU, PRÉ-ni un TÈ. é NOU-ria ?', fr: 'Moi, je prends un thé. Et Núria ?' },
								{ oc: 'Núria pren un suc de fruta. E Lisa… sabi pas !', sound: 'NOU-ria PRÉ(N) un SUC dé FRU-to. é LI-zo… SA-bi PAS !', fr: 'Núria prend un jus de fruit. Et Lisa… je ne sais pas !' }
							]
						},
						{
							title: 'Bernat e Karim',
							subtitle: '(Bernat, le serveur, vouvoie ses clients. Karim commande pour la table ; Lisa arrive juste à temps.)',
							lines: [
								{ oc: 'Bonjorn ! Qué volètz ?', sound: 'boun-DJOUR ! ké bou-LÈTS ?', fr: 'Bonjour ! Que voulez-vous ?' },
								{ oc: 'Per ieu, un cafè, se vos plai. Per Yasmine, un tè, e per Núria, un suc de fruta.', sound: 'pér YÉOU, un ca-FÈ, sé bous PLAÏ. pér yas-MI-ne, un TÈ, é pér NOU-ria, un SUC dé FRU-to.', fr: 'Pour moi, un café, s’il vous plaît. Pour Yasmine, un thé, et pour Núria, un jus de fruit.' },
								{ oc: 'Un cafè, un tè, un suc de fruta… Quicòm mai ?', sound: 'un ca-FÈ, un TÈ, un SUC dé FRU-to… ki-CÒM MAÏ ?', fr: 'Un café, un thé, un jus de fruit… Autre chose ?' },
								{ oc: 'Òc ! Per ieu, un veire d’aiga, se vos plai. Ai set !', sound: 'OK ! pér YÉOU, un BÉÏ-ré DAÏ-go, sé bous PLAÏ. aï SÉT !', fr: 'Oui ! Pour moi, un verre d’eau, s’il vous plaît. J’ai soif !' },
								{ oc: 'Vaquí !', sound: 'ba-KI !', fr: 'Voilà !' },
								{ oc: 'Mercés ! L’addicion, se vos plai.', sound: 'mér-SÉS ! la-di-SYOU, sé bous PLAÏ.', fr: 'Merci ! L’addition, s’il vous plaît.' },
								{ oc: 'Sièis euros.', sound: 'syèï-ZÉOU-rous.', fr: 'Six euros.' },
								{ oc: 'Vaquí. Mercés, Bernat !', sound: 'ba-KI. mér-SÉS, bér-NAT !', fr: 'Voilà. Merci, Bernat !' }
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
							q: 'Qui prend quoi ?',
							options: [
								'Karim un café, Yasmine un thé, Núria un jus de fruit, Lisa de l’eau',
								'Karim un thé, Yasmine un café, Núria de l’eau, Lisa un jus de fruit',
								'Karim un jus de fruit, Yasmine un thé, Núria un café, Lisa de l’eau'
							],
							correct: 0,
							choses: ['prene-singular', 'un-cafe', 'un-te', 'suc-de-fruta'],
							explain: 'Karim : *Per ieu, un cafè… Per Yasmine, un tè, e per Núria, un suc de fruta.* Lisa : *un veire d’aiga*.'
						},
						{
							q: 'Pourquoi Lisa demande-t-elle un verre d’eau ?',
							options: ['elle a soif', 'elle n’aime pas le café', 'c’est moins cher'],
							correct: 0,
							choses: ['ai-set', 'l-aiga'],
							explain: '*Ai set !* : j’ai soif ! Il fait chaud, et Lisa arrive à pied du marché.'
						},
						{
							q: 'Combien coûte la commande ?',
							options: ['six euros', 'sept euros', 'seize euros'],
							correct: 0,
							choses: ['l-addicion'],
							explain: '*Sièis euros* : six euros. Sept, c’est *sèt* ; seize, *setze*.'
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
					title: 'Le verbe prendre : qui prend ?',
					intro: 'Dans les deux scènes, un même verbe revient. Regarde sa fin.',
					items: [
						{
							q: '*Qué prenes ?* demande Yasmine. Elle parle à…',
							options: ['Karim : tu', 'elle-même : je', 'Núria, pas encore là : elle'],
							correct: 0,
							choses: ['prene-singular'],
							explain: '*prenes* : tu prends. Comme *comprenes* : tu comprends.'
						},
						{
							q: '*Preni un tè*, dit Yasmine. Qui prend un thé ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['prene-singular', 'un-te'],
							explain: '*-i* : je, comme *compreni*, *parli*. *Un tè* : un thé.'
						},
						{
							q: '*Núria pren un suc de fruta.* Ici, *pren* veut dire…',
							options: ['elle prend', 'je prends', 'prends !'],
							correct: 0,
							choses: ['prene-singular'],
							explain: '*pren* : il ou elle prend. Le même mot sert d’ordre : *Pren la carrièra…* (prends la rue…), au module 8.2.'
						},
						{
							q: 'Au café, pour commander pour toi, tu peux dire…',
							options: ['Per ieu, un cafè.', 'Per tu, un cafè.', 'Pren un cafè.'],
							correct: 0,
							oc: true,
							choses: ['per-ieu'],
							explain: '*Per ieu* : pour moi. *Per tu*, c’est « pour toi » ; *Pren un cafè*, « il prend un café », ou « prends un café ! ».'
						},
						{
							q: '*Un veire d’aiga*, demande Lisa. C’est…',
							options: ['un verre d’eau', 'un verre de vin', 'une bouteille d’eau'],
							correct: 0,
							choses: ['un-veire-de', 'l-aiga'],
							explain: '*un veire de…* : un verre de… Devant *aiga*, *de* devient *d’*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Le verbe prene (prendre), au singulier',
					intro: 'Il se conjugue comme *comprene*, que tu connais depuis l’unité 2 :',
					head: ['', '*prene*', 'ça sonne comme', 'comme *comprene*'],
					rows: [
						['je', '*preni*', '« PRÉ-ni »', '*compreni*'],
						['tu', '*prenes*', '« PRÉ-nés »', '*comprenes*'],
						['il, elle', '*pren*', '« PRÉ(N) »', '*compren*']
					],
					notes: [
						'*Pren !* sert aussi pour guider : *Pren la carrièra…* (prends la rue…), comme au module 8.2.',
						'Pour commander : *Per ieu, un cafè.* Ou bien *Preni un cafè.* Avec *se vos plai*, c’est plus poli.',
						'Le pluriel de *prene* viendra plus tard.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'prene-singular', oc: 'prene : preni · prenes · pren', sound: 'PRÉ-né : PRÉ-ni · PRÉ-nés · PRÉ(N)', fr: 'prendre : je prends · tu prends · il ou elle prend' },
						{ id: 'per-ieu', oc: 'Per ieu, …', sound: 'pér YÉOU', fr: 'pour moi, … (pour commander)' },
						{ id: 'un-cafe', oc: 'un cafè · lo cafè', sound: 'un ca-FÈ · lou ca-FÈ', fr: 'un café · le café (la boisson, et aussi le lieu)' },
						{ id: 'un-te', oc: 'un tè', sound: 'un TÈ', fr: 'un thé' },
						{ id: 'suc-de-fruta', oc: 'un suc de fruta', sound: 'un SUC dé FRU-to', fr: 'un jus de fruit' }
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
					title: 'À retenir : la soif, et l’addition',
					intro: 'Pour boire de l’eau, et pour payer.',
					items: [
						{ id: 'l-aiga', oc: 'l’aiga', sound: 'LAÏ-go', fr: 'l’eau' },
						{ id: 'un-veire-de', oc: 'un veire de…', sound: 'un BÉÏ-ré dé', fr: 'un verre de… (*un veire d’aiga*)' },
						{ id: 'ai-set', oc: 'Ai set.', sound: 'aï SÉT', fr: 'j’ai soif. (*set*, la soif, ne se dit pas comme *sèt*, sept)' },
						{ id: 'l-addicion', oc: 'L’addicion, se vos plai.', sound: 'la-di-SYOU, sé bous PLAÏ', fr: 'l’addition, s’il vous plaît.' }
					]
				},
				// jeu prévu par la carte : dialogue à choix avec le serveur. Il existe
				// déjà : `causida` (rien à coder).
				{
					type: 'causida',
					title: 'Au café, avec Bernat',
					intro:
						'Tu es à la terrasse avec Núria. Bernat arrive : choisis chaque réplique. Si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Bernat',
					tours: [
						{
							ditz: 'Bonjorn ! Qué volètz ?',
							options: [
								{ oc: 'Bonjorn ! Per ieu, un cafè, se vos plai.', bon: true },
								{ oc: 'Bonjorn ! Per tu, un cafè, se te plai.', reaccion: 'Bernat sourit, un peu surpris : un café pour lui ? Il est de service !' },
								{ oc: 'Bonjorn ! Pren un cafè.', reaccion: 'Bernat lève un sourcil : « prends un café », à lui ? Il attend ta commande.' }
							],
							choses: ['per-ieu', 'un-cafe'],
							explain: '*Per ieu, un cafè* : pour moi, un café. Et *se vos plai* : Bernat, on le vouvoie.'
						},
						{
							situacion: 'Bernat se tourne vers Núria. Demande-lui ce qu’elle prend.',
							options: [
								{ oc: 'E tu, Núria, qué prenes ?', bon: true },
								{ oc: 'E tu, Núria, qué preni ?', reaccion: 'Núria rit : tu lui demandes ce que toi, tu prends ? Elle n’en sait rien !' },
								{ oc: 'E tu, Núria, qué pren ?', reaccion: 'Núria regarde autour d’elle : qui ça, « il » ? C’est à elle que tu parles.' }
							],
							choses: ['prene-singular'],
							explain: '*prenes* : tu prends. *Qué prenes ?* : que prends-tu ?'
						},
						{
							situacion: 'Núria te répond : *Un suc de fruta !* Dis-le à Bernat.',
							options: [
								{ oc: 'Ela pren un suc de fruta.', bon: true },
								{ oc: 'Ela preni un suc de fruta.', reaccion: 'Bernat hésite : « elle », puis « je prends » ? Il regarde Núria, puis toi : qui veut le jus ?' },
								{ oc: 'Ela pren un veire de vin.', reaccion: 'Núria ouvre de grands yeux : du vin, à midi ? Elle voulait un jus de fruit !' }
							],
							choses: ['prene-singular', 'suc-de-fruta'],
							explain: '*pren* : il ou elle prend. *Ela pren…* : elle prend…'
						},
						{
							situacion: 'Il fait chaud, et tu as soif.',
							ditz: 'Un cafè, un suc de fruta… Quicòm mai ?',
							options: [
								{ oc: 'Òc, un veire d’aiga, se vos plai : ai set !', bon: true },
								{ oc: 'Òc, un veire de lach, se vos plai : ai set !', reaccion: 'Bernat apporte un grand verre de lait. Contre la soif, un peu étrange… mais il ne discute pas.' },
								{ oc: 'Òc, un veire d’aiga, se vos plai : ai sèt !', reaccion: 'Bernat compte sur ses doigts : sept ? Sept verres d’eau ? Il attend la suite.' }
							],
							choses: ['un-veire-de', 'l-aiga', 'ai-set'],
							explain: '*Ai set* : j’ai soif, « aï SÉT ». *Sèt*, avec *è*, c’est sept.'
						},
						{
							situacion: 'Bernat pose tout sur la table.',
							ditz: 'Vaquí !',
							options: [
								{ oc: 'Mercés !', bon: true },
								{ oc: 'De res !', reaccion: 'Bernat rit : *De res*, c’est à lui de le dire ! Toi, tu remercies.' },
								{ oc: 'Vaquí !', reaccion: 'Bernat cligne de l’œil : tu lui renvoies son *Vaquí* ? Il attendait un merci.' }
							],
							choses: ['merce', 'de-res'],
							explain: '*Vaquí !* : voilà ! Tu réponds *Mercés !*, et lui, *De res*.'
						},
						{
							situacion: 'Plus tard, c’est l’heure de payer. Appelle Bernat.',
							options: [
								{ oc: 'L’addicion, se vos plai !', bon: true },
								{ oc: 'Quant còsta, lo cafè ?', reaccion: 'Bernat montre l’ardoise au mur : les prix y sont. Mais toi, tu veux payer : demande-lui l’addition.' },
								{ oc: 'Un cafè, se vos plai !', reaccion: 'Bernat apporte… un deuxième café. Tu voulais payer, pas recommencer !' }
							],
							choses: ['l-addicion'],
							explain: '*L’addicion, se vos plai* : l’addition, s’il vous plaît.'
						},
						{
							ditz: 'Cinc euros.',
							options: [
								{ oc: 'Vaquí. Mercés, Bernat ! Al còp que ven !', bon: true },
								{ oc: 'Vaquí. Mercés, Bernat ! A deman !', bon: true },
								{ oc: 'Vaquí. Mercés, Bernat ! Benvengut !', reaccion: 'Bernat rit : « bienvenu », à lui ? C’est toi qui t’en vas !' }
							],
							choses: ['al-cop-que-ven', 'euro-centim'],
							explain: '*Cinc euros* : cinq euros. *Al còp que ven !* : à la prochaine ! *A deman*, si tu reviens demain.'
						}
					],
					fin: 'Commande passée, addition payée : le café de Bernat t’attend quand tu veux.'
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
							consigne: 'Demande à ton amie ce qu’elle prend.',
							answers: ['Qué prenes ?', 'E tu, qué prenes ?'],
							choses: ['prene-singular'],
							explain: '*prenes* : tu prends.'
						},
						{
							consigne: 'Commande un thé, poliment.',
							answers: ['Per ieu, un tè, se vos plai.', 'Un tè, se vos plai.', 'Preni un tè, se vos plai.', 'Volriái un tè, se vos plai.', 'Per ieu, un tè.'],
							choses: ['per-ieu', 'un-te'],
							explain: '*Per ieu, un tè* : pour moi, un thé. *Volriái…* (je voudrais), c’est poli aussi.'
						},
						{
							consigne: 'Dis que tu as soif, et demande un verre d’eau.',
							answers: ['Ai set : un veire d’aiga, se vos plai.', 'Ai set. Per ieu, un veire d’aiga, se vos plai.', 'Ai set. Volriái un veire d’aiga, se vos plai.', 'Ai set : un veire d’aiga.'],
							choses: ['ai-set', 'un-veire-de', 'l-aiga'],
							explain: '*Ai set* « aï SÉT » : j’ai soif. *Un veire d’aiga* : un verre d’eau.'
						},
						{
							consigne: 'Ton amie prend un jus de fruit : dis-le au serveur.',
							answers: ['Ela pren un suc de fruta.', 'Ela pren un suc de fruta, se vos plai.', 'Per ela, un suc de fruta.', 'Per ela, un suc de fruta, se vos plai.'],
							choses: ['prene-singular', 'suc-de-fruta'],
							explain: '*pren* : elle prend. Ou bien : *Per ela, …*'
						},
						{
							consigne: 'Demande l’addition.',
							answers: ['L’addicion, se vos plai.'],
							choses: ['l-addicion'],
							explain: 'Au serveur, on dit *vos* : *se vos plai*.'
						},
						{
							consigne: 'Et toi, le matin, que prends-tu ? Commence par *Lo matin, preni…*',
							debut: ['Lo matin, preni', 'Preni', 'Lo matin, ieu, preni', 'Ieu, lo matin, preni'],
							choses: ['prene-singular'],
							explain: 'Par exemple : *Lo matin, preni un cafè amb de lach.* · *Lo matin, preni un tè.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Pour moi, un café ; pour elle, un thé.',
							tiles: ['Per ieu,', 'un cafè ;', 'per ela,', 'un tè.'],
							choses: ['per-ieu', 'un-cafe', 'un-te'],
							explain: '*Per ieu*, *per ela* : pour moi, pour elle.'
						},
						{
							prompt: 'Karim prend toujours un café.',
							tiles: ['Karim', 'pren', 'totjorn', 'un cafè.'],
							choses: ['prene-singular', 'un-cafe'],
							explain: '*totjorn* : toujours, juste après le verbe.'
						},
						{
							prompt: 'J’ai soif : un verre d’eau, s’il vous plaît.',
							tiles: ['Ai set :', 'un veire', 'd’aiga,', 'se vos plai.'],
							choses: ['ai-set', 'un-veire-de', 'l-aiga'],
							explain: '*un veire d’aiga* : un verre d’eau. *De* devient *d’* devant *aiga*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : commande pour quelqu’un',
					intro:
						'Pense à une personne que tu connais bien : au café, que prend-elle ? Commande pour elle et pour toi, puis compare au modèle.',
					items: [
						{
							q: 'Ta mère, un ami, ta collègue…',
							a: 'Par exemple : *Per ieu, un tè, se vos plai. E per mon amic, un cafè : pren totjorn un cafè !*'
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
					title: 'Le son du jour : é et è, revus',
					paragraphs: [
						'Sans accent, ou avec un accent aigu, le *e* est fermé : *set* « SÉT » (la soif), *prenes* « PRÉ-nés », *veire* « BÉÏ-ré ».',
						'Avec un accent grave, il est ouvert : *sèt* « SÈT » (sept), *cafè* « ca-FÈ », *tè* « TÈ ».',
						'Au café, ça compte : *Ai set*, j’ai soif ; *Ai sèt*, j’en ai sept !'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« aï SÉT », au café, ça veut dire…',
							options: ['j’ai soif', 'j’en ai sept'],
							correct: 0,
							noShuffle: true,
							explain: '« SÉT », fermé : *set*, la soif. Sept, c’est *sèt*, « SÈT », ouvert.'
						},
						{
							q: '*cafè* se dit…',
							options: ['ca-FÈ', 'ca-FÉ'],
							correct: 0,
							noShuffle: true,
							explain: '« ca-FÉ », c’est la lecture à la française. L’accent grave ouvre le *è* : « ca-FÈ ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Ai set ! Per ieu, un tè ; per tu, un cafè.*',
							a: '« aï SÉT ! pér YÉOU, un TÈ ; pér TU, un ca-FÈ » : un *é* fermé, puis deux *è* ouverts.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : du reggae en occitan',
					glosa: { 'parla patois': 'parle patois (titre de l’album et de la chanson)' },
					// Chanson donnée par son lien seulement (cursus/cultura-A1.md, unité 8).
					lien: { href: 'https://massiliasoundsystem.bandcamp.com/track/parla-patois-4', texte: 'Écouter Parla patois (Massilia Sound System) sur la page du groupe' },
					paragraphs: [
						'À Marseille, le groupe Massilia Sound System chante en occitan sur des rythmes de reggae. Il a choisi l’occitan en écoutant des Jamaïcains chanter dans leur langue à eux, le patois jamaïcain.',
						'Son premier album, en 1992, porte le nom de sa chanson titre : *Parla patois*. Dans le titre, tu reconnais *parla*, du verbe *parlar*.',
						'Source : Wikipédia (en anglais), article « Massilia Sound System ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'commander au café pour moi : *Per ieu, un cafè*',
						'demander à quelqu’un ce qu’il prend : *Qué prenes ?*',
						'dire que j’ai soif, et demander un verre d’eau',
						'demander l’addition',
						'entendre *set* (la soif) et *sèt* (sept)'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant commander au café, et demander aux autres ce qu’ils prennent.',
						'Si tu en as envie : la prochaine fois que tu bois un café avec quelqu’un, une amie, ton frère, un collègue, demande-lui *Qué prenes ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
