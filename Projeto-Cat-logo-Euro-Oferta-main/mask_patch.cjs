const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const anchor = 'const handleAddNewLead = () => {';
const formatPhoneFunc = `
const formatPhone = (v: string) => {
  let cleaned = v.replace(/\\D/g, '');
  if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);
  if (cleaned.length > 2 && cleaned.length <= 6) cleaned = \`(\${cleaned.substring(0, 2)}) \${cleaned.substring(2)}\`;
  else if (cleaned.length > 6 && cleaned.length <= 10) cleaned = \`(\${cleaned.substring(0, 2)}) \${cleaned.substring(2, 6)}-\${cleaned.substring(6)}\`;
  else if (cleaned.length > 10) cleaned = \`(\${cleaned.substring(0, 2)}) \${cleaned.substring(2, 7)}-\${cleaned.substring(7)}\`;
  return cleaned;
};
`;

if (!code.includes("const formatPhone =")) {
  code = code.replace(anchor, formatPhoneFunc + "\n  " + anchor);
}

code = code.replace(
  "onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})}",
  "onChange={e => setNewLeadData({...newLeadData, phone: formatPhone(e.target.value)})}"
);

code = code.replace(
  "onChange={e => setFormData({...formData, phone: e.target.value})}",
  "onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})}"
);

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
