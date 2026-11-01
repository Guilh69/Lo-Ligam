// Livres libres de droits à feuilleter (2026-10-29, Romain : une rubrique
// « Livres » dans Médias, avec les pages qui tournent et le bruit du papier).
// Chaque livre : ses pages sont des images légères dans static/livres/<id>/
// (p001.webp…) et son texte dans static/livres/<id>/texte.json (une liste de
// lignes par page, pour le mode texte). Source : scan de Romain, 2026-09-23.
// Pages exportées de DesignCraft (scan 2026-09-23), WebP 602 x 952, 36 Ko en moyenne.

export const LIVRES = [
	{
		id: 'pastre-1913',
		autor: 'Louis Pastre',
		any: 1913,
		pagines: 161,
		// titre d'origine, en français : un titre de livre ne se traduit pas en silence ;
		// les traductions ci-dessous sont des sous-titres (à valider par Romain)
		titolOriginal: 'Le sous-dialecte bas-languedocien de Clermont-l’Hérault',
		sotaOriginal: 'Notes historiques, philologiques, grammaticales, lexicographiques, folkloriques et bibliographiques. Perpignan, J. Comet, 1913.',
		titol: {
			oc: 'Lo sosdialècte bas-lengadocian de Clarmont de l’Erau',
			fr: 'Le sous-dialecte bas-languedocien de Clermont-l’Hérault',
			es: 'El subdialecto bajo-languedociano de Clermont-l’Hérault',
			en: 'The Lower Languedocian sub-dialect of Clermont-l’Hérault',
			ca: 'El subdialecte baix-llenguadocià de Clermont-l’Hérault',
			ar: 'اللهجة الفرعية للّنغدوك السفلى في كليرمون-ليرو'
		},
		sota: {
			oc: 'Nòtas istoricas, filologicas, gramaticalas, lexicograficas, folkloricas e bibliograficas. Perpinhan, 1913.',
			fr: 'Notes historiques, philologiques, grammaticales, lexicographiques, folkloriques et bibliographiques. Perpignan, 1913.',
			es: 'Notas históricas, filológicas, gramaticales, lexicográficas, folclóricas y bibliográficas. Perpiñán, 1913.',
			en: 'Historical, philological, grammatical, lexicographical, folkloric and bibliographical notes. Perpignan, 1913.',
			ca: 'Notes històriques, filològiques, gramaticals, lexicogràfiques, folklòriques i bibliogràfiques. Perpinyà, 1913.',
			ar: 'ملاحظات تاريخية وفقه لغوية ونحوية ومعجمية وفولكلورية وببليوغرافية. بيربينيان، 1913.'
		}
	}
];
