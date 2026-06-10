const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Metrics.tsx', 'utf8');

if (!code.includes("import { LeadDetailsModal } from './CRM';")) {
  code = code.replace(
    "import { Users, LayoutDashboard, ShoppingBag, TrendingUp, Package, Clock, Activity, ArrowUpRight, CheckCircle2, MoreHorizontal } from 'lucide-react';",
    "import { Users, LayoutDashboard, ShoppingBag, TrendingUp, Package, Clock, Activity, ArrowUpRight, CheckCircle2, MoreHorizontal, Star, X, Search, ChevronRight } from 'lucide-react';\\nimport { LeadDetailsModal } from './CRM';"
  );
}

const stateReplacement = \`export default function Metrics() {
  const { data } = useStore();
  const [vipListFilter, setVipListFilter] = useState<'VIP Gold' | 'VIP Premium' | 'Cliente Frequente' | 'Cliente Potencial' | null>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchVip, setSearchVip] = useState('');\`;

if (!code.includes('vipListFilter')) {
  code = code.replace(/export default function Metrics\\(\\) \\{\\n\\s*const \\{ data \\} = useStore\\(\\);/, stateReplacement);
}

const sIdx = code.indexOf('<div className="bg-gradient-to-b from-[#1C202F] to-[#0F172A] p-6 rounded-2xl');
if (sIdx !== -1) {
    const endS = code.indexOf('          </div>\\n        </div>', sIdx) + '          </div>\\n        </div>'.length;
    
    // new block
    const newVipHighlights = \`        <div className="bg-white p-7 rounded-[28px] shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-amber-100/50 to-transparent blur-3xl opacity-60 rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <h2 className="text-lg font-bold text-[#0F172A] mb-8 relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100/50">
                 <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
               </div>
               <span>Programa VIP</span>
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-full text-gray-400 border border-gray-100 flex items-center gap-1.5 shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Ativo
             </div>
          </h2>
          
          <div className="flex-1 flex flex-col z-10 gap-5 relative">
             <div className="grid grid-cols-2 gap-4">
               {/* VIP Gold Card */}
               <div 
                 onClick={() => setVipListFilter('VIP Gold')}
                 className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer border border-amber-100/60 transform hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
               >
                 <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform"><Star className="w-24 h-24 text-amber-900" fill="currentColor" /></div>
                 <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center justify-between">
                   VIP Gold
                 </h3>
                 <div className="flex items-end justify-between mt-2">
                   <span className="text-3xl font-black text-amber-900 tracking-tight">{leads.filter(l => l.vipLevel === 'VIP Gold').length}</span>
                   <ChevronRight className="w-4 h-4 text-amber-400 mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </div>
               </div>

               {/* VIP Premium Card */}
               <div 
                 onClick={() => setVipListFilter('VIP Premium')}
                 className="bg-[#0F172A] p-5 rounded-2xl shadow-sm hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)] cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden border border-gray-800"
               >
                 <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform"><Star className="w-24 h-24 text-white" fill="currentColor" /></div>
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">VIP Premium</h3>
                 <div className="flex items-end justify-between mt-2">
                   <span className="text-3xl font-black text-white tracking-tight">{leads.filter(l => l.vipLevel === 'VIP Premium').length}</span>
                   <ChevronRight className="w-4 h-4 text-gray-500 mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </div>
               </div>
             </div>

             <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl relative overflow-hidden my-1">
               <div className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-l-2xl" />
               <p className="text-[13px] text-gray-600 font-medium leading-relaxed pl-2 relative z-10">
                 Sua principal fonte de lucro. Recomendamos ofertas exclusivas "One-on-One" via WhatsApp para os <strong className="text-brand-blue font-bold">{leads.filter(l => l.vipLevel === 'VIP Gold' || l.vipLevel === 'VIP Premium').length} clientes estrelas</strong>.
               </p>
             </div>

             {/* Tiers Base */}
             <div className="grid grid-cols-2 gap-3">
                 <div 
                   onClick={() => setVipListFilter('Cliente Frequente')}
                   className="flex flex-col gap-1 p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all group"
                 >
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Frequente</span>
                   <div className="flex items-center justify-between">
                     <span className="text-2xl font-bold text-[#0F172A]">{leads.filter(l => l.vipLevel === 'Cliente Frequente').length}</span>
                     <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </div>
                 </div>
                 <div 
                   onClick={() => setVipListFilter('Cliente Potencial')}
                   className="flex flex-col gap-1 p-3.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all group"
                 >
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Potencial</span>
                   <div className="flex items-center justify-between">
                     <span className="text-2xl font-bold text-[#0F172A]">{leads.filter(l => l.vipLevel === 'Cliente Potencial').length}</span>
                     <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                   </div>
                 </div>
             </div>
          </div>
        </div>\`;
    code = code.substring(0, sIdx) + newVipHighlights + code.substring(endS);
}

const modalBlock = \`
      {vipListFilter && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-[999] outline-none">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform relative overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className={"w-12 h-12 rounded-full flex items-center justify-center shadow-sm border " + (vipListFilter === 'VIP Gold' ? 'bg-amber-50 border-amber-100 text-amber-500' : vipListFilter === 'VIP Premium' ? 'bg-[#0F172A] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-500')}>
                    <Star className="w-6 h-6" fill="currentColor" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-[#0F172A]">{vipListFilter}</h2>
                   <p className="text-sm text-gray-500 font-medium">{leads.filter(l => l.vipLevel === vipListFilter).length} clientes classificados</p>
                 </div>
              </div>
              <button onClick={() => { setVipListFilter(null); setSearchVip(''); }} className="w-10 h-10 flex items-center justify-center bg-transparent rounded-full text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchVip}
                  onChange={e => setSearchVip(e.target.value)}
                  placeholder="Buscar cliente na lista..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
              <div className="space-y-3">
                {leads.filter(l => l.vipLevel === vipListFilter && l.name.toLowerCase().includes(searchVip.toLowerCase())).map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-200 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {lead.avatarUrl ? (
                          <img src={lead.avatarUrl} alt={lead.name} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg border border-brand-blue/20">
                            {lead.name.charAt(0)}
                          </div>
                        )}
                        <span className={"absolute -right-[2px] -bottom-[2px] w-[18px] h-[18px] rounded-full border-[2px] border-white flex items-center justify-center shadow-sm " + (vipListFilter === 'VIP Gold' ? 'bg-amber-400 text-white' : vipListFilter === 'VIP Premium' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-white')}>
                          <Star className="w-[8px] h-[8px]" fill="currentColor" />
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-[15px] group-hover:text-brand-blue transition-colors flex items-center gap-2">
                          {lead.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full">
                            LTV: R$ {lead.totalSpent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase">{lead.phone || lead.email || 'Sem contato'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F172A]" />
                    </div>
                  </div>
                ))}
                {leads.filter(l => l.vipLevel === vipListFilter && l.name.toLowerCase().includes(searchVip.toLowerCase())).length === 0 && (
                   <div className="text-center py-16 flex flex-col items-center">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                       <Search className="w-6 h-6 text-gray-300" />
                     </div>
                     <p className="text-gray-400 font-bold">Nenhum cliente encontrado.</p>
                     <p className="text-gray-400 text-sm mt-1">Sua busca não retornou resultados.</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLead && <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}\`;

const tToReplace = '    </div>\\n  );\\n}';
if (code.includes(tToReplace)) {
    code = code.replace(tToReplace, modalBlock);
}

fs.writeFileSync('src/admin/pages/Metrics.tsx', code);
