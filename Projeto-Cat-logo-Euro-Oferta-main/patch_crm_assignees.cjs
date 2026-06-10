const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const targetSelect = `{isEditing ? (
                  <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none">
                    <option value="Sem Responsável">Sem Responsável</option>
                    <option value="Meus Leads">Mim (Admin)</option>
                    <option value="João Vendas">João Vendas</option>
                    <option value="Maria Costa">Maria Costa</option>
                  </select>
               ) : (`;

const replaceSelect = `{isEditing ? (
                  <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-700 bg-gray-50/50 appearance-none cursor-pointer">
                    <option value="Sem Responsável">Sem Responsável</option>
                    {data.users?.filter((u: any) => u.role !== 'viewer').map((u: any) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
               ) : (`;

crm = crm.replace(targetSelect, replaceSelect);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('patched CRM user assigns');
