<script>
	import Icona from '$lib/components/Icona.svelte';
	// Pied de page commun (cadre commun, refonte 2026-10-07 dans la charte de
	// l'esbòs de nuèch) : présent sur toutes les pages via le layout, plus
	// seulement sur l'accueil. Colonnes texte (même source de vérité que le
	// menu), puis le grand nom « Lo Ligam » en terracotta. Couleurs de thème.
	import { scramble } from '$lib/actions/scramble';
	// Le texte est écrit dans le HTML du serveur (lisible sans JavaScript et
	// par les lecteurs d'écran) ; l'action scramble le remplace au montage.
	import { onMount } from 'svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { families, externalLinks } from '$lib/data/siteSections';
	// Essai du menu (2026-10-15) : le pied de page reprend le même plan que le
	// menu-voile, comme celui de l'Alliance répète son menu
	import { essaiMenu, legirEssaiMenu } from '$lib/stores/essaiMenu.svelte.js';
	import { PLAN, LO_LIGAM } from '$lib/data/planSite.js';

	const PER_DEFAUT = { oc: 'Fach amb amor en Occitània.', fr: 'Fait avec amour en Occitanie.' };
	let { tagline = PER_DEFAUT } = $props();
	let lang = $derived(langStore.current);
	onMount(legirEssaiMenu);
</script>

{#snippet ligam(it)}
	{#if it.defòra}
		<a class="footer-link" href={it.href} target="_blank" rel="noopener noreferrer"
			>{lang === 'oc' ? it.oc : it.fr} <Icona nom="extern" size="0.9em" /></a
		>
	{:else}
		<a class="footer-link" href={it.href}><span use:scramble={{ oc: it.oc, fr: it.fr, lang }}>{lang === 'oc' ? it.oc : it.fr}</span></a>
	{/if}
{/snippet}

<footer class="site-footer">
	<nav class="footer-colomnas" aria-label={lang === 'oc' ? 'Plan del site' : 'Plan du site'}>
		{#if essaiMenu.actiu}
			{#each PLAN as c (c.id)}
				<div class="footer-col">
					<p class="footer-col-title">
						<b class="footer-num">{c.n}</b>
						<span use:scramble={{ oc: c.oc, fr: c.fr, lang }}>{lang === 'oc' ? c.oc : c.fr}</span>
					</p>
					{#each c.grops as g, gi (gi)}
						{#if g.oc}<p class="footer-grop">{lang === 'oc' ? g.oc : g.fr}</p>{/if}
						<ul>
							{#each g.items as it (it.href)}
								<li>{@render ligam(it)}</li>
							{/each}
						</ul>
					{/each}
				</div>
			{/each}
			<div class="footer-col">
				<p class="footer-col-title">Lo Ligam</p>
				<ul>
					{#each LO_LIGAM as it (it.href)}
						<li>{@render ligam(it)}</li>
					{/each}
				</ul>
			</div>
			<div class="footer-col">
				<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', lang }}>{lang === 'oc' ? 'Ressorsas' : 'Ressources'}</p>
				<ul>
					{#each externalLinks as l (l.href)}
						<li>
							<a class="footer-link" href={l.href} target="_blank" rel="noopener noreferrer"
								>{l.label} <Icona nom="extern" size="0.9em" /></a
							>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
		{#each families as fam (fam.id)}
			<div class="footer-col">
				<p class="footer-col-title" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}>{lang === 'oc' ? fam.oc : fam.fr}</p>
				<ul>
					{#each fam.items as it (it.id)}
						<li>
							{#if it.status === 'live'}
								<a class="footer-link" href={it.href}>
									<span use:scramble={{ oc: it.oc, fr: it.fr, lang }}>{lang === 'oc' ? it.oc : it.fr}</span>
								</a>
							{:else}
								<span class="footer-link leu">
									<span use:scramble={{ oc: it.oc, fr: it.fr, lang }}>{lang === 'oc' ? it.oc : it.fr}</span>
									<em use:scramble={{ oc: 'lèu', fr: 'bientôt', lang }}>{lang === 'oc' ? 'lèu' : 'bientôt'}</em>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}

		<div class="footer-col">
			<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', lang }}>{lang === 'oc' ? 'Ressorsas' : 'Ressources'}</p>
			<ul>
				{#each externalLinks as l (l.href)}
					<li>
						<a class="footer-link" href={l.href} target="_blank" rel="noopener noreferrer"
							>{l.label} <Icona nom="extern" size="0.9em" /></a
						>
					</li>
				{/each}
				<li>
					<a class="footer-link" href="https://www.instagram.com/lo_ligam/" target="_blank" rel="noopener noreferrer"
						>Instagram <Icona nom="extern" size="0.9em" /></a
					>
				</li>
			</ul>
		</div>
		{/if}
	</nav>

	<p class="footer-nom" aria-hidden="true">Lo Ligam</p>

	<div class="footer-legal">
		<p use:scramble={{ oc: tagline.oc, fr: tagline.fr, lang }}>{lang === 'oc' ? tagline.oc : tagline.fr}</p>
		<div class="footer-legal-links">
			<span>© 2026 Lo Ligam</span>
			<a class="footer-legal-link" href="/mencions-legalas"
				><span use:scramble={{ oc: 'Mentions legalas', fr: 'Mentions légales', lang }}>{lang === 'oc' ? 'Mentions legalas' : 'Mentions légales'}</span></a
			>
			<a class="footer-legal-link" href="/confidencialitat"
				><span use:scramble={{ oc: 'Confidencialitat', fr: 'Confidentialité', lang }}>{lang === 'oc' ? 'Confidencialitat' : 'Confidentialité'}</span></a
			>
			<span class="footer-legal-leu"
				><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', lang }}>{lang === 'oc' ? 'Accessibilitat' : 'Accessibilité'}</span><em
					use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}
				>{lang === 'oc' ? '· Lèu' : '· Bientôt'}</em></span
			>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
		/* Au-dessus des fonds fixes en canevas (accueil : z-index 0 et 1) */
		z-index: 2;
		overflow: hidden;
		margin-top: 4rem;
		padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1rem, 4vw, 3.4rem) 1.6rem;
		background: var(--t-fons);
		color: var(--t-tinta);
		border-top: 1px solid var(--t-linha);
	}

	.footer-colomnas {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 2rem;
		margin-bottom: 3.5rem;
	}

	.footer-col-title {
		margin: 0 0 0.9rem;
		font-family: var(--font-heading);
		font-size: 1.25rem;
		color: var(--t-aur);
	}

	/* Essai : le numéro du verbe en contour, au-dessus du verbe, comme sur l'accueil */
	.footer-num {
		display: block;
		margin-bottom: 0.15rem;
		font-weight: 400;
		font-size: 1.6rem;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px var(--t-aur);
	}

	.footer-grop {
		margin: 0.7rem 0 0.2rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	.footer-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.footer-link {
		display: inline-block;
		padding: 0.28rem 0;
		color: var(--t-tinta-2);
		text-decoration: none;
		transition:
			color 0.4s,
			transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
	}

	a.footer-link:hover,
	a.footer-link:focus-visible {
		color: var(--t-tinta);
		transform: translateX(6px);
	}

	.footer-link.leu em {
		margin-left: 0.4rem;
		font-style: normal;
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--t-terra-viu);
	}

	/* Le grand nom, qui remplit toute la largeur */
	.footer-nom {
		margin: 0 -0.02em;
		font-family: var(--font-heading);
		font-size: 19.5vw;
		line-height: 0.8;
		text-align: center;
		white-space: nowrap;
		color: var(--t-terra);
	}

	.footer-legal {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.8rem 1.6rem;
		margin-top: 1.6rem;
		/* place pour le bouton « Tornar amont » (46 px, fixé en bas à droite) */
		padding-right: 3.6rem;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}

	.footer-legal p {
		margin: 0;
	}

	.footer-legal-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.2rem;
	}

	.footer-legal-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-linha);
		text-underline-offset: 3px;
	}

	.footer-legal-link:hover {
		color: var(--t-tinta);
		text-decoration-color: var(--t-aur);
	}

	.footer-legal-leu em {
		font-style: normal;
		margin-left: 0.3rem;
	}

	a:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 4px;
	}
</style>
