// Éclairage des lettres du titre de l'accueil au survol (Romain, 2026-10-15 :
// « plus original, plus ludique », pas un jaune qui tombe d'un coup). Trois
// formes à comparer (sélecteur sur /?ensag=letras) ; le style est dans
// acuelh.css, selon <h1 data-lum="…"> :
//   - fanal : une lanterne suit la souris ; les lettres proches s'allument
//     selon la distance, avec un halo, et s'éteignent en douceur derrière ;
//   - brasa : la lettre se remplit d'or de bas en haut, comme une braise qu'on
//     attise, puis refroidit lentement (CSS seul) ;
//   - saut : la lettre saute et se dore, ses voisines suivent en vague.
// Si le visiteur réduit les animations : ni lanterne ni saut, la couleur seule.
//
//   <h1 data-lum={forma} use:lumLetras={{ forma }}>…</h1>

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function lumLetras(h1, opcions) {
	let forma = opcions?.forma ?? 'fanal';
	// Centres des lettres visibles (langue affichée), mesurés à l'entrée de la souris
	let centres = null;
	const visiblas = () => [...h1.querySelectorAll('.bi > [aria-hidden="false"] .letra:not(.espaci)')];

	function moure(e) {
		if (forma !== 'fanal' || calm()) return;
		centres ??= visiblas().map((l) => {
			const r = l.getBoundingClientRect();
			return [l, r.left + r.width / 2, r.top + r.height / 2, r.height];
		});
		for (const [l, x, y, h] of centres) {
			// la lanterne éclaire à peu près deux lettres de chaque côté
			const d = Math.hypot(e.clientX - x, (e.clientY - y) * 1.3);
			l.style.setProperty('--llum', Math.max(0, 1 - d / (h * 0.95)).toFixed(3));
		}
	}
	function escantir() {
		for (const l of h1.querySelectorAll('.letra')) l.style.removeProperty('--llum');
		centres = null;
	}

	function sautar(e) {
		if (forma !== 'saut') return;
		const l = e.target.closest?.('.letra');
		if (!l || l.classList.contains('espaci') || l.dataset.saut) return;
		l.dataset.saut = '1';
		setTimeout(() => delete l.dataset.saut, 600);
		// la lettre se dore, puis s'éteint lentement (transition CSS)
		l.classList.add('dorada');
		setTimeout(() => l.classList.remove('dorada'), 700);
		if (calm()) return;
		const fraires = [...l.parentElement.children];
		const i = fraires.indexOf(l);
		const AMPLITUDA = [0.16, 0.08, 0.04];
		fraires.forEach((f, j) => {
			const k = Math.abs(j - i);
			if (k >= AMPLITUDA.length || f.classList.contains('espaci')) return;
			f.animate(
				[{ transform: 'none' }, { transform: `translateY(-${AMPLITUDA[k]}em)`, offset: 0.35 }, { transform: 'none' }],
				{ duration: 650, delay: k * 60, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
			);
		});
	}

	h1.addEventListener('pointermove', moure);
	h1.addEventListener('pointerleave', escantir);
	h1.addEventListener('pointerover', sautar);
	addEventListener('scroll', escantir, { passive: true });

	return {
		update(o) {
			forma = o?.forma ?? 'fanal';
			escantir();
		},
		destroy() {
			h1.removeEventListener('pointermove', moure);
			h1.removeEventListener('pointerleave', escantir);
			h1.removeEventListener('pointerover', sautar);
			removeEventListener('scroll', escantir);
		}
	};
}
