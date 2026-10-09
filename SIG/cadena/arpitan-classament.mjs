// Classament de las comunas del domeni arpitan : domeni, dialècte, parlar
// (decisions de Romain del 2026-10-09 : sorsas « A + 1 », 7 dialèctes e 18
// parlars, linha occitana e asclas sus la bendas de contacte, Oisans arpitan).
//
//   node SIG/cadena/arpitan-classament.mjs
//
// Entradas : SIG/brut/arpitan/parts-comunas.json (arpitan-carta.cjs),
// bailliages.json (arpitan-bailliages.py), SIG/arpitan/ofs-regions-linguisticas.csv (OFS,
// regions lingüisticas 2020 per comuna, estat del 2026-01-01).
// Sortida : SIG/arpitan/dialectes-arpitan.csv (vejatz SIG/arpitan/FONTS.md).
//
// Règlas, per país :
//  - França : comuna arpitana se la mitat de sa susfàcia es dins la carta
//    d'arpitania.eu ; se es tanben dins lo domeni occitan de la carta, demòra
//    occitana e ven « transicion » (asclas) ; las comunas de las montanhas
//    d'Isèra e de Savòia que cap de las doas cartas cobrís (Oisans) son
//    arpitanas. Parlar : país istoric (bailliatge de 1789, Brette), departament
//    per la Franche-Comté, arrondiment de Roana pel roanés, Savòia entièra en savoiard.
//  - Soïssa : las comunas de lenga francesa (OFS) de Genèva, Vaud, Neuchâtel,
//    Friborg e Valés ; parlar = canton.
//  - Itàlia : Val d'Aosta levat las tres comunas walser ; Piemont : comunas
//    declaradas per la lei 482 (lista de la Region) e comunas de las meteissas
//    valadas, coma per las valadas occitanas ; Faeto e Celle di San Vito.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const B = path.join(RAIC, 'SIG/brut/arpitan');
const parts = JSON.parse(fs.readFileSync(path.join(B, 'parts-comunas.json'), 'utf8'));
const bail = JSON.parse(fs.readFileSync(path.join(B, 'bailliages.json'), 'utf8'));
const ofs = new Map(fs.readFileSync(path.join(RAIC, 'SIG/arpitan/ofs-regions-linguisticas.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')).map((r) => [r[1], r]));

// parlar -> dialècte
const PARLARS = {
	'liyonês': 'lyonnais', 'forésien': 'lyonnais', 'rouanês': 'lyonnais', 'biôjolês': 'lyonnais', 'mâconês': 'lyonnais', 'brionês-charolês': 'lyonnais',
	'brêssan': 'bressan_jurassien', 'dombisto': 'bressan_jurassien', 'bugisto': 'bressan_jurassien', 'jurassien': 'bressan_jurassien', 'burgondan': 'bressan_jurassien',
	'dârfenouès': 'dauphinois',
	'savoyârd': 'savoyard', 'genevês': 'savoyard',
	'vôdouès': 'romand', 'friborgês': 'romand', 'nôchâtelês': 'romand',
	'valêsan': 'alpin', 'vâldoten': 'alpin', 'valadas': 'alpin', 'vâlsoanin': 'alpin',
	'faétâre': 'faetar'
};
// parlars de transicion cap a l'oïl (Vouiquipèdia : « dialèctes de passâjo »)
const PASSATGE = new Set(['mâconês', 'brionês-charolês']);

const BAIL_PARLAR = {
	GEX: 'genevês', 'BOURG-EN-BRESSE': 'brêssan', 'CHALON-SUR-SAONE': 'brêssan', BELLEY: 'bugisto', TREVOUX: 'dombisto',
	LYON: 'liyonês', 'VILLEFRANCHE-DE-BEAUJOLAIS': 'biôjolês', FOREZ: 'forésien', 'BOURG-ARGENTAL': 'forésien',
	MACON: 'mâconês', CHAROLLES: 'brionês-charolês', 'SEMUR-EN-BRIONNOIS': 'brionês-charolês',
	AUTUN: 'brionês-charolês', MONTCENIS: 'brionês-charolês', 'BOURBON-LANCY': 'brionês-charolês',
	VIENNE: 'dârfenouès', GRENOBLE: 'dârfenouès', ROMANS: 'dârfenouès', VALENCE: 'dârfenouès', MONTELIMAR: 'dârfenouès',
	// tres comunas de l'Ain dins un bailliatge comtés (Revermont)
	ORGELET: 'jurassien',
	// nòrd de l'Ardècha (Anonai) e de la Nauta Léger : costat del Forés (de verificar)
	'HAUT-VIVARAIS': 'forésien', 'BAS-VIVARAIS': 'forésien', 'LE PUY-EN-VELAY': 'forésien'
};
function parlarFr(insee, dep) {
	if (dep === '73' || dep === '74') return 'savoyârd';
	if (dep === '25') return 'burgondan';
	if (dep === '39') return 'jurassien';
	const [b, , arr] = bail[insee] || [];
	if (arr === '422') return 'rouanês';
	return BAIL_PARLAR[b] ?? null;
}

// Piemont (lei 482 : Region Piemont, « Comuni piemontesi appartenenti a ciascuna
// minoranza linguistica », SIG/arpitan/piemont-482.pdf)
const DECLARADAS = ['Ala di Stura', 'Alpette', 'Avigliana', 'Balme', 'Cantoira', 'Carema', 'Castagnole Piemonte', 'Ceres', 'Ceresole Reale', 'Chialamberto', 'Chianocco', 'Coassolo Torinese', 'Coazze', 'Condove', 'Corio', 'Frassinetto', 'Germagnano', 'Giaglione', 'Giaveno', 'Gravere', 'Groscavallo', 'Ingria', 'Lanzo Torinese', 'Lemie', 'Locana', 'Mattie', 'Meana di Susa', 'Mezzenile', 'Mompantero', 'Monastero di Lanzo', 'Moncenisio', 'Noasca', 'Novalesa', 'Pessinetto', 'Pont Canavese', 'Ribordone', 'Ronco Canavese', 'Rubiana', 'San Giorio di Susa', "Sant'Antonino di Susa", 'Sparone', 'Susa', 'Traves', 'Usseglio', 'Vaie', 'Valgioie', 'Valprato Soana', 'Venaus', 'Villar Focchiardo', 'Viù'];
// comunas pas declaradas mas dins las meteissas valadas (bassa val de Susa)
const VALADA_NON_DECLARADAS = ['Bussoleno', 'Bruzolo', 'San Didero', 'Borgone Susa', 'Caprie', 'Chiusa di San Michele'];
// declaradas a la sortida de las valadas, defòra de la carta : asclas (coma
// las comunas declaradas occitanas de parlar piemontés)
const SORTIDA = { Avigliana: 'au débouché de la vallée de Suse', Giaveno: 'au débouché du val Sangone' };
// declarada mas en plana, luènh de las valadas : defòra (coma Barge per l'occitan)
const PLANA = ['Castagnole Piemonte'];
const SOANA = ['Ingria', 'Ronco Canavese', 'Valprato Soana'];
const WALSER = ['Gressoney-La-Trinité', 'Gressoney-Saint-Jean', 'Issime'];
const CANTON_PARLAR = { 'CH-GE': 'genevês', 'CH-VD': 'vôdouès', 'CH-NE': 'nôchâtelês', 'CH-FR': 'friborgês', 'CH-VS': 'valêsan' };
const DEP = { '01': 'Ain', '07': 'Ardèche', '25': 'Doubs', '26': 'Drôme', '38': 'Isère', '39': 'Jura', '42': 'Loire', '43': 'Haute-Loire', '69': 'Rhône', '71': 'Saône-et-Loire', '73': 'Savoie', '74': 'Haute-Savoie' };

const linhas = [];
const L = (o) => linhas.push(o);
const vistas = new Set();
for (const r of parts) {
	const base = { part_carta: r.arp, part_oc: r.occ };
	if (r.src === 'comunas-fr') {
		const parl = parlarFr(r.id, r.dep);
		const u = { regio: 'France', unitat: DEP[r.dep], mena: 'comuna_fr', nom_oficial: r.nom, codi: r.id, ...base };
		const b = (bail[r.id] || [])[0];
		const fontP = r.dep === '73' || r.dep === '74' ? 'SAV' : ['25', '39'].includes(r.dep) ? 'DEP' : (bail[r.id] || [])[2] === '422' ? 'ARR' : 'BRETTE';
		if (r.arp >= 0.5 && r.occ >= 0.5) L({ ...u, domeni: 'occitan', dialecte: PARLARS[parl] ?? '', parlar: parl ?? '', transicio: 'oc', nota: `Dans le domaine occitan de la carte (Occitanica) et dans celui d'arpitania.eu : parler de transition, hachuré.${b ? ' Bailliage : ' + b + '.' : ''}`, font: `ARP OCC ${fontP}` });
		else if (r.arp < 0.5 && r.occ < 0.5 && ['38', '73', '74'].includes(r.dep)) L({ ...u, domeni: 'arpitan', dialecte: PARLARS[parl], parlar: parl, transicio: '', nota: "Oisans et Arves : couvert par aucune des deux cartes ; rattaché à l'arpitan pour fermer le trou (décision de Romain, 2026-10-09).", font: `ARP ${fontP}` });
		else if (r.arp >= 0.5) L({ ...u, domeni: 'arpitan', dialecte: PARLARS[parl] ?? '?', parlar: parl ?? '?', transicio: PASSATGE.has(parl) ? 'oil' : '', nota: parl ? (PASSATGE.has(parl) ? "Parler de passage vers l'oïl (Vouiquipèdia)." : '') : `Bailliage ${b} : parler à classer.`, font: `ARP ${fontP}` });
		else if (r.arp > 0) L({ ...u, domeni: 'exclos', dialecte: '', parlar: '', transicio: '', nota: `Bordure : ${Math.round(r.arp * 100)} % de la commune dans la carte arpitania.eu.${r.occ >= 0.5 ? ' Occitane.' : ''}`, font: 'ARP' });
		continue;
	}
	if (r.src === 'soissa-comunas') {
		if (+r.id >= 9000) continue; // parts cantonalas de lacs
		const o = ofs.get(r.id);
		const u = { regio: 'Suisse', unitat: r.dep, mena: 'comuna_ch', nom_oficial: r.nom, codi: 'ofs:' + r.id, ...base };
		if (o && o[6] === '2') L({ ...u, domeni: 'arpitan', dialecte: PARLARS[CANTON_PARLAR[r.dep]], parlar: CANTON_PARLAR[r.dep], transicio: '', nota: '', font: 'OFS' });
		else L({ ...u, domeni: 'exclos', dialecte: '', parlar: '', transicio: '', nota: o ? 'Commune de langue allemande (OFS).' : 'Absente de la liste OFS (forêt domaniale) : rangée avec ses voisines de langue allemande.', font: 'OFS' });
		continue;
	}
	if (r.src === 'val-d-aosta-comunas') {
		const u = { regio: 'Italie', unitat: "Vallée d'Aoste", mena: 'comuna_it', nom_oficial: r.nom, codi: 'istat:' + r.id, ...base };
		if (WALSER.includes(r.nom)) L({ ...u, domeni: 'exclos', dialecte: '', parlar: '', transicio: '', nota: 'Commune walser (allemand), statut de la Vallée d’Aoste.', font: 'VDA' });
		else L({ ...u, domeni: 'arpitan', dialecte: 'alpin', parlar: 'vâldoten', transicio: '', nota: '', font: 'VDA' });
		continue;
	}
	if (r.src === 'piemont-comunas' || r.src === 'piemont-extra-comunas') {
		const u = { regio: 'Italie', unitat: 'Piémont', mena: 'comuna_it', nom_oficial: r.nom, codi: 'istat:' + r.id, ...base };
		vistas.add(r.nom);
		const parl = SOANA.includes(r.nom) ? 'vâlsoanin' : 'valadas';
		if (SORTIDA[r.nom]) L({ ...u, domeni: 'arpitan', dialecte: 'alpin', parlar: parl, transicio: 'pms', nota: `Déclarée arpitane (loi 482), ${SORTIDA[r.nom]}, hors de la carte arpitania.eu : hachurée, parler à vérifier (piémontais ?).`, font: 'L482 ARP' });
		else if (DECLARADAS.includes(r.nom)) L({ ...u, domeni: 'arpitan', dialecte: 'alpin', parlar: parl, transicio: '', nota: '', font: 'L482' });
		else if (VALADA_NON_DECLARADAS.includes(r.nom)) L({ ...u, domeni: 'arpitan', dialecte: 'alpin', parlar: parl, transicio: '', nota: 'Non déclarée (loi 482) mais dans la basse vallée de Suse, entre des communes déclarées ; dans la carte arpitania.eu.', font: 'ARP' });
		else if (r.arp > 0 && r.occ < 0.5) L({ ...u, domeni: 'exclos', dialecte: '', parlar: '', transicio: '', nota: `Non déclarée ; ${Math.round(r.arp * 100)} % dans la carte arpitania.eu.`, font: 'L482 ARP' });
		continue;
	}
	if (r.src === 'polha-comunas') L({ regio: 'Italie', unitat: 'Pouilles', mena: 'comuna_it', nom_oficial: r.nom, codi: 'istat:' + r.id, ...base, domeni: 'arpitan', dialecte: 'faetar', parlar: 'faétâre', transicio: '', nota: 'Îlot arpitan des Pouilles (loi 482).', font: 'L482 VQ' });
}
// Montanha borbonesa (Alèir) : las fonts se contradison (comunas arpitanas
// per la Wikipèdia francesa, occitan influenciat per l'arpitan per l'anglesa) ;
// decision de Romain (2026-10-09) : benda de transicion, coma Ardècha e Dròma
// (domeni occitan, asclas). Comunas que tòcan l'arpitan, levat lo Borbonés d'oïl al nòrd.
const MONTANHA = { '03006': 'Arfeuilles', '03050': 'La Chabanne', '03066': 'Châtel-Montagne', '03113': 'Ferrières-sur-Sichon', '03125': 'La Guillermie', '03139': 'Laprugne', '03141': 'Lavoine', '03248': 'Saint-Nicolas-des-Biefs' };
for (const [codi, nom] of Object.entries(MONTANHA))
	L({ regio: 'France', unitat: 'Allier', mena: 'comuna_fr', nom_oficial: nom, codi, part_carta: '', part_oc: '', domeni: 'occitan', dialecte: 'lyonnais', parlar: 'rouanês', transicio: 'oc', nota: "Montagne bourbonnaise : arpitan pour Wikipédia (fr), occitan influencé par l'arpitan pour Wikipedia (en) ; dans le domaine occitan, hachurée (décision de Romain, 2026-10-09).", font: 'VQ OCC' });
for (const n of PLANA) L({ regio: 'Italie', unitat: 'Piémont', mena: 'comuna_it', nom_oficial: n, codi: '', part_carta: '', part_oc: '', domeni: 'exclos', dialecte: '', parlar: '', transicio: '', nota: 'Déclarée arpitane (loi 482) mais en plaine, loin des vallées : laissée de côté, comme Barge pour l’occitan.', font: 'L482' });
const manca = [...DECLARADAS, ...VALADA_NON_DECLARADAS].filter((n) => !vistas.has(n) && !PLANA.includes(n));
if (manca.length) console.log('comunas piemontesas sens contorn :', manca);

const COLS = ['regio', 'unitat', 'mena', 'nom_oficial', 'codi', 'domeni', 'dialecte', 'parlar', 'transicio', 'part_carta', 'part_oc', 'nota', 'font'];
fs.writeFileSync(path.join(RAIC, 'SIG/arpitan/dialectes-arpitan.csv'), COLS.join(';') + '\n' + linhas.map((l) => COLS.map((c) => String(l[c] ?? '').replace(/;/g, ',')).join(';')).join('\n') + '\n');

const comptar = (f) => linhas.reduce((o, l) => { const k = f(l); o[k] = (o[k] || 0) + 1; return o; }, {});
console.log(linhas.length, 'linhas');
console.log(comptar((l) => `${l.regio} ${l.domeni}`));
console.log(comptar((l) => (l.domeni === 'arpitan' ? `${l.dialecte} / ${l.parlar}${l.transicio ? ' (' + l.transicio + ')' : ''}` : l.domeni === 'occitan' ? 'transicion oc : ' + l.parlar : 'exclos')));
