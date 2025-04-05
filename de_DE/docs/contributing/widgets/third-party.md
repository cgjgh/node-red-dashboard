---
description: Erweitern Sie Node-RED Dashboard 2.0 mit Widgets von Drittanbietern. Erfahren Sie, wie Sie sie bauen und integrieren können.
---

<script setup>
    Import hinzugefügt von '../../components/AddedIn.vue'
</script>

# Erstelle Drittanbieter-Widgets <AddedIn version="0.8.0" />

Ein einzelnes Widget besteht aus zwei Schlüsselelementen:

1. Ein Knoten-RED-Knoten, der in der Palette des Node-RED-Editors angezeigt wird
2. `.vue` und Client-seitigen Code, der das Widget in ein Dashboard verwandelt

Sie können unsere Sammlung von Kern-Widgets [here](../../nodes/widgets.md). Wenn Sie eine Idee für ein Widget haben, das Sie in Dashboard 2 erstellen möchten. wir sind offen für Pull Requests und du kannst mehr in unserem [Adding Core Widgets](./core-widgets.md) Guide lesen.

Wir erkennen aber auch, dass es viele Gelegenheiten gibt, bei denen ein eigenständiges Repository/Paket besser funktioniert, wie es in Dashboard 1.0 sehr beliebt war.

## Empfohlenes Lesen

Auf der linken Seite der Navigation finden Sie einen Abschnitt "Nützliche Anleitungen", wir empfehlen einen Blick auf diese zu werfen, da sie einen guten Überblick über die Struktur des Dashboard 2 geben. Codebase und einige der zugrunde liegenden architektonischen Prinzipien, auf denen er aufgebaut ist.

Insbesondere wird Folgendes empfohlen:

- [Ereignisarchitektur](/contributing/guides/state-management.html)
- [State Management](/contributing/guides/state-management.html)

## Wie Widgets geladen werden

Dashboard 2.0 ist auf [VueJS](https://vuejs.org/) gebaut und als solches müssen alle Widgets einer Vue Komponente zugeordnet werden. Der Prozess funktioniert wie folgt:

1. Dashboard 2.0 Client verbindet sich mit Node-RED
2. Node-RED sendet `ui-config` Objekt-Kontianing-Details aller Seiten, Themes, Gruppen & Widgets
3. Im Ereignis-Handler schleifen wir alle Widgets in der `ui-config`:
   - Wenn das Widget `type` zu einer Kernkomponente passt, ordnen wir es dieser Komponente zu
   - Wenn das Widget ein Drittanbieter-Widget ist, laden wir die entsprechende Datei `.umd.js`, die im Ordner `/resources` des Widgets sichtbar ist.
4. Dashboard 2.0 lädt das entsprechende Layout (z.B. Grid, Fixed oder Notebook) abhängig von der aktiven URL/Seite.
5. Innerhalb dieses Layout-Managers schleifen wir die Widgets an und rendern ihre jeweiligen Vue Komponenten.
   - Jede Komponente wird `id`, `props` und `state` des Widgets übergeben.

## Erste Schritte

Wir haben ein [Beispiel-Knoten-Repository](https://github.com/FlowFuse/node-red-dashboard-example-node) erstellt, das Grundlagen für dein Widget bereitstellt. Es enthält viele Beispiele für Funktionen, die Sie wahrscheinlich benötigen.

Das Basis-Repository hat folgende Datei/Ordnerstruktur:

Wie bei jedem Knotenpunkt müssen Sie mit zwei Dateien beginnen:

- `/nodes/ui-example.html` - definiert die Eigenschaften des Knotens, bearbeiten Sie UI und Hilfetext.
- `/nodes/ui-example.js` - definiert das serverseitige Verhalten des Knotens

Jedes Widget muss dann den Client-seitigen Code definiert haben, der die Kontrolle _how_ des Widgets in einem Dashboard darstellt. Jeder Inhalt innerhalb von `/ui` wird in eine `.umd.js`-Datei verpackt, die das Dashboard zur Laufzeit lädt.

- `/ui/components/` - Ordner mit `.vue` Dateien für alle Vue Komponenten, die du benötigst
- `/ui/index.js` - Exportiert alle Vue Komponenten, die in Dashbaord 2.0 importiert werden müssen

Konfiguration des Knotens und der Widgets werden über zwei Dateien gesteuert:

- `vite.config.js` - enthält die Details, was in die von Widget gebaute `.umd.js`-Datei paketiert werden soll.
- `package.json` - muss einen `node-red-dashboard-2` Abschnitt enthalten, der die Widgets definiert, die Dashboard importieren kann.

### Lokale Entwicklung

Um mit der Arbeit mit Ihrem eigenen Drittanbieter-Widget zu beginnen, lokal auf Ihrem Rechner:

#### Knoten & Dashboard installieren

1. Knoten installieren ([docs](https://nodered.org/docs/getting-started/local))
2. Installieren Sie `@flowfuse/node-rod-dashboard` in Knoten-RED über die Option "Palette verwalten".

#### UI-Beispielknoten installieren

1. Fork unser [Beispielknoten-Repository](https://github.com/FlowFuse/node-red-dashboard-example-node) und klone es lokal auf deinem Computer.
2. Im Beispiel-Knoten-Verzeichnis installieren Sie die erforderlichen Abhängigkeiten:

      npm install
3. Optional erstellen Sie eine Quellkarte (um den minifizierten Code dem Originalcode zuzuordnen), um das Debuggen des Frontend-Codes im Browser zu vereinfachen.  Unter Linux kann dies erreicht werden von:

      exportiere Knoten_ENV=Entwicklung
4. Innerhalb des Beispielknoten-Verzeichnisses erstellen Sie das Beispiel-Knoten-Verzeichnis `.umd. s`-Datei (was Node-RED verwendet, um dein Widget auszuführen), wird dies seinen `/resources`-Ordner erzeugen, der von Node-RED geladen wird.

      npm Ausführung

#### UI-Beispiel in Node-RED installieren

1. Navigieren Sie zu Ihrem lokalen Knoten-ROD-Verzeichnis:

       cd ~/.node-rot
2. Lokale Kopie des Beispielknotens installieren:

      npm install /path/zu/Ihr/local/node-red-dashboard-example-node-folder
3. Node-ROD neu starten

_Hinweis: Alle lokalen Änderungen, die du im `/ui`-Ordner des Drittanbieter-Widgets vornimmst, du musst `npm run build` erneut ausführen, um die `umd zu aktualisieren. s`-Datei, welche das Dashboard lädt um das Widget zu rendern

## Konfiguriere dein Widget

### Benennen des Widgets

Um externe Widgets in den Dashboard-Kern zu importieren, liest der `ui-base` Konfigurationsknoten des Node-RED das `package. son` und prüft alle Pakete, die in Node-RED mit `node-red-dashboard-2-` im Paketnamen installiert wurden.

Wenn du deine eigene Integration definierst, stelle bitte sicher, dass sie angemessen benannt ist:

```json
"Name": "node-rod-Dashboard-2-<your-widget-name>"
```

### Definiere dein Widget

In deinem eigenen `package.json` musst du einen `node-red-dashboard-2` Abschnitt definieren, der dann Dashboard _how_ anweist, dein Widget zu laden. Ein Beispiel von `ui-example` ist wie folgt:

```json
"node-rod-dashboard-2": {
    "version": "0.8.0", // die minimale Version von Dashboard 2. unterstützt
    "Widgets": {
        "ui-example": { // dieser Schlüssel muss dem "type" Ihres Widgets entsprechen, registriert in Node-RED
            "output": "ui-example. d. s", // der Name der gebauten .js-Datei, die in das Dashboard importiert wird, konfiguriert in vite.config. s
            "component": "UIExample" // der Name der primären Vue Komponente, die als Widget in Dashboard
        }
    }
}
```

### Ihren Knoten & Widget registrieren

_Mehr Details: [Registration](../guides/registration.md)_

Traditionell müssen Sie Ihren Knoten mit `RED.nodes registrieren. egisterType("ui-example", UIExampleNode)`, das ist bei Dashboard immer noch der Fall, aber Sie müssen auch _also_ das Widget mit dem Dashboard registrieren.

Die Dashboard-Registrierung wird auf einer `.register()` Funktion aufgebaut (siehe [docs](../guides/registration.md)). Diese Funktion steht allen `ui-base`, `ui-page` oder `ui-group` zur Verfügung. Für `ui-group` und `ui-page` brokert es die Funktion bis zur `ui-base`, in der ein Shop von allen Widgets im Dashboard gewartet wird.

Ihr Widget sollte eines als Eigenschaft in Ihrem Knotenknoten definieren, höchstwahrscheinlich Es wird `ui-group` sein, wenn Sie möchten, dass Ihr Widget eine Gruppe im Dashboard darstellt.

In Ihrer `/nodes/ui-example.js` Datei:

```js
module.exports = function(RED) {
    function UIExampleNode(config) {
        RED.nodes. reateNode(this, config);
        var node = this;

        // welche Gruppe wir dieses Widget
        const group = RED wiedergeben. odes.getNode(config. roup)

        /**
         * Weitere Konfiguration & Einrichtung, um hierher zu gehen
         */

        // das Widget mit Dashboard
        Gruppe registrieren. egister(node, config, evts)
    }
    // Registrieren Sie den Knoten mit Node-RED
    RED. odes.registerType("ui-Beispiel", UIExampleNode);
}
```

## Anleitungen

Die folgenden sind Anleitungen und Beispiele zum Erstellen von Widgets von Drittanbietern. Wir haben auch den Abschnitt "Nützliche Anleitungen" in der linken Navigation, der mehr allgemeine Entwicklungsanleitungen liefert, wenn Sie zum Dashboard 2.0 beitragen.

### Die Grundlagen von VueJS

Beachten Sie, dass eine Menge von Entwicklern, die einen Beitrag zu Dashboard 2 leisten wollen. , kann neu bei VueJS sein, also haben wir hier ein paar Grundlagen beschrieben.

Es ist seit VueJS sehr üblich, Vue Anwendungen mit der "Composition API" zu sehen, während dies eine leichtere Gewichtsart für den Aufbau Ihrer Anwendungen ist es ist nicht die intuitivste für diejenigen, die mit VueJS nicht vertraut sind, da wir daher meist die "Options API"-Struktur im Dashboard 2 verwenden. und in unseren Beispielen für Lesbarkeit.

Mit der Options-API hat eine Vue Komponente die folgende Struktur:

```vue
<template>
    <!-- HTML Template für die Komponente -->
    <! - Sie können alle auf Ihren Komponenten definierten Variablen direkt hier referenzieren, z.B. -->
    <div>{{ myVar }}</div>
</template>

<script>
Export Standard {
    // alle Eigenschaften, die an die Komponente
    übergeben werden // im Dashboard 2. , diese 3 sind die bereitgestellt:
    props: ['id', 'props', 'state'],
    // Alle Daten, die Sie reaktiv sein möchten und in Ihrer Komponente
    // innerhalb der <script> referenzieren diese Variablen darauf.<myVar>
    // innerhalb des HTML, Sie brauchen nicht das "dies. prefix
    data () {
        return {
            myVar: 'Hello World'
        }
    },
    // Berechnete Eigenschaften sind Variablen, die automatisch aktualisiert werden, wenn ihre Abhängigkeiten sich ändern
    berechnet: {
        myComputedProp () {
            gibt dies zurück. yVar + '!
        }
    },
    // alle Methoden, die innerhalb der Komponente
    Methoden verwendet werden: {
        myMethod () {
            alert(this). yVar)
        }
    },
    // Läuft, wenn die Komponente gebaut und in das DOM
    mountet () {
        alert('Komponente hat mounted')
    },
    // Läuft, wenn die Komponente entfernt wird
    unmounted () {
        alert('Komponente wurde entfernt')
    }
}
</script>

<style>
/* beliebige CSS-Styling für die Komponente */
</style>
```

### Vuetify Komponenten verwenden

Sie können bei der Definition Ihrer Widgets vollständige, benutzerdefinierte HTML/CSS definieren aber wir haben auch native Unterstützung für alle [Vuetify's Component Library](https://vuetifyjs.com/en/components/all/) bereitgestellt, um mit einer Vielzahl von UI-Komponenten loszulegen, die Sie verwenden möchten.

### Zugriffseigenschaften

Wenn Widgets in einem Dashboard-Layout dargestellt werden, übergeben sie eine kleine Sammlung von Eigenschaften, die verwendet werden können, um das Verhalten des Widgets anzupassen:

| objekt  | beschreibung                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`    | Die ID des Widgets, die von Node-RED zugewiesen wurde                                                                     |
| "props" | Die in Node-RED definierten Eigenschaften, z.B. `this.props.name` oder `this.props.group` |
| Status  | Der Status des Widgets, z.B. `this.state.enabled` oder `this.state.visible`               |

Wenn Sie diese in Ihrer eigenen Vue Komponente wiedergeben, können Sie auf sie wie folgt zugreifen:

```vue
<template>
    <div>ID: {{ id }}</div>
    <div>Name: {{ props.name }}</div>
    
    <div>Gruppe: {{ props.group }}</div>
</template>

<script><script>
Export Standard {
    props: ['id', 'props', 'state'],
    mountet () {
        // läuft bei Laden des Widgets
        Alarm(dies. d)
    }
}
</script>
```

### Kommunikation mit Node-RED

Events werden zwischen Node-RED und Dashboard 2.0 mit SocketIO hin und her geschickt. Eine vollständige Aufschlüsselung dieser Ereignisse finden Sie in unserem [Veranstaltungsarchitektur](../guides/events.md) Leitfaden .

#### Empfange Node-ROD Nachrichten

Wenn dein Knoten einen `msg` in Node-RED erhält, erhält der Dashboard 2.0 Client ein `msg-input` Event über SocketIO. Sie können dieses Ereignis innerhalb der Vue Komponente Ihres eigenen Widgets abonnieren mit:

```js
export Standard {
    props: ['id', 'props', 'state'],
    // Rest Ihrer vue Komponente hier
    mounted () {
        dies.$socket.on('msg-input' + dies. d, (msg) => {
            // mit dem msg
        })
    },
    Unmounted () {
        // Abmelden des Ereignisses, wenn das Widget zerstört wurde
        .$socket.off('msg-input:' + this.id)
    
    }
}
```

Es wird empfohlen, unseren eingebauten [Data Tracker](../widgets/core-widgets.md#data-tracker) zu verwenden, um die Standard-Ein-/Load-Ereignisse für dein Widget einzurichten. Dies kann durch einen Aufruf der folgenden Datei in der `.vue`-Datei deines Widgets geschehen:

```js
Standard exportieren {
    Injektion: ['$dataTracker'],
    // Rest Ihrer vue Komponente hier
    erstellt () {
        dies.$dataTracker(das. d)
        // Wir können die Standardereignisse überschreiben, wenn wir mit
        // dies wollen.$dataTracker(this.id, myOnInputFunction, myOnLoadFunction, myOnDynamicPropertiesFunction)
    }
}
```

Weitere Details zur Anpassung des Data Tracker finden Sie [here](../widgets/core-widgets.md#custom-behaviours).

#### Node-ROD Nachrichten senden

Du kannst eine `msg` an alle verbundenen Knoten in Node-RED senden, indem du eines der folgenden Ereignisse über SocketIO aufrufst:

- `dies.$socket.emit('widget-action', this.id, msg)`: sendet jedes `msg` an alle verbundenen Knoten im Node-RED.
- `dies.$socket.emit('widget-change', das. d, msg)`: das gleiche wie `widget-action`, aber _also_ speichert die neueste Nachricht im Node-RED Datenspeicher für dieses Widget, so dass der Status wiederhergestellt werden kann, wenn das Dashboard aktualisiert wird.

#### Eigene SocketIO-Ereignisse

Wenn du deine eigenen SocketIO-Ereignisse und -Handler implementieren möchtest, kannst du dies in deiner `.vue` Komponente tun mit:

```js
das.$socket.emit('my-custom-event', this.id, msg)
```

Dann, wo du deinen Knoten mit Dashboard auf der Serverseite registriert hast (innerhalb der `.js`-Datei), kannst du den relevanten Ereignishandler definieren:

```js
evts = {
    onSocket: {
        // benutzerdefinierte Ereignisse
        'my-custom-event' abonnieren: Funktion (conn, id, msg) {
            // emit a msg in Node-RED from this node
            node. end(msg)
        }
    }
}
group.register(node, config, evts)
```

### Datenspeicherung & Datenspeicherung

Wir verwenden das Konzept der Datenspeicherung sowohl auf der Client- als auch Serverseite von Dashboard 2.0. Diese werden zur Zentralisierung der Speicherung des neuesten Zustands und der Daten, die einem Widget zugeordnet sind, verwendet.

Datenspeicher sind eine Zuordnung der Widget/Knoten-ID zu den neuesten Daten in diesem Widget. Dies wird am häufigsten verwendet, um den Status wiederherzustellen, wenn das Dashboard aktualisiert wird.

#### Node-ROD Datenspeicher

Der Datenspeicher von Node-RED wird über die zugehörige »ui-base« für Widgets Dritter zugänglich gemacht.

Um dies in der `.js`-Datei deines Widgets zu erreichen, kannst du verwenden:

```js
const group = RED.nodes.getNode(config.group)
const base = group.getBase()
```

Wann immer Sie Daten im Datenspeicher speichern möchten, können Sie dies tun mit:

```js
base.stores.data.save(base, node, msg)
```

Lesen Sie mehr über den Node-RED Datenspeicher in unserer [State Management](../guides/state-management.md) Anleitung.

#### Node-ROD State Store

Status bezieht sich auf alle Eigenschaften Ihres Widgets, die sich in der Laufzeit geändert haben und von dieser im Node-RED-Editor abweichen.

Zum Beispiel kann das `ui-dropdown` seine `options` überschreiben lassen und eine `msg.options` Nachricht an den Knoten senden. Diese Aktualisierungen `options` würden gegen den Knoten im State Store gespeichert.

#### Client-Side Data Store

In der Client-Seite von Dashboard 2.0 verwenden wir VueX, um den zentralisierten Zustand einer Benutzeroberfläche zu verwalten.

Mit VueX kannst du `mapState` aufrufen, der den Shop automatisch an deine Vue Komponente bindet, z. B.:

```vue
<template>
    <! - Abrufen der neuesten Werte aus dem Widget mit <id> -->
    {{ messages[id] }}
</template>
<script>
// MapState importieren aus VueX
Import { mapState } aus 'vuex'

Export Standard {
    props: ['id', 'props', 'state'],
    // ... Rest Ihrer Komponente hier
    berechnet: {// ordnen Sie die Nachrichten des Shops unserer eigenen Vue Komponente
        ... apState('data', ['messages'])
    },
    mounted () {
        // informiert die aktuellste Meldung beim Laden des Widgets
        Alarm(this). Aufsätze[this.id])
    }
}
</script>
```

Dann, um Daten zum Shop hinzuzufügen:

```js
das.$store.commit('data/bind', {
    widgetId: this.id,
    msg
})
```

#### Ladezustand

Wenn das Dashboard 2.0 geladen wird, sendet es ein "Widget-load"-Ereignis an alle Widgets im Dashboard. Dies enthält den neuesten Wert des Node-RED Datenspeichers. Sie können dieses Ereignis in Ihrem Widget abonnieren mit:

```js
export Standard {
    props: ['id', 'props', 'state'],
    // Rest Ihrer Komponente hier
    mounted () {
        dies.$socket.on('widget-load' + das. d, (msg) => {
            // mit dem msg
        })
    },
    Unmounted () {
        // Abmelden des Ereignisses, wenn das Widget zerstört wurde
        .$socket.off('widget-load:' + this.id)
    
    }
}
```

### Styling mit Vuetify & CSS

Wir können unser eigenes CSS innerhalb des Widget-Repositorys definieren und es in eine `.vue`-Komponente importieren:

```vue
<style scoped>
.ui-example-wrapper {
    padding: 10px;
    Rand: 10px;
    Rand: 1px solid black;
}
</style>
```

Vuetify enthält auch eine Handvoll von Utility-Klassen, um beim Styling zu helfen, die alle außerhalb der Box verwendet werden können:

- [Responsive Displays](https://vuetifyjs.com/en/styles/display/#display)
- [Flex](https://vuetifyjs.com/en/styles/flex/)
- [Spacing](https://vuetifyjs.com/en/styles/spacing/#how-it-works)
- [Text & Typographie](https://vuetifyjs.com/en/styles/text-and-typography/#typography)

### Externe Abhängigkeiten

Dein Widget kann eine beliebige Anzahl von `npm` Abhängigkeiten haben. Diese werden alle in die `.umd.js`-Datei gebündelt, die das Dashboard zur Laufzeit lädt.

In `ui-example` haben wir eine Abhängigkeit von `to-title-case`, die wir in unsere Vue Komponente importieren und in diese einfügen:

```js
import toTitleCase aus 'to-title-case'

export default {
    // rest of component here
    computed: {
        titleCase () {
            return toTitleCase(this). nput.title)
        }
    }
}
```

Sie können auch andere Vue Komponenten aus Ihrem eigenen Repository laden, wie bei jeder VueJS Komponente.
