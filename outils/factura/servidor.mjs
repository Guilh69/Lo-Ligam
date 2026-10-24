// Lo Ligam : factures des cours en visio (2026-10-25, cahier §11).
// Petit serveur local, sans dépendance : il sert la page factura.html et
// garde les données HORS de Git, dans le dossier de Romain :
//   %USERPROFILE%\Documents\6_Projectes\Lo_Ligam_hors-git\factures
// (ou le dossier donné par la variable FACTURES_DOSSIER, pour les essais).
// On y trouve : reglatges.json (identité, adresse, IBAN, prix),
// factures.json (toutes les pièces émises), livre-des-recettes.csv (le
// livre obligatoire, complété à chaque paiement, jamais réécrit) et PDF\.
// N'écoute que sur 127.0.0.1 : rien n'est visible depuis le réseau.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const POLICES = path.join(ICI, '..', '..', 'app', 'static', 'fonts');
const DOSSIER =
	process.env.FACTURES_DOSSIER ||
	path.join(os.homedir(), 'Documents', '6_Projectes', 'Lo_Ligam_hors-git', 'factures');
const PORT = Number(process.env.FACTURES_PORT) || 4747;

const F_REGLATGES = path.join(DOSSIER, 'reglatges.json');
const F_FACTURES = path.join(DOSSIER, 'factures.json');
const F_LIVRE = path.join(DOSSIER, 'livre-des-recettes.csv');

// Réglages de départ : vides là où c'est personnel, Romain les remplit
// dans l'onglet « Réglages » de la page.
const REGLATGES_DEFAUT = {
	nom: '',
	adresse: '',
	siret: '',
	email: '',
	site: 'loligam.eu',
	titulaire: '',
	iban: '',
	bic: '',
	banque: '',
	// Facture bilingue (Romain, 2026-10-25) : le français d'abord, comme
	// l'exige la loi, l'occitan à côté. Occitan vérifié par l'API de lo
	// Congrès, à valider par Romain.
	bilingue: true,
	mentionTva: 'TVA non applicable, art. 293 B du CGI',
	mentionTvaOc: 'Sens TVA (art. 293 B del CGI)',
	escompte: "Pas d'escompte pour paiement anticipé.",
	escompteOc: 'Pas de reduccion per un pagament per avança.',
	penalites: "En cas de retard de paiement, pénalités au taux d'intérêt légal en vigueur.",
	penalitesOc: "En cas de retard de pagament, penalitats al taus d'interès legal en vigor.",
	delaiJours: 8,
	tauxCotisations: 25.6,
	prix: {
		solidaire: { 1: 15, 4: 55, 12: 155 },
		classique: { 1: 22, 4: 80, 12: 225 },
		engage: { 1: 30, 4: 110, 12: 305 }
	},
	validiteMois: { 1: 0, 4: 2, 12: 5 }
};

function lire(fichier, defaut) {
	try {
		return JSON.parse(fs.readFileSync(fichier, 'utf8'));
	} catch {
		return defaut;
	}
}

// Écriture sûre : fichier temporaire puis renommage, et une copie du jour
// dans copies\ avant de toucher aux factures.
function ecrire(fichier, donnees) {
	if (fichier === F_FACTURES && fs.existsSync(F_FACTURES)) {
		const copies = path.join(DOSSIER, 'copies');
		fs.mkdirSync(copies, { recursive: true });
		const jour = new Date().toISOString().slice(0, 10);
		fs.copyFileSync(F_FACTURES, path.join(copies, `factures-${jour}.json`));
	}
	const tmp = fichier + '.tmp';
	fs.writeFileSync(tmp, JSON.stringify(donnees, null, '\t'), 'utf8');
	fs.renameSync(tmp, fichier);
}

function reglatges() {
	const r = lire(F_REGLATGES, {});
	return { ...REGLATGES_DEFAUT, ...r, prix: { ...REGLATGES_DEFAUT.prix, ...r.prix } };
}

const euros = (n) => n.toFixed(2).replace('.', ',');
const csv = (s) => `"${String(s ?? '').replace(/"/g, '""').replace(/\s*\n\s*/g, ', ')}"`;

// Une ligne de plus dans le livre des recettes (on n'efface ni ne corrige
// jamais une ligne : une erreur se rattrape par un avoir).
function inscrireRecette(piece) {
	if (!fs.existsSync(F_LIVRE)) {
		fs.writeFileSync(
			F_LIVRE,
			'﻿Date d\'encaissement;Pièce;Client;Désignation;Montant (€);Mode de règlement\n',
			'utf8'
		);
	}
	const p = piece.paiement;
	const ligne = [
		p.date.split('-').reverse().join('/'),
		piece.numero,
		piece.eleve.nom,
		piece.lignes.map((l) => l.designation).join(' + '),
		euros(piece.total),
		p.mode
	].map(csv);
	fs.appendFileSync(F_LIVRE, ligne.join(';') + '\n', 'utf8');
}

// Numéro suivant : année de la facture, puis un compteur continu sur trois
// chiffres (2026-001, 2026-002…). Factures et avoirs partagent la suite.
function numeroSuivant(factures, date) {
	const an = date.slice(0, 4);
	const max = factures
		.filter((f) => f.numero.startsWith(an + '-'))
		.reduce((m, f) => Math.max(m, Number(f.numero.slice(5))), 0);
	return `${an}-${String(max + 1).padStart(3, '0')}`;
}

function corps(req) {
	return new Promise((ok, ko) => {
		let d = '';
		req.on('data', (c) => (d += c));
		req.on('end', () => {
			try {
				ok(d ? JSON.parse(d) : {});
			} catch (e) {
				ko(e);
			}
		});
	});
}

function repondre(res, code, donnees) {
	res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
	res.end(JSON.stringify(donnees));
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2' };

function servirFichier(res, fichier) {
	fs.readFile(fichier, (err, data) => {
		if (err) return repondre(res, 404, { erreur: 'introuvable' });
		res.writeHead(200, { 'Content-Type': TYPES[path.extname(fichier)] || 'application/octet-stream' });
		res.end(data);
	});
}

const serveur = http.createServer(async (req, res) => {
	const url = new URL(req.url, 'http://127.0.0.1');
	try {
		if (req.method === 'GET' && url.pathname === '/') {
			return servirFichier(res, path.join(ICI, 'factura.html'));
		}
		if (req.method === 'GET' && url.pathname.startsWith('/polices/')) {
			return servirFichier(res, path.join(POLICES, path.basename(url.pathname)));
		}
		if (req.method === 'GET' && url.pathname === '/api/estat') {
			return repondre(res, 200, {
				reglatges: reglatges(),
				factures: lire(F_FACTURES, []),
				dossier: DOSSIER
			});
		}
		if (req.method === 'POST' && url.pathname === '/api/reglatges') {
			const r = await corps(req);
			ecrire(F_REGLATGES, { ...reglatges(), ...r });
			return repondre(res, 200, { reglatges: reglatges() });
		}
		// Émettre une facture ou un avoir : le numéro est donné ici, au moment
		// de l'enregistrement, pour qu'il n'y ait jamais de trou ni de doublon.
		if (req.method === 'POST' && url.pathname === '/api/piece') {
			const p = await corps(req);
			const factures = lire(F_FACTURES, []);
			if (p.type === 'avoir') {
				const origine = factures.find((f) => f.numero === p.avoirDe);
				if (!origine || origine.type !== 'facture' || origine.annuleePar) {
					return repondre(res, 400, { erreur: 'Cette facture ne peut pas être annulée.' });
				}
			}
			const piece = {
				...p,
				numero: numeroSuivant(factures, p.date),
				emiseLe: new Date().toISOString(),
				paiement: null
			};
			factures.push(piece);
			if (p.type === 'avoir') factures.find((f) => f.numero === p.avoirDe).annuleePar = piece.numero;
			ecrire(F_FACTURES, factures);
			return repondre(res, 200, { piece, factures });
		}
		// Paiement reçu (ou remboursement d'un avoir) : la pièce est marquée
		// et le livre des recettes reçoit une ligne.
		if (req.method === 'POST' && url.pathname === '/api/paiement') {
			const { numero, date, mode } = await corps(req);
			const factures = lire(F_FACTURES, []);
			const piece = factures.find((f) => f.numero === numero);
			if (!piece || piece.paiement) return repondre(res, 400, { erreur: 'Paiement déjà noté.' });
			piece.paiement = { date, mode };
			ecrire(F_FACTURES, factures);
			inscrireRecette(piece);
			return repondre(res, 200, { piece, factures });
		}
		if (req.method === 'POST' && url.pathname === '/api/ouvrir') {
			fs.mkdirSync(path.join(DOSSIER, 'PDF'), { recursive: true });
			exec(`explorer "${DOSSIER}"`);
			return repondre(res, 200, {});
		}
		repondre(res, 404, { erreur: 'introuvable' });
	} catch (e) {
		repondre(res, 500, { erreur: String(e.message || e) });
	}
});

fs.mkdirSync(path.join(DOSSIER, 'PDF'), { recursive: true });
// Déjà lancé dans une autre fenêtre : on ouvre simplement la page.
serveur.on('error', (e) => {
	if (e.code !== 'EADDRINUSE') throw e;
	console.log('Les factures sont déjà ouvertes dans une autre fenêtre : j\'ouvre la page.');
	exec(`start "" "http://127.0.0.1:${PORT}/"`);
	setTimeout(() => process.exit(0), 1500);
});
serveur.listen(PORT, '127.0.0.1', () => {
	const adresse = `http://127.0.0.1:${PORT}/`;
	console.log(`Factures Lo Ligam : ${adresse}`);
	console.log(`Données : ${DOSSIER}`);
	console.log('Laisse cette fenêtre ouverte pendant que tu fais tes factures ; ferme-la ensuite.');
	if (!process.env.FACTURES_SANS_NAVIGATEUR) exec(`start "" "${adresse}"`);
});
