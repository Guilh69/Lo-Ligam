<script>
	// L'illustration de chaque famille de jeux : elle montre le jeu lui-même
	// (Romain, 06-11 : « des illustrations libres, cohérentes entre elles, qui
	// montrent vraiment le type de jeu » ; manière B, « papier découpé », choisie
	// sur l'essai /ensag/illustracions-jocs). Des pièces pleines posées sur la
	// carte, une ombre courte, le grain du papier.
	// Posée à même la carte ; le dessin bouge un peu, seulement quand il
	// est à l'écran, et seulement là où le mouvement dit le jeu (le serpent
	// ondule et la tuile tombe dans le panier, la loupe cherche, une carte se
	// retourne, la voix sonne ; les mots croisés, déjà clairs, ne bougent pas).
	// Rien ne bouge si l'appareil demande moins d'animations.
	// Décoratif : rien à lire pour un lecteur d'écran (le nom de la famille suit).
	// Le coin bas à droite (x > 344, y > 248) reste vide : le rond « IA » s'y pose
	// (Romain, 06-11 : « pas en conflit avec l'image »).
	// Les anciennes affiches de paysage (Afica.svelte) restent dans le code, et
	// les tableaux peints dans design-stock/pinturas, pour un autre usage.
	import { onMount } from 'svelte';

	let { id } = $props();
	const uid = $props.id();
	let vista = $state(true);
	let cadre;

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') return;
		const o = new IntersectionObserver(([e]) => (vista = e.isIntersecting));
		o.observe(cadre);
		return () => o.disconnect();
	});
</script>

<div
	bind:this={cadre}
	class="illus i-{id}"
	class:pausa={!vista}
	aria-hidden="true"
>
	<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" focusable="false">
		<defs>
			<!-- le grain du papier, seulement sur les pièces -->
			<filter id="gra-{uid}" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
				<feColorMatrix type="saturate" values="0" />
				<feComponentTransfer result="gra">
					<feFuncR type="linear" slope="0.2" intercept="0.88" />
					<feFuncG type="linear" slope="0.2" intercept="0.88" />
					<feFuncB type="linear" slope="0.2" intercept="0.88" />
				</feComponentTransfer>
				<feBlend in="SourceGraphic" in2="gra" mode="multiply" />
				<feComposite in2="SourceGraphic" operator="in" />
			</filter>
		</defs>
		<!-- tout le dessin un peu resserré vers le haut à gauche : le coin du rond reste libre -->
		<g class="pecas" filter="url(#gra-{uid})" transform="translate(190 140) scale(0.94) translate(-190 -140)">
			{#if id === 'adreca'}
				<!-- le serpent : sa queue a déjà écrit L I G A, il va manger le M ;
				     à côté, le panier où tombe une tuile -->
				<path class="l pontilh" d="M262 104 Q288 82 300 80" />
				<!-- loin du coin bas à droite, où se pose le rond « IA » -->
				<g transform="translate(-34 -16)">
					<path class="l pontilh" d="M338 150 V176" />
					<g class="tomba">
						<rect class="f" x="322" y="180" width="32" height="32" rx="7" transform="rotate(-8 338 196)" />
					</g>
					<path class="f2" d="M294 222 H382 L371 272 H305 Z" />
					<path class="c" d="M298 238 H378 M302 255 H374 M324 222 L322 272 M352 222 L354 272" />
				</g>
				{#each [['L', 52, 214, 8], ['I', 100, 224, -4], ['G', 148, 208, -18], ['A', 189, 174, -32]] as [t, x, y, r], k (t)}
					<g class="onda" style="--k: {k}">
						<g transform="translate({x} {y}) rotate({r})">
							<rect class="f" x="-21" y="-21" width="42" height="42" rx="9" />
							<text class="t" y="8">{t}</text>
						</g>
					</g>
				{/each}
				<g class="onda" style="--k: 4">
					<g transform="translate(230 132) rotate(-38)">
						<path class="lenga" d="M31 0 H44 M44 0 l7 -5 M44 0 l7 5" />
						<path class="f" d="M-24 -18 C -6 -26 22 -22 32 -6 C 35 -2 35 2 32 6 C 22 22 -6 26 -24 18 C -30 10 -30 -10 -24 -18 Z" />
						<circle class="uelh" cx="12" cy="-8" r="4.4" />
					</g>
				</g>
				<g transform="translate(320 72) rotate(10)">
					<rect class="a" x="-22" y="-22" width="44" height="44" rx="9" />
					<text class="t ta" y="8">M</text>
				</g>
			{:else if id === 'mots'}
				<!-- mots croisés : MOT et LETRA se croisent sur le T -->
				<rect class="f2" x="230" y="175" width="46" height="46" rx="6" />
				<rect class="f2" x="130" y="175" width="46" height="46" rx="6" />
				<rect class="negre" x="280" y="125" width="46" height="46" rx="6" />
				<rect class="f2" x="230" y="125" width="46" height="46" rx="6" />
				{#each [['L', 180, 25], ['E', 180, 75], ['R', 180, 175], ['A', 180, 225], ['M', 80, 125], ['O', 130, 125]] as [t, x, y] (t + x + y)}
					<rect class="f" {x} {y} width="46" height="46" rx="6" />
					<text class="t" x={x + 23} y={y + 31}>{t}</text>
				{/each}
				<rect class="a" x="180" y="125" width="46" height="46" rx="6" />
				<text class="t ta" x="203" y="156">T</text>
			{:else if id === 'observacion'}
				<!-- où est-ce ? la loupe cherche dans la photo, et trouve l'arbre -->
				<g transform="rotate(-5 170 140)">
					<rect class="f" x="38" y="50" width="262" height="182" rx="6" />
					<path class="f2" d="M38 196 Q96 150 156 176 T300 160 V226 a6 6 0 0 1 -6 6 H44 a6 6 0 0 1 -6 -6 Z" />
					<circle class="a" cx="96" cy="94" r="15" />
				</g>
				<path class="l" d="M250 182 V204" />
				<circle class="f2" cx="250" cy="166" r="18" />
				<circle class="pontilh-a" cx="250" cy="176" r="34" />
				<g class="lopia">
					<circle class="verre" cx="252" cy="176" r="56" />
					<circle class="anel" cx="252" cy="176" r="56" />
					<path class="manga" d="M293 216 L334 256" />
				</g>
			{:else if id === 'memoria'}
				<!-- les paires : deux soleils pareils ; une carte se soulève et se
				     retourne (une goutte : pas la bonne), puis se recouche -->
				{#each [[62, 36], [262, 36], [162, 160]] as [x, y] (x + '-' + y)}
					<rect class="f3" {x} {y} width="78" height="100" rx="9" />
					<path class="c" d="M{x + 39} {y + 30} l14 20 l-14 20 l-14 -20 Z" />
				{/each}
				<g transform="rotate(-11 101 210) translate(-6 -10)">
					<g class="dos">
						<rect class="f3" x="62" y="160" width="78" height="100" rx="9" />
						<path class="c" d="M101 190 l14 20 l-14 20 l-14 -20 Z" />
					</g>
					<g class="cara">
						<rect class="f" x="62" y="160" width="78" height="100" rx="9" />
						<path class="a" d="M101 190 C 112 204 116 212 116 220 A15 15 0 0 1 86 220 C 86 212 90 204 101 190 Z" />
					</g>
				</g>
				<path class="l" d="M64 150 Q84 128 112 138" />
				<path class="l" d="M112 138 l-9 -6 M112 138 l-8 7" />
				{#each [[162, 36], [262, 160]] as [x, y] (x + '-' + y)}
					<rect class="f" {x} {y} width="78" height="100" rx="9" />
					<circle class="a" cx={x + 39} cy={y + 50} r="13" />
					<g class="rais">
						{#each [0, 45, 90, 135, 180, 225, 270, 315] as r (r)}
							<path d="M{x + 39} {y + 28} V{y + 22}" transform="rotate({r} {x + 39} {y + 50})" />
						{/each}
					</g>
				{/each}
				<path class="pontilh-a" d="M246 96 Q300 112 298 154" />
			{:else if id === 'escota'}
				<!-- écoute et choisis : la voix, trois réponses, la bonne en or -->
				<path class="f" d="M44 128 H72 L110 96 V204 L72 172 H44 Z" />
				<path class="l son" style="--k: 0" d="M130 122 Q146 150 130 178" />
				<path class="l son" style="--k: 1" d="M150 104 Q174 150 150 196" />
				<path class="l son" style="--k: 2" d="M170 86 Q202 150 170 214" />
				{#each [62, 127, 192] as y, k (y)}
					<rect class={k === 1 ? 'a' : 'f'} x="226" {y} width="140" height="46" rx="10" />
					<path
						class={k === 1 ? 'linha linha-a' : 'linha'}
						d="M244 {y + 18} H{k === 0 ? 330 : k === 1 ? 312 : 340} M244 {y + 30} H{k === 0 ? 296 : k === 1 ? 322 : 288}"
					/>
				{/each}
			{/if}
		</g>
	</svg>
</div>

<style>
	/* les couleurs : celles des cartes de la salle (Sala.svelte) */
	.illus {
		--fons: #b53d17;
		--clar: #fbf1e1;
		--aur: #ffd47f;
		--lletra: var(--fons);
		--tinta-aur: #2a1a10;
		--escur: color-mix(in oklab, var(--fons), #000 30%);
		--mitjan: color-mix(in oklab, var(--fons), #fff 30%);
		position: relative;
		aspect-ratio: 4 / 3;
	}
	.i-mots {
		--fons: #eeaf34;
		--clar: #fff8ea;
		--aur: #7a2e0c;
		--lletra: #2a1a10;
		--tinta-aur: #fbf1e1;
	}
	.i-observacion {
		--fons: #4f6a2f;
	}
	.i-memoria {
		--fons: #1f5f63;
	}
	.i-escota {
		--fons: #2b6496;
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}
	text {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 24px;
		text-anchor: middle;
	}

	.pecas > :global(*) {
		filter: drop-shadow(0 3px 2px rgba(20, 10, 5, 0.32));
	}
	.f {
		fill: var(--clar);
	}
	.f2 {
		fill: var(--escur);
	}
	.f3 {
		fill: var(--mitjan);
	}
	.negre {
		fill: color-mix(in oklab, var(--escur), #000 35%);
	}
	.t {
		fill: var(--lletra);
	}
	.ta {
		fill: var(--tinta-aur);
	}
	.a {
		fill: var(--aur);
	}
	.uelh {
		fill: var(--fons);
	}
	.l,
	.lenga {
		fill: none;
		stroke: var(--clar);
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.lenga {
		stroke: var(--aur);
	}
	.c {
		fill: none;
		stroke: var(--clar);
		stroke-width: 2;
		opacity: 0.5;
	}
	.rais path {
		stroke: var(--aur);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.verre {
		fill: color-mix(in oklab, var(--clar), transparent 78%);
	}
	.anel {
		fill: none;
		stroke: var(--clar);
		stroke-width: 11;
	}
	.manga {
		stroke: var(--clar);
		stroke-width: 18;
		stroke-linecap: round;
	}
	.linha {
		stroke: var(--fons);
		stroke-width: 5;
		stroke-linecap: round;
		opacity: 0.45;
	}
	.linha-a {
		stroke: var(--tinta-aur);
	}
	.pontilh,
	.pontilh-a {
		stroke-dasharray: 2 9;
	}
	.pontilh-a {
		fill: none;
		stroke: var(--aur);
		stroke-width: 4;
		stroke-linecap: round;
	}

	/* le dessin bouge, à peine */
	.onda {
		animation: illus-onda 3.4s ease-in-out infinite;
		animation-delay: calc(var(--k) * -0.32s);
	}
	.tomba {
		animation: illus-tomba 4.2s ease-in infinite;
	}
	.lopia {
		animation: illus-lopia 9s ease-in-out infinite;
	}
	.dos,
	.cara {
		transform-box: fill-box;
		transform-origin: center;
	}
	.cara {
		transform: scaleX(0);
	}
	.dos {
		animation: illus-dos 7s ease-in-out infinite;
	}
	.cara {
		animation: illus-cara 7s ease-in-out infinite;
	}
	.son {
		animation: illus-son 2.6s ease-in-out infinite;
		animation-delay: calc(var(--k) * 0.22s);
	}
	.pausa * {
		animation-play-state: paused !important;
	}
	@keyframes -global-illus-onda {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}
	@keyframes -global-illus-tomba {
		0% {
			transform: translateY(-26px);
			opacity: 0;
		}
		18% {
			opacity: 1;
		}
		62% {
			transform: translateY(0);
			opacity: 1;
		}
		80% {
			transform: translateY(26px);
			opacity: 0;
		}
		100% {
			transform: translateY(26px);
			opacity: 0;
		}
	}
	@keyframes -global-illus-lopia {
		0%,
		100% {
			transform: translate(0, 0);
		}
		30% {
			transform: translate(-30px, -12px);
		}
		60% {
			transform: translate(-10px, 14px);
		}
	}
	@keyframes -global-illus-dos {
		0%,
		30%,
		78%,
		100% {
			transform: scaleX(1);
		}
		36%,
		72% {
			transform: scaleX(0);
		}
	}
	@keyframes -global-illus-cara {
		0%,
		36%,
		72%,
		100% {
			transform: scaleX(0);
		}
		42%,
		66% {
			transform: scaleX(1);
		}
	}
	@keyframes -global-illus-son {
		0%,
		100% {
			opacity: 0.45;
		}
		40% {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.illus * {
			animation: none !important;
		}
	}
</style>
