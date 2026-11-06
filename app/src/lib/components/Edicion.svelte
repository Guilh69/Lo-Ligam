<script>
	// L'interface de l'édition sur place (2026-10-24) : le bouton « Editar »
	// (administrateur seulement), la barre du haut (brouillons, Publicar,
	// Anullar, Sortir) et le panneau flottant de l'élément touché. Posée dans
	// le cadre commun ; ne montre rien tant qu'une page n'a pas appelé
	// iniciar(). Les mots sont dans la langue du site (Òc / Fr).
	import { lang, LENGAS } from '$lib/stores/lang.svelte.js';
	import Icona from '$lib/components/Icona.svelte';
	import {
		edicion,
		element,
		activar,
		desactivar,
		causir,
		cambiar,
		suprimir,
		desplaçar,
		publicar,
		anullar,
		mandarImatge,
		ligamValid,
		nombreCambiaments,
		brolhonsInvalids,
		MARCATS,
		lista
	} from '$lib/edicion/edicion.svelte.js';
	import { tampaDefòra } from '$lib/tampaDefora.js';
	import { etiqueta, SOLA_LENGA } from '$lib/edicion/etiquetas.js';

	const T = {
		oc: {
			editar: 'Editar la pagina',
			mòde: 'Mòde edicion',
			cap: 'Cap de cambiament',
			un: '1 cambiament',
			n: (n) => `${n} cambiaments`,
			publicar: 'Publicar',
			anullar: 'Anullar',
			anullarSegur: 'Escafar totes los cambiaments ?',
			sortir: 'Sortir (brolhon gardat)',
			tampar: 'Tampar',
			text: 'Tèxt',
			ligam: 'Ligam',
			carta: 'Carta',
			adreça: 'Adreça del ligam',
			adreçaAjuda: 'Una pagina del site (/carta), una ancora (#biais) o una adreça https',
			imatge: 'Imatge',
			remplaçar: 'Remplaçar l’imatge',
			descripcion: 'Descripcion de l’imatge',
			visible: 'Visible',
			montar: 'Montar',
			davalar: 'Davalar',
			suprimir: 'Suprimir',
			segur: 'Segur ?',
			òc: 'Òc, suprimir',
			non: 'Non',
			validar: 'Validar',
			puèi: 'Puèi « Publicar », en naut.',
			bloc: 'Toca un tèxt o un ligam de la carta per lo cambiar.',
			ocupat: 'Enregistrament…',
			marcas: '*mot* = en aur · _mot_ = en italica'
		},
		fr: {
			editar: 'Modifier la page',
			mòde: 'Mode édition',
			cap: 'Aucun changement',
			un: '1 changement',
			n: (n) => `${n} changements`,
			publicar: 'Publier',
			anullar: 'Annuler',
			anullarSegur: 'Jeter tous les changements ?',
			sortir: 'Quitter (brouillon gardé)',
			tampar: 'Fermer',
			text: 'Texte',
			ligam: 'Lien',
			carta: 'Carte',
			adreça: 'Adresse du lien',
			adreçaAjuda: 'Une page du site (/carta), une ancre (#biais) ou une adresse https',
			imatge: 'Image',
			remplaçar: 'Remplacer l’image',
			descripcion: 'Description de l’image',
			visible: 'Visible',
			montar: 'Monter',
			davalar: 'Descendre',
			suprimir: 'Supprimer',
			segur: 'Sûr ?',
			òc: 'Oui, supprimer',
			non: 'Non',
			validar: 'Valider',
			puèi: 'Puis « Publier », en haut.',
			bloc: 'Touche un texte ou un lien de la carte pour le changer.',
			ocupat: 'Enregistrement…',
			marcas: '*mot* = en or · _mot_ = en italique'
		}
	};
	let t = $derived(T[lang.current] ?? T.oc);
	let fr = $derived(lang.current === 'fr');

	let e = $derived(edicion.causit ? element(edicion.causit) : null);
	let n = $derived(nombreCambiaments());
	let invalids = $derived(brolhonsInvalids());
	let confirma = $state(false);
	let confirmaAnullar = $state(false);
	let panèl = $state();
	let mena = $derived(e?.tipe === 'ligam' ? t.ligam : e?.tipe === 'imatge' ? t.imatge : e?.tipe === 'bloc' ? t.carta : t.text);
	// Échap ferme le panneau ; à l'ouverture, le premier champ prend le clavier (ordinateur)
	function clavièr(ev) {
		if (ev.key === 'Escape' && edicion.causit) {
			ev.preventDefault();
			const a = edicion.ancora;
			causir(null);
			a?.focus?.();
		}
	}
	$effect(() => {
		if (!edicion.causit || !panèl) return;
		if (innerWidth >= 720) panèl.querySelector('textarea, input[type=text]')?.focus({ preventScroll: true });
	});
	// sur téléphone, le champ actif remonte au-dessus du clavier
	const alCentre = (ev) => innerWidth < 720 && setTimeout(() => ev.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
	let pos = $state({ x: 16, y: 80 });
	// la place dans la liste, pour Montar / Davalar
	let plaça = $derived.by(() => {
		if (!e?.lista) return null;
		// (un texte d'une carte ne se déplace ni ne se retire seul : c'est la carte)
		if (element(e.lista)?.tipe === 'bloc') return null;
		const l = lista(e.lista);
		const i = l.findIndex((x) => x.clau === e.clau);
		return { i, n: l.length };
	});

	// le panneau se pose près de l'élément (sur ordinateur) ; en bas de
	// l'écran sur téléphone (feuille)
	$effect(() => {
		const a = edicion.ancora;
		const c = edicion.causit;
		confirma = false;
		if (!a || !c || !panèl) return;
		if (innerWidth < 720) return;
		const r = a.getBoundingClientRect();
		const w = panèl.offsetWidth || 340,
			h = panèl.offsetHeight || 300;
		let x = r.right + 12,
			y = r.top;
		if (x + w > innerWidth - 12) x = Math.max(12, r.left - w - 12);
		if (x + w > innerWidth - 12) x = Math.max(12, innerWidth - w - 12);
		if (y + h > innerHeight - 12) y = Math.max(72, innerHeight - h - 12);
		if (y < 72) y = 72;
		pos = { x, y };
	});

	// un toucher ailleurs ferme le panneau (principe du site) ; un autre
	// élément modifiable le remplace sans passer par la fermeture
	$effect(() => {
		if (!edicion.causit) return;
		return tampaDefòra((el) => !!el.closest('.ed-panel, [data-ed], .ed-barra, .ed-apondre'), () => causir(null));
	});

	const champ = (clau, lenga) => (v) => cambiar(clau, { [lenga]: v });
	function fichièr(ev) {
		const f = ev.currentTarget.files?.[0];
		if (f && e) mandarImatge(e.clau, f);
		ev.currentTarget.value = '';
	}
</script>

<svelte:window onkeydown={clavièr} />

{#if edicion.pagina && edicion.admin && !edicion.actiu}
	{#if !edicion.talhièr}
		<button type="button" class="ed-boton" onclick={activar} aria-label={t.editar} title={t.editar}>
			<Icona nom="reglages" size="1.2em" />
			<span>{fr ? 'Modifier' : 'Editar'}</span>
		</button>
	{/if}
	{#if edicion.messatge?.tipe === 'error'}
		<p class="ed-mes-sol" role="alert">⚠ {edicion.messatge.text}</p>
	{/if}
{/if}

{#if edicion.actiu}
	<div class="ed-barra" role="toolbar" aria-label={t.mòde}>
		<span class="ed-mòde">{t.mòde}</span>
		<span class="ed-compte" aria-live="polite">
			{#if edicion.ocupat}{t.ocupat}{:else if n === 0}{t.cap}{:else if n === 1}{t.un}{:else}{t.n(n)}{/if}
		</span>
		<span class="ed-accions">
			{#if confirmaAnullar}
				<span class="ed-segur">{t.anullarSegur}
					<button type="button" class="ed-perilhós" onclick={() => ((confirmaAnullar = false), anullar())}>{t.òc}</button>
					<button type="button" class="ed-segond" onclick={() => (confirmaAnullar = false)}>{t.non}</button>
				</span>
			{:else}
				<button type="button" class="ed-segond" onclick={() => (confirmaAnullar = true)} disabled={n === 0 || edicion.ocupat}>{t.anullar}</button>
			{/if}
			<button type="button" class="ed-primari" onclick={publicar} disabled={n === 0 || invalids > 0 || edicion.ocupat} title={invalids ? t.adreçaAjuda : undefined}>{t.publicar}</button>
			<button type="button" class="ed-segond" onclick={desactivar}>{t.sortir}</button>
		</span>
		{#if edicion.messatge}
			<span class="ed-mes" class:error={edicion.messatge.tipe === 'error'} role={edicion.messatge.tipe === 'error' ? 'alert' : 'status'}>{edicion.messatge.tipe === 'error' ? '⚠ ' : ''}{edicion.messatge.text}</span>
		{/if}
	</div>

	{#if e}
		<div class="ed-panel" bind:this={panèl} style="--x: {pos.x}px; --y: {pos.y}px" role="dialog" aria-modal="false" aria-label={etiqueta(e.clau, fr)}>
			<div class="ed-cap">
				<strong title={e.clau}>{etiqueta(e.clau, fr)}</strong>
				<span class="ed-mena">{mena}</span>
				<button type="button" class="ed-tampar" onclick={() => causir(null)} aria-label={t.tampar}><Icona nom="fermer" size="1em" /></button>
			</div>

			{#if e.tipe === 'text' || e.tipe === 'ligam'}
				<label class="ed-camp">
					<span>Òc</span>
					<textarea rows="2" lang="oc" value={e.oc ?? ''} onfocus={alCentre} oninput={(ev) => champ(e.clau, 'oc')(ev.currentTarget.value)}></textarea>
				</label>
				{#if !SOLA_LENGA(e.clau)}
					<label class="ed-camp">
						<span>Fr</span>
						<textarea rows="2" lang="fr" value={e.fr ?? ''} onfocus={alCentre} oninput={(ev) => champ(e.clau, 'fr')(ev.currentTarget.value)}></textarea>
					</label>
				{/if}
				<!-- La langue affichée (es/en/ca) : son champ apparaît quand on est
				     dans cette langue, à côté de la source Òc/Fr. La correction est
				     gardée en brouillon puis publiée, et prime sur la traduction d'Aran. -->
				{#if !SOLA_LENGA(e.clau) && (lang.current === 'es' || lang.current === 'en' || lang.current === 'ca')}
					<label class="ed-camp ed-camp-tra">
						<span>{LENGAS[lang.current].curt}</span>
						<textarea rows="2" lang={lang.current} value={e[lang.current] ?? ''} onfocus={alCentre} oninput={(ev) => champ(e.clau, lang.current)(ev.currentTarget.value)}></textarea>
					</label>
				{/if}
				{#if MARCATS.has(e.clau)}<p class="ed-ajuda">{t.marcas}</p>{/if}
			{/if}

			{#if e.tipe === 'ligam'}
				<label class="ed-camp">
					<span>{t.adreça}</span>
					<input type="text" value={e.ligam ?? ''} class:invalid={!ligamValid(e.ligam)} onfocus={alCentre} oninput={(ev) => cambiar(e.clau, { ligam: ev.currentTarget.value.trim().replace(/^\/+(?=https?:)/, '') })} />
				</label>
				<p class="ed-ajuda" class:error={!ligamValid(e.ligam)}>{t.adreçaAjuda}</p>
			{/if}

			{#if e.tipe === 'imatge'}
				{#if e.imatge?.url}<img class="ed-apercebut" src={e.imatge.url} alt="" />{/if}
				<label class="ed-camp ed-fichièr">
					<span class="ed-segond">{t.remplaçar}</span>
					<input type="file" accept="image/webp,image/jpeg,image/png" onchange={fichièr} />
				</label>
				<label class="ed-camp">
					<span>{t.descripcion} (òc)</span>
					<input type="text" value={e.imatge?.alt_oc ?? ''} oninput={(ev) => cambiar(e.clau, { imatge: { ...(e.imatge ?? {}), alt_oc: ev.currentTarget.value } }, { tipe: 'imatge' })} />
				</label>
				<label class="ed-camp">
					<span>{t.descripcion} (fr)</span>
					<input type="text" value={e.imatge?.alt_fr ?? ''} oninput={(ev) => cambiar(e.clau, { imatge: { ...(e.imatge ?? {}), alt_fr: ev.currentTarget.value } }, { tipe: 'imatge' })} />
				</label>
				{#if lang.current === 'es' || lang.current === 'en' || lang.current === 'ca'}
					<label class="ed-camp ed-camp-tra">
						<span>{t.descripcion} ({LENGAS[lang.current].curt})</span>
						<input type="text" value={e.imatge?.['alt_' + lang.current] ?? ''} oninput={(ev) => cambiar(e.clau, { imatge: { ...(e.imatge ?? {}), ['alt_' + lang.current]: ev.currentTarget.value } }, { tipe: 'imatge' })} />
					</label>
				{/if}
			{/if}

			{#if e.tipe === 'bloc'}<p class="ed-ajuda">{t.bloc}</p>{/if}

			<div class="ed-linha">
				<label class="ed-visible"><input type="checkbox" checked={e.visible !== false} onchange={(ev) => cambiar(e.clau, { visible: ev.currentTarget.checked }, { tot_d_un_còp: true })} /> {t.visible}</label>
				{#if plaça}
					<span class="ed-ordre">
						<button type="button" class="ed-icòna" onclick={() => desplaçar(e.clau, -1)} disabled={plaça.i <= 0} aria-label={t.montar} title={t.montar}>↑</button>
						<button type="button" class="ed-icòna" onclick={() => desplaçar(e.clau, 1)} disabled={plaça.i >= plaça.n - 1} aria-label={t.davalar} title={t.davalar}>↓</button>
					</span>
					{#if confirma}
						<span class="ed-segur">{t.segur}
							<button type="button" class="ed-perilhós" onclick={() => suprimir(e.clau)}>{t.òc}</button>
							<button type="button" class="ed-segond" onclick={() => (confirma = false)}>{t.non}</button>
						</span>
					{:else}
						<button type="button" class="ed-segond ed-perilhós" onclick={() => (confirma = true)}>{t.suprimir}</button>
					{/if}
				{/if}
			</div>
			<!-- (Romain, 2026-10-25 : « je comprends pas comment valider » ; tout est
			     déjà gardé en brouillon, le bouton ferme le panneau et rappelle Publier) -->
			<div class="ed-validar">
				<span class="ed-ajuda">{t.puèi}</span>
				<button type="button" class="ed-primari" onclick={() => causir(null)} disabled={e.tipe === 'ligam' && !ligamValid(e.ligam)}>{t.validar}</button>
			</div>
		</div>
	{/if}
{/if}

<style>
	.ed-boton {
		position: fixed;
		z-index: 2100;
		right: 1rem;
		bottom: 4.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: var(--t-accion);
		color: var(--t-accion-tinta, #fff8ec);
		font: 700 0.85rem/1 var(--font-body);
		cursor: pointer;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	}
	.ed-barra {
		position: fixed;
		z-index: 2100;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.5rem 1rem;
		background: color-mix(in srgb, var(--t-fons-2) 94%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--t-aur);
		color: var(--t-tinta);
		font: 0.85rem/1.2 var(--font-body);
	}
	.ed-mòde {
		font-weight: 700;
		color: var(--t-aur-clar);
		white-space: nowrap;
	}
	/* sur téléphone : la barre tient sur une ligne, les boutons sont courts */
	@media (max-width: 719px) {
		.ed-barra {
			flex-wrap: wrap;
			gap: 0.3rem 0.5rem;
			padding: 0.4rem 0.6rem;
			font-size: 0.78rem;
		}
		.ed-compte {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		/* le message prend une ligne à lui, jamais caché (les erreurs se lisent) */
		.ed-mes {
			flex-basis: 100%;
			order: 9;
		}
		.ed-primari,
		.ed-segond {
			padding: 0.4rem 0.6rem;
		}
	}
	.ed-compte {
		color: var(--t-tinta-2);
	}
	/* les messages : en crème avec un signe, jamais de rouge en texte sur le sombre (règle B) */
	.ed-mes {
		color: var(--t-aur-clar);
	}
	.ed-mes.error,
	.ed-ajuda.error {
		color: var(--t-tinta);
		font-weight: 700;
	}
	.ed-mes-sol {
		position: fixed;
		z-index: 2100;
		right: 1rem;
		bottom: 7.4rem;
		max-width: min(360px, calc(100vw - 2rem));
		margin: 0;
		padding: 0.5rem 0.8rem;
		border-radius: 12px;
		background: color-mix(in srgb, var(--t-fons-2) 94%, transparent);
		border: 1px solid var(--t-aur);
		color: var(--t-tinta);
		font: 700 0.8rem/1.3 var(--font-body);
	}
	.ed-accions {
		margin-left: auto;
		display: flex;
		gap: 0.4rem;
	}
	.ed-primari,
	.ed-segond,
	.ed-icòna {
		font: inherit;
		font-weight: 700;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--t-linha);
		background: transparent;
		color: var(--t-tinta);
		cursor: pointer;
	}
	.ed-primari {
		background: var(--t-accion);
		border-color: var(--t-accion);
		color: var(--t-accion-tinta, #fff8ec);
	}
	.ed-primari:disabled,
	.ed-segond:disabled,
	.ed-icòna:disabled {
		opacity: 0.4;
		cursor: default;
	}
	/* ce qui retire : une tuile rouge à texte crème, comme ce qui se clique */
	.ed-perilhós {
		background: var(--t-accion);
		border-color: var(--t-accion);
		color: var(--t-accion-tinta, #fff8ec);
	}
	.ed-panel {
		position: fixed;
		z-index: 2101;
		left: var(--x);
		top: var(--y);
		width: min(360px, calc(100vw - 24px));
		max-height: calc(100vh - 90px);
		overflow-y: auto;
		padding: 0.8rem 0.9rem 0.9rem;
		border-radius: 16px;
		border: 1px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-fons-2) 96%, transparent);
		backdrop-filter: blur(10px);
		color: var(--t-tinta);
		font: 0.85rem/1.35 var(--font-body);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
	}
	@media (max-width: 719px) {
		.ed-panel {
			left: 0;
			right: 0;
			top: auto;
			bottom: 0;
			width: auto;
			max-height: 70vh;
			border-radius: 18px 18px 0 0;
		}
	}
	.ed-cap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.ed-cap strong {
		color: var(--t-aur-clar);
	}
	.ed-mena {
		font-size: 0.7rem;
		color: var(--t-tinta-2);
		white-space: nowrap;
	}
	.ed-tampar {
		margin-left: auto;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		cursor: pointer;
		padding: 0.2rem;
	}
	.ed-camp {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		margin-top: 0.5rem;
	}
	.ed-camp > span {
		font-size: 0.72rem;
		color: var(--t-tinta-2);
	}
	.ed-camp textarea,
	.ed-camp input[type='text'] {
		font: inherit;
		font-size: 0.95rem;
		padding: 0.45rem 0.55rem;
		border-radius: 8px;
		border: 1px solid var(--t-linha);
		background: color-mix(in srgb, var(--t-fons) 70%, transparent);
		color: var(--t-tinta);
		resize: vertical;
	}
	.ed-camp input.invalid {
		border-color: var(--t-accion-viu, #ff6b5c);
	}
	/* le champ de la langue affichée (es/en/ca) ressort en or : c'est là qu'on
	   corrige la traduction, à côté de la source Òc/Fr */
	.ed-camp-tra > span {
		color: var(--t-aur-clar);
		font-weight: 700;
	}
	.ed-camp-tra textarea,
	.ed-camp-tra input[type='text'] {
		border-color: var(--t-aur);
	}
	.ed-fichièr input {
		display: none;
	}
	.ed-fichièr > .ed-segond {
		display: inline-block;
		width: fit-content;
		font-size: 0.8rem;
	}
	.ed-apercebut {
		width: 100%;
		max-height: 140px;
		object-fit: cover;
		border-radius: 8px;
		margin-top: 0.4rem;
	}
	.ed-ajuda {
		margin: 0.35rem 0 0;
		font-size: 0.72rem;
		color: var(--t-tinta-2);
	}
	.ed-validar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.6rem;
		margin-top: 0.7rem;
	}
	.ed-validar .ed-ajuda {
		margin: 0;
	}
	.ed-linha {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.7rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--t-linha);
	}
	.ed-visible {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.ed-ordre {
		display: inline-flex;
		gap: 0.25rem;
	}
	.ed-icòna {
		padding: 0.3rem 0.6rem;
	}
	.ed-segur {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		margin-left: auto;
	}
	.ed-linha > .ed-perilhós {
		margin-left: auto;
	}

	/* les éléments modifiables, sur la page */
	:global(.ed) {
		outline: 1px dashed color-mix(in srgb, var(--t-aur) 55%, transparent);
		outline-offset: 3px;
		border-radius: 3px;
		cursor: pointer;
	}
	:global(.ed:hover) {
		outline-color: var(--t-aur);
		outline-style: solid;
	}
	:global(.ed-causit) {
		outline: 2px solid var(--t-aur-clar) !important;
	}
	/* un élément changé, pas encore publié : son cadre est plein et plus vif */
	:global(.ed-brolhon) {
		outline-style: solid;
		outline-color: var(--t-aur-clar);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-aur) 22%, transparent);
	}
	:global(.ed-amagat) {
		opacity: 0.35;
		outline-style: dotted;
	}
	/* les boutons « + » des listes, en mode édition */
	:global(.ed-apondre) {
		font: 700 0.8rem/1 var(--font-body);
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px dashed var(--t-aur);
		background: transparent;
		color: var(--t-aur-clar);
		cursor: pointer;
	}
	:global(.acuelh.ed-actiu) {
		padding-top: 2.6rem;
	}
	/* le bandeau du site descend sous la barre d'édition, et le bandeau de
	   mots s'arrête : on peut toucher un mot */
	:global(.acuelh.ed-actiu .capçal) {
		top: 2.6rem;
	}
	:global(.acuelh.ed-actiu .bandel-pista) {
		animation-play-state: paused;
	}
	/* dans un masque (titres), le cadre se dessine dedans pour ne pas être rogné */
	:global(.masc > .ed) {
		outline-offset: -2px;
	}
</style>
