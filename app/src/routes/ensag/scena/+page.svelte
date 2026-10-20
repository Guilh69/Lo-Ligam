<script>
	// Banc d'ensag de la « scèna » d'unitat (demanda de Romain, 2026-10-15) :
	// un visual de Romain en grand, cada objècte se toca, ven a la lutz e
	// mòstra son nom. La scèna completa dobrís l'unitat seguenta.
	// Proposicion : revisions/2026-10-15-parcours-univers-scenes.md.
	// 4en passatge (causida de Romain, 2026-10-20) : « Lutz amb pastilhas ».
	// La scèna es dins l'ombra (sas pròprias colors, escurzidas) ; una pastilha
	// d'aur mòstra ont tocar ; al tòc, l'objècte ven a la lutz, una sageta se
	// traça e l'etiqueta de Romain apareis (crotz + occitan, votz, francés).
	// Zònas aproximativas (ellipsas) : la règla que tèn per 200 visuals.
	// Pagina de trabalh, pas indexada. Coordenadas dins l'espaci 860 × 860.
	import Icona from '$lib/components/Icona.svelte';
	import CrossIcon from '$lib/components/CrossIcon.svelte';

	// zona = [cx, cy, rx, ry] ; sageta = [partença, contraròtle, arribada]
	const VISUALS = [
		{
			id: 'ostal',
			nom: 'La maison',
			imatge: '/ensag/scena/ostal-net.webp',
			ombra: 0.34,
			tinta: '#fff',
			descripcion: 'une maison, quatre choses à découvrir',
			objectes: [
				{
					id: 'teulat',
					oc: 'Lo teulat',
					fr: 'Le toit',
					son: 'Lou téwlatt',
					zonas: [[433, 362, 222, 84]],
					// pastilha sus la teulada, pas entre las finèstras
					pastilha: [290, 410],
					etiqueta: [76, 196],
					sageta: [[262, 222], [350, 200], [352, 272]]
				},
				{
					id: 'fenestras',
					oc: 'Las fenèstras',
					fr: 'Les fenêtres',
					son: 'Lass finèstross',
					nota: 'Ton visuel écrit « finèstras » ; lo Congrès ne connaît que « fenèstra » (languedocien), vérifié le 15-10. Coquille probable : à confirmer, et la prononciation avec.',
					zonas: [
						[332, 523, 42, 56],
						[524, 523, 42, 56],
						[365, 346, 42, 40],
						[495, 346, 42, 40]
					],
					etiqueta: [588, 200],
					sageta: [[690, 300], [680, 372], [550, 352]]
				},
				{
					id: 'porta',
					oc: 'La pòrta',
					fr: 'La porte',
					son: 'La porto',
					zonas: [[422, 561, 40, 72]],
					etiqueta: [118, 650],
					sageta: [[278, 708], [420, 740], [421, 646]]
				},
				{
					id: 'claus',
					oc: 'Las claus',
					fr: 'Les clefs',
					son: 'Lass klaws',
					zonas: [[808, 800, 54, 52]],
					etiqueta: [574, 660],
					sageta: [[742, 690], [812, 680], [812, 744]]
				}
			]
		},
		{
			id: 'animals',
			nom: 'Les animaux',
			imatge: '/ensag/scena/animals-net.webp',
			ombra: 0.32,
			// noms dobles (masculin / femenin) : letra un pauc mai pichona, coma sul visual
			talha: 0.82,
			tinta: '#fff',
			descripcion: 'six familles d’animaux à découvrir',
			// formas del visual de Romain ; prononciacion a escriure
			objectes: [
				{
					id: 'can',
					oc: 'Lo can / La canha',
					fr: 'Le chien / la chienne',
					zonas: [[126, 246, 74, 92]],
					etiqueta: [16, 340],
					sageta: [[60, 340], [40, 320], [70, 300]]
				},
				{
					id: 'gat',
					oc: 'La gata / Lo gat',
					fr: 'La chatte / le chat',
					zonas: [[308, 242, 106, 96]],
					etiqueta: [150, 94],
					sageta: [[390, 112], [430, 140], [380, 172]]
				},
				{
					id: 'cabra',
					oc: 'La cabra / Lo boc',
					fr: 'La chèvre / le bouc',
					zonas: [[578, 200, 132, 90]],
					etiqueta: [470, 292],
					sageta: [[466, 300], [440, 280], [475, 250]]
				},
				{
					id: 'galina',
					oc: 'La galina / Lo gal',
					fr: 'La poule / le coq',
					zonas: [[190, 500, 148, 96]],
					etiqueta: [22, 604],
					sageta: [[120, 604], [120, 590], [140, 572]]
				},
				{
					id: 'caval',
					oc: 'Lo caval / La cavala',
					fr: 'Le cheval / la jument',
					zonas: [[676, 440, 152, 126]],
					// accrochada per la drecha (bord drech a 852)
					etiqueta: [852, 572, 'drecha'],
					sageta: [[552, 592], [540, 566], [585, 545]]
				},
				{
					id: 'porc',
					oc: 'Lo pòrc / La truèja',
					fr: 'Le cochon / la truie',
					zonas: [[424, 660, 136, 110]],
					etiqueta: [852, 708, 'drecha'],
					sageta: [[556, 724], [530, 726], [512, 702]]
				}
			]
		},
		{
			id: 'cos',
			nom: 'Le corps',
			imatge: '/ensag/scena/cos-net.webp',
			// fons blanc : ombra mai leugièra, que la gravadura demòre legibla
			ombra: 0.74,
			talha: 0.8,
			tinta: '#1e1e1e',
			descripcion: 'six parties du corps à découvrir',
			// formas del visual de Romain ; los plurals (mans, braces, cambas,
			// pès) l'API los pòt pas confirmar (lo diccionari dona lo singular)
			objectes: [
				{
					id: 'cap',
					oc: 'Lo cap',
					fr: 'La tête',
					zonas: [[432, 243, 44, 50]],
					etiqueta: [490, 150],
					sageta: [[488, 182], [470, 200], [458, 218]]
				},
				{
					id: 'mans',
					oc: 'La(s) man(s)',
					fr: 'La (les) main(s)',
					zonas: [
						[306, 236, 36, 40],
						[300, 412, 30, 30]
					],
					etiqueta: [96, 160],
					sageta: [[282, 176], [312, 172], [304, 206]]
				},
				{
					id: 'braces',
					oc: 'Los braces',
					fr: 'Les bras',
					zonas: [
						[366, 290, 78, 30],
						[350, 372, 62, 32]
					],
					etiqueta: [150, 316],
					sageta: [[300, 334], [326, 336], [340, 318]]
				},
				{
					id: 'ventre',
					oc: 'Lo ventre',
					fr: 'Le ventre',
					zonas: [[432, 420, 40, 50]],
					etiqueta: [214, 450],
					sageta: [[338, 462], [380, 470], [404, 446]]
				},
				{
					id: 'cambas',
					oc: 'La(s) camba(s)',
					fr: 'La (les) jambe(s)',
					zonas: [[462, 560, 72, 92]],
					etiqueta: [540, 520],
					sageta: [[536, 540], [512, 548], [500, 562]]
				},
				{
					id: 'pes',
					oc: 'Lo(s) pè(s)',
					fr: 'Le(s) pied(s)',
					zonas: [
						[402, 656, 40, 24],
						[528, 628, 32, 28]
					],
					etiqueta: [380, 690],
					sageta: [[378, 704], [372, 690], [392, 674]]
				}
			]
		}
	];

	let visId = $state('ostal');
	let vis = $derived(VISUALS.find((v) => v.id === visId));
	let alucats = $state({});
	let causit = $state(null);
	let lista = $state(false);
	let total = $derived(vis.objectes.length);
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
	function causir(id) {
		visId = id;
		tornar();
	}
	const pct = (v) => `${(v / 860) * 100}%`;
	// corba de la sageta (quadratica) e sa punta, calculada sus la tangenta
	const corba = ([[x0, y0], [cx, cy], [x1, y1]]) => `M${x0} ${y0} Q ${cx} ${cy}, ${x1} ${y1}`;
	function punta([, [cx, cy], [x1, y1]]) {
		const a = Math.atan2(y1 - cy, x1 - cx);
		const p = (s) => `${x1 - 17 * Math.cos(a + s)} ${y1 - 17 * Math.sin(a + s)}`;
		return `M${p(0.55)} L${x1} ${y1} L${p(-0.55)}`;
	}
</script>

<svelte:head>
	<title>Essai · La scène de l'unité · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc">
	<header>
		<h1>La scène de l'unité</h1>
		<p>
			« Lumière avec pastilles » : la scène est dans l'ombre, une pastille dorée montre où toucher ;
			au toucher, l'objet vient à la lumière, une flèche se trace et ton étiquette apparaît. Essayé
			sur trois visuels de types différents :
		</p>
		<div class="comparar" role="group" aria-label="Visuel">
			{#each VISUALS as v (v.id)}
				<button aria-pressed={visId === v.id} onclick={() => causir(v.id)}>{v.nom}</button>
			{/each}
		</div>
	</header>

	<div class="mise">
		<div
			class="scena"
			class:completa
			role="group"
			aria-label="Scène : {vis.descripcion}"
			style:--tinta={vis.tinta}
			style:--talha={vis.talha ?? 1}
		>
			{#key visId}
				<svg viewBox="0 0 860 860" aria-hidden="true">
					<defs>
						<filter id="ombra" color-interpolation-filters="sRGB">
							<feColorMatrix type="saturate" values="0.55" />
							<feComponentTransfer>
								<feFuncR type="linear" slope={vis.ombra} />
								<feFuncG type="linear" slope={vis.ombra} />
								<feFuncB type="linear" slope={vis.ombra} />
							</feComponentTransfer>
						</filter>
						<radialGradient id="lum">
							<stop offset="0.5" stop-color="#000" stop-opacity="1" />
							<stop offset="1" stop-color="#000" stop-opacity="0" />
						</radialGradient>
						<radialGradient id="calor">
							<stop offset="0" stop-color="#ffd27a" stop-opacity="0.55" />
							<stop offset="1" stop-color="#ffd27a" stop-opacity="0" />
						</radialGradient>
						<!-- l'ombra es retirada (negre) dins las zònas descobèrtas -->
						<mask id="mascaOmbra" maskUnits="userSpaceOnUse" x="0" y="0" width="860" height="860">
							<rect width="860" height="860" fill="#fff" />
							{#each vis.objectes as o (o.id)}
								{#if alucats[o.id]}
									{#each o.zonas as z, k (k)}
										<g transform="translate({z[0]} {z[1]})">
											<ellipse class="lum" rx={z[2] * 1.3} ry={z[3] * 1.3} fill="url(#lum)" />
										</g>
									{/each}
								{/if}
							{/each}
						</mask>
					</defs>
					<image href={vis.imatge} width="860" height="860" />
					<!-- a la fin, l'ombra se lèva en entièr -->
					<image
						href={vis.imatge}
						width="860"
						height="860"
						filter="url(#ombra)"
						mask="url(#mascaOmbra)"
						class="ombra"
						class:levada={completa}
					/>
					{#each vis.objectes as o (o.id)}
						{#if alucats[o.id]}
							{#each o.zonas as z, k (k)}
								<g transform="translate({z[0]} {z[1]})">
									<ellipse class="calor" rx={z[2] * 1.4} ry={z[3] * 1.4} fill="url(#calor)" />
								</g>
							{/each}
							<g class="sageta" stroke={vis.tinta}>
								<path class="trait" d={corba(o.sageta)} pathLength="1" />
								<path class="punta" d={punta(o.sageta)} />
							</g>
						{/if}
					{/each}
				</svg>
			{/key}

			{#each vis.objectes as o (o.id)}
				{#if alucats[o.id]}
					<div
						class="etiqueta"
						style:left={o.etiqueta[2] === 'drecha' ? null : pct(o.etiqueta[0])}
						style:right={o.etiqueta[2] === 'drecha' ? pct(860 - o.etiqueta[0]) : null}
						style:top={pct(o.etiqueta[1])}
					>
						<p class="e-oc"><span class="escut"><CrossIcon size="70%" /></span>{o.oc}</p>
						{#if o.son}
							<p class="e-son"><Icona nom="son" /> {o.son}</p>
						{/if}
						<p class="e-fr">
							<svg viewBox="0 0 3 2" width="1.1em" height="0.75em" aria-hidden="true">
								<rect width="1" height="2" fill="#0055a4" />
								<rect x="1" width="1" height="2" fill="#fff" />
								<rect x="2" width="1" height="2" fill="#ef4135" />
							</svg>
							{o.fr}
						</p>
					</div>
				{:else}
					<span
						class="pastilha"
						style:left={pct((o.pastilha ?? o.zonas[0])[0])}
						style:top={pct((o.pastilha ?? o.zonas[0])[1])}
						aria-hidden="true"
					></span>
				{/if}
			{/each}

			{#each vis.objectes as o (o.id)}
				{#each o.zonas as z, k (k)}
					<button
						class="zona"
						style:left={pct(z[0] - z[2])}
						style:top={pct(z[1] - z[3])}
						style:width={pct(z[2] * 2)}
						style:height={pct(z[3] * 2)}
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
					<p class="gran">La scène est complète !</p>
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
					<p class="son">
						Ça se dit : {#if causit.son}<em>{causit.son}</em>{:else}<span class="manca"
								>prononciation à écrire</span
							>{/if}
					</p>
					<button class="votz" disabled title="Ta voix, à enregistrer">
						<Icona nom="son" /> Ta voix (à enregistrer)
					</button>
					{#if causit.nota}
						<p class="nota">⚠ Vérification : {causit.nota}</p>
					{/if}
				</div>
			{:else}
				<p class="indici">Touche les pastilles dorées.</p>
			{/if}

			<div class="accions">
				<button onclick={() => (lista = !lista)} aria-expanded={lista}>
					{lista ? 'Masquer la liste' : 'Voir la liste des mots'}
				</button>
				<button onclick={tornar}>Recommencer</button>
			</div>

			{#if lista}
				<ul class="lista">
					{#each vis.objectes as o (o.id)}
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
			Versions sans étiquettes fabriquées pour l'essai ; les vraies viendront de tes exports Canva
			sans textes. Les zones sont des ovales approximatifs : c'est ce qui permettra d'en tracer pour
			200 visuels. Le personnage de la còla caché dans la scène attend son dessin.
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
	.comparar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
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
	.ombra {
		transition: opacity 1.4s ease 0.6s;
	}
	.ombra.levada {
		opacity: 0;
	}
	/* la lutz s'espandís del centre de la zòna, puèi un escalfor que s'avalís */
	.lum {
		animation: espandir 0.9s ease-out backwards;
	}
	@keyframes espandir {
		from {
			transform: scale(0);
		}
	}
	.calor {
		opacity: 0;
		animation: escalfar 1.6s ease-out;
	}
	@keyframes escalfar {
		30% {
			opacity: 1;
		}
	}
	/* la sageta se traça, puèi la punta e l'etiqueta */
	.sageta {
		fill: none;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.trait {
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: tracar 0.6s ease-out 0.45s backwards;
	}
	.punta {
		animation: apareisser-punta 0.2s ease-out 1s backwards;
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
	/* pastilha d'aur que respira : ont tocar */
	.pastilha {
		position: absolute;
		width: 1.15rem;
		height: 1.15rem;
		border: 2px solid #fff;
		border-radius: 50%;
		background: #f2c14e;
		box-shadow: 0 0 0 0 rgb(242 193 78 / 0.7);
		transform: translate(-50%, -50%);
		pointer-events: none;
		animation: alenar 2.2s ease-out infinite;
	}
	@keyframes alenar {
		70% {
			box-shadow: 0 0 0 0.9rem rgb(242 193 78 / 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgb(242 193 78 / 0);
		}
	}
	.zona {
		position: absolute;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		cursor: pointer;
	}
	.zona:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* l'etiqueta de Romain : crotz + occitan, votz + prononciacion, bandièra + francés */
	.etiqueta {
		position: absolute;
		color: var(--tinta);
		line-height: 1.25;
		pointer-events: none;
		animation: apareisser 0.5s ease-out 0.95s backwards;
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
		font-size: calc(3.3cqw * var(--talha));
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
		font-size: calc(2.5cqw * var(--talha));
	}
	.e-fr {
		font-style: italic;
		font-size: calc(2.4cqw * var(--talha));
		opacity: 0.92;
	}
	/* scèna estreta (telefòn) : sus l'imatge, sonque lo nom occitan, legible ;
	   la prononciacion e lo francés son dins lo panèl */
	@container (max-width: 480px) {
		.etiqueta .e-son,
		.etiqueta .e-fr {
			display: none;
		}
		.e-oc {
			font-size: max(calc(3.3cqw * var(--talha)), 0.72rem);
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
	.manca {
		color: var(--t-tinta-2);
		font-style: italic;
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
		.lum,
		.calor,
		.trait,
		.punta,
		.etiqueta,
		.pastilha {
			animation: none;
		}
		.barra span,
		.ombra {
			transition: none;
		}
	}
</style>
