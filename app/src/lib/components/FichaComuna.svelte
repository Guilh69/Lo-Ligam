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
	// lo servidor garda la que nomena la vila coma nosautres).
	const WIKIS = { catalan: ['ca'], arpitan: ['frp'], basc: ['eu'], breton: ['br'], alsacian: ['als'], francic: ['lb', 'pfl', 'ksh', 'li'], flamenc: ['vls', 'nl'], cors: ['co'], oil: ['pcd', 'wa', 'nrm'] };
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

	// la lenga del luòc : la zòna de son contorn (« arpitan-69 »), o sa lista de
	// noms ; null dins lo domeni occitan
	const lenga = $derived.by(() => {
		const z = contorn?.zona;
		const id = z && /^[a-z]+-/.test(z) ? z.split('-')[0] : comuna?.dep;
		return WIKIS[id] ? id : null;
	});

	$effect(() => {
		const c = comuna,
			i = contorn?.props?.i ?? null;
		if (!c) return;
		const q =
			(i && /^\d[\dAB]\d{3}$/.test(i) ? `i=${i}` : `nom=${encodeURIComponent(contorn?.props?.fr ?? c.fr)}&lat=${c.lat}&lon=${c.lon}`) +
			(lenga ? `&l=${WIKIS[lenga].join(',')}&nl=${encodeURIComponent(c.oc ?? '')}` : '');
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

	// (dins las listas de la carta, lo camp oc es lo nom dins la lenga del luòc)
	const lengaLocal = $derived(lenga ? (dades?.local ?? WIKIS[lenga][0]) : 'oc');
	const nom = $derived(comuna?.oc || dades?.nom?.[lengaLocal] || comuna?.fr || '');
	// la vila a sa pagina sul site (l'ancian repèr daurat de la carta)
	const fichaSite = $derived(comuna ? VILAS_FICHAS.find((v) => Math.abs(v.lat - comuna.lat) < 0.05 && Math.abs(v.lon - comuna.lon) < 0.07) : null);
	// los autres noms : en occitan (fòra del domeni), puèi en francés
	const autresNoms = $derived.by(() => {
		const vist = [nom.toLowerCase()],
			l = [];
		for (const [lg, n] of [
			['oc', lenga ? dades?.nom?.oc : null],
			['fr', contorn?.props?.fr ?? dades?.nom?.fr ?? (lenga ? null : comuna?.fr)]
		])
			if (n && !vist.includes(n.toLowerCase())) vist.push(n.toLowerCase()), l.push([lg, n]);
		return l;
	});
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
		dades ? [dades.local, 'oc', 'fr'].filter((l, k, a) => l && a.indexOf(l) === k && (dades.extrach?.[l] || dades.wiki?.[l])) : []
	);
	const lt = $derived(lenguasTèxt.includes(lenguaCausida) ? lenguaCausida : lenguasTèxt[0]);
	const extrach = $derived(dades?.extrach?.[lt]);
	const wiki = $derived(dades?.wiki?.[lt]);
	const nomLenga = (l) => LENGAS[l]?.[fr ? 1 : 0] ?? l;

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
				<h2 lang={lengaLocal}>{nom}</h2>
				{#if autresNoms.length}
					<p class="autres">
						{#each autresNoms as [lg, n], k (lg)}{#if k}<span class="sep" aria-hidden="true">·</span>{/if}<span class="lg" title={nomLenga(lg)}
								>{lg}</span
							>&nbsp;<span lang={lg}>{n}</span>{/each}
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
				<div class="lenguas" role="radiogroup" aria-label={fr ? 'Langue du texte' : 'Lenga del tèxt'}>
					{#each lenguasTèxt as l (l)}
						<button type="button" role="radio" aria-checked={l === lt} lang={fr ? 'fr' : 'oc'} onclick={() => (lenguaCausida = l)}>{nomLenga(l)}</button>
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
	.autres .lg {
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--t-aur-clar) 70%, var(--t-tinta-2));
	}
	.lenguas {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 10px;
	}
	.lenguas button {
		padding: 3px 10px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta-2);
		font: 600 0.75rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.lenguas button[aria-checked='true'] {
		border-color: #f3c25a;
		background: color-mix(in srgb, #f3c25a 18%, transparent);
		color: var(--t-aur-clar);
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
