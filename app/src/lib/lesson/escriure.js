// Correction des réponses écrites au clavier (décision de Romain du
// 2026-10-25, cahier §11) : en A1, majuscules et ponctuation ne comptent
// jamais ; un mot sans accent (ou sans trait d'union) est accepté avec une
// remarque douce qui montre la bonne graphie, et compte comme réussi.

// Ce qui ne compte jamais : majuscules, ponctuation, espaces en trop,
// apostrophe courbe ou droite.
export function netejar(texte) {
	return String(texte)
		.toLowerCase()
		.replace(/[’‘ʼ`]/g, "'")
		.replace(/[«»“”"?!.,;:…¿¡()]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// Le même texte sans accents ni cédille, les traits d'union comptés comme
// des espaces : ce que la remarque douce tolère.
export function sensAccents(texte) {
	return netejar(texte)
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/-/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

// La négation s'enseigne sous la forme du livre, « non… pas » (Gramatica de
// l'occitan estandard, p54). Sa forme familière, « pas » sans « non » (Parli
// pas), est juste aussi, sans remarque (Romain, 2026-11-02, cahier §11) :
// une réponse en « non… pas » accepte chaque « non » retiré ou gardé.
const NEGACION = /(?<!\p{L})non (?=[^,.;:!?…]*(?<!\p{L})pas(?!\p{L}))/giu;
export function formas(r) {
	const posicions = [...r.matchAll(NEGACION)].map((m) => m.index);
	if (!posicions.length || posicions.length > 3) return [r];
	const formas = [];
	for (let tria = 0; tria < 2 ** posicions.length; tria++) {
		// Chaque « non » choisi par les bits de « tria » est retiré (de droite à gauche).
		let f = r;
		for (let i = posicions.length - 1; i >= 0; i--) {
			if (tria & (1 << i)) f = f.slice(0, posicions[i]) + f.slice(posicions[i] + 'non '.length);
		}
		// « Non parli pas » → « Parli pas » : la majuscule passe au verbe.
		if (/^\p{Lu}/u.test(r) && /^\p{Ll}/u.test(f)) f = f[0].toUpperCase() + f.slice(1);
		formas.push(f);
	}
	return formas;
}

// Compare la saisie aux réponses attendues de l'item.
//   item.answers : réponses complètes acceptées (la première sert de modèle)
//   item.debut   : débuts acceptés, suivis de ce que l'élève veut (son nom,
//                  sa ville…) : « Me dison » + n'importe quel prénom
// Renvoie { statut: 'just' | 'quasi' | 'non', modele }, et debut: true quand
// c'est un début qui a répondu.
export function corregir(saisie, item) {
	const brut = netejar(saisie);
	if (!brut) return { statut: 'non', modele: null };
	const plat = sensAccents(saisie);
	// « Non, non ai pas de can » : la réponse, puis la négation ; juste aussi.
	const bruts = [brut, brut.replace(/^non non /, 'non ')];
	const answers = (item.answers ?? []).flatMap(formas);
	const debuts = (item.debut ?? []).flatMap(formas);

	for (const r of answers) {
		if (bruts.includes(netejar(r))) return { statut: 'just', modele: r };
	}
	for (const r of answers) {
		if (sensAccents(r) === plat) return { statut: 'quasi', modele: r };
	}
	// Un début qui finit par une apostrophe (« Soi d’ ») se colle à la suite
	// (« Soi d’Albi ») ; sinon, une espace sépare le début du reste.
	const suite = (n) => (/['’]$/.test(n) ? n : n + ' ');
	for (const d of debuts) {
		const n = suite(netejar(d));
		if (bruts.some((b) => b.startsWith(n) && b.length > n.length)) return { statut: 'just', modele: d, debut: true };
	}
	for (const d of debuts) {
		const n = suite(sensAccents(d));
		if (plat.startsWith(n) && plat.length > n.length) return { statut: 'quasi', modele: d, debut: true };
	}
	return { statut: 'non', modele: item.answers?.[0] ?? item.debut?.[0] ?? null };
}

// Les lettres à toucher au-dessus du champ, dans l'ordre de la décision.
export const LETRAS = ['à', 'è', 'é', 'ò', 'ó', 'í', 'ú', 'ç'];

// Ce que la remarque douce montre : l'accent oublié, ou le trait d'union.
export function remarca(saisie, modele) {
	const accents = (t) => netejar(t).normalize('NFC').replace(/[^àèéòóíúïüç]/g, '');
	return accents(saisie) !== accents(modele) ? 'accent' : 'tiret';
}
