// Préchargé avant le serveur de l'adaptateur Node (voir CMD du Dockerfile :
// node --import ./serveur/precharge.js build/index.js).
//
// Chaque serveur HTTP créé reçoit, avant tout autre écouteur, la compression
// et la durée de cache de compression.js. L'adaptateur reste intact : un
// changement de version de SvelteKit n'a rien à reprendre ici.

import http from 'node:http';
import fs from 'node:fs';
import { brancher } from './compression.js';

// Dossiers de premier niveau servis tels quels (fonts, acuelh, bg…), relevés
// au démarrage ; _app (scripts et styles à empreinte) a déjà son propre cache.
/** @type {Set<string>} */
const dossiers = new Set();
try {
	for (const entree of fs.readdirSync('build/client', { withFileTypes: true })) {
		if (entree.isDirectory() && !entree.name.startsWith('_')) dossiers.add(entree.name);
	}
} catch {
	// pas de build/client (lancement hors de app/) : aucun cache ajouté, la
	// compression marche quand même
}

const creer = http.createServer;
http.createServer = function (...args) {
	// @ts-expect-error les surcharges de createServer ne se laissent pas relayer telles quelles
	const serveur = creer.apply(this, args);
	serveur.prependListener('request', (req, res) => brancher(req, res, dossiers));
	return serveur;
};
