// Animation Instagram « Qual parla occitan uèi ? » (enquête OPLO 2020), 4:5.
// Tout est dessiné dans un canevas par pintar(t) : une image = une fonction du
// temps, sans état, pour pouvoir se placer n'importe où et enregistrer image
// par image. Carte : aplats doux sans contour (Romain, 2026-10-24), du plus
// clair (peu de locuteurs) au plus foncé (beaucoup), comme sur /carta.
// Chiffres : SIG/oplo-2020/ (locuteurs, compréhension, compréhension par âge) ;
// « 2 % des 15-29 ans » et « 66 ans » : question écrite n° 33591 à l'Assemblée
// nationale, qui cite l'enquête (à confirmer dans le rapport, p. 74).

const W = 1080,
	H = 1350,
	FIN = 40.5;
const tela = document.getElementById('tela');
const cx = tela.getContext('2d');

// ---------- outils ----------
const lim = (v) => Math.max(0, Math.min(1, v));
const seg = (t, a, b) => lim((t - a) / (b - a));
const doç = (p) => 1 - Math.pow(1 - p, 3); // arrivée douce
const doç2 = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
// apparition et disparition d'un bloc entre a et b : opacité et montée
function bloc(t, a, b) {
	const e = doç(seg(t, a, a + 0.6)),
		s = doç2(seg(t, b - 0.5, b));
	return { a: Math.min(e, 1 - s), dy: (1 - e) * 26 };
}
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mesclar = (c1, c2, p) => c1.map((v, i) => v + (c2[i] - v) * p);
const css = ([r, g, b], a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;

const COL = { crema: '#f5ead8', or: '#eeaf34', gris: '#b8a890', blanc: '#ffffff' };
const LIM = (px) => `400 ${px}px Limelight`;
const LUC = (px, g = 400, i = '') => `${i} ${g} ${px}px Luciole`;

function tèxt(s, x, y, font, color, alpha = 1, align = 'left') {
	cx.save();
	cx.globalAlpha *= alpha;
	cx.font = font;
	cx.fillStyle = color;
	cx.textAlign = align;
	cx.fillText(s, x, y);
	cx.restore();
}
// texte sur plusieurs lignes, coupé à la largeur l ; rend le bas du bloc
function paragraf(s, x, y, l, font, color, alpha, interlinha, align = 'left') {
	cx.font = font;
	const mots = s.split(' ');
	let linha = '';
	const linhas = [];
	for (const m of mots) {
		const prova = linha ? linha + ' ' + m : m;
		if (cx.measureText(prova).width > l && linha) {
			linhas.push(linha);
			linha = m;
		} else linha = prova;
	}
	linhas.push(linha);
	linhas.forEach((li, i) => tèxt(li, x, y + i * interlinha, font, color, alpha, align));
	return y + (linhas.length - 1) * interlinha;
}

// ---------- matière ----------
// Cinq classes de locuteurs, aplats doux sur le fond brun (sable → brique)
const CLASSAS = [0, 5, 10, 15, 20];
const GAMA = ['#f4e4cf', '#efc79c', '#e29f6c', '#cc7046', '#ab4529'];
const classa = (p) => CLASSAS.findLastIndex((m) => p >= m);
const CREMA = rgb('#f5ead8');

const domeni = new Path2D(CARTA.domeni);
// les anneaux du domaine en points, pour tracer le contour petit à petit
const anèls = CARTA.domeni
	.split('M')
	.filter(Boolean)
	.map((r) => {
		const pts = r
			.replace('Z', '')
			.split('L')
			.map((p) => p.split(' ').map(Number));
		let l = 0;
		const cum = [0];
		for (let i = 1; i < pts.length; i++) cum.push((l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])));
		return { pts, cum, l };
	});
const deps = CARTA.deps.map((d) => ({ ...d, p: new Path2D(d.d), col: GAMA[classa(d.pct)] }));
const zona = new Path2D();
for (const d of deps) zona.addPath(d.p);

// ordre d'apparition : du plus petit taux au plus grand ; Losèra et le Val
// d'Aran arrivent seuls, après une pause
deps.sort((a, b) => a.pct - b.pct);
deps.forEach((d, i) => (d.t0 = d.code === '48' ? 13.0 : d.code === 'ARAN' ? 14.4 : 9.0 + i * 0.17));

const NOMS = [
	['33', 'Gironda', 70, 345],
	['48', 'Losèra', 700, 440],
	['ARAN', 'Val d’Aran', 390, 895]
].map(([code, nom, x, y]) => {
	const d = deps.find((d) => d.code === code);
	return { d, nom, x, y, t0: d.t0 + 0.45 };
});

// les cent personnes : 7 parlent, 8 de plus comprennent (tirage fixe)
const ÒRDRE = (() => {
	const a = [...Array(100).keys()];
	let s = 7;
	for (let i = 99; i > 0; i--) {
		s = (s * 9301 + 49297) % 233280;
		const j = Math.floor((s / 233280) * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	const r = new Array(100).fill(-1);
	a.slice(0, 15).forEach((k, i) => (r[k] = i));
	return r;
})();

const EDATS = [
	['15-29 ans', 3],
	['30-44 ans', 4],
	['45-59 ans', 13],
	['60-74 ans', 25],
	['75 ans et +', 39]
];

// les morceaux du gabarit Sensibilisation, en images
function imatge(dedins) {
	const im = new Image();
	im.src =
		'data:image/svg+xml;charset=utf-8,' +
		encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${dedins}</svg>`);
	return im;
}
const IM = {
	fons: imatge(
		`<defs><linearGradient id="g" x1="540" y1="0" x2="540" y2="1350" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a2a20"/><stop offset="1" stop-color="#241913"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#g)"/><g opacity="0.4">${CARTA.gabarit.crotz}</g>`
	),
	etiqueta: imatge(CARTA.gabarit.etiqueta),
	logo: imatge(CARTA.gabarit.logo)
};

// ---------- les morceaux de l'image ----------
function contorn(f, alpha) {
	cx.save();
	cx.globalAlpha = alpha;
	cx.strokeStyle = COL.or;
	cx.lineWidth = 2.2;
	cx.lineJoin = 'round';
	cx.beginPath();
	for (const r of anèls) {
		const fins = r.l * f;
		cx.moveTo(...r.pts[0]);
		for (let i = 1; i < r.pts.length && r.cum[i] <= fins; i++) cx.lineTo(...r.pts[i]);
	}
	cx.stroke();
	cx.restore();
}

function carta(t) {
	const a = 1 - doç(seg(t, 17.2, 17.9));
	if (a <= 0) return;
	cx.save();
	cx.globalAlpha = a;
	// le domaine entier, à peine marqué : là où rien n'a été enquêté
	cx.fillStyle = css(CREMA, 0.07 * doç(seg(t, 4.4, 5.4)));
	cx.fill(domeni, 'evenodd');
	cx.save();
	cx.clip(domeni, 'evenodd');
	// la zone enquêtée s'éclaire d'un seul aplat
	const z = doç(seg(t, 5.0, 6.4));
	if (z > 0) {
		cx.fillStyle = css(CREMA, 0.24 * z);
		cx.fill(zona);
	}
	// puis chaque département prend sa couleur ; le trait de la même couleur
	// bouche les jours entre voisins, sans dessiner de contour
	for (const d of deps) {
		const p = doç(seg(t, d.t0, d.t0 + 0.7));
		if (p <= 0) continue;
		cx.globalAlpha = a * p;
		cx.fillStyle = cx.strokeStyle = d.col;
		cx.lineWidth = 1.2;
		cx.fill(d.p);
		cx.stroke(d.p);
	}
	cx.restore();
	// le contour d'or se trace, puis s'efface presque
	const tr = doç2(seg(t, 3.4, 5.6));
	if (tr > 0) contorn(tr, a * (1 - 0.75 * doç(seg(t, 6.6, 7.6))));
	// les trois noms
	for (const n of NOMS) {
		const e = doç(seg(t, n.t0, n.t0 + 0.6));
		if (e <= 0) continue;
		const [x0, y0] = n.d.c;
		const [x2, y2] = n.y + 90 < y0 ? [n.x + 50, n.y + 82] : [n.x - 8, n.y + 30];
		cx.globalAlpha = a * e;
		cx.strokeStyle = COL.blanc;
		cx.lineWidth = 1.6;
		cx.beginPath();
		cx.moveTo(x0, y0);
		cx.lineTo(x0 + (x2 - x0) * e, y0 + (y2 - y0) * e);
		cx.stroke();
		cx.fillStyle = COL.blanc;
		cx.beginPath();
		cx.arc(x0, y0, 4.5, 0, 7);
		cx.fill();
		cx.shadowColor = '#241913';
		cx.shadowBlur = 8;
		const dy = (1 - e) * 14;
		const v = Math.round(n.d.pct * doç(seg(t, n.t0, n.t0 + 0.9)));
		tèxt(`${v} %`, n.x, n.y + 42 + dy, LIM(46), COL.or);
		tèxt(n.nom, n.x, n.y + 74 + dy, LUC(26, 700), COL.blanc);
	}
	cx.restore();
}

function legenda(t) {
	const { a, dy } = bloc(t, 9.6, 17.4);
	if (a <= 0) return;
	const x = 600,
		y = 1004 + dy;
	tèxt('Locuteurs, en % des 15 ans et plus', x, y, LUC(19), COL.gris, a);
	cx.save();
	cx.globalAlpha = a;
	GAMA.forEach((c, i) => {
		cx.fillStyle = c;
		cx.beginPath();
		cx.roundRect(x + i * 56, y + 14, 52, 16, 3);
		cx.fill();
		tèxt(i === 4 ? '20 +' : String(CLASSAS[i]), x + i * 56 + 26, y + 52, LUC(18), COL.crema, 1, 'center');
	});
	cx.fillStyle = css(CREMA, 0.12);
	cx.beginPath();
	cx.roundRect(x + 5 * 56 + 30, y + 14, 70, 16, 3);
	cx.fill();
	tèxt('sans enquête', x + 5 * 56 + 65, y + 52, LUC(16), COL.gris, 1, 'center');
	cx.restore();
}

function persona(x, y, color, alpha) {
	cx.save();
	cx.globalAlpha = alpha;
	cx.fillStyle = color;
	cx.beginPath();
	cx.arc(x, y - 17, 8.5, 0, 7);
	cx.fill();
	cx.beginPath();
	cx.roundRect(x - 12, y - 5, 24, 24, [12, 12, 3, 3]);
	cx.fill();
	cx.restore();
}

function centPersonas(t) {
	const { a, dy } = bloc(t, 17.6, 24.4);
	if (a <= 0) return;
	tèxt('Sur 100 habitants de 15 ans et plus', 85, 350 + dy, LUC(38), COL.crema, a);
	const ORD = rgb('#eeaf34');
	for (let k = 0; k < 100; k++) {
		const col = k % 20,
			row = Math.floor(k / 20);
		const x = 122 + col * 44.2,
			y = 440 + row * 76 + dy;
		const ap = doç(seg(t, 17.8 + row * 0.18, 18.5 + row * 0.18));
		const r = ÒRDRE[k];
		let c = CREMA,
			al = 0.16;
		if (r >= 0 && r < 7) {
			const p = doç(seg(t, 19.0 + r * 0.16, 19.4 + r * 0.16));
			c = mesclar(CREMA, ORD, p);
			al = 0.16 + 0.84 * p;
		} else if (r >= 7) {
			const p = doç(seg(t, 20.8 + (r - 7) * 0.12, 21.2 + (r - 7) * 0.12));
			al = 0.16 + 0.84 * p;
		}
		persona(x, y, css(c), a * ap * al);
	}
	// les deux nombres
	const e1 = doç(seg(t, 19.0, 19.6)),
		e2 = doç(seg(t, 20.8, 21.4));
	const n1 = Math.round(7 * seg(t, 19.0, 20.1)),
		n2 = 7 + Math.round(8 * seg(t, 20.8, 21.8));
	if (e1 > 0) {
		tèxt(String(n1), 85, 935 + dy + (1 - e1) * 20, LIM(110), COL.or, a * e1);
		tèxt('parlent occitan', 250, 912 + dy + (1 - e1) * 20, LUC(40, 700), COL.crema, a * e1);
	}
	if (e2 > 0) {
		tèxt(String(n2), 85, 1080 + dy + (1 - e2) * 20, LIM(110), COL.crema, a * e2);
		tèxt('le comprennent bien', 250, 1052 + dy + (1 - e2) * 20, LUC(40, 700), COL.crema, a * e2);
		tèxt('(parfaitement ou facilement)', 250, 1094 + dy + (1 - e2) * 20, LUC(26, 400, 'italic'), COL.gris, a * e2);
	}
}

function mejana(t) {
	const { a, dy } = bloc(t, 24.6, 29.6);
	if (a <= 0) return;
	const n = Math.round(7 * doç(seg(t, 24.8, 25.9)));
	cx.save();
	cx.font = LIM(300);
	const lc = cx.measureText(String(n)).width;
	cx.font = LIM(170);
	const lp = cx.measureText('%').width;
	cx.restore();
	const x0 = 540 - (lc + 24 + lp) / 2;
	tèxt(String(n), x0, 700 + dy, LIM(300), COL.or, a);
	tèxt('%', x0 + lc + 24, 700 + dy, LIM(170), COL.or, a);
	tèxt('des 15 ans et plus parlent occitan', 540, 800 + dy, LUC(42), COL.crema, a, 'center');
	tèxt('en Nouvelle-Aquitaine et en Occitanie', 540, 856 + dy, LUC(42), COL.crema, a, 'center');
	const e = doç(seg(t, 26.3, 26.9));
	tèxt('soit près de 600 000 personnes', 540, 960 + dy + (1 - e) * 20, LUC(42, 700), COL.or, a * e, 'center');
}

function edats(t) {
	const { a, dy } = bloc(t, 29.7, 37.4);
	if (a <= 0) return;
	const bas = paragraf('Plus on est jeune, moins on comprend l’occitan', 85, 350 + dy, 910, LUC(46, 700), COL.crema, a, 56);
	tèxt('Comprennent parfaitement ou facilement, selon l’âge', 85, bas + 46 + dy, LUC(26, 400, 'italic'), COL.gris, a);
	const L = 600;
	EDATS.forEach(([nom, v], i) => {
		const y = 510 + i * 78 + dy;
		const p = doç(seg(t, 30.3 + i * 0.35, 31.2 + i * 0.35));
		tèxt(nom, 270, y + 31, LUC(28), COL.crema, a, 'right');
		cx.save();
		cx.globalAlpha = a;
		cx.fillStyle = css(mesclar(rgb('#f4e4cf'), rgb('#ab4529'), v / 39));
		cx.beginPath();
		cx.roundRect(295, y, Math.max(2, (L * v * p) / 39), 44, 6);
		cx.fill();
		cx.restore();
		if (p > 0.05) tèxt(`${Math.round(v * p)} %`, 295 + (L * v * p) / 39 + 16, y + 35, LIM(38), COL.or, a * lim(p * 2));
	});
	const e = doç(seg(t, 33.0, 33.6)),
		f = doç(seg(t, 33.6, 34.2));
	tèxt('Chez les 15-29 ans, 2 % parlent occitan.', 85, 960 + dy + (1 - e) * 20, LUC(40, 700), COL.or, a * e);
	tèxt('Âge moyen des locuteurs : 66 ans.', 85, 1012 + dy + (1 - f) * 20, LUC(36), COL.crema, a * f);
	const g = doç(seg(t, 35.0, 35.7));
	tèxt('Et demain, qui la parlera ?', 85, 1110 + dy + (1 - g) * 20, LIM(56), COL.blanc, a * g);
}

function fin(t) {
	const e = doç(seg(t, 37.7, 38.5));
	if (e <= 0) return;
	cx.save();
	cx.globalAlpha = e;
	const s = 2.4 - 0.2 * e;
	cx.translate(540, 620);
	cx.scale(s, s);
	cx.translate(-102, -1262);
	cx.drawImage(IM.logo, 0, 0);
	cx.restore();
	tèxt('Lo Ligam', 540, 860 + (1 - e) * 20, LIM(96), COL.crema, e, 'center');
}

// ---------- une image ----------
function pintar(t) {
	cx.clearRect(0, 0, W, H);
	cx.drawImage(IM.fons, 0, 0);
	const finA = 1 - doç(seg(t, 37.3, 37.9));
	// en-tête : étiquette et titre, tout du long
	cx.save();
	cx.globalAlpha = doç(seg(t, 0, 0.6)) * finA;
	cx.drawImage(IM.etiqueta, 0, 0);
	cx.restore();
	const ti = doç(seg(t, 0.3, 1.2)),
		so = doç(seg(t, 0.9, 1.7));
	cx.font = LIM(70);
	const l1 = cx.measureText('Qual parla occitan ').width,
		l2 = cx.measureText('uèi').width;
	const yt = 222 + (1 - ti) * 30;
	tèxt('Qual parla occitan ', 85, yt, LIM(70), COL.blanc, ti * finA);
	tèxt('uèi', 85 + l1, yt, LIM(70), COL.or, ti * finA);
	tèxt(' ?', 85 + l1 + l2, yt, LIM(70), COL.blanc, ti * finA);
	tèxt('(Qui parle occitan aujourd’hui ?)', 88, 270 + (1 - so) * 20, LUC(32, 400, 'italic'), COL.gris, so * finA);

	carta(t);

	// scène 1 : l'enquête
	{
		const { a, dy } = bloc(t, 3.4, 8.6);
		if (a > 0) {
			const b = paragraf('En 2020, l’OPLO a interrogé 8 000 personnes dans l’ouest du domaine occitan.', 85, 1000 + dy, 910, LUC(40), COL.crema, a, 52);
			tèxt('Nouvelle-Aquitaine, Occitanie et Val d’Aran', 85, b + 46 + dy, LUC(28), COL.gris, a);
		}
	}
	// scène 2 : de 2 % à 62 %
	{
		const { a, dy } = bloc(t, 8.8, 17.4);
		if (a > 0) {
			tèxt('De 2 % à 62 %', 85, 1050 + dy, LIM(72), COL.or, a);
			tèxt('de locuteurs selon le territoire', 85, 1100 + dy, LUC(34), COL.crema, a);
		}
	}
	legenda(t);
	centPersonas(t);
	mejana(t);
	edats(t);
	fin(t);

	// pied : écusson et source
	const pe = doç(seg(t, 0.2, 0.9)) * finA;
	cx.save();
	cx.globalAlpha = pe;
	cx.drawImage(IM.logo, 0, 0);
	cx.restore();
	tèxt('Source : Office public de la langue occitane (OPLO),', 190, 1254, LUC(21), COL.gris, pe);
	tèxt('enquête sociolinguistique 2020, 8 000 personnes de 15 ans et plus.', 190, 1282, LUC(21), COL.gris, pe);
}

// ---------- lecture ----------
const SCENAS = [
	[0, 'Ouverture'],
	[3.4, 'Enquête'],
	[8.8, 'De 2 à 62 %'],
	[17.6, 'Parler, comprendre'],
	[24.6, '7 %'],
	[29.7, 'Âge'],
	[37.6, 'Fin']
];
const curs = document.getElementById('temps'),
	ora = document.getElementById('ora'),
	jogar = document.getElementById('jogar');
let t = 0,
	vai = false,
	t0 = 0;
function anar(nt) {
	t = Math.max(0, Math.min(FIN, nt));
	curs.value = t;
	ora.value = t.toFixed(1).replace('.', ',') + ' s';
	pintar(t);
}
function bocla(ara) {
	if (!vai) return;
	let nt = (ara - t0) / 1000;
	if (nt >= FIN) nt = 0, (t0 = ara);
	anar(nt);
	requestAnimationFrame(bocla);
}
jogar.onclick = () => {
	vai = !vai;
	jogar.textContent = vai ? 'Pause' : 'Lecture';
	if (vai) {
		t0 = performance.now() - t * 1000;
		requestAnimationFrame(bocla);
	}
};
curs.oninput = () => anar(+curs.value);
const sc = document.getElementById('scenas');
for (const [ts, nom] of SCENAS) {
	const b = document.createElement('button');
	b.type = 'button';
	b.textContent = nom;
	b.onclick = () => anar(ts + 0.01);
	sc.append(b);
}

// pour les captures : ?t=12 se place à 12 s ; ?net affiche l'image seule
const q = new URLSearchParams(location.search);
if (q.has('net')) document.body.classList.add('net');
window.pintar = pintar;
window.anar = anar;
Promise.all([
	document.fonts.load(LIM(70)),
	document.fonts.load(LUC(40)),
	document.fonts.load(LUC(40, 700)),
	document.fonts.load(LUC(40, 400, 'italic')),
	...Object.values(IM).map((im) => im.decode())
]).then(() => anar(+(q.get('t') ?? 0)));
