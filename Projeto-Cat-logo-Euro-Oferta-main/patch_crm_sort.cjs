const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const targetFilters = `          </button>
          <button onClick={() => setShowAddLead(true)} className="h-[42px] px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap">
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
          </button>`;

const newFilters = `          </button>
          
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
          </button>`;

crm = crm.replace(targetFilters, newFilters);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('Sort controls added');
