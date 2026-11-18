// Mémoire : le jeu de mémoire avec les logos de NeoDex. Retourne les cartes deux par deux et retrouve toutes les paires en un minimum de coups.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cartes au dos décoré qui se retournent). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Mémoire</span><span class="hint">Touche deux cartes pour les retourner</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="240" role="img" aria-label="Plateau de cartes"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <label class="row">Taille <select class="gSel" id="mmSize"><option value="4x3">Facile · 6 paires</option><option value="4x4" selected>Normal · 8 paires</option><option value="5x4">10 paires</option><option value="6x4">Difficile · 12 paires</option><option value="6x5">15 paires</option><option value="6x6">Expert · 18 paires</option><option value="8x5">20 paires</option><option value="8x6">Maître · 24 paires</option></select></label>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="mmFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Retourne deux cartes : si les logos sont pareils, la paire reste visible. Sinon, elles se recachent : retiens où elles étaient.</div>
      <div class="hint">Chaque essai de deux cartes compte pour un coup. Le chrono part à la première carte.</div>
      <div class="hint">Manette : croix pour choisir la carte, A pour la retourner, Start pour rejouer.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,560px);position:relative}
.gameBox canvas{image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(320px,calc((100vh - 190px) * 320 / 240)));height:auto;aspect-ratio:320/240}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 320 / 240))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast } = host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  host.addStyle(CSS);
  view.innerHTML = HTML;
  const T = {"k": "#08040e", "k2": "#120a1e", "fill": "#1e1230", "fillOn": "#2a1a42", "hl": "#3a2658", "line": "#5e4d85", "acc": "#b98aff", "accL": "#ecdcff", "accS": "#8a5cf0", "accD": "#2a1650", "rivet": "#ecdcff", "btn": "#3a2658", "btnHi": "#6a5a96", "btnLo": "#120a1e", "btnHov": "#4a3270", "btnHovHi": "#8a78b8", "text": "#f6f0ff", "muted": "#c4b8dc", "acc2": "#ff5ad9", "gold": "#ffd84a", "orange": "#ff9a3c", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#0c0716", "bgDot": "#1e1230", "bgDot2": "#120a1e", "spark": "#3a2658", "spark2": "#ff5ad9",
    "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]};
  pxSkin(view.querySelector('.appWrap'), { title: "MÉMOIRE", T,
    emblem: ["kkkkk.kkkkk.", "kaaak.kwwwk.", "kakak.kwbwk.", "kaaak.kwwwk.", "kkkkk.kkkkk.", "............", "kkkkk.kkkkk.", "kwwwk.kaaak.", "kwbwk.kakak.", "kwwwk.kaaak.", "kkkkk.kkkkk.", "............"],
    icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  let games = await doc('games');
  if (games == null) {  // première ouverture : tu retrouves tes records d'avant
    const old = legacy.api ? await legacy.api('games').catch(() => null) : null; games = { best: {} };
    if (old) { for (const [k, v] of Object.entries(old.best || {})) if (/^memory/.test(k)) games.best[k] = v; await folder.write('games', games); }
  }
  games = { best: {}, ...games };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v < b) { games.best[k] = v; saveGames(); return true; } return false; };  // ici, moins c'est mieux
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; return; }
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const W = 320, H = 240, TOP = 20, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .06, at = 0) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime + at; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Mémoire : de 6 à 24 paires de logos NeoDex (ART = [palette, lignes de 12 px]) ----------
   Chaque carte a une face (le logo agrandi sans lissage sur un fond clair) et un dos décoré, dessinés une fois par taille de carte.
   Le retournement : la carte se rétrécit jusqu'à un trait, change de côté puis s'élargit, en se soulevant un peu. */
const LOGOS = typeof ART === 'object' && ART ? ART : {};
// la place des cartes : la plus grande carte qui tient, plutôt en hauteur, et un logo agrandi d'un nombre entier de fois
function mmLay(cols, rows) {
  const cw = Math.floor((W - 8) / cols), ch = Math.floor((H - TOP - 4) / rows), h = ch - 4, w = Math.min(cw - 4, Math.max(Math.round(h * .8), 32));
  const s = Math.max(1, Math.floor(Math.min(w - 8, h - 8) / 12)), x0 = Math.round((W - cols * cw) / 2), y0 = TOP + Math.round((H - TOP - rows * ch) / 2);
  return { w, h, s, cw, ch, at: i => [x0 + (i % cols) * cw + Math.round((cw - w) / 2), y0 + Math.floor(i / cols) * ch + Math.round((ch - h) / 2)] };
}
const faces = {}, backs = {};
// le dos : cadre doré, losanges violets et roses, une médaille au milieu
const mmBack = (w, h) => backs[w + 'x' + h] ??= cnv(w, h, b => {
  px(b, '#05010b', 1, 0, w - 2, h); px(b, '#05010b', 0, 1, w, h - 2);
  px(b, '#ffd84a', 1, 1, w - 2, h - 2); px(b, '#c89a1a', 2, h - 2, w - 3, 1); px(b, '#c89a1a', w - 2, 2, 1, h - 3);
  px(b, '#2a1650', 2, 2, w - 4, h - 4);
  for (let y = 3; y < h - 3; y++) for (let x = 3; x < w - 3; x++) {
    const d = (Math.abs(((x - 3) % 8) - 3.5) + Math.abs(((y - 3) % 8) - 3.5)) | 0;
    if (d === 3) px(b, '#6a3cc0', x, y); else if (d === 0) px(b, '#ff5ad9', x, y);
  }
  px(b, '#8a5cf0', 3, 3, w - 6, 1); px(b, '#8a5cf0', 3, h - 4, w - 6, 1); px(b, '#8a5cf0', 3, 3, 1, h - 6); px(b, '#8a5cf0', w - 4, 3, 1, h - 6);
  const m = Math.max(3, Math.min(6, Math.floor(Math.min(w, h) / 7))), cx = w >> 1, cy = h >> 1;  // la médaille : un losange doré, un œil rose au centre
  for (let dy = -m - 1; dy <= m + 1; dy++) for (let dx = -m - 1; dx <= m + 1; dx++) { const d = Math.abs(dx) + Math.abs(dy); if (d <= m + 1) px(b, d === m + 1 ? '#05010b' : d >= m - 1 ? '#ffd84a' : d === 0 ? '#ff5ad9' : d === 1 ? '#ecdcff' : '#2a1650', cx + dx, cy + dy); }
  for (const [x, y] of [[4, 4], [w - 5, 4], [4, h - 5], [w - 5, h - 5]]) { px(b, '#ffd84a', x, y); }
});
// la face : fond clair, coins arrondis, le logo au milieu (doré quand la paire est trouvée)
const mmFace = (k, w, h, s, done) => faces[k + w + 'x' + h + done] ??= cnv(w, h, f => {
  px(f, '#05010b', 1, 0, w - 2, h); px(f, '#05010b', 0, 1, w, h - 2);
  px(f, done ? '#ffd84a' : '#b9a8ff', 1, 1, w - 2, h - 2); px(f, done ? '#fff4b0' : '#f6f0ff', 2, 2, w - 4, h - 4); px(f, done ? '#ffe88a' : '#e4dcf4', 2, h - 3, w - 4, 1);
  const [pal, rows] = LOGOS[k] || [{}, ['']], lw = rows[0].length * s, lh = rows.length * s, ox = (w - lw) >> 1, oy = (h - lh) >> 1;
  rows.forEach((r, y) => [...r].forEach((c, x) => { if (pal[c]) px(f, pal[c], ox + x * s, oy + y * s, s, s); }));
});
let mm = null; const LP = { raf: 0, tick: 0 };  // la boucle du jeu, gardée d'une partie à l'autre
const mmSizes = () => [...$('mmSize').options].map(o => o.value);
function mmNew(size = $('mmSize').value) {
  const [cols, rows] = size.split('x').map(Number), pairs = cols * rows / 2;
  const keys = Object.keys(LOGOS).sort(() => Math.random() - .5).slice(0, pairs), deck = [...keys, ...keys].sort(() => Math.random() - .5);
  mm = { cols, rows, pairs, L: mmLay(cols, rows), cards: deck.map(k => ({ k, up: false, done: false, f: 0, pop: 0, bad: 0 })), open: [], moves: 0, t0: 0, end: 0, hold: 0, hover: -1, cur: 0, pad: false, mode: 'play', rec: false };
  mmInfo();
}
function mmFlip(i) {
  if (!mm || mm.mode !== 'play') return;
  const c = mm.cards[i]; if (!c || c.up || c.done || mm.hold || mm.open.length >= 2) return;
  if (!mm.t0) mm.t0 = performance.now();
  c.up = true; mm.open.push(c); beep(520 + mm.open.length * 140, .04, 'triangle', 300, .05);
  if (mm.open.length === 2) mm.moves++;
}
function mmUpdate() {
  for (const c of mm.cards) { const want = c.up || c.done ? 1 : 0; c.f += Math.sign(want - c.f) * Math.min(.09, Math.abs(want - c.f)); if (c.pop) c.pop--; if (c.bad) c.bad--; }
  if (mm.open.length === 2 && mm.open.every(c => c.f >= 1)) {
    const [a, b] = mm.open;
    if (a.k === b.k) {
      a.done = b.done = true; a.pop = b.pop = 24; mm.open = []; beep(784, .08, 'triangle', 0, .05); beep(1175, .12, 'triangle', 0, .05, .08);
      if (mm.cards.every(c => c.done)) {
        mm.mode = 'won'; mm.end = performance.now(); const secs = Math.round((mm.end - mm.t0) / 1000), st = gstore('wins', {});
        st[mm.pairs] = (st[mm.pairs] || 0) + 1; saveGames();
        const r1 = best('memory' + mm.pairs, mm.moves), r2 = best('memoryT' + mm.pairs, secs); mm.rec = r1 || r2;
        [523, 659, 784, 1047].forEach((f, k) => beep(f, .16, 'triangle', 0, .06, .25 + k * .12));
        mmInfo();
      }
    } else if (!mm.hold) { mm.hold = 48; a.bad = b.bad = 48; beep(180, .14, 'square', 120, .04); }
  }
  if (mm.hold && !--mm.hold) { for (const c of mm.open) c.up = false; mm.open = []; }
  mmPad();
}
function mmDraw() {
  const L = mm.L, t = LP.tick;
  g.fillStyle = '#0c0716'; g.fillRect(0, 0, W, H);
  for (let y = TOP; y < H; y += 8) for (let x = (y >> 3) % 2 * 8; x < W; x += 16) px(g, '#140c22', x, y, 8, 8);  // la nappe, en damier sombre
  px(g, '#1e1230', 0, 0, W, TOP - 2); px(g, '#5e4d85', 0, TOP - 2, W, 1); px(g, '#05010b', 0, TOP - 1, W, 1);
  const secs = mm.t0 ? ((mm.end || performance.now()) - mm.t0) / 1000 : 0, found = mm.cards.filter(c => c.done).length / 2;
  pxFont(g, 'PAIRES ' + found + '/' + mm.pairs, 6, 14, '#ffd84a'); pxFont(g, 'COUPS ' + mm.moves, W / 2, 14, '#f6f0ff', 8, 'center'); pxFont(g, clock(secs), W - 6, 14, '#b98aff', 8, 'right');
  const sel = mm.pad ? mm.cur : mm.hover;
  mm.cards.forEach((c, i) => {
    const [x, y] = L.at(i), turn = Math.abs(Math.cos(Math.PI * c.f)), dw = Math.max(2, Math.round(L.w * turn)), lift = Math.round(Math.sin(Math.PI * c.f) * 3) + (c.pop ? Math.round(Math.sin(c.pop / 24 * Math.PI) * 2) : 0);
    const shake = c.bad > 36 ? ((c.bad >> 1) % 2 ? 1 : -1) : 0, dx = x + ((L.w - dw) >> 1) + shake, dy = y - lift;
    px(g, '#05010b', dx + 1, y + 2, dw, L.h);  // l'ombre reste sur la table quand la carte se soulève
    const img = c.f < .5 ? mmBack(L.w, L.h) : mmFace(c.k, L.w, L.h, L.s, c.done);
    g.drawImage(img, dx, dy, dw, L.h);
    if (c.bad && c.f > .5) { g.fillStyle = 'rgba(255,74,90,.28)'; g.fillRect(dx + 1, dy + 1, dw - 2, L.h - 2); }
    if (c.done && c.f >= 1) { const k = (t >> 3) + i * 5; for (const [sx, sy] of [[2, 2], [L.w - 3, L.h - 3]]) if (k % 12 < 3) { px(g, '#fff4b0', dx + sx, dy + sy - 1, 1, 3); px(g, '#fff4b0', dx + sx - 1, dy + sy, 3, 1); } }
    if (i === sel && mm.mode === 'play' && !c.done) {  // les coins dorés de la carte visée
      const a = 3, x1 = x - 2, y1 = dy - 2, x2 = x + L.w + 1, y2 = dy + L.h + 1, col = (t >> 4) % 2 ? '#ffd84a' : '#fff4b0';
      for (const [cx, cy, sx, sy] of [[x1, y1, 1, 1], [x2, y1, -1, 1], [x1, y2, 1, -1], [x2, y2, -1, -1]]) { px(g, col, sx > 0 ? cx : cx - a + 1, cy, a, 1); px(g, col, cx, sy > 0 ? cy : cy - a + 1, 1, a); }
    }
  });
  if (mm.mode === 'won') {
    const secs2 = Math.round((mm.end - mm.t0) / 1000), lines = [['GAGNÉ !', '#ffd84a', 16], [mm.moves + ' COUPS · ' + clock(secs2), '#f6f0ff', 8]];
    if (mm.rec) lines.push(['NOUVEAU RECORD !', '#ff5ad9', 8]);
    lines.push(['CLIC OU ENTRÉE : REJOUER', '#c4b8dc', 8]);
    const bh = lines.length * 16 + 18, by = (H - bh) >> 1;
    px(g, '#05010b', 30, by - 1, W - 60, bh + 2); px(g, '#ffd84a', 31, by, W - 62, bh); px(g, '#1e1230', 33, by + 2, W - 66, bh - 4);
    let y = by + 6; for (const [text, col, size] of lines) { const s = PXK.scale(size); y += 9 * s + (size > 8 ? 2 : 3); pxFont(g, text, W / 2, y, col, size, 'center'); y += 2 * s + 1; }
  }
}
function mmInfo() {
  const p = mm?.pairs || 8, b = games.best['memory' + p], bt = games.best['memoryT' + p], w = gstore('wins', {});
  showStats([['Taille', p + ' paires'], ['Record', b ? b + ' coups' : '-'], ['Temps', bt != null ? clock(bt) : '-'], ['Gagnées', w[p] || 0], ['Au total', Object.values(w).reduce((a, n) => a + n, 0)]]);
}
const mmAt = (x, y) => { const L = mm.L; for (let i = 0; i < mm.cards.length; i++) { const [cx, cy] = L.at(i); if (x >= cx && x < cx + L.w && y >= cy && y < cy + L.h) return i; } return -1; };
const mmMove = (dx, dy) => { const n = mm.cards.length, c = mm.cur % mm.cols, r = Math.floor(mm.cur / mm.cols); mm.cur = ((r + dy + mm.rows) % mm.rows) * mm.cols + (c + dx + mm.cols) % mm.cols; mm.pad = true; if (mm.cur >= n) mm.cur = n - 1; beep(300, .02, 'square', 0, .02); };
cv.onpointermove = e => { if (!mm) return; const [x, y] = cpos(e); mm.hover = mmAt(x, y); mm.pad = false; };
cv.onpointerleave = () => { if (mm) mm.hover = -1; };
cv.onpointerdown = e => { if (!mm) return; if (mm.mode === 'won') return mmNew(); const [x, y] = cpos(e), i = mmAt(x, y); if (i >= 0) { mm.cur = i; mmFlip(i); } };
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !mm) return;
  const k = e.key, mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
  if (mv) { e.preventDefault(); if (mm.mode === 'play') mmMove(...mv); }
  else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (mm.mode === 'won') mmNew(); else { mm.pad = true; mmFlip(mm.cur); } }
  else if (k === 'n' || k === 'N') mmNew();
});
// la manette : croix (ou stick) pour viser, A pour retourner, Start pour rejouer ; un appui = une action
let padWas = {};
function mmPad() {
  const p = navigator.getGamepads?.().find(Boolean); if (!p) return;
  const b = i => !!p.buttons[i]?.pressed, ax = p.axes || [], now = { L: b(14) || ax[0] < -.5, R: b(15) || ax[0] > .5, U: b(12) || ax[1] < -.5, D: b(13) || ax[1] > .5, A: b(0), S: b(9) };
  const was = padWas, hit = n => now[n] && !was[n]; padWas = now;
  if (mm.mode === 'won') { if (hit('A') || hit('S')) mmNew(); return; }
  if (hit('L')) mmMove(-1, 0); if (hit('R')) mmMove(1, 0); if (hit('U')) mmMove(0, -1); if (hit('D')) mmMove(0, 1);
  if (hit('A')) { mm.pad = true; mmFlip(mm.cur); } if (hit('S')) mmNew();
}
$('mmSize').onchange = () => { games.size = $('mmSize').value; saveGames(); mmNew(); };
if (games.size && mmSizes().includes(games.size)) $('mmSize').value = games.size;
$('gNew').onclick = () => { mmNew(); $('gNew').blur(); };
$('mmFs').onclick = () => { $('mmFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
function mmCheck() {  // vérification : chaque taille tient dans le plateau sans chevauchement, logo entier et assez grand, paquet en paires
  const bad = [];
  if (Object.keys(LOGOS).length < 24) bad.push('logos ' + Object.keys(LOGOS).length);
  for (const size of mmSizes()) {
    const [cols, rows] = size.split('x').map(Number), L = mmLay(cols, rows), n = cols * rows;
    if (L.s < 2 || L.s * 12 > Math.min(L.w, L.h) - 6) bad.push('logo ' + size);
    for (let i = 0; i < n; i++) {
      const [x, y] = L.at(i);
      if (x < 2 || y < TOP + 2 || x + L.w > W - 2 || y + L.h > H - 1) { bad.push('dehors ' + size); break; }
      if (i % cols && x < L.at(i - 1)[0] + L.w + 2) { bad.push('serré ' + size); break; }
      if (i >= cols && y < L.at(i - cols)[1] + L.h + 3) { bad.push('serré ' + size); break; }
    }
  }
  const keep = mm; mmNew('8x6'); const cnt = {}; for (const c of mm.cards) cnt[c.k] = (cnt[c.k] || 0) + 1;
  if (mm.cards.length !== 48 || Object.values(cnt).some(v => v !== 2)) bad.push('paires');
  mm = keep; if (keep) mmInfo();
  return bad.length ? bad.join(', ') : 'ok';
}
console.assert(mmCheck() === 'ok', 'mémoire', mmCheck());
cv.__mm = { st: () => mm, check: mmCheck, lay: mmLay, flip: i => mmFlip(i), size: s => { $('mmSize').value = s; mmNew(); } };
ctx.onOpen(() => { if (!mm) mmNew(); gameLoop(LP, mmUpdate, mmDraw); mmInfo(); });

}
