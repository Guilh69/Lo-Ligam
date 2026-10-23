// Petit balisage des textes modifiables sur place (2026-10-24) : Romain écrit
// du texte brut, jamais de HTML. Deux marques seulement :
//   *mot*  → mis en valeur (or, classe « aur »)
//   _mot_  → en italique (titre d'œuvre)
// Tout le reste est affiché tel quel ; un astérisque ou un tiret bas isolé
// reste un caractère ordinaire.

/** @returns {{ t: string, aur: boolean, ital: boolean }[]} */
export function segments(s) {
	const res = [];
	let aur = false,
		ital = false,
		buf = '';
	const txt = String(s ?? '');
	for (let i = 0; i < txt.length; i++) {
		const c = txt[i];
		if (c === '*' || c === '_') {
			// la marque ne compte que si elle ouvre ou ferme un passage non vide
			const fermant = c === '*' ? aur : ital;
			const j = txt.indexOf(c, i + 1);
			if (!fermant && j === -1) {
				buf += c;
				continue;
			}
			if (buf) res.push({ t: buf, aur, ital });
			buf = '';
			if (c === '*') aur = !aur;
			else ital = !ital;
			continue;
		}
		buf += c;
	}
	if (buf) res.push({ t: buf, aur, ital });
	return res;
}

// Le texte sans ses marques (attributs, lecteurs d'écran)
export const sensMarcas = (s) => segments(s).map((x) => x.t).join('');
