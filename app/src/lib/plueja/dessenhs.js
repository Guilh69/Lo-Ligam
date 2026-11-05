// Dessins au trait pour la poussière d'or (Romain, 05-11 : « que la poussière
// dessine de manière très minimaliste, avec des traits, l'élément »).
//
// Chaque dessin est une liste de chemins SVG dans un carré de 100 × 100 ;
// la clé est le mot occitan tel qu'il est écrit dans scenas.js. Un mot sans
// dessin se forme quand même : les grains du dessin rejoignent alors le mot.
// Un seul poids de trait, pas de remplissage : c'est la poussière qui dessine.
//
// Toutes les unités ont des dessins depuis le 05-11 (Romain : « Oui, dessine ») ;
// seuls les objets concrets en ont : salutations, lieux abstraits, nombres,
// jours, couleurs et petits mots se forment sans dessin. Un dessin douteux vaut mieux absent
// (Joan, 05-11). Garriga, Fenèstra et Nuèch en ont aussi depuis le 05-11
// (consolidation) : la pluie, les plantes, les pierres, les bêtes, le ciel ;
// pierre, rosée et thym retirés sur avis de Joan (illisibles au trait) ;
// les mots abstraits (silence, rêve, odeur, ombre…) restent sans.
// Tous les dessins se voient sur /ensag/dessenhs.

// ── Petites formes réutilisées ───────────────────────────────────────────
const r1 = (v) => Math.round(v * 10) / 10;
/** Cercle complet de centre (x, y). */
const cercle = (x, y, r) => `M${r1(x - r)} ${r1(y)}a${r} ${r} 0 1 0 ${r1(2 * r)} 0a${r} ${r} 0 1 0 ${r1(-2 * r)} 0`;
/** n rayons entre les distances ra et rb du centre. */
function rayons(x, y, ra, rb, n = 8, a0 = Math.PI / 8, arc = 2 * Math.PI) {
	let d = '';
	for (let k = 0; k < n; k++) {
		const a = a0 + (k * arc) / n,
			c = Math.cos(a),
			s = Math.sin(a);
		d += `M${r1(x + c * ra)} ${r1(y + s * ra)}L${r1(x + c * rb)} ${r1(y + s * rb)}`;
	}
	return d;
}
const soleil = (x, y, r) => [cercle(x, y, r), rayons(x, y, r * 1.5, r * 2.1)];
/** Croissant de lune ouvert à droite (cercle de centre (x, y)). */
const lune = (x, y, r) => `M${r1(x)} ${r1(y - r)}A${r} ${r} 0 1 0 ${r1(x)} ${r1(y + r)}A${r1((r * 4) / 3)} ${r1((r * 4) / 3)} 0 0 1 ${r1(x)} ${r1(y - r)}Z`;
/** Petite étoile à quatre branches. */
const etoile = (x, y, r) => `M${r1(x)} ${r1(y - r)}L${r1(x)} ${r1(y + r)}M${r1(x - r)} ${r1(y)}L${r1(x + r)} ${r1(y)}`;
/** Goutte, pointe en haut, ventre de rayon r centré en (x, y). */
const goutte = (x, y, r) =>
	`M${r1(x)} ${r1(y - 2.2 * r)}C${r1(x - 0.3 * r)} ${r1(y - 1.4 * r)} ${r1(x - r)} ${r1(y - 0.6 * r)} ${r1(x - r)} ${r1(y)}A${r} ${r} 0 0 0 ${r1(x + r)} ${r1(y)}C${r1(x + r)} ${r1(y - 0.6 * r)} ${r1(x + 0.3 * r)} ${r1(y - 1.4 * r)} ${r1(x)} ${r1(y - 2.2 * r)}Z`;
/** Flocon à six branches (avec ramures s'il est assez grand). */
function flocon(x, y, r) {
	let d = '';
	for (let k = 0; k < 6; k++) {
		const a = (k * Math.PI) / 3 - Math.PI / 2,
			c = Math.cos(a),
			s = Math.sin(a);
		d += `M${r1(x)} ${r1(y)}L${r1(x + c * r)} ${r1(y + s * r)}`;
		if (r > 12)
			for (const sg of [-1, 1]) {
				const bx = x + c * r * 0.6,
					by = y + s * r * 0.6,
					b = a + (sg * Math.PI) / 4;
				d += `M${r1(bx)} ${r1(by)}L${r1(bx + Math.cos(b) * r * 0.28)} ${r1(by + Math.sin(b) * r * 0.28)}`;
			}
	}
	return d;
}
/** Empreinte de pied droit (gauche en miroir), pointe en haut, talon compris. */
function empreinte(x, y, s = 1, gauche = false) {
	const m = gauche ? -1 : 1,
		P = (dx, dy) => `${r1(x + dx * s * m)} ${r1(y + dy * s)}`;
	return `M${P(0, 8)}C${P(-5, 8)} ${P(-7, 0)} ${P(-6, -8)}C${P(-5, -16)} ${P(5, -18)} ${P(6, -10)}C${P(7, -2)} ${P(5, 8)} ${P(0, 8)}Z` + cercle(x, y + 15 * s, r1(4.5 * s));
}
const NUAGE = 'M28 58C18 58 14 50 18 44C20 40 24 38 28 39C28 28 40 22 50 28C54 20 68 20 72 30C82 30 88 40 84 50C82 55 78 58 72 58Z';
/** Le même nuage, au milieu du carré (quand il est seul). */
const NUAGE_MIEG = 'M28 70C18 70 14 62 18 56C20 52 24 50 28 51C28 40 40 34 50 40C54 32 68 32 72 42C82 42 88 52 84 62C82 67 78 70 72 70Z';
/** Spirale qui s'enroule vers le centre (x, y), depuis le rayon r. */
function spirale(x, y, r, tours = 2.4, a0 = 0) {
	const pas = Math.round(40 * tours);
	let d = '';
	for (let i = 0; i <= pas; i++) {
		const t = i / pas,
			a = a0 + t * tours * 2 * Math.PI,
			q = r * (1 - 0.88 * t);
		d += `${i ? 'L' : 'M'}${r1(x + Math.cos(a) * q)} ${r1(y + Math.sin(a) * q)}`;
	}
	return d;
}
/** Étoile à n branches, rayons R (pointes) et r (creux). */
function estela(x, y, R, r, n = 5) {
	let d = '';
	for (let k = 0; k < 2 * n; k++) {
		const a = -Math.PI / 2 + (k * Math.PI) / n,
			q = k % 2 ? r : R;
		d += `${k ? 'L' : 'M'}${r1(x + Math.cos(a) * q)} ${r1(y + Math.sin(a) * q)}`;
	}
	return d + 'Z';
}
/** Brin de romarin : tige de (x0, y0) à (x1, y1), n paires d'aiguilles tournées vers la pointe. */
function brin(x0, y0, x1, y1, n, l) {
	const ang = Math.atan2(y1 - y0, x1 - x0);
	let d = `M${x0} ${y0}L${x1} ${y1}`;
	for (let i = 1; i <= n; i++) {
		const t = 0.12 + (0.84 * i) / (n + 1),
			px = x0 + (x1 - x0) * t,
			py = y0 + (y1 - y0) * t,
			ll = l * (1 - 0.45 * t);
		for (const s of [-1, 1]) {
			const a = ang + s * 0.7;
			d += `M${r1(px)} ${r1(py)}L${r1(px + Math.cos(a) * ll)} ${r1(py + Math.sin(a) * ll)}`;
		}
	}
	return d;
}
/** Épi de lavande : tige de (x0, y0) à (x1, y1), petits boutons sur le dernier tiers. */
function epi(x0, y0, x1, y1, n = 6) {
	let d = `M${x0} ${y0}L${x1} ${y1}`;
	for (let i = 0; i < n; i++) {
		const t = 0.64 + (0.36 * i) / (n - 1),
			s = i % 2 ? 1 : -1;
		d += cercle(x0 + (x1 - x0) * t + s * 2.6, y0 + (y1 - y0) * t, 2.2);
	}
	return d;
}
/** Silhouette symétrique : points de la moitié gauche, le premier et le dernier sur l'axe x = 50. */
function simetrica(pts) {
	const tot = [...pts, ...pts.slice(1, -1).reverse().map(([x, y]) => [100 - x, y])];
	return tot.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('') + 'Z';
}
/** La course du jour : l'horizon, l'arc du soleil en pointillé, et l'astre au point t (0 → 1). */
function bez(t) {
	const u = 1 - t;
	return [u * u * u * 14 + 3 * u * u * t * 14 + 3 * u * t * t * 86 + t * t * t * 86, u * u * u * 78 + 3 * u * u * t * 8 + 3 * u * t * t * 8 + t * t * t * 78];
}
function course(t, astre = 'soleil') {
	const [x, y] = bez(t);
	let d = 'M6 78L94 78';
	for (let i = 0; i < 30; i += 2) {
		const [x1, y1] = bez(i / 30),
			[x2, y2] = bez((i + 1) / 30);
		if (Math.hypot((x1 + x2) / 2 - x, (y1 + y2) / 2 - y) < 15) continue; // l'arc s'efface autour de l'astre
		d += `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`;
	}
	if (astre === 'lune') return [d, lune(x + 4, y, 9), etoile(x + 16, y - 12, 4), etoile(x - 18, y + 8, 3)];
	if (astre === 'couchant')
		return [d, `M${r1(x - 9)} 78A9 9 0 0 1 ${r1(x + 9)} 78`, rayons(x, 78, 13, 18, 4, Math.PI + Math.PI / 5, Math.PI * 0.8), `M${r1(x - 10)} 84L${r1(x + 6)} 84M${r1(x - 6)} 89L${r1(x + 2)} 89`];
	return [d, ...soleil(x, y, 6)];
}

export const DESSENHS = {
	// ── Unité 5 · Al mercat ──────────────────────────────────────────────
	'lo mercat': [
		'M10 40L50 20L90 40', // auvent
		'M10 40C16 48 24 48 30 40C36 48 44 48 50 40C56 48 64 48 70 40C76 48 84 48 90 40', // festons
		'M18 48L18 84M82 48L82 84', // poteaux
		'M12 70L88 70M12 70L12 84M88 70L88 84' // étal
	],
	'la poma': [
		'M50 30C35 18 12 28 15 55C18 80 38 92 50 84C62 92 82 80 85 55C88 28 65 18 50 30Z',
		'M50 30C50 22 52 16 56 12',
		'M53 20C60 12 70 12 74 16C68 22 60 23 53 20Z'
	],
	'la pera': [
		'M50 18C44 18 42 30 40 40C36 52 24 60 26 76C28 90 44 94 50 94C56 94 72 90 74 76C76 60 64 52 60 40C58 30 56 18 50 18Z',
		'M50 18C50 12 52 8 55 5'
	],
	'l’uòu': ['M50 14C30 14 22 50 24 66C26 82 38 90 50 90C62 90 74 82 76 66C78 50 70 14 50 14Z'],
	'la tomata': [
		'M50 34C26 34 14 50 18 66C22 84 40 90 50 90C60 90 78 84 82 66C86 50 74 34 50 34Z',
		'M50 34L42 26M50 34L58 26M50 34L38 37M50 34L62 37M50 34L50 22'
	],
	'la ceba': [
		// oignon rond et trapu, à tige recourbée (l'ail, lui, est haut et en gousses)
		'M50 30C56 36 66 38 74 44C84 52 84 70 74 80C66 87 34 87 26 80C16 70 16 52 26 44C34 38 44 36 50 30Z',
		'M50 34C40 46 38 66 44 84M50 34C60 46 62 66 56 84',
		'M50 30C50 20 46 12 38 8',
		'M44 87L42 93M50 87L50 94M56 87L58 93'
	],
	'la patana': [
		// pomme de terre : un tubercule allongé et bosselé, couché (Romain, 05-11 : « un peu plus en forme de patate »)
		'M14 54C12 44 20 36 32 34C40 32 48 35 56 32C68 30 86 38 88 50C90 60 80 70 68 70C56 73 44 72 34 70C24 70 16 64 14 54Z',
		cercle(32, 48, 1.3) + cercle(50, 42, 1.3) + cercle(44, 60, 1.3) + cercle(66, 54, 1.3) + cercle(74, 44, 1.3) // les yeux
	],
	'l’alh': [
		'M50 22C36 36 24 46 24 64C24 80 36 88 50 88C64 88 76 80 76 64C76 46 64 36 50 22Z', // tête d'ail
		'M50 22C44 40 42 60 44 88M50 22C56 40 58 60 56 88M50 22C34 44 30 62 32 82M50 22C66 44 70 62 68 82', // gousses
		'M50 22L48 10' // tige
	],
	'la salada': [
		'M20 62C18 40 34 28 50 28C66 28 82 40 80 62C78 80 64 88 50 88C36 88 22 80 20 62Z',
		'M50 88C44 70 44 50 50 32M50 88C34 76 28 60 30 44M50 88C66 76 72 60 70 44'
	],
	'lo pan': ['M12 70C12 45 30 32 50 32C70 32 88 45 88 70Z', 'M32 52L40 43M47 48L55 39M62 52L70 43', 'M8 70L92 70'],
	'lo formatge': [
		'M15 55L80 35L85 45L85 72L15 72Z',
		'M15 55L85 45',
		'M36 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
		'M62 58a3 3 0 1 0 6 0a3 3 0 1 0-6 0'
	],
	'lo vin': ['M32 14L68 14C70 34 64 50 50 52C36 50 30 34 32 14Z', 'M50 52L50 82', 'M36 86C44 82 56 82 64 86', 'M33 28C44 31 56 25 67 28'],
	'lo lach': ['M42 10L58 10M44 10L44 24C34 30 32 38 32 46L32 88L68 88L68 46C68 38 66 30 56 24L56 10', 'M32 54C44 58 56 50 68 54'],
	'lo rasim': [
		'M50 34L52 22C58 18 66 20 70 26',
		'M32 40a6 6 0 1 0 12 0a6 6 0 1 0-12 0M44 40a6 6 0 1 0 12 0a6 6 0 1 0-12 0M56 40a6 6 0 1 0 12 0a6 6 0 1 0-12 0',
		'M38 51a6 6 0 1 0 12 0a6 6 0 1 0-12 0M50 51a6 6 0 1 0 12 0a6 6 0 1 0-12 0',
		'M44 62a6 6 0 1 0 12 0a6 6 0 1 0-12 0',
		'M44 73a6 6 0 1 0 12 0a6 6 0 1 0-12 0'
	],
	'las olivas': [
		'M14 30C40 34 66 44 88 66',
		'M40 34C46 24 58 22 64 24C58 32 48 36 40 34Z',
		'M30 50C30 42 44 42 44 52C44 62 30 62 30 50Z',
		'M58 60C58 52 72 52 72 62C72 72 58 72 58 60Z',
		'M37 43L34 33M65 53L62 44'
	],
	'la frucha': [
		'M14 60L86 60C84 78 70 88 50 88C30 88 16 78 14 60Z', // coupe
		'M30 60C28 44 42 40 48 50', // poire couchée
		'M48 60a10 10 0 1 1 20 0', // pomme
		'M62 46a5 5 0 1 0 10 0a5 5 0 1 0-10 0M70 54a5 5 0 1 0 10 0a5 5 0 1 0-10 0', // grains de raisin
		'M50 50L52 42' // queue
	],
	'los legums': [
		'M20 56L80 56L74 88L26 88Z', // cageot
		'M20 56L26 44L74 44L80 56',
		'M34 44C34 28 42 24 46 30', // carotte qui dépasse
		'M54 44C54 34 60 30 66 34', // fane
		'M30 70L70 70' // lame du cageot
	],
	'un quilò de…': [
		'M50 20L50 36', // fléau
		'M26 36L74 36',
		'M26 36L14 60L38 60Z', // plateau gauche
		'M74 36L62 60L86 60Z', // plateau droit
		'M40 88L60 88L56 70L44 70Z', // socle
		'M50 36L50 70'
	],

	// ── Unité 7 · L'ostal ────────────────────────────────────────────────
	'l’ostal': [
		'M14 52L50 20L86 52', // toit
		'M22 46L22 86L78 86L78 46', // murs
		'M42 86L42 62L58 62L58 86', // porte
		'M66 30L66 22L72 22L72 36' // cheminée
	],
	'la cosina': [
		'M26 50L74 50L70 82L30 82Z', // marmite
		'M20 50L80 50', // bord
		'M26 42C34 36 66 36 74 42', // couvercle
		'M50 42L50 36',
		'M40 30C40 24 44 24 44 18M56 30C56 24 60 24 60 18' // vapeur
	],
	'la cambra': [
		'M14 70L86 70L86 84M14 84L14 50', // lit et pieds
		'M14 58L86 58', // matelas
		'M22 50C22 44 40 44 40 50L40 58L22 58Z', // oreiller
		'M14 50L14 36' // tête de lit
	],
	'la sala de banh': [
		'M12 52L88 52C88 70 78 82 62 82L38 82C22 82 12 70 12 52Z', // baignoire
		'M24 82L24 90M76 82L76 90', // pieds
		'M70 52L70 30C70 24 78 24 78 30', // robinet
		'M74 36L76 44' // goutte
	],
	'lo jardin': [
		'M12 84L88 84', // sol
		'M50 84L50 54', // tronc
		'M50 54C32 56 28 36 42 32C44 20 62 20 64 32C78 36 72 56 50 54Z', // feuillage
		'M18 84L18 70M26 84L26 70M34 84L34 70', // barrière
		'M14 76L38 76'
	],
	'la taula': ['M12 42L88 42', 'M20 42L20 84M80 42L80 84', 'M20 58L80 58'],
	'la cadièra': ['M34 20L34 86', 'M34 56L66 56L66 86', 'M34 20L62 20', 'M34 36L62 36'],
	'lo canapè': [
		'M12 54L12 80L88 80L88 54', // assise et accoudoirs
		'M22 54L22 38L78 38L78 54', // dossier
		'M22 54L78 54',
		'M50 54L50 38', // deux coussins
		'M18 80L18 88M82 80L82 88' // pieds
	],
	'l’armari': ['M22 14L78 14L78 86L22 86Z', 'M50 14L50 86', 'M44 48L44 54M56 48L56 54', 'M26 86L26 92M74 86L74 92'],
	'la pòrta': ['M28 12L72 12L72 90L28 90Z', 'M36 20L64 20L64 82L36 82Z', 'M58 52a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
	'la fenèstra': ['M18 18L82 18L82 82L18 82Z', 'M50 18L50 82', 'M18 50L82 50'],
	// les positions : une balle sur ou sous une boîte (devant et derrière, trop ambigus au trait, retirés sur avis de Joan)
	sus: ['M30 56L70 56L70 84L30 84Z', 'M40 44a10 10 0 1 0 20 0a10 10 0 1 0-20 0'],
	jos: ['M30 16L70 16L70 44L30 44Z', 'M40 66a10 10 0 1 0 20 0a10 10 0 1 0-20 0'],
	'la color': [
		'M50 20C26 20 14 38 16 56C18 74 32 84 44 82C52 80 48 70 56 68C64 66 84 70 84 50C84 32 68 20 50 20Z', // palette
		'M30 48a4 4 0 1 0 8 0a4 4 0 1 0-8 0M40 34a4 4 0 1 0 8 0a4 4 0 1 0-8 0M56 32a4 4 0 1 0 8 0a4 4 0 1 0-8 0M68 44a4 4 0 1 0 8 0a4 4 0 1 0-8 0'
	],

	// ── Unité 1 · Adieu ! ────────────────────────────────────────────────
	'lo vilatge': [
		'M6 82L94 82',
		'M12 82L12 62L25 52L38 62L38 82', // maison
		'M44 82L44 42L56 42L56 82', // clocher
		'M44 42L50 26L56 42',
		'M48 56L48 50C48 46 52 46 52 50L52 56',
		'M62 82L62 64L75 54L88 64L88 82',
		'M70 82L70 72L78 72L78 82'
	],
	'la vila': [
		'M6 84L94 84',
		'M10 84L10 50L26 50L26 84',
		'M26 84L26 28L46 28L46 84',
		'M46 84L46 58L58 58L58 84',
		'M58 84L58 38L76 38L76 84',
		'M76 84L76 54L90 54L90 84',
		'M32 38L40 38M32 48L40 48M32 58L40 58M32 68L40 68', // fenêtres
		'M64 48L70 48M64 58L70 58M64 68L70 68'
	],

	// ── Unité 2 · Parlas occitan ? ───────────────────────────────────────
	'Parlas occitan ?': [
		'M12 16L56 16C59 16 60 17 60 20L60 44C60 47 59 48 56 48L28 48L20 58L21 48L12 48C9 48 8 47 8 44L8 20C8 17 9 16 12 16Z',
		'M28 28C28 23 40 23 40 29C40 33 34 33 34 38', // ?
		'M34 42L34 43',
		'M44 56L88 56C91 56 92 57 92 60L92 80C92 83 91 84 88 84L80 84L82 94L72 84L44 84C41 84 40 83 40 80L40 60C40 57 41 56 44 56Z',
		'M48 66L84 66M48 74L74 74'
	],

	// ── Unité 3 · La familha ─────────────────────────────────────────────
	'la familha': [
		cercle(26, 34, 8), // deux grands
		'M12 78L12 60C12 50 18 46 26 46C34 46 40 50 40 60L40 78',
		cercle(74, 34, 8),
		'M60 78L60 60C60 50 66 46 74 46C82 46 88 50 88 60L88 78',
		cercle(50, 53, 5.5), // un petit
		'M43 78L43 68C43 63 46 61 50 61C54 61 57 63 57 68L57 78',
		'M6 78L94 78'
	],
	'lo can': [
		'M54 32C54 22 60 16 68 18C72 19 74 22 76 25L86 28C90 29 90 35 86 36L74 38C70 40 66 44 64 50L64 84L70 84', // tête, museau, patte avant
		'M54 32C46 40 36 50 32 64C30 74 32 82 40 84L64 84', // dos
		'M38 66C46 60 56 64 56 76L56 84', // cuisse
		'M60 56L60 84',
		'M58 22C52 24 50 32 52 40C56 38 60 32 60 24', // oreille tombante
		'M34 78C24 80 16 74 14 66', // queue
		'M71 25L72 25'
	],
	'lo cat': [
		'M36 34C36 26 42 22 50 22C58 22 64 26 64 34C64 42 58 46 50 46C42 46 36 42 36 34Z', // tête
		'M38 28L36 14L46 22M54 22L64 14L62 28', // oreilles pointues
		'M42 45C34 54 30 66 32 78C33 84 40 86 50 86C60 86 67 84 68 78C70 66 66 54 58 45', // corps assis
		'M68 80C80 80 86 72 84 62', // queue
		'M46 86L46 74M54 86L54 74',
		'M28 36L40 37M28 42L40 40M72 36L60 37M72 42L60 40' // moustaches
	],
	'Quant as d’ans ?': [
		'M22 56L78 56L78 84L22 84Z', // gâteau
		'M22 64C28 70 34 70 40 64C46 70 54 70 60 64C66 70 72 70 78 64',
		'M14 84L86 84',
		'M36 56L36 44M50 56L50 44M64 56L64 44', // bougies
		'M36 38C33 34 36 30 36 28C38 32 39 35 36 38Z',
		'M50 38C47 34 50 30 50 28C52 32 53 35 50 38Z',
		'M64 38C61 34 64 30 64 28C66 32 67 35 64 38Z'
	],

	// ── Unité 4 · Qué fas ? ──────────────────────────────────────────────
	cantar: [
		'M26 74C26 68 40 66 40 72C40 78 26 80 26 74Z', // deux croches
		'M40 72L40 28',
		'M60 66C60 60 74 58 74 64C74 70 60 72 60 66Z',
		'M74 64L74 20',
		'M40 28L74 20M40 36L74 28'
	],
	caminar: [empreinte(40, 76, 0.8, true), empreinte(60, 58, 0.8), empreinte(40, 40, 0.8, true), empreinte(60, 22, 0.8)],
	escotar: [
		'M22 60C22 34 34 22 50 22C66 22 78 34 78 60', // casque
		'M18 56C14 56 12 60 12 64L12 76C12 80 14 84 18 84L28 84L28 56Z',
		'M82 56C86 56 88 60 88 64L88 76C88 80 86 84 82 84L72 84L72 56Z'
	],
	cosinar: [
		'M10 58C10 48 28 42 44 42C60 42 78 48 78 58C78 68 60 74 44 74C28 74 10 68 10 58Z', // poêle
		'M77 53L92 45C94 44 96 47 94 49L78 61',
		'M34 58C34 52 44 50 50 54C56 50 60 58 54 62C48 66 36 64 34 58Z', // un œuf
		cercle(46, 57, 4)
	],
	manjar: ['M34 16L34 32C34 38 46 38 46 32L46 16M40 16L40 86', 'M62 86L62 16C70 20 72 34 70 48L62 50'], // fourchette et couteau
	'la setmana': [
		'M14 22L86 22L86 84L14 84Z', // calendrier
		'M14 36L86 36',
		'M30 16L30 28M70 16L70 28',
		(() => {
			let d = '';
			for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) d += `M${20 + c * 10} ${46 + r * 10}L${22 + c * 10} ${46 + r * 10}`;
			return d;
		})(),
		cercle(51, 66, 5)
	],

	// ── Unité 6 · La jornada ─────────────────────────────────────────────
	// La course du soleil : le matin bas à gauche, midi en haut, l'après-midi
	// vers la droite, le soir sur l'horizon, minuit la lune.
	'lo matin': course(0.12),
	miègjorn: course(0.5),
	'lo tantòst': course(0.78),
	'lo ser': course(1, 'couchant'),
	mièjanuèch: course(0.5, 'lune'),
	'Quina ora es ?': [cercle(50, 50, 36), 'M50 50L50 26M50 50L66 58', 'M50 18L50 22M82 50L78 50M50 82L50 78M18 50L22 50'],
	'Me lèvi.': [
		cercle(50, 54, 26), // réveil
		'M22 34C18 26 26 16 36 22',
		'M78 34C82 26 74 16 64 22',
		'M32 76L26 86M68 76L74 86',
		'M50 54L50 38M50 54L60 60'
	],
	dejunar: [
		'M26 50L70 50L66 76C65 80 62 82 58 82L38 82C34 82 31 80 30 76Z', // tasse
		'M69 56C80 54 82 68 67 70',
		'M16 86C30 92 70 92 84 86',
		'M40 42C36 36 44 32 40 24M54 42C50 36 58 32 54 24' // vapeur
	],
	dinnar: [cercle(50, 52, 20), cercle(50, 52, 12), 'M16 26L16 40C16 44 22 44 22 40L22 26M19 26L19 80', 'M80 80L80 26C86 30 88 42 86 52L80 54'], // assiette et couverts
	sopar: [
		'M16 50L84 50C84 70 70 82 50 82C30 82 16 70 16 50Z', // bol de soupe
		'M16 50C16 44 84 44 84 50',
		'M62 48L80 20',
		'M78 22C76 14 86 10 88 18C89 24 82 26 78 22Z', // cuillère
		'M32 38C28 32 36 28 32 20M46 38C42 32 50 28 46 20' // vapeur : c'est de la soupe (Joan, 05-11)
	],
	'Vau al lièch.': ['M10 74L90 74M10 84L10 52M90 84L90 64M10 64L90 64', 'M16 64C16 58 30 58 30 64', lune(74, 26, 12)],
	'Fa solelh.': soleil(50, 50, 16),
	'Plòu.': [NUAGE, 'M30 66L26 76M44 66L40 76M58 66L54 76M72 66L68 76M37 80L33 90M51 80L47 90M65 80L61 90'],
	'la pluèja': [goutte(30, 50, 8), goutte(62, 36, 8), goutte(54, 76, 8)],
	'Fa vent.': ['M12 40L60 40C70 40 74 30 68 24C62 18 54 24 58 30', 'M12 56L76 56C86 56 92 66 86 74C80 80 70 74 74 66', 'M20 72L48 72'],
	'Fa freg.': [
		'M44 70L44 22C44 14 56 14 56 22L56 70A10 10 0 1 1 44 70', // thermomètre, presque vide
		'M50 78L50 60',
		'M62 30L66 30M62 40L66 40M62 50L66 50M62 60L66 60',
		flocon(22, 28, 14)
	],
	'Fa caud.': [
		'M44 70L44 22C44 14 56 14 56 22L56 70A10 10 0 1 1 44 70', // thermomètre, plein
		'M50 78L50 26',
		'M62 30L66 30M62 40L66 40M62 50L66 50M62 60L66 60',
		...soleil(22, 30, 5)
	],
	'Nèva.': [NUAGE, flocon(32, 72, 6), flocon(52, 82, 6), flocon(70, 70, 6)],
	'la nèu': [flocon(50, 50, 36)],

	// ── Unité 8 · En vila ────────────────────────────────────────────────
	'la gara': [
		'M6 68L6 40L66 40C80 40 92 54 94 68Z', // train à nez allongé
		'M14 48L56 48L56 56L14 56ZM28 48L28 56M42 48L42 56',
		cercle(18, 72, 3.5),
		cercle(30, 72, 3.5),
		cercle(66, 72, 3.5),
		cercle(78, 72, 3.5),
		'M2 78L98 78', // rail et traverses
		'M8 78L8 84M22 78L22 84M36 78L36 84M50 78L50 84M64 78L64 84M78 78L78 84M92 78L92 84'
	],
	'la carrièra': [
		'M28 34L72 34', // rue en perspective (horizon entre les façades)
		'M8 92L44 34M92 92L56 34',
		'M50 90L50 82M50 74L50 66M50 59L50 53M50 47L50 43',
		'M4 64L28 50L28 18L4 6', // façades
		'M96 64L72 50L72 18L96 6',
		// fenêtres en perspective sur les deux façades : une rue de ville, pas une route (Joan, 05-11)
		(() => {
			let d = '';
			const haut = (x) => 6 + (x - 4) * 0.5,
				bas = (x) => 64 - (x - 4) * 0.583,
				y = (x, f) => r1(haut(x) + (bas(x) - haut(x)) * f);
			for (const X of [(x) => x, (x) => 100 - x])
				for (const [x1, x2] of [
					[8, 13],
					[18, 23]
				])
					for (const [f1, f2] of [
						[0.18, 0.34],
						[0.52, 0.68]
					])
						d += `M${X(x1)} ${y(x1, f1)}L${X(x2)} ${y(x2, f1)}L${X(x2)} ${y(x2, f2)}L${X(x1)} ${y(x1, f2)}Z`;
			return d;
		})()
	],
	'la plaça': [
		'M10 66L90 66L84 84L16 84Z', // fontaine
		'M47 66L47 48M53 66L53 48',
		'M32 40L68 40C66 46 58 48 50 48C42 48 34 46 32 40Z',
		'M50 38L50 22',
		'M50 22C46 18 42 20 40 26M50 22C54 18 58 20 60 26',
		'M32 42C26 48 24 56 24 64M68 42C74 48 76 56 76 64'
	],
	'la glèisa': [
		'M8 84L92 84', // église
		'M40 84L40 36L60 36L60 84',
		'M40 36L50 16L60 36',
		'M50 16L50 8M46 11L54 11',
		'M40 50L14 60L14 84M60 50L86 60L86 84',
		'M46 52L46 46C46 42 54 42 54 46L54 52',
		'M45 84L45 74C45 68 55 68 55 74L55 84'
	],
	'tot drech': ['M50 88L50 16M34 32L50 16L66 32'],
	'a drecha': ['M12 50L84 50M68 34L84 50L68 66'],
	'a esquèrra': ['M88 50L16 50M32 34L16 50L32 66'],
	'Vira a drecha !': ['M36 88L36 46C36 38 42 34 50 34L80 34M66 20L80 34L66 48'],
	'a pè': [empreinte(38, 50, 1.2, true), empreinte(62, 44, 1.2)],
	'Cossí i vau ?': ['M50 92L50 14', 'M50 22L78 22L86 30L78 38L50 38', 'M50 46L22 46L14 54L22 62L50 62', 'M40 92L60 92'], // poteau indicateur
	'lo cafè': [
		'M30 52L62 52L60 72C59 76 56 78 52 78L40 78C36 78 33 76 32 72Z', // petite tasse
		'M61 56C70 55 70 67 60 68',
		'M20 82C32 87 60 87 72 82',
		'M46 44C42 38 50 34 46 28',
		'M78 40C72 36 70 48 76 52C82 56 86 44 78 40Z', // un grain de café
		'M77 41C79 45 75 48 77 51'
	],
	'un tè': [
		'M26 46C26 36 74 36 74 46L74 66C74 78 64 82 50 82C36 82 26 78 26 66Z', // théière
		'M38 38C38 30 62 30 62 38',
		'M48 30L48 26L52 26L52 30',
		'M26 54C18 52 14 44 10 40C14 46 16 58 26 64',
		'M74 48C88 48 88 70 74 70'
	],
	'l’aiga': ['M50 14C50 14 26 44 26 60C26 74 36 84 50 84C64 84 74 74 74 60C74 44 50 14 50 14Z', 'M38 62C38 70 42 74 48 76'],
	'un suc de frucha': [
		'M30 30L70 30L64 86L36 86Z', // verre
		'M32 46L68 46',
		'M54 70L62 14L70 14', // paille
		'M66 30A11 11 0 0 1 88 30', // rondelle d'orange
		'M77 30L77 20M77 30L70 23M77 30L84 23'
	],
	'un veire d’aiga': ['M28 20L72 20L66 86L34 86Z', 'M31 42C40 46 60 38 69 42'],
	'L’addicion, se vos plai.': [
		'M26 12L74 12L74 84L68 90L62 84L56 90L50 84L44 90L38 84L32 90L26 84Z', // ticket
		'M34 26L66 26M34 38L58 38M34 48L62 48M34 58L54 58',
		'M34 70L66 70'
	],

	// ── Garriga ──────────────────────────────────────────────────────────
	// (pluèja et plòu reprennent les dessins des unités, voir MEMES plus bas)
	plovina: [
		NUAGE, // la bruine : une poussière de gouttes très courtes
		'M24 66L23 69M36 64L35 67M48 66L47 69M60 64L59 67M72 66L71 69M30 76L29 79M42 74L41 77M54 76L53 79M66 74L65 77M36 86L35 89M48 84L47 87M60 86L59 89'
	],
	aigaci: [NUAGE, 'M24 64L14 92M36 64L26 92M48 64L38 92M60 64L50 92M72 64L62 92M84 62L76 84'], // l'averse : des traits longs et serrés
	auratge: [NUAGE, 'M52 60L40 78L50 78L42 94L62 72L52 72L58 60', 'M28 64L24 74M74 64L70 74'],
	liuç: ['M58 8L30 52L48 52L36 92L72 40L54 40L68 8Z'],
	nívol: [NUAGE_MIEG],
	gota: [goutte(50, 50, 15), 'M28 84C28 78 72 78 72 84C72 90 28 90 28 84Z'],
	sompet: [
		'M12 70C12 60 32 58 50 60C68 58 90 62 88 72C86 80 64 82 46 80C28 82 12 78 12 70Z', // la flaque
		'M38 70C38 66 62 66 62 70C62 74 38 74 38 70Z', // un rond dans l'eau
		goutte(50, 36, 6)
	],
	garric: [
		// le gland du chêne kermès, cupule hérissée
		'M38 50C38 72 44 84 50 86C56 84 62 72 62 50',
		'M34 50L36 43L40 47L43 40L47 46L50 39L53 46L57 40L60 47L64 43L66 50Z',
		'M50 39L53 28'
	],
	euse: [
		'M50 64C24 66 14 50 22 38C20 24 36 14 50 20C64 14 80 24 78 38C86 50 76 66 50 64Z', // feuillage dense et rond
		'M46 64L44 86M54 64L56 86',
		'M22 86L78 86'
	],
	romanin: [brin(44, 92, 58, 10, 9, 13)],
	espic: [epi(50, 92, 36, 22), epi(50, 92, 50, 14), epi(50, 92, 64, 24)],
	cigala: [
		'M40 20C44 16 56 16 60 20L60 28C56 30 44 30 40 28Z', // tête
		cercle(38, 24, 3.5),
		cercle(62, 24, 3.5),
		'M47 30C30 40 28 70 44 90C48 80 50 50 49 30Z', // ailes en toit
		'M53 30C70 40 72 70 56 90C52 80 50 50 51 30Z',
		'M43 40C38 56 38 70 43 84M57 40C62 56 62 70 57 84'
	],
	cagaraula: [
		spirale(56, 54, 24, 2.4, Math.PI / 2), // la coquille
		'M18 80L84 80C88 80 89 75 84 74', // le pied
		'M18 80C12 78 14 68 22 64C26 62 30 64 34 70', // la tête
		'M22 64L15 50M25 63L28 48',
		cercle(15, 48, 2),
		cercle(28, 46, 2)
	],
	fuèlha: [
		'M20 80C20 40 50 14 84 14C84 50 60 80 20 80Z',
		'M20 80L70 28', // nervure
		'M34 66L31 53M34 66L47 69M46 54L43 41M46 54L59 57M58 42L57 31M58 42L69 44',
		'M20 80L12 88'
	],
	font: [
		'M14 70C14 64 86 64 86 70C86 76 14 76 14 70Z', // le bord du bassin
		'M14 70C16 82 32 88 50 88C68 88 84 82 86 70',
		'M50 66L50 28', // le jet
		'M50 28C40 24 31 36 29 58M50 28C60 24 69 36 71 58', // qui retombe
		'M24 50L24 53M76 50L76 53M20 60L20 63M80 60L80 63' // quelques gouttes
	],
	arcolan: ['M12 78A38 38 0 0 1 88 78', 'M20 78A30 30 0 0 1 80 78', 'M28 78A22 22 0 0 1 72 78'],
	camin: [
		'M18 92C34 72 44 56 47 40', // le chemin qui file vers l'horizon
		'M82 92C66 72 56 56 53 40',
		'M8 40L44 40M56 40L92 40',
		'M50 66L50 72M50 80L50 88'
	],

	// ── Fenèstra ─────────────────────────────────────────────────────────
	fenèstra: [
		'M30 88L30 42A20 20 0 0 1 70 42L70 88', // fenêtre en plein cintre
		'M38 88L38 44A12 12 0 0 1 62 44L62 88', // l'ébrasement
		'M24 88L76 88',
		'M23 42A27 27 0 0 1 77 42', // l'arc de pierres
		rayons(50, 42, 20, 27, 8, Math.PI, (8 * Math.PI) / 7)
	],
	castèl: [
		'M8 88L92 88',
		'M14 88L14 28L19 28L19 33L24 33L24 28L29 28L29 33L34 33L34 28L34 88', // tour de gauche
		'M34 50L39 50L39 45L44 45L44 50L49 50L49 45L54 45L54 50L59 50L59 45L64 45L64 50L66 50', // courtine
		'M66 88L66 20L71 20L71 25L76 25L76 20L81 20L81 25L86 25L86 20L86 88', // donjon
		'M44 88L44 74A6 6 0 0 1 56 74L56 88', // porte
		'M24 46L24 54M76 36L76 44' // archères
	],
	muralha: [
		'M8 40L14 40L14 33L22 33L22 40L30 40L30 33L38 33L38 40L46 40L46 33L54 33L54 40L62 40L62 33L70 33L70 40L78 40L78 33L86 33L86 40L92 40',
		'M8 40L8 84M92 40L92 84M6 84L94 84',
		'M8 54L92 54M8 69L92 69', // assises de pierre
		'M26 40L26 54M50 40L50 54M74 40L74 54M38 54L38 69M62 54L62 69M86 54L86 69M18 69L18 84M48 69L48 84M76 69L76 84'
	],
	pena: [
		'M8 22L44 22C48 30 44 40 50 46C46 56 54 64 50 74C54 80 52 86 56 90', // la falaise et son à-pic
		'M56 90L92 90',
		'M8 40L42 40M8 58L46 58M8 76L48 76' // les strates
	],
	ròc: [
		'M6 84L94 84',
		'M14 84L22 52L38 34L60 30L76 44L86 84', // le rocher et ses faces
		'M38 34L44 56L22 52M44 56L60 30M44 56L52 84M60 30L64 58L76 44M64 58L70 84'
	],
	bòsc: [
		cercle(28, 48, 13), // trois arbres
		'M28 61L28 84',
		cercle(54, 38, 17),
		'M54 55L54 84',
		'M66 72L78 40L90 72Z',
		'M78 72L78 84',
		'M10 84L92 84'
	],
	orizont: [
		'M6 46L94 46', // la ligne d'horizon, au loin
		'M40 46A10 10 0 0 1 60 46', // le soleil posé dessus
		'M6 62C22 54 36 56 50 62C64 68 80 60 94 56', // des collines de plus en plus proches
		'M6 80C20 72 40 72 56 80C70 86 84 80 94 76'
	],
	aucèl: [
		'M18 52C26 40 34 40 41 52C48 40 56 40 64 52', // des oiseaux en vol
		'M60 28C64 23 68 23 71 28C74 23 78 23 82 28',
		'M28 76C31 72 34 72 36 76C38 72 41 72 44 76'
	],
	agla: [
		simetrica([
			[50, 27], [47, 29], [45, 34], [44, 39], [32, 38], [18, 35], [8, 37], [5, 41], [11, 42],
			[6, 45], [12, 46], [8, 49], [14, 50], [11, 53], [18, 53], [30, 53], [42, 52], [44, 58],
			[38, 70], [44, 73], [50, 71]
		]) // l'aigle qui plane, vu d'en bas
	],
	temps: [
		'M28 14L72 14M28 86L72 86', // le sablier
		'M33 14C33 36 47 44 47 50C47 56 33 64 33 86',
		'M67 14C67 36 53 44 53 50C53 56 67 64 67 86',
		'M40 30L60 30', // le sable du haut
		'M50 52L50 74',
		'M38 84C42 74 58 74 62 84' // et celui du bas
	],

	// ── Nuèch ────────────────────────────────────────────────────────────
	nuèch: [lune(42, 50, 22), etoile(74, 26, 5), etoile(80, 60, 4), etoile(62, 80, 3)],
	luna: [cercle(50, 50, 32), cercle(40, 40, 6), cercle(62, 58, 8), cercle(44, 66, 3.5)], // la pleine lune et ses mers
	estèla: [estela(50, 52, 36, 15)],
	lampa: [
		'M34 88L66 88L60 80L40 80Z', // le pied de la lampe
		'M42 80C30 68 34 48 44 42L44 32L56 32L56 42C66 48 70 68 58 80', // le verre
		goutte(50, 62, 5), // la flamme
		'M50 32L50 24'
	],
	chòt: [
		'M30 42C30 24 70 24 70 42L70 66C70 82 30 82 30 66Z', // le corps
		'M33 32L28 16L43 27M67 32L72 16L57 27', // les aigrettes
		cercle(41, 42, 8),
		cercle(59, 42, 8),
		cercle(41, 42, 2.5),
		cercle(59, 42, 2.5),
		'M47 52L50 58L53 52',
		'M35 56C37 66 40 72 44 77M65 56C63 66 60 72 56 77',
		'M12 84L88 84M42 80L42 84M58 80L58 84' // la branche
	]
};

// Les ambiances poétiques reprennent quelques dessins des unités.
const MEMES = { pluèja: 'la pluèja', plòu: 'Plòu.', vent: 'Fa vent.', cat: 'lo cat' };
for (const [mot, model] of Object.entries(MEMES)) DESSENHS[mot] = DESSENHS[model];

// Un même mot dans deux unités avec deux sens : on ne dessine que le sens
// prévu (la cosina : la cuisine en unité 7, la cousine en unité 3).
const SENS = { 'la cosina': 'cuisine' };

/** Les chemins SVG d'un mot (texte), ou null. */
export function cheminsDe(oc, def = '') {
	if (!DESSENHS[oc] || (SENS[oc] && !def.includes(SENS[oc]))) return null;
	return DESSENHS[oc];
}

/** Les chemins d'un mot, prêts pour le canevas (Path2D), ou null. */
const cache = new Map();
export function dessenhDe(oc, def = '') {
	if (!cheminsDe(oc, def)) return null;
	if (!cache.has(oc)) cache.set(oc, DESSENHS[oc].map((d) => new Path2D(d)));
	return cache.get(oc);
}

// ── L'explication de première visite (Remira, Romain, 05-11 : « pour une
// première fois, il faudrait qu'on explique un peu le principe ») ─────────
// Trois étapes qui se forment en poussière comme les mots : ce que c'est,
// le geste, les ambiances. Même style : un seul trait, carré de 100 × 100.
const GUIDA = {
	// la poussière qui se pose en mot (comme le pictogramme de la case)
	remira: [
		cercle(24, 22, 0.5) + cercle(40, 14, 0.5) + cercle(55, 20, 0.5) + cercle(68, 11, 0.5) + cercle(80, 19, 0.5),
		cercle(31, 34, 0.5) + cercle(46, 30, 0.5) + cercle(61, 35, 0.5) + cercle(74, 30, 0.5),
		cercle(38, 45, 0.5) + cercle(52, 42, 0.5) + cercle(66, 46, 0.5),
		'M22 62H78',
		'M33 75H67'
	],
	// la souris et sa molette qu'on fait tourner
	rodeta: [
		'M44 20C33 20 28 28 28 40V62C28 75 35 82 44 82C53 82 60 75 60 62V40C60 28 55 20 44 20Z',
		'M28 45H60M44 20V45',
		'M44 28V36',
		'M71 30C78 38 78 50 71 58',
		'M66 54L71 58L76 54'
	],
	// le doigt qui glisse vers le haut sur le téléphone
	det: [
		'M36 12H64C67 12 70 15 70 18V82C70 85 67 88 64 88H36C33 88 30 85 30 82V18C30 15 33 12 36 12Z',
		'M50 64V30',
		'M43 37L50 30L57 37',
		cercle(50, 70, 4)
	],
	// la liste des ambiances, en bas de l'écran
	ambient: [
		'M30 22H70M30 34H70M30 46H60',
		cercle(23, 34, 0.6),
		'M50 56V78',
		'M43 71L50 78L57 71',
		'M24 88H76'
	]
};

/** Les dessins de l'explication, prêts pour le canevas (Path2D), ou null. */
export function dessenhGuida(clau) {
	if (!GUIDA[clau]) return null;
	const k = `guida:${clau}`;
	if (!cache.has(k)) cache.set(k, GUIDA[clau].map((d) => new Path2D(d)));
	return cache.get(k);
}
