const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `              <div className="mt-3 md:mt-4 flex items-center gap-2.5 md:gap-3 p-3 md:p-3.5 rounded-[12px] border border-gray-100 bg-[#FAFAFA]">
                <Truck
                  className="w-4 h-4 text-[#7591A6] shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-[#475569] font-medium text-[11px] md:text-xs lg:text-[13px]">
                  Entrega agendada para todo o Brasil.
                </span>
              </div>

              {/* Trust Badges - Cereja do bolo */}
              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
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
              </div>

            </div>`;

content = content.replace(/              <div className="mt-3 md:mt-4 flex items-center gap-[0-9\.]+ md:gap-[0-9\.]+ p-[0-9\.]+ md:p-[0-9\.]+ rounded-\[[0-9a-z]+\] border border-gray-100 bg-\[#[a-zA-Z0-9]+\]">\s+<Truck\s+className="w-4 h-4 text-\[#7591A6\] shrink-0"\s+strokeWidth={1.5}\s+\/>\s+<span className="text-\[#475569\] font-medium text-\[[0-9a-z]+\] md:text-[a-z]+ lg:text-\[[0-9a-z]+\]">\s+Entrega agendada para todo o Brasil\.\s+<\/span>\s+<\/div>\s+<\/div>/g, replacement);

fs.writeFileSync('src/App.tsx', content);

