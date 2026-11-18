<script>
	// Gabarit « texte à lire » : un vrai petit texte, posé sur une feuille, en
	// grand. Les mots soulignés se touchent : leur sens et ce qu'on entend
	// viennent en pied d'écran, sans quitter la lecture. Rien à réussir ici : on
	// lit, on touche ce qu'on veut, on continue quand on veut.
	import Ecran from './Ecran.svelte';
	import BotonSon from './BotonSon.svelte';
	import { insecable } from '$lib/lesson/rich.js';

	let { intro = '', paragrafs, signatura = '', son = null, avança = 0.8, oncontunhar } = $props();

	let causit = $state.raw(null); // le mot touché

	const retorn = $derived(
		causit ? { just: false, titol: { oc: causit.mot, fr: causit.fr }, explic: causit.sound ? `Se dit « ${causit.sound} ».` : '' } : null
	);

	// La ponctuation qui suit un mot touchable reste accrochée à lui : un bouton
	// est un bloc dans la ligne, et le navigateur peut passer à la ligne juste
	// après, laissant un « ? » seul en début de ligne.
	const PONCT = /^[\s  ]*[?!:;,.…»]+/u;
	const linhas = $derived(
		paragrafs.map((par) => {
			const tròces = [];
			for (const seg of par) {
				if (typeof seg !== 'string') {
					tròces.push({ seg, coa: '' });
					continue;
				}
				const tèxt = insecable(seg);
				const darrièr = tròces.at(-1);
				const coa = darrièr?.seg ? (tèxt.match(PONCT)?.[0] ?? '') : '';
				if (coa) darrièr.coa = coa;
				if (tèxt.length > coa.length) tròces.push({ tèxt: tèxt.slice(coa.length) });
			}
			return tròces;
		})
	);
</script>

<Ecran {avança} consigna={{ oc: 'Legís lo tèxt', fr: 'lis le texte' }} {retorn} boton={{ oc: 'Contunhar', actiu: true, onclick: oncontunhar }}>
	{#snippet accion()}
		{#if intro}<p class="intro">{insecable(intro)}</p>{/if}
		{#if son}<div class="son"><BotonSon src={son} gran /></div>{/if}
		<div class="fuèlh" lang="oc">
			{#each linhas as par, p (p)}
				<p>{#each par as tr, s (s)}{#if tr.seg}<span class="ligat"><button type="button" class="glossat" class:causit={causit === tr.seg} aria-pressed={causit === tr.seg} onclick={() => (causit = causit === tr.seg ? null : tr.seg)}>{tr.seg.mot}</button>{tr.coa}</span>{:else}{tr.tèxt}{/if}{/each}</p>
			{/each}
			{#if signatura}<p class="signatura">{signatura}</p>{/if}
		</div>
	{/snippet}
	{#snippet reserva()}
		<p class="ajuda"><span lang="oc">Tòca un mot solinhat</span> <span class="glosa">(touche un mot souligné)</span></p>
	{/snippet}
</Ecran>

<style>
	.intro {
		margin: 0 0 0.9rem;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.son {
		margin-bottom: 0.9rem;
	}

	/* la feuille : du papier neutre posé, où le texte respire */
	.fuèlh {
		padding: 1rem 1.1rem;
		border-radius: 14px;
		color: var(--t-tinta);
		background: var(--l-carta);
		box-shadow: 0 1px 2px var(--pc-ombre);
		font-size: 1.2rem;
		line-height: 1.7;
	}
	.fuèlh p {
		margin: 0;
	}
	.fuèlh p + p {
		margin-top: 0.6rem;
	}
	.fuèlh .signatura {
		margin-top: 0.9rem;
		font-style: italic;
		text-align: right;
	}

	/* le mot et sa ponctuation ne se quittent pas en fin de ligne */
	.ligat {
		white-space: nowrap;
	}

	/* un mot qui se touche : souligné à l'or ; touché, il devient une pièce d'or */
	.glossat {
		margin: 0 -0.1em;
		padding: 0 0.1em;
		border: 0;
		border-radius: 4px;
		background: none;
		color: inherit;
		font: inherit;
		text-decoration: underline;
		text-decoration-color: var(--t-aur-gros);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.22em;
		cursor: pointer;
	}
	.glossat.causit {
		color: var(--pc-or-tinta);
		background: var(--pc-or-fons);
		text-decoration: none;
	}
	.glossat:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	.ajuda {
		margin: 0;
		font-size: 0.95rem;
		text-align: center;
		color: var(--t-tinta-2);
	}
	.glosa {
		font-style: italic;
	}
</style>
