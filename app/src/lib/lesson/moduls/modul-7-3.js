// Module 7.3 · A1 · « De quina color es ? » : unité 7 (L’ostal), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : la couleur après le nom, et le féminin avec un -a au bout ;
// grand, pichon, vièlh, nòu après es, et après le nom, leur place habituelle
// selon la grammaire de référence (un ostal vièlh ; décision du 2026-11-02).
// Devant le nom, le sens change : pas avant l'A2 (lexic-A1.md, 7.3). Une chose à la fois : le pluriel
// des adjectifs n'est pas au programme de l'A1.
// Scène : fin de la semaine ; Karim revient avec Inès, sa petite sœur,
// chercher Mimí chez Marià. Inès tutoie Mimí, Marià tutoie Inès.
// Jeu du jour : cocher les bonnes couleurs (qcm, voir le commentaire).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01 ; aur le
// 2026-11-02), à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modul73 = {
	id: 'modul-7-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '7-3',
	unitat: 'Unitat 7 · L’ostal',
	nivel: 'A1 · Modul 7.3',
	oc: 'De quina color es ?',
	fr: 'De quelle couleur est-ce ? Dire les couleurs, la taille, l’âge',
	cando:
		'Je peux demander et dire la couleur d’une chose, au masculin et au féminin, et dire si elle est grande, petite, vieille ou neuve.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Inès', 'Marià', 'Mimí'],
	notesRelecture: [
		'*Es ton amic, lo cat negre ?* demande Inès à Mimí : naturel ?',
		'Ajouté le 2026-11-02 d’après la grammaire de référence : l’adjectif après le nom, *un ostal vièlh* (note du tableau, À retenir, un exercice). À relire.',
		'Pour finir, Marià reprend sa phrase de 7.1 : *Mimí es d’aquí, ara !* On garde ce rappel ?',
		'Culture : le drapeau rouge et or, *l’aur* (l’or), « LAOUR » : c’est bien ton usage ?',
		'Ton choix du 2026-11-02 (grammaire de référence, p16) : *blanc* « BLANK », le *c* final se dit, comme *cinc* « SINK » ; avant, « BLAN ». Le son du jour garde *grand* « GRAN » et *jardin* « djar-DI » pour la consonne qui se tait. À relire.'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'sous la table',
							options: ['jos la taula', 'sus la taula', 'davant la taula'],
							correct: 0,
							oc: true,
							choses: ['jos'],
							explain: '*jos* : sous ; *sus* : sur ; *davant* : devant.'
						},
						{
							q: 'à côté du lit',
							options: ['al costat del lièch', 'davant lo lièch', 'darrièr lo lièch'],
							correct: 0,
							oc: true,
							choses: ['al-costat-de', 'al-del'],
							explain: '*al costat de* + *lo lièch* : *del lièch*, soudé.'
						},
						{
							q: 'Elle n’est pas sur le canapé.',
							options: ['Non es pas sul canapè.', 'Non es pas jos lo canapè.', 'Non es pas sus la taula.'],
							correct: 0,
							oc: true,
							choses: ['sus-sul'],
							explain: '*sul canapè* : *sus* + *lo*, soudés.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'L’armoire est entre la porte et la fenêtre.',
							answers: ['L’armari es entre la pòrta e la fenèstra.'],
							choses: ['entre', 'l-armari']
						},
						{
							consigne: 'Le jardin est derrière la maison.',
							answers: ['Lo jardin es darrièr l’ostal.'],
							choses: ['darrier', 'lo-jardin']
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
					type: 'fotos',
					// Photos de Romain (05-11), sans GPS : static/aprene/fotos/
					imatges: [
						{ clau: '7-3-porta', amples: [720, 1200], l: 720, h: 480, oc: 'la pòrta blava', fr: 'la porte bleue', alt: 'Une vieille porte de bois peinte en bleu, avec au milieu une petite porte en arc, couleur bois.' }
					]
				},
				{
					type: 'dialogue',
					title: 'La porte bleue',
					intro:
						'Fin de la semaine : Karim revient chercher Mimí, avec Inès, sa petite sœur. Inès n’est jamais venue chez Marià. D’abord Karim et Inès dans le village, puis Inès et Marià dans le jardin. Lis une première fois pour répondre à une seule question : avec qui est Mimí, dans le jardin ?',
					scenes: [
						{
							title: 'Dins lo vilatge',
							subtitle: '(Karim et Inès cherchent la maison)',
							lines: [
								{ oc: 'Karim, ont es l’ostal de Marià ?', sound: 'ka-RIM, oun ÉS lous-TAL dé ma-ri-A ?', fr: 'Karim, où est la maison de Marià ?' },
								{ oc: 'Aquí, dins lo vilatge. L’ostal es vièlh.', sound: 'a-KI, dins lou bi-LA-djé. lous-TAL és BYÈL.', fr: 'Ici, dans le village. La maison est vieille.' },
								{ oc: 'E la pòrta ? De quina color es ?', sound: 'é la PÒR-to ? dé KI-no cou-LOU ÉS ?', fr: 'Et la porte ? De quelle couleur est-elle ?' },
								{ oc: 'Es blava.', sound: 'és BLA-bo.', fr: 'Elle est bleue.' },
								{ oc: 'Aquí, la pòrta es verda… E aquí, es roja…', sound: 'a-KI, la PÒR-to és BÉR-do… é a-KI, és ROU-djo…', fr: 'Ici, la porte est verte… Et ici, elle est rouge…' },
								{ oc: 'E aquí, es blava ! Vaquí l’ostal de Marià.', sound: 'é a-KI, és BLA-bo ! ba-KI lous-TAL dé ma-ri-A.', fr: 'Et ici, elle est bleue ! Voilà la maison de Marià.' }
							]
						},
						{
							title: 'Dins lo jardin',
							subtitle: '(Marià accueille Inès)',
							lines: [
								{ oc: 'Adieu, Inès ! Mimí es dins lo jardin.', sound: 'a-DIOU, i-NÈS ! mi-MI és dins lou djar-DI.', fr: 'Salut, Inès ! Mimí est dans le jardin.' },
								{ oc: 'Bonjorn, Marià ! Mas… i a un cat negre, aquí.', sound: 'boun-DJOUR, ma-ri-A ! mas… ya un CAT NÉ-gré, a-KI.', fr: 'Bonjour, Marià ! Mais… il y a un chat noir, ici.' },
								{ oc: 'Es lo cat del vilatge. Es vièlh, e es grand.', sound: 'és lou CAT dél bi-LA-djé. és BYÈL, é és GRAN.', fr: 'C’est le chat du village. Il est vieux, et il est grand.' },
								{ oc: 'E Mimí ? Mimí es pichona, e grisa.', sound: 'é mi-MI ? mi-MI és pi-TCHOU-no, é GRI-zo.', fr: 'Et Mimí ? Mimí est petite, et grise.' },
								{ oc: 'Vaquí una cata grisa, al costat del cat negre !', sound: 'ba-KI U-no CA-to GRI-zo, al cous-TAT dél CAT NÉ-gré !', fr: 'Voilà une chatte grise, à côté du chat noir !' },
								{ oc: 'Mimí ! Es ton amic, lo cat negre ?', sound: 'mi-MI ! és toun a-MIC, lou CAT NÉ-gré ?', fr: 'Mimí ! C’est ton ami, le chat noir ?' },
								{ oc: 'Mimí, a l’ostal !', sound: 'mi-MI, a lous-TAL !', fr: 'Mimí, à la maison !' },
								{ oc: 'Mimí non vòl pas…', sound: 'mi-MI nou BÒL PAS…', fr: 'Mimí ne veut pas…' },
								{ oc: 'Mimí es d’aquí, ara !', sound: 'mi-MI és da-KI, A-ro !', fr: 'Mimí est d’ici, maintenant !' }
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
							q: 'Avec qui est Mimí, dans le jardin ?',
							options: ['un grand chat noir', 'un petit chat gris', 'Karim'],
							correct: 0,
							choses: ['negre-negra', 'grand-granda'],
							explain: '*un cat negre*… *vièlh, e grand* : le chat du village. Mimí s’est fait un ami.'
						},
						{
							q: 'De quelle couleur est la porte de Marià ?',
							options: ['bleue', 'verte', 'rouge'],
							correct: 0,
							choses: ['blau-blava', 'la-color'],
							explain: 'Une porte *verda*, une porte *roja*… et enfin la porte *blava* !'
						},
						{
							q: 'Comment est Mimí ?',
							options: ['petite et grise', 'grande et noire', 'vieille et blanche'],
							correct: 0,
							choses: ['pichon-pichona', 'gris-grisa'],
							explain: '*Mimí es pichona, e grisa* : une chatte, donc un *-a* au bout.'
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
					title: 'Masculin, féminin',
					intro: 'Regarde les couleurs de la scène : elles changent selon le mot qu’elles accompagnent.',
					items: [
						{
							q: '*De quina color es ?* demande Inès. *La color*, c’est…',
							options: ['la couleur', 'la forme', 'la porte'],
							correct: 0,
							choses: ['la-color'],
							explain: '*la color* : la couleur, « la cou-LOU ». Féminin, comme en français.'
						},
						{
							q: '*La pòrta es blava.* Et une armoire bleue ?',
							options: ['un armari blau', 'un armari blava', 'una armari blau'],
							correct: 0,
							oc: true,
							choses: ['blau-blava', 'l-armari'],
							explain: '*l’armari* est masculin : *blau*. *La pòrta* est féminine : *blava*.'
						},
						{
							q: '*La pòrta es roja.* Et un canapé rouge ?',
							options: ['un canapè roge', 'un canapè roja', 'una canapè roge'],
							correct: 0,
							oc: true,
							choses: ['roge-roja', 'lo-canape'],
							explain: 'Au masculin, *roge* ; au féminin, *roja*. Et la couleur vient après le mot.'
						},
						{
							q: '*Un cat negre*. Et Mimí, si elle était noire ?',
							options: ['una cata negra', 'una cata negre', 'un cat negra'],
							correct: 0,
							oc: true,
							choses: ['negre-negra'],
							explain: '*negre* devient *negra* : au féminin, un *-a* au bout.'
						},
						{
							q: '*Es vièlh, e es grand*, dit Marià du chat du village. Le chat est…',
							options: ['vieux et grand', 'petit et vieux', 'grand et neuf'],
							correct: 0,
							choses: ['vielh-vielha', 'grand-granda'],
							explain: '*vièlh* : vieux, « BYÈL » ; *grand* : grand, « GRAN ».'
						},
						{
							q: '*Mimí es pichona.* Mimí est…',
							options: ['petite', 'grande', 'vieille'],
							correct: 0,
							choses: ['pichon-pichona'],
							explain: '*pichon*, *pichona* : petit, petite. Tout le Midi dit « pitchoun » !'
						},
						{
							q: '*Nòu*, c’est « neuf, nouveau ». Mais *nòu*, tu le connais déjà : c’est aussi…',
							options: ['le nombre 9', 'le nombre 2', 'le nombre 10'],
							correct: 0,
							choses: ['nou-nova'],
							explain: 'Comme en français : *nòu* (9) et *nòu* (neuf). *Un canapè nòu*, *una taula nòva*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Un -a pour le féminin',
					head: ['', 'avec un mot masculin', 'avec un mot féminin'],
					rows: [
						['rouge', '*lo canapè roge*', '*la pòrta roja*'],
						['bleu', '*l’armari blau*', '*la pòrta blava*'],
						['vert', '*lo jardin verd*', '*la cadièra verda*'],
						['jaune', '*lo canapè jaune*', '*la cosina jauna*'],
						['noir', '*lo cat negre*', '*la cata negra*'],
						['blanc', '*l’armari blanc*', '*la taula blanca*'],
						['gris', '*lo cat gris*', '*la cata grisa*']
					],
					notes: [
						'La couleur vient après le mot, comme en français : *la pòrta blava*, la porte bleue.',
						'C’est la place habituelle de l’adjectif en occitan, même pour la taille et l’âge : *un ostal vièlh* (une vieille maison), *una taula nòva*. Devant le nom, le sens change un peu : tu le verras plus tard.',
						'Au féminin, un *-a* au bout, qui sonne « o » : *blava* « BLA-bo ». *Roge* et *jaune* changent leur *-e* : *roja*, *jauna*.',
						'Après *es*, c’est pareil : *Mimí es grisa*, *lo cat es negre*. Ici, une seule chose à la fois : pour plusieurs, la couleur change aussi, tu le verras plus tard.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : cinq couleurs',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'la-color', oc: 'la color', sound: 'la cou-LOU', fr: 'la couleur' },
						{ id: 'roge-roja', oc: 'roge · roja', sound: 'ROU-djé · ROU-djo', fr: 'rouge (au masculin · au féminin)' },
						{ id: 'blau-blava', oc: 'blau · blava', sound: 'BLAOU · BLA-bo', fr: 'bleu · bleue' },
						{ id: 'verd-verda', oc: 'verd · verda', sound: 'BÉRT · BÉR-do', fr: 'vert · verte' },
						{ id: 'jaune-jauna', oc: 'jaune · jauna', sound: 'DJAOU-né · DJAOU-no', fr: 'jaune (au masculin · au féminin)' }
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
					title: 'À retenir : noir, blanc, gris',
					intro: 'Les couleurs de Mimí et de son ami.',
					items: [
						{ id: 'negre-negra', oc: 'negre · negra', sound: 'NÉ-gré · NÉ-gro', fr: 'noir · noire' },
						{ id: 'blanc-blanca', oc: 'blanc · blanca', sound: 'BLANK · BLAN-co', fr: 'blanc · blanche' },
						{ id: 'gris-grisa', oc: 'gris · grisa', sound: 'GRIS · GRI-zo', fr: 'gris · grise' }
					]
				},
				// jeu prévu par la carte : cocher les bonnes couleurs sur le dessin (à
				// coder). Version simple : qcm ; Inès demande, la couleur est donnée en
				// français, et l'on choisit la forme accordée parmi des formes réelles.
				{
					type: 'qcm',
					title: 'Inès dessine',
					intro:
						'Inès dessine la maison de Marià dans son carnet. Elle te demande les couleurs : choisis la bonne forme, masculin ou féminin.',
					items: [
						{
							ditz: { qui: 'Inès', oc: 'De quina color es la pòrta ?' },
							q: 'Bleue :',
							options: ['Es blava.', 'Es blau.', 'Es verda.'],
							correct: 0,
							oc: true,
							choses: ['blau-blava', 'la-color'],
							explain: '*la pòrta* : féminin, donc *blava*.'
						},
						{
							ditz: { qui: 'Inès', oc: 'E l’ostal, de quina color es ?' },
							q: 'Blanche (la maison est blanche) :',
							options: ['Es blanc.', 'Es blanca.', 'Es negre.'],
							correct: 0,
							oc: true,
							choses: ['blanc-blanca', 'l-ostal'],
							explain: 'Piège : *l’ostal* est masculin (*un ostal*), donc *blanc*, même si « la maison » est féminine en français.'
						},
						{
							ditz: { qui: 'Inès', oc: 'E lo canapè ?' },
							q: 'Rouge :',
							options: ['Es roge.', 'Es roja.', 'Es jaune.'],
							correct: 0,
							oc: true,
							choses: ['roge-roja'],
							explain: '*lo canapè* : masculin, *roge*.'
						},
						{
							ditz: { qui: 'Inès', oc: 'E la cosina ?' },
							q: 'Jaune :',
							options: ['Es jauna.', 'Es jaune.', 'Es blanca.'],
							correct: 0,
							oc: true,
							choses: ['jaune-jauna', 'la-cosina'],
							explain: '*la cosina* : féminin, *jauna*.'
						},
						{
							ditz: { qui: 'Inès', oc: 'E lo jardin ?' },
							q: 'Vert :',
							options: ['Es verd.', 'Es verda.', 'Es gris.'],
							correct: 0,
							oc: true,
							choses: ['verd-verda', 'lo-jardin'],
							explain: '*lo jardin* : masculin, *verd*, « BÉRT ».'
						},
						{
							ditz: { qui: 'Inès', oc: 'E la fenèstra ?' },
							q: 'Verte :',
							options: ['Es verda.', 'Es verd.', 'Es blava.'],
							correct: 0,
							oc: true,
							choses: ['verd-verda', 'la-fenestra'],
							explain: '*la fenèstra* : féminin, *verda*, « BÉR-do ».'
						},
						{
							ditz: { qui: 'Inès', oc: 'E lo cat del vilatge ?' },
							q: 'Noir :',
							options: ['Es negre.', 'Es negra.', 'Es blanc.'],
							correct: 0,
							oc: true,
							choses: ['negre-negra'],
							explain: '*lo cat* : masculin, *negre*.'
						},
						{
							ditz: { qui: 'Inès', oc: 'E Mimí ?' },
							q: 'Grise :',
							options: ['Es grisa.', 'Es gris.', 'Es negra.'],
							correct: 0,
							oc: true,
							choses: ['gris-grisa'],
							explain: 'Mimí est une chatte : *grisa*, « GRI-zo ».'
						},
						{
							ditz: { qui: 'Inès', oc: 'E la taula ?' },
							q: 'Blanche :',
							options: ['Es blanca.', 'Es blanc.', 'Es jauna.'],
							correct: 0,
							oc: true,
							choses: ['blanc-blanca', 'la-taula'],
							explain: '*la taula* : féminin, *blanca*, « BLAN-co ».'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir : grand, petit, vieux, neuf',
					intro: 'Pour dire la taille et l’âge : après *es*, *L’ostal es vièlh* ; ou juste après le nom, comme les couleurs, *un ostal vièlh*.',
					items: [
						{ id: 'grand-granda', oc: 'grand · granda', sound: 'GRAN · GRAN-do', fr: 'grand · grande' },
						{ id: 'pichon-pichona', oc: 'pichon · pichona', sound: 'pi-TCHOU · pi-TCHOU-no', fr: 'petit · petite' },
						{ id: 'vielh-vielha', oc: 'vièlh · vièlha', sound: 'BYÈL · BYÈ-lyo', fr: 'vieux · vieille' },
						{ id: 'nou-nova', oc: 'nòu · nòva', sound: 'NÒOU · NÒ-bo', fr: 'neuf, nouveau · neuve, nouvelle (comme le nombre 9 !)' }
					]
				},
				{
					type: 'qcm',
					title: 'Inès dessine encore',
					intro: 'Marià décrit sa maison. Touche ce qu’Inès doit dessiner.',
					items: [
						{
							ditz: { qui: 'Marià', oc: 'L’ostal es vièlh, mas lo canapè es nòu.' },
							q: 'Inès dessine…',
							options: ['une vieille maison, un canapé neuf', 'une maison neuve, un vieux canapé', 'une grande maison, un petit canapé'],
							correct: 0,
							choses: ['vielh-vielha', 'nou-nova'],
							explain: '*vièlh* : vieux ; *nòu* : neuf.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Lo jardin es grand, e la cosina es pichona.' },
							q: 'Inès dessine…',
							options: ['un grand jardin, une petite cuisine', 'un petit jardin, une grande cuisine', 'un grand jardin, une cuisine neuve'],
							correct: 0,
							choses: ['grand-granda', 'pichon-pichona'],
							explain: '*grand* : grand ; *pichona* : petite (*la cosina*, féminin).'
						},
						{
							ditz: { qui: 'Marià', oc: 'La cadièra es vièlha.' },
							q: 'Inès dessine…',
							options: ['une vieille chaise', 'une chaise neuve', 'une petite chaise'],
							correct: 0,
							choses: ['vielh-vielha', 'la-cadiera'],
							explain: '*vièlha* : vieille, « BYÈ-lyo ».'
						},
						{
							ditz: { qui: 'Marià', oc: 'La taula es nòva, e granda !' },
							q: 'Inès dessine…',
							options: ['une table neuve, et grande', 'une vieille table, et grande', 'une table neuve, et petite'],
							correct: 0,
							choses: ['nou-nova', 'grand-granda'],
							explain: '*nòva*, *granda* : *la taula* est féminine.'
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
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'La porte est bleue.',
							answers: ['La pòrta es blava.'],
							choses: ['blau-blava']
						},
						{
							consigne: 'Le canapé est rouge.',
							answers: ['Lo canapè es roge.'],
							choses: ['roge-roja', 'lo-canape']
						},
						{
							consigne: 'La fenêtre est verte.',
							answers: ['La fenèstra es verda.'],
							choses: ['verd-verda', 'la-fenestra']
						},
						{
							consigne: 'une chatte grise',
							answers: ['una cata grisa'],
							choses: ['gris-grisa'],
							explain: 'La couleur après le mot, et au féminin.'
						},
						{
							consigne: 'Le chat est noir et blanc.',
							answers: ['Lo cat es negre e blanc.'],
							choses: ['negre-negra', 'blanc-blanca']
						},
						{
							consigne: 'La cuisine est jaune.',
							answers: ['La cosina es jauna.'],
							choses: ['jaune-jauna', 'la-cosina']
						},
						{
							consigne: 'La maison est vieille.',
							answers: ['L’ostal es vièlh.'],
							choses: ['vielh-vielha', 'l-ostal'],
							explain: 'Piège : *l’ostal* est masculin, donc *vièlh*, sans *-a*.'
						},
						{
							consigne: 'Une vieille maison (l’adjectif après le nom).',
							answers: ['Un ostal vièlh.'],
							choses: ['vielh-vielha', 'l-ostal'],
							explain: 'Comme les couleurs, l’adjectif se met d’habitude après le nom : *un ostal vièlh*.'
						},
						{
							consigne: 'Le jardin est grand, et la chambre est petite.',
							answers: ['Lo jardin es grand, e la cambra es pichona.'],
							choses: ['grand-granda', 'pichon-pichona']
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'De quelle couleur est la chaise ?',
							tiles: ['De', 'quina', 'color', 'es', 'la', 'cadièra ?'],
							choses: ['la-color', 'la-cadiera'],
							explain: '*De quina color es… ?* : la question du module.'
						},
						{
							prompt: 'Le canapé est neuf, et la table est vieille.',
							tiles: ['Lo', 'canapè', 'es', 'nòu,', 'e', 'la', 'taula', 'es', 'vièlha.'],
							choses: ['nou-nova', 'vielh-vielha'],
							explain: '*nòu* pour *lo canapè* ; *vièlha* pour *la taula*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : une maison en couleurs',
					intro:
						'Pense à une maison, la tienne ou une autre. Dis à voix haute trois couleurs et une taille, puis compare au modèle.',
					items: [
						{
							q: 'La porte, la cuisine, le canapé…',
							a: 'Par exemple : *La pòrta es verda. La cosina es blanca, e es pichona. Lo canapè es blau, e es vièlh !*'
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
					title: 'Le son du jour : la consonne du bout',
					paragraphs: [
						'Au bout de certains mots, la consonne ne se dit pas : *grand* « GRAN », *jardin* « djar-DI ».',
						'Au féminin, elle revient, parce qu’une voyelle la suit : *granda* « GRAN-do ».',
						'D’autres se disent, là où le français se tait : *blanc* « BLANK », comme *cinc* « SINK », puis *blanca* « BLAN-co ». Et après le *r*, le *d* sonne « t » : *verd* « BÉRT », puis *verda* « BÉR-do ».',
						'Écoute, puis répète : *grand, granda* ; *blanc, blanca* ; *verd, verda*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*verd* (vert) se dit…',
							options: ['BÉRT', 'BÉR'],
							correct: 0,
							noShuffle: true,
							explain: 'Après le *r*, le *d* final sonne « t » : « BÉRT ». Au féminin, *verda* : « BÉR-do ».'
						},
						{
							q: '*blanc* (blanc) se dit…',
							options: ['BLANK', 'BLAN'],
							correct: 0,
							noShuffle: true,
							explain: '« BLAN », c’est la lecture à la française. En occitan, le *c* final se dit : « BLANK », comme *cinc* « SINK ». Au féminin, *blanca* : « BLAN-co ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Lo jardin es grand e verd.*',
							a: '« lou djar-DI és GRAN é BÉRT » : deux consonnes qui se taisent, et un *d* qui sonne « t ».'
						},
						{
							q: '*La cambra es granda e blanca.*',
							a: '« la CAM-bro és GRAN-do é BLAN-co » : au féminin, tout s’entend.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : le rouge et l’or',
					paragraphs: [
						'La croix occitane, celle du drapeau, est d’or sur fond rouge ; ses branches finissent par de petites boules.',
						'C’est la croix des comtes de Toulouse : elle est sur leurs armes dès la seconde moitié du XIIe siècle. D’où vient-elle ? On ne le sait pas vraiment.',
						'En occitan, l’or, c’est *l’aur*. Et le rouge, tu le sais maintenant : *roge*.'
					],
					glosa: { 'l’aur': 'l’or' },
					lien: { href: 'https://fr.wikipedia.org/wiki/Croix_occitane', texte: 'La croix occitane (Wikipédia)' }
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander une couleur : *De quina color es ?*',
						'dire une couleur, au masculin et au féminin : *roge, roja*',
						'dire la taille et l’âge, après *es* ou après le nom : *un ostal vièlh*',
						'faire revenir la consonne au féminin : *grand*, *granda*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire de quelle couleur sont les choses.',
						'Si tu en as envie : joue à « devine l’objet » en occitan avec une personne précise, un enfant, ton voisin : *Es roge, e es pichon. Qué es aquò ?* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
