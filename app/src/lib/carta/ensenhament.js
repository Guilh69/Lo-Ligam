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
		fontAran: 'Generalitat de Catalunya',
		dp: ' :',
		occitan: 'occitan'
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
		fontAran: 'Generalitat de Catalunya',
		dp: ' :',
		occitan: 'occitan'
	},
	es: {
		nivèl: {
			b: 'Escuela bilingüe (mismo número de horas en occitano y en francés)',
			r: 'Escuela: 3 horas de occitano por semana',
			s: 'Escuela: sensibilización (de 30 min a 1 h 30 por semana)',
			c: 'Colegio',
			l: 'Liceo',
			u: 'Enseñanza superior',
			a: 'Valle de Arán: el aranés es la lengua de enseñanza'
		},
		forma: { opcion: 'opción de occitano', dnl: 'una materia impartida en occitano', seccion: 'sección bilingüe', LLCER: 'especialidad LLCER occitano', LVB: 'occitano en LVB', LVC: 'occitano en LVC', lvr: 'lengua regional en el aula' },
		associacion: (a) => 'por la asociación ' + a,
		font: 'Fuente',
		oplo: 'mapa de la OPLO « Actors de terren » (2024-2025)',
		fontsSup: 'Parcoursup, Mon Master y el mapa de la OPLO',
		fontAran: 'Generalitat de Catalunya',
		dp: ':',
		occitan: 'occitano'
	},
	en: {
		nivèl: {
			b: 'Bilingual school (as many hours in Occitan as in French)',
			r: 'School: 3 hours of Occitan a week',
			s: 'School: awareness-raising (from 30 min to 1 h 30 a week)',
			c: 'Middle school',
			l: 'High school',
			u: 'Higher education',
			a: 'Aran Valley: Aranese is the language of teaching'
		},
		forma: { opcion: 'Occitan option', dnl: 'one subject taught in Occitan', seccion: 'bilingual section', LLCER: 'LLCER specialism in Occitan', LVB: 'Occitan as LVB', LVC: 'Occitan as LVC', lvr: 'regional language in class' },
		associacion: (a) => 'by the association ' + a,
		font: 'Source',
		oplo: 'OPLO map “Actors de terren” (2024-2025)',
		fontsSup: 'Parcoursup, Mon Master and the OPLO map',
		fontAran: 'Generalitat de Catalunya',
		dp: ':',
		occitan: 'Occitan'
	},
	ca: {
		nivèl: {
			b: 'Escola bilingüe (tantes hores en occità com en francès)',
			r: "Escola: 3 hores d'occità per setmana",
			s: 'Escola: sensibilització (de 30 min a 1 h 30 per setmana)',
			c: 'Col·legi',
			l: 'Liceu',
			u: 'Ensenyament superior',
			a: "Vall d'Aran: l'aranès és la llengua d'ensenyament"
		},
		forma: { opcion: "opció d'occità", dnl: 'una matèria ensenyada en occità', seccion: 'secció bilingüe', LLCER: 'especialitat LLCER occità', LVB: 'occità en LVB', LVC: 'occità en LVC', lvr: 'llengua regional a classe' },
		associacion: (a) => "per l'associació " + a,
		font: 'Font',
		oplo: 'mapa de l’OPLO « Actors de terren » (2024-2025)',
		fontsSup: 'Parcoursup, Mon Master i el mapa de l’OPLO',
		fontAran: 'Generalitat de Catalunya',
		dp: ':',
		occitan: 'occità'
	}
};

// Cada nivèl dins sa jaça de la familha Ensenhament (demanda de Romain,
// 2026-10-23) ; lo Val d'Aran : las escòlas amb las bilingüas, l'institut amb
// los collègis e licèus
const JAÇA = { b: 'ensBilingue', r: 'ensEscola', s: 'ensEscola', c: 'ensSegond', l: 'ensSegond', u: 'ensSuperior' };
const jaçaDe = (n, forma) => (n === 'a' ? (/ESO|batxillerat|FP/.test(forma) ? 'ensSegond' : 'ensBilingue') : JAÇA[n]);

// Los ponches : una pastilha per l'ensenhament regular, un ponch pichon per la
// sensibilizacion (mens d'oras, sonque relevada dins las acadèmias de Tolosa e
// de Montpelhièr). Torna { idJaça: [ponches] }
export function ponchesEnsenhament(ponches, { L, lang, iconaPunt, dobleClicSus, accionsNav, escapeHtml, comunaOc }) {
	const t = TÈXTES[lang] ?? TÈXTES.oc;
	const fr = lang === 'fr';
	const jaces = { ensBilingue: [], ensEscola: [], ensSegond: [], ensSuperior: [] };
	for (const [lon, lat, n, nom, comuna, forma = '', formacions = ''] of ponches) {
		const fs = forma ? forma.split(' ') : [];
		let detalh = '';
		if (n === 'c' || n === 'l') {
			detalh = fs.map((f) => t.forma[f] ?? f).join(', ') || t.occitan;
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
			`<br>${escapeHtml(t.nivèl[n] ?? '')}${detalh ? t.dp + ' ' + escapeHtml(detalh) : ''}` +
			(lista || '<br>') +
			`<small>${t.font}${t.dp} ${font}</small>`;
		const id = jaçaDe(n, forma);
		const icon = iconaPunt(id);
		if (n === 's') icon.options.className += ' ponch-pichon';
		jaces[id].push(dobleClicSus(L.marker([lat, lon], { icon, title: nom, keyboard: true }).bindPopup(cap + `<span class="accions-bulla">${accionsNav(lat, lon, nom + ' ' + comuna)}</span>`)));
	}
	return jaces;
}

// Los corses per adults : las associacions de la jaça dels cercles que ne
// donan (cercles.geojson, k: 1 ; SIG/cercles)
// (les mots de la bulle des cours pour adultes)
const TÈXTES_CORS = {
	oc: { titol: "Corses d'occitan per adults", font: 'Font : jaça « Cercles e associacions »' },
	fr: { titol: "Cours d'occitan pour adultes", font: 'Source : couche « Cercles et associations »' },
	es: { titol: 'Clases de occitano para adultos', font: 'Fuente: capa « Círculos y asociaciones »' },
	en: { titol: 'Occitan classes for adults', font: 'Source: layer “Circles and associations”' },
	ca: { titol: "Classes d'occità per a adults", font: 'Font: capa « Cercles i associacions »' }
};
export function ponchesCorses(features, { L, lang, iconaPunt, dobleClicSus, accionsNav, escapeHtml }) {
	const fr = lang === 'fr'; // (noms de comunas seulement)
	const tc = TÈXTES_CORS[lang] ?? TÈXTES_CORS.oc;
	return features
		.filter((f) => f.properties.k)
		.map((f) => {
			const [lon, lat] = f.geometry.coordinates;
			const q = f.properties;
			const cap =
				`<strong>${escapeHtml(q.n)}</strong><br>${escapeHtml(fr ? q.c : (q.o ?? q.c))}` +
				`<br>${tc.titol}` +
				`<br><small>${tc.font}</small>`;
			return dobleClicSus(L.marker([lat, lon], { icon: iconaPunt('corsAdults'), title: q.n, keyboard: true }).bindPopup(cap + `<span class="accions-bulla">${accionsNav(lat, lon, q.n + ' ' + q.c)}</span>`));
		});
}
