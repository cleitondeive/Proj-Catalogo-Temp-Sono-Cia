const fs = require('fs');

// 1. Update Types
let types = fs.readFileSync('src/types.ts', 'utf8');
if (types.includes('tags: string[];')) {
  types = types.replace('tags: string[];', 'tags: {text: string, bg: string, textCol: string}[];');
  fs.writeFileSync('src/types.ts', types);
} else if (types.includes('tags?: string[];')) {
  types = types.replace('tags?: string[];', 'tags?: {text: string, bg: string, textCol: string}[];');
  fs.writeFileSync('src/types.ts', types);
} else {
  // force string[] -> object replace if it exists
  types = types.replace(/tags:\s*any(?:\[\])?;/g, 'tags: {text: string, bg: string, textCol: string}[];');
  types = types.replace(/tags\?:\s*any(?:\[\])?;/g, 'tags?: {text: string, bg: string, textCol: string}[];');
  fs.writeFileSync('src/types.ts', types);
}

// 2. Update CRM.tsx
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// Fix handleSave
const handleSaveRegex = /updateLead\(lead\.id, \{(.*?)\}\);/;
const match = crm.match(handleSaveRegex);
if (match && !match[1].includes('tags:')) {
  const newPayload = match[1] + ', tags: formData.tags';
  crm = crm.replace(handleSaveRegex, "updateLead(lead.id, {" + newPayload + "});");
}

// Replace string tag rendering in LeadCard
const leadCardTagRenderOld = \`{lead.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[8px] font-bold uppercase tracking-widest text-[#0F172A] bg-gray-100 border border-gray-200/50 px-1.5 py-0.5 rounded shadow-sm">
              {tag}
            </span>
          ))}\`;
const leadCardTagRenderNew = \`{lead.tags.slice(0, 3).map((tag: any, i: number) => (
            <span key={i} className={\`text-[8px] font-bold uppercase tracking-widest \${tag.textCol || 'text-gray-700'} \${tag.bg || 'bg-gray-100'} border border-black/5 px-1.5 py-0.5 rounded shadow-sm\`}>
              {tag.text || tag}
            </span>
          ))}\`;
if (crm.includes(leadCardTagRenderOld)) {
  crm = crm.replace(leadCardTagRenderOld, leadCardTagRenderNew);
} else {
    // try to match any tag render
    crm = crm.replace(/{lead\.tags\.slice\(0, 3\)\.map\(\(tag(?:.*?), i(.*?) => \([\s\S]*?{tag(?:.*?)}(?:.*?)<\/span>\n\s*\)\)}/g, leadCardTagRenderNew);
}

// Now replace the tags section in the detailed view
const tagsSectionRegex = /{isEditing && \([\s\S]*?<div className="flex flex-wrap gap-2">[\s\S]*?<\/div>\n\s*\]}/m;

// Since it's hard to match block, let's just replace the exact part
// First check if 'const [newTag, setNewTag]' exists, we will add color state
if (!crm.includes('newTagColor')) {
  crm = crm.replace(
    "const [newTag, setNewTag] = useState('');",
    "const [newTag, setNewTag] = useState('');\n  const [newTagColor, setNewTagColor] = useState({bg: 'bg-gray-100', textCol: 'text-gray-700'});"
  );
}

// The UI code we recently injected in fix_tags.cjs:
const oldTagsUI = \`               {isEditing && (
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
               </div>\`;

const PRESET_COLORS = [
  {bg: 'bg-gray-100', textCol: 'text-gray-700'},
  {bg: 'bg-blue-100', textCol: 'text-blue-700'},
  {bg: 'bg-emerald-100', textCol: 'text-emerald-700'},
  {bg: 'bg-amber-100', textCol: 'text-amber-700'},
  {bg: 'bg-red-100', textCol: 'text-red-700'},
  {bg: 'bg-purple-100', textCol: 'text-purple-700'},
  {bg: 'bg-pink-100', textCol: 'text-pink-700'}
];

const newTagsUI = \`               {isEditing && (
                 <div className="flex flex-col gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                   <div className="flex gap-2">
                     <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTag.trim()) {
                            setFormData({...formData, tags: [...(formData.tags || []), {text: newTag.trim().toUpperCase(), ...newTagColor}]});
                            setNewTag('');
                          }
                       }
                     }} placeholder="Nova etiqueta..." className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                     <button onClick={() => {
                        if (newTag.trim()) {
                           setFormData({...formData, tags: [...(formData.tags || []), {text: newTag.trim().toUpperCase(), ...newTagColor}]});
                           setNewTag('');
                        }
                     }} className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Adicionar</button>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor:</span>
                     <div className="flex gap-2">
                        {[
                          {bg: 'bg-gray-100', textCol: 'text-gray-700', hex: '#F3F4F6'},
                          {bg: 'bg-blue-100', textCol: 'text-blue-700', hex: '#DBEAFE'},
                          {bg: 'bg-emerald-100', textCol: 'text-emerald-700', hex: '#D1FAE5'},
                          {bg: 'bg-amber-100', textCol: 'text-amber-700', hex: '#FEF3C7'},
                          {bg: 'bg-red-100', textCol: 'text-red-700', hex: '#FEE2E2'},
                          {bg: 'bg-purple-100', textCol: 'text-purple-700', hex: '#F3E8FF'}
                        ].map((c, i) => (
                           <button 
                             key={i}
                             onClick={() => setNewTagColor({bg: c.bg, textCol: c.textCol})}
                             className={\`w-6 h-6 rounded-full border-2 transition-all \${newTagColor.bg === c.bg ? 'border-[#0F172A] scale-110' : 'border-transparent'}\`}
                             style={{backgroundColor: c.hex}}
                             title={c.bg}
                           />
                        ))}
                     </div>
                   </div>
                 </div>
               )}

               <div className="flex flex-wrap gap-2">
                 {(formData.tags || []).map((tag: any, i: number) => {
                    const tText = tag.text || tag;
                    const tBg = tag.bg || 'bg-gray-100';
                    const tTextCol = tag.textCol || 'text-gray-700';
                    return (
                     <span key={i} className={\`px-2 py-1 \${tBg} \${tTextCol} border border-black/5 rounded flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]\`}>
                       <span className="text-[10px] font-bold uppercase tracking-widest">{tText}</span>
                       {isEditing && (
                         <button 
                           onClick={() => setFormData({...formData, tags: formData.tags.filter((t: any) => t !== tag)})}
                           className={\`\${tTextCol} hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-black/5\`}
                         ><X className="w-3 h-3" /></button>
                       )}
                     </span>
                    )}
                 )}
                 {!isEditing && (!formData.tags || formData.tags.length === 0) && (
                   <span className="text-xs text-gray-400 italic">Sem etiquetas</span>
                 )}
               </div>\`;

// Replace it!
if (crm.includes(oldTagsUI.trim().substring(0, 50))) { // Just match the first few chars to be safe
    // Instead of raw string replace, we can use a more precise string manipulation or split
    const oldTagsUIEscaped = oldTagsUI.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // escape regex
    
    // Fallback: replace everything between '{/* Tags Section */}' and '</div>\n\n          </div>\n\n          {/* Histórico e Notas (Coluna Direita) */}'
    
    const startAnchor = '{/* Tags Section */}';
    const endAnchor = '</div>\\n\\n          </div>\\n\\n          {/* Histórico e Notas (Coluna Direita) */}';
    // wait I can just use string replace on the exact oldTagsUI
    crm = crm.replace(oldTagsUI, newTagsUI);
} else {
    // Try manual replacement if exact string doesn't match
    const startIdx = crm.indexOf('{isEditing && (\\n                 <div className="flex gap-2">');
    if (startIdx !== -1) {
        let endIdx = crm.indexOf('Sem etiquetas</span>\\n                 )}\\n               </div>', startIdx);
        if (endIdx !== -1) {
            endIdx += 'Sem etiquetas</span>\\n                 )}\\n               </div>'.length;
            crm = crm.substring(0, startIdx) + newTagsUI + crm.substring(endIdx);
        }
    } else {
        const altStartIdx = crm.indexOf('{isEditing && (');
    }
}

// Double check the fallback
if (!crm.includes(newTagsUI.substring(0, 50))) {
    const s1 = crm.indexOf('{/* Tags Section */}');
    const s2 = crm.indexOf('</div>\\n\\n          </div>\\n\\n          {/* Histórico e Notas (Coluna Direita) */}');
    if (s1 !== -1 && s2 !== -1) {
        crm = crm.substring(0, s1) + '{/* Tags Section */}\\n            <div className="space-y-4 pt-4 border-t border-gray-100">\\n               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Etiquetas</h3>\\n' + newTagsUI + '\\n            </div>\\n\\n          </div>\\n\\n          {/* Histórico e Notas (Coluna Direita) */}\\n' + crm.substring(s2 + endAnchor.length);
    }
}

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
