<script>
	// La salle de jeux (Romain, 2026-11-06) : on y arrive en entrant dans les
	// Jòcs, « un peu dans la logique du café pour la musique » : un lieu, ses
	// murs, des affiches. Chaque famille de jeux a son affiche (un paysage
	// d'Occitanie d'après une photo de Romain) et, dessous, ses jeux comme les
	// lignes d'une boutique d'applications : l'icône, le nom, la consigne, ce
	// que le jeu fait travailler, « Jogar » (un clic : on joue). Le filtre
	// « Fa trabalhar » ne garde que les jeux qui travaillent ce qu'on choisit.
	// Deux tèmas : calme (par défaut : épuré, rien ne bouge) et joiós (des
	// cases de couleur comme S'apren, les affiches s'animent, le titre ondule),
	// immobile si l'appareil demande moins d'animations. Catalogue : cataleg.js.
	import { tria, lang } from '$lib/stores/lang.svelte.js';
	import { CAPACITATS, FAMILHAS, jocsDe } from './cataleg.js';
	import Afica from './Afica.svelte';
	import Emblema from './Emblema.svelte';
	import MencionIA from '$lib/components/MencionIA.svelte';

	let { tema = 'joios', causirTema = () => {} } = $props();

	const T = {
		titol: { oc: 'La sala de jòcs', fr: 'La salle de jeux' },
		tema: { oc: 'Tèma', fr: 'Thème' },
		calme: { oc: 'Calme', fr: 'Calme' },
		joios: { oc: 'Joiós', fr: 'Festif' },
		faTrabalhar: { oc: 'Fa trabalhar', fr: 'Fait travailler' },
		tot: { oc: 'Tot', fr: 'Tout' },
		jogar: { oc: 'Jogar', fr: 'Jouer' },
		avenir: { oc: 'A venir', fr: 'À venir' }
	};
	// la langue réellement affichée (tria retombe sur l'occitan)
	const lg = (o) => (o?.[lang.current] ? lang.current : o?.oc ? 'oc' : 'fr');
	const capacitat = (id) => CAPACITATS.find((c) => c.id === id);

	let filtre = $state(null);
	let familhas = $derived(FAMILHAS.map((f) => ({ ...f, jocs: jocsDe(f.id, filtre) })).filter((f) => f.jocs.length));
	let letras = $derived([...tria(T.titol)]);
</script>

<div class="sala" class:joios={tema === 'joios'}>
	<header class="entrada">
		<h2 class="titol" lang={lg(T.titol)} aria-label={tria(T.titol)}>
			{#each letras as c, i (i)}<span aria-hidden="true" style="--i: {i}">{c === ' ' ? ' ' : c}</span>{/each}
		</h2>
		<div class="tema" role="group" aria-labelledby="sala-tema">
			<span id="sala-tema" class="pichon">{tria(T.tema)}</span>
			<div class="tema-botons">
				<button type="button" aria-pressed={tema === 'calme'} onclick={() => causirTema('calme')}>{tria(T.calme)}</button>
				<button type="button" aria-pressed={tema === 'joios'} onclick={() => causirTema('joios')}>{tria(T.joios)}</button>
			</div>
		</div>
	</header>

	<div class="filtre" role="group" aria-labelledby="sala-filtre">
		<span id="sala-filtre" class="pichon">{tria(T.faTrabalhar)}</span>
		<div class="causidas">
			<button type="button" aria-pressed={filtre === null} onclick={() => (filtre = null)}>{tria(T.tot)}</button>
			{#each CAPACITATS as c (c.id)}
				<button type="button" aria-pressed={filtre === c.id} onclick={() => (filtre = filtre === c.id ? null : c.id)}
					>{tria(c)}</button
				>
			{/each}
		</div>
	</div>

	<div class="familhas">
		{#each familhas as f, k (f.id)}
			<section class="familha f-{f.id}" style="--k: {k}" aria-labelledby="fam-{f.id}">
				<div class="quadre"><Afica id={f.afica} {tema} /><MencionIA cadre /></div>
				<h3 id="fam-{f.id}" class="familha-nom" lang={lg(f)}>{tria(f)}</h3>
				<ul class="jocs">
					{#each f.jocs as j (j.id)}
						<li>
							{#if j.disponible}
								<a class="joc" href="?joc={j.id}">
									<span class="emb"><Emblema id={j.id} /></span>
									<span class="cors">
										<span class="linha-nom">
											<span class="nom" lang="oc">{j.nom}</span>
											<span class="jogar">{tria(T.jogar)}</span>
										</span>
										<span class="consigna" lang={lg(j.consigna)}>{tria(j.consigna)}</span>
										<span class="caps"
											><span class="caps-titol">{tria(T.faTrabalhar)}</span>{' '}{#each j.capacitats as c, n (c)}{#if n}{' · '}{/if}<span
													class:triat={filtre === c}>{tria(capacitat(c))}</span
												>{/each}</span
										>
									</span>
								</a>
							{:else}
								<div class="joc avenir">
									<span class="emb"><Emblema id={j.id} /></span>
									<span class="cors">
										<span class="linha-nom">
											<span class="nom" lang="oc">{j.nom}</span>
											<span class="marca-avenir">{tria(T.avenir)}</span>
										</span>
										{#if lang.current === 'fr'}<span class="consigna" lang="fr">{j.fr}</span>{/if}
										<span class="caps"
											><span class="caps-titol">{tria(T.faTrabalhar)}</span>{' '}{#each j.capacitats as c, n (c)}{#if n}{' · '}{/if}<span
													class:triat={filtre === c}>{tria(capacitat(c))}</span
												>{/each}</span
										>
									</span>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>

<style>
	.sala {
		container-type: inline-size;
		box-sizing: border-box;
		max-width: 1840px;
		margin-inline: auto;
		padding: clamp(1.2rem, 3vw, 2.4rem) clamp(1rem, 4vw, 3.5rem) 4rem;
		color: var(--t-tinta);
	}

	/* ── l'entrée : le titre, le tèma ── */
	.entrada {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem 2rem;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid var(--t-linha);
	}
	.titol {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 6.5vw, 5rem);
		line-height: 1;
	}
	.titol span {
		display: inline-block;
	}
	.pichon {
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.tema {
		display: grid;
		gap: 0.35rem;
	}
	button {
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}
	button:focus-visible,
	.joc:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	/* le tèma et le filtre : du texte, souligné d'or quand il est choisi */
	.tema-botons {
		display: flex;
		gap: 0 1.1rem;
	}

	/* ── le filtre ── */
	.filtre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 1.2rem;
		margin-top: 0.9rem;
	}
	.causidas {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.1rem;
	}
	.tema-botons button,
	.causidas button {
		min-height: 2.75rem;
		padding: 0.3rem 0 0.45rem;
		border: none;
		border-bottom: 2px solid transparent;
		background: none;
		color: var(--t-tinta-2);
	}
	.tema-botons button:hover,
	.causidas button:hover {
		color: var(--t-tinta);
	}
	.tema-botons button[aria-pressed='true'],
	.causidas button[aria-pressed='true'] {
		border-bottom-color: var(--t-aur);
		color: var(--t-tinta);
		font-weight: 600;
	}

	/* ── les familles : une affiche encadrée, ses jeux dessous ── */
	.familhas {
		--n: 1;
		--gap: 1.75rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3rem var(--gap);
		margin-top: 2rem;
	}
	@container (min-width: 36rem) {
		.familhas {
			--n: 2;
		}
	}
	@container (min-width: 58rem) {
		.familhas {
			--n: 3;
		}
	}
	@container (min-width: 88rem) {
		.familhas {
			--n: 5;
		}
	}
	.familha {
		flex: 0 0 calc((100% - (var(--n) - 1) * var(--gap)) / var(--n));
		min-width: 0;
		display: grid;
		align-content: start;
		gap: 0.9rem;
	}
	/* la marge basse porte la signature « facha per l'IA » (Romain, 06-11 :
	   « Signature et ligne », MencionIA) */
	.quadre {
		position: relative;
		padding: 0.5rem 0.5rem 1.9rem;
		border: 1px solid var(--t-linha);
		background: var(--t-fons-2);
	}
	.familha-nom {
		margin: 0.15rem 0 0;
		font-family: var(--font-body);
		font-size: 1.15rem;
		font-weight: 700;
	}
	.jocs {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--t-linha);
	}
	.joc {
		display: grid;
		grid-template-columns: 2.6rem 1fr;
		gap: 0.85rem;
		align-items: start;
		padding: 0.85rem 0.15rem;
		border-bottom: 1px solid var(--t-linha);
		color: inherit;
		text-decoration: none;
	}
	a.joc:hover .nom {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.emb {
		width: 2.6rem;
		height: 2.6rem;
	}
	.cors {
		display: grid;
		gap: 0.3rem;
		min-width: 0;
	}
	.linha-nom {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
	}
	.nom {
		font-size: 1.02rem;
		font-weight: 600;
	}
	.jogar {
		flex: none;
		padding: 0.3rem 0.85rem;
		border-radius: 0.5rem;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font-size: 0.88rem;
		font-weight: 600;
	}
	.consigna {
		font-size: 0.92rem;
		line-height: 1.4;
		color: var(--t-tinta-2);
	}
	.caps {
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.caps-titol {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.caps .triat {
		color: var(--t-tinta);
		text-decoration: underline;
		text-decoration-color: var(--t-aur);
		text-underline-offset: 3px;
	}
	/* un jeu à venir : sans bouton, nom en texte secondaire, marque en
	   pointillé ; pas de transparence (contraste AA sur toutes les cases) */
	.avenir .emb {
		opacity: 0.6;
	}
	.avenir .nom {
		color: var(--t-tinta-2);
	}
	.marca-avenir {
		flex: none;
		padding: 0.12rem 0.5rem;
		border: 1px dashed var(--t-linha);
		border-radius: 0.4rem;
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}

	/* ── joiós : des cases de couleur, les affiches accrochées de travers ── */
	.joios .titol span:nth-child(3n + 2) {
		color: var(--t-aur);
	}
	.joios .titol span:nth-child(3n) {
		color: var(--t-terra-viu);
	}
	.joios .titol span {
		animation: onda-titol 3.6s ease-in-out infinite;
		animation-delay: calc(var(--i) * 80ms);
	}
	.joios .familha {
		--t-tinta: var(--f-tinta);
		--t-tinta-2: var(--f-tinta-2);
		--t-linha: var(--f-linha);
		padding: 1rem 1rem 0.4rem;
		border-radius: 0.9rem;
		background: var(--f-fons);
		color: var(--f-tinta);
		animation: dintrar 0.6s ease-out both;
		animation-delay: calc(var(--k) * 90ms);
	}
	.joios .f-adreca {
		--f-fons: var(--color-terracotta);
		--f-boton: #fbf1e1;
		--f-boton-tinta: var(--color-terracotta);
	}
	.joios .f-mots {
		--t-aur: #7a2e0c;
		--f-fons: var(--color-gold);
		--f-tinta: #2a1a10;
		--f-tinta-2: rgba(42, 26, 16, 0.86);
		--f-linha: rgba(42, 26, 16, 0.22);
		--f-boton: #2a1a10;
		--f-boton-tinta: #ffd47f;
	}
	.joios .f-observacion {
		--f-fons: #4f6a2f;
		--f-boton: #fbf1e1;
		--f-boton-tinta: #4f6a2f;
	}
	.joios .f-memoria {
		--f-fons: var(--color-teal);
		--f-boton: #fbf1e1;
		--f-boton-tinta: var(--color-teal);
	}
	.joios .f-escota {
		--f-fons: #2b6496;
		--f-boton: #fbf1e1;
		--f-boton-tinta: #1d4f7a;
	}
	.joios .familha:not(.f-mots) {
		--f-tinta: #fbf1e1;
		--f-tinta-2: rgba(251, 241, 225, 0.94);
		--f-linha: rgba(251, 241, 225, 0.28);
	}
	.joios .quadre {
		/* cadre crème sur toutes les cartes : la signature prend l'encre sombre,
		   pas la teinte claire de la carte (sinon crème sur crème) */
		--mencion-tinta: rgba(42, 26, 16, 0.86);
		--mencion-tinta-fort: #2a1a10;
		--mencion-trait: #b53d17;
		border: none;
		background: #fbf6ee;
		box-shadow: 0 12px 26px -16px rgba(0, 0, 0, 0.7);
		rotate: -1.2deg;
		transition:
			rotate 0.4s ease,
			translate 0.4s ease;
	}
	.joios .familha:nth-child(even) .quadre {
		rotate: 1deg;
	}
	.joios .familha:hover .quadre {
		rotate: 0deg;
		translate: 0 -3px;
	}
	.joios .jogar {
		background: var(--f-boton);
		color: var(--f-boton-tinta);
	}
	.joios a.joc:hover .emb {
		animation: bolegar 0.5s ease;
	}
	.joios .tema-botons button[aria-pressed='true'],
	.joios .causidas button[aria-pressed='true'] {
		border-bottom-color: var(--t-terra-viu);
	}
	@keyframes onda-titol {
		0%,
		60%,
		100% {
			transform: none;
		}
		75% {
			transform: translateY(-0.08em);
		}
	}
	@keyframes dintrar {
		from {
			opacity: 0;
			translate: 0 14px;
		}
	}
	@keyframes bolegar {
		30% {
			rotate: -9deg;
		}
		70% {
			rotate: 7deg;
		}
	}

	/* ── téléphone : le filtre défile sur une ligne ── */
	@container (max-width: 36rem) {
		.entrada {
			align-items: flex-start;
			flex-direction: column;
		}
		.filtre {
			flex-wrap: nowrap;
			align-items: baseline;
		}
		.causidas {
			flex-wrap: nowrap;
			overflow-x: auto;
			scrollbar-width: none;
		}
		.causidas button {
			flex: none;
		}
		.filtre > .pichon {
			flex: none;
			white-space: nowrap;
		}
		/* des affiches plus basses : les jeux restent près de leur affiche */
		.quadre :global(.afica) {
			aspect-ratio: 16 / 9;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sala *,
		.sala {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
