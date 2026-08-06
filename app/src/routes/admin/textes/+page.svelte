<script>
	// Tous les textes éditables du site, groupés par endroit. Édition
	// seulement — pas d'ajout ni de suppression : chaque identifiant est
	// attendu tel quel par le code ; en créer un ici ne le ferait apparaître
	// nulle part, en supprimer un ferait retomber le site sur sa valeur de
	// secours sans prévenir.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	// L'aperçu ne touche pas la base : le brouillon est gardé dans CE
	// navigateur (localStorage), et la page d'accueil ouverte avec
	// ?apercebut=1 l'affiche par-dessus les textes publiés. Personne
	// d'autre ne le voit. Enregistrar publie pour tout le monde et efface
	// le brouillon du texte concerné.
	const CLAU_APERCEBUT = 'lo-ligam-apercebut-textes';

	let textes = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let forma = $state(null);
	let enregistrant = $state(false);

	// L'ordre et les titres des groupes suivent la page d'accueil de haut en
	// bas, pour que Romain retrouve chaque texte là où il s'attend à le voir.
	const seccions = [
		{ prefix: 'hero', titol: 'Acuèlh — dintrada', fr: 'Accueil — entrée' },
		{ prefix: 'what', titol: 'Acuèlh — 01 · Qu’es aquò ?', fr: 'Accueil — 01' },
		{ prefix: 'lenga', titol: 'Acuèlh — 02 · L’occitan, uèi', fr: 'Accueil — 02' },
		{ prefix: 'carta', titol: 'Acuèlh — 03 · Lo Mond en occitan', fr: 'Accueil — 03' },
		{ prefix: 'officialitat', titol: 'Acuèlh — 04 · Oficialitat', fr: 'Accueil — 04' },
		{ prefix: 'footer', titol: 'Pè de pagina', fr: 'Pied de page' }
	];

	let grops = $derived.by(() => {
		const dins = new Set();
		const grops = seccions
			.map((s) => {
				const linhas = textes.filter((t) => t.id.startsWith(s.prefix + '_'));
				for (const l of linhas) dins.add(l.id);
				return { ...s, linhas };
			})
			.filter((g) => g.linhas.length);
		const orfanèls = textes.filter((t) => !dins.has(t.id));
		if (orfanèls.length) {
			grops.push({ prefix: '_autres', titol: 'Autres', fr: 'Autres', linhas: orfanèls });
		}
		return grops;
	});

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const { data, error } = await supabase.from('site_textes').select('*').order('id');
		cargant = false;
		if (error) {
			msg = { tipe: 'error', text: error.message };
			return;
		}
		textes = data;
	}

	function obrirEdicion(t) {
		msg = null;
		forma = { id: t.id, oc: t.oc, fr: t.fr, nòta: t.nòta };
	}

	function legirBrolhons() {
		try {
			return JSON.parse(localStorage.getItem(CLAU_APERCEBUT) ?? '{}');
		} catch {
			return {};
		}
	}

	function apercebut() {
		const oc = forma.oc.trim();
		const fr = forma.fr.trim();
		if (!oc || !fr) {
			msg = { tipe: 'error', text: 'Cal las doas versions per l’apercebut.' };
			return;
		}
		const brolhons = legirBrolhons();
		brolhons[forma.id] = { oc, fr };
		localStorage.setItem(CLAU_APERCEBUT, JSON.stringify(brolhons));
		window.open('/?apercebut=1', '_blank', 'noopener');
	}

	function escafarBrolhon(id) {
		const brolhons = legirBrolhons();
		if (id in brolhons) {
			delete brolhons[id];
			localStorage.setItem(CLAU_APERCEBUT, JSON.stringify(brolhons));
		}
	}

	async function enregistrar() {
		const oc = forma.oc.trim();
		const fr = forma.fr.trim();
		if (!oc || !fr) {
			msg = { tipe: 'error', text: 'Cal las doas versions, occitana e francesa.' };
			return;
		}
		enregistrant = true;
		try {
			const r = await supabase.from('site_textes').update({ oc, fr }).eq('id', forma.id).select();
			if (r.error) throw r.error;
			if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			escafarBrolhon(forma.id);
			forma = null;
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat. Lo site aficha lo nòu tèxte tre ara.' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			enregistrant = false;
		}
	}
</script>

<svelte:head>
	<title>Tèxtes — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<h1>Tèxtes del site</h1>
	<p class="subtitle">
		Cada tèxte visible, dins las doas lengas. Modifica e enregistra : lo site seguís.
		<em>(Chaque texte visible, dans les deux langues. Modifie et enregistre : le site suit.)</em>
	</p>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>Modificar</h2>
			{#if forma.nòta}
				<p class="ont">{forma.nòta}</p>
			{/if}
			<div class="camps">
				<label>
					Occitan
					<textarea bind:value={forma.oc} rows="3" required></textarea>
				</label>
				<label>
					Francés
					<textarea bind:value={forma.fr} rows="3" required></textarea>
				</label>
			</div>
			<div class="accions">
				<button type="submit" class="btn-primary" disabled={enregistrant}>
					{enregistrant ? '…' : 'Enregistrar'}
				</button>
				<button type="button" class="btn-segond" onclick={apercebut} disabled={enregistrant}>
					Apercebut
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={() => (forma = null)}
					disabled={enregistrant}>Anullar</button
				>
			</div>
			<p class="ajuda">
				« Apercebut » dobrís l'acuèlh amb aqueste tèxte, vesedor sonque per tu — res es pas
				enregistrat tant que quiches pas « Enregistrar ».
				<em
					>(« Aperçu » ouvre l'accueil avec ce texte, visible seulement par toi — rien n'est
					enregistré tant que tu ne cliques pas « Enregistrer ».)</em
				>
			</p>
		</form>
	{/if}

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else if !textes.length}
		<p class="msg info">
			Cap de tèxte. Cal aver executat supabase-textes-schema.sql dins Supabase.
			<em>(Aucun texte : il faut d'abord exécuter supabase-textes-schema.sql dans Supabase.)</em>
		</p>
	{:else}
		{#each grops as grop (grop.prefix)}
			<div class="grop">
				<h2>{grop.titol}</h2>
				<ul class="lista">
					{#each grop.linhas as t (t.id)}
						<li>
							<div class="tèxte">
								<strong>{t.oc}</strong>
								<span class="meta">{t.nòta ?? t.id}</span>
							</div>
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(t)}
								>Modificar</button
							>
						</li>
					{/each}
				</ul>
			</div>
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

	.forma {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		background: var(--color-cream);
		border-radius: 16px;
		padding: 1.25rem;
	}

	.ont {
		margin: -0.4rem 0 0;
		font-size: 0.8rem;
		color: var(--color-olive);
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

	.camps {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		background: white;
		color: var(--color-text);
		resize: vertical;
	}

	.accions {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.grop {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	.tèxte {
		flex: 1 1 14rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.tèxte strong {
		font-size: 0.92rem;
		color: var(--color-text);
		overflow-wrap: anywhere;
	}

	.meta {
		font-size: 0.76rem;
		color: var(--color-teal);
	}
</style>
