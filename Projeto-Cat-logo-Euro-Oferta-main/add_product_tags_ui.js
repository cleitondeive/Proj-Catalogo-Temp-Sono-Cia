import fs from 'fs';
let content = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');

const target = `<label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Etiqueta Promocional (Destaque)</label>
                     <div className="flex gap-3">
                       <input type="text" value={formData.tag || ''} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="Ex: 30% OFF" className="flex-1 px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors uppercase tracking-widest font-bold text-[13px]" />
                       <div className="w-20 shrink-0 flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-xl items-center px-2 py-0.5 shadow-sm">
                         <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Cor Ativa</label>
                         <div className="flex items-center justify-center w-full">
                           <input type="color" value={formData.tagColor || '#1E293B'} onChange={e => setFormData({ ...formData, tagColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0 shadow-sm bg-transparent" />
                         </div>
                       </div>
                     </div>`;

const replacement = `<label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Etiqueta Promocional (Destaque)</label>
                     <div className="flex gap-3">
                       <input type="text" value={formData.tag || ''} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="Ex: 30% OFF" className="flex-1 px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors uppercase tracking-widest font-bold text-[13px]" />
                       <div className="w-20 shrink-0 flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-xl items-center px-2 py-0.5 shadow-sm">
                         <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Cor Ativa</label>
                         <div className="flex items-center justify-center w-full">
                           <input type="color" value={formData.tagColor || '#1E293B'} onChange={e => setFormData({ ...formData, tagColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0 shadow-sm bg-transparent" />
                         </div>
                       </div>
                     </div>
                  </div>

                  <div className="lg:col-span-2">
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tags Principais (Separadas por vírgula)</label>
                     <input type="text" value={formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="lançamento, inverno, premium" className="w-full px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />
                  `;

content = content.replace(target, replacement);

fs.writeFileSync('src/admin/pages/ProductsManager.tsx', content, 'utf8');
