---
description: Eficientes estrategias y consejos para depurar las configuraciones de Node-RED Dashboard 2.0 para asegurar un buen funcionamiento.
---

# Depurando Tablero 2.0

Dashboard 2.0 viene con una herramienta de depuración integrada para entender los datos que se están configurando para cada tablero, página, tema, grupo y widget.

Para navegar a la herramienta, dirígete a `<your-host>:<your-port>/dashboard/_debug`.

![Herramienta de depuración](/images/debug-example.png "Herramienta de depuración"){data-zoomable}
_Captura de pantalla del Tablero 2.0 de la herramienta de depuración_

Esta herramienta es particularmente útil cuando estás construyendo tus propias integraciones personalizadas, y desarrollándote también en los widgets del núcleo del tablero.

Esperamos hacer crecer parte del alcance de esta herramienta, pero por ahora, mostrará los `props` actuales para un widget dado, que es definido por la configuración de Node-RED, pero también incluirá los valores sobreescritos del objeto `msg` (e. . `msg.options` puede sobreescribir la propiedad `Options` para un `ui-dropdown`).

## Historial de mensajes

![Herramienta de depuración](/images/debug-example-datastore.png "Herramienta de depuración"){data-zoomable}
_Captura de pantalla de la pestaña "Historial de mensajes" para un widget_

Esta pestaña mostrará los últimos valores `msg` que el nodo asociado ha recibido en el `datastore` de Node-RED para un widget dado.

Esto es útil para entender qué datos cargarán cuando un nuevo cliente se conecte a Node-RED. Necesitará actualizarse para reflejar el estado más reciente si está esperando nuevos mensajes ya que la herramienta de depuración fue abierta por última vez.

## Propiedades dinámicas

![Herramienta de depuración](/images/debug-example-statestore.png "Herramienta de depuración"){data-zoomable}
_Captura de pantalla de la pestaña "Propiedades dinámicas" para un widget_

This tab shows any dynamic properties (properties set with an injection of a `msg.<property>` that have been set since the Node-RED server has been running. Dentro de nuestra arquitectura del lado del servidor, estos se almacenan en nuestro `statestore`.

Estos valores generalmente reemplazan las propiedades por defecto establecidas dentro del editor Node-RED, y se puede utilizar para comprobar por qué un widget en particular renderiza la manera en que lo hace.