<script>
	// Parlar amassa : mise en relation entre occitanophones, à la place des
	// groupes avec messagerie (rangés sur la branche archiu/grops-2026-11-14).
	// Modèle choisi : Mintzalagun (Pays basque), locuteurs et apprenants réunis
	// par commune. Le site présente les gens ; tout se passe ensuite ailleurs.
	// Contact par double accord : rien n'est montré avant que l'autre accepte.
	// v2 (14-11) : onglets par catégorie (style des onglets de Jòcs), filtres
	// dans une colonne à part avec une phrase de résumé.
	// v3 (14-11) : branchée sur la vraie base (supabase/supabase-ligams.sql,
	// déjà en production). Les règles de sécurité sont celles de la base ; cette
	// page n'en est que le visage. Aucun texte venu de la base n'est injecté
	// en HTML. Page non indexée.
	import { untrack } from 'svelte';
	import PaginaSimpla from '$lib/components/PaginaSimpla.svelte';
	import ComunaCausir from './ComunaCausir.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady } from '$lib/authStore';

	// Goûts : [valeur permise par la base, libellé français]
	const INTERESSES = [
		['cant', 'chant'],
		['cosina', 'cuisine'],
		['istòria', 'histoire'],
		['ortalha', 'jardin'],
		['musica', 'musique'],
		['caminada', 'randonnée'],
		['rugbi', 'rugby'],
		['teatre', 'théâtre'],
		['vinha', 'vigne'],
		['lectura', 'lecture'],
		['cinèma', 'cinéma'],
		['natura', 'nature'],
		['jòcs', 'jeux'],
		['dança', 'danse'],
		['autre', 'autre']
	];
	const NOM_INTERES = Object.fromEntries(INTERESSES);
	const interesLlibre = (l) => (l || []).map((v) => NOM_INTERES[v] ?? v).join(', ');

	const CONTACTES = [
		['whatsapp', 'WhatsApp'],
		['telefon', 'Téléphone'],
		['signal', 'Signal'],
		['telegram', 'Telegram'],
		['instagram', 'Instagram'],
		['facebook', 'Facebook'],
		['corrièl', 'Courriel'],
		['autre', 'Autre']
	];
	const NOM_CONTACTE = Object.fromEntries(CONTACTES);

	const MOTIUS = [
		['faus_perfil', 'faux profil'],
		['assetjament', 'harcèlement'],
		['odi', 'haine'],
		['spam', 'spam'],
		['drague', 'drague'],
		['autre', 'autre']
	];

	// Onglets. « oc » seulement quand le mot est vérifié (API de lo Congrès).
	const VISTAS = [
		{ id: 'personas', oc: 'Personas', fr: 'Personnes', un: 'personne', unes: 'personnes' },
		{ id: 'anoncias', oc: 'Anóncias', fr: 'Annonces', un: 'annonce', unes: 'annonces' },
		{ id: 'cercles', oc: 'Cercles', fr: 'Groupes', un: 'groupe', unes: 'groupes' },
		{ id: 'demandas', fr: 'Mes demandes' },
		{ id: 'perfil', oc: 'Perfil', fr: 'Mon profil' },
		{ id: 'cossi', oc: 'Mòde d’emplec', fr: 'Mode d’emploi' }
	];
	const LISTES = ['personas', 'anoncias', 'cercles'];
	const ROTLE = { parla: 'parle occitan', apren: 'apprend', los_dos: 'parle et apprend' };
	const VIST = {
		recent: 'vu récemment',
		setmana: 'vu cette semaine',
		mes: 'vu ce mois-ci',
		ancian: 'vu il y a plus d’un mois'
	};
	const DEFAUTS = { distància: 30, ròtle: 'tots', interès: '' };

	// ---- Qui est là ----
	let uid = $derived(/** @type {any} */ ($session)?.user?.id ?? null);
	let verifie = $derived(!!(/** @type {any} */ ($session))?.user?.email_confirmed_at);
	let etat = $derived(!$authReady ? 'cargant' : !uid ? 'anonim' : !verifie ? 'sens-verif' : 'ok');

	let vista = $state('cossi');
	let premier = true;
	let flash = $state({ ok: true, text: '' });
	const dire = (text, ok = true) => (flash = { ok, text });

	// Les erreurs de la base, en français simple. « ctx » précise la limite
	// quand elle dépend de ce qu'on faisait.
	function erreur(e, ctx = '') {
		const m = `${e?.message ?? ''} ${e?.code ?? ''}`;
		if (m.includes('ligam_verificacion'))
			return 'Il faut une adresse e-mail vérifiée et un compte non suspendu pour faire cela.';
		if (m.includes('ligam_sens_perfil')) return 'Crée d’abord ton profil, dans l’onglet « Mon profil ».';
		if (m.includes('ligam_sens_contacte'))
			return 'Ajoute d’abord un moyen de contact à ton profil. Il n’est montré à l’autre personne qu’après accord.';
		if (m.includes('ligam_introbable'))
			return 'Cette personne, ce groupe ou cette demande n’est plus disponible, ou la demande n’est pas possible pour l’instant.';
		if (m.includes('ligam_limit')) {
			if (ctx === 'demanda') return 'Cinq demandes par semaine au plus. Reviens un peu plus tard.';
			if (ctx === 'anoncia') return 'Deux annonces actives au plus. Supprime-en une avant d’en déposer une autre.';
			if (ctx === 'cercle') return 'Trois groupes au plus par personne. Supprime-en un avant d’en déclarer un autre.';
			if (ctx === 'senhal') return 'Trois signalements par jour au plus. Reviens demain.';
			return 'Tu as atteint la limite autorisée. Réessaie plus tard.';
		}
		if (m.includes('ligam_ja_demandat')) return 'Une demande est déjà en cours avec cette personne.';
		if (m.includes('ligam_mot')) return 'Un mot de ce texte n’est pas accepté sur Lo Ligam. Reformule.';
		if (m.includes('ligam_messatge')) return 'Ta phrase doit faire entre 10 et 280 signes.';
		if (m.includes('ligam_novel')) return 'Ton compte doit avoir plus de sept jours pour signaler.';
		if (m.includes('ligam_interdit')) return 'Cette action n’est pas permise.';
		if (m.includes('23505')) return 'C’est déjà fait.';
		if (m.includes('23514')) return 'Une valeur ne respecte pas les limites prévues. Vérifie les champs.';
		return 'Une erreur est survenue. Réessaie dans un instant.';
	}

	// ---- Mon profil ----
	/** @type {any} undefined : pas encore chargé ; null : pas de profil */
	let perfil = $state(undefined);
	/** @type {any} */
	let contacte = $state(null);
	const FORM_VIDE = () => ({
		comuna: '',
		lat: null,
		lon: null,
		rotle: '',
		interesses: [],
		presentacion: '',
		visible: true,
		tipe: 'whatsapp',
		valor: ''
	});
	/** @type {any} */
	let form = $state(FORM_VIDE());
	let enregistre = $state(false);
	let suppression = $state(false);

	// Le centre de recherche : la commune du profil par défaut
	/** @type {any} { nom, lat, lon } */
	let centre = $state(null);
	let nomCentre = $state('');
	let distància = $state(DEFAUTS.distància);
	let ròtle = $state(DEFAUTS.ròtle);
	let interès = $state(DEFAUTS.interès);

	function remplir() {
		form = {
			comuna: perfil.comuna,
			lat: Number(perfil.lat),
			lon: Number(perfil.lon),
			rotle: perfil.rotle,
			interesses: [...(perfil.interesses ?? [])],
			presentacion: perfil.presentacion ?? '',
			visible: perfil.visible,
			tipe: contacte?.tipe ?? 'whatsapp',
			valor: contacte?.valor ?? ''
		};
	}

	function centrerSurProfil() {
		if (!perfil) return;
		centre = { nom: perfil.comuna, lat: Number(perfil.lat), lon: Number(perfil.lon) };
		nomCentre = perfil.comuna;
	}

	async function cargarPerfil() {
		const [p, c] = await Promise.all([
			supabase
				.from('ligam_perfils')
				.select('comuna, lat, lon, rotle, interesses, presentacion, visible')
				.eq('user_id', uid)
				.maybeSingle(),
			supabase.from('ligam_contactes').select('tipe, valor').eq('user_id', uid).maybeSingle()
		]);
		if (p.error) {
			dire(erreur(p.error), false);
			perfil = null;
			return;
		}
		perfil = p.data ?? null;
		contacte = c.data ?? null;
		if (perfil) {
			remplir();
			centrerSurProfil();
			cargarMeves();
		} else {
			form = FORM_VIDE();
		}
		if (premier) {
			premier = false;
			vista = perfil ? 'personas' : 'perfil';
		}
	}

	$effect(() => {
		const u = uid;
		if (etat === 'ok' && u) untrack(cargarPerfil);
		else {
			perfil = undefined;
			contacte = null;
			centre = null;
		}
	});

	async function gardarPerfil(e) {
		e.preventDefault();
		dire('');
		if (form.lat == null) return dire('Choisis ta commune dans la liste proposée.', false);
		if (!form.rotle) return dire('Dis si tu parles occitan, si tu l’apprends, ou les deux.', false);
		if (form.interesses.length > 8) return dire('Huit goûts au plus.', false);
		if (form.valor.trim().length < 3) return dire('Indique un moyen de contact (3 signes au moins).', false);
		enregistre = true;
		const r1 = await supabase.from('ligam_perfils').upsert(
			{
				user_id: uid,
				comuna: form.comuna,
				lat: form.lat,
				lon: form.lon,
				rotle: form.rotle,
				interesses: form.interesses,
				presentacion: form.presentacion.trim() || null,
				visible: form.visible
			},
			{ onConflict: 'user_id' }
		);
		if (r1.error) {
			enregistre = false;
			return dire(erreur(r1.error), false);
		}
		const r2 = await supabase
			.from('ligam_contactes')
			.upsert({ user_id: uid, tipe: form.tipe, valor: form.valor.trim() }, { onConflict: 'user_id' });
		enregistre = false;
		if (r2.error) return dire(erreur(r2.error), false);
		const nouveau = !perfil;
		await cargarPerfil();
		dire(nouveau ? 'Profil créé. Tu peux maintenant chercher des personnes près de chez toi.' : 'Profil enregistré.');
		if (nouveau) vista = 'personas';
	}

	async function suprimirPerfil() {
		const { error } = await supabase.from('ligam_perfils').delete().eq('user_id', uid);
		suppression = false;
		if (error) return dire(erreur(error), false);
		perfil = null;
		contacte = null;
		centre = null;
		form = FORM_VIDE();
		llistas = { personas: [], anoncias: [], cercles: [] };
		meves = [];
		mesAnoncias = [];
		mesCercles = [];
		dire('Ton profil, ton contact, tes annonces, tes groupes et tes demandes sont effacés.');
	}

	// ---- Les listes (RPC) ----
	/** @type {any} */
	let llistas = $state({ personas: [], anoncias: [], cercles: [] });
	let cargantLlistas = $state(false);
	let erreurLlista = $state('');
	let comptador = 0;

	async function cargarLlistas(lat, lon, km, rotle, interes) {
		const n = ++comptador;
		cargantLlistas = true;
		erreurLlista = '';
		const base = { p_lat: lat, p_lon: lon, p_km: km, p_interes: interes || null };
		const r = rotle === 'tots' ? null : rotle;
		const [a, b, c] = await Promise.all([
			supabase.rpc('ligam_vesins', { ...base, p_rotle: r }),
			supabase.rpc('ligam_anoncias_vesinas', { ...base, p_rotle: r }),
			supabase.rpc('ligam_cercles_vesins', base)
		]);
		if (n !== comptador) return;
		cargantLlistas = false;
		const err = a.error ?? b.error ?? c.error;
		if (err) erreurLlista = erreur(err);
		llistas = { personas: a.data ?? [], anoncias: b.data ?? [], cercles: c.data ?? [] };
	}

	$effect(() => {
		if (etat !== 'ok' || !centre) return;
		const args = [centre.lat, centre.lon, distància, ròtle, interès];
		untrack(() => cargarLlistas(...args));
	});
	const recarregar = () => centre && cargarLlistas(centre.lat, centre.lon, distància, ròtle, interès);

	let modificats = $derived(
		Number(perfil ? nomCentre !== perfil.comuna : !!centre) +
			Number(distància !== DEFAUTS.distància) +
			Number(ròtle !== DEFAUTS.ròtle) +
			Number(interès !== DEFAUTS.interès)
	);

	let resumit = $derived.by(() => {
		const v = /** @type {any} */ (VISTAS.find((x) => x.id === vista));
		if (!centre) return 'Choisis une commune pour voir ce qui se passe autour.';
		const n = llistas[vista]?.length ?? 0;
		let f = `${n} ${n > 1 ? v.unes : v.un} à moins de ${distància} km de ${centre.nom}`;
		if (vista !== 'cercles' && ròtle !== 'tots') f += ròtle === 'parla' ? ', locuteurs' : ', apprenants';
		if (interès) f += `, autour de : ${NOM_INTERES[interès]}`;
		return f;
	});

	function reiniciar() {
		centrerSurProfil();
		distància = DEFAUTS.distància;
		ròtle = DEFAUTS.ròtle;
		interès = DEFAUTS.interès;
	}

	// Filtres ouverts d'office sur ordinateur, repliés sur téléphone.
	let filtresDobèrts = $state(true);
	$effect(() => {
		filtresDobèrts = matchMedia('(min-width: 900px)').matches;
	});

	// ---- Dates en mots ----
	function quand(iso) {
		const j = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
		if (j < 1) return 'aujourd’hui';
		if (j < 2) return 'hier';
		if (j < 14) return `il y a ${j} jours`;
		if (j < 60) return `il y a ${Math.floor(j / 7)} semaines`;
		return `il y a ${Math.floor(j / 30)} mois`;
	}
	const dataFr = (d) => new Date(d).toLocaleDateString('fr-FR');

	// ---- Mes demandes ----
	/** @type {any[]} */
	let meves = $state([]);
	let contactesVists = $state({}); // id de demande -> { tipe, valor } | null
	let copiat = $state(null);

	async function cargarMeves() {
		const { data, error } = await supabase.rpc('ligam_mas_demandas');
		if (error) return dire(erreur(error), false);
		meves = data ?? [];
		for (const d of meves) {
			if (d.estat === 'acceptada' && !(d.id in contactesVists)) {
				const r = await supabase.rpc('ligam_contacte', { p_id: d.id });
				contactesVists[d.id] = r.data?.[0] ?? null;
			}
		}
	}
	let recebudes = $derived(meves.filter((d) => d.sens === 'recebuda' && d.estat === 'espèra'));
	let mandadas = $derived(meves.filter((d) => d.sens === 'mandada' && d.estat === 'espèra'));
	let acceptadas = $derived(meves.filter((d) => d.estat === 'acceptada'));

	// Où en est la demande avec une personne (hors groupes)
	const demandaAmb = (u) => meves.find((d) => d.autre === u && !d.cercle);

	async function respondre(id, accepta) {
		dire('');
		const { error } = await supabase.rpc('ligam_respondre', { p_id: id, p_accepta: accepta });
		if (error) return dire(erreur(error), false);
		dire(accepta ? 'Demande acceptée. Vous voyez maintenant le contact l’un de l’autre.' : 'Demande refusée.');
		await cargarMeves();
	}
	async function retirar(id) {
		dire('');
		const { error } = await supabase.rpc('ligam_retirar', { p_id: id });
		if (error) return dire(erreur(error), false);
		delete contactesVists[id];
		dire('Demande retirée.');
		await cargarMeves();
	}
	async function copiar(id, texte) {
		try {
			await navigator.clipboard.writeText(texte);
			copiat = id;
			setTimeout(() => copiat === id && (copiat = null), 2000);
		} catch {
			dire('Copie impossible ici : sélectionne le texte à la main.', false);
		}
	}

	// ---- Demander un contact, ou à rejoindre un groupe ----
	/** @type {any} { clau, a, cercle, text, avertit, envoi } */
	let dem = $state(null);
	function obrir(clau, a, cercle = null) {
		dem = { clau, a, cercle, text: '', avertit: false, envoi: false };
		acc = null;
	}
	async function enviar() {
		dire('');
		dem.envoi = true;
		const args = dem.cercle
			? { p_a: null, p_messatge: dem.text, p_cercle: dem.cercle }
			: { p_a: dem.a, p_messatge: dem.text };
		const { error } = await supabase.rpc('ligam_demandar', args);
		const estCercle = !!dem.cercle;
		dem.envoi = false;
		if (error) return dire(erreur(error, 'demanda'), false);
		dem = null;
		dire(
			estCercle
				? 'Demande envoyée. Le groupe te répond dans « Mes demandes » ; sans réponse, rien ne se passe.'
				: 'Demande envoyée. Tu verras sa réponse dans « Mes demandes ».'
		);
		await cargarMeves();
	}

	// ---- Bloquer et signaler ----
	/** @type {any} { kind: 'bloc' | 'senha', uid, pseudo, motiu, precisions, envoi } */
	let acc = $state(null);
	function obrirAcc(kind, u, pseudo) {
		acc = { kind, uid: u, pseudo, motiu: 'faus_perfil', precisions: '', envoi: false };
		dem = null;
	}
	async function blocar() {
		dire('');
		acc.envoi = true;
		const { error } = await supabase.from('ligam_blocatges').insert({ a: acc.uid });
		const pseudo = acc.pseudo;
		acc.envoi = false;
		if (error && error.code !== '23505') return dire(erreur(error), false);
		acc = null;
		dire(`${pseudo} est bloqué·e : cette personne disparaît de tes listes et ne peut plus te demander de contact.`);
		await Promise.all([recarregar(), cargarMeves()]);
	}
	async function senhalar() {
		dire('');
		acc.envoi = true;
		const { error } = await supabase
			.from('ligam_senhalaments')
			.insert({ a: acc.uid, motiu: acc.motiu, precisions: acc.precisions.trim() || null });
		acc.envoi = false;
		if (error) {
			if (error.code === '23505') {
				acc = null;
				return dire('Tu as déjà signalé cette personne. Nous regardons.');
			}
			return dire(erreur(error, 'senhal'), false);
		}
		acc = null;
		dire('Signalement envoyé. Merci : il sera examiné. Tu peux aussi bloquer la personne.');
	}

	// ---- Annonces et groupes : déposer, et gérer les siens ----
	/** @type {any[]} */
	let mesAnoncias = $state([]);
	/** @type {any[]} */
	let mesCercles = $state([]);
	/** @type {any} { texte, envoi } */
	let formAnoncia = $state(null);
	/** @type {any} */
	let formCercle = $state(null);

	async function cargarMeves2() {
		const [a, c] = await Promise.all([
			supabase.from('ligam_anoncias').select('id, texte, created_at, expira').eq('user_id', uid).gt('expira', new Date().toISOString()).order('created_at', { ascending: false }),
			supabase.from('ligam_cercles').select('id, nom, comuna').eq('user_id', uid).order('created_at', { ascending: false })
		]);
		mesAnoncias = a.data ?? [];
		mesCercles = c.data ?? [];
	}
	$effect(() => {
		if (perfil) untrack(cargarMeves2);
	});

	async function depausarAnoncia(e) {
		e.preventDefault();
		dire('');
		const t = formAnoncia.texte.trim();
		if (t.length < 20 || t.length > 500) return dire('Une annonce fait entre 20 et 500 signes.', false);
		formAnoncia.envoi = true;
		const { error } = await supabase.from('ligam_anoncias').insert({ texte: t });
		formAnoncia.envoi = false;
		if (error) return dire(erreur(error, 'anoncia'), false);
		formAnoncia = null;
		dire('Annonce déposée. Elle reste visible soixante jours.');
		await Promise.all([cargarMeves2(), recarregar()]);
	}
	async function suprimirAnoncia(id) {
		const { error } = await supabase.from('ligam_anoncias').delete().eq('id', id);
		if (error) return dire(erreur(error), false);
		dire('Annonce supprimée.');
		await Promise.all([cargarMeves2(), recarregar()]);
	}

	function obrirCercle() {
		formCercle = {
			nom: '',
			comuna: perfil?.comuna ?? '',
			lat: perfil ? Number(perfil.lat) : null,
			lon: perfil ? Number(perfil.lon) : null,
			luoc: '',
			ritme: '',
			descripcion: '',
			interesses: [],
			membres: '',
			envoi: false
		};
	}
	async function declararCercle(e) {
		e.preventDefault();
		dire('');
		const f = formCercle;
		if (f.nom.trim().length < 3) return dire('Le nom du groupe fait 3 signes au moins.', false);
		if (f.lat == null) return dire('Choisis la commune dans la liste proposée.', false);
		const membres = f.membres === '' ? null : Number(f.membres);
		if (membres != null && !(membres >= 1 && membres <= 500)) return dire('Le nombre de membres va de 1 à 500.', false);
		f.envoi = true;
		const { error } = await supabase.from('ligam_cercles').insert({
			nom: f.nom.trim(),
			comuna: f.comuna,
			lat: f.lat,
			lon: f.lon,
			luoc: f.luoc.trim() || null,
			ritme: f.ritme.trim() || null,
			descripcion: f.descripcion.trim() || null,
			interesses: f.interesses,
			membres
		});
		f.envoi = false;
		if (error) return dire(erreur(error, 'cercle'), false);
		formCercle = null;
		dire('Groupe déclaré. Il apparaît dans la liste des groupes.');
		await Promise.all([cargarMeves2(), recarregar()]);
	}
	async function suprimirCercle(id) {
		const { error } = await supabase.from('ligam_cercles').delete().eq('id', id);
		if (error) return dire(erreur(error), false);
		dire('Groupe supprimé.');
		await Promise.all([cargarMeves2(), recarregar()]);
	}

	function trie(id) {
		vista = id;
		flash = { ok: true, text: '' };
		dem = null;
		acc = null;
	}
	let onglets = $derived(etat === 'ok' ? VISTAS : VISTAS.filter((v) => v.id === 'cossi'));
	let aTraiter = $derived(recebudes.length);
</script>

<svelte:head>
	<title>Lo Ligam · essai mise en relation</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet interets(o)}
	<fieldset class="camp">
		<legend>Goûts ({o.interesses.length} sur 8 au plus)</legend>
		<div class="cases">
			{#each INTERESSES as [v, nom] (v)}
				<label class="casa">
					<input
						type="checkbox"
						value={v}
						checked={o.interesses.includes(v)}
						onchange={(e) => {
							o.interesses = e.currentTarget.checked ? [...o.interesses, v] : o.interesses.filter((x) => x !== v);
						}}
						disabled={o.interesses.length >= 8 && !o.interesses.includes(v)}
					/>
					<span>{nom}</span>
				</label>
			{/each}
		</div>
	</fieldset>
{/snippet}

{#snippet accions(u, pseudo)}
	<span class="petites">
		<button class="ligam" type="button" onclick={() => obrirAcc('bloc', u, pseudo)}>Bloquer</button>
		<button class="ligam" type="button" onclick={() => obrirAcc('senha', u, pseudo)}>Signaler</button>
	</span>
{/snippet}

{#snippet panelAcc(u)}
	{#if acc && acc.uid === u}
		<div class="demanda">
			{#if acc.kind === 'bloc'}
				<p>
					Bloquer {acc.pseudo} ? Cette personne disparaît de tes listes, ne peut plus te demander de contact, et ses demandes
					en cours disparaissent de ta page.
				</p>
				<div class="accions">
					<button class="boton" type="button" disabled={acc.envoi} onclick={blocar}>Bloquer</button>
					<button class="ligam" type="button" onclick={() => (acc = null)}>Annuler</button>
				</div>
			{:else}
				<p>Signaler {acc.pseudo} : un examen suivra. Trois signalements masquent un profil en attendant.</p>
				<fieldset class="camp">
					<legend>Motif</legend>
					<div class="causida">
						{#each MOTIUS as [v, nom] (v)}
							<label class:actiu={acc.motiu === v}>
								<input type="radio" name="motiu" value={v} bind:group={acc.motiu} />{nom}
							</label>
						{/each}
					</div>
				</fieldset>
				<label class="camp">
					<span>Précisions (facultatif)</span>
					<textarea bind:value={acc.precisions} maxlength="500" rows="3"></textarea>
					<span class="comptador">{acc.precisions.length} / 500</span>
				</label>
				<div class="accions">
					<button class="boton" type="button" disabled={acc.envoi} onclick={senhalar}>Envoyer le signalement</button>
					<button class="ligam" type="button" onclick={() => (acc = null)}>Annuler</button>
				</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet formDemanda(clau)}
	{#if dem && dem.clau === clau}
		<div class="demanda">
			<p class="avis">
				La rencontre se passe en dehors de Lo Ligam, sous votre responsabilité. Pour un premier rendez-vous :
				un lieu public, prévenir un proche, ne rien donner de confidentiel (adresse, papiers, argent).
				Un doute : signale le profil.
			</p>
			<label class="camp">
				<span>Une phrase pour te présenter</span>
				<textarea bind:value={dem.text} maxlength="280" rows="3" placeholder="Bonjour, j’apprends depuis un an et je cherche à parler un peu chaque semaine."></textarea>
				<span class="comptador">{dem.text.length} / 280</span>
			</label>
			<label class="casa">
				<input type="checkbox" bind:checked={dem.avertit} />
				<span>J’ai lu ces conseils.</span>
			</label>
			<div class="accions">
				<button class="boton" type="button" disabled={!dem.avertit || dem.text.trim().length < 10 || dem.envoi} onclick={enviar}>Envoyer la demande</button>
				<button class="ligam" type="button" onclick={() => (dem = null)}>Annuler</button>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet statutDemanda(u)}
	{@const d = demandaAmb(u)}
	{#if d?.estat === 'acceptada'}
		<span class="estat ok">Contact partagé (voir Mes demandes)</span>
	{:else if d?.sens === 'mandada'}
		<span class="estat">En attente de son accord</span>
	{:else if d?.sens === 'recebuda'}
		<span class="estat">T’a écrit (voir Mes demandes)</span>
	{:else}
		<button class="boton" type="button" onclick={() => obrir('p:' + u, u)}>Demander le contact</button>
	{/if}
{/snippet}

<PaginaSimpla
	titol="Parlar amassa"
	frasa="Trouver près de chez toi des personnes qui parlent occitan ou qui l’apprennent. Lo Ligam vous présente ; la suite se passe ailleurs, entre vous."
	parent={{ href: '/amassa', nom: 'Amassa' }}
>
	<p class="essai">Page d’essai, non référencée. Ce que tu enregistres ici est réel.</p>

	{#if etat === 'cargant'}
		<p class="nota">Chargement…</p>
	{:else if etat === 'anonim'}
		<p class="nota">
			Pour voir les personnes, les annonces et les groupes autour de toi, il faut un compte Lo Ligam.
			<a href="/compte">Se connecter ou créer un compte</a>. Aucun profil n’est visible sans compte.
		</p>
	{:else if etat === 'sens-verif'}
		<p class="nota">
			Ton adresse e-mail n’est pas encore vérifiée. Ouvre le message de confirmation reçu à l’inscription,
			puis recharge cette page. Tant que ce n’est pas fait, tu ne peux ni voir les profils ni en créer un.
			<a href="/compte">Ton compte</a>
		</p>
	{/if}

	<nav class="onglets" aria-label="Catégories">
		{#each onglets as v (v.id)}
			<button type="button" aria-current={vista === v.id ? 'page' : undefined} onclick={() => trie(v.id)}>
				{#if v.oc}<span lang="oc">{v.oc}</span>{:else}<span>{v.fr}</span>{/if}
				{#if v.id === 'perfil' && v.oc}<span class="sr">({v.fr})</span>{/if}
				{#if LISTES.includes(v.id) && centre}<span class="nombre">{llistas[v.id].length}</span>{/if}
				{#if v.id === 'demandas' && aTraiter}<span class="nombre">{aTraiter}</span>{/if}
			</button>
		{/each}
	</nav>

	{#if flash.text}
		<p class="flash" class:fail={!flash.ok} role={flash.ok ? 'status' : 'alert'}>{flash.text}</p>
	{/if}

	{#if vista === 'cossi'}
		<section class="cossi" aria-label="Comment ça marche">
			<ol>
				<li><span class="n">01</span><div><h3>Un profil</h3><p>Un compte avec une adresse vérifiée. Ta commune (jamais ton adresse), ce que tu cherches, tes goûts.</p></div></li>
				<li><span class="n">02</span><div><h3>Une demande</h3><p>Tu demandes un contact avec une phrase. L’autre accepte ou non ; sans réponse, rien ne se passe. Cinq demandes par semaine au plus.</p></div></li>
				<li><span class="n">03</span><div><h3>Un accord</h3><p>S’il ou elle accepte, chacun voit le moyen de contact que l’autre a choisi de montrer. Le site s’arrête là.</p></div></li>
			</ol>
			<p class="nota">Signaler ou bloquer à tout moment ; trois signalements retirent un profil de Parlar amassa le temps d’un examen. Effacer son profil : un clic. Réservé aux plus de 18 ans.</p>
			<p class="nota">Mécanique inspirée de Mintzalagun, programme de conversation du Pays basque.</p>
		</section>
	{:else if vista === 'perfil'}
		<section class="cossi" aria-label="Mon profil">
			{#if perfil === undefined}
				<p class="nota">Chargement…</p>
			{:else}
				{#if !perfil}
					<p class="nota">Tu n’as pas encore de profil. Il te faut une commune, ce que tu es, et un moyen de contact (montré seulement après accord).</p>
				{/if}
				<form class="formulari" onsubmit={gardarPerfil}>
					<div class="camp">
						<label class="etiq" for="p-comuna">Ma commune</label>
						<ComunaCausir id="p-comuna" bind:value={form.comuna} onchoose={(c) => { form.comuna = c.nom; form.lat = c.lat; form.lon = c.lon; }} />
						<span class="comptador esq">
							{#if form.lat != null}On ne garde que le centre de la commune ({form.lat} ; {form.lon}), jamais ta position.{:else}Choisis une commune dans la liste proposée.{/if}
						</span>
					</div>

					<fieldset class="camp">
						<legend>Je…</legend>
						<div class="causida colomna">
							{#each [['parla', 'parle occitan'], ['apren', 'apprends l’occitan'], ['los_dos', 'parle et j’apprends encore']] as [v, nom] (v)}
								<label class:actiu={form.rotle === v}>
									<input type="radio" name="p-rotle" value={v} bind:group={form.rotle} />{nom}
								</label>
							{/each}
						</div>
					</fieldset>

					{@render interets(form)}

					<label class="camp">
						<span>Présentation (facultatif)</span>
						<textarea bind:value={form.presentacion} maxlength="280" rows="3" placeholder="Deux phrases sur toi. Pas de coordonnées ici : elles sont visibles de tous."></textarea>
						<span class="comptador">{form.presentacion.length} / 280</span>
					</label>

					<label class="casa">
						<input type="checkbox" bind:checked={form.visible} />
						<span>Mon profil est visible dans les listes</span>
					</label>

					<fieldset class="camp">
						<legend>Mon moyen de contact</legend>
						<div class="doble">
							<select bind:value={form.tipe} aria-label="Type de contact">
								{#each CONTACTES as [v, nom] (v)}<option value={v}>{nom}</option>{/each}
							</select>
							<input class="texte" type="text" bind:value={form.valor} maxlength="120" aria-label="Numéro ou identifiant" placeholder="Numéro, identifiant ou adresse" autocomplete="off" />
						</div>
						<span class="comptador esq">Il n’est montré qu’à une personne dont tu as accepté la demande (ou dont tu as accepté de te voir). Jamais dans les listes.</span>
					</fieldset>

					<div class="accions">
						<button class="boton" type="submit" disabled={enregistre}>{perfil ? 'Enregistrer' : 'Créer mon profil'}</button>
					</div>
				</form>

				{#if perfil}
					<div class="danger">
						{#if !suppression}
							<button class="ligam" type="button" onclick={() => (suppression = true)}>Supprimer mon profil</button>
						{:else}
							<p>Supprimer ton profil efface aussi ton contact, tes annonces, tes groupes et tes demandes. C’est définitif. Ton compte Lo Ligam, lui, reste.</p>
							<div class="accions">
								<button class="boton" type="button" onclick={suprimirPerfil}>Oui, tout effacer</button>
								<button class="ligam" type="button" onclick={() => (suppression = false)}>Annuler</button>
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</section>
	{:else if vista === 'demandas'}
		<section class="cossi" aria-label="Mes demandes">
			<h2 class="sous">Reçues, en attente</h2>
			{#if recebudes.length === 0}<p class="nota">Aucune demande à traiter.</p>{/if}
			<ul class="lista">
				{#each recebudes as d (d.id)}
					<li>
						<p class="nom">{d.pseudo}{#if d.cercle} <span class="meta">veut rejoindre « {d.cercle} »</span>{/if}</p>
						<p class="citacion">{d.messatge}</p>
						<p class="meta">{quand(d.created_at)}</p>
						<div class="accions">
							<button class="boton" type="button" onclick={() => respondre(d.id, true)}>Accepter</button>
							<button class="ligam" type="button" onclick={() => respondre(d.id, false)}>Refuser</button>
							{@render accions(d.autre, d.pseudo)}
						</div>
						{@render panelAcc(d.autre)}
					</li>
				{/each}
			</ul>

			<h2 class="sous">Envoyées, en attente</h2>
			{#if mandadas.length === 0}<p class="nota">Aucune demande en attente de réponse.</p>{/if}
			<ul class="lista">
				{#each mandadas as d (d.id)}
					<li>
						<p class="nom">{d.pseudo}{#if d.cercle} <span class="meta">groupe « {d.cercle} »</span>{/if}</p>
						<p class="citacion">{d.messatge}</p>
						<p class="meta">{quand(d.created_at)}</p>
						<div class="accions">
							<button class="ligam" type="button" onclick={() => retirar(d.id)}>Retirer la demande</button>
							{@render accions(d.autre, d.pseudo)}
						</div>
						{@render panelAcc(d.autre)}
					</li>
				{/each}
			</ul>

			<h2 class="sous">Contacts partagés</h2>
			{#if acceptadas.length === 0}<p class="nota">Aucun contact partagé pour l’instant.</p>{/if}
			<ul class="lista">
				{#each acceptadas as d (d.id)}
					{@const c = contactesVists[d.id]}
					<li>
						<p class="nom">{d.pseudo}{#if d.cercle} <span class="meta">groupe « {d.cercle} »</span>{/if}</p>
						{#if c}
							<p class="contacte">
								<span class="meta">{NOM_CONTACTE[c.tipe] ?? c.tipe}</span>
								<span class="valor">{c.valor}</span>
								<button class="ligam" type="button" onclick={() => copiar(d.id, c.valor)}>{copiat === d.id ? 'Copié' : 'Copier'}</button>
							</p>
							<p class="meta">Texte à recopier à la main dans ton application : aucun lien n’est ouvert d’ici, par prudence.</p>
						{:else}
							<p class="meta">Contact indisponible pour l’instant.</p>
						{/if}
						<div class="accions">
							<button class="ligam" type="button" onclick={() => retirar(d.id)}>Retirer le contact</button>
							{@render accions(d.autre, d.pseudo)}
						</div>
						{@render panelAcc(d.autre)}
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="mesa">
			<details class="filtres" bind:open={filtresDobèrts}>
				<summary class="filtres-cap">
					<h2>Filtrer{#if modificats}<span class="nombre"> ({modificats})</span>{/if}</h2>
					<span class="plec" aria-hidden="true">{filtresDobèrts ? 'Replier' : 'Ouvrir'}</span>
				</summary>
				<div class="filtres-cors">
				{#if modificats}
					<button type="button" class="ligam" onclick={reiniciar}>Tout effacer</button>
				{/if}

				<div class="camp">
					<label class="etiq" for="f-comuna">Ma commune</label>
					<ComunaCausir id="f-comuna" bind:value={nomCentre} onchoose={(c) => (centre = c)} />
				</div>

				<fieldset class="camp">
					<legend>Distance</legend>
					<div class="causida">
						{#each [10, 30, 100] as d (d)}
							<label class:actiu={distància === d}>
								<input type="radio" name="distancia" value={d} bind:group={distància} />{d} km
							</label>
						{/each}
					</div>
				</fieldset>

				{#if vista !== 'cercles'}
					<fieldset class="camp">
						<legend>Je cherche</legend>
						<div class="causida colomna">
							{#each [['tots', 'tout le monde'], ['parla', 'des locuteurs'], ['apren', 'des apprenants']] as [v, nom] (v)}
								<label class:actiu={ròtle === v}>
									<input type="radio" name="rotle" value={v} bind:group={ròtle} />{nom}
								</label>
							{/each}
						</div>
					</fieldset>
				{/if}

				<label class="camp">
					<span>Centre d’intérêt</span>
					<select bind:value={interès}>
						<option value="">tous</option>
						{#each INTERESSES as [v, nom] (v)}<option value={v}>{nom}</option>{/each}
					</select>
				</label>
				</div>
			</details>

			<section class="resultats" aria-live="polite" aria-labelledby="t-resumit">
				<p id="t-resumit" class="resumit">{resumit}</p>

				{#if !perfil && perfil !== undefined}
					<p class="nota">Tu n’as pas encore de profil : tu peux regarder, mais pas demander de contact. <button class="ligam" type="button" onclick={() => trie('perfil')}>Créer mon profil</button></p>
				{/if}
				{#if erreurLlista}<p class="flash fail" role="alert">{erreurLlista}</p>{/if}
				{#if centre && !cargantLlistas && !erreurLlista && llistas[vista].length === 0}
					<p class="void">Rien dans ce rayon pour l’instant. Élargis la distance ou retire un filtre.</p>
				{/if}

				{#if vista === 'personas'}
					<ul class="lista">
						{#each llistas.personas as p (p.user_id)}
							<li>
								<div class="linha">
									<div class="qui">
										<span class="nom">{p.pseudo}</span>
										<span class="meta">{ROTLE[p.rotle]} · {p.comuna}{p.km ? `, ${p.km} km` : ''} · {VIST[p.vist] ?? ''}</span>
										{#if p.interesses?.length}<span class="meta">{interesLlibre(p.interesses)}</span>{/if}
										{#if p.presentacion}<span class="meta presentacion">{p.presentacion}</span>{/if}
									</div>
									{@render statutDemanda(p.user_id)}
								</div>
								<div class="accions petit">{@render accions(p.user_id, p.pseudo)}</div>
								{@render formDemanda('p:' + p.user_id)}
								{@render panelAcc(p.user_id)}
							</li>
						{/each}
					</ul>
				{:else if vista === 'anoncias'}
					<ul class="lista">
						{#each llistas.anoncias as a (a.id)}
							<li>
								<p class="citacion">{a.texte}</p>
								<div class="linha">
									<p class="meta">{a.pseudo}, {ROTLE[a.rotle]} · {a.comuna}{a.km ? `, ${a.km} km` : ''} · {quand(a.created_at)}</p>
									{@render statutDemanda(a.user_id)}
								</div>
								<div class="accions petit">{@render accions(a.user_id, a.pseudo)}</div>
								{@render formDemanda('p:' + a.user_id)}
								{@render panelAcc(a.user_id)}
							</li>
						{/each}
					</ul>

					{#if perfil}
						{#if mesAnoncias.length}
							<h2 class="sous">Mes annonces</h2>
							<ul class="lista">
								{#each mesAnoncias as a (a.id)}
									<li>
										<p class="citacion">{a.texte}</p>
										<p class="meta">Déposée {quand(a.created_at)}, visible jusqu’au {dataFr(a.expira)}.</p>
										<button class="ligam" type="button" onclick={() => suprimirAnoncia(a.id)}>Supprimer</button>
									</li>
								{/each}
							</ul>
						{/if}
						{#if !formAnoncia}
							<button class="boton" type="button" onclick={() => (formAnoncia = { texte: '', envoi: false })}>Déposer une annonce</button>
						{:else}
							<form class="demanda" onsubmit={depausarAnoncia}>
								<label class="camp">
									<span>Ton annonce (20 à 500 signes). Pas de coordonnées dedans : elles se donnent après accord.</span>
									<textarea bind:value={formAnoncia.texte} maxlength="500" rows="4"></textarea>
									<span class="comptador">{formAnoncia.texte.length} / 500</span>
								</label>
								<div class="accions">
									<button class="boton" type="submit" disabled={formAnoncia.texte.trim().length < 20 || formAnoncia.envoi}>Publier l’annonce</button>
									<button class="ligam" type="button" onclick={() => (formAnoncia = null)}>Annuler</button>
								</div>
							</form>
						{/if}
					{:else if perfil !== undefined}
						<p class="nota">Pour déposer une annonce, crée d’abord ton profil.</p>
					{/if}
				{:else if vista === 'cercles'}
					<p class="nota">Des groupes qui se retrouvent en vrai. On voit s’ils sont actifs, puis on demande à les rejoindre ; le reste se passe chez eux.</p>
					<ul class="lista">
						{#each llistas.cercles as c (c.id)}
							<li>
								<div class="linha">
									<div class="qui">
										<span class="nom">{c.nom}</span>
										<span class="meta">{c.comuna}{c.km ? `, ${c.km} km` : ''}{c.luoc ? ` · ${c.luoc}` : ''}{c.ritme ? ` · ${c.ritme}` : ''}</span>
										<span class="meta" class:dormant={!c.actiu}>
											{#if c.membres}{c.membres} membres · {/if}{c.darriera_rencontra ? `dernière rencontre le ${dataFr(c.darriera_rencontra)}` : 'pas de rencontre indiquée'}{c.actiu ? '' : ' · semble en sommeil'}
										</span>
										{#if c.interesses?.length}<span class="meta">{interesLlibre(c.interesses)}</span>{/if}
										{#if c.descripcion}<span class="meta presentacion">{c.descripcion}</span>{/if}
									</div>
									<button class="boton" type="button" disabled={!c.actiu} onclick={() => obrir('c:' + c.id, null, c.id)}>Demander à rejoindre</button>
								</div>
								{@render formDemanda('c:' + c.id)}
							</li>
						{/each}
					</ul>

					{#if perfil}
						{#if mesCercles.length}
							<h2 class="sous">Mes groupes</h2>
							<ul class="lista">
								{#each mesCercles as c (c.id)}
									<li class="linha">
										<span>{c.nom} · {c.comuna}</span>
										<button class="ligam" type="button" onclick={() => suprimirCercle(c.id)}>Supprimer</button>
									</li>
								{/each}
							</ul>
						{/if}
						{#if !formCercle}
							<button class="boton" type="button" onclick={obrirCercle}>Déclarer un groupe</button>
						{:else}
							<form class="demanda formulari" onsubmit={declararCercle}>
								<label class="camp">
									<span>Nom du groupe</span>
									<input class="texte" type="text" bind:value={formCercle.nom} maxlength="80" />
								</label>
								<div class="camp">
									<label class="etiq" for="c-comuna">Commune</label>
									<ComunaCausir id="c-comuna" bind:value={formCercle.comuna} onchoose={(c) => { formCercle.comuna = c.nom; formCercle.lat = c.lat; formCercle.lon = c.lon; }} />
								</div>
								<label class="camp">
									<span>Lieu (facultatif)</span>
									<input class="texte" type="text" bind:value={formCercle.luoc} maxlength="120" />
								</label>
								<label class="camp">
									<span>Rythme (facultatif, par exemple « chaque jeudi, 18 h »)</span>
									<input class="texte" type="text" bind:value={formCercle.ritme} maxlength="120" />
								</label>
								<label class="camp">
									<span>Description (facultatif)</span>
									<textarea bind:value={formCercle.descripcion} maxlength="500" rows="3"></textarea>
									<span class="comptador">{formCercle.descripcion.length} / 500</span>
								</label>
								<label class="camp">
									<span>Nombre de membres (facultatif)</span>
									<input class="texte" type="number" min="1" max="500" bind:value={formCercle.membres} />
								</label>
								{@render interets(formCercle)}
								<div class="accions">
									<button class="boton" type="submit" disabled={formCercle.envoi}>Déclarer le groupe</button>
									<button class="ligam" type="button" onclick={() => (formCercle = null)}>Annuler</button>
								</div>
							</form>
						{/if}
					{:else if perfil !== undefined}
						<p class="nota">Pour déclarer un groupe, crée d’abord ton profil.</p>
					{/if}
				{/if}
			</section>
		</div>
	{/if}
</PaginaSimpla>

<style>
	.essai {
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
		font-size: 0.875rem;
	}

	/* Onglets : la même recette que ceux de Jòcs (trait or sous l'actif). */
	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-32);
		margin-top: var(--esp-32);
		border-bottom: 1px solid var(--t-linha);
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--t-fons);
	}
	.onglets button {
		display: inline-flex;
		align-items: baseline;
		gap: var(--esp-8);
		min-height: 2.75rem;
		padding: var(--esp-8) 0;
		margin-bottom: -1px;
		font: inherit;
		font-size: 1.05rem;
		color: var(--t-tinta-2);
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.onglets button:hover {
		color: var(--t-tinta);
	}
	.onglets button[aria-current='page'] {
		color: var(--t-tinta);
		font-weight: 700;
		border-bottom-color: var(--t-aur);
	}
	.onglets .nombre {
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--t-tinta-2);
		font-variant-numeric: tabular-nums;
	}

	/* Deux colonnes sur ordinateur : filtres à gauche, résultats à droite. */
	.mesa {
		display: grid;
		gap: var(--esp-32) var(--esp-48);
		margin-top: var(--esp-32);
	}
	@media (min-width: 900px) {
		.mesa {
			grid-template-columns: 17rem minmax(0, 44rem);
		}
		/* Le panneau des filtres se lit comme un panneau à part (Romain, 14-11 :
		   « je n'arrivais pas à comprendre si c'était en ligne ou en deux
		   colonnes ») : fond plâtre, angles droits, et un filet vertical qui
		   le sépare des résultats sur toute la hauteur. */
		.filtres {
			position: sticky;
			top: 4rem;
			align-self: start;
			padding: var(--esp-16) var(--esp-24) var(--esp-24);
			background: var(--t-fons-2);
		}
		.resultats {
			border-left: 1px solid var(--t-linha);
			padding-left: var(--esp-48);
			min-height: 100%;
		}
		.mesa {
			column-gap: var(--esp-48);
		}
		.plec {
			display: none;
		}
	}

	.filtres-cors {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--esp-24);
		margin-top: var(--esp-16);
	}
	.filtres-cors > .ligam {
		align-self: flex-start;
		min-height: 2rem;
	}
	.filtres-cap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 2.75rem;
		padding-bottom: var(--esp-8);
		border-bottom: 1px solid var(--t-linha);
		list-style: none;
		cursor: pointer;
	}
	.filtres-cap::-webkit-details-marker {
		display: none;
	}
	.filtres-cap:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.filtres-cap .nombre {
		font-weight: 400;
		color: var(--t-tinta-2);
	}
	.plec {
		font-size: 0.9rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	h2 {
		font-family: inherit;
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
	}
	.camp {
		display: block;
		border: 0;
		margin: 0;
		padding: 0;
	}
	.camp > span:first-child,
	legend {
		display: block;
		padding: 0;
		margin-bottom: var(--esp-4);
		font-size: 0.875rem;
		color: var(--t-tinta-2);
	}
	select {
		width: 100%;
		min-height: 2.75rem;
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--t-tinta-2);
		border-radius: 0;
		padding: var(--esp-4) 0;
		cursor: pointer;
	}
	select option {
		color: initial;
	}
	select:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.causida {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--esp-16);
	}
	.causida.colomna {
		flex-direction: column;
		align-items: flex-start;
	}
	.causida label {
		display: inline-flex;
		align-items: center;
		min-height: 2.5rem;
		color: var(--t-tinta-2);
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.causida label:hover {
		color: var(--t-tinta);
	}
	.causida label.actiu {
		color: var(--t-tinta);
		font-weight: 700;
		border-bottom-color: var(--t-accion);
	}
	.causida input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.causida label:has(input:focus-visible) {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}

	.resumit {
		margin: 0;
		padding-bottom: var(--esp-8);
		font-size: 1.15rem;
		font-weight: 700;
		border-bottom: 1px solid var(--t-linha);
	}
	.lista {
		list-style: none;
		margin: 0 0 var(--esp-24);
		padding: 0;
	}
	.lista > li {
		padding: var(--esp-16) 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.linha {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--esp-12) var(--esp-24);
	}
	.qui {
		display: flex;
		flex-direction: column;
		gap: var(--esp-4);
		min-width: 0;
	}
	.nom {
		font-weight: 700;
		font-size: 1.05rem;
	}
	.meta {
		margin: 0;
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.meta.dormant {
		font-style: italic;
	}
	.citacion {
		margin: 0 0 var(--esp-4);
		font-size: 1.05rem;
		line-height: 1.5;
	}
	.nota,
	.void {
		margin: var(--esp-16) 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	.boton {
		min-height: 2.75rem;
		padding: var(--esp-8) var(--esp-16);
		font: inherit;
		font-weight: 700;
		color: var(--t-accion-tinta);
		background: var(--t-accion);
		border: 0;
		border-radius: 3px;
		cursor: pointer;
	}
	.boton:hover:not(:disabled) {
		background: var(--t-accion-viu);
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.boton:focus-visible,
	.ligam:focus-visible,
	.onglets button:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.ligam {
		min-height: 2.75rem;
		padding: 0;
		font: inherit;
		font-size: 0.9rem;
		color: var(--t-tinta);
		background: none;
		border: 0;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}
	.estat {
		font-size: 0.9rem;
		color: var(--t-tinta-2);
	}
	.estat.ok {
		color: var(--t-aur);
		font-weight: 700;
	}

	.demanda {
		margin-top: var(--esp-16);
		max-width: 38rem;
	}
	.demanda p {
		margin: 0 0 var(--esp-12);
		line-height: 1.5;
	}
	.avis {
		color: var(--t-tinta-2);
		font-size: 0.95rem;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: var(--esp-8);
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 1px solid var(--t-linha);
		border-radius: 3px;
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.comptador {
		display: block;
		text-align: right;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.casa {
		display: flex;
		gap: var(--esp-8);
		align-items: center;
		min-height: 2.75rem;
	}
	.casa input {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: var(--t-accion);
	}
	.accions {
		display: flex;
		gap: var(--esp-24);
		align-items: center;
	}

	.cossi {
		margin-top: var(--esp-32);
		max-width: 44rem;
	}
	.cossi ol {
		list-style: none;
		margin: 0 0 var(--esp-24);
		padding: 0;
	}
	.cossi li {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 0 var(--esp-16);
		padding: var(--esp-16) 0;
		border-bottom: 1px solid var(--t-linha);
	}
	.cossi .n {
		font-family: 'Limelight', serif;
		font-size: 2rem;
		line-height: 1;
		color: var(--t-aur);
	}
	.cossi h3 {
		margin: 0 0 var(--esp-4);
		font-family: inherit;
		font-weight: 700;
		font-size: 1.05rem;
	}
	.cossi li p {
		margin: 0;
		line-height: 1.5;
	}

	/* Ajouts de la version branchée sur la base : mêmes jetons, mêmes filets. */
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.camp > .etiq {
		display: block;
		margin-bottom: var(--esp-4);
		font-size: 0.875rem;
		color: var(--t-tinta-2);
	}
	.texte {
		width: 100%;
		box-sizing: border-box;
		min-height: 2.75rem;
		font: inherit;
		color: var(--t-tinta);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--t-tinta-2);
		border-radius: 0;
		padding: var(--esp-4) 0;
	}
	.texte:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.formulari {
		display: flex;
		flex-direction: column;
		gap: var(--esp-24);
		max-width: 38rem;
	}
	.doble {
		display: grid;
		grid-template-columns: 10rem minmax(0, 1fr);
		gap: var(--esp-16);
	}
	.cases {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		gap: 0 var(--esp-16);
	}
	.comptador.esq {
		text-align: left;
		margin-top: var(--esp-4);
	}
	.flash {
		margin: var(--esp-16) 0 0;
		padding-left: var(--esp-12);
		border-left: 2px solid var(--t-aur);
		line-height: 1.5;
	}
	.flash.fail {
		border-left-color: var(--t-accion);
		font-weight: 700;
	}
	.sous {
		margin: var(--esp-32) 0 var(--esp-4);
		font-size: 1.15rem;
		font-weight: 700;
	}
	.sous:first-child {
		margin-top: 0;
	}
	.presentacion {
		color: var(--t-tinta);
	}
	.petites {
		display: inline-flex;
		gap: var(--esp-16);
	}
	.accions.petit {
		margin-top: var(--esp-4);
	}
	.accions {
		flex-wrap: wrap;
	}
	.contacte {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--esp-12);
		margin: var(--esp-8) 0;
	}
	.valor {
		font-size: 1.1rem;
		font-weight: 700;
		user-select: all;
		overflow-wrap: anywhere;
	}
	.danger {
		margin-top: var(--esp-48);
		padding-top: var(--esp-16);
		border-top: 1px solid var(--t-linha);
	}
	.danger p {
		line-height: 1.5;
	}
	.nota a {
		color: var(--t-tinta);
	}
	@media (max-width: 520px) {
		.doble {
			grid-template-columns: 1fr;
		}
	}
</style>
