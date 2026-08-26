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
  // Fase B — nuove categorie e sezioni di approfondimento (§5 handoff)
  ['poltrona-vitarelax', '#b3a086', '#6b5138'],
  ['tavolo-sedie', '#cabb9f', '#8a6c47'],
  ['zona-pranzo', '#ad9a7e', '#654e34'],
  ['cameretta', '#d1c3ab', '#9a7c52'],
  ['rete-cuorflex', '#c4b69c', '#7d6244'],
  ['bagno-scavolini', '#c7bca9', '#7a6650'],
  ['mobile-bagno', '#b8a98d', '#6f5a3c'],
  ['zona-giorno', '#c0af92', '#725c3c'],
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
