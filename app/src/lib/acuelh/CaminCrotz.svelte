<script>
	// Le chemin de S'apren avec la croix du logo dans chaque rond, « version plus fine » (retour de
	// Romain, 2026-11-04 : la variante C, rond d'or et croix rouge, faisait lourd et « amateur » ;
	// l'idée, une croix qui se charge pour finir pleine, était la bonne). La croix reste seule, dans
	// les couleurs du logo (jetons --logo-* d'app.css, charte §1 bis), dans un rond de verre fumé
	// cerclé d'un filet d'or ; le chemin devient un filet qui relie les ronds (le « ligam »).
	//
	// Les quatre ronds sont quatre niveaux (Romain, 2026-11-04 : « il faut qu'on comprenne que le
	// premier, on est débutant, et ensuite on arrive à une croix avec les belles couleurs et pleine ») :
	// 3, 6, 9 puis 12 points allumés, le cercle tracé d'autant, rayons et arcs seulement entre points
	// allumés, les autres points restant de petites perles ; le dernier rond est la croix pleine, avec
	// un double cercle. Le déroulé (instants, durées) vient de camin-plan.js.
	//
	// Trois façons de charger, au choix de Romain (revue de Joan, 2026-11-04) :
	//   « hybride »       un filet d'or fait le tour du rond et allume les points à son passage,
	//                     puis le moyeu, les rayons et les arcs les relient ;
	//   « balayage »      le même tour, avec une aiguille d'or : la croix se dessine derrière elle ;
	//   « constellation » les points arrivent seuls, puis se relient, puis le filet se ferme.
	// Chaque rond à son tour, le chemin se trace de l'un à l'autre ; tout finit en moins de 5 s
	// (critère RGAA 13.8). État final (aussi sans animation) : les quatre niveaux. Les animations ne
	// se jouent que sous une classe « anim » (posée hors « moins d'animation ») puis « vist » (posée
	// quand la section est à l'écran), comme le reste de l'accueil.
	import { ARC_LISTE, CAMIN_ROND, PONCHS, RAI_LISTE, segmentsCamin } from './crotz-geometria.js';
	import { plan } from './camin-plan.js';

	let { variant = 'hybride', gran = false } = $props();

	const R = 15; // rayon des ronds
	const S = 11.2; // échelle de la croix (de rayon 1) dans le rond : 2,2 unités de blanc jusqu'au filet
	const R_BUT = R + 2.6; // le double cercle de la croix pleine
	const VIA = segmentsCamin([R, R, R, R_BUT], 2.2);
	const P = $derived(plan(variant));
	// où naît chaque point dans la variante « constellation » : plus loin du centre, un peu de côté
	const DERIVE = PONCHS.map(([x, y], k) => {
		const s = k % 2 ? 1 : -1;
		return [(0.5 * x - 0.16 * s * y).toFixed(2), (0.5 * y + 0.16 * s * x).toFixed(2)];
	});
	// instant et durée d'un élément, en variables CSS
	const st = (o) => `--d: ${o.d.toFixed(3)}s; --u: ${o.u.toFixed(3)}s`;
</script>

<svg class="vis camin" class:gran class:v-hybride={variant === 'hybride'} class:v-balayage={variant === 'balayage'} class:v-constellation={variant === 'constellation'} viewBox="0 0 260 140" role="img" aria-hidden="true">
	<g class="via" fill="none">
		{#each VIA as d, i (i)}
			<path {d} pathLength="1" style={st(P.via[i])} />
		{/each}
	</g>
	{#each P.ronds as r, n (n)}
		<g class="rond" transform="translate({CAMIN_ROND[n].x} {CAMIN_ROND[n].y})" style="--f: {r.f.toFixed(4)}; --o: {(1 - r.f).toFixed(4)}; --a: {(r.f * 360).toFixed(1)}deg">
			<circle class="verre" r={R} style={st(r.verre)} />
			<circle class="piste" r={R} />
			<circle class="anell" r={R} pathLength="1" transform="rotate(-90)" style={st(r.anell)} />
			{#if r.but}<circle class="but" r={R_BUT} pathLength="1" transform="rotate(-90)" style={st(r.but)} />{/if}
			<g transform="scale({S})">
				<g class="crotz">
					{#each r.rais as o (o.i)}
						<path class="rai" d={RAI_LISTE[o.i]} pathLength="1" style={st(o)} />
					{/each}
					{#each r.arcs as o (o.i)}
						<path class="arc" d={ARC_LISTE[o.i]} pathLength="1" style={st(o)} />
					{/each}
					<circle class="moieu" r="0.124" style={st(r.hub)} />
					{#each PONCHS as [x, y], k (k)}
						{@const o = r.ponchs[k]}
						<circle class="ponch" class:eteint={!o.on} cx={x} cy={y} r="0.109" style={o.on ? `${st(o)}; --ox: ${DERIVE[k][0]}; --oy: ${DERIVE[k][1]}` : undefined} />
					{/each}
				</g>
			</g>
			{#if r.tete}
				<g class="tete" style={st(r.tete)}><circle cx="0" cy={-R} r="0.8" /></g>
			{/if}
		</g>
	{/each}
</svg>

<style>
	/* ——— le composant ne décide pas du thème : la croix lit les jetons du logo (--logo-traç, --logo-ponch,
	   --logo-moieu), le décor lit --cc-verre, --cc-anell, --cc-piste et --cc-via ; le parent les règle
	   (valeurs de repli : fond sombre). Un seul poids de trait, 0,7 unité (celui du logo). ——— */
	.camin {
		--sortie: cubic-bezier(0.16, 1, 0.3, 1);
		--doux: cubic-bezier(0.45, 0.05, 0.2, 1);
		overflow: visible;
	}

	/* ——— l'état final : les quatre niveaux, sans animation (moins d'animation, sans JavaScript) ou une fois chargé ——— */
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
		stroke: var(--cc-piste, rgba(238, 175, 52, 0.26));
		stroke-width: 0.7;
	}
	/* le cercle est tracé d'autant que le niveau : --o = 1 moins la part tracée, déjà calculé par le composant
	   (un calc() dans une image-clé ne s'interpole pas avec la valeur de départ : le cercle surgissait d'un coup) */
	.anell {
		fill: none;
		stroke: var(--cc-anell, #eeaf34);
		stroke-width: 0.7;
		stroke-linecap: round;
		stroke-dasharray: 1 2;
		stroke-dashoffset: var(--o, 0);
	}
	.but {
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
	/* un point pas encore allumé reste une petite perle */
	.ponch.eteint {
		transform: scale(0.28);
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

	/* ——— avant le chargement (l'animation est permise) : les ronds, leur piste et les perles ——— */
	:global(.anim) .via path,
	:global(.anim) .rai,
	:global(.anim) .arc,
	:global(.anim) .but {
		stroke-dasharray: 1 2;
		stroke-dashoffset: 1.05;
	}
	:global(.anim) .anell {
		stroke-dashoffset: 1.05;
	}
	:global(.anim) .ponch:not(.eteint),
	:global(.anim) .moieu {
		transform: scale(0);
	}
	:global(.anim) .verre {
		opacity: 0;
	}

	/* ——— le déroulé : instant (--d) et durée (--u) de chaque élément viennent de camin-plan.js ——— */
	:global(.anim .vist) .via path {
		animation: tracer var(--u) var(--doux) var(--d) forwards;
	}
	:global(.anim .vist) .verre {
		animation: apparaitre var(--u) ease-out var(--d) forwards;
	}
	:global(.anim .vist) .anell {
		animation: jauger var(--u) linear var(--d) forwards;
	}
	:global(.anim .vist) .v-constellation .anell {
		animation-timing-function: var(--doux);
	}
	:global(.anim .vist) .but {
		animation: tracer var(--u) var(--doux) var(--d) forwards;
	}
	:global(.anim .vist) .rai,
	:global(.anim .vist) .arc {
		animation: tracer var(--u) var(--sortie) var(--d) forwards;
	}
	:global(.anim .vist) .moieu,
	:global(.anim .vist) .ponch:not(.eteint) {
		animation: naitre var(--u) var(--sortie) var(--d) forwards;
	}
	:global(.anim .vist) .v-constellation .ponch:not(.eteint) {
		animation-name: deriver;
		animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}
	:global(.anim .vist) .tete {
		animation: balayer var(--u) linear var(--d) forwards;
	}

	@keyframes tracer {
		from {
			stroke-dashoffset: 1.05;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes jauger {
		from {
			stroke-dashoffset: 1.05;
		}
		to {
			stroke-dashoffset: var(--o);
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
			transform: rotate(var(--a));
			opacity: 0;
		}
	}
</style>
