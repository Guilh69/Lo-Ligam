// Animacions de tèxt (retorn de Romain, 2026-10-11, d'aprèp las « suggestions »
// de Canva) : onze efèctes d'entrada, leugièrs (transform, opacitat, flo :
// API Web Animations, sens bibliotèca), per un títol, un nom, una frasa
// corta. Lo tèxt entièr demòra legible pels lectors d'ecran (aria-label,
// letras aria-hidden) ; las letras tòrnan un tèxt simple a la fin.
// Sens movement (preferéncia del sistèma) : lo tèxt apareis sol.
//
//   import { animarText } from '$lib/actions/animarText.js';
//   animarText(el, 'decalatge');                       // un element ja escrich
//   animarText(el, 'clarificar', { tèxt: 'Baiona' });  // remplaça son tèxt
//   <h2 {@attach animat('rebond')}>…</h2>              // en Svelte
//
// Efèctes (nom Canva → nom aicí) :
//   Machine à écrire → maquina    Ascension → ascension   Décalage → decalatge
//   Fusion → fusion               Bloc → bloc             Explosion → explosion
//   Rebond → rebond               Déroulé → deroulat      Patinage → patinatge
//   Écart → escart                Clarifier → clarificar

export const EFÈCTES = ['maquina', 'ascension', 'decalatge', 'fusion', 'bloc', 'explosion', 'rebond', 'deroulat', 'patinatge', 'escart', 'clarificar'];

const calm = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const ressòrt = 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	doç = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

// Lo tèxt en mots e letras (los mots se copan pas a la fin de linha)
function copar(el, tèxt, unitat, quadre = false) {
	el.setAttribute('aria-label', tèxt);
	el.textContent = '';
	const cap = document.createElement('span');
	cap.setAttribute('aria-hidden', 'true');
	if (quadre) cap.style.cssText = 'display:inline-block;position:relative';
	const unitats = [];
	// (L'espace insécable de « Adieu ! » garde le mot et son point ensemble.)
	const mots = tèxt.split(/([^\S ]+)/);
	for (const m of mots) {
		if (!m) continue;
		if (/^[^\S ]+$/.test(m)) {
			cap.append(document.createTextNode(m));
			continue;
		}
		const mot = document.createElement('span');
		mot.style.display = 'inline-block';
		mot.style.whiteSpace = 'nowrap';
		if (unitat === 'mot') unitats.push(mot), (mot.textContent = m);
		else
			for (const ch of m) {
				const l = document.createElement('span');
				l.style.display = 'inline-block';
				l.textContent = ch;
				mot.append(l);
				unitats.push(l);
			}
		cap.append(mot);
	}
	el.append(cap);
	unitats.cap = cap;
	return unitats;
}
function restablir(el, tèxt) {
	el.textContent = tèxt;
	el.removeAttribute('aria-label');
}

// Cada efèct : las imatges claus d'una unitat (k, n) e son temps
const PER_UNITAT = {
	decalatge: (k) => ({ kf: [{ opacity: 0, transform: 'translateY(0.55em)' }, { opacity: 1, transform: 'none' }], dur: 520, pas: 38, easing: ressòrt }),
	fusion: (k, n) => {
		const d = k < n / 2 ? -1 : 1;
		return { kf: [{ opacity: 0, transform: `translateX(${d * 0.9}em)`, filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], dur: 620, pas: 0, easing: doç };
	},
	explosion: (k, n) => {
		const a = (k / Math.max(1, n - 1) - 0.5) * 50;
		return {
			kf: [
				{ opacity: 0, transform: `scale(0.2) rotate(${a}deg)` },
				{ opacity: 1, transform: 'scale(1.25) rotate(0deg)', offset: 0.6 },
				{ opacity: 1, transform: 'none' }
			],
			dur: 560,
			pas: 28,
			easing: doç
		};
	},
	rebond: () => ({
		kf: [
			{ opacity: 0, transform: 'translateY(-0.9em)' },
			{ opacity: 1, transform: 'translateY(0)', offset: 0.45 },
			{ transform: 'translateY(-0.28em)', offset: 0.65 },
			{ transform: 'translateY(0)', offset: 0.82 },
			{ transform: 'translateY(-0.07em)', offset: 0.92 },
			{ transform: 'translateY(0)' }
		],
		dur: 820,
		pas: 45,
		easing: 'ease-out'
	}),
	patinatge: () => ({
		kf: [{ opacity: 0, transform: 'translateX(1.2em) skewX(-22deg)', filter: 'blur(2px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
		dur: 600,
		pas: 30,
		easing: doç
	}),
	clarificar: () => ({ kf: [{ opacity: 0, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0)' }], dur: 700, pas: 0, easing: 'ease-out' })
};

/**
 * Anima l'entrada d'un tèxt.
 * @param {HTMLElement} el
 * @param {string} efèct un dels EFÈCTES
 * @param {{ tèxt?: string, retard?: number, velocitat?: number, color?: string }} [o]
 *   velocitat : 1 = normal, 2 = dos còps mai lèu ; color : lo bloc (efèct « bloc »)
 * @returns {Promise<void>} a la fin de l'animacion
 */
export function animarText(el, efèct, o = {}) {
	if (!el) return Promise.resolve();
	el._animarText?.anullar();
	const tèxt = o.tèxt ?? el._animarText?.tèxt ?? el.textContent;
	const v = o.velocitat ?? 1,
		retard = o.retard ?? 0;
	if (calm() || !el.animate) {
		el.textContent = tèxt;
		return Promise.resolve();
	}
	const animacions = [],
		temporizadors = [];
	let acabat = false;
	const fin = () => {
		if (acabat) return;
		acabat = true;
		restablir(el, tèxt);
		el._animarText = null;
	};
	el._animarText = {
		tèxt,
		anullar() {
			for (const a of animacions) a.cancel();
			for (const t of temporizadors) clearTimeout(t);
			fin();
		}
	};
	const esperar = () => Promise.all(animacions.map((a) => a.finished.catch(() => {}))).then(fin);

	// tot l'element d'un còp
	if (efèct === 'escart') {
		el.textContent = tèxt;
		animacions.push(
			el.animate([{ opacity: 0, letterSpacing: '0.65em', filter: 'blur(2px)' }, { opacity: 1, letterSpacing: getComputedStyle(el).letterSpacing === 'normal' ? '0em' : getComputedStyle(el).letterSpacing, filter: 'blur(0)' }], {
				duration: 760 / v,
				delay: retard,
				easing: doç,
				fill: 'backwards'
			})
		);
		return esperar();
	}
	if (efèct === 'ascension') {
		// cada mot monta d'un trauc (son quadre lo copa)
		const mots = copar(el, tèxt, 'mot');
		mots.forEach((m, k) => {
			const quadre = document.createElement('span');
			quadre.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.08em;margin-bottom:-0.08em';
			m.replaceWith(quadre);
			quadre.append(m);
			animacions.push(m.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 640 / v, delay: retard + (k * 70) / v, easing: doç, fill: 'backwards' }));
		});
		return esperar();
	}
	if (efèct === 'maquina') {
		// las letras arriban una a una, lo cursor las seguís, puèi s'escantís
		const letras = copar(el, tèxt, 'letra');
		for (const l of letras) l.style.opacity = '0';
		const cursor = document.createElement('span');
		cursor.setAttribute('aria-hidden', 'true');
		cursor.style.cssText = 'display:inline-block;width:0.08em;height:1em;margin-left:0.04em;vertical-align:-0.12em;background:currentColor';
		const pas = 55 / v;
		return new Promise((res) => {
			const t0 = setTimeout(() => {
				letras[0]?.after(cursor);
				letras.forEach((l, k) =>
					temporizadors.push(
						setTimeout(() => {
							l.style.opacity = '1';
							l.after(cursor);
						}, k * pas)
					)
				);
				temporizadors.push(
					setTimeout(() => {
						const a = cursor.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'steps(1, end)', fill: 'forwards' });
						animacions.push(a);
						a.finished.catch(() => {}).then(() => (fin(), res()));
					}, letras.length * pas + 120)
				);
			}, retard);
			temporizadors.push(t0);
		});
	}
	if (efèct === 'bloc') {
		// un bloc d'or passa, lo tèxt es dejós quand se retira
		const cap = copar(el, tèxt, 'mot', true).cap,
			color = getComputedStyle(el).color;
		const b = document.createElement('span');
		b.setAttribute('aria-hidden', 'true');
		b.style.cssText = `position:absolute;inset:0.05em -0.08em;background:${o.color ?? 'var(--t-aur, #e2a93b)'};transform-origin:0 50%;transform:scaleX(0);pointer-events:none;border-radius:2px`;
		cap.append(b);
		const d = 760 / v;
		animacions.push(
			b.animate(
				[
					{ transform: 'scaleX(0)', transformOrigin: '0 50%' },
					{ transform: 'scaleX(1)', transformOrigin: '0 50%', offset: 0.45 },
					{ transform: 'scaleX(1)', transformOrigin: '100% 50%', offset: 0.55 },
					{ transform: 'scaleX(0)', transformOrigin: '100% 50%' }
				],
				{ duration: d, delay: retard, easing: 'cubic-bezier(0.7, 0, 0.3, 1)' }
			)
		);
		animacions.push(
			cap.animate([{ color: 'transparent' }, { color: 'transparent', offset: 0.5 }, { color, offset: 0.501 }, { color }], { duration: d, delay: retard, fill: 'backwards' })
		);
		return esperar();
	}

	if (efèct === 'deroulat') {
		// Lo desrotlat de Canva, mesurat sus l'ensag de Romain (2026-10-11,
		// « bonjour », 7 letras seguidas imatge per imatge) : cada letra es dins
		// sa fenèstra (la nautor de la linha, copada en naut e en bas) e fa un
		// torn complet de rotlèu amb la meteissa letra :
		//   1. travèrsa la fenèstra d'en naut en bas e ne sortís (0,27 s, partença
		//      e arribada doças) ;
		//   2. torna d'en naut e se pausa a sa plaça en ralentissent, sens rebond
		//      (0,19 s). (Corbas ajustadas sus las mesuras, a 0,003 prèp.)
		// Escondida abans sa partença ; una letra cada 0,12 s.
		const cs = getComputedStyle(el),
			fs = parseFloat(cs.fontSize) || 16,
			// (la fenèstra a la nautor de la linha del tèxt : res bolega a la fin)
			h = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / fs,
			// (lo camin : 0,86 linha de cada costat de sa plaça, coma sus Canva)
			d = (0.86 * h).toFixed(3);
		const clip = typeof CSS !== 'undefined' && CSS.supports?.('overflow', 'clip');
		const fenèstra = clip
			? `;overflow-x:visible;overflow-y:clip;height:${h}em;line-height:${h}em`
			: `;overflow:hidden;height:${h}em;line-height:${h}em;vertical-align:-0.28em;padding:0 0.12em;margin:0 -0.12em`;
		const letras = copar(el, tèxt, 'letra');
		letras.forEach((l, k) => {
			const c = l.textContent;
			l.textContent = '';
			l.style.cssText += fenèstra;
			const letra = document.createElement('span');
			letra.style.cssText = 'display:block;will-change:transform';
			letra.textContent = c;
			l.append(letra);
			animacions.push(
				letra.animate(
					[
						{ transform: `translateY(-${d}em)`, opacity: 0, offset: 0, easing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)' },
						{ opacity: 1, offset: 0.002 },
						{ transform: `translateY(${d}em)`, offset: 0.579 },
						{ transform: `translateY(-${d}em)`, offset: 0.5795, easing: 'cubic-bezier(0.24, 0.62, 0.52, 1)' },
						{ transform: 'translateY(0)', offset: 1 }
					],
					{ duration: 461 / v, delay: retard + (k * 116) / v, fill: 'both' }
				)
			);
		});
		return esperar();
	}

	// letra per letra
	const letras = copar(el, tèxt, efèct === 'clarificar' ? 'mot' : 'letra', efèct === 'explosion');
	const n = letras.length;
	letras.forEach((l, k) => {
		const p = (PER_UNITAT[efèct] ?? PER_UNITAT.decalatge)(k, n);
		if (p.origin) l.style.transformOrigin = p.origin;
		animacions.push(l.animate(p.kf, { duration: p.dur / v, delay: retard + (k * p.pas) / v, easing: p.easing, fill: 'backwards' }));
	});
	// l'explosion : d'esclats a l'entorn
	if (efèct === 'explosion') {
		const cap = letras.cap;
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2 + 0.3,
				e = document.createElement('span');
			e.setAttribute('aria-hidden', 'true');
			e.style.cssText = `position:absolute;left:50%;top:50%;width:0.45em;height:2px;margin:-1px 0 0 -0.22em;border-radius:1px;background:${o.color ?? 'var(--t-aur, #e2a93b)'};pointer-events:none`;
			cap.append(e);
			const dx = Math.cos(a),
				dy = Math.sin(a),
				r = cap.offsetWidth * 0.55 + 6;
			animacions.push(
				e.animate(
					[
						{ opacity: 0, transform: `translate(${dx * r * 0.5}px, ${dy * r * 0.35}px) rotate(${a}rad) scaleX(0.2)` },
						{ opacity: 1, transform: `translate(${dx * r * 0.85}px, ${dy * r * 0.6}px) rotate(${a}rad) scaleX(1)`, offset: 0.4 },
						{ opacity: 0, transform: `translate(${dx * r}px, ${dy * r * 0.72}px) rotate(${a}rad) scaleX(0.3)` }
					],
					{ duration: 620 / v, delay: retard + 120 / v, easing: 'ease-out', fill: 'backwards' }
				)
			);
		}
	}
	return esperar();
}

// En Svelte : <h2 {@attach animat('rebond')}>Lo Ligam</h2> (a l'aparicion de l'element)
export const animat = (efèct, o) => (el) => {
	animarText(el, efèct, o);
	return () => el._animarText?.anullar();
};
