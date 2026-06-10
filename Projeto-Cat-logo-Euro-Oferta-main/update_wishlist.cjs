const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add new state for wishlist
content = content.replace(
  'const [isZoomed, setIsZoomed] = useState(false);',
  `const [isZoomed, setIsZoomed] = useState(false);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistToast, setWishlistToast] = useState<{show: boolean, name: string}>({show: false, name: ''});
  const [currentView, setCurrentView] = useState<'home' | 'wishlist'>('home');
  
  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isHearted = wishlist.some(item => item.name === product.name);
    if (isHearted) {
      setWishlist(wishlist.filter(item => item.name !== product.name));
    } else {
      setWishlist([...wishlist, product]);
      setWishlistToast({ show: true, name: product.name });
      setTimeout(() => {
        setWishlistToast({ show: false, name: '' });
      }, 3000);
    }
  };

  const getWishlistTotal = () => {
    return wishlist.reduce((acc, item) => {
      const priceRegex = item.price.match(/[\\d.,]+/);
      if (!priceRegex) return acc;
      const priceStr = priceRegex[0].replace(/\\./g, '').replace(',', '.');
      return acc + parseFloat(priceStr);
    }, 0);
  };
`
);

// 2. Add full screen toggle support (header)
content = content.replace(
  '<Heart className="w-5 h-5 text-gray-700" />',
  `<Heart className="w-5 h-5 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}`
);

content = content.replace(
  '<button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">',
  `<button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer" onClick={() => setCurrentView(currentView === 'wishlist' ? 'home' : 'wishlist')}>`
);
content = content.replace(
  "onClick={() => window.scrollTo({ top: 0, behavior: \"smooth\" })}",
  "onClick={(e) => { e.preventDefault(); setCurrentView('home'); window.scrollTo({ top: 0, behavior: \"smooth\" }); }}"
);
content = content.replace(
  `<h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 ml-3">
              Euro Oferta
            </h1>`,
  `<h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 ml-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              Euro Oferta
            </h1>`
);


// 3. Card wishlist toggle
// Replace standard Add to wishlist button on cards
content = content.replace(
  /<button className="w-10 h-10 rounded-full bg-white\/90 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-\[0_2px_10px_rgba\(0,0,0,0.1\)\] hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">/g,
  `<button 
    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
    onClick={(e) => toggleWishlist(product, e)}
  >`
);
// Make the Heart icon dynamic
content = content.replace(
  /<Heart className="w-\[18px\] h-\[18px\]" strokeWidth=\{2\} \/>/g,
  `<Heart className={\`w-[18px] h-[18px] \${wishlist.some(item => item.name === product.name) ? 'fill-red-500 text-red-500' : ''}\`} strokeWidth={2} />`
);

// Make the quick view modal Wishlist button dynamic
// In the Quick view modal, the product variable is 'quickViewProduct' for the current item
content = content.replace(
  /onClick=\{\(\) => setQuickViewProduct\(null\)\}\n>(\s*)<X className="w-5 h-5"\/>/g,
  `onClick={() => setQuickViewProduct(null)}\n>$1<X className="w-5 h-5"/>`
);

content = content.replace(
  /<button \n\s*className="flex-1 bg-\[\#F5F5F5\] hover:bg-gray-200 py-3 md:py-2.5 px-4 border-none rounded-\[12px\] transition-colors text-gray-500 hover:text-red-500 flex items-center justify-center gap-2 cursor-pointer max-w-\[fit-content\]"\n\s*title="Adicionar à Lista de Desejos"\n\s*>/,
  `<button 
                  className="flex-1 bg-[#F5F5F5] hover:bg-gray-200 py-3 md:py-2.5 px-4 border-none rounded-[12px] transition-colors text-gray-500 hover:text-red-500 flex items-center justify-center gap-2 cursor-pointer max-w-[fit-content]"
                  title="Adicionar à Lista de Desejos"
                  onClick={(e) => toggleWishlist(quickViewProduct, e)}
                >`
);
content = content.replace(
  /<Heart\n\s*className="w-4 h-4 md:w-\[18px\] md:h-\[18px\]"\n\s*strokeWidth=\{2\}\n\s*\/>/,
  `<Heart
                    className={\`w-4 h-4 md:w-[18px] md:h-[18px] \${wishlist.some(item => item.name === quickViewProduct?.name) ? 'fill-red-500 text-red-500' : ''}\`}
                    strokeWidth={2}
                  />`
);

// 4. Wishlist view check
// Surround the main content with currentView check
content = content.replace(
  '{/* Categorias Carousel */}',
  `{currentView === 'home' ? (
        <>
          {/* Categorias Carousel */}`
);
content = content.replace(
  '{/* Footer */}',
  `</>
      ) : (
        <div className="pt-28 pb-20 md:pt-36 md:pb-32 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
          <h2 className="text-[#1C202F] text-[36px] md:text-[48px] font-serif font-bold tracking-tight mb-12">Meus Desejos</h2>
          
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[32px] border border-gray-100">
              <Heart className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1} />
              <p className="text-gray-500 text-lg">Sua lista de desejos está vazia.</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="mt-6 px-8 py-3 bg-[#015294] text-white rounded-full font-bold hover:bg-[#013f71] transition-colors"
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
              {wishlist.map((product, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative rounded-[24px] overflow-hidden mb-5 bg-[#F5F5F5] aspect-[4/3] sm:aspect-square">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      <button 
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        onClick={(e) => toggleWishlist(product, e)}
                      >
                        <Heart className="w-[18px] h-[18px] fill-red-500 text-red-500" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#1C202F] font-bold text-[17px] md:text-[19px] mb-2 leading-snug">{product.name}</h3>
                    {product.originalPrice && (
                      <div className="text-[#94A3B8] text-sm line-through decoration-1 mb-1">R$ {product.originalPrice}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-[#1C202F] font-bold text-[20px] md:text-[22px]">R$ {product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="max-w-[800px] bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 mx-auto mt-12">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-xl text-[#1C202F] mb-1">{wishlist.length} itens</h3>
                  <p className="text-gray-500">Orçamento da Lista</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Total Estimado</p>
                  <div className="font-bold text-3xl md:text-4xl text-[#1C202F]">
                    R$ {getWishlistTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-[#708A9E] hover:bg-[#5A7285] text-white py-5 rounded-[12px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-3 text-sm"
                onClick={() => {
                  const text = \`Olá! Gostaria de um orçamento para os seguintes itens da minha lista de desejos:\\n\\n\` + wishlist.map(p => \`- \${p.name} (R$ \${p.price})\`).join('\\n') + \`\\n\\nTotal estimado: R$ \${getWishlistTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
                  window.open(\`https://wa.me/5511999999999?text=\${encodeURIComponent(text)}\`, '_blank');
                }}
              >
                Solicitar Orçamento
                <MessageCircle className="w-5 h-5" />
              </button>
              <p className="text-center text-gray-400 text-sm mt-6">
                A nossa equipa enviará os detalhes de disponibilidade e condições especiais via WhatsApp.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}`
);

// 5. Add Toast
content = content.replace(
  'return (',
  `return (
    <>
      {wishlistToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-[#1C202F] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-fade-in-down">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-sm font-medium">
            <span className="font-bold">{wishlistToast.name}</span> guardado nos favoritos! ❤️
          </p>
        </div>
      )}
`
);
content = content.replace(
  /export default function App\(\) \{\n/,
  `export default function App() {\n`
);
// We need to close the empty tag at the end
let endIdx = content.lastIndexOf('</div>\n  );\n}');
if (endIdx > -1) {
  content = content.slice(0, endIdx) + '</div>\n    </>\n  );\n}'
}

// 6. Fix Footer Icons
content = content.replace(
  '<div className="w-5 h-5 bg-white/80 rounded-[4px]" aria-label="Instagram"></div>',
  '<Instagram className="w-5 h-5 text-white/80" />'
);
content = content.replace(
  '<div className="w-5 h-5 bg-white/80 rounded-[4px]" aria-label="Facebook"></div>',
  '<Facebook className="w-5 h-5 text-white/80" />'
);
content = content.replace(
  '<div className="w-5 h-5 bg-white/80 rounded-[4px]" aria-label="Pinterest"></div>',
  '<Smartphone className="w-5 h-5 text-white/80" />'
);
content = content.replace(
  '<div className="h-6 w-10 bg-white/80 rounded" title="Visa"></div>',
  '<div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Visa">VISA</div>'
);
content = content.replace(
  '<div className="h-6 w-10 bg-white/80 rounded" title="Mastercard"></div>',
  '<div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Mastercard">MASTERCARD</div>'
);
content = content.replace(
  '<div className="h-6 w-10 bg-white/80 rounded" title="Amex"></div>',
  '<div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Amex">AMEX</div>'
);
content = content.replace(
  '<div className="h-6 w-10 bg-white/80 rounded" title="Pix"></div>',
  '<div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Pix">PIX</div>'
);

// 7. Missing Imports
// We need CheckCircle2
content = content.replace(/Instagram,/g, 'Instagram,\n  CheckCircle2,');

fs.writeFileSync('src/App.tsx', content);
