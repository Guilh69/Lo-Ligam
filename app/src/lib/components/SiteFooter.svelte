<script>
	import Icona from '$lib/components/Icona.svelte';
	// Pied de page commun (cadre commun, refonte 2026-10-07 dans la charte de
	// l'esbòs de nuèch) : présent sur toutes les pages via le layout, plus
	// seulement sur l'accueil. Colonnes texte sur le même plan que le menu
	// (2026-10-15 : Se parla, S'apren, Se viu, Lo Ligam, comme le pied de page
	// de l'Alliance répète son menu ; source commune data/planSite.js), puis
	// les ressources et le grand nom « Lo Ligam » en terracotta. Couleurs de thème.
	import { scramble } from '$lib/actions/scramble';
	// Le texte est écrit dans le HTML du serveur (lisible sans JavaScript et
	// par les lecteurs d'écran) ; l'action scramble le remplace au montage.
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { externalLinks } from '$lib/data/siteSections';
	import { PLAN, LO_LIGAM } from '$lib/data/planSite.js';
	import PastilleAviat from './PastilleAviat.svelte';

	const PER_DEFAUT = { oc: 'Fach amb amor en Occitània.', fr: 'Fait avec amour en Occitanie.', es: 'Hecho con amor en Occitania.', en: 'Made with love in Occitania.', ca: 'Fet amb amor a Occitània.', ar: 'صُنع بكلّ حبّ في أوكسيتانيا.' };
	let { tagline = PER_DEFAUT } = $props();
	let lang = $derived(langStore.current);
</script>

{#snippet ligam(it)}
	{#if it.defòra}
		<a class="footer-link" href={it.href} target="_blank" rel="noopener noreferrer"
			>{tria(it)} <Icona nom="extern" size="0.9em" /></a
		>
	{:else}
		{#if it.aviat}
			<!-- page pas encore ouverte : affichée, sans lien (planSite.js, 2026-11-07) -->
			<span class="footer-link footer-aviat">{tria(it)} <PastilleAviat /></span>
		{:else}
			<a class="footer-link" href={it.href}><span use:scramble={{ oc: it.oc, fr: it.fr, es: it.es, en: it.en, ca: it.ca, ar: it.ar, lang }}>{tria(it)}</span></a>
		{/if}
	{/if}
{/snippet}

<footer class="site-footer">
	<nav class="footer-colomnas" aria-label={tria({ oc: 'Plan del site', fr: 'Plan du site', es: 'Mapa del sitio', en: 'Site map', ca: 'Mapa del web', ar: 'خريطة الموقع' })}>
			{#each PLAN as c (c.id)}
				<div class="footer-col">
					<p class="footer-col-title">
						<b class="footer-num">{c.n}</b>
						<span use:scramble={{ oc: c.oc, fr: c.fr, es: c.es, en: c.en, ca: c.ca, ar: c.ar, lang }}>{tria(c)}</span>
					</p>
					{#each c.grops as g, gi (gi)}
						{#if g.oc}<p class="footer-grop">{tria(g)}</p>{/if}
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
				<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', es: 'Recursos', en: 'Resources', ca: 'Recursos', ar: 'مصادر', lang }}>{tria({ oc: 'Ressorsas', fr: 'Ressources', es: 'Recursos', en: 'Resources', ca: 'Recursos', ar: 'مصادر' })}</p>
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
	</nav>

	<p class="footer-nom" aria-hidden="true">Lo Ligam</p>

	<div class="footer-legal">
		<p use:scramble={{ oc: tagline.oc, fr: tagline.fr, es: tagline.es, en: tagline.en, ca: tagline.ca, ar: tagline.ar, lang }}>{tria(tagline)}</p>
		<div class="footer-legal-links">
			<span>© 2026 Lo Ligam</span>
			<a class="footer-legal-link" href="/mencions-legalas"
				><span use:scramble={{ oc: 'Mencions legalas', fr: 'Mentions légales', es: 'Avisos legales', en: 'Legal notice', ca: 'Avís legal', ar: 'الإشعار القانوني', lang }}>{tria({ oc: 'Mencions legalas', fr: 'Mentions légales', es: 'Avisos legales', en: 'Legal notice', ca: 'Avís legal', ar: 'الإشعار القانوني' })}</span></a
			>
			<a class="footer-legal-link" href="/confidencialitat"
				><span use:scramble={{ oc: 'Confidencialitat', fr: 'Confidentialité', es: 'Privacidad', en: 'Privacy', ca: 'Privadesa', ar: 'الخصوصية', lang }}>{tria({ oc: 'Confidencialitat', fr: 'Confidentialité', es: 'Privacidad', en: 'Privacy', ca: 'Privadesa', ar: 'الخصوصية' })}</span></a
			>
			<a class="footer-legal-link" href="/accessibilitat"
				><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', es: 'Accesibilidad', en: 'Accessibility', ca: 'Accessibilitat', ar: 'إمكانية الوصول', lang }}>{tria({ oc: 'Accessibilitat', fr: 'Accessibilité', es: 'Accesibilidad', en: 'Accessibility', ca: 'Accessibilitat', ar: 'إمكانية الوصول' })}</span></a
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
		/* Limelight seulement pour les gros titres et les gros chiffres (cahier §11 du 2026-11-02) */
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--t-aur);
	}

	/* Le numéro du verbe en contour, au-dessus du verbe, comme sur l'accueil */
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

	/* Arabe : pas de majuscules ni d'espacement des lettres (ils séparent les lettres
	   liées), et une taille lisible (Joan, 26-10) */
	:global(html[lang='ar']) .footer-grop {
		font-size: 0.85rem;
		letter-spacing: normal;
		text-transform: none;
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

	.footer-aviat {
		cursor: default;
	}

	a.footer-link:hover,
	a.footer-link:focus-visible {
		color: var(--t-tinta);
		transform: translateX(6px);
	}

	/* Le grand nom, qui remplit toute la largeur */
	.footer-nom {
		margin: 0 -0.02em;
		font-family: var(--font-heading);
		font-size: 19.5vw;
		line-height: 0.8;
		text-align: center;
		white-space: nowrap;
		/* le terracotta vif de la palette : 5,9:1 sur le fond sombre, contre 3,8:1
		   pour le terracotta ordinaire (Romain, 2026-11-03 : « un meilleur contraste ») */
		color: var(--t-terra-viu);
	}

	.footer-legal {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.8rem 1.6rem;
		margin-top: 1.6rem;
		/* place pour le bouton « Tornar amont » (46 px, fixé en bas à droite) ; 4,2 rem
		   laisse un vrai espace entre le dernier lien et le bouton (Joan, 2026-11-03) */
		padding-right: 4.2rem;
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

	/* « Mettre sur une ligne » (Romain, 2026-11-03) : un lien ne se coupe jamais
	   en deux, et sur écran large les liens restent sur une seule ligne ; sur
	   téléphone ils passent à la ligne. Le seuil est en em (réglage de taille de
	   texte du navigateur compris). */
	.footer-legal-links > * {
		white-space: nowrap;
	}

	@media (min-width: 56em) {
		.footer-legal-links {
			flex-wrap: nowrap;
		}
	}

	.footer-legal-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-linha);
		text-underline-offset: 3px;
	}

	.footer-legal-link:hover {
		color: var(--t-tinta);
		text-decoration-color: var(--t-accion);
	}

	a:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
		border-radius: 4px;
	}
</style>
