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
		letter.style.transition = `opacity 560ms ease-in-out ${delay}ms, filter 560ms ease-in-out ${delay}ms`;
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
	const { oc, fr } = params;
	node.style.display = 'grid';
	node.textContent = '';

	const stagger = 6;
	const ocLayer = buildLayer(oc, stagger);
	const frLayer = buildLayer(fr, stagger);
	node.appendChild(ocLayer);
	node.appendChild(frLayer);
	setVisible(ocLayer, params.lang === 'oc');
	setVisible(frLayer, params.lang !== 'oc');

	return {
		update(newParams) {
			setVisible(ocLayer, newParams.lang === 'oc');
			setVisible(frLayer, newParams.lang !== 'oc');
		}
	};
}
