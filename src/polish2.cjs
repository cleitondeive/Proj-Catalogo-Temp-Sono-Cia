const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dimTarget = `<div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
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
                      
                      <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {/* Comprimento */}
                        <div className="bg-white border border-gray-200/80 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden group/card hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#FCFCFC] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1 group-hover/card:text-brand-blue">
                             {dLength}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dLength !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors group-hover/card:text-[#0F172A]">Compr.</span>
                        </div>
                        {/* Largura */}
                        <div className="bg-white border border-gray-200/80 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden group/card hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#FCFCFC] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1 group-hover/card:text-brand-blue">
                             {dWidth}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dWidth !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors group-hover/card:text-[#0F172A]">Largura</span>
                        </div>
                        {/* Altura */}
                        <div className="bg-white border border-gray-200/80 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden group/card hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#FCFCFC] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1 group-hover/card:text-brand-blue">
                             {dHeight}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dHeight !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors group-hover/card:text-[#0F172A]">Altura</span>
                        </div>
                        {/* Peso */}
                        <div className="bg-white border border-gray-200/80 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden group/card hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#FCFCFC] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1 group-hover/card:text-brand-blue">
                             {dWeight}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dWeight !== '-' ? 'kg' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors group-hover/card:text-[#0F172A]">Peso</span>
                        </div>
                      </div>`;

const dimReplace = ` <div className="flex items-center gap-2 justify-between mt-2 pt-4 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <Box className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Dimensões</span>
                        </div>
                        <div className="flex gap-2.5">
                          <div className="flex flex-col items-start gap-0.5">
                             <span className="text-[13px] font-[700] text-[#1E293B]tabular-nums leading-none">
                               {dLength} <span className="text-[10px] text-gray-400 font-medium">{dLength !== '-' ? 'm' : ''}</span>
                             </span>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-none">Compr.</span>
                          </div>
                          
                          <div className="w-px h-6 bg-gray-100 self-center"></div>

                          <div className="flex flex-col items-start gap-0.5">
                             <span className="text-[13px] font-[700] text-[#1E293B] tabular-nums leading-none">
                               {dWidth} <span className="text-[10px] text-gray-400 font-medium">{dWidth !== '-' ? 'm' : ''}</span>
                             </span>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-none">Largura</span>
                          </div>

                          <div className="w-px h-6 bg-gray-100 self-center"></div>

                          <div className="flex flex-col items-start gap-0.5">
                             <span className="text-[13px] font-[700] text-[#1E293B] tabular-nums leading-none">
                               {dHeight} <span className="text-[10px] text-gray-400 font-medium">{dHeight !== '-' ? 'm' : ''}</span>
                             </span>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-none">Altura</span>
                          </div>

                          <div className="w-px h-6 bg-gray-100 self-center"></div>

                          <div className="flex flex-col items-start gap-0.5">
                             <span className="text-[13px] font-[700] text-[#1E293B] tabular-nums leading-none">
                               {dWeight} <span className="text-[10px] text-gray-400 font-medium">{dWeight !== '-' ? 'kg' : ''}</span>
                             </span>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 leading-none">Peso</span>
                          </div>
                        </div>
                      </div>`;

code = code.split(dimTarget).join(dimReplace);
fs.writeFileSync('src/App.tsx', code);
console.log('Finished updating dim cards');
