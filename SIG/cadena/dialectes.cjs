// Zones de dialectes d'après la carte Occitanica : chaque pixel du domaine est
// rangé dans la famille de couleur la plus proche (couleur de base du dialecte
// éclaircie par le relief), puis nettoyé. Orange vif : limousin à l'ouest,
// vivaro-alpin à l'est (même teinte, séparés par l'auvergnat).
const sharp = require('C:/Users/perie/Documents/6_Projectes/Lo_Ligam/app/node_modules/sharp');
const dir = __dirname + '/';
// 1 gas, 2 lan, 3 pro, 4 lem, 5 auv, 6 viv, 7 transicion auv/viv
const FAM = {
  1: [[198, 78, 254], [207, 104, 255], [214, 128, 255], [219, 146, 254], [225, 161, 255]],
  2: [[224, 25, 141], [230, 60, 157], [232, 89, 171], [235, 114, 183], [239, 135, 194]],
  3: [[255, 55, 153], [255, 86, 167], [255, 111, 181], [255, 132, 192], [255, 150, 202]],
  4: [[254, 108, 51], [255, 129, 81], [255, 148, 106], [254, 164, 129], [255, 178, 148]],
  5: [[229, 92, 60], [234, 116, 90], [236, 137, 114], [238, 155, 135]],
  7: [[223, 64, 25]]
};
const REF = [];
for (const [k, l] of Object.entries(FAM)) for (const c of l) REF.push([+k, c]);
(async () => {
  const { data, info } = await sharp(dir + 'treball.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const mk = await sharp(dir + 'masca.png').raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, mc = mk.info.channels;
  const lab = new Uint8Array(W * H); // 0 hors domaine, 255 à remplir
  for (let i = 0; i < W * H; i++) {
    if (!mk.data[i * mc]) continue;
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    let best = 255, bd = 26 * 26 * 3;
    for (const [k, [R, G, B]] of REF) { const d = (r - R) ** 2 + (g - G) ** 2 + (b - B) ** 2; if (d < bd) { bd = d; best = k; } }
    lab[i] = best;
  }
  // limousin / vivaro-alpin : même famille, séparés par composantes connexes
  // (le plus grand bloc à l'ouest de x = 2400 est limousin, le reste à l'est vivaro)
  for (let i = 0; i < W * H; i++) if (lab[i] === 4 && (i % W) > 2300) lab[i] = 6;
  // ombre grise le long de la frontière italienne : le saumon y paraît plus
  // sombre et passerait pour de l'auvergnat ; l'auvergnat s'arrête au Rhône
  for (let i = 0; i < W * H; i++) if ((lab[i] === 5 || lab[i] === 7) && (i % W) > 2750) lab[i] = 6;
  // remplissage des pixels non classés (écritures, rivières, pointillés) par
  // le voisin classé le plus proche : passes successives
  for (let pass = 0; pass < 60; pass++) {
    let reste = 0;
    const nouveau = lab.slice();
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (lab[i] !== 255) continue;
      const cnt = [0, 0, 0, 0, 0, 0, 0, 0];
      for (const q of [i - 1, i + 1, i - W, i + W, i - W - 1, i - W + 1, i + W - 1, i + W + 1]) { const v = lab[q]; if (v && v !== 255) cnt[v]++; }
      let bk = 0; for (let k = 1; k < 8; k++) if (cnt[k] > cnt[bk]) bk = k;
      if (bk) nouveau[i] = bk; else reste++;
    }
    lab.set(nouveau);
    if (!reste) break;
  }
  // filtre de majorité (rayon 6) pour lisser les franges du relief
  const R = 6, out = lab.slice();
  const integ = {};
  for (let k = 1; k < 8; k++) {
    const S = new Int32Array((W + 1) * (H + 1));
    for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += lab[y * W + x] === k ? 1 : 0; S[(y + 1) * (W + 1) + x + 1] = S[y * (W + 1) + x + 1] + row; } }
    integ[k] = S;
  }
  const somme = (S, x0, y0, x1, y1) => S[y1 * (W + 1) + x1] - S[y0 * (W + 1) + x1] - S[y1 * (W + 1) + x0] + S[y0 * (W + 1) + x0];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (!lab[i]) continue;
    const x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(W, x + R + 1), y1 = Math.min(H, y + R + 1);
    let bk = lab[i], bn = -1;
    for (let k = 1; k < 8; k++) { const n = somme(integ[k], x0, y0, x1, y1); if (n > bn) { bn = n; bk = k; } }
    out[i] = bk;
  }
  // petites composantes (écritures de la carte, taches de relief) : rendues à
  // la classe qui les entoure
  {
    const vu = new Int32Array(W * H).fill(-1), pila = new Int32Array(W * H);
    let n = 0;
    for (let s0 = 0; s0 < W * H; s0++) {
      if (!out[s0] || vu[s0] >= 0) continue;
      const k = out[s0]; let top = 0; const memb = [];
      pila[top++] = s0; vu[s0] = n;
      const voisins = [0, 0, 0, 0, 0, 0, 0, 0];
      while (top) {
        const p = pila[--top], x = p % W; memb.push(p);
        for (const q of [p - 1, p + 1, p - W, p + W]) {
          if (q < 0 || q >= W * H || Math.abs((q % W) - x) > 1) continue;
          if (out[q] !== k) { if (out[q]) voisins[out[q]]++; continue; }
          if (vu[q] >= 0) continue;
          vu[q] = n; pila[top++] = q;
        }
      }
      n++;
      if (memb.length < 6000) { let bk = 0; for (let j = 1; j < 8; j++) if (voisins[j] > voisins[bk]) bk = j; if (bk) for (const p of memb) out[p] = bk; }
    }
  }
  const comptes = {}; for (const v of out) if (v) comptes[v] = (comptes[v] || 0) + 1;
  console.log('pixels par classe', JSON.stringify(comptes));
  // une image par classe pour la vectorisation, et un aperçu coloré
  for (let k = 1; k < 8; k++) {
    const b = Buffer.alloc(W * H); for (let i = 0; i < W * H; i++) b[i] = out[i] === k ? 255 : 0;
    await sharp(b, { raw: { width: W, height: H, channels: 1 } }).png().toFile(dir + `dial-${k}.png`);
  }
  const PAL = { 0: [40, 40, 40], 1: [140, 70, 220], 2: [200, 20, 120], 3: [255, 120, 190], 4: [255, 140, 40], 5: [170, 60, 30], 6: [255, 210, 120], 7: [20, 20, 20], 255: [0, 255, 0] };
  const ap = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) { const c = PAL[out[i]] || [0, 255, 0]; ap[i * 3] = c[0]; ap[i * 3 + 1] = c[1]; ap[i * 3 + 2] = c[2]; }
  await sharp(ap, { raw: { width: W, height: H, channels: 3 } }).resize(1400).jpeg({ quality: 80 }).toFile(dir + 'dialectes-apercu.jpg');
})();
