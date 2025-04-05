---
description: Comprendere la struttura del repository della Dashboard 2.0 Node-RED per una migliore gestione del codice e un migliore contributo.
---

# Struttura Repository

Lo scopo di questa pagina è quello di dare una panoramica di come Dashboard 2. è strutturato in modo da poter navigare meglio intorno al repository e contribuire in modo efficace.

## Cartelle Core

Il deposito contiene due cartelle primarie:

### /nodes

La directory `/nodes` contiene la collezione di nodi Node-RED disponibili all'interno dell'editor Node-RED. Questi nodi sono responsabili della gestione della configurazione del cruscotto, che i widget sono mostrati, e per l'invio e la ricezione di eventi da e verso la Dashboard, in base alla loro configurazione all'interno dell'editor Node-RED.

### /ui

Questa cartella contiene la nostra applicazione Vue.js. Questo può essere costruito usando `npm run build`, e l'output di questa build viene poi copiato nella directory `/dist`, dove viene servito da Node-RED.

