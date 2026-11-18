// Suivre un dialogue qui s'allonge (gabarits, 2026-11-18) : quand une réplique
// se pose, ou quand le retour prend la place de la réserve de mots, on amène
// l'élément donné sous les yeux. On ne fait défiler que la zone qui contient le
// dialogue (la première qui défile au-dessus de l'élément), jamais la page.
export function seguirFil(el) {
	if (!el) return;
	let caissa = el.parentElement;
	while (caissa && !/auto|scroll/.test(getComputedStyle(caissa).overflowY)) caissa = caissa.parentElement;
	if (!caissa) return;
	const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
	const c = caissa.getBoundingClientRect();
	const e = el.getBoundingClientRect();
	if (e.bottom > c.bottom) caissa.scrollBy({ top: e.bottom - c.bottom + 10, behavior });
	else if (e.top < c.top) caissa.scrollBy({ top: e.top - c.top - 10, behavior });
}
