// Fondu croisé lettre par lettre, sans jamais muter le texte affiché
// pendant l'animation : les deux versions (occitan et français) sont
// construites une seule fois au montage, empilées l'une sur l'autre
// (CSS Grid, même cellule), et le changement de langue se contente de
// faire basculer leur opacité/flou. Comme aucune lettre ne change de
// contenu pendant la transition, il n'y a aucun recalcul de mise en
// page en cours d'animation — juste un fondu doux, stable quelle que
// soit la longueur du texte dans chaque langue.
function buildLayer(str, stagger) {
	const layer = document.createElement('span');
	layer.style.gridArea = '1 / 1';
	layer.style.display = 'block';
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
	// lo mai long de las doas jaças (min-content) : se aquel mot es mai
	// large que la boita, la pista despassa e s'ancòra a ESQUÈRRA — lo
	// tèxte pareis alara decalat cap a drecha (vist per Romain sul títol
	// « T'ACOMPANHA » en capitalas). Amb una pista de 100 %, lo contengut
	// tròp large despassa simetricament, coma de tèxte normal centrat.
	if (!params.inline) node.style.gridTemplateColumns = '100%';

	let oc = params.oc;
	let fr = params.fr;
	let ocLayer = buildLayer(oc, stagger);
	let frLayer = buildLayer(fr, stagger);
	node.textContent = '';
	node.appendChild(ocLayer);
	node.appendChild(frLayer);
	setVisible(ocLayer, params.lang === 'oc');
	setVisible(frLayer, params.lang !== 'oc');

	return {
		// Rebastís las doas jaças sonque se lo tèxte cambièt vertadièrament
		// (contengut vengut de l'admin cargat après lo montatge) — jamai al
		// simple cambiament de lenga, per gardar l'animacion de fondut.
		update(newParams) {
			if (newParams.oc !== oc || newParams.fr !== fr) {
				oc = newParams.oc;
				fr = newParams.fr;
				ocLayer = buildLayer(oc, stagger);
				frLayer = buildLayer(fr, stagger);
				node.textContent = '';
				node.appendChild(ocLayer);
				node.appendChild(frLayer);
			}
			setVisible(ocLayer, newParams.lang === 'oc');
			setVisible(frLayer, newParams.lang !== 'oc');
		}
	};
}
