<script>
	// Triar (Romain, 2026-11-06) : un élément à la fois, comme des cartes. Le
	// cœur garde tel quel, la croix renvoie à refaire avec un commentaire
	// (dicté ou écrit). On glisse la carte (doigt, souris) ou on touche les
	// boutons ; au clavier : flèche gauche = croix, flèche droite = cœur.
	// Logique et format d'enregistrement : $lib/triar/triar.js ; lots :
	// $lib/triar/lots.js ; lecture côté Claude : scripts/triar.mjs.
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { supabase } from '$lib/supabaseClient';
	import { LOTS } from '$lib/triar/lots.js';
	import CartaReleu from '$lib/paisatges/CartaReleu.svelte';
	import CartaPausar from '$lib/paisatges/CartaPausar.svelte';
	import { PAGINA, estatDe, aTriar, comptes, paquetsGardats, tèxteGardats, tèxteRefar, tèxtePausats } from '$lib/triar/triar.js';

	const lot = LOTS.find((l) => l.id === page.url.searchParams.get('lot')) ?? LOTS[0];
	const elements = lot.elements();
	// les mots des boutons : un lot peut les changer (les décisions : « D’acòrdi » / « Non », 06-11)
	const MOTS = {
		gardar: { oc: 'Gardar', fr: 'garder', compte: 'gardés', titol: 'Garder tel quel' },
		refar: { oc: 'Refar', fr: 'refaire', compte: 'à refaire', titol: 'Refuser' },
		comentari: 'Que faut-il changer ? Dicte ou écris ; tu peux laisser vide.',
		...lot.mots
	};
	const CLAU_LOCALA = `lo-ligam-triar-${lot.id}`; // les cœurs pas encore envoyés
	const LLINDAR = 110; // px à glisser pour décider

	let estat = $state({});
	let cua = $state([]); // ce qui reste à trier, dans l'ordre
	let pos = $state(0);
	let cargat = $state(false);
	let pendents = $state([]); // clés des cœurs pas encore envoyés
	let istòria = $state([]); // les choix de cette visite, pour « Tornar »
	let fasa = $state('triar'); // triar | comentari
	let comentari = $state('');
	let mandant = $state(false);
	let error = $state('');
	let calme = $state(false);
	let anonci = $state(''); // annoncé aux lecteurs d'écran à chaque choix
	let botoRefar = $state(null);
	let pausats = $state({}); // lot « pausar » : les mots posés sur chaque photo, tels que Romain les laisse

	// le geste
	let dx = $state(0);
	let tira = $state(false);
	let volant = $state(false); // la carte part
	let x0 = 0;
	let carta = $state(null);
	let camp = $state(null);

	let actual = $derived(cua[pos] ?? null);
	let seguent = $derived(cua[pos + 1] ?? null);
	let n = $derived(comptes(elements, estat));
	let fach = $derived(elements.length - n.rèsta - n.refach);

	const legir = () => {
		try {
			return JSON.parse(localStorage.getItem(CLAU_LOCALA) || '[]');
		} catch {
			return [];
		}
	};
	const salvar = () => {
		try {
			localStorage.setItem(CLAU_LOCALA, JSON.stringify(pendents));
		} catch {
			/* sans stockage : les cœurs partent quand même, par paquets */
		}
	};

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		cargar();
		const amagada = () => document.visibilityState === 'hidden' && mandarGardats();
		addEventListener('visibilitychange', amagada);
		return () => removeEventListener('visibilitychange', amagada);
	});

	async function cargar() {
		pendents = legir();
		const { data, error: e } = await supabase
			.from('remarcas')
			.select('id, cibla, extrait, tèxte, estat, responsa')
			.eq('pagina', PAGINA)
			.eq('modul', lot.id)
			.order('id');
		if (e) error = 'Les choix déjà faits n’ont pas pu être lus. Recharge la page dans un instant.';
		const e0 = estatDe(data ?? []);
		for (const c of pendents) e0[c] = { v: 'gardar' };
		estat = e0;
		cua = aTriar(elements, e0);
		cargat = true;
		mandarGardats();
	}

	/** Envoie les cœurs en attente, par paquets ; un seul envoi à la fois. */
	let envoiEnCors = null;
	function mandarGardats() {
		envoiEnCors ??= mandarGardatsAra().finally(() => (envoiEnCors = null));
		return envoiEnCors;
	}
	async function mandarGardatsAra() {
		if (!pendents.length) return true;
		for (const paquet of paquetsGardats([...pendents])) {
			const { error: e } = await supabase.from('remarcas').insert({
				pagina: PAGINA,
				modul: lot.id,
				cibla: 'gardats',
				extrait: 'gardar',
				tèxte: tèxteGardats(paquet)
			});
			if (e) {
				error = 'Les derniers cœurs ne sont pas encore partis ; ils restent gardés ici et repartiront.';
				return false;
			}
			pendents = pendents.filter((c) => !paquet.includes(c));
			salvar();
		}
		error = '';
		return true;
	}

	function seguir() {
		pos++;
		dx = 0;
		volant = false;
		if (pos >= cua.length) mandarGardats();
	}

	/** La carte part d'un côté, puis la suivante arrive. */
	async function far_partir(sens) {
		if (calme) return;
		volant = true;
		dx = sens * (innerWidth * 0.9 + 200);
		await new Promise((r) => setTimeout(r, 260));
	}

	async function gardar() {
		if (!actual || fasa !== 'triar' || volant || mandant) return;
		const el = actual;
		const nous = pausats[el.clau];
		if (nous && JSON.stringify(nous) !== JSON.stringify(el.mots)) return mandarPausats(el, nous);
		await far_partir(1);
		estat = { ...estat, [el.clau]: { v: 'gardar' } };
		pendents = [...pendents, el.clau];
		salvar();
		istòria.push({ clau: el.clau, v: 'gardar' });
		anonci = `${MOTS.gardar.anonci ?? 'Gardé'} : ${el.titol}`;
		seguir();
		if (pendents.length >= 20) mandarGardats();
	}

	// lot « pausar » : une photo aux mots changés part tout de suite, seule
	async function mandarPausats(el, mots) {
		mandant = true;
		error = '';
		await mandarGardats();
		const { data, error: e } = await supabase
			.from('remarcas')
			.insert({ pagina: PAGINA, modul: lot.id, cibla: el.clau.slice(0, 300), extrait: 'pausar', tèxte: tèxtePausats(mots) })
			.select('id')
			.single();
		mandant = false;
		if (e) {
			error = 'Cette photo n’est pas partie. Réessaie dans un instant ; tes mots sont toujours là.';
			return;
		}
		await far_partir(1);
		estat = { ...estat, [el.clau]: { v: 'gardar', id: data.id, pausats: mots } };
		istòria.push({ clau: el.clau, v: 'pausar', id: data.id });
		anonci = `${MOTS.gardar.anonci ?? 'Gardé'} : ${el.titol}`;
		seguir();
	}

	// la carte reste sous les yeux pendant qu'on dit ce qu'il faut changer ;
	// elle part à gauche une fois la croix envoyée
	async function refusar() {
		if (!actual || fasa !== 'triar' || volant) return;
		dx = 0;
		fasa = 'comentari';
		comentari = '';
		await tick();
		camp?.focus();
	}

	async function anullar() {
		fasa = 'triar';
		dx = 0;
		volant = false;
		await tick();
		botoRefar?.focus();
	}
	// dans le commentaire : Échap annule, Ctrl+Entrée envoie
	function teclaComentari(e) {
		if (e.key === 'Escape') {
			e.preventDefault();
			anullar();
		} else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			mandarRefus();
		}
	}

	async function mandarRefus() {
		if (!actual || mandant) return;
		mandant = true;
		error = '';
		const el = actual;
		// les cœurs d'abord, pour que l'ordre des choix reste juste
		await mandarGardats();
		const { data, error: e } = await supabase
			.from('remarcas')
			.insert({ pagina: PAGINA, modul: lot.id, cibla: el.clau.slice(0, 300), extrait: 'refar', tèxte: tèxteRefar(comentari) })
			.select('id')
			.single();
		mandant = false;
		if (e) {
			error = 'La croix n’est pas partie. Réessaie dans un instant ; ton commentaire est toujours là.';
			return;
		}
		estat = { ...estat, [el.clau]: { v: 'refar', id: data.id, comentari: comentari.trim() } };
		istòria.push({ clau: el.clau, v: 'refar', id: data.id });
		anonci = `${MOTS.refar.anonci ?? 'À refaire'} : ${el.titol}`;
		await far_partir(-1);
		fasa = 'triar';
		seguir();
		await tick();
		botoRefar?.focus();
	}

	/** Revenir à la carte d'avant (et défaire son choix). */
	async function tornar() {
		if (fasa !== 'triar' || !istòria.length || mandant) return;
		const d = istòria.pop();
		if (d.v === 'gardar' && pendents.includes(d.clau)) {
			pendents = pendents.filter((c) => c !== d.clau);
			salvar();
		} else if ((d.v === 'refar' || d.v === 'pausar') && d.id) {
			await supabase.from('remarcas').delete().eq('id', d.id);
		}
		// un cœur déjà parti reste en base : le prochain choix sur cette carte l'emportera
		const { [d.clau]: _, ...rèsta } = estat;
		estat = rèsta;
		pos = Math.max(0, pos - 1);
		anonci = `Retour à : ${d.clau}`;
		if (cua[pos]?.clau !== d.clau) {
			cua = [...cua.slice(0, pos), elements.find((el) => el.clau === d.clau), ...cua.slice(pos)];
		}
		dx = 0;
	}

	// glisser la carte
	function abaissar(e) {
		if (fasa !== 'triar' || volant) return;
		tira = true;
		x0 = e.clientX;
		carta?.setPointerCapture(e.pointerId);
	}
	function bolegar(e) {
		if (tira) dx = e.clientX - x0;
	}
	function levar() {
		if (!tira) return;
		tira = false;
		if (dx > LLINDAR) gardar();
		else if (dx < -LLINDAR) refusar();
		else dx = 0;
	}

	function tecla(e) {
		if (fasa !== 'triar' || e.target?.closest?.('input, textarea, .pausar')) return;
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			gardar();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			refusar();
		} else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
			e.preventDefault();
			tornar();
		}
	}

	let senhal = $derived(Math.max(-1, Math.min(1, dx / LLINDAR)));
</script>

<svelte:window onkeydown={tecla} />

<svelte:head>
	<title>Triar · Lo Ligam</title>
</svelte:head>

<section class="triar" aria-labelledby="triar-titol">
	<header>
		<h1 id="triar-titol"><span lang="oc">Triar</span> <em>(Trier)</em></h1>
		<p class="vers-seguit"><a href="/admin/seguit">Où on en est, chantier par chantier <span aria-hidden="true">→</span></a></p>
		{#if LOTS.length > 1}
			<!-- le choix du lot (Romain, 06-11 : « il y a écrit tout a été trié » : il voyait le premier lot, déjà fini) ;
			     la page se recharge, chaque lot a ses propres cœurs en attente -->
			<nav class="lots" aria-label="Lots à trier">
				{#each LOTS as l (l.id)}
					<a href="?lot={l.id}" data-sveltekit-reload aria-current={l.id === lot.id ? 'page' : undefined}
						><span lang="oc">{l.nom.oc}</span> <em>({l.nom.fr})</em></a
					>
				{/each}
			</nav>
		{:else}
			<p class="lot"><span lang="oc">{lot.nom.oc}</span> <em>({lot.nom.fr})</em></p>
		{/if}
		{#if cargat}
			<div class="avanc" role="progressbar" aria-valuemin="0" aria-valuemax={elements.length} aria-valuenow={fach} aria-label="Avancement">
				<span style:width="{(100 * fach) / elements.length}%"></span>
			</div>
			<p class="comptes">
				{fach} / {elements.length}
				<span class="sep">·</span>
				<span aria-hidden="true">♥ {n.gardar}</span><span class="masc">{n.gardar} {MOTS.gardar.compte}</span>
				<span class="sep">·</span>
				<span aria-hidden="true">✕ {n.refar}</span><span class="masc">{n.refar} {MOTS.refar.compte}</span>
				{#if n.refach}<span class="sep">·</span> <span>{n.refach} refaits à revoir</span>{/if}
			</p>
		{/if}
	</header>

	{#if !cargat}
		<p class="info">Un momenton…</p>
	{:else if !actual}
		<div class="fin">
			<p class="fin-titol" lang="oc">Tot es triat.</p>
			<p><em>(Tout est trié.)</em> {n.gardar} {MOTS.gardar.compte}, {n.refar} {MOTS.refar.compte}. Claude lit tes croix et tes commentaires ; {lot.fin ?? 'les éléments refaits reviendront ici.'}</p>
			{#each LOTS.filter((l) => l.id !== lot.id) as l (l.id)}
				<p><a href="?lot={l.id}" data-sveltekit-reload>Trier « <span lang="oc">{l.nom.oc}</span> »</a> <em>({l.nom.fr})</em></p>
			{/each}
		</div>
	{:else}
		<p class="consigna">{lot.consigna}</p>

		<!-- pendant le commentaire, le dessin rapetisse pour rester visible au-dessus du clavier -->
		<div class="pila" class:reduch={fasa === 'comentari'}>
			{#if seguent}
				<div class="carta darrier" aria-hidden="true">
					{@render contengut(seguent, false)}
				</div>
			{/if}
			{#key actual.clau}
				<div
					class="carta"
					class:tira
					class:volant
					class:calme
					bind:this={carta}
					style:translate="{dx}px 0"
					style:rotate="{dx / 22}deg"
					onpointerdown={abaissar}
					onpointermove={bolegar}
					onpointerup={levar}
					onpointercancel={levar}
					role="group"
					aria-roledescription="carte"
					aria-label="{actual.titol}, {pos + 1} sur {cua.length}"
				>
					<span class="tampon tampon-gardar" style:opacity={Math.max(0, senhal)} aria-hidden="true">♥ <span lang="oc">{MOTS.gardar.oc}</span></span>
					<span class="tampon tampon-refar" style:opacity={fasa === 'comentari' ? 1 : Math.max(0, -senhal)} aria-hidden="true">✕ <span lang="oc">{MOTS.refar.oc}</span></span>
					{@render contengut(actual)}
				</div>
			{/key}
		</div>

		{#if fasa === 'triar'}
			<div class="botons">
				<button type="button" class="b-tornar" onclick={tornar} disabled={!istòria.length} title="Revenir à la carte d’avant (Ctrl+Z)">
					<span aria-hidden="true">↶</span> <span lang="oc">Tornar</span>
				</button>
				<button type="button" class="b-refar" bind:this={botoRefar} onclick={refusar} title="{MOTS.refar.titol} (flèche gauche)">
					<span class="icona" aria-hidden="true">✕</span>
					<span class="etiqueta"><span lang="oc">{MOTS.refar.oc}</span> <em>({MOTS.refar.fr})</em></span>
				</button>
				<button type="button" class="b-gardar" onclick={gardar} title="{MOTS.gardar.titol} (flèche droite)">
					<span class="icona" aria-hidden="true">♥</span>
					<span class="etiqueta"><span lang="oc">{MOTS.gardar.oc}</span> <em>({MOTS.gardar.fr})</em></span>
				</button>
			</div>
		{:else}
			<form
				class="comentari"
				onsubmit={(e) => {
					e.preventDefault();
					mandarRefus();
				}}
			>
				<label for="triar-comentari"><span lang="oc">Qué cal cambiar ?</span> <em>({MOTS.comentari})</em></label>
				<textarea id="triar-comentari" bind:this={camp} bind:value={comentari} onkeydown={teclaComentari} rows="3" maxlength="2000"></textarea>
				<div class="botons-com">
					<button type="button" class="b-secondari" onclick={anullar} disabled={mandant}><span lang="oc">Anullar</span></button>
					<button type="submit" class="b-mandar" disabled={mandant}><span lang="oc">Mandar</span> <em>(envoyer)</em></button>
				</div>
			</form>
		{/if}
	{/if}

	{#if error}<p class="msg" role="alert">{error}</p>{/if}
	<p class="masc" aria-live="polite">{anonci}</p>
</section>

{#snippet contengut(el, viu = true)}
	{#if estat[el.clau]?.v === 'refach'}
		<p class="refach">
			Refait{#if estat[el.clau].responsa} : {estat[el.clau].responsa}{/if}
			{#if estat[el.clau].comentari}<br /><span class="avant">Ta remarque : {estat[el.clau].comentari}</span>{/if}
		</p>
	{/if}
	{#if el.dessenh}
		<svg class="dessenh" viewBox="0 0 100 100" aria-hidden="true">
			{#each el.tintas ?? [] as z, k (k)}<path d={z.d} style={z.s ? `stroke: ${z.c}` : `fill: ${z.c}; stroke: none`} />{/each}
			{#each el.dessenh as d, k (k)}<path {d} />{/each}
		</svg>
	{:else if el.relèu}
		<CartaReleu foto={el.relèu} {viu} />
	{:else if el.pausar}
		<CartaPausar foto={el.pausar} mots={pausats[el.clau] ?? el.mots} {viu} onmots={(m) => (pausats[el.clau] = m)} />
	{:else if el.imatge}
		<img class="imatge" src={el.imatge} alt="" draggable="false" />
	{:else if el.decision}
		<!-- une décision à trancher (lot « decisions », 06-11) : en français, en Luciole, l'avis de Claude à part -->
		<div class="decision" lang="fr">
			{#if el.context?.length}<p class="d-context">{el.context.join(' · ')}</p>{/if}
			<p class="d-titol">{el.titol}</p>
			<p class="d-tèxte">{el.decision.tèxte}</p>
			{#if el.decision.avís}<p class="d-avís"><span>Mon avis</span> {el.decision.avís}</p>{/if}
		</div>
	{:else if el.tèxte}
		<p class="tèxte" lang="oc">{el.tèxte}</p>
	{/if}
	{#if el.pausar}
		<!-- les mots sont sur la photo : seul le thème, en petit -->
		{#if el.sotstitol}<p class="sotstitol">{el.sotstitol}</p>{/if}
	{:else if !el.decision}
		<p class="titol" lang="oc">{el.titol}</p>
		{#if el.sotstitol}<p class="sotstitol">{el.sotstitol}</p>{/if}
		{#if el.context?.length}<p class="context">Ambiance : <span lang="oc">{el.context.join(' · ')}</span></p>{/if}
	{/if}
{/snippet}

<style>
	.triar {
		width: min(100%, 30rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
		font-family: var(--font-body);
		color: var(--t-tinta, #2a1a10);
	}
	header {
		width: 100%;
		text-align: center;
	}
	h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 400;
		margin: 0;
	}
	h1 em,
	em {
		font-family: var(--font-body);
		font-size: 0.85em;
		font-weight: 400;
		opacity: 0.75;
	}
	.lot {
		margin: 0.2rem 0 0.6rem;
	}
	.vers-seguit {
		margin: 0.2rem 0 0.4rem;
		font-size: 0.9rem;
	}
	.vers-seguit a {
		color: inherit;
		text-underline-offset: 0.2em;
	}
	.lots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.1rem;
		margin: 0.2rem 0 0.6rem;
	}
	.lots a {
		color: inherit;
		text-underline-offset: 0.2em;
	}
	.lots a[aria-current='page'] {
		font-weight: 700;
		text-decoration: none;
	}
	.avanc {
		height: 4px;
		border-radius: 2px;
		background: var(--t-linha, rgba(42, 26, 16, 0.14));
		overflow: hidden;
	}
	.avanc span {
		display: block;
		height: 100%;
		background: var(--t-aur, #9c5611);
		transition: width 0.3s ease;
	}
	.comptes {
		margin: 0.45rem 0 0;
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
	}
	.sep {
		opacity: 0.4;
		margin: 0 0.25rem;
	}
	.consigna,
	.info {
		margin: 0;
		font-size: 0.9rem;
		text-align: center;
		opacity: 0.8;
	}

	/* La pile : la carte du dessus, et la suivante qui attend derrière */
	.pila {
		position: relative;
		width: 100%;
		display: grid;
	}
	.carta {
		grid-area: 1 / 1;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 1rem 1rem 1.2rem;
		border-radius: 1.25rem;
		background: #0e1a2b;
		color: #f3ead6;
		box-shadow: 0 10px 30px rgba(14, 26, 43, 0.25);
		touch-action: pan-y;
		user-select: none;
		cursor: grab;
		transition:
			translate 0.26s ease-in,
			rotate 0.26s ease-in;
		animation: arribar 0.22s ease-out;
	}
	.carta.tira {
		transition: none;
		cursor: grabbing;
	}
	.carta.darrier {
		scale: 0.95;
		translate: 0 0.6rem;
		opacity: 0.55;
		animation: none;
		pointer-events: none;
	}
	.carta.calme {
		transition: none;
		animation: none;
	}
	@keyframes arribar {
		from {
			scale: 0.95;
			opacity: 0.6;
		}
	}
	.dessenh {
		width: min(72vw, 15rem);
		aspect-ratio: 1;
		fill: none;
		stroke: #ffd47f;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: width 0.2s ease;
	}
	.reduch .dessenh {
		width: min(40vw, 9rem);
	}
	.imatge {
		width: 100%;
		max-height: 50vh;
		object-fit: contain;
		border-radius: 0.75rem;
	}
	.decision {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 0.4rem 0.3rem 0;
		text-align: left;
	}
	.d-context {
		margin: 0;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #e0b45a;
	}
	.d-titol {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 1.3;
	}
	.d-tèxte {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
		opacity: 0.9;
	}
	.d-avís {
		margin: 0.2rem 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid rgba(243, 234, 214, 0.25);
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.d-avís span {
		display: block;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #e0b45a;
	}
	/* la carte de dessous : sa forme seule, sans son texte qui se lirait à travers */
	.darrier .decision {
		visibility: hidden;
	}
	.reduch .d-tèxte,
	.reduch .d-avís {
		display: none;
	}
	.tèxte {
		font-size: 1.2rem;
		text-align: center;
		margin: 1rem 0;
	}
	.titol {
		margin: 0.2rem 0 0;
		font-family: var(--font-heading);
		font-size: 1.7rem;
		text-align: center;
	}
	.sotstitol {
		margin: 0;
		font-style: italic;
		text-align: center;
		opacity: 0.85;
	}
	.context {
		margin: 0.35rem 0 0;
		font-size: 0.8rem;
		opacity: 0.78;
		text-align: center;
	}
	.refach {
		margin: 0 0 0.3rem;
		padding: 0.4rem 0.7rem;
		border-radius: 0.6rem;
		background: rgba(255, 212, 127, 0.14);
		color: #ffd47f;
		font-size: 0.85rem;
		text-align: center;
	}
	.refach .avant {
		color: #f3ead6;
		opacity: 0.8;
	}

	/* Les tampons qui apparaissent quand on glisse */
	.tampon {
		position: absolute;
		top: 1rem;
		padding: 0.2rem 0.6rem;
		border: 2px solid currentColor;
		border-radius: 0.5rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		pointer-events: none;
	}
	.tampon-gardar {
		left: 1rem;
		color: #ffd47f;
		rotate: -10deg;
	}
	.tampon-refar {
		right: 1rem;
		color: #f3ead6;
		rotate: 10deg;
	}

	/* Les boutons : la croix et le cœur, en grand, sous la carte */
	.botons {
		display: grid;
		grid-template-columns: auto 1fr 1fr;
		gap: 0.6rem;
		width: 100%;
		align-items: stretch;
	}
	.botons button,
	.botons-com button {
		font: inherit;
		border-radius: 999px;
		cursor: pointer;
	}
	.b-refar,
	.b-gardar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 3.6rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}
	.icona {
		font-size: 1.6rem;
		line-height: 1;
	}
	.b-refar {
		background: transparent;
		color: var(--t-tinta, #2a1a10);
		border: 2px solid var(--t-tinta, #2a1a10);
	}
	.b-gardar {
		background: var(--t-accion, #b53d17);
		color: var(--t-accion-tinta, #fbf1e1);
		border: 2px solid var(--t-accion, #b53d17);
	}
	.b-gardar:hover {
		background: var(--t-accion-viu, #94320f);
	}
	.b-tornar {
		background: transparent;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.14));
		color: var(--t-tinta, #2a1a10);
		padding: 0 0.9rem;
		font-size: 0.85rem;
	}
	.b-tornar:disabled {
		opacity: 0.35;
		cursor: default;
	}
	.etiqueta em {
		font-size: 0.8em;
	}
	.botons button:focus-visible,
	.botons-com button:focus-visible,
	textarea:focus-visible {
		outline: 3px solid var(--t-aur, #9c5611);
		outline-offset: 2px;
	}

	.comentari {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.comentari label {
		font-size: 0.95rem;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.7rem 0.8rem;
		border-radius: 0.8rem;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.14));
		background: var(--t-fons, #f7f3ee);
		color: inherit;
		font: inherit;
		resize: vertical;
	}
	.botons-com {
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
	}
	.b-secondari {
		background: transparent;
		border: 1px solid var(--t-linha, rgba(42, 26, 16, 0.14));
		color: inherit;
		padding: 0.6rem 1.1rem;
	}
	.b-mandar {
		background: var(--t-accion, #b53d17);
		color: var(--t-accion-tinta, #fbf1e1);
		border: none;
		padding: 0.6rem 1.3rem;
	}
	.fin {
		text-align: center;
	}
	.masc {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.fin-titol {
		font-family: var(--font-heading);
		font-size: 1.8rem;
		margin: 1rem 0 0.3rem;
	}
	.msg {
		margin: 0;
		font-size: 0.9rem;
		text-align: center;
		color: var(--t-terra, #b53d17);
	}
	@media (prefers-reduced-motion: reduce) {
		.carta,
		.avanc span {
			transition: none;
			animation: none;
		}
	}
</style>
