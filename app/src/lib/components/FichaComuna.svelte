<script>
	// La ficha d'una comuna causida sus la carta (retorn de Romain, 2026-10-11) :
	// son nom, sa silhoeta, una fòto, las chifras de basa (populacion e son
	// annada, susfàcia, altitud, gentilici), las primièras frasas de l'article
	// de Wikipèdia e lo ligam cap a l'article entièr. Las donadas venon de
	// /api/comuna (Wikidata e Wikipèdia, relaiats per nòstre servidor).
	import { fly, slide } from 'svelte/transition';
	import { VILAS_FICHAS } from '$lib/carta/vilasFichas.js';

	let { comuna, contorn = null, lang = 'oc', onTampar = null } = $props();

	// La ficha dins la lenga del luòc (retorn de Romain, 2026-10-11 : Liyon en
	// arpitan, Brest en breton ; « cocher oc si on veut voir en oc ») : son nom
	// local d'en primièr, puèi en occitan, puèi en francés ; lo tèxt de
	// Wikipèdia dins la lenga del luòc, e un tria per lo legir en occitan o en
	// francés. Las Wikipèdias de cada lenga de la carta (per las lengas d'oïl,
	// lo servidor garda la que nomena la vila coma nosautres ; lo galò n'a pas).
	const WIKIS = {
		catalan: ['ca'],
		arpitan: ['frp'],
		basc: ['eu'],
		breton: ['br'],
		alsacian: ['als'],
		francic: ['lb', 'pfl', 'ksh', 'li'],
		flamenc: ['vls', 'nl'],
		cors: ['co'],
		oil: ['pcd', 'wa', 'nrm'],
		picard: ['pcd'],
		galo: []
	};
	const LENGAS = {
		oc: ['Occitan', 'Occitan'],
		fr: ['Francés', 'Français'],
		ca: ['Catalan', 'Catalan'],
		frp: ['Arpitan', 'Arpitan'],
		eu: ['Basc', 'Basque'],
		br: ['Breton', 'Breton'],
		als: ['Alsacian', 'Alsacien'],
		lb: ['Francic', 'Francique'],
		pfl: ['Francic', 'Francique'],
		ksh: ['Francic', 'Francique'],
		li: ['Francic', 'Francique'],
		vls: ['Flamenc', 'Flamand'],
		nl: ['Neerlandés', 'Néerlandais'],
		co: ['Còrs', 'Corse'],
		pcd: ['Picard', 'Picard'],
		wa: ['Valon', 'Wallon'],
		nrm: ['Normand', 'Normand']
	};

	let dades = $state(null),
		cargant = $state(false),
		clauCargada = '';
	// d'en primièr la partida nauta (fòto, nom, chifras) ; lo tèxt, los ligams e
	// los crèdits se desplegan (retorn de Romain, 2026-10-11)
	let dobèrta = $state(false),
		lenguaCausida = $state(null);
	$effect(() => {
		comuna;
		dobèrta = false;
		lenguaCausida = null;
	});
	const fr = $derived(lang === 'fr');

	// Las lengas del luòc : la de sa zòna (« arpitan-69 » ; l'occitan pels
	// despartaments), puèi las de sa zòna de transicion (`lg`, Baiona en basc
	// e en occitan : SIG/cadena/comunas-mixtas.mjs) ; las autras lengas d'en
	// primièr, l'occitan aprèp (retorn de Romain, 2026-10-11)
	const lengas = $derived.by(() => {
		const z = contorn?.zona;
		const basa = z ? (/^[a-z]+-/.test(z) ? z.split('-')[0] : 'oc') : WIKIS[comuna?.dep] ? comuna.dep : 'oc';
		const l = [...new Set([basa, ...(contorn?.props?.lg ?? [])])];
		return [...l.filter((x) => x !== 'oc'), ...(l.includes('oc') ? ['oc'] : [])];
	});
	// (las que an una Wikipèdia ; lo servidor ne tria lo còdi)
	const autras = $derived(lengas.filter((l) => WIKIS[l]?.length));
	// (dins las listas de la carta, lo camp oc es lo nom dins la lenga de la lista)
	const deLenga = $derived(!!WIKIS[comuna?.dep]);

	$effect(() => {
		const c = comuna,
			i = contorn?.props?.i ?? null;
		if (!c) return;
		const q =
			(i && /^\d[\dAB]\d{3}$/.test(i) ? `i=${i}` : `nom=${encodeURIComponent(contorn?.props?.fr ?? c.fr)}&lat=${c.lat}&lon=${c.lon}`) +
			(autras.length ? `&l=${autras.map((l) => WIKIS[l].join(',')).join('.')}` + (deLenga ? `&nl=${encodeURIComponent(c.oc ?? '')}` : '') : '');
		if (q === clauCargada) return;
		clauCargada = q;
		dades = null;
		cargant = true;
		// (sens contorn encara : un moment d'espèra, que lo còdi INSEE pòt arribar)
		const espèra = i ? 0 : 1200;
		const t = setTimeout(() =>
		fetch('/api/comuna?' + q)
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (clauCargada !== q) return;
				dades = d?.id ? d : null;
				cargant = false;
			})
			.catch(() => (cargant = false)), espèra);
		return () => clearTimeout(t);
	});

	// los noms : dins las lengas del luòc, puèi en occitan, puèi en francés ;
	// lo primièr es lo títol. Un meteis nom dins doas lengas es escrich un còp,
	// amb sas doas lengas (Baiona : basc e occitan)
	const noms = $derived.by(() => {
		const c = comuna;
		if (!c) return [];
		const l = autras.map((lg, k) => {
			const cd = dades?.locals?.[k] ?? WIKIS[lg][0];
			return [cd, deLenga && lg === c.dep ? c.oc : dades?.nom?.[cd]];
		});
		l.push(['oc', deLenga ? dades?.nom?.oc : c.oc]);
		l.push(['fr', contorn?.props?.fr ?? dades?.nom?.fr ?? (deLenga ? null : c.fr)]);
		const r = [];
		for (const [cd, n] of l) {
			if (!n) continue;
			const ja = r.find((x) => x.n.toLowerCase() === n.toLowerCase());
			if (ja) ja.cds.push(cd);
			else r.push({ cds: [cd], n });
		}
		return r;
	});
	const nom = $derived(noms[0]?.n ?? comuna?.oc ?? '');
	const autresNoms = $derived(noms.slice(1));
	// la vila a sa pagina sul site (l'ancian repèr daurat de la carta)
	const fichaSite = $derived(comuna ? VILAS_FICHAS.find((v) => Math.abs(v.lat - comuna.lat) < 0.05 && Math.abs(v.lon - comuna.lon) < 0.07) : null);
	const nombre = (n, d = 0) => n.toLocaleString('fr-FR', { maximumFractionDigits: d });
	const chifras = $derived.by(() => {
		const d = dades,
			l = [];
		if (!d) return l;
		if (d.pop?.n) l.push(`${nombre(d.pop.n)} ${fr ? 'habitants' : 'abitants'}${d.pop.an ? ` (${d.pop.an})` : ''}`);
		if (d.km2) l.push(`${nombre(d.km2, 1)} km²`);
		if (d.alt != null) l.push(`${nombre(d.alt)} m`);
		return l;
	});
	const gentilici = $derived(fr ? dades?.gentilici?.fr : dades?.gentilici?.oc);
	// lo tèxt : dins la lenga del luòc d'en primièr, puèi en occitan, puèi en
	// francés (las lengas qu'an un article)
	const lenguasTèxt = $derived(
		dades ? [...(dades.locals ?? []), 'oc', 'fr'].filter((l, k, a) => l && a.indexOf(l) === k && (dades.extrach?.[l] || dades.wiki?.[l])) : []
	);
	const lt = $derived(lenguasTèxt.includes(lenguaCausida) ? lenguaCausida : lenguasTèxt[0]);
	const extrach = $derived(dades?.extrach?.[lt]);
	const wiki = $derived(dades?.wiki?.[lt]);
	const nomLenga = (l) => LENGAS[l]?.[fr ? 1 : 0] ?? l;
	// lo còdi de la lenga, coma lo boton Òc / Fr del site
	const còdi = (l) => (l === 'oc' ? 'Òc' : l[0].toUpperCase() + l.slice(1));

	// la silhoeta de la comuna, a l'escala de la vinheta
	const silhoeta = $derived.by(() => {
		const pols = contorn?.poligons;
		if (!pols?.length) return null;
		const k = Math.cos(((comuna?.lat ?? 45) * Math.PI) / 180);
		let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
		for (const p of pols) for (const a of p) for (const [x, y] of a) (x0 = Math.min(x0, x * k)), (x1 = Math.max(x1, x * k)), (y0 = Math.min(y0, -y)), (y1 = Math.max(y1, -y));
		const e = 56 / Math.max(x1 - x0, y1 - y0, 1e-9),
			dx = 4 + (56 - (x1 - x0) * e) / 2,
			dy = 4 + (56 - (y1 - y0) * e) / 2;
		return pols
			.flatMap((p) => p.map((a) => 'M' + a.map(([x, y]) => `${((x * k - x0) * e + dx).toFixed(1)},${((-y - y0) * e + dy).toFixed(1)}`).join('L') + 'Z'))
			.join('');
	});
</script>

{#if comuna}
	<section class="ficha-comuna" aria-label={nom} aria-live="polite" transition:fly={{ y: 16, duration: 260 }}>
		<button type="button" class="tampar" aria-label={fr ? 'Fermer' : 'Tampar'} onclick={() => onTampar?.()}>×</button>
		<div class="cap">
			{#if dades?.fòto}
				<img src={dades.fòto.url} alt={nom} loading="lazy" decoding="async" />
			{:else if silhoeta}
				<svg class="silh gran" viewBox="0 0 64 64" aria-hidden="true"><path d={silhoeta} fill-rule="evenodd" /></svg>
			{/if}
			<div class="cos">
				<h2 lang={noms[0]?.cds[0] ?? 'oc'}>
					{nom}{#if noms[0]}<span class="lg-titol" title={noms[0].cds.map(nomLenga).join(', ')}>{noms[0].cds.map(còdi).join(' · ')}</span>{/if}
				</h2>
				{#if autresNoms.length}
					<p class="autres">
						{#each autresNoms as { cds, n }, k (cds[0])}{#if k}<span class="sep" aria-hidden="true">·</span>{/if}<span
								class="lg"
								title={cds.map(nomLenga).join(', ')}>{cds.map(còdi).join(' · ')}</span
							>&nbsp;<span lang={cds[0]}>{n}</span>{/each}
					</p>
				{/if}
				{#if chifras.length}<p class="chifras">{chifras.join(' · ')}</p>{/if}
				{#if gentilici}<p class="gentilici">{fr ? 'Habitants' : 'Abitants'} : {gentilici}</p>{/if}
				{#if cargant}<p class="cargant" aria-hidden="true">…</p>{/if}
				{#if dades && (lenguasTèxt.length || fichaSite)}
					<button type="button" class="desplegar" aria-expanded={dobèrta} onclick={() => (dobèrta = !dobèrta)}
						>{dobèrta ? (fr ? 'Replier' : 'Plegar') : fr ? 'En savoir plus' : 'Legir mai'}<span class="chev" aria-hidden="true">▾</span></button
					>
				{/if}
			</div>
			{#if dades?.fòto && silhoeta}
				<svg class="silh" viewBox="0 0 64 64" aria-hidden="true"><path d={silhoeta} fill-rule="evenodd" /></svg>
			{/if}
		</div>
		{#if dades && dobèrta}
			<div class="mai" transition:slide={{ duration: 240 }}>
			{#if lenguasTèxt.length > 1}
				<!-- coma lo boton Òc / Fr del site, discret, a drecha del tèxt (retorn de Romain) -->
				<div class="lenguas" role="radiogroup" aria-label={fr ? 'Langue du texte' : 'Lenga del tèxt'} title={fr ? 'Langue du texte' : 'Lenga del tèxt'}>
					<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"
						><path d="M4 5h7" /><path d="M9 3v2c0 4.418 -2.239 8 -5 8" /><path d="M5 9c0 2.144 2.952 3.908 6.7 4" /><path d="M12 20l4 -9l4 9" /><path
							d="M19.1 18h-6.2"
						/></svg
					>
					{#each lenguasTèxt as l (l)}
						<button type="button" role="radio" aria-checked={l === lt} aria-label={nomLenga(l)} title={nomLenga(l)} onclick={() => (lenguaCausida = l)}
							>{còdi(l)}</button
						>
					{/each}
				</div>
			{/if}
			{#if extrach}<p class="extrach" lang={lt}>{extrach}</p>{/if}
			<footer>
				{#if fichaSite}
					{#if fichaSite.ligam}<a class="site" href={fichaSite.ligam}>{fr ? 'Découvrir la ville' : 'Descobrir la vila'} →</a>
					{:else}<span class="site leu">{fr ? 'Découvrir la ville : bientôt' : 'Descobrir la vila : lèu'}</span>{/if}
				{/if}
				{#if wiki}
					<a class="wiki" href={wiki} target="_blank" rel="noopener"
						>{fr ? "Lire l'article sur Wikipédia" : "Legir l'article sus Wikipèdia"} ↗</a
					>
				{/if}
				<p class="credits">
					{#if dades.fòto}{fr ? 'Photo' : 'Fòto'} : {#if dades.fòto.pagina}<a href={dades.fòto.pagina} target="_blank" rel="noopener">{dades.fòto.autor ?? 'Wikimedia Commons'}</a
						>{:else}{dades.fòto.autor ?? 'Wikimedia Commons'}{/if}{dades.fòto.licéncia ? `, ${dades.fòto.licéncia}` : ''}{' · '}{/if}{#if extrach}{fr ? 'Texte' : 'Tèxt'} : Wikipèdia, <a
							href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr"
							target="_blank"
							rel="noopener">CC BY-SA 4.0</a
						>{' · '}{/if}{fr ? 'Chiffres' : 'Chifras'} : Wikidata
				</p>
			</footer>
			</div>
		{/if}
	</section>
{/if}

<style>
	.ficha-comuna {
		position: absolute;
		z-index: 1150;
		left: 50%;
		bottom: 18px;
		transform: translateX(-50%);
		width: min(30rem, calc(100% - 24px));
		padding: 14px 16px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 14px;
		background: color-mix(in srgb, var(--t-fons-2) 88%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
		color: var(--t-tinta);
	}
	.tampar {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 30px;
		height: 30px;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: none;
		color: var(--t-tinta-2);
		font-size: 1.1rem;
		cursor: pointer;
	}
	.cap {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding-right: 30px;
	}
	img {
		flex: none;
		width: 96px;
		height: 96px;
		object-fit: cover;
		border-radius: 10px;
		border: 1px solid var(--t-linha);
	}
	.cos {
		flex: 1;
		min-width: 0;
	}
	h2 {
		margin: 0;
		font: 600 1.35rem/1.15 'Cormorant Garamond', Georgia, serif;
		font-style: italic;
		color: var(--t-aur-clar);
	}
	.autres,
	.gentilici,
	.cargant {
		margin: 2px 0 0;
		font-size: 0.8125rem;
		color: var(--t-tinta-2);
	}
	.autres .sep {
		margin: 0 7px;
	}
	/* (la lenga del títol, discreta, coma las autras) */
	.lg-titol {
		margin-left: 8px;
		font: 700 0.6875rem/1 var(--font-body);
		font-style: normal;
		vertical-align: 0.2em;
		color: color-mix(in srgb, var(--t-aur-clar) 70%, var(--t-tinta-2));
	}
	.autres .lg {
		font-size: 0.6875rem;
		font-weight: 700;
		color: color-mix(in srgb, var(--t-aur-clar) 70%, var(--t-tinta-2));
	}
	/* (flotant a drecha del tèxt : pas una linha de mai) */
	.lenguas {
		float: right;
		display: inline-flex;
		align-items: center;
		gap: 1px;
		margin: 10px 0 6px 12px;
		padding: 2px 2px 2px 7px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
	}
	.lenguas .ic {
		width: 13px;
		height: 13px;
		margin-right: 3px;
		fill: none;
		stroke: var(--t-tinta-2);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.lenguas button {
		padding: 2px 7px;
		border: 0;
		border-radius: 999px;
		background: none;
		color: var(--t-tinta-2);
		font: 700 0.6875rem/1.2 var(--font-body);
		cursor: pointer;
		transition:
			background 0.3s ease,
			color 0.3s ease;
	}
	.lenguas button:hover {
		color: var(--t-tinta);
	}
	.lenguas button[aria-checked='true'] {
		background: var(--t-tinta);
		color: var(--t-fons);
	}
	.lenguas button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.chifras {
		margin: 6px 0 0;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.silh {
		flex: none;
		width: 44px;
		height: 44px;
	}
	.silh.gran {
		width: 96px;
		height: 96px;
	}
	.silh path {
		fill: color-mix(in srgb, #f3c25a 18%, transparent);
		stroke: #f3c25a;
		stroke-width: 1.4;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}
	.extrach {
		margin: 10px 0 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}
	footer {
		clear: both;
		margin-top: 10px;
	}
	.site {
		display: inline-block;
		margin-right: 14px;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--t-aur-clar);
	}
	.site.leu {
		font-weight: 600;
		color: var(--t-tinta-2);
	}
	.wiki {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--t-aur-clar);
	}
	.desplegar {
		margin-top: 8px;
		padding: 4px 10px 4px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-aur-clar);
		font: 600 0.8125rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.desplegar .chev {
		display: inline-block;
		margin-left: 6px;
		transition: transform 0.2s ease;
	}
	.desplegar[aria-expanded='true'] .chev {
		transform: rotate(180deg);
	}
	.credits {
		margin: 8px 0 0;
		font-size: 0.625rem;
		line-height: 1.4;
		color: var(--t-tinta-2);
	}
	.credits a {
		color: inherit;
	}
	@container carta (max-width: 600px) {
		.ficha-comuna {
			bottom: 64px;
		}
		img,
		.silh.gran {
			width: 72px;
			height: 72px;
		}
	}
</style>
