# Mémoire

Le jeu de mémoire classique avec les logos de NeoDex : retourne les cartes deux par deux pour retrouver toutes les paires, en un minimum de coups.

*English version: [README.en.md](README.en.md)*

## Comment jouer

1. Clique une carte pour la retourner, puis une deuxième. Au clavier : les flèches pour viser, Entrée pour retourner ; à la manette : la croix et A.
2. Si les deux logos sont pareils, la paire reste visible. Sinon, les deux cartes se retournent face cachée au bout d'un instant : retiens où elles étaient.
3. La partie est gagnée quand toutes les paires sont trouvées.

Chaque essai de deux cartes compte pour un **coup**. Le chrono démarre à la première carte retournée.

## Tailles

Choisis la taille du jeu dans la liste : **Facile** (6 paires), **Normal** (8), 10, **Difficile** (12), 15, **Expert** (18), 20 ou **Maître** (24 paires). Les logos sont tirés au hasard à chaque partie. **Nouvelle partie** (ou la touche N) remélange tout, et la taille choisie est gardée pour la prochaine fois.

## Les cartes

Tout est en pixel art : chaque carte a un **dos décoré** (cadre doré, losanges violets et roses, une médaille au milieu) et une face claire avec le logo agrandi sans flou. Quand tu la retournes, la carte **se rétrécit jusqu'à un trait, change de côté et s'élargit**, en se soulevant un peu au-dessus de son ombre. Une paire ratée tremble et rosit avant de se recacher ; une paire trouvée passe en doré et scintille.

Le plateau prend toute la place que laisse la fenêtre, du petit portable au grand écran, et le bouton **Plein écran** l'agrandit à tout l'écran (Échap pour en sortir). Plus il y a de paires, plus les cartes sont petites, mais le logo reste toujours entier et net.

## Statistiques

En haut du plateau : les paires trouvées, tes coups et le temps. À côté, pour la taille choisie : ton **record de coups**, ton **meilleur temps** et tes parties gagnées. À la fin, le jeu affiche ton nombre de coups, ton temps, et si c'est un nouveau record.

## Données et synchronisation

Tes records par taille sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Mémoire → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
