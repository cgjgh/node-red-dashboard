---
description: Guía paso a paso sobre la adición de nuevos widgets de núcleo al Tablero de Node-RED 2.0 para ampliar sus características interactivas.
---

# Añadiendo nuevos widgets de núcleo

Un único widget consiste en dos partes clave:

1. Un nodo RED que aparecerá en la paleta del editor Node-RED
2. `.vue` y código del lado del cliente que procesa el widget en un panel de control

Puedes explorar nuestra colección de widgets núcleo [here](../../nodes/widgets.md).

Siempre estamos abiertos a Pull Requests y nuevas ideas en widgets que se pueden añadir al repositorio del núcleo del Tablero.

Al añadir un nuevo widget a la colección del núcleo, necesitará seguir los pasos siguientes para asegurarse de que el widget está disponible en el editor Node-RED y se procesa correctamente en la interfaz de usuario.

## Lectura Recomendada

En el lado izquierdo de la navegación encontrarás una sección de "Guías útiles", Recomendamos echar un vistazo a estos ya que ofrecen una buena visión general de la estructura del panel de control 2. y algunos de los principios arquitectónicos subyacentes sobre los que se construye.

En particular, se recomiendan lo siguiente:

- [Archivo de eventos](/contributing/guides/state-management.html)
- [Administración del Estado](/contributing/guides/state-management.html)

## Checklist

Cuando se agrega un nuevo widget al panel de control 2. , necesitarás asegurarte de que se han seguido los siguientes pasos para que ese nuevo widget sea reconocido e incluido en un panel de control 2. construcción:

1. En `/nodes/`:
    - Añade `<widget>.html`
    - Añade `<widget>.js`
    - Añade la referencia a la sección `node-red/nodes` en `package.json`
2. En `/ui/`:
    - Añade `widgets/<widget>/<widget>.vue`
    - Añade un widget al archivo `index.js` en `/ui/widgets`

## Ejemplo <widget.vue>

```vue
<template>
    <div @click="onAction">
        {{ id }}
    </div>
</template>

<script>
    import { useDataTracker } from '../data-tracker.js'
    import { mapState } from 'vuex'

    export default {
        name: 'DBUIWidget',
        // we need to inject $socket so that we can send events to Node-RED
        inject: ['$socket', '$dataTracker'],
        props: {
            id: String,    // the id of the widget, as defined by Node-RED
            props: Object, // the properties for this widget defined in the Node-RED editor
            state: Object  // the state of this widget, e.g. enabled, visible
        },
        computed: {
            // map our data store such that we can get any data bound to this widget
            // received on input from Node-RED
            ...mapState('data', ['messages']), // provides access to `this.messages` where `this.messages[this.id]` is the stored msg for this widget
        },
        created () {
            // setup the widget with default onInput, onLoad and onDynamicProperties handlers
            this.$dataTracker(this.id)
        },
        methods: {
            onAction () {
                // we can send any data we need Node-RED through this (optional) message parameter
                const msg = {
                    payload: 'hello world'
                }
                // send an event to Node-RED to inform it that we've clicked this widget
                this.$socket.emit('widget-action', this.id, msg)
            }
        }
    }
</script>
  
<style scoped>
</style>
```

## Rastreador de datos

El rastreador de datos es un servicio de utilidad disponible globalmente que ayuda a configurar los controladores de eventos estándar para los widgets.

### Uso

El rastreador de datos está disponible globalmente a través de los widgets existentes y se puede acceder usando `this.$dataTracker(...)`.

El uso más simple del rastreador sería:

```js
...
creó () {
    esto.$dataTracker(this.id)
},
...
```

Esto configurará los siguientes eventos:

- `on('widget-load')` - Asegura que guardamos cualquier objeto `msg` recibido cuando un widget se carga por primera vez en el Tablero.
- `on('msg-input')` - El comportamiento por defecto comprueba cualquier propiedad dinámica (por ejemplo, visibilidad, estado deshabilitado) y también almacena el `msg` entrante en la tienda Vuex

### Comportamientos personalizados

También proporciona flexibilidad para definir controladores de eventos personalizados para un widget determinado, por ejemplo en un nodo `ui-chart`, tenemos una lógica que maneja la fusión de puntos de datos y la representación del gráfico cuando se recibe un mensaje.

Las entradas para la función `this.$dataTracker(widgetId, onInput, onLoad, onDynamicProperties)` se utilizan de la siguiente manera:

- `widgetId` - el ID único del widget
- `onInput` - una función que será llamada cuando un mensaje es recibido de Node-RED a través del manejador de socket `on(msg-input)`
- `onLoad` - una función que será llamada cuando el widget esté cargado, y desencadenado por el evento `widget-load`
- `onDynamicProperties` - una función llamada como parte del evento `on(msg-input)` y se activa _antes_ de la función predeterminada `onInput`. Este es un buen punto de entrada para comprobar las propiedades que han sido incluidas en el `msg` con el fin de establecer una propiedad dinámica (i. . contenido enviado a `msg.ui_update...`).

## Propiedades dinámicas

Node-RED permite la definición de la configuración subyacente para un nodo. Por ejemplo, un `ui-button` tendría propiedades como `label`, `color`, `icon`, etc. A menudo se desea que estas propiedades sean dinámicas, lo que significa que se pueden cambiar en tiempo de ejecución.

Es una práctica estándar dentro de Dashboard 2.0 soportar estas actualizaciones de propiedades a través de un objeto `msg.ui_update` anidado. Como tal, los usuarios pueden esperar poder controlarlos generalmente pasando por `msg. i_update.<property-name>` al nodo, que a su vez, debe actualizar la propiedad apropiada.

### Patrón de diseño

Esta sección describirá el patrón de diseño arquitectónico para desarrollar propiedades dinámicas en un widget.

El lado del servidor, las propiedades dinámicas se almacenan en nuestra tienda `state`, que es un mapeo del ID del widget a las propiedades dinámicas asignadas a ese widget. Esto se hace para que podamos asegurar la separación de las propiedades dinámicas de un widget de la configuración inicial definida y almacenada en Node-RED.

Antes de que el nodo `ui-base` emita el evento y payload `ui-config`, fusionamos las propiedades dinámicas con la configuración inicial, con las propiedades dinámicas permitidas para sobreescribir la configuración subyacente. Por lo tanto, cuando el cliente reciba un mensaje `ui-config`, tendrá la configuración más actualizada para el widget, wth the merging of both static and dynamic properties.

### Configurar propiedades dinámicas

#### Servidor lateral

Para establecer una propiedad dinámica en la tienda `state` del lado del servidor podemos utilizar el evento `beforeSend` en el nodo. Este evento se activa en cualquier ocasión en que el nodo del lado del servidor está a punto de enviar un mensaje al cliente, incluyendo cuando se recibe una nueva entrada en un nodo determinado.

Para esto, aprovechamos al máximo la función `set` de la tienda de estados:

```js
/**
    *
    * @param {*} base - nodo ui-base asociado
    * @param {*} node - el objeto node Node-RED que estamos almacenando estado para
    * @param {*} msg - el msg recibido completo (nos permite verificar credenciales/restricciones socketid )
    * @param {*} prop - la propiedad que estamos configurando en el nodo
    * @param {*} valor - el valor que estamos configurando
*/
(base, set node, msg, prop, value) {
    if (canSaveInStore(base, node, msg)) {
        if (! tate[node.id]) {
            estado[node.id] = {}
        }
        estado[node.id][prop] = valor
    }
},
```

Por ejemplo, en `ui-dropdown`:

```javascript
const evts = {
    onChange: true,
    beforeSend: function (msg) {
        if (msg. i_update) {
            const update = msg. i_update
            si (actualización de tipo. ptions ! = 'undefined') {
                // establecer dinámicamente la propiedad "options"
                statestore. et(group.getBase(), node, msg, 'options', update. ptions)
            }
        }
        return msg
    }
}

// informar al panel de interfaz de usuario de que estamos añadiendo este nodo
grupo. egister(nodo, configuración, evts)
```

#### Lado de cliente

Ahora que tenemos la actualización del estado del lado del servidor, en cualquier momento que actualicemos, el completo `ui-config` ya contendrá las propiedades dinámicas.

Luego tenemos que asegurarnos de que el cliente esté al tanto de estas propiedades dinámicas _conforme cambian_. Para ello, podemos utilizar el evento `onDynamicProperties` disponible en el [data tracker](#data-tracker).

Un buen patrón a seguir es proporcionar una variable `computado` en el componente en cuestión. A continuación, proporcionamos tres funciones, globales y útiles:

- `setDynamicProperties(config)`: Asignará las propiedades proporcionadas (en `config`) al widget, en la tienda del lado del cliente. Esto actualizará automáticamente el estado del widget, y cualquier referencia usando esta propiedad.
- `updateDynamicProperty(property, value)`: Actualizará la `property` relevante con el `value` proporcionado en la tienda cliente. También se asegurará de que la propiedad no es de tipo 'undefined'. Esto actualizará automáticamente el estado del widget, y cualquier referencia usando esta propiedad.
- `getProperty(property)`: Obtiene automáticamente el valor correcto para la propiedad solicitada. Buscará primero en las propiedades dinámicas, y si no se encuentra, la configuración estática definida en el evento [`ui-config`](../guides/events.md#ui-config).

Las variables calculadas pueden envolver la función `this.getProperty`, la cual estará siempre actualizada con el almacén centralizado de vuex.

```js
{
    // ...
    computed: {
        label () {
            return this.getProperty('label')
        }
    },
    created () {
        // we can define a custom onDynamicProperty handler for this widget
        useDataTracker(this.id, null, null, this.onDynamicProperty)
    // ...,
    methods () {
        // ...,
        onDynamicProperty (msg) {
            // standard practice to accept updates via msg.ui_update
            const updates = msg.ui_update
            // use globally available API to update the dynamic property
            this.updateDynamicProperty('label', updates.label)
        }
    }
}

```

### Actualizando documentación

Hay dos lugares importantes para asegurar que la documentación se actualiza al agregar propiedades dinámicas:

#### Documentación en línea:

Cada nodo tendrá un archivo `/docs/nodes/widgets/<node>.md` correspondiente que permite la definición de la tabla `dynamic` en el asunto frontal, por ejemplo:

```yaml
dinámica:
    Opciones:
        payload: estructura msg.options
        : ["Array<String>", "Array<{value: String}>", "Array<{value: String, label: String}>"]
    Clase:
        payload: estructura msg.class
        : ["String"]
```

Luego puede renderizar esta tabla en la documentación con:

```md
## Propiedades dinámicas

<DynamicPropsTable/>
```

#### Documentación del Editor:

Cada nodo tendrá un archivo `/locales/<locale>/<node>.html` que debe incluir una tabla de propiedades dinámicas, por ejemplo:

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

### Depurando propiedades dinámicas

El panel de control 2.0 viene como [Vista de depuración](/contributing/widgets/debugging.html) que incluye un [panel de especialistas](/contributing/widgets/debugging.html#dynamic-properties) para monitorear cualquier propiedad dinámica asignada a un widget. Esta puede ser una herramienta muy útil a la hora de comprobar si el cliente está al tanto de las propiedades dinámicas que se han enviado.