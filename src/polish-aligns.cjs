const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `{quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="mb-5 md:mb-6">
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 block flex items-center gap-2">
                  {quickViewProduct.colors.length === 1 ? 'Cor Disponível' : 'Selecione a Cor'}
                  {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize hidden md:inline-block">- {quickViewProduct.color}</span>}
                </span>
                <div className="flex flex-wrap gap-3">
                  {quickViewProduct.colors.map((c: any, i: number) => {
                    const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                    return (
                    <button
                      key={i}
                      title={c.name}
                      onClick={() => setQuickViewProduct({ ...quickViewProduct, color: c.name, ...(c.image && { image: c.image }) })}
                      className={\`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm \${isSelected ? 'border-[#0F172A] scale-110' : 'border-gray-200 hover:border-gray-400'}\`}
                    >
                      <div className="w-[85%] h-[85%] rounded-full shadow-inner" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? \`url(\${c.texture})\` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    </button>
                  )})}
                </div>
              </div>
              )}

              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-5 md:mb-6">
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 block flex items-center gap-2">
                  {quickViewProduct.sizes.length === 1 ? 'Tamanho Principal' : 'Selecione o Tamanho'}
                  {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize hidden md:inline-block">- {quickViewProduct.size}</span>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                      className={\`px-4 py-2 rounded-[12px] text-[11px] md:text-[12px] font-bold border transition-all \${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}\`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              )}`;

const replace1 = `<div className="flex flex-wrap items-start gap-8 mt-2 mb-6 border-t border-b border-gray-100 py-5">
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div>
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2.5 block flex items-center gap-2">
                  {quickViewProduct.colors.length === 1 ? 'Cor Disponível' : 'Selecione a Cor'}
                  {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize hidden md:inline-block">- {quickViewProduct.color}</span>}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {quickViewProduct.colors.map((c: any, i: number) => {
                    const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                    return (
                    <button
                      key={i}
                      title={c.name}
                      onClick={() => setQuickViewProduct({ ...quickViewProduct, color: c.name, ...(c.image && { image: c.image }) })}
                      className={\`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm \${isSelected ? 'border-[#0F172A] scale-110' : 'border-gray-200 hover:border-gray-400'}\`}
                    >
                      <div className="w-[85%] h-[85%] rounded-full shadow-inner" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? \`url(\${c.texture})\` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    </button>
                  )})}
                </div>
              </div>
              )}

              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div>
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2.5 block flex items-center gap-2">
                  {quickViewProduct.sizes.length === 1 ? 'Tamanho Principal' : 'Selecione o Tamanho'}
                  {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize hidden md:inline-block">- {quickViewProduct.size}</span>}
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

code = code.split(target1).join(replace1);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed alignments');
