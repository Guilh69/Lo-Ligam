<script>
	// La lecture d'un des quatre textes (Constitution, Déclaration de 1789, préambule de 1946, Charte de
	// l'environnement) : l'occitan seul, le français seul, ou les deux face à face, article par article.
	// Mise en page par la typographie : pas de cadre, des filets fins. Le français ne se charge que si on le
	// demande (poids de la page). Occitan de la page à valider par Romain ; es/en/ca/ar retombent sur l'occitan.
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { TEXTES, blocsOc, blocsFr, ancre, etiqueta, morceaux, typo } from './textes.js';

	let { texte } = $props();

	const UI = {
		oc: {
			vista: 'Lenga de lectura',
			oc: 'Occitan',
			fr: 'Francés',
			dos: 'Los dos',
			cargament: 'Cargament del tèxte francés…',
			error: 'Lo tèxte francés se pòt pas cargar pel moment.',
			textes: 'Los tèxtes',
			nota: 'Aquesta traduccion es pas oficiala e demòra de verificar. Sol lo tèxte francés fa fe.',
			lengas: 'Las lengas dins la Constitucion',
			art2: 'article 2',
			art751: 'article 75-1',
			somari: 'Somari',
			sorsas: 'Sorsas',
			sorsaFr: 'Tèxte francés oficial',
			legifrance: 'Tèxte en vigor sus Légifrance',
			traduccion: 'Traduccion occitana : Lo Ligam, en lengadocian (nòrma classica). Lo vocabulari es verificat dins los diccionaris de Lo Congrès permanent de la lenga occitana.'
		},
		fr: {
			vista: 'Langue de lecture',
			oc: 'Occitan',
			fr: 'Français',
			dos: 'Les deux',
			cargament: 'Chargement du texte français…',
			error: 'Le texte français ne peut pas se charger pour le moment.',
			textes: 'Les textes',
			nota: 'Cette traduction n’est pas officielle et reste à vérifier. Seul le texte français fait foi.',
			lengas: 'Les langues dans la Constitution',
			art2: 'article 2',
			art751: 'article 75-1',
			somari: 'Sommaire',
			sorsas: 'Sources',
			sorsaFr: 'Texte français officiel',
			legifrance: 'Texte en vigueur sur Légifrance',
			traduccion: 'Traduction occitane : Lo Ligam, en languedocien (norme classique). Le vocabulaire est vérifié dans les dictionnaires de Lo Congrès permanent de la lenga occitana.'
		}
	};
	const ui = $derived(UI[langStore.current] ?? UI.oc);

	const CLE = 'lo-ligam-constitucion-vista';
	const oc = $derived(blocsOc(texte.id));
	const titres = $derived(texte.sommaire ? oc.filter((b) => b.tag === 'h2') : []);

	let vista = $state('oc');
	let fr = $state(null);
	let cargament = $state(false);
	let error = $state(false);

	async function cargar() {
		if (fr || cargament) return;
		cargament = true;
		error = false;
		try {
			fr = new Map((await blocsFr(texte.id)).map((b) => [b.id, b]));
		} catch {
			error = true;
		} finally {
			cargament = false;
		}
	}

	function causir(v) {
		vista = v;
		try {
			localStorage.setItem(CLE, v);
		} catch {
			/* navigation privée : on s'en passe */
		}
		if (v !== 'oc') cargar();
	}

	// la vue choisie à la visite précédente
	$effect(() => {
		try {
			const v = localStorage.getItem(CLE);
			if (v === 'fr' || v === 'dos') {
				vista = v;
				cargar();
			}
		} catch {
			/* idem */
		}
	});

	const cels = $derived(vista === 'oc' ? ['oc'] : vista === 'fr' ? ['fr'] : ['oc', 'fr']);
	const bloc = (b, l) => (l === 'oc' ? b : fr?.get(b.id));
	const VISTAS = ['oc', 'fr', 'dos'];
</script>

{#snippet alineas(txt)}
	{#each morceaux(typo(txt)) as m, i (i)}
		{#if m.type === 'liste'}
			<ul>
				{#each m.items as it, j (j)}<li>{it}</li>{/each}
			</ul>
		{:else}
			<p>{m.items[0]}</p>
		{/if}
	{/each}
{/snippet}

<div class="lectura">
	<nav class="textes" aria-label={ui.textes}>
		{#each TEXTES as t (t.id)}
			<a href={t.href} aria-current={t.id === texte.id ? 'page' : undefined} lang={langStore.current === 'fr' ? 'fr' : 'oc'}>{langStore.current === 'fr' ? t.cort.fr : t.cort.oc}</a>
		{/each}
	</nav>

	<p class="nota" lang={langStore.current === 'fr' ? 'fr' : 'oc'}>{ui.nota}</p>
	{#if texte.jorn}<p class="jorn" lang={langStore.current === 'fr' ? 'fr' : 'oc'}>{langStore.current === 'fr' ? texte.jorn.fr : texte.jorn.oc}</p>{/if}

	{#if texte.id === 'const'}
		<p class="lengas" lang={langStore.current === 'fr' ? 'fr' : 'oc'}>
			{ui.lengas} : <a href="#art-2">{ui.art2}</a> · <a href="#art-75-1">{ui.art751}</a>
		</p>
	{/if}

	<div class="vista" role="group" aria-label={ui.vista}>
		{#each VISTAS as v (v)}
			<button type="button" aria-pressed={vista === v} onclick={() => causir(v)}>{ui[v]}</button>
		{/each}
	</div>
	{#if cargament}<p class="estat" role="status">{ui.cargament}</p>{/if}
	{#if error}<p class="estat" role="alert">{ui.error}</p>{/if}

	{#if titres.length}
		<nav class="somari" id="somari" aria-label={ui.somari}>
			<h2 class="mut">{ui.somari}</h2>
			<ol>
				{#each titres as t (t.id)}
					{@const e = etiqueta(t)}
					<li>
						<a href={'#' + ancre(t)} lang="oc">{#if e.petit}<span class="num">{e.petit}</span>{/if}<span>{e.gros}</span></a>
					</li>
				{/each}
			</ol>
		</nav>
	{/if}

	<article class="tèxte" class:dos={vista === 'dos'} class:sol={vista !== 'dos'}>
		{#each oc as b (b.id)}
			<div class="linha {b.tag}" id={ancre(b)}>
				{#each cels as l, k (l)}
					{@const x = bloc(b, l)}
					<div class="cel" class:sec={k === 1} lang={l}>
						{#if x}
							{#if b.tag === 'h2'}
								{@const e = etiqueta(x)}
								{#if k === 0}
									<h2>
										{#if e.petit}<span class="petit">{e.petit}</span>{/if}
										<span class="gros">{e.gros}</span>
									</h2>
								{:else}
									<p class="h2-sec">{#if e.petit}<span class="petit">{e.petit}</span>{/if}<span class="gros">{e.gros}</span></p>
								{/if}
								{#if k === 0 && titres.length}<a class="amont" href="#somari">{ui.somari}</a>{/if}
							{:else if b.tag === 'h3'}
								{@const e = etiqueta(x)}
								{#if k === 0}<h3>{e.gros}</h3>{:else}<p class="h3-sec">{e.gros}</p>{/if}
							{:else}
								{@render alineas(x.txt)}
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</article>

	<section class="sorsas" aria-labelledby="sorsas-t">
		<h2 id="sorsas-t" class="mut">{ui.sorsas}</h2>
		<ul>
			<li>
				<a href={texte.font} rel="noopener" target="_blank">{ui.sorsaFr}</a> (Conseil constitutionnel)
			</li>
			{#if texte.legifrance}
				<li><a href={texte.legifrance} rel="noopener" target="_blank">{ui.legifrance}</a></li>
			{/if}
			<li>{ui.traduccion}</li>
		</ul>
	</section>
</div>

<style>
	.lectura {
		--mesura: 62ch;
		--bord: var(--t-linha);
		color: var(--t-tinta);
		font-family: var(--font-body);
	}

	/* les quatre textes : une ligne, séparés par un filet */
	.textes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0;
		margin: 0 0 var(--esp-24);
		padding: 0;
		border-top: 1px solid var(--bord);
		border-bottom: 1px solid var(--bord);
	}
	.textes a {
		padding: 0.7rem 1.4rem 0.7rem 0;
		margin-right: 1.4rem;
		color: var(--t-tinta-2);
		text-decoration: none;
		border-bottom: 2px solid transparent;
	}
	.textes a:hover,
	.textes a:focus-visible {
		color: var(--t-tinta);
	}
	.textes a[aria-current='page'] {
		color: var(--t-tinta);
		border-bottom-color: var(--t-aur);
	}

	.nota {
		max-width: var(--mesura);
		margin: 0 0 var(--esp-8);
		line-height: 1.6;
		color: var(--t-tinta);
	}
	.jorn,
	.lengas {
		max-width: var(--mesura);
		margin: 0 0 var(--esp-8);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}
	.lengas a {
		color: var(--t-aur);
	}

	/* choix de la langue de lecture : du texte souligné, pas de pastilles */
	.vista {
		display: flex;
		gap: 1.6rem;
		margin: var(--esp-24) 0 var(--esp-8);
	}
	.vista button {
		padding: 0.35rem 0;
		font: inherit;
		color: var(--t-tinta-2);
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.vista button:hover {
		color: var(--t-tinta);
	}
	.vista button[aria-pressed='true'] {
		color: var(--t-tinta);
		border-bottom-color: var(--t-aur);
	}
	.estat {
		margin: var(--esp-8) 0 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}

	a {
		color: inherit;
	}
	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 3px;
	}

	/* le sommaire de la Constitution : deux colonnes, des filets fins */
	.somari {
		margin: var(--esp-48) 0 var(--esp-32);
	}
	.mut {
		margin: 0 0 var(--esp-12);
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: 0;
		color: var(--t-tinta-2);
	}
	.somari ol {
		margin: 0;
		padding: 0;
		list-style: none;
		columns: 2 22rem;
		column-gap: var(--esp-48);
	}
	.somari li {
		break-inside: avoid;
		border-top: 1px solid var(--bord);
	}
	.somari a {
		display: flex;
		gap: 0.9rem;
		padding: 0.55rem 0;
		text-decoration: none;
		line-height: 1.35;
	}
	.somari a:hover span:last-child {
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
	.somari .num {
		flex: 0 0 6.4rem;
		color: var(--t-tinta-2);
	}

	/* le texte */
	.tèxte {
		container: tèxte / inline-size;
		margin-top: var(--esp-48);
	}
	.linha {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.2rem var(--esp-48);
		scroll-margin-top: 1.5rem;
	}
	.sol .cel {
		max-width: var(--mesura);
	}
	.cel p,
	.cel ul {
		margin: 0 0 0.9rem;
		font-size: 1.0625rem;
		line-height: 1.65;
	}
	.cel ul {
		padding: 0;
		list-style: none;
	}
	.cel li {
		position: relative;
		padding-left: 1.4rem;
		margin-bottom: 0.4rem;
	}
	.cel li::before {
		content: '-';
		position: absolute;
		left: 0.2rem;
		color: var(--t-tinta-2);
	}

	.linha.h2 {
		margin-top: var(--esp-64);
		padding-top: var(--esp-24);
		border-top: 1px solid var(--bord);
	}
	.linha.h2:first-child {
		margin-top: 0;
	}
	.linha.h2 .cel {
		display: block;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.45rem, 3.2vw, 2.3rem);
		line-height: 1.12;
		letter-spacing: 0.01em;
	}
	h2 .petit,
	.h2-sec .petit {
		display: block;
		margin-bottom: 0.35rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		letter-spacing: 0;
		color: var(--t-tinta-2);
	}
	.cel .h2-sec {
		margin: 0 0 0.9rem;
		font-family: var(--font-body);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1.3;
		color: var(--t-tinta-2);
	}
	.amont {
		display: inline-block;
		margin-top: 0.7rem;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}

	.linha.h3 {
		margin-top: var(--esp-32);
	}
	h3,
	.cel .h3-sec {
		margin: 0 0 0.45rem;
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: 0;
		color: var(--t-aur);
	}
	.cel .h3-sec {
		color: var(--t-tinta-2);
		font-weight: 600;
	}
	.linha:target h3 {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.3em;
	}

	/* les deux langues : en regard quand la place le permet, l'une sous l'autre sinon */
	.dos .sec {
		color: var(--t-tinta-2);
	}
	/* l'une sous l'autre, le numéro de l'article ne se répète pas */
	.dos .cel .h3-sec {
		display: none;
	}
	@container tèxte (min-width: 56rem) {
		.dos .linha {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.dos .sec {
			color: var(--t-tinta);
		}
		.dos .cel .h3-sec {
			display: block;
		}
	}

	.sorsas {
		max-width: var(--mesura);
		margin-top: var(--esp-96);
		padding-top: var(--esp-24);
		border-top: 1px solid var(--bord);
	}
	.sorsas ul {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
	}
	.sorsas li {
		margin-bottom: 0.5rem;
	}
	.sorsas a {
		color: var(--t-tinta);
	}
</style>
