// Les lots à trier sur /admin/triar (Romain, 2026-11-06). Un lot = une liste
// d'éléments { clau, titol, sotstitol, context, dessenh | imatge | tèxte }.
// Pour en ajouter un (photos, mots, définitions, textes…) : une entrée ici,
// avec un id court (20 signes au plus, il sert de « modul » dans les remarques)
// et des clés stables (elles servent à retrouver l'élément dans le code).
import { SCENAS, GROPS } from '../plueja/scenas.js';
import { cheminsDe, TINTAS } from '../plueja/dessenhs.js';
import { PAISATGES, TEMAS, MOTS } from '../paisatges/paisatges.js';
import { DECISIONS } from './decisions.js';

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
		// les décisions à trancher (point d'étape du 06-11 au soir) : en tête, la page s'ouvre dessus
		id: 'decisions',
		nom: { oc: 'Las decisions', fr: 'Les décisions à trancher' },
		consigna:
			'Le cœur valide la proposition ; la croix la refuse, avec ce que tu préfères si tu veux. Claude applique tes cœurs et revient vers toi sur les croix.',
		mots: {
			gardar: { oc: 'D’acòrdi', fr: 'je valide', compte: 'validées', titol: 'Valider', anonci: 'Validé' },
			refar: { oc: 'Non', fr: 'je refuse', compte: 'refusées', titol: 'Ne pas valider', anonci: 'Refusé' },
			comentari: 'Pourquoi, ou que préfères-tu ? Dicte ou écris ; tu peux laisser vide.'
		},
		fin: 'une décision reformulée reviendra ici.',
		elements: () => DECISIONS
	},
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
	},
	{
		// Romain pose lui-même les mots sur ses photos (07-11 : « une possibilité
		// d'écrire les mots et ajouter les ronds ») : le cœur envoie la photo
		// telle qu'il la laisse (lib/paisatges/CartaPausar.svelte) ; Claude lit
		// les changements (scripts/triar.mjs --lot pausar), vérifie chaque mot
		// avec lo Congrès, puis l'écrit dans lib/paisatges/paisatges.js
		id: 'pausar',
		nom: { oc: 'Pausar los mots', fr: 'Poser les mots' },
		consigna:
			'Touche la photo pour poser un rond, puis cherche son mot en français ou en occitan : tu choisis parmi les mots de lo Congrès (lo Basic) ou ceux déjà sur le site ; pour un nom de lieu (la Méditerranée, un sommet, un village), Wikidata propose son nom occitan, à vérifier. Touche deux fois un mot pour le changer, fais-le glisser pour le déplacer. « Plein écran » agrandit la photo. Le cœur envoie la photo telle que tu la laisses. La croix : si c’est la photo elle-même qui ne va pas.',
		mots: {
			gardar: { oc: 'Gardar', fr: 'c’est bon', compte: 'photos faites', titol: 'Envoyer la photo telle quelle', anonci: 'Envoyé' },
			refar: { oc: 'Refar', fr: 'à revoir', compte: 'à revoir', titol: 'La photo ne va pas', anonci: 'À revoir' },
			comentari: 'Qu’est-ce qui ne va pas sur cette photo ? Dicte ou écris ; tu peux laisser vide.'
		},
		fin: 'les mots que tu as posés passent par lo Congrès, puis en ligne.',
		elements: () =>
			PAISATGES.map((p) => ({
				clau: p.clau,
				titol: p.mots
					.slice(0, 3)
					.map((m) => m[0])
					.join(' · '),
				sotstitol: TEMAS.find((t) => t.id === p.tema)?.nom.fr ?? '',
				context: [],
				pausar: p,
				mots: p.mots.map(([oc, x, y]) => [oc, MOTS[oc] ?? '', x, y])
			}))
	}
];
