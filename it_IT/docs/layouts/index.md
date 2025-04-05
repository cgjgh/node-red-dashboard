---
description: Comprendi come configurare i layout Node-RED Dashboard per le tue applicazioni.
---

# Layout

I layout sono una configurazione disponibile su una pagina per pagina. Controllano come tutti i widget [Groups](../nodes/config/ui-group) sono disposti su un dato [Page](../nodes/config/ui-page):

![Screenshot of the layout options on a ui-page](../assets/images/layouts-page-layout-option.png){data-zoomable}
_Screenshot of the layout options on a `ui-page`_

Al momento offriamo quattro diverse opzioni di layout:

- [Grid](./types/grid.md)
- [Fixed](./types/fixed.md)
- [Notebook](./types/notebook.md)
- [Tabs](./types/tabs.md)

## Dimensionamento Gruppi & Oggetti

Una componente fondamentale della costruzione di layout in Dashboard 2.0 (che segue il Dashboard 1. Principio) è la capacità di controllare la dimensione di ogni gruppo e widget con il widget di selezione dimensioni:

![Screenshot del widget di selezione delle dimensioni per un ui-gauge](../assets/images/layouts-sizing-options.png){data-zoomable}
_Screenshot del widget di selezione delle dimensioni per un ui-gauge_

Esattamente ciò che significa questo dimensionamento differisce leggermente a seconda del layout che stai utilizzando, ma il principio generale è che la dimensione di un gruppo o widget controllerà quanto spazio occupa nel layout.

Le differenze fondamentali sono nella proprietà "larghezza" della dimensione:

- Per "Griglia" e "Notebook", la larghezza è calcolata come una porzione di 12 _colonne_, i. . una larghezza di "6", avrebbe occupato la metà della larghezza del layout.
- Per "Fisso", la larghezza è calcolata come un multiplo di 90 _pixels_, cioè una larghezza di "3", occuperebbe 270px dello schermo.

## Breakpoint

La maggior parte dei layout nella Dashboard utilizzano un concetto di "Colonne", per cui la larghezza del gruppo è definita come un numero di colonne, e. . 6, e la pagina poi rende anche un dato numero di colonne, ad esempio 12. Ciò significa che un gruppo con una larghezza di 6 richiederebbe metà della larghezza della pagina.

Breakpoint [può essere configurato](../nodes/config/ui-page.md#breakpoints) su base pagina per pagina, controllando quante colonne sono rese a diverse dimensioni dello schermo. Questo è particolarmente utile per il design reattivo, che consente di controllare quante colonne sono rese su un dispositivo mobile, tablet o desktop.

## Opzioni Tema

Oltre alla struttura di layout centrale, definendo come i gruppi sono ordinati e disposti, è anche possibile controllare parte della spaziatura in un layout attraverso [Theme]della pagina (../nodes/config/ui-theme).

### Opzioni Configurabili

![Screenshot delle opzioni del tema disponibili per controllare le dimensioni del layout](../assets/images/layouts-theme-options.jpg){data-zoomable}
_Screenshot delle opzioni del tema disponibili per controllare le dimensioni del layout_

Ogni colore qui corrisponde alla rispettiva sezione nella seguente immagine:

![Screenshot delle opzioni del tema disponibili per controllare le dimensioni del layout](../assets/images/layouts-theme-example.jpg){data-zoomable}
_Screenshot delle opzioni del tema disponibili per controllare le dimensioni del layout, qui che mostra un layout "Griglia"_

- **Page Padding:** La spaziatura che racchiude il contenuto della pagina completa, raffigurata sopra come lo spazio <span style="color: orange;">orange</span>.
- **Gruppo Gap:** La spaziatura tra ogni gruppo, raffigurata sopra come spazio <span style="color: lightseagreen;">verde</span>.
- **Widget Gap:** La spaziatura tra ogni widget, all'interno di un gruppo, raffigurato sopra come lo spazio <span style="color: deeppink;">rosa</span>.

Un'opzione aggiuntiva disponibile su base di gruppo per gruppo è se mostrare o meno il nome del Gruppo, sopra raffigurato dallo spazio <span style="color: goldenrod;">giallo</span>. Se questo è nascosto, la Padding di Gruppo (<span style="color: blue;">blu</span>), renderà su tutti e quattro i lati del gruppo.

### Non Configurabile (Attualmente)

Mentre offriamo livelli ragionevoli di personalizzazione, ci sono alcune aree attualmente non configurabili:

- **Altezza di riga:** Una singola unità di altezza è attualmente fissata a 48 px. Ciò non può essere modificato in questo momento. Questo influisce anche sul layout "Fisso", dove una singola unità di larghezza è guidata da questo valore.
- **Imbottitura di gruppo:** La spaziatura che racchiude il contenuto completo del gruppo, raffigurata sopra come lo spazio <span style="color: blue;">blu</span>.