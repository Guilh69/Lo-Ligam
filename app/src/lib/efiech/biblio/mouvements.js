// COPIE d'Efièch 0.1.0 (C:\Users\perie\Depots\Efiech). Ne pas modifier ici : modifier là-bas, puis « node synchroniser.mjs ».
// Les douze mouvements (famille 1 de la planche) : comment une pièce bouge une
// fois entrée en scène. Chacun reçoit la pièce p, l'état E (taille de la zone,
// réglages, pointeur), u (le temps écoulé compté en images à 60 par seconde,
// vitesse choisie comprise) et dt (le même en secondes réelles).
//
// Les réglages du mouvement se lisent dans E.R['m.<nom>'].

const m = (E, k) => E.R['m.' + k];

function bordsEnBoucle(p, E) {
	const e = p.s;
	if (p.x < -e) p.x += E.L + 2 * e;
	else if (p.x > E.L + e) p.x -= E.L + 2 * e;
	if (p.y < -e) p.y += E.H + 2 * e;
	else if (p.y > E.H + e) p.y -= E.H + 2 * e;
}

function bordsRebond(p, E, perte = 0.6) {
	const e = p.s / 2;
	if (p.x < e) (p.x = e), (p.vx = Math.abs(p.vx) * perte);
	else if (p.x > E.L - e) (p.x = E.L - e), (p.vx = -Math.abs(p.vx) * perte);
	if (p.y < e) (p.y = e), (p.vy = Math.abs(p.vy) * perte);
	else if (p.y > E.H - e) (p.y = E.H - e), (p.vy = -Math.abs(p.vy) * perte);
}

// une main qui passe vite pousse les pièces proches (gravité, lancer, ressort)
function coupDeMain(p, E, portee, force) {
	const q = E.ptr;
	if (!q) return false;
	const v = Math.hypot(q.vx, q.vy);
	if (v < 4) return false;
	const dx = p.x - q.x;
	const dy = p.y - q.y;
	const d = Math.hypot(dx, dy);
	if (d > portee) return false;
	const f = (1 - d / portee) * force;
	p.vx += q.vx * 0.35 * f;
	p.vy += q.vy * 0.35 * f;
	p.va += (Math.random() - 0.5) * 0.2 * f;
	return true;
}

// un ressort amorti vers une valeur (échelle, angle) : la petite vie de la réaction
function ressortVers(x, v, cible, raideur, amorti, u) {
	const a = (cible - x) * raideur - v * amorti;
	v += a * u;
	return [x + v * u, v];
}

const lisser = (x, cible, k, u) => x + (cible - x) * Math.min(1, k * u);

export const MOUV = {
	aucun: {
		pas(p, E, u) {
			p.vx *= Math.pow(0.85, u);
			p.vy *= Math.pow(0.85, u);
			p.va *= Math.pow(0.85, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a += p.va * u;
			if (Math.abs(p.vx) + Math.abs(p.vy) < 0.01) (p.vx = 0), (p.vy = 0), (p.va = 0);
		}
	},

	derive: {
		continu: true,
		pas(p, E, u) {
			p.dir += (Math.sin(E.t * 0.3 + p.ph) * 0.004 + (E.alea() - 0.5) * 0.01) * u;
			const v = 0.15 + 0.35 * p.k;
			p.vx = lisser(p.vx, Math.cos(p.dir) * v, 0.02, u);
			p.vy = lisser(p.vy, Math.sin(p.dir) * v, 0.02, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a = lisser(p.a, Math.sin(E.t * (0.4 + p.k * 0.4) + p.ph) * m(E, 'balancement') * 0.9, 0.05, u);
			p.e = lisser(p.e, 1, 0.05, u);
			bordsEnBoucle(p, E);
		}
	},

	chute: {
		continu: true,
		depart(p) {
			p.bx = p.x;
		},
		pas(p, E, u) {
			const bal = m(E, 'balancement');
			p.vy = lisser(p.vy, 0.6 + 0.9 * p.k, 0.03, u);
			p.vx = lisser(p.vx, Math.sin(E.t * (0.9 + p.k * 0.6) + p.ph) * bal * 1.6, 0.05, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a = lisser(p.a, Math.sin(E.t * (1 + p.k) + p.ph) * m(E, 'rotation') * 1.4, 0.06, u);
			p.e = lisser(p.e, 1, 0.05, u);
			if (p.y > E.H + p.s) {
				p.y = -p.s;
				p.x = E.alea() * E.L;
			}
			if (p.x < -p.s) p.x += E.L + 2 * p.s;
			else if (p.x > E.L + p.s) p.x -= E.L + 2 * p.s;
		}
	},

	bulles: {
		continu: true,
		pas(p, E, u) {
			p.vy = lisser(p.vy, -(0.5 + 0.9 * p.k), 0.03, u);
			p.vx = lisser(p.vx, Math.sin(E.t * (0.7 + p.k) + p.ph) * m(E, 'ecart') * 1.2, 0.05, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			const haut = 1 - Math.max(0, Math.min(1, p.y / E.H)); // 0 en bas, 1 en haut
			p.e = 0.6 + m(E, 'croissance') * 0.9 * haut;
			// s'efface dans le dernier cinquième (et revient en fondu par le bas)
			const vis = Math.min(1, (1 - haut) / 0.2, Math.max(0, E.H + p.s - p.y) / (p.s * 2) + 0.2);
			if (!p.mourant) p.al = Math.max(0, vis);
			if (p.y < -p.s * 2) {
				p.y = E.H + p.s;
				p.x = E.alea() * E.L;
			}
		}
	},

	attraction: {
		pas(p, E, u) {
			const q = E.ptr;
			const rayon = m(E, 'rayon');
			let tx = p.hx;
			let ty = p.hy;
			let f = 0.004;
			if (q && Math.hypot(p.hx - q.x, p.hy - q.y) < rayon) {
				// chacune sur sa petite orbite autour de la main, pour ne pas s'entasser
				const r = 10 + p.k * Math.min(60, rayon * 0.25);
				const th = p.ph + E.t * (0.8 + p.k);
				tx = q.x + Math.cos(th) * r;
				ty = q.y + Math.sin(th) * r;
				f = 0.012 * m(E, 'force');
			}
			p.vx = (p.vx + (tx - p.x) * f * u) * Math.pow(0.9, u);
			p.vy = (p.vy + (ty - p.y) * f * u) * Math.pow(0.9, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a = lisser(p.a, p.vx * 0.05, 0.1, u);
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	repulsion: {
		pas(p, E, u) {
			const q = E.ptr;
			const rayon = m(E, 'rayon');
			let ax = (p.hx - p.x) * 0.006 * m(E, 'retour');
			let ay = (p.hy - p.y) * 0.006 * m(E, 'retour');
			if (q) {
				const dx = p.x - q.x;
				const dy = p.y - q.y;
				const d = Math.hypot(dx, dy) || 1;
				if (d < rayon) {
					const f = Math.pow(1 - d / rayon, 2) * 2.2 * m(E, 'force');
					ax += (dx / d) * f;
					ay += (dy / d) * f;
				}
			}
			p.vx = (p.vx + ax * u) * Math.pow(0.86, u);
			p.vy = (p.vy + ay * u) * Math.pow(0.86, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a = lisser(p.a, p.vx * 0.08, 0.1, u);
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	gravite: {
		pas(p, E, u) {
			const g = 0.3 * m(E, 'gravite');
			const rebond = m(E, 'rebond');
			const fr = m(E, 'frottement');
			coupDeMain(p, E, 90, 1);
			p.vy += g * u;
			p.vx *= Math.pow(1 - 0.01 * fr, u);
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a += p.va * u;
			p.va *= Math.pow(0.97, u);
			const sol = E.H - p.s / 2;
			if (p.y >= sol) {
				p.y = sol;
				if (p.vy > 0) p.vy = -p.vy * rebond;
				p.vx *= 1 - fr * 0.4;
				p.va *= 0.6;
				if (Math.abs(p.vy) < 0.6) p.vy = 0;
				if (Math.abs(p.vx) < 0.03) p.vx = 0;
				if (Math.abs(p.va) < 0.002) p.va = 0;
			}
			if (p.x < p.s / 2) (p.x = p.s / 2), (p.vx = Math.abs(p.vx) * rebond);
			else if (p.x > E.L - p.s / 2) (p.x = E.L - p.s / 2), (p.vx = -Math.abs(p.vx) * rebond);
			// posée au sol sans vitesse : on cesse de compter la gravité
			if (p.y >= sol && p.vy === 0) p.vy = 0;
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	ressort: {
		continu: true,
		depart(p, E) {
			p.prochain = 2 + p.k * 5;
		},
		pas(p, E, u, dt) {
			const k = 0.02 * m(E, 'raideur');
			const c = 0.02 + m(E, 'amorti') * 0.25;
			coupDeMain(p, E, 100, 1.4);
			// de temps en temps, une petite secousse : la pièce part et revient
			p.prochain -= dt;
			if (p.prochain <= 0) {
				p.prochain = 4 + p.k * 6;
				const th = E.alea() * Math.PI * 2;
				const f = 3 + p.k * 4;
				p.vx += Math.cos(th) * f;
				p.vy += Math.sin(th) * f;
			}
			p.vx += ((p.hx - p.x) * k - p.vx * c) * u;
			p.vy += ((p.hy - p.y) * k - p.vy * c) * u;
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a = lisser(p.a, p.vx * 0.06, 0.15, u);
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	lancer: {
		continu: true,
		depart(p, E) {
			if (Math.hypot(p.vx, p.vy) < 1) MOUV.lancer.relancer(p, E);
			p.arret = 0;
		},
		relancer(p, E) {
			const th = E.alea() * Math.PI * 2;
			const v = (5 + p.k * 7) * m(E, 'elan');
			p.vx = Math.cos(th) * v;
			p.vy = Math.sin(th) * v;
			p.va = (E.alea() - 0.5) * 0.3;
		},
		pas(p, E, u, dt) {
			const res = Math.pow(1 - 0.02 * m(E, 'resistance'), u);
			if (coupDeMain(p, E, 110, m(E, 'elan') * 1.6)) p.arret = 0;
			p.vx *= res;
			p.vy *= res;
			p.va *= res;
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a += p.va * u;
			bordsRebond(p, E, 0.6);
			if (Math.hypot(p.vx, p.vy) < 0.05) {
				p.vx = p.vy = p.va = 0;
				p.arret += dt;
				// repart après un temps de pause
				if (p.arret > 2.5 + p.k * 3) {
					p.arret = 0;
					MOUV.lancer.relancer(p, E);
				}
			}
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	trajectoire: {
		continu: true,
		depart(p, E) {
			p.attente = p.k * 2.4;
			p.vol = false;
			p.al = 0;
		},
		pas(p, E, u, dt) {
			const g = 0.18 * m(E, 'gravite');
			if (!p.vol) {
				p.attente -= dt;
				if (p.attente > 0) return;
				// départ d'en bas, d'un côté ou de l'autre, pour monter aux trois quarts de la zone
				const gauche = E.alea() < 0.5;
				const ang = (m(E, 'angle') * Math.PI) / 180;
				const vy = Math.sqrt(2 * g * E.H * (0.55 + p.k * 0.3));
				p.x = gauche ? E.L * (0.05 + E.alea() * 0.2) : E.L * (0.75 + E.alea() * 0.2);
				p.y = E.H + p.s / 2;
				p.vy = -vy;
				p.vx = (gauche ? 1 : -1) * (vy / Math.tan(ang));
				p.va = (gauche ? 1 : -1) * (0.05 + p.k * 0.06);
				p.vol = true;
				p.al = 1;
			}
			p.vy += g * u;
			p.x += p.vx * u;
			p.y += p.vy * u;
			p.a += p.va * u;
			if (p.y > E.H + p.s * 2 || p.x < -p.s * 2 || p.x > E.L + p.s * 2) {
				p.vol = false;
				p.attente = 0.3 + E.alea() * 1.5;
				p.al = 0;
			}
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	essaim: {
		continu: true,
		depart(p, E) {
			if (Math.hypot(p.vx, p.vy) < 0.5) {
				const th = E.alea() * Math.PI * 2;
				p.vx = Math.cos(th) * 1.5;
				p.vy = Math.sin(th) * 1.5;
			}
		},
		pas() {},
		groupe(E, u) {
			const P = E.pieces.filter((p) => p.libre && !p.mort);
			const voir = 80;
			const coh = m(E, 'cohesion');
			const ali = m(E, 'alignement');
			const ec = m(E, 'ecart');
			for (const p of P) {
				let cx = 0, cy = 0, vx = 0, vy = 0, sx = 0, sy = 0, n = 0;
				for (const o of P) {
					if (o === p) continue;
					const dx = o.x - p.x;
					const dy = o.y - p.y;
					const d2 = dx * dx + dy * dy;
					if (d2 > voir * voir) continue;
					n++;
					cx += o.x;
					cy += o.y;
					vx += o.vx;
					vy += o.vy;
					const proche = p.s * 1.1 + 6;
					if (d2 < proche * proche) {
						const d = Math.sqrt(d2) || 1;
						sx -= dx / d;
						sy -= dy / d;
					}
				}
				if (n) {
					p.vx += ((cx / n - p.x) * 0.0012 * coh + (vx / n - p.vx) * 0.05 * ali + sx * 0.12 * ec) * u;
					p.vy += ((cy / n - p.y) * 0.0012 * coh + (vy / n - p.vy) * 0.05 * ali + sy * 0.12 * ec) * u;
				}
				// la main fait peur à la volée
				const q = E.ptr;
				if (q) {
					const dx = p.x - q.x;
					const dy = p.y - q.y;
					const d = Math.hypot(dx, dy) || 1;
					if (d < 90) {
						p.vx += (dx / d) * 0.25 * u;
						p.vy += (dy / d) * 0.25 * u;
					}
				}
				// et elle reste loin des bords
				const b = 40;
				if (p.x < b) p.vx += 0.06 * u;
				if (p.x > E.L - b) p.vx -= 0.06 * u;
				if (p.y < b) p.vy += 0.06 * u;
				if (p.y > E.H - b) p.vy -= 0.06 * u;
				const v = Math.hypot(p.vx, p.vy) || 1;
				const lim = Math.max(1, Math.min(2.6, v));
				p.vx = (p.vx / v) * lim;
				p.vy = (p.vy / v) * lim;
			}
			for (const p of P) {
				p.x += p.vx * u;
				p.y += p.vy * u;
				p.a = lisser(p.a, Math.atan2(p.vy, p.vx) + Math.PI / 2, 0.15, u);
				p.e = lisser(p.e, 1, 0.05, u);
				bordsEnBoucle(p, E);
			}
		}
	},

	tourbillon: {
		continu: true,
		depart(p, E) {
			const c = MOUV.tourbillon.centre(E);
			const R = m(E, 'rayon');
			p.r = Math.max(16, Math.min(R, Math.hypot(p.x - c[0], p.y - c[1]) || 16 + p.k * R));
			// chacune vise sa propre orbite, dans la limite du rayon
			p.rCible = 16 + Math.sqrt(p.k) * (R - 16);
			p.th = Math.atan2(p.y - c[1], p.x - c[0]);
		},
		centre(E) {
			return E.ptr ? [E.ptr.x, E.ptr.y] : [E.L / 2, E.H / 2];
		},
		pas(p, E, u) {
			const c = MOUV.tourbillon.centre(E);
			const sens = Number(m(E, 'sens')) || 1;
			p.r = lisser(p.r, p.rCible + Math.sin(E.t * 0.6 + p.ph) * m(E, 'vent') * 30, 0.02, u);
			p.th += sens * 0.035 * Math.sqrt(60 / Math.max(16, p.r)) * u;
			const tx = c[0] + Math.cos(p.th) * p.r;
			const ty = c[1] + Math.sin(p.th) * p.r;
			const nx = lisser(p.x, tx, 0.08, u);
			const ny = lisser(p.y, ty, 0.08, u);
			p.vx = nx - p.x;
			p.vy = ny - p.y;
			p.x = nx;
			p.y = ny;
			p.a = lisser(p.a, p.th + (sens * Math.PI) / 2, 0.1, u);
			p.e = lisser(p.e, 1, 0.05, u);
		}
	},

	reaction: {
		continu: true,
		depart(p) {
			p.ve = 0;
			p.ar = p.a;
		},
		secouer(p, E) {
			const amp = m(E, 'ampleur');
			p.ve += 0.08 * amp * (0.8 + p.k * 0.4);
			p.va += 0.06 * amp * (p.k < 0.5 ? -1 : 1);
		},
		pas(p, E, u) {
			const amp = m(E, 'ampleur');
			const raideur = 0.6 / (m(E, 'duree') * 10);
			const q = E.ptr;
			const dessus = q && Math.hypot(p.x - q.x, p.y - q.y) < p.s * 0.75 + 8;
			const ce = dessus ? 1 + 0.25 * amp : 1;
			const ca = (p.ar ?? 0) + (dessus ? 0.31 * amp : 0);
			[p.e, p.ve] = ressortVers(p.e, p.ve, ce, raideur, raideur * 0.9, u);
			let vaa = p.vaa ?? 0;
			[p.a, vaa] = ressortVers(p.a, vaa + p.va, ca, raideur, raideur * 0.9, u);
			p.vaa = vaa;
			p.va = 0;
			// une respiration à peine visible
			p.y = p.hy + Math.sin(E.t * 1.2 + p.ph) * 1.5;
			p.x = p.hx;
		}
	}
};
