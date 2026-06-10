const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/animate-slide-in-up/g, '');
fs.writeFileSync('src/App.tsx', content);
