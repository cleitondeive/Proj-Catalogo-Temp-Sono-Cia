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
  types = types.replace(/tags:\s*any(?:\[\])?;/g, 'tags: {text: string, bg: string, textCol: string}[];');
  types = types.replace(/tags\?:\s*any(?:\[\])?;/g, 'tags?: {text: string, bg: string, textCol: string}[];');
  fs.writeFileSync('src/types.ts', types);
}

// 2. Update CRM.tsx
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// Fix handleSave
const handleSaveStr = `updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, vipLevel: formData.vipLevel, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined });`;

if (crm.includes(handleSaveStr)) {
  crm = crm.replace(handleSaveStr, `updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, vipLevel: formData.vipLevel, tags: formData.tags, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined });`);
}

// Ensure tags are rendered with color
crm = crm.replace(
  /\{\(formData\.tags \|\| \[\]\)\.map\(\(tag: string, i: number\) => \([\s\S]*?<\/span>\n\s*\)\)\}/,
  `{(formData.tags || []).map((tag: any, i: number) => {
    const tText = tag.text || tag;
    const tBg = tag.bg || 'bg-gray-100';
    const tTextCol = tag.textCol || 'text-[#0F172A]';
    return (
      <span key={i} className={\`px-2 py-1 \${tBg} \${tTextCol} border border-gray-200/60 rounded flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]\`}>
        <span className="text-[10px] font-bold uppercase tracking-widest">{tText}</span>
        {isEditing && (
          <button 
            onClick={() => setFormData({...formData, tags: formData.tags.filter((t: any) => t !== tag)})}
            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-200"
          ><X className="w-3 h-3" /></button>
        )}
      </span>
    );
  })}`
);


// And update the input part for colors
const oldInput = `{isEditing && (
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
               )}`;

const newInput = `{isEditing && (
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
                          {bg: 'bg-purple-100', textCol: 'text-purple-700', hex: '#F3E8FF'},
                          {bg: 'bg-pink-100', textCol: 'text-pink-700', hex: '#FCE7F3'}
                        ].map((c, i) => (
                           <button 
                             key={i}
                             onClick={() => setNewTagColor({bg: c.bg, textCol: c.textCol})}
                             className={\`w-5 h-5 rounded-full border-2 transition-all \${newTagColor.bg === c.bg ? 'border-[#0F172A] scale-110' : 'border-transparent'}\`}
                             style={{backgroundColor: c.hex}}
                             title={c.bg}
                           />
                        ))}
                     </div>
                   </div>
                 </div>
               )}`;

crm = crm.replace(oldInput, newInput);

if (!crm.includes('newTagColor')) {
  crm = crm.replace(
    "const [newTag, setNewTag] = useState('');",
    "const [newTag, setNewTag] = useState('');\n  const [newTagColor, setNewTagColor] = useState({bg: 'bg-gray-100', textCol: 'text-gray-700'});"
  );
}

// Clean up LeadCard mapping
const leadCardTagOldRegex = /\{lead\.tags\.slice\(0,\s*3\)\.map\(\(tag(?:.*?), i\) => \([\s\S]*?<\/span>\n\s*\)\)\}/;
if (crm.match(leadCardTagOldRegex)) {
  crm = crm.replace(leadCardTagOldRegex, `{lead.tags.slice(0, 3).map((tag: any, i: number) => {
    const tText = tag.text || tag;
    const tBg = tag.bg || 'bg-gray-100';
    const tTextCol = tag.textCol || 'text-[#0F172A]';
    return (
      <span key={i} className={\`text-[8px] font-bold uppercase tracking-widest \${tTextCol} \${tBg} border border-gray-200/50 px-1.5 py-0.5 rounded shadow-sm\`}>
        {tText}
      </span>
    );
})}`);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
