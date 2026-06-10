const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update dimensions
const dimTarget = `<div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
                      </div>`;

const dimReplace = `<div className="grid grid-cols-4 gap-2 md:gap-3">
                        {/* Comprimento */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden hover:border-gray-300 transition-all cursor-default">
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1">
                             {dLength}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dLength !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors">Compr.</span>
                        </div>
                        {/* Largura */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden hover:border-gray-300 transition-all cursor-default">
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1">
                             {dWidth}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dWidth !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors">Largura</span>
                        </div>
                        {/* Altura */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden hover:border-gray-300 transition-all cursor-default">
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1">
                             {dHeight}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dHeight !== '-' ? 'm' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors">Altura</span>
                        </div>
                        {/* Peso */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-3 md:p-4 flex flex-col items-center justify-center relative overflow-hidden hover:border-gray-300 transition-all cursor-default">
                           <span className="relative text-[20px] md:text-[26px] font-[800] text-[#0F172A] tracking-tight tabular-nums transition-colors flex items-baseline gap-1">
                             {dWeight}
                             <span className="text-[14px] md:text-[16px] text-[#7591A6] font-medium">{dWeight !== '-' ? 'kg' : ''}</span>
                           </span>
                           <span className="relative text-[10px] font-[800] uppercase tracking-widest text-[#64748B] mt-1.5 transition-colors">Peso</span>
                        </div>
                      </div>`;

// Update features
const featTarget = `<div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:text-green-600 transition-all duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <span className="block text-[8.5px] md:text-[9.5px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">100% Segura</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:text-amber-500 transition-all duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <span className="block text-[8.5px] md:text-[9.5px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">Garantia</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-[#FAFAFA] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:text-brand-blue transition-all duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <span className="block text-[8.5px] md:text-[9.5px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">Entrega VIP</span>
                    </div>
                 </div>
              </div>`;

const featReplace = `<div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFCFC] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">100% Segura</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFCFC] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">Garantia</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFCFC] border border-[#F1F5F9] hover:border-gray-200 transition-colors group/badge">
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight">Entrega VIP</span>
                    </div>
                 </div>
              </div>`;

code = code.split(dimTarget).join(dimReplace);
code = code.split(featTarget).join(featReplace);

fs.writeFileSync('src/App.tsx', code);
console.log('Cards updated!');
