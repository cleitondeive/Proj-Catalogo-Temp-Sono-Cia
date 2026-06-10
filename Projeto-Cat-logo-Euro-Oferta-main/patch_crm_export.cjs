const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// Add Download import if it's not present or just verify
if (!code.includes("import { Search, Filter, Plus, MoreHorizontal, Download")) {
  code = code.replace(
    "import { Search, Filter, Plus, MoreHorizontal",
    "import { Search, Filter, Plus, MoreHorizontal, Download"
  );
}

// Ensure the button is added
const buttonTarget = `<button onClick={() => setShowAddLead(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>`;
const buttonReplacement = `<button onClick={() => setShowAddLead(true)} className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Novo Lead
          </button>
          <button 
            onClick={() => {
              const headers = ['Nome,Telefone,Email,Status,VIP,Total Gasto\\n'];
              const csv = filteredLeads.map((l: any) => \`"\${l.name}","\${l.phone}","\${l.email || ''}","\${l.status}","\${l.vipLevel}","R$ \${l.totalSpent.toFixed(2)}"\`).join('\\n');
              const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'leads_eurooferta.csv';
              link.click();
              showSuccess('Leads exportados com sucesso!');
            }} 
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 hidden lg:flex"
            title="Exportar Leads (CSV)"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>`;

if (code.includes(buttonTarget) && !code.includes("leads_eurooferta.csv")) {
  code = code.replace(buttonTarget, buttonReplacement);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
