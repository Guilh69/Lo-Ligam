// Lo Ligam — mise au propre des enregistrements de voix (studio de voix, lot 3).
// Prend les prises brutes de Romain, les rend propres et légères, les range
// dans le site et réécrit l'index que lit la leçon (src/lib/voix/voix-index.js).
//
//   cd app && node scripts/voix-polir.mjs                     depuis le dossier privé Supabase
//   cd app && node scripts/voix-polir.mjs --dossier "C:\chemin\des\bruts"   depuis un dossier de l'ordinateur
//   options : --tot (tout refaire)  --sec (essai à blanc : n'écrit rien)
//             --sortie <dossier> (ranger ailleurs que dans le site : essais)
//
// Dossier de bruts : un sous-dossier par module, comme dans le dossier privé
// (1-1/adieu.webm). Pour chaque prise : ffmpeg la passe en mono, coupe les
// silences du début et de la fin, règle le niveau sonore au même niveau pour
// toutes les phrases (deux passes), et la range en m4a léger (48 kbit/s) dans
// static/audio/moduls/<clé>.m4a. On ne refait que ce qui a changé.
//
// Identifiants du compte « lecteur » (jamais affichés) dans app/.env :
// VOIX_LECTOR_EMAIL, VOIX_LECTOR_SENHA (voir supabase/supabase-voix-lector.sql).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createClient } from '@supabase/supabase-js';
import { totasLasFrasas } from '../src/lib/voix/phrases.js';
import { BUCKET } from '../src/lib/voix/studio.js';
import {
	choisirBruts,
	partager,
	construireIndex,
	manques,
	lireMesures,
	argsMesure,
	argsSortie,
	cheminSortie,
	poidsLisible
} from '../src/lib/voix/polir.js';

const aquí = dirname(fileURLToPath(import.meta.url));
const racineApp = join(aquí, '..');
const args = process.argv.slice(2);
const val = (nom) => {
	const i = args.indexOf(nom);
	return i >= 0 ? args[i + 1] : undefined;
};
const tot = args.includes('--tot');
const sec = args.includes('--sec');
const dossierBruts = val('--dossier');
const sortieOpt = val('--sortie');

function arreter(message) {
	console.error(`\n${message}\n`);
	process.exit(1);
}

// --- Où ranger : le site par défaut, un dossier d'essai avec --sortie ---------
const dossierSons = sortieOpt ? resolve(sortieOpt, 'audio', 'moduls') : join(racineApp, 'static', 'audio', 'moduls');
const fichierIndex = sortieOpt ? resolve(sortieOpt, 'voix-index.js') : join(racineApp, 'src', 'lib', 'voix', 'voix-index.js');
const fichierEtat = sortieOpt ? resolve(sortieOpt, 'voix-etat.json') : join(racineApp, 'src', 'lib', 'voix', 'voix-etat.json');

// --- ffmpeg présent ? ---------------------------------------------------------
if (!sec) {
	const essai = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
	if (essai.error || essai.status !== 0) {
		arreter(
			"ffmpeg (l'outil qui traite le son) n'est pas installé sur cet ordinateur.\n" +
				'Ouvre une fenêtre PowerShell et colle cette ligne :\n\n    winget install Gyan.FFmpeg\n\n' +
				'Puis ferme toutes tes fenêtres PowerShell, rouvres-en une, et relance.'
		);
	}
}

// --- Lecture des bruts --------------------------------------------------------
function listerDossierLocal(racine) {
	if (!existsSync(racine) || !statSync(racine).isDirectory()) arreter(`Le dossier « ${racine} » n'existe pas.`);
	const liste = [];
	for (const mod of readdirSync(racine, { withFileTypes: true })) {
		if (!mod.isDirectory()) continue;
		for (const f of readdirSync(join(racine, mod.name), { withFileTypes: true })) {
			if (!f.isFile()) continue;
			const s = statSync(join(racine, mod.name, f.name));
			liste.push({ chemin: `${mod.name}/${f.name}`, taille: s.size, date: s.mtimeMs, local: join(racine, mod.name, f.name) });
		}
	}
	return liste;
}

function lireEnv() {
	const envPath = join(racineApp, '.env');
	if (!existsSync(envPath)) return {};
	return Object.fromEntries(
		readFileSync(envPath, 'utf8')
			.split(/\r?\n/)
			.filter((l) => l.includes('=') && !l.startsWith('#'))
			.map((l) => {
				const i = l.indexOf('=');
				return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
			})
	);
}

async function ouvrirBucket() {
	const env = lireEnv();
	const manque = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY', 'VOIX_LECTOR_EMAIL', 'VOIX_LECTOR_SENHA'].filter((n) => !env[n]);
	if (manque.length) {
		arreter(
			'Il manque dans app/.env : ' +
				manque.join(', ') +
				'.\n\nPour lire le dossier privé des voix, crée le compte « lecteur » (marche à suivre en tête de\n' +
				'supabase/supabase-voix-lector.sql), puis ajoute dans app/.env deux lignes :\n' +
				'    VOIX_LECTOR_EMAIL=l-adresse-du-compte\n    VOIX_LECTOR_SENHA=son-mot-de-passe\n\n' +
				'Autre solution, sans compte : télécharge les prises dans un dossier de ton ordinateur et lance\n' +
				'    node scripts/voix-polir.mjs --dossier "C:\\chemin\\du\\dossier"'
		);
	}
	const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
	const { error } = await supabase.auth.signInWithPassword({ email: env.VOIX_LECTOR_EMAIL, password: env.VOIX_LECTOR_SENHA });
	if (error) arreter("La connexion du compte « lecteur » a échoué : vérifie l'adresse et le mot de passe dans app/.env (le compte doit être confirmé dans Supabase).");
	return supabase.storage.from(BUCKET);
}

async function listerBucket(dossier, slugs) {
	const liste = [];
	for (const slug of slugs) {
		for (let depart = 0; ; depart += 1000) {
			const { data, error } = await dossier.list(slug, { limit: 1000, offset: depart, sortBy: { column: 'name', order: 'asc' } });
			if (error) arreter(`Lecture du dossier privé impossible (${error.message}). La règle de lecture du compte lecteur est-elle en place (supabase-voix-lector.sql) ?`);
			for (const o of data ?? []) {
				if (o.id) liste.push({ chemin: `${slug}/${o.name}`, taille: o.metadata?.size ?? 0, date: o.updated_at ?? o.created_at });
			}
			if ((data ?? []).length < 1000) break;
		}
	}
	return liste;
}

// --- Traitement d'un brut -----------------------------------------------------
function polir(entree, sortie) {
	const mesure = spawnSync('ffmpeg', argsMesure(entree), { encoding: 'utf8', maxBuffer: 1 << 26 });
	if (mesure.error) throw mesure.error;
	const m = lireMesures(mesure.stderr);
	if (!m) throw new Error('rien d’audible dans cette prise (vide, trop faible ou illisible) : à refaire');
	mkdirSync(dirname(sortie), { recursive: true });
	const p = spawnSync('ffmpeg', argsSortie(entree, sortie, m), { encoding: 'utf8', maxBuffer: 1 << 26 });
	if (p.status !== 0) throw new Error(`ffmpeg a échoué : ${String(p.stderr).trim().split('\n').pop()}`);
}

// --- Programme ----------------------------------------------------------------
const frasas = totasLasFrasas();
const clesParcours = frasas.map((f) => f.clau);
const clesConnues = new Set(clesParcours);
const slugs = [...new Set(clesParcours.map((c) => c.split('/')[0]))];

let etat = {};
try {
	etat = JSON.parse(readFileSync(fichierEtat, 'utf8'));
} catch {
	/* première fois */
}

let source;
let bucket = null;
if (dossierBruts) {
	source = listerDossierLocal(resolve(dossierBruts));
} else {
	bucket = await ouvrirBucket();
	source = await listerBucket(bucket, slugs);
}

const { bruts, ignores } = choisirBruts(source, clesConnues);
const existe = (clau) => existsSync(cheminSortie(clau, dossierSons));
const { afaire, ajour } = partager(bruts, etat, existe, tot);

console.log(`${bruts.size} prise(s) utilisable(s) ; ${afaire.length} à traiter, ${ajour.length} déjà à jour${tot ? ' (--tot : tout est refait)' : ''}.`);
for (const i of ignores) console.log(`  ignorée : ${i.chemin} (${i.raison})`);

let faits = 0;
let erreurs = 0;
let octets = 0;
if (sec) {
	for (const b of afaire) console.log(`  à traiter : ${b.clau}`);
	console.log('\nEssai à blanc (--sec) : rien n’a été écrit.');
} else {
	const temp = mkdtempSync(join(tmpdir(), 'voix-polir-'));
	try {
		for (const b of afaire) {
			try {
				let entree = source.find((s) => s.chemin === b.chemin)?.local;
				if (!entree) {
					const { data, error } = await bucket.download(b.chemin);
					if (error) throw new Error(`téléchargement impossible (${error.message})`);
					entree = join(temp, b.chemin.replace(/[/\\]/g, '__'));
					writeFileSync(entree, Buffer.from(await data.arrayBuffer()));
				}
				const sortie = cheminSortie(b.clau, dossierSons);
				polir(entree, sortie);
				const poids = statSync(sortie).size;
				octets += poids;
				etat[b.clau] = { sig: b.sig };
				faits++;
				console.log(`  fait : ${b.clau} (${poidsLisible(poids)})`);
			} catch (e) {
				erreurs++;
				console.error(`  ERREUR : ${b.clau} — ${e.message}`);
			}
		}
	} finally {
		rmSync(temp, { recursive: true, force: true });
	}

	// Index : tout fichier propre qui existe ET correspond à une phrase actuelle.
	const cles = clesParcours.filter(existe);
	mkdirSync(dirname(fichierIndex), { recursive: true });
	writeFileSync(fichierIndex, construireIndex(cles));
	const etatTrie = Object.fromEntries(Object.keys(etat).sort().map((k) => [k, etat[k]]));
	writeFileSync(fichierEtat, JSON.stringify(etatTrie, null, '\t') + '\n');
	console.log(`\nIndex réécrit : ${cles.length} phrase(s) avec voix.`);
}

// --- Résumé -------------------------------------------------------------------
let poidsTotal = 0;
const clesAvecVoix = clesParcours.filter((c) => {
	if (!existe(c)) return false;
	poidsTotal += statSync(cheminSortie(c, dossierSons)).size;
	return true;
});
const { total, sansVoix } = manques(clesParcours, clesAvecVoix);
console.log('\n--- Résumé ---');
console.log(`Traitées : ${faits}   Ignorées : ${ignores.length + ajour.length} (dont ${ajour.length} déjà à jour)   En erreur : ${erreurs}`);
console.log(`Poids de tous les sons propres : ${poidsLisible(poidsTotal)} (${clesAvecVoix.length} fichiers)`);
console.log(`Phrases de l'A1 encore sans voix : ${sansVoix} sur ${total}`);
if (erreurs) process.exit(2);
