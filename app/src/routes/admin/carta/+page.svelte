<script>
	// Réglages de la carta : les còlas (registre du panèl « Jaces ») et les
	// couleurs par dialècte. Édition seulement — pas d'ajout/suppression ici,
	// parce que le code (CartaOccitania.svelte) s'attend à des identifiants
	// précis (« lieusInteres », « cro », etc.) : en créer ou en supprimer un
	// depuis cet écran casserait la carte sans que ce soit visible tout de
	// suite. Pour les points, voir « Luòcs ».
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let colas = $state([]);
	let dialectes = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let formaCola = $state(null);
	let formaDialecte = $state(null);
	let enregistrant = $state(false);

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

	function obrirCola(c) {
		msg = null;
		formaCola = {
			id: c.id,
			label_oc: c.label_oc,
			label_fr: c.label_fr,
			nòta_oc: c.nòta_oc ?? '',
			nòta_fr: c.nòta_fr ?? '',
			color: c.color,
			opacitat: c.opacitat,
			disponible: c.disponible
		};
	}

	async function enregistrarCola() {
		const label_oc = formaCola.label_oc.trim();
		const label_fr = formaCola.label_fr.trim();
		if (!label_oc || !label_fr) {
			msg = { tipe: 'error', text: 'Cal un libellat occitan e francés.' };
			return;
		}
		enregistrant = true;
		try {
			const r = await supabase
				.from('carta_colas')
				.update({
					label_oc,
					label_fr,
					nòta_oc: formaCola.nòta_oc.trim() || null,
					nòta_fr: formaCola.nòta_fr.trim() || null,
					color: formaCola.color,
					opacitat: Number(formaCola.opacitat),
					disponible: formaCola.disponible
				})
				.eq('id', formaCola.id)
				.select();
			if (r.error) throw r.error;
			if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			formaCola = null;
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat.' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
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
	<h1>Carta — còlas</h1>
	<p class="subtitle">
		Çò que vei lo monde dins lo panèl « Jaces » de la carta.
		<em>(Ce que le monde voit dans le panneau « Calques » de la carte.)</em>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if formaCola}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrarCola())}>
			<h2>Modificar « {formaCola.id} »</h2>
			<div class="camps">
				<div class="doble">
					<label>
						Libellat occitan
						<input type="text" bind:value={formaCola.label_oc} maxlength="80" required />
					</label>
					<label>
						Libellat francés
						<input type="text" bind:value={formaCola.label_fr} maxlength="80" required />
					</label>
				</div>
				<label>
					Nòta occitana <em>(mostrada se la còla es pas disponibla)</em>
					<input type="text" bind:value={formaCola.nòta_oc} maxlength="160" />
				</label>
				<label>
					Nòta francesa
					<input type="text" bind:value={formaCola.nòta_fr} maxlength="160" />
				</label>
				<div class="doble">
					<label class="estrech">
						Color
						<input type="color" bind:value={formaCola.color} />
					</label>
					<label class="estrech">
						Opacitat <em>(0 a 1)</em>
						<input type="number" bind:value={formaCola.opacitat} min="0" max="1" step="0.05" />
					</label>
				</div>
				<label class="casa">
					<input type="checkbox" bind:checked={formaCola.disponible} />
					<span>Disponibla <em>(activabla dins lo panèl)</em></span>
				</label>
			</div>
			<div class="accions">
				<button type="submit" class="btn-primary" disabled={enregistrant}>
					{enregistrant ? '…' : 'Enregistrar'}
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={() => (formaCola = null)}
					disabled={enregistrant}>Anullar</button
				>
			</div>
		</form>
	{/if}

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else}
		<ul class="lista">
			{#each colas as c (c.id)}
				<li class:rescondut={!c.disponible}>
					<span class="pastilha" style="background:{c.color}"></span>
					<div class="tèxte">
						<strong>{c.label_oc}</strong>
						<span class="meta">
							{c.id} · opacitat {c.opacitat}
							{#if !c.disponible}· <span class="pas-publicat">pas disponibla</span>{/if}
						</span>
					</div>
					<button type="button" class="btn-segond" onclick={() => obrirCola(c)}>Modificar</button>
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
	.subtitle {
		margin: -0.7rem 0 0;
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

	.casa {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem;
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
</style>
