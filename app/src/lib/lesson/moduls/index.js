// Registre des modules disponibles pour le moteur de leçon.
// La clé est le segment d'URL : /aprene/modul/<clé>.
import { modul11 } from './modul-1-1.js';
import { modul12 } from './modul-1-2.js';
import { modul13 } from './modul-1-3.js';
import { modul14 } from './modul-1-4.js';

export const moduls = {
	'1-1': modul11,
	'1-2': modul12,
	'1-3': modul13,
	'1-4': modul14
};

// Ordre du chemin : sert à proposer « module précédent / suivant ».
export const ordre = ['1-1', '1-2', '1-3', '1-4'];
