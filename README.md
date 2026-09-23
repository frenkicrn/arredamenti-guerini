# Sito vetrina — Arredamenti Guerini snc

Sito statico costruito con [Astro](https://astro.build), pensato per Cloudflare Pages.

## Comandi

| Comando | Effetto |
|---|---|
| `npm install` | installa le dipendenze |
| `npm run dev` | sviluppo locale su http://localhost:4321 |
| `npm run build` | build di produzione in `dist/` |
| `npm run preview` | anteprima locale del build |
| `npm test` | verifica di coerenza dei dati in `src/data/` |

## Struttura del sito

Home · Prodotti (+ una pagina per categoria: /prodotti/cucine/ ecc.) · Marchi ·
Servizi · Chi siamo · Contatti (con FAQ) · 404. Le pagine categoria sono
generate da `src/data/categorie.ts`.

## Aggiornare i contenuti

- **Aggiungere un prodotto:** copia una foto in `src/assets/prodotti/` e crea un
  file `.md` in `src/content/prodotti/` (vedi i file esistenti per il formato).
  Categorie valide: `cucine`, `soggiorno`, `tavoli-sedie`, `divani`, `camere`,
  `materassi`, `bagni`. Il prodotto compare in /prodotti/ e nei filtri per reparto.
  `inPromozione: true` mostra il badge "Promozione"; `prontaConsegna: true` il
  badge relativo. Il campo `inEvidenza` è oggi inutilizzato.
- **Telefono, orari, indirizzo, social, link mappa:** `src/data/negozio.ts`.
- **Reparti (testi SEO, titolo, intro, sommario del carosello, approfondimenti,
  marchi collegati, foto):** `src/data/categorie.ts`. Il campo `foto` e la `foto`
  di un approfondimento sono opzionali: senza foto compare "Foto in arrivo".
- **Marchi, servizi, FAQ:** `src/data/marchi.ts`, `src/data/servizi.ts`, `src/data/faq.ts`.
- **Loghi dei marchi:** `src/assets/marchi/<slug>.png|jpg|jpeg|webp`, dove `<slug>`
  è quello in `src/data/marchi.ts`. Vengono caricati da soli; senza file resta
  il segnaposto tipografico.
- **Design system (colori, tipografia, spaziature):** custom properties in cima a
  `src/styles/global.css`.
- Dopo ogni modifica ai dati: `npm test` (verifica coerenza) e `npm run build`.

## Dati in attesa dal cliente

- [ ] WhatsApp reale (oggi placeholder in `src/data/negozio.ts`; il sito non lo
      mostra, usa telefono e modulo)
- [ ] Profilo Instagram (in `src/data/negozio.ts`, vuoto = link non mostrato)
- [ ] Logo in alta risoluzione o vettoriale: `src/assets/logo-guerini.png` è di
      236x97 px e il solo simbolo della casetta misura 54x48, quindi
      `apple-touch-icon.png` (180x180) nasce da un ingrandimento 3,5x ed è
      morbido. Con l'originale si rigenerano icone e og:image più nitide.
- [ ] Foto proprie del negozio e dello showroom (oggi si usano foto di catalogo
      dei marchi)
- [ ] Il rilievo misure/sopralluogo è gratuito? (oggi il sito non lo dichiara)

## Immagini generate

`public/og-image.jpg` (anteprima social) e le due favicon non si modificano a
mano: si rigenerano con `sharp` dal logo e dalla foto hero. L'og:image è la foto
`src/assets/prodotti/cucina-madeleine-a.jpg` ritagliata a 1200x630 con la
targhetta del logo in basso a sinistra; le icone sono il simbolo della casetta
ritagliato dal logo su fondo crema.

## Form contatti (Web3Forms)

1. Andare su https://web3forms.com e creare una Access Key gratuita usando
   l'email del negozio (è l'indirizzo che riceverà le richieste).
2. Incollare la chiave in `src/data/negozio.ts` → `web3formsKey`.
3. Testare un invio reale dalla pagina /contatti/ del sito pubblicato.

## Deploy su Cloudflare (Worker)

Il sito sta su un Worker di Cloudflare, collegato a questo repo: ogni push su
`main` ricostruisce e pubblica da solo.

- Serve Node ≥ 24 (con npm ≥ 11: il lockfile è generato da npm 11 e npm 10 non
  lo accetta). `.nvmrc` lo imposta già; se il build fallisce, impostare
  `NODE_VERSION=24` fra le variabili d'ambiente del progetto.
- Nel container di build Cloudflare **aggiunge da sé** `@astrojs/cloudflare`,
  che nel repo non c'è. Attenzione quindi alla versione di Astro: se l'adapter
  richiede una versione più recente di quella in `package.json`, il build
  fallisce su "Building static entrypoints" con un errore di rolldown. È già
  successo con astro 7.2.2 e adapter 14.3.3; risolto passando ad astro 7.3.4.
- Con l'adapter l'output finisce in `dist/client`, non in `dist`.

## Dominio

Il dominio ufficiale è **arredamentiguerini.it**, senza `www`. È quello che
compare in `site` (`astro.config.mjs`) e nella riga `Sitemap:` di
`public/robots.txt`: da lì derivano sitemap, URL canonici e dati strutturati,
quindi vanno tenuti allineati.

Sul Worker sono agganciati sia `arredamentiguerini.it` sia
`www.arredamentiguerini.it`, con una redirect rule che manda il www al dominio
nudo: serve ad avere un solo indirizzo indicizzabile.
