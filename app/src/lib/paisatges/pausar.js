// Les mots que Romain pose sur ses photos dans Triar (lot « pausar », 07-11) :
// les comparer à ceux du code et les écrire dans ./paisatges.js. Servi par
// scripts/triar.mjs (--lot pausar, --aplicar) ; ne dépend de rien d'autre.

/** L'apostrophe du site (« l’aiga »), même si Romain tape la droite. */
export const cle = (oc) => oc.trim().replace(/'/g, '’');

/** L'écart de deux points, en fraction du grand côté de la photo (règle du jeu : plus de 0,12). */
export const ecart = (p, [, , xa, ya], [, , xb, yb]) => {
	const M = Math.max(p.l, p.h);
	return Math.hypot(((xa - xb) * p.l) / M, ((ya - yb) * p.h) / M);
};

/** Ce qui change sur une photo ([[occitan, français, x, y]]), en lignes lisibles. */
export function diferéncias(p, nous, MOTS) {
	const vielhs = p.mots.map(([oc, x, y]) => [oc, MOTS[oc] ?? '', x, y]);
	const l = [];
	for (const m of nous) {
		const v = vielhs.find((w) => w[0] === cle(m[0]));
		if (!v) l.push(`+ ${m[0]} (${m[1] || 'sans français'}) en ${m[2]}, ${m[3]}${MOTS[cle(m[0])] ? '' : m[4] === 'basic' ? '   ← mot nouveau, choisi dans lo Basic' : '   ← mot nouveau, écrit à la main : lo Congrès'}`);
		else {
			if (Math.abs(v[2] - m[2]) > 0.005 || Math.abs(v[3] - m[3]) > 0.005) l.push(`~ ${m[0]} déplacé : ${v[2]}, ${v[3]} → ${m[2]}, ${m[3]}`);
			if (m[1] && m[1] !== v[1]) l.push(`~ ${m[0]} : français « ${v[1]} » → « ${m[1]} »`);
		}
	}
	for (const v of vielhs) if (!nous.some((m) => cle(m[0]) === v[0])) l.push(`− ${v[0]} retiré`);
	for (let i = 0; i < nous.length; i++)
		for (let j = i + 1; j < nous.length; j++) if (ecart(p, nous[i], nous[j]) <= 0.12) l.push(`! ${nous[i][0]} et ${nous[j][0]} trop proches pour le jeu`);
	if (nous.length < 3) l.push(`! ${nous.length} mot(s) : le jeu en veut 3 au moins`);
	return l;
}

const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * Le texte de ./paisatges.js avec les mots de la photo p remplacés par nous ;
 * les mots nouveaux vont à la fin de MOTS, sous une ligne de note.
 * Rend { t, novèls }.
 */
export function escriure(t, p, nous, MOTS, nota) {
	const eol = t.includes('\r\n') ? '\r\n' : '\n';
	const i = t.indexOf(`\t\tclau: '${p.clau}',`);
	const a = i < 0 ? -1 : t.indexOf('\t\tmots: [', i);
	const b = a < 0 ? -1 : t.indexOf(`${eol}\t\t]`, a);
	if (b < 0) throw new Error(`bloc de mots introuvable pour ${p.clau}`);
	const mots = nous.map(([oc, fr, x, y]) => [cle(oc), fr.trim(), x, y]);
	const lignas = mots.map(([oc, , x, y]) => `\t\t\t[${q(oc)}, ${x}, ${y}]`).join(`,${eol}`);
	t = t.slice(0, a) + `\t\tmots: [${eol}${lignas}` + t.slice(b);
	const novèls = mots.filter(([oc], k) => !MOTS[oc] && mots.findIndex((m) => m[0] === oc) === k);
	if (novèls.length) {
		// le dernier mot de MOTS n'a pas de virgule (Prettier) : on la lui donne
		const fin = t.indexOf(`${eol}};`, t.indexOf('export const MOTS = {'));
		const cap = t.slice(0, fin);
		const ajust = novèls.map(([oc, fr]) => `${eol}\t${q(oc)}: ${q(fr || '?')}`).join(',');
		t = cap + (cap.endsWith(',') ? '' : ',') + `${eol}\t// ${nota}` + ajust + t.slice(fin);
	}
	return { t, novèls };
}
