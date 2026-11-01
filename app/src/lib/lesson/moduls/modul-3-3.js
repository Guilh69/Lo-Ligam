// Module 3.3 · A1 · « As de fraires ? » : unité 3 (La familha), rédigé par Claude
// le 2026-11-01 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3, règles de cursus/regles-redaccion-A1.md).
// Forme du jour : aver au singulier (ai, as, a) ; un, una devant le nom ;
// i a (il y a) ; après pas, on dit de.
// Jeu du jour : les anagrammes (lettres mélangées à remettre dans l'ordre).
// Scène : après le repas, Joana fait visiter la cour de la ferme à Núria,
// puis Papeta montre les bêtes (famille de l'unité : voir le module 3.1).
// Lexique : cursus/lexic-A1.md, items copiés tels quels (mêmes id).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul33 = {
	id: 'modul-3-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '3-3',
	unitat: 'Unitat 3 · La familha',
	nivel: 'A1 · Modul 3.3',
	oc: 'As de fraires ?',
	fr: 'As-tu des frères ? Dire ce qu’on a',
	cando:
		'Je peux dire si j’ai des frères, des sœurs ou des animaux avec *ai, as, a*, *un, una* et *Ai pas de…*, et dire ce qu’il y a avec *I a…*.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages et des bêtes : ni contrôlés ni vérifiés.
	nomsPropris: ['Joana', 'Núria', 'Jordi', 'Inès', 'Karim', 'Mistral', 'Mimí'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Le chien : le Basic donne *can* (occitan) et *gos* (languedocien). J’enseigne *can*, comme le lexique, et je glose *gos* « on dit aussi » : lequel dis-tu ?',
		'Humour : *I a pas de cat : Mistral es aquí !* (pas de chat ici, le chien Mistral est là) : ça te va ?',
		'*As de fraires ?* : le *de* est seulement expliqué « des », sans grammaire du partitif : ça te va ?',
		'Jordi, le frère de Núria, est catalan : « JOR-di », à la catalane.',
		'Son du jour (le « n » final s’efface) : l’unité 1 note *Al còp que ven* « qué BÈN », avec le « n ». C’est ton usage pour ce mot ? J’ai écrit « le plus souvent » pour ne pas le contredire.',
		'Anagrammes en version simple : les lettres sont des tuiles séparées, la réponse s’affiche « c a n ». À coder : des tuiles collées sans espace.'
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
					intro: 'Deux phrases du module 3.2 et du module 3.1, sans regarder. Un accent ou un trait d’union oublié, on te le montre.',
					items: [
						{ consigne: 'Karim montre une photo : « C’est ma sœur. »', answers: ['Es ma sòrre.'], choses: ['la-sorre', 'possessius-mon-ma'] },
						{
							consigne: 'Écris en lettres : 15',
							answers: ['quinze'],
							choses: ['nombre-15'],
							explain: '*quinze* : 15, « KIN-zé ».'
						}
					]
				},
				{
					type: 'qcm',
					title: 'Ce qui revient du module 3.2',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'La fille de ta tante, c’est…',
							options: ['ta cosina', 'ta sòrre', 'ta filha'],
							correct: 0,
							oc: true,
							choses: ['cosin-cosina', 'possessius-mon-ma'],
							explain: 'La fille de ta tante : *ta cosina*, ta cousine.'
						},
						{
							q: '*Los dròlles !* Mameta appelle…',
							options: ['les enfants', 'les frères', 'les parents'],
							correct: 0,
							choses: ['drolle-drolla'],
							explain: '*los dròlles* : les enfants.'
						},
						{
							q: '*setze* :',
							options: ['16', '7', '6'],
							correct: 0,
							choses: ['nombre-16'],
							explain: '*setze* : 16 ; *sèt* : 7 ; *sièis* : 6.'
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
					title: 'Dans la cour de Papeta',
					intro:
						'Après le repas, Joana fait visiter la cour de la ferme à Núria. Puis Papeta leur montre les bêtes. Lis une première fois pour répondre à une seule question : de quoi Joana et Núria parlent-elles ?',
					scenes: [
						{
							title: 'Joana e Núria',
							subtitle: '(après le repas, dans la cour)',
							lines: [
								{ oc: 'Núria, as de fraires ?', sound: 'NOU-ria, as dé FRAÏ-rés ?', fr: 'Núria, as-tu des frères ?' },
								{ oc: 'Òc, ai un fraire, Jordi. Mas ai pas de sòrre. E tu ?', sound: 'OK, aï un FRAÏ-ré, JOR-di. mas aï PAS dé SÒ-rré. é TU ?', fr: 'Oui, j’ai un frère, Jordi. Mais je n’ai pas de sœur. Et toi ?' },
								{ oc: 'Ieu, ai pas de fraire e ai pas de sòrre… mas ai un can !', sound: 'YÉOU, aï PAS dé FRAÏ-ré é aï PAS dé SÒ-rré… mas aï un CA !', fr: 'Moi, je n’ai pas de frère et pas de sœur… mais j’ai un chien !' },
								{ oc: 'Un can ? Ont es ?', sound: 'un CA ? OUN ÉS ?', fr: 'Un chien ? Où est-il ?' },
								{ oc: 'Es aquí : es Mistral !', sound: 'és a-KI : és mis-TRAL !', fr: 'Il est là : c’est Mistral !' },
								{ oc: 'Ieu, ai un aucèl, a Barcelona.', sound: 'YÉOU, aï u-naou-SÈL, a bar-sé-LOU-no.', fr: 'Moi, j’ai un oiseau, à Barcelone.' }
							]
						},
						{
							title: 'Lo papeta e Núria',
							subtitle: '(Papeta montre les bêtes)',
							lines: [
								{ oc: 'Aquí, i a las galinas.', sound: 'a-KI, ya las ga-LI-nos.', fr: 'Ici, il y a les poules.' },
								{ oc: 'Una, doas, tres… I a sèt galinas !', sound: 'U-no, DOUOS, TRÉS… ya SÈT ga-LI-nos !', fr: 'Une, deux, trois… Il y a sept poules !' },
								{ oc: 'Òc. E aquí, i a lo caval.', sound: 'OK. é a-KI, ya lou ca-BAL.', fr: 'Oui. Et ici, il y a le cheval.' },
								{ oc: 'Un caval ! E i a un cat ?', sound: 'un ca-BAL ! é ya un CAT ?', fr: 'Un cheval ! Et il y a un chat ?' },
								{ oc: 'Non, i a pas de cat : Mistral es aquí !', sound: 'NOU, ya PAS dé CAT : mis-TRAL és a-KI !', fr: 'Non, il n’y a pas de chat : Mistral est là !' },
								{ oc: 'E Inès ? A un can ?', sound: 'é i-NÈS ? a un CA ?', fr: 'Et Inès ? Elle a un chien ?' },
								{ oc: 'Non, Inès a una cata, Mimí.', sound: 'NOU, i-NÈS a U-no CA-to, mi-MI.', fr: 'Non, Inès a une chatte, Mimí.' }
							]
						}
					],
					glossary: [{ oc: 'las galinas', sound: 'las ga-LI-nos', fr: 'les poules (galina au pluriel)' }]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'De quoi Joana et Núria parlent-elles ?',
							options: ['de leurs frères, sœurs et animaux', 'de leur âge', 'du repas'],
							correct: 0,
							choses: ['aver-singular'],
							explain: '*As de fraires ?* : as-tu des frères ? Puis Joana parle de son chien, et Núria de son oiseau.'
						},
						{
							q: 'Núria a…',
							options: ['un frère, et pas de sœur', 'une sœur, et pas de frère', 'un frère et une sœur'],
							correct: 0,
							choses: ['ai-pas-de', 'un-una-article'],
							explain: '*Ai un fraire, Jordi. Mas ai pas de sòrre* : un frère, Jordi, mais pas de sœur.'
						},
						{
							q: 'Combien de poules y a-t-il chez Papeta ?',
							options: ['7', '6', '17'],
							correct: 0,
							choses: ['i-a', 'la-galina', 'nombre-7'],
							explain: '*I a sèt galinas* : il y a sept poules.'
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
					title: 'Avoir, et il y a',
					intro: 'Regarde les phrases de la cour.',
					items: [
						{
							q: 'Núria dit *Ai un fraire*. Joana demande *As de fraires ?* Que veut dire *ai* ?',
							options: ['j’ai', 'tu as', 'il a'],
							correct: 0,
							choses: ['aver-singular'],
							explain: '*ai* : j’ai ; *as* : tu as ; *a* : il ou elle a. Tu les connais déjà par l’âge : *Ai sèt ans*.'
						},
						{
							q: '*Inès a una cata.* Ici, *a* veut dire…',
							options: ['elle a', 'il y a', 'à'],
							correct: 0,
							choses: ['aver-singular'],
							explain: 'Après une personne, *a* veut dire « il ou elle a » : *Inès a*, Inès a. Devant une ville, c’est « à » : *a Barcelona*.'
						},
						{
							q: '*I a sèt galinas.* *I a* veut dire…',
							options: ['il y a', 'elle a', 'j’ai'],
							correct: 0,
							choses: ['i-a'],
							explain: '*I a* : il y a, « ya ». Pas besoin de *el* ni de *ela*.'
						},
						{
							q: '*Ai pas de sòrre* : après *pas*, on dit…',
							options: ['de', 'una'],
							correct: 0,
							oc: true,
							noShuffle: true,
							choses: ['ai-pas-de'],
							explain: '*Ai una sòrre*, mais *Ai pas de sòrre* : après *pas*, on dit *de*. Comme en français : « je n’ai pas de sœur ».'
						},
						{
							q: '*un can*, mais *una cata* : on dit *una* devant…',
							options: ['un mot féminin', 'un mot masculin'],
							correct: 0,
							noShuffle: true,
							choses: ['un-una-article'],
							explain: '*un* devant un mot masculin, *una* devant un mot féminin : comme le nombre 1, *un, una*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Avoir, à côté d’être',
					intro: 'Avoir, c’est la forme du jour. Être, tu le connais depuis l’unité 1.',
					head: ['', 'avoir', 'être'],
					rows: [
						['*ieu* (moi)', '*ai* · *Ai un can.*', '*soi* · *Soi de Tolosa.*'],
						['*tu* (toi)', '*as* · *As un cat ?*', '*siás* · *D’ont siás ?*'],
						['*el, ela* (lui, elle)', '*a* · *Inès a una cata.*', '*es* · *Es mon cosin.*']
					],
					notes: [
						'La forme dit déjà qui parle : pas besoin de *ieu* ou de *tu*. *Ai un can* suffit.',
						'*As de fraires ?* : as-tu des frères ? Ici, *de* veut dire « des ».',
						'*I a* : il y a. *I a un caval*, *i a pas de cat*.',
						'*un, una* : comme le nombre 1. *un can*, *una cata*.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/2) : avoir, il y a',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'aver-singular', oc: 'aver : ai · as · a', sound: 'a-BÉ : AÏ · AS · A', fr: 'avoir : j’ai · tu as · il ou elle a' },
						{ id: 'un-una-article', oc: 'un fraire · una sòrre', sound: 'un FRAÏ-ré · U-no SÒ-rré', fr: 'un frère · une sœur (*un, una* : comme le nombre 1)' },
						{ id: 'i-a', oc: 'I a… · I a pas de…', sound: 'YA · ya PAS dé', fr: 'il y a… · il n’y a pas de…' },
						{ id: 'ai-pas-de', oc: 'Ai pas de can.', sound: 'aï PAS dé CA', fr: 'je n’ai pas de chien. (après *pas*, on dit *de*)' }
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// Jeu prévu par la carte : les anagrammes (à coder : des tuiles de lettres
		// qui se collent sans espace pour former le mot). Version simple : les
		// lettres en tuiles du bloc « order », la réponse s'affiche « c a n ».
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 12,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (2/2) : les bêtes de la ferme',
					intro: 'Ça sonne comme : la syllabe forte en capitales.',
					items: [
						{ id: 'lo-can', oc: 'lo can', sound: 'lou CA', fr: 'le chien' },
						{ id: 'lo-cat', oc: 'lo cat · la cata', sound: 'lou CAT · la CA-to', fr: 'le chat · la chatte' },
						{ id: 'l-aucel', oc: 'l’aucèl', sound: 'laou-SÈL', fr: 'l’oiseau' },
						{ id: 'lo-caval', oc: 'lo caval', sound: 'lou ca-BAL', fr: 'le cheval' },
						{ id: 'la-galina', oc: 'la galina', sound: 'la ga-LI-no', fr: 'la poule' }
					]
				},
				{
					type: 'qcm',
					title: 'Qui fait ce bruit ?',
					intro: 'Dans la cour de Papeta, chaque *bèstia* (chaque bête) parle à sa façon. Qui fait ce bruit ?',
					glosa: { bèstia: 'bête, animal', 'lo gos': 'le chien (on dit aussi)' },
					items: [
						{
							q: '« Ouaf ! Ouaf ! »',
							options: ['lo can', 'lo cat', 'la galina'],
							correct: 0,
							oc: true,
							choses: ['lo-can'],
							explain: '*lo can* : le chien. En languedocien, on dit aussi *lo gos*.'
						},
						{
							q: '« Miaou ! »',
							options: ['la cata', 'lo caval', 'l’aucèl'],
							correct: 0,
							oc: true,
							choses: ['lo-cat'],
							explain: '*la cata* : la chatte. Le mâle, c’est *lo cat*.'
						},
						{
							q: '« Cot, cot, codet ! »',
							options: ['la galina', 'lo can', 'lo cat'],
							correct: 0,
							oc: true,
							choses: ['la-galina'],
							explain: '*la galina* : la poule.'
						},
						{
							q: '« Cui-cui ! »',
							options: ['l’aucèl', 'la cata', 'lo caval'],
							correct: 0,
							oc: true,
							choses: ['l-aucel'],
							explain: '*l’aucèl* : l’oiseau.'
						},
						{
							q: '« Hiii ! » (il hennit)',
							options: ['lo caval', 'lo can', 'la galina'],
							correct: 0,
							oc: true,
							choses: ['lo-caval'],
							explain: '*lo caval* : le cheval, « lou ca-BAL ».'
						}
					]
				},
				{
					type: 'order',
					title: 'Les anagrammes',
					intro: 'Les lettres sont mélangées : touche-les dans l’ordre pour retrouver le mot.',
					// Les lettres des tuiles ne sont pas des mots : déclarées ici pour le contrôle.
					glosa: { 'c a n t v l u è g i s ò r e f': 'les lettres des anagrammes' },
					items: [
						{
							prompt: 'Il aboie.',
							tiles: ['c', 'a', 'n'],
							choses: ['lo-can'],
							explain: '*can* : le chien, *lo can*.'
						},
						{
							prompt: 'Elle miaule.',
							tiles: ['c', 'a', 't', 'a'],
							choses: ['lo-cat'],
							explain: '*cata* : la chatte, *la cata*.'
						},
						{
							prompt: 'On monte dessus.',
							tiles: ['c', 'a', 'v', 'a', 'l'],
							choses: ['lo-caval'],
							explain: '*caval* : le cheval. Le « v » sonne « b » : « ca-BAL ».'
						},
						{
							prompt: 'Il vole.',
							tiles: ['a', 'u', 'c', 'è', 'l'],
							choses: ['l-aucel'],
							explain: '*aucèl* : l’oiseau, avec un accent grave sur le « è ».'
						},
						{
							prompt: 'Elle pond des œufs.',
							tiles: ['g', 'a', 'l', 'i', 'n', 'a'],
							choses: ['la-galina'],
							explain: '*galina* : la poule.'
						},
						{
							prompt: 'la sœur',
							tiles: ['s', 'ò', 'r', 'r', 'e'],
							choses: ['la-sorre'],
							explain: '*sòrre* : la sœur, avec deux « r ».'
						},
						{
							prompt: 'le frère',
							tiles: ['f', 'r', 'a', 'i', 'r', 'e'],
							choses: ['lo-fraire'],
							explain: '*fraire* : le frère, « FRAÏ-ré ».'
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
						'Parle de toi, ou d’un personnage inventé : c’est toi qui choisis. Si ton animal n’est pas dans la liste : *un conilh* (un lapin), *un peis* (un poisson). Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					glosa: { conilh: 'lapin', peis: 'poisson' },
					items: [
						{ consigne: 'Demande à Núria : « As-tu un chien ? »', answers: ['As un can ?'], choses: ['aver-singular', 'lo-can'] },
						{ consigne: 'Réponds : « Non, je n’ai pas de chien. »', answers: ['Non, ai pas de can.'], choses: ['ai-pas-de'] },
						{ consigne: 'Papeta montre la cour : « Il y a un cheval. »', answers: ['I a un caval.'], choses: ['i-a', 'lo-caval', 'un-una-article'] },
						{ consigne: 'Il n’y a pas de chat.', answers: ['I a pas de cat.'], choses: ['i-a', 'lo-cat'] },
						{ consigne: 'Inès a une chatte.', answers: ['Inès a una cata.'], choses: ['aver-singular', 'un-una-article', 'lo-cat'] },
						{ consigne: 'J’ai une sœur et deux frères.', answers: ['Ai una sòrre e dos fraires.'], choses: ['un-una-article', 'la-sorre', 'lo-fraire'] },
						{
							consigne: 'As-tu des frères ou des sœurs ? Réponds pour toi, ou pour un personnage inventé.',
							debut: ['Òc, ai', 'Non, ai pas de', 'Ai'],
							choses: ['aver-singular', 'ai-pas-de'],
							explain: 'Par exemple : *Òc, ai un fraire.* ou *Non, ai pas de sòrre.*'
						},
						{
							consigne: 'As-tu un animal ? Dis-le, ou invente-le.',
							debut: ['Ai un', 'Ai una', 'Ai pas de', 'I a'],
							choses: ['aver-singular', 'un-una-article'],
							explain: 'Par exemple : *Ai una cata.* ou *Ai pas de can, mas ai un peis.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Je n’ai pas de chien, mais j’ai une chatte.',
							tiles: ['Ai', 'pas', 'de', 'can,', 'mas', 'ai', 'una', 'cata.'],
							choses: ['ai-pas-de', 'lo-can', 'lo-cat'],
							explain: '*Ai pas de can* : après *pas*, on dit *de*.'
						},
						{
							prompt: 'Il y a une poule et un oiseau.',
							tiles: ['I', 'a', 'una', 'galina', 'e', 'un', 'aucèl.'],
							choses: ['i-a', 'la-galina', 'l-aucel', 'un-una-article'],
							explain: '*una galina* (un mot féminin), *un aucèl* (un mot masculin).'
						},
						{
							prompt: 'Núria, as-tu des frères ?',
							tiles: ['Núria,', 'as', 'de', 'fraires', '?'],
							choses: ['aver-singular', 'lo-fraire'],
							explain: '*As de fraires ?* : c’est le titre du module.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Choisis une personne, vraie ou inventée : dis ce qu’elle a, et ce qu’elle n’a pas. Puis compare au modèle.',
					items: [
						{
							q: 'Trois phrases sur une personne : frères, sœurs, animaux.',
							a: 'Par exemple : *Inès a dotze ans. A un fraire, Karim. A pas de can, mas a una cata, Mimí.*'
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
					title: 'Le son du jour : le n final',
					paragraphs: [
						'À la fin d’un mot, le « n » s’efface le plus souvent : *can* se dit « CA », *plan* « PLA », *deman* « dé-MA ».',
						'Tu l’entends depuis l’unité 1 : *Va plan*, *A deman*. Et dans *catalan*, « ca-ta-LA ».',
						'Écoute, puis répète : *lo can*, *Va plan*, *A deman*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*lo can* se dit…',
							options: ['lou CA', 'lou CAN'],
							correct: 0,
							noShuffle: true,
							explain: '« lou CAN », c’est la lecture à la française. En occitan, le « n » final s’efface : « lou CA ».'
						},
						{
							q: '*catalan* se dit…',
							options: ['ca-ta-LA', 'ca-ta-LAN'],
							correct: 0,
							noShuffle: true,
							explain: 'Le « n » final s’efface : « ca-ta-LA ». Au féminin, il revient : *catalana*, « ca-ta-LA-no ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis à voix haute : *Ai un can.* *Va plan.* *A deman !*',
							a: '« aï un CA », « ba PLA », « a dé-MA ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : une chanson de famille',
					glosa: { marida: 'marie (donne en mariage)' },
					paragraphs: [
						'Le groupe La Talvera, du Tarn, chante *Mon paire me marida* (mon père me marie) : une chanson courte, où tu reconnaîtras *paire* et *filha*.',
						'À écouter sur Deezer : www.deezer.com/track/2569812'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra dans ton carnet.',
					items: [
						'dire si j’ai des frères, des sœurs, des animaux : *Ai un fraire*, *Ai pas de can*',
						'demander à quelqu’un ce qu’il a : *As un cat ?*',
						'dire ce qu’il y a : *I a un caval*',
						'choisir entre *un* et *una*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire ce que tu as, et ce qu’il y a autour de toi.',
						'Si tu en as envie : présente ton animal à une personne proche, vrai ou rêvé, *Ai un can*… ou, si tu n’en as pas : *Ai pas de can.* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
