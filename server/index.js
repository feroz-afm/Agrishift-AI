// Production server for any Node host (Render, Railway, a laptop, a Raspberry Pi):
//   npm run build && npm start   →   http://localhost:3000  (app + /api/*)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeHandler, handlers } from './handlers.js';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
};

async function serveStatic(req, res) {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(DIST, path));
  if (!file.startsWith(DIST)) { res.statusCode = 403; return res.end(); }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, 'index.html'); // SPA fallback
  }
  try {
    const body = await readFile(file);
    res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', /\/assets\//.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found — run `npm run build` first.');
  }
}

http.createServer(async (req, res) => {
  const m = req.url.match(/^\/api\/([a-z]+)/);
  if (m && handlers[m[1]]) return nodeHandler(m[1])(req, res);
  return serveStatic(req, res);
}).listen(PORT, () => console.log(`AgriShift running → http://localhost:${PORT}  (API: /api/health)`));
