// Module 1.3 · A1 · « Soi de… » : contenu structuré.
// Source : Modules_cors/…/cursus/modules/1.3-soi-de.md
// ⚠️ Occitan à valider par Romain (vérifié API 29/08 ; voir notes du md :
// vèrb'Òc affiche « ès » : décision « siás » maintenue ; país ⚠️).

export const modul13 = {
	id: 'modul-1-3',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-3',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.3',
	oc: 'Soi de…',
	fr: 'Dire d’où je suis et où j’habite',
	cando:
		'Je peux dire d’où je viens et où j’habite, le demander, et dire d’où vient quelqu’un d’autre.',
	durada: '~50 min · 6 étapes de 8-10 min',
	nomsPropris: ['Núria', 'Karim', 'Loís', 'Marià', 'Lisa', 'Barcelona', 'Marselha'],

	sessions: [
		{
			title: 'Rappel de 1.1-1.2 + Escota',
			minutes: 9,
			blocks: [
				{
					type: 'reveal',
					title: 'Rappel : de mémoire (modules 1.1-1.2)',
					items: [
						{ q: 'Demande son nom à quelqu’un que tu vouvoies.', a: '*Cossí vos dison ? / Cossí vos apelatz ?*' },
						{ q: '« On me dit Loís. »', a: '*Me dison Loís.*' },
						{ q: 'Une femme dit « enchanté » :', a: '*Encantada !*' },
						{ q: 'Réponds à *Cossí vas ?* (réponse complète).', a: '*Va plan, mercé. E tu ?*' },
						{ q: 'Tu quittes un groupe le soir : « ___ ! »', a: '*Adieu-siatz !*' }
					]
				},
				{
					type: 'dialogue',
					title: 'Escota : écoute d’abord, lis ensuite',
					intro: 'Toujours la fèsta. Núria, Karim et Loís font connaissance : d’où vient chacun ?',
					scenes: [
						{
							title: 'D’ont sètz, totes ?',
							subtitle: '(d’où venez-vous, tous ?)',
							lines: [
								{ oc: 'Núria, d’ont siás ?', sound: 'NOU-ria, d’oun SYOS ?' },
								{ oc: 'Soi de Barcelona ! E tu, Karim ?', sound: 'souï dé bar-sé-LOU-no ! é TU, ka-RIM ?' },
								{ oc: 'Ieu, soi de Besièrs. Mas demòri a Tolosa.', sound: 'YÉOU, souï dé bé-ZYÈS. mas dé-MÒ-ri a tou-LOU-zo.' },
								{ oc: 'E Loís, d’ont es ?', sound: 'é lou-ÍS, d’oun ÉS ?' },
								{ oc: 'Loís es del vilatge. Demòra aquí, sus la plaça !', sound: 'lou-ÍS és dél bi-LA-djé. dé-MÒ-ro a-KI, sus la PLA-ço !' },
								{ oc: 'E Marià es d’aquí ?', sound: 'é ma-ri-A és da-KI ?' },
								{ oc: 'Òc, Marià es del país.', sound: 'OK, ma-ri-A és dél pa-ÍS.' }
							]
						}
					],
					glossary: [
						{ oc: 'òc', sound: 'OK', fr: 'oui : le mot qui a donné son nom à la lenga d’òc !' },
						{ oc: 'mas', sound: 'MAS', fr: 'mais' },
						{ oc: 'aquí', sound: 'a-KI', fr: 'ici' },
						{ oc: 'del', sound: 'dél', fr: 'du (de + lo : tu le reverras en détail plus tard)' },
						{ oc: 'lo país', sound: 'lou pa-ÍS', fr: 'le pays (le coin, chez nous)' }
					]
				}
			]
		},

		{
			title: 'Comprendre + Los que parlan',
			minutes: 8,
			blocks: [
				{
					type: 'qcm',
					title: 'Compréhension',
					items: [
						{
							q: 'Qui est né à Besièrs mais vit à Tolosa ?',
							options: ['Karim', 'Núria', 'Loís'],
							correct: 0,
							explain: '*Soi de Besièrs. Mas demòri a Tolosa.* Núria est de Barcelona.'
						},
						{
							q: 'Vrai ou faux : Loís habite le village.',
							options: ['Vrai', 'Faux'],
							correct: 0,
							noShuffle: true,
							explain: '*Demòra aquí, sus la plaça.*'
						},
						{
							q: 'Chasse à la forme : combien de fois entends-tu *soi / siás / es* en tout ?',
							options: ['7', '4', '10'],
							correct: 0,
							explain: '*siás* ×1, *soi* ×2, *es* ×4 → 7 formes. Ton oreille les connaît déjà.'
						}
					]
				},
				{
					type: 'note',
					variant: 'natiu',
					audio: true,
					title: 'Los que parlan',
					paragraphs: [
						'30 secondes d’un natif : d’où il est, où il a toujours vécu. Tu entendras peut-être *ès* au lieu de *siás* : c’est l’occitan de son pays, tout aussi juste.',
						'*(Enregistrement à venir.)*'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Relecture ciblée',
					paragraphs: [
						'Réécoute en lisant, formes en gras :',
						'— D’ont **siás** ? · — **Soi** de Barcelona ! · — Ieu, **soi** de Besièrs. · — E Loís, d’ont **es** ? · — Loís **es** del vilatge. · — E Marià **es** d’aquí ? · — Òc, Marià **es** del país.'
					]
				}
			]
		},

		{
			title: 'Obsèrva',
			minutes: 9,
			blocks: [
				{
					type: 'qcm',
					title: 'Obsèrva : la forme te dit qui parle',
					intro: 'Regarde la fin du verbe : elle porte la personne.',
					items: [
						{
							q: '*Soi de Marselha.*',
							options: ['je suis', 'tu es', 'elle est'],
							correct: 0,
							choses: ['soi-de'],
							explain: '*soi* = je.'
						},
						{
							q: '*Siás de Tolosa ?* : on parle…',
							options: ['à toi', 'de moi', 'de lui'],
							correct: 0,
							explain: '*siás* = tu.'
						},
						{
							q: '*Es de Besièrs.*',
							options: ['il/elle est', 'je suis', 'tu es'],
							correct: 0,
							explain: '*es* = il/elle.'
						},
						{
							q: '*D’ont siás ?* demande…',
							options: ['l’origine', 'le nom', 'comment ça va'],
							correct: 0,
							choses: ['d-ont-sias'],
							explain: '*D’ont* = d’où.'
						},
						{
							q: '*Demòri a Albi.*',
							options: ['j’habite', 'tu habites', 'il habite'],
							correct: 0,
							choses: ['demori-a'],
							explain: '*demòri* = j’habite (*demorar* : habiter, rester).'
						},
						{
							q: '« Tu ___ d’aquí ? »',
							options: ['siás', 'soi', 'es'],
							correct: 0,
							explain: 'Tu → *siás*.'
						}
					]
				},
				{
					type: 'table',
					title: 'Ton premier point de langue : èsser (être), singulier',
					head: ['', ''],
					rows: [
						['(ieu) **soi**', 'je suis'],
						['(tu) **siás**', 'tu es'],
						['(el / ela) **es**', 'il / elle est']
					],
					notes: [
						'Le pronom est **omis** : *Soi de Nimes.* On l’ajoute pour insister : *Ieu, soi de Besièrs.*',
						'*Se ditz tanben :* **ès** (Roergue, Albigés, Carcin…) pour « tu es » : tout aussi correct.',
						'Être *de* quelque part ≠ y habiter : *Soi de Besièrs* (origine) / *Demòri a Tolosa* (j’y vis).'
					]
				},
				{
					type: 'note',
					variant: 'son',
					title: 'Son du jour : deux « o »',
					paragraphs: [
						'*o* sans accent sonne « ou » : *Tolosa* = tou-LOU-zo, *poma*, *ostal*.',
						'*ò* avec accent = « o ouvert » (comme « bol ») : *demòri* = dé-MÒ-ri, *bròca*, *pòrc*. L’accent écrit te dit tout.'
					]
				},
				{
					type: 'chunks',
					title: 'À retenir',
					intro: 'Ça sonne comme : syllabe forte en capitales.',
					items: [
						{ id: 'soi-de', oc: 'Soi de…', sound: 'souï dé', fr: 'je suis de… (origine)' },
						{ id: 'd-ont-sias', oc: 'D’ont siás ?', sound: 'd’oun SYOS', fr: 'd’où es-tu ?' },
						{ id: 'demori-a', oc: 'Demòri a…', sound: 'dé-MÒ-ri a', fr: 'j’habite à…' },
						{ id: 'ont-demoras', oc: 'Ont demòras ?', sound: 'oun dé-MÒ-ros', fr: 'où habites-tu ?' },
						{ id: 'soi-d-aqui', oc: 'Soi d’aquí.', sound: 'souï da-KI', fr: 'je suis d’ici.' },
						{ id: 'noms-vilas', oc: 'Tolosa · Besièrs · Montpelhièr · Carcassona', sound: 'tou-LOU-zo · bé-ZYÈS · moun-pé-LYÈ · car-ca-SOU-no', fr: 'ta ville a son nom occitan (le r de Besièrs se tait !)' },
						{ id: 'vilatge-vila-pais', oc: 'lo vilatge · la vila · lo país', sound: 'lou bi-LA-djé · la BI-lo · lou pa-ÍS', fr: 'le village, la ville, le pays' }
					]
				}
			]
		},

		{
			title: 'Practica',
			minutes: 9,
			blocks: [
				{
					type: 'qcm',
					title: '3a · Bloc court : soi, siás ou es ?',
					items: [
						{ q: '(ieu) ___ de Nimes.', options: ['soi', 'siás', 'es'], correct: 0, choses: ['soi-de'], noShuffle: true, explain: 'Je → *soi*.' },
						{ q: 'Tu ___ d’ont ?', options: ['soi', 'siás', 'es'], correct: 1, choses: ['d-ont-sias'], noShuffle: true, explain: 'Tu → *siás*.' },
						{ q: 'Ela ___ de Rodés.', options: ['soi', 'siás', 'es'], correct: 2, noShuffle: true, explain: 'Elle → *es*.' },
						{ q: 'Ieu, ___ del vilatge.', options: ['soi', 'siás', 'es'], correct: 0, choses: ['soi-de'], noShuffle: true, explain: '*Ieu* insiste, le verbe reste *soi*.' },
						{ q: 'Karim ___ de Besièrs.', options: ['soi', 'siás', 'es'], correct: 2, noShuffle: true, explain: 'Il → *es*.' },
						{ q: '___ d’aquí, tu ?', options: ['soi', 'siás', 'es'], correct: 1, noShuffle: true, explain: 'Tu → *siás*.' }
					]
				},
				{
					type: 'qcm',
					title: '3b · Mélange (avec 1.1-1.2)',
					items: [
						{
							q: '« ___ de Barcelona. » (elle)',
							options: ['Es', 'Soi', 'Siás'],
							correct: 0,
							explain: '3ᵉ personne → *es*.'
						},
						{
							q: 'Demande son nom à ton ami :',
							options: ['Cossí te dison ?', 'D’ont siás ?', 'Cossí anatz ?'],
							correct: 0,
							choses: ['cossi-te-dison'],
							explain: 'Le nom → *Cossí te dison ?*'
						},
						{
							q: '« D’ont ___ ? » (tu)',
							options: ['siás', 'soi', 'es'],
							correct: 0,
							choses: ['d-ont-sias'],
							explain: 'Tu → *siás*.'
						},
						{
							q: '« Demòri ___ Tolosa. »',
							options: ['a', 'de', 'del'],
							correct: 0,
							choses: ['demori-a'],
							explain: 'Habiter *à* → *a*.'
						},
						{
							q: 'Un homme, enchanté :',
							options: ['Encantat !', 'Encantada !', 'Òc !'],
							correct: 0,
							choses: ['encantat'],
							explain: 'Homme → *-t*.'
						},
						{
							q: 'Vrai ou faux : *Soi de Tolosa* et *Demòri a Tolosa* disent la même chose.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							choses: ['soi-de', 'demori-a'],
							noShuffle: true,
							explain: 'Origine ≠ lieu de vie : Karim : *soi de Besièrs, mas demòri a Tolosa*.'
						},
						{
							q: '« Ieu, me ___ Marià. »',
							options: ['dison', 'apèli', 'demòri'],
							correct: 0,
							choses: ['me-dison'],
							explain: '*me dison* (« on me dit ») ; *m’apèli* marcherait aussi, sans le *me*.'
						},
						{
							q: 'Le soir, tu arrives : « ___ ! »',
							options: ['Bon ser', 'Bonjorn', 'A lèu'],
							correct: 0,
							choses: ['bon-ser'],
							explain: 'Le soir → *Bon ser*.'
						},
						{
							q: '« Loís ___ del país. »',
							options: ['es', 'soi', 'siás'],
							correct: 0,
							explain: 'Il → *es*.'
						},
						{
							q: 'Demande où elle habite :',
							options: ['Ont demòras ?', 'D’ont siás ?', 'Cossí vas ?'],
							correct: 0,
							choses: ['ont-demoras'],
							explain: '*Ont* = où (lieu de vie) ; *D’ont* = d’où (origine).'
						},
						{
							q: '*Siás* ou *ès* : lequel est correct ?',
							options: ['les deux', 'seulement siás', 'seulement ès'],
							correct: 0,
							explain: '*siás* est la forme du cursus, *ès* celle de plusieurs pays (Roergue…) : toutes deux justes.'
						},
						{
							q: 'Salue le groupe et dis d’où tu es :',
							options: ['Adieu-siatz ! Soi de Nimes.', 'A deman ! Siás de Nimes.', 'Bonjorn ! Es de Nimes.'],
							correct: 0,
							choses: ['adieu-siatz', 'soi-de'],
							explain: 'Groupe → *Adieu-siatz* ; je → *soi*.'
						}
					]
				}
			]
		},

		{
			title: 'Parla',
			minutes: 8,
			blocks: [
				{
					type: 'order',
					title: 'Remets dans l’ordre',
					items: [
						{ prompt: 'Je suis de Béziers.', tiles: ['Soi', 'de', 'Besièrs.'], choses: ['soi-de'], explain: '*Soi de Besièrs.*' },
						{ prompt: 'D’où es-tu ?', tiles: ['D’ont', 'siás ?'], choses: ['d-ont-sias'], explain: '*D’ont siás ?*' }
					]
				},
				{
					type: 'reveal',
					title: 'Présente quelqu’un d’autre',
					intro: 'À la 3ᵉ personne : le prénom, puis *es de…*, puis *demòra a…*',
					items: [
						{
							q: 'Ton ami·e : son prénom, d’où il/elle est, où il/elle habite. Dis-le, puis compare.',
							a: 'Modèle : *Lisa es de Nimes. Demòra a Montpelhièr.*'
						}
					]
				},
				{
					type: 'reveal',
					title: 'Traduis',
					items: [
						{ q: 'Je suis de Béziers.', a: '*Soi de Besièrs.*' },
						{ q: 'D’où es-tu ?', a: '*D’ont siás ?*' },
						{ q: 'Elle est du village.', a: '*Es del vilatge.*' },
						{ q: 'J’habite à Montpellier.', a: '*Demòri a Montpelhièr.*' },
						{ q: 'Moi, je suis d’ici.', a: '*Ieu, soi d’aquí.*' }
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Va plus vite : sans chrono',
					list: [
						'**Dis 3 fois** : ton nom, d’où tu es, où tu habites, de plus en plus fluide.',
						'**5 mots-clés** pour rejouer la scène : *Barcelona – Besièrs – Tolosa – vilatge – país*.'
					]
				}
			]
		},

		{
			title: 'Tasca finala + Bilan',
			minutes: 8,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'Tasca finala : À toi',
					paragraphs: [
						'3-4 phrases enregistrées ou écrites : d’où tu viens, où tu habites (+ éventuellement d’où vient quelqu’un de ta famille), puis pose les deux questions : *D’ont siás ? Ont demòras ?*',
						'**Voie privée** : téléphone, réécoute demain. **Voie communautaire** *(bientôt)* : le post de la semaine.'
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'*soi / siás / es* bien choisis',
						'La nuance *soi de* (origine) / *demòri a* (lieu de vie) respectée',
						'*o* = « ou » et *ò* = « o ouvert »',
						'Pronom omis (sauf pour insister)'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple de production',
					items: [
						{
							q: 'Quand tu as fini, regarde un exemple.',
							a: '*Me dison Lisa. Soi de Nimes, mas demòri a Montpelhièr. E tu, d’ont siás ? Ont demòras ?*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan : Je peux…',
					items: [
						'dire d’où je viens et où j’habite',
						'le demander (tu)',
						'dire d’où vient quelqu’un (il/elle)',
						'distinguer *soi / siás / es*'
					]
				},
				{
					type: 'reveal',
					title: 'Mini-test',
					items: [
						{ q: '(ieu) ___ de Carcassona.', a: '*soi*' },
						{ q: '« D’où es-tu ? »', a: '*D’ont siás ?*' },
						{ q: '(ela) ___ d’aquí.', a: '*es*' },
						{ q: '« J’habite à Albi. »', a: '*Demòri a Albi.*' },
						{ q: '*ès*, c’est correct ?', a: 'Oui : la forme de plusieurs pays pour « tu es ».' }
					]
				},
				{
					type: 'note',
					variant: 'culture',
					title: 'Cultura : Ta vila a un nom occitan',
					paragraphs: [
						'*Tolosa, Besièrs, Montpelhièr, Carcassona, Rodés, Albi…* Chaque ville et presque chaque village d’Occitanie a son nom occitan : souvent plus proche de la prononciation locale que le nom français (écoute : *Besièrs*, bé-ZYÈS, le r final se tait).',
						'Va voir la carte de Lo Ligam : ton coin y a son nom.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Se parles catalan / castelhan',
					paragraphs: [
						'*Sóc de Barcelona* ↔ *Soi de Barcelona* : presque jumeau ! *D’on ets ?* ↔ *D’ont siás ?* · Le *o* occitan sans accent sonne « ou » là où le catalan dit [o] : *Tolosa* = tou-LOU-zo.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Réviser plus tard',
					paragraphs: [
						'**Dans 2 jours** : *soi/siás/es*, *soi de / demòri a* · **Dans 7 jours** : *D’ont siás ? Ont demòras ?*, les noms de villes · **Dans 30 jours** : *èsser* au singulier, au complet.'
					]
				}
			]
		}
	]
};
