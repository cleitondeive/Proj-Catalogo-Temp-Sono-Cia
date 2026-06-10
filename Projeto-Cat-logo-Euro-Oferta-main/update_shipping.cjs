const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Cart Header replacement
const cartHeaderRegex = /<h2 className="text-xl font-bold font-serif text-gray-900">\s*Seu Carrinho\s*<\/h2>/s;
const newCartHeader = `<div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-serif text-gray-900">
                  A sua encomenda
                </h2>
                <span className="bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1 rounded-full">
                  {cart.reduce((sym, item) => sym + item.qty, 0)} {cart.reduce((sym, item) => sym + item.qty, 0) === 1 ? 'item' : 'itens'}
                </span>
              </div>`;
content = content.replace(cartHeaderRegex, newCartHeader);

// In the cart container, right after the header border-b, we want to add the free shipping block if > 8000
const cartHeaderEndRegex = /onClick=\{\(\) => setIsCartOpen\(false\)\}\s*>\s*<X className="w-5 h-5 text-gray-500" \/>\s*<\/button>\s*<\/div>/s;
const newCartHeaderEnd = `onClick={() => setIsCartOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {getCartTotal() >= 8000 && (
              <div className="px-6 pt-5 pb-1">
                <div className="flex items-center gap-2 text-[#00b873] font-bold mb-2 text-[15px]">
                  <Truck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  <span>Portes Grátis Desbloqueados!</span>
                </div>
                <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00b873] rounded-full w-full"></div>
                </div>
              </div>
            )}`;
content = content.replace(cartHeaderEndRegex, newCartHeaderEnd);

// Wishlist Header replacement
const targetWishlistHeader = /<h2 className="text-\[#1C202F\] text-\[36px\] md:text-\[48px\] font-serif font-bold tracking-tight mb-12">Meus Desejos<\/h2>/;
const newWishlistHeader = `<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[#1C202F] text-[36px] md:text-[48px] font-serif font-bold tracking-tight">Meus Desejos</h2>
              <span className="bg-gray-100 text-gray-500 text-sm md:text-base font-bold px-3 py-1 md:py-1.5 rounded-full mt-2 md:mt-0">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            {getWishlistTotal() >= 8000 && (
              <div className="w-full md:w-[320px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-[-10px] md:mt-0">
                <div className="flex items-center gap-2 text-[#00b873] font-bold mb-2 text-[15px]">
                  <Truck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  <span>Portes Grátis Desbloqueados!</span>
                </div>
                <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00b873] rounded-full w-full"></div>
                </div>
              </div>
            )}
          </div>`;
content = content.replace(targetWishlistHeader, newWishlistHeader);

fs.writeFileSync('src/App.tsx', content);
