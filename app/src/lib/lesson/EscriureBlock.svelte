<script>
	// Écrire au clavier (décision du 2026-10-25) : un item à la fois, une
	// rangée de lettres accentuées à toucher au-dessus du champ, correction
	// tolérante en A1 (escriure.js). Après deux essais, la réponse peut se
	// montrer : l'item compte alors comme « pas encore » dans le carnet.
	// block.recap : à la fin, les phrases de l'élève sont rassemblées (sa
	// présentation, sa liste…), à recopier ou à dire à voix haute.
	import { tick } from 'svelte';
	import { rich } from '$lib/lesson/rich.js';
	import { corregir, remarca, LETRAS } from '$lib/lesson/escriure.js';

	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	const uid = $props.id();
	let states = $state(
		block.items.map(() => ({ saisie: '', essais: 0, statut: null, modele: null, remarca: null, montre: false, shake: false }))
	);
	let doneCount = $derived(states.filter((s) => s.statut === 'just' || s.statut === 'quasi' || s.montre).length);
	let visibleCount = $derived(Math.min(doneCount + 1, block.items.length));
	let fini = $derived(doneCount === block.items.length);
	let champs = $state([]);

	// « Cossí vas ? » → « Cossí vas » dans la remarque, pour qu'elle se lise bien.
	const sensPonch = (t) => String(t ?? '').replace(/[\s?!.…]+$/u, '');
	const fait = (st) => st.statut === 'just' || st.statut === 'quasi' || st.montre;

	async function verificar(i) {
		const st = states[i];
		if (fait(st)) return;
		const r = corregir(st.saisie, block.items[i]);
		if (r.statut === 'non') {
			st.essais += 1;
			st.statut = 'non';
			st.shake = true;
			setTimeout(() => (st.shake = false), 300);
			return;
		}
		st.statut = r.statut;
		st.modele = r.modele;
		// Sans accent : le texte rassemblé garde la bonne graphie (le début
		// attendu est corrigé, le prénom ou la ville restent ceux de l'élève).
		if (r.statut === 'quasi') {
			const saisie = st.saisie.trim();
			st.saisie = block.items[i].debut?.includes(r.modele) ? r.modele + saisie.slice(r.modele.length) : r.modele;
			st.remarca = remarca(saisie.slice(0, r.modele.length), r.modele);
		}
		onCorrect();
		onResult(block.items[i], st.essais === 0);
		suivant(i);
	}

	function montrar(i) {
		const st = states[i];
		st.montre = true;
		st.modele = block.items[i].answers?.[0] ?? block.items[i].debut?.[0] ?? '';
		onResult(block.items[i], false);
		suivant(i);
	}

	async function suivant(i) {
		if (states.every(fait)) {
			onComplete();
			return;
		}
		await tick();
		champs[i + 1]?.focus({ preventScroll: true });
	}

	// La lettre s'insère là où est le curseur, sans fermer le clavier du
	// téléphone (le bouton ne prend pas le focus).
	function inserir(i, letra) {
		const el = champs[i];
		const st = states[i];
		if (!el || fait(st)) return;
		const debut = el.selectionStart ?? st.saisie.length;
		const fin = el.selectionEnd ?? debut;
		st.saisie = st.saisie.slice(0, debut) + letra + st.saisie.slice(fin);
		tick().then(() => {
			el.focus();
			el.setSelectionRange(debut + letra.length, debut + letra.length);
		});
	}

	// Le texte rassemblé : ce que l'élève a écrit, ou le modèle s'il l'a fait montrer.
	let recapitulatiu = $derived(
		states.map((s, i) => (s.montre ? s.modele : s.saisie.trim())).filter(Boolean)
	);
</script>

<section class="block">
	<header class="block-head">
		<h3 class="block-title">{block.title}</h3>
		<span class="counter" aria-label="Progression de l'exercice">{doneCount}/{block.items.length}</span>
	</header>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	{#each block.items.slice(0, visibleCount) as item, i}
		{@const st = states[i]}
		<div class="item" class:shake={st.shake}>
			<p class="question"><span class="num">{i + 1}</span> {@html rich(item.consigne)}</p>
			{#if !fait(st)}
				<div class="letras" role="group" aria-label="Lettres accentuées">
					{#each LETRAS as l}
						<button type="button" class="letra" onmousedown={(e) => e.preventDefault()} onclick={() => inserir(i, l)} aria-label="Ajouter {l}">{l}</button>
					{/each}
				</div>
			{/if}
			<form
				class="ligne"
				onsubmit={(e) => {
					e.preventDefault();
					verificar(i);
				}}
			>
				<input
					bind:this={champs[i]}
					bind:value={st.saisie}
					class="champ"
					class:ok={fait(st)}
					type="text"
					lang="oc"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					readonly={fait(st)}
					aria-label="Ta réponse en occitan"
					aria-describedby="{uid}-{i}"
				/>
				{#if !fait(st)}
					<button type="submit" class="verif" disabled={!st.saisie.trim()}>Verificar</button>
				{/if}
			</form>
			<p class="retorn" id="{uid}-{i}" aria-live="polite">
				{#if st.statut === 'just'}
					<span class="bon">✓ {@html rich(item.explain ?? 'Òsca ! (bravo !)')}</span>
				{:else if st.statut === 'quasi'}
					<span class="bon">✓ Presque ! On écrit <em>{sensPonch(st.modele)}</em>, {st.remarca === 'accent' ? 'avec l’accent' : 'avec le trait d’union'}. {@html item.explain ? rich(item.explain) : ''}</span>
				{:else if st.montre}
					<span class="montre">La réponse : <em>{sensPonch(st.modele)}</em>{item.debut ? ' + ce que tu veux' : ''}. {@html item.explain ? rich(item.explain) : ''}</span>
				{:else if st.statut === 'non'}
					<span class="pas-encara">Pas encore{item.indici ? ' : ' : '.'}{@html item.indici ? rich(item.indici) : ''}</span>
					{#if st.essais >= 2}
						<button type="button" class="veire" onclick={() => montrar(i)}>Veire la responsa <em>(voir la réponse)</em></button>
					{/if}
				{/if}
			</p>
		</div>
	{/each}

	{#if fini && block.recap}
		<div class="recap">
			<p class="recap-titre">{block.recap}</p>
			<p class="recap-texte" lang="oc">{recapitulatiu.join(' ')}</p>
		</div>
	{/if}
</section>

<style>
	.block {
		background: white;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
	}

	.block-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.counter {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-teal);
		white-space: nowrap;
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: rgba(58, 42, 32, 0.75);
		line-height: 1.5;
	}

	.item {
		margin-top: 1.1rem;
		animation: fade-in 350ms ease-out;
	}

	.question {
		margin: 0 0 0.5rem;
		line-height: 1.55;
		color: var(--color-text);
	}

	.num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		margin-right: 0.35rem;
		border-radius: 50%;
		background: rgba(238, 175, 52, 0.25);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.75rem;
		color: var(--color-text);
	}

	.letras {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-bottom: 0.4rem;
	}

	.letra {
		min-width: 2.2rem;
		height: 2.2rem;
		border: 1.5px solid rgba(58, 42, 32, 0.15);
		border-radius: 10px;
		background: var(--color-cream, #fbf6ec);
		font-size: 1.05rem;
		color: var(--color-text);
		cursor: pointer;
		transition: transform 120ms ease, border-color 120ms ease;
	}

	.letra:hover {
		border-color: var(--color-teal);
		transform: translateY(-1px);
	}

	.ligne {
		display: flex;
		gap: 0.5rem;
	}

	.champ {
		flex: 1;
		min-width: 0;
		border: 1.5px solid rgba(58, 42, 32, 0.22);
		border-radius: 12px;
		padding: 0.55rem 0.8rem;
		font: inherit;
		font-size: 1.02rem;
		color: var(--color-text);
		background: white;
	}

	.champ:focus {
		outline: 2px solid var(--color-teal);
		outline-offset: 1px;
	}

	.champ.ok {
		background: rgba(238, 175, 52, 0.15);
		border-color: var(--color-gold);
		font-weight: 600;
	}

	.verif {
		border: none;
		border-radius: 12px;
		padding: 0 1rem;
		background: var(--color-brick);
		color: white;
		font-family: var(--font-heading);
		font-weight: 600;
		cursor: pointer;
	}

	.verif:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.retorn {
		margin: 0.5rem 0 0;
		font-size: 0.88rem;
		line-height: 1.5;
		min-height: 1.2em;
	}

	.bon {
		color: var(--color-olive, #6b7a3a);
	}

	.montre {
		color: var(--color-text);
	}

	.pas-encara {
		color: rgba(58, 42, 32, 0.7);
	}

	.veire {
		display: block;
		margin-top: 0.4rem;
		border: none;
		background: none;
		padding: 0;
		color: var(--color-teal);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		cursor: pointer;
	}

	.recap {
		margin-top: 1.3rem;
		padding: 1rem 1.1rem;
		border-radius: 14px;
		background: rgba(238, 175, 52, 0.14);
		animation: fade-in 450ms ease-out;
	}

	.recap-titre {
		margin: 0 0 0.35rem;
		font-family: var(--font-heading);
		font-weight: 600;
		color: var(--color-brick);
	}

	.recap-texte {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--color-text);
	}

	.shake {
		animation: shake 260ms ease;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		30% { transform: translateX(-4px); }
		60% { transform: translateX(4px); }
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.item, .shake, .recap { animation: none; }
		.letra { transition: none; }
	}
</style>
