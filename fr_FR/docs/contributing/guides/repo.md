---
description: Comprendre la structure du dépôt de Node-RED Dashboard 2.0 pour une meilleure gestion et une meilleure contribution du code.
---

# Structure du dépôt

Le but de cette page est de donner un aperçu de la façon dont le tableau de bord 2. est structuré de sorte que vous puissiez mieux naviguer dans le référentiel et contribuer efficacement.

## Dossiers du cœur

Le référentiel contient deux dossiers principaux:

### /nodes

Le répertoire `/nodes` contient la collection des nœuds Node-RED qui sont disponibles dans l'éditeur Node-RED. Ces nœuds sont responsables de la gestion de la configuration du tableau de bord, quels widgets sont affichés, et pour l'envoi et la réception d'événements vers et depuis le tableau de bord, en fonction de leur configuration dans l'éditeur Node-RED.

### /ui

Ce dossier contient notre application Vue.js. Cela peut être construit en utilisant `npm run build`, et la sortie de cette version est ensuite copiée dans le répertoire `/dist`, où elle est servie par Node-RED.

