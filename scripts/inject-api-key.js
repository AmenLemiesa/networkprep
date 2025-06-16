import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '../dist/index.html');
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace('VITE_GEMINI_API_KEY', apiKey);
fs.writeFileSync(indexPath, html); 