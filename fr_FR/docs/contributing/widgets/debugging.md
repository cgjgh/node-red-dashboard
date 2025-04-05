---
description: Des stratégies et des conseils efficaces pour déboguer votre tableau de bord Node-RED 2.0 pour assurer un fonctionnement harmonieux.
---

# Tableau de bord de débogage 2.0

Dashboard 2.0 est fourni avec un outil de débogage intégré pour comprendre les données configurées pour chaque tableau de bord, page, thème, groupe et widget.

Pour accéder à l'outil, allez à `<your-host>:<your-port>/dashboard/_debug`.

![Debugging tool](/images/debug-example.png "Debugging tool"){data-zoomable}
_Screenshot of the Dashboard 2.0 Debugging Tool_

Cet outil est particulièrement utile lorsque vous construisez vos propres intégrations personnalisées, et que vous développez également sur les widgets du tableau de bord principal.

Nous espérons développer une partie de la portée de ce que cet outillage fournit, mais pour l'instant, il affichera les `props` actuels pour un widget donné, qui est défini par la configuration Node-RED, mais inclura également les valeurs de remplacement de l'objet `msg` (e. . `msg.options` peut remplacer la propriété `Options` pour un `ui-dropdown`).

## Historique des messages

![Debugging tool](/images/debug-example-datastore.png "Debugging tool"){data-zoomable}
_Screenshot de l'onglet "Message History" pour un widget_

Cet onglet montrera les dernières valeurs `msg` que le noeud associé a reçues dans le `datastore` de Node-RED pour un widget donné.

Ceci est utile pour comprendre quelles données vont être chargées lorsqu'un nouveau client se connecte à Node-RED. Il devra être actualisé pour refléter l'état le plus récent si vous attendez de nouveaux messages depuis la dernière ouverture de l'outil de débogage.

## Propriétés dynamiques

![Debugging tool](/images/debug-example-statestore.png "Debugging tool"){data-zoomable}
_Screenshot of the "Dynamic Properties" tab for a widget_

Cet onglet affiche toutes les propriétés dynamiques (propriétés définies avec une injection d'un `msg.<property>` qui ont été définis depuis que le serveur Node-RED est en cours d'exécution. Dans notre architecture côté serveur, ceux-ci sont stockés dans notre `statestore`.

Ces valeurs remplacent généralement les propriétés par défaut définies dans l'éditeur Node-RED, et peut être utilisé pour vérifier la raison pour laquelle un widget particulier rend la façon dont il fonctionne.