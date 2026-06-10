const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const addTarget = `  const handleAddNewLead = () => {
    if (!newLeadData.name || !newLeadData.phone) return;
    addLead(newLeadData);
    setShowAddLead(false);`;

const addReplace = `  const handleAddNewLead = () => {
    if (!newLeadData.name || !newLeadData.phone) return;
    addLead({
      ...newLeadData, 
      assignee: currentUser?.role !== 'admin' ? currentUser?.name : 'Sem Responsável'
    });
    setShowAddLead(false);`;

crm = crm.replace(addTarget, addReplace);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('patched add lead assignee');
