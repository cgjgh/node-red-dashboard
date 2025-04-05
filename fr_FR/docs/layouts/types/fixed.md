---
description: Apprenez à utiliser la mise en page fixe dans le tableau de bord Node-RED 2.0 pour les conceptions statiques et stables de tableaux de bord.
---

# Mise en page : Fixe

_Note : Cette mise en page a encore besoin de travail pour la rendre plus flexible et pratique, il est conseillé d'utiliser une autre mise en page pour le moment._

Chaque "unité" est une largeur fixe, qui était la seule disposition disponible dans le tableau de bord 1.0.

Il est construit sous la forme d'une disposition flexbox, avec une seule ligne de widgets. La largeur de chaque groupe est une taille de pixel fixe, calculée comme la propriété "largeur" d'un groupe, multiplié par 90px (où notre hauteur de ligne par défaut est de 45px).

Les groupes eux-mêmes suivent le même modèle que toutes les autres mises en page par lesquelles un groupe de largeur "6" aurait 6 "colonnes", avec la taille des widgets en conséquence, soa widget de taille "3 x 1" serait 50% de la largeur du groupe.

Il déplacera automatiquement les widgets vers la ligne suivante s'ils ne correspondent pas à la largeur de l'écran donnée, et ne change pas de taille avec la taille de l'écran, ce qui laisse souvent beaucoup d'écrans vides. La hauteur de chaque ligne est déterminée par le widget le plus haut de cette ligne.

![Mise en page fixe](../../assets/images/layout-eg-flex.png){data-zoomable}
_Un exemple d'interface rendu en utilisant la disposition "Fixed"_

## Points d'arrêt

En dessous de 576px, les mises en page fixes seront affichées en mode réactif afin de supporter le rendu mobile. Ici, ils deviennent en fait [Grid](./grid.md) mises en page, avec la largeur de chaque groupe étant calculée comme une portion de 3 colonnes, plutôt que comme une taille de pixel fixe.