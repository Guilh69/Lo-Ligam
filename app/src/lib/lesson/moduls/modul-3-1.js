// Module 3.1 · A1 · « Quant as d'ans ? » : unité 3 (La familha), rédigé par
// Claude le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six
// étapes, carte de l'A1 §3, règles de cursus/regles-redaccion-A1.md).
// Forme du jour : Ai… ans en bloc tout fait (aver s'explique en 3.3), les
// nombres de 0 à 20, un · una et dos · doas devant un mot féminin.
// Jeu du jour : le loto de Mameta, dictée de nombres de plus en plus vite.
// Scène de l'unité : le repas de famille chez Mameta, la grand-mère de
// Karim, dans un village près de Béziers ; Karim y a invité Núria.
// Famille de l'unité : Papeta et Mameta ; leurs filles Mirèlha (avec Rachid :
// Karim, 20 ans, et Inès, 12 ans) et Clara (avec Sofia : Joana, 7 ans).
// Lexique : cursus/lexic-A1.md, items copiés tels quels (mêmes id).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul31 = {
	id: 'modul-3-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '3-1',
	unitat: 'Unitat 3 · La familha',
	nivel: 'A1 · Modul 3.1',
	oc: 'Quant as d’ans ?',
	fr: 'Quel âge as-tu ? Compter jusqu’à vingt, dire son âge',
	cando:
		'Je peux compter de zéro à vingt, dire mon âge, demander le sien à quelqu’un et dire l’âge d’une autre personne.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25) : en attendant la scène.
	ouverture: {
		numero: 3,
		bloc: { oc: 'Ieu e los meus', fr: 'moi et les miens' },
		titre: 'La familha',
		fr: 'la famille',
		question: 'Quant as d’ans ?',
		questionFr: 'quel âge as-tu ?',
		phrase:
			'En quatre modules, tu sauras dire ton âge, nommer les gens de ta famille, dire ce que tu as, et présenter ta famille en huit phrases. À qui voudrais-tu la présenter en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Núria', 'Joana', 'Inès', 'Pèire'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'*zèro* est absent du Basic (déjà signalé par la carte) : tu le valides ?',
		'La blague de Mameta, *Vint ans… quatre còps !* (vingt ans, quatre fois), dit 80 ans sans les dizaines, qui arrivent à l’unité 5 : la tournure te va ?',
		'Joana, sept ans, tutoie sa grand-mère (*Mameta, quant as d’ans ?*) : c’est bien ton usage en famille ?',
		'*Sèt ans… e un pauc !* (sept ans et un peu plus), réplique d’enfant : naturelle, oui ou non ?',
		'Sons proposés, à confirmer à l’enregistrement : *sièis* « SYÈÏS », *uèch* « UÈTCH », *nòu* « NÒOU », *cinc* « SINK ».',
		'Au-delà de vingt ans, on écrit son âge en chiffres en attendant l’unité 5 (*Ai 34 ans*) : ça te va ?'
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
					intro:
						'Deux phrases de l’unité 2, sans regarder. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Demande à une amie si elle parle occitan.',
							answers: ['Parlas occitan ?'],
							choses: ['parlas-occitan'],
							explain: '*Parlas occitan ?* : la voix monte à la fin, et c’est une question.'
						},
						{
							consigne: 'Tu n’as pas compris : demande de répéter, poliment.',
							answers: ['Pòdes repetir, se te plai ?', 'Pòdes repetir ?'],
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir, se te plai ?* : tu peux répéter, s’il te plaît ?'
						}
					]
				},
				{
					type: 'qcm',
					title: 'Ce qui revient de l’unité 2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Qui est-ce ?',
							options: ['Qual es ?', 'Qué es aquò ?', 'D’ont siás ?'],
							correct: 0,
							oc: true,
							choses: ['qual-es'],
							explain: '*Qual es ?* pour une personne ; *Qué es aquò ?* pour une chose.'
						},
						{
							q: 'Lisa parle de Núria, qui est de Barcelone : « elle est catalane ».',
							options: ['Ela es catalana.', 'El es catalan.', 'Ela es occitana.'],
							correct: 0,
							oc: true,
							choses: ['el-ela', 'catalan-catalana'],
							explain: 'Une femme : *ela*, et *catalana* avec un *-a*.'
						},
						{
							q: 'Je ne sais pas.',
							options: ['Sabi pas.', 'Compreni pas.', 'Parli pas.'],
							correct: 0,
							oc: true,
							choses: ['sabi-pas'],
							explain: '*Sabi pas* : je ne sais pas. *Compreni pas* : je ne comprends pas.'
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
					title: 'Le repas chez Mameta',
					intro:
						'Dimanche, toute *la familha* de Karim mange chez Mameta, sa grand-mère, dans un village près de Béziers. Karim a invité Núria. Joana, sa petite cousine, veut savoir l’âge de tout le monde. Lis une première fois pour répondre à une seule question : qui ne dit pas vraiment son âge ?',
					scenes: [
						{
							title: 'Joana e Núria',
							subtitle: '(à table, avant le repas)',
							lines: [
								{ oc: 'Adieu ! Cossí te dison ?', sound: 'a-DIOU ! cou-si té DI-zoun ?', fr: 'Salut ! Comment t’appelles-tu ?' },
								{ oc: 'Me dison Núria. E tu ?', sound: 'mé DI-zoun NOU-ria. é TU ?', fr: 'Je m’appelle Núria. Et toi ?' },
								{ oc: 'Ieu, me dison Joana. Quant as d’ans ?', sound: 'YÉOU, mé DI-zoun djou-A-no. KAN as DANS ?', fr: 'Moi, je m’appelle Joana. Quel âge as-tu ?' },
								{ oc: 'Ai dètz-e-nòu ans. E tu ?', sound: 'aï dèts-é-NÒOU ANS. é TU ?', fr: 'J’ai dix-neuf ans. Et toi ?' },
								{ oc: 'Ai sèt ans ! E parli doas lengas : occitan e francés.', sound: 'aï SÈT ANS ! é PAR-li DOUOS LÉN-gos : ou-tsi-TA é fran-SÉS.', fr: 'J’ai sept ans ! Et je parle deux langues : occitan et français.' },
								{ oc: 'Ieu tanben, doas lengas : catalan e espanhòl. E Karim, quant a d’ans ?', sound: 'YÉOU tam-BÉ, DOUOS LÉN-gos : ca-ta-LA é es-pa-GNÒL. é ka-RIM, KAN a DANS ?', fr: 'Moi aussi, deux langues : catalan et espagnol. Et Karim, quel âge a-t-il ?' },
								{ oc: 'Karim ? A vint ans. E Inès a dotze ans.', sound: 'ka-RIM ? a BIN ANS. é i-NÈS a DOUT-sé ANS.', fr: 'Karim ? Il a vingt ans. Et Inès a douze ans.' }
							]
						},
						{
							title: 'Joana e Mameta',
							subtitle: '(Mameta apporte le plat)',
							lines: [
								{ oc: 'Mameta, quant as d’ans ?', sound: 'ma-MÉ-to, KAN as DANS ?', fr: 'Mamie, quel âge as-tu ?' },
								{ oc: 'Ieu ? Ai vint ans !', sound: 'YÉOU ? aï BIN ANS !', fr: 'Moi ? J’ai vingt ans !' },
								{ oc: 'Non !', sound: 'NOU !', fr: 'Non !' },
								{ oc: 'Òc ! Vint ans… quatre còps !', sound: 'OK ! BIN ANS… KA-tré COPS !', fr: 'Si ! Vingt ans… quatre fois !' },
								{ oc: 'Quatre còps vint… Mameta !', sound: 'KA-tré COPS BIN… ma-MÉ-to !', fr: 'Quatre fois vingt… Mamie !' },
								{ oc: 'E tu, Joana ? Sèt ans ?', sound: 'é TU, djou-A-no ? SÈT ANS ?', fr: 'Et toi, Joana ? Sept ans ?' },
								{ oc: 'Sèt ans… e un pauc !', sound: 'SÈT ANS… é un PAOUK !', fr: 'Sept ans… et un peu plus !' }
							]
						}
					],
					glossary: [
						{ oc: 'Mameta', sound: 'ma-MÉ-to', fr: 'Mamie : c’est ainsi qu’on appelle la grand-mère (tu le retrouves au module suivant)' },
						{ oc: 'doas lengas', sound: 'DOUOS LÉN-gos', fr: 'deux langues (lenga au pluriel)' },
						{ oc: 'quatre còps', sound: 'KA-tré COPS', fr: 'quatre fois (còp : la fois, comme dans Al còp que ven)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui ne dit pas vraiment son âge ?',
							options: ['Mameta', 'Núria', 'Joana'],
							correct: 0,
							explain:
								'Mameta plaisante : *Vint ans… quatre còps !* Vingt ans, quatre fois : elle a quatre-vingts ans. Les dizaines viendront à l’unité 5.'
						},
						{
							q: 'Núria a…',
							options: ['19 ans', '9 ans', '10 ans'],
							correct: 0,
							choses: ['nombre-19'],
							explain: '*dètz-e-nòu* : « dix et neuf », dix-neuf.'
						},
						{
							q: 'Combien de langues parle Joana ?',
							options: ['une', 'deux', 'trois'],
							correct: 1,
							noShuffle: true,
							choses: ['nombre-2'],
							explain: '*doas lengas* : deux langues, l’occitan et le français.'
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
					title: 'Ai, as, a : la forme dit qui',
					intro: 'Comme *soi, siás, es* (module 1.3), la forme dit qui a quel âge. Regarde.',
					items: [
						{
							q: '*Ai sèt ans !* Qui a sept ans ?',
							options: ['je (moi)', 'tu (toi)', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['quant-as-d-ans'],
							explain: '*Ai* : j’ai. Pas besoin de « je » : la forme suffit.'
						},
						{
							q: '*Quant as d’ans ?* On demande l’âge…',
							options: ['à moi', 'à toi', 'à lui ou à elle'],
							correct: 1,
							noShuffle: true,
							choses: ['quant-as-d-ans'],
							explain: '*as* : tu as. Mot à mot : « combien as-tu d’ans ? »'
						},
						{
							q: '*Karim a vint ans.* Ici, *a* veut dire…',
							options: ['il a', 'à', 'j’ai'],
							correct: 0,
							choses: ['a-ans'],
							explain: '*a* : il ou elle a. C’est le même petit mot que dans *A deman* (à demain) : la phrase dit lequel.'
						},
						{
							q: '*Joana parla doas lengas.* Pourquoi *doas*, et pas *dos* ?',
							options: ['parce que *lenga* est un mot féminin', 'parce que Joana est une fille', 'parce qu’elle parle bien'],
							correct: 0,
							choses: ['nombre-2'],
							explain: '*dos* devant un mot masculin (*dos ans*), *doas* devant un mot féminin (*doas lengas*) : c’est le mot qui suit qui décide.'
						}
					]
				},
				{
					type: 'table',
					title: 'Pas de grammaire : des blocs tout faits',
					head: ['pour…', 'tu dis'],
					rows: [
						['demander l’âge', '*Quant as d’ans ?*'],
						['dire ton âge', '*Ai dètz-e-nòu ans.*'],
						['dire l’âge de quelqu’un', '*Karim a vint ans.* · *Ela a sèt ans.*'],
						['1 et 2 devant un mot masculin', '*un an* · *dos ans*'],
						['1 et 2 devant un mot féminin', '*una lenga* · *doas lengas*']
					],
					notes: [
						'Mot à mot, on demande « combien as-tu d’ans ? » : *an*, c’est l’année d’âge.',
						'À partir de 2, on dit *ans*, et le *s* final se dit : « ANS ».',
						'« J’ai », « tu as », « il a » : le verbe « avoir » s’explique au module 3.3. Pour l’instant, ce sont des blocs tout faits.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/5) : l’âge',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'la-familha', oc: 'la familha', sound: 'la fa-MI-lyo', fr: 'la famille (titre de l’unité)' },
						{ id: 'quant-as-d-ans', oc: 'Quant as d’ans ? · Ai… ans.', sound: 'KAN as DANS · aï… ANS', fr: 'quel âge as-tu ? · j’ai… ans. (mot à mot : combien as-tu d’ans ?)' },
						{ id: 'a-ans', oc: 'Ela a… ans. · un an', sound: 'É-lo a… ANS · u-NAN', fr: 'elle a… ans. · un an' },
						{ id: 'nombre-1', oc: 'un · una', sound: 'U(N) · U-no', fr: '1 (au masculin · au féminin)' },
						{ id: 'nombre-2', oc: 'dos · doas', sound: 'DOUS · DOUOS', fr: '2 (au masculin · au féminin)' }
					]
				},
				{
					type: 'qcm',
					title: 'Un ou una, dos ou doas ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Le titre de l’unité, *la familha*, veut dire…',
							options: ['la famille', 'la fille', 'la fête'],
							correct: 0,
							choses: ['la-familha'],
							explain: '*la familha* : la famille, « la fa-MI-lyo ».'
						},
						{
							q: 'Pour dire 1 devant *lenga*, un mot féminin :',
							options: ['una', 'un'],
							correct: 0,
							oc: true,
							noShuffle: true,
							choses: ['nombre-1'],
							explain: '*una lenga*. Devant un mot masculin : *un an*.'
						},
						{
							q: 'Pour dire 2 devant *ans*, un mot masculin :',
							options: ['dos', 'doas'],
							correct: 0,
							oc: true,
							noShuffle: true,
							choses: ['nombre-2'],
							explain: '*dos ans*. *doas* va devant un mot féminin : *doas lengas*.'
						},
						{
							q: '« Elle a sept ans. »',
							options: ['Ela a sèt ans.', 'Ai sèt ans.', 'Quant as d’ans ?'],
							correct: 0,
							oc: true,
							choses: ['a-ans'],
							explain: '*Ela a…* : elle a. *Ai…* : j’ai.'
						},
						{
							q: 'Pour demander son âge à un ami :',
							options: ['Quant as d’ans ?', 'Cossí te dison ?', 'D’ont siás ?'],
							correct: 0,
							oc: true,
							choses: ['quant-as-d-ans'],
							explain: '*Cossí te dison ?* demande le nom ; *D’ont siás ?*, d’où il est.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// Jeu prévu par la carte : dictée de nombres, de plus en plus vite (à
		// coder : le son de chaque numéro, une grille de loto, la vitesse qui
		// monte). Version simple : Mameta annonce (qcm, je reconnais), puis tu
		// annonces (escriure, je produis), par séries de cinq nombres au plus.
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 15,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (2/5) : de 0 à 6',
					intro:
						'Après le repas, Mameta sort le loto et annonce les numéros en occitan. Tu as déjà « un » et « dos » ; voici les autres, jusqu’à 6.',
					items: [
						{ id: 'nombre-0', oc: 'zèro', sound: 'ZÈ-rou', fr: '0' },
						{ id: 'nombre-3', oc: 'tres', sound: 'TRÉS', fr: '3' },
						{ id: 'nombre-4', oc: 'quatre', sound: 'KA-tré', fr: '4' },
						{ id: 'nombre-5', oc: 'cinc', sound: 'SINK', fr: '5' },
						{ id: 'nombre-6', oc: 'sièis', sound: 'SYÈÏS', fr: '6' }
					]
				},
				{
					type: 'qcm',
					title: 'Mameta annonce (1)',
					intro: 'Coche le numéro sur ta grille.',
					items: [
						{
							ditz: { qui: 'Mameta', oc: 'Tres !' },
							q: 'Tu coches :',
							options: ['3', '2', '6'],
							correct: 0,
							choses: ['nombre-3'],
							explain: '*tres* : 3.'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Quatre… e cinc !' },
							q: 'Tu coches :',
							options: ['4 et 5', '4 et 6', '3 et 5'],
							correct: 0,
							choses: ['nombre-4', 'nombre-5'],
							explain: '*quatre* : 4. *cinc* : 5, et le *c* final se dit, « SINK ».'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Sièis… e zèro !' },
							q: 'Tu coches :',
							options: ['6 et 0', '5 et 0', '6 et 2'],
							correct: 0,
							choses: ['nombre-6', 'nombre-0'],
							explain: '*sièis* : 6, « SYÈÏS ». *zèro* : 0.'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (3/5) : de 7 à 10',
					intro: 'La partie continue.',
					items: [
						{ id: 'nombre-7', oc: 'sèt', sound: 'SÈT', fr: '7' },
						{ id: 'nombre-8', oc: 'uèch', sound: 'UÈTCH', fr: '8' },
						{ id: 'nombre-9', oc: 'nòu', sound: 'NÒOU', fr: '9' },
						{ id: 'nombre-10', oc: 'dètz', sound: 'DÈTS', fr: '10' }
					]
				},
				{
					type: 'qcm',
					title: 'Mameta annonce (2)',
					intro: 'Coche les deux numéros.',
					items: [
						{
							ditz: { qui: 'Mameta', oc: 'Sèt… e uèch !' },
							q: 'Tu coches :',
							options: ['7 et 8', '6 et 8', '7 et 9'],
							correct: 0,
							choses: ['nombre-7', 'nombre-8'],
							explain: '*sèt* : 7. *uèch* : 8, « UÈTCH ».'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Nòu… e dètz !' },
							q: 'Tu coches :',
							options: ['9 et 10', '8 et 10', '9 et 6'],
							correct: 0,
							choses: ['nombre-9', 'nombre-10'],
							explain: '*nòu* : 9. *dètz* : 10, et « tz » sonne « ts ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'À toi d’annoncer (1)',
					intro:
						'C’est ton tour : écris les numéros en lettres. Un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{ consigne: 'Écris en lettres : 3', answers: ['tres'], choses: ['nombre-3'] },
						{ consigne: 'Écris en lettres : 8', answers: ['uèch'], choses: ['nombre-8'] },
						{ consigne: 'Écris en lettres : 5', answers: ['cinc'], choses: ['nombre-5'] },
						{ consigne: 'Écris en lettres : 10', answers: ['dètz'], choses: ['nombre-10'] },
						{ consigne: 'Écris en lettres : 0', answers: ['zèro'], choses: ['nombre-0'] },
						{ consigne: 'Écris en lettres : 6', answers: ['sièis'], choses: ['nombre-6'] },
						{ consigne: 'Écris en lettres : 9', answers: ['nòu'], choses: ['nombre-9'] },
						{ consigne: 'Écris en lettres : 4', answers: ['quatre'], choses: ['nombre-4'] },
						{ consigne: 'Écris en lettres : 7', answers: ['sèt'], choses: ['nombre-7'] },
						{ consigne: 'Écris 2, devant un mot féminin.', answers: ['doas'], choses: ['nombre-2'], explain: '*doas lengas*, mais *dos ans*.' },
						{ consigne: 'Écris 1, devant un mot féminin.', answers: ['una'], choses: ['nombre-1'], explain: '*una lenga*, mais *un an*.' }
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (4/5) : de 11 à 15',
					intro:
						'Mameta accélère. Regarde : « onze, dotze, tretze, catòrze, quinze » ressemblent à « un, dos, tres, quatre, cinc ».',
					items: [
						{ id: 'nombre-11', oc: 'onze', sound: 'OUN-zé', fr: '11' },
						{ id: 'nombre-12', oc: 'dotze', sound: 'DOUT-sé', fr: '12' },
						{ id: 'nombre-13', oc: 'tretze', sound: 'TRÉT-sé', fr: '13' },
						{ id: 'nombre-14', oc: 'catòrze', sound: 'ca-TÒR-zé', fr: '14' },
						{ id: 'nombre-15', oc: 'quinze', sound: 'KIN-zé', fr: '15' }
					]
				},
				{
					type: 'qcm',
					title: 'Mameta annonce (3), plus vite',
					intro: 'Attention aux mots qui se ressemblent.',
					items: [
						{
							ditz: { qui: 'Mameta', oc: 'Tretze !' },
							q: 'Tu coches :',
							options: ['13', '3', '12'],
							correct: 0,
							choses: ['nombre-13'],
							explain: '*tretze* : 13 ; *tres* : 3.'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Catòrze… e dotze !' },
							q: 'Tu coches :',
							options: ['14 et 12', '4 et 12', '14 et 2'],
							correct: 0,
							choses: ['nombre-14', 'nombre-12'],
							explain: '*catòrze* : 14 (*quatre* : 4). *dotze* : 12 (*dos* : 2).'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Onze… e quinze !' },
							q: 'Tu coches :',
							options: ['11 et 15', '1 et 15', '11 et 5'],
							correct: 0,
							choses: ['nombre-11', 'nombre-15'],
							explain: '*onze* : 11. *quinze* : 15, « KIN-zé » (*cinc* : 5).'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (5/5) : de 16 à 20',
					intro:
						'Pour 17, 18 et 19, on dit « dix et sept », « dix et huit », « dix et neuf », avec des traits d’union. Dernière série !',
					items: [
						{ id: 'nombre-16', oc: 'setze', sound: 'SÉT-sé', fr: '16' },
						{ id: 'nombre-17', oc: 'dètz-e-sèt', sound: 'dèts-é-SÈT', fr: '17 (dix et sept)' },
						{ id: 'nombre-18', oc: 'dètz-e-uèch', sound: 'dèts-é-UÈTCH', fr: '18' },
						{ id: 'nombre-19', oc: 'dètz-e-nòu', sound: 'dèts-é-NÒOU', fr: '19' },
						{ id: 'nombre-20', oc: 'vint', sound: 'BIN', fr: '20 (le v sonne « b »)' }
					]
				},
				{
					type: 'qcm',
					title: 'Mameta annonce (4), encore plus vite',
					intro: 'Plus que quelques numéros pour gagner.',
					items: [
						{
							ditz: { qui: 'Mameta', oc: 'Setze !' },
							q: 'Tu coches :',
							options: ['16', '7', '6'],
							correct: 0,
							choses: ['nombre-16'],
							explain: '*setze* : 16 ; *sèt* : 7 ; *sièis* : 6.'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Dètz-e-sèt… e dètz-e-nòu !' },
							q: 'Tu coches :',
							options: ['17 et 19', '7 et 19', '17 et 9'],
							correct: 0,
							choses: ['nombre-17', 'nombre-19'],
							explain: '*dètz-e-sèt* : dix et sept. *dètz-e-nòu* : dix et neuf.'
						},
						{
							ditz: { qui: 'Mameta', oc: 'Dètz-e-uèch… e vint !' },
							q: 'Tu coches :',
							options: ['18 et 20', '8 et 20', '18 et 10'],
							correct: 0,
							choses: ['nombre-18', 'nombre-20'],
							explain: '*dètz-e-uèch* : 18. *vint* : 20, « BIN ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'À toi d’annoncer (2), plus vite',
					intro:
						'Deux numéros à la fois, comme quand le loto s’accélère. Entre les deux : *e* (et). Un trait d’union oublié, on te le montre.',
					items: [
						{ consigne: 'Écris en lettres : 12 et 5', answers: ['dotze e cinc', 'dotze cinc'], choses: ['nombre-12', 'nombre-5'] },
						{ consigne: 'Écris en lettres : 14 et 9', answers: ['catòrze e nòu', 'catòrze nòu'], choses: ['nombre-14', 'nombre-9'] },
						{ consigne: 'Écris en lettres : 11 et 16', answers: ['onze e setze', 'onze setze'], choses: ['nombre-11', 'nombre-16'] },
						{ consigne: 'Écris en lettres : 13 et 18', answers: ['tretze e dètz-e-uèch', 'tretze dètz-e-uèch'], choses: ['nombre-13', 'nombre-18'] },
						{ consigne: 'Écris en lettres : 17 et 15', answers: ['dètz-e-sèt e quinze', 'dètz-e-sèt quinze'], choses: ['nombre-17', 'nombre-15'] },
						{ consigne: 'Écris en lettres : 19 et 20', answers: ['dètz-e-nòu e vint', 'dètz-e-nòu vint'], choses: ['nombre-19', 'nombre-20'] }
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
						'Écris en occitan, pour toi. Ton âge : en lettres jusqu’à vingt ; au-delà, écris-le en chiffres pour l’instant (*Ai 34 ans*), les dizaines arrivent à l’unité 5.',
					items: [
						{ consigne: 'Dis ton âge.', debut: ['Ai'], choses: ['quant-as-d-ans'], explain: '*Ai*, ton âge, puis *ans*.' },
						{ consigne: 'Demande son âge à Joana.', answers: ['Quant as d’ans ?', 'Joana, quant as d’ans ?'], choses: ['quant-as-d-ans'] },
						{ consigne: 'Inès a douze ans.', answers: ['Inès a dotze ans.'], choses: ['a-ans', 'nombre-12'] },
						{
							consigne: 'Parle d’un enfant que tu connais : il a… ou elle a…, puis son âge.',
							debut: ['El a', 'Ela a'],
							choses: ['a-ans', 'el-ela'],
							explain: '*El a… ans* pour un garçon, *Ela a… ans* pour une fille.'
						},
						{ consigne: 'Écris le titre de l’unité : la famille.', answers: ['la familha'], choses: ['la-familha'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Núria a dix-neuf ans.',
							tiles: ['Núria', 'a', 'dètz-e-nòu', 'ans.'],
							choses: ['a-ans', 'nombre-19'],
							explain: '*Núria a dètz-e-nòu ans.*'
						},
						{
							prompt: 'J’ai vingt ans. Et toi, quel âge as-tu ?',
							tiles: ['Ai', 'vint', 'ans.', 'E', 'tu,', 'quant', 'as', 'd’ans ?'],
							choses: ['quant-as-d-ans', 'nombre-20'],
							explain: '*Ai vint ans. E tu, quant as d’ans ?*'
						},
						{
							prompt: 'Joana parle deux langues.',
							tiles: ['Joana', 'parla', 'doas', 'lengas.'],
							choses: ['nombre-2'],
							explain: '*doas*, parce que *lenga* est un mot féminin.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : ta grille de loto',
					intro: 'Lis chaque grille à voix haute, en occitan, puis regarde la réponse.',
					items: [
						{ q: '3 · 8 · 11 · 14 · 0 · 9', a: '*tres* · *uèch* · *onze* · *catòrze* · *zèro* · *nòu*' },
						{ q: '5 · 10 · 13 · 16 · 6 · 17', a: '*cinc* · *dètz* · *tretze* · *setze* · *sièis* · *dètz-e-sèt*' },
						{ q: '15 · 4 · 18 · 7 · 12 · 1', a: '*quinze* · *quatre* · *dètz-e-uèch* · *sèt* · *dotze* · *un*' }
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro:
						'Présente deux ou trois personnes que tu connais, avec leur âge (en lettres jusqu’à vingt). Puis compare au modèle.',
					items: [
						{
							q: 'Des enfants de ton entourage, ou les personnages du repas.',
							a: 'Par exemple : *Joana a sèt ans. Inès a dotze ans. E Pèire ? A un an !*'
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
					title: 'Le son du jour : le v sonne « b »',
					paragraphs: [
						'En occitan, le *v* sonne « b » : *vint* se dit « BIN », et le *t* final ne se dit pas.',
						'Tu l’entends depuis le début : *Cossí vas ?* « cou-si BAS », *Vau plan* « baou PLA », *la vila* « la BI-lo ».',
						'Écoute, puis répète : *vint*, *la vila*, *vint*, *vau*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*vint* se dit…',
							options: ['BIN', 'VIN'],
							correct: 0,
							noShuffle: true,
							explain: '« VIN », c’est la lecture à la française. En occitan, le *v* sonne « b », et le *t* final reste muet : « BIN ».'
						},
						{
							q: '*la vila* se dit…',
							options: ['la BI-lo', 'la VI-la'],
							correct: 0,
							noShuffle: true,
							explain: 'Le *v* sonne « b », et le *a* final sonne « o » (module 1.1) : « la BI-lo ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis à voix haute : *vint*, *Cossí vas ?*, *Vau plan*, *la vila*.',
							a: '« BIN », « cou-si BAS », « baou PLA », « la BI-lo » : partout, le *v* sonne « b », sans forcer.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : l’école en occitan',
					glosa: { calandreta: 'petite alouette, le nom de ces écoles', calandretas: 'les écoles Calandreta' },
					paragraphs: [
						'Joana va à la *Calandreta*, « la petite alouette ». Les *Calandretas* sont des écoles associatives et laïques où l’on apprend en occitan, avec les programmes de l’Éducation nationale.',
						'La première a ouvert à Pau, à la rentrée 1979-1980. Source : Wikipédia, article « École Calandreta ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'compter de zéro à vingt',
						'dire mon âge, et demander le sien à quelqu’un',
						'dire l’âge d’une autre personne',
						'choisir entre *un* et *una*, *dos* et *doas*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant compter jusqu’à vingt et dire ton âge en occitan.',
						'Si tu en as envie : demande son âge à un enfant que tu connais, avec *Quant as d’ans ?* S’il répond en français, redis le nombre en occitan avec lui. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
