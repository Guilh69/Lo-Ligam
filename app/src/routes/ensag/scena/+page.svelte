<script>
	// Banc d'ensag de la « scèna » d'unitat (demanda de Romain, 2026-10-15) :
	// un visual Instagram de Romain en grand, cada objècte se toca, s'aluma e
	// mòstra son nom. La scèna completa dobrís l'unitat seguenta.
	// Proposicion : revisions/2026-10-15-parcours-univers-scenes.md. Pagina de
	// trabalh, pas indexada. Coordenadas dins l'espaci de l'imatge (860 × 860).
	const IMATGE = '/fichas/grand/ostal--ostal.webp';
	const FONS = '#b34624'; // color del fons del visual (relevada sul fichièr)

	// Los mots e la prononciacion son los del visual de Romain.
	const OBJECTES = [
		{
			id: 'teulat',
			oc: 'Lo teulat',
			fr: 'Le toit',
			son: 'Lou téwlatt',
			// lo teulat sens las doas finèstras de la teulada (traucs)
			clip: 'M300 280 L558 280 L655 420 L652 446 L213 446 L211 414 Z M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z',
			zonas: [[211, 280, 444, 166]],
			etiqueta: [76, 198, 192, 102]
		},
		{
			id: 'finestras',
			oc: 'Las finèstras',
			fr: 'Les fenêtres',
			son: 'Lass finèstross',
			nota: 'Lo Congrès donne « fenèstra » pour le languedocien ; « finèstra » est inconnu de l’API (vérifié le 15-10). Variante de chez toi ou coquille ?',
			clip: 'M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z M294 472 H370 V575 H294 Z M485 472 H564 V575 H485 Z',
			zonas: [
				[326, 310, 78, 72],
				[456, 310, 78, 72],
				[294, 472, 76, 103],
				[485, 472, 79, 103]
			],
			etiqueta: [596, 203, 222, 97]
		},
		{
			id: 'porta',
			oc: 'La pòrta',
			fr: 'La porte',
			son: 'La porto',
			clip: 'M390 493 H455 V630 H390 Z',
			zonas: [[384, 488, 77, 146]],
			etiqueta: [113, 648, 172, 99]
		},
		{
			id: 'claus',
			oc: 'Las claus',
			fr: 'Les clefs',
			son: 'Lass klaws',
			clip: 'M764 758 H856 V846 H764 Z',
			// las claus son sul fons : lo filtre fa transparent lo fons roge
			filtre: 'gredon-fons',
			zonas: [[756, 750, 104, 104]],
			etiqueta: [570, 658, 170, 96]
		}
	];
	const TITOL_SON = [283, 766, 350, 70]; // « L'oustal énn outsita », a la fin

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
</script>

<svelte:head>
	<title>Essai · La scène de l'unité · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>La scène de l'unité</h1>
		<p>
			Essai sur ton visuel « L'ostal ». Au départ, la maison est « au crayon » et les étiquettes
			sont cachées ; les flèches servent d'indices. Touche un objet : il s'allume, son nom
			apparaît. Les quatre objets allumés, la scène est complète et l'unité suivante s'ouvre.
		</p>
	</header>

	<div class="mise">
		<div
			class="scena"
			class:completa
			role="group"
			aria-label="Scène : une maison, quatre objets à découvrir"
		>
			<svg viewBox="0 0 860 860" aria-hidden="true">
				<defs>
					<filter id="gredon" color-interpolation-filters="sRGB">
						<feColorMatrix type="saturate" values="0" />
						<feComponentTransfer>
							<feFuncR type="linear" slope="0.55" intercept="0.42" />
							<feFuncG type="linear" slope="0.55" intercept="0.42" />
							<feFuncB type="linear" slope="0.55" intercept="0.42" />
						</feComponentTransfer>
					</filter>
					<!-- opacitat = 4 × verd − 1,4 : lo fons (#b34624, verd 0,27) ven transparent -->
					<filter id="gredon-fons" color-interpolation-filters="sRGB">
						<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 4 0 0 -1.4" />
						<feColorMatrix type="saturate" values="0" />
						<feComponentTransfer>
							<feFuncR type="linear" slope="0.55" intercept="0.42" />
							<feFuncG type="linear" slope="0.55" intercept="0.42" />
							<feFuncB type="linear" slope="0.55" intercept="0.42" />
						</feComponentTransfer>
					</filter>
					{#each OBJECTES as o (o.id)}
						<clipPath id="clip-{o.id}">
							<path d={o.clip} clip-rule="evenodd" />
						</clipPath>
					{/each}
				</defs>
				<image href={IMATGE} width="860" height="860" />
				{#each OBJECTES as o (o.id)}
					<image
						href={IMATGE}
						width="860"
						height="860"
						filter="url(#{o.filtre ?? 'gredon'})"
						clip-path="url(#clip-{o.id})"
						class="gris"
						class:alucat={alucats[o.id]}
					/>
				{/each}
				{#each OBJECTES as o (o.id)}
					<rect
						x={o.etiqueta[0]}
						y={o.etiqueta[1]}
						width={o.etiqueta[2]}
						height={o.etiqueta[3]}
						fill={FONS}
						class="cache"
						class:alucat={alucats[o.id]}
					/>
				{/each}
				<rect
					x={TITOL_SON[0]}
					y={TITOL_SON[1]}
					width={TITOL_SON[2]}
					height={TITOL_SON[3]}
					fill={FONS}
					class="cache"
					class:alucat={completa}
				/>
			</svg>

			{#each OBJECTES as o (o.id)}
				{#each o.zonas as z, k (k)}
					<button
						class="zona"
						class:alucat={alucats[o.id]}
						style:left={pct(z[0])}
						style:top={pct(z[1])}
						style:width={pct(z[2])}
						style:height={pct(z[3])}
						aria-label={k === 0 ? `${o.fr} : allumer et entendre` : undefined}
						aria-hidden={k === 0 ? undefined : 'true'}
						tabindex={k === 0 ? 0 : -1}
						onclick={() => tocar(o)}
					></button>
				{/each}
			{/each}

			{#if causit}
				<!-- sul telefòn, lo nom s'aficha dins la scèna (lo panèl es en dessota) -->
				<p class="bulla" aria-hidden="true">
					<strong>{causit.oc}</strong> · <em>{causit.fr}</em>
				</p>
			{/if}
		</div>

		<aside class="panel" aria-live="polite">
			<p class="comptador">
				<strong>{comptador}</strong> / {total} objets allumés
			</p>
			<div class="barra" aria-hidden="true">
				<span style:width="{(comptador / total) * 100}%"></span>
			</div>

			{#if completa}
				<div class="fin">
					<p class="gran">La maison est allumée !</p>
					<p>
						Dans le parcours : une branche pousse sur l'Arbre del Ligam, le personnage de la còla
						apparaît dans la scène, et l'unité suivante s'ouvre.
					</p>
				</div>
			{/if}

			{#if causit}
				<div class="fica">
					<p class="oc">{causit.oc}</p>
					<p class="fr">{causit.fr}</p>
					<p class="son">Ça se dit : <em>{causit.son}</em></p>
					<button class="votz" disabled title="Ta voix, à enregistrer">▶ Ta voix (à enregistrer)</button>
					{#if causit.nota}
						<p class="nota">⚠ Vérification : {causit.nota}</p>
					{/if}
				</div>
			{:else}
				<p class="indici">Touche le toit, les fenêtres, la porte… et cherche les clefs.</p>
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
							<button onclick={() => tocar(o)} aria-pressed={!!alucats[o.id]}>
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
			À trancher : tes étiquettes restent sur l'image (on les découvre) ou on les retire et le nom
			n'apparaît que dans le panneau ? Le personnage de la còla caché dans la scène attend son
			dessin.
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
	.gris,
	.cache {
		transition: opacity 0.7s ease;
	}
	.gris.alucat,
	.cache.alucat {
		opacity: 0;
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
		background: rgb(255 255 255 / 0.12);
	}
	.zona:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.zona.alucat {
		animation: lusir 0.9s ease-out 1;
	}
	@keyframes lusir {
		from {
			box-shadow: 0 0 0 0 rgb(255 214 120 / 0.9);
		}
		to {
			box-shadow: 0 0 0 1.2rem rgb(255 214 120 / 0);
		}
	}
	.bulla {
		position: absolute;
		left: 50%;
		bottom: 3%;
		margin: 0;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		background: rgb(20 12 8 / 0.82);
		color: #fff;
		font-size: 0.95rem;
		white-space: nowrap;
		transform: translateX(-50%);
		pointer-events: none;
	}
	@media (min-width: 900px) {
		.bulla {
			display: none;
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
	.lista button[aria-pressed='true'] {
		border-color: var(--t-aur);
	}
	.lista .oc {
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.gris,
		.cache,
		.barra span {
			transition: none;
		}
		.zona.alucat {
			animation: none;
		}
	}
</style>
