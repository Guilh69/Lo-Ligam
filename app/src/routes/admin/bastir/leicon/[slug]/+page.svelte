<script>
	// Bastir : une leçon. À gauche la matière déjà écrite (le module du registre,
	// lu tel quel) ; à droite la place de construire : le thème, le nombre de mots
	// (cadre tiré de la recherche), la suite des modalités choisies dans la
	// bibliothèque. Chaque changement est rangé en brouillon dans la base (temps 2,
	// $lib/bastir/brolhon.js), une seconde après le dernier geste ; rien ne se
	// publie. En simulation (développement sans compte), rien n'est rangé.
	import { UNITATS_A1, MODALITATS, MODALITAT, FORQUILHA, SOURCES_FORQUILHA, estatModalitat, leiçon, unitatDe, colorsUnitat } from '$lib/bastir/bastir.js';
	import { cargarBrolhon, gardarBrolhon } from '$lib/bastir/brolhon.js';
	import { simulacion } from '$lib/talhier/notas.svelte.js';

	let { data } = $props();
	const simular = simulacion();
	const l = $derived(leiçon(data.slug));
	const n = $derived(unitatDe(data.slug));
	const u = $derived(n ? UNITATS_A1.find((x) => x.n === n) : null);
	const fons = $derived(n ? colorsUnitat(n)[0] : 'var(--t-aur)');

	const ESTAT = { existe: 'existe déjà', jòc: 'existe dans les jeux, à brancher', crear: 'à créer' };
	const PER_BLOC = Object.fromEntries(Object.values(MODALITAT).filter((m) => m.bloc).map((m) => [m.bloc, m.id]));

	// Valeurs de départ recalculées à chaque leçon ouverte (dérivées réassignables) :
	// le compte de la matière pour les mots, un thème et un déroulé vides.
	let tèma = $derived(data.slug ? '' : '');
	let cibla = $derived(l.elements.length);
	let plan = $derived(data.slug ? [] : []);
	let seguent = 0;

	const zona = $derived(cibla < FORQUILHA.min ? 'dejós' : cibla > FORQUILHA.max ? 'dessús' : 'dins');
	const MAX_JAUGE = 16;
	const pct = (v) => `${(Math.min(v, MAX_JAUGE) / MAX_JAUGE) * 100}%`;

	// ————— le brouillon dans la base —————
	// garda : 'cargament' (lecture), 'gardat', 'en-cors' (geste pas encore rangé),
	// 'error', 'simulacion'
	let garda = $state(simular ? 'simulacion' : 'cargament');
	let minuta = null;
	let pendent = null;

	// à chaque leçon ouverte : relire son brouillon s'il existe
	$effect(() => {
		const slug = data.slug;
		if (simular) return;
		let viu = true;
		garda = 'cargament';
		cargarBrolhon(slug)
			.then((b) => {
				if (!viu) return;
				if (b) {
					tèma = b.tèma;
					cibla = b.cibla;
					plan = b.plan.map((p) => ({ ...p, uid: ++seguent }));
				}
				garda = 'gardat';
			})
			.catch(() => viu && (garda = 'error'));
		return () => {
			viu = false;
			// on quitte la leçon avant la seconde d'attente : ranger tout de suite
			if (minuta) {
				clearTimeout(minuta);
				minuta = null;
				pendent?.();
			}
		};
	});

	/** après chaque geste : ranger une seconde plus tard (un seul envoi pour une rafale de frappes) */
	function marcar() {
		if (simular || garda === 'cargament') return;
		garda = 'en-cors';
		clearTimeout(minuta);
		const slug = data.slug;
		const b = { tèma, cibla, plan };
		pendent = () =>
			gardarBrolhon(slug, b)
				.then(() => slug === data.slug && (garda = 'gardat'))
				.catch(() => slug === data.slug && (garda = 'error'));
		minuta = setTimeout(() => {
			minuta = null;
			pendent();
		}, 1000);
	}
	const AVIS_GARDA = {
		cargament: 'Lecture de ton brouillon…',
		gardat: 'Brouillon gardé. Rien n’est publié : c’est ton atelier.',
		'en-cors': 'Enregistrement…',
		error: 'Le brouillon n’a pas pu être gardé : vérifie la connexion, puis refais un geste.',
		simulacion: 'Simulation : rien n’est gardé.'
	};

	const posarTèma = (v) => ((tèma = v), marcar());
	const posarCibla = (v) => ((cibla = Math.max(0, Number(v) || 0)), marcar());
	const apondre = (id) => ((plan = [...plan, { uid: ++seguent, id, nota: '' }]), marcar());
	const levar = (i) => ((plan = plan.filter((_, j) => j !== i)), marcar());
	const posarNota = (i, nota) => ((plan = plan.map((p, j) => (j === i ? { ...p, nota } : p))), marcar());
	function mudar(i, d) {
		const j = i + d;
		if (j < 0 || j >= plan.length) return;
		const p = [...plan];
		[p[i], p[j]] = [p[j], p[i]];
		plan = p;
		marcar();
	}
	/** partir de la matière : chaque bloc déjà écrit devient sa modalité, dans l'ordre */
	function reprendre() {
		if (plan.length && !confirm('Remplacer ton déroulé par celui de la matière déjà écrite ?')) return;
		plan = l.etapas.flatMap((e) =>
			e.blocs.filter((b) => PER_BLOC[b.type]).map((b) => ({ uid: ++seguent, id: PER_BLOC[b.type], nota: b.titol ?? '' }))
		);
		marcar();
	}
</script>

<svelte:head><title>{l.num || l.oc} · Bastir · Lo Ligam</title></svelte:head>

<p class="camin">
	<a href="/admin/bastir">Toutes les unités</a>
	{#if u}<span aria-hidden="true">/</span> <a href="/admin/bastir/{u.n}">Unitat {u.n}, <span lang="oc">{u.titol}</span></a>{/if}
</p>

<header class="cap" style:--fons={fons}>
	<h1>{#if l.num}<b aria-hidden="true">{l.num}</b>{/if} <span lang="oc">{l.oc}</span></h1>
	{#if l.fr}<p class="fr">{l.fr}</p>{/if}
</header>

<div class="dos">
	<!-- ————— la matière déjà écrite ————— -->
	<section class="colona" aria-labelledby="t-materia">
		<h2 id="t-materia"><span lang="oc">La matèria</span> <em>(ce qui est déjà écrit)</em></h2>
		{#if l.cando}<p class="cando">{l.cando}</p>{/if}

		<h3>{l.elements.length} éléments à retenir</h3>
		{#if l.elements.length}
			<ul class="elements">
				{#each l.elements as e (e.id)}
					<li><span lang="oc">{e.oc}</span><span class="glosa">{e.fr}</span></li>
				{/each}
			</ul>
		{:else}
			<p class="discret">Aucune liste « à retenir » dans cette leçon.</p>
		{/if}

		<h3>{l.etapas.length} étapes</h3>
		<ol class="etapas">
			{#each l.etapas as e, i (i)}
				<li>
					<p class="etapa-titol"><span lang="oc">{e.titol}</span>{#if e.minutes}<span class="discret">{e.minutes} min</span>{/if}</p>
					<ul class="blocs">
						{#each e.blocs as b, j (j)}
							<li><span class="tipe">{b.nom}</span>{#if b.titol}<span class="bloc-titol">{b.titol}</span>{/if}</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	</section>

	<!-- ————— construire ————— -->
	<section class="colona bastir" aria-labelledby="t-bastir">
		<h2 id="t-bastir"><span lang="oc">Bastir</span> <em>(ta leçon)</em></h2>
		<p class="avis" class:error={garda === 'error'} role="status">{AVIS_GARDA[garda]}</p>

		<label class="camp">
			<span class="camp-nom">Thème</span>
			<input type="text" value={tèma} oninput={(e) => posarTèma(e.currentTarget.value)} placeholder="le marché du samedi, rentrer chez soi…" />
		</label>

		<div class="camp">
			<label class="camp-nom" for="cibla">Éléments nouveaux</label>
			<div class="mots">
				<input id="cibla" type="number" min="0" max="40" step="1" value={cibla} oninput={(e) => posarCibla(e.currentTarget.value)} />
				<div class="jauge" aria-hidden="true">
					<span class="bande" style:left={pct(FORQUILHA.min)} style:width="calc({pct(FORQUILHA.max)} - {pct(FORQUILHA.min)})"></span>
					<span class="marca" style:left={pct(cibla)}></span>
				</div>
			</div>
			<p class="conselh" class:fora={zona !== 'dins'}>
				{#if zona === 'dins'}Dans la fourchette conseillée ({FORQUILHA.min} à {FORQUILHA.max}).
				{:else if zona === 'dessús'}Au-dessus de la fourchette ({FORQUILHA.min} à {FORQUILHA.max}) : une partie peut attendre la leçon suivante.
				{:else}En dessous de la fourchette ({FORQUILHA.min} à {FORQUILHA.max}) : il reste de la place.{/if}
				Une phrase entière compte pour un ; une scène vaut mieux qu’une liste de mots voisins.
			</p>
			<p class="sources">
				Sources :
				{#each SOURCES_FORQUILHA as s, i (s.url)}<a href={s.url} target="_blank" rel="noopener">{s.nom}</a>{i < SOURCES_FORQUILHA.length - 1 ? ', ' : ''}{/each}
			</p>
		</div>

		<div class="camp">
			<div class="plan-cap">
				<span class="camp-nom">Le déroulé</span>
				<button type="button" class="ligam-boton" onclick={reprendre}>Partir de la matière</button>
			</div>
			{#if plan.length}
				<ol class="plan">
					{#each plan as p, i (p.uid)}
						{@const m = MODALITAT[p.id]}
						<li>
							<span class="plan-num">{i + 1}</span>
							<div class="plan-corps">
								<p class="plan-nom">{m.nom} <span class="estat estat-{estatModalitat(m)}">{ESTAT[estatModalitat(m)]}</span></p>
								<input type="text" aria-label="Ce que tu y mets ({m.nom})" value={p.nota} oninput={(e) => posarNota(i, e.currentTarget.value)} placeholder="ce que tu y mets" />
							</div>
							<div class="plan-gestes">
								<button type="button" aria-label="Monter {m.nom}" disabled={i === 0} onclick={() => mudar(i, -1)}>↑</button>
								<button type="button" aria-label="Descendre {m.nom}" disabled={i === plan.length - 1} onclick={() => mudar(i, 1)}>↓</button>
								<button type="button" aria-label="Retirer {m.nom}" onclick={() => levar(i)}>×</button>
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<p class="discret">Choisis une modalité dans la bibliothèque : elle s’ajoute ici, dans l’ordre. Ou pars de la matière déjà écrite.</p>
			{/if}
		</div>

		<h3 class="biblio-titol"><span lang="oc">Bibliotèca de las modalitats</span></h3>
		{#each MODALITATS as g (g.grop)}
			<div class="grop">
				<p class="grop-nom">{g.grop}</p>
				<ul class="modalitats">
					{#each g.items as m (m.id)}
						<li>
							<button type="button" class="modalitat" onclick={() => apondre(m.id)}>
								<span class="m-nom">{m.nom}</span>
								<span class="m-desc">{m.desc}</span>
								<span class="estat estat-{estatModalitat(m)}">{ESTAT[estatModalitat(m)]}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</div>

<style>
	.camin {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1rem;
		font-size: 0.95rem;
		color: var(--t-tinta-2);
	}
	.camin a {
		color: inherit;
		text-underline-offset: 0.2em;
	}
	.cap {
		margin-bottom: 1.75rem;
		padding-top: 0.9rem;
		border-top: 4px solid var(--fons);
	}
	.cap h1 {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		line-height: 1.05;
		color: var(--t-tinta);
	}
	.cap h1 b {
		font-weight: 400;
		font-size: 0.55em;
		color: var(--t-aur-gros);
	}
	.fr {
		margin: 0.5rem 0 0;
		max-width: 52ch;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	.dos {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: 2.5rem;
		align-items: start;
	}
	@media (max-width: 900px) {
		.dos {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.colona {
		color: var(--t-tinta);
	}
	.colona h2 {
		margin: 0 0 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--t-linha);
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
	}
	.colona h2 em {
		font-family: var(--font-body);
		font-size: 0.55em;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.colona h3 {
		margin: 1.5rem 0 0.5rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.15rem;
	}
	.cando {
		margin: 0;
		line-height: 1.55;
	}
	.discret {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.elements,
	.blocs,
	.modalitats {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.elements li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
		gap: 0.75rem;
		padding: 0.4rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.glosa {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.etapas {
		margin: 0;
		padding-left: 1.3rem;
	}
	.etapas > li {
		padding: 0.5rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.etapa-titol {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0 0 0.25rem;
	}
	.blocs li {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.6rem;
		font-size: 0.92rem;
		line-height: 1.5;
	}
	.tipe {
		color: var(--t-tinta-2);
	}

	.avis {
		margin: 0 0 1rem;
		font-size: 0.92rem;
		color: var(--t-tinta-2);
	}
	.avis.error {
		color: var(--t-aur);
	}
	.camp {
		display: block;
		margin-bottom: 1.4rem;
	}
	.camp-nom {
		display: block;
		margin-bottom: 0.35rem;
		font-family: var(--font-heading);
		font-size: 1.15rem;
	}
	input[type='text'],
	input[type='number'] {
		width: 100%;
		padding: 0.5rem 0.6rem;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 35%, transparent);
		border-radius: 2px;
		background: transparent;
		color: inherit;
		font: inherit;
	}
	.mots {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.mots input {
		width: 5rem;
		flex: none;
	}
	.jauge {
		position: relative;
		flex: 1;
		height: 2px;
		background: color-mix(in srgb, var(--t-tinta) 35%, transparent);
	}
	.bande {
		position: absolute;
		top: -3px;
		height: 8px;
		background: var(--t-aur);
		opacity: 0.35;
	}
	.marca {
		position: absolute;
		top: -8px;
		width: 3px;
		height: 18px;
		margin-left: -1px;
		background: var(--t-tinta);
	}
	.conselh {
		margin: 0.6rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}
	.conselh.fora {
		color: var(--t-aur);
	}
	.sources {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.sources a {
		color: inherit;
	}
	.plan-cap {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}
	.ligam-boton {
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		font-size: 0.95rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.plan {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.plan li {
		display: grid;
		grid-template-columns: 1.6rem minmax(0, 1fr) auto;
		gap: 0.6rem;
		align-items: start;
		padding: 0.6rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.plan-num {
		font-family: var(--font-heading);
		font-size: 1.2rem;
		line-height: 1.4;
	}
	.plan-nom {
		margin: 0 0 0.35rem;
	}
	.plan-gestes {
		display: flex;
		gap: 0.25rem;
	}
	.plan-gestes button {
		width: 2rem;
		height: 2rem;
		border: 1px solid color-mix(in srgb, var(--t-tinta) 35%, transparent);
		border-radius: 2px;
		background: transparent;
		color: inherit;
		font-size: 1rem;
		cursor: pointer;
	}
	.plan-gestes button:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.estat {
		font-size: 0.82rem;
		white-space: nowrap;
		color: var(--t-tinta-2);
	}
	.estat-crear {
		color: var(--t-aur);
	}

	.colona h3.biblio-titol {
		margin-top: 2rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--t-linha);
		font-size: 1.4rem;
	}
	.grop {
		margin-top: 1rem;
	}
	.grop-nom {
		margin: 0 0 0.3rem;
		font-size: 1rem;
		color: var(--t-tinta-2);
	}
	.modalitats li + li {
		border-top: 1px solid var(--t-linha);
	}
	.modalitat {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0 1rem;
		width: 100%;
		padding: 0.55rem 0.4rem;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.modalitat:hover,
	.modalitat:focus-visible {
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
	}
	.m-nom {
		grid-column: 1;
	}
	.m-desc {
		grid-column: 1;
		font-size: 0.88rem;
		color: var(--t-tinta-2);
	}
	.modalitat .estat {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
	}
</style>
