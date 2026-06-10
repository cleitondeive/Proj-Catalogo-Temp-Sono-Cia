import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace('qty?: number;\n  weight?: string;', 'qty?: number;\n  weight?: string;\n  tags?: string;');

fs.writeFileSync('src/types.ts', content, 'utf8');
