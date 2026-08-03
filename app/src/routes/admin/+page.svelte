<script>
	// Contrôle des verrous de sécurité, à refaire à volonté.
	// L'accès à cette page est filtré par admin/+layout.svelte.
	import { supabase } from '$lib/supabaseClient';

	let proves = $state([]);
	let testejant = $state(false);

	function nota(quo, capOk, detalh = '') {
		proves = [...proves, { quo, capOk, detalh }];
	}

	async function testejar() {
		testejant = true;
		proves = [];
		const id = `_ensag-${Date.now()}`;
		const camin = `_ensag/${id}.webp`;

		// On demande le retour des lignes touchées (.select()) plutôt que de se
		// fier à « pas d'erreur » : une politique manquante laisse Postgres
		// répondre « c'est bon » sans avoir rien modifié.
		const apond = await supabase
			.from('temas')
			.insert({ id, oc: 'Ensag', fr: 'Essai', publicat: false })
			.select();
		nota('Apondre un tèma', !apond.error && apond.data?.length === 1, apond.error?.message);

		const modif = await supabase.from('temas').update({ fr: 'Essai modifié' }).eq('id', id).select();
		nota('Lo modificar', !modif.error && modif.data?.[0]?.fr === 'Essai modifié', modif.error?.message);

		const sup = await supabase.from('temas').delete().eq('id', id).select();
		nota('Lo suprimir', !sup.error && sup.data?.length === 1, sup.error?.message);

		const demora = await supabase.from('temas').select('id').eq('id', id);
		nota('Demòra pas res', demora.data?.length === 0);

		const mandat = await supabase.storage
			.from('designs')
			.upload(camin, new Blob([new Uint8Array([82, 73, 70, 70])], { type: 'image/webp' }), {
				contentType: 'image/webp'
			});
		nota('Mandar un imatge', !mandat.error, mandat.error?.message);

		if (!mandat.error) {
			const levat = await supabase.storage.from('designs').remove([camin]);
			nota("Levar l'imatge", !levat.error, levat.error?.message);
		}

		// Doit rester interdit MÊME à l'administrateur : un SVG peut porter du
		// code exécutable et serait servi depuis un dossier public.
		const svg = await supabase.storage
			.from('designs')
			.upload(`_ensag/${id}.svg`, new Blob(['<svg onload="alert(1)"/>'], { type: 'image/svg+xml' }), {
				contentType: 'image/svg+xml'
			});
		nota('Lo SVG demòra refusat, quitament per tu', !!svg.error);
		if (!svg.error) await supabase.storage.from('designs').remove([`_ensag/${id}.svg`]);

		testejant = false;
	}

	const totBon = $derived(proves.length > 0 && proves.every((p) => p.capOk));
</script>

<svelte:head>
	<title>Verrolhs — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<h1>Espaci d'administracion</h1>
	<p class="subtitle"><em>(Espace d'administration)</em></p>

	<p class="msg ok">
		Sès reconegut coma administrator. <em>(Tu es reconnu comme administrateur.)</em>
	</p>

	<h2>Contraròtle dels verrolhs</h2>
	<p class="ajuda">
		Ensaja d'escriure vertadièrament dins la basa e dins lo dorsièr dels fichièrs, puèi neteja
		darrièr el. Res es gardat.
		<em
			>(Essaie d'écrire pour de vrai dans la base et dans le dossier de fichiers, puis nettoie
			derrière lui. Rien n'est conservé.)</em
		>
	</p>

	<button type="button" class="btn-primary" onclick={testejar} disabled={testejant}>
		{testejant ? '…' : 'Testar l’escritura'}
	</button>

	{#if proves.length}
		<ul class="proves" aria-live="polite">
			{#each proves as p (p.quo)}
				<li class:fracas={!p.capOk}>
					<span class="marca" aria-hidden="true">{p.capOk ? '✓' : '✗'}</span>
					<span>
						{p.quo}
						{#if p.detalh}<em class="detalh">{p.detalh}</em>{/if}
					</span>
				</li>
			{/each}
		</ul>

		{#if !testejant}
			<p class="msg" class:ok={totBon} class:error={!totBon} role="status">
				{#if totBon}
					Tot es al verd. <em>(Tout est au vert.)</em>
				{:else}
					Quicòm truca — mòstra aquò a Claude. <em>(Quelque chose cloche — montre ça à Claude.)</em>
				{/if}
			</p>
		{/if}
	{/if}
</section>

<style>
	.subtitle {
		margin: -0.7rem 0 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.ajuda {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-text);
	}

	.ajuda em {
		color: var(--color-teal);
		font-size: 0.95em;
	}

	.proves {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	.proves li {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		color: var(--color-olive);
	}

	.proves li.fracas {
		color: var(--color-brick);
		font-weight: 600;
	}

	.marca {
		font-weight: 700;
	}

	.detalh {
		display: block;
		font-size: 0.8rem;
		opacity: 0.8;
		font-weight: 400;
	}
</style>
