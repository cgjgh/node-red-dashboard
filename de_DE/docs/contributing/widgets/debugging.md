---
description: Effiziente Strategien und Tipps für das Debuggen Ihrer Node-RED Dashboard 2.0 Setups, um einen reibungslosen Betrieb zu gewährleisten.
---

# Debugging Dashboard 2.0

Dashboard 2.0 enthält ein integriertes Debugging-Tool, um die Daten zu verstehen, die für jedes Dashboard, Seite, Design, Gruppe und Widget konfiguriert werden.

Um zum Werkzeug zu navigieren, gehen Sie zu `<your-host>:<your-port>/dashboard/_debug`.

![Debugging tool](/images/debug-example.png "Debugging Tool"){data-zoomable}
_Screenshot des Dashboard 2.0 Debugging Tool_

Dieses Werkzeug ist besonders nützlich, wenn Sie Ihre eigenen benutzerdefinierten Integrationen erstellen und auch auf Kern-Dashboard-Widgets entwickeln.

Wir hoffen, einen Teil des Umfangs der Werkzeuge zu erweitern, die diese Werkzeuge bietet, aber vorerst wird es die aktuellen `props` für ein bestimmtes Widget anzeigen, , die durch Node-RED Konfiguration definiert ist, aber auch die überschriebenen Werte aus dem `msg` Objekt (e. . `msg.options` kann die Eigenschaft `Options` für ein `ui-dropdown` überschreiben.

## Nachrichtenverlauf

![Debugging tool](/images/debug-example-datastore.png "Debugging-Tool"){data-zoomable}
_Screenshot der Registerkarte "Nachrichtenhistorie" für ein Widget_

Dieser Tab zeigt die neuesten `msg` Werte an, die der zugehörige Knoten in Node-RED's `datastore` für ein bestimmtes Widget erhalten hat.

Dies ist nützlich, um zu verstehen, welche Daten geladen werden, wenn sich ein neuer Client mit Node-RED verbindet. Es wird aktualisiert werden müssen, um den neuesten Zustand wiederzugeben, wenn Sie neue Nachrichten erwarten, seit das Debug-Tool zuletzt geöffnet wurde.

## Dynamische Eigenschaften

![Debugging tool](/images/debug-example-statestore.png "Debugging-Tool"){data-zoomable}
_Screenshot der Registerkarte "Dynamische Eigenschaften" für ein Widget_

Diese Registerkarte zeigt alle dynamischen Eigenschaften an (Eigenschaften, die mit einer Injektion eines `msg gesetzt wurden.<property>`, die seit der Ausführung des Node-RED-Servers gesetzt wurden. Innerhalb unserer serverseitigen Architektur werden diese in unserem `statestore` gespeichert.

Diese Werte überschreiben in der Regel die Standardeinstellungen, die im Node-RED-Editor gesetzt werden und kann verwendet werden, um zu überprüfen, warum ein bestimmtes Widget die Art und Weise wiedergibt, wie es funktioniert.