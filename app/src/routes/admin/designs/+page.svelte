<script>
	// Gestion des designs : lister, ajouter, modifier, publier, réordonner,
	// supprimer. L'accès est filtré par admin/+layout.svelte, mais ce qui
	// protège réellement, ce sont les politiques RLS de la base.
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import {
		redimensionar,
		slug,
		esEnStorage,
		caminStorage,
		pes,
		LARGOR_MINI,
		LARGOR_GRAND
	} from '$lib/imatges';
	import {
		PLAFON_VIDEO,
		esVideoStorage,
		caminVideoStorage,
		ligamCanvaEmbed,
		menaVideo
	} from '$lib/videos';

	let temas = $state([]);
	let fichas = $state([]);
	let cargant = $state(true);
	let msg = $state(null);

	let filtreTema = $state('all');
	let cerca = $state('');

	let forma = $state(null);
	let estatEnregistrament = $state('');
	let confirmaSup = $state(null);

	const adreçaPublica = (camin) =>
		supabase.storage.from('designs').getPublicUrl(camin).data.publicUrl;

	let visiblas = $derived.by(() => {
		const c = cerca.trim().toLowerCase();
		return fichas.filter(
			(f) =>
				(filtreTema === 'all' || f.tema_id === filtreTema) &&
				(!c || f.titre.toLowerCase().includes(c))
		);
	});

	// Le réordonnancement n'a de sens que sur un thème précis et sans recherche :
	// autrement, « monter » n'aurait pas de voisin évident.
	let pòtReordenar = $derived(filtreTema !== 'all' && !cerca.trim());

	const nomTema = (id) => temas.find((t) => t.id === id)?.oc ?? id;

	onMount(cargar);

	async function cargar() {
		cargant = true;
		const [t, f] = await Promise.all([
			supabase.from('temas').select('*').order('ordre'),
			supabase.from('fichas').select('*')
		]);
		cargant = false;
		if (t.error || f.error) {
			msg = { tipe: 'error', text: (t.error ?? f.error).message };
			return;
		}
		temas = t.data;
		const rang = new Map(t.data.map((x, i) => [x.id, i]));
		fichas = f.data.sort(
			(a, b) => (rang.get(a.tema_id) ?? 9999) - (rang.get(b.tema_id) ?? 9999) || a.ordre - b.ordre
		);
	}

	function obrirNòu() {
		msg = null;
		forma = {
			mode: 'nòu',
			id: null,
			titre: '',
			tema_id: filtreTema !== 'all' ? filtreTema : (temas[0]?.id ?? ''),
			publicat: true,
			fichier: null,
			apercebut: null,
			videoMena: 'cap',
			videoFichier: null,
			videoLigam: '',
			videoActuala: null
		};
	}

	function obrirEdicion(f) {
		msg = null;
		forma = {
			mode: 'edicion',
			id: f.id,
			titre: f.titre,
			tema_id: f.tema_id,
			publicat: f.publicat,
			fichier: null,
			apercebut: f.mini_url,
			videoMena: menaVideo(f.video_url),
			videoFichier: null,
			videoLigam: f.video_url && !esVideoStorage(f.video_url) ? f.video_url : '',
			videoActuala: f.video_url ?? null
		};
	}

	function causirVideo(e) {
		const fichier = e.target.files?.[0];
		if (!fichier) return;
		if (fichier.type !== 'video/mp4') {
			msg = { tipe: 'error', text: 'Cal un MP4. (Il faut un MP4.)' };
			e.target.value = '';
			return;
		}
		// On prévient AVANT l'envoi plutôt que de laisser le serveur refuser
		// après plusieurs mégaoctets téléversés pour rien.
		if (fichier.size > PLAFON_VIDEO) {
			msg = {
				tipe: 'error',
				text: `Aquesta vidèo fa ${pes(fichier.size)} — lo plafon es ${pes(PLAFON_VIDEO)}. Fai-la lisar sus outils/preparar-video.cmd, puèi manda lo fichièr « -web.mp4 ». (Fais-la glisser sur outils/preparar-video.cmd, puis envoie le fichier « -web.mp4 ».)`
			};
			e.target.value = '';
			return;
		}
		msg = null;
		forma.videoFichier = fichier;
	}

	function tancarForma() {
		if (forma?.fichier && forma.apercebut) URL.revokeObjectURL(forma.apercebut);
		forma = null;
	}

	function causirFichier(e) {
		const fichier = e.target.files?.[0];
		if (!fichier) return;
		if (fichier.type === 'image/svg+xml') {
			msg = {
				tipe: 'error',
				text: 'Lo SVG es pas acceptat : pòt portar de còdi executable. (Le SVG n’est pas accepté : il peut contenir du code exécutable.)'
			};
			e.target.value = '';
			return;
		}
		if (!/^image\/(png|jpeg|webp)$/.test(fichier.type)) {
			msg = {
				tipe: 'error',
				text: 'Format pas acceptat : cal un PNG, un JPEG o un WebP. (Format non accepté : il faut un PNG, un JPEG ou un WebP.)'
			};
			e.target.value = '';
			return;
		}
		msg = null;
		if (forma.fichier && forma.apercebut) URL.revokeObjectURL(forma.apercebut);
		forma.fichier = fichier;
		forma.apercebut = URL.createObjectURL(fichier);
	}

	// Résout ce qu'il faut inscrire dans `video_url`, en téléversant ou en
	// nettoyant ce qui doit l'être. Renvoie l'adresse, ou null si la fiche n'a
	// pas de vidéo.
	async function resolverVideo(id) {
		const camin = `fichas/${id}.mp4`;
		const ancianaChesNos = esVideoStorage(forma.videoActuala)
			? caminVideoStorage(forma.videoActuala)
			: null;

		if (forma.videoMena === 'cap') {
			if (ancianaChesNos) await supabase.storage.from('videos').remove([ancianaChesNos]);
			return null;
		}

		if (forma.videoMena === 'canva') {
			const ligam = ligamCanvaEmbed(forma.videoLigam);
			if (!ligam)
				throw new Error(
					'lo ligam Canva es pas reconegut — pega l’adreça o lo còdi d’integracion'
				);
			if (ancianaChesNos) await supabase.storage.from('videos').remove([ancianaChesNos]);
			return ligam;
		}

		if (forma.videoFichier) {
			estatEnregistrament = `Mandadís de la vidèo… (${pes(forma.videoFichier.size)})`;
			const u = await supabase.storage
				.from('videos')
				.upload(camin, forma.videoFichier, { contentType: 'video/mp4', upsert: true });
			if (u.error) throw u.error;
			// L'adresse ne change pas quand on remplace un fichier : sans ce
			// repère, les navigateurs continueraient d'afficher l'ancienne vidéo.
			return `${supabase.storage.from('videos').getPublicUrl(camin).data.publicUrl}?v=${Date.now()}`;
		}

		if (forma.videoActuala) return forma.videoActuala;
		throw new Error('cal causir una vidèo, o « cap de vidèo »');
	}

	async function enregistrar() {
		msg = null;
		const titre = forma.titre.trim();
		if (!titre) {
			msg = { tipe: 'error', text: 'Cal un títol. (Il faut un titre.)' };
			return;
		}
		if (!forma.tema_id) {
			msg = { tipe: 'error', text: 'Cal causir un tèma. (Il faut choisir un thème.)' };
			return;
		}
		if (forma.mode === 'nòu' && !forma.fichier) {
			msg = { tipe: 'error', text: 'Cal causir un imatge. (Il faut choisir une image.)' };
			return;
		}

		try {
			if (forma.mode === 'edicion') {
				const video_url = await resolverVideo(forma.id);
				estatEnregistrament = 'Enregistrament…';
				const r = await supabase
					.from('fichas')
					.update({ titre, tema_id: forma.tema_id, publicat: forma.publicat, video_url })
					.eq('id', forma.id)
					.select();
				if (r.error) throw r.error;
				if (!r.data?.length) throw new Error('cap de linha cambiada — dreches refusats ?');
			} else {
				// Identifiant sur le modèle des 204 fiches d'origine : thème--titre.
				const basa = `${forma.tema_id}--${slug(titre)}`;
				const presas = new Set(fichas.map((f) => f.id));
				let id = basa;
				let n = 2;
				while (presas.has(id)) id = `${basa}-${n++}`;

				// Redimensionné AVANT l'envoi : l'export Canva d'origine, souvent
				// lourd, ne traverse jamais le réseau.
				estatEnregistrament = 'Preparacion de l’imatge…';
				const mini = await redimensionar(forma.fichier, LARGOR_MINI);
				const grand = await redimensionar(forma.fichier, LARGOR_GRAND);

				estatEnregistrament = `Mandadís… (${pes(mini.size + grand.size)})`;
				const cMini = `fichas/${id}-mini.webp`;
				const cGrand = `fichas/${id}-grand.webp`;

				const u1 = await supabase.storage
					.from('designs')
					.upload(cMini, mini, { contentType: 'image/webp' });
				if (u1.error) throw u1.error;

				const u2 = await supabase.storage
					.from('designs')
					.upload(cGrand, grand, { contentType: 'image/webp' });
				if (u2.error) {
					await supabase.storage.from('designs').remove([cMini]);
					throw u2.error;
				}

				const video_url = await resolverVideo(id);

				estatEnregistrament = 'Enregistrament…';
				const dedins = fichas.filter((f) => f.tema_id === forma.tema_id).map((f) => f.ordre);
				const ordre = (dedins.length ? Math.max(...dedins) : -1) + 1;

				const ins = await supabase
					.from('fichas')
					.insert({
						id,
						tema_id: forma.tema_id,
						titre,
						mini_url: adreçaPublica(cMini),
						grand_url: adreçaPublica(cGrand),
						video_url,
						ordre,
						publicat: forma.publicat
					})
					.select();

				// Si la ligne n'a pas pu être écrite, on ne laisse ni images ni
				// vidéo orphelines derrière soi.
				if (ins.error) {
					await supabase.storage.from('designs').remove([cMini, cGrand]);
					if (esVideoStorage(video_url)) {
						await supabase.storage.from('videos').remove([caminVideoStorage(video_url)]);
					}
					throw ins.error;
				}
			}

			tancarForma();
			await cargar();
			msg = { tipe: 'ok', text: 'Enregistrat. (Enregistré.)' };
		} catch (e) {
			msg = { tipe: 'error', text: e?.message ?? String(e) };
		} finally {
			estatEnregistrament = '';
		}
	}

	async function bascularPublicat(f) {
		msg = null;
		const r = await supabase
			.from('fichas')
			.update({ publicat: !f.publicat })
			.eq('id', f.id)
			.select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'cambiament refusat' };
			return;
		}
		f.publicat = !f.publicat;
	}

	async function suprimir(f) {
		msg = null;
		const r = await supabase.from('fichas').delete().eq('id', f.id).select();
		if (r.error || !r.data?.length) {
			msg = { tipe: 'error', text: r.error?.message ?? 'supression refusada' };
			return;
		}

		// On ne touche qu'aux images envoyées depuis ici. Les 204 fiches d'origine
		// vivent dans app/static/ et ne sont pas dans le dossier de fichiers.
		const camins = [f.mini_url, f.grand_url].filter(esEnStorage).map(caminStorage).filter(Boolean);
		if (camins.length) await supabase.storage.from('designs').remove(camins);

		// La vidéo vit dans un autre dossier — un lien Canva, lui, n'est pas à
		// nous et ne se supprime pas.
		if (esVideoStorage(f.video_url)) {
			await supabase.storage.from('videos').remove([caminVideoStorage(f.video_url)]);
		}

		confirmaSup = null;
		await cargar();
		msg = { tipe: 'ok', text: `« ${f.titre} » suprimida.` };
	}

	async function desplaçar(f, sens) {
		msg = null;
		const grop = fichas.filter((x) => x.tema_id === f.tema_id);
		const i = grop.findIndex((x) => x.id === f.id);
		const j = i + sens;
		if (j < 0 || j >= grop.length) return;

		// Deux écritures successives : si la seconde échouait, deux fiches
		// partageraient le même rang. Sans gravité — le rechargement qui suit
		// remet l'affichage d'aplomb, et un nouveau déplacement corrige.
		const autre = grop[j];
		const rangF = f.ordre;
		const r1 = await supabase.from('fichas').update({ ordre: autre.ordre }).eq('id', f.id).select();
		const r2 = await supabase
			.from('fichas')
			.update({ ordre: rangF })
			.eq('id', autre.id)
			.select();
		if (r1.error || r2.error) msg = { tipe: 'error', text: (r1.error ?? r2.error).message };
		await cargar();
	}
</script>

<svelte:head>
	<title>Designs — Espaci d'administracion</title>
</svelte:head>

<section class="card">
	<div class="cap">
		<div>
			<h1>Designs</h1>
			<p class="subtitle">
				{fichas.length} fichas, {temas.length} tèmas
				<em>({fichas.filter((f) => !f.publicat).length} pas publicadas)</em>
			</p>
		</div>
		<button type="button" class="btn-primary" onclick={obrirNòu} disabled={!temas.length}>
			+ Apondre
		</button>
	</div>

	{#if msg}
		<p class="msg {msg.tipe}" role="status">{msg.text}</p>
	{/if}

	{#if forma}
		<form class="forma" onsubmit={(e) => (e.preventDefault(), enregistrar())}>
			<h2>{forma.mode === 'nòu' ? 'Apondre un design' : 'Modificar'}</h2>

			<div class="forma-grasilha">
				<div class="apercebut">
					{#if forma.apercebut}
						<img src={forma.apercebut} alt="" />
					{:else}
						<span>Cap d’imatge</span>
					{/if}
				</div>

				<div class="camps">
					<label>
						Títol <em>(titre)</em>
						<input type="text" bind:value={forma.titre} maxlength="80" required />
					</label>

					<label>
						Tèma <em>(thème)</em>
						<select bind:value={forma.tema_id}>
							{#each temas as t (t.id)}
								<option value={t.id}>{t.oc} — {t.fr}</option>
							{/each}
						</select>
					</label>

					{#if forma.mode === 'nòu'}
						<label>
							Imatge <em>(PNG, JPEG o WebP)</em>
							<input
								type="file"
								accept="image/png,image/jpeg,image/webp"
								onchange={causirFichier}
							/>
						</label>
						<p class="ajuda">
							L’imatge es reduita dins ton navigador en dos formats ({LARGOR_MINI} e {LARGOR_GRAND} px)
							abans lo mandadís. Ton fichièr d’origina, el, sortís pas de ton ordenador.
							<em
								>(L’image est réduite dans ton navigateur en deux formats avant l’envoi. Ton fichier
								d’origine ne quitte pas ton ordinateur.)</em
							>
						</p>
					{/if}

					<label>
						Vidèo <em>(facultativa — jòga a la dubertura de la ficha)</em>
						<select bind:value={forma.videoMena}>
							<option value="cap">Cap de vidèo</option>
							<option value="mp4">Mandar un MP4</option>
							<option value="canva">Ligam Canva</option>
						</select>
					</label>

					{#if forma.videoMena === 'mp4'}
						<label>
							Fichièr <em>({pes(PLAFON_VIDEO)} au maximum)</em>
							<input type="file" accept="video/mp4" onchange={causirVideo} />
						</label>
						{#if forma.videoFichier}
							<p class="ajuda">
								Causit : {forma.videoFichier.name} — <strong>{pes(forma.videoFichier.size)}</strong>
							</p>
						{:else if esVideoStorage(forma.videoActuala)}
							<p class="ajuda">
								Una vidèo es ja estacada. Causís un fichièr solament per la remplaçar.
								<em>(Une vidéo est déjà attachée. Choisis un fichier seulement pour la remplacer.)</em>
							</p>
						{/if}
						<p class="ajuda">
							Fai lisar ton expòrt Canva sus <code>outils/preparar-video.cmd</code> e manda lo
							fichièr « -web.mp4 » que ne sortís. Un expòrt brut es refusat : es pas tant una
							question de plaça que de donadas telecargadas per cada visitaire.
							<em
								>(Fais glisser ton export Canva sur outils/preparar-video.cmd et envoie le fichier
								« -web.mp4 » qui en sort.)</em
							>
						</p>
					{:else if forma.videoMena === 'canva'}
						<label>
							Ligam Canva <em>(l’adreça o lo còdi d’integracion)</em>
							<input
								type="text"
								bind:value={forma.videoLigam}
								placeholder="https://www.canva.com/design/…"
							/>
						</label>
						<p class="ajuda">
							Pesa pas res per nosautres, mas lo design vira public sus Canva e lor lector
							pausa de traçadors. Es doncas cargat pas qu’al clic del visitaire.
							<em
								>(Ne pèse rien pour nous, mais le design devient public sur Canva et leur lecteur
								dépose des traceurs. Il n’est donc chargé qu’au clic du visiteur.)</em
							>
						</p>
					{/if}

					<label class="casa">
						<input type="checkbox" bind:checked={forma.publicat} />
						<span>Publicada <em>(visible pels visitaires)</em></span>
					</label>
				</div>
			</div>

			<div class="accions">
				<button type="submit" class="btn-primary" disabled={!!estatEnregistrament}>
					{estatEnregistrament || 'Enregistrar'}
				</button>
				<button
					type="button"
					class="btn-segond"
					onclick={tancarForma}
					disabled={!!estatEnregistrament}
				>
					Anullar
				</button>
			</div>
		</form>
	{/if}

	<div class="filtres">
		<label class="filtre">
			<span class="sr-only">Tèma</span>
			<select bind:value={filtreTema}>
				<option value="all">Totes los tèmas ({fichas.length})</option>
				{#each temas as t (t.id)}
					<option value={t.id}>
						{t.oc} ({fichas.filter((f) => f.tema_id === t.id).length})
					</option>
				{/each}
			</select>
		</label>
		<label class="filtre">
			<span class="sr-only">Cercar</span>
			<input type="text" placeholder="Cercar un títol…" bind:value={cerca} />
		</label>
	</div>

	{#if cargant}
		<p class="subtitle">Cargament…</p>
	{:else if !visiblas.length}
		<p class="msg info">Cap de ficha aicí. <em>(Aucune fiche ici.)</em></p>
	{:else}
		<ul class="lista">
			{#each visiblas as f, i (f.id)}
				<li class:rescondida={!f.publicat}>
					<img class="vinheta" src={f.mini_url} alt="" loading="lazy" width="56" height="56" />

					<div class="tèxte">
						<strong>{f.titre}</strong>
						<span class="meta">
							{nomTema(f.tema_id)}
							{#if !f.publicat}· <span class="pas-publicat">pas publicada</span>{/if}
							{#if esEnStorage(f.mini_url)}· mandada{/if}
							{#if f.video_url}· <span class="ten-video">{menaVideo(f.video_url) === 'canva' ? 'vidèo Canva' : 'vidèo'}</span>{/if}
						</span>
					</div>

					{#if pòtReordenar}
						<div class="rang">
							<button
								type="button"
								class="btn-icòna"
								onclick={() => desplaçar(f, -1)}
								disabled={i === 0}
								aria-label="Montar « {f.titre} »">↑</button
							>
							<button
								type="button"
								class="btn-icòna"
								onclick={() => desplaçar(f, 1)}
								disabled={i === visiblas.length - 1}
								aria-label="Davalar « {f.titre} »">↓</button
							>
						</div>
					{/if}

					{#if confirmaSup === f.id}
						<div class="accions-linha">
							<span class="segur">Segur ?</span>
							<button type="button" class="btn-segond btn-perilhos" onclick={() => suprimir(f)}>
								Òc, suprimir
							</button>
							<button type="button" class="btn-segond" onclick={() => (confirmaSup = null)}>
								Non
							</button>
						</div>
					{:else}
						<div class="accions-linha">
							<button type="button" class="btn-segond" onclick={() => bascularPublicat(f)}>
								{f.publicat ? 'Rescondre' : 'Publicar'}
							</button>
							<button type="button" class="btn-segond" onclick={() => obrirEdicion(f)}>
								Modificar
							</button>
							<button
								type="button"
								class="btn-segond btn-perilhos"
								onclick={() => (confirmaSup = f.id)}
								aria-label="Suprimir « {f.titre} »">Suprimir</button
							>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.cap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Le sous-titre du portail remonte de -0.7rem : c'est voulu dans une carte
	   dont les enfants sont espacés par un « gap ». Ici il est dans un bloc
	   ordinaire, où cette marge le ferait chevaucher le titre. */
	.cap > div {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.subtitle {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-teal);
	}

	.subtitle em {
		opacity: 0.8;
	}

	.forma {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--color-cream);
		border-radius: 16px;
		padding: 1.25rem;
	}

	.forma-grasilha {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.apercebut {
		flex: 0 0 160px;
		height: 160px;
		border-radius: 12px;
		background: white;
		border: 1.5px dashed rgba(58, 42, 32, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		font-size: 0.8rem;
		color: var(--color-teal);
	}

	.apercebut img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.camps {
		flex: 1 1 16rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.camps :global(label em) {
		font-weight: 400;
		color: var(--color-teal);
		font-size: 0.8rem;
	}

	.casa {
		flex-direction: row !important;
		align-items: center;
		gap: 0.5rem;
	}

	.ajuda {
		margin: 0;
		font-size: 0.78rem;
		line-height: 1.45;
		color: var(--color-text);
	}

	.ajuda em {
		color: var(--color-teal);
	}

	.accions {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.filtres {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.filtre {
		flex: 1 1 12rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		max-height: 60vh;
		overflow-y: auto;
	}

	.lista li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 12px;
		background: var(--color-cream);
		flex-wrap: wrap;
	}

	.lista li.rescondida {
		opacity: 0.62;
	}

	.vinheta {
		width: 56px;
		height: 56px;
		object-fit: contain;
		border-radius: 8px;
		background: white;
		flex: 0 0 auto;
	}

	.tèxte {
		flex: 1 1 10rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.tèxte strong {
		font-size: 0.95rem;
		color: var(--color-text);
	}

	.meta {
		font-size: 0.78rem;
		color: var(--color-teal);
	}

	.pas-publicat {
		color: var(--color-brick);
		font-weight: 600;
	}

	.ten-video {
		color: var(--color-olive);
		font-weight: 600;
	}

	.ajuda code {
		font-size: 0.95em;
		background: white;
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
	}

	.rang {
		display: flex;
		gap: 0.2rem;
	}

	.btn-icòna {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		border: 1.5px solid rgba(58, 42, 32, 0.2);
		background: white;
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.btn-icòna:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.accions-linha {
		display: flex;
		gap: 0.35rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.segur {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-brick);
	}
</style>
