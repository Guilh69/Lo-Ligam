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

// Compare la saisie aux réponses attendues de l'item.
//   item.answers : réponses complètes acceptées (la première sert de modèle)
//   item.debut   : débuts acceptés, suivis de ce que l'élève veut (son nom,
//                  sa ville…) : « Me dison » + n'importe quel prénom
// Renvoie { statut: 'just' | 'quasi' | 'non', modele }.
export function corregir(saisie, item) {
	const brut = netejar(saisie);
	if (!brut) return { statut: 'non', modele: null };
	const plat = sensAccents(saisie);

	for (const r of item.answers ?? []) {
		if (netejar(r) === brut) return { statut: 'just', modele: r };
	}
	for (const r of item.answers ?? []) {
		if (sensAccents(r) === plat) return { statut: 'quasi', modele: r };
	}
	for (const d of item.debut ?? []) {
		const n = netejar(d);
		if (brut.startsWith(n + ' ') && brut.length > n.length + 1) return { statut: 'just', modele: d };
	}
	for (const d of item.debut ?? []) {
		const n = sensAccents(d);
		if (plat.startsWith(n + ' ') && plat.length > n.length + 1) return { statut: 'quasi', modele: d };
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
