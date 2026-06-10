import fs from 'fs';
let content = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

if (!content.includes("updateColor(i, 'weight', e.target.value)")) {
    const target = `                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Altura (m)</label>
                          <input type="text" value={c.height || ''} onChange={e => updateColor(i, 'height', e.target.value)} placeholder="0.75" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>`;
    const replacement = `                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Altura (m)</label>
                          <input type="text" value={c.height || ''} onChange={e => updateColor(i, 'height', e.target.value)} placeholder="0.75" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Peso (kg)</label>
                          <input type="text" value={c.weight || ''} onChange={e => updateColor(i, 'weight', e.target.value)} placeholder="20.5" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>`;
    content = content.replace(target, replacement);
    
    // Also change grid cols where this lives:
    content = content.replace('className="grid grid-cols-2 md:grid-cols-3', 'className="grid grid-cols-2 md:grid-cols-4');
    
    fs.writeFileSync('src/admin/pages/ColorsManager.tsx', content, 'utf8');
    console.log('Colors manager updated');
}
