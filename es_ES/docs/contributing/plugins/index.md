---
description: Guía para construir plugins personalizados para Node-RED Dashboard 2.0, mejorando sus capacidades con su funcionalidad.
---

<script setup>
    importar AddedIn de '../../components/AddedIn.vue';
</script>

# Construir complementos de panel <AddedIn version="0.11.0"/>

Node-RED soporta el desarrollo de plugins personalizados que añaden comportamiento y funcionalidad al tiempo de ejecución Node-RED. Un caso de uso muy común de plugins es [temas Node-RED personalizados](https://nodered.org/docs/api/ui/themes/), que modifican la apariencia general del editor Node-RED subyacente.

Node-RED Dashboard 2.0 también soporta plugins. Esto le permite definir el comportamiento personalizado para el tiempo de ejecución del tablero, independientemente de nodos y widgets particulares. Actualmente, proporcionamos una colección de [API hooks](#index-js) que permite la inyección de código en varios puntos de la instanciación y tiempo de ejecución del Tablero.

Para integrar, asegúrate de que tu plugin Node-RED esté registrado con `"type": "node-red-dashboard-2"` en el archivo `package.json`. Esto le dirá a Node-RED que este es un plugin para el Dashboard 2.0.

_Nota: los plugins difieren de [Widgets de Terceros](../widgets/third-party.md). Los Widgets de Terceros se construyen como nodos que están disponibles en el editor Node-RED y pueden ser arrastrados al tablero. Los plugins se construyen para modificar el comportamiento del propio tiempo de ejecución del tablero._

## Plugins de autenticación <AddedIn version="1.10.0"/>

Uno de los casos de uso más comunes para los plugins del tablero de mando es añadir datos de usuario a los mensajes emitidos por el tablero. Utilizan un framework de autenticación existente establecido en el servidor Node-RED e inyectan datos de usuario en el `msg. objeto client` que se envía al flujo Node-RED.

### Configuración

La barra lateral del panel 2.0 listará cualquier plugin en la pestaña "Datos del cliente" que han declarado `auth: true` en su archivo `index.html`. Esto es necesario si un plugin está agregando/modificando datos en el objeto `msg._client`.

![Captura de pantalla de una pestaña de ejemplo "Datos del cliente"](/images/dashboard-sidebar-clientdata.png)
_Captura de pantalla de una pestaña de ejemplo "Datos del cliente"_

En la captura de pantalla anterior podemos ver que el código central del Tablero añade los datos de "Socket ID", y también estamos corriendo con el plugin de autenticación de FlowFuse que añade cualquier información sobre un usuario conectado en FlowFuse al usar el panel de control.

## Estructura del plugin

Tomemos un ejemplo rápido para dar una visión general de la estructura de un plugin de Dashboard:

### package.json

```json
{
    "name": "node-red-dashboard-2-<plugin-name>",
    "version": "<x.y.z>",
    "description": "<describe your plugin>",
    "main": "index.js",
    "scripts": {
        "test": "<run your tests here>"
    },
    "author": {
        "name": "<your name>",
        "url": "<your website/gh profile>"
    },
    "node-red": {
        "plugins": {
            "node-red-dashboard-2-<plugin-name>": "index.js"
        }
    },
    "license": "Apache-2.0"
}
```

### index.html

Esto define cualquier plugin cliente/editor. Permite la definición de características del editor de nodo-RED como la inyección de contenido en el panel de control 2. sidebar, o si algún plugin de tiempo de ejecución está añadiendo datos de autenticación/cliente a los mensajes.

 <script type="text/javascript">
    RED.plugins.registerPlugin('node-red-dashboard-2-<plugin-name>', {
        type: 'node-red-dashboard-2',
        tabs: [
            {
                id: 'my-tab-id',
                label: 'My Tab',
                /\*\*
                 \* Runs when tabs are first created
                 \* @param {object} base - ui-base node for which this sidebar represents
                 \* @param {object} parent - DOM element to append content to
                 \*/
                init (base, parent) {
                    // add some content to the tab
                }
            }
        ],
        auth: true/false, // Declares to Dashboard 2.0 whether this should list in the "Client Data" tab
        description: '', // If "auth: true", this is used in the "Client Data" tab of the Dashboard Sidebar
    })
 </script>

### index.js

El archivo `js` de un plugin definirá comportamientos de tiempo de ejecución para el Dashboard 2.0. Aquí es donde definirá sus ganchos, y cualquier otro código que desee ejecutar cuando el panel de control 2. es instanciado, o los mensajes se envían entre el panel de control y Node-RED.

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

Si alguno de `onInput`, `onAction`, `onChange` o `onLoad` regresa `null`, entonces el `msg` se detendrá abruptamente allí, y no se enviará más en el flujo.