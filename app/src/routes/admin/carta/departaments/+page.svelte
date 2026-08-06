<script>
	// Classification des départements de la còla « Despartaments occitans ».
	// Trois niveaux (définis par Romain) : 1 = occitan seule langue régionale,
	// 2 = en partie, 3 = présence ancienne disparue. Un département absent de
	// la liste n'est pas affiché sur la carte.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	const NIVELS = [
		{ n: 1, oc: 'Occitan, sola lenga regionala', fr: 'seule langue régionale' },
		{ n: 2, oc: 'Occitan, lenga regionala en partida', fr: 'en partie' },
		{ n: 3, oc: "Preséncia anciana, despareguda", fr: 'présence ancienne disparue' }
	];

	// Les 96 départements métropolitains, pour proposer l'ajout par menu
	// déroulant plutôt que par code à taper. (Liste figée : elle ne bouge
	// pour ainsi dire jamais.)
	const TOTS = [
		['01', 'Ain'], ['02', 'Aisne'], ['03', 'Allier'], ['04', 'Alpes-de-Haute-Provence'],
		['05', 'Hautes-Alpes'], ['06', 'Alpes-Maritimes'], ['07', 'Ardèche'], ['08', 'Ardennes'],
		['09', 'Ariège'], ['10', 'Aube'], ['11', 'Aude'], ['12', 'Aveyron'],
		['13', 'Bouches-du-Rhône'], ['14', 'Calvados'], ['15', 'Cantal'], ['16', 'Charente'],
		['17', 'Charente-Maritime'], ['18', 'Cher'], ['19', 'Corrèze'], ['21', "Côte-d'Or"],
		['22', "Côtes-d'Armor"], ['23', 'Creuse'], ['24', 'Dordogne'], ['25', 'Doubs'],
		['26', 'Drôme'], ['27', 'Eure'], ['28', 'Eure-et-Loir'], ['29', 'Finistère'],
		['2A', 'Corse-du-Sud'], ['2B', 'Haute-Corse'], ['30', 'Gard'], ['31', 'Haute-Garonne'],
		['32', 'Gers'], ['33', 'Gironde'], ['34', 'Hérault'], ['35', 'Ille-et-Vilaine'],
		['36', 'Indre'], ['37', 'Indre-et-Loire'], ['38', 'Isère'], ['39', 'Jura'],
		['40', 'Landes'], ['41', 'Loir-et-Cher'], ['42', 'Loire'], ['43', 'Haute-Loire'],
		['44', 'Loire-Atlantique'], ['45', 'Loiret'], ['46', 'Lot'], ['47', 'Lot-et-Garonne'],
		['48', 'Lozère'], ['49', 'Maine-et-Loire'], ['50', 'Manche'], ['51', 'Marne'],
		['52', 'Haute-Marne'], ['53', 'Mayenne'], ['54', 'Meurthe-et-Moselle'], ['55', 'Meuse'],
		['56', 'Morbihan'], ['57', 'Moselle'], ['58', 'Nièvre'], ['59', 'Nord'],
		['60', 'Oise'], ['61', 'Orne'], ['62', 'Pas-de-Calais'], ['63', 'Puy-de-Dôme'],
		['64', 'Pyrénées-Atlantiques'], ['65', 'Hautes-Pyrénées'], ['66', 'Pyrénées-Orientales'],
		['67', 'Bas-Rhin'], ['68', 'Haut-Rhin'], ['69', 'Rhône'], ['70', 'Haute-Saône'],
		['71', 'Saône-et-Loire'], ['72', 'Sarthe'], ['73', 'Savoie'], ['74', 'Haute-Savoie'],
		['75', 'Paris'], ['76', 'Seine-Maritime'], ['77', 'Seine-et-Marne'], ['78', 'Yvelines'],
		['79', 'Deux-Sèvres'], ['80', 'Somme'], ['81', 'Tarn'], ['82', 'Tarn-et-Garonne'],
		['83', 'Var'], ['84', 'Vaucluse'], ['85', 'Vendée'], ['86', 'Vienne'],
		['87', 'Haute-Vienne'], ['88', 'Vosges'], ['89', 'Yonne'], ['90', 'Territoire de Belfort'],
		['91', 'Essonne'], ['92', 'Hauts-de-Seine'], ['93', 'Seine-Saint-Denis'],
		['94', 'Val-de-Marne'], ['95', "Val-d'Oise"]
	];

	let departaments = $state([]);
	let cargant = $state(true);
	let msg = $state(null);
	let enregistrant = $state(false);
	let confirmaSup = $state(null);

	let nòuCode = $state('');
	let nòuNivel = $state(1);

	let restants = $derived(
		TOTS.filter(([code]) => !departaments.some((d) => d.code === code))
	);

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const { data, error } = await supabase
			.from('carta_departaments')
			.select('*')
			.order('nivèl')
			.order('code');
		cargant = false;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		departaments = data;
	}

	async function cambiarNivel(d, nivèl) {
		msg = null;
		const r = await supabase
			.from('carta_departaments')
			.update({ nivèl: Number(nivèl) })
			.eq('code', d.code)
			.select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cambiament refusat' };
			await cargar();
			return;
		}
		await cargar();
		msg = { tipe: 'ok', text: `${d.nom} → nivèl ${nivèl}.` };
	}

	async function apondre() {
		msg = null;
		const dept = TOTS.find(([code]) => code === nòuCode);
		if (!dept) {
			msg = { tipe: 'error', text: 'Causís un despartament.' };
			return;
		}
		enregistrant = true;
		try {
			const r = await supabase
				.from('carta_departaments')
				.insert({ code: dept[0], nom: dept[1], nivèl: Number(nòuNivel) })
				.select();
			if (r.error) throw r.error;
			nòuCode = '';
			await cargar();
			msg = { tipe: 'ok', text: `${dept[1]} apondut.` };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}

	async function suprimir(d) {
		msg = null;
		const r = await supabase.from('carta_departaments').delete().eq('code', d.code).select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'supression refusada' };
			return;
		}
		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `${d.nom} tirat de la carta.` };
	}
</script>

<svelte:head>
	<title>Despartaments — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<h1>Despartaments occitans</h1>
	<p class="subtitle">
		Tres nivèls : 1 = sola lenga regionala · 2 = en partida · 3 = preséncia anciana despareguda.
		Un despartament absent es pas afichat.
		<em>(Changer le niveau se fait directement dans la liste.)</em>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	<form class="apondre" onsubmit={(e) => (e.preventDefault(), apondre())}>
		<label>
			Apondre un despartament
			<select bind:value={nòuCode}>
				<option value="">— causir —</option>
				{#each restants as [code, nom] (code)}
					<option value={code}>{code} — {nom}</option>
				{/each}
			</select>
		</label>
		<label class="estrech">
			Nivèl
			<select bind:value={nòuNivel}>
				{#each NIVELS as { n, oc } (n)}
					<option value={n}>{n} — {oc}</option>
				{/each}
			</select>
		</label>
		<button type="submit" class="btn-primary" disabled={enregistrant || !nòuCode}>
			{enregistrant ? '…' : '+ Apondre'}
		</button>
	</form>

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else}
		{#each NIVELS as { n, oc } (n)}
			{@const grop = departaments.filter((d) => d.nivèl === n)}
			{#if grop.length}
				<div class="grop">
					<h2>Nivèl {n} — {oc} <span class="compte">({grop.length})</span></h2>
					<ul class="lista">
						{#each grop as d (d.code)}
							<li>
								<div class="tèxte">
									<strong>{d.code} — {d.nom}</strong>
									{#if d.nòta}<span class="meta">{d.nòta}</span>{/if}
								</div>
								<select
									class="nivel-select"
									value={d.nivèl}
									onchange={(e) => cambiarNivel(d, e.currentTarget.value)}
								>
									{#each NIVELS as { n: nv } (nv)}
										<option value={nv}>Nivèl {nv}</option>
									{/each}
								</select>
								{#if confirmaSup === d.code}
									<span class="segur">Segur ?</span>
									<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(d)}
										>Òc, tirar</button
									>
									<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}
										>Non</button
									>
								{:else}
									<button
										type="button"
										class="btn-segond btn-perilhos"
										onclick={() => (confirmaSup = d.code)}>Tirar</button
									>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/each}
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

	.apondre {
		display: flex;
		align-items: flex-end;
		gap: 0.8rem;
		flex-wrap: wrap;
		background: var(--color-cream);
		border-radius: 16px;
		padding: 1rem 1.25rem;
	}

	.apondre label {
		flex: 1 1 14rem;
	}

	.apondre label.estrech {
		flex: 0 1 16rem;
	}

	.grop {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.compte {
		font-weight: 400;
		font-size: 0.85rem;
		color: var(--color-teal);
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
		gap: 0.6rem;
		padding: 0.55rem 0.6rem;
		border-radius: 12px;
		background: var(--color-cream);
		flex-wrap: wrap;
	}

	.tèxte {
		flex: 1 1 14rem;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.tèxte strong {
		font-size: 0.92rem;
		color: var(--color-text);
	}

	.meta {
		font-size: 0.75rem;
		color: var(--color-teal);
	}

	.nivel-select {
		font-family: var(--font-body);
		font-size: 0.85rem;
		padding: 0.4rem 0.5rem;
		border-radius: 10px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: white;
		color: var(--color-text);
	}

	.segur {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-brick);
	}
</style>
