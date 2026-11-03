<script>
	// Accueil (2026-10-07) : l'esbòs de nuèch validé par Romain, porté dans le
	// site et posé dans le cadre commun (bandeau AppHeader, pied SiteFooter,
	// réglage d'ambiance, retour en haut).
	//
	// Réorganisé le 2026-10-15 (cahier §11), d'après le site de l'Alliance des
	// collectivités pour la qualité de l'air : chaque section répond à une seule
	// question du visiteur, et le titre « Se parla. S'apren. Se viu. » devient
	// le plan de la page (option A de Romain, avec le meilleur de l'option B) :
	//   - un seul bouton principal à l'ouverture (la carte) ;
	//   - « Qui » : le manifeste sans numéro, avec la photo de Romain ;
	//   - 01 Se parla : la carte, les chiffres et le wiki ;
	//   - 02 S'apren : les trois façons d'apprendre ;
	//   - 03 Se viu : Descobrir (Mots, Òbras, Articles) et Amassa (forum,
	//     groupes, boîte à idées, Instagram) ; les rubriques à développer avant
	//     la diffusion du site ont déjà leur lien ;
	//   - « Quatre camins » retiré (il répétait le menu ; l'ancienne version
	//     reste dans l'historique Git, commit 614ff3c et avant).
	//
	// Le mouvement (fond vivant, constellation, carte en étoiles, défilement)
	// vit dans $lib/acuelh/motor.js, chargé après coup pour que la page
	// s'affiche vite.
	//
	// Édition sur place (2026-10-24, revisions/2026-10-24-edicion-sus-plaça.md) :
	// les textes, liens, images et listes de la page viennent des éléments
	// publiés (+page.server.js : base, sinon filet $lib/data/elements-filet.json)
	// et se lisent par txt(), ligam(), imatge(), lista() ; chaque élément porte
	// l'action `editar` avec sa clé. Romain les change lui-même, connecté avec
	// son compte administrateur : Claude ne retouche plus ces textes ici.
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import { lang as langStore, tria } from '$lib/stores/lang.svelte.js';
	import { ambianca } from '$lib/stores/ambianca.svelte.js';
	import { edicion, iniciar, txt, ligam, imatge, lista, amagat, apondre } from '$lib/edicion/edicion.svelte.js';
	import { editar } from '$lib/edicion/editar.svelte.js';
	import { segments } from '$lib/edicion/marcat.js';
	import MiegTres from '$lib/acuelh/MiegTres.svelte';
	import '$lib/acuelh/acuelh.css';

	let { data } = $props();
	const lèvaEdicion = iniciar('acuelh', data.elements);

	// L'accueil montre l'occitan ⇄ une autre langue en deux couches qui glissent.
	// La 2ᵉ couche (« autra ») porte la langue courante si ce n'est pas l'occitan,
	// sinon le français par défaut ; repli occitan si rien.
	let lang = $derived(langStore.current);
	let esOc = $derived(lang === 'oc');
	let autraLang = $derived(esOc ? 'fr' : lang);
	const autra = (v) => v?.[autraLang] || v?.fr || v?.oc || '';

	// Les places du premier cours (Romain, 2026-11-03, Corrections_page_accueil.pdf p. 7).
	// Proton Calendar ne donne pas le nombre de places : c'est Romain qui le tient, par
	// « Editar » (élément acuelh.crida.places). Vide : rien ne s'affiche ; 1 et plus :
	// « 3 places » dans le bouton ; 0 : le bouton devient « Liste d'attente »
	// (acuelh.crida.espera, qui mène au questionnaire d'avant le premier cours).
	let nbPlaces = $derived.by(() => {
		const v = txt('acuelh.crida.places');
		const brut = String(v?.oc || v?.fr || '').trim();
		return /^\d{1,3}$/.test(brut) ? Number(brut) : null;
	});
	let complet = $derived(nbPlaces === 0);
	const libPlaces = (n) => ({
		oc: `${n} ${n === 1 ? 'plaça' : 'plaças'}`,
		fr: `${n} ${n === 1 ? 'place' : 'places'}`,
		es: `${n} ${n === 1 ? 'plaza' : 'plazas'}`,
		en: `${n} ${n === 1 ? 'spot' : 'spots'}`,
		ca: `${n} ${n === 1 ? 'plaça' : 'places'}`
	});
	const LIB_COMPLET = { oc: 'cors complèt', fr: 'cours complet', es: 'clase completa', en: 'fully booked', ca: 'classe completa' };

	let racina;
	let motor = $state.raw(null);



	const im = (clau, defaut) => imatge(clau) ?? defaut;
	const alt = (i) => i?.['alt_' + lang] || i?.alt_fr || i?.alt_oc || '';
	let retrat = $derived(im('acuelh.manifest.retrat', { url: '/acuelh/romain.webp', largor: 600, nautor: 620 }));
	let fen = $derived(im('acuelh.trobador.fenestra', { url: '/acuelh/erau.webp', largor: 1500, nautor: 2173 }));

	onMount(() => {
		ambianca.fonsPresent = true;
		let quitada = false;
		import('$lib/acuelh/motor.js').then(({ lancarAcuelh }) => {
			if (quitada) return;
			motor = lancarAcuelh(racina, { clar: ambianca.clar, dalt: ambianca.dalt, fons: ambianca.fons, leugier: ambianca.leugier });
		});
		return () => {
			quitada = true;
			ambianca.fonsPresent = false;
			motor?.destruir();
			motor = null;
			lèvaEdicion?.();
		};
	});

	$effect(() => {
		const clar = ambianca.clar, dalt = ambianca.dalt;
		motor?.tema(clar, dalt);
	});
	$effect(() => {
		const n = ambianca.fons;
		motor?.fons(n);
	});
	$effect(() => {
		const l = ambianca.leugier;
		motor?.leugier(l);
	});


	// Ajouts dans les listes (mode édition) : un mot, un lien, une carte
	const apondreMot = () => apondre('acuelh.bandel', 'text', { oc: 'mot', fr: 'mot' });
</script>

<svelte:head>
	<title>Lo Ligam · L’occitan se parla, s’apren, amassa</title>
	<meta
		name="description"
		content="Aprene l’occitan sens vergonha : de corses en visio, un parcors autonòm fins al nivèl B1, e de monde per parlar. Apprendre l’occitan : cours en visio, parcours autonome jusqu’au B1."
	/>
	<!-- Sans JavaScript, tout est visible d'emblée (pas de masques fermés) -->
	<noscript>
		<style>
			.acuelh .masc > .masc-in,
			.acuelh .esvani {
				transform: none;
				opacity: 1;
			}
		</style>
	</noscript>
</svelte:head>

<!-- Un texte dans les deux langues (masques qui basculent), lu par sa clé -->
{#snippet bi(clau)}{@const v = txt(clau)}<span class="bi"
		><span class="oc" aria-hidden={!esOc}>{v.oc}</span><span class="autra" aria-hidden={esOc}>{autra(v)}</span></span
	>{/snippet}

<!-- Un texte du code (pas un élément modifiable), dans les deux langues comme bi() -->
{#snippet biTx(v)}<span class="bi"
		><span class="oc" aria-hidden={!esOc}>{v.oc}</span><span class="autra" aria-hidden={esOc}>{autra(v)}</span></span
	>{/snippet}

<!-- Le même, avec les marques *or* et _italique_ -->
{#snippet marcat(s)}{#each segments(s) as p, i (i)}{#if p.aur}<span class="aur">{p.t}</span>{:else if p.ital}<i>{p.t}</i>{:else}{p.t}{/if}{/each}{/snippet}
{#snippet bim(clau)}{@const v = txt(clau)}<span class="bi"
		><span class="oc" aria-hidden={!esOc}>{@render marcat(v.oc)}</span><span class="autra" aria-hidden={esOc}>{@render marcat(autra(v))}</span></span
	>{/snippet}

<!-- Le titre lettre par lettre, pour les lettres en braise au survol (acuelh.css ;
     Romain, 2026-10-15, à la place de la traduction). Les lecteurs d'écran
     lisent le mot entier (copie masquée), pas les lettres. -->
{#snippet letras(clau)}{@const v = txt(clau)}{@const a = autra(v)}<span class="bi"
		><span class="oc" aria-hidden={!esOc}
			><span class="visually-hidden">{v.oc}</span><span aria-hidden="true"
				>{#each [...v.oc] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}</span
			></span
		><span class="autra" aria-hidden={esOc}
			><span class="visually-hidden">{a}</span><span aria-hidden="true"
				>{#if lang === 'ar'}{a}{:else}{#each [...a] as l, i (i)}<span class="letra" class:espaci={l === ' '}>{l}</span>{/each}{/if}</span
			></span
		></span
	>{/snippet}

{#snippet sageta()}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"
		><path d="M2 8h12M9 3l5 5-5 5" /></svg
	>{/snippet}

<!-- Un lien lu par sa clé : page du site, ancre, ou adresse https (nouvel onglet) -->
{#snippet lg(clau, classe, extra = {})}{@const l = ligam(clau)}<a
		class={classe}
		href={l.href}
		target={l.defòra ? '_blank' : undefined}
		rel={l.defòra ? 'noopener' : undefined}
		aria-describedby={l.defòra ? 'onglet-nou' : undefined}
		hidden={amagat(clau)}
		use:editar={clau}
		{...extra}>{@render bi(clau)}{#if extra['data-sageta']} {@render sageta()}{/if}</a
	>{/snippet}

{#snippet apondreBoton(f, txtOc, txtFr)}{#if edicion.actiu}<button type="button" class="ed-apondre" onclick={f}>+ {esOc ? txtOc : txtFr}</button>{/if}{/snippet}

<div class="acuelh" class:autra={!esOc} class:ed-actiu={edicion.actiu} bind:this={racina}>
	<canvas id="fons" aria-hidden="true"></canvas>
	<div class="brasa" aria-hidden="true"><i></i><i></i><b></b><b></b><b></b><b></b></div>
	<canvas id="estelas" aria-hidden="true"></canvas>
	<div class="cur-anel" aria-hidden="true"></div>
	<div class="cur-ponch" aria-hidden="true"></div>

	<div class="capçal">
		<AppHeader />
	</div>

	<main>
		<span id="onglet-nou" class="visually-hidden"
			>{tria({ oc: 'Se dobrís dins un onglet novèl', fr: 'S’ouvre dans un nouvel onglet', es: 'Se abre en una pestaña nueva', en: 'Opens in a new tab', ca: 'S’obre en una pestanya nova', ar: 'يُفتح في تبويب جديد' })}</span
		>

		<!-- I. Le héros : le titre annonce le plan de la page, un seul bouton principal -->
		<section class="eros amb-carta" data-revela>
			<p class="eros-kicker" hidden={amagat('acuelh.eros.kicker')}>
				<span class="masc"><span class="masc-in" use:editar={'acuelh.eros.kicker'}>{@render bi('acuelh.eros.kicker')}</span></span>
			</p>
			<div class="eros-entitol">
				<h1 class="eros-titol">
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.1')}><span class="masc-in" style="--i: 1" use:editar={'acuelh.eros.titol.1'}>{@render letras('acuelh.eros.titol.1')}</span></span>
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.2')}><span class="masc-in" style="--i: 2" use:editar={'acuelh.eros.titol.2'}>{@render letras('acuelh.eros.titol.2')}</span></span>
					<span class="linha masc" hidden={amagat('acuelh.eros.titol.3')}><span class="masc-in" style="--i: 3" use:editar={'acuelh.eros.titol.3'}>{@render letras('acuelh.eros.titol.3')}</span></span>
				</h1>
			</div>
				<div class="eros-pe">
					<div class="esvani" style="--i: 5">
						<p class="eros-sub" hidden={amagat('acuelh.eros.frasa')} use:editar={'acuelh.eros.frasa'}>{@render bi('acuelh.eros.frasa')}</p>
						<p class="indici" aria-hidden="true" hidden={amagat('acuelh.eros.indici')} use:editar={'acuelh.eros.indici'}>
							{@render bi('acuelh.eros.indici')}
						</p>
					</div>
					<div class="eros-accions esvani" style="--i: 6">
						{#if !amagat('acuelh.eros.carta')}
							{@const l = ligam('acuelh.eros.carta')}
							<a class="boton" href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener' : undefined} data-magnet use:editar={'acuelh.eros.carta'}>
								<span class="boton-emplenat"></span>
								<span class="boton-tèxt">{@render bi('acuelh.eros.carta')}{@render sageta()}</span>
							</a>
						{/if}
						{@render lg('acuelh.eros.aprene', 'ligam-tèxt')}
					</div>
					<div class="davalar esvani" style="--i: 7" aria-hidden="true"><span></span></div>
				</div>
			<!-- La carte en étoiles ouvre la page (Romain, 2026-10-22) : le moteur la
			     dessine ici, dans le temps, à l'arrivée ; elle était en 01 -->
			<div
				class="carta-estelas"
				role="img"
				aria-label={tria({
					oc: 'Carta de l’Occitània en estelas : 304 vilas e vilatges, amb lor nom occitan',
					fr: 'Carte de l’Occitanie en étoiles : 304 villes et villages, avec leur nom occitan',
					es: 'Mapa de Occitania en estrellas: 304 ciudades y pueblos, con su nombre occitano',
					en: 'Star map of Occitania: 304 towns and villages, with their Occitan names',
					ca: 'Mapa d’Occitània en estrelles: 304 ciutats i pobles, amb el seu nom occità',
					ar: 'خريطة أوكسيتانيا مرصّعة بالنجوم: 304 مدينة وقرية بأسمائها الأوكسيتانية'
				})}
			></div>
		</section>

		<!-- II. Le bandeau de mots (Lexique de Max Rouquette) -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="bandel" role="group" tabindex="0" aria-label={tria({ oc: 'Qualques mots', fr: 'Quelques mots', es: 'Algunas palabras', en: 'A few words', ca: 'Unes quantes paraules', ar: 'بعض الكلمات' })}>
			<div class="bandel-pista">
				{#each [false, true] as copia (copia)}
					{#each lista('acuelh.bandel') as m (m.clau)}
						{#if copia}
							<span class="bandel-mot" lang="oc" aria-hidden="true">{m.oc}<small lang={autraLang}>{autra(m)}</small></span>
						{:else}
							<span class="bandel-mot" lang="oc" use:editar={m.clau}>{m.oc}<small lang={autraLang}>{autra(m)}</small></span>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
		<p class="bandel-font" hidden={amagat('acuelh.bandel.font')}>
			<span use:editar={'acuelh.bandel.font'}>{@render bim('acuelh.bandel.font')}</span>
			{@render apondreBoton(apondreMot, 'Apondre un mot', 'Ajouter un mot')}
		</p>

		<!-- III. Qui : le manifeste (sans numéro, comme la phrase d'identité de l'Alliance), avec la photo de Romain -->
		<section class="manifest">
			<h2 class="jalon" data-revela hidden={amagat('acuelh.manifest.titol')}>
				<span class="masc"><span class="masc-in" use:editar={'acuelh.manifest.titol'}>{@render bi('acuelh.manifest.titol')}</span></span>
			</h2>
			<div class="manifest-cors">
				<!-- chaque mot s'allume au défilement (motor : data-emplenar) ; *…* = en or -->
				<p class="manifest-tèxt" data-emplenar hidden={amagat('acuelh.manifest.tèxt')} use:editar={'acuelh.manifest.tèxt'}>
					{#each [['oc', 'oc'], ['autra', autraLang]] as [clau, codi] (clau)}
						{@const mv = txt('acuelh.manifest.tèxt')}
						{@const contengut = clau === 'oc' ? mv.oc : autra(mv)}
						<span data-lenga={clau} lang={codi}
							>{#each segments(contengut) as seg, n (n)}{#each seg.t.trim().split(/\s+/).filter(Boolean) as m, k (k)}<span
										class={seg.aur ? 'm aur' : 'm'}>{m}</span
									>{' '}{/each}{/each}</span
						>
					{/each}
				</p>
				<figure class="manifest-retrat esvani" data-revela hidden={amagat('acuelh.manifest.retrat')}>
					<div class="panel-media" use:editar={'acuelh.manifest.retrat'}>
						<img src={retrat.url} alt={alt(retrat)} loading="lazy" width={retrat.largor} height={retrat.nautor} />
					</div>
					<figcaption use:editar={'acuelh.manifest.legenda'} hidden={amagat('acuelh.manifest.legenda')}>{@render bi('acuelh.manifest.legenda')}</figcaption>
				</figure>
			</div>
		</section>

		<!-- IV. Le milieu : les trois mondes (Se parla · S'apren · Amassa) -->
		<MiegTres />
		<!-- VII. Le troubadour (Max Rouquette), qui clôt « Amassa » -->
		<section class="trobador">
			<div class="trobador-pin">
				<div class="trobador-fenestra" hidden={amagat('acuelh.trobador.fenestra')} use:editar={'acuelh.trobador.fenestra'}>
					<img src={fen.url} alt={alt(fen)} loading="lazy" decoding="async" width={fen.largor} height={fen.nautor} />
				</div>
				<blockquote class="trobador-vers">
					<p lang="oc">
						<span class="masc" hidden={amagat('acuelh.trobador.vers.1')}><span class="masc-in" use:editar={'acuelh.trobador.vers.1'}>{txt('acuelh.trobador.vers.1').oc}</span></span><span class="masc" hidden={amagat('acuelh.trobador.vers.2')}
							><span class="masc-in" style="--i: 1" use:editar={'acuelh.trobador.vers.2'}>{txt('acuelh.trobador.vers.2').oc}</span></span
						>
					</p>
					<cite class="esvani" style="--i: 4" hidden={amagat('acuelh.trobador.cita')} use:editar={'acuelh.trobador.cita'}>{@render bim('acuelh.trobador.cita')}</cite>
				</blockquote>
				<!-- Repère : continuer à descendre ouvre la fenêtre (s'efface dès qu'elle s'ouvre) -->
				<div class="trobador-indici" aria-hidden="true"><span></span></div>
			</div>
		</section>

		<!-- VIII. L'appel : les cours, en fin de parcours -->
		<section class="crida centrat" id="crida" data-revela>
			<div>
				<h2 class="crida-titol">
					<span class="masc" hidden={amagat('acuelh.crida.titol.1')}><span class="masc-in" use:editar={'acuelh.crida.titol.1'}>{@render bi('acuelh.crida.titol.1')}</span></span>
					<span class="masc" hidden={amagat('acuelh.crida.titol.2')}><span class="masc-in aur" style="--i: 1" use:editar={'acuelh.crida.titol.2'}>{@render bi('acuelh.crida.titol.2')}</span></span>
				</h2>
				<p class="crida-sub esvani" style="--i: 3" hidden={amagat('acuelh.crida.sota')} use:editar={'acuelh.crida.sota'}>
					{@render bi('acuelh.crida.sota')}
				</p>
				<div class="esvani" style="--i: 4">
					<div class="crida-accions">
						<!-- Plus de place (0) : le bouton mène à la liste d'attente ; sinon, le bouton de réservation, avec ses places -->
						{#if complet && !edicion.actiu}
							{@const e = ligam('acuelh.crida.espera')}
							<a class="boton" href={e.href} data-magnet>
								<span class="boton-emplenat"></span>
								<span class="boton-tèxt">{@render bi('acuelh.crida.espera')}{@render sageta()}</span>
								<span class="boton-places complet">{@render biTx(LIB_COMPLET)}</span>
							</a>
						{:else if !amagat('acuelh.crida.reservar')}
							{@const l = ligam('acuelh.crida.reservar')}
							<a class="boton" href={l.href} target={l.defòra ? '_blank' : undefined} rel={l.defòra ? 'noopener' : undefined} data-magnet aria-describedby={l.defòra ? 'onglet-nou' : undefined} use:editar={'acuelh.crida.reservar'}>
								<span class="boton-emplenat"></span>
								<span class="boton-tèxt">{@render bi('acuelh.crida.reservar')}{@render sageta()}</span>
								{#if nbPlaces !== null || edicion.actiu}
									<span class="boton-places" class:buit={nbPlaces === null} class:complet use:editar={'acuelh.crida.places'}>{#if nbPlaces === null}plaças ?{:else if complet}{@render biTx(LIB_COMPLET)}{:else}{@render biTx(libPlaces(nbPlaces))}{/if}</span>
								{/if}
							</a>
						{/if}
						{#if edicion.actiu}{@render lg('acuelh.crida.espera', 'ligam-tèxt')}{/if}
						{@render lg('acuelh.crida.sol', 'ligam-tèxt')}
					</div>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	/* Qui : le manifeste et la photo côte à côte, l'un sous l'autre quand la place manque */
	.manifest {
		container: manifest / inline-size;
	}
	.manifest-cors {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: clamp(2rem, 5vw, 5rem);
	}
	.manifest-retrat {
		width: clamp(240px, 26vw, 400px);
		margin: 0;
	}
	.manifest-retrat .panel-media {
		/* format portrait ; coins arrondis et remplissage « cover » du média standard */
		aspect-ratio: 4 / 5;
	}
	.manifest-retrat figcaption {
		margin-top: 0.7rem;
		font-family: var(--votz);
		font-style: italic;
		font-size: 1.1rem;
		color: var(--aur-clar);
		text-align: right;
	}
	@container manifest (max-width: 820px) {
		.manifest-cors {
			grid-template-columns: 1fr;
			gap: 2.2rem;
		}
		.manifest-retrat {
			width: min(80%, 320px);
			justify-self: center;
		}
		.manifest-retrat figcaption {
			text-align: center;
		}
	}

	/* La carte et le wiki côte à côte */
	.carta-dobrir {
		flex-wrap: wrap;
		align-items: center;
		gap: 1.2rem 2.4rem;
	}

	/* Amassa : les villes éclosent, un trait fin se tire de A vers B, liaison
	   après liaison, puis des pointillés y coulent en continu, comme un flux
	   de données (retour de Romain : pas de lueurs « trains »). Le flux
	   s'arrête hors de l'écran, en version légère et si le visiteur réduit
	   les animations : les pointillés restent, immobiles. */
	.liams svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.domeni {
		fill: color-mix(in srgb, var(--terra) 24%, transparent);
		stroke: color-mix(in srgb, var(--aur) 50%, transparent);
		stroke-width: 0.8;
		stroke-linejoin: round;
	}
	.liam,
	.flux {
		fill: none;
		stroke-linecap: round;
	}
	.liam {
		stroke: var(--aur);
		stroke-width: 0.7;
		opacity: 0.35;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 1.1s var(--ease-io) calc(700ms + var(--i) * 450ms);
	}
	.vila {
		fill: var(--aur-clar);
		transform-box: fill-box;
		transform-origin: center;
		transform: scale(0);
		transition: transform 0.8s var(--ease) calc(var(--i) * 60ms);
	}
	.panel:global(.vist) .liam {
		stroke-dashoffset: 0;
	}
	.panel:global(.vist) .vila {
		transform: scale(1);
	}
	/* Pointillés ronds tous les 7 px ; ils apparaissent une fois leur trait tiré */
	.flux {
		stroke: var(--aur-clar);
		stroke-width: 2;
		stroke-dasharray: 0 7;
		opacity: 0;
		transition: opacity 0.6s var(--ease) calc(1500ms + var(--i) * 450ms);
	}
	.panel:global(.vist) .flux {
		opacity: 0.9;
	}
	@media (prefers-reduced-motion: no-preference) {
		.liams:global(.en-vista) .flux {
			animation: flux 1.1s linear infinite;
		}
	}
	:global(:root[data-leugier='on']) .flux {
		animation: none !important;
	}
	@keyframes flux {
		to {
			stroke-dashoffset: -7;
		}
	}
	/* en mode édition, les éléments cachés restent là, les boutons d'ajout se placent */
	.acuelh :global(.ed-apondre) {
		margin: 0.6rem 0 0 0.6rem;
	}
	.bandel-font :global(.ed-apondre) {
		margin-left: 1rem;
	}
</style>
