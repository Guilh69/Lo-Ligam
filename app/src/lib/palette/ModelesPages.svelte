<script>
	// Modèles simplifiés des écrans de l'appli (Romain, 2026-11-07 : « il faudrait des modèles
	// simplifiés des pages de l'appli pour se faire une idée »), dans la base mêlée (pistes.js :
	// PISTES.melange) et avec le panneau « Retoucher les couleurs ». Ce sont des maquettes : les
	// vraies pièces de papier.css, la croix du logo et les polices, mais des mises en page
	// réduites à l'essentiel et des textes déjà présents sur le site. Rien n'est modifié sur le
	// site : les variables ne sont posées que sur le cadre.
	import { onMount } from 'svelte';
	import Crotz from '$lib/components/Crotz.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import PaletteOutil from './PaletteOutil.svelte';
	import { analyser, accorderTuiles, hexValide } from './coherence.js';
	import { PISTES, variablesCss, copierPiste } from './pistes.js';

	const PISTE = 'melange';
	const CLE = 'lo-ligam-palette-modeles-v1';
	const infos = PISTES[PISTE];

	let etat = $state(copierPiste(PISTE));
	let mode = $state('clair');
	let page = $state('accueil');
	let appareil = $state('ordi');
	let message = $state('');
	let delai;

	const roles = $derived(etat[mode]);
	const analyse = $derived(analyser(roles));
	const vars = $derived(variablesCss(roles, mode));

	const PAGES = [
		['accueil', 'Accueil'],
		['apren', 'S’apren'],
		['jocs', 'Jòcs'],
		['leicon', 'Leçon'],
		['menu', 'Menu']
	];
	// zones de la silhouette : [nom, tuile, points du polygone, position de l'étiquette]
	const ZONAS = [
		['Limousin', 6, '110,22 190,14 216,62 170,96 114,82', [160, 58]],
		['Auvergnat', 3, '190,14 266,24 286,76 240,102 216,62', [240, 62]],
		['Vivaro-alpin', 2, '266,24 342,40 352,112 300,126 286,76', [312, 84]],
		['Gascon', 5, '28,142 112,100 170,124 160,216 90,256 30,226', [98, 178]],
		['Languedocien', 1, '170,96 240,102 300,126 290,200 230,232 160,216 170,124', [226, 168]],
		['Provençal', 4, '300,126 352,112 376,160 360,216 290,216 290,200', [326, 170]]
	];
	const TUILES = [
		['01', 'Corses en visio', 'Sol a sol. Lo primièr es ofèrt.'],
		['02', 'Lo parcors', 'De zèro fins al nivèl B1, leiçon per leiçon.'],
		['03', 'Anem ! per los pichons', 'De 3 a 6 ans : se tòca una bèstia, s’ausís son nom.'],
		['04', 'Jòcs', 'Dos jòcs per jogar amb los mots.'],
		['05', 'Mots en imatges', ''],
		['06', 'Remira', '']
	];
	const FAMILIAS = [
		['Jòcs d’adreça', 1, [['La sèrp de las letras', true], ['Los panièrs', true]]],
		['Jòcs de mots', 5, [['Mots crosats', false]]],
		['Jòcs d’observacion', 3, [['Pausa los mots', true]]],
		['Jòcs de memòria', 2, [['Los parelhs', false]]],
		['Jòcs per escotar', 4, [['Escota e causís', false]]]
	];
	const CHIPS = ['Tot', 'Vocabulari', 'Ortografia', 'Gramatica'];

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
		const texte = JSON.stringify({ piste: PISTE, ...$state.snapshot(etat) }, null, 2);
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
	<title>Modèles de pages : base mêlée</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet barre()}
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
{/snippet}

<div class="page">
	<div class="colonne">
		<nav class="choix" aria-label="Choisir l’écran et l’appareil">
			<div class="groupe" role="group" aria-label="Écran">
				{#each PAGES as [id, nom] (id)}
					<button type="button" aria-pressed={page === id} onclick={() => (page = id)}>{nom}</button>
				{/each}
			</div>
			<div class="groupe" role="group" aria-label="Appareil">
				<button type="button" aria-pressed={appareil === 'ordi'} onclick={() => (appareil = 'ordi')}>Ordinateur</button>
				<button type="button" aria-pressed={appareil === 'tel'} onclick={() => (appareil = 'tel')}>Téléphone</button>
			</div>
		</nav>
		<p class="explic"><strong>{infos.titre}.</strong> {infos.mot}</p>

		<div class="zone">
			<main id="contengut" class="cadre {appareil}" style={vars}>
				<div class="ecran">
					{#if page === 'accueil'}
						<section class="m-accueil" aria-label="Modèle de l’accueil">
							{@render barre()}
							<div class="a-grille">
								<div class="a-texte">
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
								<figure class="a-carta">
									<svg viewBox="0 0 400 280" role="img" aria-label="Silhouette simplifiée de l’Occitanie en six zones de couleur">
										{#each ZONAS as [nom, t, pts] (nom)}
											<polygon points={pts} style="fill:var(--tu{t});" stroke="var(--t-fons)" stroke-width="3" stroke-linejoin="round" />
										{/each}
									</svg>
									<ul class="legende" aria-label="Les six zones">
										{#each ZONAS as [nom, t] (nom)}
											<li><span class="pastille" style="background:var(--tu{t})"></span>{nom}</li>
										{/each}
									</ul>
									<figcaption>Silhouette simplifiée : les six zones prennent les couleurs des tuiles.</figcaption>
								</figure>
							</div>
						</section>
					{:else if page === 'apren'}
						<section class="m-apren" aria-label="Modèle de S’apren">
							{@render barre()}
							<h1 class="titre-rubrique"><span class="valeur">02</span> S’apren</h1>
							<div class="tuiles">
								{#each TUILES as [n, t, d], i (n)}
									<a class="tuile t{i + 1}" href="#t{n}" style="--tu:var(--tu{i + 1});--tu-t:var(--tu{i + 1}-t)">
										<span class="num">{n}</span>
										<span class="tit">{t}</span>
										{#if d}<span class="desc">{d}</span>{/if}
									</a>
								{/each}
							</div>
						</section>
					{:else if page === 'jocs'}
						<section class="m-jocs" aria-label="Modèle de la salle de jeux">
							{@render barre()}
							<h1 class="titre-rubrique">La sala de jòcs</h1>
							<div class="chips" role="group" aria-label="Filtrer les jeux">
								{#each CHIPS as c, i (c)}<button type="button" class="pc pc-2 pc-chip" aria-pressed={i === 0}>{c}</button>{/each}
							</div>
							<div class="familles">
								{#each FAMILIAS as [nom, n, jeux] (nom)}
									<article class="fam" style="--tu:var(--tu{n});--tu-t:var(--tu{n}-t)">
										<h2>{nom}</h2>
										<ul>
											{#each jeux as [j, dispo] (j)}
												<li>
													<span>{j}</span>
													{#if dispo}<span class="jogar">Jogar</span>{:else}<span class="avenir">A venir</span>{/if}
												</li>
											{/each}
										</ul>
									</article>
								{/each}
							</div>
						</section>
					{:else if page === 'leicon'}
						<section class="m-leicon" aria-label="Modèle d’un exercice de leçon">
							<header class="l-haut">
								<button type="button" class="pc pc-2 pc-icone" aria-label="Quitter"><Icona nom="fermer" /></button>
								<div class="progres" role="progressbar" aria-valuenow="3" aria-valuemin="0" aria-valuemax="8" aria-label="Exercice 3 sur 8"><span style="width:37.5%"></span></div>
								<span class="compte-ex">3 / 8</span>
							</header>
							<div class="l-corps">
								<p class="l-etiq">Choisis la bonne réponse</p>
								<h1 class="l-question">Comment dit-on « bonjour » en occitan ?</h1>
								<div class="reps">
									<button type="button" class="pc pc-rep est-bon">Bonjorn <Icona nom="valide" /></button>
									<button type="button" class="pc pc-rep est-faux">Mercé <Icona nom="fermer" /></button>
									<button type="button" class="pc pc-rep">Tornar</button>
								</div>
							</div>
							<footer class="l-bas">
								<p><Icona nom="valide" /> Bonne réponse</p>
								<a class="pc pc-grand" href="#suite">Contunhar <Icona nom="suivant" /></a>
							</footer>
						</section>
					{:else}
						<section class="m-menu" aria-label="Modèle du menu ouvert">
							<header class="me-haut">
								<a class="retorn" href="#acuelh"><Icona nom="revenir" /> Tornar a l’acuèlh</a>
								<button type="button" class="ferma" aria-label="Fermer le menu"><Icona nom="fermer" size="1.4em" /></button>
							</header>
							<ol class="me-liste">
								<li><a href="#parla"><span class="n">01</span><span class="t">Se parla</span><Icona nom="suivant" size="1.4em" /></a></li>
								<li><a href="#apren"><span class="n">02</span><span class="t">S’apren</span><Icona nom="suivant" size="1.4em" /></a></li>
								<li><a href="#amassa"><span class="n">03</span><span class="t">Amassa</span><Icona nom="suivant" size="1.4em" /></a></li>
							</ol>
							<footer class="me-bas">
								<span class="liens">Mon ligam amb l’occitan · Contacte · Instagram</span>
								<a class="reserva" href="#reservar">Reservar un primièr cors <Icona nom="suivant" /></a>
							</footer>
						</section>
					{/if}
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

	/* ---- la commande des modèles (hors palette : couleurs fixes) ---- */
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
		max-width: 78ch;
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

	/* ---- le cadre : tout passe par les variables posées en style ---- */
	.cadre {
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		margin: 0 auto;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 8px 30px rgba(0, 0, 0, 0.1);
	}
	.cadre.tel {
		max-width: 390px;
		min-height: 780px;
		border-radius: 26px;
		overflow: hidden;
	}
	.ecran {
		container-type: inline-size;
		min-height: inherit;
		padding: clamp(1rem, 2.4vw, 2rem);
	}
	.cadre.tel .ecran {
		padding: 1rem;
	}

	/* barre du haut */
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

	h1 {
		margin: 0;
	}
	.valeur {
		color: var(--t-aur);
	}
	.titre-rubrique {
		margin: 0 0 1.2rem;
		font: 400 clamp(2rem, 7cqw, 3.4rem) / 1.05 var(--font-heading);
	}

	/* ---- accueil ---- */
	.a-grille {
		display: grid;
		gap: 1.6rem;
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
	.m-accueil h1 {
		display: grid;
		margin-bottom: 1rem;
		font: 400 clamp(2.4rem, 10cqw, 4.8rem) / 1.02 var(--font-heading);
	}
	.m-accueil h1 .decale {
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
	.a-carta {
		margin: 0;
	}
	.a-carta svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.legende {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1rem;
		margin: 0.7rem 0 0;
		padding: 0;
		list-style: none;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.legende li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
	.pastille {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 4px;
	}
	.a-carta figcaption {
		margin-top: 0.4rem;
		color: var(--t-tinta-2);
		font-size: 0.78rem;
	}
	@container (min-width: 44rem) {
		.a-grille {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
			align-items: center;
		}
	}

	/* ---- S'apren ---- */
	.tuiles {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: repeat(2, 1fr);
	}
	.tuile {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-height: 9rem;
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
	.t6 {
		grid-column: 1 / -1;
		min-height: 5.5rem;
	}
	@container (min-width: 44rem) {
		.tuiles {
			grid-template-columns: 1.5fr 1fr 1fr;
		}
		.t1 {
			grid-column: 1;
			grid-row: span 2;
		}
	}

	/* ---- jeux ---- */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.2rem;
	}
	.familles {
		display: grid;
		gap: 0.8rem;
		grid-template-columns: 1fr;
	}
	.fam {
		padding: 1rem 1.1rem;
		background: var(--tu);
		color: var(--tu-t);
		border: 1px solid color-mix(in srgb, var(--tu-t) 16%, transparent);
		border-radius: 14px;
	}
	.fam h2 {
		margin: 0 0 0.6rem;
		font: 400 1.1rem var(--font-heading);
	}
	.fam ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.fam li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.55rem 0;
		border-top: 1px solid color-mix(in srgb, var(--tu-t) 28%, transparent);
		font-weight: 600;
	}
	.jogar {
		padding: 0.25rem 0.8rem;
		border-radius: 8px;
		background: var(--tu-t);
		color: var(--tu);
		font-size: 0.82rem;
		font-weight: 700;
	}
	.avenir {
		padding: 0.2rem 0.6rem;
		border: 1px dashed currentColor;
		border-radius: 8px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	@container (min-width: 44rem) {
		.familles {
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		}
	}

	/* ---- leçon ---- */
	.m-leicon {
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
		min-height: 36rem;
		max-width: 38rem;
		margin: 0 auto;
	}
	.l-haut {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}
	.progres {
		flex: 1;
		height: 0.8rem;
		border-radius: 999px;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
		overflow: hidden;
	}
	.progres span {
		display: block;
		height: 100%;
		background: var(--pc-juste);
	}
	.compte-ex {
		font-weight: 700;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	.l-corps {
		flex: 1;
	}
	.l-etiq {
		margin: 0 0 0.5rem;
		color: var(--t-aur);
		font: 700 0.78rem var(--font-body);
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
	.l-question {
		margin: 0 0 1.4rem;
		font: 400 clamp(1.5rem, 6cqw, 2.1rem) / 1.2 var(--font-heading);
	}
	.reps {
		display: grid;
		gap: 0.7rem;
	}
	.l-bas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
		background: var(--t-fons-2);
		border: 1px solid var(--t-linha);
		border-radius: 14px;
	}
	.l-bas p {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-weight: 700;
	}

	/* ---- menu ouvert : une tuile de la couleur d'action ---- */
	.m-menu {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		min-height: 36rem;
		padding: clamp(1rem, 3vw, 2rem);
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		border-radius: 18px;
	}
	.me-haut {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.retorn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: inherit;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.ferma {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1.5px solid currentColor;
		border-radius: 12px;
		background: transparent;
		color: inherit;
	}
	.me-liste {
		flex: 1;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.me-liste li {
		border-top: 1px solid color-mix(in srgb, var(--t-accion-tinta) 35%, transparent);
	}
	.me-liste a {
		display: grid;
		grid-template-columns: 3.4rem 1fr auto;
		align-items: center;
		gap: 0.6rem;
		padding: 0.9rem 0;
		color: inherit;
		text-decoration: none;
	}
	.me-liste .n {
		font: 400 1.3rem var(--font-heading);
		opacity: 0.8;
	}
	.me-liste .t {
		font: 400 clamp(1.8rem, 8cqw, 3rem) / 1.1 var(--font-heading);
	}
	.me-bas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--t-accion-tinta) 35%, transparent);
	}
	.liens {
		font-weight: 600;
		font-size: 0.9rem;
	}
	.reserva {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.3rem;
		border-radius: 999px;
		background: var(--t-accion-tinta);
		color: var(--t-accion);
		font-weight: 700;
		text-decoration: none;
	}

	@media (min-width: 64rem) {
		.page {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 23rem;
		}
	}
</style>
