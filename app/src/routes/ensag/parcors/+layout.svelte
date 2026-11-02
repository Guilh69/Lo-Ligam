<script>
	// Banc d'essai de la page du parcours (2026-11-02) : deux propositions
	// construites sur le vrai composant, avec le vrai avancement, à comparer
	// avant d'en appliquer une à /aprene (une troisième, « Los blòcs », écartée
	// par Joan : ce n'était pas un chemin). La pilule du bas passe de l'une à
	// l'autre et simule un avancement (?simul=n : n modules finis) ; elle est
	// volontairement neutre, hors charte, comme l'essai des couleurs de S'apren.
	// Pages de travail, pas indexées.
	import { page } from '$app/stores';

	let { children } = $props();

	// dans l'ordre de Joan : le chemin d'abord, le fil ensuite
	const PROPOSICIONS = [
		['b', 'B · Lo camin'],
		['a', 'A · Lo fial']
	];
	const SIMULS = [
		['', 'Mon avancement'],
		['0', 'Début'],
		['3', 'Unité 1'],
		['11', 'Unité 3'],
		['20', 'Bloc 2'],
		['38', 'Fin de l’A1']
	];
	const actuala = $derived($page.url.pathname.split('/').at(-1));
	const simul = $derived($page.url.searchParams.get('simul') ?? '');
	const ligam = (p, s) => `/ensag/parcors/${p}${s === '' ? '' : `?simul=${s}`}`;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

{@render children()}

<nav class="ensag" aria-label="Essai du parcours">
	<div class="grop">
		{#each PROPOSICIONS as [p, nom] (p)}
			<a href={ligam(p, simul)} aria-current={actuala === p ? 'page' : undefined}>{nom}</a>
		{/each}
	</div>
	<div class="grop">
		{#each SIMULS as [s, nom] (s)}
			<a href={ligam(actuala, s)} aria-current={simul === s ? 'true' : undefined}>{nom}</a>
		{/each}
	</div>
</nav>

<style>
	.ensag {
		position: fixed;
		left: 50%;
		bottom: 0.75rem;
		z-index: 2000;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: max-content;
		max-width: calc(100vw - 1rem);
		transform: translateX(-50%);
		font: 700 0.75rem/1 system-ui, sans-serif;
	}
	.grop {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3px;
		padding: 4px;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
	}
	.ensag a {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		color: #333333;
		text-decoration: none;
		white-space: nowrap;
	}
	.ensag a[aria-current] {
		background: #222222;
		color: #ffffff;
	}
</style>
