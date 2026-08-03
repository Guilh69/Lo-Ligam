<script>
	// Espace d'administration — pour l'instant, uniquement le contrôle de
	// sécurité. Les écrans de gestion des designs viendront s'ajouter ici une
	// fois que ce contrôle est au vert.
	//
	// À SAVOIR : cette page se cache d'elle-même si tu n'es pas administrateur,
	// mais ce n'est PAS ce qui protège le site — n'importe qui peut lire ce
	// fichier. Ce qui protège, ce sont les politiques RLS de la base, qui
	// refusent l'écriture quoi que fasse le navigateur. Cette page ne fait que
	// les mettre à l'épreuve dans les vraies conditions.
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let estat = $state('cargament'); // cargament | pas-connectat | pas-admin | admin
	let proves = $state([]);
	let testejant = $state(false);

	$effect(() => {
		if (!$authReady) return;
		if (!$session) {
			estat = 'pas-connectat';
			return;
		}
		supabase.rpc('is_admin').then(({ data }) => {
			estat = data === true ? 'admin' : 'pas-admin';
		});
	});

	function nòta(quò, capOk, detalh = '') {
		proves = [...proves, { quò, capOk, detalh }];
	}

	async function testejar() {
		testejant = true;
		proves = [];
		const id = `_ensag-${Date.now()}`;
		const camin = `_ensag/${id}.webp`;

		// 1. Écriture en base. On demande le retour des lignes touchées (.select())
		// pour ne pas se contenter de « pas d'erreur » : une politique manquante
		// laisse Postgres répondre « c'est bon » sans rien modifier.
		const apond = await supabase
			.from('temas')
			.insert({ id, oc: 'Ensag', fr: 'Essai', publicat: false })
			.select();
		nòta('Apondre un tèma', !apond.error && apond.data?.length === 1, apond.error?.message);

		const modif = await supabase
			.from('temas')
			.update({ fr: 'Essai modifié' })
			.eq('id', id)
			.select();
		nòta('Lo modificar', !modif.error && modif.data?.[0]?.fr === 'Essai modifié', modif.error?.message);

		const sup = await supabase.from('temas').delete().eq('id', id).select();
		nòta('Lo suprimir', !sup.error && sup.data?.length === 1, sup.error?.message);

		const demòra = await supabase.from('temas').select('id').eq('id', id);
		nòta('Demòra pas res', demòra.data?.length === 0);

		// 2. Dossier de fichiers.
		const mandat = await supabase.storage
			.from('designs')
			.upload(camin, new Blob([new Uint8Array([82, 73, 70, 70])], { type: 'image/webp' }), {
				contentType: 'image/webp'
			});
		nòta('Mandar un imatge', !mandat.error, mandat.error?.message);

		if (!mandat.error) {
			const levat = await supabase.storage.from('designs').remove([camin]);
			nòta("Levar l'imatge", !levat.error, levat.error?.message);
		}

		// 3. Ce qui doit rester interdit MÊME à l'administrateur : le SVG peut
		// porter du code exécutable et serait servi depuis un dossier public.
		const svg = await supabase.storage
			.from('designs')
			.upload(`_ensag/${id}.svg`, new Blob(['<svg onload="alert(1)"/>'], { type: 'image/svg+xml' }), {
				contentType: 'image/svg+xml'
			});
		nòta('Lo SVG demòra refusat, quitament per tu', !!svg.error);
		if (!svg.error) await supabase.storage.from('designs').remove([`_ensag/${id}.svg`]);

		testejant = false;
	}

	const totBon = $derived(proves.length > 0 && proves.every((p) => p.capOk));
</script>

<svelte:head>
	<title>Espaci d'administracion — Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	<section class="card">
		{#if estat === 'cargament'}
			<p class="subtitle">Un momenton…</p>
		{:else if estat === 'pas-connectat'}
			<h1>Espaci reservat</h1>
			<p class="subtitle"><em>(Espace réservé)</em></p>
			<a class="btn-primary" href="/compte">Se connectar <span class="arrow">→</span></a>
		{:else if estat === 'pas-admin'}
			<h1>Espaci reservat</h1>
			<p class="msg info">
				Ton compte a pas los dreches per aquesta pagina.
				<em>(Ton compte n'a pas les droits pour cette page.)</em>
			</p>
		{:else}
			<h1>Espaci d'administracion</h1>
			<p class="subtitle"><em>(Espace d'administration)</em></p>

			<p class="msg ok">
				Sès reconegut coma administrator. <em>(Tu es reconnu comme administrateur.)</em>
			</p>

			<h2>Contraròtle dels verrolhs</h2>
			<p class="ajuda">
				Ensaja d'escriure vertadièrament dins la basa e dins lo dorsièr dels fichièrs, puèi
				neteja darrièr el. Res es gardat.
				<em>(Essaie d'écrire pour de vrai dans la base et dans le dossier de fichiers, puis nettoie derrière lui. Rien n'est conservé.)</em>
			</p>

			<button type="button" class="btn-primary" onclick={testejar} disabled={testejant}>
				{testejant ? '…' : 'Testar l’escritura'}
			</button>

			{#if proves.length}
				<ul class="proves" aria-live="polite">
					{#each proves as p (p.quò)}
						<li class:fracas={!p.capOk}>
							<span class="marca" aria-hidden="true">{p.capOk ? '✓' : '✗'}</span>
							<span>
								{p.quò}
								{#if p.detalh}<em class="detalh">{p.detalh}</em>{/if}
							</span>
						</li>
					{/each}
				</ul>

				{#if !testejant}
					<p class="msg" class:ok={totBon} class:error={!totBon} role="status">
						{#if totBon}
							Tot es al verd. <em>(Tout est au vert.)</em>
						{:else}
							Quicòm truca — mòstra aquò a Claude.
							<em>(Quelque chose cloche — montre ça à Claude.)</em>
						{/if}
					</p>
				{/if}
			{/if}
		{/if}
	</section>
</main>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 1.5rem;
	}

	.card {
		width: 100%;
		max-width: 30rem;
		background: white;
		border-radius: 24px;
		padding: 2rem 2.25rem;
		box-shadow: 0 16px 36px rgba(58, 42, 32, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		animation: card-in 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
		margin-top: 2rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		color: var(--color-text);
	}

	h2 {
		margin: 0.5rem 0 0;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		color: var(--color-text);
	}

	.subtitle {
		margin: -0.7rem 0 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.ajuda {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-text);
	}

	.ajuda em,
	.msg em {
		color: var(--color-teal);
		font-size: 0.95em;
	}

	.msg {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.45;
		padding: 0.6rem 0.8rem;
		border-radius: 10px;
	}

	.msg.ok {
		background: rgba(107, 124, 50, 0.12);
		color: var(--color-olive);
	}

	.msg.error {
		background: rgba(165, 52, 42, 0.1);
		color: var(--color-brick);
	}

	.msg.info {
		background: rgba(31, 95, 99, 0.1);
		color: var(--color-teal);
	}

	.proves {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	.proves li {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		color: var(--color-olive);
	}

	.proves li.fracas {
		color: var(--color-brick);
		font-weight: 600;
	}

	.marca {
		font-weight: 700;
	}

	.detalh {
		display: block;
		font-size: 0.8rem;
		opacity: 0.8;
		font-weight: 400;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--color-gold);
		color: var(--color-text);
		border: none;
		padding: 0.9rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		cursor: pointer;
		text-decoration: none;
		transition:
			transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms ease,
			filter 80ms ease;
		box-shadow: 0 6px 18px rgba(224, 164, 59, 0.45);
	}

	.btn-primary .arrow {
		display: inline-block;
		margin-left: 0.3rem;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 10px 24px rgba(224, 164, 59, 0.55);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0) scale(0.97);
		filter: brightness(0.95);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: default;
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			animation: none;
		}

		.btn-primary {
			transition: none;
		}
	}
</style>
