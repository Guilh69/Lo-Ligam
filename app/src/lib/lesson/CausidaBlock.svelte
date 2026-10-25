<script>
	// Dialogue à choix (catalogue des exercices §3, priorité 3) : un
	// personnage parle, l'élève choisit sa réplique parmi deux ou trois. Une
	// réplique qui ne va pas fait réagir le personnage (une ligne, jamais une
	// punition) et l'on choisit de nouveau ; la bonne s'affiche dans la
	// conversation et le personnage enchaîne. Chaque tour réussi du premier
	// coup note « je reconnais » dans le carnet (onResult).
	//
	// block = { title, intro, personatge, tours: [{ situacion?, ditz?,
	//   options: [{ oc, bon?, reaccion? }], choses?, explain? }], fin? }
	import { tick } from 'svelte';
	import { rich } from '$lib/lesson/rich.js';

	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	function melanger(n) {
		const o = Array.from({ length: n }, (_, i) => i);
		for (let i = n - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[o[i], o[j]] = [o[j], o[i]];
		}
		return o;
	}

	let states = $state(
		block.tours.map((t) => ({ done: false, choix: null, faux: [], reaccion: null, ordre: melanger(t.options.length) }))
	);
	let doneCount = $derived(states.filter((s) => s.done).length);
	let visibleCount = $derived(Math.min(doneCount + 1, block.tours.length));
	let fini = $derived(doneCount === block.tours.length);
	let fin = $state(null);

	async function causir(ti, oi) {
		const st = states[ti];
		const opt = block.tours[ti].options[oi];
		if (st.done) return;
		if (opt.bon) {
			st.done = true;
			st.choix = oi;
			st.reaccion = null;
			onCorrect();
			onResult(block.tours[ti], st.faux.length === 0);
			if (states.every((s) => s.done)) onComplete();
			await tick();
			fin?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
		} else {
			if (!st.faux.includes(oi)) st.faux.push(oi);
			st.reaccion = opt.reaccion ?? 'Hum… essaie une autre réplique.';
		}
	}
</script>

<section class="block">
	<header class="block-head">
		<h3 class="block-title">{block.title}</h3>
		<span class="counter" aria-label="Progression du dialogue">{doneCount}/{block.tours.length}</span>
	</header>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	<ol class="fil" aria-live="polite">
		{#each block.tours.slice(0, visibleCount) as tour, ti}
			{@const st = states[ti]}
			{#if tour.situacion}
				<li class="situacion">{@html rich(tour.situacion)}</li>
			{/if}
			{#if tour.ditz}
				<li class="bulle eux">
					<span class="qui">{block.personatge}</span>
					<span lang="oc">{tour.ditz}</span>
				</li>
			{/if}
			{#if st.done}
				<li class="bulle tu">
					<span class="qui">Tu</span>
					<span lang="oc">{tour.options[st.choix].oc}</span>
				</li>
				{#if tour.explain}<li class="explain">✓ {@html rich(tour.explain)}</li>{/if}
			{:else}
				<li class="choix">
					<span class="consigne">Ta réplique :</span>
					<div class="options">
						{#each st.ordre as oi}
							<button
								type="button"
								class="opt"
								class:faux={st.faux.includes(oi)}
								disabled={st.faux.includes(oi)}
								lang="oc"
								onclick={() => causir(ti, oi)}
							>
								{tour.options[oi].oc}
							</button>
						{/each}
					</div>
					{#if st.reaccion}
						<p class="reaccion">{@html rich(st.reaccion)}</p>
					{/if}
				</li>
			{/if}
		{/each}
	</ol>

	{#if fini && block.fin}
		<p class="fin" bind:this={fin}>{@html rich(block.fin)}</p>
	{:else}
		<span bind:this={fin}></span>
	{/if}
</section>

<style>
	.block {
		background: var(--l-carta);
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
		color: var(--l-marca);
	}

	.counter {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--l-teal);
		white-space: nowrap;
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
		line-height: 1.5;
	}

	.fil {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.situacion {
		align-self: center;
		max-width: 90%;
		font-size: 0.85rem;
		color: color-mix(in srgb, var(--t-tinta) 65%, transparent);
		text-align: center;
		font-style: italic;
	}

	.bulle {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		max-width: 82%;
		padding: 0.55rem 0.9rem;
		border-radius: 16px;
		line-height: 1.45;
		animation: arriva 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.bulle.eux {
		align-self: flex-start;
		background: color-mix(in srgb, var(--l-teal) 10%, var(--l-carta));
		border-bottom-left-radius: 4px;
	}

	.bulle.tu {
		align-self: flex-end;
		background: rgba(238, 175, 52, 0.22);
		border-bottom-right-radius: 4px;
		text-align: right;
	}

	.qui {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--l-teal);
	}

	.bulle.tu .qui {
		color: var(--l-marca);
	}

	.choix {
		align-self: flex-end;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.35rem;
		max-width: 92%;
	}

	.consigne {
		font-size: 0.78rem;
		color: color-mix(in srgb, var(--t-tinta) 60%, transparent);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.45rem;
	}

	.opt {
		border: 1.5px dashed color-mix(in srgb, var(--l-marca) 50%, var(--l-carta));
		background: var(--l-carta);
		border-radius: 14px;
		padding: 0.5rem 0.85rem;
		font-size: 0.95rem;
		color: var(--t-tinta);
		cursor: pointer;
		transition: transform 150ms ease, border-color 150ms ease, background 150ms ease;
	}

	.opt:hover:not(:disabled) {
		transform: translateY(-1px);
		border-style: solid;
		border-color: var(--l-marca);
	}

	.opt.faux {
		border-color: transparent;
		background: color-mix(in srgb, var(--t-tinta) 5%, transparent);
		color: color-mix(in srgb, var(--t-tinta) 40%, transparent);
		text-decoration: line-through;
		cursor: default;
	}

	.reaccion {
		margin: 0;
		max-width: 100%;
		font-size: 0.86rem;
		color: color-mix(in srgb, var(--t-tinta) 75%, transparent);
		text-align: right;
		animation: arriva 260ms ease-out;
	}

	.explain {
		align-self: flex-end;
		font-size: 0.82rem;
		color: var(--l-bon);
		text-align: right;
		max-width: 90%;
	}

	.fin {
		margin: 1rem 0 0;
		padding-top: 0.8rem;
		border-top: 1px dashed color-mix(in srgb, var(--t-tinta) 15%, transparent);
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--t-tinta);
	}

	@keyframes arriva {
		from { opacity: 0; transform: translateY(6px) scale(0.97); }
		to { opacity: 1; transform: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.bulle, .reaccion { animation: none; }
		.opt { transition: none; }
	}
</style>
