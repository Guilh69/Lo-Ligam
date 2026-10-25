<script>
	import Icona from '$lib/components/Icona.svelte';
	// Espace « Òbras » : ce que Romain fait découvrir.
	//
	// On n'héberge aucun extrait. On donne les informations, son commentaire, et
	// on laisse écouter par le lecteur officiel, chargé SEULEMENT au clic : avant
	// ça, aucune requête ne part chez un tiers, donc aucun traceur.
	//
	// Les musiques (2026-10-25, choix de Romain sur maquettes) : une pochette
	// de couleur par artiste, le disque qui dépasse sort au clic (« Las
	// pochetas ») ; Bandcamp au centre, les autres liens en option. Romain
	// ajoute un artiste « tout d'un coup » : il colle ses liens dans une seule
	// case, le nom et le lecteur Bandcamp se trouvent seuls (/api/bandcamp),
	// sa phrase s'il veut, « Publicar ». « Escotar aicí » ouvre d'abord une
	// phrase qui dit ce que la plateforme recevra ; le lecteur ne se charge
	// qu'après l'accord, qui vaut pour la visite.
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { plataforma, lectorPer, ligamsCollats } from '$lib/obras';
	import { PALETAS, PALETA_PER_DEFAUT } from '$lib/apren/teulas.js';
	import { afichas } from '$lib/data/afichas.js';
	import { edicion, iniciar, txt, ligam, imatge, lista, amagat, apondre, cambiar, causir, publicar, mandarImatge } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';

	let { data } = $props();
	const lèvaEdicion = iniciar('obras', data.elements);
	$effect(() => () => lèvaEdicion?.());

	let lang = $derived(langStore.current);
	let fr = $derived(lang === 'fr');

	const t = {
		oc: {
			title: 'Òbras',
			lead: 'Çò qu’escoti, çò que legissi, çò que te fau descobrir en occitan.',
			escotar: 'Escotar aicí',
			acòrd: (p) => `Escotar sus ${p} ? Son lector recebrà ton adreça IP e poirà pausar de cookies.`,
			òc: 'Escotar',
			non: 'Non, mercé',
			ligams: 'Ont escotar',
			void: 'Encara res aicí. Lèu.',
			afichas: 'Afichas',
			afichasLead: 'D’afichas que fan parlar la lenga sus las parets.',
			agrandir: 'Veire en grand',
			tampar: 'Tampar'
		},
		fr: {
			title: 'Œuvres',
			lead: 'Ce que j’écoute, ce que je lis, ce que je te fais découvrir en occitan.',
			escotar: 'Écouter ici',
			acòrd: (p) => `Écouter sur ${p} ? Son lecteur recevra ton adresse IP et pourra déposer des cookies.`,
			òc: 'Écouter',
			non: 'Non merci',
			ligams: 'Où écouter',
			void: 'Rien encore ici. Bientôt.',
			afichas: 'Affiches',
			afichasLead: 'Des affiches qui font parler la langue sur les murs.',
			agrandir: 'Voir en grand',
			tampar: 'Fermer'
		}
	};
	let tx = $derived(t[lang]);

	// la couleur d'une pochette suit sa place, comme les cases des rubriques
	const color = (i) => PALETAS[PALETA_PER_DEFAUT][i % PALETAS[PALETA_PER_DEFAUT].length];
	const ÈS_LECTOR = (clau) => clau.endsWith('.lector');

	// Les liens visibles d'une pochette, rangés (Bandcamp d'abord) ; le lecteur
	// trouvé à l'ajout est rangé à part (`<clau>.lector`)
	function ligamsDe(clau) {
		return lista(clau)
			.filter((e) => e.tipe === 'ligam' && !ÈS_LECTOR(e.clau))
			// (« /https://… » : le « / » de départ resté devant une adresse collée)
			.map((e) => ({ clau: e.clau, l: ligam(e.clau) }))
			.map((x) => ({ ...x, l: { ...x.l, href: x.l.href?.replace(/^\/+(?=https?:)/, '') } }))
			.map((x) => ({ ...x, p: plataforma(x.l.href) }))
			.filter((x) => edicion.actiu || x.p)
			.sort((a, b) => (a.p?.rang ?? 9) - (b.p?.rang ?? 9));
	}
	// le lecteur : celui de Bandcamp s'il a été trouvé, sinon Deezer ou YouTube
	const lectorDe = (clau, ligams) =>
		lectorPer(ligam(clau + '.lector').href) ?? ligams.map((x) => lectorPer(x.l.href)).find((l) => l?.src) ?? null;

	let demanda = $state(null); // la pochette dont la phrase d'accord est ouverte
	let dubèrt = $state(null); // la pochette dont le disque est sorti
	let acòrds = $state({}); // plateformes acceptées pendant la visite
	function escotar(clau, lector) {
		if (acòrds[lector.plataforma]) dubèrt = clau;
		else demanda = clau;
	}
	function acceptar(clau, lector) {
		acòrds[lector.plataforma] = true;
		demanda = null;
		dubèrt = clau;
	}

	// --- l'ajout « tout d'un coup » (édition seulement) ---
	let formulari = $state(false);
	let collats = $state('');
	let nòuNom = $state('');
	let nomTocat = $state(false); // Romain a corrigé le nom : on n'y touche plus
	let frasaOc = $state('');
	let frasaFr = $state('');
	let lectorTrobat = $state(null);
	let imatgeTrobada = $state(null); // l'image de la page Bandcamp (og:image)
	let cèrca = $state(false);
	let error = $state('');
	let trobats = $derived(ligamsCollats(collats));
	let fichaBandcamp = $derived(trobats.find((l) => plataforma(l)?.nom === 'Bandcamp') ?? null);

	let darrièr = null;
	$effect(() => {
		const u = fichaBandcamp;
		if (!u || u === darrièr) return;
		darrièr = u;
		cèrca = true;
		fetch('/api/bandcamp?u=' + encodeURIComponent(u))
			.then((r) => (r.ok ? r.json() : null))
			.then((r) => {
				if (darrièr !== u) return;
				lectorTrobat = r?.lector ?? null;
				imatgeTrobada = r?.imatge ?? null;
				if (r?.nom && !nomTocat) nòuNom = r.nom;
			})
			.catch(() => {})
			.finally(() => (cèrca = false));
	});

	function voidar() {
		formulari = false;
		collats = nòuNom = frasaOc = frasaFr = error = '';
		nomTocat = false;
		lectorTrobat = imatgeTrobada = darrièr = null;
	}

	// L'image (option A de Romain, 2026-10-25) : copiée et allégée par notre
	// serveur, puis rangée dans le stockage des images du site ; Romain peut la
	// remplacer ensuite comme toute image de la page.
	const copiaImatge = (u) => '/api/bandcamp/imatge?u=' + encodeURIComponent(u);
	async function pausarImatge(clau, u, nom) {
		const r = await fetch(copiaImatge(u)).catch(() => null);
		if (!r?.ok) return false;
		const clauIm = `${clau}.imatge`;
		await mandarImatge(clauIm, new File([await r.blob()], 'pocheta.webp', { type: 'image/webp' }));
		const im = imatge(clauIm);
		if (!im?.url) return false;
		cambiar(clauIm, { lista: clau, oc: '', fr: '', imatge: { ...im, alt_oc: nom, alt_fr: nom } }, { tipe: 'imatge', tot_d_un_còp: true });
		return true;
	}
	// pour une fiche déjà là : l'image de son premier lien Bandcamp
	let cèrcaImatge = $state(null);
	async function imatgeDeBandcamp(clau, ligams, nom) {
		const u = ligams.find((x) => x.p?.nom === 'Bandcamp')?.l.href;
		if (!u) return;
		cèrcaImatge = clau;
		const r = await fetch('/api/bandcamp?u=' + encodeURIComponent(u))
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
		if (!(r?.imatge && (await pausarImatge(clau, r.imatge, nom)))) edicion.messatge = { tipe: 'error', text: fr ? 'Pas d’image trouvée sur cette page Bandcamp.' : 'Cap d’imatge sus aquesta pagina Bandcamp.' };
		cèrcaImatge = null;
	}
	async function publicarArtista() {
		const nom = nòuNom.trim();
		if (!trobats.length) return (error = fr ? 'Colle au moins un lien.' : 'Pega al mens un ligam.');
		if (!nom) return (error = fr ? 'Il manque le nom.' : 'Manca lo nom.');
		const sensFrasa = !frasaOc.trim() && !frasaFr.trim();
		const clau = apondre('obras.artistas', 'bloc', {}, [
			['nom', 'text', { oc: nom, fr: nom }],
			['tèxt', 'text', { oc: frasaOc.trim(), fr: frasaFr.trim() || frasaOc.trim(), visible: !sensFrasa }]
		]);
		for (const u of trobats) apondre(clau, 'ligam', { oc: '', fr: '', ligam: u });
		if (lectorTrobat) cambiar(`${clau}.lector`, { oc: '', fr: '', ligam: lectorTrobat }, { tipe: 'ligam', lista: clau, tot_d_un_còp: true });
		if (imatgeTrobada) await pausarImatge(clau, imatgeTrobada, nom);
		causir(null);
		await publicar();
		voidar();
	}

	const apondreLigam = (clau) => apondre(clau, 'ligam', { oc: '', fr: '', ligam: '/' });
	// le nom affiché d'un lien : celui que Romain a écrit, sinon la plateforme
	const nomLigam = (x) => (fr ? x.l.fr : x.l.oc) || x.p?.nom || (fr ? 'Coller l’adresse' : 'Pegar l’adreça');

	// Galerie : la grande image se charge seulement à l'ouverture (<dialog> natif :
	// Échap ferme, le focus revient au bouton, la page derrière est inerte).
	let vista = $state(null);
	let dialeg;
	function dobrir(a) {
		vista = a;
		dialeg.showModal();
	}
	function tampar() {
		dialeg.close();
	}
</script>

<svelte:head>
	<title>{tx.title} · Lo Ligam</title>
	<meta
		name="description"
		content="Musicas, libres e filmes en occitan, causits e comentats per Lo Ligam."
	/>
</svelte:head>

{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet tt(clau)}{@const v = txt(clau)}<span lang={fr ? 'fr' : 'oc'}>{@render marcat(fr ? v.fr : v.oc)}</span>{/snippet}

{#snippet pocheta(nom, i, lector, sortit, clau, im)}
	{@const [fons, tinta] = color(i)}
	<div class="pocheta" class:sortit style:--fons={fons} style:--tinta={tinta}>
		<span class="disc" aria-hidden="true"><span class="disc-cor"></span></span>
		<div class="cobèrta" class:amb-imatge={im}>
			{#if im && clau}
				<img class="cobèrta-imatge" src={im.url} alt="" width="480" height="480" loading="lazy" decoding="async" use:editar={clau + '.imatge'} />
			{:else if im}
				<img class="cobèrta-imatge" src={im.url} alt="" width="480" height="480" />
			{/if}
			{#if clau}
				<h3 class="pocheta-nom" hidden={amagat(clau + '.nom')} use:editar={clau + '.nom'}>{nom}</h3>
			{:else}
				<h3 class="pocheta-nom">{nom}</h3>
			{/if}
			{#if lector && clau}
				{#if !sortit}
					<button type="button" class="escotar" onclick={() => escotar(clau, lector)}>
						<Icona nom="lire" size="1em" />
						{tx.escotar}
					</button>
				{/if}
			{:else if lector}
				<span class="escotar"><Icona nom="lire" size="1em" /> {tx.escotar}</span>
			{/if}
		</div>
	</div>
{/snippet}

<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
</div>

<main class="screen" class:ed-actiu={edicion.actiu}>
	<AppHeader />

	<header class="intro">
		<h1>{tx.title}</h1>
		<p class="lead">{tx.lead}</p>
	</header>

	<section class="musicas" id="musicas" aria-labelledby="musicas-titol">
		<h2 id="musicas-titol" class="seccion-titol" hidden={amagat('obras.musica.titol')} use:editar={'obras.musica.titol'}>{@render tt('obras.musica.titol')}</h2>
		<p class="musicas-lead" hidden={amagat('obras.musica.frasa')} use:editar={'obras.musica.frasa'}>{@render tt('obras.musica.frasa')}</p>

		{#if !lista('obras.artistas').length && !edicion.actiu}
			<p class="musicas-void">{tx.void}</p>
		{/if}

		{#if edicion.actiu}
			{#if formulari}
				<!-- L'ajout « tout d'un coup » : une case pour tous les liens, le
				     nom trouvé tout seul, la phrase si Romain veut, Publicar -->
				<form class="apondre" onsubmit={(e) => (e.preventDefault(), publicarArtista())}>
					<div class="apondre-camps">
						<label>
							<span>{fr ? 'Colle les liens (un par ligne)' : 'Pega los ligams (un per linha)'}</span>
							<textarea rows="4" bind:value={collats} placeholder="https://….bandcamp.com"></textarea>
						</label>
						{#if trobats.length}
							<p class="apondre-trobats">
								<Icona nom="valide" size="1em" />
								{trobats.map((l) => plataforma(l).nom).join(' · ')}{#if cèrca}…{/if}
							</p>
						{/if}
						<label>
							<span>Nom</span>
							<input type="text" bind:value={nòuNom} oninput={() => (nomTocat = true)} />
						</label>
						<label>
							<span>{fr ? 'Ta phrase (si tu veux) · Òc' : 'Ta frasa (se vòls) · Òc'}</span>
							<textarea rows="2" bind:value={frasaOc}></textarea>
						</label>
						<label>
							<span>{fr ? 'Ta phrase (si tu veux) · Fr' : 'Ta frasa (se vòls) · Fr'}</span>
							<textarea rows="2" bind:value={frasaFr}></textarea>
						</label>
						{#if error}<p class="apondre-error" role="alert">{error}</p>{/if}
						<div class="apondre-botons">
							<button type="submit" class="apondre-publicar" disabled={edicion.ocupat}>Publicar</button>
							<button type="button" class="apondre-anullar" onclick={voidar}>Anullar</button>
						</div>
					</div>
					<div class="apondre-apercebut" aria-hidden="true">
						{@render pocheta(nòuNom || 'Nom', lista('obras.artistas').length, lectorTrobat ? { plataforma: 'Bandcamp' } : null, false, null, imatgeTrobada ? { url: copiaImatge(imatgeTrobada) } : null)}
						<p class="ligams">{trobats.map((l) => plataforma(l).nom).join(' · ')}</p>
					</div>
				</form>
			{:else}
				<button type="button" class="ed-apondre" onclick={() => (formulari = true)}>+ {fr ? 'Ajouter un artiste' : 'Apondre una ficha'}</button>
			{/if}
		{/if}

		<ul class="pochetas">
			{#each lista('obras.artistas') as a, i (a.clau)}
				{@const ligams = ligamsDe(a.clau)}
				{@const lector = lectorDe(a.clau, ligams)}
				{@const nom = txt(a.clau + '.nom')}
				{@const im = imatge(a.clau + '.imatge')}
				<li class="pocheta-plaça">
					<div class="pocheta-ed" use:editar={a.clau}>
						{@render pocheta(fr ? nom.fr : nom.oc, i, lector, dubèrt === a.clau, a.clau, im?.url ? im : null)}
					</div>
					{#if lector && demanda === a.clau}
						<div class="acòrd" role="group" aria-label={tx.escotar}>
							<p>{tx.acòrd(lector.plataforma)}</p>
							<div class="acòrd-botons">
								<button type="button" class="acòrd-òc" onclick={() => acceptar(a.clau, lector)}>{tx.òc}</button>
								<button type="button" class="acòrd-non" onclick={() => (demanda = null)}>{tx.non}</button>
							</div>
						</div>
					{/if}
					{#if lector && dubèrt === a.clau}
						<iframe
							class="lector"
							class:video={lector.video}
							style:height={lector.video ? null : lector.nautor + 'px'}
							src={lector.src}
							title="{lector.plataforma} : {fr ? nom.fr : nom.oc}"
							allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
					{/if}
					<p class="tèxt" hidden={amagat(a.clau + '.tèxt')} use:editar={a.clau + '.tèxt'}>{@render tt(a.clau + '.tèxt')}</p>
					<p class="ligams" aria-label="{tx.ligams} : {fr ? nom.fr : nom.oc}">
						{#each ligams as x (x.clau)}
							<a href={x.l.href} target="_blank" rel="noopener noreferrer" hidden={amagat(x.clau)} use:editar={x.clau}>{nomLigam(x)}</a>
						{/each}
					</p>
					{#if edicion.actiu}
						<button type="button" class="ed-apondre" onclick={() => apondreLigam(a.clau)}>+ {fr ? 'Ajouter un lien' : 'Apondre un ligam'}</button>
						{#if !im?.url && ligams.some((x) => x.p?.nom === 'Bandcamp')}
							<button type="button" class="ed-apondre" onclick={() => imatgeDeBandcamp(a.clau, ligams, fr ? nom.fr : nom.oc)} disabled={cèrcaImatge === a.clau}>+ {fr ? 'Image de Bandcamp' : 'Imatge de Bandcamp'}</button>
						{/if}
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<section class="afichas" aria-labelledby="afichas-titol">
		<h2 id="afichas-titol" class="afichas-titol">{tx.afichas}</h2>
		<p class="lead">{tx.afichasLead}</p>
		<ul class="galaria">
			{#each afichas as a (a.id)}
				<li class={a.forma}>
					<button type="button" class="afica" onclick={() => dobrir(a)}>
						<img src="/obras/afichas/{a.id}-p.webp" alt="" loading="lazy" />
						<span class="afica-legenda">
							<span class="afica-titol" lang="oc">{a.titol}</span>
							{#if a.epoca}<span class="afica-epoca">{a.epoca}</span>{/if}
						</span>
						<span class="sr-only">{tx.agrandir} : {a.titol}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
</main>

<dialog class="vista" bind:this={dialeg} onclose={() => (vista = null)} onclick={(e) => e.target === dialeg && tampar()} aria-labelledby="vista-titol">
	{#if vista}
		<figure>
			<img src="/obras/afichas/{vista.id}.webp" alt={vista.titol} />
			<figcaption>
				<strong id="vista-titol" lang="oc">{vista.titol}</strong>
				<span>{lang === 'oc' ? vista.oc : vista.fr}</span>
				{#if vista.epoca}<span class="vista-epoca">{vista.epoca}</span>{/if}
				{#if vista.font}<span class="vista-font">{lang === 'oc' ? 'Font' : 'Source'} : {#if vista.ligam}<a href={vista.ligam} target="_blank" rel="noopener noreferrer">{vista.font} <Icona nom="extern" size="0.9em" /></a>{:else}{vista.font}{/if}</span>{/if}
			</figcaption>
		</figure>
		<button type="button" class="vista-tampar" onclick={tampar}>{tx.tampar} <Icona nom="fermer" size="1.1em" /></button>
	{/if}
</dialog>

<style>
	/* ---------- Galerie des affiches ---------- */
	.afichas {
		margin-top: 4rem;
	}
	.afichas-titol {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2rem, 4vw, 2.8rem);
		color: var(--color-terracotta);
		margin: 0 0 0.4rem;
	}
	.galaria {
		list-style: none;
		padding: 0;
		margin: 1.6rem 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		grid-auto-flow: dense;
		gap: 1rem;
	}
	.galaria .paisatge {
		grid-column: span 2;
	}
	.afica {
		all: unset;
		box-sizing: border-box;
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 14px;
		overflow: hidden;
		cursor: zoom-in;
		background: var(--color-text);
		box-shadow: 0 6px 20px rgba(58, 42, 32, 0.12);
		transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.6s;
	}
	.paisatge .afica {
		aspect-ratio: 3 / 2;
	}
	.afica img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
	}
	.afica:hover,
	.afica:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 0 0 3px var(--color-terracotta), 0 0 0 6px var(--color-gold), 0 14px 30px rgba(58, 42, 32, 0.2);
	}
	.afica:hover img {
		transform: scale(1.04);
	}
	.afica-legenda {
		position: absolute;
		inset: auto 0 0 0;
		padding: 2.4rem 0.9rem 0.8rem;
		background: linear-gradient(transparent, rgba(30, 14, 8, 0.82));
		color: #fff;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		text-align: left;
	}
	.afica-titol {
		font-family: var(--font-heading);
		font-size: 1.02rem;
		line-height: 1.15;
	}
	.afica-epoca {
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-gold-light);
	}
	.vista {
		border: 0;
		padding: 0;
		background: transparent;
		max-width: min(92vw, 1100px);
		max-height: 92vh;
		overflow: visible;
	}
	.vista::backdrop {
		background: rgba(20, 10, 6, 0.86);
		backdrop-filter: blur(4px);
	}
	.vista figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.9rem;
	}
	.vista img {
		max-width: 100%;
		max-height: 78vh;
		border-radius: 10px;
		box-shadow: 0 0 0 3px var(--color-terracotta), 0 0 0 6px var(--color-gold), 0 30px 60px rgba(0, 0, 0, 0.5);
	}
	.vista figcaption {
		color: #fff;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.vista figcaption strong {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.4rem;
	}
	.vista figcaption span {
		color: var(--color-gold-light);
		font-size: 0.95rem;
	}
	.vista figcaption .vista-epoca {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
	}
	.vista figcaption .vista-font {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.75);
	}
	.vista figcaption .vista-font a {
		color: inherit;
	}
	.vista-tampar {
		position: fixed;
		top: 1.2rem;
		right: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: rgba(20, 10, 6, 0.6);
		color: #fff;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.vista-tampar:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.afica,
		.afica img {
			transition: none;
		}
	}

	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: -1;
		background: radial-gradient(circle at 50% 0%, #faf3e6 0%, var(--color-cream) 60%);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 380px;
		height: 380px;
		background: var(--color-gold);
		opacity: 0.3;
		top: -120px;
		left: -100px;
	}

	.blob-teal {
		width: 340px;
		height: 340px;
		background: var(--color-teal);
		opacity: 0.18;
		bottom: -100px;
		right: -100px;
	}

	.screen {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.intro {
		text-align: center;
		max-width: 34rem;
		margin-top: 1rem;
	}

	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 6vw, 2.6rem);
		color: var(--color-terracotta);
	}

	.lead {
		margin: 0.5rem 0 0;
		color: var(--color-text);
		opacity: 0.85;
		line-height: 1.5;
	}

	.msg {
		background: white;
		border-radius: 18px;
		padding: 1.5rem 2rem;
		color: var(--color-teal);
	}

	/* ---------- Musiques : las pochetas (2026-10-25) ----------
	   Une bande sombre, les couleurs du thème « Éclat », même quand la page
	   est claire : un bac de disques au milieu de la page */
	.musicas {
		--m-fons: #22100a;
		--m-tinta: #fbf1e1;
		--m-tinta-2: rgba(251, 241, 225, 0.78);
		--m-aur: #f6b73c;
		--m-accion: #b53d17;
		container: musicas / inline-size;
		box-sizing: border-box;
		width: calc(100% + 3rem);
		margin: 1rem -1.5rem 0;
		padding: clamp(2.2rem, 6vw, 4.5rem) clamp(1.25rem, 5vw, 4rem);
		/* (le disque sorti de la dernière pochette ne doit pas élargir la page) */
		overflow-x: clip;
		background: var(--m-fons);
		color: var(--m-tinta);
		text-align: center;
	}
	.seccion-titol {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.2rem, 6vw, 3.6rem);
		line-height: 1;
	}
	.musicas-lead {
		max-width: 36rem;
		margin: 0.8rem auto 0;
		color: var(--m-tinta-2);
		line-height: 1.5;
	}
	.musicas-void {
		margin: 2rem 0 0;
		font-style: italic;
		color: var(--m-tinta-2);
	}
	.pochetas {
		list-style: none;
		max-width: 74rem;
		margin: clamp(2rem, 5vw, 3.5rem) auto 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr));
		gap: 3.2rem 2.6rem;
		text-align: left;
	}

	/* la pochette carrée, et le disque à sillons qui en dépasse */
	.pocheta {
		position: relative;
	}
	.cobèrta {
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		width: 86%;
		aspect-ratio: 1;
		padding: clamp(0.9rem, 1.6vw, 1.25rem);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background: var(--fons);
		color: var(--tinta);
		outline: 1px solid color-mix(in srgb, var(--tinta) 22%, transparent);
		outline-offset: -9px;
		box-shadow: 0 22px 34px -22px rgba(0, 0, 0, 0.8);
	}
	/* la photo de l'artiste couvre la pochette ; un voile en haut et en bas
	   garde le nom et « Escotar » lisibles quelle que soit l'image */
	.cobèrta-imatge {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.cobèrta.amb-imatge {
		--tinta: #fbf1e1;
		isolation: isolate;
	}
	.cobèrta.amb-imatge::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background: linear-gradient(rgba(20, 8, 4, 0.72), transparent 38%, transparent 62%, rgba(20, 8, 4, 0.78));
	}
	.cobèrta.amb-imatge .pocheta-nom {
		text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55);
	}
	.pocheta-nom {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.7rem, 2.5vw, 2.3rem);
		line-height: 0.98;
		text-wrap: balance;
		overflow-wrap: anywhere;
	}
	.disc {
		position: absolute;
		top: 7%;
		left: 18%;
		width: 79%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: repeating-radial-gradient(circle, #140906 0 1.5px, #24120c 1.5px 3.5px);
		box-shadow: inset 0 0 0 1px rgba(251, 241, 225, 0.08);
		display: grid;
		place-items: center;
		transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.disc-cor {
		width: 34%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--fons);
		box-shadow: 0 0 0 4px #140906;
	}
	.pocheta-plaça:hover .pocheta:not(.sortit) .disc {
		transform: translateX(7%);
	}
	/* au clic : le disque sort de la pochette, puis tourne */
	.pocheta.sortit .disc {
		transform: translateX(26%);
		animation: virar 4s linear 0.75s infinite;
	}
	@keyframes virar {
		from {
			transform: translateX(26%) rotate(0deg);
		}
		to {
			transform: translateX(26%) rotate(360deg);
		}
	}
	.escotar {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0;
		border: 0;
		border-bottom: 2px solid currentColor;
		background: none;
		color: inherit;
		font: inherit;
		font-weight: 700;
		font-size: 0.92rem;
		cursor: pointer;
	}
	.escotar:focus-visible {
		outline: 3px solid var(--m-aur);
		outline-offset: 3px;
	}

	/* sous la pochette : l'accord, le lecteur, la phrase de Romain, les liens */
	.acòrd {
		margin-top: 1rem;
		padding: 0.8rem 1rem;
		border-left: 3px solid var(--m-aur);
		border-radius: 0;
		background: rgba(251, 241, 225, 0.07);
	}
	.acòrd p {
		margin: 0 0 0.7rem;
		font-size: 0.88rem;
		line-height: 1.5;
	}
	.acòrd-botons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.acòrd-òc,
	.acòrd-non {
		padding: 0.45rem 1rem;
		border-radius: 4px;
		font: inherit;
		font-weight: 700;
		font-size: 0.86rem;
		cursor: pointer;
	}
	.acòrd-òc {
		border: 2px solid var(--m-accion);
		background: var(--m-accion);
		color: var(--m-tinta);
	}
	.acòrd-non {
		border: 2px solid rgba(251, 241, 225, 0.5);
		background: transparent;
		color: var(--m-tinta);
	}
	.lector {
		display: block;
		width: 100%;
		margin-top: 1rem;
		border: 0;
	}
	.lector.video {
		aspect-ratio: 16 / 9;
	}
	.tèxt {
		max-width: 32ch;
		margin: 1rem 0 0;
		font-style: italic;
		font-size: 0.98rem;
		line-height: 1.5;
		color: var(--m-aur);
	}
	.ligams {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.1rem;
		margin: 0.7rem 0 0;
	}
	.ligams a {
		color: var(--m-tinta);
		font-weight: 700;
		font-size: 0.9rem;
		text-decoration: underline;
		text-decoration-color: var(--m-accion);
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
	}
	.ligams a:hover {
		color: var(--m-aur);
	}
	.pocheta-plaça > .ed-apondre {
		margin-top: 0.7rem;
	}

	/* l'ajout « tout d'un coup » : une case, l'aperçu de la pochette à côté */
	.apondre {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		gap: 2rem;
		max-width: 56rem;
		margin: 2rem auto 0;
		padding: 1.4rem;
		border: 1.5px dashed var(--m-aur);
		text-align: left;
	}
	.apondre-camps {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.apondre label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.8rem;
		color: var(--m-aur);
	}
	.apondre textarea,
	.apondre input {
		box-sizing: border-box;
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 0;
		border-radius: 4px;
		background: var(--m-tinta);
		color: #2a1a10;
		font: inherit;
		font-size: 0.92rem;
	}
	.apondre-trobats {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: -0.3rem 0 0;
		font-size: 0.85rem;
		color: #c9e3a6;
	}
	.apondre-error {
		margin: 0;
		font-size: 0.85rem;
		color: #ffb4a0;
	}
	.apondre-botons {
		display: flex;
		gap: 0.6rem;
	}
	.apondre-publicar,
	.apondre-anullar {
		padding: 0.6rem 1.2rem;
		border-radius: 4px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.apondre-publicar {
		border: 0;
		background: var(--m-accion);
		color: var(--m-tinta);
	}
	.apondre-anullar {
		border: 2px solid rgba(251, 241, 225, 0.5);
		background: transparent;
		color: var(--m-tinta);
	}

	/* téléphone : une pochette par ligne, l'aperçu sous la case */
	@container musicas (max-width: 560px) {
		.pochetas {
			max-width: 21rem;
		}
		.apondre {
			grid-template-columns: minmax(0, 1fr);
		}
		.apondre-apercebut {
			max-width: 15rem;
		}
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

	@media (prefers-reduced-motion: reduce) {
		.disc {
			transition: none;
		}
		.pocheta.sortit .disc {
			animation: none;
		}
	}
	:global(html[data-leugier='on']) .pocheta.sortit .disc {
		animation: none;
	}
</style>
