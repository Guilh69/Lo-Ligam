<script>
	import AppHeader from '#lib/components/AppHeader.svelte';
	import { lang as langStore } from '#lib/stores/lang.svelte.js';
	import { editor } from '#lib/data/legal.js';
	import { tria } from '#lib/stores/lang.svelte.js';
	import { iniciar, txt, ligam } from '#lib/edicion/edicion.svelte.js';
	import { editar } from '#lib/edicion/editar.svelte.js';
	import { segments } from '#lib/edicion/marcat.js';

	let { data } = $props();

	const lèvaEdicion = iniciar('accessibilitat', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let lang = $derived(langStore.current);

	// Déclaration d'accessibilité (2026-10-26). Le français est la référence ;
	// l'occitan est à valider par Romain avant publication, l'espagnol à relire
	// (Aran) : en attendant, l'espagnol retombe sur l'occitan.
	const dataControl = '2026-10-26';
	const titre = { oc: 'Accessibilitat', fr: 'Accessibilité', es: 'Accesibilidad', en: 'Accessibility', ca: 'Accessibilitat', ar: 'إمكانية الوصول' };
	// espace avant les deux-points : seulement en occitan et en français
	let dp = $derived(lang === 'oc' || lang === 'fr' ? ' :' : ':');
</script>

<svelte:head>
	<title>{tria(titre)} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={lang}>{@render marcat(tria(v))}</span>{/snippet}

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1 use:editar={'accessibilitat.titol'}>{@render t('accessibilitat.titol')}</h1>
		<p class="maj"><span use:editar={'accessibilitat.maj'}>{@render t('accessibilitat.maj')}</span>{dp} {dataControl}</p>

		<section>
			<h2 use:editar={'accessibilitat.intro.titol'}>{@render t('accessibilitat.intro.titol')}</h2>
			<p use:editar={'accessibilitat.intro.text'}>{@render t('accessibilitat.intro.text')}</p>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.estat.titol'}>{@render t('accessibilitat.estat.titol')}</h2>
			<p use:editar={'accessibilitat.estat.text'}>{@render t('accessibilitat.estat.text')}</p>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.fach.titol'}>{@render t('accessibilitat.fach.titol')}</h2>
			<ul>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n (n)}<li use:editar={'accessibilitat.fach.' + n}>{@render t('accessibilitat.fach.' + n)}</li>{/each}
			</ul>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.manca.titol'}>{@render t('accessibilitat.manca.titol')}</h2>
			<ul>
				{#each [1, 2, 3, 4, 5] as n (n)}<li use:editar={'accessibilitat.manca.' + n}>{@render t('accessibilitat.manca.' + n)}</li>{/each}
			</ul>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.lengas.titol'}>{@render t('accessibilitat.lengas.titol')}</h2>
			<p use:editar={'accessibilitat.lengas.text'}>{@render t('accessibilitat.lengas.text')}</p>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.polica.titol'}>{@render t('accessibilitat.polica.titol')}</h2>
			<p use:editar={'accessibilitat.polica.text'}>{@render t('accessibilitat.polica.text')}</p>
		</section>

		<section>
			<h2 use:editar={'accessibilitat.contacte.titol'}>{@render t('accessibilitat.contacte.titol')}</h2>
			<p><span use:editar={'accessibilitat.contacte.text'}>{@render t('accessibilitat.contacte.text')}</span> <a href="mailto:{editor.email}">{editor.email}</a></p>
			<p class="dreches" use:editar={'accessibilitat.dreches'}>{@render t('accessibilitat.dreches')}</p>
		</section>
	</article>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: var(--color-cream);
	}

	.screen {
		max-width: 44rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 4rem;
	}

	.doc {
		margin-top: 2rem;
	}

	h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.7rem, 4vw, 2.3rem);
		color: var(--color-brick);
		margin: 0;
	}

	.maj {
		margin: 0.4rem 0 2rem;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	section {
		margin-bottom: 1.75rem;
	}

	h2 {
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-brick);
		margin: 0 0 0.4rem;
	}

	p,
	li {
		line-height: 1.6;
		text-wrap: pretty;
	}

	p {
		margin: 0;
	}

	ul {
		margin: 0;
		padding-left: 1.2rem;
	}

	li + li {
		margin-top: 0.3rem;
	}

	.dreches {
		margin-top: 0.6rem;
	}

	a {
		color: var(--color-teal);
	}
</style>
