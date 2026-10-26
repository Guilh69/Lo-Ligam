<script>
	// Page d'erreur du site (audit du 2026-10-08 : une adresse inconnue
	// montrait la page par défaut de SvelteKit, en anglais et sans mise en
	// page). Bilingue comme le reste ; occitan à valider par Romain.
	import { page } from '$app/state';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let lang = $derived(langStore.current);
	let introbable = $derived(page.status === 404);

	const t = {
		oc: {
			titre404: 'Aquesta pagina existís pas',
			titre: 'Quicòm a fach mancança',
			text404: 'L’adreça es benlèu mal escricha, o la pagina es estada desplaçada.',
			text: 'Una error es arribada de nòstre costat. Torna ensajar d’aquí un moment.',
			acuelh: 'Tornar a l’acuèlh',
			aprene: 'Aprene l’occitan',
			carta: 'Veire la carta'
		},
		fr: {
			titre404: 'Cette page n’existe pas',
			titre: 'Quelque chose a manqué',
			text404: 'L’adresse est peut-être mal écrite, ou la page a été déplacée.',
			text: 'Une erreur s’est produite de notre côté. Réessaie dans un moment.',
			acuelh: 'Retour à l’accueil',
			aprene: 'Apprendre l’occitan',
			carta: 'Voir la carte'
		},
		es: {
			titre404: 'Esta página no existe',
			titre: 'Algo ha fallado',
			text404: 'Puede que la dirección esté mal escrita o que la página se haya movido.',
			text: 'Ha ocurrido un error por nuestra parte. Vuelve a intentarlo dentro de un momento.',
			acuelh: 'Volver al inicio',
			aprene: 'Aprender occitano',
			carta: 'Ver el mapa'
		},
		en: {
			titre404: 'This page doesn’t exist',
			titre: 'Something went wrong',
			text404: 'The address may be mistyped, or the page may have been moved.',
			text: 'An error occurred on our side. Please try again in a moment.',
			acuelh: 'Back to home',
			aprene: 'Learn Occitan',
			carta: 'See the map'
		},
		ca: {
			titre404: 'Aquesta pàgina no existeix',
			titre: 'Alguna cosa ha fallat',
			text404: 'Potser l’adreça està mal escrita o la pàgina s’ha mogut.',
			text: 'Hi ha hagut un error pel nostre cantó. Torna-ho a provar d’aquí a un moment.',
			acuelh: 'Tornar a l’inici',
			aprene: 'Aprendre occità',
			carta: 'Veure el mapa'
		}
	};
	let tx = $derived(t[lang] ?? t.oc);
</script>

<svelte:head>
	<title>{introbable ? tx.titre404 : tx.titre} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="screen">
	<AppHeader />

	<main class="error">
		<p class="code" aria-hidden="true">{page.status}</p>
		<h1>{introbable ? tx.titre404 : tx.titre}</h1>
		<p class="text">{introbable ? tx.text404 : tx.text}</p>
		<nav class="ligams">
			<a href="/">{tx.acuelh}</a>
			<a href="/aprene">{tx.aprene}</a>
			<a href="/carta">{tx.carta}</a>
		</nav>
	</main>
</div>

<style>
	.screen {
		min-height: 100dvh;
		padding: 1.3rem clamp(1rem, 4vw, 3.4rem) 4rem;
		background: var(--t-fons);
		color: var(--t-tinta);
	}

	.error {
		max-width: 36rem;
		margin: clamp(3rem, 12vh, 8rem) auto 0;
		text-align: center;
	}

	.code {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(4rem, 14vw, 7rem);
		line-height: 1;
		color: var(--t-aur);
		opacity: 0.85;
	}

	h1 {
		margin: 0.6rem 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.6rem, 4vw, 2.2rem);
		line-height: 1.15;
	}

	.text {
		margin: 0 auto 2rem;
		max-width: 28rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}

	.ligams {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.8rem 1.6rem;
	}

	.ligams a {
		color: var(--t-tinta);
		text-decoration: underline;
		text-decoration-color: var(--t-accion); text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}

	.ligams a:hover {
		text-decoration-thickness: 3px;
	}

	.ligams a:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
