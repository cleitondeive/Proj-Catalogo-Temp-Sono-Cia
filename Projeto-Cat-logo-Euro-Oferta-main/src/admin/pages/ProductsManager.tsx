import React, { useState } from 'react';
import { useStore } from '../../store';
import { Product } from '../../types';
import { Plus, Search, Edit3, Trash2, ArrowUpRight, Copy, Image as ImageIcon, ToggleLeft, ToggleRight, X, CheckCircle2, MessageCircle, Box, Layers } from 'lucide-react';

import ColorsManager from './ColorsManager';

const LOCAL_DRAFT_KEY = 'euro_product_draft';

export default function ProductsManager() {
  const { data, setProducts, addLog } = useStore();
  const currentUserOption = data.users?.find(u => u.id === localStorage.getItem('admin_user_id'))?.name || 'Admin';
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  React.useEffect(() => {
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

  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToShare, setProductToShare] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredProducts = data.products.filter(p => {
    const s = search.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(s) || 
           p.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(s);
  });

  const toggleStatus = (product: Product) => {
    const isActivating = product.status !== 'active';
    if (addLog) addLog('Status Produto', 'Status do ' + product.name + ' foi atualizado.', currentUserOption, 'update');
    setProducts(data.products.map(p => p.id === product.id ? { ...p, status: isActivating ? 'active' : 'draft' } : p));
    showSuccess(isActivating ? 'Produto ativado na loja.' : 'Produto ocultado da loja.');
  }

  return (
    <div className="p-5 sm:p-8 pb-32 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-[#0F172A] relative">
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in z-50">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}
      {hasDraft && !editingProduct && (
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Produtos</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {data.products.filter(p => p.status === 'active').length} Ativos
            </span>
            <span className="text-sm font-medium bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              {data.products.filter(p => p.status !== 'active').length} Inativos
            </span>
          </div>
          <p className="text-gray-500 mt-3 text-sm">Gerencie seu catálogo, promoções e visibilidade.</p>
        </div>
        <button 
          onClick={() => setEditingProduct({ id: Math.random().toString(), name: '', price: '', originalPrice: '', image: '', category: '', status: 'active', createdAt: new Date().toISOString(), hasVariations: false, colors: [{ name: '', hex: '#000000', image: '', texture: '', price: '', originalPrice: '', description: '', length: '', width: '', height: '', tags: '' }] })}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, SKU, categoria..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                <th className="p-4 font-bold">Produto</th>
                <th className="p-4 font-bold">Preço</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative group/image">
                         {product.image ? (
                           <>
                             <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110" />
                             <div className="fixed z-50 invisible group-hover/image:visible opacity-0 group-hover/image:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-4 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 ml-16 mt-[-80px]">
                               <img src={product.image} className="w-48 h-48 object-cover rounded-xl" />
                             </div>
                           </>
                         ) : (
                           <ImageIcon className="w-6 h-6 text-gray-400 m-auto mt-5" />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A]">{product.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{product.category}</p>
                        {product.tag && <span className="inline-block mt-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded">{product.tag}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      {product.showPrice !== false ? (
                      <span className="font-bold text-[#0F172A]">R$ {product.price}</span>
                      ) : (
                      <span className="font-bold text-brand-blue uppercase text-[10px] tracking-wider bg-blue-50 px-2 py-0.5 rounded w-fit">Consulta</span>
                      )}
                      {product.originalPrice && product.originalPrice !== product.price && product.showPrice !== false && (
                        <span className="text-xs text-gray-400 line-through">R$ {product.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                     <button
                       onClick={() => toggleStatus(product)}
                       className="group flex items-center gap-3 cursor-pointer outline-none w-[100px]"
                       title={product.status === 'active' ? 'Ocultar Produto' : 'Ativar Produto'}
                     >
                       <div className={`relative flex items-center justify-between w-[46px] h-6 rounded-full transition-all duration-300 ease-in-out px-1 shadow-inner border shrink-0 ${product.status === 'active' ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-200 border-gray-200'}`}>
                         <div className={`absolute left-1 bg-white w-4 h-4 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center ${product.status === 'active' ? 'translate-x-[22px]' : 'translate-x-0'}`}>
                           {product.status === 'active' ? (
                             <span className="block w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                           ) : (
                             <span className="block w-1 h-1 bg-gray-400 rounded-full" />
                           )}
                         </div>
                       </div>
                       <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${product.status === 'active' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                         {product.status === 'active' ? 'Ativo' : 'Oculto'}
                       </span>
                     </button>
                  </td>
                   <td className="p-4">
                     {productToDelete === product.id ? (
                       <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-xl border border-red-100 animate-fade-in w-fit isolate">
                          <span className="text-[11px] font-bold text-red-600 px-2 uppercase tracking-wider">Excluir?</span>
                          <button onClick={() => {
                            if (addLog) addLog('Exclusão', 'O produto ' + product.name + ' foi excluído', currentUserOption, 'delete');
                            setProducts(data.products.filter(p => p.id !== product.id));
                            setProductToDelete(null);
                            showSuccess('Produto excluído com sucesso!');
                          }} className="text-[10px] font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm">Sim</button>
                          <button onClick={() => setProductToDelete(null)} className="text-[10px] font-bold bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Cancelar</button>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setProductToShare(product)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Compartilhar Produto"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9), name: `${product.name} (Cópia)` };
                            if (addLog) addLog('Produto Duplicado', 'O produto ' + product.name + ' foi copiado', currentUserOption, 'create');
                            setProducts([newProduct, ...data.products]);
                          }} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Duplicar">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setProductToDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     )}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <ProductEditor 
          product={editingProduct} 
          onSave={(p) => {
             if (data.products.find(x => x.id === p.id)) {
                if (addLog) addLog('Produto Editado', 'O produto ' + p.name + ' foi alterado', currentUserOption, 'update');
                setProducts(data.products.map(x => x.id === p.id ? p : x));
             } else {
                if (addLog) addLog('Novo Produto', 'O produto ' + p.name + ' foi adicionado', currentUserOption, 'create');
                setProducts([p, ...data.products]);
             }
             setEditingProduct(null);
             showSuccess('Produto salvo com sucesso!');
          }} 
          onClose={() => setEditingProduct(null)} 
        />
      )}

      {productToShare && (
        <ProductShareModal product={productToShare} onClose={() => setProductToShare(null)} />
      )}
    </div>
  );
}

const ProductEditor = ({ product, onSave, onClose }: { product: Product, onSave: (p: Product) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState<Product>(product);

  React.useEffect(() => {
     try {
       localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(formData));
     } catch(e) {}
  }, [formData]);

  const handleSaveWrapper = () => {
     onSave(formData);
     localStorage.removeItem(LOCAL_DRAFT_KEY);
  };

  const handleClose = () => {
     localStorage.removeItem(LOCAL_DRAFT_KEY);
     onClose();
  };

  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'local'>('url');
  const [sizeInput, setSizeInput] = useState('');
  const [showGalleryUrl, setShowGalleryUrl] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  
  const handleAddSize = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e || e.key === 'Enter' || e.key === ',') {
      if (e) e.preventDefault();
      const val = sizeInput.trim();
      if (val && !formData.sizes?.includes(val)) {
        setFormData({ ...formData, sizes: [...(formData.sizes || []), val] });
        setSizeInput('');
      }
    }
  };

  const removeSize = (idx: number) => {
    setFormData({ ...formData, sizes: formData.sizes?.filter((_, i) => i !== idx) });
  };
  
  const formatPriceMask = (value: string) => {
    let cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    cleanValue = (Number(cleanValue) / 100).toFixed(2);
    return cleanValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const calculateDiscount = () => {
     if(!formData.originalPrice || !formData.price) return;
     const orig = parseFloat(formData.originalPrice.replace(/\./g, '').replace(',', '.'));
     const current = parseFloat(formData.price.replace(/\./g, '').replace(',', '.'));
     if(orig > current && current > 0) {
        const perc = Math.round(((orig - current) / orig) * 100);
        setFormData({ ...formData, tag: `${perc}% OFF` });
     }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newGallery = [...(formData.gallery || [])];
      let loadedCount = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newGallery.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setFormData({ ...formData, gallery: newGallery });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery.splice(idx, 1);
    setFormData({ ...formData, gallery: newGallery });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#0F172A]/80 backdrop-blur-md animate-fade-in" onClick={handleClose}>
      <div className="w-full max-w-[1300px] h-full bg-white shadow-2xl overflow-hidden flex md:flex-row flex-col animate-slide-in-right" onClick={e => e.stopPropagation()}>
        
        {/* Form Layer */}
        <div className="flex-1 h-full bg-white overflow-y-auto flex flex-col relative z-20">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col justify-between items-start gap-2 bg-white/95 backdrop-blur-md sticky top-0 z-30">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] tracking-tight">{product.name ? 'Editar Produto' : 'Novo Produto'}</h2>
              <p className="text-sm text-gray-500 mt-1">Configure detalhes e variações com preview em tempo real ao lado.</p>
            </div>
            
            {/* Mobile Actions Only */}
            <div className="xl:hidden flex gap-3 w-full mt-2">
              <button onClick={handleClose} className="flex-1 py-2.5 font-bold text-gray-600 bg-gray-100 rounded-xl transition-colors text-sm">Cancelar</button>
              <button onClick={handleSaveWrapper} className="flex-[2] py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all text-sm">Salvar</button>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-8 flex-1">
            {/* Informações Básicas */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest">Informações Básicas</h3>
                </div>
                
                <div className="relative bg-gray-100/50 backdrop-blur-md p-1.5 rounded-[14px] flex items-center w-full sm:w-auto border border-gray-200/50">
                  <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 transition-all duration-400 ease-out z-0 ${!formData.hasVariations ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`} />
                  
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, hasVariations: false })}
                    className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${!formData.hasVariations ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Box className={`w-3.5 h-3.5 transition-transform duration-300 ${!formData.hasVariations ? 'scale-110' : 'scale-100 opacity-60'}`} />
                    Produto Único
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, hasVariations: true })}
                    className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-[10px] text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${formData.hasVariations ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Layers className={`w-3.5 h-3.5 transition-transform duration-300 ${formData.hasVariations ? 'scale-110' : 'scale-100 opacity-60'}`} />
                    Com Variações
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Nome do Produto *</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" placeholder="Ex: Sofá Retrátil Istambul" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Categoria *</label>
                  <select value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none transition-colors text-[13px] font-medium">
                    <option value="">Selecione...</option>
                    <option value="Estofados">Estofados</option>
                    <option value="Móveis de Madeira">Móveis de Madeira</option>
                    <option value="Camas">Camas e Cabeceiras</option>
                    <option value="Colchões">Colchões</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">SKU / Código</label>
                  <input type="text" value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" placeholder="Ex: MVD-001" />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Descrição Detalhada do Produto</label>
                  <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none transition-colors text-[13px]" placeholder="Conte a história do produto, materiais premium usados, conforto..."></textarea>
                </div>
              </div>
            </section>

            {/* Imagem */}
            <section className="space-y-6">
               <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-2">Mídia Principal & Galeria</h3>
               <div className="flex flex-col gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                 
                 {/* Image Principal */}
                 <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                   <div className="w-36 h-36 rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group bg-gray-50 border-dashed border-gray-200">
                     {formData.image ? (
                       <>
                         <img src={formData.image} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => setFormData({ ...formData, image: '' })} className="text-white text-[11px] font-bold bg-black/80 px-3 py-1.5 rounded-lg">Remover</button>
                         </div>
                       </>
                     ) : (
                       <div className="flex flex-col items-center">
                         <ImageIcon className="w-8 h-8 text-gray-300" />
                         <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Capa</span>
                       </div>
                     )}
                   </div>
                   <div className="flex-1 space-y-4 w-full">
                     <div className="flex gap-4 border-b border-gray-100 pb-1.5">
                        <span className="text-xs font-bold pb-2 text-[#0F172A] uppercase tracking-widest block">Imagem de Capa</span>
                     </div>
                     
                     <div className="flex flex-col gap-3">
                        <label className="w-full flex flex-col items-center justify-center px-4 py-4 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-colors">
                              <Plus className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-[#0F172A] font-bold">Selecionar Capa Físico...</p>
                              <p className="text-[10px] text-gray-400">JPG, PNG ou WEBP até 3MB</p>
                            </div>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleLocalImageUpload} />
                        </label>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">OU URL:</span>
                           <input 
                             type="text" 
                             value={formData.image || ''} 
                             onChange={e => setFormData({ ...formData, image: e.target.value })}
                             placeholder="Ex: https://imagens.loja.com/sofa.jpg"
                             className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-blue text-[12px]"
                           />
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Galeria Secundária */}
                 <div className="border-t border-gray-100 pt-6">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h4 className="text-[12px] font-bold text-[#0F172A] uppercase tracking-widest">Galeria de Imagens</h4>
                       <p className="text-[11px] text-gray-500 mt-0.5">Adicione fotos extras para o slider (Máx: 4)</p>
                     </div>
                     <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Adicionar Fotos
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                     </label>
                   </div>
                   
                   <div className="flex flex-wrap gap-4">
                     {formData.gallery?.map((img, idx) => (
                        <div key={idx} className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden relative group shadow-sm">
                           <img src={img} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <button type="button" onClick={() => handleRemoveGalleryImage(idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                                <X className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     ))}
                     
                     {/* URL Input Dropdown like for Gallery */}
                     {!showGalleryUrl ? (
                         <div className="w-24 h-24 border border-dashed border-gray-300 rounded-xl flex flex-col relative group cursor-pointer hover:bg-gray-50 transition-colors shrink-0" onClick={() => setShowGalleryUrl(true)}>
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                               <Plus className="w-5 h-5 text-gray-400 mb-1 group-hover:text-brand-blue transition-colors" />
                               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-blue">Add URL</span>
                             </div>
                         </div>
                     ) : (
                         <div className="w-56 h-24 border border-gray-200 bg-gray-50 rounded-xl flex flex-col items-center justify-center p-3 relative shrink-0 shadow-inner">
                            <input 
                              type="text"
                              value={galleryUrlInput}
                              onChange={e => setGalleryUrlInput(e.target.value)}
                              placeholder="Cole o link da imagem..."
                              className="w-full px-3 py-2 text-[11px] font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue mb-2 shadow-sm"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter' && galleryUrlInput.trim()) {
                                  setFormData({...formData, gallery: [...(formData.gallery || []), galleryUrlInput.trim()]});
                                  setGalleryUrlInput('');
                                  setShowGalleryUrl(false);
                                } else if (e.key === 'Escape') {
                                  setShowGalleryUrl(false);
                                  setGalleryUrlInput('');
                                }
                              }}
                            />
                            <div className="flex w-full gap-2 mt-auto">
                              <button type="button" onClick={() => { setShowGalleryUrl(false); setGalleryUrlInput(''); }} className="flex-[0.7] py-1.5 text-[9px] font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-md transition-colors uppercase tracking-wider">Cancelar</button>
                              <button type="button" onClick={() => {
                                if (galleryUrlInput.trim()) {
                                  setFormData({...formData, gallery: [...(formData.gallery || []), galleryUrlInput.trim()]});
                                  setGalleryUrlInput('');
                                  setShowGalleryUrl(false);
                                }
                              }} className="flex-1 py-1.5 text-[9px] font-bold text-white bg-[#0F172A] hover:bg-brand-blue rounded-md transition-colors uppercase tracking-widest shadow-sm">Adicionar</button>
                            </div>
                         </div>
                     )}
                   </div>
                 </div>

               </div>
            </section>

            {/* Pricing */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-2">Preço e Estoque Base</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">R$ Original (De)</label>
                  <input type="text" value={formData.originalPrice || ''} onChange={e => setFormData({ ...formData, originalPrice: formatPriceMask(e.target.value) })} onBlur={calculateDiscount} placeholder="Ex: 5.000,00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-blue uppercase tracking-widest block mb-1.5">R$ Venda (Por) *</label>
                  <input type="text" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: formatPriceMask(e.target.value) })} onBlur={calculateDiscount} placeholder="Ex: 3.500,00" className="w-full px-4 py-3 bg-blue-50/30 border border-brand-blue/30 shadow-inner rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold text-[#0F172A] transition-colors text-[13px]" />
                </div>

                <div>
                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Estoque Disponível</label>
                   <input type="number" min="0" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />
                </div>
              </div>
            </section>

            {/* Dimensões Base */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Box className="w-4 h-4 text-brand-blue" />
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest">Dimensões e Entrega (Padrão)</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                   <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Compr. (m)</label>
                   <input type="text" value={formData.length || ''} onChange={e => setFormData({ ...formData, length: e.target.value })} placeholder="Ex: 2.15" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px]" />
                </div>
                <div>
                   <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Largura (m)</label>
                   <input type="text" value={formData.width || ''} onChange={e => setFormData({ ...formData, width: e.target.value })} placeholder="Ex: 0.90" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px]" />
                </div>
                <div>
                   <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Altura (m)</label>
                   <input type="text" value={formData.height || ''} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="Ex: 1.05" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px]" />
                </div>
                <div>
                   <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Peso (kg)</label>
                   <input type="text" value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="Ex: 45" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px]" />
                </div>
              </div>
            </section>

            {/* Marketing & Tags */}
            <section className="space-y-6">
               <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-2">Variações e Opções</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="space-y-6">
                     <div>
                       <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{formData.hasVariations ? 'Tamanhos Disponíveis' : 'Tamanho (Opcional)'}</label>
                       <div className="space-y-3">
                         {(!formData.sizes || formData.sizes.length === 0 || formData.hasVariations) && (
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={sizeInput} 
                               onChange={e => setSizeInput(e.target.value)} 
                               onKeyDown={handleAddSize}
                               placeholder={formData.hasVariations ? "Ex: 2.10m, P, M, G" : "Ex: Tamanho Único ou P"} 
                               className="flex-1 px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px]" 
                             />
                             <button 
                               type="button" 
                               onClick={() => handleAddSize()} 
                               className="px-5 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                             >
                               Adicionar
                             </button>
                           </div>
                         )}
                         {formData.sizes && formData.sizes.length > 0 && (
                           <div className="flex flex-wrap gap-2">
                             {formData.sizes.map((s, i) => (
                               <span key={i} className="flex items-center gap-1.5 text-xs font-bold border border-gray-200 text-gray-700 bg-gray-50 pl-3 pr-1 py-1 rounded-full shadow-sm">
                                 {s}
                                 <button type="button" onClick={() => removeSize(i)} className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                   <X className="w-3.5 h-3.5" />
                                 </button>
                               </span>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>
                  </div>

                  <div>
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Etiqueta Promocional (Destaque)</label>
                     <div className="flex gap-3">
                       <input type="text" value={formData.tag || ''} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="Ex: 30% OFF" className="flex-1 px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors uppercase tracking-widest font-bold text-[13px]" />
                       <div className="w-20 shrink-0 flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-xl items-center px-2 py-0.5 shadow-sm">
                         <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Cor Ativa</label>
                         <div className="flex items-center justify-center w-full">
                           <input type="color" value={formData.tagColor || '#1E293B'} onChange={e => setFormData({ ...formData, tagColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 p-0 shadow-sm bg-transparent" />
                         </div>
                       </div>
                     </div>
                     {formData.tag && (
                       <div className="mt-3 bg-[#F8FAFC] border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Preview na<br/>Vitrine</span>
                         <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.15em] px-2.5 md:px-3 py-1.5 md:py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm z-10 transition-transform duration-300 hover:scale-105" style={{ backgroundColor: formData.tagColor || '#1E293B', color: '#FFF' }}>
                           {formData.tag}
                         </span>
                       </div>
                     )}
                  </div>

                  <div className="lg:col-span-2">
                     <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Tags Principais (Separadas por vírgula)</label>
                        <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Premium Feature</span>
                     </div>
                     <input type="text" value={formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="lançamento, inverno, premium" className="w-full px-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-[13px] font-medium" />
                     {formData.tags && (
                       <div className="flex flex-wrap gap-2 mt-3 animate-fade-in-up">
                         {formData.tags.split(',').filter(t => t.trim()).map((t, i) => (
                           <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8FAFC] border border-gray-200 text-[#0F172A] text-[11px] font-bold rounded-lg shadow-sm">
                              #{t.trim()}
                           </span>
                         ))}
                       </div>
                     )}
                  
                  </div>
               </div>

               <div>
                  <label className="text-[11px] font-bold text-[#0F172A] uppercase tracking-widest block mb-3 border-b-2 border-brand-blue pb-1 w-fit">{formData.hasVariations ? 'Gerenciador de Variações Avançado' : 'Detalhes Avançados da Cor Base'}</label>
                  <div className="bg-gray-50/30 p-2 sm:p-5 rounded-3xl border border-gray-200 shadow-sm">
                    <ColorsManager 
                      colors={formData.colors || []} 
                      onChange={colors => setFormData({ ...formData, colors: !formData.hasVariations && colors.length > 1 ? [colors[colors.length - 1]] : colors })}
                      isSingle={!formData.hasVariations}
                    />
                  </div>
               </div>
            </section>
            
            <section className="space-y-4 pt-4 border-t border-gray-200">
               <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                 <div>
                   <h4 className="font-bold text-[#0F172A] text-[13px]">Visibilidade do Produto</h4>
                   <p className="text-[11px] text-gray-500 mt-1">Status na vitrine do seu site.</p>
                 </div>
                 <button type="button" onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'draft' : 'active' })} className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer ${formData.status === 'active' ? 'bg-[#0F172A] justify-end' : 'bg-gray-200 border border-gray-300 justify-start'}`}>
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
                 </button>
               </div>
               
               <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                 <div>
                   <h4 className="font-bold text-[#0F172A] text-[13px]">Exibir Preço Público</h4>
                   <p className="text-[11px] text-gray-500 mt-1">Mostre um botão "Consulte o Preço" se inativo.</p>
                 </div>
                 <button type="button" onClick={() => setFormData({ ...formData, showPrice: !formData.showPrice })} className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer ${formData.showPrice !== false ? 'bg-[#0F172A] justify-end' : 'bg-gray-200 border border-gray-300 justify-start'}`}>
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
                 </button>
               </div>

               <div className="flex items-center justify-between bg-white shadow-sm p-5 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                 <div>
                   <h4 className="font-bold text-[#0F172A] text-[13px] flex items-center gap-2">
                     Exibir Estoque Público
                     <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-bold uppercase tracking-widest hidden lg:inline-block">Premium</span>
                   </h4>
                   <p className="text-[11px] text-gray-500 mt-1">Mostra a quantidade em estoque na página do produto.</p>
                 </div>
                 <button type="button" onClick={() => setFormData({ ...formData, showStock: !formData.showStock })} className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer ${formData.showStock ? 'bg-[#0F172A] justify-end' : 'bg-gray-200 border border-gray-300 justify-start'}`}>
                    <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
                 </button>
               </div>
            </section>
          </div>

          {/* Navite Toolbar Bottom */}
          <div className="xl:flex hidden p-5 sm:p-6 border-t border-gray-200 bg-white sticky bottom-0 z-20 justify-end gap-3 px-8">
            <button onClick={handleClose} className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancelar</button>
            <button onClick={handleSaveWrapper} className="px-8 py-2.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Live Preview Layer (Cherry on Top) */}
        <div className="hidden xl:flex w-[450px] bg-[#f8fafc] border-l border-gray-200 flex-col h-full z-10">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2"><ToggleRight className="w-5 h-5 text-brand-blue" /> Live Preview Móvel</h3>
              <p className="text-[11px] text-gray-500">Visualização em tempo real do cartão</p>
            </div>
            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 block animate-pulse"></span>Online</div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center relative">
             {/* Mock de um Smartphone Outline para envolver o card e ficar muito premium */}
             <div className="w-[320px] bg-white rounded-[40px] shadow-2xl border-[8px] border-[#0F172A] relative overflow-hidden shrink-0 mt-8">
                {/* Notch Mobile */}
                <div className="absolute top-0 inset-x-0 h-6 bg-[#0F172A] rounded-b-2xl mx-auto w-32 z-[60]" />
                <div className="pt-8 pb-4 bg-gray-50 h-full min-h-[600px]">
                   <div className="px-4">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">Como seu cliente verá. ↓</p>
                     
                     {/* Replica simplificada mas fiel do ProductCard.tsx */}
                     <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 relative group flex flex-col">
                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden shrink-0 group-hover:bg-gray-200 transition-colors">
                           {formData.image ? (
                             <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                               <ImageIcon className="w-12 h-12" />
                             </div>
                           )}
                           {formData.tag && (
                             <span className="absolute top-3 left-3 text-[9px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm z-20" style={{ backgroundColor: formData.tagColor || '#1E293B' }}>
                               {formData.tag}
                             </span>
                           )}
                        </div>

                        <div className="p-4 flex flex-col flex-1 relative bg-white">
                           {formData.colors && formData.colors.length > 0 && formData.hasVariations && (
                              <div className="absolute -top-3.5 right-3 flex justify-end">
                                <div className="bg-white p-1 rounded-full shadow-sm flex items-center gap-1 border border-gray-50/50">
                                   {formData.colors.slice(0, 3).map((col, idx) => (
                                     <div key={idx} className="w-5 h-5 rounded-full border border-gray-200/60 shadow-sm" style={{ backgroundColor: col.hex, backgroundImage: col.texture ? `url(${col.texture})` : undefined, backgroundSize: 'cover' }} />
                                   ))}
                                   {formData.colors.length > 3 && (
                                     <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 text-[8px] font-bold flex items-center justify-center text-gray-500">
                                        +{formData.colors.length - 3}
                                     </div>
                                   )}
                                </div>
                              </div>
                           )}
                           
                           <h3 className="font-bold text-[#0F172A] text-sm leading-tight group-hover:text-brand-blue transition-colors clamp-2 break-words max-w-full">
                             {formData.name || 'Nome do Produto'}
                           </h3>
                           <p className="text-[10px] text-gray-400 mt-1">{formData.category || 'Categoria'}</p>

                           <div className="mt-4 flex items-center justify-between">
                              <div className="flex flex-col">
                                {formData.showPrice !== false ? (
                                  <>
                                    <span className="font-bold text-[#0F172A] text-lg">R$ {formData.price || '0,00'}</span>
                                    {formData.originalPrice && formData.price !== formData.originalPrice && (
                                      <span className="text-xs text-brand-blue/60 line-through font-medium -mt-1 block">R$ {formData.originalPrice}</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="font-bold text-brand-blue uppercase text-xs tracking-wider bg-blue-50 px-2 py-1 rounded">Consulte Preço</span>
                                )}
                              </div>
                           </div>
                        </div>
                     </div>

                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ProductShareModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const [copying, setCopying] = useState(false);
  const shareUrl = `${window.location.origin}/produto/${product.id}`;
  
  const textMsg = `✨ *NÃO PERCA ESSA OFERTA!* ✨\n\n🛋️ *Produto:* ${product.name}\n🏷️ *Categoria:* ${product.category}\n💰 *Preço Especial:* R$ ${product.price}\n\n🔗 *Compre agora mesmo:*\n${shareUrl}\n\nEuroOferta - A sua loja de móveis!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textMsg);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  const handleNativeShare = async () => {
    try {
      let filesArray: File[] | undefined = undefined;
      
      if (product.image && product.image.startsWith('data:image/')) {
        const res = await fetch(product.image);
        const blob = await res.blob();
        const file = new File([blob], `oferta-${product.name.replace(/\s+/g, '-').toLowerCase()}.jpg`, { type: 'image/jpeg' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          filesArray = [file];
        }
      }

      await navigator.share({
        title: `Oferta: ${product.name}`,
        text: textMsg,
        ...(filesArray ? { files: filesArray } : {})
      });
    } catch (err) {
      console.log('User cancelled share or API error', err);
    }
  };

  const downloadImage = () => {
    if(!product.image) return;
    const a = document.createElement('a');
    a.href = product.image;
    a.download = `oferta-${product.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between mb-4">
             <h3 className="font-bold text-xl text-[#0F172A] tracking-tight">Compartilhar</h3>
             <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors"><X className="w-4 h-4" /></button>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex gap-4 items-center mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative group">
               {product.image ? (
                 <>
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                   <button onClick={downloadImage} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Baixar Imagem">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                   </button>
                 </>
               ) : (
                 <ImageIcon className="w-6 h-6 text-gray-400 m-auto mt-5" />
               )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[13px] text-[#0F172A] leading-tight truncate">{product.name}</h4>
              <span className="text-gray-500 text-xs mt-0.5 block">{product.category}</span>
              <span className="font-bold text-brand-blue text-sm mt-1 block">R$ {product.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
             <button onClick={handleWhatsApp} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                   <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-center">WhatsApp</span>
             </button>
             <button onClick={handleNativeShare} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white text-gray-700 border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-center">App Share</span>
             </button>
             <button onClick={handleCopy} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-brand-blue transition-colors group">
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${copying ? 'bg-emerald-500' : 'bg-brand-blue'}`}>
                   {copying ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-center pt-0.5">{copying ? 'Copiado' : 'Texto'}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};