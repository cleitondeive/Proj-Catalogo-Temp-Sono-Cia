const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');

const target1 = `export default function ProductsManager() {
  const { data, setData } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);`;

const replace1 = `const LOCAL_DRAFT_KEY = 'euro_product_draft';

export default function ProductsManager() {
  const { data, setData } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  useEffect(() => {
    const draft = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  const restoreDraft = () => {
    try {
      const draft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (draft) setEditingProduct(JSON.parse(draft));
    } catch(e) {
      console.error(e);
    }
    setHasDraft(false);
  };
  
  const clearDraft = () => {
    localStorage.removeItem(LOCAL_DRAFT_KEY);
    setHasDraft(false);
  };
`;

if (code.includes(target1)) {
  code = code.replace(target1, replace1);
}

const target2 = `      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Produtos</h2>`;

const replace2 = `      {hasDraft && !editingProduct && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <div>
               <h3 className="text-sm font-bold text-amber-900">Rascunho Encontrado</h3>
               <p className="text-xs text-amber-700">Um produto (ou edição) não foi salvo corretamente da última vez.</p>
             </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button onClick={clearDraft} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">Descartar</button>
             <button onClick={restoreDraft} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm">Restaurar</button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Produtos</h2>`;

if (code.includes(target2)) {
  code = code.replace(target2, replace2);
}

fs.writeFileSync('src/admin/pages/ProductsManager.tsx', code);
