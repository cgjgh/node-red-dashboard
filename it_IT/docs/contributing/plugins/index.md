---
description: Guida alla costruzione di plugin personalizzati per Node-RED Dashboard 2.0, migliorando le sue funzionalità con la tua funzionalità.
---

<script setup>
    import AddedIn from '../../components/AddedIn.vue';
</script>

# Costruire Plugin Dashboard <AddedIn version="0.11.0"/>

Node-RED supporta lo sviluppo di plugin personalizzati che aggiungono comportamento e funzionalità all'esecuzione Node-RED. Un caso di uso davvero comune dei plugin è [Temi Node-RED personalizzati](https://nodered.org/docs/api/ui/themes/), che modificano il CSS/aspetto complessivo dell'editor Node-RED sottostante.

Node-RED Dashboard 2.0 supporta anche i plugin. Questo consente di definire il comportamento personalizzato per il runtime della Dashboard, indipendente da particolari nodi e widget. Attualmente, forniamo una raccolta di [API hooks](#index-js) che consentono l'iniezione di codice in vari punti nell'istanziazione e runtime del cruscotto .

Per integrare, assicurati che il tuo plugin Node-RED sia registrato con `"type": "node-red-dashboard-2"` nel file `package.json`. Questo dirà a Node-RED che questo è un plugin Dashboard 2.0.

_Nota: i plugin differiscono da [Widget di terze parti](../widgets/third-party.md). I widget di terze parti sono costruiti come nodi che diventano disponibili nell'editor Node-RED, e possono essere trascinati nella Dashboard. I plugin sono costruiti per modificare il comportamento del runtime della Dashboard._

## Plugin Di Autenticazione <AddedIn version="1.10.0"/>

Uno dei casi di utilizzo più comuni per i plugin Dashboard è quello di aggiungere i dati utente ai messaggi emessi dalla Dashboard. Usano un framework di autenticazione esistente stabilito sul server Node-RED e iniettano i dati utente nel \`msg. oggetto client che viene inviato al flusso Node-RED.

### Configurazione

La barra laterale Dashboard 2.0 elencerà tutti i plugin nella scheda "Dati Client" che hanno dichiarato `auth: true` nel loro file `index.html`. Ciò è necessario se un plugin sta aggiungendo/modificando i dati nell'oggetto `msg._client`.

![Screenshot di un esempio di scheda "Dati Client"](/images/dashboard-sidebar-clientdata.png)
_Screenshot di un esempio di scheda "Dati Client"_

Nell'immagine di cui sopra possiamo vedere che il codice Dashboard core aggiunge i dati "Socket ID", e stiamo anche eseguendo con il plugin di Autenticazione FlowFuse che aggiunge qualsiasi informazione su un utente FlowFuse registrato quando si utilizza la dashboard.

## Struttura Plugin

Prendiamo un esempio rapido per dare una panoramica della struttura di un plugin Dashboard:

### package.json

```json
{
    "name": "node-red-dashboard-2-<plugin-name>",
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
    "licenza": "Apache-2. "
}
```

### index.html

Questo definisce qualsiasi plugin client/editor. Questo permette di definire le caratteristiche di Node-RED Editor come il contenuto di iniezione nella Dashboard 2. barra laterale, o se i plugin runtime stanno aggiungendo i dati di autenticazione/client ai messaggi.

 <script type="text/javascript">
    RED.plugin. egisterPlugin('node-red-dashboard-2-<plugin-name>', {
        type: 'node-red-dashboard-2',
        tabs: [
            {
                id: 'my-tab-id',
                etichetta: 'La mia scheda',
                /\*\*
                 \* Esegue quando le schede vengono create per la prima volta
                 \* @param {object} base - nodo ui-base per cui questa barra laterale rappresenta
                 \* @param {object} genitore - elemento DOM per aggiungere il contenuto ad
                 \*/
                init (base, parent) {
                    // aggiungi dei contenuti alla scheda
                }
            }
        ],
        auth: true/false, // Dichiara nella Dashboard 2. se questo debba essere elencato nella scheda "Dati Client"
        descrizione: '', // Se "auth: true", questo viene utilizzato nella scheda "Dati Client" della barra laterale Dashboard
    })
 </script>

### index.js

Il file `js` di un plugin definirà i comportamenti di runtime per la Dashboard 2.0. Qui puoi definire i tuoi ganci e qualsiasi altro codice che vuoi eseguire quando la Dashboard 2. è istanziato o i messaggi vengono inviati avanti e indietro tra la Dashboard e Node-RED.

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

Se uno qualsiasi di `onInput`, `onAction`, `onChange` o `onLoad` restituisce `null`, poi il `msg` si fermerà bruscamente lì, e non sarà inviato su nessun altro nel flusso.