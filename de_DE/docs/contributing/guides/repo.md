---
description: Verstehen Sie die Repository-Struktur des Node-RED Dashboard 2.0 für ein besseres Code-Management und einen besseren Beitrag.
---

# Repository-Struktur

Der Zweck dieser Seite ist es, einen Überblick über Dashboard 2 zu geben. ist so strukturiert, dass Sie besser durch das Projektarchiv navigieren und effektiv beitragen können.

## Kernordner

Das Projektarchiv enthält zwei primäre Ordner:

### /nodes

Das Verzeichnis `/nodes` enthält die Sammlung von Node-RED-Knoten, die im Node-RED-Editor verfügbar sind. Diese Knoten sind für die Handhabung der Konfiguration des Dashboards verantwortlich, welche Widgets angezeigt werden, und für das Senden und Empfangen von Ereignissen an und vom Dashboard, basierend auf ihrer Konfiguration innerhalb des Node-RED-Editors.

### /ui

Dieser Ordner enthält unsere Vue.js Anwendung. Dies kann mit `npm run build` gebaut werden, und die Ausgabe dieses Builds wird dann in das `/dist` Verzeichnis kopiert, wo es von Node-RED bedient wird.

