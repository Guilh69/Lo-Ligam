<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import HomeIcon from '$lib/components/HomeIcon.svelte';
	import FougasseIcon from '$lib/components/FougasseIcon.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import { moduls } from '$lib/lesson/moduls/index.js';
	import { playTick, playChime } from '$lib/lesson/sounds.js';
	import QcmBlock from '$lib/lesson/QcmBlock.svelte';
	import RevealBlock from '$lib/lesson/RevealBlock.svelte';
	import OrderBlock from '$lib/lesson/OrderBlock.svelte';
	import DialogueBlock from '$lib/lesson/DialogueBlock.svelte';
	import ChunksBlock from '$lib/lesson/ChunksBlock.svelte';
	import TableBlock from '$lib/lesson/TableBlock.svelte';
	import NoteBlock from '$lib/lesson/NoteBlock.svelte';
	import ChecklistBlock from '$lib/lesson/ChecklistBlock.svelte';

	let modul = $derived(moduls[$page.params.modulId]);

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

	onMount(async () => {
		if (!modul) return;
		done = modul.sessions.map(() => false);
		if (browser) await waitForAuthReady();
		const currentSession = get(session);
		if (currentSession) {
			try {
				const { data } = await supabase
					.from('lesson_progress')
					.select('word_index, points')
					.eq('module_id', modul.id)
					.maybeSingle();
				if (data) {
					done = fromMask(data.word_index ?? 0, modul.sessions.length);
					points = data.points ?? 0;
				}
			} catch (e) {
				/* échec réseau : on repart simplement de zéro, sans bloquer */
			}
			return;
		}
		if (!browser) return;
		try {
			const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
			if (saved) {
				done = fromMask(saved.mask ?? 0, modul.sessions.length);
				points = saved.points ?? 0;
			}
		} catch (e) {
			/* stockage indisponible (navigation privée…) : pas bloquant */
		}
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

	function openSession(i) {
		view = i;
		if (browser) window.scrollTo({ top: 0 });
	}

	function finishSession(i) {
		if (!done[i]) {
			done[i] = true;
			points += 10;
			pillPulse = true;
			setTimeout(() => (pillPulse = false), 260);
			if (!muted) setTimeout(playChime, 180);
		}
		saveProgress();
		view = 'list';
		if (browser) window.scrollTo({ top: 0 });
	}

	function onCorrect() {
		if (!muted) playTick();
	}
</script>

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

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	{#if !modul}
		<section class="missing">
			<p>Ce module n'existe pas (encore).</p>
			<a class="btn-primary" href="/aprene">Tornar als moduls</a>
		</section>
	{:else}
		<header class="lesson-top">
			{#if view === 'list'}
				<a class="close" href="/aprene" aria-label="Tornar als moduls">×</a>
			{:else}
				<button type="button" class="close" onclick={() => openSession('list')} aria-label="Tornar al somari">×</button>
			{/if}
			<a class="home-link" href="/" aria-label="Tornar a l'acuèlh">
				<HomeIcon size={21} />
			</a>
			<div class="spacer"></div>
			<div class="points-pill" class:pulse={pillPulse}>
				<FougasseIcon size={20} /> {points}
			</div>
			<button
				type="button"
				class="mute"
				onclick={() => (muted = !muted)}
				aria-label={muted ? 'Activar lo son' : 'Copar lo son'}
			>
				{@render speakerIcon(!muted)}
			</button>
		</header>

		{#if view === 'list'}
			<section class="modul-head">
				<p class="kicker">{modul.nivel} · {modul.unitat}</p>
				<h1 class="title">{modul.oc}</h1>
				<p class="subtitle"><em>({modul.fr})</em></p>
				<p class="cando">🎯 {modul.cando}</p>
				<p class="durada">{modul.durada}</p>
			</section>

			<div class="sessions">
				{#each modul.sessions as s, i}
					<button type="button" class="session-card" class:done={done[i]} onclick={() => openSession(i)}>
						<span class="session-num" aria-hidden="true">{done[i] ? '✓' : i + 1}</span>
						<span class="session-titles">
							<span class="session-title">{s.title}</span>
							<span class="session-min">{s.minutes} min</span>
						</span>
						<span class="session-go" aria-hidden="true">→</span>
					</button>
				{/each}
			</div>

			{#if allDone}
				<p class="all-done">
					Modul acabat, òsca ! <em>(module terminé, bravo !)</em>
				</p>
			{/if}

			<p class="draft-note">
				⚠️ Contenu en cours de validation linguistique (dicodòc / lo Congrès). L'audio arrive.
			</p>
		{:else}
			{@const s = modul.sessions[view]}
			<section class="session-head">
				<p class="kicker">{modul.oc} · Étape {view + 1}/{modul.sessions.length}</p>
				<h1 class="session-h">{s.title}</h1>
				<p class="session-min-line">~{s.minutes} min · à ton rythme</p>
			</section>

			{#key view}
				<div class="blocks">
					{#each s.blocks as block}
						{#if block.type === 'qcm'}
							<QcmBlock {block} {onCorrect} />
						{:else if block.type === 'reveal'}
							<RevealBlock {block} {onCorrect} />
						{:else if block.type === 'order'}
							<OrderBlock {block} {onCorrect} />
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
						{/if}
					{/each}

					<button type="button" class="btn-primary finish" onclick={() => finishSession(view)}>
						{done[view] ? 'Tornar al somari' : 'Acabada ✓'}
						<span class="finish-sub"><em>{done[view] ? '(retour au sommaire)' : '(étape terminée)'}</em></span>
					</button>
				</div>
			{/key}
		{/if}
	{/if}
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		max-width: 44rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.25rem 1.25rem 4rem;
	}

	.lesson-top {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.1rem;
		height: 2.1rem;
		border: none;
		border-radius: 50%;
		background: rgba(58, 42, 32, 0.07);
		color: var(--color-text);
		font-size: 1.3rem;
		line-height: 1;
		text-decoration: none;
		cursor: pointer;
	}

	.close:hover {
		background: rgba(58, 42, 32, 0.13);
	}

	.home-link {
		display: flex;
		width: 1.45rem;
		height: 1.45rem;
		flex-shrink: 0;
		color: var(--color-text);
		opacity: 0.85;
	}

	.spacer {
		flex: 1;
	}

	.points-pill {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background: rgba(224, 164, 59, 0.18);
		color: var(--color-brick);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		transition: transform 220ms ease;
	}

	.points-pill.pulse {
		transform: scale(1.18);
	}

	.mute {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.1rem;
		height: 2.1rem;
		border: none;
		border-radius: 50%;
		background: rgba(58, 42, 32, 0.07);
		color: var(--color-text);
		cursor: pointer;
	}

	.missing {
		text-align: center;
		padding-top: 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		align-items: center;
	}

	.modul-head,
	.session-head {
		text-align: center;
		animation: fade-in 450ms ease-out;
	}

	.kicker {
		margin: 0 0 0.15rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 2.6rem);
		font-weight: 700;
		color: var(--color-brick);
	}

	.subtitle {
		margin: 0.15rem 0 0;
		color: var(--color-teal);
		font-size: 0.95rem;
	}

	.cando {
		max-width: 34rem;
		margin: 0.9rem auto 0;
		line-height: 1.55;
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.durada {
		margin: 0.4rem 0 0;
		font-size: 0.82rem;
		color: rgba(58, 42, 32, 0.6);
	}

	.sessions {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		animation: fade-in 450ms ease-out;
	}

	.session-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: white;
		border: none;
		border-radius: 18px;
		padding: 1rem 1.25rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
		cursor: pointer;
		text-align: left;
		font: inherit;
		transition:
			transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 180ms ease;
	}

	.session-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 26px rgba(58, 42, 32, 0.16);
	}

	.session-card.done {
		opacity: 0.82;
	}

	.session-num {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		background: var(--color-gold);
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 700;
	}

	.session-card.done .session-num {
		background: rgba(107, 122, 58, 0.25);
		color: var(--color-olive, #6b7a3a);
	}

	.session-titles {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.session-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.02rem;
		color: var(--color-text);
	}

	.session-min {
		font-size: 0.8rem;
		color: var(--color-teal);
	}

	.session-go {
		color: var(--color-brick);
		font-size: 1.1rem;
	}

	.all-done {
		text-align: center;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		color: var(--color-brick);
		margin: 0;
	}

	.all-done em {
		display: block;
		font-family: inherit;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.draft-note {
		text-align: center;
		font-size: 0.8rem;
		color: rgba(58, 42, 32, 0.55);
		max-width: 30rem;
		margin: 0 auto;
		line-height: 1.5;
	}

	.session-h {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 4vw, 2rem);
		font-weight: 700;
		color: var(--color-brick);
	}

	.session-min-line {
		margin: 0.3rem 0 0;
		font-size: 0.85rem;
		color: rgba(58, 42, 32, 0.6);
	}

	.blocks {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		animation: fade-in 400ms ease-out;
	}

	.btn-primary {
		align-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		border: none;
		background: var(--color-brick);
		color: white;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.02rem;
		padding: 0.75rem 1.8rem;
		border-radius: 999px;
		cursor: pointer;
		text-decoration: none;
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 180ms ease;
		box-shadow: 0 8px 20px rgba(178, 84, 58, 0.35);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
	}

	.finish {
		margin-top: 0.6rem;
	}

	.finish-sub {
		font-size: 0.72rem;
		font-weight: 400;
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

	@media (prefers-reduced-motion: reduce) {
		.modul-head,
		.session-head,
		.sessions,
		.blocks {
			animation: none;
		}

		.session-card,
		.btn-primary,
		.points-pill {
			transition: none;
		}
	}
</style>
