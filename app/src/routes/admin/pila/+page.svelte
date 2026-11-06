<script>
	// La pila (Lo talhièr, lot 4, Romain 2026-11-06 ; revisions/2026-11-06-talhier.md) :
	// ce qui attend l'œil de Romain, une carte à la fois. D'abord les questions
	// de l'IA (ses réponses toutes prêtes en boutons), puis ses réponses à
	// regarder, puis l'occitan des textes des pages, enfin les fiches de
	// grammaire. Même geste que Triar :
	//   → ou glisser à droite : Bon (le texte est validé, ou la réponse vue) ;
	//   ← ou glisser à gauche : Corregir (une note pour l'IA, sur l'élément) ;
	//   ↑ : Question (à l'IA, sur l'élément) ; ↓ : Mai tard (au bout de la pile) ;
	//   1 à 6 : une réponse toute prête ; Ctrl+Z : revenir sur le dernier geste.
	import { onMount, tick, untrack } from 'svelte';
	import { page } from '$app/state';
	import { bon, pasEncara, respondre, restablir, suprimir, mandarNotaId, ligamNota } from '$lib/talhier/notas.svelte.js';
	import { pila, cargarPila, cartas, validar, legirMaiTard, gardarMaiTard } from '$lib/talhier/pila.svelte.js';
	import { nomPagina } from '$lib/talhier/pila.js';
	import { dictadaPossibla, dictar } from '$lib/talhier/dictada.js';
	import { segments } from '$lib/edicion/marcat.js';

	const LLINDAR = 110; // px à glisser pour décider
	const LOTS = [
		{ id: null, oc: 'Tot', fr: 'tout' },
		{ id: 'tèxtes', oc: 'Tèxtes', fr: 'l’occitan des pages' },
		{ id: 'gramatica', oc: 'Gramatica', fr: 'les fiches de grammaire' }
	];
	let lot = $derived(page.url.searchParams.get('lot'));

	let cua = $state.raw([]);
	let pos = $state(0);
	let fachas = $state(0);
	let istòria = $state.raw([]); // { carta, tornar } ou { carta, maiTard: true }
	let maiTard = [];
	let lotBastit;

	let fasa = $state('legir'); // legir | escriure
	let mòde = $state(null); // corregir | question | precision | responsa
	let tèxte = $state('');
	let error = $state('');
	let anonci = $state('');
	let mandant = $state(false);
	let escota = $state(false);
	let arrestarDictada = null;
	let camp = $state(null);

	let carta = $state(null);
	let dx = $state(0);
	let tira = $state(false);
	let volant = $state(false);
	let calme = $state(false);
	let x0 = 0;

	let actual = $derived(cua[pos] ?? null);
	let seguent = $derived(cua[pos + 1] ?? null);
	let rèsta = $derived(Math.max(0, cua.length - pos));
	let senhal = $derived(Math.max(-1, Math.min(1, dx / LLINDAR)));

	function bastir() {
		lotBastit = lot;
		maiTard = legirMaiTard();
		cua = cartas({ lot, maiTard });
		pos = 0;
		fachas = 0;
		istòria = [];
		tampar();
	}
	onMount(async () => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		await cargarPila();
		bastir();
	});
	// un autre lot (Tot, Tèxtes, Gramatica) : la pile se refait
	$effect(() => {
		if (pila.cargat && lot !== lotBastit) untrack(bastir);
	});

	// --- les gestes -------------------------------------------------------------
	const champs = (r) => ({ estat: r.estat, tèxte: r.tèxte, responsa: r.responsa, autor_responsa: r.autor_responsa, vista: r.vista });
	const sòrtaDe = (c) => (c.tipe === 'ficha' ? 'ficha' : 'element');
	const clauDe = (c) => (c.tipe === 'ficha' ? c.f.id : c.e.clau);

	/** un geste sur la carte du dessus : s'il passe, elle part d'un côté */
	async function far(fn, sens, ditz) {
		if (!actual || mandant || volant) return false;
		const c = actual;
		mandant = true;
		error = '';
		const res = await fn(c);
		mandant = false;
		if (res?.error) {
			error = res.error;
			dx = 0;
			return false;
		}
		istòria = [...istòria, { carta: c, tornar: res?.tornar ?? null }];
		fachas++;
		anonci = ditz;
		if (!calme) {
			volant = true;
			dx = sens * (innerWidth * 0.9 + 200);
			await new Promise((r) => setTimeout(r, 260));
		}
		pos++;
		dx = 0;
		volant = false;
		return true;
	}

	function bonCarta() {
		const c = actual;
		if (!c || c.tipe === 'question' || fasa !== 'legir') return;
		if (c.tipe === 'responsa') {
			const avant = champs(c.r);
			return far(
				async () => {
					const err = await bon(c.r);
					return err ? { error: err } : { tornar: () => restablir(c.r, avant) };
				},
				1,
				'Bon : réponse vue.'
			);
		}
		return far(() => validar(sòrtaDe(c), clauDe(c), c.empremta), 1, 'Validé.');
	}

	function opcion(i) {
		const c = actual;
		const o = c?.tipe === 'question' ? c.r.opcions?.[i] : null;
		if (!o || fasa !== 'legir') return;
		const avant = champs(c.r);
		return far(
			async () => {
				const err = await respondre(c.r, o);
				return err ? { error: err } : { tornar: () => restablir(c.r, avant) };
			},
			1,
			`Réponse envoyée : ${o}`
		);
	}

	async function obrir(m) {
		if (!actual || volant || mandant) return;
		arrestarDictada?.();
		mòde = m;
		fasa = 'escriure';
		error = '';
		dx = 0;
		// corriger un texte : on part du texte tel qu'il est
		tèxte = m === 'corregir' && actual.tipe === 'element' ? actual.e.oc.trim() : '';
		await tick();
		camp?.focus();
	}
	function tampar() {
		arrestarDictada?.();
		fasa = 'legir';
		mòde = null;
		tèxte = '';
	}

	/** la note pour l'IA, posée sur l'élément (ou sur la page de la fiche) */
	function notaDe(c, m, t) {
		if (c.tipe === 'element')
			return {
				pagina: c.camin ?? '/',
				clau: c.e.clau,
				extrait: c.e.oc,
				tèxte: m === 'corregir' ? `Correction de l’occitan (texte de Romain) :\n${t}` : t
			};
		return { pagina: c.camin, extrait: `Fiche « ${c.f.titol} »`, tèxte: m === 'corregir' ? `À corriger dans la fiche : ${t}` : t };
	}

	async function mandar() {
		const c = actual;
		const m = mòde;
		const t = tèxte.trim();
		if (!c || t.length < 2 || mandant) return;
		arrestarDictada?.();
		if (m === 'corregir' && c.tipe === 'element' && t === c.e.oc.trim()) {
			error = 'Le texte n’a pas changé : corrige-le, ou dis ce qui ne va pas.';
			return;
		}
		const ok = await far(
			async () => {
				if (m === 'responsa' || m === 'precision') {
					const avant = champs(c.r);
					const err = m === 'responsa' ? await respondre(c.r, t) : await pasEncara(c.r, t);
					return err ? { error: err } : { tornar: () => restablir(c.r, avant) };
				}
				const r = await mandarNotaId({ ...notaDe(c, m, t), per: 'ia' });
				return r.error ? r : { tornar: () => suprimir({ id: r.id }) };
			},
			m === 'responsa' ? 1 : -1,
			m === 'responsa' ? 'Réponse envoyée.' : m === 'precision' ? 'Repartie vers l’IA, avec ta précision.' : 'Note envoyée à l’IA.'
		);
		if (ok) tampar();
	}

	function maiTardCarta() {
		const c = actual;
		if (!c || volant || mandant) return;
		tampar();
		if (cua.length - pos < 2) {
			anonci = 'C’est la dernière carte.';
			return;
		}
		maiTard = [...maiTard.filter((x) => x !== c.id), c.id];
		gardarMaiTard(maiTard);
		cua = [...cua.slice(0, pos), ...cua.slice(pos + 1), c];
		istòria = [...istòria, { carta: c, maiTard: true }];
		anonci = 'Remise au bout de la pile.';
	}

	async function tornar() {
		if (!istòria.length || mandant || volant) return;
		const d = istòria.at(-1);
		tampar();
		mandant = true;
		const err = d.tornar ? await d.tornar() : null;
		mandant = false;
		if (err) {
			error = err;
			return;
		}
		istòria = istòria.slice(0, -1);
		error = '';
		if (d.maiTard) {
			maiTard = maiTard.filter((x) => x !== d.carta.id);
			gardarMaiTard(maiTard);
			cua = [...cua.slice(0, pos), d.carta, ...cua.slice(pos).filter((x) => x.id !== d.carta.id)];
		} else {
			fachas = Math.max(0, fachas - 1);
			pos = Math.max(0, pos - 1);
		}
		anonci = 'Retour à la carte d’avant.';
	}

	function micro() {
		if (escota) return arrestarDictada?.();
		error = '';
		arrestarDictada = dictar(tèxte, { tèxte: (t) => (tèxte = t), fin: () => (escota = false), error: (m) => (error = m) });
		escota = true;
	}

	// --- clavier et glissé ---------------------------------------------------------
	function tecla(e) {
		if (e.target?.closest?.('input, textarea, select')) return;
		if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'z') {
			e.preventDefault();
			tornar();
			return;
		}
		if (fasa !== 'legir' || !actual || e.altKey || e.ctrlKey || e.metaKey) return;
		const t = actual.tipe;
		const accions = {
			ArrowRight: t !== 'question' && bonCarta,
			ArrowLeft: t !== 'question' && (() => obrir(t === 'responsa' ? 'precision' : 'corregir')),
			ArrowUp: t !== 'responsa' && (() => obrir(t === 'question' ? 'responsa' : 'question')),
			ArrowDown: maiTardCarta
		};
		const a = accions[e.key] ?? (t === 'question' && /^[1-6]$/.test(e.key) ? () => opcion(Number(e.key) - 1) : null);
		if (!a) return;
		e.preventDefault();
		a();
	}
	function teclaCamp(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			tampar();
		} else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			mandar();
		}
	}

	function abaissar(e) {
		if (fasa !== 'legir' || volant || mandant || !actual || actual.tipe === 'question') return;
		// les liens et les boutons de la carte restent cliquables
		if (e.target.closest('a, button')) return;
		tira = true;
		x0 = e.clientX;
		carta?.setPointerCapture(e.pointerId);
	}
	function bolegar(e) {
		if (tira) dx = e.clientX - x0;
	}
	function levar() {
		if (!tira) return;
		tira = false;
		if (dx > LLINDAR) bonCarta();
		else if (dx < -LLINDAR) obrir(actual?.tipe === 'responsa' ? 'precision' : 'corregir');
		else dx = 0;
	}

	const ETIQUETAS = {
		corregir: 'Le bon texte : corrige-le ici, ou dis ce qui ne va pas. L’IA vérifie avec lo Congrès, corrige la page et te répond dans Per tu.',
		corregirFicha: 'Ce qu’il faut corriger dans la fiche. L’IA le fait et te répond dans Per tu.',
		question: 'Ta question à l’IA sur ce texte. Elle te répond dans Per tu.',
		precision: 'Ce qui manque encore. La note repart vers l’IA.',
		responsa: 'Ta réponse.'
	};
	let etiqueta = $derived(mòde === 'corregir' && actual?.tipe === 'ficha' ? ETIQUETAS.corregirFicha : (ETIQUETAS[mòde] ?? ''));
	const veireNota = (r) => !!(r.clau || r.extrait || (r.pagina && r.pagina !== '/'));
</script>

<svelte:window onkeydown={tecla} />
<svelte:head>
	<title>La pila — Espaci d'administracion</title>
</svelte:head>

<!-- les marques des textes modifiables : *or* et _italique_ (lib/edicion/marcat.js) -->
{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}

{#snippet contengut(c, viu)}
	{#if c.tipe === 'element'}
		<p class="sòrta"><span lang="oc">{c.e.tipe === 'ligam' ? 'Ligam' : 'Tèxte'}</span> · {nomPagina(c.camin ?? c.e.pagina)}</p>
		<p class="oc" lang="oc">{@render marcat(c.e.oc)}</p>
		{#if c.e.fr?.trim() && c.e.fr.trim() !== c.e.oc.trim()}<p class="fr" lang="fr">{@render marcat(c.e.fr)}</p>{/if}
		{#if c.e.tipe === 'ligam' && c.e.ligam}<p class="desti">mène à {c.e.ligam}</p>{/if}
		{#if viu && c.camin}<a class="veire" href="{c.camin}?veire={encodeURIComponent(c.e.clau)}" lang="oc">Veire sus la pagina</a>{/if}
	{:else if c.tipe === 'ficha'}
		<p class="sòrta"><span lang="oc">Ficha de gramatica</span>{c.f.ecrans?.length ? ` · ${c.f.ecrans.length} écrans` : ''}</p>
		<p class="oc titol" lang="oc">{c.f.titol}</p>
		{#if c.f.fr}<p class="fr" lang="fr">{c.f.fr}</p>{/if}
		{#if c.f.resumit}<p class="oc resumit" lang="oc">{c.f.resumit}</p>{/if}
		{#if viu}<a class="veire" href={c.camin} lang="oc">Legir la ficha</a>{/if}
	{:else if c.tipe === 'question'}
		<p class="sòrta"><span lang="oc">Question</span> · {c.r.autor ?? 'IA'}</p>
		{#if c.r.extrait}<p class="ont">« {c.r.extrait} »</p>{/if}
		<p class="demanda">{c.r.tèxte}</p>
		{#if viu && veireNota(c.r)}<a class="veire" href={ligamNota(c.r)} lang="oc">Veire sus la pagina</a>{/if}
	{:else}
		<p class="sòrta"><span lang="oc">Responsa</span> · {c.r.autor_responsa ?? 'IA'}</p>
		<p class="nòta"><span class="qui">{c.r.de_romain ? 'Ta note' : `Remarque de ${c.r.autor ?? 'quelqu’un'}`} :</span> {c.r.tèxte}</p>
		<p class="responsa">{c.r.responsa ?? (c.r.estat === 'escartada' ? 'Écartée, sans explication.' : 'Fait.')}</p>
		{#if viu}<a class="veire" href={ligamNota(c.r)} lang="oc">Veire sus la pagina</a>{/if}
	{/if}
{/snippet}

<section class="pila" aria-labelledby="pila-titol">
	<header>
		<a class="retorn" href="/admin"><span aria-hidden="true">←</span> <span lang="oc">Per tu</span></a>
		<h1 id="pila-titol" lang="oc">La pila</h1>
		<p class="intro">Ce qui attend ton œil, une carte à la fois : les questions de l’IA, ses réponses, l’occitan des pages, les fiches de grammaire.</p>
		<nav class="lots" aria-label="Ce que montre la pile">
			{#each LOTS as l (l.oc)}
				<a href={l.id ? `?lot=${l.id}` : '/admin/pila'} title={l.fr} aria-current={(lot ?? null) === l.id ? 'page' : undefined} lang="oc">{l.oc}</a>
			{/each}
		</nav>
	</header>

	{#if pila.error}
		<p class="msg error" role="alert">{pila.error}</p>
	{:else if !pila.cargat}
		<p class="calme">Un momenton…</p>
	{:else if !actual}
		<div class="voida">
			<p class="gros">{fachas ? 'La pile est finie.' : 'Rien à valider pour l’instant.'}</p>
			<p>{fachas ? `${fachas} ${fachas > 1 ? 'cartes traitées' : 'carte traitée'}. Les notes envoyées à l’IA te reviendront dans Per tu.` : 'Quand l’IA te pose une question ou qu’un texte change, il arrive ici.'}</p>
			<div class="petits">
				{#if istòria.length}<button type="button" class="segond" onclick={tornar}><span aria-hidden="true">↶</span> <span lang="oc">Tornar</span></button>{/if}
				<a class="segond" href="/admin">Retour à <span lang="oc">Per tu</span></a>
			</div>
		</div>
	{:else}
		<div class="avanc" aria-hidden="true"><span style:width="{(fachas / (fachas + rèsta)) * 100}%"></span></div>
		<p class="comptes"><b>{rèsta}</b> dans la pile{fachas ? ` · ${fachas} ${fachas > 1 ? 'faites' : 'faite'}` : ''}</p>

		<div class="pilon" class:reduch={fasa === 'escriure'}>
			{#if seguent}
				<div class="carta darrier" aria-hidden="true">{@render contengut(seguent, false)}</div>
			{/if}
			{#key actual.id}
				<div
					class="carta"
					class:tira
					class:volant
					class:calme
					class:question={actual.tipe === 'question'}
					bind:this={carta}
					style:translate="{dx}px 0"
					style:rotate="{dx / 24}deg"
					onpointerdown={abaissar}
					onpointermove={bolegar}
					onpointerup={levar}
					onpointercancel={levar}
					role="group"
					aria-roledescription="carte"
					aria-label="Carte {pos + 1} sur {cua.length}"
				>
					{#if actual.tipe !== 'question'}
						<span class="tampon tampon-bon" style:opacity={Math.max(0, senhal)} aria-hidden="true" lang="oc">Bon</span>
						<span class="tampon tampon-corregir" style:opacity={fasa === 'escriure' && (mòde === 'corregir' || mòde === 'precision') ? 1 : Math.max(0, -senhal)} aria-hidden="true" lang="oc"
							>{actual.tipe === 'responsa' ? 'Pas encara' : 'Corregir'}</span
						>
					{/if}
					{@render contengut(actual, true)}
				</div>
			{/key}
		</div>

		{#if fasa === 'legir'}
			{#if actual.tipe === 'question'}
				<div class="opcions">
					{#each actual.r.opcions ?? [] as o, i (i)}
						<button type="button" class="opcion" onclick={() => opcion(i)} disabled={mandant}><span class="n" aria-hidden="true">{i + 1}</span> {o}</button>
					{/each}
					<button type="button" class="opcion autra" onclick={() => obrir('responsa')} disabled={mandant}>
						<span class="n" aria-hidden="true">↑</span> <span lang="oc">{actual.r.opcions?.length ? 'Autra responsa' : 'Respondre'}</span>
					</button>
				</div>
			{:else}
				<div class="grands">
					<button type="button" class="b-corregir" onclick={() => obrir(actual.tipe === 'responsa' ? 'precision' : 'corregir')} disabled={mandant} title="Flèche gauche">
						<span aria-hidden="true">←</span> <span lang="oc">{actual.tipe === 'responsa' ? 'Pas encara' : 'Corregir'}</span>
					</button>
					<button type="button" class="b-bon" onclick={bonCarta} disabled={mandant} title="Flèche droite">
						<span lang="oc">Bon</span> <span aria-hidden="true">→</span>
					</button>
				</div>
			{/if}
			<div class="petits">
				<button type="button" class="segond" onclick={tornar} disabled={!istòria.length || mandant} title="Revenir sur le dernier geste (Ctrl+Z)">
					<span aria-hidden="true">↶</span> <span lang="oc">Tornar</span>
				</button>
				{#if actual.tipe === 'element' || actual.tipe === 'ficha'}
					<button type="button" class="segond" onclick={() => obrir('question')} disabled={mandant} title="Flèche haut">
						<span aria-hidden="true">↑</span> <span lang="oc">Question</span>
					</button>
				{/if}
				<button type="button" class="segond" onclick={maiTardCarta} disabled={mandant} title="Flèche bas">
					<span aria-hidden="true">↓</span> <span lang="oc">Mai tard</span>
				</button>
			</div>
		{:else}
			<form
				class="escriure"
				onsubmit={(e) => {
					e.preventDefault();
					mandar();
				}}
			>
				<label for="pila-camp">{etiqueta}</label>
				<textarea id="pila-camp" bind:this={camp} bind:value={tèxte} onkeydown={teclaCamp} rows="4" maxlength="1800"></textarea>
				<div class="accions">
					{#if dictadaPossibla}
						<button type="button" class="segond" class:escota onclick={micro} aria-pressed={escota}><span lang="oc">{escota ? 'Arrestar' : 'Dictar'}</span></button>
					{/if}
					<span class="espaci"></span>
					<button type="button" class="segond" onclick={tampar} disabled={mandant}><span lang="oc">Anullar</span></button>
					<button type="submit" class="agir" disabled={tèxte.trim().length < 2 || mandant}><span lang="oc">Mandar</span></button>
				</div>
			</form>
		{/if}

		{#if error}<p class="msg error" role="alert">{error}</p>{/if}
		<p class="tecas">Au clavier : → <span lang="oc">Bon</span> · ← <span lang="oc">Corregir</span> · ↑ <span lang="oc">Question</span> · ↓ <span lang="oc">Mai tard</span> · Ctrl+Z pour revenir</p>
	{/if}
	<p class="anonci" role="status" aria-live="polite">{anonci}</p>
</section>

<style>
	/* La pile : même geste que Triar (une carte, on la garde ou on la renvoie),
	   aux couleurs du site. La carte est sombre, quel que soit le thème, pour que
	   l'occitan soit la seule chose qu'on lit ; le reste en filets fins. */
	.pila {
		--p-encre: #2a1a10;
		--p-encre-2: rgba(42, 26, 16, 0.72);
		--p-filet: rgba(42, 26, 16, 0.16);
		--p-or: #9c5611;
		width: min(100%, 34rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.85rem;
		font-family: var(--font-body);
		color: var(--p-encre);
	}
	header {
		width: 100%;
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		text-align: center;
	}
	.retorn {
		justify-self: start;
		color: var(--p-encre-2);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}
	.retorn:hover {
		color: var(--p-encre);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 400;
	}
	.intro {
		margin: 0;
		max-width: 30rem;
		color: var(--p-encre-2);
		font-size: 0.92rem;
		line-height: 1.45;
	}
	.lots {
		display: flex;
		gap: 1.1rem;
		margin-top: 0.15rem;
	}
	.lots a {
		color: inherit;
		font-size: 0.92rem;
		text-underline-offset: 0.2em;
	}
	.lots a[aria-current='page'] {
		font-weight: 700;
		text-decoration: none;
	}
	.avanc {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--p-filet);
		overflow: hidden;
	}
	.avanc span {
		display: block;
		height: 100%;
		background: var(--p-or);
		transition: width 0.3s ease;
	}
	.comptes {
		margin: -0.35rem 0 0;
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	/* --- la carte du dessus, et la suivante qui attend derrière ------------------ */
	.pilon {
		position: relative;
		width: 100%;
		display: grid;
	}
	.carta {
		grid-area: 1 / 1;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.55rem;
		min-height: 15rem;
		justify-content: center;
		padding: 2.6rem 1.4rem 1.4rem;
		border-radius: 1.25rem;
		background: #2f170e;
		color: #fbf1e1;
		box-shadow: 0 10px 30px rgba(42, 26, 16, 0.25);
		text-align: center;
		touch-action: pan-y;
		user-select: none;
		cursor: grab;
		transition:
			translate 0.26s ease-in,
			rotate 0.26s ease-in;
		animation: arribar 0.22s ease-out;
	}
	.carta.question {
		cursor: default;
		user-select: text;
	}
	.carta.tira {
		transition: none;
		cursor: grabbing;
	}
	.carta.darrier {
		scale: 0.95;
		translate: 0 0.6rem;
		opacity: 0.5;
		animation: none;
		pointer-events: none;
	}
	.carta.calme {
		transition: none;
		animation: none;
	}
	@keyframes arribar {
		from {
			scale: 0.96;
			opacity: 0.6;
		}
	}
	.reduch .carta {
		min-height: 0;
	}
	.sòrta {
		position: absolute;
		top: 1rem;
		left: 0;
		right: 0;
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		color: rgba(251, 241, 225, 0.72);
	}
	.oc {
		margin: 0;
		font-size: 1.3rem;
		line-height: 1.4;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.oc.titol {
		font-size: 1.5rem;
		font-weight: 700;
	}
	.aur {
		color: #ffd98a;
	}
	.oc.resumit {
		font-size: 1.05rem;
		color: #ffd98a;
	}
	.fr,
	.desti,
	.ont {
		margin: 0;
		font-size: 0.92rem;
		color: rgba(251, 241, 225, 0.78);
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.fr {
		font-style: italic;
	}
	.demanda {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.45;
		white-space: pre-line;
	}
	.nòta,
	.responsa {
		margin: 0;
		max-width: 28rem;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.nòta {
		color: rgba(251, 241, 225, 0.78);
		font-size: 0.92rem;
	}
	.qui {
		font-weight: 700;
	}
	.responsa {
		font-size: 1.1rem;
	}
	.veire {
		margin-top: 0.3rem;
		color: #ffd98a;
		font-size: 0.88rem;
		font-weight: 600;
		text-underline-offset: 0.2em;
	}
	.veire:focus-visible {
		outline: 2px solid #ffd98a;
		outline-offset: 3px;
		border-radius: 2px;
	}
	/* les tampons qui apparaissent quand on glisse (comme Triar) */
	.tampon {
		position: absolute;
		top: 2.4rem;
		padding: 0.15rem 0.6rem;
		border: 2px solid currentColor;
		border-radius: 0.5rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		pointer-events: none;
	}
	.tampon-bon {
		left: 1rem;
		color: #ffd98a;
		rotate: -10deg;
	}
	.tampon-corregir {
		right: 1rem;
		color: #fbf1e1;
		rotate: 10deg;
	}

	/* --- les boutons ---------------------------------------------------------------- */
	.grands {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.grands button,
	.petits :is(button, a),
	.opcion,
	.agir,
	.segond {
		font: 700 0.95rem/1.2 var(--font-body);
		border-radius: 999px;
		cursor: pointer;
	}
	.b-corregir,
	.b-bon {
		min-height: 3.4rem;
		padding: 0.5rem 1rem;
		font-size: 1.02rem !important;
	}
	.b-corregir {
		border: 1px solid var(--p-encre-2);
		background: transparent;
		color: var(--p-encre);
	}
	/* règle B : le rouge du logo en aplat = ce qui se clique pour agir */
	.b-bon,
	.agir {
		border: 0;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.b-bon:hover:not(:disabled),
	.agir:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.b-corregir:hover:not(:disabled),
	.segond:hover:not(:disabled) {
		background: rgba(42, 26, 16, 0.06);
	}
	.petits {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
	}
	.segond {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.42rem 0.95rem;
		border: 1px solid var(--p-filet);
		background: transparent;
		color: var(--p-encre);
		text-decoration: none;
	}
	.segond.escota {
		border-color: var(--p-or);
		color: var(--p-or);
	}
	button:disabled {
		opacity: 0.45;
		cursor: default;
	}
	:is(button, a):focus-visible {
		outline: 2px solid var(--p-or);
		outline-offset: 2px;
	}
	.opcions {
		width: 100%;
		display: grid;
		gap: 0.45rem;
	}
	.opcion {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: 100%;
		min-height: 3rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--p-filet);
		border-radius: 0.9rem !important;
		background: #fff;
		color: var(--p-encre);
		text-align: left;
	}
	.opcion:hover:not(:disabled) {
		border-color: var(--p-or);
	}
	.opcion .n {
		flex: none;
		width: 1.6rem;
		color: var(--p-or);
		font-variant-numeric: tabular-nums;
		text-align: center;
	}
	.opcion.autra {
		background: transparent;
	}

	/* --- écrire (corriger, demander, répondre) ------------------------------------ */
	.escriure {
		width: 100%;
		display: grid;
		gap: 0.45rem;
	}
	.escriure label {
		font-weight: 400;
		font-size: 0.92rem;
		color: var(--p-encre-2);
		line-height: 1.4;
	}
	textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: 7rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--p-filet);
		border-radius: 0.8rem;
		background: #fff;
		color: var(--p-encre);
		font: 1rem/1.45 var(--font-body);
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--p-or);
		outline-offset: 1px;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}
	.agir {
		padding: 0.45rem 1.1rem;
	}
	.espaci {
		flex: 1;
	}

	.msg.error {
		margin: 0;
		font-weight: 700;
	}
	.calme {
		color: var(--p-encre-2);
	}
	.tecas {
		margin: 0.2rem 0 0;
		color: var(--p-encre-2);
		font-size: 0.8rem;
		text-align: center;
	}
	.voida {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		padding: 2.5rem 1rem;
		text-align: center;
	}
	.voida p {
		margin: 0;
		max-width: 26rem;
		color: var(--p-encre-2);
	}
	.voida .gros {
		color: var(--p-encre);
		font-size: 1.2rem;
		font-weight: 700;
	}
	.anonci {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* au clavier tactile, la carte rapetisse pour laisser la place au champ */
	@media (max-width: 719px) {
		.carta {
			min-height: 12rem;
			padding: 2.4rem 1rem 1.1rem;
		}
		.oc {
			font-size: 1.15rem;
		}
		.tecas {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.carta,
		.avanc span {
			transition: none;
			animation: none;
		}
	}
</style>
