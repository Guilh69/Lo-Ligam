// L'action « editar » (édition sur place, 2026-10-24) : posée sur chaque
// élément modifiable de la page, avec sa clé. Hors édition, elle ne fait rien.
// En mode édition : l'élément se surligne au survol, un toucher ouvre le
// panneau (sans suivre le lien), l'élément caché reste là, estompé.
import { edicion, element, causir } from './edicion.svelte.js';

export function editar(node, clau) {
	// (la clé peut changer, par exemple quand une liste se réordonne)
	let c = $state(clau);
	// (un bloc contient des éléments : seul le plus proche du toucher répond)
	const mien = (e) => e.target instanceof Element && e.target.closest('.ed') === node;
	const clic = (e) => {
		if (!edicion.actiu || !mien(e)) return;
		e.preventDefault();
		e.stopPropagation();
		causir(c, node);
	};
	const clavièr = (e) => {
		if (!edicion.actiu || (e.key !== 'Enter' && e.key !== ' ') || !mien(e)) return;
		e.preventDefault();
		causir(c, node);
	};
	node.addEventListener('click', clic, true);
	node.addEventListener('keydown', clavièr);
	// (le tabindex posé pour l'édition est retiré en sortant : rien ne reste
	// focusable qui ne l'était pas)
	const sensTabindex = !node.hasAttribute('tabindex');

	// pour l'administrateur, l'élément porte sa clé : une note du talhièr
	// (lib/talhier) s'y accroche et le retrouve
	$effect(() => {
		if (edicion.admin) node.setAttribute('data-clau', c);
		else node.removeAttribute('data-clau');
	});

	$effect(() => {
		const actiu = edicion.actiu;
		node.classList.toggle('ed', actiu);
		node.classList.toggle('ed-causit', actiu && edicion.causit === c);
		node.classList.toggle('ed-amagat', actiu && element(c)?.visible === false);
		node.classList.toggle('ed-brolhon', actiu && !!edicion.brolhons[c]);
		if (actiu) {
			node.setAttribute('data-ed', c);
			node.setAttribute('role', 'button');
			node.setAttribute('aria-label', (document.documentElement.lang === 'fr' ? 'Modifier : ' : 'Modificar : ') + (node.textContent ?? '').trim().slice(0, 60));
			if (sensTabindex) node.setAttribute('tabindex', '0');
		} else {
			node.removeAttribute('data-ed');
			node.removeAttribute('role');
			node.removeAttribute('aria-label');
			if (sensTabindex) node.removeAttribute('tabindex');
		}
	});

	return {
		update(nòu) {
			c = nòu;
		},
		destroy() {
			node.removeEventListener('click', clic, true);
			node.removeEventListener('keydown', clavièr);
		}
	};
}
