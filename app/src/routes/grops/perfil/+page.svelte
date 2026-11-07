<script>
	// Son propre profil (2026-10-25) : ce que les autres membres vérifiés
	// verront, et l'état de sa vérification. Surtout des cases à cocher
	// (Romain : « flemme d'écrire ») ; le lieu se cherche dans les communes
	// de la carte, en occitan ou en français, puis dans le monde entier (une
	// commune d'Occitanie porte la croix du logo) ; le texte libre vient en dernier,
	// facultatif. Les réponses du questionnaire d'accueil (âge, genre,
	// profession) n'y paraissent pas.
	import { browser } from '$app/environment';
	import Icona from '$lib/components/Icona.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, DIALECTES, NIVELS, CERCA, AGRADA, cargarIeu, nomLigne } from '$lib/grops/grops.svelte.js';
	import { cargarComunas, cercarComunas, cercarMonde, normC, luòcAfichat } from '$lib/comunas.js';
	import Crotz from '$lib/components/Crotz.svelte';
	import Avatar from '$lib/grops/Avatar.svelte';

	let fr = $derived(langStore.current === 'fr');
	const MAX = 600;
	const X = {
		oc: {
			titol: 'Mon perfil',
			tornar: 'Tornar a la lista',
			estats: {
				en_espèra: 'Ton perfil es en espèra : la moderacion lo legís lèu. Pòdes ja legir los grops.',
				verificat: 'Ton perfil es verificat : los autres membres lo veson.',
				refusat: 'Ton perfil es pas estat acceptat. Pòdes escriure a la moderacion :'
			},
			contacte: 'Contacte',
			nivel: 'Nivèl',
			cerca: 'Çò que cèrqui',
			agrada: 'Çò que m’agrada',
			ont: 'D’ont',
			ont_ajuda: 'Escriu lo començament del nom : una comuna d’Occitània o un luòc del monde.',
			occitania: 'Occitània',
			ont_lista: 'Pas dins la lista : gardarem çò qu’as escrich.',
			dialecte: 'Dialècte',
			cap: '(cap)',
			presentacion: 'En mai, se vòls',
			presentacion_ajuda: 'Çò que vòls : d’ont venes, perqué l’occitan…',
			enregistrar: 'Enregistrar',
			enregistrat: 'Enregistrat.',
			veire: 'Veire mon perfil',
			questionnaire: 'Per començar, causís un pseudonim.',
			causir: 'Causir un pseudonim',
			perfil_mot: 'Un mot es pas possible dins un perfil.',
			perfil_ligam: 'Pas de ligams dins un perfil.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			titol: 'Mon profil',
			tornar: 'Retour à la liste',
			estats: {
				en_espèra: 'Ton profil est en attente : la modération le lit bientôt. Tu peux déjà lire les groupes.',
				verificat: 'Ton profil est vérifié : les autres membres le voient.',
				refusat: 'Ton profil n’a pas été accepté. Tu peux écrire à la modération :'
			},
			contacte: 'Contact',
			nivel: 'Niveau',
			cerca: 'Ce que je cherche',
			agrada: 'Ce que j’aime',
			ont: 'D’où',
			ont_ajuda: 'Écris le début du nom, en occitan ou en français : une commune d’Occitanie ou n’importe où dans le monde.',
			occitania: 'Occitanie',
			ont_lista: 'Pas dans la liste : on garde ce que tu as écrit.',
			dialecte: 'Dialecte',
			cap: '(aucun)',
			presentacion: 'En plus, si tu veux',
			presentacion_ajuda: 'Ce que tu veux : d’où tu viens, pourquoi l’occitan…',
			enregistrar: 'Enregistrer',
			enregistrat: 'Enregistré.',
			veire: 'Voir mon profil',
			questionnaire: 'Pour commencer, choisis un pseudo.',
			causir: 'Choisir un pseudo',
			perfil_mot: 'Un mot n’est pas possible dans un profil.',
			perfil_ligam: 'Pas de liens dans un profil.',
			error: 'Une erreur : réessaie.'
		},
		es: {
			titol: 'Mi perfil',
			tornar: 'Volver a la lista',
			estats: {
				en_espèra: 'Tu perfil está pendiente: la moderación lo leerá pronto. Ya puedes leer los grupos.',
				verificat: 'Tu perfil está verificado: los demás miembros lo ven.',
				refusat: 'Tu perfil no ha sido aceptado. Puedes escribir a la moderación:'
			},
			contacte: 'Contacto',
			nivel: 'Nivel',
			cerca: 'Lo que busco',
			agrada: 'Lo que me gusta',
			ont: 'De dónde',
			ont_ajuda: 'Escribe el principio del nombre, en occitano o en francés: un municipio de Occitania o cualquier lugar del mundo.',
			occitania: 'Occitania',
			ont_lista: 'No está en la lista: guardamos lo que has escrito.',
			dialecte: 'Dialecto',
			cap: '(ninguno)',
			presentacion: 'Además, si quieres',
			presentacion_ajuda: 'Lo que quieras: de dónde vienes, por qué el occitano…',
			enregistrar: 'Guardar',
			enregistrat: 'Guardado.',
			veire: 'Ver mi perfil',
			questionnaire: 'Para empezar, elige un seudónimo.',
			causir: 'Elegir un seudónimo',
			perfil_mot: 'Una palabra no está permitida en un perfil.',
			perfil_ligam: 'No se admiten enlaces en un perfil.',
			error: 'Ha habido un error: inténtalo de nuevo.'
		},
		en: {
			titol: 'My profile',
			tornar: 'Back to the list',
			estats: {
				en_espèra: 'Your profile is pending: the moderators will read it soon. You can already read the groups.',
				verificat: 'Your profile is verified: other members can see it.',
				refusat: 'Your profile was not accepted. You can write to the moderators:'
			},
			contacte: 'Contact',
			nivel: 'Level',
			cerca: 'What I’m looking for',
			agrada: 'What I like',
			ont: 'Where from',
			ont_ajuda: 'Type the start of the name, in Occitan or French: a municipality in Occitania or anywhere in the world.',
			occitania: 'Occitania',
			ont_lista: 'Not in the list: we’ll keep what you typed.',
			dialecte: 'Dialect',
			cap: '(none)',
			presentacion: 'Also, if you like',
			presentacion_ajuda: 'Whatever you like: where you come from, why Occitan…',
			enregistrar: 'Save',
			enregistrat: 'Saved.',
			veire: 'View my profile',
			questionnaire: 'To get started, choose a nickname.',
			causir: 'Choose a nickname',
			perfil_mot: 'A word isn’t allowed in a profile.',
			perfil_ligam: 'No links in a profile.',
			error: 'Something went wrong: try again.'
		},
		ca: {
			titol: 'El meu perfil',
			tornar: 'Torna a la llista',
			estats: {
				en_espèra: 'El teu perfil està pendent: la moderació el llegirà aviat. Ja pots llegir els grups.',
				verificat: 'El teu perfil està verificat: els altres membres el veuen.',
				refusat: 'El teu perfil no ha estat acceptat. Pots escriure a la moderació:'
			},
			contacte: 'Contacte',
			nivel: 'Nivell',
			cerca: 'El que cerco',
			agrada: 'El que m’agrada',
			ont: 'D’on',
			ont_ajuda: 'Escriu el començament del nom, en occità o en francès: un municipi d’Occitània o qualsevol lloc del món.',
			occitania: 'Occitània',
			ont_lista: 'No és a la llista: guardem el que has escrit.',
			dialecte: 'Dialecte',
			cap: '(cap)',
			presentacion: 'A més, si vols',
			presentacion_ajuda: 'El que vulguis: d’on véns, per què l’occità…',
			enregistrar: 'Desa',
			enregistrat: 'Desat.',
			veire: 'Veure el meu perfil',
			questionnaire: 'Per començar, tria un pseudònim.',
			causir: 'Triar un pseudònim',
			perfil_mot: 'Una paraula no està permesa en un perfil.',
			perfil_ligam: 'Cap enllaç en un perfil.',
			error: 'Hi ha hagut un error: torna-ho a provar.'
		},
		ar: {
			titol: 'ملفّي الشخصي',
			tornar: 'العودة إلى القائمة',
			estats: {
				en_espèra: 'ملفّك الشخصي قيد المراجعة: سيقرؤه فريق الإشراف قريبًا. ويمكنك قراءة المجموعات منذ الآن.',
				verificat: 'تم التحقّق من ملفّك الشخصي: يراه بقية الأعضاء.',
				refusat: 'لم يتم قبول ملفّك الشخصي. يمكنك مراسلة فريق الإشراف:'
			},
			contacte: 'التواصل',
			nivel: 'المستوى',
			cerca: 'ما أبحث عنه',
			agrada: 'ما يعجبني',
			ont: 'أنا من',
			ont_ajuda: 'يمكنك كتابة بداية الاسم، بالأوكسيتانية أو بالفرنسية: بلدية في أوكسيتانيا أو أي مكان في العالم.',
			occitania: 'أوكسيتانيا',
			ont_lista: 'غير موجود في القائمة: سنحتفظ بما كتبته.',
			dialecte: 'اللهجة',
			cap: '(لا شيء)',
			presentacion: 'إن أحببت، كلمة عنك',
			presentacion_ajuda: 'ما تشاء: من أين أتيت، ولماذا الأوكسيتانية…',
			enregistrar: 'حفظ',
			enregistrat: 'تم الحفظ.',
			veire: 'عرض ملفّي الشخصي',
			questionnaire: 'للبدء، يلزم اختيار اسم مستعار.',
			causir: 'اختيار اسم مستعار',
			perfil_mot: 'توجد كلمة غير مسموح بها في الملف الشخصي.',
			perfil_ligam: 'لا يُسمح بالروابط في الملف الشخصي.',
			error: 'حدث خطأ: يرجى المحاولة مرة أخرى.'
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	let cargat = $state(false);
	let existís = $state(false);
	let f = $state({ presentacion: '', ont: '', ont_oc: null, ont_dep: null, ont_pais: null, ont_occitania: false, dialecte: '', nivel: '', cerca: [], agrada: [] });
	let enregistrant = $state(false);
	let enregistrat = $state(false);
	let error = $state(null);
	// le lieu : ce qu'on tape (q), les communes proposées, celle qu'on survole au clavier
	let q = $state('');
	let trobadas = $state([]);
	let monde = $state([]);
	// les communes d'Occitanie d'abord, puis le reste du monde
	let opcions = $derived([...trobadas.map((c) => ({ c })), ...monde.map((m) => ({ m }))]);
	let cercant = $state(false);
	let minuta, abandon;
	let activa = $state(-1);
	let dobèrt = $state(false);

	// le nom du lieu dans la langue choisie ; dans la liste, l'autre nom à côté
	const nomComuna = (c) => (fr ? c.fr : (c.oc ?? c.fr));
	const autreNom = (c) => (c.oc ? (fr ? c.oc : c.fr) : null);

	// en développement, « ?simular » montre le formulaire sans compte (mise en page)
	const simular = browser && import.meta.env.DEV && new URLSearchParams(location.search).has('simular');

	$effect(() => {
		if (!grops.uid) {
			if (simular) existís = cargat = true;
			return;
		}
		supabase
			.from('profiles')
			.select('presentacion, ont, ont_oc, ont_dep, ont_pais, ont_occitania, dialecte, nivel, cerca, agrada')
			.eq('user_id', grops.uid)
			.maybeSingle()
			.then(({ data }) => {
				existís = !!data;
				if (data) {
					f = {
						presentacion: data.presentacion ?? '',
						ont: data.ont ?? '',
						ont_oc: data.ont_oc,
						ont_dep: data.ont_dep,
						ont_pais: data.ont_pais,
						ont_occitania: data.ont_occitania,
						dialecte: data.dialecte ?? '',
						nivel: data.nivel ?? '',
						cerca: data.cerca ?? [],
						agrada: data.agrada ?? []
					};
					q = luòcAfichat(f, fr);
				}
				cargat = true;
			});
	});

	// une commune choisie change de nom avec la langue du site
	$effect(() => {
		if (f.ont_dep || f.ont_pais) q = luòcAfichat(f, fr);
	});

	async function tapar() {
		// du texte libre tant qu'on n'a pas choisi : « en linha », Paris…
		f.ont = q;
		f.ont_oc = f.ont_dep = f.ont_pais = null;
		f.ont_occitania = false;
		await cargarComunas();
		trobadas = cercarComunas(q);
		activa = -1;
		dobèrt = true;
		// le monde : quand on s'arrête de taper (trois lettres au moins),
		// sans redire une commune déjà proposée
		clearTimeout(minuta);
		abandon?.abort();
		monde = [];
		const cerca = q.trim();
		cercant = cerca.length >= 3;
		if (!cercant) return;
		minuta = setTimeout(async () => {
			abandon = new AbortController();
			const r = await cercarMonde(cerca, abandon.signal);
			if (cerca !== q.trim()) return;
			cercant = false;
			const dejà = new Set(trobadas.map((c) => normC(c.fr)));
			monde = r.filter((x) => !(!x.pais && dejà.has(normC(x.nom)))).slice(0, 8 - trobadas.length);
		}, 300);
	}
	function causir(o) {
		if (o.c) {
			f.ont = o.c.fr;
			f.ont_oc = o.c.oc;
			f.ont_dep = o.c.dep;
			f.ont_pais = null;
			f.ont_occitania = true;
		} else {
			f.ont = o.m.nom;
			f.ont_oc = null;
			f.ont_dep = o.m.dep;
			f.ont_pais = o.m.pais;
			f.ont_occitania = false;
		}
		q = luòcAfichat(f, fr);
		dobèrt = false;
	}
	function clavier(e) {
		if (!dobèrt || !opcions.length) return;
		const n = opcions.length;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activa = (activa + 1) % n;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activa = activa <= 0 ? n - 1 : activa - 1;
		} else if (e.key === 'Enter' && activa >= 0) {
			e.preventDefault();
			causir(opcions[activa]);
		} else if (e.key === 'Escape') dobèrt = false;
	}

	async function enregistrar(e) {
		e.preventDefault();
		enregistrant = true;
		enregistrat = false;
		error = null;
		const ont = f.ont.trim();
		// seules les valeurs des listes (la base refuse les autres)
		const de = (lista, vals) => lista.map(([v]) => v).filter((v) => vals.includes(v));
		const cerca = de(CERCA, f.cerca);
		const agrada = de(AGRADA, f.agrada);
		const { error: err } = await supabase
			.from('profiles')
			.update({
				presentacion: f.presentacion.trim() || null,
				ont: ont || null,
				ont_oc: ont ? f.ont_oc : null,
				ont_dep: ont ? f.ont_dep : null,
				ont_pais: ont ? f.ont_pais : null,
				ont_occitania: !!ont && f.ont_occitania,
				dialecte: f.dialecte || null,
				nivel: f.nivel || null,
				cerca: cerca.length ? cerca : null,
				agrada: agrada.length ? agrada : null
			})
			.eq('user_id', grops.uid);
		enregistrant = false;
		if (err) error = /perfil_mot|perfil_ligam/.exec(err.message)?.[0] ?? 'error';
		else {
			enregistrat = true;
			cargarIeu();
		}
	}
</script>

<svelte:head>
	<title>{x.titol} · Lo Ligam</title>
</svelte:head>

{#snippet chips(nom, lista, tipe)}
	<fieldset class="camp">
		<legend>{x[nom]}</legend>
		<div class="chips">
			{#each lista as r (r[0])}
				{@const v = r[0]}
				<!-- (pas de bind:group ici : Svelte regroupe les cases par expression,
				     et les trois listes du gabarit se mêleraient) -->
				<label class="chip">
					{#if tipe === 'radio'}
						<input type="radio" name={nom} value={v} checked={f[nom] === v} onchange={() => (f[nom] = v)} />
					{:else}
						<input
							type="checkbox"
							value={v}
							checked={f[nom].includes(v)}
							onchange={(e) => (f[nom] = e.currentTarget.checked ? [...f[nom], v] : f[nom].filter((y) => y !== v))}
						/>
					{/if}
					{nomLigne(r, langStore.current)}
				</label>
			{/each}
		</div>
	</fieldset>
{/snippet}

<div class="perfil">
	<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
	<header>
		<Avatar pseudo={grops.ieu?.pseudo ?? '…'} id={grops.uid ?? ''} size="4rem" />
		<div>
			<h2>{x.titol}</h2>
			{#if grops.ieu}<p class="pseudo">{grops.ieu.pseudo}</p>{/if}
		</div>
	</header>

	{#if grops.ieu}
		<p class="estat estat-{grops.ieu.verificacion}" role="status">
			{x.estats[grops.ieu.verificacion]}
			{#if grops.ieu.verificacion === 'refusat'}<a href="/contacte">{x.contacte}</a>{/if}
		</p>
	{/if}

	{#if cargat && !existís}
		<p>{x.questionnaire}</p>
		<a class="pc boton" href="/compte/questionnaire">{x.causir}</a>
	{:else if cargat}
		<form onsubmit={enregistrar}>
			{@render chips('nivel', NIVELS, 'radio')}
			{@render chips('cerca', CERCA, 'checkbox')}
			{@render chips('agrada', AGRADA, 'checkbox')}
			<div class="camp luòc">
				<label for="perfil-ont-camp">{x.ont}</label>
				<small id="perfil-ont">{x.ont_ajuda}</small>
				<input
					id="perfil-ont-camp"
					type="text"
					role="combobox"
					autocomplete="off"
					aria-autocomplete="list"
					aria-expanded={dobèrt && opcions.length > 0}
					aria-controls="perfil-ont-lista"
					aria-activedescendant={dobèrt && activa >= 0 ? `perfil-ont-${activa}` : undefined}
					aria-describedby="perfil-ont"
					maxlength="80"
					bind:value={q}
					oninput={tapar}
					onfocus={cargarComunas}
					onkeydown={clavier}
					onblur={() => (dobèrt = false)}
				/>
				{#if dobèrt && opcions.length}
					<ul id="perfil-ont-lista" role="listbox" aria-label={x.ont}>
						{#each opcions as o, i (o.c ? 'c' + o.c.fr + o.c.dep : 'm' + o.m.nom + o.m.detalh)}
							<li
								id="perfil-ont-{i}"
								role="option"
								aria-selected={i === activa}
								class:activa={i === activa}
								onmousedown={(e) => (e.preventDefault(), causir(o))}
							>
								{#if o.c}
									<strong><Crotz talha={18} teula />{nomComuna(o.c)}</strong>
									<span>{autreNom(o.c) ? `${autreNom(o.c)} · ` : ''}{o.c.dep}</span>
								{:else}
									<strong>{o.m.nom}</strong>
									<span>{o.m.detalh}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else if dobèrt && !cercant && q.trim().length >= 2}
					<small class="fòra">{x.ont_lista}</small>
				{/if}
				{#if f.ont_occitania && !dobèrt}
					<small class="occitania"><Crotz talha={20} teula />{x.occitania}</small>
				{/if}
			</div>
			<label class="camp">
				<span>{x.dialecte}</span>
				<select bind:value={f.dialecte}>
					<option value="">{x.cap}</option>
					{#each DIALECTES as r (r[0])}<option value={r[0]}>{nomLigne(r, langStore.current)}</option>{/each}
				</select>
			</label>
			<label class="camp">
				<span>{x.presentacion}</span>
				<small id="perfil-presentacion">{x.presentacion_ajuda}</small>
				<textarea bind:value={f.presentacion} rows="4" maxlength={MAX} aria-describedby="perfil-presentacion"></textarea>
				<small class="comptador">{f.presentacion.length} / {MAX}</small>
			</label>
			<div class="accions">
				<button type="submit" class="pc boton" disabled={enregistrant}>{enregistrant ? '…' : x.enregistrar}</button>
				{#if grops.ieu?.verificacion === 'verificat'}
					<a class="secondari" href="/grops/perfil/{encodeURIComponent(grops.ieu.pseudo)}">{x.veire}</a>
				{/if}
			</div>
			{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
			{#if enregistrat}<p class="mercé" role="status">{x.enregistrat}</p>{/if}
		</form>
	{/if}
</div>

<style>
	.perfil {
		display: grid;
		align-content: start;
		gap: var(--esp-24);
		max-width: 38rem;
		padding: var(--esp-24);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: -0.5rem 0 -1rem -0.6rem;
		color: inherit;
	}
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
	}
	header {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1.05;
	}
	.pseudo {
		margin: 2px 0 0;
		color: var(--t-tinta-2);
	}
	/* l'état : un trait d'or quand il attend ou qu'il est refusé */
	.estat {
		margin: 0;
		padding: var(--esp-8) var(--esp-12);
		border-left: 4px solid var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 10%, transparent);
		line-height: 1.5;
	}
	.estat-verificat {
		border-left-color: var(--t-linha);
		background: none;
		color: var(--t-tinta-2);
	}
	.estat a {
		color: inherit;
		font-weight: 700;
	}
	form {
		display: grid;
		gap: var(--esp-24);
	}
	.camp {
		display: grid;
		gap: var(--esp-4);
		margin: 0;
		padding: 0;
		border: 0;
	}
	.camp > span,
	.luòc > label,
	legend {
		font-weight: 700;
	}
	legend {
		margin-bottom: var(--esp-4);
	}
	small {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
	}
	.comptador {
		justify-self: end;
		font-variant-numeric: tabular-nums;
	}
	textarea,
	input[type='text'],
	select {
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.45 var(--font-body);
	}
	textarea {
		resize: vertical;
	}
	/* les pastilles : niveau, ce qu'on cherche, ce qu'on aime */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 40px;
		padding: 0.3rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		cursor: pointer;
	}
	.chip:has(input:checked) {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 14%, transparent);
	}
	.chip:has(input:focus-visible) {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.chip input {
		margin: 0;
		accent-color: var(--t-aur);
	}
	/* le lieu : les communes proposées sous le champ */
	.luòc {
		position: relative;
	}
	.luòc ul {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 5;
		margin: 4px 0 0;
		padding: 4px;
		list-style: none;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
	}
	.luòc li {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 var(--esp-12);
		min-height: 40px;
		padding: 0.5rem 0.7rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.luòc li strong,
	.occitania {
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
	}
	.luòc li strong :global(svg) {
		flex: none;
	}
	.occitania {
		color: var(--t-tinta);
		font-weight: 700;
	}
	.luòc li span {
		color: var(--t-tinta-2);
		font-size: 0.85rem;
		margin-left: auto;
		text-align: right;
	}
	.luòc li:hover,
	.luòc li.activa {
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.fòra {
		font-style: italic;
	}
	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--esp-12);
	}
	.boton {
		--r: 10px;
		justify-self: start;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		font: 700 1rem/1 var(--font-body);
	}

	.secondari {
		display: inline-flex;
		align-items: center;
		min-height: 40px;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		color: inherit;
		text-decoration: none;
	}
	.secondari:hover {
		border-color: var(--t-aur);
	}
	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.tornar:focus-visible,
	textarea:focus-visible,
	input:focus-visible,
	select:focus-visible,
	.boton:focus-visible,
	.secondari:focus-visible,
	.estat a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}
	.chip input:focus-visible {
		outline: none;
	}
</style>
