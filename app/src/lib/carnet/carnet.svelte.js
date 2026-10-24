// Le carnet de révision de l'élève (chantier 20, décisions du 2026-10-24) :
// gardé dans le navigateur sans compte, rattaché au compte (table
// carnet_cartes, supabase/supabase-carnet.sql) dès que la personne est
// connectée. Les règles (FSRS, deux cartes, acquise en deux jours) sont dans
// regles.js. Lecture et écriture protégées : sans mémoire du navigateur
// (navigation privée…) ou sans réseau, la leçon marche quand même.
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { session, authReady } from '$lib/authStore';
import { carnetVide, noter, relire, fusionner } from './regles.js';

const CLE = 'lo-ligam-carnet';
const TABLE = 'carnet_cartes';

export const carnet = $state(carnetVide());

function lireLocal() {
	try {
		return relire(localStorage.getItem(CLE));
	} catch (e) {
		return carnetVide();
	}
}

function ecrireLocal() {
	try {
		localStorage.setItem(CLE, JSON.stringify(carnet));
	} catch (e) {
		/* mémoire du navigateur indisponible : le carnet vit le temps de la page */
	}
}

function remplacer(suite) {
	carnet.proprietaire = suite.proprietaire;
	carnet.cartes = suite.cartes;
}

async function envoyer(ids, uid) {
	if (!ids.length) return true;
	const lignes = ids.map((id) => ({
		user_id: uid,
		carte_id: id,
		etat: $state.snapshot(carnet.cartes[id]),
		maj: carnet.cartes[id].maj
	}));
	const { error } = await supabase.from(TABLE).upsert(lignes);
	return !error;
}

// Rattache le carnet au compte connecté, ou le détache à la déconnexion.
async function synchroniser(s) {
	const uid = s?.user?.id ?? null;
	if (!uid) {
		// Déconnexion : le carnet est à l'abri dans le compte, l'appareil
		// repart d'un carnet vide (un autre élève peut s'en servir).
		if (carnet.proprietaire) {
			remplacer(carnetVide());
			ecrireLocal();
		}
		return;
	}
	try {
		const { data, error } = await supabase.from(TABLE).select('carte_id, etat');
		if (error) return;
		const distant = Object.fromEntries((data ?? []).map((l) => [l.carte_id, l.etat]));
		// Un carnet déjà rattaché à un autre compte ne se mélange pas.
		const local = carnet.proprietaire && carnet.proprietaire !== uid ? {} : $state.snapshot(carnet.cartes);
		const { cartes, aEnvoyer } = fusionner(local, distant);
		remplacer({ proprietaire: carnet.proprietaire, cartes });
		if (await envoyer(aEnvoyer, uid)) carnet.proprietaire = uid;
		ecrireLocal();
	} catch (e) {
		/* réseau ou table absente : le carnet reste dans le navigateur */
	}
}

let demarre = false;

// À appeler par les pages qui lisent ou notent le carnet.
export function demarrerCarnet() {
	if (!browser || demarre) return;
	demarre = true;
	remplacer(lireLocal());
	const suivre = () => session.subscribe((s) => synchroniser(s));
	if (get(authReady)) suivre();
	else {
		const arreter = authReady.subscribe((pret) => {
			if (pret) {
				queueMicrotask(() => arreter());
				suivre();
			}
		});
	}
}

// Résultat d'un exercice auto-corrigé : note les cartes des choses testées.
export function noterExercice(choses, sens, reussi) {
	if (!browser || !choses?.length) return;
	const touchees = noter(carnet, choses, sens, reussi);
	ecrireLocal();
	const uid = get(session)?.user?.id;
	if (uid && carnet.proprietaire === uid) {
		envoyer(touchees, uid).catch(() => {
			/* pas grave : la prochaine synchronisation renverra la carte */
		});
	}
}
