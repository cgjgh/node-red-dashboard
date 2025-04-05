---
description: Únete al desarrollo de Node-RED Dashboard 2.0. Aprende cómo puedes contribuir a hacerlo mejor para todos.
---

# Contribuyendo

Las contribuciones son siempre bienvenidas para Dashboard 2.0. Tenemos muchas grandes ideas que queremos construir, y nos encantaría tener tu ayuda!

## Estructura del proyecto

### `/nodes`

Contiene los archivos que definen cada uno de los nodos Node-RED que componen el conjunto de nodos del Tablero 2.0. Puede leer más sobre cómo escribir nodos para Node-RED [here](https://nodered.org/docs/creating-nodes/first-node).

### `/ui`

Contiene nuestra aplicación VueJS que forma el núcleo del panel 2.0. Dentro de `/ui/src/widgets`, encontrarás un conjunto de subdirectorios, cada uno conteniendo un archivo `.vue`. Son estos archivos los que definen la apariencia y funcionalidad que los usuarios ven al ver el Dashboard.

### `/docs`

Un sitio de documentación [VitePress](https://vitepress.dev/) que se utiliza para generar la documentación para el Tablero 2.0 (lo que estás leyendo ahora).

## Instalar localmente

### Requisitos previos

- [Cuenta de GitHub](https://github.com/) - Necesitarás una cuenta de GitHub para hacer una copia del código y contribuir con cualquier cambio.
- [Node.js](https://nodejs.org/en/download) - Nodo. también vendrá empaquetado con el Node Package Manager (`npm`) que se utiliza para instalar dependencias, y ejecutar el Dashboard (y Node-RED) localmente.
- [Git](https://git-scm.com/downloads) - Git se utiliza para clonar el repositorio localmente en su máquina, y le permite enviar cambios al repositorio central de GitHub.

### Clonar y construir el repositorio

1. **Inicie sesión para Apriar la máquina:** Inicie sesión en la máquina donde haya instalado Node-RED.

2. **Repositorio de bifurcación:** Bifurca este repositorio a tu propia cuenta de Github:

   ![image](../assets/images/github-pr.png){data-zoomable}

3. **Clonar repositorio de Git:** Clona el repositorio bifurcado desde tu cuenta de Github. Esto puede ser apropiado en cualquier lugar de su máquina (por ejemplo, `/yourname/development/`):

      git clon https://github.com/<your_github_account>/node-red-dashboard.git

4. **Instalar dependencias:** Desde dentro de tu directorio clonado, instala todos los paquetes dependientes (desde el archivo `package.json`):

      cd /node-red-dashboard
      npm install

5. Opcionalmente _**generar un mapa de origen**_ (para mapear el código del tablero minimizado al código original), para simplificar la depuración del código del panel de control del frontend en el navegador. En Linux esto se puede lograr por:

      exportar NODE_ENV=desarrollo

6. **Panel de Construcción:** Crea una versión estática de la interfaz de usuario del Tablero, basada en Vue CLI (que ha sido instalada en el paso 3):

       npm run build

   Alternativamente, usar `npm run build:dev` para construir una versión de desarrollador o usar `npm run dev` para construir una versión de desarrollador y ver cambios (hot reload)

### Instalar en Node-RED

1. **Ve a `.node-red`:** En un terminal, ve a tu carpeta `.node-red` (normalmente en `~/.node-red`).

      cd ~/.node-rojo

2. **Eliminar el panel de control 2.0:** Nota: si ya has instalado este panel a través de tu paleta, necesitarás desinstalarlo primero. Esto puede hacerse desde el Administrador de Palette en Node-RED, o vía `npm` en la terminal:

      npm desinstalar @flowfuse/node-red-dashboard

3. **Instala el tablero 2.0:** Instala el tablero bifurcado en tu sistema Node-RED desde dentro de la carpeta `.node-red`:

      npm install <path_to_your_forked_dashboard>

## Haciendo Cambios

1. **Hacer cambios:** Haz cualquier edición apropiada.
   - **Editor RED del nodo:** Para cambios de nodo RED trabajarás dentro de `/nodes` - los cambios aquí requerirán un reinicio de Node-RED (y la actualización del Editor de Nodo-RED) para ver los últimos cambios.
      - Para conveniencia puedes usar `npm run watch:node-red` que reiniciará Node-RED después de cualquier cambio en `/nodes`
      - Esto asume que Node-RED está instalado en `~/.node-red` y tienes `@flowfuse/node-red-dashboard` instalado en esa carpeta (como por el paso 3 anterior)
   - **Dashboard/UI:** Para los cambios en el panel/interfaz de usuario, vea `/ui` - los cambios aquí requerirán una reconstrucción de la interfaz de usuario del panel, que se puede hacer ejecutando `npm run build` (como por paso 5. en "Clonar y construir el Repositorio").
      - Para conveniencia puedes usar `npm run watch:dashboard` que se autoreconstruirá después de los cambios en la interfaz del tablero
   - Los dos comandos de reloj se combinan en un comando bajo `npm run watch`

2. **Actualizar el navegador:** Actualizar el panel de control en `http(s)://your_hostname_or_ip_address:1880/dashboard`

3. **Desarrollo:** Repita el paso 1 a 2 una y otra vez, hasta que estés satisfecho con tus resultados.

4. **Crear rama:** Una vez que estés listo para publicar tus cambios, en el directorio de tu repositorio clonado (p. ej. `/yourname/development/node-red-dashboard`), crea una nueva rama para todos los archivos del panel bifurcado:

      git checkout -b name_of_su_nuevo_rama

5. Tan pronto como todos los cambios funcionen bien, confirmar los cambios:

       git commit -a -m "Descripción de tus cambios"

6. Enviar los cambios confirmados al fork del panel de control a su cuenta de Github:

       origen git push

7. En su repositorio de forked dashboard (en Github), cambie a la nueva rama y [cree una solicitud de pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Ejecutar documentación localmente

1. **Ejecuta el servidor Dev de Docs:** Puedes ejecutar la documentación localmente ejecutando el siguiente comando en la raíz del directorio `/node-red-dashboard`:

      npm run docs:dev

   Esto ejecutará su documentación en `http://localhost:5173/`
2. **Hacer cambios:** Haz cualquier edición apropiada a la documentación (`/docs`). La documentación se actualizará en vivo, sin necesidad de recompilar, reiniciar el servidor o actualizar el navegador.
