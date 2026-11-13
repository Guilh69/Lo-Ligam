// Revirar : les touches d'accents sous la zone de saisie (Romain, 2026-11-13).
// « · » est le point intérieur (n·h, s·h).
export const TOUCHES = ['à', 'è', 'ò', 'á', 'é', 'í', 'ó', 'ú', 'ï', 'ü', 'ç', '·'];

/** Le nom lu par un lecteur d'écran pour une touche. */
export const NOM_TOUCHE = { '·': 'point intérieur' };

/**
 * Insère `car` à la place de la sélection [debut, fin] de `valeur` ;
 * rend la nouvelle valeur et la position du curseur juste après le caractère.
 * `maj` met le caractère en majuscule (« · » n'en a pas).
 */
export function inserir(valeur, debut, fin, car, maj = false) {
	const v = String(valeur ?? '');
	const a = Math.min(Math.max(0, debut ?? v.length), v.length);
	const b = Math.min(Math.max(a, fin ?? a), v.length);
	const c = maj ? car.toUpperCase() : car;
	return { valeur: v.slice(0, a) + c + v.slice(b), curseur: a + c.length };
}
