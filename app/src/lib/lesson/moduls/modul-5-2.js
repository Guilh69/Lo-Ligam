// Module 5.2 · A1 · « Quant còsta ? » : unité 5 (Al mercat), rédigé par
// Claude le 2026-11-02 sur le modèle de l'unité 1 (même chemin en six étapes ;
// règles communes : cursus/regles-redaccion-A1.md).
// Forme du jour : les nombres de 20 à 100, de dix en dix ; de 21 à 29 avec e
// (vint-e-un) ; còsta (une chose), còstan (plusieurs). Pas de nombre de 31 à
// 99 hors dizaines : la forme attend Romain (lexique, doute 7).
// Scène : au marché du dimanche, Lisa achète chez Yasmine (elles se
// tutoient), puis chez Ramon, le fromager, un monsieur âgé qu'elle vouvoie.
// Jeu du jour : écouter les prix et choisir l'étiquette, puis écrire les
// étiquettes de Ramon.
// ⚠️ Occitan vérifié par l'API de lo Congrès (lexique du 2026-11-01 ; car,
// cara, bona le 2026-11-02), à valider par Romain. ⚠️ cent : erreur d'appel.

export const modul52 = {
	id: 'modul-5-2',
	// Date de la relecture de l'occitan par Romain (rien n'est masqué : décision du 2026-10-25).
	relu: null,
	slug: '5-2',
	unitat: 'Unitat 5 · Al mercat',
	nivel: 'A1 · Modul 5.2',
	oc: 'Quant còsta ?',
	fr: 'Combien ça coûte ? Demander un prix, compter de vingt à cent, payer',
	cando:
		'Je peux demander combien coûte une chose ou plusieurs, comprendre et dire un prix de vingt à cent euros, et payer : *Quant fa ?*, *Vaquí !*',
	durada: '~55 min · 6 étapes',
	// Prénoms des personnages : ni contrôlés ni vérifiés.
	nomsPropris: ['Lisa', 'Yasmine', 'Ramon', 'Karim'],
	notesRelecture: [
		'*cent* : l’API a renvoyé une erreur (⚠️, déjà signalé dans le lexique). Tu le valides ?',
		'Un nouveau personnage : Ramon, le fromager, un monsieur âgé qu’on vouvoie (il revient en 5.3 et 5.4). Le prénom te va ?',
		'*Es car, mas es bon !* (Ramon) et *Bon dimenge !* (bon dimanche) : naturels pour toi ?',
		'Son proposé : *car* « CAR », le *r* dit. À confirmer à l’enregistrement.',
		'Le proverbe de Mistral, *A bon marcat, aviso-te*, gardé dans sa graphie, avec ma traduction (à relire, cultura-A1.md) : on le garde ?'
	],

	sessions: [
		// ————————————————————————————————— 1. Révision du jour
		{
			title: 'Révision du jour',
			minutes: 5,
			blocks: [
				{
					type: 'qcm',
					title: 'Ce qui revient du module 5.1',
					intro: 'De mémoire, une question à la fois.',
					items: [
						{
							q: '« Deux kilos de pommes de terre » :',
							options: ['dos quilòs de patanas', 'dos quilòs de pomas', 'un quilò de patanas'],
							correct: 0,
							oc: true,
							choses: ['un-quilo-de', 'la-patana'],
							explain: '*patanas* : les pommes de terre ; *pomas* : les pommes. Et deux kilos : *dos quilòs*.'
						},
						{
							q: '*Qué i a al mercat ?* On te demande…',
							options: ['ce qu’il y a au marché', 'où est le marché', 'qui est au marché'],
							correct: 0,
							choses: ['al-mercat', 'i-a'],
							explain: '*Qué i a… ?* : qu’y a-t-il ? *al mercat* : au marché.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Escriu (écris)',
					intro: 'Écris en occitan. Majuscules et ponctuation ne comptent pas.',
					items: [
						{
							consigne: 'Les olives et les œufs.',
							answers: ['Las olivas e los uòus.'],
							choses: ['l-oliva', 'l-uou'],
							explain: '*las olivas*, *los uòus* : le pluriel, au féminin et au masculin.'
						},
						{
							consigne: 'Il n’y a pas de lait.',
							answers: ['I a pas de lach.'],
							choses: ['i-a', 'lo-lach'],
							explain: '*I a pas de lach* : chez Yasmine, des poules, pas de vaches.'
						},
						{
							consigne: 'Écris en lettres : 20',
							answers: ['vint'],
							choses: ['nombre-20'],
							explain: '*vint* « BIN » : aujourd’hui, on compte à partir de là.'
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
					title: 'Lisa fait ses courses',
					intro:
						'Le dimanche suivant, Lisa, l’ingénieure de Montpellier, vient au marché du village. Elle passe d’abord à l’étal de Yasmine, qu’elle tutoie, puis à celui de Ramon, le fromager, un monsieur âgé qu’elle vouvoie. Lis une première fois pour répondre à une seule question : qu’est-ce que Lisa trouve cher ?',
					scenes: [
						{
							title: 'Lisa e Yasmine',
							subtitle: '(à l’étal de Yasmine ; elles se tutoient)',
							lines: [
								{ oc: 'Adieu, Yasmine ! Quant còstan las tomatas ?', sound: 'a-DIOU, yas-MI-ne ! KAN CÒS-ton las tou-MA-tos ?', fr: 'Salut, Yasmine ! Combien coûtent les tomates ?' },
								{ oc: 'Tres euros lo quilò.', sound: 'tré-ZÉOU-rous lou ki-LÒ.', fr: 'Trois euros le kilo.' },
								{ oc: 'E la salada, quant còsta ?', sound: 'é la sa-LA-do, KAN CÒS-to ?', fr: 'Et la salade, combien elle coûte ?' },
								{ oc: 'Un euro. E sièis uòus, dos euros.', sound: 'u-NÉOU-rou. é SYÈÏ-ZUÒOUS, dou-ZÉOU-rous.', fr: 'Un euro. Et six œufs, deux euros.' },
								{ oc: 'Pòdes repetir, se te plai ?', sound: 'PÒ-dés ré-pé-TI, sé té PLAÏ ?', fr: 'Tu peux répéter, s’il te plaît ?' },
								{ oc: 'La salada, un euro. Sièis uòus, dos euros.', sound: 'la sa-LA-do, u-NÉOU-rou. SYÈÏ-ZUÒOUS, dou-ZÉOU-rous.', fr: 'La salade, un euro. Six œufs, deux euros.' },
								{ oc: 'Un quilò de tomatas, una salada e sièis uòus, se te plai. Quant fa ?', sound: 'un ki-LÒ dé tou-MA-tos, U-no sa-LA-do é SYÈÏ-ZUÒOUS, sé té PLAÏ. KAN FA ?', fr: 'Un kilo de tomates, une salade et six œufs, s’il te plaît. Ça fait combien ?' },
								{ oc: 'Tres, e un, e dos… sièis euros !', sound: 'TRÉS, é U(N), é DOUS… SYÈÏ-ZÉOU-rous !', fr: 'Trois, et un, et deux… six euros !' },
								{ oc: 'Vaquí ! Mercés, Yasmine.', sound: 'ba-KI ! mér-SÉS, yas-MI-ne.', fr: 'Voilà ! Merci, Yasmine.' }
							]
						},
						{
							title: 'Lisa e Ramon',
							subtitle: '(à l’étal de Ramon, le fromager ; Lisa le vouvoie)',
							lines: [
								{ oc: 'Bonjorn ! Quant còsta lo formatge ?', sound: 'boun-DJOUR ! KAN CÒS-to lou four-MA-djé ?', fr: 'Bonjour ! Combien coûte le fromage ?' },
								{ oc: 'Bonjorn ! Vint-e-cinc euros lo quilò.', sound: 'boun-DJOUR ! bin-té-SINK ÉOU-rous lou ki-LÒ.', fr: 'Bonjour ! Vingt-cinq euros le kilo.' },
								{ oc: 'Vint-e-cinc euros ? Es car !', sound: 'bin-té-SINK ÉOU-rous ? és CAR !', fr: 'Vingt-cinq euros ? C’est cher !' },
								{ oc: 'Es car, mas es bon !', sound: 'és CAR, mas és BOU(N) !', fr: 'C’est cher, mais c’est bon !' },
								{ oc: 'Un pauc de formatge, e lo vin. Quant fa ?', sound: 'un PAOUK dé four-MA-djé, é lou BI. KAN FA ?', fr: 'Un peu de fromage, et le vin. Ça fait combien ?' },
								{ oc: 'Vint euros.', sound: 'BIN ÉOU-rous.', fr: 'Vingt euros.' },
								{ oc: 'Vaquí cinquanta euros.', sound: 'ba-KI sin-KAN-to ÉOU-rous.', fr: 'Voilà cinquante euros.' },
								{ oc: 'E vaquí trenta euros. Mercés, e bon dimenge !', sound: 'é ba-KI TRÉN-to ÉOU-rous. mér-SÉS, é bou(n) di-MÉN-djé !', fr: 'Et voilà trente euros. Merci, et bon dimanche !' }
							]
						}
					],
					glossary: [
						{ oc: 'Es car ! · Es cara !', sound: 'és CAR · és CA-ro', fr: 'c’est cher ! · c’est chère !' },
						{ oc: 'Es bon ! · Es bona !', sound: 'és BOU(N) · és BOU-no', fr: 'c’est bon ! · c’est bonne !' }
					]
				},
				{
					type: 'qcm',
					title: 'As-tu compris ?',
					intro: 'Une question à la fois.',
					items: [
						{
							q: 'Qu’est-ce que Lisa trouve cher ?',
							options: ['le fromage', 'les tomates', 'les œufs'],
							correct: 0,
							choses: ['lo-formatge'],
							explain: '*Vint-e-cinc euros ? Es car !* Ramon répond : *Es car, mas es bon !*'
						},
						{
							q: 'Les tomates de Yasmine coûtent…',
							options: ['3 euros le kilo', '13 euros le kilo', '30 euros le kilo'],
							correct: 0,
							choses: ['quant-costa', 'nombre-3'],
							explain: '*Tres euros lo quilò* : 3 euros. 13, c’est *tretze* ; 30, *trenta*.'
						},
						{
							q: 'Lisa donne cinquante euros à Ramon. Il lui rend…',
							options: ['30 euros', '20 euros', '25 euros'],
							correct: 0,
							choses: ['nombre-30', 'vaqui'],
							explain: '*E vaquí trenta euros* : elle paie vingt euros, il lui rend trente.'
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
					type: 'chunks',
					title: 'À retenir (1/3)',
					intro: 'Ça sonne comme : la syllabe forte en capitales. Ces expressions entrent dans ton carnet de révision.',
					items: [
						{ id: 'quant-costa', oc: 'Quant còsta ? · Quant còstan ?', sound: 'KAN CÒS-to · KAN CÒS-ton', fr: 'combien ça coûte ? (une chose) · combien ça coûte ? (plusieurs)' },
						{ id: 'euro-centim', oc: 'un euro · dos euros · un centim · dos centims', sound: 'u-NÉOU-rou · dou-ZÉOU-rous · un sén-TIN · dous sén-TINS', fr: 'un euro · deux euros · un centime · deux centimes' },
						{ id: 'vint-e-un', oc: 'vint-e-un · vint-e-dos · vint-e-tres', sound: 'bin-té-U(N) · bin-té-DOUS · bin-té-TRÉS', fr: '21 · 22 · 23, et ainsi de suite jusqu’à 29 (avec e, comme *dètz-e-sèt*)' },
						{ id: 'vaqui', oc: 'Vaquí !', sound: 'ba-KI', fr: 'voilà ! (en tendant quelque chose)' }
					]
				},
				{
					type: 'qcm',
					title: 'Còsta, còstan, et après vingt',
					intro: 'Regarde la fin du verbe, puis la façon de compter après vingt.',
					items: [
						{
							q: 'Lisa demande *Quant còstan las tomatas ?*, puis *Quant còsta la salada ?* Pourquoi *còstan* pour les tomates ?',
							options: ['elles sont plusieurs', 'Lisa vouvoie Yasmine', 'elles sont chères'],
							correct: 0,
							choses: ['quant-costa'],
							explain: '*-an* : plusieurs, comme *parlan* (ils parlent). Une seule salade : *còsta*.'
						},
						{
							q: 'Pour demander le prix du pain :',
							options: ['Quant còsta lo pan ?', 'Quant còstan lo pan ?', 'Quant còsta las pomas ?'],
							correct: 0,
							oc: true,
							choses: ['quant-costa', 'lo-pan'],
							explain: 'Un pain, une seule chose : *còsta*.'
						},
						{
							q: 'Et pour les œufs :',
							options: ['Quant còstan los uòus ?', 'Quant còsta los uòus ?', 'Quant còstan l’uòu ?'],
							correct: 0,
							oc: true,
							choses: ['quant-costa', 'l-uou'],
							explain: 'Plusieurs œufs : *còstan*, et *los uòus*.'
						},
						{
							q: '*Vint-e-cinc euros* : combien ?',
							options: ['25 €', '20 €', '5 €'],
							correct: 0,
							choses: ['vint-e-un'],
							explain: '*vint*, puis *e*, puis *cinc* : vingt-cinq. Comme *dètz-e-sèt* : dix-sept.'
						},
						{
							q: 'Et 27 ?',
							options: ['vint-e-sèt', 'dètz-e-sèt', 'vint-e-sièis'],
							correct: 0,
							oc: true,
							choses: ['vint-e-un'],
							explain: '*vint-e-sèt* : vingt et sept. *dètz-e-sèt*, c’est 17 ; *vint-e-sièis*, 26.'
						},
						{
							q: '*un euro*, *dos euros*… et deux centimes ?',
							options: ['dos centims', 'dos centim', 'doas centims'],
							correct: 0,
							oc: true,
							choses: ['euro-centim', 'nombre-2'],
							explain: 'Un *-s* au pluriel, comme *dos euros*. Et *dos*, pas *doas* : *centim* est masculin.'
						}
					]
				},
				{
					type: 'table',
					title: 'Demander un prix, payer',
					intro: 'Ce que tu as entendu au marché, rangé.',
					head: ['', 'une chose', 'plusieurs'],
					rows: [
						['demander le prix', '*Quant còsta la salada ?*', '*Quant còstan las tomatas ?*'],
						['répondre', '*Un euro.*', '*Tres euros lo quilò.*'],
						['l’argent', '*un euro* · *un centim*', '*dos euros* · *dos centims*']
					],
					notes: [
						'*còsta*, *còstan* : la même fin que *parla*, *parlan*. La voix appuie sur le *ò* : « CÒS-to », « CÒS-ton ».',
						'De 21 à 29 : *vint*, puis *e*, puis le chiffre : *vint-e-un*, *vint-e-cinc*, *vint-e-nòu*. Comme *dètz-e-sèt*.',
						'Pour payer : *Quant fa ?* (combien ça fait ?), puis, en tendant l’argent, *Vaquí !* (voilà !).'
					]
				}
			]
		},

		// ————————————————————————————————— 4. Lo jòc del jorn
		// jeu prévu par la carte : écouter les prix, choisir. Version simple : le
		// prix dit (à lire en attendant le son), l'étiquette à choisir (qcm),
		// puis les étiquettes à écrire en lettres (escriure).
		{
			title: 'Lo jòc del jorn',
			fr: 'le jeu du jour',
			minutes: 15,
			blocks: [
				{
					type: 'chunks',
					title: 'À retenir (2/3) : de 30 à 60',
					intro: 'Regarde : *trenta* ressemble à *tres*, *quaranta* à *quatre*, *cinquanta* à *cinc*, *seissanta* à *sièis*.',
					items: [
						{ id: 'nombre-30', oc: 'trenta', sound: 'TRÉN-to', fr: '30' },
						{ id: 'nombre-40', oc: 'quaranta', sound: 'ka-RAN-to', fr: '40' },
						{ id: 'nombre-50', oc: 'cinquanta', sound: 'sin-KAN-to', fr: '50' },
						{ id: 'nombre-60', oc: 'seissanta', sound: 'séï-SAN-to', fr: '60' }
					]
				},
				{
					type: 'qcm',
					title: 'Les prix du marché (1)',
					intro: 'Le marchand annonce un prix : choisis la bonne étiquette.',
					items: [
						{
							ditz: { qui: 'Ramon', oc: 'Trenta euros.' },
							q: 'L’étiquette :',
							options: ['30 €', '3 €', '13 €'],
							correct: 0,
							choses: ['nombre-30'],
							explain: '*trenta* « TRÉN-to » : 30. 3, c’est *tres* ; 13, *tretze*.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Quaranta centims.' },
							q: 'L’étiquette :',
							options: ['40 centimes', '4 centimes', '14 centimes'],
							correct: 0,
							choses: ['nombre-40', 'euro-centim'],
							explain: '*quaranta* « ka-RAN-to » : 40. 4, c’est *quatre* ; 14, *catòrze*.'
						},
						{
							ditz: { qui: 'Ramon', oc: 'Cinquanta euros.' },
							q: 'L’étiquette :',
							options: ['50 €', '5 €', '15 €'],
							correct: 0,
							choses: ['nombre-50'],
							explain: '*cinquanta* « sin-KAN-to » : 50. 5, c’est *cinc* ; 15, *quinze*.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Seissanta centims.' },
							q: 'L’étiquette :',
							options: ['60 centimes', '6 centimes', '16 centimes'],
							correct: 0,
							choses: ['nombre-60', 'euro-centim'],
							explain: '*seissanta* « séï-SAN-to » : 60. 6, c’est *sièis* ; 16, *setze*.'
						},
						{
							ditz: { qui: 'Ramon', oc: 'Vint-e-quatre euros.' },
							q: 'L’étiquette :',
							options: ['24 €', '40 €', '14 €'],
							correct: 0,
							choses: ['vint-e-un', 'nombre-4'],
							explain: '*vint-e-quatre* : vingt et quatre. 40, ce serait *quaranta*.'
						}
					]
				},
				{
					type: 'chunks',
					title: 'À retenir (3/3) : de 70 à 100',
					intro:
						'*setanta* ressemble à *sèt*, *ochanta* à *uèch*, *nonanta* à *nòu* : chaque dizaine a son nom, comme « septante » et « nonante » en Belgique ou en Suisse. Et 100, c’est *cent*.',
					items: [
						{ id: 'nombre-70', oc: 'setanta', sound: 'sé-TAN-to', fr: '70' },
						{ id: 'nombre-80', oc: 'ochanta', sound: 'ou-TCHAN-to', fr: '80' },
						{ id: 'nombre-90', oc: 'nonanta', sound: 'nou-NAN-to', fr: '90' },
						{ id: 'nombre-100', oc: 'cent', sound: 'SÉN', fr: '100' }
					]
				},
				{
					type: 'qcm',
					title: 'Les prix du marché (2), plus vite',
					intro: 'Même jeu, avec les grands nombres. Choisis vite la bonne étiquette.',
					items: [
						{
							ditz: { qui: 'Ramon', oc: 'Setanta euros.' },
							q: 'L’étiquette :',
							options: ['70 €', '7 €', '17 €'],
							correct: 0,
							choses: ['nombre-70'],
							explain: '*setanta* « sé-TAN-to » : 70. 7, c’est *sèt* ; 17, *dètz-e-sèt*.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Ochanta centims.' },
							q: 'L’étiquette :',
							options: ['80 centimes', '8 centimes', '18 centimes'],
							correct: 0,
							choses: ['nombre-80', 'euro-centim'],
							explain: '*ochanta* « ou-TCHAN-to » : 80. 8, c’est *uèch* ; 18, *dètz-e-uèch*.'
						},
						{
							ditz: { qui: 'Ramon', oc: 'Nonanta euros.' },
							q: 'L’étiquette :',
							options: ['90 €', '9 €', '19 €'],
							correct: 0,
							choses: ['nombre-90'],
							explain: '*nonanta* « nou-NAN-to » : 90. 9, c’est *nòu* ; 19, *dètz-e-nòu*.'
						},
						{
							ditz: { qui: 'Ramon', oc: 'Cent euros !' },
							q: 'L’étiquette :',
							options: ['100 €', '10 €', '20 €'],
							correct: 0,
							choses: ['nombre-100'],
							explain: '*cent* « SÉN » : 100. 10, c’est *dètz* ; 20, *vint*.'
						},
						{
							ditz: { qui: 'Yasmine', oc: 'Vint-e-uèch euros.' },
							q: 'L’étiquette :',
							options: ['28 €', '80 €', '18 €'],
							correct: 0,
							choses: ['vint-e-un', 'nombre-8'],
							explain: '*vint-e-uèch* : 28. 80, ce serait *ochanta* ; 18, *dètz-e-uèch*.'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Les étiquettes de Ramon',
					intro:
						'Ramon refait ses étiquettes, en occitan cette fois : écris chaque prix en lettres. Un accent oublié, on te le montre ; les lettres accentuées sont au-dessus du champ.',
					items: [
						{ consigne: 'Écris en lettres : 30 €', answers: ['trenta euros'], choses: ['nombre-30', 'euro-centim'], explain: '*trenta euros* : la dizaine finit par « o ».' },
						{ consigne: 'Écris en lettres : 40 centimes', answers: ['quaranta centims'], choses: ['nombre-40', 'euro-centim'], explain: '*quaranta centims* : un *-s* aux centimes.' },
						{ consigne: 'Écris en lettres : 50 €', answers: ['cinquanta euros'], choses: ['nombre-50'], explain: '*cinquanta*, comme *cinc*.' },
						{ consigne: 'Écris en lettres : 60', answers: ['seissanta'], choses: ['nombre-60'], explain: '*seissanta* : deux *s* au milieu.' },
						{ consigne: 'Écris en lettres : 70', answers: ['setanta'], choses: ['nombre-70'], explain: '*setanta*, comme *sèt*, mais sans accent : la voix appuie sur « TAN ».' },
						{ consigne: 'Écris en lettres : 80', answers: ['ochanta'], choses: ['nombre-80'], explain: '*ochanta* : le « ch » sonne « tch ».' },
						{ consigne: 'Écris en lettres : 90', answers: ['nonanta'], choses: ['nombre-90'], explain: '*nonanta*, comme *nòu*.' },
						{ consigne: 'Écris en lettres : 100 €', answers: ['cent euros'], choses: ['nombre-100', 'euro-centim'], explain: '*cent euros* « SÉN ÉOU-rous ».' },
						{ consigne: 'Écris en lettres : 22 €', answers: ['vint-e-dos euros'], choses: ['vint-e-un'], explain: '*vint-e-dos* : avec *e*, et deux traits d’union.' }
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
					intro: 'Écris en occitan, pour toi. Majuscules et ponctuation ne comptent pas ; un accent oublié, on te le montre.',
					items: [
						{
							consigne: 'Demande le prix des pommes.',
							answers: ['Quant còstan las pomas ?', 'Las pomas, quant còstan ?'],
							choses: ['quant-costa', 'la-poma'],
							explain: 'Plusieurs pommes : *còstan*.'
						},
						{
							consigne: 'Au moment de payer, demande combien ça fait.',
							answers: ['Quant fa ?'],
							choses: ['far-singular'],
							explain: '*Quant fa ?* : mot à mot, combien ça fait ?'
						},
						{
							consigne: 'Tu tends deux billets : voilà quarante euros !',
							answers: ['Vaquí quaranta euros !'],
							choses: ['vaqui', 'nombre-40'],
							explain: '*Vaquí* : voilà, en tendant quelque chose. Et *quaranta*, comme *quatre*.'
						},
						{
							consigne: 'Près de chez toi, combien coûte un kilo de tomates ? Commence par *Un quilò de tomatas còsta…*',
							debut: ['Un quilò de tomatas còsta', 'Lo quilò de tomatas còsta', 'Las tomatas còstan'],
							choses: ['quant-costa', 'la-tomata'],
							explain: 'Par exemple : *Un quilò de tomatas còsta tres euros.*'
						},
						{
							consigne: 'Vingt-six euros ? C’est cher ! (*car* : cher)',
							answers: ['Vint-e-sièis euros ? Es car !'],
							choses: ['vint-e-un', 'nombre-6'],
							explain: '*Es car !* : c’est cher. Et Ramon répondrait : *Mas es bon !*'
						}
					]
				},
				{
					type: 'escriure',
					title: 'Les dizaines, pour dire l’âge',
					intro: 'Les mêmes nombres servent pour l’âge (module 3.1 : *Karim a vint ans*). Écris en occitan.',
					items: [
						{
							consigne:
								'Souviens-toi du repas chez Mameta (module 3.1) : *Vint ans… quatre còps !* Maintenant tu peux le dire en un mot. Écris : Mameta a quatre-vingts ans.',
							answers: ['Mameta a ochanta ans.'],
							choses: ['nombre-80', 'a-ans'],
							explain: '*ochanta* : quatre-vingts, en un seul mot, comme *uèch* (8).'
						},
						{
							consigne: 'Ramon, le fromager, a soixante-dix ans.',
							answers: ['Ramon a setanta ans.'],
							choses: ['nombre-70', 'a-ans'],
							explain: '*setanta* : soixante-dix, en un seul mot, comme *sèt* (7).'
						},
						{
							consigne: 'Ma mère a soixante ans.',
							answers: ['Ma maire a seissanta ans.'],
							choses: ['nombre-60', 'a-ans', 'la-maire'],
							explain: '*seissanta*, comme *sièis* (6), avec deux *s*.'
						},
						{
							consigne: 'Mon grand-père a quatre-vingt-dix ans.',
							answers: ['Mon papeta a nonanta ans.'],
							choses: ['nombre-90', 'a-ans', 'papeta-mameta'],
							explain: '*nonanta* : quatre-vingt-dix, en un seul mot, comme *nòu* (9).'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					intro: 'Touche les mots dans l’ordre.',
					items: [
						{
							prompt: 'Combien coûtent les tomates ? Trois euros le kilo.',
							tiles: ['Quant', 'còstan', 'las', 'tomatas ?', 'Tres', 'euros', 'lo', 'quilò.'],
							choses: ['quant-costa', 'la-tomata'],
							explain: '*còstan* : les tomates sont plusieurs.'
						},
						{
							prompt: 'Voilà cinquante euros.',
							tiles: ['Vaquí', 'cinquanta', 'euros.'],
							choses: ['vaqui', 'nombre-50'],
							explain: '*Vaquí cinquanta euros* : en tendant le billet.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À voix haute : présente quelqu’un',
					intro: 'Une personne que tu connais fait ses courses : dis son âge, ce qu’elle prend, et combien ça coûte. Puis compare au modèle.',
					items: [
						{
							q: 'Ta sœur, ton grand-père, une voisine…',
							a: 'Par exemple : *Ma sòrre a vint-e-dos ans. Al mercat : un quilò de pomas, dos euros ; un pauc de formatge, vint euros. Quant fa ? Vint-e-dos euros !* Vingt-deux ans, vingt-deux euros : le hasard fait bien les choses.'
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
					title: 'Le son du jour : un chiffre, ou une dizaine ?',
					paragraphs: [
						'Les dizaines ressemblent aux chiffres : *tres* « TRÉS », *trenta* « TRÉN-to » ; *quatre* « KA-tré », *quaranta* « ka-RAN-to ».',
						'Dans les dizaines, la voix appuie sur l’avant-dernière syllabe, et le *-a* final sonne « o » : *cinquanta* « sin-KAN-to », *setanta* « sé-TAN-to ».',
						'Au marché, écoute la fin du nombre : un « o » léger, c’est une dizaine.'
					]
				},
				{
					type: 'qcm',
					title: 'L’oreille',
					items: [
						{
							q: '« ka-RAN-to » : c’est…',
							options: ['40', '4'],
							correct: 0,
							noShuffle: true,
							explain: '*quaranta* : 40. 4, *quatre*, se dit « KA-tré ».'
						},
						{
							q: 'Lequel veut dire 70 ?',
							options: ['sé-TAN-to', 'SÈT'],
							correct: 0,
							noShuffle: true,
							explain: '*setanta* « sé-TAN-to » : 70. « SÈT », c’est *sèt* : 7.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Répète à voix haute',
					intro: 'Dis la phrase, puis regarde.',
					items: [
						{
							q: '*Tres, trenta ; quatre, quaranta ; cinc, cinquanta.*',
							a: '« TRÉS, TRÉN-to ; KA-tré, ka-RAN-to ; SINK, sin-KAN-to » : chaque dizaine finit par un « o » léger.'
						},
						{
							q: '*Sièis, seissanta ; uèch, ochanta ; nòu, nonanta.*',
							a: '« SYÈÏS, séï-SAN-to ; UÈTCH, ou-TCHAN-to ; NÒOU, nou-NAN-to » : la dizaine ressemble au chiffre, et finit par un « o » léger.'
						},
						{
							q: '*Quant còstan las pomas ? Tres euros lo quilò.*',
							a: '« KAN CÒS-ton las POU-mos ? tré-ZÉOU-rous lou ki-LÒ » : dans *còstan* et *pomas*, la voix appuie au début.'
						}
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : à bon marché, prends garde',
					glosa: { 'a bon marcat, aviso-te': 'à bon marché, prends garde à toi (provençal, graphie de Mistral)' },
					paragraphs: [
						'Un proverbe provençal, relevé par Mistral dans son grand dictionnaire : *A bon marcat, aviso-te* (à bon marché, prends garde à toi). Il est écrit comme Mistral l’écrivait ; chez toi, le marché, c’est *lo mercat*.',
						'Source : Frédéric Mistral, Lou Trésor dóu Felibrige (1878-1886), tome II, article « marcat ».'
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : je peux…',
					intro: 'Coche seulement ce que tu sais faire seul. Le reste reviendra : ton carnet de révision te le resservira.',
					items: [
						'demander le prix d’une chose ou de plusieurs : *Quant còsta ?*, *Quant còstan ?*',
						'compter de vingt à cent, de dix en dix',
						'dire un prix de vingt et un à vingt-neuf : *vint-e-dos euros*',
						'payer : *Quant fa ?*, *Vaquí !*'
					]
				},
				{
					type: 'note',
					variant: 'task',
					title: 'Défi de la semaine',
					paragraphs: [
						'Tu sais maintenant demander un prix, le comprendre, et payer.',
						'Si tu en as envie : avant de payer tes courses, dis le prix en occitan dans ta tête, ou demande *Quant còsta ?* à une personne précise, une marchande, un ami. Quand ? Où ? Choisis-le maintenant.'
					]
				}
			]
		}
	]
};
