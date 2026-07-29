<script>
	const words = [
		{ oc: 'Bonjorn', fr: 'bonjour', icon: 'sun' },
		{ oc: 'Bon vèspre', fr: 'bonsoir', icon: 'moon' },
		{ oc: 'Al reveire', fr: 'au revoir', icon: 'door' }
	];

	let step = $state(0);
	let done = $derived(step >= words.length);
	let current = $derived(words[step]);

	function next() {
		step += 1;
	}
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<header class="lesson-top">
		<a class="close" href="/aprene" aria-label="Tampar">×</a>
		<div class="progress" role="progressbar" aria-valuenow={Math.min(step, words.length)} aria-valuemin="0" aria-valuemax={words.length}>
			{#each words as _, i}
				<span class="dot" class:done={i < step} class:active={i === step}></span>
			{/each}
		</div>
	</header>

	{#if !done}
		{#key step}
			<section class="card">
				<div class="icon">
					{#if current.icon === 'sun'}
						<svg viewBox="0 0 100 100" width="76" height="76" aria-hidden="true">
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
						<svg viewBox="0 0 100 100" width="76" height="76" aria-hidden="true">
							<path
								d="M62,18 A32,32 0 1,0 62,82 A25,25 0 1,1 62,18 Z"
								fill="var(--color-teal)"
							/>
							<circle cx="80" cy="28" r="3.5" fill="var(--color-gold)" />
							<circle cx="88" cy="46" r="2.5" fill="var(--color-gold)" />
						</svg>
					{:else}
						<svg viewBox="0 0 100 100" width="76" height="76" aria-hidden="true">
							<path
								d="M28,92 L28,48 A22,22 0 0,1 72,48 L72,92 Z"
								fill="var(--color-brick)"
							/>
							<circle cx="62" cy="70" r="3.5" fill="var(--color-cream)" />
						</svg>
					{/if}
				</div>
				<p class="word-oc">{current.oc}</p>
				<p class="word-fr"><em>({current.fr})</em></p>
			</section>
		{/key}

		<button type="button" class="btn-primary" onclick={next}>
			{step < words.length - 1 ? 'Segon' : 'Acabar'} <span class="arrow">→</span>
		</button>
	{:else}
		<section class="reward">
			<p class="reward-title">Plan jogat !</p>
			<p class="reward-sub"><em>(Bien joué&nbsp;!)</em></p>
			<p class="reward-recap">
				Tu sabes ara dire : <strong>Bonjorn</strong>, <strong>Bon vèspre</strong>,
				<strong>Al reveire</strong>.
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
		gap: 1.75rem;
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

	.card {
		background: white;
		border-radius: 28px;
		padding: 2.5rem 2.5rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.12);
		min-width: 16rem;
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.icon {
		margin-bottom: 0.5rem;
	}

	.word-oc {
		font-family: var(--font-heading);
		font-size: 2.2rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.word-fr {
		margin: 0;
		color: var(--color-teal);
		font-size: 1.1rem;
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
		margin: 0 0 1rem;
		font-size: 1.05rem;
		color: var(--color-text);
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
</style>
