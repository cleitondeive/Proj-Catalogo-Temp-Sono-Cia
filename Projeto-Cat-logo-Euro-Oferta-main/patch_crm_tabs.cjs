const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const hookTarget = `  const { data, updateLeadStatus, deleteLead, addLead } = useStore();`;
const hookReplace = `  const { data, updateLeadStatus, updateLead, deleteLead, addLead, addLog } = useStore();
  const [viewMode, setViewMode] = React.useState<'kanban' | 'history'>('kanban');
  const hasCheckedStale = React.useRef(false);

  React.useEffect(() => {
    if (hasCheckedStale.current || !data.leads || data.leads.length === 0) return;
    const now = new Date().getTime();
    let madeChanges = false;
    
    data.leads.forEach(l => {
      if (l.status === 'Em Negociação' && l.updatedAt) {
        const days = Math.floor((now - new Date(l.updatedAt).getTime()) / (1000*3600*24));
        if (days >= 30) {
           updateLead(l.id, { 
             status: 'Cancelado', 
             notes: [...(l.notes || []), { id: Math.random().toString(), content: 'Arquivado automaticamente por inatividade superior a 30 dias (Regra de Stale Leads).', date: new Date().toISOString() }] 
           });
           if(addLog) addLog('CRM', \`Lead \${l.name} arquivado automaticamente (>30 dias)\`, 'Sistema', 'system');
           madeChanges = true;
        }
      }
    });
    
    hasCheckedStale.current = true;
  }, [data.leads, updateLead, addLog]);`;

crm = crm.replace(hookTarget, hookReplace);

const titleTarget = `        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">CRM Kanban</h1>
          <p className="text-gray-500 mt-1">Gerencie leads e negociações em tempo real.</p>
        </div>`;
const titleReplace = `        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">CRM</h1>
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 shrink-0">
              <button 
                onClick={() => setViewMode('kanban')} 
                className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all \${viewMode === 'kanban' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
              >
                Kanban de Vendas
              </button>
              <button 
                onClick={() => setViewMode('history')} 
                className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 \${viewMode === 'history' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
              >
                Histórico (Finais)
                {data.leads?.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length > 0 && (
                  <span className={\`\${viewMode === 'history' ? 'bg-gray-100 text-[#0F172A]' : 'bg-gray-200 text-gray-500'} px-1.5 py-0.5 rounded text-[9px]\`}>{data.leads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length}</span>
                )}
              </button>
            </div>
          </div>
          <p className="text-gray-500 mt-1">Gerencie leads, arquive contatos parados e acompanhe negociações em tempo real.</p>
        </div>`;
crm = crm.replace(titleTarget, titleReplace);

const mapTarget = `{STAGES.map(stage => {
          const stageLeads = filteredLeads.filter((l: any) => l.status === stage.id);`;
const mapReplace = `{viewMode === 'kanban' ? (
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">
        {STAGES.filter(s => !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(s.id)).map(stage => {
          const stageLeads = filteredLeads.filter((l: any) => l.status === stage.id);`;
crm = crm.replace(mapTarget, mapReplace);

const mapEndTarget = `            </div>
          );
        })}
      </div>`;
const mapEndReplace = `            </div>
          );
        })}
      </div>
      ) : (
      <div className="flex-1 overflow-auto px-5 sm:px-8 pb-8 custom-scrollbar">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="p-4 pl-6">Nome do Lead / Contato</th>
                <th className="p-4">Status Final</th>
                <th className="p-4">Valor Estimado</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Última Att.</th>
                <th className="p-4 pr-6 text-right w-24">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length === 0 ? (
                <tr>
                   <td colSpan={6} className="p-12 text-center text-gray-500">
                     Nenhum lead no histórico com formato finalizado.
                   </td>
                </tr>
              ) : (
                filteredLeads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).map(l => {
                  const stageObj = STAGES.find(s=>s.id===l.status);
                  const colorStr = stageObj ? stageObj.color : 'bg-gray-500';
                  const textColor = colorStr.replace('bg-', 'text-').replace('500', '600').replace('600', '600');
                  const bgColor = colorStr.replace('bg-', 'bg-').replace('500', '50').replace('600', '50');
                  
                  return (
                  <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                     <td className="p-4 pl-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-[#0F172A]">{l.name}</span>
                          <span className="text-xs text-gray-400 font-medium">{l.phone}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={\`text-xs font-bold px-2.5 py-1 rounded-lg border \${textColor} \${bgColor} border-current/20\`}>
                          {l.status}
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="font-bold text-sm text-[#0F172A]">
                          R$ {(l.totalSpent || 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="text-sm text-gray-600 font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg w-fit">{l.assignee || 'Sem Responsável'}</span>
                     </td>
                     <td className="p-4">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{new Date(l.updatedAt).toLocaleDateString()}</span>
                     </td>
                     <td className="p-4 pr-6 text-right">
                        <button onClick={() => setSelectedLead(l)} className="text-brand-blue hover:text-blue-700 font-bold text-[11px] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 hover:bg-blue-100">
                          Abrir
                        </button>
                     </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}`;

crm = crm.replace(mapEndTarget, mapEndReplace);

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('patched tabs and history');
