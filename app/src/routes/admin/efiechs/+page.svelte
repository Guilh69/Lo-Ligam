<script>
	// L'atelier des effets (bibliothèque Efièch, 2026-11-15). Romain : « il me faut
	// une bibliothèque fournie », des effets qu'il crée lui-même, sans toucher au
	// code. Il choisit un emplacement du site, dépose un dessin SVG (ou garde les
	// formes de papier), choisit un mouvement et une apparition, règle les
	// curseurs en regardant l'aperçu, garde le brouillon puis « Publicar ».
	//
	// Même circuit que les textes et les couleurs : table pagina_elements, « page »
	// efiechs, une ligne par emplacement ; brouillon visible de lui seul ;
	// publicar_pagina() rend public et garde la photographie d'avant. Le dessin
	// déposé n'est jamais rangé tel quel : la bibliothèque n'en garde que la
	// géométrie (nettoyerSvg), et le relit avec la même rigueur (legida.js).
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { simulacion } from '$lib/talhier/notas.svelte.js';
	import { page } from '$app/state';
	import { EMPLACAMENTS, PAGINA, clauDe, PREFIXE_ELEMENT, idElement, elementDeId, clauElementValida, paginaDeClau, DECLENCHEURS } from '$lib/efiech/emplacaments.js';
	import { CAMINS } from '$lib/talhier/pila.js';
	import { etiqueta } from '$lib/edicion/etiquetas.js';
	import { escriure, legir, couleursSite } from '$lib/efiech/legida.js';
	import { MOUVEMENTS, APPARITIONS, reglagesDe, configPropre, nettoyerSvg, versSvg, couleursDessin, LIMITES, lancer } from '$lib/efiech/biblio/index.js';

	const simular = simulacion();

	// clau → { publicat: oc | undefined, brolhon: { oc, suprimit } | undefined }
	let lignes = $state({});
	let cargat = $state(false);
	let choisi = $state(EMPLACAMENTS[0].id);
	let config = $state(configPropre({ mouvement: 'chute', apparition: 'explosion' }));
	let dessin = $state(null);
	let nomDessin = $state('');
	let avis = $state([]);
	let modifie = $state(false);
	let ocupat = $state(false);
	let msg = $state(null);
	let fige = $state(false);
	let zone = $state();
	let fichier = $state();

	const vignette = (d) => (d ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(versSvg(d)) : '');
	let declencheur = $state('apparition');

	// un emplacement fixe, ou un élément d'une page (« cliquer l'élément », 15-11)
	function emplacamentDe(id) {
		const el = elementDeId(id);
		if (!el) return EMPLACAMENTS.find((e) => e.id === id);
		const pagina = paginaDeClau(el);
		return { id, element: el, nom: etiqueta(el, true), texte: `sur la page ${CAMINS[pagina] ?? pagina}`, camin: CAMINS[pagina] ?? null };
	}
	const emplacamentChoisi = $derived(emplacamentDe(choisi));
	// l'élément venu de la page (?element=…) et ceux qui ont déjà un effet
	let elementDemande = $state(null);
	const elements = $derived(
		[...new Set([...(elementDemande ? [elementDemande] : []), ...Object.keys(lignes).filter((c) => c.startsWith(PREFIXE_ELEMENT)).map((c) => c.slice(PREFIXE_ELEMENT.length))])]
			.filter((c) => clauElementValida(c) && CAMINS[paginaDeClau(c)])
			.map((c) => emplacamentDe(idElement(c)))
	);
	const reglages = $derived(reglagesDe(config.mouvement, config.apparition));
	const communs = $derived(reglages.filter((r) => !r.cle.includes('.')));
	const duMouvement = $derived(reglages.filter((r) => r.cle.startsWith('m.')));
	const deLApparition = $derived(reglages.filter((r) => r.cle.startsWith('a.')));
	const aPublier = $derived(Object.values(lignes).some((l) => l.brolhon));

	function etat(id) {
		const l = lignes[clauDe(id)];
		if (l?.brolhon) return l.brolhon.suprimit ? 'retrait à publier' : l.publicat ? 'brouillon, changé' : 'brouillon, nouveau';
		return l?.publicat ? 'publié' : 'vide';
	}

	onMount(async () => {
		const el = page.url.searchParams.get('element');
		if (clauElementValida(el) && CAMINS[paginaDeClau(el)]) {
			elementDemande = el;
			choisi = idElement(el);
		}
		if (simular) {
			cargat = true;
			ouvrir(choisi);
			return;
		}
		const { data, error } = await supabase.from('pagina_elements').select('clau,estat,oc,suprimit').eq('pagina', PAGINA);
		if (error) msg = { tipe: 'error', text: 'La base ne répond pas : ' + error.message };
		const l = {};
		for (const r of data ?? []) {
			const x = (l[r.clau] ??= {});
			if (r.estat === 'publicat') x.publicat = r.oc;
			else x.brolhon = { oc: r.oc, suprimit: r.suprimit };
		}
		lignes = l;
		cargat = true;
		ouvrir(choisi);
	});

	function ouvrir(id) {
		if (modifie && !confirm('Les réglages de cet emplacement ne sont pas gardés. Changer quand même ?')) return;
		choisi = id;
		const l = lignes[clauDe(id)];
		const oc = l?.brolhon && !l.brolhon.suprimit ? l.brolhon.oc : l?.publicat;
		const enr = oc ? legir(oc) : null;
		// (un effet d'événement ou d'élément joue une fois : il a une durée de vie)
		const unCop = id === 'reussita' || !!elementDeId(id);
		config = enr?.config ?? configPropre({ mouvement: 'chute', apparition: id === 'reussita' ? 'explosion' : elementDeId(id) ? 'eclatement' : 'fondu', reglages: unCop ? { vie: 3 } : {} });
		declencheur = enr?.declencheur ?? 'apparition';
		dessin = enr?.dessin ?? null;
		nomDessin = dessin ? 'dessin enregistré' : '';
		avis = oc && !enr ? ['Ce qui était rangé n’a pas pu être relu : réglages par défaut.'] : [];
		modifie = false;
		msg = null;
	}

	function changer(f) {
		f();
		config = configPropre(config); // complète les réglages de la nouvelle combinaison
		modifie = true;
	}

	async function deposer() {
		const f = fichier?.files?.[0];
		if (!f) return;
		avis = [];
		if (f.size > LIMITES.fichier) {
			avis = ['Le fichier est trop lourd (400 Ko au plus). L’enregistrer plus simple dans le logiciel de dessin.'];
			return;
		}
		const r = nettoyerSvg(await f.text());
		avis = r.avis;
		if (r.dessin) {
			dessin = r.dessin;
			nomDessin = f.name;
			modifie = true;
		}
		fichier.value = '';
	}

	// --- l'aperçu : relancé un quart de seconde après le dernier changement
	let effet = null;
	let attente = 0;
	function relancer() {
		effet?.arreter();
		effet = null;
		if (!zone) return;
		const c = $state.snapshot(config);
		effet = lancer(zone, {
			...c,
			dessins: dessin ? [$state.snapshot(dessin)] : [],
			couleurs: couleursSite(),
			fige,
			// un effet qui s'efface (réussite) se rejoue tout seul dans l'aperçu
			auFin: () => (attente = setTimeout(relancer, 900))
		});
	}
	$effect(() => {
		JSON.stringify(config);
		dessin;
		fige;
		if (!zone || !cargat) return;
		clearTimeout(attente);
		attente = setTimeout(relancer, 250);
		return () => clearTimeout(attente);
	});
	$effect(() => () => effet?.arreter());

	// --- la base
	async function ecrire(ligne) {
		if (simular) {
			// (essai : la page du site le joue en « ?edicion=simular », voir EfiechsSite)
			try {
				const l = JSON.parse(sessionStorage.getItem('efiech-simular') ?? '[]').filter((r) => r.clau !== ligne.clau);
				if (!ligne.suprimit) l.push({ clau: ligne.clau, oc: ligne.oc });
				sessionStorage.setItem('efiech-simular', JSON.stringify(l));
			} catch {
				// stockage indisponible
			}
			return null;
		}
		const { error } = await supabase.from('pagina_elements').upsert({ pagina: PAGINA, tipe: 'bloc', estat: 'brolhon', ...ligne }, { onConflict: 'clau,estat' });
		return error;
	}

	async function garder() {
		let oc;
		try {
			oc = escriure($state.snapshot(config), dessin ? $state.snapshot(dessin) : null, elementDeId(choisi) ? declencheur : null);
		} catch (e) {
			msg = { tipe: 'error', text: e.message };
			return false;
		}
		ocupat = true;
		const clau = clauDe(choisi);
		const error = await ecrire({ clau, oc, suprimit: false });
		ocupat = false;
		if (error) {
			msg = { tipe: 'error', text: 'Le brouillon n’a pas été gardé : ' + error.message };
			return false;
		}
		lignes[clau] = { ...lignes[clau], brolhon: { oc, suprimit: false } };
		modifie = false;
		msg = { tipe: 'ok', text: `Brouillon gardé pour « ${emplacamentChoisi.nom} ». Il ne se voit pas encore sur le site.` };
		return true;
	}

	async function retirer() {
		const clau = clauDe(choisi);
		if (!lignes[clau]?.publicat && !lignes[clau]?.brolhon) return;
		if (!confirm(`Retirer l’effet de « ${emplacamentChoisi.nom} » ? Il disparaîtra du site à la prochaine publication.`)) return;
		ocupat = true;
		const error = lignes[clau]?.publicat
			? await ecrire({ clau, oc: lignes[clau].publicat, suprimit: true })
			: simular
				? null
				: (await supabase.from('pagina_elements').delete().eq('clau', clau).eq('estat', 'brolhon')).error;
		ocupat = false;
		if (error) return void (msg = { tipe: 'error', text: error.message });
		if (lignes[clau]?.publicat) lignes[clau] = { ...lignes[clau], brolhon: { oc: lignes[clau].publicat, suprimit: true } };
		else delete lignes[clau];
		modifie = false;
		msg = { tipe: 'ok', text: 'Retrait noté : il se fera en publiant.' };
	}

	async function publicar() {
		if (modifie && !(await garder())) return;
		if (!confirm('Publier tous les brouillons d’effets ? Ils se verront aussitôt sur le site.')) return;
		ocupat = true;
		const { error } = simular ? { error: null } : await supabase.rpc('publicar_pagina', { p_pagina: PAGINA });
		ocupat = false;
		if (error) return void (msg = { tipe: 'error', text: 'La publication a échoué : ' + error.message });
		const l = {};
		for (const [clau, x] of Object.entries(lignes)) {
			if (x.brolhon?.suprimit) continue;
			l[clau] = { publicat: x.brolhon ? x.brolhon.oc : x.publicat };
		}
		lignes = l;
		msg = { tipe: 'ok', text: 'Publié : les effets sont en ligne (il faut parfois recharger la page du site).' };
	}
</script>

<svelte:head>
	<title>Efièch — Espaci d'administracion</title>
</svelte:head>

<div class="atelier">
	<header class="cap">
		<h1>Efièch</h1>
		<p class="chapo">
			Les effets du site : choisis un endroit, dépose ton dessin, choisis comment il bouge et comment il entre en scène, règle en regardant l’aperçu, garde le brouillon,
			puis publie.
		</p>
	</header>

	{#if simular}<p class="msg info">Simulation : rien n’est lu ni écrit dans la base.</p>{/if}

	<section class="bloc" aria-labelledby="t-endroit">
		<h2 id="t-endroit"><span class="num">01</span> L’endroit</h2>
		<ul class="endroits">
			{#each EMPLACAMENTS as e (e.id)}
				<li>
					<button type="button" class="endroit" aria-pressed={choisi === e.id} onclick={() => ouvrir(e.id)}>
						<span class="nom">{e.nom}</span>
						<span class="texte">{e.texte}</span>
						<span class="etat" class:vide={etat(e.id) === 'vide'}>{etat(e.id)}</span>
					</button>
				</li>
			{/each}
		</ul>

		<h3 class="sous-titre">Sur un élément d’une page</h3>
		<p class="aide">
			Pour en ajouter un : ouvre la page, « Modifier la page », touche l’élément (un titre, un bouton, une image), puis « Un effet sur cet élément ». L’effet part de
			l’élément.
		</p>
		{#if elements.length}
			<ul class="endroits">
				{#each elements as e (e.id)}
					<li>
						<button type="button" class="endroit" aria-pressed={choisi === e.id} onclick={() => ouvrir(e.id)}>
							<span class="nom">{e.nom}</span>
							<span class="texte">{e.texte}</span>
							<span class="etat" class:vide={etat(e.id) === 'vide'}>{etat(e.id)}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
		{#if emplacamentChoisi?.element}
			<fieldset class="choix-ligne declencheur">
				<legend>Quand l’effet part</legend>
				{#each DECLENCHEURS as d (d.id)}
					<label title={d.texte}
						><input type="radio" name="declencheur" value={d.id} checked={declencheur === d.id} onchange={() => ((declencheur = d.id), (modifie = true))} /> {d.nom}</label
					>
				{/each}
			</fieldset>
			<p class="desc">{DECLENCHEURS.find((d) => d.id === declencheur)?.texte}</p>
			{#if emplacamentChoisi.camin}<p><a class="lien-page" href={emplacamentChoisi.camin}>Voir la page</a> (après « Publicar » ; recharger la page)</p>{/if}
		{/if}
	</section>

	<div class="travail">
		<div class="reglages">
			<section class="bloc" aria-labelledby="t-dessin">
				<h2 id="t-dessin"><span class="num">02</span> Le dessin</h2>
				<div class="dessin">
					{#if dessin}
						<img src={vignette(dessin)} alt="" width="72" height="72" />
						<p>
							<strong>{nomDessin}</strong><br />
							{dessin.traces.length} forme{dessin.traces.length > 1 ? 's' : ''}, {couleursDessin(dessin).length} couleur{couleursDessin(dessin).length > 1 ? 's' : ''}
						</p>
					{:else}
						<p>Pas de dessin : l’effet prend les formes de papier découpé (rond, triangle, feuille, carré, étoile).</p>
					{/if}
				</div>
				<div class="actions-dessin">
					<label class="bouton second">
						Déposer un SVG
						<input bind:this={fichier} type="file" accept=".svg,image/svg+xml" onchange={deposer} />
					</label>
					{#if dessin}<button type="button" class="lien" onclick={() => ((dessin = null), (nomDessin = ''), (modifie = true))}>Revenir aux formes de papier</button>{/if}
				</div>
				<p class="aide">
					Depuis Affinity ou Canva : exporter en SVG, textes vectorisés. Seules les formes et leurs couleurs sont gardées ; le reste du fichier est jeté.
				</p>
				{#if avis.length}
					<ul class="avis" role="status">
						{#each avis as a}<li>{a}</li>{/each}
					</ul>
				{/if}
				<fieldset class="choix-ligne">
					<legend>Couleurs</legend>
					<label><input type="radio" name="teinte" value="dessin" checked={config.teinte === 'dessin'} onchange={() => changer(() => (config.teinte = 'dessin'))} /> celles du dessin</label>
					<label><input type="radio" name="teinte" value="palette" checked={config.teinte === 'palette'} onchange={() => changer(() => (config.teinte = 'palette'))} /> celles du site</label>
				</fieldset>
				{#if dessin}
					<label class="case"><input type="checkbox" checked={config.formes} onchange={(e) => changer(() => (config.formes = e.currentTarget.checked))} /> mêler les formes de papier au dessin</label>
				{/if}
			</section>

			<section class="bloc" aria-labelledby="t-mouv">
				<h2 id="t-mouv"><span class="num">03</span> Le mouvement</h2>
				<p class="aide">Comment les pièces bougent une fois là.</p>
				<ul class="effets">
					{#each MOUVEMENTS as m (m.id)}
						<li>
							<button type="button" aria-pressed={config.mouvement === m.id} title={m.texte} onclick={() => changer(() => (config.mouvement = m.id))}>
								<span class="n">{m.num}</span>{m.nom}
							</button>
						</li>
					{/each}
				</ul>
				<p class="desc">{MOUVEMENTS.find((m) => m.id === config.mouvement)?.texte}</p>
				{@render curseurs(duMouvement)}
			</section>

			<section class="bloc" aria-labelledby="t-app">
				<h2 id="t-app"><span class="num">04</span> L’apparition</h2>
				<p class="aide">Comment les pièces entrent en scène.</p>
				<ul class="effets">
					{#each APPARITIONS as a (a.id)}
						<li>
							<button type="button" aria-pressed={config.apparition === a.id} title={a.texte} onclick={() => changer(() => (config.apparition = a.id))}>
								<span class="n">{a.num}</span>{a.nom}
							</button>
						</li>
					{/each}
				</ul>
				<p class="desc">{APPARITIONS.find((a) => a.id === config.apparition)?.texte}</p>
				{@render curseurs(deLApparition)}
			</section>

			<section class="bloc" aria-labelledby="t-tout">
				<h2 id="t-tout"><span class="num">05</span> Pour tout l’effet</h2>
				{@render curseurs(communs)}
			</section>
		</div>

		<div class="apercu-col">
			<div class="apercu-tete">
				<h2>Aperçu <span class="sur">· {emplacamentChoisi?.nom}</span></h2>
				<button type="button" class="lien" onclick={relancer}>Rejouer</button>
			</div>
			<div class="apercu" bind:this={zone}></div>
			<label class="case"><input type="checkbox" bind:checked={fige} /> voir comme un appareil qui demande moins d’animations</label>

			{#if msg}<p class="msg {msg.tipe}" role="status">{msg.text}</p>{/if}

			<div class="actions">
				<button type="button" class="bouton second" disabled={ocupat || !modifie} onclick={garder}>Garder le brouillon</button>
				<button type="button" class="bouton" disabled={ocupat || (!aPublier && !modifie)} onclick={publicar}>Publicar</button>
			</div>
			<p class="aide">
				{#if modifie}Des réglages ne sont pas encore gardés.{:else if aPublier}Des brouillons attendent d’être publiés.{:else}Tout est publié.{/if}
				{#if etat(choisi) !== 'vide' && etat(choisi) !== 'retrait à publier'}
					<button type="button" class="lien" onclick={retirer}>Retirer l’effet de cet endroit</button>
				{/if}
			</p>
		</div>
	</div>
</div>

{#snippet curseurs(liste)}
	{#if liste.length}
		<div class="curseurs">
			{#each liste as r (r.cle)}
				{#if r.type === 'choix'}
					<label class="curseur">
						<span class="lib">{r.nom}</span>
						<select value={config.reglages[r.cle]} onchange={(e) => changer(() => (config.reglages[r.cle] = e.currentTarget.value))}>
							{#each r.options as [v, t]}<option value={v}>{t}</option>{/each}
						</select>
					</label>
				{:else}
					<label class="curseur">
						<span class="lib">{r.nom}{#if r.aide}<em> ({r.aide})</em>{/if}</span>
						<input
							type="range"
							min={r.min}
							max={r.max}
							step={r.pas}
							value={config.reglages[r.cle]}
							oninput={(e) => changer(() => (config.reglages[r.cle] = Number(e.currentTarget.value)))}
						/>
						<output>{config.reglages[r.cle]}</output>
					</label>
				{/if}
			{/each}
		</div>
	{/if}
{/snippet}

<style>
	.atelier {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
		color: var(--color-text);
	}
	.cap h1 {
		font-family: var(--font-heading);
		font-size: 2.4rem;
		text-transform: uppercase;
		margin: 0;
	}
	.chapo {
		margin: 0.5rem 0 0;
		max-width: 46rem;
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.bloc {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border-top: 1px solid currentColor;
		padding-top: 0.9rem;
	}
	.bloc h2,
	.apercu-tete h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 400;
	}
	.num,
	.n {
		font-family: var(--font-heading);
		color: var(--color-terracotta);
		margin-right: 0.4em;
	}
	.aide,
	.desc {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.45;
		opacity: 0.85;
	}
	.desc {
		font-style: italic;
		opacity: 1;
	}

	/* les endroits : une liste à filets, l'endroit choisi en aplat brique */
	.endroits {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		border-top: 1px solid rgba(42, 26, 16, 0.18);
	}
	.endroit {
		width: 100%;
		min-height: 44px;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.1rem 0.8rem;
		text-align: left;
		padding: 0.6rem 0.7rem;
		background: none;
		border: none;
		border-bottom: 1px solid rgba(42, 26, 16, 0.18);
		color: inherit;
		font: inherit;
		cursor: pointer;
		border-radius: 0;
	}
	.endroit .nom {
		font-weight: 700;
	}
	.endroit .texte {
		grid-column: 1 / -1;
		font-size: 0.85rem;
		opacity: 0.8;
	}
	.endroit .etat {
		font-size: 0.8rem;
		color: var(--color-terracotta);
	}
	.endroit .etat.vide {
		color: inherit;
		opacity: 0.6;
	}
	.endroit[aria-pressed='true'] {
		background: var(--color-terracotta);
		color: #fff;
	}
	.endroit[aria-pressed='true'] .etat {
		color: #fff;
	}
	.sous-titre {
		margin: 1.6rem 0 0.3rem;
		font-size: 1rem;
	}
	.declencheur {
		margin-top: 1rem;
	}
	.lien-page {
		color: inherit;
		text-underline-offset: 0.2em;
	}
	.endroit:focus-visible,
	.effets button:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 2px;
	}

	.travail {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		gap: 2.5rem;
		align-items: start;
	}
	.reglages {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.apercu-col {
		position: sticky;
		top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.apercu-tete {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		border-top: 1px solid currentColor;
		padding-top: 0.9rem;
	}
	.sur {
		font-family: var(--font-body, inherit);
		font-size: 0.95rem;
		opacity: 0.8;
	}
	.apercu {
		position: relative;
		height: min(62vh, 30rem);
		overflow: hidden;
		border-top: 1px solid rgba(42, 26, 16, 0.18);
		border-bottom: 1px solid rgba(42, 26, 16, 0.18);
		background: var(--color-cream);
	}

	.dessin {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.dessin img {
		width: 72px;
		height: 72px;
		object-fit: contain;
	}
	.dessin p {
		margin: 0;
		line-height: 1.45;
	}
	.actions-dessin {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}
	.avis {
		margin: 0;
		padding-left: 1.1rem;
		font-size: 0.9rem;
		color: var(--color-brick);
	}

	.effets {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: 0 1rem;
	}
	.effets button {
		width: 100%;
		min-height: 40px;
		text-align: left;
		background: none;
		border: none;
		border-bottom: 1px solid rgba(42, 26, 16, 0.18);
		padding: 0.35rem 0.2rem;
		color: inherit;
		font: inherit;
		cursor: pointer;
		border-radius: 0;
	}
	.effets button[aria-pressed='true'] {
		background: var(--color-terracotta);
		color: #fff;
	}
	.effets button[aria-pressed='true'] .n {
		color: #fff;
	}

	.curseurs {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.atelier label.curseur {
		display: grid;
		font-weight: 400;
		grid-template-columns: minmax(8rem, 1fr) minmax(7rem, 1.3fr) 3.2rem;
		gap: 0.8rem;
		align-items: center;
		font-size: 0.95rem;
	}
	.curseur em {
		font-style: normal;
		opacity: 0.7;
		font-size: 0.85em;
	}
	.curseur input[type='range'] {
		width: 100%;
		accent-color: var(--color-terracotta);
	}
	.curseur select {
		grid-column: 2 / -1;
		font: inherit;
		min-height: 36px;
	}
	.curseur output {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}
	.choix-ligne {
		border: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.2rem;
	}
	/* la règle commune de l'admin met chaque label en colonne : ici, en ligne */
	.atelier .choix-ligne label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
		font-weight: 400;
		font-size: 0.95rem;
	}
	.choix-ligne legend {
		font-weight: 700;
		padding: 0;
		margin-bottom: 0.3rem;
	}
	.atelier label.case {
		display: flex;
		flex-direction: row;
		font-weight: 400;
		gap: 0.5rem;
		align-items: center;
		font-size: 0.95rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}
	.bouton {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 1.2rem;
		border: 1px solid var(--color-terracotta);
		border-radius: 2px;
		background: var(--color-terracotta);
		color: #fff;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.bouton.second {
		background: transparent;
		color: var(--color-terracotta);
	}
	.bouton:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.atelier label.bouton {
		position: relative;
		display: inline-flex;
		flex-direction: row;
		font-size: 1rem;
		color: var(--color-terracotta);
	}
	label.bouton input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}
	label.bouton:focus-within {
		outline: 2px solid var(--color-gold);
		outline-offset: 2px;
	}
	.lien {
		background: none;
		border: none;
		padding: 0;
		color: var(--color-terracotta);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		font: inherit;
		cursor: pointer;
	}

	@media (max-width: 860px) {
		.travail {
			grid-template-columns: 1fr;
		}
		.apercu-col {
			position: static;
			order: -1;
		}
		.apercu {
			height: 18rem;
		}
	}
</style>
