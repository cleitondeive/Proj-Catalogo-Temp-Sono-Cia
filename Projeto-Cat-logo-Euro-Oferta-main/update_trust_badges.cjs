const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will find the end of the quick view body. 
// Look for the action buttons:
// <div className="flex items-center gap-3">
//    <button onClick={(e) => addToCart...
//    ...
// </div>

const trustBadgesHtml = `
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2">
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compra 100% Segura</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8v-2a5 5 0 0 1 10 0v2"/></svg>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Garantia Premium</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1C202F]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atendimento Dedicado</span>
                 </div>
              </div>
`;

// Insert after the flex div containing the action buttons!
// We'll search for:
// <div className="flex items-center gap-3">
//                 {quickViewProduct.showPrice !== false ? (
//                 <button onClick={(e) => addToCart...
// ...
//                 </button>
//               </div>

content = content.replace(/(<\!-- Actions -->[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<\/div>)/g, '$1' + trustBadgesHtml);

fs.writeFileSync('src/App.tsx', content);

