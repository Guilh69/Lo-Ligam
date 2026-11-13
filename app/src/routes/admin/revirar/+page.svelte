<script>
	import AdminTete from '$lib/talhier/AdminTete.svelte';
	import Revirar from '$lib/revirar/Revirar.svelte';
	// Traduire sans aide (2026-11-13) : un entraînement personnel pour Romain.
	// L'accès est filtré par admin/+layout.svelte ; rien n'est enregistré en base.
	// Libellé en français : pas de mot d'occitan nouveau sans vérification.
</script>

<svelte:head>
	<title>Traduire sans aide — Espaci d'administracion</title>
</svelte:head>

<AdminTete oc="Traduire sans aide" fr="" id="revirar-titol" resume="Une phrase de tous les jours en français : traduis-la en occitan, puis lo Congrès vérifie tes mots et la page te montre un modèle." />
<Revirar />
