// Los noms occitans escartats de las comunas (decision de Romain, 2026-11-12 :
// « Masque-les », audit de la carta, M3 e M4) : un nom francés a pena retocat
// (« Sant Fortunat sur Eyrieux ») o lo nom d'una comuna vesina (Ambès escrich
// « Ambarés e La Grava »). La comuna es alara tractada coma sens forma occitana
// coneguda : pas de nom sus la carta occitana, lo nom francés en interfàcia
// francesa, totjorn trobabla per la recèrca. Res es pas inventat a la plaça ;
// la forma atestada se cercarà mai tard.
//
//   node SIG/cadena/comunas-escartar.mjs
//
// La lista : SIG/comunas/noms-escartats.csv (i ; fr ; oc_escartat ; motiu).
// comunas.mjs la legís tanben (etapa 4) : una cadena tornada lançar balha lo
// meteis resultat. Aqueste escript aplica la lista als fichièrs ja fabricats
// (app/static/data/comunas/<dep>.json), sens tornar telecargar res ; aprèp :
// node SIG/cadena/comunas-noms.mjs (l'indèx noms.json).
// Segur : una comuna que son nom occitan es pas pus lo de la lista (corregit
// dempuèi) es daissada tala coma es, e senhalada.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
const LISTA = path.resolve(CADENA, '../comunas/noms-escartats.csv');
const DIR = path.resolve(CADENA, '../../app/static/data/comunas');

// (la meteissa lectura dins comunas.mjs)
export function legirEscartats(fichièr = LISTA) {
	const m = new Map();
	if (!fs.existsSync(fichièr)) return m;
	const linhas = fs.readFileSync(fichièr, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
	for (const l of linhas.slice(1)) {
		const [i, fr, oc, motiu] = l.split(';');
		if (i) m.set(i.trim(), { fr, oc, motiu });
	}
	return m;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const escartats = legirEscartats();
	const index = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'));
	const vistas = new Set();
	let fachas = 0;
	for (const { d } of index.deps) {
		const f = path.join(DIR, d + '.json');
		const topo = JSON.parse(fs.readFileSync(f, 'utf8'));
		let cambiat = false;
		for (const g of Object.values(topo.objects)[0].geometries) {
			const q = g.properties;
			const e = q && escartats.get(q.i);
			if (!e) continue;
			vistas.add(q.i);
			if (q.oc == null) console.log(`  ${q.i} ${q.fr} : ja sens nom occitan`);
			else if (q.oc !== e.oc) console.log(`  ${q.i} ${q.fr} : nom actual « ${q.oc} », pas lo de la lista (« ${e.oc} ») : daissat`);
			else {
				delete q.oc;
				cambiat = true;
				fachas++;
				console.log(`  ${q.i} ${q.fr} : « ${e.oc} » escartat (${e.motiu})`);
			}
		}
		if (cambiat) fs.writeFileSync(f, JSON.stringify(topo));
	}
	for (const [i, e] of escartats) if (!vistas.has(i)) console.log(`  ${i} ${e.fr} : comuna pas trobada`);
	console.log(`${fachas} nom(s) escartat(s) sus ${escartats.size} dins la lista`);
}
