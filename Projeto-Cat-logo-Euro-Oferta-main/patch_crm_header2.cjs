const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target1 = `<div className="px-5 sm:px-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">`;
const replace1 = `<div className="px-5 sm:px-8 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">`;

const target2 = `        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 w-full sm:w-auto overflow-x-auto hide-scrollbar">`;
const replace2 = `        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 w-full md:w-auto overflow-x-auto hide-scrollbar">`;

const target3 = `          <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">`;
const replace3 = `          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1 sm:flex-none">
          <div className="relative w-[100%] md:w-auto flex-1">`;

const target4 = `            <input 
              type="text" 
              placeholder="Buscar lead, telefone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none md:w-64 w-full shadow-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 hidden sm:flex">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button onClick={() => setShowAddLead(true)} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group">
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
          </button>`;
const replace4 = `            <input 
              type="text" 
              placeholder="Buscar por nome, email, ou telefone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none xl:w-[280px] w-[100%] shadow-sm"
            />
          </div>
          <button className="h-[42px] px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm items-center gap-2 font-bold text-gray-700 hidden sm:flex shrink-0">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button onClick={() => setShowAddLead(true)} className="h-[42px] px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap">
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
          </button>`;

const target5 = `            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 hidden lg:flex"
            title="Exportar Leads (CSV)"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
          </div>
        </div>
      </div>`;
const replace5 = `            className="h-[42px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm items-center gap-2 font-bold text-gray-700 flex shrink-0 whitespace-nowrap lg:flex"
            title="Exportar Leads (CSV)"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          </div>
        </div>
      </div>

      {/* AI Premium Insight */}
      <div className="px-5 sm:px-8 pb-5 lg:-mt-2">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 w-full">
             <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex shrink-0 items-center justify-center text-blue-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
             </div>
             <div>
               <p className="text-[10px] font-bold text-blue-600 xl:uppercase tracking-widest leading-none xl:mb-1 mb-0.5">Cereja do Bolo • Smart AI Insight</p>
               <p className="text-sm font-medium text-[#0F172A]">Você tem <span className="font-bold">{data.leads.filter((l: any) => !l.nextFollowUp && ['Novo Lead','Em Negociação'].includes(l.status)).length} leads abertos</span> sem follow-up marcado. Recomendamos focar em {data.leads.filter((l: any) => l.totalSpent > 0).length} perfis VIPs com alta intenção.</p>
             </div>
          </div>
        </div>
      </div>`;

crm = crm.replace(target1, replace1).replace(target2, replace2).replace(target3, replace3).replace(target4, replace4).replace(target5, replace5);

const rawFilterTarget = `  const filteredLeads = data.leads.filter(l => {
    const s = search.toLowerCase().trim().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    const searchDigits = s.replace(/\\D/g, '');
    const nameMatch = l.name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').includes(s);
    const phoneMatch = searchDigits.length > 0 && l.phone.replace(/\\D/g, '').includes(searchDigits);
    
    let filterMatch = true;`;

const rawFilterNew = `  const filteredLeads = data.leads.filter(l => {
    const s = search.toLowerCase().trim().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    const searchDigits = s.replace(/\\D/g, '');
    const nameMatch = l.name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').includes(s);
    const phoneMatch = searchDigits.length > 0 && l.phone.replace(/\\D/g, '').includes(searchDigits);
    const emailMatch = l.email && l.email.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').includes(s);
    
    let filterMatch = true;`;

crm = crm.replace(rawFilterTarget, rawFilterNew);

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
