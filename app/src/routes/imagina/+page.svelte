<script>
	// Page de rubrique 04 S'imagina (2026-11-12), sur le modèle d'Amassa et de Se parla. Romain : « une catégorie
	// s'imagine, un peu plus revendicatrice, avec la Constitution en occitan, des photomontages de plaques de rue en
	// occitan, ce à quoi pourrait ressembler l'espace public avec de l'occitan… créer un imaginaire ». Ton du 22-10 :
	// montrer par les faits, jamais militant au sens pesant. Cases : la Constitution (en ligne) et les rues
	// (« Aviat »). Occitan nouveau à valider par Romain.
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { iniciar } from '$lib/edicion/edicion.svelte.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('imagina', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const RUBRICA = PLAN.find((r) => r.id === 'imagina');
</script>

<svelte:head>
	<title>{tria({ oc: 'S’imagina', fr: 'S’imagine', es: 'Se imagina', en: 'Imagine', ca: 'S’imagina', ar: 'نتخيّل' })} · Lo Ligam</title>
	<meta
		name="description"
		content="Imaginar un país que respècta sas lengas : la Constitucion, las carrièras en occitan. Imaginer un pays qui respecte ses langues : la Constitution, les rues en occitan."
	/>
</svelte:head>

<PaginaTeulas pagina="imagina" rubrica={RUBRICA} etiqueta={{ oc: 'Çò qu’imaginam', fr: 'Ce que nous imaginons', es: 'Lo que imaginamos', en: 'What we imagine', ca: 'El que imaginem', ar: 'ما نتخيّله' }} />
