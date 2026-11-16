<script>
	// Gabarit « écouter et répéter » : la photo du sujet, la phrase, le son ;
	// puis le micro : on s'enregistre et on compare à l'oreille (pas de note
	// automatique : l'oreille de l'apprenant juge, principe 1, le son d'abord).
	import { onDestroy } from 'svelte';
	import Ecran from './Ecran.svelte';
	import BotonSon from './BotonSon.svelte';
	import Icona from '$lib/components/Icona.svelte';
	import { creerEnregistreur } from '$lib/voix/enregistreur.js';

	let { foto, frasa, son, avança = 0.2, oncontunhar } = $props();

	let estat = $state('espèra'); // espèra | enregistra | presa
	let presa = $state(null); // URL du son de l'apprenant
	let error = $state('');
	let enregistreur = null;

	async function micro() {
		error = '';
		if (estat === 'enregistra') return enregistreur?.arreter();
		try {
			enregistreur ??= creerEnregistreur({ dureeMax: 8000 });
			const { fin } = await enregistreur.demarrer();
			estat = 'enregistra';
			const p = await fin;
			if (presa) URL.revokeObjectURL(presa);
			presa = URL.createObjectURL(p.blob);
			estat = 'presa';
		} catch (e) {
			estat = presa ? 'presa' : 'espèra';
			error = e?.message || 'Le micro n’a pas pu s’ouvrir.';
		}
	}

	onDestroy(() => {
		enregistreur?.liberer?.();
		if (presa) URL.revokeObjectURL(presa);
	});

	const retorn = $derived(
		estat === 'presa' ? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: 'Réécoute le modèle, puis ta voix : ton oreille fait la différence. Tu peux recommencer autant que tu veux.' } : null
	);
</script>

<Ecran
	{avança}
	consigna={{ oc: 'Escota, puèi repetís', fr: 'écoute, puis répète' }}
	{retorn}
	boton={{ oc: 'Contunhar', actiu: estat === 'presa', onclick: oncontunhar }}
	onpassar={oncontunhar}
>
	{#snippet media()}
		<img class="foto" src={foto.src} alt={foto.alt} width="800" height="533" />
	{/snippet}
	{#snippet accion()}
		<p class="frasa" lang="oc">{frasa.oc}</p>
		<p class="sona">« {frasa.sound} »</p>
		<p class="fr">{frasa.fr}</p>
		<div class="gestes">
			<BotonSon src={son} gran />
			<button type="button" class="micro" class:actiu={estat === 'enregistra'} aria-pressed={estat === 'enregistra'} onclick={micro}>
				<Icona nom={estat === 'enregistra' ? 'pause' : 'micro'} size="1.9rem" />
				<span class="micro-nom">
					{#if estat === 'enregistra'}<span lang="oc">Arrèsta</span>{:else}<span lang="oc">Repetís</span>{/if}
				</span>
			</button>
			{#if presa}<BotonSon src={presa} gran label="Ta votz" glosa="ta voix" />{/if}
		</div>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
	{/snippet}
</Ecran>

<style>
	.foto {
		display: block;
		width: 100%;
		height: 9.5rem;
		object-fit: cover;
		border-radius: 3px;
	}
	.frasa {
		margin: 0;
		font-size: 1.6rem;
		line-height: 1.25;
	}
	.sona {
		margin: 0.25rem 0 0;
		color: var(--t-aur);
		font-size: 0.95rem;
	}
	.fr {
		margin: 0.15rem 0 0;
		color: var(--t-tinta-2);
	}
	.gestes {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.1rem;
	}
	.micro {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15rem;
		width: 4.75rem;
		height: 4.75rem;
		border: 1.5px solid var(--t-accion);
		border-radius: 6px;
		background: transparent;
		color: var(--t-accion);
		font: inherit;
		cursor: pointer;
	}
	.micro.actiu {
		background: var(--t-accion);
		color: var(--t-accion-tinta);
		animation: alen 1.4s ease-in-out infinite;
	}
	.micro:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.micro-nom {
		font-size: 0.85rem;
	}
	.error {
		margin: 0.6rem 0 0;
		color: var(--t-tinta-2);
		font-size: 0.9rem;
	}
	@keyframes alen {
		50% {
			transform: scale(1.05);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.micro.actiu {
			animation: none;
		}
	}
</style>
