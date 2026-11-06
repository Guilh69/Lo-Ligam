// Halte 1 · A1 · « Pausa 1 » : réemploi des unités 1 et 2 dans une situation
// nouvelle, une rencontre à la fièra (carte de l'A1 §4-§5 ; cursus/lexic-A1.md,
// Halte 1), rédigée par Claude le 2026-11-01. Aucun mot nouveau : seulement
// l'« À retenir » des modules 0 à 2.4 (les `choses` portent leurs id), plus
// *pausa* et *fièra*, glosés.
// Chemin d'une halte : Révision du jour · Escota · Lo jòc del jorn (dialogue à
// choix, avec le tour « rester en occitan », règle 13) · A tu ! · Lo bilanç
// (ce que je sais faire, puis le carnet de révision).
// Personnages cohérents avec l'unité 1 et les unités 3-4 déjà rédigées : Marià,
// la voisine âgée, tutoie Yasmine, qui la vouvoie (1.1) ; Núria est de Barcelone
// et étudie à Toulouse (1.3, 4.2) ; Karim est de Béziers, vit à Toulouse (1.3)
// et parle un peu occitan (4.1).
// ⚠️ Occitan à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modulPausa1 = {
	id: 'modul-pausa-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: 'pausa-1',
	unitat: 'Pausa 1',
	nivel: 'A1 · Pausa 1 · unitats 1 e 2',
	oc: 'Pausa 1',
	fr: 'Halte 1 : réemploi des unités 1 et 2, puis bilan',
	cando:
		'Je peux, à une fête, saluer, me présenter et présenter quelqu’un, dire d’où je suis et quelles langues je parle, et faire répéter sans passer au français.',
	durada: '~35 min · 5 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Yasmine', 'Núria', 'Marià', 'Karim'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Yasmine dit *Parli plan occitan* : *plan* à cette place, ou plutôt *Parli occitan plan* ?',
		'Tour « rester en occitan » : Karim passe au français parce que tu hésites (« Bon, je te le dis en français, ce sera plus simple ! ») ; la bonne réponse est *Pòdes repetir, se te plai ?* La scène sonne juste pour toi ?',
		'Karim, devant un gâteau qu’il ne connaît pas : *Non sabi pas ! Mas es bon.* D’accord pour « c’est bon » ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'De mémoire',
					intro: 'Avant la foire, trois questions sur les unités 1 et 2. Une à la fois.',
					// *pausa* (titre du module), glosé ici (cursus/lexic-A1.md, Halte 1).
					glosa: { pausa: 'halte' },
					items: [
						{
							q: 'En plein jour, tu croises Marià, la voisine âgée, que tu vouvoies. Tu lui dis…',
							options: ['Bonjorn ! Cossí anatz ?', 'Bonjorn ! Cossí vas ?', 'Bon ser ! Cossí anatz ?'],
							correct: 0,
							oc: true,
							choses: ['bonjorn', 'cossi-anatz'],
							explain: 'En journée : *Bonjorn !* Et pour vouvoyer : *Cossí anatz ?*'
						},
						{
							q: 'Núria arrive de Barcelone. Elle est…',
							options: ['catalana', 'catalan', 'italiana'],
							correct: 0,
							oc: true,
							choses: ['catalan-catalana'],
							explain: 'Núria est une femme : *catalana*, avec le *-a* du féminin.'
						},
						{
							q: 'Quelqu’un te parle trop vite. Tu lui demandes…',
							options: ['Pòdes repetir, se te plai ?', 'Qu’es aquò ?', 'Qui es ?'],
							correct: 0,
							oc: true,
							choses: ['podes-repetir'],
							explain: '*Pòdes repetir, se te plai ?* : tu peux répéter, s’il te plaît ? *Qu’es aquò ?*, c’est pour une chose ; *Qui es ?*, pour une personne.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'De mémoire (écris)',
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Demande à quelqu’un que tu tutoies : parles-tu occitan ?',
							answers: ['Parlas occitan ?'],
							choses: ['parlas-occitan'],
							explain: '*Parlas occitan ?* : la voix monte, et la phrase devient une question.'
						},
						{
							consigne: 'Dis : je ne parle pas catalan, mais je comprends.',
							answers: ['Non parli pas catalan, mas compreni.'],
							choses: ['pas', 'mas'],
							explain: '*Non* devant le verbe, *pas* après : *Non parli pas catalan.*'
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
					title: 'À la foire',
					intro:
						'Dimanche, c’est la *fièra* (la foire) au village : des étals, de la musique, du monde. Yasmine fait connaissance avec Núria, puis elle croise Marià, la voisine âgée. Lis une première fois pour répondre à une seule question : qui parle le mieux occitan, Yasmine ou Núria ?',
					glosa: { fièra: 'foire' },
					scenes: [
						{
							title: 'Yasmine e Núria',
							subtitle: '(devant un étal ; elles se tutoient)',
							lines: [
								{ oc: 'Adieu ! Cossí te dison ?', sound: 'a-DIOU ! cou-si té DI-zoun ?', fr: 'Salut ! Comment tu t’appelles ?' },
								{ oc: 'Me dison Núria. E tu ?', sound: 'mé DI-zoun NOU-ria. é TU ?', fr: 'Je m’appelle Núria. Et toi ?' },
								{ oc: 'Ieu, m’apèli Yasmine. D’ont siás ?', sound: 'YÉOU, ma-PÈ-li yas-MI-ne. doun SYOS ?', fr: 'Moi, je m’appelle Yasmine. D’où es-tu ?' },
								{
									oc: 'Soi de Barcelona, mas demòri a Tolosa. E tu, parlas occitan ?',
									sound: 'souï dé bar-sé-LOU-no, mas dé-MÒ-ri a tou-LOU-zo. é TU, PAR-los ou-tsi-TA ?',
									fr: 'Je suis de Barcelone, mais j’habite à Toulouse. Et toi, tu parles occitan ?'
								},
								{
									oc: 'Òc, parli plan occitan, e tanben francés e anglés !',
									sound: 'OK, PAR-li PLA ou-tsi-TA, é tam-BÉ fran-SÉS é an-GLÉS !',
									fr: 'Oui, je parle bien occitan, et aussi français et anglais !'
								},
								{ oc: 'Pòdes repetir, se te plai ?', sound: 'PÒ-dés ré-pé-TI, sé té PLAÏ ?', fr: 'Tu peux répéter, s’il te plaît ?' },
								{ oc: 'Parli plan occitan. E tu ?', sound: 'PAR-li PLA ou-tsi-TA. é TU ?', fr: 'Je parle bien occitan. Et toi ?' },
								{
									oc: 'Parli catalan e espanhòl, e un pauc occitan. Mas compreni plan !',
									sound: 'PAR-li ca-ta-LA é es-pa-GNÒL, é un PAOUK ou-tsi-TA. mas coum-PRÉ-ni PLA !',
									fr: 'Je parle catalan et espagnol, et un peu occitan. Mais je comprends bien !'
								}
							]
						},
						{
							title: 'Yasmine e Marià',
							subtitle: '(un peu plus loin ; Yasmine vouvoie Marià)',
							lines: [
								{ oc: 'Bonjorn, Marià ! Cossí anatz ?', sound: 'boun-DJOUR, ma-ri-A ! cou-si a-NATS ?', fr: 'Bonjour, Marià ! Comment allez-vous ?' },
								{ oc: 'Va plan, mercés. E tu ? Qui es ?', sound: 'ba PLA, mér-SÉS. é TU ? ki ÉS ?', fr: 'Ça va bien, merci. Et toi ? Qui est-ce ?' },
								{ oc: 'Es Núria. Es catalana, de Barcelona.', sound: 'és NOU-ria. és ca-ta-LA-no, dé bar-sé-LOU-no.', fr: 'C’est Núria. Elle est catalane, de Barcelone.' },
								{ oc: 'Parla occitan ?', sound: 'PAR-lo ou-tsi-TA ?', fr: 'Elle parle occitan ?' },
								{ oc: 'Un pauc. Mas compren plan !', sound: 'un PAOUK. mas coum-PRÉ(N) PLA !', fr: 'Un peu. Mais elle comprend bien !' },
								{ oc: 'A lèu, Yasmine !', sound: 'a LÈOU, yas-MI-ne !', fr: 'À bientôt, Yasmine !' },
								{ oc: 'A lèu, Marià ! Adieu-siatz !', sound: 'a LÈOU, ma-ri-A ! a-di-SSIATS !', fr: 'À bientôt, Marià ! Au revoir !' }
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
							q: 'Qui parle le mieux occitan, Yasmine ou Núria ?',
							options: ['Yasmine', 'Núria', 'autant l’une que l’autre'],
							correct: 0,
							noShuffle: true,
							choses: ['un-pauc-plan'],
							explain: 'Yasmine : *Parli plan occitan.* Núria : *un pauc occitan*, un peu. Mais elle comprend bien : *Compreni plan !*'
						},
						{
							q: 'Où habite Núria ?',
							options: ['à Toulouse', 'à Barcelone', 'ici, au village'],
							correct: 0,
							choses: ['demori-a'],
							explain: '*Soi de Barcelona, mas demòri a Tolosa* : je suis de Barcelone, mais j’habite à Toulouse.'
						},
						{
							q: 'Marià demande *Qui es ?* Elle veut savoir…',
							options: ['qui est Núria', 'comment va Núria', 'd’où vient Núria'],
							correct: 0,
							choses: ['qui-es'],
							explain: '*Qui es ?* : qui est-ce ? Yasmine répond : *Es Núria.*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 9,
			blocks: [
				{
					type: 'causida',
					title: 'Rencontre avec Karim',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Karim te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Karim',
					tours: [
						{
							situacion:
								'À la foire, devant l’étal des gâteaux, un jeune homme que tu ne connais pas engage la conversation. Il te tutoie.',
							ditz: 'Adieu ! Cossí te dison ?',
							options: [
								{ oc: 'Me dison…', bon: true },
								{ oc: 'Soi de…', reaccion: 'Le jeune homme sourit : il saura bientôt d’où tu es, mais pour l’instant, il voulait ton nom.' },
								{ oc: 'Va plan, e tu ?', reaccion: 'Le jeune homme rit : il ne t’a pas demandé comment tu vas, mais comment tu t’appelles.' }
							],
							choses: ['cossi-te-dison', 'me-dison'],
							explain: 'Il te demande ton nom : *Me dison…* ou *M’apèli…*, puis ton prénom.'
						},
						{
							ditz: 'Ieu, me dison Karim. D’ont siás ?',
							options: [
								{ oc: 'Soi de…', bon: true },
								{ oc: 'Me dison…', reaccion: 'Karim sourit : ton nom, il le connaît déjà. Il veut savoir d’où tu es.' },
								{ oc: 'Qui es ?', reaccion: 'Karim se retourne : il n’y a personne derrière lui. C’est d’où tu es qu’il veut savoir.' }
							],
							choses: ['d-ont-sias', 'soi-de'],
							explain: '*D’ont siás ?* : d’où es-tu ? Réponds *Soi de…*, puis ta ville.'
						},
						{
							ditz: 'E parlas occitan ?',
							options: [
								{ oc: 'Parli un pauc occitan.', bon: true },
								{ oc: 'Parla un pauc occitan.', reaccion: 'Karim regarde autour de lui : qui ça, « il » ou « elle » ? C’est à toi qu’il le demandait.' },
								{ oc: 'Parlas un pauc occitan.', reaccion: 'Karim éclate de rire : *parlas*, c’est « tu parles ». Il voulait savoir pour toi, pas pour lui.' }
							],
							choses: ['parlar-singular', 'un-pauc-plan'],
							explain: 'Pour toi, la fin du verbe : *parli*. *Parlas*, c’est « tu parles » ; *parla*, « il ou elle parle ».'
						},
						{
							situacion: 'À ton tour : demande-lui s’il parle occitan, lui aussi.',
							options: [
								{ oc: 'E tu, parlas occitan ?', bon: true },
								{ oc: 'E tu, siás occitan ?', reaccion: 'Karim répond qu’il est de Béziers… Mais toi, tu voulais savoir s’il parle la langue.' },
								{ oc: 'Qué vòl dire occitan ?', reaccion: 'Karim ouvre de grands yeux : tu parles occitan depuis le début !' }
							],
							choses: ['parlas-occitan'],
							explain: '*E tu, parlas occitan ?* : et toi, tu parles occitan ?'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Karim répond, ravi, mais très vite, en mélangeant tout. Tu hésites ; alors il passe au français, encore plus vite : « Bon, je te le dis en français, ce sera plus simple ! »',
							options: [
								{ oc: 'Pòdes repetir, se te plai ?', bon: true },
								{ oc: 'Non compreni pas.', reaccion: 'Karim, gentil, te réexplique tout en français… et l’occitan s’arrête là. Demande-lui plutôt de répéter : il le fera en occitan.' },
								{ oc: 'Non sabi pas.', reaccion: 'Karim continue en français, un peu perdu : qu’est-ce que tu ne sais pas ? Demande-lui plutôt de répéter.' }
							],
							choses: ['podes-repetir'],
							explain: 'Pour rester en occitan : *Pòdes repetir, se te plai ?* Karim répète en occitan, plus lentement.'
						},
						{
							ditz: 'Parli francés e espanhòl, e un pauc occitan. E tu, comprenes ?',
							options: [
								{ oc: 'Òc, compreni plan !', bon: true },
								{ oc: 'Òc, compren plan !', reaccion: 'Karim cherche des yeux : qui ça, « il comprend » ? C’est toi qu’il interrogeait.' },
								{ oc: 'Non sabi pas.', reaccion: 'Karim sourit, perplexe : tu ne sais pas si tu comprends ? Il a pourtant parlé lentement.' }
							],
							choses: ['comprene-singular'],
							explain: '*Compreni* : je comprends. *Comprenes* : tu comprends ; *compren* : il ou elle comprend.'
						},
						{
							situacion: 'Karim te tend une petite pâtisserie que tu ne connais pas.',
							options: [
								{ oc: 'Qu’es aquò ?', bon: true },
								{ oc: 'Qui es ?', reaccion: 'Karim rit : ce n’est pas quelqu’un, c’est un gâteau !' },
								{ oc: 'D’ont siás ?', reaccion: 'Karim répond qu’il est de Béziers, puis attend : c’est le gâteau qui t’intriguait, non ?' }
							],
							choses: ['que-es-aquo'],
							explain: '*Qu’es aquò ?* : qu’est-ce que c’est ? Pour une personne : *Qui es ?*'
						},
						{
							ditz: 'Non sabi pas ! Mas es bon. A lèu !',
							options: [
								{ oc: 'A lèu, Karim !', bon: true },
								{ oc: 'Bonjorn, Karim !', reaccion: 'Karim, déjà en route, se retourne : c’est l’heure de se dire au revoir, pas bonjour.' },
								{ oc: 'Cossí vas ?', reaccion: 'Karim lève la main de loin : il est déjà parti, la question attendra.' }
							],
							choses: ['a-leu'],
							explain: '*A lèu !* : à bientôt ! Karim ne sait pas ce qu’est ce gâteau, mais il le trouve bon : *es bon*.'
						}
					],
					fin: 'Bravo ! Une rencontre entière en occitan, du nom jusqu’au gâteau, sans passer au français.'
				}
			]
		},

		// ————————————————————————————————— 4. A tu !
		{
			title: 'A tu !',
			fr: 'à toi !',
			minutes: 9,
			blocks: [
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro:
						'Écris en occitan. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Le soir, tu croises Marià, la voisine âgée : salue-la et demande-lui comment elle va.',
							answers: ['Bon ser ! Cossí anatz ?', 'Bon ser, Marià ! Cossí anatz ?'],
							choses: ['bon-ser', 'cossi-anatz'],
							explain: 'Le soir : *Bon ser !* Pour vouvoyer : *Cossí anatz ?*'
						},
						{
							consigne: 'Demande son nom à une dame que tu ne connais pas.',
							answers: ['Cossí vos dison ?', 'Cossí vos apelatz ?'],
							choses: ['cossi-vos-dison'],
							explain: 'En vouvoyant : *Cossí vos dison ?* ou *Cossí vos apelatz ?*'
						},
						{
							consigne: 'Dis ton nom.',
							debut: ['Me dison', 'M’apèli', 'Ieu, me dison', 'Ieu, m’apèli'],
							choses: ['me-dison'],
							explain: '*Me dison…* ou *M’apèli…*, puis ton prénom.'
						},
						{
							consigne: 'Dis d’où tu es : je suis de… (ta ville).',
							debut: ['Soi de', 'Soi d’'],
							choses: ['soi-de'],
							explain: '*Soi de…*, puis ta ville.'
						},
						{
							consigne: 'Dis quelles langues tu parles : je parle…',
							debut: ['Parli'],
							choses: ['parlar-singular'],
							explain: '*Parli…*, puis tes langues : *Parli francés e un pauc occitan.*'
						},
						{
							consigne: 'Tu n’as pas compris : demande de répéter, poliment.',
							answers: ['Pòdes repetir, se te plai ?'],
							choses: ['podes-repetir']
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Elle est italienne, mais elle habite ici.',
							tiles: ['Es', 'italiana,', 'mas', 'demòra', 'aquí.'],
							choses: ['italian-italiana', 'mas', 'demori-a'],
							explain: '*Es italiana, mas demòra aquí.* Au féminin : *italiana*.'
						},
						{
							prompt: 'Qu’est-ce que c’est ? Je ne sais pas.',
							tiles: ['Qué', 'es', 'aquò ?', 'Non', 'sabi', 'pas.'],
							choses: ['que-es-aquo', 'sabi-pas'],
							explain: '*Qu’es aquò ? Non sabi pas.* *Non* devant le verbe, *pas* après.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Présente quelqu’un',
					intro:
						'Pense à une personne que tu connais et qui parle une autre langue que le français. Présente-la à voix haute : son nom, d’où elle est, où elle habite, quelles langues elle parle. Puis compare au modèle.',
					items: [
						{
							q: 'Ta présentation, en quatre phrases.',
							a: 'Par exemple : *Es Núria. Es catalana, de Barcelona, mas demòra a Tolosa. Parla catalan e espanhòl, e un pauc occitan. Compren plan !*'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 5. Lo bilanç
		{
			title: 'Lo bilanç',
			fr: 'le bilan',
			minutes: 3,
			blocks: [
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais déjà faire.',
					items: [
						'saluer quelqu’un et demander comment ça va, en tutoyant ou en vouvoyant',
						'me présenter : mon nom, d’où je suis, où j’habite',
						'présenter quelqu’un : son nom, d’où il ou elle est',
						'dire quelles langues je parle, un peu ou bien',
						'rester en occitan quand je ne comprends pas : faire répéter, demander ce qu’est une chose'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de la halte 1',
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant faire connaissance en occitan : saluer, te présenter, dire quelles langues tu parles, et faire répéter plutôt que passer au français. La suite : l’unité 3, la famille.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Ton carnet de révision',
					paragraphs: [
						'Les exercices que tu fais remplissent ton carnet de révision, à l’adresse loligam.eu/aprene/carnet. Il marche sans compte : il reste dans ton navigateur.',
						'Deux cartes par chose : « je reconnais », puis « je produis ». Une carte est acquise après deux réussites, à deux jours différents. Passe le voir avant l’unité 3.'
					],
					// Lien vers le carnet, affiché par NoteBlock ; l'adresse reste aussi dans le texte.
					lien: { href: '/aprene/carnet', texte: 'Ouvrir mon carnet de révision' }
				}
			]
		}
	]
};
