<script>
	// Banc d'essai (2026-11-12) de « Las carrièras » de S'imagina : des photos de Romain vues telles qu'elles sont, ou
	// en occitan. Trois sortes de montage : un texte français remplacé (plaque, panneau), un objet posé sur un mur
	// nu (plaque de rue), un lettrage peint à même la façade. Réaliste, avec le moins de pixels changés possible.
	// Page de travail, pas indexée. Outil : outils/photos-oc/talhar.py ; données : lib/imagina.
	import FotoOc from '$lib/imagina/FotoOc.svelte';
	import { FOTOS_OC } from '$lib/imagina/fotos-oc.js';
	import { tria } from '$lib/stores/lang.svelte.js';

	let lenga = $state('fr');

	const UI = {
		titre: { oc: 'Las carrièras, en occitan', fr: 'Les rues, en occitan' },
		vista: { oc: 'Version de la fòto', fr: 'Version de la photo' },
		fr: { oc: 'Fòto d’origina', fr: 'Photo d’origine' },
		oc: { oc: 'En occitan', fr: 'En occitan' },
		// ce que le montage a changé, dit sous chaque photo
		montatge: {
			cambiat: {
				oc: 'Montatge : sus la fòto d’origina, lo tèxte es en francés.',
				fr: 'Montage : sur la photo d’origine, le texte est en français.'
			},
			pausat: {
				oc: 'Montatge : sus la fòto d’origina, la paret es nuda.',
				fr: 'Montage : sur la photo d’origine, le mur est nu.'
			},
			pintat: {
				oc: 'Montatge : sus la fòto d’origina, la paret es nuda.',
				fr: 'Montage : sur la photo d’origine, le mur est nu.'
			}
		}
	};
</script>

<svelte:head>
	<title>{tria(UI.titre)} · ensag · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="fotos">
	<h1>{tria(UI.titre)}</h1>

	<div class="vista" role="group" aria-label={tria(UI.vista)}>
		{#each ['fr', 'oc'] as v (v)}
			<button type="button" aria-pressed={lenga === v} onclick={() => (lenga = v)}>{tria(UI[v])}</button>
		{/each}
	</div>

	{#each FOTOS_OC as foto, i (foto.clau)}
		<section class="foto">
			<FotoOc {foto} {lenga} eager={i === 0} />
			<p class="legenda">
				{#each foto.zones as z (z.patch)}
					{#if z[lenga]}<span class="tèxt" lang={lenga}>{z[lenga]}</span>{/if}
				{/each}
				{#if lenga === 'oc'}<span class="montatge">{tria(UI.montatge[foto.natura])}</span>{/if}
			</p>
		</section>
	{/each}
</main>

<style>
	.fotos {
		max-width: 980px;
		margin: 0 auto;
		padding: 6.5rem 1rem var(--esp-96);
		color: var(--t-tinta);
		font-family: var(--font-body);
	}
	h1 {
		margin: 0 0 var(--esp-16);
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 400;
	}
	/* la bascule reste sous les yeux pendant qu'on descend de photo en photo */
	.vista {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		gap: 1.6rem;
		margin: 0 0 var(--esp-24);
		padding: var(--esp-8) 0;
		background: var(--t-fons);
	}
	.vista button {
		padding: 0.35rem 0;
		font: inherit;
		color: var(--t-tinta-2);
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.vista button:hover {
		color: var(--t-tinta);
	}
	.vista button[aria-pressed='true'] {
		color: var(--t-tinta);
		border-bottom-color: var(--t-aur);
	}
	button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}
	.foto {
		margin: 0 0 var(--esp-64);
	}
	.legenda {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.6rem;
		min-height: 1.5em;
		margin: var(--esp-12) 0 0;
		padding-top: var(--esp-8);
		border-top: 1px solid var(--t-linha);
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.tèxt {
		color: var(--t-tinta);
		letter-spacing: 0.02em;
	}
</style>
