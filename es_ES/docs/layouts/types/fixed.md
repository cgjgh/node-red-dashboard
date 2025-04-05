---
description: Aprenda cómo utilizar la disposición fija en Node-RED Dashboard 2.0 para diseños estáticos y estables.
---

# Diseño: Fijado

_Nota: Este diseño todavía necesita trabajar para hacerlo más flexible y práctico, se recomienda usar otro diseño por ahora._

Cada "unidad" es un ancho fijo, que era el único diseño disponible en el tablero 1.0.

Está construido como un diseño de flexbox, con una sola fila de widgets. Ancho de cada grupo es un tamaño de píxel fijo, calculado como la propiedad "ancho" de un grupo, multiplicado por 90px (donde nuestra altura de fila por defecto es de 45px).

Los propios grupos siguen el mismo patrón que todos los demás diseños mediante los cuales un grupo de ancho "6" tendría 6 "columnas", con el tamaño de los widgets en consecuencia, soa widget de tamaño "3 x 1" sería el 50% de la anchura del grupo.

Se moverán automáticamente los widgets a la siguiente fila si no encajan dentro de un ancho de pantalla determinado, y no cambia de tamaño con el tamaño de la pantalla, que a menudo deja una gran cantidad de pantalla de bienes inmuebles. La altura de cada fila está determinada por el widget más alto de esa fila.

![Disposición fija](../../assets/images/layout-eg-flex.png){data-zoomable}
_Un ejemplo de IU renderizada con el diseño "Fixed"_

## Puntos de ruptura

Debajo de 576px, Los diseños corregidos se renderizarán en modo responsivo para soportar la representación móvil. Aquí, en realidad se convierten en un diseño [Grid](./grid.md), con el ancho de cada grupo siendo calculado como una porción de 3 columnas, en lugar de un tamaño de píxeles fijo.