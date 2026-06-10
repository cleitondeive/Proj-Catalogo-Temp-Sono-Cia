const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Relocate Features Block
const featuresBlockRegex = /\s*\{\/\* Features Block \*\/\}.*?<\/section>/s;
const featuresMatch = content.match(featuresBlockRegex);

if (featuresMatch) {
  content = content.replace(featuresMatch[0], '');
  // Now place it right before {/* Footer */}
  content = content.replace('      {/* Footer */}', featuresMatch[0] + '\n\n      {/* Footer */}');
}

// 2. Change wishlist "Solicitar Orçamento" button
content = content.replace('bg-[#708A9E] hover:bg-[#5A7285]', 'bg-[#015294] hover:bg-[#013f71]');
content = content.replace('Solicitar Orçamento', 'FINALIZAR POR WHATSAPP');
content = content.replace(
  /onClick=\{\(\) => \{\s*const text =.*?window\.open\([^)]*\);\s*\}\}/s,
  `onClick={() => {
                  const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens da minha lista de desejos:\\n\\n\` + wishlist.map(p => \`- \${p.name} (R$ \${p.price})\`).join('\\n') + \`\\n\\nTotal estimado: R$ \${getWishlistTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
                  window.open(\`https://wa.me/5565981183473?text=\${encodeURIComponent(text)}\`, '_blank');
                  setOrderSentState(true);
                  setWishlist([]);
                }}`
);

// 3. Add Cart state and Order Sent state
const stateInjectionPoint = '  const [isFabOpen, setIsFabOpen] = useState(false);';
const newStates = `  const [isFabOpen, setIsFabOpen] = useState(false);
  
  // Cart & Order Sent state
  const [cart, setCart] = useState<any[]>([]);
  const [orderSentState, setOrderSentState] = useState(false);

  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      const priceRegex = item.price?.match(/[\\d.,]+/) || ["0"];
      if (!priceRegex) return acc;
      const priceStr = priceRegex[0].replace(/\\./g, '').replace(',', '.');
      return acc + (parseFloat(priceStr) * item.qty);
    }, 0);
  };
  
  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      setCart(cart.map(item => item.name === product.name ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQty = (productName: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.name === productName) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productName: string) => {
    setCart(cart.filter(item => item.name !== productName));
  };
`;
content = content.replace(stateInjectionPoint, newStates);

// 4. Update the cart toggle showing the number
content = content.replace(
  /<span className="absolute -top-1\.5 -right-2[^"]*">\s*3\s*<\/span>/,
  `{cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#015294] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cart.reduce((sym, item) => sym + item.qty, 0)}
              </span>
            )}`
);
content = content.replace(
  /<span className="absolute max-md:top-0 md:-top-1[^"]*">\s*2\s*<\/span>/,
  `{cart.length > 0 && (
                <span className="absolute max-md:top-0 md:-top-1 max-md:-right-0 md:-right-1 bg-[#015294] text-white text-[11px] font-bold w-[20px] h-[20px] rounded-full flex items-center justify-center shadow-sm">
                  {cart.reduce((sym, item) => sym + item.qty, 0)}
                </span>
              )}`
);

// 5. Build dynamic cart JSX
const fakeCartRegex = /\{\/\* Fake Cart Items \*\/\}.*?(?=<div className="p-6 bg-white border-t)/s;
const dynamicCart = `{/* Cart Items */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cart.map((item, id) => (
                  <div
                    key={id}
                    className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white product-card-shadow relative group"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="pr-6">
                        <h4 className="font-semibold text-gray-900 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-[#7591A6] mt-1">
                          R$ {item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                          <button onClick={() => updateCartQty(item.name, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.qty}
                          </span>
                          <button onClick={() => updateCartQty(item.name, 1)} className="w-7 h-7 flex items-center justify-center text-white bg-[#015294] rounded-full cursor-pointer shadow-md">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.name)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            `;
content = content.replace(fakeCartRegex, dynamicCart);

// 6. Update cart total and finalize
const fakeCartTotalRegex = /<span className="text-2xl font-bold text-gray-900">\s*R\$ 5\.200,00\s*<\/span>/s;
content = content.replace(fakeCartTotalRegex, 
  `<span className="text-2xl font-bold text-gray-900">
                  R$ {getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>`
);

content = content.replace(
  /<button className="w-full bg-\[#015294\] hover:bg-\[#013f71\] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-\[15px\] transition-all shadow-lg hover:-translate-y-1 cursor-pointer">[\s\S]*?FINALIZAR PEDIDO VIA WHATSAPP\s*<\/button>/s,
  `<button 
                  disabled={cart.length === 0}
                  onClick={() => {
                    const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens:\\n\\n\` + cart.map(p => \`- \${p.qty}x \${p.name} (R$ \${p.price})\`).join('\\n') + \`\\n\\nTotal: R$ \${getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
                    window.open(\`https://wa.me/5565981183473?text=\${encodeURIComponent(text)}\`, '_blank');
                    setIsCartOpen(false);
                    setOrderSentState(true);
                    setCart([]);
                  }}
                  className="w-full disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed bg-[#015294] hover:bg-[#013f71] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] transition-all shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  FINALIZAR PEDIDO VIA WHATSAPP
                </button>`
);

// 7. Inject Order Sent Modal
const orderSentModal = `
      {/* Order Sent Modal */}
      {orderSentState && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col items-center p-10 relative">
            <div className="w-24 h-24 mb-6 text-[#7591A6] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#7591A6] mb-4 text-center">Pedido Enviado!</h2>
            <p className="text-gray-800 text-center text-lg mb-8 max-w-[320px]">
              Seu catálogo foi gerado com sucesso e enviado para um de nossos consultores.
            </p>
            <button 
              onClick={() => setOrderSentState(false)}
              className="bg-[#7591A6] hover:bg-[#5A7285] text-white py-4 px-8 w-full rounded-full font-bold text-lg transition-colors"
            >
              CONTINUAR NAVEGANDO
            </button>
            <p className="text-gray-500 text-sm mt-4 text-center">Um de nossos consultores responderá em breve.</p>
          </div>
        </div>
      )}
`;

content = content.replace('      <div className="pb-20 md:pb-0">', '      <div className="pb-20 md:pb-0">\n' + orderSentModal);

fs.writeFileSync('src/App.tsx', content);
