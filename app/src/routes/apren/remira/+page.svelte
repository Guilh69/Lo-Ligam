<script>
	// Pluie de mots (idée de Romain, 2026-11-04) : une page de calme et de
	// concentration. Des mots occitans tombent lentement, très espacés, devant
	// une image ; la définition de chacun s'écrit en petit, en italique. Tourner
	// la molette (ordinateur) ou bouger le téléphone fait forcir la pluie : les
	// mots tombent plus vite, s'agitent un peu, le son monte ; puis tout se
	// calme seul. Essai à /ensag/plueja du 04-11 au 05-11, puis rubrique de
	// S'apren sous le nom « Remira » (contemple ; Romain, 2026-11-05 : « Je
	// crois que je préfère Remira ») ; l'ancienne adresse y renvoie.
	//
	// Sobriété : le fond par défaut est un ciel de nuit en pur CSS (zéro octet,
	// Romain, 05-11 : « des fonds calmes, parce que les photos, je trouve que ça
	// crée du bruit ») ; les photos (45 à 135 ko, adoucies dans le fichier) ne
	// se chargent que si on les demande ; le son est fabriqué dans le navigateur
	// (aucun fichier audio) et ne démarre que si on le demande.
	import { onMount } from 'svelte';
	import { tria, lang as langStore, LENGAS, SEGONDAS } from '$lib/stores/lang.svelte.js';
	import Icona from '$lib/components/Icona.svelte';
	import { SCENAS, GROPS, QUASERNET, motsDelQuasernet } from '$lib/plueja/scenas.js';
	import { crearSonPlueja } from '$lib/plueja/sonPlueja.js';
	import Polsa from '$lib/plueja/Polsa.svelte';
	import Paisatges from '$lib/paisatges/Paisatges.svelte';
	import { TEMAS, deTema } from '$lib/paisatges/paisatges.js';
	import { GARDATS } from '$lib/paisatges/releu.js';
	import { dev } from '$app/environment';
	import { carnet, demarrerCarnet } from '$lib/carnet/carnet.svelte.js';
	import { aRevoir } from '$lib/carnet/regles.js';

	const T = {
		titol: { oc: 'Remira', fr: 'Remira' }, // impératif de remirar, contempler (vèrb'Òc, 05-11) ; un nom se lit comme il se dit, dans toutes les langues
		tornar: { oc: 'Tornar a S’apren', fr: 'Revenir à S’apprend', es: 'Volver a S’apren', en: 'Back to S’apren', ca: 'Tornar a S’apren', ar: 'العودة إلى S’apren' }, // Remira est une rubrique de S'apren (comme les jeux)
		lenga: { oc: 'Lenga', fr: 'Langue', es: 'Idioma', en: 'Language', ca: 'Llengua', ar: 'اللغة' },
		lengas: { oc: 'Autras lengas', fr: 'Autres langues', es: 'Otros idiomas', en: 'Other languages', ca: 'Altres llengües', ar: 'لغات أخرى' }, // comme le globe du bandeau
		ajuda: { oc: 'Cossí far ?', fr: 'Comment faire ?', es: '¿Cómo se hace?', en: 'How does it work?', ca: 'Com es fa?', ar: 'كيف يعمل هذا؟' }, // revoir l'explication
		ambianca: { oc: 'Ambient', fr: 'Ambiance', es: 'Ambiente', en: 'Mood', ca: 'Ambient', ar: 'الجو' }, // lo Congrès : ambiance → ambient (04-11)
		movement: { oc: 'Movement', fr: 'Mouvement', es: 'Movimiento', en: 'Motion', ca: 'Moviment', ar: 'الحركة' }, // lo Congrès : mouvement → movement (05-11)
		plueja: { oc: 'Pluèja', fr: 'Pluie', es: 'Lluvia', en: 'Rain', ca: 'Pluja', ar: 'المطر' },
		polsa: { oc: 'Polsa d’aur', fr: 'Poussière d’or', es: 'Polvo de oro', en: 'Gold dust', ca: 'Pols d’or', ar: 'غبار الذهب' }, // lo Congrès : poussière → polsa (languedocien)
		polsaDesc: { oc: 'Los mots se dessenhan un per un.', fr: 'Les mots se dessinent un par un.', es: 'Las palabras se dibujan una a una.', en: 'Words draw themselves one by one.', ca: 'Les paraules es dibuixen una a una.', ar: 'ترتسم الكلمات واحدة تلو الأخرى.' },
		// Paysages (Romain, 05-11 : « le défilé de paysages ») ; es/en/ca/ar à relire par Aran
		paisatges: { oc: 'Paisatges', fr: 'Paysages', es: 'Paisajes', en: 'Landscapes', ca: 'Paisatges', ar: 'مناظر طبيعية' }, // lo Congrès : paysage → paisatge (05-11)
		paisatgesDesc: { oc: 'Un paisatge, de mots a tocar.', fr: 'Un paysage, des mots à toucher.', es: 'Un paisaje, palabras para tocar.', en: 'A landscape, words to touch.', ca: 'Un paisatge, paraules per tocar.', ar: 'منظر طبيعي وكلمات تلمسها.' },
		ponchTactil: { oc: 'Tòca un ponch d’aur', fr: 'Touche un point d’or', es: 'Toca un punto dorado', en: 'Touch a gold dot', ca: 'Toca un punt daurat', ar: 'المس نقطة ذهبية' }, // ponch, aur : lo Congrès (05-11)
		ponch: { oc: 'Clica un ponch d’aur', fr: 'Clique sur un point d’or', es: 'Haz clic en un punto dorado', en: 'Click a gold dot', ca: 'Fes clic en un punt daurat', ar: 'انقر على نقطة ذهبية' }, // clica : impératif de clicar (vèrb'Òc)
		precedent: { oc: 'Paisatge precedent', fr: 'Paysage précédent', es: 'Paisaje anterior', en: 'Previous landscape', ca: 'Paisatge anterior', ar: 'المنظر السابق' },
		// le thème des paysages (06-11) ; lo Congrès : thème → tèma, tot
		tema: { oc: 'Tèma', fr: 'Thème', es: 'Tema', en: 'Theme', ca: 'Tema', ar: 'الموضوع' },
		tot: { oc: 'Tot', fr: 'Tout', es: 'Todo', en: 'All', ca: 'Tot', ar: 'الكل' },
		seguent: { oc: 'Paisatge seguent', fr: 'Paysage suivant', es: 'Paisaje siguiente', en: 'Next landscape', ca: 'Paisatge següent', ar: 'المنظر التالي' },
		pluejaDesc: { oc: 'Los mots tomban doçament.', fr: 'Les mots tombent doucement.', es: 'Las palabras caen con suavidad.', en: 'Words fall gently.', ca: 'Les paraules cauen suaument.', ar: 'تتساقط الكلمات بلطف.' },
		fons: { oc: 'Fons', fr: 'Fond', es: 'Fondo', en: 'Background', ca: 'Fons', ar: 'الخلفية' },
		cel: { oc: 'Cèl', fr: 'Ciel', es: 'Cielo', en: 'Sky', ca: 'Cel', ar: 'السماء' },
		celDesc: { oc: 'Un cèl escur e doç.', fr: 'Un ciel sombre et doux.', es: 'Un cielo oscuro y suave.', en: 'A dark, soft sky.', ca: 'Un cel fosc i suau.', ar: 'سماء داكنة وهادئة.' },
		foto: { oc: 'Fòto', fr: 'Photo', es: 'Foto', en: 'Photo', ca: 'Foto', ar: 'صورة' },
		fotoDesc: { oc: 'Una fòto per ambient.', fr: 'Une photo par ambiance.', es: 'Una foto por ambiente.', en: 'One photo per mood.', ca: 'Una foto per ambient.', ar: 'صورة لكل جو.' },
		fotoCap: { oc: 'Aqueste ambient a pas de fòto.', fr: 'Cette ambiance n’a pas de photo.', es: 'Este ambiente no tiene foto.', en: 'This mood has no photo.', ca: 'Aquest ambient no té foto.', ar: 'ليس لهذا الجو صورة.' },
		// L'explication de première visite, en trois étapes formées en poussière.
		// La première reprend le texte de la case de S'apren (apren.teulas.remira.sota).
		guida1: {
			oc: 'Los mots se dessenhan en polsa d’aur, un per un, per los aprene en calma.',
			fr: 'Les mots se dessinent en poussière d’or, un par un, pour les apprendre au calme.',
			es: 'Las palabras se dibujan en polvo de oro, una a una, para aprenderlas con calma.',
			en: 'The words draw themselves in gold dust, one by one, so you can learn them calmly.',
			ca: 'Les paraules es dibuixen en pols d’or, una a una, per aprendre-les amb calma.',
			ar: 'ترتسم الكلمات بغبار الذهب واحدة تلو الأخرى، لتتعلمها بهدوء.'
		},
		guida2: { oc: 'Lo mot esclata e lo seguent se forma.', fr: 'Le mot éclate et le suivant se forme.', es: 'La palabra estalla y se forma la siguiente.', en: 'The word bursts and the next one forms.', ca: 'La paraula esclata i es forma la següent.', ar: 'تتبدد الكلمة وتتشكل التي تليها.' },
		guida2Clic: { oc: 'Lo mot esclata e lo seguent se forma. Un clic tanben.', fr: 'Le mot éclate et le suivant se forme. Un clic aussi.', es: 'La palabra estalla y se forma la siguiente. Un clic también.', en: 'The word bursts and the next one forms. So does a click.', ca: 'La paraula esclata i es forma la següent. Un clic també.', ar: 'تتبدد الكلمة وتتشكل التي تليها. والنقر يفعل ذلك أيضًا.' },
		guida3: { oc: 'Causís l’ambient', fr: 'Choisis l’ambiance', es: 'Elige el ambiente', en: 'Pick the mood', ca: 'Tria l’ambient', ar: 'اختيار الجو' }, // vèrb'Òc : causís, 2 sg. impératif
		guida3Def: { oc: 'Tas leiçons, tos mots o la poesia, en bas de l’ecran.', fr: 'Tes leçons, tes mots ou la poésie, en bas de l’écran.', es: 'Tus lecciones, tus palabras o la poesía, abajo en la pantalla.', en: 'Your lessons, your words or poetry, at the bottom of the screen.', ca: 'Les teves lliçons, les teves paraules o la poesia, a baix de la pantalla.', ar: 'دروسك أو كلماتك أو الشعر، في أسفل الشاشة.' },
		det: { oc: 'Lisa lo det', fr: 'Fais glisser ton doigt', es: 'Desliza el dedo', en: 'Slide your finger', ca: 'Llisca el dit', ar: 'مرّر إصبعك' }, // lo Congrès : glisser → lisar, doigt → det ; même tournure que l'accueil (motor.js)
		forca: { oc: 'Fòrça', fr: 'Intensité', es: 'Intensidad', en: 'Intensity', ca: 'Intensitat', ar: 'الشدة' },
		son: { oc: 'Son', fr: 'Son', es: 'Sonido', en: 'Sound', ca: 'So', ar: 'الصوت' },
		// le relief des paysages (06-11) ; lo Congrès : relief → relèu ; es/en/ca/ar à relire par Aran
		relèu: { oc: 'Relèu', fr: 'Relief', es: 'Relieve', en: 'Depth', ca: 'Relleu', ar: 'العمق' },
		pausa: { oc: 'Pausa', fr: 'Pause', es: 'Pausa', en: 'Pause', ca: 'Pausa', ar: 'إيقاف مؤقت' },
		plenEcran: { oc: 'Plen ecran', fr: 'Plein écran', es: 'Pantalla completa', en: 'Full screen', ca: 'Pantalla completa', ar: 'ملء الشاشة' },
		rodeta: { oc: 'Vira la rodeta', fr: 'Fais tourner la molette', es: 'Gira la rueda del ratón', en: 'Turn the mouse wheel', ca: 'Gira la roda del ratolí', ar: 'حرّك عجلة الفأرة' },
		telefon: { oc: 'Bolega lo telefòn', fr: 'Bouge ton téléphone', es: 'Mueve el teléfono', en: 'Move your phone', ca: 'Mou el telèfon', ar: 'حرّك هاتفك' },
		mots: { oc: 'Los mots', fr: 'Les mots', es: 'Las palabras', en: 'The words', ca: 'Les paraules', ar: 'الكلمات' },
		quasernet: { oc: 'Ton quasernet', fr: 'Ton carnet', es: 'Tu cuaderno', en: 'Your notebook', ca: 'El teu quadern', ar: 'دفترك' }, // lo Congrès : carnet → quasernet (05-11)
		quasernetVoid: { oc: 'Los mots de tas leiçons venon aquí.', fr: 'Les mots de tes leçons viennent ici.', es: 'Las palabras de tus lecciones llegan aquí.', en: 'The words from your lessons show up here.', ca: 'Les paraules de les teves lliçons arriben aquí.', ar: 'تظهر هنا كلمات دروسك.' }
	};

	// « Tos mots » : les mots de son carnet. La liste est figée au moment où on
	// choisit l'ambiance (une liste qui change relancerait la poussière d'or).
	const TOTAS = [...SCENAS, QUASERNET];
	let motsQuasernet = $state.raw([]);
	let nQuasernet = $derived(motsDelQuasernet(carnet.cartes).length);
	let scenaId = $state('garriga');
	let scena = $derived(
		scenaId === QUASERNET.id ? { ...QUASERNET, mots: motsQuasernet } : SCENAS.find((s) => s.id === scenaId)
	);
	let vistas = $state({ garriga: true }); // fonds déjà demandés (chargés à la première visite seulement)
	let fons = $state(0.2); // niveau de base choisi au curseur
	let niv = $state(0.2); // niveau affiché (base + élan du geste), mis à jour sans excès
	let pausa = $state(false);
	let sonAtiu = $state(false);
	let inactiu = $state(false);
	let indici = $state(true);
	let tactil = $state(false);
	let plenPossible = $state(false);
	let calme = $state(false); // préférence « réduire les animations »
	// Le relief des paysages, en option (Romain, 06-11) : seulement sur les photos
	// gardées dans Triar ; en local, ?releu=totas le montre sur toutes
	let relèu = $state(false);
	let relèuTotas = $state(false);
	const relèuPossible = $derived(!calme && (relèuTotas || GARDATS.size > 0));
	let mots = $state([]);
	// Deux mouvements (Romain, 04-11) : la pluie, ou la poussière d'or qui
	// dessine chaque mot et glisse vers le suivant au rythme de la molette.
	// La poussière d'or s'ouvre par défaut (Romain, 05-11 : « une préférence
	// pour la poussière d'or »).
	let mòde = $state('polsa'); // 'polsa', 'plueja' ou 'paisatges'
	// Les mouvements : une liste qui s'allongera (la roue, le tunnel… en esquisse)
	const MOVEMENTS = [
		{ id: 'polsa', nom: T.polsa, desc: T.polsaDesc },
		{ id: 'plueja', nom: T.plueja, desc: T.pluejaDesc },
		{ id: 'paisatges', nom: T.paisatges, desc: T.paisatgesDesc }
	];
	let paisatges = $state(); // le défilé de paysages (Romain, 05-11)
	let nPaisatge = $state(0);
	// le thème des paysages : la mer, la montagne, la ville… ou tout (06-11)
	let temaPaisatges = $state(null);
	const nomTema = $derived(temaPaisatges ? TEMAS.find((t) => t.id === temaPaisatges).nom : T.tot);
	let reserva = $state({ naut: 64, bas: 110 }); // place de l'en-tête et des commandes, pour la poussière

	// Fond calme par défaut (Romain, 05-11) : un ciel de nuit teinté selon
	// l'ambiance ; la photo devient un choix, mémorisé d'une visite à l'autre.
	let fonsFoto = $state(false);
	let fotoVisible = $derived(fonsFoto && !!scena.imatge);
	let fotosDemandadas = $state({}); // photos déjà demandées (chargées une fois, gardées ensuite)

	// Première visite : l'explication se forme en poussière, en trois étapes,
	// puis les mots de l'ambiance (Romain, 05-11 : « pour une première fois,
	// il faudrait qu'on explique un peu le principe »). « Cossí far ? » la
	// remontre. Mémorisée dans le navigateur ; sans stockage, elle revient.
	let guidaActiva = $state(false);
	let lengaAra = $derived(langStore.current);
	let guida = $derived([
		[tria(T.titol), tria(T.guida1), null, 'remira', lengaAra],
		[tria(tactil ? T.det : T.rodeta), tria(tactil ? T.guida2 : T.guida2Clic), null, tactil ? 'det' : 'rodeta', lengaAra],
		[tria(T.guida3), tria(T.guida3Def), null, 'ambient', lengaAra]
	]);
	const CLAU_REMIRA = 'lo-ligam-remira';
	function gardar() {
		try {
			localStorage.setItem(CLAU_REMIRA, JSON.stringify({ fons: fonsFoto ? 'foto' : 'cel', guida: true, relèu }));
		} catch {
			/* mode privé : le choix vaut pour la visite */
		}
	}
	function finirGuida() {
		if (!guidaActiva) return;
		guidaActiva = false;
		gardar();
		activitat(); // les commandes peuvent de nouveau s'effacer
	}
	function tornarGuida() {
		if (mòde !== 'polsa') causirMòde('polsa');
		indici = false;
		guidaActiva = true;
		activitat();
	}

	// Choix de la langue, comme le bandeau du site : Òc, la seconde langue, le globe
	let segonda = $derived(langStore.segonda);
	let autras = $derived(SEGONDAS.filter((c) => c !== segonda));
	function causirLenga(v) {
		langStore.current = v;
		tamparPanel();
	}

	function tamparPanel() {
		racina?.querySelector(':popover-open')?.hidePopover?.();
	}
	const panelDobert = () => !!racina?.querySelector(':popover-open');
	// une liste refermée : les commandes peuvent de nouveau s'effacer
	const tornarActiu = (e) => e.newState === 'closed' && activitat();

	let racina, tela, barra, polsa;
	let son = null;

	// ── Mots ─────────────────────────────────────────────────────────────
	const fis = new Map(); // id → état physique (hors réactivité : mis à jour à chaque image)
	let compte = 0;
	let sac = [];
	let W = 1280,
		H = 800;

	function barrejar(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	function tirar() {
		if (!sac.length) sac = barrejar(scena.mots.slice());
		return sac.pop();
	}

	function nàisser(ara) {
		const [oc, def] = tirar();
		const prof = 0.62 + Math.random() * 0.38;
		const id = ++compte;
		let i = 0;
		const partidas = def.split(' ').map((m) => [...m].map((l) => ({ l, i: i++ })));
		// Les expressions des unités (« Pòdes repetir, se te plai ? ») : un peu
		// plus petites, sans descendre sous 0,85 (Limelight reste gros).
		const escala = Math.max(0.85, Math.min(1, 14 / oc.length));
		fis.set(id, { el: null, x: -9999, y: -9999, prof, nais: ara, vida: 12 + Math.random() * 4, fase: Math.random() * 6.28, partit: false });
		mots.push({ id, oc, def, partidas, prof, escala });
	}

	// Place le mot là où il gêne le moins les autres (meilleur de 16 tirages)
	function plaçar(f) {
		const w = f.el.offsetWidth,
			h = f.el.offsetHeight;
		const marge = Math.min(48, W * 0.06);
		let melhor = null,
			score = -1;
		for (let k = 0; k < 16; k++) {
			const x = marge + Math.random() * Math.max(1, W - w - 2 * marge);
			const y = H * 0.07 + Math.random() * H * 0.5;
			let d = Infinity;
			for (const o of fis.values()) {
				if (o === f || !o.el || o.partit) continue;
				const dx = x + w / 2 - (o.x + o.w / 2),
					dy = y + h / 2 - (o.y + o.h / 2);
				d = Math.min(d, Math.hypot(dx, dy * 1.6)); // l'empilement vertical gêne plus
			}
			if (d > score) {
				score = d;
				melhor = [x, y];
			}
		}
		[f.x, f.y] = melhor;
		f.w = w;
		f.h = h;
		f.el.style.translate = `${f.x}px ${f.y}px`;
	}

	const registrar = (id) => (el) => {
		const f = fis.get(id);
		if (!f) return;
		f.el = el;
		plaçar(f);
		return () => {
			f.el = null;
		};
	};

	function partir(id) {
		const f = fis.get(id);
		if (!f || f.partit) return;
		f.partit = true;
		f.el?.classList.add('part');
		setTimeout(() => {
			fis.delete(id);
			mots = mots.filter((m) => m.id !== id);
		}, 1900);
	}

	// ── Intensité ────────────────────────────────────────────────────────
	let impuls = 0; // élan donné par les gestes, qui retombe seul
	let nivLis = 0.2; // intensité lissée utilisée partout
	let vent = 0.07,
		ventCibla = 0.07; // inclinaison de la pluie (radians)

	function donar(q) {
		impuls = Math.min(1.1, impuls + q);
		if (q > 0.04) indici = false;
	}

	// ── Pluie (canevas) ──────────────────────────────────────────────────
	const CAPAS = [
		{ prof: 0.42, alfa: 0.14, larg: 0.8, part: 0.42 },
		{ prof: 0.7, alfa: 0.21, larg: 1, part: 0.34 },
		{ prof: 1, alfa: 0.3, larg: 1.2, part: 0.24 }
	];
	const gotas = [[], [], []];
	let estelas = [];
	let cx = null,
		dpr = 1;

	function novaGota(dins) {
		return { x: Math.random() * (W + 300) - 150, y: dins ? Math.random() * H : -Math.random() * 80, k: 0.8 + Math.random() * 0.4 };
	}

	function talhar() {
		W = innerWidth;
		H = innerHeight;
		if (!tela) return;
		dpr = Math.min(devicePixelRatio || 1, 1.5);
		tela.width = Math.round(W * dpr);
		tela.height = Math.round(H * dpr);
		cx = tela.getContext('2d');
		cx.setTransform(dpr, 0, 0, dpr, 0, 0);
		cx.lineCap = 'round';
		mesurarReserva();
		estelas = Array.from({ length: Math.round((W * H) / 20000) }, () => ({
			x: Math.random() * W,
			y: Math.random() * H * 0.62,
			r: 0.3 + Math.random() * 0.9,
			a: 0.25 + Math.random() * 0.6,
			w: 0.4 + Math.random() * 1.6,
			f: Math.random() * 6.28
		}));
	}

	function mesurarReserva() {
		const naut = racina?.querySelector('.cap')?.offsetHeight || 64;
		const bas = barra?.offsetHeight || 110;
		if (naut !== reserva.naut || bas !== reserva.bas) reserva = { naut, bas };
	}

	function dessenhar(dt, temps) {
		if (!cx) return;
		cx.clearRect(0, 0, W, H);
		if (!fotoVisible) {
			// les étoiles du ciel calme : d'un blanc froid, pour ne pas se confondre avec la poussière d'or
			cx.fillStyle = '#e4ecf7';
			for (const s of estelas) {
				cx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(temps * s.w + s.f));
				cx.beginPath();
				cx.arc(s.x, s.y, s.r, 0, 6.283);
				cx.fill();
			}
			cx.globalAlpha = 1;
		}
		if (calme || mòde !== 'plueja') return; // la poussière d'or a son propre canevas
		const n = Math.round((70 + 90 * nivLis + 480 * nivLis * nivLis) * Math.max(0.6, Math.min(2.2, (W * H) / (1440 * 900))));
		const vBase = 460 + 950 * nivLis;
		const ang = vent + 0.14 * nivLis * nivLis * Math.sign(vent || 1); // l'averse penche davantage
		const sx = Math.sin(ang),
			cy = Math.cos(ang);
		CAPAS.forEach((c, ci) => {
			const g = gotas[ci];
			const nc = Math.round(n * c.part);
			while (g.length < nc) g.push(novaGota(true));
			if (g.length > nc) g.length = nc;
			cx.beginPath();
			for (const d of g) {
				const v = vBase * c.prof * d.k;
				d.y += v * cy * dt;
				d.x += v * sx * dt;
				const len = 9 + v * 0.03;
				if (d.y - len > H || d.x < -160 || d.x > W + 160) {
					Object.assign(d, novaGota(false));
					d.x -= sx * H * 0.5;
					continue;
				}
				cx.moveTo(d.x, d.y);
				cx.lineTo(d.x - sx * len, d.y - cy * len);
			}
			cx.strokeStyle = `rgba(222, 234, 240, ${c.alfa * (0.75 + 0.5 * nivLis)})`;
			cx.lineWidth = c.larg;
			cx.stroke();
		});
	}

	// ── Boucle ───────────────────────────────────────────────────────────
	let raf = 0,
		darrier = 0,
		temps = 0,
		fasa = 0,
		darrierNais = -10;

	function tick(t) {
		const dt = Math.min(0.1, (t - darrier) / 1000 || 0); // au-delà (onglet en arrière-plan), on ne rattrape pas
		darrier = t;
		impuls *= Math.exp(-dt / 2.6);
		const cibla = Math.min(1, fons + impuls);
		nivLis += (cibla - nivLis) * Math.min(1, dt * 2.5);
		vent += (ventCibla - vent) * Math.min(1, dt * 1.5);
		son?.intensitat(nivLis);
		if (Math.abs(niv - nivLis) > 0.015) niv = nivLis;

		if (!pausa) {
			temps += dt;
			const escart = 4.6 - 3.7 * nivLis;
			const maxi = Math.round((4 + 6 * nivLis) * Math.max(0.65, Math.min(1.3, (W * H) / (1100 * 700)))); // moins de mots sur un petit écran
			let actius = 0;
			for (const f of fis.values()) if (!f.partit) actius++;
			if (mòde === 'plueja' && temps - darrierNais > escart && actius < maxi) {
				darrierNais = temps;
				nàisser(temps);
			}
			const vMot = 9 + 26 * nivLis + 90 * nivLis * nivLis;
			const amp = 2 + 26 * nivLis * nivLis;
			fasa += dt * (0.5 + 2.2 * nivLis); // phase cumulée : pas de saut quand l'intensité change
			for (const [id, f] of fis) {
				if (!f.el) continue;
				const age = temps - f.nais;
				if (!calme) {
					f.ral = f.partit ? Math.max(0.2, (f.ral ?? 1) - dt * 0.9) : 1; // un mot qui s'efface freine en douceur (pas de chute sur les commandes)
					const ral = f.ral;
					f.y += vMot * f.prof * dt * ral;
					f.x += Math.sin(vent) * vMot * f.prof * dt * 1.2 * ral;
					const balanç = Math.sin(fasa + f.fase) * amp * f.prof;
					const rot = Math.sin(fasa * 0.8 + f.fase * 1.3) * (0.3 + 4 * nivLis * nivLis);
					f.el.style.translate = `${(f.x + balanç).toFixed(1)}px ${f.y.toFixed(1)}px`;
					f.el.style.rotate = `${rot.toFixed(2)}deg`;
				}
				if (!f.partit && (age > f.vida * (1 - 0.45 * nivLis) || f.y + (f.h || 0) > H - (barra?.offsetHeight || 90) - 36)) partir(id); // s'efface avant les commandes
			}
			dessenhar(dt, temps);
		}
		raf = requestAnimationFrame(tick);
	}

	// ── Gestes ───────────────────────────────────────────────────────────
	let minuteurInactiu = 0,
		finIndici = 0;
	function activitat() {
		inactiu = false;
		clearTimeout(minuteurInactiu);
		// les commandes restent là tant qu'une liste (ambiance, mouvement, fond, langue) est ouverte
		// pendant l'explication aussi : sa dernière étape montre les commandes
		minuteurInactiu = setTimeout(() => (inactiu = !panelDobert() && !guidaActiva), 3500);
	}

	function rodeta(e) {
		if (e.target?.closest?.('[popover]')) return; // on fait défiler une liste, pas la pluie
		const d = (e.deltaY || 0) * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
		if (mòde !== 'plueja') {
			(mòde === 'polsa' ? polsa : paisatges)?.rodeta(d);
			if (Math.abs(d) > 20) indici = false;
			return;
		}
		donar((Math.min(Math.abs(d), 160) / 160) * 0.08);
	}

	// commandes, en-tête et liens : un clic dessus ne fait pas éclater le mot
	const susComandas = (e) => barra?.contains(e.target) || !!e.target?.closest?.('.cap, [popover], a, button, input, label');

	let darrierTòc = null;
	function bolegaPuntador(e) {
		activitat();
		if (mòde !== 'plueja') {
			if (mòde === 'polsa') polsa?.bolegar(e);
			return;
		}
		if (e.pointerType === 'mouse') {
			ventCibla = 0.07 + (e.clientX / W - 0.5) * 0.22;
		} else if (e.pointerType === 'touch' && darrierTòc) {
			const d = Math.hypot(e.clientX - darrierTòc.x, e.clientY - darrierTòc.y);
			donar(Math.min(d, 80) / 80 * 0.035);
			darrierTòc = { x: e.clientX, y: e.clientY };
		}
	}

	function moviment(e) {
		const r = e.rotationRate,
			a = e.acceleration;
		let en = 0;
		if (r) en += (Math.abs(r.alpha || 0) + Math.abs(r.beta || 0) + Math.abs(r.gamma || 0)) / 600;
		if (a) en += (Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0)) / 14;
		if (en < 0.04) return; // le tremblement de la main au repos ne compte pas
		const iv = e.interval ? (e.interval > 1 ? e.interval / 1000 : e.interval) : 0.016;
		donar(Math.min(en, 2) * iv * 2.2);
	}
	function orientacion(e) {
		if (e.gamma == null) return;
		ventCibla = Math.max(-0.4, Math.min(0.4, (e.gamma / 90) * 0.5));
	}

	let movimentDemandat = false;
	async function demandarMoviment() {
		if (movimentDemandat) return;
		movimentDemandat = true;
		try {
			// iPhone : l'accès aux capteurs se demande après un toucher
			if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
				const r = await DeviceMotionEvent.requestPermission();
				if (r !== 'granted') return;
				if (typeof DeviceOrientationEvent?.requestPermission === 'function') await DeviceOrientationEvent.requestPermission();
			}
		} catch {
			/* refus ou navigateur sans capteur : le doigt suffit */
		}
	}

	function tòc(e) {
		activitat(); // un toucher fait revenir les commandes (sinon elles restent cachées sur téléphone)
		if (mòde === 'polsa') {
			if (!susComandas(e)) {
				polsa?.tocar(e);
				if (e.pointerType === 'touch') indici = false;
			}
			return;
		}
		if (mòde === 'paisatges') return; // les paysages ont leurs propres gestes
		if (e.pointerType !== 'touch') return;
		darrierTòc = { x: e.clientX, y: e.clientY };
		demandarMoviment();
	}

	function levar(e) {
		darrierTòc = null;
		polsa?.levar(e); // un clic ou un toucher bref fait éclater le mot
	}

	function tecla(e) {
		activitat();
		// flèches et Espace : mot suivant ou précédent, même quand un bouton garde le focus (Joan, 05-11)
		if (mòde === 'plueja' || panelDobert()) return;
		const cible = e.target;
		if (cible?.matches?.('input, textarea, select')) return;
		if (e.key === ' ' && cible?.matches?.('button, a')) return; // Espace active le bouton
		(mòde === 'polsa' ? polsa : paisatges)?.tecla(e);
	}

	// ── Commandes ────────────────────────────────────────────────────────
	function causirMòde(m) {
		tamparPanel();
		if (m === mòde) return;
		mòde = m;
		clearTimeout(finIndici);
		if (m !== 'polsa') finirGuida(); // l'explication parle de la poussière d'or
		if (m !== 'plueja') {
			for (const id of fis.keys()) partir(id); // les mots de la pluie s'effacent
			if (sonAtiu) bascularSon(); // le son de la pluie n'a plus de sens
			indici = !calme;
			finIndici = setTimeout(() => (indici = false), 7000);
		} else {
			indici = false;
			darrierNais = temps - 3.4;
		}
		requestAnimationFrame(mesurarReserva); // les commandes ont changé de taille
	}

	function causirScena(id) {
		tamparPanel();
		if (id === scenaId) return;
		if (id === QUASERNET.id) {
			motsQuasernet = motsDelQuasernet($state.snapshot(carnet.cartes), aRevoir(carnet));
			if (!motsQuasernet.length) return;
		}
		finirGuida(); // on a choisi une ambiance : l'explication a servi
		vistas[id] = true;
		scenaId = id;
		if (fonsFoto) fotosDemandadas[id] = true;
		sac = [];
		for (const id2 of fis.keys()) partir(id2);
		darrierNais = temps - 3.4; // un premier mot arrive vite
	}

	function causirTema(id) {
		tamparPanel();
		if (id === temaPaisatges) return;
		temaPaisatges = id;
		nPaisatge = 0; // le défilé repart sur ce thème, dans un ordre neuf
	}

	function causirFons(foto) {
		tamparPanel();
		fonsFoto = foto;
		if (foto) fotosDemandadas[scenaId] = true;
		gardar();
	}

	async function bascularSon() {
		if (!son) son = crearSonPlueja();
		if (sonAtiu) {
			son.amortar();
			sonAtiu = false;
		} else {
			sonAtiu = true;
			try {
				await son.allumar();
			} catch {
				sonAtiu = false;
			}
		}
	}

	function bascularPlen() {
		if (document.fullscreenElement) document.exitFullscreen?.();
		else racina?.requestFullscreen?.().catch(() => {});
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		tactil = matchMedia('(pointer: coarse)').matches;
		plenPossible = !!document.fullscreenEnabled;
		let prefs = {};
		try {
			prefs = JSON.parse(localStorage.getItem(CLAU_REMIRA) || '{}') || {};
		} catch {
			/* stockage indisponible : fond calme et explication, comme une première fois */
		}
		fonsFoto = prefs.fons === 'foto';
		relèu = prefs.relèu === true;
		relèuTotas = dev && new URLSearchParams(location.search).get('releu') === 'totas';
		if (fonsFoto) fotosDemandadas[scenaId] = true;
		if (!prefs.guida) {
			guidaActiva = true;
			indici = false;
		}
		demarrerCarnet();
		talhar();
		activitat();
		if (!guidaActiva) finIndici = setTimeout(() => (indici = false), 9000);
		addEventListener('resize', talhar);
		addEventListener('wheel', rodeta, { passive: true });
		addEventListener('devicemotion', moviment);
		addEventListener('deviceorientation', orientacion);
		addEventListener('keydown', tecla);
		addEventListener('pointermove', bolegaPuntador);
		addEventListener('pointerdown', tòc);
		addEventListener('pointerup', levar);
		addEventListener('pointercancel', levar);
		darrierNais = -3.6; // premier mot après une seconde
		raf = requestAnimationFrame((t) => {
			darrier = t;
			tick(t);
		});
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(finIndici);
			clearTimeout(minuteurInactiu);
			removeEventListener('resize', talhar);
			removeEventListener('wheel', rodeta);
			removeEventListener('devicemotion', moviment);
			removeEventListener('deviceorientation', orientacion);
			removeEventListener('keydown', tecla);
			removeEventListener('pointermove', bolegaPuntador);
			removeEventListener('pointerdown', tòc);
			removeEventListener('pointerup', levar);
			removeEventListener('pointercancel', levar);
			son?.tampar();
			if (document.fullscreenElement) document.exitFullscreen?.();
		};
	});
</script>

<svelte:head>
	<title>{tria(T.titol)} · Lo Ligam</title>
</svelte:head>

<main
	id="contengut"
	class="plueja scena-{scenaId}"
	class:inactiu
	class:pausa
	class:calme
	style:--naut="{reserva.naut}px"
	style:--bas="{reserva.bas}px"
	bind:this={racina}
>
	<header class="cap">
		<div class="cap-nom">
			<a class="tornar" href="/apren" aria-label={tria(T.tornar)} lang="oc"><span aria-hidden="true">‹</span> S’apren</a>
			<h1>{tria(T.titol)}</h1>
		</div>
		<div class="cap-dreita">
			<!-- toujours là, quel que soit le mouvement (Joan) : l'explication repasse à la poussière d'or -->
			<button type="button" class="ajuda" aria-pressed={guidaActiva} onclick={tornarGuida}>{tria(T.ajuda)}</button>
			<!-- La langue, comme dans le bandeau du site (Romain, 05-11 : « quand on
			     est dedans, on est bloqué avec l'occitan ») -->
			<div class="lengas" role="group" aria-label="Lenga / Langue">
				<button type="button" aria-pressed={lengaAra === 'oc'} lang="oc" onclick={() => causirLenga('oc')}>Òc</button>
				<button type="button" aria-pressed={lengaAra === segonda} lang={segonda} onclick={() => causirLenga(segonda)}>{LENGAS[segonda].curt}</button>
				<button type="button" class="globe" popovertarget="remira-lengas" title={tria(T.lengas)}>
					<Icona nom="mond" size="1.1rem" />
					<span class="sr">{tria(T.lengas)}</span>
				</button>
			</div>
			<div id="remira-lengas" class="panel panel-lengas" popover role="group" aria-label={tria(T.lengas)} ontoggle={tornarActiu}>
				{#each autras as code (code)}
					<button type="button" lang={code} onclick={() => causirLenga(code)}>{LENGAS[code].nom}</button>
				{/each}
			</div>
		</div>
	</header>

	<!-- Fonds : un ciel calme par défaut, teinté selon l'ambiance ; la photo
	     sur demande, chargée seulement quand on la choisit -->
	<div class="fons" aria-hidden="true">
		{#each TOTAS as s (s.id)}
			{#if vistas[s.id] || s.id === scenaId}
				<div class="cel" class:nuech={!s.teinta} class:vis={s.id === scenaId && !fotoVisible} style:--teinta={s.teinta}></div>
			{/if}
			{#if s.imatge && fotosDemandadas[s.id]}
				<img class="foto" class:vis={s.id === scenaId && fotoVisible} src={s.imatge} alt="" style:object-position={s.posicion} decoding="async" />
			{/if}
		{/each}
		<!-- collines en silhouette : deux plans, quelques octets -->
		<svg class="collas" class:vis={!fotoVisible} viewBox="0 0 1000 200" preserveAspectRatio="none">
			<path d="M0 118C120 82 220 96 330 72S560 92 680 62 900 70 1000 52V200H0Z" fill="#0b1626" />
			<path d="M0 160C150 126 260 150 400 131S640 150 780 128 950 136 1000 124V200H0Z" fill="#060c16" />
		</svg>
		<div class="vela"></div>
	</div>

	<canvas bind:this={tela} class="tela" aria-hidden="true"></canvas>

	{#if mòde === 'polsa'}
		<Polsa
			bind:this={polsa}
			mots={guidaActiva ? guida : scena.mots}
			clau={guidaActiva ? 'guida' : scenaId}
			boucla={!guidaActiva}
			onfin={finirGuida}
			{pausa}
			{calme}
			{reserva}
		/>
	{:else if mòde === 'paisatges'}
		{#key temaPaisatges}
			<Paisatges bind:this={paisatges} bind:n={nPaisatge} tema={temaPaisatges} {pausa} {calme} {relèu} {relèuTotas} />
		{/key}
	{/if}

	<div class="mots" aria-hidden="true">
		{#each mots as m (m.id)}
			<div class="mot" style:--prof={m.prof} style:--escala={m.escala} {@attach registrar(m.id)}>
				<span class="oc" lang="oc">{m.oc}</span>
				<span class="filet"></span>
				<span class="def" lang="fr"
					>{#each m.partidas as p, k}{#if k > 0}{' '}{/if}<span class="mw"
							>{#each p as c}<span class="l" style:--i={c.i}>{c.l}</span>{/each}</span
						>{/each}</span
				>
			</div>
		{/each}
	</div>

	<!-- Pour les lecteurs d'écran : la liste des mots de l'ambiance, sans animation -->
	<div class="sr" hidden={mòde === 'paisatges'}>
		<h2>{tria(T.mots)} · {tria(scena.nom)}</h2>
		<ul>
			{#each scena.mots as [oc, def] (oc)}
				<li><span lang="oc">{oc}</span> : <span lang="fr">{def}</span></li>
			{/each}
		</ul>
	</div>

	<!-- Le rappel du geste, pour la pluie et les paysages : pour la poussière
	     d'or, l'explication le montre, et le rappel se posait sur la définition -->
	<p class="indici" class:vis={indici && !calme && mòde !== 'polsa'} aria-hidden={!indici || mòde === 'polsa'}>
		{#if mòde === 'paisatges'}{tria(tactil ? T.ponchTactil : T.ponch)}{:else}{tactil ? tria(T.telefon) : tria(T.rodeta)}{/if}
	</p>

	<div class="comandas" bind:this={barra}>
		<!-- Trois choix rangés de la même façon (Romain, 05-11 : « rendre plus
		     cohérente l'interface ») : le mouvement, l'ambiance, le fond. Chacun
		     ouvre sa liste ; un clic ailleurs ou Échap la referme (popover natif). -->
		<div class="causidas">
			<button type="button" class="causida" popovertarget="remira-movements">
				<span class="etiqueta">{tria(T.movement)}</span>
				<span class="valor">{tria(MOVEMENTS.find((m) => m.id === mòde).nom)}</span>
			</button>
			{#if mòde === 'paisatges'}
				<!-- Les paysages : le thème, puis le précédent, le numéro, le suivant,
				     à la place de l'ambiance et du fond (qui n'ont pas de sens ici) -->
				<button type="button" class="causida" popovertarget="remira-tema">
					<span class="etiqueta">{tria(T.tema)}</span>
					<span class="valor">{tria(nomTema)}</span>
				</button>
				<div class="causida navega" role="group" aria-label={tria(T.paisatges)}>
					<span class="etiqueta" aria-hidden="true">{tria(T.paisatges)}</span>
					<span class="valor">
						<button type="button" class="sageta" aria-label={tria(T.precedent)} onclick={() => paisatges?.precedent()}>‹</button>
						<span class="compte-p"><span class="num">{nPaisatge + 1}</span> / {deTema(temaPaisatges).length}</span>
						<button type="button" class="sageta" aria-label={tria(T.seguent)} onclick={() => paisatges?.seguent()}>›</button>
					</span>
				</div>
			{:else}
				<button type="button" class="causida" popovertarget="temas">
					<span class="etiqueta">{tria(T.ambianca)}</span>
					<span class="valor">{#if scena.numero}<span class="num">{scena.numero}</span>{' '}{/if}{tria(scena.nom)}</span>
				</button>
				<button type="button" class="causida" popovertarget="remira-fons">
					<span class="etiqueta">{tria(T.fons)}</span>
					<span class="valor">{tria(fotoVisible ? T.foto : T.cel)}</span>
				</button>
			{/if}
		</div>

		<div id="remira-movements" class="panel panel-pichon" popover role="group" aria-label={tria(T.movement)} ontoggle={tornarActiu}>
			<h2>{tria(T.movement)}</h2>
			<ul class="opcions">
				{#each MOVEMENTS as m (m.id)}
					<li>
						<button type="button" aria-pressed={mòde === m.id} onclick={() => causirMòde(m.id)}>
							<span class="nom">{tria(m.nom)}</span>
							<span class="desc">{tria(m.desc)}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div id="temas" class="panel temas" popover role="group" aria-label={tria(T.ambianca)} ontoggle={tornarActiu}>
			<!-- les mots de son carnet d'abord : ce qu'on a appris soi-même -->
			<section class="grop grop-quasernet">
				<h2>{tria(T.quasernet)}</h2>
				{#if nQuasernet}
					<ul>
						<li>
							<button type="button" aria-pressed={scenaId === QUASERNET.id} onclick={() => causirScena(QUASERNET.id)}>
								{tria(QUASERNET.nom)} <span class="compte">{nQuasernet}</span>
							</button>
						</li>
					</ul>
				{:else}
					<p class="void">{tria(T.quasernetVoid)} <a href="/aprene" lang="oc">S’apren</a></p>
				{/if}
			</section>
			{#each GROPS as g (g.id)}
				<section class="grop grop-{g.id}">
					<h2>{tria(g.nom)}</h2>
					<ul>
						{#each SCENAS.filter((s) => s.grop === g.id) as s (s.id)}
							<li>
								<button type="button" aria-pressed={s.id === scenaId} onclick={() => causirScena(s.id)}>
									{#if s.numero}<span class="num">{s.numero}</span>{' '}{/if}{tria(s.nom)}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<div id="remira-tema" class="panel panel-pichon" popover role="group" aria-label={tria(T.tema)} ontoggle={tornarActiu}>
			<h2>{tria(T.tema)}</h2>
			<ul class="opcions">
				{#each [{ id: null, nom: T.tot }, ...TEMAS] as t (t.id ?? 'tot')}
					<li>
						<button type="button" aria-pressed={temaPaisatges === t.id} onclick={() => causirTema(t.id)}>
							<span class="nom">{tria(t.nom)}<span class="compte">{deTema(t.id).length}</span></span>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<div id="remira-fons" class="panel panel-pichon" popover role="group" aria-label={tria(T.fons)} ontoggle={tornarActiu}>
			<h2>{tria(T.fons)}</h2>
			<ul class="opcions">
				<li>
					<button type="button" aria-pressed={!fonsFoto} onclick={() => causirFons(false)}>
						<span class="nom">{tria(T.cel)}</span>
						<span class="desc">{tria(T.celDesc)}</span>
					</button>
				</li>
				<li>
					<button type="button" aria-pressed={fonsFoto} onclick={() => causirFons(true)}>
						<span class="nom">{tria(T.foto)}</span>
						<span class="desc">{tria(scena.imatge ? T.fotoDesc : T.fotoCap)}</span>
					</button>
				</li>
			</ul>
		</div>

		<div class="botons">
			{#if mòde === 'plueja'}
				<label class="forca" style:--niv={niv}>
					<span>{tria(T.forca)}</span>
					<input type="range" min="0" max="1" step="0.05" bind:value={fons} />
				</label>
				<button type="button" aria-pressed={sonAtiu} onclick={bascularSon}>{tria(T.son)}</button>
			{/if}
			{#if mòde === 'paisatges' && relèuPossible}
				<button
					type="button"
					aria-pressed={relèu}
					onclick={() => {
						relèu = !relèu;
						gardar();
					}}>{tria(T.relèu)}</button
				>
			{/if}
			<button type="button" aria-pressed={pausa} onclick={() => (pausa = !pausa)}>{tria(T.pausa)}</button>
			{#if plenPossible}
				<button type="button" onclick={bascularPlen}>{tria(T.plenEcran)}</button>
			{/if}
		</div>
	</div>
</main>

<style>
	.plueja {
		--crema: #f7f3ee;
		--aur-clar: #ffd47f;
		--def: #f1dcb2;
		position: fixed;
		inset: 0;
		overflow: hidden;
		/* clip : ni un focus ni un clic ne font glisser la page (les fonds
		   débordent de 4 %, 05-11) */
		overflow: clip;
		background: #0b1517;
		color: var(--crema);
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		z-index: 1;
	}
	.plueja.inactiu {
		cursor: none;
	}

	/* ── Fonds ── */
	.fons,
	.tela,
	.mots {
		position: absolute;
		inset: 0;
	}
	.foto,
	.cel {
		position: absolute;
		inset: -4%;
		width: 108%;
		height: 108%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 1.6s ease;
		animation: respir 80s ease-in-out infinite alternate;
	}
	.foto.vis,
	.cel.vis {
		opacity: 1;
	}
	/* Le ciel calme, fond par défaut (Romain, 05-11) : la nuit de « Nuèch »,
	   et pour chaque autre ambiance une lueur de sa teinte sur l'horizon,
	   comme une heure du soir à chacune. Tout en dégradés : zéro octet. */
	.cel {
		background:
			radial-gradient(ellipse 85% 34% at 50% 80%, color-mix(in srgb, var(--teinta, #22324a) 30%, transparent), transparent 72%),
			radial-gradient(ellipse 55% 30% at 78% 6%, color-mix(in srgb, var(--teinta, #22324a) 8%, transparent), transparent 70%),
			linear-gradient(#050a14, #0a1524 52%, #121d31);
	}
	@keyframes respir {
		from {
			scale: 1;
			translate: 0 0;
		}
		to {
			scale: 1.08;
			translate: -1.5% -1%;
		}
	}
	.cel.nuech {
		background:
			radial-gradient(circle at 76% 21%, #f6ead0 0 2.4vmin, rgba(255, 236, 200, 0.28) 2.7vmin, rgba(255, 226, 170, 0.08) 7vmin, transparent 20vmin),
			radial-gradient(ellipse at 50% 120%, #22324a 0%, transparent 60%),
			linear-gradient(#050a14, #0c1828 55%, #17233a);
	}
	.collas {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 30%;
		opacity: 0;
		transition: opacity 1.6s ease;
	}
	.collas.vis {
		opacity: 1;
	}
	.vela {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 85% 75% at 50% 42%, rgba(8, 16, 18, 0.18), rgba(5, 11, 13, 0.62)),
			linear-gradient(to top, rgba(4, 9, 11, 0.72), transparent 32%),
			linear-gradient(to bottom, rgba(4, 9, 11, 0.45), transparent 22%);
	}
	.tela {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* ── Mots ── */
	.mots {
		pointer-events: none;
	}
	.mot {
		position: absolute;
		top: 0;
		left: 0;
		max-width: min(30rem, 84vw);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		translate: -9999px -9999px;
		opacity: 0;
		animation: venir 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		will-change: translate, rotate;
	}
	.mot.part {
		animation: s-esvanir 1.8s ease-in forwards;
	}
	@keyframes venir {
		from {
			opacity: 0;
			filter: blur(10px);
			scale: 0.94;
		}
		to {
			opacity: calc(0.5 + var(--prof) * 0.5);
			filter: blur(0);
			scale: 1;
		}
	}
	@keyframes s-esvanir {
		from {
			opacity: calc(0.5 + var(--prof) * 0.5);
			filter: blur(0);
		}
		to {
			opacity: 0;
			filter: blur(9px);
		}
	}
	.oc {
		font-family: var(--font-heading);
		font-size: calc(clamp(1.7rem, 1rem + 2.4vw, 3.4rem) * (0.8 + (var(--prof) - 0.62) * 0.53) * var(--escala, 1)); /* plancher 0,8 : Limelight reste gros */
		line-height: 1.05;
		letter-spacing: 0.02em;
		color: var(--crema);
		text-shadow:
			0 0 28px rgba(0, 0, 0, 0.55),
			0 1px 2px rgba(0, 0, 0, 0.45);
		/* une expression longue passe sur deux lignes égales */
		text-wrap: balance;
	}
	.filet {
		display: block;
		height: 1px;
		width: 0;
		background: var(--aur-clar);
		opacity: 0.65;
		animation: tirar 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s forwards;
	}
	@keyframes tirar {
		to {
			width: 2.4rem;
		}
	}
	.def {
		font-family: var(--font-quote);
		font-style: italic;
		font-size: calc(clamp(1.05rem, 0.9rem + 0.5vw, 1.45rem) * (0.55 + var(--prof) * 0.45));
		line-height: 1.3;
		color: var(--def);
		text-shadow:
			0 0 16px rgba(0, 0, 0, 0.7),
			0 1px 1px rgba(0, 0, 0, 0.5);
	}
	.mw {
		white-space: nowrap;
	}
	.l {
		display: inline-block;
		opacity: 0;
		animation: escriure 0.9s ease-out forwards;
		animation-delay: calc(1.35s + var(--i) * 45ms);
	}
	@keyframes escriure {
		from {
			opacity: 0;
			filter: blur(4px);
			translate: 0.12em 0.18em;
		}
		to {
			opacity: 1;
			filter: blur(0);
			translate: 0 0;
		}
	}
	.pausa .mot,
	.pausa .mot *,
	.pausa .foto,
	.pausa .cel {
		animation-play-state: paused;
	}

	/* ── En-tête et commandes : s'effacent quand on ne touche à rien ── */
	.cap,
	.comandas,
	.indici {
		z-index: 2;
	}
	.cap,
	.comandas {
		transition: opacity 0.9s ease;
	}
	.inactiu .cap,
	.inactiu .comandas {
		opacity: 0;
	}
	.cap:focus-within,
	.comandas:focus-within {
		opacity: 1;
	}
	.cap {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 1.1rem clamp(1rem, 3vw, 2rem);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.cap-nom {
		display: flex;
		align-items: baseline;
		gap: 1.1rem;
	}
	/* à droite : revoir l'explication, puis la langue (comme le bandeau du site) */
	.cap-dreita {
		display: flex;
		align-items: center;
		gap: 1.6rem;
		font-family: var(--font-body);
		font-size: 0.8rem;
		letter-spacing: 0.05em;
	}
	.lengas {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}
	.globe {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0;
	}
	.tornar {
		font-family: var(--font-body);
		font-size: 0.82rem;
		color: rgba(247, 243, 238, 0.78);
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.tornar:hover {
		color: var(--crema);
	}
	h1 {
		margin: 0;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.74rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.55);
	}

	.indici {
		position: absolute;
		left: 50%;
		bottom: calc(var(--bas, 5rem) + 1.2rem);
		translate: -50% 0;
		margin: 0;
		font-family: var(--font-quote);
		font-style: italic;
		font-size: 1.15rem;
		color: rgba(247, 243, 238, 0.8);
		text-shadow: 0 0 14px rgba(0, 0, 0, 0.7);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 1.4s ease;
		pointer-events: none;
	}
	.indici.vis {
		opacity: 1;
		transition-delay: 1.2s;
	}

	.comandas {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1rem clamp(1rem, 3vw, 2rem) max(1.1rem, env(safe-area-inset-bottom));
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.7rem 2.6rem;
		font-family: var(--font-body);
		font-size: 0.8rem;
		letter-spacing: 0.05em;
	}
	.botons button {
		min-height: 2.75rem; /* 44 px à toucher */
	}
	.botons {
		display: flex;
		align-items: center;
		gap: 1.3rem;
		padding-inline-start: 2.6rem;
		border-inline-start: 1px solid rgba(247, 243, 238, 0.16);
	}

	/* ── Les trois choix : le mouvement, l'ambiance, le fond ── */
	.causidas {
		display: flex;
		align-items: flex-end;
		gap: 2.4rem;
	}
	.causida {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		gap: 0.22rem;
		max-width: 15rem;
		min-height: 2.75rem; /* 44 px à toucher */
		padding: 0.3rem 0;
		text-align: start;
		text-decoration-line: none;
	}
	/* les paysages : ‹ 3 / 12 ›, rangé comme les autres choix */
	.navega .valor {
		align-items: center;
		gap: 0;
	}
	.navega .valor::after {
		content: none;
	}
	.navega .sageta {
		min-width: 2.75rem; /* 44 px à toucher */
		min-height: 2.75rem;
		margin-block: -0.7rem;
		font-size: 1.35rem;
		line-height: 1;
		text-decoration: none;
	}
	.navega .sageta:first-child {
		margin-inline-start: -0.9rem;
	}
	.compte-p {
		font-variant-numeric: tabular-nums;
	}
	.etiqueta {
		font-size: 0.7rem; /* lisible aussi sur une photo (Joan) */
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.66);
	}
	.valor {
		display: inline-flex;
		align-items: baseline;
		gap: 0.15em;
		max-width: 100%;
		font-size: 0.92rem;
		color: var(--crema);
		white-space: nowrap;
	}
	/* un petit chevron : la liste s'ouvre vers le haut */
	.valor::after {
		content: '';
		flex: none;
		width: 0.36em;
		height: 0.36em;
		margin-inline-start: 0.5em;
		border-top: 1px solid currentColor;
		border-left: 1px solid currentColor;
		rotate: 45deg;
		translate: 0 0.05em;
		opacity: 0.55;
		transition: opacity 0.3s;
	}
	.causida:hover .valor::after {
		opacity: 1;
	}
	.num {
		display: inline-block;
		min-width: 1.2em;
		margin-right: 0.2em; /* plus l'espace du texte, lue par les lecteurs d'écran */
		font-variant-numeric: tabular-nums;
		color: var(--aur-clar);
	}
	.panel {
		/* le popover natif se centre ; on le pose au-dessus de la barre */
		position: fixed;
		inset: auto auto calc(var(--bas, 5.2rem) + 0.4rem) 50%;
		translate: -50% 0;
		margin: 0;
		width: min(36rem, calc(100vw - 32px));
		max-height: min(70vh, 34rem);
		overflow: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin; /* pas de barre claire sur le sombre */
		scrollbar-color: rgba(247, 243, 238, 0.25) transparent;
		touch-action: pan-y;
		padding: 1.1rem 1.4rem 1.2rem;
		border: 1px solid rgba(255, 212, 127, 0.22);
		border-radius: 0.9rem;
		background: rgba(8, 15, 17, 0.84);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: var(--crema);
		font-family: var(--font-body);
		font-size: 0.9rem;
		letter-spacing: 0.03em;
	}
	.panel::backdrop {
		background: transparent;
	}
	.panel h2 {
		margin: 0 0 0.5rem;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(247, 243, 238, 0.55);
	}
	.grop + .grop {
		margin-top: 1rem;
		padding-top: 0.9rem;
		border-top: 1px solid rgba(247, 243, 238, 0.12);
	}
	.temas ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 1.6rem;
	}
	.grop-poesia ul {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	/* le mouvement et le fond : peu de choix, chacun avec une ligne qui le dit */
	.panel-pichon {
		width: min(24rem, calc(100vw - 32px));
	}
	.panel ul.opcions {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.opcions button {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		padding: 0.55rem 0;
		text-align: start;
		text-decoration-line: none;
	}
	.opcions .nom {
		font-size: 0.95rem;
		color: rgba(247, 243, 238, 0.85);
		text-decoration: underline 1px transparent;
		text-underline-offset: 0.45em;
		transition: text-decoration-color 0.3s;
	}
	.opcions button[aria-pressed='true'] .nom {
		color: var(--crema);
		text-decoration-color: var(--aur-clar);
	}
	/* le compte d'un thème : hors du souligné du nom (Joan, 06-11) */
	.opcions .nom .compte {
		display: inline-block;
		text-decoration: none;
	}
	.opcions .desc {
		font-size: 0.8rem;
		line-height: 1.4;
		color: rgba(247, 243, 238, 0.6);
	}
	/* la langue : une petite liste sous l'en-tête, à droite */
	.panel-lengas {
		inset: calc(var(--naut, 3.6rem) - 0.2rem) clamp(1rem, 3vw, 2rem) auto auto;
		translate: none;
		width: auto;
		min-width: 9rem;
		padding: 0.5rem 1.2rem;
	}
	.panel-lengas button {
		display: block;
		width: 100%;
		min-height: 2.4rem;
		text-align: start;
	}
	.temas li button {
		width: 100%;
		min-height: 2.6rem;
		padding: 0.45rem 0;
		text-align: left;
		color: rgba(247, 243, 238, 0.78);
	}
	button {
		appearance: none;
		background: none;
		border: 0;
		padding: 0.35rem 0;
		font: inherit;
		letter-spacing: inherit;
		color: rgba(247, 243, 238, 0.62);
		cursor: pointer;
		text-decoration: underline transparent;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.45em;
		transition:
			color 0.3s,
			text-decoration-color 0.3s;
	}
	button:hover {
		color: var(--crema);
	}
	button[aria-pressed='true'] {
		color: var(--crema);
		text-decoration-color: var(--aur-clar);
	}
	.compte {
		margin-left: 0.4em;
		font-size: 0.85em;
		font-variant-numeric: tabular-nums;
		color: var(--aur-clar);
	}
	.void {
		margin: 0;
		line-height: 1.55;
		color: rgba(247, 243, 238, 0.62);
	}
	.void a {
		color: var(--crema);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.3em;
		text-decoration-color: rgba(247, 243, 238, 0.4);
		transition: text-decoration-color 0.3s;
	}
	.void a:hover {
		text-decoration-color: var(--crema);
	}
	button:focus-visible,
	.tornar:focus-visible,
	.void a:focus-visible,
	input:focus-visible {
		outline: 1px solid var(--aur-clar);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.forca {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		color: rgba(247, 243, 238, 0.62);
	}
	/* Curseur en filet fin : la partie dorée montre la pluie du moment
	   (base choisie + élan du geste), la pastille la base choisie. */
	input[type='range'] {
		appearance: none;
		-webkit-appearance: none;
		width: 7.5rem;
		height: 1rem;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 1px;
		background: linear-gradient(to right, var(--aur-clar) calc(var(--niv) * 100%), rgba(247, 243, 238, 0.3) 0);
	}
	input[type='range']::-moz-range-track {
		height: 1px;
		background: linear-gradient(to right, var(--aur-clar) calc(var(--niv) * 100%), rgba(247, 243, 238, 0.3) 0);
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 11px;
		height: 11px;
		margin-top: -5px;
		border-radius: 50%;
		background: var(--crema);
		border: 0;
	}
	input[type='range']::-moz-range-thumb {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--crema);
		border: 0;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Téléphone : commandes sur deux lignes, plus serrées */
	@media (max-width: 640px) {
		.comandas {
			gap: 0.4rem 1.4rem;
			font-size: 0.78rem;
		}
		.botons {
			gap: 1rem;
			padding-inline-start: 0;
			border-inline-start: 0;
		}
		.causidas {
			width: 100%;
			justify-content: space-between;
			gap: 1rem;
		}
		.causida {
			max-width: 40vw;
		}
		.valor {
			font-size: 0.86rem;
		}
		.cap-dreita {
			gap: 1rem;
		}
		.panel {
			padding: 1rem 1.1rem;
		}
		.temas ul {
			grid-template-columns: minmax(0, 1fr);
		}
		.grop-poesia ul {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 0.8rem;
		}
	}

	/* Réduire les animations : rien ne tombe, les mots apparaissent en fondu */
	@media (prefers-reduced-motion: reduce) {
		.foto,
		.cel {
			animation: none;
		}
		.mot,
		.mot.part {
			animation-name: fondu;
			animation-duration: 1.2s;
		}
		.mot.part {
			animation-direction: reverse;
		}
		.l,
		.filet {
			animation: none;
			opacity: 1;
		}
		.filet {
			width: 2.4rem;
		}
		@keyframes fondu {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
</style>
