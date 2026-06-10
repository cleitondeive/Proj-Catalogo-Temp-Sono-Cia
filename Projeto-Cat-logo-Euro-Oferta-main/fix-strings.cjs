const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/"Móveis de\nMadeira"/g, '"Móveis de\\nMadeira"');
fs.writeFileSync('src/App.tsx', code);
