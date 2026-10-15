<script>
	// Banc d'ensag de la « scèna » d'unitat (demanda de Romain, 2026-10-15) :
	// un visual Instagram de Romain en grand, cada objècte se toca, s'aluma e
	// mòstra son nom. La scèna completa dobrís l'unitat seguenta.
	// Proposicion : revisions/2026-10-15-parcours-univers-scenes.md. Pagina de
	// trabalh, pas indexada. Coordenadas dins l'espaci de l'imatge (860 × 860).
	// 2n passatge (retorn de Romain) : pas pus de caches ni de sagetas ; cada
	// objècte a un vel transparent de sa color, e l'etiqueta escricha pel site
	// pren la meteissa color (la color fa lo ligam, pas una sageta).
	import Icona from '$lib/components/Icona.svelte';

	// Version del visual sens etiquetas ni sagetas (fabricada per l'ensag ;
	// Romain la tornarà far dins Canva en amagant los tèxtes)
	const IMATGE = '/ensag/scena/ostal-net.webp';

	// Los mots e la prononciacion venon del visual de Romain.
	const OBJECTES = [
		{
			id: 'teulat',
			oc: 'Lo teulat',
			fr: 'Le toit',
			son: 'Lou téwlatt',
			color: '#3fd2c7',
			// lo teulat sens las doas finèstras de la teulada (traucs)
			clip: 'M300 280 L558 280 L655 420 L652 446 L213 446 L211 414 Z M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z',
			zonas: [[211, 280, 444, 166]],
			etiqueta: [70, 214]
		},
		{
			id: 'fenestras',
			oc: 'Las fenèstras',
			fr: 'Les fenêtres',
			son: 'Lass finèstross',
			nota: 'Ton visuel écrit « finèstras » ; lo Congrès ne connaît que « fenèstra » (languedocien), vérifié le 15-10. Coquille probable : à confirmer, et la prononciation avec.',
			color: '#ffd166',
			clip: 'M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z M294 472 H370 V575 H294 Z M485 472 H564 V575 H485 Z',
			zonas: [
				[326, 310, 78, 72],
				[456, 310, 78, 72],
				[294, 472, 76, 103],
				[485, 472, 79, 103]
			],
			// accrochada per la drecha (bord drech a 818 px), que dobrisca pas sul telefòn
			etiqueta: [818, 214, 'drecha']
		},
		{
			id: 'porta',
			oc: 'La pòrta',
			fr: 'La porte',
			son: 'La porto',
			color: '#c3a6ff',
			clip: 'M390 493 H455 V630 H390 Z',
			zonas: [[384, 488, 77, 146]],
			etiqueta: [330, 652]
		},
		{
			id: 'claus',
			oc: 'Las claus',
			fr: 'Les clefs',
			son: 'Lass klaws',
			color: '#8ee88f',
			clip: 'M764 758 H856 V846 H764 Z',
			// las claus son sul fons : lo vel es calculat sus l'imatge (lo fons ven transparent)
			velImatge: true,
			zonas: [[756, 750, 104, 104]],
			etiqueta: [590, 690]
		}
	];

	let alucats = $state({});
	let causit = $state(null);
	let lista = $state(false);
	const total = OBJECTES.length;
	let comptador = $derived(Object.keys(alucats).length);
	let completa = $derived(comptador === total);

	function tocar(o) {
		alucats[o.id] = true;
		causit = o;
	}
	function tornar() {
		alucats = {};
		causit = null;
	}
	const pct = (v) => `${(v / 860) * 100}%`;
	// color en RGB 0-1, per la matritz del filtre de las claus
	const rgb = (h) => [1, 3, 5].map((i) => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
</script>

<svelte:head>
	<title>Essai · La scène de l'unité · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>La scène de l'unité</h1>
		<p>
			Essai sur ton visuel « L'ostal », version sans étiquettes ni flèches. Chaque chose à découvrir
			porte un voile transparent de sa couleur. Touche-la : le voile s'efface, son nom apparaît dans
			la même couleur. Les quatre découvertes, la scène est complète et l'unité suivante s'ouvre.
		</p>
	</header>

	<div class="mise">
		<div
			class="scena"
			class:completa
			role="group"
			aria-label="Scène : une maison, quatre choses à découvrir"
		>
			<svg viewBox="0 0 860 860" aria-hidden="true">
				<defs>
					{#each OBJECTES as o (o.id)}
						<clipPath id="clip-{o.id}">
							<path d={o.clip} clip-rule="evenodd" />
						</clipPath>
						{#if o.velImatge}
							<!-- color fixa ; opacitat = 0,6 × (4 × verd − 1,4) : lo fons (#b34624) ven transparent -->
							<filter id="vel-{o.id}" color-interpolation-filters="sRGB">
								<feColorMatrix
									type="matrix"
									values="0 0 0 0 {rgb(o.color)[0]}  0 0 0 0 {rgb(o.color)[1]}  0 0 0 0 {rgb(
										o.color
									)[2]}  0 2.4 0 0 -0.84"
								/>
							</filter>
						{/if}
					{/each}
				</defs>
				<image href={IMATGE} width="860" height="860" />
				{#each OBJECTES as o (o.id)}
					{#if o.velImatge}
						<image
							href={IMATGE}
							width="860"
							height="860"
							filter="url(#vel-{o.id})"
							clip-path="url(#clip-{o.id})"
							class="vel"
							class:alucat={alucats[o.id]}
						/>
					{:else}
						<path
							d={o.clip}
							fill-rule="evenodd"
							fill={o.color}
							stroke={o.color}
							stroke-width="3"
							class="vel"
							class:alucat={alucats[o.id]}
						/>
					{/if}
				{/each}
			</svg>

			{#each OBJECTES as o (o.id)}
				{#if alucats[o.id]}
					<div
						class="etiqueta"
						style:left={o.etiqueta[2] === 'drecha' ? null : pct(o.etiqueta[0])}
						style:right={o.etiqueta[2] === 'drecha' ? pct(860 - o.etiqueta[0]) : null}
						style:top={pct(o.etiqueta[1])}
						style:--color={o.color}
					>
						<p class="e-oc">{o.oc}</p>
						<p class="e-son"><Icona nom="son" /> {o.son}</p>
						<p class="e-fr">{o.fr}</p>
					</div>
				{/if}
			{/each}

			{#each OBJECTES as o (o.id)}
				{#each o.zonas as z, k (k)}
					<button
						class="zona"
						class:alucat={alucats[o.id]}
						style:left={pct(z[0])}
						style:top={pct(z[1])}
						style:width={pct(z[2])}
						style:height={pct(z[3])}
						aria-label={k === 0 ? `${o.fr} : découvrir` : undefined}
						aria-hidden={k === 0 ? undefined : 'true'}
						tabindex={k === 0 ? 0 : -1}
						onclick={() => tocar(o)}
					></button>
				{/each}
			{/each}
		</div>

		<aside class="panel" aria-live="polite">
			<p class="comptador">
				<strong>{comptador}</strong> / {total} découvertes
			</p>
			<div class="barra" aria-hidden="true">
				<span style:width="{(comptador / total) * 100}%"></span>
			</div>

			{#if completa}
				<div class="fin">
					<p class="gran">La maison est complète !</p>
					<p>
						Dans le parcours : une branche pousse sur l'Arbre del Ligam, le personnage de la còla
						apparaît dans la scène, et l'unité suivante s'ouvre.
					</p>
				</div>
			{/if}

			{#if causit}
				<div class="fica" style:--color={causit.color}>
					<p class="oc">{causit.oc}</p>
					<p class="fr">{causit.fr}</p>
					<p class="son">Ça se dit : <em>{causit.son}</em></p>
					<button class="votz" disabled title="Ta voix, à enregistrer">
						<Icona nom="son" /> Ta voix (à enregistrer)
					</button>
					{#if causit.nota}
						<p class="nota">⚠ Vérification : {causit.nota}</p>
					{/if}
				</div>
			{:else}
				<p class="indici">Quatre couleurs, quatre choses à découvrir. Touche-les.</p>
			{/if}

			<div class="accions">
				<button onclick={() => (lista = !lista)} aria-expanded={lista}>
					{lista ? 'Masquer la liste' : 'Voir la liste des mots'}
				</button>
				<button onclick={tornar}>Recommencer</button>
			</div>

			{#if lista}
				<ul class="lista">
					{#each OBJECTES as o (o.id)}
						<li>
							<button
								onclick={() => tocar(o)}
								aria-pressed={!!alucats[o.id]}
								style:--color={o.color}
							>
								<span class="punt" aria-hidden="true"></span>
								<span class="oc">{o.oc}</span> · {o.fr}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</aside>
	</div>

	<footer>
		<p>
			La version sans étiquettes a été fabriquée pour l'essai (un petit raccord reste au bord du
			toit, à droite) ; la vraie se fera dans Canva en masquant les textes. Le personnage de la còla
			caché dans la scène attend son dessin.
		</p>
	</footer>
</main>

<style>
	.banc {
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
		color: var(--t-tinta);
	}
	h1 {
		margin: 0 0 0.4rem;
		font-size: 2rem;
	}
	header p,
	footer p {
		margin: 0 0 1.25rem;
		max-width: 46rem;
		color: var(--t-tinta-2);
	}
	.mise {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.25rem;
		align-items: start;
	}
	@media (min-width: 900px) {
		.mise {
			grid-template-columns: minmax(0, 36rem) minmax(16rem, 1fr);
		}
	}
	.scena {
		container-type: inline-size;
		position: relative;
		aspect-ratio: 1;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 0.6rem 2rem rgb(0 0 0 / 0.25);
	}
	.scena svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* lo vel : transparent, de la color de l'objècte ; respira doçament */
	.vel {
		opacity: 0.5;
		transition: opacity 0.7s ease;
		animation: respirar 2.6s ease-in-out infinite;
	}
	path.vel {
		stroke-opacity: 0.9;
	}
	.vel.alucat {
		opacity: 0;
		animation: none;
	}
	@keyframes respirar {
		50% {
			opacity: 0.32;
		}
	}
	.zona {
		position: absolute;
		padding: 0;
		border: 0;
		border-radius: 0.5rem;
		background: none;
		cursor: pointer;
	}
	.zona:not(.alucat):hover {
		background: rgb(255 255 255 / 0.15);
	}
	.zona:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* etiquetas escrichas pel site ; la talha seguís la scèna */
	.etiqueta {
		position: absolute;
		padding: 0.6cqw 1.6cqw 0.7cqw 1.4cqw;
		border-left: 0.7cqw solid var(--color);
		border-radius: 0 1.2cqw 1.2cqw 0;
		background: rgb(30 14 8 / 0.62);
		color: #fff;
		line-height: 1.2;
		pointer-events: none;
		animation: apareisser 0.6s ease-out 1;
	}
	.etiqueta p {
		margin: 0;
		white-space: nowrap;
	}
	.e-oc {
		font-weight: 700;
		font-size: 3.6cqw;
		color: var(--color);
	}
	.e-son {
		display: flex;
		gap: 0.3em;
		align-items: center;
		font-size: 2.7cqw;
	}
	.e-fr {
		font-style: italic;
		font-size: 2.5cqw;
		opacity: 0.85;
	}
	/* scèna estreta (telefòn) : sonque lo nom, legible ; lo rèsta es dins lo panèl */
	@container (max-width: 480px) {
		.e-son,
		.e-fr {
			display: none;
		}
		.e-oc {
			font-size: max(3.6cqw, 0.9rem);
		}
	}
	@keyframes apareisser {
		from {
			opacity: 0;
			transform: translateY(0.4rem);
		}
	}
	.panel {
		padding: 1.25rem;
		border: 1px solid var(--t-linha);
		border-radius: 0.75rem;
	}
	.comptador {
		margin: 0 0 0.5rem;
	}
	.barra {
		height: 0.4rem;
		margin-bottom: 1.25rem;
		border-radius: 999px;
		background: var(--t-linha);
		overflow: hidden;
	}
	.barra span {
		display: block;
		height: 100%;
		background: var(--t-aur);
		transition: width 0.6s ease;
	}
	.fica {
		padding-left: 0.9rem;
		border-left: 4px solid var(--color);
	}
	.fica .oc {
		margin: 0;
		font-family: 'Limelight', serif;
		font-size: 2rem;
		color: var(--t-aur-clar);
	}
	.fica .fr {
		margin: 0.1rem 0 0.75rem;
		font-style: italic;
	}
	.fica .son {
		margin: 0 0 0.75rem;
	}
	.votz {
		display: inline-flex;
		gap: 0.4em;
		align-items: center;
		padding: 0.45rem 1rem;
		border: 1px dashed var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
	}
	.nota {
		margin: 0.9rem 0 0;
		font-size: 0.875rem;
		color: var(--t-tinta-2);
	}
	.fin {
		margin-bottom: 1rem;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--t-aur);
	}
	.fin p {
		margin: 0;
	}
	.fin .gran {
		margin-bottom: 0.4rem;
		font-family: 'Limelight', serif;
		font-size: 1.4rem;
		color: var(--t-aur-clar);
	}
	.indici {
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-top: 1.25rem;
	}
	.accions button,
	.lista button {
		min-height: 2.75rem;
		padding: 0.45rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
	}
	.lista {
		display: grid;
		gap: 0.5rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}
	.lista button {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
	.lista button[aria-pressed='true'] {
		border-color: var(--t-aur);
	}
	.lista .punt {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: var(--color);
	}
	.lista .oc {
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.vel,
		.barra span {
			transition: none;
			animation: none;
		}
		.etiqueta {
			animation: none;
		}
	}
</style>
