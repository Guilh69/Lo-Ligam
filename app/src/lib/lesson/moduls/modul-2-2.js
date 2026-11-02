// Module 2.2 · A1 · « Parlas occitan ? » : unité 2 (Parlas occitan ?), rédigé
// par Claude le 2026-11-01 sur le modèle de l'unité 1. Chemin commun :
// 1 révision du jour · 2 Escota · 3 Obsèrva · 4 Lo jòc del jorn · 5 A tu ! ·
// 6 Lo son e lo bilanç. Forme du jour : parlar et compréner au singulier, et
// la négation non… pas. Encadrés « À retenir » repris tels quels de
// Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/lexic-A1.md (2.2).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès, à valider par Romain.

export const modul22 = {
	id: 'modul-2-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '2-2',
	unitat: 'Unitat 2 · Parlas occitan ?',
	nivel: 'A1 · Modul 2.2',
	oc: 'Parlas occitan ?',
	fr: 'Parles-tu occitan ? Dire les langues qu’on parle et qu’on comprend',
	cando:
		'Je peux dire quelles langues je parle ou je comprends, un peu ou bien, dire ce que je ne parle pas, et poser la question à quelqu’un.',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Núria', 'Karim', 'Giulia', 'Marià', 'Loís', 'Pèire', 'Magali', 'Lisa'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Marià tutoie Giulia (*D’ont siás ?*), car le « vous » de *èsser* (*sètz*) n’est pas encore appris ; la scène dit qu’elle tutoie volontiers les jeunes. Ça te va ?',
		'Jeu « l’oreille des pays » : gascon *Adiu* « a-DIOU » et *un chic* « un TCHIK » ; provençal *Parles* « PAR-lés » et *fòrça ben* « FÒR-so BÈN ». Ces formes et ces sons te vont ?',
		'*compren* « coum-PRÉ(N) », le *n* final léger, comme le lexique : bon pour l’enregistrement ?',
		'*compréner* s’écrit avec l’accent, comme dans la grammaire de référence (p20, p94) : ton choix du 2026-11-02 ; le son ne change pas. À relire.',
		'La chanson de Claudi Martí : on traduit seulement le titre (« pourquoi ne m’a-t-on pas dit ? »), sans décrire la chanson, dont le sens n’est pas vérifié. Ça te va ?',
		'⚠️ *perqué*, dans ce titre : l’API a planté deux fois (erreur d’appel, pas une absence). C’est le titre exact de la chanson : on le garde tel quel ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 2.1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: 'Une femme de Barcelone dit : *Soi…*',
							options: ['catalana', 'catalan', 'italiana'],
							correct: 0,
							oc: true,
							choses: ['catalan-catalana'],
							explain: 'Une femme : *catalana*, avec le *-a*.'
						},
						{
							q: 'Pour montrer un homme : *… es portugués.*',
							options: ['El', 'Ela', 'Òc'],
							correct: 0,
							oc: true,
							choses: ['el-ela'],
							explain: '*El* : lui, il. *Ela* : elle.'
						},
						{
							q: 'On demande à Lisa *Siás occitana ?* Elle est de Nîmes, et elle se sent occitane. Elle répond :',
							options: ['Òc, soi occitana.', 'Non, soi occitana.', 'Òc, soi occitan.'],
							correct: 0,
							oc: true,
							choses: ['oc-non', 'occitan-occitana'],
							explain: '*Òc* (oui), puis le féminin : *occitana*.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{ consigne: 'Elle est italienne.', answers: ['Es italiana.', 'Ela es italiana.'], choses: ['italian-italiana'] },
						{ consigne: 'Il est marocain.', answers: ['Es marroquin.', 'El es marroquin.'], choses: ['marroquin-marroquina'] }
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
					title: 'Les langues de la foire',
					intro:
						'Toujours à la *fièra*. Karim demande à Núria si elle parle occitan. Plus loin, Marià fait connaissance avec Giulia. Lis une première fois pour répondre à une seule question : qui parle le mieux occitan, Núria ou Giulia ?',
					scenes: [
						{
							title: 'Núria e Karim',
							subtitle: '(Karim et Núria, qui se tutoient)',
							lines: [
								{ oc: 'Núria, parlas occitan ?', sound: 'NOU-ria, PAR-los ou-tsi-TA ?', fr: 'Núria, tu parles occitan ?' },
								{ oc: 'Un pauc. Parli catalan e espanhòl.', sound: 'un PAOUK. PAR-li ca-ta-LA é es-pa-GNÒL.', fr: 'Un peu. Je parle catalan et espagnol.' },
								{ oc: 'Ieu, non parli pas catalan…', sound: 'YÉOU, nou PAR-li PAS ca-ta-LA…', fr: 'Moi, je ne parle pas catalan…' },
								{ oc: 'Mas comprenes un pauc ?', sound: 'mas coum-PRÉ-nés un PAOUK ?', fr: 'Mais tu comprends un peu ?' },
								{ oc: 'Òc, compreni un pauc. E tu ?', sound: 'OK, coum-PRÉ-ni un PAOUK. é TU ?', fr: 'Oui, je comprends un peu. Et toi ?' },
								{ oc: 'Ieu ? Compreni plan !', sound: 'YÉOU ? coum-PRÉ-ni PLA !', fr: 'Moi ? Je comprends bien !' }
							]
						},
						{
							title: 'Marià e Giulia',
							subtitle: '(Marià tutoie volontiers les jeunes)',
							lines: [
								{ oc: 'Adieu ! D’ont siás ?', sound: 'a-DIOU ! doun SYOS ?', fr: 'Salut ! D’où es-tu ?' },
								{ oc: 'Soi italiana.', sound: 'souï i-ta-LYA-no.', fr: 'Je suis italienne.' },
								{ oc: 'Italiana ? E parlas occitan ?', sound: 'i-ta-LYA-no ? é PAR-los ou-tsi-TA ?', fr: 'Italienne ? Et tu parles occitan ?' },
								{ oc: 'Òc ! Parli occitan e italian, e un pauc francés.', sound: 'OK ! PAR-li ou-tsi-TA é i-ta-LYA, é un PAOUK fran-SÉS.', fr: 'Oui ! Je parle occitan et italien, et un peu français.' },
								{ oc: 'E Núria, parla occitan tanben ?', sound: 'é NOU-ria, PAR-lo ou-tsi-TA tam-BÉ ?', fr: 'Et Núria, elle parle occitan aussi ?' },
								{ oc: 'Un pauc. Mas compren plan.', sound: 'un PAOUK. mas coum-PRÉ(N) PLA.', fr: 'Un peu. Mais elle comprend bien.' },
								{ oc: 'Plan ! Es la lenga del país.', sound: 'PLA ! és la LÉN-go dél pa-ÍS.', fr: 'Bien ! C’est la langue du pays.' }
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
							q: 'Qui parle le mieux occitan, Núria ou Giulia ?',
							options: ['Giulia', 'Núria', 'aucune des deux'],
							correct: 0,
							noShuffle: true,
							explain: 'Giulia : *Parli occitan e italian.* Núria le parle *un pauc* (un peu), mais elle *compren plan* (elle comprend bien).'
						},
						{
							q: 'Karim et le catalan :',
							options: ['il ne le parle pas, mais il le comprend un peu', 'il le parle un peu', 'il le parle bien'],
							correct: 0,
							choses: ['pas', 'comprene-singular', 'un-pauc-plan'],
							explain: '*Non parli pas catalan…* puis *Òc, compreni un pauc.*'
						},
						{
							q: 'Marià demande : *E Núria, parla occitan tanben ?* Ici, *tanben* veut dire…',
							options: ['aussi', 'bien', 'un peu'],
							correct: 0,
							choses: ['tanben'],
							explain: '*tanben* : aussi. *plan* : bien. *un pauc* : un peu.'
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
					title: 'La fin du verbe dit qui parle',
					intro: 'Comme pour *soi*, *siás*, *es* (module 1.3) : pas de « je » ni de « tu », la fin du verbe suffit.',
					items: [
						{
							q: '*Parli catalan.* Qui parle ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 0,
							noShuffle: true,
							choses: ['parlar-singular'],
							explain: 'La fin en *-i* : « je ». *Parli* : je parle.'
						},
						{
							q: '*Mas comprenes un pauc ?* Qui comprend ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 1,
							noShuffle: true,
							choses: ['comprene-singular'],
							explain: 'La fin en *-es* : « tu ». *Comprenes* : tu comprends.'
						},
						{
							q: '*Mas compren plan.* Qui comprend ?',
							options: ['je', 'tu', 'il ou elle'],
							correct: 2,
							noShuffle: true,
							choses: ['comprene-singular'],
							explain: 'Ni *-i* ni *-es* : « il » ou « elle ». *Compren* : elle comprend (Núria).'
						},
						{
							q: '*Ieu, non parli pas catalan.* Quels mots disent « ne… pas » ?',
							options: ['non… pas', 'pas', 'Ieu… pas'],
							correct: 0,
							oc: true,
							choses: ['pas'],
							explain: 'Deux mots : *non* devant le verbe, *pas* après.'
						},
						{
							q: '*Un pauc. Mas compren plan.* Ici, *mas* veut dire…',
							options: ['mais', 'aussi', 'bien'],
							correct: 0,
							choses: ['mas'],
							explain: '*mas* : mais. Elle parle un peu, mais elle comprend bien.'
						},
						{
							q: '*Es la lenga del país.* *La lenga*, c’est…',
							options: ['la langue', 'la ville', 'le pays'],
							correct: 0,
							choses: ['la-lenga'],
							explain: '*la lenga* : la langue. *la vila* : la ville. *lo país* : le pays.'
						}
					]
				},
				{
					type: 'table',
					title: 'Deux verbes, au singulier',
					head: ['', 'parler', 'comprendre'],
					rows: [
						['je', '*parli*', '*compreni*'],
						['tu', '*parlas*', '*comprenes*'],
						['il, elle', '*parla*', '*compren*']
					],
					notes: [
						'Comme *soi*, *siás*, *es* : pas besoin de « je » ni de « tu ». On ajoute *ieu* ou *tu* seulement pour insister : *Ieu, non parli pas catalan.*',
						'Pour dire « ne… pas » : *non* devant le verbe, *pas* après : *Non parli pas anglés.*',
						'À l’oral, on entend souvent *pas* tout seul : *Parli pas anglés.* C’est la forme familière ; ici, on apprend la forme complète, avec *non*.',
						'La langue porte le nom du masculin : *Parli francés.* · *Parla italian.*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (1/2)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'parlar-singular', oc: 'parlar : parli · parlas · parla', sound: 'par-LA : PAR-li · PAR-los · PAR-lo', fr: 'parler : je parle · tu parles · il ou elle parle' },
						{ id: 'comprene-singular', oc: 'compréner : compreni · comprenes · compren', sound: 'coum-PRÉ-né : coum-PRÉ-ni · coum-PRÉ-nés · coum-PRÉ(N)', fr: 'comprendre : je comprends · tu comprends · il ou elle comprend' },
						{ id: 'pas', oc: 'Non parli pas… · Non compreni pas.', sound: 'nou PAR-li PAS · nou coum-PRÉ-ni PAS', fr: 'je ne parle pas… · je ne comprends pas. (*non* devant le verbe, *pas* après)' }
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
					intro: 'Quatre petits mots, puis le jeu.',
					items: [
						{ id: 'un-pauc-plan', oc: 'un pauc · plan', sound: 'un PAOUK · PLA', fr: 'un peu · bien (*Parli un pauc occitan. Compreni plan.*)' },
						{ id: 'mas', oc: 'mas', sound: 'MAS', fr: 'mais (*Compreni, mas non parli pas.*)' },
						{ id: 'tanben', oc: 'tanben', sound: 'tam-BÉ', fr: 'aussi (*Parli tanben catalan.*)' },
						{ id: 'la-lenga', oc: 'la lenga', sound: 'la LÉN-go', fr: 'la langue' }
					]
				},
				// jeu prévu par la carte : l'oreille des pays, la même phrase en gascon,
				// en provençal et en languedocien, à l'oreille (à coder avec les voix) ;
				// version simple : à l'écrit, en qcm. Formes des autres dialectes :
				// cursus/alhors-en-occitania-A1.md.
				{
					type: 'qcm',
					title: 'L’oreille des pays',
					intro:
						'L’occitan se parle en six grandes variétés : gascon, languedocien (celui de ce cours), provençal, vivaro-alpin, auvergnat et limousin, sans frontière nette entre elles. À la *fièra*, Pèire vient de Pau, en Gascogne, Magali d’Arles, en Provence, et Loís est d’ici. Lis ce qu’ils disent, et trouve comment on le dit chez toi. (Source : Jean Sibille, « L’occitan : qu’es aquò ? », Langues et cité, 2007.)',
					glosa: { adiu: 'salut (gascon)', 'un chic': 'un peu (gascon)', parles: 'tu parles (provençal)', 'fòrça ben': 'très bien (provençal)' },
					items: [
						{
							ditz: { qui: 'Pèire, de Pau (gascon)', oc: 'Adiu ! Parlas occitan ?' },
							q: 'Chez toi, la même phrase se dit :',
							options: ['Adieu ! Parlas occitan ?', 'A deman ! Parlas occitan ?', 'Adieu ! Siás occitan ?'],
							correct: 0,
							oc: true,
							choses: ['parlas-occitan'],
							explain: '*Adiu* (salut, en gascon) se dit « a-DIOU », comme ton *Adieu*. Et *Parlas occitan ?* est pareil chez lui et chez toi.'
						},
						{
							ditz: { qui: 'Magali, d’Arles (provençal)', oc: 'Adieu ! Parles occitan ?' },
							q: 'Chez toi, la même phrase se dit :',
							options: ['Adieu ! Parlas occitan ?', 'Adieu ! Parli occitan.', 'Adieu ! Parla occitan.'],
							correct: 0,
							oc: true,
							choses: ['parlar-singular'],
							explain: '*Parles* « PAR-lés » : « tu parles », en provençal. Chez toi : *parlas*. *Parli*, c’est « je parle » ; *parla*, « il ou elle parle ».'
						},
						{
							ditz: { qui: 'Loís, d’ici (languedocien)', oc: 'Òc, parli plan occitan, e francés tanben !' },
							q: 'Loís leur répond. Il parle…',
							options: ['bien occitan, et français aussi', 'un peu occitan, et français aussi', 'bien occitan, mais pas français'],
							correct: 0,
							choses: ['un-pauc-plan', 'tanben'],
							explain: '*plan* : bien. Pèire le dit comme toi, en gascon ; Magali dirait *ben*. Et *tanben* : aussi.'
						},
						{
							ditz: { qui: 'Pèire', oc: 'Un chic.' },
							q: 'Loís lui a demandé s’il comprend Magali. Pèire fait le geste « comme ci, comme ça ». Chez toi, il dirait :',
							options: ['Un pauc.', 'Plan !', 'Non.'],
							correct: 0,
							oc: true,
							choses: ['un-pauc-plan'],
							explain: '*Un chic* « un TCHIK » : un peu, en gascon. Chez toi : *un pauc*.'
						},
						{
							ditz: { qui: 'Magali', oc: 'Fòrça ben !' },
							q: 'Et Magali, comprend-elle Pèire ? Elle le comprend…',
							options: ['très bien', 'un peu', 'pas du tout'],
							correct: 0,
							noShuffle: true,
							choses: ['un-pauc-plan'],
							explain: '*Fòrça ben* « FÒR-so BÈN » : très bien, en provençal. Chez toi, tu dirais *Compreni plan.*'
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
						'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Dis une langue que tu parles : *Parli…*',
							debut: ['Parli'],
							choses: ['parlar-singular'],
							explain: 'Le nom de la langue, au masculin : *Parli francés.*'
						},
						{
							consigne: 'Dis une langue que tu ne parles pas.',
							debut: ['Non parli pas'],
							choses: ['pas', 'parlar-singular'],
							explain: '*non* devant le verbe, *pas* juste après : *Non parli pas italian.*'
						},
						{
							consigne: 'Et l’occitan ? Dis si tu le comprends un peu, ou bien.',
							answers: ['Compreni un pauc.', 'Compreni plan.'],
							debut: ['Compreni un pauc', 'Compreni plan', 'Parli un pauc', 'Parli plan'],
							choses: ['un-pauc-plan', 'comprene-singular'],
							explain: '*Compreni un pauc.* · *Compreni plan.* Et si tu veux, avec la langue : *Parli un pauc occitan.*'
						},
						{
							consigne: 'Dis une autre langue que tu parles aussi : *Parli tanben…*',
							debut: ['Parli tanben'],
							choses: ['tanben'],
							explain: 'Par exemple : *Parli tanben anglés.*'
						},
						{
							consigne: 'Je comprends, mais je ne parle pas.',
							answers: ['Compreni, mas non parli pas.'],
							choses: ['mas', 'pas', 'comprene-singular']
						},
						{ consigne: 'Demande à Núria si elle comprend.', answers: ['Comprenes ?'], choses: ['comprene-singular'] }
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Giulia parle occitan, italien et un peu français.',
							tiles: ['Giulia', 'parla', 'occitan,', 'italian', 'e', 'un', 'pauc', 'francés.'],
							choses: ['parlar-singular', 'un-pauc-plan'],
							explain: '*parla* : elle parle. *un pauc* se place devant la langue.'
						},
						{
							prompt: 'C’est la langue du pays !',
							tiles: ['Es', 'la', 'lenga', 'del', 'país !'],
							choses: ['la-lenga'],
							explain: '*la lenga* : la langue. *del país* : du pays (module 1.3).'
						},
						{
							prompt: 'Je ne parle pas catalan, mais je comprends un peu.',
							tiles: ['Non', 'parli', 'pas', 'catalan,', 'mas', 'compreni', 'un', 'pauc.'],
							choses: ['pas', 'mas', 'comprene-singular'],
							explain: '*pas* après *parli* ; puis *mas* (mais).'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un que tu connais',
					intro:
						'Dis à voix haute les langues d’une personne que tu connais : ce qu’elle parle, un peu ou bien, et ce qu’elle ne parle pas. Puis compare au modèle.',
					items: [
						{
							q: 'Une amie, ton grand-père, une collègue…',
							a: 'Par exemple : *Es Karim. Parla francés e occitan. Non parla pas catalan, mas compren un pauc.*'
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
					title: 'Le son du jour : é et è',
					paragraphs: [
						'L’accent aigu ferme le *e* : *francés* « fran-SÉS », *mercés* « mér-SÉS ». L’accent grave l’ouvre : *Besièrs* « bé-ZYÈS », *lèu* « LÈOU ».',
						'Sans accent, le *e* reste fermé : *deman* « dé-MA », *comprenes* « coum-PRÉ-nés ».',
						'Répète à voix haute : *francés*, *Besièrs*, *mercés*, *lèu*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Besièrs* se dit…',
							options: ['bé-ZYÈS', 'bé-ZYÉ'],
							correct: 0,
							noShuffle: true,
							explain: 'Accent grave : *è* ouvert. Et le *s* final se dit, à la différence du nom français, Béziers.'
						},
						{
							q: '*Francés* se dit…',
							options: ['fran-SÉS', 'fran-SÈ'],
							correct: 0,
							noShuffle: true,
							explain: 'Accent aigu : *é* fermé. Et là aussi, le *s* final se dit.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					items: [
						{
							q: 'Dis cette suite à voix haute, en marquant bien la différence : *francés*, *Besièrs*, *mercés*, *lèu*. Puis regarde.',
							a: 'Fermé, ouvert, fermé, ouvert : « fran-SÉS », « bé-ZYÈS », « mér-SÉS », « LÈOU ».'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : une chanson de Claudi Martí',
					glosa: { 'perqué m’an pas dit': 'pourquoi ne m’a-t-on pas dit', 'nòva cançon': 'nouvelle chanson', retorn: 'retour' },
					// Lien d'écoute affiché par NoteBlock. Chanson donnée par son lien
					// seulement (cursus/cultura-A1.md, unité 2 : année et sens non vérifiés).
					lien: { href: 'https://www.deezer.com/track/3277993551', texte: 'Écouter sur Deezer' },
					paragraphs: [
						'Claudi Martí, né à Carcassonne en 1940, a été instituteur à Couffoulens, dans l’Aude. C’est une voix de la *Nòva cançon* (la nouvelle chanson occitane).',
						'Écoute sa chanson *Perqué m’an pas dit ?* (pourquoi ne m’a-t-on pas dit ?) : dans le titre, tu reconnais *pas*, sans *non* : la forme familière. Pour l’écouter : la version de 2023, dans l’album *Retorn* (retour), sur Deezer. Source : Wikipédia, article « Martí (chanteur occitan) ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire les langues que je parle, un peu ou bien',
						'dire ce que je ne parle pas, ou ne comprends pas, avec *non… pas*',
						'demander à quelqu’un s’il parle ou comprend une langue',
						'reconnaître la même question en gascon et en provençal'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire quelles langues tu parles, et lesquelles tu comprends.',
						'Si tu en as envie : demande *Parlas occitan ?* à un ami, ou dis *Parli un pauc occitan* à quelqu’un de ta famille qui le parle. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
