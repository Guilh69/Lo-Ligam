// Module 5.1 · A1 · « Qué i a al mercat ? » : unité 5 (Al mercat), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes,
// carte de l'A1 §3 ; règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : le pluriel (on ajoute -s ; -a devient -as) ; la frucha, nom
// collectif sans pluriel (grammaire de référence p33, choix de Romain du 2026-11-02) ; un quilò de ;
// al mercat en bloc (al s'explique en 7.2). Lexique : cursus/lexic-A1.md, 5.1,
// items copiés tels quels (mêmes id), en quatre blocs.
// Scène de l'unité : le marché du dimanche matin, au village. Yasmine y vend
// ses fruits et ses légumes ; Ramon, le fromager, arrive en 5.2.
// Jeu du jour : la liste de courses de Marià, à écrire (escriure + recap).
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01 ; vaca,
// òli le 2026-11-02), à valider par Romain.

export const modul51 = {
	id: 'modul-5-1',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '5-1',
	unitat: 'Unitat 5 · Al mercat',
	nivel: 'A1 · Modul 5.1',
	oc: 'Qué i a al mercat ?',
	fr: 'Qu’y a-t-il au marché ? Nommer les produits, au singulier et au pluriel',
	cando:
		'Je peux nommer quinze produits du marché, dire ce qu’il y a et ce qu’il n’y a pas, mettre un nom au pluriel et écrire ma liste de courses, au kilo.',
	durada: '~55 min · 6 étapes',
	// Carte de titre de l'unité (décision du 2026-10-25), comme en 1.1.
	ouverture: {
		numero: 5,
		bloc: { oc: 'Lo monde a l’entorn', fr: 'le monde autour' },
		titre: 'Al mercat',
		fr: 'au marché',
		question: 'Qué i a al mercat ?',
		questionFr: 'qu’y a-t-il au marché ?',
		phrase:
			'Le marché du dimanche, au village. En quatre modules, tu sauras nommer ce qu’on y vend, demander les prix, dire ce que tu veux et ce que tu aimes, puis faire tes courses du bonjour au merci. À qui voudrais-tu dire cela en occitan ?'
	},
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Marià', 'Loís', 'Yasmine'],
	notesRelecture: [
		'Le marché du village a lieu le dimanche matin : Loís y achète pour sa cuisine (il travaille le dimanche), et Núria y retrouve Yasmine (unité 4). D’accord ?',
		'*de* pour « des » et pour « du » (*I a de pomas*, *I a de rasim*), dit en une ligne dans l’Obsèrva, avec *d’* devant une voyelle (*d’olivas*, *d’alh*) : ça te va ?',
		'La blague de Yasmine : *Ai de galinas… pas de vacas !* (*vaca* ✓ ; *vacas*, pluriel régulier) : d’accord ?',
		'Marià parle occitan depuis toujours, mais on ne lui a appris à écrire qu’en français : sa liste est en français, l’élève la recopie en occitan. La remarque te va ?',
		'Sons proposés : *los uòus* « lou-ZUÒOUS », *las olivas* « la-zou-LI-bos », *d’alh* « DAL », *dotze uòus* « DOUT-sé UÒOUS ». À confirmer à l’enregistrement.',
		'Ton choix du 2026-11-02 (grammaire de référence, p33) : *la frucha* « la FRU-tcho » pour « les fruits », un mot collectif sans pluriel, à la place de *las frutas* ; une ligne l’explique dans l’Obsèrva. Même mot dans *un suc de frucha* (8.3). À relire.',
		'Culture : l’aïoli (provençal *ai*, *oli* ; chez toi *alh*, *òli* ✓) et le cassoulet (*caçolet*, « petite terrine »), d’après le TLFi. *caçòla* (terrine) est absent du Basic : je ne l’ai pas écrit. On garde la note ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient des unités 3 et 4',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '« Les amies », en occitan :',
							options: ['las amigas', 'los amics', 'l’amiga'],
							correct: 0,
							oc: true,
							choses: ['amic-amiga'],
							explain: '*las amigas* : les amies ; *los amics* : les amis. Retiens la fin *-as* : elle revient aujourd’hui.'
						},
						{
							q: 'Douze :',
							options: ['dotze', 'doas', 'tretze'],
							correct: 0,
							oc: true,
							choses: ['nombre-12'],
							explain: '*dotze* : 12. *tretze*, c’est 13 ; *doas*, c’est 2 devant un mot féminin.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Il n’y a pas de chien.',
							answers: ['Non i a pas de can.'],
							choses: ['i-a', 'lo-can'],
							explain: '*Non i a pas de…* : il n’y a pas de… Au marché, il va beaucoup servir.'
						},
						{
							consigne: 'Écris 2 devant un mot féminin, comme *sòrres* ou *amigas*.',
							answers: ['doas'],
							choses: ['nombre-2'],
							explain: '*doas sòrres*, *doas amigas* ; mais *dos fraires*.'
						},
						{
							consigne: 'Le dimanche, je mange avec les amis.',
							answers: ['Lo dimenge, mangi amb los amics.'],
							choses: ['dimenge', 'manjar', 'amb', 'amic-amiga'],
							explain: '*los amics* : un *-s* à la fin pour dire « plusieurs ». C’est la forme du jour.'
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
					title: 'Jour de marché au village',
					intro:
						'Dimanche matin, au village : c’est jour de marché. Loís, le cuisinier, en revient les bras chargés ; Marià l’arrête sur la place. Puis Marià va à l’étal de Yasmine, la paysanne. Loís et Yasmine vouvoient Marià, et elle les tutoie. Lis une première fois pour répondre à une seule question : Marià trouve-t-elle tout ce qu’elle demande ?',
					scenes: [
						{
							title: 'Marià e Loís',
							subtitle: '(sur la place)',
							lines: [
								{ oc: 'Adieu, Loís ! Qué i a al mercat ?', sound: 'a-DIOU, lou-ÍS ! ké YA al mér-CAT ?', fr: 'Salut, Loís ! Qu’y a-t-il au marché ?' },
								{ oc: 'Bonjorn, Marià ! I a de frucha e de legums : de pomas, de peras, de rasim…', sound: 'boun-DJOUR, ma-ri-A ! YA dé FRU-tcho é dé lé-GUNS : dé POU-mos, dé PÉ-ros, dé ra-ZIN…', fr: 'Bonjour, Marià ! Il y a des fruits et des légumes : des pommes, des poires, du raisin…' },
								{ oc: 'E tu, qué as aquí ?', sound: 'é TU, ké AS a-KI ?', fr: 'Et toi, qu’est-ce que tu as là ?' },
								{ oc: 'Dos quilòs de tomatas, un quilò de cebas, d’alh e de patanas. Lo dimenge, cosini !', sound: 'dous ki-LÒS dé tou-MA-tos, un ki-LÒ dé SÉ-bos, DAL é dé pa-TA-nos. lou di-MÉN-djé, cou-ZI-ni !', fr: 'Deux kilos de tomates, un kilo d’oignons, de l’ail et des pommes de terre. Le dimanche, je cuisine !' },
								{ oc: 'E lo pan ? E lo formatge ?', sound: 'é lou PA ? é lou four-MA-djé ?', fr: 'Et le pain ? Et le fromage ?' },
								{ oc: 'Òc, òc : de pan, de formatge, de vin… A lèu, Marià !', sound: 'OK, OK : dé PA, dé four-MA-djé, dé BI… a LÈOU, ma-ri-A !', fr: 'Oui, oui : du pain, du fromage, du vin… À bientôt, Marià !' }
							]
						},
						{
							title: 'Marià e Yasmine',
							subtitle: '(à l’étal de Yasmine)',
							lines: [
								{ oc: 'Bonjorn, Marià ! Cossí anatz ?', sound: 'boun-DJOUR, ma-ri-A ! cou-si a-NATS ?', fr: 'Bonjour, Marià ! Comment allez-vous ?' },
								{ oc: 'Va plan, mercés ! Un quilò de pomas e un quilò de peras, se te plai.', sound: 'ba PLA, mér-SÉS ! un ki-LÒ dé POU-mos é un ki-LÒ dé PÉ-ros, sé té PLAÏ.', fr: 'Ça va bien, merci ! Un kilo de pommes et un kilo de poires, s’il te plaît.' },
								{ oc: 'Las pomas, las peras… òc ! E de legums ?', sound: 'las POU-mos, las PÉ-ros… OK ! é dé lé-GUNS ?', fr: 'Les pommes, les poires… oui ! Et des légumes ?' },
								{ oc: 'Una salada, dos quilòs de patanas e d’olivas. E dotze uòus.', sound: 'U-no sa-LA-do, dous ki-LÒS dé pa-TA-nos é dou-LI-bos. é DOUT-sé UÒOUS.', fr: 'Une salade, deux kilos de pommes de terre et des olives. Et douze œufs.' },
								{ oc: 'Dotze uòus ? Òc !', sound: 'DOUT-sé UÒOUS ? OK !', fr: 'Douze œufs ? Oui !' },
								{ oc: 'E de lach ?', sound: 'é dé LATCH ?', fr: 'Et du lait ?' },
								{ oc: 'De lach ? Ai de galinas, Marià… pas de vacas !', sound: 'dé LATCH ? aï dé ga-LI-nos, ma-ri-A… pas dé BA-cos !', fr: 'Du lait ? J’ai des poules, Marià… pas de vaches !' }
							]
						}
					],
					glossary: [
						{ oc: 'las vacas', sound: 'las BA-cos', fr: 'les vaches (une vache : *la vaca*)' },
						{ oc: 'las galinas', sound: 'las ga-LI-nos', fr: 'les poules (*la galina*, unité 3)' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Marià trouve-t-elle tout ce qu’elle demande ?',
							options: ['Presque tout : il manque une chose.', 'Oui, tout.', 'Non : il manque les fruits.'],
							correct: 0,
							explain: 'Presque : Yasmine a les fruits, les légumes, les olives et les œufs. Il ne manque qu’une chose.'
						},
						{
							q: 'Dans ses sacs, Loís a…',
							options: ['deux kilos de tomates et un kilo d’oignons', 'un kilo de tomates et deux kilos d’oignons', 'deux tomates et un oignon'],
							correct: 0,
							choses: ['un-quilo-de', 'la-tomata', 'la-ceba'],
							explain: '*Dos quilòs de tomatas, un quilò de cebas.* Le *-s* de *quilòs* dit « plusieurs kilos ».'
						},
						{
							q: 'Ce qui manque à l’étal de Yasmine :',
							options: ['le lait', 'les œufs', 'les olives'],
							correct: 0,
							choses: ['lo-lach'],
							explain: '*Ai de galinas… pas de vacas !* Des poules, donc des œufs ; pas de vaches, donc pas de lait.'
						}
					]
				}
			]
		},

		// ————————————————————————————————— 3. Obsèrva
		{
			title: 'Obsèrva',
			fr: 'observe',
			minutes: 12,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (1/4)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'al-mercat', oc: 'al mercat · lo mercat', sound: 'al mér-CAT · lou mér-CAT', fr: 'au marché · le marché (titre de l’unité)' },
						{ id: 'un-quilo-de', oc: 'un quilò de… · dos quilòs de…', sound: 'un ki-LÒ dé · dous ki-LÒS dé', fr: 'un kilo de… · deux kilos de…' },
						{ id: 'la-poma', oc: 'la poma · las pomas', sound: 'la POU-mo · las POU-mos', fr: 'la pomme · les pommes' },
						{ id: 'la-pera', oc: 'la pera · las peras', sound: 'la PÉ-ro · las PÉ-ros', fr: 'la poire · les poires' },
						{ id: 'l-uou', oc: 'l’uòu · los uòus', sound: 'LUÒOU · lou-ZUÒOUS', fr: 'l’œuf · les œufs' }
					]
				},
				{
					type: 'qcm',
					title: 'Un ou plusieurs ?',
					intro: 'Regarde le petit mot devant le nom, et la fin du nom : ils disent s’il y en a un, ou plusieurs.',
					items: [
						{
							q: '*las pomas*',
							options: ['plusieurs pommes', 'une pomme'],
							correct: 0,
							noShuffle: true,
							choses: ['la-poma'],
							explain: '*las*, et la fin *-as* : plusieurs. Une seule : *la poma*.'
						},
						{
							q: '*los uòus*',
							options: ['plusieurs œufs', 'un œuf'],
							correct: 0,
							noShuffle: true,
							choses: ['l-uou'],
							explain: '*los*, et un *-s* à la fin : plusieurs. Un seul : *l’uòu*.'
						},
						{
							q: '*un quilò de cebas*',
							options: ['un kilo d’oignons', 'deux kilos d’oignons', 'un oignon'],
							correct: 0,
							choses: ['un-quilo-de', 'la-ceba'],
							explain: 'Un kilo (*un quilò*) de plusieurs oignons (*cebas*). Deux kilos : *dos quilòs*, avec un *-s* là aussi.'
						},
						{
							q: 'Une poire, des poires : *la pera*, …',
							options: ['las peras', 'la pera', 'las pomas'],
							correct: 0,
							oc: true,
							choses: ['la-pera'],
							explain: '*-a* devient *-as*, et *la* devient *las* : *las peras*.'
						},
						{
							q: 'Tu l’as vu à l’unité 4 : un ami, des amis. *l’amic*, …',
							options: ['los amics', 'las amigas', 'l’amiga'],
							correct: 0,
							oc: true,
							choses: ['amic-amiga'],
							explain: 'Au masculin, on ajoute *-s*, et *l’* devient *los* : *los amics*, comme *los uòus*.'
						},
						{
							q: 'Marià dit *d’olivas* (des olives). Une seule olive :',
							options: ['l’oliva', 'las olivas', 'la salada'],
							correct: 0,
							oc: true,
							choses: ['l-oliva'],
							explain: 'Devant une voyelle, *la* devient *l’* : *l’oliva*. À plusieurs : *las olivas*, « la-zou-LI-bos ».'
						},
						{
							q: 'Loís dit *de pomas*, puis *de rasim*. *De rasim*, c’est…',
							options: ['du raisin', 'le raisin', 'un raisin'],
							correct: 0,
							choses: ['lo-rasim'],
							explain: 'Pour « des » comme pour « du », un seul petit mot : *de*. *I a de rasim* : il y a du raisin.'
						},
						{
							q: '*la frucha e los legums*',
							options: ['les fruits et les légumes', 'le fruit et le légume', 'les fruits et le légume'],
							correct: 0,
							choses: ['frutas-legums'],
							explain: '*los legums* : *los* et un *-s*, c’est le pluriel. *La frucha*, ce sont les fruits, tous ensemble : ce mot-là reste sans *-s*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Un ou plusieurs : le pluriel',
					intro: 'Tu l’as entendu au marché : pour dire « plusieurs », la fin du nom change, et le petit mot devant aussi.',
					head: ['', 'un, une', 'plusieurs'],
					rows: [
						['on ajoute *-s*', '*lo fraire* · *l’uòu* · *la sòrre*', '*los fraires* · *los uòus* · *las sòrres*'],
						['*-a* devient *-as*', '*la poma* · *la ceba* · *l’amiga*', '*las pomas* · *las cebas* · *las amigas*'],
						['le petit mot devant', '*lo* (masculin) · *la* (féminin) · *l’* (devant une voyelle)', '*los* (masculin) · *las* (féminin)']
					],
					notes: [
						'Le *-s* se lie au mot qui suit : *los uòus* « lou-ZUÒOUS », *las olivas* « la-zou-LI-bos ».',
						'« Des » et « du » se disent tous les deux *de* : *I a de pomas* (des pommes), *I a de rasim* (du raisin). Tu le connais depuis *As de fraires ?* Devant une voyelle : *d’olivas*, *d’alh*.',
						'*La frucha* veut dire « les fruits », tous ensemble : le mot reste au singulier, sans *-s*, comme « la volaille » en français.',
						'*Al mercat* : au marché. Garde-le en bloc : *al* s’explique à l’unité 7.'
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 15,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (2/4) : les légumes',
					intro: 'Ceux de Loís, et ceux de l’étal de Yasmine.',
					items: [
						{ id: 'la-tomata', oc: 'la tomata · las tomatas', sound: 'la tou-MA-to · las tou-MA-tos', fr: 'la tomate · les tomates' },
						{ id: 'la-ceba', oc: 'la ceba · las cebas', sound: 'la SÉ-bo · las SÉ-bos', fr: 'l’oignon · les oignons' },
						{ id: 'la-patana', oc: 'la patana · las patanas', sound: 'la pa-TA-no · las pa-TA-nos', fr: 'la pomme de terre · les pommes de terre' },
						{ id: 'l-alh', oc: 'l’alh', sound: 'LAL', fr: 'l’ail' },
						{ id: 'la-salada', oc: 'la salada', sound: 'la sa-LA-do', fr: 'la salade' }
					]
				},
				{
					type: 'qcm',
					title: 'Échauffement : à l’étal de Yasmine',
					intro: 'Yasmine te propose ses légumes. Qu’est-ce qu’elle te propose ?',
					items: [
						{
							ditz: { qui: 'Yasmine', oc: 'Un quilò de patanas ?' },
							q: 'Elle te propose…',
							options: ['un kilo de pommes de terre', 'un kilo de pommes', 'un kilo de tomates'],
							correct: 0,
							choses: ['la-patana', 'un-quilo-de'],
							explain: '*la patana* : la pomme de terre. La pomme, c’est *la poma*.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Dos quilòs de tomatas ?' },
							q: 'Elle te propose…',
							options: ['deux kilos de tomates', 'un kilo de tomates', 'deux tomates'],
							correct: 0,
							choses: ['la-tomata', 'un-quilo-de'],
							explain: '*dos quilòs* : deux kilos, avec un *-s*. *tomatas* : des tomates.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'L’alh e las cebas ?' },
							q: 'Elle te montre…',
							options: ['l’ail et les oignons', 'l’ail et les olives', 'le lait et les oignons'],
							correct: 0,
							choses: ['l-alh', 'la-ceba'],
							explain: '*l’alh* « LAL » : l’ail. *las cebas* « las SÉ-bos » : les oignons.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Una salada ?' },
							q: 'Elle te propose…',
							options: ['une salade', 'une olive', 'un oignon'],
							correct: 0,
							choses: ['la-salada'],
							explain: '*la salada* : la salade. *una* : une, comme le nombre 1 au féminin.'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (3/4) : le pain, le fromage…',
					intro: 'Le reste de la liste de Marià.',
					items: [
						{ id: 'lo-pan', oc: 'lo pan', sound: 'lou PA', fr: 'le pain' },
						{ id: 'lo-formatge', oc: 'lo formatge', sound: 'lou four-MA-djé', fr: 'le fromage' },
						{ id: 'lo-vin', oc: 'lo vin', sound: 'lou BI', fr: 'le vin' },
						{ id: 'lo-lach', oc: 'lo lach', sound: 'lou LATCH', fr: 'le lait' }
					]
				},
				{
					type: 'qcm',
					title: 'Marià relit sa liste',
					intro: 'Marià lit à voix haute. Qu’est-ce qu’elle veut ?',
					items: [
						{
							ditz: { qui: 'Marià', oc: 'Vau al mercat !' },
							q: 'Marià va…',
							options: ['au marché', 'bien, merci', 'chez Loís'],
							correct: 0,
							choses: ['al-mercat'],
							explain: '*Vau*, comme dans *Vau plan* : je vais. *al mercat* : au marché.'
						},
						{
							ditz: { qui: 'Marià', oc: 'Lo pan e lo formatge…' },
							q: 'Sur sa liste :',
							options: ['le pain et le fromage', 'le pain et le vin', 'le lait et le fromage'],
							correct: 0,
							choses: ['lo-pan', 'lo-formatge'],
							explain: '*lo pan* « lou PA » : le pain. *lo formatge* : le fromage.'
						},
						{
							ditz: { qui: 'Marià', oc: '…lo lach e lo vin.' },
							q: 'Et puis :',
							options: ['le lait et le vin', 'l’ail et le vin', 'le lait et le pain'],
							correct: 0,
							choses: ['lo-lach', 'lo-vin'],
							explain: '*lo lach* « lou LATCH » : le lait ; *l’alh* « LAL », c’est l’ail. *lo vin* « lou BI » : le vin.'
						}
					]
				},
				// jeu prévu par la carte : liste de courses à écrire. Version simple :
				// `escriure`, une ligne de la liste à la fois ; la page rassemble la
				// liste à la fin (`recap`), comme le sondage de 4.4.
				{
					type: 'escriure',
					title: 'La liste de Marià',
					intro:
						'Marià parle occitan depuis toujours, mais à l’école, on ne lui a appris à écrire qu’en français : sa liste pour dimanche prochain est en français. Recopie-la en occitan, une ligne à la fois, pour qu’elle la lise au marché. Les lettres accentuées sont au-dessus du champ.',
					recap: 'La liste de Marià, en occitan :',
					items: [
						{ consigne: 'un kilo de pommes', answers: ['un quilò de pomas'], choses: ['un-quilo-de', 'la-poma'], explain: '*-a* devient *-as* : *pomas*.' },
						{ consigne: 'deux kilos de poires', answers: ['dos quilòs de peras'], choses: ['un-quilo-de', 'la-pera'], explain: 'Le pluriel deux fois : *quilòs*, *peras*.' },
						{ consigne: 'deux kilos de pommes de terre', answers: ['dos quilòs de patanas'], choses: ['un-quilo-de', 'la-patana'], explain: '*patanas* : un seul mot pour « pommes de terre ».' },
						{ consigne: 'un kilo de tomates', answers: ['un quilò de tomatas'], choses: ['un-quilo-de', 'la-tomata'], explain: '*tomatas*, « tou-MA-tos ».' },
						{ consigne: 'des oignons et de l’ail', answers: ['de cebas e d’alh'], choses: ['la-ceba', 'l-alh'], explain: 'Devant une voyelle, *de* devient *d’* : *d’alh*.' },
						{ consigne: 'une salade', answers: ['una salada'], choses: ['la-salada'], explain: '*una salada* : une salade.' },
						{ consigne: 'douze œufs', answers: ['dotze uòus'], choses: ['l-uou', 'nombre-12'], explain: '*uòus* : un *-s* au pluriel. *dotze* : 12.' },
						{ consigne: 'le pain et le fromage', answers: ['lo pan e lo formatge'], choses: ['lo-pan', 'lo-formatge'], explain: '*lo pan*, « lou PA » : le *n* final s’efface.' },
						{ consigne: 'du lait et du vin', answers: ['de lach e de vin'], choses: ['lo-lach', 'lo-vin'], explain: '« Du » se dit *de*, comme « des ».' }
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
					title: 'À retenir (4/4) : encore trois',
					intro: 'Tu les as entendus au marché : le raisin, les olives, et les fruits et légumes de Loís.',
					items: [
						{ id: 'lo-rasim', oc: 'lo rasim', sound: 'lou ra-ZIN', fr: 'le raisin' },
						{ id: 'l-oliva', oc: 'l’oliva · las olivas', sound: 'lou-LI-bo · la-zou-LI-bos', fr: 'l’olive · les olives' },
						{ id: 'frutas-legums', oc: 'la frucha · los legums', sound: 'la FRU-tcho · lous lé-GUNS', fr: 'les fruits (tous ensemble, sans *-s*) · les légumes' }
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Il y a des olives ?',
							answers: ['I a d’olivas ?'],
							choses: ['i-a', 'l-oliva'],
							explain: '*d’olivas* : devant une voyelle, *de* devient *d’*.'
						},
						{
							consigne: 'On te demande s’il y a du raisin. Réponds : non, il n’y a pas de raisin.',
							answers: ['Non i a pas de rasim.'],
							choses: ['i-a', 'lo-rasim'],
							explain: '*Non i a pas de rasim* : *non* devant, *pas* après le verbe, puis *de*.'
						},
						{
							consigne: 'Les fruits et les légumes.',
							answers: ['La frucha e los legums.'],
							choses: ['frutas-legums'],
							explain: '*la frucha* « la FRU-tcho », sans *-s* ; *los legums* « lous lé-GUNS ».'
						},
						{
							consigne: 'Le marché près de chez toi : écris ce qu’il y a. Commence par *Al mercat, i a de…* ou *I a de…*',
							debut: ['Al mercat, i a de', 'Al mercat, i a d’', 'I a de', 'I a d’'],
							choses: ['al-mercat', 'i-a'],
							explain: 'Par exemple : *Al mercat, i a de pomas, de cebas e de formatge.*'
						},
						{
							consigne: 'Et toi, qu’est-ce que tu achètes au kilo ? Commence par *Un quilò de…* ou *Dos quilòs de…*',
							debut: ['Un quilò de', 'Un quilò d’', 'Dos quilòs de', 'Dos quilòs d’'],
							choses: ['un-quilo-de'],
							explain: 'Par exemple : *Dos quilòs de tomatas.* Avec deux kilos, le pluriel deux fois.'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre. Un mauvais mot tremble, rien de grave.',
					items: [
						{
							prompt: 'Il y a des pommes, des poires et du raisin.',
							tiles: ['I', 'a', 'de', 'pomas,', 'de', 'peras', 'e', 'de', 'rasim.'],
							choses: ['la-poma', 'la-pera', 'lo-rasim'],
							explain: '*de* : « des », et aussi « du ».'
						},
						{
							prompt: 'Au marché, il y a des olives et des œufs.',
							tiles: ['Al', 'mercat,', 'i', 'a', 'd’olivas', 'e', 'd’uòus.'],
							choses: ['al-mercat', 'l-oliva', 'l-uou'],
							explain: '*d’olivas*, *d’uòus* : devant une voyelle, *de* devient *d’*.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Pense à une personne que tu connais : qu’est-ce qu’elle prend au marché ? Dis-le à voix haute, puis compare au modèle.',
					items: [
						{
							q: 'Ta mère, ton voisin, une collègue…',
							a: 'Par exemple : *Mon paire, al mercat : un quilò de tomatas, dos quilòs de patanas, una salada, lo pan e lo vin. E ieu ? Las olivas !*'
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
					title: 'Le son du jour : le -as final',
					paragraphs: [
						'À la fin d’un mot, quand la voix n’appuie pas dessus, *-as* sonne « os » : *las pomas* « las POU-mos », *las peras* « las PÉ-ros ».',
						'Tu le connais déjà : *parlas* « PAR-los », *demòras* « dé-MÒ-ros ».',
						'Mais dans *vas*, la voix appuie sur le *a* : il reste « a », *Cossí vas ?* « cou-si BAS ».'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '*las tomatas* se dit…',
							options: ['las tou-MA-tos', 'las tou-MA-tas'],
							correct: 0,
							noShuffle: true,
							explain: '« tou-MA-tas », c’est la lecture à la française. En occitan, le *-as* final sonne « os ».'
						},
						{
							q: 'Et *Cossí vas ?*',
							options: ['cou-si BAS', 'cou-si BOS'],
							correct: 0,
							noShuffle: true,
							explain: 'Ici, la voix appuie sur le *a* : il reste « a ». Et le *v* sonne « b ».'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Las pomas, las peras e las cebas.*',
							a: '« las POU-mos, las PÉ-ros é las SÉ-bos » : trois fois « os », et la voix appuie avant.'
						},
						{
							q: '*Parlas occitan, al mercat ?*',
							a: '« PAR-los ou-tsi-TA, al mér-CAT ? » : le même « os » que dans *pomas*.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : l’aïoli et le cassoulet',
					glosa: { oli: 'huile (provençal)', òli: 'huile' },
					paragraphs: [
						'L’aïoli, c’est de l’ail et de l’huile : le mot vient du provençal *ai* (ail) et *oli* (huile), relevé par Mistral en 1879. Chez toi, on dit *l’alh* et *l’òli*.',
						'Le cassoulet aussi a un nom occitan : *caçolet*, un mot languedocien, mot à mot « la petite terrine », celle où cuit le plat. Le français l’a pris en 1897.',
						'Source : TLFi, articles « aïoli » et « cassoulet ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'nommer quinze produits du marché',
						'dire ce qu’il y a, ou ce qu’il n’y a pas : *I a de pomas*, *Non i a pas de lach*',
						'mettre un nom au pluriel : *la poma*, *las pomas* ; *l’uòu*, *los uòus*',
						'écrire une liste de courses, au kilo : *dos quilòs de tomatas*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant nommer ce qu’il y a au marché, et écrire ta liste de courses.',
						'Si tu en as envie : écris ta prochaine liste de courses en occitan, ou demande *Qué i a al mercat ?* à une personne précise, un voisin, ta grand-mère, une amie. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
