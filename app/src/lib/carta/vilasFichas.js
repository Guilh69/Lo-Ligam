// Villes qui ont (ou auront) leur fiche : histoire du territoire, lien avec
// l'occitan, où l'apprendre… (projet de Romain, 2026-10-07). Sur la carte,
// le lien « Descobrir la vila » est dans la fiche de la commune quand on la
// choisit (FichaComuna.svelte) ; il remplace le repère doré d'avant (Romain,
// 2026-10-11).
//
// Liste provisoire, écrite ici : elle passera dans l'admin de la carte
// (/admin/carta) quand les premières fiches existeront. `ligam` = adresse de
// la page de la ville ; null tant qu'elle n'est pas écrite (la bulle dit
// alors « Lèu »).
//
// Montpelhièr sert de prototype pour valider l'allure du repère.
export const VILAS_FICHAS = [{ nom: 'Montpelhièr', lon: 3.88, lat: 43.61, ligam: null }];
