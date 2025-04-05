---
description: Gestione dello stato principale in Node-RED Dashboard 2.0 per mantenere un'interfaccia utente reattiva e dinamica.
---

# Gestione Fortezza

Dashboard 2.0 fornisce un archivio dati all'interno di Node-RED in modo che sia possibile aggiornare i tuoi client Dashboard e i dati sono conservati. Questo è particolarmente utile per i widget come `ui-chart` dove potresti voler conservare una cronologia di punti dati, o per widget come `ui-text` dove vuoi mantenere l'ultimo valore visualizzato.

Questa pagina descrive i diversi "negozi" che abbiamo in atto e per cui sono utilizzati.

Puoi anche controllare la [Architettura Eventi](./events.md) per avere un'occhiata più dettagliata a quando questi negozi vengono utilizzati e come interagiscono con il resto della Dashboard.

## Client-Side (Dashboard)

![Un'immagine raffigurante i tre negozi vuex lato cliente che abbiamo in Dashboard 2. ](../../assets/images/stores-client-side.jpg){data-zoomable}
_Un'immagine raffigurante i tre negozi vuex lato client che abbiamo nella Dashboard 2.0_

I nostri negozi lato cliente sono costruiti utilizzando [VueX](https://vuex.vuejs.org/). Questi negozi perdono i loro dati su un aggiornamento client (ma sono ripopolati dai negozi lato server) e sono utilizzati solo per mantenere un centralizzato, visualizzazione coerente dei dati su tutta l'applicazione Vue mentre l'utente naviga intorno alla Dashboard.

### `setup` store

Questo memorizza solo la risposta dalla nostra richiesta iniziale `/_setup`. Questo oggetto, nel nucleo, contiene la configurazione di SocketIO per aiutare il client a connettersi al server.

È anche possibile aggiungere plugin a questo oggetto (vedi [Aggiunta Plugins](../plugins/#index-js)) dati aggiuntivi che possono essere utili per tutta l'applicazione.

### `ui` store

Questo negozio è dove conserviamo la [ui-config]completa (./events#ui-config) che dettagli tutte le pagine, temi, gruppi e widget da renderizzare su una Dashboard.

### `data` negozio

Il datastore lato client è una mappa di id widget a:

- L'ultimo file `msg` ricevuto dal widget
- Un array di oggetti `msg`, che rappresentano tutti gli oggetti `msg` conosciuti ricevuti dal widget

Nella maggior parte dei casi, un widget necessita solo di riferimento al messaggio _last_. In alcuni casi, ad esempio `ui-chart`, la cronologia completa è necessaria per visualizzare una cronologia dei dati.

Quando un widget viene caricato per la prima volta, emettiamo un evento `widget-load` che nel gestore `onLoad` predefinito, tenterà di recuperare l'ultimo messaggio ricevuto dal widget dal datastore lato server, e memorizzarlo nell'archivio `data` lato client. Puoi saperne di più su questo in [Architettura Eventi](./events.md).

È possibile che un widget acceda all'oggetto `msg` mappato utilizzando:

```vue
<template>
    <pre>questo. essages[this.id]</pre>
</template>
<script>
export default {
    computed: {
        . .mapState('data', ['messages'])
    }
}
</script>
```

_Un file Widget.vue di esempio che utilizza l'archivio `data` per accedere all'ultimo messaggio ricevuto dal widget_

Questo valore viene aggiornato automaticamente anche quando viene ricevuto un nuovo messaggio, fintanto che quel widget utilizza i gestori predefiniti, di nuovo dettagliati in [Architettura eventi](./events.md).

## Server-Side (Node-RED)

![Un'immagine raffigurante i due vuex lato server che abbiamo in Dashboard 2. ](../../assets/images/stores-server-side.jpg){data-zoomable}
_Un'immagine raffigurante i due negozi lato server che abbiamo nella Dashboard 2.0_

I nostri negozi server-side mantengono la "singola fonte di verità". Quando un client Dashboard si connette, i dati centralizzati vengono inviati a ciascun client, e i negozi lato cliente sono popolati con le parti pertinenti di questo negozio centralizzato.

Nella nostra architettura lato server, utilizziamo due negozi standalone:

- `datastore`: Una mappa di ogni widget all'ultimo `msg` ricevuto da un rispettivo nodo nell'editor.
- `statestore`: Un negozio per tutte le proprietà dinamiche impostate sui widget (ad es. visibilità o impostazione di una proprietà in esecuzione). Spesso, questi valori sono sovrascritti della configurazione di base trovata nel `datastore`.

Ogni volta che un server funzione vuole scrivere in questi negozi, venga effettuato un controllo per garantire che tutti i messaggi forniti possano essere memorizzati. Un esempio di dove questo sarebbe bloccato è se `msg._client. ocketid` è specificato e il tipo di nodo rilevante è impostato per ascoltare i vincoli del socket (per impostazione predefinita, questo è `ui-control` e `ui-notification`). In questo caso, non vogliamo memorizzare questi dati nel nostro negozio centralizzato in quanto non è rilevante per _tutti_ utenti della Dashboard.

### Importazione Negozi

I negozi sono importati nel file `.js` di un nodo con:

```js
const store = require('<path>/<to>/store.js')
```

### Memorizzazione Dati

Il server `datastore` è un archivio centralizzato per tutti i messaggi ricevuti dai widget nell'editor. Si tratta di un semplice archivio chiave-valore, dove la chiave è l'id del widget, e il valore è il messaggio ricevuto dal widget. In alcuni casi, ad esempio `ui-chart` invece di registrare _just_ l'ultimo `msg` ricevuto, in realtà memorizziamo una storia.

#### `datastore.save`

Quando un widget riceve un messaggio, il gestore `node.on('input')` predefinito memorizzerà il messaggio ricevuto, mappato sull'id del widget nel datastore utilizzando:

```js
datastore.save(base, node, msg)
```

- `base`: Il nodo `ui_base` a cui è collegato il negozio
- `node`: l'oggetto nodo Node-RED per il quale stiamo salvando lo stato
- `msg`: Il messaggio ricevuto dal nodo

Questo memorizzerà l'ultimo messaggio ricevuto dal widget, che può essere recuperato dallo stesso widget al caricamento utilizzando:

#### `datastore.get`

Quando un widget viene inizializzato, tenterà di recuperare l'ultimo messaggio dal datastore utilizzando:

```js
datastore.get(node.id)
```

Questo garantisce, all'aggiornamento del client, o quando i nuovi client si connettono dopo che i dati sono stati generati, che lo stato sia presentato in modo coerente.

#### `datastore.append`

Con `. ppend`, possiamo memorizzare più messaggi sullo stesso widget, rappresentando una storia di stato, piuttosto che un singolo riferimento al solo valore _last_.

```js
datastore.append(base, node, msg)
```

- `base`: Il nodo `ui_base` a cui è collegato il negozio
- `node`: l'oggetto nodo Node-RED per il quale stiamo salvando lo stato
- `msg`: Il messaggio ricevuto dal nodo

Questo è usato in `ui-chart` per memorizzare la cronologia dei punti dati, dove ogni punto di dati potrebbe essere un messaggio individuale ricevuto dal widget.

#### `datastore.clear`

Quando un widget viene rimosso dall'editor, possiamo cancellare il datastore di tutti i messaggi memorizzati su quel widget utilizzando:

```js
datastore.clear(node.id)
```

Questo assicura che non abbiamo alcun dato stabile nel datastore, e che non abbiamo dati memorizzati su widget che non esistono più nell'editor.

### Negozio Fortezza

Il file `statestore` è un archivio centralizzato per tutte le proprietà dinamiche impostate contro i widget nell'editor. Le proprietà dinamiche possono essere impostate inviando `msg.<property>` payload ad un dato nodo, ad es. for ` ui-dropdown`, we can send `msg.options` to override the "Options" property at runtime.

Al primo livello è mappato con chiave all'ID Widget, quindi ogni widget ha una mappa, dove ogni chiave è il nome della proprietà, mappatura al valore.

#### `statestore.getAll`

Per un dato ID widget, restituisce tutte le proprietà dinamiche impostate.

```js
statestore.getAll(node.id)
```

#### `statestore.getProperty`

Per un dato ID widget, restituire il valore di una particolare proprietà.

```js
statestore.getProperty(node.id, property)
```

#### `statestore.set`

Dato un ID e una proprietà del widget, memorizza il valore associato nella mappatura appropriata

```js
statestore.set(base, node, msg, proprietà, valore)
```

- `base`: Il nodo `ui_base` a cui è collegato il negozio
- `node`: l'oggetto nodo Node-RED per il quale stiamo salvando lo stato
- `msg`: Il messaggio ricevuto dal nodo
- `property`: Il nome della proprietà da memorizzare
- `value`: Il valore da memorizzare contro la proprietà

#### `statestore.reset`

Rimuovere tutte le proprietà dinamiche per un dato Widget/Node.

```js
statestore.reset(node.id)
```

