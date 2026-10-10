// L'estat de la carta partejat entre lo rail (RailJaces) e la carta
// (CartaOccitania), 2026-10-10 :
// - z, lat : la vista actuala, per saber se una jaça alucada se vei a
//   aquesta escala (sinon, lo rail ditz « Visibla a partir de… » amb « I anar ») ;
// - apercebut : la jaça alucada un moment al survòl de sa linha (pas dins
//   l'istoric, la carta bolega pas).
export const estatCarta = $state({ z: null, lat: null, apercebut: null });
