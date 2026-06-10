const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split('\\n');
lines[2262] = '          )}'; // line index is 2262 for line 2263
code = lines.join('\\n');

fs.writeFileSync('src/App.tsx', code);
