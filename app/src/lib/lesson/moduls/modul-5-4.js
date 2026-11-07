// Module 5.4 · A1 · « Quicòm mai ? » : la tâche de l'unité 5 (Al mercat),
// rédigée par Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en
// six étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Rien de nouveau : on assemble 5.1 à 5.3 (et les salutations de l'unité 1)
// pour faire ses courses au marché, du bonjour à l'au revoir.
// Jeu du jour : dialogue à choix (causida) aux rôles inversés : tu tiens
// l'étal de Yasmine et tu sers Marià ; un tour « rester en occitan » (règle 13).
// Tâche : jouer le client (8 répliques). La carte prévoit un jeu de rôle
// enregistré ; version simple : on s'enregistre au téléphone (à coder :
// l'enregistrement dans la page).
// Fin du module : le mémo de l'unité, puis l'encart Alhors en Occitània
// (repris tel quel de cursus/alhors-en-occitania-A1.md).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique), à valider par Romain.

export const modul54 = {
	id: 'modul-5-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '5-4',
	unitat: 'Unitat 5 · Al mercat',
	nivel: 'A1 · Modul 5.4 · la tâche',
	oc: 'Quicòm mai ?',
	fr: 'Autre chose ? Faire ses courses au marché, du bonjour à l’au revoir',
	cando:
		'Je peux faire mes courses au marché en occitan : saluer, demander poliment ce que je veux, demander le prix, payer et dire au revoir, en tutoyant ou en vouvoyant.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Yasmine', 'Ramon', 'Marià', 'Inès'],
	notesRelecture: [
		'L’intrus (étape 1) : quatre séries de quatre mots, faites avec les mots de l’unité. Chaque famille doit être nette et l’intrus plausible : dis si une série a deux réponses possibles.',
		'Titre du module : *Quicòm mai ?* (autre chose ?), comme le propose le lexique. Ça te va ?',
		'Le jeu inverse les rôles : tu tiens l’étal de Yasmine et tu sers Marià, avant la tâche où tu redeviens client. D’accord pour ce détour ?',
		'Tour « rester en occitan » : Marià passe au français ; la bonne réplique se débrouille avec les mots connus (*Òc ! Yasmine es d’aquí.*), car *Pòdes repetir* tutoie et le vouvoiement de *poder* n’est pas encore vu. Ça te va ?',
		'La tâche : huit répliques de client, chez Yasmine (on tutoie) ou chez Ramon (on vouvoie), à jouer, puis à enregistrer au téléphone. L’enregistrement dans la page reste à coder. D’accord ?',
		'La chanson de Nadau est en gascon (*marcat*, *entau*) : je la présente comme une chanson d’ailleurs en Occitanie. Ça te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 7,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 5.3',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '« Je voudrais… », poliment :',
							options: ['Volriái…', 'Vòli…', 'Vòls…'],
							correct: 0,
							oc: true,
							choses: ['volriai'],
							explain: '*Volriái…* : je voudrais. *Vòli* : je veux, plus direct ; *vòls* : tu veux.'
						},
						{
							q: 'Inès dit *Non m’agrada pas lo formatge.* Elle dit…',
							options: ['qu’elle n’aime pas le fromage', 'qu’elle veut du fromage', 'que le fromage est cher'],
							correct: 0,
							choses: ['m-agrada'],
							explain: '*Non m’agrada pas* : je n’aime pas. Vouloir, c’est *vòli* ; cher, *car*.'
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
							mots: ['la poma', 'la pera', 'lo rasim', 'la ceba'],
							intrus: 3,
							familha: 'des fruits',
							choses: ['la-poma', 'la-pera', 'lo-rasim', 'la-ceba'],
							explain: '*La ceba*, l’oignon, est un légume.'
						},
						{
							mots: ['lo lach', 'lo formatge', 'l’uòu', 'lo pan'],
							intrus: 3,
							familha: 'ça vient des bêtes',
							choses: ['lo-lach', 'lo-formatge', 'l-uou', 'lo-pan'],
							explain: '*Lo pan* vient du blé.'
						},
						{
							mots: ['seissanta', 'setanta', 'ochanta', 'setze'],
							intrus: 3,
							familha: '60, 70, 80',
							choses: ['nombre-60', 'nombre-70', 'nombre-80', 'nombre-16'],
							explain: '*Setze*, c’est 16.'
						},
						{
							mots: ['vòli', 'vòls', 'vòl', 'pòt'],
							intrus: 3,
							familha: 'le verbe *voler* : vouloir',
							choses: ['voler-singular', 'poder-singular'],
							explain: '*Pòt* vient de *poder* : « il ou elle peut ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Que voulez-vous ? (tu vouvoies)',
							answers: ['Qué volètz ?'],
							choses: ['que-vols'],
							explain: '*Qué volètz ?* : on vouvoie. À un ami : *Qué vòls ?*'
						},
						{
							consigne: 'Autre chose ? Non, c’est tout.',
							answers: ['Quicòm mai ? Non, es tot.', 'Quicòm mai ? Es tot.'],
							choses: ['quicom-mai'],
							explain: '*Quicòm mai ?* : autre chose ? *Es tot* : c’est tout.'
						},
						{
							consigne: 'Tu peux ? Oui, je peux.',
							answers: ['Pòdes ? Òc, pòdi.'],
							choses: ['poder-singular'],
							explain: '*pòdes* : tu peux ; *pòdi* : je peux.'
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
					title: 'Les courses de Núria',
					intro:
						'Dimanche, Núria fait ses courses de la semaine. D’abord chez Yasmine, son amie : elles se tutoient. Puis chez Ramon, qu’elle vouvoie. Lis une première fois pour répondre à une seule question : qu’est-ce que Núria achète chez Ramon ?',
					scenes: [
						{
							title: 'Núria e Yasmine',
							subtitle: '(elles se tutoient)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Cossí vas ?', sound: 'a-DIOU, yas-MI-ne ! cou-si BAS ?', fr: 'Salut, Yasmine ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! Qué vòls ?', sound: 'baou PLA, mér-SÉS ! ké BÒLS ?', fr: 'Je vais bien, merci ! Que veux-tu ?' },
								{ oc: 'Volriái un quilò de tomatas, se te plai.', sound: 'boul-RYOÏ un ki-LÒ dé tou-MA-tos, sé té PLAÏ.', fr: 'Je voudrais un kilo de tomates, s’il te plaît.' },
								{ oc: 'Vaquí. Quicòm mai ?', sound: 'ba-KI. ki-CÒM MAÏ ?', fr: 'Voilà. Autre chose ?' },
								{ oc: 'Es tot. Quant fa ?', sound: 'és TOUT. KAN FA ?', fr: 'C’est tout. Ça fait combien ?' },
								{ oc: 'Tres euros.', sound: 'tré-ZÉOU-rous.', fr: 'Trois euros.' },
								{ oc: 'Vaquí ! A lèu !', sound: 'ba-KI ! a LÈOU !', fr: 'Voilà ! À bientôt !' }
							]
						},
						{
							title: 'Núria e Ramon',
							subtitle: '(elle le vouvoie)',
							lines: [
								{ oc: 'Bonjorn ! Volriái un pauc de formatge, se vos plai.', sound: 'boun-DJOUR ! boul-RYOÏ un PAOUK dé four-MA-djé, sé bous PLAÏ.', fr: 'Bonjour ! Je voudrais un peu de fromage, s’il vous plaît.' },
								{ oc: 'Vaquí. Quicòm mai ?', sound: 'ba-KI. ki-CÒM MAÏ ?', fr: 'Voilà. Autre chose ?' },
								{ oc: 'Non, es tot. Quant fa ?', sound: 'NOU, és TOUT. KAN FA ?', fr: 'Non, c’est tout. Ça fait combien ?' },
								{ oc: 'Dotze euros.', sound: 'DOUT-sé ÉOU-rous.', fr: 'Douze euros.' },
								{ oc: 'Vaquí ! Es bon, lo formatge : m’agrada fòrça !', sound: 'ba-KI ! és BOU(N), lou four-MA-djé : ma-GRA-do FÒR-so !', fr: 'Voilà ! Il est bon, le fromage : je l’aime beaucoup !' },
								{ oc: 'Mercés ! Adieu-siatz, e bon dimenge !', sound: 'mér-SÉS ! a-di-SSIATS, é bou(n) di-MÉN-djé !', fr: 'Merci ! Au revoir, et bon dimanche !' },
								{ oc: 'Adieu-siatz !', sound: 'a-di-SSIATS !', fr: 'Au revoir !' }
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
							q: 'Qu’est-ce que Núria achète chez Ramon ?',
							options: ['du fromage', 'des olives', 'du vin'],
							correct: 0,
							choses: ['lo-formatge', 'volriai'],
							explain: '*Volriái un pauc de formatge, se vos plai.* Et elle l’aime beaucoup : *m’agrada fòrça !*'
						},
						{
							q: 'Chez Yasmine, Núria dit *se te plai* ; chez Ramon, *se vos plai*. Pourquoi ?',
							options: ['elle tutoie Yasmine, elle vouvoie Ramon', 'Ramon est plus loin', 'chez Ramon, elle achète plus'],
							correct: 0,
							choses: ['se-vos-plai', 'podes-repetir'],
							explain: '*se te plai* : on tutoie ; *se vos plai* : on vouvoie. De même, *Adieu !* pour Yasmine, *Adieu-siatz !* pour Ramon.'
						},
						{
							q: 'Chez Ramon, Núria paie…',
							options: ['12 euros', '2 euros', '20 euros'],
							correct: 0,
							choses: ['nombre-12', 'far-singular'],
							explain: '*Dotze euros* : 12. 2, c’est *dos* ; 20, *vint*.'
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
					title: 'Au marché, du bonjour à l’au revoir',
					intro: 'Ce que dit le client, ce que dit le marchand : chez Ramon, qu’on vouvoie.',
					head: ['', 'le client', 'le marchand'],
					rows: [
						['1. saluer', '*Bonjorn !*', '*Bonjorn ! Qué volètz ?*'],
						['2. demander', '*Volriái…, se vos plai.*', '*Vaquí.*'],
						['3. le prix', '*Quant còsta ?* · *Quant còstan ?*', '*Tres euros lo quilò.*'],
						['4. encore ?', '*Òc : d’olivas.* · *Es tot.*', '*Quicòm mai ?*'],
						['5. payer', '*Quant fa ?* · *Vaquí !*', '*Mercés !*'],
						['6. partir', '*Adieu-siatz !*', '*Adieu-siatz ! Al còp que ven !*']
					],
					notes: [
						'Chez Yasmine, qu’on tutoie : *Adieu !*, *Qué vòls ?*, *se te plai*.',
						'Tu n’as pas compris ? Pour rester en occitan avec quelqu’un qu’on tutoie : *Pòdes repetir, se te plai ?*'
					]
				},
				{
					type: 'qcm',
					title: 'Client ou marchand ?',
					intro: 'Qui dit quoi ? Une question à la fois.',
					items: [
						{
							q: '*Quicòm mai ?* Qui le dit ?',
							options: ['le marchand', 'le client', 'les deux'],
							correct: 0,
							choses: ['quicom-mai'],
							explain: '*Quicòm mai ?* : autre chose ? C’est la question du marchand.'
						},
						{
							q: '*Quant fa ?* Qui le dit ?',
							options: ['le client', 'le marchand', 'les deux'],
							correct: 0,
							choses: ['far-singular'],
							explain: '*Quant fa ?* : combien ça fait ? Le client, au moment de payer.'
						},
						{
							q: '*Qué volètz ?* Qui le dit ?',
							options: ['le marchand', 'le client', 'les deux'],
							correct: 0,
							choses: ['que-vols'],
							explain: '*Qué volètz ?* : que voulez-vous ? Le marchand, à un client qu’il vouvoie.'
						},
						{
							q: '*Volriái un pauc de formatge.* Qui le dit ?',
							options: ['le client', 'le marchand', 'les deux'],
							correct: 0,
							choses: ['volriai'],
							explain: '*Volriái…* : je voudrais. Le client.'
						},
						{
							q: '*Mercés !* Qui le dit ?',
							options: ['les deux', 'le client', 'le marchand'],
							correct: 0,
							choses: ['merce', 'de-res'],
							explain: 'Le client en payant, le marchand en recevant : au marché, on se remercie des deux côtés. Et l’autre répond *De res*.'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets la scène dans l’ordre',
					intro: 'Touche les répliques dans l’ordre.',
					items: [
						{
							prompt: 'Les courses de Núria chez Ramon, dans le désordre.',
							tiles: ['Bonjorn !', 'Volriái un pauc de formatge, se vos plai.', 'Non, es tot. Quant fa ?', 'Vaquí. Adieu-siatz !'],
							choses: ['bonjorn', 'volriai', 'quicom-mai', 'vaqui'],
							explain: 'Saluer, demander, finir, payer et partir.'
						}
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
					type: 'causida',
					title: 'Tu tiens l’étal de Yasmine',
					intro:
						'Changement de rôle : cette fois, c’est toi le marchand. Choisis chaque réplique ; si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Marià',
					tours: [
						{
							situacion:
								'Yasmine doit s’absenter dix minutes : elle te confie son étal. Arrive Marià, une dame que tu vouvoies, comme Loís au module 4.4.',
							ditz: 'Bonjorn !',
							options: [
								{ oc: 'Bonjorn ! Qué volètz ?', bon: true },
								{ oc: 'Adieu ! Qué vòls ?', reaccion: 'Marià sourit, un peu surprise : tu la tutoies ! À une dame que tu vouvoies, *Qué volètz ?*' },
								{ oc: 'Bonjorn ! Quant fa ?', reaccion: 'Marià rit : elle n’a encore rien acheté ! Demande-lui d’abord ce qu’elle veut.' }
							],
							choses: ['bonjorn', 'que-vols'],
							explain: '*Bonjorn ! Qué volètz ?* : le marchand salue, puis demande ce qu’on veut.'
						},
						{
							ditz: 'Volriái un quilò de tomatas, se vos plai. Quant còstan ?',
							options: [
								{ oc: 'Tres euros lo quilò.', bon: true },
								{ oc: 'Tres euros la tomata.', reaccion: 'Marià ouvre de grands yeux : trois euros la tomate ? Le prix de Yasmine, c’était trois euros le kilo.' },
								{ oc: 'Trenta euros lo quilò.', reaccion: 'Marià manque de s’étrangler : trente euros ! Le prix de Yasmine, c’était *tres euros*, trois.' }
							],
							choses: ['quant-costa', 'un-quilo-de', 'nombre-30'],
							explain: '*Tres euros lo quilò* : trois euros le kilo. *Trenta*, c’est 30.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Marià passe soudain au français, très vite : « Et les pommes, là, elles sont d’ici ? Parce qu’au supermarché, alors… »',
							options: [
								{ oc: 'Òc ! Yasmine es d’aquí.', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Marià continue en français, ravie… et l’étal passe au français. Réponds-lui en occitan, avec les mots que tu as : elle te suivra.' },
								{ oc: 'Non compreni pas.', reaccion: 'Marià répète tout en français, plus lentement. Tu avais pourtant compris l’essentiel : réponds-lui en occitan.' }
							],
							choses: ['es-de', 'soi-d-aqui'],
							explain: 'Avec les mots que tu as, tu restes en occitan : *Yasmine es d’aquí.* Et Marià repasse à l’occitan.'
						},
						{
							ditz: 'Plan ! Un quilò de pomas tanben, se vos plai.',
							options: [
								{ oc: 'Vaquí. Quicòm mai ?', bon: true },
								{ oc: 'De res. Adieu-siatz !', reaccion: 'Marià lève la main : elle n’a ni fini, ni payé ! Donne-lui ses pommes, et demande-lui si elle veut autre chose.' },
								{ oc: 'Vaquí. Qué vòls ?', reaccion: 'Marià fronce les sourcils : tu la tutoies, maintenant ? Et elle vient de te dire ce qu’elle veut !' }
							],
							choses: ['vaqui', 'quicom-mai'],
							explain: '*Vaquí* en tendant les pommes, puis *Quicòm mai ?* : autre chose ?'
						},
						{
							situacion: 'Chez Yasmine, les tomates coûtent trois euros le kilo, les pommes deux euros le kilo.',
							ditz: 'Es tot. Quant fa ?',
							options: [
								{ oc: 'Cinc euros.', bon: true },
								{ oc: 'Cinquanta euros.', reaccion: 'Marià éclate de rire : cinquante euros pour deux kilos de fruits et de légumes ? Compte encore : trois, et deux…' },
								{ oc: 'Quinze euros.', reaccion: 'Marià compte sur ses doigts : trois euros, et deux… ça ne fait pas quinze !' }
							],
							choses: ['far-singular', 'nombre-5', 'nombre-50'],
							explain: '*Tres e dos, cinc* : cinq euros. Attention : *cinc*, 5, et *cinquanta*, 50.'
						},
						{
							ditz: 'Vaquí dètz euros.',
							options: [
								{ oc: 'E vaquí cinc euros. Mercés !', bon: true },
								{ oc: 'E vaquí dètz euros. Mercés !', reaccion: 'Marià rit : tu lui rends tout son billet ? Elle t’a donné dix euros, pour cinq : rends-lui cinq.' },
								{ oc: 'De res !', reaccion: 'Marià attend sa monnaie, la main tendue : elle t’a donné dix euros, pour cinq.' }
							],
							choses: ['vaqui', 'merce', 'nombre-10'],
							explain: 'Dix euros pour cinq : tu lui rends *cinc euros*, et tu la remercies.'
						},
						{
							ditz: 'De res ! Adieu-siatz !',
							options: [
								{ oc: 'Adieu-siatz ! Al còp que ven !', bon: true },
								{ oc: 'De res !', reaccion: 'Marià te regarde, amusée : *De res*, elle vient de le dire. Dis-lui au revoir.' },
								{ oc: 'Adieu !', reaccion: 'Marià sourit : *Adieu*, c’est pour quelqu’un qu’on tutoie. À elle, *Adieu-siatz !*' }
							],
							choses: ['adieu-siatz', 'al-cop-que-ven'],
							explain: '*Adieu-siatz !* : au revoir, en vouvoyant. *Al còp que ven !* : à la prochaine !'
						}
					],
					fin: 'Yasmine revient : son étal a tenu sans elle, et en occitan ! Elle te glisse une salade dans les mains : *Mercés ! Al còp que ven !*'
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		// jeu prévu par la carte : jeu de rôle enregistré. Version simple : tu
		// écris tes huit répliques, tu les joues, puis tu t'enregistres au
		// téléphone (à coder : l'enregistrement dans la page).
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 12,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'La tâche de l’unité : tes courses au marché',
					paragraphs: [
						'Cette fois, c’est toi le client. Choisis ton étal : celui de Yasmine (fruits et légumes ; on se tutoie) ou celui de Ramon (fromage, olives ; on le vouvoie).',
						'Écris tes huit répliques ci-dessous, du bonjour à l’au revoir, puis joue la scène à voix haute.',
						'Choisis maintenant à qui tu la joueras pour de vrai : ton prof, au prochain cours en visio, ou une personne qui apprend l’occitan avec toi.'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris tes huit répliques)',
					intro: 'Une réplique à la fois. À la fin, la page les rassemble : c’est ta scène.',
					recap: 'Tes courses, à jouer à voix haute :',
					items: [
						{
							consigne: '1. Salue le marchand ou la marchande.',
							answers: ['Bonjorn !', 'Adieu !', 'Bonjorn, Ramon !', 'Adieu, Yasmine !', 'Adieu, Yasmine ! Cossí vas ?'],
							choses: ['bonjorn', 'adieu'],
							explain: '*Bonjorn* pour Ramon, qu’on vouvoie ; *Adieu* pour Yasmine.'
						},
						{
							consigne: '2. Demande poliment une première chose. Commence par *Volriái…*',
							debut: ['Volriái'],
							choses: ['volriai', 'se-vos-plai'],
							explain: 'Par exemple : *Volriái un quilò de tomatas, se te plai.* · *Volriái un pauc de formatge, se vos plai.*'
						},
						{
							consigne: '3. Demande son prix.',
							answers: ['Quant còsta ?', 'Quant còstan ?'],
							debut: ['Quant còsta', 'Quant còstan'],
							choses: ['quant-costa'],
							explain: '*Quant còsta ?* pour une chose, *Quant còstan ?* pour plusieurs : *Quant còstan las tomatas ?*'
						},
						{
							consigne: '4. On te demande *Quicòm mai ?* Demande une deuxième chose.',
							debut: ['Òc', 'Volriái'],
							choses: ['quicom-mai', 'volriai'],
							explain: 'Par exemple : *Òc : d’olivas, se vos plai.*'
						},
						{
							consigne: '5. Au passage, dis ce que tu aimes. Commence par *M’agrada…* ou *M’agradan…*',
							debut: ['M’agrada', 'M’agradan'],
							choses: ['m-agrada'],
							explain: 'Par exemple : *M’agradan fòrça, las olivas !* · *M’agrada lo formatge !*'
						},
						{
							consigne: '6. Tu as fini : dis-le, et demande combien ça fait.',
							answers: ['Es tot. Quant fa ?', 'Non, es tot. Quant fa ?', 'Es tot, mercés. Quant fa ?'],
							choses: ['quicom-mai', 'far-singular'],
							explain: '*Es tot* : c’est tout ; *Quant fa ?* : combien ça fait ?'
						},
						{
							consigne: '7. Tu paies, en tendant l’argent.',
							answers: ['Vaquí !', 'Vaquí.'],
							debut: ['Vaquí'],
							choses: ['vaqui'],
							explain: 'Par exemple : *Vaquí vint euros !*'
						},
						{
							consigne: '8. Remercie, et dis au revoir.',
							answers: [
								'Mercés ! Adieu-siatz !',
								'Mercés ! Adieu !',
								'Plan mercés ! Adieu-siatz !',
								'Plan mercés ! Adieu !',
								'Mercés ! Al còp que ven !',
								'Mercés ! A lèu !'
							],
							choses: ['merce', 'adieu-siatz'],
							explain: '*Adieu-siatz !* pour Ramon, *Adieu !* pour Yasmine.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde les courses d’Inès chez Ramon : cette fois, elle n’oublie rien.',
							a: '*Bonjorn ! Volriái d’olivas, se vos plai. Quant còstan ? … Òc : lo formatge de Mameta, se vos plai. M’agradan fòrça, las olivas ! Es tot. Quant fa ? Vaquí ! Mercés ! Adieu-siatz !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'huit répliques, du bonjour à l’au revoir',
						'*Volriái…*, avec *se vos plai* (ou *se te plai*, chez Yasmine)',
						'le bon registre : *Bonjorn* et *Adieu-siatz* pour Ramon ; *Adieu* pour Yasmine',
						'*còsta* pour une chose, *còstan* pour plusieurs ; de même *m’agrada*, *m’agradan*',
						'la prononciation : le *-as* final « os » (*pomas*), et « ou » dans *volriái*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Redis-le sans regarder',
					paragraphs: [
						'Cache l’écran, et joue tes courses d’une traite, à voix haute. Un mot oublié ? Regarde, puis recommence depuis le début.',
						'Puis enregistre-toi avec ton téléphone, et réécoute-toi demain : tu entendras ce qui sonne déjà juste.'
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 7,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Les trois sons de l’unité',
					paragraphs: [
						'Le *-as* final sonne « os » : *pomas* « POU-mos », *tomatas* « tou-MA-tos » (module 5.1).',
						'Les dizaines finissent par un « o » léger : *tres* « TRÉS », mais *trenta* « TRÉN-to » (module 5.2).',
						'Avec l’accent, *ò* sonne « o » ; sans accent, *o* sonne « ou » : *vòli* « BÒ-li », *voler* « bou-LÉ » (module 5.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« POU-mos » : c’est…',
							options: ['*pomas*, des pommes', '*poma*, une pomme'],
							correct: 0,
							noShuffle: true,
							explain: 'Le « os » final : le pluriel, *pomas*. Une pomme, *poma*, se dit « POU-mo ».'
						},
						{
							q: 'Le marchand dit « ka-RAN-to euros » : tu paies…',
							options: ['40 euros', '4 euros'],
							correct: 0,
							noShuffle: true,
							explain: '« ka-RAN-to », avec son « o » léger : *quaranta*, 40. 4, *quatre*, se dit « KA-tré ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Volriái tres pomas e trenta olivas, se vos plai.*',
							a: '« boul-RYOÏ TRÉS POU-mos é TRÉN-to ou-LI-bos, sé bous PLAÏ » : les trois sons de l’unité dans une seule phrase.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : une chanson pour aller au marché',
					glosa: { 'jo me’n vau entau marcat': 'je m’en vais au marché (gascon)', entau: 'au, vers le (gascon)' },
					paragraphs: [
						'Nadau, groupe du Béarn, chante *Jo me’n vau entau marcat* (je m’en vais au marché), sur son disque pour enfants « Plumalhon » (1998). Les phrases sont courtes : écoute-la une fois, sans chercher à tout comprendre.',
						'C’est du gascon, l’occitan de Gascogne et du Béarn : *marcat*, comme chez Mistral, quand ton occitan dit *mercat*. Tu retrouves le gascon juste en dessous, dans l’encart « Ailleurs en Occitanie ».',
						'Source : MusicBrainz, et Deezer (sa date, 2018, est celle d’une remise en ligne).'
					],
					lien: { href: 'https://www.deezer.com/track/546620902', texte: 'Écouter la chanson (Deezer)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 5 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'nommer ce qu’on trouve au marché, et dire combien j’en veux',
						'compter de vingt à cent, demander un prix et payer',
						'demander poliment, et dire ce que j’aime',
						'faire mes courses en occitan, du bonjour à l’au revoir'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant faire tes courses en occitan, du bonjour à l’au revoir.',
						'Si tu en as envie : au marché ou chez un commerçant, dis au moins *Bonjorn !* et *Mercés !* en occitan ; ou joue ta scène avec ton prof, au prochain cours en visio. Quand ? Où ? Choisis-le maintenant. Ensuite vient l’unité 6 : une journée, du matin au soir.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 5 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['demander ce qu’il y a', '*Qué i a al mercat ?*'],
						['dire combien tu en veux', '*un quilò de pomas* · *un pauc de formatge*'],
						['demander un prix', '*Quant còsta ?* · *Quant còstan ?*'],
						['demander poliment', '*Volriái…, se vos plai.*'],
						['dire ce que tu aimes', '*M’agrada…* · *M’agradan…* · *Non m’agrada pas.*'],
						['finir et payer', '*Es tot. Quant fa ?* · *Vaquí !*']
					]
				},
				{
					type: 'table',
					title: 'Mémo : les dizaines',
					head: ['', 'tu dis', 'comme'],
					rows: [
						['20', '*vint*', ''],
						['30', '*trenta*', '*tres*'],
						['40', '*quaranta*', '*quatre*'],
						['50', '*cinquanta*', '*cinc*'],
						['60', '*seissanta*', '*sièis*'],
						['70', '*setanta*', '*sèt*'],
						['80', '*ochanta*', '*uèch*'],
						['90', '*nonanta*', '*nòu*'],
						['100', '*cent*', '']
					],
					notes: ['De 21 à 29, avec *e* : *vint-e-un*, *vint-e-dos*… *vint-e-nòu*.']
				},
				{
					type: 'table',
					title: 'Mémo : deux verbes au singulier',
					head: ['', '*voler*', '*poder*'],
					rows: [
						['je', '*vòli*', '*pòdi*'],
						['tu', '*vòls*', '*pòdes*'],
						['il, elle', '*vòl*', '*pòt*']
					],
					notes: ['Pour vouvoyer : *Qué volètz ?* Et pour demander poliment : *Volriái…*']
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'que veux-tu ?', 'le fromage', 's’il vous plaît'],
					rows: [
						['languedocien (ton cours)', '*Qué vòls ?*', '*lo formatge*', '*se vos plai*'],
						['gascon', '*Que vòs ?*', '*lo hromatge*', '*en v’ac pregar*'],
						['provençal', '*Qué vòles ?*', '*lo fromatge*', '*se vos plai*'],
						['limousin', '*Qué vòles ?*', '*lo fromatge*', ''], // « s’il vous plaît » : pas de source sûre
						['auvergnat', '*Da que vòles ?*', '*lo fromatge* · *la toma*', '*si-vos-plai*'],
						['vivaro-alpin', '', '*lo fromatge*', '*si vos plai*'] // « que veux-tu ? » : pas de source sûre
					],
					notes: [
						'« Tu veux » : *vòls* chez toi, *vòs* en gascon, *vòles* en provençal, en limousin et en auvergnat.',
						'En gascon, le *f* devient *h* ici aussi : *lo hromatge*. Ailleurs, surtout *fromatge* ; en auvergnat, aussi *la toma*.',
						'Pour « s’il vous plaît », le gascon a sa propre formule : *en v’ac pregar*. En auvergnat et en vivaro-alpin : *si vos plai*.',
						'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
					],
					glosa: {
						'que vòs': 'que veux-tu ? (gascon)',
						'qué vòles': 'que veux-tu ?',
						'da que vòles': 'que veux-tu ? (auvergnat)',
						'lo hromatge': 'le fromage (gascon)',
						'lo fromatge': 'le fromage',
						'la toma': 'le fromage, la tomme (auvergnat)',
						'en v’ac pregar': 's’il vous plaît (gascon)',
						'si vos plai': 's’il vous plaît (auvergnat, vivaro-alpin)'
					}
				}
			]
		}
	]
};
