---
description: Umfassende Anleitung zum Ende-zu-End-Test für Node-RED Dashboard 2.0, die Zuverlässigkeit und Leistung sicherstellt.
---

# E2E-Tests

E2E Testing besteht darin, eine lokale Umgebung auszuführen und die Interaktion mit dem Browser zu automatisieren, um das Verhalten der Widgets zu testen.

Mit Dashboard 2.0 haben wir folgende Befehle zum Testen verwendet:

- `npm run cy:server` - Läuft eine Instanz von Node-RED mit installiertem Dashboard 2.0.
- `npm run cy:run` - Läuft alle Zypressentests im kopflosen Modus.
- `npm run cy:open` - Öffnet den Cypres-Testläufer, wobei Sie explizit wählen können, welche Tests lokal ausgeführt werden sollen.

## Zypressen

Für unsere E2E-Tests verwenden wir [Cypress](https://www.cypress.io/). Dies bietet einen Rahmen, mit dem wir automatisierte Tests definieren können, die auf relevante Elemente in unserem Dashboard klicken und mit ihnen interagieren können und überprüfen Sie gegen erwartetes Verhalten.

## Führende Tests

### Node-RED Testing Instanz installieren

Cypress wurde so konfiguriert, dass eine lokale Instanz von Node-RED mit installiertem Dashboard 2.0 ausgeführt wird. Sie müssen die Abhängigkeiten für diese Instanz installieren:

```bash
cd ./cypress/fixtures/user-dir/
npm installieren
```

### Testserver läuft

Um den Testserver auszuführen, müssen Sie den folgenden Befehl aus dem Stammverzeichnis des Projektarchivs ausführen:

```bash
npm run cy:server
```

Der Testserver wird unter `http://localhost:1881` laufen und das resultierende Dashboard wird unter `http://localhost:1881/dashboard` verfügbar sein.

### Zypress öffnen

Um den Cypress Test Runner zu öffnen, müssen Sie den folgenden Befehl aus dem Stammverzeichnis des Projektarchivs ausführen:

```bash
npm run cy:open
```

Wählen Sie "E2E Testing, und dann den Browser Ihrer Wahl. Danach werden Sie eine Liste der verfügbaren Tests sehen, die Sie dann einzeln ausführen können.

![Screenshot zeigt die UI-Taste Tests an, die im Zypressen-Testläufer ausgeführt werden](../../assets/images/cypress-ui.png)
_Screenshot zeigt die UI-Taste Tests an, die im Zypressen-Testläufer ausgeführt werden_

## Schreibtests

Mit Node-RED und Dashboard 2.0 wollen wir in der Lage sein, einen kompletten `flow. son`, und dann das Verhalten des Dashboards, das als Ergebnis dieses Flusses eingesetzt wird, testen.

Daher enthält jeder Satz von Tests zwei Schlüsselelemente:

1. `<widget>.json` - der `flows.json`, der die zu verwendenden Testflüsse detailliert beschreibt, gespeichert in `/cypress/fixtures/flows`
2. `<widget>.spec.js` - die Testsuite, welche die zu testenden Elemente und die zu testenden Zustände definiert, die in `/cypress/tests/` gespeichert sind

### 1) Bau-Testflüsse

Jede Testsuite wird eine entsprechende `flows.json` Datei haben, die den Fluss beschreibt, der zur lokalen Node-RED-Instanz bereitgestellt werden soll. Dies enthält die notwendigen Knoten, um das Verhalten des betreffenden Widgets zu testen.

Der einfachste Weg, um diesen `flow.json` zu bauen, ist in Node-RED selbst:

1. Erstellen Sie den Fluss, den Sie in einer lokalen Node-RED-Instanz testen möchten
2. Exportieren als JSON
3. Speichere den exportierten `json` in eine `json` Datei innerhalb von `/cypress/fixtures/flows`

Sie können auch das Beste aus den [Cypress Test Helpers](#cypress-test-helpers) machen.

### 2. Beispiel `spec.js` Datei

Um deine relevante `flow.json` zu referenzieren, kannst du die `cy.deployFixture` Hilfsfunktion verwenden, die den Fluss in die lokale Node-RED-Instanz lädt.

```js
describe('Node-RED Dashboard 2.0 - Button Groups', () => {
    // anything here will run before all of the indivudal tests below
    beforeEach(() => {
        // here we can use our helper command to load a flow.json
        cy.deployFixture('dashboard-button-groups')
        // then make sure we're starting on the correct page for each test
        cy.visit('/dashboard/page1')
    })

    // it('') specifies a new test
    it('can be clicked and emit a string value representing the option', () => {
        // clickAndWait is a helper command that clicks on an element and waits for a set time
        cy.clickAndWait(cy.get('button').contains('Option 3'))
        
        // checkOutput then utilises the Helper APIs we have in place tho check what output came from the button
        cy.checkOutput('msg.topic', 'first-row')
        cy.checkOutput('msg.payload', 'option_3')
    })

    it('allows for definition of custom colouring for options', () => {
        // Click the last button in the button group
        cy.clickAndWait(cy.get('#nrdb-ui-widget-ui-button-group-colors button').last())

        // check the CSS is applied correctly
        cy.get('#nrdb-ui-widget-ui-button-group-colors button').last()
            .should('have.css', 'background-color', 'rgb(217, 255, 209)')
    })
})
```

## Zypressen-TestHelfer

### Klicken & Warten

`cy.clickAndWait(<element>)`

Cypress wartet automatisch, bis Elemente im DOM erscheinen, bevor sie mit ihnen interagieren und auf HTTP-Anfragen warten, wenn sie angewiesen sind, kann es jedoch nicht dasselbe für Websocket-Verkehr durchführen.

Da die meisten Tests die Überprüfung auf die Beeinträchtigungen des SocketIO-Verkehrs beinhalten, haben wir einen Zyprer "Befehl" erstellt `clickAndWait()` stellt nach einem Klick auf die nächste Phase eines Tests einen festgelegten Zeitraum sicher.

### Speicherausgabe (Unklangknoten)

Um das Schreiben von Tests zu erleichtern, haben wir eine Hilfsfunktion erstellt, mit der die Ausgabe bestimmter Widgets getestet werden kann. Dieser Funktionsknoten kann in deinen Knoten aufgenommen werden und speichert das `msg` Objekt in einem `global`

<iframe width="100%" height="250px" src="https://flows.nodered.org/flow/51259d06082d56dd79725d7675f6c4bc/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Der "Letzte Msg"-Funktionsknoten enthält hier:

```js
global.set('msg', msg)
return msg;
```

Wenn ein Button im Dashboard geklickt wird, wird der von diesem Button ausgegebene Wert in einer globalen `msg` Variable gespeichert. Wir können dies dann in Verbindung mit der Überprüfung dieser Ausgabe verwenden.

### Ausgabe prüfen

`cy.checkOutput(<key>, <value>)`

Wenn der obige [Speicherausgabe](#store-output-function-node) Funktionsknoten verwendet wird, dann können wir den Befehl `checkOutput` verwenden, um den Wert des `msg` Objekts auf das zu überprüfen, was wir von ihm erwarten.

Dieser Helferfluss wird automatisch in die Knoten-RED-Instanz verteilt, wenn der Befehl `deployFixture(<fixture>)` verwendet wird.

<iframe width="100%" height="250px;" src="https://flows.nodered.org/flow/85116e5ecfdb9da778bbbbfe34c0063b/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Zum Beispiel von unseren Button-Tests:

```js
beschreiben ('Node-RED Dashboard 2. - Buttons', () => {
    beforeEach(() => {
        cy. eployFixture('Dashboard-buttons') // liest eine flow.json ein und stellt diese in die lokale Node-RED-Instanz
        cy. isit('/dashboard/page1')
    })

    it('kann geklickt werden und gibt die korrekte Payload aus & Thema wird emittiert', () => {
        // Strings
        cy. lickAndWait(cy.get('button'). ontains('Button 1 (str)'))
        // checkOutput ruft unsere Helfer-Endpunkte auf, um die Werte auf die gespeicherte msg
        cy zu überprüfen. heckOutput('msg.payload', 'button 1 clicked')
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

Die obige Funktion unterstützt die Einstellung und Überprüfung der Ausgabe, die auf die "context" Stores von Node-RED angewiesen sind. Diese Funktion kann verwendet werden, um sicherzustellen, dass Sie einen sauberen Kontextspeicher haben, indem Sie ihn neu starten. Dies wird am besten _before_ mit der [Store Output](#store-output-function-node) Hilfsfunktion verwendet, um dem Store neue Werte zuzuweisen.

### Dashboard neu laden

`cy.reloadDashboard()`

Wenn Sie die Seite zu einem beliebigen Zeitpunkt neu laden möchten, wird die Seite durch das Benutzen dieses Befehls neu geladen stelle aber auch sicher, dass der `/_setup` API-Aufruf beendet wurde, bevor du mit weiteren Schritten in deinem Test fortfährst.