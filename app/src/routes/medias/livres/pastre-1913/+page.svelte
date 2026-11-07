<script>
	// Le livre de Louis Pastre (1913) à feuilleter : pages qui tournent, bruit
	// du papier désactivable, mode texte. Le lecteur est dans
	// $lib/components/LecteurLivre.svelte ; les pages dans static/livres/.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import LecteurLivre from '$lib/components/LecteurLivre.svelte';
	import { LIVRES } from '$lib/data/livres.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	const livre = LIVRES.find((l) => l.id === 'pastre-1913');
	const t = {
		oc: { dreches: 'Libre del domeni public (Louis Pastre, mòrt en 1927). Scan : Romain Perier, 2026.' },
		fr: { dreches: 'Livre du domaine public (Louis Pastre, mort en 1927). Scan : Romain Perier, 2026.' },
		es: { dreches: 'Libro de dominio público (Louis Pastre, fallecido en 1927). Escaneo: Romain Perier, 2026.' },
		en: { dreches: 'Public-domain book (Louis Pastre, died 1927). Scan: Romain Perier, 2026.' },
		ca: { dreches: 'Llibre de domini públic (Louis Pastre, mort el 1927). Escaneig: Romain Perier, 2026.' },
		ar: { dreches: 'كتاب في الملكية العامة (لوي باستر، توفي عام 1927). المسح: رومان بيريي، 2026.' }
	};
	const sonLabel = {
		oc: 'Son de las paginas :',
		fr: 'Bruit des pages :',
		es: 'Sonido de las páginas:',
		en: 'Page-turning sound:',
		ca: 'So de les pàgines:',
		ar: 'صوت تقليب الصفحات:'
	};
	let tx = $derived(t[langStore.current] ?? t.oc);
	let titol = $derived(livre.titolOriginal);
	let traduccion = $derived(langStore.current === 'fr' ? '' : tria(livre.titol));
</script>

<svelte:head>
	<title>{livre.autor} · {livre.any} · Lo Ligam</title>
	<meta name="description" content="Le sous-dialecte bas-languedocien de Clermont-l’Hérault, de Louis Pastre (1913), à feuilleter." />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="libre">
		<nav class="camin" aria-label={tria({ oc: 'Camin', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' })}>
			<a href="/parla">{tria({ oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث' })}</a><span aria-hidden="true">›</span>
			<a href="/medias">{tria({ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans', ar: 'وسائل الإعلام' })}</a><span aria-hidden="true">›</span>
			<a href="/medias/livres">{tria({ oc: 'Libres', fr: 'Livres', es: 'Libros', en: 'Books', ca: 'Llibres', ar: 'الكتب' })}</a><span aria-hidden="true">›</span>
			<span aria-current="page">{livre.autor}</span>
		</nav>

		<header class="cap">
			<p class="autor">{livre.autor} · {livre.any}</p>
			<h1 lang="fr">{titol}</h1>
			{#if traduccion}<p class="trad" lang={langStore.current}>{traduccion}</p>{/if}
		</header>

		<LecteurLivre base="/livres/{livre.id}" total={livre.pagines} {titol} />

		<p class="dreches" lang={langStore.current}>{tx.dreches}</p>
		<p class="dreches" lang={langStore.current}>{tria(sonLabel)} <a href="https://opengameart.org/content/10-book-page-flips" target="_blank" rel="noopener noreferrer">StarNinjas (CC0), OpenGameArt</a></p>
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
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.libre {
		max-width: calc(80rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1rem, 3vh, 2rem) var(--marge) var(--esp-96, 6rem);
	}
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--esp-24, 1.5rem);
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.camin a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.cap {
		margin: 0 0 1rem;
	}
	.autor {
		margin: 0;
		color: var(--t-tinta-2);
	}
	h1 {
		margin: 0.2rem 0 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.5rem, 3.6vw, 2.4rem);
		line-height: 1.05;
	}
	.trad {
		margin: 0.4rem 0 0;
		color: var(--t-tinta-2);
		font-size: 1.05rem;
	}
	.dreches a {
		color: inherit;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 3px;
	}
	.dreches {
		margin: 1.6rem 0 0;
		color: var(--t-tinta-2);
		font-size: 0.92rem;
	}
</style>
