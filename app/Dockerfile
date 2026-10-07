# Conteneur pour Scaleway Serverless Containers.
#
# Deux étapes : la première installe tout et construit le site, la seconde
# ne garde que le résultat. L'image finale ne contient donc ni le code
# source, ni les outils de construction, ni les dépendances de
# développement — elle démarre plus vite et offre moins de prise.

FROM node:22-alpine AS constructor
WORKDIR /app

# Les dépendances sont copiées seules d'abord : tant que package.json ne
# change pas, cette couche est réutilisée telle quelle et l'installation
# n'est pas rejouée à chaque modification du code.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Les tests passent avant la construction : une régression détectée bloque
# la mise en ligne, l'ancienne version reste en place (audit du 2026-10-08).
RUN npm test && npm run build && npm prune --omit=dev

# ---

FROM node:22-alpine
WORKDIR /app

# Ne jamais tourner en root : si une faille permettait d'exécuter du code,
# elle serait limitée à un compte sans privilèges.
RUN addgroup -S ligam && adduser -S ligam -G ligam

COPY --from=constructor --chown=ligam:ligam /app/build ./build
COPY --from=constructor --chown=ligam:ligam /app/node_modules ./node_modules
COPY --from=constructor --chown=ligam:ligam /app/package.json ./

USER ligam

# Scaleway fournit le port dans la variable PORT. 8080 est sa valeur par
# défaut, utilisée si rien n'est transmis.
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "build/index.js"]
