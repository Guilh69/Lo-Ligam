<script>
	// La conversation avec un contact (2026-10-25, supabase-contactes.sql) :
	// même strict minimum que les groupes. Écrire, supprimer son message,
	// signaler un message reçu ; bloquer depuis l'en-tête. Les messages
	// arrivent par le canal « ieu:<id> » (grops.svelte.js) ; la base refuse
	// tout message hors contact accepté.
	import Icona from '$lib/components/Icona.svelte';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { grops, escotar, blocar, marcarLegitPrivat, clauError, ora } from '$lib/grops/grops.svelte.js';
	import { X_ERRORS } from '$lib/grops/textes.js';
	import Avatar from '$lib/grops/Avatar.svelte';

	const X = {
		oc: {
			tornar: 'Tornar a la lista',
			perfil: 'Son perfil',
			blocar: 'Blocar',
			blocar_conf: 'Blocar aquesta persona ? Te poirà pas mai escriure ni te demandar.',
			ancians: 'Messatges mai ancians',
			vuèg: 'Cap de messatge encara : escriu lo primièr !',
			camp: 'Ton messatge',
			mandar: 'Mandar',
			suprimir: 'Suprimir',
			suprimir_conf: 'Suprimir aqueste messatge ?',
			senhalar: 'Senhalar',
			senhal_titol: 'Senhalar aqueste messatge',
			motiu: 'Lo motiu',
			motius: { insulta: 'Insulte', assetjament: 'Assetjament', odi: 'Òdi', spam: 'Publicitat', autre: 'Autre' },
			precisions: 'Precisions (se vòls)',
			anullar: 'Anullar',
			tampar: 'Tampar',
			mercé: 'Mercés : la moderacion o va veire.',
			ja: 'Ja l’as senhalat.',
			invisible: 'Aqueste perfil es pas visible.',
			pas_contacte: 'Per escriure, cal èsser en contacte.',
			...X_ERRORS.oc
		},
		fr: {
			tornar: 'Retour à la liste',
			perfil: 'Son profil',
			blocar: 'Bloquer',
			blocar_conf: 'Bloquer cette personne ? Elle ne pourra plus t’écrire ni te demander.',
			ancians: 'Messages plus anciens',
			vuèg: 'Aucun message encore : écris le premier !',
			camp: 'Ton message',
			mandar: 'Envoyer',
			suprimir: 'Supprimer',
			suprimir_conf: 'Supprimer ce message ?',
			senhalar: 'Signaler',
			senhal_titol: 'Signaler ce message',
			motiu: 'Le motif',
			motius: { insulta: 'Insulte', assetjament: 'Harcèlement', odi: 'Haine', spam: 'Publicité', autre: 'Autre' },
			precisions: 'Précisions (si tu veux)',
			anullar: 'Annuler',
			tampar: 'Fermer',
			mercé: 'Merci : la modération va le voir.',
			ja: 'Tu l’as déjà signalé.',
			invisible: 'Ce profil n’est pas visible.',
			pas_contacte: 'Pour écrire, il faut être en contact.',
			...X_ERRORS.fr
		},
		es: {
			tornar: 'Volver a la lista',
			perfil: 'Su perfil',
			blocar: 'Bloquear',
			blocar_conf: '¿Bloquear a esta persona? Ya no podrá escribirte ni enviarte solicitudes.',
			ancians: 'Mensajes más antiguos',
			vuèg: 'Aún no hay mensajes: ¡escribe el primero!',
			camp: 'Tu mensaje',
			mandar: 'Enviar',
			suprimir: 'Eliminar',
			suprimir_conf: '¿Eliminar este mensaje?',
			senhalar: 'Denunciar',
			senhal_titol: 'Denunciar este mensaje',
			motiu: 'El motivo',
			motius: { insulta: 'Insulto', assetjament: 'Acoso', odi: 'Odio', spam: 'Publicidad', autre: 'Otro' },
			precisions: 'Detalles (si quieres)',
			anullar: 'Cancelar',
			tampar: 'Cerrar',
			mercé: 'Gracias: la moderación lo revisará.',
			ja: 'Ya lo has denunciado.',
			invisible: 'Este perfil no es visible.',
			pas_contacte: 'Para escribir, hay que estar en contacto.',
			...X_ERRORS.es
		},
		en: {
			tornar: 'Back to the list',
			perfil: 'Their profile',
			blocar: 'Block',
			blocar_conf: 'Block this person? They will no longer be able to write to you or send you requests.',
			ancians: 'Older messages',
			vuèg: 'No messages yet: write the first one!',
			camp: 'Your message',
			mandar: 'Send',
			suprimir: 'Delete',
			suprimir_conf: 'Delete this message?',
			senhalar: 'Report',
			senhal_titol: 'Report this message',
			motiu: 'The reason',
			motius: { insulta: 'Insult', assetjament: 'Harassment', odi: 'Hate', spam: 'Advertising', autre: 'Other' },
			precisions: 'Details (if you like)',
			anullar: 'Cancel',
			tampar: 'Close',
			mercé: 'Thank you: the moderators will take a look.',
			ja: 'You’ve already reported it.',
			invisible: 'This profile isn’t visible.',
			pas_contacte: 'To write, you need to be in contact.',
			...X_ERRORS.en
		},
		ca: {
			tornar: 'Torna a la llista',
			perfil: 'El seu perfil',
			blocar: 'Bloqueja',
			blocar_conf: 'Bloquejar aquesta persona? Ja no podrà escriure’t ni enviar-te sol·licituds.',
			ancians: 'Missatges més antics',
			vuèg: 'Encara no hi ha cap missatge: escriu el primer!',
			camp: 'El teu missatge',
			mandar: 'Envia',
			suprimir: 'Suprimeix',
			suprimir_conf: 'Suprimir aquest missatge?',
			senhalar: 'Denuncia',
			senhal_titol: 'Denuncia aquest missatge',
			motiu: 'El motiu',
			motius: { insulta: 'Insult', assetjament: 'Assetjament', odi: 'Odi', spam: 'Publicitat', autre: 'Altre' },
			precisions: 'Precisions (si vols)',
			anullar: 'Cancel·la',
			tampar: 'Tanca',
			mercé: 'Gràcies: la moderació ho revisarà.',
			ja: 'Ja l’has denunciat.',
			invisible: 'Aquest perfil no és visible.',
			pas_contacte: 'Per escriure, cal estar en contacte.',
			...X_ERRORS.ca
		},
		ar: {
			tornar: 'العودة إلى القائمة',
			perfil: 'الملف الشخصي',
			blocar: 'حظر',
			blocar_conf: 'هل تريد حظر هذا الشخص؟ لن يستطيع بعد الآن مراسلتك ولا إرسال طلبات إليك.',
			ancians: 'رسائل أقدم',
			vuèg: 'لا توجد رسائل بعد: يمكنك كتابة أول رسالة!',
			camp: 'رسالتك',
			mandar: 'إرسال',
			suprimir: 'حذف',
			suprimir_conf: 'هل تريد حذف هذه الرسالة؟',
			senhalar: 'إبلاغ',
			senhal_titol: 'الإبلاغ عن هذه الرسالة',
			motiu: 'السبب',
			motius: { insulta: 'إهانة', assetjament: 'مضايقة', odi: 'كراهية', spam: 'إعلانات', autre: 'أخرى' },
			precisions: 'تفاصيل (إن أردت)',
			anullar: 'إلغاء',
			tampar: 'إغلاق',
			mercé: 'شكرًا: سيطّلع فريق الإشراف على الأمر.',
			ja: 'سبق أن أبلغت عن هذه الرسالة.',
			invisible: 'هذا الملف الشخصي غير ظاهر.',
			pas_contacte: 'لا يمكن الكتابة إلا لمن هو في جهات اتصالك.',
			...X_ERRORS.ar
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	let pseudo = $derived(page.params.pseudo);
	let autre = $state(null); // { user_id, pseudo, es_admin } (public.perfil)
	let sabut = $state(false);
	// toujours en contact ? la liste des contacts le dit, et suit le direct
	let contacte = $derived(autre && grops.contactes.some((c) => c.user_id === autre.user_id && c.estat === 'acceptat'));
	// en développement, « ?simular » montre une conversation d'exemple
	const simular = browser && import.meta.env.DEV && new URLSearchParams(location.search).has('simular');
	let ieu = $derived(grops.uid ?? (simular ? 'ieu' : null));

	const PAGINA = 50;
	const CHAMPS = 'id, de, a, tèxte, created_at';
	let messatges = $state([]);
	let cargat = $state(false);
	let totCargat = $state(true);
	let error = $state(null);

	let log = $state();
	let camp = $state();
	let tèxte = $state('');
	let mandant = $state(false);
	let prèpBas = true;

	$effect(() => {
		const p = pseudo;
		if (simular && !grops.uid) {
			const ara = Date.now();
			autre = { user_id: 's2', pseudo: p };
			messatges = [
				{ id: 1, de: 's2', a: 'ieu', tèxte: 'Adieu ! As vist lo grop de Montpelhièr ?', created_at: new Date(ara - 3600e3).toISOString() },
				{ id: 2, de: 's2', a: 'ieu', tèxte: 'I a un bal dissabte.', created_at: new Date(ara - 3500e3).toISOString() },
				{ id: 3, de: 'ieu', a: 's2', tèxte: 'Òc, i serai !', created_at: new Date(ara - 600e3).toISOString() }
			];
			sabut = cargat = true;
			return;
		}
		if (!grops.uid) return;
		autre = null;
		sabut = false;
		messatges = [];
		cargat = false;
		error = null;
		supabase.rpc('perfil', { p }).then(({ data }) => {
			if (p !== pseudo) return;
			autre = data?.[0] ?? null;
			sabut = true;
		});
	});

	$effect(() => {
		const u = autre?.user_id;
		if (!u || simular) return;
		grops.obertAmb = u;
		cargar(u);
		marcarLegitPrivat(u);
		const lèva = escotar((canal, ev, p) => canal === 'ieu' && (p.de === u || p.a === u) && avís(u, ev, p));
		return () => {
			lèva();
			if (grops.obertAmb === u) grops.obertAmb = null;
		};
	});

	// les messages des deux sens entre soi et la personne
	const entre = (u) => `and(de.eq.${grops.uid},a.eq.${u}),and(de.eq.${u},a.eq.${grops.uid})`;

	async function cargar(u) {
		const { data: d } = await supabase
			.from('messatges_privats')
			.select(CHAMPS)
			.or(entre(u))
			.order('created_at', { ascending: false })
			.limit(PAGINA);
		if (u !== autre?.user_id) return;
		messatges = (d ?? []).reverse();
		totCargat = (d?.length ?? 0) < PAGINA;
		cargat = true;
		await tick();
		enBas(true);
	}

	async function ancians() {
		const primièr = messatges[0];
		if (!primièr) return;
		const h = log.scrollHeight;
		const { data: d } = await supabase
			.from('messatges_privats')
			.select(CHAMPS)
			.or(entre(autre.user_id))
			.lt('created_at', primièr.created_at)
			.order('created_at', { ascending: false })
			.limit(PAGINA);
		messatges = [...(d ?? []).reverse(), ...messatges];
		totCargat = (d?.length ?? 0) < PAGINA;
		await tick();
		log.scrollTop += log.scrollHeight - h; // on reste sur le même message
	}

	// les avis du direct pour cette conversation
	let minutador;
	async function avís(u, ev, p) {
		const i = messatges.findIndex((m) => m.id === p.id);
		if (ev === 'privat' && i < 0) {
			messatges.push(p);
			if (p.de === u) {
				// lu, si la page est sous les yeux (une seule demande par rafale)
				clearTimeout(minutador);
				minutador = setTimeout(() => document.visibilityState === 'visible' && marcarLegitPrivat(u), 1500);
			}
			await tick();
			enBas(p.de === grops.uid);
		} else if (ev === 'privat_suprimit' && i >= 0) messatges.splice(i, 1);
	}

	function enBas(forçar) {
		if (log && (forçar || prèpBas)) log.scrollTop = log.scrollHeight;
	}
	function defilat() {
		prèpBas = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
	}

	async function mandar(e) {
		e?.preventDefault();
		const t = tèxte.trim();
		if (!t || mandant) return;
		mandant = true;
		error = null;
		const { data: m, error: err } = await supabase
			.from('messatges_privats')
			.insert({ a: autre.user_id, tèxte: t })
			.select(CHAMPS)
			.single();
		mandant = false;
		if (err) {
			error = clauError(err);
			return;
		}
		tèxte = '';
		if (!messatges.some((y) => y.id === m.id)) messatges.push(m);
		await tick();
		enBas(true);
		camp?.focus();
	}
	// Entrada envoie, Maj + Entrada va à la ligne
	function tecla(e) {
		if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) mandar(e);
	}

	async function suprimir(m) {
		if (!confirm(x.suprimir_conf)) return;
		const { data: d, error: err } = await supabase.from('messatges_privats').delete().eq('id', m.id).select('id');
		// un message signalé reste (preuve gardée) : la base ne l'efface pas
		if (err || !d?.length) error = 'error';
		else messatges = messatges.filter((y) => y.id !== m.id);
	}

	async function blocarAutre() {
		if (!confirm(x.blocar_conf)) return;
		const e = await blocar(autre.user_id);
		if (e) error = e;
		else goto('/grops/perfil/' + encodeURIComponent(autre.pseudo));
	}

	// signaler : une fenêtre, un motif, des précisions facultatives
	let dialòg = $state();
	let senhalat = $state(null);
	let motiu = $state(null);
	let precisions = $state('');
	let senhalError = $state(null);
	let mercé = $state(false);
	function dobrirSenhal(m) {
		senhalat = m;
		motiu = null;
		precisions = '';
		senhalError = null;
		mercé = false;
		dialòg.showModal();
	}
	async function mandarSenhal(e) {
		e.preventDefault();
		if (!motiu) return;
		const { error: err } = await supabase
			.from('senhalaments_privats')
			.insert({ messatge_id: senhalat.id, motiu, precisions: precisions.trim() || null });
		if (err) senhalError = err.code === '23505' ? 'ja' : 'error';
		else mercé = true;
	}
</script>

<svelte:head>
	<title>{pseudo} · Lo Ligam</title>
</svelte:head>

<div class="discussion">
	<header class="cap">
		<a class="tornar" href="/grops" aria-label={x.tornar}><Icona nom="revenir" size="1.4em" /></a>
		{#if autre}
			<a class="titol" href="/grops/perfil/{encodeURIComponent(autre.pseudo)}">
				<Avatar pseudo={autre.pseudo} id={autre.user_id} size="2.4rem" />
				<span>
					<h2>{autre.pseudo}</h2>
					<span class="sosdtitol">{x.perfil}</span>
				</span>
			</a>
			{#if contacte}
				<button type="button" class="pc pc-2 accion" onclick={blocarAutre}><Icona nom="blocar" /><span>{x.blocar}</span></button>
			{/if}
		{:else}
			<h2 class="titol">{pseudo}</h2>
		{/if}
	</header>

	{#if sabut && !autre}
		<p class="pè-tampat">{x.invisible}</p>
	{:else if autre}
		<div class="log" role="log" bind:this={log} onscroll={defilat}>
			{#if cargat && !totCargat}
				<button type="button" class="pc pc-2 ancians" onclick={ancians}>{x.ancians}</button>
			{/if}
			{#if cargat && !messatges.length}<p class="vuèg">{x.vuèg}</p>{/if}
			<ol>
				{#each messatges as m, i (m.id)}
					{@const meu = m.de === ieu}
					{@const seguit = i > 0 && messatges[i - 1].de === m.de}
					<li class:meu class:seguit>
						<div class="cors">
							<div class="bulla">
								<p class="qui"><time datetime={m.created_at}>{ora(m.created_at)}</time></p>
								<p class="tèxte">{m.tèxte}</p>
							</div>
							<div class="gèstes">
								{#if meu}
									<button type="button" onclick={() => suprimir(m)}><Icona nom="escafar" />{x.suprimir}</button>
								{:else}
									<button type="button" onclick={() => dobrirSenhal(m)}><Icona nom="senhal" />{x.senhalar}</button>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</div>

		{#if !contacte}
			<p class="pè-tampat">{x.pas_contacte} <a href="/grops/perfil/{encodeURIComponent(autre.pseudo)}">{x.perfil}</a></p>
		{:else}
			<form class="compositor" onsubmit={mandar}>
				{#if error}<p class="error" role="alert">{x[error] ?? x.error}</p>{/if}
				<label class="vist" for="privat-messatge">{x.camp}</label>
				<textarea
					id="privat-messatge"
					bind:this={camp}
					bind:value={tèxte}
					rows="1"
					maxlength="1000"
					placeholder={x.camp}
					onkeydown={tecla}
				></textarea>
				<button type="submit" class="pc mandar" disabled={mandant || !tèxte.trim()}>
					<Icona nom="mandar" size="1.3em" label={x.mandar} />
				</button>
			</form>
		{/if}
	{/if}
</div>

<dialog bind:this={dialòg} class="senhal" aria-labelledby="senhal-titol">
	<form onsubmit={mandarSenhal}>
		<h3 id="senhal-titol">{x.senhal_titol}</h3>
		{#if senhalat}<blockquote>{senhalat.tèxte}</blockquote>{/if}
		{#if mercé}
			<p class="mercé" role="status">{x.mercé}</p>
			<div class="botons"><button type="button" class="pc boton" onclick={() => dialòg.close()}>{x.tampar}</button></div>
		{:else}
			<fieldset>
				<legend>{x.motiu}</legend>
				{#each Object.entries(x.motius) as [v, nom] (v)}
					<label class="causida"><input type="radio" name="motiu" value={v} bind:group={motiu} required /> {nom}</label>
				{/each}
			</fieldset>
			<label class="precisions">
				<span>{x.precisions}</span>
				<textarea bind:value={precisions} rows="3" maxlength="500"></textarea>
			</label>
			{#if senhalError}<p class="error" role="alert">{x[senhalError]}</p>{/if}
			<div class="botons">
				<button type="button" class="pc pc-2 secondari" onclick={() => dialòg.close()}>{x.anullar}</button>
				<button type="submit" class="pc boton" disabled={!motiu}>{x.senhalar}</button>
			</div>
		{/if}
	</form>
</dialog>

<style>
	.discussion {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.cap {
		display: flex;
		align-items: center;
		gap: var(--esp-12);
		padding: var(--esp-12) var(--esp-16);
		border-bottom: 1px solid var(--t-linha);
	}
	.tornar {
		display: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin-left: -0.5rem;
		border-radius: 50%;
		color: inherit;
	}
	/* la personne : son initiale et son pseudo mènent à son profil */
	.titol {
		display: flex;
		align-items: center;
		gap: var(--esp-12);
		flex: 1;
		min-width: 0;
		color: inherit;
		text-decoration: none;
	}
	.titol > span {
		display: grid;
		min-width: 0;
	}
	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.6rem;
		line-height: 1.1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.sosdtitol {
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	a.titol:hover .sosdtitol {
		text-decoration: underline;
	}
	/* actions secondaires : un contour, l'icône et son nom écrit */
	.accion,
	.secondari {
		--r: 10px;
		display: inline-flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 40px;
		padding: 0.4rem 0.9rem;
		font: 400 0.9rem var(--font-body);
	}


	/* Le fil : défile seul, les nouveaux messages en bas */
	.log {
		flex: 1;
		min-height: 0;
		padding: var(--esp-16);
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.ancians {
		--r: 10px;
		min-height: 0;
		display: block;
		margin: var(--esp-8) auto var(--esp-16);
		padding: 0.4rem 0.9rem;
		font: inherit;
		font-size: 0.85rem;
	}

	.vuèg {
		margin: var(--esp-32) 0;
		text-align: center;
		color: var(--t-tinta-2);
	}
	ol {
		display: grid;
		gap: var(--esp-12);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	/* à deux, pas besoin d'initiale : l'autre à gauche, soi à droite */
	li {
		display: grid;
		max-width: min(38rem, 88%);
	}
	li.seguit {
		margin-top: calc(-1 * var(--esp-8));
	}
	li.meu {
		justify-self: end;
	}
	.cors {
		display: grid;
		justify-items: start;
		gap: 2px;
		min-width: 0;
	}
	.meu .cors {
		justify-items: end;
	}
	.pè-tampat a {
		color: inherit;
		font-weight: 700;
	}
	.bulla {
		padding: 0.55rem 0.85rem;
		border-radius: 4px 14px 14px 14px;
		background: color-mix(in srgb, var(--t-tinta) 8%, transparent);
	}
	/* ses propres messages : une teinte d'or, à droite */
	.meu .bulla {
		border-radius: 14px 4px 14px 14px;
		background: color-mix(in srgb, var(--t-aur) 18%, transparent);
	}
	.qui {
		margin: 0 0 2px;
		font-size: 0.8rem;
		color: var(--t-tinta-2);
	}
	.tèxte {
		margin: 0;
		line-height: 1.45;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	/* supprimer, signaler : discrets, plus nets au survol et au clavier */
	.gèstes {
		display: flex;
		gap: var(--esp-4);
		opacity: 0.55;
		transition: opacity 0.2s;
	}
	li:hover .gèstes,
	.gèstes:focus-within {
		opacity: 1;
	}
	.gèstes button {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		min-height: 32px;
		padding: 0.2rem 0.5rem;
		border: 0;
		border-radius: 6px;
		background: none;
		color: var(--t-tinta-2);
		font: 400 0.8rem var(--font-body);
		cursor: pointer;
	}
	.gèstes button:hover {
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 7%, transparent);
	}

	/* La saisie */
	.compositor {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: var(--esp-8);
		padding: var(--esp-12) var(--esp-16);
		border-top: 1px solid var(--t-linha);
	}
	.compositor .error {
		grid-column: 1 / -1;
	}
	.compositor textarea {
		field-sizing: content;
		min-height: 44px;
		max-height: 10rem;
		box-sizing: border-box;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 22px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
		resize: none;
	}
	.mandar {
		--r: 14px;
		min-height: 0;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
	}

	.pè-tampat {
		margin: 0;
		padding: var(--esp-16);
		border-top: 1px solid var(--t-linha);
		color: var(--t-tinta-2);
	}
	.boton {
		--r: 10px;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0.6rem 1.3rem;
		font: 700 1rem/1 var(--font-body);
	}

	.error {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		font-weight: 700;
	}

	/* La fenêtre de signalement */
	.senhal {
		width: min(28rem, calc(100vw - 2rem));
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-top: 6px solid var(--t-aur);
		border-radius: 8px;
		background: var(--t-fons-2);
		color: var(--t-tinta);
	}
	.senhal::backdrop {
		background: rgb(0 0 0 / 0.55);
	}
	.senhal form {
		display: grid;
		gap: var(--esp-16);
	}
	.senhal h3 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
	}
	blockquote {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 3px solid var(--t-linha);
		color: var(--t-tinta-2);
		white-space: pre-line;
		overflow-wrap: anywhere;
		max-height: 6rem;
		overflow: hidden;
	}
	fieldset {
		display: grid;
		gap: var(--esp-4);
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: var(--esp-8);
		font-weight: 700;
	}
	.causida {
		display: flex;
		align-items: center;
		gap: var(--esp-8);
		min-height: 36px;
	}
	.causida input {
		accent-color: var(--t-aur);
		width: 1.1rem;
		height: 1.1rem;
	}
	.precisions {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	.precisions textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
		resize: vertical;
	}
	.botons {
		display: flex;
		justify-content: flex-end;
		gap: var(--esp-8);
	}
	.mercé {
		margin: 0;
		font-weight: 700;
		color: var(--t-aur);
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.tornar:focus-visible,
	.titol:focus-visible,
	.accion:focus-visible,
	.secondari:focus-visible,
	.ancians:focus-visible,
	.gèstes button:focus-visible,
	.pè-tampat a:focus-visible,
	.compositor textarea:focus-visible,
	.mandar:focus-visible,
	.boton:focus-visible,
	.precisions textarea:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	/* téléphone (le cadre est le conteneur « cadre » du gabarit) : la flèche
	   de retour, l'action réduite à son icône */
	@container cadre (width < 46rem) {
		.tornar {
			display: grid;
		}
		.accion span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.accion {
			padding: 0;
			width: 44px;
			justify-content: center;
		}
		li {
			max-width: 94%;
		}
	}
</style>
