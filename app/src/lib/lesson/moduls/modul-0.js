// Module 0 · A1 · « Benvengut dins lo mond occitan » : la porte d'entrée du
// parcours, sans compte (carte de l'A1 §1 : « Tu l'as déjà entendu »),
// rédigée par Claude le 2026-11-01 d'après le cours 0 de Romain
// (cursus/visio-A1.md §2 : ce qu'est l'occitan, Amor d'Aussau, un texte à
// lire, les six premières formules). Chemin allégé, toujours en six étapes :
// ce qu'on connaît déjà · Escota · l'occitan en neuf points · le jeu ·
// A tu ! · le son et le bilan.
// Encadré « À retenir » sans `id` : les six cartes appartiennent au module
// 1.1, et les exercices d'ici portent ses id (cursus/lexic-A1.md §0, point 4).
// Texte à lire : Guilhem IX (domaine public) à la place du poème de Max
// Roqueta, protégé (cursus/cultura-A1.md, module 0).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain (le poème
// de Guilhem IX est une citation d'ancien occitan : pas de vérification).

export const modul0 = {
	id: 'modul-0',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '0',
	unitat: 'Modul 0 · Benvengut',
	nivel: 'A1 · Modul 0',
	oc: 'Benvengut dins lo mond occitan',
	fr: 'Bienvenue dans le monde occitan',
	cando:
		'Je peux dire en quelques mots ce qu’est l’occitan et où on le parle, saluer un ami, lui demander comment il va, répondre et partir.',
	durada: '~35 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Loís', 'Karim'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'« Une langue dialectale » : ta formule est gardée, suivie de « elle se parle un peu différemment d’une région à l’autre », pour qu’on n’entende pas « un dialecte ». Préfères-tu la variante « une langue riche de six grands dialectes » ?',
		'Locuteurs : seul le chiffre sourcé est affiché, « près de 600 000 en Nouvelle-Aquitaine, en Occitanie et au Val d’Aran » (enquête de l’OPLO, 2020), suivi de « et beaucoup plus de personnes qui la comprennent ou l’ont entendue chez leurs grands-parents » (formulation sûre de cultura-A1.md). « Plusieurs millions » n’a pas de source solide : on le laisse de côté ?',
		'Texte à lire : la première strophe de Guilhem IX, *Farai un vers de dreyt nien* (domaine public, traduction de Jeanroy, 1913), à la place du poème de Max Roqueta, protégé jusqu’en 2075 et réservé à la visio. D’accord ?',
		'*Amor d’Aussau* : proposée dans la version de L’Ouzoum (lien Deezer). Auteur et année ne sont pas confirmés, donc pas affichés. Cette version te va ?',
		'Le titre dit *Benvengut* (masculin) : ajouter *benvenguda* (✓ lo Basic) à côté, pour les femmes ?',
		'*fada* : lo Basic le donne pour « fée » en languedocien. La page le rapproche du « fada » du Midi (un peu fou) par un clin d’œil, sans affirmer d’étymologie. Ça te va ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Tu l'as déjà entendu
		{
			title: 'Tu l’as déjà entendu',
			minutes: 3,
			blocks: [
				{
					type: 'reveal',
					title: 'Ces mots du Midi viennent de l’occitan',
					intro:
						'Si tu as passé un peu de temps dans le Sud, tu connais déjà des mots occitans. Pour chaque phrase du français du Midi, devine le sens, puis regarde.',
					// Le titre du module (traduit juste en dessous, modul.fr) et les mots
					// du français du Midi, expliqués en passant (cursus/lexic-A1.md, module 0).
					glosa: {
						benvengut: 'bienvenu',
						dins: 'dans',
						lo: 'le',
						mond: 'monde',
						occitan: 'occitan',
						pichon: 'petit',
						pecaire: 'le pauvre ! (pour plaindre)',
						pegar: 'coller',
						fada: 'fée',
						garriga: 'garrigue',
						caçolet: 'cassoulet'
					},
					items: [
						{
							q: '« Qu’il est mignon, ce pitchoun ! » Le pitchoun, c’est qui ?',
							a: 'Le petit, l’enfant. En occitan, *pichon* veut dire petit.'
						},
						{
							q: '« Peuchère ! » On le dit quand…',
							a: '… on plaint quelqu’un : le pauvre ! C’est l’occitan *pecaire*.'
						},
						{
							q: '« Ça pègue ! » Qu’est-ce qui pègue ?',
							a: 'Ce qui colle, comme des doigts pleins de confiture. De l’occitan *pegar* : coller.'
						},
						{
							q: '« Il est un peu fada, celui-là ! » Il est…',
							a: '… un peu fou. Et en occitan, *fada* veut dire « fée » : à chacun d’imaginer le lien.'
						},
						{
							q: 'Et la garrigue, le cassoulet ?',
							a: 'Venus de l’occitan, eux aussi : *garriga*, *caçolet*. Le français du Midi en est plein, et il en garde la musique : c’est elle qu’on appelle l’accent du Midi.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 2. Escota
		{
			title: 'Escota',
			fr: 'écoute',
			minutes: 6,
			blocks: [
				{
					type: 'dialogue',
					title: 'Deux rencontres dans la journée',
					intro:
						'Le matin, Yasmine croise son ami Loís, qui court attraper son bus. Le soir, elle retrouve son ami Karim. Tous les trois se tutoient. Lis une première fois pour répondre à une seule question : quel mot sert à la fois à dire bonjour et au revoir ?',
					scenes: [
						{
							title: 'Yasmine e Loís',
							subtitle: '(le matin, à l’arrêt du bus)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Cossí vas ?', sound: 'a-DIOU, yas-MI-ne ! cou-si BAS ?', fr: 'Salut, Yasmine ! Comment vas-tu ?' },
								{ oc: 'Adieu, Loís ! Va plan, e tu ?', sound: 'a-DIOU, lou-ÍS ! ba PLA, é TU ?', fr: 'Salut, Loís ! Ça va bien, et toi ?' },
								{ oc: 'Vau plan, mercés ! A lèu !', sound: 'baou PLA, mér-SÉS ! a LÈOU !', fr: 'Je vais bien, merci ! À bientôt !' },
								{ oc: 'A lèu, Loís !', sound: 'a LÈOU, lou-ÍS !', fr: 'À bientôt, Loís !' }
							]
						},
						{
							title: 'Yasmine e Karim',
							subtitle: '(le soir, sur la place)',
							lines: [
								{ oc: 'Adieu, Karim !', sound: 'a-DIOU, ka-RIM !', fr: 'Salut, Karim !' },
								{ oc: 'Adieu, Yasmine ! Cossí vas ?', sound: 'a-DIOU, yas-MI-ne ! cou-si BAS ?', fr: 'Salut, Yasmine ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! E tu ?', sound: 'baou PLA, mér-SÉS ! é TU ?', fr: 'Je vais bien, merci ! Et toi ?' },
								{ oc: 'Va plan !', sound: 'ba PLA !', fr: 'Ça va bien !' },
								{ oc: 'Al còp que ven, Karim !', sound: 'al COP qué BÈN, ka-RIM !', fr: 'À la prochaine, Karim !' },
								{ oc: 'Adieu, Yasmine !', sound: 'a-DIOU, yas-MI-ne !', fr: 'Salut, Yasmine !' }
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
							q: 'Quel mot sert à la fois à dire bonjour et au revoir ?',
							options: ['Adieu', 'A lèu', 'Cossí vas ?'],
							correct: 0,
							oc: true,
							choses: ['adieu'],
							explain: '*Adieu* ouvre les deux rencontres, et Karim le redit pour partir. Il veut dire salut : bonjour, et aussi au revoir.'
						},
						{
							q: 'Le soir, comment va Yasmine ?',
							options: ['bien', 'mal', 'elle ne le dit pas'],
							correct: 0,
							noShuffle: true,
							choses: ['vau-plan'],
							explain: '*Vau plan, mercés !* : je vais bien, merci ! *Plan* veut dire bien.'
						},
						{
							q: 'Le matin, Loís est pressé. Que dit-il pour partir ?',
							options: ['A lèu !', 'Va plan, e tu ?', 'Cossí vas ?'],
							correct: 0,
							oc: true,
							choses: ['a-leu'],
							explain: '*A lèu !* : à bientôt ! Le soir, Yasmine part avec *Al còp que ven !* : à la prochaine !'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Qu'est-ce que l'occitan ?
		// Le cours 0 de Romain en visio : culture, chanson, texte (visio-A1.md §2),
		// faits et sources dans cursus/cultura-A1.md, module 0.
		{
			title: 'Qu’est-ce que l’occitan ?',
			minutes: 8,
			blocks: [
				{
					type: 'qcm',
					title: 'Devine d’abord',
					intro: 'Quatre questions pour commencer : réponds d’instinct, l’explication suit.',
					items: [
						{
							q: 'L’occitan est de la même famille que…',
							options: ['le français, le catalan et l’italien', 'le breton', 'le basque'],
							correct: 0,
							explain: 'C’est une langue latine : elle est née du latin, comme le français, le catalan ou l’italien.'
						},
						{
							q: 'Où l’occitan est-il langue officielle ?',
							options: ['en Catalogne', 'en France', 'nulle part'],
							correct: 0,
							explain: 'En Catalogne, depuis 2006 : au Val d’Aran, on l’appelle l’aranais. En France, il n’a pas de statut officiel ; en Italie, une loi le protège.'
						},
						{
							q: 'Combien de personnes parlent occitan en Nouvelle-Aquitaine, en Occitanie et au Val d’Aran ?',
							options: ['près de 600 000', 'près de 6 000', 'presque personne'],
							correct: 0,
							explain: 'Près de 600 000, d’après l’enquête de l’Office public de la langue occitane (2020) : environ 7 % des habitants, et 62 % au Val d’Aran.'
						},
						{
							q: 'Le plus ancien troubadour dont on a gardé les chansons a vécu…',
							options: ['vers l’an 1100', 'vers l’an 1500', 'vers l’an 1800'],
							correct: 0,
							noShuffle: true,
							explain: 'Guilhem IX, duc d’Aquitaine (1071-1126). Tu vas lire le début d’un de ses poèmes.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'L’occitan en neuf points',
					paragraphs: ['L’occitan, c’est :'],
					list: [
						'une langue latine ;',
						'une langue dialectale : elle se parle un peu différemment d’une région à l’autre, et ce cours t’apprend le languedocien ;',
						'minorisée : dans la vie de tous les jours, le français a pris presque toute la place ;',
						'sans statut officiel en France (elle l’est en Catalogne, et une loi la protège en Italie) ;',
						'parlée dans la moitié sud de la France, dans le Val d’Aran et dans les vallées occitanes d’Italie ;',
						'près de 600 000 locuteurs en Nouvelle-Aquitaine, en Occitanie et au Val d’Aran (enquête de 2020), et beaucoup plus de personnes qui la comprennent ou l’ont entendue chez leurs grands-parents ;',
						'une langue de littérature, qui a connu le fameux mouvement des troubadours ;',
						'la langue d’où vient l’accent méridional, si chantant ;',
						'une langue fragile, mais portée par des passionnés (en 2020, 92 % des personnes interrogées souhaitaient qu’elle se maintienne ou se développe).'
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'À écouter : Amor d’Aussau',
					glosa: { 'Amor d’Aussau': 'amour d’Ossau' },
					paragraphs: [
						'Une chanson du Béarn, chantée en gascon : un autre dialecte de l’occitan que le languedocien de ce cours. *Aussau*, c’est la vallée d’Ossau, dans les Pyrénées.',
						'Cherche-la sur ta plateforme d’écoute, par exemple dans la version du groupe L’Ouzoum, et écoute-la une fois sans chercher à tout comprendre : seulement pour la musique de la langue.'
					],
					// Lien d'écoute (cursus/cultura-A1.md, module 0). NoteBlock n'affiche
					// pas encore de lien : à coder sur le modèle de `lien` dans CartaBlock.
					lien: { href: 'https://www.deezer.com/track/4080142441', texte: 'Écouter Amor d’Aussau (L’Ouzoum) sur Deezer' }
				},
				{
					type: 'reveal',
					title: 'À lire : un poème de plus de neuf siècles',
					intro:
						'Vers l’an 1100, Guilhem IX, duc d’Aquitaine, le plus ancien troubadour dont on a gardé les chansons, commence ainsi un poème. C’est l’occitan de son temps, dans l’orthographe d’une édition de 1913.',
					// Le poème, traduit dans la réponse (Alfred Jeanroy, 1913, domaine
					// public) : glosé vers par vers.
					glosa: {
						'Farai un vers de dreyt nien': 'je ferai un « vers » sur le pur néant',
						'Non er de mi ni d’autra gen': 'il n’y sera question ni de moi ni d’autres gens',
						'Non er d’amor ni de joven': 'ni d’amour ni de noblesse',
						'Ni de ren au': 'ni d’autre chose',
						'Qu’enans fo trobatz en durmen': 'je viens de le composer en dormant',
						'Sobre chevau': 'sur un cheval'
					},
					items: [
						{
							q: 'Lis-le à voix haute, sans chercher à tout comprendre : *Farai un vers de dreyt nien : / Non er de mi ni d’autra gen, / Non er d’amor ni de joven, / Ni de ren au, / Qu’enans fo trobatz en durmen / Sobre chevau.* À ton avis, de quoi parle-t-il ?',
							a: 'De rien du tout ! « Je ferai un “vers” sur le pur néant : il n’y sera question ni de moi ni d’autres gens, ni d’amour ni de noblesse, ni d’autre chose ; je viens de le composer en dormant, sur un cheval. » (traduction d’Alfred Jeanroy, 1913). La littérature occitane commence par un clin d’œil.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 6,
			blocks: [
				// Pas d'`id` dans ces deux encadrés : les six cartes appartiennent au
				// module 1.1 (cursus/lexic-A1.md §0, point 4). Items copiés du lexique.
				{
					type: 'chunks',
					title: 'À retenir : saluer, demander, répondre',
					intro: 'Ça sonne comme : la syllabe forte en capitales.',
					items: [
						{ oc: 'Adieu !', sound: 'a-DIOU', fr: 'salut ! (bonjour et au revoir, entre amis)' },
						{ oc: 'Cossí vas ?', sound: 'cou-si BAS', fr: 'comment vas-tu ? (le v sonne « b »)' },
						{ oc: 'Va plan, e tu ?', sound: 'ba PLA, é TU', fr: 'ça va bien, et toi ?' },
						{ oc: 'Vau plan, mercés !', sound: 'baou PLA, mér-SÉS', fr: 'je vais bien, merci ! (réponse à *Cossí vas ?*)' }
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : partir',
					intro: 'Ces six formules reviennent dans l’unité 1, et dans ton carnet de révision.',
					items: [
						{ oc: 'Al còp que ven !', sound: 'al COP qué BÈN', fr: 'à la prochaine !' },
						{ oc: 'A lèu !', sound: 'a LÈOU', fr: 'à bientôt !' }
					]
				},
				{
					type: 'causida',
					title: 'Toi et Loís',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Loís te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Loís',
					tours: [
						{
							situacion: 'Le soir, à la sortie d’un concert, tu croises ton ami Loís.',
							ditz: 'Adieu ! Cossí vas ?',
							options: [
								{ oc: 'Va plan, e tu ?', bon: true },
								{ oc: 'A lèu !', reaccion: 'Loís s’étonne : tu pars déjà ? Il vient de te demander comment tu vas.' },
								{ oc: 'Cossí vas ?', reaccion: 'Loís rit : c’est lui qui t’a posé la question le premier.' }
							],
							choses: ['va-plan-e-tu'],
							explain: 'Tu réponds, puis tu retournes la question : *Va plan, e tu ?*'
						},
						{
							situacion: 'Loís te répond, un œil sur l’heure : son bus arrive.',
							ditz: 'Vau plan, mercés !',
							options: [
								{ oc: 'A lèu, Loís !', bon: true },
								{ oc: 'Cossí vas ?', reaccion: 'Loís rit en courant : il vient de te le dire, il va bien !' },
								{ oc: 'Va plan, e tu ?', reaccion: 'Loís hésite, un pied dans le bus : il ne t’a rien demandé.' }
							],
							choses: ['a-leu'],
							explain: '*A lèu !* : à bientôt !'
						},
						{
							ditz: 'Al còp que ven !',
							options: [
								{ oc: 'Adieu !', bon: true },
								{ oc: 'Cossí vas ?', reaccion: 'Les portes du bus se ferment : trop tard pour une nouvelle question !' },
								{ oc: 'Vau plan, mercés !', reaccion: 'Loís sourit derrière la vitre : il ne t’a rien demandé.' }
							],
							choses: ['adieu'],
							explain: '*Adieu* sert aussi à partir : salut !'
						},
						{
							situacion: 'Le lendemain matin, tu croises de nouveau Loís, à la boulangerie. Cette fois, c’est toi qui commences.',
							options: [
								{ oc: 'Adieu, Loís ! Cossí vas ?', bon: true },
								{ oc: 'Al còp que ven, Loís !', reaccion: 'Loís, surpris, te tient la porte : tu pars déjà ?' },
								{ oc: 'Vau plan, mercés !', reaccion: 'Loís sourit : il ne t’a encore rien demandé.' }
							],
							choses: ['adieu', 'cossi-vas'],
							explain: 'Saluer, puis demander : *Adieu, Loís ! Cossí vas ?*'
						},
						{
							ditz: 'Va plan, e tu ?',
							options: [
								{ oc: 'Vau plan, mercés !', bon: true },
								{ oc: 'Adieu !', reaccion: 'Loís rit : vous vous êtes déjà salués !' },
								{ oc: 'Cossí vas ?', reaccion: 'Loís sourit : tu viens de le lui demander.' }
							],
							choses: ['vau-plan'],
							explain: '*Vau plan, mercés !* : je vais bien, merci !'
						},
						{
							situacion: 'Ton pain sous le bras, tu t’en vas.',
							options: [
								{ oc: 'Al còp que ven !', bon: true },
								{ oc: 'Va plan, e tu ?', reaccion: 'Loís attend, perplexe : il ne t’a rien demandé.' },
								{ oc: 'Cossí vas ?', reaccion: 'Loís hausse un sourcil : il vient de te répondre.' }
							],
							choses: ['al-cop-que-ven'],
							explain: '*Al còp que ven !* : à la prochaine !'
						}
					],
					fin: 'Bravo ! Deux rencontres en occitan, du salut à l’au revoir.'
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 7,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{ consigne: 'Salue un ami : salut !', answers: ['Adieu !'], choses: ['adieu'] },
						{ consigne: 'Demande-lui comment il va.', answers: ['Cossí vas ?'], choses: ['cossi-vas'] },
						{ consigne: 'Ça va bien, et toi ?', answers: ['Va plan, e tu ?'], choses: ['va-plan-e-tu'] },
						{ consigne: 'Réponds pour toi à *Cossí vas ?* : je vais bien, merci !', answers: ['Vau plan, mercés !', 'Va plan, mercés !'], choses: ['vau-plan'] },
						{ consigne: 'À bientôt !', answers: ['A lèu !'], choses: ['a-leu'] },
						{ consigne: 'À la prochaine !', answers: ['Al còp que ven !'], choses: ['al-cop-que-ven'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Salut, Karim ! Comment vas-tu ?',
							tiles: ['Adieu,', 'Karim !', 'Cossí', 'vas ?'],
							choses: ['adieu', 'cossi-vas'],
							explain: '*Adieu, Karim ! Cossí vas ?* : saluer, puis demander.'
						},
						{
							prompt: 'Je vais bien, merci ! À la prochaine !',
							tiles: ['Vau', 'plan,', 'mercés !', 'Al', 'còp', 'que', 'ven !'],
							choses: ['vau-plan', 'al-cop-que-ven'],
							explain: '*Vau plan, mercés ! Al còp que ven !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute',
					intro:
						'Pense à une personne que tu tutoies et que tu pourrais croiser cette semaine. Dis à voix haute votre rencontre : saluer, demander comment ça va, répondre, partir. Puis compare au modèle.',
					items: [
						{
							q: 'Votre rencontre, en quatre répliques.',
							a: 'Par exemple : *Adieu ! Cossí vas ? · Va plan, e tu ? · Vau plan, mercés ! · A lèu ! Al còp que ven !*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 5,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Le son du jour : le v qui sonne « b »',
					paragraphs: [
						'Dans le languedocien de ce cours, le *v* se dit comme un « b » : *vas* sonne « BAS », *vau* « BAOU », *ven* « BÈN ».',
						'Les lèvres se touchent, comme pour dire « bon ».',
						'Écoute, puis répète : *Cossí vas ?*, *Vau plan, mercés !*, *Al còp que ven !*'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Cossí vas ?* se dit…',
							options: ['cou-si BAS', 'cou-si VAS'],
							correct: 0,
							explain: 'Le *v* sonne « b ».'
						},
						{
							q: 'Et *Al còp que ven* ?',
							options: ['al COP qué BÈN', 'al COP qué VÈN'],
							correct: 0,
							explain: 'Même chose : *ven* se dit « BÈN ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis à voix haute, en faisant sonner chaque *v* comme un « b » : *Adieu ! Cossí vas ? Vau plan, mercés ! Al còp que ven !*',
							a: '« a-DIOU ! cou-si BAS ? baou PLA, mér-SÉS ! al COP qué BÈN ! » Personne ne parle sans accent : l’important, c’est d’être compris.'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais déjà faire. Le reste reviendra dans l’unité 1.',
					items: [
						'dire en deux phrases ce qu’est l’occitan, et où on le parle',
						'reconnaître des mots occitans dans le français du Midi',
						'saluer un ami et lui demander comment il va',
						'répondre que je vais bien, et retourner la question',
						'partir : à bientôt, à la prochaine'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin du module 0',
					glosa: { òsca: 'bravo' },
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant saluer en occitan, demander comment ça va, répondre et partir. Dans l’unité 1, *Adieu !*, tu apprendras à vouvoyer, à dire ton nom et d’où tu es.'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Choisis une personne à qui dire *Adieu ! Cossí vas ?* cette semaine : un voisin, une collègue, ton grand-père, quelqu’un qui entendait l’occitan chez ses grands-parents…',
						'Quand ? Où ? Décide-le maintenant. Et si on te répond *Vau plan, mercés ! E tu ?*, tu sais quoi dire.'
					]
				}
			]
		}
	]
};
