// Dessins au trait pour la poussière d'or (Romain, 05-11 : « que la poussière
// dessine de manière très minimaliste, avec des traits, l'élément »).
//
// Chaque dessin est une liste de chemins SVG dans un carré de 100 × 100 ;
// la clé est le mot occitan tel qu'il est écrit dans scenas.js. Un mot sans
// dessin se forme quand même : les grains du dessin rejoignent alors le mot.
// Un seul poids de trait, pas de remplissage : c'est la poussière qui dessine.
//
// Unités couvertes : 5 (Al mercat) et 7 (L'ostal). Les autres viendront
// unité par unité, après relecture de Romain.

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
		'M50 14C50 30 18 44 22 70C26 88 74 88 78 70C82 44 50 30 50 14Z',
		'M50 30C40 46 36 64 42 84M50 30C60 46 64 64 58 84',
		'M44 88L42 94M50 88L50 95M56 88L58 94'
	],
	'la patana': [
		'M30 36C44 22 72 26 80 44C88 62 74 82 54 82C34 82 16 66 24 48C26 44 28 40 30 36Z', // pomme de terre
		'M40 48a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M60 42a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M52 66a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M68 60a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0' // yeux
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
};

/** Les chemins d'un mot, prêts pour le canevas (Path2D), ou null. */
const cache = new Map();
export function dessenhDe(oc) {
	if (!DESSENHS[oc]) return null;
	if (!cache.has(oc)) cache.set(oc, DESSENHS[oc].map((d) => new Path2D(d)));
	return cache.get(oc);
}
