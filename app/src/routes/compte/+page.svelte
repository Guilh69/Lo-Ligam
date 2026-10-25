<script>
	// Le compte (refait le 2026-10-25, cahier §11) : une seule adresse pour
	// tout. Sans session : se connecter, créer un compte, ou recevoir un lien
	// quand on a oublié son mot de passe. Avec une session : « Mon compte »
	// (ses pages, changer de mot de passe, se déconnecter, supprimer son compte,
	// supabase-compte.sql). Textes dans la langue choisie, au style du site.
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady, pseudoCompte, cargarPseudo } from '$lib/authStore';
	import { esAdmin } from '$lib/adminStore';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { DOBÈRTS } from '$lib/grops/grops.svelte.js';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Avatar from '$lib/grops/Avatar.svelte';
	import Icona from '$lib/components/Icona.svelte';

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			login: 'Se connectar',
			signup: 'Crear un compte',
			oblit: 'Mot de pas oblidat',
			frasa_signup: 'Es gratuit, e garda ta progression.',
			frasa_oblit: 'Escriu ton adreça : te mandarem un ligam per causir un mot de pas nòu.',
			email: 'Adreça de corrièl',
			mdp: 'Mot de pas',
			mdp_nòu: 'Mot de pas nòu',
			mdp_actual: 'Mot de pas actual',
			mdp_ajuda: '10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl',
			far_login: 'Se connectar',
			far_signup: 'Crear mon compte',
			far_oblit: 'Recebre un ligam',
			vers_oblit: 'Mot de pas oblidat ?',
			vers_signup: 'Pas encara de compte ?',
			vers_login: 'Ja un compte ?',
			tornar_login: 'Tornar a la connexion',
			confidencialitat: 'Çò que fasèm de tas donadas',
			mandat_signup: 'Te mandèrem un corrièl : clica sul ligam per confirmar ton adreça, puèi tornaràs aicí.',
			mandat_oblit: 'Se aquesta adreça a un compte, te mandèrem un ligam. Agacha tanben dins los indesirables.',
			// connecté
			compte: 'Mon compte',
			pseudonim: 'Causís ton pseudonim per acabar ton compte.',
			acabar: 'Acabar mon compte',
			mas_paginas: 'Mas paginas',
			moduls: 'Mos moduls',
			perfil: 'Mon perfil d’Amassa',
			cambiar_mdp: 'Cambiar de mot de pas',
			cambiar: 'Cambiar',
			mdp_cambiat: 'Mot de pas cambiat.',
			desconnectar: 'Se desconnectar',
			suprimir_titol: 'Suprimir mon compte',
			suprimir_frasa: 'Tot s’escafa : ton perfil, ta progression, tos messatges e tos contactes. Se pòt pas desfar.',
			suprimir: 'Suprimir mon compte',
			suprimir_segur: 'Segur ? Tot serà escafat sul pic.',
			òc_suprimir: 'Òc, suprimir',
			non: 'Non',
			// erreurs
			camps: 'Cal una adreça e un mot de pas.',
			cort: 'Lo mot de pas deu aver 10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl.',
			mdp_marrit: 'Lo mot de pas actual es pas bon.',
			ja: 'Aquesta adreça a ja un compte : connecta-te.',
			incorrècte: 'Adreça o mot de pas incorrècte.',
			pas_confirmat: 'Confirma d’en primièr ton adreça : lo ligam es dins ton corrièl.',
			tròp: 'Tròp d’ensages : espèra un pauc abans de tornar ensajar.',
			parièr: 'Lo mot de pas nòu deu èsser diferent de l’ancian.',
			compte_admin: 'Un compte d’administracion se suprimís pas d’aicí.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			login: 'Se connecter',
			signup: 'Créer un compte',
			oblit: 'Mot de passe oublié',
			frasa_signup: 'C’est gratuit, et ça garde ta progression.',
			frasa_oblit: 'Écris ton adresse : nous t’enverrons un lien pour choisir un nouveau mot de passe.',
			email: 'Adresse e-mail',
			mdp: 'Mot de passe',
			mdp_nòu: 'Nouveau mot de passe',
			mdp_actual: 'Mot de passe actuel',
			mdp_ajuda: '10 caractères au moins, avec minuscule, majuscule, chiffre et symbole',
			far_login: 'Se connecter',
			far_signup: 'Créer mon compte',
			far_oblit: 'Recevoir un lien',
			vers_oblit: 'Mot de passe oublié ?',
			vers_signup: 'Pas encore de compte ?',
			vers_login: 'Déjà un compte ?',
			tornar_login: 'Retour à la connexion',
			confidencialitat: 'Ce que nous faisons de tes données',
			mandat_signup: 'Nous t’avons envoyé un e-mail : clique sur le lien pour confirmer ton adresse, puis tu reviendras ici.',
			mandat_oblit: 'Si cette adresse a un compte, nous t’avons envoyé un lien. Regarde aussi dans les indésirables.',
			compte: 'Mon compte',
			pseudonim: 'Choisis ton pseudo pour terminer ton compte.',
			acabar: 'Terminer mon compte',
			mas_paginas: 'Mes pages',
			moduls: 'Mes modules',
			perfil: 'Mon profil d’Amassa',
			cambiar_mdp: 'Changer de mot de passe',
			cambiar: 'Changer',
			mdp_cambiat: 'Mot de passe changé.',
			desconnectar: 'Se déconnecter',
			suprimir_titol: 'Supprimer mon compte',
			suprimir_frasa: 'Tout s’efface : ton profil, ta progression, tes messages et tes contacts. C’est définitif.',
			suprimir: 'Supprimer mon compte',
			suprimir_segur: 'Sûr ? Tout sera effacé tout de suite.',
			òc_suprimir: 'Oui, supprimer',
			non: 'Non',
			camps: 'Il faut une adresse et un mot de passe.',
			cort: 'Le mot de passe doit avoir 10 caractères au moins, avec minuscule, majuscule, chiffre et symbole.',
			mdp_marrit: 'Le mot de passe actuel est incorrect.',
			ja: 'Cette adresse a déjà un compte : connecte-toi.',
			incorrècte: 'Adresse ou mot de passe incorrect.',
			pas_confirmat: 'Confirme d’abord ton adresse : le lien est dans ton e-mail.',
			tròp: 'Trop d’essais : attends un peu avant de réessayer.',
			parièr: 'Le nouveau mot de passe doit être différent de l’ancien.',
			compte_admin: 'Un compte d’administration ne se supprime pas d’ici.',
			error: 'Une erreur : réessaie.'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	// en développement, « ?simular » montre « Mon compte » sans session
	const simular = browser && import.meta.env.DEV && page.url.searchParams.has('simular');
	let sesilha = $derived($session ?? (simular ? { user: { id: 's1', email: 'joana@exemple.org' } } : null));
	let pseudo = $derived($session ? $pseudoCompte : simular ? 'Joana' : undefined);

	const MODES = ['login', 'signup', 'oblit'];
	let mode = $state(MODES.includes(page.url.searchParams.get('mode')) ? page.url.searchParams.get('mode') : 'login');
	let email = $state('');
	let mdp = $state('');
	let ocupat = $state(false);
	let error = $state(null);
	let mandat = $state(null); // 'signup' ou 'oblit' : le courriel est parti

	function cambiarMode(m) {
		mode = m;
		error = null;
		mandat = null;
	}

	// les messages de Supabase, ramenés à nos clés
	function clau(e) {
		const m = e?.message ?? '';
		if (/already registered|already exists/i.test(m)) return 'ja';
		if (/invalid login credentials/i.test(m)) return 'incorrècte';
		if (/not confirmed/i.test(m)) return 'pas_confirmat';
		if (/rate limit|security purposes|too many/i.test(m)) return 'tròp';
		if (/should be different/i.test(m)) return 'parièr';
		if (/password/i.test(m) && /least|short|weak/i.test(m)) return 'cort';
		if (/current password|reauthentication|not match/i.test(m)) return 'mdp_marrit';
		if (m === 'compte_admin') return 'compte_admin';
		return 'error';
	}

	// après la connexion : la page d'où l'on venait (chemin interne seulement),
	// sinon on reste ici, sur « Mon compte »
	function tornar() {
		const t = page.url.searchParams.get('tornar');
		if (!t || !t.startsWith('/') || t.startsWith('//') || t.includes('\\') || t.startsWith('/compte')) return;
		try {
			if (new URL(t, location.origin).origin === location.origin) goto(t);
		} catch {
			/* adresse invalide : on ignore */
		}
	}

	async function mandar(e) {
		e.preventDefault();
		error = null;
		mandat = null;
		if (!email.trim() || (mode !== 'oblit' && !mdp)) return (error = 'camps');
		if (mode === 'signup' && mdp.length < 10) return (error = 'cort');
		ocupat = true;
		if (mode === 'login') {
			const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: mdp });
			if (err) error = clau(err);
			else tornar();
		} else if (mode === 'signup') {
			const { data, error: err } = await supabase.auth.signUp({
				email: email.trim(),
				password: mdp,
				options: { emailRedirectTo: location.origin + '/compte' }
			});
			if (err) error = clau(err);
			else if (!data.session) mandat = 'signup';
			else tornar();
		} else {
			const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
				redirectTo: location.origin + '/compte/mot-de-pas'
			});
			if (err) error = clau(err);
			else mandat = 'oblit';
		}
		ocupat = false;
	}

	// ── connecté ──
	// le pseudo a pu être choisi entre-temps (questionnaire, profil d'Amassa)
	$effect(() => {
		if ($session) cargarPseudo($session);
	});
	let mdpActual = $state('');
	let mdpNòu = $state('');
	let mdpMessatge = $state(null); // 'mdp_cambiat' ou une clé d'erreur
	async function cambiarMdp(e) {
		e.preventDefault();
		mdpMessatge = null;
		if (mdpNòu.length < 10) return (mdpMessatge = 'cort');
		ocupat = true;
		// l'ancien mot de passe est envoyé et vérifié par le serveur (réglage
		// « Require current password when updating ») : une session volée ne peut
		// pas changer le mot de passe sans le connaître.
		const { error: err } = await supabase.auth.updateUser({
			password: mdpNòu,
			current_password: mdpActual
		});
		// après un changement réussi, on déconnecte les autres appareils
		if (!err) await supabase.auth.signOut({ scope: 'others' });
		ocupat = false;
		mdpMessatge = err ? clau(err) : 'mdp_cambiat';
		if (!err) {
			mdpActual = '';
			mdpNòu = '';
		}
	}

	async function desconnectar() {
		await supabase.auth.signOut();
		goto('/');
	}

	let suprimirSegur = $state(false);
	let suprimirMdp = $state('');
	let suprimirError = $state(null);
	async function suprimir() {
		ocupat = true;
		suprimirError = null;
		// acte irréversible : on redemande le mot de passe avant d'effacer
		const { error: errAuth } = await supabase.auth.signInWithPassword({
			email: $session.user.email,
			password: suprimirMdp
		});
		if (errAuth) {
			suprimirError = 'incorrècte';
			ocupat = false;
			return;
		}
		const { error: err } = await supabase.rpc('suprimir_mon_compte');
		if (err) {
			suprimirError = clau(err);
			ocupat = false;
			return;
		}
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<svelte:head>
	<title>{sesilha ? x.compte : x[mode]} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="compte">
		{#if !$authReady}
			<p class="nota">…</p>
		{:else if !sesilha}
			<h1>{x[mode]}</h1>
			{#if mode === 'signup'}<p class="frasa">{x.frasa_signup}</p>{/if}
			{#if mode === 'oblit'}<p class="frasa">{x.frasa_oblit}</p>{/if}

			{#if mandat}
				<p class="mandat" role="status"><Icona nom="valide" size="1.2em" /> {x['mandat_' + mandat]}</p>
				<button type="button" class="ligam" onclick={() => cambiarMode('login')}>{x.tornar_login}</button>
			{:else}
				<form class="boita" onsubmit={mandar}>
					<label class="camp">
						<span>{x.email}</span>
						<input type="email" bind:value={email} autocomplete="email" required />
					</label>
					{#if mode !== 'oblit'}
						<label class="camp">
							<span>{x.mdp}</span>
							<input
								type="password"
								bind:value={mdp}
								autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
								minlength={mode === 'signup' ? 8 : undefined}
								aria-describedby={mode === 'signup' ? 'mdp-ajuda' : undefined}
								required
							/>
							{#if mode === 'signup'}<small id="mdp-ajuda">{x.mdp_ajuda}</small>{/if}
						</label>
					{/if}
					{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
					<button type="submit" class="boton" disabled={ocupat}>{ocupat ? '…' : x['far_' + mode]}</button>
					{#if mode === 'login'}
						<button type="button" class="ligam" onclick={() => cambiarMode('oblit')}>{x.vers_oblit}</button>
					{/if}
				</form>

				<p class="autre">
					{#if mode === 'login'}
						{x.vers_signup} <button type="button" class="ligam fòrt" onclick={() => cambiarMode('signup')}>{x.signup}</button>
					{:else if mode === 'signup'}
						{x.vers_login} <button type="button" class="ligam fòrt" onclick={() => cambiarMode('login')}>{x.login}</button>
					{:else}
						<button type="button" class="ligam fòrt" onclick={() => cambiarMode('login')}>{x.tornar_login}</button>
					{/if}
				</p>
				{#if mode === 'signup'}<p class="autre"><a href="/confidencialitat">{x.confidencialitat}</a></p>{/if}
			{/if}
		{:else}
			<header class="qui">
				<Avatar pseudo={pseudo ?? sesilha.user.email ?? '?'} id={sesilha.user.id} size="3.5rem" />
				<div>
					<h1>{pseudo ?? x.compte}</h1>
					<p class="adreca">{sesilha.user.email}</p>
				</div>
			</header>

			{#if pseudo === null}
				<div class="boita acabar">
					<p>{x.pseudonim}</p>
					<a class="boton" href="/compte/questionnaire">{x.acabar}</a>
				</div>
			{/if}

			<section class="seccion" aria-labelledby="compte-paginas">
				<h2 id="compte-paginas">{x.mas_paginas}</h2>
				<ul class="paginas">
					<li><a href="/aprene"><span>{x.moduls}</span><Icona nom="suivant" /></a></li>
					{#if DOBÈRTS || $esAdmin}
						<li><a href="/grops/perfil"><span>{x.perfil}</span><Icona nom="suivant" /></a></li>
					{/if}
				</ul>
			</section>

			<section class="seccion" aria-labelledby="compte-mdp">
				<h2 id="compte-mdp">{x.cambiar_mdp}</h2>
				<form class="boita" onsubmit={cambiarMdp}>
					<!-- l'adresse, cachée, aide les gestionnaires de mots de passe -->
					<input type="email" class="vist" value={sesilha.user.email} autocomplete="username" readonly tabindex="-1" aria-hidden="true" />
					<label class="camp">
						<span>{x.mdp_actual}</span>
						<input type="password" bind:value={mdpActual} autocomplete="current-password" required />
					</label>
					<label class="camp">
						<span>{x.mdp_nòu}</span>
						<input type="password" bind:value={mdpNòu} autocomplete="new-password" minlength="10" aria-describedby="mdp-nòu-ajuda" required />
						<small id="mdp-nòu-ajuda">{x.mdp_ajuda}</small>
					</label>
					<button type="submit" class="boton segond" disabled={ocupat}>{x.cambiar}</button>
				</form>
				{#if mdpMessatge}
					<p class={mdpMessatge === 'mdp_cambiat' ? 'mandat' : 'error'} role="status">{x[mdpMessatge]}</p>
				{/if}
			</section>

			<section class="seccion">
				<button type="button" class="boton segond" onclick={desconnectar}>{x.desconnectar}</button>
			</section>

			<section class="seccion perilh" aria-labelledby="compte-suprimir">
				<h2 id="compte-suprimir">{x.suprimir_titol}</h2>
				<p>{x.suprimir_frasa}</p>
				{#if suprimirSegur}
					<p class="segur" role="alert">{x.suprimir_segur}</p>
					<form class="boita" onsubmit={(e) => { e.preventDefault(); suprimir(); }}>
						<input type="email" class="vist" value={sesilha.user.email} autocomplete="username" readonly tabindex="-1" aria-hidden="true" />
						<label class="camp">
							<span>{x.mdp}</span>
							<input type="password" bind:value={suprimirMdp} autocomplete="current-password" required />
						</label>
						<div class="botons">
							<button type="submit" class="boton" disabled={ocupat}>{x.òc_suprimir}</button>
							<button type="button" class="boton segond" onclick={() => (suprimirSegur = false)}>{x.non}</button>
						</div>
					</form>
				{:else}
					<button type="button" class="ligam" onclick={() => (suprimirSegur = true)}>{x.suprimir}</button>
				{/if}
				{#if suprimirError}<p class="error" role="alert">{x[suprimirError]}</p>{/if}
			</section>
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
		container-type: inline-size;
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
		overflow-wrap: anywhere;
	}
	.frasa {
		margin: calc(-1 * var(--esp-8)) 0 0;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.nota {
		margin: 0;
		color: var(--t-tinta-2);
	}

	/* Le formulaire : un panneau translucide, les champs en colonne */
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
	/* ce qui se clique : le rouge du logo en aplat (règle B) */
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
	.boton.segond {
		background: transparent;
		color: var(--t-tinta);
		box-shadow: inset 0 0 0 1px var(--t-linha);
	}
	.boton.segond:hover {
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}
	/* les liens secondaires : soulignés, en retrait */
	.ligam {
		justify-self: start;
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.ligam:hover {
		color: var(--t-tinta);
	}
	.ligam.fòrt {
		min-height: 0;
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
	}
	.autre {
		margin: 0;
		color: var(--t-tinta-2);
	}
	.autre a {
		color: var(--t-tinta-2);
	}
	.error,
	.mandat,
	.segur {
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

	/* Connecté : l'initiale, le pseudo, l'adresse */
	.qui {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	.adreca {
		margin: var(--esp-4) 0 0;
		color: var(--t-tinta-2);
		overflow-wrap: anywhere;
	}
	.acabar p {
		margin: 0;
		line-height: 1.5;
	}
	.seccion {
		display: grid;
		gap: var(--esp-12);
		padding-top: var(--esp-24);
		border-top: 1px solid var(--t-linha);
	}
	.seccion p {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.paginas {
		display: grid;
		gap: var(--esp-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.paginas a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 48px;
		padding: 0.5rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		color: inherit;
		font-weight: 700;
		text-decoration: none;
	}
	.paginas a:hover {
		border-color: var(--t-aur);
	}
	.linha {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: start;
		gap: var(--esp-12);
	}
	.linha .boton {
		margin-top: calc(1.4em + var(--esp-8));
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	input:focus-visible,
	.boton:focus-visible,
	.ligam:focus-visible,
	.paginas a:focus-visible,
	.autre a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	@container (width < 26rem) {
		.linha {
			grid-template-columns: 1fr;
		}
		.linha .boton {
			margin-top: 0;
		}
	}
</style>
