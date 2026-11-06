# Tableaux peints d'après les photos de Romain (6 novembre 2026)

Cinq paysages peints coup de pinceau par coup de pinceau, par programme, d'après les photos de Romain (`app/static/apren/paisatges/{nom}-1920.webp`) : la Garonne à Toulouse (`garona`), Sant Guilhèm (`vilatge`), les gorges d'Erau (`riu`), la plaine vue sous les arbres (`plana`), le pin au-dessus de la mer (`mar-pin`).

Faits pour les affiches de la salle de jeux, puis écartés le soir même : Romain préfère, pour chaque famille de jeux, une illustration qui montre le jeu (cahier §11, 06-11). Les tableaux restent ici **en attente d'un usage** : décoration, fond d'une page calme, carte postale dans un jeu, une autre scène.

- `{nom}-800.webp` (800 × 600) et `{nom}-560.webp` (560 × 420) : prêts pour le site, de 10 à 40 Ko.
- Les originaux (1920 × 1440, PNG, 1 à 2,5 Mo) sont hors Git : `Documents\6_Projectes\Lo_Ligam_hors-git\design-stock\pinturas\`.
- Le programme : `outils/pintor/pintor5.py` (avec `zonas.py` pour le ciel et l'eau). Repeindre un paysage : `py pintor5.py <dossier des photos> <version> garona` depuis `outils/pintor/` ; `planche.py` met chaque photo à côté de son tableau.
- Sur le site : prévoir la mention discrète « illustration faite par IA » (cahier §11, 06-11).
