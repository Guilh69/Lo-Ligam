// Module 2.3 · A1 · « Cossí se ditz… ? » : unité 2 (Parlas occitan ?), rédigé
// par Claude le 2026-11-01 sur le modèle de l'unité 1. Chemin commun :
// 1 révision du jour · 2 Escota · 3 Obsèrva · 4 Lo jòc del jorn · 5 A tu ! ·
// 6 Lo son e lo bilanç. Forme du jour : les petits mots pour questionner, et
// les phrases pour se débrouiller. Encadrés « À retenir » repris tels quels de
// Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/lexic-A1.md (2.3).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul23 = {
	id: 'modul-2-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '2-3',
	unitat: 'Unitat 2 · Parlas occitan ?',
	nivel: 'A1 · Modul 2.3',
	oc: 'Cossí se ditz… ?',
	fr: 'Comment dit-on… ? Se débrouiller quand on ne comprend pas',
	cando:
		'Je peux faire répéter, demander ce qu’est une chose, ce que veut dire un mot ou comment il se dit en occitan, demander qui est quelqu’un et quelle langue il parle, et dire que je ne sais pas.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Loís', 'Giulia', 'Karim'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Núria découvre que *fogassa* se dit aussi *fogassa* en catalan (le mot existe en catalan : Wikipédia en catalan, article « Fogassa »). Tu gardes cette touche ?',
		'*Pòdes repetir en occitan, se te plai ?* : la réplique pour ramener l’occitan quand l’autre passe au français (reprise dans la tâche, en 2.4). Elle te va ?',
		'*Qui es ?* « ki ÉS », *Qual es ?* « kal ÉS », *Quina* « KI-no », *aquò* « a-KÒ » : bon pour l’enregistrement ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des modules 2.1 et 2.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Tu veux dire « je ne comprends pas » :',
							options: ['Non compreni pas.', 'Non parli pas.', 'Comprenes ?'],
							correct: 0,
							oc: true,
							choses: ['pas', 'comprene-singular'],
							explain: '*Compreni* (je comprends), puis *pas*.'
						},
						{
							q: 'Núria parle un peu français. Karim le dit :',
							options: ['Parla un pauc francés.', 'Parli un pauc francés.', 'Parla plan francés.'],
							correct: 0,
							oc: true,
							choses: ['parlar-singular', 'un-pauc-plan'],
							explain: '*Parla* : elle parle. *Un pauc* : un peu.'
						},
						{
							q: 'Un homme venu d’Espagne est…',
							options: ['espanhòl', 'espanhòla', 'portugués'],
							correct: 0,
							oc: true,
							choses: ['espanhol-espanhola'],
							explain: 'Un homme : *espanhòl*, sans *-a*.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{ consigne: 'Je parle aussi anglais.', answers: ['Parli tanben anglés.', 'Parli anglés tanben.'], choses: ['tanben', 'angles-anglesa'] },
						{
							consigne: 'Elle est portugaise, mais elle parle occitan.',
							answers: ['Es portuguesa, mas parla occitan.', 'Ela es portuguesa, mas parla occitan.'],
							choses: ['portugues-portuguesa', 'mas']
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
					title: 'Des questions à la foire',
					intro:
						'Sur un stand de la *fièra*, Núria goûte un pain plat qu’elle ne connaît pas. Un peu plus loin, Giulia voit Núria parler avec un garçon. Lis une première fois pour répondre à une seule question : que font Núria et Giulia ?',
					scenes: [
						{
							title: 'Núria e Loís',
							subtitle: '(Núria montre le pain à Loís)',
							lines: [
								{ oc: 'Loís, qué es aquò ?', sound: 'lou-ÍS, ké és a-KÒ ?', fr: 'Loís, qu’est-ce que c’est ?' },
								{ oc: 'Es una fogassa.', sound: 'és U-no fou-GA-sso.', fr: 'C’est une fougasse.' },
								{ oc: 'Pòdes repetir, se te plai ?', sound: 'PÒ-dés ré-pé-TI, sé té PLAÏ ?', fr: 'Tu peux répéter, s’il te plaît ?' },
								{ oc: 'Una fogassa !', sound: 'U-no fou-GA-sso !', fr: 'Une fougasse !' },
								{ oc: 'Fogassa… Qué vòl dire ?', sound: 'fou-GA-sso… ké BÒL DI-ré ?', fr: 'Fougasse… Qu’est-ce que ça veut dire ?' },
								{ oc: 'Non sabi pas cossí se ditz en catalan !', sound: 'nou SA-bi PAS cou-si sé DITS én ca-ta-LA !', fr: 'Je ne sais pas comment on le dit en catalan !' },
								{ oc: 'Fogassa ? En catalan, es fogassa tanben !', sound: 'fou-GA-sso ? én ca-ta-LA, és fou-GA-sso tam-BÉ !', fr: 'Fougasse ? En catalan aussi, c’est fogassa !' }
							]
						},
						{
							title: 'Giulia e Karim',
							subtitle: '(Giulia montre le garçon à Karim)',
							lines: [
								{ oc: 'Karim, qui es ?', sound: 'ka-RIM, ki ÉS ?', fr: 'Karim, qui est-ce ?' },
								{ oc: 'Es Loís, del vilatge.', sound: 'és lou-ÍS, dél bi-LA-djé.', fr: 'C’est Loís, du village.' },
								{ oc: 'Quina lenga parla ? Occitan o francés ?', sound: 'KI-no LÉN-go PAR-lo ? ou-tsi-TA ou fran-SÉS ?', fr: 'Quelle langue parle-t-il ? Occitan ou français ?' },
								{ oc: 'Occitan ! E francés tanben.', sound: 'ou-tsi-TA ! é fran-SÉS tam-BÉ.', fr: 'Occitan ! Et français aussi.' },
								{ oc: 'E ont demòra ?', sound: 'é OUN dé-MÒ-ro ?', fr: 'Et où habite-t-il ?' },
								{ oc: 'Aquí, al vilatge.', sound: 'a-KI, al bi-LA-djé.', fr: 'Ici, au village.' }
							]
						}
					],
					glossary: [{ oc: 'una fogassa', sound: 'U-no fou-GA-sso', fr: 'une fougasse : un pain plat, salé ou sucré selon les pays' }]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Que font Núria et Giulia ?',
							options: ['elles posent des questions', 'elles se présentent', 'elles disent au revoir'],
							correct: 0,
							explain: 'Núria demande ce qu’est ce pain : *Qué es aquò ?* Giulia demande qui est le garçon : *Qui es ?*'
						},
						{
							q: 'Pourquoi Núria dit-elle *Pòdes repetir, se te plai ?*',
							options: ['elle n’a pas bien entendu le mot', 'elle veut partir', 'elle ne connaît pas Loís'],
							correct: 0,
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir, se te plai ?* : tu peux répéter, s’il te plaît ? Loís redit le mot : *Una fogassa !*'
						},
						{
							q: 'Loís dit : *Non sabi pas cossí se ditz en catalan !* Il veut dire…',
							options: ['je ne sais pas comment on le dit en catalan', 'je ne parle pas catalan', 'je ne comprends pas le catalan'],
							correct: 0,
							choses: ['sabi-pas', 'cossi-se-ditz'],
							explain: '*Non sabi pas* : je ne sais pas. *Cossí se ditz…* : comment le dit-on…'
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
					title: 'Un petit mot pour questionner',
					intro: 'Chaque question commence par un petit mot. Regarde ce qu’il demande.',
					items: [
						{
							q: '*Qué es aquò ?* Núria demande…',
							options: ['ce que c’est', 'qui c’est', 'où c’est'],
							correct: 0,
							noShuffle: true,
							choses: ['que-es-aquo'],
							explain: '*qué* : quoi, pour une chose. *aquò* : ça.'
						},
						{
							q: '*Qui es ?* Giulia demande…',
							options: ['ce que c’est', 'qui c’est', 'où c’est'],
							correct: 1,
							noShuffle: true,
							choses: ['qui-es'],
							explain: '*qui* : qui, quand on attend un nom (*Es Loís*).'
						},
						{
							q: '*E ont demòra ?* Giulia demande…',
							options: ['où il habite', 'qui il est', 'quelle langue il parle'],
							correct: 0,
							choses: ['ont-demoras'],
							explain: '*ont* : où (module 1.3).'
						},
						{
							q: 'Giulia demande *Quina lenga parla ?* Pourquoi *quina*, et pas *quin* ?',
							options: ['parce que *la lenga* est féminin', 'parce que Giulia est une femme', 'parce que c’est une question'],
							correct: 0,
							choses: ['quin-quina'],
							explain: '*quin* ou *quina* va avec le mot qui suit : *quina lenga*, *quin país*.'
						},
						{
							q: '*Occitan o francés ?* Ici, *o* veut dire…',
							options: ['ou', 'oui', 'et'],
							correct: 0,
							choses: ['o-ou'],
							explain: '*o* : ou. Ne le confonds pas avec *òc* (oui), ni avec *e* (et).'
						},
						{
							q: '*Fogassa… Qué vòl dire ?* Núria demande…',
							options: ['ce que veut dire le mot', 'comment le mot se dit en catalan', 'qui a fait ce pain'],
							correct: 0,
							choses: ['que-vol-dire'],
							explain: '*Qué vòl dire… ?* : que veut dire… ? Pour un mot que tu ne connais pas.'
						}
					]
				},
				{
					type: 'table',
					title: 'Les petits mots pour questionner',
					head: ['', 'il questionne sur…', 'exemple'],
					rows: [
						['*qué*', 'une chose', '*Qué es aquò ?* · *Qué vòl dire… ?*'],
						['*qui*', 'une personne, quand on attend son nom', '*Qui es ?* · *Es Loís.*'],
							['*qual*', 'ce qu’est la personne, son rôle (tu le retrouveras au module 3.2)', '*Qual es ?*'],
						['*quin*, *quina*', 'un choix, avec un mot masculin ou féminin', '*Quin país ?* · *Quina lenga parlas ?*'],
						['*ont*', 'un lieu (module 1.3)', '*Ont demòras ?* · *D’ont siás ?*'],
						['*cossí*', 'la manière (module 1.1)', '*Cossí vas ?* · *Cossí se ditz… ?*']
					],
					notes: [
						'*o* (ou) n’est pas *òc* (oui) : *Occitan o francés ?*',
						'*Se te plai* (s’il te plaît) se met à la fin : *Pòdes repetir, se te plai ?*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/2)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'que-es-aquo', oc: 'Qué es aquò ?', sound: 'ké és a-KÒ', fr: 'qu’est-ce que c’est ?' },
						{ id: 'qui-es', oc: 'Qui es ?', sound: 'ki ÉS', fr: 'qui est-ce ? (on attend un nom : *Es Loís*)' },
						{ id: 'qual-es', oc: 'Qual es ?', sound: 'kal ÉS', fr: 'qui est-ce ? (on attend ce qu’est la personne, son rôle)' },
						{ id: 'quin-quina', oc: 'Quin… ? · Quina… ?', sound: 'KI(N) · KI-no', fr: 'quel… ? · quelle… ? (*Quina lenga parlas ?*)' },
						{ id: 'o-ou', oc: 'Occitan o francés ?', sound: 'ou-tsi-TA ou fran-SÉS', fr: 'occitan ou français ? (*o* : ou)' }
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
					type: 'chunks',
					title: 'À retenir (2/2)',
					intro: 'Quatre phrases pour te débrouiller, puis le jeu.',
					items: [
						{ id: 'cossi-se-ditz', oc: 'Cossí se ditz… en occitan ?', sound: 'cou-si sé DITS… én ou-tsi-TA', fr: 'comment dit-on… en occitan ?' },
						{ id: 'que-vol-dire', oc: 'Qué vòl dire… ?', sound: 'ké BÒL DI-ré', fr: 'que veut dire… ?' },
						{ id: 'podes-repetir', oc: 'Pòdes repetir, se te plai ?', sound: 'PÒ-dés ré-pé-TI, sé té PLAÏ', fr: 'tu peux répéter, s’il te plaît ?' },
						{ id: 'sabi-pas', oc: 'Non sabi pas.', sound: 'nou SA-bi PAS', fr: 'je ne sais pas.' }
					]
				},
				// jeu prévu par la carte : lettres à cocher, compléter les mots (à coder) ;
				// version simple : escriure. Le mot à trous est entre guillemets, sans
				// italique (ce n'est pas encore un mot) ; la réponse est le mot entier ou
				// toute la phrase.
				{
					type: 'escriure',
					title: 'Complète les mots',
					// Groupes de lettres, expliqués dans les explications mêmes (le contrôle les lit comme des mots).
					glosa: { tz: 'se dit « ts »', qu: 'se dit « k »' },
					intro:
						'Il manque des lettres. Lis le « ça sonne comme » à voix haute, puis écris le mot entier, ou toute la phrase.',
					items: [
						{
							consigne: '« Cossí se di _ _ en occitan ? » · ça sonne « cou-si sé DITS »',
							answers: ['ditz', 'Cossí se ditz en occitan ?'],
							indici: 'Le son « ts » s’écrit comme à la fin de *Cossí anatz ?*',
							choses: ['cossi-se-ditz'],
							explain: '*ditz* : *tz* sonne « ts ». *Cossí se ditz… en occitan ?* : comment dit-on… en occitan ?'
						},
						{
							consigne: '« Qué _ òl dire ? » · ça sonne « ké BÒL DI-ré »',
							answers: ['vòl', 'Qué vòl dire ?'],
							indici: 'Le son « b » s’écrit parfois autrement, comme dans *Cossí vas ?* « cou-si BAS ».',
							choses: ['que-vol-dire'],
							explain: '*vòl* : le *v* sonne « b ». *Qué vòl dire… ?* : que veut dire… ?'
						},
						{
							consigne: '« Pòdes repeti _, se te plai ? » · ça sonne « PÒ-dés ré-pé-TI, sé té PLAÏ »',
							answers: ['repetir', 'Pòdes repetir, se te plai ?'],
							indici: 'Un verbe, comme *parlar* : sa dernière lettre ne se dit pas.',
							choses: ['podes-repetir'],
							explain: 'Le *r* de *repetir* se tait, comme celui de *parlar*.'
						},
						{
							consigne: '« Non sabi pa _. » · ça sonne « nou SA-bi PAS »',
							answers: ['pas', 'Non sabi pas.'],
							indici: 'Le mot d’après le verbe, dans « ne… pas » (module 2.2).',
							choses: ['sabi-pas', 'pas'],
							explain: '*Non sabi pas* : je ne sais pas. Le *s* final se dit.'
						},
						{
							consigne: '« Q _ al es ? » · ça sonne « kal ÉS »',
							answers: ['qual', 'Qual es ?'],
							indici: 'Le son « k » s’écrit ici comme au début de *qué*.',
							choses: ['qual-es'],
							explain: '*qu* devant *a* sonne « k » : *Qual es ?*, qui est-ce ?'
						},
						{
							consigne: '« Quin _ lenga parlas ? » · ça sonne « KI-no LÉN-go PAR-los »',
							answers: ['quina', 'Quina lenga parlas ?'],
							indici: '*lenga* est féminin ; et le « o » de la fin s’écrit comme celui de *lenga*.',
							choses: ['quin-quina'],
							explain: '*quina* : le *a* final sonne « o ».'
						},
						{
							consigne: '« Qué es aqu _ ? » · ça sonne « ké és a-KÒ »',
							answers: ['aquò', 'Qué es aquò ?'],
							indici: 'Le son « o » sur lequel la voix appuie s’écrit avec un accent, comme dans *òc*.',
							choses: ['que-es-aquo'],
							explain: '*aquò* : ça. *ò* sonne « o ».'
						},
						{
							consigne: '« Occitan _ francés ? » · ça sonne « ou-tsi-TA ou fran-SÉS »',
							answers: ['o', 'Occitan o francés ?'],
							indici: 'Le son « ou » s’écrit ici avec une seule lettre.',
							choses: ['o-ou'],
							explain: '*o* : ou. Sans accent, il sonne « ou ».'
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
						'Que dire quand tu ne comprends pas ? Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Quelqu’un te parle trop vite. Demande-lui de répéter.',
							answers: ['Pòdes repetir, se te plai ?', 'Pòdes repetir ?'],
							choses: ['podes-repetir']
						},
						{ consigne: 'Tu montres un objet. Demande comment on le dit en occitan.', answers: ['Cossí se ditz en occitan ?'], choses: ['cossi-se-ditz'] },
						{
							consigne: 'On te demande *Qué vòl dire « òsca » ?* Tu as oublié. Réponds.',
							answers: ['Non sabi pas.'],
							choses: ['sabi-pas'],
							explain: '*Òsca*, c’est « bravo ! » : tu l’as vu à la fin de l’unité 1.'
						},
						{ consigne: 'Demande à une amie quelle langue elle parle.', answers: ['Quina lenga parlas ?'], choses: ['quin-quina'] },
						{
							consigne: 'Et toi ? Réponds à *Quina lenga parlas ?*',
							debut: ['Parli'],
							choses: ['parlar-singular'],
							explain: 'Par exemple : *Parli francés, e un pauc occitan.*'
						},
						{
							consigne: 'Tu entends un mot occitan que tu ne connais pas. Demande ce qu’il veut dire : *Qué vòl dire…*',
							debut: ['Qué vòl dire'],
							choses: ['que-vol-dire'],
							explain: 'Puis le mot : *Qué vòl dire « fièra » ?*'
						},
						{
							consigne: 'Quelqu’un te répond en français. Demande-lui de répéter en occitan.',
							answers: ['Pòdes repetir en occitan, se te plai ?', 'Pòdes repetir en occitan ?'],
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir en occitan, se te plai ?* : sans reproche, et la conversation repart en occitan.'
						},
						{ consigne: 'Tu vois quelqu’un que tu ne connais pas. Demande à ton ami qui c’est.', answers: ['Qui es ?'], choses: ['qui-es'] },
						{ consigne: 'Demande à Giulia : occitan ou italien ?', answers: ['Occitan o italian ?'], choses: ['o-ou'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Je ne sais pas comment on le dit en catalan.',
							tiles: ['Non', 'sabi', 'pas', 'cossí', 'se', 'ditz', 'en', 'catalan.'],
							choses: ['sabi-pas', 'cossi-se-ditz'],
							explain: '*Non sabi pas* d’abord, puis *cossí se ditz*.'
						},
						{
							prompt: 'Qu’est-ce que c’est ? Tu peux répéter, s’il te plaît ?',
							tiles: ['Qué', 'es', 'aquò ?', 'Pòdes', 'repetir,', 'se', 'te', 'plai ?'],
							choses: ['que-es-aquo', 'podes-repetir'],
							explain: '*se te plai* se met à la fin.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : la débrouille',
					intro: 'Trois situations : dis à voix haute ce que tu dirais, puis compare au modèle.',
					items: [
						{
							q: 'Une dame te parle très vite. Tu n’as rien compris.',
							a: 'Par exemple : *Non compreni pas. Pòdes repetir, se te plai ?*'
						},
						{
							q: 'Sur un stand, un gâteau que tu ne connais pas.',
							a: '*Qué es aquò ?* Et si on te répond par un mot que tu ne connais pas : *Qué vòl dire ?*'
						},
						{
							q: 'Tu parles occitan avec quelqu’un, et il passe au français.',
							a: '*Pòdes repetir en occitan, se te plai ?*'
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
					title: 'Le son du jour : la voix qui monte',
					paragraphs: [
						'Sans petit mot pour questionner, c’est la voix qui fait la question : elle monte à la fin. *Parlas occitan.* (tu parles occitan) devient *Parlas occitan ?* (tu parles occitan ?).',
						'Avec *qué*, *qual*, *ont* ou *cossí*, le petit mot suffit déjà à dire que c’est une question.',
						'Répète à voix haute, en faisant monter la voix : *Comprenes ?* *Siás occitana ?* *Pòdes repetir ?*'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: 'Quand la voix monte à la fin de *Parlas occitan*, c’est…',
							options: ['une question', 'une réponse'],
							correct: 0,
							noShuffle: true,
							explain: '*Parlas occitan ?* : tu parles occitan ? Sans la voix qui monte : *Parlas occitan.*, tu parles occitan.'
						},
						{
							q: 'Laquelle n’a besoin que de la voix pour être une question ?',
							options: ['Comprenes ?', 'Qué es aquò ?'],
							correct: 0,
							noShuffle: true,
							explain: '*Comprenes ?* n’a pas de petit mot pour questionner : seule la voix en fait une question. *Qué es aquò ?* a déjà *qué*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis chaque phrase deux fois : d’abord pour l’affirmer, puis pour la demander. *Parlas occitan.* · *Compren.* · *Siás catalana.* Puis regarde.',
							a: '*Parlas occitan. Parlas occitan ?* · *Compren. Compren ?* · *Siás catalana. Siás catalana ?* Les mots restent les mêmes : seule la voix change.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : les langues du « oui »',
					glosa: { oc: 'oui (ancienne graphie)', oïl: 'oui (ancien français)', sì: 'oui (italien)' },
					paragraphs: [
						'Tu l’as vu au module 1.3 : l’occitan porte son « oui » dans son nom. Au début du XIVe siècle, le poète italien Dante classe les langues d’après leur façon de dire « oui » : *oc*, *oïl* ou *sì*.',
						'Il rapporte l’argument de la langue d’*oc* : c’est en elle qu’ont écrit les premiers poètes en langue du peuple (il cite le troubadour Peire d’Alvernhe). Aujourd’hui encore, « oui » se dit *òc*. Source : Dante, « De vulgari eloquentia », livre I, chapitres 8 à 10.'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'faire répéter quelqu’un, en occitan',
						'demander ce qu’est une chose, ce que veut dire un mot, comment il se dit en occitan',
						'demander qui est quelqu’un, et quelle langue il parle',
						'dire que je ne sais pas'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant te débrouiller quand tu ne comprends pas.',
						'Si tu en as envie : la prochaine fois que quelqu’un parle occitan près de toi, demande-lui *Qué vòl dire… ?* pour un mot, ou *Pòdes repetir, se te plai ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
