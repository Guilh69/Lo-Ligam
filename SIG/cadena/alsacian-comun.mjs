// Alsacian e francic : foncions comunas (lectura CSV, noms de comunas francesas -> INSEE).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CADENA = path.dirname(fileURLToPath(import.meta.url));
export const BRUT = path.resolve(CADENA, '../brut/alsacian');
export const csv = (f, sep = ';') => {
	const [t, ...l] = fs.readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/).map((x) => x.split(sep));
	return l.map((r) => Object.fromEntries(t.map((k, i) => [k, r[i]])));
};
export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s*\((moselle|bas-rhin|haut-rhin|elsass)\)\s*$/, '').replace(/[-'’ ]+/g, ' ').replace(/\bsaint\b/g, 'st').replace(/\bsainte\b/g, 'ste').trim();

let perNom = null;
function index() {
	perNom = {};
	const comunas = JSON.parse(fs.readFileSync(path.join(BRUT, 'comunas-fr.geojson'), 'utf8')).features.map((f) => f.properties);
	for (const c of comunas) (perNom[norm(c.nom)] ??= []).push(c.codi);
	for (const d of csv(path.join(BRUT, 'comunas-fr-delegadas.csv'))) (perNom[norm(d.nom)] ??= []).push(d.insee_comuna);
}
export function insee(nom, deps = ['57', '67', '68']) {
	if (!perNom) index();
	return [...new Set((perNom[norm(nom)] || []).filter((i) => deps.includes(i.slice(0, 2))))];
}
