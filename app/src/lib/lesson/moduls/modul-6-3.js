// Module 6.3 · A1 · « A quina ora te lèvas ? » : unité 6 (La jornada), rédigé
// par Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six
// étapes, carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : Me lèvi, te lèvas, se lèva en bloc tout fait (les autres
// personnes attendent l'A2) ; la journée dans l'ordre : lo matin, a miègjorn,
// lo tantòst, lo ser ; puèi (ensuite) ; les trois repas, à je et à il ou elle
// seulement (lexic-A1.md, 6.3).
// Scène : le dimanche de neige annoncé en 6.2. Núria a dormi chez Yasmine, au
// village ; le soir, Yasmine appelle Karim, qui travaille le lendemain.
// Jeu du jour : remettre la journée dans l'ordre (quatre journées : Karim,
// Yasmine, Loís, et la chatte Mimí).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01), à
// valider par Romain. Le refrain de Mistral est en provençal, graphie
// mistralienne (cursus/cultura-A1.md, unité 6 : traduction à relire).

export const modul63 = {
	id: 'modul-6-3',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '6-3',
	unitat: 'Unitat 6 · La jornada',
	nivel: 'A1 · Modul 6.3',
	oc: 'A quina ora te lèvas ?',
	fr: 'À quelle heure te lèves-tu ? Raconter sa journée, du matin au soir',
	cando:
		'Je peux dire à quelle heure je me lève, demander à quelqu’un à quelle heure il se lève, dire mes repas et raconter une journée dans l’ordre : le matin, à midi, l’après-midi, le soir.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Núria', 'Karim', 'Lisa', 'Loís', 'Mimí', 'Inès'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Yasmine se lève à cinq heures, et commence aussitôt (en 6.1 : *trabalhi a cinc oras*). Cohérent pour toi ?',
		'Loís, cuisinier, déjeune à onze heures et dîne à six heures, avant le service : *A onze oras, dinni.* Juste ?',
		'*Caminam amb Lisa dins la nèu* (on se promène avec Lisa dans la neige) : naturel ?',
		'*dinnar* « di-NA », *dinni* « DI-ni » (lexique) : le double *n* se dit comme un seul. D’accord ?',
		'Refrain de Mistral, traduit : « Vite ! vite ! vite ! montre-toi, beau soleil ! » D’accord ?'
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
							q: 'Núria demande *Quin temps fa ?* Il pleut. Tu réponds :',
							options: ['Plòu.', 'Nèva.', 'Fa vent.'],
							correct: 0,
							oc: true,
							choses: ['plou'],
							explain: '*Plòu* : il pleut, en un seul mot. *Nèva* : il neige. *Fa vent* : il y a du vent.'
						},
						{
							q: 'Il est midi :',
							options: ['Es miègjorn.', 'Es mièjanuèch.', 'Son doas oras.'],
							correct: 0,
							oc: true,
							choses: ['miegjorn'],
							explain: '*miègjorn* : midi ; *mièjanuèch* : minuit. Une seule heure : *es*.'
						},
						{
							q: '*Uèi, fa freg.*',
							options: ['Aujourd’hui, il fait froid.', 'Demain, il fait froid.', 'Aujourd’hui, il fait chaud.'],
							correct: 0,
							choses: ['uei', 'fa-freg'],
							explain: '*uèi* : aujourd’hui (*deman* : demain). *freg* : froid (*caud* : chaud).'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Demande à Karim à quelle heure il travaille.',
							answers: ['Karim, a quina ora trabalhas ?', 'A quina ora trabalhas, Karim ?', 'A quina ora trabalhas ?'],
							choses: ['a-quina-ora', 'trabalhar'],
							explain: '*A quina ora… ?* : à quelle heure ? *trabalhas* : tu travailles.'
						},
						{
							consigne: 'Il y a du soleil, mais il fait froid.',
							answers: ['Fa solelh, mas fa freg.'],
							choses: ['fa-solelh', 'fa-freg'],
							explain: 'Deux fois *fa*, et *mas* : mais.'
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
					title: 'Un dimanche de neige',
					intro:
						'Le dimanche de neige est arrivé. Núria est venue au village et a dormi chez Yasmine. Le soir, Yasmine appelle Karim, à Toulouse. Lis une première fois pour répondre à une seule question : qui se lève le plus tard ?',
					scenes: [
						{
							title: 'Lo dimenge, al vilatge',
							subtitle: '(dix heures et demie, chez Yasmine)',
							lines: [
								{ oc: 'Bonjorn, Núria ! Son dètz oras e mièja !', sound: 'boun-DJOUR, NOU-ria ! soun DÈ-dzou-ros é MYÈ-djo !', fr: 'Bonjour, Núria ! Il est dix heures et demie !' },
								{ oc: 'Dètz oras e mièja ? E tu, Yasmine, a quina ora te lèvas ?', sound: 'DÈ-dzou-ros é MYÈ-djo ? é TU, yas-MI-ne, a KI-no OU-ro té LÈ-bos ?', fr: 'Dix heures et demie ? Et toi, Yasmine, à quelle heure te lèves-tu ?' },
								{ oc: 'Ieu ? Me lèvi a cinc oras, totjorn. Lo dimenge tanben !', sound: 'YÉOU ? mé LÈ-bi a SIN-kou-ros, tout-DJOUR. lou di-MÉN-djé tam-BÉ !', fr: 'Moi ? Je me lève à cinq heures, toujours. Le dimanche aussi !' },
								{ oc: 'A cinc oras ! E puèi ?', sound: 'a SIN-kou-ros ! é PUÈÏ ?', fr: 'À cinq heures ! Et ensuite ?' },
								{ oc: 'Puèi, trabalhi. A uèch oras, dejuni.', sound: 'PUÈÏ, tra-BA-lyi. a UÈ-tchou-ros, dé-DJU-ni.', fr: 'Ensuite, je travaille. À huit heures, je prends mon petit déjeuner.' },
								{ oc: 'E ieu, ara… dejuni !', sound: 'é YÉOU, A-ro… dé-DJU-ni !', fr: 'Et moi, maintenant… je prends mon petit déjeuner !' },
								{ oc: 'Òsca ! E lo tantòst, caminam amb Lisa dins la nèu.', sound: 'ÒS-co ! é lou tan-TÒST, ca-mi-NAN am LI-za dins la NÈOU.', fr: 'Bravo ! Et l’après-midi, on se promène avec Lisa dans la neige.' }
							]
						},
						{
							title: 'Lo ser',
							subtitle: '(le même dimanche, au téléphone : Yasmine appelle Karim)',
							lines: [
								{ oc: 'Adieu, Karim ! Cossí vas ?', sound: 'a-DIOU, ka-RIM ! cou-si BAS ?', fr: 'Salut, Karim ! Comment vas-tu ?' },
								{ oc: 'Vau plan ! Mas deman, me lèvi a cinc oras…', sound: 'baou PLA ! mas dé-MA, mé LÈ-bi a SIN-kou-ros…', fr: 'Je vais bien ! Mais demain, je me lève à cinq heures…' },
								{ oc: 'Ieu tanben ! E puèi ?', sound: 'YÉOU tam-BÉ ! é PUÈÏ ?', fr: 'Moi aussi ! Et ensuite ?' },
								{ oc: 'Dejuni, e a sièis oras, vau al trabalh. A miègjorn, dinni a l’espital.', sound: 'dé-DJU-ni, é a SYÈÏ-zou-ros, baou al tra-BAL. a myèd-DJOUR, DI-ni a lés-pi-TAL.', fr: 'Je prends mon petit déjeuner, et à six heures, je vais au travail. À midi, je déjeune à l’hôpital.' },
								{ oc: 'E lo ser ?', sound: 'é lou SÉ ?', fr: 'Et le soir ?' },
								{ oc: 'Lo ser, sopi a sèt oras… e a nòu oras, vau al lièch !', sound: 'lou SÉ, SOU-pi a SÈ-tou-ros… é a NÒOU OU-ros, baou al LYÈTCH !', fr: 'Le soir, je dîne à sept heures… et à neuf heures, je vais au lit !' },
								{ oc: 'A nòu oras ? Adieu, Karim, e a lèu !', sound: 'a NÒOU OU-ros ? a-DIOU, ka-RIM, é a LÈOU !', fr: 'À neuf heures ? Salut, Karim, et à bientôt !' }
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
							q: 'Qui se lève le plus tard ?',
							options: ['Núria', 'Yasmine', 'Karim'],
							correct: 0,
							choses: ['me-levi'],
							explain: 'Núria se lève à dix heures et demie. Yasmine et Karim, à cinq heures : *Me lèvi a cinc oras.*'
						},
						{
							q: 'Yasmine se lève à cinq heures…',
							options: ['tous les jours, même le dimanche', 'seulement le dimanche', 'seulement demain'],
							correct: 0,
							choses: ['totjorn'],
							explain: '*totjorn* : toujours. *Lo dimenge tanben !* : le dimanche aussi.'
						},
						{
							q: 'Demain, à six heures, Karim…',
							options: ['va au travail', 'va au lit', 'déjeune à l’hôpital'],
							correct: 0,
							choses: ['vau-al-trabalh'],
							explain: '*A sièis oras, vau al trabalh* : il va au travail. À l’hôpital, il déjeune à midi : *A miègjorn, dinni a l’espital.*'
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
					title: 'Je me lève, tu te lèves',
					intro: 'Regarde le petit mot devant le verbe, puis les mots de la journée.',
					items: [
						{
							q: '*Me lèvi a cinc oras*, dit Yasmine. *Me lèvi* veut dire…',
							options: ['je me lève', 'je travaille', 'je mange'],
							correct: 0,
							choses: ['me-levi'],
							explain: '*Me lèvi* : je me lève. Le petit *me* se met devant, comme dans *Me dison* (on m’appelle), en 1.2.'
						},
						{
							q: '*A quina ora te lèvas ?* demande Núria. Elle veut savoir…',
							options: ['à quelle heure Yasmine se lève', 'à quelle heure Yasmine travaille', 'quelle heure il est'],
							correct: 0,
							choses: ['me-levi', 'a-quina-ora'],
							explain: '*te lèvas* : tu te lèves. *A quina ora… ?* : à quelle heure, comme en 6.1.'
						},
						{
							q: 'Mimí, la chatte d’Inès, se lève elle aussi à cinq heures. Tu dis : Mimí…',
							options: ['se lèva', 'me lèvi', 'te lèvas'],
							correct: 0,
							oc: true,
							choses: ['me-levi'],
							explain: '*me lèvi* (je), *te lèvas* (tu), *se lèva* (il ou elle) : le petit mot change avec la personne, et la fin du verbe aussi.'
						},
						{
							q: '*dejuni*, *dinni*, *sopi* : de quoi parle-t-on ?',
							options: ['des trois repas de la journée', 'de trois heures de travail', 'de trois jours de la semaine'],
							correct: 0,
							choses: ['dejunar', 'dinnar', 'sopar'],
							explain: '*dejuni* : je prends le petit déjeuner ; *dinni* : je déjeune, à midi ; *sopi* : je dîne, le soir.'
						},
						{
							q: '*Puèi, trabalhi.* *Puèi* veut dire…',
							options: ['ensuite', 'toujours', 'maintenant'],
							correct: 0,
							choses: ['puei'],
							explain: '*puèi* : ensuite. *totjorn* : toujours ; *ara* : maintenant.'
						},
						{
							q: '*E lo tantòst, caminam amb Lisa.* *Lo tantòst*, c’est…',
							options: ['l’après-midi', 'le matin', 'le soir'],
							correct: 0,
							choses: ['lo-tantost', 'lo-matin', 'lo-ser'],
							explain: '*lo matin*, *a miègjorn*, *lo tantòst*, *lo ser* : la journée dans l’ordre.'
						},
						{
							q: '*A nòu oras, vau al lièch !* dit Karim. Il va…',
							options: ['au lit', 'au travail', 'à l’hôpital'],
							correct: 0,
							choses: ['vau-al-liech'],
							explain: '*Vau al lièch* : je vais au lit. *Vau al trabalh* : je vais au travail. *vau* : je vais, comme dans *Vau plan*.'
						}
					]
				},
				{
					type: 'table',
					title: 'La journée dans l’ordre',
					intro: 'Du matin au soir, avec les mots des deux scènes.',
					head: ['', 'en occitan', 'par exemple'],
					rows: [
						['le matin', '*lo matin*', '*Me lèvi a sèt oras. Dejuni.*'],
						['à midi', '*a miègjorn*', '*Dinni.*'],
						['l’après-midi', '*lo tantòst*', '*Trabalhi.*'],
						['le soir', '*lo ser*', '*Sopi.*'],
						['à minuit', '*a mièjanuèch*', '*Vau al lièch.*']
					],
					notes: [
						'*Me lèvi*, *te lèvas*, *se lèva* : un bloc tout fait. Le petit mot devant change avec la personne : *me* (je), *te* (tu), *se* (il ou elle). Les autres personnes viendront en A2.',
						'Les trois repas sont des verbes en *-ar*, comme *trabalhar* : *dejuni*, *dinni*, *sopi* (je) ; *dejuna*, *dinna*, *sopa* (il ou elle).',
						'Comme dans le français d’autrefois, encore vivant en Belgique, en Suisse ou au Québec : on déjeune le matin (*dejunar*), on dîne à midi (*dinnar*), on soupe le soir (*sopar*).',
						'*puèi* (ensuite) relie les moments : *Me lèvi, puèi dejuni.*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'me-levi', oc: 'Me lèvi · te lèvas · se lèva', sound: 'mé LÈ-bi · té LÈ-bos · sé LÈ-bo', fr: 'je me lève · tu te lèves · il ou elle se lève' },
						{ id: 'lo-tantost', oc: 'lo tantòst', sound: 'lou tan-TÒST', fr: 'l’après-midi' },
						{ id: 'puei', oc: 'puèi', sound: 'PUÈÏ', fr: 'puis, ensuite' },
						{ id: 'totjorn', oc: 'totjorn', sound: 'tout-DJOUR', fr: 'toujours' }
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
					title: 'À retenir : les repas, et où tu vas',
					intro: 'Cinq de plus : le jeu en a besoin.',
					items: [
						{ id: 'dejunar', oc: 'dejunar : dejuni · dejuna', sound: 'dé-dju-NA : dé-DJU-ni · dé-DJU-no', fr: 'prendre le petit déjeuner : je le prends · il ou elle le prend' },
						{ id: 'dinnar', oc: 'dinnar : dinni · dinna', sound: 'di-NA : DI-ni · DI-no', fr: 'déjeuner, le repas de midi : je déjeune · il ou elle déjeune' },
						{ id: 'sopar', oc: 'sopar : sopi · sopa', sound: 'sou-PA : SOU-pi · SOU-po', fr: 'dîner, le repas du soir : je dîne · il ou elle dîne' },
						{ id: 'vau-al-trabalh', oc: 'Vau al trabalh.', sound: 'baou al tra-BAL', fr: 'je vais au travail (*lo trabalh* : le travail).' },
						{ id: 'vau-al-liech', oc: 'Vau al lièch.', sound: 'baou al LYÈTCH', fr: 'je vais au lit (*lo lièch* : le lit).' }
					]
				},
				// jeu prévu par la carte : remettre la journée dans l'ordre. Version
				// simple : chaque tuile est une phrase ; pour la placer, il faut
				// comprendre l'heure, le repas ou le moment qu'elle dit.
				{
					type: 'order',
					title: 'Remets la journée dans l’ordre',
					intro: 'Quatre journées en désordre. Touche les phrases dans l’ordre, du matin au soir : les heures et les repas t’aident.',
					items: [
						{
							prompt: 'La journée de Karim, un lundi : il est infirmier à Toulouse.',
							tiles: ['Me lèvi a cinc oras.', 'Puèi, dejuni.', 'A sièis oras, vau al trabalh.', 'A miègjorn, dinni a l’espital.', 'Lo ser, sopi a sèt oras.', 'A nòu oras, vau al lièch.'],
							choses: ['me-levi', 'puei', 'dejunar', 'vau-al-trabalh', 'dinnar', 'sopar', 'vau-al-liech'],
							explain: 'Karim commence tôt, *a sièis oras*, et se couche tôt : *A nòu oras, vau al lièch.*'
						},
						{
							prompt: 'La journée de Yasmine, le dimanche de neige, à la ferme.',
							tiles: ['Me lèvi totjorn a cinc oras.', 'A sièis oras, trabalhi.', 'A uèch oras, dejuni.', 'A miègjorn, dinni.', 'Lo tantòst, caminam dins la nèu.', 'Lo ser, sopi.'],
							choses: ['totjorn', 'me-levi', 'dejunar', 'dinnar', 'lo-tantost', 'sopar'],
							explain: 'Yasmine travaille avant même son petit déjeuner : à la ferme, les bêtes n’attendent pas.'
						},
						{
							prompt: 'La journée de Loís : il est cuisinier, et mange avant les autres.',
							tiles: ['Lo matin, me lèvi a nòu oras.', 'A dètz oras, vau al trabalh.', 'A onze oras, dinni.', 'A miègjorn, cosini.', 'A sièis oras, sopi.', 'A mièjanuèch, vau al lièch.'],
							choses: ['lo-matin', 'me-levi', 'vau-al-trabalh', 'dinnar', 'sopar', 'vau-al-liech'],
							explain: 'Loís déjeune à onze heures et dîne à six heures : à midi et le soir, il cuisine pour les autres.'
						},
						{
							prompt: 'La journée de Mimí, la chatte d’Inès, racontée par Mimí.',
							tiles: ['Me lèvi a cinc oras.', 'Mangi.', 'A sièis oras, vau al lièch.', 'A miègjorn, me lèvi.', 'Mangi.', 'Lo tantòst, vau al lièch.', 'Lo ser, jògui !'],
							choses: ['me-levi', 'vau-al-liech', 'lo-tantost', 'lo-ser'],
							explain: 'Deux levers, deux couchers… et le soir, Mimí joue. Une vraie journée de chatte.'
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
					type: 'chunks',
					title: 'À retenir : le matin, le soir',
					intro: 'Tu les as vus dès l’unité 1 : ils entrent maintenant dans ton carnet de révision.',
					items: [
						{ id: 'lo-matin', oc: 'lo matin', sound: 'lou ma-TI', fr: 'le matin' },
						{ id: 'lo-ser', oc: 'lo ser', sound: 'lou SÉ', fr: 'le soir' }
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Je me lève à sept heures.',
							answers: ['Me lèvi a sèt oras.', 'A sèt oras, me lèvi.'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: '*Me lèvi* : je me lève. *a sèt oras* : à sept heures.'
						},
						{
							consigne: 'Demande à Karim à quelle heure il se lève.',
							answers: ['Karim, a quina ora te lèvas ?', 'A quina ora te lèvas, Karim ?', 'A quina ora te lèvas ?'],
							choses: ['me-levi', 'a-quina-ora'],
							explain: 'Tu tutoies Karim : *te lèvas*.'
						},
						{
							consigne: 'Je prends mon petit déjeuner, puis je vais au travail.',
							answers: ['Dejuni, puèi vau al trabalh.', 'Dejuni, e puèi vau al trabalh.'],
							choses: ['dejunar', 'puei', 'vau-al-trabalh'],
							explain: '*Dejuni* : un seul mot pour « je prends le petit déjeuner ».'
						},
						{
							consigne: 'À midi, je déjeune.',
							answers: ['A miègjorn, dinni.', 'Dinni a miègjorn.'],
							choses: ['dinnar', 'miegjorn'],
							explain: '*dinnar* : le repas de midi. *dinni* : je déjeune.'
						},
						{
							consigne: 'Le soir, je dîne avec ma sœur.',
							answers: ['Lo ser, sopi amb ma sòrre.', 'Sopi amb ma sòrre lo ser.'],
							choses: ['lo-ser', 'sopar', 'la-sorre', 'possessius-mon-ma'],
							explain: '*sopar* : le repas du soir. *amb ma sòrre* : avec ma sœur.'
						},
						{
							consigne: 'L’après-midi, je travaille.',
							answers: ['Lo tantòst, trabalhi.', 'Trabalhi lo tantòst.'],
							choses: ['lo-tantost', 'trabalhar'],
							explain: '*lo tantòst* : l’après-midi.'
						},
						{
							consigne: 'Mimí se lève toujours à cinq heures !',
							answers: ['Mimí se lèva totjorn a cinc oras !', 'Totjorn, Mimí se lèva a cinc oras !', 'Mimí se lèva a cinc oras, totjorn !'],
							choses: ['me-levi', 'totjorn'],
							explain: '*se lèva* : elle se lève. *totjorn* : toujours, juste après le verbe.'
						},
						{
							consigne: 'Je vais au lit à onze heures.',
							answers: ['Vau al lièch a onze oras.', 'A onze oras, vau al lièch.'],
							choses: ['vau-al-liech'],
							explain: '*Vau al lièch* : je vais au lit.'
						},
						{
							consigne: 'Et toi, pour de vrai : à quelle heure te lèves-tu ? Commence par *Me lèvi…*',
							debut: ['Me lèvi'],
							choses: ['me-levi'],
							explain: 'Par exemple : *Me lèvi a sèt oras e mièja.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Le matin, je me lève, puis je prends mon petit déjeuner.',
							tiles: ['Lo', 'matin,', 'me', 'lèvi,', 'puèi', 'dejuni.'],
							choses: ['lo-matin', 'me-levi', 'puei', 'dejunar'],
							explain: '*puèi* relie les deux moments.'
						},
						{
							prompt: 'Le soir, je dîne, puis je vais au lit.',
							tiles: ['Lo', 'ser,', 'sopi,', 'puèi', 'vau', 'al', 'lièch.'],
							choses: ['lo-ser', 'sopar', 'puei', 'vau-al-liech'],
							explain: '*Lo ser* ouvre la phrase ; *vau al lièch* se dit d’un bloc.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Raconte la journée d’une personne de ta famille : quand elle se lève, ses repas, son soir. Puis compare au modèle.',
					items: [
						{
							q: 'Ta mère, ton frère, ta fille…',
							a: 'Par exemple : *Ma maire se lèva a sèt oras. Dejuna, puèi trabalha. A miègjorn, dinna ; lo ser, sopa amb ma sòrre.*'
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
					title: 'Le son du jour : le v sonne « b »',
					paragraphs: [
						'Dans *lèvi*, le *v* se dit « b » : « LÈ-bi ».',
						'Tu l’entends déjà dans *nèva* « NÈ-bo », *vint* « BIN », *Vau plan* « baou PLA ».',
						'Écoute, puis répète : *Me lèvi*, *te lèvas*, *Vau al trabalh*.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Me lèvi* se dit…',
							options: ['mé LÈ-bi', 'mé LÈ-vi'],
							correct: 0,
							noShuffle: true,
							explain: '« LÈ-vi », c’est la lecture à la française. En occitan, le *v* sonne « b ».'
						},
						{
							q: '*Vau al lièch* se dit…',
							options: ['baou al LYÈTCH', 'vaou al LYÈTCH'],
							correct: 0,
							noShuffle: true,
							explain: 'Au début du mot aussi : *vau*, « baou ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Uèi nèva : me lèvi a uèch oras !*',
							a: '« UÈÏ NÈ-bo : mé LÈ-bi a UÈ-tchou-ros ! » : aujourd’hui il neige, je me lève à huit heures !'
						},
						{
							q: '*Te lèvas ? Vau al trabalh !*',
							a: '« té LÈ-bos ? baou al tra-BAL ! » : tu te lèves ? je vais au travail !'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : Mistral parle au soleil',
					// Refrain tiré de cursus/cultura-A1.md (unité 6), domaine public
					// (Mistral, mort en 1914). Provençal, graphie mistralienne : titres
					// sans italique pour ne pas les mêler à l'occitan de l'apprenant.
					lien: {
						href: 'https://fr.wikisource.org/wiki/Lis_Isclo_d%E2%80%99Or/Lou_Cant_d%C3%B3u_soul%C3%A8u',
						texte: 'Lire le poème de Mistral sur Wikisource'
					},
					paragraphs: [
						'En 1861, le poète Frédéric Mistral écrit en provençal « Lou Cant dóu soulèu », le chant du soleil. Il tutoie le soleil et l’appelle « compère du mistral ».',
						'Le refrain : *Lèu ! lèu ! lèu ! Fai te vèire, bèu soulèu !* (vite ! vite ! vite ! montre-toi, beau soleil !)',
						'Mistral écrit à sa manière : *soulèu*, c’est ton *solelh* ; *bèu*, ton *bèl*. Et *lèu*, tu le connais : *A lèu !*',
						'Source : Frédéric Mistral, « Lis Isclo d’Or », Avignon, 1876.'
					],
					glosa: {
						'lèu': 'vite (A lèu ! : à bientôt)',
						'fai te vèire': 'montre-toi ; mot à mot, fais-toi voir (provençal)',
						'bèu soulèu': 'beau soleil (provençal ; en languedocien, bèl solelh)'
					}
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'dire à quelle heure je me lève',
						'demander à quelqu’un à quelle heure il se lève',
						'dire mes trois repas : le matin, à midi, le soir',
						'raconter une journée dans l’ordre, avec *puèi*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant raconter une journée, du matin au soir.',
						'Si tu en as envie : demain matin, dis à une personne de ta maison, ta fille, ton compagnon, ta colocataire : *Me lèvi a… oras.* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
