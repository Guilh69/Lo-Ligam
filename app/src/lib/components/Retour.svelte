<script>
	// Revenir en arrière, au même endroit et de la même façon sur toutes les pages (Romain, 2026-11-08,
	// option C : « une pièce ‹ parent sur téléphone, le fil d'Ariane sur ordinateur »).
	//  - sur ordinateur : le fil d'Ariane, « 01 Se parla › Mèdias › Ràdios » ;
	//  - sur téléphone (dès que la place manque) : une pièce de papier « ‹ Mèdias », assez grande pour le pouce.
	// Le chemin se lit dans l'adresse (lib/data/fil.js) : une rubrique ou l'accueil n'affichent rien.
	// `actuelle` : le nom de la page, si le plan du site ne le donne pas (une œuvre, un livre, une fiche).
	import { page } from '$app/state';
	import { tria } from '$lib/stores/lang.svelte.js';
	import { fil } from '$lib/data/fil.js';

	let { actuelle = null, chemin = null } = $props();

	const FIL = { oc: 'Camin dins lo site', fr: 'Fil d’Ariane', es: 'Ruta de navegación', en: 'Breadcrumb', ca: 'Camí de navegació', ar: 'مسار التنقّل' };
	const TORNAR = { oc: 'Tornar a', fr: 'Retour à', es: 'Volver a', en: 'Back to', ca: 'Tornar a', ar: 'العودة إلى' };

	let f = $derived(fil(chemin ?? page.url.pathname));
	let nom = $derived(actuelle ? (typeof actuelle === 'string' ? actuelle : tria(actuelle)) : f?.actuelle ? tria(f.actuelle) : '');
</script>

{#if f}
	<div class="retour">
		<nav class="fil" aria-label={tria(FIL)}>
			{#each f.miettes as m, i (m.href)}
				{#if i}<span class="sep" aria-hidden="true">›</span>{/if}
				<a href={m.href}>{#if m.n}<b>{m.n}</b> {/if}{tria(m.etiq)}</a>
			{/each}
			{#if nom}<span class="sep" aria-hidden="true">›</span><span class="ici" aria-current="page">{nom}</span>{/if}
		</nav>
		<a class="pc pc-2 pc-chip piece" href={f.parent.href} aria-label="{tria(TORNAR)} {tria(f.parent.etiq)}">
			<svg class="chev" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
			<span>{tria(f.parent.etiq)}</span>
		</a>
	</div>
{/if}

<style>
	/* la place disponible décide : c'est le bloc lui-même qui est le contenant, pas la fenêtre */
	.retour {
		container-type: inline-size;
		margin: 0 0 var(--esp-24, 1.5rem);
	}
	.fil {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	.fil a {
		color: inherit;
		text-decoration: none;
	}
	.fil a:hover {
		color: var(--t-tinta);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.fil a:focus-visible {
		outline: 3px solid var(--t-aur-clar, #ffd98a);
		outline-offset: 2px;
		border-radius: 3px;
	}
	/* le numéro de la rubrique, comme ses titres (01, 02, 03) */
	.fil b {
		margin-inline-end: 0.35em;
		color: var(--t-aur);
		font-weight: 700;
	}
	.ici {
		color: var(--t-tinta);
		font-weight: 600;
	}
	:global(html[dir='rtl']) .sep {
		display: inline-block;
		transform: scaleX(-1);
	}

	.piece {
		display: none;
	}
	.chev {
		flex: none;
	}
	:global(html[dir='rtl']) .chev {
		transform: scaleX(-1);
	}
	/* sur téléphone : la pièce « ‹ parent », le fil disparaît */
	@container (max-width: 34rem) {
		.fil {
			display: none;
		}
		.piece {
			display: inline-flex;
		}
	}
</style>
