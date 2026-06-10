const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

crm = crm.replace("const { updateLead, updateLeadStatus, deleteLead } = useStore();", "const { data, updateLead, updateLeadStatus, deleteLead } = useStore();");

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('patched data into LeadDetailsModal');
