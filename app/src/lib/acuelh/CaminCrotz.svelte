<script>
	// Le chemin de S'apren avec la croix du logo dans chaque rond, « version plus fine » (retour de
	// Romain, 2026-11-04 : la variante C, rond d'or et croix rouge, faisait lourd et « amateur » ;
	// l'idée, une croix qui se charge pour finir pleine, était la bonne). Ici la croix reste seule,
	// dans les couleurs du logo (jetons --logo-* d'app.css, charte §1 bis), dans un rond de verre
	// fumé cerclé d'un filet d'or ; le chemin devient un filet qui relie les ronds (le « ligam »).
	// Trois façons de la charger, au choix de Romain (revue de Joan, 2026-11-04) :
	//   « hybride »       un filet d'or fait le tour du rond et allume les douze points à son passage,
	//                     puis le moyeu, les rayons et les arcs les relient ;
	//   « balayage »      le même tour, avec une aiguille d'or : la croix se dessine derrière elle ;
	//   « constellation » les points arrivent seuls, puis se relient (rayons, arcs), puis le filet se
	//                     referme.
	// Chaque rond à son tour, le chemin se trace de l'un à l'autre ; tout finit en moins de 5 s
	// (critère RGAA 13.8). État final (aussi sans animation) : croix complète, filet fermé. Les
	// animations ne se jouent que sous une classe « anim » (posée hors « moins d'animation ») puis
	// « vist » (posée quand la section est à l'écran), comme le reste de l'accueil.
	import { ARC_LISTE, ARC_POINTS, CAMIN_ROND, PONCHS, RAI_LISTE, RAI_POINTS, segmentsCamin } from './crotz-geometria.js';

	let { variant = 'hybride', gran = false } = $props();

	const R = 15; // rayon des ronds
	const S = 11.2; // échelle de la croix (de rayon 1) dans le rond : 2,2 unités de blanc jusqu'au filet
	const VIA = segmentsCamin(R, 2.2);
	// un arc se trace quand son second point (dans l'ordre du tour) est allumé ; l'arc 11 → 0 ferme le tour
	const ARC_K = ARC_POINTS.map(([a, b]) => Math.max(a, b));
	// où naît chaque point dans la variante « constellation » : plus loin du centre, un peu de côté
	const DERIVE = PONCHS.map(([x, y], k) => {
		const s = k % 2 ? 1 : -1;
		return [(0.5 * x - 0.16 * s * y).toFixed(2), (0.5 * y + 0.16 * s * x).toFixed(2)];
	});
</script>

<svg class="vis camin" class:gran class:v-hybride={variant === 'hybride'} class:v-balayage={variant === 'balayage'} class:v-constellation={variant === 'constellation'} viewBox="0 0 260 140" role="img" aria-hidden="true">
	<g class="via" fill="none">
		{#each VIA as d, i (i)}
			<path {d} pathLength="1" style="--i: {i}" />
		{/each}
	</g>
	{#each CAMIN_ROND as nd, n (n)}
		<g class="rond" style="--n: {n}" transform="translate({nd.x} {nd.y})">
			<circle class="verre" r={R} />
			<circle class="piste" r={R} />
			<circle class="anell" r={R} pathLength="1" transform="rotate(-90)" />
			<g transform="scale({S})">
				<g class="crotz">
					{#each RAI_LISTE as d, i (i)}
						<path class="rai" {d} pathLength="1" style="--k: {RAI_POINTS[i]}; --i: {i}" />
					{/each}
					{#each ARC_LISTE as d, i (i)}
						<path class="arc" {d} pathLength="1" style="--k: {ARC_K[i]}; --i: {i}" />
					{/each}
					<circle class="moieu" r="0.124" />
					{#each PONCHS as [x, y], k (k)}
						<circle class="ponch" cx={x} cy={y} r="0.109" style="--k: {k}; --ox: {DERIVE[k][0]}; --oy: {DERIVE[k][1]}" />
					{/each}
				</g>
			</g>
			{#if variant === 'balayage'}
				<g class="tete"><circle cx="0" cy={-R} r="0.8" /></g>
			{/if}
		</g>
	{/each}
</svg>

<style>
	/* ——— le composant ne décide pas du thème : la croix lit les jetons du logo (--logo-traç, --logo-ponch,
	   --logo-moieu), le décor lit --cc-verre, --cc-anell, --cc-piste et --cc-via ; le parent les règle
	   (valeurs de repli : fond sombre). Un seul poids de trait, 0,7 unité (celui du logo). ——— */
	.camin {
		--t0: 0.3s; /* attente avant le premier rond */
		--pas: 1s; /* d'un rond au suivant */
		--duree: 1.1s; /* un tour de filet */
		--sortie: cubic-bezier(0.16, 1, 0.3, 1);
		--doux: cubic-bezier(0.45, 0.05, 0.2, 1);
		overflow: visible;
	}
	.camin.v-hybride,
	.camin.v-constellation {
		--pas: 0.95s;
	}
	.rond {
		--T: calc(var(--t0) + var(--n) * var(--pas)); /* début de ce rond */
	}

	/* ——— l'état final : sans animation (moins d'animation, sans JavaScript) ou une fois chargé ——— */
	.via path {
		stroke: var(--cc-via, #eeaf34);
		stroke-width: 0.7;
		stroke-linecap: round;
	}
	.verre {
		fill: var(--cc-verre, rgba(34, 16, 10, 0.62));
	}
	.piste {
		fill: none;
		stroke: var(--cc-piste, rgba(238, 175, 52, 0.34));
		stroke-width: 0.7;
	}
	.anell {
		fill: none;
		stroke: var(--cc-anell, #eeaf34);
		stroke-width: 0.7;
		stroke-linecap: round;
	}
	.rai,
	.arc {
		fill: none;
		stroke: var(--logo-traç, #ffffff);
		stroke-width: 0.063;
		stroke-linecap: round;
	}
	.ponch {
		fill: var(--logo-ponch, #ffd47f);
		transform-box: fill-box;
		transform-origin: center;
	}
	.moieu {
		fill: var(--logo-moieu, #eeaf34);
		transform-box: fill-box;
		transform-origin: center;
	}
	.tete {
		opacity: 0;
		transform-box: view-box;
		transform-origin: 0 0;
	}
	.tete circle {
		fill: var(--logo-ponch, #ffd47f);
	}

	/* ——— avant le chargement (l'animation est permise) : rien que les ronds et leur piste ——— */
	:global(.anim) .via path,
	:global(.anim) .rai,
	:global(.anim) .arc,
	:global(.anim) .anell {
		stroke-dasharray: 1 2;
		stroke-dashoffset: 1.05;
	}
	:global(.anim) .ponch,
	:global(.anim) .moieu {
		transform: scale(0);
	}
	:global(.anim) .verre {
		opacity: 0;
	}

	/* ——— le chemin se trace de rond en rond, un peu avant que le rond suivant ne commence ——— */
	:global(.anim .vist) .via path {
		animation: tracer 0.85s var(--doux) calc(var(--t0) + var(--i) * var(--pas) + 0.45s) forwards;
	}
	/* le rond de verre s'éveille un peu avant que son tour ne commence */
	:global(.anim .vist) .verre {
		animation: apparaitre 0.5s ease-out calc(var(--T) - 0.15s) forwards;
	}
	/* le tour du filet, commun à « hybride » et « balayage » : les points s'allument à son passage */
	:global(.anim .vist) .v-hybride .anell,
	:global(.anim .vist) .v-balayage .anell {
		animation: tracer var(--duree) linear var(--T) forwards;
	}
	:global(.anim .vist) .v-hybride .ponch,
	:global(.anim .vist) .v-balayage .ponch {
		animation: naitre 0.5s var(--sortie) calc(var(--T) + var(--k) * var(--duree) / 12) forwards;
	}

	/* ——— « hybride » : le tour allume les points, puis le moyeu, les rayons et les arcs les relient ——— */
	:global(.anim .vist) .v-hybride .moieu {
		animation: naitre 0.5s var(--sortie) calc(var(--T) + 0.8s) forwards;
	}
	:global(.anim .vist) .v-hybride .rai {
		animation: tracer 0.5s var(--sortie) calc(var(--T) + 0.85s + var(--i) * 0.045s) forwards;
	}
	:global(.anim .vist) .v-hybride .arc {
		animation: tracer 0.4s var(--sortie) calc(var(--T) + 1.1s + var(--i) * 0.04s) forwards;
	}

	/* ——— « balayage » : une aiguille d'or fait le tour, la croix se dessine derrière elle ——— */
	:global(.anim .vist) .v-balayage .tete {
		animation: balayer var(--duree) linear var(--T) forwards;
	}
	:global(.anim .vist) .v-balayage .moieu {
		animation: naitre 0.5s var(--sortie) var(--T) forwards;
	}
	:global(.anim .vist) .v-balayage .rai {
		animation: tracer 0.5s var(--sortie) calc(var(--T) + var(--k) * var(--duree) / 12 - 0.12s) forwards;
	}
	:global(.anim .vist) .v-balayage .arc {
		animation: tracer 0.4s var(--sortie) calc(var(--T) + var(--k) * var(--duree) / 12) forwards;
	}

	/* ——— « constellation » : les points arrivent seuls, puis se relient, puis le filet se ferme ——— */
	:global(.anim .vist) .v-constellation .ponch {
		animation: deriver 0.85s cubic-bezier(0.33, 1, 0.68, 1) calc(var(--T) + var(--k) * 0.045s) forwards;
	}
	:global(.anim .vist) .v-constellation .moieu {
		animation: naitre 0.5s var(--sortie) calc(var(--T) + 0.5s) forwards;
	}
	:global(.anim .vist) .v-constellation .rai {
		animation: tracer 0.5s var(--sortie) calc(var(--T) + 0.55s + var(--i) * 0.045s) forwards;
	}
	:global(.anim .vist) .v-constellation .arc {
		animation: tracer 0.4s var(--sortie) calc(var(--T) + 0.85s + var(--i) * 0.04s) forwards;
	}
	:global(.anim .vist) .v-constellation .anell {
		animation: tracer 0.9s var(--doux) calc(var(--T) + 0.75s) forwards;
	}

	@keyframes tracer {
		from {
			stroke-dashoffset: 1.05;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes apparaitre {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes naitre {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes deriver {
		from {
			transform: translate(calc(var(--ox) * 1px), calc(var(--oy) * 1px)) scale(0);
		}
		to {
			transform: translate(0, 0) scale(1);
		}
	}
	@keyframes balayer {
		0% {
			transform: rotate(0deg);
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			transform: rotate(360deg);
			opacity: 0;
		}
	}
</style>
