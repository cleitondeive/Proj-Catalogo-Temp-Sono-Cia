import React, { useState } from 'react';
import { ProductColorOption } from '../../types';
import { Plus, X, Image as ImageIcon, ChevronDown, ChevronUp, Palette, Tag, Box, Layers, Columns } from 'lucide-react';

interface Props {
  colors: ProductColorOption[];
  onChange: (colors: ProductColorOption[]) => void;
  isSingle?: boolean;
}

const formatPriceMask = (value: string) => {
  let cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  cleanValue = (Number(cleanValue) / 100).toFixed(2);
  return cleanValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ColorsManager({ colors, onChange, isSingle = false }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(colors.length === 1 ? 0 : null);
  
  const handleAddNew = () => {
    const newColor: ProductColorOption = { name: '', hex: '#000000', image: '', texture: '', price: '', originalPrice: '', description: '', length: '', width: '', height: '', tags: '' };
    onChange([...colors, newColor]);
    setEditingIdx(colors.length);
  };

  const updateColorFields = (idx: number, updates: Partial<ProductColorOption>) => {
    const newColors = [...colors];
    const updatedItem = { ...newColors[idx], ...updates };
    if (updates.price !== undefined) {
       updatedItem.price = formatPriceMask(updates.price);
    }
    if (updates.originalPrice !== undefined) {
       updatedItem.originalPrice = formatPriceMask(updates.originalPrice);
    }
    newColors[idx] = updatedItem;
    onChange(newColors);
  };

  const updateColor = (idx: number, field: keyof ProductColorOption, value: any) => {
    updateColorFields(idx, { [field]: value });
  };

  const handleRemove = (idx: number) => {
    onChange(colors.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
    else if (editingIdx !== null && editingIdx > idx) setEditingIdx(editingIdx - 1);
  };

  const handleLocalImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>, isTexture: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isTexture) {
          updateColorFields(idx, { texture: reader.result as string, hex: '#FFFFFF' });
        } else {
          updateColor(idx, 'image', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalGalleryUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newGallery = [...(colors[idx].gallery || [])];
      let loadedCount = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newGallery.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            updateColor(idx, 'gallery', newGallery as any);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="space-y-4">
      {colors.length === 0 && (
         <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 border border-gray-200 border-dashed rounded-2xl">
           <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
             <Palette className="w-6 h-6 text-brand-blue" />
           </div>
           <p className="text-sm font-bold text-[#0F172A]">{isSingle ? 'Definir Atributos Básicos' : 'Nenhuma Variação Adicionada'}</p>
           <p className="text-[11px] text-gray-500 mt-1 max-w-xs text-center">{isSingle ? 'Preencha dados específicos de cor, tamanho e dimensão.' : 'Comece adicionando a primeira cor ou variação do seu produto.'}</p>
           <button type="button" onClick={handleAddNew} className="mt-4 bg-[#0F172A] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-black transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> {isSingle ? 'Adicionar Detalhes' : 'Criar Variação'}
           </button>
         </div>
      )}

      <div className="space-y-3">
        {colors.map((c, i) => {
          const isEditing = editingIdx === i;
          
          return (
            <div key={i} className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${isEditing ? 'border-brand-blue shadow-[0_12px_32px_rgba(1,82,148,0.1)]' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}>
              
              {/* Header Simplificado (Sempre visível exceto quando é a única e tá editando?) Melhor mostrar sempre. */}
              <div 
                className={`flex gap-4 items-center p-4 cursor-pointer select-none transition-colors ${isEditing ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
                onClick={() => setEditingIdx(isEditing ? null : i)}
              >
                 <div className="w-10 h-10 rounded-full border border-gray-200 shadow-inner flex items-center justify-center shrink-0 relative overflow-hidden" 
                      style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                   {!c.name && !c.hex && <Palette className="w-4 h-4 text-gray-300" />}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-[#0F172A] text-sm truncate">{c.name || 'Nova Variação'}</h4>
                   <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-[11px] text-gray-500">{c.price ? `R$ ${c.price}` : 'Preço Padrão'}</span>
                     {c.tags && (
                        <span className="text-[9px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate max-w-[120px]">{c.tags.split(',')[0]}</span>
                     )}
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2 ml-auto">
                   <button type="button" onClick={(e) => { e.stopPropagation(); handleRemove(i); }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                   <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isEditing ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                     {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                   </div>
                 </div>
              </div>

              {/* Form Expanded Area */}
              {isEditing && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/30 space-y-6 animate-fade-in">
                  
                  {/* Bloco 1: Identidade */}
                  <div className="space-y-4">
                    <h5 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Palette className="w-3.5 h-3.5" /> APARÊNCIA & IDENTIFICAÇÃO</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Nome da Cor / Estilo *</label>
                        <input type="text" value={c.name} onChange={e => updateColor(i, 'name', e.target.value)} placeholder="Ex: Branco Premium" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-brand-blue outline-none" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Cor Base (Hexadecimal)</label>
                        <div className="flex items-center gap-2 relative">
                          <input type="color" value={c.hex || '#000000'} onChange={e => { updateColorFields(i, { hex: e.target.value, texture: '' }); }} className="w-10 h-10 rounded-xl shrink-0 cursor-pointer border-0 p-0 shadow-sm" />
                          <input type="text" value={(c.hex || '').toUpperCase()} onChange={e => { updateColorFields(i, { hex: e.target.value, texture: '' }); }} className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-600 font-bold uppercase focus:ring-2 focus:ring-brand-blue outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloco 2: Preços */}
                  {!isSingle && (
                    <div className="space-y-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <h5 className="flex items-center gap-2 text-[10px] font-bold text-brand-blue uppercase tracking-widest"><Tag className="w-3.5 h-3.5" /> PRECIFICAÇÃO EXCLUSIVA DA VARIAÇÃO</h5>
                      <p className="text-[11px] text-gray-500 mb-2">Preencha apenas se esta variação tiver um preço diferente do produto principal.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Preço Original De (R$)</label>
                          <input type="text" value={c.originalPrice || ''} onChange={e => updateColor(i, 'originalPrice', e.target.value)} placeholder="Opcional. Ex: 1.500,00" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-brand-blue outline-none" />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Preço Promocional Por (R$)</label>
                          <input type="text" value={c.price || ''} onChange={e => updateColor(i, 'price', e.target.value)} placeholder="Opcional. Ex: 1.200,00" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-[13px] font-bold text-[#0F172A] focus:ring-2 focus:ring-brand-blue outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bloco 3: Imagens e Texturas */}
                  <div className="space-y-4">
                    <h5 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><ImageIcon className="w-3.5 h-3.5" /> FOTOS & TEXTURAS ESPECÍFICAS</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Textura */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="text-[11px] font-bold text-gray-600 block mb-2">Aplicar Textura (Madeira, Tecido...)</label>
                        {!c.texture ? (
                          <div className="flex flex-col gap-2">
                             <input type="text" value={c.texture || ''} onChange={(e) => updateColorFields(i, { texture: e.target.value, hex: '#FFFFFF' })} placeholder="URL da textura (opcional)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-xs" />
                             <div className="relative">
                               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                               <div className="relative flex justify-center text-[10px]"><span className="bg-white px-2 text-gray-400">ou</span></div>
                             </div>
                             <label className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                               <Layers className="w-4 h-4 text-gray-400 mb-0.5"/>
                               <span className="text-[10px] text-gray-500 font-bold">Upload Textura</span>
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLocalImageUpload(i, e, true)} />
                             </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                             <div className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm shrink-0" style={{ backgroundImage: `url(${c.texture})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                             <div className="flex flex-col gap-1.5 w-full min-w-0">
                               <input type="text" value={c.texture} onChange={(e) => updateColorFields(i, { texture: e.target.value, hex: '#FFFFFF' })} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="URL da textura" />
                               <button type="button" onClick={() => updateColorFields(i, { texture: '', hex: '#000000' })} className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg transition-colors inline-block w-fit">Remover Textura</button>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Imagem do Produto Específica */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">Imagem Principal da Variação</label>
                        <p className="text-[10px] text-gray-400 mb-2">Pode ser URL ou Upload. Se vazio, usa a imagem padrão do produto.</p>
                        {!c.image ? (
                          <div className="flex flex-col gap-2">
                             <input type="text" value={c.image || ''} onChange={(e) => updateColor(i, 'image', e.target.value)} placeholder="https://exemplo.com/foto.jpg" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-xs" />
                             <div className="relative">
                               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                               <div className="relative flex justify-center text-[10px]"><span className="bg-white px-2 text-gray-400">ou</span></div>
                             </div>
                             <label className="flex flex-col items-center justify-center p-3 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                               <ImageIcon className="w-4 h-4 text-gray-400 mb-0.5"/>
                               <span className="text-[10px] text-gray-500 font-bold">Fazer Upload</span>
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLocalImageUpload(i, e, false)} />
                             </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                             <img src={c.image} className="w-14 h-14 rounded-xl border border-gray-200 shadow-sm object-cover" />
                             <div className="flex flex-col gap-1.5 w-full min-w-0">
                               <input type="text" value={c.image} onChange={(e) => updateColor(i, 'image', e.target.value)} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs" placeholder="URL da imagem" />
                               <button type="button" onClick={() => updateColor(i, 'image', '')} className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg transition-colors inline-block w-fit">Remover Imagem</button>
                             </div>
                          </div>
                        )}
                      </div>

                      {/* Galeria da Variação */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-4 col-span-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">Galeria Específica da Variação</label>
                        <p className="text-[10px] text-gray-400 mb-3">Imagens adicionais exclusivas desta variação. Estas serão mostradas quando o usuário selecionar esta cor.</p>
                        
                        <div className="flex flex-col gap-3">
                           {/* Add by URL logic */}
                           <div className="flex items-center gap-2">
                             <input 
                               type="text"
                               placeholder="Adicionar por URL (ex: https://site.com/foto.jpg) e pressione Enter..."
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   const val = (e.target as HTMLInputElement).value.trim();
                                   if (val) {
                                     const newGallery = [...(c.gallery || []), val];
                                     updateColor(i, 'gallery', newGallery);
                                     (e.target as HTMLInputElement).value = '';
                                   }
                                   e.preventDefault();
                                 }
                               }}
                               className="flex-[3] px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-xs"
                             />
                             <div className="text-[10px] font-bold text-gray-300">ou</div>
                             <label className="flex-1 py-2 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors text-[10px] text-gray-500 font-bold whitespace-nowrap px-2">
                               Upload Local
                               <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleLocalGalleryUpload(i, e)} />
                             </label>
                           </div>

                           {/* Existing gallery preview */}
                           {(c.gallery && c.gallery.length > 0) && (
                             <div className="flex flex-wrap gap-2 mt-2">
                               {c.gallery.map((img: string, idx: number) => (
                                 <div key={idx} className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden relative group shadow-sm bg-gray-50">
                                   <img src={img} className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                      <button type="button" onClick={() => {
                                        const newGallery = [...(c.gallery || [])];
                                        newGallery.splice(idx, 1);
                                        updateColor(i, 'gallery', newGallery);
                                      }} className="p-1 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                                        <X className="w-3 h-3" />
                                      </button>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Bloco 4: Descrição e Dimensões Avançadas */}
                  <div className="space-y-4 pt-2 border-t border-gray-200/50">
                    <h5 className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><Columns className="w-3.5 h-3.5" /> DETALHES AVANÇADOS</h5>
                    
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div>
                         <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Descrição Específica da Variação (Opcional)</label>
                         <textarea rows={2} value={c.description || ''} onChange={e => updateColor(i, 'description', e.target.value)} placeholder="Ex: Este modelo branco possui acabamento em laca premium..." className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-[12px] focus:ring-2 focus:ring-brand-blue outline-none resize-none" />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Comprimento (m)</label>
                          <input type="text" value={c.length || ''} onChange={e => updateColor(i, 'length', e.target.value)} placeholder="1.20" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Largura (m)</label>
                          <input type="text" value={c.width || ''} onChange={e => updateColor(i, 'width', e.target.value)} placeholder="0.80" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Altura (m)</label>
                          <input type="text" value={c.height || ''} onChange={e => updateColor(i, 'height', e.target.value)} placeholder="0.75" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Peso (kg)</label>
                          <input type="text" value={c.weight || ''} onChange={e => updateColor(i, 'weight', e.target.value)} placeholder="20.5" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none" />
                        </div>
                      </div>

                      <div>
                         <div className="flex items-center justify-between mb-1">
                           <label className="text-[10px] font-bold text-gray-500 block">Tags Específicas da Variação</label>
                         </div>
                         <input type="text" value={c.tags || ''} onChange={e => updateColor(i, 'tags', e.target.value)} placeholder="lançamento, edição limitada..." className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:border-brand-blue outline-none transition-colors" />
                         {c.tags && (
                           <div className="flex flex-wrap gap-1.5 mt-2">
                             {c.tags.split(',').filter((t: string) => t.trim()).map((t: string, tidx: number) => (
                               <span key={tidx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider rounded">
                                  #{t.trim()}
                               </span>
                             ))}
                           </div>
                         )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )
        })}

        {colors.length > 0 && !isSingle && (
           <button type="button" onClick={handleAddNew} className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-2xl text-xs font-bold text-gray-500 hover:text-brand-blue hover:border-brand-blue/50 transition-all flex items-center justify-center gap-2">
             <Plus className="w-4 h-4" /> Adicionar Outra Variação
           </button>
        )}
      </div>
    </div>
  );
}
