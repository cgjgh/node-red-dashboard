---
description: Comprenez comment les mises en page du tableau de bord Node-RED peuvent être configurées pour vos applications.
---

# Mises en page

Les mises en page sont une configuration disponible sur une base de page par page. They control how all of the [Groups](../nodes/config/ui-group) of widgets are laid out on a given [Page](../nodes/config/ui-page):

![Screenshot of the layout options on a ui-page](../assets/images/layouts-page-layout-option.png){data-zoomable}
_Screenshot of the layout options on a `ui-page`_

Nous offrons actuellement quatre options de mise en page différentes:

- [Grid](./types/grid.md)
- [Fixed](./types/fixed.md)
- [Notebook](./types/notebook.md)
- [Tabs](./types/tabs.md)

## Groupes & Widgets de taille

Un composant fondamental de la construction de mises en page dans le tableau de bord 2.0 (qui suit le tableau de bord 1. principe) est la possibilité de contrôler la taille de chaque groupe et widget avec le widget de sélection de tailles :

![Screenshot of the size selection widget for a ui-gauge](../assets/images/layouts-sizing-options.png){data-zoomable}
_Screenshot of the size selection widget for a ui-gauge_

Ce que signifie exactement ce dimensionnement diffère légèrement en fonction de la mise en page que vous utilisez, mais le principe général est que la taille d'un groupe ou d'un widget va contrôler combien d'espace il occupe dans la mise en page.

Les différences de base sont dans la propriété "width" de la taille :

- Pour "Grille" et "Carnet", la largeur est calculée comme une portion de 12 _colonnes_, i. . Une largeur de "6", prendrait la moitié de la largeur de la mise en page.
- Pour "Fixed", la largeur est calculée comme un multiple de 90 _pixels_, c'est-à-dire une largeur de "3", prendrait 270px de l'écran.

## Points d'arrêt

La plupart des mises en page du tableau de bord utilisent un concept de "Colonnes", où la largeur du groupe est définie comme un certain nombre de colonnes, e. , et la page affiche aussi un nombre donné de colonnes, par exemple 12. Cela signifie qu'un groupe avec une largeur de 6 prendra la moitié de la largeur de la page.

[peut être configuré] (../nodes/config/ui-page.md#breakpoints) sur une base de page par page, contrôlant le nombre de colonnes affichées à différentes tailles d'écran. Ceci est particulièrement utile pour un design réactif, vous permettant de contrôler le nombre de colonnes affichées sur un appareil mobile, une tablette ou un bureau.

## Options du thème

En plus de la structure de mise en page du noyau, définissant comment les groupes sont ordonnés et mis en page, il est également possible de contrôler une partie de l'espacement dans une mise en page à travers la page [Theme](../nodes/config/ui-theme).

### Options configurables

![Screenshot of the theme options available to control sizings of the layout](../assets/images/layouts-theme-options.jpg){data-zoomable}
_Screenshot of the theme options available to control sizings of the layout_

Chaque couleur ici corrélée à la section correspondante dans l'image suivante :

![Screenshot of the theme options available to control sizings of the layout](../assets/images/layouts-theme-example.jpg){data-zoomable}
_Screenshot of the theme options available to control sizings of the layout, ici montrant une mise en page "Grille"_

- **Remplissage de la page :** L'espacement qui encapsule le contenu de la page complète, représenté ci-dessus comme l'espace <span style="color: orange;">orange</span>.
- **Gap de groupe:** L'espacement entre chaque groupe, décrit ci-dessus comme l'espace <span style="color: lightseagreen;">vert</span>.
- **Gap de Widgets:** L'espacement entre chaque widget, au sein d'un groupe, décrit ci-dessus comme l'espace <span style="color: deeppink;">rose</span>.

Une option supplémentaire disponible sur une base groupée par groupe est d'afficher ou non le nom du Groupe, ci-dessus représenté par l'espace <span style="color: goldenrod;">jaune</span>. Si cela est caché, le Remboursement de Groupe (<span style="color: blue;">bleu</span>), sera affiché sur tous les quatre côtés du groupe.

### Non configurable (actuellement)

Alors que nous offrons des niveaux raisonnables de personnalisation, il y a certaines zones qui ne sont pas configurables pour le moment :

- **Hauteur de la ligne :** Une seule unité de hauteur est actuellement fixée à 48px. Cela ne peut pas être modifié pour le moment. Cela affecte également la disposition "Fixed", où une seule unité de largeur est alimentée par cette valeur.
- **Rembourrage de groupe :** L'espacement qui encapsule le contenu du groupe, décrit ci-dessus comme l'espace <span style="color: blue;">bleu</span>.