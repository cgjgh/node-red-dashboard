---
description: Maîtrise de la gestion d'état dans Node-RED Dashboard 2.0 pour maintenir une interface utilisateur dynamique et réactive.
---

# Gestion d'Etat

Dashboard 2.0 fournit un magasin de données dans Node-RED de sorte qu'il est possible de rafraîchir vos clients du tableau de bord et les données sont conservées. Ceci est particulièrement utile pour les widgets comme `ui-chart` où vous pouvez vouloir conserver un historique des points de données. ou pour les widgets comme `ui-text` où vous voulez conserver la dernière valeur affichée.

Cette page détaille les différentes "boutiques" que nous avons en place et à quoi elles servent.

Vous pouvez également consulter la [Architecture des événements] (./events.md) pour plus de détails sur l'utilisation de ces magasins et comment ils interagissent avec le reste du tableau de bord.

## Côté client (Dashboard)

![An image depicting the three client-side vuex stores we have in Dashboard 2. ](../../assets/images/stores-client-side.jpg){data-zoomable}
_Une image représentant les trois magasins vuex côté client que nous avons dans le tableau de bord 2.0_

Nos magasins côté client sont construits en utilisant [VueX](https://vuex.vuejs.org/). Ces magasins perdent leurs données lors d'un rafraîchissement du client (mais sont repeuplés par les magasins côté serveur), et sont juste utilisés pour maintenir un centralisé, une vue cohérente des données sur l'ensemble de l'application Vue lorsque l'utilisateur navigue dans le tableau de bord.

### Boutique `setup`

Ceci stocke juste la réponse de notre requête initiale `/_setup`. Cet objet, en core, contient la configuration SocketIO pour aider le client à se connecter au serveur.

Il est également possible pour les plugins d'ajouter à cet objet (voir [Ajout de plugins](../plugins/#index-js)) des données supplémentaires qui peuvent être utiles dans l'application.

### Boutique `ui`

Ce magasin est l'endroit où nous stockons le plein [ui-config](./events#ui-config) qui détaille toutes les pages, thèmes, groupes et widgets à afficher sur un tableau de bord.

### Boutique `data`

Le datastore côté client est une carte de l'identifiant du widget à :

- Le dernier `msg` reçu par le widget
- Un tableau d'objets `msg`, représentant tous les objets connus `msg` reçus par le widget

Dans la plupart des cas, un widget n'a besoin que d'une référence au message _last_. Dans certains cas, par exemple `ui-chart`, l'historique complet est requis afin de rendre un historique des données.

Lorsqu'un widget est chargé pour la première fois, nous émettons un événement `widget-load`, qui dans le gestionnaire `onLoad` par défaut, va essayer de récupérer le dernier message reçu par le widget depuis le datastore, côté serveur, et le stocker dans la boutique côté client `data`. Vous pouvez en savoir plus à ce sujet dans [Architecture des événements] (./events.md).

Il est possible pour un widget d'accéder à l'objet mappé `msg` en utilisant :

```vue
<template>
    <pre>ceci. essages[this.id]</pre>
</template>
<script>
exporter par défaut {
    calculé : {
        . .mapState('data', ['messages'])
    }

</script>
```

_Un exemple de fichier Widget.vue qui utilise la boutique `data` pour accéder au dernier message reçu par le widget_

Cette valeur est également mise à jour automatiquement lorsqu'un nouveau message est reçu, aussi longtemps que ce widget utilise les gestionnaires par défaut, à nouveau détaillé dans [Events Architecture](./events.md).

## Côté serveur (Node-RED)

![An image depicting the two server-side vuex stores we have in Dashboard 2. ](../../assets/images/stores-server-side.jpg){data-zoomable}
_Une image représentant les deux magasins côté serveur que nous avons dans le tableau de bord 2.0_

Nos magasins côté serveur maintiennent la "source unique de vérité". Quand un client du tableau de bord se connecte, les données centralisées sont envoyées à chaque client, et les magasins côté client sont remplis avec les parties pertinentes de ce magasin centralisé.

Dans notre architecture côté serveur, nous utilisons deux magasins autonomes :

- `datastore`: Une carte de chaque widget vers la dernière `msg` reçue par un noeud respectif de l'éditeur.
- `statestore`: une boutique pour toutes les propriétés dynamiques définies sur les widgets (par exemple la visibilité ou la définition d'une propriété à l'exécution). Souvent, ces valeurs sont des substitutions de la configuration de base trouvée dans le `datastore`.

Chaque fois qu'une fonction côté serveur veut écrire dans ces magasins, une vérification est effectuée pour s'assurer que tous les messages fournis sont autorisés. Un exemple de l'endroit où cela serait bloqué est si `msg._client. ocketid` est spécifié et le type de noeud approprié est configuré pour écouter les contraintes de socket (par défaut, c'est `ui-control` et `ui-notification`). Dans ce cas, nous ne voulons pas stocker ces données dans notre magasin centralisé car cela ne concerne pas _tous_ les utilisateurs du tableau de bord.

### Importation des magasins

Les magasins sont importés dans le fichier `.js` d'un nœud avec :

```js
const store = require('<path>/<to>/store.js')
```

### Magasin de données

Le `datastore` côté serveur est une boutique centralisée pour tous les messages reçus par les widgets de l'éditeur. Il s'agit d'un simple magasin de valeur clé, où la clé est l'identifiant du widget, et la valeur est le message reçu par le widget. Dans certains cas, par exemple `ui-chart` au lieu d'enregistrer _just_ la dernière `msg` reçue, nous stockons une histoire.

#### `datastore.save`

Lorsqu'un widget reçoit un message, le gestionnaire par défaut `node.on('input')` stocke le message reçu, mappé à l'id du widget dans le datastore en utilisant :

```js
datastore.save(base, nœud, msg)
```

- `base`: Le nœud `ui_base` auquel la boutique est attachée
- `node`: l'objet Node-RED dont nous stockons l'état
- `msg`: le message qui a été reçu par le nœud

Ceci stockera le dernier message reçu par le widget, qui peut être récupéré par ce même widget à la charge en utilisant :

#### `datastore.get`

Lorsqu'un widget est initialisé, il tentera de récupérer le dernier message du datastore en utilisant :

```js
datastore.get(node.id)
```

Cela garantit, lors de la mise à jour du client, ou lorsque de nouveaux clients se connectent après la génération de données, que l'état est présenté de manière cohérente.

#### `datastore.append`

Avec `. ppend`, nous pouvons stocker plusieurs messages contre le même widget, représentant un historique de l'état, au lieu d'une simple référence de point à la valeur _last_ seulement.

```js
datastore.append(base, nœud, msg)
```

- `base`: Le nœud `ui_base` auquel la boutique est attachée
- `node`: l'objet Node-RED dont nous stockons l'état
- `msg`: le message qui a été reçu par le nœud

Ceci est utilisé dans `ui-chart` pour stocker l'historique des points de données, où chaque point de données aurait pu être un message individuel reçu par le widget.

#### `datastore.clear`

Lorsqu'un widget est retiré de l'éditeur, nous pouvons effacer le datastore de tous les messages stockés par rapport à ce widget en utilisant :

```js
datastore.clear(node.id)
```

Cela garantit que nous n'avons pas de données obsolètes dans le datastore, et que nous n'avons pas de données stockées contre des widgets qui n'existent plus dans l'éditeur.

### Boutique d'Etat

Le `statestore` est un magasin centralisé pour toutes les propriétés dynamiques par rapport aux widgets de l'éditeur. Les propriétés dynamiques peuvent être définies en envoyant des payloads `msg.<property>` à un noeud donné, e.g. pour `ui-dropdown`, nous pouvons envoyer `msg.options` pour remplacer la propriété "Options" au moment de l'exécution.

Au niveau supérieur, il est associé à la clé aux ID du Widget, puis chaque widget a une carte, où chaque clé est le nom de la propriété, qui correspond à la valeur.

#### `statestore.getAll`

Pour un ID de widget donné, retourne toutes les propriétés dynamiques qui ont été définies.

```js
statestore.getAll(node.id)
```

#### `statestore.getProperty`

Pour un identifiant de widget donné, retourne la valeur d'une propriété particulière.

```js
statestore.getProperty(node.id, property)
```

#### `statestore.set`

A donné un ID de widget et une propriété, stocker la valeur associée dans le mapping approprié

```js
statestore.set(base, nœud, msg, propriété, valeur)
```

- `base`: Le nœud `ui_base` auquel la boutique est attachée
- `node`: l'objet Node-RED dont nous stockons l'état
- `msg`: le message qui a été reçu par le nœud
- `property` : le nom de la propriété à stocker
- `value`: la valeur à stocker par rapport à la propriété

#### `statestore.reset`

Supprimer toutes les propriétés dynamiques pour un Widget/Node donné.

```js
statestore.reset(node.id)
```

