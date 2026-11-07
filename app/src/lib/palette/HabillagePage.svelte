<script>
	// Habiller un fond sobre avec des photos et des dessins (Romain, 2026-11-07 : « un fond sobre
	// mais jouer avec des visuels et des photos pour habiller… ne pas avoir peur de la couleur,
	// l'important est qu'elles s'accordent bien et qu'on comprenne la logique de hiérarchie »).
	// Un seul écran (accueil + S'apren) en trois habillages que l'on active séparément ou
	// ensemble : 1 · bandeaux de photos entre les blocs ; 2 · photos dans les tuiles, teintées
	// de la couleur de la rubrique (vraie couleur au survol : décision du 06-11) ; 3 · dessins et
	// pictogrammes. Les photos sont celles de Romain déjà en ligne (static/apren/paisatges,
	// sans GPS, sans personnes). Base de couleurs : PISTES.melange. Rien n'est modifié sur le site.
	import { onMount } from 'svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import PaletteOutil from './PaletteOutil.svelte';
	import { analyser, accorderTuiles, hexValide } from './coherence.js';
	import { PISTES, variablesCss, copierPiste } from './pistes.js';

	const PISTE = 'melange';
	const CLE = 'lo-ligam-palette-habillage-v1';
	const infos = PISTES[PISTE];
	const PH = '/apren/paisatges/';

	let etat = $state(copierPiste(PISTE));
	let mode = $state('clair');
	let appareil = $state('ordi');
	let choix = $state('melange');
	let message = $state('');
	let delai;

	const roles = $derived(etat[mode]);
	const analyse = $derived(analyser(roles));
	const vars = $derived(variablesCss(roles, mode));

	// quels habillages sont actifs
	const PRESETS = [
		['sans', 'Sans habillage', { bandeaux: false, photos: false, dessins: false }],
		['bandeaux', '1 · Bandeaux', { bandeaux: true, photos: false, dessins: false }],
		['photos', '2 · Photos teintées', { bandeaux: false, photos: true, dessins: false }],
		['dessins', '3 · Dessins', { bandeaux: false, photos: false, dessins: true }],
		['melange', 'Les trois ensemble', { bandeaux: true, photos: true, dessins: true }]
	];
	const actif = $derived(PRESETS.find((p) => p[0] === choix)[2]);

	// [numéro, titre, description, pictogramme, photo]
	const TUILES = [
		['01', 'Corses en visio', 'Sol a sol. Lo primièr es ofèrt.', 'visio', 'montanha-roja-1024.webp'],
		['02', 'Lo parcors', 'De zèro fins al nivèl B1, leiçon per leiçon.', 'parcors', 'camin-1024.webp'],
		['03', 'Anem ! per los pichons', 'De 3 a 6 ans : se tòca una bèstia, s’ausís son nom.', 'anem', 'montanha-flors-1024.webp'],
		['04', 'Jòcs', 'Dos jòcs per jogar amb los mots.', 'jocs', 'mar-pin-1024.webp'],
		['05', 'Mots en imatges', '', 'imatges', 'port-800.webp'],
		['06', 'Remira', '', 'remira', 'plaja-1024.webp']
	];
	const BANDES = ['plana-1024.webp', 'montanha-vista-1024.webp'];
	// silhouette simplifiée (même dessin que les modèles de pages) : [nom, tuile, points]
	const ZONAS = [
		['Limousin', 6, '110,22 190,14 216,62 170,96 114,82'],
		['Auvergnat', 3, '190,14 266,24 286,76 240,102 216,62'],
		['Vivaro-alpin', 2, '266,24 342,40 352,112 300,126 286,76'],
		['Gascon', 5, '28,142 112,100 170,124 160,216 90,256 30,226'],
		['Languedocien', 1, '170,96 240,102 300,126 290,200 230,232 160,216 170,124'],
		['Provençal', 4, '300,126 352,112 376,160 360,216 290,216 290,200']
	];

	function valide(o) {
		const ok = (t) =>
			t &&
			['fond', 'surface', 'texte', 'surClair', 'surSombre', 'action', 'choisi', 'juste', 'carton', 'valeur'].every((k) => hexValide(t[k])) &&
			Array.isArray(t.tuiles) &&
			t.tuiles.length === 6 &&
			t.tuiles.every(hexValide);
		return o && ok(o.clair) && ok(o.sombre);
	}
	onMount(() => {
		try {
			const s = localStorage.getItem(CLE);
			if (s) {
				const o = JSON.parse(s);
				if (valide(o)) etat = { clair: o.clair, sombre: o.sombre };
			}
		} catch {}
	});
	function sauver() {
		try {
			localStorage.setItem(CLE, JSON.stringify($state.snapshot(etat)));
		} catch {}
	}
	function dire(m) {
		message = m;
		clearTimeout(delai);
		delai = setTimeout(() => (message = ''), 5000);
	}
	function changer(cle, v, i = null) {
		if (cle === 'tuiles') etat[mode].tuiles[i] = v;
		else etat[mode][cle] = v;
		sauver();
	}
	function accorder() {
		etat[mode].tuiles = accorderTuiles(etat[mode].tuiles, 0, etat[mode].surSombre);
		sauver();
		dire('Tuiles accordées : même clarté, même intensité tamisée, teintes conservées (la première reste telle quelle).');
	}
	function retablir() {
		etat = copierPiste(PISTE);
		try {
			localStorage.removeItem(CLE);
		} catch {}
		dire('Base rétablie.');
	}
	async function copier() {
		const texte = JSON.stringify({ piste: PISTE, habillage: choix, ...$state.snapshot(etat) }, null, 2);
		try {
			await navigator.clipboard.writeText(texte);
			dire('Palette copiée : colle-la dans la conversation avec Claude.');
		} catch {
			const z = document.createElement('textarea');
			z.value = texte;
			document.body.appendChild(z);
			z.select();
			const ok = document.execCommand?.('copy');
			z.remove();
			dire(ok ? 'Palette copiée : colle-la dans la conversation avec Claude.' : 'La copie a échoué sur cet appareil.');
		}
	}
</script>

<svelte:head>
	<title>Habillage : photos, dessins et bandeaux</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="colonne">
		<nav class="choix" aria-label="Choisir l’habillage et l’appareil">
			<div class="groupe" role="group" aria-label="Habillage">
				{#each PRESETS as [id, nom] (id)}
					<button type="button" aria-pressed={choix === id} onclick={() => (choix = id)}>{nom}</button>
				{/each}
			</div>
			<div class="groupe" role="group" aria-label="Appareil">
				<button type="button" aria-pressed={appareil === 'ordi'} onclick={() => (appareil = 'ordi')}>Ordinateur</button>
				<button type="button" aria-pressed={appareil === 'tel'} onclick={() => (appareil = 'tel')}>Téléphone</button>
			</div>
		</nav>
		<p class="explic">
			<strong>Un fond blanc sobre, habillé.</strong> Même écran, trois manières de l'habiller : des bandeaux de photos entre les blocs, des photos teintées dans les tuiles (la vraie couleur revient au survol), des dessins et pictogrammes. Photos de Romain déjà en ligne, sans personnes.
		</p>

		<div class="zone">
			<main id="contengut" class="cadre {appareil}" style={vars}>
				<div class="ecran">
					<header class="barre">
						<span class="marque"><Crotz teula talha={30} /><span class="nom">Lo Ligam</span></span>
						<div class="boutons">
							<a class="pc reservar" href="#reservar">Reservar un cors</a>
							<a class="pc pc-2 compte" href="#compte"><Icona nom="persona" size="1.15em" /><span class="mot-bouton">Se connectar</span></a>
							<button type="button" class="pc pc-or" aria-pressed="true">Òc</button>
							<button type="button" class="pc pc-2">Fr</button>
							<button type="button" class="pc pc-2 pc-icone" aria-label="Langue"><Icona nom="mond" /></button>
							<button type="button" class="pc pc-2 menu"><Icona nom="menu" /><span class="mot-bouton">Menú</span></button>
						</div>
					</header>

					<section class="heros" class:avec-dessin={actif.dessins} aria-label="Accueil">
						<div class="h-texte">
							<p class="kicker"><span class="filet"></span>L’OCCITAN</p>
							<h1>
								<span>Se parla.</span>
								<span class="decale">S’apren.</span>
								<span class="valeur">Amassa.</span>
							</h1>
							<p class="lead">Benvenguda dins ton ligam amb lo mond occitan. D’ont que siás, aicí siès en çò tieu.</p>
							<div class="ctas">
								<a class="pc pc-grand" href="#carta">Dobrir la carta <Icona nom="suivant" /></a>
								<a class="lien" href="#apren">Aprene l’occitan</a>
							</div>
						</div>
						{#if actif.dessins}
							<figure class="h-carta">
								<svg viewBox="0 0 400 280" role="img" aria-label="Silhouette simplifiée de l’Occitanie en six zones de couleur">
									{#each ZONAS as [nom, t, pts] (nom)}
										<polygon points={pts} style="fill:var(--tu{t});" stroke="var(--t-fons)" stroke-width="3" stroke-linejoin="round" />
									{/each}
								</svg>
							</figure>
						{/if}
					</section>

					{#if actif.bandeaux}
						<figure class="bande"><img src="{PH}{BANDES[0]}" alt="" loading="lazy" decoding="async" /></figure>
					{/if}

					<section aria-labelledby="t-apren">
						<h2 id="t-apren" class="titre-rubrique"><span class="valeur">02</span> S’apren</h2>
						<div class="tuiles">
							{#each TUILES as [n, t, d, picto, photo], i (n)}
								<a class="tuile t{i + 1}" class:avec-photo={actif.photos} class:avec-picto={actif.dessins} href="#t{n}" style="--tu:var(--tu{i + 1});--tu-t:var(--tu{i + 1}-t)">
									{#if actif.photos}
										<span class="photo" aria-hidden="true">
											<img src="{PH}{photo}" alt="" loading="lazy" decoding="async" />
											<span class="teinte"></span>
										</span>
									{/if}
									<span class="corps">
										<span class="num">{n}</span>
										<span class="tit">{t}</span>
										{#if d}<span class="desc">{d}</span>{/if}
									</span>
									{#if actif.dessins}
										<span class="picto"><Pictograma nom={picto} size={i === 0 && !actif.photos ? '6.5rem' : '2.8rem'} /></span>
									{/if}
								</a>
							{/each}
						</div>
					</section>

					{#if actif.bandeaux}
						<figure class="bande"><img src="{PH}{BANDES[1]}" alt="" loading="lazy" decoding="async" /></figure>
					{/if}

					<section class="logique" aria-labelledby="t-logique">
						<h2 id="t-logique">La logique des couleurs <small>(proposition, à discuter)</small></h2>
						<ul>
							<li><span class="pt" style="background:var(--t-accion)"></span><span><strong>Le rouge</strong> : ce qu’on peut faire, un clic. Un seul bouton rouge par écran.</span></li>
							<li>
								<span class="pts"><i style="background:var(--tu2)"></i><i style="background:var(--tu3)"></i><i style="background:var(--tu4)"></i><i style="background:var(--tu5)"></i><i style="background:var(--tu6)"></i></span>
								<span><strong>Une couleur par rubrique</strong> : où l’on est. Toujours la même, sur les tuiles, les photos teintées et les pictogrammes.</span>
							</li>
							<li><span class="pt" style="background:var(--pc-or-fons)"></span><span><strong>L’or</strong> : ce qui est choisi ou mis en avant.</span></li>
							<li><span class="pt" style="background:var(--pc-juste)"></span><span><strong>Le vert</strong> : la bonne réponse.</span></li>
							<li><span class="pt vide"></span><span><strong>Blanc et brun-noir</strong> : le fond et le texte, calmes, pour laisser parler les couleurs et les photos.</span></li>
						</ul>
					</section>
				</div>
			</main>
		</div>
	</div>

	<PaletteOutil
		{roles}
		{mode}
		{analyse}
		nomPiste={infos.nom}
		onchange={changer}
		onmode={(m) => (mode = m)}
		onaccorder={accorder}
		onretablir={retablir}
		oncopier={copier}
		{message}
	/>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #ffffff;
	}
	.colonne {
		min-width: 0;
	}

	/* ---- commandes (hors palette : couleurs fixes) ---- */
	.choix {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.4rem;
		align-items: center;
		padding: 0.6rem clamp(1rem, 3vw, 2rem);
		background: #ffffff;
		border-bottom: 1px solid #d6d2ce;
		font: 0.88rem system-ui, sans-serif;
		color: #1d1b1a;
	}
	.groupe {
		display: inline-flex;
		flex-wrap: wrap;
		border: 1px solid #1d1b1a;
		border-radius: 8px;
		overflow: hidden;
	}
	.groupe button {
		min-height: 38px;
		padding: 0 0.9rem;
		border: 0;
		background: #ffffff;
		color: #1d1b1a;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.groupe button + button {
		border-left: 1px solid #1d1b1a;
	}
	.groupe button[aria-pressed='true'] {
		background: #1d1b1a;
		color: #ffffff;
	}
	.groupe button:focus-visible {
		outline: 3px solid #0b63c8;
		outline-offset: -3px;
	}
	.explic {
		max-width: 90ch;
		margin: 0;
		padding: 0.6rem clamp(1rem, 3vw, 2rem);
		background: #ffffff;
		color: #55504c;
		font: 0.86rem/1.45 system-ui, sans-serif;
		border-bottom: 1px solid #e3e0dd;
	}
	.explic strong {
		color: #1d1b1a;
	}
	.zone {
		background: #e6e6e8;
		padding: clamp(0.8rem, 2vw, 1.6rem);
		min-height: 80vh;
	}

	/* ---- le cadre ---- */
	.cadre {
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		margin: 0 auto;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 8px 30px rgba(0, 0, 0, 0.1);
	}
	.cadre.tel {
		max-width: 390px;
		border-radius: 26px;
		overflow: hidden;
	}
	.ecran {
		container-type: inline-size;
		padding: clamp(1rem, 2.4vw, 2rem);
	}
	.cadre.tel .ecran {
		padding: 1rem;
	}
	.barre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		margin-bottom: 2rem;
	}
	.marque {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.nom {
		font-family: var(--font-logo);
		font-size: 1.3rem;
	}
	.boutons {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	.boutons :global(.pc) {
		--r: 9px;
		min-height: 0;
		height: 2.2rem;
		padding: 0 0.9rem;
		font-size: 0.82rem;
		gap: 0.4rem;
		white-space: nowrap;
	}
	.boutons :global(.pc-icone) {
		width: 2.2rem;
		padding: 0;
	}
	@container (max-width: 40rem) {
		.mot-bouton {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.boutons :global(.compte),
		.boutons :global(.menu) {
			width: 2.2rem;
			padding: 0;
		}
		.boutons :global(.reservar) {
			display: none;
		}
	}
	h1,
	h2 {
		margin: 0;
	}
	.valeur {
		color: var(--t-aur);
	}

	/* ---- accueil ---- */
	.heros {
		display: grid;
		gap: 1.6rem;
		margin-bottom: 2rem;
	}
	.kicker {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin: 0 0 0.6rem;
		color: var(--t-aur);
		font: 700 0.8rem var(--font-body);
		letter-spacing: 0.28em;
	}
	.filet {
		width: 3rem;
		height: 1px;
		background: currentColor;
	}
	.heros h1 {
		display: grid;
		margin-bottom: 1rem;
		font: 400 clamp(2.4rem, 10cqw, 5.2rem) / 1.02 var(--font-heading);
	}
	.heros h1 .decale {
		padding-left: 0.9em;
	}
	.lead {
		max-width: 30ch;
		margin: 0 0 1.3rem;
		color: var(--t-tinta-2);
		font-size: 1.1rem;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.4rem;
	}
	.lien {
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration: none;
		border-bottom: 2px solid var(--t-accion);
		padding-bottom: 0.15rem;
	}
	.h-carta {
		margin: 0;
	}
	.h-carta svg {
		display: block;
		width: 100%;
		height: auto;
	}
	@container (min-width: 44rem) {
		.heros.avec-dessin {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: center;
		}
	}

	/* ---- bandeaux de photos ---- */
	.bande {
		margin: 2rem 0;
		aspect-ratio: 16 / 9;
		border-radius: 16px;
		overflow: hidden;
		background: var(--t-fons-2);
	}
	.bande img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	@container (min-width: 44rem) {
		.bande {
			aspect-ratio: 21 / 7;
		}
	}

	/* ---- S'apren ---- */
	.titre-rubrique {
		margin: 0 0 1.2rem;
		font: 400 clamp(2rem, 7cqw, 3.4rem) / 1.05 var(--font-heading);
	}
	.tuiles {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: repeat(2, 1fr);
	}
	.tuile {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 9.5rem;
		background: var(--tu);
		color: var(--tu-t);
		border: 1px solid color-mix(in srgb, var(--tu-t) 16%, transparent);
		border-radius: 14px;
		overflow: hidden;
		text-decoration: none;
	}
	.corps {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1rem 1.1rem;
	}
	.tuile:not(.avec-photo) .corps {
		flex: 1;
	}
	/* dessins seuls : le pictogramme se pose en haut à droite des petites tuiles (le texte garde sa
	   largeur) ; en bas à droite des grandes, qui ont la place */
	.avec-picto:not(.avec-photo):not(.t1):not(.t6) .picto {
		top: 0.8rem;
		bottom: auto;
	}
	.num {
		font: 400 1.6rem var(--font-heading);
	}
	.tit {
		font: 400 1.05rem var(--font-heading);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.desc {
		font-size: 0.88rem;
		line-height: 1.4;
	}
	.t1 {
		grid-column: 1 / -1;
		min-height: 12rem;
	}
	.t1 .tit {
		font-size: 1.6rem;
	}
	.t6 {
		grid-column: 1 / -1;
	}
	.picto {
		position: absolute;
		right: 0.9rem;
		bottom: 0.8rem;
		color: var(--tu-t);
		line-height: 0;
	}
	.avec-photo {
		min-height: 15rem;
	}
	/* photos et dessins ensemble : le pictogramme se pose sur la photo, le texte garde sa largeur */
	.avec-photo .picto {
		top: 0.7rem;
		bottom: auto;
	}
	.photo {
		position: relative;
		isolation: isolate;
		flex: 1;
		min-height: 7rem;
		overflow: hidden;
		background: #8a8a8a;
	}
	.photo img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.08) brightness(1.12);
		transition: filter 0.4s ease;
	}
	/* la photo prend une version éclaircie de la couleur de la rubrique (multiplication) ;
	   le bloc de texte dessous garde la couleur pleine : sinon les teintes profondes
	   (sapin, turquoise) éteignent la photo */
	.teinte {
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--tu) 58%, #ffffff);
		mix-blend-mode: multiply;
		transition: opacity 0.4s ease;
	}
	@media (hover: hover) {
		.avec-photo:hover .photo img,
		.avec-photo:focus-visible .photo img {
			filter: none;
		}
		.avec-photo:hover .teinte,
		.avec-photo:focus-visible .teinte {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.photo img,
		.teinte {
			transition: none;
		}
	}
	@container (min-width: 44rem) {
		.tuiles {
			grid-template-columns: 1.5fr 1fr 1fr;
		}
		.t1 {
			grid-column: 1;
			grid-row: span 2;
		}
		.avec-photo.t1 {
			min-height: 0;
		}
	}

	/* ---- la logique des couleurs ---- */
	.logique {
		margin-top: 2.4rem;
		padding: 1.2rem 1.3rem;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
		border-radius: 14px;
	}
	.logique h2 {
		margin-bottom: 0.8rem;
		font: 700 1rem var(--font-body);
	}
	.logique small {
		color: var(--t-tinta-2);
		font-weight: 400;
	}
	.logique ul {
		display: grid;
		gap: 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.logique li {
		display: grid;
		grid-template-columns: 3.6rem 1fr;
		align-items: center;
		gap: 0.8rem;
		font-size: 0.92rem;
		line-height: 1.4;
	}
	.pt {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 6px;
		justify-self: start;
	}
	.pt.vide {
		background: var(--t-fons);
		border: 1.5px solid var(--t-tinta);
	}
	.pts {
		display: inline-flex;
	}
	.pts i {
		width: 0.9rem;
		height: 1.6rem;
	}
	.pts i:first-child {
		border-radius: 6px 0 0 6px;
	}
	.pts i:last-child {
		border-radius: 0 6px 6px 0;
	}

	@media (min-width: 64rem) {
		.page {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 23rem;
		}
	}
</style>
