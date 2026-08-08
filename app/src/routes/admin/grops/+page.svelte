<script>
	// Gestion des groupes de designs (table `temas`).
	// L'accès est filtré par admin/+layout.svelte ; les verrous réels sont RLS.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { slug } from '$lib/imatges';

	// La palette de la charte graphique. On ne laisse pas saisir une couleur
	// libre : c'est ce qui fait dériver une identité visuelle.
	const COLORS = [
		{ var: 'var(--color-terracotta)', nom: 'Terracòta' },
		{ var: 'var(--color-teal)', nom: 'Blau-verd' },
		{ var: 'var(--color-gold)', nom: 'Aur' },
		{ var: 'var(--color-olive)', nom: 'Oliva' },
		{ var: 'var(--color-sky)', nom: 'Cèl' },
		{ var: 'var(--color-brick)', nom: 'Teule' }
	];

	let temas = $state([]);
	let comptes = $state(new Map());
	let cargant = $state(true);
	let msg = $state(null);

	let forma = $state(null);
	let enregistrant = $state(false);
	let confirmaSup = $state(null);

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const [t, f] = await Promise.all([
			supabase.from('temas').select('*').order('ordre'),
			supabase.from('fichas').select('tema_id')
		]);
		cargant = false;
		if (t.error || f.error) {
			msg = { tipe: 'error', text: (t.error ?? f.error).message };
			return;
		}
		temas = t.data;
		const m = new Map();
		for (const x of f.data) m.set(x.tema_id, (m.get(x.tema_id) ?? 0) + 1);
		comptes = m;
	}

	function obrirNòu() {
		msg = null;
		forma = { mode: 'nòu', id: null, oc: '', fr: '', color: COLORS[0].var, publicat: true };
	}

	function obrirEdicion(t) {
		msg = null;
		forma = { mode: 'edicion', id: t.id, oc: t.oc, fr: t.fr, color: t.color, publicat: t.publicat };
	}

	async function enregistrar() {
		// forma vaut null tant qu'aucun formulaire n'est ouvert.
		if (!forma) return;
		msg = null;
		const oc = forma.oc.trim();
		const fr = forma.fr.trim();
		if (!oc || !fr) {
			msg = { tipe: 'error', text: 'Cal los dos noms. (Il faut les deux noms.)' };
			return;
		}

		enregistrant = true;
		try {
			if (forma.mode === 'edicion') {
				const r = await supabase
					.from('temas')
					.update({ oc, fr, color: forma.color, publicat: forma.publicat })
					.eq('id', forma.id)
					.select();
				if (r.error) throw r.error;
				if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			} else {
				const basa = slug(oc);
				if (!basa) throw new Error('lo nom balha pas cap d’identificant valid');
				const presas = new Set(temas.map((t) => t.id));
				let id = basa;
				let n = 2;
				while (presas.has(id)) id = `${basa}-${n++}`;

				const ordre = (temas.length ? Math.max(...temas.map((t) => t.ordre)) : -1) + 1;
				const r = await supabase
					.from('temas')
					.insert({ id, oc, fr, color: forma.color, ordre, publicat: forma.publicat })
					.select();
				if (r.error) throw r.error;
			}
			forma = null;
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat. (Enregistré.)' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}

	async function bascularPublicat(t) {
		msg = null;
		const r = await supabase
			.from('temas')
			.update({ publicat: !t.publicat })
			.eq('id', t.id)
			.select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cambiament refusat' };
			return;
		}
		t.publicat = !t.publicat;
	}

	// La base refuse d'effacer un groupe qui contient des fiches (clé étrangère
	// « on delete restrict ») : c'est une protection voulue contre la perte de
	// données. Plutôt qu'un bouton désactivé — sur lequel on clique sans
	// comprendre pourquoi rien ne se passe — le clic explique ce qui bloque.
	function demandarSupression(t) {
		msg = null;
		const n = comptes.get(t.id) ?? 0;
		if (n > 0) {
			msg = {
				tipe: 'info',
				text: `« ${t.oc} » conten encara ${n} ficha${n > 1 ? 's' : ''}. Desplaça-las dins un autre grop abans de lo suprimir — atal se pèrd res. (Déplace-les dans un autre groupe avant de le supprimer — ainsi rien n’est perdu.)`
			};
			return;
		}
		confirmaSup = t.id;
	}

	async function suprimir(t) {
		msg = null;
		const r = await supabase.from('temas').delete().eq('id', t.id).select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'supression refusada' };
			return;
		}
		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `« ${t.oc} » suprimit.` };
	}

	async function desplaçar(t, sens) {
		msg = null;
		const i = temas.findIndex((x) => x.id === t.id);
		const j = i + sens;
		if (j < 0 || j >= temas.length) return;
		const autre = temas[j];
		const rangT = t.ordre;
		const r1 = await supabase.from('temas').update({ ordre: autre.ordre }).eq('id', t.id).select();
		const r2 = await supabase.from('temas').update({ ordre: rangT }).eq('id', autre.id).select();
		if (r1.error || r2.error) msg = { tipe: 'error', text: (r1.error ?? r2.error).message };
		await cargar();
	}
</script>

<svelte:head>
	<title>Grops — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<div class="cap">
		<div>
			<h1>Grops de designs</h1>
			<p class="subtitle">
				{temas.length} grops <em>({temas.filter((t) => !t.publicat).length} pas publicats)</em>
			</p>
		</div>
		<button type="button" class="btn-primary" onclick={obrirNòu}>+ Apondre</button>
	</div>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>{forma.mode === 'nòu' ? 'Apondre un grop' : 'Modificar lo grop'}</h2>

			<div class="camps">
				<label>
					Nom en occitan <em>(s’aficha sul site)</em>
					<input type="text" bind:value={forma.oc} maxlength="60" required />
				</label>

				<label>
					Nom en francés <em>(traduction)</em>
					<input type="text" bind:value={forma.fr} maxlength="60" required />
				</label>

				<label>
					Color <em>(palette de la charte)</em>
					<select bind:value={forma.color}>
						{#each COLORS as c (c.var)}
							<option value={c.var}>{c.nom}</option>
						{/each}
					</select>
				</label>

				<span class="mostra" style:background={forma.color} aria-hidden="true"></span>

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
	{:else}
		<ul class="lista">
			{#each temas as t, i (t.id)}
				<li class:rescondut={!t.publicat}>
					<span class="piuse" style:background={t.color} aria-hidden="true"></span>

					<div class="tèxte">
						<strong>{t.oc}</strong>
						<span class="meta">
							{t.fr} · {comptes.get(t.id) ?? 0} fichas
							{#if !t.publicat}· <span class="pas-publicat">pas publicat</span>{/if}
						</span>
					</div>

					<div class="rang">
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(t, -1)}
							disabled={i === 0}
							aria-label="Montar « {t.oc} »">↑</button
						>
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(t, 1)}
							disabled={i === temas.length - 1}
							aria-label="Davalar « {t.oc} »">↓</button
						>
					</div>

					{#if confirmaSup === t.id}
						<div class="accions-linha">
							<span class="segur">Segur ?</span>
							<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(t)}
								>Òc, suprimir</button
							>
							<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}
								>Non</button
							>
						</div>
					{:else}
						<div class="accions-linha">
							<button type="button" class="btn-segond" onclick={() => bascularPublicat(t)}>
								{t.publicat ? 'Rescondre' : 'Publicar'}
							</button>
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(t)}
								>Modificar</button
							>
							<button
								type="button"
								class="btn-segond btn-perilhos"
								onclick={() => demandarSupression(t)}
								aria-label="Suprimir « {t.oc} »">Suprimir</button
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

	.casa {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem;
	}

	.mostra {
		width: 100%;
		height: 0.5rem;
		border-radius: 999px;
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
		padding: 0.5rem 0.6rem;
		border-radius: 12px;
		background: var(--color-cream);
		flex-wrap: wrap;
	}

	.lista li.rescondut {
		opacity: 0.62;
	}

	.piuse {
		width: 0.55rem;
		height: 2.2rem;
		border-radius: 999px;
		flex: 0 0 auto;
	}

	.tèxte {
		flex: 1 1 10rem;
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
