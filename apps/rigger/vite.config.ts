import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import type { Plugin } from 'vite';

// Directories scanned for puppet model files.
// Relative paths are resolved from the monorepo root; absolute paths are used as-is.
const MODEL_DIRS = ['apps/remotion/src/characters/puppet'];
const MODEL_PATTERN = /(?<!\.test)\.(js|ts)$/;
const ROOT = path.resolve(__dirname, '../..');

function extractModelName(content: string): string | null {
  const m = content.match(/["']?name["']?\s*:\s*["']([^"']+)["']/);
  return m ? m[1] : null;
}

function listModels(): { name: string; path: string; modelName: string | null }[] {
  const results: { name: string; path: string; modelName: string | null }[] = [];
  for (const dir of MODEL_DIRS) {
    const abs = path.isAbsolute(dir) ? dir : path.join(ROOT, dir);
    try {
      for (const f of fs.readdirSync(abs)) {
        if (!MODEL_PATTERN.test(f)) continue;
        if (f.startsWith('index') || f.startsWith('_')) continue;
        const filePath = path.join(abs, f);
        let content = '';
        try { content = fs.readFileSync(filePath, 'utf-8'); } catch { continue; }
        // skip files that aren't puppet models (engine files, old format without bones)
        if (!content.includes('bones') || !content.includes('shapes')) continue;
        const modelName = extractModelName(content);
        results.push({ name: f, path: filePath, modelName });
      }
    } catch { /* dir missing */ }
  }
  return results;
}

function puppetFilePlugin(): Plugin {
  return {
    name: 'puppet-file',
    configureServer(server) {
      server.middlewares.use('/api/puppet', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        const url = req.url ?? '';

        // GET /api/puppet/list
        if (req.method === 'GET' && url.startsWith('/list')) {
          res.end(JSON.stringify({ ok: true, models: listModels() }));
          return;
        }

        // GET /api/puppet/load?path=...
        if (req.method === 'GET' && url.startsWith('/load')) {
          const qs = url.split('?')[1] ?? '';
          const filePath = new URLSearchParams(qs).get('path');
          if (!filePath) { res.statusCode = 400; res.end(JSON.stringify({ error: 'missing path' })); return; }
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.end(JSON.stringify({ ok: true, content }));
          } catch (e) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }

        // POST /api/puppet/save  { path, content }
        if (req.method === 'POST' && url.startsWith('/save')) {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { path: filePath, content } = JSON.parse(body) as { path: string; content: string };
              fs.writeFileSync(filePath, content, 'utf-8');
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
