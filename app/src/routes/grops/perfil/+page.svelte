<script>
	// Son propre profil (2026-10-25) : ce que les autres membres vérifiés
	// verront, écrit librement, et l'état de sa vérification. Les réponses
	// du questionnaire d'accueil (âge, genre, profession) n'y paraissent pas.
	import Icona from '$lib/components/Icona.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, DIALECTES, NIVELS, cargarIeu } from '$lib/grops/grops.svelte.js';
	import Avatar from '$lib/grops/Avatar.svelte';

	let fr = $derived(langStore.current === 'fr');
	const MAX = 600;
	const X = {
		oc: {
			titol: 'Mon perfil',
			tornar: 'Tornar a la lista',
			estats: {
				en_espèra: 'Ton perfil es en espèra : la moderacion lo legís lèu. Pòdes ja legir los grops.',
				verificat: 'Ton perfil es verificat : los autres membres lo veson.',
				refusat: 'Ton perfil es pas estat acceptat. Pòdes escriure a la moderacion :'
			},
			contacte: 'Contacte',
			presentacion: 'Presentacion',
			presentacion_ajuda: 'Çò que vòls : d’ont venes, perqué l’occitan, çò que t’agrada…',
			ont: 'D’ont',
			ont_ajuda: 'Una vila, un país, o res.',
			dialecte: 'Dialècte',
			nivel: 'Nivèl',
			cap: '(cap)',
			enregistrar: 'Enregistrar',
			enregistrat: 'Enregistrat.',
			veire: 'Veire mon perfil',
			questionnaire: 'Per començar, causís un pseudonim.',
			causir: 'Causir un pseudonim',
			perfil_mot: 'Un mot es pas possible dins un perfil.',
			perfil_ligam: 'Pas de ligams dins un perfil.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			titol: 'Mon profil',
			tornar: 'Retour à la liste',
			estats: {
				en_espèra: 'Ton profil est en attente : la modération le lit bientôt. Tu peux déjà lire les groupes.',
				verificat: 'Ton profil est vérifié : les autres membres le voient.',
				refusat: 'Ton profil n’a pas été accepté. Tu peux écrire à la modération :'
			},
			contacte: 'Contact',
			presentacion: 'Présentation',
			presentacion_ajuda: 'Ce que tu veux : d’où tu viens, pourquoi l’occitan, ce que tu aimes…',
			ont: 'D’où',
			ont_ajuda: 'Une ville, un pays, ou rien.',
			dialecte: 'Dialecte',
			nivel: 'Niveau',
			cap: '(aucun)',
			enregistrar: 'Enregistrer',
			enregistrat: 'Enregistré.',
			veire: 'Voir mon profil',
			questionnaire: 'Pour commencer, choisis un pseudo.',
			causir: 'Choisir un pseudo',
			perfil_mot: 'Un mot n’est pas possible dans un profil.',
			perfil_ligam: 'Pas de liens dans un profil.',
			error: 'Une erreur : réessaie.'
		}
	};
	let x = $derived(fr ? X.fr : X.oc);

	let cargat = $state(false);
	let existís = $state(false);
	let f = $state({ presentacion: '', ont: '', dialecte: '', nivel: '' });
	let enregistrant = $state(false);
	let enregistrat = $state(false);
	let error = $state(null);

	$effect(() => {
		if (!grops.uid) return;
		supabase
			.from('profiles')
			.select('presentacion, ont, dialecte, nivel')
			.eq('user_id', grops.uid)
			.maybeSingle()
			.then(({ data }) => {
				existís = !!data;
				if (data)
					f = {
						presentacion: data.presentacion ?? '',
						ont: data.ont ?? '',
						dialecte: data.dialecte ?? '',
						nivel: data.nivel ?? ''
					};
				cargat = true;
			});
	});

	async function enregistrar(e) {
		e.preventDefault();
		enregistrant = true;
		enregistrat = false;
		error = null;
		const { error: err } = await supabase
			.from('profiles')
			.update({
				presentacion: f.presentacion.trim() || null,
				ont: f.ont.trim() || null,
				dialecte: f.dialecte || null,
				nivel: f.nivel || null
			})
			.eq('user_id', grops.uid);
		enregistrant = false;
		if (err) error = /perfil_mot|perfil_ligam/.exec(err.message)?.[0] ?? 'error';
		else {
			enregistrat = true;
			cargarIeu();
		}
	}
</script>

<svelte:head>
	<title>{x.titol} · Lo Ligam</title>
</svelte:head>

<div class="perfil">
	<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
	<header>
		<Avatar pseudo={grops.ieu?.pseudo ?? '…'} id={grops.uid ?? ''} size="4rem" />
		<div>
			<h2>{x.titol}</h2>
			{#if grops.ieu}<p class="pseudo">{grops.ieu.pseudo}</p>{/if}
		</div>
	</header>

	{#if grops.ieu}
		<p class="estat estat-{grops.ieu.verificacion}" role="status">
			{x.estats[grops.ieu.verificacion]}
			{#if grops.ieu.verificacion === 'refusat'}<a href="/contacte">{x.contacte}</a>{/if}
		</p>
	{/if}

	{#if cargat && !existís}
		<p>{x.questionnaire}</p>
		<a class="boton" href="/compte/questionnaire">{x.causir}</a>
	{:else if cargat}
		<form onsubmit={enregistrar}>
			<label class="camp">
				<span>{x.presentacion}</span>
				<small id="perfil-presentacion">{x.presentacion_ajuda}</small>
				<textarea bind:value={f.presentacion} rows="5" maxlength={MAX} aria-describedby="perfil-presentacion"></textarea>
				<small class="comptador">{f.presentacion.length} / {MAX}</small>
			</label>
			<label class="camp">
				<span>{x.ont}</span>
				<small id="perfil-ont">{x.ont_ajuda}</small>
				<input type="text" bind:value={f.ont} maxlength="80" aria-describedby="perfil-ont" />
			</label>
			<label class="camp">
				<span>{x.dialecte}</span>
				<select bind:value={f.dialecte}>
					<option value="">{x.cap}</option>
					{#each DIALECTES as [v, oc, fr_] (v)}<option value={v}>{fr ? fr_ : oc}</option>{/each}
				</select>
			</label>
			<fieldset class="camp">
				<legend>{x.nivel}</legend>
				<div class="nivels">
					{#each NIVELS as [v, oc, fr_] (v)}
						<label class="nivel"><input type="radio" name="nivel" value={v} bind:group={f.nivel} /> {fr ? fr_ : oc}</label>
					{/each}
				</div>
			</fieldset>
			<div class="accions">
				<button type="submit" class="boton" disabled={enregistrant}>{enregistrant ? '…' : x.enregistrar}</button>
				{#if grops.ieu?.verificacion === 'verificat'}
					<a class="secondari" href="/grops/perfil/{encodeURIComponent(grops.ieu.pseudo)}">{x.veire}</a>
				{/if}
			</div>
			{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
			{#if enregistrat}<p class="mercé" role="status">{x.enregistrat}</p>{/if}
		</form>
	{/if}
</div>

<style>
	.perfil {
		display: grid;
		align-content: start;
		gap: var(--esp-24);
		max-width: 38rem;
		padding: var(--esp-24);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: -0.5rem 0 -1rem -0.6rem;
		color: inherit;
	}
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
	}
	header {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1.05;
	}
	.pseudo {
		margin: 2px 0 0;
		color: var(--t-tinta-2);
	}
	/* l'état : un trait d'or quand il attend ou qu'il est refusé */
	.estat {
		margin: 0;
		padding: var(--esp-8) var(--esp-12);
		border-left: 4px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
		line-height: 1.5;
	}
	.estat-verificat {
		border-left-color: var(--t-linha);
		background: none;
		color: var(--t-tinta-2);
	}
	.estat a {
		color: inherit;
		font-weight: 700;
	}
	form {
		display: grid;
		gap: var(--esp-24);
	}
	.camp {
		display: grid;
		gap: var(--esp-4);
		margin: 0;
		padding: 0;
		border: 0;
	}
	.camp > span,
	legend {
		font-weight: 700;
	}
	legend {
		margin-bottom: var(--esp-4);
	}
	small {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}
	.comptador {
		justify-self: end;
		font-variant-numeric: tabular-nums;
	}
	textarea,
	input[type='text'],
	select {
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.45 var(--font-body);
	}
	textarea {
		resize: vertical;
	}
	.nivels {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	.nivel {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 40px;
		padding: 0.3rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		cursor: pointer;
	}
	.nivel:has(input:checked) {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.nivel input {
		accent-color: var(--t-aur);
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-12);
	}
	.boton {
		justify-self: start;
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
	}
	.boton:hover {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.6;
	}
	.secondari {
		display: inline-flex;
		align-items: center;
		min-height: 40px;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: inherit;
		text-decoration: none;
	}
	.secondari:hover {
		border-color: var(--t-aur);
	}
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.tornar:focus-visible,
	textarea:focus-visible,
	input:focus-visible,
	select:focus-visible,
	.boton:focus-visible,
	.secondari:focus-visible,
	.estat a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
</style>
