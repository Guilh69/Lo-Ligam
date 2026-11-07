<script>
	// Le compte (refait le 2026-10-25, cahier §11) : une seule adresse pour
	// tout. Sans session : se connecter, créer un compte, ou recevoir un lien
	// quand on a oublié son mot de passe. Avec une session : « Mon compte »
	// (ses pages, changer de mot de passe, se déconnecter, supprimer son compte,
	// supabase-compte.sql). Textes dans la langue choisie, au style du site.
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { session, authReady, pseudoCompte, cargarPseudo } from '$lib/authStore';
	import { esAdmin } from '$lib/adminStore';
	import { lang as langStore } from '$lib/stores/lang.svelte.js';
	import { DOBÈRTS } from '$lib/grops/grops.svelte.js';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Avatar from '$lib/grops/Avatar.svelte';
	import Icona from '$lib/components/Icona.svelte';

	const X = {
		oc: {
			login: 'Se connectar',
			signup: 'Crear un compte',
			oblit: 'Mot de pas oblidat',
			frasa_signup: 'Es gratuit, e garda ta progression.',
			frasa_oblit: 'Escriu ton adreça : te mandarem un ligam per causir un mot de pas nòu.',
			email: 'Adreça de corrièl',
			mdp: 'Mot de pas',
			mdp_nòu: 'Mot de pas nòu',
			mdp_actual: 'Mot de pas actual',
			mdp_ajuda: '10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl',
			far_login: 'Se connectar',
			far_signup: 'Crear mon compte',
			far_oblit: 'Recebre un ligam',
			vers_oblit: 'Mot de pas oblidat ?',
			vers_signup: 'Pas encara de compte ?',
			vers_login: 'Ja un compte ?',
			tornar_login: 'Tornar a la connexion',
			confidencialitat: 'Çò que fasèm de tas donadas',
			mandat_signup: 'Te mandèrem un corrièl : clica sul ligam per confirmar ton adreça, puèi tornaràs aicí.',
			mandat_oblit: 'Se aquesta adreça a un compte, te mandèrem un ligam. Agacha tanben dins los indesirables.',
			// connecté
			compte: 'Mon compte',
			pseudonim: 'Causís ton pseudonim per acabar ton compte.',
			acabar: 'Acabar mon compte',
			mas_paginas: 'Mas paginas',
			moduls: 'Mos moduls',
			perfil: 'Mon perfil d’Amassa',
			cambiar_mdp: 'Cambiar de mot de pas',
			cambiar: 'Cambiar',
			mdp_cambiat: 'Mot de pas cambiat.',
			desconnectar: 'Se desconnectar',
			suprimir_titol: 'Suprimir mon compte',
			suprimir_frasa: 'Tot s’escafa : ton perfil, ta progression, tos messatges e tos contactes. Se pòt pas desfar.',
			suprimir: 'Suprimir mon compte',
			suprimir_segur: 'Segur ? Tot serà escafat sul pic.',
			òc_suprimir: 'Òc, suprimir',
			non: 'Non',
			// erreurs
			camps: 'Cal una adreça e un mot de pas.',
			cort: 'Lo mot de pas deu aver 10 caractèrs al mens, amb minuscula, majuscula, chifra e simbòl.',
			mdp_marrit: 'Lo mot de pas actual es pas bon.',
			ja: 'Aquesta adreça a ja un compte : connecta-te.',
			incorrècte: 'Adreça o mot de pas incorrècte.',
			pas_confirmat: 'Confirma d’en primièr ton adreça : lo ligam es dins ton corrièl.',
			tròp: 'Tròp d’ensages : espèra un pauc abans de tornar ensajar.',
			parièr: 'Lo mot de pas nòu deu èsser diferent de l’ancian.',
			compte_admin: 'Un compte d’administracion se suprimís pas d’aicí.',
			error: 'Una error : torna ensajar.'
		},
		fr: {
			login: 'Se connecter',
			signup: 'Créer un compte',
			oblit: 'Mot de passe oublié',
			frasa_signup: 'C’est gratuit, et ça garde ta progression.',
			frasa_oblit: 'Écris ton adresse : nous t’enverrons un lien pour choisir un nouveau mot de passe.',
			email: 'Adresse e-mail',
			mdp: 'Mot de passe',
			mdp_nòu: 'Nouveau mot de passe',
			mdp_actual: 'Mot de passe actuel',
			mdp_ajuda: '10 caractères au moins, avec minuscule, majuscule, chiffre et symbole',
			far_login: 'Se connecter',
			far_signup: 'Créer mon compte',
			far_oblit: 'Recevoir un lien',
			vers_oblit: 'Mot de passe oublié ?',
			vers_signup: 'Pas encore de compte ?',
			vers_login: 'Déjà un compte ?',
			tornar_login: 'Retour à la connexion',
			confidencialitat: 'Ce que nous faisons de tes données',
			mandat_signup: 'Nous t’avons envoyé un e-mail : clique sur le lien pour confirmer ton adresse, puis tu reviendras ici.',
			mandat_oblit: 'Si cette adresse a un compte, nous t’avons envoyé un lien. Regarde aussi dans les indésirables.',
			compte: 'Mon compte',
			pseudonim: 'Choisis ton pseudo pour terminer ton compte.',
			acabar: 'Terminer mon compte',
			mas_paginas: 'Mes pages',
			moduls: 'Mes modules',
			perfil: 'Mon profil d’Amassa',
			cambiar_mdp: 'Changer de mot de passe',
			cambiar: 'Changer',
			mdp_cambiat: 'Mot de passe changé.',
			desconnectar: 'Se déconnecter',
			suprimir_titol: 'Supprimer mon compte',
			suprimir_frasa: 'Tout s’efface : ton profil, ta progression, tes messages et tes contacts. C’est définitif.',
			suprimir: 'Supprimer mon compte',
			suprimir_segur: 'Sûr ? Tout sera effacé tout de suite.',
			òc_suprimir: 'Oui, supprimer',
			non: 'Non',
			camps: 'Il faut une adresse et un mot de passe.',
			cort: 'Le mot de passe doit avoir 10 caractères au moins, avec minuscule, majuscule, chiffre et symbole.',
			mdp_marrit: 'Le mot de passe actuel est incorrect.',
			ja: 'Cette adresse a déjà un compte : connecte-toi.',
			incorrècte: 'Adresse ou mot de passe incorrect.',
			pas_confirmat: 'Confirme d’abord ton adresse : le lien est dans ton e-mail.',
			tròp: 'Trop d’essais : attends un peu avant de réessayer.',
			parièr: 'Le nouveau mot de passe doit être différent de l’ancien.',
			compte_admin: 'Un compte d’administration ne se supprime pas d’ici.',
			error: 'Une erreur : réessaie.'
		},
		es: {
			login: 'Iniciar sesión',
			signup: 'Crear una cuenta',
			oblit: 'Contraseña olvidada',
			frasa_signup: 'Es gratis y guarda tu progreso.',
			frasa_oblit: 'Escribe tu dirección: te enviaremos un enlace para elegir una contraseña nueva.',
			email: 'Dirección de correo electrónico',
			mdp: 'Contraseña',
			mdp_nòu: 'Contraseña nueva',
			mdp_actual: 'Contraseña actual',
			mdp_ajuda: 'Mínimo 10 caracteres, con minúscula, mayúscula, número y símbolo',
			far_login: 'Iniciar sesión',
			far_signup: 'Crear mi cuenta',
			far_oblit: 'Recibir un enlace',
			vers_oblit: '¿Has olvidado tu contraseña?',
			vers_signup: '¿Aún no tienes cuenta?',
			vers_login: '¿Ya tienes cuenta?',
			tornar_login: 'Volver al inicio de sesión',
			confidencialitat: 'Lo que hacemos con tus datos',
			mandat_signup: 'Te hemos enviado un correo: haz clic en el enlace para confirmar tu dirección y después volverás aquí.',
			mandat_oblit: 'Si esta dirección tiene una cuenta, te hemos enviado un enlace. Mira también en el correo no deseado.',
			compte: 'Mi cuenta',
			pseudonim: 'Elige tu seudónimo para terminar tu cuenta.',
			acabar: 'Terminar mi cuenta',
			mas_paginas: 'Mis páginas',
			moduls: 'Mis módulos',
			perfil: 'Mi perfil en Reúne',
			cambiar_mdp: 'Cambiar la contraseña',
			cambiar: 'Cambiar',
			mdp_cambiat: 'Contraseña cambiada.',
			desconnectar: 'Cerrar sesión',
			suprimir_titol: 'Eliminar mi cuenta',
			suprimir_frasa: 'Todo se borra: tu perfil, tu progreso, tus mensajes y tus contactos. No se puede deshacer.',
			suprimir: 'Eliminar mi cuenta',
			suprimir_segur: '¿Seguro? Todo se borrará de inmediato.',
			òc_suprimir: 'Sí, eliminar',
			non: 'No',
			camps: 'Hacen falta una dirección y una contraseña.',
			cort: 'La contraseña debe tener 10 caracteres como mínimo, con minúscula, mayúscula, número y símbolo.',
			mdp_marrit: 'La contraseña actual es incorrecta.',
			ja: 'Esta dirección ya tiene una cuenta: inicia sesión.',
			incorrècte: 'Dirección o contraseña incorrecta.',
			pas_confirmat: 'Confirma primero tu dirección: el enlace está en tu correo.',
			tròp: 'Demasiados intentos: espera un poco antes de volver a intentarlo.',
			parièr: 'La contraseña nueva debe ser distinta de la anterior.',
			compte_admin: 'Una cuenta de administración no se elimina desde aquí.',
			error: 'Ha habido un error: inténtalo de nuevo.'
		},
		en: {
			login: 'Log in',
			signup: 'Create an account',
			oblit: 'Forgotten password',
			frasa_signup: 'It’s free, and it keeps your progress.',
			frasa_oblit: 'Enter your email address: we’ll send you a link to choose a new password.',
			email: 'Email address',
			mdp: 'Password',
			mdp_nòu: 'New password',
			mdp_actual: 'Current password',
			mdp_ajuda: 'At least 10 characters, with a lower-case letter, an upper-case letter, a number and a symbol',
			far_login: 'Log in',
			far_signup: 'Create my account',
			far_oblit: 'Get a link',
			vers_oblit: 'Forgotten your password?',
			vers_signup: 'No account yet?',
			vers_login: 'Already have an account?',
			tornar_login: 'Back to log in',
			confidencialitat: 'What we do with your data',
			mandat_signup: 'We’ve sent you an email: click the link to confirm your address, then you’ll come back here.',
			mandat_oblit: 'If this address has an account, we’ve sent you a link. Check your spam folder too.',
			compte: 'My account',
			pseudonim: 'Choose your nickname to complete your account.',
			acabar: 'Complete my account',
			mas_paginas: 'My pages',
			moduls: 'My modules',
			perfil: 'My Gather profile',
			cambiar_mdp: 'Change password',
			cambiar: 'Change',
			mdp_cambiat: 'Password changed.',
			desconnectar: 'Log out',
			suprimir_titol: 'Delete my account',
			suprimir_frasa: 'Everything is erased: your profile, your progress, your messages and your contacts. This cannot be undone.',
			suprimir: 'Delete my account',
			suprimir_segur: 'Are you sure? Everything will be erased straight away.',
			òc_suprimir: 'Yes, delete',
			non: 'No',
			camps: 'An email address and a password are required.',
			cort: 'The password must be at least 10 characters long, with a lower-case letter, an upper-case letter, a number and a symbol.',
			mdp_marrit: 'The current password is incorrect.',
			ja: 'This address already has an account: log in.',
			incorrècte: 'Incorrect email address or password.',
			pas_confirmat: 'Please confirm your address first: the link is in your email.',
			tròp: 'Too many attempts: wait a little before trying again.',
			parièr: 'The new password must be different from the old one.',
			compte_admin: 'An administrator account cannot be deleted from here.',
			error: 'Something went wrong: please try again.'
		},
		ca: {
			login: 'Inicia la sessió',
			signup: 'Crea un compte',
			oblit: 'Contrasenya oblidada',
			frasa_signup: 'És gratuït i guarda el teu progrés.',
			frasa_oblit: 'Escriu la teva adreça: t’enviarem un enllaç per triar una contrasenya nova.',
			email: 'Adreça electrònica',
			mdp: 'Contrasenya',
			mdp_nòu: 'Contrasenya nova',
			mdp_actual: 'Contrasenya actual',
			mdp_ajuda: 'Mínim 10 caràcters, amb minúscula, majúscula, xifra i símbol',
			far_login: 'Inicia la sessió',
			far_signup: 'Crea el meu compte',
			far_oblit: 'Rep un enllaç',
			vers_oblit: 'Has oblidat la contrasenya?',
			vers_signup: 'Encara no tens compte?',
			vers_login: 'Ja tens compte?',
			tornar_login: 'Torna a l’inici de sessió',
			confidencialitat: 'El que fem amb les teves dades',
			mandat_signup: 'T’hem enviat un correu: fes clic a l’enllaç per confirmar la teva adreça i després tornaràs aquí.',
			mandat_oblit: 'Si aquesta adreça té un compte, t’hem enviat un enllaç. Mira també a la carpeta de correu brossa.',
			compte: 'El meu compte',
			pseudonim: 'Tria el teu pseudònim per acabar el teu compte.',
			acabar: 'Acaba el meu compte',
			mas_paginas: 'Les meves pàgines',
			moduls: 'Els meus mòduls',
			perfil: 'El meu perfil a Reuneix',
			cambiar_mdp: 'Canviar la contrasenya',
			cambiar: 'Canvia',
			mdp_cambiat: 'Contrasenya canviada.',
			desconnectar: 'Tanca la sessió',
			suprimir_titol: 'Suprimir el meu compte',
			suprimir_frasa: 'Tot s’esborra: el teu perfil, el teu progrés, els teus missatges i els teus contactes. No es pot desfer.',
			suprimir: 'Suprimeix el meu compte',
			suprimir_segur: 'Segur? Tot s’esborrarà a l’instant.',
			òc_suprimir: 'Sí, suprimeix',
			non: 'No',
			camps: 'Cal una adreça i una contrasenya.',
			cort: 'La contrasenya ha de tenir 10 caràcters com a mínim, amb minúscula, majúscula, xifra i símbol.',
			mdp_marrit: 'La contrasenya actual no és correcta.',
			ja: 'Aquesta adreça ja té un compte: inicia la sessió.',
			incorrècte: 'Adreça o contrasenya incorrecta.',
			pas_confirmat: 'Confirma primer la teva adreça: l’enllaç és al teu correu.',
			tròp: 'Massa intents: espera una mica abans de tornar-ho a provar.',
			parièr: 'La contrasenya nova ha de ser diferent de l’anterior.',
			compte_admin: 'Un compte d’administració no se suprimeix des d’aquí.',
			error: 'Hi ha hagut un error: torna-ho a provar.'
		},
		ar: {
			login: 'تسجيل الدخول',
			signup: 'إنشاء حساب',
			oblit: 'استعادة كلمة المرور',
			frasa_signup: 'الحساب مجاني، ويحفظ تقدّمك.',
			frasa_oblit: 'أدخل بريدك الإلكتروني، وسنرسل إليك رابطًا لاختيار كلمة مرور جديدة.',
			email: 'البريد الإلكتروني',
			mdp: 'كلمة المرور',
			mdp_nòu: 'كلمة المرور الجديدة',
			mdp_actual: 'كلمة المرور الحالية',
			mdp_ajuda: '10 أحرف على الأقل، منها حرف لاتيني صغير وحرف لاتيني كبير ورقم ورمز',
			far_login: 'تسجيل الدخول',
			far_signup: 'إنشاء حسابي',
			far_oblit: 'إرسال الرابط',
			vers_oblit: 'نسيت كلمة المرور؟',
			vers_signup: 'ليس لديك حساب بعد؟',
			vers_login: 'لديك حساب بالفعل؟',
			tornar_login: 'العودة إلى تسجيل الدخول',
			confidencialitat: 'كيف نتعامل مع بياناتك',
			mandat_signup: 'أرسلنا إليك رسالة إلكترونية. انقر على الرابط لتأكيد بريدك، ثم ارجع إلى هنا.',
			mandat_oblit: 'إن كان لهذا البريد حساب، فقد أرسلنا إليه رابطًا. تحقّق أيضًا من مجلد الرسائل غير المرغوب فيها.',
			compte: 'حسابي',
			pseudonim: 'اختر اسمك المستعار لإكمال حسابك.',
			acabar: 'إكمال حسابي',
			mas_paginas: 'صفحاتي',
			moduls: 'وحداتي',
			perfil: 'ملفّي الشخصي في «نجتمع»',
			cambiar_mdp: 'تغيير كلمة المرور',
			cambiar: 'تغيير',
			mdp_cambiat: 'تم تغيير كلمة المرور.',
			desconnectar: 'تسجيل الخروج',
			suprimir_titol: 'حذف حسابي',
			suprimir_frasa: 'سيُمحى كل شيء: ملفّك الشخصي وتقدّمك ورسائلك وجهات اتصالك. ولا يمكن التراجع عن ذلك.',
			suprimir: 'حذف حسابي',
			suprimir_segur: 'هل تؤكّد الحذف؟ سيُمحى كل شيء فورًا.',
			òc_suprimir: 'نعم، أحذف حسابي',
			non: 'لا',
			camps: 'لا بدّ من إدخال البريد الإلكتروني وكلمة المرور.',
			cort: 'يجب أن تتألف كلمة المرور من 10 أحرف على الأقل، منها حرف لاتيني صغير وحرف لاتيني كبير ورقم ورمز.',
			mdp_marrit: 'كلمة المرور الحالية غير صحيحة.',
			ja: 'لهذا البريد حساب بالفعل، ويمكنك تسجيل الدخول.',
			incorrècte: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
			pas_confirmat: 'يلزم أولًا تأكيد البريد الإلكتروني: الرابط في رسالتنا إليك.',
			tròp: 'محاولات كثيرة جدًا. يُرجى الانتظار قليلًا ثم المحاولة من جديد.',
			parièr: 'يجب أن تختلف كلمة المرور الجديدة عن القديمة.',
			compte_admin: 'لا يمكن حذف حساب الإدارة من هنا.',
			error: 'حدث خطأ، يُرجى المحاولة مرة أخرى.'
		}
	};
	let x = $derived(X[langStore.current] ?? X.oc);

	// en développement, « ?simular » montre « Mon compte » sans session
	const simular = browser && import.meta.env.DEV && page.url.searchParams.has('simular');
	let sesilha = $derived($session ?? (simular ? { user: { id: 's1', email: 'joana@exemple.org' } } : null));
	let pseudo = $derived($session ? $pseudoCompte : simular ? 'Joana' : undefined);

	const MODES = ['login', 'signup', 'oblit'];
	let mode = $state(MODES.includes(page.url.searchParams.get('mode')) ? page.url.searchParams.get('mode') : 'login');
	let email = $state('');
	let mdp = $state('');
	let ocupat = $state(false);
	let error = $state(null);
	let mandat = $state(null); // 'signup' ou 'oblit' : le courriel est parti

	function cambiarMode(m) {
		mode = m;
		error = null;
		mandat = null;
	}

	// les messages de Supabase, ramenés à nos clés
	function clau(e) {
		const m = e?.message ?? '';
		if (/already registered|already exists/i.test(m)) return 'ja';
		if (/invalid login credentials/i.test(m)) return 'incorrècte';
		if (/not confirmed/i.test(m)) return 'pas_confirmat';
		if (/rate limit|security purposes|too many/i.test(m)) return 'tròp';
		if (/should be different/i.test(m)) return 'parièr';
		if (/password/i.test(m) && /least|short|weak/i.test(m)) return 'cort';
		if (/current password|reauthentication|not match/i.test(m)) return 'mdp_marrit';
		if (m === 'compte_admin') return 'compte_admin';
		return 'error';
	}

	// après la connexion : la page d'où l'on venait (chemin interne seulement),
	// sinon on reste ici, sur « Mon compte »
	function tornar() {
		const t = page.url.searchParams.get('tornar');
		if (!t || !t.startsWith('/') || t.startsWith('//') || t.includes('\\') || t.startsWith('/compte')) return;
		try {
			if (new URL(t, location.origin).origin === location.origin) goto(t);
		} catch {
			/* adresse invalide : on ignore */
		}
	}

	async function mandar(e) {
		e.preventDefault();
		error = null;
		mandat = null;
		if (!email.trim() || (mode !== 'oblit' && !mdp)) return (error = 'camps');
		if (mode === 'signup' && mdp.length < 10) return (error = 'cort');
		ocupat = true;
		if (mode === 'login') {
			const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: mdp });
			if (err) error = clau(err);
			else tornar();
		} else if (mode === 'signup') {
			const { data, error: err } = await supabase.auth.signUp({
				email: email.trim(),
				password: mdp,
				options: { emailRedirectTo: location.origin + '/compte' }
			});
			if (err) error = clau(err);
			else if (!data.session) mandat = 'signup';
			else tornar();
		} else {
			const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
				redirectTo: location.origin + '/compte/mot-de-pas'
			});
			if (err) error = clau(err);
			else mandat = 'oblit';
		}
		ocupat = false;
	}

	// ── connecté ──
	// le pseudo a pu être choisi entre-temps (questionnaire, profil d'Amassa)
	$effect(() => {
		if ($session) cargarPseudo($session);
	});
	let mdpActual = $state('');
	let mdpNòu = $state('');
	let mdpMessatge = $state(null); // 'mdp_cambiat' ou une clé d'erreur
	async function cambiarMdp(e) {
		e.preventDefault();
		mdpMessatge = null;
		if (mdpNòu.length < 10) return (mdpMessatge = 'cort');
		ocupat = true;
		// l'ancien mot de passe est envoyé et vérifié par le serveur (réglage
		// « Require current password when updating ») : une session volée ne peut
		// pas changer le mot de passe sans le connaître.
		const { error: err } = await supabase.auth.updateUser({
			password: mdpNòu,
			current_password: mdpActual
		});
		// après un changement réussi, on déconnecte les autres appareils
		if (!err) await supabase.auth.signOut({ scope: 'others' });
		ocupat = false;
		mdpMessatge = err ? clau(err) : 'mdp_cambiat';
		if (!err) {
			mdpActual = '';
			mdpNòu = '';
		}
	}

	async function desconnectar() {
		await supabase.auth.signOut();
		goto('/');
	}

	let suprimirSegur = $state(false);
	let suprimirMdp = $state('');
	let suprimirError = $state(null);
	async function suprimir() {
		ocupat = true;
		suprimirError = null;
		// acte irréversible : on redemande le mot de passe avant d'effacer
		const { error: errAuth } = await supabase.auth.signInWithPassword({
			email: $session.user.email,
			password: suprimirMdp
		});
		if (errAuth) {
			suprimirError = 'incorrècte';
			ocupat = false;
			return;
		}
		const { error: err } = await supabase.rpc('suprimir_mon_compte');
		if (err) {
			suprimirError = clau(err);
			ocupat = false;
			return;
		}
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<svelte:head>
	<title>{sesilha ? x.compte : x[mode]} · Lo Ligam</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="pagina">
	<div class="capçal"><AppHeader /></div>

	<main class="compte">
		{#if !$authReady}
			<p class="nota">…</p>
		{:else if !sesilha}
			<h1>{x[mode]}</h1>
			{#if mode === 'signup'}<p class="frasa">{x.frasa_signup}</p>{/if}
			{#if mode === 'oblit'}<p class="frasa">{x.frasa_oblit}</p>{/if}

			{#if mandat}
				<p class="mandat" role="status"><Icona nom="valide" size="1.2em" /> {x['mandat_' + mandat]}</p>
				<button type="button" class="ligam" onclick={() => cambiarMode('login')}>{x.tornar_login}</button>
			{:else}
				<form class="boita" onsubmit={mandar}>
					<label class="camp">
						<span>{x.email}</span>
						<input type="email" bind:value={email} autocomplete="email" required />
					</label>
					{#if mode !== 'oblit'}
						<label class="camp">
							<span>{x.mdp}</span>
							<input
								type="password"
								bind:value={mdp}
								autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
								minlength={mode === 'signup' ? 8 : undefined}
								aria-describedby={mode === 'signup' ? 'mdp-ajuda' : undefined}
								required
							/>
							{#if mode === 'signup'}<small id="mdp-ajuda">{x.mdp_ajuda}</small>{/if}
						</label>
					{/if}
					{#if error}<p class="error" role="alert">{x[error]}</p>{/if}
					<button type="submit" class="pc boton" disabled={ocupat}>{ocupat ? '…' : x['far_' + mode]}</button>
					{#if mode === 'login'}
						<button type="button" class="ligam" onclick={() => cambiarMode('oblit')}>{x.vers_oblit}</button>
					{/if}
				</form>

				<p class="autre">
					{#if mode === 'login'}
						{x.vers_signup} <button type="button" class="ligam fòrt" onclick={() => cambiarMode('signup')}>{x.signup}</button>
					{:else if mode === 'signup'}
						{x.vers_login} <button type="button" class="ligam fòrt" onclick={() => cambiarMode('login')}>{x.login}</button>
					{:else}
						<button type="button" class="ligam fòrt" onclick={() => cambiarMode('login')}>{x.tornar_login}</button>
					{/if}
				</p>
				{#if mode === 'signup'}<p class="autre"><a href="/confidencialitat">{x.confidencialitat}</a></p>{/if}
			{/if}
		{:else}
			<header class="qui">
				<Avatar pseudo={pseudo ?? sesilha.user.email ?? '?'} id={sesilha.user.id} size="3.5rem" />
				<div>
					<h1>{pseudo ?? x.compte}</h1>
					<p class="adreca">{sesilha.user.email}</p>
				</div>
			</header>

			{#if pseudo === null}
				<div class="boita acabar">
					<p>{x.pseudonim}</p>
					<a class="pc boton" href="/compte/questionnaire">{x.acabar}</a>
				</div>
			{/if}

			<section class="seccion" aria-labelledby="compte-paginas">
				<h2 id="compte-paginas">{x.mas_paginas}</h2>
				<ul class="paginas">
					<li><a href="/aprene"><span>{x.moduls}</span><Icona nom="suivant" /></a></li>
					{#if DOBÈRTS || $esAdmin}
						<li><a href="/grops/perfil"><span>{x.perfil}</span><Icona nom="suivant" /></a></li>
					{/if}
				</ul>
			</section>

			<section class="seccion" aria-labelledby="compte-mdp">
				<h2 id="compte-mdp">{x.cambiar_mdp}</h2>
				<form class="boita" onsubmit={cambiarMdp}>
					<!-- l'adresse, cachée, aide les gestionnaires de mots de passe -->
					<input type="email" class="vist" value={sesilha.user.email} autocomplete="username" readonly tabindex="-1" aria-hidden="true" />
					<label class="camp">
						<span>{x.mdp_actual}</span>
						<input type="password" bind:value={mdpActual} autocomplete="current-password" required />
					</label>
					<label class="camp">
						<span>{x.mdp_nòu}</span>
						<input type="password" bind:value={mdpNòu} autocomplete="new-password" minlength="10" aria-describedby="mdp-nòu-ajuda" required />
						<small id="mdp-nòu-ajuda">{x.mdp_ajuda}</small>
					</label>
					<button type="submit" class="pc pc-2 boton segond" disabled={ocupat}>{x.cambiar}</button>
				</form>
				{#if mdpMessatge}
					<p class={mdpMessatge === 'mdp_cambiat' ? 'mandat' : 'error'} role="status">{x[mdpMessatge]}</p>
				{/if}
			</section>

			<section class="seccion">
				<button type="button" class="pc pc-2 boton segond" onclick={desconnectar}>{x.desconnectar}</button>
			</section>

			<section class="seccion perilh" aria-labelledby="compte-suprimir">
				<h2 id="compte-suprimir">{x.suprimir_titol}</h2>
				<p>{x.suprimir_frasa}</p>
				{#if suprimirSegur}
					<p class="segur" role="alert">{x.suprimir_segur}</p>
					<form class="boita" onsubmit={(e) => { e.preventDefault(); suprimir(); }}>
						<input type="email" class="vist" value={sesilha.user.email} autocomplete="username" readonly tabindex="-1" aria-hidden="true" />
						<label class="camp">
							<span>{x.mdp}</span>
							<input type="password" bind:value={suprimirMdp} autocomplete="current-password" required />
						</label>
						<div class="botons">
							<button type="submit" class="pc boton" disabled={ocupat}>{x.òc_suprimir}</button>
							<button type="button" class="pc pc-2 boton segond" onclick={() => (suprimirSegur = false)}>{x.non}</button>
						</div>
					</form>
				{:else}
					<button type="button" class="ligam" onclick={() => (suprimirSegur = true)}>{x.suprimir}</button>
				{/if}
				{#if suprimirError}<p class="error" role="alert">{x[suprimirError]}</p>{/if}
			</section>
		{/if}
	</main>
</div>

<style>
	.pagina {
		--marge: clamp(1rem, 4vw, 3.4rem);
		min-height: 100vh;
		color: var(--t-tinta);
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			radial-gradient(ellipse 50% 40% at 100% 0%, var(--t-braise-or), transparent 70%),
			var(--t-fons);
		overflow-x: clip;
	}
	.capçal {
		padding: 1.3rem var(--marge);
	}
	.capçal :global(.top) {
		max-width: none;
	}
	.compte {
		container-type: inline-size;
		display: grid;
		gap: var(--esp-24);
		max-width: calc(30rem + 2 * var(--marge));
		margin: 0 auto;
		padding: clamp(2rem, 6vh, 4.5rem) var(--marge) var(--esp-96);
	}
	h1 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(2.4rem, 7vw, 3.6rem);
		line-height: 1;
		overflow-wrap: anywhere;
	}
	.frasa {
		margin: calc(-1 * var(--esp-8)) 0 0;
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	.nota {
		margin: 0;
		color: var(--t-tinta-2);
	}

	/* Le formulaire : un panneau translucide, les champs en colonne */
	.boita {
		display: grid;
		gap: var(--esp-16);
		padding: var(--esp-24);
		border: 1px solid var(--t-linha);
		border-radius: 8px;
		background: color-mix(in srgb, var(--t-fons-2) 82%, transparent);
	}
	.camp {
		display: grid;
		gap: var(--esp-8);
		font-weight: 700;
	}
	.camp small {
		font-weight: 400;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	input {
		box-sizing: border-box;
		width: 100%;
		min-height: 44px;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		background: var(--t-fons);
		color: var(--t-tinta);
		font: 400 1rem/1.4 var(--font-body);
	}
	/* ce qui se clique : le rouge du logo en aplat (règle B) */
	.boton {
		--r: 10px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		justify-self: start;
		min-height: 44px;
		padding: 0.6rem 1.4rem;
		font: 700 1rem/1 var(--font-body);
	}

	/* les liens secondaires : soulignés, en retrait */
	.ligam {
		justify-self: start;
		min-height: 44px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--t-tinta-2);
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.ligam:hover {
		color: var(--t-tinta);
	}
	.ligam.fòrt {
		min-height: 0;
		color: var(--t-tinta);
		font-weight: 700;
		text-decoration-color: var(--t-accion);
		text-decoration-thickness: 2px;
	}
	.autre {
		margin: 0;
		color: var(--t-tinta-2);
	}
	.autre a {
		color: var(--t-tinta-2);
	}
	.error,
	.mandat,
	.segur {
		margin: 0;
		padding-left: var(--esp-12);
		border-left: 4px solid var(--t-aur);
		line-height: 1.5;
		font-weight: 700;
	}
	.mandat {
		display: flex;
		gap: var(--esp-8);
		align-items: baseline;
	}

	/* Connecté : l'initiale, le pseudo, l'adresse */
	.qui {
		display: flex;
		align-items: center;
		gap: var(--esp-16);
	}
	.adreca {
		margin: var(--esp-4) 0 0;
		color: var(--t-tinta-2);
		overflow-wrap: anywhere;
	}
	.acabar p {
		margin: 0;
		line-height: 1.5;
	}
	.seccion {
		display: grid;
		gap: var(--esp-12);
		padding-top: var(--esp-24);
		border-top: 1px solid var(--t-linha);
	}
	.seccion p {
		margin: 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}
	h2 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-aur);
	}
	.paginas {
		display: grid;
		gap: var(--esp-8);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.paginas a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 48px;
		padding: 0.5rem 1rem;
		border: 1px solid var(--t-linha);
		border-radius: 6px;
		color: inherit;
		font-weight: 700;
		text-decoration: none;
	}
	.paginas a:hover {
		border-color: var(--t-aur);
	}
	.linha {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: start;
		gap: var(--esp-12);
	}
	.linha .boton {
		margin-top: calc(1.4em + var(--esp-8));
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--esp-8);
	}
	.vist {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	input:focus-visible,
	.boton:focus-visible,
	.ligam:focus-visible,
	.paginas a:focus-visible,
	.autre a:focus-visible {
		outline: 3px solid var(--t-aur);
		outline-offset: 2px;
	}

	@container (width < 26rem) {
		.linha {
			grid-template-columns: 1fr;
		}
		.linha .boton {
			margin-top: 0;
		}
	}
</style>
