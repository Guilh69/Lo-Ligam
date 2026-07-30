<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import HomeIcon from '$lib/components/HomeIcon.svelte';
	import FougasseIcon from '$lib/components/FougasseIcon.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';

	const MODULE_ID = 'module-1';

	// Contenu validé par Romain (méthode-pedagogique.md) — Primièra leiçon, sans inscription.
	const groups = [
		{
			title: 'Bonjorn o al reveire ?',
			subtitle: '(Bonjour ou au revoir, les deux à la fois)',
			words: [
				{
					oc: 'Adieu',
					fr: 'bonjour ou au revoir, à une seule personne (tutoiement)',
					note: 'Adieu sert aussi bien à dire bonjour qu’au revoir — comme « ciao » en italien !',
					img: '/words/adieu.jpg'
				},
				{
					oc: 'Adieu-siatz',
					fr: 'bonjour ou au revoir, à plusieurs personnes, ou en vouvoyant',
					note: 'Littéralement « soyez à Dieu » ! Rien que ça.'
				}
			]
		},
		{
			title: 'En arribant',
			subtitle: '(En arrivant)',
			words: [
				{ oc: 'Bonjorn', fr: 'bonjour' },
				{ oc: 'Bon vèspre', fr: 'bonsoir, à l’arrivée' }
			]
		},
		{
			title: 'En partent',
			subtitle: '(En partant)',
			words: [
				{ oc: 'Bona jornada', fr: 'souhaiter un bon reste de journée' },
				{ oc: 'Bona vesprada', fr: 'souhaiter un bon reste d’après-midi ou de soirée' },
				{ oc: 'Bona nuèch', fr: 'bonne nuit, avant de dormir' }
			]
		}
	];

	const flatWords = groups.flatMap((g) => g.words.map((w) => ({ ...w, group: g })));

	let phase = $state('context'); // 'context' | 'detail' | 'discover' | 'reward'
	let wordIndex = $state(0);
	let showNote = $state(false);
	let muted = $state(false);

	let current = $derived(flatWords[wordIndex]);
	let isFirstOfGroup = $derived(
		wordIndex === 0 || flatWords[wordIndex - 1].group !== current.group
	);

	function shuffle(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// Pas de lettres pièges à ce stade (retiré à la demande de Romain : trop
	// dur pour un néophyte). Prévu comme mode « difficile » optionnel plus tard.
	let requiredLetters = $state([]);
	let bank = $state([]);
	let filledCount = $state(0);
	let helpsUsedThisWord = $state(0);
	let slotShake = $state(false);
	let lastHelpTap = 0;

	let points = $state(0);
	let lastEarned = $state(0);
	let showEarnedPop = $state(false);
	let resumed = $state(false);

	const STORAGE_KEY = 'lo-ligam-essai-progress';

	// Connecté : la progression vit dans Supabase (table lesson_progress).
	// Anonyme (essai sans compte) : elle reste dans le navigateur seulement.
	async function saveProgress(completed = false) {
		const currentSession = get(session);
		if (currentSession) {
			try {
				await supabase.from('lesson_progress').upsert({
					user_id: currentSession.user.id,
					module_id: MODULE_ID,
					word_index: wordIndex,
					points,
					updated_at: new Date().toISOString(),
					...(completed ? { completed_at: new Date().toISOString() } : {})
				});
			} catch (e) {
				/* échec réseau : pas bloquant, la partie continue localement */
			}
			return;
		}
		if (!browser) return;
		try {
			if (completed) {
				localStorage.removeItem(STORAGE_KEY);
				localStorage.setItem('lo-ligam-module-1-done', 'true');
			} else {
				localStorage.setItem(STORAGE_KEY, JSON.stringify({ wordIndex, points }));
			}
		} catch (e) {
			/* stockage indisponible (navigation privée…) : pas bloquant */
		}
	}

	// Appelée explicitement (jamais depuis un $effect réactif : ça est entré
	// en conflit avec l'hydratation de SvelteKit et cassait tous les clics
	// de la page — cause identifiée en isolant le bug pas à pas).
	function setupWord() {
		const word = flatWords[wordIndex];
		if (!word) return;
		requiredLetters = word.oc.replace(/[ -]/g, '').split('');
		bank = shuffle(requiredLetters).map((char, id) => ({
			char,
			used: false,
			wrong: false,
			id
		}));
		filledCount = 0;
		helpsUsedThisWord = 0;
		showNote = false;
	}

	function applyResumedProgress(savedWordIndex, savedPoints) {
		if (savedWordIndex > 0 && savedWordIndex < flatWords.length) {
			wordIndex = savedWordIndex;
			points = savedPoints ?? 0;
			phase = 'discover';
			resumed = true;
			setTimeout(() => (resumed = false), 3200);
		} else {
			points = savedPoints ?? 0;
		}
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
		if (browser) await waitForAuthReady();
		const currentSession = get(session);
		if (currentSession) {
			try {
				const { data } = await supabase
					.from('lesson_progress')
					.select('word_index, points, completed_at')
					.eq('module_id', MODULE_ID)
					.maybeSingle();
				if (data && !data.completed_at) applyResumedProgress(data.word_index, data.points);
			} catch (e) {
				/* échec réseau : on repart simplement du début */
			}
		} else if (browser) {
			try {
				const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
				if (saved) applyResumedProgress(saved.wordIndex, saved.points);
			} catch (e) {
				/* stockage indisponible : on repart simplement du début */
			}
		}
		setupWord();
	});

	let wordComplete = $derived(requiredLetters.length > 0 && filledCount >= requiredLetters.length);

	let displayChars = $derived.by(() => {
		if (!current) return [];
		let letterIdx = 0;
		return current.oc.split('').map((ch) => {
			if (ch === ' ' || ch === '-') return { ch, isLetter: false };
			const idx = letterIdx;
			letterIdx += 1;
			return { ch, isLetter: true, filled: idx < filledCount };
		});
	});

	function attemptTile(tile) {
		if (tile.used || wordComplete) return;
		const needed = requiredLetters[filledCount];
		if (tile.char.toLowerCase() === needed.toLowerCase()) {
			tile.used = true;
			bank = [...bank];
			filledCount += 1;
			if (filledCount === requiredLetters.length) completeWord();
		} else {
			tile.wrong = true;
			bank = [...bank];
			setTimeout(() => {
				tile.wrong = false;
				bank = [...bank];
			}, 260);
		}
	}

	// Tape au clavier : cherche d'abord une tuile qui correspond à la lettre
	// attendue (accepte), sinon une tuile qui porte ce caractère ailleurs
	// dans le mot (secoue, comme un tap à la souris), sinon secoue la carte
	// entière (la lettre tapée n'appartient pas au mot).
	function attemptChar(ch) {
		const needed = requiredLetters[filledCount]?.toLowerCase();
		let tile = bank.find((t) => !t.used && t.char.toLowerCase() === ch && ch === needed);
		if (!tile) tile = bank.find((t) => !t.used && t.char.toLowerCase() === ch);
		if (tile) {
			attemptTile(tile);
		} else {
			slotShake = true;
			setTimeout(() => (slotShake = false), 260);
		}
	}

	function handleKeydown(e) {
		if (phase !== 'discover' || wordComplete) return;
		if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
		attemptChar(e.key.toLowerCase());
	}

	function revealNextLetter() {
		if (filledCount >= requiredLetters.length) return;
		const needed = requiredLetters[filledCount].toLowerCase();
		const tile = bank.find((t) => !t.used && t.char.toLowerCase() === needed);
		if (tile) {
			tile.used = true;
			bank = [...bank];
			filledCount += 1;
			helpsUsedThisWord += 1;
		}
		if (filledCount === requiredLetters.length) completeWord();
	}

	// Un tap : révèle une seule lettre. Deux taps rapprochés : complète tout
	// le mot d'un coup (repéré par l'écart de temps entre deux appels).
	function useHelp() {
		if (wordComplete) return;
		const now = Date.now();
		const isDouble = now - lastHelpTap < 420;
		lastHelpTap = now;
		if (isDouble) {
			while (filledCount < requiredLetters.length) revealNextLetter();
		} else {
			revealNextLetter();
		}
	}

	function completeWord() {
		const earned = Math.max(2, 10 - helpsUsedThisWord * 3);
		points += earned;
		lastEarned = earned;
		showEarnedPop = true;
		setTimeout(() => (showEarnedPop = false), 900);
		playChime();
		saveProgress();
	}

	function playChime() {
		if (muted || !browser) return;
		try {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const now = ctx.currentTime;
			[783.99, 1046.5].forEach((freq, i) => {
				const t0 = now + i * 0.11;
				const osc = ctx.createOscillator();
				osc.type = 'triangle';
				osc.frequency.value = freq;
				const filter = ctx.createBiquadFilter();
				filter.type = 'lowpass';
				filter.frequency.value = 3200;
				const gain = ctx.createGain();
				gain.gain.setValueAtTime(0.0001, t0);
				gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.015);
				gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
				osc.connect(filter).connect(gain).connect(ctx.destination);
				osc.start(t0);
				osc.stop(t0 + 0.52);
			});
		} catch (e) {
			/* Web Audio indisponible : on continue sans son, jamais bloquant. */
		}
	}

	function playWordSound() {
		// Emplacement réservé pour la vraie prononciation occitane (Votz /
		// API lo Congrès), pas encore intégrée. Ne joue rien pour l'instant.
	}

	function next() {
		if (wordIndex < flatWords.length - 1) {
			wordIndex += 1;
			setupWord();
			saveProgress();
		} else {
			phase = 'reward';
			saveProgress(true);
		}
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

<svelte:window onkeydown={handleKeydown} />

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<header class="lesson-top">
		<a class="close" href="/aprene" aria-label="Tornar als moduls">×</a>
		<a class="home-link" href="/" aria-label="Tornar a l'acuèlh">
			<HomeIcon size={21} />
		</a>
		{#if phase === 'discover'}
			<div
				class="progress"
				role="progressbar"
				aria-valuenow={wordIndex}
				aria-valuemin="0"
				aria-valuemax={flatWords.length}
			>
				{#each flatWords as _, i}
					<span class="dot" class:done={i < wordIndex} class:active={i === wordIndex}></span>
				{/each}
			</div>
		{:else}
			<div class="progress"></div>
		{/if}
		<div class="header-right">
			{#if resumed}
				<span class="resumed-toast">Represa ont aviás quitat ↺ <em>(reprise où tu avais arrêté)</em></span>
			{/if}
			<div class="points-pill">
				<FougasseIcon size={20} /> {points}
				{#if showEarnedPop}<span class="earned-pop">+{lastEarned}</span>{/if}
			</div>
			<button
				type="button"
				class="mute"
				onclick={() => (muted = !muted)}
				aria-label={muted ? 'Activar lo son' : 'Copar lo son'}
			>
				{@render speakerIcon(!muted)}
			</button>
		</div>
	</header>

	{#if phase === 'context'}
		<section class="intro-card">
			<p class="intro-kicker">Primièra leiçon · sens inscripcion</p>
			<p class="intro-text">
				Comencèm per la ont tot comença : quand rejonhes qualqu'un, o que vòles dire al
				reveire. Coma dins fòrça lengas, la forma càmbia segon lo moment de la jornada, la
				proximitat amb la persona, e lo nombre de personas.
			</p>
			<p class="intro-text-fr">
				<em
					>(Commençons par là où tout commence&nbsp;: quand tu rejoins quelqu'un, ou que tu
					souhaites dire au revoir. Comme dans de nombreuses langues, la forme change selon le
					moment de la journée, la proximité avec la personne, et le nombre de personnes.)</em
				>
			</p>
			<button type="button" class="btn-primary" onclick={() => (phase = 'detail')}>
				Contunhar <span class="arrow">→</span>
			</button>
		</section>
	{:else if phase === 'detail'}
		<section class="intro-card">
			<p class="intro-kicker">Pichon contèxte</p>
			<p class="intro-detail">
				En occitan, pour saluer une personne de manière familière (tutoiement), on dit
				<strong>« Adieu »</strong> (prononcé <em>adiou</em>). Pour saluer plusieurs personnes,
				ou vouvoyer, on dit <strong>« Adieu-siatz »</strong> (<em>adioussiatz</em>),
				littéralement « soyez à Dieu ». Et ce qui est bien pratique : les deux marchent aussi
				bien pour dire bonjour <strong>que</strong> pour dire au revoir !
			</p>
			<button type="button" class="btn-primary" onclick={() => (phase = 'discover')}>
				Descobrir los mots <span class="arrow">→</span>
			</button>
		</section>
	{:else if phase === 'discover'}
		{#if isFirstOfGroup}
			<div class="group-label">
				<p class="group-title">{current.group.title}</p>
				<p class="group-subtitle"><em>{current.group.subtitle}</em></p>
			</div>
		{/if}

		{#key wordIndex}
			<section class="card">
				<div class="visual-row">
					{#if current.img}
						<div class="visual-photo">
							<img src={current.img} alt="" />
							<button
								type="button"
								class="listen listen-overlay"
								onclick={playWordSound}
								aria-label="Escotar (a venir)"
							>
								{@render speakerIcon(true)}
							</button>
						</div>
					{:else}
						<div class="visual-placeholder" aria-hidden="true">
							<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--color-teal)" stroke-width="1.6">
								<rect x="3" y="3" width="18" height="18" rx="3" />
								<circle cx="8.5" cy="8.5" r="1.4" />
								<path d="M21 15l-5-5L5 21" />
							</svg>
						</div>
						<button
							type="button"
							class="listen"
							onclick={playWordSound}
							aria-label="Escotar (a venir)"
						>
							{@render speakerIcon(true)}
						</button>
					{/if}
				</div>

				<p class="target-fr">{current.fr}</p>

				<div class="slots" class:shake={slotShake}>
					{#each displayChars as c}
						{#if c.isLetter}
							<span class="slot" class:filled={c.filled}>{c.filled ? c.ch : ''}</span>
						{:else}
							<span class="slot-gap">{c.ch === '-' ? '-' : ''}</span>
						{/if}
					{/each}
				</div>

				<div class="bank">
					{#each bank as tile (tile.id)}
						<button
							type="button"
							class="bank-tile"
							class:used={tile.used}
							class:wrong={tile.wrong}
							disabled={tile.used}
							onclick={() => attemptTile(tile)}
						>
							{tile.char}
						</button>
					{/each}
				</div>

				{#if !wordComplete}
					<div class="help-block">
						<button
							type="button"
							class="help-btn"
							onclick={useHelp}
							title="Un tap : una letra. Dos taps : lo mot entièr."
						>
							Ajuda ?
						</button>
						<p class="help-hint"><em>(un tap : une lettre — deux taps : le mot entier)</em></p>
					</div>
				{/if}

				{#if wordComplete}
					<div class="reveal">
						{#if current.note}
							<button type="button" class="fact-toggle" onclick={() => (showNote = !showNote)}>
								💡 Sabètz ? <em>(Le saviez-vous&nbsp;?)</em>
							</button>
							{#if showNote}
								<p class="fact">{current.note}</p>
							{/if}
						{/if}
					</div>
				{/if}
			</section>
		{/key}

		{#if wordComplete}
			<button type="button" class="btn-primary" onclick={next}>
				{wordIndex < flatWords.length - 1 ? 'Segon' : 'Acabar'} <span class="arrow">→</span>
			</button>
		{:else}
			<p class="hint">Tapa las letras dins l'òrdre, o pica-las al clavièr</p>
		{/if}
	{:else}
		<section class="reward">
			<p class="reward-title">Plan jogat !</p>
			<p class="reward-sub"><em>(Bien joué&nbsp;!)</em></p>
			<p class="reward-recap">
				Ara, sabes dire : <strong>Adieu</strong>, <strong>Adieu-siatz</strong>,
				<strong>Bonjorn</strong>, <strong>Bon vèspre</strong>, <strong>Bona jornada</strong>,
				<strong>Bona vesprada</strong>, <strong>Bona nuèch</strong>.
			</p>
			<p class="reward-points">
				<FougasseIcon size={26} /> {points} fogassas ganhadas <em>(fougasses gagnées)</em>
			</p>
			<p class="reward-next">
				Crèa un compte per contunhar : exercicis, prononciacion, e ta bibliotèca de
				vocabulari s'emplenarà a mesura.
			</p>
			<a class="btn-primary" href="/compte?mode=signup"
				>Crèa un compte per contunhar <span class="arrow">→</span></a
			>
			<a class="btn-secondary" href="/">Tornar a l'acuèlh</a>
		</section>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		padding: 1.5rem;
		text-align: center;
	}

	.lesson-top {
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		right: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.close {
		font-size: 1.5rem;
		line-height: 1;
		color: var(--color-text);
		text-decoration: none;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		transition: background-color 150ms ease;
	}

	.close:hover {
		background: rgba(58, 42, 32, 0.08);
	}

	.home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 999px;
		color: var(--color-brick);
		background: rgba(165, 52, 42, 0.1);
		transition: background-color 150ms ease;
	}

	.home-link:hover {
		background: rgba(165, 52, 42, 0.2);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		position: relative;
	}

	.resumed-toast {
		position: absolute;
		right: 0;
		top: calc(100% + 0.5rem);
		white-space: nowrap;
		background: white;
		color: var(--color-teal);
		font-size: 0.78rem;
		font-weight: 600;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		box-shadow: 0 6px 16px rgba(58, 42, 32, 0.15);
		animation:
			card-in 250ms ease,
			toast-out 250ms ease 2950ms forwards;
	}

	.resumed-toast em {
		font-weight: 400;
		opacity: 0.75;
	}

	.points-pill {
		position: relative;
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
	}

	.earned-pop {
		position: absolute;
		left: 50%;
		top: -0.4rem;
		transform: translateX(-50%);
		color: var(--color-olive);
		font-weight: 700;
		font-size: 0.85rem;
		animation: points-float 900ms ease forwards;
		pointer-events: none;
	}

	.mute {
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: var(--color-text);
		cursor: pointer;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 999px;
		transition: background-color 150ms ease;
	}

	.mute:hover {
		background: rgba(58, 42, 32, 0.08);
	}

	.progress {
		display: flex;
		gap: 0.5rem;
		flex: 1;
		justify-content: center;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: rgba(58, 42, 32, 0.15);
		transition:
			background-color 200ms ease,
			transform 200ms ease;
	}

	.dot.done {
		background: var(--color-olive);
	}

	.dot.active {
		background: var(--color-terracotta);
		transform: scale(1.3);
	}

	.intro-card {
		background: white;
		border-radius: 24px;
		padding: 2rem 2.25rem;
		max-width: 30rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.1);
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
		text-align: left;
	}

	.intro-kicker {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-teal);
		text-align: center;
	}

	.intro-text {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		line-height: 1.45;
		text-align: justify;
	}

	.intro-text-fr {
		margin: 0;
		color: var(--color-teal);
		font-size: 0.95rem;
		text-align: justify;
	}

	.intro-detail {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text);
		text-align: justify;
	}

	.intro-card .btn-primary {
		align-self: center;
		margin-top: 0.25rem;
	}

	.group-label {
		margin-bottom: -0.25rem;
	}

	.group-title {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.35rem;
		color: var(--color-brick);
	}

	.group-subtitle {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.card {
		background: white;
		border-radius: 28px;
		padding: 2.25rem 2.25rem 1.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.12);
		min-width: 20rem;
		max-width: 26rem;
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.visual-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.visual-placeholder {
		width: 64px;
		height: 64px;
		aspect-ratio: 1 / 1;
		border-radius: 16px;
		background: linear-gradient(155deg, rgba(224, 164, 59, 0.18), rgba(31, 95, 99, 0.12));
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.visual-photo {
		position: relative;
		width: 132px;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 10px 24px rgba(58, 42, 32, 0.2);
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.visual-photo img {
		display: block;
		width: 100%;
		height: auto;
	}

	.listen-overlay {
		position: absolute;
		right: 0.4rem;
		bottom: 0.4rem;
		width: 38px;
		height: 38px;
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 4px 10px rgba(58, 42, 32, 0.3);
	}

	.listen-overlay:hover {
		background: white;
	}

	.listen {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: rgba(31, 95, 99, 0.1);
		color: var(--color-teal);
		cursor: pointer;
		transition:
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1),
			background-color 150ms ease;
	}

	.listen:hover {
		background: rgba(31, 95, 99, 0.18);
	}

	.listen:active {
		transform: scale(0.9);
	}

	.target-fr {
		margin: -0.5rem 0 0;
		color: var(--color-teal);
		font-size: 1.05rem;
		text-align: center;
	}

	.slots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
	}

	.slots.shake {
		animation: shake 250ms ease;
	}

	.slot {
		width: 2.4rem;
		height: 2.8rem;
		border-radius: 10px;
		border: 2px dashed rgba(58, 42, 32, 0.2);
		color: var(--color-text);
		font-family: var(--font-heading);
		font-size: 1.35rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slot.filled {
		border: none;
		background: var(--color-cream);
		box-shadow: 0 4px 10px rgba(58, 42, 32, 0.15);
		animation: tile-pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.slot-gap {
		width: 0.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
		font-weight: 700;
	}

	.bank {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(58, 42, 32, 0.08);
		width: 100%;
	}

	.bank-tile {
		width: 2.1rem;
		height: 2.5rem;
		background: var(--color-terracotta);
		border-radius: 9px;
		border: none;
		color: white;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 150ms ease,
			background-color 150ms ease,
			opacity 200ms ease;
	}

	.bank-tile:hover:not(.used) {
		transform: translateY(-2px);
	}

	.bank-tile.used {
		opacity: 0.25;
		cursor: default;
		transform: scale(0.9);
	}

	.bank-tile.wrong {
		background: var(--color-brick);
		animation: shake 250ms ease;
	}

	.help-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
	}

	.help-btn {
		border: none;
		background: rgba(31, 95, 99, 0.12);
		color: var(--color-teal);
		font-weight: 600;
		font-size: 0.88rem;
		padding: 0.4rem 1rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			transform 150ms ease;
	}

	.help-btn:hover {
		background: rgba(31, 95, 99, 0.2);
	}

	.help-btn:active {
		transform: scale(0.95);
	}

	.help-hint {
		margin: 0;
		font-size: 0.75rem;
		color: rgba(58, 42, 32, 0.55);
	}

	.reveal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		animation: card-in 300ms ease;
	}

	.fact-toggle {
		border: none;
		background: rgba(224, 164, 59, 0.18);
		color: var(--color-brick);
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		cursor: pointer;
		transition: background-color 150ms ease;
	}

	.fact-toggle:hover {
		background: rgba(224, 164, 59, 0.3);
	}

	.fact {
		margin: 0;
		max-width: 20rem;
		font-size: 0.9rem;
		color: var(--color-text);
		text-align: justify;
		animation: card-in 250ms ease;
	}

	.hint {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.reward {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		max-width: 28rem;
		animation: card-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.reward-title {
		font-family: var(--font-heading);
		font-size: clamp(2.6rem, 6vw, 3.2rem);
		font-weight: 700;
		color: var(--color-brick);
		margin: 0;
	}

	.reward-sub {
		margin: 0 0 0.5rem;
		color: var(--color-teal);
		font-size: 1.05rem;
	}

	.reward-recap {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
		color: var(--color-text);
		text-align: justify;
	}

	.reward-points {
		margin: 0 0 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		font-family: var(--font-heading);
		font-weight: 700;
		color: var(--color-brick);
		font-size: 1.15rem;
	}

	.reward-points em {
		font-weight: 400;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.reward-next {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		color: var(--color-teal);
		max-width: 24rem;
		text-align: justify;
	}

	.btn-primary {
		display: inline-block;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 1rem 1.75rem;
		border-radius: 999px;
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(224, 164, 59, 0.45);
	}

	.btn-primary .arrow {
		display: inline-block;
		transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.btn-primary:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 10px 24px rgba(224, 164, 59, 0.55);
	}

	.btn-primary:hover .arrow {
		transform: translateX(4px);
	}

	.btn-primary:active {
		transform: translateY(0) scale(0.96);
		filter: brightness(0.95);
		transition-duration: 70ms;
	}

	.btn-secondary {
		display: inline-block;
		background: transparent;
		color: var(--color-teal);
		border: none;
		padding: 0.5rem;
		font-weight: 500;
		text-decoration: underline;
		cursor: pointer;
	}

	.btn-secondary:hover {
		color: var(--color-brick);
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes tile-pop {
		from {
			transform: scale(0.7) rotateX(90deg);
		}
		to {
			transform: scale(1) rotateX(0);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	@keyframes points-float {
		from {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
		to {
			opacity: 0;
			transform: translateX(-50%) translateY(-18px);
		}
	}

	@keyframes toast-out {
		to {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
</style>
