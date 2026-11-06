// Dessins au trait pour la poussière d'or (Romain, 05-11 : « que la poussière
// dessine de manière très minimaliste, avec des traits, l'élément »).
//
// Chaque dessin est une liste de chemins SVG dans un carré de 100 × 100 ;
// la clé est le mot occitan tel qu'il est écrit dans scenas.js. Un mot sans
// dessin se forme quand même : les grains du dessin rejoignent alors le mot.
// Un seul poids de trait, pas de remplissage : c'est la poussière qui dessine.
//
// Toutes les unités ont des dessins depuis le 05-11 (Romain : « Oui, dessine »),
// d'abord pour les objets concrets seulement ; Garriga, Fenèstra et Nuèch aussi
// (consolidation). Depuis le lot 2 (Romain, 05-11 : « des icônes pour tous les
// mots »), chaque mot a le sien, salutations, jours, couleurs et petits mots
// compris, avec des conventions communes (voir « Lot 2 » plus bas).
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
		'M24 84C12 78 8 64 14 56C10 46 18 38 26 42C26 32 36 26 44 32C48 24 58 24 60 32C68 26 78 32 76 42C84 40 92 48 86 58C92 66 88 78 76 84Z', // la laitue, ses feuilles frisées
		'M50 84C38 70 38 50 50 38C62 50 62 70 50 84Z', // la feuille du cœur et sa nervure
		'M50 84L50 44M50 70L44 62M50 70L56 62M50 58L45 52M50 58L55 52',
		'M8 84L92 84'
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
	'Quina ora es ?': [cercle(42, 54, 30), 'M42 54L42 34M42 54L56 61', 'M42 26L42 30M70 54L66 54M42 82L42 78M14 54L18 54'],
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

// ── Lot 2 : un dessin pour chaque mot (Romain, 05-11 : « des icônes pour
// tous les mots ») ────────────────────────────────────────────────────────
// Des conventions, pour que ces dessins se lisent comme une seule famille :
//  · la personne dont parle le mot est en trait plein, les autres en pointillé
//    (lo paire : l'adulte plein et l'enfant en pointillé ; lo filh : l'inverse) ;
//  · cheveux longs pour un mot au féminin, chignon pour la grand-mère, canne
//    pour les aînés ; « tu » = une personne, « vous » = trois ;
//  · une question = l'objet et un point d'interrogation ;
//  · les salutations = une main qui salue et un signe (soleil, lune, horloge…) ;
//  · les jours = le calendrier de la semaine, la colonne du jour entourée ;
//  · les couleurs = une chose de cette couleur (cerises, vagues, herbe…).

/** Déplace et agrandit un chemin écrit en coordonnées absolues (M, L, C, Q, Z) : x devient x × s + dx. */
function tr(d, dx, dy, s = 1) {
	let i = 0;
	return d.replace(/-?\d*\.?\d+/g, (n) => String(r1(+n * s + (i++ % 2 ? dy : dx))));
}
/** Points d'une courbe de Bézier cubique. */
function bezierPts(a, b, c, e, n = 8) {
	const pts = [];
	for (let i = 0; i <= n; i++) {
		const t = i / n,
			u = 1 - t;
		pts.push([0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * e[k]));
	}
	return pts;
}
const cerclePts = (x, y, r, n = 28) =>
	Array.from({ length: n + 1 }, (_, i) => {
		const a = (i / n) * 2 * Math.PI - Math.PI / 2;
		return [x + r * Math.cos(a), y + r * Math.sin(a)];
	});
const linha = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join('');
/** Pointillé le long d'une ligne brisée [[x, y], …]. */
function pointilla(pts, tiret = 2.4, vuet = 2.2) {
	let d = '',
		on = true,
		reste = tiret,
		[px, py] = pts[0];
	for (let i = 1; i < pts.length; i++) {
		const [qx, qy] = pts[i];
		let L = Math.hypot(qx - px, qy - py);
		while (L > 1e-6) {
			const l = Math.min(reste, L),
				f = l / L,
				nx = px + (qx - px) * f,
				ny = py + (qy - py) * f;
			if (on) d += `M${r1(px)} ${r1(py)}L${r1(nx)} ${r1(ny)}`;
			px = nx;
			py = ny;
			L -= l;
			reste -= l;
			if (reste < 1e-6) {
				on = !on;
				reste = on ? tiret : vuet;
			}
		}
	}
	return d;
}
/** Le contour d'un buste : épaules arrondies (comme la familha), tête de rayon r en (x, y). */
function bustPts(x, y, r, base) {
	const a = 1.75 * r,
		e = y + 3.25 * r;
	return [
		[x - a, base],
		...bezierPts([x - a, e], [x - a, y + 2 * r], [x - r, y + 1.5 * r], [x, y + 1.5 * r]),
		...bezierPts([x, y + 1.5 * r], [x + r, y + 1.5 * r], [x + a, y + 2 * r], [x + a, e]).slice(1),
		[x + a, base]
	];
}
const bust = (x, y, r, base) => {
	const a = 1.75 * r,
		e = r1(y + 3.25 * r),
		s = r1(y + 1.5 * r);
	return `M${r1(x - a)} ${base}L${r1(x - a)} ${e}C${r1(x - a)} ${r1(y + 2 * r)} ${r1(x - r)} ${s} ${r1(x)} ${s}C${r1(x + r)} ${s} ${r1(x + a)} ${r1(y + 2 * r)} ${r1(x + a)} ${e}L${r1(x + a)} ${base}`;
};
const CABELS = [
	[-1.3, 1.75],
	[-1.7, 0.4],
	[-1.25, -1.1],
	[0, -1.08],
	[1.25, -1.1],
	[1.7, 0.4],
	[1.3, 1.75]
];
/** Une personne en buste : tête de rayon r centrée en (x, y), épaules jusqu'à base.
 *  o.punts : en pointillé ; o.cabels : cheveux longs ; o.monet : chignon ;
 *  o.baston : une canne, à droite (1) ou à gauche (-1). */
function persona(x, y, r, base, o = {}) {
	const c = CABELS.map(([u, v]) => [x + u * r, y + v * r]);
	const franja = [
		[x - 0.97 * r, y - 0.2 * r],
		[x - 0.4 * r, y - 0.25 * r],
		[x + 0.25 * r, y - 0.55 * r],
		[x + 0.55 * r, y - 0.85 * r]
	];
	if (o.punts) {
		const out = [pointilla(cerclePts(x, y, r)), pointilla(bustPts(x, y, r, base))];
		if (o.cabels) out.push(pointilla([...bezierPts(c[0], c[1], c[2], c[3]), ...bezierPts(c[3], c[4], c[5], c[6]).slice(1)]), pointilla(bezierPts(...franja)));
		return out;
	}
	const out = [cercle(x, y, r), bust(x, y, r, base)];
	const pt = (p) => p.map(r1).join(' ');
	if (o.cabels)
		out.push(
			`M${pt(c[0])}C${[c[1], c[2], c[3]].map(pt).join(' ')}C${[c[4], c[5], c[6]].map(pt).join(' ')}`,
			`M${pt(franja[0])}C${franja.slice(1).map(pt).join(' ')}`
		);
	if (o.monet) out.push(cercle(x, y - 1.4 * r, r1(0.45 * r)));
	if (o.baston) {
		const s = o.baston,
			X = r1(x + s * 2.3 * r),
			X2 = r1(x + s * 3.3 * r);
		out.push(`M${X} ${base}L${X} ${r1(y + 2.2 * r)}C${X} ${r1(y + 1.3 * r)} ${X2} ${r1(y + 1.3 * r)} ${X2} ${r1(y + 2 * r)}`);
	}
	return out;
}
/** Point d'interrogation centré en (x, y), haut de 20 × s. */
const interrogant = (x, y, s = 1) => tr('M-6 -5C-6 -10 6 -10 6 -4C6 0 0 0 0 5M0 9L0 10', x, y, s);
/** Bulle de parole, la pointe en bas, au quart de la largeur (coa). */
function bulla(x0, y0, x1, y1, coa = 0.25) {
	const xc = r1(x0 + (x1 - x0) * coa);
	return `M${x0 + 4} ${y0}L${x1 - 4} ${y0}Q${x1} ${y0} ${x1} ${y0 + 4}L${x1} ${y1 - 4}Q${x1} ${y1} ${x1 - 4} ${y1}L${r1(xc + 6)} ${y1}L${r1(xc - 4)} ${y1 + 9}L${r1(xc - 1)} ${y1}L${x0 + 4} ${y1}Q${x0} ${y1} ${x0} ${y1 - 4}L${x0} ${y0 + 4}Q${x0} ${y0} ${x0 + 4} ${y0}Z`;
}
/** Pointe de flèche en (x, y), dans la direction a (radians). */
const fleca = (x, y, a, l = 7) =>
	`M${r1(x - l * Math.cos(a - 0.5))} ${r1(y - l * Math.sin(a - 0.5))}L${r1(x)} ${r1(y)}L${r1(x - l * Math.cos(a + 0.5))} ${r1(y - l * Math.sin(a + 0.5))}`;
/** Cœur centré en (x, y) ; s = 1 : large de 32, haut de 28. */
const cor = (x, y, s = 1) => tr('M0 -6C0 -12 -8 -15 -12 -11C-17 -6 -14 1 -10 5L0 14L10 5C14 1 17 -6 12 -11C8 -15 0 -12 0 -6Z', x, y, s);
/** Roue dentée. */
function engrenatge(x, y, r, n = 8, dent = 5) {
	const pts = [];
	for (let k = 0; k < n; k++) {
		const a = (k / n) * 2 * Math.PI,
			da = Math.PI / n;
		for (const [aa, rr] of [
			[a - da * 0.55, r],
			[a - da * 0.35, r + dent],
			[a + da * 0.35, r + dent],
			[a + da * 0.55, r]
		])
			pts.push([x + rr * Math.cos(aa), y + rr * Math.sin(aa)]);
	}
	return [linha([...pts, pts[0]]), cercle(x, y, r1(r * 0.38))];
}
// La main qui salue (paume ouverte, doigts en haut), dans le carré entier,
// et les deux petits traits du mouvement.
const MAN = 'M38 90L38 60L32 48C30 44 34 40 38 44L42 52L42 26C42 22 48 22 48 26L48 48L48 20C48 16 54 16 54 20L54 48L54 24C54 20 60 20 60 24L60 50L60 32C60 28 66 28 66 32L66 62C66 74 62 82 60 90';
const BOLEGA = 'M24 30C20 34 20 40 22 44M72 24C77 28 78 34 76 40';
/** La main qui salue, coin haut gauche de la paume en (x0, y0), à l'échelle s. */
const salut = (x0, y0, s) => [tr(MAN, x0 - 30 * s, y0 - 16 * s, s), tr(BOLEGA, x0 - 30 * s, y0 - 16 * s, s)];
// La main ouverte, paume vers le ciel, qui tend ou qui demande.
const PALMA = 'M6 70L40 70C44 62 52 60 56 64L52 70L84 66C90 66 90 74 84 75L52 82C40 86 24 86 6 84';
/** Le calendrier de la semaine (comme la setmana), la colonne du jour c (0 = lundi) entourée. */
function jornDeLaSetmana(c) {
	const x = 21 + c * 10;
	return [...DESSENHS['la setmana'].slice(0, 4), `M${x - 4.5} 46L${x - 4.5} 76A4.5 4.5 0 0 0 ${x + 4.5} 76L${x + 4.5} 46A4.5 4.5 0 0 0 ${x - 4.5} 46Z`];
}
/** Le buste d'un arbre de famille : deux adultes, frère et sœur, et leurs enfants. */
function arbre({ oncle = null, cosin = null }) {
	// oncle : { cabels } pour l'adulte de droite en plein ; cosin : { cabels } pour l'enfant de droite en plein
	const out = ['M30 13L30 6L70 6L70 13', ...persona(30, 20, 5.5, 46, { punts: true }), 'M30 48L30 56', ...persona(30, 64, 5, 90, { punts: true })];
	out.push(...persona(70, 20, 5.5, 46, oncle ? { cabels: oncle.cabels } : { punts: true }));
	if (cosin) out.push('M70 48L70 56', ...persona(70, 64, 5, 90, { cabels: cosin.cabels }));
	return out;
}

Object.assign(DESSENHS, {
	// ── Garriga ─────────────────────────────────────────────────────────
	tron: [
		NUAGE, // le nuage d'où part le grondement, en ondes qui s'élargissent
		'M62 62.4A12 12 0 0 1 38 62.4',
		'M69 67.2A20 20 0 0 1 31 67.2',
		'M76 72A28 28 0 0 1 24 72'
	],
	gotejar: [
		'M10 24L10 44', // le robinet, contre le mur
		'M10 30L58 30C66 30 72 36 72 44L72 50',
		'M10 38L56 38C60 38 64 42 64 46L64 50',
		'M62 50L74 50',
		'M38 30L38 22M30 22L46 22', // la poignée
		goutte(68, 72, 3.5),
		'M48 90C48 86 92 86 92 90C92 94 48 94 48 90Z' // la petite flaque
	],
	garriga: [
		// refaite le 06-11 (Romain : « l'icône garrigue va pas ») : le pin parasol au-dessus
		// d'un rocher de calcaire, d'un buisson de chêne kermès et d'une touffe de thym
		'M4 86C24 84 44 85 62 84C76 83 86 84 96 85',
		'M68 85C68 72 66 62 62 52', // le tronc qui penche, puis les branches en éventail
		'M62 52C58 46 52 42 44 40M62 52C66 46 72 42 80 40M62 52L63 40',
		'M36 40C34 32 42 28 50 29C54 22 66 21 72 26C80 24 90 28 90 35C92 37 91 40 88 40', // le parasol, ouvert dessous
		'M6 86L10 75L19 69L30 71L36 79L38 86', // le rocher et sa facette
		'M19 69L22 77',
		'M40 86C38 81 41 77 46 78C47 73 54 73 56 77C59 76 62 80 60 86', // le chêne kermès
		'M84 86L84 78M80 86L78 80M88 86L90 80', // le thym en fleur
		cercle(84, 76.6, 1.4) + cercle(77.6, 78.6, 1.4) + cercle(90.4, 78.6, 1.4)
	],
	ferigola: [
		// le thym : des tiges fines, de toutes petites feuilles, des fleurs en boule
		'M50 92C48 74 40 58 32 42',
		'M50 92L52 32',
		'M50 92C54 74 62 60 70 46',
		cercle(38, 66, 1.4) + cercle(45, 76, 1.4) + cercle(34, 54, 1.4) + cercle(42, 60, 1.4),
		cercle(48, 70, 1.4) + cercle(55, 62, 1.4) + cercle(48, 52, 1.4) + cercle(55, 44, 1.4),
		cercle(57, 76, 1.4) + cercle(64, 68, 1.4) + cercle(60, 58, 1.4) + cercle(70, 58, 1.4),
		cercle(30, 36, 3) + cercle(35, 33, 3) + cercle(31, 30, 3), // les fleurs
		cercle(52, 26, 3) + cercle(56, 23, 3) + cercle(51, 20, 3),
		cercle(70, 40, 3) + cercle(75, 42, 3) + cercle(73, 36, 3)
	],
	granhòta: [
		'M24 70C20 52 34 42 50 42C66 42 80 52 76 70C72 82 28 82 24 70Z', // la grenouille, de face
		cercle(38, 38, 7),
		cercle(62, 38, 7),
		cercle(38, 38, 2),
		cercle(62, 38, 2),
		'M36 58C44 64 56 64 64 58',
		'M24 70C14 72 12 84 20 88L30 88', // les pattes
		'M76 70C86 72 88 84 80 88L70 88',
		'M38 78L34 88M62 78L66 88'
	],
	sentor: [
		'M8 84L92 84', // la terre mouillée, et l'odeur qui monte
		'M20 84C30 76 70 76 80 84',
		'M36 72C30 62 42 56 36 46C30 36 40 30 36 22',
		'M50 70C44 60 56 54 50 44C44 34 54 28 50 20',
		'M64 72C58 62 70 56 64 46C58 36 68 30 64 22',
		goutte(20, 46, 3.5),
		goutte(82, 38, 3.5)
	],
	tèrra: [
		'M6 44C24 38 40 48 58 42C72 38 84 44 94 42', // la surface, une pousse
		'M6 64C30 60 60 68 94 62', // les couches de la terre
		'M6 86L94 86',
		'M50 44L50 30',
		'M50 36C44 28 38 30 38 32C42 36 46 36 50 36',
		'M50 33C56 25 62 27 62 29C58 33 54 33 50 33',
		cercle(24, 54, 2.5) + cercle(70, 52, 3) + cercle(40, 74, 3.5) + cercle(78, 76, 2.5) + cercle(58, 78, 2)
	],
	rosal: [
		// la rosée : des gouttes au bout des brins d'herbe
		'M30 92C30 70 26 50 16 32',
		'M46 92C46 66 50 44 62 24',
		'M62 92C64 74 72 62 86 54',
		'M38 92C38 80 36 72 30 64',
		cercle(17, 38, 3),
		cercle(59, 30, 3.5),
		cercle(80, 57, 3),
		cercle(49, 56, 2.5),
		cercle(31, 70, 2)
	],
	marin: [
		'M14 32L56 32C66 32 70 22 64 16C58 10 50 16 54 22', // le vent qui vient de la mer
		'M22 48L78 48C88 48 92 58 86 64C80 70 72 64 76 58',
		'M6 76C14 70 22 70 30 76C38 82 46 82 54 76C62 70 70 70 78 76C86 82 90 80 94 76', // les vagues
		'M6 88C14 82 22 82 30 88C38 94 46 94 54 88C62 82 70 82 78 88C86 94 90 92 94 88'
	],

	// ── Fenèstra ────────────────────────────────────────────────────────
	pèira: [
		// un tas de pierres posées l'une sur l'autre : la pierre se lit mieux à plusieurs
		'M8 86L92 86',
		'M18 86C14 74 28 66 50 66C72 66 88 74 82 86',
		'M30 66C28 56 38 50 50 50C62 50 72 56 70 66',
		'M40 50C40 42 46 36 52 36C58 36 62 42 60 50',
		'M30 76L36 78M62 74L68 72M46 58L52 60'
	],
	cèl: [
		...soleil(26, 30, 7),
		'M54 64C48 64 46 59 48 56C49 53 52 52 54 53C55 47 62 44 67 48C70 43 78 44 80 50C86 50 88 58 84 62C83 63 81 64 78 64Z', // un nuage
		'M58 28C61 24 64 24 66 28C68 24 71 24 74 28', // un oiseau
		'M8 84L92 84'
	],
	lum: [
		'M38 62C30 56 28 46 30 40C34 26 66 26 70 40C72 46 70 56 62 62L62 70L38 70Z', // une ampoule allumée
		'M40 76L60 76M42 82L58 82',
		'M44 62L46 50L50 56L54 50L56 62',
		rayons(50, 42, 30, 38, 5, (9 * Math.PI) / 8, (15 * Math.PI) / 16)
	],
	ombra: [
		...soleil(18, 20, 6),
		'M44 74L44 56', // l'arbre et son ombre couchée sur le sol
		'M44 56C28 58 24 38 38 34C40 22 58 22 60 34C72 38 68 58 44 56Z',
		'M6 74L94 74',
		'M44 76C52 74 84 74 90 79C84 84 52 84 44 76Z',
		'M58 77L55 82M66 76L63 82M74 77L71 82M82 78L80 81'
	],
	comba: [
		'M4 30C18 32 32 52 42 76C45 82 55 82 58 76C68 52 82 32 96 30', // le vallon encaissé, en coupe
		'M44 79C47 77 53 77 56 79', // le ruisseau au fond
		'M16 33L16 26M12 26L16 16L20 26Z', // des arbres droits sur les pentes
		'M27 42L27 35M23 35L27 25L31 35Z',
		'M73 42L73 35M69 35L73 25L77 35Z',
		'M85 33L85 26M81 26L85 16L89 26Z',
		'M36 56L36 50M33 50L36 42L39 50Z'
	],
	luènh: [
		'M6 44L94 44', // l'horizon, et tout au bout du chemin une maison minuscule
		'M38 94L60 44M86 94L64 44',
		pointilla([
			[62, 94],
			[62, 48]
		]),
		'M58 44L58 39L62 35.5L66 39L66 44',
		...persona(17, 66, 6, 94)
	],
	silenci: [
		cercle(50, 46, 30), // « chut » : le doigt sur la bouche
		'M36 38C38 41 42 41 44 38M56 38C58 41 62 41 64 38',
		'M40 60L46 60M54 60L60 60',
		'M47 78L47 52C47 48 53 48 53 52L53 78',
		'M42 78L58 78C61 78 62 80 62 83L62 92L38 92L38 83C38 80 39 78 42 78Z'
	],
	trevar: [
		// trevar, c'est aussi hanter : un petit fantôme qui revient toujours au même endroit
		'M30 82L30 42C30 22 70 22 70 42L70 82L63 76L57 82L50 76L43 82L37 76Z',
		cercle(42, 44, 3),
		cercle(58, 44, 3),
		cercle(50, 56, 3),
		'M30 54C24 52 20 46 20 40M70 54C76 52 80 46 80 40'
	],

	// ── Nuèch ───────────────────────────────────────────────────────────
	vesprada: [
		'M8 86L92 86', // la maison, la fenêtre allumée, la lune qui se lève
		'M24 86L24 58L48 40L72 58L72 86',
		'M40 62L56 62L56 76L40 76Z',
		'M48 62L48 76M40 69L56 69',
		'M36 60L32 56M60 60L64 56M48 58L48 54',
		lune(80, 26, 9),
		etoile(60, 18, 3)
	],
	escur: [
		pointilla([
			// l'ampoule de « lum », éteinte : en pointillé, et la lune à côté
			...bezierPts([38, 62], [30, 56], [28, 46], [30, 40]),
			...bezierPts([30, 40], [34, 26], [66, 26], [70, 40]).slice(1),
			...bezierPts([70, 40], [72, 46], [70, 56], [62, 62]).slice(1),
			[62, 70],
			[38, 70],
			[38, 62]
		]),
		'M40 76L60 76M42 82L58 82',
		lune(82, 22, 8)
	],
	velhar: [
		'M14 60C30 40 70 40 86 60C70 80 30 80 14 60Z', // l'œil grand ouvert dans la nuit
		cercle(50, 60, 11),
		cercle(50, 60, 4),
		lune(78, 22, 9),
		etoile(56, 18, 3),
		etoile(26, 26, 2.5)
	],
	sòm: [
		cercle(32, 62, 22), // le visage endormi, les Z qui montent
		'M20 60C23 64 27 64 30 60M36 60C39 64 43 64 46 60',
		'M28 74C30 76 34 76 36 74',
		'M56 44L70 44L56 58L70 58',
		'M72 26L82 26L72 36L82 36',
		'M84 12L90 12L84 18L90 18'
	],
	pantais: [
		tr(NUAGE, 12, -8, 0.95), // la bulle du rêve, une étoile dedans
		estela(57, 30, 9, 4),
		cercle(30, 62, 3),
		cercle(24, 70, 2),
		cercle(20, 84, 9),
		'M15 84C17 86 19 86 21 84'
	],
	repaus: [
		'M14 32L14 86M86 32L86 86', // le hamac tendu entre deux arbres
		cercle(14, 22, 10),
		cercle(86, 22, 10),
		'M14 44L24 54M86 44L76 54',
		'M24 54C38 66 62 66 76 54',
		'M24 54C38 74 62 74 76 54',
		'M6 86L94 86'
	],
	grilh: [
		'M28 62C28 54 42 50 58 52C70 54 80 58 80 64C80 68 72 70 58 70C42 70 28 68 28 62Z', // le grillon, ses longues antennes
		cercle(23, 60, 6),
		'M20 55C28 32 58 22 88 26',
		'M22 54C34 36 60 32 86 36',
		'M58 66C62 56 70 50 76 52L84 78',
		'M36 68L32 80M46 70L46 82',
		'M38 56C52 58 64 60 76 62'
	]
});

Object.assign(DESSENHS, {
	// ── Unité 1 · Adieu ! ───────────────────────────────────────────────
	'Adieu !': [...salut(10, 22, 0.72), ...persona(72, 44, 7, 82)],
	'Adieu-siatz !': [...salut(8, 22, 0.66), ...persona(54, 46, 4.4, 76), ...persona(70, 46, 4.4, 76), ...persona(86, 46, 4.4, 76)],
	'Bonjorn !': [...salut(8, 26, 0.66), ...soleil(70, 48, 9)],
	'Bon ser !': [...salut(8, 26, 0.66), lune(68, 50, 15), etoile(88, 26, 4), etoile(56, 22, 3)],
	'Cossí vas ?': [...persona(40, 36, 10, 90), interrogant(78, 32, 1.4)],
	'Cossí anatz ?': [...persona(20, 48, 6, 88), ...persona(42, 48, 6, 88), ...persona(64, 48, 6, 88), interrogant(86, 42, 1.1)],
	'Vau plan, mercés !': [
		// le pouce levé
		'M28 88L28 52L40 52L50 32C52 24 62 24 62 32L58 48L76 48C82 48 84 56 78 58C84 60 84 68 78 69C82 71 82 78 76 79C78 82 76 88 70 88Z',
		'M40 52L40 88',
		'M60 58L76 58M60 69L76 69M60 79L74 79'
	],
	'Plan mercés !': [
		// les deux mains jointes
		'M50 18C46 18 44 22 44 28L42 58C40 66 34 72 28 76L34 88C42 82 48 76 50 68C52 76 58 82 66 88L72 76C66 72 60 66 58 58L56 28C56 22 54 18 50 18Z',
		'M50 22L50 66',
		rayons(50, 22, 12, 17, 3, (5 * Math.PI) / 4, (3 * Math.PI) / 4)
	],
	'A lèu !': [...salut(8, 26, 0.66), cercle(70, 48, 17), 'M70 48L70 37M70 48L79 53', 'M70 33L70 35M85 48L83 48M70 63L70 61M55 48L57 48'],
	'A deman !': [...salut(8, 26, 0.66), 'M52 30L90 30L90 74L52 74Z', 'M52 42L90 42', 'M60 25L60 35M82 25L82 35', 'M60 58L82 58', fleca(83, 58, 0, 6)],
	'Al còp que ven !': [...salut(8, 26, 0.66), 'M84.1 55.1A15 15 0 1 1 81.5 40.4', fleca(81.5, 40.4, 0.873, 6)],
	'Cossí te dison ?': [
		'M20 36L80 36Q84 36 84 40L84 82Q84 86 80 86L20 86Q16 86 16 82L16 40Q16 36 20 36Z', // l'étiquette du prénom, à son cordon
		'M44 43L56 43',
		'M44 36C38 22 40 10 50 8C60 10 62 22 56 36',
		'M16 52L84 52',
		interrogant(50, 65, 0.9)
	],
	'M’apèli…': [
		'M20 36L80 36Q84 36 84 40L84 82Q84 86 80 86L20 86Q16 86 16 82L16 40Q16 36 20 36Z', // l'étiquette du prénom, à son cordon
		'M44 43L56 43',
		'M44 36C38 22 40 10 50 8C60 10 62 22 56 36',
		'M16 52L84 52',
		'M26 66C30 56 34 72 38 62C42 52 46 70 50 62C54 56 58 68 62 62C64 59 68 59 72 64'
	],
	'Encantat !': [...persona(30, 38, 9, 90), ...persona(70, 38, 9, 90, { punts: true }), etoile(50, 22, 5), etoile(60, 12, 2.5)],
	'Encantada !': [...persona(30, 38, 9, 90, { cabels: true }), ...persona(70, 38, 9, 90, { punts: true }), etoile(50, 22, 5), etoile(60, 12, 2.5)],
	'D’ont siás ?': ['M50 92C40 76 24 60 24 40C24 24 36 14 50 14C64 14 76 24 76 40C76 60 60 76 50 92Z', interrogant(50, 40, 1.1)],
	'Soi d’aquí.': ['M50 84C40 70 26 56 26 38C26 24 36 14 50 14C64 14 74 24 74 38C74 56 60 70 50 84Z', cercle(50, 38, 9), 'M24 86C24 80 76 80 76 86C76 92 24 92 24 86Z'],
	'Ont demòras ?': ['M10 52L38 28L66 52', 'M16 47L16 86L60 86L60 47', 'M32 86L32 68L44 68L44 86', 'M8 86L68 86', interrogant(83, 44, 1.4)],
	'lo país': [
		'M14 26L38 18L62 26L86 18L86 76L62 84L38 76L14 84Z', // la carte dépliée
		'M38 18L38 76M62 26L62 84',
		pointilla([
			[22, 70],
			[30, 58],
			[44, 54],
			[54, 40],
			[70, 38],
			[76, 30]
		]),
		'M72 54L80 62M80 54L72 62'
	],
	Tolosa: (() => {
		// Saint-Sernin : le clocher en étages qui se resserrent, les baies en mitre
		const etatges = [
			[86, 71, 22, 3],
			[71, 60, 18, 3],
			[60, 50, 14.5, 3],
			[50, 41, 11.5, 2],
			[41, 33, 8.5, 2]
		];
		let d = 'M8 86L92 86M8 78L28 72M92 78L72 72';
		for (const [b, h, w, n] of etatges) {
			d += `M${50 - w} ${b}L${50 - w} ${h}L${50 + w} ${h}L${50 + w} ${b}`;
			const larg = (2 * w) / n,
				ow = larg * 0.42,
				H = b - h;
			for (let k = 0; k < n; k++) {
				const x = 50 - w + larg * (k + 0.5);
				d += `M${r1(x - ow / 2)} ${r1(b - 1.5)}L${r1(x - ow / 2)} ${r1(h + H * 0.5)}L${r1(x)} ${r1(h + H * 0.22)}L${r1(x + ow / 2)} ${r1(h + H * 0.5)}L${r1(x + ow / 2)} ${r1(b - 1.5)}`;
			}
		}
		return [d, 'M41.5 33L50 8L58.5 33', 'M50 8L50 3'];
	})(),
	Montpelhièr: [
		// l'arc de triomphe du Peyrou
		'M8 86L92 86',
		'M18 86L18 34L82 34L82 86',
		'M12 34L88 34L88 27L12 27Z',
		'M24 27L24 16L76 16L76 27',
		'M30 22L70 22',
		'M38 86L38 58A12 12 0 0 1 62 58L62 86',
		'M26 40L26 86M74 40L74 86'
	],
	Besièrs: [
		// la cathédrale sur sa colline, le pont Vieux sur l'Orb
		'M4 94C20 91 34 96 50 93C66 90 80 95 96 92',
		'M4 76L96 76',
		'M6 88C6 79 28 79 28 88M28 88C28 79 50 79 50 88M50 88C50 79 72 79 72 88M72 88C72 79 94 79 94 88',
		'M4 76C14 70 22 62 32 58L76 58C84 62 90 70 96 74',
		'M36 58L36 26L36 22L40 22L40 26L43 26L43 22L46 22L46 26L50 26L50 22L50 58',
		'M50 58L50 38L50 35L54 35L54 38L58 38L58 35L62 35L62 38L66 38L66 35L70 35L70 38L72 38L72 58',
		cercle(61, 48, 5),
		'M41 48L41 38C41 35 45 35 45 38L45 48'
	],
	Carcassona: [
		// les tours rondes coiffées de cônes, les remparts crénelés
		'M6 86L94 86',
		'M12 86L12 48L26 48L26 86',
		'M10 48L19 26L28 48Z',
		'M42 86L42 40L58 40L58 86',
		'M40 40L50 12L60 40Z',
		'M74 86L74 48L88 48L88 86',
		'M72 48L81 26L90 48Z',
		'M26 60L28 60L28 56L31 56L31 60L34 60L34 56L37 56L37 60L40 60L40 56L42 56',
		'M58 56L60 56L60 60L63 60L63 56L66 56L66 60L69 60L69 56L72 56L72 60L74 60',
		'M46 86L46 76A4 4 0 0 1 54 76L54 86',
		'M19 58L19 64M50 50L50 56M81 58L81 64'
	],

	// ── Unité 2 · Parlas occitan ? ──────────────────────────────────────
	'Òc !': [bulla(14, 16, 86, 68), 'M32 42L44 54L68 30'],
	'Non !': [bulla(14, 16, 86, 68), 'M36 28L64 56M64 28L36 56'],
	'la lenga': [bulla(14, 16, 86, 68), cercle(40, 46, 8), 'M35 29L41 34', 'M66.4 39.6A9 9 0 1 0 66.4 52.4'], // « òc » dans la bulle
	occitan: (() => {
		// la croix occitane, vidée et pommetée : quatre bras qui s'évasent, douze pommes
		const bras = [
			[-5, -5],
			[-21, -33],
			[-10, -29],
			[0, -41],
			[10, -29],
			[21, -33]
		];
		const rot = ([x, y], k) => {
			let p = [x, y];
			for (let i = 0; i < k; i++) p = [-p[1], p[0]];
			return p;
		};
		const P = ([x, y]) => [50 + x * 0.9, 50 + y * 0.9];
		const q = (a, c, b, n = 6) =>
			Array.from({ length: n }, (_, i) => {
				const s = (i + 1) / n,
					u = 1 - s;
				return [u * u * a[0] + 2 * u * s * c[0] + s * s * b[0], u * u * a[1] + 2 * u * s * c[1] + s * s * b[1]];
			});
		// un bras : du centre, un côté creusé jusqu'au coin, la pointe, l'autre côté creusé
		const unBras = [bras[0], ...q(bras[0], [-6, -25], bras[1]), bras[2], bras[3], bras[4], bras[5], ...q(bras[5], [6, -25], [5, -5]).slice(0, -1)];
		const contorn = [];
		for (let k = 0; k < 4; k++) for (const p of unBras) contorn.push(P(rot(p, k)));
		let pom = '';
		for (let k = 0; k < 4; k++)
			for (const p of [
				[-23.5, -35],
				[0, -45],
				[23.5, -35]
			]) {
				const [x, y] = P(rot(p, k));
				pom += cercle(x, y, 2.5);
			}
		return [linha(contorn) + 'Z', pom];
	})(),
	francesa: [
		// la tour Eiffel
		'M26 90C36 68 43 44 47 12',
		'M74 90C64 68 57 44 53 12',
		'M36 90C40 78 60 78 64 90',
		'M33 68L67 68',
		'M41 44L59 44',
		'M36 68L50 56L64 68M42 44L50 32L58 44',
		'M46 12L54 12L52 6L48 6Z',
		'M50 6L50 2',
		'M14 90L86 90'
	],
	catalan: (() => {
		// un castell, la tour humaine : trois, puis deux, puis un, et l'enfant qui lève la main
		const fig = (x, yb, r) => [
			cercle(x, r1(yb - 4.4 * r), r),
			`M${r1(x - 1.6 * r)} ${yb}L${r1(x - 1.3 * r)} ${r1(yb - 2.8 * r)}C${r1(x - 1.2 * r)} ${r1(yb - 3.3 * r)} ${r1(x + 1.2 * r)} ${r1(yb - 3.3 * r)} ${r1(x + 1.3 * r)} ${r1(yb - 2.8 * r)}L${r1(x + 1.6 * r)} ${yb}`
		];
		return [...fig(26, 92, 5), ...fig(50, 92, 5), ...fig(74, 92, 5), ...fig(38, 78, 5), ...fig(62, 78, 5), ...fig(50, 64, 5), ...fig(50, 50, 4), 'M54 42L60 26'];
	})(),
	espanhòla: [
		// la guitare
		'M50 50C40 50 36 56 38 62C30 64 26 72 28 80C30 92 70 92 72 80C74 72 70 64 62 62C64 56 60 50 50 50Z',
		cercle(50, 70, 5),
		'M44 84L56 84',
		'M47 50L47 20M53 50L53 20',
		'M45 20L45 8L55 8L55 20Z',
		'M43 11L45 11M43 16L45 16M55 11L57 11M55 16L57 16',
		'M50 20L50 84'
	],
	italian: (() => {
		// la tour penchée de Pise
		const t = (8 * Math.PI) / 180,
			P = (u, v) => [44 + u * Math.cos(t) + v * Math.sin(t), 88 + u * Math.sin(t) - v * Math.cos(t)];
		const L = (...pts) => linha(pts.map(([u, v]) => P(u, v)));
		let etatges = '';
		for (const v of [11, 22, 33, 44, 55]) etatges += L([-13, v], [13, v]);
		let colonas = '';
		for (const v of [0, 11, 22, 33, 44, 55]) for (const u of [-6.5, 0, 6.5]) colonas += L([u, v + 2.5], [u, v + 8.5]);
		return ['M8 88L92 88', L([-13, 0], [-13, 66], [13, 66], [13, 0]), etatges, colonas, L([-9, 66], [-9, 76], [9, 76], [9, 66]), L([-3, 69], [-3, 74]) + L([3, 69], [3, 74])];
	})(),
	anglesa: [
		// Big Ben
		'M40 92L40 44L60 44L60 92',
		'M37 44L37 22L63 22L63 44Z',
		cercle(50, 33, 8),
		'M50 33L50 27M50 33L54 35',
		'M39 22L39 16L61 16L61 22',
		'M41 16L50 4L59 16',
		'M46 52L46 60M54 52L54 60M46 68L46 76M54 68L54 76',
		'M24 92L76 92'
	],
	portugués: [
		// le tramway de Lisbonne
		'M12 72L12 42C12 36 16 34 22 34L78 34C84 34 88 36 88 42L88 72Z',
		'M18 34L18 28L82 28L82 34',
		'M18 42L30 42L30 54L18 54ZM36 42L48 42L48 54L36 54ZM54 42L66 42L66 54L54 54ZM72 42L82 42L82 54L72 54Z',
		'M12 62L88 62',
		'M50 28L40 14L56 8',
		'M4 8L96 8',
		cercle(28, 76, 5),
		cercle(72, 76, 5),
		'M4 82L96 82'
	],
	marroquina: [
		// l'arc en fer à cheval et l'étoile à huit branches
		'M18 92L18 14L82 14L82 92',
		'M34 92L34 62A22.6 22.6 0 1 1 66 62L66 92',
		estela(50, 46, 9, 6.3, 8),
		'M10 92L90 92'
	],
	argerian: [
		// la casbah blanche au-dessus de la mer, le minaret
		'M10 80L10 66L26 66L26 58L42 58L42 50L58 50L58 62L74 62L74 80',
		'M74 80L74 30L84 30L84 80',
		'M72 30L86 30M76 30L76 22L82 22L82 30M79 22L79 16',
		'M10 80L92 80',
		'M16 72L16 76M32 64L32 70M48 56L48 62M64 68L64 74',
		'M6 88C14 84 22 84 30 88C38 92 46 92 54 88C62 84 70 84 78 88C84 91 90 91 94 88'
	],
	'Parli un pauc.': [
		bulla(14, 12, 86, 56, 0.25), // la bulle à moitié remplie : un peu, et le reste en pointillé
		'M26 28L46 28',
		pointilla([
			[52, 28],
			[74, 28]
		]),
		pointilla([
			[26, 42],
			[62, 42]
		]),
		...persona(26, 78, 6, 96)
	],
	'Compreni plan.': [
		...persona(38, 48, 10, 94),
		'M68 34C64 31 63 27 64 23C66 15 82 15 84 23C85 27 84 31 80 34L80 38L68 38Z', // l'idée qui s'allume
		'M69 41L79 41',
		rayons(74, 23, 13, 17, 5, (9 * Math.PI) / 8, (15 * Math.PI) / 16)
	],
	tanben: [cercle(30, 50, 14), pointilla(cerclePts(70, 50, 14)), 'M64 50L76 50M70 44L70 56'], // une chose, et une autre en plus
	mas: [
		'M6 84L94 84', // le mur de briques sur le chemin : on saute par-dessus, mais on passe
		'M34 84L34 60L66 60L66 84M34 72L66 72M50 60L50 72M42 72L42 84M58 72L58 84',
		pointilla(bezierPts([12, 82], [20, 26], [80, 26], [86, 72], 16), 3, 2.6),
		fleca(86.4, 76, 1.42, 7)
	],
	'Qué es aquò ?': ['M50 40L76 52L76 80L50 92L24 80L24 52Z', 'M24 52L50 64L76 52', 'M50 64L50 92', interrogant(50, 20, 1)],
	'Qui es ?': [...persona(50, 34, 16, 96), interrogant(50, 34, 0.9)],
	'Qué vòl dire… ?': [
		'M50 34C40 28 24 28 12 32L12 80C24 76 40 76 50 82C60 76 76 76 88 80L88 32C76 28 60 28 50 34Z', // le livre ouvert
		'M50 34L50 82',
		'M20 44L42 42M20 52L42 50M20 60L42 58M20 68L42 66',
		interrogant(69, 54, 1.2)
	],
	'Cossí se ditz… ?': ['M8 34L38 34L38 62L8 62Z', 'M14 48L32 48', 'M42 48L54 48', fleca(56, 48, 0, 6), bulla(60, 26, 94, 62, 0.3), interrogant(77, 44, 0.8)],
	'Pòdes repetir, se te plai ?': [bulla(12, 12, 88, 66), 'M62.2 44.4A13 13 0 1 1 60 31.6', fleca(60, 31.6, 0.873, 6)],
	'Non sabi pas.': [
		...persona(50, 40, 9, 92), // les épaules haussées, les mains ouvertes
		'M34 64L20 72L14 58',
		'M66 64L80 72L86 58',
		'M10 56L18 56M82 56L90 56',
		interrogant(78, 22, 1)
	],

	// ── Unité 3 · La familha ────────────────────────────────────────────
	'lo paire': [...persona(38, 34, 9, 88), ...persona(70, 58, 6, 88, { punts: true }), 'M6 88L94 88'],
	'la maire': [...persona(38, 34, 9, 88, { cabels: true }), ...persona(70, 58, 6, 88, { punts: true }), 'M6 88L94 88'],
	'lo fraire': [...persona(32, 48, 7, 88), ...persona(68, 48, 7, 88, { punts: true }), 'M6 88L94 88'],
	'la sòrre': [...persona(32, 48, 7, 88, { cabels: true }), ...persona(68, 48, 7, 88, { punts: true }), 'M6 88L94 88'],
	'lo filh': [...persona(34, 34, 9, 88, { punts: true }), ...persona(70, 58, 6, 88), 'M6 88L94 88'],
	'la filha': [...persona(34, 34, 9, 88, { punts: true }), ...persona(70, 58, 6, 88, { cabels: true }), 'M6 88L94 88'],
	'lo papeta': [...persona(42, 34, 9, 88, { baston: -1 }), ...persona(76, 58, 6, 88, { punts: true }), 'M6 88L94 88'],
	'la mameta': [...persona(42, 34, 9, 88, { baston: -1, monet: true }), ...persona(76, 58, 6, 88, { punts: true }), 'M6 88L94 88'],
	'l’oncle': arbre({ oncle: { cabels: false } }),
	'la tanta': arbre({ oncle: { cabels: true } }),
	'lo cosin': arbre({ cosin: { cabels: false } }),
	'los dròlles': [...persona(24, 54, 6, 88), ...persona(50, 54, 6, 88, { cabels: true }), ...persona(76, 54, 6, 88), 'M6 88L94 88'],
	'la companha': [...persona(34, 40, 9, 90, { cabels: true }), ...persona(66, 40, 9, 90, { punts: true }), cor(50, 16, 0.4), 'M6 90L94 90'],

	// ── Unité 4 · Qué fas ? ─────────────────────────────────────────────
	'Qué fas ?': ['M30 88L46 52M36 90L52 54M30 88L36 90', 'M34 44L58 56L62 48L38 36Z', interrogant(76, 32, 1.4)],
	'Qué fas dins la vida ?': [
		tr('M14 40L86 40L86 84L14 84ZM38 40L38 30C38 26 62 26 62 30L62 40M14 58L86 58M46 54L54 54L54 62L46 62Z', 2, 14, 0.66),
		interrogant(80, 40, 1.4)
	],
	trabalhar: ['M14 40L86 40L86 84L14 84Z', 'M38 40L38 30C38 26 62 26 62 30L62 40', 'M14 58L86 58', 'M46 54L54 54L54 62L46 62Z'], // la mallette
	dançar: [
		...persona(50, 38, 8, 92), // la danseuse, les bras en arc au-dessus de la tête
		'M38 54C30 46 26 32 28 16', // un bras levé, l'autre ouvert : on danse
		'M62 54C72 52 80 44 86 34',
		'M74 18C74 14 80 14 80 17C80 20 74 21 74 18ZM80 17L80 4L86 6',
		'M8 62C8 58 14 58 14 61C14 64 8 65 8 62ZM14 61L14 48L20 50'
	],
	jogar: [
		cercle(30, 66, 13), // les boules de pétanque et le cochonnet
		'M18 60C26 66 36 66 42 60M24 54C28 60 36 62 40 56',
		cercle(62, 64, 13),
		'M50 58C56 64 68 64 74 58M54 52C58 58 66 60 72 54',
		cercle(86, 76, 3.5),
		'M6 80L94 80'
	],
	regent: [
		'M12 18L88 18L88 66L12 66Z', // le tableau noir
		'M24 52L30 32L36 52M27 44L33 44',
		'M44 32L44 52M44 42C48 36 56 38 56 44C56 50 48 52 44 47',
		'M64 42L74 42M69 37L69 47',
		'M10 66L90 66',
		'M24 66L18 90M76 66L82 90'
	],
	infirmièra: [
		'M18 44L82 44L82 86L18 86Z', // la trousse et sa croix
		'M38 44L38 34L62 34L62 44',
		'M46 54L54 54L54 60L60 60L60 68L54 68L54 74L46 74L46 68L40 68L40 60L46 60Z'
	],
	mètge: [
		// le stéthoscope
		'M34 14L34 22C34 40 40 48 50 50C60 48 66 40 66 22L66 14',
		cercle(34, 11, 2.5),
		cercle(66, 11, 2.5),
		'M50 50L50 62C50 76 58 84 68 84C76 84 80 78 80 70L80 64',
		cercle(80, 56, 7),
		cercle(80, 56, 3)
	],
	paisan: [
		// le tracteur
		cercle(30, 66, 18),
		cercle(30, 66, 6),
		cercle(78, 74, 10),
		cercle(78, 74, 3),
		'M16 46L20 20L48 20L48 46',
		'M48 34L84 38L88 60L70 62',
		'M50 54L62 54',
		'M70 36L70 22M68 22L72 22',
		'M6 84L94 84'
	],
	fornièra: [
		// le four à pain
		'M10 82C10 50 28 34 50 34C72 34 90 50 90 82',
		'M6 82L94 82',
		'M36 82L36 68A14 14 0 0 1 64 68L64 82',
		'M70 38L70 22L78 22L78 46',
		'M74 18C70 14 78 10 74 6',
		...DESSENHS['lo pan'].slice(0, 2).map((d) => tr(d, 36, 62.4, 0.28)) // le pain qui cuit
	],
	vinhairon: [
		'M50 92C46 82 54 74 50 64C48 58 42 54 34 54', // le cep, une feuille, une grappe
		'M50 64C54 58 60 54 68 54',
		'M34 54C24 50 18 40 24 34C28 26 38 28 40 36C44 34 48 40 44 46C42 50 38 54 34 54Z',
		'M34 54L30 40',
		'M68 54L71 60',
		cercle(64, 64, 3.5) + cercle(71, 64, 3.5) + cercle(78, 64, 3.5),
		cercle(67.5, 70.5, 3.5) + cercle(74.5, 70.5, 3.5),
		cercle(71, 77, 3.5),
		'M6 92L94 92'
	],
	'Soi a la retirada.': [
		// le fauteuil à bascule
		'M28 18L34 62',
		'M34 62L66 62',
		'M36 62L30 80M64 62L68 80',
		'M20 78C36 86 64 86 80 76',
		'M31 42L62 42L64 62',
		'M28 18L36 16'
	],
	diluns: jornDeLaSetmana(0),
	dimars: jornDeLaSetmana(1),
	dimècres: jornDeLaSetmana(2),
	dijòus: jornDeLaSetmana(3),
	divendres: jornDeLaSetmana(4),
	dissabte: jornDeLaSetmana(5),
	dimenge: jornDeLaSetmana(6),
	amb: [cercle(38, 50, 22), cercle(62, 50, 22)], // deux cercles qui se rejoignent
	'l’amiga': [...persona(32, 40, 9, 90, { cabels: true }), ...persona(68, 40, 9, 90, { punts: true }), 'M6 90L94 90'],
	'los amics': [...persona(22, 40, 7.5, 90), ...persona(50, 40, 7.5, 90), ...persona(78, 40, 7.5, 90), 'M6 90L94 90'],
	'engenhaire · engenhaira': [
		...engrenatge(34, 42, 15), // la roue dentée et le compas
		'M70 20L58 86M70 20L84 86',
		cercle(70, 16, 4),
		'M62 60L80 60'
	],
	'estudiant · estudianta': [
		'M50 22L90 36L50 50L10 36Z', // le mortier des diplômés
		'M28 42L28 58C28 66 72 66 72 58L72 42',
		'M50 36L82 40L82 60',
		'M79 60L85 60L84 68L80 68Z'
	],
	'cosinièr · cosinièra': [
		// la toque
		'M30 66L30 50C18 48 16 30 30 28C32 16 48 14 52 22C58 12 76 16 74 30C86 32 84 50 70 50L70 66Z',
		'M30 66L70 66L70 78L30 78Z',
		'M40 52L40 66M50 50L50 66M60 52L60 66'
	],
	'vendeire · vendeira': [
		'M84 26L84 74L40 74L18 50L40 26Z', // l'étiquette du prix
		cercle(32, 50, 4),
		'M28 50C20 40 18 30 24 20',
		'M69.8 42.2A11 11 0 1 0 69.8 57.8',
		'M50 46L64 46M50 54L64 54'
	],
	'obrièr · obrièra': [
		// le casque de chantier
		'M20 66C20 38 80 38 80 66',
		'M12 66L88 66L88 72L12 72Z',
		'M44 41L44 66M56 41L56 66',
		'M44 41C46 38 54 38 56 41'
	]
});

Object.assign(DESSENHS, {
	// ── Unité 5 · Al mercat ─────────────────────────────────────────────
	'Quant còsta ?': ['M84 26L84 74L40 74L18 50L40 26Z', cercle(32, 50, 4), 'M28 50C20 40 18 30 24 20', interrogant(62, 50, 1.3)],
	'Vaquí !': [PALMA, ...DESSENHS['la poma'].map((d) => tr(d, 43, 34.7, 0.34)), 'M70 28L86 28', fleca(88, 28, 0, 6)], // la main qui tend une pomme
	'Volriái…': [
		tr(NUAGE, 26, -8, 0.75), // la bulle de l'envie, une pomme dedans
		...DESSENHS['la poma'].map((d) => tr(d, 54, 12, 0.2)),
		cercle(36, 46, 2.5),
		cercle(30, 53, 1.8),
		...persona(22, 66, 8, 96)
	],
	'Se vos plai.': [PALMA, cor(60, 44, 0.6)], // la main ouverte qui demande, avec le cœur
	'M’agrada…': [cor(50, 52, 2.5)],
	'Quicòm mai ?': [cercle(40, 52, 22), 'M28 52L52 52M40 40L40 64', interrogant(80, 40, 1.4)],
	'Es tot.': ['M14 46L86 46L78 84L22 84Z', 'M30 46C30 20 70 20 70 46', 'M36 64L46 74L66 54'], // le panier, c'est complet
	'De res.': [cercle(50, 50, 32), cercle(39, 42, 2.5), cercle(61, 42, 2.5), 'M36 58C42 68 58 68 64 58'],

	// ── Unité 6 · La jornada ────────────────────────────────────────────
	'la jornada': (() => {
		// la course entière du soleil, du lever au coucher
		const arc = (a, b) =>
			pointilla(
				Array.from({ length: 13 }, (_, i) => bez(a + ((b - a) * i) / 12)),
				2,
				3
			);
		const out = ['M6 78L94 78', arc(0.17, 0.43), arc(0.57, 0.83)];
		for (const t of [0.08, 0.5, 0.92]) {
			const [x, y] = bez(t);
			out.push(...soleil(x, y, 3.5));
		}
		return out;
	})(),
	ara: ['M8 62L92 62', 'M20 58L20 66M35 58L35 66M65 58L65 66M80 58L80 66', cercle(50, 62, 4), cercle(50, 62, 1.2), 'M43 38L57 38L50 50Z'], // le point « ici » sur la ligne du temps
	uèi: ['M24 20L76 20L76 86L24 86Z', 'M24 34L76 34', 'M36 14L36 26M64 14L64 26', ...soleil(50, 60, 7)], // la feuille du jour
	puèi: [cercle(16, 50, 7), 'M26 50L40 50', fleca(42, 50, 0, 6), cercle(52, 50, 7), 'M62 50L76 50', fleca(78, 50, 0, 6), cercle(88, 50, 7)],
	totjorn: ['M50 50C40 36 18 36 18 50C18 64 40 64 50 50C60 36 82 36 82 50C82 64 60 64 50 50Z'], // l'infini
	'Quin temps fa ?': [
		tr(NUAGE_MIEG, 8, 19, 0.85), // le soleil à moitié caché
		'M26.6 43.4A10 10 0 0 1 45.4 36.6',
		rayons(36, 40, 14, 19, 5, (9 * Math.PI) / 8, (15 * Math.PI) / 16),
		interrogant(84, 26, 1.2)
	],
	'Fa bèl.': [...soleil(30, 32, 8), 'M6 76C24 62 40 62 56 72C68 64 82 62 94 70', 'M62 30C65 26 68 26 70 30C72 26 75 26 78 30', 'M6 86L94 86'],

	// ── Unité 7 · L'ostal ───────────────────────────────────────────────
	'la sala': [
		'M20 66L20 20L80 20L80 66', // la pièce en perspective, le canapé contre le mur
		'M20 66L33 66M67 66L80 66',
		'M20 66L6 92M80 66L94 92',
		'M20 20L6 6M80 20L94 6',
		'M58 28L74 28L74 46L58 46ZM66 28L66 46',
		'M28 30L44 30L44 42L28 42Z',
		...DESSENHS['lo canapè'].map((d) => tr(d, 29, 41, 0.42))
	],
	davant: ['M51.9 66L78 66L78 22L34 22L34 48.1', cercle(36, 64, 16)], // la balle devant la boîte
	darrièr: ['M22 40L66 40L66 84L22 84Z', 'M48 40A16 16 0 1 1 66 55.9'], // la balle cachée derrière
	roge: [cercle(36, 68, 12), cercle(64, 72, 12), 'M36 56C38 40 46 26 56 18M64 60C62 44 58 30 56 18', 'M56 18C64 10 76 12 80 18C72 24 62 24 56 18Z'], // les cerises
	blava: [
		// les vagues de la mer
		'M8 40C16 32 24 32 32 40C40 48 48 48 56 40C64 32 72 32 80 40C86 46 90 46 94 42',
		'M8 58C16 50 24 50 32 58C40 66 48 66 56 58C64 50 72 50 80 58C86 64 90 64 94 60',
		'M8 76C16 68 24 68 32 76C40 84 48 84 56 76C64 68 72 68 80 76C86 82 90 82 94 78'
	],
	verd: ['M50 88C50 66 46 46 36 26', 'M50 88C52 64 58 46 70 30', 'M50 88C46 72 36 60 22 54', 'M50 88C56 74 66 66 80 62', 'M50 88C50 70 50 54 52 40', 'M30 88L70 88'], // l'herbe
	jaune: ['M10 54C18 36 34 30 50 30C66 30 82 36 90 54C82 72 66 78 50 78C34 78 18 72 10 54Z', 'M50 30C54 20 64 16 72 18C66 26 58 30 50 30Z'], // le citron
	negra: [
		// le corbeau
		'M12 44L24 40C26 34 34 32 40 36C52 38 66 46 76 54L94 60L78 62C70 70 54 72 42 66C32 62 26 54 24 48Z',
		cercle(30, 40, 1.5),
		'M48 68L46 82M56 68L58 82',
		'M40 46C52 50 62 56 72 60'
	],
	blanc: [
		// le mouton
		'M30 64C22 66 18 56 24 52C22 42 32 38 38 42C42 34 54 34 58 40C64 34 76 38 76 46C84 48 84 60 76 62C74 70 36 72 30 64Z',
		'M24 50C16 46 8 52 10 58C12 64 20 64 24 60',
		'M18 50L14 44',
		'M36 68L36 84M46 70L46 84M60 70L60 84M70 66L70 84'
	],
	gris: [
		// la souris grise
		'M14 72C14 56 30 48 46 48C62 48 76 58 86 70L90 72Z',
		cercle(62, 46, 7),
		cercle(76, 62, 1.5),
		'M14 72C6 72 4 62 10 56C16 50 12 40 6 38',
		'M86 66L96 62M86 68L96 70',
		'M8 72L92 72'
	],
	pichona: [...persona(36, 30, 11, 90, { punts: true }), ...persona(70, 60, 6, 90, { cabels: true }), 'M6 90L94 90'],
	grand: [...persona(36, 30, 11, 90), ...persona(70, 60, 6, 90, { punts: true }), 'M6 90L94 90'],
	vièlh: [...persona(44, 34, 10, 90, { baston: 1 }), 'M40 30L44 31M50 31L54 30', 'M6 90L94 90'],
	nòu: [
		'M24 46L76 46L76 86L24 86Z', // le paquet tout neuf, qui brille
		'M20 36L80 36L80 46L20 46Z',
		'M50 36L50 86',
		'M50 36C42 24 30 28 36 36M50 36C58 24 70 28 64 36',
		etoile(14, 20, 5),
		etoile(86, 22, 4)
	],

	// ── Unité 8 · En vila ───────────────────────────────────────────────
	'Perdon…': [
		'M44 92L44 58L40 52C38 48 42 44 46 48L48 52L48 22C48 18 56 18 56 22L56 52', // l'index levé
		'M56 52C56 48 64 48 64 52L64 56C64 52 72 52 72 56L72 72C72 82 66 88 64 92',
		bulla(70, 10, 94, 30, 0.3),
		cercle(77, 20, 0.6) + cercle(82, 20, 0.6) + cercle(87, 20, 0.6)
	],
	'Es luènh ?': [...DESSENHS.luènh, interrogant(20, 22, 1.2)],
	'Es prèp.': [...persona(26, 44, 8, 88), 'M44 52L68 32L92 52', 'M48 49L48 88L88 88L88 49', 'M62 88L62 70L74 70L74 88', 'M6 88L94 88'],
	'Pren la carrièra…': ['M38 6L38 94', 'M62 6L62 38L94 38', 'M62 94L62 62L94 62', 'M50 90L50 56C50 52 52 50 56 50L84 50', fleca(86, 50, 0, 7)],
	'Ai set.': ['M30 34L70 34L64 88L36 88Z', goutte(50, 18, 5)], // le verre vide, la goutte qu'on attend
	'Per ieu…': [...persona(40, 40, 10, 92), 'M88 16C88 40 76 56 62 62', fleca(62, 62, 2.74, 7)]
});

// lo cosin et la cosina : le même arbre, l'enfant de droite est un garçon ou une fille
const COSINA = arbre({ cosin: { cabels: true } });

// Les questions dessinées avant le lot 2 reçoivent leur « ? », comme les autres (Joan, 06-11).
DESSENHS['Quant as d’ans ?'].push(interrogant(84, 28, 1.1));
DESSENHS['Quina ora es ?'].push(interrogant(84, 22, 1.2));
DESSENHS['Cossí i vau ?'].push(interrogant(28, 26, 1.2));

// Les ambiances poétiques reprennent quelques dessins des unités.
const MEMES = { pluèja: 'la pluèja', plòu: 'Plòu.', vent: 'Fa vent.', cat: 'lo cat' };
for (const [mot, model] of Object.entries(MEMES)) DESSENHS[mot] = DESSENHS[model];

// Un même mot dans deux unités avec deux sens : chaque sens a son dessin,
// reconnu à la définition (la cosina : la cuisine en unité 7, la cousine en unité 3).
const AUTRE_SENS = { 'la cosina': { mot: 'la cousine', chemins: COSINA } }; // la définition commence par ce sens
const autreSens = (oc, def) => (AUTRE_SENS[oc] && def.startsWith(AUTRE_SENS[oc].mot) ? AUTRE_SENS[oc] : null);

/** Les chemins SVG d'un mot (texte), ou null. */
export function cheminsDe(oc, def = '') {
	return autreSens(oc, def)?.chemins ?? DESSENHS[oc] ?? null;
}

/** Les chemins d'un mot, prêts pour le canevas (Path2D), ou null. */
const cache = new Map();
export function dessenhDe(oc, def = '') {
	const chemins = cheminsDe(oc, def);
	if (!chemins) return null;
	const k = autreSens(oc, def) ? `${oc}·${AUTRE_SENS[oc].mot}` : oc;
	if (!cache.has(k)) cache.set(k, chemins.map((d) => new Path2D(d)));
	return cache.get(k);
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
