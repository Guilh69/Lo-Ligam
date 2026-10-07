// Copa un extrait d'un MP3 sens lo tornar encodar : las tramas MP3 son
// gardadas tal coma son, entre doas oras (en segondas). Lo navegador lo
// legís ; lo començament pòt èsser un pauc trebolat (resèrva de bits), escafat
// pel fondut del son.
// Usatge : node SIG/cadena/sons-copar.mjs entrada.mp3 sortida.mp3 debut fin
import fs from 'fs';
const [, , entrada, sortida, t0, t1] = process.argv;
const b = fs.readFileSync(entrada);
let i = 0;
if (b.slice(0, 3).toString() === 'ID3') i = 10 + ((b[6] << 21) | (b[7] << 14) | (b[8] << 7) | b[9]);
const BR = {
	1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
	2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
};
const SR = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
const tramas = [];
let mostras = 0,
	sr = 0;
while (i + 4 <= b.length) {
	if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) {
		i++;
		continue;
	}
	const ver = (b[i + 1] >> 3) & 3,
		capa = (b[i + 1] >> 1) & 3,
		bri = b[i + 2] >> 4,
		sri = (b[i + 2] >> 2) & 3,
		pad = (b[i + 2] >> 1) & 1;
	if (capa !== 1 || bri === 0 || bri === 15 || sri === 3 || ver === 1) {
		i++;
		continue;
	}
	sr = SR[ver][sri];
	const br = BR[ver === 3 ? 1 : 2][bri] * 1000;
	const len = Math.floor(((ver === 3 ? 144 : 72) * br) / sr) + pad;
	tramas.push({ i, len, t: mostras / sr });
	mostras += ver === 3 ? 1152 : 576;
	i += len;
}
const garda = tramas.filter((f) => f.t >= +t0 && f.t < +t1);
fs.writeFileSync(sortida, Buffer.concat(garda.map((f) => b.subarray(f.i, f.i + f.len))));
console.log(`${tramas.length} tramas (${(mostras / sr).toFixed(1)} s) ; gardadas ${garda.length}, ${(garda.length ? garda.at(-1).t - garda[0].t : 0).toFixed(2)} s, ${fs.statSync(sortida).size} octets`);
