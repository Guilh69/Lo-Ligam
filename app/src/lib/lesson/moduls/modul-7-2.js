// Module 7.2 · A1 · « Ont es ? » : unité 7 (L’ostal), rédigé par Claude le
// 2026-11-02 sur le modèle de l'unité 1 (règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : sus, jos, davant, darrièr, al costat de, entre ; les petits
// mots soudés al, del, als, dels, sul (lexic-A1.md, 7.2). Al est déjà connu
// par Vau al lièch (6.3).
// Scène : c'est jeudi, Núria vient jouer aux cartes chez Marià (4.4) ; Mimí,
// gardée par Marià toute la semaine (7.1), a disparu.
// Jeu du jour : glisser l'objet à sa place (order, voir le commentaire).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01), à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul72 = {
	id: 'modul-7-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '7-2',
	unitat: 'Unitat 7 · L’ostal',
	nivel: 'A1 · Modul 7.2',
	oc: 'Ont es ?',
	fr: 'Où est-ce ? Dire où sont les choses',
	cando:
		'Je peux demander où est quelque chose, et dire où sont les choses : sur, sous, devant, derrière, à côté, entre deux.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Marià', 'Núria', 'Mimí'],
	notesRelecture: [
		'*sul* (*sus* + *lo*), *al*, *del*, *als*, *dels* : je n’ai pas mis *sus* + *los* dans le tableau, faute de forme sûre (*suls* ?). Laquelle dis-tu ?',
		'*darrièr* « da-RRYÈ », *davant* « da-BAN », *jos* « DJOUS » : c’est bien ton usage ?',
		'Son : *als amics* « al-za-MITS », le *s* lié devant la voyelle, comme *los amics* « lou-za-MITS » (4.3). D’accord ?',
		'Pendant la recherche, Núria et Marià se répondent sans verbe (*Jos la taula ?* · *Non. Darrièr la pòrta ?*) : ça sonne naturel ?',
		'*Mimí, al jardin !* pour envoyer la chatte dehors : naturel pour toi ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'la chambre',
							options: ['la cambra', 'la cosina', 'la sala'],
							correct: 0,
							oc: true,
							choses: ['la-cambra'],
							explain: '*la cambra* : la chambre ; *la cosina* : la cuisine ; *la sala* : le séjour.'
						},
						{
							q: 'Il y a une table dans la cuisine.',
							options: ['I a una taula dins la cosina.', 'I a una cadièra dins la cosina.', 'I a una taula dins la cambra.'],
							correct: 0,
							oc: true,
							choses: ['la-taula', 'la-cosina', 'dins'],
							explain: '*la taula* : la table ; *la cadièra* : la chaise.'
						},
						{
							q: 'À quelle heure ?',
							options: ['A quina ora ?', 'Quina ora es ?', 'Quin temps fa ?'],
							correct: 0,
							oc: true,
							choses: ['a-quina-ora'],
							explain: '*Quina ora es ?* : quelle heure est-il ? *Quin temps fa ?* : quel temps fait-il ? (unité 6)'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Qu’y a-t-il dans la maison ?',
							answers: ['Qué i a dins l’ostal ?'],
							choses: ['l-ostal', 'dins'],
							explain: 'La question de l’unité : *Qué i a… ?*'
						},
						{
							consigne: 'Il y a un canapé dans le séjour.',
							answers: ['I a un canapè dins la sala.', 'Dins la sala, i a un canapè.'],
							choses: ['lo-canape', 'la-sala']
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
					title: 'Mais où est Mimí ?',
					intro:
						'C’est jeudi : Núria vient jouer aux cartes chez Marià, comme chaque semaine. Mais Mimí, la chatte que Marià garde, a disparu. Les deux amies se répondent, chacune son tour. Lis une première fois pour répondre à une seule question : où était cachée Mimí ?',
					scenes: [
						{
							title: 'Ont es Mimí ?',
							subtitle: '(Núria arrive, le jeudi)',
							lines: [
								{ oc: 'Bonjorn, Marià ! Jogam a las cartas ?', sound: 'boun-DJOUR, ma-ri-A ! djou-GAN a las CAR-tos ?', fr: 'Bonjour, Marià ! On joue aux cartes ?' },
								{ oc: 'Òc ! Mas… ont es Mimí ? Es pas sul canapè.', sound: 'OK ! mas… oun ÉS mi-MI ? és PAS sul ca-na-PÈ.', fr: 'Oui ! Mais… où est Mimí ? Elle n’est pas sur le canapé.' },
								{ oc: 'Es jos la taula ?', sound: 'és DJOUS la TAOU-lo ?', fr: 'Elle est sous la table ?' },
								{ oc: 'Non. Darrièr la pòrta ?', sound: 'NOU. da-RRYÈ la PÒR-to ?', fr: 'Non. Derrière la porte ?' },
								{ oc: 'Non. Al costat del lièch, dins la cambra ?', sound: 'NOU. al cous-TAT dél LYÈTCH, dins la CAM-bro ?', fr: 'Non. À côté du lit, dans la chambre ?' },
								{ oc: 'Non. Entre l’armari e la fenèstra ?', sound: 'NOU. ÉN-tré lar-MA-ri é la fé-NÈS-tro ?', fr: 'Non. Entre l’armoire et la fenêtre ?' },
								{ oc: 'Non… Davant l’ostal, dins lo jardin ?', sound: 'NOU… da-BAN lous-TAL, dins lou djar-DI ?', fr: 'Non… Devant la maison, dans le jardin ?' },
								{ oc: 'Sabi pas…', sound: 'SA-bi PAS…', fr: 'Je ne sais pas…' }
							]
						},
						{
							title: 'Sus la taula',
							subtitle: '(dans le séjour)',
							lines: [
								{ oc: 'E las cartas, ont son ?', sound: 'é las CAR-tos, oun SOUN ?', fr: 'Et les cartes, où sont-elles ?' },
								{ oc: 'Sus la taula, al costat del pan.', sound: 'sus la TAOU-lo, al cous-TAT dél PA.', fr: 'Sur la table, à côté du pain.' },
								{ oc: 'Sus la taula ? I a pas de cartas… I a Mimí !', sound: 'sus la TAOU-lo ? ya PAS dé CAR-tos… ya mi-MI !', fr: 'Sur la table ? Il n’y a pas de cartes… Il y a Mimí !' },
								{ oc: 'Mimí es sus las cartas !', sound: 'mi-MI és sus las CAR-tos !', fr: 'Mimí est sur les cartes !' },
								{ oc: 'Mimí jòga a las cartas amb nosautras !', sound: 'mi-MI DJÒ-go a las CAR-tos am nou-ZAOU-tros !', fr: 'Mimí joue aux cartes avec nous !' },
								{ oc: 'Mimí, al jardin ! E nosautras, a las cartas !', sound: 'mi-MI, al djar-DI ! é nou-ZAOU-tros, a las CAR-tos !', fr: 'Mimí, au jardin ! Et nous, aux cartes !' }
							]
						}
					],
					glossary: [
						{ oc: 'lo lièch', sound: 'lou LYÈTCH', fr: 'le lit (tu l’as dit en 6.3 : *Vau al lièch*)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Où était cachée Mimí ?',
							options: ['sur les cartes, sur la table', 'sous la table', 'derrière la porte'],
							correct: 0,
							choses: ['sus-sul', 'la-taula'],
							explain: 'Ni *jos la taula*, ni *darrièr la pòrta* : *Mimí es sus las cartas*, et les cartes sont *sus la taula* !'
						},
						{
							q: 'Où Marià avait-elle posé les cartes ?',
							options: ['à côté du pain', 'à côté du lit', 'entre l’armoire et la fenêtre'],
							correct: 0,
							choses: ['al-costat-de', 'al-del'],
							explain: '*al costat del pan* : à côté du pain. *Del*, c’est *de* + *lo*.'
						},
						{
							q: 'Pour finir, Marià envoie Mimí…',
							options: ['au jardin', 'au lit', 'dans la chambre'],
							correct: 0,
							choses: ['al-del', 'lo-jardin'],
							explain: '*Mimí, al jardin !* : *al*, c’est *a* + *lo*. Et les deux amies, *a las cartas*.'
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
					type: 'qcm',
					title: 'Les petits mots de lieu',
					intro: 'Regarde les phrases de la recherche : à chaque fois, un petit mot dit où.',
					items: [
						{
							q: '*Es pas sul canapè.* *Sul*, c’est…',
							options: ['sur le', 'sous le', 'dans le'],
							correct: 0,
							choses: ['sus-sul'],
							explain: '*sul*, c’est *sus* + *lo* : sur le. Devant *la*, rien ne se soude : *sus la taula*.'
						},
						{
							q: '*Es jos la taula ?* Núria cherche…',
							options: ['sous la table', 'sur la table', 'à côté de la table'],
							correct: 0,
							choses: ['jos'],
							explain: '*jos* : sous, « DJOUS ».'
						},
						{
							q: '*Darrièr la pòrta ?* Marià regarde…',
							options: ['derrière la porte', 'devant la porte', 'à côté de la porte'],
							correct: 0,
							choses: ['darrier'],
							explain: '*darrièr* : derrière ; son contraire, c’est *davant*.'
						},
						{
							q: '*Davant l’ostal, dins lo jardin ?* Le jardin est…',
							options: ['devant la maison', 'derrière la maison', 'à côté de la maison'],
							correct: 0,
							choses: ['davant'],
							explain: '*davant* : devant, « da-BAN ».'
						},
						{
							q: '*Al costat del lièch* : *del*, c’est…',
							options: ['*de* + *lo* : du', '*de* + *la* : de la', 'un autre mot pour *dins*'],
							correct: 0,
							choses: ['al-del', 'al-costat-de'],
							explain: '*al costat de* : à côté de. Devant *lo*, *de* et *lo* se soudent : *del*, comme « du » en français.'
						},
						{
							q: '*Entre l’armari e la fenèstra* : Mimí serait…',
							options: ['entre l’armoire et la fenêtre', 'dans l’armoire', 'derrière la fenêtre'],
							correct: 0,
							choses: ['entre'],
							explain: '*entre… e…* : entre… et…, comme en français.'
						},
						{
							q: '*Mimí, al jardin !* *Al*, c’est…',
							options: ['*a* + *lo* : au', '*a* + *la* : à la', 'un autre mot pour *lo*'],
							correct: 0,
							choses: ['al-del'],
							explain: '*al*, c’est *a* + *lo* : au. Tu le disais déjà : *Vau al lièch*. Mais *a la* ne bouge pas : *a las cartas*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Les petits mots qui se soudent',
					head: ['', 'avec *lo*', 'avec *la*', 'avec *los*', 'avec *las*'],
					rows: [
						['*a* (à)', '*al jardin* (au jardin)', '*a la fenèstra*', '*als amics* (aux amis)', '*a las cartas*'],
						['*de* (de)', '*del pan* (du pain)', '*de la cosina*', '*dels amics* (des amis)', '*de las cartas*']
					],
					notes: [
						'Seuls *lo* et *los* se soudent ; *la* et *las* restent à part, comme en français : « au jardin », mais « à la fenêtre ».',
						'*sus* se soude aussi avec *lo* : *sul canapè* (sur le canapé). Mais *sus la taula*.',
						'Devant une voyelle, *l’* ne se soude pas : *a l’ostal*, *de l’armari*.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : sur, sous, devant, derrière',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'sus-sul', oc: 'sus · sul', sound: 'SUS · SUL', fr: 'sur · sur le (*sul* = *sus* + *lo*)' },
						{ id: 'jos', oc: 'jos', sound: 'DJOUS', fr: 'sous' },
						{ id: 'davant', oc: 'davant', sound: 'da-BAN', fr: 'devant' },
						{ id: 'darrier', oc: 'darrièr', sound: 'da-RRYÈ', fr: 'derrière' }
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
					title: 'À retenir : au, du, à côté, entre',
					intro: 'Les petits mots soudés, et deux places de plus.',
					items: [
						{ id: 'al-del', oc: 'al · del · als · dels', sound: 'AL · DÉL · ALS · DÉLS', fr: 'au · du · aux · des (*al* = a + *lo* ; *del* = *de* + *lo*)' },
						{ id: 'al-costat-de', oc: 'al costat de…', sound: 'al cous-TAT dé', fr: 'à côté de…' },
						{ id: 'entre', oc: 'entre', sound: 'ÉN-tré', fr: 'entre' }
					]
				},
				// jeu prévu par la carte : glisser l'objet à sa place dans la pièce (à
				// coder). Version simple : order ; chaque phrase place deux choses, pour
				// que la place des tuiles ne suffise pas à répondre.
				{
					type: 'order',
					title: 'Chaque chose à sa place',
					intro:
						'Marià range le séjour, mais Mimí ne tient pas en place. Touche les mots dans l’ordre : chaque phrase met deux choses à leur place.',
					items: [
						{
							prompt: 'Mimí est sous la table, à côté de la chaise.',
							tiles: ['Mimí', 'es', 'jos', 'la', 'taula,', 'al', 'costat', 'de', 'la', 'cadièra.'],
							choses: ['jos', 'al-costat-de'],
							explain: '*al costat de la cadièra* : devant *la*, rien ne se soude.'
						},
						{
							prompt: 'Mimí est sur le canapé, devant la fenêtre.',
							tiles: ['Mimí', 'es', 'sul', 'canapè,', 'davant', 'la', 'fenèstra.'],
							choses: ['sus-sul', 'davant'],
							explain: '*sul canapè* : *sus* + *lo* se soudent.'
						},
						{
							prompt: 'Les cartes sont sur la table, à côté du pain.',
							tiles: ['Las', 'cartas', 'son', 'sus', 'la', 'taula,', 'al', 'costat', 'del', 'pan.'],
							choses: ['sus-sul', 'al-costat-de', 'al-del'],
							explain: '*sus la taula*, mais *al costat del pan* : *del* = *de* + *lo*.'
						},
						{
							prompt: 'La chaise est entre la table et la porte.',
							tiles: ['La', 'cadièra', 'es', 'entre', 'la', 'taula', 'e', 'la', 'pòrta.'],
							choses: ['entre', 'la-cadiera'],
							explain: '*entre… e…* : entre… et….'
						},
						{
							prompt: 'Le pain est sur la table, et Mimí est sous la table.',
							tiles: ['Lo', 'pan', 'es', 'sus', 'la', 'taula,', 'e', 'Mimí', 'es', 'jos', 'la', 'taula.'],
							choses: ['sus-sul', 'jos'],
							explain: '*sus* : sur ; *jos* : sous. Mimí a choisi la bonne place.'
						},
						{
							prompt: 'L’armoire est à côté du lit, derrière la porte.',
							tiles: ['L’armari', 'es', 'al', 'costat', 'del', 'lièch,', 'darrièr', 'la', 'pòrta.'],
							choses: ['al-costat-de', 'al-del', 'darrier'],
							explain: '*al costat del lièch* ; *darrièr la pòrta*.'
						}
					]
				},
				{
					type: 'qcm',
					title: 'Ont es Mimí ? (Où est Mimí ?)',
					intro: 'Mimí change encore de place. Touche ce que tu entends.',
					items: [
						{
							ditz: { qui: 'Núria', oc: 'Mimí es jos lo canapè.' },
							q: 'Mimí est…',
							options: ['sous le canapé', 'sur le canapé', 'derrière le canapé'],
							correct: 0,
							choses: ['jos'],
							explain: '*jos* : sous. *Jos* ne se soude pas : *jos lo canapè*.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Mimí es davant la pòrta.' },
							q: 'Mimí est…',
							options: ['devant la porte', 'derrière la porte', 'à côté de la porte'],
							correct: 0,
							choses: ['davant', 'la-porta'],
							explain: '*davant* : devant. Elle veut sortir !'
						},
						{
							ditz: { qui: 'Núria', oc: 'Mimí es darrièr lo canapè.' },
							q: 'Mimí est…',
							options: ['derrière le canapé', 'devant le canapé', 'sur le canapé'],
							correct: 0,
							choses: ['darrier'],
							explain: '*darrièr* : derrière, « da-RRYÈ ».'
						},
						{
							ditz: { qui: 'Marià', oc: 'Mimí es entre la taula e la cadièra.' },
							q: 'Mimí est…',
							options: ['entre la table et la chaise', 'sur la chaise, à côté de la table', 'sous la table'],
							correct: 0,
							choses: ['entre'],
							explain: '*entre la taula e la cadièra* : entre la table et la chaise.'
						},
						{
							ditz: { qui: 'Núria', oc: 'Mimí es sul lièch, al costat de l’armari.' },
							q: 'Mimí est…',
							options: ['sur le lit, à côté de l’armoire', 'sous le lit, à côté de l’armoire', 'sur le lit, devant l’armoire'],
							correct: 0,
							choses: ['sus-sul', 'al-costat-de'],
							explain: '*sul lièch* : sur le lit. *De l’armari* : devant la voyelle, rien ne se soude.'
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
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Mimí est sous la table.',
							answers: ['Mimí es jos la taula.'],
							choses: ['jos', 'la-taula']
						},
						{
							consigne: 'Le pain est sur la table.',
							answers: ['Lo pan es sus la taula.'],
							choses: ['sus-sul'],
							explain: 'Devant *la*, *sus* reste seul.'
						},
						{
							consigne: 'Mimí est sur le canapé.',
							answers: ['Mimí es sul canapè.'],
							choses: ['sus-sul', 'lo-canape'],
							explain: '*sus* + *lo* = *sul*.'
						},
						{
							consigne: 'Le jardin est devant la maison.',
							answers: ['Lo jardin es davant l’ostal.'],
							choses: ['davant', 'l-ostal']
						},
						{
							consigne: 'La chaise est derrière la porte.',
							answers: ['La cadièra es darrièr la pòrta.'],
							choses: ['darrier', 'la-porta']
						},
						{
							consigne: 'L’armoire est à côté du lit.',
							answers: ['L’armari es al costat del lièch.'],
							choses: ['al-costat-de', 'al-del'],
							explain: '*de* + *lo* = *del*.'
						},
						{
							consigne: 'La table est entre la cuisine et le séjour.',
							answers: ['La taula es entre la cosina e la sala.'],
							choses: ['entre', 'la-sala']
						},
						{
							consigne: 'Tu as sommeil : « Je vais au lit ! »',
							answers: ['Vau al lièch !'],
							choses: ['vau-al-liech', 'al-del'],
							explain: 'Tu le disais déjà en 6.3 : *al* = *a* + *lo*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : ta pièce',
					intro:
						'Regarde la pièce où tu es, ou imagine-la. Dis à voix haute où sont trois choses, puis compare au modèle.',
					items: [
						{
							q: 'Trois choses, trois places : *sus*, *jos*, *al costat de*…',
							a: 'Par exemple : *La taula es al costat de la fenèstra. Lo canapè es davant la taula. E lo cat es jos la cadièra !*'
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
					title: 'Le son du jour : les petits mots soudés',
					paragraphs: [
						'*al* et *del* se disent d’un seul coup : *al costat del lièch* « al cous-TAT dél LYÈTCH ».',
						'Devant une voyelle, le *s* de *als* et de *dels* se lie et sonne « z » : *als amics* « al-za-MITS », comme *los amics* « lou-za-MITS ».',
						'Écoute, puis répète : *al jardin*, *del pan*, *als amics*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Al costat del lièch* se dit…',
							options: ['al cous-TAT dél LYÈTCH', 'a lou cous-TAT dé lou LYÈTCH'],
							correct: 0,
							noShuffle: true,
							explain: 'On ne dit jamais *a lo* ni *de lo* : on soude, *al*, *del*.'
						},
						{
							q: '*Als amics* se dit…',
							options: ['al-za-MITS', 'ALS a-MITS'],
							correct: 0,
							noShuffle: true,
							explain: 'Le *s* se lie à la voyelle qui suit et sonne « z », comme dans *los amics*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Mimí es al costat del lièch.*',
							a: '« mi-MI és al cous-TAT dél LYÈTCH » : *al*, *del*, d’un seul coup.'
						},
						{
							q: '*Parli occitan als amics.*',
							a: '« PAR-li ou-tsi-TA al-za-MITS » : le *s* de *als* se lie à *amics*.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : lo mas',
					paragraphs: [
						'Un *mas*, c’est la ferme du Midi : la maison et ses terres. Le mot vient du latin « mansum ».',
						'Il est déjà là au Xe siècle, dans le « Poème sur Boèce », un des plus anciens textes en occitan ; le français l’a emprunté en 1552, chez Rabelais.',
						'Attention : *mas* veut aussi dire « mais » (unité 2). C’est la phrase qui dit lequel, comme pour *la cosina*.'
					],
					lien: { href: 'https://www.cnrtl.fr/etymologie/mas', texte: 'L’histoire du mot « mas » (Trésor de la langue française)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander où est quelque chose : *Ont es Mimí ?*',
						'dire où sont les choses : *sus*, *jos*, *davant*, *darrièr*, *entre*',
						'souder les petits mots : *al jardin*, *al costat del lièch*, *sul canapè*',
						'lier le *s* de *als* devant une voyelle'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire où sont les choses.',
						'Si tu en as envie : cache un objet chez toi et fais-le chercher en occitan à une personne précise, un enfant, une amie : *Es jos la taula ? Darrièr la pòrta ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
