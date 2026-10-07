// Aplica los noms occitans de las taulas SIG/provincias/noms-oc.csv e
// SIG/natura/noms-parcs-oc.csv a las donadas de la carta (provincias-1789.json,
// parcs.json). Las taulas son la referéncia : Romain las corregís, puèi
// « node SIG/cadena/noms-oc-jaces.mjs » torna aplicar. Repetible.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const SIG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.resolve(SIG, '../app/static/data');
const legir = (f) =>
	fs
		.readFileSync(f, 'utf8')
		.replace(/^﻿/, '')
		.split(/\r?\n/)
		.filter((l) => l.trim())
		.slice(1)
		.map((l) => l.split(';'));
const aplicar = (fichièr, taula, clau) => {
	const d = JSON.parse(fs.readFileSync(fichièr, 'utf8'));
	let n = 0;
	for (const f of d.features) {
		const oc = taula.get(f.properties[clau]);
		if (oc && f.properties.oc !== oc) {
			f.properties.oc = oc;
			n++;
		}
	}
	fs.writeFileSync(fichièr, JSON.stringify(d));
	const mancan = d.features.filter((f) => !f.properties.oc).map((f) => f.properties.fr);
	console.log(path.basename(fichièr), n, 'noms aplicats ;', mancan.length ? 'sens nom occitan : ' + [...new Set(mancan)].join(', ') : 'totes an un nom occitan');
};
aplicar(path.join(DATA, 'provincias-1789.json'), new Map(legir(path.join(SIG, 'provincias/noms-oc.csv')).map(([kod, , oc]) => [kod, oc])), 'kod');
aplicar(path.join(DATA, 'parcs.json'), new Map(legir(path.join(SIG, 'natura/noms-parcs-oc.csv')).map(([fr, oc]) => [fr, oc])), 'fr');
