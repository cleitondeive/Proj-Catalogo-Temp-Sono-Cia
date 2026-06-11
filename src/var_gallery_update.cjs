const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

const target1 = `                      {/* Imagem do Produto Específica */}
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
                    </div>
                  </div>`;

const replace1 = `                      {/* Imagem do Produto Específica */}
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
                  </div>`;

if (code.includes('Imagem Principal da Variação')) {
  code = code.replace(target1, replace1);
  console.log('Target 1 replaced.');
}

const target2 = `  const handleLocalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>, isTexture: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateColor(index, isTexture ? 'texture' : 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };`;

const replace2 = `  const handleLocalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>, isTexture: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateColor(index, isTexture ? 'texture' : 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalGalleryUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newGallery = [...(colors[index].gallery || [])];
      let loadedCount = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newGallery.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            updateColor(index, 'gallery', newGallery);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };`;

if (code.includes('target.files')) {
  code = code.replace(target2, replace2);
  console.log('Target 2 replaced.');
}

fs.writeFileSync('src/admin/pages/ColorsManager.tsx', code);
