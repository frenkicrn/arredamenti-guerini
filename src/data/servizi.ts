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
