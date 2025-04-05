---
description: Desplácese como los diseños de tablero Node-RED pueden ser configurados para sus aplicaciones.
---

# Diseños

Los diseños son una configuración disponible sobre una página por página. Controlan cómo todos los widgets [Groups](../nodes/config/ui-group) se distribuyen en un determinado [Page](../nodes/config/ui-page):

![Captura de pantalla de las opciones de diseño en una página ui](../assets/images/layouts-page-layout-option.png){data-zoomable}
_Captura de pantalla de las opciones de diseño en una `ui-page`_

Actualmente ofrecemos cuatro opciones de diseño diferentes:

- [Grid](./types/grid.md)
- [Fixed](./types/fixed.md)
- [Notebook](./types/notebook.md)
- [Tabs](./types/tabs.md)

## Grupos y Widgets de tamaño

Un componente fundamental de la construcción de diseños en el Dashboard 2.0 (que sigue al Dashboard 1. Principio) es la capacidad de controlar el tamaño de cada grupo y widget con el widget de selección de tamaño:

![Captura de pantalla del widget de selección de tamaño para un ui-gauge](../assets/images/layouts-sizing-options.png){data-zoomable}
_Captura de pantalla del widget de selección de tamaño para un ui-gauge_

Exactamente lo que significa este tamaño difiere ligeramente dependiendo del diseño que utilices, pero el principio general es que el tamaño de un grupo o widget controlará cuánto espacio ocupa en el diseño.

Las diferencias principales están en la propiedad "ancho" del tamaño:

- Para "Grid" y "Notebook", el ancho se calcula como una porción de 12 _columns_, i. Una anchura de "6", ocuparía la mitad del ancho de la disposición.
- Para "Fijado", el ancho se calcula como un múltiplo de 90 _pixels_, es decir, un ancho de "3", ocuparía 270px de la pantalla.

## Puntos de ruptura

La mayoría de los diseños en el tablero utilizan un concepto de "Columns", mediante el cual el ancho del grupo se define como un número de columnas, e. , 6 y la página muestra también un número determinado de columnas, p. ej. 12. Esto significa que un grupo con un ancho de 6 ocuparía la mitad del ancho de la página.

Puntos de ruptura [pueden ser configurados](../nodes/config/ui-page.md#breakpoints) sobre una base de página por página, controlando cuántas columnas se renderizan en diferentes tamaños de pantalla. Esto es particularmente útil para el diseño receptivo, permitiéndole controlar cuantas columnas se muestran en un dispositivo móvil, tableta o escritorio.

## Opciones del tema

Además de la estructura central del diseño, definiendo cómo se ordenan y distribuyen los grupos, también es posible controlar algo del espaciado en un diseño a través de la página [Theme](../nodes/config/ui-theme).

### Opciones de configuración

![Captura de pantalla de las opciones del tema disponible para controlar los tamaños del diseño](../assets/images/layouts-theme-options.jpg){data-zoomable}
_Captura de pantalla de las opciones del tema disponibles para controlar los tamaños del diseño_

Cada color aquí se correlaciona con la sección respectiva de la siguiente imagen:

![Captura de pantalla de las opciones del tema disponible para controlar los tamaños del diseño](../assets/images/layouts-theme-example.jpg){data-zoomable}
_Captura de pantalla de las opciones del tema disponibles para controlar los tamaños del layout, aquí mostrando un diseño de "Grid"_

- **Padding de página:** El espacio que encapsula el contenido de la página completa, representado arriba como el espacio <span style="color: orange;">naranja</span>.
- **Espacio grupal:** El espacio entre cada grupo, representado arriba como el espacio <span style="color: lightseagreen;">verde</span>.
- **Widget Gap:** El espacio entre cada widget, dentro de un grupo, representado arriba como el espacio <span style="color: deeppink;">rosa</span>.

Una opción adicional disponible sobre una base de grupo por grupo es si mostrar o no el nombre del grupo, arriba representado por el espacio <span style="color: goldenrod;">amarillo</span>. Si esto está oculto, el relleno de grupo (<span style="color: blue;">azul</span>), se renderizará en los cuatro lados del grupo.

### No configurable (actualmente)

Aunque ofrecemos niveles razonables de personalización, hay algunas áreas no configurables actualmente:

- **Altura de la fila:** Una sola unidad de altura está fijada actualmente a 48px. Esto no puede cambiarse en este momento. Esto también afecta al diseño "Fijado", donde una sola unidad de ancho es impulsada por este valor.
- **Relleno de grupos:** El espacio que encapsula el contenido del grupo completo, representado arriba como el espacio <span style="color: blue;">azul</span>.