---
description: Guide étape par étape sur l'ajout de nouveaux widgets cœur au tableau de bord Node-RED 2.0 pour étendre ses fonctionnalités interactives.
---

# Ajout de nouveaux Widgets Core

Un seul widget se compose de deux parties clés :

1. Un noeud ROUGE qui apparaîtra dans la palette de l'éditeur Node-ROUGE
2. `.vue` et le code côté client qui rend le widget dans un tableau de bord

Vous pouvez explorer notre collection de widgets de base [here](../../nodes/widgets.md).

Nous sommes toujours ouverts aux demandes d'ajout et aux nouvelles idées sur les widgets qui peuvent être ajoutés au dépôt du tableau de bord principal.

Lors de l'ajout d'un nouveau widget à la collection de coeur, vous devrez suivre les étapes ci-dessous pour vous assurer que le widget est disponible dans l'éditeur Node-RED et que le rendu est correct dans l'interface utilisateur.

## Lecture recommandée

Sur la navigation de gauche, vous trouverez une section "Guides utiles", Nous vous recommandons de jeter un coup d'œil sur ces éléments car ils donnent une bonne vue d'ensemble de la structure du tableau de bord 2. code base et certains des principes architecturaux sous-jacents sur lesquels il est construit.

En particulier, les recommandations suivantes sont les suivantes:

- [Architecture des événements](/contributing/guides/state-management.html)
- (/contributing/guides/state-management.html)

## Checklist

Lors de l'ajout d'un nouveau widget au tableau de bord 2. , vous devrez vous assurer que les étapes suivantes ont été suivies pour que ce nouveau widget soit reconnu et inclus dans un tableau de bord 2. build :

1. Dans `/nodes/`:
    - Ajouter `<widget>.html`
    - Ajouter `<widget>.js`
    - Ajoutez la référence à la section `node-red/nodes` dans `package.json`
2. Dans `/ui/`:
    - Ajouter `widgets/<widget>/<widget>.vue`
    - Ajouter le widget au fichier `index.js` dans `/ui/widgets`

## Exemple <widget.vue>

```vue
<template>
    <div @click="onAction"><div @click="onAction">
        {{ id }}
    </div>
</template>

<script>
    importation { useDataTracker } de '. /data-tracker.
    import { mapState } de 'vuex'

    export par défaut {
        name : 'DBUIWidget',
        // nous avons besoin d'injecter $socket pour pouvoir envoyer des événements à Node-RED
        inject: ['$socket', '$dataTracker'],
        propriétés : {
            id: String, // l'id du widget, tel que défini par Node-RED
            props: Objet, // les propriétés de ce widget définies dans l'éditeur Node-RED
            state: Object // l'état de ce widget, e. . activé, visible
        },
        computed: {
            // mappe notre data store de telle sorte que nous puissions obtenir toutes les données liées à ce widget
            // reçues en entrée de Node-RED
            . .mapState('data', ['messages']), // donne accès à `this.messages` où `ceci. essages[this.id]` est le message stocké pour ce widget
        },
        created () {
            // configure le widget avec onInput par défaut, onLoad et onDynamicProperties gèrent
            .$dataTracker(ceci. d)
        },
        méthodes: {
            onAction () {
                // nous pouvons envoyer toutes les données dont nous avons besoin par ce paramètre de message (optionnel)
                const msg = {
                    payload: 'hello world'
                }
                // envoyer un événement à Node-RED pour l'informer que nous avons cliqué sur ce widget
                .$socket.emit('action du widget', ceci. d, msg)
            }
        }
    }
</script>
  
<style scoped>
</style>
```

## Traqueur de données

Le data tracker est un service utilitaire globalement disponible qui aide à configurer les gestionnaires d'événements standards pour les widgets.

### Usage

Le traqueur de données est globalement disponible dans les widgets existants et peut être accédé en utilisant `ceci.$dataTracker(...)`.

L'utilisation la plus simple du tracker serait :

```js
...
créé () {
    ceci.$dataTracker(this.id)
},
...
```

Ceci va configurer les événements suivants :

- `on('widget-load')` - Permet d'enregistrer tous les objets `msg` reçus lorsqu'un widget est chargé pour la première fois dans le tableau de bord.
- `on('msg-input')` - Le comportement par défaut vérifie toutes les propriétés dynamiques (ex. visibilité, état désactivé) et stocke également le `msg` entrant dans la boutique Vuex

### Comportements personnalisés

Il fournit également de la flexibilité pour définir des gestionnaires d'événements personnalisés pour un widget donné, par exemple dans un nœud `ui-chart`, nous avons une logique qui gère la fusion des points de données et le rendu du graphique lorsqu'un message est reçu.

Les entrées pour la fonction `ceci.$dataTracker(widgetId, onInput, onLoad, onDynamicProperties)` sont utilisées comme suit:

- `widgetId` - l'ID unique du widget
- `onInput` - une fonction qui sera appelée lorsqu'un message est reçu de Node-RED via le gestionnaire de socket `on(msg-input)`
- `onLoad` - une fonction qui sera appelée lorsque le widget est chargé, et déclenchée par l'événement `widget-load`
- `onDynamicProperties` - une fonction appelée dans le cadre de l'événement `on(msg-input)`, et est déclenchée _avant_ la fonction par défaut `onInput`. C'est un bon point d'entrée pour vérifier les propriétés qui ont été incluses dans le `msg` afin de définir une propriété dynamique (i. . contenu envoyé dans `msg.ui_update...`).

## Propriétés dynamiques

Node-RED permet de définir la configuration sous-jacente d'un noeud. Par exemple, un `ui-button` aurait des propriétés telles que `label`, `color`, `icon`, etc. Il est souvent souhaité que ces propriétés soient dynamiques, ce qui signifie qu'elles peuvent être modifiées à l'exécution.

C'est une pratique standard dans Dashboard 2.0 de supporter ces mises à jour de propriétés via un objet imbriqué `msg.ui_update`. En tant que tel, les utilisateurs peuvent s'attendre à être en mesure de les contrôler en passant dans `msg. i_update.<property-name>` au noeud, qui devrait à son tour mettre à jour la propriété appropriée.

### Modèle de design

Cette section décrira le modèle de conception architecturale pour le développement de propriétés dynamiques en un widget.

Côté serveur, les propriétés dynamiques sont stockées dans notre magasin `state`, qui est un mappage de l'ID du widget aux propriétés dynamiques assignées à ce widget. Ceci est fait pour que nous puissions assurer la séparation des propriétés dynamiques pour un widget de la configuration initiale définie, et stockée dans Node-RED.

Avant que le nœud `ui-base` émette l'événement `ui-config` et le payload, nous fusionnons les propriétés dynamiques avec la configuration initiale, avec les propriétés dynamiques autorisées à outrepasser la configuration sous-jacente. Ainsi, lorsque le client reçoit un message `ui-config`, il aura la configuration la plus à jour pour le widget, avec la fusion des propriétés statiques et dynamiques.

### Paramétrage des propriétés dynamiques

#### Côté serveur

Afin de définir une propriété dynamique dans la boutique `state` côté serveur, nous pouvons utiliser l'événement `beforeSend` sur le nœud. Cet événement est déclenché à chaque fois que le nœud côté serveur est sur le point d'envoyer un message au client, y compris lorsqu'une nouvelle entrée est reçue dans un noeud donné.

Pour cela, nous profitons au maximum de la fonction `set` de la boutique d'état:

```js
/**
    *
    * @param {*} base - noeud Ui-base associé
    * @param {*} noeud - l'objet Node-RED que nous stockons l'état de Node-RED pour
    * @param {*} msg - le msg reçu complet (nous permet de vérifier s'il y a des contraintes d'identifiants/socketid)
    * @param {*} - la propriété que nous sommes en train de définir sur le noeud
    * @param {*} valeur - la valeur que nous définissons
*/
(base, node, msg, prop, value) {
    if (canSaveInStore(base, node, msg)) {
        if (! tate[node.id]) {
            state[node.id] = {}
        }
        state[node.id][prop] = valeur
    }
},
```

Par exemple, dans `ui-dropdown`:

```javascript
const evts = {
    onChange: true,
    beforeSend: function (msg) {
        if (msg. i_update) {
            const update = msg. i_update
            if (type de mise à jour. ptions ! = 'undefined') {
                // définit dynamiquement la propriété "options"
                statestore. et(group.getBase(), node, msg, 'options', update. ptions)
            }
        }
        retourne msg
    }
}

// informe l'interface utilisateur du tableau de bord que nous ajoutons ce groupe de nœuds
. egister(node, config, evts)
```

#### Côté client

Maintenant que nous avons la mise à jour d'état côté serveur, à chaque fois que nous actualisons, le `ui-config` complet contiendra déjà les propriétés dynamiques.

Nous devons alors nous assurer que le client est conscient de ces propriétés dynamiques _lors de leur changement_. Pour cela, nous pouvons utiliser l'événement `onDynamicProperties` disponible dans le [data tracker](#data-tracker).

Un bon modèle à suivre est de fournir une variable `calculé` sur le composant en question. Nous fournissons ensuite trois fonctions utiles, globales :

- `setDynamicProperties(config)`: assigne les propriétés fournies (dans `config`) au widget, dans la boutique côté client. Cela mettra à jour automatiquement l'état du widget, et toutes les références utilisant cette propriété.
- `updateDynamicProperty(property value)`: mettra à jour la `property` pertinente avec la `value` fournie dans la boutique côté client. S'assurera également que la propriété n'est pas de type `undefined`. Cela mettra à jour automatiquement l'état du widget, et toutes les références utilisant cette propriété.
- `getProperty(property)`: Récupère automatiquement la valeur correcte de la propriété demandée. Tout d'abord regardera dans les propriétés dynamiques, et si elles ne sont pas trouvées, la configuration statique définie dans l'événement [`ui-config` (../guides/events.md#ui-config).

Les variables calculées peuvent envelopper la fonction `this.getProperty`, qui sera toujours à jour avec le magasin vuex centralisé.

```js
{
    // ...
    calculé : {
        label () {
            retourne ceci. etProperty('label')
        }
    },
    créé () {
        // nous pouvons définir un gestionnaire onDynamicProperty personnalisé pour ce widget
        useDataTracker(ceci. d, null, null, this.onDynamicProperty)
    // . .,
    methods () {
        // . .,
        onDynamicProperty (msg) {
            // pratique standard pour accepter les mises à jour via msg. i_update
            mises à jour const = msg. i_update
            // utilise l'API globalement disponible pour mettre à jour la propriété dynamique
            . pdateDynamicProperty('label', updates.label)
        }
    }
}

```

### Mise à jour de la documentation

Il y a deux endroits importants pour s'assurer que la documentation est mise à jour lors de l'ajout de propriétés dynamiques :

#### Documentation en ligne :

Chaque nœud aura un fichier `/docs/nodes/widgets/<node>.md` correspondant qui permet la définition de la table `dynamic` dans le frontmatter, par exemple:

```yaml
dynamique:
    Options :
        payload: msg.options
        structure: ["Tableau<String>", "Tableau{value: String}>", "Tableau<{value: String, label: String}>"] Classe
    Classe :
        charge utile : msg.class
        structure: ["Chaîne"]
```

Vous pouvez ensuite rendre cette table dans la documentation avec :

```md
## Propriétés dynamiques

<DynamicPropsTable/>
```

#### Documentation de l'éditeur :

Chaque noeud aura un fichier correspondant `/locales/<locale>/<node>.html` qui devrait inclure une table de propriétés dynamiques, par exemple:

```html
<h3>Dynamic Properties (Inputs)</h3>
<p>Any of the following can be appended to a <code>msg.</code> in order to override or set properties on this node at runtime.</p>
<dl class="message-properties">
    <dt class="optional">options <span class="property-type">array</span></dt>
    <dd>
        Change the options available in the dropdown at runtime
        <ul>
            <li><code>Array&lt;string&gt;</code></li>
            <li><code>Array&lt;{value: String}&gt;</code></li>
            <li><code>Array&lt;{value: String, label: String}&gt;</code></li>
        </ul>
    </dd>
    <dt class="optional">class <span class="property-type">string</span></dt>
    <dd>Add a CSS class, or more, to the Button at runtime.</dd>
</dl>
```

### Débogage des propriétés dynamiques

Dashboard 2.0 est fourni en tant que [Vue de débogage](/contributing/widgets/debugging.html) qui inclut un [panneau spécialisé] (/contributing/widgets/debugging.html#dynamic-properties) pour surveiller les propriétés dynamiques assignées à un widget. Cela peut être un outil très utile pour vérifier si le client est conscient des propriétés dynamiques qui ont été envoyées.