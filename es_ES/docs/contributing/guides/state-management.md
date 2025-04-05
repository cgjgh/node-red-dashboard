---
description: Administración del estado principal en Node-RED Dashboard 2.0 para mantener una interfaz de usuario dinámica y receptiva.
---

# Administración del Estado

El panel de control 2.0 proporciona un almacén de datos dentro de Node-RED para que sea posible actualizar los clientes del panel de control y se mantengan los datos. Esto es particularmente útil para widgets como `ui-chart` donde puede querer conservar un historial de puntos de datos, o para widgets como `ui-text` donde quieres conservar el último valor mostrado.

Esta página detalla las diferentes "tiendas" que tenemos en su lugar y para qué se utilizan.

También puedes echar un vistazo al [Archivo de eventos](./events.md) para ver más detalladamente cuándo se utilizan estas tiendas y cómo interactúan con el resto del panel.

## Lado de cliente (panel)

![Una imagen que representa las tres tiendas vuex del lado del cliente que tenemos en el tablero 2. ](../../assets/images/stores-client-side.jpg){data-zoomable}
_Una imagen que muestra las tres tiendas vuex del lado del cliente que tenemos en el Tablero 2.0_

Nuestras tiendas del lado del cliente se construyen usando [VueX](https://vuex.vuejs.org/). Estas tiendas pierden sus datos en una actualización del cliente (pero son repobladas por las tiendas del lado del servidor), y se utilizan para mantener un centralizado, vista consistente de los datos a través de toda la aplicación Vue mientras el usuario navega alrededor del Tablero.

### tienda de `configuración`

Esto sólo almacena la respuesta de nuestra petición inicial `/_setup`. Este objeto, en el núcleo, contiene la configuración de SocketIO para ayudar al cliente a conectarse al servidor.

También es posible que los plugins añadan a este objeto (ver [Añadiendo Plugins](../plugins/#index-js)) datos adicionales que pueden ser útiles en toda la aplicación.

### Tienda `ui`

Esta tienda es donde almacenamos la [ui-config]completa (./events#ui-config) que detalla todas las páginas, temas, grupos y widgets para representar en un Tablero.

### `data` tienda

El datastore del lado del cliente es un mapa de id's del widget a:

- El último `msg` recibido por el widget
- Una matriz de objetos `msg` que representa todos los objetos `msg` conocidos recibidos por el widget

En la mayoría de los casos, un widget sólo necesita referencia al mensaje _last_. En algunos casos, por ejemplo, `ui-chart`, la historia completa es necesaria para representar una historia de datos.

Cuando se carga un widget por primera vez, emitimos un evento `widget-load`, que en el manejador predeterminado `onLoad`, intentará recuperar el último mensaje recibido por el widget del servidor de datastore, y guardarlo en la tienda de `datos` del lado del cliente. Puedes leer más sobre esto en [Archivo de eventos](./events.md).

Es posible que un widget acceda al objeto mapeado `msg` utilizando:

```vue
<template>
    <pre>esto. ensayos[this.id]</pre>
</template>
<script>
exportar por defecto {
    calculado: {
        . .mapState('data', ['mensajes'])
    }
}
</script>
```

_Un ejemplo de archivo Widget.vue que utiliza la tienda `data` para acceder al último mensaje recibido por el widget_

Este valor también se actualiza automáticamente cuando se recibe un nuevo mensaje, mientras ese widget esté usando los manejadores predeterminados, se detalla de nuevo en [Archivo de eventos](./events.md).

## Servidor lateral (Nodo-RED)

![Una imagen que representa las dos tiendas vuex del lado del servidor que tenemos en el tablero 2. ](../../assets/images/stores-server-side.jpg){data-zoomable}
_Una imagen que muestra las dos tiendas del lado del servidor que tenemos en el panel 2.0_

Nuestras tiendas del lado del servidor mantienen la "única fuente de verdad". Cuando cualquier cliente de tablero se conecta, los datos centralizados se envían a cada cliente, y las tiendas del lado del cliente están pobladas con las partes relevantes de esta tienda centralizada.

En nuestra arquitectura del lado del servidor, utilizamos dos tiendas independientes:

- `datastore`: Un mapa de cada widget al último `msg` recibido por un nodo respectivo en el Editor.
- `statestore`: Un almacén para todas las propiedades dinámicas establecidas en widgets (ej. visibilidad o establecimiento de una propiedad en tiempo de ejecución). A menudo, estos valores son anulados de la configuración base encontrada en el `datastore`.

Cada vez que un servidor de funciones quiere escribir en estas tiendas, se hace una comprobación para asegurar que todos los mensajes proporcionados estén permitidos para ser almacenados. Un ejemplo de donde se bloquearía esto es si `msg._client. ocketid` se especifica y el tipo de nodo relevante está configurado para escuchar las restricciones del socket (por defecto, este es `ui-control` y `ui-notification`). En este caso, no queremos almacenar esos datos en nuestra tienda centralizada, ya que no es relevante para _todos_ los usuarios del panel de control.

### Importando tiendas

Las tiendas se importan en el archivo `.js` de un nodo con:

```js
const store = require('<path>/<to>/store.js')
```

### Tienda de datos

El servidor `datastore` es una tienda centralizada para todos los mensajes recibidos por los widgets en el Editor. Es un simple almacén clave-valor, donde la clave es el id del widget, y el valor es el mensaje recibido por el widget. En algunos casos, por ejemplo, `ui-chart` en lugar de grabar _just_ el último `msg` recibido, en realidad almacenamos un historial.

#### `datastore.save`

Cuando un widget recibe un mensaje, el manejador predeterminado `node.on('input')` almacenará el mensaje recibido, asignado al id del widget en el datastore utilizando:

```js
datastore.save(base, nodo, msg)
```

- `base`: El nodo `ui_base` al que está conectado la tienda
- `node`: El objeto node-RED estamos almacenando estado para
- `msg`: El mensaje que fue recibido por el nodo

Esto almacenará el último mensaje recibido por el widget, que puede ser recuperado por ese mismo widget al usar carga:

#### `datastore.get`

Cuando un widget es inicializado, intentará recuperar el último mensaje del datastore utilizando:

```js
datastore.get(node.id)
```

Esto garantiza, al actualizar el cliente, o cuando los nuevos clientes se conectan después de la generación de datos, que el estado se presenta de forma consistente.

#### `datastore.append`

Con `. ppend`, podemos almacenar varios mensajes contra el mismo widget, representando un historial de estado, en lugar de una referencia de un solo punto al valor _last_ solamente.

```js
datastore.append(base, nodo, msg)
```

- `base`: El nodo `ui_base` al que está conectado la tienda
- `node`: El objeto node-RED estamos almacenando estado para
- `msg`: El mensaje que fue recibido por el nodo

Esto se utiliza en `ui-chart` para almacenar el historial de puntos de datos, donde cada punto de datos podría haber sido un mensaje individual recibido por el widget.

#### `datastore.clear`

Cuando se elimina un widget del Editor, podemos borrar el datastore de cualquier mensaje almacenado en ese widget utilizando:

```js
datastore.clear(node.id)
```

Esto asegura que no tenemos ningún dato obsoleto en el datastore, y que no tengamos datos almacenados contra widgets que ya no existan en el Editor.

### Tienda de estado

El `statestore` es una tienda centralizada para todas las propiedades dinámicas establecidas contra widgets en el Editor. Las propiedades dinámicas pueden establecerse enviando payloads `msg.<property>` a un nodo determinado, p.ej. para ` ui-dropdown`, podemos enviar `msg.options` para sobreescribir la propiedad "Options" en tiempo de ejecución.

En el nivel superior está asignado a la clave ID del widget, luego cada widget tiene un mapa, donde cada clave es el nombre de la propiedad, mapeando el valor.

#### `statestore.getAll`

Para un ID de widget determinado, devuelve todas las propiedades dinámicas que se han establecido.

```js
statestore.getAll(node.id)
```

#### `statestore.getProperty`

Para el ID de un widget determinado, devuelve el valor de una propiedad en particular.

```js
statestore.getProperty(node.id, property)
```

#### `statestore.set`

Con un ID y propiedad de widget, almacene el valor asociado en el mapeo apropiado

```js
statestore.set(base, nodo, msg, propiedad, valor)
```

- `base`: El nodo `ui_base` al que está conectado la tienda
- `node`: El objeto node-RED estamos almacenando estado para
- `msg`: El mensaje que fue recibido por el nodo
- `property`: El nombre de la propiedad a almacenar
- `value`: El valor a almacenar contra la propiedad

#### `statestore.reset`

Elimina todas las propiedades dinámicas de un Widget/Node dado.

```js
statestore.reset(node.id)
```

