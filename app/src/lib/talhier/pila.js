// Lo talhièr, lot 4 (Romain, 2026-11-06 ; revisions/2026-11-06-talhier.md) :
// les cartes de la pile de validation (/admin/pila), dans l'ordre où elles
// viennent. Ce fichier ne fait que calculer (testé dans pila.test.js) ; la
// lecture de la base et les gestes sont dans pila.svelte.js.
//
// L'ordre : d'abord ce que l'IA attend de Romain (ses questions), puis ce
// qu'elle a fait pour lui (ses réponses à regarder), puis l'occitan des pages,
// page par page, enfin les fiches de grammaire. « Mai tard » envoie une carte
// au bout de la pile.

/** Le lien vers l'endroit d'une note. La base exige une adresse qui commence
 *  par « / », mais « //ailleurs.com » en est une, et « /\ailleurs.com » aussi
 *  (le navigateur lit la barre inverse comme une barre ; Rodrigo, 06-11) : seul
 *  un chemin du site passe, sinon le lien mène à l'accueil. */
export const ligamNota = (r) => `${/^\/(?![/\\])/.test(r.pagina ?? '') ? r.pagina : '/'}?nota=${r.id}`;

/** Les pages modifiables sur place (iniciar('…') dans src/routes) et leur
 *  adresse. Une page de plus : une ligne ici (pila.test.js le vérifie). */
export const CAMINS = {
	acuelh: '/',
	apren: '/apren',
	visio: '/apren/visio',
	istoria: '/istoria',
	amassa: '/amassa',
	parla: '/parla',
	obras: '/obras',
	medias: '/medias',
	grops: '/grops',
	ideas: '/ideas'
};
const ÒRDRE = Object.keys(CAMINS);

export const caminFicha = (id) => `/apren/gramatica/${id}`;

/** le nom d'une page, pour dire où est une carte */
export const nomPagina = (camin) =>
	({ '/': 'l’accueil', '/apren': 'S’apren', '/apren/visio': 'les cours en visio' })[camin] ?? camin;

const coll = new Intl.Collator('fr', { numeric: true });

/** Ce qui attend la main de Romain dans les notes (même découpage que Per tu) */
const questionIA = (r) => r.per === 'romain' && !r.de_romain && r.estat === 'dubèrta';
const responsaIA = (r) => r.per === 'ia' && r.estat !== 'dubèrta' && !r.vista;
/** une note pour l'IA encore ouverte : l'élément attend sa réponse */
const enEspèra = (r) => r.per === 'ia' && r.estat === 'dubèrta';

/**
 * Les cartes, dans l'ordre.
 * @param {object} p
 * @param {object[]} p.notas    les notes vivantes (lib/talhier/notas.svelte.js)
 * @param {object[]} p.elements les éléments publiés qui ont de l'occitan,
 *                              chacun avec son empreinte (champ empremta)
 * @param {{ f: object, empremta: string }[]} p.fichas les fiches pas encore
 *                              marquées « validada » dans le code
 * @param {Record<string, string>} p.validacions « tipe:clau » → empreinte validée
 * @param {string[]} [p.maiTard] les cartes remises à plus tard, dans l'ordre
 * @param {string} [p.lot]      'gramatica' ou 'tèxtes' : une seule sorte
 */
export function fargarCartas({ notas, elements, fichas, validacions, maiTard = [], lot = null }) {
	const espèra = new Set(notas.filter(enEspèra).map((r) => r.clau ?? `pagina:${r.pagina}`));
	const parId = (a, b) => a.id - b.id;
	const cartas = [];

	if (!lot) {
		for (const r of notas.filter(questionIA).sort(parId)) cartas.push({ id: `q${r.id}`, tipe: 'question', r });
		for (const r of notas.filter(responsaIA).sort(parId)) cartas.push({ id: `r${r.id}`, tipe: 'responsa', r });
	}

	if (!lot || lot === 'tèxtes') {
		const rang = (e) => {
			const i = ÒRDRE.indexOf(e.pagina);
			return i < 0 ? ÒRDRE.length : i;
		};
		const fòra = elements
			.filter((e) => validacions[`element:${e.clau}`] !== e.empremta && !espèra.has(e.clau))
			.sort((a, b) => rang(a) - rang(b) || coll.compare(a.clau, b.clau));
		for (const e of fòra) cartas.push({ id: `e:${e.clau}`, tipe: 'element', e, empremta: e.empremta, camin: CAMINS[e.pagina] ?? null });
	}

	if (!lot || lot === 'gramatica') {
		const fòra = fichas
			.filter(({ f, empremta }) => validacions[`ficha:${f.id}`] !== empremta && !espèra.has(`pagina:${caminFicha(f.id)}`))
			.sort((a, b) => coll.compare(a.f.capitol ?? '', b.f.capitol ?? '') || (a.f.ordre ?? 0) - (b.f.ordre ?? 0) || coll.compare(a.f.id, b.f.id));
		for (const { f, empremta } of fòra) cartas.push({ id: `f:${f.id}`, tipe: 'ficha', f, empremta, camin: caminFicha(f.id) });
	}

	// « Mai tard » : au bout, dans l'ordre où elles y ont été envoyées
	const tard = new Map(maiTard.map((id, i) => [id, i]));
	const ara = cartas.filter((c) => !tard.has(c.id));
	const puèi = cartas.filter((c) => tard.has(c.id)).sort((a, b) => tard.get(a.id) - tard.get(b.id));
	return [...ara, ...puèi];
}

/** Pour le mode « Validar » d'une page : l'état de chaque élément.
 *  'nota' (une note pour l'IA attend sur lui), 'validat' ou 'a-validar'. */
export function estatElement(e, validacions, notas) {
	if (notas.some((r) => enEspèra(r) && r.clau === e.clau)) return 'nota';
	return validacions[`element:${e.clau}`] === e.empremta ? 'validat' : 'a-validar';
}
