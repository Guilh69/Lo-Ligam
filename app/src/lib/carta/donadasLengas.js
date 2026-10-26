// Las donadas del mòde « Lengas de França » (etapa 4, decision de Romain,
// 2026-10-10) : de jaces a despart de las lengas, rengadas dins la rubrica
// « Donadas » del rail. Per començar, lo breton :
//   - l'ensenhament bilingüe per comuna (OPLB, dintrada 2025) : un cercle per
//     comuna, de susfàcia proporcionala al nombre d'escolans ;
//   - los limits del breton, del sègle IX a 1806 (Sémhur, calats sus las
//     comunas) : de traits fins datats, que se fan mai vius en s'apropchant
//     d'uèi.
// Las donadas (SIG/cadena/breton-istoric.py, 57 Ko) se cargan sonque quand una
// jaça s'aluca ; l'alucar mena la carta sus la Bretanha.

let promesa = null;
const cargar = () =>
	(promesa ??= fetch('/data/breton-donadas.json')
		.then((r) => (r.ok ? r.json() : null))
		.catch(() => null));

// (format des nombres : celui de la langue du site ; l'occitan garde « oc »)
const LOCALAS = { fr: 'fr-FR', es: 'es-ES', en: 'en-GB', ca: 'ca-ES', ar: 'ar-u-nu-latn' };
const nombre = (n, lang) => n.toLocaleString(LOCALAS[lang] ?? 'oc');
// los mots de las bullas e del panèl de las fonts, per lenga de la pagina
const MOTS = {
	oc: {
		alumnes: 'escolans en bilingüe',
		etab: ['establiment', 'establiments'],
		diwan: (n) => `${n} a Diwan`,
		fora: 'fòra del domeni de 1886',
		escolas: 'Ensenhament bilingüe en breton',
		limits: 'Limits del breton'
	},
	fr: {
		alumnes: 'élèves en bilingue',
		etab: ['établissement', 'établissements'],
		diwan: (n) => `dont ${n} à Diwan`,
		fora: 'hors du domaine de 1886',
		escolas: 'Enseignement bilingue en breton',
		limits: 'Limites du breton'
	},
	es: {
		alumnes: 'escolares en bilingüe',
		etab: ['centro', 'centros'],
		diwan: (n) => `de ellos ${n} en Diwan`,
		fora: 'fuera del dominio de 1886',
		escolas: 'Enseñanza bilingüe en bretón',
		limits: 'Límites del bretón'
	},
	en: {
		alumnes: 'pupils in bilingual education',
		etab: ['school', 'schools'],
		diwan: (n) => `of whom ${n} at Diwan`,
		fora: 'outside the 1886 area',
		escolas: 'Bilingual education in Breton',
		limits: 'Limits of Breton'
	},
	ca: {
		alumnes: 'alumnes en bilingüe',
		etab: ['centre', 'centres'],
		diwan: (n) => `dels quals ${n} a Diwan`,
		fora: 'fora del domini de 1886',
		escolas: 'Ensenyament bilingüe en bretó',
		limits: 'Límits del bretó'
	},
	ar: {
		alumnes: 'من التلاميذ في التعليم ثنائي اللغة',
		etab: ['مدرسة', 'من المدارس'],
		diwan: (n) => `منهم ${n} في Diwan`,
		fora: 'خارج المنطقة المحدّدة عام 1886',
		escolas: 'التعليم ثنائي اللغة بالبريتونية',
		limits: 'حدود البريتونية'
	}
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function crearDonadasLengas(L, map, { color = '#4fd1b0', colorLimits = '#e9d7b0', lang = 'oc', pad = () => [110, 40] } = {}) {
	if (!map.getPane('donadasLengas')) {
		const p = map.createPane('donadasLengas');
		// (dessús las lengas e la còla tematica, jos los ponches e las bullas)
		p.style.zIndex = '330';
	}
	const rend = L.svg({ pane: 'donadasLengas', padding: 0.3 });
	let d = null,
		escolas = null,
		limits = null,
		estat = { escolas: false, limits: false };

	function tèxtEscola(e) {
		const [, , n, fr, br, diwan, etab, dins] = e;
		const m = MOTS[lang] ?? MOTS.oc;
		const t = `${nombre(n, lang)} ${m.alumnes}${etab ? ` · ${etab} ${m.etab[etab > 1 ? 1 : 0]}` : ''}${diwan ? `<br>${m.diwan(nombre(diwan, lang))}` : ''}${dins ? '' : `<br><i>${m.fora}</i>`}`;
		return `<b lang="br">${esc(br ?? fr)}</b>${br && br !== fr ? ` <span class="sota">${esc(fr)}</span>` : ''}<br>${t}`;
	}

	function construirEscolas() {
		const g = L.layerGroup();
		// (del pus grand al pus pichon : los pichons demòran dessús, survolables)
		for (const e of d.escolas) {
			const r = Math.max(2.6, Math.sqrt(e[2]) * 0.72);
			L.circleMarker([e[1], e[0]], {
				renderer: rend,
				pane: 'donadasLengas',
				radius: r,
				color,
				weight: e[7] ? 1 : 1.4,
				dashArray: e[7] ? null : '2 2',
				opacity: 0.9,
				fillColor: color,
				fillOpacity: 0.28
			})
				.bindTooltip(tèxtEscola(e), { direction: 'top', offset: [0, -r], className: 'bulla-donada' })
				.addTo(g);
		}
		return g;
	}

	// Las etiquetas de las epòcas : los limits se confondon sus de longs tròces
	// (lo s. XIV, 1588 e 1806 seguisson las meteissas comunas) ; cada etiqueta
	// va ont son limit es lo pus luènh dels autres, del costat liure, e pas a
	// la meteissa nautor qu'una autra etiqueta
	function plaçarEtiquetas() {
		const pts = d.istoric.map((ep) => ep.l.flat().filter((_, i) => i % 3 === 0));
		const xA = (j, y) => {
			let m = null,
				dm = 0.04;
			for (const [px, py] of pts[j]) if (Math.abs(py - y) < dm) (dm = Math.abs(py - y)), (m = px);
			return m;
		};
		const pausadas = [];
		return pts.map((ps, i) => {
			let melhor = null;
			for (const [x, y] of ps) {
				let sep = 0.6,
					costat = 1;
				for (let j = 0; j < pts.length; j++) {
					if (j === i) continue;
					const xo = xA(j, y);
					if (xo == null) continue;
					if (Math.abs(xo - x) < sep) (sep = Math.abs(xo - x)), (costat = xo > x ? -1 : 1);
				}
				// (luènh de las etiquetas ja pausadas, e pas tròp al bòrd de la mar)
				const pen = pausadas.some((p) => Math.abs(p[1] - y) < 0.09 && Math.abs(p[0] - x) < 0.45) ? 0.5 : 0;
				const nota = sep - pen - Math.max(0, y - 48.35) * 0.4;
				if (!melhor || nota > melhor.nota) melhor = { x, y, costat, nota };
			}
			if (melhor) pausadas.push([melhor.x, melhor.y]);
			return melhor;
		});
	}

	function construirLimits() {
		const g = L.layerGroup();
		const n = d.istoric.length;
		const etiquetas = plaçarEtiquetas();
		d.istoric.forEach((ep, i) => {
			// (las epòcas ancianas pus palas, la de 1806 pus viva)
			const k = n > 1 ? i / (n - 1) : 1;
			for (const l of ep.l) {
				const ll = l.map(([x, y]) => [y, x]);
				L.polyline(ll, { renderer: rend, pane: 'donadasLengas', color: colorLimits, weight: 1 + k * 1.2, opacity: 0.4 + k * 0.5, dashArray: i < n - 1 ? '5 4' : null, interactive: false }).addTo(g);
			}
			const e = etiquetas[i];
			if (!e) return;
			L.tooltip({ permanent: true, direction: e.costat > 0 ? 'right' : 'left', className: 'etiqueta-limit', offset: [e.costat * 5, 0], pane: 'donadasLengas', interactive: false })
				.setLatLng([e.y, e.x])
				.setContent(lang === 'fr' ? ep.fr : ep.oc)
				.addTo(g);
		});
		return g;
	}

	function anar() {
		const pts = [...(estat.escolas ? d.escolas.map((e) => [e[1], e[0]]) : []), ...(estat.limits ? d.istoric.flatMap((ep) => ep.l.flat().map(([x, y]) => [y, x])) : [])];
		if (!pts.length) return;
		const [esq, dalt] = pad();
		map.flyToBounds(L.latLngBounds(pts), { paddingTopLeft: [esq, dalt], paddingBottomRight: [40, 40], maxZoom: 8.5, duration: 1.1 });
	}

	// (« tèma : font », coma las autras còlas : lo panèl de las fonts las rènga)
	const fontsMesas = {};
	function fonts() {
		const ctl = map.attributionControl;
		if (!ctl || !d?.font) return;
		const m = MOTS[lang] ?? MOTS.oc;
		const tèmas = { escolas: m.escolas, limits: m.limits };
		for (const k of ['escolas', 'limits']) {
			const t = `${tèmas[k]} : ${d.font[k === 'escolas' ? 'escolas' : 'istoric']}`;
			if (fontsMesas[k] && (!estat[k] || fontsMesas[k] !== t)) ctl.removeAttribution(fontsMesas[k]), delete fontsMesas[k];
			if (estat[k] && !fontsMesas[k]) ctl.addAttribution((fontsMesas[k] = t));
		}
	}

	return {
		async mostrar({ escolas: e, limits: l }) {
			const nòus = (e && !estat.escolas) || (l && !estat.limits);
			estat = { escolas: !!e, limits: !!l };
			if ((e || l) && !d) d = await cargar();
			if (!d) return;
			if (estat.escolas) (escolas ??= construirEscolas()).addTo(map);
			else escolas?.remove();
			if (estat.limits) (limits ??= construirLimits()).addTo(map);
			else limits?.remove();
			fonts();
			if (nòus) anar();
		},
		setLang(l) {
			if (l === lang) return;
			lang = l;
			for (const k of ['escolas', 'limits']) {
				const g = k === 'escolas' ? escolas : limits;
				if (!g) continue;
				g.remove();
				if (k === 'escolas') escolas = null;
				else limits = null;
			}
			this.mostrar(estat);
		},
		fonts: () => d?.font ?? null
	};
}
