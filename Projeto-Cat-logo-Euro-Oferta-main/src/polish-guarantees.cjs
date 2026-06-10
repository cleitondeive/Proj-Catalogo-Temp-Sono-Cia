const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
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

const replace1 = `<div className="mt-4 md:mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-1.5 md:gap-2">
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-green-600 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">100% Segura</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-amber-500 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Garantia</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-brand-blue transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Entrega VIP</span>
                 </div>
              </div>`;

code = code.split(target1).join(replace1);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed guarantees');
