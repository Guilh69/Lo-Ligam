<script>
	// Gabarit « bilan » : ce que la leçon a appris, en quelques lignes à cocher.
	// On coche seulement ce qu'on sait faire seul ; rien n'est compté, rien n'est
	// noté, et l'on continue quoi qu'on ait coché. La case cochée est une petite
	// pièce d'or posée dans son creux.
	import Ecran from './Ecran.svelte';
	import Icona from '#lib/components/Icona.svelte';
	import { insecable } from '#lib/lesson/rich.js';

	let { intro = '', items, avança = 1, oncontunhar } = $props();
	const uid = $props.id();

	let fachs = $derived(items.map(() => false));
</script>

<Ecran {avança} consigna={{ oc: 'Fai lo bilanç', fr: 'fais le bilan' }} boton={{ oc: 'Contunhar', actiu: true, onclick: oncontunhar }}>
	{#snippet accion()}
		{#if intro}<p class="intro">{insecable(intro)}</p>{/if}
		<p class="cap-lista" id="{uid}-cap">Je peux…</p>
		<ul class="lista" aria-labelledby="{uid}-cap">
			{#each items as item, i (i)}
				<li>
					<label class="linha">
						<input type="checkbox" class="sr" checked={fachs[i]} onchange={() => (fachs = fachs.with(i, !fachs[i]))} />
						<span class="casa" aria-hidden="true">{#if fachs[i]}<Icona nom="valide" size="1.15rem" />{/if}</span>
						<span class="tèxt">{insecable(item)}</span>
					</label>
				</li>
			{/each}
		</ul>
	{/snippet}
</Ecran>

<style>
	.intro {
		margin: 0 0 1.1rem;
		line-height: 1.5;
	}
	.cap-lista {
		margin: 0 0 0.3rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
	.lista {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.lista li {
		border-top: 1px solid var(--t-linha);
	}
	.linha {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-height: 3.25rem;
		padding: 0.45rem 0;
		font-size: 1.05rem;
		line-height: 1.35;
		cursor: pointer;
	}

	/* la case : un creux ; cochée, une pièce d'or posée dedans */
	.casa {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 6px;
		background: var(--t-fons-2);
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 1.5px var(--t-linha);
	}
	input:checked + .casa {
		color: var(--pc-or-tinta);
		background: var(--pc-or-fons);
		box-shadow: 0 2px 3px var(--pc-ombre);
		animation: pausa 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	input:focus-visible + .casa {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	@keyframes pausa {
		from {
			transform: translateY(-7px);
			box-shadow: 0 7px 6px var(--pc-ombre);
		}
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		input:checked + .casa {
			animation: none;
		}
	}
</style>
