const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// 1. Add Plus import
code = code.replace(
  "import { Search, Filter, MoreHorizontal",
  "import { Search, Filter, Plus, MoreHorizontal"
);

// 2. Add showAddLead state
const stateTarget = "const [successMessage, setSuccessMessage] = useState<string | null>(null);";
const stateReplacement = `const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', vipLevel: 'Nenhum' as any, source: 'Manual', status: 'Novo Lead' as any });`;
if (!code.includes("showAddLead")) {
  code = code.replace(stateTarget, stateReplacement);
}

// 3. Add modal saving function and JSX
const saveLeadFunc = `
  const handleAddNewLead = () => {
    if (!newLeadData.name || !newLeadData.phone) return;
    addLead(newLeadData);
    setShowAddLead(false);
    showSuccess('Lead adicionado com sucesso!');
    setNewLeadData({ name: '', phone: '', email: '', vipLevel: 'Nenhum', source: 'Manual', status: 'Novo Lead' });
  };
`;

// we need to get addLead from useStore() inside CRM
if (!code.includes("addLead")) {
    code = code.replace(/const { data, updateLeadStatus, deleteLead } = useStore\(\);/,
      "const { data, updateLeadStatus, deleteLead, addLead } = useStore();"
    );
}

// insert handleAddNewLead
if (!code.includes("handleAddNewLead")) {
    code = code.replace("const filteredLeads = ", saveLeadFunc + "\n  const filteredLeads = ");
}

// 4. insert the button
const buttonTarget = `<button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700">
            <Filter className="w-4 h-4" /> Filtros
          </button>`;
const buttonReplacement = `<button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 hidden sm:flex">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button onClick={() => setShowAddLead(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;
code = code.replace(buttonTarget, buttonReplacement);


// 5. Add the modal itself to the end before the closing </div> of CRM
const modalJSX = `
      {showAddLead && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in px-4 py-6">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl scale-in-center">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A]">Novo Lead</h2>
              <button 
                onClick={() => setShowAddLead(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#0F172A] hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nome Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newLeadData.name} 
                  onChange={e => setNewLeadData({...newLeadData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="Ex: João Silva" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.phone} 
                  onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="(00) 00000-0000" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                <input 
                  type="email" 
                  value={newLeadData.email} 
                  onChange={e => setNewLeadData({...newLeadData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="joao@exemplo.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
                  <select 
                    value={newLeadData.status} 
                    onChange={e => setNewLeadData({...newLeadData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm appearance-none cursor-pointer"
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">VIP</label>
                  <select 
                    value={newLeadData.vipLevel} 
                    onChange={e => setNewLeadData({...newLeadData, vipLevel: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="Nenhum">Nenhum</option>
                    <option value="Cliente Potencial">Potencial</option>
                    <option value="Cliente Frequente">Frequente</option>
                    <option value="VIP Premium">Premium</option>
                    <option value="VIP Gold">Gold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
               <button 
                 onClick={() => setShowAddLead(false)}
                 className="px-5 py-2.5 text-gray-600 font-bold text-sm hover:text-gray-900 transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleAddNewLead}
                 disabled={!newLeadData.name || !newLeadData.phone}
                 className="px-6 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.15)] disabled:opacity-50 transition-all flex items-center gap-2"
               >
                 Salvar Lead
               </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace("      {selectedLead && <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}\n    </div>", 
  "      {selectedLead && <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}\n" + modalJSX + "\n    </div>");

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
