// Le sommaire de la grammaire (S'apren), dans NOTRE ordre : celui où l'élève
// rencontre chaque notion dans le parcours (unités de l'A1, puis la trame
// A2-C1), d'après la couverture du cursus
// (Modules_cors/…/cursus/cobertura-gramatica.md §1). Romain, 2026-11-03 : on
// prend les informations du livre de référence, on ne reproduit pas le livre
// (ni son texte, ni son plan). « pages » : où lire la notion dans la Gramatica
// de l'occitan estandard (pages imprimées), pour écrire la fiche ; pas affiché.
// Une fiche se range sous sa notion par son champ « capitol » : il suffit
// d'ajouter son fichier dans fichas/ pour qu'elle apparaisse.

export const PARTS = [
	{
		titol: 'Dès le début du parcours',
		capitols: [
			{ id: 'sons', fr: 'Les sons et l’accent écrit', unitat: 1, pages: '9-22' },
			{ id: 'preposicions', fr: 'Les prépositions', unitat: 1, pages: '62' },
			{ id: 'adverbis', fr: 'Les adverbes', unitat: 1, pages: '57' },
			{ id: 'present', fr: 'Le présent', detalh: 'avec *aver* et *èsser*', unitat: 1, pages: '67-68' },
			{ id: 'nom-adjectiu', fr: 'Le nom et l’adjectif', detalh: 'masculin, féminin, pluriel', unitat: 2, pages: '33-36' },
			{ id: 'pronoms-personals', fr: 'Les pronoms personnels', unitat: 2, pages: '43-45' },
			{ id: 'negacion', fr: 'Dire non : la négation', unitat: 2, pages: '56' },
			{ id: 'questions', fr: 'Poser une question', detalh: 'interrogatifs et relatifs', unitat: 2, pages: '48-50' },
			{ id: 'conjoncions', fr: 'Relier deux idées : les conjonctions', unitat: 2, pages: '58-61' },
			{ id: 'nombres', fr: 'Les nombres', unitat: 3, pages: '54-55' },
			{ id: 'article-definit', fr: 'L’article défini', unitat: 3, pages: '23-24' },
			{ id: 'possessius', fr: 'Les possessifs', unitat: 3, pages: '41-42' },
			{ id: 'article-indefinit', fr: 'L’article indéfini', unitat: 3, pages: '25-26' },
			{ id: 'verb', fr: 'Le verbe : infinitif et groupes', unitat: 4, pages: '63-66' },
			{ id: 'alternanca', fr: 'Quand la voyelle change', detalh: '*levar*, *lèvi*', unitat: 4, pages: '86-93' },
			{ id: 'condicional', fr: 'Le conditionnel de politesse', unitat: 5, pages: '73' },
			{ id: 'indefinits', fr: 'Les indéfinis', detalh: 'quelqu’un, rien, chaque…', unitat: 5, pages: '51-53' },
			{ id: 'pronominal', fr: 'Les verbes pronominaux', unitat: 6, pages: '84' },
			{ id: 'placa-adjectiu', fr: 'La place de l’adjectif', unitat: 7, pages: '40' },
			{ id: 'imperatiu', fr: 'L’impératif', unitat: 8, pages: '78-80' }
		]
	},
	{
		titol: 'Pour aller plus loin',
		capitols: [
			{ id: 'demonstratius', fr: 'Les démonstratifs', pages: '46-47' },
			{ id: 'futur', fr: 'Le futur', pages: '71-72' },
			{ id: 'tempses-compausats', fr: 'Le passé composé et les temps composés', pages: '82-83' },
			{ id: 'acords', fr: 'Les accords', pages: '36-37' },
			{ id: 'imperfach', fr: 'L’imparfait', pages: '70-71' },
			{ id: 'preterit', fr: 'Le passé simple', pages: '69' },
			{ id: 'grases', fr: 'Comparer : plus, moins, le plus', pages: '38-39' },
			{ id: 'condicion', fr: 'Exprimer une condition', pages: '81' },
			{ id: 'subjonctiu', fr: 'Le subjonctif', pages: '74-78' },
			{ id: 'formacion', fr: 'Comment se forment les mots', detalh: 'suffixes, diminutifs', pages: '27-32' },
			{ id: 'passiu', fr: 'La voix passive', pages: '85' },
			{ id: 'irregulars', fr: 'Les verbes irréguliers', pages: '94-98' }
		]
	}
];
