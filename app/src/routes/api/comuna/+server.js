// La ficha d'una comuna (retorn de Romain, 2026-10-11) : las chifras de
// Wikidata (CC0 : populacion e son annada, susfàcia, altitud, gentilici, fòto),
// las primièras frasas de l'article de Wikipèdia (CC BY-SA 4.0, citat e ligat)
// e l'autor e la licéncia de la fòto (Wikimedia Commons).
// Las demandas passan per nòstre servidor (Scaleway), pas pel navigador : l'IP
// dels visitaires va pas a Wikimedia. Responsas gardadas un jorn en memòria.
//
// Fòra del domeni occitan, l'article dins la lenga del luòc tanben (retorn de
// Romain, 2026-10-11 : Liyon en arpitan, Brest en breton) : l= dona las
// Wikipèdias de la lenga, nl= lo nom local (quand n'i a mai d'una, coma per
// las lengas d'oïl, la que nomena la vila atal es preferida).
//
//   GET /api/comuna?i=30034                     (còdi INSEE)
//   GET /api/comuna?i=69123&l=frp&nl=Liyon
//   GET /api/comuna?nom=Montreux&lat=46.43&lon=6.91&l=frp   (fòra de França)
import { json } from '@sveltejs/kit';

// las Wikipèdias de las lengas de la carta (e lo còdi de lor etiqueta Wikidata)
const WIKIS = ['ca', 'frp', 'eu', 'br', 'als', 'lb', 'pfl', 'ksh', 'li', 'vls', 'nl', 'co', 'pcd', 'wa', 'nrm'];
const ETIQUETA = { als: 'gsw' };

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
// (sens las prononciacions [mɔŋ.pe.lje], que copavan la primièra frasa, ni
// las parentèsis que lo resumit de Wikipèdia a laissadas vuèjas o mièjas)
function cort(t) {
	if (!t) return null;
	const net = t
		.replace(/\s*[—–]\s[^—–]*\[[^\]]*\][^—–]*[—–]/g, '')
		.replace(/\s*\[[^\]]*\]/g, '')
		.replace(/\s*\(\s*[;,]?\s*\)/g, '');
	let n = 0,
		u = '';
	for (const ch of net) {
		if (ch === '(') n++;
		else if (ch === ')') {
			if (!n) {
				u = u.replace(/[\s;,]+$/, '');
				continue;
			}
			n--;
		}
		u += ch;
	}
	let s = '';
	for (const f of u.split(/(?<=[.!?])\s+/)) {
		if ((s + ' ' + f).length > 280 && s) break;
		s += (s ? ' ' : '') + f;
	}
	return s.trim();
}

// (los títols e los noms, per los comparar : sens majusculas ni precisions)
const net = (s) =>
	(s ?? '')
		.replace(/\s*\(.*\)$/, '')
		.replace(/,.*$/, '')
		.normalize('NFC')
		.toLowerCase()
		.trim();

async function ficha(q) {
	const id = await element(q);
	if (!id) return null;
	const ets = q.l.map((l) => ETIQUETA[l] ?? l);
	const e = (await legir(W + 'action=wbgetentities&props=claims|sitelinks|labels&languages=' + ['oc', 'fr', ...ets].join('|') + '&ids=' + id))?.entities?.[id];
	if (!e) return null;
	const sitelink = (l) => e.sitelinks?.[l.replace(/-/g, '_') + 'wiki']?.title ?? null;
	const etiqueta = (l) => e.labels?.[ETIQUETA[l] ?? l]?.value ?? null;
	// la lenga del luòc : la Wikipèdia que nomena la vila coma nosautres, o la
	// primièra qu'a un article, o la primièra qu'a un nom
	const local =
		q.l.find((l) => q.nl && [sitelink(l), etiqueta(l)].some((t) => t && net(t) === net(q.nl))) ??
		q.l.find((l) => sitelink(l)) ??
		q.l.find((l) => etiqueta(l)) ??
		null;
	const lengas = ['oc', 'fr', ...(local ? [local] : [])];
	const C = e.claims ?? {};
	const pop = darrièra(C.P1082);
	const sup = darrièra(C.P2046);
	let km2 = nombre(sup?.v);
	if (km2 != null && sup.v.unit?.endsWith('/Q35852')) km2 /= 100; // (ectaras)
	const alt = nombre(darrièra(C.P2044)?.v);
	const gent = (C.P1549 ?? []).map((x) => x.mainsnak?.datavalue?.value).filter(Boolean);
	const gentilici = { oc: gent.find((g) => g.language === 'oc')?.text ?? null, fr: gent.find((g) => g.language === 'fr')?.text ?? null };
	const títol = Object.fromEntries(lengas.map((l) => [l, sitelink(l)]).filter(([, t]) => t));
	const wiki = Object.fromEntries(Object.entries(títol).map(([l, t]) => [l, `https://${l}.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`]));
	// las primièras frasas, dins cada lenga que l'article existís
	const extrach = {};
	await Promise.all(
		Object.entries(títol).map(async ([l, t]) => {
			const r = await legir(`https://${l}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.replace(/ /g, '_'))}`);
			if (r?.extract) extrach[l] = cort(r.extract);
		})
	);
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
		local,
		nom: Object.fromEntries(lengas.map((l) => [l, etiqueta(l)])),
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
		lon: +url.searchParams.get('lon'),
		l: (url.searchParams.get('l') ?? '')
			.split(',')
			.filter((l) => WIKIS.includes(l))
			.slice(0, 4),
		nl: url.searchParams.get('nl')?.slice(0, 80) ?? null
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
