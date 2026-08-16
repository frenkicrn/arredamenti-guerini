// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // DA AGGIORNARE quando si acquista il dominio .it
  site: 'https://arredamenti-guerini.pages.dev',
  integrations: [sitemap()],
});
