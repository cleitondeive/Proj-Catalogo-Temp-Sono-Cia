import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('Copy,')) {
    content = content.replace('import {', 'import {\n  Copy,');
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Added Copy import');
