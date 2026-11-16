// L'action « desplegar » (Romain, 16-11) : une rubrique repliée (<details>)
// s'ouvre et se replie en glissant, au lieu d'apparaître d'un coup. La hauteur
// suit le contenu, le texte arrive en fondu en descendant à peine ; un nouveau
// clic en cours de route repart de là où on en est, sans saut. Pendant le
// repli, la rubrique porte data-desplegar="plegar" (le signe moins peut
// redevenir plus tout de suite). Sans JavaScript, ou si le visiteur a demandé
// moins d'animations à son système, elle s'ouvre comme avant, d'un coup.
const DOBRIR = 'cubic-bezier(0.22, 1, 0.36, 1)'; // part vite, se pose en douceur
const PLEGAR = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function desplegar(details) {
	const summary = details.querySelector(':scope > summary');
	if (!summary) return;
	let anims = [];
	let cap = null; // null : au repos ; true : s'ouvre ; false : se replie

	const redusit = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const contengut = () => [...details.children].filter((n) => n !== summary);

	function arrestar() {
		for (const a of anims) a.cancel();
		anims = [];
	}
	function fin() {
		arrestar();
		details.style.overflow = '';
		delete details.dataset.desplegar;
		cap = null;
	}

	function anima(dobrir) {
		// d'où l'on part : la hauteur et l'opacité du moment, animation en cours comprise
		const de = details.getBoundingClientRect().height;
		const opacitats = contengut().map((n) => parseFloat(getComputedStyle(n).opacity));
		const venEntamat = cap !== null;
		arrestar();

		details.style.overflow = 'hidden';
		details.dataset.desplegar = dobrir ? 'dobrir' : 'plegar';
		if (dobrir) details.open = true;
		const s = getComputedStyle(details);
		const bords = parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth);
		const a = dobrir
			? details.getBoundingClientRect().height
			: summary.getBoundingClientRect().height + bords;

		// plus la rubrique est haute, plus elle prend son temps (sans traîner) ;
		// ralenti le 16-11, Romain trouvait la première version un peu rapide
		const distancia = Math.abs(a - de);
		const durada = Math.min(820, 420 + distancia * 0.75) * (dobrir ? 1 : 0.85);
		cap = dobrir;

		const h = details.animate(
			{ height: [`${de}px`, `${a}px`] },
			{ duration: durada, easing: dobrir ? DOBRIR : PLEGAR, fill: 'forwards' }
		);
		anims.push(h);
		contengut().forEach((n, i) => {
			const op = venEntamat ? opacitats[i] : dobrir ? 0 : 1;
			anims.push(
				dobrir
					? n.animate(
							{ opacity: [op, 1], transform: [op > 0 ? 'none' : 'translateY(-6px)', 'none'] },
							{ duration: durada, delay: venEntamat ? 0 : durada * 0.12, easing: DOBRIR, fill: 'backwards' }
						)
					: n.animate({ opacity: [op, 0] }, { duration: durada * 0.6, easing: PLEGAR, fill: 'forwards' })
			);
		});
		h.onfinish = () => {
			if (!dobrir) details.open = false;
			fin();
		};
	}

	function clic(ev) {
		if (ev.defaultPrevented || redusit()) return;
		ev.preventDefault();
		anima(!(cap ?? details.open));
	}
	summary.addEventListener('click', clic);

	return {
		destroy() {
			summary.removeEventListener('click', clic);
			fin();
		}
	};
}
