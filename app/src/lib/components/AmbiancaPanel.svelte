<script>
	// Bouton « soleil » + panneau de réglages d'ambiance (cadre commun,
	// 2026-10-07, repris de l'esbòs de nuèch) : thème, couleurs adaptées au
	// daltonisme, fond animé, fond léger. Les réglages vivent dans stores/ambianca.
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { tampaDefòra } from '$lib/tampaDefora.js';

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
			leugier: 'Fons leugièr',
			confetis: 'Confetis flotants',
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
			leugier: 'Fond léger',
			confetis: 'Confettis qui flottent',
			fonses: ['Veines d’or', 'Lumière et étoiles', 'Courbes de niveau', 'Sobre']
		},
		es: {
			titol: 'Ambiente del sitio',
			tema: 'Tema',
			sorne: 'Oscuro',
			clar: 'Claro',
			sistema: 'Sistema',
			dalt: 'Colores adaptados (daltonismo)',
			forçat: 'Esta página se queda en claro por ahora.',
			fons: 'Fondo',
			leugier: 'Fondo ligero',
			confetis: 'Confeti flotante',
			fonses: ['Vetas de oro', 'Luz y estrellas', 'Curvas de nivel', 'Sobrio']
		},
		en: {
			titol: 'Site ambience',
			tema: 'Theme',
			sorne: 'Dark',
			clar: 'Light',
			sistema: 'System',
			dalt: 'Adapted colours (colour blindness)',
			forçat: 'This page stays light for now.',
			fons: 'Background',
			leugier: 'Lightweight background',
			confetis: 'Floating confetti',
			fonses: ['Veins of gold', 'Light and stars', 'Contour lines', 'Plain']
		},
		ca: {
			titol: 'Ambient del web',
			tema: 'Tema',
			sorne: 'Fosc',
			clar: 'Clar',
			sistema: 'Sistema',
			dalt: 'Colors adaptats (daltonisme)',
			forçat: 'Aquesta pàgina es queda en clar de moment.',
			fons: 'Fons',
			leugier: 'Fons lleuger',
			confetis: 'Confeti flotant',
			fonses: ['Vetes d’or', 'Llum i estrelles', 'Corbes de nivell', 'Sobri']
		},
		ar: {
			titol: 'مظهر الموقع',
			tema: 'السمة',
			sorne: 'داكن',
			clar: 'فاتح',
			sistema: 'النظام',
			dalt: 'ألوان مناسبة (لعمى الألوان)',
			forçat: 'تبقى هذه الصفحة فاتحة حاليًا.',
			fons: 'الخلفية',
			leugier: 'خلفية خفيفة',
			confetis: 'قصاصات ورقية ملوّنة عائمة',
			fonses: ['عروق ذهبية', 'ضوء ونجوم', 'خطوط الكنتور', 'بسيط']
		}
	};
	let tx = $derived(t[lang] ?? t.oc);
	// Ordre d'affichage : l'ambiance par défaut (Venas d'aur) d'abord
	const ORDRE_FONS = [0, 1, 2, 3];

	// un clic defòra tampa ; sus la carta, tampa sonque (principi del site,
	// $lib/tampaDefora.js : abans, lo clic causissiá tanben un dialècte)
	$effect(() => {
		if (!dobèrt) return;
		const lèva = tampaDefòra((t) => !!(panel?.contains(t) || boton?.contains(t)), () => (dobèrt = false));
		const tòca = (e) => {
			if (e.key === 'Escape') {
				dobèrt = false;
				boton?.focus();
			}
		};
		document.addEventListener('keydown', tòca);
		return () => {
			lèva();
			document.removeEventListener('keydown', tòca);
		};
	});
</script>

<div class="ambianca">
	<button
		type="button"
		class="pc pc-2 ambianca-boton"
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
						class="pc pc-2 pc-chip"
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
				<span class="pc-basc" aria-hidden="true"></span>{tx.dalt}
			</button>

			<!-- les confettis du fond clair (2026-11-08) : le réglage n'a de sens que sur un fond clair,
			     et pas en fond léger (qui retire tout mouvement) -->
			{#if ambianca.clar && !ambianca.leugier}
				<button
					type="button"
					class="dalt"
					aria-pressed={ambianca.confetis}
					onclick={() => (ambianca.confetis = !ambianca.confetis)}
				>
					<span class="pc-basc" aria-hidden="true"></span>{tx.confetis}
				</button>
			{/if}

			{#if ambianca.fonsPresent}
				<p class="ambianca-titol">{tx.fons}</p>
				<!-- Fond léger (2026-10-14) : la braise en CSS seul, sur choix du
				     visiteur ; les fonds calculés ne s'affichent qu'en dehors -->
				<button
					type="button"
					class="dalt leugier"
					aria-pressed={ambianca.leugier}
					onclick={() => (ambianca.leugier = !ambianca.leugier)}
				>
					<span class="pc-basc" aria-hidden="true"></span>{tx.leugier}
				</button>
				{#each ambianca.leugier ? [] : ORDRE_FONS as v (v)}
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

	/* pièce de papier (lib/styles/papier.css) ; c'est le soleil qui tourne, pas la pièce */
	.ambianca-boton {
		--r: 9px;
		width: 2.2rem;
		height: 2.2rem;
		min-height: 0;
		padding: 0;
	}

	.ambianca-boton[aria-expanded='true'] {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
	}

	.ambianca-boton svg {
		transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.ambianca-boton:hover svg,
	.ambianca-boton[aria-expanded='true'] svg {
		transform: rotate(45deg);
	}

	.ambianca-boton svg {
		width: 1.2rem;
		height: 1.2rem;
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

	/* sombre / clair / système : trois jetons de papier, l'or pour le choisi */
	.tema {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		margin-bottom: 0.9rem;
	}

	.tema button {
		padding-inline: 0.2rem;
		font-size: 0.82rem;
	}

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

	/* l'interrupteur : .pc-basc (lib/styles/papier.css) */

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
			#22100a;
	}

	.m1 {
		background:
			radial-gradient(1px 1px at 20% 30%, #f5ead8, transparent),
			radial-gradient(1px 1px at 75% 60%, #f5ead8, transparent),
			radial-gradient(circle at 30% 60%, rgba(181, 61, 23, 0.6), transparent 60%),
			radial-gradient(circle at 80% 85%, rgba(238, 175, 52, 0.35), transparent 50%),
			#261209;
	}

	.m2 {
		background:
			repeating-radial-gradient(circle at 40% 65%, transparent 0 4px, rgba(238, 175, 52, 0.55) 4px 5px),
			#22100a;
	}

	.m3 {
		background: linear-gradient(#22100a, #3a1a0e);
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
