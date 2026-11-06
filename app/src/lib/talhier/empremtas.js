// Lo talhièr, lot 4 (2026-11-06) : l'empreinte de ce que Romain valide.
// Une validation vaut pour un texte précis (table validacions,
// supabase/supabase-validacions.sql) : si le texte change, l'empreinte change
// et l'élément revient dans la pile. Le même calcul sert dans le navigateur
// (la pile, « Validar ») et dans les scripts de l'IA (scripts/remarcas.mjs) :
// ce fichier ne dépend ni de Svelte ni de Vite.

/** le texte occitan d'un élément des pages, tel qu'on le valide */
export const tèxteElement = (oc) => String(oc ?? '').normalize('NFC').trim();

/** une fiche de grammaire entière, sauf son drapeau « validada » (que l'IA
 *  passe à vrai une fois la fiche validée : ça ne change pas la fiche) */
export function tèxteFicha(f) {
	const { validada: _, ...rèsta } = f;
	return JSON.stringify(rèsta);
}

/** sha-256 en hexadécimal (64 caractères) */
export async function empremta(tèxte) {
	const octets = new TextEncoder().encode(tèxte);
	const h = await globalThis.crypto.subtle.digest('SHA-256', octets);
	return Array.from(new Uint8Array(h), (o) => o.toString(16).padStart(2, '0')).join('');
}
