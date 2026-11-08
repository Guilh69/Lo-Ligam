<script>
	// Le fond qui flotte (page d'essai /ensag/flotants, 2026-11-07) : deux pistes de Romain.
	//  - « confettis » : de tout petits morceaux de papier de couleur, que la main écarte ;
	//  - « objets » : des objets en papier découpé (objets.js) qu'on peut faire virevolter et attraper :
	//    le mot occitan s'affiche, puis l'objet déguerpit et revient plus tard.
	// Retour de Romain (08-11) : « ça a parasité beaucoup trop le fond, il faut que ce soit en arrière » :
	// la couche est derrière tout le contenu, pâlie et petite ; on attrape un objet en cliquant ou en
	// touchant l'endroit où on le voit, même sous du texte (le clic passe au contenu comme d'habitude,
	// et un objet est attrapé s'il est là ; jamais quand on clique un lien, un bouton ou un champ).
	// 2e retour (08-11) : « éviter absolument le conflit avec le texte » : les pièces contournent les blocs de
	// texte dense (paragraphes, listes, titres), sans mur : lancées à la main, elles peuvent passer derrière ;
	// objets plus gros et plus nombreux ; attraper plus clair : l'objet visé s'éclaire, grossit et ralentit,
	// le curseur devient une main, et le toucher au doigt a une marge généreuse.
	// Décor : rien n'est lu par un lecteur d'écran, sauf le mot attrapé (zone « polie » cachée).
	// Rien ne bouge si l'appareil demande moins d'animations (les pièces sont juste posées).
	import { onMount, tick } from 'svelte';
	import { flotter } from './moteur.js';
	import { OBJETS } from './objets.js';
	import { TEINTES as T } from '$lib/styles/palette.js';

	// fond : monté une fois dans le gabarit racine (routes/+layout.svelte), VRAIMENT derrière tout le contenu
	// (z-index -1) : texte, photos, carte, illustrations, tuiles de couleur les cachent (Romain, 08-11 : « il faut
	// que ce soit un vrai fond, que les objets cachent les confettis »). La multiplication essayée d'abord les
	// laissait transparaître sur les images. Les pièces contournent aussi les photos, cartes et illustrations
	// (zones d'évitement), pour qu'elles ne se glissent pas dans les transparences. Rien du tout si l'appareil
	// demande moins d'animations.
	let { mode = 'confettis', fond = false, onattrape = () => {} } = $props();

	let zone;
	let fils = $state(null); // le canevas des fils fins qui relient la main aux confettis qu'elle tient
	let pieces = $state([]);
	let mot = $state(null);
	let annonce = $state('');
	let moteur = null;

	const FORMES = ['rond', 'carre', 'triangle', 'demi', 'carre'];
	const TEINTES = [T.rougeAction, T.or, T.bleu, T.olive, T.prune, T.brique, T.sarcelle, T.orangeClair];
	const confettis = (n, petit) => {
		let s = 29;
		const alea = () => (s = (s * 16807) % 2147483647) / 2147483647;
		return Array.from({ length: n }, (_, k) => ({
			forme: FORMES[k % FORMES.length],
			style: `--t: ${((4 + alea() * 5) * (petit ? 0.85 : 1)).toFixed(1)}px; --c: ${TEINTES[Math.floor(alea() * TEINTES.length)]}`
		}));
	};

	onMount(() => {
		if (fond && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const petit = innerWidth < 640;
		// sur un grand écran, deux exemplaires de chaque objet (le texte les repousse vers les marges)
		const copies = innerWidth >= 1100 ? 2 : 1;
		pieces = mode === 'objets' ? Array.from({ length: OBJETS.length * copies }, (_, k) => ({ ...OBJETS[k % OBJETS.length] })) : confettis(petit ? 46 : 90, petit);
		let arret = false;
		let toucher = null;
		let arretTexte = null;
		tick().then(() => {
			if (arret) return;
			const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on';
			const objets = mode === 'objets';
			moteur = flotter(zone, [...zone.querySelectorAll('.p')], {
				immobile: reduit,
				// les objets se laissent frôler sans fuir à toute vitesse : il faut pouvoir les attraper
				rayon: objets ? 70 : 95,
				rayonDoigt: objets ? 85 : 115,
				radial: objets ? 0.8 : 1.4,
				transfert: objets ? 0.16 : 0.12,
				// confettis (Romain, 08-11, sur le modèle de la constellation de l'accueil) : la main attrape ceux du
				// secteur proche, les relie d'un fil fin, et un geste vif les lance dans tous les sens
				aimant: !objets,
				fils,
				vmax: objets ? 6 : 11,
				collisions: objets,
				fondu: fond,
				attrapables: objets,
				croisiere: objets ? [0.12, 0.3] : [0.1, 0.32],
				onAttrape: (p, c) => {
					const ob = pieces[p.i];
					mot = { oc: ob.oc, fr: ob.fr, x: Math.max(80, Math.min(c.L - 80, c.x)), haut: c.y < 100 ? c.y + 52 : c.y - 76 };
					annonce = `${ob.oc} : ${ob.fr}`;
					onattrape(ob);
				},
				onLache: () => {
					mot = null;
				}
			});
			if (!reduit) {
				// les blocs de texte dense, en pixels de la zone : relus au défilement, au redimensionnement et chaque 0,7 s
				const lire = () => {
					const b = zone.getBoundingClientRect();
					const rects = [];
					const rg = document.createRange();
					for (const e of document.querySelectorAll('p, li, h1, h2, h3, h4, blockquote, dd, figcaption, header, nav')) {
						const r = e.getBoundingClientRect();
						if (r.width < 60 || r.height < 14 || r.bottom < -80 || r.top > innerHeight + 80) continue;
						if (zone.contains(e)) continue;
						const barre = e.tagName === 'HEADER' || e.tagName === 'NAV';
						// un bandeau ou une barre qui contient déjà des titres ou des paragraphes : ce sont eux qu'on évite, pas le
						// conteneur (sinon tout le bandeau d'une page, titre compris, devient un grand blanc où rien ne passe : /mots)
						if (barre && e.querySelector('h1, h2, h3, h4, p')) continue;
						// un texte court mais grand (un titre, de gros chiffres) compte aussi : ce sont eux qu'on ne doit pas parasiter
						if ((e.textContent || '').trim().length < 25 && r.height < 34) continue;
						// l'emprise du texte lui-même, pas celle de son bloc : un titre court occupe toute la largeur de son bloc
						let t = r;
						rg.selectNodeContents(e);
						const tr = rg.getBoundingClientRect();
						if (tr.width > 8 && tr.height > 8) t = tr;
						rects.push({ l: t.left - b.left, t: t.top - b.top, r: t.right - b.left, b: t.bottom - b.top });
						if (rects.length >= 220) break;
					}
					// les blocs qui se suivent à moins de 34 px (titre puis paragraphe, paragraphes entre eux) ne font plus qu'une
					// zone : sinon une pièce se coincerait dans l'interstice, repoussée par les deux à la fois
					rects.sort((a, c) => a.t - c.t);
					const zones = [];
					for (const r of rects) {
						const g = zones.find((x) => Math.min(x.r, r.r) - Math.max(x.l, r.l) > 0.4 * Math.max(x.r - x.l, r.r - r.l) && r.t - x.b < 34);
						if (g) {
							g.l = Math.min(g.l, r.l);
							g.r = Math.max(g.r, r.r);
							g.t = Math.min(g.t, r.t);
							g.b = Math.max(g.b, r.b);
						} else zones.push({ ...r });
					}
					// les photos, cartes (canevas) et illustrations de bonne taille : zones à part, jamais fusionnées au texte
					if (fond) {
						let n = 0;
						for (const e of document.querySelectorAll('img, canvas, video, picture, iframe, svg, [role="img"]')) {
							if (zone.contains(e) || n >= 60) continue;
							const r = e.getBoundingClientRect();
							if (r.width < 90 || r.height < 90 || r.bottom < -80 || r.top > innerHeight + 80) continue;
							// un canevas ou une image qui recouvre l'écran (les calques de l'accueil) est un fond, pas un objet
							if (r.width * r.height > 0.55 * innerWidth * innerHeight) continue;
							zones.push({ l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top });
							n++;
						}
					}
					moteur?.eviter(zones);
				};
				let attendu = 0;
				const planifier = () => {
					if (!attendu) attendu = setTimeout(() => { attendu = 0; lire(); }, 150); // au plus une relecture tous les 150 ms pendant un défilement
				};
				lire();
				addEventListener('scroll', planifier, { passive: true });
				addEventListener('resize', planifier);
				const minuteurTexte = setInterval(lire, 700);
				arretTexte = () => {
					clearTimeout(attendu);
					clearInterval(minuteurTexte);
					removeEventListener('scroll', planifier);
					removeEventListener('resize', planifier);
				};
			}
			if (objets && !reduit) {
				toucher = (e) => {
					// un lien, un bouton, un champ : on ne touche pas au jeu
					if (e.target.closest?.('a, button, input, select, textarea, label, summary, [role="button"], [contenteditable]')) return;
					if (getSelection()?.toString()) return;
					moteur?.attraperA(e.clientX, e.clientY, e.pointerType === 'touch' ? 28 : undefined);
				};
				addEventListener('click', toucher);
			}
		});
		return () => {
			arret = true;
			if (toucher) removeEventListener('click', toucher);
			arretTexte?.();
			moteur?.arreter();
		};
	});
</script>

<div class="couche" class:objets={mode === 'objets'} class:fond bind:this={zone} aria-hidden="true">
	{#if mode !== 'objets'}<canvas class="fils" bind:this={fils}></canvas>{/if}
	{#each pieces as c, k (k)}
		{#if mode === 'objets'}
			<div class="p o">
				<svg viewBox="0 0 48 48" focusable="false">{@html c.svg}</svg>
			</div>
		{:else}
			<i class="p c" style={c.style}><b class={c.forme}></b></i>
		{/if}
	{/each}
	{#if mot}
		<div class="mot" style="left: {mot.x}px; top: {mot.haut}px"><b lang="oc">{mot.oc}</b><small>{mot.fr}</small></div>
	{/if}
</div>
<p class="sr" aria-live="polite">{annonce}</p>

<style>
	/* derrière tout : le contenu des pages est au-dessus et reçoit les clics */
	.couche {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}
	/* gabarit racine : vraiment derrière tout le contenu (au-dessus du seul fond de la page) ; pour qu'il se voie,
	   le cadre des pages (.pagina, .acuelh) devient transparent tant que la couche est là : voir app.css */
	.couche.fond {
		z-index: -1;
	}
	/* ── les confettis : du papier découpé, tout petit et pâli ── */
	.c {
		display: block;
		width: var(--t);
		height: var(--t);
		opacity: calc(0.6 * var(--fade, 1));
		filter: drop-shadow(0 1.5px 1px rgba(20, 10, 5, 0.25));
	}
	.c b {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--c);
	}
	/* les fils de l'aimant : sous les confettis, sur toute la zone */
	.fils {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	/* un confetti tenu par la main : plus franc, pour qu'on voie qu'il est pris */
	.c {
		transition: opacity 0.25s;
	}
	.c:global(.tenu) {
		opacity: calc(0.92 * var(--fade, 1));
	}
	.c .rond {
		border-radius: 50%;
	}
	.c .carre {
		border-radius: 1.5px;
	}
	.c .triangle {
		clip-path: polygon(50% 6%, 100% 94%, 0 94%);
	}
	.c .demi {
		height: 50%;
		border-radius: 999px 999px 0 0;
	}
	/* ── les objets : des pièces pleines, ombre courte, un peu pâlies ── */
	.o {
		--t: 50px;
		width: var(--t);
		height: var(--t);
		opacity: 0.72;
		filter: drop-shadow(0 2px 1.5px rgba(20, 10, 5, 0.25));
	}
	@media (max-width: 40rem) {
		.o {
			--t: 42px;
		}
	}
	/* l'objet que la souris est sur le point d'attraper : plein, éclairé d'un liseré clair (il grossit aussi, côté moteur) */
	.o:global(.chaud) {
		opacity: 1;
		filter: drop-shadow(0 0 3px #fff) drop-shadow(0 0 1.5px #fff) drop-shadow(0 3px 2px rgba(20, 10, 5, 0.3));
	}
	/* et le curseur devient une main, partout sauf sur ce qui se clique */
	:global(html[data-flotant-chaud] body *:not(a):not(button):not(input):not(select):not(textarea):not(summary)) {
		cursor: grab !important;
	}
	.o svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	/* ── le mot attrapé : une pièce d'ocre, bien lisible, comme les pièces « choisies » du site ── */
	.mot {
		position: absolute;
		display: grid;
		justify-items: center;
		gap: 0.1rem;
		padding: 0.45rem 1rem 0.5rem;
		border-radius: 12px;
		background: var(--pc-or-fons, #c7811b);
		color: var(--pc-or-tinta, #2a1a10);
		box-shadow: 0 4px 5px var(--pc-ombre, rgba(20, 10, 5, 0.32));
		transform: translateX(-50%);
		animation: sortir 0.28s cubic-bezier(0.2, 1.4, 0.4, 1) both;
		white-space: nowrap;
	}
	.mot b {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		line-height: 1.05;
	}
	.mot small {
		font-size: 0.78rem;
		font-weight: 700;
		opacity: 0.8;
	}
	@keyframes sortir {
		from {
			opacity: 0;
			transform: translateX(-50%) scale(0.6);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mot {
			animation: none;
		}
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
