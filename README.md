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

- [ ] Chiave Web3Forms (vedi sotto) al posto di `INSERIRE_CHIAVE_WEB3FORMS`
- [ ] Email e WhatsApp reali (oggi placeholder in `src/data/negozio.ts`; il sito
      non li mostra, usa telefono e modulo)
- [ ] Profilo Instagram (in `src/data/negozio.ts`, vuoto = link non mostrato)
- [ ] Coordinate geografiche per il JSON-LD (`geo`)
- [ ] Immagine og:image per le condivisioni social
- [ ] Favicon definitiva ricavata dal logo (oggi `public/favicon.svg` è generica)
- [ ] Foto proprie del negozio e dello showroom (oggi si usano foto di catalogo
      dei marchi)
- [ ] Il rilievo misure/sopralluogo è gratuito? (oggi il sito non lo dichiara)

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
4. Serve Node ≥ 24 (con npm ≥ 11: il lockfile è generato da npm 11 e npm 10
   non lo accetta). Il file .nvmrc nel repo lo imposta già; se il build
   fallisce, impostare la variabile d'ambiente NODE_VERSION=24 nelle
   impostazioni del progetto Pages.
5. Ogni push su `main` pubblica automaticamente. URL gratuito: `<progetto>.pages.dev`.

## Dominio .it (quando si è pronti)

1. Registrare il dominio (es. arredamentiguerini.it) su un registrar (~10-15 €/anno).
2. In Cloudflare: aggiungere il sito, puntare i nameserver del registrar a Cloudflare.
3. In Pages → Custom domains → aggiungere il dominio (SSL automatico).
4. Aggiornare `site` in `astro.config.mjs` e la riga `Sitemap:` in `public/robots.txt`
   con il dominio definitivo, poi fare push.
