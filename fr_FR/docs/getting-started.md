---
description: Kickstart votre voyage Node-RED Dashboard 2.0 avec ce guide de démarrage. Parfait pour les débutants.
---

<script setup>
    importer { ref } à partir de 'vue'
    importer FlowViewer de '. components/FlowViewer.vue'
    import ExemppleDesignPatterns from '.. examples/design-patterns.json'
    import RecommendedTutorials from './components/RecommendedTutorials.vue'

    const examples = ref({
      'design-patterns': ExampleDesignPatterns,
    })
</script>

# Commencer

## À propos de

Bienvenue dans la documentation du tableau de bord Node-RED 2.0, le successeur du tableau de bord original et très populaire Node-RED.

Ce projet a été formé par FlowFuse, dans le cadre des efforts visant à mettre à jour le tableau de bord original pour s'éloigner d'Angular v1. qui a été [officiellement déprécié] (https://flowfuse.com/blog/2024/06/dashboard-1-deprecated/). Vous pouvez lire notre déclaration complète sur _pourquoi_ nous construisons le tableau de bord 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/?_gl=1*cckr5u*_gcl_au*MTAzMTA0MzY1Ni4xNzE2MzY2NTAz).

## Tutoriels recommandés

<RecommendedTutorials />

## Installation

[FlowFuse](https://flowfuse.com)'s Node-RED Dashboard 2.0 is available in the Node-RED Palette Manager. Pour l'installer:

- Ouvrir le menu en haut à droite de Node-RED
- Cliquez sur "Gérer la palette"
- Basculer vers l'onglet "Installer"
- Rechercher dans `node-red-dashboard`
- Installez le paquet `@flowfuse/node-red-dashboard` (pas `node-red/node-red-dashboard`)

![Installez via "Gérer Palette"](./assets/images/install-palette.png){data-zoomable}
_Capture d'écran montrant les nœuds disponibles dans le gestionnaire de palettes Node-RED_

Les nœuds seront alors disponibles dans votre éditeur pour que vous puissiez commencer.

Si vous voulez utiliser `npm` pour installer vos nœuds, vous pouvez à la place [suivre ces instructions](https://nodered.org/docs/user-guide/runtime/adding-nodes)

## Hiérarchie du tableau de bord

Chaque tableau de bord est une collection de widgets (par exemple, graphiques, boutons, formulaires) qui peuvent être configurés et organisés dans notre propre interface utilisateur. La hiérarchie d'un tableau de bord est la suivante:

- **Base** - Définit l'URL de base (par exemple `/dashboard`) de votre tableau de bord.
- **Page** - Une page donnée à laquelle un visiteur peut naviguer, URL va étendre la base, par exemple `/dashboard/page1`. Chaque page peut également avoir un thème unique, défini, qui contrôle le style de tous les groupes/widgets de la page.
- **Groupe** - Une collection de widgets. Rendu sur une page.
- **Widget** - Un widget unique (par exemple, graphique, bouton, formulaire) créé dans le tableau de bord.

## Ajout de vos premiers widgets

Lorsque les nœuds sont installés, il est aussi facile de commencer que de choisir un nœud dans la Palette (la liste latérale de gauche des nœuds) dans Node-RED, et le déposer sur votre toile.

![Enregistrement d'écran pour montrer à quel point il est facile de déployer votre première application Tableau de bord 2.0. (./assets/images/getting-started.gif) Enregistrement{data-zoomable}
_Screen pour montrer à quel point il est facile de déployer votre première application Dashboard 2.0._

Dans ce cas, nous déposons un `ui-button`, cliquez sur "Déployer" puis vous pourrez voir le bouton en cours d'exécution dans notre interface utilisateur.

Notez également que le tableau de bord va automatiquement créer un nouveau groupe, une nouvelle page, un thème et un tableau de bord de base pour vous.

## Configuration de votre mise en page

Dashboard 2.0 ajoute une barre latérale correspondante "Dashboard 2.0" à l'éditeur Node-RED . Cette barre latérale fournit une interface permettant de visualiser vos pages, thèmes, groupes et widgets. À partir de là, vous pouvez ajouter de nouvelles pages et de nouveaux groupes, modifier les paramètres existants et réorganiser le contenu à votre goût.

![Screenshot showing the Dashboard 2.0 sidebar in the Node-RED Editor.](./assets/images/getting-started-sidebar.png){data-zoomable}
_Screenshot showing the Dashboard 2.0 sidebar in the Node-RED Editor._

Les options de mise en page dans une interface utilisateur du tableau de bord 2.0 sont contrôlées par deux paramètres principaux:

- **Mise en page de la page:** Contrôle comment les `ui-groups` sont présentés sur une page donnée dans votre application.
- **Barre de navigation :** Définit le style de navigation à gauche, défini au niveau `ui-base`.

![Exemple d'une mise en page "Grille", avec une navigation latérale "Collapsing". (./assets/images/getting-started-layout.png){data-zoomable}
_Exemple de la mise en page "Grille" avec une navigation latérale "Réduire". _

### Page par défaut

Chaque page du tableau de bord 2.0 a une URL unique. Si un utilisateur navigue vers un chemin non reconnu, sous le chemin `/dashboard/`, alors une page par défaut est utilisée pour se retrouver.

Actuellement, dans le tableau de bord 2.0, la page par défaut est choisie comme la page ordonnée en premier dans la liste des pages de la navigation latérale :

![Screenshot of the pages list in the Dashboard 2.0 side panel](./assets/images/default-page-layout.png "Screenshot of the pages list in the Dashboard 2. panneau latéral){data-zoomable}
_Capture d'écran de la liste des pages dans le panneau latéral du tableau de bord 2.0_

Dans cet exemple, la page _"Widgets Tiers"_ est la page par défaut.

### Options de mise en page

Actuellement, nous avons trois options différentes pour la mise en page d'une page:

- **Grille:** ([docs](https://dashboard.flowfuse.com/layouts/types/grid.html)) La mise en page par défaut d'une page. Il utilise une structure de grille de 12 colonnes pour mettre en page les groupes. Les largeurs de chaque groupe ou widget définissent le nombre de colonnes dans lesquelles ils seront affichés. Ainsi, une "largeur" de 6" renvoie à 50% de l'écran. Les mises en page de la grille sont entièrement réactives, et s'ajustent à la taille de l'écran.
- **Réparé :** ([docs](https://dashboard.flowfuse.com/layouts/types/fixed.html)) Chaque composant sera affiché à une largeur _fixe_, quelle que soit la taille de l'écran. La propriété "width" est convertie en pixel fixe (multiples de 48px par défaut).
- **Carnet :** ([docs](https://dashboard.flowfuse.com/layouts/types/notebook.html)) Cette mise en page s'étendra à 100 % de largeur, jusqu'à une largeur maximale de 1024 px, et s'alignera centralement. Il est particulièrement utile pour raconter des histoires (par exemple des articles/blogs) ou des interfaces utilisateur de type d'analyse (par ex. Jupyter Notebooks), où vous voulez que l'utilisateur digère le contenu dans un ordre particulier à travers le défilement.
- **Onglets :** ([docs](https://dashboard.flowfuse.com/layouts/types/tabs.html)) Cette mise en page organise le contenu en sections séparées, permettant aux utilisateurs de basculer entre différentes vues ou catégories de contenu sans quitter la page. Chaque onglet peut contenir plusieurs groupes et widgets, et il est particulièrement utile pour organiser de grandes quantités d’informations en segments facilement digestibles. La mise en page des onglets assure une meilleure navigation et une interface utilisateur plus propre lorsque plusieurs catégories de contenu doivent être affichées dans une seule vue.

### Navigation Sidebar

Inclus dans le cadre de l'interface utilisateur est une barre de navigation latérale, ainsi que la "barre d'applications" en haut de la page. Les options de configuration existent de telle sorte que le comportement de navigation latérale puisse être contrôlé. Les options incluent :

- **Réduire :** Lorsque la barre latérale est ouverte, le contenu de la page s'ajuste avec la largeur de la barre latérale.
- **Fixé :** La barre latérale entière sera toujours visible, et le contenu de la page s'ajustera à la largeur de la barre latérale.
- **Réduire en icônes :** Lorsqu'il est minimisé, les utilisateurs peuvent toujours naviguer entre les pages en cliquant sur les icônes représentant chaque page dans la barre latérale.
- **Apparaître sur le contenu:** Lorsque la barre latérale est ouverte, la page reçoit une superposition, et la barre latérale se trouve au-dessus de l'écran.
- **Toujours cacher:** La barre latérale ne s'affichera jamais, et la navigation entre les pages peut être pilotée par [`ui-control`](https://dashboard.flowfuse.com/nodes/widgets/ui-control.html).

## Modèles de design

Il y a deux modèles de conception de base qui sont possibles lors de la compilation avec le tableau de bord 2.0:

- **Source unique de vérité :** Tous les utilisateurs de votre tableau de bord verront les mêmes données. Ceci est utile pour les applications industrielles IoT ou Home Automation.
- **Multi Tenance :** Les données affichées dans un widget particulier sont uniques à un client/session/utilisateur donné. Cela représente une application web plus traditionnelle, où chaque utilisateur a sa propre session et les données associées.

Il convient de noter que ces deux modèles peuvent être mélangés et appariés dans une seule application du tableau de bord 2.0, affichée [later](#example).

### Source de vérité unique

![Single Source of Truth](./assets/images/design-pattern-single.png){data-zoomable}
_Exemple de workflow pour démontrer le modèle de design "Single Source of Truth"._

C'est le modèle que le tableau de bord original Node-RED a utilisé. Dans ce modèle, tous les utilisateurs du tableau de bord verront les mêmes données. Les données qui peuplent un widget sont généralement conduites par un appel matériel ou une API à usage général.

Lorsqu'un utilisateur va visiter un tableau de bord, les widgets chargeront leur état respectif et l'afficheront à chaque utilisateur.

Un exemple de ceci est que si vous avez des éléments interactifs, par ex. un curseur lié à un graphique, puis un utilisateur déplaçant le curseur dessine également les données dans le tableau de bord de chaque autre utilisateur.

### Location multiple

![Multi Tenancy](./assets/images/design-pattern-client.png){data-zoomable}
_Exemple de workflow pour démontrer le modèle de conception "Multi Tenancy"

Dans le tableau de bord 2.0, nous pouvons configurer un type de noeud donné à ["Accepter les données du client"](/user/sidebar.html#client-data) depuis la barre latérale :

<img data-zoomable style="max-width: 400px; margin: auto;" src="/images/dashboard-sidebar-clientdata.png" alt="Screenshot of an example 'Client Data' tab"/><em>Capture d'écran d'un exemple d'onglet "Données du client"</em>

Si "Inclure les données du client" est activé, alors _tous_ les objets `msg` émis depuis _tous_ les nœuds contiendront un `msg. client`, qui à un minimum de détails le `socketId` pour le client connecté. Il est possible d'ajouter plus de données à cet objet, comme un nom d'utilisateur, une adresse e-mail ou un autre identifiant unique avec les plugins Dashboard, e. . le [Plugin utilisateur FlowFuse](https://flowfuse.com/blog/2024/04/displaying-logged-in-users-on-dashboard/).

La table "Accepter les données du client" permet la configuration sur laquelle les types de noeuds prêteront attention à toute information `msg._client` fournie. N'importe quel `msg` envoyé_ à l'un de ces nœuds peut inclure une valeur `msg._client` pour spécifier une connexion particulière (e. , nom d'utilisateur, identifiant de socket) à qui les données doivent être envoyées plutôt qu'à tous les clients.

Pour les utilisateurs familiers avec le tableau de bord Node-RED original, vous reconnaîtrez ce modèle à partir de ce que vous pourriez faire avec `ui-notification` et `ui-control`, maintenant, dans Dashboard 2. , il est possible pour _tous_ les widgets.

La clé ici est que les données sont généralement injectées dans un noeud à la suite d'une action de l'utilisateur, p. ex. en cliquant sur un bouton, en affichant une page ou en soumettant un formulaire, et les données de réponse sont envoyées _seulement_ à cet utilisateur.

Un exemple facile de ce modèle de design dans Dashboard 2.0 est d'utiliser le nœud [UI Event](./nodes/widgets/ui-event.md). Le nœud `ui-event` émet un `msg` lorsqu'un utilisateur charge une page. Dans le `msg` se trouve un objet de données complet `msg._client` disponible pour la connexion de ce client. Si ce message est alors envoyé sur un autre noeud qui accepte les données du client, alors ce `msg` complet sera _seulement_ envoyé à ce client spécifié.

### Exemple

Nous avons ici un flux qui produira des données définies par le client et des données partagées. Lors de l'importation, assurez-vous de vérifier que dans la barre latérale du tableau de bord 2.0, `ui-text` et `ui-template` sont vérifiés dans la table "Accepts Client Data".

<video controls>
    <source src="./assets/videos/demo-design-patterns.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

Dans la vidéo ci-dessus, nous voyons que, dans certains cas, des données sont envoyées au client qui l'a déclenché (par ex. les clics de boutons), et dans d'autres, les données sont partagées entre toutes les sessions du client (par exemple, la visualisation de la valeur du curseur sur le graphique).

Si vous voulez jouer avec cet exemple, le flux est le suivant :

<FlowViewer :flow="examples['design-patterns']" height="425px" style="margin-bottom: 24px;"/>

Pour couvrir un peu plus de détails sur le flux lui-même :

#### Données client-driven

Pour ce cas d'utilisation, nous avons défini `ui-text` et `ui-template` configurés dans la barre latérale sur "Accepter les contraintes du client".

Dans la moitié supérieure, le nœud `ui-event` émettra un message lorsqu'un utilisateur charge la page. Ce message contiendra un objet `msg._client`, qui est unique à la connexion de cet utilisateur. Ce message est ensuite envoyé à un nœud `ui-template` qui affichera l'ID du socket de l'utilisateur spécifique.

De même, nous avons aussi un bouton, qui émettra également `msg. client` données (comme tous les nœuds le feront), mais cette fois il sera envoyé à un nœud `ui-text`. Le `ui-text` montrera l'horodatage de la dernière fois que le client/utilisateur donné a cliqué sur ce bouton.

#### Données partagées (tous les clients)

Cette section du flux montre comment un curseur peut être utilisé pour contrôler un graphique, Notez que nous filons le curseur directement dans le graphique parce que le `ui-chart` n'a pas été configuré pour "Accepter les données du client".

Nous connectons également le `ui-slider` à deux nœuds `ui-template`. Étant donné que les nœuds `ui-template` _son_ configurés pour "Accepter les données client", nous pouvons démontrer à la fois les données partagées et spécifiques au client dans le même flux en supprimant `msg. client` données sur le chemin vers le nœud `ui-template` inférieur. En supprimant cela, toutes les données de slider envoyées ici seront envoyées à _toutes_ les connexions, car le `msg` ne spécifie pas de `_client`. Le `ui-template` en haut ne sera mis à jour que pour le client qui a déplacé le curseur.

## Contribuer

Si vous souhaitez exécuter cet ensemble de nœuds localement, et spécifiquement pour contribuer aux efforts de développement, vous pouvez lire la documentation [Contributing](./contributing/index.md).

Si vous souhaitez construire vos propres nœuds et widgets autonomes qui s'intègrent de façon transparente avec Dashboard 2. , vous pouvez lire notre guide sur cette [here](./contributing/widgets/third-party.md).
