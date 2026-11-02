// Module 6.2 · A1 · « Quin temps fa ? » : unité 6 (La jornada), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : fa + le temps (Fa caud, fa freg, fa bèl, fa solelh, fa
// vent) ; deux verbes à part, un seul mot : Plòu, Nèva (lexic-A1.md, 6.2).
// Scène : un matin d'hiver, au téléphone. Yasmine, au village, appelle Lisa
// (ingénieure à Montpellier), puis Núria appelle de Toulouse. Dimanche, il
// neigera au village : Lisa viendra (suite en 6.4).
// Jeu du jour : le bulletin météo de la radio, lu (dialogue), puis « Prépare
// ton sac » (qcm).
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01), à
// valider par Romain. Rodés vient de la carte de 1.3 ; Marselha (titre de
// chanson) est rangé dans les noms propres.

export const modul62 = {
	id: 'modul-6-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '6-2',
	unitat: 'Unitat 6 · La jornada',
	nivel: 'A1 · Modul 6.2',
	oc: 'Quin temps fa ?',
	fr: 'Quel temps fait-il ? Dire le temps qu’il fait, aujourd’hui et demain',
	cando:
		'Je peux demander quel temps il fait, dire s’il fait chaud, froid, beau, du vent ou du soleil, s’il pleut ou s’il neige, et comprendre un petit bulletin météo.',
	durada: '~50 min · 6 étapes',
	// Prénoms des personnages et titre de chanson : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Lisa', 'Núria', 'Karim', 'Marià', 'Loís', 'Marselha'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Chanson *Plòu a Marselha* (Lou Dalfin) : la recherche n’a vérifié que le titre, pas les paroles. Tu la gardes ?',
		'*freg* : « FRÉTCH », le g final sonne « tch » (lexique). D’accord ?',
		'Dans la note culture, *cers* et *autan* restent écrits en français (absents du Basic) : d’accord ?'
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
							q: 'Il est deux heures :',
							options: ['Son doas oras.', 'Es doas oras.', 'Son dos oras.'],
							correct: 0,
							oc: true,
							choses: ['son-doas-oras'],
							explain: 'Plusieurs heures : *son*. Et *doas*, au féminin, comme *ora*.'
						},
						{
							q: '*Son cinc oras mens lo quart.* Il est…',
							options: ['4 h 45', '5 h 15', '5 h 45'],
							correct: 0,
							choses: ['e-quart'],
							explain: 'Il manque un quart d’heure pour arriver à cinq heures : 4 h 45.'
						},
						{
							q: '*Qué fa Núria lo dimenge ?*',
							options: ['Que fait Núria le dimanche ?', 'Que fais-tu le dimanche, Núria ?', 'Où est Núria le dimanche ?'],
							correct: 0,
							choses: ['far-singular', 'dimenge'],
							explain: '*fa* : il ou elle fait. Garde-le en tête : aujourd’hui, *fa* sert aussi pour le temps qu’il fait.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Demande l’heure.',
							answers: ['Quina ora es ?', 'Quina ora es, ara ?', 'Ara, quina ora es ?'],
							choses: ['quina-ora-es'],
							explain: '*Quina ora es ?* : mot à mot, quelle heure est ?'
						},
						{
							consigne: 'Je mange à une heure.',
							answers: ['Mangi a una ora.', 'A una ora, mangi.'],
							choses: ['manjar', 'a-quina-ora'],
							explain: '*Mangi* : je mange (un *g* devant *i*). *a una ora* : à une heure.'
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
					title: 'Trois villes, trois temps',
					intro:
						'Un matin d’hiver. Yasmine, au village, appelle son amie Lisa, à Montpellier : viendra-t-elle dimanche ? Puis Núria appelle de Toulouse. Lis une première fois pour répondre à une seule question : où fait-il beau, ce matin ?',
					scenes: [
						{
							title: 'Yasmine e Lisa',
							subtitle: '(au téléphone : Yasmine au village, Lisa à Montpellier)',
							lines: [
								{ oc: 'Adieu, Lisa ! Cossí vas ?', sound: 'a-DIOU, LI-za ! cou-si BAS ?', fr: 'Salut, Lisa ! Comment vas-tu ?' },
								{ oc: 'Vau plan, mercés ! Aquí, a Montpelhièr, fa bèl : fa solelh !', sound: 'baou PLA, mér-SÉS ! a-KI, a moun-pé-LYÈ, fa BÈL : fa sou-LÉL !', fr: 'Je vais bien, merci ! Ici, à Montpellier, il fait beau : il y a du soleil !' },
								{ oc: 'Aquí, plòu… e fa freg !', sound: 'a-KI, PLÒOU… é fa FRÉTCH !', fr: 'Ici, il pleut… et il fait froid !' },
								{ oc: 'E dimenge ? Quin temps fa, dimenge ?', sound: 'é di-MÉN-djé ? kin TÉMS FA, di-MÉN-djé ?', fr: 'Et dimanche ? Quel temps fait-il, dimanche ?' },
								{ oc: 'Dimenge ? Nèva, al vilatge !', sound: 'di-MÉN-djé ? NÈ-bo, al bi-LA-djé !', fr: 'Dimanche ? Il neige, au village !' },
								{ oc: 'Nèva ? Òsca ! Dimenge, soi al vilatge !', sound: 'NÈ-bo ? ÒS-co ! di-MÉN-djé, souï al bi-LA-djé !', fr: 'Il neige ? Génial ! Dimanche, je suis au village !' }
							]
						},
						{
							title: 'Yasmine e Núria',
							subtitle: '(au téléphone : Núria à Toulouse)',
							lines: [
								{ oc: 'Yasmine ! Quin temps fa al vilatge ?', sound: 'yas-MI-ne ! kin TÉMS FA al bi-LA-djé ?', fr: 'Yasmine ! Quel temps fait-il au village ?' },
								{ oc: 'Uèi, plòu. E a Tolosa ?', sound: 'UÈÏ, PLÒOU. é a tou-LOU-zo ?', fr: 'Aujourd’hui, il pleut. Et à Toulouse ?' },
								{ oc: 'A Tolosa, plòu pas, mas fa vent… e fa freg !', sound: 'a tou-LOU-zo, PLÒOU PAS, mas fa BÉN… é fa FRÉTCH !', fr: 'À Toulouse, il ne pleut pas, mais il y a du vent… et il fait froid !' },
								{ oc: 'Dimenge, nèva al vilatge. Caminam amb Lisa ?', sound: 'di-MÉN-djé, NÈ-bo al bi-LA-djé. ca-mi-NAN am LI-za ?', fr: 'Dimanche, il neige au village. On se promène avec Lisa ?' },
								{ oc: 'Òc ! Amb Lisa… e amb la nèu !', sound: 'OK ! am LI-za… é am la NÈOU !', fr: 'Oui ! Avec Lisa… et avec la neige !' }
							]
						}
					],
					glossary: [{ oc: 'Òsca !', sound: 'ÒS-co', fr: 'bravo ! génial !' }]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Où fait-il beau, ce matin ?',
							options: ['à Montpellier, chez Lisa', 'au village, chez Yasmine', 'à Toulouse, chez Núria'],
							correct: 0,
							choses: ['fa-bel'],
							explain: '*Aquí, a Montpelhièr, fa bèl : fa solelh !* Au village, *plòu* ; à Toulouse, *fa vent*.'
						},
						{
							q: 'Au village, ce matin…',
							options: ['il pleut, et il fait froid', 'il neige', 'il y a du soleil'],
							correct: 0,
							choses: ['plou', 'fa-freg', 'neva'],
							explain: '*Aquí, plòu… e fa freg !* La neige, c’est pour dimanche.'
						},
						{
							q: 'À Toulouse…',
							options: ['il ne pleut pas, mais il y a du vent', 'il pleut, et il y a du vent', 'il fait chaud'],
							correct: 0,
							choses: ['fa-vent'],
							explain: '*plòu pas* : il ne pleut pas. *fa vent* : il y a du vent.'
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
					title: 'Avec fa, ou en un seul mot',
					intro: 'Regarde comment on dit le temps : avec *fa*, ou en un seul mot.',
					items: [
						{
							q: '*Fa freg* : comme en français, *fa* veut dire…',
							options: ['il fait', 'il a', 'il est'],
							correct: 0,
							choses: ['fa-freg'],
							explain: '*fa* : il fait. Tu le connais depuis l’unité 4 : *Qué fa lo dimenge ?* Ici, il dit le temps : *Fa freg*, il fait froid.'
						},
						{
							q: 'Pour « il y a du soleil », Lisa dit…',
							options: ['Fa solelh.', 'Fa caud.', 'Plòu.'],
							correct: 0,
							oc: true,
							choses: ['fa-solelh'],
							explain: 'Le soleil et le vent se disent aussi avec *fa* : *Fa solelh*, *Fa vent*. Mot à mot : il fait soleil, il fait vent.'
						},
						{
							q: 'Pour « il pleut », Yasmine dit…',
							options: ['Plòu.', 'Fa plòu.', 'Nèva.'],
							correct: 0,
							oc: true,
							choses: ['plou'],
							explain: '*Plòu* : un seul mot, sans *fa*. Pareil pour *Nèva* : il neige.'
						},
						{
							q: '*Uèi, plòu.* *Uèi* veut dire…',
							options: ['aujourd’hui', 'demain', 'maintenant'],
							correct: 0,
							choses: ['uei'],
							explain: '*uèi* : aujourd’hui. *deman* : demain, comme dans *A deman !* Et *ara* : maintenant.'
						},
						{
							q: '*Quin temps fa ?* demande Núria. Elle veut savoir…',
							options: ['le temps qu’il fait', 'l’heure qu’il est', 'ce que fait Yasmine'],
							correct: 0,
							choses: ['quin-temps-fa'],
							explain: '*Quin temps fa ?* : quel temps fait-il ? *Quina ora es ?*, c’est l’heure ; *Qué fas ?*, ce qu’on fait.'
						},
						{
							q: '*A Tolosa, plòu pas.*',
							options: ['À Toulouse, il ne pleut pas.', 'À Toulouse, il pleut un peu.', 'À Toulouse, il pleut aussi.'],
							correct: 0,
							choses: ['plou'],
							explain: '*pas* après le verbe, comme *Parli pas* : il ne pleut pas.'
						}
					]
				},
				{
					type: 'table',
					title: 'Le temps qu’il fait',
					intro: 'Tu l’as entendu au téléphone : souvent *fa*, parfois un seul mot.',
					head: ['', 'tu dis', 'ça sonne comme'],
					rows: [
						['chaud', '*Fa caud.*', '« fa CAOU »'],
						['froid', '*Fa freg.*', '« fa FRÉTCH »'],
						['beau', '*Fa bèl.*', '« fa BÈL »'],
						['du soleil', '*Fa solelh.*', '« fa sou-LÉL »'],
						['du vent', '*Fa vent.*', '« fa BÉN »'],
						['la pluie', '*Plòu.* · *la pluèja*', '« PLÒOU » · « la PLUÈ-djo »'],
						['la neige', '*Nèva.* · *la nèu*', '« NÈ-bo » · « la NÈOU »']
					],
					notes: [
						'Avec *fa* (il fait) : *Fa caud*, *Fa freg*, *Fa bèl*, et aussi *Fa solelh*, *Fa vent* : mot à mot, il fait soleil, il fait vent.',
						'En un seul mot : *Plòu* (il pleut), *Nèva* (il neige). Avec *la* devant, ce sont les noms : *la pluèja* (la pluie), *la nèu* (la neige).',
						'Pour dire non, *pas* après le verbe : *Plòu pas.* *Fa pas freg.*',
						'*uèi* (aujourd’hui) et *deman* (demain) ouvrent la phrase : *Uèi, plòu. Deman, fa solelh.*'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'quin-temps-fa', oc: 'Quin temps fa ?', sound: 'kin TÉMS FA', fr: 'quel temps fait-il ?' },
						{ id: 'fa-bel', oc: 'Fa bèl.', sound: 'fa BÈL', fr: 'il fait beau.' },
						{ id: 'fa-solelh', oc: 'Fa solelh.', sound: 'fa sou-LÉL', fr: 'il y a du soleil (*lo solelh* : le soleil).' },
						{ id: 'plou', oc: 'Plòu.', sound: 'PLÒOU', fr: 'il pleut.' },
						{ id: 'uei', oc: 'uèi', sound: 'UÈÏ', fr: 'aujourd’hui (*Uèi, plòu. Deman, fa solelh.*)' }
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
					title: 'À retenir : la suite du bulletin',
					intro: 'Quatre de plus : tu les entends à la radio.',
					items: [
						{ id: 'fa-caud', oc: 'Fa caud.', sound: 'fa CAOU', fr: 'il fait chaud.' },
						{ id: 'fa-freg', oc: 'Fa freg.', sound: 'fa FRÉTCH', fr: 'il fait froid.' },
						{ id: 'fa-vent', oc: 'Fa vent.', sound: 'fa BÉN', fr: 'il y a du vent (*lo vent* : le vent).' },
						{ id: 'neva', oc: 'Nèva.', sound: 'NÈ-bo', fr: 'il neige.' }
					]
				},
				// jeu prévu par la carte : bulletin météo à écouter (à enregistrer).
				// Version simple : le bulletin lu (dialogue), puis « Prépare ton sac »
				// (qcm) : pour bien choisir, il faut avoir compris le temps de chaque ville.
				{
					type: 'dialogue',
					title: 'À la radio : le temps de demain',
					intro: 'Le soir, à la radio, en occitan : le bulletin météo. Lis-le, puis aide chacun à préparer son sac pour demain.',
					scenes: [
						{
							title: 'Lo temps de deman',
							subtitle: '(à la radio, le soir)',
							lines: [
								{ oc: 'Bon ser ! Lo temps de deman.', sound: 'bou(n) SÉR ! lou TÉMS dé dé-MA.', fr: 'Bonsoir ! Le temps de demain.' },
								{ oc: 'A Tolosa, fa vent, e fa freg.', sound: 'a tou-LOU-zo, fa BÉN, é fa FRÉTCH.', fr: 'À Toulouse, il y a du vent, et il fait froid.' },
								{ oc: 'A Montpelhièr, fa bèl : fa solelh, e fa caud.', sound: 'a moun-pé-LYÈ, fa BÈL : fa sou-LÉL, é fa CAOU.', fr: 'À Montpellier, il fait beau : il y a du soleil, et il fait chaud.' },
								{ oc: 'A Carcassona, plòu lo matin ; lo ser, fa bèl.', sound: 'a car-ca-SOU-no, PLÒOU lou ma-TI ; lou SÉR, fa BÈL.', fr: 'À Carcassonne, il pleut le matin ; le soir, il fait beau.' },
								{ oc: 'A Besièrs, fa solelh, mas fa vent.', sound: 'a bé-ZYÈS, fa sou-LÉL, mas fa BÉN.', fr: 'À Béziers, il y a du soleil, mais il y a du vent.' },
								{ oc: 'A Rodés… nèva !', sound: 'a rou-DÉS… NÈ-bo !', fr: 'À Rodez… il neige !' },
								{ oc: 'Bon ser, e a deman !', sound: 'bou(n) SÉR, é a dé-MA !', fr: 'Bonne soirée, et à demain !' }
							]
						}
					],
					glossary: [{ oc: 'Rodés', sound: 'rou-DÉS', fr: 'Rodez, en Rouergue (tu l’as vu sur la carte, en 1.3)' }]
				},
				{
					type: 'qcm',
					title: 'Prépare ton sac',
					intro: 'Demain, chacun part quelque part. D’après le bulletin, que prend-il ?',
					items: [
						{
							q: 'Karim va à Toulouse. Il prend…',
							options: ['une écharpe : du vent et du froid', 'un parapluie : de la pluie', 'un chapeau de soleil : de la chaleur'],
							correct: 0,
							choses: ['fa-vent', 'fa-freg'],
							explain: '*A Tolosa, fa vent, e fa freg* : écharpe et bonnet !'
						},
						{
							q: 'Lisa reste à Montpellier. Elle prend…',
							options: ['des lunettes de soleil', 'un parapluie', 'des bottes pour la neige'],
							correct: 0,
							choses: ['fa-solelh', 'fa-caud'],
							explain: '*Fa solelh, e fa caud* : soleil et chaleur, à Montpellier.'
						},
						{
							q: 'Marià va à Carcassonne, le matin. Elle prend…',
							options: ['un parapluie', 'des lunettes de soleil', 'des bottes pour la neige'],
							correct: 0,
							choses: ['plou'],
							explain: '*A Carcassona, plòu lo matin* : un parapluie. Le soir, il fera beau.'
						},
						{
							q: 'Loís veut voir la neige. Il va…',
							options: ['à Rodez', 'à Béziers', 'à Carcassonne'],
							correct: 0,
							choses: ['neva'],
							explain: '*A Rodés… nèva !* Rodez, en Rouergue.'
						},
						{
							q: 'Núria va à Béziers. Le bulletin dit…',
							options: ['du soleil, mais du vent', 'du soleil, et pas de vent', 'de la pluie le matin'],
							correct: 0,
							choses: ['fa-solelh', 'fa-vent', 'noms-vilas'],
							explain: '*A Besièrs, fa solelh, mas fa vent* : *mas*, mais.'
						},
						{
							q: 'Où fait-il chaud, demain ?',
							options: ['à Montpellier', 'à Toulouse', 'à Rodez'],
							correct: 0,
							choses: ['fa-caud'],
							explain: 'Seulement à Montpellier : *fa caud*.'
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
					title: 'À retenir : deux noms',
					intro: 'Pour parler de la pluie et de la neige elles-mêmes.',
					items: [
						{ id: 'la-plueja', oc: 'la pluèja', sound: 'la PLUÈ-djo', fr: 'la pluie' },
						{ id: 'la-neu', oc: 'la nèu', sound: 'la NÈOU', fr: 'la neige' }
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Demande quel temps il fait.',
							answers: ['Quin temps fa ?'],
							choses: ['quin-temps-fa'],
							explain: '*Quin temps fa ?* : quel temps fait-il ?'
						},
						{
							consigne: 'Il pleut, et il fait froid.',
							answers: ['Plòu, e fa freg.'],
							choses: ['plou', 'fa-freg'],
							explain: '*Plòu* : un seul mot. *Fa freg* : il fait froid.'
						},
						{
							consigne: 'Aujourd’hui, il fait beau.',
							answers: ['Uèi, fa bèl.', 'Fa bèl, uèi.'],
							choses: ['uei', 'fa-bel'],
							explain: '*uèi* : aujourd’hui ; *fa bèl* : il fait beau.'
						},
						{
							consigne: 'Il ne neige pas.',
							answers: ['Nèva pas.'],
							choses: ['neva'],
							explain: '*pas* après le verbe.'
						},
						{
							consigne: 'Il fait chaud, et il y a du soleil.',
							answers: ['Fa caud, e fa solelh.'],
							choses: ['fa-caud', 'fa-solelh'],
							explain: 'Deux fois *fa* : il fait chaud, il fait soleil.'
						},
						{
							consigne: 'À Toulouse, il y a du vent.',
							answers: ['A Tolosa, fa vent.', 'Fa vent a Tolosa.'],
							choses: ['fa-vent'],
							explain: '*Fa vent* : mot à mot, il fait vent.'
						},
						{
							consigne: 'J’aime la neige !',
							answers: ['M’agrada la nèu !'],
							choses: ['m-agrada', 'la-neu'],
							explain: '*M’agrada* : j’aime (unité 5). *la nèu* : la neige.'
						},
						{
							consigne: 'Je n’aime pas la pluie.',
							answers: ['M’agrada pas la pluèja.'],
							choses: ['m-agrada', 'la-plueja'],
							explain: '*M’agrada pas* : je n’aime pas. *la pluèja* : la pluie.'
						},
						{
							consigne: 'Et chez toi ? Dis le temps qu’il fait aujourd’hui, pour de vrai. Commence par *Uèi,…*',
							debut: ['Uèi', 'Aquí, uèi', 'Uèi, aquí'],
							choses: ['uei'],
							explain: 'Par exemple : *Uèi, fa solelh, mas fa freg.*'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Aujourd’hui, il pleut ; demain, il y a du soleil.',
							tiles: ['Uèi,', 'plòu ;', 'deman,', 'fa', 'solelh.'],
							choses: ['uei', 'plou', 'fa-solelh'],
							explain: '*Uèi* et *deman* ouvrent la phrase, comme dans le bulletin.'
						},
						{
							prompt: 'À Rodez, il neige, et il fait froid.',
							tiles: ['A', 'Rodés,', 'nèva,', 'e', 'fa', 'freg.'],
							choses: ['neva', 'fa-freg'],
							explain: '*nèva* : un seul mot ; *fa freg* : avec *fa*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro:
						'Une personne que tu connais vit ailleurs : dis où elle habite, et quel temps il fait chez elle aujourd’hui (invente, si tu ne sais pas). Puis compare au modèle.',
					items: [
						{
							q: 'Ta cousine, un ami, ta grand-mère…',
							a: 'Par exemple : *Ma cosina demòra a Besièrs. Uèi, a Besièrs, fa solelh, mas fa vent. Aquí, plòu !*'
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
					title: 'Le son du jour : òu et èu',
					paragraphs: [
						'Dans *plòu* et *nèu*, deux sons glissent l’un dans l’autre : « PLÒOU », « NÈOU ».',
						'Tu les entends déjà dans *A lèu !* « a LÈOU », *nòu* « NÒOU », *dijòus* « di-DJÒOUS ».',
						'Écoute, puis répète : *plòu*, *la nèu*, *A lèu !*'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*Plòu* se dit…',
							options: ['PLÒOU', 'PLOU'],
							correct: 0,
							noShuffle: true,
							explain: '« PLOU », c’est la lecture à la française. En occitan, on entend « Ò », puis « ou ».'
						},
						{
							q: '*la nèu* se dit…',
							options: ['la NÈOU', 'la NEU'],
							correct: 0,
							noShuffle: true,
							explain: '« NEU », c’est la lecture à la française. En occitan : « è », puis « ou ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Uèi plòu, e deman nèva !*',
							a: '« UÈÏ PLÒOU, é dé-MA NÈ-bo ! » : aujourd’hui il pleut, et demain il neige.'
						},
						{
							q: '*Dijòus, la nèu ; divendres, la pluèja. A lèu !*',
							a: '« di-DJÒOUS, la NÈOU ; di-BÉN-drés, la PLUÈ-djo. a LÈOU ! » : trois fois le glissement.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : les vents ont des noms occitans',
					// Chanson donnée par son lien seulement (cursus/cultura-A1.md, unité 6 :
					// titre vérifié, paroles non vérifiées). cers et autan : absents du
					// Basic, écrits en français, sans italique.
					lien: { href: 'https://www.deezer.com/track/380601921', texte: 'Écouter Plòu a Marselha (Lou Dalfin) sur Deezer' },
					paragraphs: [
						'Quand *fa vent*, dans le Midi, le vent porte souvent un nom venu de l’occitan. Le mistral, c’est le « vent maître » de l’ancien provençal. L’autan vient du latin altanus, le vent qui arrive de la haute mer. Le cers, mot du Bas-Languedoc, est écrit à Narbonne dès 1167.',
						'Source : TLFi, articles « mistral », « autan » et « cers ».',
						'À écouter : Lou Dalfin, un groupe occitan des vallées d’Italie, chante *Plòu a Marselha* (il pleut à Marseille).'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander quel temps il fait',
						'dire s’il fait chaud, froid, beau, du vent ou du soleil',
						'dire qu’il pleut ou qu’il neige, aujourd’hui ou demain',
						'comprendre un petit bulletin météo'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant dire le temps qu’il fait.',
						'Si tu en as envie : un matin, dis le temps du jour en occitan à une personne précise, ta fille, ton colocataire, une collègue : *Uèi, fa…* Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
