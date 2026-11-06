// Les lots à trier sur /admin/triar (Romain, 2026-11-06). Un lot = une liste
// d'éléments { clau, titol, sotstitol, context, dessenh | imatge | tèxte }.
// Pour en ajouter un (photos, mots, définitions, textes…) : une entrée ici,
// avec un id court (20 signes au plus, il sert de « modul » dans les remarques)
// et des clés stables (elles servent à retrouver l'élément dans le code).
import { SCENAS, GROPS } from '../plueja/scenas.js';
import { cheminsDe, TINTAS } from '../plueja/dessenhs.js';

// Un mot corrigé après le tri garde sa clé d’origine : le choix de Romain le suit.
const CLAUS_ANCIANAS = { 'Qu’es aquò ?': 'Qué es aquò ?' }; // corrigé le 06-11 (Romain : « Qu’es aquò »)

// Un dessin gardé puis refait revient dans la pile : sa clé prend le numéro de sa nouvelle version.
const VERSIONS = { marroquina: 2, argerian: 2 }; // en drapeau, comme les autres nationalités (06-11)

/** Les dessins de la poussière d'or (Remira), chacun une seule fois. */
function dessenhs() {
	const parDessenh = new Map(); // un même dessin peut servir à plusieurs ambiances
	const clausPresas = new Set();
	for (const g of GROPS)
		for (const s of SCENAS.filter((sc) => sc.grop === g.id))
			for (const [oc, def] of s.mots) {
				const chemins = cheminsDe(oc, def);
				if (!chemins) continue;
				let el = parDessenh.get(chemins);
				if (!el) {
					// deux dessins pour un même mot (« la cosina ») : la définition les distingue
					const nom = CLAUS_ANCIANAS[oc] ?? oc;
					const clau = (clausPresas.has(nom) ? `${nom} · ${def}` : nom) + (VERSIONS[oc] ? ` · v${VERSIONS[oc]}` : '');
					clausPresas.add(clau);
					el = { clau, titol: oc, sotstitol: def, context: [], dessenh: chemins, tintas: TINTAS[oc] ?? null };
					parDessenh.set(chemins, el);
				}
				if (!el.context.includes(s.nom.oc)) el.context.push(s.nom.oc);
			}
	return [...parDessenh.values()];
}

export const LOTS = [
	{
		id: 'dessenhs',
		nom: { oc: 'Los dessenhs de Remira', fr: 'Les dessins de Remira' },
		consigna: 'Le cœur garde le dessin tel quel ; la croix le renvoie à refaire, avec ce qu’il faut changer.',
		elements: dessenhs
	}
];
