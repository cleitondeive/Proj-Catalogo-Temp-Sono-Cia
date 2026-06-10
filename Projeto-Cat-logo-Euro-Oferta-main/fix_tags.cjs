const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const anchor1 = '{/* Tags Section */}';
const anchor2 = '</div>\n\n          </div>\n\n          {/* Histórico e Notas (Coluna Direita) */}';

if (code.includes(anchor1) && code.includes(anchor2)) {
  const replacement = `{/* Tags Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Etiquetas</h3>
               
               {isEditing && (
                 <div className="flex gap-2">
                   <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTag.trim()) {
                          setFormData({...formData, tags: [...(formData.tags || []), newTag.trim().toUpperCase()]});
                          setNewTag('');
                        }
                     }
                   }} placeholder="Nova etiqueta..." className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                   <button onClick={() => {
                      if (newTag.trim()) {
                         setFormData({...formData, tags: [...(formData.tags || []), newTag.trim().toUpperCase()]});
                         setNewTag('');
                      }
                   }} className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Adicionar</button>
                 </div>
               )}

               <div className="flex flex-wrap gap-2">
                 {(formData.tags || []).map((tag: string, i: number) => (
                   <span key={i} className="px-2 py-1 bg-gray-100 text-[#0F172A] border border-gray-200/60 rounded flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                     <span className="text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                     {isEditing && (
                       <button 
                         onClick={() => setFormData({...formData, tags: formData.tags.filter((t: string) => t !== tag)})}
                         className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-200"
                       ><X className="w-3 h-3" /></button>
                     )}
                   </span>
                 ))}
                 {!isEditing && (!formData.tags || formData.tags.length === 0) && (
                   <span className="text-xs text-gray-400 italic">Sem etiquetas</span>
                 )}
               </div>
            `;
  
  code = code.substring(0, code.indexOf(anchor1)) + replacement + code.substring(code.indexOf(anchor2));
}

// Ensure Novo Lead button visually looks professional and smaller
const btnOld = `<button onClick={() => setShowAddLead(true)} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-sm group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;
const btnNew = `<button onClick={() => setShowAddLead(true)} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group">
            <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
          </button>`;

if (code.includes(btnOld)) {
  code = code.replace(btnOld, btnNew);
} else {
  // Try another variation
  const btnOld2 = `<button onClick={() => setShowAddLead(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;
  if (code.includes(btnOld2)) {
      code = code.replace(btnOld2, btnNew);
  }
}


fs.writeFileSync('src/admin/pages/CRM.tsx', code);
