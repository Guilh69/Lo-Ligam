<script>
	// Le dialogue d'entrée (Escota) : scènes, répliques, glossaire « ça sonne
	// comme ». Chaque réplique peut porter sa prononciation : un toucher
	// l'affiche ou la cache. L'audio (voix-modèle + voix native) s'active
	// automatiquement dès qu'un fichier existe (scene.audio).
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();

	// Répliques : simple chaîne, ou { oc, sound } avec prononciation.
	function norm(line) {
		return typeof line === 'string' ? { oc: line, sound: null } : line;
	}

	let hasSounds = $derived(block.scenes.some((s) => s.lines.some((l) => norm(l).sound)));

	let open = $state({});

	function toggle(key) {
		open[key] = !open[key];
	}

	function play(src) {
		try {
			new Audio(src).play();
		} catch (e) {
			/* audio indisponible : jamais bloquant */
		}
	}
</script>

<section class="block">
	<h3 class="block-title">🎧 {block.title}</h3>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}
	{#if hasSounds}
		<p class="sound-hint">👆 <em>Touche une phrase pour voir comment elle sonne.</em></p>
	{/if}

	{#each block.scenes as scene, si}
		<div class="scene">
			<p class="scene-title">
				{scene.title}
				{#if scene.subtitle}<span class="scene-sub"><em>{scene.subtitle}</em></span>{/if}
			</p>
			{#if scene.audio}
				<button type="button" class="listen active" onclick={() => play(scene.audio)} aria-label="Escotar la scèna">
					🔊 <span class="listen-label">escotar</span>
				</button>
			{:else}
				<button type="button" class="listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir">
					🔊 <span class="listen-label">a venir</span>
				</button>
			{/if}
			<div class="lines">
				{#each scene.lines as line, li}
					{@const l = norm(line)}
					{#if l.sound}
						<button
							type="button"
							class="line tappable"
							aria-expanded={!!open[`${si}-${li}`]}
							onclick={() => toggle(`${si}-${li}`)}
						>
							<span class="line-oc">— {@html rich(l.oc)}</span>
							{#if open[`${si}-${li}`]}
								<span class="line-sound">{l.sound}</span>
							{/if}
						</button>
					{:else}
						<p class="line">— {@html rich(l.oc)}</p>
					{/if}
				{/each}
			</div>
		</div>
	{/each}

	{#if block.glossary?.length}
		<div class="glossary">
			<p class="glossary-title">Glossaire <em>(ça sonne comme — syllabe forte en capitales)</em></p>
			<ul>
				{#each block.glossary as g}
					<li>
						{#if g.audio}
							<button type="button" class="g-listen" onclick={() => play(g.audio)} aria-label="Escotar {g.oc}">🔊</button>
						{/if}
						<strong class="g-oc">{g.oc}</strong>
						<span class="g-sound">{g.sound}</span>
						<span class="g-fr">{g.fr}</span>
					</li>
				{/each}
			</ul>
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

	.block-title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.15rem;
		color: var(--color-brick);
	}

	.intro {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: rgba(58, 42, 32, 0.75);
		line-height: 1.5;
	}

	.sound-hint {
		margin: 0.45rem 0 0;
		font-size: 0.8rem;
		color: var(--color-teal);
	}

	.scene {
		position: relative;
		margin-top: 1.1rem;
		padding: 0.9rem 1rem;
		background: rgba(224, 164, 59, 0.09);
		border-radius: 14px;
	}

	.scene-title {
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-weight: 600;
		color: var(--color-text);
		padding-right: 5rem;
	}

	.scene-sub {
		display: block;
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--color-teal);
	}

	.listen {
		position: absolute;
		top: 0.7rem;
		right: 0.8rem;
		border: none;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 999px;
		padding: 0.25rem 0.6rem;
		font-size: 0.8rem;
		color: rgba(58, 42, 32, 0.5);
		cursor: default;
	}

	.listen.active {
		color: var(--color-brick);
		cursor: pointer;
		background: white;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.15);
	}

	.listen-label {
		font-size: 0.7rem;
		font-style: italic;
	}

	.lines {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.line {
		margin: 0;
		line-height: 1.6;
		color: var(--color-text);
		font-size: 1.02rem;
		text-align: left;
	}

	.line.tappable {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		border: none;
		background: none;
		padding: 0.15rem 0.35rem;
		margin: -0.15rem -0.35rem;
		border-radius: 10px;
		font: inherit;
		cursor: pointer;
	}

	.line.tappable:hover {
		background: rgba(255, 255, 255, 0.75);
	}

	.line.tappable[aria-expanded='true'] {
		background: rgba(255, 255, 255, 0.85);
	}

	.line-oc {
		line-height: 1.6;
	}

	.line-sound {
		font-size: 0.85rem;
		color: var(--color-brick);
		padding-left: 1.1rem;
		animation: fade-in 200ms ease-out;
	}

	.glossary {
		margin-top: 1.1rem;
	}

	.glossary-title {
		margin: 0 0 0.4rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-teal);
	}

	.glossary ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.glossary li {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text);
	}

	.g-listen {
		border: none;
		background: none;
		padding: 0 0.25rem 0 0;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.g-oc {
		font-family: var(--font-heading);
	}

	.g-sound {
		margin-left: 0.4rem;
		color: var(--color-brick);
		font-size: 0.85rem;
	}

	.g-fr {
		color: rgba(58, 42, 32, 0.75);
		margin-left: 0.15rem;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(-2px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.line-sound { animation: none; }
	}
</style>
