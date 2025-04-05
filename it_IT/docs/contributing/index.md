---
description: Unisciti allo sviluppo della Dashboard Node-RED 2.0. Impara come puoi contribuire a renderlo migliore per tutti.
---

# Contribuire

I contributi sono sempre i benvenuti per Dashboard 2.0. Abbiamo un sacco di grandi idee che vogliamo costruire, e ci piacerebbe avere il vostro aiuto!

## Struttura Del Progetto

### `/nodes`

Contiene i file che definiscono ciascuno dei nodi Node-RED che compongono il nodo Dashboard 2.0 impostato. Puoi leggere di più sui nodi di scrittura per Node-RED [here](https://nodered.org/docs/creating-nodes/first-node).

### `/ui`

Contiene la nostra app VueJS che costituisce il nucleo di Dashboard 2.0. All'interno `/ui/src/widgets`, troverai una serie di sottodirectory, ognuna contenente un file `.vue`. Sono questi file che definiscono l'aspetto e la funzionalità che gli utenti vedono quando si visualizza la Dashboard.

### `/docs`

Un sito di documentazione [VitePress](https://vitepress.dev/) che viene utilizzato per generare la documentazione per Dashboard 2.0 (quello che stai leggendo ora).

## Installazione Locale

### Pre-requisiti

- [Account GitHub](https://github.com/) - Avrai bisogno di un account GitHub per fare una copia del codice e contribuire a qualsiasi modifica.
- [Node.js](https://nodejs.org/en/download) - Node. s verrà anche confezionato con il Gestore Pacchetti Nodi (`npm`) che viene utilizzato per installare le dipendenze, ed eseguire la Dashboard (e Node-RED) localmente.
- [Git](https://git-scm.com/downloads) - Git è usato per clonare il repository localmente alla tua macchina, e consente di inviare le modifiche al repository centrale su GitHub.

### Clona e costruisci il repository

1. **Accedere alla macchina appropriata:** Accedere alla macchina dove hai installato Node-RED.

2. **Fork Repository:** Forgia questo repository al tuo account Github:

   ![image](../assets/images/github-pr.png){data-zoomable}

3. **Clona Git Repo:** Clona il repository forked dal tuo account Github. Questo può essere appropriato ovunque sulla tua macchina (ad esempio `/yourname/development/`):

      git clone https://github.com/<your_github_account>/node-red-dashboard.git

4. **Installa dipendenze:** Dall'interno della directory clonata, installa tutti i pacchetti dipendenti (dal file `package.json`):

      cd /node-red-dashboard
      npm install

5. Opzionalmente _**genera una mappa sorgente**_ (per mappare il codice del cruscotto minificato al codice originale), per semplificare il debug del codice del cruscotto del frontend nel browser. Su Linux questo può essere ottenuto tramite:

      export NODE_ENV=development

6. **Build Dashboard:** Crea una build statica dell'interfaccia utente del Dashboard, basata su Vue CLI (che è stata installata nel passaggio 3):

       npm run build

   In alternativa, usa `npm run build:dev` per costruire una versione sviluppatore o usa `npm run dev` per costruire una versione sviluppatore e guardare le modifiche (hot reload)

### Installa su Node-RED

1. **Entra in `.node-red`:** In un terminale, vai alla cartella `.node-red` (normalmente in `~/.node-red`).

      cd ~/.node-red

2. **Rimuovi la Dashboard esistente 2.0:** Nota - se hai già installato questo dashboard tramite la tua tavolozza, dovrai prima disinstallarlo. Questo può essere fatto dal Gestore tavolozze in Node-RED, o tramite `npm` sul terminale:

      npm uninstall @flowfuse/node-red-dashboard

3. **Installa Dashboard 2.0:** Installa il dashboard forked nel tuo sistema Node-RED dall'interno della cartella `.node-red`:

      npm install <path_to_your_forked_dashboard>

## Effettuare Modifiche

1. **Effettua modifiche:** Effettua modifiche appropriate.
   - **Editor Node-RED Editor:** Per modifiche del nodo Node-RED, lavorerai all'interno di `/nodes` - le modifiche qui richiederanno un riavvio di Node-RED (e l'aggiornamento dell'editor Node-RED) per vedere le ultime modifiche.
      - Per comodità puoi usare `npm run watch:node-red` che riavvierà Node-RED dopo ogni modifica a `/nodes`
      - Questo presuppone che Node-RED sia installato su `~/.node-red` e che tu abbia `@flowfuse/node-red-dashboard` installato in quella cartella (come al passaggio 3 sopra)
   - **Dashboard/UI:** Per le modifiche della Dashboard/UI, vedi `/ui` - le modifiche qui richiederanno una ricostruzione dell'interfaccia utente del Dashboard, che può essere fatto eseguendo `npm run build` (secondo il passaggio 5. in "Clona e costruisci il deposito").
      - Per comodità puoi usare `npm run watch:dashboard` che verrà auto-ricostruita dopo le modifiche dell'interfaccia utente
   - I due comandi dell'orologio sono combinati in un comando sotto `npm run watch`

2. **Aggiorna Browser:** Aggiorna la dashboard nel browser su `http(s)://your_hostname_or_ip_address:1880/dashboard`

3. **Sviluppa:** Ripeti più volte il passaggio da 1 a 2, finché non sarai soddisfatto dei tuoi risultati.

4. **Crea filiale:** Una volta che sei pronto a pubblicare le modifiche, nella directory del tuo repository clonato (ad es. `/yourname/development/node-red-dashboard`), crea un nuovo ramo per tutti i file della tua dashboard forchetta:

      git checkout -b name_of_your_new_branch

5. Non appena tutte le modifiche funzionano bene, effettua il commit delle modifiche:

       git commit -a -m "Descrizione delle tue modifiche"

6. Invia le modifiche apportate al fork del cruscotto sul tuo account Github:

       git push origin

7. Nel tuo repository forked dashboard (su Github), passa al nuovo branch e [crea una pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

## Esecuzione Locale Della Documentazione

1. **Esegui Docs Dev Server:** È possibile eseguire la documentazione localmente eseguendo il seguente comando nella root della directory `/node-red-dashboard`:

      npm run docs:dev

   Questo eseguirà la documentazione su `http://localhost:5173/`
2. **apportare modifiche:** apportare modifiche appropriate alla documentazione (`/docs`). La documentazione sarà aggiornata dal vivo, non sarà necessario ricostruire, riavviare il server o aggiornare il browser.
