<script>
	import { PLAJAS } from '$lib/carta/escalas.js';
	// Rail de las jaces (causida de Romain, 2026-10-07, « panèl C ») : un rail
	// totjorn visible al bòrd de la carta, una icòna nomenada per familha. Un
	// clic dobrís lo tirador de la familha ; un segond clic sus la meteissa
	// icòna lo tampa (l'icòna se bolega pas). « Sus la carta » mòstra tot çò
	// qu'es afichat, per l'escantir d'un còp d'uèlh ; « Fons » règla lo fons
	// (fons « Contorns », occitan, natural, satellit, e colors) ; los elements
	// (vilas, noms, rius, relèu) son de jaces dins lors familhas.
	import { untrack, tick } from 'svelte';
	import { sonPapièr, sonsActius, gardarSons } from '$lib/carta/sons.js';
	import { fly, slide } from 'svelte/transition';
	import { LENGAS, esOccitan } from '$lib/carta/lengas.js';
	import { quintOut } from 'svelte/easing';

	let {
		familhas = [],
		visibility = $bindable({}),
		baseLayer = $bindable('estelas'),
		colors = $bindable({}),
		causits = $bindable([]),
		clar = false,
		lang = 'oc',
		esAdmin = false
	} = $props();

	const T = {
		oc: {
			rail: 'Jaces de la carta',
			sons: (on) => (on ? 'Sons de la carta : alucats' : 'Sons de la carta : amudits'),
			desplaçar: 'Desplaçar lo panèl (las sagetas tanben ; doble clic o tòca Origina : tornar a sa plaça)',
			reduire: 'Reduire lo panèl',
			enBas: 'Metre lo panèl en bas, a l’orizontala',
			costat: 'Metre lo panèl sul costat',
			desplegar: 'Desplegar lo panèl',
			sus: 'Sus la carta',
			fons: 'Fons',
			tampar: 'Tampar',
			aVenir: 'A venir',
			indisponible: 'Indisponibla per ara',
			disponiblas: (n) => `${n} ${n > 1 ? 'jaces disponiblas' : 'jaça disponibla'}`,
			venir: (n) => `${n} a venir`,
			res: 'Pas cap de jaça : la carta es nusa. Causissètz-ne una dins una familha.',
			afichadas: (n) => `${n} ${n > 1 ? 'jaces afichadas' : 'jaça afichada'}`,
			fonsCarta: 'Fons de carta',
			basemaps: { estelas: 'Contorns', occitan: 'Occitan', natural: 'Natural', satellite: 'Satellit' },
			colors: 'Colors',
			colorDe: { costa: 'Trach de còsta', riu: 'Rius', estela: 'Vilas e noms', corba: 'Relèu' },
			sonqueContorns: 'Sonque los contorns',
			anullar: 'Anullar',
			anullarTitol: 'Anullar la darrièra manipulacion (Ctrl+Z)',
			netejar: 'Netejar la carta',
			netejarTitol: 'Escantir totas las jaces e tornar partir de zèro',
			sonqueFons: 'Sonque sul fons Contorns',
			totTornar: 'Tot tornar',
			colorsTema: 'Colors del tèma',
			color: (n) => `Color : ${n}`,
			dialecteTotes: 'Totes',
			causirDial: 'Causir un o mantun dialècte',
			causirLenga: (l) => `Causir una zòna ${/^[aeiouàèéòóíú]/i.test(l) ? "de l'" : "del "}${l}`,
			admin: "Modificar dins l'admin"
		},
		fr: {
			rail: 'Couches de la carte',
			sons: (on) => (on ? 'Sons de la carte : activés' : 'Sons de la carte : coupés'),
			desplaçar: 'Déplacer le panneau (flèches aussi ; double-clic ou touche Origine : le remettre en place)',
			reduire: 'Réduire le panneau',
			enBas: 'Mettre le panneau en bas, à l’horizontale',
			costat: 'Mettre le panneau sur le côté',
			desplegar: 'Déplier le panneau',
			sus: 'Sur la carte',
			fons: 'Fond',
			tampar: 'Fermer',
			aVenir: 'À venir',
			indisponible: "Indisponible pour l'instant",
			disponiblas: (n) => `${n} ${n > 1 ? 'couches disponibles' : 'couche disponible'}`,
			venir: (n) => `${n} à venir`,
			res: 'Aucune couche : la carte est nue. Choisissez-en une dans une famille.',
			afichadas: (n) => `${n} ${n > 1 ? 'couches affichées' : 'couche affichée'}`,
			fonsCarta: 'Fond de carte',
			basemaps: { estelas: 'Contours', occitan: 'Occitan', natural: 'Naturel', satellite: 'Satellite' },
			colors: 'Couleurs',
			colorDe: { costa: 'Trait de côte', riu: 'Rivières', estela: 'Villes et noms', corba: 'Relief' },
			sonqueContorns: 'Seulement les contours',
			anullar: 'Annuler',
			anullarTitol: 'Annuler la dernière manipulation (Ctrl+Z)',
			netejar: 'Vider la carte',
			netejarTitol: 'Éteindre toutes les couches et repartir de zéro',
			sonqueFons: 'Seulement sur le fond Contours',
			totTornar: 'Tout remettre',
			colorsTema: 'Couleurs du thème',
			color: (n) => `Couleur : ${n}`,
			dialecteTotes: 'Tous',
			causirDial: 'Choisir un ou plusieurs dialectes',
			causirLenga: (l) => `Choisir une zone ${/^[aeiouàâéèêîôû]/i.test(l) ? "de l'" : "du "}${l}`,
			admin: "Modifier dans l'admin"
		}
	};
	let tx = $derived(T[lang] ?? T.oc);

	// Icònas de las familhas (traç fin, color del tèxte)
	const IC = {
		sus: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
		lenga: '<path d="M4 5h16v10H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
		administracion: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"/>',
		cultura: '<path d="M4 6c3-1 5-1 8 1 3-2 5-2 8-1v12c-3-1-5-1-8 1-3-2-5-2-8-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 7v12" stroke="currentColor" stroke-width="1.4"/>',
		istoria: '<path d="M5 20h14M6 20V10M10 20V10M14 20V10M18 20V10M4 10h16L12 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
		natura: '<path d="M3 19l6-10 4 6 3-4 5 8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="17" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>',
		// (Tabler Icons « language », MIT)
		lengas: '<path d="M4 5h7M9 3v2c0 4.4-2.2 8-5 8M5 9c0 2.1 3 3.9 6.7 4M12 20l4-9 4 9M19.1 18h-6.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
		fons: '<path d="M12 4l9 5-9 5-9-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
	};

	// Colors dels dialèctes (las de la carta, colaDonadas.js)
	const DIAL = $derived(
		clar
			? { gas: '#6a45d0', lan: '#c2185b', pro: '#e573ad', lem: '#e07b00', auv: '#a8321a', viv: '#c9a227' }
			: { gas: '#9d7dff', lan: '#ff3f86', pro: '#ffb0dc', lem: '#ffa22e', auv: '#e8482a', viv: '#ffe27a' }
	);
	// Las autras lengas (lengas.js) : lors pastilhas e lors colors
	// la color d'una pastilha d'una lenga (sa color de dialècte segon lo tèma)
	const colorPastilha = (id, k) => LENGAS[id].dial[clar ? 'clar' : 'sorne'][k] ?? LENGAS[id].color[clar ? 'clar' : 'sorne'];
	const NOMS_DIAL = [
		['gas', 'gascon', 'gascon'],
		['lan', 'lengadocian', 'languedocien'],
		['pro', 'provençal', 'provençal'],
		['lem', 'lemosin', 'limousin'],
		['auv', 'auvernhat', 'auvergnat'],
		['viv', 'vivaroaupenc', 'vivaro-alpin']
	];

	// Apercebuts de las jaces, dessenhats coma sus la carta
	const apercebut = (id) => {
		const d = DIAL;
		const A = {
			frontiera: '<path d="M4 26 C 16 10, 30 30, 48 8" fill="none" stroke="#e0612f" stroke-width="2.4" stroke-dasharray="0.1 5" stroke-linecap="round"/>',
			dialectes: NOMS_DIAL.map(([k], i) => `<rect x="${i * 9}" y="0" width="9.5" height="36" fill="${d[k]}" opacity=".75"/>`).join(''),
			creissent: '<defs><pattern id="ap-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.6" height="5" fill="#e0612f"/></pattern></defs><path d="M0 22 Q 26 4 52 20 V 36 H 0z" fill="url(#ap-h)" opacity=".8"/>',
			departaments: '<rect x="3" y="4" width="14" height="13" fill="#e0612f" opacity=".85"/><rect x="19" y="4" width="14" height="13" fill="#e0612f" opacity=".5"/><rect x="35" y="4" width="14" height="13" fill="#e0612f" opacity=".22"/><rect x="3" y="19" width="22" height="13" fill="#e0612f" opacity=".5"/><rect x="27" y="19" width="22" height="13" fill="#e0612f" opacity=".85"/>',
			limsi: '<circle cx="14" cy="18" r="3" fill="#3e7cb1"/><path d="M20 12a8 8 0 0 1 0 12M24 8a13 13 0 0 1 0 20" fill="none" stroke="#3e7cb1" stroke-width="1.6"/>',
			regions: '<path d="M6 8 L22 5 L30 14 L46 10 L48 30 L24 32 L8 28z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3" opacity=".8"/>',
			despartaments: '<path d="M2 12 L18 8 L20 20 L4 24z M18 8 L34 10 L36 22 L20 20 M34 10 L50 6 L50 20 L36 22 M4 24 L20 20 L24 34 M20 20 L36 22 L40 34" fill="none" stroke="currentColor" stroke-width=".9" opacity=".6"/>',
			comunas: '<path d="M2 6 L18 4 L22 16 L6 19z M18 4 L34 7 L32 18 L22 16 M34 7 L50 5 L49 17 L32 18 M6 19 L22 16 L20 32 L4 31z M22 16 L32 18 L38 32 L20 32 M32 18 L49 17 L50 31 L38 32" fill="none" stroke="currentColor" stroke-width=".8" stroke-dasharray="3 2" opacity=".6"/>',
			lieusInteres: '<circle cx="12" cy="14" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="30" cy="24" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/><circle cx="42" cy="10" r="3.4" fill="#eeaf34" stroke="#a5342a" stroke-width="1.2"/>',
			librarias: '<path d="M14 10h10v18H14zM26 10h10v18H26z" fill="none" stroke="#eeaf34" stroke-width="1.5"/><path d="M17 15h4M29 15h4" stroke="#eeaf34" stroke-width="1.2"/>',
			calandretas: '<path d="M12 28V16l14-7 14 7v12z" fill="none" stroke="#eeaf34" stroke-width="1.5" stroke-linejoin="round"/><path d="M23 28v-6h6v6" stroke="#eeaf34" stroke-width="1.4" fill="none"/>',
			festas: '<path d="M26 7l3 7 7 .6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7L15 14.6l7-.6z" fill="#eeaf34" opacity=".85"/>',
			provincias: '<path d="M2 12 Q 18 3 30 12 T 50 9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 3" opacity=".75"/><path d="M4 29 Q 20 20 32 27 T 50 23" fill="none" stroke="currentColor" stroke-width=".9" opacity=".55"/>',
			paises: '<circle cx="14" cy="16" r="9" fill="#c9a46a" opacity=".35"/><circle cx="34" cy="20" r="11" fill="#c9a46a" opacity=".25"/>',
			isolas: '<circle cx="18" cy="18" r="6" fill="none" stroke="#e0612f" stroke-width="1.6"/><circle cx="36" cy="14" r="4" fill="none" stroke="#e0612f" stroke-width="1.6"/>',
			parcs: '<path d="M6 30 Q 10 8 26 13 T 48 19 L 45 32 Z" fill="#86c48c" fill-opacity=".22" stroke="#86c48c" stroke-width="1.2"/>',
			massis: '<path d="M8 27 l5 -9 l5 9z" fill="currentColor" opacity=".85"/><text x="34" y="16" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="8.5" letter-spacing="1.4" fill="currentColor" opacity=".75">AUBRAC</text>',
			// las lengas : lors colors, o lor nom dins la lenga (las de venir)
			...Object.fromEntries(
				Object.keys(LENGAS).map((id) => {
					const dz = LENGAS[id].pastilhas.filter(({ k }) => LENGAS[id].dial.sorne[k]);
					const w = 52 / dz.length;
					return [id, dz.map(({ k }, i) => `<rect x="${(i * w).toFixed(1)}" y="0" width="${(w + 0.5).toFixed(1)}" height="36" fill="${colorPastilha(id, k)}" opacity=".75"/>`).join('')];
				})
			),
			...Object.fromEntries(
				[['basc', 'EUSKARA'], ['breton', 'BREZHONEG'],['alsacian', 'ELSÄSSISCH'], ['flamenc', 'VLAEMSCH'], ['cors', 'CORSU'], ['oil', 'GALLO']].map(([k, t]) => [
					k,
					`<text x="26" y="22" text-anchor="middle" font-family="Luciole, sans-serif" font-weight="600" font-size="7" letter-spacing="1" fill="currentColor">${t}</text>`
				])
			),
			lengasFranca: '<text x="26" y="21" text-anchor="middle" font-family="Luciole, sans-serif" font-weight="600" font-size="7.5" letter-spacing="1.2" fill="currentColor">BREZHONEG</text><text x="26" y="30" text-anchor="middle" font-family="Luciole, sans-serif" font-size="6" letter-spacing="0.8" fill="currentColor" opacity=".6">EUSKARA</text>',
			bacins: '<path d="M26 34 V 20 M26 20 L14 8 M26 20 L40 10 M20 14 L12 18 M34 14 L44 18" stroke="#eeaf34" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
			estelas: '<circle cx="10" cy="12" r="1.6" fill="currentColor"/><circle cx="24" cy="24" r="2.2" fill="currentColor"/><circle cx="38" cy="10" r="1.3" fill="currentColor"/><circle cx="44" cy="27" r="1.6" fill="currentColor"/><circle cx="17" cy="29" r="1" fill="currentColor"/>',
			nomsVilas: '<text x="26" y="23" text-anchor="middle" font-family="Limelight, Georgia, serif" font-size="13" fill="currentColor">Tolosa</text>',
			rius: '<path d="M2 28 C 14 18, 22 30, 32 18 S 46 8, 52 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
			nomsRius: '<text x="26" y="23" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="14" fill="currentColor">Garona</text>',
			corbas: '<path d="M2 30 Q 20 12 50 26 M6 34 Q 24 18 52 32 M4 24 Q 20 6 48 18" fill="none" stroke="currentColor" stroke-width=".8" opacity=".6"/>',
			costa: '<path d="M30 0 C 26 10, 34 14, 28 22 S 20 32, 26 36" fill="none" stroke="currentColor" stroke-width="1" opacity=".75"/>'
		};
		// las jaces del fons Contorns reprenon los apercebuts de lors elements
		const ALIAS = { vilas: 'estelas', toponimia: 'nomsVilas' };
		return A[ALIAS[id] ?? id] ?? '';
	};

	const RAIL = ['sus', 'lenga', 'administracion', 'cultura', 'istoria', 'natura', 'lengas'];
	let dobert = $state(null);
	// los tèmas de « Sus la carta » enrotlats (demanda de Romain, 2026-10-09)
	let enrotlats = $state([]);
	const virarTèma = (id) => (enrotlats = enrotlats.includes(id) ? enrotlats.filter((x) => x !== id) : [...enrotlats, id]);
	const alternar = (id) => {
		dobert = dobert === id ? null : id;
		if (dobert) plaçarTirador();
	};
	// en tampant un tirador, lo focus torna al boton del rail que l'aviá
	// dobèrt (al clavièr, se perdiá al començament de la pagina)
	let botons = $state({});
	async function tamparTirador() {
		const id = dobert;
		dobert = null;
		await tick();
		botons[id]?.focus();
	}

	// Lo rail se pòt desplaçar (una encòca per lo prene) e reduire (retorn de
	// Romain) ; per defaut a mièg nautor, pus luènh del capçal. Sa plaça e son
	// estat demòran d'una visita a l'autra, sus aqueste navigador sonque.
	const CLAU_RAIL = 'lo-ligam-carta-rail';
	const clampR = (v, a, b) => Math.max(a, Math.min(b, v));
	// lo bas del capçal (variabla --cap-bas de la pagina) : lo rail e los
	// tiradors demòran dejós, ont se pòdon totjorn prene
	const capBas = (p) => parseFloat(getComputedStyle(p).getPropertyValue('--cap-bas')) || 0;
	function borner(pos) {
		const p = railEl?.offsetParent;
		if (!p || !pos) return pos;
		const pr = p.getBoundingClientRect();
		return {
			x: clampR(pos.x, 8, pr.width - railEl.offsetWidth - 8),
			y: clampR(pos.y, capBas(p) + 8, pr.height - railEl.offsetHeight - 8)
		};
	}
	let railEl = $state(null);
	let railPos = $state(null); // { x, y } en px dins la carta ; null = plaça per defaut
	let reduch = $state(false);
	let posT = $state(null); // plaça del tirador, seguís lo rail
	let tiratge = null;
	// lo panèl sul costat (vertical) o en bas a l'orizontala (causida de Romain)
	let orizontal = $state(false);
	$effect(() => {
		try {
			const s = JSON.parse(localStorage.getItem(CLAU_RAIL) ?? 'null');
			if (s) {
				railPos = s.pos ?? null;
				reduch = !!s.reduch;
				orizontal = !!s.orizontal;
			}
		} catch {}
	});
	// en bas, la barra leva l'escala, lo zoom e las fonts de la carta (classa
	// sul contenidor : sa variabla --barra-bas)
	$effect(() => {
		const o = orizontal;
		railEl?.offsetParent?.classList.toggle('jaces-orizontalas', o);
	});
	// la plaça gardada es tornada borner a la talha de la fenèstra (una
	// fenèstra mai pichona podiá l'amagar)
	$effect(() => {
		const p = railEl?.offsetParent;
		if (!p) return;
		const ro = new ResizeObserver(() => {
			// (sonque pel panèl vertical d'un ecran larg : en bas, la plaça gardada
			// servís pas e se deu pas tocar)
			if (railPos && !orizontal && p.clientWidth > 600) railPos = borner(railPos);
			if (dobert) plaçarTirador();
		});
		ro.observe(p);
		return () => ro.disconnect();
	});
	const gardarRail = () => {
		try {
			localStorage.setItem(CLAU_RAIL, JSON.stringify({ pos: railPos, reduch, orizontal }));
		} catch {}
	};
	function alternarOrientacion() {
		orizontal = !orizontal;
		dobert = null;
		gardarRail();
	}
	// lo tirador s'alanda a costat del rail, del costat ont i a de plaça ; en
	// bas, al dessús de la barra
	function plaçarTirador() {
		const p = railEl?.offsetParent;
		if (!p) return;
		const r = railEl.getBoundingClientRect(),
			pr = p.getBoundingClientRect();
		const x = r.left - pr.left,
			y = r.top - pr.top,
			larg = Math.min(336, pr.width - r.width - 32);
		if (orizontal) {
			// (ancorat pel bas : just al dessús de la barra, quina que siá sa nautor)
			posT = { x: clampR(x, 8, pr.width - 344), bas: pr.height - y + 12, h: Math.max(160, y - 130) };
			return;
		}
		const drecha = x + r.width / 2 > pr.width / 2;
		const naut = capBas(p) + 8;
		const top = clampR(y, naut, Math.max(naut, pr.height - 420));
		posT = { x: drecha ? x - larg - 12 : x + r.width + 12, y: top, h: pr.height - top - 16 };
	}
	function prene(e) {
		if (e.button !== 0 || !railEl?.offsetParent) return;
		const r = railEl.getBoundingClientRect();
		tiratge = { dx: e.clientX - r.left, dy: e.clientY - r.top, pr: railEl.offsetParent.getBoundingClientRect() };
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function tirar(e) {
		if (!tiratge) return;
		const { dx, dy, pr } = tiratge;
		railPos = borner({ x: e.clientX - pr.left - dx, y: e.clientY - pr.top - dy });
		if (dobert) plaçarTirador();
	}
	function daissar() {
		if (!tiratge) return;
		tiratge = null;
		gardarRail();
	}
	// al clavièr : las sagetas desplaçan lo rail
	function clavièrEncòca(e) {
		if (e.key === 'Home') {
			e.preventDefault();
			return railPerDefaut();
		}
		const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key];
		if (!d || !railEl?.offsetParent) return;
		e.preventDefault();
		const r = railEl.getBoundingClientRect(),
			pr = railEl.offsetParent.getBoundingClientRect();
		railPos = borner({ x: r.left - pr.left + d[0], y: r.top - pr.top + d[1] });
		gardarRail();
		if (dobert) plaçarTirador();
	}
	function railPerDefaut() {
		railPos = null;
		gardarRail();
		if (dobert) requestAnimationFrame(plaçarTirador);
	}
	// Plegar o desplegar lo panèl coma un papièr (retorn de Romain : « une
	// animation très satisfaisante » e un bruch de papièr) : los botons se
	// viran un per un, del bas cap al naut, e lo panèl se sarra amb un pichon
	// rebond ; l'encòca demòra a sa plaça. Sens animacion se lo sistèma o
	// demanda (movement reduch).
	// los sons de la carta (papièr del panèl) : desactivables, memorizats
	let sons = $state(true);
	$effect(() => {
		sons = sonsActius();
	});
	function alternarSons() {
		sons = !sons;
		gardarSons(sons);
	}
	let plegant = false;
	async function alternarReduch() {
		if (plegant || !railEl) return;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const plegar = !reduch;
		sonPapièr(plegar);
		// lo panèl centrat se fixa ont es, que l'encòca bolegue pas
		if (!railPos && railEl.offsetParent) {
			const r = railEl.getBoundingClientRect(),
				pr = railEl.offsetParent.getBoundingClientRect();
			railPos = { x: r.left - pr.left, y: r.top - pr.top };
			await tick();
		}
		const cs = getComputedStyle(railEl);
		const hEncòca = () =>
			railEl.querySelector('.encòca').offsetHeight +
			['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((s, k) => s + parseFloat(cs[k]), 0);
		const plecs = () => [...railEl.querySelectorAll('.rail-b, .rail-sep')];
		const virar = (els, de, a, òrdre) =>
			els.forEach((el, i) =>
				el.animate(
					[
						{ transform: `perspective(260px) rotateX(${de}deg)`, opacity: de ? 0 : 1, transformOrigin: '50% 0' },
						{ transform: `perspective(260px) rotateX(${a}deg)`, opacity: a ? 0 : 1, transformOrigin: '50% 0' }
					],
					{ duration: 240, delay: òrdre(i, els.length) * 32, easing: de ? 'cubic-bezier(.2,.8,.3,1)' : 'cubic-bezier(.55,0,.75,.2)', fill: 'both' }
				)
			);
		if (plegar) {
			dobert = null;
			if (!calm) {
				plegant = true;
				const h0 = railEl.offsetHeight,
					h1 = hEncòca(),
					els = plecs();
				railEl.style.overflow = 'hidden';
				virar(els, 0, -95, (i, n) => n - 1 - i);
				await railEl.animate(
					[{ height: h0 + 'px' }, { height: h1 * 0.9 + 'px', offset: 0.86 }, { height: h1 + 'px' }],
					{ duration: 300 + els.length * 32, easing: 'cubic-bezier(.6,0,.3,1)' }
				).finished;
				els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
				railEl.style.overflow = '';
				plegant = false;
			}
			reduch = true;
		} else {
			const h1 = railEl.offsetHeight;
			reduch = false;
			await tick();
			// desplegat, lo panèl deu demorar dins la carta
			const pr = railEl.offsetParent?.getBoundingClientRect();
			if (pr && railPos) railPos = { ...railPos, y: Math.min(railPos.y, Math.max(8, pr.height - railEl.offsetHeight - 8)) };
			if (!calm) {
				plegant = true;
				const h0 = railEl.offsetHeight,
					els = plecs();
				railEl.style.overflow = 'hidden';
				virar(els, 95, 0, (i) => i);
				await railEl.animate(
					[{ height: h1 + 'px' }, { height: h0 * 1.03 + 'px', offset: 0.8 }, { height: h0 + 'px' }],
					{ duration: 320 + els.length * 32, easing: 'cubic-bezier(.2,.7,.3,1)' }
				).finished;
				els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
				railEl.style.overflow = '';
				plegant = false;
			}
		}
		gardarRail();
	}

	const totas = $derived(familhas.flatMap((f) => f.jaces));
	const actiu = (j) => j.estat === 'disponible' && (!j.fons || j.fons === baseLayer);
	const afichadas = $derived(totas.filter((j) => actiu(j) && visibility[j.id]));
	const familhaActiva = (f) => f.jaces.some((j) => actiu(j) && visibility[j.id]);
	const nomJ = (j) => (lang === 'oc' ? j.oc : (j.fr ?? j.oc));
	const notaJ = (j) =>
		j.estat === 'basa'
			? tx.indisponible
			: j.estat === 'disponible' && j.fons && j.fons !== baseLayer
				? tx.sonqueFons
				: ((lang === 'oc' ? j.nota_oc : (j.nota_fr ?? j.nota_oc)) ?? (actiu(j) ? null : tx.aVenir));
	// a quina escala la jaça se vei, escrich quand es cochada (demanda de
	// Romain, 2026-10-09 ; occitan de validar)
	const kmTèxt = (k) => (k < 1 ? k * 1000 + ' m' : String(k).replace('.', ',') + ' km');
	const escalaJ = (j) => {
		const pl = PLAJAS[j.id];
		if (!pl) return null;
		if (lang === 'oc') return pl[1] ? `Vesibla de ${kmTèxt(pl[0])} a ${kmTèxt(pl[1])}` : `Vesibla a partir de ${kmTèxt(pl[0])}`;
		return pl[1] ? `Visible de ${kmTèxt(pl[0])} à ${kmTèxt(pl[1])}` : `Visible à partir de ${kmTèxt(pl[0])}`;
	};
	const nomFam = (id) => {
		if (id === 'sus') return tx.sus;
		if (id === 'fons') return tx.fons;
		const f = familhas.find((x) => x.id === id);
		return f ? (lang === 'oc' ? f.oc : f.fr) : id;
	};

	// mots longs del rail : copats amb un tiret, pas al mièg d'una sillaba
	const cesura = (t) => t.replace(/^Adminis(tra)/, 'Adminis­$1');

	function bascular(id, on) {
		visibility[id] = on;
		// (una jaça escantida : sas zònas son pas pus causidas, las de las autras demòran)
		if (id === 'dialectes' && !on) causits = causits.filter((k) => !esOccitan(k));
		if (LENGAS[id] && !on) causits = causits.filter((k) => !k.startsWith(LENGAS[id].pref));
	}
	// Una pastilha de dialècte (o del Creissent) : aluca la jaça e apond la zòna
	// a la causida, o l'en leva se i èra (retorn de Romain : mantuna a l'encòp)
	function causirDial(k) {
		visibility.dialectes = true;
		causits = causits.includes(k) ? causits.filter((x) => x !== k) : [...causits, k];
	}

	// Una pastilha d'una autra lenga : aluca sa jaça e apond la zòna
	function causirLenga(id, k) {
		visibility[id] = true;
		const kod = LENGAS[id].pref + k;
		causits = causits.includes(kod) ? causits.filter((x) => x !== kod) : [...causits, kod];
	}

	// Colors del fons que l'internauta pòt cambiar, e lor valor de basa segon lo tèma
	const COLORS_FONS = ['costa', 'riu', 'estela', 'corba'];
	const APERCEBUT_COLOR = { costa: 'costa', riu: 'rius', estela: 'estelas', corba: 'corbas' };
	const colorBasa = (
		clar
			? { estela: '#6b3a22', riu: '#b06a14', corba: '#8a5a2b', costa: '#2e1d14' }
			: { estela: '#f5ead8', riu: '#eeaf34', corba: '#eeaf34', costa: '#f5ead8' }
	);
	// Sonque los contorns : la còsta e la frontièra de la lenga, res mai
	function sonqueContorns() {
		for (const j of totas) if (visibility[j.id] && j.id !== 'frontiera') visibility[j.id] = false;
		visibility.frontiera = true;
		causits = [];
	}
	// Tot tornar : las jaces per defaut del catalògue
	function totTornar() {
		for (const j of totas) visibility[j.id] = !!j.defaut;
		causits = [];
	}
	// Istoric de las manipulacions (demanda de Romain) : cada cambiament de la
	// carta (jaces, dialècte causit, fons, colors) es gardat, per lo poder
	// anullar ; tant del panèl coma d'un clic sus la carta
	let istoric = $state([]);
	let darrièr = null,
		anullant = false,
		pret = false; // l'istoric comença al primièr gèst (pas al cargament de la basa)
	$effect(() => {
		const estat = JSON.stringify({ v: $state.snapshot(visibility), d: causits, b: baseLayer, c: $state.snapshot(colors) });
		untrack(() => {
			if (pret && darrièr && estat !== darrièr && !anullant) istoric = [...istoric.slice(-39), darrièr];
			anullant = false;
			darrièr = estat;
		});
	});
	function anullar() {
		const e = istoric.at(-1);
		if (!e) return;
		istoric = istoric.slice(0, -1);
		anullant = true;
		const s = JSON.parse(e);
		for (const k of Object.keys({ ...visibility, ...s.v })) visibility[k] = !!s.v[k];
		causits = Array.isArray(s.d) ? s.d : s.d ? [s.d] : [];
		baseLayer = s.b;
		colors = s.c;
	}
	// Netejar : totas las jaces escantidas, sens dialècte causit (lo fons e las
	// colors demòran) ; anullable
	function netejar() {
		for (const j of totas) if (visibility[j.id]) visibility[j.id] = false;
		causits = [];
	}
	function onKey(e) {
		pret = true;
		if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !/^(INPUT|TEXTAREA)$/.test(e.target?.tagName ?? '')) {
			if (istoric.length) {
				e.preventDefault();
				anullar();
			}
			return;
		}
		if (e.key === 'Escape' && dobert) {
			if (document.getElementById('tirador-jaces')?.contains(document.activeElement)) tamparTirador();
			else dobert = null;
		}
	}
</script>

<svelte:window onkeydown={onKey} onpointerdown={() => (pret = true)} />

<nav
	class="rail"
	class:desplaçat={!!railPos && !orizontal}
	class:reduch
	class:orizontal
	aria-label={tx.rail}
	bind:this={railEl}
	style:--rail-x={railPos ? railPos.x + 'px' : null}
	style:--rail-y={railPos ? railPos.y + 'px' : null}
>
	<div class="encòca">
		<button
			type="button"
			class="prene"
			aria-label={tx.desplaçar}
			title={tx.desplaçar}
			onpointerdown={prene}
			onpointermove={tirar}
			onpointerup={daissar}
			onpointercancel={daissar}
			onkeydown={clavièrEncòca}
			ondblclick={railPerDefaut}
		><span aria-hidden="true"></span></button>
		<button type="button" class="reduire" aria-expanded={!reduch} aria-label={reduch ? tx.desplegar : tx.reduire} title={reduch ? tx.desplegar : tx.reduire} onclick={alternarReduch}>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d={reduch ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'} /></svg>
		</button>
		<button
			type="button"
			class="reduire"
			aria-pressed={orizontal}
			aria-label={orizontal ? tx.costat : tx.enBas}
			title={orizontal ? tx.costat : tx.enBas}
			onclick={alternarOrientacion}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				>{#if orizontal}<path d="M5 4v16M5 4h4v16H5" />{:else}<path d="M4 19h16M4 19v-4h16v4" />{/if}</svg
			>
		</button>
	</div>
	{#each RAIL as id (id)}
		<button
			type="button"
			class="rail-b"
			bind:this={botons[id]}
			aria-expanded={dobert === id}
			aria-controls="tirador-jaces"
			onclick={() => alternar(id)}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC[id]}</svg>
			<span class="lib">{cesura(nomFam(id))}</span>
			{#if id === 'sus' && afichadas.length}
				<span class="compte" aria-label={tx.afichadas(afichadas.length)}>{afichadas.length}</span>
			{:else if id !== 'sus' && familhas.find((f) => f.id === id) && familhaActiva(familhas.find((f) => f.id === id))}
				<span class="punt" aria-hidden="true"></span>
			{/if}
		</button>
	{/each}
	<span class="rail-sep" aria-hidden="true"></span>
	<button type="button" class="rail-b" bind:this={botons.fons} aria-expanded={dobert === 'fons'} aria-controls="tirador-jaces" onclick={() => alternar('fons')}>
		<svg viewBox="0 0 24 24" aria-hidden="true">{@html IC.fons}</svg>
		<span class="lib">{tx.fons}</span>
	</button>
</nav>

{#if dobert}
	<section
		id="tirador-jaces"
		class="tirador"
		aria-label={nomFam(dobert)}
		style:--tir-x={posT ? posT.x + 'px' : null}
		style:--tir-y={posT ? posT.y + 'px' : null}
		style:--tir-h={posT ? posT.h + 'px' : null}
		style:--tir-bas={posT?.bas != null ? posT.bas + 'px' : null}
		class:amont={orizontal}
		transition:fly={orizontal ? { y: 14, duration: 260, easing: quintOut } : { x: -14, duration: 260, easing: quintOut }}
	>
		<header>
			<h2>{nomFam(dobert)}</h2>
			<button type="button" class="tampar" onclick={tamparTirador} aria-label={tx.tampar}>×</button>
		</header>

		{#if dobert === 'sus'}
			<p class="sota">{tx.afichadas(afichadas.length)} · {tx.fonsCarta.toLowerCase()} : {tx.basemaps[baseLayer] ?? baseLayer}</p>
			<div class="botons botons-sus">
				<button type="button" class="boton" onclick={anullar} disabled={!istoric.length} title={tx.anullarTitol}>
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
					{tx.anullar}
				</button>
				<button type="button" class="boton" onclick={netejar} disabled={!afichadas.length} title={tx.netejarTitol}>{tx.netejar}</button>
			</div>
			{#if !afichadas.length}
				<p class="res">{tx.res}</p>
			{/if}
			<!-- la legenda de sa carta, rengada per tematica (demanda de Romain, 2026-10-09) -->
			{#each familhas.filter((f) => f.jaces.some((j) => afichadas.includes(j))) as f (f.id)}
				{@const js = f.jaces.filter((j) => afichadas.includes(j))}
				{@const dobèrt = !enrotlats.includes(f.id)}
				<button type="button" class="titolet tèma" aria-expanded={dobèrt} onclick={() => virarTèma(f.id)}>
					{nomFam(f.id)}<span class="tèma-n">{js.length}</span>
					<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
				</button>
				{#if dobèrt}
					<div class="tèma-cos" transition:slide={{ duration: 220 }}>
						{#each js as j (j.id)}
							{@render linha(j)}
						{/each}
					</div>
				{/if}
			{/each}
		{:else if dobert === 'fons'}
			<p class="titolet">{tx.fonsCarta}</p>
			<div class="fonses" role="radiogroup" aria-label={tx.fonsCarta}>
				{#each ['estelas', 'occitan', 'natural', 'satellite'] as k (k)}
					<button
						type="button"
						role="radio"
						aria-checked={baseLayer === k}
						class="fons"
						onclick={() => (baseLayer = k)}
					>
						<i class="fons-{k}"></i>{tx.basemaps[k]}
					</button>
				{/each}
			</div>
			<p class="titolet">{tx.colors}</p>
			{#each COLORS_FONS as k (k)}
				<div class="linha">
					<span class="apercebut" style:color={colors[k] ?? colorBasa[k]}
						><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(APERCEBUT_COLOR[k])}</svg></span
					>
					<div class="cos"><b>{tx.colorDe[k]}</b></div>
					<label class="mostra" title={tx.color(tx.colorDe[k])}>
						<input
							type="color"
							value={colors[k] ?? colorBasa[k]}
							oninput={(e) => (colors = { ...colors, [k]: e.currentTarget.value })}
							aria-label={tx.color(tx.colorDe[k])}
						/>
					</label>
				</div>
			{/each}
			<div class="botons">
				<button type="button" class="boton" onclick={sonqueContorns}>{tx.sonqueContorns}</button>
				<button type="button" class="boton" onclick={totTornar}>{tx.totTornar}</button>
				<button type="button" class="boton" aria-pressed={sons} onclick={alternarSons}>{tx.sons(sons)}</button>
				{#if Object.keys(colors).length}
					<button type="button" class="boton" onclick={() => (colors = {})}>{tx.colorsTema}</button>
				{/if}
			</div>
		{:else}
			{@const f = familhas.find((x) => x.id === dobert)}
			{#if f}
				{@const dispo = f.jaces.filter(actiu).length}
				<p class="sota">{tx.disponiblas(dispo)}{f.jaces.length - dispo ? ' · ' + tx.venir(f.jaces.length - dispo) : ''}</p>
				{#each f.jaces as j (j.id)}
					{@render linha(j)}
				{/each}
			{/if}
		{/if}

		{#if esAdmin}
			<a class="admin" href="/admin/carta">{tx.admin} →</a>
		{/if}
	</section>
{/if}

{#snippet linha(j)}
	<div class="linha" class:escantida={!actiu(j)}>
		<span class="apercebut"><svg viewBox="0 0 52 36" preserveAspectRatio="none" aria-hidden="true">{@html apercebut(j.id)}</svg></span>
		<div class="cos">
			<b>{nomJ(j)}</b>
			{#if notaJ(j)}<small>{notaJ(j)}</small>{/if}
			{#if visibility[j.id] && actiu(j) && escalaJ(j)}<small class="escala-j">{escalaJ(j)}</small>{/if}
			{#if j.id === 'dialectes' && actiu(j)}
				<div class="pastilhas" role="group" aria-label={tx.causirDial}>
					{#each NOMS_DIAL as [k, oc, fr] (k)}
						<button
							type="button"
							class="pastilha"
							aria-pressed={causits.includes(k)}
							onclick={() => causirDial(k)}
						><i style:background={DIAL[k]}></i>{lang === 'oc' ? oc : fr}</button>
					{/each}
					<button type="button" class="pastilha" aria-pressed={causits.includes('cro')} onclick={() => causirDial('cro')}
						><i class="cro"></i>{lang === 'oc' ? 'creissent' : 'croissant'}</button
					>
					{#if causits.some(esOccitan)}
						<button type="button" class="pastilha totes" onclick={() => (causits = causits.filter((k) => !esOccitan(k)))}>{tx.dialecteTotes}</button>
					{/if}
				</div>
			{/if}
			{#if LENGAS[j.id] && actiu(j)}
				{@const lg = LENGAS[j.id]}
				<div class="pastilhas" role="group" aria-label={tx.causirLenga(lang === 'fr' ? lg.nom.fr : lg.nom.oc)}>
					<!-- los noms dins la lenga ; l'occitan (o lo francés) en infobulla -->
					{#each lg.pastilhas as { k, oc, fr, ...q } (k)}
						{@const apart = !!lg.apart?.[k]}
						<button
							type="button"
							class="pastilha"
							class:apart
							lang={lg.lang}
							title={lang === 'oc' ? oc : fr}
							aria-pressed={causits.includes(lg.pref + k)}
							onclick={() => causirLenga(j.id, k)}
						><i class:apart style:background={apart ? null : colorPastilha(j.id, k)}></i>{q[lg.lang] ?? q.ca}</button>
					{/each}
					{#if causits.some((k) => k.startsWith(lg.pref))}
						<button type="button" class="pastilha totes" onclick={() => (causits = causits.filter((k) => !k.startsWith(lg.pref)))}
							>{tx.dialecteTotes}</button
						>
					{/if}
				</div>
			{/if}
		</div>
		<button
			type="button"
			class="basc"
			role="switch"
			aria-checked={actiu(j) && !!visibility[j.id]}
			aria-label={nomJ(j)}
			disabled={!actiu(j)}
			onclick={() => bascular(j.id, !visibility[j.id])}
		></button>
	</div>
{/snippet}

<style>
	/* Lo rail : verre sombre (o crema en tèma clar), al bòrd esquèrra, jos lo
	   capçal ; s'arrèsta abans la bossòla */
	.rail {
		position: absolute;
		z-index: 1010; /* dessús la barra de recèrca (1000) */
		/* per defaut a mièg nautor, un pauc pus bas (retorn de Romain : collat al
		   capçal, « ça fait trop cliché ») ; desplaçable per son encòca */
		top: var(--rail-y, calc(50% + 2rem));
		left: var(--rail-x, var(--marge, 1rem));
		transform: translateY(-50%);
		width: 4.6rem;
		max-height: calc(100% - 9rem);
		overflow-y: auto;
		scrollbar-width: none;
		display: grid;
		/* (la colomna despassa pas jamai lo panèl : los noms longs passan a la
		   linha en luòc d'èsser copats, retorn de Romain) */
		grid-template-columns: minmax(0, 1fr);
		gap: 2px;
		padding: 6px 5px;
		background: color-mix(in srgb, var(--t-fons-2) 90%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
	}
	.rail.desplaçat {
		transform: none;
	}
	/* l'encòca : de que prene lo panèl, e lo boton per lo reduire */
	/* (l'encòca e sos dos botons tenon dins la largor del panèl) */
	.encòca {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0;
		padding: 0 0 3px;
	}
	.prene {
		flex: 1;
		min-width: 0;
		height: 18px;
		padding: 0;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 8px;
		background: none;
		cursor: grab;
		touch-action: none;
	}
	.prene:active {
		cursor: grabbing;
	}
	.prene span {
		width: 16.5px;
		height: 6px;
		background: radial-gradient(circle, var(--t-tinta-2) 1.2px, transparent 1.6px) 0 0 / 5.5px 3px;
		opacity: 0.7;
	}
	.prene:hover span,
	.prene:focus-visible span {
		opacity: 1;
	}
	.reduire {
		flex: 0 0 auto;
		width: 19px;
		height: 18px;
		padding: 0;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 6px;
		background: none;
		color: var(--t-tinta-2);
		cursor: pointer;
	}
	.reduire svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.prene:focus-visible,
	.reduire:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 1px;
	}
	.rail.reduch .rail-b,
	.rail.reduch .rail-sep {
		display: none;
	}
	.rail.reduch .encòca {
		padding-bottom: 0;
	}
	.rail-b {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 4px;
		padding: 9px 2px 7px;
		border: 0;
		border-radius: 12px;
		background: none;
		color: var(--t-tinta-2);
		font: 400 10.5px/1.15 var(--font-body);
		text-align: center;
		cursor: pointer;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.rail-b svg {
		width: 22px;
		height: 22px;
	}
	.rail-b:hover {
		color: var(--t-tinta);
		background: color-mix(in srgb, var(--t-tinta) 6%, transparent);
	}
	.rail-b[aria-expanded='true'] {
		color: var(--t-aur-clar);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.rail-b:focus-visible,
	.tirador button:focus-visible,
	.tirador input:focus-visible {
		outline: 2px solid var(--t-aur);
		outline-offset: 2px;
	}
	.lib {
		hyphens: manual;
	}
	.punt {
		position: absolute;
		top: 7px;
		right: 13px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--t-terra-viu);
	}
	.compte {
		position: absolute;
		top: 4px;
		right: 8px;
		min-width: 17px;
		height: 17px;
		padding: 0 4px;
		border-radius: 9px;
		background: var(--t-terra-viu);
		color: var(--t-fons);
		font: 700 10px/17px var(--font-body);
	}
	.rail-sep {
		height: 1px;
		margin: 4px 10px;
		background: var(--t-linha);
	}

	/* Lo tirador, a costat del rail */
	.tirador {
		position: absolute;
		z-index: 1010;
		/* a costat del rail, ont que siá (plaçat per plaçarTirador) */
		top: var(--tir-y, 7.2rem);
		left: var(--tir-x, calc(var(--marge, 1rem) + 5.2rem));
		width: min(21rem, calc(100% - var(--marge, 1rem) - 6.2rem));
		max-height: var(--tir-h, calc(100% - 7.2rem - 4rem));
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--t-linha) transparent;
		padding: 1rem 1.05rem 1.1rem;
		background: color-mix(in srgb, var(--t-fons-2) 93%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid var(--t-linha);
		border-radius: 18px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		color: var(--t-tinta);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}
	h2 {
		margin: 0;
		font: 400 1.45rem/1.1 var(--font-heading);
	}
	.tampar {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--t-linha);
		border-radius: 50%;
		background: none;
		color: var(--t-aur-clar);
		font-size: 1.1rem;
		cursor: pointer;
	}
	.sota {
		margin: 0.2rem 0 0.6rem;
		font-size: 0.76rem;
		color: var(--t-tinta-2);
	}
	.res {
		margin: 0.4rem 0;
		font-size: 0.85rem;
		color: var(--t-tinta-2);
	}
	.titolet {
		margin: 0.9rem 0 0.45rem;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--t-tinta-2);
	}
	/* un tèma de la legenda : son títol l'enròtla o lo desròtla */
	.titolet.tèma {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		padding: 0.25rem 0;
		background: none;
		border: 0;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
	}
	.titolet.tèma:hover,
	.titolet.tèma:focus-visible {
		color: var(--t-aur);
	}
	.titolet.tèma svg {
		width: 0.8rem;
		height: 0.8rem;
		transition: transform 0.2s;
	}
	.titolet.tèma[aria-expanded='false'] svg {
		transform: rotate(-90deg);
	}
	.tèma-cos > .linha:first-child {
		border-top: 0;
	}
	.tèma-n {
		margin-left: auto;
		letter-spacing: 0;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		.titolet.tèma svg {
			transition: none;
		}
	}
	.linha {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.7rem;
		align-items: center;
		padding: 0.55rem 0;
		border-top: 1px solid var(--t-linha);
	}
	.linha.escantida {
		opacity: 0.55;
	}
	.apercebut {
		display: block;
		width: 52px;
		height: 36px;
		border-radius: 8px;
		overflow: hidden;
		background: var(--t-fons);
		border: 1px solid var(--t-linha);
		color: var(--t-tinta);
	}
	.apercebut svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.cos {
		min-width: 0;
	}
	.cos b {
		display: block;
		font-size: 0.88rem;
		font-weight: 700;
	}
	.cos small {
		display: block;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--t-tinta-2);
	}
	.cos small.escala-j {
		font-style: italic;
		color: var(--t-aur);
	}
	.accions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* bascula (interruptor) */
	.basc {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--t-tinta) 20%, transparent);
		cursor: pointer;
		transition: background 0.2s;
	}
	.basc::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--t-tinta);
		transition: transform 0.2s;
	}
	.basc[aria-checked='true'] {
		background: var(--t-aur);
	}
	.basc[aria-checked='true']::after {
		transform: translateX(14px);
		background: var(--t-fons);
	}
	.basc:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* color : una pastilha que dobrís lo selector del sistèma */
	.mostra {
		position: relative;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		cursor: pointer;
	}
	.mostra input {
		position: absolute;
		inset: -6px;
		width: calc(100% + 12px);
		height: calc(100% + 12px);
		padding: 0;
		border: 0;
		cursor: pointer;
	}

	/* pastilhas dels dialèctes */
	.pastilhas {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 0.45rem;
	}
	.pastilha {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 3px 9px 3px 6px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.72rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.pastilha i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.pastilha i.cro {
		border-radius: 2px;
		background: repeating-linear-gradient(45deg, var(--t-terra-viu) 0 1.5px, transparent 1.5px 3.5px);
	}
	/* una zòna a despart (la Catalonha del Nòrd) : un contorn en ponchs, pas una color */
	.pastilha.apart {
		flex-basis: 100%;
		max-width: max-content;
	}
	.pastilha i.apart {
		border-radius: 2px;
		border: 1.5px dashed var(--t-aur);
		background: none;
	}
	.pastilha[aria-pressed='true'] {
		border-color: var(--t-aur);
		background: color-mix(in srgb, var(--t-aur) 16%, transparent);
	}
	.pastilha.totes {
		color: var(--t-aur-clar);
	}

	/* fonses en vinhetas */
	.fonses {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}
	.fons {
		display: grid;
		gap: 5px;
		padding: 0 0 6px;
		overflow: hidden;
		border: 1px solid var(--t-linha);
		border-radius: 10px;
		background: none;
		color: var(--t-tinta);
		font: 400 0.7rem/1.1 var(--font-body);
		cursor: pointer;
	}
	.fons i {
		display: block;
		height: 34px;
	}
	.fons[aria-checked='true'] {
		border-color: var(--t-aur);
		box-shadow: inset 0 0 0 1px var(--t-aur);
	}
	.fons-estelas {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 34'%3E%3Cpath d='M38 0c-3 6 4 9 0 15s-9 7-6 12 8 4 5 7' fill='none' stroke='%23f5ead8' stroke-width='.8' opacity='.8'/%3E%3Cpath d='M6 30c8-3 14 2 20-3' fill='none' stroke='%23e0612f' stroke-width='1.2' stroke-dasharray='.1 2.6' stroke-linecap='round'/%3E%3C/svg%3E") center / cover, #1d0f0a;
	}
	.fons-occitan {
		background:
			linear-gradient(135deg, transparent 46%, #e7b9a3 47% 50%, transparent 51%),
			linear-gradient(20deg, transparent 60%, #f2dfb8 61% 63%, transparent 64%),
			#3a2f2a;
	}
	.fons-natural {
		background:
			radial-gradient(ellipse at 30% 70%, #5e7b3a, transparent 60%),
			radial-gradient(ellipse at 75% 30%, #8a7a52, transparent 55%),
			#2f3a24;
	}
	.fons-satellite {
		background:
			radial-gradient(ellipse at 40% 60%, #3d5130, transparent 60%),
			radial-gradient(ellipse at 80% 20%, #6b6046, transparent 50%),
			#1f2a2e;
	}
	.botons-sus {
		margin: 0 0 0.4rem;
	}
	.boton {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.boton svg {
		width: 15px;
		height: 15px;
	}
	.boton:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.botons {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 0.8rem;
	}
	.boton {
		padding: 6px 12px;
		border: 1px solid var(--t-linha);
		border-radius: 999px;
		background: none;
		color: var(--t-aur-clar);
		font: 700 0.75rem/1.2 var(--font-body);
		cursor: pointer;
	}
	.boton:hover {
		border-color: var(--t-aur);
	}
	.admin {
		display: block;
		margin-top: 0.9rem;
		padding-top: 0.7rem;
		border-top: 1px solid var(--t-linha);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--t-aur-clar);
		text-decoration: none;
	}

	/* Pichona nautor (telefon en païsatge, fenèstra corta) : rail mai sarrat */
	/* Lo panèl en bas, a l'orizontala (causida de Romain) : centrat, al dessús
	   de las fonts ; los tiradors s'alandan al dessús d'el. Sul telefon, la
	   barra es ja en bas : res de cambiat. */
	@container carta (min-width: 601px) {
		.rail.orizontal {
			top: auto;
			left: 50%;
			bottom: 1.9rem;
			transform: translateX(-50%);
			width: auto;
			max-height: none;
			overflow: visible;
			display: flex;
			align-items: stretch;
			gap: 2px;
			padding: 4px 8px 4px 4px;
		}
		.rail.orizontal .encòca {
			flex-direction: column;
			justify-content: center;
			gap: 3px;
			padding: 0 4px 0 2px;
		}
		.rail.orizontal .prene {
			flex: 0 0 auto;
			width: 20px;
		}
		.rail.orizontal .rail-b {
			width: 4.6rem;
		}
		.rail.orizontal .rail-sep {
			width: 1px;
			height: auto;
			margin: 8px 3px;
		}
		.tirador.amont {
			top: auto;
			bottom: var(--tir-bas, 6.5rem);
		}
	}
	@container carta (max-height: 720px) {
		.rail-b {
			padding: 6px 2px 5px;
			font-size: 9.5px;
		}
		.rail-b svg {
			width: 20px;
			height: 20px;
		}
	}
	/* Telefon : lo rail ven una barra en bas (a portada del det, liura la
	   recèrca en naut) ; lo tirador s'alanda de la barra, sus tota la largor */
	@container carta (max-width: 600px) {
		.rail {
			top: auto;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: var(--barra-bas, 3.9rem);
			max-height: none;
			overflow: visible;
			display: flex;
			align-items: stretch;
			gap: 0;
			padding: 3px 4px env(safe-area-inset-bottom, 0px);
			border-width: 1px 0 0;
			border-radius: 16px 16px 0 0;
			box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.3);
			transform: none;
		}
		/* sul telefon la barra demòra en bas : ni encòca ni reduccion */
		.encòca {
			display: none;
		}
		.rail.reduch .rail-b {
			display: grid;
		}
		.rail.reduch .rail-sep {
			display: block;
		}
		.rail-b {
			flex: 1 1 0;
			min-width: 0;
			padding: 5px 0 3px;
			font-size: 9.5px;
			line-height: 1.1;
		}
		.rail-b svg {
			width: 20px;
			height: 20px;
		}
		.punt {
			right: calc(50% - 15px);
		}
		.compte {
			right: calc(50% - 22px);
		}
		.rail-sep {
			width: 1px;
			height: auto;
			margin: 10px 2px;
		}
		.tirador {
			top: auto;
			left: 0;
			right: 0;
			bottom: calc(var(--barra-bas, 3.9rem) - 1px);
			width: auto;
			max-height: min(60%, calc(100% - 10rem));
			border-radius: 18px 18px 0 0;
			border-width: 1px 0 0;
			box-shadow: 0 -12px 34px rgba(0, 0, 0, 0.4);
			animation: tirador-pujar 0.28s cubic-bezier(0.19, 1, 0.22, 1);
		}
	}
	@keyframes tirador-pujar {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rail-b,
		.basc,
		.basc::after {
			transition: none;
		}
		.tirador {
			animation: none;
		}
	}
</style>
