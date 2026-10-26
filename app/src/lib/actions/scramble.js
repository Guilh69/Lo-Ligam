// Fondu croisé lettre par lettre, sans jamais muter le texte affiché
// pendant l'animation : chaque version de langue (occitan, français, et
// depuis 2026-10-25 espagnol, anglais, catalan) est construite une seule
// fois au montage, empilée sur les autres (CSS Grid, même cellule), et le
// changement de langue se contente de faire basculer leur opacité/flou.
// Comme aucune lettre ne change de contenu pendant la transition, il n'y a
// aucun recalcul de mise en page en cours d'animation — juste un fondu doux,
// stable quelle que soit la longueur du texte dans chaque langue.
//
// On empile une couche par langue fournie (oc toujours là, sert de repli) ;
// une langue absente n'a pas de couche et retombe sur l'occitan.
const CODES = ['oc', 'fr', 'es', 'en', 'ca', 'ar'];

function buildLayer(str, stagger, code) {
	const layer = document.createElement('span');
	layer.style.gridArea = '1 / 1';
	layer.style.display = 'block';
	// L'arabe (écriture liée, de droite à gauche) ne se découpe pas lettre par
	// lettre : les lettres s'afficheraient isolées. On fond le bloc entier.
	if (code === 'ar') {
		const mot = document.createElement('span');
		mot.textContent = str;
		mot.style.transition = 'opacity 560ms ease-in-out, filter 560ms ease-in-out, color 240ms ease';
		layer.appendChild(mot);
		return layer;
	}
	let i = 0;
	for (const ch of str) {
		const letter = document.createElement('span');
		letter.textContent = ch;
		const delay = i * stagger;
		// La color tanben se propaga letra per letra (24 ms d'escart) : quand
		// un parent càmbia de color al subrevòl, l'encra S'ESPANDÍS sus la
		// frasa al luòc d'aparéisser d'un còp (demanda Romain 2026-10-06).
		letter.style.transition = `opacity 560ms ease-in-out ${delay}ms, filter 560ms ease-in-out ${delay}ms, color 240ms ease ${i * 24}ms`;
		layer.appendChild(letter);
		i += 1;
	}
	return layer;
}

function setVisible(layer, visible) {
	for (const letter of layer.children) {
		letter.style.opacity = visible ? '1' : '0';
		letter.style.filter = visible ? 'blur(0px)' : 'blur(2px)';
	}
	layer.style.pointerEvents = visible ? 'auto' : 'none';
	layer.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

export function scramble(node, params) {
	const stagger = 6;
	node.style.display = params.inline ? 'inline-grid' : 'grid';
	// Sens aquò, la colomna implicita de la grasilha se dimensiona sul mot
	// lo mai long de las jaças (min-content) : se aquel mot es mai large que
	// la boita, la pista despassa e s'ancòra a ESQUÈRRA — lo tèxte pareis
	// alara decalat cap a drecha. Amb una pista de 100 %, lo contengut tròp
	// large despassa simetricament, coma de tèxte normal centrat.
	if (!params.inline) node.style.gridTemplateColumns = '100%';

	let textos = {};
	let jaças = {};

	function bastir(p) {
		textos = {};
		jaças = {};
		node.textContent = '';
		for (const c of CODES) {
			if (p[c] == null) continue;
			textos[c] = p[c];
			const jaça = buildLayer(p[c], stagger, c);
			jaças[c] = jaça;
			node.appendChild(jaça);
		}
	}

	// La langue courante si elle a une couche, sinon l'occitan (repli).
	function mostrar(lang) {
		const actiu = jaças[lang] ? lang : 'oc';
		for (const c of Object.keys(jaças)) setVisible(jaças[c], c === actiu);
	}

	bastir(params);
	mostrar(params.lang);

	return {
		// Rebastís las jaças sonque se un tèxte cambièt vertadièrament
		// (contengut vengut de l'admin cargat après lo montatge) — jamai al
		// simple cambiament de lenga, per gardar l'animacion de fondut.
		update(newParams) {
			const cambiat = CODES.some((c) => newParams[c] !== textos[c]);
			if (cambiat) bastir(newParams);
			mostrar(newParams.lang);
		}
	};
}
