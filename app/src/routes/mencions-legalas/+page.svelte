<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { editor, hebergeur, dataMiseAJour } from '$lib/data/legal';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { iniciar, txt, ligam } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data } = $props();

	const lèvaEdicion = iniciar('mencions', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let lang = $derived(langStore.current);

	// Le texte de référence est le français : c'est la langue dans laquelle
	// la loi française exige ces informations. L'occitan est fourni à côté,
	// à valider par Romain avant publication.
	const titre = { oc: 'Mencions legalas', fr: 'Mentions légales', es: 'Avisos legales', en: 'Legal notice', ca: 'Avís legal', ar: 'الإشعار القانوني' };
	// espace avant les deux-points : seulement en occitan et en français
	let dp = $derived(lang === 'oc' || lang === 'fr' ? ' :' : ':');

	// Rend visible ce qui n'a pas encore été renseigné, plutôt que d'afficher
	// une mention légale trompeuse.
	function val(v) {
		return v?.startsWith('À_') ? null : v;
	}
</script>

<svelte:head>
	<title>{tria(titre)} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={lang}>{@render marcat(tria(v))}</span>{/snippet}

{#snippet lien(clau)}{@const l = ligam(clau)}<a href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener noreferrer' : undefined} use:editar={clau}><span lang={lang}>{tria(l)}</span></a>{/snippet}

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1 use:editar={'mencions.titol'}>{@render t('mencions.titol')}</h1>
		<p class="maj"><span use:editar={'mencions.maj'}>{@render t('mencions.maj')}</span>{dp} {dataMiseAJour}</p>

		<section>
			<h2 use:editar={'mencions.editor.titol'}>{@render t('mencions.editor.titol')}</h2>
			<p>
				{editor.nom}<br />
				{editor.statut}
				{#if val(editor.siret)}<br />SIRET{dp} {editor.siret}{/if}
				{#if val(editor.registre)}<br />{editor.registre}{/if}
				{#if val(editor.tva)}<br />{editor.tva}{/if}
				{#if val(editor.adresse)}<br />{editor.adresse}{/if}
				{#if val(editor.telefòn)}<br />{editor.telefòn}{/if}
			</p>
		</section>

		<section>
			<h2 use:editar={'mencions.director.titol'}>{@render t('mencions.director.titol')}</h2>
			<p>{editor.directeurPublication}</p>
		</section>

		<section>
			<h2 use:editar={'mencions.contacte.titol'}>{@render t('mencions.contacte.titol')}</h2>
			<p><a href="mailto:{editor.email}">{editor.email}</a></p>
		</section>

		<section>
			<h2 use:editar={'mencions.albergador.titol'}>{@render t('mencions.albergador.titol')}</h2>
			<p>
				{hebergeur.nom}<br />
				{hebergeur.adresse}<br />
				<a href={hebergeur.site} target="_blank" rel="noopener noreferrer">{hebergeur.site}</a>
			</p>
		</section>

		<section>
			<h2 use:editar={'mencions.proprietat.titol'}>{@render t('mencions.proprietat.titol')}</h2>
			<p use:editar={'mencions.proprietat.text'}>{@render t('mencions.proprietat.text')}</p>
			<p><span use:editar={'mencions.proprietat.ia'}>{@render t('mencions.proprietat.ia')}</span> {@render lien('mencions.proprietat.ligam')}</p>
		</section>

		<section>
			<h2 use:editar={'mencions.carta.titol'}>{@render t('mencions.carta.titol')}</h2>
			<p use:editar={'mencions.carta.text'}>{@render t('mencions.carta.text')}</p>
		</section>

		<section>
			<h2 use:editar={'mencions.polica.titol'}>{@render t('mencions.polica.titol')}</h2>
			<p use:editar={'mencions.polica.text'}>{@render t('mencions.polica.text')}</p>
		</section>

		<section>
			<h2 use:editar={'mencions.ligams.titol'}>{@render t('mencions.ligams.titol')}</h2>
			<p use:editar={'mencions.ligams.text'}>{@render t('mencions.ligams.text')}</p>
		</section>

		<section>
			<h2 use:editar={'mencions.donadas.titol'}>{@render t('mencions.donadas.titol')}</h2>
			<p><span use:editar={'mencions.donadas.text'}>{@render t('mencions.donadas.text')}</span> {@render lien('mencions.donadas.ligam')}</p>
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

	p {
		margin: 0;
		line-height: 1.6;
		text-wrap: pretty;
	}
	/* deux paragraphes dans une section (illustrations faites par IA) */
	p + p {
		margin-top: 0.6rem;
	}

	a {
		color: var(--color-teal);
	}
</style>
