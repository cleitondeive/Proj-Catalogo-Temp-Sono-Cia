const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `{dStock != null && dStock !== undefined && (
                    <div className="mb-5 md:mb-6 flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-green-600" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Disponibilidade</p>
                           <p className="text-[13px] font-bold text-[#0F172A] leading-tight mt-0.5">Em Estoque e Pronta Entrega</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="inline-flex items-center justify-center bg-white border border-gray-200 text-[#0F172A] font-bold text-[14px] px-3 py-1.5 rounded-lg shadow-sm font-mono">
                           {dStock} <span className="text-[10px] ml-1 text-gray-400 font-sans tracking-wide">UNID.</span>
                         </span>
                       </div>
                    </div>
                  )}`;

const replace1 = `{dStock != null && dStock !== undefined && (
                    <div className="mb-4 md:mb-5 flex items-center justify-between pb-3 border-b border-[#F1F5F9] animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                       <div className="flex items-center gap-2">
                         <div className="flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                         </div>
                         <span className="text-[10px] md:text-[11px] font-bold text-[#1E293B] uppercase tracking-widest mt-0.5">
                           Em Estoque 
                           <span className="text-gray-400 font-medium ml-1.5 hidden sm:inline-block">/ Pronta Entrega</span>
                         </span>
                       </div>
                       <div className="flex items-end gap-1 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100">
                         <span className="text-[13px] font-[800] text-[#0F172A] tabular-nums leading-none">{dStock}</span>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Unid.</span>
                       </div>
                    </div>
                  )}`;

code = code.split(target1).join(replace1);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed stock');
