const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const targetHtml = `            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>`;

const replaceHtml = `            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-blue-500" /> Responsável (Vendedor)</h3>
               {isEditing ? (
                  <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none">
                    <option value="Sem Responsável">Sem Responsável</option>
                    <option value="Meus Leads">Mim (Admin)</option>
                    <option value="João Vendas">João Vendas</option>
                    <option value="Maria Costa">Maria Costa</option>
                  </select>
               ) : (
                 <div className="text-[13px] text-[#0F172A] font-medium bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   {formData.assignee}
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Valor Estimado (Pipeline)</h3>
               {isEditing ? (
                  <input type="number" value={formData.estimatedValue} onChange={e => setFormData({...formData, estimatedValue: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-600 font-medium" placeholder="Ex: 5000" />
               ) : (
                 <div className="text-[14px] font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                   R$ {Number(formData.estimatedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>`;

crm = crm.replace(targetHtml, replaceHtml);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('done saving html');
