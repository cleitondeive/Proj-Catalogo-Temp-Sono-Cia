const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const targetDays = `      <div className="flex items-center justify-between pt-2 border-t border-gray-50/80">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
            <Clock className="w-2.5 h-2.5" />
            {new Date(lead.updatedAt).toLocaleDateString()}
          </span>`;

const newDays = `      <div className="flex items-center justify-between pt-2 border-t border-gray-50/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className={\`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider \${
            (() => {
              const daysParked = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24));
              if (daysParked >= 7) return 'bg-orange-50 text-orange-600 border border-orange-100';
              if (daysParked >= 3) return 'bg-amber-50 text-amber-600 border border-amber-100';
              return 'text-gray-400 bg-gray-50 border border-gray-100/50';
            })()
          }\`} title="Tempo sem alteração de status/notas">
            <Clock className="w-2.5 h-2.5" />
            {(() => {
              const daysParked = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24));
              if (daysParked === 0) return 'Hoje';
              if (daysParked === 1) return 'Ontem';
              return \`Há \${daysParked} d\`;
            })()}
          </span>`;

crm = crm.replace(targetDays, newDays);

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('Done patch days parked');
