// PDFs kept under /content (cv.pdf, papers/*.pdf) are bundled into the site by Vite.
const files = import.meta.glob<string>('/content/**/*.pdf', { eager: true, query: '?url&no-inline', import: 'default' });

// Turns a value from a content file into a link: full URLs pass through,
// anything else is looked up as a path inside /content (e.g. 'papers/my-paper.pdf').
export function fileUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path)) return path;
  const url = files['/content/' + path.replace(/^(\.?\/)+/, '')];
  if (!url) throw new Error(`File not found: content/${path}. Check the path in your content file.`);
  return url;
}

export const hasFile = (path: string) => '/content/' + path in files;
