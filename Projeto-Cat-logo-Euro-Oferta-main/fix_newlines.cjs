const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

code = code.replace("null);\\n    const [activeFilter", "null);\n    const [activeFilter");

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
