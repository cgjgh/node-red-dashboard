---
description: Esplora come i gestori di layout nella Dashboard 2.0 Node-RED possono aiutare a organizzare in modo efficace l'aspetto della tua dashboard.
---

# Gestori Di Layout

L'interfaccia utente di Dashboard è costruita attorno al nucleo centrale di un "Layout Manager" che è responsabile del rendering dell'interfaccia utente, e la gestione del layout dei widget al suo interno.

La gerarchia di navigazione della Dashboard UI è la seguente:

- **UI** - `ui-base` - Gli endpoint multipli possono essere serviti all'interno di una singola Dashboard. Successivamente si lavorerà per trattare questi come interfacce completamente isolate.
- **Pagina** - `ui-page` - Tutte le pagine all'interno di una singola interfaccia utente sono elencate nel menu di navigazione (menu a sinistra). Ogni pagina è configurata per usare un dato "Layout Manager", e quel manager verrà renderizzato
- **Gruppo** - `ui-group` - Un gruppo è una raccolta di widget che verranno posizionati insieme in una pagina. Ogni pagina "layout" definisce come questi gruppi sono disposti, ma internamente, all'interno di un gruppo, layout è sempre coerente, utilizzando uno stile di bootstrap-Column Layout (larghezza predefinita di 6).
- **Widget** - `ui-<widget-name>` - Ogni widget è definito come componente Vue. Puoi controllare un file di esempio `<widget>.vue` nella nostra [Aggiunta Widgets](../widgets/core-widgets#example-widget-vue) guida.

## Layout Basali

`/Layouts/Baseline.vue` definisce la struttura di base di una pagina (intestazione e pannello di navigazione a sinistra). Altri layout possono quindi estendere questa linea di base e definire _come_ i widget sono resi all'interno del valore predefinito della linea di base `<slot></slot>`.

Questo elenco di layout di base probabilmente crescerà nel tempo, e per ora, solo include un _molto_ modello base di avviamento (navigazione laterale e intestazione).

## Aggiunta di un nuovo Layout Manager

### Checklist

Se stai cercando di definire il tuo Layout manager da aggiungere alla Dashboard, devi assicurarti di aver completato i seguenti passaggi:

1. Creato `YourLayout.vue` in `/ui/src/layouts/`
2. Aggiungi il tuo layout in `/ui/src/layouts/index.js` con una chiave specifica, ad esempio `your-layout`
3. Aggiungi il tuo layout alle opzioni in `/nodes/config/ui-page_html`, all'interno della funzione `oneditprepare`. Assicurati di avere il `value` impostato come chiave che hai usato nel passaggio 2.

### Esempio file `.vue`

L'esempio seguente può aiutarti a iniziare con il tuo layout.

Abbiamo anche documentato la struttura dell'oggetto [Widget](./events#widget) (utilizzato nella `linea 13`), che fornirà dettagli sui dati disponibili per un determinato widget/componente.

```vue:line-numbers {1}
<template>
    <! - Estendi il modello di base, e renderizza il titolo della pagina in modo appropriato -->
    <BaselineLayout :page-title="$route.name">
        <! - Recupera i nostri widget assegnati a questa pagina (id pagina = $route. eta. d) -->
        <div class="nrdb-layout--flex" v-if="widgets && widgets[$route.meta.id]">
            <! - Loop sopra i widget definiti per questa pagina -->
            <div v-for="w in widgets[$route.meta.id]" :key="w.id">
                <! - qui avvolgiamo tutti i nostri widget all'interno di una Vuetify v-card -->
                <v-card variant="outlined" class="">
                    <! - disegna il nostro widget nello slot #text della v-card -->
                    <template #text>
                        <! - rende il componente del widget, passando nell'id del widget, props and state -->
                        <component  :is="w.component" :id="w.id" :props="w.props" :state="w.state"/>
                    </template>
                </v-card>
            </div>
        </div>
    </BaselineLayout>
</template>

<script>
    import BaselineLayout from '. Basale. ue'
    import { mapState } from 'vuex';

    export default {
        name: 'LayoutFlex',
        computed: {
            // Il nostro "ui" vue store contiene una collezione
            //di widget mappati da Page ID ($route. eta.id)
            ... apState('ui', ['widgets']),
        },
        componenti: {
            // estende il componente BaselineLayout per ottenere
            // l'intestazione e il menù di navigazione
            BaselineLayout
        }
    }
</script>

<style scoped>
/*
    qualsiasi CSS che hai per questo layout può andare qui,
    mappati con classi CSS appropriate
*/
</style>
```