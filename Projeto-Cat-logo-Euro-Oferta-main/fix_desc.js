import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              {(quickViewProduct.length || quickViewProduct.width || quickViewProduct.height || quickViewProduct.weight) && (
                <div className="mb-5 md:mb-6">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-brand-blue" />
                    Dimensões e Entrega (Padrão)
                  </span>
                  <div className="flex bg-[#F8FAFC] border border-gray-100 rounded-xl shadow-sm">
                    {quickViewProduct.length && (
                      <div className="flex-1 p-2 md:p-3 text-center border-r last:border-r-0 border-gray-100">
                        <span className="block font-bold text-[#1C202F] text-xs md:text-[13px]">{quickViewProduct.length}m</span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-0.5 block">Compr.</span>
                      </div>
                    )}
                    {quickViewProduct.width && (
                      <div className="flex-1 p-2 md:p-3 text-center border-r last:border-r-0 border-gray-100">
                        <span className="block font-bold text-[#1C202F] text-xs md:text-[13px]">{quickViewProduct.width}m</span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-0.5 block">Largura</span>
                      </div>
                    )}
                    {quickViewProduct.height && (
                      <div className="flex-1 p-2 md:p-3 text-center border-r last:border-r-0 border-gray-100">
                        <span className="block font-bold text-[#1C202F] text-xs md:text-[13px]">{quickViewProduct.height}m</span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-0.5 block">Altura</span>
                      </div>
                    )}
                    {quickViewProduct.weight && (
                      <div className="flex-1 p-2 md:p-3 text-center border-r last:border-r-0 border-gray-100">
                        <span className="block font-bold text-[#1C202F] text-xs md:text-[13px]">{quickViewProduct.weight}kg</span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-0.5 block">Peso</span>
                      </div>
                    )}
                  </div>
                </div>
              )}`;

const replacement = `              {(quickViewProduct.length || quickViewProduct.width || quickViewProduct.height || quickViewProduct.weight) && (
                <div className="mb-5 md:mb-6 bg-white border border-gray-200 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group hover:border-[#7591A6]/50 transition-all duration-300">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#FAFAFA]/50">
                    <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest flex items-center gap-2">
                       <Box className="w-3.5 h-3.5 text-brand-blue" />
                       Dimensões (Padrão)
                    </span>
                    <button className="text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 p-1.5 rounded-lg transition-colors" title="Copiar Informações" onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(\`Dimensões:\nComprimento: \${quickViewProduct.length || 'N/A'}m\nLargura: \${quickViewProduct.width || 'N/A'}m\nAltura: \${quickViewProduct.height || 'N/A'}m\nPeso: \${quickViewProduct.weight || 'N/A'}kg\`);
                      const toastContent = document.getElementById('toast');
                      if (toastContent) {
                        toastContent.innerText = 'Copiado!';
                        toastContent.classList.remove('opacity-0', 'translate-y-4');
                        setTimeout(() => toastContent.classList.add('opacity-0', 'translate-y-4'), 2000);
                      }
                    }}>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex divide-x divide-gray-100">
                    {quickViewProduct.length && (
                      <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden">
                        <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover:text-brand-blue transition-colors group-hover:scale-105 duration-300">{quickViewProduct.length}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Compr.</span>
                      </div>
                    )}
                    {quickViewProduct.width && (
                      <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden">
                        <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover:text-brand-blue transition-colors group-hover:scale-105 duration-300">{quickViewProduct.width}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Largura</span>
                      </div>
                    )}
                    {quickViewProduct.height && (
                      <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden">
                        <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover:text-brand-blue transition-colors group-hover:scale-105 duration-300">{quickViewProduct.height}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Altura</span>
                      </div>
                    )}
                    {quickViewProduct.weight && (
                      <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden">
                        <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover:text-brand-blue transition-colors group-hover:scale-105 duration-300">{quickViewProduct.weight}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">kg</span></span>
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Peso</span>
                      </div>
                    )}
                  </div>
                </div>
              )}`;

content = content.replace(new RegExp(target.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g'), replacement);
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Cherry on top added');
