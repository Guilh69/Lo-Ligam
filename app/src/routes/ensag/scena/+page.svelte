<script>
	// Banc d'ensag de la « scèna » d'unitat (demanda de Romain, 2026-10-15) :
	// un visual Instagram de Romain en grand, cada objècte se toca, se revèla e
	// mòstra son nom. La scèna completa dobrís l'unitat seguenta.
	// Proposicion : revisions/2026-10-15-parcours-univers-scenes.md. Pagina de
	// trabalh, pas indexada. Coordenadas dins l'espaci de l'imatge (860 × 860).
	// 3en passatge (retorn de Romain) : un revelador opac acordat a las colors
	// del dessenh (tres variantas de comparar), una sageta que se traça per
	// menar al mot, e l'etiqueta de Romain (crotz + occitan, votz, francés).
	import Icona from '$lib/components/Icona.svelte';
	import CrossIcon from '$lib/components/CrossIcon.svelte';

	// Version del visual sens etiquetas ni sagetas (fabricada per l'ensag ;
	// Romain la tornarà far dins Canva en amagant los tèxtes)
	const IMATGE = '/ensag/scena/ostal-net.webp';

	const VARIANTAS = [
		{ id: 'aplat', nom: 'Aplat', desc: 'chaque objet en aplat de sa propre couleur, comme découpé dans le papier' },
		{ id: 'sepia', nom: 'Sépia', desc: 'les objets en camaïeu brun et crème, les deux tons du dessin' },
		{ id: 'bruma', nom: 'Brume', desc: 'les objets flous, dans leurs vraies couleurs, qui deviennent nets' }
	];

	// Los mots e la prononciacion venon del visual de Romain. « aplat » = color
	// mejana de l'objècte, relevada sul visual e un pauc escurzida.
	const OBJECTES = [
		{
			id: 'teulat',
			oc: 'Lo teulat',
			fr: 'Le toit',
			son: 'Lou téwlatt',
			aplat: '#a86d46',
			clip: 'M300 280 L558 280 L655 420 L652 446 L213 446 L211 414 Z M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z',
			zonas: [[211, 280, 444, 166]],
			etiqueta: [76, 200],
			sageta: 'M262 222 C 318 196, 352 226, 352 268',
			punta: 'M339 256 L352 272 L364 255'
		},
		{
			id: 'fenestras',
			oc: 'Las fenèstras',
			fr: 'Les fenêtres',
			son: 'Lass finèstross',
			nota: 'Ton visuel écrit « finèstras » ; lo Congrès ne connaît que « fenèstra » (languedocien), vérifié le 15-10. Coquille probable : à confirmer, et la prononciation avec.',
			aplat: '#5c6157',
			clip: 'M326 310 H404 V382 H326 Z M456 310 H534 V382 H456 Z M294 472 H370 V575 H294 Z M485 472 H564 V575 H485 Z',
			zonas: [
				[326, 310, 78, 72],
				[456, 310, 78, 72],
				[294, 472, 76, 103],
				[485, 472, 79, 103]
			],
			etiqueta: [588, 205],
			sageta: 'M690 300 C 700 362, 622 378, 548 352',
			punta: 'M564 341 L546 351 L561 365'
		},
		{
			id: 'porta',
			oc: 'La pòrta',
			fr: 'La porte',
			son: 'La porto',
			aplat: '#6e503a',
			clip: 'M390 493 H455 V630 H390 Z',
			zonas: [[384, 488, 77, 146]],
			etiqueta: [118, 650],
			sageta: 'M278 708 C 330 742, 404 722, 420 646',
			punta: 'M406 659 L421 642 L434 660'
		},
		{
			id: 'claus',
			oc: 'Las claus',
			fr: 'Les clefs',
			son: 'Lass klaws',
			aplat: '#d39809',
			clip: 'M764 758 H856 V846 H764 Z',
			// las claus son sul fons : los filtres fan transparent lo fons roge
			surFons: true,
			zonas: [[756, 750, 104, 104]],
			etiqueta: [574, 660],
			sageta: 'M742 690 C 790 680, 812 708, 812 746',
			punta: 'M799 735 L812 751 L825 734'
		}
	];

	let varianta = $state('aplat');
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
	function causir(v) {
		varianta = v;
		tornar();
	}
	const pct = (v) => `${(v / 860) * 100}%`;
	const rgb = (h) => [1, 3, 5].map((i) => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
	// opacitat calculada sul verd : lo fons roge (#b34624, verd 0,27) ven transparent
	const ALFA_FONS = '0 4 0 0 -1.4';
</script>

<svelte:head>
	<title>Essai · La scène de l'unité · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>La scène de l'unité</h1>
		<p>
			Troisième essai, d'après ton retour : les objets à découvrir sont cachés de façon opaque, dans
			les couleurs du dessin ; au toucher, l'objet se révèle, une flèche se trace et ton étiquette
			apparaît (croix et occitan, prononciation, français). Trois façons de cacher, à comparer :
		</p>
		<div class="comparar" role="group" aria-label="Façon de cacher les objets">
			{#each VARIANTAS as v (v.id)}
				<button aria-pressed={varianta === v.id} onclick={() => causir(v.id)}>{v.nom}</button>
			{/each}
		</div>
		<p class="desc">{VARIANTAS.find((v) => v.id === varianta).desc}</p>
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
						<!-- aplat : color plana de l'objècte -->
						<filter id="aplat-{o.id}" color-interpolation-filters="sRGB">
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 {rgb(o.aplat)[0]}  0 0 0 0 {rgb(o.aplat)[1]}  0 0 0 0 {rgb(
									o.aplat
								)[2]}  {o.surFons ? ALFA_FONS : '0 0 0 1 0'}"
							/>
						</filter>
						<!-- sepia : camaïeu entre lo brun e lo crèma del dessenh -->
						<filter id="sepia-{o.id}" color-interpolation-filters="sRGB">
							<feColorMatrix
								type="matrix"
								values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  {o.surFons ? ALFA_FONS : '0 0 0 1 0'}"
							/>
							<feColorMatrix type="saturate" values="0" />
							<feComponentTransfer>
								<feFuncR type="table" tableValues="0.353 0.953" />
								<feFuncG type="table" tableValues="0.141 0.933" />
								<feFuncB type="table" tableValues="0.078 0.847" />
							</feComponentTransfer>
						</filter>
						<!-- bruma : las colors vertadièras, trebolas -->
						<filter
							id="bruma-{o.id}"
							color-interpolation-filters="sRGB"
							x="-5%"
							y="-5%"
							width="110%"
							height="110%"
						>
							<feColorMatrix
								in="SourceGraphic"
								type="matrix"
								values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  {o.surFons ? ALFA_FONS : '0 0 0 1 0'}"
								result="forma"
							/>
							<feGaussianBlur in="SourceGraphic" stdDeviation="9" result="trebol" />
							<feComposite in="trebol" in2="forma" operator="in" />
						</filter>
					{/each}
				</defs>
				<image href={IMATGE} width="860" height="860" />
				{#each OBJECTES as o (o.id)}
					<image
						href={IMATGE}
						width="860"
						height="860"
						filter="url(#{varianta}-{o.id})"
						clip-path="url(#clip-{o.id})"
						class="cache"
						class:alucat={alucats[o.id]}
					/>
				{/each}
				{#each OBJECTES as o (o.id)}
					{#if alucats[o.id]}
						<g class="sageta">
							<path class="trait" d={o.sageta} pathLength="1" />
							<path class="punta" d={o.punta} />
						</g>
					{/if}
				{/each}
			</svg>

			{#each OBJECTES as o (o.id)}
				{#if alucats[o.id]}
					<div class="etiqueta" style:left={pct(o.etiqueta[0])} style:top={pct(o.etiqueta[1])}>
						<p class="e-oc"><span class="escut"><CrossIcon size="70%" /></span>{o.oc}</p>
						<p class="e-son"><Icona nom="son" /> {o.son}</p>
						<p class="e-fr">
							<svg
								class="bandiera"
								viewBox="0 0 3 2"
								width="1.1em"
								height="0.75em"
								aria-hidden="true"
							>
								<rect width="1" height="2" fill="#0055a4" />
								<rect x="1" width="1" height="2" fill="#fff" />
								<rect x="2" width="1" height="2" fill="#ef4135" />
							</svg>
							{o.fr}
						</p>
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
				<div class="fica">
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
				<p class="indici">Quatre choses sont cachées dans la maison. Touche-les.</p>
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
		margin: 0 0 1rem;
		max-width: 46rem;
		color: var(--t-tinta-2);
	}
	.desc {
		font-style: italic;
	}
	.comparar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}
	.comparar button {
		min-height: 2.75rem;
		padding: 0.45rem 1.1rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.comparar button[aria-pressed='true'] {
		border-color: var(--t-aur);
		color: var(--t-aur-clar);
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
	.scena > svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* lo cache : opac ; se retira a la descobèrta */
	.cache {
		transition: opacity 0.8s ease;
	}
	.cache.alucat {
		opacity: 0;
	}
	/* la sageta se traça (0,6 s), puèi la punta e l'etiqueta */
	.sageta {
		fill: none;
		stroke: #fff;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.trait {
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: tracar 0.6s ease-out 0.35s backwards;
	}
	.punta {
		animation: apareisser-punta 0.2s ease-out 0.9s backwards;
	}
	@keyframes tracar {
		from {
			stroke-dashoffset: 1;
		}
	}
	@keyframes apareisser-punta {
		from {
			opacity: 0;
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
	/* l'etiqueta de Romain : crotz + occitan, votz + prononciacion, bandièra + francés */
	.etiqueta {
		position: absolute;
		color: #fff;
		line-height: 1.25;
		pointer-events: none;
		animation: apareisser 0.5s ease-out 0.85s backwards;
	}
	.etiqueta p {
		display: flex;
		gap: 0.45em;
		align-items: center;
		margin: 0;
		white-space: nowrap;
	}
	.e-oc {
		font-weight: 700;
		font-size: 3.4cqw;
	}
	.escut {
		display: inline-grid;
		place-items: center;
		width: 1.05em;
		height: 1.15em;
		border-radius: 0.15em 0.15em 0.5em 0.5em;
		background: #d4261c;
		color: #f6c343;
	}
	.e-son {
		font-size: 2.6cqw;
		opacity: 0.95;
	}
	.e-fr {
		font-style: italic;
		font-size: 2.4cqw;
		opacity: 0.92;
	}
	.bandiera {
		width: 1.1em;
		height: 0.75em;
		border-radius: 0.1em;
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
	.lista button[aria-pressed='true'] {
		border-color: var(--t-aur);
	}
	.lista .oc {
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.cache,
		.barra span {
			transition: none;
		}
		.trait,
		.punta,
		.etiqueta {
			animation: none;
		}
	}
</style>
