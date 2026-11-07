<script>
	// Le fond qui flotte (page d'essai /ensag/flotants, 2026-11-07) : deux pistes de Romain.
	//  - « confettis » : de tout petits morceaux de papier de couleur, nombreux, que la main écarte ;
	//  - « objets » : des objets en papier découpé (objets.js) qu'on peut faire virevolter et attraper :
	//    le mot occitan s'affiche, puis l'objet déguerpit et revient plus tard.
	// Décor : rien n'est lu par un lecteur d'écran, sauf le mot attrapé (zone « polie » cachée).
	// Rien ne bouge si l'appareil demande moins d'animations (les pièces sont juste posées).
	import { onMount, tick } from 'svelte';
	import { flotter } from './moteur.js';
	import { OBJETS } from './objets.js';
	import { TEINTES as T } from '$lib/styles/palette.js';

	let { mode = 'confettis', devant = false, onattrape = () => {} } = $props();

	let zone;
	let pieces = $state([]);
	let mot = $state(null);
	let annonce = $state('');
	let moteur = null;

	const FORMES = ['rond', 'carre', 'triangle', 'demi', 'carre'];
	const TEINTES = [T.rougeAction, T.or, T.bleu, T.olive, T.prune, T.brique, T.sarcelle, T.orangeClair];
	const confettis = (n, petit) => {
		let s = 29;
		const alea = () => (s = (s * 16807) % 2147483647) / 2147483647;
		return Array.from({ length: n }, (_, k) => ({
			forme: FORMES[k % FORMES.length],
			style: `--t: ${((5 + alea() * 6) * (petit ? 0.85 : 1)).toFixed(1)}px; --c: ${TEINTES[Math.floor(alea() * TEINTES.length)]}`
		}));
	};

	onMount(() => {
		const petit = innerWidth < 640;
		// sur un grand écran, chaque objet est en deux exemplaires : le fond reste vivant sans être chargé
		const copies = innerWidth >= 1100 ? 2 : 1;
		pieces = mode === 'objets' ? Array.from({ length: OBJETS.length * copies }, (_, k) => ({ ...OBJETS[k % OBJETS.length] })) : confettis(petit ? 56 : 110, petit);
		let arret = false;
		tick().then(() => {
			if (arret) return;
			const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on';
			const objets = mode === 'objets';
			moteur = flotter(zone, [...zone.querySelectorAll('.p')], {
				immobile: reduit,
				// les objets se laissent frôler sans fuir à toute vitesse : il faut pouvoir les attraper
				rayon: objets ? 70 : 95,
				rayonDoigt: objets ? 85 : 115,
				radial: objets ? 0.55 : 1.4,
				transfert: objets ? 0.07 : 0.12,
				collisions: objets,
				croisiere: objets ? [0.12, 0.3] : [0.1, 0.32],
				onAttrape: (p, c) => {
					const ob = pieces[p.i];
					mot = { oc: ob.oc, fr: ob.fr, x: Math.max(80, Math.min(c.L - 80, c.x)), haut: c.y < 100 ? c.y + 52 : c.y - 76 };
					annonce = `${ob.oc} : ${ob.fr}`;
					onattrape(ob);
				},
				onLache: () => {
					mot = null;
				}
			});
		});
		return () => {
			arret = true;
			moteur?.arreter();
		};
	});

	const attraper = (k) => {
		if (moteur) moteur.attraper(moteur.pieces[k]);
	};
</script>

<div class="couche" class:devant={devant && mode === 'objets'} class:objets={mode === 'objets'} bind:this={zone} aria-hidden="true">
	{#each pieces as c, k (k)}
		{#if mode === 'objets'}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="p o" onclick={() => attraper(k)}>
				<svg viewBox="0 0 48 48" focusable="false">{@html c.svg}</svg>
			</div>
		{:else}
			<i class="p c" style={c.style}><b class={c.forme}></b></i>
		{/if}
	{/each}
	{#if mot}
		<div class="mot" style="left: {mot.x}px; top: {mot.haut}px"><b lang="oc">{mot.oc}</b><small>{mot.fr}</small></div>
	{/if}
</div>
<p class="sr" aria-live="polite">{annonce}</p>

<style>
	.couche {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.couche.devant {
		z-index: 60;
	}
	/* ── les confettis : du papier découpé, tout petit ── */
	.c {
		display: block;
		width: var(--t);
		height: var(--t);
		filter: drop-shadow(0 1.5px 1px rgba(20, 10, 5, 0.28));
	}
	.c b {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--c);
	}
	.c .rond {
		border-radius: 50%;
	}
	.c .carre {
		border-radius: 1.5px;
	}
	.c .triangle {
		clip-path: polygon(50% 6%, 100% 94%, 0 94%);
	}
	.c .demi {
		height: 50%;
		border-radius: 999px 999px 0 0;
	}
	/* ── les objets : des pièces pleines, ombre courte, qu'on peut toucher ── */
	.o {
		--t: 44px;
		width: var(--t);
		height: var(--t);
		pointer-events: auto;
		cursor: pointer;
		filter: drop-shadow(0 3px 2px rgba(20, 10, 5, 0.3));
		-webkit-tap-highlight-color: transparent;
	}
	@media (max-width: 40rem) {
		.o {
			--t: 38px;
		}
	}
	/* une zone à toucher plus large que le dessin : un doigt attrape plus facilement */
	.o::before {
		content: '';
		position: absolute;
		inset: -10px;
	}
	.o svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	/* ── le mot attrapé : une pièce d'ocre, comme les pièces « choisies » du site ── */
	.mot {
		position: absolute;
		display: grid;
		justify-items: center;
		gap: 0.1rem;
		padding: 0.45rem 1rem 0.5rem;
		border-radius: 12px;
		background: var(--pc-or-fons, #c7811b);
		color: var(--pc-or-tinta, #2a1a10);
		box-shadow: 0 4px 5px var(--pc-ombre, rgba(20, 10, 5, 0.32));
		transform: translateX(-50%);
		animation: sortir 0.28s cubic-bezier(0.2, 1.4, 0.4, 1) both;
		white-space: nowrap;
	}
	.mot b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		line-height: 1.05;
	}
	.mot small {
		font-size: 0.78rem;
		font-weight: 700;
		opacity: 0.8;
	}
	@keyframes sortir {
		from {
			opacity: 0;
			transform: translateX(-50%) scale(0.6);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mot {
			animation: none;
		}
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
