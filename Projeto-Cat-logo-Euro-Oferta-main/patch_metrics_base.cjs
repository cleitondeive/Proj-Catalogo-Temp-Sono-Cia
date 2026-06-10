const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Metrics.tsx', 'utf8');

const target = `             <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
               <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 <span className="text-amber-400 font-bold block mb-1">Insights Premium</span>
                 Clientes VIP representam a sua maior margem de lucro. Crie ofertas exclusivas enviadas no WhatsApp para essa carteira de <strong className="text-white">{leads.filter(l => l.vipLevel === 'VIP Gold' || l.vipLevel === 'VIP Premium').length} clientes</strong>.
               </p>
             </div>
          </div>`;

const replacement = `             <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
               <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 <span className="text-amber-400 font-bold block mb-1">Insights Premium</span>
                 Clientes VIP representam a sua maior margem de lucro. Crie ofertas exclusivas enviadas no WhatsApp para essa carteira de <strong className="text-white">{leads.filter(l => l.vipLevel === 'VIP Gold' || l.vipLevel === 'VIP Premium').length} clientes</strong>.
               </p>
             </div>

             {/* Tiers Base */}
             <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="flex flex-col gap-1 border-l-2 border-blue-400/50 pl-3">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cliente Frequente</span>
                   <div className="flex items-end gap-2">
                     <span className="text-xl font-bold text-gray-200">{leads.filter(l => l.vipLevel === 'Cliente Frequente').length}</span>
                     <span className="text-[10px] text-gray-500 mb-1">ativos</span>
                   </div>
                 </div>
                 <div className="flex flex-col gap-1 border-l-2 border-emerald-400/50 pl-3">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cliente Potencial</span>
                   <div className="flex items-end gap-2">
                     <span className="text-xl font-bold text-gray-200">{leads.filter(l => l.vipLevel === 'Cliente Potencial').length}</span>
                     <span className="text-[10px] text-gray-500 mb-1">em ascensão</span>
                   </div>
                 </div>
             </div>
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/admin/pages/Metrics.tsx', code);
