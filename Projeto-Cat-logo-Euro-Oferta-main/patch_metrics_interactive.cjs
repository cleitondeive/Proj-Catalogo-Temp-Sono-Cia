const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/Metrics.tsx', 'utf8');

// 1. Add onNavigate to props
code = code.replace(
  "export default function Metrics({ leads, products }: { leads: Lead[], products: Product[] }) {",
  "export default function Metrics({ leads, products, onNavigate }: { leads: Lead[], products: Product[], onNavigate?: (t: any) => void }) {"
);

// 2. Add new states
if (!code.includes('showAllLeadsModal')) {
  code = code.replace(
    "const [vipListFilter, setVipListFilter] = useState",
    "const [showAllLeadsModal, setShowAllLeadsModal] = useState(false);\n  const [vipListFilter, setVipListFilter] = useState"
  );
}

// 3. Make Total Leads card clickable
const oldTotalLeads = '<StatCard title="Total de Leads" value={leads.length.toString()} icon={<Users />} trend="+12%" />';
const newTotalLeads = `<div onClick={() => setShowAllLeadsModal(true)} className="cursor-pointer group hover:scale-[1.02] transition-transform relative">
          <StatCard title="Total de Leads" value={leads.length.toString()} icon={<Users />} trend="+12%" />
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
               <Users className="w-4 h-4" />
             </div>
          </div>
        </div>`;
code = code.replace(oldTotalLeads, newTotalLeads);

// 4. Make products card clickable
const oldProductsCard = '<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow flex flex-col justify-between">';
const newProductsCard = '<div onClick={() => onNavigate && onNavigate(\\\'products\\\')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] cursor-pointer transition-all flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">';
code = code.replace(oldProductsCard, newProductsCard.replace(/\\'/g, "'"));

// The products card might have changed slightly, let's also try generic 
code = code.replace(
  '<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow flex flex-col justify-between">',
  '<div onClick={() => onNavigate && onNavigate(\'products\')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] cursor-pointer transition-all flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">'
);

// Let's add an icon for products card on hover
if (code.includes('<span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">\n              Catálogo\n            </span>')) {
   code = code.replace(
    '<span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">\n              Catálogo\n            </span>',
    '<span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">\n              Acessar Catálogo\n            </span>'
   );
}


// 5. Add All Leads Modal UI
const allLeadsModal = `
      {showAllLeadsModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-[99] outline-none">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform relative overflow-hidden animate-fade-in border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border bg-blue-50 border-brand-blue/20 text-brand-blue">
                    <Users className="w-6 h-6" fill="currentColor" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-[#0F172A]">Todos os Leads</h2>
                   <p className="text-sm text-gray-500 font-medium">{leads.length} leads cadastrados</p>
                 </div>
              </div>
              <button onClick={() => { setShowAllLeadsModal(false); setSearchVip(''); }} className="w-10 h-10 flex items-center justify-center bg-transparent rounded-full text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Pesquisar leads por nome..."
                  value={searchVip}
                  onChange={e => setSearchVip(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-[15px] focus:ring-2 focus:ring-brand-blue outline-none transition-all shadow-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
              <div className="space-y-3">
                {leads.filter(l => l.name.toLowerCase().includes(searchVip.toLowerCase())).map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => {
                        setSelectedLead(lead);
                    }}
                    className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-200 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {lead.avatarUrl ? (
                          <img src={lead.avatarUrl} alt={lead.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-brand-blue/20 transition-colors" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg border border-brand-blue/20">
                            {lead.name.charAt(0)}
                          </div>
                        )}
                        {lead.vipLevel !== 'Nenhum' && (
                           <span className={"absolute -right-[2px] -bottom-[2px] w-[18px] h-[18px] rounded-full border-[2px] border-white flex items-center justify-center shadow-sm " + (lead.vipLevel === 'VIP Gold' ? 'bg-amber-400 text-white' : lead.vipLevel === 'VIP Premium' ? 'bg-gray-800 text-white' : 'bg-green-500 text-white')}>
                             <Star className="w-[8px] h-[8px]" fill="currentColor" />
                           </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-[15px] group-hover:text-brand-blue transition-colors flex items-center gap-2">
                          {lead.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-gray-500">{lead.phone}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            R$ {lead.totalSpent.toLocaleString('pt-BR', {minimumFractionDigits:2})}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F172A]" />
                    </div>
                  </div>
                ))}
                {leads.filter(l => l.name.toLowerCase().includes(searchVip.toLowerCase())).length === 0 && (
                   <div className="text-center py-16 flex flex-col items-center">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                       <Search className="w-6 h-6 text-gray-300" />
                     </div>
                     <p className="text-gray-400 font-bold">Nenhum cliente encontrado.</p>
                   </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
`;

if (!code.includes("Todos os Leads")) {
  code = code.replace(
    "{vipListFilter && (",
    allLeadsModal + "\n      {vipListFilter && ("
  );
}

fs.writeFileSync('src/admin/pages/Metrics.tsx', code);
