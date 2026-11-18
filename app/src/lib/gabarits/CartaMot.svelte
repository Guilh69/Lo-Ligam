<script>
	// Gabarit « carte de mot » : penser, puis révéler. Le mot occitan est là, en
	// grand, avec ce qu'on entend. Le sens attend derrière : on le cherche d'abord
	// dans sa tête, on retourne, et on dit soi-même si on le savait. Personne ne
	// note : c'est à l'apprenant de juger, et les deux réponses ont la même place.
	import Ecran from './Ecran.svelte';
	import BotonSon from './BotonSon.svelte';
	import Causidas from './Causidas.svelte';
	import { insecable } from '$lib/lesson/rich.js';

	let { mot, son = null, avança = 0.2, oncontunhar } = $props();

	let vist = $state(false);
	let causida = $state(null);

	const OPCIONS = [
		{ id: 'sabiái', oc: 'O sabiái', fr: 'je le savais' },
		{ id: 'pas', oc: 'Pas encara', fr: 'pas encore' }
	];

	const retorn = $derived(
		causida === 'sabiái'
			? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: 'Tu le retrouveras plus loin, pour le garder.' }
			: causida === 'pas'
				? { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic: 'Aucun souci : c’est en le revoyant qu’il restera.' }
				: null
	);
	const boton = $derived(
		vist ? { oc: 'Contunhar', actiu: causida !== null, onclick: oncontunhar } : { oc: 'Veire la responsa', actiu: true, onclick: () => (vist = true) }
	);
</script>

<Ecran {avança} consigna={{ oc: 'Qué vòl dire ?', fr: 'qu’est-ce que ça veut dire ?' }} {retorn} {boton} onpassar={causida === null ? oncontunhar : null}>
	{#snippet accion()}
		<p class="mot" lang="oc">{insecable(mot.oc)}</p>
		{#if mot.sound}<p class="sona">{insecable(`« ${mot.sound} »`)}</p>{/if}
		{#if son}<div class="son"><BotonSon src={son} gran /></div>{/if}
		<div class="revèrs" class:vist aria-live="polite">
			{#if vist}
				<p class="sens">{insecable(mot.fr)}</p>
			{:else}
				<p class="espèra">Cherche d’abord dans ta tête.</p>
			{/if}
		</div>
		{#if vist}
			<Causidas label="Ta réponse" opcions={OPCIONS} {causida} oncausir={(id) => (causida = id)} />
		{/if}
	{/snippet}
</Ecran>

<style>
	.mot {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 2.2rem;
		line-height: 1.15;
		text-wrap: balance;
	}
	.sona {
		margin: 0.45rem 0 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--t-aur);
	}
	.son {
		margin-top: 0.9rem;
	}

	/* le revers : un creux tant que le sens attend, une feuille posée ensuite */
	.revèrs {
		display: flex;
		align-items: center;
		min-height: 5.5rem;
		margin-top: 1.3rem;
		padding: 0.9rem 1.1rem;
		border-radius: 14px;
		background: var(--t-fons-2);
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 1.5px var(--t-linha);
	}
	.revèrs.vist {
		background: var(--l-carta);
		box-shadow: 0 1px 2px var(--pc-ombre);
		animation: pausa 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.espèra,
	.sens {
		margin: 0;
	}
	.espèra {
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.sens {
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.3;
	}
	@keyframes pausa {
		from {
			transform: translateY(-10px);
			box-shadow: 0 9px 8px var(--pc-ombre);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.revèrs.vist {
			animation: none;
		}
	}
</style>
