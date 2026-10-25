<script>
	// Le tri des artistes de l'espace musique (Romain, 2026-10-25, option A :
	// « liste préparée, tu tries »). La liste vient de MusicBrainz (disques
	// chantés en occitan) croisée avec Deezer (scripts/musica-candidats.mjs).
	// Romain coche ceux qui vont dans le journal du café, étoile ses coups de
	// cœur, ajoute au besoin un artiste par son nom, puis enregistre : la liste
	// part dans pagina_elements (page « musica ») et elle est publiée d'un coup,
	// avec une photographie pour revenir en arrière ($lib/musica.js).
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { supabase } from '$lib/supabaseClient';
	import candidats from '$lib/data/musica-candidats.json';
	import { PAGINA, LISTA, CÒRS, EXEMPLES, CÒRS_EXEMPLES, ligamDeezer, idsDe, fotoVuèja } from '$lib/musica.js';

	const causits = new SvelteSet();
	const còrs = new SvelteSet();
	let apondes = $state([]); // ajoutés par le nom (absents de la liste préparée)
	let publicats = $state([]);
	let cargant = $state(true);
	let jaTriat = $state(false);
	let msg = $state(null);
	let enregistrant = $state(false);
	let cambiat = $state(false);
	let filtre = $state('tot');
	let cerca = $state('');

	let nom = $state('');
	let resultats = $state(null);
	let cercant = $state(false);

	const totes = $derived([...candidats, ...apondes]);
	const net = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
	const vists = $derived(
		totes.filter(
			(a) =>
				(filtre === 'tot' || (filtre === 'causits') === causits.has(a.id)) && (!cerca || net(a.nom).includes(net(cerca)))
		)
	);
	const talha = (u, n) => u?.replace(/\/\d+x\d+-/, `/${n}x${n}-`);
	const vuèja = fotoVuèja;

	onMount(async () => {
		const { data, error } = await supabase
			.from('pagina_elements')
			.select('clau,lista,ordre,oc,fr,ligam,tipe,visible,suprimit')
			.eq('pagina', PAGINA)
			.eq('estat', 'publicat');
		cargant = false;
		if (error) return (msg = { tipe: 'error', text: error.message });
		publicats = data;
		const ids = idsDe(data, LISTA);
		jaTriat = ids.length > 0;
		// avant le premier tri, les exemples de la page d'essai sont déjà cochés
		const perNom = (noms) => candidats.filter((a) => noms.includes(a.nom)).map((a) => a.id);
		for (const id of jaTriat ? ids : perNom(EXEMPLES)) causits.add(id);
		for (const id of jaTriat ? idsDe(data, CÒRS) : perNom(CÒRS_EXEMPLES)) còrs.add(id);
		// ceux qui ont été ajoutés par le nom : on n'a que leur nom
		const coneguts = new Set(candidats.map((a) => a.id));
		apondes = data
			.filter((e) => e.lista === LISTA)
			.map((e) => ({ id: Number(e.ligam.split('/').pop()), nom: e.oc }))
			.filter((a) => !coneguts.has(a.id));
	});

	function gardar(a, sí) {
		if (sí) causits.add(a.id);
		else {
			causits.delete(a.id);
			còrs.delete(a.id);
		}
		cambiat = true;
	}
	function còr(a) {
		if (còrs.has(a.id)) còrs.delete(a.id);
		else {
			còrs.add(a.id);
			causits.add(a.id);
		}
		cambiat = true;
	}

	async function cercar(e) {
		e.preventDefault();
		if (nom.trim().length < 2) return;
		cercant = true;
		resultats = await fetch(`/api/musica/cercar?q=${encodeURIComponent(nom.trim())}`)
			.then((r) => r.json())
			.catch(() => []);
		cercant = false;
	}
	function apondre(r) {
		if (!totes.some((a) => a.id === r.id)) apondes = [...apondes, { id: r.id, nom: r.nom, imatge: r.imatge, fans: r.fans }];
		gardar(r, true);
		resultats = null;
		nom = '';
		filtre = 'tot';
		cerca = r.nom;
	}

	// tout part en brouillon, puis la page « musica » est publiée d'un coup
	async function enregistrar() {
		enregistrant = true;
		msg = null;
		const nomDe = (id) => totes.find((a) => a.id === id)?.nom ?? String(id);
		const linha = (lista, id, k) => ({
			clau: `${lista}.${id}`,
			estat: 'brolhon',
			pagina: PAGINA,
			tipe: 'ligam',
			lista,
			ordre: k + 1,
			oc: nomDe(id),
			fr: nomDe(id),
			ligam: ligamDeezer(id),
			visible: true,
			suprimit: false
		});
		const perNom = [...causits].sort((x, y) => nomDe(x).localeCompare(nomDe(y), 'fr'));
		const linhas = [...perNom.map((id, k) => linha(LISTA, id, k)), ...[...còrs].map((id, k) => linha(CÒRS, id, k))];
		const claus = new Set(linhas.map((l) => l.clau));
		for (const e of publicats) if (!claus.has(e.clau)) linhas.push({ ...e, estat: 'brolhon', pagina: PAGINA, suprimit: true });

		let r = await supabase.from('pagina_elements').delete().eq('pagina', PAGINA).eq('estat', 'brolhon');
		if (!r.error) r = await supabase.from('pagina_elements').upsert(linhas, { onConflict: 'clau,estat' });
		if (!r.error) r = await supabase.rpc('publicar_pagina', { p_pagina: PAGINA });
		if (!r.error) r = await supabase.from('pagina_elements').select('clau,lista,ordre,oc,fr,ligam,tipe,visible,suprimit').eq('pagina', PAGINA).eq('estat', 'publicat');
		enregistrant = false;
		if (r.error) return (msg = { tipe: 'error', text: r.error.message });
		publicats = r.data;
		jaTriat = true;
		cambiat = false;
		msg = { tipe: 'ok', text: `Enregistrat : ${causits.size} dins lo jornal, ${còrs.size} còps de còr. (Enregistré ; le café se met à jour dans la minute.)` };
	}
</script>

<section class="tria">
	<header>
		<h1>Musica : la tria <em>(Musique : le tri)</em></h1>
		<p>
			Causís qui va dins lo jornal del cafè, e pausa una estela sus tos còps de còr. De còps es un autre amb lo meteis nom : escota sus Deezer
			se as un dobte.
			<em
				>(Choisis qui va dans le journal du café, et mets une étoile sur tes coups de cœur. Parfois c'est un autre avec le même nom : écoute sur
				Deezer en cas de doute. La liste vient de MusicBrainz, disques chantés en occitan.)</em
			>
		</p>
		{#if !cargant && !jaTriat}
			<p class="nòta">Los exemples de la pagina d'ensag son ja causits. <em>(Les exemples de la page d'essai sont déjà cochés.)</em></p>
		{/if}
	</header>

	<form class="apondre" onsubmit={cercar}>
		<label for="nom-apondre">Apondre per lo nom <em>(Ajouter par le nom)</em></label>
		<div class="apondre-linha">
			<input id="nom-apondre" type="search" bind:value={nom} autocomplete="off" />
			<button type="submit" disabled={cercant}>{cercant ? '…' : 'Cercar'}</button>
		</div>
		{#if resultats}
			<ul class="resultats">
				{#each resultats as r (r.id)}
					<li>
						{#if !vuèja(r.imatge)}<img src={r.imatge} alt="" width="56" height="56" loading="lazy" />{:else}<span class="sens-foto"></span>{/if}
						<span class="r-nom"><b>{r.nom}</b> <small>{r.albums} albums · ♥ {r.fans}</small></span>
						<a href={ligamDeezer(r.id)} target="_blank" rel="noopener noreferrer">Deezer ↗</a>
						<button type="button" onclick={() => apondre(r)} disabled={causits.has(r.id)}>{causits.has(r.id) ? '✓' : 'Apondre'}</button>
					</li>
				{:else}
					<li>Pas res. <em>(Rien.)</em></li>
				{/each}
			</ul>
		{/if}
	</form>

	<div class="barra-filtre">
		<div class="filtres" role="group" aria-label="Mostrar">
			{#each [['tot', 'Tot', 'Tout'], ['causits', 'Causits', 'Cochés'], ['pas', 'Pas causits', 'Non cochés']] as [v, oc, fr] (v)}
				<button type="button" class:actiu={filtre === v} aria-pressed={filtre === v} onclick={() => (filtre = v)} title={fr}>{oc}</button>
			{/each}
		</div>
		<input type="search" placeholder="Cercar un nom" aria-label="Cercar un nom" bind:value={cerca} />
	</div>

	{#if cargant}
		<p>Un momenton…</p>
	{:else}
		<ul class="cartas">
			{#each vists as a (a.id)}
				{@const sí = causits.has(a.id)}
				<li class="carta" class:sí>
					<label class="carta-cap">
						<input type="checkbox" checked={sí} onchange={(e) => gardar(a, e.currentTarget.checked)} />
						{#if !vuèja(a.imatge)}
							<img src={talha(a.imatge, 120)} alt="" width="120" height="120" loading="lazy" />
						{:else if a.album}
							<img src={a.album.cobèrta} alt="" width="120" height="120" loading="lazy" />
						{:else}<span class="sens-foto"></span>{/if}
						<span class="carta-nom">{a.nom}</span>
					</label>
					<button type="button" class="estela" class:actiu={còrs.has(a.id)} aria-pressed={còrs.has(a.id)} onclick={() => còr(a)} title="Còp de còr (coup de cœur)">★</button>
					<dl>
						{#if a.album}
							<dt>Lo disc mai recent</dt>
							<dd><i>{a.album.titol}</i> ({a.album.data.slice(0, 4)}){#if a.album.tipe && a.album.tipe !== 'album'} · {a.album.tipe}{/if}</dd>
						{/if}
						{#if a.exempleOc}
							<dt>En occitan</dt>
							<dd><i>{a.exempleOc.titol}</i>{a.exempleOc.annada ? ` (${a.exempleOc.annada})` : ''}</dd>
						{/if}
					</dl>
					<p class="pè">
						{#if a.fans != null}<span title="Abonnés Deezer">♥ {a.fans.toLocaleString('fr-FR')}</span>{/if}
						<a href={ligamDeezer(a.id)} target="_blank" rel="noopener noreferrer">Escotar sus Deezer ↗</a>
					</p>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="enregistrar">
		<p>
			<b>{causits.size}</b> dins lo jornal · <b>{còrs.size}</b> ★
			{#if cambiat}<span class="cambiat">· pas enregistrat <em>(non enregistré)</em></span>{/if}
		</p>
		<button type="button" onclick={enregistrar} disabled={enregistrant || cargant}>{enregistrant ? '…' : 'Enregistrar'}</button>
		{#if msg}<p class="msg {msg.tipe}" role="status">{msg.text}</p>{/if}
	</div>
</section>

<style>
	.tria {
		width: min(100%, 72rem);
		padding-bottom: 6rem;
	}
	h1 {
		margin: 0 0 0.6rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
	}
	h1 em {
		font-size: 0.5em;
	}
	header p {
		max-width: 62ch;
		line-height: 1.5;
	}
	em {
		color: var(--t-tinta-2, #6b5a4c);
	}
	.nòta {
		padding: 0.5rem 0.8rem;
		border-left: 3px solid var(--color-gold, #eeaf34);
		background: rgba(255, 255, 255, 0.7);
	}

	.apondre {
		margin: 1.2rem 0;
		padding: 1rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.8);
	}
	.apondre label {
		font-weight: 700;
	}
	.apondre-linha {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.4rem;
	}
	input[type='search'] {
		flex: 1;
		min-width: 0;
		padding: 0.5rem 0.8rem;
		border: 1px solid rgba(42, 26, 16, 0.3);
		border-radius: 99px;
		font: inherit;
	}
	button {
		font: inherit;
		cursor: pointer;
	}
	.apondre button,
	.resultats button,
	.enregistrar button {
		padding: 0.5rem 1.1rem;
		border: 0;
		border-radius: 99px;
		background: #b53d17;
		color: #fbf1e1;
		font-weight: 700;
	}
	button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.resultats {
		margin: 0.8rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.4rem;
	}
	.resultats li {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}
	.resultats img,
	.resultats .sens-foto {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
	}
	.r-nom {
		flex: 1;
	}
	.sens-foto {
		display: block;
		background: rgba(42, 26, 16, 0.12);
	}

	.barra-filtre {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
		align-items: center;
		padding: 0.6rem 0;
		background: color-mix(in srgb, var(--color-cream, #f7f3ee) 92%, transparent);
	}
	.barra-filtre input {
		flex: 1 1 12rem;
	}
	.filtres {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.8);
	}
	.filtres button {
		padding: 0.4rem 0.9rem;
		border: 0;
		border-radius: 99px;
		background: none;
	}
	.filtres button.actiu {
		background: #2a1a10;
		color: #fbf1e1;
	}

	.cartas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 0.8rem;
		margin: 0.4rem 0 0;
		padding: 0;
		list-style: none;
	}
	.carta {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.8rem;
		border: 2px solid transparent;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.75);
		opacity: 0.7;
		transition:
			opacity 0.2s,
			border-color 0.2s;
	}
	.carta.sí {
		opacity: 1;
		border-color: #b53d17;
		background: #fff;
	}
	.carta-cap {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		cursor: pointer;
		padding-right: 2rem;
	}
	.carta-cap input {
		width: 1.3rem;
		height: 1.3rem;
		accent-color: #b53d17;
		flex: none;
	}
	.carta-cap img,
	.carta-cap .sens-foto {
		width: 64px;
		height: 64px;
		border-radius: 6px;
		object-fit: cover;
		flex: none;
	}
	.carta-nom {
		font-family: var(--font-heading);
		font-size: 1.15rem;
		line-height: 1.1;
	}
	.estela {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		border: 0;
		border-radius: 50%;
		background: none;
		color: rgba(42, 26, 16, 0.25);
		font-size: 1.3rem;
	}
	.estela.actiu {
		color: #c98a2b;
	}
	dl {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.35;
	}
	dt {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}
	dd {
		margin: 0 0 0.3rem;
	}
	.pè {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin: auto 0 0;
		font-size: 0.82rem;
	}
	.pè a {
		color: inherit;
		font-weight: 700;
		text-decoration-color: #b53d17;
		text-underline-offset: 3px;
	}
	button:focus-visible,
	input:focus-visible,
	a:focus-visible,
	.carta-cap:has(input:focus-visible) {
		outline: 3px solid var(--color-gold, #eeaf34);
		outline-offset: 2px;
	}

	.enregistrar {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 5;
		transform: translateX(-50%);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.4rem 1rem;
		width: min(calc(100% - 2rem), 44rem);
		padding: 0.6rem 0.8rem 0.6rem 1.2rem;
		border-radius: 16px;
		background: #2a1a10;
		color: #fbf1e1;
		box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
	}
	.enregistrar p {
		margin: 0;
	}
	.enregistrar em {
		color: rgba(251, 241, 225, 0.75);
	}
	.cambiat {
		color: #eeaf34;
	}
	.msg {
		flex-basis: 100%;
		font-size: 0.88rem;
	}
	.msg.error {
		color: #ffb4a0;
	}
</style>
