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
    categorie: ['cucine', 'soggiorno', 'bagni'],
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
    categorie: ['tavoli-sedie'],
  },
  {
    slug: 'ingenia-casa',
    nome: 'Ingenia Casa',
    prodotti: 'Tavoli e sedie',
    descrizione:
      'Tavoli e sedie per cucina e soggiorno, in tante finiture per completare la composizione.',
    categorie: ['tavoli-sedie'],
  },
];
