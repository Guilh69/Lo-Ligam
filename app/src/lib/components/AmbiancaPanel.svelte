<script>
	// Bouton « soleil » + panneau de réglages d'ambiance (cadre commun,
	// 2026-10-07, repris de l'esbòs de nuèch) : thème, couleurs adaptées au
	// daltonisme, fond animé. Les réglages vivent dans stores/ambianca.
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';

	let lang = $derived(langStore.current);
	let dobèrt = $state(false);
	let boton;
	let panel;

	const t = {
		oc: {
			titol: 'Ambiança del site',
			tema: 'Tèma',
			sorne: 'Sorne',
			clar: 'Clar',
			sistema: 'Sistèma',
			dalt: 'Colors adaptadas (daltonisme)',
			forçat: 'Aquesta pagina demòra en clar pel moment.',
			fons: 'Fons',
			fonses: ['Venas d’aur', 'Lum e estelas', 'Corbas de nivèl', 'Simple']
		},
		fr: {
			titol: 'Ambiance du site',
			tema: 'Thème',
			sorne: 'Sombre',
			clar: 'Clair',
			sistema: 'Système',
			dalt: 'Couleurs adaptées (daltonisme)',
			forçat: 'Cette page reste en clair pour le moment.',
			fons: 'Fond',
			fonses: ['Veines d’or', 'Lumière et étoiles', 'Courbes de niveau', 'Sobre']
		}
	};
	let tx = $derived(t[lang]);
	// Ordre d'affichage : la plus reposante d'abord
	const ORDRE_FONS = [1, 0, 2, 3];

	$effect(() => {
		if (!dobèrt) return;
		const clic = (e) => {
			if (!panel?.contains(e.target) && !boton?.contains(e.target)) dobèrt = false;
		};
		const tòca = (e) => {
			if (e.key === 'Escape') {
				dobèrt = false;
				boton?.focus();
			}
		};
		document.addEventListener('click', clic);
		document.addEventListener('keydown', tòca);
		return () => {
			document.removeEventListener('click', clic);
			document.removeEventListener('keydown', tòca);
		};
	});
</script>

<div class="ambianca">
	<button
		type="button"
		class="ambianca-boton"
		bind:this={boton}
		aria-expanded={dobèrt}
		aria-controls="ambianca-panel"
		title={tx.titol}
		onclick={() => (dobèrt = !dobèrt)}
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"
			><circle cx="12" cy="12" r="4" /><path
				d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"
			/></svg
		>
		<span class="sr-only">{tx.titol}</span>
	</button>

	{#if dobèrt}
		<div class="ambianca-panel" id="ambianca-panel" bind:this={panel} role="group" aria-label={tx.titol}>
			<p class="ambianca-titol">{tx.tema}</p>
			<div class="tema" role="group" aria-label={tx.tema}>
				{#each ['sorne', 'clar', 'sistema'] as v (v)}
					<button
						type="button"
						aria-pressed={ambianca.tema === v}
						disabled={ambianca.forçarClar}
						onclick={() => (ambianca.tema = v)}>{tx[v]}</button
					>
				{/each}
			</div>
			{#if ambianca.forçarClar}
				<p class="nota">{tx.forçat}</p>
			{/if}

			<button
				type="button"
				class="dalt"
				aria-pressed={ambianca.dalt}
				onclick={() => (ambianca.dalt = !ambianca.dalt)}
			>
				<span class="interr" aria-hidden="true"></span>{tx.dalt}
			</button>

			{#if ambianca.fonsPresent}
				<p class="ambianca-titol">{tx.fons}</p>
				{#each ORDRE_FONS as v (v)}
					<label class="fons-opcion">
						<input
							type="radio"
							name="fons"
							value={v}
							checked={ambianca.fons === v}
							onchange={() => (ambianca.fons = v)}
						/>
						<i class="m m{v}"></i>{tx.fonses[v]}
					</label>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.ambianca {
		position: relative;
	}

	.ambianca-boton {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		padding: 0;
		border-radius: 50%;
		border: 1px solid var(--t-linha);
		background: transparent;
		color: var(--t-aur);
		cursor: pointer;
		transition:
			border-color 0.4s,
			transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.ambianca-boton svg {
		width: 1.2rem;
		height: 1.2rem;
	}

	.ambianca-boton:hover,
	.ambianca-boton[aria-expanded='true'] {
		border-color: var(--t-aur);
		transform: rotate(45deg);
	}

	.ambianca-boton:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	.ambianca-panel {
		position: absolute;
		right: 0;
		top: calc(100% + 12px);
		z-index: 60;
		width: 16rem;
		padding: 1rem;
		border-radius: 18px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
		border: 1px solid var(--t-linha);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
	}

	.ambianca-titol {
		margin: 0 0 0.6rem 0.3rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.tema {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		padding: 3px;
		margin-bottom: 0.9rem;
		border-radius: 12px;
		border: 1px solid var(--t-linha);
	}

	.tema button {
		border: 0;
		background: transparent;
		padding: 0.45rem 0.2rem;
		border-radius: 9px;
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-tinta-2);
		cursor: pointer;
		transition:
			background 0.4s,
			color 0.4s;
	}

	.tema button[aria-pressed='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}

	.tema button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.tema button:focus-visible,
	.dalt:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.nota {
		margin: -0.5rem 0 0.8rem 0.3rem;
		font-size: 0.75rem;
		color: var(--t-tinta-2);
	}

	.dalt {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: 100%;
		padding: 0.55rem 0.5rem;
		margin: 0 0 0.9rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		font-size: 0.85rem;
		text-align: left;
		color: var(--t-tinta-2);
		cursor: pointer;
	}

	.dalt[aria-pressed='true'] {
		color: var(--t-tinta);
	}

	.interr {
		flex: none;
		position: relative;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
		transition: background 0.35s;
	}

	.interr::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--t-tinta-2);
		transition:
			transform 0.35s cubic-bezier(0.19, 1, 0.22, 1),
			background 0.35s;
	}

	.dalt[aria-pressed='true'] .interr {
		background: #2f6fb0;
		border-color: #2f6fb0;
	}

	.dalt[aria-pressed='true'] .interr::after {
		transform: translateX(14px);
		background: #fff;
	}

	.fons-opcion {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.45rem 0.5rem;
		border-radius: 12px;
		font-size: 0.88rem;
		cursor: pointer;
	}

	.fons-opcion input {
		position: absolute;
		opacity: 0;
	}

	.fons-opcion:has(input:checked) {
		color: var(--t-aur-clar);
	}

	.fons-opcion input:focus-visible + .m {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.m {
		flex: none;
		width: 44px;
		height: 30px;
		border-radius: 8px;
		border: 1px solid var(--t-linha);
	}

	.fons-opcion:has(input:checked) .m {
		border-color: var(--t-aur);
		box-shadow: 0 0 0 2px rgba(238, 175, 52, 0.35);
	}

	.m0 {
		background:
			radial-gradient(circle at 70% 30%, rgba(238, 175, 52, 0.7) 0 6%, transparent 30%),
			radial-gradient(ellipse at 30% 70%, #6e2410, transparent 70%),
			#120906;
	}

	.m1 {
		background:
			radial-gradient(1px 1px at 20% 30%, #f5ead8, transparent),
			radial-gradient(1px 1px at 75% 60%, #f5ead8, transparent),
			radial-gradient(circle at 30% 60%, rgba(181, 61, 23, 0.6), transparent 60%),
			radial-gradient(circle at 80% 85%, rgba(238, 175, 52, 0.35), transparent 50%),
			#160b07;
	}

	.m2 {
		background:
			repeating-radial-gradient(circle at 40% 65%, transparent 0 4px, rgba(238, 175, 52, 0.55) 4px 5px),
			#120906;
	}

	.m3 {
		background: linear-gradient(#120906, #2a120a);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
