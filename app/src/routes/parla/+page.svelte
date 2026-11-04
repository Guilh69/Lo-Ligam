<script>
	// Page de rubrique 01 Se parla (2026-10-25, chantier 21), sur le modèle de
	// S'apren (Romain : « prends exemple sur la page S'apren »). Rôle distinct de
	// l'accueil, qui nomme les portes : ici, chaque porte en case de couleur,
	// avec une ligne sur ce qu'on y trouve (la carte en grand, le wiki, Òbras,
	// Articles, les musiques ; Cultura à la place du wiki le 2026-11-04).
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('parla', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const RUBRICA = PLAN.find((r) => r.id === 'parla');
</script>

<svelte:head>
	<title>{tria({ oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث' })} · Lo Ligam</title>
	<meta
		name="description"
		content="L’occitan se parla : la carta, la cultura, las òbras, los articles, los mèdias. L’occitan se parle : la carte, la culture, les œuvres, les articles, les médias."
	/>
</svelte:head>

<PaginaTeulas pagina="parla" rubrica={RUBRICA} etiqueta={{ oc: 'Çò que se ditz e se fa aicí', fr: 'Ce qui se dit et se fait ici', es: 'Lo que se dice y se hace aquí', en: 'What is said and done here', ca: 'El que es diu i es fa aquí', ar: 'ما نقوله ونفعله هنا' }} />
