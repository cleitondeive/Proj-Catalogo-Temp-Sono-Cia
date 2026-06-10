const fs = require('fs');
let content = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/admin/pages/ColorsManager.tsx', content);
