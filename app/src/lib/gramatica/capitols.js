// Le sommaire de la grammaire (S'apren), dans NOTRE ordre : celui où l'élève
// rencontre chaque notion dans le parcours (unités de l'A1, puis la trame
// A2-C1), d'après la couverture du cursus
// (Modules_cors/…/cursus/cobertura-gramatica.md §1). Romain, 2026-11-03 : on
// prend les informations du livre de référence, on ne reproduit pas le livre
// (ni son texte, ni son plan). « pages » : où lire la notion dans la Gramatica
// de l'occitan estandard (pages imprimées), pour écrire la fiche ; pas affiché.
// Une fiche se range sous sa notion par son champ « capitol » : il suffit
// d'ajouter son fichier dans fichas/ pour qu'elle apparaisse.
//
// « tema » : la couleur de la notion dans le sommaire (Romain, 2026-11-04 :
// « un code couleur un peu plus clair en fonction des thématiques », puis
// « pouvoir filtrer en haut… les cases de couleurs… dans l'ordre logique de
// l'apprentissage »). Cinq thèmes, couleurs de la charte sans le rouge du
// logo (réservé à ce qui se clique). Une nouvelle notion prend l'un de ces
// thèmes (contrôlé par les tests). Possessifs et démonstratifs sous « Le
// nom » (Romain, même jour : ils accompagnent le nom, comme les articles).

export const TEMAS = [
	{ id: 'sons', fr: 'Les sons', detalh: 'lire et prononcer' },
	{ id: 'nom', fr: 'Le nom', detalh: 'articles, possessifs, adjectifs, nombres' },
	{ id: 'pronoms', fr: 'Les pronoms', detalh: 'je, me, quelqu’un, rien' },
	{ id: 'verb', fr: 'Le verbe', detalh: 'les temps, les modes, les formes' },
	{ id: 'frasa', fr: 'La phrase', detalh: 'relier, nier, questionner, situer' }
];

export const PARTS = [
	{
		titol: 'Dès le début du parcours',
		capitols: [
			{ id: 'sons', tema: 'sons', fr: 'La prononciation', unitat: 1, pages: '9-22' },
			{ id: 'preposicions', tema: 'frasa', fr: 'Les prépositions', unitat: 1, pages: '62' },
			{ id: 'adverbis', tema: 'frasa', fr: 'Les adverbes', unitat: 1, pages: '57' },
			{ id: 'present', tema: 'verb', fr: 'Le présent', detalh: 'avec *aver* et *èsser*', unitat: 1, pages: '67-68' },
			{ id: 'nom-adjectiu', tema: 'nom', fr: 'Le nom et l’adjectif', detalh: 'masculin, féminin, pluriel', unitat: 2, pages: '33-36' },
			{ id: 'pronoms-personals', tema: 'pronoms', fr: 'Les pronoms personnels', unitat: 2, pages: '43-45' },
			{ id: 'negacion', tema: 'frasa', fr: 'Dire non : la négation', unitat: 2, pages: '56' },
			{ id: 'questions', tema: 'frasa', fr: 'Poser une question', detalh: 'interrogatifs et relatifs', unitat: 2, pages: '48-50' },
			{ id: 'conjoncions', tema: 'frasa', fr: 'Relier deux idées : les conjonctions', unitat: 2, pages: '58-61' },
			{ id: 'nombres', tema: 'nom', fr: 'Les nombres', unitat: 3, pages: '54-55' },
			{ id: 'article-definit', tema: 'nom', fr: 'L’article défini', unitat: 3, pages: '23-24' },
			{ id: 'possessius', tema: 'nom', fr: 'Les possessifs', unitat: 3, pages: '41-42' },
			{ id: 'article-indefinit', tema: 'nom', fr: 'L’article indéfini', unitat: 3, pages: '25-26' },
			{ id: 'verb', tema: 'verb', fr: 'Le verbe : infinitif et groupes', unitat: 4, pages: '63-66' },
			{ id: 'alternanca', tema: 'verb', fr: 'Quand la voyelle change', detalh: '*levar*, *lèvi*', unitat: 4, pages: '86-93' },
			{ id: 'condicional', tema: 'verb', fr: 'Le conditionnel de politesse', unitat: 5, pages: '73' },
			{ id: 'indefinits', tema: 'pronoms', fr: 'Les indéfinis', detalh: 'quelqu’un, rien, chaque…', unitat: 5, pages: '51-53' },
			{ id: 'pronominal', tema: 'verb', fr: 'Les verbes pronominaux', unitat: 6, pages: '84' },
			{ id: 'placa-adjectiu', tema: 'nom', fr: 'La place de l’adjectif', unitat: 7, pages: '40' },
			{ id: 'imperatiu', tema: 'verb', fr: 'L’impératif', unitat: 8, pages: '78-80' }
		]
	},
	{
		titol: 'Pour aller plus loin',
		capitols: [
			{ id: 'demonstratius', tema: 'nom', fr: 'Les démonstratifs', pages: '46-47' },
			{ id: 'futur', tema: 'verb', fr: 'Le futur', pages: '71-72' },
			{ id: 'tempses-compausats', tema: 'verb', fr: 'Le passé composé et les temps composés', pages: '82-83' },
			{ id: 'acords', tema: 'nom', fr: 'Les accords', pages: '36-37' },
			{ id: 'imperfach', tema: 'verb', fr: 'L’imparfait', pages: '70-71' },
			{ id: 'preterit', tema: 'verb', fr: 'Le passé simple', pages: '69' },
			{ id: 'grases', tema: 'nom', fr: 'Comparer : plus, moins, le plus', pages: '38-39' },
			{ id: 'condicion', tema: 'frasa', fr: 'Exprimer une condition', pages: '81' },
			{ id: 'subjonctiu', tema: 'verb', fr: 'Le subjonctif', pages: '74-78' },
			{ id: 'formacion', tema: 'nom', fr: 'Comment se forment les mots', detalh: 'suffixes, diminutifs', pages: '27-32' },
			{ id: 'passiu', tema: 'verb', fr: 'La voix passive', pages: '85' },
			{ id: 'irregulars', tema: 'verb', fr: 'Les verbes irréguliers', pages: '94-98' }
		]
	}
];
