---
description: Schritt-für-Schritt Anleitung zum Hinzufügen neuer Kern-Widgets zum Node-RED Dashboard 2.0 um seine interaktiven Funktionen zu erweitern.
---

# Neue Core-Widgets hinzufügen

Ein einzelnes Widget besteht aus zwei Schlüsselelementen:

1. Ein Knoten-RED-Knoten, der in der Palette des Node-RED-Editors angezeigt wird
2. `.vue` und Client-seitigen Code, der das Widget in ein Dashboard verwandelt

Sie können unsere Sammlung von Kern-Widgets [here](../../nodes/widgets.md).

Wir sind immer offen für Pull Requests und neue Ideen zu Widgets, die dem zentralen Dashboard-Repository hinzugefügt werden können.

Wenn ein neues Widget zur Kern-Sammlung hinzugefügt wird, Sie müssen den folgenden Schritten folgen, um sicherzustellen, dass das Widget im Node-RED-Editor verfügbar ist und korrekt in der Benutzeroberfläche dargestellt wird.

## Empfohlenes Lesen

Auf der linken Seite der Navigation finden Sie einen Abschnitt "Nützliche Anleitungen", wir empfehlen einen Blick auf diese zu werfen, da sie einen guten Überblick über die Struktur des Dashboard 2 geben. Codebase und einige der zugrunde liegenden architektonischen Prinzipien, auf denen er aufgebaut ist.

Insbesondere wird Folgendes empfohlen:

- [Ereignisarchitektur](/contributing/guides/state-management.html)
- [State Management](/contributing/guides/state-management.html)

## Checklist

Beim Hinzufügen eines neuen Widgets zum Dashboard 2. müssen Sie sicherstellen, dass den folgenden Schritten gefolgt wurde, damit das neue Widget erkannt und in ein Dashboard 2 aufgenommen wird. bauen:

1. In `/nodes/`:
    - Füge `<widget>.html` hinzu
    - Füge \`<widget>.js hinzu
    - Füge die Referenz in den Abschnitt `node-red/nodes` in `package.json` hinzu
2. In `/ui/`:
    - Füge \`widgets/<widget>/<widget>.vue hinzu
    - Widget zur `index.js` Datei in `/ui/widgets` hinzufügen

## Beispiel <widget.vue>

```vue
<template>
    <div @click="onAction">
        {{ id }}
    </div>
</template>

<script>
    import { useDataTracker } from '../data-tracker.js'
    import { mapState } from 'vuex'

    export default {
        name: 'DBUIWidget',
        // we need to inject $socket so that we can send events to Node-RED
        inject: ['$socket', '$dataTracker'],
        props: {
            id: String,    // the id of the widget, as defined by Node-RED
            props: Object, // the properties for this widget defined in the Node-RED editor
            state: Object  // the state of this widget, e.g. enabled, visible
        },
        computed: {
            // map our data store such that we can get any data bound to this widget
            // received on input from Node-RED
            ...mapState('data', ['messages']), // provides access to `this.messages` where `this.messages[this.id]` is the stored msg for this widget
        },
        created () {
            // setup the widget with default onInput, onLoad and onDynamicProperties handlers
            this.$dataTracker(this.id)
        },
        methods: {
            onAction () {
                // we can send any data we need Node-RED through this (optional) message parameter
                const msg = {
                    payload: 'hello world'
                }
                // send an event to Node-RED to inform it that we've clicked this widget
                this.$socket.emit('widget-action', this.id, msg)
            }
        }
    }
</script>
  
<style scoped>
</style>
```

## Daten-Tracker

Der Data-Tracker ist ein weltweit verfügbarer Dienstprogramm, der dazu beiträgt, die Standard-Ereignis-Handler für Widgets einzurichten.

### Auslastung

Der Datentracker ist global über vorhandene Widgets hinweg verfügbar und kann mit `diesem` aufgerufen werden.$dataTracker(...)\`.

Die einfachste Nutzung des Tracker wäre:

```js
...
erstellt () {
    dies.$dataTracker(this.id)
},
...
```

Dies wird die folgenden Ereignisse einrichten:

- `on('widget-load')` - Stellen Sie sicher, dass wir alle empfangenen `msg` Objekte speichern, wenn ein Widget zum ersten Mal in das Dashboard geladen wird.
- `on('msg-input')` - Standardverhalten prüft dynamische Eigenschaften (z.B. Sichtbarkeit, deaktivierter Zustand) und speichert auch eingehende `msg` im Vuex Store

### Eigene Verhaltensweisen

Es bietet auch Flexibilität um benutzerdefinierte Ereignis-Handler für ein bestimmtes Widget zu definieren, zum Beispiel in einem `ui-chart`-Knoten, wir haben eine Logik, die das Zusammenführen von Datenpunkten und die Darstellung des Diagramms behandelt, wenn eine Nachricht empfangen wird.

Die Eingaben für die `this.$dataTracker(widgetId, onInput, onLoad, onDynamicProperties)` Funktion werden wie folgt verwendet:

- `widgetId` - die eindeutige ID des Widgets
- `onInput` - eine Funktion, die aufgerufen wird, wenn eine Nachricht von Node-RED über den Socket-Handler `on(msg-input)` empfangen wird
- `onLoad` - eine Funktion, die aufgerufen wird, wenn das Widget geladen wird und durch das Ereignis `widget-load` ausgelöst wird
- `onDynamicProperties` - eine Funktion, die als Teil des Ereignisses `on(msg-input)` aufgerufen wird und _before_ die Standardfunktion `onInput` auslöst. Dies ist ein guter Einstiegspunkt, um auf alle Eigenschaften zu überprüfen, die im `msg` enthalten sind, um eine dynamische Eigenschaft zu setzen (i. . Inhalt gesendet an `msg.ui_update...`).

## Dynamische Eigenschaften

Node-RED erlaubt die Definition der zugrunde liegenden Konfiguration für einen Knoten. Zum Beispiel hätte ein `ui-button` Eigenschaften wie `label`, `color`, `icon`, etc. Es ist oft erwünscht, dass diese Eigenschaften dynamisch sind, was bedeutet, dass sie zur Laufzeit geändert werden können.

Es ist eine Standardpraxis innerhalb von Dashboard 2.0, diese Aktualisierungen über ein verschachteltes `msg.ui_update` Objekt zu unterstützen. Daher können Benutzer erwarten, dass sie diese in der Regel durch Übergabe in `msg steuern können. i_update.<property-name>` auf den Knoten, der wiederum die entsprechende Eigenschaft aktualisieren soll.

### Designmuster

Dieser Abschnitt beschreibt das architektonische Muster für die Entwicklung dynamischer Eigenschaften zu einem Widget.

Serverseitige dynamische Eigenschaften werden in unserem `state` Store gespeichert. Dies ist eine Zuordnung der Widget-ID zu den dynamischen Eigenschaften, die diesem Widget zugewiesen sind. Dies geschieht so, dass wir die Trennung der dynamischen Eigenschaften für ein Widget von der ursprünglichen Konfiguration in Node-RED sicherstellen können.

Bevor der `ui-base` Knoten das `ui-config` Event und Payload abgibt, werden die dynamischen Eigenschaften mit der ersten Konfiguration zusammengeführt, mit den dynamischen Eigenschaften, die erlaubt sind, die zugrunde liegende Konfiguration zu überschreiben. Wenn der Client eine `ui-config` Nachricht erhält, wird er die aktuellste Konfiguration für das Widget haben, Mit der Verschmelzung sowohl statischer als auch dynamischer Eigenschaften.

### Einstellung der dynamischen Eigenschaften

#### Serverseitig

Um eine dynamische Eigenschaft im serverseitigen `state` Store zu setzen, können wir das `beforeSend` Event auf dem Knoten verwenden. Dieses Ereignis wird bei jeder Gelegenheit ausgelöst, dass der serverseitige Knoten dabei ist, eine Nachricht an den Client zu senden, einschließt, wenn eine neue Eingabe in einen gegebenen Knoten empfangen wird.

Dafür nutzen wir die `set`-Funktion des State Stores:

```js
/**
    *
    * @param {*} base - assoziierter ui-base node
    * @param {*} Knoten - das Node-RED node Objekt, das wir speichern für
    * @param {*} msg - die vollständige erhaltene msg (erlaubt es uns, auf Credentials/socketid Conditions) zu überprüfen)
    * @param {*} prop - die Eigenschaft, die wir auf dem Knoten
    einstellen * @param {*} Wert - der Wert, den wir setzen
*/
gesetzt (base, base, node, msg, prop, value) {
    if (canSaveInStore(base, node, msg)) {
        if (! tate[node.id]) {
            state[node.id] = {}
        }
        state[node.id][prop] = value
    }
},
```

Zum Beispiel in `ui-dropdown`:

```javascript
const evts = {
    onChange: true
    beforeSend: function (msg) {
        if (msg. i_update) {
            const update = msg. i_update
            wenn (Typ update. ptions ! = 'undefined') {
                // dynamisch setzen "options" Eigenschaft
                statestore. et(group.getBase(), node, msg, 'options', update. ptions)
            }
        }
        return msg
    }
}

// Melden Sie das Dashboard-UI an, dass wir diesen Knoten
Gruppe hinzufügen. egister(node, config, evts)
```

#### Client-Seite

Nun, da wir die serverseitige Aktualisierung haben, wird die komplette `ui-config` bereits die dynamischen Eigenschaften enthalten.

Wir müssen dann sicherstellen, dass der Client sich dieser dynamischen Eigenschaften _so bewusst ist, wie sie sich ändern_. Um dies zu tun, können wir das `onDynamicProperties` Event im [Data Tracker](#data-tracker) verwenden.

Ein gutes Muster zu folgen ist eine `computed` Variable für die betreffende Komponente. Wir bieten dann drei hilfreiche, globale Funktionen:

- `setDynamicProperties(config)`: Die bereitgestellten Eigenschaften (in `config`) werden dem Widget im Client-side Store zugewiesen. Dies aktualisiert automatisch den Status des Widgets und alle Referenzen, die diese Eigenschaft verwenden.
- `updateDynamicProperty(property, value)`: Aktualisiert die relevante `property` mit dem angegebenen `value` im Client-side Store. Wird auch sicherstellen, dass die Eigenschaft ist nicht vom Typ `undefiniert`. Dies aktualisiert automatisch den Status des Widgets und alle Referenzen, die diese Eigenschaft verwenden.
- `getProperty(property)`: Der korrekte Wert für die angeforderte Eigenschaft wird automatisch ermittelt. Wird zuerst in die dynamischen Eigenschaften schauen und falls nicht gefunden, wird die statische Konfiguration im [`ui-config` Event definiert](../guides/events.md#ui-config).

Die berechneten Variablen können die `this.getProperty` Funktion umwandeln, die im zentralisierten vuex Store immer auf dem neuesten Stand ist.

```js
{
    // ...
    berechnet: {
        label () {
            gibt dies zurück. etProperty('label')
        }
    },
    created () {
        // we can define a custom onDynamicProperty handler for this widget
        useDataTracker(this. d, null, null, this.onDynamicProperty)
    // . .,
    Methoden () {
        // . .,
        onDynamicProperty (msg) {
            // Standardmethode, um Updates via msg zu akzeptieren. i_update
            const updates = msg. i_update
            // global verfügbare API verwenden, um die dynamische Eigenschaft
            zu aktualisieren. pdateDynamicProperty('label', updates.label)
        }
    }
}

```

### Dokumentation wird aktualisiert

Es gibt zwei wichtige Orte um sicherzustellen, dass die Dokumentation beim Hinzufügen dynamischer Eigenschaften aktualisiert wird:

#### Online-Dokumentation:

Jeder Knoten wird eine entsprechende `/docs/nodes/widgets/<node>.md`-Datei haben, die die Definition der `dynamic` Tabelle im Frontmatter erlaubt, z. B.:

```yaml
dynamisch:
    Optionen:
        payload: msg.options
        Struktur: ["Array<String>", "Array<{value: String}>", "Array<{value: String, label: String}>"]
    Klasse:
        payload: msg.class
        Struktur: ["String"]
```

Sie können diese Tabelle dann in die Dokumentation rendern mit:

```md
## Dynamische Eigenschaften

<DynamicPropsTable/>
```

#### Editor-Dokumentation:

Jeder Knoten wird eine entsprechende `/locales/<locale>/<node>.html` Datei haben, die eine Tabelle mit dynamischen Eigenschaften enthalten sollte, z. B.:

```html
<h3>Dynamic Properties (Inputs)</h3>
<p>Any of the following can be appended to a <code>msg.</code> in order to override or set properties on this node at runtime.</p>
<dl class="message-properties">
    <dt class="optional">options <span class="property-type">array</span></dt>
    <dd>
        Change the options available in the dropdown at runtime
        <ul>
            <li><code>Array&lt;string&gt;</code></li>
            <li><code>Array&lt;{value: String}&gt;</code></li>
            <li><code>Array&lt;{value: String, label: String}&gt;</code></li>
        </ul>
    </dd>
    <dt class="optional">class <span class="property-type">string</span></dt>
    <dd>Add a CSS class, or more, to the Button at runtime.</dd>
</dl>
```

### Debuggen von dynamischen Eigenschaften

Dashboard 2.0 kommt als [Debug View](/contributing/widgets/debugging.html), das ein [Spezial-Panel](/contributing/widgets/debugging.html#dynamic-properties) enthält, um dynamische Eigenschaften zu überwachen, die einem Widget zugewiesen sind. Dies kann ein sehr nützliches Werkzeug sein, um zu überprüfen, ob dem Client irgendwelche dynamischen Eigenschaften bekannt sind, die gesendet wurden.