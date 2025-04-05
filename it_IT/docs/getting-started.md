---
description: Kickstart il tuo viaggio Node-RED Dashboard 2.0 con questa guida iniziale. Perfetto per principianti.
---

<script setup>
    import { ref } from 'vue'
    import FlowViewer from '. components/FlowViewer.vue'
    import ExampleDesignPatterns from '.. examples/design-patterns.json'
    import RecommendedTutorials from './components/RecommendedTutorials.vue'

    const examples = ref({
      'design-patterns': ExampleDesignPatterns,
    })
</script>

# Per Iniziare

## Informazioni

Benvenuti nella documentazione della Dashboard Node-RED 2.0, il successore della Dashboard originale, e molto popolare, Node-RED Dashboard.

Questo progetto è stato formato da FlowFuse, come parte degli sforzi per aggiornare il cruscotto originale per allontanarsi da Angular v1. che è stato [ufficialmente deprecato](https://flowfuse.com/blog/2024/06/dashboard-1-deprecated/). Puoi leggere la nostra dichiarazione completa su _perché_ stiamo costruendo Dashboard 2.0 [here](https://flowfuse.com/blog/2023/06/dashboard-announcement/?_gl=1*cckr5u*_gcl_au*MTAzMTA0MzY1Ni4xNzE2MzY2NTAz).

## Tutorial Consigliati

<RecommendedTutorials />

## Installazione

[FlowFuse](https://flowfuse.com)Node-RED Dashboard 2.0 è disponibile nel Node-RED Palette Manager. Per installarlo:

- Apri il menu in alto a destra di Node-RED
- Clicca Su "Gestisci Tavolozza"
- Passa alla scheda "Installa"
- Cerca `node-red-dashboard`
- Installa il pacchetto `@flowfuse/node-red-dashboard` (non `node-red/node-red-dashboard`)

![Installa tramite "Gestisci tavolozza"](./assets/images/install-palette.png){data-zoomable}
_Schermata che mostra i nodi disponibili nel Gestore tavolozza Node-RED_

I nodi saranno quindi disponibili nel tuo editor per iniziare.

Se vuoi usare `npm` per installare i tuoi nodi, puoi invece [seguire queste istruzioni](https://nodered.org/docs/user-guide/runtime/adding-nodes)

## Gerarchia Dashboard

Ogni Dashboard è una raccolta di widget (ad esempio grafici, pulsanti, moduli) che possono essere configurati e organizzati nella nostra interfaccia utente. La gerarchia di una Dashboard è la seguente:

- **Base** - Definisce l'URL di base (es. `/dashboard`) per la tua Dashboard.
- **Pagina** - Una data pagina alla quale un visitatore può spostarsi, l'URL estenderà la base, ad esempio `/dashboard/page1`. Ogni pagina può anche avere un tema definito, unico, che controlla lo stile di tutti i gruppi/widget della pagina.
- **Gruppo** - Una raccolta di widget. Renderizzato su una pagina.
- **Widget** - Un singolo widget (es. grafico, pulsante, form) creato nella Dashboard.

## Aggiungere i tuoi primi widget

Con i nodi installati, iniziare è facile come scegliere un nodo dalla Tavolozza (l'elenco dei nodi a sinistra) in Node-RED, e cadere sulla tua tela.

![Registrazione dello schermo per mostrare quanto sia facile distribuire la tua prima applicazione Dashboard 2.0. (./assets/images/getting-started.gif){data-zoomable}
_Registrazione schermo per mostrare quanto sia facile distribuire la tua prima applicazione Dashboard 2.0_

In questo caso, scenderemo in un `ui-button`, clicca su "Deploy" e poi possiamo vedere il pulsante in esecuzione in diretta nella nostra interfaccia utente.

Nota anche che Dashboard creerà automaticamente un nuovo gruppo, pagina, tema e cruscotto di base per te.

## Configurare il layout

Dashboard 2.0 aggiunge una corrispondente barra laterale "Dashboard 2.0" all'editor Node-RED . Questa barra laterale fornisce un' interfaccia per visualizzare pagine, temi, gruppi e widget. Da qui puoi aggiungere nuove pagine e gruppi, modificare le impostazioni esistenti e riordinare i contenuti a tuo piacimento.

![Screenshot che mostra la barra laterale Dashboard 2.0 nell'editor Node-RED.](./assets/images/getting-started-sidebar.png){data-zoomable}
_Screenshot che mostra la barra laterale Dashboard 2.0 nell'editor Node-RED._

Le opzioni di layout in un'interfaccia utente Dashboard 2.0 sono controllate da due impostazioni principali:

- **Page Layout:** Controlla come i `ui-groups`'s sono presentati in una data pagina nella tua applicazione.
- **Navigazione Barra laterale:** Definisce lo stile di navigazione a sinistra, definito al livello `ui-base`.

![Esempio di un layout di pagina "Griglia", con una navigazione nella barra laterale "Collapsing". (./assets/images/getting-started-layout.png){data-zoomable}
_Esempio del layout della pagina "Griglia", con una navigazione nella barra laterale "Collapsing"._

### Pagina Predefinita

Ogni pagina nella Dashboard 2.0 ha un URL unico. Se un utente si sposta verso un percorso non riconosciuto, sotto il percorso `/dashboard/`, allora una pagina predefinita viene usata per tornare indietro.

Attualmente, nella Dashboard 2.0, la pagina predefinita viene scelta come la pagina ordinata prima nella lista delle pagine nella navigazione laterale:

![Screenshot of the pages list in the Dashboard 2.0 side panel](./assets/images/default-page-layout.png "Screenshot of the pages list in the Dashboard 2. pannello laterale"){data-zoomable}
_Screenshot dell'elenco delle pagine nel pannello laterale Dashboard 2.0_

In questo esempio, la pagina _"Widget di Terzi"_ è la pagina predefinita.

### Opzioni Di Layout

Attualmente, abbiamo tre diverse opzioni per il layout di una pagina:

- **Griglia:** ([docs](https://dashboard.flowfuse.com/layouts/types/grid.html)) Il layout predefinito per una pagina. Usa una struttura a 12 colonne per posizionare i gruppi. La larghezza di ogni gruppo o widget definisce il numero di colonne in cui verrà visualizzato. Così, una "larghezza" di 6" renderebbe al 50% dello schermo. I layout della griglia sono completamente reattivi, e si adegueranno alle dimensioni dello schermo.
- **Fisso:** ([docs](https://dashboard.flowfuse.com/layouts/types/fixed.html)) Ogni componente verrà renderizzato ad una larghezza _fissa_, indipendentemente dalla dimensione dello schermo. La proprietà "width" è convertita in un valore di pixel fisso (multipli di 48px per impostazione predefinita).
- **Notebook:** ([docs](https://dashboard.flowfuse.com/layouts/types/notebook.html)) Questa disposizione si estenderà fino al 100% di larghezza, fino a una larghezza massima di 1024px, e si allineerà centralmente. È particolarmente utile per lo storytelling (ad esempio articoli/blog) o per le interfacce utente di tipo di analisi (ad es. Jupyter Notebooks), dove si desidera che l'utente digerisca il contenuto in un particolare ordine attraverso lo scorrimento.
- **Schede:** ([docs](https://dashboard.flowfuse.com/layouts/types/tabs.html)) Questo layout organizza il contenuto in sezioni tabbed separate, consentire agli utenti di passare da diverse viste o categorie di contenuti senza lasciare la pagina. Ogni scheda può contenere più gruppi e widget, ed è particolarmente utile per organizzare grandi quantità di informazioni in segmenti facilmente digeribili. Il layout "Tabs" garantisce una migliore navigazione e una interfaccia utente più pulita quando più categorie di contenuti devono essere visualizzate in una singola vista.

### Navigation Sidebar

Costruito nel framework dell'interfaccia utente è una barra di navigazione laterale, insieme alla parte superiore, pagina "barra delle app". Esistono opzioni di configurazione tali che il comportamento di navigazione laterale possa essere controllato. Le opzioni includono:

- **Collapsing:** Quando la barra laterale è aperta, il contenuto della pagina si regolerà con la larghezza della barra laterale.
- **Fissato:** La barra laterale completa sarà sempre visibile, e il contenuto della pagina si regolerà alla larghezza della barra laterale.
- **Riduci a Icon:** Quando è minimizzato, gli utenti possono ancora navigare tra le pagine facendo clic sulle icone che rappresentano ogni pagina nella barra laterale.
- **Appare sopra Contenuto:** Quando la barra laterale è aperta, alla pagina viene dato un overlay, e la barra laterale si siede in alto.
- **Nascondi sempre:** La barra laterale non verrà mai mostrata e la navigazione tra le pagine può invece essere guidata da [`ui-control`](https://dashboard.flowfuse.com/nodes/widgets/ui-control.html).

## Modelli Di Design

Ci sono due modelli di design core che sono possibili quando si costruisce con Dashboard 2.0:

- **Singola fonte di verità:** Tutti gli utenti della tua Dashboard vedranno gli stessi dati. Ciò è utile per le applicazioni IoT o Home Automation industriali.
- **Multi Tenancy:** I dati mostrati in un particolare widget sono unici per un determinato client/sessione/utente. Questo rappresenta un'applicazione web più tradizionale, dove ogni utente ha la propria sessione e i dati associati.

Vale la pena notare che questi due modelli possono essere mescolati e abbinati all'interno di una singola applicazione Dashboard 2.0, mostrata [later](#example).

### Sorgente unica della verità

![Single Source of Truth](./assets/images/design-pattern-single.png){data-zoomable}
_Esempio di flusso di lavoro per dimostrare il modello di progettazione "Single Source of Truth"._

Questo è il motivo che il cruscotto Node-RED originale utilizzato. In questo modello, tutti gli utenti della Dashboard vedranno gli stessi dati. I dati che popolano un widget sono generalmente guidati da una chiamata API hardware o di uso generale.

Quando un utente va a visitare una Dashboard, i widget caricheranno il loro rispettivo stato e lo mostreranno a ogni utente.

Un esempio di ciò è che se si dispone di elementi interattivi, ad es. un cursore collegato a un grafico, quindi un utente che sposta il cursore disegnerà i dati sul grafico dei Dashboard di ogni altro utente troppo.

### Multi Tenancy

![Multi Tenancy](./assets/images/design-pattern-client.png){data-zoomable}
_Esempio di flusso di lavoro per dimostrare il modello di progettazione "Multi Tenancy"._

Nella Dashboard 2.0 possiamo configurare un dato tipo di nodo a ["Accetta i dati client"](/user/sidebar.html#client-data) dalla barra laterale:

<img data-zoomable style="max-width: 400px; margin: auto;" src="/images/dashboard-sidebar-clientdata.png" alt="Screenshot of an example 'Client Data' tab"/><em>Screenshot di un esempio di scheda "Dati Client"</em>

Se "Includi dati client" è attivato, allora _all_ oggetti `msg` emessi da _tutti_ i nodi conterranno un `msg. oggetto client`, che dettaglierà al minimo il `socketId` per il client connesso. È possibile aggiungere altri dati a questo oggetto, come un nome utente, un indirizzo email o altri identificatori univoci con plugin Dashboard, e. . il [FlowFuse User Plugin](https://flowfuse.com/blog/2024/04/displaying-logged-in-users-on-dashboard/).

La tabella "Accetta i dati clienti" consente la configurazione su quali tipi di nodo prestano attenzione a tutte le informazioni `msg._client` fornite. Qualsiasi `msg` inviato _to_ uno di questi nodi può includere un valore `msg._client` per specificare una particolare connessione (e. . username, socket ID) a cui i dati devono essere inviati piuttosto che a tutti i client.

Per gli utenti che hanno familiarità con la Dashboard Node-RED originale, riconoscerai questo modello da quello che potresti fare con `ui-notification` e `ui-control`, ora, nella Dashboard 2. , è possibile per _tutti_ widget.

La chiave qui è che i dati vengono generalmente iniettati in un nodo come conseguenza di un'azione dell'utente, ad es. cliccando su un pulsante, visualizzando una pagina, o inviando un modulo e i dati che rispondono vengono inviati _solo_ a quell'utente.

Un semplice esempio di questo modello di design nella Dashboard 2.0 è quello di utilizzare il nodo [UI Event](./nodes/widgets/ui-event.md). Il nodo `ui-event` emette un `msg` quando un utente carica una pagina. All'interno del `msg` è disponibile un oggetto dati `msg._client` completo disponibile per la connessione di quel client. Se questo messaggio viene inviato su un altro nodo che accetta i dati del client, allora quel `msg` completo verrà inviato _solo_ a quel client specificato.

### Esempio

Qui abbiamo un flusso che produrrà alcuni dati definiti dal client e alcuni dati condivisi. Durante l'importazione, assicurati di controllare che nella barra laterale Dashboard 2.0, sia `ui-text` che `ui-template` siano controllati nella tabella "Accetta dati clienti".

<video controls>
    <source src="./assets/videos/demo-design-patterns.mp4" type="video/mp4">
    Il tuo browser non supporta il tag video.
</video>

Nel video qui sopra vediamo che in alcuni casi i dati vengono inviati solo al client che lo ha innescato (ad es. clic del pulsante), e in altri, i dati sono condivisi in tutte le sessioni client (ad esempio la visualizzazione del valore del cursore sul grafico).

Se vuoi giocare con questo esempio, il flusso è il seguente:

<FlowViewer :flow="examples['design-patterns']" height="425px" style="margin-bottom: 24px;"/>

Coprire un po' più di dettaglio sul flusso stesso:

#### Dati Client-Driven

Per questo caso di utilizzo abbiamo impostato `ui-text` e `ui-template` configurati nella barra laterale in "Accetta i vincoli dei clienti".

Nella parte superiore, il nodo `ui-event` emetterà un messaggio quando un utente carica la pagina. Questo messaggio conterrà un oggetto `msg._client`, che è unico per la connessione dell'utente. Questo messaggio viene quindi inviato a un nodo `ui-template`, che visualizzerà l'ID socket dell'utente specifico.

Allo stesso modo, abbiamo anche un pulsante, che emetterà anche `msg. dati client` (come tutti i nodi lo faranno), ma questa volta verranno inviati a un nodo `ui-text`. Il `ui-text` mostrerà il timestamp dell'ultima volta che il client/utente dato ha cliccato quel pulsante.

#### Dati Condivisi (Tutti I Client)

Questa sezione del flusso mostra come un cursore può essere usato per controllare un grafico, nota che colleghiamo il cursore direttamente nel grafico perché il file `ui-chart` non è stato configurato in "Accetta i dati clienti".

Colleghiamo anche il `ui-slider` a due nodi `ui-template`. Dato che i nodi `ui-template` _are_ configurati per "Accetta dati clienti", possiamo dimostrare sia i dati condivisi che quelli specifici del client nello stesso flusso eliminando `msg. client` dati sulla strada verso il nodo `ui-template` inferiore. Rimuovendo questo, tutti i dati del cursore inviati qui verranno inviati a _all_ connessioni, perché il `msg` non specifica un `_client`. Il top `ui-template` verrà aggiornato solo per il client che ha spostato il cursore.

## Contribuire

Se si desidera eseguire questo set di nodi a livello locale, e in particolare per contribuire agli sforzi di sviluppo, puoi leggere la documentazione [Contributing](./contributing/index.md).

Se vuoi costruire i tuoi nodi e widget standalone che si integrano perfettamente con la Dashboard 2. , puoi leggere la nostra guida su quella [here](./contributing/widgets/third-party.md).
