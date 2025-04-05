---
description: Développer le tableau de bord Node-RED 2.0 avec des widgets tiers. Apprenez à les construire et à les intégrer.
---

<script setup>
    import AddedIn from '../../components/AddedIn.vue'
</script>

# Construction de Widgets Tiers <AddedIn version="0.8.0" />

Un seul widget se compose de deux parties clés :

1. Un noeud ROUGE qui apparaîtra dans la palette de l'éditeur Node-ROUGE
2. `.vue` et le code côté client qui rend le widget dans un tableau de bord

Vous pouvez explorer notre collection de widgets de base [here](../../nodes/widgets.md). Si vous avez une idée pour un widget que vous souhaitez construire dans le tableau de bord 2. nous sommes ouverts aux demandes de fusion et vous pouvez en lire plus dans notre guide [Ajouter des widgets Core](./core-widgets.md).

Nous réalisons cependant qu'il y a de nombreuses occasions où un référentiel/paquet autonome fonctionne mieux comme il était très populaire dans Dashboard 1.0.

## Lecture recommandée

Sur la navigation de gauche, vous trouverez une section "Guides utiles", Nous vous recommandons de jeter un coup d'œil sur ces éléments car ils donnent une bonne vue d'ensemble de la structure du tableau de bord 2. code base et certains des principes architecturaux sous-jacents sur lesquels il est construit.

En particulier, les recommandations suivantes sont les suivantes:

- [Architecture des événements](/contributing/guides/state-management.html)
- (/contributing/guides/state-management.html)

## Comment les Widgets sont chargés

Le tableau de bord 2.0 est construit au dessus de [VueJS](https://vuejs.org/) et, en tant que tel, tous les widgets doivent être mappés à un composant Vue. Le processus fonctionne comme suit :

1. Le client du tableau de bord 2.0 se connecte à Node-RED
2. Node-RED envoie des détails sur le contenu de l'objet `ui-config` de toutes les pages, thèmes, groupes et widgets
3. Dans le gestionnaire d'événements, nous bouclons sur tous les widgets trouvés dans la `ui-config`:
   - Si le widget `type` correspond à un composant de base, nous le mappons à ce composant
   - Si le widget est un widget tiers, nous chargeons le fichier `.umd.js` approprié, exposé par le dossier `/resources` du widget.
4. Le tableau de bord 2.0 charge la mise en page correspondante (par exemple, grille, fixe ou bloc-notes) en fonction de l'URL ou de la page active.
5. Au sein de ce gestionnaire de mise en page, nous parcourons les widgets et rendons leurs composants Vue.
   - Chaque composant est passé `id`, `props` et `state` du widget.

## Commencer

Nous avons créé un [dépôt d'exemple de nœud](https://github.com/FlowFuse/node-red-dashboard-example-node) qui fournira les fondations de votre widget. Il contient de nombreux exemples de fonctionnalités dont vous aurez probablement besoin.

Son dépôt de base a la structure de fichier/dossier suivante :

Comme pour tous les nœuds Node-RED, vous devrez commencer par deux fichiers :

- `/nodes/ui-example.html` - définit les propriétés du nœud, modifie l'interface utilisateur et aide le texte.
- `/nodes/ui-example.js` - définit les comportements côté serveur du nœud

Chaque Widget doit alors avoir un code côté client défini qui contrôle _comment_ le widget est rendu dans un tableau de bord. Tout contenu dans `/ui` sera empaqueté dans un fichier `.umd.js` que le Dashboard charge à l'exécution.

- `/ui/components/` - dossier contenant des fichiers `.vue` pour tous les composants Vue dont vous avez besoin
- `/ui/index.js` - Exporte tous les composants Vue qui doivent être importés dans Dashbaord 2.0

La configuration du nœud et des widgets sont contrôlés sur deux fichiers :

- `vite.config.js` - contient les détails de ce qu'il faut empaqueter dans le fichier `.umd.js` construit par le widget.
- `package.json` - doit contenir une section `node-red-dashboard-2` qui définit les widgets que le Dashboard peut importer.

### Développer localement

Pour commencer à travailler avec votre propre widget tiers, localement sur votre machine:

#### Installer Node-RED & Tableau de bord

1. Installer Node-RED ([docs](https://nodered.org/docs/getting-started/local))
2. Installez `@flowfuse/node-roud-dashboard` dans Node-RED via l'option "Gérer la palette".

#### Installer le nœud d'exemple d'interface utilisateur

1. Fork our [Exemple de référentiel de Noeuds] (https://github.com/FlowFuse/node-red-dashboard-example-node) and clone it localement sur votre machine.
2. Dans le répertoire Exemple de Noeud, installez les dépendances requises :

      npm install
3. Générer éventuellement une carte source (pour mapper le code minifié au code original), pour simplifier le débogage du code du frontend dans le navigateur.  Sous Linux, cela peut être réalisé par :

      export NODE_ENV=développement
4. À l'intérieur du répertoire Exemple de Node, construisez le fichier `.umd de l'exemple de Node. s` fichier (ce que Node-RED utilise pour exécuter votre widget), cela générera son dossier `/resources`, chargé par Node-RED.

      npm run build

#### Installer un exemple d'interface utilisateur dans Node-RED

1. Accédez à votre répertoire local Node-RED :

       cd ~/.node-red
2. Installez la copie locale du noeud Exemple :

      npm install /path/to/local/node-roud-dashboard-example-node-node-folder
3. Redémarrer Node-ROUGE

_Note : Toutes les modifications locales que vous apportez dans le dossier `/ui` du widget tiers, vous devrez relancer `npm run build` afin de mettre à jour le `umd. s` fichier, qui est ce que le tableau de bord charge pour afficher le widget._

## Configuration de votre Widget

### Nommer votre Widget

Afin d'importer des widgets externes dans le noyau du tableau de bord, le nœud de configuration `ui-base` du Dashboard lit le `paquetage de Node-RED. son` et vérifie les paquets qui ont été installés dans Node-RED avec `node-red-dashboard-2-` dans le nom du paquet.

En tant que tel, lors de la définition de votre propre intégration, assurez-vous qu'elle s'appelle correctement :

```json
"name": "node-roud-dashboard-2-<your-widget-name>"
```

### Définition de votre widget

Dans votre propre `package.json`, vous aurez besoin de définir une section `node-red-dashboard-2` qui indique ensuite au Dashboard _how_ de charger votre widget. Un exemple de `ui-example` est le suivant :

```json
"node-red-dashboard-2": {
    "version": "0.8.0", // la version minimale du Dashboard 2. supporté
    "widgets": {
        "ui-example": { // cette clé doit correspondre au "type" de votre widget, enregistré dans Node-RED
            "output": "ui-example. md. s", // le nom du fichier .js qui sera importé dans le tableau de bord, configuré dans vite.config. s
            "composant": "UIExample" // le nom du composant Vue primaire qui sera rendu comme votre widget dans le tableau de bord
        }
    }
 } }
```

### Enregistrement de votre noeud & Widget

_Plus de détails: [Registration](../guides/registration.md)_

Traditionnellement avec Node-RED, vous devez enregistrer votre noeud en utilisant `RED.nodes. egisterType("ui-exemple", UIExampleNode)`, c'est toujours le cas avec Dashboard, mais vous devez _aussi_ enregistrer le widget avec Dashboard aussi.

L'enregistrement du tableau de bord est construit à partir d'une fonction `.register()` (voir [docs](../guides/registration.md)). Cette fonction est disponible pour n'importe quel `ui-base`, `ui-page` ou `ui-group`. Pour `ui-group` et `ui-page`, il broche la fonction jusqu'à `ui-base` où un magasin est maintenu de tous les widgets du tableau de bord.

Votre widget devrait définir l'un de ces éléments comme une propriété dans votre nœud Node-ROUD, très probablement, il sera `ui-group`, si vous voulez que votre widget renvoie _inside_ un groupe dans le tableau de bord.

Dans votre fichier `/nodes/ui-example.js` :

```js
module.exports = function(RED) {
    function UIExampleNode(config) {
        RED.nodes. reateNode(ceci, config);
        var node = ceci;

        // quel groupe sommes-nous en train de rendre ce widget
        groupe const = RED. odes.getNode(config. roup)

        /**
         * Configuration ultérieure pour aller ici
         */

        // enregistrer le widget avec le groupe Tableau de bord
        . egister(node, config, evts)
    }
    // Enregistrer le noeud avec Node-RED
    ROUGE. odes.registerType("ui-exemple", UIExampleNode);
}
```

## Tutoriels

Vous trouverez ci-dessous des guides et des exemples sur la construction de widgets tiers. Nous avons également la section « Guides utiles » dans la navigation de gauche qui fournit des guides de développement plus généralisés lors de la contribution au tableau de bord 2.0.

### Les bases de VueJS

Conscient que beaucoup de développeurs qui pourraient vouloir contribuer au tableau de bord 2. , peut être nouveau dans VueJS, donc nous avons détaillé quelques fondamentaux ici.

Il est très courant depuis VueJS de voir les applications Vue à l'aide de "Composition API", alors que c'est un moyen plus léger de construire vos applications, ce n'est pas le plus intuitif pour ceux qui ne sont pas familiers avec VueJS, en tant que tels, nous utilisons principalement la structure « Options API » sur le tableau de bord 2. et dans nos exemples de lisibilité.

Avec l'API Options, un composant Vue a la structure suivante :

```vue
<template>
    <!-- Modèle HTML pour le composant -->
    <! - Vous pouvez référencer ici directement toutes les variables définies sur vos composants, par ex. -->
    <div>{{ myVar }}</div>
</template>

<script>
export par défaut {
    // toutes les propriétés qui sont passées au composant
    // dans le tableau de bord 2. , ces 3 sont ceux fournis :
    propriétés : ['id', 'props', 'state'],
    // toutes les données que vous voulez réactifs et disponibles dans votre composant
    // dans <script> référencent ces variables avec ceci.<myVar>
    // dans le HTML, vous n'avez pas besoin de "ceci. préfixe
    data () {
        return {
            myVar: 'Hello World'
        }
    },
    // Les propriétés calculées sont des variables qui se mettent à jour automatiquement lorsque leurs dépendances changent
    calculées: {
        myComputedProp () {
            retournent ceci. yVar + '!
        }
    },
    // toute méthode utilisée dans le composant
    méthodes: {
        myMethod () {
            alert(ceci. yVar)
        }
    },
    // Exécute lorsque le composant est construit et chargé dans la fonction DOM
    mounted () {
        alert('Le composant a monté')
    },
    // Exécute lorsque le composant est retiré
    unmounted () {
        alert('Le composant a été supprimé')
    }

</script>

<style>
/* tout style CSS pour le composant */
</style>
```

### Utiliser les composants Vuetify

Vous êtes libre de définir un HTML/CSS personnalisé complet lors de la définition de vos widgets, mais nous avons également fourni un support natif pour toutes les [librairies de composants de Vuetify](https://vuetifyjs.com/en/components/all/) pour démarrer avec un large éventail de composants de l'interface utilisateur que vous pouvez vouloir utiliser.

### Accès aux propriétés

Lorsque les widgets sont affichés dans une mise en page du tableau de bord, une petite collection de propriétés peut être utilisée pour personnaliser le comportement du widget:

| Propriété | Libellé                                                                                    |
| --------- | ------------------------------------------------------------------------------------------ |
| `id`      | L'ID du widget, assigné par Node-RED                                                       |
| `props`   | Les propriétés définies dans Node-RED, par exemple `this.props.name` ou `this.props.group` |
| `État`    | L'état du widget, par exemple `this.state.enabled` ou `this.state.visible`                 |

Lorsque vous les affichez dans votre propre composant Vue, vous pouvez y accéder comme suit:

```vue
<template>
    <div>ID : {{ id }}</div>
    <div>Nom : {{ props.name }}</div>
    <div>Groupe : {{ props.group }}</div>
</template>

<script>
Export default {
    props: ['id', 'props', 'state'],
    mounted () {
        // s'exécute à la charge du widget
        alert(ceci. d)
    }
}
</script>
```

### Communication avec Node-ROUGE

Les événements sont envoyés entre Node-RED et Dashboard 2.0 avec SocketIO. Vous pouvez voir une description complète de ces événements dans notre guide [Événements Architecture](../guides/events.md).

#### Réception de messages Node-ROUGE

Lorsque votre nœud reçoit un `msg` dans Node-RED, le client Dashboard 2.0 recevra un événement `msg-input` via SocketIO. Vous pouvez vous abonner à cet événement avec le composant Vue de votre propre widget avec:

```js
exporter {
    props: ['id', 'props', 'state'],
    // reste de votre composant de vue ici
    monté () {
        ceci.$socket.on('msg-input' + ceci. d, (msg) => {
            // fait quelque chose avec le msg
        })
    },
    démonté () {
        // se désabonner de l'événement lorsque le widget est détruit
        .$socket.off('msg-input:' + this.id)
    
    }
}
```

Il est recommandé d'utiliser notre [Data Tracker] compilé (../widgets/core-widgets.md#data-tracker) pour configurer les événements d'entrée/chargement standard pour votre widget. Cela peut être fait en appelant ce qui suit dans le fichier `.vue` de votre widget :

```js
exporter {
    inject: ['$dataTracker'],
    // reste de votre composant de vue ici
    créé () {
        ceci.$dataTracker(ceci. d)
        // on peut remplacer les événements par défaut si on veut avec
        // ceci.$dataTracker(this.id, myOnInputFunction, myOnLoadFunction, myOnDynamicPropertiesFunction)
    }

```

Plus de détails sur la personnalisation du Data Tracker peuvent être trouvés [here](../widgets/core-widgets.md#custom-behaviours).

#### Envoi de messages Node-RED

Vous pouvez envoyer un `msg` sur tous les nœuds connectés dans Node-RED en appelant l'un des événements suivants via SocketIO:

- `ceci.$socket.emit('widget-action', this.id, msg)`: envoie n'importe quel `msg` sur tous les nœuds connectés dans Node-RED.
- `ceci.$socket.emit('widget-change', ceci. d, msg)`: la même chose que `widget-action`, mais _ausso_ stocke ce dernier message dans le datastore Node-RED pour ce widget afin que l'état puisse être restauré lorsque le tableau de bord est actualisé.

#### Événements SocketIO personnalisés

Si vous souhaitez implémenter vos propres événements et gestionnaires SocketIO, vous pouvez le faire dans votre composant `.vue` avec:

```js
ceci.$socket.emit('my-custom-event', this.id, msg)
```

Ensuite, lorsque vous enregistrez votre nœud avec le tableau de bord sur le côté serveur (à l'intérieur du fichier `.js` de votre nœud), vous pouvez définir le gestionnaire d'événements concerné:

```js
evts = {
    onSocket: {
        // subscribe to custom events
        'my-custom-event': function (conn, id, msg) {
            // émet un message dans Node-RED depuis ce noeud
            . end(msg)
        }
    }
}
group.register(node, config, evts)
```

### Stockages de données et de données

Nous utilisons le concept de stockage de données du côté client et serveur du tableau de bord 2.0. Celles-ci sont utilisées pour centraliser le stockage de l'état le plus récent et des données associées à un widget.

Les magasins de données sont un mappage de l'ID du widget/noeud aux dernières données reçues dans ce widget. Ceci est le plus souvent utilisé pour restaurer l'état lorsque le tableau de bord est actualisé.

#### Magasin de données Node-ROUGE

La boutique de données de Node-RED est rendue accessible aux widgets tiers via la `ui-base` associée.

Pour y accéder dans le fichier `.js` de votre widget, vous pouvez utiliser :

```js
const group = RED.nodes.getNode(config.group)
const base = group.getBase()
```

Ensuite, chaque fois que vous voulez stocker des données dans le datastore, vous pouvez le faire avec:

```js
base.stores.data.save(base, nœud, msg)
```

Vous pouvez en savoir plus sur la boutique de données Node-RED dans notre guide [Gestion d'état](../guides/state-management.md).

#### Magasin d'état de Node-RED

L'état fait référence à toutes les propriétés de votre widget qui ont été modifiées dans l'exécution, et qui seraient différentes de celles définies dans l'éditeur Node-RED.

Par exemple, le `ui-dropdown` peut avoir ses `options` remplacés par un message `msg.options` envoyé au noeud. Ceci met à jour `options` serait stocké sur le noeud dans la boutique d'état.

#### Boutique de données côté client

Dans le tableau de bord 2.0, nous utilisons VueX pour gérer l'état centralisé d'une interface utilisateur.

Avec VueX, vous pouvez appeler `mapState` qui liera automatiquement la boutique à votre composant Vue, par exemple:

```vue
<template>
    <! - Récupérer les dernières valeurs de données du widget avec <id> -->
    {{ messages[id] }}
</template>
<script>
// importer mapState from VueX
import { mapState } from 'vuex'

export default {
    props: ['id', 'props', 'state'],
    // ... le reste de votre composant ici
    calculé : {// mappez les messages du magasin à notre propre composant Vue
        ... apState('data', ['messages'])
    },
    mounted () {
        // alerte le message le plus récent à la charge du widget
        alert(ceci. essages[this.id])
    }
}
</script>
```

Ensuite, pour ajouter des données au magasin :

```js
ceci.$store.commit('data/bind', {
    widgetId: this.id,
    msg
})
```

#### Chargement de l'état

Lors du chargement du tableau de bord 2.0, il enverra un événement `widget-load` à tous les widgets du tableau de bord. Ceci contiendra la dernière valeur du datastore Node-RED. Vous pouvez vous abonner à cet événement dans votre widget avec:

```js
exporter {
    props: ['id', 'props', 'state'],
    // reste de votre composant ici
    monté () {
        ceci.$socket.on('charge-widget' + ceci. d, (msg) => {
            // fait quelque chose avec le msg
        })
    },
    démonté () {
        // se désabonner de l'événement lorsque le widget est détruit
        .$socket.off('widget-load:' + this.id)
    
    }
}
```

### Style avec Vuetify & CSS

Nous pouvons définir notre propre CSS dans le dépôt du widget, en les important dans un composant `.vue` comme suit :

```vue
<style scoped>
.ui-example-wrapper {
    padding: 10px;
    marge : 10px;
    bordure: 1px solide noir ;
}
</style>
```

Vuetify est également fourni avec une poignée de classes utilitaires pour aider au styling, qui peuvent tous être utilisés hors de la boite:

- [Affichage adaptatif] (https://vuetifyjs.com/en/styles/display/#display)
- [Flex](https://vuetifyjs.com/en/styles/flex/)
- [Spacing](https://vuetifyjs.com/en/styles/spacing/#how-it-works)
- [Texte & Typographie](https://vuetifyjs.com/en/styles/text-and-typography/#typography)

### Dépendances externes

Votre widget peut avoir n'importe quel nombre de dépendances `npm`. Ils seront tous intégrés dans le fichier `.umd.js` que le Dashboard charge à l'exécution.

Dans `ui-exemple` nous avons une dépendance sur `to-title-case`, dans laquelle nous importons et utilisons dans notre composant Vue comme suit :

```js
import toTitleCase à partir de 'to-title-case'

export default {
    // reste du composant ici
    calculé: {
        titleCase () {
            return toTitleCase(ceci. nput.title)
        }
    }
}
```

Vous pouvez également charger d'autres composants Vue depuis votre propre référentiel comme avec n'importe quel composant VueJS.
