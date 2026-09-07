#!/usr/bin/env node
/**
 * LOCAL RUNNER — same app, no Netlify account needed.
 *
 *   npm start        then open http://localhost:8888
 *
 * Serves the static site and mounts the exact same API used in production,
 * so what you test locally is what deploys.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiHandler from './netlify/functions/api.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8888;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Load .env if present, so ADZUNA keys work locally the same way as on Netlify.
try {
  const envFile = path.join(ROOT, '.env');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    console.log('· Loaded .env');
  }
} catch { /* ignore */ }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // ---- API ----
  if (url.pathname.startsWith('/api')) {
    let body = '';
    for await (const chunk of req) body += chunk;
    const request = new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
    });
    try {
      const out = await apiHandler(request);
      res.writeHead(out.status, Object.fromEntries(out.headers));
      res.end(await out.text());
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: String(e.message) }));
    }
    return;
  }

  // ---- Static ----
  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  const full = path.join(ROOT, path.normalize(file).replace(/^(\.\.[/\\])+/, ''));
  if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(full)] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  India Job Scanner is running');
  console.log(`  →  http://localhost:${PORT}`);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
