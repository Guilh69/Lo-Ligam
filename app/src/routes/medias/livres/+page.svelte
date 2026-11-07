<script>
	// Livres (2026-10-29, Romain : une rubrique « Livres » dans Médias, pour
	// consulter des livres anciens libres de droits, avec les pages qui
	// tournent). Un livre pour commencer : Louis Pastre, 1913. Données dans
	// $lib/data/livres.js.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { LIVRES } from '$lib/data/livres.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';

	const t = {
		oc: { titol: 'Libres', frasa: 'Los libres ancians, liures de dreches, de fulhetar.', legir: 'Legir lo libre', domeni: 'Domeni public' },
		fr: { titol: 'Livres', frasa: 'Les livres anciens, libres de droits, à feuilleter.', legir: 'Lire le livre', domeni: 'Domaine public' },
		es: { titol: 'Libros', frasa: 'Los libros antiguos, libres de derechos, para hojear.', legir: 'Leer el libro', domeni: 'Dominio público' },
		en: { titol: 'Books', frasa: 'Old books, free of copyright, to browse.', legir: 'Read the book', domeni: 'Public domain' },
		ca: { titol: 'Llibres', frasa: 'Els llibres antics, lliures de drets, per fullejar.', legir: 'Llegir el llibre', domeni: 'Domini públic' },
		ar: { titol: 'الكتب', frasa: 'كتب قديمة خالية من حقوق النشر، للتصفّح.', legir: 'قراءة الكتاب', domeni: 'ملكية عامة' }
	};
	let tx = $derived(t[langStore.current] ?? t.oc);
</script>

<svelte:head>
	<title>{tx.titol} · Lo Ligam</title>
	<meta name="description" content="Los libres ancians de fulhetar. Les livres anciens à feuilleter." />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="livres">
		<nav class="camin" aria-label={tria({ oc: 'Camin', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' })}>
			<a href="/parla">{tria({ oc: 'Se parla', fr: 'Se parle', es: 'Se habla', en: 'Speak', ca: 'Es parla', ar: 'نتحدّث' })}</a><span aria-hidden="true">›</span>
			<a href="/medias">{tria({ oc: 'Mèdias', fr: 'Médias', es: 'Medios', en: 'Media', ca: 'Mitjans', ar: 'وسائل الإعلام' })}</a><span aria-hidden="true">›</span>
			<span aria-current="page">{tx.titol}</span>
		</nav>

		<header class="cap">
			<h1 lang={langStore.current}>{tx.titol}</h1>
			<p class="frasa" lang={langStore.current}>{tx.frasa}</p>
		</header>

		<ul class="rai">
			{#each LIVRES as l (l.id)}
				<li>
					<a class="cobèrta" href="/medias/livres/{l.id}">
						<img src="/livres/{l.id}/p001.webp" alt="" width="602" height="952" loading="lazy" decoding="async" />
						<span class="infos">
							<span class="autor">{l.autor} · {l.any}</span>
							<span class="titol" lang="fr">{l.titolOriginal}</span>
							{#if langStore.current !== 'fr'}<span class="sota" lang={langStore.current}>{tria(l.titol)}</span>{/if}
							<span class="sota" lang="fr">{l.sotaOriginal}</span>
							<span class="drech">{tx.domeni} · {l.pagines} p.</span>
							<span class="legir">{tx.legir} →</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
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
	.livres {
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(1.5rem, 4vh, 3rem) var(--marge) var(--esp-96, 6rem);
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
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
	}
	.frasa {
		margin: 0.6rem 0 2rem;
		color: var(--t-tinta-2);
		font-size: 1.15rem;
	}
	.rai {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 30rem), 1fr));
		gap: 1.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.cobèrta {
		display: grid;
		grid-template-columns: minmax(7rem, 11rem) 1fr;
		gap: 1.2rem;
		align-items: center;
		padding: 1rem;
		color: inherit;
		text-decoration: none;
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--t-aur) 45%, transparent);
		border-radius: 1rem;
		transition: transform 0.25s ease, background 0.25s ease;
	}
	.cobèrta:hover {
		transform: translateY(-3px);
		background: color-mix(in srgb, var(--t-aur) 20%, transparent);
	}
	.cobèrta:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.cobèrta img {
		width: 100%;
		height: auto;
		border-radius: 0.3rem;
		box-shadow: 0 6px 18px color-mix(in srgb, #000 35%, transparent);
	}
	.infos {
		display: grid;
		gap: 0.4rem;
	}
	.autor {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.titol {
		font-family: var(--font-heading);
		font-size: clamp(1.35rem, 3.4cqi, 1.9rem);
		line-height: 1.15;
	}
	.sota,
	.drech {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.legir {
		margin-top: 0.4rem;
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--t-terra);
		text-underline-offset: 4px;
	}
	@media (prefers-reduced-motion: reduce) {
		.cobèrta {
			transition: none;
		}
		.cobèrta:hover {
			transform: none;
		}
	}
</style>
