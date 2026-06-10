const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target1 = `              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#F1F5F9]/80 z-10 backdrop-blur rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={\`w-2 h-2 rounded-full \${stage.color} shadow-sm border border-black/5\`} />
                  <h3 className="font-bold text-[13px] text-[#0F172A] tracking-tight">{stage.label}</h3>
                  <span className="bg-white border border-gray-200/80 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{stageLeads.length}</span>
                </div>
                <button className="text-gray-400 hover:text-[#0F172A] transition-colors p-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>`;

const replacement1 = `              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#F1F5F9]/80 z-10 backdrop-blur rounded-t-2xl border-b border-gray-200/50 mb-2">
                <div className="flex flex-col gap-1 w-full mr-2">
                  <div className="flex items-center gap-2">
                    <span className={\`w-2 h-2 rounded-full \${stage.color} shadow-sm border border-black/5\`} />
                    <h3 className="font-bold text-[13px] text-[#0F172A] tracking-tight">{stage.label}</h3>
                    <span className="bg-white border border-gray-400/20 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{stageLeads.length}</span>
                  </div>
                  {/* Pipeline Value */}
                  <div className="text-[10px] font-bold tracking-widest text-[#0F172A]/40 uppercase mt-0.5">
                    R$ {stageLeads.reduce((acc: number, l: any) => acc + (l.estimatedValue || l.totalSpent || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#0F172A] transition-colors p-1 self-start -mt-1 -mr-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>`;

crm = crm.replace(target1, replacement1);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('done replacing kanban stage');
