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
//
// Les langues (Romain, 2026-11-04 : « quand on est sur l'option occitan, il
// faut que ce soit que de l'occitan, et quand on survole… que ce soit
// expliqué avec d'autres mots mais en occitan, ou alors des exemples ») :
// « nom » et « detalh » dans chaque langue du site (lus par tria()), et
// « exemple », en occitan seulement, pour la bulle de survol (pour les sons :
// « telle lettre = tel son », Romain 2026-11-04, pas des mots en vrac). En occitan, la
// bulle donne les exemples ; dans une autre langue, le nom occitan et les
// exemples. Les termes suivent la Gramatica (los tempses, los possessius…)
// et lo Congrès. Occitan à relire par Romain. Une langue manquante retombe
// sur l'occitan (tria).

// « o = « ou » », chaque paire insécable : elle ne se coupe pas en fin de ligne
const sons = (...p) => p.map(([l, s]) => `${l}\u00a0=\u00a0«\u00a0${s}\u00a0»`).join(', ');

export const TEMAS = [
	{
		id: 'sons',
		nom: { oc: 'Los sons', fr: 'Les sons', es: 'Los sonidos', en: 'Sounds', ca: 'Els sons', ar: 'الأصوات' },
		detalh: { oc: 'legir e prononciar', fr: 'lire et prononcer', es: 'leer y pronunciar', en: 'reading and pronouncing', ca: 'llegir i pronunciar', ar: 'القراءة والنطق' },
		exemple: sons(['o', 'ou'], ['ò', 'o'], ['v', 'b'], ['lh', 'ly'])
	},
	{
		id: 'nom',
		nom: { oc: 'Lo nom', fr: 'Le nom', es: 'El sustantivo', en: 'The noun', ca: 'El nom', ar: 'الاسم' },
		detalh: { oc: 'articles, possessius, adjectius, nombres', fr: 'articles, possessifs, adjectifs, nombres', es: 'artículos, posesivos, adjetivos, números', en: 'articles, possessives, adjectives, numbers', ca: 'articles, possessius, adjectius, nombres', ar: 'أدوات التعريف والتنكير، ضمائر الملكية، الصفات، الأعداد' },
		exemple: 'lo pan, una vila, mon ostal, tres amics'
	},
	{
		id: 'pronoms',
		nom: { oc: 'Los pronoms', fr: 'Les pronoms', es: 'Los pronombres', en: 'Pronouns', ca: 'Els pronoms', ar: 'الضمائر' },
		detalh: { oc: 'ieu, me, qualqu’un, res', fr: 'je, me, quelqu’un, rien', es: 'yo, me, alguien, nada', en: 'I, me, someone, nothing', ca: 'jo, em, algú, res', ar: 'أنا، نحن، أحد ما، لا شيء' },
		exemple: 'ieu, tu, me, vos, quicòm, res'
	},
	{
		id: 'verb',
		nom: { oc: 'Lo vèrbe', fr: 'Le verbe', es: 'El verbo', en: 'The verb', ca: 'El verb', ar: 'الفعل' },
		detalh: { oc: 'los tempses, los mòdes, las formas', fr: 'les temps, les modes, les formes', es: 'los tiempos, los modos, las formas', en: 'tenses, moods, forms', ca: 'els temps, els modes, les formes', ar: 'الأزمنة، الصيغ، التصريفات' },
		exemple: 'parli, parlarai, ai parlat'
	},
	{
		id: 'frasa',
		nom: { oc: 'La frasa', fr: 'La phrase', es: 'La oración', en: 'The sentence', ca: 'La frase', ar: 'الجملة' },
		detalh: { oc: 'ligar, negar, demandar, situar', fr: 'relier, nier, questionner, situer', es: 'unir, negar, preguntar, situar', en: 'linking, negating, asking, locating', ca: 'lligar, negar, preguntar, situar', ar: 'الربط والنفي والسؤال وتحديد المكان' },
		exemple: 'e, mas, perque ; sabi pas ; ont ?'
	}
];

export const PARTS = [
	{
		id: 'debuta',
		titol: { oc: 'Dempuèi lo començament del parcors', fr: 'Dès le début du parcours', es: 'Desde el principio del recorrido', en: 'From the start of the course', ca: 'Des del començament del recorregut', ar: 'منذ بداية المسار' },
		capitols: [
			{ id: 'sons', tema: 'sons', nom: { oc: 'La prononciacion', fr: 'La prononciation', es: 'La pronunciación', en: 'Pronunciation', ca: 'La pronunciació', ar: 'النطق' }, exemple: sons(['-a', 'o'], ['ch', 'tch'], ['j', 'dj'], ['nh', 'gn']), unitat: 1, pages: '9-22' },
			{ id: 'preposicions', tema: 'frasa', nom: { oc: 'Las preposicions', fr: 'Les prépositions', es: 'Las preposiciones', en: 'Prepositions', ca: 'Les preposicions', ar: 'حروف الجر' }, exemple: 'a, de, dins, amb, per ; al, del', unitat: 1, pages: '62' },
			{ id: 'adverbis', tema: 'frasa', nom: { oc: 'Los advèrbis', fr: 'Les adverbes', es: 'Los adverbios', en: 'Adverbs', ca: 'Els adverbis', ar: 'الظروف' }, exemple: 'plan, tanben, uèi', unitat: 1, pages: '57' },
			{
				id: 'present',
				tema: 'verb',
				nom: { oc: 'Lo present', fr: 'Le présent', es: 'El presente', en: 'The present tense', ca: 'El present', ar: 'المضارع' },
				detalh: { oc: 'amb *aver* e *èsser*', fr: 'avec *aver* et *èsser*', es: 'con *aver* y *èsser*', en: 'with *aver* and *èsser*', ca: 'amb *aver* i *èsser*', ar: 'مع *aver* و*èsser*' },
				exemple: 'soi, ai, parli',
				unitat: 1,
				pages: '67-68'
			},
			{
				id: 'nom-adjectiu',
				tema: 'nom',
				nom: { oc: 'Lo nom e l’adjectiu', fr: 'Le nom et l’adjectif', es: 'El sustantivo y el adjetivo', en: 'The noun and the adjective', ca: 'El nom i l’adjectiu', ar: 'الاسم والصفة' },
				detalh: { oc: 'masculin, femenin, plural', fr: 'masculin, féminin, pluriel', es: 'masculino, femenino, plural', en: 'masculine, feminine, plural', ca: 'masculí, femení, plural', ar: 'المذكر والمؤنث والجمع' },
				exemple: 'occitan, occitana ; amic, amiga, amics',
				unitat: 2,
				pages: '33-36'
			},
			{ id: 'pronoms-personals', tema: 'pronoms', nom: { oc: 'Los pronoms personals', fr: 'Les pronoms personnels', es: 'Los pronombres personales', en: 'Personal pronouns', ca: 'Els pronoms personals', ar: 'الضمائر الشخصية' }, exemple: 'ieu, tu, el, ela ; me, te, se ; vos', unitat: 2, pages: '43-45' },
			{ id: 'negacion', tema: 'frasa', nom: { oc: 'Dire non : la negacion', fr: 'Dire non : la négation', es: 'Decir que no: la negación', en: 'Saying no: negation', ca: 'Dir que no: la negació', ar: 'قول «لا»: النفي' }, exemple: 'Non sabi pas ; sabi pas ; jamai, res, degun', unitat: 2, pages: '56' },
			{
				id: 'questions',
				tema: 'frasa',
				nom: { oc: 'Pausar una question', fr: 'Poser une question', es: 'Hacer una pregunta', en: 'Asking a question', ca: 'Fer una pregunta', ar: 'طرح سؤال' },
				detalh: { oc: 'interrogatius e relatius', fr: 'interrogatifs et relatifs', es: 'interrogativos y relativos', en: 'interrogatives and relatives', ca: 'interrogatius i relatius', ar: 'أدوات الاستفهام وأسماء الموصول' },
				exemple: 'qui, qué, ont, cossí, quant',
				unitat: 2,
				pages: '48-50'
			},
			{ id: 'conjoncions', tema: 'frasa', nom: { oc: 'Ligar doas idèas : las conjoncions', fr: 'Relier deux idées : les conjonctions', es: 'Unir dos ideas: las conjunciones', en: 'Linking two ideas: conjunctions', ca: 'Lligar dues idees: les conjuncions', ar: 'ربط فكرتين: أدوات العطف والربط' }, exemple: 'e, mas, o, ni ; puèi, perque, quand', unitat: 2, pages: '58-61' },
			{ id: 'nombres', tema: 'nom', nom: { oc: 'Los nombres', fr: 'Les nombres', es: 'Los números', en: 'Numbers', ca: 'Els nombres', ar: 'الأعداد' }, exemple: 'un, dos, tres, vint, cent', unitat: 3, pages: '54-55' },
			{ id: 'article-definit', tema: 'nom', nom: { oc: 'L’article definit', fr: 'L’article défini', es: 'El artículo definido', en: 'The definite article', ca: 'L’article definit', ar: 'أداة التعريف' }, exemple: 'lo, la, los, las ; al, del', unitat: 3, pages: '23-24' },
			{ id: 'possessius', tema: 'nom', nom: { oc: 'Los possessius', fr: 'Les possessifs', es: 'Los posesivos', en: 'Possessives', ca: 'Els possessius', ar: 'ضمائر الملكية' }, exemple: 'mon, ma, mos, mas ; nòstre, lor', unitat: 3, pages: '41-42' },
			{ id: 'article-indefinit', tema: 'nom', nom: { oc: 'L’article indefinit', fr: 'L’article indéfini', es: 'El artículo indefinido', en: 'The indefinite article', ca: 'L’article indefinit', ar: 'أداة التنكير' }, exemple: 'un, una ; de pan, d’amics', unitat: 3, pages: '25-26' },
			{ id: 'verb', tema: 'verb', nom: { oc: 'Lo vèrbe : infinitiu e grops', fr: 'Le verbe : infinitif et groupes', es: 'El verbo: infinitivo y grupos', en: 'The verb: infinitive and groups', ca: 'El verb: infinitiu i grups', ar: 'الفعل: المصدر والمجموعات' }, exemple: 'cantar, partir, prene', unitat: 4, pages: '63-66' },
			{
				id: 'alternanca',
				tema: 'verb',
				nom: { oc: 'Quand la vocala càmbia', fr: 'Quand la voyelle change', es: 'Cuando la vocal cambia', en: 'When the vowel changes', ca: 'Quan la vocal canvia', ar: 'عندما يتغير حرف العلة' },
				detalh: { oc: '*levar*, *lèvi*', fr: '*levar*, *lèvi*', es: '*levar*, *lèvi*', en: '*levar*, *lèvi*', ca: '*levar*, *lèvi*', ar: '*levar*, *lèvi*' },
				exemple: 'demòri, demoram',
				unitat: 4,
				pages: '86-93'
			},
			{ id: 'condicional', tema: 'verb', nom: { oc: 'Lo condicional de cortesiá', fr: 'Le conditionnel de politesse', es: 'El condicional de cortesía', en: 'The polite conditional', ca: 'El condicional de cortesia', ar: 'الشرط المهذب' }, exemple: 'volriái, poiriás', unitat: 5, pages: '73' },
			{
				id: 'indefinits',
				tema: 'pronoms',
				nom: { oc: 'Los indefinits', fr: 'Les indéfinis', es: 'Los indefinidos', en: 'Indefinites', ca: 'Els indefinits', ar: 'الضمائر غير المحددة' },
				detalh: { oc: 'qualqu’un, res, cada…', fr: 'quelqu’un, rien, chaque…', es: 'alguien, nada, cada…', en: 'someone, nothing, each…', ca: 'algú, res, cada…', ar: 'أحد ما، لا شيء، كل…' },
				exemple: 'quicòm, res, tot, cada',
				unitat: 5,
				pages: '51-53'
			},
			{ id: 'pronominal', tema: 'verb', nom: { oc: 'Los vèrbes pronominals', fr: 'Les verbes pronominaux', es: 'Los verbos pronominales', en: 'Pronominal verbs', ca: 'Els verbs pronominals', ar: 'الأفعال الانعكاسية' }, exemple: 'me lèvi, te lèvas, se lèva', unitat: 6, pages: '84' },
			{ id: 'placa-adjectiu', tema: 'nom', nom: { oc: 'La plaça de l’adjectiu', fr: 'La place de l’adjectif', es: 'El lugar del adjetivo', en: 'Where the adjective goes', ca: 'El lloc de l’adjectiu', ar: 'موضع الصفة' }, exemple: 'un ostal vièlh, una taula nòva', unitat: 7, pages: '40' },
			{ id: 'imperatiu', tema: 'verb', nom: { oc: 'L’imperatiu', fr: 'L’impératif', es: 'El imperativo', en: 'The imperative', ca: 'L’imperatiu', ar: 'الأمر' }, exemple: 'pren, vira, prenètz, viratz', unitat: 8, pages: '78-80' }
		]
	},
	{
		id: 'mai-luenh',
		titol: { oc: 'Per anar mai luènh', fr: 'Pour aller plus loin', es: 'Para ir más lejos', en: 'Going further', ca: 'Per anar més lluny', ar: 'للتوسع أكثر' },
		capitols: [
			{ id: 'demonstratius', tema: 'nom', nom: { oc: 'Los demonstratius', fr: 'Les démonstratifs', es: 'Los demostrativos', en: 'Demonstratives', ca: 'Els demostratius', ar: 'أسماء الإشارة' }, exemple: 'aqueste, aquel, aquò', pages: '46-47' },
			{ id: 'futur', tema: 'verb', nom: { oc: 'Lo futur', fr: 'Le futur', es: 'El futuro', en: 'The future', ca: 'El futur', ar: 'المستقبل' }, exemple: 'cantarai, partiràn', pages: '71-72' },
			{ id: 'tempses-compausats', tema: 'verb', nom: { oc: 'Lo passat compausat e los tempses compausats', fr: 'Le passé composé et les temps composés', es: 'El pasado compuesto y los tiempos compuestos', en: 'The compound past and compound tenses', ca: 'El passat compost i els temps compostos', ar: 'الماضي المركب والأزمنة المركبة' }, exemple: 'ai manjat, soi anat, soi estat', pages: '82-83' },
			{ id: 'acords', tema: 'nom', nom: { oc: 'Los acòrds', fr: 'Les accords', es: 'Las concordancias', en: 'Agreement', ca: 'Les concordances', ar: 'التطابق' }, exemple: 'Pèire e Maria son arribats', pages: '36-37' },
			{ id: 'imperfach', tema: 'verb', nom: { oc: 'L’imperfach', fr: 'L’imparfait', es: 'El imperfecto', en: 'The imperfect', ca: 'L’imperfet', ar: 'الماضي المستمر' }, exemple: 'cantavi, finissiái, èri', pages: '70-71' },
			{ id: 'preterit', tema: 'verb', nom: { oc: 'Lo preterit', fr: 'Le passé simple', es: 'El pretérito indefinido', en: 'The simple past', ca: 'El passat simple', ar: 'الماضي البسيط' }, exemple: 'cantèri, prenguèri, foguèt', pages: '69' },
			{ id: 'grases', tema: 'nom', nom: { oc: 'Comparar : mai, mens, lo mai', fr: 'Comparer : plus, moins, le plus', es: 'Comparar: más, menos, el más', en: 'Comparing: more, less, the most', ca: 'Comparar: més, menys, el més', ar: 'المقارنة: أكثر، أقل، الأكثر' }, exemple: 'mai… que, mens… que, melhor', pages: '38-39' },
			{ id: 'condicion', tema: 'frasa', nom: { oc: 'Exprimir una condicion', fr: 'Exprimer une condition', es: 'Expresar una condición', en: 'Expressing a condition', ca: 'Expressar una condició', ar: 'التعبير عن الشرط' }, exemple: 'Se plòu, demòri.', pages: '81' },
			{ id: 'subjonctiu', tema: 'verb', nom: { oc: 'Lo subjonctiu', fr: 'Le subjonctif', es: 'El subjuntivo', en: 'The subjunctive', ca: 'El subjuntiu', ar: 'الصيغة الاحتمالية' }, exemple: 'vòli que vengas, cal que partisca', pages: '74-78' },
			{
				id: 'formacion',
				tema: 'nom',
				nom: { oc: 'Cossí se fan los mots', fr: 'Comment se forment les mots', es: 'Cómo se forman las palabras', en: 'How words are formed', ca: 'Com es formen les paraules', ar: 'كيف تتكون الكلمات' },
				detalh: { oc: 'sufixes, diminutius', fr: 'suffixes, diminutifs', es: 'sufijos, diminutivos', en: 'suffixes, diminutives', ca: 'sufixos, diminutius', ar: 'اللواحق والتصغير' },
				exemple: 'ostalet, ostalàs, cantaire',
				pages: '27-32'
			},
			{ id: 'passiu', tema: 'verb', nom: { oc: 'La votz passiva', fr: 'La voix passive', es: 'La voz pasiva', en: 'The passive voice', ca: 'La veu passiva', ar: 'المبني للمجهول' }, exemple: 'Lo pan es fach pel fornièr.', pages: '85' },
			{ id: 'irregulars', tema: 'verb', nom: { oc: 'Los vèrbes irregulars', fr: 'Les verbes irréguliers', es: 'Los verbos irregulares', en: 'Irregular verbs', ca: 'Els verbs irregulars', ar: 'الأفعال الشاذة' }, exemple: 'anar, far, dire, veire', pages: '94-98' }
		]
	}
];
