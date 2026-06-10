const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// 1. Update initial formData to include vipLevel
code = code.replace(
  "const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '' });",
  "const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '', vipLevel: lead.vipLevel || 'Nenhum' });"
);

// 2. Update handleSave to save vipLevel
code = code.replace(
  "updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined });",
  "updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, vipLevel: formData.vipLevel, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined });"
);

// 3. Inject VIP select inside the Edit form in CRM Modal
const oldStatusBlock = `
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>`;

const newVipBlock = `
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Nível Vip Cliente</h3>
               {isEditing ? (
                  <select value={formData.vipLevel} onChange={e => setFormData({...formData, vipLevel: e.target.value as any})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none">
                    <option value="Nenhum">Nenhum</option>
                    <option value="Cliente Potencial">Cliente Potencial</option>
                    <option value="Cliente Frequente">Cliente Frequente</option>
                    <option value="VIP Premium">VIP Premium</option>
                    <option value="VIP Gold">VIP Gold</option>
                  </select>
               ) : (
                 lead.vipLevel !== 'Nenhum' ? (
                   <div className={\`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border \${lead.vipLevel === 'VIP Gold' ? 'bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border-yellow-300' : lead.vipLevel === 'VIP Premium' ? 'bg-gradient-to-r from-gray-800 to-black text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}\`}>
                     <Star className={\`w-3.5 h-3.5 \${lead.vipLevel === 'VIP Gold' ? 'text-amber-600' : lead.vipLevel === 'VIP Premium' ? 'text-gray-300' : 'text-gray-400'}\`} />
                     {lead.vipLevel}
                   </div>
                 ) : (
                   <span className="text-[13px] text-gray-400 font-medium">Classificação Comum</span>
                 )
               )}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>`;

code = code.replace(oldStatusBlock, newVipBlock);

// 4. Inject a beautiful VIP Card section in the Metrics.tsx
// wait, we can also inject that. Let's save this file.
fs.writeFileSync('src/admin/pages/CRM.tsx', code);
console.log('CRM vip edit functionality added.');
