---
description: Guide complet sur les tests de bout en bout pour le tableau de bord Node-RED 2.0, garantissant fiabilité et performances.
---

# Tests E2E

Le test E2E consiste à exécuter un environnement local et à automatiser l'interaction avec le navigateur pour tester le comportement des widgets.

Avec Dashboard 2.0, nous avons les commandes suivantes qui sont utilisées pour les tests :

- `npm run cy:server` - Exécute une instance de Node-RED avec Dashboard 2.0 installé.
- `npm run cy:run` - Exécute tous les tests Cypress en mode headless.
- `npm run cy:open` - Ouvre l'exécuteur de test Cypress, où vous pouvez explicitement choisir quels tests exécuter localement.

## Cyprès

Pour nos tests E2E, nous utilisons [Cypress](https://www.cypress.io/). Ceci fournit un framework par lequel nous pouvons définir des tests automatisés qui cliqueront et interagiront avec les éléments pertinents de notre tableau de bord, et vérifier les comportements attendus.

## Tests en cours

### Installer l'instance de test Node-RED

Cypress a été configuré pour exécuter une instance locale de Node-RED avec le tableau de bord 2.0 installé. Vous devrez installer les dépendances pour cette instance :

```bash
cd ./cypress/fixtures/user-dir/
installation npm
```

### Serveur de test en cours d'exécution

Pour exécuter le serveur de test, vous devrez exécuter la commande suivante à partir de la racine du référentiel :

```bash
npm run cy:server
```

Le serveur de test s'exécutera à `http://localhost:1881`, et tout tableau de bord résultant sera disponible à `http://localhost:1881/dashboard`.

### Ouvrir Cypress

Pour ouvrir l'exécuteur de test Cypress, vous devrez exécuter la commande suivante depuis la racine du référentiel:

```bash
npm run cy:open
```

Sélectionnez "E2E Testing, puis le navigateur de votre choix. Ensuite, vous verrez une liste des tests disponibles, que vous pourrez ensuite exécuter individuellement.

![Screenshot showing the UI Button tests running in the Cypress Test Runner](../../assets/images/cypress-ui.png)
_Screenshot showing the UI Button tests running in the Cypress Test Runner_

## Tests d'écriture

Avec Node-RED et Dashboard 2.0, nous voulons être en mesure de fournir un `flow. son`, puis tester le comportement du tableau de bord qui est déployé à la suite de ce flux.

Ainsi, chaque série de tests contient deux parties clés :

1. `<widget>.json` - le `flows.json` qui détaille les flux de test à déployer, stockés dans `/cypress/fixtures/flows`
2. `<widget>.spec.js` - la suite de tests qui définit avec quels éléments interagir et les états à tester, stockés dans `/cypress/tests/`

### 1) Flux de test de construction

Chaque suite de tests aura un fichier `flows.json` correspondant qui détaille le flux à déployer vers l'instance locale Node-RED. Ceci contiendra les nœuds nécessaires pour tester le comportement du widget en question.

La façon la plus simple de construire ce `flow.json` est en Node-RED lui-même:

1. Construire le flux que vous voulez tester dans une instance locale Node-RED
2. Exporter en JSON
3. Enregistrez le fichier `json` exporté dans un fichier `json` dans `/cypress/fixtures/flows`

Vous pouvez également profiter des [Cypress Test Helpers] (#cypress-test-helpers).

### 2. Exemple de fichier `spec.js`

Pour référencer votre `flow.json`, vous pouvez utiliser la fonction `cy.deployFixture` qui chargera le flux dans l'instance locale Node-RED.

```js
describe('Tableau de bord Node-RED 2. - Groupes de boutons, () => {
    // tout ce qui est ici sera exécuté avant tous les tests indivudal sous
    beforeEach(() => {
        // ici nous pouvons utiliser notre commande d'aide pour charger un flux. fils
        cy. eployFixture('dashboard-button-groups')
        // alors assurez-vous que nous commençons sur la bonne page pour chaque test
        . isit('/dashboard/page1')
    })

    // it('') spécifie un nouveau test
    it('peut être cliqué et émettre une valeur représentant l'option', () => {
        // clickAndWait est une commande d'aide qui clique sur un élément et attend un temps fixe
        cy. lickAndWait(cy.get('button'). ontains('Option 3'))
        
        // checkOutput utilise ensuite les API Helper que nous avons en place pour vérifier ce qui est sorti du bouton
        cy. heckOutput('msg.topic', 'première ligne')
        cy. heckOutput('msg. ayload', 'option_3')
    })

    it('permet la définition de la couleur personnalisée pour les options', () => {
        // Cliquez sur le dernier bouton du groupe de boutons
        cy. lickAndWait(cy.get('#nrdb-ui-widget-ui-button-group-colors button'). ast())

        // vérifie que le CSS est appliqué correctement
        cy. et('#nrdb-ui-widget-ui-button-group-colors bouton').last()
            . hould('have.css', 'background-color', 'rgb(217, 255, 209)')
    })
})
```

## Aide de test Cypress

### Cliquez & attendez

`cy.clickAndWait(<element>)`

Cypress attendra automatiquement que les éléments apparaissent dans le DOM avant d'interagir avec eux, et attendez que les requêtes HTTP soient demandées, cependant, il ne peut pas faire la même chose pour le trafic Websocket.

Étant donné que la plupart des tests impliqueront la vérification des conasequences du trafic SocketIO, nous avons créé une "commande" Cypress, `clickAndWait()` qui assure une période de temps définie après avoir cliqué avant de passer à la phase suivante d'un test.

### Sortie du magasin (Noeud de fonctions)

Afin de faciliter l'écriture des tests, nous avons créé une fonction d'aide qui peut être utilisée pour tester la sortie de widgets particuliers. Ce noeud de fonction peut être inclus dans votre flux Node-RED, et il stockera l'objet `msg` dans un `global`

<iframe width="100%" height="250px" src="https://flows.nodered.org/flow/51259d06082d56dd79725d7675f6c4bc/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

La fonction "Stocker le dernier Msg" contient :

```js
global.set('msg', msg)
retourne msg;
```

Lorsqu'un bouton est cliqué dans le tableau de bord, la valeur émise par ce bouton est alors stockée dans une variable globale `msg`. Nous pouvons ensuite l'utiliser dans la conjuction avec la vérification de cette sortie.

### Vérifier la sortie

`cy.checkOutput(<key>, <value>)`

Si vous utilisez le nœud de la fonction [Store Output] (#store-output-function-node), nous pouvons alors utiliser la commande `checkOutput` pour vérifier la valeur de l'objet `msg` par rapport à ce que nous attendons.

Ce flux d'aide est automatiquement déployé dans l'instance Node-RED lorsque vous utilisez la commande `deployFixture(<fixture>)`.

<iframe width="100%" height="250px;" src="https://flows.nodered.org/flow/85116e5ecfdb9da778bbbbfe34c0063b/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Par exemple, à partir de nos tests de boutons:

```js
describe('Tableau de bord Node-RED 2. - Boutons, () => {
    beforeEach(() => {
        cy. eployFixture('dashboard-buttons') // lit dans un flow.json et le déploie sur l'instance locale Node-RED
        cy. isit('/dashboard/page1')
    })

    ('peut être cliqué et affiche le bon payload & topic sont émises', () => {
        // Emitting strings
        cy. lickAndWait(cy.get('button'). ontains('Bouton 1 (str)'))
        // checkOutput appelle nos endpoints d'aide pour vérifier les valeurs avec le msg
        cy. heckOutput('msg.payload', 'bouton 1 clic' )
        cy.checkOutput('msg. opic', 'button-str-topic')

        // Émettant JSON
        cy. lickAndWait(cy.get('button').contains('Bouton 1 (json)'))
        cy. heckOutput('msg.payload.hello', 'world')
        cy.checkOutput('msg.topic', 'button-json-topic')
    })
})
```

### Reset Context

`cy.resetContext()`

La fonction ci-dessus aide à régler et à vérifier la sortie qui dépend des magasins « contextes » de Node-RED. Cette fonction peut être utilisée pour être sûr que vous avez un magasin de contexte propre en le restant. Il est préférable d'utiliser _avant_ la fonction d'aide [Sortie magasin](#store-output-function-node) pour attribuer de nouvelles valeurs à la boutique.

### Recharger le tableau de bord

`cy.reloadDashboard()`

Si à n'importe quel moment vous voulez recharger la page, alors utiliser cette commande rafraîchira la page, mais assurez-vous également que l'appel à l'API `/_setup` est terminé, avant de procéder à toute autre étape de votre test.