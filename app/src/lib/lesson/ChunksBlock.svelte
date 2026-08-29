<script>
	// Les expressions à retenir : le mot, « ça sonne comme », le sens.
	// Le bouton audio s'active dès qu'un fichier existe (c.audio).
	let { block } = $props();

	function play(src) {
		try {
			new Audio(src).play();
		} catch (e) {
			/* audio indisponible : jamais bloquant */
		}
	}
</script>

<section class="block">
	<h3 class="block-title">{block.title}</h3>
	{#if block.intro}<p class="intro"><em>{block.intro}</em></p>{/if}
	<ul class="chunks">
		{#each block.items as c}
			<li class="chunk">
				{#if c.audio}
					<button type="button" class="listen active" onclick={() => play(c.audio)} aria-label="Escotar {c.oc}">🔊</button>
				{:else}
					<button type="button" class="listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir">🔊</button>
				{/if}
				<span class="c-body">
					<span class="c-oc">{c.oc}</span>
					<span class="c-sound">{c.sound}</span>
					<span class="c-fr">{c.fr}</span>
				</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.block {
		background: white;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		color: rgba(58, 42, 32, 0.7);
	}

	.chunks {
		margin: 0.9rem 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.chunk {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.55rem 0.7rem;
		background: rgba(224, 164, 59, 0.09);
		border-radius: 12px;
	}

	.listen {
		border: none;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 999px;
		padding: 0.2rem 0.45rem;
		font-size: 0.85rem;
		opacity: 0.55;
		cursor: default;
		flex-shrink: 0;
	}

	.listen.active {
		opacity: 1;
		cursor: pointer;
		background: white;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.15);
	}

	.c-body {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.c-oc {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.02rem;
		color: var(--color-text);
	}

	.c-sound {
		font-size: 0.85rem;
		color: var(--color-brick);
	}

	.c-fr {
		font-size: 0.88rem;
		color: rgba(58, 42, 32, 0.75);
		line-height: 1.4;
	}
</style>
