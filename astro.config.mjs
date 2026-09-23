// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Dominio ufficiale senza www: da qui derivano sitemap, URL canonici e
  // i dati strutturati. Il www rimanda qui con una redirect rule su Cloudflare.
  site: 'https://arredamentiguerini.it',
  integrations: [sitemap()],
});
