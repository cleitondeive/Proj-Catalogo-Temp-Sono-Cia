const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/Metrics.tsx', 'utf8');

const oldVipHighlights = \`        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-[#0F172A] mb-6">Lista VIP Highlights</h2>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
             <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-2 shadow-inner">
                <Star className="w-10 h-10 text-amber-400" fill="currentColor" />
             </div>
             <div>
               <h3 className="text-3xl font-serif font-bold text-[#0F172A] mb-1">{leads.filter(l => l.vipLevel !== 'Nenhum').length}</h3>
               <p className="text-gray-500 font-medium">Clientes VIP classificados</p>
             </div>
             
             <div className="w-full mt-6 space-y-3">
               <div className="w-full bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
                 <span className="text-sm font-bold text-gray-600">VIP Premium</span>
                 <span className="text-sm font-bold text-[#0F172A]">{leads.filter(l => l.vipLevel === 'VIP Premium').length}</span>
               </div>
               <div className="w-full bg-amber-50/50 p-3 rounded-xl flex items-center justify-between border border-amber-100">
                 <span className="text-sm font-bold text-amber-600">VIP Gold</span>
                 <span className="text-sm font-bold text-amber-700">{leads.filter(l => l.vipLevel === 'VIP Gold').length}</span>
               </div>
             </div>
          </div>
        </div>\`;

const newVipHighlights = \`        <div className="bg-gradient-to-b from-[#1C202F] to-[#0F172A] p-6 rounded-2xl shadow-xl border border-gray-800 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 opacity-5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-blue opacity-10 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2" />
          
          <h2 className="text-lg font-bold text-white mb-6 relative z-10 flex items-center gap-2">
             <Star className="w-5 h-5 text-amber-400" fill="currentColor" /> Clientes VIP
          </h2>
          
          <div className="flex-1 justify-center flex flex-col z-10 gap-6">
             <div className="grid grid-cols-2 gap-4">
               {/* VIP Gold Card */}
               <div className="bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 p-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 hover:bg-white/30 transition-colors pointer-events-none" />
                 <h3 className="text-[11px] font-bold text-amber-900 uppercase tracking-widest mb-1 flex items-center justify-between">
                   VIP Gold
                   <Star className="w-3.5 h-3.5" fill="currentColor" />
                 </h3>
                 <span className="text-3xl font-black text-amber-950 block mt-2">{leads.filter(l => l.vipLevel === 'VIP Gold').length}</span>
               </div>

               {/* VIP Premium Card */}
               <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-black p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden border border-gray-600">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                   <Star className="w-12 h-12 text-white" />
                 </div>
                 <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">VIP Premium</h3>
                 <span className="text-3xl font-black text-white block mt-2">{leads.filter(l => l.vipLevel === 'VIP Premium').length}</span>
               </div>
             </div>

             <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
               <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 <span className="text-amber-400 font-bold block mb-1">Insights Premium</span>
                 Clientes classificados como VIP representam a maior margem de lucro. Uma dica é criar ofertas exclusivas personalizadas no WhatsApp para os <strong className="text-white">{leads.filter(l => l.vipLevel === 'VIP Gold' || l.vipLevel === 'VIP Premium').length} clientes</strong> desta carteira selecionada.
               </p>
             </div>
          </div>
        </div>\`;

code = code.replace(oldVipHighlights, newVipHighlights);
fs.writeFileSync('src/admin/pages/Metrics.tsx', code);
console.log('Metrics VIP updated.');
