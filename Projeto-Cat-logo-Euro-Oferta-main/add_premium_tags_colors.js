import fs from 'fs';
let content = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

const target = `<div>
                         <label className="text-[10px] font-bold text-gray-500 block mb-1">Tags (Separadas por vírgula)</label>
                         <input type="text" value={c.tags || ''} onChange={e => updateColor(i, 'tags', e.target.value)} placeholder="lançamento, inverno, premium" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                      </div>`;

const replacement = `<div>
                         <div className="flex items-center justify-between mb-1">
                           <label className="text-[10px] font-bold text-gray-500 block">Tags Específicas da Variação</label>
                         </div>
                         <input type="text" value={c.tags || ''} onChange={e => updateColor(i, 'tags', e.target.value)} placeholder="lançamento, edição limitada..." className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none transition-colors" />
                         {c.tags && (
                           <div className="flex flex-wrap gap-1.5 mt-2">
                             {c.tags.split(',').filter((t: string) => t.trim()).map((t: string, tidx: number) => (
                               <span key={tidx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider rounded">
                                  #{t.trim()}
                               </span>
                             ))}
                           </div>
                         )}
                      </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/admin/pages/ColorsManager.tsx', content, 'utf8');
