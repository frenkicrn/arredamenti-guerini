export const NEGOZIO = {
  nome: 'Arredamenti Guerini snc',
  claim: 'Arrediamo la tua casa dal progetto al montaggio',
  descrizione:
    'Negozio di arredamenti a Sale Marasino, sul lago d’Iseo: cucine, camere, divani, materassi e soggiorni dei migliori marchi, con progettazione e montaggio compresi in zona Brescia.',
  indirizzo: {
    via: 'Via Roma 1', // DA CONFERMARE COL CLIENTE
    cap: '25057',
    comune: 'Sale Marasino',
    provincia: 'BS',
  },
  telefono: '+39 030 000 0000', // DA CONFERMARE COL CLIENTE
  whatsapp: '+39 330 000 0000', // DA CONFERMARE COL CLIENTE
  email: 'info@arredamentiguerini.it', // DA CONFERMARE COL CLIENTE
  facebook: 'https://www.facebook.com/arredamentiguerinisnc/',
  instagram: '', // DA CONFERMARE COL CLIENTE (vuoto = link non mostrato)
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Arredamenti+Guerini+Sale+Marasino&output=embed',
  orari: [
    { giorni: 'Lunedì', orario: 'Chiuso' }, // DA CONFERMARE COL CLIENTE
    { giorni: 'Martedì – Sabato', orario: '9:00–12:00 · 15:00–19:00' },
    { giorni: 'Domenica', orario: 'Chiuso' },
  ],
  consegna:
    'Consegna a partire da 1 mese · alcuni articoli in pronta consegna',
  web3formsKey: 'INSERIRE_CHIAVE_WEB3FORMS', // DA CONFERMARE COL CLIENTE
};

export const CATEGORIE = [
  { slug: 'camere', nome: 'Camere' },
  { slug: 'cucine', nome: 'Cucine' },
  { slug: 'divani', nome: 'Divani' },
  { slug: 'materassi', nome: 'Materassi' },
  { slug: 'soggiorno', nome: 'Mobili soggiorno' },
  { slug: 'elettrodomestici', nome: 'Elettrodomestici' },
] as const;
