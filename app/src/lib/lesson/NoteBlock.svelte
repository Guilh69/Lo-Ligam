<script>
	import Icona from '$lib/components/Icona.svelte';
	// Bloc de texte typé : son du jour, Los que parlan, culture, consigne de
	// tâche… La variante choisit la couleur et l'icône, le contenu reste des
	// paragraphes (et une liste optionnelle).
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();

	const icons = {
		info: '',
		son: '🔊',
		natiu: '🗣️',
		culture: '🎶',
		task: '✍️'
	};
	let icon = $derived(icons[block.variant] ?? '');

	function play(src) {
		try {
			new Audio(src).play();
		} catch (e) {
			/* audio indisponible : jamais bloquant */
		}
	}
</script>

<section class="block {block.variant ?? 'info'}">
	<h3 class="block-title">{#if icon}<span aria-hidden="true">{icon}</span> {/if}{block.title}</h3>
	{#if block.audioSrc}
		<button type="button" class="pc pc-2 listen active" onclick={() => play(block.audioSrc)} aria-label="Escotar">
			<Icona nom="son" size="1.2em" /> <span class="listen-label">escotar</span>
		</button>
	{:else if block.audio}
		<button type="button" class="pc pc-2 listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir">
			<Icona nom="son" size="1.2em" /> <span class="listen-label">a venir</span>
		</button>
	{/if}
	{#each block.paragraphs ?? [] as p}
		<p class="para">{@html rich(p)}</p>
	{/each}
	{#if block.list?.length}
		<ul class="list">
			{#each block.list as li}<li>{@html rich(li)}</li>{/each}
		</ul>
	{/if}
	<!-- Un lien (chanson à écouter, carnet, carte) : lien = { href, texte } ;
	     un site extérieur s'ouvre dans un nouvel onglet. -->
	{#if block.lien?.href}
		{@const dehors = /^https?:\/\//.test(block.lien.href)}
		<p class="para lien">
			<a href={block.lien.href} target={dehors ? '_blank' : undefined} rel={dehors ? 'noopener noreferrer' : undefined}
				>{block.lien.texte ?? block.lien.href}{#if dehors}{' '}<span class="dehors">(site extérieur)</span>{/if}</a
			>
		</p>
	{/if}
</section>

<style>
	.lien .dehors {
		font-size: 0.85em;
		opacity: 0.8;
	}
	.block {
		position: relative;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		background: var(--l-carta);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
	}

	.block.son {
		background: rgba(238, 175, 52, 0.13);
		box-shadow: none;
	}

	.block.natiu {
		background: color-mix(in srgb, var(--l-teal) 10%, transparent);
		box-shadow: none;
	}

	.block.culture {
		background: color-mix(in srgb, var(--t-accion) 12%, transparent);
		box-shadow: none;
	}

	.block.task {
		border: 2px solid rgba(238, 175, 52, 0.55);
	}

	.block-title {
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--l-marca);
	}

	/* pièce de papier (lib/styles/papier.css) : le bouton d'écoute en haut à droite */
	.listen {
		position: absolute;
		top: 1.1rem;
		right: 1.1rem;
		--r: 10px;
		min-height: 0;
		padding: 0.25rem 0.6rem;
		font-size: 0.8rem;
	}

	.listen:disabled {
		cursor: default;
	}

	.listen.active {
		--pc-tinta: var(--l-marca);
	}

	.listen-label {
		font-size: 0.7rem;
		font-style: italic;
	}

	.para {
		margin: 0 0 0.6rem;
		line-height: 1.6;
		color: var(--t-tinta);
		font-size: 0.95rem;
	}

	.para:last-child {
		margin-bottom: 0;
	}

	.list {
		margin: 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.list li {
		font-size: 0.93rem;
		line-height: 1.55;
		color: var(--t-tinta);
	}
</style>
