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

// Les fiches du contrôle : supabase/supabase-verrolhs-fichas.sql (06-11). Les
// « _essai » d'origine ont été effacées par l'import des vraies fiches, qui
// nettoie « _essai% » ; « _verrolh » lui échappe, et le site ne montre aucune
// ligne dont le nom commence par « _ » (lib/data/fichasFont.js).
const FICHA_PUBLICADA = '_verrolh--publicada';
const FICHA_RESCONDIDA = '_verrolh--rescondida';
const FICHA_PIRATA = '_verrolh--pirata';
const TEMA_VERROLH = '_verrolh';
const TITRE_PUBLICADA = 'Contrôle de sécurité, ne pas toucher (fiche publiée)';

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
	verificar(
		'Une fiche publiée est bien visible',
		publicada.data?.length === 1,
		publicada.data?.length ? '' : "fiche de contrôle absente : coller supabase/supabase-verrolhs-fichas.sql, avec l'accord de Romain"
	);

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

	// La boîte à idées (2026-10-25) : rien n'y est lisible sans compte
	const ideas = await supabase.from('ideas').select('id');
	verificar(
		'Les idées de la boîte à idées sont illisibles',
		!!ideas.error || ideas.data?.length === 0,
		ideas.data?.length ? `${ideas.data.length} idée(s) exposée(s) !` : ''
	);

	// Les groupes d'Amassa (2026-10-25) : la liste est publique, le reste non
	const grops = await supabase.from('grops').select('id');
	verificar('La liste des groupes est lisible', !grops.error && grops.data?.length > 0, grops.error?.message ?? '');
	for (const [taula, nom] of [
		['messatges', 'Les messages des groupes sont illisibles'],
		['grop_membres', 'Les membres des groupes sont illisibles'],
		['senhalaments', 'Les signalements sont illisibles'],
		['mots_defenduts', 'La liste des mots interdits est illisible'],
		['bandiments', 'Les suspensions sont illisibles']
	]) {
		const r = await supabase.from(taula).select('*').limit(1);
		verificar(nom, !!r.error || r.data?.length === 0, r.data?.length ? 'données exposées !' : '');
	}

	const admin = await supabase.rpc('is_admin');
	verificar("Un anonyme n'est pas administrateur", admin.data === false, `réponse : ${admin.data}`);
}

async function verificarEscritura(supabase) {
	seccion("2. Ce qu'un visiteur ne doit PAS pouvoir écrire");

	await supabase.from('fichas').insert({
		id: FICHA_PIRATA,
		tema_id: TEMA_VERROLH,
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
		titre === TITRE_PUBLICADA,
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

	// Une idée sans compte : refusée (l'insertion échoue, on n'a rien à relire :
	// un anonyme ne peut pas lire la table)
	const idea = await supabase.from('ideas').insert({ tèxte: 'Idée envoyée sans compte' });
	verificar('ENVOYER une idée sans compte est refusé', !!idea.error);

	// Rejoindre un groupe, y écrire ou ouvrir une proposition sans compte : refusé
	const rejonher = await supabase.rpc('rejonher_grop', { g: 'vila-marselha' });
	verificar('REJOINDRE un groupe sans compte est refusé', !!rejonher.error);
	const messatge = await supabase.from('messatges').insert({ grop_id: 'vila-montpelhier', tèxte: 'Sans compte' });
	verificar('ÉCRIRE dans un groupe sans compte est refusé', !!messatge.error);
	await supabase.from('grops').update({ estat: 'dobèrt' }).eq('id', 'vila-marselha');
	const marselha = await supabase.from('grops').select('estat').eq('id', 'vila-marselha');
	verificar('OUVRIR une proposition sans compte est refusé', marselha.data?.[0]?.estat === 'prepausat', `état : ${marselha.data?.[0]?.estat}`);

	// Profils vérifiés (supabase-perfils.sql) : sans compte, ni profil, ni file
	// d'attente (avec les adresses), ni décision
	const perfil = await supabase.rpc('perfil', { p: 'Romain' });
	verificar('LIRE un profil sans compte est refusé', !!perfil.error || !perfil.data?.length);
	const espera = await supabase.rpc('perfils_en_espera');
	verificar('LIRE la file des profils (adresses) sans compte est refusé', !!espera.error);
	const decision = await supabase.rpc('decidir_perfil', { u: '00000000-0000-0000-0000-000000000001', d: 'verificat' });
	verificar('VALIDER un profil sans compte est refusé', !!decision.error);

	// Les notes du talhièr (supabase-notas.sql, 06-11) : un visiteur envoie une
	// remarque pour l'IA, jamais au nom de Romain, jamais comme une question de
	// l'IA, jamais déjà répondue ; il ne lit rien. (Refusé = erreur : l'anonyme
	// ne peut pas relire la table pour vérifier.)
	const nòta = { pagina: '/_essai-verrolhs', tèxte: 'Essai des verrous' };
	const deRomain = await supabase.from('remarcas').insert({ ...nòta, de_romain: true });
	verificar('ÉCRIRE une note au nom de Romain sans compte est refusé', !!deRomain.error);
	const perRomain = await supabase.from('remarcas').insert({ ...nòta, per: 'romain', autor: 'Claude' });
	verificar('FABRIQUER une question de l’IA sans compte est refusé', !!perRomain.error);
	const respondut = await supabase.from('remarcas').insert({ ...nòta, responsa: 'déjà fait', autor_responsa: 'IA' });
	verificar('ÉCRIRE une réponse de l’IA sans compte est refusé', !!respondut.error);
	const legirNòtas = await supabase.from('remarcas').select('id').limit(1);
	verificar('LIRE les notes sans compte est refusé', !!legirNòtas.error || !legirNòtas.data?.length);
	const demanda = await supabase.rpc('ia_demandar', { p_clau_secreta: 'pas-la-bona', p_pagina: '/_essai-verrolhs', p_text: 'Essai', p_autor: 'IA' });
	verificar('POSER une question au nom de l’IA sans sa clé est refusé', !!demanda.error);

	// La pile de validation (supabase-validacions.sql, lot 4) : seul Romain lit
	// et écrit les validations ; un visiteur ne glisse pas de réponses toutes
	// prêtes dans une remarque ; l'IA ne lit les validations qu'avec sa clé.
	const ambOpcions = await supabase.from('remarcas').insert({ ...nòta, opcions: ['A', 'B'] });
	verificar('GLISSER des réponses toutes prêtes sans compte est refusé', !!ambOpcions.error);
	const legirValidacions = await supabase.from('validacions').select('clau').limit(1);
	verificar('LIRE les validations sans compte est refusé', !!legirValidacions.error || !legirValidacions.data?.length);
	const validacion = await supabase.from('validacions').insert({ tipe: 'element', clau: '_verrolh', empremta: '0'.repeat(64) });
	verificar('VALIDER un texte sans compte est refusé', !!validacion.error);
	const legirIA = await supabase.rpc('ia_legir_validacions', { p_clau_secreta: 'pas-la-bona' });
	verificar('LIRE les validations au nom de l’IA sans sa clé est refusé', !!legirIA.error);

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
