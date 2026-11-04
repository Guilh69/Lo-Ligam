<script>
	// Los panièrs (chantier 27 ; deuxième jeu, Romain le 2026-11-05 : « Oui, Los
	// panièrs »). Un mot déjà appris tombe lentement ; on le range dans le bon
	// panier, à gauche ou à droite : flèches du clavier, ou toucher le panier.
	// Rien de punitif : un mot mal rangé remonte et retombe ; ni score ni
	// chronomètre (le compte affiché est l'avancée du thème) ; après deux
	// erreurs, le bon panier s'éclaire. Pause, son, « pas à pas » (le mot
	// attend en haut, la flèche du bas le fait tomber), d'office avec « réduire
	// les animations ». Trois thèmes : arriver ou partir (unité 1), masculin ou
	// féminin (unité 2), question ou réponse (unités 1 et 2). Composant affiché
	// par la page /ensag/jocs, à côté de la sèrp (Serp.svelte). Aucun fichier.
	import { onMount } from 'svelte';
	import { tria, lang as langStore } from '$lib/stores/lang.svelte.js';
	import { TEMAS, bonPanier } from '$lib/jocs/paniers-mots.js';
	import { playTick, playChime } from '$lib/lesson/sounds.js';
	import Reglatges from '$lib/jocs/Reglatges.svelte';

	// Occitan passé à lo Congrès le 2026-11-05, à valider par Romain.
	const T = {
		consigna: {
			oc: 'Un mot tomba : lo panièr d’esquèrra o lo panièr de drecha ?',
			fr: 'Un mot tombe : le panier de gauche ou le panier de droite ?'
		},
		tema: { oc: 'Tèma', fr: 'Thème' },
		reglatges: { oc: 'Reglatges', fr: 'Réglages' },
		camp: { oc: 'Camp del jòc', fr: 'Terrain du jeu' },
		pausa: { oc: 'Pausa', fr: 'Pause' },
		son: { oc: 'Son', fr: 'Son' },
		pasAPas: { oc: 'Pas a pas', fr: 'Pas à pas' },
		autreTema: { oc: 'Un autre tèma', fr: 'Un autre thème' },
		tornarJogar: { oc: 'Tornar jogar', fr: 'Rejouer' },
		partirClavier: { oc: 'Quicha una sageta per partir.', fr: 'Appuie sur une flèche pour partir.' },
		partirTactil: { oc: 'Tòca un panièr per partir.', fr: 'Touche un panier pour partir.' },
		enPausa: { oc: 'En pausa', fr: 'En pause' },
		torna: { oc: 'Lo mot torna.', fr: 'Le mot remonte.' },
		clavier: {
			oc: 'Sagetas : esquèrra, drecha · Espaci o aval : lo mot tomba · Escap : pausa',
			fr: 'Flèches : gauche, droite · Espace ou bas : le mot tombe · Échap : pause'
		},
		plen: { oc: 'Plen !', fr: 'Plein !' },
		totDins: { oc: 'Tot es dins los panièrs.', fr: 'Tout est dans les paniers.' },
		mots: { oc: (n, t) => `${n} sus ${t} mots`, fr: (n, t) => `${n} mots sur ${t}` },
		esquerra: { oc: 'Esquèrra', fr: 'Gauche' },
		drecha: { oc: 'Drecha', fr: 'Droite' },
		aval: { oc: 'Lo mot tomba', fr: 'Le mot tombe' }
	};

	const DURADA = 7; // secondes de chute, lentes et constantes
	const RAPID = 0.35; // quand on le fait tomber
	const TORNA = 0.7; // le mot mal rangé remonte
	const CLAU_SON = 'lo-ligam-jocs-son'; // partagé avec la sèrp

	// ── Réglages ─────────────────────────────────────────────────────────
	let pasAPas = $state(false);
	let son = $state(true);
	let tactil = $state(false);
	let calme = $state(false);
	let esOc = $derived(langStore.current === 'oc');

	// ── Partie ───────────────────────────────────────────────────────────
	let temaId = $state('arribar');
	let tema = $derived(TEMAS.find((t) => t.id === temaId));
	let mot = $state(null);
	let col = $state(0);
	let y = $state(0); // 0 en haut, 1 dans le panier
	let fase = $state('espera'); // espera · tomba · torna · pausa · plen
	let dins = $state([[], []]);
	let secos = $state(-1);
	let indici = $state(false);
	let anonci = $state('');
	let plaçats = $derived(dins[0].length + dins[1].length);
	let sac = [];
	let errors = 0;
	let rapid = false;
	let primier = true;
	let faseAvant = 'tomba';
	let darrier = 0;
	let rAF = null;
	let racina;

	function barrejar(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function començar(id) {
		temaId = id;
		sac = barrejar(tema.mots.slice());
		dins = [[], []];
		primier = true;
		novelMot();
	}

	function novelMot() {
		mot = sac.pop() ?? null;
		if (!mot) {
			fase = 'plen';
			if (son) setTimeout(playChime, 120);
			anonci = `${tria(T.plen)} ${tria(T.totDins)}${tema.nota ? ' ' + tria(tema.nota) : ''}`;
			return;
		}
		col = Math.random() < 0.5 ? 0 : 1;
		y = 0;
		rapid = false;
		errors = 0;
		indici = false;
		// le premier mot attend un geste ; les suivants tombent d'eux-mêmes
		fase = primier || pasAPas ? 'espera' : 'tomba';
		primier = false;
		anonci = `${mot.oc} : ${tria(tema.paniers[0])} ${esOc ? 'o' : 'ou'} ${tria(tema.paniers[1])} ?`;
	}

	function aterrir() {
		const p = tema.paniers[col];
		if (bonPanier(mot, p.id)) {
			dins[col].push(mot);
			if (son) playTick();
			anonci = `${mot.oc} : ${tria(p)}`;
			novelMot();
			return;
		}
		errors++;
		indici = errors >= 2;
		secos = col;
		setTimeout(() => (secos = -1), 450);
		rapid = false;
		if (calme) {
			y = 0;
			fase = 'espera';
		} else fase = 'torna';
		anonci = tria(T.torna);
	}

	function tic(t) {
		const dt = Math.min(0.05, (t - darrier) / 1000);
		darrier = t;
		if (fase === 'tomba') {
			y = Math.min(1, y + dt / (rapid ? RAPID : DURADA));
			if (y >= 1) aterrir();
		} else if (fase === 'torna') {
			y = Math.max(0, y - dt / TORNA);
			if (y <= 0) fase = pasAPas ? 'espera' : 'tomba';
		}
		rAF = requestAnimationFrame(tic);
	}

	function demandar(nom) {
		if (!mot || fase === 'plen' || fase === 'torna') return;
		if (fase === 'pausa') fase = faseAvant;
		if (nom === 'esquerra') col = 0;
		else if (nom === 'drecha') col = 1;
		else if (nom === 'aval') {
			if (pasAPas || calme) {
				y = 1;
				fase = 'tomba';
				aterrir();
				return;
			}
			rapid = true;
		}
		if (fase === 'espera' && !pasAPas) fase = 'tomba';
	}
	function tocarPanier(i) {
		col = i;
		demandar('aval');
	}

	function bascularPausa() {
		if (fase === 'tomba' || fase === 'torna') {
			faseAvant = fase;
			fase = 'pausa';
		} else if (fase === 'pausa') fase = faseAvant;
	}
	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {}
	}
	function seguentTema() {
		const i = TEMAS.findIndex((t) => t.id === temaId);
		començar(TEMAS[(i + 1) % TEMAS.length].id);
	}

	// ── Clavier (seulement quand le jeu est concerné, comme la sèrp) ─────
	const TOCAS = { ArrowLeft: 'esquerra', KeyA: 'esquerra', ArrowRight: 'drecha', KeyD: 'drecha', ArrowDown: 'aval', KeyS: 'aval' };
	function enVista() {
		const r = racina?.querySelector('.camp')?.getBoundingClientRect();
		return !!r && r.top >= 0 && r.bottom <= innerHeight;
	}
	function tòca(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const cibla = e.target;
		if (cibla?.closest?.('input, select, textarea, [contenteditable]')) return;
		const dedins = !!racina?.contains(cibla) || fase === 'tomba';
		const res = !cibla || cibla === document.body || cibla === document.documentElement;
		const sus = cibla?.closest?.('button, a');
		const nom = TOCAS[e.code];
		if (nom) {
			if (!(dedins || (e.code.startsWith('Arrow') && res && enVista()))) return;
			e.preventDefault();
			demandar(nom);
			return;
		}
		if (!dedins) return;
		if (e.code === 'Space' && !sus) {
			e.preventDefault();
			demandar('aval');
		}
		if (e.code === 'Escape' && (fase === 'tomba' || fase === 'torna' || fase === 'pausa')) {
			e.preventDefault();
			bascularPausa();
		}
		if (e.code === 'Enter' && !sus) {
			e.preventDefault();
			if (fase === 'plen') seguentTema();
			else demandar('aval');
		}
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		pasAPas = calme;
		tactil = matchMedia('(pointer: coarse)').matches;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {}
		començar('arribar');
		darrier = performance.now();
		rAF = requestAnimationFrame(tic);
		const amagat = () => {
			if (document.hidden && (fase === 'tomba' || fase === 'torna')) bascularPausa();
		};
		document.addEventListener('visibilitychange', amagat);
		return () => {
			cancelAnimationFrame(rAF);
			document.removeEventListener('visibilitychange', amagat);
		};
	});
</script>

<svelte:window onkeydown={tòca} />

{#snippet sageta(nom)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class="sageta sageta-{nom}"><path d="M7 14.5l5-5 5 5" /></svg>
{/snippet}

<section class="joc" aria-labelledby="titol-paniers" bind:this={racina}>
	<div class="disposicion">
		<header class="cap-joc">
			<h2 id="titol-paniers" lang="oc">Los panièrs</h2>
			{#if !esOc}<p class="glosa" lang="fr">les paniers</p>{/if}
			<p class="consigna">{tria(T.consigna)}</p>
		</header>

		<div class="pista" aria-hidden="true">
			<p class="sens" lang="oc">{tria(tema.nom)}</p>
			<p class="compte">{tria(T.mots)(plaçats, tema.mots.length)}</p>
		</div>

		<div class="taula">
			<!-- Le terrain : il prend le focus (Tab ou toucher) pour le clavier ; rôle
			     « application », un widget piloté au clavier, d'où le tabindex. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div
				class="camp"
				class:calme
				class:pausa={fase === 'pausa'}
				role="application"
				tabindex="0"
				aria-label={tria(T.camp)}
				aria-describedby="anonci-paniers"
				onpointerdown={(e) => e.currentTarget.focus({ preventScroll: true })}
			>
				{#if mot}
					<div class="mot" class:torna={fase === 'torna'} style:--col={col} style:--y={y} lang="oc"><span>{mot.oc}</span></div>
				{/if}
				<div class="paniers">
					{#each tema.paniers as p, i (p.id)}
						<button
							type="button"
							class="panier"
							class:visat={col === i && !!mot && fase !== 'plen'}
							class:non={secos === i}
							class:indici={indici && !!mot && bonPanier(mot, p.id)}
							aria-label="{tria(p)} : {tria(T.aval)}"
							onclick={() => tocarPanier(i)}
						>
							<span class="etiqueta" lang="oc">{tria(p)}</span>
							<span class="dedins">{#each dins[i] as m (m.oc)}<span class="chip" lang="oc">{m.oc}</span>{/each}</span>
						</button>
					{/each}
				</div>

				{#if fase === 'plen'}
					<div class="fin">
						<p class="fin-oc" lang="oc">{tria(T.plen)}</p>
						<p class="fin-fr">{tria(T.totDins)}</p>
						{#if tema.nota}<p class="fin-nota">{tria(tema.nota)}</p>{/if}
						<button type="button" class="accion" onclick={seguentTema}>{tria(T.autreTema)}</button>
					</div>
				{/if}
			</div>
			<!-- sous le terrain, pour ne rien cacher -->
			<p class="messatge" class:vis={fase === 'espera' || fase === 'pausa' || fase === 'torna'}>
				{#if fase === 'torna'}{tria(T.torna)}
				{:else if fase === 'pausa'}{tria(T.enPausa)}
				{:else if fase === 'espera'}{tactil ? tria(T.partirTactil) : tria(T.partirClavier)}{/if}
			</p>
		</div>

		<div class="comandas">
			<div class="crotz" role="group" aria-label={tria(T.camp)}>
				{#each ['esquerra', 'aval', 'drecha'] as nom (nom)}
					<button type="button" class="dir dir-{nom}" aria-label={tria(T[nom])} onclick={() => demandar(nom)}>
						{@render sageta(nom)}
					</button>
				{/each}
			</div>
			{#if !tactil}<p class="ajuda">{tria(T.clavier)}</p>{/if}

			<Reglatges
				causida={{
					titol: tria(T.tema),
					valor: temaId,
					causir: (id) => id !== temaId && començar(id),
					opcions: TEMAS.map((t) => ({ id: t.id, label: tria(t.nom) }))
				}}
				bascules={[
					{ id: 'son', label: tria(T.son), valor: son, bascular: bascularSon },
					{ id: 'pas', label: tria(T.pasAPas), valor: pasAPas, bascular: () => (pasAPas = !pasAPas) }
				]}
				titolOpcions={tria(T.reglatges)}
			>
				<button
					type="button"
					aria-pressed={fase === 'pausa'}
					disabled={fase !== 'tomba' && fase !== 'torna' && fase !== 'pausa'}
					onclick={bascularPausa}>{tria(T.pausa)}</button
				>
				<button type="button" onclick={() => començar(temaId)}>{tria(T.tornarJogar)}</button>
			</Reglatges>
		</div>
	</div>
	<p id="anonci-paniers" class="sr" aria-live="polite">{anonci}</p>
</section>

<style>
	.joc {
		container: joc / inline-size;
		--or: var(--t-aur);
	}
	.disposicion {
		display: grid;
		gap: var(--esp-24) var(--esp-48);
		grid-template-areas: 'cap' 'pista' 'taula' 'comandas';
	}
	@container joc (min-width: 52rem) {
		.disposicion {
			grid-template-columns: minmax(0, 1fr) 21rem;
			grid-template-rows: auto auto 1fr;
			grid-template-areas: 'taula cap' 'taula pista' 'taula comandas';
			align-items: start;
		}
	}
	.cap-joc {
		grid-area: cap;
	}
	.pista {
		grid-area: pista;
	}
	.taula {
		grid-area: taula;
	}
	.comandas {
		grid-area: comandas;
		display: grid;
		gap: var(--esp-24);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.05;
		color: var(--or);
	}
	.glosa {
		margin: 0.2rem 0 0;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.consigna {
		max-width: 36ch;
		margin: var(--esp-12) 0 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.sens {
		margin: 0;
		font-size: clamp(1.25rem, 2.4vw, 1.5rem);
		line-height: 1.3;
	}
	.compte {
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
	}

	/* ── Le terrain ── */
	.camp {
		position: relative;
		width: 100%;
		max-width: calc(60svh * 4 / 3);
		aspect-ratio: 4 / 3;
		margin-inline: auto;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 1rem;
		background: var(--l-carta);
		box-shadow: inset 0 0 3rem color-mix(in srgb, var(--t-fons) 24%, transparent);
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
	}
	/* Téléphone : tout doit tenir sans défiler ; le titre du jeu est déjà dans
	   l'onglet, il reste pour les lecteurs d'écran */
	@media (max-width: 559px) {
		.camp {
			max-width: calc(44svh * 4 / 3);
		}
		.disposicion {
			gap: var(--esp-12);
		}
		.cap-joc {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.crotz {
			grid-template-columns: repeat(3, 2.8rem);
			grid-template-rows: 2.8rem;
			gap: 0.3rem;
		}
	}
	.camp:focus {
		outline: none;
	}
	.camp:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 3px;
	}
	/* le mot qui tombe : la tuile dorée de la sèrp */
	.mot {
		position: absolute;
		left: calc(var(--col) * 50% + 25%);
		top: calc(3% + var(--y) * 58%);
		z-index: 2;
		translate: -50% 0;
		max-width: 46%;
		padding: 0.35em 0.7em;
		border-radius: 0.6em;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		box-shadow: inset 0 0 0 1.5px var(--or);
		font-size: clamp(1rem, 4.2cqi, 1.4rem);
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
		color: var(--t-tinta);
		transition:
			left 0.22s ease-out,
			box-shadow 0.2s;
	}
	.calme .mot {
		transition: none;
	}
	.mot.torna {
		box-shadow: inset 0 0 0 1.5px var(--t-tinta-2);
	}
	.pausa .mot {
		opacity: 0.45;
	}
	.paniers {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 36%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4%;
		padding: 0 4% 4%;
	}
	/* un panier : un filet fin, l'étiquette en haut, les mots rangés dedans */
	.panier {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 0;
		padding: 0.4rem 0.5rem;
		border: 1.5px solid color-mix(in srgb, var(--t-tinta) 45%, transparent);
		border-radius: 0.5rem 0.5rem 1rem 1rem;
		background: color-mix(in srgb, var(--l-carta) 60%, transparent);
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
		overflow: hidden;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.panier.visat {
		border-color: var(--or);
	}
	.panier.indici {
		border-color: var(--or);
		box-shadow: 0 0 0 5px color-mix(in srgb, var(--or) 25%, transparent);
	}
	.panier.non {
		animation: secodre 0.4s ease-in-out;
	}
	@keyframes secodre {
		25% {
			translate: -3% 0;
		}
		75% {
			translate: 3% 0;
		}
	}
	.panier:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.etiqueta {
		font-size: clamp(0.72rem, 2.6cqi, 0.9rem);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.dedins {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
		margin-top: 0.35rem;
	}
	.chip {
		padding: 0.1rem 0.45rem;
		border-radius: 0.4rem;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		box-shadow: inset 0 0 0 1.5px var(--or);
		font-size: clamp(0.68rem, 2.4cqi, 0.85rem);
		font-weight: 600;
		white-space: nowrap;
		animation: pausar 0.25s ease-out;
	}
	@keyframes pausar {
		from {
			translate: 0 -0.3em;
			opacity: 0;
		}
	}

	/* une ligne réservée sous le terrain : rien ne bouge quand elle se vide */
	.messatge {
		min-height: 1.5em;
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
		text-align: center;
		visibility: hidden;
	}
	.messatge.vis {
		visibility: visible;
	}

	/* la carte de fin de thème : verre fumé au milieu du terrain */
	.fin {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 4;
		translate: -50% -50%;
		width: min(86%, 26rem);
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		padding: 1.2rem 1.4rem 1.3rem;
		border-radius: 1rem;
		background: var(--t-veire-fort);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow:
			0 0 0 1px var(--t-linha),
			0 18px 40px -20px rgba(0, 0, 0, 0.5);
		text-align: center;
		animation: apareisser 0.4s ease-out both;
	}
	@keyframes apareisser {
		from {
			opacity: 0;
			translate: -50% calc(-50% + 0.5rem);
		}
	}
	.fin-oc {
		margin: 0;
		font-size: clamp(1.8rem, 7cqi, 3rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--t-tinta);
	}
	.fin-fr {
		margin: 0;
		font-size: 1rem;
		font-style: italic;
		color: var(--t-tinta);
	}
	.fin-nota {
		margin: var(--esp-8) 0 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--t-tinta-2);
	}
	.fin .accion {
		margin-top: var(--esp-16);
	}

	/* ── Commandes ── */
	button {
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.crotz {
		display: grid;
		grid-template-columns: repeat(3, 3.2rem);
		grid-template-rows: 3.2rem;
		grid-template-areas: 'esquerra aval drecha';
		gap: 0.35rem;
		justify-content: center;
	}
	@container joc (min-width: 52rem) {
		.crotz {
			justify-content: start;
		}
	}
	.dir {
		display: grid;
		place-items: center;
		padding: 0;
		border: none;
		border-radius: 0.8rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		touch-action: manipulation;
	}
	.dir:hover {
		background: var(--t-accion-viu);
	}
	.dir-aval {
		grid-area: aval;
	}
	.dir-esquerra {
		grid-area: esquerra;
	}
	.dir-drecha {
		grid-area: drecha;
	}
	.sageta {
		width: 1.6rem;
		height: 1.6rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sageta-aval {
		rotate: 180deg;
	}
	.sageta-esquerra {
		rotate: 270deg;
	}
	.sageta-drecha {
		rotate: 90deg;
	}
	.ajuda {
		margin: 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
		text-align: center;
	}
	@container joc (min-width: 52rem) {
		.ajuda {
			text-align: start;
		}
	}
	.accion {
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 0.6rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.accion:hover {
		background: var(--t-accion-viu);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.mot,
		.panier {
			transition: none;
		}
		.panier.non,
		.chip,
		.fin {
			animation: none;
		}
	}
</style>
