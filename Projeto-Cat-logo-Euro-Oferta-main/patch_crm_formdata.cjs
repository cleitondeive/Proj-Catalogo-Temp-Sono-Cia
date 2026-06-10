const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// fix formData state to include tags and source
const stateTarget = "const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '', vipLevel: lead.vipLevel || 'Nenhum' });";
const stateReplacement = "const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '', vipLevel: lead.vipLevel || 'Nenhum', tags: lead.tags || [], name: lead.name });";
if (code.includes(stateTarget)) {
  code = code.replace(stateTarget, stateReplacement);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
