// L'estat de la carta partejat entre lo rail (RailJaces) e la carta
// (CartaOccitania), 2026-10-10 :
// - z, lat : la vista actuala, per saber se una jaça alucada se vei a
//   aquesta escala (sinon, lo rail ditz « Visibla a partir de… » amb « I anar ») ;
// - apercebut : la jaça alucada un moment al survòl de sa linha (pas dins
//   l'istoric, la carta bolega pas) ;
// - mòde : 'lengas' dins lo mòde « Lengas de França » ; environament : las
//   lengas mostradas tanben fòra de França (las autras, sonque lor part francesa).
// - activa : la couche active de la légende, façon QGIS (Romain, 2026-10-19) :
//   la dernière allumée, ou celle dont on touche le nom ; seule elle répond au
//   clic et au double clic sur la carte (null : l'ordre habituel des couches).
// - causida : l'objet choisi d'un clic sur la carte ({ jaça, nom } ou null),
//   rappelé sous sa couche dans la légende avec un ✕ (audit des clics, 2026-10-19).
export const estatCarta = $state({ z: null, lat: null, apercebut: null, mòde: null, environament: [], activa: null, causida: null });

// Les couches dont on peut choisir un objet sur la carte (et leurs langues, LENGAS)
export const SELECCIONABLAS = new Set(['vilas', 'regions', 'despartaments', 'comunas', 'dialectes', 'provincias', 'parcs']);
// Las jaces de ponches : alucadas, prenon la man sul clic (los noms de vilas e
// las zònas lor cedisson ; retorn de Romain, 2026-10-23)
export const JACES_PONCHS = ['calandretas', 'ensBilingue', 'ensEscola', 'ensSegond', 'ensSuperior', 'corsAdults', 'cercles', 'culturaOc', 'librarias', 'lieusInteres'];
for (const id of JACES_PONCHS) SELECCIONABLAS.add(id);
