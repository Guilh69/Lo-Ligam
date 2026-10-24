// Les règles du carnet de révision (chantier 20, décisions du 2026-10-24,
// cahier §11) : logique pure, sans navigateur ni base, testée à part.
//
// Une chose apprise (mot, bloc tout fait, forme) donne deux cartes :
// « je reconnais » puis « je produis ». La carte « je produis » n'existe pas
// tant que « je reconnais » n'est pas acquise : elle est fermée. Une carte est
// acquise après deux réussites à deux jours différents (Romain, option A).
// La planification des révisions est celle de FSRS (bibliothèque ts-fsrs).
//
// Forme du carnet, gardée telle quelle dans le navigateur :
//   { version: 1, proprietaire: null | id du compte,
//     cartes: { 'bonjorn:reconnais': { fsrs, jours, acquise, maj } } }
//   fsrs     : l'état FSRS de la carte (dates en texte ISO)
//   jours    : les deux derniers jours (AAAA-MM-JJ, heure locale) de réussite
//   acquise  : la date où la carte est devenue acquise, ou null
//   maj      : dernière modification (ISO), pour fusionner avec le compte
// Aucun historique des réponses : FSRS planifie avec l'état seul (sobriété).
import { fsrs, createEmptyCard, Rating, State } from 'ts-fsrs';

export const VERSION = 1;
export const SENS = ['reconnais', 'produis'];

const planificateur = fsrs({ enable_fuzz: true });

export function carnetVide() {
	return { version: VERSION, proprietaire: null, cartes: {} };
}

export function idCarte(chose, sens) {
	return `${chose}:${sens}`;
}

// Le jour local, pas le jour UTC : une réussite à 23 h et une à 8 h le
// lendemain comptent pour deux jours.
export function jourLocal(date) {
	const d = new Date(date);
	const deux = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
}

function enTexte(carteFsrs) {
	return {
		...carteFsrs,
		due: new Date(carteFsrs.due).toISOString(),
		last_review: carteFsrs.last_review ? new Date(carteFsrs.last_review).toISOString() : null
	};
}

function nouvelleCarte(now) {
	return { fsrs: enTexte(createEmptyCard(now)), jours: [], acquise: null, maj: now.toISOString() };
}

function lireFsrs(fsrsTexte) {
	const { last_review, ...reste } = fsrsTexte;
	return { ...reste, due: new Date(fsrsTexte.due), ...(last_review ? { last_review: new Date(last_review) } : {}) };
}

// Note une carte (la crée si besoin) et renvoie la carte notée.
function noterCarte(carnet, id, reussi, now) {
	const carte = carnet.cartes[id] ?? nouvelleCarte(now);
	const { card } = planificateur.next(lireFsrs(carte.fsrs), now, reussi ? Rating.Good : Rating.Again);
	const suite = { ...carte, fsrs: enTexte(card), maj: now.toISOString() };
	if (reussi) {
		const jour = jourLocal(now);
		if (!suite.jours.includes(jour)) suite.jours = [...suite.jours, jour].slice(-2);
		if (!suite.acquise && suite.jours.length >= 2) suite.acquise = now.toISOString();
	}
	carnet.cartes[id] = suite;
	return suite;
}

// Le résultat d'un exercice auto-corrigé, pour une ou plusieurs choses.
// sens : 'reconnais' (questions à choix) ou 'produis' (remettre dans l'ordre).
// Tant que « je produis » est fermée, une production réussie compte comme une
// réussite de « je reconnais » ; une production ratée ne compte pas (on ne
// peut pas savoir si c'est la reconnaissance qui manque).
// Modifie le carnet et renvoie les identifiants des cartes touchées.
export function noter(carnet, choses, sens, reussi, now = new Date()) {
	const touchees = [];
	for (const chose of choses) {
		const reconnais = idCarte(chose, 'reconnais');
		const produis = idCarte(chose, 'produis');
		let id = sens === 'produis' && carnet.cartes[produis] ? produis : reconnais;
		if (sens === 'produis' && id === reconnais && !reussi) continue;
		const carte = noterCarte(carnet, id, reussi, now);
		touchees.push(id);
		// « je reconnais » vient d'être acquise : « je produis » s'ouvre.
		if (id === reconnais && carte.acquise && !carnet.cartes[produis]) {
			carnet.cartes[produis] = nouvelleCarte(now);
			touchees.push(produis);
		}
	}
	return touchees;
}

// L'état d'une carte, pour l'affichage : 'fermee', 'nouvelle', 'en-cours', 'acquise'.
export function etatCarte(carnet, chose, sens) {
	const carte = carnet.cartes[idCarte(chose, sens)];
	if (!carte) return sens === 'produis' ? 'fermee' : 'nouvelle';
	if (carte.acquise) return 'acquise';
	return carte.fsrs.state === State.New ? 'nouvelle' : 'en-cours';
}

// Les cartes à revoir à cette date, les plus en retard d'abord.
export function aRevoir(carnet, now = new Date()) {
	return Object.entries(carnet.cartes)
		.filter(([, c]) => new Date(c.fsrs.due) <= now)
		.sort(([, a], [, b]) => new Date(a.fsrs.due) - new Date(b.fsrs.due))
		.map(([id]) => id);
}

// Fusion du carnet du navigateur avec celui du compte : pour chaque carte,
// la plus récemment modifiée gagne. Renvoie le carnet fusionné et la liste
// des cartes du navigateur plus récentes que celles du compte (à envoyer).
export function fusionner(local, distant) {
	const cartes = { ...distant };
	const aEnvoyer = [];
	for (const [id, carte] of Object.entries(local)) {
		if (!distant[id] || new Date(carte.maj) > new Date(distant[id].maj)) {
			cartes[id] = carte;
			aEnvoyer.push(id);
		}
	}
	return { cartes, aEnvoyer };
}

// Relit un carnet gardé ; tout ce qui n'a pas la bonne forme est ignoré.
export function relire(texte) {
	try {
		const c = JSON.parse(texte);
		if (c && c.version === VERSION && c.cartes && typeof c.cartes === 'object') {
			return { version: VERSION, proprietaire: c.proprietaire ?? null, cartes: c.cartes };
		}
	} catch (e) {
		/* texte abîmé : on repart d'un carnet vide */
	}
	return carnetVide();
}
