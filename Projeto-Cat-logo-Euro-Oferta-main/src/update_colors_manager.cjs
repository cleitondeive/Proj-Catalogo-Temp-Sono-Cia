const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

const regexImageBlock = /<label className="text-\[11px\] font-bold text-gray-600 block mb-1">Imagem Principal da Variação<\/label>[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Bloco 4: Descrição e Dimensões Avançadas \*\/)/;

const replacementImageBlock = `<label className="text-[11px] font-bold text-gray-600 block mb-1">Imagem Principal da Variação</label>
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
                      </div>`;

if(code.match(regexImageBlock)) {
    code = code.replace(regexImageBlock, replacementImageBlock);
    fs.writeFileSync('src/admin/pages/ColorsManager.tsx', code);
    console.log("Replaced Image Block in ColorsManager");
} else {
    console.log("Image Block regex not found");
}
