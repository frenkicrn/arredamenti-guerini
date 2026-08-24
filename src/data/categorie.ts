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
    titoloSeo: 'Camere e camerette a Sale Marasino (Lago d\'Iseo) | Arredamenti Guerini',
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
    titoloSeo: 'Cucine Scavolini a Sale Marasino e sul Lago d\'Iseo | Arredamenti Guerini',
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
    titoloSeo: 'Divani e poltrone relax a Sale Marasino (Lago d\'Iseo) | Arredamenti Guerini',
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
    titoloSeo: 'Materassi e reti a Sale Marasino (Lago d\'Iseo) | Arredamenti Guerini',
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
    titoloSeo: 'Elettrodomestici da incasso a Sale Marasino (Lago d\'Iseo) | Arredamenti Guerini',
    descrizioneSeo:
      'Elettrodomestici da incasso abbinati alla tua cucina Scavolini, a Sale Marasino (BS): scelta, consegna e installazione con il resto della composizione.',
    intro:
      'Forni, piani cottura, frigoriferi e lavastoviglie da incasso scelti insieme alla cucina, così misure e finiture combaciano. Li consegniamo e installiamo noi, con il resto della composizione.',
    marchi: ['scavolini'],
    foto: 'forno-incasso',
  },
];
