---
description: Comience su viaje de Node-RED Dashboard 2.0 con esta guía. Perfecto para principiantes.
---

<script setup>
    importar { ref } desde 'vue'
    importar FlowViewer desde '. components/FlowViewer.vue'
    importar ExampleDesignPatterns de '.. examples/design-patterns.json'
    import RecommendedTutorials from './components/RecommendedTutorials.vue'

    const examples = ref({
      'design-patterns': ExampleDesignPatterns,
    })
</script>

# Comenzando

## Acerca de

Bienvenido a la documentación del panel de control de Node-RED 2.0, el sucesor del panel de control original y muy popular, Node-RED.

Este proyecto fue formado por FlowFuse, como parte de los esfuerzos por actualizar el panel original para alejarse de Angular v1. que ha sido [oficialmente obsoleto](https://flowfuse.com/blog/2024/06/dashboard-1-deprecated/). Puedes leer nuestra declaración completa sobre _por qué_ estamos construyendo el Tablero 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/?_gl=1*cckr5u*_gcl_au*MTAzMTA0MzY1Ni4xNzE2MzY2NTAz).

## Tutoriales Recomendados

<RecommendedTutorials />

## Instalación

[FlowFuse](https://flowfuse.com)'s Node-RED Dashboard 2.0 is available in the Node-RED Palette Manager. Para instalarlo:

- Abre el menú en la parte superior derecha de Node-RED
- Haga clic en "Administrar paleta"
- Cambiar a la pestaña "Instalar"
- Buscar en `node-red-dashboard`
- Instala el paquete `@flowfuse/node-red-dashboard` (no `node-red/node-red-dashboard`)

![Instala a través de "Administrar paleta"](./assets/images/install-palette.png){data-zoomable}
_Captura de pantalla mostrando los nodos disponibles en el Administrador de paletas RED de nodo_

Los nodos estarán entonces disponibles en su editor para que usted comience.

Si quieres usar `npm` para instalar tus nodos, puedes [seguir estas instrucciones](https://nodered.org/docs/user-guide/runtime/adding-nodes)

## Jerarquía del tablero

Cada Tablero es una colección de widgets (gráficos, botones, formularios) que pueden ser configurados y organizados en nuestra propia interfaz de usuario. La jerarquía de un panel es la siguiente:

- **Base** - Define la URL base (por ejemplo, `/dashboard`) para tu Tablero.
- **Página** - Una página dada a la que un visitante puede navegar, la URL extenderá la base, p. ej., `/dashboard/page1`. Cada página también puede tener un tema definido, único, que controla el estilo de todos los grupos/widgets en la página.
- **Grupo** - Una colección de widgets. Renderizado en una página.
- **Widget** - Un único widget (por ejemplo, gráfico, botón, formulario) creado en el Tablero.

## Añadiendo tus primeros widgets

Con los nodos instalados, iniciarse es tan fácil como elegir un nodo de la paleta (la lista de nodos a la izquierda de los nodos) en Node-RED, y sumergiéndola en tu lienzo.

![Grabación de pantalla para mostrar lo fácil que es desplegar tu primera aplicación de Dashboard 2.0. (./assets/images/getting-started.gif){data-zoomable}
Grabación _Pantalla para mostrar lo fácil que es desplegar tu primera aplicación 2.0._

En este caso, caemos en un `ui-button`, haga clic en "Deploy" y luego puede ver el botón corriendo en vivo en nuestra interfaz de usuario.

Tenga en cuenta también que el panel de control automáticamente creará un nuevo grupo, página, tema y panel base para usted.

## Configurando su diseño

Dashboard 2.0 añade la barra lateral correspondiente "Dashboard 2.0" al editor de Node-RED . Esta barra lateral proporciona una interfaz por la que ver sus páginas, temas, grupos y widgets. Desde aquí puede añadir nuevas páginas y grupos, modificar ajustes existentes y reordenar contenido a su gusto.

![Captura de pantalla que muestra la barra lateral del Tablero 2.0 en el Editor RED del Nodo.](./assets/images/getting-started-sidebar.png){data-zoomable}
_Captura de pantalla que muestra la barra lateral del Tablero 2.0 en el Editor RED._

Las opciones de diseño en un panel de usuario 2.0 están controladas por dos ajustes principales:

- **Diseño de página:** Controla cómo se presentan los `ui-groups` en una página determinada en tu aplicación.
- **Barra lateral de navegación:** Define el estilo de navegación izquierda, definido en el nivel `ui-base`.

![Ejemplo de un diseño de página de "cuadrícula", con una barra lateral "Colapsando". (./assets/images/getting-started-layout.png){data-zoomable}
_Ejemplo del diseño de la página "Grid", con una navegación lateral "Colapsando"._

### Página por defecto

Cada página en Dashboard 2.0 tiene una URL única. Si un usuario navega a una ruta no reconocida, debajo de la ruta `/dashboard/`, entonces se utiliza una página por defecto para volver a caer.

Actualmente, en el panel de control 2.0, la página por defecto es elegida como la primera en la lista de páginas en la navegación lateral:

![Captura de pantalla de la lista de páginas en el panel lateral 2.0 del Tablero](./assets/images/default-page-layout.png "Captura de pantalla de la lista de páginas en el Tablero 2. panel lateral"){data-zoomable}
_Captura de pantalla de la lista de páginas en el panel lateral del panel 2.0_

En este ejemplo, la página _"Widgets de Terceros"_ es la página por defecto.

### Opciones de diseño

Actualmente, tenemos tres opciones diferentes para el diseño de una página:

- **Cuadrícula:** ([docs](https://dashboard.flowfuse.com/layouts/types/grid.html)) El diseño predeterminado para una página. Utiliza una estructura de cuadrícula de 12 columnas para diseñar los grupos. Los anchos de cada grupo o widget definen el número de columnas en las que se representarán. Así, un "ancho" de 6" se rendería al 50% de la pantalla. Los diseños de cuadrícula responden por completo, y se ajustarán al tamaño de la pantalla.
- **Corregido:** ([docs](https://dashboard.flowfuse.com/layouts/types/fixed.html)) Cada componente se renderizará en un ancho _fijo_ sin importar el tamaño de la pantalla. La propiedad "width" se convierte en un valor de píxel fijo (múltiplos de 48px por defecto).
- **Notebook:** ([docs](https://dashboard.flowfuse.com/layouts/types/notebook.html)) Este diseño se estirará al 100% de ancho, hasta un ancho máximo de 1024px, y se alineará centralmente. Es particularmente útil para narrar historias (p. ej., artículos/blogs) o análisis tipo interfaces de usuario (p. ej. Jupyter Notebooks), donde desea que el usuario digile contenido en un orden particular a través de desplazamiento.
- **Temas:** ([docs](https://dashboard.flowfuse.com/layouts/types/tabs.html)) Este diseño organiza contenido en secciones separadas de pestañas, permitiendo a los usuarios cambiar entre diferentes vistas o categorías de contenido sin salir de la página. Cada pestaña puede contener múltiples grupos y widgets, y es especialmente útil para organizar grandes cantidades de información en segmentos fácilmente digestibles. El diseño de "Pestañas" asegura una mejor navegación y una interfaz de usuario más limpia cuando se necesitan múltiples categorías de contenido en una sola vista.

### Navigation Sidebar

Construir en el marco de la interfaz de usuario es una barra de navegación lateral junto con la parte superior, la "barra de aplicaciones". Existen opciones de configuración que permiten controlar el comportamiento de navegación lateral. Las opciones incluyen:

- **Colapsar:** Cuando se abre la barra lateral el contenido de la página se ajustará con el ancho de la barra lateral.
- **Solucionado:** La barra lateral completa siempre será visible, y el contenido de la página se ajustará al ancho de la barra lateral.
- **Colapsar a los iconos:** Cuando se minimiza, los usuarios todavía pueden navegar entre páginas haciendo clic en los iconos que representan cada página en la barra lateral.
- **Aparecen sobre el contenido:** Cuando la barra lateral está abierta, la página tiene una superposición, y la barra lateral se sienta encima.
- **Ocultar:** La barra lateral nunca se mostrará, y la navegación entre páginas puede ser conducida por [`ui-control`](https://dashboard.flowfuse.com/nodes/widgets/ui-control.html).

## Patrones de diseño

Hay dos patrones de diseño básicos que son posibles al construir con el tablero 2.0:

- **Fuente única de la verdad:** Todos los usuarios de tu panel de control verán los mismos datos. Esto es útil para aplicaciones industriales de IoT o domótica.
- **Multi Tenancy:** Los datos mostrados en un widget en particular son únicos para un cliente/sesión/usuario determinado. Esto representa una aplicación web más tradicional, donde cada usuario tiene su propia sesión y sus datos asociados.

Vale la pena señalar que estos dos patrones pueden ser mezclados y emparejados dentro de una sola aplicación de Tablero 2.0, mostrada [later](#example).

### Fuente única de la verdad

![Fuente Única de la Verdad](./assets/images/design-pattern-single.png){data-zoomable}
_Flujo de trabajo ejemplo para demostrar el patrón de diseño "Fuente Única de la Verdad"._

Este es el patrón que el panel original de Node-RED utilizó. En este patrón, todos los usuarios del Tablero verán los mismos datos. Los datos que rellenan un widget generalmente son impulsados por una pieza de hardware o llamada API de uso general.

Cuando un usuario va a visitar un Dashboard, los widgets cargarán su estado respectivo y lo mostrarán a todos los usuarios.

Un ejemplo de esto es que si usted tiene elementos interactivos, p. ej. un deslizador enlazado a un gráfico, entonces un usuario que mueva el control deslizante dibujará datos al gráfico de todos los tableros de control de otros usuarios.

### Tenencia múltiple

![Multi Tenancy](./assets/images/design-pattern-client.png){data-zoomable}
_Ejemplo de flujo de trabajo para demostrar el patrón de diseño "Multi Tenancy"._

En el panel de control 2.0 podemos configurar un tipo de nodo determinado a ["Aceptar datos del cliente"](/user/sidebar.html#client-data) desde la barra lateral:

<img data-zoomable style="max-width: 400px; margin: auto;" src="/images/dashboard-sidebar-clientdata.png" alt="Screenshot of an example 'Client Data' tab"/><em>Captura de pantalla de un ejemplo de "Datos del cliente" pestaña</em>

Si "Include Client Data" está activado, entonces _all_ objetos `msg` emitidos desde _all_ nodos contendrán un `msg. objeto client`, el cual será como mínimo el `socketId` para el cliente conectado. Es posible añadir más datos a este objeto, como un nombre de usuario, dirección de correo electrónico u otro identificador único con los plugins de Dashboard. . el [FlowFuse User Plugin](https://flowfuse.com/blog/2024/04/displaying-logged-in-users-on-dashboard/).

La tabla "Aceptar datos de cliente" permite la configuración sobre la cual los tipos de nodo prestarán atención a cualquier información `msg._client` proporcionada. Cualquier `msg` enviado _a_ uno de estos nodos puede incluir un valor `msg._client` para especificar una conexión particular (e. , nombre de usuario, identificador de socket) a los que se deben enviar los datos, en lugar de a todos los clientes.

Para los usuarios familiarizados con el panel de control original de Node-RED reconocerás este patrón por lo que podrías hacer con `ui-notification` y `ui-control`, ahora, en el panel 2. , es posible para los widgets _all_.

La clave aquí es que los datos generalmente se inyectan en un nodo como consecuencia de una acción del usuario, p.ej. haciendo clic en un botón, viendo una página o enviando un formulario, y los datos que responden se envían _sólo_ a ese usuario.

Un ejemplo sencillo de este patrón de diseño en el panel de control 2.0 es utilizar el nodo [UI Event](./nodes/widgets/ui-event.md). El nodo `ui-event` emite un `msg` cuando un usuario carga una página. Dentro de `msg` hay un objeto de datos completo `msg._client` disponible para la conexión de ese cliente. Si este mensaje es enviado a otro nodo que acepta los datos del cliente, entonces ese `msg` completo _only_ será enviado a ese cliente especificado.

### Ejemplo

Aquí tenemos un flujo que producirá algunos datos definidos por el cliente, y algunos datos compartidos. Al importar, asegúrese de comprobar que en la barra lateral del panel 2.0, tanto `ui-text` como `ui-template` se comprueban en la tabla "Acepta datos del cliente".

<video controls>
    <source src="./assets/videos/demo-design-patterns.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

En el video de arriba vemos que en algunos casos, los datos se envían sólo al cliente que lo activó (p. ej. y en otros, los datos se comparten a través de todas las sesiones del cliente (por ejemplo, la visualización del valor del control deslizante en el gráfico).

Si quieres jugar con este ejemplo, el flujo es el siguiente:

<FlowViewer :flow="examples['design-patterns']" height="425px" style="margin-bottom: 24px;"/>

Para cubrir un poco más de detalle sobre el flujo en sí:

#### Datos del cliente

Para este caso de uso hemos establecido `ui-text` y `ui-template` configurados en la barra lateral a "Aceptar restricciones de cliente".

En la parte superior, el nodo `ui-event` emitirá un mensaje cuando un usuario cargue la página. Este mensaje contendrá un objeto `msg._client`, que es único para la conexión de ese usuario. Este mensaje se envía a un nodo `ui-template`, el cual mostrará el identificador de socket del usuario específico.

Del mismo modo, también tenemos un botón, que también emitirá `msg. datos del cliente (como harán todos los nodos), pero esta vez se enviará a un nodo `ui-text`. El `ui-text\` mostrará la marca de tiempo de la última vez que el cliente/usuario dado hizo clic en ese botón.

#### Datos compartidos (todos los clientes)

Esta sección del flujo demuestra cómo un deslizador puede ser utilizado para controlar un gráfico, ten en cuenta que conectamos la diapositiva directamente al gráfico porque el `ui-chart` no ha sido configurado para "Aceptar datos de cliente".

También conectamos el `ui-slider` a dos nodos `ui-template`. Dado que los nodos `ui-template` _son_ configurados para "Aceptar datos de cliente", podemos demostrar datos compartidos y específicos del cliente en el mismo flujo eliminando `msg. datos del cliente en el camino al nodo `ui-template`inferior. Al eliminar esto, cualquier dato deslizante enviado aquí será enviado a _all_ conexiones, porque el`msg`no especifica un`_client`. La parte superior de `ui-template\` sólo se actualizará para el cliente que movió el deslizador.

## Contribuyendo

Si desea ejecutar este conjunto de nodos localmente, y específicamente para ayudar a contribuir a los esfuerzos de desarrollo, puedes leer la documentación [Contributing](./contributing/index.md).

Si quieres construir tus propios nodos y widgets independientes que se integran sin problemas con Dashboard 2. , puedes leer nuestra guía sobre esa [here](./contributing/widgets/third-party.md).
