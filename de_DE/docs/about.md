---
description: Erfahren Sie mehr über Dashboard 2.0 Technologieauswahl
---

# Über Node-RED Dashboard 2.0

Willkommen in der Dokumentation für das Node-RED Dashboard 2.0, den Nachfolger des Originals und sehr beliebt [Node-RED Dashboard](https://flows.nodered.org/node/node-red-dashboard).

Dieses Projekt wurde von [FlowFuse](https://flowfuse.com/) gebildet, als Teil der Bemühungen, das ursprüngliche Dashboard zu verbessern, um von Winkelv1 fernzuhalten. die seit langem veraltet ist. Du kannst unsere vollständige Aussage über _warum_ lesen, wir bauen Dashboard 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/).

## Technologien

### Knoten Rot

[Node-RED](https://nodered.org/) ist ein flussbasiertes Programmierwerkzeug, das ursprünglich vom IBM-Emerging Technology Services Team und jetzt Teil der JS Foundation entwickelt wurde. Es stellt einen browserbasierten Editor zur Verfügung, der die Zusammenführung von Strömen mit Hilfe der großen Bandbreite von Knoten in der Palette vereinfacht, die mit einem Klick zur Laufzeit eingesetzt werden kann.

### Vue.js v3.0

[Vue.js](https://vuejs.org/) ist ein progressives, schrittweises JavaScript-Framework, um UI im Web zu erstellen. Es ist eine beliebte Wahl für den Aufbau moderner Web-Anwendungen.

Wir wählten Vue.js gegenüber anderen populären Frameworks wie React und Winkeln, wegen seiner flachen Lernkurve und der einfachen Bedienung/Lesbarkeit für Nicht-Front-End-Entwickler.

Wir verwenden auch die [Vuetify component library](https://vuetifyjs.com/en/components/all/), die ein Material Design Komponente Framework für Vue.js. Es zielt darauf ab, saubere, semantische und wiederverwendbare Komponenten zur Verfügung zu stellen, die den Aufbau Ihrer Anwendung zu einer Kinderlähmung machen.

### Socket IO

[Socket.IO](https://socket.io/) ermöglicht Echtzeit, bidirektionale und ereignisbasierte Kommunikation. Es arbeitet auf jeder Plattform, jedem Browser oder jedem Gerät und konzentriert sich dabei gleichermaßen auf Zuverlässigkeit und Geschwindigkeit.

In Dashboard 2.0 verwenden wir Socket IO zur Kommunikation zwischen Node-RED und dem Dashboard UI.
