<script>
	// Exercice à choix : un item à la fois, retour immédiat, explication d'une
	// ligne après la bonne réponse (gabarit du cursus §5). L'item suivant
	// n'apparaît qu'une fois l'item courant réussi.
	import { flip } from 'svelte/animate';
	import { rich, insecable } from '$lib/lesson/rich.js';

	// item.ditz = { qui, oc } : quelqu'un te parle (jeu « Escota e causís ») ;
	// la question devient une bulle, et l'on choisit sa réponse.
	// onResult(item, reussi) : une fois l'item trouvé, réussi s'il l'a été du
	// premier coup (le carnet de révision note les choses qu'il teste).
	let { block, onCorrect = () => {}, onComplete = () => {}, onResult = () => {} } = $props();

	// « L'intrús » (type 'intrus', chantier 33, 07-11) : quatre mots, dont un
	// étranger à la famille ; la bonne réponse est l'intrus. Une fois trouvé,
	// les trois autres se rangent ensemble sous le nom de leur famille, et
	// l'intrus reste à l'écart. item = { mots, intrus, familha, explain }.
	const intrus = block.type === 'intrus';
	const items = intrus
		? block.items.map((it) => ({ ...it, options: it.mots, correct: it.intrus }))
		: block.items;
	// les pièces glissent à leur place (sans rebond) ; immobiles si l'appareil
	// demande moins d'animations
	const doux =
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	// L'ordre des options est mélangé à l'affichage (sinon la bonne réponse
	// serait devinable par sa position), sauf Vrai/Faux (noShuffle).
	function shuffled(item) {
		const order = item.options.map((_, i) => i);
		if (item.noShuffle) return order;
		for (let i = order.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		return order;
	}

	let states = $state(
		items.map((item) => ({ done: false, wrong: [], shake: false, order: shuffled(item) }))
	);
	let doneCount = $derived(states.filter((s) => s.done).length);
	let visibleCount = $derived(Math.min(doneCount + 1, items.length));

	function pick(i, oi) {
		const st = states[i];
		if (st.done) return;
		if (oi === items[i].correct) {
			st.done = true;
			// l'intrus passe en bout de rang, la famille se resserre
			if (intrus) st.order = [...st.order.filter((o) => o !== oi), oi];
			onCorrect();
			onResult(block.items[i], st.wrong.length === 0);
			if (states.every((s) => s.done)) onComplete();
		} else {
			if (!st.wrong.includes(oi)) st.wrong.push(oi);
			st.shake = true;
			setTimeout(() => (st.shake = false), 300);
		}
	}
</script>

<section class="block">
	<header class="block-head">
		<h3 class="block-title">{block.title}</h3>
		<span class="counter" aria-label="Progression de l'exercice">{doneCount}/{items.length}</span>
	</header>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	{#each items.slice(0, visibleCount) as item, i}
		<div class="item" class:shake={states[i].shake} class:intrus>
			{#if intrus}
				<div class="seria">
				<span class="num">{i + 1}</span>
				<div class="tiras" class:resolguda={states[i].done} role="group" aria-label="Série {i + 1} : quatre mots, un intrus">
					{#each states[i].order as oi (oi)}
						<button
							type="button"
							lang="oc"
							class="pc pc-rep opt mot"
							class:familha={states[i].done && oi !== item.correct}
							class:fora={states[i].done && oi === item.correct}
							class:wrong={!states[i].done && states[i].wrong.includes(oi)}
							disabled={states[i].done || states[i].wrong.includes(oi)}
							onclick={() => pick(i, oi)}
							animate:flip={{ duration: doux ? 0 : 420 }}
						>
							{insecable(item.options[oi])}
						</button>
					{/each}
					{#if states[i].done}
						<p class="familha-nom">{@html rich(item.familha)}</p>
					{/if}
				</div>
				</div>
				{#if states[i].done && item.explain}
					<p class="explain">✓ {@html rich(item.explain)}</p>
				{/if}
			{:else}
			{#if item.ditz}
				<p class="ditz"><span class="num">{i + 1}</span> <span class="qui">{item.ditz.qui}</span> <span class="paraula" lang="oc">{insecable(item.ditz.oc)}</span></p>
			{/if}
			<p class="question">{#if !item.ditz}<span class="num">{i + 1}</span> {/if}{@html rich(item.q)}</p>
			<div class="options">
				{#each states[i].order as oi}
					<button
						type="button"
						class="pc pc-rep opt"
						class:correct={states[i].done && oi === item.correct}
						class:wrong={states[i].wrong.includes(oi)}
						disabled={states[i].done || states[i].wrong.includes(oi)}
						onclick={() => pick(i, oi)}
					>
						{@html rich(item.options[oi])}
					</button>
				{/each}
			</div>
			{#if states[i].done && item.explain}
				<p class="explain">✓ {@html rich(item.explain)}</p>
			{/if}
			{/if}
		</div>
	{/each}
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

	.item {
		margin-top: 1.1rem;
		animation: fade-in 350ms ease-out;
	}

	.question {
		margin: 0 0 0.5rem;
		line-height: 1.55;
		color: var(--t-tinta);
	}

	.ditz {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		margin: 0 0 0.45rem;
	}

	.qui {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--l-teal);
	}

	.paraula {
		padding: 0.45rem 0.85rem;
		border-radius: 16px 16px 16px 4px;
		background: color-mix(in srgb, var(--l-teal) 10%, var(--l-carta));
		font-size: 1.05rem;
		color: var(--t-tinta);
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
		color: var(--t-tinta);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* pièce de papier (lib/styles/papier.css) ; ici, seulement ce qui est propre au QCM */
	.opt {
		min-height: 0;
		padding: 0.5rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.opt:disabled {
		cursor: default;
		opacity: 1;
		box-shadow: var(--pc-lev);
	}

	.opt.correct {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
		font-weight: 600;
		transform: translateY(-1px);
		box-shadow: 0 4px 4px var(--pc-ombre);
	}

	.opt.wrong {
		opacity: 0.5;
		text-decoration: line-through;
		box-shadow: 0 1px 2px var(--pc-ombre);
	}

	.explain {
		margin: 0.55rem 0 0;
		font-size: 0.88rem;
		color: var(--l-bon);
		line-height: 1.5;
	}

	/* ---- L'intrús : quatre pièces, puis la famille se range sous son nom ---- */
	.item.intrus {
		container-type: inline-size;
	}

	.seria {
		display: flex;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.seria > .num {
		flex: none;
		margin-top: 0.8rem;
	}

	/* deux par deux sur téléphone, quatre de front dès que la place le permet */
	.tiras {
		flex: 1;
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.mot {
		justify-content: center;
		min-height: 3rem;
		padding: 0.5rem 0.6rem;
		font-size: 1.02rem;
		font-weight: 600;
		line-height: 1.25;
		text-align: center;
	}

	/* la famille passe à l'or, ensemble */
	.mot.familha {
		--pc-fons: var(--pc-or-fons);
		--pc-tinta: #2a1a10;
		transform: translateY(-1px);
		box-shadow: 0 4px 4px var(--pc-ombre);
	}

	/* l'intrus reste à l'écart, posé à plat (le papier ne s'incline pas) */
	.mot.fora {
		--pc-fons: var(--pc-carton);
		--pc-tinta: var(--pc-carton-tinta, var(--t-tinta));
		opacity: 0.6;
		transform: translateY(3px);
		box-shadow: 0 1px 2px var(--pc-ombre);
	}

	/* le nom de la famille, sous un filet d'or qui se trace */
	.familha-nom {
		position: relative;
		grid-column: 1 / -1;
		margin: 0.15rem 0 0;
		padding-top: 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
		color: var(--t-aur);
		animation: fade-in 350ms 200ms ease-out both;
	}

	.familha-nom::before {
		content: '';
		position: absolute;
		inset: 0 0.75rem auto;
		height: 1px;
		background: var(--t-aur);
		transform-origin: left;
		animation: tracar 450ms ease-out both;
	}

	@container (min-width: 32rem) {
		.tiras {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		/* sous les trois pièces de la famille, pas sous l'intrus */
		.familha-nom {
			grid-column: 1 / 4;
		}
		.mot.fora {
			margin-left: 0.6rem;
		}
	}

	@keyframes tracar {
		from { transform: scaleX(0); }
		to { transform: scaleX(1); }
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
		.item, .shake, .familha-nom, .familha-nom::before { animation: none; }
		.opt { transition: none; }
	}
</style>
