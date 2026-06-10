const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const stateTarget = "const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '', vipLevel: lead.vipLevel || 'Nenhum', tags: lead.tags || [], name: lead.name });";
const stateReplacement = stateTarget + "\n  const [newTag, setNewTag] = useState('');\n  const [isAddingTag, setIsAddingTag] = useState(false);";
if (!code.includes("isAddingTag")) {
  code = code.replace(stateTarget, stateReplacement);
}

const tagsTarget = `{isEditing && (
                   <button 
                     onClick={() => {
                        const t = prompt('Nova etiqueta (ex: URGENTE, ATACADO):');
                        if (t && t.trim()) setFormData({...formData, tags: [...(formData.tags || []), t.trim().toUpperCase()]});
                     }}
                     className="px-2 py-1 border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider"
                   >
                     + Adicionar
                   </button>
                 )}`;

const tagsReplacement = `{isEditing && (
                   <div className="flex items-center gap-1">
                     {isAddingTag ? (
                       <input 
                         type="text"
                         autoFocus
                         value={newTag}
                         onChange={e => setNewTag(e.target.value)}
                         onKeyDown={e => {
                           if (e.key === 'Enter') {
                             if (newTag.trim()) {
                               setFormData({...formData, tags: [...(formData.tags || []), newTag.trim().toUpperCase()]});
                               setNewTag('');
                               setIsAddingTag(false);
                             }
                           } else if (e.key === 'Escape') {
                             setNewTag('');
                             setIsAddingTag(false);
                           }
                         }}
                         onBlur={() => {
                           if (newTag.trim()) {
                             setFormData({...formData, tags: [...(formData.tags || []), newTag.trim().toUpperCase()]});
                           }
                           setNewTag('');
                           setIsAddingTag(false);
                         }}
                         placeholder="Nova etiqueta..."
                         className="px-2 py-1 border border-brand-blue/30 rounded-md text-[10px] font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white"
                         style={{ width: '100px' }}
                       />
                     ) : (
                       <button 
                         onClick={() => setIsAddingTag(true)}
                         className="px-2 py-1 border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                       >
                         + Adicionar
                       </button>
                     )}
                   </div>
                 )}`;

if (code.includes("prompt('Nova etiqueta")) {
  code = code.replace(tagsTarget, tagsReplacement);
}

const novoLeadTarget = `<button onClick={() => setShowAddLead(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;
const novoLeadReplacement = `<button onClick={() => setShowAddLead(true)} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-sm group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;

if (code.includes(novoLeadTarget)) {
  code = code.replace(novoLeadTarget, novoLeadReplacement);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
