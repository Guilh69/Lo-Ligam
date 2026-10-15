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

	let { dobèrt = $bindable(false), lang = 'oc', boton = null } = $props();
	let fr = $derived(lang === 'fr');
	let panel = $state(null);

	const tampar = () => (dobèrt = false);
	const actiu = (href) => page.url.pathname === href || page.url.pathname.startsWith(href + '/');

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
				<button type="button" class="vel-tampar" onclick={tampar} aria-label={fr ? 'Fermer le menu' : 'Tampar lo menú'}>
					<Icona nom="fermer" size="1.6em" />
				</button>
			</div>

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

	/* Téléphone et panneau étroit : une colonne */
	@container (max-width: 44rem) {
		.vel-plan {
			grid-template-columns: 1fr;
			gap: 1.6rem;
		}
		.vel-verb {
			margin-bottom: 0.4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.vel-ligam {
			animation: none;
		}
	}
</style>
