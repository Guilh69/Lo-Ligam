// Registre des modules disponibles pour le moteur de leçon.
// La clé est le segment d'URL : /aprene/modul/<clé>.
import { modul11 } from './modul-1-1.js';
import { modul12 } from './modul-1-2.js';
import { modul13 } from './modul-1-3.js';
import { modul14 } from './modul-1-4.js';
import { modul0 } from './modul-0.js';
import { modul21 } from './modul-2-1.js';
import { modul22 } from './modul-2-2.js';
import { modul23 } from './modul-2-3.js';
import { modul24 } from './modul-2-4.js';
import { modulPausa1 } from './modul-pausa-1.js';
import { modul31 } from './modul-3-1.js';
import { modul32 } from './modul-3-2.js';
import { modul33 } from './modul-3-3.js';
import { modul34 } from './modul-3-4.js';
import { modul41 } from './modul-4-1.js';
import { modul42 } from './modul-4-2.js';
import { modul43 } from './modul-4-3.js';
import { modul44 } from './modul-4-4.js';
import { modulPausa2 } from './modul-pausa-2.js';
import { modul51 } from './modul-5-1.js';
import { modul52 } from './modul-5-2.js';
import { modul53 } from './modul-5-3.js';
import { modul54 } from './modul-5-4.js';
import { modul61 } from './modul-6-1.js';
import { modul62 } from './modul-6-2.js';
import { modul63 } from './modul-6-3.js';
import { modul64 } from './modul-6-4.js';
import { modulPausa3 } from './modul-pausa-3.js';
import { modul71 } from './modul-7-1.js';
import { modul72 } from './modul-7-2.js';
import { modul73 } from './modul-7-3.js';
import { modul74 } from './modul-7-4.js';
import { modul81 } from './modul-8-1.js';
import { modul82 } from './modul-8-2.js';
import { modul83 } from './modul-8-3.js';
import { modul84 } from './modul-8-4.js';
import { modulPausa4 } from './modul-pausa-4.js';
import { modulMissionA1 } from './modul-mission-a1.js';

export const moduls = {
	'0': modul0,
	'1-1': modul11,
	'1-2': modul12,
	'1-3': modul13,
	'1-4': modul14,
	'2-1': modul21,
	'2-2': modul22,
	'2-3': modul23,
	'2-4': modul24,
	'pausa-1': modulPausa1,
	'3-1': modul31,
	'3-2': modul32,
	'3-3': modul33,
	'3-4': modul34,
	'4-1': modul41,
	'4-2': modul42,
	'4-3': modul43,
	'4-4': modul44,
	'pausa-2': modulPausa2,
	'5-1': modul51,
	'5-2': modul52,
	'5-3': modul53,
	'5-4': modul54,
	'6-1': modul61,
	'6-2': modul62,
	'6-3': modul63,
	'6-4': modul64,
	'pausa-3': modulPausa3,
	'7-1': modul71,
	'7-2': modul72,
	'7-3': modul73,
	'7-4': modul74,
	'8-1': modul81,
	'8-2': modul82,
	'8-3': modul83,
	'8-4': modul84,
	'pausa-4': modulPausa4,
	'mission-a1': modulMissionA1
};

// Ordre du chemin : sert à proposer « module précédent / suivant ».
// A1 complet (carte A1, 2026-10-25) : module 0, huit unités, une halte
// (« pausa ») toutes les deux unités, la mission de fin de niveau.
export const ordre = [
	'0',
	'1-1',
	'1-2',
	'1-3',
	'1-4',
	'2-1',
	'2-2',
	'2-3',
	'2-4',
	'pausa-1',
	'3-1',
	'3-2',
	'3-3',
	'3-4',
	'4-1',
	'4-2',
	'4-3',
	'4-4',
	'pausa-2',
	'5-1',
	'5-2',
	'5-3',
	'5-4',
	'6-1',
	'6-2',
	'6-3',
	'6-4',
	'pausa-3',
	'7-1',
	'7-2',
	'7-3',
	'7-4',
	'8-1',
	'8-2',
	'8-3',
	'8-4',
	'pausa-4',
	'mission-a1'
];
