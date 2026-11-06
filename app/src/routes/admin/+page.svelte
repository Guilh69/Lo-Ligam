<script>
	// Per tu (Lo talhièr, lot 1, Romain 2026-11-06 ; revisions/2026-11-06-talhier.md) :
	// la porte de l'administration. En haut, ce qui attend la main de Romain
	// (réponses de l'IA, questions de l'IA, ses notes, profils et idées) ; puis
	// ce qui attend l'IA ; puis ce qui avance en fond ; enfin les ateliers,
	// rangés par usage. Chaque note mène à son endroit, sur sa page (?nota=…).
	// L'ancienne page d'entrée (le contrôle des verrous) est sur /admin/verrolhs.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { notas, cargarNotas, sòrta, bon, pasEncara, respondre, suprimir, tèxteACopiar, simulacion } from '$lib/talhier/notas.svelte.js';
	import { dictadaPossibla, dictar } from '$lib/talhier/dictada.js';
	import { TALHIÈRS, VERROLHS } from '$lib/talhier/talhiers.js';

	let regarder = $derived(notas.lista.filter((r) => sòrta(r) === 'regarder'));
	let questions = $derived(notas.lista.filter((r) => sòrta(r) === 'question'));
	let tasNòtas = $derived(notas.lista.filter((r) => sòrta(r) === 'nòta'));
	let espèra = $derived(notas.lista.filter((r) => ['espèra', 'respost'].includes(sòrta(r))));

	// ce qui attend ailleurs dans l'administration
	let perfils = $state(0);
	let ideas = $state(0);
	let fichas = $state(null);
	let uèi = $derived(regarder.length + questions.length + tasNòtas.length + (perfils ? 1 : 0) + (ideas ? 1 : 0));

	onMount(() => {
		cargarNotas();
		const vista = () => document.visibilityState === 'visible' && cargarNotas();
		document.addEventListener('visibilitychange', vista);
		// les fiches de grammaire encore à relire (le module est déjà celui de S'apren)
		import('$lib/gramatica/index.js').then(({ FICHAS }) => (fichas = FICHAS.filter((f) => !f.validada).length));
		if (simulacion()) {
			perfils = 2;
			ideas = 1;
		} else {
			supabase.rpc('perfils_en_espera').then(({ data }) => (perfils = (data ?? []).filter((p) => p.verificacion === 'en_espèra').length));
			supabase
				.from('ideas')
				.select('id', { count: 'exact', head: true })
				.eq('estat', 'nòva')
				.then(({ count }) => (ideas = count ?? 0));
		}
		return () => document.removeEventListener('visibilitychange', vista);
	});

	// --- répondre sur place (une seule note ouverte à la fois) ------------------
	let obèrt = $state(null); // { r, tipe: 'precision' | 'responsa' }
	let tèxte = $state('');
	let error = $state('');
	let mandant = $state(false);
	let escota = $state(false);
	let arrestarDictada = null;
	let segur = $state(null); // la note dont on confirme la suppression
	let copiat = $state(null);

	// le champ qui s'ouvre prend la main tout de suite (on dicte ou on écrit)
	const focus = (node) => node.focus();

	function obrir(r, tipe) {
		arrestarDictada?.();
		obèrt = { r, tipe };
		tèxte = '';
		error = '';
	}
	function tampar() {
		arrestarDictada?.();
		obèrt = null;
		tèxte = '';
	}
	function micro() {
		if (escota) return arrestarDictada?.();
		error = '';
		arrestarDictada = dictar(tèxte, { tèxte: (t) => (tèxte = t), fin: () => (escota = false), error: (m) => (error = m) });
		escota = true;
	}
	async function mandar() {
		if (!obèrt || tèxte.trim().length < 2 || mandant) return;
		arrestarDictada?.();
		mandant = true;
		const err = obèrt.tipe === 'precision' ? await pasEncara(obèrt.r, tèxte) : await respondre(obèrt.r, tèxte);
		mandant = false;
		if (err) return (error = err);
		tampar();
	}
	async function copiar(r) {
		try {
			await navigator.clipboard.writeText(tèxteACopiar(r));
			copiat = r.id;
			setTimeout(() => copiat === r.id && (copiat = null), 2400);
		} catch {
			error = 'La copie n’a pas marché : ton navigateur l’a refusée.';
		}
	}
	async function escafar(r) {
		segur = null;
		const err = await suprimir(r);
		if (err) error = err;
	}

	const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
	function quand(d) {
		const jorns = Math.round((new Date(d) - Date.now()) / 86400000);
		return rtf.format(jorns, 'day');
	}
	const PAGINAS = { '/': 'l’accueil', '/apren': 'S’apren', '/visio': 'les cours en visio', '/carta': 'la carte' };
	const ontEs = (r) => (r.modul ? `leçon ${r.modul.replace('-', '.')}` : (PAGINAS[r.pagina] ?? r.pagina));
	const ligam = (r) => `${r.pagina}?nota=${r.id}`;
</script>

<svelte:head>
	<title>Per tu — Espaci d'administracion</title>
</svelte:head>

{#snippet escritura()}
	<div class="escriure">
		<textarea use:focus bind:value={tèxte} rows="3" maxlength="2000" aria-label={obèrt.tipe === 'precision' ? 'Ce qui manque encore' : 'Ta réponse'} placeholder={obèrt.tipe === 'precision' ? 'Ce qui manque encore' : 'Ta réponse'}></textarea>
		<div class="accions">
			{#if dictadaPossibla}
				<button type="button" class="segond" class:escota onclick={micro} aria-pressed={escota}>{escota ? 'Arrestar' : 'Dictar'}</button>
			{/if}
			<span class="espaci"></span>
			<button type="button" class="segond" onclick={tampar}>Anullar</button>
			<button type="button" class="agir" onclick={mandar} disabled={tèxte.trim().length < 2 || mandant}>Mandar</button>
		</div>
	</div>
{/snippet}

{#snippet endreit(r)}
	<p class="ont">
		{#if r.extrait}« {r.extrait} » · {/if}{ontEs(r)} · <a href={ligam(r)}>Veire sus la pagina</a>
	</p>
{/snippet}

<section class="card pertu">
	<header>
		<h1>Per tu</h1>
		<p class="intro">
			Ce qui attend ta main, puis ce qui attend l’IA. Pour épingler une note : sur n’importe quelle page du site, touche « Comentar » dans la barre à droite, puis l’endroit ;
			choisis « Per l’IA » (Claude ou Mistral la relève à la prochaine séance et te répond ici) ou « Nòta » (pour toi).
		</p>
	</header>

	{#if notas.error}<p class="msg error" role="alert">{notas.error}</p>{/if}
	{#if error}<p class="msg error" role="alert">{error}</p>{/if}

	<h2>Aujourd’hui{uèi ? ` · ${uèi}` : ''}</h2>
	{#if !notas.cargat && !notas.error}
		<p class="calme">Un momenton…</p>
	{:else if !uèi}
		<p class="calme">Rien ne t’attend pour l’instant.</p>
	{:else}
		<ul class="lista">
			{#each regarder as r (r.id)}
				<li>
					<p class="sòrta acte">Responsa · {r.autor_responsa ?? 'IA'} <span class="quand">{quand(r.created_at)}</span></p>
					{@render endreit(r)}
					<p class="nòta"><span class="qui">Ta note :</span> {r.tèxte}</p>
					<p class="responsa">{r.responsa ?? (r.estat === 'escartada' ? 'Écartée, sans explication.' : 'Fait.')}</p>
					{#if r.estat === 'escartada'}<p class="ajuda">L’IA ne l’a pas faite : sa raison est ci-dessus.</p>{/if}
					{#if obèrt?.r.id === r.id}
						{@render escritura()}
					{:else}
						<div class="accions">
							<button type="button" class="agir" onclick={() => bon(r)}>Bon</button>
							<button type="button" class="segond" onclick={() => obrir(r, 'precision')}>Pas encara</button>
						</div>
					{/if}
				</li>
			{/each}

			{#each questions as r (r.id)}
				<li>
					<p class="sòrta acte">Question · {r.autor ?? 'IA'} <span class="quand">{quand(r.created_at)}</span></p>
					{#if r.extrait || r.pagina !== '/'}{@render endreit(r)}{/if}
					<p class="nòta">{r.tèxte}</p>
					{#if obèrt?.r.id === r.id}
						{@render escritura()}
					{:else}
						<div class="accions"><button type="button" class="agir" onclick={() => obrir(r, 'responsa')}>Respondre</button></div>
					{/if}
				</li>
			{/each}

			{#each tasNòtas as r (r.id)}
				<li>
					<p class="sòrta">Nòta <span class="quand">{quand(r.created_at)}</span></p>
					{@render endreit(r)}
					<p class="nòta">{r.tèxte}</p>
					<div class="accions">
						<button type="button" class="agir" onclick={() => bon(r)}>Fach</button>
						{#if segur === r.id}
							<span class="segur">Suprimir ? <button type="button" class="segond" onclick={() => escafar(r)}>Òc</button> <button type="button" class="segond" onclick={() => (segur = null)}>Non</button></span>
						{:else}
							<button type="button" class="segond" onclick={() => (segur = r.id)}>Suprimir</button>
						{/if}
					</div>
				</li>
			{/each}

			{#if perfils}
				<li class="resumit">
					<p class="sòrta acte">Perfils</p>
					<p class="nòta">{perfils === 1 ? 'Un nouveau profil attend' : `${perfils} nouveaux profils attendent`} ta décision. <a href="/admin/perfils">Les voir</a></p>
				</li>
			{/if}
			{#if ideas}
				<li class="resumit">
					<p class="sòrta acte">Idèas</p>
					<p class="nòta">{ideas === 1 ? 'Une idée nouvelle' : `${ideas} idées nouvelles`} dans la boîte. <a href="/admin/ideas">Les lire</a></p>
				</li>
			{/if}
		</ul>
	{/if}

	{#if espèra.length}
		<h2>En attente de l’IA · {espèra.length}</h2>
		<p class="ajuda">Relevées au début de la prochaine séance. Pour une demande tout de suite, « Copiar » met la note toute prête à coller dans la conversation.</p>
		<ul class="lista calma">
			{#each espèra as r (r.id)}
				<li>
					<p class="sòrta">
						{sòrta(r) === 'respost' ? 'Respondut, l’IA va lire' : r.de_romain ? 'Ta demande' : `Remarque de ${r.autor ?? 'quelqu’un'} (relecture)`}
						<span class="quand">{quand(r.created_at)}</span>
					</p>
					{@render endreit(r)}
					<p class="nòta">{r.tèxte}</p>
					{#if r.responsa && sòrta(r) === 'respost'}<p class="responsa">{r.responsa}</p>{/if}
					<div class="accions">
						{#if sòrta(r) === 'espèra'}
							<button type="button" class="segond" onclick={() => copiar(r)}>{copiat === r.id ? 'Copiée' : 'Copiar'}</button>
						{/if}
						{#if segur === r.id}
							<span class="segur">Suprimir ? <button type="button" class="segond" onclick={() => escafar(r)}>Òc</button> <button type="button" class="segond" onclick={() => (segur = null)}>Non</button></span>
						{:else}
							<button type="button" class="segond" onclick={() => (segur = r.id)}>Suprimir</button>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	<h2>En fond</h2>
	<ul class="fons">
		{#if fichas}<li><a href="/apren/gramatica">{fichas} fiches de grammaire</a> à relire</li>{/if}
		<li><a href="/admin/triar">Triar</a> : les dessins à garder ou à refaire</li>
		<li><a href="/admin/musica">Musica</a> : les artistes à trier</li>
	</ul>

	<h2>Les ateliers</h2>
	<div class="talhiers">
		{#each TALHIÈRS as g (g.grop)}
			<div class="grop">
				<h3>{g.grop}</h3>
				<ul>
					{#each g.ateliers as a (a.href)}
						<li><a href={a.href}>{a.oc}</a> <span>{a.fr}</span></li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	<p class="verrolhs"><a href={VERROLHS.href}>{VERROLHS.oc}</a> : {VERROLHS.fr}</p>
</section>

<style>
	.pertu {
		max-width: 52rem;
		gap: 0.6rem;
	}
	header {
		display: grid;
		gap: 0.4rem;
	}
	.pertu h1 {
		font-size: 2rem;
	}
	.intro {
		margin: 0;
		color: var(--t-tinta-2);
		line-height: 1.5;
	}
	/* Limelight pour le seul grand titre ; le reste en Luciole (02-11).
	   (section : pour passer devant la règle commune de l'administration) */
	section.pertu h2 {
		margin-top: 1.1rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--t-linha);
		font-family: var(--font-body);
		font-weight: 700;
	}
	/* règle B : le rouge du logo en aplat = l'action ; le reste en filet fin */
	.agir,
	.segond {
		padding: 0.42rem 1rem;
		border-radius: 999px;
		font: 700 0.9rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.agir {
		border: 0;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
	}
	.agir:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.agir:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.segond {
		border: 1px solid var(--t-linha);
		background: transparent;
		color: var(--t-tinta);
	}
	.segond:hover {
		border-color: var(--t-tinta-2);
	}
	.agir:focus-visible,
	.segond:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.calme,
	.ajuda {
		margin: 0;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.lista > li {
		display: grid;
		gap: 0.3rem;
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.lista > li:last-child {
		border-bottom: 0;
	}
	.lista p {
		margin: 0;
	}
	.sòrta {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--t-tinta-2);
	}
	.sòrta.acte {
		color: var(--t-aur);
	}
	.quand {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.ont {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
		overflow-wrap: anywhere;
	}
	.ont a,
	.fons a,
	.talhiers a,
	.verrolhs a,
	.resumit a {
		color: var(--t-accion);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.nòta {
		white-space: pre-line;
		overflow-wrap: anywhere;
		line-height: 1.5;
	}
	/* la note de Romain en retrait de ton, la réponse en clair, en retrait,
	   sans filet coloré à gauche (cliché écarté, Joan 06-11) */
	.qui,
	.nòta:has(.qui) {
		color: var(--t-tinta-2);
	}
	.responsa {
		padding-left: 0.9rem;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.calma .nòta {
		color: var(--t-tinta-2);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		margin-top: 0.25rem;
	}
	.espaci {
		flex: 1;
	}
	.segur {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 700;
	}
	.escota {
		border-color: var(--t-aur) !important;
		color: var(--t-aur) !important;
	}
	.escriure {
		display: grid;
		gap: 0.2rem;
	}
	textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.7rem;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: inherit;
		font-size: 1rem;
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.fons {
		margin: 0;
		padding-left: 1.1rem;
		display: grid;
		gap: 0.3rem;
	}
	.talhiers {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0.4rem 1.6rem;
	}
	.grop h3 {
		margin: 0.3rem 0 0.35rem;
		font-family: var(--font-body);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	.grop ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	.grop li span {
		display: block;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.verrolhs {
		margin: 0.8rem 0 0;
		padding-top: 0.8rem;
		border-top: 1px solid var(--t-linha);
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	@media (max-width: 600px) {
		.pertu h1 {
			font-size: 1.6rem;
		}
	}
</style>
