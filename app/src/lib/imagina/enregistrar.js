// L'image que le visiteur enregistre (atelier S'imagina, essai du 2026-11-13). Tout se fait dans son navigateur :
// la photo, l'esquisse couchée sur le mur, et une bande en bas qui dit que c'est une esquisse. Rien n'est envoyé.
import { esquissa, dessenhar, coucar, fugas, marge } from "./esquissa.js";

// les traits gardent la finesse qu'ils ont sur une photo vue à 900 pixels de large
const VISTA = 900;

const tintaDe = () => {
  const st = getComputedStyle(document.documentElement);
  return (nom) => st.getPropertyValue(`--imagina-${nom}`).trim();
};

function cargar(src) {
  return new Promise((ok, ko) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = ko;
    im.src = src;
  });
}

/**
 * Fabrique l'image (un Blob JPEG) : `foto` (atelier.js), `endrech` (l'endroit) et `forma` ({ quad en fractions,
 * proporcion }), `estil`, `mot` ({ oc, fr }), `mesura` (mesure du texte, la même que dans la page).
 */
export async function fabricar({ foto, endrech, forma, estil, mot, mesura }) {
  const quad = forma.quad;
  await document.fonts.ready;
  const tinta = tintaDe();
  const im = await cargar(foto.src);
  const L = foto.l,
    Hf = foto.h,
    banda = Math.round(L * 0.085);
  const c = document.createElement("canvas");
  c.width = L;
  c.height = Hf + banda;
  const ctx = c.getContext("2d");
  ctx.drawImage(im, 0, 0, L, Hf);
  const escala = L / VISTA; // pixels de l'image par pixel de la vue de référence

  const q = quad.map(([x, y]) => [x * L, y * Hf]);
  const bord =
    (Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) +
      Math.hypot(q[2][0] - q[3][0], q[2][1] - q[3][1])) /
    2;
  const esq = esquissa({
    estil,
    mot,
    prop: forma.proporcion,
    px: 1000 / (bord / escala),
    mesura,
    cobrir: !!endrech.cobrir,
    remplaça: !!endrech.remplaça,
  });

  if (esq.fuga) {
    ctx.save();
    ctx.strokeStyle = tinta("grafit");
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = escala;
    ctx.setLineDash([5 * escala, 4 * escala]);
    for (const [x1, y1, x2, y2] of fugas(quad)) {
      ctx.beginPath();
      ctx.moveTo(x1 * L, y1 * Hf);
      ctx.lineTo(x2 * L, y2 * Hf);
      ctx.stroke();
    }
    ctx.restore();
  }

  // l'esquisse, dessinée à plat deux fois plus fin que sa taille sur la photo, puis couchée sur le mur
  const s = Math.min(4, Math.max(0.5, (2 * bord) / esq.W));
  const m = marge(esq);
  const plat = document.createElement("canvas");
  plat.width = Math.ceil((esq.W + 2 * m) * s);
  plat.height = Math.ceil((esq.H + 2 * m) * s);
  const pc = plat.getContext("2d");
  pc.scale(s, s);
  pc.translate(m, m);
  dessenhar(pc, esq.formas, tinta);
  const dest = ctx.getImageData(0, 0, L, Hf);
  coucar(dest, pc.getImageData(0, 0, plat.width, plat.height), {
    W: esq.W,
    H: esq.H,
    s,
    quad: q,
    m,
  });
  ctx.putImageData(dest, 0, 0);

  // la bande : c'est une esquisse, rien de cela n'est sur place
  ctx.fillStyle = tinta("papier");
  ctx.fillRect(0, Hf, L, banda);
  ctx.fillStyle = tinta("grafit");
  ctx.textBaseline = "middle";
  const t1 = Math.round(banda * 0.3),
    t2 = Math.round(banda * 0.21),
    mg = Math.round(banda * 0.35);
  ctx.font = `700 ${t1}px 'Luciole', system-ui, sans-serif`;
  ctx.fillText(
    `Dessenh sus una fòto · Esquisse sur une photo`,
    mg,
    Hf + banda * 0.36,
  );
  ctx.font = `400 ${t2}px 'Luciole', system-ui, sans-serif`;
  ctx.fillText(
    `« ${mot.oc} » n’est pas sur place. S’imagina, Lo Ligam`,
    mg,
    Hf + banda * 0.7,
  );

  return new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.9));
}
