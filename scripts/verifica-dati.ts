// Verifica di coerenza dei dati del sito. Eseguire con: npm test
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CATEGORIE } from '../src/data/categorie.ts';
import { MARCHI } from '../src/data/marchi.ts';
import { SERVIZI } from '../src/data/servizi.ts';
import { FAQ } from '../src/data/faq.ts';
import { NEGOZIO } from '../src/data/negozio.ts';

const SLUG_ATTESI = ['cucine', 'soggiorno', 'divani', 'tavoli-sedie', 'camere', 'materassi', 'bagni'];

assert.deepEqual(CATEGORIE.map((c) => c.slug), SLUG_ATTESI, 'slug categorie diversi da quelli della collection');

const slugMarchi = new Set(MARCHI.map((m) => m.slug));
assert.equal(MARCHI.length, 8, 'devono esserci 8 marchi');
assert.equal(slugMarchi.size, 8, 'slug marchi duplicati');

const slugCategorie = new Set(SLUG_ATTESI);
for (const c of CATEGORIE) {
  assert.ok(c.marchi.length > 0, `categoria ${c.slug}: nessun marchio collegato`);
  for (const m of c.marchi) assert.ok(slugMarchi.has(m), `categoria ${c.slug}: marchio "${m}" inesistente`);
  assert.ok(c.titoloSeo.includes('Sale Marasino'), `categoria ${c.slug}: titoloSeo senza località`);
  assert.ok(c.descrizioneSeo.length <= 155, `categoria ${c.slug}: descrizioneSeo di ${c.descrizioneSeo.length} caratteri (max 155)`);
  assert.ok(existsSync(`src/assets/prodotti/${c.foto}.jpg`), `categoria ${c.slug}: foto ${c.foto}.jpg mancante`);
  assert.ok(c.approfondimento.length >= 2, `categoria ${c.slug}: servono almeno 2 sezioni di approfondimento`);
  for (const a of c.approfondimento) {
    assert.ok(existsSync(`src/assets/prodotti/${a.foto}.jpg`), `categoria ${c.slug}: foto approfondimento ${a.foto}.jpg mancante`);
  }
  for (const s of c.correlate ?? []) assert.ok(slugCategorie.has(s), `categoria ${c.slug}: correlata "${s}" inesistente`);
}

for (const m of MARCHI) {
  assert.ok(m.categorie.length > 0, `marchio ${m.slug}: nessuna categoria`);
  for (const s of m.categorie) assert.ok(SLUG_ATTESI.includes(s), `marchio ${m.slug}: categoria "${s}" inesistente`);
  const collegato = CATEGORIE.some((c) => c.marchi.includes(m.slug));
  assert.ok(collegato, `marchio ${m.slug}: nessuna categoria lo elenca`);
}

assert.equal(SERVIZI.length, 4, 'devono esserci 4 servizi');
assert.equal(FAQ.length, 5, 'devono esserci 5 FAQ');
assert.ok(NEGOZIO.mapsDirectionsUrl.startsWith('https://'), 'mapsDirectionsUrl non valido');
assert.ok(NEGOZIO.claimBreve.length > 0, 'claimBreve vuoto');

console.log('dati OK');
