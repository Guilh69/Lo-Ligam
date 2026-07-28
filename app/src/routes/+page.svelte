<script>
	import logo from '$lib/assets/logo.png';

	let lang = $state('oc');
</script>

<main class="screen">
	<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
		<button type="button" class:active={lang === 'oc'} onclick={() => (lang = 'oc')}>Òc</button>
		<button type="button" class:active={lang === 'fr'} onclick={() => (lang = 'fr')}>Fr</button>
	</div>

	<div class="brand-card">
		<img src={logo} alt="Lo Ligam" />
	</div>

	<div class="welcome">
		<p class="tagline-oc">Benvenguda ! Aprèn l'occitan, teisse lo ligam amb sa cultura.</p>
		<p class="tagline-fr">
			<em>(Bienvenue&nbsp;! Apprends l'occitan, tisse le lien avec sa culture.)</em>
		</p>
	</div>

	<div class="actions">
		<button type="button" class="btn-primary">Començar</button>
		<button type="button" class="btn-secondary">Ai ja un compte</button>
	</div>
</main>

<style>
	.screen {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		padding: 2rem 1.5rem;
		text-align: center;
		animation: fade-in 500ms ease-out;
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
			color 150ms ease;
	}

	.lang-toggle button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.brand-card {
		width: 220px;
		height: 220px;
		border-radius: 28px;
		overflow: hidden;
		box-shadow: 0 10px 30px rgba(165, 52, 42, 0.25);
	}

	.brand-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.welcome {
		max-width: 32rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tagline-oc {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: var(--color-text);
	}

	.tagline-fr {
		margin: 0;
		font-size: 1rem;
		color: var(--color-teal);
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 20rem;
	}

	button {
		font-size: 1.05rem;
	}

	.btn-primary {
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 0.9rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 120ms ease,
			box-shadow 120ms ease;
		box-shadow: 0 4px 14px rgba(224, 164, 59, 0.4);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(224, 164, 59, 0.5);
	}

	.btn-primary:active {
		transform: translateY(0) scale(0.98);
		transition-duration: 60ms;
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-teal);
		border: none;
		padding: 0.5rem;
		font-weight: 500;
		text-decoration: underline;
		cursor: pointer;
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
