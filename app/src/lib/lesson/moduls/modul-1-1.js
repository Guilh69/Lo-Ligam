// Module 1.1 · A1 · « Cossí vas ? » : unité 1 (Adieu !), module modèle de
// toute l'A1 (rédigé par Claude le 2026-10-25, cahier §11). Chemin commun à
// tous les modules (carte de l'A1, §3) : 1 révision du jour · 2 Escota ·
// 3 Obsèrva · 4 Lo jòc del jorn · 5 A tu ! · 6 Lo son e lo bilanç.
// Carte : Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/01-A1-carta-8-unitats.md
// Règle d'écriture : dans les textes en français, l'occitan est toujours en
// *italique* (le contrôle « rien sans explication » le repère ainsi :
// node scripts/controle-explications.mjs).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul11 = {
	id: 'modul-1-1',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-1',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.1',
	oc: 'Cossí vas ?',
	fr: 'Comment vas-tu ? Saluer, demander comment ça va, partir',
	cando:
		'Je peux saluer quelqu’un le matin ou le soir, demander comment ça va, répondre, et partir : en tutoyant un ami ou en vouvoyant une personne âgée.',
	durada: '~50 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25) : en attendant la scène.
	ouverture: {
		numero: 1,
		bloc: { oc: 'Ieu e los meus', fr: 'moi et les miens' },
		titre: 'Adieu !',
		fr: 'salut ! pour dire bonjour, et aussi au revoir',
		question: 'Cossí vas ?',
		questionFr: 'comment vas-tu ?',
		phrase:
			'En quatre modules, tu sauras saluer, dire ton nom, dire d’où tu es, et te présenter en six phrases, à l’oral comme à l’écrit.'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Loís', 'Marià', 'Lisa'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'*Adieu* : prononcé « a-DIOU » et *Adieu-siatz* « a-di-SSIATS », comme tu l’as validé le 29-08 ; à confirmer à l’enregistrement.',
		'*Bon ser* : « bou(n) SÉR », le r se dit (mot d’une seule syllabe : grammaire de référence p11, ton choix du 02-11). *Bonjorn* : « boun-DJOUR ».',
		'Formules alignées sur ton cours 0 en visio (2026-11-01) : *Vau plan, mercés* (je vais bien) et *Al còp que ven* (à la prochaine) ajoutés, *mercé* devient *mercés* ici et au module 1.2. Sons proposés : *Vau plan* « baou PLA », *mercés* « mér-SÉS » (s final prononcé), *Al còp que ven* « al COP qué BÈN ». À confirmer à l’enregistrement.',
		'La règle donnée : *Adieu* est familier (entre amis, entre jeunes, même à la première rencontre) ; à une personne qu’on vouvoie, plutôt *Bonjorn*. Est-ce bien ton usage ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'reveal',
					title: 'Ce qui revient du module 0',
					intro:
						'Cette étape te resservira, à chaque module, ce que tu as appris avant. Pour commencer, trois questions sur ce que tu as découvert au module 0 : pense ta réponse, puis regarde.',
					items: [
						{
							q: 'À Toulouse, quelqu’un te lance « Adieu ! » en arrivant, tout sourire. Il te dit bonjour ou au revoir ?',
							a: 'Bonjour ! En occitan, *Adieu* sert à dire bonjour, et aussi au revoir. C’est le titre de l’unité.'
						},
						{
							q: 'L’accent du Midi, il vient d’où, à ton avis ?',
							a: 'De l’occitan : sa musique sonne encore dans le français du Sud. Si tu as cet accent, tu pars avec de l’avance ; sinon, ton oreille va vite se régler.'
						},
						{
							q: 'Devine : comment dit-on « bonjour » en occitan ?',
							a: '*Bonjorn* : presque le français, mais on dit « boun-DJOUR ». Tu le retrouves tout de suite.'
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
					title: 'Deux rencontres sur la place',
					intro:
						'Jour de marché au village. Le matin, Yasmine croise son ami Loís. Le soir, elle croise Marià, une voisine âgée, avec ses amies : elle les vouvoie. Écoute deux fois, puis lis.',
					scenes: [
						{
							title: 'Lo matin',
							subtitle: '(le matin)',
							lines: [
								{ oc: 'Bonjorn, Yasmine !', sound: 'boun-DJOUR, yas-MI-ne !', fr: 'Bonjour, Yasmine !' },
								{ oc: 'Adieu, Loís ! Cossí vas ?', sound: 'a-DIOU, lou-ÍS ! cou-si BAS ?', fr: 'Salut, Loís ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés. E tu ?', sound: 'baou PLA, mér-SÉS. é TU ?', fr: 'Je vais bien, merci. Et toi ?' },
								{ oc: 'Va plan, plan mercés !', sound: 'ba PLA, pla mér-SÉS !', fr: 'Ça va bien, merci beaucoup !' },
								{ oc: 'A lèu, Yasmine !', sound: 'a LÈOU, yas-MI-ne !', fr: 'À bientôt, Yasmine !' },
								{ oc: 'Adieu ! Al còp que ven !', sound: 'a-DIOU ! al COP qué BÈN !', fr: 'Salut ! À la prochaine !' }
							]
						},
						{
							title: 'Lo ser',
							subtitle: '(le soir)',
							lines: [
								{ oc: 'Bon ser ! Cossí anatz ?', sound: 'bou(n) SÉR ! cou-si a-NATS ?', fr: 'Bonsoir ! Comment allez-vous ?' },
								{ oc: 'Adieu-siatz, Yasmine ! Va plan, mercés. E tu ?', sound: 'a-di-SSIATS, yas-MI-ne ! ba PLA, mér-SÉS. é TU ?', fr: 'Bonjour, Yasmine ! Ça va bien, merci. Et toi ?' },
								{ oc: 'Va plan !', sound: 'ba PLA !', fr: 'Ça va bien !' },
								{ oc: 'A deman, Yasmine !', sound: 'a dé-MA, yas-MI-ne !', fr: 'À demain, Yasmine !' },
								{ oc: 'A deman ! Adieu-siatz !', sound: 'a dé-MA ! a-di-SSIATS !', fr: 'À demain ! Au revoir !' }
							]
						}
					],
					glossary: [
						{ oc: 'lo matin', sound: 'lou ma-TI', fr: 'le matin' },
						{ oc: 'lo ser', sound: 'lou SÉR', fr: 'le soir' },
						{ oc: 'la plaça', sound: 'la PLA-ço', fr: 'la place du village' },
						{ oc: 'lo mercat', sound: 'lou mér-CAT', fr: 'le marché' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Le matin, Yasmine tutoie…',
							options: ['Loís, son ami', 'Marià, la voisine âgée'],
							correct: 0,
							explain: 'Avec Loís : *Cossí vas ?* (tu). Avec Marià et ses amies : *Cossí anatz ?* (vous).'
						},
						{
							q: 'Combien de fois entends-tu *Va plan* ou *Vau plan* dans les deux scènes ?',
							options: ['4 fois', '3 fois', '2 fois'],
							correct: 0,
							choses: ['va-plan-e-tu'],
							explain: 'Quatre fois : trois fois *Va plan* (ça va bien), la réponse passe-partout, et une fois *Vau plan* (je vais bien), la réponse directe à *Cossí vas ?*'
						},
						{
							q: 'Marià dit *Adieu-siatz !* à Yasmine au moment où elle…',
							options: ['l’accueille', 'la quitte', 'l’accueille, puis la quitte'],
							correct: 2,
							choses: ['adieu-siatz'],
							noShuffle: true,
							explain: 'Les deux ! Elle l’accueille avec *Adieu-siatz*, et le redit pour partir.'
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
					title: 'Tu ou vous ?',
					intro: 'Regarde la fin des mots : elle dit à qui l’on parle.',
					items: [
						{
							q: '*Cossí vas ?* : Yasmine parle…',
							options: ['à une seule personne, qu’elle tutoie', 'à plusieurs personnes, ou en vouvoyant'],
							correct: 0,
							noShuffle: true,
							choses: ['cossi-vas'],
							explain: '*vas* : la forme du « tu ».'
						},
						{
							q: '*Cossí anatz ?* : Marià parle…',
							options: ['à une seule personne, qu’elle tutoie', 'à plusieurs personnes, ou en vouvoyant'],
							correct: 1,
							noShuffle: true,
							choses: ['cossi-anatz'],
							explain: 'La fin en *-atz* dit « vous ». On l’entend : « a-NATS ».'
						},
						{
							q: 'Même fin en *-atz* dans un autre mot de la scène du soir : lequel ?',
							options: ['Adieu-siatz', 'A deman', 'Bon ser'],
							correct: 0,
							oc: true,
							choses: ['adieu-siatz'],
							explain: '*Adieu-siatz* : le « vous » de *Adieu*.'
						},
						{
							q: 'Pour retourner la question à quelqu’un qu’on vouvoie, on dit…',
							options: ['E vos ?', 'E tu ?'],
							correct: 0,
							oc: true,
							choses: ['va-plan-e-tu'],
							explain: '*tu* pour le tutoiement, *vos* pour le vouvoiement.'
						}
					]
				},
				{
					type: 'table',
					title: 'Pas de grammaire : des blocs tout faits',
					head: ['', 'à un ami (tu)', 'à plusieurs, ou en vouvoyant'],
					rows: [
						['saluer (bonjour et au revoir)', '*Adieu !*', '*Adieu-siatz !*'],
						['le matin, le soir', '*Bonjorn !* · *Bon ser !*', '*Bonjorn !* · *Bon ser !*'],
						['demander comment ça va', '*Cossí vas ?*', '*Cossí anatz ?*'],
						['répondre, retourner', '*Vau plan, mercés. E tu ?* · *Va plan !*', '*Va plan, mercés. E vos ?*'],
						['partir', '*A lèu !* · *A deman !* · *Al còp que ven !*', '*A lèu !* · *A deman !* · *Al còp que ven !*']
					],
					notes: [
						'*Adieu* ouvre et ferme la rencontre, comme « ciao » en italien. Il est familier : entre amis, entre jeunes. À une personne qu’on vouvoie, on dit plutôt *Bonjorn*.',
						'*Plan* veut dire « bien » : *Va plan* (ça va bien), *Vau plan* (je vais bien), *plan mercés* (merci beaucoup).',
						'*Al còp que ven* : mot à mot « à la fois qui vient », c’est-à-dire à la prochaine.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces douze expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'adieu', oc: 'Adieu !', sound: 'a-DIOU', fr: 'salut ! (bonjour et au revoir, entre amis)' },
						{ id: 'adieu-siatz', oc: 'Adieu-siatz !', sound: 'a-di-SSIATS', fr: 'pareil, à plusieurs ou en vouvoyant' },
						{ id: 'bonjorn', oc: 'Bonjorn !', sound: 'boun-DJOUR', fr: 'bonjour !' },
						{ id: 'bon-ser', oc: 'Bon ser !', sound: 'bou(n) SÉR', fr: 'bonsoir !' },
						{ id: 'cossi-vas', oc: 'Cossí vas ?', sound: 'cou-si BAS', fr: 'comment vas-tu ? (le v sonne « b »)' },
						{ id: 'cossi-anatz', oc: 'Cossí anatz ?', sound: 'cou-si a-NATS', fr: 'comment allez-vous ?' },
						{ id: 'va-plan-e-tu', oc: 'Va plan. E tu ? · E vos ?', sound: 'ba PLA. é TU ? · é BOUS ?', fr: 'ça va bien. Et toi ? · Et vous ?' },
						{ id: 'vau-plan', oc: 'Vau plan, mercés !', sound: 'baou PLA, mér-SÉS', fr: 'je vais bien, merci ! (réponse à *Cossí vas ?*)' },
						{ id: 'merce', oc: 'Mercés ! · Plan mercés !', sound: 'mér-SÉS · pla mér-SÉS', fr: 'merci ! · merci beaucoup !' },
						{ id: 'a-leu', oc: 'A lèu !', sound: 'a LÈOU', fr: 'à bientôt !' },
						{ id: 'a-deman', oc: 'A deman !', sound: 'a dé-MA', fr: 'à demain !' },
						{ id: 'al-cop-que-ven', oc: 'Al còp que ven !', sound: 'al COP qué BÈN', fr: 'à la prochaine !' }
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 10,
			blocks: [
				{
					type: 'qcm',
					title: 'Escota e causís (écoute et choisis)',
					intro:
						'Sur la place, on te parle : choisis la bonne réponse. Pense au moment de la journée, et à qui te parle.',
					items: [
						{
							ditz: { qui: 'Loís, le matin', oc: 'Bonjorn !' },
							q: 'Tu réponds :',
							options: ['Adieu, Loís !', 'A deman, Loís !', 'Bon ser, Loís !'],
							correct: 0,
							oc: true,
							choses: ['adieu'],
							explain: 'Loís est ton ami : *Adieu* pour le saluer. *Bonjorn* marche aussi.'
						},
						{
							ditz: { qui: 'Loís', oc: 'Cossí vas ?' },
							q: 'Tu réponds :',
							options: ['Va plan, mercés. E tu ?', 'Va plan, mercés. E vos ?', 'A lèu !'],
							correct: 0,
							oc: true,
							choses: ['va-plan-e-tu'],
							explain: 'Tu réponds, puis tu retournes la question à ton ami : *E tu ?*'
						},
						{
							ditz: { qui: 'Marià, le soir', oc: 'Bon ser !' },
							q: 'Tu réponds à cette voisine âgée :',
							options: ['Bon ser ! Cossí anatz ?', 'Bonjorn ! Cossí vas ?', 'Adieu ! Cossí vas ?'],
							correct: 0,
							oc: true,
							choses: ['bon-ser', 'cossi-anatz'],
							explain: 'Le soir : *Bon ser*. Une voisine âgée, on la vouvoie : *Cossí anatz ?*'
						},
						{
							ditz: { qui: 'Marià', oc: 'Va plan, mercés. E vos ?' },
							q: 'Tu réponds :',
							options: ['Va plan, plan mercés !', 'Cossí vas ?', 'Bonjorn !'],
							correct: 0,
							oc: true,
							choses: ['merce'],
							explain: '*Plan mercés* : merci beaucoup, pour une réponse chaleureuse.'
						},
						{
							ditz: { qui: 'Le marchand, le matin', oc: 'Bonjorn !' },
							q: 'Tu ne le connais pas. Tu réponds :',
							options: ['Bonjorn !', 'Adieu !', 'A lèu !'],
							correct: 0,
							oc: true,
							choses: ['bonjorn'],
							explain: 'Au marchand, qu’on vouvoie : *Bonjorn*. *Adieu* est familier.'
						},
						{
							ditz: { qui: 'Marià et ses amies', oc: 'A deman !' },
							q: 'Tu les quittes :',
							options: ['A deman ! Adieu-siatz !', 'A deman ! Adieu !', 'Bon ser ! Cossí anatz ?'],
							correct: 0,
							oc: true,
							choses: ['a-deman', 'adieu-siatz'],
							explain: 'Plusieurs personnes : *Adieu-siatz*.'
						},
						{
							ditz: { qui: 'Loís', oc: 'A lèu !' },
							q: 'Tu réponds :',
							options: ['A lèu, Loís !', 'Bon ser, Loís !', 'Cossí anatz ?'],
							correct: 0,
							oc: true,
							choses: ['a-leu'],
							explain: '*A lèu* : à bientôt, sans dire quand.'
						},
						{
							ditz: { qui: 'Yasmine, le soir', oc: 'Adieu ! Cossí vas ?' },
							q: 'Tu réponds à ton amie :',
							options: ['Va plan ! E tu ?', 'Va plan ! E vos ?', 'A deman !'],
							correct: 0,
							oc: true,
							choses: ['va-plan-e-tu'],
							explain: 'Ton amie te tutoie : *E tu ?*'
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
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{ consigne: 'À demain !', answers: ['A deman !'], choses: ['a-deman'] },
						{ consigne: 'Demande à ton ami comment il va.', answers: ['Cossí vas ?'], choses: ['cossi-vas'] },
						{ consigne: 'Réponds à *Cossí vas ?* : je vais bien, merci.', answers: ['Vau plan, mercés.', 'Va plan, mercés.'], choses: ['vau-plan', 'merce'] },
						{ consigne: 'Le soir, salue en arrivant.', answers: ['Bon ser !'], choses: ['bon-ser'] },
						{ consigne: 'Dis au revoir à un groupe d’amis.', answers: ['Adieu-siatz !'], choses: ['adieu-siatz'] },
						{ consigne: 'À bientôt !', answers: ['A lèu !'], choses: ['a-leu'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Je vais bien, merci. Et toi ?',
							tiles: ['Vau', 'plan,', 'mercés.', 'E', 'tu ?'],
							choses: ['vau-plan', 'merce'],
							explain: '*Vau plan, mercés. E tu ?* : répondre, puis retourner la question.'
						},
						{
							prompt: 'Bonsoir ! Comment allez-vous ?',
							tiles: ['Bon', 'ser !', 'Cossí', 'anatz ?'],
							choses: ['bon-ser', 'cossi-anatz'],
							explain: '*Bon ser ! Cossí anatz ?* : le soir, en vouvoyant.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute',
					intro:
						'Dis à voix haute un petit dialogue de quatre répliques : saluer, demander comment ça va, répondre et retourner la question, partir. Puis compare au modèle.',
					items: [
						{
							q: 'Le matin, avec un ami.',
							a: 'Par exemple : *Bonjorn, Lisa ! · Adieu ! Cossí vas ? · Vau plan, mercés. E tu ? · Va plan ! Al còp que ven !*'
						},
						{
							q: 'Le soir, avec ta voisine âgée.',
							a: 'Par exemple : *Bon ser ! Cossí anatz ? · Va plan, plan mercés. E vos ? · Va plan ! A deman ! · Adieu-siatz !*'
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
					title: 'Le son du jour : le a final',
					paragraphs: [
						'À la fin d’un mot, le *a* qui n’est pas accentué sonne comme un « o » léger : *la plaça* se dit « la PLA-ço ».',
						'Quand la voix appuie sur le *a*, il reste « a » : *Va plan* se dit « ba PLA ». Écoute, puis répète : *la plaça*, *va plan*, *la plaça*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*La plaça* se dit…',
							options: ['la PLA-ço', 'la PLA-ça'],
							correct: 0,
							noShuffle: true,
							explain: 'Le *a* final non accentué sonne « o ».'
						},
						{
							q: 'Et *Va plan* ?',
							options: ['ba PLA', 'bo PLA'],
							correct: 0,
							noShuffle: true,
							explain: 'Ici la voix appuie sur le *a* : il reste « a ». Et le *v* sonne « b ».'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'saluer le matin et le soir',
						'demander comment ça va, et répondre',
						'partir : à bientôt, à demain',
						'choisir entre le « tu » et le « vous »'
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : le dernier adieu de Carnaval',
					glosa: { paure: 'pauvre', carnaval: 'Carnaval' },
					paragraphs: [
						'À la fin du Carnaval, dans bien des villages, on brûle Sa Majesté Carnaval en chantant *Adieu paure Carnaval* (adieu, pauvre Carnaval). C’est sans doute l’adieu le plus célèbre de la culture occitane.',
						'À Limoux, dans l’Aude, le Carnaval dure de janvier à mars : les masques dansent sur la place chaque fin de semaine.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant saluer, demander comment ça va, et partir.',
						'Si tu en as envie : en partant, dis *A deman !* ou *A lèu !* à quelqu’un que tu reverras bientôt, une collègue, un voisin, ton frère. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
