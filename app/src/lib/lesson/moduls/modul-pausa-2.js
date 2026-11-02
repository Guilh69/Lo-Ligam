// Halte 2 · A1 · « Pausa 2 » : réemploi des unités 3 et 4 dans une situation
// nouvelle, un dimanche en famille (carte de l'A1 §4-§5 ; cursus/lexic-A1.md,
// Halte 2), rédigée par Claude le 2026-11-01. Aucun mot nouveau : seulement
// l'« À retenir » des modules 0 à 4.4 (les `choses` portent leurs id), plus
// *pausa*, glosé.
// Chemin d'une halte : Révision du jour · Escota · Lo jòc del jorn (dialogue à
// choix, avec le tour « rester en occitan », règle 13) · A tu ! · Lo bilanç
// (ce que je sais faire, puis le carnet de révision).
// La famille est celle de Karim, telle que l'unité 3 la pose (Rachid, le père ;
// Mirèlha, la mère ; Inès, la sœur, douze ans, et sa chatte Mimí en 3.3) ;
// Karim est infirmier (4.2) et joue au rugby le mercredi et le dimanche (4.3) ;
// Yasmine est paysanne (4.2). Inventés ici, à harmoniser si 4.4 en dit
// autre chose : les métiers des parents (Mirèlha regenta, Rachid fornièr) et
// les frères et sœurs de Yasmine.
// ⚠️ Occitan à valider par Romain.
// Ne pas changer `slug` ni `unitat` (le fil de l'unité regroupe les modules par `unitat`).

export const modulPausa2 = {
	id: 'modul-pausa-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: 'pausa-2',
	unitat: 'Pausa 2',
	nivel: 'A1 · Pausa 2 · unitats 3 e 4',
	oc: 'Pausa 2',
	fr: 'Halte 2 : réemploi des unités 3 et 4, puis bilan',
	cando:
		'Je peux parler de ma famille, dire l’âge de quelqu’un, ce qu’il ou elle fait dans la vie et le dimanche, et poser ces questions à mon tour.',
	durada: '~35 min · 5 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Karim', 'Yasmine', 'Inès', 'Rachid', 'Mirèlha', 'Mimí'],
	// Questions pour la fiche de relecture de Romain.
	notesRelecture: [
		'Mirèlha, la mère de Karim, tutoie Yasmine (une amie de son fils) ; Yasmine la vouvoie, comme Marià en 1.1. D’accord ?',
		'*Lo dimenge, Rachid cosina !* : *cosina* (il cuisine) s’écrit comme *la cosina* (la cousine) ; l’explication le dit. On garde ?',
		'Inès, douze ans, parle occitan (comme en 3.4) mais passe au français quand ça va vite : *Inès parla occitan e francés.* Ça te va ?'
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
					intro: 'Avant le repas, trois questions sur les unités 3 et 4. Une à la fois.',
					// *pausa* (titre du module), glosé ici comme dans la halte 1.
					glosa: { pausa: 'halte' },
					items: [
						{
							q: 'Combien font *dos* et *tres* ?',
							options: ['cinc', 'sièis', 'quatre'],
							correct: 0,
							oc: true,
							choses: ['nombre-5'],
							explain: '*Dos e tres : cinc.* Deux et trois, cinq.'
						},
						{
							q: 'La mère de ta mère, c’est…',
							options: ['ta mameta', 'ta tanta', 'ta cosina'],
							correct: 0,
							oc: true,
							choses: ['papeta-mameta'],
							explain: '*La mameta* : la grand-mère. *La tanta*, c’est la tante ; *la cosina*, la cousine.'
						},
						{
							q: 'Le jour qui vient après *dissabte*, c’est…',
							options: ['dimenge', 'diluns', 'divendres'],
							correct: 0,
							oc: true,
							choses: ['dimenge'],
							explain: 'Après *dissabte* (samedi) vient *dimenge* (dimanche). *Divendres*, c’est la veille du samedi.'
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
							consigne: 'Demande son âge à quelqu’un que tu tutoies.',
							answers: ['Quant as d’ans ?'],
							choses: ['quant-as-d-ans'],
							explain: '*Quant as d’ans ?* Mot à mot : combien as-tu d’ans ?'
						},
						{
							consigne: 'Dis : je travaille à Toulouse.',
							answers: ['Trabalhi a Tolosa.'],
							choses: ['trabalhar'],
							explain: '*Trabalhi* : la fin *-i* dit « je ».'
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
					title: 'Un dimanche à Béziers',
					intro:
						'Un dimanche, Karim invite son amie Yasmine chez ses parents, à Béziers. Elle ne connaît pas encore sa famille : Mirèlha, la mère de Karim, l’accueille à la porte, puis Inès, sa petite sœur, vient lui parler. Lis une première fois pour répondre à une seule question : dans cette famille, qui cuisine le dimanche ?',
					scenes: [
						{
							title: 'Mirèlha e Yasmine',
							subtitle: '(à la porte ; Yasmine vouvoie Mirèlha)',
							lines: [
								{
									oc: 'Bonjorn, Yasmine ! Me dison Mirèlha, la maire de Karim. Encantada !',
									sound: 'boun-DJOUR, yas-MI-ne ! mé DI-zoun mi-RÈ-lyo, la MAÏ-ré dé ka-RIM. én-can-TA-do !',
									fr: 'Bonjour, Yasmine ! Je m’appelle Mirèlha, la mère de Karim. Enchantée !'
								},
								{ oc: 'Encantada ! Cossí anatz ?', sound: 'én-can-TA-do ! cou-si a-NATS ?', fr: 'Enchantée ! Comment allez-vous ?' },
								{
									oc: 'Va plan, mercés ! E tu, qué fas dins la vida ?',
									sound: 'ba PLA, mér-SÉS ! é TU, ké FAS dins la BI-do ?',
									fr: 'Ça va bien, merci ! Et toi, que fais-tu dans la vie ?'
								},
								{ oc: 'Soi paisana. E vos ?', sound: 'souï paï-ZA-no. é BOUS ?', fr: 'Je suis paysanne. Et vous ?' },
								{
									oc: 'Ieu, soi regenta. E Rachid, lo paire de Karim, es fornièr.',
									sound: 'YÉOU, souï ré-DJÉN-to. é ra-CHID, lou PAÏ-ré dé ka-RIM, és four-NYÈ.',
									fr: 'Moi, je suis institutrice. Et Rachid, le père de Karim, est boulanger.'
								},
								{ oc: 'E lo dimenge ?', sound: 'é lou di-MÉN-djé ?', fr: 'Et le dimanche ?' },
								{ oc: 'Lo dimenge, Rachid cosina !', sound: 'lou di-MÉN-djé, ra-CHID cou-ZI-no !', fr: 'Le dimanche, Rachid fait la cuisine !' }
							]
						},
						{
							title: 'Inès e Yasmine',
							subtitle: '(au salon)',
							lines: [
								{
									oc: 'Adieu ! Ieu, me dison Inès. Ai dotze ans. As de fraires ?',
									sound: 'a-DIOU ! YÉOU, mé DI-zoun i-NÈS. AÏ DOUT-sé ANS. AS dé FRAÏ-rés ?',
									fr: 'Salut ! Moi, je m’appelle Inès. J’ai douze ans. Tu as des frères ?'
								},
								{ oc: 'Òc, ai un fraire e doas sòrres. E tu ?', sound: 'OK, AÏ un FRAÏ-ré é DOUOS SÒ-rrés. é TU ?', fr: 'Oui, j’ai un frère et deux sœurs. Et toi ?' },
								{ oc: 'Ieu, ai Karim… e Mimí, la cata !', sound: 'YÉOU, AÏ ka-RIM… é mi-MI, la CA-to !', fr: 'Moi, j’ai Karim… et Mimí, la chatte !' },
								{ oc: 'E qué fas lo dimenge ?', sound: 'é ké FAS lou di-MÉN-djé ?', fr: 'Et que fais-tu le dimanche ?' },
								{
									oc: 'Jògui amb Mimí. E lo dissabte, danci amb las amigas.',
									sound: 'DJÒ-gui am mi-MI. é lou di-SAT-té, DAN-si am la-za-MI-gos.',
									fr: 'Je joue avec Mimí. Et le samedi, je danse avec les copines.'
								},
								{ oc: 'E Karim, qué fa lo dimenge ?', sound: 'é ka-RIM, ké FA lou di-MÉN-djé ?', fr: 'Et Karim, que fait-il le dimanche ?' },
								// Comme en 4.3 et 4.4 : Karim joue au rugby le mercredi et le dimanche.
								{ oc: 'Jòga al rugbi !', sound: 'DJÒ-go al RUG-bi !', fr: 'Il joue au rugby !' }
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
							q: 'Dans cette famille, qui cuisine le dimanche ?',
							options: ['Rachid, le père de Karim', 'Mirèlha, la mère de Karim', 'Inès, la sœur de Karim'],
							correct: 0,
							choses: ['cosinar'],
							explain: 'Mirèlha le dit : *Lo dimenge, Rachid cosina !* Ici, *cosina* veut dire « il cuisine » (et *la cosina*, c’est la cousine : même mot, autre sens).'
						},
						{
							q: 'Que fait Mirèlha dans la vie ?',
							options: ['elle est institutrice', 'elle est boulangère', 'elle est paysanne'],
							correct: 0,
							choses: ['regent-regenta'],
							explain: '*Soi regenta* : je suis institutrice. Le boulanger, c’est Rachid (*es fornièr*) ; la paysanne, c’est Yasmine (*Soi paisana*).'
						},
						{
							q: 'Combien Yasmine a-t-elle de sœurs ?',
							options: ['deux', 'une', 'trois'],
							correct: 0,
							choses: ['nombre-2'],
							explain: '*Doas sòrres* : deux sœurs. Au féminin, *dos* devient *doas*.'
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
					title: 'À table avec Rachid',
					intro:
						'C’est toi qui parles : choisis chaque réplique. Si elle ne va pas, Rachid te le fait comprendre, et tu choisis de nouveau.',
					personatge: 'Rachid',
					tours: [
						{
							situacion:
								'Dimanche midi, chez les parents de Karim, à Béziers : toi aussi, tu es à table. Rachid, le père de Karim, te tutoie ; toi, tu le vouvoies.',
							ditz: 'E tu, qué fas dins la vida ?',
							options: [
								{ oc: 'Soi…', bon: true },
								{ oc: 'Es…', reaccion: 'Rachid se tourne vers Karim : c’est de lui que tu parles ? Il te demandait ton métier, à toi.' },
								{ oc: 'Qué fas ?', reaccion: 'Rachid rit : c’est lui qui vient de te poser la question.' }
							],
							choses: ['que-fas-dins-la-vida'],
							explain: '*Soi…*, puis ton métier, sans article : *Soi regent*, *Soi infirmièr*, *Soi estudianta*, *Soi a la retirada*.'
						},
						{
							situacion: 'À ton tour, demande-lui la même chose. Tu le vouvoies.',
							options: [
								{ oc: 'E vos ?', bon: true },
								{ oc: 'E tu ?', reaccion: 'Rachid sourit : lui te tutoie, mais toi, tu vouvoies le père de ton ami.' },
								{ oc: 'E ela ?', reaccion: 'Rachid regarde Mirèlha, puis toi : c’est sur lui que tu voulais en savoir plus, non ?' }
							],
							choses: ['va-plan-e-tu'],
							explain: 'Pour retourner la question en vouvoyant : *E vos ?*'
						},
						{
							ditz: 'Ieu, soi fornièr. E as de fraires ?',
							options: [
								{ oc: 'Òc, ai una sòrre.', bon: true },
								{ oc: 'Non, ai pas de fraires.', bon: true },
								{ oc: 'Òc, ai un can.', reaccion: 'Rachid rit : un chien, ce n’est pas tout à fait un frère… Il te demandait tes frères et sœurs.' }
							],
							choses: ['un-una-article', 'ai-pas-de'],
							explain: '*Ai una sòrre* : j’ai une sœur. *Ai pas de fraires* : après *pas*, on dit *de*.'
						},
						{
							ditz: 'E quant as d’ans ?',
							options: [
								{ oc: 'Ai… ans.', bon: true },
								{ oc: 'A… ans.', reaccion: 'Rachid cherche autour de la table : qui a cet âge ? C’est le tien qu’il demandait.' },
								{ oc: 'Quant as d’ans ?', reaccion: 'Rachid sourit : tu lui retournes la question avant d’avoir répondu ?' }
							],
							choses: ['quant-as-d-ans', 'a-ans'],
							explain: 'Pour toi : *Ai… ans*, j’ai… ans. Pour quelqu’un d’autre : *A… ans*.'
						},
						{
							ditz: 'E qué fas lo dimenge ?',
							options: [
								{ oc: 'Lo dimenge, canti e danci.', bon: true },
								{ oc: 'Lo dimenge, canta e dança.', reaccion: 'Rachid cherche des yeux : qui ça, « il » ou « elle » ? C’est ton dimanche à toi qui l’intéresse.' },
								{ oc: 'Lo diluns, canti e danci.', reaccion: 'Rachid hoche la tête : le lundi, d’accord. Mais le dimanche ?' }
							],
							choses: ['dimenge', 'cantar', 'dancar'],
							explain: 'Pour toi, la fin *-i* : *canti, danci*. Et *lo dimenge* : le dimanche, chaque dimanche.'
						},
						{
							// Règle 13 : rester en occitan quand l'autre passe au français.
							situacion:
								'Inès, douze ans, s’en mêle, très vite et en français : « Tu parles occitan avec papa ? Ça, alors ! Moi, je vais plus vite en français ! »',
							options: [
								{ oc: 'Òc, parli un pauc occitan. E tu ?', bon: true },
								{ oc: 'Compreni pas.', reaccion: 'Inès, ravie, te répond en français… et toute la table passe au français. Réponds-lui plutôt en occitan, avec une phrase que tu connais.' },
								{ oc: 'Sabi pas.', reaccion: 'Inès hausse les épaules et continue en français. Dommage : une phrase que tu connais aurait suffi.' }
							],
							choses: ['parlar-singular', 'un-pauc-plan'],
							explain: 'Rester en occitan, avec une phrase déjà connue : *Òc, parli un pauc occitan. E tu ?*'
						},
						{
							situacion: 'Le repas se termine, tu t’en vas.',
							ditz: 'Inès parla occitan e francés. A lèu !',
							options: [
								{ oc: 'A lèu ! Adieu-siatz !', bon: true },
								{ oc: 'A lèu ! Adieu !', reaccion: 'Rachid sourit, un peu surpris : depuis le début, tu le vouvoies.' },
								{ oc: 'Quant as d’ans ?', reaccion: 'Rachid éclate de rire : un peu tard pour lui demander son âge, tu as déjà ton manteau !' }
							],
							choses: ['a-leu', 'adieu-siatz'],
							explain: 'Tu vouvoies Rachid : *A lèu ! Adieu-siatz !*'
						}
					],
					fin: 'Bravo ! Un repas entier en occitan : ton métier, ta famille, ton âge, tes dimanches, et même une réponse en occitan à une question en français.'
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
						'Parle de toi, ou d’une famille inventée : c’est toi qui choisis. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre. Les lettres accentuées sont au-dessus du champ.',
					items: [
						{
							consigne: 'Dis ton âge : j’ai… ans. (Plus de vingt ans ? Invente-toi un âge : les dizaines arrivent dans l’unité 5.)',
							debut: ['Ai'],
							choses: ['quant-as-d-ans'],
							explain: '*Ai…*, puis le nombre, puis *ans*.'
						},
						{
							consigne: 'Ma sœur a douze ans.',
							answers: ['Ma sòrre a dotze ans.'],
							choses: ['la-sorre', 'a-ans', 'nombre-12']
						},
						{
							consigne: 'Dis ce que tu fais dans la vie : je suis… (ton métier).',
							debut: ['Soi', 'Ieu, soi'],
							choses: ['que-fas-dins-la-vida'],
							explain: '*Soi…*, puis ton métier, sans article : *Soi estudiant*, *Soi a la retirada*.'
						},
						{
							consigne: 'Le dimanche, je chante avec mon grand-père.',
							answers: ['Lo dimenge, canti amb mon papeta.'],
							choses: ['dimenge', 'cantar', 'amb', 'papeta-mameta']
						},
						{
							consigne: 'Il y a un chat, mais il n’y a pas de chien.',
							answers: ['I a un cat, mas i a pas de can.'],
							choses: ['i-a', 'lo-cat', 'lo-can']
						},
						{
							consigne: 'Nous mangeons avec la famille.',
							answers: ['Manjam amb la familha.'],
							choses: ['manjar', 'la-familha']
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Ma mère est infirmière, et elle travaille à Béziers.',
							tiles: ['Ma', 'maire', 'es', 'infirmièra,', 'e', 'trabalha', 'a', 'Besièrs.'],
							choses: ['la-maire', 'infirmier-infirmiera', 'trabalhar'],
							explain: '*Ma maire es infirmièra, e trabalha a Besièrs.* Pas besoin de « elle » : la fin du verbe le dit.'
						},
						{
							prompt: 'Le samedi, nous dansons avec les amis.',
							tiles: ['Lo', 'dissabte,', 'dançam', 'amb', 'los', 'amics.'],
							choses: ['dissabte', 'dancar', 'amic-amiga'],
							explain: '*Lo dissabte, dançam amb los amics.* *Lo dissabte* : le samedi, chaque samedi.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Présente quelqu’un de ta famille',
					intro:
						'Choisis quelqu’un de ta famille, ou d’une famille inventée. Dis à voix haute qui c’est, son âge, ce qu’il ou elle fait dans la vie et le dimanche. Puis compare au modèle.',
					items: [
						{
							q: 'Ta présentation, en quatre phrases.',
							a: 'Par exemple : *Es ma sòrre. A dètz-e-uèch ans. Es estudianta a Montpelhièr. Lo dimenge, canta amb los amics.*'
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
						'compter jusqu’à vingt, et dire l’âge de quelqu’un',
						'présenter ma famille : mon père, ma sœur, ma grand-mère…',
						'dire ce que je fais dans la vie, et le demander',
						'raconter ce que je fais le dimanche, et avec qui',
						'rester en occitan quand quelqu’un passe au français'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Fin de la halte 2',
					paragraphs: [
						'*Òsca !* (bravo !) Tu sais maintenant parler de ta famille, de ton métier et de tes dimanches, et poser ces questions à ton tour. La suite : l’unité 5, au marché.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Ton carnet de révision',
					paragraphs: [
						'Les exercices que tu fais remplissent ton carnet de révision, à l’adresse loligam.eu/aprene/carnet. Il marche sans compte : il reste dans ton navigateur.',
						'Deux cartes par chose : « je reconnais », puis « je produis ». Une carte est acquise après deux réussites, à deux jours différents. Passe le voir avant l’unité 5.'
					],
					// Lien vers le carnet, affiché par NoteBlock ; l'adresse reste aussi dans le texte.
					lien: { href: '/aprene/carnet', texte: 'Ouvrir mon carnet de révision' }
				}
			]
		}
	]
};
