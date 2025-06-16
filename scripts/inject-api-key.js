const fs = require('fs');
const path = require('path');

// Read the built index.html
const indexPath = path.join(__dirname, '../dist/index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Create a script tag with the API key
const apiKeyScript = `
<script>
  window.__GEMINI_API_KEY__ = "${process.env.VITE_GEMINI_API_KEY}";
</script>
`;

// Insert the script tag before the closing head tag
const modifiedContent = indexContent.replace('</head>', `${apiKeyScript}</head>`);

// Write the modified content back
fs.writeFileSync(indexPath, modifiedContent); 