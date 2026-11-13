<script>
	// Essai du 2026-11-13 : l'atelier public de S'imagina, « Las carrièras ». Les six réponses de Romain (entretien
	// du 13-11, docs/vision/entrevista-imagina-fotos-2026-11-13.md) : le visiteur imagine sur les photos de Romain,
	// touche un endroit déjà repéré, prend un mot dans une liste vérifiée par lo Congrès, voit une esquisse tout de
	// suite, peut l'enregistrer (rien ne quitte son navigateur), et repart avec un possible, une question, une audace.
	// Trois styles d'esquisse à comparer. Page de travail, pas indexée.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Estudi from '$lib/imagina/Estudi.svelte';
	import { FOTOS, endrechsDe, motsDe, NOMS_NATURA } from '$lib/imagina/atelier.js';
	import { ESTILS_ESQUISSA } from '$lib/imagina/esquissa.js';

	const QUADS = Object.fromEntries(FOTOS.map((f) => [f.clau, endrechsDe(f)]));

	let clau = $state(FOTOS[0].clau);
	let causit = $state(null);
	let motOc = $state(null);
	let estil = $state('traç');
	let mesura = $state(null);
	let esqVista = $state(null);
	let largVista = $state(0);
	let trabalh = $state(false);
	let partejable = $state(false);
	let aprochar = $state(true);
	const estreit = $derived(largVista > 0 && largVista < 600);

	const foto = $derived(FOTOS.find((f) => f.clau === clau));
	const endrech = $derived(foto.endrechs.find((e) => e.id === causit) ?? null);
	const mots = $derived(endrech ? motsDe(endrech) : []);
	const mot = $derived(mots.find((m) => m.oc === motOc) ?? null);

	onMount(() => {
		// un état donné dans l'adresse (?foto=…&endrech=…&mot=…&estil=…) : pour comparer et pour les contrôles
		const q = new URLSearchParams(location.search);
		const f = FOTOS.find((x) => x.clau === q.get('foto'));
		if (f) {
			clau = f.clau;
			const e = f.endrechs.find((x) => x.id === q.get('endrech'));
			if (e) {
				chausirEndrech(e.id);
				const m = motsDe(e).find((x) => x.oc === q.get('mot'));
				if (m) motOc = m.oc;
			}
		}
		if (ESTILS_ESQUISSA.some((s) => s.id === q.get('estil'))) estil = q.get('estil');
		// le texte se mesure sur un canevas, avec les polices du site une fois chargées
		const ctx = document.createElement('canvas').getContext('2d');
		const m = (t, font) => {
			ctx.font = font;
			return ctx.measureText(t).width;
		};
		Promise.all([
			document.fonts.load("400 40px 'Limelight'"),
			document.fonts.load("700 40px 'Luciole'"),
			document.fonts.load("400 40px 'Luciole'"),
			document.fonts.load("italic 400 40px 'Luciole'")
		])
			.catch(() => {})
			.finally(() => (mesura = m));
		try {
			const f = new File([new Blob()], 'x.jpg', { type: 'image/jpeg' });
			partejable = !!navigator.canShare?.({ files: [f] });
		} catch {
			partejable = false;
		}
	});

	function chausirFoto(c) {
		if (c === clau) return;
		clau = c;
		causit = null;
		motOc = null;
	}
	function chausirEndrech(id) {
		causit = id;
		aprochar = true;
		const ms = motsDe(foto.endrechs.find((e) => e.id === id));
		// un seul mot possible (une plaque : le vrai nom de la rue) : il se pose tout de suite
		motOc = ms.length === 1 ? ms[0].oc : ms.some((m) => m.oc === motOc) ? motOc : null;
	}

	// sur le téléphone, la photo reste en haut de l'écran : après un endroit touché, la liste des mots vient dessous
	let escenaEl = $state(null),
		motsEl = $state(null);
	function tocar(id) {
		chausirEndrech(id);
		if (innerWidth >= 1000 || !escenaEl || !motsEl) return;
		requestAnimationFrame(() => {
			// le titre « Un mot » vient se placer juste sous la photo
			const ecart = motsEl.getBoundingClientRect().top - escenaEl.getBoundingClientRect().bottom - 16;
			if (Math.abs(ecart) > 24) {
				const doux = !matchMedia('(prefers-reduced-motion: reduce)').matches;
				scrollBy({ top: ecart, behavior: doux ? 'smooth' : 'auto' });
			}
		});
	}

	const nomFichier = () =>
		`simagina-${clau}-${(mot?.oc ?? '')
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')}.jpg`;

	async function imatge() {
		const { fabricar } = await import('$lib/imagina/enregistrar.js');
		return fabricar({ foto, endrech, forma: QUADS[clau][causit], estil, mot, mesura });
	}
	async function enregistrar() {
		if (!esqVista || trabalh) return;
		trabalh = true;
		try {
			const blob = await imatge();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = nomFichier();
			document.body.append(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 4000);
		} finally {
			trabalh = false;
		}
	}
	async function partejar() {
		if (!esqVista || trabalh) return;
		trabalh = true;
		try {
			const blob = await imatge();
			await navigator.share({ files: [new File([blob], nomFichier(), { type: 'image/jpeg' })] });
		} catch {
			/* partage annulé : rien à faire */
		} finally {
			trabalh = false;
		}
	}

	const estat = $derived(
		mot && endrech
			? `Esquisse posée : « ${mot.oc} » (${mot.fr.toLowerCase()}) sur ${endrech.fr}.`
			: endrech
				? `Endroit choisi : ${endrech.fr}. Choisis un mot.`
				: ''
	);
</script>

<svelte:head>
	<title>Essai : l’atelier des rues · S’imagina · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main id="contengut" class="atelier">
		<header class="cap">
			<p class="sobre">S’imagina · essai du 13 novembre</p>
			<h1 lang="oc">Las carrièras</h1>
			<p class="intro">Choisis une photo, touche un endroit, prends un mot. L’esquisse se pose sur le mur.</p>
		</header>

		<div class="comandas triar-foto">
			<section aria-labelledby="t-foto">
				<h2 id="t-foto"><span class="n">1</span> Une photo</h2>
				<ul class="fotos">
					{#each FOTOS as f (f.clau)}
						<li>
							<button type="button" aria-pressed={f.clau === clau} onclick={() => chausirFoto(f.clau)}>
								<img src="/imagina/vinheta-{f.clau}.webp" alt="" width="320" height={Math.round((320 * f.h) / f.l)} loading="lazy" />
								<span>{f.nom}</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		</div>

		<div class="disposicion">
			<div class="escena" bind:this={escenaEl} bind:clientWidth={largVista} style="--ratio: {foto.l / foto.h}">
				<Estudi {foto} quads={QUADS[clau]} {causit} {mot} {estil} {mesura} eager aprochar={estreit && aprochar && !!causit} onchausir={tocar} onesquissa={(e) => (esqVista = e)} />
				<div class="jos">
					<p class="mencion">
						{#if mot}Esquisse : un dessin posé sur la photo. Sur place, rien de tout cela n’existe.{:else}Les endroits marqués se touchent.{/if}
					</p>
					{#if estreit && causit}
						<button type="button" class="vista" onclick={() => (aprochar = !aprochar)}>{aprochar ? 'Toute la photo' : 'Approcher'}</button>
					{/if}
				</div>
				<p class="sr" aria-live="polite">{estat}</p>
			</div>

			<div class="comandas">


				<section aria-labelledby="t-endrech">
					<h2 id="t-endrech"><span class="n">2</span> Un endroit</h2>
					<ol class="endrechs">
						{#each foto.endrechs as e, i (e.id)}
							<li>
								<button type="button" aria-pressed={e.id === causit} onclick={() => chausirEndrech(e.id)}>
									<span class="num">{i + 1}</span>
									<span>{e.fr} <small>{NOMS_NATURA[e.natura]}</small></span>
								</button>
							</li>
						{/each}
					</ol>
				</section>

				<section aria-labelledby="t-mot" class:mut={!endrech} bind:this={motsEl}>
					<h2 id="t-mot"><span class="n">3</span> Un mot</h2>
					{#if !endrech}
						<p class="ajuda">Touche d’abord un endroit sur la photo.</p>
					{:else}
						{#if endrech.natura === 'placa'}
							<p class="ajuda">
								Un nom de rue ne s’invente pas : ici, le seul mot possible est le vrai nom de la rue, écrit en occitan.
								<span class="relegir">Forme à valider par Romain.</span>
							</p>
						{/if}
						<ul class="mots">
							{#each mots as m (m.oc)}
								<li>
									<button type="button" aria-pressed={m.oc === motOc} onclick={() => (motOc = m.oc)}>
										<span class="oc" lang="oc">{m.oc}</span>
										<span class="fr">{m.fr}</span>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</section>

				<section aria-labelledby="t-estil">
					<h2 id="t-estil"><span class="n">4</span> Le style <small>à choisir par Romain</small></h2>
					<ul class="estils">
						{#each ESTILS_ESQUISSA as s (s.id)}
							<li>
								<button type="button" aria-pressed={s.id === estil} onclick={() => (estil = s.id)}>
									<span class="nom">{s.nom}</span>
									<span class="fr">{s.mot}</span>
								</button>
							</li>
						{/each}
					</ul>
				</section>

				<section aria-labelledby="t-garda">
					<h2 id="t-garda"><span class="n">5</span> Ton image</h2>
					<div class="accions">
						<button type="button" class="pc" disabled={!esqVista || trabalh} onclick={enregistrar}>Enregistrer l’image</button>
						{#if partejable}
							<button type="button" class="pc pc-2" disabled={!esqVista || trabalh} onclick={partejar}>Partager</button>
						{/if}
					</div>
					<p class="ajuda">L’image se fabrique sur ton appareil. Le site ne garde rien et n’envoie rien.</p>
				</section>
			</div>
		</div>

		{#if mot && endrech}
			<section class="comparar" aria-labelledby="t-comparar">
				<h2 id="t-comparar">Les trois styles côte à côte <small>pour choisir</small></h2>
				<div class="tres">
					{#each ESTILS_ESQUISSA as s (s.id)}
						<figure>
							<Estudi {foto} quads={QUADS[clau]} {causit} {mot} estil={s.id} {mesura} interactiu={false} />
							<figcaption><strong>{s.nom}</strong> {s.mot}</figcaption>
						</figure>
					{/each}
				</div>
			</section>
		{/if}

		<section class="sortidas" aria-labelledby="t-sortidas">
			<h2 id="t-sortidas" class="vis-sr">Avec quoi tu repars</h2>
			<p class="relegir">Brouillon de l’IA, à relire par Romain.</p>

			<article>
				<p class="nn">01</p>
				<h3>Un possible</h3>
				<p>Ton image : la rue telle qu’elle pourrait être. Elle reste chez toi. Montre-la à qui tu veux, ou garde-la.</p>
			</article>

			<article>
				<p class="nn">02</p>
				<h3>Une question : pourquoi l’occitan n’est-il pas dans la rue ?</h3>
				<p>Dans ces rues, on a parlé occitan pendant des siècles. Les plaques, elles, sont le plus souvent en français seulement.</p>
				<p>
					En 1794, l’abbé Grégoire présente à la Convention un rapport intitulé « sur la nécessité et les moyens d’anéantir les patois et d’universaliser
					l’usage de la langue française ». Les parlers d’oc y sont rangés parmi les patois.
					<a href="https://fr.wikisource.org/wiki/Rapport_Gr%C3%A9goire" rel="noopener">Le texte du rapport</a>
				</p>
				<p>
					Depuis 1992, l’article 2 de la Constitution dit : « La langue de la République est le français. » Depuis 2008, l’article 75-1 ajoute : « Les langues
					régionales appartiennent au patrimoine de la France. »
					<a
						href="https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur"
						rel="noopener">La Constitution</a
					>
				</p>
				<p>
					Depuis la loi du 21 mai 2021 (dite loi Molac, article 8), les services publics peuvent ajouter une traduction en langue régionale sur les
					panneaux et les plaques des voies publiques, quand ils les posent ou les renouvellent.
					<a href="https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000043524723" rel="noopener">La loi sur Légifrance</a>
				</p>
				<p class="pensar">La loi le permet. Alors qui décide, dans ta commune, qu’une plaque reste en français seulement ?</p>
			</article>

			<article>
				<p class="nn">03</p>
				<h3>Une audace</h3>
				<ul class="gestes">
					<li>Regarde les plaques de ta rue. S’il y en a une en occitan, prends-la en photo. S’il n’y en a pas, cherche quel serait son nom.</li>
					<li>Écris à ta mairie pour demander si elle prévoit des plaques en deux langues. Tu peux citer la loi du 21 mai 2021.</li>
					<li>Dis <span lang="oc">« bonjorn »</span> en entrant chez un commerçant. Note ce qui se passe.</li>
				</ul>
			</article>
		</section>
	</main>
</div>

<style>
	.pagina {
		--marge: clamp(16px, 4vw, 56px);
		background: var(--t-fons);
		color: var(--t-tinta);
		min-height: 100vh;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.atelier {
		max-width: 1600px;
		margin: 0 auto;
		padding: 0 var(--marge) 5rem;
		font-family: var(--font-body);
	}
	.cap {
		margin: 1.5rem 0 2rem;
	}
	.sobre {
		margin: 0;
		font-size: 0.85rem;
		color: var(--t-aur);
	}
	h1 {
		margin: 0.3rem 0 0.6rem;
		font: 400 clamp(2.4rem, 7vw, 4.2rem) / 1 var(--font-heading);
	}
	.intro {
		margin: 0;
		max-width: 34rem;
		font-size: 1.05rem;
		line-height: 1.5;
	}

	.triar-foto {
		max-width: 36rem;
	}
	.triar-foto section {
		margin-bottom: 1.4rem;
	}
	.disposicion {
		display: grid;
		gap: 1.6rem;
	}
	/* téléphone : la photo reste en haut pendant qu'on choisit, jamais plus haute que la moitié de l'écran */
	.escena {
		position: sticky;
		top: 0;
		z-index: 3;
		width: min(100%, calc(48svh * var(--ratio)));
		margin-inline: auto;
		padding: 0.5rem 0 0.4rem;
		background: var(--t-fons);
	}
	@media (min-width: 1000px) {
		.disposicion {
			grid-template-columns: minmax(0, 1.55fr) minmax(320px, 1fr);
			align-items: start;
			gap: 3rem;
		}
		.escena {
			top: 1rem;
			width: 100%;
			padding: 0;
		}
	}
	.jos {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}
	.vista {
		flex: none;
		min-height: 44px;
		margin: 0;
		padding: 0 0.2rem;
		border: 0;
		background: none;
		color: var(--t-terra);
		font: 700 0.88rem/1 var(--font-body);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
		cursor: pointer;
	}
	.vista:focus-visible {
		outline: 3px solid var(--t-aur-clar);
	}
	.mencion {
		margin: 0.6rem 0 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.sr,
	.vis-sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	section {
		margin: 0 0 1.8rem;
	}
	h2 {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 0 0 0.8rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--t-linha);
		font: 700 1.05rem/1.3 var(--font-body);
	}
	h2 small {
		font-weight: 400;
		font-size: 0.82rem;
		color: var(--t-aur);
	}
	.n {
		font: 400 1.3rem/1 var(--font-heading);
		color: var(--t-aur);
	}
	.mut h2 {
		color: var(--t-tinta-2);
	}
	.ajuda {
		margin: 0.4rem 0 0.8rem;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--t-tinta-2);
	}
	.relegir {
		display: inline-block;
		font-size: 0.85rem;
		color: var(--t-aur);
	}
	ul,
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* les boutons de choix : du texte sur un filet ; choisi = aplat brique */
	.fotos,
	.endrechs,
	.mots,
	.estils {
		display: grid;
		gap: 0.4rem;
	}
	.fotos {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
	}
	.mots {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	@media (min-width: 600px) {
		.mots {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	.comandas li > button {
		width: 100%;
		min-height: 44px;
		margin: 0;
		padding: 0.55rem 0.7rem;
		border: 0;
		border-radius: 3px;
		background: none;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
		box-shadow: inset 0 -1px 0 var(--t-linha);
		-webkit-tap-highlight-color: transparent;
	}
	.comandas li > button:hover {
		box-shadow: inset 0 -2px 0 var(--t-terra);
	}
	.comandas li > button[aria-pressed='true'] {
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		box-shadow: none;
	}
	.comandas li > button:focus-visible {
		outline: 3px solid var(--t-aur-clar);
		outline-offset: 2px;
	}
	.comandas .fotos li > button {
		display: grid;
		gap: 0.35rem;
		padding: 0 0 0.45rem;
		font-size: 0.85rem;
		line-height: 1.25;
	}
	.fotos img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: 3px 3px 0 0;
	}
	.comandas .fotos li > button span {
		padding: 0 0.4rem;
	}
	.endrechs button {
		display: flex;
		gap: 0.7rem;
		align-items: baseline;
	}
	.endrechs .num {
		font: 400 1.15rem/1 var(--font-heading);
		color: var(--t-aur);
		min-width: 1ch;
	}
	.endrechs button[aria-pressed='true'] .num,
	.endrechs button[aria-pressed='true'] small,
	.estils button[aria-pressed='true'] .fr,
	.mots button[aria-pressed='true'] .fr {
		color: inherit;
	}
	.endrechs small {
		display: block;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.mots button,
	.estils button {
		display: grid;
		gap: 0.1rem;
	}
	.mots .oc {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.mots .fr,
	.estils .fr {
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.estils .nom {
		font-weight: 700;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}
	.accions .pc {
		width: auto;
	}

	.comparar {
		margin-top: 3.5rem;
	}
	.tres {
		display: grid;
		gap: 1.5rem;
	}
	@media (min-width: 900px) {
		.tres {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	figure {
		margin: 0;
	}
	figcaption {
		margin-top: 0.5rem;
		font-size: 0.88rem;
		line-height: 1.4;
		color: var(--t-tinta-2);
	}
	figcaption strong {
		color: var(--t-tinta);
	}

	.sortidas {
		margin-top: 4rem;
		max-width: 46rem;
	}
	.sortidas article {
		padding: 1.4rem 0 1.6rem;
		border-top: 1px solid var(--t-linha);
	}
	.nn {
		margin: 0;
		font: 400 2.2rem/1 var(--font-heading);
		color: var(--t-aur-gros);
	}
	h3 {
		margin: 0.5rem 0 0.7rem;
		font: 700 1.2rem/1.3 var(--font-body);
	}
	.sortidas p,
	.gestes li {
		line-height: 1.6;
	}
	.sortidas a {
		color: var(--t-terra);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		white-space: nowrap;
	}
	.pensar {
		font-weight: 700;
	}
	.gestes {
		display: grid;
		gap: 0.7rem;
	}
	.gestes li {
		padding-left: 1.2rem;
		position: relative;
	}
	.gestes li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.8em;
		width: 0.6rem;
		border-top: 1px solid var(--t-aur);
	}
</style>
