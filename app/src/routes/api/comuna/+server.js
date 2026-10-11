// La ficha d'una comuna (retorn de Romain, 2026-10-11) : las chifras de
// Wikidata (CC0 : populacion e son annada, susfàcia, altitud, gentilici, fòto),
// las primièras frasas de l'article de Wikipèdia (CC BY-SA 4.0, citat e ligat)
// e l'autor e la licéncia de la fòto (Wikimedia Commons).
// Las demandas passan per nòstre servidor (Scaleway), pas pel navigador : l'IP
// dels visitaires va pas a Wikimedia. Responsas gardadas un jorn en memòria.
//
//   GET /api/comuna?i=30034&lang=oc            (còdi INSEE)
//   GET /api/comuna?nom=Montreux&lat=46.43&lon=6.91&lang=fr   (fòra de França)
import { json } from '@sveltejs/kit';

const UA = 'LoLigam/1.0 (https://loligam.eu ; carta de las lengas)';
const DURADA = 24 * 3600 * 1000;
const cache = new Map();
const legir = async (u) => {
	const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(6000) });
	return r.ok ? r.json() : null;
};
const W = 'https://www.wikidata.org/w/api.php?format=json&origin=*&';

// l'element Wikidata : pel còdi INSEE, o pel nom e lo ponch (lo pus pròche)
async function element({ i, nom, lat, lon }) {
	if (i && /^(\d[\dAB]\d{3})$/.test(i)) {
		const r = await legir(W + 'action=query&list=search&srlimit=1&srsearch=' + encodeURIComponent('haswbstatement:P374=' + i));
		return r?.query?.search?.[0]?.title ?? null;
	}
	if (!nom) return null;
	const r = await legir(W + 'action=wbsearchentities&type=item&limit=7&language=fr&search=' + encodeURIComponent(nom));
	const ids = (r?.search ?? []).map((s) => s.id);
	if (!ids.length) return null;
	const e = await legir(W + 'action=wbgetentities&props=claims&ids=' + ids.join('|'));
	let m = null,
		dm = 0.12;
	// (sonque una comuna : un còdi comunal de son país, pas una vila antica al meteis luòc)
	const CODIS = ['P374', 'P771', 'P439', 'P635', 'P772', 'P1567', 'P382', 'P1323'];
	for (const id of ids) {
		const cl = e?.entities?.[id]?.claims ?? {};
		const c = cl.P625?.[0]?.mainsnak?.datavalue?.value;
		if (!c || !CODIS.some((p) => cl[p])) continue;
		const d = Math.hypot(c.latitude - lat, (c.longitude - lon) * Math.cos((lat * Math.PI) / 180));
		if (d < dm) (dm = d), (m = id);
	}
	return m;
}

// la valor de la declaracion la mai recenta (o preferida)
function darrièra(cl) {
	if (!cl?.length) return null;
	const pref = cl.filter((x) => x.rank === 'preferred');
	const l = (pref.length ? pref : cl.filter((x) => x.rank !== 'deprecated')).map((x) => ({
		v: x.mainsnak?.datavalue?.value,
		an: +(x.qualifiers?.P585?.[0]?.datavalue?.value?.time?.slice(1, 5) ?? 0)
	}));
	return l.sort((a, b) => b.an - a.an)[0] ?? null;
}
const nombre = (v) => (v?.amount != null ? +v.amount : null);
const sensHtml = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// (doas o tres frasas, pas mai de 280 caractèrs)
function cort(t) {
	if (!t) return null;
	const frasas = t.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [t];
	let s = '';
	for (const f of frasas) {
		if ((s + f).length > 280 && s) break;
		s += f;
	}
	return s.trim();
}

async function ficha(q) {
	const id = await element(q);
	if (!id) return null;
	const e = (await legir(W + 'action=wbgetentities&props=claims|sitelinks|labels&languages=oc|fr&ids=' + id))?.entities?.[id];
	if (!e) return null;
	const C = e.claims ?? {};
	const pop = darrièra(C.P1082);
	const sup = darrièra(C.P2046);
	let km2 = nombre(sup?.v);
	if (km2 != null && sup.v.unit?.endsWith('/Q35852')) km2 /= 100; // (ectaras)
	const alt = nombre(darrièra(C.P2044)?.v);
	const gent = (C.P1549 ?? []).map((x) => x.mainsnak?.datavalue?.value).filter(Boolean);
	const gentilici = { oc: gent.find((g) => g.language === 'oc')?.text ?? null, fr: gent.find((g) => g.language === 'fr')?.text ?? null };
	const títol = { oc: e.sitelinks?.ocwiki?.title ?? null, fr: e.sitelinks?.frwiki?.title ?? null };
	const wiki = Object.fromEntries(Object.entries(títol).filter(([, t]) => t).map(([l, t]) => [l, `https://${l}.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`]));
	// las primièras frasas, dins cada lenga que l'article existís
	const extrach = {};
	for (const l of ['oc', 'fr']) {
		if (!títol[l]) continue;
		const r = await legir(`https://${l}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(títol[l].replace(/ /g, '_'))}`);
		if (r?.extract) extrach[l] = cort(r.extract);
	}
	// la fòto e sos crèdits
	let fòto = null;
	const img = C.P18?.[0]?.mainsnak?.datavalue?.value;
	if (img) {
		const r = await legir('https://commons.wikimedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=480&titles=' + encodeURIComponent('File:' + img));
		const ii = Object.values(r?.query?.pages ?? {})[0]?.imageinfo?.[0];
		// (las vinhetas venon de upload. o de thumb.wikimedia.org ; sens los paramètres de seguiment)
		const vinheta = ii?.thumburl ? ii.thumburl.replace(/\?.*$/, '') : null;
		if (vinheta && /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(vinheta))
			fòto = {
				url: '/api/comuna/foto?u=' + encodeURIComponent(vinheta),
				autor: sensHtml(ii.extmetadata?.Artist?.value) || null,
				licéncia: ii.extmetadata?.LicenseShortName?.value ?? null,
				pagina: ii.descriptionurl ?? null
			};
	}
	return {
		id,
		nom: { oc: e.labels?.oc?.value ?? null, fr: e.labels?.fr?.value ?? null },
		pop: pop ? { n: nombre(pop.v), an: pop.an || null } : null,
		km2,
		alt,
		gentilici,
		extrach,
		wiki,
		fòto
	};
}

export async function GET({ url, setHeaders }) {
	const q = {
		i: url.searchParams.get('i'),
		nom: url.searchParams.get('nom')?.slice(0, 80),
		lat: +url.searchParams.get('lat'),
		lon: +url.searchParams.get('lon')
	};
	const clau = JSON.stringify(q);
	let c = cache.get(clau);
	if (!c || Date.now() - c.t > DURADA) {
		let d = null;
		try {
			d = await ficha(q);
		} catch {
			d = null;
		}
		c = { t: Date.now(), d };
		if (cache.size > 2000) cache.delete(cache.keys().next().value);
		cache.set(clau, c);
	}
	setHeaders({ 'cache-control': 'public, max-age=86400' });
	return json(c.d ?? { id: null });
}
