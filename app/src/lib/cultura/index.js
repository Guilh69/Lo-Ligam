// La rubrique Cultura de Se parla, à la place du wiki (Romain, 2026-11-04 :
// « on fait une rubrique cultura… ça irait plutôt dans se parla », puis « ça
// va remplacer plutôt Wiki » ; Articles reste son espace d'expression). Forme
// choisie le même jour : des fiches par thème, comme la grammaire (cases de
// couleur, filtre en haut, ordre du parcours).
//
// Une fiche = un encart « Cultura » d'une leçon (bloc `variant: 'culture'`
// de $lib/lesson/moduls/) : le texte n'est écrit qu'une fois, dans la leçon,
// et la fiche le lit tel quel (côté serveur, voir encart.server.js). Ici,
// seulement le thème et le titre dans chaque langue. « fr » est le titre de
// l'encart, sans « Cultura : » : c'est lui qui retrouve l'encart dans le
// module. Un nouvel encart doit être rangé ici (les tests le rappellent).
//
// Les langues (Romain, 2026-11-04, comme la grammaire) : l'interface suit la
// langue choisie ; en occitan, la bulle de survol donne des exemples en
// occitan ; dans une autre langue, le nom occitan. Le texte des fiches reste
// en français. Occitan vérifié par lo Congrès, À VALIDER par Romain.

// la couleur de chaque thème (case, texte posé dessus) : les accents de la
// charte et la terre du jeu « terra » ($lib/apren/teulas.js), sans le rouge du
// logo (réservé à ce qui se clique) ; la langue prend le pétrole de la case
// Cultura de Se parla. Contraste du texte : 5,0 à 8,6 (comme la grammaire),
// 5,9 pour la terre. Depuis le 2026-11-06 (photos teintées, allure B choisie
// par Romain), la musique passe de l'or (#eeaf34, texte foncé) à un or brun :
// le texte est crème partout, 4,65 sur l'aplat seul.
import { TEINTES } from '$lib/styles/palette.js';

// les teintes : lib/styles/palette.js ; l'or brun et la terre restent ici
const CREMA = TEINTES.creme;

export const TEMAS = [
	{
		id: 'lenga',
		color: [TEINTES.sarcelle, CREMA],
		nom: { oc: 'La lenga', fr: 'La langue', es: 'La lengua', en: 'The language', ca: 'La llengua', ar: 'اللغة' },
		detalh: { oc: 'd’ont venon los mots', fr: 'd’où viennent les mots', es: 'de dónde vienen las palabras', en: 'where words come from', ca: 'd’on vénen les paraules', ar: 'من أين جاءت الكلمات' },
		exemple: 'òc, miègjorn, diluns, dimenge'
	},
	{
		id: 'noms',
		color: [TEINTES.bleu, CREMA],
		nom: { oc: 'Los noms', fr: 'Les noms', es: 'Los nombres', en: 'Names', ca: 'Els noms', ar: 'الأسماء' },
		detalh: { oc: 'de familha, d’ostal, dels vents', fr: 'de famille, de maison, des vents', es: 'de familia, de casa, de los vientos', en: 'of families, houses and winds', ca: 'de família, de casa, dels vents', ar: 'أسماء العائلات والبيوت والرياح' },
		exemple: 'l’escais, lo molinièr, l’ostal'
	},
	{
		id: 'pais',
		color: [TEINTES.olive, CREMA],
		nom: { oc: 'Lo país', fr: 'Le pays', es: 'El país', en: 'The country', ca: 'El país', ar: 'البلاد' },
		detalh: { oc: 'fèstas, taula, vilas', fr: 'fêtes, table, villes', es: 'fiestas, mesa, ciudades', en: 'festivals, food, towns', ca: 'festes, taula, ciutats', ar: 'الأعياد والمائدة والمدن' },
		exemple: 'Carnaval, lo caçolet, lo mas, las bastidas'
	},
	{
		id: 'poetas',
		color: [TEINTES.prune, CREMA],
		nom: { oc: 'Los poètas', fr: 'Les poètes', es: 'Los poetas', en: 'The poets', ca: 'Els poetes', ar: 'الشعراء' },
		detalh: { oc: 'trobadors, Mistral, Tolosa', fr: 'troubadours, Mistral, Toulouse', es: 'trovadores, Mistral, Tolosa', en: 'troubadours, Mistral, Tolosa', ca: 'trobadors, Mistral, Tolosa', ar: 'التروبادور، Mistral، Tolosa' },
		exemple: 'trobar, la fin’amor, lo solelh'
	},
	{
		id: 'musica',
		color: ['#8f6514', CREMA],
		nom: { oc: 'La musica', fr: 'La musique', es: 'La música', en: 'Music', ca: 'La música', ar: 'الموسيقى' },
		detalh: { oc: 'cançons d’ièr e d’uèi', fr: 'chansons d’hier et d’aujourd’hui', es: 'canciones de ayer y de hoy', en: 'songs of yesterday and today', ca: 'cançons d’ahir i d’avui', ar: 'أغانٍ من الأمس واليوم' },
		exemple: 'Amor d’Aussau, A mon ostal, Parla patois'
	},
	{
		id: 'uei',
		color: ['#8a4f12', CREMA],
		nom: { oc: 'Uèi', fr: 'Aujourd’hui', es: 'Hoy', en: 'Today', ca: 'Avui', ar: 'اليوم' },
		detalh: { oc: 'escòla, familha, vila', fr: 'école, famille, ville', es: 'escuela, familia, ciudad', en: 'school, family, town', ca: 'escola, família, ciutat', ar: 'المدرسة والعائلة والمدينة' },
		exemple: 'la Calandreta, la mameta, lo papeta'
	}
];

// dans l'ordre du parcours (celui des modules) ; « modul » : la clé du module
// ($lib/lesson/moduls/index.js)
export const FICHAS = [
	{ id: 'nou-punts', modul: '0', tema: 'lenga', titol: { oc: 'L’occitan en nòu punts', fr: 'L’occitan en neuf points', es: 'El occitano en nueve puntos', en: 'Occitan in nine points', ca: 'L’occità en nou punts', ar: 'اللغة الأوكسيتانية في تسع نقاط' } },
	{ id: 'amor-d-aussau', modul: '0', tema: 'musica', titol: { oc: 'Amor d’Aussau', fr: 'Amor d’Aussau', es: 'Amor d’Aussau', en: 'Amor d’Aussau', ca: 'Amor d’Aussau', ar: 'Amor d’Aussau' } },
	{ id: 'carnaval', modul: '1-1', tema: 'pais', titol: { oc: 'Lo darrièr adieu de Carnaval', fr: 'Le dernier adieu de Carnaval', es: 'El último adiós de Carnaval', en: 'The last farewell of Carnaval', ca: 'L’últim adéu de Carnaval', ar: 'الوداع الأخير للكرنفال' } },
	{ id: 'escais', modul: '1-2', tema: 'noms', titol: { oc: 'Los escais del vilatge', fr: 'Les surnoms de village', es: 'Los apodos de los pueblos', en: 'Village nicknames', ca: 'Els malnoms dels pobles', ar: 'ألقاب القرى' } },
	{ id: 'oc', modul: '1-3', tema: 'lenga', titol: { oc: 'Lo mot que donèt son nom a la lenga', fr: 'Le mot qui a donné son nom à la langue', es: 'La palabra que dio nombre a la lengua', en: 'The word that gave the language its name', ca: 'La paraula que va donar nom a la llengua', ar: 'الكلمة التي أعطت اللغة اسمها' } },
	{ id: 'copa-santa', modul: '2-1', tema: 'poetas', titol: { oc: 'La copa dels catalans', fr: 'La coupe des Catalans', es: 'La copa de los catalanes', en: 'The Catalans’ cup', ca: 'La copa dels catalans', ar: 'كأس الكاتالونيين' } },
	{ id: 'claudi-marti', modul: '2-2', tema: 'musica', titol: { oc: 'Una cançon de Claudi Martí', fr: 'Une chanson de Claudi Martí', es: 'Una canción de Claudi Martí', en: 'A song by Claudi Martí', ca: 'Una cançó de Claudi Martí', ar: 'أغنية لـ Claudi Martí' } },
	{ id: 'oc-oil-si', modul: '2-3', tema: 'lenga', titol: { oc: 'Òc, oïl e sì', fr: 'Les langues du « oui »', es: 'Las lenguas del «sí»', en: 'The languages of “yes”', ca: 'Les llengües del «sí»', ar: 'لغات «نعم»' } },
	{ id: 'calandreta', modul: '3-1', tema: 'uei', titol: { oc: 'L’escòla en occitan', fr: 'L’école en occitan', es: 'La escuela en occitano', en: 'School in Occitan', ca: 'L’escola en occità', ar: 'المدرسة بالأوكسيتانية' } },
	{ id: 'papeta-mameta', modul: '3-2', tema: 'uei', titol: { oc: 'La lenga del papeta e de la mameta', fr: 'La langue des grands-parents', es: 'La lengua de los abuelos', en: 'The language of grandparents', ca: 'La llengua dels avis', ar: 'لغة الأجداد' } },
	{ id: 'mon-paire', modul: '3-3', tema: 'musica', titol: { oc: 'Una cançon de familha', fr: 'Une chanson de famille', es: 'Una canción de familia', en: 'A family song', ca: 'Una cançó de família', ar: 'أغنية عائلية' } },
	{ id: 'familha', modul: '3-4', tema: 'uei', titol: { oc: 'La lenga passa per la familha', fr: 'La langue passe par la famille', es: 'La lengua pasa por la familia', en: 'Language is passed down in the family', ca: 'La llengua passa per la família', ar: 'اللغة تنتقل عبر العائلة' } },
	{ id: 'trobador', modul: '4-1', tema: 'poetas', titol: { oc: 'Trobador, un nom de mestièr', fr: 'Troubadour, un nom de métier', es: 'Trovador, un nombre de oficio', en: 'Troubadour, a job title', ca: 'Trobador, un nom d’ofici', ar: 'التروبادور، اسم مهنة' } },
	{ id: 'mestiers', modul: '4-2', tema: 'noms', titol: { oc: 'De mestièrs dins los noms de familha', fr: 'Des métiers dans les noms de famille', es: 'Oficios en los apellidos', en: 'Trades in family names', ca: 'Oficis als cognoms', ar: 'مهن في ألقاب العائلات' } },
	{ id: 'jorns', modul: '4-3', tema: 'lenga', titol: { oc: 'Los jorns venon del latin', fr: 'Les jours viennent du latin', es: 'Los días vienen del latín', en: 'The days come from Latin', ca: 'Els dies vénen del llatí', ar: 'أيام الأسبوع جاءت من اللاتينية' } },
	{ id: 'alh-oli', modul: '5-1', tema: 'pais', titol: { oc: 'L’alh, l’òli e lo caçolet', fr: 'L’aïoli et le cassoulet', es: 'El alioli y el cassoulet', en: 'Aioli and cassoulet', ca: 'L’allioli i el cassoulet', ar: 'الأيولي والـ cassoulet' } },
	{ id: 'bon-mercat', modul: '5-2', tema: 'pais', titol: { oc: 'Un provèrbi del mercat', fr: 'À bon marché, prends garde', es: 'Si es barato, ojo', en: 'If it’s cheap, beware', ca: 'Si és barat, vés amb compte', ar: 'إذا كان رخيصًا فاحذر' } },
	{ id: 'rocafort', modul: '5-3', tema: 'pais', titol: { oc: 'Lo formatge de Ròcafòrt', fr: 'Le roquefort', es: 'El queso de Roquefort', en: 'Roquefort cheese', ca: 'El formatge de Roquefort', ar: 'جبن Roquefort' } },
	{ id: 'al-mercat', modul: '5-4', tema: 'musica', titol: { oc: 'Una cançon per anar al mercat', fr: 'Une chanson pour aller au marché', es: 'Una canción para ir al mercado', en: 'A song for going to market', ca: 'Una cançó per anar al mercat', ar: 'أغنية للذهاب إلى السوق' } },
	{ id: 'miegjorn', modul: '6-1', tema: 'lenga', titol: { oc: 'Miègjorn… e lo sud', fr: 'Midi… et le Sud', es: 'Mediodía… y el Sur', en: 'Midi… and the South', ca: 'Migdia… i el Sud', ar: 'الظهيرة… والجنوب' } },
	{ id: 'vents', modul: '6-2', tema: 'noms', titol: { oc: 'Los vents an de noms occitans', fr: 'Les vents ont des noms occitans', es: 'Los vientos tienen nombres occitanos', en: 'The winds have Occitan names', ca: 'Els vents tenen noms occitans', ar: 'للرياح أسماء أوكسيتانية' } },
	{ id: 'solelh', modul: '6-3', tema: 'poetas', titol: { oc: 'Mistral parla al solelh', fr: 'Mistral parle au soleil', es: 'Mistral habla al sol', en: 'Mistral speaks to the sun', ca: 'Mistral parla al sol', ar: 'Mistral يخاطب الشمس' } },
	{ id: 'ostal', modul: '7-1', tema: 'noms', titol: { oc: 'L’ostal e la familha', fr: 'L’ostal, la maison et la famille', es: 'El ostal, la casa y la familia', en: 'The ostal, the house and the family', ca: 'L’ostal, la casa i la família', ar: 'ostal، أي البيت والعائلة' } },
	{ id: 'mas', modul: '7-2', tema: 'pais', titol: { oc: 'Lo mas', fr: 'Lo mas', es: 'Lo mas', en: 'Lo mas', ca: 'Lo mas', ar: 'Lo mas' } },
	{ id: 'roge-e-aur', modul: '7-3', tema: 'pais', titol: { oc: 'Lo roge e l’aur', fr: 'Le rouge et l’or', es: 'El rojo y el oro', en: 'Red and gold', ca: 'El vermell i l’or', ar: 'الأحمر والذهبي' } },
	{ id: 'a-mon-ostal', modul: '7-4', tema: 'musica', titol: { oc: 'Una cançon : A mon ostal', fr: 'Une chanson, A mon ostal', es: 'Una canción: A mon ostal', en: 'A song: A mon ostal', ca: 'Una cançó: A mon ostal', ar: 'أغنية: A mon ostal' } },
	{ id: 'vila', modul: '8-1', tema: 'uei', titol: { oc: 'La vila parla tanben occitan', fr: 'La ville parle aussi occitan', es: 'La ciudad también habla occitano', en: 'The city speaks Occitan too', ca: 'La ciutat també parla occità', ar: 'المدينة أيضًا تتحدث الأوكسيتانية' } },
	{ id: 'bastidas', modul: '8-2', tema: 'pais', titol: { oc: 'Las bastidas, de vilas nòvas', fr: 'Les bastides, des villes neuves', es: 'Las bastides, ciudades nuevas', en: 'Bastides, new towns', ca: 'Les bastides, ciutats noves', ar: 'الـ bastides: مدن جديدة' } },
	{ id: 'parla-patois', modul: '8-3', tema: 'musica', titol: { oc: 'De reggae en occitan', fr: 'Du reggae en occitan', es: 'Reggae en occitano', en: 'Reggae in Occitan', ca: 'Reggae en occità', ar: 'ريغي بالأوكسيتانية' } },
	{ id: 'tolosa', modul: '8-4', tema: 'poetas', titol: { oc: 'Tolosa, vila de poesia', fr: 'Toulouse, ville de poésie', es: 'Tolosa, ciudad de poesía', en: 'Tolosa, city of poetry', ca: 'Tolosa, ciutat de poesia', ar: 'Tolosa، مدينة الشعر' } }
];

export const ficha = (id) => FICHAS.find((f) => f.id === id) ?? null;
export const tema = (id) => TEMAS.find((t) => t.id === id) ?? null;

/** « Cultura : le roquefort » → « le roquefort » : le titre qui retrouve l'encart */
export const titolEncart = (t = '') => t.replace(/^(Cultura|À écouter)\s*:\s*/, '');
/** même titre, à la majuscule près */
export const memeTitol = (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'accent' }) === 0;

/** « 5-1 » → « Modul 5.1 » dans chaque langue (comme le parcours, $lib/parcors/textes.js) */
export function nomModul(clau) {
	const n = clau.replace('-', '.');
	return { oc: `Modul ${n}`, fr: `module ${n}`, es: `módulo ${n}`, en: `module ${n}`, ca: `mòdul ${n}`, ar: `الوحدة ${n}` };
}

// Les textes de l'interface (ceux de la grammaire pour le filtre :
// $lib/gramatica/lengas.js, IU.triarTema, totVeire, estat, perExemple)
export const IU = {
	frasa: {
		oc: (n) => `${n} fichas cortas sus la lenga, lo país, sos poètas e sas cançons. Cada ficha ven d’una leiçon del parcors.`,
		fr: (n) => `${n} fiches courtes sur la langue, le pays, ses poètes et ses chansons. Chaque fiche vient d’une leçon du parcours.`,
		es: (n) => `${n} fichas cortas sobre la lengua, el país, sus poetas y sus canciones. Cada ficha viene de una lección del recorrido.`,
		en: (n) => `${n} short sheets on the language, the country, its poets and its songs. Each sheet comes from a lesson in the course.`,
		ca: (n) => `${n} fitxes curtes sobre la llengua, el país, els seus poetes i les seves cançons. Cada fitxa ve d’una lliçó del recorregut.`,
		// arabe : 1 et 2 à part, 3 à 10 au pluriel, au-delà le singulier (reste de n modulo 100)
		ar: (n) => {
			const r = n % 100;
			const cartes = n === 1 ? 'بطاقة واحدة قصيرة' : n === 2 ? 'بطاقتان قصيرتان' : r >= 3 && r <= 10 ? `${n} بطاقات قصيرة` : `${n} بطاقة قصيرة`;
			return `${cartes} عن اللغة والبلاد وشعرائها وأغانيها. كل بطاقة مأخوذة من درس في المسار.`;
		}
	},
	descripcion: {
		oc: 'Cultura : de fichas cortas sus la lenga occitana, lo país, sos poètas e sas cançons.',
		fr: 'Culture : des fiches courtes sur la langue occitane, le pays, ses poètes et ses chansons.',
		es: 'Cultura: fichas cortas sobre la lengua occitana, el país, sus poetas y sus canciones.',
		en: 'Culture: short sheets on the Occitan language, the country, its poets and its songs.',
		ca: 'Cultura: fitxes curtes sobre la llengua occitana, el país, els seus poetes i les seves cançons.',
		ar: 'الثقافة: بطاقات قصيرة عن اللغة الأوكسيتانية والبلاد وشعرائها وأغانيها.'
	},
	fichas: { oc: 'Las fichas', fr: 'Les fiches', es: 'Las fichas', en: 'The sheets', ca: 'Les fitxes', ar: 'البطاقات' },
	dinsParcors: { oc: 'Dins lo parcors', fr: 'Dans le parcours', es: 'En el recorrido', en: 'In the course', ca: 'Dins el recorregut', ar: 'في المسار' },
	precedenta: { oc: 'Ficha precedenta', fr: 'Fiche précédente', es: 'Ficha anterior', en: 'Previous sheet', ca: 'Fitxa anterior', ar: 'البطاقة السابقة' },
	seguenta: { oc: 'Ficha seguenta', fr: 'Fiche suivante', es: 'Ficha siguiente', en: 'Next sheet', ca: 'Fitxa següent', ar: 'البطاقة التالية' },
	vesinas: { oc: 'Las fichas vesinas', fr: 'Les fiches voisines', es: 'Fichas vecinas', en: 'Nearby sheets', ca: 'Fitxes veïnes', ar: 'بطاقات مجاورة' },
	autreSite: { oc: 'autre site', fr: 'site extérieur', es: 'sitio externo', en: 'external site', ca: 'lloc extern', ar: 'موقع خارجي' },
	// crédit des photos libres de Wikimedia Commons (fiche, pied du sommaire)
	// (deux-points à la française en occitan et en français seulement)
	fotoDe: { oc: 'Fòto :', fr: 'Photo :', es: 'Foto:', en: 'Photo:', ca: 'Foto:', ar: 'صورة:' },
	modificada: { oc: 'modificada', fr: 'modifiée', es: 'modificada', en: 'modified', ca: 'modificada', ar: 'معدّلة' },
	fotosCommons: {
		oc: 'Fòtos de Wikimedia Commons, modificadas :',
		fr: 'Photos de Wikimedia Commons, modifiées :',
		es: 'Fotos de Wikimedia Commons, modificadas:',
		en: 'Photos from Wikimedia Commons, modified:',
		ca: 'Fotos de Wikimedia Commons, modificades:',
		ar: 'صور من ويكيميديا كومنز، معدّلة:'
	},
	enFrances: { oc: 'Tèxte en francés', fr: '', es: 'Texto en francés', en: 'Text in French', ca: 'Text en francès', ar: 'النص بالفرنسية' }
};
