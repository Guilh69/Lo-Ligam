// Module 5.3 · A1 · « Qué vòls ? » : unité 5 (Al mercat), rédigé par Claude
// le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes ;
// règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : voler et poder au singulier (vòli, vòls, vòl ; pòdi, pòdes,
// pòt) ; Volriái… (je voudrais) en bloc ; m'agrada, m'agradan devant un
// pluriel. À gloser en passant : crompar (infinitif seulement), fòrça.
// Scène : au marché du dimanche, Karim achète le fromage de Mameta chez Ramon,
// avec sa petite sœur Inès (douze ans). Ramon vouvoie Karim et tutoie Inès.
// Jeu du jour : dialogue à choix (causida) avec Ramon ; tu es le client.
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique ; Ròcafòrt, crompar,
// fòrça le 2026-11-02), à valider par Romain.

export const modul53 = {
	id: 'modul-5-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '5-3',
	unitat: 'Unitat 5 · Al mercat',
	nivel: 'A1 · Modul 5.3',
	oc: 'Qué vòls ?',
	fr: 'Que veux-tu ? Demander poliment, dire ce qu’on aime',
	cando:
		'Je peux dire ce que je veux, poliment, demander ce que l’autre veut, dire ce que j’aime ou pas, et finir mes courses : *Volriái…, se vos plai*, *Qué vòls ?*, *M’agrada…*, *Es tot*.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Inès', 'Ramon', 'Yasmine', 'Lisa'],
	notesRelecture: [
		'Inès dit d’abord *Vòli d’olivas !*, puis se reprend : *Volriái d’olivas, se vos plai !* Ce petit moment d’apprentissage te va ?',
		'Ramon vouvoie Karim, vingt ans (*Qué volètz ?*), et tutoie Inès, douze ans (*E tu, qué vòls ?*) : c’est bien l’usage ?',
		'*Ai, ai, ai !* de Ramon, le fromager vexé qu’Inès n’aime pas le fromage : l’interjection te va ?',
		'Dans le jeu, *Adieu !* à Ramon est refusé (on le vouvoie : *Adieu-siatz !*). C’est bien ton usage au marché ?',
		'*crompar* (acheter) et *fòrça* (beaucoup) sont glosés en passant, comme le prévoit le lexique : d’accord ?',
		'Note de culture : le roquefort, avec le nom occitan du village, *Ròcafòrt* (accepté par l’API). La forme te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 5.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '« soixante » :',
							options: ['seissanta', 'sièis', 'setanta'],
							correct: 0,
							oc: true,
							choses: ['nombre-60'],
							explain: '*seissanta* : 60. *sièis*, c’est 6 ; *setanta*, 70.'
						},
						{
							q: 'Tu tends ton billet au marchand. Tu dis…',
							options: ['Vaquí !', 'Quant fa ?', 'Es car !'],
							correct: 0,
							oc: true,
							choses: ['vaqui'],
							explain: '*Vaquí !* : voilà, en tendant quelque chose. *Quant fa ?*, c’est avant, pour le prix.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Demande le prix des œufs.',
							answers: ['Quant còstan los uòus ?', 'Los uòus, quant còstan ?'],
							choses: ['quant-costa', 'l-uou'],
							explain: 'Plusieurs œufs : *còstan*.'
						},
						{
							consigne: 'Écris en lettres : 50 €',
							answers: ['cinquanta euros'],
							choses: ['nombre-50', 'euro-centim'],
							explain: '*cinquanta*, comme *cinc*.'
						},
						{
							consigne: 'Écris en lettres : 25',
							answers: ['vint-e-cinc'],
							choses: ['vint-e-un'],
							explain: '*vint-e-cinc* : avec *e*, comme le prix du fromage de Ramon.'
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
					title: 'Le fromage de Mameta',
					intro:
						'Dimanche, au marché du village. Karim vient acheter le fromage de Mameta, sa grand-mère, avec sa petite sœur Inès, douze ans. Ils s’arrêtent à l’étal de Ramon, le fromager. Lis une première fois pour répondre à une seule question : qui n’aime pas le fromage ?',
					scenes: [
						{
							title: 'Karim e Inès',
							subtitle: '(en arrivant au marché)',
							lines: [
								{ oc: 'Karim, qué vòls crompar ?', sound: 'ka-RIM, ké BÒLS croum-PA ?', fr: 'Karim, qu’est-ce que tu veux acheter ?' },
								{ oc: 'Lo formatge de Mameta. E tu ?', sound: 'lou four-MA-djé dé ma-MÉ-to. é TU ?', fr: 'Le fromage de Mamie. Et toi ?' },
								{ oc: 'Ieu, vòli d’olivas ! Pòdi ?', sound: 'YÉOU, BÒ-li dou-LI-bos ! PÒ-di ?', fr: 'Moi, je veux des olives ! Je peux ?' },
								{ oc: 'Òc, pòdes.', sound: 'OK, PÒ-dés.', fr: 'Oui, tu peux.' }
							]
						},
						{
							title: 'Karim, Inès e Ramon',
							subtitle: '(à l’étal de Ramon : Karim le vouvoie)',
							lines: [
								{ oc: 'Bonjorn ! Qué volètz ?', sound: 'boun-DJOUR ! ké bou-LÈTS ?', fr: 'Bonjour ! Que voulez-vous ?' },
								{ oc: 'Volriái un pauc de formatge, se vos plai.', sound: 'boul-RYOÏ un PAOUK dé four-MA-djé, sé bous PLAÏ.', fr: 'Je voudrais un peu de fromage, s’il vous plaît.' },
								{ oc: 'Vaquí. E tu, qué vòls ?', sound: 'ba-KI. é TU, ké BÒLS ?', fr: 'Voilà. Et toi, que veux-tu ?' },
								{ oc: 'Vòli d’olivas… Volriái d’olivas, se vos plai !', sound: 'BÒ-li dou-LI-bos… boul-RYOÏ dou-LI-bos, sé bous PLAÏ !', fr: 'Je veux des olives… Je voudrais des olives, s’il vous plaît !' },
								{ oc: 'T’agradan, las olivas ?', sound: 'ta-GRA-don, la-zou-LI-bos ?', fr: 'Tu les aimes, les olives ?' },
								{ oc: 'M’agradan fòrça ! Mas lo formatge… non m’agrada pas.', sound: 'ma-GRA-don FÒR-so ! mas lou four-MA-djé… nou ma-GRA-do PAS.', fr: 'Je les aime beaucoup ! Mais le fromage… je n’aime pas.' },
								{ oc: 'Ai, ai, ai ! Quicòm mai ?', sound: 'AÏ, AÏ, AÏ ! ki-CÒM MAÏ ?', fr: 'Aïe, aïe, aïe ! Autre chose ?' },
								{ oc: 'Es tot. Quant fa ?', sound: 'és TOUT. KAN FA ?', fr: 'C’est tout. Ça fait combien ?' },
								{ oc: 'Vint euros.', sound: 'BIN ÉOU-rous.', fr: 'Vingt euros.' },
								{ oc: 'Vaquí. Mercés !', sound: 'ba-KI. mér-SÉS !', fr: 'Voilà. Merci !' },
								{ oc: 'De res ! Adieu-siatz !', sound: 'dé RÉS ! a-di-SSIATS !', fr: 'De rien ! Au revoir !' }
							]
						}
					],
					glossary: [
						{ oc: 'crompar', sound: 'croum-PA', fr: 'acheter' },
						{ oc: 'fòrça', sound: 'FÒR-so', fr: 'beaucoup' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui n’aime pas le fromage ?',
							options: ['Inès', 'Karim', 'Ramon'],
							correct: 0,
							choses: ['m-agrada', 'lo-formatge'],
							explain: 'Inès : *Lo formatge… non m’agrada pas.* Et Ramon, le fromager : *Ai, ai, ai !*'
						},
						{
							q: 'Inès dit d’abord *Vòli d’olivas !* Puis elle se reprend, plus poliment :',
							options: ['Volriái d’olivas, se vos plai !', 'Qué vòls ?', 'Quicòm mai ?'],
							correct: 0,
							oc: true,
							choses: ['volriai', 'se-vos-plai'],
							explain: '*Volriái…, se vos plai* : plus poli, pour un monsieur qu’on vouvoie.'
						},
						{
							q: 'Karim paie…',
							options: ['20 euros', '12 euros', '2 euros'],
							correct: 0,
							choses: ['nombre-20', 'vaqui'],
							explain: '*Vint euros*, et Karim tend l’argent : *Vaquí.* 12, c’est *dotze* ; 2, *dos*.'
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
					type: 'chunks',
					title: 'À retenir (1/2)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'que-vols', oc: 'Qué vòls ? · Qué volètz ?', sound: 'ké BÒLS · ké bou-LÈTS', fr: 'que veux-tu ? · que voulez-vous ?' },
						{ id: 'voler-singular', oc: 'voler : vòli · vòls · vòl', sound: 'bou-LÉ : BÒ-li · BÒLS · BÒL', fr: 'vouloir : je veux · tu veux · il ou elle veut' },
						{ id: 'volriai', oc: 'Volriái…', sound: 'boul-RYOÏ', fr: 'je voudrais… (plus poli que *Vòli*)' },
						{ id: 'se-vos-plai', oc: 'Se vos plai.', sound: 'sé bous PLAÏ', fr: 's’il vous plaît. (à un ami : *se te plai*)' }
					]
				},
				{
					type: 'qcm',
					title: 'Vouloir, poliment',
					intro: 'Regarde à qui l’on parle, puis la fin du verbe.',
					items: [
						{
							q: 'Ramon dit *Qué volètz ?* à Karim, et *Qué vòls ?* à Inès. Pourquoi ?',
							options: ['il vouvoie Karim, il tutoie Inès', 'Karim veut plus de choses', 'Inès est plus loin'],
							correct: 0,
							choses: ['que-vols'],
							explain: '*Qué vòls ?* : on tutoie (Inès a douze ans). *Qué volètz ?* : on vouvoie, comme *Cossí anatz ?*'
						},
						{
							q: 'À Yasmine, ton amie, tu demandes ce qu’elle veut :',
							options: ['Qué vòls ?', 'Qué volètz ?', 'Qué vòli ?'],
							correct: 0,
							oc: true,
							choses: ['que-vols'],
							explain: 'Une amie, on la tutoie : *Qué vòls ?* Et *vòli*, c’est « je veux ».'
						},
						{
							q: '« Je veux, tu veux, il ou elle veut » :',
							options: ['vòli · vòls · vòl', 'vòls · vòli · vòl', 'vòl · vòls · vòli'],
							correct: 0,
							oc: true,
							choses: ['voler-singular'],
							explain: '*vòli* : je, avec *-i*, comme *parli* ; *vòls* : tu, avec *-s*, comme *parlas* ; *vòl* : il ou elle.'
						},
						{
							q: 'Karim explique à Ramon : « Inès veut des olives. »',
							options: ['Inès vòl d’olivas.', 'Inès vòls d’olivas.', 'Inès vòli d’olivas.'],
							correct: 0,
							oc: true,
							choses: ['voler-singular', 'l-oliva'],
							explain: 'Inès, c’est « elle » : *vòl*.'
						},
						{
							q: 'Le plus poli, pour un monsieur que tu ne connais pas :',
							options: ['Volriái d’olivas.', 'Vòli d’olivas.', 'Vòls d’olivas.'],
							correct: 0,
							oc: true,
							choses: ['volriai'],
							explain: '*Volriái* : je voudrais. *Vòli* : je veux, plus direct. *Vòls* : tu veux.'
						},
						{
							q: '« S’il vous plaît », pour Ramon :',
							options: ['se vos plai', 'se te plai', 'mercés'],
							correct: 0,
							oc: true,
							choses: ['se-vos-plai'],
							explain: '*se te plai* pour une personne qu’on tutoie ; *se vos plai* pour Ramon.'
						}
					]
				},
				{
					type: 'table',
					title: 'Demander poliment',
					intro: 'Ce que tu as entendu chez Ramon, rangé.',
					head: ['', 'on tutoie', 'on vouvoie'],
					rows: [
						['saluer', '*Adieu !*', '*Bonjorn !*'],
						['demander ce que l’autre veut', '*Qué vòls ?*', '*Qué volètz ?*'],
						['dire ce qu’on veut', '*Vòli d’olivas.*', '*Volriái d’olivas.*'],
						['s’il te plaît, s’il vous plaît', '*se te plai*', '*se vos plai*'],
						['partir', '*Adieu !*', '*Adieu-siatz !*']
					],
					notes: [
						'*vòli* finit par *-i*, comme *parli* ; *vòls* et *vòl* sont plus courts que *parlas* et *parla*.',
						'*Volriái…* : je voudrais. Retiens-le en bloc : c’est la formule polie du marché, et elle va avec tout le monde.',
						'Après *vòli* ou *vòls*, le verbe suivant reste entier : *Qué vòls crompar ?* (que veux-tu acheter ?), comme *Pòdes repetir ?*'
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// jeu prévu par la carte : dialogue à choix avec le marchand (causida).
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 15,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (2/2)',
					intro: 'Encore quatre expressions : pouvoir, aimer, et finir tes courses.',
					items: [
						{ id: 'poder-singular', oc: 'poder : pòdi · pòdes · pòt', sound: 'pou-DÉ : PÒ-di · PÒ-dés · PÒT', fr: 'pouvoir : je peux · tu peux · il ou elle peut' },
						{ id: 'm-agrada', oc: 'M’agrada… · M’agradan… · T’agrada ?', sound: 'ma-GRA-do · ma-GRA-don · ta-GRA-do', fr: 'j’aime… (une chose) · j’aime… (plusieurs) · tu aimes ? (*Non m’agrada pas* : je n’aime pas)' },
						{ id: 'quicom-mai', oc: 'Quicòm mai ? · Es tot.', sound: 'ki-CÒM MAÏ · és TOUT', fr: 'autre chose ? · c’est tout.' },
						{ id: 'de-res', oc: 'Mercés ! · De res.', sound: 'mér-SÉS · dé RÉS', fr: 'merci ! · de rien.' }
					]
				},
				{
					type: 'qcm',
					title: 'Avant d’aller chez Ramon',
					intro: 'Un échauffement : une question à la fois.',
					items: [
						{
							q: '« J’aime les olives » :',
							options: ['M’agradan las olivas.', 'M’agrada las olivas.', 'T’agradan las olivas.'],
							correct: 0,
							oc: true,
							choses: ['m-agrada', 'l-oliva'],
							explain: '*M’agradan* : les olives sont plusieurs. *T’agradan ?*, c’est « tu aimes ? ».'
						},
						{
							q: '*T’agrada lo vin ?* On te demande…',
							options: ['si tu aimes le vin', 'si tu veux du vin', 'combien coûte le vin'],
							correct: 0,
							choses: ['m-agrada', 'lo-vin'],
							explain: '*T’agrada… ?* : tu aimes… ? Pour « veux-tu », ce serait *Vòls… ?*'
						},
						{
							q: 'Inès montre les olives à Karim : « Je peux ? »',
							options: ['Pòdi ?', 'Pòdes ?', 'Pòt ?'],
							correct: 0,
							oc: true,
							choses: ['poder-singular'],
							explain: '*pòdi* : je peux ; *pòdes* : tu peux ; *pòt* : il ou elle peut.'
						},
						{
							q: 'Ramon te demande *Quicòm mai ?* Tu as fini :',
							options: ['Es tot.', 'De res.', 'Se vos plai.'],
							correct: 0,
							oc: true,
							choses: ['quicom-mai'],
							explain: '*Es tot* : c’est tout. *De res* répond à un merci.'
						},
						{
							q: 'Ramon te dit *Mercés !* Tu réponds :',
							options: ['De res.', 'Es tot.', 'Quicòm mai ?'],
							correct: 0,
							oc: true,
							choses: ['de-res'],
							explain: '*De res* : de rien.'
						}
					]
				},
				{
					type: 'causida',
					title: 'Tes courses chez Ramon',
					intro:
						'À toi de faire tes courses. Ramon ne te connaît pas : tu le vouvoies. Choisis chaque réplique ; si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Ramon',
					tours: [
						{
							situacion: 'Dimanche matin. Tu arrives à l’étal de Ramon, le fromager.',
							ditz: 'Bonjorn ! Qué volètz ?',
							options: [
								{ oc: 'Bonjorn ! Volriái un pauc de formatge, se vos plai.', bon: true },
								{ oc: 'Vòli de formatge !', reaccion: 'Ramon lève un sourcil : un peu sec, sans bonjour ni s’il vous plaît. Essaie avec *Volriái…*' },
								{ oc: 'Adieu ! Qué vòls ?', reaccion: 'Ramon sourit sans répondre : tu viens de tutoyer un monsieur que tu ne connais pas, et de lui reprendre sa question !' }
							],
							choses: ['volriai', 'se-vos-plai', 'que-vols'],
							explain: '*Bonjorn*, puis *Volriái…, se vos plai* : la formule polie du marché.'
						},
						{
							ditz: 'Vaquí. Quicòm mai ?',
							options: [
								{ oc: 'Òc : d’olivas, se vos plai.', bon: true },
								{ oc: 'De res.', reaccion: 'Ramon te regarde, perplexe : *De res* répond à un merci. Lui te demandait si tu voulais autre chose.' },
								{ oc: 'Vint euros ? Es car !', reaccion: 'Ramon fronce les sourcils : il ne t’a encore donné aucun prix ! Il te demandait si tu voulais autre chose.' }
							],
							choses: ['quicom-mai', 'de-res'],
							explain: '*Quicòm mai ?* : autre chose ? Tu en veux encore : *Òc*, et ce que tu veux.'
						},
						{
							situacion: 'Ramon te fait goûter ses olives. Elles sont délicieuses : dis-lui que tu les aimes beaucoup.',
							options: [
								{ oc: 'M’agradan fòrça !', bon: true },
								{ oc: 'M’agrada fòrça !', reaccion: 'Ramon sourit, mais tu parles de ses olives : elles sont plusieurs. Devant un pluriel, *m’agradan*.' },
								{ oc: 'Non m’agradan pas.', reaccion: 'Ramon a l’air vexé : tu viens de dire que tu ne les aimes pas !' }
							],
							choses: ['m-agrada'],
							explain: '*M’agradan* devant plusieurs choses ; *fòrça* : beaucoup.'
						},
						{
							ditz: 'Mercés ! Quicòm mai ?',
							options: [
								{ oc: 'De res ! Es tot. Quant fa ?', bon: true },
								{ oc: 'Vòli de lach.', reaccion: 'Ramon ouvre les bras : il vend du fromage, pas du lait ! Si tu as fini, dis-le-lui.' },
								{ oc: 'Quicòm mai ?', reaccion: 'Ramon éclate de rire : c’est sa question à lui ! Si tu as fini, dis-le-lui.' }
							],
							choses: ['de-res', 'quicom-mai', 'far-singular'],
							explain: '*De res* répond à son merci ; *Es tot* : c’est tout ; *Quant fa ?* : combien ça fait ?'
						},
						{
							ditz: 'Vint-e-dos euros.',
							options: [
								{ oc: 'Vaquí. Mercés !', bon: true },
								{ oc: 'De res !', reaccion: 'Ramon attend, la main tendue : *De res* répond à un merci. Là, c’est à toi de payer.' },
								{ oc: 'Qué volètz ?', reaccion: 'Ramon rit : ce qu’il veut ? Vingt-deux euros, tout simplement !' }
							],
							choses: ['vaqui', 'vint-e-un'],
							explain: '*Vaquí* en tendant l’argent, puis un merci.'
						},
						{
							ditz: 'De res ! Adieu-siatz !',
							options: [
								{ oc: 'Adieu-siatz !', bon: true },
								{ oc: 'Adieu !', reaccion: 'Ramon sourit : *Adieu*, c’est pour quelqu’un qu’on tutoie. À lui, *Adieu-siatz !*' },
								{ oc: 'Se vos plai !', reaccion: 'Ramon te regarde, étonné : tu ne demandes plus rien. Il te dit au revoir : réponds-lui.' }
							],
							choses: ['adieu-siatz'],
							explain: '*Adieu-siatz !* : au revoir, en vouvoyant.'
						}
					],
					fin: 'Ramon glisse une olive de plus dans ton sac : *Al còp que ven !* Tu as fait tes courses en occitan, du bonjour à l’au revoir.'
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
							consigne: 'À l’étal de Ramon, demande poliment un peu de fromage.',
							answers: ['Volriái un pauc de formatge, se vos plai.', 'Bonjorn ! Volriái un pauc de formatge, se vos plai.'],
							choses: ['volriai', 'se-vos-plai'],
							explain: '*Volriái…, se vos plai* : poli, pour un monsieur qu’on vouvoie.'
						},
						{
							consigne: 'Demande à Lisa, ton amie, ce qu’elle veut.',
							answers: ['Qué vòls ?', 'Lisa, qué vòls ?'],
							choses: ['que-vols'],
							explain: 'Une amie, on la tutoie : *Qué vòls ?*'
						},
						{
							consigne: 'Tu montres les olives à un ami : je peux ?',
							answers: ['Pòdi ?'],
							choses: ['poder-singular'],
							explain: '*Pòdi ?* : je peux ? Et ton ami répond : *Òc, pòdes.*'
						},
						{
							consigne: 'Et toi, au marché, qu’est-ce que tu aimes ? Commence par *M’agrada…* ou *M’agradan…*',
							debut: ['M’agrada', 'M’agradan'],
							choses: ['m-agrada'],
							explain: 'Par exemple : *M’agradan las tomatas.* · *M’agrada lo formatge.* · *Non m’agrada pas lo lach.*'
						},
						{
							consigne: 'Ramon te demande *Quicòm mai ?* Réponds que c’est tout.',
							answers: ['Es tot.', 'Es tot, mercés.', 'Non, es tot.'],
							choses: ['quicom-mai'],
							explain: '*Es tot* : c’est tout.'
						},
						{
							consigne: 'Ramon te dit *Mercés !* Réponds-lui.',
							answers: ['De res.'],
							choses: ['de-res'],
							explain: '*De res* : de rien.'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Je voudrais des olives, s’il vous plaît.',
							tiles: ['Volriái', 'd’olivas,', 'se', 'vos', 'plai.'],
							choses: ['volriai', 'se-vos-plai'],
							explain: '*Volriái*, puis ce que tu veux, puis *se vos plai*.'
						},
						{
							prompt: 'Que veux-tu acheter ? Je veux du pain.',
							tiles: ['Qué', 'vòls', 'crompar ?', 'Vòli', 'de', 'pan.'],
							choses: ['que-vols', 'voler-singular'],
							explain: 'Après *vòls*, le verbe reste entier : *crompar*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Ta famille part au marché : dis ce que chacun veut, puis ce que tu veux, toi. Puis compare au modèle.',
					items: [
						{
							q: 'Ta sœur, ton père, ta grand-mère…',
							a: 'Par exemple : *Ma sòrre vòl de pomas e de formatge. Mon paire vòl de vin. E ieu ? Ieu, vòli d’olivas : m’agradan fòrça !*'
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
					title: 'Le son du jour : « o » ou « ou » ?',
					paragraphs: [
						'Avec l’accent grave, *ò* sonne « o », et la voix appuie dessus : *vòli* « BÒ-li », *pòdi* « PÒ-di ».',
						'Sans accent, *o* sonne « ou » : *voler* « bou-LÉ », *poder* « pou-DÉ », *volètz* « bou-LÈTS ».',
						'Dans le même verbe, le son change donc : tu l’as déjà entendu dans *còsta* « CÒS-to » et *sòrre* « SÒ-rré ».'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« BÒ-li » : c’est…',
							options: ['*vòli*, je veux', '*voler*, vouloir'],
							correct: 0,
							noShuffle: true,
							explain: '« BÒ-li », avec un « o » : *vòli*. *voler* se dit « bou-LÉ ».'
						},
						{
							q: 'Lequel veut dire « pouvoir » ?',
							options: ['pou-DÉ', 'PÒ-di'],
							correct: 0,
							noShuffle: true,
							explain: '« pou-DÉ » : *poder*, pouvoir. « PÒ-di », c’est *pòdi* : je peux.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Vòli, vòls, vòl : voler. Pòdi, pòdes, pòt : poder.*',
							a: '« BÒ-li, BÒLS, BÒL : bou-LÉ. PÒ-di, PÒ-dés, PÒT : pou-DÉ » : « o » sous l’accent, « ou » ailleurs.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : le roquefort',
					glosa: { 'ròcafòrt': 'Roquefort, le village et son fromage' },
					paragraphs: [
						'Le plus célèbre des fromages d’Occitanie vient de l’Aveyron : le roquefort, du village de Roquefort, *Ròcafòrt* en occitan. On le cite déjà au XIe siècle.',
						'En 1925, son nom devient la première appellation d’origine encadrée par l’État en France ; il est AOC depuis 1979, et AOP depuis 1996.',
						'Source : Wikipédia, article « Roquefort (fromage) ».'
					],
					lien: { href: 'https://fr.wikipedia.org/wiki/Roquefort_(fromage)', texte: 'Lire l’article (Wikipédia)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander poliment : *Volriái…, se vos plai*',
						'demander ce que l’autre veut : *Qué vòls ?*, *Qué volètz ?*',
						'dire ce que j’aime, ou pas : *M’agrada…*, *M’agradan…*, *Non m’agrada pas*',
						'finir mes courses : *Es tot*, *Mercés*, *De res*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander poliment ce que tu veux, et dire ce que tu aimes.',
						'Si tu en as envie : la prochaine fois que tu fais tes courses, dis *Volriái…* dans ta tête avant de demander, ou dis *M’agrada !* à une personne précise, à table. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
