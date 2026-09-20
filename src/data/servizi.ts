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
    slug: 'rilievo-misure',
    nome: 'Rilievo misure',
    breve: 'Veniamo noi a misurare la stanza, prima dell’ordine.',
    descrizione:
      'Prima di ordinare veniamo a casa tua a prendere le misure: pareti, prese, finestre, pendenze. È il passaggio che evita le sorprese al montaggio, ed è compreso nel servizio in zona Brescia e sul lago d’Iseo.',
  },
  {
    slug: 'progettazione',
    nome: 'Progettazione',
    breve: 'Disegniamo la stanza sulle tue misure e sulle tue abitudini.',
    descrizione:
      'Partiamo da come vivi la casa, non dal catalogo. Disegniamo la composizione sulle misure reali della stanza, scegliamo insieme finiture e materiali e ti mostriamo il progetto prima di ordinare, così ogni scelta è chiara.',
  },
  {
    slug: 'montaggio',
    nome: 'Consegna e montaggio',
    breve: 'Consegna e montaggio con la nostra squadra.',
    descrizione:
      'Consegniamo e montiamo noi, con le stesse persone che hanno seguito il progetto dall’inizio. Se serve, smontiamo e portiamo via i mobili vecchi. A fine lavoro la stanza è pronta da usare.',
  },
];

export const NOTA_SERVIZI = 'Servizi compresi in zona Brescia, lago d’Iseo e Franciacorta';
