// Compression et durée de cache du serveur de production (audit du 2026-11-13).
//
// L'adaptateur Node ne compresse que les fichiers statiques, précompressés à
// la construction. Le HTML et le JSON produits à la volée sortaient donc en
// clair (130 ko pour l'accueil, environ 27 ko compressés), et les polices et
// images n'avaient aucune durée de cache : le navigateur redemandait chaque
// fichier à chaque page. Ce module comble les deux trous sans toucher à
// l'adaptateur ; precharge.js le branche avant lui.

import zlib from 'node:zlib';

// Seuls ces types se compressent bien (les images, polices et sons le sont déjà).
const COMPRESSIBLE =
	/^(text\/(html|plain|css|xml)|application\/(json|javascript|xml|manifest\+json|geo\+json|ld\+json)|image\/svg\+xml)\b/i;

// Sous 1 ko, la compression coûte plus qu'elle ne rapporte ; au-delà de 8 Mo,
// on ne garde pas la réponse entière en mémoire : elle passe telle quelle.
const TAILLE_MIN = 1024;
const TAILLE_MAX = 8 * 1024 * 1024;

// Fichiers du dossier static à garder en cache. Les JSON de la carte en sont
// exclus exprès : ils évoluent avec le code, un JSON ancien servi avec un
// script neuf casserait la page. Ils restent revalidés (ETag) à chaque visite.
const FICHIER_CACHABLE = /\.(woff2|webp|png|jpe?g|gif|svg|ico|mp3|ogg|m4a|opus)$/i;

/**
 * Choisit le meilleur codage accepté par le navigateur, ou null.
 * @param {string | undefined} accept  en-tête Accept-Encoding
 * @returns {'br' | 'gzip' | null}
 */
export function choisirCodage(accept = '') {
	/** @type {Record<string, number>} */
	const poids = {};
	for (const morceau of String(accept).split(',')) {
		const [nom, ...params] = morceau.trim().toLowerCase().split(';');
		if (!nom) continue;
		const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
		poids[nom] = q ? Number(q.slice(2)) : 1;
	}
	const accepte = (/** @type {string} */ nom) => (poids[nom] ?? poids['*'] ?? 0) > 0;
	if (accepte('br')) return 'br';
	if (accepte('gzip')) return 'gzip';
	return null;
}

/**
 * Durée de cache d'un fichier statique, ou null (rien à ajouter).
 * @param {string} chemin  chemin de l'adresse, sans la requête
 * @param {Set<string>} dossiers  dossiers de premier niveau de build/client
 * @returns {string | null}
 */
export function politiqueCache(chemin, dossiers) {
	if (!FICHIER_CACHABLE.test(chemin)) return null;
	const dossier = chemin.split('/')[1];
	if (!dossiers.has(dossier)) return null;
	// Les polices ne changent jamais de nom ni de contenu : un mois.
	if (dossier === 'fonts') return 'public, max-age=2592000';
	// Images et sons : un jour, puis servis tels quels pendant qu'ils sont
	// revalidés en arrière-plan.
	return 'public, max-age=86400, stale-while-revalidate=604800';
}

/** @param {import('node:http').ServerResponse} res */
function ajouterVary(res) {
	const actuel = String(res.getHeader('vary') || '');
	if (/(^|,\s*)(accept-encoding|\*)\s*(,|$)/i.test(actuel)) return;
	res.setHeader('vary', actuel ? `${actuel}, Accept-Encoding` : 'Accept-Encoding');
}

/**
 * Branche la compression et le cache sur une réponse, avant que l'adaptateur
 * ne l'écrive. Sans effet sur ce qu'il ne reconnaît pas : tout passe tel quel.
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {Set<string>} [dossiers]
 */
export function brancher(req, res, dossiers = new Set()) {
	const ecrireTete = res.writeHead;
	const ecrire = res.write;
	const fin = res.end;
	let decide = false;

	// Quand le code appelle write() ou end() sans writeHead(), Node appelle
	// writeHead() de l'intérieur puis envoie le corps aussitôt : si writeHead()
	// n'a rien écrit (parce qu'on compresse), le corps partirait sans en-têtes.
	// On appelle donc writeHead() soi-même avant, puis on passe par la version
	// en place (celle qui garde le corps, si on compresse).
	const avantTete = (/** @type {Function} */ original, /** @type {'write' | 'end'} */ nom) => {
		/** @param {any[]} args */
		const relais = function (...args) {
			if (!decide && !res.headersSent) res.writeHead(res.statusCode);
			const actuel = res[nom];
			return (actuel === relais ? original : actuel).apply(res, args);
		};
		return relais;
	};
	res.write = /** @type {any} */ (avantTete(ecrire, 'write'));
	res.end = /** @type {any} */ (avantTete(fin, 'end'));

	res.writeHead = function (statut, ...reste) {
		res.writeHead = ecrireTete;
		decide = true;
		// Le message de statut éventuel (writeHead(404, 'Not Found', …)) est gardé.
		const message = reste.find((r) => typeof r === 'string');
		// Forme exotique (tableau d'en-têtes) : on ne s'en mêle pas.
		if (reste.some((r) => Array.isArray(r))) return ecrireTete.call(res, statut, ...reste);
		const passes = reste.find((r) => r && typeof r === 'object');
		if (passes) for (const [nom, valeur] of Object.entries(passes)) res.setHeader(nom, valeur);

		const lecture = req.method === 'GET' || req.method === 'HEAD';
		const chemin = String(req.url || '').split('?')[0];

		if (lecture && (statut === 200 || statut === 304) && !res.hasHeader('cache-control')) {
			const cache = politiqueCache(chemin, dossiers);
			if (cache) res.setHeader('cache-control', cache);
		}

		const type = String(res.getHeader('content-type') || '');
		const compressible =
			statut === 200 &&
			!res.hasHeader('content-encoding') &&
			COMPRESSIBLE.test(type) &&
			!/no-transform/i.test(String(res.getHeader('cache-control') || ''));
		if (compressible) ajouterVary(res);

		const codage =
			compressible && req.method === 'GET' && !req.headers.range
				? choisirCodage(req.headers['accept-encoding'])
				: null;
		const longueur = Number(res.getHeader('content-length')) || 0;
		if (!codage || (longueur && (longueur < TAILLE_MIN || longueur > TAILLE_MAX))) {
			return ecrireTete.call(res, statut, message);
		}

		// On garde la réponse entière (une page fait moins d'un Mo), on la
		// compresse sans bloquer le serveur, puis on l'envoie d'un bloc.
		/** @type {Buffer[]} */
		const morceaux = [];
		/** @type {(m: any, e?: any) => void} */
		const garder = (m, e) => {
			if (m != null && m.length !== 0) morceaux.push(Buffer.from(m, typeof e === 'string' ? e : undefined));
		};
		res.write = function (morceau, encodage, rappel) {
			garder(morceau, encodage);
			const cb = typeof encodage === 'function' ? encodage : rappel;
			if (typeof cb === 'function') cb();
			return true;
		};
		res.end = function (morceau, encodage, rappel) {
			res.write = ecrire;
			res.end = fin;
			const cb = [morceau, encodage, rappel].find((x) => typeof x === 'function');
			if (typeof morceau !== 'function') garder(morceau, encodage);
			const corps = Buffer.concat(morceaux);

			const clair = () => {
				ecrireTete.call(res, statut, message);
				fin.call(res, corps, cb);
			};
			if (res.destroyed) return res;
			if (corps.length < TAILLE_MIN) {
				clair();
				return res;
			}
			const rappelCompression = (/** @type {Error | null} */ erreur, /** @type {Buffer} */ sortie) => {
				if (res.destroyed) return;
				if (erreur) return clair();
				res.setHeader('content-encoding', codage);
				res.setHeader('content-length', sortie.length);
				const etag = res.getHeader('etag');
				if (typeof etag === 'string' && !etag.startsWith('W/')) res.setHeader('etag', `W/${etag}`);
				ecrireTete.call(res, statut, message);
				fin.call(res, sortie, cb);
			};
			if (codage === 'br') {
				zlib.brotliCompress(
					corps,
					{
						params: {
							[zlib.constants.BROTLI_PARAM_QUALITY]: 5,
							[zlib.constants.BROTLI_PARAM_SIZE_HINT]: corps.length
						}
					},
					rappelCompression
				);
			} else {
				zlib.gzip(corps, { level: 6 }, rappelCompression);
			}
			return res;
		};
		// Le corps changera de taille : l'ancienne longueur ne vaut plus.
		res.removeHeader('content-length');
		// Rien n'est envoyé avant res.end() : les en-têtes partiront avec le corps.
		return res;
	};
}
