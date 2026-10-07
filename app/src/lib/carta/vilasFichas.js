// Villes qui ont (ou auront) leur fiche : histoire du territoire, lien avec
// l'occitan, où l'apprendre… (projet de Romain, 2026-10-07). Sur la carte,
// chacune reçoit le repère doré de Lo Ligam, cliquable à tous les niveaux de
// zoom : on ne peut pas effacer un nom des tuiles OSM (ce sont des images),
// alors on ajoute NOTRE repère au lieu de doubler le nom.
//
// Liste provisoire, écrite ici : elle passera dans l'admin de la carte
// (/admin/carta) quand les premières fiches existeront. `ligam` = adresse de
// la page de la ville ; null tant qu'elle n'est pas écrite (la bulle dit
// alors « Lèu »).
//
// Montpelhièr sert de prototype pour valider l'allure du repère.
export const VILAS_FICHAS = [{ nom: 'Montpelhièr', lon: 3.88, lat: 43.61, ligam: null }];
