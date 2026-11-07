<script>
	// Le fond qui flotte (page d'essai /ensag/flotants, 2026-11-07) : deux pistes de Romain.
	//  - « confettis » : de tout petits morceaux de papier de couleur, que la main écarte ;
	//  - « objets » : des objets en papier découpé (objets.js) qu'on peut faire virevolter et attraper :
	//    le mot occitan s'affiche, puis l'objet déguerpit et revient plus tard.
	// Retour de Romain (08-11) : « ça a parasité beaucoup trop le fond, il faut que ce soit en arrière » :
	// la couche est derrière tout le contenu, pâlie et petite ; on attrape un objet en cliquant ou en
	// touchant l'endroit où on le voit, même sous du texte (le clic passe au contenu comme d'habitude,
	// et un objet est attrapé s'il est là ; jamais quand on clique un lien, un bouton ou un champ).
	// Décor : rien n'est lu par un lecteur d'écran, sauf le mot attrapé (zone « polie » cachée).
	// Rien ne bouge si l'appareil demande moins d'animations (les pièces sont juste posées).
	import { onMount, tick } from 'svelte';
	import { flotter } from './moteur.js';
	import { OBJETS } from './objets.js';
	import { TEINTES as T } from '$lib/styles/palette.js';

	let { mode = 'confettis', onattrape = () => {} } = $props();

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
			style: `--t: ${((4 + alea() * 5) * (petit ? 0.85 : 1)).toFixed(1)}px; --c: ${TEINTES[Math.floor(alea() * TEINTES.length)]}`
		}));
	};

	onMount(() => {
		const petit = innerWidth < 640;
		pieces = mode === 'objets' ? OBJETS.map((o) => ({ ...o })) : confettis(petit ? 46 : 90, petit);
		let arret = false;
		let toucher = null;
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
			if (objets && !reduit) {
				toucher = (e) => {
					// un lien, un bouton, un champ : on ne touche pas au jeu
					if (e.target.closest?.('a, button, input, select, textarea, label, summary, [role="button"], [contenteditable]')) return;
					if (getSelection()?.toString()) return;
					moteur?.attraperA(e.clientX, e.clientY);
				};
				addEventListener('click', toucher);
			}
		});
		return () => {
			arret = true;
			if (toucher) removeEventListener('click', toucher);
			moteur?.arreter();
		};
	});
</script>

<div class="couche" class:objets={mode === 'objets'} bind:this={zone} aria-hidden="true">
	{#each pieces as c, k (k)}
		{#if mode === 'objets'}
			<div class="p o">
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
	/* derrière tout : le contenu des pages est au-dessus et reçoit les clics */
	.couche {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}
	/* ── les confettis : du papier découpé, tout petit et pâli ── */
	.c {
		display: block;
		width: var(--t);
		height: var(--t);
		opacity: 0.6;
		filter: drop-shadow(0 1.5px 1px rgba(20, 10, 5, 0.25));
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
	/* ── les objets : des pièces pleines, ombre courte, un peu pâlies ── */
	.o {
		--t: 36px;
		width: var(--t);
		height: var(--t);
		opacity: 0.72;
		filter: drop-shadow(0 2px 1.5px rgba(20, 10, 5, 0.25));
	}
	@media (max-width: 40rem) {
		.o {
			--t: 32px;
		}
	}
	.o svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	/* ── le mot attrapé : une pièce d'ocre, bien lisible, comme les pièces « choisies » du site ── */
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
