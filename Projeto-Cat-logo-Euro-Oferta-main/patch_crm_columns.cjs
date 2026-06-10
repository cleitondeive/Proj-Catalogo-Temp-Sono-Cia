const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const columnRenderTarget = `      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter((l: any) => l.status === stage.id);
          return (
            <div 
              key={stage.id} 
              className="w-[280px] shrink-0 flex flex-col bg-[#F1F5F9]/60 border border-gray-200/60 rounded-2xl snap-start"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#F1F5F9]/80 z-10 backdrop-blur rounded-t-2xl border-b border-gray-200/50 mb-2">
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
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 hide-scrollbar">
                {stageLeads.map((lead: any) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onDragStart={handleDragStart} 
                    onClick={() => setSelectedLead(lead)} 
                    onStatusChange={(status: any) => handleStatusChange(lead.id, status)} 
                    onDelete={() => {
                      deleteLead(lead.id);
                      showSuccess('Card excluído com sucesso!');
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>`;

const columnRenderNew = `      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter((l: any) => l.status === stage.id);
          
          const isCollapsed = collapsedColumns.includes(stage.id);

          let sortedLeads = [...stageLeads];
          if (sortBy === 'value') {
            sortedLeads.sort((a, b) => (b.estimatedValue || b.totalSpent || 0) - (a.estimatedValue || a.totalSpent || 0));
          } else if (sortBy === 'urgent') {
            sortedLeads.sort((a, b) => {
               const aUrgent = !a.nextFollowUp ? 1 : 0;
               const bUrgent = !b.nextFollowUp ? 1 : 0;
               return bUrgent - aUrgent;
            });
          } else {
            // recent by default
            sortedLeads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          }
          
          const limit = displayLimits[stage.id] || 20;
          const displayedLeads = sortedLeads.slice(0, limit);
          const hasMore = sortedLeads.length > limit;

          if (isCollapsed) {
            return (
              <div 
                key={stage.id} 
                className="w-[60px] cursor-pointer shrink-0 flex flex-col bg-[#F1F5F9]/40 border border-gray-200/40 rounded-2xl snap-start items-center py-6 hover:bg-[#F1F5F9]/80 transition-colors"
                onClick={() => toggleColumnCollapse(stage.id)}
              >
                  <span className={\`w-3 h-3 rounded-full \${stage.color} shadow-sm border border-black/5 mb-6\`} />
                  <span className="font-bold text-[12px] text-gray-400 whitespace-nowrap -rotate-90 origin-center translate-y-[100px] inline-block tracking-widest uppercase">
                    {stage.label} <span className="ml-2 bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                  </span>
              </div>
            );
          }

          return (
            <div 
              key={stage.id} 
              className="w-[280px] shrink-0 flex flex-col bg-[#F1F5F9]/60 border border-gray-200/60 rounded-2xl snap-start"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#F1F5F9]/80 z-10 backdrop-blur rounded-t-2xl border-b border-gray-200/50 mb-2">
                <div className="flex flex-col gap-1 w-full mr-2">
                  <div className="flex items-center gap-2">
                    <span className={\`w-2 h-2 rounded-full \${stage.color} shadow-sm border border-black/5\`} />
                    <h3 className="font-bold text-[13px] text-[#0F172A] tracking-tight truncate">{stage.label}</h3>
                    <span className="bg-white border border-gray-400/20 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{stageLeads.length}</span>
                  </div>
                  {/* Pipeline Value */}
                  <div className="text-[10px] font-bold tracking-widest text-[#0F172A]/40 uppercase mt-0.5">
                    R$ {stageLeads.reduce((acc: number, l: any) => acc + (l.estimatedValue || l.totalSpent || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <button onClick={() => toggleColumnCollapse(stage.id)} className="text-gray-400 hover:text-[#0F172A] transition-colors p-1 self-start -mt-1 -mr-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 hide-scrollbar relative">
                {displayedLeads.map((lead: any) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onDragStart={handleDragStart} 
                    onClick={() => setSelectedLead(lead)} 
                    onStatusChange={(status: any) => handleStatusChange(lead.id, status)} 
                    onDelete={() => {
                      deleteLead(lead.id);
                      showSuccess('Card excluído com sucesso!');
                    }}
                  />
                ))}
                
                {hasMore && (
                  <button onClick={() => loadMore(stage.id)} className="w-full py-2.5 text-xs font-bold text-gray-500 bg-white/50 border border-gray-200 border-dashed rounded-xl hover:bg-white hover:text-[#0F172A] transition-all flex items-center justify-center gap-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    Carregar Mais ({sortedLeads.length - limit})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>`;

crm = crm.replace(columnRenderTarget, columnRenderNew);

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('Done patch columns');
