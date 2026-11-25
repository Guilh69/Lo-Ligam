<script>
	// Gabarit « relier les paires » : l'occitan à gauche, le français à droite, en
	// désordre. On touche une pièce (elle passe à l'or), puis celle qui va avec de
	// l'autre côté. Bonne paire : les deux passent au vert un instant, puis se
	// posent (du papier neutre, on n'y touche plus). Mauvaise paire : elles
	// tremblent et se relâchent, rien n'est perdu. À la fin, la colonne de droite
	// glisse pour mettre chaque traduction en face de son mot.
	import { onDestroy } from 'svelte';
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import Ecran from './Ecran.svelte';
	import { barrejarTot } from './barrejar.js';
	import { insecable } from '#lib/lesson/rich.js';

	let { parelhs, avança = 0.6, oncontunhar } = $props();

	const desòrdre = $derived(barrejarTot(parelhs.map((_, i) => i)));
	let causit = $state.raw(null); // la pièce tenue : { costat, i }
	let fachs = $state([]); // les paires faites
	let frescs = $state([]); // celles qui viennent de l'être (encore vertes)
	let error = $state.raw(null); // la mauvaise paire qui tremble : { oc, fr }
	let mancas = $state([]); // les mots sur lesquels on s'est trompé
	let anonci = $state('');

	const temps = new Set();
	function mai(fn, ms) {
		const t = setTimeout(() => {
			temps.delete(t);
			fn();
		}, ms);
		temps.add(t);
	}
	onDestroy(() => temps.forEach(clearTimeout));

	function tocar(costat, i) {
		if (fachs.includes(i)) return;
		error = null;
		if (!causit || causit.costat === costat) {
			causit = causit?.costat === costat && causit.i === i ? null : { costat, i };
			return;
		}
		const oc = costat === 'oc' ? i : causit.i;
		const fr = costat === 'fr' ? i : causit.i;
		causit = null;
		if (oc === fr) {
			fachs.push(oc);
			frescs.push(oc);
			anonci = `Paire faite : ${parelhs[oc].oc}, ${parelhs[oc].fr}.`;
			mai(() => (frescs = frescs.filter((x) => x !== oc)), 700);
		} else {
			const e = { oc, fr };
			error = e;
			for (const x of [oc, fr]) if (!mancas.includes(x)) mancas.push(x);
			anonci = 'Ces deux-là ne vont pas ensemble.';
			mai(() => {
				if (error === e) error = null;
			}, 650);
		}
	}

	const acabat = $derived(fachs.length === parelhs.length);
	const drecha = $derived(acabat && frescs.length === 0 ? parelhs.map((_, i) => i) : desòrdre);

	const retorn = $derived.by(() => {
		if (!acabat) return null;
		const revoir = parelhs
			.filter((_, i) => mancas.includes(i))
			.map((p) => `« ${p.oc} », ${p.fr}`)
			.join(' ; ');
		return {
			just: true,
			titol: { oc: 'Òsca !', fr: 'bravo' },
			explic: revoir ? `Les paires sont faites. À revoir : ${revoir}.` : 'Toutes les paires, sans une erreur.'
		};
	});
</script>

{#snippet pèça(costat, i)}
	{@const fach = fachs.includes(i)}
	{@const fresc = frescs.includes(i)}
	{@const tengut = causit?.costat === costat && causit.i === i}
	<button
		type="button"
		class="pc pc-rep pèça"
		class:fr={costat === 'fr'}
		class:est-choisi={tengut}
		class:est-bon={fresc}
		class:est-faux={error?.[costat] === i}
		class:pausada={fach && !fresc}
		disabled={fach}
		aria-pressed={tengut}
		lang={costat === 'oc' ? 'oc' : undefined}
		onclick={() => tocar(costat, i)}>{insecable(parelhs[i][costat])}</button
	>
{/snippet}

<Ecran
	{avança}
	consigna={{ oc: 'Fai los parelhs', fr: 'fais les paires' }}
	{retorn}
	boton={{ oc: 'Contunhar', actiu: acabat, onclick: oncontunhar }}
	onpassar={acabat ? null : oncontunhar}
>
	{#snippet accion()}
		<div class="parelhs">
			<ul class="colomna" aria-label="En occitan">
				{#each parelhs as _, i (i)}
					<li>{@render pèça('oc', i)}</li>
				{/each}
			</ul>
			<ul class="colomna" aria-label="En français">
				{#each drecha as i (i)}
					<li animate:flip={{ duration: prefersReducedMotion.current ? 0 : 450 }}>{@render pèça('fr', i)}</li>
				{/each}
			</ul>
		</div>
		<p class="sr" role="status">{anonci}</p>
	{/snippet}
</Ecran>

<style>
	.parelhs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.7rem;
	}
	.colomna {
		display: grid;
		grid-auto-rows: 1fr;
		gap: 0.7rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.colomna li {
		display: flex;
	}

	/* toutes les pièces ont la même taille, des deux côtés */
	.pèça {
		flex: 1;
		width: 100%;
		justify-content: center;
		min-height: 3.5rem;
		padding: 0.5rem 0.6rem;
		font-size: 1.05rem;
		font-weight: 700;
		text-align: center;
	}
	.pèça.fr {
		font-style: italic;
		font-weight: 400;
	}
	/* la paire qui vient de se faire reste verte et pleine un instant */
	.pèça.est-bon:disabled {
		opacity: 1;
		box-shadow: var(--pc-lev);
		cursor: default;
	}
	/* puis elle se pose : du papier neutre, à plat */
	.pèça.pausada:disabled {
		--pc-fons: var(--l-carta);
		--pc-tinta: var(--t-tinta);
		opacity: 1;
		box-shadow: 0 1px 2px var(--pc-ombre);
		cursor: default;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
