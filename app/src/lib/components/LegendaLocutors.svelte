<script>
	// La légende de la couche « Locutors » (part de locuteurs par département,
	// enquête OPLO 2020) : cinq classes, la source en lien. Elle était sous la
	// bascule de lecture Territòri / Uèi / Reviscolada, retirée par Romain le
	// 2026-10-23 (« ça fait doublon avec tout le reste » : les couches sont dans
	// le rail) ; elle s'affiche désormais quand la couche est allumée.
	import { CLASSAS, FONT_LOCUTORS, gamaLocutors, alfaLocutors } from '$lib/carta/locutors.js';

	let { lang = 'oc', clar = false, dalt = false, onNaut = () => {} } = $props();

	const T = {
		oc: { gama: 'Locutors, en % dels 15 ans e mai' },
		fr: { gama: 'Locuteurs, en % des 15 ans et plus' }
	};
	const tx = $derived(T[lang] ?? T.oc);
	const gama = $derived(gamaLocutors(dalt));

	// Quand elle partage la rangée des mots à écouter (téléphone, écran moyen),
	// la page décale cette rangée de sa hauteur
	let naut = $state(0);
	let estrech = $state(false);
	$effect(() => {
		const mq = matchMedia('(max-width: 1020px)');
		const f = () => (estrech = mq.matches);
		f();
		mq.addEventListener('change', f);
		return () => mq.removeEventListener('change', f);
	});
	$effect(() => {
		onNaut(estrech && naut ? naut + 10 : 0);
		return () => onNaut(0);
	});
</script>

<div class="gama comandas-carta" bind:clientHeight={naut} style:--alfa={alfaLocutors(clar)}>
	<p>{tx.gama}</p>
	<div class="linha">
		<ol>
			{#each CLASSAS as m, i (m)}
				<li><i style:background={gama[i]}></i><span>{m === 20 ? '20 +' : m}</span></li>
			{/each}
		</ol>
		<a href={FONT_LOCUTORS.url} target="_blank" rel="noopener" title={FONT_LOCUTORS[lang === 'fr' ? 'fr' : 'oc']}>OPLO 2020</a>
	</div>
</div>

<style>
	/* en haut à gauche, sous le bandeau, à la place de l'ancienne bascule */
	.gama {
		position: absolute;
		z-index: 999; /* sous la recherche (1000) : sa liste de résultats passe devant */
		top: calc(var(--cap-bas, 5.4rem) + 18px);
		left: var(--marge, 1rem);
		padding: 0.45rem 0.75rem 0.35rem;
		border-radius: 12px;
		font-family: var(--font-body);
		font-size: 0.72rem;
		color: var(--t-tinta);
		background: var(--t-veire-fort);
		backdrop-filter: blur(10px);
		box-shadow: 0 1px 0 var(--t-linha) inset, 0 16px 40px -20px rgba(0, 0, 0, 0.6);
	}
	.gama p {
		margin: 0 0 0.3rem;
		font-weight: 700;
	}
	.linha {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}
	ol {
		display: flex;
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	i {
		display: block;
		width: 34px;
		height: 10px;
		opacity: var(--alfa);
	}
	li span {
		font-size: 0.66rem;
		font-variant-numeric: tabular-nums;
		color: var(--t-tinta-2);
	}
	a {
		font-size: 0.66rem;
		white-space: nowrap;
		color: var(--t-tinta-2);
		text-underline-offset: 0.2em;
	}

	/* écran moyen et téléphone : sous la recherche (elle prend la rangée du haut) */
	@media (max-width: 1020px) {
		.gama {
			top: calc(var(--cap-bas, 6.4rem) + 18px + 60px);
		}
	}
</style>
