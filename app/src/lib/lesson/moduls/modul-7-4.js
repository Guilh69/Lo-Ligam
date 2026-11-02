// Module 7.4 · A1 · « E ton ostal ? » : la tâche de l'unité 7 (L’ostal),
// rédigée par Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en
// six étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Rien de nouveau : on assemble 7.1 à 7.3 pour décrire un logement en huit
// phrases. Logements divers, sans cliché : une colocation (Karim), une chambre
// (Núria), un appartement (Lisa), un mas (Yasmine), la maison de famille
// (Marià). Décrire son propre logement reste facultatif : un logement
// imaginé est permis, et personne ne vérifie.
// Jeu du jour : dialogue à choix (causida) avec Núria, qui cherche une
// chambre ; un tour « rester en occitan » (règle 13).
// Fin du module : le mémo de l'unité, puis l'encart Alhors en Occitània
// (repris tel quel de cursus/alhors-en-occitania-A1.md).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique ; apartament, mas, sol,
// sola, benvengut le 2026-11-02 ; cambras : pluriel de cambra), à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul74 = {
	id: 'modul-7-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '7-4',
	unitat: 'Unitat 7 · L’ostal',
	nivel: 'A1 · Modul 7.4 · la tâche',
	oc: 'E ton ostal ?',
	fr: 'Et ta maison ? Décrire un logement en huit phrases',
	cando:
		'Je peux décrire un logement, le mien ou un logement imaginé, en huit phrases : où il est, avec qui j’y vis, ce qu’il y a et ce qu’il n’y a pas, où sont les pièces, leurs couleurs et leur taille.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Marià', 'Karim', 'Núria', 'Lisa', 'Yasmine', 'Inès', 'Mimí', 'Loís'],
	notesRelecture: [
		'Titre du module : *E ton ostal ?* (et ta maison ?), comme le propose le lexique. Ça te va ?',
		'Les logements : Karim en colocation (*amb dos amics*), Núria dans une chambre, Lisa dans un *apartament* (glosé), Yasmine dans un *mas* avec son *companh*, Marià dans la maison de sa famille. Ça te va ?',
		'Tour « rester en occitan » : Núria passe au français ; la bonne réplique est *Pòdes repetir, se te plai ?*, comme en 4.4. D’accord ?',
		'La tâche : décrire en huit phrases son logement ou un logement imaginé (au choix, sans avoir à le dire), puis le décrire à une personne choisie, le prof en visio par exemple. Pour vivre seul : *Demòri sol*, *Demòri sola* (glosés). Ça te va ?',
		'⚠️ Chanson *A mon ostal* (Castanha é Vinovèl, lien Deezer) : est-ce la même chanson que celle recueillie dans l’Aude (Lo Bramàs) ? À écouter avant publication.'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'La chatte est sur le canapé :',
							options: ['La cata es sul canapè.', 'La cata es jos lo canapè.', 'La cata es davant lo canapè.'],
							correct: 0,
							oc: true,
							choses: ['sus-sul', 'lo-canape'],
							explain: '*sul* = *sus* + *lo* : sur le. *jos* : sous ; *davant* : devant.'
						},
						{
							q: 'Une porte verte :',
							options: ['una pòrta verda', 'una pòrta verd', 'una pòrta blava'],
							correct: 0,
							oc: true,
							choses: ['verd-verda', 'la-porta'],
							explain: '*la pòrta* : féminin, donc *verda*, « BÉR-do ».'
						},
						{
							q: '*I a pas de fenèstra dins la sala de banh.* Dans la salle de bain…',
							options: ['il n’y a pas de fenêtre', 'il y a une fenêtre', 'il n’y a pas de porte'],
							correct: 0,
							choses: ['la-fenestra', 'la-sala-de-banh', 'i-a'],
							explain: '*I a pas de…* : il n’y a pas de…'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'La table est petite, mais elle est neuve.',
							answers: ['La taula es pichona, mas es nòva.'],
							choses: ['pichon-pichona', 'nou-nova'],
							explain: '*la taula* : féminin, donc *pichona*, *nòva*.'
						},
						{
							consigne: 'L’armoire est à côté de la porte.',
							answers: ['L’armari es al costat de la pòrta.'],
							choses: ['al-costat-de', 'l-armari'],
							explain: 'Devant *la*, rien ne se soude : *al costat de la pòrta*.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 2. Escota
		{
			title: 'Escota',
			fr: 'écoute',
			minutes: 8,
			blocks: [
				{
					type: 'dialogue',
					title: 'Chacun sa maison',
					intro:
						'Samedi soir, Marià invite ses amis à souper : Karim et Inès, venus chercher Mimí, Núria, Lisa, de passage, et Yasmine. Dans la cuisine, Marià demande à chacun comment il habite. Lis une première fois pour répondre à une seule question : qui a un grand jardin ?',
					scenes: [
						{
							title: 'Dins la cosina de Marià',
							subtitle: '(Marià pose la question à chacun)',
							lines: [
								{ oc: 'Karim, e ton ostal, a Tolosa ?', sound: 'ka-RIM, é toun ous-TAL, a tou-LOU-zo ?', fr: 'Karim, et ta maison, à Toulouse ?' },
								{ oc: 'Demòri amb dos amics. I a tres cambras, una cosina e una sala… mas i a pas de jardin !', sound: 'dé-MÒ-ri am dou-za-MITS. ya TRÉS CAM-bros, U-no cou-ZI-no é U-no SA-lo… mas ya PAS dé djar-DI !', fr: 'J’habite avec deux amis. Il y a trois chambres, une cuisine et un séjour… mais il n’y a pas de jardin !' },
								{ oc: 'E tu, Núria ?', sound: 'é TU, NOU-ria ?', fr: 'Et toi, Núria ?' },
								{ oc: 'Ieu, demòri dins una cambra, a Tolosa. Es pichona, mas la fenèstra es granda.', sound: 'YÉOU, dé-MÒ-ri dins U-no CAM-bro, a tou-LOU-zo. és pi-TCHOU-no, mas la fé-NÈS-tro és GRAN-do.', fr: 'Moi, j’habite dans une chambre, à Toulouse. Elle est petite, mais la fenêtre est grande.' },
								{ oc: 'E tu, Lisa ?', sound: 'é TU, LI-zo ?', fr: 'Et toi, Lisa ?' },
								{ oc: 'Ieu, demòri a Montpelhièr, dins un apartament. La cosina es blava, e i a un canapè roge !', sound: 'YÉOU, dé-MÒ-ri a moun-pé-LYÈ, dins un a-par-ta-MÉN. la cou-ZI-no és BLA-bo, é ya un ca-na-PÈ ROU-djé !', fr: 'Moi, j’habite à Montpellier, dans un appartement. La cuisine est bleue, et il y a un canapé rouge !' },
								{ oc: 'E tu, Yasmine ?', sound: 'é TU, yas-MI-ne ?', fr: 'Et toi, Yasmine ?' },
								{ oc: 'Ieu, demòri dins un mas, amb mon companh. Lo jardin es grand : i a una galina… e un caval ! E vos, Marià ?', sound: 'YÉOU, dé-MÒ-ri dins un MAS, am moun coum-PAN. lou djar-DI és GRAN : ya U-no ga-LI-no… é un ca-BAL ! é BOUS, ma-ri-A ?', fr: 'Moi, j’habite dans un mas, avec mon compagnon. Le jardin est grand : il y a une poule… et un cheval ! Et vous, Marià ?' },
								{ oc: 'Ieu ? Demòri aquí, dins l’ostal de ma familha.', sound: 'YÉOU ? dé-MÒ-ri a-KI, dins lous-TAL dé ma fa-MI-lyo.', fr: 'Moi ? J’habite ici, dans la maison de ma famille.' },
								{ oc: 'E Mimí, ont demòra ?', sound: 'é mi-MI, oun dé-MÒ-ro ?', fr: 'Et Mimí, où habite-t-elle ?' },
								{ oc: 'Amb tu, Inès ! Mas uèi… es jos la taula, amb lo cat negre.', sound: 'am TU, i-NÈS ! mas UÈÏ… és DJOUS la TAOU-lo, am lou CAT NÉ-gré.', fr: 'Avec toi, Inès ! Mais aujourd’hui… elle est sous la table, avec le chat noir.' }
							]
						}
					],
					glossary: [
						{ oc: 'un apartament', sound: 'un a-par-ta-MÉN', fr: 'un appartement' },
						{ oc: 'lo mas', sound: 'lou MAS', fr: 'la ferme du Midi, la maison et ses terres (vu en 7.2 ; *mas*, c’est aussi « mais »)' },
						{ oc: 'las cambras', sound: 'las CAM-bros', fr: 'les chambres (pour plusieurs : -a devient -as, comme *las cadièras*)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qui a un grand jardin ?',
							options: ['Yasmine', 'Karim', 'Lisa'],
							correct: 0,
							choses: ['lo-jardin', 'grand-granda'],
							explain: '*Lo jardin es grand*, dit Yasmine : avec une poule et un cheval ! Karim, lui, n’a *pas de jardin*.'
						},
						{
							q: 'Chez Lisa, la cuisine est…',
							options: ['bleue', 'rouge', 'petite'],
							correct: 0,
							choses: ['blau-blava', 'la-cosina'],
							explain: '*La cosina es blava.* Le rouge, c’est le canapé : *un canapè roge*.'
						},
						{
							q: 'Núria habite…',
							options: ['une petite chambre, avec une grande fenêtre', 'un appartement avec un canapé rouge', 'une maison avec deux amis'],
							correct: 0,
							choses: ['la-cambra', 'pichon-pichona'],
							explain: '*Es pichona, mas la fenèstra es granda.* Le canapé rouge, c’est chez Lisa ; les deux amis, chez Karim.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Obsèrva
		{
			title: 'Obsèrva',
			fr: 'observe',
			minutes: 8,
			blocks: [
				{
					type: 'table',
					title: 'Décrire un logement : cinq briques',
					intro: 'Chez Marià, chacun a décrit son logement avec les mêmes briques. Tu les as toutes.',
					head: ['pour dire…', 'dans la scène'],
					rows: [
						['où tu habites', '*Demòri a Montpelhièr, dins un apartament.*'],
						['avec qui', '*Demòri amb dos amics.* · *amb mon companh*'],
						['ce qu’il y a, et ce qu’il n’y a pas', '*I a tres cambras.* · *I a pas de jardin.*'],
						['comment c’est', '*La cosina es blava.* · *Lo jardin es grand.*'],
						['deux idées à la fois', '*Es pichona, mas la fenèstra es granda.*']
					],
					notes: [
						'Pour plusieurs pièces, le nom prend un *-s* : *una cambra*, *tres cambras*. Les couleurs et les tailles, elles, pour une seule chose à la fois.',
						'Où sont les pièces : les petits mots de 7.2, *al costat de la sala de banh*, *darrièr l’ostal*.',
						'Ton logement, ou un logement imaginé : les briques sont les mêmes.'
					]
				},
				{
					type: 'qcm',
					title: 'Les bonnes briques',
					intro: 'Une question à la fois.',
					items: [
						{
							q: '*I a tres cambras, una cosina e una sala*, dit Karim. Chez lui, il y a…',
							options: ['trois chambres, une cuisine et un séjour', 'trois chambres, une cuisine et une salle de bain', 'trois chaises, une cuisine et un séjour'],
							correct: 0,
							choses: ['la-cambra', 'la-cosina', 'la-sala'],
							explain: '*las cambras* : les chambres ; *la sala*, seule : le séjour.'
						},
						{
							q: 'Lisa a *un canapè roge*. Et une table rouge ?',
							options: ['una taula roja', 'una taula roge', 'una taula jauna'],
							correct: 0,
							oc: true,
							choses: ['roge-roja', 'la-taula'],
							explain: '*la taula* est féminine : *roja*.'
						},
						{
							q: 'Pour dire que son jardin est derrière le mas, Yasmine dirait…',
							options: ['Lo jardin es darrièr lo mas.', 'Lo jardin es davant lo mas.', 'Lo jardin es dins lo mas.'],
							correct: 0,
							oc: true,
							choses: ['darrier', 'lo-jardin'],
							explain: '*darrièr* : derrière ; *davant* : devant ; *dins* : dans.'
						},
						{
							q: 'Karim dit qu’il n’a pas de jardin :',
							options: ['I a pas de jardin.', 'Es pas un jardin.', 'I a un jardin.'],
							correct: 0,
							oc: true,
							choses: ['i-a', 'lo-jardin'],
							explain: '*I a pas de…* : il n’y a pas de… *Es pas un jardin*, ce serait « ce n’est pas un jardin ».'
						}
					]
				},
				{
					type: 'order',
					title: 'Karim, dans l’ordre',
					intro: 'Touche les morceaux dans l’ordre.',
					items: [
						{
							prompt: 'J’habite à Toulouse, avec deux amis. Il y a trois chambres, une cuisine et un séjour, mais il n’y a pas de jardin.',
							tiles: ['Demòri a Tolosa,', 'amb dos amics.', 'I a tres cambras,', 'una cosina e una sala,', 'mas i a pas de jardin.'],
							choses: ['la-cambra', 'i-a', 'lo-jardin'],
							explain: 'Où, avec qui, ce qu’il y a, ce qu’il n’y a pas : tout le logement de Karim.'
						},
						{
							prompt: 'La chambre est petite, mais la fenêtre est grande.',
							tiles: ['La', 'cambra', 'es', 'pichona,', 'mas', 'la', 'fenèstra', 'es', 'granda.'],
							choses: ['pichon-pichona', 'grand-granda', 'la-fenestra'],
							explain: '*mas* : mais. *La cambra*, *la fenèstra* : deux féminins, *pichona*, *granda*.'
						}
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
					type: 'causida',
					title: 'Une chambre pour Núria',
					intro:
						'Núria cherche une chambre plus grande, en colocation. Toi, tu en as une à louer, dans un logement imaginé : un appartement à Toulouse, avec deux chambres, une cuisine jaune, un séjour et une salle de bain. La chambre libre est grande, à côté de la salle de bain. Pas de jardin, pas de chien, mais une chatte noire. Réponds à Núria : choisis chaque réplique. Si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Núria',
					tours: [
						{
							situacion: 'Núria t’appelle : on lui a parlé de ta chambre. Elle commence par où tu habites.',
							ditz: 'Adieu ! Ont demòras ?',
							options: [
								{ oc: 'Demòri a Tolosa, dins un apartament.', bon: true },
								{ oc: 'Demòri a Tolosa, dins un mas.', reaccion: 'Núria s’étonne : une ferme, en pleine ville ? Ton logement est un appartement.' },
								{ oc: 'Soi de Tolosa.', reaccion: 'Núria sourit : tu es de Toulouse, d’accord… mais où habites-tu ? Pour ça, on dit *Demòri…*' }
							],
							choses: ['demori-a', 'ont-demoras'],
							explain: '*Demòri a…* : j’habite à… ; *Soi de…* : je suis de… (unité 1).'
						},
						{
							ditz: 'E qué i a, dins l’apartament ?',
							options: [
								{ oc: 'I a doas cambras, una cosina, una sala e una sala de banh.', bon: true },
								{ oc: 'I a doas cambras, una cosina e un jardin.', reaccion: 'Núria se réjouit : un jardin ! Mais ton logement n’en a pas : elle serait déçue en arrivant.' },
								{ oc: 'I a doas cadièras, una cosina, una sala e una sala de banh.', reaccion: 'Núria rit : deux chaises ? Et pour dormir ? Il te faut deux *cambras*.' }
							],
							choses: ['la-cambra', 'la-cosina', 'la-sala', 'la-sala-de-banh'],
							explain: '*las cambras* : les chambres ; *las cadièras* : les chaises.'
						},
						{
							ditz: 'E la cambra, es granda ?',
							options: [
								{ oc: 'Òc, es granda.', bon: true },
								{ oc: 'Òc, es grand.', reaccion: 'Núria comprend… mais *la cambra* est féminine : *granda*.' },
								{ oc: 'Non, es pichona.', reaccion: 'Núria fait la moue : encore une petite chambre ? Pourtant, la tienne est grande !' }
							],
							choses: ['grand-granda', 'la-cambra'],
							explain: '*la cambra*, féminin : *granda*, « GRAN-do ».'
						},
						{
							ditz: 'Ont es, la cambra ?',
							options: [
								{ oc: 'Es al costat de la sala de banh.', bon: true },
								{ oc: 'Es dins la sala de banh.', reaccion: 'Núria éclate de rire : une chambre dans la salle de bain ? Elle est à côté.' },
								{ oc: 'Es jos la sala de banh.', reaccion: 'Núria hésite : sous la salle de bain, à la cave ? Non : à côté.' }
							],
							choses: ['al-costat-de', 'la-sala-de-banh'],
							explain: '*al costat de* : à côté de ; *dins* : dans ; *jos* : sous.'
						},
						{
							ditz: 'E la cosina, de quina color es ?',
							options: [
								{ oc: 'Es jauna.', bon: true },
								{ oc: 'Es jaune.', reaccion: 'Núria comprend, mais *la cosina* est féminine : *jauna*.' },
								{ oc: 'Es blava.', reaccion: 'Núria imagine déjà une cuisine bleue… Mais la tienne est jaune.' }
							],
							choses: ['jaune-jauna', 'la-color'],
							explain: '*la cosina* : féminin, *jauna*, « DJAOU-no ».'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Núria parle vite. Tu hésites ; alors elle passe au français, plus vite encore : « Et il y a des animaux ? Parce que moi, les chiens, enfin, ça dépend, c’est compliqué ! »',
							options: [
								{ oc: 'Pòdes repetir, se te plai ?', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Núria continue en français, ravie… et la visite aussi passe au français. Demande-lui plutôt de répéter : elle le fera en occitan.' },
								{ oc: 'Sabi pas.', reaccion: 'Núria, gentille, réexplique tout en français. Demande-lui plutôt de répéter : elle le fera en occitan, plus lentement.' }
							],
							choses: ['podes-repetir'],
							explain: 'Pour rester en occitan : *Pòdes repetir, se te plai ?*'
						},
						{
							ditz: 'As un can ? Un cat ?',
							options: [
								{ oc: 'Ai pas de can. Mas ai una cata negra.', bon: true },
								{ oc: 'Ai pas de can. Mas ai una cata negre.', reaccion: 'Núria comprend… mais *la cata* est féminine : *negra*.' },
								{ oc: 'Ai un can negre.', reaccion: 'Núria recule d’un pas : un chien ? Chez toi, il n’y en a pas : seulement une chatte noire.' }
							],
							choses: ['ai-pas-de', 'negre-negra'],
							explain: '*Ai pas de can* (unité 3) ; *una cata negra* : la couleur au féminin.'
						},
						{
							ditz: 'E i a un jardin ?',
							options: [
								{ oc: 'Non, i a pas de jardin.', bon: true },
								{ oc: 'Òc, i a un jardin.', reaccion: 'Núria se voit déjà au soleil… Mais chez toi, pas de jardin.' },
								{ oc: 'Non, i a un jardin.', reaccion: 'Núria fronce les sourcils : non, ou oui ? Si c’est non : *I a pas de jardin.*' }
							],
							choses: ['i-a', 'lo-jardin'],
							explain: '*I a pas de jardin* : après *pas*, on dit *de*.'
						},
						{
							ditz: 'Mercés ! A deman ?',
							options: [
								{ oc: 'Òc, a deman, Núria !', bon: true },
								{ oc: 'Cossí vas, Núria ?', reaccion: 'Núria rit : elle s’en va, et toi, tu lui demandes comment elle va ? Dis-lui plutôt au revoir.' },
								{ oc: 'Bonjorn, Núria !', reaccion: 'Núria rit : bonjour ? Elle s’en va ! Dis-lui plutôt à demain.' }
							],
							choses: ['a-deman'],
							explain: '*A deman !* : à demain ! Núria vient voir la chambre.'
						}
					],
					fin: 'Visite faite : tu as décrit un logement, pièce par pièce. À ton tour, maintenant, avec le tien, ou un logement imaginé.'
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
					type: 'note',
					variant: 'task',
					title: 'La tâche de l’unité : ton logement en huit phrases',
					paragraphs: [
						'Dessine le plan d’un logement : le tien, ou un logement imaginé, celui de tes rêves, celui d’un personnage. Comme tu préfères : personne ne vérifie !',
						'Décris-le en occitan ci-dessous, en huit phrases, puis à voix haute.',
						'Choisis maintenant à qui tu le décriras pour de vrai : ton prof, au prochain cours en visio, ou une personne qui apprend l’occitan avec toi.'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (décris ton logement)',
					intro: 'Une phrase à la fois. À la fin, la page les rassemble : c’est ta description.',
					recap: 'Ton logement, à décrire à voix haute :',
					glosa: { 'sol · sola': 'seul · seule' },
					items: [
						{
							consigne: '1. Où est ce logement ? Commence par *Demòri a…* ; pour un logement imaginé, *Es a…*',
							debut: ['Demòri a', 'Demòri dins', 'Es a', 'Es dins'],
							choses: ['demori-a'],
							explain: 'Par exemple : *Demòri a Besièrs, dins un apartament.* · *Es a Carcassona.*'
						},
						{
							consigne: '2. Avec qui ? *Demòri amb…* ; ou seul, seule : *Demòri sol*, *Demòri sola*.',
							answers: ['Demòri sol.', 'Demòri sola.'],
							debut: ['Demòri amb', 'Demòri sol', 'Demòri sola'],
							choses: ['demori-a', 'amb'],
							explain: 'Par exemple : *Demòri amb mon companh.* · *Demòri amb ma filha.* · *Demòri sola, amb una cata !*'
						},
						{
							consigne: '3. Ce qu’il y a : les pièces. Commence par *I a…*',
							debut: ['I a'],
							choses: ['i-a', 'la-cambra'],
							explain: 'Par exemple : *I a doas cambras, una cosina e una sala de banh.*'
						},
						{
							consigne: '4. Ce qu’il n’y a pas : *I a pas de…*',
							debut: ['I a pas de', 'I a pas d’'],
							choses: ['i-a'],
							explain: 'Par exemple : *I a pas de jardin.* · *I a pas de canapè !*'
						},
						{
							consigne: '5. Où est une pièce ? *al costat de…*, *davant…*, *darrièr…*',
							debut: ['La cambra es', 'Ma cambra es', 'La cosina es', 'La sala es', 'La sala de banh es', 'Lo jardin es'],
							choses: ['al-costat-de', 'davant', 'darrier'],
							explain: 'Par exemple : *Ma cambra es al costat de la sala de banh.* · *Lo jardin es darrièr l’ostal.*'
						},
						{
							consigne: '6. Une couleur : *La cosina es…*, *Lo canapè es…*',
							debut: ['La cosina es', 'La cambra es', 'Ma cambra es', 'La sala es', 'La pòrta es', 'Lo canapè es', 'L’ostal es', 'La taula es'],
							choses: ['la-color', 'blau-blava'],
							explain: 'Par exemple : *La cosina es blava.* Attention au féminin : *la pòrta es verda*, mais *lo canapè es verd*.'
						},
						{
							consigne: '7. Une taille ou un âge : *grand*, *pichon*, *vièlh*, *nòu*. Tu peux relier deux idées avec *mas*.',
							debut: ['La cambra es', 'Ma cambra es', 'La cosina es', 'La sala es', 'Lo jardin es', 'L’ostal es', 'L’apartament es', 'Lo canapè es'],
							choses: ['grand-granda', 'pichon-pichona', 'vielh-vielha', 'nou-nova'],
							explain: 'Par exemple : *L’ostal es vièlh, mas la cosina es nòva.*'
						},
						{
							consigne: '8. Pour finir, accueille la personne : « Bienvenue dans la maison ! »',
							answers: ['Benvenguda dins l’ostal !', 'Benvengut dins l’ostal !'],
							choses: ['l-ostal'],
							explain: '*Benvenguda* pour une femme, *benvengut* pour un homme (7.1).'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde la description de Karim.',
							a: '*Demòri a Tolosa, dins un apartament. Demòri amb dos amics. I a tres cambras, una cosina e una sala. I a pas de jardin ! Ma cambra es al costat de la sala de banh. La cosina es jauna. L’apartament es vièlh, mas lo canapè es nòu. Benvengut dins l’ostal, Loís !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'huit phrases : où, avec qui, ce qu’il y a et ce qu’il n’y a pas, où sont les pièces, une couleur, une taille',
						'*I a…*, et *I a pas de…*',
						'les petits mots soudés : *al costat del lièch*, mais *al costat de la sala*',
						'le féminin : *la cosina es jauna*, *la cambra es granda*',
						'la prononciation : le *l* final de *ostal*, le *d* muet de *grand*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Redis-le sans regarder',
					paragraphs: [
						'Cache l’écran, et décris ton logement d’une traite, à voix haute. Un mot oublié ? Regarde, puis recommence depuis le début.'
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
					title: 'Les trois sons de l’unité',
					paragraphs: [
						'Le *l* final s’entend : *l’ostal* « lous-TAL », *lo caval* « lou ca-BAL » (module 7.1).',
						'*al* et *del* se disent d’un seul coup ; devant une voyelle, le *s* de *als*, *dels* se lie : *als amics* « al-za-MITS » (module 7.2).',
						'La consonne finale se tait, puis revient au féminin : *grand* « GRAN », *granda* « GRAN-do » ; mais *verd* sonne « BÉRT » (module 7.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« la CAM-bro és GRAN-do » : la chambre est…',
							options: ['grande : *granda*, on entend le *d*', 'grand : *grand*, le *d* se tait'],
							correct: 0,
							noShuffle: true,
							explain: 'On entend « GRAN-do » : c’est le féminin, *granda*, pour *la cambra*. Au masculin, *grand* se dit « GRAN ».'
						},
						{
							q: '*Lo jardin del vilatge* se dit…',
							options: ['lou djar-DI dél bi-LA-djé', 'lou djar-DI dé lou bi-LA-djé'],
							correct: 0,
							noShuffle: true,
							explain: '*de* + *lo* = *del*, d’un seul coup.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*L’ostal es al costat del jardin, e la pòrta es verda.*',
							a: '« lous-TAL és al cous-TAT dél djar-DI, é la PÒR-to és BÉR-do » : les trois sons de l’unité dans une seule phrase.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : une chanson, A mon ostal',
					paragraphs: [
						'*A mon ostal*, « chez moi » : c’est le titre d’une chanson que joue Castanha é Vinovèl, un duo de la région de Béziers, à la vielle et à l’accordéon.',
						'Le titre, c’est toute l’unité : *ostal*, et *mon* (unité 3). Écoute-la une première fois sans rien chercher, puis une deuxième : quels mots reconnais-tu ?'
					],
					lien: { href: 'https://www.deezer.com/track/6541394', texte: 'A mon ostal, Castanha é Vinovèl (Deezer)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 7 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'nommer les pièces et les meubles, et dire ce qu’il y a dans une maison',
						'dire où sont les choses : *sus*, *jos*, *al costat de*…',
						'dire la couleur, la taille et l’âge des choses, au masculin et au féminin',
						'décrire un logement en huit phrases'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant décrire un logement.',
						'Si tu en as envie : décris ton logement, ou celui de tes rêves, à une personne précise, ton prof au prochain cours en visio par exemple. Quand ? Où ? Choisis-le maintenant. Ensuite vient l’unité 8 : on sort de la maison, direction la ville.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 7 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['demander ce qu’il y a', '*Qué i a dins l’ostal ?* · *I a una cosina.*'],
						['dire ce qu’il n’y a pas', '*I a pas de jardin.*'],
						['faire visiter', '*Aquí, i a la sala.*'],
						['demander où est une chose', '*Ont es Mimí ?* · *Es jos la taula.*'],
						['dire où sont les choses', '*sus* · *jos* · *davant* · *darrièr* · *al costat de* · *entre*'],
						['demander une couleur', '*De quina color es ?* · *Es blava.*'],
						['décrire son logement', '*Demòri dins un apartament.* · *Es pichon, mas es nòu.*']
					]
				},
				{
					type: 'table',
					title: 'Mémo : soudés, et accordés',
					head: ['', 'avec un mot masculin', 'avec un mot féminin'],
					rows: [
						['*a* : à', '*al jardin*', '*a la fenèstra*'],
						['*de* : de', '*al costat del lièch*', '*al costat de la taula*'],
						['*sus* : sur', '*sul canapè*', '*sus la taula*'],
						['une couleur', '*lo canapè roge*', '*la pòrta roja*'],
						['une taille', '*lo jardin es grand*', '*la cambra es granda*']
					],
					notes: [
						'Devant une voyelle, rien ne se soude : *a l’ostal*, *de l’armari*.',
						'Pour plusieurs choses : *als amics*, *dels amics*.'
					]
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'la maison', 'la chambre', 'rouge'],
					rows: [
						['languedocien (ton cours)', '*l’ostal*', '*la cambra*', '*roge, roja*'],
						['gascon', '*l’ostau*', '*la crampa*', '*arroi, arroja*'],
						['provençal', '*l’ostau*', '*la chambra* · *la cambra*', '*roge, roja*'],
						['limousin', '*l’ostau* · *la maison*', '*la chambra*', '*roge, roja*'],
						['auvergnat', '*l’ostal* · *l’ostau*', '*la chambra*', '*roge, roja*'],
						['vivaro-alpin', '*l’ostau* · *la maison*', '*la chambra*', '*roge, roja*']
					],
					notes: [
						'Presque partout ailleurs, *ostal* devient *ostau*.',
						'Au nord, et aussi en provençal, *cambra* devient *chambra* ; en gascon, la chambre est la *crampa*.',
						'En gascon, un *a* s’ajoute devant le *r* du début : *roge* devient *arroi*.',
						'Formes tirées des dictionnaires de lo Congrès (dicodòc).'
					],
					glosa: {
						'l’ostau': 'la maison',
						'la maison': 'la maison (limousin, vivaro-alpin)',
						'la crampa': 'la chambre (gascon)',
						'la chambra': 'la chambre',
						'arroi, arroja': 'rouge (gascon)'
					}
				}
			]
		}
	]
};
