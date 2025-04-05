---
description: Rejoignez le développement du tableau de bord Node-RED 2.0. Apprenez comment vous pouvez contribuer à le rendre meilleur pour tous.
---

# Contribuer

Les contributions sont toujours les bienvenues pour le tableau de bord 2.0. Nous avons beaucoup d'idées géniales que nous voulons construire, et nous aimerions avoir votre aide !

## Structure du projet

### `/nodes`

Contient les fichiers qui définissent chacun des nœuds Node-RED qui composent le tableau de bord 2.0. Vous pouvez en savoir plus sur l'écriture de nœuds pour Node-RED [here](https://nodered.org/docs/creating-nodes/first-node).

### `/ui`

Contient notre application VueJS qui forme le cœur du tableau de bord 2.0. À l'intérieur de `/ui/src/widgets`, vous trouverez un ensemble de sous-répertoires, chacun contenant un fichier `.vue`. Ce sont ces fichiers qui définissent l'apparence et la fonctionnalité que les utilisateurs voient lors de la visualisation du tableau de bord.

### `/docs`

Un site de documentation [VitePress](https://vitepress.dev/) qui est utilisé pour générer la documentation pour Dashboard 2.0 (ce que vous lisez maintenant).

## Installation locale

### Pré-requis

- [Compte GitHub](https://github.com/) - Vous aurez besoin d'un compte GitHub pour faire une copie du code et contribuer à tous les changements.
- [Node.js](https://nodejs.org/en/download) - Node. s sera également fourni avec le gestionnaire de paquets Node (`npm`) qui est utilisé pour installer les dépendances, et exécuter le tableau de bord (et Node-RED) localement.
- [Git](https://git-scm.com/downloads) - Git est utilisé pour cloner le dépôt localement sur votre machine, et vous permet de pousser les changements vers le dépôt central sur GitHub.

### Cloner et construire le dépôt

1. **Connectez-vous à la machine appropriée :** Connectez-vous à la machine où vous avez installé Node-RED.

2. **Fork Repository:** Fork this repository to your own Github account:

   ![image](../assets/images/github-pr.png){data-zoomable}

3. **Cloner le dépôt Git Repo:** Cloner le dépôt forked de votre compte Github. Cela peut être n'importe où approprié sur votre machine (par exemple `/yourname/development/`) :

      git clone https://github.com/<your_github_account>/node-red-dashboard.git

4. **Installez les dépendances :** Depuis l'intérieur de votre répertoire cloné, installez tous les paquets dépendants (à partir du fichier `package.json`) :

      cd /node-red-dashboard
      npm install

5. Optionnellement _**générer une carte source**_ (pour mapper le code du tableau de bord minifié au code original), pour simplifier le débogage du code du tableau de bord frontal dans le navigateur. Sous Linux, cela peut être réalisé par :

      export NODE_ENV=développement

6. **Construire le tableau de bord :** Créer une version statique de l'interface utilisateur du tableau de bord, basée sur Vue CLI (qui a été installée à l'étape 3) :

       npm run build

   Autrement, utilisez `npm run build:dev` pour construire une version développeur ou utilisez `npm run dev` pour construire une version développeur et regarder les changements (rechargement chaud)

### Installer dans Node-RED

1. **Naviguez vers `.node-red`:** Dans un terminal, accédez à votre dossier `.node-red` (normalement à `~/.node-red`).

      cd ~/.node-red

2. **Supprimer le tableau de bord existant 2.0:** Note - si vous avez déjà installé ce tableau de bord via votre palette, vous devrez d'abord le désinstaller. Cela peut être fait depuis le gestionnaire de Palette dans Node-RED, ou via `npm` dans le terminal:

      npm désinstaller @flowfuse/node-rouged-dashboard

3. **Installez le tableau de bord 2.0:** Installez le tableau de bord forked dans votre système Node-RED à partir du dossier `.node-red` :

      npm install <path_to_your_forked_dashboard>

## Faire des changements

1. **Effectuez des modifications :** Effectuez les modifications appropriées.
   - **Éditeur de Node-ROUGE :** Pour les changements de Node-ROUGE vous travaillerez dans `/nodes` - les changements ici nécessiteront un redémarrage de Node-RED (et une actualisation de l'éditeur Node-RED) pour voir les dernières modifications.
      - Pour plus de commodité, vous pouvez utiliser `npm run watch:node-red` qui redémarrera Node-RED après tout changement à `/nodes`
      - Cela suppose que Node-RED est installé à `~/.node-red` et que vous avez `@flowfuse/node-red-dashboard` installé dans ce dossier (comme par étape 3 ci-dessus)
   - **Tableau de bord/interface utilisateur :** Pour les modifications apportées au tableau de bord/à l'interface utilisateur, voir `/ui` - les changements ici nécessiteront une reconstruction de l'interface utilisateur du Dashboard, qui peut être fait en exécutant `npm run build` (comme par étape 5. dans "Cloner & Build the Repository").
      - Pour plus de commodité, vous pouvez utiliser `npm exécuter watch:dashboard` qui se reconstruira automatiquement après les modifications de l'interface du tableau de bord
   - Les deux commandes de montre sont combinées en une seule commande sous `npm run watch`

2. **Rafraîchir le navigateur :** Rafraîchir le tableau de bord du navigateur sur `http(s)://votre_hôte_or_ip_address:1880/dashboard`

3. **Développez :** Répétez encore et encore l'étape 1 à 2 jusqu'à ce que vous soyez satisfait de vos résultats.

4. **Créer une branche:** Une fois que vous êtes prêt à publier vos modifications, dans votre répertoire de dépôt cloné (par ex. `/yourname/development/node-roud-dashboard`), créez une nouvelle branche pour tous les fichiers de votre tableau de bord forked :

      git checkout -b name_of_votre_nouvelle_branche

5. Dès que toutes vos modifications fonctionnent correctement, validez vos modifications :

       git commit -a -m "Description de vos modifications"

6. Poussez les modifications validées sur le fork du tableau de bord de votre compte Github :

       Git push origine

7. Dans votre dépôt de tableau de bord bifurqué (sur Github), basculez vers la nouvelle branche et [créez une pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Exécution locale de la documentation

1. **Exécutez Docs Dev Server :** Vous pouvez exécuter la documentation localement en exécutant la commande suivante à la racine du répertoire `/node-red-dashboard` :

      npm exécute docs:dev

   Cela lancera ensuite votre documentation à `http://localhost:5173/`
2. **Effectuer des modifications :** Faire les modifications appropriées à la documentation (`/docs`). La documentation sera mise à jour en direct, pas besoin de recompiler, redémarrer le serveur ou actualiser le navigateur.
