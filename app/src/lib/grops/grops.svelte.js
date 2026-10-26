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
	['vila', 'Vilas', 'Villes', 'Ciudades', 'Cities', 'Ciutats'],
	['nivel', 'Nivèls', 'Niveaux', 'Niveles', 'Levels', 'Nivells'],
	['dialecte', 'Dialèctes', 'Dialectes', 'Dialectos', 'Dialects', 'Dialectes'],
	['despartament', 'Departaments', 'Départements', 'Departamentos', 'Departments', 'Departaments'],
	['interes', 'Passions', 'Passions', 'Pasiones', 'Passions', 'Passions']
];

// Le profil public (supabase-perfils.sql) : dialecte et niveau, dans les cinq langues
export const DIALECTES = [
	['lengadocian', 'Lengadocian', 'Languedocien', 'Languedociano', 'Languedocian', 'Llenguadocià'],
	['provencal', 'Provençal', 'Provençal', 'Provenzal', 'Provençal', 'Provençal'],
	['gascon', 'Gascon', 'Gascon', 'Gascón', 'Gascon', 'Gascó'],
	['lemosin', 'Lemosin', 'Limousin', 'Lemosín', 'Limousin', 'Lemosí'],
	['auvernhat', 'Auvernhat', 'Auvergnat', 'Auvernés', 'Auvergnat', 'Alvernès'],
	['vivaroaupenc', 'Vivaroaupenc', 'Vivaro-alpin', 'Vivaroalpino', 'Vivaro-Alpine', 'Vivaroalpí'],
	['autre', 'Autre', 'Autre', 'Otro', 'Other', 'Altre'],
	['sabi_pas', 'Sabi pas encara', 'Je ne sais pas encore', 'Todavía no lo sé', 'I don’t know yet', 'Encara no ho sé']
];
export const NIVELS = [
	['debutant', 'Debuti', 'Je débute', 'Estoy empezando', 'I’m just starting', 'Començo'],
	['apren', 'Apreni', 'J’apprends', 'Estoy aprendiendo', 'I’m learning', 'Estic aprenent'],
	['parla', 'Parli', 'Je parle', 'Lo hablo', 'I speak it', 'El parlo'],
	['mairal', 'Lenga mairala', 'Langue maternelle', 'Lengua materna', 'Mother tongue', 'Llengua materna']
];
// Ce qu'on cherche et ce qu'on aime : des cases à cocher plutôt que du texte
// (Romain, 2026-10-25 : « flemme d'écrire ») ; les valeurs sont verrouillées
// dans la base (profiles_perfil_listas, supabase-perfils.sql §6)
export const CERCA = [
	['parlar', 'Parlar', 'Parler', 'Hablar', 'Speaking', 'Parlar'],
	['escriure', 'Escriure', 'Écrire', 'Escribir', 'Writing', 'Escriure'],
	['aprene', 'Aprene', 'Apprendre', 'Aprender', 'Learning', 'Aprendre'],
	['trobar', 'Trobar de monde', 'Rencontrer du monde', 'Conocer gente', 'Meeting people', 'Conèixer gent'],
	['ajudar', 'Ajudar los que debutan', 'Aider les débutants', 'Ayudar a quienes empiezan', 'Helping beginners', 'Ajudar qui comença']
];
export const AGRADA = [
	['musica', 'Musica', 'Musique', 'Música', 'Music', 'Música'],
	['cant', 'Cant', 'Chant', 'Canto', 'Singing', 'Cant'],
	['danca', 'Dança', 'Danse', 'Danza', 'Dance', 'Dansa'],
	['bal', 'Bal', 'Bal', 'Baile popular', 'Folk ball', 'Ball popular'],
	['cosina', 'Cosina', 'Cuisine', 'Cocina', 'Cooking', 'Cuina'],
	['literatura', 'Literatura', 'Littérature', 'Literatura', 'Literature', 'Literatura'],
	['teatre', 'Teatre', 'Théâtre', 'Teatro', 'Theatre', 'Teatre'],
	['cinema', 'Cinema', 'Cinéma', 'Cine', 'Cinema', 'Cinema'],
	['natura', 'Natura', 'Nature', 'Naturaleza', 'Nature', 'Natura'],
	['istoria', 'Istòria', 'Histoire', 'Historia', 'History', 'Història'],
	['jocs', 'Jòcs', 'Jeux', 'Juegos', 'Games', 'Jocs']
];
// Les listes ci-dessus : [valeur, oc, fr, es, en, ca]
const COLONA = { oc: 1, fr: 2, es: 3, en: 4, ca: 5 };
/** Le libellé d'une ligne de liste dans la langue choisie (repli : l'occitan) */
export const nomLigne = (ligne, lang) => ligne[COLONA[lang] ?? 1] || ligne[1];
/** Le nom d'un dialecte, d'un niveau ou d'un choix de liste dans la langue choisie */
export const nomDe = (lista, v, lang) => {
	const l = lista.find((x) => x[0] === v);
	return l ? nomLigne(l, lang === true ? 'fr' : lang) : null;
};

export const grops = $state({
	uid: null,
	admin: false,
	ieu: null, // son propre profil : { pseudo, verificacion }
	mevas: [], // mos_grops() : grop_id, mena, nom_oc, nom_fr, estat, darrier_at, non_legits
	cargadas: false,
	obert: null, // le groupe affiché à droite
	// les contacts (supabase-contactes.sql, 2026-10-25) : mos_contactes() :
	// user_id, pseudo, estat (acceptat, mandada, recebuda), darrier_at, non_legits
	contactes: [],
	obertAmb: null // la personne de la conversation affichée à droite
});
let canalIeu = null;

const canals = new Map();
const auditors = new Set();

/** S'abonner aux avis du direct (la discussion ouverte ; « ieu » pour les
 *  messages un à un et les contacts) ; renvoie de quoi se désabonner. */
export function escotar(fn) {
	auditors.add(fn);
	return () => auditors.delete(fn);
}

export async function cargarIeu() {
	const { data } = await supabase.from('profiles').select('pseudo, verificacion').eq('user_id', grops.uid).maybeSingle();
	grops.ieu = data;
}

/** Ses contacts, et le canal « ieu:<id> » où arrivent ses messages un à un. */
export async function cargarContactes() {
	const { data, error } = await supabase.rpc('mos_contactes');
	if (error) return;
	grops.contactes = data;
	if (!canalIeu && grops.uid) {
		canalIeu = supabase.channel('ieu:' + grops.uid, { config: { private: true } });
		for (const ev of ['privat', 'privat_suprimit', 'contacte'])
			canalIeu.on('broadcast', { event: ev }, ({ payload }) => recebutIeu(ev, payload));
		canalIeu.subscribe();
	}
}

function recebutIeu(ev, p) {
	if (ev === 'contacte') cargarContactes();
	else if (ev === 'privat') {
		const autre = p.de === grops.uid ? p.a : p.de;
		const c = grops.contactes.find((x) => x.user_id === autre);
		if (c) {
			c.darrier_at = p.created_at;
			if (p.de !== grops.uid && autre !== grops.obertAmb) c.non_legits += 1;
			grops.contactes.sort((a, b) => (b.estat === 'recebuda') - (a.estat === 'recebuda') || (b.darrier_at ?? '').localeCompare(a.darrier_at ?? ''));
		}
	}
	for (const fn of auditors) fn('ieu', ev, p);
}

/** Les gestes sur un contact : renvoient la clé d'erreur ou null. */
async function gèste(fn, args) {
	const { error } = await supabase.rpc(fn, args);
	if (error) return clauError(error);
	await cargarContactes();
	return null;
}
export const demandarContacte = (u) => gèste('demandar_contacte', { u });
export const respondreContacte = (u, accepta) => gèste('respondre_contacte', { u, accepta });
export const quitarContacte = (u) => gèste('quitar_contacte', { u });
export const blocar = (u) => gèste('blocar', { u });
export const desblocar = (u) => gèste('desblocar', { u });

export async function marcarLegitPrivat(u) {
	const c = grops.contactes.find((x) => x.user_id === u);
	if (c) c.non_legits = 0;
	await supabase.rpc('marcar_legit_privat', { u });
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
	if (canalIeu) supabase.removeChannel(canalIeu);
	canalIeu = null;
	grops.contactes = [];
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
	'messatges_verificacion',
	'contactes_impossible',
	'contactes_limit',
	'contactes_inconegut',
	'privats_contacte'
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
