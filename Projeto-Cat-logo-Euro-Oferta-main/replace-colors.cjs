const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace style={{ backgroundColor: c.hex }}
content = content.replace(/style=\{\{ backgroundColor: c\.hex \}\}/g, "style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}");

// Replace style={{backgroundColor: c.hex}}
content = content.replace(/style=\{\{backgroundColor: c\.hex\}\}/g, "style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}");

fs.writeFileSync('src/App.tsx', content);
