<script>
	// Une case de l'atelier Bastir : la même que les cases de couleur des pages de
	// rubrique (PaginaTeulas, exception voulue de la charte) : aplat plein, numéro
	// et titre en Limelight, une ligne, coins à 6 px. En bas à droite, à la place
	// du pictogramme, un signe qui sert (les leçons de l'unité, le compte des mots).
	let { href, num, titol, sota = '', pè = '', fons, tinta, i = 0, lang = 'oc', children } = $props();
</script>

<li class="teula" style:--fons={fons} style:--tinta={tinta} style:--i={i}>
	<span class="num" aria-hidden="true">{num}</span>
	<a class="ligam" {href}><span class="nom" {lang}>{titol}</span></a>
	{#if sota}<p class="sota">{sota}</p>{/if}
	<div class="pè">
		{#if pè}<span class="pè-tèxte">{pè}</span>{/if}
		{@render children?.()}
	</div>
</li>

<style>
	.teula {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 13rem;
		padding: 1rem;
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		overflow: clip;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 60ms);
	}
	.num {
		font-family: var(--font-heading);
		font-size: 2.2rem;
		line-height: 1;
	}
	.ligam {
		margin-top: 0.5rem;
		color: inherit;
		text-decoration: none;
	}
	/* toute la case se clique */
	.ligam::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.ligam:focus-visible {
		outline: none;
	}
	.teula:has(.ligam:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}
	.nom {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(1.2rem, 1.8vw, 1.5rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.sota {
		max-width: 30ch;
		margin: 0.5rem 0 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.pè {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: auto;
		padding-top: 1rem;
		font-size: 0.85rem;
	}
	.teula:hover,
	.teula:focus-within {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.teula {
			animation: none;
			transition: none;
		}
		.teula:hover,
		.teula:focus-within {
			transform: none;
		}
	}
</style>
