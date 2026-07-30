<script>
	import { browser } from '$app/environment';

	// Contenu validé par Romain (méthode-pedagogique.md) — Primièra leiçon, sans inscription.
	const groups = [
		{
			title: 'Bonjorn o al reveire ?',
			subtitle: '(Bonjour ou au revoir, les deux à la fois)',
			words: [
				{
					oc: 'Adieu',
					pron: 'adiou',
					fr: 'bonjour ou au revoir, à une seule personne (tutoiement)',
					icon: 'door',
					note: 'Adieu sert aussi bien à dire bonjour qu’au revoir — comme « ciao » en italien !'
				},
				{
					oc: 'Adieu-siatz',
					pron: 'adioussiatz',
					fr: 'bonjour ou au revoir, à plusieurs personnes, ou en vouvoyant',
					icon: 'door',
					note: 'Littéralement « soyez à Dieu » ! Rien que ça.'
				}
			]
		},
		{
			title: 'En arribant',
			subtitle: '(En arrivant)',
			words: [
				{ oc: 'Bonjorn', pron: 'bounjour', fr: 'bonjour', icon: 'sun' },
				{ oc: 'Bon vèspre', fr: 'bonsoir, à l’arrivée', image: '/words/vespre.png' }
			]
		},
		{
			title: 'En partent',
			subtitle: '(En partant)',
			words: [
				{ oc: 'Bona jornada', fr: 'souhaiter un bon reste de journée', icon: 'sun' },
				{ oc: 'Bona vesprada', fr: 'souhaiter un bon reste d’après-midi ou de soirée', icon: 'moon' },
				{ oc: 'Bona nuèch', fr: 'bonne nuit, avant de dormir', image: '/words/nuech.png' }
			]
		}
	];

	const flatWords = groups.flatMap((g) => g.words.map((w) => ({ ...w, group: g })));

	let phase = $state('intro'); // 'intro' | 'discover' | 'reward'
	let wordIndex = $state(0);
	let revealed = $state([]);
	let showNote = $state(false);
	let muted = $state(false);

	let current = $derived(flatWords[wordIndex]);
	let letters = $derived(current ? current.oc.split('') : []);
	let allRevealed = $derived(revealed.length > 0 && revealed.every(Boolean));
	let isFirstOfGroup = $derived(
		wordIndex === 0 || flatWords[wordIndex - 1].group !== current.group
	);

	$effect(() => {
		if (current) {
			// Les espaces et tirets sont déjà visibles (pas de tuile cliquable
			// dessus) : on les marque révélés d'emblée, sinon le mot ne peut
			// jamais être détecté comme complet.
			revealed = current.oc.split('').map((ch) => ch === ' ' || ch === '-');
			showNote = false;
		}
	});

	function flipTile(i) {
		if (revealed[i]) return;
		revealed[i] = true;
		if (revealed.every(Boolean)) playChime();
	}

	function playChime() {
		if (muted || !browser) return;
		try {
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const now = ctx.currentTime;
			[523.25, 659.25, 783.99].forEach((freq, i) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.frequency.value = freq;
				osc.type = 'sine';
				gain.gain.setValueAtTime(0.0001, now + i * 0.09);
				gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.09 + 0.02);
				gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.3);
				osc.connect(gain).connect(ctx.destination);
				osc.start(now + i * 0.09);
				osc.stop(now + i * 0.09 + 0.32);
			});
		} catch (e) {
			/* Web Audio indisponible : on continue sans son, jamais bloquant. */
		}
	}

	function startDiscovery() {
		phase = 'discover';
	}

	function next() {
		if (wordIndex < flatWords.length - 1) {
			wordIndex += 1;
		} else {
			phase = 'reward';
		}
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

	{#if phase === 'intro'}
		<section class="intro">
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
			<p class="intro-detail">
				En occitan, pour saluer une personne de manière familière (tutoiement), on dit
				<strong>« Adieu »</strong> (prononcé <em>adiou</em>). Pour saluer plusieurs personnes, ou
				vouvoyer, on dit <strong>« Adieu-siatz »</strong> (<em>adioussiatz</em>), littéralement
				« soyez à Dieu ». Et ce qui est bien pratique : les deux marchent aussi bien pour dire
				bonjour <strong>que</strong> pour dire au revoir !
			</p>
			<button type="button" class="btn-primary" onclick={startDiscovery}>
				Descobrir <span class="arrow">→</span>
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
				<div class="visual">
					{#if current.image}
						<img src={current.image} alt="" class="word-image" />
					{:else if current.icon === 'sun'}
						<svg viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
							<circle cx="50" cy="50" r="20" fill="var(--color-gold)" />
							{#each Array(8) as _, i}
								<line
									x1="50"
									y1="10"
									x2="50"
									y2="22"
									stroke="var(--color-gold)"
									stroke-width="5"
									stroke-linecap="round"
									transform="rotate({i * 45} 50 50)"
								/>
							{/each}
						</svg>
					{:else if current.icon === 'moon'}
						<svg viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
							<path
								d="M62,18 A32,32 0 1,0 62,82 A25,25 0 1,1 62,18 Z"
								fill="var(--color-teal)"
							/>
							<circle cx="80" cy="28" r="3.5" fill="var(--color-gold)" />
							<circle cx="88" cy="46" r="2.5" fill="var(--color-gold)" />
						</svg>
					{:else}
						<svg viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
							<path d="M28,92 L28,48 A22,22 0 0,1 72,48 L72,92 Z" fill="var(--color-brick)" />
							<circle cx="62" cy="70" r="3.5" fill="var(--color-cream)" />
						</svg>
					{/if}
				</div>

				<div class="tiles" style="perspective: 600px;">
					{#each letters as letter, i}
						{#if letter === ' ' || letter === '-'}
							<span class="tile-gap">{letter === '-' ? '-' : ''}</span>
						{:else}
							<button
								type="button"
								class="tile"
								class:revealed={revealed[i]}
								disabled={revealed[i]}
								onclick={() => flipTile(i)}
								aria-label={revealed[i] ? letter : 'Descobrir la letra'}
							>
								{#if revealed[i]}
									{letter}
								{/if}
							</button>
						{/if}
					{/each}
				</div>

				{#if allRevealed}
					<div class="reveal">
						<p class="word-fr">{current.fr}</p>
						{#if current.note}
							<button
								type="button"
								class="fact-toggle"
								onclick={() => (showNote = !showNote)}
							>
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

		{#if allRevealed}
			<button type="button" class="btn-primary" onclick={next}>
				{wordIndex < flatWords.length - 1 ? 'Segon' : 'Acabar'} <span class="arrow">→</span>
			</button>
		{:else}
			<p class="hint">Tapa las tèulas per descobrir lo mot</p>
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
			<a class="btn-primary" href="/aprene">Crèa un compte per contunhar <span class="arrow">→</span></a>
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

	.intro {
		max-width: 32rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.intro-kicker {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.intro-text {
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
		line-height: 1.4;
	}

	.intro-text-fr {
		margin: 0;
		color: var(--color-teal);
		font-size: 0.95rem;
	}

	.intro-detail {
		margin: 0.5rem 0 0.75rem;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--color-text);
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
		padding: 2rem 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.12);
		min-width: 18rem;
		max-width: 24rem;
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.visual {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.word-image {
		width: 84px;
		height: 84px;
		object-fit: cover;
		border-radius: 16px;
	}

	.tiles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
	}

	.tile {
		width: 2.3rem;
		height: 2.7rem;
		background: var(--color-terracotta);
		border-radius: 10px;
		border: none;
		color: white;
		font-family: var(--font-heading);
		font-size: 1.3rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 150ms ease,
			background-color 200ms ease;
	}

	.tile:hover:not(.revealed) {
		transform: translateY(-2px);
	}

	.tile.revealed {
		background: var(--color-cream);
		color: var(--color-text);
		box-shadow: 0 4px 10px rgba(58, 42, 32, 0.15);
		cursor: default;
		animation: tile-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.tile-gap {
		width: 0.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text);
		font-weight: 700;
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
	}

	.reward-next {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		color: var(--color-teal);
		max-width: 24rem;
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
</style>
