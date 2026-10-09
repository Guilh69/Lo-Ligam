<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let luocs = $state([]);
	let colas = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let forma = $state(null);
	let enregistrant = $state(false);
	let confirmaSup = $state(null);

	// Las còlas que son de PUNTS. Se la colomna « tipe » existís (migracion
	// generica passada), es ela que decidís ; senon, lista fixa de secors.
	const COLAS_PAS_DE_PUNTS = ['dialectes', 'provincias', 'limsi', 'regions', 'departaments'];

	// La colomna cola_id apareis amb supabase-carta-librarias.sql : abans
	// aquela migracion, se ditz pas dins las escrituras (senon la basa las
	// refusariá).
	let teColaId = $derived(luocs.length ? 'cola_id' in luocs[0] : colas.length > 1);
	// lo site d'un luòc (colomna apondida per supabase-carta-luocs-ligam.sql) :
	// lo camp s'enregistra sonque se la basa a ja la colomna
	let teLigam = $derived(luocs.length > 0 && 'ligam' in luocs[0]);

	function nomCola(id) {
		return colas.find((c) => c.id === id)?.label_oc ?? id;
	}

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const [rLuocs, rColas] = await Promise.all([
			supabase.from('carta_luocs').select('*').order('ordre'),
			supabase.from('carta_colas').select('*').order('ordre')
		]);
		cargant = false;
		if (rLuocs.error) {
			msg = { tipe: 'error', text: rLuocs.error.message };
			return;
		}
		luocs = rLuocs.data;
		colas = (rColas.data ?? []).filter((c) =>
			c.tipe ? c.tipe === 'punts' : !COLAS_PAS_DE_PUNTS.includes(c.id)
		);
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
			cola_id: 'lieusInteres',
			nom_oc: '',
			nom_fr: '',
			descripcion_oc: '',
			descripcion_fr: '',
			ligam: '',
			latitud: '',
			longitud: '',
			publicat: true
		};
	}

	function obrirNòu() {
		msg = null;
		forma = vueita();
	}

	function obrirEdicion(l) {
		msg = null;
		forma = {
			mode: 'edicion',
			id: l.id,
			cola_id: l.cola_id ?? 'lieusInteres',
			nom_oc: l.nom_oc,
			nom_fr: l.nom_fr ?? '',
			descripcion_oc: l.descripcion_oc ?? '',
			descripcion_fr: l.descripcion_fr ?? '',
			ligam: l.ligam ?? '',
			latitud: String(l.latitud),
			longitud: String(l.longitud),
			publicat: l.publicat
		};
	}

	async function enregistrar() {
		// forma vaut null tant qu'aucun formulaire n'est ouvert.
		if (!forma) return;
		msg = null;
		const nom_oc = forma.nom_oc.trim();
		if (!nom_oc) {
			msg = { tipe: 'error', text: 'Cal un nom occitan.' };
			return;
		}

		const latitud = Number(forma.latitud);
		const longitud = Number(forma.longitud);
		if (!Number.isFinite(latitud) || latitud < -90 || latitud > 90) {
			msg = { tipe: 'error', text: 'Latitud pas valida (entre -90 e 90).' };
			return;
		}
		if (!Number.isFinite(longitud) || longitud < -180 || longitud > 180) {
			msg = { tipe: 'error', text: 'Longitud pas valida (entre -180 e 180).' };
			return;
		}

		const ligam = forma.ligam.trim();
		if (ligam && !/^https:\/\/[^\s/]+\.[^\s]+$/.test(ligam)) {
			msg = { tipe: 'error', text: 'Lo site deu començar per https:// (ex. https://www.ieo-oc.org).' };
			return;
		}

		const camps = {
			...(teColaId ? { cola_id: forma.cola_id } : {}),
			nom_oc,
			nom_fr: forma.nom_fr.trim() || null,
			descripcion_oc: forma.descripcion_oc.trim() || null,
			descripcion_fr: forma.descripcion_fr.trim() || null,
			...(teLigam ? { ligam: ligam || null } : {}),
			latitud,
			longitud,
			publicat: forma.publicat
		};

		enregistrant = true;
		try {
			if (forma.mode === 'edicion') {
				const r = await supabase.from('carta_luocs').update(camps).eq('id', forma.id).select();
				if (r.error) throw r.error;
				if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			} else {
				const basa = slug(nom_oc);
				if (!basa) throw new Error('lo nom balha pas cap d’identificant valid');
				const presas = new Set(luocs.map((l) => l.id));
				let id = basa;
				let n = 2;
				while (presas.has(id)) id = `${basa}-${n++}`;

				const ordre = (luocs.length ? Math.max(...luocs.map((l) => l.ordre)) : -1) + 1;
				const r = await supabase
					.from('carta_luocs')
					.insert({ id, ordre, ...camps })
					.select();
				if (r.error) throw r.error;
			}
			forma = null;
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat.' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}

	async function bascularPublicat(l) {
		msg = null;
		const r = await supabase
			.from('carta_luocs')
			.update({ publicat: !l.publicat })
			.eq('id', l.id)
			.select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cambiament refusat' };
			return;
		}
		l.publicat = !l.publicat;
	}

	async function suprimir(l) {
		msg = null;
		const r = await supabase.from('carta_luocs').delete().eq('id', l.id).select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'supression refusada' };
			return;
		}
		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `« ${l.nom_oc} » suprimit.` };
	}

	async function desplaçar(l, sens) {
		msg = null;
		const i = luocs.findIndex((x) => x.id === l.id);
		const j = i + sens;
		if (j < 0 || j >= luocs.length) return;
		const autre = luocs[j];
		const rangL = l.ordre;
		const r1 = await supabase.from('carta_luocs').update({ ordre: autre.ordre }).eq('id', l.id).select();
		const r2 = await supabase
			.from('carta_luocs')
			.update({ ordre: rangL })
			.eq('id', autre.id)
			.select();
		if (r1.error || r2.error) msg = { tipe: 'error', text: (r1.error ?? r2.error).message };
		await cargar();
	}
</script>

<svelte:head>
	<title>Luòcs — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<div class="cap">
		<div>
			<h1>Luòcs d'interès</h1>
			<p class="subtitle">
				{luocs.length} luòcs <em>({luocs.filter((l) => !l.publicat).length} pas publicats)</em>
			</p>
		</div>
		<button type="button" class="btn-primary" onclick={obrirNòu}>+ Apondre</button>
	</div>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>{forma.mode === 'nòu' ? 'Apondre un luòc' : 'Modificar'}</h2>

			<div class="camps">
				{#if teColaId && colas.length > 1}
					<label>
						Còla <em>(dins quin jaç de la carta apareis aqueste punt)</em>
						<select bind:value={forma.cola_id}>
							{#each colas as c (c.id)}
								<option value={c.id}>{c.label_oc}</option>
							{/each}
						</select>
					</label>
				{/if}

				<div class="doble">
					<label>
						Nom occitan
						<input type="text" bind:value={forma.nom_oc} maxlength="100" required />
					</label>
					<label>
						Nom francés
						<input type="text" bind:value={forma.nom_fr} maxlength="100" />
					</label>
				</div>

				<label>
					Descripcion occitana
					<textarea bind:value={forma.descripcion_oc} rows="2" maxlength="300"></textarea>
				</label>
				<label>
					Descripcion francesa
					<textarea bind:value={forma.descripcion_fr} rows="2" maxlength="300"></textarea>
				</label>
				{#if teLigam}
					<label>
						Site internet <em>(se n'a un)</em>
						<input type="url" bind:value={forma.ligam} maxlength="300" placeholder="https://…" />
					</label>
				{/if}

				<div class="doble">
					<label class="estrech">
						Latitud
						<input type="text" bind:value={forma.latitud} inputmode="decimal" placeholder="43.6045" />
					</label>
					<label class="estrech">
						Longitud
						<input type="text" bind:value={forma.longitud} inputmode="decimal" placeholder="1.4442" />
					</label>
				</div>
				<p class="ajuda">
					Cercar las coordenadas sus <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer"
						>openstreetmap.org</a
					>
					— clic dre sus lo luòc → « Mostrar l'adreça ». <em>(Clic droit → « Afficher l'adresse ».)</em
					>
				</p>

				<label class="casa">
					<input type="checkbox" bind:checked={forma.publicat} />
					<span>Publicat <em>(visible pels visitaires)</em></span>
				</label>
			</div>

			<div class="accions">
				<button type="submit" class="btn-primary" disabled={enregistrant}>
					{enregistrant ? '…' : 'Enregistrar'}
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={() => (forma = null)}
					disabled={enregistrant}>Anullar</button
				>
			</div>
		</form>
	{/if}

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else if !luocs.length}
		<p class="msg info">Cap de luòc pel moment.</p>
	{:else}
		<ul class="lista">
			{#each luocs as l, i (l.id)}
				<li class:rescondut={!l.publicat}>
					<div class="tèxte">
						<strong>{l.nom_oc}</strong>
						<span class="meta">
							{#if teColaId}{nomCola(l.cola_id ?? 'lieusInteres')} · {/if}{l.latitud.toFixed(3)}, {l.longitud.toFixed(
								3
							)}
							{#if !l.publicat}· <span class="pas-publicat">pas publicat</span>{/if}
						</span>
					</div>

					<div class="rang">
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(l, -1)}
							disabled={i === 0}
							aria-label="Montar « {l.nom_oc} »">↑</button
						>
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(l, 1)}
							disabled={i === luocs.length - 1}
							aria-label="Davalar « {l.nom_oc} »">↓</button
						>
					</div>

					{#if confirmaSup === l.id}
						<div class="accions-linha">
							<span class="segur">Segur ?</span>
							<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(l)}
								>Òc, suprimir</button
							>
							<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}
								>Non</button
							>
						</div>
					{:else}
						<div class="accions-linha">
							<button type="button" class="btn-segond" onclick={() => bascularPublicat(l)}>
								{l.publicat ? 'Rescondre' : 'Publicar'}
							</button>
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(l)}
								>Modificar</button
							>
							<button
								type="button"
								class="btn-segond btn-perilhos"
								onclick={() => (confirmaSup = l.id)}
								aria-label="Suprimir « {l.nom_oc} »">Suprimir</button
							>
						</div>
					{/if}
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
	}

	.doble > :global(label) {
		flex: 1 1 10rem;
	}

	.doble > :global(label.estrech) {
		flex: 0 1 9rem;
	}

	textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: var(--color-cream);
		color: var(--color-text);
		resize: vertical;
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
	}

	.ajuda em {
		color: var(--color-teal);
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
		max-height: 60vh;
		overflow-y: auto;
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
