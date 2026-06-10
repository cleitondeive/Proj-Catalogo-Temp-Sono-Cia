const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const importMatch = code.match(/import \{([^}]+)\} from 'lucide-react';/);
if (importMatch) {
  let icons = importMatch[1].split(',').map(i => i.trim());
  const newIcons = ['Camera', 'ImagePlus', 'Paperclip'];
  for (const ic of newIcons) {
    if (!icons.includes(ic)) icons.push(ic);
  }
  code = code.replace(importMatch[0], `import { ${icons.join(', ')} } from 'lucide-react';`);
}

const startIndex = code.indexOf('const LeadDetailsModal =');

if (startIndex !== -1) {
  const modalCode = fs.readFileSync('new_modal.txt', 'utf8');
  code = code.substring(0, startIndex) + modalCode;
  fs.writeFileSync('src/admin/pages/CRM.tsx', code);
  console.log("Successfully replaced modal.");
} else {
  console.log("Could not find LeadDetailsModal.");
}
