---
description: Apprenez le processus d'enregistrement des widgets dans le tableau de bord Node-RED 2.0 pour améliorer les fonctionnalités de votre tableau de bord.
---

# Enregistrement du Widget

Chaque `ui-base`, `ui-page` et `ui-group` a une fonction `.register`. La fonction d'enregistrement de base peut être trouvée dans `ui-base`.

Cette fonction est utilisée par tous les widgets pour informer le tableau de bord de leur existence, et permet au widget de définir quel groupe/page/ui il appartient, ainsi que les propriétés pertinentes que le widget a et tous les gestionnaires d'événements (e. . `onInput` ou `onAction`).

La fonction est appelée à l'intérieur du noeud Node-RED `. s` , et dans le cas d'un widget s'inscrivant dans un groupe (le cas d'utilisation le plus courant), ressemblerait à ceci :

```js
module. xports = function (RED) {
    function MyNode (config) {
        // create node in Node-RED
        RED. odes. redéfinir un nœud (ceci, config)
        // référence de la boutique à notre noeud Node-RED
        const node = this

        // quel groupe sommes-nous en train de rendre ce widget
        const group = RED. odes.getNode(config. roup)

        // un objet détaillant les événements pour s'abonner à
        const evts = {}

        // informe l'interface utilisateur du tableau de bord que nous ajoutons ce groupe de noeuds
        . egister(node, config, evts)
    }

    RED.nodes.registerType('ui-mywidget', MyNode)
}
```

## Arguments

Les entrées de la fonction d'enregistrement diffèrent légèrement selon que l'on soit appelé sur le `ui-group`, `ui-page` ou `ui-base`:

- `group.register(node, config, evts)`
- `page.register(group, node, config, evts)`
- `base.register(page, groupe, node, config, evts)`

Notez cependant qu'ils ont tous 3 entrées en commun :

### `node`

Ceci est le `this` du constructeur de votre nœud, et peut être utilisé directement à partir de la valeur fournie par Node-RED.

### `config`

Ceci est rendu disponible par Node-RED comme entrée au constructeur, et peut généralement passer directement dans le `. La fonction egister` sans modification, ce sera un objet qui cartographiera toutes les propriétés et valeurs qui ont été décrites dans le noeud `. Définition tml`.

### `evts`

Nous exposons une gamme de différents gestionnaires d'événements dans le cadre de la fonction `register`. Tous ces gestionnaires fonctionnent sur le serveur (Node-RED).

Dans certains cas, il est possible de définir des fonctions complètes (qui s'exécuteront au point approprié dans le cycle de vie de l'événement), dans d'autres occasions, il est seulement possible de définir une valeur `true`/`false` qui informe le tableau de bord que vous souhaitez que le widget envoie ou s'abonne à cet événement.

Une ventilation complète du cycle de vie de l'événement peut être trouvée [here](../../contributing/guides/events.md).

```js
const evts = {
    onAction: // boolean
    onChange: // boolean || function
    beforeSend: // function
    onInput: // function
    onError: // function
    onSocket // object
}
```

## Évènements

Tous ces gestionnaires d'événements définissent le comportement qui est exécuté côté serveur (c'est-à-dire dans Node-RED). Si vous recherchez des gestionnaires d'événements côté client, voir [here](../widgets/third-party.md#configuring-your-node).

### `.onAction` (`boolean`)

Lorsqu'il est défini comme `true`, ce drapeau déclenchera le gestionnaire par défaut lorsque les widgets du tableau de bord enverront un événement `widget-action`.

1. Assigne la valeur fournie à `msg.payload`
2. Ajoute n'importe quel `msg.topic` défini dans la configuration du noeud
3. Exécute `evts.beforeSend()` _(si fourni)_
4. Envoie le `msg` à tous les nœuds connectés en utilisant `node.send(msg)`

Un exemple de ceci est avec `ui-button`, où le `UIButton` du widget contient une fonction `@click`, contenant :

```js
ceci.$socket.emit('widget-action', this.id, msg)
```

Ceci envoie un message via SocketIO à Node-RED, avec le sujet de l'ID du widget. Parce que le `ui-button` a `onAction: true` dans son enregistrement, il va donc exécuter le gestionnaire par défaut détaillé ci-dessus.

### `.onChange` (`boolean` || `function`)

Similaire à `onAction`, lorsqu'il est utilisé comme booléen, ce drapeau déclenchera le gestionnaire par défaut pour un événement `onChange`.

#### Default `onChange` Handler

1. Assigne la valeur fournie à `msg.payload`
2. Ajoute n'importe quel `msg.topic` défini dans la configuration du noeud
3. Exécute `evts.beforeSend()` _(si fourni)_
4. Stocker le message le plus récent sur le widget sous la propriété `._msg` qui contiendra la dernière état/valeur du widget
5. Pousse un événement `widget-sync` pour synchroniser les widgets dans tous les clients.
6. Envoie le `msg` à tous les nœuds connectés

#### Custom `onChange` Handler

Alternativement, vous pouvez remplacer ce comportement par défaut en fournissant une fonction personnalisée `onChange`. Un exemple de ceci est dans le nœud `ui-switch` qui doit faire `node. tatus` se met à jour pour que l'éditeur Node-RED reflète son dernier statut:

```js
/**
 * Traite l'entrée depuis le widget
 * @param {object} msg - le dernier msg connu reçu (avant cette nouvelle valeur)
 * valeur @param {boolean} - la valeur mise à jour envoyée par le widget
 * @param {Socket} conn - socket. o socket se connectant au serveur
 * @param {String} id - id widget envoyant l'action
 */
onChange: fonction async (msg, valeur, conn, id) {
    // s'assurer que nous avons la dernière instance du noeud du widget
    const wNode = RED. odes.getNode(node.id)

    . tatus({
        remplissage : valeur ? 'vert' : 'rouge', Forme
        : 'bague',
        texte: valeur ? states[1] : états[0]
    })

    // récupère la valeur on/off assignée
    const on = RED. til.evaluateNodeProperty(config.onvalue, config.onvalueType, wNode)
    const off = RED.util. valuateNodeProperty(config.offvalue, config.offvalueType, wNode)
    msg. ayload = valeur ? lorsque : off

    // synchronise ce changement à tous les clients avec le même widget
    const exclusion = [conn.id] 
    base. mit('widget-sync:' + id, msg, node, exclude)

    // simule le noeud Node-RED recevant une entrée
    wNode. end(msg)
}
```

### `.beforeSend(msg)` (`function`)

Cette fonction du middleware s'exécutera avant que le noeud n'envoie n'importe quel `msg` aux nœuds conséquents connectés dans l'éditeur (e. . dans les gestionnaires par défaut `onInput`, `onAction` et `onChange`).

La fonction doit prendre `msg` en entrée, et retourner également `msg` en sortie.

Dans `ui-button`, nous utilisons `beforeSend` évaluer le `msg.payload` car nous avons un `TypedInput` ([docs](https://nodered.org/docs/api/ui/typedInput/). Le `TypedInput` doit être évalué dans Node-RED, car il peut référencer des variables en dehors du domaine du nœud du bouton (par exemple `global` ou `flow`). Le gestionnaire par défaut `onInput` prend ensuite la sortie de notre `beforeSend` et la traite en conséquence.

### `.onInput(msg, send)` (`function`)

Définir cette fonction remplacera le gestionnaire par défaut `onInput`.

#### Default `onInput` Handler

1. Stocke le message le plus récent sur le widget sous le `node._msg`
2. Ajoute n'importe quel `msg.topic` défini dans la configuration du noeud
3. Vérifie si le widget a une propriété `passthru` :
 - Si aucune propriété `passthru` n'est trouvée, exécutez `send(msg)`
 - Si la propriété est présente, `send(msg)` n'est exécuté que si `passthru` est défini à `true`

#### Gestionnaire personnalisé `onInput`

Lorsqu'il est fourni, cela remplacera le gestionnaire par défaut.

Nous utilisons ceci dans les widgets de base du tableau de bord avec `ui-chart`, où nous voulons stocker l'historique de la valeur récente `msg` plutôt que _just_ la valeur la plus récente dans le gestionnaire par défaut. Nous l'utilisons également ici pour nous assurer que nous n'avons pas trop de points de données (comme défini dans la configuration `ui-chart`).

Un autre cas d'utilisation serait ici si vous ne voulez pas passer sur des payloads `msg` entrants sur des nœuds connectés automatiquement, par exemple, vous pourriez avoir un tas de payloads de type commande `msg` qui indiquent à votre nœud de faire quelque chose, qui ne sont donc pas pertinents pour les noeuds précédents dans le flux.

### `.onError(err)` (`function`)

Cette fonction est appelée dans les gestionnaires pour `onAction`, `onChange` et `onInput`. S'il y a toujours un problème avec ces gestionnaires (y compris les gestionnaires personnalisés fournis), alors la fonction `onError` sera appelée.

### `.onSocket` (`object`)

Il s'agit d'un gestionnaire d'événements quelque peu unique, qui n'est utilisé que par les widgets développés en externe (i. . ne fait pas partie des widgets du tableau de bord principal détaillés dans cette documentation). Il est fourni pour que les développeurs puissent `émettre`, et donc s'abonner à des événements personnalisés SocketIO qui sont transmis par leurs widgets personnalisés.

Vous pouvez voir un exemple plus détaillé dans notre documentation [here](../widgets/third-party.md#custom-socketio-events).

La structure générale de `onSocket` est la suivante:

```js
const evts = {
    onSocket: {
        'my-custom-event': function (id, msg) {
            console.log('my-custom-event', id, msg)
        }
    }
 } 
 } }
```

Notez que ces événements sont émis depuis le tableau de bord, et donc ces gestionnaires sont exécutés dans Node-RED.