<script>
	import HomeIcon from './HomeIcon.svelte';
	import OccitaniaIcon from './OccitaniaIcon.svelte';

	let { children } = $props();
</script>

<header class="top">
	<a class="home-link" href="/" aria-label="Tornar a l'acuèlh">
		<HomeIcon size={22} />
	</a>
	<span class="brand-name">Lo Ligam</span>
	<a class="carta-link" href="/carta" aria-label="Veire lo Mond en occitan">
		<OccitaniaIcon size={20} />
	</a>
	{#if children}
		<div class="header-right">
			{@render children()}
		</div>
	{/if}
</header>

<style>
	.top {
		width: 100%;
		max-width: 40rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--color-brick);
		background: rgba(165, 52, 42, 0.1);
		text-decoration: none;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.home-link:hover {
		background: rgba(165, 52, 42, 0.18);
		transform: scale(1.06);
	}

	.carta-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--color-teal);
		background: rgba(31, 95, 99, 0.1);
		text-decoration: none;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.carta-link:hover {
		background: rgba(31, 95, 99, 0.18);
		transform: scale(1.06);
	}

	.brand-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-text);
	}

	.header-right {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
</style>
