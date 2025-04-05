---
description: Espandi Node-RED Dashboard 2.0 con widget di terze parti. Impara a costruirli e integrarli.
---

<script setup>
    import AddedIn from '../../components/AddedIn.vue'
</script>

# Costruire Widget Di Terzi <AddedIn version="0.8.0" />

Un singolo widget consiste di due parti chiave:

1. Un nodo Node-RED che apparirà nella tavolozza dell'editor Node-RED
2. `.vue` e codice lato client che rende il widget in un dashboard

Puoi esplorare la nostra collezione di widget di base [here](../../nodes/widgets.md). Se hai un'idea per un widget che vuoi costruire nella Dashboard 2. siamo aperti a Pull Requests e puoi leggere di più nella nostra [Aggiunta Widget Core](./core-widgets.md) guida.

Ci rendiamo anche conto che ci sono molte occasioni in cui un repository/package standalone funziona meglio come era molto popolare nella Dashboard 1.0.

## Lettura Raccomandata

Sulla navigazione a sinistra troverai una sezione "Guide utili", si consiglia di dare uno sguardo attraverso questi come offrono una buona panoramica della struttura del Dashboard 2. codebase e alcuni dei principi architettonici sottostanti su cui è costruito.

In particolare, si raccomanda quanto segue:

- [Architettura Di Eventi](/contributing/guides/state-management.html)
- [Gestione Stato](/contributing/guides/state-management.html)

## Come sono caricati i widget

Il cruscotto 2.0 è costruito sulla parte superiore di [VueJS](https://vuejs.org/), e come tale, tutti i widget devono essere mappati su un componente Vue. Il processo funziona come segue:

1. Il client Dashboard 2.0 si collega a Node-RED
2. Node-RED invia `ui-config` object contianing dettagli di tutte le pagine, temi, gruppi e widget
3. Nel gestore degli eventi, cerchiamo tutti i widget trovati nel `ui-config`:
   - Se il widget `type` corrisponde a un componente principale, lo mimetizziamo a quel componente
   - Se il widget è un widget di terze parti, carichiamo il relativo file `.umd.js`, esposto dalla cartella `/resources` del widget.
4. La Dashboard 2.0 carica il Layout pertinente (ad esempio Griglia, Fisso o Notebook) a seconda dell'URL attivo/pagina.
5. All'interno di quel layout manager, cerchiamo i widget, e rendiamo i loro rispettivi componenti Vue.
   - Ogni componente viene passato `id`, `props` e `state` del widget.

## Per Iniziare

Abbiamo creato un [Example Node repository](https://github.com/FlowFuse/node-red-dashboard-example-node) che fornirà le basi per il tuo widget. Include un sacco di esempi per le funzionalità che probabilmente ti servono.

Il repository di base ha la seguente struttura di file/cartelle:

Come per tutti i nodi Node-RED, è necessario iniziare con due file:

- `/nodes/ui-example.html` - definisce le proprietà del nodo, modifica l'interfaccia utente e testo di aiuto.
- `/nodes/ui-example.js` - definisce i comportamenti del nodo lato server

Ogni Widget deve quindi avere il codice lato client definito che controlla _come_ il widget viene renderizzato all'interno di un Dashboard. Qualsiasi contenuto all'interno di `/ui` sarà confezionato in un file `.umd.js` che Dashboard carica al runtime.

- `/ui/components/` - cartella contenente i file `.vue` per qualsiasi componente Vue di cui hai bisogno
- `/ui/index.js` - Esporta tutti i componenti Vue che devono essere importati in Dashbaord 2.0

La configurazione del nodo e dei widget sono controllati su due file:

- `vite.config.js` - contiene i dettagli di cosa confezionare nel file `.umd.js` costruito del widget.
- `package.json` - deve contenere una sezione `node-red-dashboard-2` che definisce i widget che Dashboard può importare.

### Sviluppo Locale

Per iniziare a lavorare con il proprio widget di terze parti, localmente sulla tua macchina:

#### Installare Node-RED & Dashboard

1. Installa Node-RED ([docs](https://nodered.org/docs/getting-started/local))
2. Installa `@flowfuse/node-red-dashboard` in Node-RED tramite l'opzione "Gestisci tavolozza".

#### Installare il nodo di esempio dell'interfaccia utente

1. Fork il nostro [Example Node repository](https://github.com/FlowFuse/node-red-dashboard-example-node) e clonarlo localmente alla tua macchina.
2. All'interno della directory Nodo di esempio, installare le dipendenze richieste:

      npm install
3. Genera facoltativamente una mappa sorgente (per mappare il codice minificato al codice originale), per semplificare il debug del codice frontend nel browser.  Su Linux questo può essere ottenuto tramite:

      export NODE_ENV=development
4. All'interno della directory dei Nodi di esempio, crea il `.umd del Nodo di esempio. file s` (cosa usa Node-RED per eseguire il tuo widget), questo genererà la cartella `/resources`, caricata da Node-RED.

      npm run build

#### Installare l'UI Esempio in Node-RED

1. Naviga nella tua directory Node-RED locale:

       cd ~/.node-red
2. Installare la copia locale del nodo di esempio:

      npm install /path/to/your/local/node-red-dashboard-example-node-folder
3. Riavvia Node-RED

_Nota: Qualsiasi modifica locale apportata all'interno della cartella `/ui` del widget di terze parti, dovrai ri-eseguire `npm run build` per aggiornare il `umd. file s`, che è quello che il Dashboard carica per rendere il widget._

## Configurare il tuo widget

### Naming Del Tuo Widget

Al fine di importare widget esterni nel Dashboard core, il nodo di configurazione `ui-base` di Dashboard legge il `package'di Node-RED. son` e controlla tutti i pacchetti che sono stati installati in Node-RED con `node-red-dashboard-2-` nel nome del pacchetto.

Come tale, quando definisci la tua integrazione, assicurati che sia nominata in modo appropriato:

```json
"nome": "node-red-dashboard-2-<your-widget-name>"
```

### Definizione Del Tuo Widget

All'interno del tuo `package.json`, dovrai definire una sezione `node-red-dashboard-2` che poi dice alla Dashboard _how_ di caricare il tuo widget. Un esempio di `ui-example` è il seguente:

```json
"node-red-dashboard-2": {
    "version": "0.8.0", // la versione minima di Dashboard 2. supportato
    "widgets": {
        "ui-example": { // questa chiave deve corrispondere al "type" del tuo widget, registrato in Node-RED
            "output": "ui-esempio. md. s", // il nome del file .js costruito che verrà importato in Dashboard, configurato in vite.config. s
            "component": "UIEsempio" // il nome del componente Vue primario che sarà renderizzato come widget nella Dashboard
        }
    }
}
```

### Registrare il tuo Nodo & Widget

_Più dettagli: [Registration](../guides/registration.md)_

Tradizionalmente con Node-RED, devi registrare il tuo nodo usando `RED.nodes. egisterType("ui-example", UIEsempioNode)`, questo è ancora il caso con Dashboard, ma è necessario _anso_ registrare il widget anche con Dashboard.

La registrazione del cruscotto è basata su una funzione `.register()` (vedere [docs](../guides/registration.md)). Questa funzione è disponibile per qualsiasi `ui-base`, `ui-page` o `ui-group`. Per `ui-group` e `ui-page`, broker la funzione fino alla `ui-base` dove viene mantenuto un negozio di tutti i widget nella Dashboard.

Il tuo widget dovrebbe definire uno di questi come una proprietà nel tuo nodo Node-RED, molto probabilmente, sarà `ui-group`, se vuoi che il tuo widget renda _dentro_ un gruppo nella Dashboard.

Nel tuo file `/nodes/ui-example.js`:

```js
module.exports = function(RED) {
    function UIExampleNode(config) {
        RED.nodes. reateNode(questo, config);
        var node = this;

        // quale gruppo stiamo rendendo questo widget
        const group = RED. odes.getNode(config. roup)

        /**
         * Ulteriori configurazioni e configurazioni per andare qui
         */

        // registra il widget con il gruppo Dashboard
        . egister(node, config, evts)
    }
    // Registra il nodo con Node-RED
    RED. odes.registerType("ui-example", UIExampleNode);
}
```

## Guide

Di seguito sono riportate guide ed esempi sulla costruzione di widget di terze parti. Abbiamo anche la sezione "Guide utili" nella navigazione a sinistra che fornisce guide di sviluppo più generalizzate quando si contribuisce alla Dashboard 2.0.

### Le basi di VueJS

Consapevoli che molti sviluppatori che potrebbero voler contribuire alla Dashboard 2. , potrebbe essere nuovo per VueJS, così abbiamo dettagliato alcuni fondamentali qui.

È molto comune dal momento che VueJS vedere le applicazioni Vue utilizzando la "Composition API", mentre questo è il modo più leggero di costruire le vostre applicazioni, non è il più intuitivo per coloro che non hanno familiarità con VueJS, in quanto tale, stiamo principalmente utilizzando la struttura "Opzioni API" su Dashboard 2. e nei nostri esempi di leggibilità.

Con le Opzioni API, un componente Vue ha la seguente struttura:

```vue
<template>
    <!-- Modello HTML per il componente -->
    <! - Qui puoi fare riferimento a tutte le variabili definite sui tuoi componenti, ad es. -->
    <div>{{ myVar }}</div>
</template>

<script>
export default {
    // any properties that are passed to the component
    // in Dashboard 2. , questi 3 sono quelli forniti:
    props: ['id', 'props', 'state'],
    // qualsiasi dato che desideri essere reattivo e disponibile sul tuo componente
    // all'interno della <script> fai riferimento a queste variabili con questo.<myVar>
    // all'interno dell'HTML, non hai bisogno di "questo. prefisso
    data () {
        return {
            myVar: 'Hello World'
        }
    },
    // Le proprietà calcolate sono variabili che si aggiornano automaticamente quando le loro dipendenze cambiano
    computed: {
        myComputedProp () {
            return this. yVar + '!
        }
    },
    // any methods that are used within the component
    methods: {
        myMethod () {
            alert(this. yVar)
        }
    },
    // Esegue quando il componente è integrato e caricato nel DOM
    montato () {
        alert('Component has mounted')
    },
    // Esegue quando il componente viene rimosso
    unmounted () {
        alert('Component has been removed')
    }
}
</script>

<style>
/* qualsiasi stile CSS per il componente */
</style>
```

### Uso Dei Componenti Vuetify

Sei libero di definire HTML/CSS personalizzato completo quando definisci i tuoi widget, ma abbiamo anche fornito supporto nativo per tutta la [Vuetify's Component Library](https://vuetifyjs.com/en/components/all/) per iniziare con una vasta gamma di componenti dell'interfaccia utente che potresti voler utilizzare.

### Accesso Alle Proprietà

Quando i widget sono renderizzati in un layout Dashboard, vengono passati una piccola collezione di proprietà che possono essere usate per personalizzare il comportamento del widget:

| proprietà | descrizione                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `id`      | L'ID del widget, assegnato da Node-RED                                               |
| `props`   | Le proprietà definite in Node-RED, ad esempio `this.props.name` o `this.props.group` |
| `state`   | Lo stato del widget, ad esempio `this.state.enabled` o `this.state.visible`          |

Quando li rendi nel tuo componente Vue, puoi accedervi come segue:

```vue
<template>
    <div>ID: {{ id }}</div>
    <div>Nome: {{ props.name }}</div>
    <div>Gruppo: {{ props.group }}</div>
</template>

<script>
export default {
    props: ['id', 'props', 'stato'],
    mounted () {
        // run on load of the widget
        alert(this. d)
    }
}
</script>
```

### Comunicare con Node-RED

Gli eventi vengono inviati avanti e indietro tra Node-RED e Dashboard 2.0 con SocketIO. Puoi vedere una ripartizione completa di questi eventi nella nostra [Architettura Eventi](../guides/events.md) guida.

#### Ricezione Messaggi Node-Red

Quando il nodo riceve un `msg` in Node-RED, il client Dashboard 2.0 riceverà un evento `msg-input` tramite SocketIO. Puoi iscriverti a questo evento all'interno del componente Vue del tuo widget con:

```js
export default {
    props: ['id', 'props', 'state'],
    // rest of your vue component here
    mounted () {
        this.$socket.on('msg-input' + questo. d, (msg) => {
            // fai qualcosa con il msg
        })
    },
    unmounted () {
        // annullare l'iscrizione all'evento quando il widget viene distrutto
        questo.$socket.off('msg-input:' + this.id)
    
    }
}
```

Si consiglia di utilizzare il nostro in [Data Tracker](../widgets/core-widgets.md#data-tracker) costruito per impostare gli eventi di input/load standard per il tuo widget. Questo può essere fatto chiamando quanto segue nel file `.vue` del tuo widget:

```js
export default {
    inject: ['$dataTracker'],
    // resto del tuo componente vue qui
    creato () {
        questo.$dataTracker(questo. d)
        // possiamo sovrascrivere gli eventi predefiniti se vogliamo con
        // questo.$dataTracker(this.id, myOnInputFunction, myOnLoadFunction, myOnDynamicPropertiesFunction)
    }
}
```

Maggiori dettagli sulla personalizzazione del Data Tracker sono disponibili [here](../widgets/core-widgets.md#custom-behaviours).

#### Invio Messaggi Node-Red

Puoi inviare un `msg` su qualsiasi nodo connesso in Node-RED chiamando uno dei seguenti eventi tramite SocketIO:

- `this.$socket.emit('widget-action', this.id, msg)`: invia qualsiasi `msg` su qualsiasi nodo connesso in Node-RED.
- `this.$socket.emit('widget-change', questo. d, msg)`: lo stesso di `widget-action`, ma _anso_ memorizza l'ultimo messaggio nel datastore Node-RED per questo widget in modo che lo stato possa essere ripristinato quando la Dashboard viene aggiornata.

#### Eventi SocketIO Personalizzati

Se vuoi implementare i tuoi eventi e gestori di SocketIO, puoi farlo nel tuo componente `.vue` con:

```js
this.$socket.emit('my-custom-event', this.id, msg)
```

Poi, dove registri il tuo nodo con la Dashboard sul lato server (all'interno del file `.js` del tuo nodo), puoi definire il gestore degli eventi pertinente:

```js
evts = {
    onSocket: {
        // subscribe to custom events
        'my-custom-event': function (conn, id, msg) {
            // emette un msg in Node-RED da questo nodo
            . end(msg)
        }
    }
}
group.register(node, config, evts)
```

### Conservazione Dei Dati E Negozi Di Dati

Utilizziamo il concetto di archiviazione dei dati sia sul lato client che sul lato server della Dashboard 2.0. Questi sono utilizzati per centralizzare la memorizzazione dello stato più recente e dei dati associati a un widget.

Gli archivi di dati sono una mappatura dell'ID del widget/node agli ultimi dati ricevuti in quel widget. Questo è più comunemente usato per ripristinare lo stato quando la Dashboard viene aggiornata.

#### Negozio Dati Node-RED

L'archivio dati di Node-RED è reso accessibile per widget di terze parti tramite il `ui-base` associato.

Per accedere a questo nel file `.js` del tuo widget, puoi usare:

```js
const group = RED.nodes.getNode(config.group)
const base = group.getBase()
```

Poi, ogni volta che si desidera memorizzare i dati nel datastore, è possibile farlo con:

```js
base.stores.data.save(base, node, msg)
```

Puoi leggere di più sull'archivio dati Node-RED nella nostra [Gestione Stato](../guides/state-management.md) guida.

#### Negozio Fortezza Node-RED

Lo stato si riferisce a qualsiasi proprietà del widget che sono cambiate in runtime, e sarebbe diverso da quello impostato nell'editor Node-RED.

Ad esempio, il `ui-dropdown` può avere il suo `options` sovrascritto con un messaggio `msg.options` inviato al nodo. Questo aggiornamento `options` sarebbe memorizzato sul nodo nello stato store.

#### Client-Side Data Store

Nel lato client di Dashboard 2.0, utilizziamo VueX per gestire lo stato centralizzato di un UI.

Con VueX puoi chiamare `mapState` che collegherà automaticamente il negozio al tuo componente Vue, ad esempio:

```vue
<template>
    <! - Recuperare gli ultimi valori di dati dal widget con <id> -->
    {{ messages[id] }}
</template>
<script>
// importare mapState da VueX
importare { mapState } da 'vuex'

esportare default {
    props: ['id', 'props', 'state'],
    // ... resto del tuo componente qui
    calcolato: {// mappare i messaggi del negozio al nostro componente Vue
        ... apState('data', ['messages'])
    },
    mounted () {
        // avvisa il messaggio più recente sul caricamento dell'avviso
        del widget (questo. Saggi[this.id])
    }
}
</script>
```

Poi, per aggiungere dati al negozio:

```js
this.$store.commit('data/bind', {
    widgetId: this.id,
    msg
})
```

#### Stato Di Caricamento

Quando i carichi Dashboard 2.0, invierà un evento `widget-load` a tutti i widget nella Dashboard. Questo conterrà l'ultimo valore dal datastore Node-RED. Puoi iscriverti a questo evento nel tuo widget con:

```js
export default {
    props: ['id', 'props', 'state'],
    // resto del tuo componente qui
    montato () {
        questo.$socket.on('widget-load' + questo. d, (msg) => {
            // fai qualcosa con il msg
        })
    },
    unmounted () {
        // annullare l'iscrizione all'evento quando il widget viene distrutto
        questo.$socket.off('widget-load:' + this.id)
    
    }
}
```

### Styling con Vuetify & CSS

Possiamo definire il nostro CSS all'interno del repository del widget, importandolo in un componente `.vue` come segue:

```vue
<style scoped>
.ui-example-wrapper {
    padding: 10px;
    margin: 10px;
    border: 1px solid black;
}
</style>
```

Vuetify viene fornito anche con una manciata di corsi di utilità per aiutare con lo stile, che può essere utilizzato tutti fuori dalla scatola:

- [Display Responsivi](https://vuetifyjs.com/en/styles/display/#display)
- [Flex](https://vuetifyjs.com/en/styles/flex/)
- [Spacing](https://vuetifyjs.com/en/styles/spacing/#how-it-works)
- [Testo E Tipografia](https://vuetifyjs.com/en/styles/text-and-typography/#typography)

### Dipendenze Esterne

Il tuo widget può avere qualsiasi numero di dipendenze `npm`. Questi saranno tutti in bundle nel file `.umd.js` che Dashboard carica al runtime.

In `ui-example` abbiamo una dipendenza da `to-title-case`, in cui importiamo e utilizziamo il nostro componente Vue come segue:

```js
import toTitleCase from 'to-title-case'

export default {
    // rest of component here
    computed: {
        titleCase () {
            return toTitleCase(this. nput.title)
        }
    }
}
```

È inoltre possibile caricare in altri componenti Vue dall'interno del proprio repository come con qualsiasi componente VueJS.
