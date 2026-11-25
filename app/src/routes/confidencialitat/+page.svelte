<script>
	import AppHeader from '#lib/components/AppHeader.svelte';
	import { lang as langStore } from '#lib/stores/lang.svelte.js';
	import { editor, hebergeur, baseDonnadas, dataMiseAJour } from '#lib/data/legal.js';
	import { tria } from '#lib/stores/lang.svelte.js';
	import { iniciar, txt, ligam } from '#lib/edicion/edicion.svelte.js';
	import { editar } from '#lib/edicion/editar.svelte.js';
	import { segments } from '#lib/edicion/marcat.js';

	let { data } = $props();

	const lèvaEdicion = iniciar('confidencialitat', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let lang = $derived(langStore.current);

	// Contenu établi à partir de ce que le site collecte RÉELLEMENT :
	// table profiles, table lesson_progress, authentification Supabase et
	// stockage local. Rien n'est déclaré « au cas où ».
	const titre = { oc: 'Politica de confidencialitat', fr: 'Politique de confidentialité', es: 'Política de privacidad', en: 'Privacy policy', ca: 'Política de privadesa', ar: 'سياسة الخصوصية' };
	// Deux paragraphes gardent l'adresse de courriel en ligne : ils restent dans le code.
	const fixes = {
		oc: {
			responsable: "Lo responsable del tractament es {nom}, jonhible a {email}.",
			droits: "Pòdes a tot moment demandar de consultar tas donadas, las corregir, las escafar, las recuperar dins un format legible, o retirar ton consentiment a las respònsas facultativas. Escriu a {email} : la respònsa arriba jos un mes."
		},
		fr: {
			responsable: "Le responsable du traitement est {nom}, joignable à {email}.",
			droits: "Tu peux à tout moment demander à consulter tes données, les corriger, les effacer, les récupérer dans un format lisible, ou retirer ton consentement aux réponses facultatives. Écris à {email} : la réponse intervient sous un mois."
		},
		es: {
			responsable: "El responsable del tratamiento es {nom}, contactable en {email}.",
			droits: "Puedes solicitar en cualquier momento consultar tus datos, corregirlos, borrarlos, recuperarlos en un formato legible o retirar tu consentimiento a las respuestas opcionales. Escribe a {email}: la respuesta llega en el plazo de un mes."
		},
		en: {
			responsable: "The data controller is {nom}, who can be contacted at {email}.",
			droits: "You can at any time ask to see your data, correct it, erase it, retrieve it in a readable format, or withdraw your consent to the optional answers. Write to {email}: the reply comes within one month."
		},
		ca: {
			responsable: "El responsable del tractament és {nom}, que es pot contactar a {email}.",
			droits: "Pots en qualsevol moment demanar de consultar les teves dades, corregir-les, esborrar-les, recuperar-les en un format llegible o retirar el teu consentiment a les respostes opcionals. Escriu a {email}: la resposta arriba en el termini d’un mes."
		},
		ar: {
			responsable: "المسؤول عن معالجة البيانات هو {nom}، ويمكن التواصل معه على {email}.",
			droits: "يمكنك في أي وقت طلب الاطّلاع على بياناتك، أو تصحيحها، أو محوها، أو استرجاعها بصيغة مقروءة، أو سحب موافقتك على الإجابات الاختيارية. راسلنا على {email}، وسيصلك الرد في غضون شهر."
		}
	};
	const fx = $derived(fixes[lang] ?? fixes.oc);
	// espace avant les deux-points : seulement en occitan et en français
	let dp = $derived(lang === 'oc' || lang === 'fr' ? ' :' : ':');
	// « Union européenne » : legal.js ne la donne qu'en occitan et en français
	const regioUE = { es: 'Unión Europea', en: 'European Union', ca: 'Unió Europea', ar: 'الاتحاد الأوروبي' };

	function avecVars(s) {
		return s.replace('{nom}', editor.nom).replace('{email}', editor.email);
	}
</script>

<svelte:head>
	<title>{tria(titre)} · Lo Ligam</title>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
<!-- (un texte absent dans une langue montre l'occitan : repli de tria) -->
{#snippet t(clau)}{@const v = txt(clau)}<span lang={lang}>{@render marcat(tria(v))}</span>{/snippet}

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1 use:editar={'confidencialitat.titol'}>{@render t('confidencialitat.titol')}</h1>
		<p class="maj"><span use:editar={'confidencialitat.maj'}>{@render t('confidencialitat.maj')}</span>{dp} {dataMiseAJour}</p>
		<p class="intro" use:editar={'confidencialitat.intro'}>{@render t('confidencialitat.intro')}</p>

		<section>
			<h2 use:editar={'confidencialitat.responsable.titol'}>{@render t('confidencialitat.responsable.titol')}</h2>
			<p>{avecVars(fx.responsable)}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.collecte.titol'}>{@render t('confidencialitat.collecte.titol')}</h2>
			<dl>
				{#each [1, 2, 3, 4, 5, 6, 7] as n (n)}
					<dt use:editar={'confidencialitat.collecte.' + n + '.titol'}>{@render t('confidencialitat.collecte.' + n + '.titol')}</dt>
					<dd use:editar={'confidencialitat.collecte.' + n + '.detail'}>{@render t('confidencialitat.collecte.' + n + '.detail')}</dd>
				{/each}
			</dl>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.pourquoi.titol'}>{@render t('confidencialitat.pourquoi.titol')}</h2>
			<p use:editar={'confidencialitat.pourquoi.text'}>{@render t('confidencialitat.pourquoi.text')}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.age.titol'}>{@render t('confidencialitat.age.titol')}</h2>
			<p use:editar={'confidencialitat.age.text'}>{@render t('confidencialitat.age.text')}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.duree.titol'}>{@render t('confidencialitat.duree.titol')}</h2>
			<p use:editar={'confidencialitat.duree.text'}>{@render t('confidencialitat.duree.text')}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.qui.titol'}>{@render t('confidencialitat.qui.titol')}</h2>
			<p use:editar={'confidencialitat.qui.text'}>{@render t('confidencialitat.qui.text')}</p>
			<ul>
				<li>
					<strong>{baseDonnadas.nom}</strong> — <span use:editar={'confidencialitat.qui.basa'}>{@render t('confidencialitat.qui.basa')}</span>
					{#if baseDonnadas.region}({baseDonnadas.region[lang] ?? regioUE[lang] ?? baseDonnadas.region.fr}){/if}
					·
					<a href={baseDonnadas.site} target="_blank" rel="noopener noreferrer">{baseDonnadas.site}</a>
				</li>
				<li>
					<strong>{hebergeur.nom}</strong> — <span use:editar={'confidencialitat.qui.albergament'}>{@render t('confidencialitat.qui.albergament')}</span>
					{#if hebergeur.region}({hebergeur.region}){/if}
					·
					<a href={hebergeur.site} target="_blank" rel="noopener noreferrer">{hebergeur.site}</a>
				</li>
			</ul>
			{#if baseDonnadas.societatNonEuropea}
				<p class="nuanca" use:editar={'confidencialitat.qui.juridiccion'}>{@render t('confidencialitat.qui.juridiccion')}</p>
			{/if}
		</section>

		<section>
			<h2 use:editar={'confidencialitat.cookies.titol'}>{@render t('confidencialitat.cookies.titol')}</h2>
			<p use:editar={'confidencialitat.cookies.text'}>{@render t('confidencialitat.cookies.text')}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.tiers.titol'}>{@render t('confidencialitat.tiers.titol')}</h2>
			<p use:editar={'confidencialitat.tiers.text'}>{@render t('confidencialitat.tiers.text')}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.droits.titol'}>{@render t('confidencialitat.droits.titol')}</h2>
			<p>{avecVars(fx.droits)}</p>
		</section>

		<section>
			<h2 use:editar={'confidencialitat.cnil.titol'}>{@render t('confidencialitat.cnil.titol')}</h2>
			<p>
				<span use:editar={'confidencialitat.cnil.text'}>{@render t('confidencialitat.cnil.text')}</span>
				<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
			</p>
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
		margin: 0.4rem 0 1.25rem;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.intro {
		font-size: 1.02rem;
		line-height: 1.6;
		margin: 0 0 2rem;
		padding-left: 0.9rem;
		border-left: 3px solid var(--color-gold);
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

	dl {
		margin: 0;
	}

	dt {
		font-weight: 600;
		margin-top: 0.75rem;
	}

	dd {
		margin: 0.15rem 0 0;
		line-height: 1.6;
		opacity: 0.9;
	}

	ul {
		margin: 0.5rem 0 0;
		padding-left: 1.1rem;
		line-height: 1.7;
	}

	a {
		color: var(--color-teal);
	}

	/* Une nuance que la plupart des sites passent sous silence derrière un
	   « hébergé en Europe » : elle mérite d'être visible sans faire peur,
	   d'où le filet discret plutôt qu'un encadré d'avertissement. */
	.nuanca {
		margin-top: 0.9rem;
		padding-left: 0.8rem;
		border-left: 2px solid var(--color-teal);
		font-size: 0.95rem;
		opacity: 0.85;
	}
</style>
