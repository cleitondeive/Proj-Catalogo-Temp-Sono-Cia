import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace('  weight?: string;\n  weight?: string;', '  weight?: string;');

fs.writeFileSync('src/types.ts', content, 'utf8');
