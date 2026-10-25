<script>
	// Maquette de la page Mèdias (2026-10-25) : des cases dans les ors de la
	// case Mèdias de Se parla (Romain : « dans les médias, du jaune »), une par
	// sorte de média ; voir $lib/ensag/maqueta.js
	import PaginaTeulas from '$lib/apren/PaginaTeulas.svelte';
	import { PLAN } from '$lib/data/planSite.js';
	import { mostrar, teula } from '$lib/ensag/maqueta.js';

	const P = 'ensag-medias';
	mostrar(P, [
		{ clau: `${P}.titol`, tipe: 'text', oc: 'Mèdias', fr: 'Médias' },
		{ clau: `${P}.frasa`, tipe: 'text', oc: 'Las ràdios, las televisions e la premsa en occitan.', fr: 'Les radios, les télévisions et la presse en occitan.' },
		...teula(P, 'radios', 1, '/ensag/radios', 'Ràdios', 'Radios', 'Set ràdios en occitan, en dirècte.', 'Sept radios en occitan, en direct.'),
		...teula(P, 'television', 2, '/ensag/television', 'Television e video', 'Télévision et vidéo', 'Las cadenas, las emissions e las videos.', 'Les chaînes, les émissions et les vidéos.'),
		...teula(P, 'premsa', 3, '/ensag/medias#premsa', 'Premsa', 'Presse', 'Lèu.', 'Bientôt.')
	]);
</script>

<svelte:head>
	<title>Mèdias (maqueta) · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<PaginaTeulas pagina={P} rubrica={PLAN.find((r) => r.id === 'parla')} etiqueta={{ oc: 'Los mèdias en occitan', fr: 'Les médias en occitan' }} paleta="aur" />
