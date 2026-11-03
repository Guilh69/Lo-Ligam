<script>
	// Essai « la croix occitane dans les ronds du chemin de S'apren » (Romain, 2026-11-03,
	// Corrections_page_accueil.pdf p. 5 : « mettre dans les ronds une croix occitane, mon logo,
	// qui se charge pour finir pleine »). Trois variantes sur la même scène, à choisir en les
	// voyant. Page de travail, non indexée, en français (aucun texte d'ambiance en occitan).
	// Chaque scène se joue quand elle entre à l'écran et se rejoue au bouton. Si l'écran demande
	// moins d'animation, chaque scène s'affiche directement dans son état final.
	import { onMount } from 'svelte';
	import Scena from './Scena.svelte';

	const VIA = 'M22 120 C 70 120 66 88 108 84 S 168 70 178 44 S 214 24 238 20';
	const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
	const reduit = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const vide = () => ({ lits: [0, 0, 0, 0], plenas: [false, false, false, false] });

	let clar = $state(false);

	// --- A : de plus en plus de points allumés le long du chemin, le dernier rond plein
	const CIBLES = [3, 6, 9, 12];
	let a = $state(vide());
	let jetonA = 0;
	async function jogaA() {
		const jeton = ++jetonA;
		a = vide();
		if (reduit()) {
			a = { lits: [...CIBLES], plenas: [false, false, false, true] };
			return;
		}
		await pausa(400);
		for (let n = 0; n < 4; n++) {
			for (let k = 1; k <= CIBLES[n]; k++) {
				if (jeton !== jetonA) return;
				a.lits[n] = k;
				await pausa(120);
			}
			await pausa(200);
		}
		if (jeton === jetonA) a.plenas[3] = true;
	}

	// --- B : une seule croix qui suit le tracé en se chargeant
	let b = $state({ viatge: { x: 22, y: 120, acesa: 0, plena: false } });
	let jetonB = 0;
	async function jogaB() {
		const jeton = ++jetonB;
		const chem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		chem.setAttribute('d', VIA);
		const L = chem.getTotalLength();
		const pos = (t) => chem.getPointAtLength(t * L);
		b.viatge = { x: 22, y: 120, acesa: 0, plena: false };
		if (reduit()) {
			const f = pos(1);
			b.viatge = { x: f.x, y: f.y, acesa: 12, plena: true };
			return;
		}
		await pausa(500);
		const t0 = performance.now();
		const DUREE = 5000;
		await new Promise((fin) => {
			const pas = (ara) => {
				if (jeton !== jetonB) return fin();
				const u = Math.min((ara - t0) / DUREE, 1);
				const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
				const p = pos(e);
				b.viatge = { x: p.x, y: p.y, acesa: Math.round(e * 12), plena: false };
				if (u < 1) requestAnimationFrame(pas);
				else fin();
			};
			requestAnimationFrame(pas);
		});
		if (jeton === jetonB) {
			const f = pos(1);
			b.viatge = { x: f.x, y: f.y, acesa: 12, plena: true };
		}
	}
	// les quatre ronds d'aujourd'hui, le dernier plein, pendant que la croix voyage
	const bPlenas = $derived([false, false, false, b.viatge.plena]);

	// --- C : chaque rond se charge à son tour, puis devient plein
	let c = $state(vide());
	let jetonC = 0;
	async function jogaC() {
		const jeton = ++jetonC;
		c = vide();
		if (reduit()) {
			c = { lits: [12, 12, 12, 12], plenas: [true, true, true, true] };
			return;
		}
		await pausa(400);
		for (let n = 0; n < 4; n++) {
			for (let k = 1; k <= 12; k++) {
				if (jeton !== jetonC) return;
				c.lits[n] = k;
				await pausa(85);
			}
			await pausa(120);
			if (jeton !== jetonC) return;
			c.plenas[n] = true;
			await pausa(300);
		}
	}

	// chaque scène se joue la première fois qu'elle est vue à moitié
	function vist(node, joga) {
		const io = new IntersectionObserver(
			(lignas) => {
				if (lignas.some((l) => l.isIntersecting)) {
					io.disconnect();
					joga();
				}
			},
			{ threshold: 0.5 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<svelte:head>
	<title>Essai · la croix dans les ronds · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="banc" class:clar>
	<header class="cap">
		<p class="retorn"><a href="/">← Lo Ligam</a></p>
		<h1>La croix occitane dans les ronds du chemin</h1>
		<p class="intro">
			Les trois variantes partent de la même scène : le chemin de S'apren, ses quatre ronds. La croix est celle de ton logo :
			douze points qui s'allument un à un, dans le sens des aiguilles d'une montre. Pleine, elle passe au rouge du logo sur un rond d'or.
		</p>
		<div class="fons" role="group" aria-label="Fond de la page">
			<button type="button" aria-pressed={!clar} onclick={() => (clar = false)}>Fond sombre</button>
			<button type="button" aria-pressed={clar} onclick={() => (clar = true)}>Fond clair</button>
		</div>
	</header>

	<section class="var">
		<h2><span class="lletra">·</span> Aujourd'hui</h2>
		<p>Les quatre ronds, sans croix, comme sur le site.</p>
		<div class="scena-ensag"><Scena ronds={false} plenas={[false, false, false, true]} /></div>
	</section>

	<section class="var" use:vist={jogaA}>
		<h2><span class="lletra">A</span> La croix qui se remplit le long du chemin</h2>
		<p>Une croix dans chaque rond, avec de plus en plus de points allumés : 3, puis 6, puis 9, puis les 12 du dernier rond, qui devient plein.</p>
		<div class="scena-ensag"><Scena lits={a.lits} plenas={a.plenas} /></div>
		<button type="button" class="rejoua" onclick={jogaA}>Rejouer</button>
	</section>

	<section class="var" use:vist={jogaB}>
		<h2><span class="lletra">B</span> Une seule croix qui voyage</h2>
		<p>Une croix suit le tracé en se chargeant et arrive pleine dans le dernier rond. Les ronds restent comme aujourd'hui.</p>
		<div class="scena-ensag"><Scena ronds={false} plenas={bPlenas} viatge={b.viatge} /></div>
		<button type="button" class="rejoua" onclick={jogaB}>Rejouer</button>
	</section>

	<section class="var" use:vist={jogaC}>
		<h2><span class="lletra">C</span> Chaque rond se charge à son tour</h2>
		<p>Les quatre croix se remplissent l'une après l'autre. À la fin, les quatre ronds sont pleins.</p>
		<div class="scena-ensag"><Scena lits={c.lits} plenas={c.plenas} /></div>
		<button type="button" class="rejoua" onclick={jogaC}>Rejouer</button>
	</section>

	<p class="fin">Dis-moi la lettre qui te plaît (A, B ou C), ou un mélange : je la mets alors sur le vrai chemin de S'apren.</p>
</main>

<style>
	.banc {
		--fons: #22100a;
		--tinta: #fbf1e1;
		--or: #f6b73c;
		--linha: rgba(251, 241, 225, 0.2);
		min-height: 100vh;
		padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
		background: var(--fons);
		color: var(--tinta);
		font-family: var(--font-body, sans-serif);
	}
	.banc.clar {
		--fons: #f7f3ee;
		--tinta: #2a1a10;
		--or: #9c5611;
		--linha: rgba(42, 26, 16, 0.2);
	}
	.cap,
	.var,
	.fin {
		max-width: 46rem;
		margin-inline: auto;
	}
	.retorn a {
		color: var(--or);
		font-weight: 700;
		text-decoration: none;
	}
	h1 {
		margin: 0.6rem 0 0.8rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 5vw, 2.8rem);
		line-height: 1.1;
	}
	.intro {
		max-width: 38rem;
		line-height: 1.55;
	}
	.fons {
		display: inline-flex;
		gap: 0.5rem;
		margin-top: 0.6rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--linha);
		border-radius: 999px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		border-color: var(--or);
		color: var(--or);
	}
	.var {
		margin-top: 2.6rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--linha);
	}
	h2 {
		margin: 0 0 0.4rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
	.lletra {
		display: inline-block;
		min-width: 1.6em;
		color: var(--or);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5em;
	}
	.scena-ensag {
		width: min(100%, 34rem);
		margin: 1rem 0 0.6rem;
	}
	.rejoua {
		margin-top: 0.4rem;
	}
	.fin {
		margin-top: 3rem;
		font-weight: 700;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--or);
		outline-offset: 3px;
	}
</style>
