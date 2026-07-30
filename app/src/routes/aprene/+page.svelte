<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import HomeIcon from '$lib/components/HomeIcon.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session } from '$lib/authStore';

	// Structure en chapitres (contextes de vie) > modules (une compétence
	// précise chacun). Seul le module 1 a un contenu réel pour l'instant —
	// le reste est volontairement minimaliste tant que les leçons ne sont
	// pas écrites (cf. méthode-pedagogique.md).
	const chapters = [
		{
			oc: 'Las basas',
			fr: 'Les bases',
			modules: [
				{ oc: 'Se saludar', fr: 'Saluer', href: '/aprene/essai', status: 'available' },
				{ oc: 'Mercejar', fr: 'Remercier', status: 'locked' },
				{ oc: 'Se presentar', fr: 'Se présenter', status: 'locked' }
			]
		},
		{
			oc: 'A la botiga',
			fr: 'Au magasin',
			modules: [
				{ oc: 'Crompar', fr: 'Faire ses courses', status: 'locked' },
				{ oc: 'Los nombres', fr: 'Les nombres', status: 'locked' }
			]
		},
		{
			oc: 'A la bolangariá',
			fr: 'À la boulangerie',
			modules: [
				{ oc: 'Al forn', fr: 'À la boulangerie', status: 'locked' },
				{ oc: 'Demandar un servici', fr: 'Demander un service', status: 'locked' }
			]
		}
	];

	let moduleOneDone = $state(false);
	let pseudo = $state('');

	async function loadModuleOneStatus() {
		if ($session) {
			const [{ data: progress }, { data: profile }] = await Promise.all([
				supabase
					.from('lesson_progress')
					.select('completed_at')
					.eq('module_id', 'module-1')
					.maybeSingle(),
				supabase.from('profiles').select('pseudo').eq('user_id', $session.user.id).maybeSingle()
			]);
			moduleOneDone = !!progress?.completed_at;
			if (!profile) {
				goto('/compte/questionnaire');
				return;
			}
			pseudo = profile.pseudo;
			return;
		}
		if (!browser) return;
		try {
			moduleOneDone = localStorage.getItem('lo-ligam-module-1-done') === 'true';
		} catch (e) {
			/* stockage indisponible : on affiche simplement l'état par défaut */
		}
	}

	$effect(() => {
		$session;
		loadModuleOneStatus();
	});

	async function logout() {
		await supabase.auth.signOut();
	}

	let counter = 0;
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<header class="top">
		<a class="home-link" href="/" aria-label="Tornar a l'acuèlh">
			<HomeIcon size={22} />
		</a>
		<span class="brand-name">Lo Ligam</span>
		<span class="account-state">
			{#if $session}
				<span class="account-email">{pseudo || $session.user.email}</span>
				<button type="button" class="link-btn" onclick={logout}>Se desconnectar</button>
			{:else}
				<a class="link-btn" href="/compte">Se connectar</a>
			{/if}
		</span>
	</header>

	<div class="intro">
		<p class="kicker">Occitan · Lengadocian</p>
		<h1 class="title">Los moduls</h1>
		<p class="subtitle"><em>(Les modules)</em></p>
	</div>

	<div class="chapters">
		{#each chapters as chapter}
			<section class="chapter">
				<div class="chapter-head">
					<p class="chapter-oc">{chapter.oc}</p>
					<p class="chapter-fr"><em>({chapter.fr})</em></p>
				</div>
				<div class="modules">
					{#each chapter.modules as m}
						{@const num = ++counter}
						{#if m.status === 'available'}
							<a class="module-card available" href={m.href}>
								<span class="module-num">{num}</span>
								<span class="module-titles">
									<span class="module-oc">{m.oc}</span>
									<span class="module-fr"><em>({m.fr})</em></span>
								</span>
								<span class="module-status" aria-hidden="true">{moduleOneDone ? '✓' : '→'}</span>
							</a>
						{:else}
							<div class="module-card locked" aria-disabled="true">
								<span class="module-num">{num}</span>
								<span class="module-titles">
									<span class="module-oc">{m.oc}</span>
									<span class="module-fr"><em>({m.fr})</em></span>
								</span>
								<span class="module-status" aria-hidden="true">🔒</span>
							</div>
						{/if}
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<p class="account-note">
		🔒 Los moduls venents demandaràn un compte gratuit per contunhar e gardar ta progression.
		<br /><em
			>(Les prochains modules demanderont un compte gratuit pour continuer et garder ta
			progression.)</em
		>
	</p>
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
		gap: 1.75rem;
		padding: 1.5rem 1.5rem 4rem;
	}

	.top {
		width: 100%;
		max-width: 40rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.home-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		color: var(--color-brick);
		background: rgba(165, 52, 42, 0.1);
		text-decoration: none;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.home-link:hover {
		background: rgba(165, 52, 42, 0.18);
		transform: scale(1.06);
	}

	.brand-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-text);
	}

	.account-state {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.85rem;
	}

	.account-email {
		color: var(--color-teal);
		max-width: 10rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.link-btn {
		border: none;
		background: none;
		color: var(--color-brick);
		font-weight: 600;
		text-decoration: underline;
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0;
	}

	.intro {
		text-align: center;
		animation: fade-in 500ms ease-out;
	}

	.kicker {
		margin: 0 0 0.15rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-teal);
	}

	.title {
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 5vw, 2.9rem);
		font-weight: 700;
		color: var(--color-brick);
		margin: 0;
	}

	.subtitle {
		margin: 0.2rem 0 0;
		color: var(--color-teal);
		font-size: 1rem;
	}

	.chapters {
		width: 100%;
		max-width: 40rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.chapter {
		animation: fade-in 500ms ease-out;
	}

	.chapter-head {
		margin-bottom: 0.75rem;
	}

	.chapter-oc {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.5rem;
		color: var(--color-text);
	}

	.chapter-fr {
		margin: 0.1rem 0 0;
		font-size: 0.88rem;
		color: var(--color-teal);
	}

	.modules {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.module-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: white;
		border-radius: 18px;
		padding: 1rem 1.25rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
		text-decoration: none;
		color: inherit;
		transition:
			transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 180ms ease;
	}

	.module-card.available:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 26px rgba(58, 42, 32, 0.16);
	}

	.module-card.available:active {
		transform: translateY(-1px) scale(0.99);
	}

	.module-card.locked {
		background: rgba(255, 255, 255, 0.5);
		box-shadow: none;
		border: 1px dashed rgba(58, 42, 32, 0.15);
		cursor: not-allowed;
		opacity: 0.7;
	}

	.module-num {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		background: var(--color-gold);
		color: var(--color-text);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
	}

	.module-card.locked .module-num {
		background: rgba(58, 42, 32, 0.1);
		color: var(--color-text);
	}

	.module-titles {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.module-oc {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-text);
	}

	.module-fr {
		font-size: 0.82rem;
		color: var(--color-teal);
	}

	.module-card.locked .module-fr {
		color: rgba(58, 42, 32, 0.5);
	}

	.module-status {
		flex-shrink: 0;
		font-size: 1.1rem;
		color: var(--color-brick);
	}

	.account-note {
		max-width: 32rem;
		text-align: center;
		font-size: 0.85rem;
		color: rgba(58, 42, 32, 0.65);
		line-height: 1.5;
	}

	.account-note em {
		opacity: 0.85;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
