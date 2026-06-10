import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `              <p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">
                {quickViewProduct.description || "Design escandinavo em madeira de carvalho maciço. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal."}
              </p>

              {(() => {
                const activeColorObj = quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name));
                const dLength = activeColorObj?.length || quickViewProduct.length;
                const dWidth = activeColorObj?.width || quickViewProduct.width;
                const dHeight = activeColorObj?.height || quickViewProduct.height;
                const dWeight = activeColorObj?.weight || quickViewProduct.weight;
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const hasDimensions = dLength || dWidth || dHeight || dWeight;

                return (
                  <>
                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 bg-white border border-gray-200 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group hover:border-[#7591A6]/50 transition-all duration-300 transform origin-top animate-slide-in-up" style={{ animationDuration: '0.4s' }}>
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
                        {dLength && (
                          <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden group/item">
                            <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover/item:text-brand-blue transition-colors group-hover/item:scale-105 duration-300">{dLength}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Compr.</span>
                          </div>
                        )}
                        {dWidth && (
                          <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden group/item">
                            <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover/item:text-brand-blue transition-colors group-hover/item:scale-105 duration-300">{dWidth}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Largura</span>
                          </div>
                        )}
                        {dHeight && (
                          <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden group/item">
                            <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover/item:text-brand-blue transition-colors group-hover/item:scale-105 duration-300">{dHeight}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">m</span></span>
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Altura</span>
                          </div>
                        )}
                        {dWeight && (
                          <div className="flex-1 p-3 md:p-4 text-center hover:bg-[#F8FAFC] transition-colors cursor-default relative overflow-hidden group/item">
                            <span className="block font-bold text-[#1C202F] text-sm md:text-[15px] group-hover/item:text-brand-blue transition-colors group-hover/item:scale-105 duration-300">{dWeight}<span className="text-[10px] text-gray-500 font-medium ml-[1px]">kg</span></span>
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#7591A6] mt-1 block">Peso</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {dTags && (
                    <div className="mb-5 md:mb-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       {dTags.split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                           <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] md:text-[11px] font-bold tracking-widest uppercase border border-brand-blue/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-brand-blue hover:text-white transition-all cursor-default">
                              <Layers className="w-3 h-3" />
                              {tag.trim()}
                           </span>
                       ))}
                    </div>
                  )}
                  </>
                );
              })()}`;

const startIdx = content.indexOf('<p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">');
const endIdx = content.indexOf('{quickViewProduct.colors && quickViewProduct.colors.length > 0 && (', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.slice(0, startIdx) + replacement + '\n\n              ' + content.slice(endIdx);
    if (!content.includes('Layers,')) {
      content = content.replace('import {', 'import {\n  Layers,');
    }
    fs.writeFileSync('src/App.tsx', content, 'utf8');
    console.log('App.tsx QuickView Updated');
} else {
    console.log('Could not find QuickView block', startIdx, endIdx);
}
