// La memòria del navigador (decision de Romain, 2026-10-23 : « la mémoire du
// navigateur pour que la carte se recharge instantanément »). Lo site
// (scripts e estils) es gardat a la primièra visita ; las donadas de la carta,
// las polissas, las icònas e los sons, a lor primièr usatge. A la visita
// seguenta, venon de la memòria sens tornar demandar res al servidor. Cada
// mesa en linha càmbia la version : la memòria vièlha es levada, las donadas
// novèlas se tornan cargar un còp. Las paginas e lo compte demòran sul ret
// (pas de donadas personalas dins la memòria).
/// <reference types="@sveltejs/kit" />
import { build, version } from '$service-worker';

const MEMÒRIA = `lo-ligam-${version}`;
// çò que se garda a son primièr usatge
const A_GARDAR = /^\/(data|fonts|icones|sons|_app\/immutable)\//;

self.addEventListener('install', (ev) => {
	ev.waitUntil(
		caches
			.open(MEMÒRIA)
			.then((c) => c.addAll(build))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (ev) => {
	ev.waitUntil(
		caches
			.keys()
			.then((ks) => Promise.all(ks.filter((k) => k !== MEMÒRIA).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (ev) => {
	const r = ev.request;
	if (r.method !== 'GET' || r.headers.has('range')) return;
	const u = new URL(r.url);
	// (en desvolopament, res de gardat : las donadas càmbian a cada moment)
	if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(self.location.hostname)) return;
	if (u.origin !== self.location.origin || !(A_GARDAR.test(u.pathname) || build.includes(u.pathname))) return;
	ev.respondWith(
		caches.open(MEMÒRIA).then(async (c) => {
			const gardat = await c.match(r);
			if (gardat) return gardat;
			const resp = await fetch(r);
			if (resp.ok && resp.type === 'basic') c.put(r, resp.clone());
			return resp;
		})
	);
});
