<script>
	// Pied de page commun (cadre commun, refonte 2026-10-07 dans la charte de
	// l'esbòs de nuèch) : présent sur toutes les pages via le layout, plus
	// seulement sur l'accueil. Colonnes texte (même source de vérité que le
	// menu), puis le grand nom « Lo Ligam » en terracotta. Couleurs de thème.
	import { scramble } from '$lib/actions/scramble';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { families, externalLinks } from '$lib/data/siteSections';

	const PER_DEFAUT = { oc: 'Fach amb amor en Occitània.', fr: 'Fait avec amour en Occitanie.' };
	let { tagline = PER_DEFAUT } = $props();
	let lang = $derived(langStore.current);
</script>

<footer class="site-footer">
	<nav class="footer-colomnas" aria-label={lang === 'oc' ? 'Plan del site' : 'Plan du site'}>
		{#each families as fam (fam.id)}
			<div class="footer-col">
				<p class="footer-col-title" use:scramble={{ oc: fam.oc, fr: fam.fr, lang }}></p>
				<ul>
					{#each fam.items as it (it.id)}
						<li>
							{#if it.status === 'live'}
								<a class="footer-link" href={it.href}>
									<span use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
								</a>
							{:else}
								<span class="footer-link leu">
									<span use:scramble={{ oc: it.oc, fr: it.fr, lang }}></span>
									<em use:scramble={{ oc: 'lèu', fr: 'bientôt', lang }}></em>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}

		<div class="footer-col">
			<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', lang }}></p>
			<ul>
				{#each externalLinks as l (l.href)}
					<li>
						<a class="footer-link" href={l.href} target="_blank" rel="noopener noreferrer"
							>{l.label} ↗</a
						>
					</li>
				{/each}
				<li>
					<a class="footer-link" href="https://www.instagram.com/lo_ligam/" target="_blank" rel="noopener noreferrer"
						>Instagram ↗</a
					>
				</li>
			</ul>
		</div>
	</nav>

	<p class="footer-nom" aria-hidden="true">Lo Ligam</p>

	<div class="footer-legal">
		<p use:scramble={{ oc: tagline.oc, fr: tagline.fr, lang }}></p>
		<div class="footer-legal-links">
			<span>© 2026 Lo Ligam</span>
			<a class="footer-legal-link" href="/mencions-legalas"
				><span use:scramble={{ oc: 'Mentions legalas', fr: 'Mentions légales', lang }}></span></a
			>
			<a class="footer-legal-link" href="/confidencialitat"
				><span use:scramble={{ oc: 'Confidencialitat', fr: 'Confidentialité', lang }}></span></a
			>
			<span class="footer-legal-leu"
				><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', lang }}></span><em
					use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}
				></em></span
			>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		position: relative;
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
