---
description: Impara il processo di registrazione del widget nella Dashboard 2.0 Node-RED per migliorare la funzionalità del tuo dashboard.
---

# Registrazione Widget

Ogni `ui-base`, `ui-page` e `ui-group` ha una funzione `.register`. La funzione di registrazione principale può essere trovata in `ui-base`.

Questa funzione è usata da tutti i widget per informare Dashboard della loro esistenza, e permette al widget di definire quale gruppo/page/ui appartiene, insieme alle proprietà rilevanti che il widget ha e a qualsiasi gestore di eventi (e. . `onInput` o `onAction`).

La funzione è chiamata all'interno del nodo Node-RED `. s` file, e nel quarto caso di registrazione di un widget come parte di un gruppo (il caso di uso più comune), assomiglierebbe a questo:

```js
modulo. xports = function (RED) {
    function MyNode (config) {
        // create node in Node-RED
        RED. odi. reateNode(questo, config)
        // store reference to our Node-RED node
        const node = this

        // which group are we rendering this widget
        const group = RED. odes.getNode(config. roup)

        // un oggetto che descrive gli eventi da sottoscrivere a
        const evts = {}

        // informa l'interfaccia utente del cruscotto che stiamo aggiungendo questo gruppo di nodo
        . egister(node, config, evts)
    }

    RED.nodes.registerType('ui-mywidget', MyNode)
}
```

## Argomenti

Gli input della funzione di registrazione differiscono leggermente a seconda se vengono chiamati su `ui-group`, `ui-page` o `ui-base`:

- `group.register(node, config, evts)`
- `page.register(group, node, config, evts)`
- `base.register(page, group, node, config, evts)`

Notare però, che tutti hanno 3 ingressi in comune:

### `node`

Questo è il `this` del costruttore del tuo nodo e può essere usato direttamente dal valore fornito da Node-RED.

### `config`

Questo è reso disponibile da Node-RED come input per il costruttore, e può generalmente passare dritto nel `. funzione egister` senza modifiche, sarà un oggetto che mapperà tutte le proprietà e i valori descritti nel nodo `. tml` definizione.

### `evts`

Esprimiamo una gamma di diversi gestori di eventi come parte della funzione `register`. Tutti questi gestori eseguono server (Node-RED) lato.

In alcuni casi, è possibile definire funzioni complete (che saranno eseguite al punto appropriato della durata dell'evento), in altre occasioni, è possibile definire solo un valore `true`/`false` che informa la Dashboard che si desidera per il widget di inviare o iscriversi a quell'evento.

È possibile trovare una ripartizione completa del ciclo di vita dell'evento [here](../../contributing/guides/events.md).

```js
const evts = {
    onAction: // boolean
    onChange: // boolean <unk> <unk> function
    beforeSend: // function
    onInput: // function
    onError: // function
    onSocket // object
}
```

## Eventi

Tutti questi gestori di eventi definiscono il comportamento che viene eseguito lato server (cioè all'interno di Node-RED). Se stai cercando dei gestori di eventi lato client vedi [here](../widgets/third-party.md#configuring-your-node).

### `.onAction` (`boolean`)

Quando impostato come `true`, questo flag attiverà il gestore predefinito quando il widget Dashboard invia un evento `widget-action`.

1. Assegna il valore fornito a `msg.payload`
2. Aggiunge qualsiasi `msg.topic` definito nella configurazione del nodo
3. Esegue `evts.beforeSend()` _(se fornito)_
4. Invia il file `msg` in avanti a qualsiasi nodo connesso usando `node.send(msg)`

Un esempio di questo è con `ui-button`, dove il `UIButton` del widget contiene una funzione `@click`, contenente:

```js
this.$socket.emit('widget-action', this.id, msg)
```

Questo invia un messaggio tramite SocketIO a Node-RED, con l'argomento dell'ID del widget. Poiché il `ui-button` ha `onAction: true` nella sua registrazione, verrà quindi eseguito il gestore predefinito descritto sopra.

### `.onChange` (`boolean` || `function`)

Simile a `onAction`, se usato come booleano, questo flag attiverà il gestore predefinito per un evento `onChange`.

#### Default `onChange` Handler

1. Assegna il valore fornito a `msg.payload`
2. Aggiunge qualsiasi `msg.topic` definito nella configurazione del nodo
3. Esegue `evts.beforeSend()` _(se fornito)_
4. Memorizza il messaggio più recente sul widget sotto la proprietà `._msg` che conterrà l'ultimo stato/valore del widget
5. Spinge un evento `widget-sync` per sincronizzare i widget in tutti i client.
6. Invia il file `msg` in avanti a qualsiasi nodo connesso

#### Custom `onChange` Handler

In alternativa, puoi sovrascrivere questo comportamento predefinito fornendo una funzione `onChange` personalizzata. Un esempio di questo è nel nodo `ui-switch` che deve fare `node. tatus` aggiornamenti per consentire all'editor Node-RED di riflettere il suo stato più recente:

```js
/**
 * Gestire l'input dal widget
 * @param {object} msg - l'ultimo msg conosciuto ricevuto (prima di questo nuovo valore)
 * @param {boolean} valore - il valore aggiornato inviato dal widget
 * @param {Socket} conn - socket. o socket che si connette al server
 * @param {String} id - id widget che invia l'azione
 */
onChange: async function (msg, valore, conn, id) {
    // ensure we have latest instance of the widget's node
    const wNode = RED. odes.getNode(node.id)

    node. tatus({
        fill: value ? 'verde' : 'red',
        forma: 'ring',
        testo: valore ? stati[1] : stati[0]
    })

    // recupera il valore on/off assegnato
    const su = RED. til.evaluateNodeProperty(config.onvalue, config.onvalueType, wNode)
    const off = RED.util. valuateNodeProperty(config.offvalue, config.offvalueType, wNode)
    msg. ayload = valore ? on : off

    // sync this change to all client with the same widget
    const exclude = [conn.id] 
    base. mit('widget-sync:' + id, msg, node, exclude)

    // simula Node-RED node ricevendo un input
    wNode. end(msg)
}
```

### `.beforeSend(msg)` (`function`)

Questa funzione middleware verrà eseguita prima che il nodo invii qualsiasi `msg` ai nodi conseguenti connessi nell'editor (e. . in `onInput`, `onAction` e `onChange` i gestori predefiniti).

La funzione deve prendere `msg` come input, e anche restituire `msg` come output.

In `ui-button`, usiamo `beforeSend` valuta il `msg.payload` come abbiamo un `TypedInput` ([docs](https://nodered.org/docs/api/ui/typedInput/). Il `TypedInput` deve essere valutato all'interno di Node-RED, in quanto può fare riferimento a variabili al di fuori del dominio del nodo del pulsante (ad esempio `global` o `flow`). Il gestore `onInput` predefinito prende quindi l'output dal nostro `beforeSend` e lo elabora di conseguenza.

### `.onInput(msg, send)` (`function`)

Definire questa funzione sovrascriverà il gestore `onInput` predefinito.

#### Default `onInput` Handler

1. Memorizza il messaggio più recente sul widget sotto il file `node._msg`
2. Aggiunge qualsiasi `msg.topic` definito nella configurazione del nodo
3. Controlla se il widget ha una proprietà `passthru`:
 - Se non si trova nessuna proprietà `passthru`, esegue `send(msg)`
 - Se la proprietà è presente, `send(msg)` è eseguito solo se `passthru` è impostato a `true`

#### Gestore `onInput` Personalizzato

Se fornito, questo sovrascriverà il gestore predefinito.

Usiamo questo nei widget core nella Dashboard con `ui-chart`, dove vogliamo memorizzare la cronologia del recente valore `msg`, anziché _just_ il valore più recente come fatto nel gestore predefinito. Lo usiamo anche qui per garantire che non abbiamo troppi punti dati (come definito nella configurazione `ui-chart`).

Un altro caso di utilizzo qui sarebbe se non si desidera trasferire automaticamente qualsiasi payload `msg` in entrata sui nodi connessi, ad esempio. potresti avere un sacco di payload di tipo comando `msg` che istruiscono il tuo nodo a fare qualcosa, che non sono quindi rilevanti per i nodi precedenti nel flusso.

### `.onError(err)` (`function`)

Questa funzione è chiamata all'interno dei gestori per `onAction`, `onChange` e `onInput`. Se c'è mai un problema con questi gestori (inclusi quelli personalizzati forniti), la funzione `onError` verrà chiamata.

### `.onSocket` (`object`)

Questo è un gestore di eventi un po 'unico, che viene utilizzato solo da widget sviluppati esternamente (i. . non parte dei widget Dashboard core dettagliati in questa documentazione). È previsto in modo che gli sviluppatori possano `emit`, e di conseguenza sottoscrivere, eventi SocketIO personalizzati che vengono trasmessi dai loro widget personalizzati.

Puoi vedere un esempio più dettagliato nella nostra documentazione [here](../widgets/third-party.md#custom-socketio-events).

La struttura generale di `onSocket` è la seguente:

```js
const evts = {
    onSocket: {
        'my-custom-event': function (id, msg) {
            console.log('my-custom-event', id, msg)
        }
    }
}
```

Si noti che questi eventi vengono emessi dalla Dashboard, e quindi questi gestori vengono eseguiti all'interno di Node-RED.