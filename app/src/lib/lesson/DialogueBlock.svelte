<script>
	// Le dialogue d'entrée (Escota) : scènes, répliques, glossaire « ça sonne
	// comme ». L'audio (voix-modèle + voix native) n'est pas encore enregistré :
	// le bouton est là, inactif, pour préparer sa place.
	import { rich } from '$lib/lesson/rich.js';

	let { block } = $props();
</script>

<section class="block">
	<h3 class="block-title">🎧 {block.title}</h3>
	{#if block.intro}<p class="intro">{@html rich(block.intro)}</p>{/if}

	{#each block.scenes as scene}
		<div class="scene">
			<p class="scene-title">
				{scene.title}
				{#if scene.subtitle}<span class="scene-sub"><em>{scene.subtitle}</em></span>{/if}
			</p>
			<button type="button" class="listen" disabled title="Àudio a venir (audio à venir)" aria-label="Àudio a venir">
				🔊 <span class="listen-label">a venir</span>
			</button>
			<div class="lines">
				{#each scene.lines as line}
					<p class="line">— {@html rich(line)}</p>
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
						<strong class="g-oc">{g.oc}</strong>
						<span class="g-sound">{g.sound}</span>
						<span class="g-fr">— {g.fr}</span>
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
	}
</style>
