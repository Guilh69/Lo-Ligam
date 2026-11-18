<script>
	// Gabarit « écouter et répéter » : le son d'abord (principe 1). Une photo du
	// sujet, la phrase en grand, sa prononciation, puis trois gestes : écouter le
	// modèle, s'enregistrer, se réécouter. Rien n'est noté : c'est l'oreille de
	// l'apprenant qui juge. L'enregistrement reste dans le navigateur.
	// Les trois gestes sont trois pièces de papier identiques (BotonGest) : même
	// carré, même pictogramme, même écriture. Le micro est au milieu ; il passe à
	// l'or et respire tant qu'il enregistre.
	import { onDestroy } from 'svelte';
	import Ecran from './Ecran.svelte';
	import BotonSon from './BotonSon.svelte';
	import BotonGest from './BotonGest.svelte';
	import { creerEnregistreur } from '$lib/voix/enregistreur.js';
	import { insecable } from '$lib/lesson/rich.js';

	let { foto, frasa, son, avança = 0.2, oncontunhar } = $props();

	let estat = $state('espèra'); // espèra | enregistra | presa
	let presa = $state(null);
	let error = $state('');
	let enregistreur = null;
	const enregistra = $derived(estat === 'enregistra');

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
		estat === 'presa'
			? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic: 'Réécoute le modèle, puis ta voix : ton oreille fait la différence. Tu peux recommencer autant que tu veux.' }
			: null
	);
</script>

<Ecran {avança} consigna={{ oc: 'Escota, puèi repetís', fr: 'écoute, puis répète' }} {retorn} boton={{ oc: 'Contunhar', actiu: estat === 'presa', onclick: oncontunhar }} onpassar={oncontunhar}>
	{#snippet media()}
		<img class="foto" src={foto.src} alt={foto.alt} width="800" height="533" />
	{/snippet}
	{#snippet accion()}
		<p class="frasa" lang="oc">{insecable(frasa.oc)}</p>
		<p class="sona">{insecable(`« ${frasa.sound} »`)}</p>
		<p class="fr">({insecable(frasa.fr)})</p>

		<div class="gestes">
			<BotonSon src={son} pila />
			<BotonGest
				icona={enregistra ? 'pause' : 'micro'}
				label={enregistra ? 'Arrèsta' : 'Repetís'}
				glosa={enregistra ? 'arrête' : 'répète'}
				actiu={enregistra}
				alen
				onclick={micro}
			/>
			{#if presa}<BotonSon src={presa} pila label="Ta votz" glosa="ta voix" />{/if}
		</div>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
	{/snippet}
</Ecran>

<style>
	/* la photo dans la langue du site (.panel-media) : coins à 22 px, sans cadre */
	.foto {
		display: block;
		width: 100%;
		height: 9rem;
		object-fit: cover;
		border-radius: 22px;
	}
	.frasa {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 2rem;
		line-height: 1.15;
		text-wrap: balance;
	}
	.sona {
		margin: 0.45rem 0 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--t-aur);
	}
	.fr {
		margin: 0.15rem 0 0;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	/* trois colonnes égales : le micro reste au milieu, que la troisième pièce soit là ou non */
	.gestes {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 5.75rem));
		justify-content: center;
		gap: 0.8rem;
		margin-top: 1.3rem;
	}
	.error {
		margin: 0.9rem 0 0;
		font-size: 0.9rem;
		color: var(--t-accion-viu);
	}
</style>
