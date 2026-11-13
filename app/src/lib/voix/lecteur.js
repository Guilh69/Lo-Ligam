// Un seul son à la fois dans la leçon : lancer une phrase arrête la précédente
// (celle d'un autre bloc aussi). Navigateur seulement (utilise Audio).
let arretActuel = null;

/** Déclare un nouveau son en cours ; arrête le précédent. `arret` l'interrompt. */
export function prendre(arret) {
	const avant = arretActuel;
	arretActuel = arret;
	if (avant && avant !== arret) avant();
}

/** Libère la place si `arret` est toujours le son en cours. */
export function liberer(arret) {
	if (arretActuel === arret) arretActuel = null;
}

/** Joue un fichier ; `onFin` est appelé à la fin, à l'arrêt ou en cas d'échec. */
export function jouer(src, onFin) {
	let a;
	const arret = () => {
		try {
			a?.pause();
		} catch (e) {
			/* jamais bloquant */
		}
		liberer(arret);
		onFin?.();
	};
	try {
		a = new Audio(src);
		prendre(arret);
		a.addEventListener('ended', arret);
		a.addEventListener('error', arret);
		a.play()?.catch(arret);
	} catch (e) {
		arret();
	}
	return arret;
}
