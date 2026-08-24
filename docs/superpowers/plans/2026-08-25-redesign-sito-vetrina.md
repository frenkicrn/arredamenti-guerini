# Redesign UX/UI/SEO sito vetrina — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Far evolvere il sito Astro esistente in un sito a 13 pagine (Home, Prodotti + 6 categorie, Marchi, Servizi, Chi siamo, Contatti con FAQ, 404) con navigazione mobile, barra CTA fissa, testi locali/SEO riscritti e la firma visiva "la misura".

**Architecture:** Approccio "Evoluzione": stessi stack, token e font; nuovi file dati (`categorie.ts`, `faq.ts`, `marchi.ts`/`servizi.ts` arricchiti) da cui si generano le pagine categoria (`getStaticPaths`) e le sezioni; componenti Astro riusabili (Hero, Quota, Righello, CardCategoria, CardMarchio, ServizioVoce, Faq, Breadcrumb, CtaFinale, MenuMobile, BarraMobile, GalleriaProdotti); JavaScript solo per menu mobile, filtri+lightbox e form.

**Tech Stack:** Astro 7.2.2 (statico), Node 24 (`.nvmrc`), CSS vanilla con custom properties, @fontsource-variable Bitter+Karla (già presenti), test dati con `node scripts/verifica-dati.ts` (type stripping nativo di Node 24, nessuna dipendenza).

**Spec:** `docs/superpowers/specs/2026-08-24-redesign-sito-vetrina-design.md`

## Global Constraints

- Output 100% statico; nessun framework UI; **nessuna nuova dipendenza npm**.
- JavaScript client SOLO: menu mobile (Header), filtri+lightbox (GalleriaProdotti), invio form (FormContatti).
- Tutti i testi in italiano naturale; **nessun dato inventato**: telefono/WhatsApp/email/via/orari restano quelli in `negozio.ts` marcati `DA CONFERMARE COL CLIENTE`; niente anni di fondazione, nomi, prezzi, tassi, condizioni di pagamento, "gratuito".
- Nessuna sezione recensioni.
- Dati del negozio SOLO da `src/data/negozio.ts`; categorie/marchi/servizi/FAQ SOLO dai rispettivi file in `src/data/`.
- Slug categorie esatti (ordine incluso): `camere`, `cucine`, `divani`, `materassi`, `soggiorno`, `elettrodomestici`.
- Vocabolario CTA fisso: **Richiedi un preventivo** (→ `/contatti/`), **Vieni in negozio** (→ `/contatti/#dove-siamo`), **Scrivici su WhatsApp** (→ wa.me).
- Trappola Astro: testo e `{espressione}` che si susseguono nel copy visibile devono stare **sulla stessa riga** (a cavallo di newline lo spazio sparisce).
- Verifiche su `dist/`: l'HTML è compresso → contare con `grep -o '<pattern>' file | wc -l`, mai `grep -c`.
- Firma "la misura" (`Righello`, `Quota`): al massimo una occorrenza per viewport, mai come puro ornamento.
- Contrasto testo/sfondo ≥ 4.5:1; focus visibile; `prefers-reduced-motion` rispettato.
- Ogni task termina con `npm run build` verde (e `npm test` verde dal Task 1 in poi) prima del commit.

---

### Task 1: Dati — categorie, marchi, servizi, FAQ, negozio + test automatico

**Files:**
- Create: `src/data/categorie.ts`, `src/data/faq.ts`, `scripts/verifica-dati.ts`
- Modify: `src/data/negozio.ts` (rimuovere `CATEGORIE`, aggiungere `claimBreve`, `mapsDirectionsUrl`), `src/data/marchi.ts`, `src/data/servizi.ts`, `package.json` (script `test`), `src/pages/prodotti.astro:5` (import di `CATEGORIE` dal nuovo file)

**Interfaces:**
- Produces:
  - `src/data/categorie.ts`: `interface Categoria { slug, nome, etichetta, titoloSeo, descrizioneSeo, intro, marchi: string[], foto: string }`, `export const CATEGORIE: Categoria[]` (6 elementi, ordine degli slug fisso)
  - `src/data/marchi.ts`: `interface Marchio { slug, nome, prodotti, descrizione, categorie: string[] }`, `export const MARCHI: Marchio[]` (8)
  - `src/data/servizi.ts`: `interface Servizio { slug, nome, breve, descrizione }`, `export const SERVIZI: Servizio[]` (4), `NOTA_SERVIZI`
  - `src/data/faq.ts`: `interface Voce { domanda, risposta }`, `export const FAQ: Voce[]` (5)
  - `src/data/negozio.ts`: `NEGOZIO.claimBreve: string`, `NEGOZIO.mapsDirectionsUrl: string` (oltre ai campi esistenti)
  - `npm test` → esegue `node scripts/verifica-dati.ts`

- [ ] **Step 1: Scrivi il test (fallirà: i file non esistono)**

`scripts/verifica-dati.ts`:
```ts
// Verifica di coerenza dei dati del sito. Eseguire con: npm test
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CATEGORIE } from '../src/data/categorie.ts';
import { MARCHI } from '../src/data/marchi.ts';
import { SERVIZI } from '../src/data/servizi.ts';
import { FAQ } from '../src/data/faq.ts';
import { NEGOZIO } from '../src/data/negozio.ts';

const SLUG_ATTESI = ['camere', 'cucine', 'divani', 'materassi', 'soggiorno', 'elettrodomestici'];

assert.deepEqual(CATEGORIE.map((c) => c.slug), SLUG_ATTESI, 'slug categorie diversi da quelli della collection');

const slugMarchi = new Set(MARCHI.map((m) => m.slug));
assert.equal(MARCHI.length, 8, 'devono esserci 8 marchi');
assert.equal(slugMarchi.size, 8, 'slug marchi duplicati');

for (const c of CATEGORIE) {
  assert.ok(c.marchi.length > 0, `categoria ${c.slug}: nessun marchio collegato`);
  for (const m of c.marchi) assert.ok(slugMarchi.has(m), `categoria ${c.slug}: marchio "${m}" inesistente`);
  assert.ok(c.titoloSeo.includes('Sale Marasino'), `categoria ${c.slug}: titoloSeo senza località`);
  assert.ok(c.descrizioneSeo.length <= 155, `categoria ${c.slug}: descrizioneSeo di ${c.descrizioneSeo.length} caratteri (max 155)`);
  assert.ok(existsSync(`src/assets/prodotti/${c.foto}.jpg`), `categoria ${c.slug}: foto ${c.foto}.jpg mancante`);
}

for (const m of MARCHI) {
  assert.ok(m.categorie.length > 0, `marchio ${m.slug}: nessuna categoria`);
  for (const s of m.categorie) assert.ok(SLUG_ATTESI.includes(s), `marchio ${m.slug}: categoria "${s}" inesistente`);
  const collegato = CATEGORIE.some((c) => c.marchi.includes(m.slug));
  assert.ok(collegato, `marchio ${m.slug}: nessuna categoria lo elenca`);
}

assert.equal(SERVIZI.length, 4, 'devono esserci 4 servizi');
assert.equal(FAQ.length, 5, 'devono esserci 5 FAQ');
assert.ok(NEGOZIO.mapsDirectionsUrl.startsWith('https://'), 'mapsDirectionsUrl non valido');
assert.ok(NEGOZIO.claimBreve.length > 0, 'claimBreve vuoto');

console.log('dati OK');
```

In `package.json`, dentro `"scripts"`, aggiungere: `"test": "node scripts/verifica-dati.ts"`. Verificare che `package.json` contenga `"type": "module"` (lo scaffold Astro lo imposta; se manca, aggiungerlo — serve a Node per eseguire gli `import` del test). Node 24 esegue i `.ts` con type stripping nativo: il test usa solo sintassi cancellabile (interface, annotazioni), nessun enum.

- [ ] **Step 2: Esegui il test e verifica che fallisca**

Run: `npm test`
Expected: FAIL con `Cannot find module .../src/data/categorie.ts`.

- [ ] **Step 3: Crea `src/data/categorie.ts`**

```ts
export interface Categoria {
  slug: string;
  nome: string;
  /** Etichetta breve mostrata "a quota" sulla card */
  etichetta: string;
  /** <title> completo della pagina categoria */
  titoloSeo: string;
  /** meta description (max 155 caratteri) */
  descrizioneSeo: string;
  /** Introduzione della pagina categoria (2-3 frasi) */
  intro: string;
  /** slug dei marchi (src/data/marchi.ts) */
  marchi: string[];
  /** nome file (senza estensione) in src/assets/prodotti/ */
  foto: string;
}

export const CATEGORIE: Categoria[] = [
  {
    slug: 'camere',
    nome: 'Camere',
    etichetta: 'camere e camerette',
    titoloSeo: 'Camere e camerette a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Camere matrimoniali, camerette e letti imbottiti a Sale Marasino (BS). Progettazione, rilievo misure e montaggio compresi in zona Brescia.',
    intro:
      'Armadi, letti e camerette pensati per gli spazi veri delle case sul lago: veniamo a misurare la stanza e progettiamo la camera intorno a come la vivi. Sistemi componibili Gruppo Colombini e letti imbottiti Stilfar Italia, con il montaggio compreso.',
    marchi: ['gruppo-colombini', 'stilfar-italia'],
    foto: 'camera-matrimoniale',
  },
  {
    slug: 'cucine',
    nome: 'Cucine',
    etichetta: 'cucine su misura',
    titoloSeo: 'Cucine Scavolini a Sale Marasino e sul Lago d’Iseo | Arredamenti Guerini',
    descrizioneSeo:
      'Cucine Scavolini componibili e su misura a Sale Marasino (BS): progetto, rilievo misure e montaggio compresi in zona Brescia.',
    intro:
      'La cucina è la stanza in cui si passa più tempo: la progettiamo insieme sulle misure della tua casa, scegliendo tra le composizioni Scavolini finiture, piani ed elettrodomestici. Dal disegno al montaggio ci occupiamo noi di tutto.',
    marchi: ['scavolini'],
    foto: 'cucina-moderna',
  },
  {
    slug: 'divani',
    nome: 'Divani',
    etichetta: 'divani e poltrone',
    titoloSeo: 'Divani e poltrone relax a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Divani Biel e poltrone elettriche Vitarelax a Sale Marasino (BS). Provali in negozio: consegna e montaggio compresi in zona Brescia.',
    intro:
      'Un divano si sceglie sedendosi: in negozio trovi i modelli Biel Divani da provare, con rivestimenti e misure su richiesta, e le poltrone elettriche Vitarelax per il relax di tutti i giorni.',
    marchi: ['biel-divani', 'vitarelax'],
    foto: 'divano-tre-posti',
  },
  {
    slug: 'materassi',
    nome: 'Materassi',
    etichetta: 'riposo su misura',
    titoloSeo: 'Materassi e reti a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Materassi e reti Cuorflex a Sale Marasino (BS): consulenza in negozio per scegliere il sistema letto giusto. Alcuni articoli in pronta consegna.',
    intro:
      'Dormire bene dipende dalla coppia materasso e rete: ti aiutiamo a scegliere tra i sistemi Cuorflex in base a come dormi, senza fretta. Alcuni modelli sono in pronta consegna.',
    marchi: ['cuorflex'],
    foto: 'materasso-memory',
  },
  {
    slug: 'soggiorno',
    nome: 'Mobili soggiorno',
    etichetta: 'living e zona pranzo',
    titoloSeo: 'Mobili soggiorno, tavoli e sedie a Sale Marasino | Arredamenti Guerini',
    descrizioneSeo:
      'Pareti attrezzate, living, tavoli e sedie a Sale Marasino (BS): Gruppo Colombini, Scavolini, Zamagna e Ingenia Casa. Montaggio compreso in zona Brescia.',
    intro:
      'Pareti attrezzate e living componibili Gruppo Colombini e Scavolini, tavoli e sedie Zamagna Italia e Ingenia Casa: componiamo il soggiorno sulle misure della stanza e sulle abitudini di chi la vive.',
    marchi: ['gruppo-colombini', 'scavolini', 'zamagna-italia', 'ingenia-casa'],
    foto: 'parete-soggiorno',
  },
  {
    slug: 'elettrodomestici',
    nome: 'Elettrodomestici',
    etichetta: 'incasso abbinato',
    titoloSeo: 'Elettrodomestici da incasso a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Elettrodomestici da incasso abbinati alla tua cucina Scavolini, a Sale Marasino (BS): scelta, consegna e installazione con il resto della composizione.',
    intro:
      'Forni, piani cottura, frigoriferi e lavastoviglie da incasso scelti insieme alla cucina, così misure e finiture combaciano. Li consegniamo e installiamo noi, con il resto della composizione.',
    marchi: ['scavolini'],
    foto: 'forno-incasso',
  },
];
```

- [ ] **Step 4: Riscrivi `src/data/marchi.ts`**

```ts
export interface Marchio {
  slug: string;
  nome: string;
  /** Cosa produce, in breve (dal cliente) */
  prodotti: string;
  /** 1-2 frasi su cosa offriamo di questo marchio in negozio */
  descrizione: string;
  /** slug delle categorie (src/data/categorie.ts) */
  categorie: string[];
}

export const MARCHI: Marchio[] = [
  {
    slug: 'scavolini',
    nome: 'Scavolini',
    prodotti: 'Cucine, bagno e living (+ elettrodomestici)',
    descrizione:
      'Tra i marchi italiani di cucine più conosciuti, che da noi trovi anche nelle soluzioni bagno e living. Progettiamo la composizione sulle tue misure e la montiamo noi.',
    categorie: ['cucine', 'soggiorno', 'elettrodomestici'],
  },
  {
    slug: 'gruppo-colombini',
    nome: 'Gruppo Colombini',
    prodotti: 'Camerette, camere e living',
    descrizione:
      'Camere, camerette e living componibili: sistemi flessibili che crescono con la famiglia, con finiture coordinate tra le stanze.',
    categorie: ['camere', 'soggiorno'],
  },
  {
    slug: 'stilfar-italia',
    nome: 'Stilfar Italia',
    prodotti: 'Letti imbottiti',
    descrizione:
      'Letti imbottiti in tessuto e pelle, con o senza contenitore, nelle misure standard e su richiesta.',
    categorie: ['camere'],
  },
  {
    slug: 'cuorflex',
    nome: 'Cuorflex',
    prodotti: 'Reti e materassi',
    descrizione:
      'Materassi e reti per ogni modo di dormire: in negozio li provi e ti consigliamo la combinazione giusta.',
    categorie: ['materassi'],
  },
  {
    slug: 'biel-divani',
    nome: 'Biel Divani',
    prodotti: 'Divani',
    descrizione:
      'Divani fissi e angolari con rivestimenti e misure su richiesta. In esposizione, da provare.',
    categorie: ['divani'],
  },
  {
    slug: 'vitarelax',
    nome: 'Vitarelax',
    prodotti: 'Poltrone elettriche',
    descrizione:
      'Poltrone relax elettriche per il comfort di tutti i giorni, da provare in negozio.',
    categorie: ['divani'],
  },
  {
    slug: 'zamagna-italia',
    nome: 'Zamagna Italia',
    prodotti: 'Tavoli e sedie',
    descrizione:
      'Tavoli fissi e allungabili e sedie per la zona pranzo, da abbinare al soggiorno.',
    categorie: ['soggiorno'],
  },
  {
    slug: 'ingenia-casa',
    nome: 'Ingenia Casa',
    prodotti: 'Tavoli e sedie',
    descrizione:
      'Tavoli e sedie per cucina e soggiorno, in tante finiture per completare la composizione.',
    categorie: ['soggiorno'],
  },
];
```

- [ ] **Step 5: Riscrivi `src/data/servizi.ts`**

```ts
export interface Servizio {
  slug: string;
  nome: string;
  /** Una frase, per la Home */
  breve: string;
  /** 3-4 frasi, per la pagina Servizi */
  descrizione: string;
}

export const SERVIZI: Servizio[] = [
  {
    slug: 'progettazione',
    nome: 'Progettazione',
    breve: 'Disegniamo la stanza sulle tue misure e sulle tue abitudini.',
    descrizione:
      'Partiamo da come vivi la casa, non dal catalogo. Disegniamo la composizione sulle misure reali della stanza, scegliamo insieme finiture e materiali e ti mostriamo il progetto prima di ordinare, così ogni scelta è chiara.',
  },
  {
    slug: 'rilievo-misure',
    nome: 'Rilievo misure',
    breve: 'Veniamo noi a misurare la stanza prima dell’ordine.',
    descrizione:
      'Prima di ordinare veniamo a casa tua a prendere le misure: pareti, prese, finestre, pendenze. È il passaggio che evita sorprese al montaggio ed è compreso nel servizio in zona Brescia.',
  },
  {
    slug: 'montaggio',
    nome: 'Montaggio',
    breve: 'Consegna e montaggio con la nostra squadra.',
    descrizione:
      'Consegniamo e montiamo con la nostra squadra, che conosce il progetto dall’inizio. A fine lavoro la stanza è pronta da usare.',
  },
  {
    slug: 'pagamenti-personalizzati',
    nome: 'Pagamenti personalizzati',
    breve: 'Formule di pagamento su misura, da concordare in negozio.',
    descrizione:
      'Ogni casa ha tempi e priorità diverse: concordiamo insieme la formula di pagamento più adatta. Chiedi in negozio: ti spieghiamo le possibilità.',
  },
];

export const NOTA_SERVIZI = 'Servizi compresi in zona Brescia';
```

- [ ] **Step 6: Crea `src/data/faq.ts`**

```ts
export interface Voce {
  domanda: string;
  risposta: string;
}

export const FAQ: Voce[] = [
  {
    domanda: 'Quanto tempo ci vuole per la consegna?',
    risposta:
      'Per gli arredi su ordinazione i tempi partono da circa un mese dalla conferma. Alcuni articoli in esposizione sono disponibili in pronta consegna: chiedici quali.',
  },
  {
    domanda: 'In quale zona consegnate e montate?',
    risposta:
      'Consegna, rilievo misure e montaggio sono compresi in zona Brescia, Lago d’Iseo e dintorni. Per altre zone contattaci: valutiamo insieme.',
  },
  {
    domanda: 'Come funziona il rilievo misure?',
    risposta:
      'Fissiamo un appuntamento e veniamo noi a misurare la stanza prima dell’ordine, così il progetto è fatto sulle dimensioni reali della tua casa.',
  },
  {
    domanda: 'Quali forme di pagamento accettate?',
    risposta:
      'Concordiamo in negozio la formula più adatta, con soluzioni personalizzate. Contattaci per i dettagli.',
  },
  {
    domanda: 'Il preventivo è impegnativo?',
    risposta:
      'No: il preventivo si basa sul progetto e sulle misure e serve a farti scegliere con chiarezza. Richiedilo dal modulo, per telefono o su WhatsApp.',
  },
];
```

- [ ] **Step 7: Aggiorna `src/data/negozio.ts`**

Rimuovere completamente il blocco `export const CATEGORIE = [...] as const;` (ora vive in `categorie.ts`). Sostituire i campi `claim` e `descrizione` e aggiungere `claimBreve` e `mapsDirectionsUrl` (il resto del file resta identico, commenti `DA CONFERMARE` inclusi):

```ts
  claim: 'Arrediamo la tua casa, dal progetto al montaggio',
  claimBreve: 'Mobili e cucine a Sale Marasino, sul Lago d’Iseo',
  descrizione:
    'Negozio di arredamento a conduzione familiare a Sale Marasino, sul Lago d’Iseo: cucine, camere, divani, materassi e soggiorni dei marchi che conosciamo bene, con progettazione, rilievo misure e montaggio compresi in zona Brescia.',
```
e, subito dopo `mapsEmbedUrl`:
```ts
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Arredamenti+Guerini+Sale+Marasino',
```

- [ ] **Step 8: Aggiorna l'import in `src/pages/prodotti.astro`**

Riga 5: `import { CATEGORIE, NEGOZIO } from '../data/negozio';` → 
```ts
import { NEGOZIO } from '../data/negozio';
import { CATEGORIE } from '../data/categorie';
```

- [ ] **Step 9: Test e build**

Run: `npm test`
Expected: `dati OK`

Run: `npm run build`
Expected: build verde (5 pagine).

- [ ] **Step 10: Commit**

```bash
git add -A src/data scripts/verifica-dati.ts package.json src/pages/prodotti.astro
git commit -m "feat: dati categorie, marchi, servizi e FAQ con test di coerenza"
```

---

### Task 2: Design system — token, firma "la misura", CSS dei nuovi componenti

**Files:**
- Modify: `src/styles/global.css` (riscrittura completa: token nuovi, rimozione `.banner-consegna`, stili di tutti i componenti dei task 3-8)
- Create: `src/components/Righello.astro`, `src/components/Quota.astro`

**Interfaces:**
- Produces: classi CSS usate dai task successivi — `.meta-riga`, `.hero-quota`, `.quota`, `.righello`, `.nav-desktop`, `.header-cta`, `.menu-bottone`, `.menu-mobile`, `.menu-chiudi`, `.menu-contatti`, `.barra-mobile`, `.card-categoria`, `.card-categoria__etichetta`, `.griglia-categorie`, `.card-marchio`, `.card-marchio--estesa`, `.card-marchio__logo`, `.griglia-marchi`, `.servizio-voce`, `.griglia-servizi`, `.faq`, `.breadcrumb`, `.cta-finale`, `.vuoto`, `.sezione--stretta`, `.intro`; token `--t-display-1/2/3`, `--t-testo-2/3`, `--spazio-1…6`, `--barra-mobile-h`.
- `Righello.astro` (nessuna prop) → `<div class="righello" role="presentation"></div>`
- `Quota.astro` con `Props { da: string; a: string }` → linea di misura con due etichette.

**Nota per l'implementer:** invoca la skill `frontend-design:frontend-design` prima di scrivere il CSS e usa la sua guida per rifinire dettagli (spaziature, hover, stati) — ma **token, nomi di classe e struttura qui sotto sono il contratto** con gli altri task e non cambiano.

- [ ] **Step 1: Crea `src/components/Righello.astro` e `src/components/Quota.astro`**

```astro
---
// Righello.astro — divisore con tacche di metro: la firma "la misura".
// Solo CSS (repeating-linear-gradient), nessun id SVG duplicato.
---
<div class="righello" role="presentation"></div>
```

```astro
---
// Quota.astro — linea di misura con due etichette ("progetto ── montaggio")
interface Props {
  da: string;
  a: string;
}
const { da, a } = Astro.props;
---
<p class="quota" aria-label={`${da} — ${a}`}>
  <span class="quota__testo">{da}</span>
  <span class="quota__linea" aria-hidden="true"></span>
  <span class="quota__testo">{a}</span>
</p>
```

- [ ] **Step 2: Riscrivi `src/styles/global.css`**

```css
/* ============================================================
   Arredamenti Guerini — direzione "Bottega sul lago", evoluzione.
   Legno (noce) + acqua del lago d'Iseo (verde lago) su carta calda.
   Display: Bitter (slab serif)  ·  Testo: Karla (grottesca umanista)
   Firma: "la misura" — tacche di metro e quote dimensionali.
   Coppie testo/sfondo ≥ 4.5:1 (WCAG AA).
   ============================================================ */

:root {
  /* Palette */
  --carta: #f4f0e6;
  --superficie: #fcfaf4;
  --inchiostro: #26211a;
  --inchiostro-tenue: #5c5344;
  --verde-lago: #2c4a42;
  --verde-fondale: #24403a;
  --verde-notte: #1c2f2a;
  --noce: #7d4e2a;
  --noce-chiaro: #d9a86e;
  --bordo: #ddd4c2;
  /* Tipografia */
  --font-display: 'Bitter Variable', Georgia, serif;
  --font-testo: 'Karla Variable', system-ui, sans-serif;
  --t-display-1: clamp(2.2rem, 5vw, 3.4rem);
  --t-display-2: clamp(1.7rem, 3.2vw, 2.4rem);
  --t-display-3: clamp(1.2rem, 2vw, 1.45rem);
  --t-testo-1: 1.0625rem;
  --t-testo-2: 0.95rem;
  --t-testo-3: 0.8rem;
  /* Spaziature */
  --spazio-1: 0.5rem;
  --spazio-2: 1rem;
  --spazio-3: 1.5rem;
  --spazio-4: 2.5rem;
  --spazio-5: 4rem;
  --spazio-6: 6rem;
  /* Misure */
  --raggio: 3px;
  --contenitore: 1100px;
  --barra-mobile-h: 3.75rem;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-testo);
  font-size: var(--t-testo-1);
  background: var(--carta);
  color: var(--inchiostro);
  line-height: 1.65;
}

::selection { background: var(--verde-lago); color: var(--carta); }

h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.01em;
}
h1 { font-size: var(--t-display-1); }
h2 { font-size: var(--t-display-2); }
h3 { font-size: var(--t-display-3); }

img { max-width: 100%; height: auto; display: block; }
a { color: var(--noce); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { color: var(--verde-lago); }

:focus-visible { outline: 2px solid var(--noce); outline-offset: 2px; }
.sito-header :focus-visible,
.hero :focus-visible,
.menu-mobile :focus-visible,
.barra-mobile :focus-visible,
.cta-finale :focus-visible,
.sito-footer :focus-visible { outline-color: var(--noce-chiaro); }

.contenitore {
  max-width: var(--contenitore);
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.sezione { padding-block: var(--spazio-5); }
.sezione--stretta { padding-block: var(--spazio-4); }
.sezione h1 { margin: 0 0 var(--spazio-2); }
.sezione h2 { margin: 0 0 var(--spazio-3); }
.intro { font-size: 1.15rem; max-width: 62ch; margin: 0 0 var(--spazio-3); color: var(--inchiostro-tenue); }

/* Filetto di noce sopra i titoli di sezione */
.sezione h1::before,
.sezione h2::before {
  content: '';
  display: block;
  width: 2.5rem;
  height: 3px;
  background: var(--noce);
  margin-bottom: 0.8rem;
}
.centrato h1::before,
.centrato h2::before { margin-inline: auto; }

/* Utilità */
.centrato { text-align: center; }
.spazio-sopra { margin-top: var(--spazio-3); }
.azioni { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-block: var(--spazio-2) 0; }
.centrato .azioni { justify-content: center; }
.vuoto {
  padding: var(--spazio-4);
  text-align: center;
  border: 1px dashed var(--bordo);
  border-radius: var(--raggio);
  color: var(--inchiostro-tenue);
}

/* ---------- Firma: la misura ---------- */
.righello {
  height: 14px;
  margin-block: var(--spazio-2);
  color: var(--noce);
  border-bottom: 1px solid currentColor;
  background:
    repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 50px) left bottom / 100% 14px no-repeat,
    repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 10px) left bottom / 100% 6px no-repeat;
}
.quota {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 var(--spazio-3);
  font-family: var(--font-display);
  font-size: var(--t-testo-2);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.quota__linea {
  flex: 1;
  height: 1px;
  background: currentColor;
  position: relative;
  min-width: 3rem;
}
.quota__linea::before,
.quota__linea::after {
  content: '';
  position: absolute;
  top: -5px;
  width: 1px;
  height: 11px;
  background: currentColor;
}
.quota__linea::before { left: 0; }
.quota__linea::after { right: 0; }

/* ---------- Bottoni e badge ---------- */
.bottone {
  display: inline-block;
  background: var(--verde-lago);
  color: var(--superficie);
  padding: 0.7rem 1.5rem;
  border-radius: var(--raggio);
  border: 1px solid var(--verde-lago);
  font: inherit;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
}
.bottone:hover { background: var(--verde-notte); border-color: var(--verde-notte); color: var(--superficie); }
.bottone--secondario { background: transparent; border-color: var(--noce); color: var(--noce); }
.bottone--secondario:hover { background: var(--noce); border-color: var(--noce); color: var(--superficie); }
.bottone--chiaro { background: var(--carta); border-color: var(--carta); color: var(--verde-lago); }
.bottone--chiaro:hover { background: var(--noce-chiaro); border-color: var(--noce-chiaro); color: var(--verde-notte); }
.bottone--contorno-chiaro { background: transparent; border-color: var(--noce-chiaro); color: var(--carta); }
.bottone--contorno-chiaro:hover { background: var(--noce-chiaro); border-color: var(--noce-chiaro); color: var(--verde-notte); }

.badge {
  display: inline-block;
  background: var(--verde-lago);
  color: var(--superficie);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  border-radius: var(--raggio);
}

/* ---------- Griglie ---------- */
.griglia-schede,
.griglia-categorie,
.griglia-marchi,
.griglia-servizi {
  display: grid;
  gap: var(--spazio-3);
}
.griglia-schede { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
.griglia-categorie { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.griglia-marchi { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.griglia-servizi { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

/* ---------- Header ---------- */
.sito-header {
  background: var(--verde-fondale);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-riga {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spazio-2) var(--spazio-3);
  padding-block: 0.9rem;
}
.logo {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--carta);
  white-space: nowrap;
}
.logo:hover { color: var(--noce-chiaro); }
.logo strong { color: var(--noce-chiaro); font-weight: 700; }
.nav-desktop { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; }
.nav-desktop a:not(.bottone) {
  text-decoration: none;
  color: #cfc9ba;
  padding-block: 0.2rem;
  border-bottom: 2px solid transparent;
}
.nav-desktop a:not(.bottone):hover { color: var(--carta); }
.nav-desktop a[aria-current='page'] {
  color: var(--carta);
  font-weight: 700;
  border-bottom-color: var(--noce-chiaro);
}
.header-cta { padding: 0.5rem 1.1rem; margin-left: 0.5rem; }
.menu-bottone {
  display: none;
  font: inherit;
  font-weight: 700;
  background: transparent;
  color: var(--carta);
  border: 1px solid var(--noce-chiaro);
  border-radius: var(--raggio);
  padding: 0.45rem 0.9rem;
  cursor: pointer;
}

/* Menu mobile (pannello a tutto schermo, mostrato/nascosto con [hidden]) */
.menu-mobile {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: var(--verde-notte);
  color: var(--carta);
  padding: var(--spazio-3) 1.25rem var(--spazio-5);
  display: flex;
  flex-direction: column;
  gap: var(--spazio-3);
  overflow-y: auto;
}
.menu-mobile[hidden] { display: none; }
.menu-mobile__testa { display: flex; justify-content: space-between; align-items: center; }
.menu-chiudi {
  font: inherit;
  font-weight: 700;
  background: transparent;
  color: var(--carta);
  border: 1px solid var(--noce-chiaro);
  border-radius: var(--raggio);
  padding: 0.45rem 0.9rem;
  cursor: pointer;
}
.menu-mobile nav { display: grid; gap: 0.25rem; }
.menu-mobile nav a {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--carta);
  text-decoration: none;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(244, 240, 230, 0.15);
}
.menu-mobile nav a[aria-current='page'] { color: var(--noce-chiaro); }
.menu-contatti { display: grid; gap: 0.5rem; margin-top: auto; }
.menu-contatti a { color: var(--noce-chiaro); }
body.menu-aperto { overflow: hidden; }

@media (max-width: 899px) {
  .header-cta { display: none; }
  .nav-desktop { gap: 0.6rem 1rem; font-size: var(--t-testo-2); }
  html.js .nav-desktop { display: none; }
  html.js .menu-bottone { display: inline-block; }
}

/* ---------- Barra CTA mobile ---------- */
.barra-mobile {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  height: var(--barra-mobile-h);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--verde-notte);
  border-top: 2px solid var(--noce-chiaro);
}
.barra-mobile a {
  display: grid;
  place-content: center;
  text-align: center;
  color: var(--noce-chiaro);
  font-weight: 700;
  font-size: var(--t-testo-2);
  text-decoration: none;
  border-right: 1px solid rgba(244, 240, 230, 0.15);
}
.barra-mobile a:last-child { border-right: none; }
@media (min-width: 900px) {
  .barra-mobile { display: none; }
}
@media (max-width: 899px) {
  body { padding-bottom: var(--barra-mobile-h); }
}

/* ---------- Hero ---------- */
.hero { background: var(--verde-lago); color: var(--carta); }
.hero-griglia {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  padding-block: clamp(3rem, 7vw, 5.5rem);
}
.hero-quota { color: var(--noce-chiaro); }
.hero-testo h1 { margin: 0 0 0.75rem; color: var(--carta); }
.hero-testo p:not(.quota) {
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  color: #d9d3c4;
  margin: 0 0 1.75rem;
  max-width: 36ch;
}
.hero-cornice img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 10px solid var(--superficie);
  box-shadow: 14px 14px 0 var(--verde-notte);
}
.meta-riga {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 1.5rem;
  padding: 0.85rem 1.25rem;
  background: var(--superficie);
  border-bottom: 1px solid var(--bordo);
  font-size: var(--t-testo-2);
  color: var(--inchiostro-tenue);
  list-style: none;
  margin: 0;
}
.meta-riga li::before { content: '—'; color: var(--noce); margin-right: 0.5rem; }
@media (max-width: 800px) {
  .hero-griglia { grid-template-columns: 1fr; }
  .hero-cornice { order: -1; }
}

/* ---------- Card categoria (foto + nome + etichetta a quota) ---------- */
.card-categoria {
  position: relative;
  display: block;
  color: inherit;
  text-decoration: none;
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  overflow: hidden;
}
.card-categoria img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%; }
.card-categoria__testo { padding: 1rem 1.1rem 1.2rem; border-top: 1px solid var(--bordo); }
.card-categoria__testo h3 { margin: 0 0 0.35rem; }
.card-categoria__etichetta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: var(--t-testo-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--noce);
}
.card-categoria__etichetta::before,
.card-categoria__etichetta::after {
  content: '';
  height: 1px;
  width: 1.25rem;
  background: currentColor;
}
.card-categoria:hover h3 { color: var(--noce); }

/* ---------- Card marchio ---------- */
.card-marchio {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-left: 3px solid var(--noce);
  border-radius: var(--raggio);
  padding: 1.1rem 1.25rem;
}
.card-marchio h3 { margin: 0 0 0.3rem; }
.card-marchio .marchio { margin: 0; color: var(--inchiostro-tenue); font-size: var(--t-testo-2); }
.card-marchio--estesa .card-marchio__logo {
  display: grid;
  place-content: center;
  aspect-ratio: 16 / 9;
  margin-bottom: var(--spazio-2);
  background: var(--carta);
  border: 1px solid var(--bordo);
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--verde-lago);
  text-align: center;
  padding: 0.5rem;
}
.card-marchio--estesa p { margin: 0.5rem 0 0; }
.card-marchio__categorie { margin: 0.75rem 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; }
.card-marchio__categorie a {
  font-size: var(--t-testo-3);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid var(--bordo);
  border-radius: 99px;
  padding: 0.15rem 0.6rem;
}

/* ---------- Servizi ---------- */
.servizio-voce {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  padding: 1.25rem 1.35rem;
}
.servizio-voce h3 { margin: 0 0 0.5rem; }
.servizio-voce p { margin: 0; }
.servizio-voce--breve h3 { font-size: 1.05rem; }

/* ---------- FAQ ---------- */
.faq { display: grid; gap: 0.5rem; max-width: 760px; }
.faq details {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  padding: 0 1.1rem;
}
.faq summary {
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 600;
  padding: 0.9rem 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: '+'; color: var(--noce); font-weight: 700; }
.faq details[open] summary::after { content: '−'; }
.faq details p { margin: 0 0 1rem; }

/* ---------- Breadcrumb ---------- */
.breadcrumb ol { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0; margin: 0 0 var(--spazio-2); font-size: var(--t-testo-2); }
.breadcrumb li + li::before { content: '›'; margin-right: 0.4rem; color: var(--inchiostro-tenue); }
.breadcrumb a { text-decoration: none; }

/* ---------- CTA finale ---------- */
.cta-finale {
  background: var(--verde-lago);
  color: var(--carta);
  padding-block: var(--spazio-5);
  margin-top: var(--spazio-4);
}
.cta-finale h2 { color: var(--carta); margin: 0 0 0.5rem; }
.cta-finale h2::before { background: var(--noce-chiaro); }
.cta-finale p { margin: 0 0 var(--spazio-3); color: #d9d3c4; max-width: 50ch; }
.cta-finale .azioni { margin: 0; }

/* ---------- Footer ---------- */
.sito-footer {
  background: var(--verde-notte);
  color: #d5cfc0;
  border-top: 4px solid var(--noce);
  padding-block: 2.75rem;
  font-size: var(--t-testo-2);
}
.sito-footer a { color: #f0e8d8; }
.sito-footer a:hover { color: var(--noce-chiaro); }
.footer-colonne { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
.sito-footer h3 { color: var(--carta); font-size: 1.05rem; margin-top: 0; }
.sito-footer ul { list-style: none; padding: 0; margin: 0; }
.footer-legale {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(244, 240, 230, 0.18);
  font-size: 0.85rem;
}

/* ---------- Scheda prodotto ---------- */
.scheda-prodotto {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  overflow: hidden;
}
.scheda-foto { display: block; width: 100%; padding: 0; border: none; cursor: zoom-in; background: none; }
.scheda-foto img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%; }
.scheda-info { padding: 1rem 1.1rem 1.2rem; border-top: 1px solid var(--bordo); }
.scheda-info h3 { margin: 0 0 0.3rem; font-size: 1.12rem; }
.scheda-info .marchio { margin: 0 0 0.5rem; color: var(--inchiostro-tenue); font-size: 0.9rem; letter-spacing: 0.02em; }

@media (prefers-reduced-motion: no-preference) {
  .scheda-prodotto,
  .card-categoria { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .scheda-prodotto:hover,
  .card-categoria:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(38, 33, 26, 0.12); }
}

/* ---------- Filtri gallery ---------- */
.filtri { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-block: var(--spazio-3); }
.filtri button {
  background: var(--superficie);
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  padding: 0.45rem 1rem;
  cursor: pointer;
  font: inherit;
  font-size: var(--t-testo-2);
  color: var(--inchiostro-tenue);
}
.filtri button:hover { border-color: var(--noce); color: var(--noce); }
.filtri button.attivo { background: var(--verde-lago); border-color: var(--verde-lago); color: var(--superficie); font-weight: 700; }

/* ---------- Lightbox ---------- */
dialog.lightbox { border: none; border-radius: var(--raggio); padding: 0; max-width: min(92vw, 1000px); background: var(--superficie); }
dialog.lightbox::backdrop { background: rgba(28, 47, 42, 0.82); }
dialog.lightbox img { max-height: 80vh; object-fit: contain; margin-inline: auto; }
dialog.lightbox p { margin: 0; padding: 0.85rem 1rem; text-align: center; font-family: var(--font-display); }
.lightbox-chiudi {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: 50%;
  background: rgba(38, 33, 26, 0.72);
  color: var(--carta);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}
.lightbox-chiudi:hover { background: var(--verde-notte); }

/* ---------- Form ---------- */
.form-contatti { display: grid; gap: 1rem; max-width: 480px; }
.form-contatti label { display: grid; gap: 0.3rem; font-weight: 700; }
.form-contatti input,
.form-contatti textarea {
  font: inherit;
  font-weight: 400;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--bordo);
  border-radius: var(--raggio);
  background: var(--superficie);
  color: var(--inchiostro);
}
.form-contatti input:focus,
.form-contatti textarea:focus { border-color: var(--verde-lago); outline: 2px solid var(--verde-lago); outline-offset: 0; }
.form-contatti .honeypot { position: absolute; left: -9999px; }
.form-contatti .esito { font-weight: 700; }

/* ---------- Contatti ---------- */
.griglia-contatti { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }
.mappa { display: block; border: 8px solid var(--superficie); box-shadow: 0 0 0 1px var(--bordo); border-radius: var(--raggio); }
```

Nota: `.banner-consegna` e `.scheda-testo` sono stati rimossi di proposito. La Home (Task 5) e Chi siamo (Task 8) smettono di usarli; fino ad allora il banner in Home apparirà senza stile — accettato, transitorio.

- [ ] **Step 3: Build e verifica**

Run: `npm run build && npm test`
Expected: entrambi verdi.

Run: `grep -rho -- '--barra-mobile-h' dist/_astro/*.css | head -1`
Expected: `--barra-mobile-h`

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/components/Righello.astro src/components/Quota.astro
git commit -m "style: token, firma 'la misura' e CSS dei nuovi componenti"
```

---

### Task 3: Navigazione — Header con menu mobile, BarraMobile, Layout, Footer

**Files:**
- Modify: `src/components/Header.astro` (riscrittura), `src/layouts/Layout.astro`, `src/components/Footer.astro`
- Create: `src/components/MenuMobile.astro`, `src/components/BarraMobile.astro`

**Interfaces:**
- Consumes: classi CSS del Task 2; `NEGOZIO` (telefono, whatsapp, mapsDirectionsUrl).
- Produces: `Layout.astro` con `Props { titolo: string; descrizione: string; titoloCompleto?: boolean }` — se `titoloCompleto` è true, `titolo` è usato così com'è come `<title>`/`og:title`, altrimenti si aggiunge « · Arredamenti Guerini». Le pagine dei task successivi usano `<Layout titolo=... descrizione=... />` o `<Layout titoloCompleto titolo={c.titoloSeo} ... />`.

- [ ] **Step 1: Crea `src/components/MenuMobile.astro`**

```astro
---
import { NEGOZIO } from '../data/negozio';

interface Props {
  voci: { href: string; testo: string }[];
  pathname: string;
}
const { voci, pathname } = Astro.props;
const tel = `tel:${NEGOZIO.telefono.replaceAll(' ', '')}`;
const wa = `https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`;
---
<div id="menu-mobile" class="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="menu-mobile__testa">
    <a href="/" class="logo">Arredamenti <strong>Guerini</strong></a>
    <button type="button" class="menu-chiudi">Chiudi</button>
  </div>
  <nav aria-label="Principale (mobile)">
    {voci.map((v) => (
      <a href={v.href + '/'} aria-current={pathname.startsWith(v.href) ? 'page' : undefined}>{v.testo}</a>
    ))}
  </nav>
  <div class="menu-contatti">
    <a class="bottone bottone--chiaro" href="/contatti/">Richiedi un preventivo</a>
    <a href={tel}>Chiama: {NEGOZIO.telefono}</a>
    <a href={wa}>Scrivici su WhatsApp</a>
  </div>
</div>
```

- [ ] **Step 2: Riscrivi `src/components/Header.astro`**

```astro
---
import MenuMobile from './MenuMobile.astro';

const pathname = Astro.url.pathname.replace(/\/$/, '') || '/';
const voci = [
  { href: '/prodotti', testo: 'Prodotti' },
  { href: '/marchi', testo: 'Marchi' },
  { href: '/servizi', testo: 'Servizi' },
  { href: '/chi-siamo', testo: 'Chi siamo' },
  { href: '/contatti', testo: 'Contatti' },
];
---
<header class="sito-header">
  <div class="contenitore header-riga">
    <a href="/" class="logo">Arredamenti <strong>Guerini</strong></a>
    <nav class="nav-desktop" aria-label="Principale">
      {voci.map((v) => (
        <a href={v.href + '/'} aria-current={pathname.startsWith(v.href) ? 'page' : undefined}>{v.testo}</a>
      ))}
      <a class="bottone bottone--chiaro header-cta" href="/contatti/">Richiedi un preventivo</a>
    </nav>
    <button type="button" class="menu-bottone" aria-expanded="false" aria-controls="menu-mobile">Menu</button>
  </div>
  <MenuMobile voci={voci} pathname={pathname} />
</header>

<script>
  // Menu mobile: unico JS di navigazione del sito.
  const bottone = document.querySelector<HTMLButtonElement>('.menu-bottone')!;
  const menu = document.getElementById('menu-mobile')!;
  const chiudi = menu.querySelector<HTMLButtonElement>('.menu-chiudi')!;

  function imposta(aperto: boolean) {
    menu.hidden = !aperto;
    bottone.setAttribute('aria-expanded', String(aperto));
    document.body.classList.toggle('menu-aperto', aperto);
    (aperto ? chiudi : bottone).focus();
  }
  bottone.addEventListener('click', () => imposta(menu.hidden));
  chiudi.addEventListener('click', () => imposta(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) imposta(false);
  });
</script>
```

Nota: il bottone Menu è nascosto via CSS (`display: none`) e appare solo con `html.js` (classe aggiunta dal Layout, Step 4): senza JavaScript resta visibile la `nav-desktop` compatta.

- [ ] **Step 3: Crea `src/components/BarraMobile.astro`**

```astro
---
import { NEGOZIO } from '../data/negozio';
const tel = `tel:${NEGOZIO.telefono.replaceAll(' ', '')}`;
const wa = `https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`;
---
<nav class="barra-mobile" aria-label="Azioni rapide">
  <a href={tel}>Chiama</a>
  <a href={wa}>WhatsApp</a>
  <a href={NEGOZIO.mapsDirectionsUrl} rel="noopener">Indicazioni</a>
</nav>
```

- [ ] **Step 4: Aggiorna `src/layouts/Layout.astro`**

Sostituire il blocco Props/const e il markup `<head>`/`<body>` (il `jsonLd` resta identico):

```astro
---
import '@fontsource-variable/bitter';
import '@fontsource-variable/karla';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import BarraMobile from '../components/BarraMobile.astro';
import { NEGOZIO } from '../data/negozio';

interface Props {
  titolo: string;
  descrizione: string;
  /** true = `titolo` è già il <title> completo (non si aggiunge il nome del negozio) */
  titoloCompleto?: boolean;
}
const { titolo, descrizione, titoloCompleto = false } = Astro.props;
const titoloPagina = titoloCompleto ? titolo : `${titolo} · Arredamenti Guerini`;

// Il blocco `const jsonLd = { ... }` esistente (FurnitureStore con address,
// sameAs e openingHoursSpecification) resta ESATTAMENTE com'è: non toccarlo.
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titoloPagina}</title>
    <meta name="description" content={descrizione} />
    <meta property="og:title" content={titoloPagina} />
    <meta property="og:description" content={descrizione} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="it_IT" />
    <meta property="og:url" content={Astro.url.href} />
    <link rel="canonical" href={Astro.url.href} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <script is:inline>document.documentElement.classList.add('js');</script>
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <Header />
    <main><slot /></main>
    <Footer />
    <BarraMobile />
  </body>
</html>
```

- [ ] **Step 5: Aggiorna `src/components/Footer.astro`**

Aggiungere una colonna "Esplora" prima di "Contatti" e togliere `NEGOZIO.consegna` dalla riga legale (ora vive nella riga metadati dell'hero):

```astro
---
import { NEGOZIO } from '../data/negozio';
const anno = new Date().getFullYear();
---
<footer class="sito-footer">
  <div class="contenitore footer-colonne">
    <div>
      <h3>{NEGOZIO.nome}</h3>
      <p>{NEGOZIO.claimBreve}</p>
      <p>
        {NEGOZIO.indirizzo.via}<br />
        {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia})
      </p>
    </div>
    <div>
      <h3>Esplora</h3>
      <ul>
        <li><a href="/prodotti/">Prodotti</a></li>
        <li><a href="/marchi/">Marchi</a></li>
        <li><a href="/servizi/">Servizi</a></li>
        <li><a href="/chi-siamo/">Chi siamo</a></li>
        <li><a href="/contatti/">Contatti</a></li>
      </ul>
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
  <div class="contenitore footer-legale">© {anno} {NEGOZIO.nome}</div>
</footer>
```

- [ ] **Step 6: Build e verifica**

Run: `npm run build`
Expected: verde.

Run:
```bash
grep -o 'class="barra-mobile"' dist/index.html | wc -l          # → 1
grep -o 'id="menu-mobile"' dist/index.html | wc -l               # → 1
grep -o 'aria-expanded="false"' dist/index.html | wc -l          # → 1
grep -o '<title>Prodotti · Arredamenti Guerini</title>' dist/prodotti/index.html | wc -l   # → 1
grep -o 'rel="canonical"' dist/index.html | wc -l                # → 1
grep -rq "menu-aperto" dist/ && echo "JS menu OK"                # → JS menu OK
grep -o 'href="/marchi/"' dist/index.html | wc -l                # → ≥ 2 (nav + footer; anche il menu mobile)
```

- [ ] **Step 7: Verifica manuale del menu (preview)**

Run: `npm run preview` in background, poi `curl -s http://localhost:4321/ | grep -o 'menu-bottone'` → presente. Fermare il preview. (Il click-test reale del menu si fa nel Task 9.)

- [ ] **Step 8: Commit**

```bash
git add src/components/Header.astro src/components/MenuMobile.astro src/components/BarraMobile.astro src/layouts/Layout.astro src/components/Footer.astro
git commit -m "feat: navigazione a 5 voci, menu mobile, barra CTA fissa, canonical"
```

---

### Task 4: Componenti di pagina — Hero, CtaFinale, CardCategoria, CardMarchio, ServizioVoce, Faq, Breadcrumb, GalleriaProdotti

**Files:**
- Create: `src/components/Hero.astro`, `src/components/CtaFinale.astro`, `src/components/CardCategoria.astro`, `src/components/CardMarchio.astro`, `src/components/ServizioVoce.astro`, `src/components/Faq.astro`, `src/components/Breadcrumb.astro`, `src/components/GalleriaProdotti.astro`
- Modify: `src/pages/prodotti.astro` (usa `GalleriaProdotti`; lo script si sposta nel componente)

**Interfaces:**
- Consumes: Task 1 tipi/dati, Task 2 classi, `Quota.astro`, `Righello.astro`.
- Produces (props esatte, usate dai task 5-8):
  - `Hero`: `{ titolo: string; sottotitolo: string; foto: ImageMetadata; altFoto: string; meta?: string[] }` — CTA fisse interne (Richiedi un preventivo / Vieni in negozio), quota "progetto — montaggio".
  - `CtaFinale`: `{ titolo?: string; testo?: string }`.
  - `CardCategoria`: `{ categoria: Categoria }`.
  - `CardMarchio`: `{ marchio: Marchio; estesa?: boolean }`.
  - `ServizioVoce`: `{ servizio: Servizio; breve?: boolean }`.
  - `Faq`: `{ voci: Voce[] }` (solo markup; il JSON-LD FAQPage lo emette la pagina).
  - `Breadcrumb`: `{ voci: { nome: string; href?: string }[] }` (emette JSON-LD BreadcrumbList).
  - `GalleriaProdotti`: `{ prodotti: CollectionEntry<'prodotti'>[]; filtri?: boolean }` (griglia + lightbox + script; filtri opzionali).
- Nota (deviazione consapevole dalla spec): la spec prevedeva una prop `lightbox` su `SchedaProdotto` per la Home; la nuova Home non usa più `SchedaProdotto` (usa `CardCategoria`), quindi il bottone no-op sparisce senza aggiungere la prop. `SchedaProdotto.astro` resta invariato.

- [ ] **Step 1: Crea `Hero.astro` e `CtaFinale.astro`**

```astro
---
// Hero.astro
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import Quota from './Quota.astro';
import { NEGOZIO } from '../data/negozio';

interface Props {
  titolo: string;
  sottotitolo: string;
  foto: ImageMetadata;
  altFoto: string;
  meta?: string[];
}
const { titolo, sottotitolo, foto, altFoto, meta = [] } = Astro.props;
---
<section class="hero">
  <div class="contenitore hero-griglia">
    <div class="hero-testo">
      <div class="hero-quota"><Quota da="progetto" a="montaggio" /></div>
      <h1>{titolo}</h1>
      <p>{sottotitolo}</p>
      <div class="azioni">
        <a class="bottone bottone--chiaro" href="/contatti/">Richiedi un preventivo</a>
        <a class="bottone bottone--contorno-chiaro" href="/contatti/#dove-siamo">Vieni in negozio</a>
      </div>
    </div>
    <div class="hero-cornice">
      <Image src={foto} alt={altFoto} widths={[800, 1400, 2000]} sizes="(max-width: 800px) 100vw, 50vw" loading="eager" />
    </div>
  </div>
</section>
{meta.length > 0 && (
  <ul class="meta-riga">
    {meta.map((m) => <li>{m}</li>)}
  </ul>
)}
```

```astro
---
// CtaFinale.astro — chiusura di ogni pagina con i tre verbi del sito.
import { NEGOZIO } from '../data/negozio';

interface Props {
  titolo?: string;
  testo?: string;
}
const {
  titolo = 'Parliamo del tuo progetto',
  testo = 'Passa in negozio a Sale Marasino, chiamaci o scrivici: ti ascoltiamo e ti diciamo come possiamo aiutarti.',
} = Astro.props;
const wa = `https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`;
---
<section class="cta-finale">
  <div class="contenitore">
    <h2>{titolo}</h2>
    <p>{testo}</p>
    <div class="azioni">
      <a class="bottone bottone--chiaro" href="/contatti/">Richiedi un preventivo</a>
      <a class="bottone bottone--contorno-chiaro" href="/contatti/#dove-siamo">Vieni in negozio</a>
      <a class="bottone bottone--contorno-chiaro" href={wa}>Scrivici su WhatsApp</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Crea `CardCategoria.astro` e `CardMarchio.astro`**

```astro
---
// CardCategoria.astro
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { Categoria } from '../data/categorie';

interface Props {
  categoria: Categoria;
}
const { categoria } = Astro.props;

const immagini = import.meta.glob<{ default: ImageMetadata }>('../assets/prodotti/*.jpg', { eager: true });
const foto = immagini[`../assets/prodotti/${categoria.foto}.jpg`].default;
---
<a class="card-categoria" href={`/prodotti/${categoria.slug}/`}>
  <Image src={foto} alt={`${categoria.nome}: esempio di arredo esposto da Arredamenti Guerini a Sale Marasino`} widths={[400, 800]} sizes="(max-width: 700px) 100vw, 33vw" loading="lazy" />
  <div class="card-categoria__testo">
    <h3>{categoria.nome}</h3>
    <p class="card-categoria__etichetta">{categoria.etichetta}</p>
  </div>
</a>
```

```astro
---
// CardMarchio.astro — compatta (nome + prodotti) o estesa (logo, descrizione, categorie)
import type { Marchio } from '../data/marchi';
import { CATEGORIE } from '../data/categorie';

interface Props {
  marchio: Marchio;
  estesa?: boolean;
}
const { marchio, estesa = false } = Astro.props;
const categorie = CATEGORIE.filter((c) => marchio.categorie.includes(c.slug));
---
<article class:list={['card-marchio', { 'card-marchio--estesa': estesa }]}>
  {estesa && <div class="card-marchio__logo" aria-hidden="true">{marchio.nome}</div>}
  <h3>{marchio.nome}</h3>
  <p class="marchio">{marchio.prodotti}</p>
  {estesa && <p>{marchio.descrizione}</p>}
  {estesa && (
    <ul class="card-marchio__categorie" aria-label="Categorie">
      {categorie.map((c) => (
        <li><a href={`/prodotti/${c.slug}/`}>{c.nome}</a></li>
      ))}
    </ul>
  )}
</article>
```

Nota: il div `card-marchio__logo` è il segnaposto tipografico del logo (16:9). Quando arriveranno i loghi, diventerà un `<Image>` — voce README.

- [ ] **Step 3: Crea `ServizioVoce.astro`, `Faq.astro`, `Breadcrumb.astro`**

```astro
---
// ServizioVoce.astro
import type { Servizio } from '../data/servizi';

interface Props {
  servizio: Servizio;
  breve?: boolean;
}
const { servizio, breve = false } = Astro.props;
---
<article class:list={['servizio-voce', { 'servizio-voce--breve': breve }]} id={breve ? undefined : servizio.slug}>
  <h3>{servizio.nome}</h3>
  <p>{breve ? servizio.breve : servizio.descrizione}</p>
</article>
```

```astro
---
// Faq.astro — <details> nativo, zero JS.
import type { Voce } from '../data/faq';

interface Props {
  voci: Voce[];
}
const { voci } = Astro.props;
---
<div class="faq">
  {voci.map((v) => (
    <details>
      <summary>{v.domanda}</summary>
      <p>{v.risposta}</p>
    </details>
  ))}
</div>
```

```astro
---
// Breadcrumb.astro — percorso + JSON-LD BreadcrumbList
interface Props {
  voci: { nome: string; href?: string }[];
}
const { voci } = Astro.props;
const base = Astro.site?.toString().replace(/\/$/, '') ?? '';
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: voci.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: v.nome,
    ...(v.href ? { item: base + v.href } : {}),
  })),
};
---
<nav class="breadcrumb" aria-label="Percorso">
  <ol>
    {voci.map((v) => (
      <li>{v.href ? <a href={v.href}>{v.nome}</a> : <span aria-current="page">{v.nome}</span>}</li>
    ))}
  </ol>
</nav>
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

- [ ] **Step 4: Crea `GalleriaProdotti.astro` e semplifica `prodotti.astro`**

```astro
---
// GalleriaProdotti.astro — griglia prodotti + lightbox (+ filtri opzionali). Unico punto con questo JS.
import type { CollectionEntry } from 'astro:content';
import SchedaProdotto from './SchedaProdotto.astro';
import { CATEGORIE } from '../data/categorie';

interface Props {
  prodotti: CollectionEntry<'prodotti'>[];
  filtri?: boolean;
}
const { prodotti, filtri = false } = Astro.props;
---
{filtri && (
  <div class="filtri" role="group" aria-label="Filtra per categoria">
    <button type="button" class="attivo" aria-pressed="true" data-filtro="tutti">Tutti</button>
    {CATEGORIE.map((c) => (
      <button type="button" aria-pressed="false" data-filtro={c.slug}>{c.nome}</button>
    ))}
  </div>
)}

<div class="griglia-schede">
  {prodotti.map((p) => <SchedaProdotto prodotto={p} />)}
</div>

<dialog class="lightbox">
  <button type="button" class="lightbox-chiudi" aria-label="Chiudi">✕</button>
  <img src="" alt="" />
  <p></p>
</dialog>

<script>
  // Filtro per categoria (solo se i bottoni esistono)
  const bottoni = document.querySelectorAll<HTMLButtonElement>('[data-filtro]');
  const schede = document.querySelectorAll<HTMLElement>('.scheda-prodotto');
  bottoni.forEach((bottone) => {
    bottone.addEventListener('click', () => {
      bottoni.forEach((b) => {
        b.classList.toggle('attivo', b === bottone);
        b.setAttribute('aria-pressed', String(b === bottone));
      });
      const filtro = bottone.dataset.filtro;
      schede.forEach((scheda) => {
        scheda.toggleAttribute('hidden', filtro !== 'tutti' && scheda.dataset.categoria !== filtro);
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
  lightbox.querySelector('.lightbox-chiudi')!.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (evento) => {
    if (evento.target === lightbox) lightbox.close();
  });
</script>
```

`src/pages/prodotti.astro` diventa (transitorio: viene sostituito nel Task 6, qui serve a compilare e verificare i componenti):
```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';
import GalleriaProdotti from '../components/GalleriaProdotti.astro';
import { NEGOZIO } from '../data/negozio';

const prodotti = await getCollection('prodotti');
---
<Layout
  titolo="Prodotti"
  descrizione="Cucine, camere, divani, materassi, soggiorni ed elettrodomestici in esposizione da Arredamenti Guerini a Sale Marasino."
>
  <section class="sezione contenitore">
    <h1>I nostri prodotti</h1>
    <p>{NEGOZIO.consegna}.</p>
    <GalleriaProdotti prodotti={prodotti} filtri />
  </section>
</Layout>
```

- [ ] **Step 5: Build e verifica**

Run: `npm run build`
Expected: verde.

Run:
```bash
grep -o 'class="scheda-prodotto"' dist/prodotti/index.html | wc -l   # → 6
grep -o 'data-filtro=' dist/prodotti/index.html | wc -l               # → 7
grep -rq "showModal" dist/ && echo "lightbox OK"                      # → lightbox OK
```
(Gli altri componenti vengono compilati e verificati nelle pagine dei task 5-8.)

- [ ] **Step 6: Commit**

```bash
git add src/components src/pages/prodotti.astro
git commit -m "feat: componenti Hero, CtaFinale, CardCategoria, CardMarchio, ServizioVoce, Faq, Breadcrumb, GalleriaProdotti"
```

---

### Task 5: Home

**Files:**
- Modify: `src/pages/index.astro` (riscrittura completa)

**Interfaces:**
- Consumes: `Hero`, `CardCategoria`, `CardMarchio`, `ServizioVoce`, `CtaFinale`, `Righello`; `CATEGORIE`, `MARCHI`, `SERVIZI`, `NOTA_SERVIZI`, `NEGOZIO`.

- [ ] **Step 1: Riscrivi `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import CardCategoria from '../components/CardCategoria.astro';
import CardMarchio from '../components/CardMarchio.astro';
import ServizioVoce from '../components/ServizioVoce.astro';
import CtaFinale from '../components/CtaFinale.astro';
import Righello from '../components/Righello.astro';
import { NEGOZIO } from '../data/negozio';
import { CATEGORIE } from '../data/categorie';
import { MARCHI } from '../data/marchi';
import { SERVIZI, NOTA_SERVIZI } from '../data/servizi';
import heroFoto from '../assets/prodotti/hero-showroom.jpg';
---
<Layout
  titoloCompleto
  titolo="Arredamenti Guerini · Mobili e cucine a Sale Marasino (Lago d’Iseo)"
  descrizione="Negozio di arredamento a conduzione familiare a Sale Marasino, sul Lago d’Iseo: cucine Scavolini, camere, divani, materassi. Progetto, misure e montaggio compresi."
>
  <Hero
    titolo="Arrediamo la tua casa, dal progetto al montaggio"
    sottotitolo="Un negozio di famiglia a Sale Marasino, sul Lago d’Iseo: veniamo a misurare, disegniamo la stanza con te e montiamo tutto noi."
    foto={heroFoto}
    altFoto={`Lo showroom di ${NEGOZIO.nome} a Sale Marasino, con cucine e soggiorni in esposizione`}
    meta={['Consegna a partire da 1 mese', 'Alcuni articoli in pronta consegna', NOTA_SERVIZI]}
  />

  <section class="sezione contenitore">
    <h2>Come lavoriamo</h2>
    <div class="griglia-servizi">
      {SERVIZI.map((s) => <ServizioVoce servizio={s} breve />)}
    </div>
    <p class="spazio-sopra"><a href="/servizi/">Scopri tutti i servizi →</a></p>
  </section>

  <section class="sezione contenitore">
    <h2>Cosa trovi in negozio</h2>
    <div class="griglia-categorie">
      {CATEGORIE.map((c) => <CardCategoria categoria={c} />)}
    </div>
  </section>

  <section class="sezione contenitore">
    <h2>I marchi che trattiamo</h2>
    <div class="griglia-marchi">
      {MARCHI.map((m) => <CardMarchio marchio={m} />)}
    </div>
    <p class="spazio-sopra"><a href="/marchi/">Tutti i marchi, uno per uno →</a></p>
  </section>

  <section class="sezione contenitore">
    <h2>Vieni a trovarci</h2>
    <Righello />
    <p>{NEGOZIO.indirizzo.via}, {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia}) — <a href={`tel:${NEGOZIO.telefono.replaceAll(' ', '')}`}>{NEGOZIO.telefono}</a></p>
    <ul>
      {NEGOZIO.orari.map((o) => (
        <li><strong>{o.giorni}</strong>: {o.orario}</li>
      ))}
    </ul>
    <p class="azioni">
      <a class="bottone" href={NEGOZIO.mapsDirectionsUrl} rel="noopener">Indicazioni per il negozio</a>
      <a class="bottone bottone--secondario" href="/contatti/#dove-siamo">Orari e mappa</a>
    </p>
  </section>

  <CtaFinale />
</Layout>
```

- [ ] **Step 2: Build e verifica**

Run: `npm run build`
Expected: verde.

Run:
```bash
grep -o '<title>Arredamenti Guerini · Mobili e cucine a Sale Marasino (Lago d’Iseo)</title>' dist/index.html | wc -l  # → 1
grep -o 'class="card-categoria"' dist/index.html | wc -l      # → 6
grep -o 'class="card-marchio"' dist/index.html | wc -l        # → 8
grep -o 'class="quota"' dist/index.html | wc -l               # → 1
grep -o 'class="righello"' dist/index.html | wc -l            # → 1
grep -o 'class="cta-finale"' dist/index.html | wc -l          # → 1
grep -c 'banner-consegna' dist/index.html                     # → 0
grep -o 'a Sale Marasino' dist/index.html | wc -l             # → ≥ 1 (spazi corretti)
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: home con hero editoriale, servizi, categorie, marchi e CTA finale"
```

---

### Task 6: Prodotti — panoramica e 6 pagine categoria

**Files:**
- Move: `src/pages/prodotti.astro` → `src/pages/prodotti/index.astro` (`git mv`, poi riscrittura)
- Create: `src/pages/prodotti/[categoria].astro`

**Interfaces:**
- Consumes: `GalleriaProdotti`, `CardCategoria`, `CardMarchio`, `Breadcrumb`, `CtaFinale`, `Layout` (con `titoloCompleto`); `CATEGORIE`, `MARCHI`.

- [ ] **Step 1: Sposta e riscrivi `src/pages/prodotti/index.astro`**

```bash
git mv src/pages/prodotti.astro src/pages/prodotti/index.astro
```

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import CardCategoria from '../../components/CardCategoria.astro';
import GalleriaProdotti from '../../components/GalleriaProdotti.astro';
import CtaFinale from '../../components/CtaFinale.astro';
import { CATEGORIE } from '../../data/categorie';

const prodotti = await getCollection('prodotti');
---
<Layout
  titoloCompleto
  titolo="Mobili, cucine e arredi a Sale Marasino | Arredamenti Guerini"
  descrizione="Cucine, camere, divani, materassi, soggiorni ed elettrodomestici in esposizione a Sale Marasino (BS), con progetto e montaggio compresi in zona Brescia."
>
  <section class="sezione contenitore">
    <h1>I nostri prodotti</h1>
    <p class="intro">Sei categorie, i marchi che conosciamo bene e una regola: prima si misura, poi si sceglie. Entra in una categoria o scorri tutto quello che abbiamo in esposizione.</p>
    <div class="griglia-categorie">
      {CATEGORIE.map((c) => <CardCategoria categoria={c} />)}
    </div>
  </section>

  <section class="sezione--stretta contenitore">
    <h2>Tutto in esposizione</h2>
    <GalleriaProdotti prodotti={prodotti} filtri />
  </section>

  <CtaFinale titolo="Non trovi quello che cerchi?" testo="In negozio abbiamo cataloghi e campioni di tutti i marchi: dicci cosa ti serve e ti mostriamo le possibilità." />
</Layout>
```

- [ ] **Step 2: Crea `src/pages/prodotti/[categoria].astro`**

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Breadcrumb from '../../components/Breadcrumb.astro';
import CardMarchio from '../../components/CardMarchio.astro';
import GalleriaProdotti from '../../components/GalleriaProdotti.astro';
import CtaFinale from '../../components/CtaFinale.astro';
import { CATEGORIE, type Categoria } from '../../data/categorie';
import { MARCHI } from '../../data/marchi';

export function getStaticPaths() {
  return CATEGORIE.map((categoria) => ({ params: { categoria: categoria.slug }, props: { categoria } }));
}

interface Props {
  categoria: Categoria;
}
const { categoria } = Astro.props;
const prodotti = await getCollection('prodotti', (p) => p.data.categoria === categoria.slug);
const marchi = MARCHI.filter((m) => categoria.marchi.includes(m.slug));
---
<Layout titoloCompleto titolo={categoria.titoloSeo} descrizione={categoria.descrizioneSeo}>
  <section class="sezione contenitore">
    <Breadcrumb voci={[{ nome: 'Home', href: '/' }, { nome: 'Prodotti', href: '/prodotti/' }, { nome: categoria.nome }]} />
    <h1>{categoria.nome} a Sale Marasino e sul Lago d’Iseo</h1>
    <p class="intro">{categoria.intro}</p>

    <h2>I marchi per {categoria.nome.toLowerCase()}</h2>
    <div class="griglia-marchi">
      {marchi.map((m) => <CardMarchio marchio={m} />)}
    </div>
  </section>

  <section class="sezione--stretta contenitore">
    <h2>In esposizione</h2>
    {prodotti.length > 0 ? (
      <GalleriaProdotti prodotti={prodotti} />
    ) : (
      <p class="vuoto">Le foto di questa categoria arrivano presto. Nel frattempo vieni in negozio: la selezione è in esposizione.</p>
    )}
  </section>

  <CtaFinale titolo={`Un preventivo per ${categoria.nome.toLowerCase()}?`} testo="Raccontaci la stanza e le misure che hai, o fissiamo un appuntamento per venire a misurare noi." />
</Layout>
```

- [ ] **Step 3: Build e verifica**

Run: `npm run build`
Expected: verde, **11 pagine** (index, prodotti, 6 categorie, chi-siamo, contatti, 404 — le pagine marchi/servizi arrivano nel Task 7).

Run:
```bash
for c in camere cucine divani materassi soggiorno elettrodomestici; do test -f dist/prodotti/$c/index.html && echo "OK $c"; done   # → 6 OK
grep -o '<title>Cucine Scavolini a Sale Marasino e sul Lago d’Iseo | Arredamenti Guerini</title>' dist/prodotti/cucine/index.html | wc -l  # → 1
grep -o 'BreadcrumbList' dist/prodotti/cucine/index.html | wc -l          # → 1
grep -o 'class="scheda-prodotto"' dist/prodotti/soggiorno/index.html | wc -l   # → 1
grep -o 'class="card-marchio"' dist/prodotti/soggiorno/index.html | wc -l      # → 4
grep -o 'class="card-categoria"' dist/prodotti/index.html | wc -l         # → 6
grep -o 'data-filtro=' dist/prodotti/cucine/index.html | wc -l            # → 0 (niente filtri nelle categorie)
grep -o 'Cucine a Sale Marasino' dist/prodotti/cucine/index.html | wc -l  # → ≥ 1 (spazi corretti)
```

- [ ] **Step 4: Commit**

```bash
git add -A src/pages/prodotti
git commit -m "feat: panoramica prodotti e pagine categoria con breadcrumb e marchi"
```

---

### Task 7: Pagine Marchi e Servizi

**Files:**
- Create: `src/pages/marchi.astro`, `src/pages/servizi.astro`

**Interfaces:**
- Consumes: `CardMarchio` (estesa), `ServizioVoce`, `Righello`, `CtaFinale`; `MARCHI`, `SERVIZI`, `NOTA_SERVIZI`, `NEGOZIO`.

- [ ] **Step 1: Crea `src/pages/marchi.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import CardMarchio from '../components/CardMarchio.astro';
import CtaFinale from '../components/CtaFinale.astro';
import { MARCHI } from '../data/marchi';
---
<Layout
  titoloCompleto
  titolo="Marchi di arredamento a Sale Marasino: Scavolini, Colombini e altri | Arredamenti Guerini"
  descrizione="I marchi che trattiamo a Sale Marasino (BS): Scavolini, Gruppo Colombini, Stilfar, Cuorflex, Biel Divani, Vitarelax, Zamagna, Ingenia Casa. Assistenza in negozio."
>
  <section class="sezione contenitore">
    <h1>I marchi che trattiamo</h1>
    <p class="intro">Pochi marchi, scelti perché li conosciamo bene: sappiamo come si progettano, come si montano e come si comportano negli anni. Su ciascuno ti diamo consulenza e assistenza direttamente in negozio.</p>
    <div class="griglia-marchi">
      {MARCHI.map((m) => <CardMarchio marchio={m} estesa />)}
    </div>
    <!-- Loghi: quando il cliente li fornisce, sostituire il segnaposto tipografico in CardMarchio con <Image> (vedi README) -->
  </section>

  <CtaFinale titolo="Vuoi vedere un marchio dal vivo?" testo="In esposizione trovi cucine, camere, divani e materassi da toccare e provare. Vieni in negozio o chiedici un appuntamento." />
</Layout>
```

- [ ] **Step 2: Crea `src/pages/servizi.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import ServizioVoce from '../components/ServizioVoce.astro';
import Righello from '../components/Righello.astro';
import CtaFinale from '../components/CtaFinale.astro';
import { SERVIZI, NOTA_SERVIZI } from '../data/servizi';
import { NEGOZIO } from '../data/negozio';
---
<Layout
  titoloCompleto
  titolo="Progettazione, rilievo misure e montaggio a Sale Marasino | Arredamenti Guerini"
  descrizione="Progettiamo la stanza sulle tue misure, veniamo a misurare e montiamo noi: servizi compresi in zona Brescia. Pagamenti personalizzati da concordare in negozio."
>
  <section class="sezione contenitore">
    <h1>Dal progetto al montaggio</h1>
    <p class="intro">Vendere un mobile è la parte facile. Il lavoro vero è farlo entrare nella stanza giusta, con le misure giuste, montato bene. Per questo i servizi sono compresi, non un extra.</p>
    <Righello />
    <div class="griglia-servizi">
      {SERVIZI.map((s) => <ServizioVoce servizio={s} />)}
    </div>
  </section>

  <section class="sezione--stretta contenitore">
    <h2>Zona e tempi</h2>
    <p><strong>{NOTA_SERVIZI}</strong>: rilievo misure, consegna e montaggio sono inclusi per le case in provincia di Brescia e sul Lago d’Iseo. Per altre zone chiedici: valutiamo insieme.</p>
    <p>{NEGOZIO.consegna}. I tempi dipendono dal marchio e dalla composizione: te li diciamo con il preventivo.</p>
  </section>

  <CtaFinale titolo="Iniziamo dalle misure" testo="Fissiamo un appuntamento: veniamo noi a misurare la stanza e ti prepariamo un progetto con il preventivo." />
</Layout>
```

- [ ] **Step 3: Build e verifica**

Run: `npm run build`
Expected: verde, **13 pagine** (le 11 precedenti + marchi + servizi).

Run:
```bash
grep -o 'class="card-marchio card-marchio--estesa"' dist/marchi/index.html | wc -l   # → 8
grep -o 'class="card-marchio__logo"' dist/marchi/index.html | wc -l                  # → 8
grep -o 'class="servizio-voce"' dist/servizi/index.html | wc -l                      # → 4
grep -o 'id="rilievo-misure"' dist/servizi/index.html | wc -l                        # → 1
grep -o 'class="righello"' dist/servizi/index.html | wc -l                           # → 1
grep -o 'zona Brescia' dist/servizi/index.html | wc -l                               # → ≥ 1
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/marchi.astro src/pages/servizi.astro
git commit -m "feat: pagine marchi e servizi"
```

---

### Task 8: Chi siamo e Contatti (con FAQ)

**Files:**
- Modify: `src/pages/chi-siamo.astro` (riscrittura), `src/pages/contatti.astro` (riscrittura)

**Interfaces:**
- Consumes: `Faq`, `CtaFinale`, `FormContatti` (esistente), `Righello`; `FAQ`, `NEGOZIO`.

- [ ] **Step 1: Riscrivi `src/pages/chi-siamo.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import CtaFinale from '../components/CtaFinale.astro';
import { NEGOZIO } from '../data/negozio';
---
<Layout
  titoloCompleto
  titolo="Chi siamo · Negozio di arredamento di famiglia a Sale Marasino | Arredamenti Guerini"
  descrizione="Arredamenti Guerini è un negozio di arredamento a conduzione familiare a Sale Marasino, sul Lago d’Iseo: showroom, consulenza e montaggio compresi in zona Brescia."
>
  <section class="sezione contenitore">
    <h1>Una bottega di famiglia sul Lago d’Iseo</h1>
    <!-- TESTO DA CONFERMARE COL CLIENTE: anno di apertura, chi gestisce il negozio, generazioni -->
    <p class="intro">Siamo un negozio di arredamento a conduzione familiare a {NEGOZIO.indirizzo.comune}, sul Lago d’Iseo. Le case della zona le conosciamo una per una: ecco perché prima di proporre un mobile veniamo a misurare la stanza.</p>

    <h2>Come vi accogliamo</h2>
    <p>In negozio trovi cucine, camere, divani e materassi in esposizione, da toccare e provare, e cataloghi e campioni dei marchi che trattiamo. Ci sediamo con te, ascoltiamo come vivi la casa e disegniamo insieme la soluzione: senza fretta e con un preventivo chiaro.</p>

    <h2>Perché sceglierci</h2>
    <ul>
      <li><strong>Marchi che conosciamo bene</strong> — pochi e scelti: <a href="/marchi/">li vedi qui</a>.</li>
      <li><strong>Servizi compresi</strong> — progettazione, rilievo misure e montaggio in zona Brescia: <a href="/servizi/">come lavoriamo</a>.</li>
      <li><strong>Una persona di riferimento</strong> — chi ti accoglie in negozio segue il tuo progetto fino al montaggio.</li>
    </ul>
  </section>

  <CtaFinale titolo="Passa a conoscerci" testo="Lo showroom è a Sale Marasino, sul lago: vieni quando vuoi negli orari di apertura, o fissiamo un appuntamento." />
</Layout>
```

- [ ] **Step 2: Riscrivi `src/pages/contatti.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import FormContatti from '../components/FormContatti.astro';
import Faq from '../components/Faq.astro';
import { NEGOZIO } from '../data/negozio';
import { FAQ } from '../data/faq';

const wa = `https://wa.me/${NEGOZIO.whatsapp.replace(/[^\d]/g, '')}`;
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((v) => ({
    '@type': 'Question',
    name: v.domanda,
    acceptedAnswer: { '@type': 'Answer', text: v.risposta },
  })),
};
---
<Layout
  titoloCompleto
  titolo="Contatti e orari · Arredamenti Guerini, Sale Marasino (BS)"
  descrizione="Richiedi un preventivo o vieni in negozio a Sale Marasino: telefono, WhatsApp, indicazioni, orari di apertura e risposte alle domande frequenti."
>
  <section class="sezione contenitore">
    <h1>Contatti</h1>
    <div class="griglia-contatti">
      <div>
        <h2>Richiedi un preventivo</h2>
        <p>Raccontaci la stanza e cosa vorresti: ti rispondiamo per fissare un appuntamento o un rilievo misure.</p>
        <FormContatti />
      </div>

      <div id="dove-siamo">
        <h2>Dove siamo</h2>
        <p>
          {NEGOZIO.indirizzo.via}, {NEGOZIO.indirizzo.cap} {NEGOZIO.indirizzo.comune} ({NEGOZIO.indirizzo.provincia})<br />
          Telefono: <a href={`tel:${NEGOZIO.telefono.replaceAll(' ', '')}`}>{NEGOZIO.telefono}</a><br />
          WhatsApp: <a href={wa}>Scrivici su WhatsApp</a><br />
          Email: <a href={`mailto:${NEGOZIO.email}`}>{NEGOZIO.email}</a>
        </p>
        <p class="azioni">
          <a class="bottone" href={NEGOZIO.mapsDirectionsUrl} rel="noopener">Indicazioni</a>
        </p>
        <iframe
          class="mappa"
          src={NEGOZIO.mapsEmbedUrl}
          title={`Mappa: ${NEGOZIO.nome}`}
          width="100%"
          height="300"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <h2>Orari di apertura</h2>
        <ul>
          {NEGOZIO.orari.map((o) => (
            <li><strong>{o.giorni}</strong>: {o.orario}</li>
          ))}
        </ul>
        <p>Seguici su <a href={NEGOZIO.facebook}>Facebook</a>{NEGOZIO.instagram && <> e <a href={NEGOZIO.instagram}>Instagram</a></>} per le novità in negozio.</p>
      </div>
    </div>
  </section>

  <section class="sezione--stretta contenitore">
    <h2>Domande frequenti</h2>
    <Faq voci={FAQ} />
    <script type="application/ld+json" set:html={JSON.stringify(faqJsonLd)} />
  </section>
</Layout>
```

- [ ] **Step 3: Build e verifica**

Run: `npm run build`
Expected: verde, 13 pagine.

Run:
```bash
grep -o 'FAQPage' dist/contatti/index.html | wc -l                    # → 1
grep -o '<details>' dist/contatti/index.html | wc -l                  # → 5
grep -o 'id="dove-siamo"' dist/contatti/index.html | wc -l            # → 1
grep -o 'maps/dir/' dist/contatti/index.html | wc -l                  # → 1
grep -c 'scheda-testo' dist/chi-siamo/index.html                      # → 0
grep -o 'familiare a Sale Marasino' dist/chi-siamo/index.html | wc -l # → 1 (spazio corretto)
grep -o 'Facebook</a> per' dist/contatti/index.html | wc -l           # → 1 (spazio corretto, instagram vuoto)
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/chi-siamo.astro src/pages/contatti.astro
git commit -m "feat: chi siamo riscritto e contatti con FAQ, indicazioni e FAQPage"
```

---

### Task 9: README, verifica finale e click-test

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Aggiorna `README.md`**

Sostituire la sezione "## Aggiornare i contenuti" con:

```markdown
## Struttura del sito

Home · Prodotti (+ una pagina per categoria: /prodotti/cucine/ ecc.) · Marchi ·
Servizi · Chi siamo · Contatti (con FAQ) · 404. Le pagine categoria sono
generate da `src/data/categorie.ts`.

## Aggiornare i contenuti

- **Aggiungere un prodotto:** copia una foto in `src/assets/prodotti/` e crea un
  file `.md` in `src/content/prodotti/` (vedi i file esistenti per il formato).
  Categorie valide: `camere`, `cucine`, `divani`, `materassi`, `soggiorno`,
  `elettrodomestici`. Il prodotto compare in /prodotti/ e nella sua categoria.
- **Telefono, orari, indirizzo, social, link mappa:** `src/data/negozio.ts`.
- **Categorie (testi SEO, intro, marchi collegati, foto):** `src/data/categorie.ts`.
- **Marchi, servizi, FAQ:** `src/data/marchi.ts`, `src/data/servizi.ts`, `src/data/faq.ts`.
- **Loghi dei marchi:** quando disponibili, metterli in `src/assets/marchi/<slug>.svg|png`
  e sostituire in `src/components/CardMarchio.astro` il `div.card-marchio__logo`
  con un `<Image>`.
- Dopo ogni modifica ai dati: `npm test` (verifica coerenza) e `npm run build`.
```

Aggiungere alla tabella comandi la riga: `| \`npm test\` | verifica di coerenza dei dati in \`src/data/\` |`

Aggiungere alla checklist "Dati in attesa dal cliente":
```markdown
- [ ] Storia del negozio: anno di apertura, chi lo gestisce (testo in `src/pages/chi-siamo.astro`)
- [ ] Condizioni dei pagamenti personalizzati (FAQ e pagina Servizi: oggi rimandano "chiedi in negozio")
- [ ] Il rilievo misure/sopralluogo è gratuito? (oggi il sito non lo dichiara)
- [ ] Zona esatta di consegna e montaggio (oggi: "zona Brescia, Lago d’Iseo e dintorni")
```

- [ ] **Step 2: Verifica finale completa**

Run: `npm test && npm run build`
Expected: `dati OK`, build verde.

Run:
```bash
for f in index prodotti/index prodotti/camere/index prodotti/cucine/index prodotti/divani/index prodotti/materassi/index prodotti/soggiorno/index prodotti/elettrodomestici/index marchi/index servizi/index chi-siamo/index contatti/index 404; do
  test -f "dist/$f.html" && echo "OK $f" || echo "MANCA $f"; done          # → 13 OK
grep -o '<loc>' dist/sitemap-0.xml | wc -l                                  # → 12 (tutte tranne la 404)
grep -rL 'FurnitureStore' dist --include=index.html                         # → nessun output (JSON-LD ovunque)
grep -rl 'aSale\|aBrescia\|d’Iseo:' dist --include=*.html | head            # → nessun output = nessuna parola incollata nota
for f in $(find dist -name '*.html'); do n=$(grep -o '<h1' "$f" | wc -l); [ "$n" = 1 ] || echo "H1 x$n in $f"; done   # → nessun output
```

- [ ] **Step 3: Click-test via preview**

Run: `npm run preview` in background e con `curl` verificare: `/prodotti/cucine/` risponde 200; `/contatti/#dove-siamo` contiene `id="dove-siamo"`; `/pagina-inesistente` → 404. Se disponibile un browser (utente), testare: menu mobile apri/chiudi/Esc a viewport < 900px; barra CTA in basso; filtri e lightbox su `/prodotti/`; FAQ apri/chiudi; form → messaggio con telefono (chiave placeholder). Fermare il preview. Annotare nel report cosa è stato verificato con curl e cosa resta al test manuale dell'utente (Lighthouse incluso).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README aggiornato con struttura, dati e checklist del redesign"
```

---

## Follow-up fuori piano (richiedono utente o cliente)

1. Lighthouse manuale sulle pagine pubblicate (target ≥ 90).
2. Dati reali (telefono, WhatsApp, via, orari, storia, condizioni pagamenti), foto reali, loghi marchi, logo/favicon, `geo` e `og:image`.
3. Chiave Web3Forms.
