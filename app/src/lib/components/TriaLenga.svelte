<script>
	// Lo tria de la lenga d'una ficha de comuna (retorn de Romain, 2026-10-11 :
	// « juste les icônes sans texte, en haut à gauche, attaché mais vraiment un
	// peu au-dessus du cadre ») : los emblèmas sols, pausats sul canton de la
	// ficha. Lo nom de la lenga (dins sa lenga) es dins la bulla e per los
	// lectors d'ecran. La transformacion de la ficha es dins FichaComuna.svelte.
	// (Las prepausas d'abans, cadran, bossòla, manètge, ròda, onglets, son pas
	// estadas retengudas : veire l'istoric Git.)

	let { lenguas = [], causida, onCausir, nomLenga = (l) => l, còdi = (l) => l, etiqueta = '' } = $props();

	// lo nom de cada lenga dins sa lenga (las bonas practicas : un visitaire
	// reconeis sa lenga a son nom, pas a una bandièra)
	const ENDO = {
		oc: 'Occitan',
		fr: 'Français',
		eu: 'Euskara',
		ca: 'Català',
		frp: 'Arpetan',
		br: 'Brezhoneg',
		als: 'Elsässisch',
		lb: 'Lëtzebuergesch',
		pfl: 'Pälzisch',
		ksh: 'Ripoarisch',
		li: 'Limburgs',
		vls: 'West-Vlams',
		nl: 'Nederlands',
		co: 'Corsu',
		pcd: 'Picard',
		wa: 'Walon',
		nrm: 'Nouormand'
	};
	const endo = (l) => ENDO[l] ?? nomLenga(l);
	const títol = (l) => (endo(l) === nomLenga(l) ? endo(l) : `${endo(l)} · ${nomLenga(l)}`);
	const COLOR = { lb: '#5aa0d8', vls: '#e2c14a', nl: '#e8873a', pcd: '#8fb35a', wa: '#e3c03a', nrm: '#d65a4a', frp: '#3fae6a', co: '#9a9a9a' };

	const idx = $derived(Math.max(0, lenguas.indexOf(causida)));
	// (lo centre de l'emblèma clicat : la ficha se transforma a partir d'aquí)
	function causir(l, el) {
		if (l === causida) return;
		const r = el?.getBoundingClientRect();
		onCausir?.(l, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
	}
	let botons = $state([]);
	function clavièr(e) {
		const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
		if (!k) return;
		e.preventDefault();
		const j = (idx + k + lenguas.length) % lenguas.length;
		causir(lenguas[j], botons[j]);
		botons[j]?.focus();
	}
</script>

<!-- L'emblèma d'una lenga, dins un ròtle -->
{#snippet pastilha(l)}
	<svg class="pastilha" viewBox="-12 -12 24 24" aria-hidden="true">
		<clipPath id="rotle-{l}"><circle r="12" /></clipPath>
		<g clip-path="url(#rotle-{l})">
			{#if l === 'eu'}
				<rect x="-12" y="-12" width="24" height="24" fill="#d52b1e" />
				<path d="M-13 -13L13 13M13 -13L-13 13" stroke="#009b48" stroke-width="3.6" />
				<path d="M0 -13V13M-13 0H13" stroke="#fff" stroke-width="3" />
			{:else if l === 'oc'}
				<rect x="-12" y="-12" width="24" height="24" fill="#c8102e" />
				<g transform="scale(8.2)" fill="none" stroke="#f3c25a" stroke-linecap="round">
					<path d="M0 0L0.486 -0.797M0 0L0.809 -0.48M0 0L0.809 0.48M0 0L0.486 0.797M0 0L-0.468 0.797M0 0L-0.786 0.48M0 0L-0.786 -0.48M0 0L-0.468 -0.797" stroke-width="0.09" />
					<path
						d="M-0.468 -0.797Q-0.194 -0.746 0 -1M0 -1Q0.202 -0.746 0.486 -0.797M0.809 -0.48Q0.751 -0.199 1 0M1 0Q0.751 0.199 0.809 0.48M0.486 0.797Q0.202 0.742 0 0.992M0 0.992Q-0.194 0.742 -0.468 0.797M-0.786 0.48Q-0.731 0.203 -0.976 0.009M-0.976 0.009Q-0.731 -0.195 -0.786 -0.48"
						stroke-width="0.1"
					/>
				</g>
				<g fill="#f3c25a">
					{#each [[0, -8.2], [4, -6.5], [6.6, -3.9], [8.2, 0], [6.6, 3.9], [4, 6.5], [0, 8.1], [-3.8, 6.5], [-6.4, 3.9], [-8, 0.1], [-6.4, -3.9], [-3.8, -6.5]] as [x, y]}<circle cx={x} cy={y} r="1.05" />{/each}
					<circle r="1.2" />
				</g>
			{:else if l === 'fr'}
				<circle r="12" fill="#e1000f" />
				<circle r="8.2" fill="#fff" />
				<circle r="4.6" fill="#000091" />
			{:else if l === 'ca'}
				<rect x="-12" y="-12" width="24" height="24" fill="#fcdd09" />
				{#each [-7.1, -2.4, 2.4, 7.1] as y}<rect x="-12" y={y - 1.3} width="24" height="2.6" fill="#da121a" />{/each}
			{:else if l === 'br'}
				<rect x="-12" y="-12" width="24" height="24" fill="#fff" />
				{#each [-9.3, -4, 1.3, 6.6] as y}<rect x="-12" y={y} width="24" height="2.65" fill="#111" />{/each}
				<rect x="-12" y="-12" width="11" height="11" fill="#fff" />
				{#each [[-9, -9], [-4.5, -9], [-6.8, -5], [-9, -2.6], [-4.5, -2.6]] as [x, y]}<path d="M{x} {y - 1.2}l0.9 1.6h-1.8z" fill="#111" />{/each}
			{:else if l === 'als'}
				<rect x="-12" y="-12" width="24" height="12" fill="#d52b1e" />
				<rect x="-12" y="0" width="24" height="12" fill="#fff" />
			{:else}
				<rect x="-12" y="-12" width="24" height="24" fill={COLOR[l] ?? '#777'} />
				<text y="3.6" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff">{còdi(l)}</text>
			{/if}
		</g>
		<circle r="11.5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
	</svg>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="emblemas" role="radiogroup" aria-label={etiqueta} tabindex="-1" onkeydown={clavièr}>
	{#each lenguas as l, k (l)}
		<button
			type="button"
			role="radio"
			aria-checked={l === causida}
			aria-label={títol(l)}
			title={títol(l)}
			tabindex={l === causida ? 0 : -1}
			class:causida={l === causida}
			bind:this={botons[k]}
			onclick={(e) => causir(l, e.currentTarget)}>{@render pastilha(l)}</button
		>
	{/each}
</div>

<style>
	.emblemas {
		display: inline-flex;
		align-items: flex-end;
		gap: 7px;
		outline: none;
	}
	button {
		width: 24px;
		height: 24px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		cursor: pointer;
		line-height: 0;
		opacity: 0.82;
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45);
		transition:
			width 0.35s cubic-bezier(0.34, 1.5, 0.5, 1),
			height 0.35s cubic-bezier(0.34, 1.5, 0.5, 1),
			transform 0.25s ease,
			opacity 0.25s ease,
			box-shadow 0.3s ease;
	}
	button:hover {
		opacity: 1;
		transform: translateY(-2px);
	}
	button.causida {
		width: 32px;
		height: 32px;
		opacity: 1;
		box-shadow:
			0 0 0 2px var(--t-aur),
			0 4px 12px rgba(0, 0, 0, 0.5);
	}
	button.causida:hover {
		transform: none;
	}
	button:focus-visible {
		outline: 2px solid var(--t-aur-clar);
		outline-offset: 3px;
	}
	.pastilha {
		display: block;
		width: 100%;
		height: 100%;
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
