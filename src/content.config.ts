// Schemas for everything under /content. Site code lives in /src; all editable text lives in /content.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// content/about.md: profile fields in the header, bio as the Markdown body.
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './content' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      authorName: z.string().optional(),
      initials: z.string().optional(),
      role: z.string(),
      affiliation: z.string(),
      tagline: z.string(),
      description: z.string(),
      email: z.string(),
      photo: image().optional(),
      interests: z.array(z.string()).default([]),
      links: z
        .object({
          scholar: z.string().nullish(),
          orcid: z.string().nullish(),
          github: z.string().nullish(),
          linkedin: z.string().nullish(),
        })
        .default({}),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      role: z.string(),
      period: z.string(),
      methods: z.array(z.string()).default([]),
      // Optional card image, relative to the project file, e.g. ../images/my-project.jpg
      image: image().optional(),
      // Optional group heading on the Projects page, e.g. 'Research' or 'Design'.
      category: z.string().optional(),
      order: z.number().default(99),
    }),
});

const publications = defineCollection({
  loader: file('./content/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    type: z.enum(['article', 'inproceedings', 'incollection', 'misc']).default('article'),
    // Short venue label shown as a badge next to the entry, e.g. 'JAMIA' or 'CHI'.
    abbr: z.string().optional(),
    abstract: z.string().optional(),
    doi: z.string().optional(),
    pdf: z.string().optional(),
    url: z.string().optional(),
    code: z.string().optional(),
    slides: z.string().optional(),
    poster: z.string().optional(),
    note: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// content/cv.yaml is a plain list of sections; give each an id and keep the file order.
const cv = defineCollection({
  loader: file('./content/cv.yaml', {
    parser: (text) =>
      (parse(text) as object[]).map((section, i) => ({ id: String(i).padStart(2, '0'), order: i, ...section })),
  }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    entries: z
      .array(
        z.object({
          period: z.coerce.string(),
          title: z.string(),
          place: z.string(),
          location: z.string().optional(),
          details: z.array(z.string()).optional(),
        }),
      )
      .optional(),
    items: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  }),
});

export const collections = { about, blog, projects, publications, cv };
