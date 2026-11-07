<script>
	// La sèrp de las letras (chantier 27, idée de Romain du 2026-11-04 ; option A
	// sur 3). On lit le sens en français, la sèrp mange les lettres du mot dans
	// l'ordre et sa queue écrit le mot. Seulement les mots des unités 1 et 2
	// ($lib/jocs/serp-mots.js, vérifiés contre les modules par serp.test.js) ;
	// ni score, ni classement, ni chronomètre, ni partie perdue (cahier §11,
	// 2026-10-25). Depuis le 2026-11-05 (Romain) : la sèrp mange aussi les
	// lettres fausses, qu'on recrache avec Espace, le bouton du milieu ou un
	// toucher sur la grille ; une aide au départ explique les gestes ; le
	// passage d'un bord à l'autre glisse sans à-coup ; la tête mord. Clavier
	// (flèches, ZQSD, Espace, Échap), doigt (glisser sur la grille, ou les
	// flèches), pause, son désactivable, « pas à pas » d'office avec « réduire
	// les animations ». Aucun fichier : ni image ni son (les sons des leçons
	// sont fabriqués dans le navigateur). Composant affiché par la page
	// /apren/jocs, à côté de Los panièrs (Paniers.svelte).
	import { onMount, tick } from 'svelte';
	import { tria, lang as langStore } from '$lib/stores/lang.svelte.js';
	import { UNITATS, copar, letrasDe } from '$lib/jocs/serp-mots.js';
	// l'espace avant « ? ! : » ne coupe jamais la ligne (le « ? » restait seul, 06-11)
	import { insecable } from '$lib/jocs/paniers-pila.js';
	import { novelaPartida, virar, pas, posicions, letraAttesa, escupir, coa, DIRS } from '$lib/jocs/serp.js';
	import { playTick, playNota, playSorda, playArpegi } from '$lib/lesson/sounds.js';
	import Reglatges from '$lib/jocs/Reglatges.svelte';
	import BotonEcran from '$lib/jocs/BotonEcran.svelte';

	// Occitan passé à lo Congrès les 2026-11-04 et 05, à valider par Romain.
	const T = {
		consigna: {
			oc: 'La sèrp manja las letras dins l’òrdre : sa coa escriu lo mot.',
			fr: 'La sèrp mange les lettres dans l’ordre : sa queue écrit le mot.'
		},
		nivel: { oc: 'Nivèl', fr: 'Niveau' },
		// les huit unités de l'A1 (06-11) ; totas, unitat passés à lo Congrès le 2026-11-06
		totas: { oc: 'Totas', fr: 'Toutes' },
		unitatsTotas: { oc: 'Unitats 1 a 8', fr: 'Unités 1 à 8' },
		unitat: { oc: (n) => `Unitat ${n}`, fr: (n) => `Unité ${n}` },
		reglatges: { oc: 'Reglatges', fr: 'Réglages' },
		pausa: { oc: 'Pausa', fr: 'Pause' },
		son: { oc: 'Son', fr: 'Son' },
		pasAPas: { oc: 'Pas a pas', fr: 'Pas à pas' },
		autreMot: { oc: 'Un autre mot', fr: 'Un autre mot' },
		grasilha: { oc: 'Grasilha del jòc', fr: 'Grille du jeu' },
		ajudaTitol: { oc: 'Cossí jogar', fr: 'Comment jouer' },
		ajuda1: {
			oc: 'Sagetas del clavièr : la sèrp vira.',
			fr: 'Flèches du clavier : la sèrp tourne.'
		},
		ajuda1Tactil: {
			oc: 'Lisa lo det sus la grasilha, o tòca las sagetas : la sèrp vira.',
			fr: 'Glisse le doigt sur la grille, ou touche les flèches : la sèrp tourne.'
		},
		ajuda2: {
			oc: 'Manja las letras del mot, dins l’òrdre : sa coa l’escriu.',
			fr: 'Elle mange les lettres du mot, dans l’ordre : sa queue l’écrit.'
		},
		ajuda3: {
			oc: 'Espaci, o lo boton del mièg : escupir la darrièra letra.',
			fr: 'Espace, ou le bouton du milieu : recracher la dernière lettre.'
		},
		ajuda3Tactil: {
			oc: 'Tòca la grasilha, o lo boton del mièg : escupir la darrièra letra.',
			fr: 'Touche la grille, ou le bouton du milieu : recracher la dernière lettre.'
		},
		ajuda4: { oc: 'Escap : pausa.', fr: 'Échap : pause.' },
		// passé à lo Congrès le 2026-11-05 (tenguda, accelèra), à valider par Romain
		ajudaRapid: { oc: 'Sageta tenguda : la sèrp accelèra.', fr: 'Flèche maintenue : la sèrp accélère.' },
		partir: { oc: 'Partir', fr: 'Partir' },
		escupir: { oc: 'Escupir la darrièra letra', fr: 'Recracher la dernière lettre' },
		falsa: { oc: 'Letra falsa : Espaci per l’escupir.', fr: 'Mauvaise lettre : Espace pour la recracher.' },
		falsaTactil: { oc: 'Letra falsa : tòca la grasilha per l’escupir.', fr: 'Mauvaise lettre : touche la grille pour la recracher.' },
		barrada: { oc: 'Ta coa barra lo camin : vira.', fr: 'Ta queue barre le chemin : tourne.' },
		enPausa: { oc: 'En pausa', fr: 'En pause' },
		escriu: { oc: 'Escriu', fr: 'Écris' },
		escrich: { oc: 'Escrich uèi :', fr: 'Écrit aujourd’hui :' },
		letra: { oc: (n, t) => `Letra ${n} sus ${t}`, fr: (n, t) => `Lettre ${n} sur ${t}` },
		amont: { oc: 'Amont', fr: 'Haut' },
		aval: { oc: 'Aval', fr: 'Bas' },
		esquerra: { oc: 'Esquèrra', fr: 'Gauche' },
		drecha: { oc: 'Drecha', fr: 'Droite' }
	};

	const PAS_MS = 380; // un pas toutes les 0,38 s : lent par défaut
	// flèche maintenue : la sèrp accélère (Romain, 05-11 : « il faudrait pouvoir
	// accélérer »), le temps que la flèche reste appuyée
	const PAS_RAPID = 130;
	// un virage se fait tout de suite, sans attendre le pas suivant (Romain,
	// 05-11 : « pas assez responsive ») ; pas deux pas à moins de 90 ms
	const PAS_MIN = 90;
	const CLAU_SON = 'lo-ligam-jocs-son';

	// ── Réglages ─────────────────────────────────────────────────────────
	let nivel = $state('1'); // l'unité, de '1' à '8', ou 'totas'
	let pasAPas = $state(false);
	let immersiu = $state(false); // mode plein (BotonEcran)
	let son = $state(true);
	let tactil = $state(false);
	let calme = $state(false);
	let esOc = $derived(langStore.current === 'oc');

	// ── Partie ───────────────────────────────────────────────────────────
	let cols = $state(15);
	let rows = $state(9);
	let p = null; // état du jeu (serp.js), hors réactivité
	let numero = 0; // numéro de la partie : clés uniques d'un mot à l'autre
	let mot = $state(null);
	let vista = $state({ teulas: [], cap: { rx: 0, ry: 0, saut: true }, dir: 'drecha', seguenta: 0, coa: [], falsas: 0, prop: false });
	let estat = $state('espera'); // espera · joc · pausa · acabat
	let ajuda = $state(true); // l'aide du départ, jusqu'au premier geste
	let barrada = $state(false);
	let indici = $state(false);
	let mordida = $state(0); // compteur : la tête mord (manger, recracher)
	let polsa = $state({ n: 0, x: 0, y: 0 }); // grains d'or sur la bonne lettre
	let anonci = $state('');
	let escrichs = $state([]);
	let sac = [];
	let darrierProgres = 0;
	let relòtge = null;
	let rapid = $state(false); // flèche maintenue
	let darrierPas = 0; // heure du dernier pas (performance.now)
	// l'angle de la tête, cumulé : elle tourne d'un quart de tour par le plus
	// court chemin au lieu de sauter d'une orientation à l'autre
	let angle = 0;
	const ANGLES = { drecha: 0, aval: 90, esquerra: 180, amont: 270 };
	let pasActual = $derived(pasAPas ? 160 : rapid ? PAS_RAPID : PAS_MS);
	let ancianas = new Map(); // k → position logique et de dessin au pas d'avant
	let racina;

	// sous les chiffres des unités : le nom et le titre de celle qu'on joue
	let legendaNivel = $derived.by(() => {
		const u = UNITATS.find((x) => String(x.id) === nivel);
		return u ? { nom: tria(u.nom), titol: u.titol } : { nom: tria(T.unitatsTotas) };
	});
	let partidas = $derived(copar(mot?.cadre ?? '_'));
	let letras = $derived(mot ? letrasDe(mot.mot) : []);
	let frasaComplèta = $derived(mot ? partidas.avant + mot.mot + partidas.apres : '');
	// les cases du mot : la queue s'y écrit, les lettres fausses marquées
	let cases = $derived.by(() => {
		const n = Math.max(letras.length, vista.coa.length);
		return Array.from({ length: n }, (_, i) => ({ l: vista.coa[i] ?? null, falsa: vista.coa[i] != null && i >= vista.seguenta }));
	});

	function barrejar(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	function lista() {
		return nivel === 'totas' ? UNITATS.flatMap((u) => u.mots) : UNITATS.find((u) => String(u.id) === nivel).mots;
	}
	function tirar() {
		if (!sac.length) {
			sac = barrejar(lista().slice());
			// jamais deux fois le même mot de suite
			if (sac.length > 1 && mot && sac.at(-1).mot === mot.mot) sac.unshift(sac.pop());
		}
		return sac.pop();
	}

	function nomDir(d) {
		return Object.keys(DIRS).find((k) => DIRS[k].x === d.x && DIRS[k].y === d.y);
	}

	// grille en largeur sur un grand écran, en hauteur sur un téléphone ;
	// revue à chaque mot (l'écran a pu tourner)
	function mesurar() {
		const estrech = matchMedia('(max-width: 559px)').matches;
		cols = estrech ? 10 : 15;
		rows = estrech ? 12 : 9;
	}

	function novelMot() {
		arrestar();
		rapid = false;
		mot = tirar();
		numero++;
		mesurar();
		// la tête repart d'où elle était (dans la grille), dans la même direction
		const cap = p
			? { x: Math.min(p.cors[0].x, cols - 1), y: Math.min(p.cors[0].y, rows - 1) }
			: { x: Math.floor(cols / 4), y: Math.floor(rows / 2) };
		const dir = p ? { ...p.dir } : DIRS.drecha;
		p = novelaPartida({ mot: mot.mot, trapas: mot.trapas, cols, rows, cap, dir });
		ancianas = new Map();
		estat = 'espera';
		barrada = false;
		indici = false;
		darrierProgres = Date.now();
		// pour les lecteurs d'écran : le sens, puis la formule à trous
		anonci = `${tria(T.escriu)} : ${mot.fr} · ${partidas.avant}…${partidas.apres} (${tria(T.letra)(1, letras.length)})`;
		rafrescar();
	}

	// Calcule où dessiner chaque case. Le passage d'un bord à l'autre glisse
	// (Romain, 05-11 : « on voit que ça lag ») : la case sort par un bord
	// pendant ce pas, puis entre par l'autre au pas suivant, en deux temps
	// (posée hors grille sans glissement, puis glissée vers sa case).
	function rafrescar() {
		const items = posicions(p).map((t) => ({ ...t, k: `${numero}-${t.k}`, j: t.cors ? p.manjadas.indexOf(t.k) : -1 }));
		const c = p.cors[0];
		items.push({ k: 'cap', x: c.x, y: c.y, cors: true, cap: true });
		const segond = [];
		const dessin = items.map((it) => {
			const a = ancianas.get(it.k);
			let rx = it.x,
				ry = it.y,
				saut = false,
				virt = false,
				ent = null;
			if (!a) saut = true; // apparition : sans glissement
			else if (a.virt) {
				// sortie par un bord au pas d'avant : entrée par l'autre, puis glissement
				rx = a.ent.x;
				ry = a.ent.y;
				saut = true;
				if (it.x !== rx || it.y !== ry) segond.push({ k: it.k, x: it.x, y: it.y });
			} else {
				const dx = it.x - a.x;
				const dy = it.y - a.y;
				if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
					if (it.cors && a.cors) {
						// franchit un bord : glisse dehors, entrera au pas suivant
						rx = a.x + Math.sign(-dx);
						ry = a.y + Math.sign(-dy);
						virt = true;
						ent = { x: it.x, y: it.y };
					} else saut = true; // posée ou recrachée loin : sans glissement
				}
			}
			return { ...it, rx, ry, saut, virt, ent, falsa: it.cors && !it.cap && it.j >= p.seguenta };
		});
		ancianas = new Map(dessin.map((d) => [d.k, { x: d.x, y: d.y, cors: d.cors, virt: d.virt, ent: d.ent }]));
		const cap = dessin.pop();
		// la langue sort quand la lettre attendue est juste devant la tête
		const att = letraAttesa(p);
		const d = p.file[0] ?? p.dir;
		const nx = (c.x + d.x + p.cols) % p.cols;
		const ny = (c.y + d.y + p.rows) % p.rows;
		const prop = !!att && p.teulas.some((t) => !t.manjada && t.l === att && t.x === nx && t.y === ny);
		const dir = nomDir(p.dir);
		angle += ((((ANGLES[dir] - angle) % 360) + 540) % 360) - 180;
		vista = { teulas: dessin, cap, dir, rot: angle, seguenta: p.seguenta, coa: coa(p), falsas: p.falsas, attesa: att, prop };
		if (segond.length) {
			// second temps : une fois la position hors grille posée (et calculée
			// par le navigateur), on glisse vers la case
			tick().then(() => {
				void racina?.offsetWidth;
				for (const s of segond) {
					const el = s.k === 'cap' ? vista.cap : vista.teulas.find((t) => t.k === s.k);
					if (!el) continue;
					el.rx = s.x;
					el.ry = s.y;
					el.saut = false;
				}
			});
		}
	}

	function avançar() {
		if (!p || estat === 'acabat') return;
		darrierPas = performance.now();
		const r = pas(p);
		barrada = r.tipe === 'barrada';
		if (r.tipe === 'manjada' || r.tipe === 'falsa' || r.tipe === 'acabat') {
			mordida++;
			// chaque bonne lettre monte d'une note : le mot se joue en s'écrivant ;
			// la lettre fausse, une note sourde (06-11)
			if (son) {
				if (r.tipe === 'falsa') playSorda();
				else playNota(p.seguenta - 1);
			}
		}
		if (r.tipe === 'manjada' || r.tipe === 'acabat') {
			// la bonne lettre : quelques grains d'or montent de la tête, comme
			// du panier qui reçoit le bon mot (Los panièrs)
			polsa = { n: polsa.n + 1, x: p.cors[0].x, y: p.cors[0].y };
			darrierProgres = Date.now();
			anonci = `${r.teula.l} · ${tria(T.letra)(Math.min(p.seguenta + 1, letras.length), letras.length)}`;
		}
		if (r.tipe === 'falsa') anonci = `${r.teula.l} · ${tria(tactil ? T.falsaTactil : T.falsa)}`;
		if (r.tipe === 'acabat') {
			arrestar();
			estat = 'acabat';
			// la gamme remonte avec l'onde dorée (une lettre toutes les 90 ms), puis
			// la note douce
			if (son) playArpegi(letras.length, 0.09, 0.25);
			anonci = `${frasaComplèta} · ${mot.son} · ${mot.fr}`;
			// ce que la sèrp a écrit dans cette séance (les huit derniers)
			escrichs = [...escrichs.slice(-7), frasaComplèta];
		}
		// aide douce : la bonne lettre s'éclaire après deux erreurs ou 12 s
		indici = !p.acabat && p.falsas === 0 && (p.errors >= 2 || Date.now() - darrierProgres > 12000);
		rafrescar();
	}

	function escupirLetra() {
		if (!p || estat === 'acabat' || ajuda) return;
		const t = escupir(p);
		if (!t) return;
		mordida++;
		if (son) playTick();
		anonci = `${t.l} · ${letraAttesa(p) ? tria(T.letra)(p.seguenta + 1, letras.length) : ''}`;
		rafrescar();
	}

	function demarrar() {
		arrestar();
		if (!pasAPas) relòtge = setInterval(avançar, rapid ? PAS_RAPID : PAS_MS);
	}
	// accélérer ou ralentir : le pas change de durée sans à-coup ; en
	// accélérant, un pas part tout de suite s'il en est temps
	function accelerar(v) {
		if (v === rapid) return;
		rapid = v;
		if (estat !== 'joc' || pasAPas) return;
		if (v && performance.now() - darrierPas >= PAS_RAPID) avançar();
		if (estat === 'joc') demarrar();
	}
	function arrestar() {
		if (relòtge) clearInterval(relòtge);
		relòtge = null;
	}

	function demandar(nom) {
		if (!p || estat === 'acabat') return;
		ajuda = false;
		const d = DIRS[nom];
		// le délai de l'aide douce part du premier mouvement, pas de l'affichage
		if (estat === 'espera') darrierProgres = Date.now();
		const memoDir = p.dir;
		const ok = virar(p, d);
		if (pasAPas) {
			// en pas à pas, chaque appui fait un pas (sauf le demi-tour, refusé)
			const memo = p.dir;
			const demiTorn = p.cors.length > 1 && d.x === -memo.x && d.y === -memo.y;
			if (!ok && demiTorn) return;
			estat = 'joc';
			avançar();
			return;
		}
		if (estat === 'espera' || estat === 'pausa') {
			estat = 'joc';
			avançar();
			demarrar();
			return;
		}
		// la flèche du sens où elle va : rien à tourner, elle accélère tant
		// que la flèche est tenue (relâcher : accelerar(false))
		if (!ok && d.x === memoDir.x && d.y === memoDir.y && !p.file.length) {
			accelerar(true);
			return;
		}
		// un virage : le pas part tout de suite et l'horloge repart de là
		if (ok && estat === 'joc' && p.file.length === 1 && performance.now() - darrierPas >= PAS_MIN) {
			avançar();
			if (estat === 'joc') demarrar();
		}
	}

	function bascularPausa() {
		if (estat === 'joc') {
			rapid = false;
			arrestar();
			estat = 'pausa';
			rafrescar(); // une case sortie par un bord rentre, pour rester visible
		} else if (estat === 'pausa') {
			estat = 'joc';
			demarrar();
		}
	}
	function bascularPasAPas() {
		pasAPas = !pasAPas;
		if (estat === 'joc') demarrar();
	}
	function bascularSon() {
		son = !son;
		try {
			localStorage.setItem(CLAU_SON, son ? '1' : '0');
		} catch {}
	}
	function causirNivel(c) {
		if (c === nivel) return;
		nivel = c;
		sac = [];
		novelMot();
	}

	// ── Clavier ──────────────────────────────────────────────────────────
	const TOCAS = { ArrowUp: 'amont', KeyW: 'amont', ArrowDown: 'aval', KeyS: 'aval', ArrowLeft: 'esquerra', KeyA: 'esquerra', ArrowRight: 'drecha', KeyD: 'drecha' };
	// Le jeu ne prend les touches que s'il est concerné (WCAG 2.1.4) : le
	// focus est dans le jeu, ou la sèrp avance ; les flèches aussi quand rien
	// n'a le focus et que la grille est en vue.
	function enVista() {
		const r = racina?.querySelector('.grasilha')?.getBoundingClientRect();
		return !!r && r.top >= 0 && r.bottom <= innerHeight;
	}
	function tòca(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const cibla = e.target;
		if (cibla?.closest?.('input, select, textarea, [contenteditable]')) return;
		const dedins = !!racina?.contains(cibla) || estat === 'joc';
		const res = !cibla || cibla === document.body || cibla === document.documentElement;
		const sus = cibla?.closest?.('button, a');
		const nom = TOCAS[e.code];
		if (nom) {
			if (!(dedins || (e.code.startsWith('Arrow') && res && enVista()))) return;
			e.preventDefault();
			demandar(nom);
			return;
		}
		if (!dedins) return;
		if (e.code === 'Space' && !sus) {
			e.preventDefault();
			if (ajuda) ajuda = false;
			else escupirLetra();
		}
		if (e.code === 'Escape' && (estat === 'joc' || estat === 'pausa')) {
			e.preventDefault();
			bascularPausa();
		}
		if (e.code === 'Enter' && !sus) {
			if (estat === 'acabat') {
				e.preventDefault();
				novelMot();
			} else if (ajuda) {
				e.preventDefault();
				ajuda = false;
			}
		}
	}

	function levarTòca(e) {
		if (TOCAS[e.code]) accelerar(false);
	}
	// les flèches à l'écran : le geste part à l'appui (pas au relâché, plus
	// tardif sur un téléphone) ; tenue, la flèche accélère ; au clavier
	// (Entrée, Espace sur le bouton), le clic suffit
	function apuejarDir(e, nom) {
		if (e.button > 0) return;
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {
			// pas de capture possible : le relâché arrivera quand même au bouton
		}
		demandar(nom);
	}
	function clicDir(e, nom) {
		if (e.detail === 0) demandar(nom);
	}

	// ── Doigt : glisser sur la grille pour tourner, toucher pour recracher ─
	let origina = null;
	let bolegat = false;
	let lisat = null; // le sens déjà demandé pendant ce geste
	function tocar(e) {
		// la grille prend le focus : le clavier marche ensuite à coup sûr
		e.currentTarget.focus({ preventScroll: true });
		origina = { x: e.clientX, y: e.clientY };
		bolegat = false;
		lisat = null;
	}
	function lisar(e) {
		if (!origina) return;
		const dx = e.clientX - origina.x;
		const dy = e.clientY - origina.y;
		if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
		bolegat = true;
		const nom = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'drecha' : 'esquerra') : dy > 0 ? 'aval' : 'amont';
		origina = { x: e.clientX, y: e.clientY };
		// le doigt qui continue dans le même sens ne redemande rien ; glisser
		// dans le sens de la sèrp et garder le doigt posé : elle accélère
		if (nom === lisat) return;
		lisat = nom;
		demandar(nom);
	}
	function levar(e) {
		if (origina && !bolegat && e.pointerType !== 'mouse' && !ajuda) escupirLetra();
		origina = null;
		accelerar(false);
	}

	onMount(() => {
		calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
		pasAPas = calme;
		tactil = matchMedia('(pointer: coarse)').matches;
		try {
			son = localStorage.getItem(CLAU_SON) !== '0';
		} catch {}
		novelMot();
		const amagat = () => {
			if (document.hidden && estat === 'joc') bascularPausa();
		};
		document.addEventListener('visibilitychange', amagat);
		return () => {
			arrestar();
			document.removeEventListener('visibilitychange', amagat);
		};
	});
</script>

<svelte:window onkeydown={tòca} onkeyup={levarTòca} onblur={() => accelerar(false)} />

{#snippet sageta(nom)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class="sageta sageta-{nom}"><path d="M7 14.5l5-5 5 5" /></svg>
{/snippet}

<section class="joc" class:immersiu aria-labelledby="titol-serp" style:--pas="{pasActual}ms" bind:this={racina}>
	<div class="disposicion">
		<header class="cap-joc">
			<h2 id="titol-serp" lang="oc">La sèrp de las letras</h2>
			{#if !esOc}<p class="glosa" lang="fr">le serpent des lettres</p>{/if}
			<p class="consigna">{tria(T.consigna)}</p>
		</header>

		<div class="pista">
			<div class="pista-info" aria-hidden="true">
			{#if mot}
				<p class="sens" lang="fr">{insecable(mot.fr)}</p>
				<p class="cadre" lang="oc">
					{#if partidas.avant}<span>{partidas.avant}</span>{/if}<span class="caselas"
						>{#each cases as c, i (i)}<span class="casela" class:plena={c.l != null} class:falsa={c.falsa}>{c.l ?? ''}</span>{/each}</span
					>{#if partidas.apres}<span>{insecable(partidas.apres)}</span>{/if}
				</p>
			{/if}
			</div>
			<BotonEcran bind:actiu={immersiu} cibla={racina} />
		</div>

		<div class="taula">
			<!-- La grille : on y glisse le doigt ; elle prend le focus (Tab ou toucher) pour le clavier.
			     Rôle « application » : un widget piloté au clavier (WCAG 2.1.4), d'où le tabindex. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div
				class="grasilha"
				class:calme
				class:pausa={estat === 'pausa'}
				class:acabat={estat === 'acabat'}
				style:--cols={cols}
				style:--rows={rows}
				role="application"
				tabindex="0"
				aria-label={tria(T.grasilha)}
				aria-describedby="anonci-serp"
				onpointerdown={tocar}
				onpointermove={lisar}
				onpointerup={levar}
				onpointercancel={levar}
			>
				{#each vista.teulas as t (t.k)}
					<span
						class="teula"
						class:cors={t.cors}
						class:sota={t.sotaCap}
						class:saut={t.saut}
						class:falsa={t.falsa}
						class:indici={indici && !t.cors && t.l === vista.attesa}
						style:--x={t.rx}
						style:--y={t.ry}
						style:--j={t.j}
						lang="oc"><span class="l"><span class="g" class:maj={t.l !== t.l.toLowerCase()}>{t.l}</span></span></span
					>
				{/each}
				<span class="cap" class:saut={vista.cap.saut} class:barrada class:prop={vista.prop} style:--x={vista.cap.rx} style:--y={vista.cap.ry}>
					{#key mordida}
						<span class="testa" class:mossega={mordida > 0} style:rotate="{vista.rot ?? 0}deg">
							<span class="uelh"></span><span class="uelh"></span><span class="lenga"></span><span class="boca"></span>
						</span>
					{/key}
				</span>
				{#if polsa.n > 0}
					{#key polsa.n}
						<span class="polsa" style:--x={polsa.x} style:--y={polsa.y} aria-hidden="true"
							>{#each [0, 1, 2, 3, 4] as k (k)}<i style:--dx="{(k - 2) * 0.55}em" style:--dl="{(k % 2) * 70}ms"></i>{/each}</span
						>
					{/key}
				{/if}

				{#if ajuda}
					<div class="carta ajuda-carta">
						<p class="carta-titol" lang="oc">{tria(T.ajudaTitol)}</p>
						<ul class="ajuda-lista">
							<li>{tria(tactil ? T.ajuda1Tactil : T.ajuda1)}</li>
							<li>{tria(T.ajuda2)}</li>
							<li>{tria(tactil ? T.ajuda3Tactil : T.ajuda3)}</li>
							<li>{tria(T.ajudaRapid)}</li>
							{#if !tactil}<li>{tria(T.ajuda4)}</li>{/if}
						</ul>
						<button type="button" class="pc accion" onclick={() => (ajuda = false)}>{tria(T.partir)}</button>
					</div>
				{:else if estat === 'acabat' && mot}
					<div class="carta fin" style:--n={letras.length}>
						<p class="fin-oc" lang="oc">{insecable(frasaComplèta)}</p>
						<p class="fin-son" lang="oc">{mot.son}</p>
						<p class="fin-fr" lang="fr">{insecable(mot.fr)}</p>
						<button type="button" class="pc accion" onclick={novelMot}>{tria(T.autreMot)}</button>
					</div>
				{/if}
			</div>
			<!-- sous la grille, pour ne jamais cacher la sèrp ni une lettre -->
			<p class="messatge" class:vis={!ajuda && (estat === 'pausa' || barrada || vista.falsas > 0)}>
				{#if estat === 'pausa'}{tria(T.enPausa)}
				{:else if vista.falsas > 0}{tria(tactil ? T.falsaTactil : T.falsa)}
				{:else if barrada}{tria(T.barrada)}{/if}
			</p>
			{#if escrichs.length}
				<p class="escrichs">
					<span class="escrichs-tit">{tria(T.escrich)}</span>
					{#each escrichs as e, i (i)}{#if i}<span class="sep">{' · '}</span>{/if}<span lang="oc">{insecable(e)}</span>{/each}
				</p>
			{/if}
		</div>

		<div class="comandas">
			<div class="crotz" role="group" aria-label={tria(T.grasilha)}>
				{#each ['amont', 'esquerra', 'drecha', 'aval'] as nom (nom)}
					<button
						type="button"
						class="pc dir dir-{nom}"
						aria-label={tria(T[nom])}
						onpointerdown={(e) => apuejarDir(e, nom)}
						onpointerup={() => accelerar(false)}
						onpointercancel={() => accelerar(false)}
						onclick={(e) => clicDir(e, nom)}
					>
						{@render sageta(nom)}
					</button>
				{/each}
				<button type="button" class="pc pc-2 escupir" aria-label={tria(T.escupir)} title={tria(T.escupir)} onclick={escupirLetra}>
					<svg viewBox="0 0 24 24" aria-hidden="true" class="sageta"><path d="M9 14l-4-4 4-4" /><path d="M5 10h8a5 5 0 0 1 0 10h-3" /></svg>
				</button>
			</div>

			<Reglatges
				causida={{
					titol: tria(T.nivel),
					valor: nivel,
					causir: causirNivel,
					// les huit unités de l'A1 en chiffres, le titre de la choisie dessous (06-11)
					compacte: true,
					opcions: [
						...UNITATS.map((u) => ({ id: String(u.id), label: String(u.id), aria: `${tria(u.nom)} · ${u.titol}` })),
						{ id: 'totas', label: tria(T.totas), aria: `${tria(T.totas)} · ${tria(T.unitatsTotas)}` }
					],
					legenda: legendaNivel
				}}
				bascules={[
					{ id: 'son', label: tria(T.son), valor: son, bascular: bascularSon },
					{ id: 'pas', label: tria(T.pasAPas), valor: pasAPas, bascular: bascularPasAPas }
				]}
				titolOpcions={tria(T.reglatges)}
			>
				<button type="button" class="pc pc-2" aria-pressed={estat === 'pausa'} disabled={estat !== 'joc' && estat !== 'pausa'} onclick={bascularPausa}
					>{tria(T.pausa)}</button
				>
				<button type="button" class="pc pc-2" onclick={novelMot}>{tria(T.autreMot)}</button>
			</Reglatges>
		</div>
	</div>
	<p id="anonci-serp" class="sr" aria-live="polite">{anonci}</p>
</section>

<style>
	.joc {
		container: joc / inline-size;
		--or: var(--t-aur);
	}
	.disposicion {
		display: grid;
		gap: var(--esp-24) var(--esp-48);
		grid-template-areas: 'cap' 'pista' 'taula' 'comandas';
	}
	/* Grand écran : la grille à gauche, le reste à côté, à hauteur des yeux */
	@container joc (min-width: 52rem) {
		.disposicion {
			grid-template-columns: minmax(0, 1fr) 22rem;
			grid-template-rows: auto auto 1fr;
			grid-template-areas: 'taula cap' 'taula pista' 'taula comandas';
			align-items: start;
		}
	}
	.cap-joc {
		grid-area: cap;
	}
	.pista {
		grid-area: pista;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--esp-16);
	}
	.pista-info {
		min-width: 0;
	}

	/* ── Mode plein (BotonEcran) : le jeu couvre tout l'écran ; le mot à
	   écrire en haut, la grille aussi grande que possible ; sur grand écran
	   les flèches à côté, sur téléphone dessous ; les réglages s'effacent
	   (Pausa et Un autre mot restent) ── */
	.joc.immersiu {
		position: fixed;
		inset: 0;
		z-index: 30;
		overflow: auto;
		padding: max(0.75rem, env(safe-area-inset-top)) clamp(0.75rem, 3vw, 2rem) max(0.75rem, env(safe-area-inset-bottom));
		background:
			radial-gradient(ellipse 70% 50% at 8% -8%, var(--t-braise), transparent 70%),
			var(--t-fons);
		--reste: 20rem; /* la hauteur prise par le mot et les flèches */
	}
	.immersiu .disposicion {
		min-height: 100%;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1fr auto;
		grid-template-areas: 'pista' 'taula' 'comandas';
		gap: var(--esp-12);
		align-items: center;
	}
	@container joc (min-width: 52rem) {
		/* une requête de conteneur ne touche pas le conteneur lui-même : la
		   variable passe par la disposition */
		.immersiu .disposicion {
			--reste: 9rem;
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-rows: auto 1fr;
			grid-template-areas: 'pista pista' 'taula comandas';
		}
	}
	.immersiu .cap-joc {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.immersiu .pista {
		align-items: center;
	}
	.immersiu .pista-info {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem var(--esp-24);
	}
	.immersiu .cadre {
		margin: 0;
	}
	.immersiu .grasilha {
		max-width: min(100%, calc((100svh - var(--reste)) * var(--cols) / var(--rows)));
	}
	.immersiu .comandas {
		justify-items: center;
		gap: var(--esp-16);
	}
	.immersiu .escrichs,
	.immersiu .comandas :global(.reglatges .grop) {
		display: none;
	}
	.taula {
		grid-area: taula;
	}
	.comandas {
		grid-area: comandas;
		display: grid;
		gap: var(--esp-24);
	}

	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1.05;
		color: var(--or);
	}
	.glosa {
		margin: 0.2rem 0 0;
		font-style: italic;
		color: var(--t-tinta-2);
	}
	.consigna {
		max-width: 36ch;
		margin: var(--esp-12) 0 0;
		line-height: 1.5;
		color: var(--t-tinta-2);
	}

	/* ── Le mot à écrire ── */
	.sens {
		margin: 0;
		font-size: clamp(1.25rem, 2.4vw, 1.5rem);
		line-height: 1.3;
	}
	.cadre {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 0.35em;
		margin: var(--esp-12) 0 0;
		font-size: 1.35rem;
		color: var(--t-tinta-2);
	}
	.caselas {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.3em;
	}
	.casela {
		display: inline-grid;
		place-items: end center;
		width: 1.05em;
		height: 1.35em;
		border-bottom: 1.5px solid var(--t-tinta-2);
		font-weight: 600;
		color: var(--t-tinta);
	}
	.casela.plena {
		border-bottom-color: var(--or);
		animation: pausar 0.25s ease-out;
	}
	/* une lettre mangée à tort : grisée, soulignée d'un trait ondulé */
	.casela.falsa {
		border-bottom: none;
		color: var(--t-tinta-2);
		text-decoration: underline wavy var(--t-tinta-2);
		text-underline-offset: 0.2em;
	}
	@keyframes pausar {
		from {
			translate: 0 -0.25em;
			opacity: 0;
		}
	}

	/* ── La grille ── */
	.grasilha {
		--cela: calc(100cqi / var(--cols));
		container-type: inline-size;
		position: relative;
		width: 100%;
		/* pas plus haute que l'écran ne le permet : le mot, la grille et les
		   flèches tiennent ensemble, même sur un téléphone de 667 px */
		max-width: calc(64svh * var(--cols) / var(--rows));
		aspect-ratio: var(--cols) / var(--rows);
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 1rem;
		/* la même lumière douce que Los panièrs : elle vient d'en haut, le bas
		   s'assombrit un peu ; un point fin marque chaque case */
		background:
			radial-gradient(circle, var(--t-linha) 1px, transparent 1.5px) 0 0 / calc(100% / var(--cols)) calc(100% / var(--rows)),
			radial-gradient(ellipse 70% 55% at 50% -6%, color-mix(in srgb, var(--or) 11%, transparent), transparent 72%),
			linear-gradient(to bottom, var(--l-carta) 40%, color-mix(in srgb, var(--t-fons) 22%, var(--l-carta)));
		/* un léger assombrissement des bords : la grille a de la profondeur */
		box-shadow: inset 0 0 3rem color-mix(in srgb, var(--t-fons) 24%, transparent);
		margin-inline: auto;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		cursor: default;
	}
	/* Téléphone : tout doit tenir sans défiler, du mot aux flèches (Romain,
	   05-11 : « une interface pleine et stable ») ; le titre du jeu est déjà
	   dans l'onglet, il reste pour les lecteurs d'écran */
	@media (max-width: 559px) {
		.grasilha {
			max-width: calc(40svh * var(--cols) / var(--rows));
		}
		.disposicion {
			gap: var(--esp-12);
		}
		.cap-joc {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.crotz {
			grid-template-columns: repeat(3, 2.8rem);
			grid-template-rows: repeat(3, 2.8rem);
			gap: 0.3rem;
		}
	}
	.grasilha:focus {
		outline: none;
	}
	.grasilha:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 3px;
	}
	.teula,
	.cap {
		position: absolute;
		left: 0;
		top: 0;
		width: calc(100% / var(--cols));
		height: calc(100% / var(--rows));
		display: grid;
		place-items: center;
		transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
		transition: transform var(--pas) linear;
	}
	.saut,
	.calme .teula,
	.calme .cap {
		transition: none;
	}
	/* une lettre libre : un filet fin, rien de plus (raffiné = filets fins) */
	.l {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 74%;
		height: 74%;
		border-radius: 50%;
		background: color-mix(in srgb, var(--l-carta) 70%, transparent);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--t-tinta) 45%, transparent);
		font-size: calc(var(--cela) * 0.5);
		font-weight: 600;
		line-height: 1;
		color: var(--t-tinta);
		transition:
			border-radius 0.3s,
			background-color 0.3s,
			width 0.3s,
			height 0.3s;
	}
	/* la lettre centrée sur sa hauteur d'x (les minuscules), ou de capitale :
	   le o n'est plus plus bas que le i (Romain, 05-11) ; les accents et les
	   points dépassent au-dessus, comme dans un texte */
	.g {
		display: block;
		text-box: trim-both ex alphabetic;
	}
	.g.maj {
		text-box: trim-both cap alphabetic;
	}
	@supports not (text-box: trim-both ex alphabetic) {
		.g {
			translate: 0 -0.08em;
		}
		.g.maj {
			translate: 0 -0.03em;
		}
	}
	/* une lettre dans la queue : la tuile dorée du logo, en chaîne (les tuiles se touchent) */
	.cors .l {
		width: 94%;
		height: 94%;
		border-radius: 30%;
		background: color-mix(in srgb, var(--or) 26%, var(--l-carta));
		/* un peu soulevée du fond, comme le mot qui tombe dans Los panièrs */
		box-shadow:
			inset 0 0 0 1.5px var(--or),
			0 0.22em 0.45em -0.28em rgba(0, 0, 0, 0.55);
	}
	/* mangée à tort : la tuile reste grise */
	.cors.falsa .l {
		background: color-mix(in srgb, var(--t-tinta) 10%, var(--l-carta));
		box-shadow: inset 0 0 0 1.5px var(--t-tinta-2);
		color: var(--t-tinta-2);
	}
	.cors.sota {
		z-index: 1;
	}
	/* la lettre vient d'être mangée : elle se gonfle un instant, sans rebond */
	.cors.sota .l {
		animation: manjar 0.3s ease-out;
	}
	@keyframes manjar {
		40% {
			scale: 1.16;
		}
	}
	/* mot écrit : une onde dorée court de la queue à la tête */
	.acabat .cors .l {
		animation: onda 0.55s ease-out calc(var(--j) * 90ms) both;
	}
	@keyframes onda {
		45% {
			background: var(--or);
			color: var(--color-text);
			scale: 1.1;
		}
	}
	.indici .l {
		box-shadow:
			0 0 0 1.5px var(--or),
			0 0 0 5px color-mix(in srgb, var(--or) 25%, transparent);
	}

	/* ── La tête ── */
	.cap {
		z-index: 2;
	}
	.testa {
		position: relative;
		width: 94%;
		height: 94%;
		/* un museau arrondi, tourné vers la route ; l'or du logo sur les deux
		   thèmes (le rouge est réservé à ce qui se clique) */
		border-radius: 34% 50% 50% 34% / 45% 50% 50% 45%;
		background: var(--color-gold);
		box-shadow:
			inset 0 0 0 1.5px color-mix(in srgb, var(--color-text) 55%, transparent),
			0 0.25em 0.5em -0.3em rgba(0, 0, 0, 0.6);
		transition: rotate 0.14s ease-out;
	}
	.calme .testa {
		transition: none;
	}
	/* la bonne lettre mangée : quelques grains d'or montent de la tête */
	.polsa {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
		width: calc(100% / var(--cols));
		height: calc(100% / var(--rows));
		transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
		font-size: calc(var(--cela) * 0.5);
		pointer-events: none;
	}
	.polsa i {
		position: absolute;
		left: 50%;
		top: 35%;
		width: 4px;
		height: 4px;
		margin: -2px;
		border-radius: 50%;
		background: var(--or);
		opacity: 0;
		animation: polsa 0.7s ease-out var(--dl) both;
	}
	@keyframes polsa {
		20% {
			opacity: 1;
		}
		to {
			opacity: 0;
			translate: var(--dx) -1.8em;
		}
	}
	.calme .polsa {
		display: none;
	}
	/* deux yeux, tournés vers la route ; aucune autre figure */
	.uelh {
		position: absolute;
		top: 26%;
		left: 60%;
		width: 15%;
		height: 15%;
		border-radius: 50%;
		background: var(--color-text);
	}
	.uelh + .uelh {
		top: 60%;
	}
	/* la langue : un trait fin qui sort quand la lettre attendue est juste devant */
	.lenga {
		position: absolute;
		left: 96%;
		top: 50%;
		width: 24%;
		height: 2px;
		margin-top: -1px;
		background: var(--color-text);
		transform-origin: left center;
		scale: 0 1;
		transition: scale 0.15s;
	}
	.prop .lenga {
		scale: 1 1;
		animation: lengueta 0.5s ease-in-out infinite alternate;
	}
	@keyframes lengueta {
		from {
			scale: 0.45 1;
		}
		to {
			scale: 1 1;
		}
	}
	.calme .prop .lenga {
		animation: none;
	}
	/* la bouche : fermée, invisible ; elle s'ouvre quand la sèrp mord ou recrache */
	.boca {
		position: absolute;
		right: 2%;
		top: 50%;
		width: 44%;
		height: 62%;
		translate: 0 -50%;
		background: var(--color-text);
		clip-path: polygon(100% 50%, 0 50%, 100% 50%);
	}
	.mossega {
		animation: mordre-testa 0.34s ease-out;
	}
	.mossega .boca {
		animation: mordre 0.34s ease-out;
	}
	.mossega .lenga {
		scale: 0 1;
	}
	@keyframes mordre {
		40% {
			clip-path: polygon(100% 8%, 0 50%, 100% 92%);
		}
	}
	@keyframes mordre-testa {
		40% {
			scale: 1.12;
		}
	}
	.barrada .testa {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--t-tinta) 35%, transparent);
	}

	/* une ligne réservée sous la grille : rien ne bouge quand elle se vide */
	.messatge {
		min-height: 1.5em;
		margin: var(--esp-8) 0 0;
		color: var(--t-tinta-2);
		text-align: center;
		visibility: hidden;
	}
	.messatge.vis {
		visibility: visible;
	}
	.escrichs {
		margin: var(--esp-12) 0 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--t-tinta-2);
		text-align: center;
	}
	.escrichs span[lang] {
		color: var(--t-tinta);
		font-weight: 600;
	}
	.escrichs-tit {
		font-style: italic;
	}
	.pausa .teula,
	.pausa .cap {
		opacity: 0.45;
	}

	/* les cartes posées sur la grille (aide du départ, mot écrit) : verre fumé
	   au milieu, la sèrp reste visible autour */
	.carta {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 4;
		translate: -50% -50%;
		width: min(88%, 26rem);
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		padding: 1.2rem 1.4rem 1.3rem;
		border-radius: 1rem;
		background: var(--t-veire-fort);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow:
			0 0 0 1px var(--t-linha),
			0 18px 40px -20px rgba(0, 0, 0, 0.5);
		text-align: center;
		animation: apareisser 0.4s ease-out both;
	}
	/* le mot écrit paraît une fois l'onde passée */
	.fin {
		animation-delay: calc(var(--n) * 90ms + 400ms);
	}
	@keyframes apareisser {
		from {
			opacity: 0;
			translate: -50% calc(-50% + 0.5rem);
		}
	}
	.calme .carta {
		animation: none;
	}
	.carta-titol {
		margin: 0 0 0.3rem;
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 1.5rem;
		color: var(--or);
	}
	.ajuda-lista {
		margin: 0 0 var(--esp-16);
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.35rem;
		font-size: clamp(0.88rem, 3.2cqi, 1rem);
		line-height: 1.4;
		text-align: start;
	}
	.ajuda-lista li {
		padding-inline-start: 1.1em;
		text-indent: -1.1em;
	}
	.ajuda-lista li::before {
		content: '·';
		display: inline-block;
		width: 1.1em;
		text-indent: 0;
		color: var(--or);
		font-weight: 700;
	}
	/* une grille étroite, donc basse (fenêtre réduite, tablette, téléphone) :
	   la carte se serre pour tenir sans défiler (06-11 : à 800 px de large,
	   l'aide défilait et cachait « Partir ») */
	@container (max-width: 34rem) {
		.grasilha .carta {
			width: 94%;
			gap: 0.1rem;
			padding: 0.7rem 0.9rem 0.8rem;
		}
		.carta .carta-titol {
			margin-bottom: 0;
			font-size: 1.25rem;
		}
		.carta .ajuda-lista {
			margin-bottom: var(--esp-8);
			gap: 0.15rem;
			font-size: 0.84rem;
			line-height: 1.28;
		}
	}
	/* la carte tient toujours dans la grille : plus serrée sur téléphone, et
	   elle défile plutôt que d'être coupée */
	.grasilha .carta {
		max-height: calc(100% - 0.75rem);
		overflow-y: auto;
	}
	@media (max-width: 559px) {
		.grasilha .carta {
			width: 94%;
			padding: 0.8rem 1rem 0.9rem;
		}
		.carta .carta-titol {
			margin-bottom: 0.1rem;
		}
		.carta .ajuda-lista {
			margin-bottom: var(--esp-8);
			gap: 0.2rem;
			font-size: 0.86rem;
			line-height: 1.3;
		}
	}
	.fin-oc {
		margin: 0;
		font-size: clamp(1.8rem, 7cqi, 3rem);
		font-weight: 600;
		line-height: 1.15;
		color: var(--t-tinta);
	}
	.fin-son {
		margin: 0;
		color: var(--l-marca);
	}
	.fin-fr {
		margin: 0 0 var(--esp-16);
		font-size: 1rem;
		font-style: italic;
		color: var(--t-tinta);
	}

	/* ── Commandes ── */
	button:not(.pc) {
		font: inherit;
		cursor: pointer;
	}

	button:focus-visible {
		outline: 3px solid var(--or);
		outline-offset: 2px;
	}
	.crotz {
		display: grid;
		grid-template-columns: repeat(3, 3.2rem);
		grid-template-rows: repeat(3, 3.2rem);
		grid-template-areas: '. amont .' 'esquerra escupir drecha' '. aval .';
		gap: 0.35rem;
		justify-content: center;
	}
	@container joc (min-width: 52rem) {
		.crotz {
			justify-content: start;
		}
	}
	/* pièce de papier (lib/styles/papier.css) : les flèches du jeu */
	.dir {
		--r: 12px;
		min-height: 0;
		padding: 0;
		touch-action: manipulation;
	}

	.dir-amont {
		grid-area: amont;
	}
	.dir-aval {
		grid-area: aval;
	}
	.dir-esquerra {
		grid-area: esquerra;
	}
	.dir-drecha {
		grid-area: drecha;
	}
	/* au milieu de la croix : recracher, un filet fin (ce n'est pas une direction) */
	/* au milieu de la croix : recracher, une pièce de carton (ce n'est pas une direction) */
	.escupir {
		grid-area: escupir;
		--r: 14px;
		min-height: 0;
		padding: 0;
		touch-action: manipulation;
	}

	.sageta {
		width: 1.6rem;
		height: 1.6rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sageta-aval {
		rotate: 180deg;
	}
	.sageta-esquerra {
		rotate: 270deg;
	}
	.sageta-drecha {
		rotate: 90deg;
	}
	/* pièce de papier (lib/styles/papier.css) */
	.accion {
		--r: 10px;
		padding: 0.6rem 1.2rem;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.teula,
		.cap,
		.l,
		.lenga {
			transition: none;
		}
		.casela.plena,
		.cors.sota .l,
		.acabat .cors .l,
		.prop .lenga,
		.mossega,
		.mossega .boca,
		.carta {
			animation: none;
		}
	}
</style>
