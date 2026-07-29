<script>
	import logo from '$lib/assets/logo.png';

	let lang = $state('oc');
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
	<span class="blob blob-brick"></span>
</div>

<svg class="landscape" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
	<path
		d="M0,120 C240,180 480,60 720,100 C960,140 1200,40 1440,90 L1440,220 L0,220 Z"
		fill="var(--color-brick)"
		opacity="0.5"
	/>
	<path
		d="M0,160 C240,200 480,120 720,150 C960,180 1200,110 1440,140 L1440,220 L0,220 Z"
		fill="var(--color-terracotta)"
	/>
</svg>

<main class="screen">
	<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
		<button type="button" class:active={lang === 'oc'} onclick={() => (lang = 'oc')}>Òc</button>
		<button type="button" class:active={lang === 'fr'} onclick={() => (lang = 'fr')}>Fr</button>
	</div>

	<div class="brand-card">
		<img src={logo} alt="Lo Ligam" />
	</div>

	<p class="kicker">Occitan · Lengadocian · Nivèl A1</p>

	<div class="welcome">
		<p class="tagline-oc">Benvenguda ! Aprèn l'occitan, teisse lo ligam amb sa cultura.</p>
		<p class="tagline-fr">
			<em>(Bienvenue&nbsp;! Apprends l'occitan, tisse le lien avec sa culture.)</em>
		</p>
	</div>

	<div class="actions">
		<a class="btn-primary" href="/aprene/essai">Començar <span class="arrow">→</span></a>
		<button type="button" class="btn-secondary">Ai ja un compte</button>
	</div>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -2;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 420px;
		height: 420px;
		background: var(--color-gold);
		opacity: 0.35;
		top: -140px;
		left: -120px;
	}

	.blob-teal {
		width: 380px;
		height: 380px;
		background: var(--color-teal);
		opacity: 0.2;
		bottom: -100px;
		right: -100px;
	}

	.blob-brick {
		width: 300px;
		height: 300px;
		background: var(--color-brick);
		opacity: 0.15;
		top: 25%;
		right: 8%;
	}

	.landscape {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 180px;
		z-index: -1;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		padding: 2rem 1.5rem 12rem;
		text-align: center;
		animation: fade-in 600ms ease-out;
	}

	.lang-toggle {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		display: flex;
		gap: 0.35rem;
		background: white;
		padding: 0.3rem;
		border-radius: 999px;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.12);
	}

	.lang-toggle button {
		border: none;
		background: transparent;
		color: var(--color-text);
		font-weight: 600;
		font-size: 0.85rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lang-toggle button:hover {
		transform: scale(1.08);
	}

	.lang-toggle button:active {
		transform: scale(0.95);
	}

	.lang-toggle button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.brand-card {
		width: 260px;
		height: 260px;
		border-radius: 32px;
		overflow: hidden;
		box-shadow: 0 16px 36px rgba(165, 52, 42, 0.3);
	}

	.brand-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.kicker {
		margin: 0.25rem 0 0;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.welcome {
		max-width: 34rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin-top: 0.25rem;
	}

	.tagline-oc {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
		color: var(--color-text);
		line-height: 1.25;
	}

	.tagline-fr {
		margin: 0;
		font-size: 1.05rem;
		color: var(--color-teal);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 20rem;
		margin-top: 0.5rem;
	}

	button {
		font-size: 1.1rem;
		font-family: var(--font-heading);
	}

	.btn-primary {
		display: inline-block;
		font-size: 1.1rem;
		font-family: var(--font-heading);
		text-decoration: none;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 1rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
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
		background: transparent;
		color: var(--color-teal);
		border: none;
		padding: 0.5rem;
		font-weight: 500;
		text-decoration: underline;
		cursor: pointer;
		transition: color 150ms ease;
	}

	.btn-secondary:hover {
		color: var(--color-brick);
	}

	.btn-secondary:active {
		transform: scale(0.97);
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
</style>
