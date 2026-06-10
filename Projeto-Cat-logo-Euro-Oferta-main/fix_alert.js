import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/const toastContent\s*=[^}]+\}/g, "alert('Dimensões copiadas com sucesso!')");
content = content.replace(/if\s*\(toastContent\)\s*\{\s*\}/g, ""); // In case it gets messed up
content = content.replace(/toastContent\.classList[^;]+;/g, "");
content = content.replace(/setTimeout\([^;]+;/g, "");

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Replaced to alert');
