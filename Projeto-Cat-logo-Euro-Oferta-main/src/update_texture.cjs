const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

const oldTextureBlock = `                      {/* Textura */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="text-[11px] font-bold text-gray-600 block mb-2">Aplicar Textura (Madeira, Tecido...)</label>
                        {!c.texture ? (
                          <label className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <Layers className="w-5 h-5 text-gray-400 mb-1"/>
                            <span className="text-[11px] text-gray-500 font-bold">Upload Textura</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLocalImageUpload(i, e, true)} />
                          </label>
                        ) : (
                          <div className="flex items-center gap-3">
                             <div className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm" style={{ backgroundImage: \`url(\${c.texture})\`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                             <button type="button" onClick={() => updateColorFields(i, { texture: '', hex: '#000000' })} className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1.5 rounded-lg transition-colors">Remover Textura</button>
                          </div>
                        )}
                      </div>`;

const newTextureBlock = `                      {/* Textura */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="text-[11px] font-bold text-gray-600 block mb-2">Aplicar Textura (Madeira, Tecido...)</label>
                        {!c.texture ? (
                          <div className="flex flex-col gap-2">
                             <input type="text" value={c.texture || ''} onChange={(e) => updateColorFields(i, { texture: e.target.value, hex: '#FFFFFF' })} placeholder="URL da textura (opcional)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-xs" />
                             <div className="relative">
                               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                               <div className="relative flex justify-center text-[10px]"><span className="bg-white px-2 text-gray-400">ou</span></div>
                             </div>
                             <label className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                               <Layers className="w-4 h-4 text-gray-400 mb-0.5"/>
                               <span className="text-[10px] text-gray-500 font-bold">Upload Textura</span>
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLocalImageUpload(i, e, true)} />
                             </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                             <div className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm shrink-0" style={{ backgroundImage: \`url(\${c.texture})\`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                             <div className="flex flex-col gap-1.5 w-full min-w-0">
                               <input type="text" value={c.texture} onChange={(e) => updateColorFields(i, { texture: e.target.value, hex: '#FFFFFF' })} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="URL da textura" />
                               <button type="button" onClick={() => updateColorFields(i, { texture: '', hex: '#000000' })} className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg transition-colors inline-block w-fit">Remover Textura</button>
                             </div>
                          </div>
                        )}
                      </div>`;

code = code.replace(oldTextureBlock, newTextureBlock);
fs.writeFileSync('src/admin/pages/ColorsManager.tsx', code);
