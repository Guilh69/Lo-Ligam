# Audio des modules — mode d'emploi pour Romain

Les boutons 🔊 du site s'activent automatiquement dès qu'un fichier audio
existe et que son chemin est renseigné dans les données du module. Voici
comment enregistrer et où poser les fichiers.

## Enregistrer (téléphone suffisant pour commencer)

1. Pièce calme, téléphone à ~20 cm de la bouche, à l'horizontale.
2. Une prise par **scène de dialogue** (lue en entier, rythme naturel,
   vitesse légèrement lente pour des débutants) et une par **expression**
   de la liste « À retenir ».
3. Format : m4a ou mp3, peu importe — on convertira si besoin.
4. Deux vitesses par scène quand tu auras le temps (lente + normale),
   comme le prévoit le cadre v0.3 — une seule pour démarrer, c'est déjà bien.

## Où poser les fichiers

Un dossier par module, noms en minuscules sans accents :

```
app/static/audio/moduls/
  1-1/
    scena-1.mp3        (le matin, sul mercat)
    scena-2.mp3        (lo ser, sus la plaça)
    adieu.mp3          (une expression = un fichier)
    bonjorn.mp3
    …
  1-2/ …
```

Ensuite dis à Claude « les audios du 1.1 sont posés » : il branche les
chemins dans les données du module et les boutons s'activent.

## Rappels du cadre v0.3 (décisions prises)

- La voix-modèle, c'est toi. Les dialogues auront aussi une **voix native**
  (locuteur nommé et remercié) avant publication définitive.
- La synthèse Votz n'est admise qu'en secours provisoire sur des corrigés,
  jamais sur les dialogues. (Clé séparée à demander à info@locongres.org
  si on veut prototyper.)
- Sobriété : viser des fichiers courts (< 300 Ko par scène si possible).
