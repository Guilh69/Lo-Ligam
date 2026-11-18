<script>
	// Gabarit « audace » : la leçon se ferme sur une chose à tenter dans la vraie
	// vie, petite et choisie. C'est une proposition : les deux réponses ont la même
	// place, et « plus tard » est une vraie réponse, sans reproche.
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import Ecran from './Ecran.svelte';
	import Causidas from './Causidas.svelte';
	import { insecable } from '$lib/lesson/rich.js';

	let {
		foto = null,
		acquis = '',
		prepausa,
		retorns = {
			farai: 'Garde en tête le moment et la personne que tu viens de choisir.',
			pas: 'Aucun souci. L’audace attendra un jour où tu en auras envie.'
		},
		avança = 1,
		oncontunhar
	} = $props();

	let causida = $state(null);
	let respondre = $state(null);

	const OPCIONS = [
		{ id: 'farai', oc: 'O farai', fr: 'je le ferai' },
		{ id: 'pas', oc: 'Mai tard', fr: 'plus tard' }
	];

	// le retour prend de la place en bas : les deux réponses restent sous les yeux
	async function causir(id) {
		causida = id;
		await tick();
		respondre?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion.current ? 'auto' : 'smooth' });
	}

	const retorn = $derived(
		causida === 'farai'
			? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: retorns.farai }
			: causida === 'pas'
				? { just: false, titol: { oc: 'Mai tard', fr: 'plus tard' }, explic: retorns.pas }
				: null
	);
</script>

{#snippet imatge()}
	<img class="foto" src={foto.src} alt={foto.alt} width="800" height="999" style:object-position={foto.position} />
{/snippet}

<Ecran
	{avança}
	consigna={{ oc: 'L’audàcia de la setmana', fr: 'l’audace de la semaine' }}
	{retorn}
	boton={{ oc: 'Acabar', actiu: causida !== null, onclick: oncontunhar }}
	media={foto ? imatge : undefined}
>
	{#snippet accion()}
		{#if acquis}<p class="acquis">{insecable(acquis)}</p>{/if}
		<p class="prepausa">{#each prepausa as seg, s (s)}{#if typeof seg === 'string'}{insecable(seg)}{:else}<b lang="oc">{insecable(seg.oc)}</b>{/if}{/each}</p>
		<div bind:this={respondre}>
			<Causidas label="Ta réponse" opcions={OPCIONS} {causida} oncausir={causir} />
		</div>
	{/snippet}
</Ecran>

<style>
	.foto {
		display: block;
		width: 100%;
		height: 6.5rem;
		object-fit: cover;
		border-radius: 22px;
	}
	.acquis {
		margin: 0 0 0.6rem;
		color: var(--t-tinta-2);
		font-size: 0.95rem;
		line-height: 1.4;
	}
	.prepausa {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.45;
	}
	/* une formule occitane ne se coupe pas en fin de ligne */
	.prepausa b {
		white-space: nowrap;
	}
</style>
