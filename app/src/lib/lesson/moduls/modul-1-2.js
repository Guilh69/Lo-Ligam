// Module 1.2 · A1 · « Me dison… / M'apèli… » : contenu structuré.
// Source : Modules_cors/…/cursus/modules/1.2-me-dison-m-apeli.md
// ⚠️ Occitan à valider par Romain avant mise en ligne (vérifié API 29/08).

export const modul12 = {
	id: 'modul-1-2',
	slug: '1-2',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.2',
	oc: 'Me dison… / M’apèli…',
	fr: 'Dire et demander le nom',
	cando:
		'Je peux demander son nom à quelqu’un (en « tu » ou en « vous »), dire le mien des deux façons occitanes, et dire enchanté·e.',
	durada: '~45 min · 6 étapes de 7-9 min',
	nomsPropris: ['Núria', 'Loís', 'Marià', 'Karim', 'Mirelha', 'Joan', 'Lisa', 'Pau'],

	sessions: [
		{
			title: 'Rappel de 1.1 + Escota',
			minutes: 8,
			blocks: [
				{
					type: 'reveal',
					title: 'Rappel : de mémoire (module 1.1)',
					intro: 'Sans rien relire. Pense ta réponse, dis-la à voix haute, puis vérifie.',
					items: [
						{ q: 'Le matin, tu croises ton amie : « ___ ! »', a: '*Bonjorn !*, le matin.' },
						{
							q: 'On te lance *Cossí vas ?* : la réponse complète ?',
							a: '*Va plan, mercé. E tu ?* : répondre **et** retourner.'
						},
						{ q: '*Adieu-siatz !* s’adresse à qui ?', a: 'À plusieurs personnes, ou en vouvoyant.' },
						{ q: 'Le soir, en arrivant : « ___ ! »', a: '*Bon ser !*' },
						{ q: 'Tu reverras cette personne demain : « ___ ! »', a: '*A deman !*' }
					]
				},
				{
					type: 'dialogue',
					title: 'Escota : écoute d’abord, lis ensuite',
					intro:
						'La fèsta du village, sur la plaça. Núria, une Catalane de passage, rencontre Loís ; plus tard, Marià fait connaissance avec Karim : elle le vouvoie. Écoute 2 fois avant de lire.',
					scenes: [
						{
							title: 'Scèna 1 : Núria e Loís',
							subtitle: '(deux jeunes, tutoiement)',
							lines: [
								{ oc: 'Adieu ! Cossí te dison ?', sound: 'a-DIOU ! cou-si té DI-zoun ?' },
								{ oc: 'Me dison Loís. E tu, cossí t’apèlas ?', sound: 'mé DI-zoun lou-ÍS. é TU, cou-si ta-PÈ-los ?' },
								{ oc: 'Ieu, m’apèli Núria.', sound: 'YÉOU, ma-PÈ-li NOU-ria.' },
								{ oc: 'Encantat, Núria !', sound: 'én-can-TAT !' },
								{ oc: 'Encantada !', sound: 'én-can-TA-do !' }
							]
						},
						{
							title: 'Scèna 2 : Marià e Karim',
							subtitle: '(vouvoiement)',
							lines: [
								{ oc: 'Bon ser ! Cossí vos dison ?', sound: 'bou(n) SÉ ! cou-si bous DI-zoun ?' },
								{ oc: 'Me dison Karim. E vos ?', sound: 'mé DI-zoun ka-RIM. é BOUS ?' },
								{ oc: 'Ieu, me dison Marià. Encantada !', sound: 'YÉOU, mé DI-zoun ma-ri-A. én-can-TA-do !' },
								{ oc: 'Encantat !', sound: 'én-can-TAT !' }
							]
						}
					],
					glossary: [
						{ oc: 'ieu', sound: 'YÉOU', fr: 'moi (pour insister, comme « E tu ? » en 1.1)' },
						{ oc: 'la fèsta', sound: 'la FÈS-to', fr: 'la fête' }
					]
				}
			]
		},

		{
			title: 'Comprendre + Los que parlan',
			minutes: 7,
			blocks: [
				{
					type: 'qcm',
					title: 'Compréhension',
					intro: 'Un item à la fois, réponse immédiate.',
					items: [
						{
							q: 'Loís et Núria disent « je m’appelle » chacun à sa façon. Loís dit…',
							options: ['*Me dison* (« on me dit »)', '*M’apèli*', 'Encantat'],
							correct: 0,
							explain:
								'Loís : *Me dison* ; Núria : *M’apèli*. **Les deux sont parfaitement correctes**, chacun sa préférence.'
						},
						{
							q: 'Vrai ou faux : *Encantat* et *Encantada* veulent dire deux choses différentes.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							noShuffle: true,
							explain:
								'C’est le même « enchanté » : *Encantat* pour un homme, *Encantada* pour une femme (én-can-TA-do).'
						},
						{
							q: 'Chasse à l’expression : combien de fois entends-tu *dison* dans les deux scènes ?',
							options: ['5 fois', '3 fois', '2 fois'],
							correct: 0,
							explain: '5 fois : c’est la tournure la plus courante : « on me dit ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'natiu',
					audio: true,
					title: 'Los que parlan',
					paragraphs: [
						'30 secondes d’un natif : comment on se nomme chez lui, et peut-être son *escais* (surnom) de village. Écoute seulement, puis lis. Tu n’as rien à corriger, juste à reconnaître.',
						'*(Enregistrement et transcription à venir.)*'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Relecture ciblée',
					paragraphs: [
						'Réécoute en lisant, expressions en gras :',
						'— **Cossí te dison ?** · — **Me dison** Loís. E tu, **cossí t’apèlas ?** · — Ieu, **m’apèli** Núria. · — **Encantat !** — **Encantada !** · — **Cossí vos dison ?** · — **Me dison** Karim.'
					]
				}
			]
		},

		{
			title: 'Obsèrva',
			minutes: 8,
			blocks: [
				{
					type: 'qcm',
					title: 'Obsèrva : la bonne expression au bon moment',
					items: [
						{
							q: '*Me dison Mirelha.* Elle dit…',
							options: ['son nom', 'où elle habite', 'au revoir'],
							correct: 0,
							explain: '*Me dison* = « on me dit » = je m’appelle.'
						},
						{
							q: 'Pour demander son nom à ta boulangère (que tu vouvoies) :',
							options: ['Cossí vos dison ?', 'Cossí te dison ?', 'Cossí vas ?'],
							correct: 0,
							explain: '*vos* = vouvoiement.'
						},
						{
							q: 'Un homme répond « enchanté » :',
							options: ['Encantat', 'Encantada', 'Mercé'],
							correct: 0,
							explain: '*-t* pour un homme, *-da* pour une femme.'
						},
						{
							q: '*Cossí t’apèlas ?* et *Cossí te dison ?* :',
							options: [
								'la même question, deux façons',
								'deux sens différents',
								'l’une tutoie, l’autre vouvoie'
							],
							correct: 0,
							explain: 'La même question, deux mélodies : toutes deux correctes.'
						},
						{
							q: 'Vrai ou faux : *Me dison* signifie mot à mot « on me dit ».',
							options: ['Vrai', 'Faux'],
							correct: 0,
							noShuffle: true,
							explain: 'Vrai : et c’est charmant.'
						},
						{
							q: '« Moi, je m’appelle Joan » (en insistant) :',
							options: ['Ieu, m’apèli Joan', 'M’apèli Joan', 'Joan m’apèli'],
							correct: 0,
							explain: '*Ieu,* devant, pour insister.'
						}
					]
				},
				{
					type: 'table',
					title: 'L’essentiel : deux mélodies au choix',
					head: ['', 'à quelqu’un qu’on tutoie', 'à plusieurs / en vouvoyant'],
					rows: [
						['demander le nom', '**Cossí te dison ?** · **Cossí t’apèlas ?**', '**Cossí vos dison ?** · **Cossí vos apelatz ?**'],
						['dire son nom', '**Me dison…** · **M’apèli…**', 'pareil'],
						['enchanté·e', '**Encantat !** (homme) · **Encantada !** (femme)', 'pareil']
					],
					notes: [
						'Les deux façons sont **également correctes** : *Me dison* (« on me dit ») est très courante, *M’apèli* te rappellera le français. Choisis ta préférée, comprends les deux.',
						'« Enchanté » se dit aussi *Plan content / Plan contenta de te conéisser*.',
						'*Ieu* (moi) sert à insister : *Ieu, m’apèli Núria.*'
					]
				},
				{
					type: 'note',
					variant: 'son',
					title: 'Son du jour : le -on qui sonne « oun »',
					paragraphs: [
						'Le *-on* de *dison* sonne « oun » : *me dison* → mé DI-zoun.',
						'Et rappel de 1.1 : le *-a* final sonne « o » → *Encantada* = én-can-TA-do.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : syllabe forte en capitales.',
					items: [
						{ oc: 'Cossí te dison ?', sound: 'cou-si té DI-zoun', fr: 'comment t’appelles-tu ? (litt. « comment on te dit »)' },
						{ oc: 'Me dison…', sound: 'mé DI-zoun', fr: 'je m’appelle (« on me dit »)' },
						{ oc: 'Cossí t’apèlas ?', sound: 'cou-si ta-PÈ-los', fr: 'comment t’appelles-tu ?' },
						{ oc: 'M’apèli…', sound: 'ma-PÈ-li', fr: 'je m’appelle' },
						{ oc: 'Cossí vos dison ? / vos apelatz ?', sound: 'cou-si bous a-pé-LATS', fr: 'et en vouvoyant' },
						{ oc: 'Encantat ! / Encantada !', sound: 'én-can-TAT / én-can-TA-do', fr: 'enchanté·e !' }
					]
				}
			]
		},

		{
			title: 'Practica',
			minutes: 8,
			blocks: [
				{
					type: 'qcm',
					title: '3a · Bloc court',
					intro: 'Complète avec la bonne expression.',
					items: [
						{
							q: 'Demande son nom à ton ami : « Cossí ___ ? »',
							options: ['te dison', 'vos dison', 'vas'],
							correct: 0,
							explain: 'Un ami → *te*.'
						},
						{
							q: 'Réponds (façon « on me dit ») : « ___ Lisa. »',
							options: ['Me dison', 'M’apèli', 'Soi'],
							correct: 0,
							explain: '*Me dison Lisa.*'
						},
						{
							q: 'Réponds (l’autre façon) : « ___ Lisa. »',
							options: ['M’apèli', 'Me dison', 'Encantada'],
							correct: 0,
							explain: '*M’apèli Lisa.*'
						},
						{
							q: 'Une femme dit enchanté : « ___ ! »',
							options: ['Encantada', 'Encantat', 'Plan mercé'],
							correct: 0,
							explain: 'Femme → *-da* (prononcé -do).'
						},
						{
							q: 'Demande le nom en vouvoyant : « Cossí ___ dison ? »',
							options: ['vos', 'te', 'me'],
							correct: 0,
							explain: '*vos* = vouvoiement.'
						},
						{
							q: 'Insiste : « ___, m’apèli Pau. »',
							options: ['Ieu', 'Tu', 'E vos'],
							correct: 0,
							explain: '*Ieu,* devant = « moi, … ».'
						}
					]
				},
				{
					type: 'qcm',
					title: '3b · Mélange (avec 1.1)',
					items: [
						{
							q: 'Le matin, salue puis demande le nom (tu) :',
							options: ['Bonjorn ! Cossí te dison ?', 'Bon ser ! Cossí vos dison ?', 'A deman ! E tu ?'],
							correct: 0,
							explain: 'Matin → *Bonjorn* ; ami → *te*.'
						},
						{
							q: '« ___ Núria. E tu ? » (on me dit)',
							options: ['Me dison', 'M’apèli', 'Va plan'],
							correct: 0,
							explain: '*Me dison Núria.*'
						},
						{
							q: 'Un homme : « Encanta___ ! »',
							options: ['-t', '-da', '-tz'],
							correct: 0,
							noShuffle: true,
							explain: 'Homme → *Encantat*.'
						},
						{
							q: 'Ta vieille voisine : « Cossí ___ apelatz ? »',
							options: ['vos', 'te', 't’'],
							correct: 0,
							explain: 'Vouvoiement → *vos apelatz*.'
						},
						{
							q: 'Vrai ou faux : *M’apèli* est plus correct que *Me dison*.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							noShuffle: true,
							explain: 'Les deux sont également correctes : décision du cursus : deux façons, même rang.'
						},
						{
							q: 'Réponds à *Cossí vas ?* :',
							options: ['Va plan, mercé. E tu ?', 'Me dison Joan.', 'A lèu !'],
							correct: 0,
							explain: 'Le réflexe complet de 1.1.'
						},
						{
							q: '« Ieu, ___ Karim. » (deux réponses possibles : choisis-en une)',
							options: ['me dison', 'te dison', 'vos dison'],
							correct: 0,
							explain: '*me dison* ou *m’apèli* : les deux marchent.'
						},
						{
							q: 'Tu quittes Núria, vous vous reverrez bientôt : « ___ ! »',
							options: ['A lèu', 'A deman', 'Bon ser'],
							correct: 0,
							explain: '*A lèu* = à bientôt.'
						},
						{
							q: '*Cossí t’apèlas ?* : on parle à…',
							options: ['un ami, un proche', 'un groupe', 'quelqu’un qu’on vouvoie'],
							correct: 0,
							explain: 'Le *t’* tutoie.'
						},
						{
							q: 'Le soir, salue puis présente-toi :',
							options: ['Bon ser ! Me dison Lisa.', 'Bonjorn ! E tu ?', 'A deman ! M’apèli Lisa.'],
							correct: 0,
							explain: 'Soir → *Bon ser*, puis ton nom.'
						}
					]
				}
			]
		},

		{
			title: 'Parla',
			minutes: 7,
			blocks: [
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					items: [
						{
							prompt: 'Comment t’appelles-tu ?',
							tiles: ['Cossí', 'te', 'dison ?'],
							explain: '*Cossí te dison ?*'
						},
						{
							prompt: 'Moi, je m’appelle Núria.',
							tiles: ['Ieu,', 'm’apèli', 'Núria.'],
							explain: '*Ieu, m’apèli Núria.*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Ton mini-dialogue de rencontre',
					intro:
						'4 répliques : salue → demande le nom → dis le tien + « E tu ? » → enchanté·e. Dis-le à voix haute, puis compare.',
					items: [
						{
							q: '**Version « tu »** (deux amis se rencontrent).',
							a: 'Modèle : *— Adieu ! Cossí te dison ? — Me dison Pau. E tu ? — Ieu, m’apèli Lisa. Encantada ! — Encantat !*'
						},
						{
							q: '**Version « vous »** (le soir, avec une personne vouvoyée).',
							a: 'Modèle : *— Bon ser ! Cossí vos dison ? — Me dison Marià. E vos ? — Ieu, m’apèli Karim. Encantat ! — Encantada !*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Traduis',
					intro: 'Dis-le en occitan, puis vérifie.',
					items: [
						{ q: 'Comment t’appelles-tu ?', a: '*Cossí te dison ? / Cossí t’apèlas ?*' },
						{ q: 'Je m’appelle Loís (les deux façons).', a: '*Me dison Loís. / M’apèli Loís.*' },
						{ q: 'Enchantée !', a: '*Encantada !*' },
						{ q: 'Comment vous appelez-vous ?', a: '*Cossí vos dison ? / Cossí vos apelatz ?*' },
						{ q: 'Moi, on me dit Marià.', a: '*Ieu, me dison Marià.*' }
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Va plus vite : sans chrono',
					list: [
						'**Redis ton dialogue trois fois**, de plus en plus à l’aise.',
						'**Rejoue les deux scènes** avec 5 mots-clés : *Cossí ? – Me dison – M’apèli – Encantat – E vos ?*',
						'**Parle en même temps que l’audio** (à venir).'
					]
				}
			]
		},

		{
			title: 'Tasca finala + Bilan',
			minutes: 7,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'Tasca finala : À toi',
					paragraphs: [
						'Enregistre (ou écris) un dialogue de rencontre complet : salutation (1.1), demande de nom, présentation des deux personnes, « enchanté·e », congé. Une fois en « tu », une fois en « vous ».',
						'**Voie privée** : enregistre-toi, réécoute demain, coche les critères.',
						'**Voie communautaire** *(bientôt)* : poste ton audio sous le post Lo Ligam de la semaine.'
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'J’utilise les DEUX façons de dire mon nom',
						'*Encantat / Encantada* accordé à qui parle',
						'Le tu/vous est cohérent du début à la fin',
						'Prononciation : *dison* = « DI-zoun », le *-a* final = « o »'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple de production',
					items: [
						{
							q: 'Quand tu as fini (pas avant !), regarde un exemple.',
							a: '*— Bonjorn ! Cossí vos dison ? — Me dison Marià. E vos ? — Ieu, m’apèli Karim. Encantat ! — Encantada ! A lèu, Karim !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : Je peux…',
					intro: 'Coche seulement ce que tu sais faire **seul**.',
					items: [
						'demander son nom à quelqu’un (tu et vous)',
						'dire mon nom des deux façons',
						'dire enchanté·e, accordé',
						'insister avec *Ieu*'
					]
				},
				{
					type: 'reveal',
					title: 'Mini-test',
					intro: 'De mémoire, sans remonter la page.',
					items: [
						{ q: '« Comment t’appelles-tu ? » (une des deux façons)', a: '*Cossí te dison ?* ou *Cossí t’apèlas ?*' },
						{ q: '« On me dit Joan. »', a: '*Me dison Joan.*' },
						{ q: 'Une femme dit enchanté :', a: '*Encantada !*' },
						{ q: 'La version vouvoyée de *Cossí t’apèlas ?*', a: '*Cossí vos apelatz ?*' },
						{ q: 'Traduis « Moi, je m’appelle Lisa. »', a: '*Ieu, m’apèli Lisa.*' }
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : Los escais-noms',
					paragraphs: [
						'Dans les villages occitans, presque tout le monde avait : et a souvent encore, son *escais-nom* : un surnom affectueux, moqueur ou mystérieux, parfois transmis sur trois générations, au point qu’on oubliait le nom d’état civil.',
						'Demande autour de toi : il y a peut-être un *escais* dans ta famille.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Se parles catalan / castelhan',
					paragraphs: [
						'*Em dic Joan* ↔ *Me dison Joan* : même logique du « on me dit » ! *Com et dius ?* ↔ *Cossí te dison ?* · *Encantat/-ada* : mot pour mot le même qu’en catalan.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Réviser plus tard',
					paragraphs: [
						'Le site te les resservira :',
						'**Dans 2 jours** : *Cossí te dison ? → Me dison…*, *Encantat/-ada* · **Dans 7 jours** : *M’apèli / t’apèlas*, les formes en *vos* · **Dans 30 jours** : tout le module.'
					]
				}
			]
		}
	]
};
