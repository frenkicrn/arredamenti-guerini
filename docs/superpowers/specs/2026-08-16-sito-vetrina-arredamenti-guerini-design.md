# Design: sito vetrina Arredamenti Guerini snc

**Data:** 2026-08-16
**Stato:** approvato dall'utente (brainstorming), in attesa di revisione della spec scritta

## Obiettivo

Sito vetrina statico per Arredamenti Guerini snc, negozio di arredamenti a Sale Marasino (BS). Deve presentare il negozio, mostrare prodotti e lavori con foto, indicare marchi trattati e servizi, e permettere ai clienti di contattare il negozio. Costo di esercizio minimo: solo il dominio (~10-15 €/anno).

## Decisioni prese

| Decisione | Scelta | Motivazione |
|---|---|---|
| Tipo di sito | Statico, senza CMS | Contenuti quasi mai aggiornati; le modifiche le fa lo sviluppatore da codice |
| Framework | **Astro** (output statico puro) | Componenti riusabili, gallery da file markdown, ottimizzazione immagini automatica, zero JS di default |
| Hosting | **Cloudflare Pages** (piano free) | Banda illimitata, SSL e dominio custom gratis, uso commerciale consentito, deploy automatico da Git |
| Form contatti | **Web3Forms** (piano free) | Invio email al negozio senza backend, protezione spam honeypot |
| Dominio | `.it` da acquistare (~10-15 €/anno) | Registrar tipo Netsons/OVH, DNS gestito su Cloudflare. Si parte con `*.pages.dev` gratuito per l'anteprima, dominio aggiunto dopo |
| Contenuti | Mix: pagina Facebook + materiali del cliente | Placeholder dove mancano; foto reali integrate in seguito |
| Lingua | Solo italiano | Clientela locale (zona Brescia / lago d'Iseo) |

Alternative scartate: HTML puro (gallery e immagini da gestire a mano), Next.js + Vercel (piano free non commerciale, servirebbero 20 $/mese).

## Struttura del sito (4 pagine)

### Home `/`
- Hero con foto d'impatto e claim del negozio
- Presentazione breve
- Anteprima gallery (3-4 lavori in evidenza)
- Banner logistica: "Consegna a partire da 1 mese · alcuni articoli in pronta consegna"
- Contatti rapidi: telefono, WhatsApp, mappa, link social

### Prodotti `/prodotti`
- Griglia foto filtrabile per categoria (filtro client-side, unico JS oltre al lightbox)
- Categorie reali: **Camere, Cucine, Divani, Materassi, Mobili soggiorno, Elettrodomestici**
- Lightbox per foto a schermo intero
- Badge "pronta consegna" dove applicabile

### Chi siamo `/chi-siamo`
- Storia e presentazione del negozio
- **Servizi:** Progettazione, Rilievo misure, Montaggio, Pagamenti personalizzati — con nota "compresi in zona Brescia"
- **I nostri marchi** (con loghi):
  - Scavolini — cucine, bagno, living (+ elettrodomestici)
  - Gruppo Colombini — camerette, camere, living
  - Stilfar Italia — letti imbottiti
  - Cuorflex — reti e materassi
  - Biel Divani — divani
  - Vitarelax — poltrone elettriche
  - Zamagna Italia — tavoli e sedie
  - Ingenia Casa — tavoli e sedie

### Contatti `/contatti`
- Form contatti (nome, telefono/email, messaggio) via Web3Forms
- Mappa Google embed, indirizzo, orari di apertura
- Telefono, WhatsApp, link Facebook/Instagram

## Architettura tecnica

```
src/
  components/     Header, Footer, SchedaProdotto, Lightbox, FormContatti, ...
  layouts/        Layout base (head, SEO, header, footer)
  pages/          index, prodotti, chi-siamo, contatti
  content/
    prodotti/     1 file .md per prodotto/lavoro (frontmatter: titolo,
                  categoria, marchio?, foto, prontaConsegna, inEvidenza)
  data/
    negozio.ts    indirizzo, telefono, WhatsApp, email, orari, social
    marchi.ts     elenco marchi con descrizione e logo
    servizi.ts    elenco servizi
  assets/         foto (ottimizzate da Astro in build: WebP/AVIF, srcset)
```

Principi:
- **Un solo punto di verità** per i dati del negozio: cambiare il telefono = 1 riga in `negozio.ts`.
- **Aggiungere un prodotto** = 1 file markdown + 1 foto; griglia e filtri si aggiornano da soli in build.
- JavaScript minimo: solo filtro gallery e lightbox; tutto il resto è HTML/CSS statico.
- Responsive mobile-first: il traffico atteso è in gran parte da telefono (Google/Facebook).

## SEO e prestazioni

- Meta tag e Open Graph per pagina; sitemap generata in build (`@astrojs/sitemap`)
- Dati strutturati JSON-LD `LocalBusiness`/`FurnitureStore` (nome, indirizzo, orari, telefono, geo)
- Immagini ottimizzate automaticamente, lazy loading
- Target Lighthouse: ≥ 90 su performance, SEO e accessibilità

## Gestione errori

- Form: validazione HTML5 lato client; messaggio di conferma/errore dopo l'invio; honeypot anti-spam di Web3Forms; se Web3Forms non risponde, il form mostra un errore con invito a chiamare il numero del negozio (sempre visibile in pagina)
- Pagina 404 personalizzata con link alle sezioni principali
- Build fallita = deploy non pubblicato (Cloudflare pubblica solo build riuscite; l'ultima versione buona resta online)

## Deploy e dominio

1. Repo Git → GitHub
2. Cloudflare Pages collegato al repo: build `npm run build`, output `dist/`, deploy automatico a ogni push su `main`
3. Anteprima cliente su `<progetto>.pages.dev` (gratuito) prima dell'acquisto del dominio
4. Acquisto dominio `.it` su registrar, DNS su Cloudflare, dominio custom collegato a Pages (SSL automatico)

## Test e verifica

- `npm run build` senza errori a ogni modifica
- Verifica Lighthouse su Home e Prodotti (soglie sopra)
- Test manuale del form (invio reale verso Web3Forms in ambiente di anteprima)
- Controllo responsive su viewport mobile/tablet/desktop

## Fuori scope (YAGNI)

- CMS o pannello admin
- E-commerce, prezzi, carrello
- Multilingua
- Blog/news (le novità restano sui social, il sito le linka)
- Newsletter, analytics avanzati (eventuale Cloudflare Web Analytics gratuito, da decidere in implementazione)

## Note per l'implementazione

- L'utente ha installato il plugin **frontend-design** (Anthropic): da usare nella fase di implementazione per il design visivo (palette, tipografia, layout). Nella sessione corrente non risulta caricato: verificare dopo riavvio della sessione.
- Verificare col cliente che "Gruppo colombiani" = **Gruppo Colombini**; correggere se diverso.
- Chiedere al cliente: email a cui ricevere le richieste del form, testi definitivi, foto in alta qualità, eventuale logo del negozio.
- Loghi dei marchi: recuperarli dai siti ufficiali/press kit dei produttori.
