/* User-provided logo geometry, rasterized locally without runtime libraries. */
const fs = require("fs"),
  path = require("path"),
  zlib = require("zlib"),
  crypto = require("crypto");
const shapes = [
  {
    color: "orange",
    points: [
      [206, 351],
      [206, 365],
      [212, 378],
      [221, 386],
      [237, 391],
      [502, 390],
      [471, 337],
      [461, 329],
      [453, 326],
      [232, 326],
      [216, 334],
      [208, 345],
    ],
  },
  {
    color: "orange",
    points: [
      [112, 252],
      [112, 267],
      [117, 277],
      [127, 286],
      [140, 290],
      [441, 289],
      [411, 239],
      [403, 232],
      [394, 228],
      [138, 228],
      [124, 234],
      [117, 241],
    ],
  },
  {
    color: "orange",
    points: [
      [8, 149],
      [8, 166],
      [12, 175],
      [19, 183],
      [36, 191],
      [383, 190],
      [351, 136],
      [340, 126],
      [330, 123],
      [37, 123],
      [29, 125],
      [18, 132],
      [12, 139],
    ],
  },
  {
    color: "orange",
    points: [
      [37, 34],
      [36, 55],
      [40, 65],
      [50, 77],
      [61, 83],
      [70, 85],
      [345, 85],
      [357, 91],
      [362, 96],
      [472, 275],
      [566, 434],
      [598, 492],
      [604, 486],
      [731, 308],
      [566, 50],
      [555, 36],
      [545, 27],
      [521, 14],
      [497, 8],
      [67, 8],
      [50, 16],
      [42, 24],
    ],
  },
  {
    color: "teal",
    points: [
      [1188, 78],
      [927, 78],
      [568, 583],
      [554, 598],
      [544, 605],
      [526, 613],
      [499, 620],
      [489, 628],
      [347, 835],
      [581, 835],
      [597, 833],
      [630, 823],
      [656, 809],
      [677, 793],
      [695, 775],
      [707, 760],
      [1087, 224],
    ],
  },
];
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(b) {
  let c = 0xffffffff;
  for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(name, data) {
  const n = Buffer.from(name),
    b = Buffer.alloc(data.length + 12);
  b.writeUInt32BE(data.length, 0);
  n.copy(b, 4);
  data.copy(b, 8);
  b.writeUInt32BE(crc32(Buffer.concat([n, data])), b.length - 4);
  return b;
}
function png(w, h, rgba) {
  const hdr = Buffer.alloc(13);
  hdr.writeUInt32BE(w, 0);
  hdr.writeUInt32BE(h, 4);
  hdr[8] = 8;
  hdr[9] = 6;
  const rows = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) rgba.copy(rows, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", hdr),
    chunk("IDAT", zlib.deflateSync(rows, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
function render(w, h, fitWidth, bg) {
  const ss = 3,
    W = w * ss,
    H = h * ss,
    b = Buffer.alloc(W * H * 4),
    scale = (fitWidth / 1195) * ss,
    ox = ((w - fitWidth) / 2) * ss,
    oy = ((h - (fitWidth * 843) / 1195) / 2) * ss;
  if (bg)
    for (let i = 0; i < b.length; i += 4) {
      b[i] = bg[0];
      b[i + 1] = bg[1];
      b[i + 2] = bg[2];
      b[i + 3] = 255;
    }
  for (const s of shapes) {
    const pts = s.points.map(([x, y]) => [x * scale + ox, y * scale + oy]);
    const ymin = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[1])))),
      ymax = Math.min(H - 1, Math.ceil(Math.max(...pts.map((p) => p[1]))));
    for (let y = ymin; y <= ymax; y++) {
      const cross = [],
        cy = y + 0.5;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const a = pts[i],
          d = pts[j];
        if (a[1] > cy !== d[1] > cy)
          cross.push(a[0] + ((cy - a[1]) * (d[0] - a[0])) / (d[1] - a[1]));
      }
      cross.sort((a, b) => a - b);
      for (let n = 0; n + 1 < cross.length; n += 2)
        for (
          let x = Math.max(0, Math.ceil(cross[n] - 0.5));
          x < Math.min(W, Math.ceil(cross[n + 1] - 0.5));
          x++
        ) {
          const i = (y * W + x) * 4,
            t = Math.max(0, Math.min(1, (y - oy) / (843 * scale)));
          if (s.color === "orange") {
            b[i] = 255;
            b[i + 1] = Math.round(136 - 8 * t);
            b[i + 2] = 3;
          } else {
            b[i] = 4;
            b[i + 1] = 75;
            b[i + 2] = 81;
          }
          b[i + 3] = 255;
        }
    }
  }
  const out = Buffer.alloc(w * h * 4),
    count = ss * ss;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        blue = 0,
        a = 0;
      for (let yy = 0; yy < ss; yy++)
        for (let xx = 0; xx < ss; xx++) {
          const i = ((y * ss + yy) * W + x * ss + xx) * 4;
          r += b[i] * b[i + 3];
          g += b[i + 1] * b[i + 3];
          blue += b[i + 2] * b[i + 3];
          a += b[i + 3];
        }
      const j = (y * w + x) * 4;
      if (a) {
        out[j] = Math.round(r / a);
        out[j + 1] = Math.round(g / a);
        out[j + 2] = Math.round(blue / a);
      }
      out[j + 3] = Math.round(a / count);
    }
  return png(w, h, out);
}
const dir = path.resolve(__dirname, "../assets/brand");
fs.mkdirSync(dir, { recursive: true });
for (const [name, w, h, fit, bg] of [
  ["ybm-mark.png", 512, 361, 512, null],
  ["ybm-app-icon.png", 1024, 1024, 650, [248, 247, 243]],
  ["ybm-adaptive-foreground.png", 1024, 1024, 650, null],
]) {
  const bytes = render(w, h, fit, bg);
  fs.writeFileSync(path.join(dir, name), bytes);
  console.log(
    name +
      " " +
      w +
      "x" +
      h +
      " " +
      bytes.length +
      " bytes sha256=" +
      crypto.createHash("sha256").update(bytes).digest("hex"),
  );
}
