// Les groupes d'Amassa (2026-10-25) : l'état partagé par la liste et la
// discussion, et le direct. Ce qui protège, ce sont les règles de la base
// (supabase/supabase-grops.sql et supabase-grops-2.sql, vérifiées par
// verificacion-grops*.sql), pas ce fichier.
//
// Le direct : un canal privé « grop:<id> » par groupe dont on est membre,
// tous sur la même connexion. La base y envoie quatre avis (nòu, amagat,
// restablit, suprimit) ; le droit d'écouter est vérifié une fois, à
// l'ouverture du canal. La liste tient ainsi ses non-lus à jour sans
// redemander quoi que ce soit au serveur.
import { supabase } from '$lib/supabaseClient';

// Les groupes restent fermés au public jusqu'à la charte et à la page
// Confidentialité (séance 4) ; l'administrateur les voit pour les essayer.
export const DOBÈRTS = false;

// Les familles du catalogue, dans l'ordre de « Crear un grop »
export const MENAS = [
	['vila', 'Vilas', 'Villes'],
	['nivel', 'Nivèls', 'Niveaux'],
	['dialecte', 'Dialèctes', 'Dialectes'],
	['despartament', 'Departaments', 'Départements'],
	['interes', 'Passions', 'Passions']
];

// Le profil public (supabase-perfils.sql) : dialecte et niveau, en occitan et en français
export const DIALECTES = [
	['lengadocian', 'Lengadocian', 'Languedocien'],
	['provencal', 'Provençal', 'Provençal'],
	['gascon', 'Gascon', 'Gascon'],
	['lemosin', 'Lemosin', 'Limousin'],
	['auvernhat', 'Auvernhat', 'Auvergnat'],
	['vivaroaupenc', 'Vivaroaupenc', 'Vivaro-alpin'],
	['autre', 'Autre', 'Autre'],
	['sabi_pas', 'Sabi pas encara', 'Je ne sais pas encore']
];
export const NIVELS = [
	['debutant', 'Debuti', 'Je débute'],
	['apren', 'Apreni', 'J’apprends'],
	['parla', 'Parli', 'Je parle'],
	['mairal', 'Lenga mairala', 'Langue maternelle']
];
// Ce qu'on cherche et ce qu'on aime : des cases à cocher plutôt que du texte
// (Romain, 2026-10-25 : « flemme d'écrire ») ; les valeurs sont verrouillées
// dans la base (profiles_perfil_listas, supabase-perfils.sql §6)
export const CERCA = [
	['parlar', 'Parlar', 'Parler'],
	['escriure', 'Escriure', 'Écrire'],
	['aprene', 'Aprene', 'Apprendre'],
	['trobar', 'Trobar de monde', 'Rencontrer du monde'],
	['ajudar', 'Ajudar los que debutan', 'Aider les débutants']
];
export const AGRADA = [
	['musica', 'Musica', 'Musique'],
	['cant', 'Cant', 'Chant'],
	['danca', 'Dança', 'Danse'],
	['bal', 'Bal', 'Bal'],
	['cosina', 'Cosina', 'Cuisine'],
	['literatura', 'Literatura', 'Littérature'],
	['teatre', 'Teatre', 'Théâtre'],
	['cinema', 'Cinema', 'Cinéma'],
	['natura', 'Natura', 'Nature'],
	['istoria', 'Istòria', 'Histoire'],
	['jocs', 'Jòcs', 'Jeux']
];
/** Le nom d'un dialecte, d'un niveau ou d'un choix de liste dans la langue choisie */
export const nomDe = (lista, v, fr) => lista.find((x) => x[0] === v)?.[fr ? 2 : 1] ?? null;

export const grops = $state({
	uid: null,
	admin: false,
	ieu: null, // son propre profil : { pseudo, verificacion }
	mevas: [], // mos_grops() : grop_id, mena, nom_oc, nom_fr, estat, darrier_at, non_legits
	cargadas: false,
	obert: null // le groupe affiché à droite
});

const canals = new Map();
const auditors = new Set();

/** S'abonner aux avis du direct (la discussion ouverte) ; renvoie de quoi se désabonner. */
export function escotar(fn) {
	auditors.add(fn);
	return () => auditors.delete(fn);
}

export async function cargarIeu() {
	const { data } = await supabase.from('profiles').select('pseudo, verificacion').eq('user_id', grops.uid).maybeSingle();
	grops.ieu = data;
}

export async function cargarMevas() {
	const { data, error } = await supabase.rpc('mos_grops');
	if (error) return;
	grops.mevas = data;
	grops.cargadas = true;
	sincronizar();
}

function sincronizar() {
	const ids = new Set(grops.mevas.map((g) => g.grop_id));
	for (const [id, c] of canals)
		if (!ids.has(id)) {
			supabase.removeChannel(c);
			canals.delete(id);
		}
	for (const id of ids) {
		if (canals.has(id)) continue;
		const c = supabase.channel('grop:' + id, { config: { private: true } });
		for (const ev of ['nòu', 'amagat', 'restablit', 'suprimit'])
			c.on('broadcast', { event: ev }, ({ payload }) => recebut(id, ev, payload));
		c.subscribe();
		canals.set(id, c);
	}
}

export function tancar() {
	for (const c of canals.values()) supabase.removeChannel(c);
	canals.clear();
	grops.mevas = [];
	grops.cargadas = false;
	grops.ieu = null;
}

function recebut(id, ev, p) {
	const g = grops.mevas.find((x) => x.grop_id === id);
	if (g && ev === 'nòu') {
		g.darrier_at = p.created_at;
		if (id !== grops.obert && p.user_id !== grops.uid) g.non_legits += 1;
		// le groupe le plus récemment actif remonte en tête
		grops.mevas.sort((a, b) => (b.darrier_at ?? '').localeCompare(a.darrier_at ?? ''));
	}
	for (const fn of auditors) fn(id, ev, p);
}

/** Rejoindre (ou ouvrir une proposition) ; renvoie la clé d'erreur ou null. */
export async function rejonher(id) {
	const { error } = await supabase.rpc('rejonher_grop', { g: id });
	if (error) return clauError(error);
	await cargarMevas();
	return null;
}

export async function quitar(id) {
	const { error } = await supabase.from('grop_membres').delete().eq('grop_id', id).eq('user_id', grops.uid);
	if (error) return clauError(error);
	await cargarMevas();
	return null;
}

export async function marcarLegit(id) {
	const g = grops.mevas.find((x) => x.grop_id === id);
	if (g) g.non_legits = 0;
	await supabase.rpc('marcar_legit', { g: id });
}

// Les refus de la base, traduits en clés de texte (X.oc / X.fr des pages)
const ERRORS = [
	'grops_compte',
	'grops_adreca',
	'grops_bandit',
	'grops_inconegut',
	'grops_tampat',
	'grops_limit',
	'messatges_mot',
	'messatges_limit',
	'messatges_ligam',
	'messatges_verificacion'
];
export function clauError(error) {
	const m = error?.message ?? '';
	return ERRORS.find((k) => m.includes(k)) ?? 'error';
}

/** Heure du jour, ou date courte : pas de mots, rien à traduire. */
export function ora(d) {
	const t = new Date(d);
	const uèi = new Date().toDateString() === t.toDateString();
	return uèi
		? t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
		: t.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
}
