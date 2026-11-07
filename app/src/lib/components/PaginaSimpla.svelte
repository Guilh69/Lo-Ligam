<script>
	// Le cadre d'une page simple (accueil du wiki, sommaire de la grammaire),
	// sur le modèle des pages de rubrique (PaginaTeulas) : le titre en grand,
	// une phrase, puis le contenu ; même fond de braise, même bandeau.
	import AppHeader from '$lib/components/AppHeader.svelte';

	/** titol : en occitan ; frasa : texte déjà balisé (marcar) ; parent : { href, nom } */
	let { titol, frasa = '', parent = null, children } = $props();
</script>

<div class="pagina">
	<div class="entete"><AppHeader /></div>
	<main class="principal">
		<header class="cap">
			{#if parent}<a class="parent" href={parent.href} lang="oc">{parent.nom}</a>{/if}
			<h1 lang="oc">{titol}</h1>
			{#if frasa}<p class="frasa">{@html frasa}</p>{/if}
		</header>
		{@render children()}
	</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, var(--t-braise-or), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.entete {
		padding: 1.3rem var(--marge);
	}
	.entete :global(.top) {
		max-width: none;
	}
	.principal {
		container: pagina / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}
	.cap {
		margin-bottom: var(--esp-48);
	}
	.parent {
		display: inline-block;
		margin-bottom: var(--esp-8);
		color: var(--t-tinta-2);
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.2em;
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
	}
	.frasa {
		max-width: 46ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.parent:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
