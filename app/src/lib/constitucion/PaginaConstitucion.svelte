<script>
	// Le cadre d'une page de la Constitution en occitan : bandeau, retour, titre, une phrase, puis la lecture.
	// Même cadre que les autres pages intérieures (PaginaSimpla), avec un titre moins grand : les noms des
	// quatre textes sont longs. Occitan de la page à valider par Romain.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Retour from '$lib/components/Retour.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import Lectura from './Lectura.svelte';

	let { texte } = $props();

	const fr = $derived(langStore.current === 'fr');
	const titol = $derived(fr ? texte.cort.fr : texte.cort.oc);
	const complet = $derived(fr ? texte.fr : texte.oc);
	const frasa = $derived(
		texte.id === 'const'
			? fr
				? 'La Constitution de la République française, en occitan : ce que pourrait être un pays qui publie ses textes fondateurs dans les langues qui s’y parlent.'
				: 'La Constitucion de la Republica francesa, en occitan : çò que poiriá èsser un país que publica sos tèxtes fondadors dins las lengas que s’i parlan.'
			: fr
				? `${complet}. L’un des trois textes que le préambule de la Constitution cite.`
				: `${complet}. Un dels tres tèxtes que lo preambul de la Constitucion cita.`
	);
	const descripcion = 'La Constitucion de la Republica francesa en occitan, en cors de verificacion. La Constitution de la République française en occitan, en cours de vérification.';
</script>

<svelte:head>
	<title>{titol} · Lo Ligam</title>
	<meta name="description" content={descripcion} />
	<!-- tant que Romain n'a pas relu l'occitan, la page n'est pas indexée -->
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="entete"><AppHeader /></div>
	<main class="principal">
		<Retour actuelle={titol} />
		<header class="cap">
			<h1 lang={fr ? 'fr' : 'oc'}>{titol}</h1>
			<p class="frasa" lang={fr ? 'fr' : 'oc'}>{frasa}</p>
		</header>
		{#key texte.id}<Lectura {texte} />{/key}
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
		margin: var(--esp-24) 0 var(--esp-32);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.6rem, 8vw, 5.6rem);
		line-height: 0.98;
		letter-spacing: -0.01em;
		overflow-wrap: anywhere;
	}
	.frasa {
		max-width: 52ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.3rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
</style>
