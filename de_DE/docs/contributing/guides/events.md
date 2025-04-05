---
description: Tauchen Sie ein in die Ereignisarchitektur des Node-RED Dashboard 2.0 für effiziente Datenverarbeitung und Interaktion.
---

# Ereignisarchitektur

Ein wichtiger Teil des Dashboards ist die Kommunikation von Node-RED und Dashboard. Dies wird mit [socket.io]erreicht (https://socket.io/).

Hier finden Sie Details zur primären Kommunikation, die zwischen Node-RED (rote Blöcke) und dem Dashboard (blaue Blöcke) stattfindet. Die Blöcke verweisen auf bestimmte Funktionen und Dateien innerhalb des Quellcodes, um zu navigieren und zu verstehen, wo der relevante Code zu finden ist.

Jedes der zylindrischen Blöcke bezieht sich direkt auf einen unserer Client- oder Server-Side-Shops, die im [State Management](./state-management.md) Leitfaden detailliert sind.

## Architektur

Wir haben die Ereignisarchitektur/den Datenverkehr in drei Schlüsselgruppen aufgeteilt:

- **Laden**: Das erste Laden des Dashboards, oder wenn eine neue Konfiguration von Node-RED auf einer neuen "Deploy" gesendet wird.
- **Eingabe**: Wenn eine Nachricht (`msg`) von einem Dashboard-Knoten innerhalb von Node-RED empfangen wird.
- **Dashboard-Aktionen**: Wenn ein Benutzer mit einem Widget interagiert oder ein Widget eine Nachricht an Node-RED zurücksendet.

### "Laden" Event Flow

![Ein Fließdiagramm, das zeigt, wie Ereignisse zwischen Knoten (rot) und Dashboard (blau) beim Deploy und Firstload](../../assets/images/events-arch-load.jpg){data-zoomable}
_Ein Fließdiagramm zeigt, wie Ereignisse zwischen Knoten (rot) und Dashboard (blau) beim Deploy und Firstload_ verlaufen.

Hier beschreiben wir die anfängliche "Setup"-HTTP-Anfrage konsequenter SocketIO-Verkehr und geeignete Handler, die ausgeführt werden, wenn ein Dashboard eingesetzt wird (über die Option "Deploy") sowie wenn ein Dashboard-Client zum ersten Mal geladen wird.

Beachten Sie die Unterscheidung zwischen dem Laden eines Dashboards, d.h. der vollständigen App- und Browserverbindung und einem individuellen "Widget"-Ladegerät. Letzteres wird für _each_ Widget abgefeuert, wenn es im DOM-Format montiert bzw. gerendert wird.

### Ereignisfluss "Eingabe"

![Ein Fließdiagramm, das zeigt, wie Ereignisse zwischen Knoten (rot) und Dashboard (blau) verlaufen, wenn Nachrichten von einem Dashboard-Knoten empfangen werden](../../assets/images/events-arch-msg.jpg){data-zoomable}
_Ein Fließdiagramm zeigt, wie Ereignisse zwischen Knoten (rot) und Dashboard (blau) durchlaufen, wenn Nachrichten von einem Dashboard-Knoten_ empfangen werden

Dieser Fluss beschreibt die Funktionen und den SocketIO-Datenverkehr, der auftritt, wenn eine Nachricht von einem Dashboard-Knoten innerhalb des Node-RED empfangen wird. Beachten Sie, dass die meisten Kern-Dashboard 2. Widgets verwenden den Standard-`onInput` Handler, aber in einigen Fällen wird ein benutzerdefinierter `onInput` Handler verwendet, wo wir ein anderes Verhalten wollen.

Unsere serverseitige Standardbehandlung "onInput" behandelt die üblichen Anwendungsfälle von:

- Aktualisiere den Widget-Wert in unseren serverseitigen Datenspeicher
- Überprüft, ob das Widget so konfiguriert ist, dass es eine `msg.topic` definiert, und wenn ja, aktualisiere die Eigenschaft `msg.topic` des Widgets
- Überprüfen Sie, ob das Widget mit einer Option `passthrough` konfiguriert ist und prüfen Sie den Wert, bevor Sie das `msg`-Objekt zu einem verbundenen Knoten emittieren.
- Löse das `msg` Objekt an alle verbundenen Knoten, falls zutreffend.

### "Dashboard-Aktionen" Event Flow

Verschiedene Widgets lösen je nach Anwendungsfall unterschiedliche Ereignisse aus. Das folgende Diagramm zeigt die drei Arten von Ereignissen, die der Client an den Server emittieren kann, und wie diese separat behandelt werden.

![Ein Fließdiagramm, das zeigt, wie Ereignisse vom Dashboard (blau) zum Knoten (rot) durchlaufen, wenn ein Benutzer mit Dashboard interagiert](../../assets/images/events-arch-client-events.jpg){data-zoomable}
_Ein Fließdiagramm zeigt, wie Ereignisse vom Dashboard (blau) zum Knoten (rot) durchlaufen, wenn ein Benutzer mit Dashboard interagiert_ interagiert\*

Einige Beispiele für Ereignisse, die vom Dashboard zum Node-RED emittiert werden, sind:

- "widget-change" - Wenn ein Benutzer den Wert eines Widgets ändert, z.B. einen Slider oder Texteingabe
- `widget-action` - Wenn ein Benutzer mit einem Widget interagiert und der Status des Widgets nicht wichtig ist, z.B. ein Knopfklick
- `widget-send` - Wird von `ui-template` benutzt um ein benutzerdefiniertes `msg` Objekt zu senden, z.B. `send(msg)`, das im serverseitigen Datenspeicher gespeichert wird.

#### Widgets synchronisieren

Das Ereignis `widget-change` wird verwendet, um Eingaben vom Server zu emittieren und stellt eine Änderung des Zustands für dieses Widget dar, z. . Ein Schalter kann ein- oder ausgeschaltet werden, indem ein Benutzer darauf klickt. In diesem Fall, wenn mehrere Clients mit derselben Knoten-RED-Instanz verbunden sind, wird Dashboard sicherstellen, dass Clients synchronisiert werden, wenn Werte geändert werden.

Zum Beispiel, wenn Sie einen Schieberegler auf einer Instanz des Dashboards verschieben, werden alle Schieberegler ebenfalls automatisch aktualisiert.

Um dieses Designmuster "Single Source of truth" zu deaktivieren, Sie können den Widget-Typ in der Registerkarte ["Klientendaten"](../../user/multi-tenancy#configuring-client-data) der Dashboard-Einstellungen überprüfen.

## Eventliste

Dies ist eine umfassende Liste aller Ereignisse, die über socket.io zwischen Node-RED und Dashboard gesendet werden.

### `ui-config`

- Payload: `object{ Dashboards, Theme, Seiten, Gruppen, Widgets }`

Wird verwendet, um Dashboard/theme/page/groups/[widget](#widget) Layoutdaten zu transportieren, die jeweils von den jeweiligen Ids abgebildet werden.

### `msg-input:<node-id>`

- Payload: `<msg>`

Von NR an UI gesendet, wenn eine msg-Eingabe in einen Dashboard-Knoten empfangen wird.

### "widget-load"

- ID: `<node-id>`
- Payload: "keine"

Gesendet von UI an NR, wenn das UI/Widget zum ersten Mal geladen wird. Gibt NR die Möglichkeit, das Widget mit allen bekannten existierenden Werten auszustatten.

### "widget-change"

- ID: `<node-id>`
- Payload: `<value>` - typischerweise die Payload-Daten, die in der msg gesendet werden

Gesendet von UI an NR, wenn der Wert eines Widgets von der Oberfläche geändert wird, z.B. Texteingabe, Schieberegler. Angenommen der abgestrafte Wert ist die `msg.payload`.

Dies nimmt zuvor empfangene msg und fusioniert sie mit dem neu empfangenen Wert, zum Beispiel wenn das msg war:

```json
{
    "payload": 30,
    "topic": "on-change"
}
```

und die `widget-change` erhielt einen neuen Wert von `40`, dann würde die neu emittierte Nachricht lauten:

```json
{
    "payload": 40,
    "topic": "on-change"
}
```

Jeder hier empfangene Wert wird auch gegen das Widget im Datenspeicher gespeichert.

### "widget-sync"

- Payload: `<msg>`

Ausgelöst vom serverseitigen `onChange` Handler. Dies sendet eine Nachricht an alle verbundenen Clients und informiert relevante Widgets über Status- und Wertänderungen. Wenn zum Beispiel ein Schieberegler verschoben wird, stellt die `widget-sync` Nachricht sicher, dass alle verbundenen Clients und deren jeweiligen Schieberegler mit dem neuen Wert aktualisiert werden.

### "widget-action"

- ID: `<node-id>`
- Payload: `<msg>`

Wird von der Oberfläche an NR gesendet, wenn ein Widget aktiv ist, z.B. auf eine Schaltfläche klicken oder eine Datei hochladen.

### "widget-senden"

- ID: `<node-id>`
- Payload: `<msg>`

In der Regel von `ui-template` verwendet. Dieser Termin ist von der Funktion `send(msg)` des Templates umfasst, die es Benutzern erlaubt, eigene vollständige `msg` Objekte zu definieren, die von einem `ui-template` Knoten emittiert werden. Wenn ein Nicht-Objekt-Wert gesendet wird, wird das Dashboard automatisch in ein `msg.payload`-Objekt einwickeln, z. B.:

```js
senden(10)
```

führt zu einem `msg` Objekt von:

```json
{
    "payload": 10 
}
```

Ähnlich ist stattdessen ein Objekt spezifiziert:

```js
send({ myVar: 10, Thema: "my-topic" })
```

dann wird das `msg` Objekt sein:

```json
{
    "myVar": 10,
    "topic": "my-topic"
}
```

Jede `msg` mit dieser Funktion wird auch in dem dem Widget zugeordneten Datenspeicher gespeichert.

## Event Payloads

Dies beschreibt einige der Objektstrukturen, die verwendet werden, um Daten über die Socket-Io-Verbindungen zwischen Node-RED und Dashboard zu senden.

### "Widget"

Innerhalb der `ui-config`, ist die Eigenschaft `widgets` ein Array von `Widget` Objekten. Jedes `Widget` Objekt hat folgende Eigenschaften:

- **id**: Die Id, die von Node-RED zugewiesen wurde, um diesen Knoten im Editor eindeutig zu identifizieren
- **props**: Die Sammlung von Eigenschaften, die der Benutzer innerhalb des Editors für diesen Knoten festlegen kann
- **Komponent** - Die jeweilige Vue Komponente, die für das Rendern benötigt wird, Frontend hinzugefügt (in App.vue)
- **state** - Enthält Wert, der den visuellen und interaktiven Status eines Widgets definiert, z.B. `enabled: true` oder `visible: false` (`sichtbar: ` noch nicht unterstützt)
