<script>
	import { scramble } from '$lib/actions/scramble';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import logo from '$lib/assets/logo.png';
	import { siteSections, externalLinks } from '$lib/data/siteSections';
	import BookIcon from '$lib/components/BookIcon.svelte';
	import OccitaniaIcon from '$lib/components/OccitaniaIcon.svelte';
	import CommunityIcon from '$lib/components/CommunityIcon.svelte';
	import QuillIcon from '$lib/components/QuillIcon.svelte';
	import CrossIcon from '$lib/components/CrossIcon.svelte';
	import EnvelopeIcon from '$lib/components/EnvelopeIcon.svelte';

	const sectionIcons = {
		book: BookIcon,
		occitania: OccitaniaIcon,
		community: CommunityIcon,
		quill: QuillIcon,
		cross: CrossIcon,
		envelope: EnvelopeIcon
	};

	let { tagline } = $props();
	let lang = $derived(langStore.current);
</script>

<footer class="site-footer">
	<div class="footer-top">
		<div class="footer-about">
			<div class="footer-brand-row">
				<span class="mini-logo"><img src={logo} alt="" /></span>
				<span class="footer-brand">Lo Ligam</span>
			</div>
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

		<div class="footer-col">
			<p class="footer-col-title" use:scramble={{ oc: 'Explorar', fr: 'Explorer', lang }}></p>
			<ul>
				{#each siteSections as s (s.id)}
					{@const Icon = sectionIcons[s.icon]}
					<li>
						{#if s.status === 'live'}
							<a class="footer-link" href={s.href} style="--section-color: {s.color}">
								<span class="footer-icon"><Icon size={15} /></span>
								<span use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
							</a>
						{:else}
							<span
								class="footer-link soon-inline"
								style="--section-color: {s.color}"
							>
								<span class="footer-icon"><Icon size={15} /></span>
								<span use:scramble={{ oc: s.oc, fr: s.fr, lang }}></span>
								<em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<div class="footer-col">
			<p class="footer-col-title" use:scramble={{ oc: 'Ressorsas', fr: 'Ressources', lang }}
			></p>
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
			<span class="soon-inline"
				><span use:scramble={{ oc: 'Accessibilitat', fr: 'Accessibilité', lang }}
				></span><em use:scramble={{ oc: '· Lèu', fr: '· Bientôt', lang }}></em></span
			>
		</div>
	</div>
</footer>

<style>
	/* Repris de la barre du haut : le pied de page réaffiche la même
	   pastille de logo. */
	.mini-logo {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		overflow: hidden;
		display: block;
		box-shadow: 0 2px 8px rgba(165, 52, 42, 0.25);
	}

	.mini-logo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.site-footer {
		position: relative;
		background: var(--color-text);
		color: var(--color-cream);
		padding: 3rem 1.5rem 8rem;
		margin-top: 2rem;
	}

	.footer-top {
		max-width: 60rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.3fr 1fr 1fr;
		gap: 2.5rem;
		text-align: left;
	}

	.footer-brand-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}

	.footer-brand {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.15rem;
		color: white;
	}

	.footer-tag {
		margin: 0 0 0.9rem;
		font-size: 0.85rem;
		color: rgba(245, 234, 216, 0.75);
		text-wrap: pretty;
		max-width: 22rem;
	}

	.footer-social {
		display: inline-block;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-gold);
		text-decoration: none;
	}

	.footer-social:hover {
		text-decoration: underline;
	}

	.footer-col-title {
		margin: 0 0 0.75rem;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-gold);
	}

	.footer-col-title em {
		text-transform: none;
		font-weight: 400;
		letter-spacing: normal;
		color: rgba(245, 234, 216, 0.6);
	}

	.footer-col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.footer-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: rgba(245, 234, 216, 0.9);
		text-decoration: none;
		font-size: 0.9rem;
	}

	.footer-link:hover {
		color: var(--color-gold);
	}

	.footer-icon {
		display: inline-flex;
		color: var(--section-color, var(--color-gold));
		flex-shrink: 0;
	}

	.soon-inline em {
		font-weight: 400;
		font-style: normal;
		opacity: 0.65;
		font-size: 0.82em;
		margin-left: 0.3em;
	}

	.soon-inline {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.9rem;
		color: rgba(245, 234, 216, 0.55);
	}

	.footer-legal {
		max-width: 60rem;
		margin: 2.5rem auto 0;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(245, 234, 216, 0.15);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.footer-legal p {
		margin: 0;
		font-size: 0.8rem;
		color: rgba(245, 234, 216, 0.6);
	}

	.footer-legal-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
	}

	.footer-legal-links .soon-inline {
		font-size: 0.8rem;
	}

	.footer-legal-link {
		font-size: 0.8rem;
		color: rgba(245, 234, 216, 0.75);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.footer-legal-link:hover {
		color: var(--color-cream);
		text-decoration: underline;
	}

	@media (max-width: 45rem) {
		.footer-top {
			grid-template-columns: 1fr;
			gap: 1.75rem;
		}
	}
</style>
