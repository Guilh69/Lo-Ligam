<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Contenu validé par Romain (méthode-pedagogique.md) — Primièra leiçon, sans inscription.
	const groups = [
		{
			title: 'Bonjorn o al reveire ?',
			subtitle: '(Bonjour ou au revoir, les deux à la fois)',
			words: [
				{
					oc: 'Adieu',
					fr: 'bonjour ou au revoir, à une seule personne (tutoiement)',
					note: 'Adieu sert aussi bien à dire bonjour qu’au revoir — comme « ciao » en italien !'
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

	const distractorPool = ['a', 'e', 'i', 'o', 'u', 'n', 'r', 's', 't', 'l', 'c', 'm', 'g', 'p'];

	let requiredLetters = $state([]);
	let bank = $state([]);
	let filledCount = $state(0);

	// Appelée explicitement (jamais depuis un $effect réactif : ça est entré
	// en conflit avec l'hydratation de SvelteKit et cassait tous les clics
	// de la page — cause identifiée en isolant le bug pas à pas).
	function setupWord() {
		const word = flatWords[wordIndex];
		if (!word) return;
		requiredLetters = word.oc.replace(/[ -]/g, '').split('');
		const distractors = [];
		while (distractors.length < 3) {
			distractors.push(distractorPool[Math.floor(Math.random() * distractorPool.length)]);
		}
		bank = shuffle([...requiredLetters, ...distractors]).map((char, id) => ({
			char,
			used: false,
			wrong: false,
			id
		}));
		filledCount = 0;
		showNote = false;
	}

	onMount(() => {
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

	function tapBankTile(tile) {
		if (tile.used || wordComplete) return;
		const needed = requiredLetters[filledCount];
		if (tile.char.toLowerCase() === needed.toLowerCase()) {
			tile.used = true;
			bank = [...bank];
			filledCount += 1;
			if (filledCount === requiredLetters.length) playChime();
		} else {
			tile.wrong = true;
			bank = [...bank];
			setTimeout(() => {
				tile.wrong = false;
				bank = [...bank];
			}, 260);
		}
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
		} else {
			phase = 'reward';
			return;
		}
		setupWord();
	}
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<header class="lesson-top">
		<a class="close" href="/aprene" aria-label="Tampar">×</a>
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
		<button
			type="button"
			class="mute"
			onclick={() => (muted = !muted)}
			aria-label={muted ? 'Activar lo son' : 'Copar lo son'}
		>
			{muted ? '🔇' : '🔊'}
		</button>
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
						🔊
					</button>
				</div>

				<div class="slots">
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
							onclick={() => tapBankTile(tile)}
						>
							{tile.char}
						</button>
					{/each}
				</div>

				{#if wordComplete}
					<div class="reveal">
						<p class="word-fr">{current.fr}</p>
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
			<p class="hint">Tapa las letras dins l'òrdre per formar lo mot</p>
		{/if}
	{:else}
		<section class="reward">
			<p class="reward-title">Plan jogat !</p>
			<p class="reward-sub"><em>(Bien joué&nbsp;!)</em></p>
			<p class="reward-recap">
				Tu sabes ara dire : <strong>Adieu</strong>, <strong>Adieu-siatz</strong>,
				<strong>Bonjorn</strong>, <strong>Bon vèspre</strong>, <strong>Bona jornada</strong>,
				<strong>Bona vesprada</strong>, <strong>Bona nuèch</strong>.
			</p>
			<p class="reward-next">
				Crèa un compte per contunhar : exercicis, prononciacion, e ta bibliotèca de
				vocabulari se remplirà a mesura.
			</p>
			<a class="btn-primary" href="/aprene"
				>Crèa un compte per contunhar <span class="arrow">→</span></a
			>
			<a class="btn-secondary" href="/aprene">Tornar</a>
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

	.mute {
		border: none;
		background: transparent;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
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
		font-size: 1.1rem;
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

	.listen {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		background: rgba(31, 95, 99, 0.1);
		font-size: 1.15rem;
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

	.slots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
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

	.reveal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		animation: card-in 300ms ease;
	}

	.word-fr {
		margin: 0;
		color: var(--color-teal);
		font-size: 1.05rem;
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
		font-size: 2.4rem;
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
</style>
