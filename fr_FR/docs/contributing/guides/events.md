---
description: Plongez profondément dans l'architecture d'événements du tableau de bord Node-RED 2.0 pour une gestion efficace des données et une interaction avec l'interface utilisateur.
---

# Architecture d'événements

Une partie importante du tableau de bord est la façon dont Node-RED et le Tableau de bord communiquent. Ceci est réalisé en utilisant [socket.io](https://socket.io/).

Ici, vous pouvez trouver des détails sur les communications principales qui se produisent entre Node-RED (blocs en rouge) et le Tableau de bord (blocs en bleu). Les blocs font référence à des fonctions et des fichiers particuliers dans le code source pour aider à naviguer et à comprendre où trouver le code pertinent.

Chacun des blocs cylindriques se réfèrent directement à l'un de nos magasins côté client ou serveur, qui sont détaillés dans le guide [Gestion d'État] (./state-management.md).

## Architecture

Nous avons divisé l'architecture et le trafic d'événements en trois groupes clés :

- **Chargement** : Le chargement initial du tableau de bord, ou quand une nouvelle configuration est envoyée par Node-RED sur un nouveau "Déploie".
- **Input**: Quand un message (`msg`) est reçu par un noeud du tableau de bord dans Node-RED.
- **Actions du tableau de bord**: lorsqu'un utilisateur interagit avec un widget, ou un widget renvoie un message à Node-RED.

### Flux d'événements « Chargement »

![A flow diagram depicting how events traverse between Node-RED (red) and the Dashboard (blue) at deploy and first-load](../../assets/images/events-arch-load.jpg){data-zoomable}
_A flow diagram depicting how events traverse between Node-RED (red) and the Dashboard (blue) at deploy and first-load_

Ici, nous détaillons la requête HTTP initiale "Setup" le trafic SocketIO et les gestionnaires appropriés qui sont exécutés lorsqu'un tableau de bord est déployé (via l'option "Déployer" Node-RED), ainsi que lors du premier chargement d'un client du tableau de bord.

Notez la différenciation entre le chargement du « Tableau de bord », c'est-à-dire la connexion complète de l'application et du navigateur, et un chargement individuel du « Widget ». Ce dernier est déclenché pour le widget _chaque_ lorsqu'il est monté/rendu dans le DOM.

### Flux d'événement « Entrée »

![A flow diagram depicting how events traverse between Node-RED (red) and the Dashboard (blue) when messages are received by a Dashboard node](../../assets/images/events-arch-msg.jpg){data-zoomable}
_A flow diagram depicting how events traverse between Node-RED (red) and the Dashboard (blue) when messages are received by a Dashboard node_

Ce flux détaille les fonctions, et le trafic SocketIO qui se produit lorsqu'un message est reçu par un noeud du tableau de bord dans Node-RED. Notez que la plupart des noyaux du tableau de bord 2. les widgets utilisent le gestionnaire par défaut `onInput`, mais dans certains cas, un gestionnaire personnalisé `onInput` est utilisé où nous voulons un comportement différent.

Notre gestionnaire `onInput` côté serveur par défaut gère les cas d'utilisation courants de:

- Mise à jour de la valeur du widget dans notre boutique de données côté serveur
- Vérifie si le widget est configuré pour définir un `msg.topic` et, si oui, mettre à jour la propriété `msg.topic` du widget
- Vérifie si le widget est configuré avec une option `passthrough`, et si c'est le cas, vérifie sa valeur avant d'émettre l'objet `msg` sur tous les nœuds connectés.
- Émet l'objet `msg` à tous les nœuds connectés, le cas échéant.

### Flux d'événements "Actions du tableau de bord"

Différents widgets déclenchent différents événements en fonction des cas d'utilisation spécifiques. Le diagramme suivant montre les trois types d'événements que le client peut émettre au serveur, et comment ils sont gérés séparément.

![Un diagramme de flux représentant comment les événements traversent du tableau de bord (bleu) à Node-RED (rouge) lorsqu'un utilisateur interagit avec le tableau de bord](../../assets/images/events-arch-client-events.jpg){data-zoomable}
_Un diagramme de flux décrivant comment les événements traversent du tableau de bord (bleu) au Node-RED (rouge) lorsqu'un utilisateur interagit avec le tableau de bord_

Quelques exemples d'événements qui sont émis depuis le tableau de bord vers Node-RED incluent :

- `widget-change` - Lorsqu'un utilisateur change la valeur d'un widget, par exemple un slider ou une entrée de texte
- `widget-action` - Lorsqu'un utilisateur interagit avec un widget, et que l'état du widget n'est pas important, par exemple un clic sur un bouton
- `widget-send` - Utilisé par `ui-template` pour envoyer un objet personnalisé `msg`, par exemple `send(msg)`, qui sera stocké dans la boutique de données côté serveur.

#### Synchronisation des Widgets

L'événement `widget-change` est utilisé pour émettre des entrées depuis le serveur, et représente un changement d'état pour ce widget, e. . Un interrupteur peut être allumé/éteint par un utilisateur cliquant. Dans ce cas, si vous avez plusieurs clients connectés à la même instance Node-RED, le tableau de bord s'assurera que les clients sont synchronisés lorsque les valeurs changent.

Pour Exemple si vous déplacez un curseur sur une instance du tableau de bord, tous les curseurs connectés seront également mis à jour automatiquement.

Pour désactiver ce modèle de design "source unique de vérité", vous pouvez vérifier le type de widget dans l'onglet ["Données du client"](../../user/multi-tenancy#configuring-client-data) des paramètres du tableau de bord.

## Liste des événements

Ceci est une liste complète de tous les événements qui sont envoyés entre Node-RED et le Tableau de bord via socket.io.

### `ui-config`

- Payload: `object{ dashboards, thème, pages, groupes, widgets }`

Utilisé pour transporter les données de mise en page du tableau de bord/theme/page/groups/[widget](#widget) par leurs identifiants respectifs.

### `msg-input:<node-id>`

- Charge payante : `<msg>`

Envoyé de NR à l'interface utilisateur quand une entrée de msg est reçue dans un noeud du tableau de bord.

### `widget-load`

- ID: `<node-id>`
- Payload : `none`

Envoyé de l'interface utilisateur à NR lorsque l'UI/widget est chargé pour la première fois. Donne une chance à NR de fournir au widget toutes les valeurs existantes connues.

### `widget-change`

- ID: `<node-id>`
- Payload: `<value>` - généralement les données de la charge utile à envoyer dans le msg

Envoyé de l'interface utilisateur à NR lorsque la valeur d'un widget est changée de l'interface utilisateur, par exemple l'entrée de texte, le curseur. Assume que la valeur émise est le `msg.payload`.

Cela prend hte précédemment reçu msg, et le fusionne avec la valeur nouvellement reçue, par exemple si le msg était :

```json
{
    "payload": 30,
    "topic": "on-change"
}
```

et le `widget-change` a reçu une nouvelle valeur de `40`, alors le message nouvellement émis serait :

```json
{
    "payload": 40,
    "topic": "on-change"
}
```

Toute valeur reçue ici sera également stockée sur le widget dans le datastore.

### `widget-sync`

- Charge payante : `<msg>`

Déclenché depuis le gestionnaire `onChange` côté serveur. Ceci envoie un message à tous les clients connectés et informe les widgets pertinents des changements d'état/de valeur. Par exemple, lorsqu'un curseur est déplacé, le message `widget-sync` assurera que tous les clients connectés, et leur curseur respectif, sont mis à jour avec la nouvelle valeur.

### `action du widget`

- ID: `<node-id>`
- Charge payante : `<msg>`

Envoyé de l'interface utilisateur à NR lorsqu'un widget est activé, par exemple cliquer sur un bouton ou télécharger un fichier.

### `widget-send`

- ID: `<node-id>`
- Charge payante : `<msg>`

Généralement utilisé par `ui-template`. Cet événement est enveloppé par la fonction `send(msg)` du modèle qui permet aux utilisateurs de définir leurs propres objets `msg` complets à émettre par un nœud `ui-template`. Si une valeur non-objet est envoyée, alors le tableau de bord l'enveloppera automatiquement dans un objet `msg.payload`, par exemple:

```js
Envoyer(10)
```

résultera en un objet `msg` de :

```json
{
    "payload": 10 
}
```

De même, un objet est spécifié :

```js
send({ myVar: 10, topic: "mon-sujet" })
```

alors l'objet `msg` sera:

```json
{
    "myVar": 10,
    "topic": "my-topic"
}
```

N'importe quel `msg` émis en utilisant cette fonction est également stocké dans le datastore associé au widget.

## Charge de l'évènement

Ceci détaille certaines structures d'objet utilisées pour envoyer des données traversent les connexions de socket io entre Node-RED et Dashboard.

### `Widget`

Dans la propriété `ui-config`, la propriété `widgets` est un tableau d'objets `Widget`. Chaque objet `Widget` a les propriétés suivantes :

- **id** : L'id assigné par Node-RED pour identifier de manière unique ce noeud dans l'éditeur
- **props** : la collection de propriétés que l'utilisateur peut définir dans l'éditeur pour ce noeud
- **component** - Le composant Vue respectif requis pour le rendu, ajouté front-end (dans App.vue)
- **state** - Contient la valeur définissant le "state" visuel et interactif d'un widget, par exemple `enabled: true` ou `visible: false` (`visible: ` pas encore supporté)
