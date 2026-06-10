import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace('height?: string;', 'height?: string;\n  weight?: string;');
fs.writeFileSync('src/types.ts', content, 'utf8');
