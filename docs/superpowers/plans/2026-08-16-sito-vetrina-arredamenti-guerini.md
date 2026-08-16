# Sito vetrina Arredamenti Guerini — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sito vetrina statico (4 pagine) per Arredamenti Guerini snc, deployabile su Cloudflare Pages a costo zero.

**Architecture:** Astro 5 con output statico puro; prodotti come content collection markdown con immagini ottimizzate in build; dati del negozio centralizzati in `src/data/`; JavaScript solo per filtri gallery, lightbox e invio form (Web3Forms).

**Tech Stack:** Astro 5.x, @astrojs/sitemap, sharp (già dipendenza di Astro, usato per generare i placeholder), CSS vanilla, Web3Forms.

**Spec:** `docs/superpowers/specs/2026-08-16-sito-vetrina-arredamenti-guerini-design.md`

## Global Constraints

- Output 100% statico: nessun adapter SSR, nessun framework UI (no React/Vue), niente backend.
- JavaScript client solo in tre punti: filtro gallery, lightbox, invio form contatti.
- Tutti i testi del sito in italiano; `<html lang="it">`.
- Dati del negozio (telefono, indirizzo, orari, social) SOLO in `src/data/negozio.ts` — mai hardcodati nelle pagine.
- Categorie prodotti (slug esatti): `camere`, `cucine`, `divani`, `materassi`, `soggiorno`, `elettrodomestici`.
- Dati in attesa dal cliente (telefono, email, via, chiave Web3Forms) vanno marcati con commento `// DA CONFERMARE COL CLIENTE` e elencati nel README — mai inventati come definitivi.
- Ogni task termina con `npm run build` verde prima del commit.
- Target finale Lighthouse ≥ 90 (performance, SEO, accessibilità).

---

### Task 1: Scaffold del progetto Astro + sitemap + stili base

**Files:**
- Create: progetto Astro nella root (template minimal: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg`, `.gitignore`)
- Modify: `astro.config.mjs` (proprietà `site` + integrazione sitemap)
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: `src/styles/global.css` con i design token CSS (`--sfondo`, `--superficie`, `--testo`, `--testo-tenue`, `--accento`, `--accento-scuro`, `--bordo`, `--raggio`) e le classi condivise `.contenitore`, `.bottone`, `.badge`, `.sezione`, `.griglia-schede` usate da tutti i task successivi.

- [ ] **Step 1: Verifica prerequisiti**

Run: `node --version && npm --version`
Expected: Node ≥ 20. Se manca, fermarsi e segnalarlo all'utente.

- [ ] **Step 2: Scaffold Astro (template minimal, nella root corrente)**

```bash
cd /home/fracore/projects/arredamenti_guerini
npm create astro@latest . -- --template minimal --no-install --no-git --yes
npm install
npx astro add sitemap --yes
```

Nota: la root contiene già `docs/` e `.git/`; se `create-astro` chiede conferma per la directory non vuota, accettare. Non re-inizializzare git.

- [ ] **Step 3: Configura `site` in astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // DA AGGIORNARE quando si acquista il dominio .it
  site: 'https://arredamenti-guerini.pages.dev',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Crea `src/styles/global.css`**

```css
/* Design token — palette calda da mobilificio (legno/crema) */
:root {
  --sfondo: #faf7f2;
  --superficie: #ffffff;
  --testo: #2b2520;
  --testo-tenue: #6b5f53;
  --accento: #8a6240;
  --accento-scuro: #6d4c31;
  --bordo: #e6ddd1;
  --raggio: 10px;
  --contenitore: 1100px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: var(--sfondo);
  color: var(--testo);
  line-height: 1.6;
}

h1, h2, h3 {
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.2;
  font-weight: 600;
}

img { max-width: 100%; height: auto; display: block; }
a { color: var(--accento-scuro); }

.contenitore {
  max-width: var(--contenitore);
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.sezione { padding-block: 3rem; }
.sezione h2 { font-size: 1.75rem; margin-top: 0; }

.bottone {
  display: inline-block;
  background: var(--accento);
  color: #fff;
  padding: 0.65rem 1.4rem;
  border-radius: var(--raggio);
  border: none;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
}
.bottone:hover { background: var(--accento-scuro); }

.badge {
  display: inline-block;
  background: #2e6e46;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 99px;
}

.griglia-schede {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

/* Header */
.sito-header {
  background: var(--superficie);
  border-bottom: 1px solid var(--bordo);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-riga {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-block: 0.85rem;
}
.logo { font-size: 1.25rem; text-decoration: none; color: var(--testo); }
.logo strong { color: var(--accento); }
.sito-header nav { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.sito-header nav a { text-decoration: none; color: var(--testo-tenue); }
.sito-header nav a[aria-current='page'] { color: var(--accento-scuro); font-weight: 600; }

/* Footer */
.sito-footer {
  background: #2b2520;
  color: #d8cfc4;
  margin-top: 3rem;
  padding-block: 2.5rem;
  font-size: 0.95rem;
}
.sito-footer a { color: #f0e8dd; }
.footer-colonne {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}
.sito-footer h3 { color: #fff; font-size: 1.05rem; margin-top: 0; }
.sito-footer ul { list-style: none; padding: 0; margin: 0; }

/* Scheda prodotto */
.scheda-prodotto {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  overflow: hidden;
}
.scheda-foto {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  cursor: zoom-in;
  background: none;
}
.scheda-foto img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%; }
.scheda-info { padding: 0.9rem 1rem 1.1rem; }
.scheda-info h3 { margin: 0 0 0.25rem; font-size: 1.1rem; }
.scheda-info .marchio { margin: 0 0 0.4rem; color: var(--testo-tenue); font-size: 0.9rem; }

/* Filtri gallery */
.filtri {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 1.5rem;
}
.filtri button {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: 99px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--testo-tenue);
}
.filtri button.attivo {
  background: var(--accento);
  border-color: var(--accento);
  color: #fff;
}

/* Lightbox */
dialog.lightbox {
  border: none;
  border-radius: var(--raggio);
  padding: 0;
  max-width: min(92vw, 1000px);
  background: var(--superficie);
}
dialog.lightbox::backdrop { background: rgba(20, 15, 10, 0.75); }
dialog.lightbox img { max-height: 80vh; object-fit: contain; margin-inline: auto; }
dialog.lightbox p { margin: 0; padding: 0.75rem 1rem; text-align: center; }

/* Form */
.form-contatti { display: grid; gap: 1rem; max-width: 480px; }
.form-contatti label { display: grid; gap: 0.3rem; font-weight: 600; }
.form-contatti input,
.form-contatti textarea {
  font: inherit;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  background: var(--superficie);
}
.form-contatti .honeypot { position: absolute; left: -9999px; }
.form-contatti .esito { font-weight: 600; }

/* Hero */
.hero { position: relative; color: #fff; }
.hero img { width: 100%; height: min(70vh, 560px); object-fit: cover; }
.hero-testo {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  background: rgba(25, 18, 12, 0.45);
  padding: 1.5rem;
}
.hero-testo h1 { font-size: clamp(1.9rem, 5vw, 3.2rem); margin: 0 0 0.5rem; }
.hero-testo p { font-size: 1.15rem; margin: 0 0 1.5rem; }

/* Banner consegna */
.banner-consegna {
  background: var(--accento);
  color: #fff;
  text-align: center;
  padding: 0.7rem 1.25rem;
  font-size: 0.95rem;
}
```

- [ ] **Step 5: Importa il CSS nella pagina placeholder e builda**

Sostituire il contenuto di `src/pages/index.astro` (verrà riscritta nel Task 5):

```astro
---
import '../styles/global.css';
---
<html lang="it">
  <head><meta charset="utf-8" /><title>Arredamenti Guerini</title></head>
  <body><h1>In costruzione</h1></body>
</html>
```

Run: `npm run build`
Expected: build completata, `dist/index.html` e `dist/sitemap-index.xml` presenti.

Run: `grep -q "In costruzione" dist/index.html && echo OK`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro con sitemap e stili base"
```

---

### Task 2: Dati del negozio, marchi, servizi e content collection prodotti

**Files:**
- Create: `src/data/negozio.ts`, `src/data/marchi.ts`, `src/data/servizi.ts`
- Create: `src/content.config.ts`
- Create: `scripts/genera-placeholder.mjs`
- Create: `src/assets/prodotti/*.jpg` (generati dallo script), `src/content/prodotti/*.md` (6 esempi, uno per categoria)

**Interfaces:**
- Produces:
  - `NEGOZIO` e `CATEGORIE` da `src/data/negozio.ts` (shape esatte sotto)
  - `MARCHI: { nome: string; prodotti: string }[]` da `src/data/marchi.ts`
  - `SERVIZI: { nome: string; descrizione: string }[]` e `NOTA_SERVIZI: string` da `src/data/servizi.ts`
  - Collection `prodotti` interrogabile con `getCollection('prodotti')`; frontmatter: `titolo: string`, `categoria: enum`, `marchio?: string`, `foto: image()`, `prontaConsegna: boolean`, `inEvidenza: boolean`

- [ ] **Step 1: Crea `src/data/negozio.ts`**

```ts
export const NEGOZIO = {
  nome: 'Arredamenti Guerini snc',
  claim: 'Arrediamo la tua casa dal progetto al montaggio',
  descrizione:
    'Negozio di arredamenti a Sale Marasino, sul lago d’Iseo: cucine, camere, divani, materassi e soggiorni dei migliori marchi, con progettazione e montaggio compresi in zona Brescia.',
  indirizzo: {
    via: 'Via Roma 1', // DA CONFERMARE COL CLIENTE
    cap: '25057',
    comune: 'Sale Marasino',
    provincia: 'BS',
  },
  telefono: '+39 030 000 0000', // DA CONFERMARE COL CLIENTE
  whatsapp: '+39 330 000 0000', // DA CONFERMARE COL CLIENTE
  email: 'info@arredamentiguerini.it', // DA CONFERMARE COL CLIENTE
  facebook: 'https://www.facebook.com/arredamentiguerinisnc/',
  instagram: '', // DA CONFERMARE COL CLIENTE (vuoto = link non mostrato)
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Arredamenti+Guerini+Sale+Marasino&output=embed',
  orari: [
    { giorni: 'Lunedì', orario: 'Chiuso' }, // DA CONFERMARE COL CLIENTE
    { giorni: 'Martedì – Sabato', orario: '9:00–12:00 · 15:00–19:00' },
    { giorni: 'Domenica', orario: 'Chiuso' },
  ],
  consegna:
    'Consegna a partire da 1 mese · alcuni articoli in pronta consegna',
  web3formsKey: 'INSERIRE_CHIAVE_WEB3FORMS', // DA CONFERMARE COL CLIENTE
};

export const CATEGORIE = [
  { slug: 'camere', nome: 'Camere' },
  { slug: 'cucine', nome: 'Cucine' },
  { slug: 'divani', nome: 'Divani' },
  { slug: 'materassi', nome: 'Materassi' },
  { slug: 'soggiorno', nome: 'Mobili soggiorno' },
  { slug: 'elettrodomestici', nome: 'Elettrodomestici' },
] as const;
```

- [ ] **Step 2: Crea `src/data/marchi.ts` e `src/data/servizi.ts`**

```ts
// src/data/marchi.ts
export const MARCHI = [
  { nome: 'Scavolini', prodotti: 'Cucine, bagno e living (+ elettrodomestici)' },
  { nome: 'Gruppo Colombini', prodotti: 'Camerette, camere e living' },
  { nome: 'Stilfar Italia', prodotti: 'Letti imbottiti' },
  { nome: 'Cuorflex', prodotti: 'Reti e materassi' },
  { nome: 'Biel Divani', prodotti: 'Divani' },
  { nome: 'Vitarelax', prodotti: 'Poltrone elettriche' },
  { nome: 'Zamagna Italia', prodotti: 'Tavoli e sedie' },
  { nome: 'Ingenia Casa', prodotti: 'Tavoli e sedie' },
];
```

```ts
// src/data/servizi.ts
export const SERVIZI = [
  {
    nome: 'Progettazione',
    descrizione: 'Progettiamo i tuoi spazi su misura, con rendering e consigli d’arredo.',
  },
  {
    nome: 'Rilievo misure',
    descrizione: 'Veniamo noi a prendere le misure a casa tua, senza impegno.',
  },
  {
    nome: 'Montaggio',
    descrizione: 'Consegna e montaggio a regola d’arte da parte dei nostri tecnici.',
  },
  {
    nome: 'Pagamenti personalizzati',
    descrizione: 'Soluzioni di pagamento flessibili, su misura per le tue esigenze.',
  },
];

export const NOTA_SERVIZI = 'Servizi compresi in zona Brescia';
```

- [ ] **Step 3: Crea `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const prodotti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prodotti' }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      categoria: z.enum([
        'camere',
        'cucine',
        'divani',
        'materassi',
        'soggiorno',
        'elettrodomestici',
      ]),
      marchio: z.string().optional(),
      foto: image(),
      prontaConsegna: z.boolean().default(false),
      inEvidenza: z.boolean().default(false),
    }),
});

export const collections = { prodotti };
```

- [ ] **Step 4: Crea `scripts/genera-placeholder.mjs` ed eseguilo**

```js
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
```

Run: `node scripts/genera-placeholder.mjs`
Expected: 7 file jpg creati in `src/assets/prodotti/`.

- [ ] **Step 5: Crea i 6 prodotti markdown di esempio**

Creare `src/content/prodotti/` con questi file (contenuto body: 1 frase descrittiva placeholder):

`camera-matrimoniale.md`:
```markdown
---
titolo: Camera matrimoniale moderna
categoria: camere
marchio: Gruppo Colombini
foto: ../../assets/prodotti/camera-matrimoniale.jpg
inEvidenza: true
---
Camera matrimoniale completa di armadio scorrevole e letto imbottito.
```

`cucina-moderna.md`:
```markdown
---
titolo: Cucina moderna con isola
categoria: cucine
marchio: Scavolini
foto: ../../assets/prodotti/cucina-moderna.jpg
inEvidenza: true
---
Cucina componibile con isola centrale e piano in quarzo.
```

`divano-tre-posti.md`:
```markdown
---
titolo: Divano tre posti in tessuto
categoria: divani
marchio: Biel Divani
foto: ../../assets/prodotti/divano-tre-posti.jpg
prontaConsegna: true
inEvidenza: true
---
Divano tre posti sfoderabile, disponibile in vari rivestimenti.
```

`materasso-memory.md`:
```markdown
---
titolo: Materasso memory
categoria: materassi
marchio: Cuorflex
foto: ../../assets/prodotti/materasso-memory.jpg
prontaConsegna: true
---
Materasso in memory foam a 7 zone, sfoderabile e anallergico.
```

`parete-soggiorno.md`:
```markdown
---
titolo: Parete attrezzata soggiorno
categoria: soggiorno
foto: ../../assets/prodotti/parete-soggiorno.jpg
inEvidenza: true
---
Parete attrezzata componibile con vani a giorno e ante laccate.
```

`forno-incasso.md`:
```markdown
---
titolo: Forno da incasso
categoria: elettrodomestici
foto: ../../assets/prodotti/forno-incasso.jpg
---
Elettrodomestici da incasso dei migliori marchi, abbinati alla tua cucina.
```

- [ ] **Step 6: Verifica build e commit**

Run: `npm run build`
Expected: build verde (la validazione completa dello schema avverrà nel Task 4 quando la collection sarà interrogata; qui si verifica che i file nuovi non rompano il build).

```bash
git add -A
git commit -m "feat: dati negozio, marchi, servizi e content collection prodotti"
```

---

### Task 3: Layout base, Header, Footer, 404 e robots.txt

**Files:**
- Create: `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`
- Create: `src/pages/404.astro`, `public/robots.txt`

**Interfaces:**
- Consumes: `NEGOZIO` da `src/data/negozio.ts`; classi CSS da `global.css` (Task 1)
- Produces: `Layout.astro` con `Props { titolo: string; descrizione: string }` e uno `<slot />` — tutte le pagine dei task successivi lo usano così:
  `<Layout titolo="..." descrizione="..."> ...contenuto... </Layout>`

- [ ] **Step 1: Crea `src/components/Header.astro`**

```astro
---
const pathname = Astro.url.pathname.replace(/\/$/, '') || '/';
const voci = [
  { href: '/', testo: 'Home' },
  { href: '/prodotti', testo: 'Prodotti' },
  { href: '/chi-siamo', testo: 'Chi siamo' },
  { href: '/contatti', testo: 'Contatti' },
];
---
<header class="sito-header">
  <div class="contenitore header-riga">
    <a href="/" class="logo">Arredamenti <strong>Guerini</strong></a>
    <nav aria-label="Principale">
      {voci.map((v) => (
        <a href={v.href === '/' ? '/' : v.href + '/'} aria-current={pathname === v.href ? 'page' : undefined}>
          {v.testo}
        </a>
      ))}
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Crea `src/components/Footer.astro`**

```astro
---
import { NEGOZIO } from '../data/negozio';
const anno = new Date().getFullYear();
---
<footer class="sito-footer">
  <div class="contenitore footer-colonne">
    <div>
      <h3>{NEGOZIO.nome}</h3>
      <p>
        {NEGOZIO.indirizzo.via}<br />
        {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia})
      </p>
    </div>
    <div>
      <h3>Contatti</h3>
      <ul>
        <li><a href={`tel:${NEGOZIO.telefono.replaceAll(' ', '')}`}>{NEGOZIO.telefono}</a></li>
        <li><a href={`https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`}>WhatsApp</a></li>
        <li><a href={`mailto:${NEGOZIO.email}`}>{NEGOZIO.email}</a></li>
        <li><a href={NEGOZIO.facebook}>Facebook</a></li>
        {NEGOZIO.instagram && <li><a href={NEGOZIO.instagram}>Instagram</a></li>}
      </ul>
    </div>
    <div>
      <h3>Orari</h3>
      <ul>
        {NEGOZIO.orari.map((o) => (
          <li>{o.giorni}: {o.orario}</li>
        ))}
      </ul>
    </div>
  </div>
  <div class="contenitore" style="margin-top: 2rem; font-size: 0.85rem;">
    © {anno} {NEGOZIO.nome} — {NEGOZIO.consegna}
  </div>
</footer>
```

- [ ] **Step 3: Crea `src/layouts/Layout.astro`** (con JSON-LD FurnitureStore)

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { NEGOZIO } from '../data/negozio';

interface Props {
  titolo: string;
  descrizione: string;
}
const { titolo, descrizione } = Astro.props;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: NEGOZIO.nome,
  description: NEGOZIO.descrizione,
  telephone: NEGOZIO.telefono,
  email: NEGOZIO.email,
  url: Astro.site?.toString(),
  address: {
    '@type': 'PostalAddress',
    streetAddress: NEGOZIO.indirizzo.via,
    postalCode: NEGOZIO.indirizzo.cap,
    addressLocality: NEGOZIO.indirizzo.comune,
    addressRegion: NEGOZIO.indirizzo.provincia,
    addressCountry: 'IT',
  },
  sameAs: [NEGOZIO.facebook, NEGOZIO.instagram].filter(Boolean),
};
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titolo} · Arredamenti Guerini</title>
    <meta name="description" content={descrizione} />
    <meta property="og:title" content={`${titolo} · Arredamenti Guerini`} />
    <meta property="og:description" content={descrizione} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="it_IT" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <Header />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Crea `src/pages/404.astro` e `public/robots.txt`**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout titolo="Pagina non trovata" descrizione="La pagina che cerchi non esiste.">
  <section class="sezione contenitore" style="text-align: center;">
    <h1>Pagina non trovata</h1>
    <p>La pagina che cerchi non esiste o è stata spostata.</p>
    <p>
      <a class="bottone" href="/">Torna alla home</a>
      <a class="bottone" href="/prodotti/">Guarda i prodotti</a>
    </p>
  </section>
</Layout>
```

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://arredamenti-guerini.pages.dev/sitemap-index.xml
```

- [ ] **Step 5: Verifica build**

Run: `npm run build`
Expected: build verde.

Run: `grep -q "FurnitureStore" dist/404.html && grep -q "Pagina non trovata" dist/404.html && echo OK`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout base con SEO/JSON-LD, header, footer, 404 e robots"
```

---

### Task 4: Pagina Prodotti (griglia, filtri, lightbox)

**Files:**
- Create: `src/components/SchedaProdotto.astro`
- Create: `src/pages/prodotti.astro`

**Interfaces:**
- Consumes: `Layout.astro` (Task 3); collection `prodotti` e `CATEGORIE` (Task 2); classi CSS `.griglia-schede`, `.filtri`, `.scheda-prodotto`, `.badge`, `dialog.lightbox` (Task 1)
- Produces: `SchedaProdotto.astro` con `Props { prodotto: CollectionEntry<'prodotti'> }` — riusato dalla Home (Task 5). Ogni scheda ha `data-categoria`, un `<button class="scheda-foto">` e dentro `h3` col titolo.

- [ ] **Step 1: Crea `src/components/SchedaProdotto.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  prodotto: CollectionEntry<'prodotti'>;
}
const { prodotto } = Astro.props;
const { titolo, categoria, marchio, foto, prontaConsegna } = prodotto.data;
---
<article class="scheda-prodotto" data-categoria={categoria}>
  <button type="button" class="scheda-foto" aria-label={`Ingrandisci foto: ${titolo}`}>
    <Image
      src={foto}
      alt={titolo}
      widths={[400, 800, 1200]}
      sizes="(max-width: 700px) 100vw, 33vw"
      loading="lazy"
    />
  </button>
  <div class="scheda-info">
    <h3>{titolo}</h3>
    {marchio && <p class="marchio">{marchio}</p>}
    {prontaConsegna && <span class="badge">Pronta consegna</span>}
  </div>
</article>
```

- [ ] **Step 2: Crea `src/pages/prodotti.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import SchedaProdotto from '../components/SchedaProdotto.astro';
import { CATEGORIE, NEGOZIO } from '../data/negozio';

const prodotti = await getCollection('prodotti');
---
<Layout
  titolo="Prodotti"
  descrizione="Cucine, camere, divani, materassi, soggiorni ed elettrodomestici in esposizione da Arredamenti Guerini a Sale Marasino."
>
  <section class="sezione contenitore">
    <h1>I nostri prodotti</h1>
    <p>{NEGOZIO.consegna}.</p>

    <div class="filtri" role="group" aria-label="Filtra per categoria">
      <button type="button" class="attivo" data-filtro="tutti">Tutti</button>
      {CATEGORIE.map((c) => (
        <button type="button" data-filtro={c.slug}>{c.nome}</button>
      ))}
    </div>

    <div class="griglia-schede">
      {prodotti.map((p) => <SchedaProdotto prodotto={p} />)}
    </div>
  </section>

  <dialog class="lightbox">
    <img src="" alt="" />
    <p></p>
  </dialog>
</Layout>

<script>
  // Filtro per categoria
  const bottoni = document.querySelectorAll<HTMLButtonElement>('[data-filtro]');
  const schede = document.querySelectorAll<HTMLElement>('.scheda-prodotto');
  bottoni.forEach((bottone) => {
    bottone.addEventListener('click', () => {
      bottoni.forEach((b) => b.classList.toggle('attivo', b === bottone));
      const filtro = bottone.dataset.filtro;
      schede.forEach((scheda) => {
        scheda.toggleAttribute(
          'hidden',
          filtro !== 'tutti' && scheda.dataset.categoria !== filtro
        );
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector<HTMLDialogElement>('dialog.lightbox')!;
  const lightboxImg = lightbox.querySelector('img')!;
  const lightboxTesto = lightbox.querySelector('p')!;
  schede.forEach((scheda) => {
    scheda.querySelector('.scheda-foto')?.addEventListener('click', () => {
      const img = scheda.querySelector('img')!;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightboxTesto.textContent = scheda.querySelector('h3')!.textContent;
      lightbox.showModal();
    });
  });
  lightbox.addEventListener('click', () => lightbox.close());
</script>
```

- [ ] **Step 3: Verifica build e contenuto**

Run: `npm run build`
Expected: build verde (qui si valida davvero lo schema della collection: errori di frontmatter emergerebbero ora).

Run: `grep -c "scheda-prodotto" dist/prodotti/index.html`
Expected: ≥ 6 (una per prodotto).

Run: `grep -q "Pronta consegna" dist/prodotti/index.html && grep -q "data-filtro=\"cucine\"" dist/prodotti/index.html && echo OK`
Expected: `OK`

- [ ] **Step 4: Verifica manuale rapida**

Run: `npm run preview` e aprire `http://localhost:4321/prodotti/`
Expected: griglia visibile, filtri funzionanti, click su una foto apre il lightbox. Chiudere il preview.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: pagina prodotti con griglia, filtri per categoria e lightbox"
```

---

### Task 5: Home page

**Files:**
- Modify: `src/pages/index.astro` (riscrittura completa del placeholder del Task 1)

**Interfaces:**
- Consumes: `Layout.astro` (Task 3), `SchedaProdotto.astro` (Task 4), `NEGOZIO`/`CATEGORIE` (Task 2), immagine `src/assets/prodotti/hero-showroom.jpg` (Task 2)

- [ ] **Step 1: Riscrivi `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import Layout from '../layouts/Layout.astro';
import SchedaProdotto from '../components/SchedaProdotto.astro';
import { NEGOZIO } from '../data/negozio';
import heroFoto from '../assets/prodotti/hero-showroom.jpg';

const inEvidenza = (await getCollection('prodotti', (p) => p.data.inEvidenza)).slice(0, 4);
---
<Layout titolo="Home" descrizione={NEGOZIO.descrizione}>
  <section class="hero">
    <Image src={heroFoto} alt="Showroom di Arredamenti Guerini" widths={[800, 1400, 2000]} sizes="100vw" loading="eager" />
    <div class="hero-testo">
      <div>
        <h1>{NEGOZIO.nome}</h1>
        <p>{NEGOZIO.claim}</p>
        <a class="bottone" href="/prodotti/">Scopri i prodotti</a>
      </div>
    </div>
  </section>

  <div class="banner-consegna">{NEGOZIO.consegna}</div>

  <section class="sezione contenitore">
    <h2>Il negozio</h2>
    <p>{NEGOZIO.descrizione}</p>
    <a href="/chi-siamo/">Scopri i nostri servizi e i marchi che trattiamo →</a>
  </section>

  <section class="sezione contenitore">
    <h2>In evidenza</h2>
    <div class="griglia-schede">
      {inEvidenza.map((p) => <SchedaProdotto prodotto={p} />)}
    </div>
    <p style="margin-top: 1.5rem;">
      <a class="bottone" href="/prodotti/">Vedi tutti i prodotti</a>
    </p>
  </section>

  <section class="sezione contenitore">
    <h2>Vieni a trovarci</h2>
    <p>
      {NEGOZIO.indirizzo.via}, {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia})
      — <a href={`tel:${NEGOZIO.telefono.replaceAll(' ', '')}`}>{NEGOZIO.telefono}</a>
    </p>
    <p>
      <a class="bottone" href="/contatti/">Contattaci</a>
      <a class="bottone" href={`https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`}>Scrivici su WhatsApp</a>
    </p>
  </section>
</Layout>
```

Nota: le schede in evidenza sulla Home non hanno lightbox (il click non fa nulla): accettabile per ora, il lightbox vive solo su /prodotti/.

- [ ] **Step 2: Verifica build e contenuto**

Run: `npm run build`
Expected: build verde.

Run: `grep -q "banner-consegna" dist/index.html && grep -q "In evidenza" dist/index.html && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: home page con hero, banner consegna e prodotti in evidenza"
```

---

### Task 6: Pagina Chi siamo (storia, servizi, marchi)

**Files:**
- Create: `src/pages/chi-siamo.astro`

**Interfaces:**
- Consumes: `Layout.astro` (Task 3), `SERVIZI`/`NOTA_SERVIZI` (Task 2), `MARCHI` (Task 2), `NEGOZIO` (Task 2)

- [ ] **Step 1: Crea `src/pages/chi-siamo.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { NEGOZIO } from '../data/negozio';
import { SERVIZI, NOTA_SERVIZI } from '../data/servizi';
import { MARCHI } from '../data/marchi';
---
<Layout
  titolo="Chi siamo"
  descrizione="Arredamenti Guerini: servizi di progettazione, rilievo misure e montaggio, e i marchi che trattiamo — Scavolini, Gruppo Colombini e altri."
>
  <section class="sezione contenitore">
    <h1>Chi siamo</h1>
    <!-- TESTO PROVVISORIO: da sostituire con la storia fornita dal cliente -->
    <p>
      {NEGOZIO.nome} è il punto di riferimento per l'arredamento a
      {NEGOZIO.indirizzo.comune} e sul lago d'Iseo: da anni accompagniamo le
      famiglie della zona nella scelta di cucine, camere, divani e soggiorni,
      seguendo ogni progetto dalla prima idea al montaggio finale.
    </p>
  </section>

  <section class="sezione contenitore">
    <h2>I nostri servizi</h2>
    <div class="griglia-schede">
      {SERVIZI.map((s) => (
        <article class="scheda-prodotto">
          <div class="scheda-info">
            <h3>{s.nome}</h3>
            <p>{s.descrizione}</p>
          </div>
        </article>
      ))}
    </div>
    <p style="margin-top: 1rem;"><strong>{NOTA_SERVIZI}</strong>. {NEGOZIO.consegna}.</p>
  </section>

  <section class="sezione contenitore">
    <h2>I nostri marchi</h2>
    <div class="griglia-schede">
      {MARCHI.map((m) => (
        <article class="scheda-prodotto">
          <div class="scheda-info">
            <h3>{m.nome}</h3>
            <p class="marchio">{m.prodotti}</p>
          </div>
        </article>
      ))}
    </div>
    <!-- Quando il cliente fornisce/approva i loghi, sostituire i nomi testuali
         con immagini in src/assets/marchi/ e aggiungere logo?: image() allo schema -->
  </section>
</Layout>
```

- [ ] **Step 2: Verifica build e contenuto**

Run: `npm run build`
Expected: build verde.

Run: `grep -q "Scavolini" dist/chi-siamo/index.html && grep -q "Rilievo misure" dist/chi-siamo/index.html && grep -q "zona Brescia" dist/chi-siamo/index.html && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: pagina chi siamo con servizi e marchi"
```

---

### Task 7: Pagina Contatti (form Web3Forms, mappa, orari)

**Files:**
- Create: `src/components/FormContatti.astro`
- Create: `src/pages/contatti.astro`

**Interfaces:**
- Consumes: `Layout.astro` (Task 3), `NEGOZIO` (Task 2), classi `.form-contatti` (Task 1)

- [ ] **Step 1: Crea `src/components/FormContatti.astro`**

```astro
---
import { NEGOZIO } from '../data/negozio';
---
<form class="form-contatti" data-telefono={NEGOZIO.telefono}>
  <input type="hidden" name="access_key" value={NEGOZIO.web3formsKey} />
  <input type="hidden" name="subject" value="Nuova richiesta dal sito Arredamenti Guerini" />
  <input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" autocomplete="off" />

  <label>
    Nome e cognome
    <input type="text" name="name" required autocomplete="name" />
  </label>
  <label>
    Telefono o email
    <input type="text" name="recapito" required autocomplete="tel" />
  </label>
  <label>
    Come possiamo aiutarti?
    <textarea name="message" rows="5" required></textarea>
  </label>

  <button type="submit" class="bottone">Invia richiesta</button>
  <p class="esito" role="status" hidden></p>
</form>

<script>
  const form = document.querySelector<HTMLFormElement>('.form-contatti')!;
  const esito = form.querySelector<HTMLElement>('.esito')!;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    esito.hidden = false;
    esito.textContent = 'Invio in corso…';
    try {
      const risposta = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const dati = await risposta.json();
      if (!dati.success) throw new Error(dati.message);
      esito.textContent = 'Richiesta inviata! Ti ricontatteremo al più presto.';
      form.reset();
    } catch {
      esito.textContent = `Invio non riuscito. Chiamaci al ${form.dataset.telefono} o scrivici su WhatsApp.`;
    }
  });
</script>
```

- [ ] **Step 2: Crea `src/pages/contatti.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import FormContatti from '../components/FormContatti.astro';
import { NEGOZIO } from '../data/negozio';
---
<Layout
  titolo="Contatti"
  descrizione="Contatta Arredamenti Guerini a Sale Marasino: telefono, WhatsApp, email, orari di apertura e modulo per richiedere un preventivo."
>
  <section class="sezione contenitore">
    <h1>Contatti</h1>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem;">
      <div>
        <h2>Scrivici</h2>
        <p>Richiedi un preventivo o un appuntamento: ti rispondiamo al più presto.</p>
        <FormContatti />
      </div>

      <div>
        <h2>Dove siamo</h2>
        <p>
          {NEGOZIO.indirizzo.via}, {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia})<br />
          Telefono: <a href={`tel:${NEGOZIO.telefono.replaceAll(' ', '')}`}>{NEGOZIO.telefono}</a><br />
          WhatsApp: <a href={`https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`}>scrivici</a><br />
          Email: <a href={`mailto:${NEGOZIO.email}`}>{NEGOZIO.email}</a>
        </p>
        <iframe
          src={NEGOZIO.mapsEmbedUrl}
          title={`Mappa: ${NEGOZIO.nome}`}
          width="100%"
          height="300"
          style="border: 0; border-radius: var(--raggio);"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <h2>Orari di apertura</h2>
        <ul>
          {NEGOZIO.orari.map((o) => (
            <li><strong>{o.giorni}</strong>: {o.orario}</li>
          ))}
        </ul>

        <p>
          Seguici su <a href={NEGOZIO.facebook}>Facebook</a>
          {NEGOZIO.instagram && <> e <a href={NEGOZIO.instagram}>Instagram</a></>}
          per le ultime novità.
        </p>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verifica build e contenuto**

Run: `npm run build`
Expected: build verde.

Run: `grep -rq "web3forms.com/submit" dist/ && echo OK`
Expected: `OK` (ricerca ricorsiva perché Astro può bundlare lo script in un file JS separato).

Run: `grep -q "Orari di apertura" dist/contatti/index.html && grep -q "botcheck" dist/contatti/index.html && echo OK`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: pagina contatti con form Web3Forms, mappa e orari"
```

---

### Task 8: README, verifica finale e istruzioni di deploy

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: tutto il sito costruito nei task 1–7.

- [ ] **Step 1: Crea `README.md`**

```markdown
# Sito vetrina — Arredamenti Guerini snc

Sito statico costruito con [Astro](https://astro.build), pensato per Cloudflare Pages.

## Comandi

| Comando | Effetto |
|---|---|
| `npm install` | installa le dipendenze |
| `npm run dev` | sviluppo locale su http://localhost:4321 |
| `npm run build` | build di produzione in `dist/` |
| `npm run preview` | anteprima locale del build |

## Aggiornare i contenuti

- **Aggiungere un prodotto:** copia una foto in `src/assets/prodotti/` e crea un
  file `.md` in `src/content/prodotti/` (vedi i file esistenti per il formato).
  Categorie valide: `camere`, `cucine`, `divani`, `materassi`, `soggiorno`,
  `elettrodomestici`. `inEvidenza: true` lo mostra in Home.
- **Telefono, orari, indirizzo, social:** `src/data/negozio.ts` (un solo punto).
- **Marchi e servizi:** `src/data/marchi.ts` e `src/data/servizi.ts`.

## Dati in attesa dal cliente

- [ ] Via/indirizzo esatto, telefono, WhatsApp, email (in `src/data/negozio.ts`)
- [ ] Orari di apertura reali (in `src/data/negozio.ts`)
- [ ] Chiave Web3Forms (vedi sotto) al posto di `INSERIRE_CHIAVE_WEB3FORMS`
- [ ] Conferma marchio "Gruppo Colombini" (nella lista cliente: "Gruppo colombiani")
- [ ] Foto reali dei prodotti (sostituire i placeholder in `src/assets/prodotti/`)
- [ ] Testo "Chi siamo" definitivo, eventuale logo del negozio, profilo Instagram
- [ ] Loghi dei marchi (dai press kit ufficiali) per la pagina Chi siamo

## Form contatti (Web3Forms)

1. Andare su https://web3forms.com e creare una Access Key gratuita usando
   l'email del negozio (è l'indirizzo che riceverà le richieste).
2. Incollare la chiave in `src/data/negozio.ts` → `web3formsKey`.
3. Testare un invio reale dalla pagina /contatti/ del sito pubblicato.

## Deploy su Cloudflare Pages (gratuito)

1. Pubblicare questo repository su GitHub.
2. Su https://dash.cloudflare.com → Workers & Pages → Create → Pages →
   Connect to Git → selezionare il repo.
3. Impostazioni build: framework preset **Astro**, build command `npm run build`,
   output directory `dist`.
4. Ogni push su `main` pubblica automaticamente. URL gratuito: `<progetto>.pages.dev`.

## Dominio .it (quando si è pronti)

1. Registrare il dominio (es. arredamentiguerini.it) su un registrar (~10-15 €/anno).
2. In Cloudflare: aggiungere il sito, puntare i nameserver del registrar a Cloudflare.
3. In Pages → Custom domains → aggiungere il dominio (SSL automatico).
4. Aggiornare `site` in `astro.config.mjs` e la riga `Sitemap:` in `public/robots.txt`
   con il dominio definitivo, poi fare push.
```

- [ ] **Step 2: Verifica finale completa**

Run: `npm run build`
Expected: build verde.

Run:
```bash
for f in index prodotti/index chi-siamo/index contatti/index 404; do
  test -f "dist/$f.html" && echo "OK dist/$f.html" || echo "MANCA dist/$f.html";
done
test -f dist/sitemap-index.xml && echo "OK sitemap"
```
Expected: 5 righe `OK ...` + `OK sitemap`.

- [ ] **Step 3: Verifica manuale + Lighthouse**

Run: `npm run preview`
Aprire nel browser: Home, /prodotti/ (testare filtri e lightbox), /chi-siamo/, /contatti/ (il form con chiave placeholder mostrerà il messaggio di errore con invito a chiamare: comportamento atteso finché manca la chiave reale), pagina inesistente (404). Se disponibile Chrome/Lighthouse: audit su Home e Prodotti, target ≥ 90 su performance/SEO/accessibilità; annotare eventuali punti sotto soglia come follow-up.

- [ ] **Step 4: Commit finale**

```bash
git add -A
git commit -m "docs: README con gestione contenuti e istruzioni di deploy"
```

---

## Follow-up fuori piano (richiedono l'utente o il cliente)

1. **Rifinitura visiva col plugin `frontend-design`**: al riavvio della sessione verificare che la skill sia caricata e usarla per una passata di polish su palette/tipografia/layout.
2. Creazione repo GitHub + collegamento Cloudflare Pages (richiede account dell'utente).
3. Chiave Web3Forms con l'email reale del negozio.
4. Inserimento dati reali del cliente (vedi checklist nel README).
5. Acquisto dominio `.it` e collegamento (vedi README).
