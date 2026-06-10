const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `<div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-gray-500 text-xs md:text-[13px] font-medium ml-1.5 md:ml-2">
                  (12 Avaliações)
                </span>
              </div>
              <h2 className="text-[22px] md:text-[26px] lg:text-[30px] font-serif font-bold text-[#1C202F] leading-[1.2] mb-1.5 md:mb-2">
                {quickViewProduct.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4">
                <span className="text-[10px] md:text-[11px] font-bold text-[#7591A6] tracking-widest uppercase">
                  Móveis de Madeira
                </span>
                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-status-pulse"></div>
                  <span className="text-[10px] font-bold tracking-wide">
                    {Math.floor(Math.random() * 25) + 12} pessoas estão a ver
                    esta peça agora
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="text-[24px] md:text-[28px] font-bold text-[#1C202F]">
                  {quickViewProduct.showPrice !== false ? \`R$ \${quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.price || quickViewProduct.price}\` : <span className="text-[18px] uppercase tracking-widest text-brand-blue">Consulte o Preço</span>}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.showPrice !== false && (
                <span className="text-sm md:text-base font-medium text-[#7591A6] line-through">
                  R$ {quickViewProduct.originalPrice}
                </span>
                )}
              </div>

              <p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">
                {quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.description || quickViewProduct.description || "Design escandinavo em madeira de carvalho maciço. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal."}
              </p>

              {(() => {
                const activeColorObj = quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name));
                const actualLength = (activeColorObj?.length && String(activeColorObj.length).trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && String(activeColorObj.width).trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && String(activeColorObj.height).trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && String(activeColorObj.weight).trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;
                const hasDimensions = Boolean(actualLength || actualWidth || actualHeight || actualWeight);

                const dLength = actualLength || '-';
                const dWidth = actualWidth || '-';
                const dHeight = actualHeight || '-';
                const dWeight = actualWeight || '-';
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const dStock = quickViewProduct.showStock ? quickViewProduct.stock : null;

                return (
                  <>
                  {hasDimensions && (
                    <div className="mb-5 flex items-center justify-between gap-2.5 animate-fade-in-up border border-gray-100 rounded-xl p-3 bg-gray-50/50" style={{ animationDelay: '50ms' }}>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Box className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Dimensões</span>
                        </div>
                        <div className="flex gap-2.5 md:gap-3">
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dLength}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dLength !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Compr.</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWidth}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWidth !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Largura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dHeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dHeight !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Altura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWeight !== '-' ? 'kg' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Peso</span>
                          </div>
                        </div>
                    </div>
                  )}

                  {dTags && (
                    <div className="mb-5 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       {dTags.split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                           <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] md:text-[11px] font-bold tracking-widest uppercase border border-brand-blue/10 cursor-default">
                              <Layers className="w-3 h-3" />
                              {tag.trim()}
                           </span>
                       ))}
                    </div>
                  )}

                  {dStock != null && dStock !== undefined && (
                    <div className="mb-4 md:mb-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '50ms' }}>
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
                  )}
                  </>
                );
              })()}

              {(quickViewProduct.colors?.length > 0 || quickViewProduct.sizes?.length > 0) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 mb-5 border border-gray-100 py-3 px-4 bg-[#FAFAFA] rounded-[16px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="flex-1 w-full">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.colors.length === 1 ? 'Cor' : 'Selecione a Cor'}
                    {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize truncate max-w-[120px]">- {quickViewProduct.color}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c: any, i: number) => {
                      const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                      return (
                      <div key={i} className="relative group/color">
                        <button
                          onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}
                          className={\`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm \${isSelected ? 'border-[#0F172A] scale-110 ring-2 ring-transparent ring-offset-1' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}\`}
                        >
                          <div className="w-[85%] h-[85%] rounded-full shadow-inner block" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? \`url(\${c.texture})\` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </button>
                        <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max text-center bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-white/10 group-hover/color:delay-100 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                          {c.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </div>
                )}

                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="flex-1 w-full sm:pl-4 sm:border-l sm:border-gray-200">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.sizes.length === 1 ? 'Tamanho' : 'Selecione Tamanho'}
                    {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize truncate max-w-[80px]">- {quickViewProduct.size}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                        className={\`px-3 py-1 rounded-[8px] text-[11px] font-bold border transition-all \${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}\`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
              )}

              {/* Action Block */}
              <div className="mt-auto pt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  {quickViewProduct.showPrice !== false ? (
                  <button onClick={(e) => addToCart(quickViewProduct, e)} className="flex-[4] bg-brand-blue hover:bg-brand-blue-hover text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(1,82,148,0.25)] hover:shadow-[0_6px_20px_rgba(1,82,148,0.35)] hover:-translate-y-0.5 group/btn">
                    <ShoppingCart className="w-[18px] h-[18px] transition-transform duration-300 group-hover/btn:-rotate-12" />
                    Adicionar ao Pedido
                  </button>
                  ) : (
                  <a 
                    href={\`https://wa.me/55\${storeSettings.whatsapp.replace(/\\D/g, '')}?text=Olá! Gostaria de consultar o preço do produto: \${quickViewProduct.name} (SKU: \${quickViewProduct.sku || 'N/A'})\`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-[4] bg-[#10B981] hover:bg-[#059669] text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 group/wa"
                  >
                    <MessageCircle className="w-[18px] h-[18px] transition-transform duration-300 group-hover/wa:scale-110" /> 
                    Consultar via WhatsApp
                  </a>
                  )}
                  <button 
                    className="flex-shrink-0 w-[54px] md:w-[60px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-[12px] transition-colors text-[#64748B] hover:text-red-500 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-sm group/wish"
                    title="Adicionar à Lista de Desejos"
                    onClick={(e) => toggleWishlist(quickViewProduct, e)}
                  >
                    <Heart
                      className={\`w-[22px] h-[22px] transition-transform duration-300 group-hover/wish:scale-110 \${wishlist.some(item => item.name === quickViewProduct?.name) ? 'fill-red-500 text-red-500' : ''}\`}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                
                {/* Shipping info below button */}
                <div className="flex items-center justify-center gap-2 mt-1 opacity-90 pb-2">
                  <Truck className="w-4 h-4 text-brand-blue" strokeWidth={2} />
                  <span className="text-[#475569] font-medium text-[12px] md:text-[13px]">
                    Entrega agendada para todo o <span className="font-bold text-brand-blue">Brasil</span>.
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-2 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-1.5 md:gap-2">
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
              </div>\n            </div>`;

const parts = code.split('className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"');

if (parts.length === 3) {
  // Try splitting the block end.
  const after1 = parts[1].split('</div>\n          </div>\n        </div>\n      )}');
  const after2 = parts[2].split('</div>\n          </div>\n        </div>\n      )}');

  if(after1.length >= 2 && after2.length >= 2) {
      const newCode = parts[0] + replacement.replace('<div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">', 'className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"')
         + after1.slice(1).join('</div>\n          </div>\n        </div>\n      )}')
         + replacement.replace('<div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">', 'className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"')
         + after2.slice(1).join('</div>\n          </div>\n        </div>\n      )}');
      
      fs.writeFileSync('src/App.tsx', newCode);
      console.log('Successfully replaced entirely using splits!');
  } else {
     console.log('Error splitting end tag');
  }
} else {
  console.log('Did not find exactly two occurrences. Found parts: ' + parts.length);
}
