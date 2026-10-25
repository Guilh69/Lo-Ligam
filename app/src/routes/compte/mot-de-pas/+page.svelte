<script>
	// Choisir un nouveau mot de passe (2026-10-25) : on arrive ici par le lien
	// du courriel « mot de passe oublié » (resetPasswordForEmail, page /compte).
	// Le lien ouvre une session ; sans elle, le lien a expiré ou déjà servi.
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Icona from '$lib/components/Icona.svelte';

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			titol: 'Mot de pas nòu',
			frasa: 'Causís un mot de pas nòu per ton compte.',
			mdp: 'Mot de pas nòu',
			ajuda: '10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl',
			gardar: 'Gardar',
			fach: 'Mot de pas cambiat : ta session es dobèrta.',
			compte: 'Anar a mon compte',
			expirat: 'Aqueste ligam es pas mai valid : demanda-ne un autre.',
			autre: 'Recebre un ligam nòu',
			cort: 'Lo mot de pas deu aver 10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl.',
			parièr: 'Lo mot de pas nòu deu èsser diferent de l’ancian.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			titol: 'Nouveau mot de passe',
			frasa: 'Choisis un nouveau mot de passe pour ton compte.',
			mdp: 'Nouveau mot de passe',
			ajuda: '10 caractères au moins, avec minuscule, majuscule, chiffre et symbole',
			gardar: 'Enregistrer',
			fach: 'Mot de passe changé : ta session est ouverte.',
			compte: 'Aller à mon compte',
			expirat: 'Ce lien n’est plus valable : demandes-en un autre.',
			autre: 'Recevoir un nouveau lien',
			cort: 'Le mot de passe doit avoir 10 caractères au moins, avec minuscule, majuscule, chiffre et symbole.',
			parièr: 'Le nouveau mot de passe doit être différent de l’ancien.',
			error: 'Une erreur : réessaie.'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let mdp = $state('');
	let ocupat = $state(false);
	let error = $state(null);
	let fach = $state(false);

	async function gardar(e) {
		e.preventDefault();
		error = null;
		if (mdp.length < 10) return (error = 'cort');
		ocupat = true;
		const { error: err } = await supabase.auth.updateUser({ password: mdp });
		ocupat = false;
		if (err)
			error = /should be different/i.test(err.message)
				? 'parièr'
				: /least|short|weak/i.test(err.message)
					? 'cort'
					: 'error';
		else fach = true;
	}
</script>

<svelte:head>
	<title>{x.titol} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="compte">
		<h1>{x.titol}</h1>
		{#if !$authReady}
			<p class="nota">…</p>
		{:else if fach}
			<p class="mandat" role="status"><Icona nom="valide" size="1.2em" /> {x.fach}</p>
			<a class="boton" href="/compte">{x.compte}</a>
		{:else if !$session}
			<p class="error" role="alert">{x.expirat}</p>
			<a class="boton" href="/compte?mode=oblit">{x.autre}</a>
		{:else}
			<p class="frasa">{x.frasa}</p>
			<form class="boita" onsubmit={gardar}>
				<input type="email" class="vist" value={$session.user.email} autocomplete="username" readonly tabindex="-1" aria-hidden="true" />
				<label class="camp">
					<span>{x.mdp}</span>
					<input type="password" bind:value={mdp} autocomplete="new-password" minlength="10" aria-describedby="mdp-ajuda" required />
					<small id="mdp-ajuda">{x.ajuda}</small>
				</label>
				{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
				<button type="submit" class="boton" disabled={ocupat}>{ocupat ? '…' : x.gardar}</button>
			</form>
		{/if}
	</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.compte {
		display: grid;
		gap: var(--esp-24);
		max-width: calc(30rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7vw, 3.6rem);
		line-height: 1;
	}
	.frasa,
	.nota {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.boita {
		display: grid;
		gap: var(--esp-16);
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: color-mix(in srgb, var(--t-fons-2) 82%, transparent);
	}
	.camp {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	.camp small {
		font-weight: 400;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	input {
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
	}
	.boton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		justify-self: start;
		min-height: 44px;
		padding: 0.6rem 1.4rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.25s;
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.error,
	.mandat {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		line-height: 1.5;
		font-weight: 700;
	}
	.mandat {
		display: flex;
		gap: var(--esp-8);
		align-items: baseline;
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	input:focus-visible,
	.boton:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
