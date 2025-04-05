---
description: Explora cómo los administradores de diseños en Node-RED Dashboard 2.0 pueden ayudar a organizar la apariencia de tu panel de control de manera efectiva.
---

# Administradores de Diseños

La interfaz del panel de control se construye alrededor del núcleo central de un "Administrador de Diseño" que es responsable de la representación de la interfaz de usuario, y gestionando el diseño de los widgets dentro de él.

La jerarquía de navegación del panel de interfaz de usuario es la siguiente:

- **UI** - `ui-base` - Múltiples puntos finales pueden ser servidos dentro de un solo panel de control. Más adelante se trabajará para tratarlos como interfaces completamente aisladas.
- **Página** - `ui-page` - Todas las páginas dentro de una sola interfaz de usuario aparecen en el menú de navegación (menú izquierdo). Cada página está configurada para usar un determinado "Administrador de Diseño", y ese administrador se renderizará
- **Grupo** - `ui-group` - Un grupo es una colección de widgets que se colocarán juntos en una página. Cada página "layout" define cómo se distribuyen estos grupos, pero internamente, dentro de un grupo, siempre es consistente, usando un diseño de Column estilo bootstrap (ancho por defecto de 6).
- **Widget** - `ui-<widget-name>` - Cada widget se define como un componente Vue. Puedes revisar un ejemplo de archivo `<widget>.vue` en nuestra guía [Agregar Widgets](../widgets/core-widgets#example-widget-vue).

## Diseños de línea base

`/Layouts/Baseline.vue` define la estructura básica de una página (cabecera y cajón de navegación a la izquierda). Otros diseños entonces pueden extender esta línea de base y definir _how_ los widgets son renderizados dentro del predeterminado `<slot></slot>`.

Esta lista de diseños de línea base probablemente crezca con el tiempo, y por ahora, sólo incluye una plantilla de inicio básica _muy_ (navegación lateral y cabecera).

## Añadiendo un nuevo Layout Manager

### Checklist

Si estás buscando definir tu propio gestor de diseños para añadir al tablero, entonces necesitas asegurarte de que has completado los siguientes pasos:

1. Creado `YourLayout.vue` en `/ui/src/layouts/`
2. Añade tu diseño en `/ui/src/layouts/index.js` con una clave específica, p. ej., `tu-layout`
3. Añade tu diseño a las opciones en `/nodes/config/ui-page_html`, dentro de la función `oneditprepare`. Asegúrese de tener el valor `value` establecido como la clave que utilizó en el paso 2.

### Ejemplo de archivo `.vue`

El siguiente ejemplo puede ayudarle a comenzar con su propio diseño.

También hemos documentado la estructura del objeto [Widget](./events#widget) (usado en `línea 13`), que proporcionará detalles sobre los datos que tiene disponibles para un widget/componente determinado.

```vue:line-numbers {1}
<template>
    <! - Extender la plantilla Baseline, y renderiza el título de la página apropiadamente -->
    <BaselineLayout :page-title="$route.name">
        <! - Recupera nuestros widgets asignados a esta página (página id = $route. eta. d) -->
        <div class="nrdb-layout--flex" v-if="widgets && widgets[$route.meta.id]">
            <! - Bucle sobre los widgets definidos para esta página -->
            <div v-for="w in widgets[$route.meta.id]" :key="w.id">
                <! - aquí envolvemos todos nuestros widgets dentro de una v-card Vuetify -->
                <v-card variant="outlined" class="">
                    <! - dibuja nuestro widget en la ranura de #texto de la v-card -->
                    <template #text>
                        <! - renderizar el componente del widget, pasando en el id del widget, props y estado -->
                        <component  :is="w.component" :id="w.id" :props="w.props" :state="w.state"/>
                    </template>
                </v-card>
            </div>
        </div>
    </BaselineLayout>
</template>

<script>
    import BaselineLayout from '. Línea base.
    importar { mapState } de 'vuex';

    exportar predeterminado {
        name: 'LayoutFlex',
        calculado: {
            // nuestro "ui" vue store contiene una colección
            //de widgets mapeados por Page ID ($route. eta.id)
            ... apState('ui', ['widgets']),
        },
        componentes: {
            // extender el componente BaselineLayout para obtener
            // el panel de cabecera y navegación
            BaselineLayout
        }
    }
</script>



<style scoped>
/*
    cualquier CSS que tenga para este diseño puede ir aquí,
    mapeados con las clases CSS apropiadas
*/
</style>
```