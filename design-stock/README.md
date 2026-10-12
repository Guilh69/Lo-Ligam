# Design stock — exports Canva

Stock de designs récupérés depuis le Canva de Lo Ligam (dossier "Lo Ligam" → "VF" pour les publications, "Logo" pour le logo), pour servir de référence visuelle et de matière à réintégrer plus tard. Ce ne sont pas des écrans du site — juste des visuels sources.

## Organisation

- `logo/` — le logo officiel (croix occitana + « Lo ligam »).
- `canva-vf/<NN-nom-du-theme>/` — un dossier par thème de publication Instagram (ex. `03-Cos-uman`, `10-Planetas`), avec un PNG par design à l'intérieur.
- `Inspiration/<chantier>/` — captures de sites qui plaisent (depuis le 2026-10-12), mode d'emploi dans `Inspiration/LISEZ-MOI.md`.
- `icones/` — illustrations sources des icônes du site (mas, carte de l'occitan de 1900).
- `MP4/` — vidéos (hors Git) ; `brut/` — photos et SVG bruts lourds (hors Git).
- **Poids** : rien de plus de 1 Mo dans Git (règle du 2026-10-12, cahier §11) ; les gros fichiers restent ici sur le disque.

## État (29 juillet 2026)

Récupération terminée. 214 fichiers PNG, répartis dans 35 dossiers thématiques (`canva-vf/`) + le logo, couvrant l'intégralité du dossier Canva "VF" (36 thèmes numérotés + Francitan + Carta linguistic ; 3 dossiers listés dans Canva n'avaient aucun design exporté — probablement du contenu vidéo non indexé côté API).

Le dossier "En cours" du Canva (brouillons/travaux non finalisés) n'a volontairement pas été récupéré.
