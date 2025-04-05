---
description: Mantener la estructura del repositorio de Node-RED Dashboard 2.0 para una mejor gestión de código y contribución.
---

# Estructura del repositorio

El propósito de esta página es dar una visión general de cómo del Tablero 2. está estructurado para que pueda navegar mejor por el repositorio y contribuir eficazmente.

## Carpetas del núcleo

El repositorio contiene dos carpetas principales:

### /nodes

El directorio `/nodes` contiene la colección de nodos de Node-RED disponibles en el editor de nodos. Estos nodos son responsables de manejar la configuración del panel de control, que widgets se muestran, y para enviar y recibir eventos desde y hacia el Tablero, basándose en su configuración dentro del editor Node-RED.

### /ui

Esta carpeta contiene nuestra aplicación Vue.js. Esto se puede construir usando `npm run build`, y la salida de esta compilación se copia en el directorio `/dist`, donde es servido por Node-RED.

