<script>
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { editor, hebergeur, dataMiseAJour } from '$lib/data/legal';

	let lang = $derived(langStore.current);

	// Le texte de référence est le français : c'est la langue dans laquelle
	// la loi française exige ces informations. L'occitan est fourni à côté,
	// à valider par Romain avant publication.
	const t = {
		oc: {
			titre: 'Mencions legalas',
			maj: 'Darrièra mesa a jorn',
			editorT: 'Editor del site',
			directorT: 'Director de la publicacion',
			contactT: 'Contacte',
			hebergeurT: 'Albergador',
			proprietatT: 'Proprietat intellectuala',
			proprietat:
				'Los contenguts d’aqueste site (tèxtes, illustracions, fichas de vocabulari) son l’òbra de l’editor, levat mencion contrària. Tota reproduccion demanda son acòrd.',
			ligamsT: 'Ligams extèrnes',
			ligams:
				'Aqueste site mena cap a de sites tèrces (Lo Congrès, OPLO, CIRDOC e autres). Sèm pas responsables de lor contengut.',
			cartaT: 'Fons de carta',
			carta:
				'Lo fons de carta occitan ven d’OpenStreetMap e occitan, amb l’Institut d’Estudis Occitans. Las donadas cartograficas son jos licéncia ODbL.',
			tipoT: 'Tipografia',
			tipo: 'Lo site utiliza la poliça Luciole © Laurent Bourcellier e Jonathan Perez (CTRDV), jos licéncia CC BY 4.0.',
			donadasT: 'Donadas personalas',
			donadas: 'La gestion de tas donadas es detalhada sus la pagina dedicada :',
			donadasLink: 'Politica de confidencialitat'
		},
		fr: {
			titre: 'Mentions légales',
			maj: 'Dernière mise à jour',
			editorT: 'Éditeur du site',
			directorT: 'Directeur de la publication',
			contactT: 'Contact',
			hebergeurT: 'Hébergeur',
			proprietatT: 'Propriété intellectuelle',
			proprietat:
				'Les contenus de ce site (textes, illustrations, fiches de vocabulaire) sont l’œuvre de l’éditeur, sauf mention contraire. Toute reproduction nécessite son accord.',
			ligamsT: 'Liens externes',
			ligams:
				'Ce site renvoie vers des sites tiers (Lo Congrès, OPLO, CIRDOC et autres). Nous ne sommes pas responsables de leur contenu.',
			cartaT: 'Fond de carte',
			carta:
				'Le fond de carte occitan provient d’OpenStreetMap e occitan, avec l’Institut d’Études Occitanes. Les données cartographiques sont sous licence ODbL.',
			tipoT: 'Typographie',
			tipo: 'Le site utilise la police Luciole © Laurent Bourcellier et Jonathan Perez (CTRDV), sous licence CC BY 4.0.',
			donadasT: 'Données personnelles',
			donadas: 'La gestion de tes données est détaillée sur la page dédiée :',
			donadasLink: 'Politique de confidentialité'
		}
	};
	let tx = $derived(t[lang]);

	// Rend visible ce qui n'a pas encore été renseigné, plutôt que d'afficher
	// une mention légale trompeuse.
	function val(v) {
		return v?.startsWith('À_') ? null : v;
	}
</script>

<svelte:head>
	<title>{tx.titre} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page-bg" aria-hidden="true"></div>

<main class="screen">
	<AppHeader />

	<article class="doc">
		<h1>{tx.titre}</h1>
		<p class="maj">{tx.maj} : {dataMiseAJour}</p>

		<section>
			<h2>{tx.editorT}</h2>
			<p>
				{editor.nom}<br />
				{editor.statut}
				{#if val(editor.siret)}<br />SIRET : {editor.siret}{/if}
				{#if val(editor.registre)}<br />{editor.registre}{/if}
				{#if val(editor.tva)}<br />{editor.tva}{/if}
				{#if val(editor.adresse)}<br />{editor.adresse}{/if}
				{#if val(editor.telefòn)}<br />{editor.telefòn}{/if}
			</p>
		</section>

		<section>
			<h2>{tx.directorT}</h2>
			<p>{editor.directeurPublication}</p>
		</section>

		<section>
			<h2>{tx.contactT}</h2>
			<p><a href="mailto:{editor.email}">{editor.email}</a></p>
		</section>

		<section>
			<h2>{tx.hebergeurT}</h2>
			<p>
				{hebergeur.nom}<br />
				{hebergeur.adresse}<br />
				<a href={hebergeur.site} target="_blank" rel="noopener noreferrer">{hebergeur.site}</a>
			</p>
		</section>

		<section>
			<h2>{tx.proprietatT}</h2>
			<p>{tx.proprietat}</p>
		</section>

		<section>
			<h2>{tx.cartaT}</h2>
			<p>{tx.carta}</p>
		</section>

		<section>
			<h2>{tx.tipoT}</h2>
			<p>{tx.tipo}</p>
		</section>

		<section>
			<h2>{tx.ligamsT}</h2>
			<p>{tx.ligams}</p>
		</section>

		<section>
			<h2>{tx.donadasT}</h2>
			<p>{tx.donadas} <a href="/confidencialitat">{tx.donadasLink}</a></p>
		</section>
	</article>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
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

	a {
		color: var(--color-teal);
	}
</style>
