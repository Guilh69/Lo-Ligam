// Module 1.1 · A1 · « Adieu, cossí vas ? » — contenu structuré pour le
// moteur de leçon. Source de vérité pédagogique :
// Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/modules/1.1-adieu-cossi-vas.md
// ⚠️ Occitan à valider par Romain (dicodòc / lo Congrès) avant mise en ligne.

export const modul11 = {
	id: 'modul-1-1',
	slug: '1-1',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.1',
	oc: 'Adieu, cossí vas ?',
	fr: 'Saluer, demander comment ça va, prendre congé',
	cando:
		'Je peux saluer quelqu’un (le matin ou le soir), demander et dire comment ça va, et prendre congé — en choisissant entre le « tu » et le « vous ».',
	durada: '~50 min · 6 étapes de 8-10 min',
	// Prénoms des personnages : ignorés par le script de vérification lexicale.
	nomsPropris: ['Yasmine', 'Loís', 'Marià', 'Lisa'],

	sessions: [
		// ————————————————————————————————— Etapa 1
		{
			title: 'Rappel + Escota',
			minutes: 10,
			blocks: [
				{
					type: 'reveal',
					title: 'Rappel — de mémoire',
					intro:
						'Sans rien relire ; si tu sèches, c’est normal, réponds au feeling. Pense ta réponse (ou dis-la à voix haute), puis vérifie.',
					items: [
						{
							q: 'Tu croises quelqu’un à Toulouse qui te lance « Adieu ! » en pleine journée, tout sourire. Il te dit bonjour ou au revoir ?',
							a: 'Les deux sont possibles ! *Adieu* sert à dire bonjour **et** au revoir — c’est justement le sujet de ce module.'
						},
						{
							q: 'Module 0 : le *ò* avec accent (*bròca, pòrc*) se prononce comme le « o » de… « rose » ou de « bol » ?',
							a: 'Celui de « bol » — *ò* = o ouvert ; le *o* sans accent sonne « ou ».'
						},
						{
							q: '*Fada, cagade, pèga* — ces mots du français du Midi viennent de quelle langue ?',
							a: 'De l’occitan — tu pars avec des mots d’avance.'
						},
						{
							q: 'Module 0 : *amic* se prononce *amit(s)*, *amib* ou *ami* selon les endroits. Comment s’écrit-il, toujours ?',
							a: '*amic* — l’orthographe note la forme que tous les parlers partagent.'
						},
						{
							q: 'À ton avis (on vérifie dans une minute) : comment dit-on « bonjour » en occitan ?',
							a: '*Bonjorn* — presque le français, mais prononcé « boun-DJOUR ». Bienvenue dans le module.'
						}
					]
				},
				{
					type: 'dialogue',
					title: 'Escota — Écoute d’abord, lis ensuite',
					intro:
						'Jour de marché sur la plaça du village. Le matin, Yasmine croise son ami Loís ; le soir, elle croise Marià, une voisine âgée, avec ses amies — elle les vouvoie. Écoute 2 fois avant de lire.',
					scenes: [
						{
							title: 'Lo matin, sul mercat',
							subtitle: '(le matin, au marché)',
							lines: [
								'Bonjorn, Yasmine !',
								'Adieu, Loís ! Cossí vas ?',
								'Va plan, mercé. E tu, cossí vas ?',
								'Va plan, plan mercé !',
								'A lèu, Yasmine !',
								'A lèu !'
							]
						},
						{
							title: 'Lo ser, sus la plaça',
							subtitle: '(le soir, sur la place)',
							lines: [
								'Bon ser ! Cossí anatz ?',
								'Adieu-siatz, Yasmine ! Va plan, mercé. E tu ?',
								'Va plan !',
								'A deman, Yasmine !',
								'A deman ! Adieu-siatz !'
							]
						}
					],
					glossary: [
						{ oc: 'la plaça', sound: 'la PLA-ço', fr: 'la place (du village)' },
						{ oc: 'lo mercat', sound: 'lou mér-CAT', fr: 'le marché' },
						{ oc: 'lo matin', sound: 'lou ma-TI', fr: 'le matin' },
						{ oc: 'lo ser', sound: 'lou SÉ', fr: 'le soir' }
					]
				}
			]
		},

		// ————————————————————————————————— Etapa 2
		{
			title: 'Comprendre + Los que parlan',
			minutes: 8,
			blocks: [
				{
					type: 'qcm',
					title: 'Compréhension',
					intro: 'Un item à la fois, réponse immédiate.',
					items: [
						{
							q: 'Le matin, Yasmine tutoie…',
							options: ['Loís, son ami', 'Marià, la voisine âgée', 'le vendeur du marché'],
							correct: 0,
							explain:
								'Le matin : Loís (*Cossí vas ?*, tu). Le soir : Marià et ses amies (*Cossí anatz ?*, vous — et plusieurs personnes).'
						},
						{
							q: 'Vrai ou faux : *Adieu* et *Adieu-siatz* servent seulement à se quitter.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							noShuffle: true,
							explain:
								'Marià lance *Adieu-siatz !* en **accueillant** Yasmine. Bonjour et au revoir à la fois.'
						},
						{
							q: 'Chasse au chunk : combien de fois entends-tu *Va plan* dans les deux scènes ?',
							options: ['4 fois', '3 fois', '2 fois'],
							correct: 0,
							explain: '4 fois — c’est LA réponse passe-partout : *Va plan* (ça va bien).'
						}
					]
				},
				{
					type: 'note',
					variant: 'natiu',
					audio: true,
					title: 'Los que parlan — Josette, Aude (Lengadòc)',
					paragraphs: [
						'30 secondes : Josette dit bonjour à sa façon, comme elle l’a toujours dit. Écoute seulement, puis lis la transcription. Tu remarqueras peut-être un mot d’ouverture (*E ben…*) ou un tour différent du modèle : tu n’as rien à corriger, juste à reconnaître — c’est l’occitan de son pays.',
						'*(Enregistrement et transcription à venir.)*'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Relecture ciblée',
					paragraphs: [
						'Réécoute en lisant, chunks en gras :',
						'— **Bonjorn**, Yasmine ! · — **Adieu**, Loís ! **Cossí vas ?** · — **Va plan, mercé. E tu** ? · — **Va plan, plan mercé** ! · — **A lèu** ! · — **Bon ser ! Cossí anatz ?** · — **Adieu-siatz** ! · — **A deman** !'
					]
				}
			]
		},

		// ————————————————————————————————— Etapa 3
		{
			title: 'Obsèrva',
			minutes: 10,
			blocks: [
				{
					type: 'qcm',
					title: 'Obsèrva — Le bon chunk au bon moment',
					intro:
						'Choisis (une question à la fois, réponse immédiate). Pense au moment de la journée, et à qui tu parles.',
					items: [
						{
							q: 'Le matin, tu croises ton amie.',
							options: ['Bonjorn', 'Bon ser', 'A deman'],
							correct: 0,
							explain: 'Le matin → *Bonjorn*.'
						},
						{
							q: '*Adieu-siatz !* s’adresse à…',
							options: [
								'plusieurs personnes, ou quelqu’un qu’on vouvoie',
								'un ami proche',
								'un chat'
							],
							correct: 0,
							explain: 'Le *-siatz* dit « vous ».'
						},
						{
							q: 'On te demande *Cossí vas ?*',
							options: ['Va plan, mercé', 'Bonjorn', 'Adieu-siatz'],
							correct: 0,
							explain: 'Question « ça va ? » → réponse *Va plan*.'
						},
						{
							q: 'Vous vous reverrez demain.',
							options: ['A deman', 'Cossí vas ?', 'Bon ser'],
							correct: 0,
							explain: '*A deman* = à demain.'
						},
						{
							q: 'Vrai ou faux : *Adieu* sert seulement à dire au revoir.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							noShuffle: true,
							explain: 'Bonjour ET au revoir — comme *ciao* en italien.'
						},
						{
							q: 'Le soir, tu arrives chez des amis.',
							options: ['Bon ser', 'A lèu', 'Va plan'],
							correct: 0,
							explain: 'Le soir, en arrivant → *Bon ser*.'
						}
					]
				},
				{
					type: 'table',
					title: 'L’essentiel — pas de grammaire, des blocs',
					head: ['', 'à un(e) ami(e) (tu)', 'à plusieurs, ou en vouvoyant'],
					rows: [
						['saluer (passe-partout)', '**Adieu !**', '**Adieu-siatz !**'],
						['le matin / le soir', '**Bonjorn !** / **Bon ser !**', 'pareil'],
						['demander comment ça va', '**Cossí vas ?**', '**Cossí anatz ?**'],
						['répondre, retourner', '**Va plan, mercé. E tu ?**', '**… E vos ?**'],
						['se quitter', '**A lèu !** (à bientôt) · **A deman !** (à demain)', 'pareil, + **Adieu-siatz !**']
					],
					notes: [
						'*Adieu* et *Adieu-siatz* ouvrent **et** ferment la rencontre — comme *ciao* en italien.',
						'*Adieu-siatz*, littéralement « soyez à Dieu ». Rien que ça.',
						'Merci = *mercé* ; merci beaucoup = *plan mercé* (*plan* = bien, tu le reverras partout).'
					]
				},
				{
					type: 'note',
					variant: 'son',
					title: 'Son du jour — le -a final qui sonne « o »',
					paragraphs: [
						'Le *-a* final sonne « o » (léger) : *la plaça* → la PLA-ço · *pastra* → PAS-tro · *Castras* → CAS-tros.',
						'Mais quand le *a* porte l’accent de la voix, il reste « a » : *Va plan* → ba PLA. Une syllabe à la fois, ton oreille fait déjà le tri.'
					]
				},
				{
					type: 'chunks',
					title: 'Chunks à retenir',
					intro: 'Ça sonne comme — syllabe forte en capitales.',
					items: [
						{ oc: 'Adieu', sound: 'a-DIÉU', fr: 'salut (bonjour et au revoir, à une personne qu’on tutoie)' },
						{ oc: 'Adieu-siatz', sound: 'a-diéu-SIATS', fr: 'pareil, à plusieurs ou en vouvoyant' },
						{ oc: 'Bonjorn', sound: 'boun-DJOUR', fr: 'bonjour' },
						{ oc: 'Bon ser', sound: 'bou(n) SÉ', fr: 'bonsoir' },
						{ oc: 'Cossí vas ?', sound: 'cou-si BAS', fr: 'comment vas-tu ? (le v sonne « b »)' },
						{ oc: 'Cossí anatz ?', sound: 'cou-si a-NATS', fr: 'comment allez-vous ?' },
						{ oc: 'Va plan, e tu ?', sound: 'ba PLA, é TU', fr: 'ça va bien, et toi ?' },
						{ oc: 'Mercé · Plan mercé', sound: 'mér-SÉ · pla mér-SÉ', fr: 'merci · merci beaucoup' },
						{ oc: 'A lèu !', sound: 'a LÈOU', fr: 'à bientôt !' },
						{ oc: 'A deman !', sound: 'a dé-MA', fr: 'à demain !' }
					]
				}
			]
		},

		// ————————————————————————————————— Etapa 4
		{
			title: 'Practica',
			minutes: 10,
			blocks: [
				{
					type: 'qcm',
					title: '3a · Bloc court',
					intro: 'Complète avec le bon chunk. Un item à la fois.',
					items: [
						{
							q: 'Le matin : « ___, Loís ! »',
							options: ['Bonjorn', 'Bon ser', 'A deman'],
							correct: 0,
							explain: 'Le matin → *Bonjorn*.'
						},
						{
							q: 'Demande à ton amie comment elle va : « ___ ? »',
							options: ['Cossí vas', 'Cossí anatz', 'A lèu'],
							correct: 0,
							explain: 'À une amie → tu → *Cossí vas ?*'
						},
						{
							q: 'Réponds que ça va : « ___, mercé. »',
							options: ['Va plan', 'Bon ser', 'Adieu-siatz'],
							correct: 0,
							explain: '*Va plan, mercé* — la réponse passe-partout.'
						},
						{
							q: 'Remercie chaleureusement : « ___ ! »',
							options: ['Plan mercé', 'Mercé', 'A lèu'],
							correct: 0,
							explain: '*plan* = bien → « bien merci ». *Mercé* tout seul est juste, mais moins chaleureux.'
						},
						{
							q: 'Tu quittes un groupe : « ___ ! »',
							options: ['Adieu-siatz', 'Adieu', 'Bonjorn'],
							correct: 0,
							explain: 'Plusieurs personnes → *-siatz*.'
						},
						{
							q: 'Vous vous verrez demain : « ___ ! »',
							options: ['A deman', 'A lèu', 'Bon ser'],
							correct: 0,
							explain: '*A deman* = demain précisément.'
						},
						{
							q: 'Retourne la question : « Va plan. ___ ? »',
							options: ['E tu', 'E ieu', 'Cossí'],
							correct: 0,
							explain: 'On retourne la question à l’autre : *E tu ?*'
						}
					]
				},
				{
					type: 'qcm',
					title: '3b · Mélange',
					intro: 'Tout le module en désordre : moment, tu/vous, arriver/partir.',
					items: [
						{
							q: 'Le soir, tu arrives à une réunion du village : « ___ ! »',
							options: ['Bon ser', 'Bonjorn', 'A deman'],
							correct: 0,
							explain: 'Le soir, en arrivant → *Bon ser*.'
						},
						{
							q: 'Ton ami te lance *Cossí vas ?* — la réponse complète :',
							options: ['Va plan, mercé. E tu ?', 'Va plan.', 'Adieu !'],
							correct: 0,
							explain: 'Répondre **et** retourner la question — le réflexe complet.'
						},
						{
							q: 'Tu croises ta vieille voisine et ses amies :',
							options: ['Adieu-siatz ! Cossí anatz ?', 'Adieu ! Cossí vas ?', 'Bonjorn ! E tu ?'],
							correct: 0,
							explain: 'Vouvoiement + groupe → *-siatz*, *-atz*.'
						},
						{
							q: 'Vrai ou faux : on peut dire *Adieu !* en arrivant.',
							options: ['Vrai', 'Faux'],
							correct: 0,
							noShuffle: true,
							explain: 'Il ouvre et ferme la rencontre.'
						},
						{
							q: 'Tu pars, vous vous reverrez bientôt (pas forcément demain) : « ___ ! »',
							options: ['A lèu', 'A deman', 'Bon ser'],
							correct: 0,
							explain: '*A lèu* = à bientôt ; *A deman* = demain précisément.'
						},
						{
							q: '*Cossí anatz ?* s’adresse à…',
							options: ['ta boulangère, que tu vouvoies', 'ton petit frère'],
							correct: 0,
							explain: 'Le *-atz* dit « vous ».'
						},
						{
							q: 'Réponds à *Cossí anatz ?* : « ___, mercé ! »',
							options: ['Va plan', 'Adieu-siatz', 'A deman'],
							correct: 0,
							explain: 'La même réponse *Va plan* sert pour « tu » et pour « vous ».'
						},
						{
							q: 'Le matin au marché, salue le vendeur que tu ne connais pas : « ___ ! »',
							options: ['Bonjorn', 'Adieu', 'A lèu'],
							correct: 0,
							explain: '*Adieu* est réservé aux proches → à un inconnu : *Bonjorn*.'
						},
						{
							q: 'Tu quittes tes amies ce soir, vous vous revoyez demain matin : « ___ ! ___ ! »',
							options: ['A deman ! Adieu-siatz !', 'A lèu ! Adieu !', 'Bon ser ! Cossí anatz ?'],
							correct: 0,
							explain: 'Demain précis → *A deman* ; plusieurs personnes → *Adieu-siatz*.'
						},
						{
							q: 'Module 0, souviens-toi : dans une rue de Béziers, un « Adieu ! » entendu en plein français, c’est de l’occitan vivant.',
							options: ['Vrai', 'Faux'],
							correct: 0,
							noShuffle: true,
							explain: 'Le français du Midi est plein d’occitan (module 0).'
						},
						{
							q: '*La plaça* se prononce…',
							options: ['la PLA-ço', 'la PLA-ça'],
							correct: 0,
							explain: 'Le *-a* final sonne « o » (son du jour).'
						},
						{
							q: 'Choisis (très content·e de la journée) : « Va plan, ___ mercé ! »',
							options: ['plan', 'e tu', 'ser'],
							correct: 0,
							explain: '*Va plan, plan mercé !*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— Etapa 5
		{
			title: 'Parla + Fluiditat',
			minutes: 10,
			blocks: [
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Tape les mots dans l’ordre — mauvais mot, il tremble.',
					items: [
						{
							prompt: 'Ça va bien, merci. Et toi ?',
							tiles: ['Va', 'plan,', 'mercé.', 'E', 'tu ?'],
							explain: '*Va plan, mercé. E tu ?* — la réponse complète.'
						},
						{
							prompt: 'Bonsoir, comment allez-vous ?',
							tiles: ['Bon', 'ser,', 'cossí', 'anatz ?'],
							explain: '*Bon ser, cossí anatz ?* — le soir, en vouvoyant.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Tes deux mini-dialogues',
					intro:
						'Écris (ou dis à voix haute) un dialogue de 4 répliques : saluer → demander → répondre + retourner → se quitter. Puis compare au modèle.',
					items: [
						{
							q: '**A.** Le matin, avec un(e) ami(e).',
							a: 'Modèle : *— Bonjorn, Lisa ! — Adieu ! Cossí vas ? — Va plan, mercé. E tu ? — Va plan ! A lèu !*'
						},
						{
							q: '**B.** Le soir, avec un groupe ou une personne vouvoyée.',
							a: 'Modèle : *— Bon ser ! Cossí anatz ? — Va plan, plan mercé. E tu ? — Va plan ! A deman ! — Adieu-siatz !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Traduis',
					intro: 'Dis-le en occitan, puis vérifie.',
					items: [
						{ q: 'Bonjour, comment vas-tu ?', a: '*Bonjorn, cossí vas ?*' },
						{ q: 'Ça va bien, merci beaucoup.', a: '*Va plan, plan mercé.*' },
						{ q: 'À demain !', a: '*A deman !*' },
						{
							q: 'Au revoir ! (à plusieurs personnes)',
							a: '*Adieu-siatz !* — le *-siatz* dit « vous » / « vous tous ».'
						},
						{ q: 'Salut, à bientôt !', a: '*Adieu, a lèu !*' }
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Va plus vite — sans chrono',
					list: [
						'**Redis-le trois fois** : ton dialogue A à voix haute ; la 2ᵉ fois un peu plus vite, la 3ᵉ sans regarder.',
						'**Raconte avec 5 mots-clés** : *Bonjorn – Cossí vas ? – Va plan – A lèu – Adieu-siatz* → rejoue les deux scènes de mémoire.',
						'**Parle en même temps que l’audio** (voix native — à venir).'
					]
				}
			]
		},

		// ————————————————————————————————— Etapa 6
		{
			title: 'Tasca finala + Bilan',
			minutes: 10,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'Tasca finala — À toi',
					paragraphs: [
						'Enregistre (ou écris) tes deux mini-dialogues de salutation — un en « tu » (un ami, le matin), un en « vous » (plusieurs personnes ou une personne âgée, le soir). 4 répliques chacun : saluer, demander comment ça va, répondre et retourner la question, prendre congé.',
						'**Voie privée** : enregistre-toi sur ton téléphone, réécoute demain, coche les critères toi-même.',
						'**Voie communautaire** *(bientôt)* : poste ton audio en commentaire du post Lo Ligam de la semaine.',
						'**Bonus** : glisse un *Adieu !* de bonjour ET un *Adieu-siatz !* d’au revoir dans le même dialogue — le mot qui ouvre et qui ferme.'
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'La salutation colle au moment (matin → *Bonjorn*, soir → *Bon ser*)',
						'*Adieu* pour l’ami, *Adieu-siatz* / *Cossí anatz ?* pour le groupe ou le vouvoiement',
						'La réponse complète : *Va plan, mercé. E tu ?* (répondre **et** retourner)',
						'Prononciation : *bonjorn* = « boun-DJOUR », *vas* = « bas », le *-a* de *plaça* = « o »'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple de production',
					items: [
						{
							q: 'Quand tu as fini (pas avant !), regarde un exemple.',
							a: '*— Bonjorn, Loís ! — Adieu ! Cossí vas ? — Va plan, plan mercé. E tu ? — Va plan ! A deman ! — Adieu !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan — Je peux…',
					intro: 'Coche seulement ce que tu sais faire **seul**. Le reste reviendra, c’est prévu.',
					items: [
						'saluer le matin et le soir',
						'demander et dire comment ça va',
						'prendre congé (à bientôt / à demain)',
						'choisir entre *Adieu* (tu) et *Adieu-siatz* (vous / plusieurs)'
					]
				},
				{
					type: 'reveal',
					title: 'Mini-test',
					intro: 'De mémoire, sans remonter la page.',
					items: [
						{ q: 'Le soir, en arrivant, tu dis ?', a: '*Bon ser !*' },
						{ q: 'Traduis « comment vas-tu ? »', a: '*Cossí vas ?*' },
						{
							q: '*Adieu-siatz* s’adresse à qui ?',
							a: 'À plusieurs personnes, ou à quelqu’un qu’on vouvoie.'
						},
						{ q: 'Réponds à *Cossí vas ?* (réponse complète).', a: '*Va plan, mercé. E tu ?*' },
						{ q: '« À demain ! » ?', a: '*A deman !*' }
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura — Adieu paure Carnaval',
					audio: true,
					paragraphs: [
						'Un mot qui salue **et** qui quitte : les Occitans le chantent depuis des générations. À la fin du Carnaval, on brûle Sa Majesté Carnaval en lui chantant *Adieu paure Carnaval* — l’adieu le plus célèbre de la culture occitane. Écoute le refrain : combien de fois entends-tu *adieu* ?',
						'À Limoux (Aude), le Carnaval dure de janvier à mars — le plus long du monde. Les *fecos* dansent sur la place chaque week-end, et la langue y a sa part.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Se parles catalan / castelhan',
					paragraphs: [
						'*Bon dia* ↔ *Bonjorn* ; *Adéu* ↔ *Adieu* — mais l’occitan *Adieu* dit **aussi** bonjour ! *Com vas?* / *¿Cómo vas?* ↔ *Cossí vas ?* : tu as déjà l’oreille.',
						'Piège : le *-a* final atone sonne « o » en languedocien (*plaça* PLA-ço), pas « a » ni « e ».'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Réviser plus tard',
					paragraphs: [
						'Le site te les resservira — pas besoin de noter :',
						'**Dans 2 jours** : *Adieu / Adieu-siatz* (tu/vous), *Cossí vas ? → Va plan, mercé. E tu ?* · **Dans 7 jours** : *Bonjorn / Bon ser*, *A lèu / A deman* · **Dans 30 jours** : les 10 chunks au complet.'
					]
				}
			]
		}
	]
};
