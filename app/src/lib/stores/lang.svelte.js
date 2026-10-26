import { browser } from '$app/environment';

// Langue d'interface partagée par tout le site (avant, chaque page avait
// la sienne — seul l'accueil en avait une en réalité). Le choix est
// mémorisé d'une visite à l'autre, et reporté sur l'attribut lang du
// document : sans ça un lecteur d'écran lit le français avec les règles
// de prononciation occitanes, et les moteurs de recherche se trompent
// aussi sur la langue de la page.
//
// Occitan et français restent le cœur (bascule Òc / Fr en avant). Un globe
// ajoute l'espagnol, l'anglais et le catalan pour qui découvre le site
// (cahier §11, 2026-10-25). L'occitan reste le repli : ce qui n'est pas
// encore traduit s'affiche en occitan — sur un site qui enseigne l'occitan,
// ce n'est pas un défaut. Le contenu occitan lui-même (noms de la carte dans
// leur dialecte, corpus des leçons) ne se traduit pas.

const STORAGE_KEY = 'lo-ligam-lang';

// Les deux langues du cœur, puis celles du globe. L'ordre sert à l'affichage.
export const PRINCIPALAS = ['oc', 'fr'];
export const AUTRAS = ['es', 'en', 'ca'];
const SUPPORTED = [...PRINCIPALAS, ...AUTRAS];

// Étiquettes des langues dans leur propre langue (endonymes), plus un code
// court pour les affichages compacts.
export const LENGAS = {
	oc: { nom: 'Occitan', curt: 'Òc' },
	fr: { nom: 'Français', curt: 'Fr' },
	es: { nom: 'Español', curt: 'Es' },
	en: { nom: 'English', curt: 'En' },
	ca: { nom: 'Català', curt: 'Ca' }
};

let current = $state('oc');

export const lang = {
	get current() {
		return current;
	},
	set current(value) {
		if (!SUPPORTED.includes(value)) return;
		current = value;
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// Mode privé ou stockage plein : le choix vaut pour la session,
			// ce n'est pas une raison pour casser le changement de langue.
		}
		document.documentElement.lang = value;
	}
};

// Choisit, dans un objet { oc, fr, es, en, ca }, le texte de la langue
// courante, avec repli sur l'occitan (puis le français, puis vide). Appelée
// dans un modèle ou un $derived, elle se recalcule au changement de langue
// car elle lit lang.current. À utiliser pour tout texte traduit dans les
// cinq langues ; l'ancien idiome « fr ? … : … » reste valable tant qu'un
// texte n'a que l'occitan et le français.
export function tria(obj) {
	if (!obj) return '';
	// « || » et non « ?? » : txt()/ligam() renvoient '' (chaîne vide) pour une
	// langue absente, et '' n'est pas nul. Sans ça, un texte éditable non encore
	// traduit disparaîtrait en es/en/ca au lieu de retomber sur l'occitan.
	return obj[current] || obj.oc || obj.fr || '';
}

// Restauration au démarrage. Volontairement hors de tout composant : la
// langue doit être posée avant le premier rendu visible.
if (browser) {
	let saved = null;
	try {
		saved = localStorage.getItem(STORAGE_KEY);
	} catch {
		saved = null;
	}
	if (SUPPORTED.includes(saved)) current = saved;
	document.documentElement.lang = current;
}
