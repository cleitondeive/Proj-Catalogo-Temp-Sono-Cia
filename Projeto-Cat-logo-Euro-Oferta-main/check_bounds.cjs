const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const startIndex = code.indexOf('const LeadDetailsModal =');
const endString = '};\n\nexport default function CRM';
let endIndex = code.indexOf(endString);
if (endIndex === -1) endIndex = code.lastIndexOf('};\nexport default function CRM');
if (endIndex === -1) endIndex = code.indexOf('\nexport default function CRM');
if (endIndex === -1) endIndex = code.indexOf('\nexport default CRM');

console.log("Start: ", startIndex);
console.log("End: ", endIndex);
