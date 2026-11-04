// Module 3.2 · A1 · « Qual es ? » : unité 3 (La familha), rédigé par Claude
// le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3, règles de cursus/regles-redaccion-A1.md).
// Forme du jour : les articles lo, la, l', los, las ; les possessifs mon,
// ma, ton, ta (pas de mos, mas, tos, tas, son, sa en A1).
// Jeu du jour : l'arbre de la famille, chacun à sa place.
// Scène : avant le repas, dans la cour de Mameta, Karim présente sa famille
// à Núria (famille de l'unité : voir l'en-tête du module 3.1).
// Lexique : cursus/lexic-A1.md, items copiés tels quels (mêmes id).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul32 = {
	id: 'modul-3-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '3-2',
	unitat: 'Unitat 3 · La familha',
	nivel: 'A1 · Modul 3.2',
	oc: 'Qual es ?',
	fr: 'Qui est-ce ? Nommer les gens de sa famille',
	cando:
		'Je peux nommer les gens de ma famille, ou d’une famille inventée, dire qui est qui avec *mon, ma, ton, ta*, et employer *lo, la, los, las*.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Núria', 'Joana', 'Inès', 'Rachid', 'Mirèlha', 'Clara', 'Sofia', 'Léa', 'Tòni'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'*sòrre, sòrres* sont absents du Basic (déjà signalé par la carte) : tu les valides ?',
		'« Enfant » : *lo dròlle, la dròlla, los dròlles* (le Basic n’a pas *enfant*), *mainatge* glosé « on dit aussi » : oui ?',
		'Joana a deux mères, Clara et Sofia (*las maires de Joana*), dit sans commentaire, comme une famille parmi d’autres : ça te va ?',
		'La mère de Karim s’appelle *Mirèlha* (Mireille), « mi-RÈ-lyo », ce qui fait entendre le son du jour : le prénom te va ?',
		'*Es un amic* (glosé) : Núria répond à la question de Joana. On garde *amic* glosé, sans l’enseigner ?',
		'Proverbe ajouté à la Cultura le 2026-11-04 (« Petit dictionnaire insolite », page 89) : *Lo buòu vièlh fa la rega drecha*. *buòu* est absent du Basic mais présent dans express’Òc (lo Congrès). Il te va ?'
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
					intro: 'Deux phrases du module 3.1, sans regarder. Un accent ou un trait d’union oublié, on te le montre.',
					items: [
						{ consigne: 'Demande son âge à un ami.', answers: ['Quant as d’ans ?'], choses: ['quant-as-d-ans'] },
						{
							consigne: 'Écris en lettres : 17',
							answers: ['dètz-e-sèt'],
							choses: ['nombre-17'],
							explain: '*dètz-e-sèt* : « dix et sept », avec des traits d’union.'
						}
					]
				},
				{
					type: 'qcm',
					title: 'Ce qui revient du module 3.1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '*Ela a dotze ans.* Elle a…',
							options: ['12 ans', '2 ans', '13 ans'],
							correct: 0,
							choses: ['a-ans', 'nombre-12'],
							explain: '*dotze* : 12 ; *dos* : 2 ; *tretze* : 13.'
						},
						{
							q: 'Quatorze :',
							options: ['catòrze', 'quatre', 'quinze'],
							correct: 0,
							oc: true,
							choses: ['nombre-14'],
							explain: '*catòrze* : 14 ; *quatre* : 4 ; *quinze* : 15.'
						},
						{
							q: '*dètz-e-nòu* :',
							options: ['19', '9', '10'],
							correct: 0,
							choses: ['nombre-19'],
							explain: '« dix et neuf » : 19.'
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
					title: 'Qui est qui, chez Mameta ?',
					intro:
						'Avant le repas, dans la cour de Mameta. Núria ne connaît encore personne : Karim lui présente sa famille. Puis Joana arrive en courant. Lis une première fois pour répondre à une seule question : quelle question indiscrète Joana pose-t-elle à Núria ?',
					scenes: [
						{
							title: 'Karim e Núria',
							subtitle: '(dans la cour, Núria demande qui est qui)',
							lines: [
								{ oc: 'Karim, qual es ?', sound: 'ka-RIM, kal ÉS ?', fr: 'Karim, qui est-ce ?' },
								{ oc: 'Es mon paire, Rachid. E ela, es ma maire, Mirèlha.', sound: 'és moun PAÏ-ré, ra-CHID. é É-lo, és ma MAÏ-ré, mi-RÈ-lyo.', fr: 'C’est mon père, Rachid. Et elle, c’est ma mère, Mirèlha.' },
								{ oc: 'E la dròlla, aquí ?', sound: 'é la DRÒ-lo, a-KI ?', fr: 'Et la fille, là ?' },
								{ oc: 'Es Inès, ma sòrre. A dotze ans.', sound: 'és i-NÈS, ma SÒ-rré. a DOUT-sé ANS.', fr: 'C’est Inès, ma sœur. Elle a douze ans.' },
								{ oc: 'E los dos, aquí ?', sound: 'é lous DOUS, a-KI ?', fr: 'Et les deux, là ?' },
								{ oc: 'Lo papeta e la mameta.', sound: 'lou pa-PÉ-to é la ma-MÉ-to.', fr: 'Le grand-père et la grand-mère.' },
								{ oc: 'E las doas, aquí ?', sound: 'é las DOUOS, a-KI ?', fr: 'Et les deux, là ?' },
								{ oc: 'Clara, ma tanta, e Sofia, la companha de Clara : las maires de Joana.', sound: 'CLA-ro, ma TAN-to, é sou-FI-o, la coum-PA-gno dé CLA-ro : las MAÏ-rés dé djou-A-no.', fr: 'Clara, ma tante, et Sofia, la compagne de Clara : les mères de Joana.' },
								{ oc: 'E ton paire es l’oncle de Joana ?', sound: 'é toun PAÏ-ré és LOUN-clé dé djou-A-no ?', fr: 'Et ton père est l’oncle de Joana ?' },
								{ oc: 'Òc ! E ieu, soi lo cosin de Joana.', sound: 'OK ! é YÉOU, souï lou cou-ZI dé djou-A-no.', fr: 'Oui ! Et moi, je suis le cousin de Joana.' }
							]
						},
						{
							title: 'Joana e Núria',
							subtitle: '(Joana arrive en courant)',
							lines: [
								{ oc: 'Núria ! Karim es ton companh ?', sound: 'NOU-ria ! ka-RIM és toun coum-PAN ?', fr: 'Núria ! Karim, c’est ton compagnon ?' },
								{ oc: 'Non ! Es un amic.', sound: 'NOU ! és u-na-MIC.', fr: 'Non ! C’est un ami.' },
								{ oc: 'Es mon cosin ! E Inès es ma cosina.', sound: 'és moun cou-ZI ! é i-NÈS és ma cou-ZI-no.', fr: 'C’est mon cousin ! Et Inès est ma cousine.' },
								{ oc: 'E la mameta, es la maire de Clara ?', sound: 'é la ma-MÉ-to, és la MAÏ-ré dé CLA-ro ?', fr: 'Et la grand-mère, c’est la mère de Clara ?' },
								{ oc: 'Òc ! E la maire de Mirèlha tanben.', sound: 'OK ! é la MAÏ-ré dé mi-RÈ-lyo tam-BÉ.', fr: 'Oui ! Et la mère de Mirèlha aussi.' }
							]
						},
						{
							title: 'Mameta',
							subtitle: '(depuis la cuisine)',
							lines: [
								{ oc: 'Los dròlles ! A taula !', sound: 'lous DRÒ-lés ! a TAOU-lo !', fr: 'Les enfants ! À table !' },
								{ oc: 'E tu tanben, Mirèlha, ma filha !', sound: 'é TU tam-BÉ, mi-RÈ-lyo, ma FI-lyo !', fr: 'Et toi aussi, Mirèlha, ma fille !' }
							]
						}
					],
					glossary: [
						{ oc: 'un amic', sound: 'u-na-MIC', fr: 'un ami' },
						{ oc: 'las maires', sound: 'las MAÏ-rés', fr: 'les mères (maire au pluriel)' },
						{ oc: 'A taula !', sound: 'a TAOU-lo', fr: 'à table !' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Quelle question indiscrète Joana pose-t-elle à Núria ?',
							options: ['si Karim est son compagnon', 'quel âge elle a', 'si elle a des frères'],
							correct: 0,
							choses: ['companh-companha'],
							explain: '*Karim es ton companh ?* : Karim, c’est ton compagnon ? Núria répond que c’est un ami.'
						},
						{
							q: 'Qui est Inès ?',
							options: ['la sœur de Karim', 'la cousine de Karim', 'la mère de Joana'],
							correct: 0,
							choses: ['la-sorre'],
							explain: '*Es Inès, ma sòrre* : c’est Inès, ma sœur.'
						},
						{
							q: 'Qui sont Clara et Sofia ?',
							options: ['les deux mamans de Joana', 'les sœurs de Karim', 'les grands-mères de Karim'],
							correct: 0,
							choses: ['la-maire', 'oncle-tanta'],
							explain: '*las maires de Joana* : les mères de Joana. Pour Karim, Clara est *ma tanta*, sa tante.'
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
					title: 'Le petit mot devant le nom',
					intro: 'Devant chaque nom de la famille, il y a un petit mot. Regarde ce qu’il dit.',
					items: [
						{
							q: '*lo paire*, *la maire* : *lo* et *la* veulent dire…',
							options: ['le, la', 'mon, ma', 'un, une'],
							correct: 0,
							choses: ['articles-lo-la'],
							explain: '*lo* devant un mot masculin, *la* devant un mot féminin. *lo* se dit « lou ».'
						},
						{
							q: 'Núria dit *los dos* pour les grands-parents, et *las doas* pour Clara et Sofia. Pourquoi *las doas* ?',
							options: ['ce sont deux femmes', 'ce sont un homme et une femme', 'elles sont plus jeunes'],
							correct: 0,
							choses: ['articles-lo-la'],
							explain: 'Au pluriel : *las* pour des femmes, *los* pour des hommes, ou pour un homme et une femme ensemble, comme *lo papeta e la mameta*.'
						},
						{
							q: '*Karim es ton companh ?* Joana demande si Karim est le compagnon…',
							options: ['de Núria', 'de Joana', 'de Mameta'],
							correct: 0,
							choses: ['possessius-mon-ma', 'companh-companha'],
							explain: 'Joana parle à Núria : *ton*, c’est « à toi ». Donc le compagnon de Núria.'
						},
						{
							q: '*mon paire*, mais *ma maire* : on dit *ma* devant…',
							options: ['un mot féminin', 'un mot masculin'],
							correct: 0,
							noShuffle: true,
							choses: ['possessius-mon-ma'],
							explain: '*mon* devant un mot masculin, *ma* devant un mot féminin. Pareil pour *ton* et *ta*.'
						},
						{
							q: '*l’oncle* : pourquoi une apostrophe ?',
							options: ['*oncle* commence par une voyelle', '*oncle* est un mot féminin'],
							correct: 0,
							noShuffle: true,
							choses: ['oncle-tanta', 'articles-lo-la'],
							explain: 'Devant une voyelle, *lo* et *la* deviennent *l’* : *l’oncle*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Le, la, les · mon, ma, ton, ta',
					head: ['', 'une personne', 'plusieurs'],
					rows: [
						['masculin', '*lo paire* · *l’oncle*', '*los fraires* · *los dròlles*'],
						['féminin', '*la maire* · *la tanta*', '*las sòrres* · *las maires*'],
						['à moi', '*mon paire* · *ma maire*', 'plus tard'],
						['à toi', '*ton fraire* · *ta sòrre*', 'plus tard']
					],
					notes: [
						'*lo* se dit « lou », *los* « lous » : le *o* sans accent sonne « ou » (module 1.3).',
						'Devant une voyelle, *lo* et *la* deviennent *l’* : *l’oncle*.',
						'Au pluriel, le nom prend un *-s* : *la sòrre*, *las sòrres*. Un groupe d’hommes et de femmes se dit au masculin : *los dròlles*.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/3) : le, la, les, mon, ma',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'articles-lo-la', oc: 'lo · la · l’ · los · las', sound: 'lou · la · l’ · lous · las', fr: 'le · la · l’ (devant une voyelle) · les (masculin) · les (féminin)' },
						{ id: 'possessius-mon-ma', oc: 'mon · ma · ton · ta', sound: 'moun · ma · toun · ta', fr: 'mon · ma · ton · ta (*mon paire, ma maire*)' },
						{ id: 'lo-paire', oc: 'lo paire', sound: 'lou PAÏ-ré', fr: 'le père' },
						{ id: 'la-maire', oc: 'la maire', sound: 'la MAÏ-ré', fr: 'la mère' }
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// Jeu prévu par la carte : l'arbre, glisser chacun à sa place (à coder :
		// l'arbre dessiné et des étiquettes à glisser). Version simple : l'arbre
		// en tableau, puis on choisit ce que dit chaque personne (qcm).
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 12,
			blocks: [
				{
					type: 'table',
					title: 'L’arbre de la famille',
					intro: 'Garde cet arbre sous les yeux pendant le jeu.',
					head: ['', 'qui'],
					rows: [
						['1. les grands-parents', 'Papeta et Mameta'],
						['2. leurs deux filles, chacune avec son compagnon ou sa compagne', 'Mirèlha, avec Rachid · Clara, avec Sofia'],
						['3. les enfants', 'Karim (20 ans) et Inès (12 ans), enfants de Mirèlha et Rachid · Joana (7 ans), fille de Clara et Sofia']
					],
					notes: ['Mirèlha et Clara sont sœurs.']
				},
				{
					type: 'chunks',
					title: 'À retenir (2/3) : la famille proche',
					intro: 'Pour les grands-parents, on dit aussi « pepin » (grand-père) et « menina » (grand-mère), selon les endroits.',
					glosa: { pepin: 'grand-père (on dit aussi)', menina: 'grand-mère (on dit aussi)' },
					items: [
						{ id: 'lo-fraire', oc: 'lo fraire · los fraires', sound: 'lou FRAÏ-ré · lous FRAÏ-rés', fr: 'le frère · les frères' },
						{ id: 'la-sorre', oc: 'la sòrre · las sòrres', sound: 'la SÒ-rré · las SÒ-rrés', fr: 'la sœur · les sœurs' },
						{ id: 'filh-filha', oc: 'lo filh · la filha', sound: 'lou FIL · la FI-lyo', fr: 'le fils · la fille' },
						{ id: 'papeta-mameta', oc: 'lo papeta · la mameta', sound: 'lou pa-PÉ-to · la ma-MÉ-to', fr: 'le grand-père · la grand-mère' }
					]
				},
				{
					type: 'qcm',
					title: 'L’arbre (1) : Karim présente sa famille',
					intro: 'Regarde l’arbre. Qui parle ? Choisis ce qu’il dit de chaque personne.',
					items: [
						{
							q: 'Karim parle de Rachid :',
							options: ['mon paire', 'ma maire', 'mon fraire'],
							correct: 0,
							oc: true,
							choses: ['lo-paire', 'possessius-mon-ma'],
							explain: 'Rachid, son père : *mon paire*.'
						},
						{
							q: 'Karim parle de Mirèlha :',
							options: ['ma maire', 'ma tanta', 'ma sòrre'],
							correct: 0,
							oc: true,
							choses: ['la-maire'],
							explain: 'Mirèlha, sa mère : *ma maire*.'
						},
						{
							q: 'Karim parle d’Inès :',
							options: ['ma sòrre', 'mon fraire', 'ma cosina'],
							correct: 0,
							oc: true,
							choses: ['la-sorre', 'possessius-mon-ma'],
							explain: 'Inès, sa sœur : *ma sòrre*, avec *ma* devant un mot féminin.'
						},
						{
							q: 'Inès parle de Karim :',
							options: ['mon fraire', 'mon paire', 'ma sòrre'],
							correct: 0,
							oc: true,
							choses: ['lo-fraire'],
							explain: 'Pour Inès, Karim est son frère : *mon fraire*.'
						},
						{
							q: 'Karim parle de Papeta et Mameta :',
							options: ['lo papeta e la mameta', 'lo paire e la maire', 'lo fraire e la sòrre'],
							correct: 0,
							oc: true,
							choses: ['papeta-mameta'],
							explain: 'Les grands-parents : *lo papeta e la mameta*.'
						},
						{
							q: 'Mirèlha parle de Karim et d’Inès :',
							options: ['mon filh, ma filha', 'mon fraire, ma sòrre', 'mon paire, ma maire'],
							correct: 0,
							oc: true,
							choses: ['filh-filha'],
							explain: 'Ses enfants : *mon filh* (mon fils) et *ma filha* (ma fille).'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (3/3) : les cousins et les autres',
					intro: 'Pour l’enfant, on entend aussi « mainatge ».',
					glosa: { mainatge: 'enfant (on dit aussi)' },
					items: [
						{ id: 'oncle-tanta', oc: 'l’oncle · la tanta', sound: 'LOUN-clé · la TAN-to', fr: 'l’oncle · la tante' },
						{ id: 'cosin-cosina', oc: 'lo cosin · la cosina', sound: 'lou cou-ZI · la cou-ZI-no', fr: 'le cousin · la cousine' },
						{ id: 'drolle-drolla', oc: 'lo dròlle · la dròlla · los dròlles', sound: 'lou DRÒ-lé · la DRÒ-lo · lous DRÒ-lés', fr: 'l’enfant, le garçon · la fille · les enfants' },
						{ id: 'companh-companha', oc: 'lo companh · la companha', sound: 'lou coum-PAN · la coum-PA-gno', fr: 'le compagnon · la compagne' }
					]
				},
				{
					type: 'qcm',
					title: 'L’arbre (2) : chez Joana',
					intro: 'Regarde encore l’arbre. Attention : qui parle ?',
					items: [
						{
							q: 'Karim parle de Clara :',
							options: ['ma tanta', 'ma maire', 'ma cosina'],
							correct: 0,
							oc: true,
							choses: ['oncle-tanta'],
							explain: 'Clara, la sœur de sa mère : *ma tanta*.'
						},
						{
							q: 'Karim parle de Joana :',
							options: ['ma cosina', 'mon cosin', 'ma sòrre'],
							correct: 0,
							oc: true,
							choses: ['cosin-cosina', 'possessius-mon-ma'],
							explain: 'Joana, la fille de sa tante : *ma cosina*.'
						},
						{
							q: 'Joana parle de Rachid :',
							options: ['mon oncle', 'mon paire', 'mon cosin'],
							correct: 0,
							oc: true,
							choses: ['oncle-tanta'],
							explain: 'Rachid est le compagnon de Mirèlha, la sœur de Clara : pour Joana, c’est *l’oncle*, *mon oncle*.'
						},
						{
							q: 'Joana parle de Karim :',
							options: ['mon cosin', 'ma cosina', 'mon fraire'],
							correct: 0,
							oc: true,
							choses: ['cosin-cosina'],
							explain: 'Karim est le fils de sa tante : *mon cosin*.'
						},
						{
							q: 'Clara parle de Sofia :',
							options: ['ma companha', 'ma sòrre', 'ma filha'],
							correct: 0,
							oc: true,
							choses: ['companh-companha', 'possessius-mon-ma'],
							explain: 'Sofia vit avec Clara : *ma companha*.'
						},
						{
							q: 'Mameta appelle tous les enfants à table :',
							options: ['Los dròlles !', 'Las sòrres !', 'Los fraires !'],
							correct: 0,
							oc: true,
							choses: ['drolle-drolla'],
							explain: '*Los dròlles* : les enfants. Karim, Inès et Joana sont cousins : ni tous frères, ni tous sœurs.'
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
						'Parle de ta famille, ou d’une famille inventée : c’est toi qui choisis. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{ consigne: 'Karim montre une photo : « C’est ma mère. »', answers: ['Es ma maire.'], choses: ['la-maire', 'possessius-mon-ma'] },
						{ consigne: 'C’est mon frère. Il a quinze ans.', answers: ['Es mon fraire. A quinze ans.'], choses: ['lo-fraire', 'a-ans'] },
						{ consigne: 'Demande à Karim : « C’est ta sœur ? »', answers: ['Es ta sòrre ?'], choses: ['la-sorre', 'possessius-mon-ma'] },
						{ consigne: 'Le grand-père et la grand-mère.', answers: ['Lo papeta e la mameta.'], choses: ['papeta-mameta', 'articles-lo-la'] },
						{ consigne: 'L’oncle et la tante.', answers: ['L’oncle e la tanta.'], choses: ['oncle-tanta', 'articles-lo-la'] },
						{ consigne: 'Mon cousin et ma cousine.', answers: ['Mon cosin e ma cosina.'], choses: ['cosin-cosina', 'possessius-mon-ma'] },
						{ consigne: 'Appelle les enfants : « Les enfants ! »', answers: ['Los dròlles !'], choses: ['drolle-drolla'] },
						{
							consigne: 'Présente une personne de ta famille, ou d’une famille inventée, avec son prénom.',
							debut: ['Es mon', 'Es ma', 'Aquí, mon', 'Aquí, ma'],
							choses: ['possessius-mon-ma'],
							explain: 'Par exemple : *Es ma tanta, Léa.* ou *Es mon cosin, Tòni.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Rachid est mon père, et Mirèlha est ma mère.',
							tiles: ['Rachid', 'es', 'mon', 'paire,', 'e', 'Mirèlha', 'es', 'ma', 'maire.'],
							choses: ['lo-paire', 'la-maire', 'possessius-mon-ma'],
							explain: '*mon paire*, *ma maire*.'
						},
						{
							prompt: 'Mirèlha parle de ses enfants : « mon fils et ma fille ».',
							tiles: ['mon', 'filh', 'e', 'ma', 'filha'],
							choses: ['filh-filha'],
							explain: '*mon filh e ma filha*.'
						},
						{
							prompt: 'Sofia est la compagne de Clara.',
							tiles: ['Sofia', 'es', 'la', 'companha', 'de', 'Clara.'],
							choses: ['companh-companha'],
							explain: '*la companha* : la compagne ; *lo companh* : le compagnon.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro:
						'Prends une photo de famille, la tienne ou une photo trouvée, et dis qui est qui. Puis compare au modèle.',
					items: [
						{
							q: 'Trois ou quatre personnes, avec leur prénom.',
							a: 'Par exemple : *Aquí, mon paire e ma maire. Es mon fraire, Tòni : a quinze ans. E aquí, ma mameta.*'
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
					title: 'Le son du jour : lh',
					paragraphs: [
						'En occitan, « lh » sonne « ly » : *la filha* se dit « la FI-lyo », *la familha* « la fa-MI-lyo ». Tu l’as déjà entendu dans *Montpelhièr*, « moun-pé-LYÈ ».',
						'À la fin d’un mot, « lh » sonne simplement « l » : *lo filh* se dit « lou FIL ».',
						'Écoute, puis répète : *la filha*, *lo filh*, *la familha*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*la filha* se dit…',
							options: ['la FI-lyo', 'la FIL-a'],
							correct: 0,
							noShuffle: true,
							explain: '« la FIL-a », c’est la lecture à la française. En occitan, « lh » sonne « ly », et le *a* final sonne « o ».'
						},
						{
							q: '*lo filh*, à la fin du mot, se dit…',
							options: ['lou FIL', 'lou FI-lyo'],
							correct: 0,
							noShuffle: true,
							explain: 'En fin de mot, « lh » sonne « l » : « lou FIL ». « FI-lyo », c’est *la filha*, la fille.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis à voix haute : *ma familha*, *ma filha*, *mon filh*.',
							a: '« ma fa-MI-lyo », « ma FI-lyo », « moun FIL ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : la langue des grands-parents',
					paragraphs: [
						'Longtemps, le peuple du Midi a parlé occitan tous les jours. Le français ne s’est imposé comme langue du quotidien qu’au début du XXe siècle dans les villes, et après la Seconde Guerre mondiale dans les campagnes.',
						'Voilà pourquoi, dans bien des familles, ce sont *lo papeta* et *la mameta* qui parlent occitan : la langue peut s’apprendre par les grands-parents, comme Joana avec Mameta. Sources : Jean Sibille (2007) ; Philippe Martel, revue « Langues et cité », n° 10.',
						'Un proverbe salue l’expérience des anciens : *Lo buòu vièlh fa la rega drecha*, le vieux bœuf trace le sillon droit. Source : « Petit dictionnaire insolite de l’occitan et des Occitans », page 89.'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra dans ton carnet.',
					items: [
						'nommer les gens d’une famille : parents, frères et sœurs, grands-parents, oncles, tantes, cousins',
						'dire qui est qui avec *mon, ma, ton, ta*',
						'choisir entre *lo, la, l’, los, las*',
						'présenter une famille, la mienne ou une famille inventée'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant nommer les gens d’une famille et dire qui est qui.',
						'Si tu en as envie : prends une photo de famille, la tienne ou une photo trouvée, et présente deux personnes à quelqu’un de proche, en occitan : *Es mon paire*, *Es ma sòrre*… Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
