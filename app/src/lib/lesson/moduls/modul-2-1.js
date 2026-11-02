// Module 2.1 · A1 · « Siás occitana ? » : unité 2 (Parlas occitan ?), rédigé
// par Claude le 2026-11-01 sur le modèle de l'unité 1. Chemin commun :
// 1 révision du jour · 2 Escota · 3 Obsèrva · 4 Lo jòc del jorn · 5 A tu ! ·
// 6 Lo son e lo bilanç. Forme du jour : le masculin et le féminin des
// nationalités. Encadrés « À retenir » repris tels quels de
// Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/lexic-A1.md (2.1).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul21 = {
	id: 'modul-2-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '2-1',
	unitat: 'Unitat 2 · Parlas occitan ?',
	nivel: 'A1 · Modul 2.1',
	oc: 'Siás occitana ?',
	fr: 'Es-tu occitane ? Dire sa nationalité et celle des autres',
	cando:
		'Je peux dire ma nationalité et celle d’une autre personne, au masculin ou au féminin, et répondre par oui ou par non.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité 2 (cursus/lexic-A1.md, unité 2).
	ouverture: {
		numero: 2,
		bloc: { oc: 'Ieu e los meus', fr: 'moi et les miens' },
		titre: 'Parlas occitan ?',
		fr: 'parles-tu occitan ?',
		question: 'Siás occitana ?',
		questionFr: 'es-tu occitane ?',
		phrase:
			'En quatre modules, tu sauras dire ta nationalité et tes langues, te débrouiller quand tu ne comprends pas, et présenter les langues de quelqu’un. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Giulia', 'Karim', 'Marià', 'Lisa'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'⚠️ *francés · francesa* : absents du Basic et de vèrb’Òc (déjà signalé par la carte et le lexique). Tu les valides tels quels ?',
		'Note ajoutée le 2026-11-02 au son du jour : la grammaire de référence dit *occitan* « ou-tsi-TAN » ; on garde ton « ou-tsi-TA ». La phrase te va ?',
		'Deux portraits contre les clichés : Giulia, d’une vallée occitane d’Italie, se dit *italiana e occitana* ; Karim se dit *francés, e occitan*. Ils te vont ?',
		'La règle donnée au féminin : *-és* perd son accent écrit (*francesa*), *ò* garde le sien (*espanhòla*). Tu la gardes telle quelle ?',
		'Son du jour : *espanhòla* « es-pa-GNÒ-lo » (*nh* = « gn ») et *Montpelhièr* « moun-pé-LYÈ » (*lh* = « ly »). Bon pour l’enregistrement ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient de l’unité 1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Tu demandes à Núria d’où elle est :',
							options: ['D’ont siás ?', 'Ont demòras ?', 'Cossí te dison ?'],
							correct: 0,
							oc: true,
							choses: ['d-ont-sias'],
							explain: '*D’ont siás ?* : d’où es-tu ? *Ont demòras ?* demande où elle habite.'
						},
						{
							q: 'Karim dit *Encantat !* à Lisa. Elle lui répond :',
							options: ['Encantada !', 'Encantat !', 'Adieu-siatz !'],
							correct: 0,
							oc: true,
							choses: ['encantat'],
							explain: 'Lisa est une femme : *Encantada !* Retiens ce *-a* : c’est la forme du jour.'
						},
						{
							q: 'Marià est née au village, et elle y vit toujours. Elle dit :',
							options: ['Soi d’aquí.', 'Demòri a Tolosa.', 'Soi de Besièrs.'],
							correct: 0,
							oc: true,
							choses: ['soi-d-aqui'],
							explain: '*Soi d’aquí* : je suis d’ici.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{ consigne: 'Je suis de Toulouse.', answers: ['Soi de Tolosa.'], choses: ['soi-de', 'noms-vilas'] },
						{
							consigne: 'Dis ton nom.',
							debut: ['Me dison', 'M’apèli', 'Ieu, me dison', 'Ieu, m’apèli'],
							choses: ['me-dison', 'm-apeli'],
							explain: 'Puis ton prénom.'
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
					title: 'Jour de foire au village',
					intro:
						'Jour de *fièra* (de foire) au village : des stands, de la musique, des gens venus de partout. Giulia, qui vient d’une vallée occitane d’Italie, aborde Núria. Plus loin, Marià montre les gens à Karim. Lis une première fois pour répondre à une seule question : de quoi parlent-ils ?',
					scenes: [
						{
							title: 'Núria e Giulia',
							subtitle: '(Giulia aborde Núria, qu’elle ne connaît pas)',
							lines: [
								{ oc: 'Adieu ! Siás francesa ?', sound: 'a-DIOU ! SYOS fran-SÉ-zo ?', fr: 'Salut ! Tu es française ?' },
								{ oc: 'Non, soi catalana. Soi de Barcelona. E tu ?', sound: 'NOU, souï ca-ta-LA-no. souï dé bar-sé-LOU-no. é TU ?', fr: 'Non, je suis catalane. Je suis de Barcelone. Et toi ?' },
								{ oc: 'Ieu, soi italiana. Me dison Giulia.', sound: 'YÉOU, souï i-ta-LYA-no. mé DI-zoun DJOU-lia.', fr: 'Moi, je suis italienne. Je m’appelle Giulia.' },
								{ oc: 'Italiana ? Mas parlas occitan !', sound: 'i-ta-LYA-no ? mas PAR-los ou-tsi-TA !', fr: 'Italienne ? Mais tu parles occitan !' },
								{ oc: 'Òc ! Soi italiana e occitana.', sound: 'OK ! souï i-ta-LYA-no é ou-tsi-TA-no.', fr: 'Oui ! Je suis italienne et occitane.' },
								{ oc: 'Encantada, Giulia !', sound: 'én-can-TA-do, DJOU-lia !', fr: 'Enchantée, Giulia !' }
							]
						},
						{
							title: 'Marià e Karim',
							subtitle: '(Marià montre les gens de la foire à Karim, qu’elle vouvoie)',
							lines: [
								{ oc: 'E ela, d’ont es ?', sound: 'é É-lo, doun ÉS ?', fr: 'Et elle, d’où est-elle ?' },
								{ oc: 'Ela ? Es catalana, de Barcelona.', sound: 'É-lo ? és ca-ta-LA-no, dé bar-sé-LOU-no.', fr: 'Elle ? Elle est catalane, de Barcelone.' },
								{ oc: 'E el, es espanhòl ?', sound: 'é ÉL, és es-pa-GNÒL ?', fr: 'Et lui, il est espagnol ?' },
								{ oc: 'Non, es portugués. E ela, es marroquina.', sound: 'NOU, és pour-tu-GUÉS. é É-lo, és ma-rou-KI-no.', fr: 'Non, il est portugais. Et elle, elle est marocaine.' },
								{ oc: 'E vos, Karim ?', sound: 'é BOUS, ka-RIM ?', fr: 'Et vous, Karim ?' },
								{ oc: 'Ieu ? Soi francés, e occitan !', sound: 'YÉOU ? souï fran-SÉS, é ou-tsi-TA !', fr: 'Moi ? Je suis français, et occitan !' },
								{ oc: 'Plan ! Ieu, soi occitana.', sound: 'PLA ! YÉOU, souï ou-tsi-TA-no.', fr: 'Bien ! Moi, je suis occitane.' }
							]
						}
					],
					glossary: [{ oc: 'la fièra', sound: 'la FYÈ-ro', fr: 'la foire : on y vend, on y achète, on s’y retrouve' }]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'De quoi parlent-ils ?',
							options: ['d’où viennent les gens de la foire', 'du marché du village', 'de leurs familles'],
							correct: 0,
							explain: 'De nationalités : *francesa*, *catalana*, *italiana*, *portugués*… Chacun dit d’où il vient.'
						},
						{
							q: 'Giulia est…',
							options: ['italienne, et occitane', 'française', 'catalane'],
							correct: 0,
							choses: ['italian-italiana', 'occitan-occitana'],
							explain: '*Soi italiana e occitana.* L’occitan se parle aussi dans des vallées des Alpes, en Italie.'
						},
						{
							q: 'Marià demande à Karim : *E el, es espanhòl ?* Karim répond :',
							options: ['Non, es portugués.', 'Òc, es espanhòl.', 'Non, es marroquina.'],
							correct: 0,
							oc: true,
							choses: ['oc-non', 'portugues-portuguesa'],
							explain: '*Non* : l’homme est portugais. *Marroquina* parle d’une femme.'
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
					title: 'Un homme ou une femme ?',
					intro: 'Regarde la fin des mots : elle dit si l’on parle d’un homme ou d’une femme.',
					items: [
						{
							q: 'Núria dit *Soi catalana.* Un homme de Barcelone dirait…',
							options: ['Soi catalan.', 'Soi catalana.', 'Es catalan.'],
							correct: 0,
							oc: true,
							choses: ['catalan-catalana'],
							explain: 'Au masculin, pas de *-a* : *catalan*. Et *soi* pour « je suis ».'
						},
						{
							q: '*Ela es marroquina.* On parle…',
							options: ['d’une femme', 'd’un homme'],
							correct: 0,
							noShuffle: true,
							choses: ['el-ela', 'marroquin-marroquina'],
							explain: '*Ela* (elle), et le *-a* de *marroquina* : une femme. Pour un homme : *El es marroquin.*'
						},
						{
							q: 'Une femme de Londres : *Es…*',
							options: ['anglesa', 'anglés', 'portuguesa'],
							correct: 0,
							oc: true,
							choses: ['angles-anglesa'],
							explain: '*anglés*, *anglesa* : au féminin, l’accent écrit tombe, mais la voix appuie toujours au même endroit : « an-GLÉ-zo ».'
						},
						{
							q: 'Et *espanhòl*, au féminin ?',
							options: ['espanhòla', 'espanhòl', 'italiana'],
							correct: 0,
							oc: true,
							choses: ['espanhol-espanhola'],
							explain: 'On ajoute *-a* : *espanhòla*. Ici l’accent reste : il dit que le *o* sonne « o », et pas « ou ».'
						},
						{
							q: 'Núria dit à Giulia : *Mas parlas occitan !* Elle veut dire…',
							options: ['tu parles occitan', 'tu es occitane', 'tu es de Barcelone'],
							correct: 0,
							choses: ['parlas-occitan'],
							explain: '*Parlas* : tu parles. C’est le titre de l’unité, *Parlas occitan ?* Le verbe s’explique au module suivant.'
						},
						{
							q: 'Un homme d’Alger : *Es…*',
							options: ['argerian', 'argeriana', 'marroquin'],
							correct: 0,
							oc: true,
							choses: ['argerian-argeriana'],
							explain: 'Un homme : *argerian*, sans *-a*. Une femme : *argeriana*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Un homme, une femme : on ajoute un a',
					head: ['', 'un homme', 'une femme'],
					rows: [
						['on ajoute *-a*', '*occitan*, *catalan*, *italian*, *marroquin*, *argerian*', '*occitana*, *catalana*, *italiana*, *marroquina*, *argeriana*'],
						['*-és* perd son accent écrit', '*francés*, *anglés*, *portugués*', '*francesa*, *anglesa*, *portuguesa*'],
						['*ò* garde le sien', '*espanhòl*', '*espanhòla*'],
						['pour montrer la personne', '*el* (lui, il)', '*ela* (elle)']
					],
					notes: [
						'Au féminin, le *n* revient à l’oreille : *occitan* « ou-tsi-TA », *occitana* « ou-tsi-TA-no ». Et le *s* entre deux voyelles sonne « z » : *francesa* « fran-SÉ-zo ».',
						'La grammaire de référence fait sonner le *n* d’*occitan*, « ou-tsi-TAN », parce que c’est un mot savant. Tu entendras les deux ; ici, on dit « ou-tsi-TA ».',
						'Pas besoin de *el* ou de *ela* : *Es catalana* suffit. On les ajoute pour montrer quelqu’un, ou pour insister : *E ela ?*',
						'Pour répondre : *Òc* (oui) ou *Non*. *Siás francesa ? Non, soi catalana.*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/3)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'occitan-occitana', oc: 'occitan · occitana', sound: 'ou-tsi-TA · ou-tsi-TA-no', fr: 'occitan · occitane' },
						{ id: 'frances-francesa', oc: 'francés · francesa', sound: 'fran-SÉS · fran-SÉ-zo', fr: 'français · française' },
						{ id: 'catalan-catalana', oc: 'catalan · catalana', sound: 'ca-ta-LA · ca-ta-LA-no', fr: 'catalan · catalane' },
						{ id: 'espanhol-espanhola', oc: 'espanhòl · espanhòla', sound: 'es-pa-GNÒL · es-pa-GNÒ-lo', fr: 'espagnol · espagnole' },
						{ id: 'italian-italiana', oc: 'italian · italiana', sound: 'i-ta-LYA · i-ta-LYA-no', fr: 'italien · italienne' }
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (2/3)',
					items: [
						{ id: 'parlas-occitan', oc: 'Parlas occitan ?', sound: 'PAR-los ou-tsi-TA', fr: 'parles-tu occitan ? (titre de l’unité : le verbe s’explique au module suivant)' },
						{ id: 'el-ela', oc: 'el · ela', sound: 'ÉL · É-lo', fr: 'lui, il · elle (*Ela es catalana.*)' },
						{ id: 'oc-non', oc: 'Òc ! · Non !', sound: 'OK · NOU', fr: 'oui ! · non !' }
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
					title: 'À retenir (3/3)',
					intro: 'Encore quatre nationalités, puis le jeu.',
					items: [
						{ id: 'angles-anglesa', oc: 'anglés · anglesa', sound: 'an-GLÉS · an-GLÉ-zo', fr: 'anglais · anglaise' },
						{ id: 'portugues-portuguesa', oc: 'portugués · portuguesa', sound: 'pour-tu-GUÉS · pour-tu-GUÉ-zo', fr: 'portugais · portugaise' },
						{ id: 'marroquin-marroquina', oc: 'marroquin · marroquina', sound: 'ma-rou-KI · ma-rou-KI-no', fr: 'marocain · marocaine' },
						{ id: 'argerian-argeriana', oc: 'argerian · argeriana', sound: 'ar-djé-RYA · ar-djé-RYA-no', fr: 'algérien · algérienne' }
					]
				},
				// jeu prévu par la carte : l'intrus (version simple : qcm, à coder en jeu
				// à part si besoin).
				{
					type: 'qcm',
					title: 'L’intrus',
					intro:
						'Dans chaque groupe, un mot ou une phrase ne va pas avec les autres. Trouve-le : parfois c’est le masculin, parfois le sens.',
					items: [
						{
							q: 'Trouve l’intrus.',
							options: ['francés', 'catalana', 'italiana'],
							correct: 0,
							oc: true,
							choses: ['frances-francesa', 'catalan-catalana', 'italian-italiana'],
							explain: '*francés* parle d’un homme. *catalana* et *italiana* parlent d’une femme.'
						},
						{
							q: 'Trouve l’intrus.',
							options: ['Besièrs', 'anglés', 'portugués'],
							correct: 0,
							oc: true,
							choses: ['angles-anglesa', 'portugues-portuguesa', 'noms-vilas'],
							explain: 'Tous finissent par *s*, mais *Besièrs* est une ville (Béziers). *anglés* et *portugués* sont des nationalités.'
						},
						{
							q: 'Trouve l’intrus.',
							options: ['occitana', 'Tolosa', 'Carcassona'],
							correct: 0,
							oc: true,
							choses: ['occitan-occitana', 'noms-vilas'],
							explain: 'Tous finissent par *a*, mais *Tolosa* et *Carcassona* sont des villes. *occitana* : une femme occitane.'
						},
						{
							q: 'Trouve l’intrus.',
							options: ['Soi italian.', 'Soi marroquina.', 'Soi argeriana.'],
							correct: 0,
							oc: true,
							choses: ['italian-italiana', 'marroquin-marroquina', 'argerian-argeriana'],
							explain: 'C’est un homme qui dit *Soi italian*. Les deux autres phrases, ce sont des femmes qui les disent.'
						},
						{
							q: 'Trouve l’intrus.',
							options: ['El es anglés.', 'Es anglesa.', 'Ela es espanhòla.'],
							correct: 0,
							oc: true,
							choses: ['el-ela', 'angles-anglesa', 'espanhol-espanhola'],
							explain: '*El es anglés* : un homme. Les deux autres parlent d’une femme.'
						},
						{
							q: 'Trouve l’intrus.',
							options: ['Parlas occitan ?', 'Siás occitana ?', 'Siás occitan ?'],
							correct: 0,
							oc: true,
							choses: ['parlas-occitan', 'occitan-occitana'],
							explain: '*Parlas occitan ?* demande si l’on parle la langue. Les deux autres demandent la nationalité.'
						},
						{
							q: 'On demande *Siás occitana ?* Une seule réponse ne tient pas debout. Laquelle ?',
							options: ['Non, soi occitana.', 'Òc, soi occitana.', 'Non, soi catalana.'],
							correct: 0,
							oc: true,
							choses: ['oc-non', 'occitan-occitana'],
							explain: '*Non, soi occitana* : « non, je suis occitane ! ». Les deux autres se tiennent.'
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
						'Écris en occitan, pour toi et pour les autres. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'On te demande *Siás occitana ?* (ou *Siás occitan ?*). Réponds pour toi : *Òc* ou *Non*, puis *soi…* et ta nationalité.',
							debut: ['Òc, soi', 'Non, soi'],
							choses: ['oc-non'],
							explain: 'Par exemple : *Òc, soi occitan.* · *Non, soi francesa.*'
						},
						{
							consigne: 'Dis d’où tu es, puis ta nationalité : *Soi de…, soi…*',
							debut: ['Soi de', 'Soi d’'],
							choses: ['soi-de'],
							explain: 'Par exemple : *Soi de Tolosa, soi francesa.*'
						},
						{
							consigne: 'Pense à une amie venue d’ailleurs. Dis sa nationalité : *Ela es…*',
							debut: ['Ela es'],
							choses: ['el-ela'],
							explain: 'Avec le *-a* du féminin : *Ela es anglesa.* · *Ela es argeriana.*'
						},
						{ consigne: 'Demande à Giulia si elle parle occitan.', answers: ['Parlas occitan ?'], choses: ['parlas-occitan'] },
						{ consigne: 'Elle est espagnole.', answers: ['Es espanhòla.', 'Ela es espanhòla.'], choses: ['espanhol-espanhola', 'el-ela'] },
						{ consigne: 'Il est portugais.', answers: ['Es portugués.', 'El es portugués.'], choses: ['portugues-portuguesa'] },
						{
							consigne: 'On te demande *Siás espanhòla ?* (ou *Siás espanhòl ?*). Ce n’est pas le cas : réponds *Non*, puis dis ta nationalité.',
							debut: ['Non, soi'],
							choses: ['oc-non'],
							explain: 'Par exemple : *Non, soi francés.* · *Non, soi italiana.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Núria est catalane, Giulia est italienne.',
							tiles: ['Núria', 'es', 'catalana,', 'Giulia', 'es', 'italiana.'],
							choses: ['catalan-catalana', 'italian-italiana'],
							explain: 'Deux femmes : *catalana*, *italiana*.'
						},
						{
							prompt: 'Lui, il est algérien ; elle, elle est marocaine.',
							tiles: ['El', 'es', 'argerian,', 'ela', 'es', 'marroquina.'],
							choses: ['el-ela', 'argerian-argeriana', 'marroquin-marroquina'],
							explain: '*El* et le masculin *argerian* ; *ela* et le féminin *marroquina*.'
						},
						{
							prompt: 'Je suis anglaise, mais j’habite à Montpellier.',
							tiles: ['Soi', 'anglesa,', 'mas', 'demòri', 'a', 'Montpelhièr.'],
							choses: ['angles-anglesa', 'demori-a'],
							explain: '*Soi* pour la nationalité, *Demòri a…* pour le lieu de vie (module 1.3).'
						},
						{
							prompt: 'Je suis de Toulouse, je suis française et occitane.',
							tiles: ['Soi', 'de', 'Tolosa,', 'soi', 'francesa', 'e', 'occitana.'],
							choses: ['soi-de', 'frances-francesa', 'occitan-occitana'],
							explain: 'On peut être les deux : *francesa e occitana*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un que tu connais',
					intro: 'Dis à voix haute le nom d’une personne que tu connais, d’où elle est, et sa nationalité. Puis compare au modèle.',
					items: [
						{
							q: 'Une amie, un voisin, quelqu’un de ta famille.',
							a: 'Par exemple : *Es Lisa. Es de Nimes : es francesa, e occitana. Mas demòra a Montpelhièr.*'
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
					title: 'Le son du jour : nh',
					// Les deux lettres, expliquées dans la note même (le contrôle les lit comme des mots).
					glosa: { nh: 'se dit « gn »', lh: 'se dit « ly »' },
					paragraphs: [
						'*nh* se dit « gn », comme dans « montagne » : *espanhòl* « es-pa-GNÒL », *espanhòla* « es-pa-GNÒ-lo ».',
						'Son voisin *lh* se dit « ly » : *Montpelhièr* « moun-pé-LYÈ ».',
						'Répète à voix haute : *espanhòl*, *Montpelhièr*, *espanhòla*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Espanhòla* se dit…',
							options: ['es-pa-GNÒ-lo', 'es-pan-O-la'],
							correct: 0,
							noShuffle: true,
							explain: '*nh* sonne « gn », et le *a* final sonne « o ».'
						},
						{
							q: '*Montpelhièr* se dit…',
							options: ['moun-pé-LYÈ', 'mon-pel-HIÈR'],
							correct: 0,
							noShuffle: true,
							explain: '*lh* sonne « ly », le *o* sonne « ou », et le *r* final se tait.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					glosa: { espanha: 'Espagne', alemanha: 'Allemagne' },
					items: [
						{
							q: 'Dis trois fois, de plus en plus vite : *espanhòl*, *espanhòla*, *Montpelhièr*. Puis regarde.',
							a: '« es-pa-GNÒL », « es-pa-GNÒ-lo », « moun-pé-LYÈ ». Le même *nh* dans *Espanha* (l’Espagne) « es-PA-gno » et *Alemanha* (l’Allemagne) « a-lé-MA-gno ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : la coupe des Catalans',
					glosa: { 'la coupo santo': 'la coupe sainte (provençal, graphie de Mistral)' },
					paragraphs: [
						'Le 30 juillet 1867, à Avignon, des Catalans offrent une coupe d’argent aux félibres, les poètes provençaux de Mistral, pour les remercier d’avoir accueilli le poète catalan Víctor Balaguer, exilé.',
						'Mistral écrit pour l’occasion *La Coupo Santo* (la coupe sainte), que les félibres chantent encore à la fin de leurs banquets. Le catalan et l’occitan sont des langues très proches. Source : Wikipédia, article « La Coupo Santo ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire ma nationalité, au masculin ou au féminin',
						'dire d’où est quelqu’un, et sa nationalité',
						'répondre par *òc* ou par *non*',
						'montrer quelqu’un avec *el* ou *ela*',
						'lire le *nh* de *espanhòl* : « gn »'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ta nationalité, et celle des autres.',
						'Si tu en as envie : dis *Soi occitan* ou *Soi occitana* (ou ta nationalité) à une personne de ton entourage, puis demande-lui *E tu ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
