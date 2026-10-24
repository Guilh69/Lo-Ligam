<script>
	// Page de contrôle du carnet de révision (chantier 20, 2026-10-24) : ce
	// que le carnet a retenu sur cet appareil, carte par carte. Pas encore
	// l'écran des élèves : la séance du jour et le bilan des haltes viendront
	// ensuite. Intitulés en français tant que Romain n'a pas choisi l'occitan.
	import { onMount } from 'svelte';
	import { moduls, ordre } from '$lib/lesson/moduls/index.js';
	import { choses } from '$lib/carnet/choses.js';
	import { carnet, demarrerCarnet } from '$lib/carnet/carnet.svelte.js';
	import { etatCarte, idCarte, aRevoir } from '$lib/carnet/regles.js';

	onMount(demarrerCarnet);

	const LIBELLES = { fermee: 'fermée', nouvelle: 'pas vue', 'en-cours': 'en cours', acquise: 'acquise' };

	let maintenant = $state(new Date());
	onMount(() => {
		const minuterie = setInterval(() => (maintenant = new Date()), 30000);
		return () => clearInterval(minuterie);
	});

	let parModul = $derived(
		ordre
			.map((cle) => ({ cle, modul: moduls[cle], liste: choses.filter((c) => c.modul === cle) }))
			.filter((g) => g.liste.length)
	);
	let ouvertes = $derived(Object.keys(carnet.cartes).length);
	let acquises = $derived(Object.values(carnet.cartes).filter((c) => c.acquise).length);
	let dues = $derived(aRevoir(carnet, maintenant).length);

	function quand(chose, sens) {
		const carte = carnet.cartes[idCarte(chose, sens)];
		if (!carte) return '';
		const due = new Date(carte.fsrs.due);
		if (due <= maintenant) return 'à revoir maintenant';
		return `à revoir le ${due.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à ${due.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
	}

	function jours(chose, sens) {
		const n = carnet.cartes[idCarte(chose, sens)]?.jours.length ?? 0;
		return n === 1 ? '1 jour réussi sur 2' : '';
	}
</script>

<svelte:head>
	<title>Carnet de révision · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="carnet">
	<header>
		<h1>Carnet de révision</h1>
		<p class="chapeau">
			Page de contrôle : ce que le carnet a retenu sur cet appareil.
			{carnet.proprietaire ? 'Il est rattaché à ton compte.' : 'Il est gardé dans ce navigateur, sans compte.'}
		</p>
		<ul class="chiffres">
			<li><strong>{choses.length}</strong> choses apprises dans l'unité 1</li>
			<li><strong>{ouvertes}</strong> cartes ouvertes</li>
			<li><strong>{acquises}</strong> acquises</li>
			<li><strong>{dues}</strong> à revoir maintenant</li>
		</ul>
		<p class="regle">
			Deux cartes par chose : « je reconnais » (questions à choix), puis « je produis » (remettre dans l'ordre),
			qui s'ouvre quand la première est acquise. Une carte est acquise après deux réussites à deux jours différents.
		</p>
	</header>

	{#each parModul as g (g.cle)}
		<section>
			<h2>{g.modul.nivel} · {g.modul.fr}</h2>
			<table>
				<thead>
					<tr><th scope="col">Chose</th><th scope="col">Je reconnais</th><th scope="col">Je produis</th></tr>
				</thead>
				<tbody>
					{#each g.liste as c (c.id)}
						<tr>
							<th scope="row"><span class="oc">{c.oc}</span><span class="fr">{c.fr}</span></th>
							{#each ['reconnais', 'produis'] as sens}
								{@const etat = etatCarte(carnet, c.id, sens)}
								<td>
									<span class="etat {etat}">{LIBELLES[etat]}</span>
									{#if etat !== 'fermee' && etat !== 'nouvelle'}<span class="detail">{quand(c.id, sens)}</span>{/if}
									{#if jours(c.id, sens)}<span class="detail">{jours(c.id, sens)}</span>{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
</main>

<style>
	.carnet {
		max-width: 60rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
		color: var(--color-text);
	}

	h1 {
		font-family: var(--font-heading);
		font-weight: 400;
		margin: 0 0 0.5rem;
	}

	.chapeau,
	.regle {
		margin: 0 0 1rem;
		max-width: 44rem;
	}

	.regle {
		font-size: 0.9rem;
		opacity: 0.85;
	}

	.chiffres {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
	}

	.chiffres li {
		background: white;
		border-radius: 12px;
		padding: 0.5rem 0.9rem;
		box-shadow: 0 4px 12px rgba(58, 42, 32, 0.08);
	}

	section {
		background: white;
		border-radius: 20px;
		padding: 1.25rem 1.4rem;
		box-shadow: 0 8px 20px rgba(58, 42, 32, 0.1);
		margin-top: 1.5rem;
		overflow-x: auto;
	}

	h2 {
		font-size: 1.05rem;
		margin: 0 0 0.75rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		vertical-align: top;
		padding: 0.5rem 0.5rem 0.5rem 0;
		border-top: 1px solid rgba(58, 42, 32, 0.1);
	}

	thead th {
		border-top: none;
		font-size: 0.85rem;
		opacity: 0.75;
	}

	.oc {
		display: block;
		font-weight: 700;
	}

	.fr,
	.detail {
		display: block;
		font-size: 0.82rem;
		font-weight: 400;
		opacity: 0.8;
	}

	.etat {
		display: inline-block;
		border-radius: 999px;
		padding: 0.1rem 0.6rem;
		font-size: 0.85rem;
		white-space: nowrap;
		background: rgba(58, 42, 32, 0.08);
	}

	.etat.en-cours {
		background: var(--color-gold-light);
	}

	.etat.acquise {
		background: var(--color-teal);
		color: white;
	}

	.etat.fermee {
		background: none;
		border: 1px dashed rgba(58, 42, 32, 0.35);
	}
</style>
