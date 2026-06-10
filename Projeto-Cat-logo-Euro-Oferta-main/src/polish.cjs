const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dimTarget = `<div className="grid grid-cols-4 gap-2 md:gap-3">
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

const dimReplace = `<div className="grid grid-cols-4 gap-2 md:gap-3">
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

const featTarget = `<div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 md:gap-3">
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

const featReplace = `<div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 md:gap-3">
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFBFA] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 transition-all duration-300 group/badge relative overflow-hidden cursor-default">
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:shadow-md transition-all duration-500 relative z-10 group-hover/badge:text-green-600">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div className="relative z-10">
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight mt-1 transition-colors">100% Segura</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFBFA] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 transition-all duration-300 group/badge relative overflow-hidden cursor-default">
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:shadow-md transition-all duration-500 relative z-10 group-hover/badge:text-amber-500">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="relative z-10">
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight mt-1 transition-colors">Garantia</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-2 p-3 md:p-4 rounded-[24px] bg-[#FCFBFA] border border-[#F1F5F9] hover:border-[#E2E8F0] hover:shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 transition-all duration-300 group/badge relative overflow-hidden cursor-default">
                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-[42px] h-[42px] rounded-full bg-white shadow-sm border border-[#F1F5F9] flex items-center justify-center text-[#1C202F] group-hover/badge:scale-110 group-hover/badge:shadow-md transition-all duration-500 relative z-10 group-hover/badge:text-brand-blue">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="relative z-10">
                      <span className="block text-[10px] font-bold text-[#1C202F] uppercase tracking-widest leading-tight mt-1 transition-colors">Entrega VIP</span>
                    </div>
                 </div>
              </div>`;

code = code.split(dimTarget).join(dimReplace);
code = code.split(featTarget).join(featReplace);

fs.writeFileSync('src/App.tsx', code);
console.log('Cards refined!');
