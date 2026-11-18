<script>
	// Gabarit « écrire la réponse » : une demande en français, un champ large pour
	// répondre en occitan, et les lettres accentuées de l'occitan à portée de doigt
	// (elles s'insèrent là où est le curseur). La correction pardonne un accent ou
	// un trait d'union et le dit. Après deux essais manqués, on peut voir la
	// réponse : personne ne reste bloqué.
	import { tick } from 'svelte';
	import Ecran from './Ecran.svelte';
	import { corregir, remarca, netejar, LETRAS } from '$lib/lesson/escriure.js';
	import { insecable } from '$lib/lesson/rich.js';

	let { demanda, answers, indici = '', explic = '', avança = 0.6, oncontunhar } = $props();

	let saisie = $state('');
	let estat = $state('escriu'); // escriu | just | quasi | non | mostrat
	let essais = $state(0);
	let modèl = $state('');
	let nòta = $state('');
	let champ = $state(null);

	const acabat = $derived(estat === 'just' || estat === 'quasi' || estat === 'mostrat');
	const vuèg = $derived(netejar(saisie) === '');

	function verificar() {
		const r = corregir(saisie, { answers });
		if (r.statut === 'non') {
			essais += 1;
			estat = 'non';
			return;
		}
		modèl = r.modele;
		nòta = r.statut === 'quasi' ? remarca(saisie, r.modele) : '';
		estat = r.statut;
	}
	function reprendre() {
		estat = 'escriu';
		champ?.focus();
	}
	function veire() {
		modèl = answers[0];
		estat = 'mostrat';
	}
	async function inserir(letra) {
		if (acabat) return;
		const a = champ?.selectionStart ?? saisie.length;
		const z = champ?.selectionEnd ?? saisie.length;
		saisie = saisie.slice(0, a) + letra + saisie.slice(z);
		if (estat === 'non') estat = 'escriu';
		await tick();
		champ?.focus();
		champ?.setSelectionRange(a + letra.length, a + letra.length);
	}
	function mandar(e) {
		e.preventDefault();
		if (acabat) return;
		if (estat === 'non') reprendre();
		else if (!vuèg) verificar();
	}

	const retorn = $derived.by(() => {
		if (estat === 'just') return { just: true, titol: { oc: 'Òsca !', fr: 'bravo' }, explic };
		if (estat === 'quasi')
			return {
				just: true,
				titol: { oc: 'Òsca !', fr: 'bravo' },
				explic: `Presque : on écrit « ${modèl} », ${nòta === 'tiret' ? 'avec le trait d’union' : 'avec l’accent'}.`
			};
		if (estat === 'non')
			return { just: false, titol: { oc: 'Pas encara', fr: 'pas encore' }, explic: indici || 'Relis la consigne, puis essaie encore.' };
		if (estat === 'mostrat')
			return { just: false, titol: { oc: modèl, fr: 'la réponse' }, explic: 'Dis-la une fois à voix haute avant de continuer.' };
		return null;
	});
	const boton = $derived(
		acabat
			? { oc: 'Contunhar', actiu: true, onclick: oncontunhar }
			: estat === 'non'
				? { oc: 'Tòrna', actiu: true, onclick: reprendre }
				: { oc: 'Verificar', actiu: !vuèg, onclick: verificar }
	);
</script>

<Ecran {avança} consigna={{ oc: 'Escriu en occitan', fr: 'écris en occitan' }} {retorn} {boton} onpassar={acabat ? null : oncontunhar}>
	{#snippet accion()}
		<p class="demanda">{insecable(demanda)}</p>
		<form onsubmit={mandar}>
			<input
				bind:this={champ}
				bind:value={saisie}
				oninput={() => {
					if (estat === 'non') estat = 'escriu';
				}}
				class="champ"
				class:just={estat === 'just' || estat === 'quasi'}
				class:fals={estat === 'non'}
				type="text"
				lang="oc"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				readonly={acabat}
				aria-label="Ta réponse, en occitan"
			/>
		</form>
		{#if essais >= 2 && !acabat}
			<button type="button" class="veire" onclick={veire}><span lang="oc">Veire la responsa</span> <span class="glosa">(voir la réponse)</span></button>
		{/if}
	{/snippet}
	{#snippet reserva()}
		<div class="letras" role="group" aria-label="Les lettres accentuées de l’occitan">
			{#each LETRAS as l (l)}
				<button type="button" class="pc pc-2 letra" onmousedown={(e) => e.preventDefault()} onclick={() => inserir(l)} lang="oc">{l}</button>
			{/each}
		</div>
	{/snippet}
</Ecran>

<style>
	.demanda {
		margin: 0 0 1.1rem;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.4;
	}

	/* le champ : une feuille posée dans un creux, où le texte est grand */
	.champ {
		width: 100%;
		min-height: 3.5rem;
		padding: 0.6rem 0.9rem;
		border: 0;
		border-radius: 12px;
		color: var(--t-tinta);
		background: var(--l-carta);
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 1.5px var(--t-linha);
		font: 700 1.35rem/1.2 var(--font-body);
	}
	.champ:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.champ.just {
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 2.5px var(--pc-juste);
	}
	.champ.fals {
		box-shadow:
			inset 0 2px 3px var(--pc-ombre),
			inset 0 0 0 2.5px var(--t-accion);
		animation: pc-tremble 0.4s ease-out;
	}

	.veire {
		display: block;
		margin: 0.9rem auto 0;
		padding: 0.25rem;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.veire:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.glosa {
		font-style: italic;
	}

	/* les huit lettres accentuées, sur une seule rangée */
	.letras {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 0.35rem;
	}
	.letra {
		min-width: 0;
		min-height: 2.75rem;
		padding: 0;
		font-size: 1.15rem;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.champ.fals {
			animation: none;
		}
	}
</style>
