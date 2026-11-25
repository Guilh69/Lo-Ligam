<script>
	// Gabarit « vrai ou faux » : une image (ou une vidéo), une affirmation, deux
	// réponses ; le retour explique toujours, juste ou non (principe 8). Les deux
	// réponses sont des pièces de papier (.pc-rep) : verte pour la bonne, brique
	// qui tremble pour celle qu'on a choisie à tort.
	import Ecran from './Ecran.svelte';
	import { insecable } from '#lib/lesson/rich.js';

	let { foto, afirmacion, responsa, explic, avança = 0.75, oncontunhar } = $props();
	let causit = $state(null); // true | false | null

	const retorn = $derived(
		causit === null
			? null
			: causit === responsa
				? { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic }
				: { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic }
	);
</script>

<Ecran {avança} consigna={{ oc: 'Vertat o fals ?', fr: 'vrai ou faux ?' }} {retorn} boton={{ oc: 'Contunhar', actiu: causit !== null, onclick: oncontunhar }} onpassar={causit === null ? oncontunhar : null}>
	{#snippet media()}
		<img class="foto" src={foto.src} alt={foto.alt} width="800" height="533" />
	{/snippet}
	{#snippet accion()}
		<p class="afirmacion">{insecable(afirmacion)}</p>
		<div class="causidas">
			{#each [true, false] as v (v)}
				<button
					type="button"
					class="pc pc-rep causida"
					class:est-bon={causit !== null && v === responsa}
					class:est-faux={causit === v && v !== responsa}
					disabled={causit !== null}
					onclick={() => (causit = v)}
				>
					<span class="mot"><span lang="oc">{v ? 'Vertat' : 'Fals'}</span> <span class="glosa">({v ? 'vrai' : 'faux'})</span></span>
				</button>
			{/each}
		</div>
	{/snippet}
</Ecran>

<style>
	/* la photo dans la langue du site (.panel-media) : coins à 22 px, sans cadre */
	.foto {
		display: block;
		width: 100%;
		height: 11rem;
		object-fit: cover;
		border-radius: 22px;
	}
	.afirmacion {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
	}
	.causidas {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.7rem;
		margin-top: 1.1rem;
	}
	.causida {
		justify-content: center;
		min-height: 3.5rem;
		font-size: 1.1rem;
		text-align: center;
	}
	/* une fois répondu : la bonne et la choisie restent pleines, celle qui reste pâlit */
	.causida.est-bon:disabled,
	.causida.est-faux:disabled {
		opacity: 1;
		box-shadow: var(--pc-lev);
		cursor: default;
	}
	/* sur une pièce : le mot occitan, sa traduction dessous */
	.mot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
	}
	.glosa {
		font-style: italic;
		font-weight: 400;
		font-size: 0.88em;
	}
</style>
