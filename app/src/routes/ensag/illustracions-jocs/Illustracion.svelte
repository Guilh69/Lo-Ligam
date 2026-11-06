<script>
	// Essai du 06-11 au soir : une illustration par famille de jeux, qui montre
	// le jeu lui-même (la demande de Romain : « des illustrations libres,
	// cohérentes entre elles, qui montrent vraiment le type de jeu »).
	// Le même dessin en deux manières : fil (un seul trait fin) et papier
	// (pièces découpées posées sur la carte). Les aplats doux ont été écartés
	// par Joan (le dégradé délavait les couleurs).
	let { id, estil = 'fil' } = $props();
</script>

<svg class="ill {estil}" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
	<g class="pecas">
		{#if id === 'adreca'}
			<!-- le serpent : sa queue a déjà écrit L I G A, il va manger le M -->
			<path class="l pontilh" d="M262 104 Q288 82 300 80" />
			{#each [['L', 52, 214, 8], ['I', 100, 224, -4], ['G', 148, 208, -18], ['A', 189, 174, -32]] as [t, x, y, r] (t)}
				<g transform="translate({x} {y}) rotate({r})">
					<rect class="f" x="-21" y="-21" width="42" height="42" rx="9" />
					<text class="t" y="8">{t}</text>
				</g>
			{/each}
			<g transform="translate(230 132) rotate(-38)">
				<path class="a lenga" d="M30 0 H44 M44 0 l7 -5 M44 0 l7 5" />
				<path class="f" d="M-24 -17 Q-4 -27 17 -15 Q33 -7 33 0 Q33 7 17 15 Q-4 27 -24 17 Q-31 0 -24 -17 Z" />
				<circle class="uelh" cx="11" cy="-8" r="4.4" />
			</g>
			<!-- le panier : une tuile tombe dedans -->
			<path class="l pontilh" d="M338 150 V176" />
			<g transform="translate(338 196) rotate(-8)">
				<rect class="f" x="-15" y="-15" width="30" height="30" rx="7" />
			</g>
			<path class="f2 cesta" d="M296 222 H380 L370 270 H306 Z" />
			<path class="c" d="M300 238 H376 M303 254 H373 M324 222 L322 270 M352 222 L354 270" />
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
			<!-- où est-ce ? la loupe cherche dans la photo -->
			<g transform="rotate(-5 170 140)">
				<rect class="f" x="38" y="50" width="262" height="182" rx="6" />
				<path class="f2" d="M38 196 Q96 150 156 176 T300 160 V226 a6 6 0 0 1 -6 6 H44 a6 6 0 0 1 -6 -6 Z" />
				<circle class="a" cx="96" cy="94" r="15" />
			</g>
			<circle class="verre" cx="252" cy="176" r="56" />
			<g class="arbre">
				<path class="l" d="M250 182 V204" />
				<circle class="plen" cx="250" cy="166" r="18" />
			</g>
			<circle class="l pontilh-a" cx="250" cy="176" r="34" />
			<circle class="anel" cx="252" cy="176" r="56" />
			<path class="manga" d="M293 216 L346 268" />
		{:else if id === 'memoria'}
			<!-- les paires : deux soleils pareils, une carte qu'on retourne -->
			{#each [[62, 36], [262, 36], [162, 160]] as [x, y] (x + '-' + y)}
				<rect class="f2 memoria-dos" {x} {y} width="78" height="100" rx="9" />
				<path class="c" d="M{x + 39} {y + 30} l14 20 l-14 20 l-14 -20 Z" />
			{/each}
			<!-- la carte qui se soulève pour se retourner -->
			<g transform="rotate(-11 101 210) translate(-6 -10)">
				<rect class="f2 leva" x="62" y="160" width="78" height="100" rx="9" />
				<path class="c" d="M101 190 l14 20 l-14 20 l-14 -20 Z" />
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
			<path class="l pontilh-a" d="M246 96 Q300 112 298 154" />
		{:else if id === 'escota'}
			<!-- écoute et choisis : la voix, trois réponses, la bonne en or -->
			<path class="f" d="M44 128 H72 L110 96 V204 L72 172 H44 Z" />
			<path class="l" d="M130 122 Q146 150 130 178" />
			<path class="l" d="M150 104 Q174 150 150 196" />
			<path class="l" d="M170 86 Q202 150 170 214" />
			{#each [62, 127, 192] as y, k (y)}
				<rect class={k === 1 ? 'a' : 'f'} x="226" y={y} width="140" height="46" rx="10" />
				<path class={k === 1 ? 'linha linha-a' : 'linha'} d="M244 {y + 18} H{k === 0 ? 330 : k === 1 ? 312 : 340} M244 {y + 30} H{k === 0 ? 296 : k === 1 ? 322 : 288}" />
			{/each}
		{/if}
	</g>
</svg>

<style>
	.ill {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	text {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 24px;
		text-anchor: middle;
	}

	/* fil : un seul trait fin, la couleur du texte, une touche d'or */
	.fil .f,
	.fil .f2,
	.fil .l,
	.fil .anel,
	.fil .linha {
		fill: none;
		stroke: var(--tinta);
		stroke-width: 3;
	}
	.fil .f2 {
		opacity: 0.6;
	}
	.fil .plen {
		fill: var(--tinta);
	}
	.fil .verre {
		fill: color-mix(in oklab, var(--tinta), transparent 84%);
	}
	.fil .negre {
		fill: var(--tinta);
		opacity: 0.55;
	}
	.fil .t,
	.fil .uelh {
		fill: var(--tinta);
	}
	.fil .a {
		fill: var(--aur);
	}
	.fil .ta {
		fill: var(--fons);
	}
	.fil .lenga {
		fill: none;
		stroke: var(--aur);
		stroke-width: 3;
	}
	.fil .c,
	.fil .rais {
		fill: none;
		stroke: var(--tinta);
		stroke-width: 2.2;
	}
	.fil .rais {
		stroke: var(--fons);
	}
	.fil .manga {
		stroke: var(--tinta);
		stroke-width: 3;
		fill: none;
	}
	.fil .linha-a {
		stroke: var(--fons);
	}

	/* papier : des pièces découpées, posées sur la carte, une ombre courte */
	.papier .pecas > * {
		filter: drop-shadow(0 3px 2px rgba(20, 10, 5, 0.32));
	}
	.papier .f {
		fill: var(--clar);
	}
	.papier .f2 {
		fill: var(--escur);
	}
	.papier .memoria-dos,
	.papier .f2.leva {
		fill: var(--mitjan);
	}
	.papier .plen {
		fill: var(--escur);
	}
	.papier .verre {
		fill: color-mix(in oklab, var(--clar), transparent 78%);
	}
	.papier .negre {
		fill: color-mix(in oklab, var(--escur), #000 35%);
	}
	.papier .t {
		fill: var(--lletra);
	}
	.papier .ta {
		fill: var(--tinta-aur);
	}
	.papier .a {
		fill: var(--aur);
	}
	.papier .uelh {
		fill: var(--fons);
	}
	.papier .l,
	.papier .lenga {
		fill: none;
		stroke: var(--clar);
		stroke-width: 4;
	}
	.papier .lenga {
		stroke: var(--aur);
	}
	.papier .c {
		fill: none;
		stroke: var(--clar);
		stroke-width: 2;
		opacity: 0.5;
	}
	.papier .rais {
		stroke: var(--aur);
		stroke-width: 3;
	}
	.papier .anel {
		fill: none;
		stroke: var(--clar);
		stroke-width: 11;
	}
	.papier .manga {
		stroke: var(--clar);
		stroke-width: 18;
	}
	.papier .linha {
		stroke: var(--fons);
		stroke-width: 5;
		opacity: 0.45;
	}
	.papier .linha-a {
		stroke: var(--tinta-aur);
	}

	.pontilh,
	.pontilh-a {
		stroke-dasharray: 2 9;
	}
	.pontilh-a {
		stroke: var(--aur) !important;
		fill: none;
	}
	path,
	.manga {
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
