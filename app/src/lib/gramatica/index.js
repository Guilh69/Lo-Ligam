// Toutes les fiches de grammaire : chaque fichier de fichas/ en est une
// (mode d'emploi : LEGIR-ME.md). Rangées par chapitre pour le sommaire.
import { PARTS } from './capitols.js';

const fichiers = import.meta.glob('./fichas/*.js', { eager: true, import: 'default' });

export const FICHAS = Object.values(fichiers);

export const ficha = (id) => FICHAS.find((f) => f.id === id);

/** les fiches d'un chapitre, dans l'ordre de leur champ « ordre » (sinon du nom) */
export const fichasDe = (capitol) =>
	FICHAS.filter((f) => f.capitol === capitol).sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || a.id.localeCompare(b.id));

export { PARTS };
