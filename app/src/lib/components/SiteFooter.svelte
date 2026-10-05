<script>
	// Pied de page « éditorial aéré » (refonte 2026-10-06, demande Romain :
	// plus de bloc brun, plus d'icônes génériques — du texte, de l'air, la
	// typographie de la marque). Même source de vérité que le menu.
	import { scramble } from '$lib/actions/scramble';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { families, externalLinks } from '$lib/data/siteSections';

	let { tagline } = $props();
	let lang = $derived(langStore.current);
</script>

<footer class="site-footer">
	<div class="footer-naut">
		<div class="footer-marca">
			<p class="footer-nom">Lo Ligam</p>
			<p class="footer-tag" use:scramble={{ oc: tagline.oc, fr: tagline.fr, lang }}></p>
			<a
				class="footer-social"
				href="https://www.instagram.com/lo_ligam/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Instagram ↗
			</a>
		</div>

		<nav class="footer-colomnas" aria-label="Plan del site">
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
				</ul>
			</div>
		</nav>
	</div>

	<div class="footer-legal">
		<p>© 2026 Lo Ligam</p>
		<div class="footer-legal-links">
			<a class="footer-legal-link" href="/mencions-legalas"
				><span use:scramble={{ oc: 'Mentions legalas', fr: 'Mentions légales', lang }}></span></a
			>
			<a class="footer-legal-link" href="/confidencialitat"
				><span use:scramble={{ oc: 'Confidencialitat', fr: 'Confidentialité', lang }}></span></a
			>
			<span class="footer-legal-leu"
				><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', lang }}
				></span><em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em></span
			>
		</div>
	</div>
</footer>

<style>
	/* Clar, aerat, tipografic : lo pè de pagina es la darrièra frasa de la
	   pagina, pas una cava escura. Un simple filet sang e aur lo dubrís. */
	.site-footer {
		position: relative;
		background: var(--color-cream);
		color: var(--color-text);
		padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 5vw, 3rem) 2rem;
		border-top: 3px solid var(--color-terracotta);
		box-shadow: inset 0 3px 0 var(--color-gold);
	}

	.footer-naut {
		max-width: 72rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(14rem, 1.2fr) 2fr;
		gap: 2.5rem 4rem;
		align-items: start;
		text-align: left;
	}

	/* Lo nom en Limelight, grand e tranquille : la signatura du bas. */
	.footer-nom {
		margin: 0 0 0.5rem;
		font-family: var(--font-logo);
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1;
		color: var(--color-terracotta);
	}

	.footer-tag {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		opacity: 0.7;
		text-wrap: pretty;
		max-width: 20rem;
	}

	.footer-social {
		display: inline-block;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 2px solid var(--color-gold);
		padding-bottom: 0.1rem;
		transition: border-color 200ms ease, color 200ms ease;
	}

	.footer-social:hover {
		color: var(--color-terracotta);
		border-color: var(--color-terracotta);
	}

	.footer-colomnas {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
		gap: 2rem 1.5rem;
	}

	.footer-col-title {
		margin: 0 0 0.8rem;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--color-terracotta);
	}

	.footer-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer-link {
		display: inline-block;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.92rem;
		opacity: 0.85;
		transition: opacity 180ms ease, color 180ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	a.footer-link:hover {
		opacity: 1;
		color: var(--color-terracotta);
		transform: translateX(3px);
	}

	.footer-link.leu {
		opacity: 0.45;
	}

	.footer-link.leu em {
		font-style: normal;
		font-size: 0.82em;
		color: var(--color-gold);
		margin-left: 0.3em;
	}

	.footer-legal {
		max-width: 72rem;
		margin: 3rem auto 0;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(58, 42, 32, 0.15);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.footer-legal p {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.55;
	}

	.footer-legal-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
	}

	.footer-legal-link {
		font-size: 0.8rem;
		color: var(--color-text);
		opacity: 0.7;
		text-decoration: none;
		transition: opacity 150ms ease;
	}

	.footer-legal-link:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.footer-legal-leu {
		font-size: 0.8rem;
		opacity: 0.45;
	}

	.footer-legal-leu em {
		font-style: normal;
		font-size: 0.9em;
		margin-left: 0.2em;
	}

	@media (max-width: 52rem) {
		.footer-naut {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
