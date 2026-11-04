<script>
	// Une bulle au survol (Romain, 2026-11-04, grammaire : en occitan, « que ce
	// soit expliqué avec d'autres mots mais en occitan, ou alors des exemples » ;
	// dans une autre langue, l'occitan au survol). À poser comme ENFANT DIRECT
	// de l'élément survolé (bouton, lien, ou span tabindex="0" pour que le
	// toucher l'ouvre au téléphone) ; l'élément porte aria-describedby={id}.
	// Règles de l'accessibilité (WCAG 1.4.13) : elle s'ouvre aussi au clavier,
	// Échap la ferme, on peut passer la souris dessus sans qu'elle disparaisse.
	// Elle reste dans l'écran : décalée si elle déborde à gauche ou à droite.
	/** titol : en gras (le nom occitan) ; etiqueta : petit mot avant le texte ;
	 *  text : le texte (lang : sa langue) */
	let { id, titol = '', etiqueta = '', text = '', lang = 'oc' } = $props();

	let el = $state();
	let dx = $state(0);
	let amagada = $state(false);

	$effect(() => {
		const ancra = el?.parentElement;
		if (!ancra) return;
		const caler = () => {
			amagada = false;
			dx = 0;
			requestAnimationFrame(() => {
				if (!el) return;
				const r = el.getBoundingClientRect();
				const w = document.documentElement.clientWidth;
				const m = 12;
				dx = r.left < m ? m - r.left : r.right > w - m ? w - m - r.right : 0;
			});
		};
		const tecla = (ev) => {
			if (ev.key === 'Escape') amagada = true;
		};
		ancra.addEventListener('pointerenter', caler);
		ancra.addEventListener('focusin', caler);
		ancra.addEventListener('keydown', tecla);
		return () => {
			ancra.removeEventListener('pointerenter', caler);
			ancra.removeEventListener('focusin', caler);
			ancra.removeEventListener('keydown', tecla);
		};
	});
</script>

<svelte:window onkeydown={(ev) => ev.key === 'Escape' && (amagada = true)} />

<span class="bulla-survol" class:amagada {id} bind:this={el} style:--dx="{dx}px" aria-hidden="true"
	>{#if titol}<strong lang="oc">{titol}</strong>{/if}{#if etiqueta}<span class="etiqueta">{etiqueta}</span>{/if}{#if text}<span
			class="text"
			{lang}>{text}</span
		>{/if}</span
>

<style>
	/* l'élément survolé sert de repère */
	:global(:has(> .bulla-survol)) {
		position: relative;
	}
	/* une étiquette pleine, couleurs inversées (crème sur le sombre, brun sur
	   le clair) : lisible d'un coup d'œil, sans verre fumé */
	.bulla-survol {
		position: absolute;
		inset-inline-start: 0;
		bottom: calc(100% + 0.55rem);
		z-index: 30;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		width: max-content;
		max-width: min(19rem, calc(100vw - 2rem));
		padding: 0.45rem 0.7rem 0.5rem;
		border-radius: 0.5rem;
		background: var(--t-tinta);
		color: var(--t-fons);
		font: 400 0.86rem/1.35 var(--font-body);
		text-align: start;
		white-space: normal;
		letter-spacing: 0;
		text-transform: none;
		box-shadow: 0 0.4rem 1.2rem rgb(0 0 0 / 0.28);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transform: translate(var(--dx, 0px), 0.25rem);
		transition:
			opacity 0.16s ease,
			transform 0.16s ease,
			visibility 0s linear 0.16s;
	}
	/* un pont invisible entre l'élément et la bulle : la souris peut y passer */
	.bulla-survol::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		top: 100%;
		height: 0.6rem;
	}
	:global(:hover) > .bulla-survol,
	:global(:focus-visible) > .bulla-survol,
	:global([tabindex]:focus) > .bulla-survol {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		transform: translate(var(--dx, 0px), 0);
		transition-delay: 0.12s, 0.12s, 0s;
	}
	.bulla-survol.amagada {
		opacity: 0 !important;
		visibility: hidden !important;
	}
	strong {
		font-weight: 700;
	}
	.etiqueta {
		font-size: 0.74rem;
		opacity: 0.8;
	}
	.text[lang='oc'] {
		font-style: italic;
	}
	/* en arabe, l'occitan garde son sens de lecture */
	strong[lang='oc'],
	.text[lang='oc'] {
		direction: ltr;
		unicode-bidi: isolate;
		text-align: -webkit-match-parent;
		text-align: match-parent;
	}
	@media (prefers-reduced-motion: reduce) {
		.bulla-survol {
			transition: none;
		}
	}
</style>
