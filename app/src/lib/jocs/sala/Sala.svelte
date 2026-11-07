<script>
	// La salle de jeux (Romain, 2026-11-06) : on y arrive en entrant dans les
	// Jòcs, « un peu dans la logique du café pour la musique » : un lieu, ses
	// murs, des affiches. Chaque famille de jeux a son affiche (un paysage
	// d'Occitanie d'après une photo de Romain) et, dessous, ses jeux comme les
	// lignes d'une boutique d'applications : l'icône, le nom, la consigne, ce
	// que le jeu fait travailler, « Jogar » (un clic : on joue). Le filtre
	// « Fa trabalhar » ne garde que les jeux qui travaillent ce qu'on choisit.
	// Des cases de couleur comme S'apren, les dessins bougent un peu, le titre
	// ondule ; immobile si l'appareil demande moins d'animations. Le tèma calme
	// (épuré, immobile) a été retiré le 07-11 (Romain : « tu peux supprimer le
	// thème calme »). Catalogue : cataleg.js.
	import { tria, lang } from '$lib/stores/lang.svelte.js';
	import { CAPACITATS, FAMILHAS, jocsDe } from './cataleg.js';
	import Illustracion from './Illustracion.svelte';
	import Emblema from './Emblema.svelte';
	import MencionIA from '$lib/components/MencionIA.svelte';
	import { TEINTES, PUCES } from '$lib/styles/palette.js';
	import { onMount } from 'svelte';

	const T = {
		titol: { oc: 'La sala de jòcs', fr: 'La salle de jeux' },
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

	// La pièce de chaque puce « Fa trabalhar » : une couleur par thème (palette.js, PUCES ; Romain, 2026-11-07)
	const puce = (id) => (PUCES[id] ? `--pc-fons: ${PUCES[id][0]}; --pc-tinta: ${PUCES[id][1]};` : undefined);
	// Le titre : une couleur de la palette par lettre (l'or passe par --t-aur-gros pour se lire sur le clair)
	const COULEURS_TITRE = [TEINTES.rougeAction, 'var(--t-aur-gros)', TEINTES.bleu, TEINTES.olive, TEINTES.prune, TEINTES.brique, TEINTES.sarcelle];
	// Les confettis (option A de Romain, 2026-11-07) : des pièces de papier découpé, semées une fois pour
	// toutes (même suite à chaque chargement, donc rien ne change entre serveur et navigateur), autour
	// du titre et dans les marges ; elles restent derrière le contenu et bougent à peine
	const TEINTES_CONFETIS = [TEINTES.rougeAction, TEINTES.or, TEINTES.bleu, TEINTES.olive, TEINTES.prune, TEINTES.brique, TEINTES.sarcelle, TEINTES.orangeClair];
	const FORMES = ['rond', 'carre', 'triangle', 'demi', 'carre'];
	const ZONES = ['h', 'g', 'd', 'h', 'g', 'd', 'h']; // h : bandeau du titre, g : marge gauche, d : marge droite
	let confetisEl;
	// Les confettis flottent (Romain, 2026-11-07 : « comme s'ils flottaient… imagine la physique dans
	// l'espace ») : chacun dérive lentement et tourne sur lui-même ; la souris ou le doigt qui passe est
	// une main dans l'apesanteur : elle les emporte dans son sens et les écarte, ils gardent leur élan,
	// ralentissent à peine, rebondissent sur les bords et les uns sur les autres, et ne reviennent que
	// très lentement vers leur coin (un rappel presque nul, pas de ressort qui claque). Rien de tout cela
	// si l'appareil demande moins d'animations ou en réglage léger ; la boucle s'arrête hors écran.
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.leugier === 'on') return;
		const zone = confetisEl;
		const bal = [...zone.querySelectorAll('.c')].map((el, i) => ({
			el,
			x: 0, y: 0, // décalage par rapport à la place de départ (chocs, élan)
			vx: 0, vy: 0, // vitesse, en pixels par image à 60 images par seconde
			rot: 0, vr: 0, // rotation ajoutée par les chocs (degrés) et sa vitesse
			spin: (0.5 + ((i * 37) % 10) / 7) * (i % 2 ? 1 : -1), // sa rotation propre, en degrés par seconde
			ax: 4 + ((i * 53) % 9), ay: 4 + ((i * 29) % 9), // l'amplitude de sa dérive, en pixels
			fx: 0.35 + ((i * 17) % 10) / 14, fy: 0.3 + ((i * 11) % 10) / 15, // sa fréquence, radians par seconde
			ph: i * 2.399, // son départ dans la dérive (angle d'or : jamais deux pareils)
			hx: 0, hy: 0, r: 0 // sa place de départ et son rayon, mesurés
		}));
		let L = 0, H = 0;
		const mesurer = () => {
			L = zone.clientWidth;
			H = zone.clientHeight;
			for (const p of bal) {
				p.hx = p.el.offsetLeft + p.el.offsetWidth / 2;
				p.hy = p.el.offsetTop + p.el.offsetHeight / 2;
				p.r = (Math.max(p.el.offsetWidth, p.el.offsetHeight) / 2) * 0.92;
			}
		};
		mesurer();
		const ro = new ResizeObserver(mesurer);
		ro.observe(zone);

		let vu = true;
		let enRoute = 0;
		let avant = performance.now();
		const VMAX = 5;
		const image = (maintenant) => {
			enRoute = 0;
			const dt = Math.min(2.5, (maintenant - avant) / 16.667);
			avant = maintenant;
			const s = maintenant / 1000;
			const frot = 0.982 ** dt; // presque pas de frottement : on est dans l'espace
			const frotR = 0.992 ** dt;
			const pos = [];
			for (const p of bal) {
				// un rappel presque nul vers le coin d'origine : sans lui, tout finirait dans un coin de la salle
				p.vx += -0.00018 * p.x * dt;
				p.vy += -0.00018 * p.y * dt;
				p.vx *= frot;
				p.vy *= frot;
				p.vr *= frotR;
				const v = Math.hypot(p.vx, p.vy);
				if (v > VMAX) {
					p.vx *= VMAX / v;
					p.vy *= VMAX / v;
				}
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.rot += p.vr * dt + (p.spin / 60) * dt;
				const dx = p.ax * Math.sin(s * p.fx + p.ph);
				const dy = p.ay * Math.sin(s * p.fy + p.ph * 1.7);
				pos.push([p.hx + p.x + dx, p.hy + p.y + dy]);
			}
			// les bords de la salle : on rebondit, sans tout perdre
			for (let i = 0; i < bal.length; i++) {
				const p = bal[i];
				const q = pos[i];
				if (q[0] < p.r) { p.x += p.r - q[0]; q[0] = p.r; p.vx = Math.abs(p.vx) * 0.85; }
				else if (q[0] > L - p.r) { p.x -= q[0] - (L - p.r); q[0] = L - p.r; p.vx = -Math.abs(p.vx) * 0.85; }
				if (q[1] < p.r) { p.y += p.r - q[1]; q[1] = p.r; p.vy = Math.abs(p.vy) * 0.85; }
				else if (q[1] > H - p.r) { p.y -= q[1] - (H - p.r); q[1] = H - p.r; p.vy = -Math.abs(p.vy) * 0.85; }
			}
			// les chocs entre confettis : même masse, rebond presque élastique, et un peu de rotation donnée
			for (let i = 0; i < bal.length; i++) {
				for (let j = i + 1; j < bal.length; j++) {
					const a = bal[i], b = bal[j];
					const ex = pos[j][0] - pos[i][0], ey = pos[j][1] - pos[i][1];
					const min = a.r + b.r;
					if (Math.abs(ex) > min || Math.abs(ey) > min) continue;
					const d = Math.hypot(ex, ey);
					if (d >= min || d === 0) continue;
					const nx = ex / d, ny = ey / d;
					const rec = (min - d) / 2;
					a.x -= nx * rec; a.y -= ny * rec; b.x += nx * rec; b.y += ny * rec;
					pos[i][0] -= nx * rec; pos[i][1] -= ny * rec; pos[j][0] += nx * rec; pos[j][1] += ny * rec;
					const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
					if (rv < 0) {
						const j2 = (-(1 + 0.88) * rv) / 2;
						a.vx -= j2 * nx; a.vy -= j2 * ny; b.vx += j2 * nx; b.vy += j2 * ny;
						a.vr -= Math.min(3, -rv) * 0.4; b.vr += Math.min(3, -rv) * 0.4;
					}
				}
			}
			// on ne dessine que ce qui est à l'écran
			const haut = zone.getBoundingClientRect().top;
			for (let i = 0; i < bal.length; i++) {
				const p = bal[i];
				const ecran = haut + pos[i][1];
				if (ecran < -80 || ecran > innerHeight + 80) continue;
				p.el.style.transform = `translate(${(pos[i][0] - p.hx).toFixed(2)}px, ${(pos[i][1] - p.hy).toFixed(2)}px) rotate(calc(var(--r) + ${p.rot.toFixed(2)}deg))`;
			}
			if (vu && !document.hidden) enRoute = requestAnimationFrame(image);
		};
		const relancer = () => {
			if (!enRoute && vu && !document.hidden) {
				avant = performance.now();
				enRoute = requestAnimationFrame(image);
			}
		};
		const io = new IntersectionObserver(([e]) => {
			vu = e.isIntersecting;
			relancer();
		});
		io.observe(zone);
		document.addEventListener('visibilitychange', relancer);
		relancer();

		// la main : le pointeur emporte et écarte ce qu'il frôle
		let dernier = null;
		let attente = null;
		const main = (x, y, rayon) => {
			const t = performance.now();
			let pvx = 0, pvy = 0;
			if (dernier) {
				const k = Math.max(1, t - dernier[2]) / 16.667;
				pvx = Math.max(-40, Math.min(40, (x - dernier[0]) / k));
				pvy = Math.max(-40, Math.min(40, (y - dernier[1]) / k));
			}
			dernier = [x, y, t];
			const b = zone.getBoundingClientRect();
			const mx = x - b.left, my = y - b.top;
			const s = t / 1000;
			for (const p of bal) {
				const cx = p.hx + p.x + p.ax * Math.sin(s * p.fx + p.ph);
				const cy = p.hy + p.y + p.ay * Math.sin(s * p.fy + p.ph * 1.7);
				const d = Math.hypot(cx - mx, cy - my);
				if (d > rayon) continue;
				const f = (1 - d / rayon) ** 1.5;
				const nx = (cx - mx) / (d || 1), ny = (cy - my) / (d || 1);
				p.vx += (nx * 1.4 + pvx * 0.12) * f;
				p.vy += (ny * 1.4 + pvy * 0.12) * f;
				p.vr += ((nx * pvy - ny * pvx) * 0.03 + p.spin * 0.01) * f;
			}
		};
		// au plus un calcul par image affichée, quelle que soit la vitesse du pointeur
		const passage = (x, y, rayon) => {
			const libre = !attente;
			attente = [x, y, rayon];
			if (libre)
				requestAnimationFrame(() => {
					const a = attente;
					attente = null;
					if (a) main(a[0], a[1], a[2]);
				});
		};
		const souris = (e) => {
			if (e.pointerType !== 'touch') passage(e.clientX, e.clientY, 95);
		};
		const doigt = (e) => {
			const t = e.touches[0];
			if (t) passage(t.clientX, t.clientY, 115);
		};
		const fin = () => (dernier = null);
		addEventListener('pointermove', souris, { passive: true });
		addEventListener('touchstart', doigt, { passive: true });
		addEventListener('touchmove', doigt, { passive: true });
		addEventListener('touchend', fin, { passive: true });
		return () => {
			cancelAnimationFrame(enRoute);
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', relancer);
			removeEventListener('pointermove', souris);
			removeEventListener('touchstart', doigt);
			removeEventListener('touchmove', doigt);
			removeEventListener('touchend', fin);
		};
	});
	const CONFETIS = (() => {
		let s = 11;
		const alea = () => (s = (s * 16807) % 2147483647) / 2147483647;
		return Array.from({ length: 46 }, (_, k) => ({
			zone: ZONES[k % ZONES.length],
			forme: FORMES[k % FORMES.length],
			style: `--x: ${alea().toFixed(3)}; --y: ${alea().toFixed(3)}; --t: ${10 + Math.round(alea() * 14)}px; --r: ${Math.floor(alea() * 360)}deg; --c: ${TEINTES_CONFETIS[Math.floor(alea() * TEINTES_CONFETIS.length)]}; --d: ${(5 + alea() * 5).toFixed(1)}s; --dl: -${(alea() * 6).toFixed(1)}s`
		}));
	})();
</script>

<div class="sala">
	<div class="confetis" aria-hidden="true" bind:this={confetisEl}>
		{#each CONFETIS as c, k (k)}<i class="c {c.zone}" style={c.style}><b class={c.forme}></b></i>{/each}
	</div>
	<header class="entrada">
		<h2 class="titol" lang={lg(T.titol)} aria-label={tria(T.titol)}>
			{#each letras as c, i (i)}<span aria-hidden="true" style="--i: {i}; --c: {COULEURS_TITRE[i % COULEURS_TITRE.length]}">{c ===' ' ? ' ' : c}</span>{/each}
		</h2>
	</header>

	<div class="filtre" role="group" aria-labelledby="sala-filtre">
		<span id="sala-filtre" class="pichon">{tria(T.faTrabalhar)}</span>
		<div class="causidas">
			<button type="button" class="pc pc-2 pc-chip" aria-pressed={filtre === null} onclick={() => (filtre = null)}>{tria(T.tot)}</button>
			{#each CAPACITATS as c (c.id)}
				<button type="button" class="pc pc-2 pc-chip" style={puce(c.id)} aria-pressed={filtre === c.id} onclick={() => (filtre = filtre === c.id ? null : c.id)}
					>{tria(c)}</button
				>
			{/each}
		</div>
	</div>

	<div class="familhas">
		{#each familhas as f, k (f.id)}
			<section class="familha f-{f.id}" style="--k: {k}" aria-labelledby="fam-{f.id}">
				<div class="quadre"><Illustracion id={f.id} /><MencionIA cadre /></div>
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
		position: relative;
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
		color: var(--c, var(--t-tinta));
		animation: onda-titol 3.6s ease-in-out infinite;
		animation-delay: calc(var(--i) * 80ms);
	}
	/* en sombre, les teintes foncées de la palette s'éclaircissent pour se lire sur le fond */
	:global(:root[data-tema='sorne']) .titol span {
		color: color-mix(in oklab, var(--c, var(--t-tinta)), #fff 42%);
	}
	/* ── les confettis : du papier découpé posé derrière le titre et dans les marges ── */
	.sala > :not(.confetis) {
		position: relative;
		z-index: 1;
	}
	.confetis {
		--zx0: 42cqw; /* le bandeau du titre commence à droite du titre */
		--yh: 5.6rem;
		--e: 1;
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: clip;
		pointer-events: none;
	}
	.c {
		position: absolute;
		display: block;
		width: calc(var(--t) * var(--e));
		height: calc(var(--t) * var(--e));
		transform: rotate(var(--r));
		filter: drop-shadow(0 3px 2px rgba(20, 10, 5, 0.3));
		will-change: transform;
		/* (le flottement est sur la forme, « .c b » : le déplacement par la souris s'y ajoute sans le couper) */
	}
	.c b {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--c);
	}
	.c .rond {
		border-radius: 50%;
	}
	.c .carre {
		border-radius: 3px;
	}
	.c .triangle {
		clip-path: polygon(50% 6%, 100% 94%, 0 94%);
	}
	.c .demi {
		height: 50%;
		border-radius: 999px 999px 0 0;
	}
	.c.h {
		left: calc(var(--zx0) + var(--x) * (98cqw - var(--zx0)));
		top: calc(0.2rem + var(--y) * var(--yh));
	}
	.c.g {
		left: calc(var(--x) * 1.8cqw);
		top: calc(var(--y) * 100%);
	}
	.c.d {
		left: calc(98.2cqw - var(--x) * 1.8cqw);
		top: calc(var(--y) * 100%);
	}
	/* téléphone : le titre prend presque toute la largeur, les confettis se serrent au-dessus de lui et dans les marges */
	@container (max-width: 40rem) {
		.confetis {
			--zx0: 4cqw;
			--yh: 0.4rem;
			--e: 0.45;
		}
	}
	/* la puce choisie garde sa couleur : elle se lève et prend un anneau */
	.causidas .pc-chip[aria-pressed='true'] {
		box-shadow:
			0 0 0 3px var(--t-fons),
			0 0 0 5px var(--t-tinta),
			0 4px 4px var(--pc-ombre);
	}
	.pichon {
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	button:not(.pc) {
		font: inherit;
		color: var(--t-tinta);
		cursor: pointer;
	}

	button:focus-visible,
	.joc:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
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
	/* le filtre : des pastilles de papier (lib/styles/papier.css), l'or marque la pièce choisie */

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
	/* des cases de couleur, comme S'apren */
	.familha {
		--t-tinta: var(--f-tinta);
		--t-tinta-2: var(--f-tinta-2);
		--t-linha: var(--f-linha);
		flex: 0 0 calc((100% - (var(--n) - 1) * var(--gap)) / var(--n));
		min-width: 0;
		display: grid;
		align-content: start;
		gap: 0.9rem;
		padding: 1rem 1rem 0.4rem;
		border-radius: 0.9rem;
		background: var(--f-fons);
		color: var(--f-tinta);
		animation: dintrar 0.6s ease-out both;
		animation-delay: calc(var(--k) * 90ms);
	}
	/* les teintes des familles : lib/styles/palette.js (JEUX) */
	.f-adreca {
		--f-fons: var(--p-jeu-adresse);
		--f-boton: var(--p-creme);
		--f-boton-tinta: var(--p-jeu-adresse);
	}
	.f-mots {
		--t-aur: #7a2e0c;
		--f-fons: var(--p-jeu-mots);
		--f-tinta: var(--p-encre);
		--f-tinta-2: rgba(42, 26, 16, 0.86);
		--f-linha: rgba(42, 26, 16, 0.22);
		--f-boton: var(--p-encre);
		--f-boton-tinta: var(--p-or-clair);
	}
	.f-observacion {
		--f-fons: var(--p-jeu-observation);
		--f-boton: var(--p-creme);
		--f-boton-tinta: var(--p-jeu-observation);
	}
	.f-memoria {
		--f-fons: var(--p-jeu-memoire);
		--f-boton: var(--p-creme);
		--f-boton-tinta: var(--p-jeu-memoire);
	}
	.f-escota {
		--f-fons: var(--p-jeu-ecoute);
		--f-boton: var(--p-creme);
		--f-boton-tinta: #1d4f7a;
	}
	.familha:not(.f-mots) {
		--f-tinta: var(--p-creme);
		--f-tinta-2: rgba(251, 241, 225, 0.94);
		--f-linha: rgba(251, 241, 225, 0.28);
	}
	/* l'illustration est posée à même la carte (papier découpé, Romain 06-11) ;
	   le petit rond « IA » se pose dans son coin bas (« facha per l'IA » sous
	   chaque dessin était « trop répétitif et visible »), à l'encre de la carte */
	.quadre {
		--mencion-tinta: var(--f-tinta-2);
		--mencion-tinta-fort: var(--f-tinta);
		--mencion-trait: var(--f-tinta);
		--mencion-fons: transparent;
		position: relative;
		transition: translate 0.4s ease;
	}
	.familha:hover .quadre {
		translate: 0 -3px;
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
	a.joc:hover .emb {
		animation: bolegar 0.5s ease;
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
		background: var(--f-boton);
		color: var(--f-boton-tinta);
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
			/* de la place pour l'anneau de la puce choisie et l'ombre des pièces, que le défilement couperait */
			padding: 7px 7px 9px;
			margin: -7px -7px -9px;
		}
		.causidas button {
			flex: none;
		}
		.filtre > .pichon {
			flex: none;
			white-space: nowrap;
		}
		/* des illustrations plus basses : les jeux restent près de leur dessin */
		.quadre :global(.illus) {
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
