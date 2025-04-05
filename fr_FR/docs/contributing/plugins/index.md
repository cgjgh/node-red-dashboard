---
description: Guide pour construire des plugins personnalisés pour Node-RED Dashboard 2.0, améliorant ses fonctionnalités avec vos fonctionnalités.
---

<script setup>
    import AddedIn de '../../components/AddedIn.vue';
</script>

# Building Dashboard Plugins <AddedIn version="0.11.0"/>

Node-RED supporte le développement de plugins personnalisés qui ajoutent des comportements et des fonctionnalités à l'exécution de Node-RED. Un cas d'utilisation très courant de plugins est [custom Node-RED Themes] (https://nodered.org/docs/api/ui/themes/), qui modifient le CSS/apparence globale de l'éditeur de Node-RED sous-jacent.

Node-RED Dashboard 2.0 supporte également les plugins. Cela vous permet de définir un comportement personnalisé pour l'exécution du tableau de bord, indépendant des nœuds et des widgets particuliers. Actuellement, nous fournissons une collection de [crochets de l'API](#index-js) qui permettent l'injection de code à différents points dans l'instanciation et l'exécution.

Pour intégrer, assurez-vous que votre plugin Node-RED est enregistré avec `"type": "node-red-dashboard-2"` dans le fichier `package.json`. Ceci dira à Node-RED qu'il s'agit d'un plugin Dashboard 2.0.

_Note : Les plugins diffèrent de [Widgets Tiers](../widgets/third-party.md). Les widgets tiers sont construits comme des nœuds qui sont disponibles dans l'éditeur Node-ROUGE et peuvent être déplacés sur le tableau de bord. Les plugins sont construits pour modifier le comportement du tableau de bord lui-même. _

## Plugins d'authentification <AddedIn version="1.10.0"/>

Un des cas d'utilisation les plus courants pour les plugins Dashboard est d'ajouter des données utilisateur aux messages émis par le Dashboard. Ils utilisent un framework d'authentification existant établi sur le serveur Node-RED, et injectent des données utilisateur dans le `msg. client` objet qui est envoyé au flux Node-RED.

### Configuration

La barre latérale du tableau de bord 2.0 listera tous les plugins dans l'onglet "Données du client" qui ont déclaré `auth: true` dans leur fichier `index.html`. Ceci est requis si un plugin ajoute/modifie des données dans l'objet `msg._client`.

![Screenshot of an example "Données du client" tab](/images/dashboard-sidebar-clientdata.png)
_Screenshot of an example "Données du client" tab_

Dans la capture d'écran ci-dessus, nous pouvons voir que le code de base du tableau de bord ajoute les données "Socket ID" et nous fonctionnons également avec le plugin d'authentification FlowFuse qui ajoute toutes les informations sur un utilisateur connecté de FlowFuse lors de l'utilisation du tableau de bord.

## Structure du plugin

Prenons un exemple rapide pour donner un aperçu de la structure d'un plugin tableau de bord :

### package.json

```json
{
    "name": "node-roud-dashboard-2-<plugin-name>",
    "version": "<x.y.z>",
    "description": "<describe your plugin>",
    "main": "index. s",
    "scripts": {
        "test": "<run your tests here>"
    },
    "author": {
        "name": "<your name>",
        "url": "<your website/gh profile>"
    },
    "node-red": {
        "plugins": {
            "node-red-dashboard-2-<plugin-name>": "index. s"
        }
    },
    "license": "Apache-2.
}
```

### index.html

Ceci définit tous les plugins client/éditeur. Cela permet de définir les fonctionnalités de l'éditeur Node-RED telles que l'injection de contenu dans le tableau de bord 2. sidebar, ou si des plugins d'exécution ajoutent des données d'authentification/client aux messages.

 <script type="text/javascript">
    plugins RED.. egisterPlugin('node-roud-dashboard-2-<plugin-name>', {
        type: 'node-roud-dashboard-2',
        onglets : [
            {
                id : 'mon-tab-id',
                étiquette : 'Mon onglet',
                /\*\*
                 \* Exécute lorsque les onglets sont créés pour la première fois
                 \* @param {object} base - nœud ui-base pour lequel cette barre latérale représente
                 \* @param {object} parent - élément DOM pour ajouter du contenu à
                 \*/
                init (base, parent) {
                    // ajoute du contenu à l'onglet
                }
            }
        ],
        auth: true/false, // Déclaration au tableau de bord 2. si cela doit être listé dans l'onglet "Données du client"
        description: '', // Si "auth: true", ceci est utilisé dans l'onglet "Données du client" de la barre latérale
    })
 </script>

### index.js

Le fichier `js` d'un plugin définira les comportements d'exécution pour le tableau de bord 2.0. C'est ici que vous allez définir vos crochets, et tout autre code que vous voulez exécuter lorsque le tableau de bord 2. est instancié, ou les messages sont envoyés entre le tableau de bord et le Node-RED.

```js
module.exports = function(RED) {
    RED.plugins.registerPlugin("node-red-dashboard-2-<plugin-name>", {

        // Tells Node-RED this is a Node-RED Dashboard 2.0 plugin
        type: "node-red-dashboard-2",

        // hooks - a collection of functions that will inject into Dashboard 2.0
        hooks: {
            /**
             * onSetup - called when the Dashboard 2.0 is instantiated
             * @param {object} RED - Node-RED runtime
             * @param {object} config - UI Base Node Configuration
             * @param {object} req - ExpressJS request object
             * @param {object} res - ExpressJS response object
             * @returns {object} - Setup object passed to the Client
             */ 
            onSetup: (RED, config, req, res) => {
                return {
                    // must ALWAYS return socketio.path if using this hook
                    socketio: {
                        path: `${config.path}/socketio`, 
                    }
                }
            },
            /**
             * onInput - called when a node receives a message
             * @param {object} msg - Node-RED msg object
             * @returns {object} - Returns Node-RED msg object
             */ 
            onInput: (msg) => {
                // modify msg in anyway you like
                return msg
            },
            /**
             * onAction - called when a D2.0 widget emits the `widget-action` event via SocketIO
             * @param {object} conn - SocketIO connection object
             * @param {object} id - Unique Node/Widget ID
             * @param {object} msg - Node-RED msg object
             * @returns {object} - Returns Node-RED msg object
             */ 
            onAction: (conn, id, msg) => {
                // modify msg in anyway you like
                msg.myField = "Hello World"
                return msg
            },
            /**
             * onChange - called when a D2.0 widget emits the `widget-change` event via SocketIO
             * @param {object} conn - SocketIO connection object
             * @param {object} id - Unique Node/Widget ID
             * @param {object} msg - Node-RED msg object
             * @returns {object} - Returns Node-RED msg object
             */ 
            onChange: (conn, id, msg) => {
                // modify msg in anyway you like
                msg.myField = "Hello World"
                return msg
            },
            /**
             * onLoad - called when a D2.0 widget emits the `widget-load` event via SocketIO
             * @param {object} conn - SocketIO connection object
             * @param {object} id - Unique Node/Widget ID
             * @param {object} msg - Node-RED msg object
             * @returns {object} - Returns Node-RED msg object
             */ 
            onLoad: (conn, id, msg) => {
                // modify msg in anyway you like
                msg.myField = "Hello World"
                return msg
            },
            /**
             * onAddConnectionCredentials - called when a D2.0 is about to send a message in Node-RED
             * @param {object} conn - SocketIO connection object
             * @param {object} msg - Node-RED msg object
             * @returns {object} - Returns Node-RED msg object
             */ 
            onAddConnectionCredentials: (conn, msg) => {
                // modify msg in anyway you like
                msg._client.socketIp = conn.request.socket.remoteAddress
                return msg
            },
            /**
             * onIsValidConnection - Checks whether, given a msg structure and Socket connection,
             * any _client data specified allows for this message to be sent, e.g.
             * if the msg._client.socketid is the same as the connection's ID
             * @param {object} conn - SocketIO connection object
             * @param {object} msg - Node-RED msg object
             * @returns {boolean} - Is a valid connection or not
             */ 
            onIsValidConnection: (conn, msg) => {
                if (msg._client?.socketId) {
                    // if socketId is specified, check that it matches the connection's ID
                    return msg._client.socketId === conn.id
                }
                // if no specifics provided, then allow the message to be sent
                return true
            },
            /**
             * onCanSaveInStore - Checks whether, given a msg structure, the msg can be saved in the store
             * Saving into a store is generally a bad idea if we're dealing with messages only intended for
             * particular clients (e.g. a msg._client.socketId is specified)
             * @param {object} msg - Node-RED msg object
             * @returns {boolean} - Is okay to store this, or not
             */
            onCanSaveInStore: (msg) => {
                if (msg._client?.socketId) {
                    // if socketId is specified, then don't save in store
                    return false
                }
                return true
            },

        }
    })
 }
```

Si un de `onInput`, `onAction`, `onChange` ou `onLoad` retourne `null`, alors le `msg` s'arrêtera brusquement là, et ne sera pas envoyé plus loin dans le flux.