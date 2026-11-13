<script>
	import Icona from '$lib/components/Icona.svelte';
	import { rich } from '$lib/lesson/rich.js';
	// Les expressions à retenir : le mot, « ça sonne comme », le sens
	// (l'intro et le sens acceptent l'italique *…* comme les autres blocs).
	// Le bouton audio s'active dès qu'un fichier existe : c.audio d'abord, sinon
	// le son de la phrase (lib/voix, retrouvé par sa clé).
	import { onDestroy } from 'svelte';
	import { sonDe } from '$lib/voix/phrases.js';
	import { jouer } from '$lib/voix/lecteur.js';
	let { block, modulId = '' } = $props();

	let playing = $state(null);
	let arret = null;

	// Un seul son à la fois : jouer() arrête le précédent.
	function play(cle, src) {
		if (playing === cle && arret) {
			arret();
			return;
		}
		playing = cle;
		const a = jouer(src, () => {
			if (playing === cle) playing = null;
		});
		arret = a;
	}

	onDestroy(() => arret?.());
</script>

<section class="block">
	<h3 class="block-title">{block.title}</h3>
	{#if block.intro}<p class="intro"><em>{@html rich(block.intro)}</em></p>{/if}
	<ul class="chunks">
		{#each block.items as c, ci}
			{@const src = c.audio ?? sonDe(modulId, c)}
			<li class="chunk">
				{#if src}
					<button
						type="button"
						class="pc pc-2 listen active"
						class:on={playing === ci}
						aria-pressed={playing === ci}
						onclick={() => play(ci, src)}
						aria-label="Écouter : {c.oc.replace(/\*/g, '')}"><Icona nom={playing === ci ? 'pause' : 'son'} size="1.25em" /></button>
				{:else}
					<button type="button" class="pc pc-2 listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir"><Icona nom="son" size="1.25em" /></button>
				{/if}
				<span class="c-body">
					<span class="c-oc">{@html rich(c.oc)}</span>
					<span class="c-sound">{@html rich(c.sound ?? '')}</span>
					<span class="c-fr">{@html rich(c.fr)}</span>
				</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.block {
		background: var(--l-carta);
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--l-marca);
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		color: color-mix(in srgb, var(--t-tinta) 70%, transparent);
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
		background: rgba(238, 175, 52, 0.09);
		border-radius: 12px;
	}

	/* pièce de papier (lib/styles/papier.css) : le petit bouton d'écoute */
	.listen {
		--r: 10px;
		min-height: 0;
		padding: 0.25rem 0.5rem;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.listen:disabled {
		cursor: default;
	}

	.listen.active {
		--pc-tinta: var(--pc-carton-tinta);
		/* cible tactile de 44 px */
		min-width: 44px;
		min-height: 44px;
	}

	.listen.on {
		background: var(--color-gold);
		color: var(--t-tinta);
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
		color: var(--t-tinta);
	}

	.c-sound {
		font-size: 0.85rem;
		color: var(--l-marca);
	}

	.c-fr {
		font-size: 0.88rem;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
		line-height: 1.4;
	}
</style>
