const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/text-\[#1E293B\]tabular-nums/g, 'text-[#1E293B] tabular-nums');
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed typo in src/App.tsx');
