// Les lots à trier sur /admin/triar (Romain, 2026-11-06). Un lot = une liste
// d'éléments { clau, titol, sotstitol, context, dessenh | imatge | tèxte }.
// Pour en ajouter un (photos, mots, définitions, textes…) : une entrée ici,
// avec un id court (20 signes au plus, il sert de « modul » dans les remarques)
// et des clés stables (elles servent à retrouver l'élément dans le code).
import { SCENAS, GROPS } from '../plueja/scenas.js';
import { cheminsDe } from '../plueja/dessenhs.js';
import { PAISATGES, TEMAS } from '../paisatges/paisatges.js';

// Un mot corrigé après le tri garde sa clé d’origine : le choix de Romain le suit.
const CLAUS_ANCIANAS = { 'Qu’es aquò ?': 'Qué es aquò ?' }; // corrigé le 06-11 (Romain : « Qu’es aquò »)

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
					const clau = clausPresas.has(nom) ? `${nom} · ${def}` : nom;
					clausPresas.add(clau);
					el = { clau, titol: oc, sotstitol: def, context: [], dessenh: chemins };
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
	},
	{
		// le sas du relief (Romain, 06-11 : « en option et d'abord dans un sas de
		// validation ») : un cœur ouvre le relief à tous sur cette photo (sa clé va
		// dans GARDATS, lib/paisatges/releu.js) ; une croix la renvoie à refaire
		id: 'releu',
		nom: { oc: 'Lo relèu dels paisatges', fr: 'Le relief des paysages' },
		consigna:
			'Regarde la photo glisser, en grand au besoin : ce qui est proche doit bouger à peine plus que le fond, sans bord qui se déchire ni tache. Le cœur ouvre le relief à tous sur cette photo ; la croix le renvoie à refaire, avec ce qui gêne.',
		elements: () =>
			PAISATGES.map((p) => ({
				clau: p.clau,
				titol: p.mots
					.slice(0, 3)
					.map((m) => m[0])
					.join(' · '),
				sotstitol: TEMAS.find((t) => t.id === p.tema)?.nom.fr ?? '',
				context: [],
				relèu: p
			}))
	}
];
