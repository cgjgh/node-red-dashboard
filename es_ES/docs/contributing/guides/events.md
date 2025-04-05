---
description: Sumérjase en la arquitectura de eventos de Node-RED Dashboard 2.0 para un eficiente manejo de datos e interacción con la interfaz de usuario.
---

# Archivo de eventos

Una parte importante del Tablero es cómo se comunican Node-RED y el Tablero. Esto se consigue usando [socket.io](https://socket.io/).

Aquí puedes encontrar detalles sobre las comunicaciones primarias que ocurren entre Node-RED (bloques en rojo) y el Tablero (bloques en azul). Los bloques hacen referencia a determinadas funciones y archivos dentro del código fuente para ayudar a navegar y entender dónde encontrar el código relevante.

Cada uno de los bloques cilíndricos se refiere directamente a una de nuestras tiendas del lado del cliente o del servidor, las cuales se detallan en la guía [Administración del Estado](./state-management.md).

## Arquitectura

Hemos roto la arquitectura/tráfico de eventos en tres grupos clave:

- **Cargando**: La carga inicial del tablero, o cuando una nueva configuración es enviada por Node-RED en un nuevo "Desplegado".
- **Entrada**: Cuando un mensaje (`msg`) es recibido por un nodo de panel dentro de Node-RED.
- **Acciones del tablero**: Cuando un usuario interactúa con un widget, o un widget envía un mensaje de vuelta a Node-RED.

### Flujo de eventos "Cargando"

![Un diagrama de flujo que muestra cómo los eventos atraviesan entre Node-RED (rojo) y el Dashboard (azul) en despliegue y primero-carga](../../assets/images/events-arch-load.jpg){data-zoomable}
_Un diagrama de flujo que muestra cómo los eventos atraviesan entre Node-RED (rojo) y el Tablero (azul) en despliegue y primera carga_

Aquí detallamos la petición HTTP "Configurar" inicial, consecuente tráfico de SocketIO y manejadores apropiados que se ejecutan cuando se implementa un Dashboard (a través de la opción "Desplegar"), así como cuando se carga por primera vez un Dashboard-cliente.

Tenga en cuenta la diferencia entre una carga de "Tablero", es decir, la aplicación completa y la conexión del navegador, y una carga individual de "Widget". Este último se activa para el widget _each_ cuando está montado/renderizado en el DOM.

### Flujo de eventos "Input"

![Un diagrama de flujo que muestra cómo los eventos recorren entre Nodo-RED (rojo) y el Dashboard (azul) cuando los mensajes son recibidos por un nodo de panel](../../assets/images/events-arch-msg.jpg){data-zoomable}
_Un diagrama de flujo que muestra cómo los eventos recorren entre Node-RED (rojo) y el Tablero (azul) cuando los mensajes son recibidos por un nodo de panel_

Este flujo detalla las funciones y el tráfico de SocketIO que ocurre cuando un mensaje es recibido por un nodo de panel dentro de Node-RED. Tenga en cuenta que la mayoría del panel principal 2. los widgets usan el manejador predeterminado `onInput`, pero en algunos casos, se utiliza un manejador personalizado `onInput` donde queremos un comportamiento diferente.

Nuestro manejador `onInput` del lado del servidor por defecto maneja los casos de uso comunes de:

- Actualizando el valor del widget en nuestra tienda de datos del lado del servidor
- Comprobando si el widget está configurado para definir un `msg.topic` y, si es así, actualizar la propiedad `msg.topic` del widget
- Comprueba si el widget está configurado con una opción `passthroughh`, y si es así, comprueba su valor antes de emitir el objeto `msg` a cualquier nodo conectado.
- Emite el objeto `msg` a cualquier nodo conectado, si es apropiado.

### Flujo de Evento "Acciones del Tablero"

Diferentes widgets desencadenan diferentes eventos dependiendo de los casos de uso específicos. El siguiente diagrama muestra los tres tipos de eventos que el cliente puede emitir al servidor, y cómo estos se manejan por separado.

![Un diagrama de flujo que muestra cómo los eventos transcurren desde el Tablero (azul) hasta Node-RED (rojo) cuando un usuario interactúa con el Tablero](../../assets/images/events-arch-client-events.jpg){data-zoomable}
_Un diagrama de flujo que muestra cómo los eventos transcurren desde el Tablero (azul) hasta Node-RED (rojo) cuando un usuario interactúa con el Tablero_

Algunos ejemplos de eventos que se emiten desde el panel de control a Node-RED incluyen:

- `widget-change` - Cuando un usuario cambia el valor de un widget, por ejemplo, una presentación o entrada de texto
- `widget-action` - Cuando un usuario interactúa con un widget, y el estado del widget no es importante, por ejemplo, un clic de botón
- `widget-send` - Utilizado por `ui-template` para enviar un objeto personalizado `msg`, por ejemplo, `send(msg)`, que se almacenará en la tienda de datos del lado del servidor.

#### Sincronizando Widgets

El evento `widget-change` se utiliza para emitir entrada desde el servidor, y representa un cambio de estado para ese widget, e. . un interruptor puede estar encendido/apagado haciendo clic en él. En este caso, si tiene varios clientes conectados a la misma instancia de Node-RED, Dashboard se asegurará de que los clientes estén sincronizados cuando los valores cambien.

Para ejemplo si mueve un deslizador en una instancia del tablero, todos los deslizadores conectados también se actualizarán automáticamente.

Para desactivar este patrón de diseño de "única fuente de verdad", puedes comprobar el tipo de widget en la pestaña ["Datos del cliente"](../../user/multi-tenancy#configuring-client-data) de la configuración del panel de control.

## Lista de eventos

Esta es una lista completa de todos los eventos que se envían entre Node-RED y el Tablero a través de socket.io.

### `ui-config`

- Payload: `object{ dashboards, tema, páginas, grupos, widgets }`

Utilizado para transportar los datos de disposición del panel/tema/página/grupos/[widget](#widget) asignados por sus respectivos identificadores.

### `msg-input:<node-id>`

- Payload: `<msg>`

Enviado desde NR a la interfaz de usuario cuando se recibe una entrada de msg en un nodo de panel.

### `widget-load`

- ID: `<node-id>`
- Payload: `None `

Enviado desde la interfaz de usuario a NR cuando la interfaz de usuario / widget se carga por primera vez. Da una oportunidad para que NR proporcione el widget con cualquier valor existente conocido.

### `widget-change`

- ID: `<node-id>`
- Payload: `<value>` - normalmente los datos de carga útil que se enviarán en el mensaje

Enviado desde la interfaz de usuario a NR cuando el valor de un widget es cambiado desde la interfaz de usuario, por ejemplo, entrada de texto, deslizador. Asume el valor emitido es el `msg.payload`.

Esto toma hte previamente recibido msg, y lo fusiona con el nuevo valor recibido, por ejemplo si el msg fue:

```json
{
    "payload": 30,
    "topic": "on-change"
}
```

y el `widget-change` recibió un nuevo valor de `40`, entonces el mensaje recién emitido sería:

```json
{
    "payload": 40,
    "topic": "on-change"
}
```

Cualquier valor que se reciba aquí también se almacenará contra el widget en el almacén de datos.

### `widget-sync`

- Payload: `<msg>`

Activado desde el controlador `onChange` del lado del servidor. Esto envía un mensaje a todos los clientes conectados e informa a los widgets relevantes de los cambios de estado y valor. Por ejemplo, cuando se mueve un deslizador, el mensaje `widget-sync` asegurará que todos los clientes conectados, y sus respectivos deslizadores, se actualizarán con el nuevo valor.

### `widget-action`

- ID: `<node-id>`
- Payload: `<msg>`

Enviado desde la interfaz de usuario a NR cuando se acciona un widget, por ejemplo, hacer clic en un botón o subir un archivo.

### `widget-send`

- ID: `<node-id>`
- Payload: `<msg>`

Generalmente usado por `ui-template`. Este evento está envuelto por la función `send(msg)` de Plantilla, que permite a los usuarios definir sus propios objetos `msg` completos para ser emitidos por un nodo `ui-template`. Si se envía un valor que no sea un objeto, entonces el tablero lo envuelve automáticamente en un objeto `msg.payload`, por ejemplo:

```js
enviar(10)
```

resultará en un objeto `msg` de:

```json
{
    "payload": 10 
}
```

De la misma manera, es en su lugar un objeto es especificado:

```js
send({ myVar: 10, tema: "my-topic" })
```

entonces el objeto `msg` será:

```json
{
    "myVar": 10,
    "topic": "my-topic"
}
```

Cualquier `msg` emitido usando esta función también se almacena en el datastore asociado con el widget.

## Payloads del evento

Este detalle algunas de las estructuras de objetos utilizadas para enviar datos cruzan las conexiones io de socket entre Node-RED y Dashboard.

### `Widget`

Dentro del `ui-config`, la propiedad `widgets` es una matriz de objetos `Widget`. Cada objeto `Widget` tiene las siguientes propiedades:

- **id**: El id asignado por Node-RED para identificar ese nodo en el editor
- **props**: La colección de propiedades que el usuario puede definir dentro del Editor para ese nodo
- **componente** - El respectivo componente Vue requerido para renderizar, agregado front-end (en App.vue)
- **estado** - Contiene valor definiendo el "estado" visual e interactivo de un widget, p. ej., `actived: true` o `visible: false` (`visible: ` aún no soportado)
