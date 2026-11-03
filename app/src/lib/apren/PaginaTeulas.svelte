<script>
	// Le gabarit des pages de rubrique en cases de couleur (S'apren le
	// 2026-10-24, Amassa le 2026-10-25 : « la même logique avec les cases »,
	// Romain). Le numéro et le verbe en grand, une phrase, puis les cases ; la
	// première est la grande. Tous les textes et les cases se modifient sur la
	// page (édition sur place) : clés `<pagina>.titol`, `<pagina>.frasa` et la
	// liste `<pagina>.teulas`. La couleur et le pictogramme suivent la place de
	// la case et l'endroit où elle mène ($lib/apren/teulas.js).
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Pictograma from '$lib/apren/Pictograma.svelte';
	import { PALETAS, PALETA_PER_DEFAUT, pictoPer } from '$lib/apren/teulas.js';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { edicion, txt, ligam, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	/** pagina : 'apren', 'amassa'… ; rubrica : l'entrée du PLAN ; etiqueta : {oc, fr, es…} de la liste */
	let { pagina, rubrica, etiqueta, paleta = PALETA_PER_DEFAUT } = $props();

	const color = (i) => PALETAS[paleta][i % PALETAS[paleta].length];

	const apondreTeula = () =>
		apondre(`${pagina}.teulas`, 'bloc', {}, [
			['ligam', 'ligam', { oc: 'Nom', fr: 'Nom', ligam: '/' }],
			['sota', 'text', { oc: 'Segonda linha', fr: 'Sous-titre' }]
		]);
</script>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet t(clau)}{@const v = txt(clau)}<span lang={langStore.current}>{@render marcat(tria(v))}</span>{/snippet}

<div class="pagina">
<div class="capçal"><AppHeader /></div>

<main class="rubrica" class:ed-actiu={edicion.actiu}>
	<header class="cap">
		<h1>
			<b aria-hidden="true">{rubrica.n}</b>
			<span class="titol" hidden={amagat(`${pagina}.titol`)} use:editar={`${pagina}.titol`}>{@render t(`${pagina}.titol`)}</span>
		</h1>
		<p class="frasa" hidden={amagat(`${pagina}.frasa`)} use:editar={`${pagina}.frasa`}>{@render t(`${pagina}.frasa`)}</p>
	</header>

	<ul class="teulas" aria-label={tria(etiqueta)}>
		{#each lista(`${pagina}.teulas`) as b, i (b.clau)}
			{@const l = ligam(b.clau + '.ligam')}
			{@const [fons, tinta] = color(i)}
			{@const sensPagina = l.href.startsWith('#')}
			<li class="teula" class:granda={i === 0} style:--fons={fons} style:--tinta={tinta} style:--i={i} use:editar={b.clau}>
				<span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
				<!-- un lien réduit à une ancre (« #scena ») : case sans page pour l'instant,
				     affichée mais pas cliquable (Òbras, 2026-10-25) -->
				<svelte:element
					this={sensPagina ? 'span' : 'a'}
					class="teula-ligam"
					class:sens-pagina={sensPagina}
					href={sensPagina ? undefined : l.href}
					target={l.defòra ? '_blank' : undefined}
					rel={l.defòra ? 'noopener' : undefined}
					hidden={amagat(b.clau + '.ligam')}
					use:editar={b.clau + '.ligam'}
				>
					<span class="nom" lang={langStore.current}>{tria(l)}</span>
				</svelte:element>
				<p class="sota" hidden={amagat(b.clau + '.sota')} use:editar={b.clau + '.sota'}>{@render t(b.clau + '.sota')}</p>
				<span class="picto-plaça"><Pictograma nom={pictoPer(l.href)} size={i === 0 ? '7rem' : '3.6rem'} /></span>
			</li>
		{/each}
		{#if edicion.actiu}
			<li class="teula-apondre">
				<button type="button" class="ed-apondre" onclick={apondreTeula}>+ {tria({ oc: 'Apondre una teula', fr: 'Ajouter une case', es: 'Añadir una casilla', en: 'Add a tile', ca: 'Afegir una casella', ar: 'إضافة بطاقة' })}</button>
			</li>
		{/if}
	</ul>
</main>
</div>

<style>
	/* Le cadre des pages intérieures, comme /mots : fond du thème, une chaleur
	   de braise en haut à gauche, rien qui bouge ; bandeau pleine largeur */
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, color-mix(in srgb, var(--t-terra) 26%, transparent), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--t-aur) 9%, transparent), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}

	.rubrica {
		container: rubrica / inline-size;
		max-width: calc(72rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}

	/* Le titre : le numéro de la rubrique et le verbe, en grand (gabarit commun du 22-10) */
	.cap {
		margin-bottom: var(--esp-48);
	}
	h1 {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(3.2rem, 11vw, 8rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
	}
	h1 b {
		font-weight: 400;
		font-size: 0.42em;
		color: var(--t-aur);
	}
	/* Arabe (Joan, 26-10) : à côté du chiffre en Limelight, le titre arabe en graisse
	   normale paraît léger ; gras pour l'arabe */
	:global(html[lang='ar']) h1 .titol {
		font-weight: 700;
	}
	.frasa {
		max-width: 38ch;
		margin: var(--esp-16) 0 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.frasa :global(.aur) {
		color: var(--t-aur);
	}

	/* Les cases : quatre colonnes, la première occupe deux sur deux */
	.teulas {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.teula {
		position: relative;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
		/* « stretch » explicite : une case carrée s'aligne quand même sur la
		   plus haute de sa rangée (sinon, à taille intermédiaire, une case au
		   texte long dépasse ses voisines ; Romain, 2026-10-25) */
		align-self: stretch;
		padding: var(--esp-16);
		border-radius: 6px;
		background: var(--fons);
		color: var(--tinta);
		/* clip et non hidden : une case au texte long grandit au lieu de
		   rogner (titre de deux lignes sur téléphone, texte changé dans l'éditeur) */
		overflow: clip;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
		animation: arribar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 70ms);
	}
	.teula.granda {
		grid-column: span 2;
		grid-row: span 2;
		padding: var(--esp-32);
	}
	/* six cases (S'apren et sa grammaire, 2026-11-03) : la sixième en bandeau
	   sur toute la largeur, sous les cinq autres, sans trou */
	.teulas:has(> .teula:nth-child(6)):not(:has(> .teula:nth-child(7))) > .teula:nth-child(6) {
		grid-column: 1 / -1;
		aspect-ratio: auto;
	}
	/* trois cases seulement (Mèdias, 2026-10-25) : les deux petites prennent
	   chacune une demi-hauteur sur toute la largeur restante, sans trou */
	.teulas:has(> .teula:nth-child(3):last-child) .teula:not(.granda) {
		grid-column: span 2;
		aspect-ratio: auto;
	}
	@keyframes arribar {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	.num {
		font-family: var(--font-heading);
		font-size: 2.4rem;
		line-height: 1;
	}
	.granda .num {
		font-size: 4.5rem;
	}
	.teula-ligam {
		margin-top: var(--esp-8);
		color: inherit;
		text-decoration: none;
	}
	/* toute la case se clique (le lien s'étend sur elle) */
	.teula-ligam:not(.sens-pagina)::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.nom {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(1.25rem, 1.9vw, 1.6rem);
		line-height: 1.1;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.granda .nom {
		font-size: clamp(2rem, 4vw, 3.4rem);
	}
	.sota {
		max-width: 30ch;
		margin: var(--esp-8) 0 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.granda .sota {
		font-size: clamp(1.05rem, 1.4vw, 1.25rem);
	}
	.picto-plaça {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.teula:hover,
	.teula:focus-within {
		transform: translateY(-4px);
		box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
	}
	.teula:hover .picto-plaça,
	.teula:focus-within .picto-plaça {
		transform: scale(1.08) rotate(-4deg);
	}
	/* une case sans page ne bouge pas au survol : rien à cliquer */
	.teula:has(.sens-pagina):hover {
		transform: none;
		box-shadow: none;
	}
	.teula:has(.sens-pagina):hover .picto-plaça {
		transform: none;
	}
	.teula-ligam:focus-visible {
		outline: none;
	}
	.teula:has(.teula-ligam:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* En édition : la case et ses morceaux se touchent un par un */
	.ed-actiu .teula-ligam::after {
		display: none;
	}
	.ed-actiu .teula {
		animation: none;
	}
	.teula-apondre {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		border: 2px dashed var(--t-linha);
		border-radius: 6px;
	}

	/* Taille intermédiaire et téléphone : les petites cases font moins de
	   200 px de large, les textes prennent la taille du téléphone */
	@container rubrica (max-width: 960px) {
		.teula {
			padding: var(--esp-12);
		}
		.num {
			font-size: 1.8rem;
		}
		.granda .num {
			font-size: 3rem;
		}
		.nom {
			font-size: 1.05rem;
		}
		.sota {
			font-size: 0.85rem;
		}
		.picto-plaça :global(.picto) {
			width: 2.6rem;
			height: 2.6rem;
		}
	}

	/* Téléphone : deux colonnes, la grande case sur toute la largeur */
	@container rubrica (max-width: 640px) {
		.teulas {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--esp-8);
		}
		/* presque carrées, mais deux voisines ont toujours la même hauteur,
		   même quand l'une a un titre de deux lignes */
		.teula {
			aspect-ratio: auto;
			min-height: 10.5rem;
			padding: var(--esp-12);
		}
		.teula.granda {
			grid-row: auto;
			aspect-ratio: 1.15;
			padding: var(--esp-24);
		}
		.granda .picto-plaça :global(.picto) {
			width: 4.5rem;
			height: 4.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.teula,
		.picto-plaça {
			animation: none;
			transition: none;
		}
		.teula:hover,
		.teula:focus-within {
			transform: none;
		}
	}
	:global(html[data-leugier='on']) .teula {
		animation: none;
	}
</style>
