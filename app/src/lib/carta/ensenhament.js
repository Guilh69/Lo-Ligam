// La jaça « Ensenhament » (decision de Romain, 2026-10-23, cahièr §11) : las
// escòlas, collègis, licèus e universitats ont s'apren l'occitan, levat de las
// Calandretas (qu'an lor jaça). Donadas : SIG/cadena/ensenhament.py, que
// fabrica /data/ensenhament.json (format compacte : un tablèu per ponch,
// [lon, lat, nivèl, nom, comuna, forma, formacions]). Notícia e fonts :
// SIG/ensenhament/LEGIR-ME.md.

const OPLO = 'https://umap.openstreetmap.fr/fr/map/actors-de-terren-siti_1186246';

const TÈXTES = {
	oc: {
		nivèl: {
			b: 'Escòla bilingüa (paritat oraria)',
			r: "Escòla : 3 oras d'occitan per setmana",
			s: 'Escòla : sensibilizacion (de 30 min a 1 h 30 per setmana)',
			c: 'Collègi',
			l: 'Licèu',
			u: 'Ensenhament superior',
			a: "Val d'Aran : l'aranés es la lenga d'ensenhament"
		},
		forma: { opcion: "opcion d'occitan", dnl: 'una matèria ensenhada en occitan', seccion: 'seccion bilingüa', LLCER: 'especialitat LLCER occitan', LVB: 'occitan en LVB', LVC: 'occitan en LVC', lvr: 'lenga regionala en classa' },
		associacion: (a) => "per l'associacion " + a,
		font: 'Font',
		oplo: "carta de l'OPLO « Actors de terren » (2024-2025)",
		fontsSup: "Parcoursup, Mon Master e la carta de l'OPLO",
		fontAran: 'Generalitat de Catalunya'
	},
	fr: {
		nivèl: {
			b: "École bilingue (autant d'heures en occitan qu'en français)",
			r: "École : 3 heures d'occitan par semaine",
			s: 'École : sensibilisation (de 30 min à 1 h 30 par semaine)',
			c: 'Collège',
			l: 'Lycée',
			u: 'Enseignement supérieur',
			a: "Val d'Aran : l'aranais est la langue d'enseignement"
		},
		forma: { opcion: "option d'occitan", dnl: 'une matière enseignée en occitan', seccion: 'section bilingue', LLCER: 'spécialité LLCER occitan', LVB: 'occitan en LVB', LVC: 'occitan en LVC', lvr: 'langue régionale en classe' },
		associacion: (a) => "par l'association " + a,
		font: 'Source',
		oplo: "carte de l'OPLO « Actors de terren » (2024-2025)",
		fontsSup: "Parcoursup, Mon Master et la carte de l'OPLO",
		fontAran: 'Generalitat de Catalunya'
	}
};

// Los ponches de la jaça : una pastilha per l'ensenhament regular, un ponch
// pichon per la sensibilizacion (mens d'oras, sonque relevada dins las
// acadèmias de Tolosa e de Montpelhièr)
export function ponchesEnsenhament(ponches, { L, lang, iconaPunt, dobleClicSus, accionsNav, escapeHtml, comunaOc }) {
	const t = TÈXTES[lang] ?? TÈXTES.oc;
	const fr = lang === 'fr';
	return ponches.map(([lon, lat, n, nom, comuna, forma = '', formacions = '']) => {
		const fs = forma ? forma.split(' ') : [];
		let detalh = '';
		if (n === 'c' || n === 'l') {
			detalh = fs.map((f) => t.forma[f] ?? f).join(', ') || 'occitan';
		} else if (n === 's') {
			detalh = fs.map((f) => (f.startsWith('@') ? t.associacion(f.slice(1)) : (t.forma[f] ?? f))).join(', ');
		} else if (n === 'a') {
			detalh = fs.join(', ');
		}
		const lista = n === 'u' ? '<ul class="lista-bulla">' + formacions.split(' | ').map((f) => `<li>${escapeHtml(f)}</li>`).join('') + '</ul>' : '';
		const font =
			n === 'u' ? escapeHtml(t.fontsSup) : n === 'a' ? escapeHtml(t.fontAran) : `<a href="${OPLO}" target="_blank" rel="noopener">${escapeHtml(t.oplo)}</a>`;
		const cap =
			`<strong>${escapeHtml(nom)}</strong><br>${escapeHtml(fr ? comuna : comunaOc(comuna))}` +
			`<br>${escapeHtml(t.nivèl[n] ?? '')}${detalh ? ' : ' + escapeHtml(detalh) : ''}` +
			(lista || '<br>') +
			`<small>${t.font} : ${font}</small>`;
		const icon = iconaPunt('ensenhament');
		if (n === 's') icon.options.className += ' ponch-pichon';
		return dobleClicSus(L.marker([lat, lon], { icon, title: nom, keyboard: true }).bindPopup(cap + `<span class="accions-bulla">${accionsNav(lat, lon, nom + ' ' + comuna)}</span>`));
	});
}
