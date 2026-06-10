const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target1 = `      <div className="flex items-center justify-between pt-2 border-t border-gray-50/80">
        <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
          <Clock className="w-2.5 h-2.5" />
          {new Date(lead.updatedAt).toLocaleDateString()}
        </span>`;

const rep1 = `      <div className="flex items-center justify-between pt-2 border-t border-gray-50/80">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
            <Clock className="w-2.5 h-2.5" />
            {new Date(lead.updatedAt).toLocaleDateString()}
          </span>
          {(lead as any).assignee && (lead as any).assignee !== 'Sem Responsável' && (
            <span className="text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded shadow-sm max-w-[80px] truncate" title={(lead as any).assignee}>
              {(lead as any).assignee}
            </span>
          )}
        </div>`;

crm = crm.replace(target1, rep1);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('done saving assignee display on card');
