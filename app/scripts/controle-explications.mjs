// Contrôle « rien sans explication » (exigence de Romain, cahier §11,
// 2026-10-25) : dans chaque module, tout mot occitan doit être dans son
// encadré « À retenir » ou dans celui d'un module précédent. Les mots
// expliqués en passant (glossaire d'une scène, noms de villes découverts
// sur la carte) comptent aussi comme expliqués, mais le programme les liste
// à part pour que Romain les voie.
//
//   node scripts/controle-explications.mjs           (tous les modules)
//   node scripts/controle-explications.mjs 1-2       (un module, avec ce qui précède)
//
// Où le programme trouve l'occitan :
//   - les champs tout en occitan : répliques des scènes, encadrés « À retenir »,
//     tuiles à remettre dans l'ordre, réponses à écrire, répliques et choix des
//     dialogues, options des questions marquées `oc: true`, titre du module ;
//   - dans les textes en français : ce qui est en *italique* ou en **gras**
//     (la règle d'écriture des modules : l'occitan est toujours en italique ;
//     un passage en italique qui commence par une parenthèse, une lettre seule
//     ou une terminaison comme *-atz* restent du français).
// Sortie en erreur (code 1) si un mot n'est expliqué nulle part : à lancer
// avant de publier un module.

import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const racina = dirname(dirname(fileURLToPath(import.meta.url)));
const { moduls, ordre } = await import(pathToFileURL(join(racina, 'src/lib/lesson/moduls/index.js')));

// « D’ont siás ? » → d', ont, siás. Même découpe pour l'encadré et pour le
// texte contrôlé : les deux côtés se comparent toujours de la même façon.
export function motsDe(texte) {
	return String(texte)
		.toLowerCase()
		.replace(/[’‘ʼ]/g, "'")
		.replace(/[«»“”"?!.,;:…·()[\]{}_0-9+=→←↑↓]/g, ' ')
		.split(/[\s/–—-]+/)
		.flatMap((m) => {
			const i = m.indexOf("'");
			return i > 0 && i < m.length - 1 ? [m.slice(0, i + 1), m.slice(i + 1)] : [m];
		})
		.map((m) => m.replace(/^'+/, ''))
		.filter((m) => m && /\p{L}/u.test(m));
}

// Les passages en italique ou en gras d'un texte en français.
function marques(texte) {
	const sortie = [];
	const s = String(texte);
	for (const m of s.matchAll(/\*\*([^*]+)\*\*/g)) sortie.push(m[1]);
	for (const m of s.replace(/\*\*[^*]+\*\*/g, ' ').matchAll(/\*([^*]+)\*/g)) sortie.push(m[1]);
	// Restent du français : une parenthèse ; une lettre seule (*v*) ou une
	// terminaison (*-atz*), dont on parle comme d'un morceau de mot.
	return sortie.filter((p) => {
		const t = p.trim();
		return !t.startsWith('(') && !t.startsWith('-') && !/^\p{L}$/u.test(t);
	});
}

// Parcourt un module et range chaque texte : `enseigne` (À retenir),
// `passage` (expliqué en passant), `oc` (occitan à contrôler), avec l'endroit.
function textesDu(modul) {
	const enseigne = [];
	const passage = [];
	const aControler = [];
	const oc = (texte, ou) => texte && aControler.push({ texte, ou });
	const fr = (texte, ou) => {
		if (!texte) return;
		for (const t of Array.isArray(texte) ? texte : [texte]) for (const p of marques(t)) oc(p, ou);
	};

	oc(modul.oc, 'titre du module');
	fr(modul.cando, 'objectif');
	if (modul.ouverture) {
		oc(modul.ouverture.titre, 'carte de titre');
		oc(modul.ouverture.question, 'carte de titre');
		fr(modul.ouverture.phrase, 'carte de titre');
		// le nom du bloc s'affiche toujours avec sa traduction (carte de l'A1, §2)
		passage.push({ texte: modul.ouverture.bloc.oc, ou: 'carte de titre' });
	}

	modul.sessions.forEach((etape, ei) => {
		const lieu = (bloc) => `étape ${ei + 1} · ${bloc.title ?? bloc.type}`;
		fr(etape.title, `titre de l'étape ${ei + 1}`);
		for (const bloc of etape.blocks) {
			const ou = lieu(bloc);
			fr(bloc.title, ou);
			fr(bloc.intro, ou);
			fr(bloc.paragraphs, ou);
			fr(bloc.list, ou);
			fr(bloc.notes, ou);
			if (bloc.head) fr(bloc.head, ou);
			for (const ligne of bloc.rows ?? []) fr(ligne, ou);
			// mots traduits dans le texte même (« Adieu paure Carnaval (adieu, pauvre Carnaval) »)
			for (const m of Object.keys(bloc.glosa ?? {})) passage.push({ texte: m, ou });

			if (bloc.type === 'chunks') {
				for (const c of bloc.items) {
					enseigne.push({ texte: c.oc, ou });
					fr(c.fr, ou);
				}
				continue;
			}
			if (bloc.type === 'dialogue') {
				for (const scena of bloc.scenes) {
					oc(scena.title, ou);
					fr(scena.subtitle, ou);
					for (const l of scena.lines) oc(typeof l === 'string' ? l : l.oc, ou);
				}
				for (const g of bloc.glossary ?? []) passage.push({ texte: g.oc, ou });
				continue;
			}
			if (bloc.type === 'carta') {
				for (const v of bloc.items) passage.push({ texte: v.oc, ou });
				continue;
			}
			if (bloc.type === 'causida') {
				for (const t of bloc.tours) {
					oc(t.ditz, ou);
					fr(t.situacion, ou);
					for (const o of t.options) {
						oc(o.oc, ou);
						fr(o.reaccion, ou);
					}
					fr(t.explain, ou);
				}
				fr(bloc.fin, ou);
				continue;
			}
			for (const item of bloc.items ?? []) {
				if (typeof item === 'string') {
					fr(item, ou);
					continue;
				}
				fr(item.q, ou);
				fr(item.a, ou);
				fr(item.explain, ou);
				fr(item.prompt, ou);
				fr(item.consigne, ou);
				if (item.ditz) oc(item.ditz.oc, ou);
				for (const o of item.options ?? []) (item.oc || bloc.oc ? oc : fr)(o, ou);
				for (const t of item.tiles ?? []) oc(t, ou);
				for (const r of item.answers ?? []) oc(r, ou);
				for (const r of item.debut ?? []) oc(r, ou);
			}
		}
	});
	return { enseigne, passage, aControler };
}

const cible = process.argv[2];
if (cible && !ordre.includes(cible)) {
	console.error(`Module inconnu : ${cible}. Connus : ${ordre.join(', ')}`);
	process.exit(1);
}

const appris = new Set(); // À retenir des modules déjà parcourus
const vus = new Set(); // expliqués en passant, modules déjà parcourus
let problemes = 0;

for (const cle of ordre) {
	const modul = moduls[cle];
	const { enseigne, passage, aControler } = textesDu(modul);
	const nouveaux = new Set();
	for (const e of enseigne) for (const m of motsDe(e.texte)) if (!appris.has(m)) nouveaux.add(m);
	const enPassant = new Set();
	for (const p of passage) for (const m of motsDe(p.texte)) if (!appris.has(m) && !nouveaux.has(m) && !vus.has(m)) enPassant.add(m);
	const propres = new Set((modul.nomsPropris ?? []).flatMap(motsDe));

	const inconnus = new Map();
	for (const { texte, ou } of aControler) {
		for (const m of motsDe(texte)) {
			if (appris.has(m) || nouveaux.has(m) || vus.has(m) || enPassant.has(m) || propres.has(m)) continue;
			if (!inconnus.has(m)) inconnus.set(m, new Set());
			inconnus.get(m).add(ou);
		}
	}

	if (!cible || cible === cle) {
		console.log(`\n■ Module ${cle} · ${modul.oc}`);
		console.log(`  À retenir : ${nouveaux.size} mot(s) nouveau(x) : ${[...nouveaux].join(', ') || '(aucun)'}`);
		if (enPassant.size) console.log(`  Expliqués en passant : ${[...enPassant].join(', ')}`);
		if (inconnus.size) {
			console.log(`  ✗ ${inconnus.size} mot(s) sans explication :`);
			for (const [m, lieux] of inconnus) console.log(`     ${m}  (${[...lieux].join(' ; ')})`);
		} else {
			console.log('  ✓ Rien sans explication.');
		}
		problemes += inconnus.size;
	}
	for (const m of nouveaux) appris.add(m);
	for (const m of enPassant) vus.add(m);
	if (cible === cle) break;
}

console.log(problemes ? `\n${problemes} mot(s) à expliquer avant publication.` : '\nTout est expliqué.');
process.exit(problemes ? 1 : 0);
