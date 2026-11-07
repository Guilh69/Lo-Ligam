<script>
	// La page d'essai d'une piste de palette (07-11) : les vrais composants du site
	// (pièces de papier.css, icônes, croix du logo, polices) dans une palette que
	// Romain peut retoucher en direct, clair et sombre. Aucun jeton du site n'est
	// modifié : les variables sont posées sur la scène seulement.
	import { onMount } from 'svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import PaletteOutil from './PaletteOutil.svelte';
	import { analyser, accorderTuiles, hexValide } from './coherence.js';
	import { PISTES, ORDRE_PISTES, variablesCss, copierPiste } from './pistes.js';

	let { piste } = $props();

	const CLE = `lo-ligam-palette-essai-v1-${piste}`;
	// svelte-ignore state_referenced_locally
	let etat = $state(copierPiste(piste));
	let mode = $state('clair');
	let message = $state('');
	let delai;

	const roles = $derived(etat[mode]);
	const analyse = $derived(analyser(roles));
	const vars = $derived(variablesCss(roles, mode));
	// svelte-ignore state_referenced_locally
	const infos = PISTES[piste];

	const CHIPS = ['Tot', 'Occitan', 'Francés', 'Catalan'];
	// les tuiles de S'apren (textes déjà en ligne sur /apren)
	const TUILES = [
		{ n: '01', t: 'Corses en visio', d: 'Sol a sol. Lo primièr es ofèrt.' },
		{ n: '02', t: 'Lo parcors', d: 'De zèro fins al nivèl B1, leiçon per leiçon.' },
		{ n: '03', t: 'Anem ! per los pichons', d: 'De 3 a 6 ans : se tòca una bèstia, s’ausís son nom.' },
		{ n: '04', t: 'Jòcs', d: 'Dos jòcs per jogar amb los mots : la sèrp de las letras e los panièrs.' },
		{ n: '05', t: 'Mots en imatges', d: '' }
	];
	// les familles de jeux et la tuile dont elles prennent la couleur (palette.js : JEUX)
	const FAMILIAS = [
		['Jòcs d’adreça', 1],
		['Jòcs de mots', 5],
		['Jòcs d’observacion', 3],
		['Jòcs de memòria', 2],
		['Jòcs per escotar', 4]
	];

	function valide(o) {
		const ok = (t) => t && ['fond', 'surface', 'texte', 'surClair', 'surSombre', 'action', 'choisi', 'juste', 'carton', 'valeur'].every((k) => hexValide(t[k])) && Array.isArray(t.tuiles) && t.tuiles.length === 6 && t.tuiles.every(hexValide);
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
		etat = copierPiste(piste);
		try {
			localStorage.removeItem(CLE);
		} catch {}
		dire('Piste rétablie.');
	}
	async function copier() {
		const texte = JSON.stringify({ piste, ...$state.snapshot(etat) }, null, 2);
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
	<title>Essai de palette : {infos.nom}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="colonne">
		<nav class="comparer" aria-label="Comparer les pistes">
			<span>Comparer :</span>
			{#each ORDRE_PISTES as id (id)}
				<a href="/ensag/palette-{id}" aria-current={id === piste ? 'page' : undefined}>{PISTES[id].nom.replace(' · ', ' ')}</a>
			{/each}
		</nav>

		<main id="contengut" class="scene" style={vars}>
			<p class="explic"><strong>{infos.titre}.</strong> {infos.mot}</p>

			<header class="barre">
				<span class="marque"><Crotz teula talha={30} /><span class="nom">Lo Ligam</span></span>
				<div class="boutons">
					<a class="pc reservar" href="#reservar">Reservar un cors</a>
					<a class="pc pc-2 compte" href="#compte"><Icona nom="persona" size="1.15em" /><span class="mot-compte">Se connectar</span></a>
					<button type="button" class="pc pc-or" aria-pressed="true">Òc</button>
					<button type="button" class="pc pc-2">Fr</button>
					<button type="button" class="pc pc-2 pc-icone" aria-label="Langue"><Icona nom="mond" /></button>
					<button type="button" class="pc pc-2 menu"><Icona nom="menu" /><span class="mot-menu">Menú</span></button>
				</div>
			</header>

			<section class="heros">
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
				<p class="petit">Passa la mirga suls tres mots.</p>
			</section>

			<section aria-labelledby="t-apren">
				<h2 id="t-apren" class="titre-section"><span class="valeur">02</span> S’apren</h2>
				<div class="tuiles">
					{#each TUILES as tu, i (tu.n)}
						<a class="tuile t{i + 1}" href="#t{tu.n}" style="--tu:var(--tu{i + 1});--tu-t:var(--tu{i + 1}-t)">
							<span class="num">{tu.n}</span>
							<span class="tit">{tu.t}</span>
							{#if tu.d}<span class="desc">{tu.d}</span>{/if}
						</a>
					{/each}
				</div>
			</section>

			<section aria-labelledby="t-jocs">
				<h2 id="t-jocs" class="titre-section">La sala de jòcs</h2>
				<div class="chips" role="group" aria-label="Filtrer les jeux">
					{#each CHIPS as c, i (c)}<button type="button" class="pc pc-2 pc-chip" aria-pressed={i === 0}>{c}</button>{/each}
				</div>
				<div class="familles">
					{#each FAMILIAS as [nom, n] (nom)}
						<div class="fam" style="--tu:var(--tu{n});--tu-t:var(--tu{n}-t)">{nom}</div>
					{/each}
				</div>
			</section>

			<section aria-labelledby="t-reps">
				<h2 id="t-reps" class="titre-section">Les réponses</h2>
				<div class="reps">
					<button type="button" class="pc pc-rep est-bon">Bonjorn <Icona nom="valide" /></button>
					<button type="button" class="pc pc-rep">Mercé</button>
					<button type="button" class="pc pc-rep est-faux">Tornar <Icona nom="fermer" /></button>
				</div>
				<p class="legende">Bonne réponse, réponse neutre, erreur : chaque état porte aussi une icône ou un mot, jamais la couleur seule.</p>
			</section>

			<section class="textes" aria-label="Textes">
				<p class="corps">Texte courant sur le fond de la page : Benvenguda dins ton ligam amb lo mond occitan.</p>
				<p class="second">Texte secondaire : Passa la mirga suls tres mots.</p>
				<p class="corps"><a class="lien-texte" href="#lien">Un lien dans le texte</a> et <span class="valeur-texte">un mot mis en valeur</span>.</p>
			</section>
		</main>
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
	.comparer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.9rem;
		align-items: center;
		padding: 0.6rem clamp(1rem, 3vw, 2rem);
		background: #ffffff;
		color: #1d1b1a;
		border-bottom: 1px solid #d6d2ce;
		font: 0.85rem system-ui, sans-serif;
	}
	.comparer a {
		color: #1d1b1a;
		padding: 0.2rem 0;
	}
	.comparer a[aria-current='page'] {
		font-weight: 700;
		text-decoration: none;
		border-bottom: 2px solid #1d1b1a;
	}

	/* ---- la scène : tout passe par les variables posées en style ---- */
	.scene {
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		padding: 1.2rem clamp(1rem, 3vw, 2.5rem) 6rem;
		min-height: 100vh;
	}
	.explic {
		max-width: 62ch;
		margin: 0 0 1.4rem;
		padding: 0.7rem 0.9rem;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
		line-height: 1.45;
	}
	.explic strong {
		color: var(--t-tinta);
	}

	.barre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		margin-bottom: 2.4rem;
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
	@media (max-width: 40rem) {
		.mot-compte,
		.mot-menu {
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
		/* comme sur le site : sur téléphone, la réservation reste dans le menu */
		.boutons :global(.reservar) {
			display: none;
		}
	}

	.heros {
		margin-bottom: 3.2rem;
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
	h1 {
		display: grid;
		margin: 0 0 1.2rem;
		font: 400 clamp(2.6rem, 8vw, 5rem) / 1.02 var(--font-heading);
	}
	h1 .decale {
		padding-left: 0.9em;
	}
	.valeur {
		color: var(--t-aur);
	}
	.lead {
		max-width: 28ch;
		margin: 0 0 1.4rem;
		color: var(--t-tinta-2);
		font-size: 1.15rem;
		line-height: 1.55;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.6rem;
		margin-bottom: 1rem;
	}
	.lien {
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration: none;
		border-bottom: 2px solid var(--t-accion);
		padding-bottom: 0.15rem;
	}
	.petit {
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.8rem;
	}

	.titre-section {
		margin: 0 0 1rem;
		font: 400 1.7rem var(--font-heading);
	}
	section {
		margin-bottom: 3rem;
	}
	.tuiles {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: repeat(2, 1fr);
	}
	.tuile {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-height: 9.5rem;
		padding: 1rem 1.1rem;
		background: var(--tu);
		color: var(--tu-t);
		border: 1px solid color-mix(in srgb, var(--tu-t) 16%, transparent);
		border-radius: 14px;
		text-decoration: none;
	}
	.tuile .num {
		font: 400 1.6rem var(--font-heading);
	}
	.tuile .tit {
		font: 400 1.05rem var(--font-heading);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.tuile .desc {
		font-size: 0.88rem;
		line-height: 1.4;
	}
	.t1 {
		grid-column: 1 / -1;
		min-height: 11rem;
	}
	.t1 .tit {
		font-size: 1.6rem;
	}
	@media (min-width: 52rem) {
		.tuiles {
			grid-template-columns: 1.5fr 1fr 1fr;
		}
		.t1 {
			grid-column: 1;
			grid-row: span 2;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.familles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
		gap: 0.7rem;
	}
	.fam {
		min-height: 5.5rem;
		padding: 0.9rem;
		background: var(--tu);
		color: var(--tu-t);
		border: 1px solid color-mix(in srgb, var(--tu-t) 16%, transparent);
		border-radius: 14px;
		font: 400 1rem var(--font-heading);
	}

	.reps {
		display: grid;
		gap: 0.6rem;
		max-width: 22rem;
	}
	.legende {
		max-width: 52ch;
		margin: 0.8rem 0 0;
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}

	.textes {
		display: grid;
		gap: 0.5rem;
	}
	.textes p {
		margin: 0;
	}
	.second {
		color: var(--t-tinta-2);
	}
	.lien-texte {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	.valeur-texte {
		color: var(--t-aur);
		font-weight: 700;
	}

	/* ordinateur : la scène à gauche, le panneau à droite */
	@media (min-width: 64rem) {
		.page {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 23rem;
		}
		.scene {
			padding-bottom: 3rem;
		}
	}
</style>
