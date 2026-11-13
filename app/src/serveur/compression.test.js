// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import zlib from 'node:zlib';
import { choisirCodage, politiqueCache, brancher } from './compression.js';

describe('choisirCodage', () => {
	it('préfère brotli, puis gzip, sinon rien', () => {
		expect(choisirCodage('gzip, deflate, br')).toBe('br');
		expect(choisirCodage('gzip, deflate')).toBe('gzip');
		expect(choisirCodage('identity')).toBe(null);
		expect(choisirCodage('')).toBe(null);
		expect(choisirCodage(undefined)).toBe(null);
	});
	it('respecte q=0 et le joker', () => {
		expect(choisirCodage('br;q=0, gzip')).toBe('gzip');
		expect(choisirCodage('*')).toBe('br');
		expect(choisirCodage('gzip;q=0, br;q=0')).toBe(null);
	});
});

describe('politiqueCache', () => {
	const dossiers = new Set(['fonts', 'acuelh', 'data']);
	it('un mois pour les polices', () => {
		expect(politiqueCache('/fonts/limelight.woff2', dossiers)).toBe('public, max-age=2592000');
	});
	it('un jour pour les images et les sons', () => {
		expect(politiqueCache('/acuelh/photo.webp', dossiers)).toMatch(/max-age=86400/);
	});
	it('rien pour les JSON de la carte, les pages et les dossiers inconnus', () => {
		expect(politiqueCache('/data/basc.json', dossiers)).toBe(null);
		expect(politiqueCache('/apren', dossiers)).toBe(null);
		expect(politiqueCache('/api/comuna/foto', dossiers)).toBe(null);
		expect(politiqueCache('/inconnu/photo.webp', dossiers)).toBe(null);
	});
});

describe('brancher (serveur réel)', () => {
	const GROS = '<html>' + '<p>Lo Ligam, apprendre l’occitan.</p>'.repeat(300) + '</html>';
	/** @type {http.Server} */
	let serveur;
	let port = 0;

	beforeAll(async () => {
		serveur = http.createServer();
		serveur.prependListener('request', (req, res) => brancher(req, res, new Set(['fonts', 'acuelh'])));
		serveur.on('request', (req, res) => {
			const chemin = String(req.url).split('?')[0];
			if (chemin === '/petit') {
				res.setHeader('content-type', 'text/html');
				res.writeHead(200);
				res.end('<p>court</p>');
			} else if (chemin === '/deja') {
				res.setHeader('content-type', 'text/html');
				res.setHeader('content-encoding', 'br');
				res.writeHead(200);
				res.end(GROS);
			} else if (chemin === '/fonts/a.woff2') {
				res.setHeader('content-type', 'font/woff2');
				res.writeHead(200);
				res.end(Buffer.alloc(5000, 1));
			} else if (chemin === '/json') {
				res.setHeader('content-type', 'application/json');
				res.setHeader('etag', '"abc"');
				res.writeHead(200);
				res.write(GROS.slice(0, 4000));
				res.end(GROS.slice(4000));
			} else {
				res.setHeader('content-type', 'text/html');
				res.setHeader('content-length', Buffer.byteLength(GROS));
				res.writeHead(200);
				res.write(GROS.slice(0, 100));
				res.end(GROS.slice(100));
			}
		});
		await new Promise((ok) => serveur.listen(0, '127.0.0.1', ok));
		port = /** @type {import('node:net').AddressInfo} */ (serveur.address()).port;
	});
	afterAll(() => new Promise((ok) => serveur.close(ok)));

	/** @returns {Promise<{ statut: number, entetes: http.IncomingHttpHeaders, corps: Buffer }>} */
	function demander(chemin, entetes = {}, methode = 'GET') {
		return new Promise((ok, ko) => {
			const req = http.request({ host: '127.0.0.1', port, path: chemin, method: methode, headers: entetes }, (rep) => {
				const morceaux = [];
				rep.on('data', (m) => morceaux.push(m));
				rep.on('end', () => ok({ statut: rep.statusCode ?? 0, entetes: rep.headers, corps: Buffer.concat(morceaux) }));
			});
			req.on('error', ko);
			req.end();
		});
	}

	it('compresse en brotli et le contenu se retrouve à l’identique', async () => {
		const r = await demander('/', { 'accept-encoding': 'gzip, br' });
		expect(r.entetes['content-encoding']).toBe('br');
		expect(r.entetes['vary']).toMatch(/Accept-Encoding/i);
		expect(Number(r.entetes['content-length'])).toBe(r.corps.length);
		expect(r.corps.length).toBeLessThan(Buffer.byteLength(GROS) / 4);
		expect(zlib.brotliDecompressSync(r.corps).toString()).toBe(GROS);
	});

	it('compresse en gzip quand brotli manque', async () => {
		const r = await demander('/', { 'accept-encoding': 'gzip' });
		expect(r.entetes['content-encoding']).toBe('gzip');
		expect(zlib.gunzipSync(r.corps).toString()).toBe(GROS);
	});

	it('sans Accept-Encoding : réponse intacte, mais Vary posé pour les caches', async () => {
		const r = await demander('/');
		expect(r.entetes['content-encoding']).toBeUndefined();
		expect(r.entetes['vary']).toMatch(/Accept-Encoding/i);
		expect(r.corps.toString()).toBe(GROS);
	});

	it('compresse aussi le JSON écrit en plusieurs morceaux, avec un ETag faible', async () => {
		const r = await demander('/json', { 'accept-encoding': 'br' });
		expect(r.entetes['content-encoding']).toBe('br');
		expect(r.entetes['etag']).toBe('W/"abc"');
		expect(zlib.brotliDecompressSync(r.corps).toString()).toBe(GROS);
	});

	it('laisse passer le petit corps, le déjà-compressé, la requête partielle et HEAD', async () => {
		const petit = await demander('/petit', { 'accept-encoding': 'br' });
		expect(petit.entetes['content-encoding']).toBeUndefined();
		expect(petit.corps.toString()).toBe('<p>court</p>');

		const deja = await demander('/deja', { 'accept-encoding': 'br' });
		expect(deja.entetes['content-encoding']).toBe('br');
		expect(deja.corps.toString()).toBe(GROS);

		const partiel = await demander('/', { 'accept-encoding': 'br', range: 'bytes=0-9' });
		expect(partiel.entetes['content-encoding']).toBeUndefined();

		const tete = await demander('/', { 'accept-encoding': 'br' }, 'HEAD');
		expect(tete.statut).toBe(200);
		expect(tete.entetes['content-encoding']).toBeUndefined();
		expect(tete.corps.length).toBe(0);
	});

	it('pose le cache sur les polices sans les recompresser', async () => {
		const r = await demander('/fonts/a.woff2', { 'accept-encoding': 'br' });
		expect(r.entetes['cache-control']).toBe('public, max-age=2592000');
		expect(r.entetes['content-encoding']).toBeUndefined();
		expect(r.corps.length).toBe(5000);
	});
});
