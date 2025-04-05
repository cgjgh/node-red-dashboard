---
description: Erfahren Sie, wie Layout-Manager im Node-RED Dashboard 2.0 das Aussehen Ihres Dashboards effektiv organisieren können.
---

# Layout-Manager

Das Dashboard-Interface ist um den zentralen Kern eines "Layout-Managers" aufgebaut, der für die Darstellung der Oberfläche verantwortlich ist. und die Verwaltung des Layouts der Widgets darin.

Die Navigationshierarchie des Dashboard-UI lautet wie folgt:

- **UI** - `ui-base` - Mehrere Endpunkte können in einem einzigen Dashboard bedient werden. Später wird daran gearbeitet, diese als völlig isolierte Schnittstellen zu behandeln.
- **Seite** - `ui-page` - Alle Seiten innerhalb eines einzigen UI sind in der Navigationsleiste (linkes Menü) aufgelistet. Jede Seite ist so konfiguriert, dass sie einen gegebenen "Layout-Manager" verwendet, und dieser Manager wird rendern
- **Gruppe** - `ui-group` - Eine Gruppe ist eine Sammlung von Widgets, die zusammen auf einer Seite positioniert werden. Jede Seite "Layout" legt fest, wie diese Gruppen angelegt werden, aber intern innerhalb einer Gruppe -Layout ist immer konsistent, mit einem bootstrap-artigen Spaltenlayout (Standardbreite von 6).
- **Widget** - `ui-<widget-name>` - Jedes Widget ist als Vue Komponente definiert. Du kannst dir eine Beispiel `<widget>.vue` Datei in unserem [Widgets](../widgets/core-widgets#example-widget-vue) Guide ansehen.

## Grundlinie Layouts

`/Layouts/Baseline.vue` definiert die Grundstruktur einer Seite (Kopfzeile und Navigationsschublade). Andere Layouts können dann diese Basislinie erweitern und _how_ definieren, die Widgets werden innerhalb der Standardeinstellung der Basislinie `<slot></slot> ` gerendert.

Diese Liste der Baseline-Layouts wird wahrscheinlich in der Zeit wachsen und enthält vorerst nur ein _very_ einfaches Starter-Template (Seitennavigation und Kopfzeile).

## Einen neuen Layout-Manager hinzufügen

### Checklist

Wenn Sie einen eigenen Layout-Manager zum Dashboard hinzufügen möchten, müssen Sie sicherstellen, dass Sie die folgenden Schritte abgeschlossen haben:

1. `YourLayout.vue` in `/ui/src/layouts/` erstellt
2. Füge dein Layout in `/ui/src/layouts/index.js` mit einem bestimmten Schlüssel hinzu, z.B. `your-layout`
3. Fügen Sie Ihr Layout zu den Optionen in `/nodes/config/ui-page_html` innerhalb der `oneditprepare` Funktion hinzu. Stelle sicher, dass der `value` als Schlüssel gesetzt ist, den du in Schritt 2 benutzt hast.

### Beispiel `.vue` Datei

Das folgende Beispiel kann Ihnen helfen, mit Ihrem eigenen Layout zu beginnen.

Wir haben auch die Struktur des [Widget](./events#widget) Objekts dokumentiert (verwendet in `Zeile 13`), , die Details darüber liefert, welche Daten Sie für ein bestimmtes Widget/Komponente zur Verfügung haben.

```vue:line-numbers {1}
<template>
    <! - Erweitern Sie die Basisvorlage, und geben den Seitentitel angemessen -->
    <BaselineLayout :page-title="$route.name">
        <! - Rufen Sie unsere Widgets ab, die dieser Seite zugewiesen sind (Seite id = $route. eta. d) -->
        <div class="nrdb-layout--flex" v-if="widgets && widgets[$route.meta.id]">
            <! - Schleife über die Widgets die für diese Seite definiert sind -->
            <div v-for="w in widgets[$route.meta.id]" :key="w.id">
                <! - Hier verpacken wir alle unsere Widgets in eine Vuetify v-card -->
                <v-card variant="outlined" class="">
                    <! - Zeichne unser Widget in den #Text Slot der v-card -->
                    <template #text>
                        <! - die Komponente des Widgets, die in der Widget-ID übergeben wird props and state -->
                        <component  :is="w.component" :id="w.id" :props="w.props" :state="w.state"/>
                    </template>
                </v-card>
            </div>
        </div>
    
    </BaselineLayout>
</template>

<script>
    Import BaselineLayout von '. Baseline. ue'
    Import { mapState } von 'vuex';

    Export Standard {
        Name: 'LayoutFlex',
        berechnet: {
            // Unser "ui" vue store enthält eine Sammlung
            //von Widgets, die von Seite ID abgebildet werden ($route. eta.id)
            ... apState('ui', ['widgets']),
        },
        Komponenten: {
            // erweitern Sie die BaselineLayout Komponente um
            // Header und Navigationsschublade
            BaselineLayout
        }
    }
</script>

<style scoped>
/*
    jegliche CSS die Sie für dieses Layout haben, können hier gehen
    mit entsprechenden CSS-Klassen
*/
</style> zugeordnet
```