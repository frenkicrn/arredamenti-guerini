export interface Approfondimento {
  /** Titolo breve del blocco (h3) */
  titolo: string;
  /** 2-4 frasi di approfondimento */
  testo: string;
  /** nome file (senza estensione) in src/assets/prodotti/ */
  foto: string;
}

export interface Categoria {
  slug: string;
  nome: string;
  /** Etichetta breve mostrata in overlay sulla card */
  etichetta: string;
  /** <title> completo della pagina categoria */
  titoloSeo: string;
  /** meta description (max 155 caratteri) */
  descrizioneSeo: string;
  /** Introduzione della pagina categoria (2-3 frasi) */
  intro: string;
  /** 2 sezioni di approfondimento testo + foto, mostrate alternate sinistra/destra */
  approfondimento: Approfondimento[];
  /** slug di categorie correlate (src/data/categorie.ts), mostrate come rimando in fondo all'intro */
  correlate?: string[];
  /** slug dei marchi (src/data/marchi.ts) */
  marchi: string[];
  /** nome file (senza estensione) in src/assets/prodotti/ */
  foto: string;
}

export const CATEGORIE: Categoria[] = [
  {
    slug: 'cucine',
    nome: 'Cucine',
    etichetta: 'cucine ed elettrodomestici',
    titoloSeo: 'Cucine Scavolini a Sale Marasino e sul Lago d’Iseo | Arredamenti Guerini',
    descrizioneSeo:
      'Cucine Scavolini componibili e su misura a Sale Marasino (BS), con elettrodomestici da incasso abbinati: progetto e montaggio compresi in zona Brescia.',
    intro:
      'La cucina è la stanza in cui si passa più tempo, e la progettiamo insieme a te sulle misure vere della tua casa: composizioni Scavolini, finiture, piani di lavoro ed elettrodomestici da incasso scelti nello stesso momento, così tutto combacia. Dal disegno alla posa in opera hai un unico interlocutore, dal preventivo al montaggio.',
    approfondimento: [
      {
        titolo: 'Il progetto, prima di tutto',
        testo:
          'Veniamo a misurare la tua cucina prima di ordinare qualsiasi cosa: pareti, prese, tubazioni. Il disegno tiene conto degli spazi reali, non di un modulo standard, e lo vedi prima di confermare.',
        foto: 'cucina-moderna',
      },
      {
        titolo: 'Elettrodomestici da incasso',
        testo:
          'Forno, piano cottura, frigorifero e lavastoviglie si scelgono insieme alla composizione, non dopo: misure e finiture combaciano con il resto della cucina fin dal progetto.',
        foto: 'forno-incasso',
      },
    ],
    correlate: ['bagni'],
    marchi: ['scavolini'],
    foto: 'cucina-moderna',
  },
  {
    slug: 'soggiorno',
    nome: 'Soggiorno',
    etichetta: 'living componibile',
    titoloSeo: 'Soggiorno e living componibile a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Pareti attrezzate e living componibili Gruppo Colombini e Scavolini a Sale Marasino (BS): progetto su misura e montaggio compresi in zona Brescia.',
    intro:
      'Pareti attrezzate e living componibili Gruppo Colombini e Scavolini: componiamo il soggiorno sulle misure della stanza e sulle abitudini di chi la vive, tra vani a giorno, ante laccate e sistemi porta TV. Il tavolo e le sedie per la zona pranzo hanno una categoria a parte.',
    approfondimento: [
      {
        titolo: 'Componibile, non standard',
        testo:
          'I sistemi Gruppo Colombini e Scavolini si compongono modulo per modulo: altezze, larghezze e ante si adattano alla parete che hai, non il contrario.',
        foto: 'parete-soggiorno',
      },
      {
        titolo: 'Vani a giorno e contenitori',
        testo:
          'Librerie aperte per gli oggetti di tutti i giorni, ante chiuse per quello che preferisci non vedere: il mix si decide insieme, in base a come usi la stanza.',
        foto: 'zona-giorno',
      },
    ],
    correlate: ['tavoli-sedie'],
    marchi: ['gruppo-colombini', 'scavolini'],
    foto: 'parete-soggiorno',
  },
  {
    slug: 'divani',
    nome: 'Divani e poltrone',
    etichetta: 'divani e poltrone relax',
    titoloSeo: 'Divani e poltrone relax a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Divani Biel e poltrone elettriche Vitarelax a Sale Marasino (BS). Provali in negozio: consegna e montaggio compresi in zona Brescia.',
    intro:
      'Un divano si sceglie sedendosi: in negozio trovi i modelli Biel Divani da provare, con rivestimenti, misure e configurazioni su richiesta, oltre alle poltrone elettriche Vitarelax pensate per il relax di tutti i giorni. Ti aiutiamo a scegliere la misura giusta per lo spazio che hai davvero.',
    approfondimento: [
      {
        titolo: 'Da provare in negozio',
        testo:
          'I modelli Biel Divani in esposizione si provano dal vivo, seduta compresa: rivestimento, profondità e schienale si valutano meglio con la casa in mente, non a schermo.',
        foto: 'divano-tre-posti',
      },
      {
        titolo: 'Poltrone relax elettriche',
        testo:
          'Le poltrone Vitarelax hanno regolazioni elettriche per schienale e poggiapiedi, pensate per chi passa in relax più di qualche minuto al giorno.',
        foto: 'poltrona-vitarelax',
      },
    ],
    marchi: ['biel-divani', 'vitarelax'],
    foto: 'divano-tre-posti',
  },
  {
    slug: 'tavoli-sedie',
    nome: 'Tavoli e sedie',
    etichetta: 'zona pranzo',
    titoloSeo: 'Tavoli e sedie per la zona pranzo a Sale Marasino | Arredamenti Guerini',
    descrizioneSeo:
      'Tavoli fissi e allungabili e sedie Zamagna Italia e Ingenia Casa a Sale Marasino (BS), per cucina e soggiorno. Montaggio compreso in zona Brescia.',
    intro:
      'Il tavolo è il punto dove la casa si ritrova: proponiamo i tavoli fissi e allungabili e le sedie Zamagna Italia e Ingenia Casa, da abbinare alla cucina o al soggiorno che hai già o che stiamo progettando insieme. Finiture e misure scelte per la stanza reale, non per il catalogo.',
    approfondimento: [
      {
        titolo: 'Fissi o allungabili',
        testo:
          'Per la tavola di tutti i giorni o per quando arriva la famiglia al completo: i tavoli allungabili Zamagna e Ingenia Casa cambiano misura senza cambiare stanza.',
        foto: 'tavolo-sedie',
      },
      {
        titolo: 'Abbinati a cucina e soggiorno',
        testo:
          'Finiture coordinate con la composizione cucina o living che scegli, così tavolo e sedie non sembrano aggiunti dopo.',
        foto: 'zona-pranzo',
      },
    ],
    correlate: ['soggiorno'],
    marchi: ['zamagna-italia', 'ingenia-casa'],
    foto: 'tavolo-sedie',
  },
  {
    slug: 'camere',
    nome: 'Camere e camerette',
    etichetta: 'camere e camerette',
    titoloSeo: 'Camere e camerette a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Camere matrimoniali, camerette e letti imbottiti a Sale Marasino (BS). Progettazione, rilievo misure e montaggio compresi in zona Brescia.',
    intro:
      'Armadi, letti e camerette pensati per gli spazi veri delle case sul lago: veniamo a misurare la stanza e progettiamo la camera intorno a come la vivi, dalla cameretta che deve crescere con i bambini alla camera matrimoniale. Sistemi componibili Gruppo Colombini e letti imbottiti Stilfar Italia, con il montaggio compreso.',
    approfondimento: [
      {
        titolo: 'Letti imbottiti su misura',
        testo:
          'I letti Stilfar Italia, in tessuto o pelle, con o senza contenitore: la misura si adatta alla stanza, non il contrario.',
        foto: 'camera-matrimoniale',
      },
      {
        titolo: 'Camerette che crescono con i bambini',
        testo:
          'I sistemi componibili Gruppo Colombini si aggiornano nel tempo — un letto singolo che diventa a castello, un armadio che si allunga — senza rifare la stanza da capo.',
        foto: 'cameretta',
      },
    ],
    correlate: ['materassi'],
    marchi: ['gruppo-colombini', 'stilfar-italia'],
    foto: 'camera-matrimoniale',
  },
  {
    slug: 'materassi',
    nome: 'Materassi e reti',
    etichetta: 'riposo su misura',
    titoloSeo: 'Materassi e reti a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Materassi e reti Cuorflex a Sale Marasino (BS): consulenza in negozio per scegliere il sistema letto giusto. Alcuni articoli in pronta consegna.',
    intro:
      'Dormire bene dipende dalla coppia materasso e rete: ti aiutiamo a scegliere tra i sistemi Cuorflex in base a come dormi, senza fretta. Alcuni modelli sono in pronta consegna, altri si ordinano su misura.',
    approfondimento: [
      {
        titolo: 'Si prova, non si sceglie a caso',
        testo:
          'In negozio provi i materassi Cuorflex sdraiato, non solo guardandoli: portanza, temperatura e sostegno si sentono, non si leggono su un’etichetta.',
        foto: 'materasso-memory',
      },
      {
        titolo: 'La rete giusta fa la differenza',
        testo:
          'Una rete a doghe adatta al peso e alla postura completa il materasso: te la consigliamo insieme, come un sistema unico.',
        foto: 'rete-cuorflex',
      },
    ],
    correlate: ['camere'],
    marchi: ['cuorflex'],
    foto: 'materasso-memory',
  },
  {
    slug: 'bagni',
    nome: 'Bagni',
    etichetta: 'arredo bagno Scavolini',
    titoloSeo: 'Arredo bagno Scavolini a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Mobili e complementi bagno Scavolini a Sale Marasino (BS): progettazione su misura e montaggio compresi in zona Brescia.',
    intro:
      'Scavolini, lo stesso marchio con cui componiamo le cucine, propone anche soluzioni complete per il bagno: mobili, lavabi e complementi da comporre sulle misure della stanza, con finiture che puoi abbinare al resto della casa.',
    approfondimento: [
      {
        titolo: 'Le stesse finiture di casa',
        testo:
          'Perché il bagno con Scavolini condivide il linguaggio delle cucine e del living: colori e materiali si abbinano tra le stanze, se lo desideri.',
        foto: 'bagno-scavolini',
      },
      {
        titolo: 'Composizioni su misura',
        testo:
          'Bagni piccoli o articolati, con o senza finestra: la composizione si disegna sulle misure reali della stanza, dopo un sopralluogo.',
        foto: 'mobile-bagno',
      },
    ],
    correlate: ['cucine'],
    marchi: ['scavolini'],
    foto: 'bagno-scavolini',
  },
];
