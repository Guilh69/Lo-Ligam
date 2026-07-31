<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import CartaOccitania from '$lib/components/CartaOccitania.svelte';
</script>

<svelte:head>
	<title>Carta — Lo Ligam</title>
</svelte:head>

<div class="screen">
	<AppHeader />

	<main class="carta-wrap">
		<CartaOccitania />

		<div class="info-card">
			<h1>La carta d'Occitània</h1>
			<p>
				Fons de carta en occitan, realizat per <a
					href="https://www.openstreetmap.bzh/"
					target="_blank"
					rel="noopener noreferrer">OpenStreetMap e occitan</a
				> amb l'Institut d'Estudis Occitans.
			</p>
		</div>
	</main>
</div>

<style>
	.screen {
		position: relative;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.screen :global(.top) {
		max-width: none;
		padding: 0.9rem 1.5rem;
		background: rgba(245, 234, 216, 0.9);
		backdrop-filter: blur(10px);
		flex-shrink: 0;
		z-index: 2;
	}

	.carta-wrap {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	.info-card {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1000;
		max-width: min(22rem, calc(100% - 2rem));
		background: rgba(245, 234, 216, 0.92);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 1rem 1.25rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.18);
	}

	.info-card h1 {
		font-size: 1.3rem;
		margin: 0 0 0.4rem;
	}

	.info-card p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--color-teal);
	}

	.info-card a {
		color: inherit;
		text-decoration: underline;
	}

	@media (max-width: 30rem) {
		.info-card {
			top: auto;
			bottom: 1rem;
			left: 1rem;
			right: 1rem;
			max-width: none;
		}
	}
</style>
