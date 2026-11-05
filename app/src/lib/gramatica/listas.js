// Ce qu'une fiche de grammaire a le droit d'employer : les types de blocs que
// FichaGramatica.svelte sait mettre en page, les couleurs qu'il définit, les
// pictogrammes connus. Le test fichas.test.js s'en sert pour refuser une fiche
// fautive avant qu'elle parte en ligne. En ajouter un = changer aussi le code.

export const BLOCS = ['intro', 'nota', 'indic', 'seguida', 'font', 'cartas', 'copas', 'colonas', 'relacionar', 'marcas', 'cultura', 'fonts'];

export const COLORS = ['pruna', 'oliva', 'blau'];

// dessinés pour la grammaire (PictoFicha.svelte)
export const PICTOS_PROPRES = ['vendre', 'voler', 'ieu', 'escotar'];

// ceux des cases du site ($lib/apren/Pictograma.svelte), à tenir à jour avec lui
export const PICTOS_SITE = ['visio', 'parcors', 'jocs', 'mots', 'progression', 'carta', 'wiki', 'obras', 'musica', 'articles', 'grops', 'forum', 'ideas', 'imatges', 'medias', 'television', 'literatura', 'cinema', 'pintura', 'scena'];

export const PICTOS = [...PICTOS_PROPRES, ...PICTOS_SITE];
