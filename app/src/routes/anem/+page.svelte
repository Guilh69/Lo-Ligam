<script>
	// Anem ! (« Zo ! » jusqu'au 2026-11-05 : se lit comme il se dit, choix de Romain) — l'espace des 3 à 6 ans, qui ne lisent pas encore (cadrage de
	// Romain du 2026-11-04, cahier §11 ; chantier 28 de PILOTATGE). Page
	// indexée, dans le menu et dans S'apren depuis le 05-11. Trois coins : Escotar (l'imagier : on touche
	// une bête, on entend son nom), L'ombra (retrouver la bête à sa silhouette :
	// marche sans voix) et Ont es ? (la voix de Romain demandera ; aujourd'hui
	// l'adulte lit la question). Rubrique visible de S'apren depuis le 2026-11-05
	// (Romain : « une rubrique vraiment visible »), à la place de la leçon d'essai.
	// Règles : ni compte, ni donnée, ni chronomètre, ni score, ni classement ;
	// grandes images, gros boutons ; rien de négatif quand on se trompe (la
	// bête touchée dit juste son nom) ; sons discrets, coupés d'un bouton ;
	// « réduire les animations » respecté ; la sortie est dans le coin des
	// adultes (appui long), pour qu'un petit doigt ne quitte pas l'espace.
	// Les bêtes sont découpées dans le visuel Canva de Romain « Nòstres amics
	// las bèstias » (static/anem, 640 px, 2 à 23 Ko chacune, fond #006169).
	// La voix : un fichier par bête dans static/audio/anem/ (liste dans
	// static/audio/moduls/A-LIRE-enregistrements.md) ; tant qu'il manque, un
	// petit carillon (Web Audio, aucun fichier) tient la place.
	import { onMount, untrack } from 'svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	// pron : la prononciation de Romain, telle qu'elle est sur ses fiches Canva
	const BESTIAS = [
		{ id: 'can', oc: 'Lo can', fr: 'Le chien', pron: 'Lou ka', nota: 523.25 },
		{ id: 'gat', oc: 'Lo gat', fr: 'Le chat', pron: 'Lou gatt', nota: 659.25 },
		{ id: 'galina', oc: 'La galina', fr: 'La poule', pron: 'La galino', nota: 783.99 },
		{ id: 'gal', oc: 'Lo gal', fr: 'Le coq', pron: 'Lou gal', nota: 880 },
		// les quatre autres du même visuel (2026-11-05) ; prononciations de ses fiches
		{ id: 'cabra', oc: 'La cabra', fr: 'La chèvre', pron: 'La kabro', nota: 587.33 },
		{ id: 'caval', oc: 'Lo caval', fr: 'Le cheval', pron: 'Lou kabal', nota: 698.46 },
		{ id: 'porc', oc: 'Lo pòrc', fr: 'Le cochon', pron: 'Lou pork', nota: 987.77 },
		{ id: 'poleton', oc: 'Lo poleton', fr: 'Le poussin', pron: 'Lou poulétou', nota: 1046.5 }
	];
	// Dans les jeux, quatre choix par tour (la bête à trouver et trois autres,
	// mêlées) : assez pour chercher, assez grand pour un doigt de trois ans.
	const CAUSIDAS = 4;
	const imatge = (b) => `/anem/${b.id}.webp`;
	const ombra = (b) => `/anem/${b.id}-ombra.webp`;
	const votz = (b) => `/audio/anem/${b.id}.m4a`;
	const votzQuestion = (b) => `/audio/anem/ont-es-${b.id}.m4a`;

	// Textes pour l'adulte (l'enfant ne lit pas) : occitan et français ; les
	// autres langues retombent sur l'occitan (tria) en attendant Aran.
	const T = {
		sostitol: { oc: 'L’occitan per los pichons', fr: 'L’occitan pour les petits' },
		causir: { oc: 'Causir un canton', fr: 'Choisir un coin' },
		escotar: { oc: 'Escotar', fr: 'Écouter' },
		ombra: { oc: 'L’ombra', fr: 'L’ombre' },
		ontEs: { oc: 'Ont es', fr: 'Où est' },
		tornar: { oc: 'Tornar', fr: 'Retour' },
		son: { oc: 'Son', fr: 'Son' },
		osca: { oc: 'Òsca !', fr: 'Bravo !' },
		tornarJogar: { oc: 'Tornar jogar', fr: 'Rejouer' },
		legir: { oc: 'Legís la question a votz nauta', fr: 'Lis la question à voix haute' },
		adultes: { oc: 'Adultes', fr: 'Adultes' },
		tenir: { oc: 'Quicha longtemps', fr: 'Appuie longtemps' },
		adultesTitol: { oc: 'Per los adultes', fr: 'Pour les adultes' },
		adultesTexte: {
			oc: 'Anem ! es un canton per los pichons de 3 a 6 ans, que legisson pas encara. Tòca una bèstia : ausiràs son nom en occitan. Ni compte, ni donadas, ni cronomètre.',
			fr: 'Anem ! est un coin pour les petits de 3 à 6 ans, qui ne lisent pas encore. On touche une bête, on entend son nom en occitan. Ni compte, ni données, ni chronomètre.'
		},
		adultesVotz: {
			oc: 'La votz de Romain arriba lèu. En esperant, legís lo mot a votz nauta amb ton mainatge.',
			fr: 'La voix de Romain arrive bientôt. En attendant, lis le mot à voix haute avec ton enfant.'
		},
		tornarSite: { oc: 'Tornar al site', fr: 'Revenir au site' },
		tampar: { oc: 'Tampar', fr: 'Fermer' }
	};

	// 'acuelh' | 'imatgier' | 'ombra' | 'ont-es' | 'osca'
	let ecran = $state('acuelh');
	let sonActiu = $state(true);
	let calme = $state(false); // préférence « réduire les animations »
	let dicha = $state(null); // imagier : la bête qu'on vient de toucher
	let bolega = $state(null); // la bête qui remue (id)
	let seria = $state([]); // jeu : l'ordre des bêtes à trouver
	let pas = $state(0);
	let trobada = $state(false); // la bête du tour vient d'être trouvée
	let tenent = $state(false); // appui long sur « Adultes » en cours
	let avis = $state(''); // pour les lecteurs d'écran (aria-live)
	let jocPrecedent = 'ombra';
	let dialogEl;
	let tenirTimer = null;
	let bolegaTimer = null;
	let seguentTimer = null;

	let cibla = $derived(seria[pas] ?? null);

	// --- Sons : la voix de Romain si le fichier existe, sinon un carillon
	// (une note par bête, trois notes qui montent pour « Òsca ! »)
	let ctx = null;
	function carillon(freq, osca = false) {
		if (!sonActiu) return;
		try {
			ctx ??= new (window.AudioContext || window.webkitAudioContext)();
			if (ctx.state === 'suspended') ctx.resume();
			const t0 = ctx.currentTime;
			const notas = osca ? [freq, freq * 1.25, freq * 1.5] : [freq];
			notas.forEach((f, i) => {
				const o = ctx.createOscillator();
				const g = ctx.createGain();
				o.type = 'sine';
				o.frequency.value = f;
				const t = t0 + i * 0.14;
				g.gain.setValueAtTime(0, t);
				g.gain.linearRampToValueAtTime(0.16, t + 0.015);
				g.gain.exponentialRampToValueAtTime(0.0008, t + 0.5);
				o.connect(g).connect(ctx.destination);
				o.start(t);
				o.stop(t + 0.55);
			});
		} catch {
			/* pas de son : rien de grave */
		}
	}
	const senseVotz = new Set(); // fichiers absents, pour ne pas redemander
	function jogarFichier(src, sinon) {
		if (!sonActiu) return;
		if (senseVotz.has(src)) return sinon?.();
		const a = new Audio(src);
		a.play().catch(() => {
			senseVotz.add(src);
			sinon?.();
		});
	}
	const dire = (b) => jogarFichier(votz(b), () => carillon(b.nota));

	function bolegar(b) {
		clearTimeout(bolegaTimer);
		bolega = null;
		// deux touches de suite sur la même bête : on relance l'animation
		requestAnimationFrame(() => {
			bolega = b.id;
			bolegaTimer = setTimeout(() => (bolega = null), 650);
		});
	}

	function melar(xs) {
		const a = [...xs];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// les choix du tour : la cible et trois autres bêtes, dans un ordre mêlé
	// (recalculé seulement quand la cible change)
	let causidas = $derived.by(() => {
		if (!cibla) return [];
		const autras = melar(BESTIAS.filter((b) => b.id !== cibla.id)).slice(0, CAUSIDAS - 1);
		return melar([cibla, ...autras]);
	});

	function anar(e) {
		clearTimeout(seguentTimer);
		ecran = e;
		dicha = null;
		trobada = false;
		avis = '';
		if (e === 'ombra' || e === 'ont-es') {
			jocPrecedent = e;
			seria = melar(BESTIAS);
			pas = 0;
		}
	}

	function tocar(b) {
		bolegar(b);
		if (ecran === 'imatgier') {
			dicha = b;
			dire(b);
			avis = b.oc;
			return;
		}
		if (trobada) {
			// la bête trouvée redit son nom si on la retouche (idée de Joan)
			if (b.id === cibla?.id) dire(b);
			return;
		}
		dire(b);
		if (b.id !== cibla?.id) {
			// pas de « faux » : la bête touchée dit juste son nom
			avis = b.oc;
			return;
		}
		trobada = true;
		avis = `${b.oc} · ${tria(T.osca)}`;
		seguentTimer = setTimeout(
			() => {
				if (pas + 1 >= seria.length) {
					ecran = 'osca';
					carillon(b.nota, true);
				} else {
					pas += 1;
					trobada = false;
				}
			},
			calme ? 900 : 1500
		);
	}

	// « Ont es ? » : la question dite par Romain quand le fichier existera
	function demandar() {
		if (cibla) jogarFichier(votzQuestion(cibla));
	}
	// À chaque nouveau tour de « Ont es ? », la question se pose d'elle-même
	// (dès que l'enregistrement existe) ; le bouton sert à la redemander.
	$effect(() => {
		const e = ecran;
		const c = cibla;
		if (e === 'ont-es' && c) untrack(demandar);
	});

	// --- Coin des adultes : appui long (1,5 s) au doigt, touche Entrée au clavier
	function dobrirAdultes() {
		dialogEl?.showModal();
		// le focus va sur « Tampar » (pas sur « Tornar al site ») : un doigt ou une touche maintenue ne quitte pas l'espace
		dialogEl?.querySelector('form button')?.focus();
	}
	function tenirInici() {
		tenent = true;
		clearTimeout(tenirTimer);
		tenirTimer = setTimeout(() => {
			tenent = false;
			dobrirAdultes();
		}, 1500);
	}
	function tenirFin() {
		tenent = false;
		clearTimeout(tenirTimer);
	}
	function clicAdultes(e) {
		// e.detail vaut 0 pour un « clic » venu du clavier
		if (e.detail === 0) dobrirAdultes();
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		return () => {
			clearTimeout(tenirTimer);
			clearTimeout(bolegaTimer);
			clearTimeout(seguentTimer);
			ctx?.close?.();
		};
	});
</script>

<svelte:head>
	<title>Anem ! · Lo Ligam</title>
	<meta name="description" content="Anem ! L’occitan per los pichons de 3 a 6 ans : se tòca una bèstia, s’ausís son nom. Anem ! L’occitan pour les petits de 3 à 6 ans : on touche une bête, on entend son nom." />
</svelte:head>

<main id="contengut" class="zo" class:calme>
	<header class="cap">
		{#if ecran !== 'acuelh'}
			<button class="redond" type="button" onclick={() => anar('acuelh')} aria-label={tria(T.tornar)}>
				<Icona nom="revenir" size="1.7em" trait={2.4} />
			</button>
		{:else}
			<span class="redond vuege" aria-hidden="true"></span>
		{/if}
		<h1 class="titol">Anem<span class="bang"> !</span></h1>
		<button
			class="redond"
			type="button"
			onclick={() => (sonActiu = !sonActiu)}
			aria-pressed={sonActiu}
			aria-label={tria(T.son)}
		>
			<Icona nom={sonActiu ? 'son' : 'muet'} size="1.7em" trait={2.2} />
		</button>
	</header>

	<p class="sr" aria-live="polite">{avis}</p>

	<!-- l'écran du moment, centré entre le titre et le coin des adultes -->
	<div class="scena">
	{#if ecran === 'acuelh'}
		<p class="sostitol">{tria(T.sostitol)}</p>
		<nav class="cantons" aria-label={tria(T.causir)}>
			<button class="canton" type="button" onclick={() => anar('imatgier')}>
				<span class="vinheta"><img src={imatge(BESTIAS[0])} alt="" /></span>
				<span class="nom">{tria(T.escotar)}</span>
			</button>
			<button class="canton" type="button" onclick={() => anar('ombra')}>
				<span class="vinheta"><img src={ombra(BESTIAS[1])} alt="" /></span>
				<span class="nom">{tria(T.ombra)}</span>
			</button>
			<button class="canton" type="button" onclick={() => anar('ont-es')}>
				<span class="vinheta interrogacion" aria-hidden="true">?</span>
				<span class="nom">{tria(T.ontEs)} ?</span>
			</button>
		</nav>
	{:else if ecran === 'imatgier'}
		<div class="grasilha">
			{#each BESTIAS as b (b.id)}
				<button
					class="bestia"
					class:bolega={bolega === b.id}
					class:dicha={dicha?.id === b.id}
					type="button"
					onclick={() => tocar(b)}
					aria-label={b.oc}
					lang="oc"
				>
					<img src={imatge(b)} alt="" />
				</button>
			{/each}
		</div>
		<p class="bulla" class:vis={!!dicha} aria-hidden="true">
			<strong lang="oc">{dicha?.oc ?? ''}</strong>
			<small>{dicha?.pron ?? ''}</small>
		</p>
	{:else if (ecran === 'ombra' || ecran === 'ont-es') && cibla}
		{#if ecran === 'ombra'}
			<div class="ombra-carta" class:trobada aria-hidden="true">
				<img class="forma" src={ombra(cibla)} alt="" />
				<img class="vertadiera" src={imatge(cibla)} alt="" />
			</div>
		{:else}
			<button class="question" type="button" onclick={demandar}>
				<span class="texte">
					<Icona nom="son" size="1em" trait={2} />
					{tria(T.ontEs)} <strong>{cibla.oc.toLowerCase()}</strong> ?
				</span>
				<span class="indici">{tria(T.legir)}</span>
			</button>
		{/if}
		<div class="grasilha pichona">
			{#each causidas as b (b.id)}
				<button
					class="bestia"
					class:bolega={bolega === b.id}
					class:dicha={trobada && cibla.id === b.id}
					type="button"
					onclick={() => tocar(b)}
					aria-label={b.oc}
					lang="oc"
				>
					<img src={imatge(b)} alt="" />
				</button>
			{/each}
		</div>
		<p class="bulla" class:vis={trobada} aria-hidden="true">
			<strong lang="oc">{trobada ? cibla.oc : ''}</strong>
			<small>{trobada ? cibla.pron : ''}</small>
		</p>
	{:else if ecran === 'osca'}
		<p class="osca">{tria(T.osca)}</p>
		<div class="farandola" aria-hidden="true">
			{#each BESTIAS as b, i (b.id)}
				<img src={imatge(b)} alt="" style:--i={i} />
			{/each}
		</div>
		<div class="accions">
			<!-- un seul bouton : la flèche du haut ramène à l'accueil (Joan : « Tornar » et « Tornar jogar » côte à côte étaient redondants) -->
			<button class="gros" type="button" onclick={() => anar(jocPrecedent)}>{tria(T.tornarJogar)}</button>
		</div>
	{/if}
	</div>

	<footer class="pe">
		<button
			class="adultes"
			class:tenent
			type="button"
			onpointerdown={tenirInici}
			onpointerup={tenirFin}
			onpointerleave={tenirFin}
			onpointercancel={tenirFin}
			onclick={clicAdultes}
		>
			<svg class="anel" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16" /></svg>
			<span>{tria(T.adultes)}</span>
			<small>{tria(T.tenir)}</small>
		</button>
	</footer>
</main>

<dialog bind:this={dialogEl} class="adultes-dialog" aria-labelledby="adultes-titol">
	<h2 id="adultes-titol">{tria(T.adultesTitol)}</h2>
	<p>{tria(T.adultesTexte)}</p>
	<p>{tria(T.adultesVotz)}</p>
	<div class="accions">
		<a class="gros segond" href="/">{tria(T.tornarSite)}</a>
		<form method="dialog"><button class="gros" type="submit">{tria(T.tampar)}</button></form>
	</div>
</dialog>

<style>
	/* Thème clair du site (plâtre, encre) ; les cases sont du bleu canard des
	   visuels de Romain (#006169), pour que la découpe soit invisible. */
	.zo {
		--canard: #006069; /* le fond exact de l'export Canva en 2580 px (2026-11-05) */
		--ombra-carta: 28px;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: min(100%, 760px);
		margin: 0 auto;
		padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		-webkit-tap-highlight-color: transparent;
	}
	.zo button {
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
	}
	.zo :focus-visible,
	.adultes-dialog :focus-visible {
		outline: 3px solid var(--t-accion);
		outline-offset: 3px;
	}
	.scena {
		margin: auto 0;
		padding: 8px 0;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* --- En haut : retour, titre, son */
	.cap {
		display: grid;
		grid-template-columns: 64px 1fr 64px;
		align-items: center;
		gap: 8px;
	}
	.titol {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.8rem, 10vw, 4.4rem);
		line-height: 1;
		text-align: center;
		letter-spacing: 0.02em;
	}
	.bang {
		color: var(--t-aur);
	}
	.redond {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		border: 2px solid var(--t-linha);
		background: #fff;
		color: var(--t-tinta);
		display: grid;
		place-items: center;
		padding: 0;
		cursor: pointer;
	}
	.redond[aria-pressed='false'] {
		color: var(--t-aur);
	}
	.vuege {
		border-color: transparent;
		background: transparent;
	}
	.sostitol {
		margin: 2px 0 14px;
		text-align: center;
		font-size: 1.1rem;
		color: var(--t-aur);
	}

	/* --- Accueil : trois coins */
	.cantons {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}
	.canton {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 14px;
		border-radius: 28px;
		border: 0; /* ni bordure ni blanc : la tuile canard suffit (Joan, « carte à pastille du web ») */
		background: var(--t-fons-2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.vinheta {
		width: 100%;
		max-width: 180px;
		aspect-ratio: 1;
		border-radius: 22px;
		background: var(--canard);
		overflow: hidden;
		display: grid;
		place-items: center;
	}
	.vinheta img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.interrogacion {
		font-family: var(--font-heading);
		font-size: clamp(4rem, 14vw, 6.5rem);
		color: var(--color-gold-light);
		line-height: 1;
	}
	.nom {
		font-weight: 700;
		font-size: 1.3rem;
	}
	@media (max-width: 560px) {
		.cantons {
			grid-template-columns: 1fr;
		}
		.canton {
			flex-direction: row;
			justify-content: flex-start;
			gap: 18px;
			padding: 10px;
		}
		.vinheta {
			width: 112px;
			flex: none;
		}
		.nom {
			font-size: 1.5rem;
		}
	}

	/* --- Les bêtes */
	.grasilha {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		width: min(100%, 560px);
		margin: 8px auto 0;
	}
	/* l'imagier : huit bêtes, deux colonnes au téléphone, quatre au-delà */
	@media (min-width: 561px) {
		.grasilha:not(.pichona) {
			grid-template-columns: repeat(4, 1fr);
			width: min(100%, 720px);
		}
	}
	.grasilha.pichona {
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		width: min(100%, 620px);
	}
	@media (max-width: 560px) {
		.grasilha.pichona {
			grid-template-columns: 1fr 1fr;
		}
	}
	.bestia {
		aspect-ratio: 1;
		border-radius: var(--ombra-carta);
		border: 0;
		padding: 0;
		background: var(--canard);
		overflow: hidden;
		cursor: pointer;
		box-shadow: 0 2px 0 rgba(42, 26, 16, 0.12);
	}
	.bestia img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	/* un seul poids de trait, 2 px, partout (charte : « raffiné = filets fins ») */
	.bestia.dicha {
		outline: 2px solid var(--t-aur);
		outline-offset: 5px;
	}
	.bestia.bolega img {
		animation: bolegar 0.65s ease;
	}
	@keyframes bolegar {
		30% {
			transform: rotate(-4deg) scale(1.07);
		}
		60% {
			transform: rotate(4deg) scale(1.07);
		}
	}
	.bulla {
		/* collée au bas de l'écran tant que la grille déborde (huit bêtes au
		   téléphone) : le mot reste visible quand on touche la dernière rangée */
		position: sticky;
		bottom: 0;
		margin: 12px 0 0;
		padding: 4px 0 6px;
		min-height: 4.4rem;
		text-align: center;
		background: var(--t-fons);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.bulla.vis {
		opacity: 1;
	}
	.bulla strong {
		display: block;
		font-size: clamp(1.9rem, 7vw, 2.7rem);
		line-height: 1.15;
	}
	.bulla small {
		font-size: 1.05rem;
		font-style: italic;
		color: var(--t-aur);
	}

	/* --- L'ombre à retrouver */
	.ombra-carta {
		position: relative;
		width: min(40vw, 210px);
		aspect-ratio: 1;
		margin: 4px auto 10px;
		border-radius: var(--ombra-carta);
		overflow: hidden;
		background: var(--canard);
		outline: 2px solid var(--t-aur);
		outline-offset: 5px;
	}
	.ombra-carta img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.vertadiera {
		opacity: 0;
	}
	.ombra-carta.trobada {
		outline-offset: 8px; /* le trait s'écarte un peu : trouvée */
	}
	.ombra-carta.trobada .vertadiera {
		opacity: 1;
		transition: opacity 0.45s; /* fondu à l'apparition seulement : au tour suivant, la nouvelle bête ne doit pas se montrer en s'effaçant */
	}

	/* --- « Ont es ? » : la question, lue par l'adulte, dite par Romain plus tard */
	.question {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: fit-content;
		margin: 6px auto 10px;
		padding: 12px 26px;
		border-radius: 999px;
		border: 0;
		background: var(--t-fons-2);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.question .texte {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		font-size: clamp(1.4rem, 5.5vw, 2rem);
	}
	.question .indici {
		font-size: 0.9rem;
		color: var(--t-aur);
	}

	/* --- Òsca ! */
	.osca {
		margin: 18px 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 9vw, 3.4rem); /* plus petit que « Zo ! » : un seul grand titre par écran (Joan) */
		line-height: 1;
		text-align: center;
		color: var(--t-aur);
	}
	.farandola {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		width: min(100%, 560px);
		margin: 14px auto 6px;
	}
	.farandola img {
		width: min(21vw, 110px);
		border-radius: 20px;
		animation: dançar 2.2s ease-in-out infinite;
		animation-delay: calc(var(--i) * 0.25s);
	}
	@keyframes dançar {
		50% {
			transform: translateY(-6px);
		}
	}

	/* --- Boutons et coin des adultes */
	.accions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin-top: 14px;
	}
	.gros {
		display: inline-flex;
		align-items: center;
		min-height: 64px;
		padding: 0 28px;
		border-radius: 999px;
		border: 0;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: inherit;
		font-weight: 700;
		font-size: 1.2rem;
		text-decoration: none;
		cursor: pointer;
	}
	.gros.segond {
		background: #fff;
		color: var(--t-tinta);
		border: 2px solid var(--t-linha);
	}
	.pe {
		margin-top: auto;
		display: flex;
		justify-content: center;
		padding-top: 18px;
	}
	.adultes {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 18px;
		border: 0;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
		-webkit-touch-callout: none;
	}
	.adultes small {
		font-size: 0.78rem;
		color: var(--t-aur);
	}
	.anel {
		width: 30px;
		height: 30px;
		transform: rotate(-90deg);
	}
	.anel circle {
		fill: none;
		stroke: var(--t-linha);
		stroke-width: 3;
	}
	.adultes.tenent .anel circle {
		stroke: var(--t-aur);
		stroke-dasharray: 100.5;
		stroke-dashoffset: 100.5;
		animation: emplenar 1.5s linear forwards;
	}
	@keyframes emplenar {
		to {
			stroke-dashoffset: 0;
		}
	}
	.adultes-dialog {
		width: min(92vw, 520px);
		padding: 24px;
		border: 0;
		border-radius: 24px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font-family: var(--font-body);
		line-height: 1.5;
	}
	.adultes-dialog::backdrop {
		background: rgba(42, 26, 16, 0.5);
	}
	.adultes-dialog h2 {
		margin: 0 0 8px;
		font-family: var(--font-body); /* Limelight : seulement les très gros titres */
		font-size: 1.4rem;
	}
	.adultes-dialog p {
		margin: 0 0 10px;
	}

	/* --- Moins d'animations : rien ne remue, les états changent d'un coup */
	.calme .bestia.bolega img,
	.calme .farandola img,
	.calme .adultes.tenent .anel circle {
		animation: none;
	}
	.calme .adultes.tenent .anel circle {
		stroke-dashoffset: 0;
	}
	.calme .bulla,
	.calme .ombra-carta.trobada .vertadiera {
		transition: none;
	}
</style>
