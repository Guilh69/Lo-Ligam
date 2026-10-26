<script>
	// L'accueil des groupes, à droite sur grand écran (sur téléphone, la liste
	// prend toute la place) : l'esprit des groupes, avant d'en choisir un.
	import { tria } from '$lib/stores/lang.svelte.js';
	import Tèxte from '$lib/grops/Tèxte.svelte';
</script>

<svelte:head>
	<title>{tria({ oc: 'Grops', fr: 'Groupes', es: 'Grupos', en: 'Groups', ca: 'Grups' })} · Lo Ligam</title>
	<meta
		name="description"
		content="Grops per parlar occitan amassa, prèp de tu o en linha. Des groupes pour parler occitan ensemble, près de chez toi ou en ligne."
	/>
</svelte:head>

<div class="acuelh">
	<Tèxte clau="grops.acuelh" class="frasa" />
	<Tèxte clau="grops.pseudo" class="nota" />
	<p class="causir">{tria({ oc: 'Causís un grop dins la lista.', fr: 'Choisis un groupe dans la liste.', es: 'Elige un grupo de la lista.', en: 'Pick a group from the list.', ca: 'Tria un grup de la llista.' })}</p>
</div>

<style>
	.acuelh {
		display: grid;
		align-content: center;
		gap: var(--esp-16);
		min-height: 100%;
		max-width: 40rem;
		margin: 0 auto;
		padding: var(--esp-32) var(--esp-24);
		box-sizing: border-box;
	}
	.acuelh :global(.frasa) {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 2.4vw, 2rem);
		line-height: 1.3;
	}
	.acuelh :global(.nota),
	.causir {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.causir {
		padding-left: var(--esp-12);
		border-left: 3px solid var(--t-aur);
	}
</style>
