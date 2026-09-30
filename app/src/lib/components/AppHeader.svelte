<script>
	import logo from '$lib/assets/favicon.svg';
	import OccitaniaIcon from './OccitaniaIcon.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { esAdmin } from '$lib/adminStore';

	let { children } = $props();
	let lang = $derived(langStore.current);

	const t = {
		oc: {
			acuelh: 'Acuèlh',
			acuelhLong: "Tornar a l'acuèlh",
			mond: 'Lo Mond',
			mondLong: 'Veire lo Mond en occitan — la carta',
			admin: 'Administracion'
		},
		fr: {
			acuelh: 'Accueil',
			acuelhLong: "Retour à l'accueil",
			mond: 'Le Monde',
			mondLong: 'Voir le Monde en occitan — la carte',
			admin: 'Administration'
		}
	};
	let tx = $derived(t[lang]);
</script>

<!-- Trois zones nettes : la marque (qui EST le lien d'accueil), la navigation,
     puis à droite le compte, l'administration et la langue. Chaque icône porte
     son libellé écrit, dans la langue choisie : une icône seule ne dit pas ce
     qu'elle ouvre. -->
<header class="top">
	<a class="brand" href="/" title={tx.acuelhLong} aria-label={tx.acuelhLong}>
		<img src={logo} alt="" />
		<span class="brand-name">Lo Ligam</span>
	</a>

	<span class="separador" aria-hidden="true"></span>

	<nav class="nav">
		<a class="nav-ligam" href="/carta" title={tx.mondLong} aria-label={tx.mondLong}>
			<OccitaniaIcon size={18} />
			<span>{tx.mond}</span>
		</a>
	</nav>

	<div class="header-right">
		{#if children}
			<div class="compte">
				{@render children()}
			</div>
		{/if}

		<!-- Visible seulement pour un administrateur. C'est du confort, pas une
		     protection : les verrous sont dans la base (RLS). -->
		{#if $esAdmin}
			<a class="admin-link" href="/admin" title={tx.admin}>
				<span aria-hidden="true">⚙</span>
				<span class="admin-tèxte">{tx.admin}</span>
			</a>
		{/if}

		<!-- Selector de lenga present sus TOTAS las paginas que passan per
		     aqueste entèsta, pas mai sonque sus l'acuèlh. -->
		<div class="lang-toggle" role="group" aria-label="Lenga / Langue">
			<button type="button" class:active={lang === 'oc'} onclick={() => (langStore.current = 'oc')}
				>Òc</button
			>
			<button
				type="button"
				class="fr"
				class:active={lang === 'fr'}
				onclick={() => (langStore.current = 'fr')}>Fr</button
			>
		</div>
	</div>
</header>

<style>
	.top {
		width: 100%;
		max-width: 40rem;
		display: flex;
		align-items: center;
		/* Espacement SERRÉ à l'intérieur d'un groupe, LARGE entre les groupes
		   (voir .separador et .header-right) : c'est ce qui donne la lecture. */
		gap: 0.5rem;
		flex-wrap: wrap;
		row-gap: 0.6rem;
		/* On mesure la largeur DU BANDEAU, pas celle de la fenêtre : le même
		   bandeau vit contraint à 40 rem (aprene, compte) ou pleine largeur
		   (carta). Une media query sur la fenêtre se tromperait dans un cas
		   sur deux. */
		container-type: inline-size;
	}

	/* La marque entière est le lien d'accueil : le nom sert de libellé à
	   l'illustration du mas, plus besoin d'un mot « Acuèlh » redondant. */
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		border-radius: 999px;
		transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.brand:hover {
		transform: scale(1.03);
	}

	/* La teula du logo porte déjà son fond brique et ses coins arrondis :
	   aucun fond derrière. */
	.brand :global(img) {
		width: 2rem;
		height: 2rem;
		border-radius: 8px;
		transition: box-shadow 150ms ease;
	}

	.brand:hover :global(img) {
		box-shadow: 0 3px 10px rgba(165, 52, 42, 0.35);
	}

	.brand-name {
		font-family: var(--font-logo); /* lo wordmark garda Fredoka (charte §2) */
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--color-text);
		white-space: nowrap;
	}

	.separador {
		width: 1px;
		height: 1.4rem;
		background: rgba(58, 42, 32, 0.16);
		margin: 0 0.15rem;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.nav-ligam {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2.2rem;
		padding: 0 0.8rem;
		border-radius: 999px;
		background: rgba(31, 95, 99, 0.1);
		color: var(--color-teal);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.nav-ligam:hover {
		background: rgba(31, 95, 99, 0.18);
		transform: scale(1.04);
	}

	.header-right {
		margin-left: auto;
		display: flex;
		align-items: center;
		/* Plus large qu'à l'intérieur des groupes : sépare compte / admin / langue. */
		gap: 0.7rem;
	}

	/* Le bloc compte fourni par la page : encadré discret, pour qu'un pseudo
	   ne se confonde jamais avec le nom du site à gauche. */
	.compte {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.2rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		background: rgba(58, 42, 32, 0.05);
		font-size: 0.82rem;
	}

	/* Une page peut passer un bloc vide (état de session pas encore connu) :
	   sans ça, une pastille grise flotterait toute seule dans le bandeau. */
	.compte:empty {
		display: none;
	}

	.admin-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		height: 2.2rem;
		padding: 0 0.75rem;
		border-radius: 999px;
		background: rgba(31, 95, 99, 0.12);
		color: var(--color-teal);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-decoration: none;
		white-space: nowrap;
		transition: background-color 150ms ease;
	}

	.admin-link:hover {
		background: rgba(31, 95, 99, 0.2);
	}

	/* Même sélecteur de langue que sur l'accueil, pour que le geste soit
	   identique partout. */
	.lang-toggle {
		display: flex;
		gap: 0.3rem;
		height: 2.2rem;
		align-items: center;
		background: white;
		padding: 0 0.25rem;
		border-radius: 999px;
		box-shadow: 0 2px 8px rgba(58, 42, 32, 0.12);
	}

	.lang-toggle button {
		border: none;
		background: transparent;
		color: var(--color-text);
		font-weight: 600;
		font-size: 0.8rem;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lang-toggle button:hover {
		transform: scale(1.08);
	}

	.lang-toggle button:active {
		transform: scale(0.95);
	}

	.lang-toggle button.active {
		background: var(--color-terracotta);
		color: white;
	}

	.lang-toggle button.fr.active {
		background: var(--color-sky);
	}

	/* Dégradation par ordre de sacrifice : on retire d'abord les mots dont
	   l'icône suffit (l'engrenage dit « administration »), puis le pseudo
	   (son initiale reste), puis le nom du site. Le libellé de la carte,
	   lui, ne disparaît jamais : c'est celui qu'on ne devine pas. */
	@container (max-width: 41rem) {
		.admin-tèxte {
			display: none;
		}

		.admin-link {
			padding: 0 0.6rem;
		}
	}

	@container (max-width: 34rem) {
		.compte :global(.account-email) {
			display: none;
		}
	}

	@container (max-width: 26rem) {
		.separador {
			display: none;
		}

		.brand-name {
			display: none;
		}
	}
</style>
