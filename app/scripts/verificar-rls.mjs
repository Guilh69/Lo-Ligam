// Lo Ligam — vérification des verrous de sécurité (RLS)
//
// Se connecte à Supabase EXACTEMENT comme le ferait un visiteur du site : avec
// la clé publique, sans être connecté. Puis tente de faire des dégâts. Tout
// doit être refusé par la base.
//
//   cd app && npm run verificar:rls
//
// POURQUOI CE SCRIPT NE SE CONTENTE PAS DE REGARDER LES MESSAGES D'ERREUR
// Quand une politique RLS interdit une modification, Postgres ne renvoie pas
// toujours une erreur : il peut répondre « c'est bon » en n'ayant modifié
// aucune ligne. Un test naïf qui se contente de lire le message d'erreur passe
// donc au vert sur une table grande ouverte. Ici, après chaque tentative, on
// RELIT la donnée pour vérifier qu'elle n'a pas bougé. C'est la seule preuve
// qui vaille.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racina = join(dirname(fileURLToPath(import.meta.url)), '..');

const FICHA_PUBLICADA = '_essai--publicada';
const FICHA_RESCONDIDA = '_essai--rescondida';
const FICHA_PIRATA = '_essai--pirata';

// Sortie propre : on pose le code de sortie et on laisse Node se terminer de
// lui-même. Un process.exit() brutal pendant qu'une requête réseau est encore
// en vol fait planter Node sur Windows avec un « Assertion failed » illisible.
class Arrest extends Error {}

function fatal(messatge) {
	throw new Arrest(messatge);
}

function legirEnv() {
	let brut;
	try {
		brut = readFileSync(join(racina, '.env'), 'utf8');
	} catch {
		fatal('Fichier app/.env introuvable. Copie app/.env.example en app/.env et remplis-le.');
	}
	const env = {};
	for (const linha of brut.split(/\r?\n/)) {
		const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
	}
	if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
		fatal('PUBLIC_SUPABASE_URL ou PUBLIC_SUPABASE_ANON_KEY manque dans app/.env');
	}
	return env;
}

const resultats = [];
let capitol = '';

function seccion(titol) {
	capitol = titol;
	console.log(`\n${titol}`);
	console.log('─'.repeat(titol.length));
}

function verificar(nom, capOk, detalh = '') {
	resultats.push({ capitol, nom, capOk });
	console.log(`${capOk ? '  ✓' : '  ✗ ÉCHEC —'} ${nom}${detalh ? `  (${detalh})` : ''}`);
}

async function verificarLectura(supabase) {
	seccion("1. Ce qu'un visiteur a le droit de LIRE");

	const publicada = await supabase.from('fichas').select('id').eq('id', FICHA_PUBLICADA);
	verificar('Une fiche publiée est bien visible', publicada.data?.length === 1);

	const rescondida = await supabase.from('fichas').select('id').eq('id', FICHA_RESCONDIDA);
	verificar(
		'Une fiche NON publiée reste invisible',
		rescondida.data?.length === 0,
		rescondida.data?.length ? 'elle fuit !' : ''
	);

	const admins = await supabase.from('admins').select('user_id');
	verificar(
		'La liste des administrateurs est illisible',
		!!admins.error || admins.data?.length === 0,
		admins.data?.length ? `${admins.data.length} ligne(s) exposée(s) !` : ''
	);

	const profils = await supabase.from('profiles').select('pseudo');
	verificar(
		'Les profils des autres membres sont illisibles',
		!!profils.error || profils.data?.length === 0,
		profils.data?.length ? `${profils.data.length} profil(s) exposé(s) !` : ''
	);

	const admin = await supabase.rpc('is_admin');
	verificar("Un anonyme n'est pas administrateur", admin.data === false, `réponse : ${admin.data}`);
}

async function verificarEscritura(supabase) {
	seccion("2. Ce qu'un visiteur ne doit PAS pouvoir écrire");

	await supabase.from('fichas').insert({
		id: FICHA_PIRATA,
		tema_id: '_essai',
		titre: 'Ajoutée par un inconnu',
		mini_url: '/x.webp',
		grand_url: '/x.webp'
	});
	const apondut = await supabase.from('fichas').select('id').eq('id', FICHA_PIRATA);
	verificar('AJOUTER une fiche est refusé', apondut.data?.length === 0);

	await supabase.from('fichas').update({ titre: 'TITRE PIRATÉ' }).eq('id', FICHA_PUBLICADA);
	const modificat = await supabase.from('fichas').select('titre').eq('id', FICHA_PUBLICADA);
	const titre = modificat.data?.[0]?.titre;
	verificar(
		'MODIFIER une fiche est refusé',
		titre === "Fiche d'essai publiée",
		`titre après tentative : « ${titre} »`
	);

	await supabase.from('fichas').delete().eq('id', FICHA_PUBLICADA);
	const suprimit = await supabase.from('fichas').select('id').eq('id', FICHA_PUBLICADA);
	verificar('SUPPRIMER une fiche est refusé', suprimit.data?.length === 1);

	await supabase.from('fichas').update({ publicat: true }).eq('id', FICHA_RESCONDIDA);
	const publicat = await supabase.from('fichas').select('id').eq('id', FICHA_RESCONDIDA);
	verificar('PUBLIER une fiche cachée est refusé', publicat.data?.length === 0);

	await supabase.from('temas').insert({ id: '_pirata', oc: 'x', fr: 'x' });
	const tema = await supabase.from('temas').select('id').eq('id', '_pirata');
	verificar('AJOUTER un thème est refusé', tema.data?.length === 0);

	// La tentative la plus grave : se déclarer administrateur.
	const promocion = await supabase
		.from('admins')
		.insert({ user_id: '00000000-0000-0000-0000-000000000001', nòta: 'auto-promotion' });
	const apres = await supabase.rpc('is_admin');
	verificar('SE DÉCLARER administrateur est refusé', !!promocion.error && apres.data === false);
}

async function verificarFichiers(supabase) {
	seccion("3. Ce qu'un visiteur ne doit PAS pouvoir téléverser");

	const imatge = await supabase.storage
		.from('designs')
		.upload(`_essai/pirata-${Date.now()}.webp`, new Blob([new Uint8Array([82, 73, 70, 70])]), {
			contentType: 'image/webp'
		});
	verificar(
		'ENVOYER une image est refusé',
		!!imatge.error,
		imatge.error ? '' : 'aucune erreur — le dossier est ouvert !'
	);

	const svg = await supabase.storage
		.from('designs')
		.upload(`_essai/pirata-${Date.now()}.svg`, new Blob(['<svg onload="alert(1)"/>']), {
			contentType: 'image/svg+xml'
		});
	verificar('ENVOYER un SVG piégé est refusé', !!svg.error);
}

async function main() {
	const env = legirEnv();
	const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

	const sonda = await supabase.from('fichas').select('id').limit(1);
	if (sonda.error) {
		const m = sonda.error.message || '';
		if (/does not exist|schema cache|relation/i.test(m)) {
			fatal(
				'La table « fichas » n\'existe pas encore.\n' +
					'  Colle d\'abord supabase-admin-schema.sql dans Supabase → SQL Editor → Run,\n' +
					'  puis relance cette vérification.'
			);
		}
		fatal(`Connexion à Supabase impossible : ${m}`);
	}

	console.log(`\nCible : ${env.PUBLIC_SUPABASE_URL}`);
	console.log('Identité : visiteur anonyme (clé publique, aucune session)');

	await verificarLectura(supabase);
	await verificarEscritura(supabase);
	await verificarFichiers(supabase);

	const fracasses = resultats.filter((r) => !r.capOk);
	console.log('\n' + '═'.repeat(64));
	if (fracasses.length === 0) {
		console.log(`  TOUT EST VERROUILLÉ — ${resultats.length} vérifications passées.`);
		console.log('  Un visiteur peut lire ce qui est publié, et rien de plus.');
	} else {
		console.log(`  ${fracasses.length} FAILLE(S) SUR ${resultats.length} VÉRIFICATIONS`);
		for (const f of fracasses) console.log(`    · ${f.nom}`);
		console.log("\n  N'ouvre pas l'espace d'administration tant que ce n'est pas au vert.");
		process.exitCode = 1;
	}
	console.log('═'.repeat(64) + '\n');
}

try {
	await main();
} catch (e) {
	if (e instanceof Arrest) {
		console.error(`\n  ARRÊT : ${e.message}\n`);
		process.exitCode = 1;
	} else {
		throw e;
	}
}
