---
description: En savoir plus sur les choix technologiques du tableau de bord 2.0
---

# À propos du tableau de bord Node-RED 2.0

Bienvenue dans la documentation du tableau de bord Node-RED 2.0, le successeur de l'original et très populaire [Tableau de bord Node-RED](https://flows.nodered.org/node/node-red-dashboard).

Ce projet a été formé par [FlowFuse](https://flowfuse.com/), dans le cadre des efforts visant à mettre à jour le tableau de bord original pour s'éloigner d'Angular v1. qui a longtemps été dépréciée. Vous pouvez lire notre déclaration complète sur _pourquoi_ nous construisons le tableau de bord 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/).

## Technologies

### Node-ROUGE

[Node-RED](https://nodered.org/) is a flow-based programming tool, originally developed by IBM's Emerging Technology Services team and now a part of the JS Foundation. Il fournit un éditeur basé sur le navigateur qui facilite le câblage des flux en utilisant la large gamme de nœuds de la palette qui peuvent être déployés à son exécution en un seul clic.

### Vue.js v3.0

[Vue.js](https://vuejs.org/) est un framework JavaScript progressif et incrémentiellement adoptable pour construire l'interface utilisateur sur le web. C'est un choix populaire pour la construction d'applications web modernes.

Nous avons choisi Vue.js par rapport à d'autres frameworks populaires comme React et Angular en raison de sa courbe d'apprentissage peu profonde, et de la facilité d'utilisation/de lisibilité pour les développeurs non-front-end.

Nous utilisons également la [bibliothèque de composants Vuetify](https://vuetifyjs.com/en/components/all/), qui est un framework de composants Material Design pour Vue.js. Il vise à fournir des composants propres, sémantiques et réutilisables qui font de la construction de votre application un jeu d'enfant.

### Socket IO

[Socket.IO](https://socket.io/) permet une communication en temps réel, bidirectionnelle et basée sur des événements. Il fonctionne sur toutes les plates-formes, navigateurs ou appareils, en se concentrant également sur la fiabilité et la vitesse.

Dans Dashboard 2.0, nous utilisons Socket IO pour communiquer entre Node-RED et l'interface utilisateur du Dashboard.
