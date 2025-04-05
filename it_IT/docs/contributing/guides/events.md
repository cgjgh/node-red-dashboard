---
description: Immergiti in profondità nell'architettura degli eventi della Dashboard Node-RED 2.0 per una gestione efficiente dei dati e un'interazione con l'interfaccia utente.
---

# Eventi Architettura

Una parte importante del Dashboard è come comunicano Node-RED e Dashboard. Questo si ottiene usando [socket.io](https://socket.io/).

Qui puoi trovare dettagli sulle comunicazioni primarie che si verificano tra Node-RED (blocchi in rosso) e Dashboard (blocchi in blu). I blocchi fanno riferimento a particolari funzioni e file all'interno del codice sorgente per aiutare a navigare e capire dove trovare il codice pertinente.

Ognuno dei blocchi cilindrici si riferisce direttamente a uno dei nostri negozi di lato client o server, che sono dettagliati nella [State Management](./state-management.md) guida.

## Architettura

Abbiamo spezzato l'architettura degli eventi/traffico in tre gruppi chiave:

- **Caricamento**: il caricamento iniziale della Dashboard, o quando una nuova configurazione viene inviata da Node-RED su un nuovo "Deploy".
- **Input**: Quando un messaggio (`msg`) viene ricevuto da un nodo Dashboard all'interno di Node-RED.
- **Azioni Dashboard**: Quando un utente interagisce con un widget o un widget invia un messaggio a Node-RED.

### "Caricamento" Flusso Evento

![Un diagramma di flusso che raffigura come gli eventi attraversano tra Node-RED (rosso) e la Dashboard (blu) al deploy e al primo carico](../../assets/images/events-arch-load.jpg){data-zoomable}
_Un diagramma di flusso che descrive come gli eventi attraversano tra Node-RED (rosso) e il Dashboard (blu) al deploy e al primo carico_

Qui dettagliamo la richiesta HTTP "Setup" iniziale, conseguente traffico SocketIO e i gestori appropriati che vengono eseguiti quando viene distribuito un Dashboard (tramite l'opzione "Deploy" Node-RED), così come quando un client Dashboard viene caricato per la prima volta.

Notare la differenza tra il caricamento di un "Dashboard", cioè la connessione completa dell'app e del browser, e un caricamento individuale di un "Widget". Quest'ultimo viene licenziato per _each_ widget quando è montato/renderizzato nel DOM.

### Flusso Evento "Input"

![Un diagramma di flusso che raffigura come gli eventi attraversano tra Node-RED (rosso) e la Dashboard (blu) quando i messaggi vengono ricevuti da un nodo Dashboard](../../assets/images/events-arch-msg.jpg){data-zoomable}
_Un diagramma di flusso che descrive come gli eventi attraversano tra Node-RED (rosso) e la Dashboard (blu) quando i messaggi vengono ricevuti da un nodo Dashboard_

Questo flusso descrive le funzioni e il traffico SocketIO che si verifica quando un messaggio viene ricevuto da un nodo Dashboard all'interno di Node-RED. Nota che la maggior parte dei core Dashboard 2. i widget usano il gestore `onInput` predefinito, ma in alcuni casi viene utilizzato un gestore `onInput` personalizzato dove vogliamo comportamenti diversi.

Il nostro gestore `onInput` lato server predefinito gestisce i casi di uso comune di:

- Aggiornamento del valore del widget nel nostro archivio dati lato server
- Controllare se il widget è configurato per definire un `msg.topic` e, in tal caso, aggiornare la proprietà `msg.topic` del widget
- Verifica se il widget è configurato con un'opzione `passthrough` e, in tal caso, controlla il suo valore prima di emettere l'oggetto `msg` a qualsiasi nodo connesso.
- Emette l'oggetto `msg` a qualsiasi nodo connesso, se appropriato.

### "Azioni Dashboard" Flusso Evento

I widget diversi attivano eventi diversi a seconda dei casi d'uso specifici. Il seguente diagramma mostra i tre tipi di eventi che il client può emettere sul server e come questi sono gestiti separatamente.

![Un diagramma di flusso che raffigura come gli eventi attraversano dalla Dashboard (blu) al Node-RED (rosso) quando un utente interagisce con la Dashboard](../../assets/images/events-arch-client-events.jpg){data-zoomable}
_Un diagramma di flusso che raffigura come gli eventi attraversano dalla Dashboard (blu) a Node-RED (rosso) quando un utente interagisce con la Dashboard_

Alcuni esempi di eventi che vengono emessi dalla Dashboard a Node-RED includono:

- `widget-change` - Quando un utente cambia il valore di un widget, ad esempio un cursore o un input di testo
- `widget-action` - Quando un utente interagisce con un widget e lo stato del widget non è importante, ad esempio un pulsante clicca
- `widget-send` - Utilizzato da `ui-template` per inviare un oggetto `msg` personalizzato, ad esempio `send(msg)`, che sarà memorizzato nell'archivio dati lato server.

#### Sincronizzazione Widget

L'evento `widget-change` è usato per emettere input dal server e rappresenta un cambiamento di stato per quel widget, e. . un interruttore può essere acceso/spento da un utente che lo fa clic. In questo caso, se hai più client connessi alla stessa istanza Node-RED, Dashboard assicurerà che i client siano in sincronizzazione quando i valori cambiano.

Per esempio se si sposta un cursore su un'istanza del cruscotto, tutti i cursori collegati saranno anche auto-aggiornamento.

Per disabilitare questo modello di progettazione "singola fonte di verità", è possibile controllare il tipo di widget nella scheda ["Dati clienti"](../../user/multi-tenancy#configuring-client-data) delle impostazioni della Dashboard.

## Elenco Eventi

Questo è un elenco completo di tutti gli eventi che vengono inviati tra Node-RED e la Dashboard via socket.io.

### `ui-config`

- Payload: `object{ dashboards, tema, pagine, gruppi, widget }`

Utilizzato per trasportare i dati di layout dashboard/theme/page/groups/[widget](#widget) ogni mappato dai rispettivi id's.

### `msg-input:<node-id>`

- Payload: `<msg>`

Inviato da NR all'interfaccia utente quando viene ricevuto un input msg in un nodo Dashboard.

### `widget-load`

- ID: `<node-id>`
- Payload: `none`

Inviato da UI a NR quando l'UI/widget viene caricato per la prima volta. Dà una possibilità a NR di fornire al widget qualsiasi valore esistente noto.

### `widget-change`

- ID: `<node-id>`
- Payload: `<value>` - tipicamente i dati di payload da inviare nel msg

Inviato da UI a NR quando il valore di un widget viene cambiato da UI, ad esempio input di testo, slider. Suppone che il valore emesso sia il `msg.payload`.

Questo richiede hte precedentemente ricevuto msg, e lo fonde con il valore appena ricevuto, per esempio se il msg era:

```json
{
    "payload": 30,
    "topic": "on-change"
}
```

e il `widget-change` ha ricevuto un nuovo valore di `40`, quindi il messaggio appena emesso sarà:

```json
{
    "payload": 40,
    "topic": "on-change"
}
```

Qualsiasi valore ricevuto qui verrà memorizzato anche sul widget nel datastore.

### `widget-sync`

- Payload: `<msg>`

Attivato dal gestore `onChange` lato server. Invia un messaggio a tutti i client connessi e informa i widget rilevanti delle modifiche di stato/valore. Ad esempio, quando un cursore viene spostato, il messaggio `widget-sync` assicurerà che tutti i client connessi, e il rispettivo cursore siano aggiornati con il nuovo valore.

### `widget-action`

- ID: `<node-id>`
- Payload: `<msg>`

Inviato dall'interfaccia utente a NR quando un widget è azionato, ad esempio fare clic su un pulsante o caricare un file.

### `widget-send`

- ID: `<node-id>`
- Payload: `<msg>`

Generalmente usato da `ui-template`. Questo evento è confezionato dalla funzione `send(msg)` del Template che permette agli utenti di definire i propri oggetti `msg` completi da emettere da un nodo `ui-template`. Se viene inviato un valore non-oggetto, la Dashboard si chiuderà automaticamente in un oggetto `msg.payload`, ad esempio:

```js
invia(10)
```

comporterà un oggetto `msg` di:

```json
{
    "payload": 10 
}
```

Allo stesso modo, è invece specificato un oggetto:

```js
send({ myVar: 10, topic: "my-topic" })
```

allora l'oggetto `msg` sarà:

```json
{
    "myVar": 10,
    "topic": "my-topic"
}
```

Qualsiasi `msg` emesso utilizzando questa funzione viene memorizzato anche nel datastore associato al widget.

## Payload Evento

Questo dettagli alcune delle strutture oggetto utilizzate per inviare dati attraversare le connessioni io socket tra Node-RED e Dashboard.

### `Widget`

All'interno del `ui-config`, la proprietà `widgets` è un array di oggetti `Widget`. Ogni oggetto `Widget` ha le seguenti proprietà:

- **id**: L'id assegnato da Node-RED per identificare univocamente quel nodo nell'editor
- **props**: La raccolta di proprietà che l'utente può definire all'interno dell'editor per quel nodo
- **componente** - Il rispettivo componente Vue richiesto per il rendering, aggiunto front-end (in App.vue)
- **state** - Contiene il valore che definisce il "stato" visivo e interattivo di un widget, ad esempio `enabled: true` o `visible: false` (`visible: ` non ancora supportato)
