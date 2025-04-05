---
description: Aprenda el proceso de registro de widgets en Node-RED Dashboard 2.0 para mejorar la funcionalidad de su tablero.
---

# Registro de Widget

Cada `ui-base`, `ui-page` y `ui-group` tiene una función `.register`. La función principal de registro se puede encontrar en `ui-base`.

Esta función es usada por todos los widgets para informar al Tablero de su existencia, y permite que el widget defina qué grupo/página/ui pertenece también, junto con las propiedades relevantes que el widget tiene y cualquier gestor de eventos (e. . `onInput` o `onAction`).

La función es llamada dentro del Node-RED `. s` archivo, y en el caso de un registro de un widget como parte de un grupo (el caso de uso más común), se vería algo como esto:

```js
módulo. xports = function (RED) {
    function MyNode (config) {
        // crear nodo en Node-RED
        RED. odas. reateNode(esto, config)
        // almacena referencia a nuestro nodo RED
        const node = this

        // cual grupo estamos renderizando este widget
        const group = RED. odes.getNode(configuración. roup)

        // un objeto que detalla los eventos para suscribirse a
        const evts = {}

        // informar al panel de interfaz de usuario de que estamos agregando este grupo
        . egister(node, config, evts)
    }

    RED.nodes.registerType('ui-mywidget', MyNode)
}
```

## Argumentos

Las entradas de la función de registro difieren ligeramente dependiendo de si se llama en el `ui-group`, `ui-page` o `ui-base`:

- `group.register(node, config, evts)`
- `page.register(grupo, nodo, configuración, evts)`
- `base.register(page, group, node, config, evts)`

Tenga en cuenta que todas tienen 3 entradas en común:

### `nodo`

Este es el `esto` del constructor de tu nodo, y puede ser usado directamente desde el valor proporcionado desde Node-RED.

### `configurar`

Esto está disponible por Node-RED como la entrada al constructor, y generalmente puede pasar directamente al `. egister` función sin modificación, será un objeto que mapee todas las propiedades y valores que han sido descritos en el `. definición tml`.

### `evts`

Exponemos un rango de diferentes controladores de eventos como parte de la función `registrar`. Todos estos manejadores ejecutan el lado del servidor (Node-RED).

En algunos casos, es posible definir funciones completas (que se ejecutarán en el punto apropiado en el ciclo de vida del evento), en otras ocasiones, solo es posible definir un valor `true`/`false` que informe al panel de control que desea que el widget envíe o suscriba a ese evento.

Puede encontrar un desglose completo del ciclo de vida del evento [here](../../contributing/guides/events.md).

```js
const evts = {
    onAction: // boolean
    onChange: // boolean || function
    beforeSend: // function
    onInput: // function
    onError: // function
    onSocket // objeto
}
```

## Eventos

Todos estos controladores de eventos definen el comportamiento que se ejecuta en el lado del servidor (es decir, dentro de Node-RED). Si estás buscando controladores de eventos en el lado del cliente ver [here](../widgets/third-party.md#configuring-your-node).

### `.onAction` (`boolean`)

Cuando se establece como `true`, esta bandera activará el manejador predeterminado cuando los widgets del panel envíen un evento `widget-action`.

1. Asigna el valor proporcionado a `msg.payload`
2. Agrega cualquier `msg.topic` definido en la configuración del nodo
3. Ejecuta `evts.beforeSend()` _(si se proporciona)_
4. Envía el `msg` en adelante a cualquier nodo conectado usando `node.send(msg)`

Un ejemplo de esto es con `ui-button`, donde el `UIButton` del widget contiene una función `@click`, que contiene:

```js
aquí.$socket.emit('widget-action', this.id, msg)
```

Esto envía un mensaje vía SocketIO a Node-RED, con el tema del ID del widget. Debido a que el `ui-button` tiene `onAction: true` en su registro, ejecutará el manejador predeterminado detallado arriba.

### `.onChange` (`boolean` || `function`)

Similar a `onAction`, cuando se usa como un boolean, esta bandera activará el manejador predeterminado para un evento `onChange`.

#### Default `onChange` Handler

1. Asigna el valor proporcionado a `msg.payload`
2. Agrega cualquier `msg.topic` definido en la configuración del nodo
3. Ejecuta `evts.beforeSend()` _(si se proporciona)_
4. Almacena el mensaje más reciente en el widget bajo la propiedad `._msg` que contendrá el último estado/valor del widget
5. Pusiona un evento `widget-sync` para sincronizar los widgets en todos los clientes.
6. Envía el `msg` hacia adelante a cualquier nodo conectado

#### Custom `onChange` Handler

Alternativamente, puede anular este comportamiento predeterminado proporcionando una función personalizada `onChange`. Un ejemplo de esto está en el nodo `ui-switch` que necesita hacer `node. actualizaciones de tatus` para que el editor Node-RED refleje su estado más reciente:

```js
/**
 * Manejar la entrada del widget
 * @param {object} msg - el último msg conocido (antes de este nuevo valor)
 * @param {boolean} valor - el valor actualizado enviado por el widget
 * @param {Socket} conn - socket. o socket conectando al servidor
 * @param {String} id - id del widget enviando la acción
 */
onChange: async function (msg, valor, conn, id) {
    // asegúrate de que tenemos la última instancia del nodo
    const wNode = RED. odes.getNode(node.id)

    nodo. tatus({
        fill: value ? 'verde' : 'rojo',
        forma: 'anillo',
        texto: valor ? estados[1] : estados[0]
    })

    // recuperar el valor asignado on/off
    const on = RED. til.evaluateNodeProperty(config.onvalue, config.onvalueType, wNode)
    const off = RED.util. valuateNodeProperty(config.offvalue, config.offvalueType, wNode)
    msg. ayload = valor? on : off

    // sync this change to all clients with the same widget
    const exclude = [conn.id] 
    base. mit('widget-sync:' + id, msg, node, exclude)

    // simula el nodo Node-RED recibiendo una entrada
    wNode. end(msg)
}
```

### `.beforeSend(msg)` (`function`)

Esta función de middleware se ejecutará antes de que el nodo envíe cualquier `msg` a los nodos consecuentes conectados en el Editor (e. . en `onInput`, `onAction` y `onChange` controladores predeterminados).

La función debe tomar `msg` como una entrada, y también devolver `msg` como una salida.

En `ui-button`, usamos `beforeSend` para evaluar el `msg.payload` ya que tenemos un `TypedInput` ([docs](https://nodered.org/docs/api/ui/typedInput/). El `TypedInput` necesita evaluar dentro de Node-RED, ya que puede referenciar variables fuera del dominio del nodo del botón (por ejemplo, `global` o `flow`). El manejador por defecto `onInput` toma la salida de nuestro `beforeSend` y la procesa en consecuencia.

### `.onInput(msg, send)` (`function`)

Definir esta función anulará el manejador `onInput` predeterminado.

#### Default `onInput` Handler

1. Almacena el mensaje más reciente en el widget bajo `node._msg`
2. Agrega cualquier `msg.topic` definido en la configuración del nodo
3. Comprueba si el widget tiene una propiedad `passthru`:
 - Si no se encuentra ninguna propiedad `passthru`, ejecuta `send(msg)`
 - Si la propiedad está presente, `send(msg)` sólo se ejecuta si `passthru` se establece en `true`

#### Manejador personalizado `onInput`

Cuando se proporciona, esto anulará el manejador predeterminado.

Utilizamos esto en los widgets del núcleo del tablero con `ui-chart`, donde queremos almacenar la historia del valor reciente `msg`, en lugar de _just_ el valor más reciente como hecho en el manejador por defecto. También lo usamos aquí para asegurarnos de que no tenemos demasiados puntos de datos (como se define en la configuración `ui-chart`).

Otro caso de uso aquí sería si no quieres pasar ningún payloads `msg` entrante a nodos conectados automáticamente, por ejemplo, podrías tener un montón de payloads `msg` de tipo comando que indican a tu nodo que haga algo, que no son relevantes para ningún nodo precedente en el flujo.

### `.onError(err)` (`function`)

Esta función es llamada dentro de los manejadores para `onAction`, `onChange` y `onInput`. Si alguna vez hay un problema con estos manejadores (incluyendo aquellos manejadores personalizados proporcionados), entonces la función `onError` será llamada.

### `.onSocket` (`object`)

Este es un manejador de eventos algo único, que sólo es utilizado por los widgets desarrollados externamente (i. . no forma parte de los widgets del núcleo del panel de control detallados en esta documentación). Se proporciona para que los desarrolladores puedan `emit`, y por lo tanto suscribirse a eventos personalizados de SocketIO que son transmitidos por sus widgets personalizados.

Puedes ver un ejemplo más detallado en nuestra documentación [here](../widgets/third-party.md#custom-socketio-events).

La estructura general de `onSocket` es la siguiente:

```js
const evts = {
    onSocket: {
        'my-custom-event': function (id, msg) {
            console.log('my-custom-event', id, msg)
        }
    }
}
```

Tenga en cuenta que estos eventos se emiten desde el panel de control, y así, estos manejadores se ejecutan dentro de Node-RED.