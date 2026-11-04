// La grammaire dans les langues du site (Romain, 2026-11-04 : « quand on est
// sur l'option occitan, il faut que ce soit que de l'occitan… et quand on met
// français… l'interface avec le français et l'occitan, mais idem avec les
// autres langues »). Option 1 retenue le même jour : toute l'interface suit
// la langue choisie (sommaire, habillage des fiches) ; les explications à
// l'intérieur des fiches restent en français pour l'instant.
//
// Ici : le titre et le résumé de chaque fiche dans les autres langues (le
// titre occitan et le résumé français restent dans fichas/<id>.js), et les
// textes d'interface. Tout se lit par tria() : une langue manquante retombe
// sur l'occitan. Occitan vérifié avec lo Congrès, à relire par Romain ;
// espagnol, anglais, catalan et arabe : Aran.

/** titol : le titre de la fiche dans les langues autres que l'occitan et le
 *  français (bulle de survol) ; resumit : le résumé, l'occitan d'abord. */
export const FICHAS_LENGAS = {
	acords: {
		titol: { es: 'Las concordancias', en: 'Agreement', ca: 'Les concordances', ar: 'التطابق' },
		resumit: {
			oc: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.',
			es: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.',
			en: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.',
			ca: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.',
			ar: 'Tu e ieu parlam ; Pèire e Maria son arribats ; Arriban los amics.'
		}
	},
	adverbis: {
		titol: { es: 'Los adverbios', en: 'Adverbs', ca: 'Els adverbis', ar: 'الظروف' },
		resumit: {
			oc: 'Cossí, ont, quand : los mots que precisan lo vèrbe, e los en -ment.',
			es: 'Cómo, dónde, cuándo: las palabras que precisan el verbo, y las que acaban en -ment.',
			en: 'How, where, when: the words that add detail to the verb, and those ending in -ment.',
			ca: 'Com, on, quan: les paraules que precisen el verb, i les que acaben en -ment.',
			ar: 'كيف، أين، متى: الكلمات التي توضح الفعل، وتلك التي تنتهي بـ -ment.'
		}
	},
	alternanca: {
		titol: { es: 'Cuando la vocal cambia', en: 'When the vowel changes', ca: 'Quan la vocal canvia', ar: 'عندما يتغير حرف العلة' },
		resumit: {
			oc: 'Demòri mas demoram, lèvi mas levam : la vocala seguís la sillaba fòrta.',
			es: 'Demòri pero demoram, lèvi pero levam: la vocal sigue a la sílaba tónica.',
			en: 'Demòri but demoram, lèvi but levam: the vowel follows the stressed syllable.',
			ca: 'Demòri però demoram, lèvi però levam: la vocal segueix la síl·laba tònica.',
			ar: 'Demòri لكن demoram، وlèvi لكن levam: حرف العلة يتبع المقطع المنبور.'
		}
	},
	'article-definit': {
		titol: { es: 'El artículo definido', en: 'The definite article', ca: 'L’article definit', ar: 'أداة التعريف' },
		resumit: {
			oc: 'Lo, la, los, las ; l’ davant una vocala ; al, del, als, dels.',
			es: 'Lo, la, los, las; l’ ante una vocal; al, del, als, dels.',
			en: 'Lo, la, los, las; l’ before a vowel; al, del, als, dels.',
			ca: 'Lo, la, los, las; l’ davant d’una vocal; al, del, als, dels.',
			ar: 'Lo, la, los, las؛ وl’ قبل حرف علة؛ وal, del, als, dels.'
		}
	},
	'article-indefinit': {
		titol: { es: 'El artículo indefinido', en: 'The indefinite article', ca: 'L’article indefinit', ar: 'أداة التنكير' },
		resumit: {
			oc: 'Un, una ; de libres, de pan ; d’ davant una vocala.',
			es: 'Un, una; de libres, de pan; d’ ante una vocal.',
			en: 'Un, una; de libres, de pan; d’ before a vowel.',
			ca: 'Un, una; de libres, de pan; d’ davant d’una vocal.',
			ar: 'Un, una؛ وde libres, de pan؛ وd’ قبل حرف علة.'
		}
	},
	condicion: {
		titol: { es: 'Expresar una condición', en: 'Expressing a condition', ca: 'Expressar una condició', ar: 'التعبير عن الشرط' },
		resumit: {
			oc: 'Se plòu, demòri ; s’aviái de temps, legiriái. E a condicion que, seguit del subjonctiu.',
			es: 'Se plòu, demòri ; s’aviái de temps, legiriái. Y a condicion que, seguido del subjuntivo.',
			en: 'Se plòu, demòri ; s’aviái de temps, legiriái. And a condicion que, followed by the subjunctive.',
			ca: 'Se plòu, demòri ; s’aviái de temps, legiriái. I a condicion que, seguit del subjuntiu.',
			ar: 'Se plòu, demòri ; s’aviái de temps, legiriái. وكذلك a condicion que متبوعة بالصيغة الاحتمالية.'
		}
	},
	condicional: {
		titol: { es: 'El condicional', en: 'The conditional', ca: 'El condicional', ar: 'صيغة الشرط' },
		resumit: {
			oc: 'Volriái, poiriás : demandar amb cortesiá ; l’infinitiu mai -iái, -iás, -iá.',
			es: 'Volriái, poiriás: pedir con cortesía; el infinitivo más -iái, -iás, -iá.',
			en: 'Volriái, poiriás: asking politely; the infinitive plus -iái, -iás, -iá.',
			ca: 'Volriái, poiriás: demanar amb cortesia; l’infinitiu més -iái, -iás, -iá.',
			ar: 'Volriái, poiriás: للطلب بأدب؛ المصدر مع -iái و-iás و-iá.'
		}
	},
	conjoncions: {
		titol: { es: 'Las conjunciones', en: 'Conjunctions', ca: 'Les conjuncions', ar: 'أدوات الربط' },
		resumit: {
			oc: 'E, mas, o, ni per ligar ; puèi, perque, quand per encadenar.',
			es: 'E, mas, o, ni para unir; puèi, perque, quand para encadenar.',
			en: 'E, mas, o, ni to link; puèi, perque, quand to chain ideas together.',
			ca: 'E, mas, o, ni per lligar; puèi, perque, quand per encadenar.',
			ar: 'E, mas, o, ni للربط؛ وpuèi, perque, quand للتسلسل.'
		}
	},
	consonantas: {
		titol: { es: 'Las consonantes', en: 'Consonants', ca: 'Les consonants', ar: 'الحروف الساكنة' },
		resumit: {
			oc: 'v que sona « b », j e g « dj », ch « tch », s e z, lh, nh, r e rr, tz, cc, qu.',
			es: 'v que suena « b », j y g « dj », ch « tch », s y z, lh, nh, r y rr, tz, cc, qu.',
			en: 'v pronounced « b », j and g « dj », ch « tch », s and z, lh, nh, r and rr, tz, cc, qu.',
			ca: 'v que sona « b », j i g « dj », ch « tch », s i z, lh, nh, r i rr, tz, cc, qu.',
			ar: 'v تنطق « b »، وj وg « dj »، وch « tch »، وs وz، وlh، وnh، وr وrr، وtz، وcc، وqu.'
		}
	},
	demonstratius: {
		titol: { es: 'Los demostrativos', en: 'Demonstratives', ca: 'Els demostratius', ar: 'أسماء الإشارة' },
		resumit: {
			oc: 'Aqueste, aquel, aquò : mostrar çò qu’es prèp o mai luènh, e parlar d’una causa sens la nomenar.',
			es: 'Aqueste, aquel, aquò: señalar lo que está cerca o más lejos, y hablar de algo sin nombrarlo.',
			en: 'Aqueste, aquel, aquò: pointing out what is near or farther away, and talking about something without naming it.',
			ca: 'Aqueste, aquel, aquò: assenyalar el que és a prop o més lluny, i parlar d’una cosa sense nomenar-la.',
			ar: 'Aqueste, aquel, aquò: للإشارة إلى ما هو قريب أو بعيد، وللحديث عن شيء دون تسميته.'
		}
	},
	finalas: {
		titol: { es: 'El final de las palabras', en: 'Word endings', ca: 'El final de les paraules', ar: 'نهايات الكلمات' },
		resumit: {
			oc: 'Las letras finalas que se dison pas, las que sonan, las que càmbian, e las ligasons.',
			es: 'Las letras finales que no se pronuncian, las que suenan, las que cambian, y los enlaces entre palabras.',
			en: 'The final letters that stay silent, those that are pronounced, those that change, and the links between words.',
			ca: 'Les lletres finals que no es pronuncien, les que sonen, les que canvien, i els enllaços entre paraules.',
			ar: 'الحروف الأخيرة التي لا تنطق، والتي تنطق، والتي تتغير، والوصل بين الكلمات.'
		}
	},
	formacion: {
		titol: { es: 'Cómo se forman las palabras', en: 'How words are formed', ca: 'Com es formen les paraules', ar: 'كيف تتكون الكلمات' },
		resumit: {
			oc: 'Un sufixe càmbia lo sens : ostalet, ostalàs, cantaire, fornièr.',
			es: 'Un sufijo cambia el sentido: ostalet, ostalàs, cantaire, fornièr.',
			en: 'A suffix changes the meaning: ostalet, ostalàs, cantaire, fornièr.',
			ca: 'Un sufix canvia el sentit: ostalet, ostalàs, cantaire, fornièr.',
			ar: 'اللاحقة تغير المعنى: ostalet, ostalàs, cantaire, fornièr.'
		}
	},
	futur: {
		titol: { es: 'El futuro', en: 'The future', ca: 'El futur', ar: 'المستقبل' },
		resumit: {
			oc: 'L’infinitiu entièr, mai ai, às, à, em, etz, àn : cantarai, partiràn. E una ipotèsi probabla : seràn tres oras.',
			es: 'El infinitivo entero, más ai, às, à, em, etz, àn: cantarai, partiràn. Y lo que probablemente es verdad: seràn tres oras.',
			en: 'The whole infinitive, plus ai, às, à, em, etz, àn: cantarai, partiràn. And what is probably true: seràn tres oras.',
			ca: 'L’infinitiu sencer, més ai, às, à, em, etz, àn: cantarai, partiràn. I el que probablement és cert: seràn tres oras.',
			ar: 'المصدر كاملا، مع ai, às, à, em, etz, àn: cantarai, partiràn. وما هو صحيح على الأرجح: seràn tres oras.'
		}
	},
	grases: {
		titol: { es: 'Comparar: más, menos, el más', en: 'Comparing: more, less, the most', ca: 'Comparar: més, menys, el més', ar: 'المقارنة: أكثر، أقل، الأكثر' },
		resumit: {
			oc: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.',
			es: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.',
			en: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.',
			ca: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.',
			ar: 'Mai… que, mens… que, tan… coma ; lo mai, plan ; melhor, pièger, mendre.'
		}
	},
	grops: {
		titol: { es: 'Grupos de consonantes', en: 'Consonant clusters', ca: 'Grups de consonants', ar: 'تتابع الحروف الساكنة' },
		resumit: {
			oc: 'Doas consonantas a costat : al mièg del mot, la primièra se fond dins la segonda ; a la fin, sovent una sola s’ausís.',
			es: 'Dos consonantes juntas: en medio de la palabra, la primera se funde con la segunda; al final, a menudo solo se oye una.',
			en: 'Two consonants side by side: in the middle of a word, the first melts into the second; at the end, often only one is heard.',
			ca: 'Dues consonants juntes: al mig de la paraula, la primera es fon amb la segona; al final, sovint se sent només una.',
			ar: 'حرفان ساكنان متجاوران: في وسط الكلمة يذوب الأول في الثاني، وفي آخرها يسمع غالبا حرف واحد فقط.'
		}
	},
	imperatiu: {
		titol: { es: 'El imperativo', en: 'The imperative', ca: 'L’imperatiu', ar: 'الأمر' },
		resumit: {
			oc: 'Pren, vira, prenètz, viratz : balhar una indicacion ; e per defendre, non vires pas.',
			es: 'Pren, vira, prenètz, viratz: dar una indicación; y para prohibir, non vires pas.',
			en: 'Pren, vira, prenètz, viratz: giving an instruction; and for forbidding, non vires pas.',
			ca: 'Pren, vira, prenètz, viratz: donar una indicació; i per prohibir, non vires pas.',
			ar: 'Pren, vira, prenètz, viratz: لإعطاء توجيه؛ وللنهي: non vires pas.'
		}
	},
	imperfach: {
		titol: { es: 'El imperfecto', en: 'The imperfect', ca: 'L’imperfet', ar: 'الماضي المستمر' },
		resumit: {
			oc: 'Lo passat que dura : lo decòr, las costumas. Cantavi, finissiái, èri.',
			es: 'El pasado que dura: el escenario, las costumbres. Cantavi, finissiái, èri.',
			en: 'The past that lasts: the setting, the habits. Cantavi, finissiái, èri.',
			ca: 'El passat que dura: el decorat, els costums. Cantavi, finissiái, èri.',
			ar: 'الماضي الممتد: الخلفية والعادات. Cantavi, finissiái, èri.'
		}
	},
	indefinits: {
		titol: { es: 'Los indefinidos', en: 'Indefinites', ca: 'Els indefinits', ar: 'الضمائر غير المحددة' },
		resumit: {
			oc: 'Quicòm, res, tot, cada ; un pauc, fòrça, tròp ; e òm, se, dison.',
			es: 'Quicòm, res, tot, cada; un pauc, fòrça, tròp; y las maneras de decir «se» o «uno».',
			en: 'Quicòm, res, tot, cada; un pauc, fòrça, tròp; and the ways of saying “one” or “people”.',
			ca: 'Quicòm, res, tot, cada; un pauc, fòrça, tròp; i les maneres de dir «hom».',
			ar: 'Quicòm, res, tot, cada؛ وun pauc, fòrça, tròp؛ وطرق التعبير عن «المرء» أو «الناس» عموما.'
		}
	},
	infinitiu: {
		titol: { es: 'El infinitivo', en: 'The infinitive', ca: 'L’infinitiu', ar: 'المصدر' },
		resumit: {
			oc: 'Los tres grops de vèrbes, lo radical e la terminason, las marcas de la persona.',
			es: 'Los tres grupos de verbos, la raíz y la terminación, las marcas de persona.',
			en: 'The three verb groups, the stem and the ending, the person markers.',
			ca: 'Els tres grups de verbs, l’arrel i la terminació, les marques de persona.',
			ar: 'مجموعات الأفعال الثلاث، وجذع الفعل ونهايته، وعلامات الشخص.'
		}
	},
	irregulars: {
		titol: { es: 'Los verbos irregulares', en: 'Irregular verbs', ca: 'Els verbs irregulars', ar: 'الأفعال الشاذة' },
		resumit: {
			oc: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure : lors formas al present, e un biais per nosautres.',
			es: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure: sus formas en presente, y un truco para nosautres.',
			en: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure: their present-tense forms, and a trick for nosautres.',
			ca: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure: les seves formes en present, i un truc per a nosautres.',
			ar: 'Anar, far, dire, veire, poder, voler, saber, venir, prene, beure: صيغها في المضارع، وحيلة لصيغة nosautres.'
		}
	},
	negacion: {
		titol: { es: 'La negación', en: 'Negation', ca: 'La negació', ar: 'النفي' },
		resumit: {
			oc: 'Non davant lo vèrbe, pas aprèp ; e los autres mots que dison non.',
			es: 'Non antes del verbo, pas después; y las otras palabras que dicen no.',
			en: 'Non before the verb, pas after it; and the other words that say no.',
			ca: 'Non davant del verb, pas després; i les altres paraules que diuen no.',
			ar: 'Non قبل الفعل، وpas بعده؛ والكلمات الأخرى التي تفيد النفي.'
		}
	},
	'nom-adjectiu': {
		titol: { es: 'El sustantivo y el adjetivo', en: 'The noun and the adjective', ca: 'El nom i l’adjectiu', ar: 'الاسم والصفة' },
		resumit: {
			oc: 'Lo femenin en -a, lo plural en -s, e l’adjectiu que s’acòrda.',
			es: 'El femenino en -a, el plural en -s, y el adjetivo que concuerda.',
			en: 'The feminine in -a, the plural in -s, and the adjective that agrees.',
			ca: 'El femení en -a, el plural en -s, i l’adjectiu que concorda.',
			ar: 'المؤنث بإضافة -a، والجمع بإضافة -s، والصفة التي تتطابق مع الاسم.'
		}
	},
	nombres: {
		titol: { es: 'Los números', en: 'Numbers', ca: 'Els nombres', ar: 'الأعداد' },
		resumit: {
			oc: 'Comptar de zèro a cent, las desenas, e dire « primièr », « segond ».',
			es: 'Contar de cero a cien, las decenas, y decir «primero», «segundo».',
			en: 'Counting from zero to a hundred, the tens, and saying “first”, “second”.',
			ca: 'Comptar de zero a cent, les desenes, i dir «primer», «segon».',
			ar: 'العد من صفر إلى مئة، والعشرات، وقول «الأول» و«الثاني».'
		}
	},
	passiu: {
		titol: { es: 'La voz pasiva', en: 'The passive voice', ca: 'La veu passiva', ar: 'المبني للمجهول' },
		resumit: {
			oc: 'Lo pan es fach pel fornièr ; e mai sovent, una construccion amb se : aquí se vend de pan.',
			es: 'Lo pan es fach pel fornièr; y más a menudo, una construcción con se: aquí se vend de pan.',
			en: 'Lo pan es fach pel fornièr; and more often, a construction with se: aquí se vend de pan.',
			ca: 'Lo pan es fach pel fornièr; i més sovint, una construcció amb se: aquí se vend de pan.',
			ar: 'Lo pan es fach pel fornièr؛ والأكثر شيوعا تركيب بـ se: aquí se vend de pan.'
		}
	},
	'placa-adjectiu': {
		titol: { es: 'El lugar del adjetivo', en: 'Where the adjective goes', ca: 'El lloc de l’adjectiu', ar: 'موضع الصفة' },
		resumit: {
			oc: 'Aprèp lo nom de costuma, quitament per la talha e l’atge ; davant, lo sens càmbia.',
			es: 'Después del nombre, por lo general, incluso para el tamaño y la edad; delante, el sentido cambia.',
			en: 'After the noun as a rule, even for size and age; before it, the meaning changes.',
			ca: 'Després del nom, normalment, fins i tot per a la mida i l’edat; davant, el sentit canvia.',
			ar: 'بعد الاسم عادة، حتى للحجم والعمر؛ وإذا جاءت قبله تغير المعنى.'
		}
	},
	possessius: {
		titol: { es: 'Los posesivos', en: 'Possessives', ca: 'Els possessius', ar: 'ضمائر الملكية' },
		resumit: {
			oc: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.',
			es: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.',
			en: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.',
			ca: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.',
			ar: 'Mon, ma, mos, mas ; ton, ta ; son, sa ; nòstre, vòstre, lor.'
		}
	},
	preposicions: {
		titol: { es: 'Las preposiciones', en: 'Prepositions', ca: 'Les preposicions', ar: 'حروف الجر' },
		resumit: {
			oc: 'Los pichons mots que ligan : a, de, dins, amb, per, e lors formas al e del.',
			es: 'Las palabras pequeñas que unen: a, de, dins, amb, per, y sus formas al y del.',
			en: 'The little words that link: a, de, dins, amb, per, and their forms al and del.',
			ca: 'Les paraules petites que lliguen: a, de, dins, amb, per, i les seves formes al i del.',
			ar: 'الكلمات الصغيرة التي تربط: a, de, dins, amb, per، وصيغتاها al وdel.'
		}
	},
	present: {
		titol: { es: 'El presente', en: 'The present tense', ca: 'El present', ar: 'المضارع' },
		resumit: {
			oc: 'Çò que se passa ara o de costuma ; èsser, aver, e un vèrbe en -ar.',
			es: 'Lo que pasa ahora o de costumbre; èsser, aver, y un verbo en -ar.',
			en: 'What is happening now or usually; èsser, aver, and a verb in -ar.',
			ca: 'El que passa ara o de costum; èsser, aver, i un verb en -ar.',
			ar: 'ما يحدث الآن أو عادة؛ èsser وaver وفعل ينتهي بـ -ar.'
		}
	},
	preterit: {
		titol: { es: 'El pretérito indefinido', en: 'The simple past', ca: 'El passat simple', ar: 'الماضي البسيط' },
		resumit: {
			oc: 'Contar çò qu’arriba, del començament a la fin : cantèri, prenguèri, foguèt.',
			es: 'Contar lo que ocurre, de principio a fin: cantèri, prenguèri, foguèt.',
			en: 'Telling what happens, from start to finish: cantèri, prenguèri, foguèt.',
			ca: 'Explicar el que passa, del començament al final: cantèri, prenguèri, foguèt.',
			ar: 'سرد ما يحدث من البداية إلى النهاية: cantèri, prenguèri, foguèt.'
		}
	},
	pronominal: {
		titol: { es: 'Los verbos pronominales', en: 'Pronominal verbs', ca: 'Els verbs pronominals', ar: 'الأفعال الانعكاسية' },
		resumit: {
			oc: 'Me lèvi, te lèvas, se lèva : lo pichon pronom que repetís la persona.',
			es: 'Me lèvi, te lèvas, se lèva: el pequeño pronombre que repite la persona.',
			en: 'Me lèvi, te lèvas, se lèva: the little pronoun that repeats the person.',
			ca: 'Me lèvi, te lèvas, se lèva: el petit pronom que repeteix la persona.',
			ar: 'Me lèvi, te lèvas, se lèva: الضمير الصغير الذي يكرر الشخص.'
		}
	},
	'pronoms-personals': {
		titol: { es: 'Los pronombres personales', en: 'Personal pronouns', ca: 'Els pronoms personals', ar: 'الضمائر الشخصية' },
		resumit: {
			oc: 'Ieu, tu, el, ela… que se dison pauc ; me, te, se davant lo vèrbe ; vos per vosejar.',
			es: 'Ieu, tu, el, ela… que se dicen poco; me, te, se delante del verbo; vos para tratar de usted.',
			en: 'Ieu, tu, el, ela… which are rarely said; me, te, se before the verb; vos for the polite “you”.',
			ca: 'Ieu, tu, el, ela… que es diuen poc; me, te, se davant del verb; vos per tractar de vós.',
			ar: 'Ieu, tu, el, ela… التي نادرا ما تقال؛ وme, te, se قبل الفعل؛ وvos لمخاطبة الشخص بأدب.'
		}
	},
	questions: {
		titol: { es: 'Hacer una pregunta', en: 'Asking a question', ca: 'Fer una pregunta', ar: 'طرح سؤال' },
		resumit: {
			oc: 'Qui, qué, ont, cossí, quant, quina : los mots per demandar ; que e ont per ligar.',
			es: 'Qui, qué, ont, cossí, quant, quina: las palabras para preguntar; que y ont para unir.',
			en: 'Qui, qué, ont, cossí, quant, quina: the words for asking; que and ont for linking.',
			ca: 'Qui, qué, ont, cossí, quant, quina: les paraules per preguntar; que i ont per lligar.',
			ar: 'Qui, qué, ont, cossí, quant, quina: كلمات السؤال؛ وque وont للربط.'
		}
	},
	sons: {
		titol: { es: 'La sílaba tónica y el acento escrito', en: 'The stressed syllable and the written accent', ca: 'La síl·laba tònica i l’accent gràfic', ar: 'المقطع المنبور والعلامة المكتوبة' },
		resumit: {
			oc: 'La fin del mot ditz quina sillaba es fòrta ; l’accent escrich marca las excepcions.',
			es: 'El final de la palabra dice cuál es la sílaba tónica; el acento escrito señala las excepciones.',
			en: 'The end of the word tells you which syllable is stressed; the written accent marks the exceptions.',
			ca: 'El final de la paraula diu quina és la síl·laba tònica; l’accent gràfic marca les excepcions.',
			ar: 'نهاية الكلمة تدل على المقطع المنبور، والعلامة المكتوبة تشير إلى الاستثناءات.'
		}
	},
	subjonctiu: {
		titol: { es: 'El subjuntivo', en: 'The subjunctive', ca: 'El subjuntiu', ar: 'الصيغة الاحتمالية' },
		resumit: {
			oc: 'Çò qu’es pas encara real : vòli que vengas, cal que partisca. En -e pels vèrbes en -ar, en -a pels autres.',
			es: 'Lo que aún no es real: vòli que vengas, cal que partisca. En -e para los verbos en -ar, en -a para los demás.',
			en: 'What is not real yet: vòli que vengas, cal que partisca. In -e for verbs in -ar, in -a for the others.',
			ca: 'El que encara no és real: vòli que vengas, cal que partisca. En -e per als verbs en -ar, en -a per als altres.',
			ar: 'ما لم يتحقق بعد: vòli que vengas, cal que partisca. بـ -e مع الأفعال المنتهية بـ -ar، وبـ -a مع غيرها.'
		}
	},
	'tempses-compausats': {
		titol: { es: 'El pasado compuesto y los tiempos compuestos', en: 'The compound past and compound tenses', ca: 'El passat compost i els temps compostos', ar: 'الماضي المركب والأزمنة المركبة' },
		resumit: {
			oc: 'Aver o èsser, puèi lo participi : ai manjat, soi anat, soi estat.',
			es: 'Aver o èsser, y luego el participio: ai manjat, soi anat, soi estat.',
			en: 'Aver or èsser, then the participle: ai manjat, soi anat, soi estat.',
			ca: 'Aver o èsser, i després el participi: ai manjat, soi anat, soi estat.',
			ar: 'Aver أو èsser، ثم اسم المفعول: ai manjat, soi anat, soi estat.'
		}
	},
	vocalas: {
		titol: { es: 'Las vocales', en: 'Vowels', ca: 'Les vocals', ar: 'حروف العلة' },
		resumit: {
			oc: 'a, é, è, o, ò, u, e las vocalas que se fondon l’una dins l’autra : ai, au, èu, òu, uè.',
			es: 'a, é, è, o, ò, u, y las vocales que se deslizan una dentro de otra: ai, au, èu, òu, uè.',
			en: 'a, é, è, o, ò, u, and the vowels that glide into one another: ai, au, èu, òu, uè.',
			ca: 'a, é, è, o, ò, u, i les vocals que llisquen l’una dins de l’altra: ai, au, èu, òu, uè.',
			ar: 'a, é, è, o, ò, u، وحروف العلة التي تنزلق بعضها في بعض: ai, au, èu, òu, uè.'
		}
	}
};

/** Les textes d'interface du sommaire et des fiches. Ceux qui prennent un
 *  nombre ou un nom sont des fonctions, une par langue. */
export const IU = {
	frasa: {
		oc: 'La gramatica de l’occitan, nocion per nocion, dins l’òrdre ont la rescontras dins lo parcors. Cada ficha cita sas fonts. Las fichas arriban una per una.',
		fr: 'La grammaire de l’occitan, notion par notion, dans l’ordre où tu la rencontres dans le parcours. Chaque fiche cite ses sources. Les fiches arrivent une à une.',
		es: 'La gramática del occitano, noción por noción, en el orden en que la encuentras en el recorrido. Cada ficha cita sus fuentes. Las fichas van llegando una a una.',
		en: 'The grammar of Occitan, one notion at a time, in the order you meet it in the course. Each sheet cites its sources. The sheets are arriving one by one.',
		ca: 'La gramàtica de l’occità, noció per noció, en l’ordre en què la trobes al recorregut. Cada fitxa cita les seves fonts. Les fitxes van arribant una a una.',
		ar: 'قواعد اللغة الأوكسيتانية، مفهوما بعد مفهوم، بالترتيب الذي تصادفه في المسار. كل بطاقة تذكر مصادرها، وتصل البطاقات واحدة تلو الأخرى.'
	},
	descripcion: {
		oc: 'La gramatica de l’occitan, nocion per nocion, dins l’òrdre del parcors de Lo Ligam.',
		fr: 'La grammaire de l’occitan, notion par notion, dans l’ordre du parcours de Lo Ligam.',
		es: 'La gramática del occitano, noción por noción, en el orden del recorrido de Lo Ligam.',
		en: 'The grammar of Occitan, one notion at a time, in the order of the Lo Ligam course.',
		ca: 'La gramàtica de l’occità, noció per noció, en l’ordre del recorregut de Lo Ligam.',
		ar: 'قواعد اللغة الأوكسيتانية، مفهوما بعد مفهوم، بترتيب مسار Lo Ligam.'
	},
	triarTema: { oc: 'Causir un tèma', fr: 'Filtrer par thème', es: 'Filtrar por tema', en: 'Filter by theme', ca: 'Filtrar per tema', ar: 'التصفية حسب الموضوع' },
	totVeire: { oc: 'Tot veire', fr: 'Tout afficher', es: 'Mostrar todo', en: 'Show all', ca: 'Mostrar-ho tot', ar: 'عرض الكل' },
	estat: {
		oc: (nom, n) => `${nom} : ${n} ${n > 1 ? 'fichas' : 'ficha'}, dins l’òrdre del parcors.`,
		fr: (nom, n) => `${nom} : ${n} ${n > 1 ? 'fiches' : 'fiche'}, dans l’ordre du parcours.`,
		es: (nom, n) => `${nom}: ${n} ${n > 1 ? 'fichas' : 'ficha'}, en el orden del recorrido.`,
		en: (nom, n) => `${nom}: ${n} ${n > 1 ? 'sheets' : 'sheet'}, in course order.`,
		ca: (nom, n) => `${nom}: ${n} ${n > 1 ? 'fitxes' : 'fitxa'}, en l’ordre del recorregut.`,
		// arabe : 1 et 2 à part, 3 à 10 au pluriel, au-delà le singulier (reste de n modulo 100)
		ar: (nom, n) => {
			const r = n % 100;
			const cartes = n === 1 ? 'بطاقة واحدة' : n === 2 ? 'بطاقتان' : r >= 3 && r <= 10 ? `${n} بطاقات` : `${n} بطاقة`;
			return `${nom}: ${cartes}، بترتيب المسار.`;
		}
	},
	unitat: { oc: 'unitat', fr: 'unité', es: 'unidad', en: 'unit', ca: 'unitat', ar: 'الوحدة' },
	perExemple: { oc: 'Per exemple', fr: 'Par exemple', es: 'Por ejemplo', en: 'For example', ca: 'Per exemple', ar: 'على سبيل المثال' },
	// les fiches
	ontSoi: { oc: 'Ont soi', fr: 'Où je suis', es: 'Dónde estoy', en: 'Where I am', ca: 'On sóc', ar: 'أين أنا' },
	ecrans: { oc: 'Los ecrans de la ficha', fr: 'Écrans de la fiche', es: 'Pantallas de la ficha', en: 'Screens of the sheet', ca: 'Pantalles de la fitxa', ar: 'شاشات البطاقة' },
	ecranPrecedent: { oc: 'Ecran precedent', fr: 'Écran précédent', es: 'Pantalla anterior', en: 'Previous screen', ca: 'Pantalla anterior', ar: 'الشاشة السابقة' },
	ecranSeguent: { oc: 'Ecran seguent', fr: 'Écran suivant', es: 'Pantalla siguiente', en: 'Next screen', ca: 'Pantalla següent', ar: 'الشاشة التالية' },
	ecran: { oc: 'Ecran', fr: 'Écran', es: 'Pantalla', en: 'Screen', ca: 'Pantalla', ar: 'شاشة' },
	font: { oc: 'Font', fr: 'Source', es: 'Fuente', en: 'Source', ca: 'Font', ar: 'المصدر' },
	fonts: { oc: 'Fonts', fr: 'Sources', es: 'Fuentes', en: 'Sources', ca: 'Fonts', ar: 'المصادر' },
	// « page 65 », « pages 64 à 67 », « pages 11, 13 et 14 » : les mots
	// remplacés dans la langue choisie (les numéros restent)
	paginas: {
		oc: { page: 'pagina', pages: 'paginas', a: 'a', e: 'e' },
		fr: { page: 'page', pages: 'pages', a: 'à', e: 'et' },
		es: { page: 'página', pages: 'páginas', a: 'a', e: 'y' },
		en: { page: 'page', pages: 'pages', a: 'to', e: 'and' },
		ca: { page: 'pàgina', pages: 'pàgines', a: 'a', e: 'i' },
		// en arabe : la virgule arabe, et « و » collé au nombre qui suit (Aran)
		ar: { page: 'صفحة', pages: 'الصفحات', a: 'إلى', e: 'و', virgula: '، ', eColat: true }
	},
	res: { oc: 'res', fr: 'rien', es: 'nada', en: 'nothing', ca: 'res', ar: 'لا شيء' },
	// l'activité « chaque chose à sa place »
	verificar: { oc: 'Verificar', fr: 'Vérifier', es: 'Comprobar', en: 'Check', ca: 'Comprovar', ar: 'تحقق' },
	solucion: { oc: 'Solucion', fr: 'Solution', es: 'Solución', en: 'Solution', ca: 'Solució', ar: 'الحل' },
	recomencar: { oc: 'Recomençar', fr: 'Recommencer', es: 'Volver a empezar', en: 'Start over', ca: 'Tornar a començar', ar: 'البدء من جديد' },
	pasEncara: { oc: 'Pas encara :', fr: 'Pas encore :', es: 'Todavía no:', en: 'Not yet:', ca: 'Encara no:', ar: 'ليس بعد:' },
	totPausat: { oc: 'Tot es pausat.', fr: 'Tout est posé.', es: 'Todo está colocado.', en: 'Everything is placed.', ca: 'Tot està col·locat.', ar: 'تم وضع كل شيء.' },
	formasDePausar: { oc: 'Las formas de pausar', fr: 'Formes à placer', es: 'Formas por colocar', en: 'Forms to place', ca: 'Formes per col·locar', ar: 'الأشكال المراد وضعها' },
	veireResponsa: { oc: 'Veire la responsa', fr: 'Voir la réponse', es: 'Ver la respuesta', en: 'See the answer', ca: 'Veure la resposta', ar: 'عرض الإجابة' },
	veireResponsaPer: {
		oc: (x) => `Veire la responsa per ${x}`,
		fr: (x) => `Voir la réponse pour ${x}`,
		es: (x) => `Ver la respuesta de ${x}`,
		en: (x) => `See the answer for ${x}`,
		ca: (x) => `Veure la resposta de ${x}`,
		ar: (x) => `عرض إجابة ${x}`
	},
	pausarAici: {
		oc: (x) => `Pausar aicí, per ${x}`,
		fr: (x) => `Poser ici, pour ${x}`,
		es: (x) => `Colocar aquí, para ${x}`,
		en: (x) => `Place here, for ${x}`,
		ca: (x) => `Col·locar aquí, per a ${x}`,
		ar: (x) => `وضع هنا من أجل ${x}`
	},
	just: { oc: 'just', fr: 'juste', es: 'correcto', en: 'correct', ca: 'correcte', ar: 'صحيح' },
	pasEncaraCurt: { oc: 'pas encara', fr: 'pas encore', es: 'todavía no', en: 'not yet', ca: 'encara no', ar: 'ليس بعد' },
	tocarPerLevar: { oc: 'tocar per levar', fr: 'toucher pour retirer', es: 'toca para quitar', en: 'tap to remove', ca: 'toca per treure', ar: 'المس للإزالة' },
	vaquiSolucion: {
		oc: 'Vaquí la solucion. Recomença quand vòls, sens l’uèlh.',
		fr: 'Voici la solution. Recommence quand tu veux, sans l’œil.',
		es: 'Aquí tienes la solución. Vuelve a empezar cuando quieras, sin el ojo.',
		en: 'Here is the solution. Start over whenever you like, without the eye.',
		ca: 'Aquí tens la solució. Torna a començar quan vulguis, sense l’ull.',
		ar: 'هذا هو الحل. يمكنك البدء من جديد متى شئت، دون الاستعانة بأيقونة العين.'
	},
	totJust: {
		oc: (n) => `Tot es just : ${n} sus ${n}.`,
		fr: (n) => `Tout juste : ${n} sur ${n}.`,
		es: (n) => `Todo correcto: ${n} de ${n}.`,
		en: (n) => `All correct: ${n} out of ${n}.`,
		ca: (n) => `Tot correcte: ${n} de ${n}.`,
		ar: (n) => `الكل صحيح: ${n} من ${n}.`
	},
	trobadas: {
		oc: (j, n, v) =>
			`${j} sus ${n} trobadas sens ajuda${v ? `, ${v} amb l’uèlh` : ''}. Jos cada linha pas encara justa, un indici.`,
		fr: (j, n, v) =>
			`${j} sur ${n} trouvées sans aide${v ? `, ${v} avec l’œil` : ''}. Sous chaque ligne pas encore juste, un indice.`,
		es: (j, n, v) =>
			`${j} de ${n} encontradas sin ayuda${v ? `, ${v} con el ojo` : ''}. Bajo cada línea que aún no es correcta, una pista.`,
		en: (j, n, v) =>
			`${j} of ${n} found without help${v ? `, ${v} with the eye` : ''}. Under each line that is not right yet, a hint.`,
		ca: (j, n, v) =>
			`${j} de ${n} trobades sense ajuda${v ? `, ${v} amb l’ull` : ''}. Sota cada línia que encara no és correcta, una pista.`,
		ar: (j, n, v) =>
			`تم إيجاد ${j} من ${n} دون مساعدة${v ? `، منها ${v} بمساعدة العين` : ''}. تحت كل سطر لم يصح بعد، تلميح.`
	}
};

/** « pages 64 à 67 » dans la langue choisie : seuls les mots changent */
export function paginas(s, mots) {
	if (!s || !mots) return s;
	return s
		.replace(/^pages\b/, mots.pages)
		.replace(/^page\b/, mots.page)
		.replace(/ à /g, ` ${mots.a} `)
		.replace(/, /g, mots.virgula ?? ', ')
		.replace(/ et /g, mots.eColat ? ` ${mots.e}` : ` ${mots.e} `);
}
