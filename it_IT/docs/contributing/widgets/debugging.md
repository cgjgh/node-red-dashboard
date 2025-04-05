---
description: Strategie e suggerimenti efficaci per il debug delle impostazioni 2.0 della Dashboard Node-RED per garantire un funzionamento fluido.
---

# Debug Dashboard 2.0

Dashboard 2.0 è dotato di uno strumento di debug integrato per comprendere i dati configurati per ogni dashboard, pagina, tema, gruppo e widget.

Per navigare nello strumento, vai a `<your-host>:<your-port>/dashboard/_debug`.

![Strumento di debug](/images/debug-example.png "Strumento di debug"){data-zoomable}
_Schermata dello strumento di debug Dashboard 2.0_

Questo strumento è particolarmente utile quando si sta costruendo le proprie integrazioni personalizzate e sviluppando anche i widget Dashboard di base.

Speriamo di far crescere una parte della portata di ciò che questo strumento fornisce, ma per ora, mostrerà il file `props` corrente per un dato widget, che è definito dalla configurazione Node-RED, ma includerà anche i valori overriden dall'oggetto `msg` (e. . `msg.options` può sovrascrivere la proprietà `Options` per un `ui-dropdown`).

## Cronologia Messaggi

![Strumento di debug](/images/debug-example-datastore.png "Strumento di debug"){data-zoomable}
_Schermata della scheda "Cronologia messaggi" per un widget_

Questa scheda mostrerà gli ultimi valori `msg` che il nodo associato ha ricevuto nel `datastore` di Node-RED per un dato widget.

Questo è utile per capire quali dati caricheranno quando un nuovo client si connette a Node-RED. Sarà necessario aggiornare per riflettere lo stato più recente se ti aspetti nuovi messaggi dall'ultima apertura dello strumento di debug.

## Proprietà Dinamiche

![Strumento di debug](/images/debug-example-statestore.png "Strumento di debug"){data-zoomable}
_Schermata della scheda "Proprietà dinamiche" per un widget_

Questa scheda mostra tutte le proprietà dinamiche (set di proprietà con un'iniezione di un `msg.<property>` che sono stati impostati da quando il server Node-RED è in esecuzione. All'interno della nostra architettura lato server, questi sono memorizzati nel nostro `statestore`.

Questi valori generalmente sovrascrivono alle proprietà predefinite impostate all'interno dell'editor Node-RED, e può essere usato per sanity controllare perché un particolare widget rende il modo in cui fa.