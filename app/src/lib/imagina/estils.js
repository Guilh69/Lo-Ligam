// Les styles que Romain peut choisir pour ce qu'il imagine sur une photo (page Imaginar, 2026-11-13 :
// « il faut que je puisse choisir le style »).
//
// On ne propose que ce que l'outil de fabrication sait faire aujourd'hui (outils/photos-oc/talhar.py) ; `fabricacion`
// dit par quelle voie : « greffe » = une vraie plaque photographiée par Romain, reprise et réécrite ; « plaque » =
// plaque dessinée ; « peint » = lettres peintes sur le mur, avec ou sans bandeau. L'aperçu de la page n'est qu'une
// esquisse à plat de ce style (couleurs, lettre, liseré), couchée sur le mur ; la lumière et le grain viennent à la
// fabrication. `mescla` et `opacitat` : la peinture laisse voir la pierre (aperçu seulement). Le dernier style,
// « liure », renvoie à la précision écrite.

/** Les trois familles de lettres, prises parmi les polices dont l'outil de fabrication se sert sous Windows. */
export const LETRAS = {
	bastons: { familha: "Bahnschrift, 'DIN Condensed', 'Roboto Condensed', 'Arial Narrow', sans-serif", pes: 600, estirament: '80%', larg: 0.5 },
	romana: { familha: "Constantia, 'Palatino Linotype', 'Book Antiqua', Georgia, serif", pes: 700, estirament: '100%', larg: 0.6 },
	egipciana: { familha: "Rockwell, 'Roboto Slab', Georgia, serif", pes: 700, estirament: '100%', larg: 0.62 }
};

export const ESTILS = [
	{
		id: 'montpelhier',
		naturas: ['placa'],
		fr: 'Plaque blanche, liseré et lettres rouges',
		detalh: 'une vraie plaque de Montpellier, reprise',
		fabricacion: 'greffe',
		fons: '#f3f2ed',
		tinta: '#a3263b',
		orla: '#a3263b',
		letra: 'romana',
		corn: 0.1
	},
	{ id: 'esmalt', naturas: ['placa', 'panel'], fr: 'Émail bleu, lettres blanches', fabricacion: 'plaque', fons: '#1c3a78', tinta: '#f3f1e8', orla: '#f3f1e8', letra: 'bastons', maj: true, corn: 0.04 },
	{ id: 'clara', naturas: ['placa', 'panel'], fr: 'Plaque claire, lettres noires', fabricacion: 'plaque', fons: '#eee9da', tinta: '#26262b', orla: '#26262b', letra: 'bastons', maj: true, corn: 0.04 },
	{ id: 'brun', naturas: ['panel'], fr: 'Panneau brun, lettres blanches', fabricacion: 'plaque', fons: '#5b3b27', tinta: '#f3f1e8', orla: '#f3f1e8', letra: 'bastons', corn: 0.06 },
	{ id: 'pintat-negre', naturas: ['ensenha', 'publicitat', 'pintura'], fr: 'Lettres peintes, noir passé', fabricacion: 'peint', tinta: '#2e2a2c', letra: 'bastons', maj: true, pintat: true, mescla: 'multiply', opacitat: 0.86 },
	{ id: 'pintat-roge', naturas: ['ensenha', 'publicitat', 'pintura'], fr: 'Lettres peintes, rouge passé', fabricacion: 'peint', tinta: '#7c2a20', letra: 'egipciana', maj: true, pintat: true, mescla: 'multiply', opacitat: 0.86 },
	{ id: 'pintat-blanc', naturas: ['ensenha', 'publicitat', 'pintura'], fr: 'Lettres peintes, blanc', fabricacion: 'peint', tinta: '#efe9d8', letra: 'bastons', maj: true, pintat: true, opacitat: 0.8 },
	{ id: 'bendel-clar', naturas: ['ensenha', 'publicitat', 'pintura'], fr: 'Bandeau peint clair, lettres sombres', fabricacion: 'peint', fons: '#e8dec4', tinta: '#3a3032', letra: 'bastons', maj: true, pintat: true, opacitat: 0.84 },
	{ id: 'bendel-escur', naturas: ['ensenha', 'publicitat', 'pintura'], fr: 'Bandeau peint sombre, lettres claires', fabricacion: 'peint', fons: '#2f3840', tinta: '#ece3cc', letra: 'egipciana', maj: true, pintat: true, opacitat: 0.88 },
	{ id: 'aficha', naturas: ['publicitat'], fr: 'Affiche de papier', fabricacion: 'plaque', fons: '#e9e2cf', tinta: '#1f1c1c', letra: 'egipciana', maj: true },
	{ id: 'liure', naturas: null, fr: 'Autre style', detalh: 'à décrire dans la précision', fabricacion: null, tinta: '#2a1a10', letra: 'bastons' }
];

export const nomEstil = (id) => ESTILS.find((e) => e.id === id)?.fr ?? id;

/** Les styles proposés pour une nature, le style libre en dernier. */
export const estilsDe = (natura) => ESTILS.filter((e) => !e.naturas || e.naturas.includes(natura));

/** Le style d'une nature choisi d'office : le premier. */
export const estilPerDefaut = (natura) => estilsDe(natura)[0].id;

// toutes les façons de couper n mots en k lignes (positions des coupes)
function* copas(n, k, deb = 1, pres = []) {
	if (pres.length === k - 1) {
		yield pres;
		return;
	}
	for (let i = deb; i <= n - (k - 1 - pres.length); i++) yield* copas(n, k, i + 1, [...pres, i]);
}

const INTERLINHA = 1.14;

/**
 * Met un texte en lignes dans un bloc de l × h : une à trois lignes, coupées entre les mots, de façon que la
 * lettre soit la plus grande possible. `mesura(ligne)` = largeur de la ligne pour une lettre de corps 1.
 * Renvoie { linhas, talha (corps de la lettre, dans l'unité de l et h), interlinha }.
 */
export function compausar(text, estil, l, h, mesura) {
	let t = String(text ?? '')
		.trim()
		.replace(/\s+/g, ' ');
	if (!t || !(l > 0) || !(h > 0)) return { linhas: [], talha: 0, interlinha: INTERLINHA };
	if (estil.maj) t = t.toLocaleUpperCase('fr');
	const mots = t.split(' ');
	if (mots.length > 12) mots.splice(11, mots.length - 11, mots.slice(11).join(' '));
	const marge = (estil.orla ? 0.17 : estil.fons ? 0.11 : 0.04) * h;
	const lu = Math.max(1, l - 2 * marge),
		hu = Math.max(1, h - 2 * marge);
	let melhor = null;
	for (let k = 1; k <= Math.min(3, mots.length); k++)
		for (const c of copas(mots.length, k)) {
			const bornas = [0, ...c, mots.length];
			const linhas = bornas.slice(0, -1).map((b, i) => mots.slice(b, bornas[i + 1]).join(' '));
			const larg = Math.max(...linhas.map(mesura), 1e-6);
			const talha = Math.min(lu / larg, hu / (k * INTERLINHA));
			if (!melhor || talha > melhor.talha * 1.0001) melhor = { linhas, talha };
		}
	return { ...melhor, interlinha: INTERLINHA };
}

/** Largeur approchée d'une ligne (corps 1) quand on ne peut pas mesurer la vraie police (hors navigateur). */
export const mesuraAproximada = (estil) => (linha) => linha.length * LETRAS[estil.letra].larg;
