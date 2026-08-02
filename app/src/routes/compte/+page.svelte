<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { session } from '$lib/authStore';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let mode = $state(page.url.searchParams.get('mode') === 'signup' ? 'signup' : 'login');
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMsg = $state('');
	let infoMsg = $state('');

	async function routeAfterAuth() {
		if (!$session) return;
		const { data } = await supabase
			.from('profiles')
			.select('user_id')
			.eq('user_id', $session.user.id)
			.maybeSingle();
		goto(data ? '/aprene' : '/compte/questionnaire');
	}

	$effect(() => {
		$session;
		routeAfterAuth();
	});

	async function submit() {
		errorMsg = '';
		infoMsg = '';
		if (!email || !password) {
			errorMsg = 'Cal indicar un corrièl e un mot de pas.';
			return;
		}
		loading = true;
		if (mode === 'signup') {
			const { data, error } = await supabase.auth.signUp({ email, password });
			loading = false;
			if (error) {
				errorMsg = translateError(error.message);
			} else if (!data.session) {
				infoMsg =
					'Verifica ta bóstia de mail per confirmar ton compte, puèi torna-te connectar. (Vérifie ta boîte mail pour confirmer ton compte, puis reviens te connecter.)';
			}
		} else {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			loading = false;
			if (error) errorMsg = translateError(error.message);
		}
	}

	function translateError(msg) {
		if (/already registered|already exists/i.test(msg))
			return 'Aqueste corrièl a ja un compte. Ensaja de te connectar. (Cet e-mail a déjà un compte, essaie de te connecter.)';
		if (/invalid login credentials/i.test(msg))
			return 'Corrièl o mot de pas incorrècte. (E-mail ou mot de passe incorrect.)';
		if (/password.*(least|6)/i.test(msg))
			return 'Lo mot de pas deu aver almens 6 caractèrs. (Le mot de passe doit avoir au moins 6 caractères.)';
		return msg;
	}
</script>

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen">
	<AppHeader />

	<section class="card">
		<div class="tabs" role="tablist">
			<button
				type="button"
				role="tab"
				class:active={mode === 'login'}
				onclick={() => (mode = 'login')}
			>
				Se connectar
			</button>
			<button
				type="button"
				role="tab"
				class:active={mode === 'signup'}
				onclick={() => (mode = 'signup')}
			>
				S'inscriure
			</button>
		</div>

		<p class="subtitle">
			{#if mode === 'login'}
				<em>(Se connecter)</em>
			{:else}
				<em>(S'inscrire — gratuit, pour garder ta progression)</em>
			{/if}
		</p>

		<form onsubmit={(e) => (e.preventDefault(), submit())}>
			<label>
				Corrièl <em>(e-mail)</em>
				<input type="email" bind:value={email} autocomplete="email" required />
			</label>
			<label>
				Mot de pas <em>(mot de passe)</em>
				<input type="password" bind:value={password} autocomplete="current-password" required />
			</label>

			{#if errorMsg}<p class="msg error">{errorMsg}</p>{/if}
			{#if infoMsg}<p class="msg info">{infoMsg}</p>{/if}

			<button type="submit" class="btn-primary" disabled={loading}>
				{#if loading}
					…
				{:else if mode === 'login'}
					Se connectar <span class="arrow">→</span>
				{:else}
					Crear mon compte <span class="arrow">→</span>
				{/if}
			</button>
		</form>
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
		max-width: 24rem;
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

	.tabs {
		display: flex;
		gap: 0.35rem;
		background: var(--color-cream);
		padding: 0.3rem;
		border-radius: 999px;
	}

	.tabs button {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--color-text);
		font-weight: 600;
		font-family: var(--font-heading);
		font-size: 0.92rem;
		padding: 0.55rem 0.5rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}

	.tabs button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.subtitle {
		margin: -0.5rem 0 0;
		text-align: center;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--color-text);
	}

	label em {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	input {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: var(--color-cream);
		color: var(--color-text);
	}

	input:focus {
		outline: none;
		border-color: var(--color-teal);
	}

	.msg {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		padding: 0.6rem 0.8rem;
		border-radius: 10px;
	}

	.msg.error {
		background: rgba(165, 52, 42, 0.1);
		color: var(--color-brick);
	}

	.msg.info {
		background: rgba(31, 95, 99, 0.1);
		color: var(--color-teal);
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
</style>
