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
		dos: { oc: 'dins los dos panièrs !', fr: 'dans les deux paniers !' },
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
	let plaçats = $state(0); // mots rangés (un mot des deux paniers compte une fois)
	let dosPaniers = $state(null); // le mot qui vient d'entrer dans les deux paniers
	// l'allure (Romain, 05-11 : « L'allure ») : le mot se penche quand il change
	// de couloir, une poussière d'or monte du panier qui le reçoit, et le mot des
	// deux paniers vole de l'un à l'autre
	let vira = $state(0);
	let recep = $state({ i: -1, n: 0 });
	let volada = $state(null);
	let rapid = $state(false);
	let sac = [];
	let errors = 0;
	let partida = 0; // un vol en cours ne retombe pas dans le thème suivant
	let viraT = null;
	const VOL_MS = 720;
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
		plaçats = 0;
		dosPaniers = null;
		volada = null;
		partida++;
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
			plaçats++;
			if (son) playTick();
			const m = mot;
			dins[col].push(m);
			recep = { i: col, n: recep.n + 1 };
			if (m.panier === 'ab') {
				// un mot des deux paniers entre dans les deux, et on le dit tout de
				// suite (Romain, 05-11 : « on comprend pas que ça peut être dit dans
				// les deux ») : une copie vole jusqu'à l'autre panier
				const a = 1 - col;
				const n = partida;
				dosPaniers = m;
				setTimeout(() => dosPaniers === m && (dosPaniers = null), 3200);
				if (calme) dins[a].push(m);
				else {
					volada = { oc: m.oc, de: col, k: recep.n };
					setTimeout(() => {
						if (n !== partida) return;
						dins[a].push(m);
						recep = { i: a, n: recep.n + 1 };
						volada = null;
					}, VOL_MS);
				}
				anonci = `${m.oc} : ${tria(T.dos)}`;
			} else anonci = `${m.oc} : ${tria(p)}`;
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
		if (nom === 'esquerra' || nom === 'drecha') {
			const nou = nom === 'esquerra' ? 0 : 1;
			if (nou !== col) {
				vira = nou - col;
				clearTimeout(viraT);
				viraT = setTimeout(() => (vira = 0), 240);
			}
			col = nou;
		} else if (nom === 'aval') {
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
			clearTimeout(viraT);
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
			<!-- un grain par mot du thème, doré une fois rangé -->
			<span class="granas">{#each tema.mots as m, k (m.oc)}<i class:rengat={k < plaçats}></i>{/each}</span>
		</div>

		<div class="taula">
			<!-- Le terrain : il prend le focus (Tab ou toucher) pour le clavier ; rôle
			     « application », un widget piloté au clavier, d'où le tabindex. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div
				class="camp"
				class:calme
				class:pausa={fase === 'pausa'}
				class:plen={fase === 'plen'}
				role="application"
				tabindex="0"
				aria-label={tria(T.camp)}
				aria-describedby="anonci-paniers"
				onpointerdown={(e) => e.currentTarget.focus({ preventScroll: true })}
			>
				<!-- deux couloirs de chute, en pointillé ; celui du mot s'éclaire -->
				<span class="corredor" class:actiu={!!mot && col === 0 && fase !== 'plen'} style:--c="0" aria-hidden="true"></span>
				<span class="corredor" class:actiu={!!mot && col === 1 && fase !== 'plen'} style:--c="1" aria-hidden="true"></span>
				<span class="sol" aria-hidden="true"></span>
				{#if mot}
					<div
						class="mot"
						class:torna={fase === 'torna'}
						class:rapid={rapid && fase === 'tomba'}
						class:balanca={fase === 'tomba' && !rapid}
						style:--col={col}
						style:--y={y}
						style:--vira={vira}
						lang="oc"
					>
						<span>{mot.oc}</span>
					</div>
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
							<!-- le panier tressé : l'ouverture derrière, les mots, le devant -->
							<svg class="dalfons" viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
								<ellipse cx="100" cy="14" rx="94" ry="9" />
								<path d="M6 14 A94 9 0 0 1 194 14" />
							</svg>
							{#if col === i && !!mot && fase !== 'plen' && fase !== 'torna'}
								<span class="ombra" style:--y={y} aria-hidden="true"></span>
							{/if}
							<span class="pila"
								>{#each dins[i] as m, j (m.oc)}<span class="chip" class:dos={m.panier === 'ab'} style:--j={j} lang="oc"
										>{m.oc}</span
									>{/each}</span
							>
							<svg class="davant" viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
								<defs>
									<clipPath id="vim-{i}"><path d="M6 14 C9 58 17 96 32 107 L168 107 C183 96 191 58 194 14 A94 9 0 0 1 6 14 Z" /></clipPath>
								</defs>
								<path class="cors" d="M6 14 C9 58 17 96 32 107 L168 107 C183 96 191 58 194 14 A94 9 0 0 1 6 14 Z" />
								<!-- l'osier tressé : des montants droits, et des brins ondulés qui
								     passent devant puis derrière, un rang sur deux à contretemps -->
								<g class="vim" clip-path="url(#vim-{i})">
									<path class="montants" d="M16 18 L16 112 M44 21.2 L44 112 M72 22.6 L72 112 M100 23 L100 112 M128 22.6 L128 112 M156 21.2 L156 112 M184 18 L184 112" />
									<path d="M6 19 A94 9 0 0 0 194 19 M2 34 Q16 31.5 30 36.7 T58 38.5 T86 39.4 T114 39.4 T142 38.5 T170 36.7 T198 34 M2 50 Q16 55.5 30 52.7 T58 54.5 T86 55.4 T114 55.4 T142 54.5 T170 52.7 T198 50 M2 66 Q16 63.5 30 68.7 T58 70.5 T86 71.4 T114 71.4 T142 70.5 T170 68.7 T198 66 M2 82 Q16 87.5 30 84.7 T58 86.5 T86 87.4 T114 87.4 T142 86.5 T170 84.7 T198 82 M2 98 Q16 95.5 30 100.7 T58 102.5 T86 103.4 T114 103.4 T142 102.5 T170 100.7 T198 98" />
								</g>
								<path class="labre" d="M6 14 A94 9 0 0 0 194 14" />
								<!-- deux anses sur les côtés, sous le bord -->
								<path class="ansa" d="M8 22 C-10 22 -10 46 10.5 46 M192 22 C210 22 210 46 189.5 46" />
							</svg>
							<span class="etiqueta" lang="oc">{tria(p)}</span>
							{#if recep.i === i}
								{#key recep.n}
									<span class="polsa" aria-hidden="true"
										>{#each [0, 1, 2, 3, 4, 5] as k (k)}<i style:--dx="{(k - 2.5) * 0.75}em" style:--dl="{(k % 3) * 60}ms"></i>{/each}</span
									>
								{/key}
							{/if}
						</button>
					{/each}
					{#if volada}
						{#key volada.k}
							<span class="volada" style:--de="{volada.de * 50 + 25}%" style:--a="{(1 - volada.de) * 50 + 25}%" aria-hidden="true"
								><span class="chip dos" lang="oc">{volada.oc}</span></span
							>
						{/key}
					{/if}
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
			<p class="messatge" class:vis={fase === 'espera' || fase === 'pausa' || fase === 'torna' || !!dosPaniers} class:dos={!!dosPaniers}>
				{#if dosPaniers}<span lang="oc">{dosPaniers.oc}</span> : {tria(T.dos)}
				{:else if fase === 'torna'}{tria(T.torna)}
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
		/* une lumière douce tombe d'en haut, d'où viennent les mots ; le bas
		   s'assombrit vers le sol où posent les paniers */
		background:
			radial-gradient(ellipse 70% 55% at 50% -6%, color-mix(in srgb, var(--or) 11%, transparent), transparent 72%),
			linear-gradient(to bottom, var(--l-carta) 40%, color-mix(in srgb, var(--t-fons) 22%, var(--l-carta)));
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
	/* deux couloirs de chute en pointillé fin, du haut jusqu'à l'ouverture du
	   panier ; celui où tombe le mot s'éclaire d'or */
	.corredor {
		position: absolute;
		left: calc(var(--c) * 50% + 25%);
		top: 4%;
		height: 64%;
		width: 1.5px;
		translate: -50% 0;
		background: repeating-linear-gradient(to bottom, var(--t-linha) 0 2px, transparent 2px 9px);
		transition: opacity 0.3s;
		opacity: 0.8;
	}
	.corredor.actiu {
		background: repeating-linear-gradient(to bottom, color-mix(in srgb, var(--or) 55%, transparent) 0 2px, transparent 2px 9px);
		opacity: 1;
	}
	/* le sol, un filet qui s'efface vers les bords */
	.sol {
		position: absolute;
		left: 4%;
		right: 4%;
		bottom: 5%;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--t-linha) 18% 82%, transparent);
	}
	/* le mot qui tombe : la tuile dorée de la sèrp, un peu soulevée du fond ;
	   il se penche quand il change de couloir et se balance à peine en tombant */
	.mot {
		position: absolute;
		left: calc(var(--col) * 50% + 25%);
		/* en haut à y = 0 ; à y = 1, son bas touche l'ouverture du panier */
		top: calc(4% + var(--y) * 64.5%);
		z-index: 3;
		translate: -50% calc(var(--y) * -100%);
		rotate: calc(var(--vira) * 4deg);
		/* sa largeur est celle du mot, pas la place qui reste à droite */
		width: max-content;
		max-width: 46%;
		transition:
			left 0.22s ease-out,
			rotate 0.24s ease-out;
	}
	.mot > span {
		display: block;
		padding: 0.35em 0.75em;
		border-radius: 0.6em;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		box-shadow:
			inset 0 0 0 1.5px var(--or),
			0 0.7em 1.2em -0.8em rgba(0, 0, 0, 0.6);
		font-size: clamp(1rem, 4.2cqi, 1.4rem);
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
		color: var(--t-tinta);
		transform-origin: 50% -60%;
		transition: box-shadow 0.2s;
	}
	.mot.balanca > span {
		animation: balanca 2.8s ease-in-out infinite alternate;
	}
	@keyframes balanca {
		from {
			rotate: -1.4deg;
		}
		to {
			rotate: 1.4deg;
		}
	}
	/* lâché : une traînée dorée au-dessus du mot */
	.mot.rapid::before {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 100%;
		width: 1.5px;
		height: 3.2em;
		translate: -50% 0;
		background: linear-gradient(to top, var(--or), transparent);
	}
	.calme .mot,
	.calme .mot > span {
		transition: none;
		animation: none;
	}
	.mot.torna > span {
		box-shadow: inset 0 0 0 1.5px var(--t-tinta-2);
	}
	.pausa .mot {
		opacity: 0.45;
	}
	.pausa .mot > span {
		animation-play-state: paused;
	}
	.paniers {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 5%;
		height: 30%;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	/* un panier tressé, dessiné d'un seul trait fin ; il prend l'or quand le
	   mot tombe vers lui. Toute sa surface se touche, les mots qui dépassent
	   compris. */
	.panier {
		--trait: color-mix(in srgb, var(--t-tinta) 62%, transparent);
		position: relative;
		min-width: 0;
		margin: 0 9%;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.panier.visat,
	.panier.indici {
		--trait: var(--or);
	}
	.panier svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.panier svg :is(ellipse, path) {
		vector-effect: non-scaling-stroke;
		stroke: var(--trait);
		stroke-width: 1.5px;
		fill: none;
		transition: stroke 0.25s;
	}
	/* l'ouverture, plus sombre, avec le bord du fond */
	.dalfons {
		z-index: 0;
	}
	.dalfons ellipse {
		fill: color-mix(in srgb, black 24%, var(--l-carta));
		stroke: none;
	}
	.dalfons path {
		opacity: 0.7;
	}
	.davant {
		z-index: 3;
	}
	.davant .cors {
		fill: color-mix(in srgb, var(--t-tinta) 5%, var(--l-carta));
	}
	.davant .vim path {
		opacity: 0.42;
	}
	.davant .vim .montants {
		opacity: 0.26;
	}
	.panier.indici .davant .cors {
		fill: color-mix(in srgb, var(--or) 14%, var(--l-carta));
	}
	/* l'ombre du mot sur l'ouverture : elle grandit à mesure qu'il approche */
	.ombra {
		position: absolute;
		left: 50%;
		top: 12.7%;
		z-index: 1;
		width: calc((0.3 + 0.6 * var(--y)) * 80%);
		height: 10%;
		translate: -50% -50%;
		border-radius: 50%;
		background: radial-gradient(closest-side, rgba(0, 0, 0, 0.5), transparent);
		opacity: calc(0.25 + 0.75 * var(--y));
	}
	/* les mots rangés dépassent de l'ouverture et s'empilent vers le haut */
	.pila {
		position: absolute;
		left: 8%;
		right: 8%;
		bottom: 84%;
		z-index: 2;
		display: flex;
		flex-wrap: wrap-reverse;
		justify-content: center;
		gap: 0.22rem;
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
	/* l'étiquette du panier, une plaque sur le devant, lisible sur la tresse */
	.etiqueta {
		position: absolute;
		left: 50%;
		top: 60%;
		z-index: 4;
		translate: -50% -50%;
		max-width: 84%;
		padding: 0.18rem 0.6rem;
		border-radius: 0.35rem;
		background: var(--l-carta);
		box-shadow: inset 0 0 0 1px var(--trait);
		font-size: clamp(0.8rem, 2.8cqi, 0.95rem);
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--t-tinta);
		transition: box-shadow 0.25s;
	}
	.chip {
		padding: 0.1rem 0.45rem;
		border-radius: 0.4rem;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		box-shadow: inset 0 0 0 1.5px var(--or);
		font-size: clamp(0.68rem, 2.4cqi, 0.85rem);
		font-weight: 600;
		line-height: 1.3;
		white-space: nowrap;
		color: var(--t-tinta);
		animation: pausar 0.28s ease-out;
	}
	@keyframes pausar {
		from {
			translate: 0 -0.5em;
			opacity: 0;
		}
	}
	/* le thème est plein : une onde dorée passe sur les mots, comme à la fin
	   d'un mot de la sèrp */
	.plen .pila .chip {
		animation: onda 0.6s ease-out calc(var(--j) * 80ms) both;
	}
	@keyframes onda {
		45% {
			background: var(--or);
			color: var(--color-text);
		}
	}
	/* le mot bien rangé : quelques grains d'or montent du panier */
	.polsa {
		position: absolute;
		left: 50%;
		top: 10%;
		z-index: 5;
		pointer-events: none;
	}
	.polsa i {
		position: absolute;
		width: 4px;
		height: 4px;
		margin: -2px;
		border-radius: 50%;
		background: var(--or);
		opacity: 0;
		animation: polsa 0.75s ease-out var(--dl) both;
	}
	@keyframes polsa {
		20% {
			opacity: 1;
		}
		to {
			opacity: 0;
			translate: var(--dx) -2.6em;
		}
	}
	/* le mot des deux paniers : une copie vole en arc jusqu'à l'autre panier */
	.volada {
		position: absolute;
		top: 15%;
		z-index: 6;
		translate: -50% -100%;
		pointer-events: none;
		animation: volar-x 0.72s ease-in-out both;
	}
	.volada .chip {
		display: block;
		animation: volar-y 0.72s both;
	}
	@keyframes volar-x {
		from {
			left: var(--de);
		}
		to {
			left: var(--a);
		}
	}
	@keyframes volar-y {
		from {
			translate: 0 0;
			animation-timing-function: ease-out;
		}
		50% {
			translate: 0 -2.4em;
			animation-timing-function: ease-in;
		}
		to {
			translate: 0 0;
		}
	}
	/* un grain par mot du thème, à côté du compte */
	.granas {
		display: flex;
		flex-wrap: wrap;
		gap: 0.32rem;
		margin-top: var(--esp-8);
	}
	.granas i {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 40%, transparent);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;
	}
	.granas i.rengat {
		background: var(--or);
		box-shadow: none;
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
	.messatge.dos {
		color: var(--t-tinta);
	}
	.messatge.dos span {
		font-weight: 600;
	}
	/* un mot des deux paniers : la puce entièrement dorée, dans les deux */
	.chip.dos {
		background: var(--or);
		color: var(--color-text);
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
		.panier,
		.corredor {
			transition: none;
		}
		.panier.non,
		.chip,
		.plen .pila .chip,
		.mot > span,
		.polsa,
		.fin {
			animation: none;
		}
		.polsa {
			display: none;
		}
	}
</style>
