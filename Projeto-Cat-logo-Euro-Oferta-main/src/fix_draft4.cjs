const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');

const target2 = `      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">`;

const replace2 = `      {hasDraft && !editingProduct && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <div>
               <h3 className="text-sm font-bold text-amber-900">Rascunho Encontrado</h3>
               <p className="text-xs text-amber-700">O produto em edição foi recuperado após a atualização da página.</p>
             </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button onClick={clearDraft} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">Descartar</button>
             <button onClick={restoreDraft} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm">Restaurar Rascunho</button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">`;

if (code.includes(target2)) {
  code = code.replace(target2, replace2);
  console.log('Target 2 replaced successfully.');
}

fs.writeFileSync('src/admin/pages/ProductsManager.tsx', code);
