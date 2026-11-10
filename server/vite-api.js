// Vite plugin: serves the same /api/* backend during `npm run dev` and `npm run preview`,
// so one command runs frontend + backend on your laptop (and your phone on the same Wi-Fi).
import { nodeHandler, handlers } from './handlers.js';

export default function apiPlugin() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const m = req.url && req.url.match(/^\/api\/([a-z]+)/);
      if (!m) return next();
      if (!handlers[m[1]]) { res.statusCode = 404; res.end('{"error":"Not found"}'); return; }
      await nodeHandler(m[1])(req, res);
    });
  };
  return { name: 'agrishift-api', configureServer: mount, configurePreviewServer: mount };
}
