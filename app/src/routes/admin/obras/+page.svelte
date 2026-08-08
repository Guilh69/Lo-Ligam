<script>
	// Gestion de l'espace « Òbras ». Aucun fichier n'est envoyé ici : on saisit
	// des informations, un lien, et le commentaire de Romain. L'écoute passe par
	// le lecteur officiel de la plateforme.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { slug } from '$lib/imatges';
	import { MENAS, idYoutube, ostePropre } from '$lib/obras';

	let obras = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let forma = $state(null);
	let enregistrant = $state(false);
	let confirmaSup = $state(null);

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const { data, error } = await supabase.from('obras').select('*').order('ordre');
		cargant = false;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		obras = data;
	}

	function vueita(mena = 'musica') {
		return {
			mode: 'nòu',
			id: null,
			mena,
			titre: '',
			autor: '',
			editor: '',
			an: '',
			embed_url: '',
			ligam: '',
			imatge_url: '',
			comentari: '',
			publicat: true
		};
	}

	function obrirNòu() {
		msg = null;
		forma = vueita();
	}

	function obrirEdicion(o) {
		msg = null;
		forma = {
			mode: 'edicion',
			id: o.id,
			mena: o.mena,
			titre: o.titre,
			autor: o.autor,
			editor: o.editor ?? '',
			an: o.an ?? '',
			embed_url: o.embed_url ?? '',
			ligam: o.ligam ?? '',
			imatge_url: o.imatge_url ?? '',
			comentari: o.comentari ?? '',
			publicat: o.publicat
		};
	}

	async function enregistrar() {
		// forma vaut null tant qu'aucun formulaire n'est ouvert.
		if (!forma) return;
		msg = null;
		const titre = forma.titre.trim();
		const autor = forma.autor.trim();
		if (!titre || !autor) {
			msg = { tipe: 'error', text: 'Cal un títol e un autor. (Il faut un titre et un auteur.)' };
			return;
		}

		const an = forma.an === '' ? null : Number(forma.an);
		if (an !== null && (!Number.isInteger(an) || an < 1000 || an > 2100)) {
			msg = { tipe: 'error', text: 'L’annada es pas valida. (L’année n’est pas valide.)' };
			return;
		}

		const camps = {
			mena: forma.mena,
			titre,
			autor,
			editor: forma.editor.trim() || null,
			an,
			embed_url: forma.embed_url.trim() || null,
			ligam: forma.ligam.trim() || null,
			imatge_url: forma.imatge_url.trim() || null,
			comentari: forma.comentari.trim() || null,
			publicat: forma.publicat
		};

		enregistrant = true;
		try {
			if (forma.mode === 'edicion') {
				const r = await supabase.from('obras').update(camps).eq('id', forma.id).select();
				if (r.error) throw r.error;
				if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			} else {
				const basa = `${slug(autor)}--${slug(titre)}`;
				if (!basa.replace('--', '')) throw new Error('lo títol balha pas cap d’identificant valid');
				const presas = new Set(obras.map((o) => o.id));
				let id = basa;
				let n = 2;
				while (presas.has(id)) id = `${basa}-${n++}`;

				const ordre = (obras.length ? Math.max(...obras.map((o) => o.ordre)) : -1) + 1;
				const r = await supabase
					.from('obras')
					.insert({ id, ordre, ...camps })
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

	async function bascularPublicat(o) {
		msg = null;
		const r = await supabase
			.from('obras')
			.update({ publicat: !o.publicat })
			.eq('id', o.id)
			.select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cambiament refusat' };
			return;
		}
		o.publicat = !o.publicat;
	}

	async function suprimir(o) {
		msg = null;
		const r = await supabase.from('obras').delete().eq('id', o.id).select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'supression refusada' };
			return;
		}
		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `« ${o.titre} » suprimida.` };
	}

	async function desplaçar(o, sens) {
		msg = null;
		const i = obras.findIndex((x) => x.id === o.id);
		const j = i + sens;
		if (j < 0 || j >= obras.length) return;
		const autre = obras[j];
		const rangO = o.ordre;
		const r1 = await supabase.from('obras').update({ ordre: autre.ordre }).eq('id', o.id).select();
		const r2 = await supabase.from('obras').update({ ordre: rangO }).eq('id', autre.id).select();
		if (r1.error || r2.error) msg = { tipe: 'error', text: (r1.error ?? r2.error).message };
		await cargar();
	}

	// Prévient tout de suite si le lien collé n'est pas exploitable, plutôt que
	// de laisser une œuvre sans bouton d'écoute sans qu'on comprenne pourquoi.
	let avisEmbed = $derived.by(() => {
		const v = forma?.embed_url?.trim();
		if (!v) return null;
		return idYoutube(v)
			? { ok: true, text: 'Ligam YouTube reconegut : lo lector serà cargat al clic.' }
			: {
					ok: false,
					text: 'Ligam pas reconegut. Pel moment sonque YouTube s’intègra ; los autres se mòstran coma simple ligam.'
				};
	});
</script>

<svelte:head>
	<title>Òbras — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<div class="cap">
		<div>
			<h1>Òbras</h1>
			<p class="subtitle">
				{obras.length} òbras <em>({obras.filter((o) => !o.publicat).length} pas publicadas)</em>
			</p>
		</div>
		<button type="button" class="btn-primary" onclick={obrirNòu}>+ Apondre</button>
	</div>

	<p class="regla">
		Cap d’extrach es albergat aicí : informacions, ligam e ton comentari. L’escota passa pel
		lector oficial de la plataforma, qu’es el que pòrta los dreches.
		<em
			>(Aucun extrait n’est hébergé ici : informations, lien et ton commentaire. L’écoute passe par
			le lecteur officiel de la plateforme, qui porte les droits.)</em
		>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>{forma.mode === 'nòu' ? 'Apondre una òbra' : 'Modificar'}</h2>

			<div class="camps">
				<label>
					Mena <em>(type)</em>
					<select bind:value={forma.mena}>
						{#each MENAS as m (m.id)}
							<option value={m.id}>{m.oc} — {m.fr}</option>
						{/each}
					</select>
				</label>

				<label>
					Títol <em>(titre)</em>
					<input type="text" bind:value={forma.titre} maxlength="140" required />
				</label>

				<label>
					Autor <em>(artiste, auteur)</em>
					<input type="text" bind:value={forma.autor} maxlength="140" required />
				</label>

				<div class="doble">
					<label>
						Editor <em>(label, éditeur)</em>
						<input type="text" bind:value={forma.editor} maxlength="140" />
					</label>
					<label class="estrech">
						Annada <em>(année)</em>
						<input type="text" bind:value={forma.an} inputmode="numeric" maxlength="4" />
					</label>
				</div>

				<label>
					Ligam d’escota <em>(YouTube — cargat pas qu’al clic)</em>
					<input type="text" bind:value={forma.embed_url} placeholder="https://www.youtube.com/watch?v=…" />
				</label>
				{#if avisEmbed}
					<p class="ajuda" class:pas-bon={!avisEmbed.ok}>{avisEmbed.text}</p>
				{/if}

				<label>
					Ont ne saber mai <em>(librariá occitana de preferéncia)</em>
					<input type="text" bind:value={forma.ligam} placeholder="https://www.libraria-occitana.org/…" />
				</label>

				<label>
					Adreça de l’imatge <em>(facultativa)</em>
					<input type="text" bind:value={forma.imatge_url} />
				</label>
				<p class="ajuda">
					A emplenar sonque se as lo drech d’emplegar l’imatge : flux partenari d’una librariá,
					dorsièr de premsa, acòrd de l’editor. Dins lo dobte, daissa void — la fisha se mòstra
					plan sens.
					<em
						>(À remplir seulement si tu as le droit d’utiliser l’image. Dans le doute, laisse
						vide.)</em
					>
				</p>

				<label>
					Ton comentari <em>(çò qu’as a ne dire)</em>
					<textarea bind:value={forma.comentari} rows="4" maxlength="900"></textarea>
				</label>

				<label class="casa">
					<input type="checkbox" bind:checked={forma.publicat} />
					<span>Publicada <em>(visible pels visitaires)</em></span>
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
	{:else if !obras.length}
		<p class="msg info">Cap d’òbra pel moment. <em>(Aucune œuvre pour le moment.)</em></p>
	{:else}
		<ul class="lista">
			{#each obras as o, i (o.id)}
				<li class:rescondut={!o.publicat}>
					<div class="tèxte">
						<strong>{o.titre}</strong>
						<span class="meta">
							{o.autor} · {MENAS.find((m) => m.id === o.mena)?.oc ?? o.mena}
							{#if o.embed_url && idYoutube(o.embed_url)}· escota{/if}
							{#if o.ligam}· {ostePropre(o.ligam)}{/if}
							{#if !o.publicat}· <span class="pas-publicat">pas publicada</span>{/if}
						</span>
					</div>

					<div class="rang">
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(o, -1)}
							disabled={i === 0}
							aria-label="Montar « {o.titre} »">↑</button
						>
						<button
							type="button"
							class="btn-icòna"
							onclick={() => desplaçar(o, 1)}
							disabled={i === obras.length - 1}
							aria-label="Davalar « {o.titre} »">↓</button
						>
					</div>

					{#if confirmaSup === o.id}
						<div class="accions-linha">
							<span class="segur">Segur ?</span>
							<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(o)}
								>Òc, suprimir</button
							>
							<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}
								>Non</button
							>
						</div>
					{:else}
						<div class="accions-linha">
							<button type="button" class="btn-segond" onclick={() => bascularPublicat(o)}>
								{o.publicat ? 'Rescondre' : 'Publicar'}
							</button>
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(o)}
								>Modificar</button
							>
							<button
								type="button"
								class="btn-segond btn-perilhos"
								onclick={() => (confirmaSup = o.id)}
								aria-label="Suprimir « {o.titre} »">Suprimir</button
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

	.regla {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.5;
		background: rgba(107, 124, 50, 0.1);
		color: var(--color-olive);
		padding: 0.7rem 0.9rem;
		border-radius: 10px;
	}

	.regla em {
		opacity: 0.85;
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
		flex: 0 1 7rem;
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

	.ajuda.pas-bon {
		color: var(--color-brick);
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
