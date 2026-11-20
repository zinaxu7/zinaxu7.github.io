type Pub = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi?: string;
  url?: string;
};

// Builds a BibTeX entry from one publications.yaml record.
export function toBibtex(id: string, p: Pub): string {
  const venueField =
    p.type === 'article' ? 'journal' : p.type === 'misc' ? 'howpublished' : 'booktitle';
  const fields: [string, string | undefined][] = [
    ['title', p.title],
    ['author', p.authors.join(' and ')],
    [venueField, p.venue],
    ['year', String(p.year)],
    ['doi', p.doi || undefined],
    ['url', p.url || undefined],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n');
  return `@${p.type}{${id},\n${body}\n}`;
}
