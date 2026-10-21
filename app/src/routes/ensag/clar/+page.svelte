<script>
	// Refonte claire, étape 1 (2026-10-21, revisions/2026-10-21-refonte-claire.md) :
	// la même page en trois ambiances claires, seules les couleurs changent.
	// Principes retenus de leoparpeix.com (cahier §11, 2026-09-30) : fond clair
	// neutre, encre très foncée, une seule couleur vive par écran, un seul titre
	// géant, petit texte aligné sur une grille de 12 colonnes, images calmes,
	// animations de détail. Textes occitans repris tels quels du site.
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { VISTA, DIALECTES } from './dialectes.js';

	const VARIANTAS = [
		{ v: 'A', nom: 'Plâtre' },
		{ v: 'B', nom: 'Terre cuite' },
		{ v: 'C', nom: 'Ciel du Sud' }
	];
	const demandada = page.url.searchParams.get('var');
	let v = $state(VARIANTAS.some((x) => x.v === demandada) ? demandada : 'A');

	// L'ambiance choisie se garde dans l'adresse (?var=B), pour comparer et partager
	function causir(n) {
		v = n;
		replaceState('?var=' + n, {});
	}

	const PORTAS = [
		{ n: '01', titol: 'Se parla', desc: 'Una carta per lo veire', ligams: [
			['La carta', '/carta'], ['Lo wiki', '/wiki']
		] },
		{ n: '02', titol: 'S’apren', desc: 'De corses per l’aprene', img: ['romain-480.webp', 480, 496, 'Romain Périer', '50% 22%'], ligams: [
			['Lo parcors', '/aprene'], ['Leiçon d’ensag', '/aprene/essai'], ['Corses en visio', '#'], ['Ma progression', '/compte']
		] },
		{ n: '03', titol: 'Se viu', desc: 'De mots e d’òbras per lo viure', img: ['paisatge-640.webp', 640, 422, 'Collines de garrigue', '50% 50%'], ligams: [
			['Mots en imatges', '/mots'], ['Òbras', '/obras'], ['Articles', '/articles'],
			['Fòrum', '/forum'], ['Grops', '/grops'], ['Boita d’idèas', '/ideas']
		] }
	];
</script>

<svelte:head>
	<title>Lo Ligam · essai clair</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Lettres « en braise » au survol (décision du 2026-10-15), gardées dans le clair -->
{#snippet braisa(t)}{#each [...t] as c}{#if c === ' '}{' '}{:else}<span class="l">{c}</span>{/if}{/each}{/snippet}

<div class="esbos" data-var={v}>
	<header class="cap grasilha">
		<a class="marca" href="/"><img src="/ensag/clar/crotz.svg" alt="" />Lo Ligam</a>
		<p class="promesa">L’occitan se parla, s’apren, se viu</p>
		<div class="nav">
			<button type="button" aria-label="Menú"><i aria-hidden="true"></i><span>Menú</span></button>
			<a class="pilula" href="#reservar">Reservar un cors</a>
			<span class="lengas"><b>Òc</b> · Fr</span>
		</div>
	</header>

	<main>
		<section class="dobertura grasilha">
			<p class="etiqueta esvani" style="--i: 0">L’occitan</p>
			<h1 class="titol esvani" style="--i: 1" aria-label="Se parla. S’apren. Se viu.">
				<span class="linha" aria-hidden="true">{@render braisa('Se parla.')}</span>
				<span class="linha" aria-hidden="true">{@render braisa('S’apren.')}</span>
				<span class="linha" aria-hidden="true">{@render braisa('Se viu.')}</span>
			</h1>
			<div class="pè-dobertura esvani" style="--i: 3">
				<p class="sostitol">Una carta per lo veire, de corses per l’aprene, de mots e d’òbras per lo viure.</p>
				<div class="accions">
					<a class="boton" href="/carta">Dobrir la carta <span aria-hidden="true">→</span></a>
					<a class="ligam-fl" href="/aprene">Aprene l’occitan</a>
				</div>
			</div>
			<figure class="arc">
				<img src="/ensag/clar/erau-760.webp" width="760" height="1101" alt="La vallée de l’Hérault vue par une fenêtre de pierre" />
			</figure>
			<div class="chifras esvani" style="--i: 5">
				<p><b>≈ 600 000</b> locutors</p>
				<p><b>32</b> despartaments</p>
				<p><b>10</b> sègles de literatura</p>
			</div>
		</section>

		<section class="portas grasilha" aria-labelledby="portas-titol">
			<h2 id="portas-titol" class="amagat">Se parla, s’apren, se viu</h2>
			{#each PORTAS as p}
				<article class="porta">
					<figure>
						{#if p.img}
							<img src="/ensag/clar/{p.img[0]}" width={p.img[1]} height={p.img[2]} alt={p.img[3]} style="object-position: {p.img[4]}" loading="lazy" />
						{:else}
							<svg viewBox={VISTA} role="img" aria-label="Los sièis dialèctes de l’occitan">
								{#each DIALECTES as d, i}<path fill="var(--d{i + 1})" d={d.d} />{/each}
							</svg>
						{/if}
					</figure>
					<div class="porta-cap"><span class="num">{p.n}</span><h3>{p.titol}</h3></div>
					<p class="desc">{p.desc}</p>
					<ul class="ligams">
						{#each p.ligams as [t, href]}
							<li><a {href}>{t} <span aria-hidden="true">→</span></a></li>
						{/each}
					</ul>
				</article>
			{/each}
		</section>

		<section class="declaracion grasilha" aria-labelledby="decl-titol">
			<h2 id="decl-titol">Qu’es aquò, Lo Ligam ?</h2>
			<blockquote>
				<p>Aicí, l’occitan s’apren <mark>sens vergonha</mark> e <mark>amb benvolença,</mark> e cada leiçon fa <mark>ligam.</mark></p>
				<div class="signatura"><img src="/ensag/clar/romain-480.webp" alt="" loading="lazy" />Romain Périer</div>
			</blockquote>
		</section>
	</main>

	<footer class="pè grasilha">
		<a class="marca" href="/"><img src="/ensag/clar/crotz.svg" alt="" />Lo Ligam</a>
		<nav aria-label="Lo Ligam"><a href="/istoria">Mon istòria</a><a href="/contacte">Contacte</a><a href="https://www.instagram.com/lo_ligam/">Instagram</a></nav>
	</footer>

	<div class="causida" role="group" aria-label="Choisir l’ambiance de l’essai">
		{#each VARIANTAS as x}
			<button type="button" aria-pressed={v === x.v} onclick={() => causir(x.v)}>{x.v} · {x.nom}</button>
		{/each}
	</div>
</div>

<style>
	/* A « Plâtre » : le plus proche de Parpeix (plâtre, pierre, sable, encre brun-noir) */
	.esbos,
	.esbos[data-var='A'] {
		--fons: #f7f3ee; --f2: #ede6dc; --f3: #ddcfbd;
		--tinta: #2a1a10; --t2: #5e4b3e; --linha: rgba(42, 26, 16, 0.14);
		--brique: #b53d17; --or: #9c5611; --or-plen: #eeaf34;
		--bloc: #ede6dc; --bloc-t: #2a1a10; --bloc-t2: #5e4b3e; --mark: #b53d17;
		/* dialectes : gascon, lengadocian (en brique : la norme du site), provençal, lemosin, auvernhat, vivaroaupenc */
		--d1: #e2d4c1; --d2: #cf8f6c; --d3: #c6ae90; --d4: #e9dfd1; --d5: #b99d7d; --d6: #dacab4;
	}
	/* B « Terre cuite » : le crème de la charte, la brique en aplat comme sur le logo */
	.esbos[data-var='B'] {
		--fons: #f5ead8; --f2: #ebdcc4; --f3: #dcc3a0;
		--tinta: #3a2a20; --t2: #6a5444; --linha: rgba(58, 42, 32, 0.16);
		--bloc: #b53d17; --bloc-t: #fbf1e1; --bloc-t2: rgba(251, 241, 225, 0.82); --mark: #ffd47f;
		--d1: #ebc8a4; --d2: #c4552b; --d3: #d4946a; --d4: #f0d8bd; --d5: #dcae86; --d6: #e2bf9a;
	}
	/* C « Ciel du Sud » : plâtre et ciel, comme la fenêtre de pierre sur l'Hérault */
	.esbos[data-var='C'] {
		--fons: #f8f5f0; --f2: #e6eef2; --f3: #cfe0ea;
		--tinta: #2a1a10; --t2: #5a4a40; --linha: rgba(42, 26, 16, 0.14);
		--bloc: #dce8f0; --bloc-t: #2a1a10; --bloc-t2: #4f4640; --mark: #b53d17;
		--cap: #dde9f0; --cel: linear-gradient(#dde9f0, #e9f0f3 45%, var(--fons) 92%);
		--d1: #cfe0ea; --d2: #d58f6b; --d3: #e6dccd; --d4: #dfe9ef; --d5: #a3c2d6; --d6: #b8d0df;
	}

	.esbos {
		--marge: clamp(16px, 3.5vw, 64px);
		--gota: 24px;
		--pichon: 0.875rem; /* 14 px : interface, légendes */
		--cors: 1.125rem; /* 18 px : texte courant */
		--lent: cubic-bezier(0.22, 1, 0.36, 1);
		min-height: 100vh;
		background: var(--fons);
		color: var(--tinta);
		font: 400 var(--cors) / 1.5 'Luciole', system-ui, sans-serif;
		font-synthesis: none;
		transition: background-color 0.5s, color 0.5s;
	}
	.esbos a { color: inherit; text-decoration: none; }
	.esbos img { display: block; max-width: 100%; }
	.amagat { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

	.grasilha {
		display: grid; grid-template-columns: repeat(12, minmax(0, 1fr));
		column-gap: var(--gota); padding-inline: var(--marge);
	}

	/* ——— En-tête : nom | promesse | actions, sur les colonnes ——— */
	.cap { align-items: center; height: 72px; font-size: var(--pichon); position: sticky; top: 0; z-index: 5;
		background: color-mix(in srgb, var(--cap, var(--fons)) 88%, transparent); backdrop-filter: blur(8px); }
	.marca { grid-column: 1 / 4; display: flex; align-items: center; gap: 12px; font: 400 1.25rem/1 'Limelight', serif; }
	.marca img { width: 32px; height: 32px; transition: transform 0.8s var(--lent); }
	.marca:hover img { transform: rotate(45deg); }
	.promesa { grid-column: 4 / 8; color: var(--t2); margin: 0; }
	.nav { grid-column: 8 / 13; display: flex; justify-content: flex-end; align-items: center; gap: 24px; }
	.nav button { font: inherit; color: inherit; background: none; border: 0; padding: 12px 0; min-width: 44px; min-height: 44px; justify-content: center; cursor: pointer; display: flex; gap: 8px; align-items: center; }
	.nav button i { display: grid; gap: 4px; }
	.nav button i::before, .nav button i::after { content: ''; width: 16px; height: 1.5px; background: currentColor; }
	.pilula { background: var(--brique); color: #fff !important; padding: 12px 20px; border-radius: 999px; font-weight: 700; transition: transform 0.3s var(--lent); }
	.pilula:hover { transform: translateY(-2px); }
	.lengas { color: var(--t2); }
	.lengas b { color: var(--tinta); }

	/* ——— Ouverture ——— */
	.dobertura { min-height: calc(100svh - 72px); grid-template-rows: 1fr auto auto auto auto; padding-top: 32px; background: var(--cel, none); }
	.etiqueta { grid-column: 1 / 8; grid-row: 2; margin: 0 0 24px; font-size: var(--pichon); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--or); display: flex; align-items: center; gap: 12px; }
	.etiqueta::before { content: ''; width: 48px; height: 1px; background: currentColor; }
	.titol { grid-column: 1 / 8; grid-row: 3; margin: 0; font: 400 clamp(3.5rem, 8.4vw, 10.5rem) / 0.94 'Limelight', serif; letter-spacing: -0.01em; }
	.titol .linha { display: block; }
	.titol .linha:last-child { color: var(--brique); }
	.titol :global(.l) { background: linear-gradient(to top, var(--or-plen, #eeaf34) 50%, currentColor 50%) 0 0 / 100% 200% no-repeat;
		-webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
		transition: background-position 2.4s var(--lent); }
	.titol :global(.l:hover) { background-position: 0 100%; transition-duration: 0.35s; }
	.pè-dobertura { grid-column: 1 / 8; grid-row: 4; display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 24px 48px; margin-top: 32px; }
	.sostitol { margin: 0; max-width: 34ch; font-size: 1.25rem; line-height: 1.45; color: var(--t2); }
	.accions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 32px; }
	.accions a { white-space: nowrap; }
	.boton { background: var(--brique); color: #fff !important; font-weight: 700; padding: 16px 28px; border-radius: 999px; display: inline-flex; gap: 12px; align-items: center; transition: transform 0.3s var(--lent), box-shadow 0.3s; }
	.boton:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -12px var(--brique); }
	.boton span, .ligam-fl span, .ligams span { transition: transform 0.3s var(--lent); }
	.boton:hover span, .ligam-fl:hover span, .ligams a:hover span { transform: translateX(4px); }
	.ligam-fl { font-weight: 700; border-bottom: 1.5px solid currentColor; padding: 8px 0 4px; display: inline-flex; gap: 8px; }
	.arc { grid-column: 8 / 13; grid-row: 1 / 5; align-self: end; justify-self: end; margin: 0;
		height: min(72svh, 680px); aspect-ratio: 3 / 4; border-radius: 999px 999px 8px 8px; overflow: hidden; background: var(--f2);
		animation: dobrir 1.4s var(--lent) both 0.2s; }
	.arc img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 60%; }
	@keyframes dobrir { from { clip-path: inset(100% 0 0 0 round 999px 999px 8px 8px); } to { clip-path: inset(0 0 0 0 round 999px 999px 8px 8px); } }
	.chifras { grid-column: 1 / 13; grid-row: 5; display: grid; grid-template-columns: subgrid; margin-top: 48px; padding-block: 16px 24px; border-top: 1px solid var(--linha); font-size: var(--pichon); color: var(--t2); }
	.chifras p { grid-column: span 4; margin: 0; }
	.chifras b { color: var(--tinta); }

	/* ——— Les trois portes ——— */
	.portas { padding-block: 128px 96px; row-gap: 48px; }
	.porta { grid-column: span 4; display: flex; flex-direction: column; }
	.porta figure { margin: 0 0 24px; aspect-ratio: 4 / 3; border-radius: 8px; overflow: hidden; background: var(--f2); }
	.porta figure img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--lent); }
	.porta:hover figure img { transform: scale(1.03); }
	.porta figure svg { width: 100%; height: 100%; padding: 24px; }
	.porta figure path { stroke: var(--f2); stroke-width: 1.2; stroke-linejoin: round; transition: fill 0.6s; }
	.porta-cap { display: flex; align-items: baseline; gap: 16px; }
	.num { font-size: var(--pichon); color: var(--t2); font-variant-numeric: tabular-nums; }
	.porta h3 { margin: 0; font: 400 clamp(2.25rem, 3.2vw, 3.25rem) / 1 'Limelight', serif; }
	.desc { margin: 12px 0 24px; color: var(--t2); }
	.ligams { list-style: none; margin: 0; padding: 0; border-bottom: 1px solid var(--linha); }
	.ligams a { display: flex; justify-content: space-between; align-items: center; min-height: 48px; border-top: 1px solid var(--linha); transition: color 0.3s, padding 0.3s var(--lent); }
	.ligams a:hover { color: var(--brique); padding-left: 8px; }

	/* ——— Déclaration ——— */
	.declaracion { background: var(--bloc); color: var(--bloc-t); padding-block: 128px; transition: background-color 0.5s, color 0.5s; }
	.declaracion h2 { grid-column: 1 / 4; margin: 0; font: 700 var(--pichon) / 1.5 'Luciole', sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bloc-t2); }
	.declaracion blockquote { grid-column: 4 / 12; margin: 0; }
	.declaracion blockquote p { margin: 0; font-size: clamp(1.75rem, 3vw, 2.75rem); line-height: 1.25; max-width: 26ch; }
	.declaracion mark { background: none; color: var(--mark); font-weight: 700; }
	.signatura { display: flex; align-items: center; gap: 16px; margin-top: 48px; font-size: var(--pichon); color: var(--bloc-t2); }
	.signatura img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; object-position: 50% 20%; }

	/* ——— Pied de page ——— */
	.pè { align-items: center; padding-block: 32px 112px; font-size: var(--pichon); color: var(--t2); }
	.pè .marca { color: var(--tinta); }
	.pè nav { grid-column: 4 / 13; display: flex; gap: 32px; justify-content: flex-end; }
	.pè nav a { padding-block: 12px; }

	/* ——— Sélecteur de l'essai (outil, pas le site) ——— */
	.causida { position: fixed; right: 16px; bottom: 16px; z-index: 9; display: flex; gap: 4px; padding: 4px;
		background: #fff; color: #2a1a10; border-radius: 999px; box-shadow: 0 8px 32px -8px rgba(42, 26, 16, 0.35); font: 700 0.8125rem/1 'Luciole', sans-serif; }
	.causida button { font: inherit; color: inherit; border: 0; background: none; padding: 12px 16px; border-radius: 999px; cursor: pointer; white-space: nowrap; }
	.causida button[aria-pressed='true'] { background: #2a1a10; color: #fff; }

	/* ——— Entrée en douceur, une fois ——— */
	.esvani { animation: montar 0.9s var(--lent) both; animation-delay: calc(var(--i, 0) * 90ms + 100ms); }
	@keyframes montar { from { opacity: 0; transform: translateY(16px); } }
	@media (prefers-reduced-motion: reduce) {
		.esbos *, .esbos *::before, .esbos *::after { animation: none !important; transition: none !important; }
	}

	/* ——— Téléphone ——— */
	@media (max-width: 860px) {
		.promesa, .lengas { display: none; }
		.marca { grid-column: 1 / 7; }
		.nav { grid-column: 7 / 13; gap: 16px; }
		.pilula { padding: 10px 14px; white-space: nowrap; font-size: 0.8125rem; }
		.dobertura { grid-template-rows: auto; min-height: 0; padding-top: 32px; }
		.etiqueta, .titol, .pè-dobertura, .arc, .chifras { grid-column: 1 / 13; grid-row: auto; }
		.arc { justify-self: stretch; height: auto; max-height: 64svh; margin-top: 40px; }
		.chifras { grid-template-columns: repeat(3, 1fr); column-gap: 16px; margin-top: 24px; }
		.chifras p { grid-column: auto; }
		.chifras b { display: block; }
		.portas { padding-block: 96px 64px; }
		.porta { grid-column: 1 / 13; }
		.declaracion { padding-block: 96px; }
		.declaracion h2, .declaracion blockquote { grid-column: 1 / 13; }
		.declaracion h2 { margin-bottom: 24px; }
		.pè nav { grid-column: 1 / 13; justify-content: flex-start; flex-wrap: wrap; gap: 16px 24px; margin-top: 24px; }
		.pè .marca { grid-column: 1 / 13; }
		.causida { left: 16px; justify-content: space-between; }
		.causida button { padding: 12px 10px; }
	}
	@media (max-width: 400px) {
		.nav button span { display: none; }
	}
</style>
