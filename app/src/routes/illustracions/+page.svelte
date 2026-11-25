<script>
	// Las illustracions (Romain, 2026-11-06) : la page où mène la mention
	// « facha per l'IA » posée sur les illustrations faites par IA. Elle dit
	// pourquoi (le projet a commencé sans budget) et annonce la cagnotte qui
	// paiera un illustrateur ou une illustratrice. Rien n'est promis ici que
	// Romain n'ait dit : l'argent sert uniquement à ça ; la page montrera l'argent
	// récolté, l'argent dépensé poste par poste et les artistes (pas de facture :
	// Romain, 06-11). Quand la cagnotte ouvrira : objectif (après un devis),
	// montants modifiables avec « Editar », règles si l'objectif est dépassé
	// ou pas atteint, bouton vers la page du service de paiement (jamais de
	// formulaire de carte bancaire sur le site). Fiche :
	// revisions/2026-11-06-illustrations-ia-cagnotte.md
	// Occitan passé à lo Congrès le 06-11 (canhòta, prètzfach, budgèt…), à
	// relire par Romain ; es, en, ca, ar par Aran (06-11).
	import AppHeader from '#lib/components/AppHeader.svelte';
	import { tria, lang } from '#lib/stores/lang.svelte.js';
	import { iniciar, txt } from '#lib/edicion/edicion.svelte.js';
	import { editar } from '#lib/edicion/editar.svelte.js';
	import { segments } from '#lib/edicion/marcat.js';

	let { data } = $props();

	const lèvaEdicion = iniciar('illustracions', data.elements);
	$effect(() => () => lèvaEdicion?.());

	const titolPagina = { oc: 'Las illustracions', fr: 'Les illustrations', es: 'Las ilustraciones', en: 'The illustrations', ca: 'Les il·lustracions', ar: 'الرسومات' };
	// (la description meta n'est pas modifiable sur place)
	const descripcion = {
		fr: 'Les illustrations de Lo Ligam sont faites par IA, en attendant un illustrateur ou une illustratrice payé·e par une cagnotte.',
		es: 'Las ilustraciones de Lo Ligam están hechas por IA, a la espera de una persona ilustradora pagada con una colecta.',
		en: 'Lo Ligam’s illustrations are made by AI, until an illustrator can be paid through a fundraiser.',
		ca: 'Les il·lustracions de Lo Ligam són fetes per IA, a l’espera d’una persona il·lustradora pagada amb una col·lecta.',
		ar: 'رسومات Lo Ligam من صنع الذكاء الاصطناعي، إلى أن يتولى شخص الرسم بأجر تموّله حملة تبرعات.'
	};

	// la langue réellement affichée (tria retombe sur l'occitan)
	const lg = (o) => (o?.[lang.current] ? lang.current : o?.oc ? 'oc' : 'fr');
</script>

<svelte:head>
	<title>{tria(titolPagina)} · Lo Ligam</title>
	<meta name="description" content={tria(descripcion)} />
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={lg(v)}>{@render marcat(tria(v))}</span>{/snippet}

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main id="contengut" class="illustracions">
		<header class="cap">
			<h1 use:editar={'illustracions.titol'}>{@render t('illustracions.titol')}</h1>
			<p class="frasa" use:editar={'illustracions.frasa'}>{@render t('illustracions.frasa')}</p>
		</header>

		<section class="canhota" aria-labelledby="canhota-titol">
			<h2 id="canhota-titol" use:editar={'illustracions.canhota.titol'}>{@render t('illustracions.canhota.titol')}</h2>
			<p use:editar={'illustracions.canhota.p1'}>{@render t('illustracions.canhota.p1')}</p>
			<p use:editar={'illustracions.canhota.p2'}>{@render t('illustracions.canhota.p2')}</p>
			<p use:editar={'illustracions.canhota.p3'}>{@render t('illustracions.canhota.p3')}</p>
			<p class="estat" use:editar={'illustracions.canhota.estat'}>{@render t('illustracions.canhota.estat')}</p>
		</section>
	</main>
</div>

<style>
	/* le cadre des pages intérieures, comme /ideas (--marge n'est pas global) */
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
	.illustracions {
		max-width: calc(44rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
		font-family: var(--font-body);
		color: var(--t-tinta);
	}
	.cap {
		margin-bottom: var(--esp-48);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7vw, 4.5rem);
		line-height: 0.95;
	}
	.frasa {
		max-width: 40ch;
		margin: var(--esp-24) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.3rem);
		line-height: 1.55;
		color: var(--t-tinta-2);
	}

	/* une carte à filet fin, comme les autres pages harmonisées */
	.canhota {
		padding: clamp(1.25rem, 4vw, 2.25rem);
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons-2);
	}
	h2 {
		margin: 0 0 var(--esp-16);
		font-size: 1.2rem;
		font-weight: 700;
	}
	.canhota p {
		margin: 0 0 0.7rem;
		max-width: 52ch;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	/* l'état de la cagnotte, mis en valeur à l'or (règle B) */
	.canhota .estat {
		margin: var(--esp-24) 0 0;
		color: var(--t-aur);
		font-weight: 700;
	}
</style>
