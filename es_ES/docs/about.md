---
description: Aprende sobre las opciones tecnológicas del tablero 2.0
---

# Acerca de Node-RED Dashboard 2.0

Bienvenido a la documentación del panel de Node-RED 2.0, el sucesor del panel original y muy popular, [Tablero Node-RED](https://flows.nodered.org/node/node-red-dashboard).

Este proyecto fue formado por [FlowFuse](https://flowfuse.com/), como parte de los esfuerzos por actualizar el panel original para alejarse de Angular v1. que lleva mucho tiempo obsoleto. Puedes leer nuestra declaración completa sobre _por qué_ estamos construyendo el Tablero 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/).

## Tecnologías

### Nodo-RED

[Node-RED](https://nodered.org/) es una herramienta de programación basada en flujo, originalmente desarrollada por el equipo de IBM Emerging Technology Services y ahora parte de la Fundación JS. Proporciona un editor basado en el navegador que facilita el cableado de flujos utilizando la amplia gama de nodos de la paleta que se pueden desplegar en su tiempo de ejecución con un solo clic.

### Vue.js v3.0

[Vue.js](https://vuejs.org/) es un framework JavaScript progresivo, progresivamente adoptable para construir la interfaz de usuario en la web. Es una opción popular para construir aplicaciones web modernas.

Elegimos Vue.js en lugar de otros frameworks populares como React y Angular debido a su curva de aprendizaje superficial, y facilidad de uso/legibilidad para desarrolladores que no sean del front-end.

También utilizamos la [librería de componentes Vuetify](https://vuetifyjs.com/en/components/all/), que es un framework de componentes de Material Design para Vue.js. Su objetivo es proporcionar componentes limpios, semánticos y reutilizables que hagan que la construcción de su aplicación sea una brisa.

### Socket IO

[Socket.IO](https://socket.io/) permite la comunicación bidireccional y basada en eventos en tiempo real. Funciona en cada plataforma, navegador o dispositivo, centrándose por igual en la fiabilidad y la velocidad.

En Dashboard 2.0 usamos Socket IO para comunicarnos entre Node-RED y el Dashboard UI.
