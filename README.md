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
