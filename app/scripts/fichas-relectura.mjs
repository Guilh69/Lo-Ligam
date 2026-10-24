// Fiches de relecture et listes d'enregistrement des modules (décisions du
// 2026-10-25, cahier §11) : tirées du contenu même des modules, pour que
// Romain relise et enregistre exactement ce que le site affiche.
//
//   node scripts/fichas-relectura.mjs        (tous les modules)
//   node scripts/fichas-relectura.mjs 1-2    (un seul)
//
// Écrit dans Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/modules/relectura/ :
//   <module>-relectura.md      la fiche d'une page : phrases et traductions,
//                              mots non confirmés, questions pour Romain
//   <module>-enregistrament.md la liste numérotée, dans l'ordre du module

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const racina = dirname(dirname(fileURLToPath(import.meta.url)));
const sortida = join(racina, '..', 'Modules_cors/lo-ligam-cursus-pour-claude-code/cursus/modules/relectura');
const { moduls, ordre } = await import(pathToFileURL(join(racina, 'src/lib/lesson/moduls/index.js')));

// Mots que l'API de lo Congrès n'a pas confirmés (verificar-oc.mjs du
// 2026-10-25) : à regarder sur dicodòc. Mis à jour à chaque nouvelle passe.
const NON_CONFIRMATS = {
	'1-1': ['*vos* : l’API plante sur ce mot (erreur d’appel, déjà signalée sur la carte de l’A1), à voir sur dicodòc'],
	'1-2': ['*ieu* : absent de lo Basic et de vèrb’Òc (déjà sur la liste de la carte de l’A1)', '*vos* : l’API plante, comme en 1.1'],
	'1-3': [
		'*país* : l’API plante sur ce mot (déjà sur la liste de la carte)',
		'noms de villes : *Tolosa*, *Rodés*, *Bordèu* confirmés par top’Òc (lo Congrès) ; *Montpelhièr*, *Besièrs*, *Carcassona*, *Nimes*, *Marselha*, *Niça*, *Limòtges* et *Barcelona* pris dans Wikidata (top’Òc ne couvre que la Gascogne et Toulouse)'
	],
	'1-4': []
};

const net = (t) => String(t).replace(/\s+/g, ' ').trim();
const clau = (t) => net(t).replace(/…+$/u, '').toLowerCase();
// ce que les modules précédents ont déjà fait relire
const relegit = new Set();

function phrasesDu(modul) {
	const scenes = []; // { titre, lignes: [{ oc, fr }] }
	const retenir = []; // { oc, fr, sound }
	const exercices = new Set(); // autre occitan des exercices
	const leurres = new Set(); // mauvaises réponses proposées : du bon occitan aussi, mais qui ne répond pas
	const enregistrar = []; // { oc, ou }

	for (const etape of modul.sessions) {
		for (const bloc of etape.blocks) {
			if (bloc.type === 'dialogue') {
				for (const s of bloc.scenes) {
					const lignes = s.lines.map((l) => (typeof l === 'string' ? { oc: l } : l));
					scenes.push({ titre: s.title, lignes });
					for (const l of lignes) enregistrar.push({ oc: l.oc, ou: `scène « ${s.title} »` });
				}
				for (const g of bloc.glossary ?? []) {
					retenir.push({ oc: g.oc, fr: g.fr, sound: g.sound, passage: true });
					enregistrar.push({ oc: g.oc, ou: 'glossaire de la scène' });
				}
			}
			if (bloc.type === 'chunks') {
				for (const c of bloc.items) {
					retenir.push(c);
					for (const morceau of c.oc.split('·')) enregistrar.push({ oc: net(morceau), ou: 'À retenir' });
				}
			}
			if (bloc.type === 'carta') {
				for (const v of bloc.items) {
					retenir.push({ oc: v.oc, fr: v.fr, sound: v.sound, passage: true });
					enregistrar.push({ oc: v.oc, ou: 'jeu « Ont es ? »' });
				}
			}
			if (bloc.type === 'causida') {
				for (const t of bloc.tours) {
					if (t.ditz) {
						exercices.add(t.ditz);
						enregistrar.push({ oc: t.ditz, ou: `${bloc.personatge}, dialogue à choix` });
					}
					for (const o of t.options) (o.bon ? exercices : leurres).add(o.oc);
				}
			}
			for (const item of bloc.items ?? []) {
				if (typeof item !== 'object') continue;
				if (item.ditz) {
					exercices.add(item.ditz.oc);
					enregistrar.push({ oc: item.ditz.oc, ou: `${item.ditz.qui}, jeu du jour` });
				}
				if (item.oc || bloc.oc) (item.options ?? []).forEach((o, oi) => (oi === item.correct ? exercices : leurres).add(o));
				for (const r of [...(item.answers ?? []), ...(item.debut ?? [])]) exercices.add(r);
				if (item.tiles) exercices.add(item.tiles.join(' '));
			}
		}
	}
	// ce qui est déjà dans les scènes ou l'encadré n'est pas répété
	const deja = new Set([...scenes.flatMap((s) => s.lignes.map((l) => clau(l.oc))), ...retenir.flatMap((r) => r.oc.split('·').map(clau))]);
	const autres = [...new Map([...exercices].map((p) => [clau(p), net(p)])).entries()]
		.filter(([k]) => !deja.has(k) && !relegit.has(k) && k.includes(' '))
		.map(([, p]) => p);
	for (const k of [...deja, ...[...exercices].map(clau)]) relegit.add(k);
	// une phrase enregistrée une fois suffit
	const vus = new Set();
	const liste = enregistrar.filter((e) => {
		const k = net(e.oc).toLowerCase();
		if (vus.has(k)) return false;
		vus.add(k);
		return true;
	});
	const fausses = [...new Map([...leurres].map((p) => [clau(p), net(p)])).entries()]
		.filter(([k]) => !exercices.has(k) && ![...exercices].some((e) => clau(e) === k))
		.map(([, p]) => p);
	return { scenes, retenir, autres, fausses, liste };
}

function fiche(cle, modul, p) {
	const l = [];
	l.push(`# Module ${cle.replace('-', '.')} · *${modul.oc}* : fiche de relecture`);
	l.push('');
	l.push(`${modul.fr}. Générée depuis le site (\`app/scripts/fichas-relectura.mjs\`) : c’est exactement ce que l’élève lira. Quand tout te va, dis « publie le module ${cle.replace('-', '.')} » : Claude met la date de relecture et le module apparaît.`);
	l.push('');
	l.push('## Les scènes');
	for (const s of p.scenes) {
		l.push('');
		l.push(`**${s.titre}**`);
		l.push('');
		l.push('| occitan | français |');
		l.push('|---|---|');
		for (const x of s.lignes) l.push(`| ${x.oc} | ${x.fr ?? ''} |`);
	}
	l.push('');
	l.push('## À retenir (entre dans le carnet) et mots expliqués en passant');
	l.push('');
	l.push('| occitan | ça sonne comme | français |');
	l.push('|---|---|---|');
	for (const r of p.retenir) l.push(`| ${r.passage ? '' : '**'}${r.oc}${r.passage ? '' : '**'} | ${r.sound ?? ''} | ${r.fr ?? ''} |`);
	l.push('');
	l.push('En gras : ce qui entre dans le carnet. Sans gras : expliqué en passant (glossaire, carte).');
	if (p.autres.length) {
		l.push('');
		l.push('## Aussi dans les exercices');
		l.push('');
		l.push(p.autres.map((a) => `*${a}*`).join(' · '));
	}
	if (p.fausses.length) {
		l.push('');
		l.push('## Mauvaises réponses proposées');
		l.push('');
		l.push('Elles ne répondent pas à la question, mais l’élève les lit : elles doivent rester du bon occitan.');
		l.push('');
		l.push(p.fausses.map((a) => `*${a}*`).join(' · '));
	}
	l.push('');
	l.push('## Mots que l’outil n’a pas confirmés');
	l.push('');
	const nc = NON_CONFIRMATS[cle] ?? [];
	l.push(nc.length ? nc.map((n) => `- ${n}`).join('\n') : 'Aucun : tout est connu de lo Basic ou de vèrb’Òc (un ✓ ne valide ni le sens ni l’usage).');
	if (modul.notesRelecture?.length) {
		l.push('');
		l.push('## Questions pour toi');
		l.push('');
		modul.notesRelecture.forEach((n, i) => l.push(`${i + 1}. ${n}`));
	}
	l.push('');
	return l.join('\n');
}

function liste(cle, modul, p) {
	const l = [];
	l.push(`# Module ${cle.replace('-', '.')} · *${modul.oc}* : liste d’enregistrement`);
	l.push('');
	l.push(`${p.liste.length} phrases, environ ${Math.max(3, Math.round(p.liste.length * 0.12))} minutes. Enregistre d’une traite sur ton téléphone, dans un endroit calme : lis chaque phrase une fois, naturellement, et laisse **deux secondes de silence** entre deux phrases (c’est ce silence qui permet de découper). Si tu te trompes, redis la phrase : la dernière prise compte.`);
	l.push('');
	let ou = null;
	p.liste.forEach((e, i) => {
		if (e.ou !== ou) {
			l.push('');
			l.push(`**${e.ou}**`);
			l.push('');
			ou = e.ou;
		}
		l.push(`${i + 1}. ${e.oc}`);
	});
	l.push('');
	l.push('Envoie le fichier tel quel : Claude le découpe, l’allège et le range dans `app/static/audio/moduls/' + cle + '/`.');
	l.push('');
	return l.join('\n');
}

mkdirSync(sortida, { recursive: true });
const cible = process.argv[2];
for (const cle of ordre) {
	if (cible && cible !== cle) continue;
	const modul = moduls[cle];
	const p = phrasesDu(modul);
	const nom = cle.replace('-', '.');
	writeFileSync(join(sortida, `${nom}-relectura.md`), fiche(cle, modul, p));
	writeFileSync(join(sortida, `${nom}-enregistrament.md`), liste(cle, modul, p));
	console.log(`${nom} : fiche et liste de ${p.liste.length} phrases`);
}
