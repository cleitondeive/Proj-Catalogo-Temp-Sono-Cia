const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group hover:border-[#7591A6]/50 transition-colors">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#FAFAFA]/80 backdrop-blur-sm">
                        <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest flex items-center gap-2">
                           <Box className="w-3.5 h-3.5 text-brand-blue" />
                           Dimensões (Padrão)
                        </span>
                        <button className="text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 p-1.5 rounded-lg transition-colors" title="Copiar Informações" onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(\`Dimensões:\\nComprimento: \${dLength || 'N/A'}m\\nLargura: \${dWidth || 'N/A'}m\\nAltura: \${dHeight || 'N/A'}m\\nPeso: \${dWeight || 'N/A'}kg\`);
                          alert('Dimensões copiadas com sucesso!')
                        }}>
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex divide-x divide-gray-100 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#1C202F] transition-all cursor-default relative overflow-hidden group/item duration-300">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                           <span className="relative block font-bold text-[#1C202F] group-hover/item:text-white text-sm md:text-[15px] transition-all group-hover/item:scale-110 duration-300 tracking-tight">{dLength}<span className="text-[10px] text-gray-400 group-hover/item:text-white/60 font-medium ml-[1px]">{dLength !== '-' ? 'm' : ''}</span></span>
                           <span className="relative text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#7591A6] group-hover/item:text-[#A0C4E2] mt-1.5 block">Compr.</span>
                        </div>
                        <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#1C202F] transition-all cursor-default relative overflow-hidden group/item duration-300">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                           <span className="relative block font-bold text-[#1C202F] group-hover/item:text-white text-sm md:text-[15px] transition-all group-hover/item:scale-110 duration-300 tracking-tight">{dWidth}<span className="text-[10px] text-gray-400 group-hover/item:text-white/60 font-medium ml-[1px]">{dWidth !== '-' ? 'm' : ''}</span></span>
                           <span className="relative text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#7591A6] group-hover/item:text-[#A0C4E2] mt-1.5 block">Largura</span>
                        </div>
                        <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#1C202F] transition-all cursor-default relative overflow-hidden group/item duration-300">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                           <span className="relative block font-bold text-[#1C202F] group-hover/item:text-white text-sm md:text-[15px] transition-all group-hover/item:scale-110 duration-300 tracking-tight">{dHeight}<span className="text-[10px] text-gray-400 group-hover/item:text-white/60 font-medium ml-[1px]">{dHeight !== '-' ? 'm' : ''}</span></span>
                           <span className="relative text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#7591A6] group-hover/item:text-[#A0C4E2] mt-1.5 block">Altura</span>
                        </div>
                        <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#1C202F] transition-all cursor-default relative overflow-hidden group/item duration-300">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                           <span className="relative block font-bold text-[#1C202F] group-hover/item:text-white text-sm md:text-[15px] transition-all group-hover/item:scale-110 duration-300 tracking-tight">{dWeight}<span className="text-[10px] text-gray-400 group-hover/item:text-white/60 font-medium ml-[1px]">{dWeight !== '-' ? 'kg' : ''}</span></span>
                           <span className="relative text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-[#7591A6] group-hover/item:text-[#A0C4E2] mt-1.5 block">Peso</span>
                        </div>
                      </div>
                    </div>
                  )}`;

const replaceStr = `                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 flex flex-col gap-2.5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                        <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest flex items-center gap-2">
                           <Box className="w-3.5 h-3.5 text-brand-blue" />
                           Dimensões e Entrega (Padrão)
                        </span>
                        <button className="text-[#64748B] hover:text-brand-blue hover:bg-brand-blue/10 p-1.5 rounded-lg transition-colors group/copy" title="Copiar Informações" onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(\`Dimensões:\\nComprimento: \${dLength || 'N/A'}m\\nLargura: \${dWidth || 'N/A'}m\\nAltura: \${dHeight || 'N/A'}m\\nPeso: \${dWeight || 'N/A'}kg\`);
                          alert('Dimensões copiadas com sucesso!')
                        }}>
                          <Copy className="w-4 h-4 transition-transform group-hover/copy:scale-110" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        {/* Comprimento */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group/card hover:border-[#7591A6]/50 hover:shadow-lg transition-all cursor-default">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover/card:scale-110 transition-transform"></div>
                           <span className="relative text-[18px] md:text-[20px] font-bold text-[#0F172A] tracking-tight tabular-nums group-hover/card:text-brand-blue transition-colors">
                             {dLength}
                             <span className="text-[11px] text-gray-400 font-medium ml-1">{dLength !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B] mt-1.5 group-hover/card:text-[#0F172A] transition-colors">Compr.</span>
                        </div>
                        {/* Largura */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group/card hover:border-[#7591A6]/50 hover:shadow-lg transition-all cursor-default">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover/card:scale-110 transition-transform"></div>
                           <span className="relative text-[18px] md:text-[20px] font-bold text-[#0F172A] tracking-tight tabular-nums group-hover/card:text-brand-blue transition-colors">
                             {dWidth}
                             <span className="text-[11px] text-gray-400 font-medium ml-1">{dWidth !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B] mt-1.5 group-hover/card:text-[#0F172A] transition-colors">Largura</span>
                        </div>
                        {/* Altura */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group/card hover:border-[#7591A6]/50 hover:shadow-lg transition-all cursor-default">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover/card:scale-110 transition-transform"></div>
                           <span className="relative text-[18px] md:text-[20px] font-bold text-[#0F172A] tracking-tight tabular-nums group-hover/card:text-brand-blue transition-colors">
                             {dHeight}
                             <span className="text-[11px] text-gray-400 font-medium ml-1">{dHeight !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B] mt-1.5 group-hover/card:text-[#0F172A] transition-colors">Altura</span>
                        </div>
                        {/* Peso */}
                        <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group/card hover:border-[#7591A6]/50 hover:shadow-lg transition-all cursor-default">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover/card:scale-110 transition-transform"></div>
                           <span className="relative text-[18px] md:text-[20px] font-bold text-[#0F172A] tracking-tight tabular-nums group-hover/card:text-brand-blue transition-colors">
                             {dWeight}
                             <span className="text-[11px] text-gray-400 font-medium ml-1">{dWeight !== '-' ? 'kg' : ''}</span>
                           </span>
                           <span className="relative text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B] mt-1.5 group-hover/card:text-[#0F172A] transition-colors">Peso</span>
                        </div>
                      </div>
                    </div>
                  )}`;

// Verify if the target string can be matched exactly. If not, use standard string split.
const occurrences = code.split(targetStr).length - 1;
if(occurrences > 0) {
  code = code.split(targetStr).join(replaceStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Premium dimensions updated successfully! Count:', occurrences);
} else {
  console.log('Target string not found precisely.');
}
