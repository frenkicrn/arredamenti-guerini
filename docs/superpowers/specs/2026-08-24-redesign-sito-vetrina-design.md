# Design: redesign UX/UI/SEO del sito vetrina Arredamenti Guerini

**Data:** 2026-08-24
**Stato:** approvato in brainstorming (approccio A "Evoluzione"), in attesa di revisione della spec scritta
**Origine:** `prompt-redesign-sito-arredamenti-guerini (1).md` (brief fornito dall'utente) + sito live [url di anteprima rimossa]
**Spec precedente:** `2026-08-16-sito-vetrina-arredamenti-guerini-design.md` (resta valida per stack e hosting)

## Obiettivo

Far evolvere il sito esistente (Astro 7, statico, Cloudflare) da "vetrina pulita" a sito che:
1. comunichi un negozio familiare, di fiducia, radicato sul Lago d'Iseo — non un e-commerce anonimo;
2. porti all'azione concreta: venire in negozio, chiamare, scrivere su WhatsApp, chiedere un preventivo/sopralluogo;
3. sia solido per la SEO locale ("arredamenti Sale Marasino", "cucine Scavolini Brescia", "negozio mobili lago d'Iseo");
4. sia moderno ma caldo: legno, luce naturale, artigianalità.

## Decisioni prese

| Decisione | Scelta | Motivazione |
|---|---|---|
| Approccio | **A — Evoluzione** della direzione "Bottega sul lago" | Impianto, token e font già approvati; nessuna foto reale con cui giudicare un rifacimento totale |
| Alberatura | **Media**: Home, Prodotti + 6 categorie, Marchi, Servizi, Chi siamo, Contatti (con FAQ), 404 | Leva SEO locale per categoria/marchio senza moltiplicare pagine vuote |
| Recensioni | **Nessuna sezione** | Non esistono recensioni da riportare; niente contenuti inventati |
| Storia | Testo credibile **senza anni, nomi, generazioni** | Non forniti; da confermare col cliente |
| Contatti | Telefono/WhatsApp restano placeholder `DA CONFERMARE COL CLIENTE` | Confermato dall'utente |
| Foto | Placeholder, ma layout progettato per foto reali (rapporti fissi, ritagli) | Nessuna foto reale disponibile |
| Firma visiva | **"La misura"**: tacche di metro e quote dimensionali come dispositivo strutturale | È il mestiere reale (rilievo misure, progettazione); funziona anche con placeholder |
| Riferimenti | Sun at Six (mestiere e materiali come pagine, luce naturale), Mondini Arredamenti (pagine marchio, "Vieni a trovarci", heritage), Arhaus (calore coerente su tutto il sito) | Vedi conversazione di brainstorming |

## Alberatura e contenuto per pagina

Tutti i testi in italiano naturale, orientati al cliente locale. Nessun dato inventato: dove manca un fatto (anno, nomi, prezzi, condizioni di pagamento) si scrive in modo generico o si rimanda a "chiedi in negozio".

### `/` Home
1. **Hero editoriale** — H1 con la promessa ("Arrediamo la tua casa, dal progetto al montaggio — a Sale Marasino, sul Lago d'Iseo"), sottotitolo breve, due CTA: *Richiedi un preventivo* (→ `/contatti/`) e *Vieni in negozio* (→ `/contatti/#dove-siamo`). Sotto l'hero una **riga di metadati** (sostituisce il banner a fascia): "Consegna da 1 mese · Pronta consegna su alcuni articoli · Progettazione, misure e montaggio compresi in zona Brescia". Firma: quota "progetto ── montaggio" nell'hero.
2. **Come lavoriamo** — i 4 servizi in una riga (nome + 1 frase), link a `/servizi/`.
3. **Cosa trovi in negozio** — 6 `CardCategoria` (foto + nome + etichetta a quota), ognuna → `/prodotti/<slug>/`.
4. **I marchi** — fila degli 8 marchi (nome tipografico finché non ci sono i loghi), link a `/marchi/`.
5. **Vieni a trovarci** — indirizzo, orari, mappa embed, link *Indicazioni* (Google Maps directions).
6. `CtaFinale`.

### `/prodotti/`
H1 "I nostri prodotti", intro 2 frasi, 6 `CardCategoria`, poi la griglia completa con filtri e lightbox (esistente, mantenuta). `CtaFinale`.

### `/prodotti/<categoria>/` (6 pagine: camere, cucine, divani, materassi, soggiorno, elettrodomestici)
`Breadcrumb` (Home › Prodotti › Categoria), H1 locale (es. "Cucine a Sale Marasino e sul Lago d'Iseo"), intro 2-3 frasi specifica per categoria, **marchi della categoria** (`CardMarchio` compatte), griglia dei prodotti della categoria (`SchedaProdotto`, con lightbox), `CtaFinale`. Se una categoria non ha prodotti, la griglia mostra un invito ("Vieni in negozio a vedere la selezione") — mai vuoto silenzioso.

Mappatura categoria → marchi (dal brief):
- cucine: Scavolini
- camere: Gruppo Colombini, Stilfar Italia
- divani: Biel Divani, Vitarelax
- materassi: Cuorflex
- soggiorno: Gruppo Colombini, Scavolini (living), Zamagna Italia, Ingenia Casa
- elettrodomestici: Scavolini

### `/marchi/`
H1 "I marchi che trattiamo", intro sulla scelta dei marchi (qualità italiana, assistenza in negozio), 8 `CardMarchio` estese: spazio logo (16:9, per ora il nome in Bitter), cosa produce, 2-3 righe descrittive, link alle categorie collegate. `CtaFinale`.

### `/servizi/`
H1 "Dal progetto al montaggio", intro. Quattro `ServizioVoce` (progettazione, rilievo misure, montaggio, pagamenti personalizzati) con testo di 3-5 righe ciascuno scritto come mestiere; per i pagamenti: "soluzioni personalizzate, chiedi in negozio" (nessun tasso o condizione inventata). Blocco "Zona e tempi": compresi in zona Brescia; consegna da 1 mese; pronta consegna su alcuni articoli. Firma: il rilievo misure illustrato dal motivo `Righello`. `CtaFinale`.

### `/chi-siamo/`
H1 "Una bottega di famiglia sul Lago d'Iseo", 3 paragrafi: chi siamo (negozio a conduzione familiare a Sale Marasino), come vi accogliamo (showroom, consulenza, sopralluogo), perché sceglierci (marchi, servizi compresi). Commento HTML `TESTO DA CONFERMARE COL CLIENTE` sui paragrafi. Rimando a `/servizi/` e `/marchi/`. `CtaFinale`.

### `/contatti/`
H1 "Contatti", due colonne: form (esistente) | "Dove siamo" (`id="dove-siamo"`: indirizzo, mappa, bottone *Indicazioni*, orari, telefono, WhatsApp, Facebook). Sotto: **FAQ** con `<details>` nativo — 5 voci: tempi di consegna; zona di consegna e montaggio; pagamenti; pronta consegna; sopralluogo e preventivo (testo: "il sopralluogo è su appuntamento: contattaci per fissarlo" — costo NON dichiarato, da confermare). JSON-LD `FAQPage`.

### `404`
Esistente, con `BarraMobile` e nuovo header.

## Navigazione e conversione

- **Header desktop:** logo testuale · Prodotti · Marchi · Servizi · Chi siamo · Contatti · bottone *Richiedi un preventivo*. `aria-current` sulla sezione attiva (anche per `/prodotti/<categoria>/` → Prodotti attivo).
- **Header mobile (< 900px):** logo + bottone menu (`aria-expanded`) che apre `MenuMobile` a tutto schermo con le stesse voci + telefono e WhatsApp. Unico JS nuovo del sito (~15 righe: toggle classe + `aria-expanded` + chiusura con Esc).
- **`BarraMobile`:** fissa in basso solo su mobile, 3 azioni: Chiama (`tel:`), WhatsApp (`wa.me`), Indicazioni (Google Maps). Il footer riceve un padding-bottom per non essere coperto.
- **Vocabolario CTA fisso:** *Richiedi un preventivo* · *Vieni in negozio* · *Scrivici su WhatsApp*. `CtaFinale` chiude ogni pagina con queste tre azioni.

## Dati (un solo punto di verità)

- `src/data/negozio.ts` — come oggi + `mapsDirectionsUrl` (link Indicazioni) e `claimBreve`.
- `src/data/categorie.ts` — **nuovo**: `{ slug, nome, titoloSeo, descrizioneSeo, intro, etichetta, marchi: slug[] , foto }` per le 6 categorie (slug identici agli enum della collection).
- `src/data/marchi.ts` — arricchito: `{ slug, nome, prodotti, descrizione, categorie: slug[] }`.
- `src/data/servizi.ts` — arricchito: `{ slug, nome, breve, descrizione }` + `NOTA_SERVIZI`.
- `src/data/faq.ts` — **nuovo**: `{ domanda, risposta }[]`.
- Collection `prodotti` invariata.
- Le pagine categoria sono generate da `src/pages/prodotti/[categoria].astro` con `getStaticPaths()` da `CATEGORIE`.

## Design system

**Token (evoluzione):** palette invariata (carta, superficie, inchiostro, inchiostro-tenue, verde-lago, verde-fondale, verde-notte, noce, noce-chiaro, bordo); font Bitter Variable (display) + Karla Variable (testo), già self-hosted. Nuovi token:
- scala tipografica fluida: `--t-display-1/2/3` (clamp), `--t-testo-1/2/3`;
- spaziature `--spazio-1…6` (0.5rem → 6rem);
- `--barra-mobile-h` per il padding del footer.

**Firma "la misura":** componente `Righello` (SVG inline monocromo, colore corrente) usato come divisore di sezione con tacche; quota dimensionale (linea con terminali + etichetta) nell'hero e nell'etichetta delle `CardCategoria`. Regola: **al massimo una occorrenza della firma per viewport**; mai come puro ornamento.

**Regole:** immagini 4:3 nelle card, 16:9 nei loghi marchio, hero con `object-fit: cover` e altezza `min(70vh, 640px)`; focus visibile su tutto; `prefers-reduced-motion` rispettato (nessuna animazione oltre a transizioni ≤ 200ms su hover/focus e apertura menu); contrasti ≥ 4.5:1 per il testo normale.

## Componenti

| Componente | Responsabilità | Dipende da |
|---|---|---|
| `Header` (rivisto) | nav desktop + bottone menu | `MenuMobile` |
| `MenuMobile` | pannello a tutto schermo, toggle JS | `NEGOZIO` |
| `BarraMobile` | 3 azioni fisse su mobile | `NEGOZIO` |
| `Hero` | titolo, sottotitolo, 2 CTA, quota firma, riga metadati | `NEGOZIO`, `Righello` |
| `Righello` | SVG firma (divisore / quota) | — |
| `CardCategoria` | foto + nome + etichetta a quota → pagina categoria | `CATEGORIE` |
| `CardMarchio` | compatta (nome + prodotti) / estesa (descrizione, link) | `MARCHI` |
| `ServizioVoce` | nome + descrizione | `SERVIZI` |
| `Faq` | `<details>` per voce | `FAQ` |
| `Breadcrumb` | percorso + JSON-LD BreadcrumbList | — |
| `CtaFinale` | blocco chiusura con 3 azioni | `NEGOZIO` |
| `SchedaProdotto`, lightbox, `FormContatti`, `Footer` | esistenti; `SchedaProdotto` perde il bottone no-op fuori da `/prodotti*` (prop `lightbox`) | — |

## SEO

- `<title>` per pagina con località: es. "Cucine a Sale Marasino e Lago d'Iseo · Scavolini | Arredamenti Guerini"; Home: "Arredamenti Guerini · Mobili e cucine a Sale Marasino (Lago d'Iseo)".
- Meta description unica per pagina (≤ 155 caratteri), H1 unico, H2 per sezione.
- Alt descrittivi ovunque; per i placeholder descrivono il soggetto previsto ("Cucina Scavolini con isola, esposta nello showroom di Sale Marasino").
- JSON-LD: `FurnitureStore` sitewide (esistente, con orari; `geo` resta in attesa dal cliente); `BreadcrumbList` su categorie; `FAQPage` su Contatti.
- `og:title`/`og:description` per pagina; `og:image` rimane in attesa delle foto reali (README).
- Sitemap automatica include le 8 nuove pagine; robots invariato.

## Mobile e performance

- Mobile-first; barra CTA e menu pensati per uso a una mano.
- Immagini `astro:assets` con `widths`/`sizes` per contesto; hero `loading="eager"`, resto lazy.
- Nessun font o dipendenza aggiunta. JS totale: menu mobile, filtri+lightbox (prodotti e categorie), form.

## Gestione errori

- Form: invariato (fallback con telefono).
- Pagina categoria senza prodotti: invito a venire in negozio, mai griglia vuota.
- Menu mobile: senza JS il bottone non compare (`hidden` rimosso da JS) e la nav resta accessibile come lista inline compatta.

## Verifica

- `npm run build` verde; `dist/` con 13 pagine (Home, prodotti, 6 categorie, marchi, servizi, chi-siamo, contatti, 404) + sitemap.
- Per ogni pagina: grep di `<title>`, H1 e JSON-LD attesi; nessuna parola incollata (trappola testo/`{espressione}` di Astro).
- Contrasti ricalcolati per le coppie nuove (barra mobile, etichette a quota).
- Click-test via preview: menu mobile (apri/chiudi/Esc), filtri e lightbox su una pagina categoria, form fallback.
- Lighthouse manuale dell'utente a fine lavoro (target ≥ 90 performance/SEO/accessibilità).

## Fuori scope

- Sezione recensioni/testimonianze (nessun materiale).
- Pagine singole per marchio (alberatura "massima").
- Galleria prima/dopo, blog, multilingua, CMS.
- Dati reali (telefono, WhatsApp, foto, logo, anno di fondazione, condizioni di pagamento): restano in checklist README.

## Note per l'implementazione

- Skill `frontend-design` da usare nel task di design system/componenti.
- Tenere testo ed `{espressione}` sulla stessa riga nei `.astro` (spazio perso a cavallo di newline).
- Le verifiche con `grep` su `dist/` contano occorrenze con `grep -o | wc -l` (HTML compresso).
- Aggiornare README: nuove pagine, nuovi file dati, checklist (aggiungere: costo sopralluogo, condizioni pagamenti, storia/anno, loghi marchi).
