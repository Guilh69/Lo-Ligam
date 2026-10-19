// Sobriété de mémoire (2026-10-19 : sur l'iPhone d'une proche, la carte
// repartait de zéro ; Safari recharge en silence l'onglet qui dépasse sa
// réserve de mémoire). Un canevas à la taille de la carte (vue + marge) pèse
// 13 Mo sur un téléphone ; chaque couche de langue en gardait cinq ou six,
// pour la plupart des brouillons ou les restes d'une animation finie.
//
// - Les toiles de travail (fondu, masque, transition) ne servent que le temps
//   d'un calcul : toutes les couches partagent les mêmes, réduites à un pixel
//   quand la carte est au repos.
// - Une image qui ne sert plus (survol fini, transition finie, langue
//   éteinte) est réduite à un pixel : drawImage d'un pixel vide ne peint rien
//   (un canevas de 0 × 0 ferait échouer drawImage).

const telas = new Map();
let tLib = 0;

// Une toile de travail partagée, à la taille demandée, vide et dans son état
// initial (comme après « c.width = … ») ; réduite 1,5 s après son dernier usage
export function trabalh(clau, w, h) {
	let c = telas.get(clau);
	if (!c) telas.set(clau, (c = document.createElement('canvas')));
	if (!talhar(c, w, h)) {
		const g = c.getContext('2d');
		g.setTransform(1, 0, 0, 1, 0, 0);
		g.globalAlpha = 1;
		g.globalCompositeOperation = 'source-over';
		g.filter = 'none';
		g.clearRect(0, 0, c.width, c.height);
	}
	clearTimeout(tLib);
	tLib = setTimeout(() => telas.forEach(liberar), 1500);
	return c;
}

// La taille d'un canevas, seulement si elle change (une réallocation l'efface) ;
// true s'il a été réalloué
export function talhar(c, w, h) {
	w = Math.max(1, Math.round(w));
	h = Math.max(1, Math.round(h));
	if (c.width === w && c.height === h) return false;
	c.width = w;
	c.height = h;
	return true;
}

export function liberar(c) {
	if (c && (c.width > 1 || c.height > 1)) c.width = c.height = 1;
}
