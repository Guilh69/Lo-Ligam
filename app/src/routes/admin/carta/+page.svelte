<script>
	// Gestion des còlas (couches) de la carte. Depuis la migration
	// « generica » (supabase-carta-colas-generic.sql), on peut ICI créer une
	// couche complète sans code : type (punts / zonas / linhas), thématique de
	// regroupement, style (couleur, opacité, épaisseur, pointillé), fichier
	// GeoJSON téléversé (zones/lignes), et modèle de popup avec les champs des
	// données — ex. « {nom} — {descripcion} ».
	//
	// Deux couches restent SPÉCIALES (comportement codé) : dialèctes (couleur
	// par zone, voir plus bas) et despartaments (3 nivèls, écran dédié). On ne
	// peut ni les supprimer ni changer leur fichier ici.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	const ESPECIALAS = ['dialectes', 'departaments'];
	const TIPES = [
		{ id: 'punts', oc: 'Punts (marcadors)', ajuda: 'se gerisson dins « Luòcs »' },
		{ id: 'zonas', oc: 'Zònas (susfàcias)', ajuda: 'fichièr GeoJSON de polygòns' },
		{ id: 'linhas', oc: 'Linhas (traçats)', ajuda: 'fichièr GeoJSON de linhas (rius…)' }
	];

	let colas = $state([]);
	let dialectes = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let forma = $state(null);
	let formaDialecte = $state(null);
	let enregistrant = $state(false);
	let confirmaSup = $state(null);
	let fichierGeo = $state(null);

	// La migration est-elle passée ? (colonne « tipe » présente)
	let teGeneric = $derived(colas.length ? 'tipe' in colas[0] : false);

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const [rColas, rDialectes] = await Promise.all([
			supabase.from('carta_colas').select('*').order('ordre'),
			supabase.from('carta_dialectes').select('*').order('ordre')
		]);
		cargant = false;
		if (rColas.error) {
			msg = { tipe: 'error', text: rColas.error.message };
			return;
		}
		if (rDialectes.error) {
			msg = { tipe: 'error', text: rDialectes.error.message };
			return;
		}
		colas = rColas.data;
		dialectes = rDialectes.data;
	}

	function slug(text) {
		return text
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function vueita() {
		return {
			mode: 'nòu',
			id: null,
			label_oc: '',
			label_fr: '',
			nòta_oc: '',
			nòta_fr: '',
			tematica_oc: '',
			tematica_fr: '',
			tipe: 'punts',
			color: '#b53d17',
			opacitat: 0.5,
			pes_linha: 1.5,
			linha_puntejada: false,
			popup_plantilha: '',
			visibla: false,
			disponible: true,
			geojson_url: null
		};
	}

	function obrirNòu() {
		msg = null;
		fichierGeo = null;
		forma = vueita();
	}

	function obrirEdicion(c) {
		msg = null;
		fichierGeo = null;
		forma = {
			mode: 'edicion',
			id: c.id,
			label_oc: c.label_oc,
			label_fr: c.label_fr,
			nòta_oc: c.nòta_oc ?? '',
			nòta_fr: c.nòta_fr ?? '',
			tematica_oc: c.tematica_oc ?? '',
			tematica_fr: c.tematica_fr ?? '',
			tipe: c.tipe ?? 'punts',
			color: c.color,
			opacitat: c.opacitat,
			pes_linha: c.pes_linha ?? 1.5,
			linha_puntejada: c.linha_puntejada ?? false,
			popup_plantilha: c.popup_plantilha ?? '',
			visibla: c.visibla ?? false,
			disponible: c.disponible,
			geojson_url: c.geojson_url ?? null
		};
	}

	// Cherche la première paire de coordonnées, pour vérifier qu'on est bien
	// en longitude/latitude (WGS84) et pas en mètres Lambert.
	function primieraCoordenada(geom) {
		if (!geom) return null;
		if (geom.type === 'GeometryCollection') {
			for (const g of geom.geometries ?? []) {
				const c = primieraCoordenada(g);
				if (c) return c;
			}
			return null;
		}
		let c = geom.coordinates;
		while (Array.isArray(c) && Array.isArray(c[0])) c = c[0];
		return Array.isArray(c) && typeof c[0] === 'number' ? c : null;
	}

	async function legirFichier(event) {
		msg = null;
		fichierGeo = null;
		const f = event.currentTarget.files?.[0];
		if (!f) return;
		if (f.size > 5 * 1024 * 1024) {
			msg = {
				tipe: 'error',
				text: 'Fichièr tròp gròs (mai de 5 Mo). Dins QGIS : simplificar la geometria abans d’exportar.'
			};
			return;
		}
		const text = await f.text();
		try {
			const data = JSON.parse(text);
			if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
				throw new Error('es pas una FeatureCollection GeoJSON');
			}
			for (const feat of data.features.slice(0, 20)) {
				const c = primieraCoordenada(feat.geometry);
				if (c && (Math.abs(c[0]) > 180 || Math.abs(c[1]) > 90)) {
					throw new Error(
						'coordenadas pas en longitud/latitud (WGS84). Dins QGIS, exportar en EPSG:4326'
					);
				}
			}
			const camps = new Set();
			for (const feat of data.features.slice(0, 50)) {
				for (const k of Object.keys(feat.properties ?? {})) camps.add(k);
			}
			fichierGeo = { nom: f.name, text, nFeatures: data.features.length, camps: [...camps] };
		} catch (e) {
			msg = { tipe: 'error', text: `Fichièr pas valid : ${e.message}` };
		}
	}

	async function enregistrar() {
		// forma vaut null tant qu'aucun formulaire n'est ouvert.
		if (!forma) return;
		msg = null;
		const label_oc = forma.label_oc.trim();
		const label_fr = forma.label_fr.trim();
		if (!label_oc || !label_fr) {
			msg = { tipe: 'error', text: 'Cal un libellat occitan e francés.' };
			return;
		}
		const opacitat = Number(forma.opacitat);
		if (!Number.isFinite(opacitat) || opacitat < 0 || opacitat > 1) {
			msg = { tipe: 'error', text: 'Opacitat entre 0 e 1.' };
			return;
		}

		enregistrant = true;
		try {
			let id = forma.id;
			if (forma.mode === 'nòu') {
				const basa = slug(label_oc);
				if (!basa) throw new Error('lo libellat balha pas cap d’identificant valid');
				const presas = new Set(colas.map((c) => c.id));
				id = basa;
				let n = 2;
				while (presas.has(id)) id = `${basa}-${n++}`;
			}

			const camps = {
				label_oc,
				label_fr,
				nòta_oc: forma.nòta_oc.trim() || null,
				nòta_fr: forma.nòta_fr.trim() || null,
				color: forma.color,
				opacitat,
				disponible: forma.disponible
			};

			if (teGeneric || forma.mode === 'nòu') {
				camps.tematica_oc = forma.tematica_oc.trim() || null;
				camps.tematica_fr = forma.tematica_fr.trim() || null;
				camps.pes_linha = Number(forma.pes_linha) || 1.5;
				camps.linha_puntejada = forma.linha_puntejada;
				camps.popup_plantilha = forma.popup_plantilha.trim() || null;
				camps.visibla = forma.visibla;
			}

			// Téléversement du tracé (zones/lignes seulement).
			if (fichierGeo && forma.tipe !== 'punts' && !ESPECIALAS.includes(id)) {
				const camin = `${id}.geojson`;
				const up = await supabase.storage
					.from('cartas')
					.upload(camin, new Blob([fichierGeo.text], { type: 'application/geo+json' }), {
						upsert: true,
						contentType: 'application/geo+json'
					});
				if (up.error) throw up.error;
				const { data: pub } = supabase.storage.from('cartas').getPublicUrl(camin);
				camps.geojson_url = pub.publicUrl;
			}

			if (forma.mode === 'edicion') {
				const r = await supabase.from('carta_colas').update(camps).eq('id', id).select();
				if (r.error) throw r.error;
				if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			} else {
				camps.tipe = forma.tipe;
				const ordre = (colas.length ? Math.max(...colas.map((c) => c.ordre)) : -1) + 1;
				const r = await supabase
					.from('carta_colas')
					.insert({ id, ordre, ...camps })
					.select();
				if (r.error) throw r.error;
			}

			const sensFichier =
				forma.tipe !== 'punts' && !camps.geojson_url && !forma.geojson_url && !ESPECIALAS.includes(id);
			forma = null;
			fichierGeo = null;
			await cargar();
			msg = sensFichier
				? {
						tipe: 'info',
						text: 'Enregistrat — mas sens fichièr GeoJSON, la còla aficharà pas res : torna la modificar per ne mandar un.'
					}
				: { tipe: 'ok', text: 'Enregistrat.' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}

	async function suprimir(c) {
		msg = null;
		const r = await supabase.from('carta_colas').delete().eq('id', c.id).select();
		if (r.error) {
			msg = {
				tipe: 'error',
				text: /foreign key|viol/i.test(r.error.message)
					? `« ${c.label_oc} » a encara de punts : tira-los (o desplaça-los) dins « Luòcs » abans de suprimir la còla.`
					: r.error.message
			};
			return;
		}
		if (!r.data?.length) {
			msg = { tipe: 'error', text: 'supression refusada' };
			return;
		}
		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `« ${c.label_oc} » suprimida.` };
	}

	async function desplaçar(c, sens) {
		msg = null;
		const i = colas.findIndex((x) => x.id === c.id);
		const j = i + sens;
		if (j < 0 || j >= colas.length) return;
		const autre = colas[j];
		const rangC = c.ordre;
		const r1 = await supabase.from('carta_colas').update({ ordre: autre.ordre }).eq('id', c.id).select();
		const r2 = await supabase.from('carta_colas').update({ ordre: rangC }).eq('id', autre.id).select();
		if (r1.error || r2.error) msg = { tipe: 'error', text: (r1.error ?? r2.error).message };
		await cargar();
	}

	function obrirDialecte(d) {
		msg = null;
		formaDialecte = {
			kòd: d.kòd,
			label_oc: d.label_oc,
			label_fr: d.label_fr ?? '',
			color: d.color,
			opacitat: d.opacitat
		};
	}

	async function enregistrarDialecte() {
		if (!formaDialecte) return;
		const label_oc = formaDialecte.label_oc.trim();
		if (!label_oc) {
			msg = { tipe: 'error', text: 'Cal un libellat occitan.' };
			return;
		}
		enregistrant = true;
		try {
			const r = await supabase
				.from('carta_dialectes')
				.update({
					label_oc,
					label_fr: formaDialecte.label_fr.trim() || null,
					color: formaDialecte.color,
					opacitat: Number(formaDialecte.opacitat)
				})
				.eq('kòd', formaDialecte.kòd)
				.select();
			if (r.error) throw r.error;
			if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			formaDialecte = null;
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat.' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}
</script>

<svelte:head>
	<title>Carta — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<div class="cap">
		<div>
			<h1>Carta — còlas</h1>
			<p class="subtitle">
				Las jacas de la carta : crear, estilizar, gropar per tematica, ordenar.
				<em>(Les couches de la carte : créer, styler, grouper, ordonner.)</em>
			</p>
		</div>
		{#if teGeneric}
			<button type="button" class="btn-primary" onclick={obrirNòu}>+ Nòva còla</button>
		{/if}
	</div>

	{#if !cargant && !teGeneric}
		<p class="msg info">
			Per crear de còlas d'aicí, cal d'abòrd executar
			<strong>supabase-carta-colas-generic.sql</strong> dins Supabase.
			<em>(Exécuter d'abord le script dans Supabase pour débloquer la création.)</em>
		</p>
	{/if}

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>{forma.mode === 'nòu' ? 'Nòva còla' : `Modificar « ${forma.id} »`}</h2>

			{#if ESPECIALAS.includes(forma.id)}
				<p class="ajuda">
					Còla especiala : son afichatge es codat (colors per zòna o nivèls). Se pòdon cambiar los
					libellats, la tematica e la disponibilitat ; lo fichièr e la plantilha, non.
				</p>
			{/if}

			<div class="camps">
				{#if forma.mode === 'nòu'}
					<label>
						Mena <em>(type — se causís un còp, a la creacion)</em>
						<select bind:value={forma.tipe}>
							{#each TIPES as t (t.id)}
								<option value={t.id}>{t.oc} — {t.ajuda}</option>
							{/each}
						</select>
					</label>
				{/if}

				<div class="doble">
					<label>
						Libellat occitan
						<input type="text" bind:value={forma.label_oc} maxlength="80" required />
					</label>
					<label>
						Libellat francés
						<input type="text" bind:value={forma.label_fr} maxlength="80" required />
					</label>
				</div>

				<div class="doble">
					<label>
						Tematica occitana <em>(gropa las còlas dins lo panèl ; void = sens grop)</em>
						<input type="text" bind:value={forma.tematica_oc} maxlength="60" list="tematicas" />
					</label>
					<label>
						Tematica francesa
						<input type="text" bind:value={forma.tematica_fr} maxlength="60" />
					</label>
				</div>
				<datalist id="tematicas">
					{#each [...new Set(colas.map((c) => c.tematica_oc).filter(Boolean))] as t (t)}
						<option value={t}></option>
					{/each}
				</datalist>

				<label>
					Nòta occitana <em>(mostrada se la còla es pas disponibla)</em>
					<input type="text" bind:value={forma.nòta_oc} maxlength="160" />
				</label>
				<label>
					Nòta francesa
					<input type="text" bind:value={forma.nòta_fr} maxlength="160" />
				</label>

				<div class="doble">
					<label class="estrech">
						Color
						<input type="color" bind:value={forma.color} />
					</label>
					<label class="estrech">
						Opacitat <em>(0 a 1)</em>
						<input type="number" bind:value={forma.opacitat} min="0" max="1" step="0.05" />
					</label>
					{#if forma.tipe !== 'punts'}
						<label class="estrech">
							Pes de linha <em>(espessor)</em>
							<input type="number" bind:value={forma.pes_linha} min="0.5" max="8" step="0.1" />
						</label>
						<label class="casa estrech">
							<input type="checkbox" bind:checked={forma.linha_puntejada} />
							<span>Puntejada</span>
						</label>
					{/if}
				</div>

				{#if forma.tipe !== 'punts' && !ESPECIALAS.includes(forma.id)}
					<label>
						Fichièr GeoJSON {forma.geojson_url ? '(remplaçar lo fichièr actual)' : ''}
						<input type="file" accept=".geojson,.json,application/geo+json" onchange={legirFichier} />
					</label>
					{#if fichierGeo}
						<p class="ajuda">
							✓ {fichierGeo.nom} — {fichierGeo.nFeatures} formas. Camps disponibles per la
							plantilha : {fichierGeo.camps.map((c) => `{${c}}`).join(' ')}
						</p>
					{:else if forma.geojson_url}
						<p class="ajuda">Fichièr actual : {forma.geojson_url.split('/').pop()}</p>
					{/if}

					<label>
						Plantilha del popup <em>(çò mostrat al clic — {'{camp}'} = valor del camp)</em>
						<input
							type="text"
							bind:value={forma.popup_plantilha}
							maxlength="300"
							placeholder="{'{nom}'} — {'{descripcion}'}"
						/>
					</label>
				{/if}

				{#if forma.tipe === 'punts' && forma.mode === 'nòu'}
					<p class="ajuda">
						Los punts d'aquesta còla s'apondràn dins « Luòcs » (menú), en causissent la còla dins
						lo formulari.
					</p>
				{/if}

				<div class="doble">
					<label class="casa">
						<input type="checkbox" bind:checked={forma.visibla} />
						<span>Visibla per defaut <em>(marcada en dubrissent la carta)</em></span>
					</label>
					<label class="casa">
						<input type="checkbox" bind:checked={forma.disponible} />
						<span>Disponibla <em>(activabla pels visitaires)</em></span>
					</label>
				</div>
			</div>

			<div class="accions">
				<button type="submit" class="btn-primary" disabled={enregistrant}>
					{enregistrant ? '…' : 'Enregistrar'}
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={() => ((forma = null), (fichierGeo = null))}
					disabled={enregistrant}>Anullar</button
				>
			</div>
		</form>
	{/if}

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else}
		<ul class="lista">
			{#each colas as c, i (c.id)}
				<li class:rescondut={!c.disponible}>
					<span class="pastilha" style="background:{c.color}"></span>
					<div class="tèxte">
						<strong>{c.label_oc}</strong>
						<span class="meta">
							{c.id}
							{#if c.tipe}· {c.tipe}{/if}
							{#if c.tematica_oc}· {c.tematica_oc}{/if}
							{#if c.visibla}· visibla{/if}
							{#if !c.disponible}· <span class="pas-publicat">pas disponibla</span>{/if}
							{#if ESPECIALAS.includes(c.id)}· <span class="especiala">especiala</span>{/if}
						</span>
					</div>

					<div class="rang">
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(c, -1)}
							disabled={i === 0}
							aria-label="Montar">↑</button
						>
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(c, 1)}
							disabled={i === colas.length - 1}
							aria-label="Davalar">↓</button
						>
					</div>

					{#if confirmaSup === c.id}
						<div class="accions-linha">
							<span class="segur">Segur ?</span>
							<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(c)}
								>Òc, suprimir</button
							>
							<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}
								>Non</button
							>
						</div>
					{:else}
						<div class="accions-linha">
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(c)}
								>Modificar</button
							>
							{#if teGeneric && !ESPECIALAS.includes(c.id)}
								<button
									type="button"
									class="btn-segond btn-perilhos"
									onclick={() => (confirmaSup = c.id)}>Suprimir</button
								>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section class="card">
	<h1>Dialèctes</h1>
	<p class="subtitle">
		Color e libellat de cada zòna dialectala (còla « Dialèctes »).
		<em>(Couleur et libellé de chaque zone dialectale.)</em>
	</p>

	{#if formaDialecte}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrarDialecte())}>
			<h2>Modificar « {formaDialecte.kòd} »</h2>
			<div class="camps">
				<div class="doble">
					<label>
						Libellat occitan
						<input type="text" bind:value={formaDialecte.label_oc} maxlength="60" required />
					</label>
					<label>
						Libellat francés
						<input type="text" bind:value={formaDialecte.label_fr} maxlength="60" />
					</label>
				</div>
				<div class="doble">
					<label class="estrech">
						Color
						<input type="color" bind:value={formaDialecte.color} />
					</label>
					<label class="estrech">
						Opacitat <em>(0 a 1)</em>
						<input type="number" bind:value={formaDialecte.opacitat} min="0" max="1" step="0.05" />
					</label>
				</div>
			</div>
			<div class="accions">
				<button type="submit" class="btn-primary" disabled={enregistrant}>
					{enregistrant ? '…' : 'Enregistrar'}
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={() => (formaDialecte = null)}
					disabled={enregistrant}>Anullar</button
				>
			</div>
		</form>
	{/if}

	{#if !cargant}
		<ul class="lista">
			{#each dialectes as d (d.kòd)}
				<li>
					<span class="pastilha" style="background:{d.color}"></span>
					<div class="tèxte">
						<strong>{d.label_oc}</strong>
						<span class="meta">{d.kòd} · opacitat {d.opacitat}</span>
					</div>
					<button type="button" class="btn-segond" onclick={() => obrirDialecte(d)}
						>Modificar</button
					>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.cap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.cap > div {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.subtitle {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.subtitle em {
		opacity: 0.8;
	}

	.forma {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--color-cream);
		border-radius: 16px;
		padding: 1.25rem;
	}

	.camps {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.camps :global(label em) {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	.doble {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.doble > :global(label) {
		flex: 1 1 10rem;
	}

	.doble > :global(label.estrech) {
		flex: 0 1 8rem;
	}

	input[type='color'] {
		width: 100%;
		height: 2.6rem;
		padding: 0.2rem;
		border-radius: 10px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: var(--color-cream);
	}

	input[type='file'] {
		font-size: 0.85rem;
	}

	.casa {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem;
	}

	.ajuda {
		margin: -0.3rem 0 0;
		font-size: 0.78rem;
		line-height: 1.45;
		color: var(--color-olive);
		overflow-wrap: anywhere;
	}

	.accions {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.lista li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem;
		border-radius: 12px;
		background: var(--color-cream);
		flex-wrap: wrap;
	}

	.lista li.rescondut {
		opacity: 0.62;
	}

	.pastilha {
		width: 1.3rem;
		height: 1.3rem;
		border-radius: 999px;
		flex-shrink: 0;
		box-shadow: inset 0 0 0 1.5px rgba(58, 42, 32, 0.2);
	}

	.tèxte {
		flex: 1 1 12rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.tèxte strong {
		font-size: 0.95rem;
		color: var(--color-text);
	}

	.meta {
		font-size: 0.78rem;
		color: var(--color-teal);
	}

	.pas-publicat {
		color: var(--color-brick);
		font-weight: 600;
	}

	.especiala {
		color: var(--color-sky);
		font-weight: 600;
	}

	.rang {
		display: flex;
		gap: 0.2rem;
	}

	.btn-icòna {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		border: 1.5px solid rgba(58, 42, 32, 0.2);
		background: white;
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.btn-icòna:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.accions-linha {
		display: flex;
		gap: 0.35rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.segur {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-brick);
	}
</style>
