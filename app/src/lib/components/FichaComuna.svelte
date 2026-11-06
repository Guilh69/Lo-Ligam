<script>
	import Icona from '$lib/components/Icona.svelte';
	// La ficha d'una comuna causida sus la carta (retorn de Romain, 2026-10-11) :
	// son nom, sa silhoeta, una fòto, las chifras de basa (populacion e son
	// annada, susfàcia, altitud, gentilici), las primièras frasas de l'article
	// de Wikipèdia e lo ligam cap a l'article entièr. Las donadas venon de
	// /api/comuna (Wikidata e Wikipèdia, relaiats per nòstre servidor).
	import { fly, slide } from 'svelte/transition';
	import { VILAS_FICHAS } from '$lib/carta/vilasFichas.js';
	import TriaLenga from './TriaLenga.svelte';
	import VotzFicha from './VotzFicha.svelte';
	import { flushSync } from 'svelte';
	import { sonClic } from '$lib/carta/sons.js';

	let {
		comuna,
		contorn = null,
		lang = 'oc',
		onTampar = null,
		// « La votz d'aquí » (Atlas sonore) : nom et couleur d'un point, et
		// passage au mode écoute de la carte
		nomVotz = undefined,
		colorVotz = undefined,
		onVotzCarta = null
	} = $props();

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
	// lo nom de cada lenga, dins la lenga de la ficha (anglés, espanhòl,
	// alemand, italian : las lengas del site a venir)
	const LENGAS = {
		oc: { oc: 'Occitan', fr: 'Occitan', es: 'Occitano', en: 'Occitan', ca: 'Occità', ar: 'الأوكسيتانية' },
		fr: { oc: 'Francés', fr: 'Français', es: 'Francés', en: 'French', ca: 'Francès', ar: 'الفرنسية' },
		ca: { oc: 'Catalan', fr: 'Catalan', es: 'Catalán', en: 'Catalan', ca: 'Català', ar: 'الكتالانية' },
		frp: { oc: 'Arpitan', fr: 'Arpitan', es: 'Arpitano', en: 'Arpitan', ca: 'Arpità', ar: 'الأربيتانية' },
		eu: { oc: 'Basc', fr: 'Basque', es: 'Vasco', en: 'Basque', ca: 'Basc', ar: 'الباسكية' },
		br: { oc: 'Breton', fr: 'Breton', es: 'Bretón', en: 'Breton', ca: 'Bretó', ar: 'البريتونية' },
		als: { oc: 'Alsacian', fr: 'Alsacien', es: 'Alsaciano', en: 'Alsatian', ca: 'Alsacià', ar: 'الألزاسية' },
		lb: { oc: 'Francic', fr: 'Francique', es: 'Franconio', en: 'Franconian', ca: 'Francònic', ar: 'الفرانكونية' },
		pfl: { oc: 'Francic', fr: 'Francique', es: 'Franconio', en: 'Franconian', ca: 'Francònic', ar: 'الفرانكونية' },
		ksh: { oc: 'Francic', fr: 'Francique', es: 'Franconio', en: 'Franconian', ca: 'Francònic', ar: 'الفرانكونية' },
		li: { oc: 'Francic', fr: 'Francique', es: 'Franconio', en: 'Franconian', ca: 'Francònic', ar: 'الفرانكونية' },
		vls: { oc: 'Flamenc', fr: 'Flamand', es: 'Flamenco', en: 'Flemish', ca: 'Flamenc', ar: 'الفلمنكية' },
		nl: { oc: 'Neerlandés', fr: 'Néerlandais', es: 'Neerlandés', en: 'Dutch', ca: 'Neerlandès', ar: 'الهولندية' },
		co: { oc: 'Còrs', fr: 'Corse', es: 'Corso', en: 'Corsican', ca: 'Cors', ar: 'الكورسيكية' },
		pcd: { oc: 'Picard', fr: 'Picard', es: 'Picardo', en: 'Picard', ca: 'Picard', ar: 'البيكاردية' },
		wa: { oc: 'Valon', fr: 'Wallon', es: 'Valón', en: 'Walloon', ca: 'Való', ar: 'الوالونية' },
		nrm: { oc: 'Normand', fr: 'Normand', es: 'Normando', en: 'Norman', ca: 'Normand', ar: 'النورماندية' },
		en: { oc: 'Anglés', fr: 'Anglais', es: 'Inglés', en: 'English', ca: 'Anglès', ar: 'الإنجليزية' },
		es: { oc: 'Espanhòl', fr: 'Espagnol', es: 'Español', en: 'Spanish', ca: 'Espanyol', ar: 'الإسبانية' },
		de: { oc: 'Alemand', fr: 'Allemand', es: 'Alemán', en: 'German', ca: 'Alemany', ar: 'الألمانية' },
		it: { oc: 'Italian', fr: 'Italien', es: 'Italiano', en: 'Italian', ca: 'Italià', ar: 'الإيطالية' }
	};
	// Los mots de la ficha, per lenga : una lenga del site de mai (anglés,
	// espanhòl, catalan…) = una entrada de mai ; sens entrada, lo francés
	const TÈXTES = {
		oc: {
			tampar: 'Tampar',
			abitants: 'abitants',
			gentilici: 'Abitants',
			legirMai: 'Legir mai',
			plegar: 'Plegar',
			vila: 'Descobrir la vila',
			vilaLèu: 'Descobrir la vila : lèu',
			article: (l) => `Legir l'article de Wikipèdia en ${l}`,
			fòto: 'Fòto',
			tèxt: 'Tèxt : Wikipèdia',
			chifras: 'Chifras',
			lenga: 'Lenga de la ficha',
			nombres: 'fr-FR',
			dp: ' :'
		},
		fr: {
			tampar: 'Fermer',
			abitants: 'habitants',
			gentilici: 'Habitants',
			legirMai: 'En savoir plus',
			plegar: 'Replier',
			vila: 'Découvrir la ville',
			vilaLèu: 'Découvrir la ville : bientôt',
			article: (l) => `Lire l'article de Wikipédia en ${l}`,
			fòto: 'Photo',
			tèxt: 'Texte : Wikipédia',
			chifras: 'Chiffres',
			lenga: 'Langue de la fiche',
			nombres: 'fr-FR',
			dp: ' :'
		},
		es: {
			tampar: 'Cerrar',
			abitants: 'habitantes',
			gentilici: 'Habitantes',
			legirMai: 'Saber más',
			plegar: 'Ver menos',
			vila: 'Descubrir la ciudad',
			vilaLèu: 'Descubrir la ciudad: próximamente',
			article: (l) => `Leer el artículo de Wikipedia en ${l}`,
			fòto: 'Foto',
			tèxt: 'Texto: Wikipedia',
			chifras: 'Cifras',
			lenga: 'Idioma de la ficha',
			nombres: 'es-ES',
			dp: ':'
		},
		en: {
			tampar: 'Close',
			abitants: 'inhabitants',
			gentilici: 'Inhabitants',
			legirMai: 'Read more',
			plegar: 'Show less',
			vila: 'Discover the town',
			vilaLèu: 'Discover the town: coming soon',
			// (le nom de la langue arrive en minuscules : l'anglais lui veut une majuscule)
			article: (l) => `Read the Wikipedia article in ${l.charAt(0).toUpperCase() + l.slice(1)}`,
			fòto: 'Photo',
			tèxt: 'Text: Wikipedia',
			chifras: 'Figures',
			lenga: 'Language of this card',
			nombres: 'en-GB',
			dp: ':'
		},
		ca: {
			tampar: 'Tancar',
			abitants: 'habitants',
			gentilici: 'Habitants',
			legirMai: 'Saber-ne més',
			plegar: "Veure'n menys",
			vila: 'Descobrir la ciutat',
			vilaLèu: 'Descobrir la ciutat: aviat',
			article: (l) => `Llegir l'article de la Viquipèdia en ${l}`,
			fòto: 'Foto',
			tèxt: 'Text: Viquipèdia',
			chifras: 'Xifres',
			lenga: 'Llengua de la fitxa',
			nombres: 'ca-ES',
			dp: ':'
		},
		ar: {
			tampar: 'إغلاق',
			abitants: 'نسمة',
			gentilici: 'السكان',
			legirMai: 'المزيد',
			plegar: 'عرض أقل',
			vila: 'اكتشاف المدينة',
			vilaLèu: 'اكتشاف المدينة: قريبًا',
			article: (l) => `قراءة المقال في ويكيبيديا باللغة ${l}`,
			fòto: 'الصورة',
			tèxt: 'النص: ويكيبيديا',
			chifras: 'الأرقام',
			lenga: 'لغة البطاقة',
			nombres: 'ar-u-nu-latn',
			dp: ':'
		}
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
			(autras.length ? `&l=${autras.map((l) => WIKIS[l].join(',')).join('.')}` + (deLenga ? `&nl=${encodeURIComponent(c.oc ?? '')}` : '') : '') +
			(lang !== 'oc' && lang !== 'fr' ? `&s=${lang}` : '');
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
		if (lang !== 'oc' && lang !== 'fr') l.push([lang, dades?.nom?.[lang]]);
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
	// (un sol nom afichat : lo de la lenga causida, si que non en francés)
	const nom = $derived((noms.find((x) => x.cds.includes(lt)) ?? noms.find((x) => x.cds.includes('fr')) ?? noms[0])?.n ?? comuna?.oc ?? '');
	const lengaNom = $derived(noms.find((x) => x.n === nom)?.cds[0] ?? 'oc');
	// la vila a sa pagina sul site (l'ancian repèr daurat de la carta)
	const fichaSite = $derived(comuna ? VILAS_FICHAS.find((v) => Math.abs(v.lat - comuna.lat) < 0.05 && Math.abs(v.lon - comuna.lon) < 0.07) : null);
	const nombre = (n, d = 0) => n.toLocaleString(t.nombres ?? lc, { maximumFractionDigits: d });
	const chifras = $derived.by(() => {
		const d = dades,
			l = [];
		if (!d) return l;
		if (d.pop?.n) l.push(`${nombre(d.pop.n)} ${t.abitants}${d.pop.an ? ` (${d.pop.an})` : ''}`);
		if (d.km2) l.push(`${nombre(d.km2, 1)} km²`);
		if (d.alt != null) l.push(`${nombre(d.alt)} m`);
		return l;
	});
	const gentilici = $derived(dades?.gentilici?.[lc] ?? null);
	// Quinas lengas, dins quin òrdre (règla de Romain, 2026-10-11) : las
	// lengas del luòc (la lenga regionala, puèi l'occitan dins son domeni),
	// puèi l'occitan, puèi la lenga del site ; sonque las qu'an un article.
	//   - site en occitan : una vila occitana a pas que l'occitan (cap de
	//     revirada) ; una vila d'una autra lenga, sa lenga, puèi l'occitan ;
	//   - site en francés (deman en anglés, espanhòl, catalan…) : la lenga del
	//     site d'en primièr (« beaucoup de francophones sont paniqués dès
	//     qu'ils ne comprennent pas »), puèi la lenga del luòc e l'occitan.
	// Per defaut, la primièra.
	const lenguasTèxt = $derived(
		dades
			? [...(lang === 'oc' ? [] : [lang]), ...(dades.locals ?? []), 'oc'].filter((l, k, a) => l && a.indexOf(l) === k && (dades.extrach?.[l] || dades.wiki?.[l]))
			: []
	);
	const lt = $derived(lenguasTèxt.includes(lenguaCausida) ? lenguaCausida : lenguasTèxt[0]);
	// La lenga causida mena tota la ficha : lo nom, lo tèxt, lo ligam, e los
	// mots de la ficha quand los avèm dins aquela lenga (si que non, los de
	// la lenga del site : pas de revirada pas verificada)
	const lc = $derived(TÈXTES[lt] ? lt : TÈXTES[lang] ? lang : 'fr');
	const t = $derived(TÈXTES[lc]);
	// (lo nom de la lenga dins una frasa : « en basc », « en basque »)
	const enLenga = (l) => nomLenga(l).toLowerCase();
	const extrach = $derived(dades?.extrach?.[lt]);
	const wiki = $derived(dades?.wiki?.[lt]);
	const nomLenga = (l) => LENGAS[l]?.[lc] ?? LENGAS[l]?.fr ?? l;

	// La ficha se transforma quand la lenga cambia : la lenga nòva s'espandís
	// en ròtle a partir de l'emblèma clicat (causit per Romain, 2026-10-11,
	// entre revelacion, reviradura e cascada ; transicion de vista, app.css).
	// Sens transicion de vista (navegador vièlh), los elements tornan un a un
	// (cascada) ; sens movement (preferéncia del sistèma), lo cambiament sol.
	let cara = $state(null),
		cascada = $state(false);
	function causirLenga(l, punt) {
		if (!l || l === lt) return;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (calm || !document.startViewTransition || !cara) {
			lenguaCausida = l;
			sonClic(0.8);
			if (!calm) {
				cascada = false;
				requestAnimationFrame(() => (cascada = true));
			}
			return;
		}
		// (lo ròtle part del centre de l'emblèma ; la ficha pòt créisser)
		const r = cara.getBoundingClientRect(),
			h = document.documentElement,
			x = (punt?.x ?? r.left + 30) - r.left,
			y = (punt?.y ?? r.top) - r.top;
		h.style.setProperty('--ficha-x', x.toFixed(0) + 'px');
		h.style.setProperty('--ficha-y', y.toFixed(0) + 'px');
		h.style.setProperty('--ficha-r', Math.hypot(Math.max(x, r.width - x), r.height + 240).toFixed(0) + 'px');
		h.dataset.fichaVt = 'revelar';
		sonClic(1);
		const t = document.startViewTransition(() => flushSync(() => (lenguaCausida = l)));
		t.finished.finally(() => delete h.dataset.fichaVt);
	}
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
	<div class="ficha-comuna" transition:fly={{ y: 16, duration: 260 }}>
		<section class="cara" class:amb-emblemas={lenguasTèxt.length > 1} class:cascada aria-label={nom} bind:this={cara}>
			<button type="button" class="pc pc-2 pc-icone tampar" aria-label={t.tampar} onclick={() => onTampar?.()}><Icona nom="fermer" size="1.25em" /></button>
			<div class="cap">
				{#if dades?.fòto}
					<div class="vinheta">
						<img src={dades.fòto.url} alt={nom} loading="lazy" decoding="async" />
						{#if silhoeta}<svg class="silh mini" viewBox="0 0 64 64" aria-hidden="true"><path d={silhoeta} fill-rule="evenodd" /></svg>{/if}
					</div>
				{:else if silhoeta}
					<svg class="silh gran" viewBox="0 0 64 64" aria-hidden="true"><path d={silhoeta} fill-rule="evenodd" /></svg>
				{/if}
				<div class="cos">
					<h2 lang={lengaNom} style:--i="0">{nom}</h2>
					{#if chifras.length}<p class="chifras" style:--i="1">{chifras.join(' · ')}</p>{/if}
					{#if gentilici}<p class="gentilici" style:--i="2">{t.gentilici}{t.dp} {gentilici}</p>{/if}
					{#if cargant}<p class="cargant" aria-hidden="true">…</p>{/if}
					{#if dades && (lenguasTèxt.length || fichaSite)}
						<button type="button" class="pc pc-2 desplegar" style:--i="3" aria-expanded={dobèrta} onclick={() => (dobèrta = !dobèrta)}
							>{dobèrta ? t.plegar : t.legirMai}<span class="chev" aria-hidden="true">▾</span></button
						>
					{/if}
				</div>
			</div>
			{#if dades && dobèrta}
				<div class="mai" transition:slide={{ duration: 240 }}>
					{#if extrach}<p class="extrach" lang={lt} style:--i="4">{extrach}</p>{/if}
					<footer style:--i="5">
						{#if fichaSite}
							{#if fichaSite.ligam}<a class="site" href={fichaSite.ligam}>{t.vila} <Icona nom="suivant" /></a>
							{:else}<span class="site leu">{t.vilaLèu}</span>{/if}
						{/if}
						{#if wiki}
							<!-- (lo ligam seguís la lenga causida, e la ditz) -->
							<a class="wiki" href={wiki} hreflang={lt} target="_blank" rel="noopener"
								>{t.article(enLenga(lt))} <Icona nom="extern" size="0.9em" /></a
							>
						{/if}
						<p class="credits">
							{#if dades.fòto}{t.fòto}{t.dp} {#if dades.fòto.pagina}<a href={dades.fòto.pagina} target="_blank" rel="noopener">{dades.fòto.autor ?? 'Wikimedia Commons'}</a
								>{:else}{dades.fòto.autor ?? 'Wikimedia Commons'}{/if}{dades.fòto.licéncia ? `, ${dades.fòto.licéncia}` : ''}{' · '}{/if}{#if extrach}{t.tèxt}, <a
									href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr"
									target="_blank"
									rel="noopener">CC BY-SA 4.0</a
								>{' · '}{/if}{t.chifras}{t.dp} Wikidata
						</p>
					</footer>
				</div>
			{/if}
			<!-- la voix d'ici, pour les communes occitanes (Atlas sonore) : après
			     les informations de la ville, repliée en une ligne (Romain, 2026-10-23) -->
			{#if !deLenga}<VotzFicha {comuna} {lang} nomDe={nomVotz} colorDe={colorVotz} onCarta={onVotzCarta} />{/if}
		</section>
		<!-- los emblèmas de las lengas, sul canton de la ficha : menan tota la ficha -->
		{#if lenguasTèxt.length > 1}
			<div class="emblemas-fl">
				<TriaLenga lenguas={lenguasTèxt} causida={lt} onCausir={causirLenga} {nomLenga} {còdi} etiqueta={t.lenga} />
			</div>
		{/if}
	</div>
{/if}

<style>
	.ficha-comuna {
		position: absolute;
		z-index: 1150;
		left: 50%;
		bottom: 18px;
		transform: translateX(-50%);
		width: min(30rem, calc(100% - 24px));
	}
	.cara {
		position: relative;
		view-transition-name: ficha-cara;
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
		--r: 10px;
		min-height: 0;
		position: absolute;
		top: 8px;
		right: 8px;
		width: 30px;
		height: 30px;
		font-size: 1.1rem;
	}

	/* la fòto, lo nom e sas chifras, lo tria de la lenga a drecha (que passa
	   dejós quand la ficha es estrecha) */
	/* los emblèmas de las lengas, pausats sul canton naut a esquèrra, un pauc
	   al dessús del quadre */
	.emblemas-fl {
		position: absolute;
		z-index: 2;
		left: 14px;
		top: -12px;
		view-transition-name: ficha-emblemas;
	}
	.cara.amb-emblemas {
		padding-top: 20px;
	}
	/* la cascada : los elements tornan un a un */
	.cara.cascada :is(h2, .chifras, .gentilici, .desplegar, .extrach, footer) {
		animation: cascada 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i, 0) * 60ms);
	}
	@keyframes cascada {
		from {
			opacity: 0;
			transform: translateY(8px);
			filter: blur(3px);
		}
	}
	.cap {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 14px;
		align-items: flex-start;
		padding-right: 30px;
	}
	.vinheta {
		position: relative;
		flex: none;
	}
	img {
		display: block;
		width: 88px;
		height: 88px;
		object-fit: cover;
		border-radius: 10px;
		border: 1px solid var(--t-linha);
	}
	.cos {
		flex: 1 1 150px;
		min-width: 0;
	}
	h2 {
		margin: 0;
		font: 600 1.35rem/1.15 'Cormorant Garamond', Georgia, serif;
		font-style: italic;
		color: var(--t-aur-clar);
	}
	.gentilici,
	.cargant {
		margin: 2px 0 0;
		font-size: 0.8125rem;
		color: var(--t-tinta-2);
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
		width: 88px;
		height: 88px;
	}
	/* (sus la fòto, la silhoeta en pichon) */
	.silh.mini {
		position: absolute;
		left: 4px;
		bottom: 4px;
		width: 28px;
		height: 28px;
		padding: 2px;
		border-radius: 6px;
		background: rgba(20, 12, 8, 0.62);
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
		margin-inline-end: 14px;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--t-tinta); text-decoration: underline; text-decoration-color: var(--t-accion); text-decoration-thickness: 2px; text-underline-offset: 0.2em;
	}
	.site.leu {
		font-weight: 600;
		color: var(--t-tinta-2);
	}
	.wiki {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--t-tinta); text-decoration: underline; text-decoration-color: var(--t-accion); text-decoration-thickness: 2px; text-underline-offset: 0.2em;
	}
	.desplegar {
		--r: 10px;
		min-height: 0;
		margin-top: 8px;
		padding: 4px 10px 4px 12px;
		font: 600 0.8125rem/1.2 var(--font-body);
	}

	.desplegar .chev {
		display: inline-block;
		margin-inline-start: 6px;
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
	/* Sul telefòn, un panèl que monta d'en bas, sus tota la largor, pausat
	   sus la barra de las jaces (retorn de Romain, 2026-10-12 : la ficha
	   tustava l'escala e la legenda, « ça fait brouillon ») ; la carta escantís
	   sas aisinas d'en bas tant qu'es dobèrt (CartaOccitania, .amb-ficha) */
	@container carta (max-width: 600px) {
		.ficha-comuna {
			left: 0;
			right: 0;
			bottom: var(--barra-bas, 0px);
			width: auto;
			transform: none;
		}
		.cara {
			max-height: 62svh;
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: 22px 14px 12px;
			border-bottom: 0;
			border-radius: 18px 18px 0 0;
			box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.4);
		}
		.cara.amb-emblemas {
			padding-top: 24px;
		}
		/* la pòrta de man del panèl */
		.cara::before {
			content: '';
			position: absolute;
			top: 7px;
			left: 50%;
			width: 36px;
			height: 4px;
			margin-left: -18px;
			border-radius: 2px;
			background: color-mix(in srgb, var(--t-tinta) 30%, transparent);
		}
		img,
		.silh.gran {
			width: 72px;
			height: 72px;
		}
	}
</style>
