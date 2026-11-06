<script>
	import Icona from '$lib/components/Icona.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Crotz from '$lib/components/Crotz.svelte';
	import FougasseIcon from '$lib/components/FougasseIcon.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import { esAdmin } from '$lib/adminStore';
	import { PALETAS } from '$lib/apren/teulas.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { moduls, ordre } from '$lib/lesson/moduls/index.js';
	import { playTick, playChime } from '$lib/lesson/sounds.js';
	import QcmBlock from '$lib/lesson/QcmBlock.svelte';
	import RevealBlock from '$lib/lesson/RevealBlock.svelte';
	import OrderBlock from '$lib/lesson/OrderBlock.svelte';
	import DialogueBlock from '$lib/lesson/DialogueBlock.svelte';
	import ChunksBlock from '$lib/lesson/ChunksBlock.svelte';
	import TableBlock from '$lib/lesson/TableBlock.svelte';
	import NoteBlock from '$lib/lesson/NoteBlock.svelte';
	import ChecklistBlock from '$lib/lesson/ChecklistBlock.svelte';
	import EscriureBlock from '$lib/lesson/EscriureBlock.svelte';
	import CausidaBlock from '$lib/lesson/CausidaBlock.svelte';
	import CartaBlock from '$lib/lesson/CartaBlock.svelte';
	import FotosBlock from '$lib/lesson/FotosBlock.svelte';
	import CartaTitol from '$lib/lesson/CartaTitol.svelte';
	import Remarcas from '$lib/lesson/Remarcas.svelte';
	import { rich, insecable } from '$lib/lesson/rich.js';
	import { demarrerCarnet, noterExercice } from '$lib/carnet/carnet.svelte.js';

	let modul = $derived(moduls[$page.params.modulId]);
	let posicion = $derived(ordre.indexOf($page.params.modulId));
	let precedent = $derived(posicion > 0 ? ordre[posicion - 1] : null);
	let seguent = $derived(posicion >= 0 && posicion < ordre.length - 1 ? ordre[posicion + 1] : null);
	// Le fil ne montre que les modules de la même unité (tout l'A1 compte
	// une quarantaine de modules) ; le numéro seulement pour « 2-1 », « 2-2 »…
	let filUnitat = $derived(modul ? ordre.filter((id) => moduls[id].unitat === modul.unitat) : []);
	const numeroDe = (id) => (/^\d+-\d+$/.test(id) ? id.replace('-', '.') : '');

	// 'list' = sommaire des étapes ; un nombre = l'étape ouverte.
	let view = $state('list');
	let done = $state([]);
	let points = $state(0);
	let muted = $state(false);
	let pillPulse = $state(false);

	let storageKey = $derived(modul ? `lo-ligam-${modul.id}-progress` : '');
	let doneCount = $derived(done.filter(Boolean).length);
	let allDone = $derived(modul ? doneCount >= modul.sessions.length : false);

	// La progression tient dans un entier (bitmask : 1 bit par étape) pour
	// réutiliser la colonne word_index de lesson_progress sans migration.
	function toMask(arr) {
		return arr.reduce((m, d, i) => (d ? m | (1 << i) : m), 0);
	}

	function fromMask(mask, length) {
		return Array.from({ length }, (_, i) => Boolean(mask & (1 << i)));
	}

	async function waitForAuthReady() {
		if (get(authReady)) return;
		await new Promise((resolve) => {
			const unsubscribe = authReady.subscribe((ready) => {
				if (ready) {
					unsubscribe();
					resolve();
				}
			});
		});
	}

	async function loadProgress(m) {
		done = m.sessions.map(() => false);
		points = 0;
		view = 'list';
		if (browser) await waitForAuthReady();
		const currentSession = get(session);
		if (currentSession) {
			try {
				const { data } = await supabase
					.from('lesson_progress')
					.select('word_index, points')
					.eq('module_id', m.id)
					.maybeSingle();
				if (data) {
					done = fromMask(data.word_index ?? 0, m.sessions.length);
					points = data.points ?? 0;
				}
			} catch (e) {
				/* échec réseau : on repart simplement de zéro, sans bloquer */
			}
			return;
		}
		if (!browser) return;
		try {
			const saved = JSON.parse(localStorage.getItem(`lo-ligam-${m.id}-progress`) || 'null');
			if (saved) {
				done = fromMask(saved.mask ?? 0, m.sessions.length);
				points = saved.points ?? 0;
			}
		} catch (e) {
			/* stockage indisponible (navigation privée…) : pas bloquant */
		}
	}

	// Naviguer de /modul/1-1 vers /modul/1-2 ne remonte pas le composant
	// (même route) : on recharge la progression quand le module change.
	let loadedFor = null;
	$effect(() => {
		if (modul && loadedFor !== modul.id) {
			loadedFor = modul.id;
			loadProgress(modul);
		}
	});

	onMount(() => {
		/* le $effect ci-dessus fait le premier chargement */
		demarrerCarnet();
	});

	async function saveProgress() {
		const mask = toMask(done);
		const currentSession = get(session);
		if (currentSession) {
			try {
				await supabase.from('lesson_progress').upsert({
					user_id: currentSession.user.id,
					module_id: modul.id,
					word_index: mask,
					points,
					updated_at: new Date().toISOString(),
					...(allDone ? { completed_at: new Date().toISOString() } : {})
				});
			} catch (e) {
				/* échec réseau : pas bloquant, la progression reste locale */
			}
			return;
		}
		if (!browser) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify({ mask, points }));
		} catch (e) {
			/* stockage indisponible : pas bloquant */
		}
	}

	// Déblocage progressif : dans une étape, un bloc interactif (questions,
	// remise en ordre…) doit être réussi pour révéler la suite ; les blocs de
	// lecture (dialogue, tableau, notes…) accompagnent sans bloquer.
	const INTERACTIUS = new Set(['qcm', 'reveal', 'order', 'escriure', 'causida', 'carta']);
	let blockDone = $state([]);

	let visibleBlockCount = $derived.by(() => {
		if (view === 'list' || !modul) return 0;
		const blocks = modul.sessions[view].blocks;
		let n = 0;
		for (let i = 0; i < blocks.length; i++) {
			n = i + 1;
			if (INTERACTIUS.has(blocks[i].type) && !blockDone[i]) break;
		}
		return n;
	});

	let allBlocksDone = $derived.by(() => {
		if (view === 'list' || !modul) return false;
		return modul.sessions[view].blocks.every(
			(b, i) => !INTERACTIUS.has(b.type) || blockDone[i]
		);
	});

	function openSession(i) {
		view = i;
		// Retour au sommaire (bouton ×) : pas d'étape à préparer
		if (i === 'list') {
			if (browser) window.scrollTo({ top: 0 });
			return;
		}
		// Étape déjà terminée : tout est déverrouillé pour la relecture.
		blockDone = modul.sessions[i].blocks.map(() => done[i] === true);
		if (browser) window.scrollTo({ top: 0 });
	}

	// La fougasse gagnée s'envole du bouton vers le compteur (comme sur
	// l'essai libre) ; les punts s'ajoutent à son arrivée.
	let pointsPillEl = $state(null);
	let finishBtnEl = $state(null);
	let flyingFogassa = $state(null);
	let flyId = 0;

	function flyFogassa() {
		if (!browser || !finishBtnEl || !pointsPillEl) return false;
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
		const from = finishBtnEl.getBoundingClientRect();
		const to = pointsPillEl.getBoundingClientRect();
		flyId += 1;
		flyingFogassa = {
			id: flyId,
			startX: from.left + from.width / 2,
			startY: from.top + from.height / 2,
			dx: to.left + to.width / 2 - (from.left + from.width / 2),
			dy: to.top + to.height / 2 - (from.top + from.height / 2)
		};
		const thisFly = flyId;
		setTimeout(() => {
			if (flyingFogassa?.id === thisFly) flyingFogassa = null;
		}, 600);
		return true;
	}

	function finishSession(i) {
		if (done[i]) {
			view = 'list';
			if (browser) window.scrollTo({ top: 0 });
			return;
		}
		done[i] = true;
		const envol = flyFogassa();
		const delai = envol ? 520 : 0;
		setTimeout(() => {
			points += 10;
			pillPulse = true;
			setTimeout(() => (pillPulse = false), 260);
			if (!muted) playChime();
			saveProgress();
		}, delai);
		setTimeout(() => {
			view = 'list';
			if (browser) window.scrollTo({ top: 0 });
		}, envol ? 950 : 0);
	}

	function onCorrect() {
		if (!muted) playTick();
	}

	// Carnet de révision : les questions à choix notent « je reconnais »,
	// « Remets dans l'ordre » note « je produis » (cahier §11, 2026-10-24).
	const noterReconnais = (item, reussi) => noterExercice(item.choses, 'reconnais', reussi);
	const noterProduis = (item, reussi) => noterExercice(item.choses, 'produis', reussi);
</script>

<svelte:head>
	<title>{[typeof view === 'number' ? modul?.sessions?.[view]?.title : null, modul?.oc, 'Lo Ligam'].filter(Boolean).join(' · ')}</title>
</svelte:head>

{#snippet speakerIcon(active)}
	<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
		<path d="M4 9v6h4l5 4V5L8 9H4Z" />
		{#if active}
			<path d="M16.3 8.7a5 5 0 0 1 0 6.6" />
			<path d="M19 6a8.2 8.2 0 0 1 0 12" />
		{:else}
			<line x1="16.5" y1="8" x2="21" y2="16" />
			<line x1="21" y1="8" x2="16.5" y2="16" />
		{/if}
	</svg>
{/snippet}

<div class="pagina">
	<header class="barra">
		<a class="acuelh" href="/" aria-label={tria({ oc: 'Acuèlh', fr: 'Accueil', es: 'Inicio', en: 'Home', ca: 'Inici', ar: 'الرئيسية' })}>
			<Crotz talha={30} teula />
			<span>{tria({ oc: 'Acuèlh', fr: 'Accueil', es: 'Inicio', en: 'Home', ca: 'Inici', ar: 'الرئيسية' })}</span>
		</a>
		{#if modul && view !== 'list'}
			<button type="button" class="pc pc-2 tornar" onclick={() => openSession('list')}>
				<Icona nom="precedent" size="1em" /> {tria({ oc: 'Somari', fr: 'Sommaire', es: 'Índice', en: 'Contents', ca: 'Índex', ar: 'الفهرس' })}
			</button>
		{:else}
			<a class="pc pc-2 tornar" href="/apren"><Icona nom="precedent" size="1em" /> S’apren</a>
		{/if}
		<span class="espaci"></span>
		{#if modul}
			<div class="points-pill" class:pulse={pillPulse} bind:this={pointsPillEl} aria-label="{points} fogaças">
				<FougasseIcon size={20} /> {points}
			</div>
			<button
				type="button"
				class="pc pc-2 pc-icone rond"
				onclick={() => (muted = !muted)}
				aria-label={muted ? 'Activar lo son' : 'Copar lo son'}
			>
				{@render speakerIcon(!muted)}
			</button>
		{/if}
	</header>

	<main class="screen" class:larga={view === 'list'}>
		{#if !modul}
			<section class="missing">
				<p>Ce module n'existe pas (encore).</p>
				<a class="pc btn-primary" href="/apren">Tornar a S’apren</a>
			</section>
		{:else if view === 'list'}
			{#if modul.ouverture}
				<CartaTitol ouverture={modul.ouverture} />
			{:else}
				<p class="unitat-rapel">{modul.unitat}</p>
			{/if}

			<!-- Les quatre modules de l'unité, pour voir où l'on est -->
			<nav class="fil" aria-label="Modules de l’unité">
				{#each filUnitat as id}
					<a href="/aprene/modul/{id}" class:actual={id === $page.params.modulId} aria-current={id === $page.params.modulId ? 'page' : undefined}>
						{#if numeroDe(id)}<b>{numeroDe(id)}</b>{/if}<span lang="oc">{insecable(moduls[id].oc)}</span>
					</a>
				{/each}
			</nav>

			<section class="modul-head">
				<p class="kicker">{modul.nivel}</p>
				<svelte:element this={modul.ouverture ? 'h2' : 'h1'} class="title" lang="oc">{insecable(modul.oc)}</svelte:element>
				<p class="subtitle">({modul.fr})</p>
				<p class="cando">{modul.cando}</p>
				<p class="durada">{modul.durada}</p>
			</section>

			<ol class="teulas">
				{#each modul.sessions as s, i}
					{@const [fons, tinta] = PALETAS.charta[i % PALETAS.charta.length]}
					<li class="teula" class:done={done[i]} style:--fons={fons} style:--tinta={tinta} style:--i={i}>
						<button type="button" onclick={() => openSession(i)}>
							<span class="num" aria-hidden="true">{#if done[i]}<Icona nom="valide" size="0.9em" />{:else}{String(i + 1).padStart(2, '0')}{/if}</span>
							<span class="nom" lang="oc">{insecable(s.title)}</span>
							{#if s.fr}<span class="nom-fr">({s.fr})</span>{/if}
							<span class="min">{s.minutes} min{done[i] ? ' · fach' : ''}</span>
						</button>
					</li>
				{/each}
			</ol>

			{#if allDone}
				<p class="all-done">
					Modul acabat, òsca ! <em>(module terminé, bravo !)</em>
				</p>
				{#if seguent}
					<a class="btn-primary" href="/aprene/modul/{seguent}">
						Modul seguent : {moduls[seguent].oc}
						<span class="finish-sub"><em>(module suivant)</em></span>
					</a>
				{/if}
			{/if}

			<!-- Romain relit en jouant : les questions de la fiche, sous ses yeux, tant que le module n'est pas relu -->
			{#if $esAdmin && !modul.relu && modul.notesRelecture?.length}
				<details class="questions-relecture" open>
					<summary>Questions de relecture <em>(pour toi seul)</em></summary>
					<ol>
						{#each modul.notesRelecture as n}<li>{@html rich(n)}</li>{/each}
					</ol>
					<p>Réponds de vive voix à Claude, avec le numéro du module et de la question.</p>
				</details>
			{/if}

			<p class="draft-note">Contenu en cours de validation linguistique. L’audio arrive.</p>
		{:else}
			{@const s = modul.sessions[view]}
			<section class="session-head">
				<p class="kicker"><span lang="oc">{insecable(modul.oc)}</span> · {tria({ oc: 'Etapa', fr: 'Étape', es: 'Etapa', en: 'Step', ca: 'Etapa', ar: 'الخطوة' })} {view + 1}/{modul.sessions.length}</p>
				<h1 class="session-h"><b>{String(view + 1).padStart(2, '0')}</b> <span lang="oc">{insecable(s.title)}</span></h1>
				{#if s.fr}<p class="session-fr-h">({s.fr})</p>{/if}
				<p class="session-min-line">~{s.minutes} min · à ton rythme</p>
			</section>

			{#key view}
				<div class="blocks">
					{#each s.blocks.slice(0, visibleBlockCount) as block, bi}
						<div class="block-slot" data-bloc={bi}>
							{#if block.type === 'qcm'}
								<QcmBlock {block} {onCorrect} onResult={noterReconnais} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'reveal'}
								<RevealBlock {block} {onCorrect} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'order'}
								<OrderBlock {block} {onCorrect} onResult={noterProduis} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'escriure'}
								<EscriureBlock {block} {onCorrect} onResult={noterProduis} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'causida'}
								<CausidaBlock {block} {onCorrect} onResult={noterReconnais} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'carta'}
								<CartaBlock {block} {onCorrect} onResult={noterReconnais} onComplete={() => (blockDone[bi] = true)} />
							{:else if block.type === 'dialogue'}
								<DialogueBlock {block} />
							{:else if block.type === 'chunks'}
								<ChunksBlock {block} />
							{:else if block.type === 'table'}
								<TableBlock {block} />
							{:else if block.type === 'note'}
								<NoteBlock {block} />
							{:else if block.type === 'checklist'}
								<ChecklistBlock {block} storagePrefix={`lo-ligam-${modul.id}`} />
							{:else if block.type === 'fotos'}
								<FotosBlock {block} />
							{/if}
						</div>
					{/each}

					{#if allBlocksDone}
						<button
							type="button"
							class="pc btn-primary finish"
							bind:this={finishBtnEl}
							onclick={() => finishSession(view)}
						>
							{done[view] ? 'Tornar al somari' : 'Acabada ✓'}
							<span class="finish-sub"><em>{done[view] ? '(retour au sommaire)' : '(étape terminée)'}</em></span>
						</button>
					{:else}
						<p class="unlock-hint">La suite se débloque en répondant ci-dessus ↑</p>
					{/if}
				</div>
			{/key}

			{#if flyingFogassa}
				{#key flyingFogassa.id}
					<div
						class="flying-fogassa"
						style="left:{flyingFogassa.startX}px; top:{flyingFogassa.startY}px; --dx:{flyingFogassa.dx}px; --dy:{flyingFogassa.dy}px;"
						aria-hidden="true"
					>
						<FougasseIcon size={22} />
					</div>
				{/key}
			{/if}
		{/if}
	</main>
	{#if modul}
		<Remarcas {modul} etapa={view === 'list' ? null : view} />
	{/if}
</div>

<style>
	/* Le cadre des pages intérieures, comme S'apren (harmonisé le 2026-10-25) :
	   fond du thème, une chaleur de braise en haut à gauche, rien qui bouge */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}

	/* La barre : le logo marqué « Acuèlh », le retour, les fougasses et le son */
	.barra {
		display: flex;
		align-items: center;
		gap: var(--esp-12);
		padding: 1.3rem var(--marge);
	}

	.acuelh {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--t-tinta);
		font-family: var(--font-logo);
		font-size: 1.05rem;
		text-decoration: none;
	}

	.acuelh:hover span {
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 4px;
	}

	/* pièce de papier (lib/styles/papier.css) */
	.tornar {
		--r: 10px;
		min-height: 0;
		gap: 0.4rem;
		margin-left: var(--esp-8);
		padding: 0.4rem 0.85rem;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.espaci {
		flex: 1;
	}

	.points-pill {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
		color: var(--t-aur);
		font-family: var(--font-heading);
		font-size: 0.95rem;
		transition: transform 220ms ease;
	}

	.points-pill.pulse {
		transform: scale(1.18);
	}

	.rond {
		width: 2.3rem;
		height: 2.3rem;
		min-height: 0;
		--r: 10px;
	}

	.screen {
		display: flex;
		flex-direction: column;
		gap: var(--esp-24);
		max-width: calc(44rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1rem, 4vh, 2.5rem) var(--marge) var(--esp-96);
	}

	.screen.larga {
		max-width: calc(64rem + 2 * var(--marge));
	}

	.missing {
		text-align: center;
		padding-top: 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		align-items: center;
	}

	.unitat-rapel {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}

	/* Le fil de l'unité : les quatre modules, celui du jour en or */
	.fil {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}

	.fil a {
		padding: 0.35rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: var(--t-tinta-2);
		font-size: 0.85rem;
		text-decoration: none;
	}

	/* Svelte retire l'espace en fin de bloc {#if} : l'écart vient du CSS. */
	.fil a b {
		margin-right: 0.35em;
		font-family: var(--font-heading);
		font-weight: 400;
		color: var(--t-aur);
	}

	.fil a:hover {
		border-color: var(--t-aur);
	}

	.fil a.actual {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
		color: var(--t-tinta);
	}

	.modul-head,
	.session-head {
		animation: fade-in 450ms ease-out;
	}

	.kicker {
		margin: 0 0 var(--esp-4);
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--t-aur);
	}

	.title {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7vw, 4.2rem);
		line-height: 1;
		color: var(--t-tinta);
	}

	.subtitle {
		margin: var(--esp-8) 0 0;
		font-size: 1.05rem;
		color: var(--t-tinta-2);
	}

	.cando {
		max-width: 46ch;
		margin: var(--esp-16) 0 0;
		font-size: 1.05rem;
		line-height: 1.55;
	}

	.durada {
		margin: var(--esp-8) 0 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	/* Les six étapes en cases de couleur, comme les portes de S'apren */
	.teulas {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.teula {
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 60ms);
	}

	.teula button {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		height: 100%;
		min-height: 11rem;
		padding: var(--esp-16) var(--esp-16) var(--esp-12);
		border: none;
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}

	.teula button:hover {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
	}

	.teula button:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	.teula.done button {
		opacity: 0.72;
	}

	.num {
		display: flex;
		align-items: center;
		min-height: 2.4rem;
		font-family: var(--font-heading);
		font-size: 2.4rem;
		line-height: 1;
	}

	.nom {
		margin-top: auto;
		padding-top: var(--esp-16);
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 1.8vw, 1.4rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.nom-fr {
		margin-top: var(--esp-4);
		font-size: 0.85rem;
		opacity: 0.85;
	}

	.min {
		margin-top: var(--esp-8);
		font-size: 0.78rem;
		opacity: 0.8;
	}

	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	.all-done {
		margin: 0;
		text-align: center;
		font-family: var(--font-heading);
		font-size: 1.2rem;
		color: var(--t-aur);
	}

	.all-done em {
		display: block;
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	.questions-relecture {
		padding: var(--esp-12) var(--esp-16);
		border: 1px dashed var(--t-aur);
		border-radius: 10px;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.questions-relecture summary {
		font-family: var(--font-heading);
		color: var(--t-aur);
		cursor: pointer;
	}

	.questions-relecture ol {
		margin: var(--esp-8) 0;
		padding-left: 1.3rem;
	}

	.questions-relecture li + li {
		margin-top: 0.35rem;
	}

	.questions-relecture p {
		margin: 0;
		color: var(--t-tinta-2);
	}

	.draft-note {
		margin: 0;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}

	.session-h {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.3em;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 6vw, 3.2rem);
		line-height: 1.05;
	}

	.session-h b {
		font-weight: 400;
		font-size: 0.6em;
		color: var(--t-aur);
	}

	.session-fr-h {
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
	}

	.session-min-line {
		margin: var(--esp-4) 0 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	.blocks {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		animation: fade-in 400ms ease-out;
	}

	/* chaque bouton est une tuile du logo : le rouge du fond, le texte crème */
	.btn-primary {
		align-self: center;
		flex-direction: column;
		gap: 0.1rem;
		min-height: 0;
		padding: 0.8rem 1.8rem;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		font-weight: 600;
	}

	.finish {
		margin-top: 0.6rem;
	}

	.block-slot {
		animation: fade-in 400ms ease-out;
	}

	.unlock-hint {
		margin: 0.4rem 0 0;
		text-align: center;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	.flying-fogassa {
		position: fixed;
		z-index: 60;
		pointer-events: none;
		transform: translate(-50%, -50%);
		animation: fly-to-points 560ms cubic-bezier(0.3, 0, 0.35, 1) forwards;
	}

	@keyframes fly-to-points {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
		65% {
			transform: translate(calc(-50% + var(--dx) * 0.7), calc(-50% + var(--dy) * 0.55 - 24px)) scale(1.1);
			opacity: 1;
		}
		100% {
			transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.35);
			opacity: 0;
		}
	}

	.finish-sub {
		font-family: var(--font-body);
		font-size: 0.72rem;
		opacity: 0.85;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* sur téléphone : deux cases par ligne */
	@media (max-width: 640px) {
		.teulas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-8);
		}
		.teula button {
			min-height: 9.5rem;
			padding: var(--esp-12);
		}
		.num {
			font-size: 2rem;
		}
		.barra {
			gap: var(--esp-8);
		}
		.tornar {
			margin-left: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.modul-head,
		.session-head,
		.teula,
		.blocks,
		.block-slot,
		.flying-fogassa {
			animation: none;
		}

		.teula button,
		.btn-primary,
		.points-pill {
			transition: none;
		}
	}
</style>
