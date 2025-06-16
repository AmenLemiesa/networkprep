import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '../dist/index.html');
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
const scriptTag = `<script>window.__GEMINI_API_KEY__ = "${apiKey}";</script>`;
html = html.replace('</head>', `${scriptTag}</head>`);
fs.writeFileSync(indexPath, html); 