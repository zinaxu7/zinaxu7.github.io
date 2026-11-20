import { getEntry } from 'astro:content';

// Navigation is site structure, so it stays in code. Everything else comes from content/about.md.
export const nav = [
  { label: 'About', href: '/' },
  { label: 'Publications', href: '/publications/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'CV', href: '/cv/' },
];

export async function getSite() {
  const entry = await getEntry('about', 'about');
  if (!entry) throw new Error('content/about.md is missing');
  const d = entry.data;
  return {
    ...d,
    authorName: d.authorName ?? d.name,
    initials:
      d.initials ??
      d.name
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    nav,
    // The entry itself, for rendering the bio (the Markdown body of about.md).
    entry,
  };
}
