import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import type { Plugin } from 'vite';

function puppetFilePlugin(): Plugin {
  return {
    name: 'puppet-file',
    configureServer(server) {
      server.middlewares.use('/api/puppet', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // GET /api/puppet/load?path=...
        if (req.method === 'GET') {
          const qs = req.url?.split('?')[1] ?? '';
          const filePath = new URLSearchParams(qs).get('path');
          if (!filePath) { res.statusCode = 400; res.end(JSON.stringify({ error: 'missing path' })); return; }
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, content }));
          } catch (e) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }

        // POST /api/puppet/save  { path, content }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { path: filePath, content } = JSON.parse(body) as { path: string; content: string };
              fs.writeFileSync(filePath, content, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), puppetFilePlugin()],
  resolve: {
    alias: {
      '@animal-clamp/puppet': path.resolve(__dirname, '../../packages/puppet/src/index.ts'),
    },
  },
});
