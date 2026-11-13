// Photos de Romain qu'on peut voir en occitan (S'imagina, 2026-11-12) : un texte remplacé (plaque, panneau) ou
// un élément posé là où il n'y avait rien (plaque sur un mur nu, lettrage peint sur une façade).
//
// Principe : la photo de base n'est jamais modifiée ; une petite retouche (WebP avec transparence) ne couvre que
// les pixels à changer et vient se poser dessus. La bascule n'est qu'un fondu de la retouche : un seul fichier de
// base, quelques ko par élément. Les retouches sont fabriquées par `outils/photos-oc/talhar.py` (fiches dans
// `outils/photos-oc/fotos/`), qui écrit aussi le JSON de géométrie importé ici (x, y, l, h en fraction de la photo).
//
// natura : 'cambiat' (un texte français remplacé), 'pausat' (un objet posé sur un mur nu), 'pintat' (un lettrage
// peint à même le mur). fr vide = rien à cet endroit sur la photo d'origine.
//
// Occitan à valider par Romain. Vérifiés avec lo Congrès le 12-11 : carrièra, prat, androna, sant, fornariá.
// « Dels Nobles » est le nom que donne la plaque ovale déjà posée sur la photo. « Pèire » (Pierre) est un nom
// propre, absent du Basic : à confirmer, comme le nom de la rue elle-même (vue prise de la Canourgue, Montpellier).
import impasse from './fotos/impasse-lo-prat.json';
import louisBlanc from './fotos/louis-blanc.json';
import santPeire from './fotos/sant-peire.json';
import fornaria from './fotos/fornaria.json';

/** Géométrie (du JSON de l'outil) + textes de chaque zone. */
function zones(json, textes) {
	return json.zones.map((z) => ({ patch: z.patch, x: z.x, y: z.y, l: z.l, h: z.h, ...textes[z.id] }));
}

export const FOTOS_OC = [
	{
		clau: 'fornaria',
		natura: 'pintat',
		l: fornaria.l,
		h: fornaria.h,
		alt: { fr: 'À Montpellier, une haute maison de pierre blonde aux volets gris, au soleil du soir.' },
		zones: zones(fornaria, { mur: { fr: '', oc: 'FORNARIÁ' } })
	},
	{
		clau: 'sant-peire',
		natura: 'pausat',
		l: santPeire.l,
		h: santPeire.h,
		alt: { fr: 'À Montpellier, un mur de pierre claire en plein soleil, au-dessus d’une fenêtre aux volets bleu pâle.' },
		zones: zones(santPeire, { placa: { fr: '', oc: 'Carrièra de SANT PÈIRE' } })
	},
	{
		clau: 'louis-blanc',
		natura: 'cambiat',
		l: louisBlanc.l,
		h: louisBlanc.h,
		alt: { fr: 'Sur un mur crépi, une plaque de rue bleue en émail, et dessous une plaque ovale déjà en occitan.' },
		zones: zones(louisBlanc, { placa: { fr: 'RUE LOUIS BLANC', oc: 'CARRIÈRA DELS NOBLES' } })
	},
	{
		clau: 'impasse-lo-prat',
		natura: 'cambiat',
		l: impasse.l,
		h: impasse.h,
		alt: {
			fr: 'Un panneau de rue beige sur un poteau métallique, devant un pré et, au loin, les toits d’un village sous un ciel de nuages.'
		},
		zones: zones(impasse, { placa: { fr: 'IMPASSE de LOU PRA', oc: 'ANDRONA de LO PRAT' } })
	}
];
