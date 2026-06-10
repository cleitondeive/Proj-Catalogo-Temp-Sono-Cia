const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target = `<div className="px-5 sm:px-8 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
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
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 w-full md:w-auto overflow-x-auto hide-scrollbar">
             {['Todos', 'Meus Leads', 'Sem Follow-up', 'VIPs', 'Frios'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setActiveFilter(f as any)} 
                 className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap \${activeFilter === f ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
               >
                 {f}
               </button>
             ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 w-[100%] md:w-auto flex-1 md:flex-none">
          <div className="relative w-[100%] md:w-auto flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, email, ou ddd/telefone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none xl:w-[280px] w-full shadow-sm"
            />
          </div>
          <button className="h-[42px] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm items-center gap-2 font-bold text-gray-700 hidden sm:flex shrink-0">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          
          <div className="relative shrink-0 hidden md:block">
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as any)} 
              className="h-[42px] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm outline-none font-bold text-gray-700 text-sm appearance-none pr-10 cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="urgent">Mais Urgentes (S/ FollowUp)</option>
              <option value="value">Maior Valor</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <button onClick={() => setShowAddLead(true)} className="h-[42px] px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap">
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
          </button>
          <button 
            onClick={() => {
              const headers = ['Nome,Telefone,Email,Status,VIP,Total Gasto\\n'];
              const csv = filteredLeads.map((l: any) => \`"\${l.name}","\${l.phone}","\${l.email || ''}","\${l.status}","\${l.vipLevel}","R$ \${l.totalSpent.toFixed(2)}"\`).join('\\n');
              const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'leads_eurooferta.csv';
              link.click();
              showSuccess('Leads exportados com sucesso!');
            }} 
            className="h-[42px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 shrink-0 whitespace-nowrap"
            title="Exportar Leads (CSV)"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          </div>
        </div>
      </div>`;

const replace = `<div className="px-5 sm:px-8 pb-4 flex flex-col gap-4">
        {/* Row 1: Title and Main Actions */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <h1 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight shrink-0">CRM</h1>
              <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 shrink-0 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => setViewMode('kanban')} 
                  className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap \${viewMode === 'kanban' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
                >
                  Kanban
                </button>
                <button 
                  onClick={() => setViewMode('history')} 
                  className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap \${viewMode === 'history' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
                >
                  Histórico
                  {data.leads?.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length > 0 && (
                    <span className={\`\${viewMode === 'history' ? 'bg-gray-100 text-[#0F172A]' : 'bg-gray-200 text-gray-500'} px-1.5 py-0.5 rounded text-[9px]\`}>{data.leads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length}</span>
                  )}
                </button>
              </div>
            </div>
            <p className="text-gray-500 mt-1">Gerencie leads, contatos e negociações em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setShowAddLead(true)} className="h-[42px] px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap">
              <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
            </button>
            <button 
              onClick={() => {
                const headers = ['Nome,Telefone,Email,Status,VIP,Total Gasto\\n'];
                const csv = filteredLeads.map((l: any) => \`"\${l.name}","\${l.phone}","\${l.email || ''}","\${l.status}","\${l.vipLevel}","R$ \${l.totalSpent.toFixed(2)}"\`).join('\\n');
                const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'leads_eurooferta.csv';
                link.click();
                showSuccess('Leads exportados com sucesso!');
              }} 
              className="h-[42px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 shrink-0 whitespace-nowrap"
              title="Exportar Leads (CSV)"
            >
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>
        
        {/* Row 2: Filters and Search */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 w-full lg:w-auto overflow-x-auto hide-scrollbar shrink-0">
             {['Todos', 'Meus Leads', 'Sem Follow-up', 'VIPs', 'Frios'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setActiveFilter(f as any)} 
                 className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap \${activeFilter === f ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-3 min-w-[200px]">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar (nome, email, telefone)..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none w-full shadow-sm text-sm"
              />
            </div>
            <button className="h-[42px] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 shrink-0 text-sm">
              <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filtros</span>
            </button>
            <div className="relative shrink-0 hidden md:block">
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)} 
                className="h-[42px] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm outline-none font-bold text-gray-700 text-sm appearance-none pr-10 cursor-pointer"
              >
                <option value="recent">Mais Recentes</option>
                <option value="urgent">Mais Urgentes</option>
                <option value="value">Maior Valor</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>`;

if (!code.includes(target)) {
  console.log('Target block not found! Trying to find partial match...');
} else {
  code = code.replace(target, replace);
  fs.writeFileSync('src/admin/pages/CRM.tsx', code);
  console.log('patched CRM header completely');
}
