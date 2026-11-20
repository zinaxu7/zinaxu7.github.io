# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal static website hosted on GitHub Pages at `https://zinaxu7.github.io` (set as `site` in `astro.config.mjs`, used for canonical URLs, sitemap and RSS). It serves two purposes: an academic blog, and a profile of the owner (a health informatics PhD candidate) covering bio, publications, project case studies and CV. Built with Astro 7 + Tailwind CSS v4 and output as a fully static site, so do not add anything that needs a server (SSR adapters, API routes, server-side form handling). The README is in Chinese; site content is in English.

## Commands

Requires Node.js 22+.

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static build to ./dist (also validates all content against the schemas)
npm run preview   # serve ./dist
npx astro check   # type-check .astro/.ts files (needs @astrojs/check, not installed yet)
```

There are no tests or linter. `npm run build` is the main correctness check: a content file that violates its schema fails the build.

## Architecture

**Content and site code are kept apart, and this split is a hard requirement from the owner.** They only ever want to edit files under `content/` (Markdown and YAML) and never touch rendering. So: no page text, personal data or per-entry markup in `src/`; any new kind of content gets a file under `content/` plus a schema, and the template in `src/` renders it. Do not ask the owner to write HTML, JSX or TypeScript to add content.

```
content/   everything the owner edits
  about.md            profile fields in frontmatter (name, role, email, links, interests, photo) + bio as the body
  blog/*.md           posts
  projects/*.md       case studies
  publications.yaml   paper list
  cv.yaml             CV sections
  cv.pdf              optional; enables the download button
  papers/             PDFs referenced from publications.yaml
  images/             photo and images referenced from Markdown
src/       site code: pages, layout, components, styles, schemas
```

- **`src/content.config.ts`** defines one collection per content file/folder, with loaders pointing at `./content/...`:
  - `about`: `glob` over the single file `content/about.md`. Read it through `getSite()` in `src/lib/site.ts`, which adds defaults (`authorName` falls back to `name`, `initials` are derived) and the `nav` array (nav is site structure, so it lives in code). `authorName` must match the name as written in publication author lists, because `PubItem.astro` emphasises that string. Empty `links` values hide that link.
  - `blog`, `projects`: `glob` loaders. The file name is the entry `id` and URL slug. Blog posts with `draft: true` are filtered out in every `getCollection('blog', ...)` call (index, home page, `[id]` routes, RSS), so any new query must apply the same filter. Projects sort by `order`; optional `category` groups them.
  - `publications`: `file` loader over the YAML list. `id` is the collection id and BibTeX key; `featured: true` also lists it on the home page; `abbr` is the venue badge.
  - `cv`: `file` loader with a custom `parser` (uses the `yaml` package) that assigns ids and an `order` from list position, since the YAML is a plain list of sections. Each section has dated `entries` or label/value `items`.
- **Images** referenced from content use relative paths (`./images/x.jpg` from `about.md`, `../images/x.jpg` from a post or project). Frontmatter image fields (`photo`, project `image`) use the schema `image()` helper and are rendered with `astro:assets` `<Image>`, so they are resized and converted at build time.
- **PDFs** under `content/` are bundled through `import.meta.glob` in `src/lib/files.ts`. `fileUrl('papers/x.pdf')` returns the built URL, passes full URLs through, and throws a readable build error for a missing file. Keep the `no-inline` query: without it Vite inlines small files as data URIs.
- **BibTeX is generated, not stored**: `src/lib/bibtex.ts` builds the entry from the YAML fields at build time. `type` picks the venue field (`article` → `journal`, `misc` → `howpublished`, otherwise `booktitle`). A new publications field that should appear in BibTeX needs adding in both `content.config.ts` and `bibtex.ts`.
- **Layout**: every page wraps `src/layouts/Base.astro`, which handles `<head>` metadata (title as `Title | Name`), the nav (inline links from `sm` up, hamburger menu below), footer links, and the scroll-reveal script. A page can fill the full-width `hero` slot, which renders above the centred `max-w-4xl` main column; only the home page does.
- `README.md` (Chinese) is the owner's guide to editing content. Update it whenever a content file, field or path changes.

## Design

- **Home page** (`src/pages/index.astro`) is deliberately the showy page: gradient hero, gradient name, rotating ring around the photo, staggered `.fade-up` entrance, and `.reveal` sections that fade in on scroll. These effects are defined at the bottom of `global.css` and are switched off under `prefers-reduced-motion`. `.reveal` only hides content when JS is running (`html.js`).
- **Publications, CV and Projects follow al-folio's layouts**, reimplemented in Astro (al-folio itself is Jekyll and is not a dependency): publications grouped by year with a venue badge column and ABS / BIB / PDF... buttons that expand panels in place (script in `PubItem.astro`); CV as cards with period badges; projects as a responsive card grid.
- **Must work on phones and desktop browsers.** Build mobile-first with Tailwind breakpoints: two-column grids collapse to one below `sm`, and nothing may cause horizontal scrolling at 390px wide. Check both widths after any layout change.
- **Styling**: Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config`). Theme tokens (`paper`, `card`, `ink`, `muted`, `line`, `accent`, `accent-soft`, `warm`, font families) live in the `@theme` block at the top of `src/styles/global.css` and are overridden for dark mode with `prefers-color-scheme`. Use these token classes (`text-muted`, `border-line`, `bg-accent-soft`, ...) rather than raw Tailwind colors so dark mode keeps working. `h1`–`h3` are serif through an unlayered rule in `global.css`, which beats the `font-sans` utility. Markdown bodies are styled by a hand-written `.prose` class in the same file (there is no typography plugin).
- Brand icons on the home page come from the `simple-icons` package (it has no LinkedIn icon, so that button shows the text "in").

## Content state

Most content under `content/` is placeholder (`Your Name`, `yourname2026example`, `hello-world.md`, `example-project.md`) waiting to be replaced. The project-case-study template uses five fixed headings (Problem, ...); keep that structure when writing new projects.

## Deployment

GitHub repo: `git@github.com:zinaxu7/zinaxu7.github.io.git` (remote `origin`, branch `main`). Every push to `main` runs `.github/workflows/deploy.yml`, which builds with `withastro/action` (Node 22) and publishes with `actions/deploy-pages`. The repo's Settings → Pages → Source must be set to "GitHub Actions". Because this is a `<user>.github.io` repo, the site is served at the domain root, so no `base` path is configured in `astro.config.mjs`. Keep it that way, or every absolute link like `/blog/` breaks.
