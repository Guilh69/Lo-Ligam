// Module 6.4 · A1 · « E ta jornada ? » : la tâche de l'unité 6 (La jornada),
// rédigée par Claude le 2026-11-02 sur le modèle de 4.4 (même chemin en six
// étapes ; règles communes : cursus/regles-redaccion-A1.md).
// Rien de nouveau : on assemble 6.1 à 6.3, les verbes en -ar (4.1), les jours
// (4.3), la famille (3.2) et la météo (6.2) pour raconter sa journée type en
// dix phrases. Les repas restent à je et à il ou elle ; Vau al trabalh, Vau al
// lièch, à je seulement (anar au singulier : unité 8).
// Scène : le soir du dimanche de neige, chez Yasmine ; Lisa raconte son lundi
// à Montpellier (Lisa : ingénieure, vit avec sa mère et son frère, unité 3).
// Jeu du jour : dialogue à choix (causida) avec Karim, avec un tour « rester en
// occitan » (règle 13). Le jeu prévu par la carte (parler 40, puis 30, puis
// 20 secondes) demande ton propre récit : il vient à l'étape 5, après
// l'écriture (chronomètre à coder).
// Fin du module : le mémo de l'unité, puis l'encart Alhors en Occitània
// (repris tel quel de cursus/alhors-en-occitania-A1.md).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique), à valider par Romain.

export const modul64 = {
	id: 'modul-6-4',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '6-4',
	unitat: 'Unitat 6 · La jornada',
	nivel: 'A1 · Modul 6.4 · la tâche',
	oc: 'E ta jornada ?',
	fr: 'Et ta journée ? Raconter sa journée type en dix phrases',
	cando:
		'Je peux raconter ma journée type en dix phrases, du lever au coucher, avec le temps qu’il fait, puis la redire de plus en plus vite.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Lisa', 'Yasmine', 'Núria', 'Karim', 'Inès'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'L’intrus (étape 1) : quatre séries de quatre mots, faites avec les mots de l’unité. Chaque famille doit être nette et l’intrus plausible : dis si une série a deux réponses possibles.',
		'Titre du module : *E ta jornada ?* (et ta journée ?), comme le propose le lexique. Ça te va ?',
		'Tour « rester en occitan » : Karim passe au français ; la bonne réplique est *Cossí se ditz en occitan ?* (2.3), sans le mot au milieu. Naturel ?',
		'*Lo tantòst, trabalhi totjorn !* (l’après-midi, je travaille toujours) : *totjorn* au sens de « encore », comme en français. D’accord ?',
		'La tâche : dix phrases sur sa journée type, à raconter au prof au prochain cours en visio, ou à une personne qui apprend l’occitan. Ça te va ?',
		'Le défi du chronomètre (40, 30, puis 20 secondes), avec le minuteur du téléphone en attendant un chronomètre dans la page : d’accord ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 7,
			blocks: [
				{
					type: 'qcm',
					title: 'Toute l’unité, en désordre',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '*A quina ora te lèvas ?* Tu réponds :',
							options: ['Me lèvi a sèt oras.', 'Se lèva a sèt oras.', 'Son sèt oras.'],
							correct: 0,
							oc: true,
							choses: ['me-levi'],
							explain: '*Me lèvi* : je me lève. *Se lèva*, c’est il ou elle ; *Son sèt oras*, c’est l’heure qu’il est.'
						},
						{
							q: 'Il fait chaud, et il y a du soleil :',
							options: ['Fa caud, e fa solelh.', 'Fa freg, e fa vent.', 'Plòu, e fa freg.'],
							correct: 0,
							oc: true,
							choses: ['fa-caud', 'fa-solelh'],
							explain: '*caud* : chaud ; *freg* : froid. Le soleil et le vent se disent avec *fa*.'
						},
						{
							q: '*Son dètz oras mens lo quart.* Il est…',
							options: ['9 h 45', '10 h 15', '10 h 45'],
							correct: 0,
							choses: ['e-quart'],
							explain: 'Dix heures moins le quart : 9 h 45. Pour 10 h 15 : *dètz oras e quart*.'
						}
					]
				},
				{
					// L’intrus (chantier 33, 07-11) : conçu avec lo Basic et sinonimes
					// (scripts/intrus-verificar.mjs), rien de leurs réponses n’est gardé.
					type: 'intrus',
					title: 'L’intrús (l’intrus)',
					intro: 'Quatre mots : trois font une famille, le quatrième n’a rien à faire là. Touche l’intrus.',
					items: [
						{
							mots: ['dejunar', 'dinnar', 'sopar', 'dançar'],
							intrus: 3,
							familha: 'les repas : le matin, à midi, le soir',
							choses: ['dejunar', 'dinnar', 'sopar', 'dancar'],
							explain: '*Dançar*, c’est danser : rien à manger !'
						},
						{
							mots: ['la pluèja', 'la nèu', 'lo vent', 'lo tantòst'],
							intrus: 3,
							familha: 'le temps qu’il fait',
							choses: ['la-plueja', 'la-neu', 'fa-vent', 'lo-tantost'],
							explain: '*Lo tantòst*, c’est l’après-midi.'
						},
						{
							mots: ['e mièja', 'e quart', 'mens lo quart', 'e tu'],
							intrus: 3,
							familha: 'pour dire l’heure',
							choses: ['e-mieja', 'e-quart', 'va-plan-e-tu'],
							explain: '*E tu*, c’est « et toi ».'
						},
						{
							mots: ['me lèvi', 'te lèvas', 'se lèva', 'me dison'],
							intrus: 3,
							familha: 'le verbe se lever',
							choses: ['me-levi', 'me-dison'],
							explain: '*Me dison* : « on m’appelle ».'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Le soir, je dîne, puis je vais au lit.',
							answers: ['Lo ser, sopi, puèi vau al lièch.', 'Lo ser, sopi, e puèi vau al lièch.'],
							choses: ['lo-ser', 'sopar', 'puei', 'vau-al-liech'],
							explain: '*sopi* : je dîne ; *puèi* : ensuite ; *Vau al lièch*, d’un bloc.'
						},
						{
							consigne: 'Aujourd’hui, il neige : j’aime la neige !',
							answers: ['Uèi, nèva : m’agrada la nèu !', 'Nèva, uèi : m’agrada la nèu !'],
							choses: ['uei', 'neva', 'm-agrada', 'la-neu'],
							explain: '*nèva* : il neige, en un seul mot ; *la nèu* : la neige. *M’agrada* : j’aime (unité 5).'
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
					title: 'La journée de Lisa',
					intro:
						'Le soir du dimanche de neige, chez Yasmine. Lisa, ingénieure à Montpellier, raconte sa journée à Yasmine et à Núria. Lis une première fois pour répondre à une seule question : quelles journées raconte-t-elle ?',
					scenes: [
						{
							title: 'Lo ser, al vilatge',
							subtitle: '(au coin du feu, chez Yasmine)',
							lines: [
								{ oc: 'E ta jornada, Lisa ? Lo diluns, a Montpelhièr ?', sound: 'é ta djour-NA-do, LI-za ? lou di-LUNS, a moun-pé-LYÈ ?', fr: 'Et ta journée, Lisa ? Le lundi, à Montpellier ?' },
								{ oc: 'Lo diluns ? Me lèvi a sièis oras e mièja. Dejuni, puèi vau al trabalh.', sound: 'lou di-LUNS ? mé LÈ-bi a SYÈÏ-zou-ros é MYÈ-djo. dé-DJU-ni, PUÈÏ baou al tra-BAL.', fr: 'Le lundi ? Je me lève à six heures et demie. Je prends mon petit déjeuner, puis je vais au travail.' },
								{ oc: 'A sièis oras e mièja ! E a miègjorn ?', sound: 'a SYÈÏ-zou-ros é MYÈ-djo ! é a myèd-DJOUR ?', fr: 'À six heures et demie ! Et à midi ?' },
								{ oc: 'A miègjorn, dinni. Lo tantòst, trabalhi totjorn !', sound: 'a myèd-DJOUR, DI-ni. lou tan-TÒST, tra-BA-lyi tout-DJOUR !', fr: 'À midi, je déjeune. L’après-midi, je travaille toujours !' },
								{ oc: 'E lo ser ?', sound: 'é lou SÉR ?', fr: 'Et le soir ?' },
								{ oc: 'Lo ser, sopi amb ma maire e mon fraire. A onze oras, vau al lièch.', sound: 'lou SÉR, SOU-pi am ma MAÏ-ré é moun FRAÏ-ré. a OUN-zé OU-ros, baou al LYÈTCH.', fr: 'Le soir, je dîne avec ma mère et mon frère. À onze heures, je vais au lit.' },
								{ oc: 'E uèi ?', sound: 'é UÈÏ ?', fr: 'Et aujourd’hui ?' },
								{ oc: 'Uèi ? Me lèvi a nòu oras ! Nèva, fa freg… e soi al vilatge !', sound: 'UÈÏ ? mé LÈ-bi a NÒOU OU-ros ! NÈ-bo, fa FRÉTCH… é souï al bi-LA-djé !', fr: 'Aujourd’hui ? Je me lève à neuf heures ! Il neige, il fait froid… et je suis au village !' },
								{ oc: 'E deman ?', sound: 'é dé-MA ?', fr: 'Et demain ?' },
								{ oc: 'Deman, es diluns : me lèvi a sièis oras e mièja…', sound: 'dé-MA, és di-LUNS : mé LÈ-bi a SYÈÏ-zou-ros é MYÈ-djo…', fr: 'Demain, c’est lundi : je me lève à six heures et demie…' }
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
							q: 'Quelles journées Lisa raconte-t-elle ?',
							options: ['son lundi à Montpellier, et ce dimanche au village', 'son samedi et son dimanche, au village', 'son lundi et son mardi, à Montpellier'],
							correct: 0,
							choses: ['diluns', 'la-jornada'],
							explain: '*Lo diluns*, chaque lundi, à Montpellier ; puis *uèi*, ce dimanche de neige au village.'
						},
						{
							q: 'Le lundi, Lisa se lève…',
							options: ['à six heures et demie', 'à neuf heures', 'à onze heures'],
							correct: 0,
							choses: ['me-levi', 'e-mieja'],
							explain: '*Me lèvi a sièis oras e mièja.* À neuf heures, c’est aujourd’hui, dimanche ; à onze heures, le lundi, elle va au lit.'
						},
						{
							q: 'Aujourd’hui, au village…',
							options: ['il neige, et il fait froid', 'il pleut, et il fait froid', 'il y a du soleil, mais du vent'],
							correct: 0,
							choses: ['neva', 'fa-freg'],
							explain: '*Nèva, fa freg… e soi al vilatge !*'
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
					title: 'Ta journée en dix phrases',
					intro: 'Le plan de ta tâche, phrase par phrase, avec la journée de Karim en exemple.',
					head: ['', 'pour dire…', 'Karim dit…'],
					rows: [
						['1', 'le jour, et ton lever', '*Lo diluns, me lèvi a cinc oras.*'],
						['2', 'le petit déjeuner', '*Dejuni.*'],
						['3', 'la suite du matin', '*Puèi, vau al trabalh.*'],
						['4', 'midi', '*A miègjorn, dinni a l’espital.*'],
						['5', 'l’après-midi', '*Lo tantòst, trabalhi totjorn.*'],
						['6', 'le soir', '*Lo ser, sopi a sèt oras.*'],
						['7', 'le coucher', '*A nòu oras, vau al lièch.*'],
						['8', 'une personne de ta famille', '*Inès se lèva a sèt oras.*'],
						['9', 'le temps d’aujourd’hui', '*Uèi, a Tolosa, fa vent.*'],
						['10', 'ce qui ne change pas', '*Totjorn, lo dimenge, jògui al rugbi.*']
					],
					notes: [
						'Pour toi : *me lèvi*, *dejuni*, *dinni*, *sopi*. Pour une autre personne : *se lèva*, *dejuna*, *dinna*, *sopa*.',
						'*Vau al trabalh*, *Vau al lièch* : pour toi seulement, pour l’instant. Les autres personnes de ce verbe viendront à l’unité 8.',
						'*puèi* relie deux moments ; *totjorn* dit ce qui ne change pas.'
					]
				},
				{
					type: 'qcm',
					title: 'Tu racontes',
					intro: 'Quelqu’un te dit sa journée ; toi, tu la racontes.',
					items: [
						{
							q: '*Me lèvi a sièis oras e mièja*, dit Lisa. Tu racontes :',
							options: ['Lisa se lèva a sièis oras e mièja.', 'Lisa me lèvi a sièis oras e mièja.', 'Lisa te lèvas a sièis oras e mièja.'],
							correct: 0,
							oc: true,
							choses: ['me-levi'],
							explain: '*me lèvi* (je) devient *se lèva* (elle) : le petit mot et la fin du verbe changent.'
						},
						{
							q: '*Dejuni*, dit Lisa. Tu racontes :',
							options: ['Lisa dejuna.', 'Lisa dejuni.', 'Lisa dinna.'],
							correct: 0,
							oc: true,
							choses: ['dejunar'],
							explain: '*dejuni* (je) devient *dejuna* (elle). *dinna*, c’est le repas de midi.'
						},
						{
							q: '*A miègjorn, dinni a l’espital*, dit Karim. Tu racontes :',
							options: ['A miègjorn, Karim dinna a l’espital.', 'A miègjorn, Karim dinni a l’espital.', 'A miègjorn, Karim sopa a l’espital.'],
							correct: 0,
							oc: true,
							choses: ['dinnar', 'miegjorn'],
							explain: '*dinni* (je) devient *dinna* (il). *sopa*, c’est le soir.'
						},
						{
							q: '*Lo ser, sopi a uèch oras*, dit Lisa. Tu racontes :',
							options: ['Lo ser, Lisa sopa a uèch oras.', 'Lo ser, Lisa sopi a uèch oras.', 'Lo ser, Lisa dejuna a uèch oras.'],
							correct: 0,
							oc: true,
							choses: ['sopar', 'lo-ser'],
							explain: '*sopi* (je) devient *sopa* (elle). *dejuna*, c’est le matin.'
						}
					]
				},
				{
					type: 'order',
					title: 'Raconte dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Le lundi, Lisa se lève à six heures et demie.',
							tiles: ['Lo', 'diluns,', 'Lisa', 'se', 'lèva', 'a', 'sièis', 'oras', 'e', 'mièja.'],
							choses: ['diluns', 'me-levi', 'e-mieja'],
							explain: '*Lo diluns* : chaque lundi. *se lèva* : elle se lève.'
						},
						{
							prompt: 'Aujourd’hui, il neige : je me lève à neuf heures !',
							tiles: ['Uèi,', 'nèva :', 'me', 'lèvi', 'a', 'nòu', 'oras !'],
							choses: ['uei', 'neva', 'me-levi'],
							explain: '*Uèi* ouvre la phrase ; *me lèvi* : je me lève.'
						}
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
				// jeu prévu par la carte : parler 40, puis 30, puis 20 secondes. Il
				// demande ton propre récit : il vient à l'étape 5, après l'écriture.
				// Ici, un dialogue à choix avec Karim, et un tour « rester en
				// occitan » (règle 13).
				{
					type: 'causida',
					title: 'Ta journée, au téléphone avec Karim',
					intro:
						'Karim t’appelle un soir : il veut tout savoir de ta journée. Choisis chaque réplique. Si elle ne va pas, on te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Karim',
					tours: [
						{
							situacion: 'Un soir de semaine, vers huit heures, Karim t’appelle.',
							ditz: 'Adieu ! Deman, me lèvi a cinc oras… E tu, a quina ora te lèvas ?',
							options: [
								{ oc: 'Me lèvi a sèt oras.', bon: true },
								{ oc: 'Se lèva a sèt oras.', reaccion: 'Karim s’étonne : qui ça, « il » ou « elle » ? Il te demandait ton heure à toi.' },
								{ oc: 'Son sèt oras.', reaccion: 'Karim rit : il ne te demande pas l’heure qu’il est ! Il veut savoir à quelle heure tu te lèves.' }
							],
							choses: ['me-levi'],
							explain: '*Me lèvi* : je me lève. *Se lèva*, c’est il ou elle ; *Son sèt oras*, l’heure qu’il est.'
						},
						{
							ditz: 'A sèt oras ! E puèi ?',
							options: [
								{ oc: 'Dejuni, puèi vau al trabalh.', bon: true },
								{ oc: 'Sopi, puèi vau al trabalh.', reaccion: 'Karim éclate de rire : tu dînes le matin, toi ? *sopar*, c’est le repas du soir.' },
								{ oc: 'Puèi, vau al lièch.', reaccion: 'Karim rit : tu te lèves… pour retourner au lit ? Raconte-lui plutôt ta matinée.' }
							],
							choses: ['dejunar', 'puei', 'vau-al-trabalh'],
							explain: '*Dejuni* : je prends le petit déjeuner, le matin. *Sopi*, c’est le soir.'
						},
						{
							ditz: 'E a miègjorn ?',
							options: [
								{ oc: 'A miègjorn, dinni.', bon: true },
								{ oc: 'A miègjorn, dejuni.', reaccion: 'Karim s’amuse : ton petit déjeuner à midi ? Ah, la grasse matinée !' },
								{ oc: 'A mièjanuèch, dinni.', reaccion: 'Karim ouvre de grands yeux : tu déjeunes à minuit ? *mièjanuèch*, c’est minuit ; midi, c’est *miègjorn*.' }
							],
							choses: ['dinnar', 'miegjorn'],
							explain: '*dinnar* : le repas de midi. *dinni* : je déjeune.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Karim raconte sa journée à l’hôpital, puis passe au français, très vite : « Et l’après-midi, c’est les transmissions avec l’équipe, tu vois, le planning, tout ça ! » Tu ne sais pas dire tout ça en occitan.',
							options: [
								{ oc: 'Cossí se ditz en occitan ?', bon: true },
								{ oc: 'Òc, òc…', reaccion: 'Karim continue en français, ravi… et votre conversation passe au français. Demande-lui plutôt comment on le dit en occitan.' },
								{ oc: 'Non sabi pas.', reaccion: 'Karim s’arrête : tu ne sais pas quoi ? Il te réexplique tout… en français. Demande-lui plutôt comment on le dit en occitan.' }
							],
							choses: ['cossi-se-ditz'],
							explain: 'Pour rester en occitan : *Cossí se ditz en occitan ?* Karim cherche ses mots, et repasse à l’occitan.'
						},
						{
							ditz: 'En occitan ? Lo tantòst, trabalhi totjorn ! E tu, lo ser ?',
							options: [
								{ oc: 'Lo ser, sopi, puèi vau al lièch.', bon: true },
								{ oc: 'Lo ser, dejuni, puèi vau al lièch.', reaccion: 'Karim rit : ton petit déjeuner, le soir ? *dejunar*, c’est le matin ; le soir, c’est *sopar*.' },
								{ oc: 'Lo ser, sopa, puèi vau al lièch.', reaccion: 'Karim hésite : qui dîne ? *sopa*, c’est il ou elle. Pour toi : *sopi*.' }
							],
							choses: ['lo-ser', 'sopar', 'vau-al-liech'],
							explain: '*sopi* : je dîne ; *sopa* : il ou elle dîne.'
						},
						{
							situacion: 'Pour finir, Karim demande le temps de demain. Le bulletin l’a dit : chez toi, demain, de la pluie et du froid.',
							ditz: 'E deman ? Quin temps fa ?',
							options: [
								{ oc: 'Deman, plòu, e fa freg.', bon: true },
								{ oc: 'Deman, fa solelh, e fa caud.', reaccion: 'Karim pense déjà au soleil… Mais le bulletin annonçait de la pluie et du froid !' },
								{ oc: 'Deman, nèva.', reaccion: 'Karim s’en réjouit : encore de la neige ? Non : le bulletin a dit de la pluie et du froid.' }
							],
							choses: ['quin-temps-fa', 'plou', 'fa-freg'],
							explain: '*Plòu* : il pleut ; *fa freg* : il fait froid. Et Karim te quitte : *A lèu !*'
						}
					],
					fin: 'Ta journée est racontée, en occitan du début à la fin. À toi, maintenant, de l’écrire.'
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
					title: 'La tâche de l’unité : ta journée en dix phrases',
					paragraphs: [
						'Pense à une journée ordinaire, la tienne : un lundi, un jeudi, le jour que tu veux. À quelle heure te lèves-tu ? Que fais-tu le matin, à midi, le soir ?',
						'Écris-la ci-dessous en dix phrases, une à la fois, puis raconte-la à voix haute, de plus en plus vite.',
						'Choisis maintenant à qui tu la raconteras pour de vrai : ton prof, au prochain cours en visio, ou une personne qui apprend l’occitan avec toi.'
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris ta journée)',
					intro: 'Une phrase à la fois, avec ta vraie journée. À la fin, la page les rassemble : c’est ton récit.',
					recap: 'Ta journée, à raconter à voix haute :',
					items: [
						{
							consigne: '1. Le jour, et l’heure de ton lever. Commence par *Lo…* et le jour.',
							debut: ['Lo diluns', 'Lo dimars', 'Lo dimècres', 'Lo dijòus', 'Lo divendres', 'Lo dissabte', 'Lo dimenge'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: 'Par exemple : *Lo dijòus, me lèvi a sèt oras.*'
						},
						{
							consigne: '2. Le petit déjeuner. Commence par *Dejuni…*',
							answers: ['Dejuni.'],
							debut: ['Dejuni'],
							choses: ['dejunar'],
							explain: 'Par exemple : *Dejuni a sèt oras e quart.*'
						},
						{
							consigne: '3. La suite du matin. Commence par *Puèi,…*',
							debut: ['Puèi'],
							choses: ['puei'],
							explain: 'Par exemple : *Puèi, vau al trabalh.* · *Puèi, camini amb lo can.*'
						},
						{
							consigne: '4. À midi. Commence par *A miègjorn,…*',
							debut: ['A miègjorn'],
							choses: ['dinnar', 'miegjorn'],
							explain: 'Par exemple : *A miègjorn, dinni amb ma sòrre.*'
						},
						{
							consigne: '5. L’après-midi. Commence par *Lo tantòst,…*',
							debut: ['Lo tantòst'],
							choses: ['lo-tantost'],
							explain: 'Par exemple : *Lo tantòst, trabalhi.*'
						},
						{
							consigne: '6. Le soir. Commence par *Lo ser,…*',
							debut: ['Lo ser'],
							choses: ['lo-ser', 'sopar'],
							explain: 'Par exemple : *Lo ser, sopi a uèch oras.*'
						},
						{
							consigne: '7. L’heure du coucher, avec *vau al lièch*.',
							debut: ['A', 'Vau al lièch'],
							choses: ['vau-al-liech'],
							explain: 'Par exemple : *A onze oras, vau al lièch.*'
						},
						{
							consigne: '8. Une personne de ta famille : à quelle heure se lève-t-elle ? Commence par *Mon…* ou *Ma…*',
							debut: ['Mon', 'Ma'],
							choses: ['me-levi', 'possessius-mon-ma'],
							explain: 'Par exemple : *Mon fraire se lèva a dètz oras !*'
						},
						{
							consigne: '9. Le temps qu’il fait aujourd’hui, pour de vrai. Commence par *Uèi,…*',
							debut: ['Uèi'],
							choses: ['uei'],
							explain: 'Par exemple : *Uèi, plòu, e fa freg.*'
						},
						{
							consigne: '10. Ce qui ne change pas, chez toi. Commence par *Totjorn,…*',
							debut: ['Totjorn'],
							choses: ['totjorn'],
							explain: 'Par exemple : *Totjorn, lo dimenge, dinni amb ma familha.*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple',
					items: [
						{
							q: 'Quand tu as fini, et pas avant, regarde la journée de Lisa.',
							a: '*Lo diluns, me lèvi a sièis oras e mièja. Dejuni. Puèi, vau al trabalh. A miègjorn, dinni. Lo tantòst, trabalhi. Lo ser, sopi amb ma maire e mon fraire. A onze oras, vau al lièch. Mon fraire se lèva a sèt oras. Uèi, nèva, e fa freg. Totjorn, a Montpelhièr, fa solelh !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'dix phrases, du lever au coucher, dans l’ordre',
						'l’heure avec *a* : *a sèt oras*, *a miègjorn*',
						'le repas à la bonne personne : *dejuni* pour toi, *dejuna* pour une autre',
						'le temps qu’il fait, au moins une fois',
						'la prononciation : le *v* de *lèvi* sonne « b », le *o* de *ora* sonne « ou »'
					]
				},
				// jeu prévu par la carte : parler 40, puis 30, puis 20 secondes
				// (technique 4-3-2 de Paul Nation, raccourcie pour l'A1). Un
				// chronomètre dans la page reste à coder (seul chronomètre de l'A1) ;
				// en attendant, le minuteur du téléphone.
				{
					type: 'reveal',
					title: 'Le défi du chronomètre : 40, 30, 20 secondes',
					intro: 'Redis ta journée sans regarder, trois fois, de plus en plus vite. Un mot oublié ? Regarde, puis recommence depuis le début.',
					items: [
						{
							q: 'Premier tour : cache l’écran, lance le minuteur de ton téléphone, et raconte ta journée en 40 secondes.',
							a: 'Fini ? Pas grave si tu n’as pas tout dit. La même journée, maintenant, en 30 secondes.'
						},
						{
							q: 'Deuxième tour : les mêmes phrases, en 30 secondes.',
							a: 'Les phrases reviennent plus vite : c’est le but. Dernier tour : 20 secondes.'
						},
						{
							q: 'Troisième tour : 20 secondes !',
							a: 'Bravo. Redire la même chose de plus en plus vite : c’est ainsi que la parole devient fluide.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 6. Lo son e lo bilanç
		{
			title: 'Lo son e lo bilanç',
			fr: 'le son et le bilan',
			minutes: 7,
			blocks: [
				{
					type: 'note',
					variant: 'son',
					title: 'Les trois sons de l’unité',
					paragraphs: [
						'Le *o* sans accent sonne « ou » : *ora* « OU-ro », *son* « soun » (module 6.1).',
						'Dans *plòu* et *la nèu*, deux sons glissent l’un dans l’autre : « PLÒOU », « la NÈOU » (module 6.2).',
						'Le *v* sonne « b » : *me lèvi* « mé LÈ-bi », *vau* « BAOU » (module 6.3).'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Son nòu oras* se dit…',
							options: ['soun NÒOU OU-ros', 'son NÒOU O-ros'],
							correct: 0,
							noShuffle: true,
							explain: '« son », « O-ros » : c’est la lecture à la française. Le *o* sans accent sonne « ou ».'
						},
						{
							q: '*Nèva* se dit…',
							options: ['NÈ-bo', 'NÈ-va'],
							correct: 0,
							noShuffle: true,
							explain: '« NÈ-va », c’est la lecture à la française. Le *v* sonne « b », et le *a* final, « o ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Uèi plòu : me lèvi a nòu oras !*',
							a: '« UÈÏ PLÒOU : mé LÈ-bi a NÒOU OU-ros ! » : les trois sons de l’unité dans une seule phrase.'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unité 6 : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Ton carnet de révision fera revenir le reste.',
					items: [
						'demander l’heure, la dire, et dire à quelle heure',
						'dire le temps qu’il fait, aujourd’hui et demain',
						'dire à quelle heure je me lève, et mes trois repas',
						'raconter ma journée en dix phrases, de plus en plus vite'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant raconter ta journée, du lever au coucher.',
						'Si tu en as envie : raconte-la à la personne que tu as choisie, ton prof ou une personne qui apprend l’occitan avec toi. Quand ? Où ? Choisis-le maintenant. Ensuite vient la halte 3 : une journée de marché, de l’heure du départ au retour, où tout ressort.'
					]
				},
				{
					type: 'table',
					title: 'Mémo de l’unité 6 : les phrases toutes faites',
					head: ['pour…', 'tu dis'],
					rows: [
						['demander l’heure', '*Quina ora es ?* · *Es una ora.* · *Son doas oras.*'],
						['la demie, le quart', '*… e mièja* · *… e quart* · *… mens lo quart*'],
						['midi, minuit', '*miègjorn* · *mièjanuèch*'],
						['demander à quelle heure', '*A quina ora ?* · *A sèt oras.*'],
						['demander le temps', '*Quin temps fa ?* · *Fa bèl.* · *Plòu.* · *Nèva.*'],
						['aujourd’hui, maintenant', '*uèi* · *ara*'],
						['ton lever', '*Me lèvi a sèt oras.* · *A quina ora te lèvas ?*'],
						['où tu vas', '*Vau al trabalh.* · *Vau al lièch.*'],
						['enchaîner', '*puèi* (ensuite) · *totjorn* (toujours)']
					]
				},
				{
					type: 'table',
					title: 'Mémo : les trois repas',
					head: ['', '*dejunar*', '*dinnar*', '*sopar*'],
					rows: [
						['quand ?', 'le matin', 'à midi', 'le soir'],
						['je', '*dejuni*', '*dinni*', '*sopi*'],
						['il, elle', '*dejuna*', '*dinna*', '*sopa*']
					],
					notes: ['Des verbes en *-ar*, comme *trabalhar* : pour l’instant, « je » et « il, elle » suffisent.']
				},
				{
					type: 'table',
					title: 'Alhors en Occitània (ailleurs en Occitanie)',
					intro: 'Les mêmes mots dans les autres grands dialectes. Pas à apprendre : seulement pour les reconnaître quand tu les entendras.',
					head: ['', 'quelle heure est-il ?', 'il pleut', 'il fait chaud'],
					rows: [
						['languedocien (ton cours)', '*Quina ora es ?*', '*Plòu.*', '*Fa caud.*'],
						['gascon', '*Quina òra ei ?*', '*Que plau.*', '*Que hè calor.*'],
						['provençal', '*Quant es d’ora ?*', '*Plòu.*', '*Fa caud.*'],
						['limousin', '', '*Plòu.*', '*Fai chaud.*'], // « quelle heure est-il ? » : pas de source sûre
						['auvergnat', '*Quanh’ora z-es ?*', '', '*Fai chaud.*'], // « il pleut » : pas de source sûre
						['vivaro-alpin', '*Quant es d’ora ?*', '', '*Fai chaud.*'] // « il pleut » : pas de source sûre
					],
					notes: [
						'Pour l’heure, le provençal et le vivaro-alpin disent *Quant es d’ora ?*, le gascon *Quina òra ei ?*',
						'En gascon, une phrase qui affirme commence souvent par *que* : *Que plau.*',
						'Au nord (limousin, auvergnat, vivaro-alpin), *caud* devient *chaud* et *fa* devient *fai* : *Fai chaud.* Le gascon dit *Que hè calor.*',
						'Formes tirées des dictionnaires et du conjugueur de lo Congrès (dicodòc, vèrb’Òc). Case vide : pas encore de forme sûre.'
					],
					glosa: {
						'quina òra ei': 'quelle heure est-il ? (gascon)',
						'quant es d’ora': 'quelle heure est-il ? (provençal, vivaro-alpin)',
						'quanh’ora z-es': 'quelle heure est-il ? (auvergnat)',
						que: 'petit mot qui ouvre une phrase affirmative (gascon)',
						'que plau': 'il pleut (gascon)',
						'que hè calor': 'il fait chaud (gascon)',
						'fai chaud': 'il fait chaud (limousin, auvergnat, vivaro-alpin)'
					}
				}
			]
		}
	]
};
