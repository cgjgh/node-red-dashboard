---
description: Guida completa sui test end-to-end per Node-RED Dashboard 2.0, garantendo affidabilità e prestazioni.
---

# E2E Testing

E2E Testing consiste di eseguire un ambiente locale e automatizzare l'interazione con il browser per testare il comportamento dei widget.

Con Dashboard 2.0, abbiamo i seguenti comandi che vengono utilizzati per il testing:

- `npm run cy:server` - Esegue un'istanza di Node-RED con Dashboard 2.0 installato.
- `npm run cy:run` - Esegue tutti i test di Cypress in modalità senza testa.
- `npm run cy:open` - Apre il runner di test Cypress, per cui puoi scegliere esplicitamente quali test eseguire localmente.

## Cipresso

Per i nostri test E2E utilizziamo [Cypress](https://www.cypress.io/). Questo fornisce un framework con il quale possiamo definire i test automatizzati che faranno clic su e interagiranno con gli elementi pertinenti nella nostra Dashboard, e controlli contro i comportamenti previsti.

## Test In Esecuzione

### Installa Istanza Node-RED Testing

Cypress è stato configurato per eseguire un'istanza locale di Node-RED con il Dashboard 2.0 installato. È necessario installare le dipendenze per questa istanza:

```bash
cd ./cypress/fixtures/user-dir/
npm install
```

### Server Test In Esecuzione

Per eseguire il server di prova, è necessario eseguire il seguente comando dalla radice del repository:

```bash
npm run cy:server
```

Il server di test verrà eseguito su `http://localhost:1881`, e qualsiasi Dashboard risultante sarà disponibile su `http://localhost:1881/dashboard`.

### Apri Cypress

Per aprire l'runner di test Cypress, è necessario eseguire il seguente comando dalla root del repository:

```bash
npm run cy:open
```

Selezionare "E2E Testing, e quindi il browser di vostra scelta. Successivamente, vedrai un elenco dei test disponibili, che puoi eseguire individualmente.

![Screenshot che mostra i test del Pulsante UI in esecuzione nel Runner del Test Cypress](../../assets/images/cypress-ui.png)
_Screenshot che mostra i test del Pulsante UI in esecuzione nel Runner del Test Cypress_

## Test Di Scrittura

Con Node-RED e Dashboard 2.0, vogliamo essere in grado di fornire un `flow completo. son`, e poi testare il comportamento della Dashboard che viene distribuito come risultato di quel flusso.

In quanto tale, ciascuna serie di prove contiene due parti chiave:

1. `<widget>.json` - il `flows.json` che descrive i flussi di test da distribuire, memorizzati in `/cypress/fixtures/flows`
2. `<widget>.spec.js` - la suite di test che definisce gli elementi con cui interagire e gli stati da testare, memorizzati in `/cypress/tests/`

### 1) Flussi Di Test Di Costruzione

Ogni suite di test avrà un file `flows.json` corrispondente che descrive il flusso da distribuire all'istanza locale Node-RED. Questo conterrà i nodi necessari per testare il comportamento del widget in questione.

Il modo più semplice per costruire questo `flow.json` è Node-RED stesso:

1. Genera il flusso che vuoi testare in un'istanza locale Node-RED
2. Esporta come JSON
3. Salva il file `json` esportato in un file `json` all'interno di `/cypress/fixtures/flows`

Potresti anche voler sfruttare al massimo i [Cypress Test Helpers](#cypress-test-helpers).

### 2. Esempio file `spec.js`

Per fare riferimento al tuo `flow.json`, puoi usare la funzione di aiuto `cy.deployFixture` che caricherà il flusso nell'istanza locale Node-RED.

```js
descrivi ('Dashboard Node-RED 2. - Gruppi Di Pulsanti', () => {
    // anything here will run before all of the indivudal tests below
    beforeEach(() => {
        // here we can use our helper command to load a flow. son
        cy. eployFixture('dashboard-button-groups')
        // quindi assicurati che stiamo iniziando sulla pagina corretta per ogni test
        cy. isit('/dashboard/page1')
    })

    // it('') specifica un nuovo test
    (può essere cliccato ed emette un valore di stringa che rappresenta l'opzione', () => {
        // clickAndWait è un comando helper che fa clic su un elemento e attende un tempo impostato
        cy. lickAndWait(cy.get('pulsante'). ontains('Option 3'))
        
        // checkOutput poi utilizza le API Helper che abbiamo in atto tho check what output came from the button
        cy. heckOutput('msg.topic', 'first-row')
        cy. heckOutput('msg. ayload', 'option_3')
    })

    it('allows for definition of custom colouring for options', () => {
        // Fare clic sull'ultimo pulsante nel gruppo di pulsanti
        cy. lickAndWait(cy.get('#nrdb-ui-widget-ui-button-group-colors button'). ast())

        // controllare che il CSS sia applicato correttamente
        cy. et('#nrdb-ui-widget-ui-button-group-colors button').last()
            . hould('have.css', 'background-color', 'rgb(217, 255, 209)')
    })
})
```

## Aiuti Di Prova Cipresso

### Clic E Attendere

`cy.clickAndWait(<element>)`

Cypress aspetterà automaticamente che gli elementi appaiano nel DOM prima di interagire con essi, e attendere le richieste HTTP quando istruito, tuttavia, non può eseguire lo stesso per il traffico Websocket.

Dato che la maggior parte dei test comporterà il controllo delle conassequenze del traffico SocketIO, abbiamo creato un "comando" Cypress, `clickAndWait()` che assicura un periodo di tempo impostato dopo aver cliccato prima di passare alla fase successiva di un test.

### Output Negozio (Nodo Funzione)

Per facilitare la scrittura dei test, abbiamo creato una funzione helper che può essere utilizzata per testare l'output da determinati widget. Questo nodo funzione può essere incluso nel flusso Node-RED, e memorizzerà l'oggetto `msg` in un `global`

<iframe width="100%" height="250px" src="https://flows.nodered.org/flow/51259d06082d56dd79725d7675f6c4bc/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Il nodo funzione "Store Latest Msg" qui contiene:

```js
global.set('msg', msg)
return msg;
```

Quando si fa clic su un pulsante nella Dashboard, il valore emesso da quel pulsante viene quindi memorizzato in una variabile globale `msg`. Possiamo quindi usare questo in couva con il controllo che l'uscita.

### Verifica Uscita

`cy.checkOutput(<key>, <value>)`

Se si utilizza il nodo funzione [Store Output](#store-output-function-node), possiamo quindi usare il comando `checkOutput` per controllare il valore dell'oggetto `msg` rispetto a quello che ci aspettiamo che sia.

Questo flusso di aiuto viene distribuito automaticamente nell'istanza Node-RED quando si utilizza il comando `deployFixture(<fixture>)`.

<iframe width="100%" height="250px;" src="https://flows.nodered.org/flow/85116e5ecfdb9da778bbbbfe34c0063b/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Ad esempio, dai nostri test di pulsante:

```js
descrivi ('Dashboard Node-RED 2. - Buttons', () => {
    beforeEach(() => {
        cy. eployFixture('dashboard-buttons') // legge in un flusso.json e lo distribuisce nell'istanza locale Node-RED
        cy. isit('/dashboard/page1')
    })

    it('può essere cliccato e produce il payload corretto & topic sono emessi', () => {
        // Emitting strings
        cy. lickAndWait(cy.get('pulsante'). ontains('Button 1 (str)'))
        // checkOutput chiama i nostri endpoint helper per controllare i valori rispetto al msg
        memorizzato. heckOutput('msg.payload', 'button 1 clicked')
        cy.checkOutput('msg. opic', 'button-str-topic')

        // Emitting JSON
        cy. lickAndWait(cy.get('button').contains('Button 1 (json)'))
        cy. heckOutput('msg.payload.hello', 'world')
        cy.checkOutput('msg.topic', 'button-json-topic')
    })
})
```

### Reset Context

`cy.resetContext()`

La funzione di cui sopra assiste l'impostazione e il controllo dell'output che si basano sui negozi "context" di Node-RED. Questa funzione può essere usata per essere sicura di avere un archivio contestuale pulito riavviandolo. Questo è meglio usato _prima_ usando la funzione [Store Output](#store-output-function-node) helper per assegnare nuovi valori al negozio.

### Ricarica Dashboard

`cy.reloadDashboard()`

Se in qualsiasi punto si desidera ricaricare la pagina, utilizzando questo comando si aggiornerà la pagina, ma assicurati anche che la chiamata API `/_setup` sia terminata, prima di procedere con qualsiasi altra fase del test.