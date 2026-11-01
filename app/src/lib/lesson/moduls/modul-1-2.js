// Module 1.2 · A1 · « Cossí te dison ? » : unité 1 (Adieu !), rédigé par
// Claude le 2026-10-25 sur le modèle du module 1.1 (même chemin en six
// étapes, carte de l'A1 §3). Forme du jour : me dison / m'apèli.
// Jeu du jour : le dialogue à choix avec Marià.
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul12 = {
	id: 'modul-1-2',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-2',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.2',
	oc: 'Cossí te dison ?',
	fr: 'Comment t’appelles-tu ? Dire et demander le nom',
	cando:
		'Je peux demander son nom à quelqu’un, en le tutoyant ou en le vouvoyant, dire le mien de deux façons, et dire enchanté ou enchantée.',
	durada: '~50 min · 6 étapes',
	nomsPropris: ['Núria', 'Loís', 'Marià', 'Karim', 'Lisa'],
	notesRelecture: [
		'Deux façons de dire son nom, présentées comme équivalentes : *Me dison* (« on me dit ») et *M’apèli*. Les deux te conviennent-elles en A1 ?',
		'*Cossí vos dison ?* et *Cossí vos apelatz ?* pour le vouvoiement : à confirmer.',
		'Syllabe forte : *apèli* « a-PÈ-li », *apèlas* « a-PÈ-los », mais *apelatz* « a-pé-LATS ».'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 1.1',
					intro:
						'Ton carnet de révision te ressert ce que tu as appris. Une question à la fois, de mémoire.',
					items: [
						{
							q: 'Le soir, tu arrives chez des amis :',
							options: ['Bon ser !', 'Bonjorn !', 'A deman !'],
							correct: 0,
							oc: true,
							choses: ['bon-ser'],
							explain: 'Le soir, en arrivant : *Bon ser !*'
						},
						{
							q: 'Ton ami te demande *Cossí vas ?* Tu réponds :',
							options: ['Va plan, mercés. E tu ?', 'Va plan, mercés. E vos ?'],
							correct: 0,
							oc: true,
							choses: ['va-plan-e-tu'],
							explain: 'Ton ami te tutoie : *E tu ?*'
						},
						{
							q: '*Adieu-siatz !* se dit…',
							options: ['à plusieurs personnes, ou en vouvoyant', 'à un ami seul'],
							correct: 0,
							choses: ['adieu-siatz'],
							explain: 'La fin en *-atz* dit « vous ».'
						},
						{
							q: 'À bientôt !',
							options: ['A lèu !', 'A deman !', 'Plan mercés !'],
							correct: 0,
							oc: true,
							choses: ['a-leu'],
							explain: '*A lèu* : à bientôt. *A deman* : à demain.'
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
					title: 'Deux rencontres à la fête du village',
					intro:
						'C’est la fête du village. Núria, qui arrive de Barcelone, rencontre Loís : ils sont jeunes, ils se tutoient. Plus tard, Marià rencontre Karim, qu’elle ne connaît pas : ils se vouvoient. Écoute deux fois, puis lis.',
					scenes: [
						{
							title: 'Núria e Loís',
							subtitle: '(Núria et Loís, en se tutoyant)',
							lines: [
								{ oc: 'Adieu ! Cossí te dison ?', sound: 'a-DIOU ! cou-si té DI-zoun ?', fr: 'Salut ! Comment t’appelles-tu ?' },
								{ oc: 'Me dison Loís. E tu, cossí t’apèlas ?', sound: 'mé DI-zoun lou-ÍS. é TU, cou-si ta-PÈ-los ?', fr: 'Je m’appelle Loís. Et toi, comment t’appelles-tu ?' },
								{ oc: 'Ieu, m’apèli Núria.', sound: 'YÉOU, ma-PÈ-li NOU-ria.', fr: 'Moi, je m’appelle Núria.' },
								{ oc: 'Encantat, Núria !', sound: 'én-can-TAT, NOU-ria !', fr: 'Enchanté, Núria !' },
								{ oc: 'Encantada !', sound: 'én-can-TA-do !', fr: 'Enchantée !' }
							]
						},
						{
							title: 'Marià e Karim',
							subtitle: '(Marià et Karim, en se vouvoyant)',
							lines: [
								{ oc: 'Bon ser ! Cossí vos dison ?', sound: 'bou(n) SÉ ! cou-si bous DI-zoun ?', fr: 'Bonsoir ! Comment vous appelez-vous ?' },
								{ oc: 'Me dison Karim. E vos ?', sound: 'mé DI-zoun ka-RIM. é BOUS ?', fr: 'Je m’appelle Karim. Et vous ?' },
								{ oc: 'Ieu, me dison Marià. Encantada !', sound: 'YÉOU, mé DI-zoun ma-ri-A. én-can-TA-do !', fr: 'Moi, je m’appelle Marià. Enchantée !' },
								{ oc: 'Encantat !', sound: 'én-can-TAT !', fr: 'Enchanté !' }
							]
						}
					],
					glossary: [{ oc: 'la fèsta', sound: 'la FÈS-to', fr: 'la fête' }]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Comment s’appelle le jeune homme de la première scène ?',
							options: ['Loís', 'Karim', 'Núria'],
							correct: 0,
							explain: '*Me dison Loís* : je m’appelle Loís.'
						},
						{
							q: 'Qui dit *Encantada !* ?',
							options: ['Núria et Marià', 'Loís et Karim'],
							correct: 0,
							choses: ['encantat'],
							explain: 'Une femme dit *Encantada*, un homme *Encantat*.'
						},
						{
							q: 'Marià et Karim se vouvoient. Quel mot te le montre ?',
							options: ['vos', 'te', 'ieu'],
							correct: 0,
							oc: true,
							choses: ['cossi-vos-dison'],
							explain: '*Cossí vos dison ?* : *vos*, comme dans *E vos ?* (module 1.1).'
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
					title: 'Deux façons de dire son nom',
					intro: 'Compare les répliques des deux scènes.',
					items: [
						{
							q: '*Me dison Loís* et *M’apèli Núria* : ces deux phrases veulent dire…',
							options: ['la même chose : je m’appelle…', 'deux choses différentes'],
							correct: 0,
							noShuffle: true,
							choses: ['me-dison', 'm-apeli'],
							explain: 'Deux façons de dire « je m’appelle ». *Me dison*, mot à mot : « on me dit ».'
						},
						{
							q: 'Dans *Cossí te dison ?*, le petit mot *te* veut dire…',
							options: ['te (toi)', 'me (moi)', 'vous'],
							correct: 0,
							choses: ['cossi-te-dison'],
							explain: '*Cossí te dison ?* : « comment on te dit ? », comment t’appelles-tu ?'
						},
						{
							q: 'Et pour vouvoyer, *te* devient…',
							options: ['vos', 'me', 'tu'],
							correct: 0,
							oc: true,
							choses: ['cossi-vos-dison'],
							explain: '*Cossí vos dison ?* Comme en français : te, vous.'
						},
						{
							q: 'Núria dit *Ieu, m’apèli Núria.* Le mot *Ieu* sert à…',
							options: ['insister : moi, je…', 'dire bonjour', 'poser une question'],
							correct: 0,
							choses: ['ieu'],
							explain: '*Ieu* : moi. On l’ajoute pour insister, comme « moi, je m’appelle… ».'
						}
					]
				},
				{
					type: 'table',
					title: 'Le nom : deux mélodies au choix',
					head: ['', 'demander (tu)', 'demander (vous)', 'répondre'],
					rows: [
						['« on me dit »', '*Cossí te dison ?*', '*Cossí vos dison ?*', '*Me dison…*'],
						['« je m’appelle »', '*Cossí t’apèlas ?*', '*Cossí vos apelatz ?*', '*M’apèli…*']
					],
					notes: [
						'Les deux colonnes se valent : choisis la mélodie que tu préfères, et reconnais l’autre.',
						'Devant une voyelle, *me* et *te* perdent leur *e* : *m’apèli*, *t’apèlas*.',
						'Enchanté : *Encantat* si tu es un homme, *Encantada* si tu es une femme.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet.',
					items: [
						{ id: 'cossi-te-dison', oc: 'Cossí te dison ?', sound: 'cou-si té DI-zoun', fr: 'comment t’appelles-tu ? (« comment on te dit ? »)' },
						{ id: 'me-dison', oc: 'Me dison…', sound: 'mé DI-zoun', fr: 'je m’appelle… (« on me dit »)' },
						{ id: 'cossi-t-apelas', oc: 'Cossí t’apèlas ?', sound: 'cou-si ta-PÈ-los', fr: 'comment t’appelles-tu ?' },
						{ id: 'm-apeli', oc: 'M’apèli…', sound: 'ma-PÈ-li', fr: 'je m’appelle…' },
						{ id: 'cossi-vos-dison', oc: 'Cossí vos dison ? · Cossí vos apelatz ?', sound: 'cou-si bous DI-zoun · cou-si bous a-pé-LATS', fr: 'comment vous appelez-vous ?' },
						{ id: 'encantat', oc: 'Encantat ! · Encantada !', sound: 'én-can-TAT · én-can-TA-do', fr: 'enchanté ! · enchantée !' },
						{ id: 'ieu', oc: 'Ieu, …', sound: 'YÉOU', fr: 'moi, … (pour insister)' }
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
					type: 'causida',
					title: 'Rencontre avec Marià',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Marià te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Marià',
					tours: [
						{
							situacion: 'Le soir, à la fête du village. Une dame âgée que tu ne connais pas vient vers toi.',
							ditz: 'Bon ser !',
							options: [
								{ oc: 'Bon ser !', bon: true },
								{ oc: 'Bonjorn !', reaccion: 'Marià sourit et regarde le ciel : il fait nuit depuis longtemps.' },
								{ oc: 'A deman !', reaccion: 'Marià s’étonne : tu pars déjà ? Elle vient juste d’arriver.' }
							],
							choses: ['bon-ser'],
							explain: 'Le soir : *Bon ser !*'
						},
						{
							ditz: 'Cossí vos dison ?',
							options: [
								{ oc: 'Me dison…', bon: true },
								{ oc: 'Va plan, mercés.', reaccion: 'Marià rit : elle ne t’a pas demandé comment tu vas, mais ton nom.' },
								{ oc: 'Encantat !', reaccion: 'Un peu tôt : elle ne t’a pas encore dit son nom.' }
							],
							choses: ['cossi-vos-dison', 'me-dison'],
							explain: 'Elle te demande ton nom : *Me dison…* ou *M’apèli…*, puis ton prénom.'
						},
						{
							situacion: 'À ton tour : demande-lui son nom. C’est une dame âgée que tu ne connais pas.',
							options: [
								{ oc: 'E vos, cossí vos dison ?', bon: true },
								{ oc: 'E tu, cossí te dison ?', reaccion: 'Marià hausse un sourcil : on vouvoie une dame qu’on ne connaît pas.' },
								{ oc: 'A lèu !', reaccion: 'Marià reste là, étonnée : tu ne veux pas savoir son nom ?' }
							],
							choses: ['cossi-vos-dison'],
							explain: 'En la vouvoyant : *E vos, cossí vos dison ?*'
						},
						{
							ditz: 'Ieu, m’apèli Marià. Encantada !',
							options: [
								{ oc: 'Encantat !', bon: true },
								{ oc: 'Encantada !', bon: true },
								{ oc: 'Adieu-siatz !', reaccion: 'Marià est surprise : vous venez à peine de faire connaissance.' }
							],
							choses: ['encantat'],
							explain: '*Encantat* si tu es un homme, *Encantada* si tu es une femme : les deux vont.'
						},
						{
							ditz: 'Cossí anatz ?',
							options: [
								{ oc: 'Va plan, mercés. E vos ?', bon: true },
								{ oc: 'Va plan, mercés. E tu ?', reaccion: 'Marià te vouvoie : tu peux la vouvoyer aussi.' },
								{ oc: 'M’apèli Marià.', reaccion: 'Marià rit : c’est elle, Marià !' }
							],
							choses: ['va-plan-e-tu'],
							explain: 'Répondre, puis retourner la question en vouvoyant : *E vos ?*'
						},
						{
							ditz: 'Va plan ! A lèu !',
							options: [
								{ oc: 'A lèu ! Adieu-siatz !', bon: true },
								{ oc: 'Bonjorn !', reaccion: 'Marià part déjà : c’est le moment de dire au revoir.' },
								{ oc: 'Cossí vos dison ?', reaccion: 'Tu connais déjà son nom : Marià !' }
							],
							choses: ['a-leu', 'adieu-siatz'],
							explain: '*A lèu ! Adieu-siatz !* : à bientôt, au revoir.'
						}
					],
					fin: 'Bravo ! Ta première vraie conversation en occitan : saluer, se nommer, demander comment ça va, partir.'
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
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Dis ton nom : je m’appelle… (avec ton prénom).',
							debut: ['Me dison', 'M’apèli'],
							choses: ['me-dison', 'm-apeli'],
							explain: 'Avec *Me dison* ou *M’apèli*, puis ton prénom.'
						},
						{
							consigne: 'Demande son nom à un ami.',
							answers: ['Cossí te dison ?', 'Cossí t’apèlas ?'],
							choses: ['cossi-te-dison', 'cossi-t-apelas']
						},
						{
							consigne: 'Demande son nom à une dame âgée que tu ne connais pas.',
							answers: ['Cossí vos dison ?', 'Cossí vos apelatz ?'],
							choses: ['cossi-vos-dison']
						},
						{
							consigne: 'Enchanté ! (ou enchantée !)',
							answers: ['Encantat !', 'Encantada !'],
							choses: ['encantat']
						},
						{
							consigne: 'Moi, je m’appelle… (avec ton prénom).',
							debut: ['Ieu, me dison', 'Ieu, m’apèli'],
							choses: ['ieu'],
							explain: '*Ieu* pour insister : moi, je…'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Je m’appelle Loís. Et toi, comment t’appelles-tu ?',
							tiles: ['Me', 'dison', 'Loís.', 'E', 'tu,', 'cossí', 't’apèlas ?'],
							choses: ['me-dison', 'cossi-t-apelas'],
							explain: '*Me dison Loís. E tu, cossí t’apèlas ?*'
						},
						{
							prompt: 'Bonsoir ! Comment vous appelez-vous ?',
							tiles: ['Bon', 'ser !', 'Cossí', 'vos', 'dison ?'],
							choses: ['bon-ser', 'cossi-vos-dison'],
							explain: '*Bon ser ! Cossí vos dison ?*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute',
					intro:
						'Dis à voix haute la rencontre : saluer, demander le nom, répondre, dire enchanté, partir. Puis compare au modèle.',
					items: [
						{
							q: 'Avec un jeune à la fête (tu).',
							a: 'Par exemple : *Adieu ! Cossí te dison ? · M’apèli Lisa. E tu ? · Ieu, me dison Loís. Encantat ! · Encantada ! A lèu !*'
						},
						{
							q: 'Avec une dame âgée (vous).',
							a: 'Par exemple : *Bon ser ! Cossí vos dison ? · Me dison Marià. E vos ? · M’apèli Lisa. Encantada ! · Encantada ! Adieu-siatz !*'
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
					title: 'Le son du jour : la syllabe forte',
					paragraphs: [
						'Chaque mot a une syllabe où la voix appuie. L’accent écrit te la montre : *apèli* se dit « a-PÈ-li », *apèlas* « a-PÈ-los ».',
						'Sans accent écrit, la voix appuie le plus souvent sur l’avant-dernière syllabe : *dison* « DI-zoun », *Encantada* « én-can-TA-do ». Mais sur la dernière quand le mot finit par une consonne autre que *s* : *Encantat* « én-can-TAT ».',
						'Écoute, puis répète en tapant la syllabe forte dans tes mains : *m’apèli*, *me dison*, *encantat*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: 'Où appuie la voix dans *apèli* ?',
							options: ['a-PÈ-li', 'A-pè-li', 'a-pè-LI'],
							correct: 0,
							noShuffle: true,
							explain: 'L’accent sur le *è* te le montre.'
						},
						{
							q: 'Et dans *apelatz* (sans accent écrit) ?',
							options: ['a-pé-LATS', 'a-PÉ-lats'],
							correct: 0,
							noShuffle: true,
							explain: 'Le mot finit par *-tz* : la voix va sur la dernière syllabe, comme dans *anatz* (module 1.1).'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra dans ton carnet.',
					items: [
						'demander son nom à quelqu’un, en tutoyant ou en vouvoyant',
						'dire mon nom de deux façons',
						'dire enchanté ou enchantée',
						'insister avec « moi, je… »'
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : les surnoms de village',
					glosa: { escais: 'surnom' },
					paragraphs: [
						'Dans les villages occitans, presque tout le monde avait son *escais* (son surnom) : affectueux, moqueur ou mystérieux, parfois transmis sur trois générations, au point qu’on en oubliait le nom de l’état civil.',
						'Demande autour de toi : il y a peut-être un surnom de ce genre dans ta famille.'
					]
				}
			]
		}
	]
};
