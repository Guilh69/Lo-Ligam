<script>
	// Remarques de relecture posées sur la page, comme des commentaires sur
	// Word (Romain, 2026-10-25, option A). On touche « Remarca », puis
	// l'endroit qui gêne ; une bulle s'ouvre, on dicte ou on tape, on envoie.
	// La remarque garde sa place : module, étape, exercice (data-bloc), et le
	// texte touché. Claude les lit avec scripts/remarcas.mjs.
	//
	// Visible pour l'administrateur, et pour ses proches quand ils ont ouvert
	// un lien de relecture (?relectura) : le mode reste ensuite allumé dans ce
	// navigateur. Table et verrous : supabase/supabase-remarcas.sql.
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { esAdmin } from '$lib/adminStore';

	let { modul, etapa = null } = $props();

	const CLAU_MODE = 'lo-ligam-relectura';
	const CLAU_AUTOR = 'lo-ligam-relectura-autor';
	const legir = (k) => {
		try {
			return localStorage.getItem(k);
		} catch {
			return null;
		}
	};
	const gardar = (k, v) => {
		try {
			localStorage.setItem(k, v);
		} catch {
			/* stockage indisponible : on redemandera */
		}
	};

	let relectura = $state(false);
	$effect(() => {
		if (!browser) return;
		if (new URLSearchParams(location.search).has('relectura')) gardar(CLAU_MODE, 'on');
		relectura = legir(CLAU_MODE) === 'on';
	});
	let actiu = $derived($esAdmin || relectura);

	// 'repaus' → 'causir' (on touche l'endroit) → 'escriure' (la bulle) → 'mandat'
	let fasa = $state('repaus');
	let cibla = $state(null); // { bloc, titol, extrait }
	let tèxte = $state('');
	let autor = $state('');
	let error = $state('');
	let mandant = $state(false);
	let camp = $state(null);
	let marcat = null;

	function començar() {
		error = '';
		fasa = 'causir';
	}

	function anullar() {
		desmarcar();
		fasa = 'repaus';
		cibla = null;
		tèxte = '';
	}

	function desmarcar() {
		marcat?.classList.remove('remarca-cibla');
		marcat = null;
	}

	// Le texte touché : l'élément de texte le plus proche, sans dépasser 300 signes
	function extraitDe(el) {
		const tèxt = el.closest('p, li, button, td, th, h1, h2, h3, label, text, summary, .chip, .ditz') ?? el;
		return { el: tèxt, t: (tèxt.innerText ?? tèxt.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 300) };
	}

	async function causir(e) {
		if (fasa !== 'causir') return;
		if (e.target.closest('.remarcas')) return;
		e.preventDefault();
		e.stopPropagation();
		const slot = e.target.closest('[data-bloc]');
		const { el, t } = extraitDe(e.target);
		desmarcar();
		marcat = el;
		el.classList.add('remarca-cibla');
		// l'endroit remonte au quart haut de l'écran : la bulle, en bas, ne le cache pas
		const haut = el.getBoundingClientRect().top;
		window.scrollBy({ top: haut - window.innerHeight * 0.22, behavior: 'smooth' });
		cibla = {
			bloc: slot ? Number(slot.dataset.bloc) : null,
			titol: slot?.querySelector('.block-title, h3, h2')?.textContent?.trim().slice(0, 120) ?? null,
			extrait: t
		};
		obrirBulla();
	}

	async function obrirBulla() {
		autor = legir(CLAU_AUTOR) ?? '';
		fasa = 'escriure';
		await tick();
		camp?.focus();
	}

	function generala() {
		cibla = { bloc: null, titol: 'remarque générale', extrait: '' };
		obrirBulla();
	}

	// Le toucher est intercepté avant qu'il n'arrive aux exercices (on ne veut
	// pas répondre à une question en montrant l'endroit)
	$effect(() => {
		if (fasa !== 'causir') return;
		const tòca = (e) => causir(e);
		const clau = (e) => e.key === 'Escape' && anullar();
		document.addEventListener('click', tòca, true);
		document.addEventListener('keydown', clau);
		return () => {
			document.removeEventListener('click', tòca, true);
			document.removeEventListener('keydown', clau);
		};
	});

	async function mandar() {
		if (tèxte.trim().length < 2 || mandant) return;
		mandant = true;
		error = '';
		if (autor.trim()) gardar(CLAU_AUTOR, autor.trim());
		const { error: e } = await supabase.from('remarcas').insert({
			pagina: location.pathname,
			modul: modul.id.replace('modul-', ''),
			etapa,
			bloc: cibla?.bloc ?? null,
			cibla: [cibla?.titol].filter(Boolean).join(' · ').slice(0, 300) || null,
			extrait: cibla?.extrait || null,
			tèxte: tèxte.trim(),
			autor: autor.trim() || null
		});
		mandant = false;
		if (e) {
			error = 'L’envoi n’a pas marché. Réessaie dans un instant.';
			return;
		}
		desmarcar();
		tèxte = '';
		cibla = null;
		fasa = 'mandat';
		chargerLista();
		setTimeout(() => fasa === 'mandat' && (fasa = 'repaus'), 2600);
	}

	// L'administrateur voit les remarques du module et les réponses de Claude
	let lista = $state([]);
	let listaDobèrta = $state(false);
	async function chargerLista() {
		if (!$esAdmin) return;
		const { data } = await supabase
			.from('remarcas')
			.select('id, etapa, bloc, cibla, extrait, tèxte, autor, estat, responsa')
			.eq('modul', modul.id.replace('modul-', ''))
			.order('id');
		lista = data ?? [];
	}
	$effect(() => {
		if ($esAdmin && modul) chargerLista();
	});
	let dubèrtas = $derived(lista.filter((r) => r.estat === 'dubèrta').length);

	async function suprimir(id) {
		await supabase.from('remarcas').delete().eq('id', id);
		chargerLista();
	}
</script>

{#if actiu}
	<div class="remarcas">
		{#if fasa === 'causir'}
			<div class="consigna" role="status">
				<span>Touche l’endroit de ta remarque</span>
				<button type="button" class="ligam" onclick={generala}>Remarque générale</button>
				<button type="button" class="ligam" onclick={anullar}>Anullar</button>
			</div>
		{:else if fasa === 'escriure'}
			<div class="bulla" role="dialog" aria-label="Ta remarque" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && anullar()}>
				{#if cibla?.extrait}
					<p class="sus">Sur : <span class="cita">« {cibla.extrait} »</span></p>
				{:else}
					<p class="sus">Remarque générale sur cette page</p>
				{/if}
				<textarea bind:this={camp} bind:value={tèxte} rows="4" maxlength="2000" placeholder="Ta remarque (tu peux la dicter avec le micro du clavier)" aria-label="Ta remarque"></textarea>
				{#if !$esAdmin}
					<input bind:value={autor} maxlength="60" placeholder="Ton prénom (facultatif)" aria-label="Ton prénom, facultatif" />
				{/if}
				{#if error}<p class="error" role="alert">{error}</p>{/if}
				<div class="accions">
					<button type="button" class="ligam" onclick={anullar}>Anullar</button>
					<button type="button" class="mandar" onclick={mandar} disabled={tèxte.trim().length < 2 || mandant}>Mandar</button>
				</div>
			</div>
		{:else if fasa === 'mandat'}
			<p class="mercé" role="status">Remarca mandada, mercé ! <em>(remarque envoyée, merci !)</em></p>
		{/if}

		{#if listaDobèrta && $esAdmin}
			<div class="lista" role="dialog" aria-label="Remarques de ce module">
				<p class="lista-titol">Remarques de ce module</p>
				{#if !lista.length}<p class="vuèja">Aucune pour l’instant.</p>{/if}
				<ol>
					{#each lista as r (r.id)}
						<li class:tractada={r.estat !== 'dubèrta'}>
							<span class="ont">#{r.id} · {r.etapa != null ? `étape ${r.etapa + 1}` : 'sommaire'}{r.cibla ? ` · ${r.cibla}` : ''}{r.autor ? ` · ${r.autor}` : ''}</span>
							{#if r.extrait}<span class="cita">« {r.extrait} »</span>{/if}
							<span class="t">{r.tèxte}</span>
							{#if r.estat !== 'dubèrta'}<span class="resp">{r.estat === 'tractada' ? '✓ traitée' : 'écartée'}{r.responsa ? ` : ${r.responsa}` : ''}</span>{/if}
							<button type="button" class="ligam petit" onclick={() => suprimir(r.id)}>Suprimir</button>
						</li>
					{/each}
				</ol>
				<button type="button" class="ligam" onclick={() => (listaDobèrta = false)}>Tampar</button>
			</div>
		{/if}

		{#if fasa === 'repaus' || fasa === 'mandat'}
			<div class="botons">
				<button type="button" class="boton" onclick={començar}>
					<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z" /></svg>
					Remarca
				</button>
				{#if $esAdmin && lista.length}
					<button type="button" class="compte" onclick={() => (listaDobèrta = !listaDobèrta)} aria-label="{dubèrtas} remarques ouvertes sur {lista.length}">{dubèrtas}/{lista.length}</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.remarcas {
		position: fixed;
		z-index: 70;
		left: clamp(1rem, 4vw, 3.4rem);
		bottom: calc(1.4rem + env(safe-area-inset-bottom, 0px));
		max-width: min(30rem, calc(100vw - 2rem));
		font-size: 0.92rem;
		color: var(--t-tinta);
	}

	.botons {
		display: flex;
		gap: var(--esp-8);
	}

	.boton,
	.compte {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 1rem;
		border: 1px solid var(--t-aur);
		border-radius: 999px;
		background: var(--t-vel);
		backdrop-filter: blur(8px);
		color: var(--t-tinta);
		font: inherit;
		cursor: pointer;
	}

	.compte {
		padding: 0.55rem 0.8rem;
		font-family: var(--font-heading);
		color: var(--t-aur);
	}

	.boton:hover,
	.compte:hover {
		background: color-mix(in srgb, var(--t-aur) 18%, var(--t-vel));
	}

	.consigna,
	.bulla,
	.lista,
	.mercé {
		margin: 0 0 var(--esp-8);
		padding: var(--esp-12) var(--esp-16);
		border-radius: 12px;
		background: var(--l-carta);
		border: 1px solid var(--t-aur);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
	}

	.consigna {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-8) var(--esp-16);
	}

	.consigna span {
		font-family: var(--font-heading);
		color: var(--t-aur);
	}

	.sus {
		margin: 0 0 var(--esp-8);
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}

	.sus .cita {
		color: var(--t-tinta);
	}

	textarea,
	input {
		box-sizing: border-box;
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: color-mix(in srgb, var(--t-fons) 60%, var(--l-carta));
		color: var(--t-tinta);
		font: inherit;
		resize: vertical;
	}

	input {
		margin-top: var(--esp-8);
	}

	textarea:focus,
	input:focus {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}

	.accions {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: var(--esp-16);
		margin-top: var(--esp-12);
	}

	.mandar {
		padding: 0.5rem 1.3rem;
		border: none;
		border-radius: 6px;
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		font-family: var(--font-heading);
		cursor: pointer;
	}

	.mandar:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.ligam {
		padding: 0;
		border: none;
		background: none;
		color: var(--t-tinta);
		font: inherit;
		text-decoration: underline 2px var(--t-accion);
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.petit {
		font-size: 0.8rem;
	}

	.error {
		margin: var(--esp-8) 0 0;
		color: var(--t-aur);
	}

	.mercé em {
		color: var(--t-tinta-2);
	}

	.lista {
		max-height: 60vh;
		overflow: auto;
	}

	.lista-titol {
		margin: 0 0 var(--esp-8);
		font-family: var(--font-heading);
		color: var(--t-aur);
	}

	.lista ol {
		margin: 0 0 var(--esp-12);
		padding: 0;
		list-style: none;
	}

	.lista li {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: var(--esp-8) 0;
		border-bottom: 1px solid var(--t-linha);
	}

	.lista li.tractada {
		opacity: 0.6;
	}

	.ont,
	.vuèja {
		font-size: 0.78rem;
		color: var(--t-tinta-2);
	}

	.lista .cita {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}

	.resp {
		font-size: 0.85rem;
		color: var(--l-bon);
	}

	.lista li .ligam {
		align-self: flex-start;
	}

	/* l'endroit choisi, encadré tant que la bulle est ouverte */
	:global(.remarca-cibla) {
		outline: 2px dashed var(--t-aur) !important;
		outline-offset: 3px;
		border-radius: 4px;
	}
</style>
