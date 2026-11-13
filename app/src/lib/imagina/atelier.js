// L'atelier public de S'imagina, « Las carrièras » (essai du 2026-11-13, /ensag/imagina-atelier).
// Décision de Romain (entretien du 13-11, docs/vision/entrevista-imagina-fotos-2026-11-13.md) : le visiteur
// imagine sur les photos de Romain, touche un endroit déjà repéré, prend un mot dans une liste vérifiée, et voit
// tout de suite une esquisse, un dessin assumé posé dans le plan du mur. Rien n'est gardé par le site.
//
// Ce fichier : les photos, les endroits repérés et les mots. La perspective n'est pas dessinée à l'œil : chaque mur
// porte des arêtes relevées sur la photo (cordons, linteaux, montants, ferrures ; reprises des fiches de
// outils/photos-oc/fotos, ramenées à l'image en ligne), et perspectiva.js en tire la verticale, l'orientation du mur
// et le vrai rectangle couché sur ce mur. La focale vient des originaux (27 mm, Pixel), recalculée pour le cadrage
// en ligne. Une surface qui donne sa propre perspective (un panneau vu de face) porte ses quatre coins relevés.
//
// Occitan vérifié avec lo Congrès le 13-11 (verificar-oc.mjs, variété languedocienne) : chaque mot des listes.
// Écartés car non confirmés : farmàcia (→ farmacia), espiçariá (→ especiariá), cinèma (→ cinema), vins, ribièra,
// vòta, merceriá. « Lo Prat » reprend « Lou Pra » de la plaque d'origine, en graphie classique : à valider par Romain.
import {
  camera,
  preparar,
  vertical,
  paret,
  quadParet,
  aplicar,
  omografia,
} from "./perspectiva.js";

/** Les mots qu'on peut poser, par sorte d'endroit (ids de NATURAS, emplacements.js). */
export const MOTS = {
  ensenha: [
    { oc: "Fornariá", fr: "Boulangerie" },
    { oc: "Farmacia", fr: "Pharmacie" },
    { oc: "Librariá", fr: "Librairie" },
    { oc: "Bocariá", fr: "Boucherie" },
    { oc: "Especiariá", fr: "Épicerie" },
    { oc: "Peissonariá", fr: "Poissonnerie" },
    { oc: "Cafè", fr: "Café" },
    { oc: "Albèrga", fr: "Auberge" },
  ],
  pintura: [
    { oc: "Benvenguda", fr: "Bienvenue" },
    { oc: "Albèrga", fr: "Auberge" },
    { oc: "Garatge", fr: "Garage" },
    { oc: "Remisa", fr: "Remise" },
    { oc: "Lavador", fr: "Lavoir" },
    { oc: "Teatre", fr: "Théâtre" },
    { oc: "Mercat", fr: "Marché" },
    { oc: "Cafè", fr: "Café" },
  ],
  publicitat: [
    { oc: "Bal", fr: "Bal" },
    { oc: "Concèrt", fr: "Concert" },
    { oc: "Fèsta del vilatge", fr: "Fête du village" },
    { oc: "Mercat", fr: "Marché" },
    { oc: "Teatre", fr: "Théâtre" },
    { oc: "Cinema", fr: "Cinéma" },
  ],
  panel: [
    { oc: "Centre", fr: "Centre" },
    { oc: "Glèisa", fr: "Église" },
    { oc: "Escòla", fr: "École" },
    { oc: "Ostal de vila", fr: "Mairie" },
    { oc: "Castèl", fr: "Château" },
    { oc: "Molin", fr: "Moulin" },
    { oc: "Font", fr: "Fontaine" },
    { oc: "Plaça", fr: "Place" },
    { oc: "Cementèri", fr: "Cimetière" },
  ],
};

/** Ce que dit chaque sorte d'endroit au visiteur. */
export const NOMS_NATURA = {
  ensenha: "une enseigne",
  pintura: "des lettres peintes",
  publicitat: "une affiche",
  panel: "un panneau",
  placa: "une plaque de rue",
};

// Repères en pixels de l'image en ligne (plus lisibles à relire sur une vue quadrillée), ramenés en fractions.
const fr = (foto, [x1, y1, x2, y2]) => [
  x1 / foto.l,
  y1 / foto.h,
  x2 / foto.l,
  y2 / foto.h,
];
const zonaFr = (foto, [x0, y0, x1, y1]) => [
  x0 / foto.l,
  y0 / foto.h,
  x1 / foto.l,
  y1 / foto.h,
];

export const FOTOS = [
  {
    clau: "fornaria",
    src: "/imagina/fornaria-base.webp",
    l: 1400,
    h: 1307,
    nom: "La maison de pierre",
    alt: "À Montpellier, une haute maison de pierre blonde aux volets gris, au soleil du soir.",
    // Pixel 5, 27 mm, recadré [1300, 350, 4032, 2900] dans l'original
    focala: [1.1511, 0.2621, 0.4557],
    parets: {
      faciada: {
        horizontales: [
          [727, 92, 791, 74],
          [736, 267, 804, 246],
          [570, 335, 621, 316],
          [570, 640, 823, 582],
          [572, 773, 837, 726],
          [565, 164, 615, 147],
        ],
        verticales: [
          [791, 74, 805, 246],
          [727, 94, 738, 266],
          [567, 164, 570, 335],
          [617, 147, 621, 316],
          [789, 440, 815, 715],
          [595, 499, 610, 756],
        ],
      },
    },
    endrechs: [
      {
        id: "naut",
        paret: "faciada",
        zona: [860, 262, 1190, 432],
        natura: "pintura",
        fr: "le grand mur nu, en haut à droite",
      },
      {
        id: "bendel",
        paret: "faciada",
        zona: [330, 800, 880, 890],
        natura: "ensenha",
        fr: "le bandeau au-dessus des fenêtres du bas",
      },
      {
        id: "dreita",
        paret: "faciada",
        zona: [960, 640, 1210, 860],
        natura: "publicitat",
        fr: "le mur à droite des balcons",
      },
    ],
  },
  {
    clau: "sant-peire",
    src: "/imagina/sant-peire-base.webp",
    l: 1200,
    h: 1253,
    nom: "Le mur au soleil",
    alt: "À Montpellier, un mur de pierre claire en plein soleil, au-dessus d’une porte en arc aux volets bleu pâle.",
    // Pixel, 27 mm, recadré [2500, 900, 4032, 2500] dans l'original (le centre optique est hors du cadre)
    focala: [2.0528, -0.3159, 0.3825],
    parets: {
      portal: {
        horizontales: [
          [578, 420, 1187, 453],
          [720, 767, 811, 796],
          [711, 995, 801, 1035],
          [705, 1222, 792, 1267],
        ],
        verticales: [
          [651, 715, 638, 1243],
          [947, 746, 920, 1419],
          [834, 762, 819, 1318],
          [727, 721, 709, 1256],
        ],
      },
    },
    endrechs: [
      {
        id: "portal",
        paret: "portal",
        zona: [640, 486, 960, 626],
        natura: "ensenha",
        fr: "le mur au-dessus de la porte",
      },
      {
        id: "costat",
        paret: "portal",
        zona: [968, 720, 1170, 1000],
        natura: "publicitat",
        fr: "le mur à droite de la porte",
      },
    ],
  },
  {
    clau: "impasse-lo-prat",
    src: "/imagina/impasse-lo-prat-base.webp",
    l: 1643,
    h: 1184,
    nom: "Le panneau du pré",
    alt: "Un panneau de rue beige sur un poteau métallique, devant un pré et, au loin, les toits d’un village sous un ciel de nuages.",
    endrechs: [
      {
        id: "placa",
        // les quatre coins du panneau lui-même (il donne sa propre perspective)
        coins: [
          [412, 465],
          [871, 474],
          [871, 727],
          [410, 720],
        ],
        proporcion: 1.95,
        natura: "placa",
        cobrir: true,
        remplaça: true,
        fr: "le panneau de la rue",
        mots: [
          {
            oc: "Androna de Lo Prat",
            fr: "Impasse de Lou Pra",
            lignes: ["Androna", "de Lo Prat"],
          },
        ],
      },
      {
        id: "pal",
        // un second panneau, fixé plus bas sur le même poteau : même plan que le premier
        sus: "placa",
        dins: [0.16, 1.22, 0.84, 1.5],
        natura: "panel",
        cobrir: true,
        fr: "le poteau, sous le panneau",
      },
    ],
  },
];

export const foto = (clau) => FOTOS.find((f) => f.clau === clau);
export const motsDe = (endrech) => endrech.mots ?? MOTS[endrech.natura] ?? [];

/** La perspective de chaque mur d'une photo : { cam, dv, phi } (calculée une fois). */
function parets(f) {
  const cam = camera(f, f.focala);
  const res = {};
  for (const [id, p] of Object.entries(f.parets ?? {})) {
    const segs = [...p.horizontales, ...p.verticales].map((s) => fr(f, s));
    const trachs = preparar(segs, cam);
    const v = vertical(trachs);
    // l'orientation se vote sur toute l'étendue des arêtes relevées : elles sont toutes sur ce mur
    const xs = segs.flatMap((s) => [s[0], s[2]]),
      ys = segs.flatMap((s) => [s[1], s[3]]);
    const zona = [
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs),
      Math.max(...ys),
    ];
    const o = paret(trachs, cam, v.d, zona, { sx: 1, sy: 2 });
    // paret() se méfie de moins de quatre traits concordants (garde-fou fait pour les traits trouvés seuls dans
    // la page) ; ici les arêtes sont relevées à la main, au pixel près : son meilleur angle fait foi.
    const phi = o.fisable ? o.phi : (o.autras[0] ?? 0);
    res[id] = { cam, dv: v.d, phi, montants: v.nombre };
  }
  return res;
}

/**
 * Les quatre coins de chaque endroit, en fractions de la photo (haut gauche, haut droit, bas droit, bas gauche),
 * et la proportion réelle largeur / hauteur de la surface. Les endroits d'une photo se calculent ensemble.
 */
export function endrechsDe(f) {
  const ps = parets(f);
  const out = {};
  for (const e of f.endrechs) {
    if (e.coins) {
      out[e.id] = {
        quad: e.coins.map(([x, y]) => [x / f.l, y / f.h]),
        proporcion: e.proporcion,
      };
    } else if (e.sus) {
      // une surface dans le même plan qu'une autre : on prolonge la déformation de celle-ci
      const base = out[e.sus];
      const lp = base.proporcion,
        H = omografia(
          [
            [0, 0],
            [1, 0],
            [1, 1 / lp],
            [0, 1 / lp],
          ],
          base.quad,
        );
      const [u0, v0, u1, v1] = e.dins;
      const quad = [
        [u0, v0 / lp],
        [u1, v0 / lp],
        [u1, v1 / lp],
        [u0, v1 / lp],
      ].map((p) => aplicar(H, p));
      out[e.id] = { quad, proporcion: ((u1 - u0) * lp) / (v1 - v0) };
    } else {
      const p = ps[e.paret];
      const q = quadParet(p.cam, p.dv, p.phi, zonaFr(f, e.zona));
      out[e.id] = { ...q, phi: p.phi };
    }
  }
  return out;
}
