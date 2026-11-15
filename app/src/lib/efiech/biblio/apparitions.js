// COPIE d'Efièch 0.1.0 (C:\Users\perie\Depots\Efiech). Ne pas modifier ici : modifier là-bas, puis « node synchroniser.mjs ».
// Les dix apparitions (famille 2 de la planche) : comment les pièces entrent en
// scène. init(E) les place au départ ; entree(p, E, dt, u) les fait avancer et
// rend true quand la pièce est arrivée : le mouvement prend alors le relais,
// avec la position et la vitesse qu'elle a à cet instant.
//
// Les réglages de l'apparition se lisent dans E.R['a.<nom>'].

import { boiteTrace } from './dessin.js';

// (l'éclatement d'un dessin à une seule forme retombe sur l'explosion : ses réglages manquants prennent ces valeurs)
const REPLI = { direction: 90, dispersion: 120, elan: 1, duree: 1.4 };
const a = (E, k) => E.R['a.' + k] ?? REPLI[k];
const borne = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x));
const echelleZone = (E) => Math.sqrt(Math.min(E.L, E.H) / 500);

// une gerbe : chaque pièce part d'un point avec sa vitesse, la gravité la ramène
function jaillir(p, E, ox, oy, th, v) {
	p.x = ox;
	p.y = oy;
	p.vx = Math.cos(th) * v;
	p.vy = Math.sin(th) * v;
	p.va = (E.alea() - 0.5) * 0.3;
	p.e = 0;
}
function voler(p, E, u, g = 0.22, frein = 0.985) {
	p.vy += g * u;
	const f = Math.pow(frein, u);
	p.vx *= f;
	p.vy *= f;
	p.x += p.vx * u;
	p.y += p.vy * u;
	p.a += p.va * u;
}

function rangs(n, ordre, places, E) {
	const idx = [...Array(n).keys()];
	if (ordre === 'fin') return idx.map((i) => n - 1 - i);
	if (ordre === 'hasard') {
		const melange = idx.map((i) => [E.alea(), i]).sort((x, y) => x[0] - y[0]);
		const r = [];
		melange.forEach(([, i], k) => (r[i] = k));
		return r;
	}
	if (ordre === 'centre') {
		const d = places.map(([x, y], i) => [Math.hypot(x - E.L / 2, y - E.H / 2), i]).sort((x, y) => x[0] - y[0]);
		const r = [];
		d.forEach(([, i], k) => (r[i] = k));
		return r;
	}
	return idx;
}

// un ressort amorti qui part de 0 et se pose sur 1, en fonction du temps
function ressaut(t, w, z = 0.35) {
	if (t <= 0) return 0;
	return 1 - Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t);
}

export const APPAR = {
	aucune: {
		entree: () => true
	},

	explosion: {
		init(E) {
			const o = E.origine ?? { x: E.L / 2, y: E.H * 0.62 };
			const dir = (-a(E, 'direction') * Math.PI) / 180;
			const disp = (a(E, 'dispersion') * Math.PI) / 180;
			const k = echelleZone(E) * a(E, 'elan');
			for (const p of E.pieces) jaillir(p, E, o.x, o.y, dir + (E.alea() - 0.5) * disp, (5 + E.alea() * 9) * k);
		},
		entree(p, E, dt, u) {
			p.e = borne(p.age / 0.15);
			voler(p, E, u);
			return p.age >= a(E, 'duree');
		}
	},

	canons: {
		init(E) {
			const disp = (a(E, 'dispersion') * Math.PI) / 180;
			const g = 0.22;
			E.pieces.forEach((p, i) => {
				const gauche = i % 2 === 0;
				const base = gauche ? -Math.PI / 3 : (-2 * Math.PI) / 3;
				const vy = Math.sqrt(2 * g * E.H * (0.55 + E.alea() * 0.35)) * a(E, 'elan');
				const v = vy / Math.sin(Math.PI / 3);
				jaillir(p, E, gauche ? 0 : E.L, E.H, base + (E.alea() - 0.5) * disp, v);
			});
		},
		entree(p, E, dt, u) {
			p.e = borne(p.age / 0.12);
			voler(p, E, u, 0.22, 0.99);
			return p.age >= a(E, 'duree');
		}
	},

	eclatement: {
		// une pièce par forme du dessin déposé (le premier)
		nombre(E) {
			const n = E.dessins[0]?.traces.length ?? 0;
			return n >= 2 ? Math.min(150, n) : Math.round(E.R.nombre);
		},
		init(E) {
			const d = E.dessins[0];
			if (!d || d.traces.length < 2) return APPAR.explosion.init(E);
			const [bx, by, bw, bh] = d.boite;
			const k = (a(E, 'grandeur') * Math.min(E.L, E.H)) / Math.max(bw, bh);
			const cx = E.L / 2;
			const cy = E.H / 2;
			E.centreEclat = [cx, cy];
			E.pieces.forEach((p, i) => {
				const b = boiteTrace(d.traces[i]) ?? [bx, by, bx + bw, by + bh];
				p.trace = i;
				p.di = 0;
				p.cx = (b[0] + b[2]) / 2;
				p.cy = (b[1] + b[3]) / 2;
				p.echelle = k;
				p.s = Math.max(6, Math.max(b[2] - b[0], b[3] - b[1]) * k);
				p.x = p.hx = cx + (p.cx - (bx + bw / 2)) * k;
				p.y = p.hy = cy + (p.cy - (by + bh / 2)) * k;
				p.a = 0;
				p.e = 1;
				p.vx = p.vy = p.va = 0;
			});
		},
		entree(p, E, dt, u) {
			if (p.trace === undefined) return APPAR.explosion.entree(p, E, dt, u);
			const tenue = a(E, 'tenue');
			if (p.age < tenue) return false;
			if (!p.parti) {
				p.parti = true;
				const [cx, cy] = E.centreEclat;
				const th = Math.atan2(p.y - cy, p.x - cx) + (E.alea() - 0.5) * 0.6;
				const v = (3 + E.alea() * 6) * a(E, 'elan') * echelleZone(E);
				p.vx = Math.cos(th) * v;
				p.vy = Math.sin(th) * v - 2;
				p.va = (E.alea() - 0.5) * 0.25;
			}
			voler(p, E, u, 0.12, 0.985);
			return p.age >= tenue + 1;
		}
	},

	bouquet: {
		init(E) {
			E.feu = { x: E.L / 2, y: E.H * a(E, 'hauteur'), montee: 0.9, eclate: false };
			E.pieces.forEach((p, i) => {
				p.x = E.feu.x;
				p.y = E.H + p.s;
				p.al = i === 0 ? 1 : 0;
				p.e = i === 0 ? 0.6 : 0;
				p.vx = p.vy = 0;
			});
		},
		entree(p, E, dt, u) {
			const f = E.feu;
			if (p.age < f.montee) {
				if (p.i === 0) {
					const q = 1 - Math.pow(1 - p.age / f.montee, 2);
					p.y = E.H + p.s - (E.H + p.s - f.y) * q;
				}
				return false;
			}
			if (!p.parti) {
				p.parti = true;
				const n = E.pieces.length;
				const th = (p.i / n) * Math.PI * 2 + E.alea() * 0.2;
				const v = (3 + E.alea() * 1.5) * a(E, 'elan') * echelleZone(E);
				p.x = f.x;
				p.y = f.y;
				p.vx = Math.cos(th) * v;
				p.vy = Math.sin(th) * v;
				p.va = (E.alea() - 0.5) * 0.2;
				p.al = 1;
			}
			p.e = borne((p.age - f.montee) / 0.12);
			voler(p, E, u, 0.06, 0.975);
			return p.age >= f.montee + 1.3;
		}
	},

	cascade: {
		init(E) {
			const r = rangs(E.pieces.length, a(E, 'ordre'), E.pieces.map((p) => [p.hx, p.hy]), E);
			E.pieces.forEach((p, i) => {
				p.delai = r[i] * a(E, 'delai');
				p.al = 0;
			});
		},
		entree(p, E) {
			const t = p.age - p.delai;
			if (t < 0) return false;
			const q = borne(t / 0.5);
			const ease = 1 - Math.pow(1 - q, 3);
			p.al = ease;
			p.x = p.hx;
			p.y = p.hy + 22 * (1 - ease);
			return q >= 1;
		}
	},

	cascadeRessort: {
		init(E) {
			E.pieces.forEach((p, i) => {
				p.delai = i * a(E, 'delai');
				p.e = 0;
				p.al = 0;
			});
		},
		entree(p, E) {
			const t = p.age - p.delai;
			if (t < 0) return false;
			const w = 12 * a(E, 'raideur');
			p.al = borne(t / 0.08);
			p.e = ressaut(t, w);
			if (t > 4 / (0.35 * w)) {
				p.e = 1;
				return true;
			}
			return false;
		}
	},

	trace: {
		init(E) {
			E.vectoriel = true;
			E.pieces.forEach((p, i) => {
				p.delai = i * a(E, 'delai');
				p.avance = 0;
				p.al = 0;
			});
		},
		entree(p, E) {
			const t = p.age - p.delai;
			if (t < 0) return false;
			p.al = 1;
			p.avance = borne(t / a(E, 'duree'));
			if (p.avance >= 1) {
				p.avance = 1;
				return true;
			}
			return false;
		}
	},

	eclosion: {
		init(E) {
			E.pieces.forEach((p, i) => {
				p.delai = i * a(E, 'delai');
				p.sy = 0;
				p.e = 0.35;
				p.al = 0;
			});
		},
		entree(p, E) {
			const t = p.age - p.delai;
			if (t < 0) return false;
			const w = 9 * a(E, 'elan');
			p.al = borne(t / 0.06);
			p.sy = Math.max(0.001, ressaut(t, w, 0.45));
			p.e = 0.35 + 0.65 * ressaut(t - 0.12, w);
			if (t > 0.12 + 4 / (0.35 * w)) {
				delete p.sy;
				p.e = 1;
				return true;
			}
			return false;
		}
	},

	pluie: {
		init(E) {
			const th = (a(E, 'inclinaison') * Math.PI) / 180;
			for (const p of E.pieces) {
				const y0 = -p.s - E.alea() * E.H * 0.8;
				const v = (12 + E.alea() * 6) * a(E, 'elan') * echelleZone(E);
				p.x = p.hx - Math.tan(th) * (p.hy - y0);
				p.y = y0;
				p.vx = Math.sin(th) * v;
				p.vy = Math.cos(th) * v;
				p.a = -th;
			}
		},
		entree(p, E, dt, u) {
			p.x += p.vx * u;
			p.y += p.vy * u;
			if (p.y >= p.hy) {
				p.x = p.hx;
				p.y = p.hy;
				p.vx *= 0.1;
				p.vy *= 0.1;
				return true;
			}
			return false;
		}
	},

	fondu: {
		init(E) {
			for (const p of E.pieces) {
				p.delai = E.alea() * a(E, 'desordre');
				p.al = 0;
				p.e = 0.6;
			}
		},
		entree(p, E) {
			const t = p.age - p.delai;
			if (t < 0) return false;
			const q = borne(t / a(E, 'duree'));
			p.al = q;
			p.e = 0.6 + 0.4 * q;
			return q >= 1;
		}
	}
};
