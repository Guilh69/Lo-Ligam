<script module>
	// lu une fois par visite, même si la couche est démontée puis remontée
	const memoria = new Map();
	const memoriaElements = new Map();
</script>

<script>
	// La couche des effets Efièch sur le site public (gabarit racine, 2026-11-15) :
	// par-dessus la page quand Romain a publié un effet pour elle, et à
	// l'événement (réussite d'une séance). Le gabarit ne la charge que sur les
	// routes concernées (efiechSurRoute) ; le moteur n'est téléchargé que s'il y a
	// quelque chose de publié à jouer. Elle ne gêne pas les clics, est cachée des
	// lecteurs d'écran, et pose les pièces immobiles si l'appareil demande moins
	// d'animations (prefers-reduced-motion, géré par la bibliothèque).
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { emplacamentsDeRoute, clauDe, PAGINA, PREFIXE_ELEMENT } from './emplacaments.js';
	import { legir, couleursSite } from './legida.js';
	import { escotarEfiech, noeudsDe, escotarInscriccions } from './efiech.js';
	import { edicion } from '$lib/edicion/edicion.svelte.js';

	let zonaPagina = $state();
	let zonaEvenement = $state();

	// ce qui est publié, lu une fois par visite et par emplacement
	function cargar(id) {
		if (!memoria.has(id))
			memoria.set(
				id,
				supabase
					.from('pagina_elements')
					.select('oc')
					.eq('clau', clauDe(id))
					.eq('estat', 'publicat')
					.maybeSingle()
					.then(({ data, error }) => (error || !data ? null : legir(data.oc)))
					.catch(() => null)
			);
		return memoria.get(id);
	}

	const jogar = (zona, enr, extra = {}) =>
		import('./biblio/moteur.js').then(({ lancer }) =>
			lancer(zona, { ...enr.config, dessins: enr.dessin ? [enr.dessin] : [], couleurs: couleursSite(), ...extra })
		);

	// par-dessus la page : relancé à chaque changement de page
	$effect(() => {
		const id = page.route.id;
		const zona = zonaPagina;
		const [e] = emplacamentsDeRoute(id);
		if (!zona || !e) return;
		let effet = null;
		let fini = false;
		cargar(e.id).then((enr) => {
			if (!enr || fini) return;
			jogar(zona, enr).then((x) => (fini ? x.arreter() : (effet = x)));
		});
		return () => {
			fini = true;
			effet?.arreter();
		};
	});

	// une fois, puis s'efface (quatre secondes si Romain n'a pas fixé de durée de vie)
	async function unCop(enr, origine) {
		if (!zonaEvenement) return;
		const reglages = { ...enr.config.reglages };
		if (!(reglages.vie > 0)) reglages.vie = 4;
		let effet;
		let fin;
		const fait = new Promise((r) => (fin = r));
		const garde = setTimeout(() => (effet?.arreter(), fin()), (reglages.vie + 8) * 1000);
		effet = await jogar(zonaEvenement, { ...enr, config: { ...enr.config, reglages } }, { origine, auFin: () => (clearTimeout(garde), fin()) });
		return fait;
	}

	// à l'événement (réussite d'une séance)
	onMount(() =>
		escotarEfiech(async ({ id, origine }) => {
			const enr = await cargar(id);
			if (enr) unCop(enr, origine);
		})
	);

	// --- sur un élément d'une page (« cliquer l'élément », 15-11) : les effets
	// publiés pour les éléments de cette page, lus en une demande par visite
	function cargarElements(pagina) {
		// essai sans compte (« ?edicion=simular », poste de développement seulement) :
		// ce que l'atelier a gardé en simulation, dans le stockage de l'onglet
		if (import.meta.env.DEV && new URLSearchParams(location.search).get('edicion') === 'simular') {
			let l = [];
			try {
				l = JSON.parse(sessionStorage.getItem('efiech-simular') ?? '[]');
			} catch {
				// rien à essayer
			}
			return Promise.resolve(l.map((r) => ({ clau: r.clau.slice(PREFIXE_ELEMENT.length), enr: legir(r.oc) })).filter((x) => x.enr && x.clau.startsWith(pagina + '.')));
		}
		if (!memoriaElements.has(pagina))
			memoriaElements.set(
				pagina,
				supabase
					.from('pagina_elements')
					.select('clau,oc')
					.eq('pagina', PAGINA)
					.eq('estat', 'publicat')
					.like('clau', `${PREFIXE_ELEMENT}${pagina}.%`)
					.then(({ data, error }) =>
						error ? [] : (data ?? []).map((r) => ({ clau: r.clau.slice(PREFIXE_ELEMENT.length), enr: legir(r.oc) })).filter((x) => x.enr && x.clau.startsWith(pagina + '.'))
					)
					.catch(() => [])
			);
		return memoriaElements.get(pagina);
	}

	const centre = (node) => {
		const r = node.getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	};

	// accroche un effet à un nœud ; rend de quoi le décrocher
	function accrocher({ enr }, node) {
		let enCours = false;
		const jouer = (origine) => {
			// en mode Editar, un toucher ouvre le panneau : pas d'effet
			if (enCours || edicion.actiu) return;
			enCours = true;
			Promise.resolve(unCop(enr, origine ?? centre(node))).finally(() => (enCours = false));
		};
		if (enr.declencheur === 'clic') {
			const h = (e) => jouer(e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : null);
			node.addEventListener('click', h);
			return () => node.removeEventListener('click', h);
		}
		if (enr.declencheur === 'survol') {
			const h = () => jouer();
			node.addEventListener('pointerenter', h);
			return () => node.removeEventListener('pointerenter', h);
		}
		// à l'apparition : une fois par visite de la page
		const obs = new IntersectionObserver(
			(entrees) => {
				if (entrees.some((e) => e.isIntersecting)) {
					obs.disconnect();
					jouer();
				}
			},
			{ threshold: 0.5 }
		);
		obs.observe(node);
		return () => obs.disconnect();
	}

	$effect(() => {
		const pagina = edicion.pagina;
		if (!pagina) return;
		let fini = false;
		const decrocher = [];
		cargarElements(pagina).then((liste) => {
			if (fini || !liste.length) return;
			for (const x of liste) for (const n of noeudsDe(x.clau)) decrocher.push(accrocher(x, n));
			// les éléments qui arrivent plus tard (une liste qui se déplie)
			decrocher.push(
				escotarInscriccions((clau, n) => {
					const x = liste.find((y) => y.clau === clau);
					if (x && !fini) decrocher.push(accrocher(x, n));
				})
			);
		});
		return () => {
			fini = true;
			for (const f of decrocher) f();
		};
	});
</script>

<div class="efiech" bind:this={zonaPagina} aria-hidden="true"></div>
<div class="efiech" bind:this={zonaEvenement} aria-hidden="true"></div>

<style>
	.efiech {
		position: fixed;
		inset: 0;
		z-index: 900;
		pointer-events: none;
		overflow: hidden;
	}
</style>
