// Module 4.2 · A1 · « Qué fas dins la vida ? » : unité 4 (Qué fas ?), rédigé
// par Claude le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six
// étapes, carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : far au singulier (fau, fas, fa) ; far de + métier ; dins la
// vida en bloc ; le féminin des métiers (lexic-A1.md, 4.2).
// Scène : à midi, au village, là où Loís cuisine.
// Métiers des personnages (à garder dans la halte 2) : Karim (20 ans, unité 3)
// infirmier à Toulouse ; Lisa ingénieure à Montpellier ; Núria (19 ans)
// étudiante à Toulouse ; Yasmine paysanne au village ; Loís cuisinier au
// village ; Marià à la retraite.
// Jeu du jour : l'intrus (qcm, en mots).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique, plus mèstre, mèstra,
// molinièr, boièr), à valider par Romain. Féminins de mètge et de vinhairon :
// absents du Basic, jamais employés (lexique, 4.2).

export const modul42 = {
	id: 'modul-4-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '4-2',
	unitat: 'Unitat 4 · Qué fas ?',
	nivel: 'A1 · Modul 4.2',
	oc: 'Qué fas dins la vida ?',
	fr: 'Que fais-tu dans la vie ? Dire son métier',
	cando:
		'Je peux dire mon métier ou que je suis à la retraite, demander celui des autres, et dire un métier au masculin comme au féminin.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Lisa', 'Núria', 'Yasmine', 'Marià'],
	notesRelecture: [
		'Pour dire son métier, *Fau de cosinièr* (et *d’* devant une voyelle : *Fau d’infirmièr*) ; avec *soi* : *Soi estudianta*, *Soi a la retirada*. Ça te va ?',
		'Métiers des personnages : Karim (20 ans en unité 3) infirmier, Lisa ingénieure, Núria (19 ans) étudiante, Yasmine paysanne, Loís cuisinier, Marià à la retraite. D’accord ?',
		'Son : *fornièr* « four-NYÈ », mais *fornièra* « four-NYÈ-ro » (le r revient au féminin). C’est bien ton usage ?',
		'*Qué fas ?* compris « que fais-tu en ce moment ? » (Karim répond *Mangi !*), d’où *Qué fas dins la vida ?* pour le métier : la nuance te paraît juste ?',
		'*Lo mètge del vilatge*, *Fau de mètge* : *far de mètge* te va, ou plutôt *Soi mètge* ?',
		'Chanson : *Lo Boièr* par Gacha Empega (2002), la version de la fiche culture. On la garde ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 4.1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Nous travaillons à Toulouse :',
							options: ['Trabalham a Tolosa.', 'Trabalhan a Tolosa.', 'Trabalhatz a Tolosa.'],
							correct: 0,
							oc: true,
							choses: ['trabalhar'],
							explain: 'Nous : *trabalham*, « tra-ba-LYAN ». *Trabalhan*, c’est « ils ».'
						},
						{
							q: '*Escotatz ?* On demande à…',
							options: ['plusieurs personnes : vous', 'une personne : tu', 'soi-même : je'],
							correct: 0,
							choses: ['escotar'],
							explain: '*-atz* : vous, à plusieurs ou en vouvoyant.'
						},
						{
							q: 'Je mange :',
							options: ['Mangi.', 'Manja.', 'Manjam.'],
							correct: 0,
							oc: true,
							choses: ['manjar'],
							explain: '*mangi* : un *g* devant *i*, pour garder le son « dj ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Elles chantent en occitan.',
							answers: ['Cantan en occitan.', 'Elas cantan en occitan.'],
							choses: ['cantar'],
							explain: '*-an* : ils ou elles, « CAN-ton ».'
						},
						{
							consigne: 'Demande à deux amis où ils habitent.',
							answers: ['Ont demoratz ?', 'E vosautres, ont demoratz ?', 'Vosautres, ont demoratz ?'],
							choses: ['demorar-plural'],
							explain: '*demoratz* : la voix appuie sur la fin, « dé-mou-RATS ».'
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
					title: 'À midi, là où Loís cuisine',
					intro:
						'À midi, au village. Loís est en cuisine. À table, Lisa, venue de Montpellier, discute avec Karim. Puis Marià arrive pour manger, et trouve Loís devant ses fourneaux. Lis une première fois pour répondre à une seule question : de quoi parlent-ils ?',
					scenes: [
						{
							title: 'Lisa e Karim',
							subtitle: '(à table ; ils se tutoient)',
							lines: [
								{ oc: 'Karim, qué fas ?', sound: 'ka-RIM, ké FAS ?', fr: 'Karim, que fais-tu ?' },
								{ oc: 'Mangi !', sound: 'MAN-dji !', fr: 'Je mange !' },
								{ oc: 'Non ! Qué fas dins la vida ?', sound: 'NOU ! ké FAS dins la BI-do ?', fr: 'Non ! Que fais-tu dans la vie ?' },
								{ oc: 'Fau d’infirmièr, a Tolosa. E tu ?', sound: 'FAOU din-fir-MYÈ, a tou-LOU-zo. é TU ?', fr: 'Je suis infirmier, à Toulouse. Et toi ?' },
								{ oc: 'Ieu, fau d’engenhaira, a Montpelhièr. E Núria, qué fa ?', sound: 'YÉOU, FAOU dén-djé-GNAÏ-ro, a moun-pé-LYÈ. é NOU-ria, ké FA ?', fr: 'Moi, je suis ingénieure, à Montpellier. Et Núria, que fait-elle ?' },
								{ oc: 'Núria es estudianta, a Tolosa. E Yasmine, aquí, fa de paisana.', sound: 'NOU-ria és es-tu-DYAN-to, a tou-LOU-zo. é yas-MI-ne, a-KI, FA dé paï-ZA-no.', fr: 'Núria est étudiante, à Toulouse. Et Yasmine, ici, est paysanne.' }
							]
						},
						{
							title: 'Marià e Loís',
							subtitle: '(Marià arrive ; Loís la vouvoie)',
							lines: [
								{ oc: 'Adieu, Loís ! Qué fas aquí ?', sound: 'a-DIOU, lou-ÍS ! ké FAS a-KI ?', fr: 'Salut, Loís ! Que fais-tu ici ?' },
								{ oc: 'Trabalhi ! Fau de cosinièr, aquí.', sound: 'tra-BA-lyi ! FAOU dé cou-zi-NYÈ, a-KI.', fr: 'Je travaille ! Je suis cuisinier, ici.' },
								{ oc: 'E Karim, qué fa dins la vida ?', sound: 'é ka-RIM, ké FA dins la BI-do ?', fr: 'Et Karim, que fait-il dans la vie ?' },
								{ oc: 'Fa d’infirmièr, a Tolosa. E vos, Marià, trabalhatz ?', sound: 'FA din-fir-MYÈ, a tou-LOU-zo. é BOUS, ma-ri-A, tra-ba-LYATS ?', fr: 'Il est infirmier, à Toulouse. Et vous, Marià, vous travaillez ?' },
								{ oc: 'Ieu ? Soi a la retirada. Canti… e mangi aquí !', sound: 'YÉOU ? souï a la ré-ti-RA-do. CAN-ti… é MAN-dji a-KI !', fr: 'Moi ? Je suis à la retraite. Je chante… et je mange ici !' }
							]
						}
					],
					glossary: [
						{ oc: 'Fau d’infirmièr.', sound: 'FAOU din-fir-MYÈ', fr: 'je suis infirmier (mot à mot : je fais d’infirmier)' },
						{ oc: 'la retirada', sound: 'la ré-ti-RA-do', fr: 'la retraite' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'De quoi parlent-ils ?',
							options: ['de leur métier', 'de leur famille', 'de leur ville'],
							correct: 0,
							choses: ['que-fas-dins-la-vida'],
							explain: 'La question qui revient : *Qué fas dins la vida ?*, que fais-tu dans la vie ?'
						},
						{
							q: 'Karim répond d’abord *Mangi !* Pourquoi ?',
							options: ['il a compris « que fais-tu en ce moment ? »', 'il ne veut pas répondre', 'il est cuisinier'],
							correct: 0,
							choses: ['que-fas-dins-la-vida'],
							explain: '*Qué fas ?* : que fais-tu, maintenant ou dans la vie. Avec *dins la vida*, c’est le métier.'
						},
						{
							q: 'Lisa est…',
							options: ['ingénieure', 'étudiante', 'infirmière'],
							correct: 0,
							choses: ['engenhaire-engenhaira'],
							explain: '*Ieu, fau d’engenhaira.* C’est Núria qui est étudiante, et Karim infirmier.'
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
					title: 'Far, et le métier',
					intro: '*Qué fas ?*, tu le connais. Voici le verbe entier au singulier, et la façon de dire son métier.',
					items: [
						{
							q: '*Fau d’infirmièr*, dit Karim. Qui est infirmier ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['far-singular', 'infirmier-infirmiera'],
							explain: '*fau* : je fais. *Far de* + le métier : c’est ainsi qu’on dit son métier.'
						},
						{
							q: '*E Núria, qué fa ?* demande Lisa. Elle veut savoir…',
							options: ['ce que fait Núria', 'ce que fait Karim', 'ce qu’elle fait, elle'],
							correct: 0,
							choses: ['far-singular'],
							explain: '*fa* : il ou elle fait. *fau, fas, fa* : je, tu, il ou elle.'
						},
						{
							q: '*Fau d’engenhaira*, dit Lisa. Pourquoi *d’*, et pas *de* ?',
							options: ['devant une voyelle, *de* devient *d’*', 'parce que Lisa est une femme'],
							correct: 0,
							noShuffle: true,
							choses: ['engenhaire-engenhaira'],
							explain: 'Comme dans *D’ont siás ?* : *de* devient *d’* devant une voyelle.'
						},
						{
							q: 'Une femme qui soigne à l’hôpital, comme Karim :',
							options: ['infirmièra', 'infirmièr', 'engenhaira'],
							correct: 0,
							oc: true,
							choses: ['infirmier-infirmiera'],
							explain: '*-ièr* devient *-ièra* : *infirmièr*, *infirmièra*.'
						},
						{
							q: 'Marià : *Soi a la retirada.* Elle…',
							options: ['ne travaille plus', 'travaille au village', 'fait des études'],
							correct: 0,
							choses: ['a-la-retirada'],
							explain: '*Soi a la retirada* : je suis à la retraite. Avec *soi*, comme *Soi estudianta*.'
						},
						{
							q: 'Pour demander le métier, sans risquer un *Mangi !* :',
							options: ['Qué fas dins la vida ?', 'Qué fas ?'],
							correct: 0,
							oc: true,
							noShuffle: true,
							choses: ['que-fas-dins-la-vida'],
							explain: '*Qué fas ?* peut vouloir dire « que fais-tu en ce moment ? ». Avec *dins la vida*, c’est le métier.'
						}
					]
				},
				{
					type: 'table',
					title: 'Les métiers au féminin',
					intro: 'Comme pour les nationalités (unité 2), le féminin se voit à la fin du mot.',
					head: ['', 'au masculin', 'au féminin', 'la règle'],
					rows: [
						['paysan', '*paisan*', '*paisana*', 'on ajoute -a'],
						['cuisinier', '*cosinièr*', '*cosinièra*', '-ièr devient -ièra'],
						['ingénieur', '*engenhaire*', '*engenhaira*', '-aire devient -aira'],
						['vendeur', '*vendeire*', '*vendeira*', '-eire devient -eira']
					],
					notes: [
						'*far* au singulier : *fau, fas, fa*. Pour dire son métier : *Fau de cosinièr*, et *d’* devant une voyelle : *Fau d’infirmièr*.',
						'Avec *soi*, ça marche aussi : *Soi estudianta*, *Soi a la retirada*.',
						'On dit aussi *mèstre*, *mèstra* pour *regent*, *regenta* (instituteur, institutrice).'
					],
					glosa: { mèstre: 'maître d’école', mèstra: 'maîtresse d’école' }
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'far-singular', oc: 'far : fau · fas · fa', sound: 'FA : FAOU · FAS · FA', fr: 'faire : je fais · tu fais · il ou elle fait' },
						{ id: 'que-fas-dins-la-vida', oc: 'Qué fas dins la vida ? · Fau de regent.', sound: 'ké FAS dins la BI-do · FAOU dé ré-DJÉN', fr: 'que fais-tu dans la vie ? · je suis instituteur (mot à mot : je fais d’instituteur ; on dit aussi *Soi regent*)' },
						{ id: 'a-la-retirada', oc: 'Soi a la retirada.', sound: 'souï a la ré-ti-RA-do', fr: 'je suis à la retraite.' },
						{ id: 'infirmier-infirmiera', oc: 'infirmièr · infirmièra', sound: 'in-fir-MYÈ · in-fir-MYÈ-ro', fr: 'infirmier · infirmière' },
						{ id: 'engenhaire-engenhaira', oc: 'engenhaire · engenhaira', sound: 'én-djé-GNAÏ-ré · én-djé-GNAÏ-ro', fr: 'ingénieur · ingénieure' }
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
					title: 'À retenir : cinq métiers',
					intro: 'Le masculin, puis le féminin quand il change.',
					items: [
						{ id: 'paisan-paisana', oc: 'paisan · paisana', sound: 'paï-ZA · paï-ZA-no', fr: 'paysan · paysanne' },
						{ id: 'estudiant-estudianta', oc: 'estudiant · estudianta', sound: 'es-tu-DYAN · es-tu-DYAN-to', fr: 'étudiant · étudiante' },
						{ id: 'cosinier-cosiniera', oc: 'cosinièr · cosinièra', sound: 'cou-zi-NYÈ · cou-zi-NYÈ-ro', fr: 'cuisinier · cuisinière' },
						{ id: 'regent-regenta', oc: 'regent · regenta', sound: 'ré-DJÉN · ré-DJÉN-to', fr: 'instituteur · institutrice' },
						{ id: 'metge', oc: 'mètge', sound: 'MÈ-djé', fr: 'médecin' }
					]
				},
				// jeu prévu par la carte : l'intrus en images (à coder).
				// Version simple : qcm, l'intrus en mots, en deux temps (cinq
				// métiers, puis quatre de plus).
				{
					type: 'qcm',
					title: 'L’intrus (1)',
					intro: 'Trois mots, un intrus : trouve celui qui ne va pas avec les deux autres.',
					items: [
						{
							q: 'Qui ne travaille pas à l’hôpital ?',
							options: ['regenta', 'infirmièra', 'mètge'],
							correct: 0,
							oc: true,
							choses: ['regent-regenta', 'infirmier-infirmiera', 'metge'],
							explain: '*La regenta* fait la classe ; *l’infirmièra* et *lo mètge* soignent.'
						},
						{
							q: 'Qui n’apprend pas et n’enseigne pas ?',
							options: ['cosinièr', 'regent', 'estudianta'],
							correct: 0,
							oc: true,
							choses: ['cosinier-cosiniera', 'regent-regenta', 'estudiant-estudianta'],
							explain: '*Lo regent* fait la classe, *l’estudianta* apprend ; *lo cosinièr* fait à manger.'
						},
						{
							q: 'Qui est un homme ?',
							options: ['paisan', 'regenta', 'engenhaira'],
							correct: 0,
							oc: true,
							choses: ['paisan-paisana', 'regent-regenta', 'engenhaire-engenhaira'],
							explain: '*paisan* : masculin. *Regenta*, *engenhaira* : la fin *-a* dit le féminin.'
						},
						{
							q: 'Qui ne travaille plus ?',
							options: ['Soi a la retirada.', 'Fau de mètge.', 'Fau d’infirmièra.'],
							correct: 0,
							oc: true,
							choses: ['a-la-retirada', 'metge', 'infirmier-infirmiera'],
							explain: '*Soi a la retirada* : je suis à la retraite.'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : quatre de plus',
					intro: 'Le masculin, puis le féminin quand il change.',
					items: [
						{ id: 'fornier-forniera', oc: 'fornièr · fornièra', sound: 'four-NYÈ · four-NYÈ-ro', fr: 'boulanger · boulangère' },
						{ id: 'vendeire-vendeira', oc: 'vendeire · vendeira', sound: 'bén-DÉÏ-ré · bén-DÉÏ-ro', fr: 'vendeur · vendeuse' },
						{ id: 'obrier-obriera', oc: 'obrièr · obrièra', sound: 'ou-BRYÈ · ou-BRYÈ-ro', fr: 'ouvrier · ouvrière' },
						{ id: 'vinhairon', oc: 'vinhairon', sound: 'bi-gnaï-ROU', fr: 'vigneron' }
					]
				},
				{
					type: 'qcm',
					title: 'L’intrus (2)',
					intro: 'Même jeu, avec tous les métiers.',
					items: [
						{
							q: 'Qui ne fait pas à manger ?',
							options: ['obrièra', 'cosinièra', 'fornièra'],
							correct: 0,
							oc: true,
							choses: ['obrier-obriera', 'cosinier-cosiniera', 'fornier-forniera'],
							explain: '*La cosinièra* cuisine, *la fornièra* fait le pain ; *l’obrièra* travaille à l’usine.'
						},
						{
							q: 'Qui ne travaille pas la terre ?',
							options: ['vendeire', 'paisan', 'vinhairon'],
							correct: 0,
							oc: true,
							choses: ['vendeire-vendeira', 'paisan-paisana', 'vinhairon'],
							explain: '*Lo paisan* et *lo vinhairon* travaillent la terre et la vigne ; *lo vendeire* vend.'
						},
						{
							q: 'Qui est une femme ?',
							options: ['vendeira', 'engenhaire', 'obrièr'],
							correct: 0,
							oc: true,
							choses: ['vendeire-vendeira'],
							explain: '*-eira* : le féminin de *-eire*. *Engenhaire* et *obrièr* sont au masculin.'
						},
						{
							q: 'Qui ne parle pas de lui-même ?',
							options: ['Fa de fornièr.', 'Fau de fornièr.', 'Soi fornièr.'],
							correct: 0,
							oc: true,
							choses: ['far-singular', 'fornier-forniera'],
							explain: '*Fa* : il ou elle fait. *Fau de…* et *Soi…* : je.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 12,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Que fais-tu dans la vie ? Réponds pour toi : *Fau de…*, *Soi…*, ou *Soi a la retirada.*',
							// « Fau » seul couvre aussi « Fau d’obrièra » : un début
							// accepté doit être suivi d'une espace (escriure.js).
							debut: ['Fau de', 'Fau', 'Soi', 'Ieu, fau', 'Ieu, soi'],
							choses: ['far-singular'],
							explain: 'Par exemple : *Fau d’obrièra.* · *Fau de vendeire.* · *Soi estudiant.*'
						},
						{
							consigne: 'Demande à une amie ce qu’elle fait dans la vie.',
							answers: ['Qué fas dins la vida ?', 'E tu, qué fas dins la vida ?'],
							choses: ['que-fas-dins-la-vida']
						},
						{
							consigne: 'Écris : Karim est infirmier.',
							answers: ['Karim fa d’infirmièr.', 'Karim es infirmièr.'],
							choses: ['far-singular', 'infirmier-infirmiera'],
							explain: '*Fa d’…* devant une voyelle ; *es* marche aussi.'
						},
						{
							consigne: 'Au féminin : *vendeire*.',
							answers: ['vendeira'],
							choses: ['vendeire-vendeira'],
							explain: '-eire devient -eira.'
						},
						{
							consigne: 'Au féminin : *obrièr*.',
							answers: ['obrièra'],
							choses: ['obrier-obriera'],
							explain: '-ièr devient -ièra ; et le *r* s’entend.'
						},
						{
							consigne: 'Le métier d’une personne de ta famille : *Mon paire fa de…*, *Ma sòrre es…*',
							debut: [
								'Mon paire fa', 'Ma maire fa', 'Mon fraire fa', 'Ma sòrre fa', 'Mon papeta fa', 'Ma mameta fa',
								'Mon oncle fa', 'Ma tanta fa', 'Mon cosin fa', 'Ma cosina fa',
								'Mon paire es', 'Ma maire es', 'Mon fraire es', 'Ma sòrre es', 'Mon papeta es', 'Ma mameta es',
								'Mon oncle es', 'Ma tanta es', 'Mon cosin es', 'Ma cosina es'
							],
							choses: ['far-singular'],
							explain: 'Par exemple : *Mon oncle fa de vinhairon.* · *Ma mameta es a la retirada.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Núria est étudiante ; moi, je suis à la retraite.',
							tiles: ['Núria', 'es', 'estudianta ;', 'ieu,', 'soi', 'a', 'la', 'retirada.'],
							choses: ['estudiant-estudianta', 'a-la-retirada'],
							explain: 'Avec *es* et *soi* : *Núria es estudianta*, *Soi a la retirada*.'
						},
						{
							prompt: 'Il est instituteur, et elle est paysanne.',
							tiles: ['Fa', 'de', 'regent,', 'e', 'ela', 'fa', 'de', 'paisana.'],
							choses: ['regent-regenta', 'paisan-paisana', 'far-singular'],
							explain: '*Fa de…* deux fois : *regent*, *paisana*.'
						},
						{
							prompt: 'Loís est cuisinier, et Lisa est ingénieure.',
							tiles: ['Loís', 'fa', 'de', 'cosinièr,', 'e', 'Lisa', 'fa', 'd’engenhaira.'],
							choses: ['cosinier-cosiniera', 'engenhaire-engenhaira', 'far-singular'],
							explain: '*de cosinièr*, mais *d’engenhaira* : devant une voyelle.'
						},
						{
							prompt: 'Mon grand-père est vigneron, et ma grand-mère est boulangère.',
							tiles: ['Mon', 'papeta', 'fa', 'de', 'vinhairon,', 'e', 'ma', 'mameta', 'fa', 'de', 'fornièra.'],
							choses: ['vinhairon', 'fornier-forniera'],
							explain: '*fornièra* : au féminin, le *r* s’entend, « four-NYÈ-ro ».'
						},
						{
							prompt: 'Le médecin du village chante à la chorale.',
							tiles: ['Lo', 'mètge', 'del', 'vilatge', 'canta', 'a', 'la', 'corala.'],
							choses: ['metge'],
							explain: '*Lo mètge del vilatge* : *del* = *de* + *lo*, comme en 1.3.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Présente deux personnes que tu connais : leur métier, où elles travaillent. Puis compare au modèle.',
					items: [
						{
							q: 'Un oncle, une cousine, des voisins…',
							a: 'Par exemple : *Mon oncle fa de fornièr : trabalha a Besièrs. Ma cosina es estudianta a Tolosa.*'
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
					title: 'Le son du jour : le r final ne se dit pas',
					paragraphs: [
						'À la fin du mot, le *r* se tait : *cosinièr* « cou-zi-NYÈ », *cantar* « can-TA », *Bon ser* « bou(n) SÉ ».',
						'Au féminin, une voyelle le suit, et il revient : *cosinièra* « cou-zi-NYÈ-ro », *fornièra* « four-NYÈ-ro ».',
						'Écoute, puis répète : *fornièr*, *fornièra*, *trabalhar*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Fornièr* se dit…',
							options: ['four-NYÈ', 'four-NYÈR'],
							correct: 0,
							noShuffle: true,
							explain: '« four-NYÈR », c’est la lecture à la française. En occitan, le *r* final se tait : « four-NYÈ ».'
						},
						{
							q: '*Fornièra* se dit…',
							options: ['four-NYÈ-ro', 'four-NYÈ'],
							correct: 0,
							noShuffle: true,
							explain: 'Devant le *a*, le *r* s’entend. Et le *a* final sonne « o ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Fau de cosinièr. Ela fa de cosinièra.*',
							a: '« FAOU dé cou-zi-NYÈ. É-lo FA dé cou-zi-NYÈ-ro » : le *r* se tait à la fin du masculin, et s’entend au féminin.'
						},
						{
							q: '*Mon fraire fa d’obrièr, e ma sòrre fa d’obrièra.*',
							a: '« moun FRAÏ-ré FA dou-BRYÈ, é ma SÒ-rré FA dou-BRYÈ-ro » : même jeu, *obrièr* puis *obrièra*.'
						},
						{
							q: '*Lo vinhairon, lo mètge e lo fornièr cantan a la corala, lo ser.*',
							a: '« lou bi-gnaï-ROU, lou MÈ-djé é lou four-NYÈ CAN-ton a la cou-RA-lo, lou SÉ » : deux *r* qui se taisent, *fornièr* et *ser*.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : des métiers dans les noms de famille',
					glosa: { molinièr: 'meunier', boièr: 'bouvier' },
					paragraphs: [
						'Molinier, Molinié, Moullié… Ces noms de famille du Languedoc et de Gascogne viennent du meunier, *lo molinièr* : la même fin que *fornièr* ou *cosinièr*. (Source : Mistral, Lou Trésor dóu Felibrige, tome II, article « moulinié ».)',
						'À écouter : *Lo Boièr* (le bouvier), un chant de métier traditionnel, d’origine incertaine, par Gacha Empega, un groupe de polyphonies de Marseille (album « Polyphonies marseillaises », 2002).'
					],
					// NoteBlock n'affiche pas encore de lien (à coder, comme `lien` dans
					// CartaBlock) : la chanson s'écoute seulement par ce lien.
					lien: { href: 'https://www.deezer.com/track/462956072', texte: 'Écouter Lo Boièr (Gacha Empega)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire mon métier, ou que je suis à la retraite',
						'demander à quelqu’un ce qu’il fait dans la vie',
						'mettre un métier au féminin',
						'dire le métier d’une personne de ma famille'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ton métier, et demander celui des autres.',
						'Si tu en as envie : à une personne précise, la boulangère, un voisin, une nouvelle collègue, dis *Fau de…* ou demande *Qué fas dins la vida ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
