import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const prodotti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prodotti' }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      categoria: z.enum([
        'cucine',
        'soggiorno',
        'divani',
        'tavoli-sedie',
        'camere',
        'materassi',
        'bagni',
      ]),
      marchio: z.string().optional(),
      foto: image(),
      prontaConsegna: z.boolean().default(false),
      inEvidenza: z.boolean().default(false),
    }),
});

export const collections = { prodotti };
