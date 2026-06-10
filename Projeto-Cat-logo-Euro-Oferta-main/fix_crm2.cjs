const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

code = code.replace("useState<Lead | null>(null);\\n    const [activeFilter", "useState<Lead | null>(null);\n  const [activeFilter");

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
console.log("Fixed line 21");
