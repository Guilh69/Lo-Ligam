// Sort un élément de sa place pour le poser à la fin de <body>. Sert aux
// panneaux en plein écran qui naissent dans un conteneur à empilement propre
// (bandeau de l'accueil : z-index, transform au défilement) et qui doivent
// passer au-dessus de toute la page.
export function portal(node) {
	document.body.appendChild(node);
	return {
		destroy() {
			node.remove();
		}
	};
}
