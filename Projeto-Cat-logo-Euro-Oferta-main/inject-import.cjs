const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = `import { ProductCard } from './components/ProductCard';\n` + content;
fs.writeFileSync('src/App.tsx', content);
