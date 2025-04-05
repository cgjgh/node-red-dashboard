---
description: Impara come utilizzare il layout fisso nella Dashboard 2.0 Node-RED per i disegni di dashboard statici e stabili.
---

# Layout: Fisso

_Nota: Questo layout ha ancora bisogno di lavoro per renderlo più flessibile e pratico, si consiglia di utilizzare un altro layout per ora._

Ogni "unità" è una larghezza fissa, che era l'unico layout disponibile nella Dashboard 1.0.

È costruito come layout flexbox, con una singola riga di widget. La larghezza di ciascun gruppo è una dimensione di pixel fissa, calcolata come proprietà "larghezza" di un gruppo, moltiplicato per 90px (dove la nostra altezza di riga predefinita è 45px).

I gruppi stessi seguono lo stesso schema di tutti gli altri layout per cui un gruppo di larghezza "6" avrebbe 6 "colonne", con i widget dimensionati di conseguenza, il widget di dimensione "3 x 1" sarebbe il 50% della larghezza del gruppo.

Si sposterà automaticamente i widget alla riga successiva se non si adattano a una determinata larghezza dello schermo, e non cambia le dimensioni con le dimensioni dello schermo, che spesso lascia un sacco di immobili a schermo vuoto. L'altezza di ogni riga è determinata dal widget più alto di quella riga.

![Fixed Layout](../../assets/images/layout-eg-flex.png){data-zoomable}
_Un esempio UI renderizzato utilizzando il layout "Fixed"_

## Breakpoint

Sotto 576px, I layout fissi verranno resi in modalità reattiva per supportare il rendering mobile. Qui, in realtà diventano [Grid](./grid.md) layout, la larghezza di ciascun gruppo è calcolata come una porzione di 3 colonne, piuttosto che come una dimensione di pixel fissa.