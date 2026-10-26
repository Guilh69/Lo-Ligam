<script>
	// Un texte modifiable des groupes (édition sur place) : la langue choisie,
	// le marquage or/italique, masquable par l'administrateur.
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { txt, amagat } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { clau, tag = 'p', class: classe = '' } = $props();
	let v = $derived(txt(clau));
</script>

<svelte:element this={tag} class={classe} lang={langStore.current} hidden={amagat(clau)} use:editar={clau}
	>{#each segments(tria(v)) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}</svelte:element
>
