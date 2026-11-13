// Revirar : choix de la phrase suivante et état de la correction (logique pure).

/**
 * Tire une phrase au hasard, jamais la courante, en évitant celles déjà vues ;
 * quand toutes ont été vues, on recommence le tour.
 * Rend { phrase, vues } (vues = ids déjà montrées, y compris la nouvelle).
 */
export function phraseSuivante(phrases, idCourant, vues = [], hasard = Math.random) {
	let candidates = phrases.filter((p) => p.id !== idCourant && !vues.includes(p.id));
	let dejaVues = vues;
	if (!candidates.length) {
		dejaVues = idCourant ? [idCourant] : [];
		candidates = phrases.filter((p) => p.id !== idCourant);
	}
	if (!candidates.length) candidates = phrases;
	const phrase = candidates[Math.min(candidates.length - 1, Math.floor(hasard() * candidates.length))];
	return { phrase, vues: [...dejaVues, phrase.id] };
}

/**
 * L'état d'un mot après vérification :
 * 'confirmat' (lo Basic le connaît), 'inconegut' (lo Basic ne le connaît pas),
 * 'pas-cercat' (mot court, grammatical, élision ou point intérieur),
 * 'indisponible' (pas de vérification : clé absente, panne).
 * `verifs` = { estat: 'ok' | 'sens-clau' | 'error' | …, mots: { mot: 'ok' | 'absent' | 'error' } }.
 */
export function estatMot(raison, mot, verifs) {
	if (raison) return 'pas-cercat';
	if (verifs?.estat !== 'ok') return 'indisponible';
	const v = verifs.mots?.[mot];
	return v === 'ok' ? 'confirmat' : v === 'absent' ? 'inconegut' : 'indisponible';
}

/** Les comptes d'une liste d'états de mots. */
export function resumir(estats) {
	const c = { confirmat: 0, inconegut: 0, 'pas-cercat': 0, indisponible: 0 };
	for (const e of estats) c[e]++;
	return c;
}

/** La phrase lue à voix haute par la région d'annonce après la correction. */
export function annonce(c, identique) {
	if (c.indisponible > 0 && c.confirmat === 0 && c.inconegut === 0) return 'Vérification indisponible. Le modèle est affiché sans être vérifié.';
	const p = (n, un, plus) => `${n} ${n > 1 ? plus : un}`;
	const bout = [p(c.confirmat, 'mot confirmé', 'mots confirmés'), p(c.inconegut, 'mot non trouvé', 'mots non trouvés')];
	return `Correction faite : ${bout.join(', ')}.${identique ? ' Ta phrase est identique au modèle.' : ''} Le modèle est affiché.`;
}
