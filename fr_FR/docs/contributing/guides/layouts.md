---
description: Découvrez comment les gestionnaires de mise en page du tableau de bord Node-RED 2.0 peuvent aider à organiser efficacement l'apparence de votre tableau de bord.
---

# Gestionnaires de mise en page

L'interface utilisateur du Dashboard est construite autour du cœur central d'un "Gestionnaire de mise en page" qui est responsable du rendu de l'UI, et la gestion de la mise en page des widgets qui s'y trouvent.

La hiérarchie de navigation de l'interface utilisateur du tableau de bord est la suivante:

- **UI** - `ui-base` - Plusieurs points de terminaison peuvent être servis dans un seul tableau de bord. Plus tard, des travaux seront faits pour traiter ces interfaces comme des interfaces complètement isolées.
- **Page** - `ui-page` - Toutes les pages d'une seule interface sont listées dans le tiroir de navigation (menu de gauche). Chaque page est configurée pour utiliser un "Gestionnaire de mise en page", et ce gestionnaire sera rendu
- **Groupe** - `ui-group` - Un groupe est une collection de widgets qui seront placés ensemble sur une page. Chaque page "mise en page" définit comment ces groupes sont présentés, mais en interne, au sein d'un groupe, est toujours cohérent, en utilisant une disposition de colonne de style bootstrap (largeur par défaut de 6).
- **Widget** - `ui-<widget-name>` - Chaque widget est défini comme un composant Vue. Vous pouvez consulter un exemple `<widget>.vue` dans notre guide [Ajouter des Widgets](../widgets/core-widgets#example-widget-vue).

## Mise en page de base

`/Layouts/Baseline.vue` définit la structure de base d'une page (en-tête et panneau de navigation côté gauche). D'autres mises en page peuvent alors étendre cette ligne de base et définir _comment_ les widgets sont rendus dans la valeur par défaut de la ligne de base `<slot></slot>`.

Cette liste de mises en page de base va probablement croître dans le temps et, pour l'instant, inclut juste un modèle de démarrage de _very_ (navigation latérale et en-tête).

## Ajout d'un nouveau gestionnaire de mise en page

### Checklist

Si vous cherchez à définir votre propre gestionnaire de mise en page à ajouter au tableau de bord, vous devez vous assurer que vous avez terminé les étapes suivantes :

1. Crée `YourLayout.vue` dans `/ui/src/layouts/`
2. Ajoutez votre mise en page dans `/ui/src/layouts/index.js` avec une clé spécifique, par exemple `your-layout`
3. Ajoutez votre mise en page aux options dans `/nodes/config/ui-page_html`, à l'intérieur de la fonction `oneditprepare`. Assurez-vous d'avoir le paramètre `value` comme clé que vous avez utilisée à l'étape 2.

### Exemple de fichier `.vue`

L'exemple ci-dessous peut vous aider à commencer avec votre propre mise en page.

Nous avons également documenté la structure de l'objet [Widget](./events#widget) (utilisé dans la `ligne 13`), qui fournira des détails sur les données disponibles pour un widget/composant donné.

```vue:line-numbers {1}
<template>
    <!-- Extend the Baseline Template, and render the page title appropriately -->
    <BaselineLayout :page-title="$route.name">
        <!-- Retrieve our widgets assigned to this page (page id = $route.meta.id) -->
        <div class="nrdb-layout--flex" v-if="widgets && widgets[$route.meta.id]">
            <!-- Loop over the widgets defined for this page -->
            <div v-for="w in widgets[$route.meta.id]" :key="w.id">
                <!-- here we wrap all of our widgets inside a Vuetify v-card -->
                <v-card variant="outlined" class="">
                    <!-- draw our widget into the #text slot of the v-card -->
                    <template #text>
                        <!-- render the widget's component, passing in the widget id, props and state -->
                        <component  :is="w.component" :id="w.id" :props="w.props" :state="w.state"/>
                    </template>
                </v-card>
            </div>
        </div>
    </BaselineLayout>
</template>

<script>
    import BaselineLayout from './Baseline.vue'
    import { mapState } from 'vuex';

    export default {
        name: 'LayoutFlex',
        computed: {
            // our "ui" vue store contains a collection
            //of widgets mapped by Page ID ($route.meta.id)
            ...mapState('ui', ['widgets']),
        },
        components: {
            // extend the BaselineLayout component to get
            // the header and navigation drawer
            BaselineLayout
        }
    }
</script>

<style scoped>
/*
    any CSS you have for this layout can go here,
    mapped with appropriate CSS classes
*/
</style>
```