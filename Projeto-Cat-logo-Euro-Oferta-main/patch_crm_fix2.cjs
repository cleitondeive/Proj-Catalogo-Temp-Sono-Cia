const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target = `      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">
        {viewMode === 'kanban' ? (
        STAGES.filter(s => !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(s.id)).map(stage => {`;

const replace = `      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">
        {STAGES.filter(s => !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(s.id)).map(stage => {`;

crm = crm.replace(target, replace);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('fixed extra div again');
