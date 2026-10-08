// La Pichona Gavachariá (retorn de Romain, 2026-10-08) : l'illòt de lenga
// d'oïl (saintongés) a l'entorn de Montségur a desaparegut dins la segonda
// mitat del sègle XX, jos l'influéncia del gascon puèi del francés (Wikipèdia,
// « Petite Gavacherie »). Lo domeni occitan i es pas pus traucat : lo gascon
// cobrís la zòna, e una zòna particulara (rajada, explicada al survòl) ne
// garda la memòria.
// Aqueste escript s'aplica APRÈP domeni.mjs (limits-carta.json) e mixtas.py
// (zonas-mixtas.geojson) ; se pòt tornar lançar sens risc.
// Usatge : node SIG/cadena/gavacharia.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app/static/data');

// la bóstia de l'ancian illòt (lon, lat)
const BB = [-0.11, 44.52, 0.23, 44.76];
const dins = (a) => a.every(([x, y]) => x >= BB[0] && x <= BB[2] && y >= BB[1] && y <= BB[3]);

// 1. lo domeni : l'anèl de l'illòt e sa linha de frontièra levats
const pL = path.join(DATA, 'limits-carta.json');
const L = JSON.parse(fs.readFileSync(pL, 'utf8'));
const n0 = [L.domeni.anels.length, L.domeni.linhas.length];
L.domeni.anels = L.domeni.anels.filter((a) => !dins(a));
L.domeni.linhas = L.domeni.linhas.filter((l) => !dins(l));
fs.writeFileSync(pL, JSON.stringify(L));
console.log('domeni : anèls', n0[0], '→', L.domeni.anels.length, '; linhas', n0[1], '→', L.domeni.linhas.length);

// 2. la zòna : d'enclava a zòna particulara, amb son nom sus la carta
const pZ = path.join(DATA, 'zonas-mixtas.geojson');
const Z = JSON.parse(fs.readFileSync(pZ, 'utf8'));
for (const f of Z.features) {
	const p = f.properties;
	if (p.kod !== 'enc-gavacharia' && p.kod !== 'mix-gavacharia') continue;
	Object.assign(p, {
		kod: 'mix-gavacharia',
		mena: 'mixta',
		oc: 'La Pichona Gavachariá',
		fr: 'La Petite Gavacherie',
		// (occitan propausat per Claude, de validar per Romain)
		sota_oc: "ancian illòt de lenga d'oïl (saintongés), del sègle XV al sègle XX",
		sota_fr: "ancien îlot de langue d'oïl (saintongeais), du XVe au XXe siècle",
		etiqueta: { oc: 'Pichona Gavachariá', fr: 'Petite Gavacherie' }
	});
	console.log('zòna :', p.kod, p.mena);
}
fs.writeFileSync(pZ, JSON.stringify(Z));
