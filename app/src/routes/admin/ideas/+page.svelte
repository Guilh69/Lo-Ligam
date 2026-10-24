<script>
	// Les idées reçues dans la boîte à idées (2026-10-25). Romain lit le
	// texte, change l'état, répond (l'auteur voit la réponse sur /ideas) ou
	// supprime. Il ne voit pas qui a écrit : la page ne demande que le texte.
	// À chaque visite, les idées de plus de deux ans sont effacées
	// (public.purgar_ideas, promesse de la page Confidentialité).
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	const ESTATS = [
		['nòva', 'Nòva', 'Nouvelle'],
		['legida', 'Legida', 'Lue'],
		['retenguda', 'Retenguda', 'Retenue'],
		['facha', 'Facha', 'Réalisée'],
		['escartada', 'Escartada', 'Écartée']
	];

	let ideas = $state([]);
	let cargant = $state(true);
	let msg = $state(null);
	let filtre = $state('totas');
	let forma = $state(null); // { id, estat, responsa }
	let enregistrant = $state(false);

	let vesedoras = $derived(filtre === 'totas' ? ideas : ideas.filter((i) => i.estat === filtre));
	const compte = (e) => ideas.filter((i) => i.estat === e).length;

	onMount(async () => {
		await supabase.rpc('purgar_ideas');
		await cargar();
	});

	async function cargar() {
		cargant = true;
		const { data, error } = await supabase
			.from('ideas')
			.select('id, tèxte, estat, responsa, created_at')
			.order('created_at', { ascending: false });
		cargant = false;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		ideas = data;
	}

	function obrir(i) {
		msg = null;
		forma = { id: i.id, estat: i.estat === 'nòva' ? 'legida' : i.estat, responsa: i.responsa ?? '' };
	}

	async function enregistrar(e) {
		e.preventDefault();
		if (!forma) return;
		enregistrant = true;
		const responsa = forma.responsa.trim() || null;
		const r = await supabase.from('ideas').update({ estat: forma.estat, responsa }).eq('id', forma.id).select('id');
		enregistrant = false;
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cap de linha cambiada — dreches refusats ?' };
			return;
		}
		forma = null;
		msg = { tipe: 'ok', text: 'Enregistrat. L’autor o vei sus /ideas.' };
		await cargar();
	}

	async function suprimir(id) {
		if (!confirm('Suprimir aquesta idèa ? (Supprimer cette idée ?)')) return;
		const r = await supabase.from('ideas').delete().eq('id', id).select('id');
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'res suprimit' };
			return;
		}
		if (forma?.id === id) forma = null;
		await cargar();
	}

	const data_ = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<svelte:head>
	<title>Idèas — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<h1>Boita d’idèas</h1>
	<p class="subtitle">
		Las idèas mandadas sus /ideas. Sabes pas qual las a escrichas.
		<em>(Les idées envoyées sur /ideas. Tu ne sais pas qui les a écrites.)</em>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	<div class="filtres" role="group" aria-label="Filtrar per estat">
		<button type="button" class="filtre" aria-pressed={filtre === 'totas'} onclick={() => (filtre = 'totas')}
			>Totas ({ideas.length})</button
		>
		{#each ESTATS as [v, oc] (v)}
			<button type="button" class="filtre" aria-pressed={filtre === v} onclick={() => (filtre = v)}
				>{oc} ({compte(v)})</button
			>
		{/each}
	</div>

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else if !vesedoras.length}
		<p class="msg info">Cap d’idèa aicí. <em>(Aucune idée ici.)</em></p>
	{:else}
		<ul class="lista">
			{#each vesedoras as i (i.id)}
				<li class:nòva={i.estat === 'nòva'}>
					<div class="meta">
						<span class="estat">{ESTATS.find((e) => e[0] === i.estat)?.[1]}</span>
						<span>{data_(i.created_at)}</span>
					</div>
					<p class="tèxte">{i.tèxte}</p>
					{#if forma?.id === i.id}
						<form class="forma" onsubmit={enregistrar}>
							<label>
								Estat <em>(état)</em>
								<select bind:value={forma.estat}>
									{#each ESTATS as [v, oc, frc] (v)}<option value={v}>{oc} · {frc}</option>{/each}
								</select>
							</label>
							<label>
								Responsa, vesedora per l’autor <em>(réponse, visible par l’auteur)</em>
								<textarea bind:value={forma.responsa} rows="3" maxlength="2000"></textarea>
							</label>
							<div class="accions">
								<button type="submit" class="btn-primary" disabled={enregistrant}>{enregistrant ? '…' : 'Enregistrar'}</button>
								<button type="button" class="btn-segond" onclick={() => (forma = null)} disabled={enregistrant}>Anullar</button>
							</div>
						</form>
					{:else}
						{#if i.responsa}<p class="responsa">↳ {i.responsa}</p>{/if}
						<div class="accions">
							<button type="button" class="btn-segond" onclick={() => obrir(i)}>Legir e respondre</button>
							<button type="button" class="btn-segond" onclick={() => suprimir(i.id)}>Suprimir</button>
						</div>
					{/if}
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
	.subtitle em,
	label em {
		opacity: 0.8;
		font-weight: 400;
	}
	.filtres {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.filtre {
		min-height: 36px;
		padding: 0.35rem 0.85rem;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		border-radius: 999px;
		background: white;
		color: var(--color-text);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.filtre[aria-pressed='true'] {
		border-color: var(--color-teal);
		background: var(--color-teal);
		color: white;
	}
	.lista {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.lista li {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.9rem;
		border-radius: 12px;
		background: var(--color-cream);
	}
	/* une idée pas encore lue se repère d'un liseré */
	.lista li.nòva {
		box-shadow: inset 4px 0 0 var(--color-teal);
	}
	.meta {
		display: flex;
		gap: 0.75rem;
		font-size: 0.78rem;
		color: var(--color-teal);
	}
	.estat {
		font-weight: 700;
	}
	.tèxte {
		margin: 0;
		color: var(--color-text);
		line-height: 1.5;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.responsa {
		margin: 0;
		font-size: 0.88rem;
		color: var(--color-olive);
		white-space: pre-line;
	}
	.forma {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.forma label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-text);
	}
	select,
	textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.55rem 0.7rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: white;
		color: var(--color-text);
	}
	textarea {
		resize: vertical;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
