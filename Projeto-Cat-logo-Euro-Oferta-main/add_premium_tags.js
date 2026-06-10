import fs from 'fs';
let content = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');

const target = `<label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tags Principais (Separadas por vírgula)</label>
                     <input type="text" value={formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="lançamento, inverno, premium" className="w-full px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />`;

const replacement = `<div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Tags Principais (Separadas por vírgula)</label>
                        <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Premium Feature</span>
                     </div>
                     <input type="text" value={formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="lançamento, inverno, premium" className="w-full px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />
                     {formData.tags && (
                       <div className="flex flex-wrap gap-2 mt-3 animate-fade-in-up">
                         {formData.tags.split(',').filter(t => t.trim()).map((t, i) => (
                           <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8FAFC] border border-gray-200 text-[#0F172A] text-[11px] font-bold rounded-lg shadow-sm">
                              #{t.trim()}
                           </span>
                         ))}
                       </div>
                     )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/admin/pages/ProductsManager.tsx', content, 'utf8');
