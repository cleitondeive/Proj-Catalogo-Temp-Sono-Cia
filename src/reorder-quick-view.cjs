const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\/\* Premium Action Block \*\/\}[\s\S]*?(?=\{\/\* Trust Badges - Cereja do bolo \*\/\})/;

const newLayout = `{/* Add to Order & Delivery Box (from screenshots) */}
              <div className="mt-5 mb-5 flex flex-col gap-3">
                <div className="flex gap-2">
                  {quickViewProduct.showPrice !== false ? (
                  <button onClick={(e) => addToCart(quickViewProduct, e)} className="flex-[4] bg-[#0F172A] hover:bg-[#1E293B] text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 group/btn">
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
                    className="flex-shrink-0 w-[54px] md:w-[60px] bg-white border border-gray-200 rounded-[12px] transition-colors text-[#64748B] hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center cursor-pointer shadow-sm group/wish"
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
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Truck className="w-4 h-4 text-[#0F172A]" strokeWidth={2} />
                  <span className="text-[#475569] font-medium text-[12px] md:text-[13px]">
                    Entrega agendada para todo o <span className="font-bold text-[#0F172A]">Brasil</span>.
                  </span>
                </div>
              </div>

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

                  <div className="my-5 md:my-6 border-b border-[#F1F5F9]" />

                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 flex flex-col gap-2.5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                          <Box className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Dimensões</span>
                        </div>
                        <div className="flex gap-2.5">
                          <div className="flex flex-col items-start gap-0.5">
                             <span className="text-[13px] font-[700] text-[#1E293B] tabular-nums leading-none">
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
                       </div>
                    </div>
                  )}

                  {dTags && (
                    <div className="mb-5 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       {dTags.split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                           <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F8FAFC] text-gray-600 text-[10px] md:text-[11px] font-bold tracking-widest uppercase border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.02)] cursor-default">
                              <Layers className="w-3.5 h-3.5" />
                              {tag.trim()}
                           </span>
                       ))}
                    </div>
                  )}

                  <div className="my-5 md:my-6 border-b border-[#F1F5F9]" />
                  </>
                );
              })()}

              <div className="flex gap-8 mb-5 md:mb-6">
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="flex-1">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-3 block flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    {quickViewProduct.colors.length === 1 ? 'Cor Disponível' : 'Selecione a Cor'}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {quickViewProduct.colors.map((c: any, i: number) => {
                      const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                      return (
                      <div key={i} className="relative group/color flex-shrink-0">
                        <button
                          onClick={() => setQuickViewProduct({ ...quickViewProduct, color: c.name, ...(c.image && { image: c.image }) })}
                          className={\`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm \${isSelected ? 'border-[#0F172A] scale-110 ring-2 ring-transparent ring-offset-2' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}\`}
                        >
                          <div className="w-[85%] h-[85%] rounded-full shadow-inner block border border-black/5" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? \`url(\${c.texture})\` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </button>
                        <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max max-w-[160px] text-center bg-[#0F172A] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 group-hover/color:delay-100 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                          {c.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </div>
                )}

                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="flex-1">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-3 block flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    {quickViewProduct.sizes.length === 1 ? 'Tamanho Principal' : 'Selecione o Tamanho'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                        className={\`px-5 py-2.5 rounded-[12px] text-[13px] font-bold border transition-all \${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-[0_4px_12px_rgba(15,23,42,0.15)]' : 'bg-[#F8FAFC] text-gray-600 border-transparent hover:border-gray-300 hover:bg-gray-100'}\`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>

              <div className="my-5 md:my-6 border-b border-[#F1F5F9]" />
              
              `;

if (code.match(regex)) {
  code = code.replace(regex, newLayout);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully re-ordered quick view');
} else {
  console.log('Regex not found');
}
