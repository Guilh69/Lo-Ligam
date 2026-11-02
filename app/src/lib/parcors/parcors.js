// Le parcours de l'apprenant (refonte de /aprene, 2026-11-02) : les étapes du
// chemin tirées du registre des modules, et l'état de chaque module d'après
// les étapes (séances) déjà faites. Fonctions pures, testées dans
// parcors.test.js ; la lecture de l'avancement est dans avancament.js.

// Les six niveaux du DCL, cap de tout le cursus (cahier §11, 2026-10-24), en
// blocs de 45 h : deux pour l'A1 (2026-10-25), la suite d'après la trame du
// 2026-11-01 (cursus/trama-A2-C1.md, encore à relire par Romain).
export const NIVELS = [
	{ id: 'A1', blocs: 2 },
	{ id: 'A2', blocs: 3 },
	{ id: 'B1.1', blocs: 2 },
	{ id: 'B1.2', blocs: 2 },
	{ id: 'B2', blocs: 3 },
	{ id: 'C1', blocs: 3 }
];

/** « 2-1 » → « 2.1 » ; le module 0 garde « 0 » ; haltes et mission n'ont pas de numéro */
export const numero = (id) => (id === '0' ? '0' : /^\d+-\d+$/.test(id) ? id.replace('-', '.') : '');

const tipeDe = (id) =>
	id === '0' ? 'partença' : id.startsWith('pausa-') ? 'pausa' : id.startsWith('mission') ? 'mission' : 'unitat';

/**
 * Les étapes du chemin, dans l'ordre du registre : le module 0 (« partença »),
 * les unités (quatre modules chacune), les haltes (« pausa »), la mission.
 * Une halte ou la mission appartient au blòc de l'unité qui la précède.
 */
export function camin(moduls, ordre) {
	const etapas = [];
	let bloc = null;
	for (const id of ordre) {
		const m = moduls[id];
		let e = etapas.at(-1);
		if (!e || e.cle !== m.unitat) {
			const tipe = tipeDe(id);
			const o = m.ouverture;
			if (tipe === 'unitat' && o?.bloc && o.bloc.oc !== bloc?.oc) bloc = { oc: o.bloc.oc, fr: o.bloc.fr, n: (bloc?.n ?? 0) + 1 };
			e = {
				cle: m.unitat,
				tipe,
				numero: tipe === 'unitat' ? (o?.numero ?? Number(id.split('-')[0])) : tipe === 'pausa' ? Number(id.slice(6)) : null,
				// l'unité a un titre (« Adieu ! ») ; les autres étapes, le nom de leur seul module
				oc: o?.titre ?? m.oc,
				fr: o?.fr ?? m.fr,
				bloc: tipe === 'partença' ? null : bloc,
				moduls: []
			};
			etapas.push(e);
		}
		e.moduls.push({ id, clau: m.id, num: numero(id), oc: m.oc, fr: m.fr, etapas: m.sessions.length });
	}
	return etapas;
}

/**
 * La glose courte d'un module : la traduction de son titre, sans la
 * description (« Comment vas-tu ? Saluer, demander… » → « Comment vas-tu ? »).
 */
export function glosaCorta(fr = '') {
	const q = fr.indexOf('?');
	if (q > 0) return fr.slice(0, q + 1).trim();
	const m = fr.search(/ : | \(/);
	return m > 0 ? fr.slice(0, m).trim() : fr;
}

/** nombre de bits à 1 : les étapes faites d'un module (masque de la page module) */
export function comptarBits(mask) {
	let n = 0;
	for (let x = Number(mask) || 0; x > 0; x = Math.floor(x / 2)) n += x % 2;
	return n;
}

/**
 * L'état de chaque module d'après `fachas` ({ [clau du module]: étapes faites }) :
 * « fach » (toutes ses étapes), « en-cors » (commencé), « dobert » (ouvert,
 * pas commencé) ou « clavat » (fermé). Le chemin s'ouvre pas à pas : un module
 * s'ouvre quand le précédent est fini, et un module commencé reste ouvert
 * (rien ne se referme, gamification « rien ne meurt »). L'« actual » est le
 * premier module ouvert et pas fini : celui que « Contunhar » propose.
 */
export function estatParcors(etapas, fachas = {}) {
	let precedentFach = true;
	let actual = null;
	let modulsFachs = 0;
	let totalModuls = 0;
	let etapasFachas = 0;
	let totalEtapas = 0;
	const out = etapas.map((e) => {
		const moduls = e.moduls.map((m) => {
			const f = Math.max(0, Math.min(Number(fachas[m.clau]) || 0, m.etapas));
			const estat = f >= m.etapas ? 'fach' : f > 0 ? 'en-cors' : precedentFach ? 'dobert' : 'clavat';
			precedentFach = estat === 'fach';
			totalModuls++;
			totalEtapas += m.etapas;
			etapasFachas += f;
			if (estat === 'fach') modulsFachs++;
			const r = { ...m, fachas: f, estat, actual: false };
			if (!actual && (estat === 'en-cors' || estat === 'dobert')) {
				r.actual = true;
				actual = r;
			}
			return r;
		});
		const fachs = moduls.filter((m) => m.estat === 'fach').length;
		const estat = fachs === moduls.length ? 'fach' : moduls.every((m) => m.estat === 'clavat') ? 'clavat' : 'dobert';
		return { ...e, moduls, fachs, estat, actual: moduls.some((m) => m.actual) };
	});
	const blocs = [...new Map(out.filter((e) => e.bloc).map((e) => [e.bloc.n, e.bloc])).values()];
	const etapaActuala = out.find((e) => e.actual) ?? null;
	return {
		etapas: out,
		actual,
		etapaActuala,
		// le blòc du module à faire ; au module 0, le premier ; tout fini, le dernier
		bloc: etapaActuala?.bloc ?? (actual ? blocs[0] : blocs.at(-1)) ?? null,
		blocs,
		modulsFachs,
		totalModuls,
		etapasFachas,
		totalEtapas,
		percent: totalEtapas ? Math.round((100 * etapasFachas) / totalEtapas) : 0
	};
}

/** L'étape fermée qui suit l'étape en cours : celle dont on dit comment l'ouvrir */
export function seguentaClavada(parcors) {
	const i = parcors.etapas.findIndex((e) => e.actual);
	const s = i >= 0 ? parcors.etapas[i + 1] : null;
	return s && s.estat === 'clavat' ? { etapa: s, precedenta: parcors.etapas[i] } : null;
}

/**
 * Pour les essais (/ensag/parcors?simul=n) : les n premiers modules finis et
 * deux étapes faites dans le suivant, pour voir le chemin à n'importe quel
 * moment sans jouer les modules.
 */
export function simular(etapas, n) {
	const fachas = {};
	let i = 0;
	for (const e of etapas)
		for (const m of e.moduls) {
			if (i < n) fachas[m.clau] = m.etapas;
			else if (i === n) fachas[m.clau] = Math.min(2, m.etapas - 1);
			i++;
		}
	return fachas;
}
