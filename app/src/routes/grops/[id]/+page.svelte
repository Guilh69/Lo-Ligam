<script>
	// La discussion d'un groupe (le strict minimum décidé par Romain le
	// 2026-10-25) : écrire, supprimer son message, signaler avec un motif ;
	// pseudo et heure. Pas de réponses ni de réactions, pas d'images, pas de
	// modification après envoi. Les messages arrivent par le direct
	// (grops.svelte.js) ; les règles de la base décident de tout le reste.
	import Icona from '$lib/components/Icona.svelte';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, escotar, rejonher, quitar, marcarLegit, clauError, ora } from '$lib/grops/grops.svelte.js';
	import { X_ERRORS } from '$lib/grops/textes.js';
	import Tèxte from '$lib/grops/Tèxte.svelte';

	let { data } = $props();
	let grop = $derived(data.grop);
	let id = $derived(data.grop.id);

	let fr = $derived(langStore.current === 'fr');
	const X = {
		oc: {
			grop: 'Un grop per parlar occitan amassa, sus Lo Ligam.',
			tornar: 'Tornar a la lista',
			membres: (n) => (n ? `${n} membre${n > 1 ? 's' : ''}` : 'Cap de membre encara'),
			convidar: 'Convidar',
			copiat: 'Ligam copiat',
			quitar: 'Quitar',
			quitar_conf: 'Quitar aqueste grop ?',
			ancians: 'Messatges mai ancians',
			vuèg: 'Cap de messatge encara : escriu lo primièr !',
			camp: 'Ton messatge',
			mandar: 'Mandar',
			suprimir: 'Suprimir',
			suprimir_conf: 'Suprimir aqueste messatge ?',
			senhalar: 'Senhalar',
			senhal_titol: 'Senhalar aqueste messatge',
			motiu: 'Lo motiu',
			motius: { insulta: 'Insulte', assetjament: 'Assetjament', odi: 'Òdi', spam: 'Publicitat', autre: 'Autre' },
			precisions: 'Precisions (se vòls)',
			anullar: 'Anullar',
			tampar: 'Tampar',
			mercé: 'Mercés : la moderacion o va veire.',
			ja: 'Ja l’as senhalat.',
			amagat: 'Amagat.',
			moderacion: 'moderacion',
			tampat: 'Aqueste grop es tampat : se pòt legir, pas mai escriure.',
			rejonher: 'Rejónher lo grop',
			dobrir: 'Dobrir aqueste grop',
			prepausat: 'Aqueste grop es prepausat : dobrirà amb sa primièra persona.',
			connectar: 'Se connectar',
			...X_ERRORS.oc
		},
		fr: {
			grop: 'Un groupe pour parler occitan ensemble, sur Lo Ligam.',
			tornar: 'Retour à la liste',
			membres: (n) => (n ? `${n} membre${n > 1 ? 's' : ''}` : 'Aucun membre encore'),
			convidar: 'Inviter',
			copiat: 'Lien copié',
			quitar: 'Quitter',
			quitar_conf: 'Quitter ce groupe ?',
			ancians: 'Messages plus anciens',
			vuèg: 'Aucun message encore : écris le premier !',
			camp: 'Ton message',
			mandar: 'Envoyer',
			suprimir: 'Supprimer',
			suprimir_conf: 'Supprimer ce message ?',
			senhalar: 'Signaler',
			senhal_titol: 'Signaler ce message',
			motiu: 'Le motif',
			motius: { insulta: 'Insulte', assetjament: 'Harcèlement', odi: 'Haine', spam: 'Publicité', autre: 'Autre' },
			precisions: 'Précisions (si tu veux)',
			anullar: 'Annuler',
			tampar: 'Fermer',
			mercé: 'Merci : la modération va le voir.',
			ja: 'Tu l’as déjà signalé.',
			amagat: 'Masqué.',
			moderacion: 'modération',
			tampat: 'Ce groupe est fermé : on peut le lire, plus y écrire.',
			rejonher: 'Rejoindre le groupe',
			dobrir: 'Ouvrir ce groupe',
			prepausat: 'Ce groupe est proposé : il ouvrira avec sa première personne.',
			connectar: 'Se connecter',
			...X_ERRORS.fr
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let membre = $derived(grops.mevas.some((g) => g.grop_id === id));

	const PAGINA = 50;
	let messatges = $state([]);
	let cargat = $state(false);
	let totCargat = $state(true);
	let pseudos = $state({}); // user_id → { pseudo, es_admin }
	let comptats = $state(null);
	let nombre = $derived(comptats ?? data.membres);
	let benvenguda = $state(false);
	let error = $state(null);

	let log = $state();
	let camp = $state();
	let tèxte = $state('');
	let mandant = $state(false);
	let prèpBas = true;

	const CHAMPS = 'id, user_id, tèxte, amagat, motiu, created_at';

	// l'avis sur le pseudo, juste après avoir rejoint ; pas d'un groupe à l'autre
	$effect(() => {
		id;
		benvenguda = false;
	});

	$effect(() => {
		const g = id;
		messatges = [];
		cargat = false;
		comptats = null;
		error = null;
		if (!membre) return;
		grops.obert = g;
		cargar(g);
		marcarLegit(g);
		const lèva = escotar((gid, ev, p) => gid === g && avís(ev, p));
		return () => {
			lèva();
			if (grops.obert === g) grops.obert = null;
		};
	});

	async function cargarPseudos(g) {
		const { data: d } = await supabase.rpc('membres_grop', { g });
		if (g !== id || !d) return;
		pseudos = Object.fromEntries(d.map((r) => [r.user_id, r]));
		comptats = d.length;
	}

	async function cargar(g) {
		const [{ data: d }] = await Promise.all([
			supabase.from('messatges').select(CHAMPS).eq('grop_id', g).order('created_at', { ascending: false }).limit(PAGINA),
			cargarPseudos(g)
		]);
		if (g !== id) return;
		messatges = (d ?? []).reverse();
		totCargat = (d?.length ?? 0) < PAGINA;
		cargat = true;
		await tick();
		enBas(true);
	}

	async function ancians() {
		const primièr = messatges[0];
		if (!primièr) return;
		const h = log.scrollHeight;
		const { data: d } = await supabase
			.from('messatges')
			.select(CHAMPS)
			.eq('grop_id', id)
			.lt('created_at', primièr.created_at)
			.order('created_at', { ascending: false })
			.limit(PAGINA);
		messatges = [...(d ?? []).reverse(), ...messatges];
		totCargat = (d?.length ?? 0) < PAGINA;
		await tick();
		log.scrollTop += log.scrollHeight - h; // on reste sur le même message
	}

	// les avis du direct pour ce groupe
	let minutador;
	async function avís(ev, p) {
		const i = messatges.findIndex((m) => m.id === p.id);
		if (ev === 'nòu' && i < 0) {
			messatges.push({ ...p, amagat: false, motiu: null });
			if (!pseudos[p.user_id]) cargarPseudos(id);
			// lu, si la page est sous les yeux (une seule demande par rafale)
			clearTimeout(minutador);
			minutador = setTimeout(() => document.visibilityState === 'visible' && marcarLegit(id), 1500);
			await tick();
			enBas(p.user_id === grops.uid);
		} else if (ev === 'amagat' && i >= 0) {
			const m = messatges[i];
			if (m.user_id === grops.uid || grops.admin) Object.assign(m, { amagat: true, motiu: p.motiu });
			else messatges.splice(i, 1);
		} else if (ev === 'restablit') {
			if (i >= 0) Object.assign(messatges[i], { amagat: false, motiu: null });
			else {
				messatges.push({ ...p, amagat: false, motiu: null });
				messatges.sort((a, b) => a.created_at.localeCompare(b.created_at));
			}
		} else if (ev === 'suprimit' && i >= 0) messatges.splice(i, 1);
	}

	function enBas(forçar) {
		if (log && (forçar || prèpBas)) log.scrollTop = log.scrollHeight;
	}
	function defilat() {
		prèpBas = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
	}

	async function mandar(e) {
		e?.preventDefault();
		const t = tèxte.trim();
		if (!t || mandant) return;
		mandant = true;
		error = null;
		const { data: m, error: err } = await supabase.from('messatges').insert({ grop_id: id, tèxte: t }).select(CHAMPS).single();
		mandant = false;
		if (err) {
			error = clauError(err);
			return;
		}
		tèxte = '';
		if (!messatges.some((x) => x.id === m.id)) messatges.push(m);
		await tick();
		enBas(true);
		camp?.focus();
	}
	// Entrada envoie, Maj + Entrada va à la ligne
	function tecla(e) {
		if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) mandar(e);
	}

	async function suprimir(m) {
		if (!confirm(x.suprimir_conf)) return;
		const { error: err } = await supabase.from('messatges').delete().eq('id', m.id);
		if (err) error = 'error';
		else messatges = messatges.filter((y) => y.id !== m.id);
	}

	// signaler : une fenêtre, un motif, des précisions facultatives
	let dialòg = $state();
	let senhalat = $state(null);
	let motiu = $state(null);
	let precisions = $state('');
	let senhalError = $state(null);
	let mercé = $state(false);
	function dobrirSenhal(m) {
		senhalat = m;
		motiu = null;
		precisions = '';
		senhalError = null;
		mercé = false;
		dialòg.showModal();
	}
	async function mandarSenhal(e) {
		e.preventDefault();
		if (!motiu) return;
		const { error: err } = await supabase
			.from('senhalaments')
			.insert({ messatge_id: senhalat.id, motiu, precisions: precisions.trim() || null });
		if (err) senhalError = err.code === '23505' ? 'ja' : 'error';
		else mercé = true;
	}

	let copiat = $state(false);
	async function convidar() {
		const url = `${location.origin}/grops/${id}`;
		// sur téléphone, le menu de partage ; ailleurs, le lien copié
		if (navigator.share && matchMedia('(pointer: coarse)').matches) {
			try {
				await navigator.share({ title: `${grop.nom_oc} · Lo Ligam`, url });
			} catch {
				// partage annulé
			}
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			copiat = true;
			setTimeout(() => (copiat = false), 2500);
		} catch {
			prompt(x.convidar, url);
		}
	}

	async function quitarGrop() {
		if (!confirm(x.quitar_conf)) return;
		const e = await quitar(id);
		if (e) error = e;
		else goto('/grops');
	}

	let rejonhent = $state(false);
	async function rejónher() {
		rejonhent = true;
		error = null;
		const e = await rejonher(id);
		rejonhent = false;
		if (e) error = e;
		else benvenguda = true;
	}
</script>

<svelte:head>
	<title>{grop.nom_oc} · Lo Ligam</title>
	<meta name="description" content="{grop.nom_oc} : {X.oc.grop} {X.fr.grop}" />
	<meta property="og:title" content="{grop.nom_oc} · Lo Ligam" />
	<meta property="og:description" content="{X.oc.grop} {X.fr.grop} {data.membres ? X.oc.membres(data.membres) + '.' : ''}" />
</svelte:head>

<div class="discussion">
	<header class="cap">
		<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
		<div class="titol">
			<h2>{grop.nom_oc}</h2>
			<p>
				{#if fr && grop.nom_fr !== grop.nom_oc}<span lang="fr">{grop.nom_fr}</span> ·{/if}
				{x.membres(nombre)}
			</p>
		</div>
		{#if membre}
			<button type="button" class="accion" onclick={convidar}>
				<Icona nom={copiat ? 'valide' : 'partejar'} />
				<span>{copiat ? x.copiat : x.convidar}</span>
			</button>
			<span class="vist" role="status">{copiat ? x.copiat : ''}</span>
			<button type="button" class="accion" onclick={quitarGrop}><Icona nom="quitar" /><span>{x.quitar}</span></button>
		{/if}
	</header>

	{#if membre}
		<div class="log" role="log" bind:this={log} onscroll={defilat}>
			<Tèxte clau="grops.acuelh" class="nota" />
			{#if benvenguda}<Tèxte clau="grops.pseudo" class="nota" />{/if}
			{#if cargat && !totCargat}
				<button type="button" class="ancians" onclick={ancians}>{x.ancians}</button>
			{/if}
			{#if cargat && !messatges.length}<p class="vuèg">{x.vuèg}</p>{/if}
			<ol>
				{#each messatges as m (m.id)}
					{@const meu = m.user_id === grops.uid}
					{@const p = pseudos[m.user_id]}
					<li class:meu class:amagat={m.amagat}>
						<div class="bulla">
							<p class="qui">
								{#if !meu}<strong>{p?.pseudo ?? '…'}</strong>{/if}
								{#if p?.es_admin}<span class="moderacion">{x.moderacion}</span>{/if}
								<time datetime={m.created_at}>{ora(m.created_at)}</time>
							</p>
							<p class="tèxte">{m.tèxte}</p>
							{#if m.amagat}<p class="motiu"><strong>{x.amagat}</strong> {m.motiu}</p>{/if}
						</div>
						<div class="gèstes">
							{#if meu || grops.admin}
								<button type="button" onclick={() => suprimir(m)}><Icona nom="escafar" />{x.suprimir}</button>
							{/if}
							{#if !meu}
								<button type="button" onclick={() => dobrirSenhal(m)}><Icona nom="senhal" />{x.senhalar}</button>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		</div>

		{#if grop.estat === 'tampat'}
			<p class="pè-tampat">{x.tampat}</p>
		{:else}
			<form class="compositor" onsubmit={mandar}>
				{#if error}<p class="error" role="alert">{x[error] ?? x.error}</p>{/if}
				<label class="vist" for="grop-messatge">{x.camp}</label>
				<textarea
					id="grop-messatge"
					bind:this={camp}
					bind:value={tèxte}
					rows="1"
					maxlength="1000"
					placeholder={x.camp}
					onkeydown={tecla}
				></textarea>
				<button type="submit" class="mandar" disabled={mandant || !tèxte.trim()}>
					<Icona nom="mandar" size="1.3em" label={x.mandar} />
				</button>
			</form>
		{/if}
	{:else}
		<div class="dintrar">
			{#if fr ? grop.descripcion_fr : grop.descripcion_oc}
				<p class="descripcion">{fr ? grop.descripcion_fr : grop.descripcion_oc}</p>
			{/if}
			<Tèxte clau="grops.acuelh" class="frasa" />
			{#if grop.estat === 'prepausat'}<p class="nota">{x.prepausat}</p>{/if}
			{#if !grops.uid}
				<Tèxte clau="grops.compte" class="nota" />
				<a class="boton" href="/compte?tornar={encodeURIComponent(page.url.pathname)}">{x.connectar}</a>
			{:else if grop.estat !== 'tampat'}
				<Tèxte clau="grops.pseudo" class="nota" />
				<button type="button" class="boton" disabled={rejonhent} onclick={rejónher}>
					{rejonhent ? '…' : grop.estat === 'dobèrt' ? x.rejonher : x.dobrir}
				</button>
			{:else}
				<p class="nota">{x.grops_tampat}</p>
			{/if}
			{#if error}<p class="error" role="alert">{x[error] ?? x.error}</p>{/if}
		</div>
	{/if}
</div>

<dialog bind:this={dialòg} class="senhal" aria-labelledby="senhal-titol">
	<form onsubmit={mandarSenhal}>
		<h3 id="senhal-titol">{x.senhal_titol}</h3>
		{#if senhalat}<blockquote>{senhalat.tèxte}</blockquote>{/if}
		{#if mercé}
			<p class="mercé" role="status">{x.mercé}</p>
			<div class="botons"><button type="button" class="boton" onclick={() => dialòg.close()}>{x.tampar}</button></div>
		{:else}
			<fieldset>
				<legend>{x.motiu}</legend>
				{#each Object.entries(x.motius) as [v, nom] (v)}
					<label class="causida"><input type="radio" name="motiu" value={v} bind:group={motiu} required /> {nom}</label>
				{/each}
			</fieldset>
			<label class="precisions">
				<span>{x.precisions}</span>
				<textarea bind:value={precisions} rows="3" maxlength="500"></textarea>
			</label>
			{#if senhalError}<p class="error" role="alert">{x[senhalError]}</p>{/if}
			<div class="botons">
				<button type="button" class="secondari" onclick={() => dialòg.close()}>{x.anullar}</button>
				<button type="submit" class="boton" disabled={!motiu}>{x.senhalar}</button>
			</div>
		{/if}
	</form>
</dialog>

<style>
	.discussion {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.cap {
		display: flex;
		align-items: center;
		gap: var(--esp-12);
		padding: var(--esp-12) var(--esp-16);
		border-bottom: 1px solid var(--t-linha);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin-left: -0.5rem;
		border-radius: 50%;
		color: inherit;
	}
	.titol {
		flex: 1;
		min-width: 0;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
		line-height: 1.1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.titol p {
		margin: 2px 0 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	/* actions secondaires : un contour, l'icône et son nom écrit */
	.accion,
	.secondari {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 40px;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta);
		font: 400 0.9rem var(--font-body);
		cursor: pointer;
	}
	.accion:hover,
	.secondari:hover {
		border-color: var(--t-aur);
	}

	/* Le fil : défile seul, les nouveaux messages en bas */
	.log {
		flex: 1;
		min-height: 0;
		padding: var(--esp-16);
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.log :global(.nota) {
		max-width: 34rem;
		margin: 0 auto var(--esp-12);
		padding: var(--esp-8) var(--esp-12);
		border-left: 3px solid var(--t-aur);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.ancians {
		display: block;
		margin: var(--esp-8) auto var(--esp-16);
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: transparent;
		color: var(--t-tinta);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.vuèg {
		margin: var(--esp-32) 0;
		text-align: center;
		color: var(--t-tinta-2);
	}
	ol {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		justify-items: start;
		gap: 2px;
		max-width: min(36rem, 85%);
	}
	li.meu {
		justify-self: end;
		justify-items: end;
	}
	.bulla {
		padding: 0.55rem 0.85rem;
		border-radius: 4px 14px 14px 14px;
		background: color-mix(in srgb, var(--t-tinta) 8%, transparent);
	}
	/* ses propres messages : une teinte d'or, à droite */
	.meu .bulla {
		border-radius: 14px 4px 14px 14px;
		background: color-mix(in srgb, var(--t-aur) 18%, transparent);
	}
	.amagat .bulla {
		opacity: 0.6;
		border: 1px dashed var(--t-linha);
	}
	.qui {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--esp-8);
		margin: 0 0 2px;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.qui strong {
		color: var(--t-tinta);
	}
	.moderacion {
		padding: 0 0.45rem;
		border: 1px solid var(--t-aur);
		border-radius: 999px;
		color: var(--t-aur);
		font-weight: 700;
	}
	.tèxte {
		margin: 0;
		line-height: 1.45;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.motiu {
		margin: var(--esp-4) 0 0;
		font-size: 0.85rem;
	}
	/* supprimer, signaler : discrets, plus nets au survol et au clavier */
	.gèstes {
		display: flex;
		gap: var(--esp-4);
		opacity: 0.55;
		transition: opacity 0.2s;
	}
	li:hover .gèstes,
	.gèstes:focus-within {
		opacity: 1;
	}
	.gèstes button {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		min-height: 32px;
		padding: 0.2rem 0.5rem;
		border: 0;
		border-radius: 6px;
		background: none;
		color: var(--t-tinta-2);
		font: 400 0.8rem var(--font-body);
		cursor: pointer;
	}
	.gèstes button:hover {
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}

	/* La saisie */
	.compositor {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--esp-8);
		padding: var(--esp-12) var(--esp-16);
		border-top: 1px solid var(--t-linha);
	}
	.compositor .error {
		grid-column: 1 / -1;
	}
	.compositor textarea {
		field-sizing: content;
		min-height: 44px;
		max-height: 10rem;
		box-sizing: border-box;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 22px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
		resize: none;
	}
	.mandar {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		cursor: pointer;
		transition: background-color 0.25s;
	}
	.mandar:hover {
		background: var(--t-accion-viu);
	}
	.mandar:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.pè-tampat {
		margin: 0;
		padding: var(--esp-16);
		border-top: 1px solid var(--t-linha);
		color: var(--t-tinta-2);
	}

	/* Pas encore membre : présentation et bouton */
	.dintrar {
		display: grid;
		align-content: center;
		justify-items: start;
		gap: var(--esp-16);
		flex: 1;
		max-width: 36rem;
		margin: 0 auto;
		padding: var(--esp-32) var(--esp-24);
	}
	.dintrar :global(.frasa) {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 2.2vw, 1.8rem);
		line-height: 1.3;
	}
	.dintrar :global(.nota),
	.descripcion {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.boton {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		border: 0;
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font: 700 1rem/1 var(--font-body);
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.25s;
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}

	/* La fenêtre de signalement */
	.senhal {
		width: min(28rem, calc(100vw - 2rem));
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-top: 6px solid var(--t-aur);
		border-radius: 8px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
	}
	.senhal::backdrop {
		background: rgb(0 0 0 / 0.55);
	}
	.senhal form {
		display: grid;
		gap: var(--esp-16);
	}
	.senhal h3 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
	}
	blockquote {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 3px solid var(--t-linha);
		color: var(--t-tinta-2);
		white-space: pre-line;
		overflow-wrap: anywhere;
		max-height: 6rem;
		overflow: hidden;
	}
	fieldset {
		display: grid;
		gap: var(--esp-4);
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: var(--esp-8);
		font-weight: 700;
	}
	.causida {
		display: flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 36px;
	}
	.causida input {
		accent-color: var(--t-aur);
		width: 1.1rem;
		height: 1.1rem;
	}
	.precisions {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	.precisions textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
		resize: vertical;
	}
	.botons {
		display: flex;
		justify-content: flex-end;
		gap: var(--esp-8);
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.tornar:focus-visible,
	.accion:focus-visible,
	.secondari:focus-visible,
	.ancians:focus-visible,
	.gèstes button:focus-visible,
	.compositor textarea:focus-visible,
	.mandar:focus-visible,
	.boton:focus-visible,
	.precisions textarea:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* téléphone (le cadre est le conteneur « cadre » du gabarit) : la flèche
	   de retour, les actions réduites à leur icône */
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
		.accion span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.accion {
			padding: 0;
			width: 44px;
			justify-content: center;
		}
		li {
			max-width: 92%;
		}
	}
</style>
