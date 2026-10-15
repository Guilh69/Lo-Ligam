<script>
	// Menu-voile (essai du 2026-10-15, option 2 de Romain, d'après le site de
	// l'Alliance des collectivités pour la qualité de l'air) : un grand panneau
	// terracotta qui glisse depuis la droite, rangé comme l'accueil en trois
	// colonnes (Se parla, S'apren, Se viu), la ligne « Lo Ligam » en bas et le
	// bouton de réservation. Le croisillon du logo en filigrane, comme le nuage
	// de l'Alliance. Repris de l'ancien menu-voile du 2026-10-06 : les liens qui
	// montent chacun dans leur masque, Échap pour fermer, la page bloquée derrière.
	// Ferme : ✕, Échap, clic ailleurs (tampaDefòra, principe du site), clic sur un lien.
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import Icona from './Icona.svelte';
	import Crotz from './Crotz.svelte';
	import { PLAN, LO_LIGAM, RESERVAR } from '$lib/data/planSite.js';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { portal } from '$lib/actions/portal.js';
	import { essaiMenu, mudarForma } from '$lib/stores/essaiMenu.svelte.js';
	//
	// Deux dispositions à comparer (sélecteur dans l'en-tête du panneau) :
	// « colomnas » côte à côte, ou « vertical » (idée de Romain) : 01, 02, 03
	// empilés en grand, chacun se déroule pour montrer ses rubriques, au
	// survol sur ordinateur, au toucher sur téléphone.

	let { dobèrt = $bindable(false), lang = 'oc', boton = null } = $props();
	let fr = $derived(lang === 'fr');
	let panel = $state(null);

	const tampar = () => (dobèrt = false);
	const actiu = (href) => page.url.pathname === href || page.url.pathname.startsWith(href + '/');

	// Vertical : le verbe ouvert ; à l'ouverture, celui de la page où l'on est
	let desplegat = $state(null);
	$effect(() => {
		if (dobèrt)
			desplegat = PLAN.find((c) => c.grops.some((g) => g.items.some((it) => !it.defòra && actiu(it.href))))?.id ?? null;
	});
	const survòl = (id) => {
		if (matchMedia('(hover: hover)').matches) desplegat = id;
	};

	// Page bloquée derrière, focus sur « fermer », retour au bouton « Menú »
	$effect(() => {
		if (!dobèrt) return;
		const html = document.documentElement;
		const avant = html.style.overflow;
		html.style.overflow = 'hidden';
		tick().then(() => panel?.querySelector('.vel-tampar')?.focus());
		const levar = tampaDefòra((t) => panel?.contains(t) || boton?.contains(t), tampar);
		return () => {
			html.style.overflow = avant;
			levar();
			if (boton?.isConnected) boton.focus();
		};
	});

	// Échap ferme ; Tab tourne dans le panneau tant qu'il est ouvert
	function clau(e) {
		if (!dobèrt) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			tampar();
			return;
		}
		if (e.key !== 'Tab' || !panel) return;
		const f = [...panel.querySelectorAll('a[href], button')];
		const [prim, darrièr] = [f[0], f[f.length - 1]];
		if (e.shiftKey && document.activeElement === prim) {
			e.preventDefault();
			darrièr.focus();
		} else if (!e.shiftKey && document.activeElement === darrièr) {
			e.preventDefault();
			prim.focus();
		}
	}

	const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	const lisar = () => ({ duration: calm() ? 0 : 650, easing: quartOut, css: (t) => `transform: translateX(${(1 - t) * 100}%)` });
	const esvanir = () => ({ duration: calm() ? 0 : 400, css: (t) => `opacity: ${t}` });
</script>

<svelte:window onkeydown={clau} />

{#if dobèrt}
	<div class="vel-portal" use:portal>
		<div class="vel-fons" aria-hidden="true" transition:esvanir></div>
		<div class="vel" bind:this={panel} role="dialog" aria-modal="true" aria-labelledby="vel-titol" transition:lisar>
			<div class="vel-filigrana" aria-hidden="true">
				<Crotz talha={760} traç="currentColor" ponch="currentColor" />
			</div>

			<div class="vel-cap">
				<p class="vel-titol" id="vel-titol">{fr ? 'Menu' : 'Menú'}</p>
				<!-- Essai : passer d'une disposition à l'autre pour comparer -->
				<div class="vel-forma" role="group" aria-label={fr ? 'Colonnes ou vertical' : 'Colomnas o vertical'}>
					<button type="button" aria-pressed={essaiMenu.forma === 'colomnas'} onclick={() => mudarForma('colomnas')}
						>{fr ? 'Colonnes' : 'Colomnas'}</button
					>
					<button type="button" aria-pressed={essaiMenu.forma === 'vertical'} onclick={() => mudarForma('vertical')}
						>Vertical</button
					>
				</div>
				<button type="button" class="vel-tampar" onclick={tampar} aria-label={fr ? 'Fermer le menu' : 'Tampar lo menú'}>
					<Icona nom="fermer" size="1.6em" />
				</button>
			</div>

			{#if essaiMenu.forma === 'vertical'}
				<nav class="vel-vertical" aria-label={fr ? 'Plan du site' : 'Plan del site'}>
					{#each PLAN as c, ci (c.id)}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<section class="vel-renc" class:desplegat={desplegat === c.id} style:--d={ci} onmouseenter={() => survòl(c.id)}>
							<h2 class="vel-renc-cap">
								<button
									type="button"
									class="vel-renc-boton"
									aria-expanded={desplegat === c.id}
									aria-controls="vel-{c.id}"
									onclick={() => (desplegat = desplegat === c.id ? null : c.id)}
								>
									<b>{c.n}</b><span>{fr ? c.fr : c.oc}</span><Icona nom="suivant" size="1.4rem" />
								</button>
							</h2>
							<div class="vel-desplega" id="vel-{c.id}" inert={desplegat !== c.id}>
								<div class="vel-desplega-in">
									<div class="vel-desplega-pad">
										{#each c.grops as g, gi (gi)}
											<div class="vel-renc-grop">
												{#if g.oc}<p class="vel-grop">{fr ? g.fr : g.oc}</p>{/if}
												<ul>
													{#each g.items as it, ii (it.href)}
														<li class="vel-masc">
															<a
																class="vel-ligam"
																href={it.href}
																style:--i={gi * 3 + ii}
																aria-current={!it.defòra && actiu(it.href) ? 'page' : undefined}
																target={it.defòra ? '_blank' : undefined}
																rel={it.defòra ? 'noopener noreferrer' : undefined}
																onclick={tampar}
																>{fr ? it.fr : it.oc}<Icona nom={it.defòra ? 'extern' : 'suivant'} size="0.8em" /></a
															>
														</li>
													{/each}
												</ul>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</section>
					{/each}
				</nav>
			{:else}
			<nav class="vel-plan" aria-label={fr ? 'Plan du site' : 'Plan del site'}>
				{#each PLAN as c, ci (c.id)}
					<section class="vel-colomna" style:--d={ci}>
						<h2 class="vel-verb"><b>{c.n}</b><span>{fr ? c.fr : c.oc}</span></h2>
						{#each c.grops as g, gi (gi)}
							{#if g.oc}<p class="vel-grop">{fr ? g.fr : g.oc}</p>{/if}
							<ul>
								{#each g.items as it, ii (it.href)}
									<li class="vel-masc">
										<a
											class="vel-ligam"
											href={it.href}
											style:--i={gi * 4 + ii}
											aria-current={!it.defòra && actiu(it.href) ? 'page' : undefined}
											target={it.defòra ? '_blank' : undefined}
											rel={it.defòra ? 'noopener noreferrer' : undefined}
											onclick={tampar}
											>{fr ? it.fr : it.oc}<Icona nom={it.defòra ? 'extern' : 'suivant'} size="0.8em" /></a
										>
									</li>
								{/each}
							</ul>
						{/each}
					</section>
				{/each}
			</nav>
			{/if}

			<div class="vel-pe">
				<ul class="vel-lo-ligam">
					<li class="vel-grop">Lo Ligam</li>
					{#each LO_LIGAM as it (it.href)}
						<li>
							<a
								href={it.href}
								target={it.defòra ? '_blank' : undefined}
								rel={it.defòra ? 'noopener noreferrer' : undefined}
								onclick={tampar}>{fr ? it.fr : it.oc}</a
							>
						</li>
					{/each}
				</ul>
				<a class="vel-reservar" href={RESERVAR} target="_blank" rel="noopener" onclick={tampar}
					>{fr ? 'Réserver un premier cours' : 'Reservar un primièr cors'}<Icona nom="suivant" size="0.9em" /></a
				>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Couleurs fixes : le terracotta du logo et la crème, dans tous les thèmes
	   (contraste crème sur terracotta ≈ 5,9 : AA) */
	.vel-portal {
		--vel-fons: #b53d17;
		--vel-tinta: #f5ead8;
		--vel-tinta-2: rgba(245, 234, 216, 0.72);
		--vel-linha: rgba(245, 234, 216, 0.28);
	}

	.vel-fons {
		position: fixed;
		inset: 0;
		z-index: 3000;
		background: rgba(18, 9, 6, 0.6);
	}

	.vel {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 3001;
		width: min(100%, 72rem);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.6rem clamp(1.4rem, 5vw, 4.5rem) 2.4rem;
		background: var(--vel-fons);
		color: var(--vel-tinta);
		container-type: inline-size;
		box-shadow: -24px 0 60px rgba(18, 9, 6, 0.35);
	}

	/* Le croisillon du logo, en grand et en filigrane, qui déborde en bas à droite */
	.vel-filigrana {
		position: absolute;
		right: -14rem;
		bottom: -16rem;
		color: rgba(245, 234, 216, 0.09);
		pointer-events: none;
	}

	.vel-cap {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: clamp(2rem, 6vh, 4rem);
	}

	.vel-titol {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--vel-tinta-2);
	}

	.vel-tampar {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border: 1px solid var(--vel-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--vel-tinta);
		cursor: pointer;
		transition:
			background 0.4s,
			transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.vel-tampar:hover {
		background: rgba(245, 234, 216, 0.12);
		transform: rotate(90deg);
	}

	.vel-plan {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 2.6rem clamp(1.6rem, 4vw, 3.4rem);
	}

	.vel-verb {
		display: grid;
		gap: 0.3rem;
		margin: 0 0 1.4rem;
		padding-top: 1rem;
		border-top: 1px solid var(--vel-linha);
		font-weight: 400;
	}

	.vel-verb b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 2.4rem;
		line-height: 0.9;
		color: transparent;
		-webkit-text-stroke: 1px var(--vel-tinta);
		opacity: 0.7;
	}

	.vel-verb span {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 4cqi, 2.9rem);
		line-height: 1.05;
	}

	.vel-grop {
		margin: 1.2rem 0 0.3rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--vel-tinta-2);
	}

	.vel-plan ul,
	.vel-lo-ligam {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Chaque lien monte dans son propre masque, en cascade de colonne en colonne */
	.vel-masc {
		overflow: hidden;
	}

	.vel-ligam {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.55rem 0;
		font-size: clamp(1.1rem, 2.2cqi, 1.3rem);
		font-weight: 700;
		color: var(--vel-tinta);
		text-decoration: none;
		animation: vel-monta 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(220ms + var(--d, 0) * 90ms + var(--i, 0) * 45ms);
	}

	@keyframes vel-monta {
		from {
			transform: translateY(110%);
		}
	}

	/* Soulignement crème qui balaie au survol (comme les liens de l'Alliance) */
	.vel-ligam::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.3rem;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.vel-ligam:hover::after,
	.vel-ligam:focus-visible::after,
	.vel-ligam[aria-current='page']::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.vel-ligam :global(svg) {
		flex: none;
		opacity: 0;
		transform: translateX(-6px);
		transition:
			opacity 0.35s,
			transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.vel-ligam:hover :global(svg),
	.vel-ligam:focus-visible :global(svg) {
		opacity: 1;
		transform: none;
	}

	.vel-pe {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.4rem 2rem;
		margin-top: clamp(2.6rem, 7vh, 4.5rem);
		padding-top: 1.4rem;
		border-top: 1px solid var(--vel-linha);
	}

	.vel-lo-ligam {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem 1.6rem;
	}

	.vel-lo-ligam .vel-grop {
		margin: 0;
	}

	.vel-lo-ligam a {
		color: var(--vel-tinta);
		font-weight: 700;
		text-decoration: underline;
		text-decoration-color: var(--vel-linha);
		text-underline-offset: 4px;
	}

	.vel-lo-ligam a:hover {
		text-decoration-color: currentColor;
	}

	/* Le bouton de réservation : crème plein, comme « Nous rejoindre » */
	.vel-reservar {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.85rem 1.4rem;
		border-radius: 999px;
		background: var(--vel-tinta);
		color: var(--vel-fons);
		font-weight: 700;
		text-decoration: none;
		transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.vel-reservar:hover {
		transform: translateY(-2px);
	}

	.vel a:focus-visible,
	.vel-tampar:focus-visible {
		outline: 2px solid var(--vel-tinta);
		outline-offset: 3px;
		border-radius: 6px;
	}

	/* Sélecteur de l'essai : Colomnas / Vertical */
	.vel-forma {
		display: inline-flex;
		gap: 2px;
		margin-left: auto;
		margin-right: 1rem;
		padding: 3px;
		border: 1px solid var(--vel-linha);
		border-radius: 999px;
	}

	.vel-forma button {
		border: 0;
		background: transparent;
		color: var(--vel-tinta);
		font: inherit;
		font-size: 0.74rem;
		font-weight: 700;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.vel-forma button[aria-pressed='true'] {
		background: var(--vel-tinta);
		color: var(--vel-fons);
	}

	.vel-forma button:focus-visible {
		outline: 2px solid var(--vel-tinta);
		outline-offset: 2px;
	}

	/* ---------- Disposition verticale : 01, 02, 03 empilés, qui se déroulent ---------- */
	.vel-vertical {
		position: relative;
	}

	.vel-vertical ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.vel-renc {
		border-top: 1px solid var(--vel-linha);
	}

	.vel-renc-cap {
		margin: 0;
		font-weight: 400;
		overflow: hidden;
	}

	.vel-renc-boton {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 3cqi, 2.2rem);
		width: 100%;
		padding: clamp(0.8rem, 2vh, 1.3rem) 0;
		border: 0;
		background: none;
		color: var(--vel-tinta);
		font: inherit;
		text-align: left;
		cursor: pointer;
		animation: vel-monta 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(150ms + var(--d, 0) * 110ms);
	}

	.vel-renc-boton b {
		min-width: 2.1em;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4.4cqi, 3.2rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px var(--vel-tinta);
		opacity: 0.7;
	}

	.vel-renc-boton span {
		flex: 1;
		font-family: var(--font-heading);
		font-size: clamp(2.6rem, 8cqi, 5.4rem);
		line-height: 1;
		transition: opacity 0.5s;
	}

	/* Quand un verbe est ouvert, les autres s'effacent un peu */
	.vel-vertical:has(.desplegat) .vel-renc:not(.desplegat) .vel-renc-boton span {
		opacity: 0.5;
	}

	.vel-renc-boton :global(svg) {
		flex: none;
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.desplegat .vel-renc-boton :global(svg) {
		transform: rotate(90deg);
	}

	.vel-renc-boton:focus-visible {
		outline: 2px solid var(--vel-tinta);
		outline-offset: -2px;
		border-radius: 6px;
	}

	/* Le déroulé : hauteur 0 → hauteur du contenu, sans mesurer en JavaScript */
	.vel-desplega {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.55s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.desplegat .vel-desplega {
		grid-template-rows: 1fr;
	}

	.vel-desplega-in {
		min-height: 0;
		overflow: hidden;
	}

	.vel-desplega-pad {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem clamp(2rem, 6cqi, 4.5rem);
		/* les rubriques s'alignent sur le verbe, pas sur le numéro */
		padding: 0 0 1.6rem calc(clamp(1.8rem, 4.4cqi, 3.2rem) * 2.1 + clamp(1rem, 3cqi, 2.2rem));
	}

	.vel-renc-grop .vel-grop {
		margin-top: 0;
	}

	.vel-renc-grop ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.8rem;
	}

	/* Les rubriques montent quand leur verbe se déroule */
	.vel-vertical .vel-ligam {
		animation: none;
		transform: translateY(110%);
		transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: calc(120ms + var(--i, 0) * 45ms);
	}

	.desplegat .vel-ligam {
		transform: none;
	}

	/* Téléphone et panneau étroit : une colonne */
	@container (max-width: 44rem) {
		.vel-plan {
			grid-template-columns: 1fr;
			gap: 1.6rem;
		}
		.vel-verb {
			margin-bottom: 0.4rem;
		}
		/* vertical : les rubriques sous le verbe, en liste */
		.vel-desplega-pad {
			padding-left: 0;
			flex-direction: column;
			gap: 0.8rem;
		}
		.vel-renc-grop ul {
			flex-direction: column;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.vel-ligam,
		.vel-renc-boton {
			animation: none;
		}
		.vel-vertical .vel-ligam,
		.vel-desplega {
			transition: none;
			transform: none;
		}
	}
</style>
