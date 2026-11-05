<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { ambianca, armonizada } from '$lib/stores/ambianca.svelte.js';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import TornarAmont from '$lib/components/TornarAmont.svelte';
	// l'édition sur place (bouton, barre, panneau) : ne montre rien tant
	// qu'une page ne s'y est pas branchée (2026-10-24)
	import Edicion from '$lib/components/Edicion.svelte';
	import { tria } from '$lib/stores/lang.svelte.js';

	let { children } = $props();

	// Cadre commun (2026-10-07). Les pages sont harmonisées une à une avec la
	// charte de l'esbòs de nuèch ; tant qu'une page n'est pas dans ARMONIZADAS
	// (stores/ambianca), elle reste en thème clair (elle est dessinée pour un
	// fond crème), sans toucher au choix mémorisé du visiteur.
	let id = $derived(page.route.id ?? '');
	$effect(() => {
		ambianca.forçarClar = !armonizada(id);
	});
	// Pied de page partout, sauf l'administration (l'accueil l'a aussi depuis
	// qu'il est passé dans le cadre commun, 2026-10-07). L'essai de la refonte
	// claire (/ensag/clar, 2026-10-21) et l'esquisse « page presque blanche »
	// (/ensag/blanc, 2026-10-22) dessinent leur propre pied de page. Les groupes
	// (2026-10-25) tiennent à hauteur d'écran, comme une messagerie. La carte (2026-10-26) est une interface pleine et
	// stable : ni pied de page ni défilement. La pluie de mots (/ensag/plueja,
	// 2026-11-04) occupe tout l'écran, comme un fond d'écran ; l'espace des
	// petits (/ensag/anem, 2026-11-04) aussi : la sortie est dans son coin des adultes.
	let ambPè = $derived(
		!id.startsWith('/admin') && !id.startsWith('/grops') && id !== '/carta' && id !== '/ensag/clar' && id !== '/ensag/blanc' && id !== '/ensag/plueja' && id !== '/ensag/anem'
	);

	// Lien d'évitement (2026-10-26, page accessibilité) : première étape du
	// clavier, il envoie le focus sur le contenu principal de la page.
	function anarAlContengut(e) {
		e.preventDefault();
		const cible = document.querySelector('main') ?? document.querySelector('h1');
		if (!cible) return;
		if (!cible.hasAttribute('tabindex')) cible.setAttribute('tabindex', '-1');
		cible.focus();
		cible.scrollIntoView({ block: 'start' });
	}
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="apple-touch-icon" href="/icones-app/apple-touch-180.png" />
	<meta name="theme-color" content="#22100a" />
	<title>Lo Ligam</title>
</svelte:head>

<a class="evitar" href="#contengut" onclick={anarAlContengut}>{tria({ oc: 'Anar al contengut', fr: 'Aller au contenu', es: 'Ir al contenido', en: 'Skip to content', ca: 'Anar al contingut', ar: 'الانتقال إلى المحتوى' })}</a>

{@render children()}

{#if ambPè}
	<SiteFooter />
{/if}

{#if ambPè}
	<TornarAmont />
{/if}

<Edicion />

<style>
	.evitar {
		position: fixed;
		top: 0.6rem;
		left: 0.6rem;
		z-index: 1000;
		padding: 0.6rem 1rem;
		border-radius: 0.5rem;
		background: #1c1410;
		color: #fff;
		font-weight: 600;
		text-decoration: none;
		transform: translateY(-200%);
	}
	.evitar:focus-visible {
		transform: none;
		outline: 2px solid #f6b73c;
		outline-offset: 2px;
	}
</style>
