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
// 'ar' (arabe standard moderne) : en cours depuis le 2026-10-26. S'écrit de droite
// à gauche (dir=rtl posé sur le document plus bas). Proposé au globe depuis le
// 2026-10-26 (décision de Romain : un bonus, l'ami arabophone corrigera ensuite
// par Editar). Pour le retirer du globe, passer ARABE_AU_GLOBE à false : il
// reste alors essayable par le lien ?lang=ar.
const ARABE_AU_GLOBE = true;
export const AUTRAS = ['es', 'en', 'ca', ...(ARABE_AU_GLOBE ? ['ar'] : [])];
const SUPPORTED = [...PRINCIPALAS, 'es', 'en', 'ca', 'ar'];
const ESSAI_KEY = 'lo-ligam-ar-essai';
// Les langues qui s'écrivent de droite à gauche.
const RTL = ['ar'];

// Étiquettes des langues dans leur propre langue (endonymes), plus un code
// court pour les affichages compacts.
export const LENGAS = {
	oc: { nom: 'Occitan', curt: 'Òc' },
	fr: { nom: 'Français', curt: 'Fr' },
	es: { nom: 'Español', curt: 'Es' },
	en: { nom: 'English', curt: 'En' },
	ca: { nom: 'Català', curt: 'Ca' },
	ar: { nom: 'العربية', curt: 'ع' }
};

// Les langues « secondes » (hors occitan), dans l'ordre alphabétique de leur
// nom : Català, English, Español, Français. L'occitan reste toujours la 1re
// place de la bascule ; la 2e montre la « seconde » langue (français par
// défaut), que le globe permet de changer (demande de Romain, 2026-10-26).
export const SEGONDAS = [...(ARABE_AU_GLOBE ? ['ar'] : []), 'ca', 'en', 'es', 'fr'];
const SEGONDA_KEY = 'lo-ligam-segonda';

let current = $state('oc');
let segonda = $state('fr');

export const lang = {
	get current() {
		return current;
	},
	set current(value) {
		if (!SUPPORTED.includes(value)) return;
		current = value;
		// la 2e place de la bascule garde la dernière langue non occitane choisie
		if (value !== 'oc') segonda = value;
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, value);
			localStorage.setItem(SEGONDA_KEY, segonda);
		} catch {
			// Mode privé ou stockage plein : le choix vaut pour la session,
			// ce n'est pas une raison pour casser le changement de langue.
		}
		document.documentElement.lang = value;
		document.documentElement.dir = RTL.includes(value) ? 'rtl' : 'ltr';
	},
	get segonda() {
		return segonda;
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
	let savedSegonda = null;
	let essaiAr = false;
	try {
		saved = localStorage.getItem(STORAGE_KEY);
		savedSegonda = localStorage.getItem(SEGONDA_KEY);
		essaiAr = localStorage.getItem(ESSAI_KEY) === '1';
		// lien d'essai : /?lang=ar, /?lang=es… (mémorisé comme un choix au globe)
		const demanda = new URLSearchParams(location.search).get('lang');
		if (SUPPORTED.includes(demanda)) {
			saved = demanda;
			localStorage.setItem(STORAGE_KEY, demanda);
			if (demanda === 'ar') {
				essaiAr = true;
				localStorage.setItem(ESSAI_KEY, '1');
			}
		}
	} catch {
		saved = null;
	}
	// l'arabe caché du globe ne retient personne tant qu'il n'est pas complet :
	// seul le lien d'essai l'active (sinon retour à l'occitan)
	if (saved === 'ar' && !ARABE_AU_GLOBE && !essaiAr) saved = null;
	if (SUPPORTED.includes(saved)) current = saved;
	// la 2e place de la bascule : la langue courante si ce n'est pas l'occitan,
	// sinon la dernière langue non occitane mémorisée (français par défaut)
	if (current !== 'oc') segonda = current;
	else if (SEGONDAS.includes(savedSegonda)) segonda = savedSegonda;
	document.documentElement.lang = current;
	document.documentElement.dir = RTL.includes(current) ? 'rtl' : 'ltr';
}
