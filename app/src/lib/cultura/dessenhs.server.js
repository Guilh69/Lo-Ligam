// Les dessins au trait des fiches sans photo (Cultura, 2026-11-06), tirés
// côté serveur : le fichier des dessins de Remira (80 Ko) ne part pas au
// navigateur, seulement les quelques chemins utiles.
import { cheminsDe } from '$lib/plueja/dessenhs.js';
import { DESSENHS } from '$lib/cultura/imatges.js';

/** chemins SVG (carré 100 × 100) du dessin d'une fiche, ou null */
export const dessenh = (id) => (DESSENHS[id] ? (cheminsDe(DESSENHS[id]) ?? null) : null);

/** fiche → chemins, pour toutes les fiches qui ont un dessin */
export const dessenhs = () => Object.fromEntries(Object.keys(DESSENHS).map((id) => [id, dessenh(id) ?? []]));
