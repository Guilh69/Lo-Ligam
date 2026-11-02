// Halte 3 · A1 · « Pausa 3 » : réemploi des unités 5 et 6 dans une situation
// nouvelle, une journée de marché, du départ au retour (carte de l'A1 §5 ;
// cursus/lexic-A1.md, Halte 3), rédigée par Claude le 2026-11-02. Aucun mot
// nouveau : seulement l'« À retenir » des modules 0 à 6.4 (les `choses` portent
// leurs id) ; *fòrça* et *Òsca* reviennent, glosés de nouveau.
// Chemin d'une halte (comme les haltes 1 et 2) : Révision du jour · Escota ·
// Lo jòc del jorn (écouter les prix et les heures, puis dialogue à choix avec
// le tour « rester en occitan », règle 13) · A tu ! · Lo bilanç (ce que je
// sais faire, puis le carnet de révision).
// Personnages cohérents avec les unités 1 à 4 : Yasmine est paysanne (4.2) et
// vend au marché du village, le dimanche ; Núria passe ses dimanches avec elle
// (4.3, 4.4) ; Loís, cuisinier, travaille le dimanche (4.3) ; Marià, à la
// retraite, tutoie Yasmine, qui la vouvoie (1.1). Écrite en même temps que les
// unités 5 et 6 : à harmoniser si elles disent autre chose (jour du marché,
// étal de Yasmine).
// ⚠️ Occitan à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modulPausa3 = {
	id: 'modul-pausa-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: 'pausa-3',
	unitat: 'Pausa 3',
	nivel: 'A1 · Pausa 3 · unitats 5 e 6',
	oc: 'Pausa 3',
	fr: 'Halte 3 : réemploi des unités 5 et 6, puis bilan',
	cando:
		'Je peux, au marché, demander et dire un prix, demander poliment ce que je veux, et raconter une journée : l’heure, le temps qu’il fait, ce que je fais du matin au soir.',
	durada: '~35 min · 5 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Núria', 'Loís', 'Marià'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Le marché du village a lieu le dimanche matin, et Yasmine y vend ses légumes et ses œufs (Núria l’aide). D’accord ?',
		'*Tres euros lo quilò* (trois euros le kilo) : la tournure te va ?',
		'Pour le total : *Quant fa ? · Fa onze euros.* D’accord ?',
		'*Es miègjorn e quart* (il est midi et quart) : d’accord ?',
		'Rester en occitan : Marià, locutrice native, passe au français pour t’aider ; la bonne réponse est de lui répondre en occitan (*Vaquí sièis uòus ! E l’alh còsta un euro.*). La scène sonne juste pour toi ?',
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
					intro: 'Avant le marché, trois questions sur les unités 5 et 6. Une à la fois.',
					// *pausa* (titre du module) est glosé dans la halte 1.
					items: [
						{
							q: 'Au marché, tu veux savoir le prix des tomates. Tu demandes…',
							options: ['Quant còstan ?', 'Quant còsta ?', 'Quant as d’ans ?'],
							correct: 0,
							oc: true,
							choses: ['quant-costa'],
							explain: 'Plusieurs tomates : *Quant còstan ?* Pour une seule chose : *Quant còsta ?*'
						},
						{
							q: 'L’horloge de la place marque 12 h 30. Il est…',
							options: ['Es miègjorn e mièja.', 'Es mièjanuèch e mièja.', 'Es una ora e mièja.'],
							correct: 0,
							oc: true,
							choses: ['miegjorn', 'e-mieja'],
							explain: '*Miègjorn* : midi. *Mièjanuèch*, c’est minuit ; *una ora e mièja*, une heure et demie.'
						},
						{
							q: 'Tu regardes par la fenêtre : de l’eau tombe du ciel. Tu dis…',
							options: ['Plòu.', 'Nèva.', 'Fa solelh.'],
							correct: 0,
							oc: true,
							choses: ['plou'],
							explain: '*Plòu* : il pleut. *Nèva*, il neige ; *Fa solelh*, il y a du soleil.'
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
							consigne: 'Écris en lettres : 50 euros.',
							answers: ['cinquanta euros'],
							choses: ['nombre-50', 'euro-centim'],
							explain: '*Cinquanta* : cinq dizaines, comme *cinc*.'
						},
						{
							consigne: 'Dis : je me lève à six heures.',
							answers: ['Me lèvi a sièis oras.'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: '*Me lèvi* : je me lève. Puis l’heure : *a sièis oras*.'
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
					title: 'Une journée de marché',
					intro:
						'Le dimanche matin, il y a marché au village. Yasmine, qui est paysanne, y vend ses légumes et ses œufs ; aujourd’hui, Núria l’aide pour la première fois. Lis une première fois pour répondre à une seule question : Núria a-t-elle aimé sa journée ?',
					scenes: [
						{
							title: 'A cinc oras e mièja',
							subtitle: '(à la ferme de Yasmine, il fait encore nuit ; elles se tutoient)',
							lines: [
								{ oc: 'Quina ora es ?', sound: 'KI-no OU-ro ÉS ?', fr: 'Quelle heure est-il ?' },
								{
									oc: 'Son cinc oras e mièja. Lo dimenge, me lèvi totjorn a cinc oras !',
									sound: 'soun SIN-kou-ros é MYÈ-djo. lou di-MÉN-djé, mé LÈ-bi tout-DJOUR a SIN-kou-ros !',
									fr: 'Il est cinq heures et demie. Le dimanche, je me lève toujours à cinq heures !'
								},
								{ oc: 'A cinc oras ! E quin temps fa ?', sound: 'a SIN-kou-ros ! é kin TÉMS FA ?', fr: 'À cinq heures ! Et quel temps fait-il ?' },
								{ oc: 'Fa freg, mas plòu pas.', sound: 'fa FRÉTCH, mas PLÒOU PAS.', fr: 'Il fait froid, mais il ne pleut pas.' },
								{ oc: 'E lo mercat, a quina ora ?', sound: 'é lou mér-CAT, a KI-no OU-ro ?', fr: 'Et le marché, à quelle heure ?' },
								{
									oc: 'A sèt oras. Dejuni, e puèi, vau al mercat !',
									sound: 'a SÈ-tou-ros. dé-DJU-ni, é PUÈÏ, baou al mér-CAT !',
									fr: 'À sept heures. Je prends mon petit déjeuner, et ensuite, je vais au marché !'
								}
							]
						},
						{
							title: 'Al mercat',
							subtitle: '(sur la place, à l’étal de Yasmine ; Loís, son ami, la tutoie ; c’est Núria qui compte)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Cossí vas ?', sound: 'a-DIOU, yas-MI-ne ! cou-si BAS ?', fr: 'Salut, Yasmine ! Comment vas-tu ?' },
								{ oc: 'Vau plan ! E tu, qué vòls, uèi ?', sound: 'baou PLA ! é TU, ké BÒLS, UÈÏ ?', fr: 'Je vais bien ! Et toi, que veux-tu, aujourd’hui ?' },
								{
									oc: 'Vòli tres quilòs de tomatas e un quilò de cebas, se te plai.',
									sound: 'BÒ-li TRÉS ki-LÒS dé tou-MA-tos é un ki-LÒ dé SÉ-bos, sé té PLAÏ.',
									fr: 'Je veux trois kilos de tomates et un kilo d’oignons, s’il te plaît.'
								},
								{ oc: 'Vaquí ! Quicòm mai ?', sound: 'ba-KI ! ki-CÒM MAÏ ?', fr: 'Voilà ! Autre chose ?' },
								{ oc: 'Non, es tot. Quant fa ?', sound: 'NOU, és TOUT. KAN FA ?', fr: 'Non, c’est tout. Combien ça fait ?' },
								{
									oc: 'Las tomatas, tres euros lo quilò ; las cebas, dos euros… Fa onze euros !',
									sound: 'las tou-MA-tos, tré-ZÉOU-rous lou ki-LÒ ; las SÉ-bos, dou-ZÉOU-rous… fa oun-ZÉOU-rous !',
									fr: 'Les tomates, trois euros le kilo ; les oignons, deux euros… Ça fait onze euros !'
								},
								{
									oc: 'Òsca, Núria ! Vaquí onze euros. A lèu !',
									sound: 'ÒS-co, NOU-ria ! ba-KI oun-ZÉOU-rous. a LÈOU !',
									fr: 'Bravo, Núria ! Voilà onze euros. À bientôt !'
								}
							]
						},
						{
							title: 'Lo ser',
							subtitle: '(de retour à la ferme)',
							lines: [
								{ oc: 'Quina jornada ! Quina ora es ?', sound: 'KI-no djour-NA-do ! KI-no OU-ro ÉS ?', fr: 'Quelle journée ! Quelle heure est-il ?' },
								{ oc: 'Son sèt oras e quart… e plòu !', sound: 'soun SÈ-tou-ros é KART… é PLÒOU !', fr: 'Il est sept heures et quart… et il pleut !' },
								{ oc: 'E ara, qué fas ?', sound: 'é A-ro, ké FAS ?', fr: 'Et maintenant, que fais-tu ?' },
								{
									oc: 'Sopi, e puèi, vau al lièch. Deman, me lèvi a cinc oras !',
									sound: 'SOU-pi, é PUÈÏ, baou al LYÈTCH. dé-MA, mé LÈ-bi a SIN-kou-ros !',
									fr: 'Je dîne, et puis je vais au lit. Demain, je me lève à cinq heures !'
								},
								{ oc: 'Ieu, deman, me lèvi a dètz oras !', sound: 'YÉOU, dé-MA, mé LÈ-bi a DÈ-dzou-ros !', fr: 'Moi, demain, je me lève à dix heures !' },
								{ oc: 'Mercés, Núria ! T’agrada lo mercat ?', sound: 'mér-SÉS, NOU-ria ! ta-GRA-do lou mér-CAT ?', fr: 'Merci, Núria ! Tu aimes le marché ?' },
								{ oc: 'Òc, m’agrada fòrça ! Al còp que ven !', sound: 'OK, ma-GRA-do FÒR-so ! al COP qué BÈN !', fr: 'Oui, j’aime beaucoup ! À la prochaine !' }
							]
						}
					],
					glossary: [
						{ oc: 'Òsca !', sound: 'ÒS-co', fr: 'bravo !' },
						{ oc: 'fòrça', sound: 'FÒR-so', fr: 'beaucoup (M’agrada fòrça : j’aime beaucoup)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Núria a-t-elle aimé sa journée ?',
							options: ['oui, beaucoup', 'non : elle n’aime pas se lever tôt', 'elle ne le dit pas'],
							correct: 0,
							noShuffle: true,
							choses: ['m-agrada'],
							explain: 'Yasmine lui demande : *T’agrada lo mercat ?* Núria répond : *Òc, m’agrada fòrça !* (oui, j’aime beaucoup). Se lever tôt, c’est une autre histoire…'
						},
						{
							q: 'Combien Loís paie-t-il ?',
							options: ['onze euros', 'treize euros', 'neuf euros'],
							correct: 0,
							choses: ['euro-centim', 'quant-costa'],
							explain: 'Trois kilos de tomates à trois euros, plus un kilo d’oignons à deux euros : *Fa onze euros !*'
						},
						{
							q: 'Le dimanche, Yasmine se lève…',
							options: ['à cinq heures', 'à cinq heures et demie', 'à sept heures'],
							correct: 0,
							choses: ['me-levi'],
							explain: '*Lo dimenge, me lèvi totjorn a cinc oras.* À cinq heures et demie, elle parle déjà avec Núria ; à sept heures, c’est le marché.'
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
					// Jeu de 5.2 (écouter les prix) mêlé aux heures et au temps de l'unité 6.
					type: 'qcm',
					title: 'Escota e causís (écoute et choisis)',
					intro: 'Au marché, on te parle : choisis ce que tu as compris. Pense aux nombres, et aux heures.',
					items: [
						{
							ditz: { qui: 'Ramon, le fromager', oc: 'Lo formatge ? Còsta sèt euros.' },
							q: 'Le fromage coûte…',
							options: ['7 €', '17 €', '70 €'],
							correct: 0,
							choses: ['nombre-7', 'lo-formatge'],
							explain: '*Sèt* : 7. *Dètz-e-sèt*, c’est 17 ; *setanta*, 70.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Las pomas ? Dos euros lo quilò.' },
							q: 'Pour deux kilos de pommes, tu paies…',
							options: ['4 €', '2 €', '12 €'],
							correct: 0,
							choses: ['la-poma', 'un-quilo-de'],
							explain: 'Deux euros le kilo, et deux kilos : *quatre euros*. (*Dotze*, c’est douze.)'
						},
						{
							ditz: { qui: 'Le vigneron', oc: 'Lo vin ? Quinze euros.' },
							q: 'Le vin coûte…',
							options: ['15 €', '50 €', '5 €'],
							correct: 0,
							choses: ['nombre-15', 'lo-vin'],
							explain: '*Quinze* : 15. *Cinquanta*, c’est 50 ; *cinc*, 5.'
						},
						{
							ditz: { qui: 'Núria', oc: 'Son onze oras mens lo quart.' },
							q: 'Il est…',
							options: ['10 h 45', '11 h 15', '11 h 45'],
							correct: 0,
							choses: ['e-quart'],
							explain: '*Onze oras mens lo quart* : onze heures moins le quart, 10 h 45. *Onze oras e quart*, c’est 11 h 15.'
						},
						{
							ditz: { qui: 'Loís', oc: 'A miègjorn, cosini ; a tres oras, dinni.' },
							q: 'Loís déjeune à…',
							options: ['15 h', '12 h', '13 h'],
							correct: 0,
							choses: ['dinnar', 'miegjorn'],
							explain: 'À midi, Loís fait la cuisine (*cosini*) pour les autres ; lui, il déjeune à trois heures : *a tres oras, dinni*.'
						},
						{
							ditz: { qui: 'La radio, le matin', oc: 'Uèi, fa bèl ; mas deman, plòu.' },
							q: 'Demain…',
							options: ['il pleut', 'il fait beau', 'il neige'],
							correct: 0,
							choses: ['plou', 'uei'],
							explain: '*Uèi, fa bèl* : aujourd’hui, il fait beau. *Deman, plòu* : demain, il pleut.'
						}
					]
				},
				{
					type: 'causida',
					title: 'Une heure à l’étal',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Marià te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Marià',
					tours: [
						{
							situacion:
								'À midi, Yasmine et Núria vont déjeuner : pour une heure, c’est toi qui tiens l’étal. Marià arrive. Elle te tutoie ; toi, tu la vouvoies.',
							ditz: 'Adieu ! Yasmine es pas aquí ?',
							options: [
								{ oc: 'Non, dinna. Qué volètz ?', bon: true },
								{ oc: 'Non, dinni. Qué volètz ?', reaccion: 'Marià sourit : c’est toi qui déjeunes ? Pourtant, tu es bien là, derrière l’étal.' },
								{ oc: 'Non, dinna. Qué vòls ?', reaccion: 'Marià hausse un sourcil : depuis quand la tutoies-tu ?' }
							],
							choses: ['dinnar', 'que-vols'],
							explain: '*Dinna* : elle déjeune (pour toi : *dinni*). Et pour vouvoyer : *Qué volètz ?*'
						},
						{
							situacion: 'Sur l’étiquette des pommes : 2 € le kilo.',
							ditz: 'Las pomas, quant còstan ?',
							options: [
								{ oc: 'Dos euros lo quilò.', bon: true },
								{ oc: 'Dotze euros lo quilò.', reaccion: 'Marià ouvre de grands yeux : douze euros ! Elle relit l’étiquette, puis te regarde.' },
								{ oc: 'Doas oras lo quilò.', reaccion: 'Marià éclate de rire : des pommes à l’heure, maintenant ?' }
							],
							choses: ['nombre-2', 'euro-centim'],
							explain: '*Dos euros* : deux euros (*dos* au masculin ; au féminin, *doas oras*). *Dotze*, c’est douze.'
						},
						{
							ditz: 'Volriái un quilò, se te plai.',
							options: [
								{ oc: 'Vaquí ! Quicòm mai ?', bon: true },
								{ oc: 'De res ! Quicòm mai ?', reaccion: 'Marià rit : elle ne t’a pas encore dit merci !' },
								{ oc: 'Es tot. Quicòm mai ?', reaccion: 'Marià te regarde, perplexe : c’est tout, ou autre chose ? C’est à elle de le dire.' }
							],
							choses: ['vaqui', 'quicom-mai'],
							explain: '*Vaquí !* en tendant le sac, puis *Quicòm mai ?* : autre chose ?'
						},
						{
							situacion: 'L’horloge de l’église marque midi et quart.',
							ditz: 'Òc, sièis uòus. E… quina ora es ?',
							options: [
								{ oc: 'Es miègjorn e quart.', bon: true },
								{ oc: 'Es mièjanuèch e quart.', reaccion: 'Marià regarde le soleil, puis toi : minuit, en plein jour ?' },
								{ oc: 'Es una ora mens lo quart.', reaccion: 'Marià lève les yeux vers l’horloge : une heure moins le quart ? Pas encore.' }
							],
							choses: ['miegjorn', 'e-quart', 'quina-ora-es'],
							explain: '*Miègjorn e quart* : midi et quart. *Mièjanuèch*, c’est minuit.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Tu cherches les œufs. Marià croit que tu n’as pas compris ; gentille, elle passe au français, plus vite : « Bon, je te le dis en français, ce sera plus simple : six œufs, et de l’ail aussi. Combien, l’ail ? » (Sur l’étiquette de l’ail : 1 €.)',
							options: [
								{ oc: 'Vaquí sièis uòus ! E l’alh còsta un euro.', bon: true },
								{ oc: 'Compreni pas.', reaccion: 'Marià, patiente, te réexplique tout en français… et l’occitan s’arrête là. Tu avais pourtant compris : réponds-lui en occitan !' },
								{ oc: 'Òc, òc…', reaccion: 'Marià continue en français, ravie de t’aider. Réponds-lui plutôt en occitan, avec des mots que tu connais : elle te suivra.' }
							],
							choses: ['vaqui', 'l-uou', 'l-alh', 'quant-costa'],
							explain: 'Pour rester en occitan, réponds-lui en occitan, tout simplement : Marià reprend aussitôt. *L’alh còsta un euro* : l’ail coûte un euro.'
						},
						{
							situacion: 'Tu comptes : les pommes, 2 € ; les six œufs, 3 € ; l’ail, 1 €.',
							ditz: 'Es tot. Quant fa ?',
							options: [
								{ oc: 'Fa sièis euros.', bon: true },
								{ oc: 'Fa sèt euros.', reaccion: 'Marià recompte sur ses doigts : deux, plus trois, plus un… Ça ne fait pas sept.' },
								{ oc: 'Fa setze euros.', reaccion: 'Marià manque de lâcher son panier : seize euros, pour des pommes et des œufs ?' }
							],
							choses: ['nombre-6', 'euro-centim'],
							explain: 'Deux, plus trois, plus un : *Fa sièis euros.* (*Quant fa ?* : combien ça fait ?)'
						},
						{
							situacion: 'Ce matin, la radio l’a dit : demain, de la pluie toute la journée.',
							ditz: 'Vaquí. E deman, quin temps fa ?',
							options: [
								{ oc: 'Deman, plòu.', bon: true },
								{ oc: 'Deman, nèva.', reaccion: 'Marià rit : de la neige ? La radio parlait de pluie.' },
								{ oc: 'Deman, fa bèl.', reaccion: 'Marià secoue la tête : ce n’est pas ce que disait la radio ce matin.' }
							],
							choses: ['plou', 'quin-temps-fa'],
							explain: '*Deman, plòu* : demain, il pleut. Comme en français, le présent suffit pour demain.'
						},
						{
							ditz: 'Mercés ! A deman !',
							options: [
								{ oc: 'De res, Marià ! Adieu-siatz !', bon: true },
								{ oc: 'De res, Marià ! Adieu !', reaccion: 'Marià sourit, un peu surprise : depuis le début, tu la vouvoies.' },
								{ oc: 'Mercés, Marià ! Bonjorn !', reaccion: 'Marià, déjà partie, se retourne : bonjour ? Elle s’en va !' }
							],
							choses: ['de-res', 'adieu-siatz'],
							explain: 'Elle te dit merci : *De res !* (de rien). Et tu la vouvoies : *Adieu-siatz !*'
						}
					],
					fin: 'Bravo ! Une heure à l’étal, tout en occitan : les prix, l’heure, le temps de demain, et une réponse en occitan quand Marià est passée au français. Yasmine peut déjeuner tranquille.'
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
							consigne: 'Au marché, tu vouvoies la marchande : demande-lui un kilo de poires, poliment.',
							answers: ['Volriái un quilò de peras, se vos plai.'],
							choses: ['volriai', 'un-quilo-de', 'la-pera', 'se-vos-plai'],
							explain: '*Volriái…* est plus poli que *Vòli…* ; et en vouvoyant : *se vos plai*.'
						},
						{
							consigne: 'Demande-lui le prix des olives.',
							answers: ['Quant còstan las olivas ?', 'Las olivas, quant còstan ?'],
							choses: ['quant-costa', 'l-oliva'],
							explain: 'Plusieurs olives : *còstan*.'
						},
						{
							consigne: 'Dis à quelle heure tu te lèves, le dimanche.',
							debut: ['Lo dimenge, me lèvi a', 'Me lèvi a'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: '*Lo dimenge, me lèvi a…*, puis l’heure : *a uèch oras*, *a nòu oras e mièja*…'
						},
						{
							consigne: 'Aujourd’hui, il fait beau, mais il fait froid.',
							answers: ['Uèi, fa bèl, mas fa freg.'],
							choses: ['uei', 'fa-bel', 'fa-freg'],
							explain: '*Uèi* : aujourd’hui. Et *fa* pour le temps qu’il fait : *fa bèl*, *fa freg*.'
						},
						{
							consigne: 'Dis ce que tu aimes, au marché : j’aime…',
							debut: ['M’agrada', 'M’agradan'],
							choses: ['m-agrada'],
							explain: 'Une chose : *M’agrada lo formatge.* Plusieurs : *M’agradan las olivas.*'
						},
						{
							consigne: 'À midi, je déjeune ; le soir, je dîne à huit heures.',
							answers: ['A miègjorn, dinni ; lo ser, sopi a uèch oras.'],
							choses: ['miegjorn', 'dinnar', 'lo-ser', 'sopar'],
							explain: '*Dinni* : je déjeune, à midi. *Sopi* : je dîne, le soir.'
						}
					]
				},
				{
					// Jeu de 6.3 : remettre la journée dans l'ordre.
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les phrases, puis les mots, dans l’ordre. Un mauvais choix tremble, rien de grave.',
					items: [
						{
							prompt: 'La journée de Yasmine, du matin au soir.',
							tiles: ['Me lèvi a cinc oras.', 'Dejuni.', 'Vau al mercat.', 'A miègjorn, dinni.', 'Lo ser, sopi.', 'Vau al lièch.'],
							choses: ['me-levi', 'dejunar', 'dinnar', 'sopar', 'vau-al-liech'],
							explain: 'Se lever, le petit déjeuner (*dejuni*), le marché, le déjeuner de midi (*dinni*), le dîner du soir (*sopi*)… et au lit !'
						},
						{
							prompt: 'Je voudrais deux kilos de pommes de terre, s’il vous plaît.',
							tiles: ['Volriái', 'dos', 'quilòs', 'de', 'patanas,', 'se', 'vos', 'plai.'],
							choses: ['volriai', 'un-quilo-de', 'la-patana', 'se-vos-plai'],
							explain: '*Dos quilòs de patanas* : au pluriel, *quilòs* ; puis *de*, comme en français.'
						},
						{
							prompt: 'Il est deux heures et quart, et il pleut.',
							tiles: ['Son', 'doas', 'oras', 'e', 'quart,', 'e', 'plòu.'],
							choses: ['son-doas-oras', 'e-quart', 'plou'],
							explain: 'À partir de deux heures, *son* ; et *doas*, au féminin, comme *oras*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Raconte ta journée de marché',
					intro:
						'Imagine ton dimanche au marché, ou raconte un vrai. Dis à voix haute, en cinq phrases : à quelle heure tu te lèves, le temps qu’il fait, ce que tu demandes au marché, le prix, ce que tu fais le soir. Puis compare au modèle.',
					items: [
						{
							q: 'Ton dimanche, en cinq phrases.',
							a: 'Par exemple : *Lo dimenge, me lèvi a uèch oras. Fa solelh, mas fa freg. Al mercat : « Volriái un quilò de pomas, se vos plai. » Còstan dos euros. Lo ser, sopi amb ma sòrre, e puèi vau al lièch.*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. Lo bilanç
		{
			title: 'Lo bilanç',
			fr: 'le bilan',
			minutes: 3,
			blocks: [
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais déjà faire.',
					items: [
						'demander un prix, et comprendre la réponse',
						'demander poliment ce que je veux, et dire ce que j’aime',
						'dire l’heure, et le temps qu’il fait',
						'raconter ma journée, du matin au soir',
						'rester en occitan quand quelqu’un passe au français'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de la halte 3',
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant te débrouiller au marché, dire l’heure et le temps qu’il fait, et raconter ta journée. La suite : l’unité 7, la maison.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Ton carnet de révision',
					paragraphs: [
						'Les exercices que tu fais remplissent ton carnet de révision. Il marche sans compte : il reste dans ton navigateur.',
						'Deux cartes par chose : « je reconnais », puis « je produis ». Une carte est acquise après deux réussites, à deux jours différents. Passe le voir avant l’unité 7.'
					],
					lien: { href: '/aprene/carnet', texte: 'Ouvrir mon carnet de révision' }
				}
			]
		}
	]
};
