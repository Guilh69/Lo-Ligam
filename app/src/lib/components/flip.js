// Le geste d'un filtre de cases (Romain, 2026-11-04, sur la grammaire : « il
// faut que les autres disparaissent et que les cases de la catégorie
// sélectionnée bougent avec une animation et se mettent les unes après les
// autres ») : ce qui part s'efface, puis ce qui reste glisse de son ancienne
// place à la nouvelle (technique « FLIP » : on mesure avant, on change, on
// mesure après, on anime l'écart), et ce qui arrive apparaît l'un après
// l'autre. Moins de 1 s en tout. Les blocs portent data-clau.
//
// conteneur : l'élément qui contient les blocs ; restan : les data-clau qui
// restent ; aplicar : change la liste et attend que la page suive (tick).
export async function flip(conteneur, restan, aplicar) {
	const blocs = () => [...conteneur.querySelectorAll('[data-clau]')];
	const avant = new Map(blocs().map((el) => [el.dataset.clau, el.getBoundingClientRect()]));
	// au plus 0,3 s d'attente : un onglet en arrière-plan fige les animations,
	// le filtre ne doit pas rester bloqué
	const partent = blocs().filter((el) => !restan.has(el.dataset.clau));
	await Promise.race([
		Promise.all(
			partent.map(
				(el) =>
					el.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(0.97)' }], {
						duration: 180,
						easing: 'ease-in',
						fill: 'forwards'
					}).finished
			)
		),
		new Promise((r) => setTimeout(r, 300))
	]);
	await aplicar();
	let arrivee = 0;
	for (const el of blocs()) {
		const a = avant.get(el.dataset.clau);
		const b = el.getBoundingClientRect();
		if (a && a.width) {
			const dx = a.left - b.left;
			const dy = a.top - b.top;
			if (dx || dy)
				el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
					duration: 480,
					easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
				});
		} else {
			el.animate([{ opacity: 0, transform: 'translateY(0.6rem)' }, { opacity: 1, transform: 'none' }], {
				duration: 320,
				delay: Math.min(arrivee++ * 25, 400),
				easing: 'ease-out',
				fill: 'backwards'
			});
		}
	}
}
