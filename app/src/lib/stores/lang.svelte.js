import { browser } from '$app/environment';

// Langue d'interface partagée par tout le site (avant, chaque page avait
// la sienne — seul l'accueil en avait une en réalité). Le choix est
// mémorisé d'une visite à l'autre, et reporté sur l'attribut lang du
// document : sans ça un lecteur d'écran lit le français avec les règles
// de prononciation occitanes, et les moteurs de recherche se trompent
// aussi sur la langue de la page.

const STORAGE_KEY = 'lo-ligam-lang';
const SUPPORTED = ['oc', 'fr'];

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
