// Mélanger sans hasard : le même ordre côté serveur et côté navigateur (la page
// est rendue deux fois, un vrai tirage ferait deux ordres différents), et jamais
// l'ordre de départ, sinon l'exercice serait déjà fait.
export function barrejar(lista, grana = 7) {
	const mesclat = [...lista];
	let s = (grana + lista.length * 31) | 0;
	const seguent = () => {
		s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
		return s / 0x80000000;
	};
	for (let i = mesclat.length - 1; i > 0; i -= 1) {
		const j = Math.floor(seguent() * (i + 1));
		[mesclat[i], mesclat[j]] = [mesclat[j], mesclat[i]];
	}
	if (mesclat.length > 1 && mesclat.every((v, i) => v === lista[i])) mesclat.push(mesclat.shift());
	return mesclat;
}

// Le même mélange, où plus rien ne reste à sa place : pour deux colonnes à
// relier, sinon une paire tombe en face d'elle-même et se devine sans lire.
// On essaie quelques graines ; à défaut, on décale tout d'un cran.
export function barrejarTot(lista, grana = 7) {
	for (let g = grana; g < grana + 40; g += 1) {
		const mesclat = barrejar(lista, g);
		if (mesclat.every((v, i) => v !== lista[i])) return mesclat;
	}
	return lista.length > 1 ? [...lista.slice(1), lista[0]] : [...lista];
}
