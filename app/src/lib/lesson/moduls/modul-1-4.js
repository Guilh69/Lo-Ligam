// Module 1.4 · A1 · Tasca « Me presenti ! » : contenu structuré.
// Source : Modules_cors/…/cursus/modules/1.4-tasca-me-presenti.md
// Module d'intégration : aucune forme nouvelle, tout est du recyclage 1.1-1.3.

export const modul14 = {
	id: 'modul-1-4',
	// Date de la relecture de l'occitan par Romain. Tant qu'elle manque, le
	// module n'est visible que d'un administrateur (décision du 2026-10-25).
	relu: null,
	slug: '1-4',
	unitat: 'Unitat 1 · Adieu !',
	nivel: 'A1 · Modul 1.4 · Tasca',
	oc: 'Me presenti !',
	fr: 'Je me présente : la tâche de l’unité',
	cando:
		'Je peux me présenter en 6 phrases : saluer, dire mon nom, d’où je viens, où j’habite, prendre congé, et poser les questions en retour.',
	durada: '~35-40 min · 4 étapes de 8-10 min',
	nomsPropris: ['Karim', 'Núria', 'Loís', 'Marià', 'Lisa', 'Pau'],

	sessions: [
		{
			title: 'Grand Rappel de l’unitat 1',
			minutes: 9,
			blocks: [
				{
					type: 'reveal',
					title: 'Tout ce que tu as appris (modules 1.1 à 1.3), de mémoire',
					intro: 'Rien de nouveau aujourd’hui : on assemble. Réponds à voix haute, puis vérifie.',
					items: [
						{ q: 'Le matin, salue ton amie et demande-lui comment ça va.', a: '*Bonjorn ! Cossí vas ?*' },
						{ q: 'Réponds et retourne la question.', a: '*Va plan, mercé. E tu ?*' },
						{ q: 'Demande son nom à quelqu’un que tu vouvoies.', a: '*Cossí vos dison ? / Cossí vos apelatz ?*' },
						{ q: '« On me dit Núria. »', a: '*Me dison Núria.*' },
						{ q: 'Une femme dit enchanté : « ___ ! »', a: '*Encantada !*' },
						{ q: '« D’où es-tu ? »', a: '*D’ont siás ?*' },
						{ q: '« Je suis de Béziers mais j’habite à Toulouse. »', a: '*Soi de Besièrs mas demòri a Tolosa.*' },
						{ q: 'Quitte le groupe : vous vous revoyez demain.', a: '*A deman ! Adieu-siatz !*' }
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Réécoute',
					paragraphs: [
						'Rejoue les trois dialogues de l’unité (le marché, la fèsta, les origines) : c’est déjà une petite histoire, et tu comprends tout. *(Les audios arriveront ici.)*'
					]
				}
			]
		},

		{
			title: 'Tout mélangé',
			minutes: 10,
			blocks: [
				{
					type: 'qcm',
					title: 'L’unité entière en désordre',
					items: [
						{
							q: 'Le soir, tu arrives et tu salues un groupe :',
							options: ['Bon ser ! Adieu-siatz !', 'Bonjorn ! Adieu !', 'A lèu ! A deman !'],
							correct: 0,
							choses: ['bon-ser', 'adieu-siatz'],
							explain: 'Soir → *Bon ser* ; groupe → *Adieu-siatz*.'
						},
						{
							q: '(ela) ___ de Carcassona.',
							options: ['es', 'soi', 'siás'],
							correct: 0,
							explain: 'Elle → *es*.'
						},
						{
							q: 'Réponds à *Cossí anatz ?* :',
							options: ['Va plan, mercé. E vos ?', 'Me dison Pau.', 'A deman !'],
							correct: 0,
							choses: ['va-plan-e-tu'],
							explain: 'La même réponse *Va plan*, et *E vos ?* pour retourner poliment.'
						},
						{
							q: '« Moi, j’habite ici. »',
							options: ['Ieu, demòri aquí.', 'Ieu, soi aquí.', 'Demòras aquí.'],
							correct: 0,
							choses: ['demori-a'],
							explain: 'Habiter → *demòri* ; *Ieu,* pour insister.'
						},
						{
							q: 'Un homme : « Encanta___ ! »',
							options: ['-t', '-da', '-tz'],
							correct: 0,
							choses: ['encantat'],
							noShuffle: true,
							explain: 'Homme → *Encantat*.'
						},
						{
							q: 'Vrai ou faux : *Adieu* ne sert qu’à partir.',
							options: ['Vrai', 'Faux'],
							correct: 1,
							choses: ['adieu'],
							noShuffle: true,
							explain: 'Il ouvre ET ferme la rencontre, depuis le module 1.1 !'
						},
						{
							q: '« D’ont ___ ? » (tu)',
							options: ['siás', 'soi', 'es'],
							correct: 0,
							choses: ['d-ont-sias'],
							explain: 'Tu → *siás* (*ès* est aussi correct).'
						},
						{
							q: '« À bientôt ! »',
							options: ['A lèu !', 'A deman !', 'Bon ser !'],
							correct: 0,
							choses: ['a-leu'],
							explain: '*A lèu* = bientôt, sans date précise.'
						},
						{
							q: '*Tolosa* se prononce…',
							options: ['tou-LOU-zo', 'to-LO-za'],
							correct: 0,
							explain: '*o* = « ou », *-a* final = « o ».'
						}
					]
				},
				{
					type: 'order',
					title: 'Remets l’histoire dans l’ordre',
					intro: 'Les 6 répliques d’une rencontre complète, mélangées.',
					items: [
						{
							tiles: [
								'Adieu ! Cossí te dison ?',
								'Me dison Pau. E tu ?',
								'Ieu, m’apèli Lisa. Soi de Nimes.',
								'Encantat !',
								'Encantada !',
								'A lèu !'
							],
							explain: 'Saluer → les noms → l’origine → enchanté·e·s → congé. La mélodie complète d’une rencontre.'
						}
					]
				},
				{
					type: 'reveal',
					title: 'À toi de dire',
					items: [
						{ q: '« Comment t’appelles-tu ? » : les deux façons.', a: '*Cossí te dison ? / Cossí t’apèlas ?*' },
						{
							q: 'Présente Karim (il est de Besièrs, il vit à Tolosa) en 2 phrases.',
							a: '*Karim es de Besièrs. Demòra a Tolosa.*'
						},
						{
							q: 'Ton prénom + les deux questions en retour (nom, origine).',
							a: 'Modèle : *Me dison … E tu, cossí te dison ? D’ont siás ?*'
						}
					]
				}
			]
		},

		{
			title: 'Fluiditat',
			minutes: 8,
			blocks: [
				{
					type: 'note',
					variant: 'info',
					title: 'Va plus vite : sans chrono, jamais',
					list: [
						'**Ta présentation, trois fois** : nom, origine, lieu de vie, salut de départ, la 2ᵉ fois plus vite, la 3ᵉ sans notes.',
						'**L’entretien de la fèsta** : réponds sans réfléchir aux quatre questions, *Cossí te dison ? D’ont siás ? Ont demòras ? Cossí vas ?* Puis inverse les rôles.',
						'**5 mots-clés** pour tout rejouer : *Bonjorn – Me dison – Soi de – Demòri – A lèu*.'
					]
				}
			]
		},

		{
			title: 'La Tasca de l’unitat + Bilan',
			minutes: 10,
			blocks: [
				{
					type: 'note',
					variant: 'task',
					title: 'Tasca finala : Me presenti !',
					paragraphs: [
						'Enregistre (ou écris) ta présentation complète en **6 phrases** : ① salutation adaptée au moment, ② ton nom, ③ d’où tu viens, ④ où tu habites, ⑤ une question en retour (*E tu ? D’ont siás ?*), ⑥ congé.',
						'C’est ta première vraie production : **garde-la**, tu la réécouteras dans quelques mois avec un grand sourire.',
						'**Voie privée** : téléphone, réécoute demain. **Voie communautaire** *(bientôt)* : le post de la semaine.',
						'**Bonus** : ajoute une 7ᵉ phrase avec le nom occitan de ta ville ou de ton village (regarde la carte de Lo Ligam).'
					]
				},
				{
					type: 'checklist',
					key: 'criteris',
					title: 'Critères de réussite',
					items: [
						'Les 6 phrases y sont, dans un ordre naturel',
						'*soi / demòri* bien employés (origine ≠ lieu de vie)',
						'*Encantat/Encantada* accordé, et tu/vous cohérent',
						'Prononciation : *-a* final « o », *o* « ou », *Besièrs* sans r final'
					]
				},
				{
					type: 'reveal',
					title: 'Un exemple de production',
					items: [
						{
							q: 'Quand tu as fini (pas avant !), regarde un exemple.',
							a: '*Bonjorn ! Me dison Lisa. Soi de Nimes, mas demòri a Montpelhièr. Encantada ! E tu, cossí te dison ? D’ont siás ? A lèu !*'
						}
					]
				},
				{
					type: 'checklist',
					key: 'bilan',
					title: 'Bilan de l’unitat 1 : Je peux…',
					intro: 'Coche seulement ce que tu sais faire **seul**.',
					items: [
						'saluer et prendre congé (matin/soir, tu/vous)',
						'demander et dire comment ça va',
						'demander et dire le nom (deux façons)',
						'dire d’où je viens et où j’habite',
						'me présenter en 6 phrases d’affilée'
					]
				},
				{
					type: 'reveal',
					title: 'Mini-test',
					items: [
						{ q: 'Salue un groupe le soir.', a: '*Bon ser ! Adieu-siatz !*' },
						{ q: '« Je m’appelle » (les deux façons).', a: '*Me dison … / M’apèli …*' },
						{ q: '(tu) ___ d’ont ?', a: '*Siás*' },
						{ q: '« J’habite à Rodés. »', a: '*Demòri a Rodés.*' },
						{ q: 'Ta présentation en 3 phrases, là, maintenant.', a: 'Modèle : *Me dison … Soi de … Demòri a …*' }
					]
				},
				{
					type: 'note',
					variant: 'culture',
					audio: true,
					title: 'Cultura : Adieu paure Carnaval, ta première chanson',
					paragraphs: [
						'Tu la connais depuis le module 1.1 : maintenant tu peux la chanter en comprenant : *adieu* (il ouvre ET il ferme), *paure* (pauvre). Écoute le refrain une dernière fois, chante par-dessus, et compte les *adieu*.',
						'C’est l’adieu le plus célèbre de la culture occitane : et ta première chanson.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: 'Se parles catalan / castelhan',
					paragraphs: [
						'Ta présentation entière est presque du catalan : *Em dic… / Sóc de… / Visc a…* ↔ *Me dison… / Soi de… / Demòri a…*, six phrases, deux langues sœurs.'
					]
				},
				{
					type: 'note',
					variant: 'info',
					title: '🎉 Fin de l’unitat 1 !',
					paragraphs: [
						'*Òsca !* Tu sais te présenter en occitan : saluer, te nommer, dire d’où tu viens, prendre congé. La suite du chemin : l’unitat 2, *D’ont ses ?*, origines, langues et nationalités.',
						'**Dans 2 jours** : ta présentation complète · **Dans 7 jours** : les 4 questions · **Dans 30 jours** : toute l’unité, le site te les resservira.'
					]
				}
			]
		}
	]
};
