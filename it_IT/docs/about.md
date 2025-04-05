---
description: Scopri le scelte della tecnologia Dashboard 2.0
---

# Informazioni Su Node-RED Dashboard 2.0

Benvenuto nella documentazione per la Dashboard Node-RED 2.0, il successore dell'originale, e molto popolare, [Node-RED Dashboard](https://flows.nodered.org/node/node-red-dashboard).

Questo progetto è stato formato da [FlowFuse](https://flowfuse.com/), come parte degli sforzi per aggiornare il cruscotto originale per sterzare lontano da Angular v1. che è stato a lungo deprecato. Puoi leggere la nostra dichiarazione completa su _perché_ stiamo costruendo Dashboard 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/).

## Tecnologie

### Node-RED

[Node-RED](https://nodered.org/) è uno strumento di programmazione basato sul flusso, originariamente sviluppato dal team di IBM Emerging Technology Services e ora parte della JS Foundation. Fornisce un editor basato sul browser che rende facile collegare insieme i flussi utilizzando l'ampia gamma di nodi nella tavolozza che può essere distribuito al suo runtime in un solo clic.

### Vue.js v3.0

[Vue.js](https://vuejs.org/) è un framework JavaScript progressivo e gradualmente adottabile per la costruzione dell'interfaccia utente sul web. Si tratta di una scelta popolare per la costruzione di applicazioni web moderne.

Abbiamo scelto Vue.js sopra altri quadri popolari come React e Angular a causa della sua curva di apprendimento poco profonda, e la facilità di utilizzo/leggibilità per gli sviluppatori non-front-end.

Utilizziamo anche la [Vuetify component library](https://vuetifyjs.com/en/components/all/), che è un framework per componenti Material Design per Vue.js. Esso mira a fornire componenti puliti, semantiche e riutilizzabili che rendono la costruzione della vostra applicazione una brezza.

### Socket IO

[Socket.IO](https://socket.io/) consente la comunicazione in tempo reale, bidirezionale e basata su eventi. Funziona su ogni piattaforma, browser o dispositivo, concentrandosi ugualmente su affidabilità e velocità.

In Dashboard 2.0 utilizziamo Socket IO per comunicare tra Node-RED e Dashboard UI.
