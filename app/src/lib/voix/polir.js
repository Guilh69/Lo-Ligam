// Mise au propre des enregistrements (lot 3) : ce qui ne dépend ni de ffmpeg,
// ni de Supabase, ni du disque. Nommage des fichiers, choix de ce qui est à
// refaire, texte de l'index. Le script app/scripts/voix-polir.mjs s'en sert.
import { lireChemin } from './studio.js';

/**
 * Réglages du son final, les mêmes pour toutes les phrases.
 * - -19 LUFS : niveau perçu moyen visé en mono (équivaut à -16 en stéréo, le
 *   niveau habituel des podcasts) ; toutes les phrases arrivent à ce niveau.
 * - -2 dB : plafond des crêtes, pour que rien ne sature.
 * - 48 kbit/s : une voix seule en mono reste nette à ce débit en AAC (une
 *   phrase de 3 s pèse environ 18 Ko), ce qui respecte la sobriété du site.
 */
export const CIBLE = { lufs: -19, crete: -2, plage: 11, debit: '48k', frequence: 44100 };

/** Dossier public des sons : static/audio/moduls/<clé>.m4a (voir voix-index.js). */
export const DOSSIER_PUBLIC = '/audio/moduls';

/** Chemin public (celui que la leçon charge) d'une phrase. */
export function urlPublique(clau) {
	return `${DOSSIER_PUBLIC}/${clau}.m4a`;
}

/** Chemin du fichier propre, à l'intérieur d'un dossier de sortie. */
export function cheminSortie(clau, racine) {
	if (!/^[^/]+\/[^/]+$/.test(clau)) throw new Error(`clé de phrase inattendue : ${clau}`);
	return `${racine.replace(/[\\/]+$/, '')}/${clau}.m4a`;
}

/** Signature d'un brut : sa taille et sa date (à la seconde). Change quand la prise est refaite. */
export function signature({ taille, date }) {
	const t = Math.floor((typeof date === 'number' ? date : Date.parse(date)) / 1000);
	return `${taille}:${Number.isFinite(t) ? t : 0}`;
}

/**
 * Choisit un brut par phrase parmi une liste { chemin, taille, date }.
 * Un chemin qui n'est pas une prise (« 1-1/adieu.webm ») est ignoré ; une clé
 * qui ne correspond à aucune phrase actuelle (`clesConnues`, si donné) aussi.
 * Si la même phrase existe en deux formats, la prise la plus récente gagne.
 * Rend { bruts: Map clau → { clau, chemin, taille, date, sig }, ignores: [{chemin, raison}] }.
 */
export function choisirBruts(liste, clesConnues) {
	const bruts = new Map();
	const ignores = [];
	for (const b of liste ?? []) {
		const lu = lireChemin(b.chemin);
		if (!lu) {
			ignores.push({ chemin: b.chemin, raison: 'ce n’est pas une prise (nom ou format inattendu)' });
			continue;
		}
		if (clesConnues && !clesConnues.has(lu.clau)) {
			ignores.push({ chemin: b.chemin, raison: 'ne correspond à aucune phrase actuelle du parcours' });
			continue;
		}
		const date = typeof b.date === 'number' ? b.date : Date.parse(b.date);
		const nouveau = { clau: lu.clau, chemin: b.chemin, taille: b.taille, date, sig: signature({ taille: b.taille, date }) };
		const avant = bruts.get(lu.clau);
		if (avant && avant.date >= nouveau.date) {
			ignores.push({ chemin: b.chemin, raison: 'une prise plus récente de la même phrase existe' });
			continue;
		}
		if (avant) ignores.push({ chemin: avant.chemin, raison: 'une prise plus récente de la même phrase existe' });
		bruts.set(lu.clau, nouveau);
	}
	return { bruts, ignores };
}

/**
 * Sépare ce qu'il faut refaire de ce qui est déjà à jour.
 * `etat` : clau → { sig } (ce qu'on a traité la dernière fois) ;
 * `existe(clau)` dit si le fichier propre est bien là ; `tot` force tout.
 * Rend { afaire: [brut], ajour: [brut] }, triés par clé.
 */
export function partager(bruts, etat, existe, tot = false) {
	const afaire = [];
	const ajour = [];
	for (const b of [...bruts.values()].sort((x, y) => (x.clau < y.clau ? -1 : x.clau > y.clau ? 1 : 0))) {
		const pareil = etat?.[b.clau]?.sig === b.sig && existe(b.clau);
		(tot || !pareil ? afaire : ajour).push(b);
	}
	return { afaire, ajour };
}

/**
 * Texte de voix-index.js : une ligne par clé, triées, stable (deux appels avec
 * les mêmes clés donnent exactement le même texte, donc pas de bruit dans Git).
 */
export function construireIndex(cles) {
	const triees = [...new Set(cles)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
	const lignes = triees.map((c) => `\t${JSON.stringify(c)}: ${JSON.stringify(urlPublique(c))}`);
	return `// Index des sons : clé de phrase (voir clauDe dans phrases.js) → chemin public
// du fichier, par exemple '1-1/d-1a2b3c4d' → '/audio/moduls/1-1/d-1a2b3c4d.m4a'.
// Ce fichier est RÉÉCRIT par le script de mise au propre des enregistrements
// (app/scripts/voix-polir.mjs) et ne liste que des fichiers qui existent.
// Ne pas le remplir à la main.
export const VOTZ = {${lignes.length ? `\n${lignes.join(',\n')}\n` : ''}};
`;
}

/** Phrases sans voix : { total, sansVoix } à partir des clés du parcours et des clés de l'index. */
export function manques(clesParcours, clesIndex) {
	const ont = new Set(clesIndex);
	const sans = clesParcours.filter((c) => !ont.has(c));
	return { total: clesParcours.length, sansVoix: sans.length };
}

/** Lit le bloc JSON que loudnorm écrit en fin de sortie de ffmpeg (première passe). */
export function lireMesures(stderr) {
	const fin = String(stderr ?? '').lastIndexOf('{');
	if (fin < 0) return null;
	try {
		const j = JSON.parse(String(stderr).slice(fin, String(stderr).indexOf('}', fin) + 1));
		const m = {
			entree: Number(j.input_i),
			crete: Number(j.input_tp),
			plage: Number(j.input_lra),
			seuil: Number(j.input_thresh),
			decalage: Number(j.target_offset)
		};
		return Object.values(m).every(Number.isFinite) ? m : null; // « -inf » (silence total) → null
	} catch {
		return null;
	}
}

/** Filtre commun : mono, grave coupé, silences de début et de fin retirés (on garde 0,1 s autour). */
export const FILTRE_NETTOYAGE = [
	'aformat=channel_layouts=mono',
	'highpass=f=70',
	'silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB',
	'areverse',
	'silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB',
	'areverse'
].join(',');

const LOUDNORM = `loudnorm=I=${CIBLE.lufs}:TP=${CIBLE.crete}:LRA=${CIBLE.plage}`;

/** Arguments de ffmpeg, première passe : mesure seulement, n'écrit rien. */
export function argsMesure(entree) {
	return ['-hide_banner', '-nostats', '-i', entree, '-af', `${FILTRE_NETTOYAGE},${LOUDNORM}:print_format=json`, '-f', 'null', '-'];
}

/** Arguments de ffmpeg, seconde passe : réglage exact d'après la mesure, puis AAC mono léger. */
export function argsSortie(entree, sortie, m) {
	const mesure = `measured_I=${m.entree}:measured_TP=${m.crete}:measured_LRA=${m.plage}:measured_thresh=${m.seuil}:offset=${m.decalage}:linear=true`;
	return [
		'-hide_banner',
		'-nostats',
		'-loglevel',
		'error',
		'-y',
		'-i',
		entree,
		'-af',
		`${FILTRE_NETTOYAGE},${LOUDNORM}:${mesure}`,
		'-ac',
		'1',
		'-ar',
		String(CIBLE.frequence),
		'-c:a',
		'aac',
		'-b:a',
		CIBLE.debit,
		'-movflags',
		'+faststart',
		sortie
	];
}

/** Poids lisible : « 18 Ko », « 1,2 Mo ». */
export function poidsLisible(octets) {
	if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
	return `${(octets / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`;
}
