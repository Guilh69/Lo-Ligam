// Catalogue des jaces de donadas de la carta (2026-10-07). Lo fons de basa
// es « Contorns » : la còsta sola, en traç fin (demanda de Romain) ; tot lo
// rèsta es de jaces rengadas per familha. Las jaces valon per totes los fonses,
// levat las marcadas fons: 'estelas' (vilas, noms, rius, relèu), pintadas pel
// fons Contorns sol.
//
// Aquel catalògue es la basa : la carta lo mòstra quitament se Supabase
// respond pas (projècte gratuit en pausa). La taula carta_colas (gerida dins
// /admin/carta) pòt pasmens cambiar los libellats, las nòtas e la
// disponibilitat d'una jaça del meteis id, e apondre de jaces novèlas.
//
// estat : 'disponible' (donadas dins static/data), 'basa' (donadas dins
// Supabase), 'a venir' (afichada mas desactivada, amb sa nòta).
// Libellats occitans de validar per Romain.

export const CATALOGUE = [
	{
		id: 'lenga',
		// « Lenga nòstra » (causida de Romain, 2026-10-09 ; nòstra : lo Basic de lo Congrès)
		oc: 'Lenga nòstra',
		fr: 'Lenga nòstra', // (un subrenom : demòra en occitan dins l'interfàcia francesa)
		jaces: [
			{
				// lo domeni occitan, cochat d'ofici, visible de 200 km fins al pus
				// prèp (demanda de Romain, 2026-10-09 ; nom occitan de validar)
				id: 'frontiera',
				oc: 'Domeni occitan',
				fr: 'Domaine occitan', es: 'Dominio occitano', en: 'Occitan domain', ca: 'Domini occità', ar: 'المجال الأوكسيتاني',
				estat: 'disponible',
				defaut: true
			},
			{ id: 'dialectes', oc: 'Dialèctes', fr: 'Dialectes', es: 'Dialectos', en: 'Dialects', ca: 'Dialectes', ar: 'اللهجات', estat: 'disponible', defaut: false, nota_oc: "Se'n pòt causir mantun, lo Creissent tanben", nota_fr: 'On peut en choisir plusieurs, le Croissant aussi', nota_es: 'Se pueden elegir varios, el Croissant también', nota_en: 'You can choose several, the Croissant too', nota_ca: 'Se’n poden triar diversos, el Croissant també', nota_ar: 'يمكن اختيار أكثر من لهجة، وكذلك Croissant' },
			// l'occitan unificat a totas las escalas, coma de luènh (retorn de Romain, 2026-10-08) ;
			// la carta arriba sus el sol, los dialèctes e lo relèu a la demanda (Romain, 2026-10-23)
			{ id: 'unificat', oc: 'Occitan unificat', fr: 'Occitan unifié', es: 'Occitano unificado', en: 'Unified Occitan', ca: 'Occità unificat', ar: 'الأوكسيتانية الموحّدة', estat: 'disponible', defaut: true, nota_oc: 'La lenga sola, sens los dialèctes, a totas las escalas', nota_fr: 'La langue seule, sans les dialectes, à toutes les échelles', nota_es: 'La lengua sola, sin los dialectos, a todas las escalas', nota_en: 'The language alone, without the dialects, at every scale', nota_ca: 'La llengua sola, sense els dialectes, a totes les escales', nota_ar: 'اللغة وحدها دون لهجاتها، في كل مستويات التكبير' },
			// la lecture « Uèi » (Romain, 2026-10-22) : la part de locuteurs par
			// département, enquête OPLO 2020 (locutors.js) ; rien là où aucune
			// enquête n'existe (Romain, 2026-10-23). Occitan vérifié par l'API.
			{
				id: 'locutors',
				oc: 'Locutors (2020)',
				fr: 'Locuteurs (2020)', es: 'Hablantes (2020)', en: 'Speakers (2020)', ca: 'Parlants (2020)', ar: 'المتحدّثون (2020)',
				estat: 'disponible',
				defaut: false,
				nota_oc: 'Part dels 15 ans e mai que parlan occitan, per departament (OPLO)',
				nota_fr: 'Part des 15 ans et plus qui parlent occitan, par département (OPLO)', nota_es: 'Parte de la población de 15 años o más que habla occitano, por departamento (OPLO)', nota_en: 'Share of people aged 15 or over who speak Occitan, by department (OPLO)', nota_ca: 'Part de la població de 15 anys o més que parla occità, per departament (OPLO)', nota_ar: 'نسبة من بلغوا 15 عامًا فأكثر ممّن يتحدّثون الأوكسيتانية، حسب المقاطعة (OPLO)'
			},
			{
				id: 'toponimia',
				oc: 'Noms occitans de las vilas',
				fr: 'Noms occitans des villes', es: 'Nombres occitanos de las ciudades', en: 'Occitan names of towns', ca: 'Noms occitans de les ciutats', ar: 'الأسماء الأوكسيتانية للمدن',
				estat: 'disponible',
				defaut: true,
				fons: 'estelas'
			},
			// Lo Creissent (traçat nòstre d'aprèp Tourtoulon e Bringuier 1876 e Ronjat
			// 1930) es pas pus una jaça a despart : es una pastilha dels dialèctes,
			// causissabla coma eles (retorn de Romain : « un seul endroit »)
			{
				id: 'limsi',
				// « les voix d'Occitanie » (Romain, 2026-10-22) : los testimònis de la lenga
				// parlada dins sa diversitat ; la font (Atlàs sonòr, LISN) demòra dins la nòta
				oc: 'Las votz d’Occitània',
				fr: 'Les voix d’Occitanie', es: 'Las voces de Occitania', en: 'The voices of Occitania', ca: 'Les veus d’Occitània', ar: 'أصوات أوكسيتانيا',
				// demostracion per lo LISN (decision de Romain, 2026-10-12 : en linha,
				// lo site es pas encara dobèrt al public) ; donadas de
				// SIG/cadena/lisn-enquistas.mjs
				estat: 'disponible',
				defaut: false,
				nota_oc: 'Demostracion (Atlàs sonòr, LISN) : una faula, mantun parlar',
				nota_fr: 'Démonstration (Atlas sonore, LISN) : une fable, plusieurs parlers', nota_es: 'Demostración (Atlas sonore, LISN): una fábula, varias hablas', nota_en: 'Demonstration (Atlas sonore, LISN): one fable, several local varieties', nota_ca: 'Demostració (Atlas sonore, LISN): una faula, diversos parlars', nota_ar: 'عرض تجريبي (Atlas sonore، LISN): حكاية واحدة بعدة لهجات محلية'
			}
		]
	},
	{
		id: 'administracion',
		// « Territòri » (decision de Romain, 2026-10-10) : « Administracion »
		// desbordava del rail ; l'id demòra lo meteis
		oc: 'Territòri',
		fr: 'Territoire', es: 'Territorio', en: 'Territory', ca: 'Territori', ar: 'الإقليم',
		jaces: [
			{ id: 'vilas', oc: 'Vilas e vilatges', fr: 'Villes et villages', es: 'Ciudades y pueblos', en: 'Towns and villages', ca: 'Ciutats i pobles', ar: 'مدن وقرى', estat: 'disponible', defaut: true, fons: 'estelas' },
			{ id: 'regions', oc: 'Regions', fr: 'Régions', es: 'Regiones', en: 'Regions', ca: 'Regions', ar: 'المناطق', estat: 'disponible', defaut: false },
			{ id: 'despartaments', oc: 'Despartaments', fr: 'Départements', es: 'Departamentos', en: 'Departments', ca: 'Departaments', ar: 'المقاطعات', estat: 'disponible', defaut: false },
			{ id: 'comunas', oc: 'Comunas', fr: 'Communes', es: 'Municipios', en: 'Communes', ca: 'Municipis', ar: 'البلديات', estat: 'disponible', defaut: false } // (pas pus de nòta : l'escala s'aficha quand cal, Romain 2026-10-10)
		]
	},
	{
		id: 'cultura',
		oc: 'Cultura',
		fr: 'Culture', es: 'Cultura', en: 'Culture', ca: 'Cultura', ar: 'الثقافة',
		jaces: [
			{ id: 'lieusInteres', oc: "Luòcs d'interès", fr: "Lieux d'intérêt", es: 'Lugares de interés', en: 'Places of interest', ca: 'Llocs d’interès', ar: 'أماكن ذات أهمية', estat: 'basa', defaut: false },
			{ id: 'librarias', oc: 'Librariás', fr: 'Librairies', es: 'Librerías', en: 'Bookshops', ca: 'Llibreries', ar: 'مكتبات بيع الكتب', estat: 'basa', defaut: false },
			// cercles, ostals, IEO, escolo, Parlaren ; e las associacions de
			// cultura occitana (decision de Romain, 2026-10-23, SIG/cercles)
			{ id: 'cercles', oc: 'Cercles e associacions', fr: 'Cercles et associations', es: 'Círculos y asociaciones', en: 'Circles and associations', ca: 'Cercles i associacions', ar: 'نوادٍ وجمعيات', estat: 'disponible', defaut: false, icona: 'messages', color: 'aur-clar', nota_oc: 'Ponch plen : activitat provada ; vuèg : declarada recentament', nota_fr: 'Point plein : activité prouvée ; vide : déclarée récemment', nota_es: 'Punto lleno: actividad comprobada; vacío: declarada recientemente', nota_en: 'Filled dot: proven activity; empty: recently declared', nota_ca: 'Punt ple: activitat comprovada; buit: declarada recentment', nota_ar: 'النقطة المملوءة: نشاط مؤكَّد؛ الفارغة: نشاط أُعلن عنه حديثًا' },
			{ id: 'culturaOc', oc: 'Associacions culturalas', fr: 'Associations culturelles', es: 'Asociaciones culturales', en: 'Cultural associations', ca: 'Associacions culturals', ar: 'جمعيات ثقافية', estat: 'disponible', defaut: false, icona: 'music', color: 'terra-viu', nota_oc: 'Ponch plen : activitat provada ; vuèg : declarada recentament', nota_fr: 'Point plein : activité prouvée ; vide : déclarée récemment', nota_es: 'Punto lleno: actividad comprobada; vacío: declarada recientemente', nota_en: 'Filled dot: proven activity; empty: recently declared', nota_ca: 'Punt ple: activitat comprovada; buit: declarada recentment', nota_ar: 'النقطة المملوءة: نشاط مؤكَّد؛ الفارغة: نشاط أُعلن عنه حديثًا' },
			{ id: 'festas', oc: 'Fèstas e eveniments', fr: 'Fêtes et événements', es: 'Fiestas y eventos', en: 'Festivals and events', ca: 'Festes i esdeveniments', ar: 'مهرجانات وفعاليات', estat: 'a venir' }
		]
	},
	{
		// L'ensenhament (demanda de Romain, 2026-10-23 : « un gros chapeau
		// enseignement, avec une distinction Calandreta et le reste, sachant que
		// c'est pas le même statut ») : l'immersion d'abord, puèi l'escòla
		// publica, del bilingüisme a la sensibilizacion, collègis e licèus, lo
		// superior, e los corses per adults. Donadas : SIG/ensenhament ; los
		// corses, las associacions de SIG/cercles que ne donan
		id: 'ensenhament',
		// (un caractèr invisible, ­ : sus telefòn, lo mot se copa en doas
		// linhas coma « Lenga nòstra », en luòc de desbordar sus « Istòria »)
		oc: 'Ensenha­ment',
		fr: 'Enseigne­ment', es: 'Enseñanza', en: 'Education', ca: 'Ensenya­ment', ar: 'التعليم',
		jaces: [
			{ id: 'calandretas', oc: 'Calandretas', fr: 'Calandretas', estat: 'disponible', defaut: false, icona: 'school', color: 'ens-cal', grop_oc: 'Immersion', grop_fr: 'Immersion', grop_es: 'Inmersión', grop_en: 'Immersion', grop_ca: 'Immersió', grop_ar: 'الانغماس اللغوي', nota_oc: "Tot en occitan, dins d'escòlas d'associacions", nota_fr: 'Tout en occitan, dans des écoles associatives', nota_es: 'Todo en occitano, en escuelas asociativas', nota_en: 'All in Occitan, in community-run schools', nota_ca: 'Tot en occità, en escoles associatives', nota_ar: 'كل شيء بالأوكسيتانية، في مدارس تديرها جمعيات' },
			{ id: 'ensBilingue', oc: 'Escòlas bilingüas', fr: 'Écoles bilingues', es: 'Escuelas bilingües', en: 'Bilingual schools', ca: 'Escoles bilingües', ar: 'مدارس ثنائية اللغة', estat: 'disponible', defaut: false, icona: 'circles-relation', color: 'ens-bil', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', grop_es: 'Enseñanza pública', grop_en: 'Public education', grop_ca: 'Ensenyament públic', grop_ar: 'التعليم العمومي', nota_oc: 'Mitat del temps en occitan', nota_fr: 'La moitié du temps en occitan', nota_es: 'La mitad del tiempo en occitano', nota_en: 'Half the time in Occitan', nota_ca: 'La meitat del temps en occità', nota_ar: 'نصف الوقت بالأوكسيتانية' },
			{ id: 'ensEscola', oc: "L'occitan a l'escòla", fr: "L'occitan à l'école", es: 'El occitano en la escuela', en: 'Occitan at school', ca: 'L’occità a l’escola', ar: 'الأوكسيتانية في المدرسة', estat: 'disponible', defaut: false, icona: 'abc', color: 'ens-esc', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', grop_es: 'Enseñanza pública', grop_en: 'Public education', grop_ca: 'Ensenyament públic', grop_ar: 'التعليم العمومي', nota_oc: 'Tres oras per setmana, o una iniciacion', nota_fr: 'Trois heures par semaine, ou une initiation', nota_es: 'Tres horas por semana, o una iniciación', nota_en: 'Three hours a week, or an introduction', nota_ca: 'Tres hores per setmana, o una iniciació', nota_ar: 'ثلاث ساعات أسبوعيًا، أو حصص تعريفية' },
			{ id: 'ensSegond', oc: 'Collègis e licèus', fr: 'Collèges et lycées', es: 'Institutos de secundaria', en: 'Secondary schools', ca: 'Instituts de secundària', ar: 'الإعداديات والثانويات', estat: 'disponible', defaut: false, icona: 'notebook', color: 'ens-seg', grop_oc: 'Ensenhament public', grop_fr: 'Enseignement public', grop_es: 'Enseñanza pública', grop_en: 'Public education', grop_ca: 'Ensenyament públic', grop_ar: 'التعليم العمومي', nota_oc: 'Opcion, seccion bilingüa o especialitat', nota_fr: 'Option, section bilingue ou spécialité', nota_es: 'Optativa, sección bilingüe o especialidad', nota_en: 'Option, bilingual stream or specialism', nota_ca: 'Optativa, secció bilingüe o especialitat', nota_ar: 'مادة اختيارية أو قسم ثنائي اللغة أو تخصص' },
			{ id: 'ensSuperior', oc: 'Universitats e formacion', fr: 'Universités et formation', es: 'Universidades y formación', en: 'Universities and training', ca: 'Universitats i formació', ar: 'الجامعات والتكوين', estat: 'disponible', defaut: false, icona: 'certificate', color: 'ens-sup', grop_oc: 'Superior e adults', grop_fr: 'Supérieur et adultes', grop_es: 'Enseñanza superior y adultos', grop_en: 'Higher education and adults', grop_ca: 'Ensenyament superior i adults', grop_ar: 'التعليم العالي وتعليم الكبار', nota_oc: 'Licéncias, diplòmas, formacion dels ensenhaires', nota_fr: 'Licences, diplômes, formation des enseignants', nota_es: 'Grados, diplomas, formación del profesorado', nota_en: 'Degrees, diplomas, teacher training', nota_ca: 'Graus, diplomes, formació del professorat', nota_ar: 'الإجازات والدبلومات وتكوين المدرّسين' },
			{ id: 'corsAdults', oc: 'Corses per adults', fr: 'Cours pour adultes', es: 'Clases para adultos', en: 'Courses for adults', ca: 'Classes per a adults', ar: 'دروس للكبار', estat: 'disponible', defaut: false, icona: 'users-group', color: 'ens-adu', grop_oc: 'Superior e adults', grop_fr: 'Supérieur et adultes', grop_es: 'Enseñanza superior y adultos', grop_en: 'Higher education and adults', grop_ca: 'Ensenyament superior i adults', grop_ar: 'التعليم العالي وتعليم الكبار', nota_oc: 'Associacions que donan de corses', nota_fr: 'Associations qui donnent des cours', nota_es: 'Asociaciones que dan clases', nota_en: 'Associations that run courses', nota_ca: 'Associacions que fan classes', nota_ar: 'جمعيات تقدّم دروسًا' }
		]
	},
	{
		id: 'istoria',
		oc: 'Istòria',
		fr: 'Histoire', es: 'Historia', en: 'History', ca: 'Història', ar: 'التاريخ',
		jaces: [
			{ id: 'provincias', oc: 'Provincias istoricas', fr: 'Provinces historiques', es: 'Provincias históricas', en: 'Historical provinces', ca: 'Províncies històriques', ar: 'الأقاليم التاريخية', estat: 'disponible', defaut: false, nota_oc: 'En 1789 : governaments e provincias', nota_fr: 'En 1789 : gouvernements et provinces', nota_es: 'En 1789: gobiernos y provincias', nota_en: 'In 1789: governments and provinces', nota_ca: 'El 1789: governs i províncies', nota_ar: 'عام 1789: الحكومات والأقاليم' },
			{ id: 'paises', oc: 'Païses tradicionals', fr: 'Pays traditionnels', es: 'Comarcas tradicionales', en: 'Traditional regions', ca: 'Comarques tradicionals', ar: 'المناطق التقليدية', estat: 'a venir' },
			{ id: 'isolas', oc: 'Illòts lingüistics', fr: 'Îlots linguistiques', es: 'Islotes lingüísticos', en: 'Language islands', ca: 'Illots lingüístics', ar: 'جزر لغوية', estat: 'a venir' }
		]
	},
	{
		id: 'natura',
		oc: 'Natura',
		fr: 'Nature', es: 'Naturaleza', en: 'Nature', ca: 'Natura', ar: 'الطبيعة',
		jaces: [
			{ id: 'rius', oc: 'Rius', fr: 'Rivières', es: 'Ríos', en: 'Rivers', ca: 'Rius', ar: 'الأنهار', estat: 'disponible', defaut: false, fons: 'estelas' },
			{ id: 'nomsRius', oc: 'Noms dels rius', fr: 'Noms des rivières', es: 'Nombres de los ríos', en: 'Names of rivers', ca: 'Noms dels rius', ar: 'أسماء الأنهار', estat: 'disponible', defaut: false, fons: 'estelas' },
			{ id: 'corbas', oc: 'Relèu', fr: 'Relief', es: 'Relieve', en: 'Relief', ca: 'Relleu', ar: 'التضاريس', estat: 'disponible', defaut: false, fons: 'estelas', nota_oc: 'Corbas de nivèl', nota_fr: 'Courbes de niveau', nota_es: 'Curvas de nivel', nota_en: 'Contour lines', nota_ca: 'Corbes de nivell', nota_ar: 'خطوط الكنتور' },
			{ id: 'parcs', oc: 'Parcs naturals', fr: 'Parcs naturels', es: 'Parques naturales', en: 'Nature parks', ca: 'Parcs naturals', ar: 'المتنزهات الطبيعية', estat: 'disponible', defaut: false, nota_oc: 'Regionals, nacionals e marins', nota_fr: 'Régionaux, nationaux et marins', nota_es: 'Regionales, nacionales y marinos', nota_en: 'Regional, national and marine', nota_ca: 'Regionals, nacionals i marins', nota_ar: 'إقليمية ووطنية وبحرية' },
			{ id: 'massis', oc: 'Massís e montanhas', fr: 'Massifs et montagnes', es: 'Macizos y montañas', en: 'Massifs and mountains', ca: 'Massissos i muntanyes', ar: 'الكتل الجبلية والجبال', estat: 'disponible', defaut: false, nota_oc: 'Noms dels massís e de las cimas', nota_fr: 'Noms des massifs et des sommets', nota_es: 'Nombres de los macizos y de las cimas', nota_en: 'Names of massifs and summits', nota_ca: 'Noms dels massissos i dels cims', nota_ar: 'أسماء الكتل الجبلية والقمم' },
			{ id: 'bacins', oc: 'Bacins dels rius', fr: 'Bassins des rivières', es: 'Cuencas de los ríos', en: 'River basins', ca: 'Conques dels rius', ar: 'أحواض الأنهار', estat: 'a venir' }
		]
	}
];

// Las autras lengas de França (demanda de Romain, 2026-10-08) ; lors nòtas parlan
// d'en primièr de la part francesa (Romain, 2026-10-10) : una familha a
// despart, per las far descobrir e far de ponts ; mens provesida que l'occitan
// (una etiqueta per lenga e una ficha corta), de completar
CATALOGUE.push({
	id: 'lengas',
	oc: 'Autras lengas',
	fr: 'Autres langues', es: 'Otras lenguas', en: 'Other languages', ca: 'Altres llengües', ar: 'لغات أخرى',
	jaces: [
		{
			id: 'lengasFranca',
			oc: 'Lengas de França',
			fr: 'Langues de France', es: 'Lenguas de Francia', en: 'Languages of France', ca: 'Llengües de França', ar: 'لغات فرنسا',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Catalan, basc, breton, arpitan, alsacian, còrs, lengas d’oïl, d’outra mar…',
			nota_fr: 'Catalan, basque, breton, arpitan, alsacien, corse, langues d’oïl, d’outre-mer…', nota_es: 'Catalán, vasco, bretón, arpitano, alsaciano, corso, lenguas de oïl, de ultramar…', nota_en: 'Catalan, Basque, Breton, Arpitan, Alsatian, Corsican, langues d’oïl, overseas languages…', nota_ca: 'Català, basc, bretó, arpità, alsacià, cors, llengües d’oïl, d’ultramar…', nota_ar: 'الكتالانية، الباسكية، البريتونية، الأربيتانية، الألزاسية، الكورسيكية، لغات الأويل، لغات ما وراء البحار…'
		},
		// Cada lenga, alucada coma l'occitan, amb sos dialèctes (retorn de
		// Romain, 2026-10-08 : « un menu qui liste les langues de France ») ; lo
		// catalan d'en primièr, las autras quand lor perimètre serà traçat
		{
			id: 'catalan',
			oc: 'Catalan',
			fr: 'Catalan',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, la Catalonha del Nòrd, de Salses a Perpinyà ; se perlonga en Espanha, en Andòrra e fins a l’Alguer',
			nota_fr: 'En France, la Catalogne nord, de Salses à Perpignan ; il se prolonge en Espagne, en Andorre et jusqu’à Alghero', nota_es: 'En Francia, la Cataluña Norte, de Salses a Perpinyà; se prolonga por España, Andorra y hasta Alguer', nota_en: 'In France, Northern Catalonia, from Salses to Perpinyà; it continues into Spain, Andorra and as far as Alguer', nota_ca: 'A França, la Catalunya del Nord, de Salses a Perpinyà; es perllonga per Espanya, Andorra i fins a l’Alguer', nota_ar: 'في فرنسا، كتالونيا الشمالية، من Salses إلى Perpinyà؛ وتمتد إلى إسبانيا وأندورا وحتى Alguer'
		},
		{
			id: 'arpitan',
			oc: 'Arpitan',
			fr: 'Arpitan (francoprovençal)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, de Liyon a Chambèri ; se perlonga en Soïssa romanda (Nôchâtél) e dins la val d’Aoûta',
			nota_fr: 'En France, de Lyon à Chambéry ; il se prolonge en Suisse romande (Neuchâtel) et dans le Val d’Aoste', nota_es: 'En Francia, de Liyon a Chambèri; se prolonga por la Suiza romanda (Nôchâtél) y el Valle de Aosta', nota_en: 'In France, from Liyon to Chambèri; it continues into French-speaking Switzerland (Nôchâtél) and the Aosta Valley', nota_ca: 'A França, de Liyon a Chambèri; es perllonga per la Suïssa romanda (Nôchâtél) i la Vall d’Aosta', nota_ar: 'في فرنسا، من Liyon إلى Chambèri؛ وتمتد إلى سويسرا الناطقة بالفرنسية (Nôchâtél) ووادي أوستا'
		},
		{
			id: 'basc',
			oc: 'Basc',
			fr: 'Basque',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, Iparralde, de Baiona a Maule ; se perlonga en Espanha, de Bilbo a Iruña',
			nota_fr: 'En France, le Pays basque nord, de Bayonne à Mauléon ; il se prolonge en Espagne, de Bilbao à Pampelune', nota_es: 'En Francia, el País Vasco francés, de Baiona a Maule; se prolonga por España, de Bilbo a Iruña', nota_en: 'In France, the northern Basque Country, from Baiona to Maule; it continues into Spain, from Bilbo to Iruña', nota_ca: 'A França, el País Basc del Nord, de Baiona a Maule; es perllonga per Espanya, de Bilbo a Iruña', nota_ar: 'في فرنسا، بلاد الباسك الشمالية، من Baiona إلى Maule؛ وتمتد إلى إسبانيا، من Bilbo إلى Iruña'
		},
		{
			id: 'breton',
			oc: 'Breton',
			fr: 'Breton',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Sos quatre dialèctes, de Leon a Gwened, dins sa limit de 1886',
			nota_fr: 'Ses quatre dialectes, du Léon à Vannes, dans sa limite de 1886', nota_es: 'Sus cuatro dialectos, de Leon a Gwened, dentro de su límite de 1886', nota_en: 'Its four dialects, from Leon to Gwened, within its 1886 boundary', nota_ca: 'Els seus quatre dialectes, de Leon a Gwened, dins del seu límit de 1886', nota_ar: 'لهجاتها الأربع، من Leon إلى Gwened، ضمن حدودها عام 1886'
		},
		{
			id: 'alsacian',
			oc: 'Alsacian',
			fr: 'Alsacien',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Alsàcia, a l’entorn d’Estrasborg ; fa partida del continuum alemanic, que s’espandís en Alemanha e en Soïssa, fins a Basilèa e Zuric',
			nota_fr: 'En Alsace, autour de Strasbourg ; il fait partie du continuum alémanique, qui s’étend en Allemagne et en Suisse, jusqu’à Bâle et Zurich', nota_es: 'En Alsacia, en torno a Estrasborg; forma parte del continuo alemánico, que se extiende por Alemania y Suiza, hasta Basilèa y Zuric', nota_en: 'In Alsace, around Estrasborg; it belongs to the Alemannic continuum, which stretches across Germany and Switzerland, as far as Basilèa and Zuric', nota_ca: 'A l’Alsàcia, al voltant d’Estrasborg; forma part del continu alemànic, que s’estén per Alemanya i Suïssa, fins a Basilèa i Zuric', nota_ar: 'في ألزاس، حول Estrasborg؛ وهي جزء من المتصل اللهجي الأليماني الممتد في ألمانيا وسويسرا حتى Basilèa و Zuric'
		},
		{
			id: 'francic',
			oc: 'Francic (platt)',
			fr: 'Francique (platt)',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Mosèla germanofòna, lo platt ; se perlonga al Luxemborg e dins la Sarra',
			nota_fr: 'En Moselle germanophone, le platt ; il se prolonge au Luxembourg et dans la Sarre', nota_es: 'En el Mosela germanófono, el platt; se prolonga por Luxemburgo y el Sarre', nota_en: 'In German-speaking Moselle, the platt; it continues into Luxembourg and the Saarland', nota_ca: 'A la Mosel·la germanòfona, el platt; es perllonga per Luxemburg i el Sarre', nota_ar: 'في موزيل الناطقة بالألمانية، لهجة platt؛ وتمتد إلى لوكسمبورغ وسارلاند'
		},
		{
			id: 'flamenc',
			oc: 'Flamenc e neerlandés',
			fr: 'Flamand et néerlandais',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En França, lo flamenc del Westhoek ; fa partida del continuum dels dialèctes neerlandeses, fins als Païses Basses',
			nota_fr: 'En France, le flamand du Westhoek ; il fait partie du continuum des dialectes néerlandais, jusqu’aux Pays-Bas', nota_es: 'En Francia, el flamenco del Westhoek; forma parte del continuo de los dialectos neerlandeses, hasta los Países Bajos', nota_en: 'In France, the Flemish of the Westhoek; it belongs to the continuum of Dutch dialects, as far as the Netherlands', nota_ca: 'A França, el flamenc del Westhoek; forma part del continu dels dialectes neerlandesos, fins als Països Baixos', nota_ar: 'في فرنسا، الفلمنكية في Westhoek؛ وهي جزء من المتصل اللهجي الهولندي الممتد حتى هولندا'
		},
		{
			id: 'cors',
			oc: 'Còrs',
			fr: 'Corse',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'En Corsega, sos parlars, del Cap Còrs a Bonifacio ; en Sardenha, lo gallurés e lo sassarés ne son pròches',
			nota_fr: 'En Corse, ses parlers, du Cap Corse à Bonifacio ; en Sardaigne, le gallurais et le sassarais en sont proches', nota_es: 'En Córcega, sus hablas, del Cabo Corso a Bonifacio; en Cerdeña, el gallurés y el sasarés son cercanos', nota_en: 'In Corsica, its local varieties, from Cap Corse to Bonifacio; in Sardinia, Gallurese and Sassarese are close to it', nota_ca: 'A Còrsega, els seus parlars, del Cap Corse a Bonifacio; a Sardenya, el gal·lurès i el sassarès hi són propers', nota_ar: 'في كورسيكا، لهجاتها المحلية، من Cap Corse إلى Bonifacio؛ وفي سردينيا تقترب منها لهجتا Gallurese و Sassarese'
		},
		{
			id: 'oil',
			oc: 'Lengas d’oïl',
			fr: 'Langues d’oïl',
			estat: 'disponible',
			defaut: false,
			nota_oc: 'Una familha de lengas, del nòrd a l’oèst de França : picard, normand, galò, peitavin-santongés, campanés, lorren… ; tanben en Belgica e en Soïssa',
			nota_fr: 'Une famille de langues, du nord à l’ouest de la France : picard, normand, gallo, poitevin-saintongeais, champenois, lorrain… ; aussi en Belgique et en Suisse', nota_es: 'Una familia de lenguas, del norte al oeste de Francia: picardo, normando, galó, poitevino-saintongés, champañés, lorenés…; también en Bélgica y Suiza', nota_en: 'A family of languages, from the north to the west of France: Picard, Norman, Gallo, Poitevin-Saintongeais, Champenois, Lorrain…; also in Belgium and Switzerland', nota_ca: 'Una família de llengües, del nord a l’oest de França: picard, normand, gal·ló, poitevin-saintongès, champanyès, lorenès…; també a Belgica i a Suïssa', nota_ar: 'عائلة من اللغات، من شمال فرنسا إلى غربها: picard، normand، gallo، poitevin-saintongeais، champenois، lorrain…؛ وكذلك في بلجيكا وسويسرا'
		}
	]
});

// Las jaces de lengas pintadas per una còla de lenga (colaLenga.js, lengas.js)
// La rubrica « Donadas » del mòde « Lengas de França » (etapa 4, Romain,
// 2026-10-10) : de donadas pròpias a las lengas, a despart de lors jaces ;
// visibla sonque dins lo mòde (lo rail ordinari la mòstra pas). Dessenhadas
// per donadasLengas.js
CATALOGUE.push({
	id: 'donadas',
	oc: 'Donadas',
	fr: 'Données', es: 'Datos', en: 'Data', ca: 'Dades', ar: 'البيانات',
	jaces: [
		{ id: 'escolasBreton', oc: 'Ensenhament bilingüe en breton', fr: 'Enseignement bilingue en breton', es: 'Enseñanza bilingüe en bretón', en: 'Bilingual education in Breton', ca: 'Ensenyament bilingüe en bretó', ar: 'التعليم ثنائي اللغة بالبريتونية', estat: 'disponible', defaut: false, nota_oc: 'Escolans per comuna, dintrada 2025', nota_fr: 'Élèves par commune, rentrée 2025', nota_es: 'Alumnado por municipio, inicio del curso 2025', nota_en: 'Pupils per commune, start of the 2025 school year', nota_ca: 'Alumnes per municipi, inici del curs 2025', nota_ar: 'التلاميذ حسب البلدية، مطلع العام الدراسي 2025' },
		{ id: 'limitsBreton', oc: 'Limits del breton', fr: 'Limites du breton', es: 'Límites del bretón', en: 'Limits of Breton', ca: 'Límits del bretó', ar: 'حدود البريتونية', estat: 'disponible', defaut: false, nota_oc: 'Del sègle IX a 1806', nota_fr: 'Du IXe siècle à 1806', nota_es: 'Del siglo IX a 1806', nota_en: 'From the 9th century to 1806', nota_ca: 'Del segle IX al 1806', nota_ar: 'من القرن التاسع حتى 1806' },
		{ id: 'escolasCors', oc: 'Ensenhament bilingüe en còrs', fr: 'Enseignement bilingue en corse', es: 'Enseñanza bilingüe en corso', en: 'Bilingual education in Corsican', ca: 'Ensenyament bilingüe en cors', ar: 'التعليم ثنائي اللغة بالكورسيكية', estat: 'a venir' }
	]
});

export const JACES_LENGAS = ['catalan', 'arpitan', 'basc', 'oil', 'alsacian', 'francic', 'breton', 'cors', 'flamenc'];

// Las jaces pintadas pel fons « Contorns » (colaEstelas.js) : son pas pintadas
// sus los autres fonses (las tuèlas an las lors). Jaça → element del fons.
export const JACES_FONS = { vilas: 'estelas', toponimia: 'nomsVilas', rius: 'rius', nomsRius: 'nomsRius', corbas: 'corbas' };

// Las jaces que pinta la còla de donadas (colaDonadas.js) ; las autras son de
// jaces Leaflet (punts e zònas de la basa)
// L'icòna de cada jaça de ponches que n'a una dins lo catalògue (font unica
// per la carta e per lo rail : la pastilha de la linha es la de la carta)
export const ICONAS_JACES = Object.fromEntries(
	CATALOGUE.flatMap((f) => f.jaces)
		.filter((j) => j.icona)
		.map((j) => [j.id, j.icona])
);

export const JACES_DONADAS = ['frontiera', 'dialectes', 'unificat', 'creissent', 'regions', 'despartaments', 'locutors'];

// Las jaces que pinta la còla tematica (colaTematica.js), de fonts publicas
export const JACES_TEMATICAS = ['comunas', 'provincias', 'parcs', 'massis'];

// Tematica de la basa → familha del catalògue, per las jaces apondudas dins l'admin
const TEMATICA_FAMILHA = { Luòcs: 'cultura', Lenga: 'lenga', Referéncia: 'administracion' };

// Fusion del catalògue e de las linhas de carta_colas (se la basa respond)
export function fusionarCatalogue(linhas = []) {
	const familhas = CATALOGUE.map((f) => ({ ...f, jaces: f.jaces.map((j) => ({ ...j })) }));
	const perId = new Map(familhas.flatMap((f) => f.jaces.map((j) => [j.id, j])));
	const autras = { id: 'autras', oc: 'Autras', fr: 'Autres', es: 'Otras', en: 'Other', ca: 'Altres', ar: 'أخرى', jaces: [] };
	for (const r of linhas) {
		const j = perId.get(r.id);
		if (j) {
			// Lo nom d'una jaça que lo site sap pintar sol ven del còde, pas de la
			// basa (Romain, 2026-10-22 : l'espaci d'administracion es pas encara
			// represes, deu pas blocar ; abans, la basa podiá renomenar). La basa pòt
			// encara anonciar una jaça (nòta, disponibilitat, visibilitat per defaut).
			// (una linha d'abans que lo site sapièsse pintar la jaça, « A venir »,
			// es passada : sa nòta contradiriá la jaça disponibla, retorn de Romain
			// sus las provincias istoricas, 2026-10-08)
			const passada = j.estat === 'disponible' && (r.disponible === false || /^\s*[aà] venir\s*$/i.test(r.nòta_oc ?? ''));
			if (r.nòta_oc && !passada) j.nota_oc = r.nòta_oc;
			if (r.nòta_fr && !passada) j.nota_fr = r.nòta_fr;
			if (j.estat === 'basa') j.estat = r.disponible ? 'disponible' : 'a venir';
			if (typeof r.visibla === 'boolean') j.defaut = r.visibla;
			continue;
		}
		const novèla = {
			id: r.id,
			oc: r.label_oc,
			fr: r.label_fr ?? r.label_oc,
			nota_oc: r.nòta_oc,
			nota_fr: r.nòta_fr,
			estat: r.disponible ? 'disponible' : 'a venir',
			defaut: r.visibla === true
		};
		const fam = familhas.find((f) => f.id === TEMATICA_FAMILHA[r.tematica_oc]) ?? autras;
		fam.jaces.push(novèla);
	}
	if (autras.jaces.length) familhas.push(autras);
	return familhas;
}
