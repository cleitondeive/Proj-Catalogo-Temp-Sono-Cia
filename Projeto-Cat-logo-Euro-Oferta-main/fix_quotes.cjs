const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// fix double escaped characters inside CRM.tsx
code = code.replace(/\\\\D/g, '\\D');
code = code.replace(/\\\`Olá/g, '`Olá');
code = code.replace(/pedido\.\\\`/g, 'pedido.`');

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
