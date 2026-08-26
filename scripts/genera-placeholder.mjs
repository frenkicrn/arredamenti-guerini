// Genera foto segnaposto finché il cliente non fornisce quelle reali.
// Tonalità coerenti con la palette "Sala espositiva" (sabbia/noce/inchiostro):
// un degradé verticale tenue per ogni voce, non un colore piatto.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const DEST = 'src/assets/prodotti';
mkdirSync(DEST, { recursive: true });

const foto = [
  ['camera-matrimoniale', '#c9bba6', '#8b6b4a'],
  ['cucina-moderna', '#b79a78', '#6b4e30'],
  ['divano-tre-posti', '#a99b86', '#5f4730'],
  ['materasso-memory', '#d6ccbc', '#9c8a6e'],
  ['parete-soggiorno', '#bba88c', '#77604a'],
  ['forno-incasso', '#a6947c', '#5a4a38'],
  ['hero-showroom', '#3a2e22', '#1e1712'],
];

for (const [nome, da, a] of foto) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stop-color="${da}" />
        <stop offset="100%" stop-color="${a}" />
      </linearGradient>
    </defs>
    <rect width="1600" height="1200" fill="url(#g)" />
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(`${DEST}/${nome}.jpg`);
  console.log(`creato ${DEST}/${nome}.jpg`);
}
