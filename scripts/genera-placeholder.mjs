// Genera foto segnaposto finché il cliente non fornisce quelle reali.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const DEST = 'src/assets/prodotti';
mkdirSync(DEST, { recursive: true });

const foto = [
  ['camera-matrimoniale', '#7d6a58'],
  ['cucina-moderna', '#8a6240'],
  ['divano-tre-posti', '#5f6e5f'],
  ['materasso-memory', '#9a8a74'],
  ['parete-soggiorno', '#6b5a6e'],
  ['forno-incasso', '#55606b'],
  ['hero-showroom', '#4a3c2f'],
];

for (const [nome, colore] of foto) {
  await sharp({
    create: { width: 1600, height: 1200, channels: 3, background: colore },
  })
    .jpeg({ quality: 70 })
    .toFile(`${DEST}/${nome}.jpg`);
  console.log(`creato ${DEST}/${nome}.jpg`);
}
