// Còla « Estelas » de /carta (2026-10-07) : la carte en étoiles de l'accueil,
// devenue une couche Leaflet. Mêmes lieux (304 villes et villages, nom
// occitan, dialecte), mêmes rivières, même placement des noms (villes à
// droite / gauche / dessus / dessous, la place la moins encombrée ; noms de
// rivières courbés le long de l'eau), mêmes couleurs de thème.
//
// En plus de l'accueil : on zoome et on se déplace (Leaflet s'en charge),
// les noms des villages apparaissent quand il y a la place, un clic sur un
// lieu y fait voler la carte, et la couche s'efface quand la carte détaillée
// (tuiles OSM en occitan) prend le relais, vers le niveau 9-10.
//
// Technique : un canevas dans un « pane » Leaflet, redessiné à chaque image
// (scintillement, survol), recalé à chaque fin de déplacement, et mis à
// l'échelle par transformation CSS pendant l'animation de zoom (même méthode
// que le moteur de rendu canevas de Leaflet).
import { LUOCS, RIUS, COSTA, dialDe, rencDe, SOTDIALECTES, SOBRENOMS } from '$lib/acuelh/carta-estelas.js';
import { P, BRANCAS, ARCS } from '$lib/acuelh/simbol.js';
import { nomTerritori, sotaTerritori } from './territoris.js';
import { proj0, projectar, projPonch } from './projeccion.js';
import { Z, KM, zDès, nivèlsDezoom, aDetalh } from './escalas.js';
import { emprèsa } from './centrar.js';
import { EtiquetasVivas } from './etiquetasVivas.js';
import { NOMS_FRANCES } from './nomsFrances.js';

// Lo repèr d'una vila qu'a sa ficha : la crotz de Lo Ligam sus un disc sorne
// liserat d'aur, e una onda que s'espandís doçament, coma un ponch d'interès
// de descobrir. (La pastilha « ? » roja fasiá pensar a una error : levada,
// retorn de Romain 2026-10-07 ; a la primièra vesita, una bulla d'ajuda.)
function dessenharRepèr(cx, x, y, R, T, a, onda) {
	cx.save();
	if (onda >= 0) {
		cx.globalAlpha = a * 0.55 * (1 - onda);
		cx.strokeStyle = T.fil;
		cx.lineWidth = 1.2;
		cx.beginPath();
		cx.arc(x, y, R * (1.45 + onda * 1.6), 0, 6.283);
		cx.stroke();
	}
	cx.globalAlpha = a;
	cx.fillStyle = T.bulla;
	cx.strokeStyle = T.fil;
	cx.lineWidth = 1.2;
	cx.beginPath();
	cx.arc(x, y, R * 1.45, 0, 6.283);
	cx.fill();
	cx.stroke();
	cx.save();
	cx.translate(x, y);
	cx.lineCap = 'round';
	cx.lineWidth = Math.max(1, R * 0.1);
	cx.beginPath();
	for (const i of BRANCAS) {
		cx.moveTo(0, 0);
		cx.lineTo(P[i][0] * R, P[i][1] * R);
	}
	for (const [i, j] of ARCS) {
		const [ax, ay] = P[i],
			[bx, by] = P[j];
		cx.moveTo(ax * R, ay * R);
		cx.quadraticCurveTo((ax + bx) * 0.415 * R, (ay + by) * 0.415 * R, bx * R, by * R);
	}
	cx.stroke();
	P.forEach(([px, py], i) => {
		cx.fillStyle = i === 0 ? T.fil : T.estela;
		cx.beginPath();
		cx.arc(px * R, py * R, (i === 0 ? 0.15 : 0.12) * R, 0, 6.283);
		cx.fill();
	});
	cx.restore();
	cx.restore();
}

const TÈXTES_FICHA = {
	oc: { dobrir: 'Descobrir la vila  →', leu: 'Lèu', ajuda: 'Clica per descobrir la vila' },
	fr: { dobrir: 'Découvrir la ville  →', leu: 'Bientôt', ajuda: 'Clique pour découvrir la ville' }
};

const TEMAS = {
	sorne: { lenga: '#e0612f', corba: 'rgba(238, 175, 52, 1)', costa: 'rgba(245, 234, 216, 0.42)', bulla: 'rgba(47, 23, 14, 0.94)', riu: '#f6b73c', estela: '#fbf1e1', liser: 'rgba(34, 16, 10, 0.9)', fil: '#f6b73c', riuTèxt: '#ffd98a', vilaTèxt: '#fbf1e1', vel: 'rgba(34, 16, 10, 0.75)', velFin: 'rgba(34, 16, 10, 0)' },
	clar: { lenga: '#b53d17', corba: 'rgba(138, 90, 43, 1)', costa: 'rgba(42, 26, 16, 0.42)', bulla: 'rgba(251, 249, 246, 0.96)', riu: '#b06a14', estela: '#6b3a22', liser: 'rgba(247, 243, 238, 0.92)', fil: '#b06a14', riuTèxt: '#8a3f12', vilaTèxt: '#2a1a10', vel: 'rgba(247, 243, 238, 0.85)', velFin: 'rgba(247, 243, 238, 0)' }
};
const temaDe = (clar, dalt) => ({
	...(clar ? TEMAS.clar : TEMAS.sorne),
	...(dalt ? (clar ? { riu: '#1f5f8f', riuTèxt: '#174a72', lenga: '#1f5f8f' } : { riu: '#6fb1ff', riuTèxt: '#a9d0ff', lenga: '#6fb1ff' }) : {})
});

// Montpelhièr d'abord (demande Romain) ; si une ville doit céder sa place, ce
// sera une des dernières.
const PRIORITAT = ['Montpelhièr', 'Tolosa', 'Marselha', 'Bordèu', 'Niça', 'Clarmont-Ferrand', 'Limòtges', 'Avinhon', 'Baiona', 'Vielha', 'Draonier', 'Pau', 'Valença', 'Tolon', 'Nimes', 'Ais de Provença'];
const rang = (n) => {
	const i = PRIORITAT.indexOf(n);
	return i < 0 ? 99 : i;
};


// L'entrada en scèna de la carta (demanda de Romain, 2026-10-07), en
// segondas dempuèi l'arribada : la còsta se traça, las corbas de nivèl
// montan, los noms de las cadenas apareisson, los rius rajan de lor font
// cap a la mar, las vilas grandas s'alucan, puèi los dialèctes se difusan.
// Un clic (o la molèta, una tòca) mena tot d'un còp a la fin ; res se lo
// sistèma demanda mens de movement.
const escalaCSS = (el) => {
	const m = getComputedStyle(el).transform;
	return !m || m === 'none' ? 1 : new DOMMatrixReadOnly(m).a;
};

export const INTRO = {
	costa: [0.15, 1.5],
	corbas: [1.1, 2.9],
	massis: [2.6, 3.6],
	rius: [3.4, 6.2],
	vilas: [5.8, 7.0],
	dialectes: [6.8, 8.8],
	fin: 9.4
};

// Sus la vista d'ensemble, sonque las vilas grandas : una o doas per
// dialècte (demanda de Romain) ; las autras venon en s'aprochant
const CAPITALAS = ['Bordèu', 'Pau', 'Tolosa', 'Montpelhièr', 'Marselha', 'Niça', 'Limòtges', 'Clarmont-Ferrand', 'Valença', 'Gap'];
// a partir de quin zoom un luòc se mòstra : una valor de la barra, parièra
// sus totes los ecrans (escalas.js : capitalas a 70 km, vilas a 40 km,
// mejanas a 30 km ; las vilas grandas d'una autra lenga, coma las capitalas)
// (una vila d'una autra lenga es pas una capitala occitana per son nom :
// Tolosa de Gipuscoa èra presa per Tolosa de Lengadòc)
const capOc = (e) => !e.lenga && CAPITALAS.includes(e.nom);
const capitala = (e) => capOc(e) || e.dz === -1;
const zLuòc = (e, n) => (capitala(e) ? n.zCapitalas : e.renc <= 2 ? n.zVilas : e.renc === 3 ? n.zVilasMejanas : n.zVilatges);
// (lo nom d'una capitala ven un cran aprèp son estela)
const zNomLuòc = (e, n) => (capitala(e) ? n.zNomsCapitalas : zLuòc(e, n));
// Lo retard (s) de l'alucatge d'una estela : las capitalas una a una, las
// autras cadun a son moment, coma d'estelas que s'alucan
const retardLuòc = (e) => {
	const ic = e.lenga ? -1 : CAPITALAS.indexOf(e.nom);
	return ic >= 0 ? ic * 0.11 : 0.25 + ((e.f / 6.283) % 1) * 0.9;
};
const ESC_LUÒC = 600; // ms : una estela (e son nom) que se'n va s'escantís
// l'opacitat del nom d'un luòc : arriba aprèp son estela, se'n va amb ela
function aNomLuòc(e, t) {
	if (!e) return 1;
	if (!e.visNom) return e.tNomEsc == null ? 0 : 1 - easeS(clamp((t - e.tNomEsc) / ESC_LUÒC));
	if (e.tNom == null) return 1;
	return easeS(clamp(((t - e.tNom) / 1000 - retardLuòc(e) - 0.2) / 0.7));
}
// lo dialècte d'un luòc, dins la bulla (los de las autras lengas lo pòrtan),
// e son sotdialècte quand es plan particular (lo niçard, lo bearnés…)
const dialLuòc = (e, lang = 'oc') => {
	const d = e.dialTèxt ?? dialDe(e);
	// (una cadena : un sotdialècte ; un objècte : un parlar de transicion, coma
	// lo mentonasc, entre occitan e ligur : retorn de Romain)
	const s = e.sot ?? SOTDIALECTES[e.nom];
	if (!s) return d;
	if (typeof s === 'object') {
		// (un complement sourçat : los manlèus del niçard, las lengas d'un parlar de transicion)
		const fr = lang === 'fr',
			nota = fr ? s.fr : s.oc;
		if (s.mena === 'transicion') return `${d} · ${s.nom}, ${fr ? 'parler de transition' : 'parlar de transicion'}${nota ? ' ' + nota : ''}`;
		return `${d} · ${fr ? 'sous-dialecte' : 'sotdialècte'} ${s.nom}${nota ? ', ' + nota : ''}`;
	}
	return `${d} · ${lang === 'fr' ? 'sous-dialecte' : 'sotdialècte'} ${s}`;
};
// Lo subrenom d'una vila, dins un pichon encastre jos son nom : la forma
// occitana, e la francesa dejós sus la version francesa. (x, y) : lo caire
// d'en naut, del costat de l'alinhament ; torna la nautor ocupada.
const CORMORANT_SUB = 'italic 500 15px "Cormorant Garamond", Georgia, serif';
function encastreSobrenom(cx, T, sob, lang, x, y, al = 'left') {
	if (!sob) return 0;
	const linhas = [['« ' + sob.oc + ' »', CORMORANT_SUB, T.riuTèxt]];
	if (lang === 'fr' && sob.fr && sob.fr.toLowerCase() !== sob.oc.toLowerCase()) linhas.push([sob.fr, '400 10.5px Luciole, sans-serif', T.vilaTèxt]);
	let w = 0;
	for (const [t, f] of linhas) {
		cx.font = f;
		w = Math.max(w, cx.measureText(t).width);
	}
	const h = 8 + linhas.length * 15,
		bw = w + 16,
		x0 = al === 'left' ? x : al === 'right' ? x - bw : x - bw / 2;
	cx.save();
	cx.globalAlpha = 1;
	cx.fillStyle = T.bulla;
	cx.strokeStyle = T.fil;
	cx.lineWidth = 0.8;
	cx.beginPath();
	cx.roundRect(x0, y, bw, h, 8);
	cx.fill();
	cx.globalAlpha = 0.6;
	cx.stroke();
	cx.textAlign = 'center';
	linhas.forEach(([t, f, c], i) => {
		cx.font = f;
		cx.fillStyle = c;
		cx.globalAlpha = i ? 0.75 : 1;
		cx.fillText(t, x0 + bw / 2, y + 16 + i * 15);
	});
	cx.restore();
	return h;
}

// Lo sens dels rius : las donadas mesclan los sens (la Garona va de la mar a
// sa font) e copan un riu en mantun tròç. Los tròces d'un meteis riu son
// cadenats ; l'embocadura es lo cap que tòca la mar o un autre riu ; cada
// tròç sap a quina distància de la font comença (en km), que l'aiga avance
// a la meteissa velocitat de la font a la mar.
// Lo Ròse grand s'arrèsta al cap de l'estuari que la còsta dessenha (Salin) :
// son lèit es prolongat fins a la mar, a Port-Sant-Loís (retorn de Romain,
// 2026-10-08)
const PROLONGAMENTS = [
	{
		cap: [4.695, 43.579],
		seguida: [[4.704, 43.574], [4.734, 43.54], [4.736, 43.49], [4.736, 43.455], [4.75, 43.423], [4.79, 43.391], [4.828, 43.366], [4.838, 43.345]]
	}
];
function orientarRius(rius, costa) {
	const km = ([x0, y0], [x1, y1]) => Math.hypot((x1 - x0) * 111 * Math.cos((((y0 + y1) / 2) * Math.PI) / 180), (y1 - y0) * 111);
	const long = (l) => l.reduce((s, p, i) => (i ? s + km(l[i - 1], p) : 0), 0);
	const pròp = (p, linhas, max) => linhas.some((l) => l.some((q) => km(p, q) < max));
	const grops = new Map();
	rius.forEach(([nom, pes, l], i) => {
		const k = nom ?? '#' + i;
		if (!grops.has(k)) grops.set(k, { nom, pes, tròces: [] });
		grops.get(k).tròces.push(l.slice());
	});
	const sortida = [];
	for (const [k, g] of grops) {
		const autres = [...grops].filter(([k2]) => k2 !== k).flatMap(([, g2]) => g2.tròces);
		// cadenas de tròces que se tòcan (cap a cap, a mens de 2 km)
		const rèsta = g.tròces.slice();
		while (rèsta.length) {
			let cadena = [rèsta.shift()];
			let crescut = true;
			while (crescut) {
				crescut = false;
				for (let i = 0; i < rèsta.length; i++) {
					const t = rèsta[i],
						a = cadena[0][0],
						b = cadena.at(-1).at(-1);
					if (km(b, t[0]) < 2) cadena.push(t);
					else if (km(b, t.at(-1)) < 2) cadena.push(t.reverse());
					else if (km(a, t.at(-1)) < 2) cadena.unshift(t);
					else if (km(a, t[0]) < 2) cadena.unshift(t.reverse());
					else continue;
					rèsta.splice(i, 1);
					crescut = true;
					break;
				}
			}
			// l'embocadura : lo cap pus pròche de la mar o d'un autre riu
			const ponch = (p) => Math.min(...costa.flatMap((l) => l.map((q) => km(p, q))), pròp(p, autres, 3) ? 0 : Infinity);
			const [debut, fin] = [cadena[0][0], cadena.at(-1).at(-1)];
			if (ponch(debut) < ponch(fin)) cadena = cadena.reverse().map((t) => t.reverse());
			// l'embocadura tòca la mar : un estuari conegut es seguit fins a la
			// mar ; un riu que s'arrèsta a mens de 6 km de la còsta i es menat
			// (lo Ròse pichon s'arrestava 2 km abans las Santas Marias)
			const cap = cadena.at(-1).at(-1);
			if (!pròp(cap, autres, 3)) {
				const pl = PROLONGAMENTS.find((x) => km(x.cap, cap) < 1.5);
				if (pl) cadena.at(-1).push(...pl.seguida);
				else {
					let melhor = null,
						dm = Infinity;
					for (const l of costa)
						for (let i = 1; i < l.length; i++) {
							// lo ponch del tròç de còsta lo mai pròche (planisfèri local, en km)
							const [a, b] = [l[i - 1], l[i]],
								cs = Math.cos((cap[1] * Math.PI) / 180),
								ax = (a[0] - cap[0]) * cs,
								ay = a[1] - cap[1],
								bx = (b[0] - cap[0]) * cs,
								by = b[1] - cap[1],
								dx = bx - ax,
								dy = by - ay,
								L2 = dx * dx + dy * dy,
								t = L2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L2)) : 0,
								q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
								d = km(cap, q);
							if (d < dm) (dm = d), (melhor = q);
						}
					if (melhor && dm > 0.2 && dm < 6) cadena.at(-1).push(melhor);
				}
			}
			let o = 0;
			for (const l of cadena) {
				const L = long(l);
				const cum = l.map((p, i) => (i ? 0 : 0));
				for (let i = 1; i < l.length; i++) cum[i] = cum[i - 1] + km(l[i - 1], l[i]);
				sortida.push({ nom: g.nom, pes: g.pes, l, o, L, cum });
				o += L;
			}
		}
	}
	return sortida;
}
let riusOrientats = null;

// Los fichièrs d'Euròpa e del mond, cargats un còp
const promesasMond = {};
const cargarMond = (u) => (promesasMond[u] ??= fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null));

const OCCITANIA = [
	[42.65, -1.6],
	[46.4, 7.55]
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// plus doux que easeIO au milieu (pente max 1,6 au lieu de 3) : pour les fondus longs
const easeS = (t) => (1 - Math.cos(Math.PI * t)) / 2;
const aleat = (a, b) => a + Math.random() * (b - a);
const CORMORANT = '"Cormorant Garamond", Georgia, serif';
// Polissa d'un nom de vila segon son reng (demanda de Romain, 2026-10-07) :
// la Limelight del lògo per las grandas vilas, la Luciole grassa pels
// cap-lòcs, l'italica per las vilas pus pichonas. Lo nom survolat garda la
// polissa de son reng (abans, una italica Cormorant que i pegava pas).
// Los noms de las vilas (retorn de Romain, 2026-10-08 : lo contorn negre de
// las vilas grandas, « pas fan », « plus haut de gamme, plus raffiné ») : pas
// pus de contorn dur, un alo doç de la color del fons. Estil « Atlas », causit
// per Romain entre tres : las metropòlis en Limelight finament espaçat, las
// vilas en pichonas capitalas espaçadas, los borgs e vilatges en Cormorant
// italic. Per renc : [polissa(f), espaçament (en f), capitalas]
const ESTIL_VILAS = {
	1: [(f) => `${f.toFixed(1)}px Limelight, Georgia, serif`, 0.05, false],
	2: [(f) => `400 ${(f * 0.84).toFixed(1)}px Luciole, sans-serif`, 0.16, true],
	3: [(f) => `italic 500 ${(f * 1.25).toFixed(1)}px ${CORMORANT}`, 0.01, false],
	4: [(f) => `italic 500 ${(f * 1.15).toFixed(1)}px ${CORMORANT}`, 0, false]
};
export const estilVila = (renc, f) => {
	const [polissa, esp, majus] = ESTIL_VILAS[renc] ?? ESTIL_VILAS[4];
	return { font: polissa(f), esp: esp * f, majus };
};
// lo reng afichat d'un luòc occitan (las capitalas son de metropòlis), per
// que los noms de las comunas sul satellit seguisson la meteissa tièra
export const rencVila = (nom) => (CAPITALAS.includes(nom) ? 1 : rencDe(nom));
// la polissa sola (bullas, repèrs)
const polissaVila = (renc, f) => estilVila(renc, f).font;
// la polissa e l'espaçament sus un contèxte ; torna lo tèxte de dessenhar
const aplicarVila = (g, renc, f, nom) => {
	const e = estilVila(renc, f);
	g.font = e.font;
	if ('letterSpacing' in g) g.letterSpacing = e.esp.toFixed(2) + 'px';
	return e.majus ? nom.toUpperCase() : nom;
};
// lo segond nom d'una vila (site en francés), en pichon e en italica dejós
// (Luciole en italica, daurada : una autra letra que lo nom principal, legibla en pichon)
const pxSota = (f) => Math.min(10.5, Math.max(9, Math.round(f * 0.74 * 2) / 2));
const polissaSota = (f) => `italic 400 ${pxSota(f)}px Luciole, sans-serif`;
const nautSota = (f) => pxSota(f) * 1.25;
const COLOR_SOTA = '#ecd29c';
const sensEspaci = (g) => {
	if ('letterSpacing' in g) g.letterSpacing = '0px';
};

// Los sulhets d'escala (relais estelas → satellit, comunas, vol…) : escalas.js
// Lo fons de la carta (CartaOccitania : color de fons e alo terra cuècha),
// reproduch sus la tela de revelacion per que se veja pas cap de cordura
const rgbDe = (c) => {
	const h = (c || '').trim().replace('#', '');
	if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(h)) return null;
	const n = h.length === 3 ? h.replace(/./g, '$&$&') : h;
	return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)).join(', ');
};
function fonsDe(el) {
	const cs = getComputedStyle(el);
	return { fons: cs.getPropertyValue('--t-fons').trim() || cs.backgroundColor, terra: rgbDe(cs.getPropertyValue('--t-terra')) };
}
const DURADA_RELAIS = 2.0; // secondes (la revelacion « dels nívols a la tèrra », retorn de Romain)
// la tela dels nívols es un degradat doç : pintada al quart de la resolucion
// (16 còps mens de ponches a cada imatge), lo navegador l'agrandís
const K_REV = 0.25;


/* ---------- Placement des noms (repris de l'accueil, en pixels projetés) ---------- */
// 0 drecha, 1 esquèrra, 2 dessús, 3 dejós, 4 dessús a drecha, 5 dejós a
// drecha, 6 dessús a esquèrra, 7 dejós a esquèrra
const PLAÇA_PREFERIDA = { Marselha: 3, Bordèu: 3, Limòtges: 2, Gap: 5, Pau: 3 };

function plaçar(cx, vilas, rius, ambNomsRius = true, ocupat = [], centrat = false) {
	const CEL = 16,
		grilha = new Map();
	const cases = (b, fn) => {
		for (let i = Math.floor(b[0] / CEL); i <= Math.floor(b[2] / CEL); i++)
			for (let j = Math.floor(b[1] / CEL); j <= Math.floor(b[3] / CEL); j++) fn(i * 131072 + j);
	};
	const metre = (b, pes, prop) => {
		const o = { b, pes, prop };
		cases(b, (k) => {
			if (!grilha.has(k)) grilha.set(k, []);
			grilha.get(k).push(o);
		});
	};
	const cost = (b, prop) => {
		const vist = new Set();
		let c = 0,
			fort = 0;
		cases(b, (k) => {
			for (const o of grilha.get(k) || []) {
				if (vist.has(o) || o.prop === prop) continue;
				vist.add(o);
				if (b[0] < o.b[2] && b[2] > o.b[0] && b[1] < o.b[3] && b[3] > o.b[1]) {
					c += o.pes;
					if (o.pes >= 5) fort++;
				}
			}
		});
		return [c, fort];
	};
	const liss = (pts, n) => {
		for (let k = 0; k < n; k++) {
			const q = [pts[0]];
			for (let i = 0; i < pts.length - 1; i++) {
				const a = pts[i],
					b = pts[i + 1];
				q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
			}
			q.push(pts[pts.length - 1]);
			pts = q;
		}
		return pts;
	};

	const res = { vilas: [], rius: [] };
	// Les points des villes d'abord ; ceux des villages n'entrent en jeu
	// qu'après le placement des villes (sinon, en zoomant, les villages
	// voisins étouffaient Montpelhièr : aucune place libre pour son nom)
	const punt = (v) => metre([v.x - 4, v.y - 4, v.x + 4, v.y + 4], 5, v.nom);
	vilas.filter((v) => v.ciutat).forEach(punt);
	// (los botons, lo capçal, la recèrca, lo rail : un nom i va pas jos ;
	// retorn de Romain sul telefòn, 2026-10-11)
	for (const b of ocupat) metre(b, 5, 'interfacia');
	rius.forEach(({ nom, pts }, n) => {
		const prop = nom || 'riu' + n;
		for (let i = 1; i < pts.length; i++) {
			const a = pts[i - 1],
				b = pts[i],
				L = Math.hypot(b[0] - a[0], b[1] - a[1]);
			for (let d = 0; d < L; d += 4) {
				const x = a[0] + ((b[0] - a[0]) * d) / L,
					y = a[1] + ((b[1] - a[1]) * d) / L;
				metre([x - 1.5, y - 1.5, x + 1.5, y + 1.5], 1, prop);
			}
		}
	});

	// Villes puis villages : la place la moins encombrée parmi huit ; un nom
	// peut croiser une rivière (son liseré le détache), jamais un autre nom
	// Ordre : villes, puis noms de rivières, puis villages dans la place qui reste
	const pausarVila = (v) => {
		const k = v.f / 12,
			w1 = cx.measureText(aplicarVila(cx, v.renc, v.f, v.t1 ?? v.nom)).width,
			x = v.x,
			y = v.y;
		// (lo segond nom : la bóstia s'alonga cap aval, o lo blòt monta quand es al dessús del ponch)
		let w2 = 0;
		if (v.t2) {
			sensEspaci(cx);
			cx.font = polissaSota(v.f);
			w2 = cx.measureText(v.t2).width;
		}
		const w = Math.max(w1, w2),
			hS = v.t2 ? nautSota(v.f) : 0;
		const cand0 = [
			{ x: x + 7 * k, y: y + 4 * k, al: 'left', b: [x + 5 * k, y - 8 * k, x + 9 * k + w, y + 7 * k], bonus: 0 },
			{ x: x - 7 * k, y: y + 4 * k, al: 'right', b: [x - 9 * k - w, y - 8 * k, x - 5 * k, y + 7 * k], bonus: 0.4 },
			{ x, y: y - 9 * k, al: 'center', b: [x - w / 2 - 2, y - 21 * k, x + w / 2 + 2, y - 5 * k], bonus: 0.6 },
			{ x, y: y + 18 * k, al: 'center', b: [x - w / 2 - 2, y + 5 * k, x + w / 2 + 2, y + 21 * k], bonus: 0.8 },
			{ x: x + 5 * k, y: y - 7 * k, al: 'left', b: [x + 3 * k, y - 19 * k, x + 7 * k + w, y - 4 * k], bonus: 1 },
			{ x: x + 5 * k, y: y + 15 * k, al: 'left', b: [x + 3 * k, y + 3 * k, x + 7 * k + w, y + 18 * k], bonus: 1 },
			{ x: x - 5 * k, y: y - 7 * k, al: 'right', b: [x - 7 * k - w, y - 19 * k, x - 3 * k, y - 4 * k], bonus: 1.2 },
			{ x: x - 5 * k, y: y + 15 * k, al: 'right', b: [x - 7 * k - w, y + 3 * k, x - 3 * k, y + 18 * k], bonus: 1.2 }
		];
		// (lo segond nom acaba jos la fin del primièr : s'es mai long, depassa a esquèrra)
		const esq = (q) => {
			if (!v.t2) return q.b[0];
			const fin = q.al === 'left' ? q.x + w1 : q.al === 'right' ? q.x : q.x + w1 / 2;
			return Math.min(q.b[0], fin - w2 - 2);
		};
		const cand = cand0.map((q) => (q.y < y ? { ...q, y: q.y - hS, b: [esq(q), q.b[1] - hS, q.b[2], q.b[3]] } : { ...q, b: [esq(q), q.b[1], q.b[2], q.b[3] + hS] }));
		let c = cand[0],
			mendre = Infinity;
		// Las vilas grandas e las vilas repèrs : lo nom a drecha del ponch,
		// coma o vòl l'usatge (retorn de Romain : « Montpelhièr » a esquèrra
		// semblava designar l'espilla de dejós) ; un autre costat sonque se un
		// autre nom empacha
		const drecha = v.renc <= 2 ? 3 : 0;
		// qualques vilas grandas an una plaça preferida, per l'estetica (retorn
		// de Romain : Marselha e Bordèu jos lo ponch, Limòtges e Clarmont pas en
		// linha, Gap pas sus Valença) ; se i a pas de plaça, la mai liura
		// sul telefòn, lo nom centrat sus son ponch (al dessús, o dejós) : a
		// costat, un nom long semblava designar una vila mai a l'èst (retorn de
		// Romain, 2026-10-12 : « on dirait que Toulouse est positionnée à Montpellier »)
		const iPref = PLAÇA_PREFERIDA[v.nom] ?? 0;
		const pref = cand[centrat ? (iPref === 2 || iPref === 3 ? iPref : 2) : iPref];
		for (const q of cand) {
			const [val, f] = cost(q.b, v.nom);
			const costat = centrat && q.al !== 'center' ? 2 : 0;
			const sc = (val - 5 * f) * 0.03 + f * 100 + (q === pref ? 0 : q.bonus + (centrat ? costat : drecha));
			if (sc < mendre) {
				mendre = sc;
				c = q;
			}
		}
		sensEspaci(cx);
		if (mendre >= 100) return; // pas de place : le nom reste visible au survol
		metre(c.b, 5, 'etiqueta');
		res.vilas.push({ nom: v.nom, t1: v.t1, t2: v.t2, hS, x: c.x, y: c.y, al: c.al, f: v.f, ciutat: v.ciutat, renc: v.renc, e: v.e });
	};
	for (const v of vilas) if (v.ciutat) pausarVila(v);

	// Rivières : des plus grandes aux plus petites ; le nom suit un arc doux
	// ajusté sur le tracé lissé, au-dessus ou au-dessous de l'eau, sans rien toucher
	const perNom = {};
	for (const r of rius) if (r.nom) (perNom[r.nom] ||= { nom: r.nom, pes: 0, linhas: [] }).linhas.push(r.pts), (perNom[r.nom].pes = Math.max(perNom[r.nom].pes, r.pes));
	// (los noms de rius, sonque se son afichats : lor plaçament es lo pus car)
	if (ambNomsRius) for (const { nom, linhas, pes } of Object.values(perNom).sort((a, b) => b.pes - a.pes)) {
		const fs = Math.round(12 + pes * 0.75),
			trac = fs * 0.09;
		cx.font = 'italic 500 ' + fs + 'px ' + CORMORANT;
		const larg = [...nom].map((ch) => cx.measureText(ch).width),
			tot = larg.reduce((a, b) => a + b, 0) + trac * (nom.length - 1);
		const ofs = fs * 0.55 + 3;
		let melhor = null;
		for (const l of linhas) {
			const pts = liss(l, 3);
			const cum = [0];
			for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
			const L = cum[cum.length - 1];
			if (L < tot + 20) continue;
			const ponch = (d) => {
				d = Math.max(0, Math.min(L, d));
				let lo = 1,
					hi = cum.length - 1;
				while (lo < hi) {
					const m = (lo + hi) >> 1;
					if (cum[m] < d) lo = m + 1;
					else hi = m;
				}
				const i = lo,
					f = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
				return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
			};
			for (const frac of [0.5, 0.44, 0.56, 0.38, 0.62, 0.31, 0.69, 0.24, 0.76, 0.17, 0.83, 0.1, 0.9]) {
				const d0 = frac * L - tot / 2;
				if (d0 < 6 || d0 + tot > L - 6) continue;
				const span = tot * 1.08;
				let P0 = ponch(d0 + tot / 2 - span / 2),
					P1 = ponch(d0 + tot / 2),
					P2 = ponch(d0 + tot / 2 + span / 2);
				if (P2[0] < P0[0]) [P0, P2] = [P2, P0];
				const cl = Math.hypot(P2[0] - P0[0], P2[1] - P0[1]);
				if (cl < tot * 0.6) continue;
				const u = [(P2[0] - P0[0]) / cl, (P2[1] - P0[1]) / cl],
					nv = [u[1], -u[0]];
				const M = [(P0[0] + P2[0]) / 2, (P0[1] + P2[1]) / 2];
				const sag = (P1[0] - M[0]) * nv[0] + (P1[1] - M[1]) * nv[1];
				const kr = (8 * sag) / (cl * cl + 4 * sag * sag);
				for (const costat of [1, -1]) {
					let kb = kr / (1 + kr * ofs * costat);
					const kmax = Math.min(1 / (7 * fs), 0.9 / tot);
					kb = Math.max(-kmax, Math.min(kmax, kb));
					const A = [P1[0] + nv[0] * ofs * costat, P1[1] + nv[1] * ofs * costat];
					const letras = [],
						bs = [];
					let d = -tot / 2;
					[...nom].forEach((ch, k) => {
						const sL = d + larg[k] / 2,
							th = sL * kb;
						const x = A[0] + (Math.abs(kb) < 1e-6 ? u[0] * sL : (u[0] * Math.sin(th) - nv[0] * (1 - Math.cos(th))) / kb);
						const y = A[1] + (Math.abs(kb) < 1e-6 ? u[1] * sL : (u[1] * Math.sin(th) - nv[1] * (1 - Math.cos(th))) / kb);
						const t = [u[0] * Math.cos(th) - nv[0] * Math.sin(th), u[1] * Math.cos(th) - nv[1] * Math.sin(th)];
						letras.push({ c: ch, x, y, a: Math.atan2(t[1], t[0]) });
						bs.push([x - larg[k] / 2 - 1, y - fs * 0.42, x + larg[k] / 2 + 1, y + fs * 0.42]);
						d += larg[k] + trac;
					});
					let dmin = Infinity,
						dmax = 0;
					for (const g of letras) {
						let m = Infinity;
						for (let dd = Math.max(0, d0 - fs * 2); dd <= Math.min(L, d0 + tot + fs * 2); dd += 3) {
							const q = ponch(dd);
							m = Math.min(m, Math.hypot(q[0] - g.x, q[1] - g.y));
						}
						dmin = Math.min(dmin, m);
						dmax = Math.max(dmax, m);
					}
					if (dmin < ofs * 0.55 || dmax > ofs + fs * 1.3) continue;
					let sc = (dmax - ofs) / fs + Math.abs(frac - 0.5) * 3 + (costat < 0 ? 0.3 : 0),
						fort = 0;
					for (const bx of bs) {
						const r = cost(bx, nom);
						sc += r[0];
						fort += r[1];
					}
					if (!fort && (!melhor || sc < melhor.sc)) melhor = { letras, bs, sc };
				}
			}
		}
		if (!melhor) continue;
		for (const b of melhor.bs) metre([b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2], 5, 'etiqueta');
		res.rius.push({ letras: melhor.letras, fs });
	}

	// Les villes importantes du département, puis les villages : chaque niveau
	// ne voit comme obstacles que les points des niveaux déjà placés
	for (const nivèl of [3, 4]) {
		const l = vilas.filter((v) => v.renc === nivèl);
		l.forEach(punt);
		l.forEach(pausarVila);
	}
	return res;
}

// Courbes de niveau (Mapzen Terrarium, données ouvertes ; gdal_contour tous
// les 200 m, simplifiées à 600 m) : [[altitude, [[lon, lat], …]], …], 61 Ko
// compressés, chargées seulement avec la carte.
let corbasPromesa = null;
const cargarCorbas = () =>
	(corbasPromesa ??= fetch('/data/corbas-nivel.json')
		.then((r) => (r.ok ? r.json() : []))
		// une ligne mal formée est ignorée plutôt que de bloquer toute la carte
		.then((d) => d.filter(([e, l]) => typeof e === 'number' && Array.isArray(l) && l.length > 1 && typeof l[0][0] === 'number'))
		.catch(() => []));
// Une courbe tous les 1 000 m en vue d'ensemble (sinon les Alpes font une
// tache), tous les 400 m en s'approchant, tous les 200 m de près
const pasCorbas = (z) => (z < 6.75 ? 1000 : z < 7.75 ? 400 : 200);
const CLAU_AJUDA = 'lo-ligam-carta-ajuda-repèr';

// Limites des départements et des régions (france-geojson / Etalab, simplifiés
// avec GDAL : 55 Ko compressés, chargés seulement avec la carte). Elles ne
// s'affichent PAS d'office (retour de Romain, 2026-10-07) : le territoire sous
// la souris se révèle (au doigt : en touchant un vide), et un clic dans un
// vide le fixe avec son nom. Régions de « 50 km » à presque « 30 km »,
// départements de « 30 km » à « 10 km » environ (aussi sur la carte
// détaillée). Format : [code, nom, [anneaux [[lon, lat], …]]].
const menaTerritori = (z) => (z < Z.REG_0 ? null : z < Z.DEP_0 ? 'region' : z < Z.DEP_1 ? 'despartament' : null);
const TÈXTES_TER = { oc: { region: 'Region', despartament: 'Despartament' }, fr: { region: 'Région', despartament: 'Département' } };
// centre (pondéré) du plus grand anneau : là où s'écrit le nom
const centreDe = (anels) => {
	let best = null,
		bestA = 0;
	for (const a of anels) {
		let A = 0,
			sx = 0,
			sy = 0;
		for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
			const k = a[j][0] * a[i][1] - a[i][0] * a[j][1];
			A += k;
			sx += (a[j][0] + a[i][0]) * k;
			sy += (a[j][1] + a[i][1]) * k;
		}
		A /= 2;
		if (Math.abs(A) > bestA) {
			bestA = Math.abs(A);
			best = [sx / (6 * A), sy / (6 * A)];
		}
	}
	return best;
};
// Lo trait de còsta de /carta, calat sus las comunas de l'IGN coma las tenchas
// (SIG/cadena/costa-estelas.py ; en entièrs de 1e-3 grau, en diferéncias). En
// esperant, COSTA (Natural Earth), lo de l'acuèlh, ont la diferéncia se vei pas.
let costaPromesa = null;
const cargarCosta = () =>
	(costaPromesa ??= fetch('/data/costa.json')
		.then((r) => (r.ok ? r.json() : null))
		.then(
			(d) =>
				d &&
				d.l.map((r) => {
					const l = [];
					for (let k = 0, x = 0, y = 0; k < r.length; k += 2) l.push([(x += r[k]) / d.q, (y += r[k + 1]) / d.q]);
					return l;
				})
		)
		.catch(() => null));
let limitsPromesa = null;
export const cargarLimits = () =>
	(limitsPromesa ??= fetch('/data/limits-carta.json')
		.then((r) => (r.ok ? r.json() : null))
		.then((d) => d ?? { despartaments: [], regions: [] })
		.catch(() => ({ despartaments: [], regions: [] })));


/* ---------- La couche ---------- */
export function crearColaEstelas(L, { clar = false, dalt = false, lang = 'oc', onFicha = null, cedir = null, onPus = null, zonasUI = null, activa = null, onTerritori = null, onVol = null, onLegenda = null } = {}) {
	const Cola = L.Layer.extend({
		options: {
			pane: 'estelas',
			padding: 0.3,
			// Sources de la couche, affichées avec les crédits de la carte
			attribution:
				'Rius, còsta e païses : <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> · corbas de nivèl : d’aprèp <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener">Mapzen Terrain Tiles</a> : « Europe terrain data produced using Copernicus data and information funded by the European Union - EU-DEM layers » ; « SRTM data courtesy of the U.S. Geological Survey » · noms : © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">contributors OpenStreetMap</a>'
		},

		initialize() {
			this._temaBasa = [clar, dalt];
			this._colors = {};
			this._tem = temaDe(clar, dalt);
			this._lang = lang;
			// Elements del fons que l'internauta pòt escantir (famílha « Fons » del
			// panèl) : per exemple sonque lo trach de còsta
			this._el = { estelas: true, nomsVilas: true, rius: true, nomsRius: true, corbas: true, costa: true };
			// quand la jaça dels dialèctes es alucada, lo clic e lo survòl son per
			// ela : los territòris se revèlan pas
			this._modeDial = false;
			this._onFicha = onFicha;
			this._onPus = onPus;
			// una autra còla a quicòm d'explicar jos aqueste ponch (una enclava) : lo
			// territòri se mòstra pas
			this._cedir = cedir;
			// la couche active de la légende (façon QGIS, Romain 2026-10-19) : son id ou null
			this._activa = activa;
			// le territoire choisi (ou null) : la carte dessine son contour doré
			this._onTerritori = onTerritori;
			this._onVol = onVol;
			this._onLegenda = onLegenda;
			// (lo repèr daurat de las vilas a ficha es remplaçat per la causida d'una
			// comuna e sa ficha, que pòrta lo ligam : Romain, 2026-10-11)
			this._fichas = [];
			this._calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
			this._estelas = this._estelasOc = LUOCS.map(([lon, lat, nom, vila, dia, dia2]) => ({
				lon, lat, nom, vila, dia, dia2, renc: rencDe(nom), sobrenom: SOBRENOMS[nom] ?? null,
				f: aleat(0, 6.28), v: aleat(0.2, 0.7), X: 0, Y: 0
			}));
		},

		onAdd(map) {
			if (!map.getPane('estelas')) {
				const p = map.createPane('estelas');
				p.style.zIndex = '350'; // au-dessus des tuiles, sous les couches de l'admin
				p.style.pointerEvents = 'none';
			}
			this._cv = L.DomUtil.create('canvas', 'cola-estelas leaflet-zoom-animated', map.getPane('estelas'));
			this._cx = this._cv.getContext('2d');
			// la tela de la revelacion de la carta detalhada : dessús las tuèlas
			// (200), jos los dialèctes (300)
			if (!map.getPane('revelacion')) {
				const p = map.createPane('revelacion');
				p.style.zIndex = '250';
				p.style.pointerEvents = 'none';
			}
			this._cvR = L.DomUtil.create('canvas', 'cola-revelacion leaflet-zoom-animated', map.getPane('revelacion'));
			this._cxR = this._cvR.getContext('2d');
			this._revAct = false;
			this._etiq = document.createElement('canvas');
			this._viv = new EtiquetasVivas();
			this._t0 = performance.now();
			this._pus = null;
			this._zP = null;
			this._update();
			cargarLimits().then((l) => {
				this._limitsGeo = l;
				this._zP = null;
				this._update();
			});
			cargarCorbas().then((c) => {
				this._corbasGeo = c;
				this._zP = null;
				this._update();
			});
			cargarCosta().then((c) => {
				if (!c) return;
				this._costaFina = c;
				this._zP = null;
				this._update();
			});
			// Les noms de rivières sont en Cormorant : on attend la police pour les placer
			document.fonts?.load('italic 500 16px "Cormorant Garamond"').then(() => {
				this._zP = null;
				this._update();
			});
			this._viu = true;
			// al repaus, 20 imatges per segonda pro (lo lusiment de las estelas
			// demòra doç) ; a plen ritme quand la carta bolega, al survòl, pendent
			// l'entrada en scèna e quand de noms arriban (audit de la carta,
			// 2026-10-23 : 60 imatges per segonda en permanéncia, sul telefòn tanben)
			this._actiuFins = 0;
			const despertar = () => (this._actiuFins = performance.now() + 1200);
			map.on('move zoom mousemove click', despertar);
			this._despertar = despertar;
			const bocla = (t) => {
				if (!this._viu) return;
				const intro = !this._calm && this._tIntro != null && (t - this._tIntro) / 1000 < INTRO.fin + 0.5;
				if (intro || this._etiqAnim || this._doçViu || t < this._actiuFins || t - (this._tDarr ?? 0) >= 48) {
					this._tDarr = t;
					this._dessenhar(t);
				}
				this._raf = requestAnimationFrame(bocla);
			};
			this._raf = requestAnimationFrame(bocla);
		},

		onRemove() {
			this._viu = false;
			cancelAnimationFrame(this._raf);
			if (this._despertar) this._map?.off('move zoom mousemove click', this._despertar);
			L.DomUtil.remove(this._cv);
			if (this._cvR) L.DomUtil.remove(this._cvR);
			this._cvR = this._cxR = null;
			this._map.getContainer().style.cursor = '';
		},

		getEvents() {
			const ev = {
				viewreset: this._update,
				zoom: this._onZoom,
				moveend: this._update,
				resize: this._onTalha,
				mousemove: this._onMirga,
				mouseout: this._onSortida,
				click: this._onClic
			};
			if (this._zoomAnimated) ev.zoomanim = this._onAnimZoom;
			return ev;
		},

		// La fenêtre change de taille : la vue d'ensemble aussi, donc le placement
		_onTalha() {
			this._zP = null;
			this._update();
		},

		// Un lieu trouvé par la recherche : une onde dorée le signale quelques
		// secondes, une fois la carte arrivée
		senhalar(lat, lon) {
			this._senhal = { lat, lon, t0: null };
		},

		setLenga(l) {
			this._lang = l;
		},
		// Sul site en francés, lo nom francés de la vila tanben, en pichon e en
		// italica jos l'autre (retorn de Romain, 2026-10-11 : « beaucoup de
		// francophones sont paniqués dès qu'ils ne comprennent pas ») : 'fr' =
		// lo francés d'en primièr, 'oc' = l'occitan d'en primièr, null =
		// l'occitan sol (site en occitan)
		setNomsDobles(mòde, polissa = false) {
			if (this._dobles === mòde && this._polissaSota === polissa) return;
			this._polissaSota = polissa;
			this._dobles = mòde;
			this._zP = null;
			if (this._map) this._update();
		},
		_tèxtesVila(nom) {
			const fr = this._dobles ? NOMS_FRANCES[nom] : null;
			if (!fr || fr.toLowerCase() === nom.toLowerCase()) return { t1: nom, t2: null };
			return this._dobles === 'fr' ? { t1: fr, t2: nom } : { t1: nom, t2: fr };
		},

		setTema(c, d) {
			this._temaBasa = [c, d];
			this._fonsCarta = null; // (lo fons de la tela de revelacion)
			this._revCache = null;
			this._tem = { ...temaDe(c, d), ...this._colors };
			this._construirEtiquetas();
		},

		// Elements del fons visibles ({ estelas, nomsVilas, rius, nomsRius, corbas, costa })
		setElements(el) {
			// lo relèu alucat : las corbas se tornan dessenhar al gredon (demanda de Romain)
			if (el.corbas && this._el && !this._el.corbas && !this._calm) this._tCorbas = performance.now();
			// … los rius tornan rajar de la font a la mar, las vilas s'alucan una a una
			if (el.rius && this._el && !this._el.rius && !this._calm) this._tRius = performance.now();
			if (el.estelas && this._el && !this._el.estelas && !this._calm) this._tVilas = performance.now();
			// los noms de vilas : arriban un a un (coma al zoom), se'n van un a un
			if (this._el && !this._calm && !!el.nomsVilas !== !!this._el.nomsVilas) {
				const ara = performance.now();
				if (el.nomsVilas) for (const e of this._estelas ?? []) e.visNom && (e.tNom = ara);
				else this._tNomsOff = ara;
			}
			this._el = { ...this._el, ...el };
			// los noms de rius e las vilas jògan sul plaçament dels noms (e sus
			// las bóstias que las autras còlas evitan) : tot es tornat plaçar
			this._zP = null;
			this._caixas = null;
			this._update();
		},
		// Colors causidas per l'internauta ({ riu, costa, estela, corba }) : per
		// dessús del tèma ; una valor nulla torna a la del tèma
		setColors(c) {
			this._colors = Object.fromEntries(Object.entries(c || {}).filter(([, v]) => v));
			if (this._colors.riu) this._colors.riuTèxt = this._colors.riu;
			if (this._colors.estela) this._colors.vilaTèxt = this._colors.estela;
			this.setTema(...this._temaBasa);
		},
		// Las bóstias dels noms de vilas pausats, en coordenadas projectadas al
		// zoom de la còla : las autras còlas (noms de províncias…) los evitan.
		// Res sus la carta detalhada (sas tuèlas an lors pròpris noms).
		caixasNoms() {
			const pl = this._plaçament;
			if (!pl || !this._el.nomsVilas || !this._cx || (this._detA ?? 0) > 0.5) return null;
			if (this._caixas?.pl !== pl) {
				const g = this._cx;
				g.save();
				if ('letterSpacing' in g) g.letterSpacing = '0px';
				const cs = pl.vilas.map((v) => {
					const w = g.measureText(aplicarVila(g, v.renc, v.f, v.t1 ?? v.nom)).width;
					let x0 = v.al === 'left' ? v.x : v.al === 'right' ? v.x - w : v.x - w / 2;
					if (v.t2) {
						sensEspaci(g);
						g.font = polissaSota(v.f);
						x0 = Math.min(x0, x0 + w - g.measureText(v.t2).width);
					}
					const x1 = v.al === 'left' ? v.x + w : v.al === 'right' ? v.x : v.x + w / 2;
					return [x0 - 2, v.y - v.f, x1 + 2, v.y + v.f * 0.3 + (v.hS ?? 0)];
				});
				// los ponches de las vilas visiblas (VIVAROAUPENC tombava sus Gap) ;
				// las icònas de las jaces s'i estacan (ponchs)
				const ponchs = [];
				if (this._el.estelas)
					for (const e of this._estelas)
						if (e.vis) {
							cs.push([e.X - 6, e.Y - 6, e.X + 6, e.Y + 6]);
							ponchs.push([e.X, e.Y]);
						}
				// e las letras dels noms de rius, se son afichats
				if (this._el.nomsRius && this._zoom >= (this._nivèls?.zRius ?? 0) + 0.15)
					for (const r of pl.rius) for (const l of r.letras) cs.push([l.x - r.fs * 0.4, l.y - r.fs * 0.6, l.x + r.fs * 0.4, l.y + r.fs * 0.3]);
				g.restore();
				this._caixas = { pl, z: this._zoom, cs, ponchs };
			}
			return this._caixas;
		},
		// L'entrada en scèna : son relòtge (comun a totas las còlas), e sa fin
		// d'un còp (un clic)
		setIntro(t0) {
			this._tIntro = t0;
		},
		// Las donadas d'Euròpa (1:50 M) e del mond (1:110 M) : cargadas sonque
		// quand se dezooma, projectadas al zoom actual
		_projMond(z) {
			const map = this._map;
			const zE = (this._nivèls ?? nivèlsDezoom(map)).zEuropa;
			if (z < zE + 0.15 && !this._mondEu) cargarMond('/data/mond-europa.json').then((d) => d && ((this._mondEu = d), (this._zP = null), this._update()));
			if (z < 4.2 && !this._mondTot) cargarMond('/data/mond.json').then((d) => d && ((this._mondTot = d), (this._zP = null), this._update()));
			const proj = ([lon, lat]) => {
				const q = map.project([lat, lon], z);
				return [q.x, q.y];
			};
			const preparar = (d) =>
				d.païses.map((p) => {
					const pts = p.p.map((pl) => pl.map((a) => projectar(map, a, z)));
					// (linhas dobèrtas : los contorns sens lor còsta, ont /carta a la siá, mond.mjs)
					const lns = (p.l || []).map((a) => projectar(map, a, z));
					// la largor del país a l'ecran (los pichons estats se nomenan pas de luènh)
					const xs = [...pts.flatMap((pl) => pl[0].map((q) => q[0])), ...lns.flatMap((a) => a.map((q) => q[0]))];
					return { oc: p.oc, fr: p.fr, eti: proj(p.eti), pts, lns, larg: Math.max(...xs) - Math.min(...xs) };
				});
			return {
				// (fins a la carta detalhada : luènh de l'Occitània, los païses
				// demòran quand s'apròcha, retorn de Romain)
				eu: this._mondEu && z >= 3.2 && z < Z.RELAIS + 0.75 ? preparar(this._mondEu) : null,
				tot: this._mondTot && z < Z.RELAIS + 0.75 ? preparar(this._mondTot) : null
			};
		},
		_dessenharMond(cx, o, z, ti) {
			const M = this._mondPx;
			if (!M || (!M.eu && !M.tot)) return;
			const T = this._tem,
				zE = this._nivèls?.zEuropa ?? 7.45,
				W = this._W,
				H = this._H;
			// Luènh de l'Occitània (Austràlia, outra mar…), los païses demòran
			// quand s'apròcha (retorn de Romain : la carta s'esvalissiá) ; en
			// Euròpa, los contorns d'Euròpa (pus precises), endacòm mai los del mond
			const map = this._map,
				tal = map.getSize(),
				a0 = map.latLngToContainerPoint(OCCITANIA[0]),
				a1 = map.latLngToContainerPoint(OCCITANIA[1]),
				dx = Math.max(Math.min(a0.x, a1.x) - tal.x / 2, 0, tal.x / 2 - Math.max(a0.x, a1.x)),
				dy = Math.max(Math.min(a0.y, a1.y) - tal.y / 2, 0, tal.y / 2 - Math.max(a0.y, a1.y)),
				m = Math.min(tal.x, tal.y),
				luènh = clamp((Math.hypot(dx, dy) - 0.25 * m) / (0.5 * m)),
				c = map.getCenter(),
				eEu = clamp(Math.min(c.lng + 25, 50 - c.lng, c.lat - 27, 72 - c.lat) / 4),
				aCarta = 1 - (this._detA ?? 0); // la carta detalhada pren la relèva
			const aEu = this._doç('europa', Math.max(clamp((zE + 0.15 - z) / 0.6), luènh * eEu) * clamp((z - 3.4) / 0.5)) * aCarta,
				aTot = this._doç('mond', Math.max(clamp((4.0 - z) / 0.5), luènh * (1 - eEu))) * aCarta;
			// Los contorns son bastits un còp per zoom (un Path2D), pas a cada
			// imatge : retraçar los 40 000 ponches d'Euròpa a cada imatge costava
			// 14 ms e copava la fluiditat del dezoom (retorn de Romain)
			const camin = (païses) => {
				const c = new Path2D();
				// (un contorn que travèrsa la linha de cambiament de data sauta d'un
				// bòrd del mond a l'autre : lo traç es copat a aquel saut)
				const saut = 256 * Math.pow(2, z) * 0.4;
				for (const p of païses)
					for (const pl of p.pts)
						for (const anel of pl) {
							c.moveTo(anel[0][0], anel[0][1]);
							let copat = false;
							for (let i = 1; i < anel.length; i++) {
								if (Math.abs(anel[i][0] - anel[i - 1][0]) > saut) {
									copat = true;
									c.moveTo(anel[i][0], anel[i][1]);
								} else c.lineTo(anel[i][0], anel[i][1]);
							}
							if (!copat) c.closePath();
						}
				for (const p of païses)
					for (const a of p.lns) {
						c.moveTo(a[0][0], a[0][1]);
						for (let i = 1; i < a.length; i++) c.lineTo(a[i][0], a[i][1]);
					}
				return c;
			};
			const traçar = (clau, a, larg) => {
				if (!M[clau] || a < 0.01) return;
				const c = (M[clau + 'C'] ??= camin(M[clau]));
				cx.save();
				cx.globalAlpha = a;
				cx.strokeStyle = T.costa;
				cx.lineWidth = larg;
				cx.lineJoin = 'round';
				cx.translate(-o.x, -o.y);
				cx.stroke(c);
				cx.restore();
			};
			// (en s'aprochant d'un país luènh, lo fil s'afortís un pauc)
			const fòrt = clamp((z - 4) / 3);
			traçar('tot', aTot * lerp(0.62, 0.8, fòrt), lerp(0.55, 0.8, fòrt));
			traçar('eu', aEu * lerp(0.58, 0.75, fòrt), lerp(0.6, 0.8, fòrt));
			// la còsta precisa (França) : los contorns d'Euròpa l'an pas dins son
			// emprèsa ; quand la carta de prèp s'escantís (400 → 200 km), es aicí
			// que demòra (retorn de Romain : « à 500 un bout de la côte disparaît »)
			const aCostaL = (1 - (this._aDetL ?? 0)) * aCarta * (this._el?.costa === false ? 0 : 1);
			if (aCostaL > 0.01 && this._costa?.length) {
				if (this._costaCamiDe !== this._costa) {
					const c = new Path2D();
					for (const l of this._costa) {
						c.moveTo(l[0][0], l[0][1]);
						for (let i = 1; i < l.length; i++) c.lineTo(l[i][0], l[i][1]);
					}
					this._costaCami = c;
					this._costaCamiDe = this._costa;
				}
				cx.save();
				cx.globalAlpha = aCostaL * lerp(0.58, 0.75, fòrt);
				cx.strokeStyle = T.costa;
				cx.lineWidth = lerp(0.6, 0.8, fòrt);
				cx.lineJoin = 'round';
				cx.translate(-o.x, -o.y);
				cx.stroke(this._costaCami);
				cx.restore();
			}
			// los noms dels païses d'Euròpa, sens se trucar
			const aNoms = aEu * this._doç('nomsPaïses', clamp((z - 3.9) / 0.4));
			if (aNoms < 0.01 || !M.eu) return;
			const fr = this._lang === 'fr';
			cx.save();
			cx.font = '600 10px Luciole, sans-serif';
			if ('letterSpacing' in cx) cx.letterSpacing = '0.22em';
			cx.textAlign = 'center';
			cx.textBaseline = 'middle';
			cx.fillStyle = T.estela;
			cx.shadowColor = T.ombra ?? 'rgba(18, 9, 6, 0.9)';
			cx.shadowBlur = 5;
			const pausats = [];
			for (const p of M.eu) {
				const nom = fr ? p.fr : p.oc;
				if (!nom) continue;
				const x = p.eti[0] - o.x,
					y = p.eti[1] - o.y;
				if (x < -50 || y < -20 || x > W + 50 || y > H + 20) continue;
				const t = nom.toUpperCase(),
					w = ((p.w ??= {})[t] ??= cx.measureText(t).width); // (mesurat un còp)
				if (p.larg < Math.min(w * 0.6, 40)) continue;
				const b = [x - w / 2 - 4, y - 8, x + w / 2 + 4, y + 8];
				if (pausats.some((q) => q[0] < b[2] && q[2] > b[0] && q[1] < b[3] && q[3] > b[1])) continue;
				pausats.push(b);
				cx.globalAlpha = aNoms * 0.6;
				cx.fillText(t, x, y);
			}
			cx.restore();
		},
		// las donadas de l'entrada en scèna (limits, corbas, còsta, polissas) son aquí
		prèsta() {
			return Promise.all([cargarLimits(), cargarCorbas(), cargarCosta(), document.fonts?.load('italic 500 16px "Cormorant Garamond"')]);
		},
		// los sons de l'entrada en scèna (sons.js) : menats pel dessenh
		setSons(s) {
			this._sons = s;
			this._sCosta = this._sRelèu = this._sAiga = 0;
		},
		acabarIntro() {
			this._tIntro = performance.now() - 60000;
		},
		// Les tuiles de la carte détaillée : leur opacité suit le relais
		setTeulas(layer) {
			if (layer === this._teulas) return;
			this._teulas = layer;
			this._opTeulas = null;
		},
		// Las vilas d'una autra lenga (lo catalan…), quand sa jaça es alucada
		// (demanda de Romain : « quand on sélectionne le catalan, ça fait
		// apparaître les grosses villes ») : lor nom dins la lenga, lor dialècte
		// dins la bulla ; s'alucan coma las autras, una a una. E sa còsta, ont
		// la de la carta s'arrèsta (València, las Balears, l'Alguer).
		setLengaFons(kod, fons) {
			const ls = (this._vilasLengas ??= {}),
				fach = (this._estelasLengas ??= {}),
				vilas = fons?.vilas ?? null;
			if ((ls[kod] ?? null) === vilas) return;
			ls[kod] = vilas;
			(this._costasLengas ??= {})[kod] = fons?.costa ?? null;
			// son domeni : los nívols de la revelacion s'i dobrisson coma sus l'occitan
			(this._domLengas ??= {})[kod] = fons?.domeni ?? null;
			this._revCache = null;
			this._costaExtra = Object.values(this._costasLengas).filter(Boolean).flat();
			// (una lista nòva, la part francesa sola puèi tota la lenga dins lo mòde Lengas : recalculada)
			if (vilas && (this._fachDe ??= {})[kod] !== vilas) {
				this._fachDe[kod] = vilas;
				fach[kod] = vilas.map((v) => ({
					...v,
					lenga: kod,
					dz: v.renc === 1 ? -1 : undefined,
					f: aleat(0, 6.28), v: aleat(0.2, 0.7), X: 0, Y: 0
				}));
			}
			// una vila de la carta occitana al meteis endrech qu'una vila d'una lenga
			// alucada (Baiona, Biàrritz dins lo basc) s'escafa : un sol nom, dins la
			// lenga del luòc (retorn de Romain, 2026-10-09 : « deux Baiona qui se
			// chevauchent ») ; torna quand la lenga s'escantís
			const autras = Object.keys(ls).filter((k) => ls[k]).flatMap((k) => fach[k]);
			const doblon = (e) => autras.some((v) => Math.abs(v.lat - e.lat) < 0.014 && Math.abs(v.lon - e.lon) < 0.019);
			this._estelas = [...this._estelasOc.filter((e) => !doblon(e)), ...autras];
			if (this._map) {
				for (const e of this._estelas) [e.X, e.Y] = projPonch(this._map, e, this._zoom);
				if (vilas) for (const e of fach[kod]) e.tAluc = performance.now();
				this._zP = null;
				this._caixas = null;
				this._update();
			}
		},
		setModeDialectes(on) {
			// (seulement quand les dialectes s'allument : un département choisi
			// dans la couche active reste choisi quand une autre couche change)
			if (on && !this._modeDial) {
				this._terPus = null;
				this._fixar(null);
			}
			this._modeDial = !!on;
		},
		// Le territoire choisi d'un clic : sa carte dessine son contour doré, comme
		// la commune choisie (retour de Romain, 2026-10-19 : la même jolie animation)
		_fixar(ter) {
			const a = this._terFixat;
			this._terFixat = ter;
			if (a === ter || (a && ter && a.code === ter.code && a.mena === ter.mena)) return;
			const r = ter && this._limitsGeo?.[ter.mena === 'region' ? 'regions' : 'despartaments']?.find((x) => x[0] === ter.code);
			this._onTerritori?.(r ? { mena: ter.mena, code: ter.code, anels: r[2], nom: nomTerritori(ter.mena, ter.code, r[1], this._lang) } : null);
		},
		levarTerritori() {
			this._fixar(null);
		},
		// région ou département à cette échelle, la couche active d'abord
		_menaEf(z) {
			const ta = this._terActiva();
			return ta ? (ta === 'regions' ? 'region' : 'despartament') : this._mena(z);
		},
		// régions ou départements : la couche active de la légende ?
		_terActiva() {
			const a = this._activa?.();
			return a === 'regions' || a === 'despartaments' ? a : null;
		},
		// une couche active autre que les villes et villages : les lieux ne
		// prennent plus le clic (les villes à fiche, boutons visibles, oui)
		_autraActiva() {
			const a = this._activa?.();
			return !!a && a !== 'vilas';
		},
		// I a quicòm de clicable (un luòc, una vila a ficha) jos aqueste ponch ?
		// (la còla de donadas cedís alara lo clic)
		ocupat(lp) {
			if (!this._map || !this._min) return false;
			if (this._fichaA(lp)) return true;
			if (this._zoom >= Z.RELAIS || this._autraActiva()) return false;
			const tactil = !matchMedia('(hover: hover)').matches;
			return !!this._pròche(lp, tactil ? 34 : 22, tactil ? 18 : 6);
		},

		// Una opacitat que rejonh sa cibla dins lo temps, pas d'un còp a cada cran
		// de zoom (demanda de Romain, 2026-10-09) ; la bocla d'animacion la seguís
		// (e l'imatge estatic de luènh espèra qu'aja acabat)
		_doç(clau, cibla, dura = 0.55) {
			const D = (this._doces ??= {}),
				t = performance.now();
			if (this._calm) return cibla;
			let d = D[clau];
			if (!d) d = D[clau] = { v: cibla, cibla };
			else if (d.cibla !== cibla) Object.assign(d, { de: d.v, cibla, t0: t });
			if (d.v !== d.cibla) {
				const q = clamp((t - d.t0) / (dura * 1000));
				d.v = q >= 1 ? d.cibla : d.de + (d.cibla - d.de) * easeS(q);
				if (q < 1) this._doçViu = true;
			}
			return d.v;
		},
		// Un element del fons (rius, relèu, vilas, noms…) cochat o decochat :
		// arriba e se'n va dins lo temps, pas d'un còp (demanda de Romain, 2026-10-09)
		_aEl(k, dura = 0.7) {
			return this._doç('el-' + k, this._el?.[k] ? 1 : 0, dura);
		},
		// L'etiqueta del territòri survolat, amagada quand la carta mòstra
		// autra causa al meteis endrech (l'invitacion a descobrir una lenga vesina)
		amagarLegenda(b) {
			this._legendaAmagada = !!b;
		},
		// Cada luòc vesible o pas a aqueste zoom (escalas.js) ; quand cambia, son
		// estela s'aluca (coma a l'arribada) o s'escantís, e son nom la seguís
		// (demanda de Romain, 2026-10-09 : « de manière élégante, pas d'un coup »)
		_majLuòcs() {
			const n = this._nivèls,
				z = this._zoom,
				ara = performance.now();
			if (!n || !this._estelas) return;
			// (a la primièra vista, l'entrada en scèna o l'arribada fan lo trabalh)
			const anim = (e) => e.vis !== undefined && !this._calm;
			for (const e of this._estelas) {
				const v = z >= zLuòc(e, n),
					vn = v && z >= zNomLuòc(e, n);
				if (vn !== e.visNom) {
					if (anim(e)) {
						if (vn) (e.tNom = ara), (e.tNomEsc = null);
						else e.tNomEsc = ara;
					}
					e.visNom = vn;
				}
				if (v === e.vis) continue;
				if (anim(e)) {
					if (v) (e.tAluc = ara), (e.tEsc = null);
					else e.tEsc = ara;
				}
				e.vis = v;
			}
		},

		/* Recalage : le canevas couvre la vue + une marge, en coordonnées « layer » */
		_update() {
			const map = this._map;
			if (!map || !this._cv) return;
			const p = this.options.padding,
				size = map.getSize();
			const min = map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
			const tal = size.multiplyBy(1 + 2 * p).round();
			this._min = min;
			this._center = map.getCenter();
			this._zoom = map.getZoom();
			this._zCibla = null;
			// un luòc survolat abans un zoom que mena al satellit : son nom en aur
			// demorava sus los noms de las comunas (retorn de Romain, 2026-10-11)
			if (this._zoom >= Z.RELAIS) (this._pus = null), (this._det = false);
			this._nivèls = nivèlsDezoom(map);
			this._majLuòcs();
			// sul telefon, la barra de las jaces en bas : l'etiqueta del territòri
			// se lèva d'autant (los cantons de Leaflet son ja levats en CSS)
			this._barraBas = parseFloat(getComputedStyle(map._controlCorners.bottomleft).bottom) || 0;
			L.DomUtil.setPosition(this._cv, min);
			this._dpr = Math.min(devicePixelRatio || 1, 2);
			this._W = tal.x;
			this._H = tal.y;
			this._cv.width = Math.round(tal.x * this._dpr);
			this._cv.height = Math.round(tal.y * this._dpr);
			this._cv.style.width = tal.x + 'px';
			this._cv.style.height = tal.y + 'px';
			if (this._cvR) {
				L.DomUtil.setPosition(this._cvR, min);
				const rw = Math.max(1, Math.round(tal.x * K_REV)),
					rh = Math.max(1, Math.round(tal.y * K_REV));
				if (this._cvR.width !== rw || this._cvR.height !== rh) (this._cvR.width = rw), (this._cvR.height = rh);
				this._cvR.style.width = tal.x + 'px';
				this._cvR.style.height = tal.y + 'px';
				this._revCache = null; // (fons e masca del domeni de tornar preparar)
			}
			this._o = map.getPixelOrigin().add(min); // projeté → canevas : soustraire o
			this._viv?.geometria(this._o, this._zoom, this._dpr);
			if (this._senhal && this._senhal.t0 === null) this._senhal.t0 = performance.now();

			const z = this._zoom;
			if (this._zP !== z) {
				for (const e of this._estelas) [e.X, e.Y] = projPonch(map, e, z);
				riusOrientats ??= orientarRius(RIUS, COSTA);
				this._rius = riusOrientats.map(({ nom, pes, l, o, L, cum }) => ({
					nom,
					pes,
					o,
					L,
					cum,
					pts: projectar(map, l, z)
				}));
				for (const v of this._fichas) [v.X, v.Y] = projPonch(map, v, z);
				const projAnels = (lista) =>
					(lista || []).map(([code, nom, anels]) => {
						const pa = anels.map((a) => projectar(map, a, z));
						const cami = new Path2D();
						for (const a of pa) {
							cami.moveTo(a[0][0], a[0][1]);
							for (let i = 1; i < a.length; i++) cami.lineTo(a[i][0], a[i][1]);
							cami.closePath();
						}
						return { code, nom, cami, centre: centreDe(pa) };
					});
				if (this._terFixat && this._terFixat.mena !== this._menaEf(z)) this._fixar(null);
				const dom = this._limitsGeo?.domeni;
				if (dom) {
					const proj = (a) => projectar(map, a, z);
					// le domaine en surface : la teinte d'un territoire révélé ne couvre
					// que sa partie occitanophone
					const cami = new Path2D();
					for (const a of dom.anels || []) {
						const p = proj(a);
						cami.moveTo(p[0][0], p[0][1]);
						for (let i = 1; i < p.length; i++) cami.lineTo(p[i][0], p[i][1]);
						cami.closePath();
					}
					this._domeni = { linhas: dom.linhas.map(proj), cami: dom.anels?.length ? cami : null };
				}
				// los domenis de las autras lengas alucadas (un camin per lenga,
				// pintat en « evenodd » : lors traucs, coma lo Leman, demòran)
				this._domLengasCami = Object.values(this._domLengas || {})
					.filter(Boolean)
					.map((anels) => {
						const c = new Path2D();
						for (const a of anels) {
							const p = projectar(map, a, z);
							c.moveTo(p[0][0], p[0][1]);
							for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]);
							c.closePath();
						}
						return c;
					});
				this._regions = projAnels(this._limitsGeo?.regions);
				this._deps = projAnels(this._limitsGeo?.despartaments);
				this._corbas = (this._corbasGeo || []).map(([e, l]) => [e, projectar(map, l, z)]);
				// Euròpa e lo mond (pel dezoom) : projectats sonque quand se veson
				this._mondPx = this._projMond(z);
				const costa = this._costaFina ?? COSTA;
				this._costa = (this._costaExtra?.length ? [...costa, ...this._costaExtra] : costa).map((l) => projectar(map, l, z));
				this._plaçament = z < Z.DETALH_1 ? this._plaçarTot(z) : { vilas: [], rius: [] };
				this._zP = z;
			}
			this._construirEtiquetas();
			// L'échelle a changé sous une souris immobile (région → département) :
			// le territoire sous elle se révèle sans attendre qu'elle bouge
			if (this._mirgaCP && (!this._modeDial || this._terActiva())) this._terPus = this._territoriA(map.containerPointToLayerPoint(this._mirgaCP));
		},

		_plaçarTot(z) {
			// Quatre niveaux de noms : métropoles bien marquées, une ville repère
			// par département ; en zoomant sur un département, ses villes
			// importantes (Besièrs, Lodeva…), puis les villages en retrait
			const telefon = this._map.getSize().x <= 700;
			// (sul telefòn, mai pichons : tota l'Occitània es dins 375 px ; retorn de Romain, 2026-10-11)
			const talhas = telefon ? { 1: 11.5, 2: 9.5, 3: 9, 4: 8.5 } : { 1: 17, 2: 11.5, 3: 10.5, 4: 9.5 };
			// (de luènh, sonque las vilas grandas, una o doas per dialècte ; las
			// que s'escantisson gardan lor plaça lo temps de partir)
			const renc = (e) => (capitala(e) ? 1 : e.renc);
			const ara = performance.now();
			const vilas = this._estelas
				.filter((e) => e.visNom || (e.tNomEsc != null && ara - e.tNomEsc < ESC_LUÒC))
				.sort((a, b) => renc(a) - renc(b) || rang(a.nom) - rang(b.nom))
				.map((e) => ({ nom: e.nom, ...this._tèxtesVila(e.nom), x: e.X, y: e.Y, f: talhas[renc(e)], ciutat: renc(e) <= 2, renc: renc(e), e }));
			// las zònas de l'interfàcia, del contenedor a las coordenadas de la carta
			const map = this._map,
				o = map.getPixelOrigin();
			const ocupat = (zonasUI?.() ?? []).map(([x0, y0, x1, y1]) => {
				const a = map.containerPointToLayerPoint([x0, y0]).add(o),
					b = map.containerPointToLayerPoint([x1, y1]).add(o);
				return [a.x, a.y, b.x, b.y];
			});
			return plaçar(this._cx, vilas, this._rius, !!this._el.nomsRius, ocupat, telefon);
		},

		/* Les noms sont dessinés UNE fois par recalage dans une image en mémoire,
		   puis simplement recopiés à chaque image (pas des centaines de textes
		   tournés à redessiner en continu) */
		_construirEtiquetas() {
			// (la còla pòt èsser levada de la carta : un autre fons es actiu ; son
			// estat es gardat e servirà quand tornarà)
			if (!this._map || !this._W || !this._plaçament) return;
			const c = this._etiq,
				g = c.getContext('2d'),
				T = this._tem,
				o = this._o,
				dpr = this._dpr;
			// (tela pas reallocada se sa talha cambia pas : un escafatge basta)
			if (c.width !== this._cv.width || c.height !== this._cv.height) (c.width = this._cv.width), (c.height = this._cv.height);
			else {
				g.setTransform(1, 0, 0, 1, 0, 0);
				g.clearRect(0, 0, c.width, c.height);
			}
			// (voida : pas besonh de la recopiar a cada imatge)
			const ara = performance.now(),
				// (los noms de vilas decochats s'escantisson un a un, en 1,1 s)
				nomsOff = !this._el.nomsVilas && this._tNomsOff != null && ara - this._tNomsOff < 1100,
				aNomsRius = this._aEl('nomsRius');
			this._etiqVuèg = !(((this._el.nomsVilas || nomsOff) && this._plaçament.vilas.length) || (aNomsRius > 0.01 && this._plaçament.rius.length));
			g.setTransform(dpr, 0, 0, dpr, -o.x * dpr, -o.y * dpr);
			this._viv.començar(g);
			g.strokeStyle = T.liser;
			g.lineJoin = 'round';
			g.textAlign = 'center';
			g.textBaseline = 'middle';
			g.fillStyle = T.riuTèxt;
			g.lineWidth = 3;
			const dins = (x, y) => x > o.x - 60 && x < o.x + this._W + 60 && y > o.y - 60 && y < o.y + this._H + 60;
			// Autour du lieu survolé, les noms voisins s'estompent (sa bulle les
			// recouvrirait) et le sien disparaît (la bulle le porte)
			const p = this._pus,
				ray = this._map.getSize().x <= 700 ? 70 : 150;
			const prèp = (x, y) => (p ? Math.hypot(x - p.X, y - p.Y) < ray : false);
			this._etiqPus = p;
			for (const r of aNomsRius > 0.01 && this._map.getZoom() >= (this._nivèls?.zRius ?? 0) + 0.15 ? this._plaçament.rius : []) {
				if (!dins(r.letras[0].x, r.letras[0].y)) continue;
				const m = r.letras[Math.floor(r.letras.length / 2)];
				g.globalAlpha = (prèp(m.x, m.y) ? 0.12 : 1) * aNomsRius;
				g.font = 'italic 500 ' + r.fs + 'px ' + CORMORANT;
				for (const pas of ['strokeText', 'fillText'])
					for (const l of r.letras) {
						g.save();
						g.translate(l.x, l.y);
						g.rotate(l.a);
						g[pas](l.c, 0, 0);
						g.restore();
					}
			}
			g.textBaseline = 'alphabetic';
			g.fillStyle = T.vilaTèxt;
			let enCamin = nomsOff || (aNomsRius > 0.001 && aNomsRius < 0.999);
			for (const v of this._el.nomsVilas || nomsOff ? this._plaçament.vilas : []) {
				if (!dins(v.x, v.y) || (p && v.nom === p.nom)) continue;
				// (un nom qu'arriba aprèp son estela, o que se'n va amb ela)
				const aN = aNomLuòc(v.e, ara) * (nomsOff ? 1 - easeS(clamp(((ara - this._tNomsOff) / 1000 - (v.e ? retardLuòc(v.e) * 0.35 : 0)) / 0.45)) : 1);
				if (v.e && (v.e.visNom ? aN < 1 && v.e.tNom != null : aN > 0)) enCamin = true;
				if (aN < 0.01) continue;
				const tv = aplicarVila(g, v.renc, v.f, v.t1 ?? v.nom);
				// distance du lieu survolé au TEXTE (sa boîte), pas à son point d'ancrage
				let aprèp = false;
				if (p) {
					const w = g.measureText(tv).width,
						x0 = v.al === 'left' ? v.x : v.al === 'right' ? v.x - w : v.x - w / 2;
					const dx = Math.max(x0 - p.X, 0, p.X - (x0 + w)),
						dy = Math.max(v.y - v.f - p.Y, 0, p.Y - v.y);
					aprèp = Math.hypot(dx, dy) < ray;
				}
				g.globalAlpha = { 1: 1, 2: 0.85, 3: 0.74, 4: 0.55 }[v.renc] * (aprèp ? 0.12 : 1) * aN;
				g.textAlign = v.al;
				// un liserat fin de la color del fons (lo nom se destria dels ponches
				// de las jaces, retorn de Romain 2026-10-23), un alo doç (doas
				// passadas), puèi la letra neta
				g.strokeStyle = T.liser;
				g.lineWidth = 2.2 + v.f * 0.12;
				g.strokeText(tv, v.x, v.y);
				g.shadowColor = T.liser;
				g.shadowBlur = 3 + v.f * 0.35;
				g.fillText(tv, v.x, v.y);
				g.fillText(tv, v.x, v.y);
				g.shadowBlur = 0;
				g.fillText(tv, v.x, v.y);
				if (v.t2) {
					// (lo segond nom acaba jos la darrièra letra del primièr)
					const w1 = g.measureText(tv).width,
						xFin = v.al === 'left' ? v.x + w1 : v.al === 'right' ? v.x : v.x + w1 / 2;
					sensEspaci(g);
					g.font = polissaSota(v.f);
					g.textAlign = 'right';
					const colorNom = g.fillStyle;
					g.fillStyle = COLOR_SOTA;
					g.shadowBlur = 3 + v.f * 0.3;
					g.fillText(v.t2, xFin, v.y + v.hS);
					g.fillText(v.t2, xFin, v.y + v.hS);
					g.shadowBlur = 0;
					g.fillText(v.t2, xFin, v.y + v.hS);
					g.fillStyle = colorNom;
				}
			}
			this._viv.acabar();
			this._viv.pintar(g, 1, 1, true);
			this._etiqAnim = enCamin;
			g.shadowColor = 'transparent';
			sensEspaci(g);
			g.globalAlpha = 1;
		},

		/* Animation de zoom : on étire le canevas comme Leaflet le fait pour ses
		   propres couches, puis on redessine net à la fin */
		// La revelacion, coma s'arribàvem dels nívols cap a la tèrra (retorn de
		// Romain : « plus discret, soigné, élégant », pas de tacas anarquicas) :
		// un sol rond, fondut, s'espandís de l'endrech zoomat e descobrís la
		// carta detalhada, sonque sus la tèrra occitana (seguís la jaça colorada,
		// desborda pas sus la mar) ; la mar e las tèrras vesinas se desnivolan a
		// la fin, d'un fondut egal ; la carta passa del flo al net. La posicion es
		// gardada en ponch absolut al zoom de partença : sauta pas a la fin del
		// zoom. En se dezoomant, los nívols tornan.
		_revelar(pr, t, cibla) {
			const c = this._cxR,
				cv = this._cvR,
				map = this._map;
			if (!c || !map) return;
			const el = map.getContainer();
			if (pr <= 0.001 || pr >= 0.999 || this._calm) {
				if (this._revAct) {
					c.setTransform(1, 0, 0, 1, 0, 0);
					c.clearRect(0, 0, cv.width, cv.height);
					el.classList.remove('revelant', 'net');
					this._revAct = false;
				}
				this._revCibla = cibla;
				return;
			}
			if (!this._revAct || this._revCibla !== cibla) {
				const debuta = !this._revAct;
				this._revAct = true;
				this._revCibla = cibla;
				// lo flo de las tuèlas : una transicion CSS que lo navegador mena sol
				// (pas de calcul a cada imatge) ; vèrs lo net en s'aprochant, vèrs lo
				// flo en se dezoomant
				el.style.setProperty('--rev-dur', DURADA_RELAIS * (cibla ? 1 - pr : pr) + 's');
				if (debuta) {
					el.classList.add('revelant');
					el.classList.toggle('net', !cibla);
					void el.offsetWidth; // (l'estat de partença pren efièch abans la transicion)
				}
				el.classList.toggle('net', !!cibla);
				if (debuta) {
					const zR = this._zoom,
						size = map.getSize(),
						cp = this._mirgaCP ?? size.divideBy(2),
						pd = this.options.padding,
						// (dins lo repèri de la tela, al zoom de partença : pendent un zoom
						// animat, Leaflet a ja passat sos repèris al zoom d'arribada)
						P = L.point(this._o.x + size.x * pd + cp.x, this._o.y + size.y * pd + cp.y);
					const zf = Math.max(zR, this._zCibla ?? zR),
						dMax = Math.max(Math.hypot(cp.x, cp.y), Math.hypot(size.x - cp.x, cp.y), Math.hypot(cp.x, size.y - cp.y), Math.hypot(size.x - cp.x, size.y - cp.y));
					// (lo rond, a sa talha finala, cobrís tota la vista d'arribada)
					this._rev = { zR, x: P.x, y: P.y, Rmax: (dMax * 1.12) / 0.55 / Math.pow(2, zf - zR) };
				}
			}
			const R = this._rev,
				s = Math.pow(2, this._zoom - R.zR),
				o = this._o,
				W = this._W,
				H = this._H,
				w = cv.width,
				h = cv.height,
				k = w / W;
			// lo fons dels nívols e la masca de la tèrra occitana : preparats un còp
			// per posicion de la carta, pas a cada imatge
			const Q = (this._revCache ??= this._prepRev(w, h, k));
			// los nívols…
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.globalAlpha = 1;
			c.globalCompositeOperation = 'copy';
			c.drawImage(Q.fons, 0, 0);
			// … traucats per un rond fondut, sonque sus la tèrra occitana
			const r = Math.max(1, easeIO(pr) * R.Rmax * s),
				x = R.x * s - o.x,
				y = R.y * s - o.y,
				g = Q.trab.getContext('2d');
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.globalCompositeOperation = 'copy';
			const gr = g.createRadialGradient(x * k, y * k, r * k * 0.55, x * k, y * k, r * k);
			gr.addColorStop(0, '#000');
			gr.addColorStop(1, 'rgba(0, 0, 0, 0)');
			g.fillStyle = gr;
			g.fillRect(0, 0, w, h);
			if (Q.dom) {
				g.globalCompositeOperation = 'destination-in';
				g.drawImage(Q.dom, 0, 0);
			}
			c.globalCompositeOperation = 'destination-out';
			c.drawImage(Q.trab, 0, 0);
			// la mar e las tèrras vesinas : se desnivolan a la fin, egalament
			const aRèsta = easeS(clamp((pr - 0.45) / 0.55));
			if (aRèsta > 0.001) {
				c.globalAlpha = aRèsta;
				c.fillStyle = '#000';
				c.fillRect(0, 0, w, h);
				c.globalAlpha = 1;
			}
			c.globalCompositeOperation = 'source-over';
		},
		// Lo fons dels nívols (la color e l'alo de la carta) e la masca de la
		// tèrra occitana, a la resolucion de la tela
		_prepRev(w, h, k) {
			const map = this._map,
				f = (this._fonsCarta ??= fonsDe(map.getContainer())),
				size = map.getSize(),
				pd = this.options.padding,
				o = this._o;
			const tela = () => {
				const t = document.createElement('canvas');
				t.width = w;
				t.height = h;
				return t;
			};
			const fons = tela(),
				gf = fons.getContext('2d');
			gf.fillStyle = f.fons;
			gf.fillRect(0, 0, w, h);
			if (f.terra) {
				gf.setTransform(k, 0, 0, k, 0, 0);
				gf.translate(size.x * pd + size.x * 0.45, size.y * pd + size.y * 0.55);
				gf.scale(size.x * 0.6, size.y * 0.55);
				const g = gf.createRadialGradient(0, 0, 0, 0, 0, 1);
				g.addColorStop(0, `rgba(${f.terra}, 0.16)`);
				g.addColorStop(0.75, `rgba(${f.terra}, 0)`);
				gf.fillStyle = g;
				gf.fillRect(-2, -2, 4, 4);
			}
			// (la tèrra occitana e la de las autras lengas alucadas)
			let dom = null;
			const camins = [this._domeni?.cami, ...(this._domLengasCami || [])].filter(Boolean);
			if (camins.length) {
				dom = tela();
				const gd = dom.getContext('2d');
				gd.setTransform(k, 0, 0, k, -o.x * k, -o.y * k);
				gd.fillStyle = '#000';
				for (const c of camins) gd.fill(c, 'evenodd');
			}
			return { fons, dom, trab: tela() };
		},
		_onAnimZoom(e) {
			this._zCibla = e.zoom; // le relais part avec le mouvement
			this._transformar(e.center, e.zoom);
		},
		_onZoom() {
			this._zCibla = this._map.getZoom(); // pincement au doigt : idem
			this._transformar(this._map.getCenter(), this._map.getZoom());
		},
		_transformar(center, zoom) {
			const map = this._map;
			if (!this._center) return;
			const scale = map.getZoomScale(zoom, this._zoom),
				viewHalf = map.getSize().multiplyBy(0.5 + this.options.padding),
				currentCenterPoint = map.project(this._center, zoom),
				topLeftOffset = viewHalf.multiplyBy(-scale).add(currentCenterPoint).subtract(map._getNewPixelOrigin(center, zoom));
			L.DomUtil.setTransform(this._cv, topLeftOffset, scale);
			if (this._cvR) L.DomUtil.setTransform(this._cvR, topLeftOffset, scale);
		},

		/* Survol et toucher : le lieu le plus proche, les villes passent devant */
		_pròche(lp, ray, bonus) {
			// ni estelas ni noms : pas res a pausar lo det dessús
			if (!this._el.estelas && !this._el.nomsVilas) return null;
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			// Sonque los luòcs dont lo nom es afichat a aquesta escala se pòdon
			// pausar (retorn de Romain) : de luènh, las vilas grandas e una vila
			// repèr per despartament ; los vilatges sens nom (Lo Vigan, Sant
			// Africa…) agachan pas lo survòl de las regions. Meteisses paliers que
			// los noms (_plaçarTot).
			let best = null,
				bestD = Infinity;
			for (const e of this._estelas) {
				if (!e.visNom) continue;
				const d = Math.hypot(e.X - this._o.x - x, e.Y - this._o.y - y);
				const sc = d - bonus * ({ 1: 1.3, 2: 1, 3: 0.6, 4: 0 }[e.renc]);
				if (d < ray && sc < bestD) {
					best = e;
					bestD = sc;
				}
			}
			// lo nom tanben, pas sonque lo ponch : un clic sus las letras de
			// « Clarmont-Ferrand », a drecha de son ponch, causís la vila (retorn de
			// Romain, 2026-10-23)
			return best ?? this._nomA(x + this._o.x, y + this._o.y);
		},
		// la vila dont lo nom pausat conten aqueste ponch (meteissas bóstias que caixasNoms)
		_nomA(px, py) {
			const pl = this._plaçament;
			if (!pl?.vilas?.length || !this._el.nomsVilas || !this._cx) return null;
			const g = this._cx;
			g.save();
			if ('letterSpacing' in g) g.letterSpacing = '0px';
			let trobada = null;
			for (const v of pl.vilas) {
				if (!v.e || py < v.y - v.f - 2 || py > v.y + v.f * 0.3 + (v.hS ?? 0) + 2) continue;
				const w = g.measureText(aplicarVila(g, v.renc, v.f, v.t1 ?? v.nom)).width;
				const x0 = v.al === 'left' ? v.x : v.al === 'right' ? v.x - w : v.x - w / 2;
				if (px >= x0 - 4 && px <= x0 + w + 4) {
					trobada = v.e;
					break;
				}
			}
			g.restore();
			return trobada;
		},
		// Le repère d'une ville à fiche n'apparaît qu'avec la carte détaillée (de
		// loin, on clique sur l'étoile) ; il flotte au-dessus du nom OSM, d'autant
		// plus haut que ce nom grossit avec le zoom (à 1 km d'échelle, il
		// mangeait le « el » de Montpelhièr)
		_aRepèr() {
			return this._detA ?? 0;
		},
		_posFicha(v) {
			const z = this._zoom;
			return { x: v.X - this._o.x, y: v.Y - this._o.y - (26 + Math.max(0, z - 10) * 6), R: 9 };
		},
		_fichaA(lp) {
			if (this._aRepèr() < 0.3) return null;
			const x = lp.x - this._min.x,
				y = lp.y - this._min.y;
			for (const v of this._fichas) {
				const p = this._posFicha(v);
				if (Math.hypot(p.x - x, p.y - y) < p.R * 1.45 + 8) return v;
			}
			return null;
		},
		// Région ou département ? Le survol montre la couche cochée la plus fine
		// à cette échelle (retours de Romain : départements seuls cochés, le
		// clic montrait la région ; communes cochées, il montrait le département).
		// Rien de coché : selon l'échelle, pour explorer.
		_mena(z) {
			const m = menaTerritori(z);
			if (!m) return null;
			const { regions, despartaments, comunas } = this._terJaces ?? {};
			// la commune (couche thématique) prend le dessus dès qu'elle se voit
			if (comunas && z >= (this._nivèls?.zComunas ?? Z.COMUNAS) - 0.01) return null;
			if (regions && despartaments) return m;
			if (despartaments) return 'despartament';
			if (regions) return 'region';
			// communes seules cochées : rien avant leur échelle
			if (comunas) return null;
			return m;
		},
		setTerritoris(t) {
			const a = this._terJaces;
			if (a && a.regions === t.regions && a.despartaments === t.despartaments && a.comunas === t.comunas) return;
			this._terJaces = t;
			this._terPus = null;
			this._fixar(null);
		},
		// Le territoire (région ou département) sous un point
		_territoriA(lp) {
			// Couche active (façon QGIS, Romain 2026-10-19) : régions ou départements
			// répondent même sous les dialectes, dans toute leur plage (300 à 5 km) ;
			// une autre couche active : ils lui cèdent le clic
			const ta = this._terActiva();
			let mena;
			if (ta) {
				const lat = this._map.getCenter().lat;
				if (this._zoom < zDès(300, lat) - 0.01 || this._zoom >= zDès(5, lat)) return null;
				mena = ta === 'regions' ? 'region' : 'despartament';
			} else {
				if (this._activa?.() || this._modeDial || this._cedir?.(lp)) return null;
				mena = this._mena(this._zoom);
			}
			const lista = mena === 'region' ? this._regions : mena === 'despartament' ? this._deps : null;
			if (!lista?.length) return null;
			this._cxTest ??= document.createElement('canvas').getContext('2d');
			const po = this._map.getPixelOrigin(),
				x = lp.x + po.x,
				y = lp.y + po.y;
			for (const t of lista) if (this._cxTest.isPointInPath(t.cami, x, y, 'evenodd')) return { mena, code: t.code };
			return null;
		},
		_onMirga(e) {
			if (e.originalEvent?.pointerType === 'touch') return;
			// de luènh (carta simplificada), pas cap de survòl
			if (this._nivèls && aDetalh(this._nivèls, this._zoom) < 0.25) {
				this._terPus = this._fichaPus = null;
				this._map.getContainer().style.cursor = '';
				return;
			}
			this._mirgaCP = e.containerPoint;
			const ter = this._territoriA(e.layerPoint);
			if (ter?.code !== this._terPus?.code || ter?.mena !== this._terPus?.mena) this._terPus = ter;
			const f = this._fichaA(e.layerPoint);
			// la bulle d'aide (ou touchée) reste ses quelques secondes, même si la
			// souris bouge ailleurs
			if (f || !this._fichaDet) this._fichaPus = f;
			if (f) {
				if (this._pus) {
					this._pus = null;
					this._construirEtiquetas();
				}
				this._map.getContainer().style.cursor = 'pointer';
				return;
			}
			// (la main sur ce qui se choisit : un territoire, ou un lieu quand les
			// villages prennent le clic ; audit des clics, 2026-10-19)
			if (this._zoom >= Z.RELAIS) {
				this._map.getContainer().style.cursor = ter ? 'pointer' : '';
				// (lo satellit a sos noms de comunas : pas de survòl de la carta estelada)
				if (this._pus) (this._pus = null), this._construirEtiquetas();
				return;
			}
			this._pus = this._pròche(e.layerPoint, 22, 6);
			this._det = false;
			if (this._pus !== this._etiqPus) this._construirEtiquetas();
			this._map.getContainer().style.cursor = (this._pus && !this._autraActiva()) || ter ? 'pointer' : '';
		},
		_onSortida() {
			this._terPus = null;
			this._mirgaCP = null;
			if (!this._fichaDet) this._fichaPus = null;
			if (this._det) return;
			this._pus = null;
			if (this._etiqPus) this._construirEtiquetas();
		},
		// Clic sur un lieu : la carte y vole et s'en approche. Au doigt, un
		// premier toucher montre le nom (dans une bulle au-dessus du doigt), un
		// second sur le même lieu y emmène.
		// Doble clic (centrar.js) : una vila a ficha o un luòc jos lo ponch
		// (ponches), o lo territòri revelat (despartament o region)
		ponchA(lp) {
			if (!this._map || !this._min) return null;
			const tactil = !matchMedia('(hover: hover)').matches;
			const f = this._fichaA(lp) ?? (this._zoom < Z.RELAIS ? this._pròche(lp, tactil ? 34 : 22, tactil ? 18 : 6) : null);
			return f ? { centre: [f.lat, f.lon] } : null;
		},
		cadreA(lp) {
			if (!this._map || !this._min || (this._nivèls && aDetalh(this._nivèls, this._zoom) < 0.25)) return null;
			const ter = this._territoriA(lp);
			const lista = ter && this._limitsGeo?.[ter.mena === 'region' ? 'regions' : 'despartaments'];
			const r = lista?.find((x) => x[0] === ter.code);
			const b = r && emprèsa(r[2]);
			return b ? { bounds: b } : null;
		},
		_onClic(e) {
			// (lo segond clic d'un doble clic : la vista se centra, lo territòri demòra)
			if (e.originalEvent?.detail > 1) return;
			if (this._nivèls && aDetalh(this._nivèls, this._zoom) < 0.25) return;
			const tactil = e.originalEvent?.pointerType === 'touch' || !matchMedia('(hover: hover)').matches;
			// Une ville à fiche : de loin, on y vole ; de près, on ouvre sa page
			// (ou la bulle dit « Lèu » tant qu'elle n'est pas écrite)
			const f = this._fichaA(e.layerPoint);
			if (f) {
				this._pus = null;
				if (this._zoom < Z.RELAIS) {
					this._map.flyTo([f.lat, f.lon], Z.VOL, { duration: this._calm ? 0 : 1.8 });
					this._onVol?.(f);
				} else if (f.ligam && this._onFicha) {
					this._onFicha(f);
				} else {
					this._fichaPus = f;
					this._fichaDet = true;
					this._fichaTòc = performance.now();
				}
				return;
			}
			// (une autre couche active : le clic est pour elle, pas pour les lieux)
			const lòc = this._autraActiva() ? null : this._pròche(e.layerPoint, tactil ? 34 : 22, tactil ? 18 : 6);
			if (!lòc) {
				if (tactil) this._pus = null;
				// Un clic dans un vide : le département (ou la région) se révèle et
				// reste, avec son nom ; un second clic dessus le libère
				const ter = this._territoriA(e.layerPoint);
				const meme = ter && this._terFixat && ter.code === this._terFixat.code && ter.mena === this._terFixat.mena;
				this._fixar(ter && !meme ? ter : null);
				return;
			}
			if (tactil && this._pus !== lòc) {
				this._pus = lòc;
				this._det = true;
				this._tòc = performance.now();
				this._construirEtiquetas();
				return;
			}
			this._pus = null;
			const z = Math.min(Math.max(this._zoom + 2.5, Z.VOL), 12);
			this._map.flyTo([lòc.lat, lòc.lon], z, { duration: this._calm ? 0 : 1.8 });
			this._onVol?.(lòc);
		},

		_dessenhar(t) {
			const cx = this._cx;
			if (!cx || !this._W) return;
			// (de noms de vilas qu'arriban o se'n van : l'imatge dels noms se refa)
			if (this._etiqAnim) this._construirEtiquetas();
			// Al dezoom, las jaces de detalh s'escantisson (a « 500 km » demòra
			// sonque lo contorn de l'Occitània, pintat per la còla dels
			// dialèctes) ; los païses se pintan per dessús. L'escantiment avança
			// dins lo temps, pas de cran en cran (se fasiá per saumets).
			const z = this._zoom,
				dtD = Math.min(0.1, (t - (this._tPrecD ?? t)) / 1000),
				cib = this._nivèls ? aDetalh(this._nivèls, z) : 1;
			this._tPrecD = t;
			this._aDetL = this._calm || this._aDetL === undefined ? cib : this._aDetL + (cib - this._aDetL) * Math.min(1, dtD / 0.3);
			if (Math.abs(this._aDetL - cib) < 0.002) this._aDetL = cib;
			const aDet = this._aDetL;
			// de luènh, quand res bolèga pas, l'imatge demòra : pas besonh de la
			// tornar pintar 60 còps per segonda (sobrietat)
			const tiE = this._calm ? 99 : (t - (this._tIntro ?? -1e12)) / 1000;
			const doçViu = this._doçViu;
			this._doçViu = false;
			const clau = aDet <= 0.001 && tiE > INTRO.fin && !doçViu ? [z, this._min?.x, this._min?.y, this._W, this._H, !!this._mondEu, !!this._mondTot, this._lang, this._tem?.costa, this._detA].join('|') : null;
			if (clau && clau === this._clauEstatica) return;
			this._clauEstatica = clau;
			this._dessenharDetalh(t);
			if (aDet < 0.999) {
				cx.save();
				cx.setTransform(1, 0, 0, 1, 0, 0);
				cx.globalCompositeOperation = 'destination-out';
				cx.globalAlpha = 1 - aDet;
				cx.fillRect(0, 0, this._cv.width, this._cv.height);
				cx.restore();
			}
			// Europa, puèi lo mond, quand se dezooma (demanda de Romain) : los
			// contorns dels païses en fil fin coma la còsta, lors noms en
			// capitalas espaçadas ; l'Occitània demòra al mitan
			cx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
			const ti = this._calm ? 99 : (t - (this._tIntro ?? -1e12)) / 1000;
			this._dessenharMond(cx, this._o, z, ti);
		},
		_dessenharDetalh(t) {
			const cx = this._cx,
				W = this._W,
				H = this._H,
				o = this._o,
				T = this._tem,
				z = this._zoom;
			if (!cx || !W) return;
			cx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
			cx.clearRect(0, 0, W, H);
			const temps = (t - this._t0) / 1000;
						// lo relòtge de l'entrada en scèna (en segondas ; tot es fach se lo
			// sistèma demanda mens de movement)
			const ti = this._calm ? 99 : (t - (this._tIntro ?? -1e12)) / 1000;
			const fase = ([a, b]) => clamp((ti - a) / (b - a));
			// Le relais avance dans le temps, pas avec le zoom (jamais les deux
			// cartes à moitié). Retour de Romain, « trop brutal » : ≈ 1 s, en trois
			// temps qui se chevauchent, chacun accéléré puis ralenti : les noms, les
			// rivières, le relief et la côte (que les tuiles ont aussi) s'en vont
			// d'abord, puis les tuiles montent pendant que les points passent en
			// filigrane. Jamais deux jeux de noms ensemble.
			const dt = Math.min(0.1, (t - (this._tPrec ?? t)) / 1000);
			this._tPrec = t;
			// (dès le début du mouvement de zoom, pas à sa fin)
			const cibla = (this._zCibla ?? z) >= Z.RELAIS ? 1 : 0;
			// la revelacion espèra que las tuèlas sián cargadas (al mai 1,5 s) : sens
			// aquò, las tacas descobrissián un fons void e las tuèlas susissián aprèp
			const cargan = cibla === 1 && this._relais < 1 && !!this._teulas?.isLoading?.();
			if (!cargan) this._esperaDe = null;
			else this._esperaDe ??= t;
			const espèra = cargan && t - this._esperaDe < 1500;
			const pr = (this._relais =
				this._calm || this._relais === undefined
					? cibla
					: cibla > this._relais
						? espèra
							? this._relais
							: Math.min(cibla, this._relais + dt / DURADA_RELAIS)
						: Math.max(cibla, this._relais - dt / DURADA_RELAIS));
			this._detA = easeIO(pr);
			const aGen = 1 - 0.85 * easeS(clamp((pr - 0.1) / 0.9)),
				aRius = 1 - easeIO(clamp(pr / 0.45)),
				aEtiq = aRius;
			// a « 200 km », pas pus de rius (retorn de Romain) : s'escantisson doçament
			const nv = this._nivèls,
				cRius = nv ? this._doç('rius', easeS(clamp((z - nv.zRius + 0.05) / 0.2))) : 1;
			this._riusZ = this._calm || this._riusZ === undefined ? cRius : this._riusZ + (cRius - this._riusZ) * Math.min(1, dt / 0.35);
			const aRiu = aRius * this._riusZ;
			// La revelacion de la carta detalhada (retorn de Romain : « plus
			// soignée et impressionne ») : las tuèlas son descobèrtas per de tacas
			// d'encre que s'espandisson de l'endrech zoomat e de las vilas grandas
			this._revelar(pr, t, cibla);
			const opTeulas = this._cxR && !this._calm ? (pr > 0.001 ? 1 : 0) : easeS(clamp((pr - 0.25) / 0.75));
			if (this._teulas && Math.abs(opTeulas - (this._opTeulas ?? -1)) > 0.004) {
				this._teulas.setOpacity(opTeulas);
				this._opTeulas = opTeulas;
			}
			const gros = 1 + Math.max(0, z - 7) * 0.14;

			// Le territoire révélé (survolé, ou fixé par un clic dans un vide) :
			// surface à peine teintée, liseré crème, et son nom en petites capitales
			// D'un territoire à l'autre, et d'une région à ses départements quand
			// l'échelle change, l'un s'efface pendant que l'autre vient (retour de
			// Romain : « plus fluide, agréable ») : chacun a son propre fondu
			this._legendaT = [];
			const cibla2 = this._terFixat ?? this._terPus;
			const clauT = cibla2 && this._mena(z) === cibla2.mena ? cibla2.mena + cibla2.code : null;
			this._terVists ??= new Map();
			if (clauT && !this._terVists.has(clauT)) this._terVists.set(clauT, { mena: cibla2.mena, code: cibla2.code, p: 0 });
			for (const [clau, v] of this._terVists) {
				const cib = clau === clauT ? 1 : 0;
				v.p = this._calm ? cib : cib > v.p ? Math.min(1, v.p + dt / 0.35) : Math.max(0, v.p - dt / 0.45);
				v.fixat = cib === 1 && cibla2 === this._terFixat;
				if (!cib && v.p <= 0) this._terVists.delete(clau);
			}
			for (const v of this._terVists.values()) {
				const t = (v.mena === 'region' ? this._regions : this._deps)?.find((x) => x.code === v.code);
				if (t) {
					const a = easeIO(v.p),
						reg = v.mena === 'region';
					cx.save();
					cx.translate(-o.x, -o.y);
					// La teinte seulement sur la partie occitanophone du territoire
					// (demande de Romain : le reste garde le fond du nord de la
					// France) ; le contour en pointillé, lui, fait tout le territoire
					cx.save();
					if (this._domeni?.cami) cx.clip(this._domeni.cami, 'evenodd');
					cx.globalAlpha = a * 0.11;
					cx.fillStyle = T.estela;
					cx.fill(t.cami, 'evenodd');
					cx.restore();
					cx.globalAlpha = a * 0.6;
					cx.strokeStyle = T.estela;
					cx.lineWidth = reg ? 1.3 : 1.1;
					cx.setLineDash(reg ? [8, 5] : [3, 3]);
					cx.stroke(t.cami);
					cx.restore();
					// son nom s'écrit en dernier (au-dessus des noms de lieux), voir plus bas
					this._legendaT.push({ t, reg, fixat: v.fixat, a });
				}
			}

			// Le relief : courbes de niveau très discrètes, les maîtresses
			// (tous les 1 000 m) un peu plus marquées. À l'arrivée, elles montent
			// comme une marée : les basses d'abord, les sommets ensuite.
			const aCorb = aRius * this._aEl('corbas');
			if (aCorb > 0.01 && this._corbas?.length) {
				const pas = pasCorbas(z);
				const [c0, c1] = INTRO.corbas;
				// (alucadas après l'entrada en scèna : la meteissa montada, tornada jogar)
				const tiC = this._tCorbas == null ? ti : Math.min(ti, c0 + (t - this._tCorbas) / 1000);
				if (this._tCorbas != null && tiC >= c1) this._tCorbas = null;
				cx.strokeStyle = T.corba;
				cx.lineJoin = 'round';
				for (const mestra of [false, true]) {
					cx.lineWidth = mestra ? 0.8 : 0.6;
					if (tiC >= c1) {
						// … e s'escantís quand la darrièra es pausada
						if (this._sRelèu === 1) (this._sRelèu = 2), this._sons?.relèu(false);
						cx.globalAlpha = aCorb * (mestra ? 0.3 : 0.13);
						cx.beginPath();
						for (const [e, l] of this._corbas) {
							if (e % pas || (e % 1000 === 0) !== mestra) continue;
							cx.moveTo(l[0][0] - o.x, l[0][1] - o.y);
							for (let i = 1; i < l.length; i++) cx.lineTo(l[i][0] - o.x, l[i][1] - o.y);
						}
						cx.stroke();
						continue;
					}
					// cada corba a son torn : nivèl per nivèl (dels basses als cims), e
					// d'oèst en èst dins un nivèl, sus tota la durada de la montada
					const nivèls = [...new Set(this._corbas.filter(([e]) => e % pas === 0).map(([e]) => e))].sort((a, b) => a - b);
					for (let k = 0; k < this._corbas.length; k++) {
						const [e, l] = this._corbas[k];
						if (e % pas || (e % 1000 === 0) !== mestra) continue;
						const renc = nivèls.indexOf(e) / Math.max(1, nivèls.length - 1),
							oèst = clamp((l[0][0] - o.x) / W);
						// cada corba se dessenha al gredon, d'un cap a l'autre (retorn de
						// Romain : « pas qu'elles apparaissent en flou »)
						const aE = clamp((tiC - (c0 + renc * (c1 - c0 - 1.15) + oèst * 0.45)) / 0.7);
						// la tèrra bramís a partir de la primièra corba que pareis
						if (aE > 0 && this._sons && !this._sRelèu) (this._sRelèu = 1), this._sons.relèu(true);
						if (aE < 0.005) continue;
						const kc = easeS(aE) * (l.length - 1),
							n = Math.floor(kc);
						cx.globalAlpha = aCorb * (mestra ? 0.3 : 0.13) * Math.min(1, 0.4 + aE * 1.5);
						cx.beginPath();
						cx.moveTo(l[0][0] - o.x, l[0][1] - o.y);
						for (let i = 1; i <= n; i++) cx.lineTo(l[i][0] - o.x, l[i][1] - o.y);
						if (n < l.length - 1) cx.lineTo(lerp(l[n][0], l[n + 1][0], kc - n) - o.x, lerp(l[n][1], l[n + 1][1], kc - n) - o.y);
						cx.stroke();
					}
				}
			}


			// Le trait de côte : un fil très fin qui structure la carte, posé
			// avant les rivières ; la carte détaillée a le sien, il s'efface avec
			// elle. À l'arrivée, il se trace comme un trait de plume.
			const fCosta = easeIO(fase(INTRO.costa));
			// lo gredon : del primièr tròç de còsta al darrièr
			// (l'arrèst se fa quin que siá ti : un onglet amagat suspend lo dessenh,
			// pas lo son)
			if (this._sons) {
				if (fCosta > 0 && fCosta < 1 && !this._sCosta) (this._sCosta = 1), this._sons.crayon(true);
				else if (fCosta >= 1 && this._sCosta === 1) (this._sCosta = 2), this._sons.crayon(false);
			}
			if (fCosta > 0.001 && aRius > 0.01 && this._el.costa && this._costa) {
				cx.globalAlpha = aRius;
				cx.strokeStyle = T.costa;
				cx.lineWidth = 0.8;
				cx.lineJoin = 'round';
				cx.beginPath();
				for (const l of this._costa) {
					const k = fCosta * (l.length - 1),
						n = Math.floor(k);
					cx.moveTo(l[0][0] - o.x, l[0][1] - o.y);
					for (let i = 1; i <= n; i++) cx.lineTo(l[i][0] - o.x, l[i][1] - o.y);
					if (n < l.length - 1) cx.lineTo(lerp(l[n][0], l[n + 1][0], k - n) - o.x, lerp(l[n][1], l[n + 1][1], k - n) - o.y);
				}
				cx.stroke();
			}

			// Les rivières : à l'arrivée, l'eau sort de chaque source et descend
			// jusqu'à la mer (ou à la rivière qu'elle rejoint), à la même vitesse
			// partout, avec un petit éclat au front
			const aRiuE = aRiu * this._aEl('rius');
			if (aRiuE > 0.01 && this._rius) {
				const [r0, r1] = INTRO.rius;
				// (alucats aprèp l'entrada en scèna : l'aiga torna rajar de la font a la mar)
				const tiR = this._tRius == null ? ti : Math.min(ti, r0 + (t - this._tRius) / 1000);
				if (this._tRius != null && tiR >= r1) this._tRius = null;
				const fiMax = (this._fiMax ??= Math.max(...this._rius.map((r) => r.o + r.L)));
				const D = tiR >= r1 ? Infinity : Math.max(0, tiR - r0) * (fiMax / (r1 - r0));
				cx.strokeStyle = T.riu;
				cx.lineCap = 'round';
				cx.lineJoin = 'round';
				const fronts = [];
				let enCors = 0; // rius (nomenats o pas) que corron encara
				for (const r of this._rius) {
					const l = r.pts,
						long = D - r.o;
					if (long <= 0) continue;
					cx.globalAlpha = (r.nom ? 0.75 : 0.25) * aRiuE;
					cx.lineWidth = (0.4 + r.pes * 0.22) * gros;
					cx.beginPath();
					cx.moveTo(l[0][0] - o.x, l[0][1] - o.y);
					let i = 1;
					for (; i < l.length && r.cum[i] <= long; i++) cx.lineTo(l[i][0] - o.x, l[i][1] - o.y);
					if (i < l.length) {
						enCors++;
						const f = (long - r.cum[i - 1]) / (r.cum[i] - r.cum[i - 1] || 1);
						const x = lerp(l[i - 1][0], l[i][0], f) - o.x,
							y = lerp(l[i - 1][1], l[i][1], f) - o.y;
						cx.lineTo(x, y);
						if (r.nom) fronts.push([x, y, r.pes]);
					}
					cx.stroke();
				}
				// l'aiga : tant fòrta coma i a de rius que corron, fins que lo
				// darrièr a tocat la mar
				if (this._sons && this._sAiga !== 2) {
					const n = D === Infinity ? 0 : enCors;
					if (n > 0) this._sAiga = 1;
					if (this._sAiga === 1) this._sons.aiga(n);
					if (this._sAiga === 1 && n === 0) this._sAiga = 2;
				}
				if (fronts.length) {
					cx.save();
					cx.fillStyle = T.riu;
					cx.shadowColor = T.riu;
					cx.shadowBlur = 8;
					cx.globalAlpha = 0.9 * aRiuE;
					for (const [x, y, pes] of fronts) {
						cx.beginPath();
						cx.arc(x, y, (0.8 + pes * 0.2) * gros, 0, 6.283);
						cx.fill();
					}
					cx.restore();
				}
			}

			// La frontière linguistique est dessinée par la còla de donadas
			// (colaDonadas.js), sous les étoiles : elle vaut pour tous les fonds.

			// Les lieux : de loin, seulement les grandes villes ; les autres
			// viennent en s'approchant. À l'arrivée, les grandes villes
			// s'allument une à une, avec un halo qui s'ouvre.
			cx.fillStyle = T.estela;
			// (alucadas aprèp l'entrada en scèna : la meteissa arribada, tornada jogar)
			const tiV = this._tVilas == null ? ti : Math.min(ti, INTRO.vilas[0] + (t - this._tVilas) / 1000);
			if (this._tVilas != null && tiV > INTRO.vilas[1] + 1.2) this._tVilas = null;
			const faseV = ([a, b]) => clamp((tiV - a) / (b - a));
			const aEstelas = this._aEl('estelas');
			for (const e of aEstelas > 0.01 ? this._estelas : []) {
				const aLuòc = (e.vis ? 1 : e.tEsc == null ? 0 : 1 - easeS(clamp((t - e.tEsc) / ESC_LUÒC))) * aEstelas;
				if (aLuòc < 0.01) continue;
				const x = e.X - o.x,
					y = e.Y - o.y;
				if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
				const tw = this._calm ? 0.6 : Math.sin(temps * e.v + e.f) * 0.5 + 0.5;
				const ic = e.lenga ? -1 : CAPITALAS.indexOf(e.nom);
				// las capitalas d'en primièr, puèi cada vilatge a son moment, coma
				// d'estelas que s'alucan una a una (retorn de Romain)
				// (las vilas d'una lenga alucada aprèp : son relòtge a elas, las autras bolegan pas)
				const tiE = e.tAluc == null ? tiV : Math.min(ti, INTRO.vilas[0] + (t - e.tAluc) / 1000);
				const pI = ic < 0 ? clamp((tiE - (INTRO.vilas[0] + 0.25 + ((e.f / 6.283) % 1) * 0.9)) / 0.35) : clamp((tiE - (INTRO.vilas[0] + ic * 0.11)) / 0.55);
				if (pI < 0.01) continue;
				const rB = ic >= 0 ? 3.4 : { 1: 3.4, 2: 2.4, 3: 1.8, 4: 1.3 }[e.renc];
				// léger dépassement à l'allumage
				const s = pI < 1 ? 1 + Math.sin(pI * Math.PI) * (ic >= 0 ? 0.45 : 0.6) : 1;
				cx.globalAlpha = (ic >= 0 || e.renc <= 2 ? 1 : e.renc === 3 ? 0.85 : 0.45 + 0.3 * tw) * aGen * aLuòc * Math.min(1, pI * 1.6);
				cx.beginPath();
				cx.arc(x, y, rB * s * gros, 0, 6.283);
				cx.fill();
				if (ic >= 0 && pI < 1) {
					cx.save();
					cx.strokeStyle = T.estela;
					cx.globalAlpha = (1 - pI) * 0.7 * aGen;
					cx.lineWidth = 1.2;
					cx.beginPath();
					cx.arc(x, y, rB * gros * (1 + pI * 5), 0, 6.283);
					cx.stroke();
					cx.restore();
				}
			}

			const aNomsV = faseV([INTRO.vilas[0] + 0.3, INTRO.vilas[1] + 0.3]);
			if (aNomsV > 0.01 && aEtiq > 0.01 && (!this._etiqVuèg || this._viv.enCors())) {
				// pendent lo zoom e la transicion que seguís, los noms son tornats
				// pintar un a un (talha constanta, glissada) ; si que non, l'imatge
				const s = this._zCibla != null ? escalaCSS(this._cv) : 1;
				if (Math.abs(s - 1) > 1e-3 || this._viv.enCors()) this._viv.pintar(cx, s, aNomsV * aEtiq * 0.92);
				else {
					cx.globalAlpha = aNomsV * aEtiq * 0.92;
					cx.drawImage(this._etiq, 0, 0, W, H);
				}
			}

			// Les repères des villes à fiche, au-dessus de tout (même de la carte détaillée)
			const aF = this._aRepèr();
			if (this._fichas.length && aF > 0.01) {
				// une onde toutes les 2,6 s ; aucune si l'on a demandé moins d'animations
				const onda = this._calm ? -1 : (temps % 2.6) / 2.6;
				for (const v of this._fichas) {
					const p = this._posFicha(v);
					dessenharRepèr(cx, p.x, p.y, p.R * (v === this._fichaPus ? 1.12 : 1), T, aF, onda);
				}
			}
			// Première rencontre avec un repère : la bulle s'ouvre d'elle-même
			// quelques secondes pour dire qu'on peut cliquer (une seule fois)
			if (aF > 0.6 && !this._ajudaVista) {
				if (this._ajudaDeja === undefined) {
					try {
						this._ajudaDeja = localStorage.getItem(CLAU_AJUDA) === '1';
					} catch {
						this._ajudaDeja = false;
					}
				}
				const s = this._map.getSize();
				const v = this._ajudaDeja
					? null
					: this._fichas.find((u) => {
							const p = this._posFicha(u);
							const c = this._map.layerPointToContainerPoint([p.x + this._min.x, p.y + this._min.y]);
							return c.x > 0 && c.y > 80 && c.x < s.x - 200 && c.y < s.y;
						});
				if (this._ajudaDeja) this._ajudaVista = true;
				else if (v) {
					this._ajudaVista = true;
					try {
						localStorage.setItem(CLAU_AJUDA, '1');
					} catch {
						// stockage indisponible : l'aide reviendra à la prochaine visite
					}
					this._fichaPus = v;
					this._fichaDet = true;
					this._ajuda = true;
					this._fichaTòc = performance.now() + 3000;
				}
			}
			if (this._fichaDet && performance.now() - this._fichaTòc > 4000) {
				this._fichaDet = false;
				this._fichaPus = null;
				this._ajuda = false;
			}
			const fp = aF > 0.3 ? this._fichaPus : null;
			if (fp) {
				const p = this._posFicha(fp),
					tx = TÈXTES_FICHA[this._lang] ?? TÈXTES_FICHA.oc;
				const acc = this._ajuda ? tx.ajuda : fp.ligam ? tx.dobrir : tx.leu;
				cx.font = polissaVila(1, 19);
				const wn = cx.measureText(fp.nom).width;
				cx.font = '700 11px Luciole, sans-serif';
				const wa = cx.measureText(acc).width;
				const bw = Math.max(wn, wa) + 28,
					bh = 50,
					bx = p.x + p.R * 1.45 + 10,
					by = p.y - bh / 2;
				cx.globalAlpha = 1;
				cx.fillStyle = T.bulla;
				cx.strokeStyle = T.fil;
				cx.lineWidth = 1;
				cx.beginPath();
				cx.roundRect(bx, by, bw, bh, 14);
				cx.fill();
				cx.stroke();
				cx.textAlign = 'left';
				cx.font = polissaVila(1, 19);
				cx.fillStyle = T.riuTèxt;
				cx.fillText(fp.nom, bx + 14, by + 22);
				cx.font = '700 11px Luciole, sans-serif';
				cx.fillStyle = fp.ligam ? T.fil : T.vilaTèxt;
				cx.globalAlpha = fp.ligam ? 1 : 0.7;
				cx.fillText(acc, bx + 14, by + 39);
				cx.globalAlpha = 1;
			}

			// L'onde du lieu trouvé par la recherche (4 s)
			const sg = this._senhal;
			if (sg && sg.t0 !== null) {
				const el = (performance.now() - sg.t0) / 1000;
				if (el > 4) this._senhal = null;
				else {
					const q = this._map.project([sg.lat, sg.lon], z);
					const sx = q.x - o.x,
						sy = q.y - o.y,
						fond = clamp((4 - el) / 0.8);
					cx.strokeStyle = T.fil;
					for (const dec of [0, 0.5]) {
						const ph = this._calm ? 0.3 : (el / 1.6 + dec) % 1;
						cx.globalAlpha = (1 - ph) * 0.9 * fond;
						cx.lineWidth = 1.6;
						cx.beginPath();
						cx.arc(sx, sy, 10 + ph * 36, 0, 6.283);
						cx.stroke();
					}
					cx.globalAlpha = fond;
					cx.lineWidth = 2;
					cx.beginPath();
					cx.arc(sx, sy, 7, 0, 6.283);
					cx.stroke();
				}
			}

			// Le nom du territoire révélé, dans une étiquette fixe en bas au centre
			// de la vue, au-dessus de tout (au centre du territoire, il chevauchait
			// les noms des villes)
			// Pendant un fondu, une seule étiquette : sa largeur glisse de l'un à
			// l'autre et les deux noms se fondent, centrés
			const lg = this._legendaT;
			// sus la carta, l'etiqueta es un element de la pagina, al dessús de las
			// còlas (los noms de comunas, pintats pus naut, la recobrissián : retorn
			// de Romain, 2026-10-23, « GIRONDA » sus « Lo Mont de Marçan ») ; la
			// tela la pinta sonque se degun l'afichà pas (l'acuèlh)
			if (this._onLegenda) {
				const tt = TÈXTES_TER[this._lang] ?? TÈXTES_TER.oc;
				const l = !this._legendaAmagada && lg.length ? lg.reduce((m, x) => (x.a > (m?.a ?? 0) ? x : m), null) : null;
				const item =
					l && l.a > 0.35
						? {
								nom: nomTerritori(l.reg ? 'region' : 'despartament', l.t.code, l.t.nom, this._lang).toUpperCase(),
								sota: sotaTerritori(l.t.code, this._lang) ?? (l.reg ? tt.region : tt.despartament + ' · ' + l.t.code),
								fixat: lg.some((x) => x.fixat)
							}
						: null;
				const clau = item ? item.nom + '|' + item.sota + '|' + item.fixat : '';
				if (clau !== this._clauLegenda) {
					this._clauLegenda = clau;
					this._onLegenda(item);
				}
			}
			// (l'invitacion a descobrir una lenga vesina es al meteis endrech : passa d'en primièr)
			else if (lg.length && !this._legendaAmagada) {
				const tt = TÈXTES_TER[this._lang] ?? TÈXTES_TER.oc,
					vis = this._map.getSize(),
					v0 = this._map.containerPointToLayerPoint([0, 0]).subtract(this._min);
				const esp = 'letterSpacing' in cx;
				const mesura = (l) => {
					l.nom = nomTerritori(l.reg ? 'region' : 'despartament', l.t.code, l.t.nom, this._lang).toUpperCase();
					l.sota = sotaTerritori(l.t.code, this._lang) ?? (l.reg ? tt.region : tt.despartament + ' · ' + l.t.code);
					if (esp) cx.letterSpacing = '2.5px';
					cx.font = '700 12.5px Luciole, sans-serif';
					l.wn = cx.measureText(l.nom).width;
					if (esp) cx.letterSpacing = '0.5px';
					cx.font = '400 11px Luciole, sans-serif';
					l.ws = cx.measureText(l.sota).width;
					l.bw = l.wn + l.ws + 46;
				};
				lg.forEach(mesura);
				const aMax = Math.max(...lg.map((l) => l.a)),
					sumA = lg.reduce((s, l) => s + l.a, 0) || 1;
				const bw = lg.reduce((s, l) => s + l.bw * l.a, 0) / sumA,
					bh = 34,
					cxM = v0.x + vis.x / 2,
					bx = cxM - bw / 2,
					by = v0.y + vis.y - 96 - (this._barraBas ?? 0);
				const fixat = lg.some((l) => l.fixat);
				cx.globalAlpha = aMax * (fixat ? 1 : 0.88);
				cx.fillStyle = T.bulla;
				cx.strokeStyle = fixat ? T.fil : T.estela;
				cx.lineWidth = 1;
				cx.beginPath();
				cx.roundRect(bx, by, bw, bh, 17);
				cx.fill();
				cx.stroke();
				cx.textAlign = 'left';
				cx.textBaseline = 'middle';
				for (const l of lg) {
					const x0 = cxM - l.bw / 2;
					cx.globalAlpha = l.a;
					if (esp) cx.letterSpacing = '2.5px';
					cx.font = '700 12.5px Luciole, sans-serif';
					cx.fillStyle = T.estela;
					cx.fillText(l.nom, x0 + 18, by + bh / 2 + 1);
					if (esp) cx.letterSpacing = '0.5px';
					cx.font = '400 11px Luciole, sans-serif';
					cx.fillStyle = T.riuTèxt;
					cx.fillText(l.sota, x0 + 28 + l.wn, by + bh / 2 + 1);
				}
				if (esp) cx.letterSpacing = '0px';
				cx.textBaseline = 'alphabetic';
			}

			// La bulle du lieu survolé (ou touché, 5 s)
			if (this._det && performance.now() - this._tòc > 5000) {
				this._pus = null;
				this._det = false;
				this._construirEtiquetas();
			}
			const p = this._pus;
			let caixa = null;
			if (p) {
				const px = p.X - o.x,
					py = p.Y - o.y;
				// (meteis alo doç que los noms de la carta, pas de contorn dur)
				const escriure = (s, x, y, l) => {
					cx.save();
					cx.shadowColor = T.liser;
					cx.shadowBlur = l * 1.6;
					cx.fillText(s, x, y);
					cx.fillText(s, x, y);
					cx.restore();
					cx.fillText(s, x, y);
				};
				cx.globalAlpha = 1;
				// Coin haut-gauche de la vue, en coordonnées du canevas (qui déborde de la vue)
				const vis = this._map.getSize(),
					v0 = this._map.containerPointToLayerPoint([0, 0]).subtract(this._min);
				if (this._det) {
					const nomF = polissaVila(p.renc, 19),
						dialF = '700 11px Luciole, sans-serif';
					cx.font = nomF;
					const wn = cx.measureText(p.nom).width;
					cx.font = dialF;
					const dl = dialLuòc(p, this._lang),
						wd = cx.measureText(dl).width;
					// (lo subrenom dins la bulla, jos lo dialècte)
					const sob = p.sobrenom ?? null;
					let ws = 0;
					if (sob) {
						cx.font = CORMORANT_SUB;
						ws = cx.measureText('« ' + sob.oc + ' »').width;
					}
					const bw = Math.max(wn, wd, ws) + 30,
						bh = sob ? 74 : 52;
					const bx = Math.min(v0.x + vis.x - bw / 2 - 10, Math.max(v0.x + bw / 2 + 10, px));
					const by = Math.max(v0.y + 90 + bh / 2, py - 86);
					caixa = [bx - bw / 2, by - bh / 2, bx + bw / 2, by + bh / 2];
					cx.strokeStyle = T.fil;
					cx.lineWidth = 1;
					cx.beginPath();
					cx.moveTo(px, py - 9);
					cx.lineTo(bx, by + bh / 2);
					cx.stroke();
					cx.lineWidth = 1.3;
					cx.beginPath();
					cx.arc(px, py, 9, 0, 6.283);
					cx.stroke();
					cx.fillStyle = T.bulla;
					cx.beginPath();
					cx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 14);
					cx.fill();
					cx.lineWidth = 1;
					cx.stroke();
					cx.textAlign = 'center';
					cx.font = nomF;
					cx.fillStyle = T.riuTèxt;
					cx.fillText(p.nom, bx, by + 2 - (sob ? 11 : 0));
					cx.font = dialF;
					cx.fillStyle = T.vilaTèxt;
					cx.globalAlpha = 0.8;
					cx.fillText(dl, bx, by + 18 - (sob ? 11 : 0));
					if (sob) {
						cx.font = CORMORANT_SUB;
						cx.fillStyle = T.riuTèxt;
						cx.globalAlpha = 1;
						cx.fillText('« ' + sob.oc + ' »', bx, by + 26);
					}
				} else {
					const vel = cx.createRadialGradient(px, py, 0, px, py, 130);
					vel.addColorStop(0, T.vel);
					vel.addColorStop(1, T.velFin);
					cx.fillStyle = vel;
					cx.fillRect(px - 130, py - 130, 260, 260);
					cx.strokeStyle = T.fil;
					cx.lineWidth = 1.2;
					cx.beginPath();
					cx.arc(px, py, 8, 0, 6.283);
					cx.stroke();
					const dreta = px - v0.x < vis.x - 260;
					const tx = px + (dreta ? 16 : -16);
					cx.textAlign = dreta ? 'left' : 'right';
					cx.strokeStyle = T.liser;
					cx.font = polissaVila(p.renc, 23);
					const wN = cx.measureText(p.nom).width + 10,
						bas = py + (p.sobrenom ? 52 : 30);
					caixa = dreta ? [px - 12, py - 24, tx + wN, bas] : [tx - wN, py - 24, px + 12, bas];
					cx.fillStyle = T.riuTèxt;
					escriure(p.nom, tx, py + 2, 5);
					cx.font = '700 11px Luciole, sans-serif';
					cx.fillStyle = T.vilaTèxt;
					cx.globalAlpha = 0.8;
					escriure(dialLuòc(p, this._lang), tx, py + 20, 4);
					encastreSobrenom(cx, T, p.sobrenom, this._lang, tx, py + 28, dreta ? 'left' : 'right');
				}
				cx.textAlign = 'left';
				cx.globalAlpha = 1;
			}
			this._anonçarPus(p, caixa);
		},

		// Lo luòc survolat e la bóstia de son nom (o de sa bulla), en
		// coordenadas del contenedor : sus lo satellit, lo nom de la comuna s'i
		// escafa e los noms recobèrts s'escantisson (CartaOccitania)
		_anonçarPus(p, c) {
			if (!this._onPus || !this._map) return;
			const k = p && c ? p.nom + c.map(Math.round).join(',') : '';
			if (k === this._clauPus) return;
			this._clauPus = k;
			if (!k) return this._onPus(null);
			const cp = (x, y) => this._map.layerPointToContainerPoint(L.point(x + this._min.x, y + this._min.y));
			const a = cp(c[0], c[1]),
				b = cp(c[2], c[3]),
				q = cp(p.X - this._o.x, p.Y - this._o.y);
			this._onPus({ nom: p.nom, x: q.x, y: q.y, caixa: [a.x, a.y, b.x, b.y] });
		}
	});
	return new Cola();
}
