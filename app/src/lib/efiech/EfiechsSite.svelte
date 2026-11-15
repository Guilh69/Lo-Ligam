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
	import { emplacamentsDeRoute, clauDe } from './emplacaments.js';
	import { legir, couleursSite } from './legida.js';
	import { escotarEfiech } from './efiech.js';

	let zonaPagina = $state();
	let zonaEvenement = $state();

	// ce qui est publié, lu une fois par visite et par emplacement
	const memoria = new Map();
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

	// à l'événement : joue une fois et s'efface (quatre secondes si Romain n'a pas fixé de durée de vie)
	onMount(() =>
		escotarEfiech(async ({ id, origine }) => {
			const enr = await cargar(id);
			if (!enr || !zonaEvenement) return;
			const reglages = { ...enr.config.reglages };
			if (!(reglages.vie > 0)) reglages.vie = 4;
			let effet;
			const garde = setTimeout(() => effet?.arreter(), (reglages.vie + 8) * 1000);
			effet = await jogar(zonaEvenement, { ...enr, config: { ...enr.config, reglages } }, { origine, auFin: () => clearTimeout(garde) });
		})
	);
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
