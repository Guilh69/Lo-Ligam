// Le formulaire de contact de Mon istòria (Romain, 2026-10-24 : « la solution
// la plus professionnelle et efficace »). Le message part par courriel vers
// l'alias de Romain (legal.js), envoyé par Scaleway Transactional Email
// (Paris), avec l'adresse du visiteur en « Répondre à » : Romain répond
// depuis sa messagerie. Le site n'en garde aucune copie (minimisation RGPD).
//
// Anti-spam invisible, sans service extérieur ni cookie : un champ piège que
// seuls les robots remplissent, un jeton d'heure signé (trop vite ou trop
// vieux = refusé), un plafond par adresse IP et un plafond global (le quota
// gratuit de Scaleway est de 300 courriels). ALTCHA reste possible si du
// spam passe malgré tout.
//
// Réglages du conteneur Scaleway (variables d'environnement, jamais dans Git) :
//   SCW_TEM_CLAU  clé secrète d'une clé d'API avec le droit TransactionalEmailFullAccess
//   SCW_PROJECTE  identifiant du projet Scaleway
//   CONTACTE_DE   (facultatif) l'expéditeur, sur le domaine vérifié ; formulari@loligam.eu par défaut
// Sans clé : en local, l'envoi est simulé (affiché dans la console) ; en
// ligne, le formulaire dit qu'il n'est pas branché et donne l'adresse.
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { editor } from '$lib/data/legal.js';

const API = 'https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails';
const MIN_SEGONDAS = 3;
const MAX_ORAS = 24;
const PER_IP = 5; // messages par heure et par adresse
const PER_ORA = 30; // messages par heure pour tout le site
const LONG_MAX = 4000;

const secret = () => env.SCW_TEM_CLAU || (secret.v ??= randomBytes(32).toString('hex'));
const signar = (t) => createHmac('sha256', secret()).update('contacte:' + t).digest('base64url');

/** le jeton posé dans le formulaire au moment de l'afficher */
export function geton() {
	const t = Date.now().toString(36);
	return `${t}.${signar(t)}`;
}

export function getonValid(v) {
	const [t, s] = String(v ?? '').split('.');
	if (!t || !s) return false;
	const atendut = Buffer.from(signar(t));
	const recebut = Buffer.from(s);
	if (atendut.length !== recebut.length || !timingSafeEqual(atendut, recebut)) return false;
	const age = Date.now() - parseInt(t, 36);
	return age >= MIN_SEGONDAS * 1000 && age <= MAX_ORAS * 3600_000;
}

// (en mémoire : le conteneur peut redémarrer, ce n'est qu'un garde-fou)
const traças = new Map();
let globau = [];
export function plafonat(ip) {
	const ara = Date.now();
	const ora = ara - 3600_000;
	globau = globau.filter((t) => t > ora);
	const l = (traças.get(ip) ?? []).filter((t) => t > ora);
	if (l.length >= PER_IP || globau.length >= PER_ORA) return true;
	l.push(ara);
	traças.set(ip, l);
	globau.push(ara);
	if (traças.size > 5000) traças.clear();
	return false;
}

export const linha = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();
export const corrièlValid = (s) => s.length <= 254 && /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/.test(s);

/**
 * Lit et contrôle le formulaire, puis envoie.
 * @returns {Promise<{ ok: true, simulat?: boolean } | { ok: false, error: string, status: number, piège?: boolean }>}
 */
export async function mandarContacte(formData, ip) {
	// un robot remplit tout : on fait comme si c'était parti
	if (linha(formData.get('site_web'))) return { ok: false, piège: true, error: 'piège', status: 200 };
	if (!getonValid(formData.get('geton'))) return { ok: false, error: 'geton', status: 400 };

	const nom = linha(formData.get('nom')).slice(0, 120);
	const corrièl = linha(formData.get('corrièl')).toLowerCase();
	const messatge = String(formData.get('messatge') ?? '').trim();
	if (!corrièlValid(corrièl)) return { ok: false, error: 'corrièl', status: 400 };
	if (messatge.length < 5 || messatge.length > LONG_MAX) return { ok: false, error: 'messatge', status: 400 };
	if ((messatge.match(/https?:\/\//gi) ?? []).length > 3) return { ok: false, error: 'ligams', status: 400 };
	if (plafonat(ip)) return { ok: false, error: 'plafond', status: 429 };

	const qui = nom || corrièl;
	const cos = [
		`Messatge mandat pel formulari de loligam.eu (Mon ligam amb l’occitan)`,
		`Message envoyé par le formulaire de loligam.eu (Mon lien avec l’occitan)`,
		'',
		`Nom : ${nom || '(non donné)'}`,
		`Corrièl : ${corrièl}`,
		`Data : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`,
		'',
		messatge,
		'',
		'-- ',
		`Répondre à ce courriel écrit directement à ${corrièl}.`
	].join('\n');

	return mandarCorrièl({ subject: `Lo Ligam · messatge de ${qui}`, text: cos, nom, corrièl });
}

/**
 * Envoie un courriel à l'alias de Romain, avec l'adresse du visiteur en
 * « Répondre à ». Commun au contact et au questionnaire d'avant le premier
 * cours (2026-10-24).
 */
export async function mandarCorrièl({ subject, text, nom, corrièl }) {
	const de = env.CONTACTE_DE || 'formulari@loligam.eu';
	if (!env.SCW_TEM_CLAU || !env.SCW_PROJECTE) {
		if (dev) {
			console.log('[contacte] envoi simulé (pas de clé SCW_TEM_CLAU en local)\n' + text);
			return { ok: true, simulat: true };
		}
		return { ok: false, error: 'pas_brancat', status: 503 };
	}

	try {
		const r = await fetch(API, {
			method: 'POST',
			headers: { 'X-Auth-Token': env.SCW_TEM_CLAU, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: { email: de, name: 'Lo Ligam' },
				to: [{ email: editor.email, name: 'Lo Ligam' }],
				subject: subject.slice(0, 180),
				text,
				project_id: env.SCW_PROJECTE,
				additional_headers: [{ key: 'Reply-To', value: nom ? `"${nom.replace(/["\\]/g, '')}" <${corrièl}>` : corrièl }]
			}),
			signal: AbortSignal.timeout(10_000)
		});
		if (!r.ok) {
			console.error('[contacte] Scaleway a refusé l’envoi', r.status, (await r.text()).slice(0, 300));
			return { ok: false, error: 'mandadís', status: 502 };
		}
		return { ok: true };
	} catch (e) {
		console.error('[contacte] envoi impossible', e?.message);
		return { ok: false, error: 'mandadís', status: 502 };
	}
}
