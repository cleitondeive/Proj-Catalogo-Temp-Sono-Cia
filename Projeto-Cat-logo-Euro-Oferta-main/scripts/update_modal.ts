import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf-8");

const target = `<div className="mb-5 md:mb-6">
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 block">
                  Selecione a cor
                </span>
                <div className="flex gap-3">
                  <button className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#3B4756] ring-2 ring-offset-2 ring-gray-300 transition-all cursor-pointer" />
                  <button className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#DDD7CF] ring-2 ring-offset-2 ring-transparent hover:ring-gray-200 transition-all cursor-pointer" />
                  <button className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#E5ECE0] ring-2 ring-offset-2 ring-transparent hover:ring-gray-200 transition-all cursor-pointer" />
                </div>
              </div>`;

const replacement = `{quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="mb-5 md:mb-6">
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 block">
                  Selecione a cor
                </span>
                <div className="flex flex-wrap gap-3">
                  {quickViewProduct.colors.map((c: any, i: number) => (
                    <button
                      key={i}
                      title={c.name}
                      onClick={() => setQuickViewProduct({ ...quickViewProduct, color: c.name, ...(c.image && { image: c.image }) })}
                      className={\`w-6 h-6 md:w-8 md:h-8 rounded-full ring-2 ring-offset-2 transition-all cursor-pointer shadow-sm \${quickViewProduct.color === c.name || (!quickViewProduct.color && i===0) ? 'ring-brand-blue scale-110' : 'ring-transparent hover:ring-gray-300'}\`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
              )}

              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="mb-5 md:mb-6">
                <span className="text-[10px] md:text-[11px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 md:mb-3 block">
                  Selecione o tamanho
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                      className={\`px-4 py-1.5 rounded-[10px] text-[11px] md:text-[12px] font-bold border transition-colors \${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}\`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              )}`;

code = code.split(target).join(replacement);
fs.writeFileSync("src/App.tsx", code);
console.log("Updated App.tsx variants!");
