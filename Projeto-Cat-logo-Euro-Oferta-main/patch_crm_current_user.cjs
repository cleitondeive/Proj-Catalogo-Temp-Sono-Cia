const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');
code = code.replace("{activeTab === 'crm' && <CRM />}", "{activeTab === 'crm' && <CRM currentUser={currentUser!} />}");
fs.writeFileSync('src/admin/AdminDashboard.tsx', code);

let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');
crm = crm.replace("export default function CRM() {", "import { AdminUser } from '../../types';\n\nexport default function CRM({ currentUser }: { currentUser?: AdminUser }) {");
crm = crm.replace("if (activeFilter === 'Meus Leads') filterMatch = (l as any).assignee === 'Meus Leads';", "if (activeFilter === 'Meus Leads') filterMatch = (l as any).assignee === (currentUser?.name || 'Meus Leads') || (l as any).assignee === 'Meus Leads';");
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('patched CRM current User logic');
