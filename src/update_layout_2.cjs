const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const replace2_search = `              <div className="flex gap-8 mb-5 md:mb-6">
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
                          onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}
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
              </div>`;

const replacement2 = `              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 mt-2 mb-6 border border-gray-100 py-4 px-4 bg-[#FAFAFA] rounded-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="flex-1 w-full">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2.5 block flex items-center gap-2">
                    {quickViewProduct.colors.length === 1 ? 'Cor Disponível' : 'Selecione a Cor'}
                    {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize truncate max-w-[120px]">- {quickViewProduct.color}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {quickViewProduct.colors.map((c: any, i: number) => {
                      const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                      return (
                      <div key={i} className="relative group/color">
                        <button
                          onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}
                          className={\`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm \${isSelected ? 'border-[#0F172A] scale-110 ring-2 ring-transparent ring-offset-2' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}\`}
                        >
                          <div className="w-[85%] h-[85%] rounded-full shadow-inner block" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? \`url(\${c.texture})\` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </button>
                        <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max max-w-[160px] text-center bg-[#0F172A] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl border border-white/10 group-hover/color:delay-100 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                          {c.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </div>
                )}

                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="flex-[0.8] w-full sm:pl-6 sm:border-l sm:border-gray-200">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2.5 block flex items-center gap-2">
                    {quickViewProduct.sizes.length === 1 ? 'Tamanho' : 'Selecione o Tamanho'}
                    {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize truncate max-w-[80px]">- {quickViewProduct.size}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                        className={\`px-4 py-1.5 rounded-[10px] text-[12px] font-bold border transition-all \${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.15)]' : 'bg-[#F8FAFC] text-gray-600 border-transparent hover:border-gray-300 hover:bg-gray-100'}\`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>`;

if(code.includes(replace2_search)) {
    code = code.replace(replace2_search, replacement2);
    console.log('Successfully replaced SECOND modal section!');
} else {
    console.log('Could not find second section in text exactly.');
}

fs.writeFileSync('src/App.tsx', code);
