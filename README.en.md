# Mémoire (Memory)

The classic memory game with NeoDex's logos: turn the cards over two at a time to find every pair, in as few moves as possible.

*Version française : [README.md](README.md)*

## How to play

1. Click a card to turn it over, then a second one. With the keyboard: arrows to aim, Enter to turn; with a gamepad: the d-pad and A.
2. If the two logos match, the pair stays visible. Otherwise both cards turn face down again after a moment: remember where they were.
3. The game is won when every pair is found.

Each try of two cards counts as one **move**. The timer starts with the first card turned.

## Sizes

Choose the size from the list: **Easy** (6 pairs), **Normal** (8), 10, **Hard** (12), 15, **Expert** (18), 20 or **Master** (24 pairs). Logos are drawn at random each game. **New game** (or the N key) reshuffles everything, and the chosen size is kept for next time.

## The cards

Everything is pixel art: each card has a **decorated back** (golden frame, purple and pink diamonds, a medallion in the middle) and a light face with the logo enlarged without blur. When you turn it, the card **shrinks to a line, switches sides and widens again**, lifting a little above its shadow. A missed pair shakes and turns pink before hiding again; a found pair turns gold and twinkles.

The board takes all the room the window leaves, from a small laptop to a big screen, and the **Full screen** button fills the whole screen with it (Escape to leave). The more pairs, the smaller the cards, but the logo always stays whole and sharp.

## Statistics

At the top of the board: pairs found, your moves and the time. Beside it, for the chosen size: your **move record**, your **best time** and your games won. At the end, the game shows your moves, your time, and whether it is a new record.

## Data and sync

Your records per size are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Mémoire → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
