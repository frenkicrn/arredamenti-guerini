export interface Approfondimento {
  /** Titolo breve del blocco (h3) */
  titolo: string;
  /** 2-4 frasi di approfondimento */
  testo: string;
  /** nome file (senza estensione) in src/assets/prodotti/ — assente finché non arriva una foto reale */
  foto?: string;
}

export interface Categoria {
  slug: string;
  nome: string;
  /** Etichetta breve mostrata sopra il nome del reparto */
  etichetta: string;
  /** Una frase per la didascalia del carosello Home */
  sommario: string;
  /** <title> completo della pagina categoria */
  titoloSeo: string;
  /** meta description (max 155 caratteri) */
  descrizioneSeo: string;
  /** H1 della pagina reparto */
  titolo: string;
  /** Introduzione della pagina categoria (2-3 frasi) */
  intro: string;
  /** Sezioni di approfondimento testo (+ foto se disponibile), mostrate alternate sinistra/destra */
  approfondimento: Approfondimento[];
  /** slug di categorie correlate (src/data/categorie.ts), mostrate come rimando in fondo all'intro */
  correlate?: string[];
  /** slug dei marchi (src/data/marchi.ts) */
  marchi: string[];
  /** nome file (senza estensione) in src/assets/prodotti/ — assente finché non arriva una foto reale ("Foto in arrivo") */
  foto?: string;
}

export const CATEGORIE: Categoria[] = [
  {
    slug: 'cucine',
    nome: 'Cucine',
    etichetta: 'Cucine ed elettrodomestici',
    sommario:
      'Composizione, finiture, piano di lavoro ed elettrodomestici da incasso scelti nello stesso momento, sulle misure vere della stanza.',
    titoloSeo: 'Cucine Scavolini a Sale Marasino e sul Lago d’Iseo | Arredamenti Guerini',
    descrizioneSeo:
      'Cucine Scavolini componibili e su misura a Sale Marasino (BS), con elettrodomestici da incasso abbinati: progetto e montaggio compresi in zona Brescia.',
    titolo: 'Cucine a Sale Marasino e sul lago d’Iseo',
    intro:
      'La cucina è la stanza in cui si passa più tempo, e la progettiamo con te sulle misure vere della tua casa: composizione, finiture, piano di lavoro ed elettrodomestici da incasso scelti nello stesso momento, così tutto combacia. Dal disegno al montaggio hai una sola squadra.',
    approfondimento: [
      {
        titolo: 'Il progetto, prima di tutto',
        testo:
          'Veniamo a misurare la tua cucina prima di ordinare qualsiasi cosa: pareti, prese, tubazioni, pendenze. Il disegno tiene conto degli spazi reali, non di un modulo standard, e lo vedi prima di confermare.',
        foto: 'cucina-madeleine-b',
      },
      {
        titolo: 'Classica o lineare, la stessa cura',
        testo:
          'Dalle ante a telaio del legno massello alle superfici lisce delle composizioni lineari: cambiano le finiture, non il modo di lavorare. In negozio le vedi dal vivo e capisci quale regge meglio la tua giornata.',
        foto: 'cucina-regola',
      },
      {
        titolo: 'Elettrodomestici da incasso',
        testo:
          'Forno, piano cottura, frigorifero e lavastoviglie si scelgono insieme alla composizione, non dopo: misure e finiture combaciano con il resto della cucina già dal progetto.',
        foto: 'cucina-moda-a',
      },
    ],
    correlate: ['bagni'],
    marchi: ['scavolini'],
    foto: 'cucina-moda-b',
  },
  {
    slug: 'soggiorno',
    nome: 'Soggiorno',
    etichetta: 'Living componibile',
    sommario:
      'Pareti attrezzate componibili disegnate attorno a quello che devi tenere, al centimetro della tua parete.',
    titoloSeo: 'Soggiorno e living componibile a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Pareti attrezzate e living componibili Gruppo Colombini e Scavolini a Sale Marasino (BS): progetto su misura e montaggio compresi in zona Brescia.',
    titolo: 'Living e pareti attrezzate su misura',
    intro:
      'Il soggiorno è la stanza che cambia più spesso: televisione, libri, oggetti che si accumulano. Le pareti attrezzate componibili si disegnano attorno a quello che devi tenere, con moduli chiusi dove serve ordine e aperti dove vuoi mostrare. Partiamo dalla parete che hai, comprese porte e finestre nei punti scomodi.',
    approfondimento: [
      {
        titolo: 'Componibile vuol dire sulle tue misure',
        testo:
          'Larghezze, profondità e altezze si combinano modulo per modulo: la composizione arriva al centimetro della tua parete, non alla misura più vicina del catalogo. Le finiture si coordinano con la cucina se le stanze sono aperte l’una sull’altra.',
        foto: 'soggiorno-composizione',
      },
    ],
    correlate: ['tavoli-sedie'],
    marchi: ['gruppo-colombini', 'scavolini'],
    foto: 'soggiorno-parete',
  },
  {
    slug: 'tavoli-sedie',
    nome: 'Tavoli e sedie',
    etichetta: 'Zona pranzo',
    sommario:
      'Tavoli allungabili in ceramica, legno e laminato, con le sedie da abbinare per forma e tessuto.',
    titoloSeo: 'Tavoli e sedie per la zona pranzo a Sale Marasino | Arredamenti Guerini',
    descrizioneSeo:
      'Tavoli fissi e allungabili e sedie Zamagna Italia e Ingenia Casa a Sale Marasino (BS), per cucina e soggiorno. Montaggio compreso in zona Brescia.',
    titolo: 'Tavoli e sedie per la zona pranzo',
    intro:
      'Un tavolo si sceglie in due tempi: quanti siete di solito e quanti diventate a Natale. Per questo lavoriamo molto con gli allungabili, in ceramica, legno e laminato, e con le sedie da abbinare per forma e tessuto. In negozio provi la seduta e vedi i campioni dei piani dal vivo.',
    approfondimento: [
      {
        titolo: 'Allungabile, senza rinunciare alla misura di ogni giorno',
        testo:
          'I modelli allungabili restano compatti nell’uso quotidiano e aprono di 40, 80 o 120 centimetri quando serve. Ti diciamo quanto spazio serve intorno perché le sedie girino davvero, misurando la stanza.',
        foto: 'tavolo-infinity',
      },
      {
        titolo: 'Le sedie si provano, non si guardano',
        testo:
          'Altezza della seduta, profondità dello schienale, tessuto che regge le macchie: sono cose che si capiscono sedendosi. In negozio hai i modelli e i campioni dei rivestimenti da abbinare al piano che hai scelto.',
        foto: 'tavolo-zamagna',
      },
    ],
    correlate: ['soggiorno'],
    marchi: ['zamagna-italia', 'ingenia-casa'],
    foto: 'tavolo-paris',
  },
  {
    slug: 'divani',
    nome: 'Divani e poltrone',
    etichetta: 'Divani e poltrone relax',
    sommario:
      'Divani fissi e angolari con misure e rivestimenti su richiesta, più poltrone relax elettriche da provare in negozio.',
    titoloSeo: 'Divani e poltrone relax a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Divani Biel e poltrone elettriche Vitarelax a Sale Marasino (BS). Provali in negozio: consegna e montaggio compresi in zona Brescia.',
    titolo: 'Divani e poltrone relax',
    intro:
      'Un divano si giudica sedendosi, ed è il motivo per cui teniamo in negozio i modelli che proponiamo più spesso. Lavoriamo con divani fissi e angolari, con misure, rivestimenti e sedute su richiesta, e con poltrone relax elettriche per chi ha bisogno di alzarsi senza sforzo. Se la misura del tuo spazio è difficile, la prendiamo noi.',
    approfondimento: [
      {
        titolo: 'Angolare o lineare, sulla stanza che hai',
        testo:
          'La penisola va bene finché lascia passare: prima di proporti una misura veniamo a vedere dove sono porte, finestre e passaggi. Rivestimenti sfoderabili, sedute più morbide o più sostenute e profondità si scelgono a parte, modello per modello.',
        foto: 'divano-erika',
      },
      {
        titolo: 'Poltrone relax elettriche',
        testo:
          'Schienale e poggiapiedi si regolano con un motore, e alcuni modelli aiutano ad alzarsi. È un acquisto che si fa per stare comodi tutti i giorni: vieni a provarle, così capiamo insieme misura e meccanismo giusti.',
        foto: 'poltrona-relax',
      },
    ],
    marchi: ['biel-divani', 'vitarelax'],
    foto: 'divano-tango',
  },
  {
    slug: 'camere',
    nome: 'Camere e camerette',
    etichetta: 'Camere e camerette',
    sommario:
      'Letti imbottiti, armadi e camerette componibili che si riconfigurano man mano che i figli crescono.',
    titoloSeo: 'Camere e camerette a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Camere matrimoniali, camerette e letti imbottiti a Sale Marasino (BS). Progettazione, rilievo misure e montaggio compresi in zona Brescia.',
    titolo: 'Camere e camerette',
    intro:
      'La camera dei genitori e quella dei figli hanno tempi diversi: la prima si progetta una volta e resta, la seconda deve cambiare tre o quattro volte. Lavoriamo con letti imbottiti, armadi e sistemi componibili per camerette che si riconfigurano, dal letto a terra alla scrivania per lo studio.',
    approfondimento: [
      {
        titolo: 'Camerette che si rifanno, non si rifanno da capo',
        testo:
          'Letto, armadio e scrivania sono moduli: quando il bambino cresce si cambia il letto e si sposta la scrivania, senza buttare il resto. Progettiamo tenendo conto di quanto spazio serve davvero per giocare oggi e per studiare fra cinque anni.',
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
    etichetta: 'Riposo su misura',
    sommario:
      'Materassi da provare stesi, abbinati alla rete giusta: un buon materasso su una rete sbagliata rende metà.',
    titoloSeo: 'Materassi e reti a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Materassi e reti Cuorflex a Sale Marasino (BS): consulenza in negozio per scegliere il sistema letto giusto. Alcuni articoli in pronta consegna.',
    titolo: 'Materassi e reti',
    intro:
      'Il materasso è l’unico arredo che usi otto ore al giorno, e si sceglie provandolo. In negozio ti facciamo stendere sui modelli che teniamo, ti spieghiamo la differenza tra le lastre e abbiniamo la rete giusta, perché un buon materasso su una rete sbagliata rende metà.',
    approfondimento: [
      {
        titolo: 'La lastra e il tessuto cambiano il riposo',
        testo:
          'Molle insacchettate, memory, lattice: cambiano il modo in cui il materasso sostiene e quanto trattiene il calore. Anche il rivestimento conta, perché è quello che tocchi: ti facciamo vedere e sentire la differenza, senza venderti la sigla più costosa.',
        foto: 'materasso-graphene',
      },
    ],
    correlate: ['camere'],
    marchi: ['cuorflex'],
    foto: 'materasso-tencel',
  },
  {
    slug: 'bagni',
    nome: 'Bagni',
    etichetta: 'Arredo bagno',
    sommario:
      'Mobili sospesi o a terra, lavabi, specchi contenitori e colonne progettati tenendo conto di dove passano gli impianti.',
    titoloSeo: 'Arredo bagno Scavolini a Sale Marasino (Lago d’Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Mobili e complementi bagno Scavolini a Sale Marasino (BS): progettazione su misura e montaggio compresi in zona Brescia.',
    titolo: 'Arredo bagno, dal mobile allo specchio',
    intro:
      'Nel bagno lo spazio è quasi sempre poco e vincolato dagli scarichi. Progettiamo mobili sospesi e a terra, lavabi, specchi contenitori e colonne sulle misure della stanza, tenendo conto di dove passano gli impianti. Le finiture si coordinano con i rivestimenti che hai già scelto o che devi ancora scegliere.',
    approfondimento: [
      {
        titolo: 'Sospeso, per guadagnare spazio',
        testo:
          'Il mobile sospeso libera il pavimento, semplifica la pulizia e permette di scegliere l’altezza del piano in base a chi lo usa. Dove gli scarichi non lo consentono, restiamo a terra e recuperiamo spazio in altezza con una colonna.',
      },
    ],
    correlate: ['cucine'],
    marchi: ['scavolini'],
    foto: 'bagno-rivo',
  },
];
