import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace #015294 with brand-blue
code = code.replace(/bg-\[\#015294\]/g, 'bg-brand-blue');
code = code.replace(/text-\[\#015294\]/g, 'text-brand-blue');
code = code.replace(/border-\[\#015294\]/g, 'border-brand-blue');
code = code.replace(/border-t-\[\#015294\]/g, 'border-t-brand-blue');
code = code.replace(/border-l-\[\#015294\]/g, 'border-l-brand-blue');

// Replace #013f71 with brand-blue-hover
code = code.replace(/bg-\[\#013f71\]/g, 'bg-brand-blue-hover');
code = code.replace(/text-\[\#013f71\]/g, 'text-brand-blue-hover');
code = code.replace(/border-\[\#013f71\]/g, 'border-brand-blue-hover');

fs.writeFileSync('src/App.tsx', code);
console.log('Colors replaced successfully');
