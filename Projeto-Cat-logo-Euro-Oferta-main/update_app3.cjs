const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add orderSentItems to state
const statePattern = /const \[orderSentState, setOrderSentState\] = useState\(false\);/;
content = content.replace(statePattern, `const [orderSentState, setOrderSentState] = useState(false);\n  const [orderSentItems, setOrderSentItems] = useState<any[]>([]);`);

// 2. Update checkout handlers to set orderSentItems
content = content.replace(
  /onClick=\{\(\) => \{\s*const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens da minha lista de desejos:\\n\\n\` \+ wishlist\.map.*?setWishlist\(\[\]\);\s*\}\}/s,
  `onClick={() => {
                  const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens da minha lista de desejos:\\n\\n\` + wishlist.map(p => \`- \${p.name} (R$ \${p.price})\`).join('\\n') + \`\\n\\nTotal estimado: R$ \${getWishlistTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
                  window.open(\`https://wa.me/5565981183473?text=\${encodeURIComponent(text)}\`, '_blank');
                  setOrderSentItems([...wishlist]);
                  setOrderSentState(true);
                  setWishlist([]);
                }}`
);

content = content.replace(
  /onClick=\{\(\) => \{\s*const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens:\\n\\n\` \+ cart\.map.*?setCart\(\[\]\);\s*\}\}/s,
  `onClick={() => {
                    const text = \`Olá! Gostaria de fazer o pedido dos seguintes itens:\\n\\n\` + cart.map(p => \`- \${p.qty}x \${p.name} (R$ \${p.price})\`).join('\\n') + \`\\n\\nTotal: R$ \${getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
                    window.open(\`https://wa.me/5565981183473?text=\${encodeURIComponent(text)}\`, '_blank');
                    setIsCartOpen(false);
                    setOrderSentItems([...cart]);
                    setOrderSentState(true);
                    setCart([]);
                  }}`
);

// 3. Update Order Sent Modal to match print
const oldModal = /\{\/\* Order Sent Modal \*\/\}.*?CONTINUAR NAVEGANDO.*?<\/div>\s*<\/div>\s*\)\}/s;
const newModal = `{/* Order Sent Modal */}
      {orderSentState && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col items-center p-8 md:p-12 relative scale-in-center">
            
            <div className="w-20 h-20 mb-6 flex items-center justify-center -mt-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#648A96" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#648A96] mb-4 text-center">Pedido Enviado!</h2>
            
            <p className="text-gray-900 font-medium text-center text-base md:text-lg mb-8 max-w-[420px] leading-relaxed">
              Seu catálogo foi gerado com sucesso e enviado para um de nossos consultores.
            </p>

            <div className="flex w-full gap-4 overflow-x-auto hide-scrollbar pb-4 mb-6 border border-gray-100 rounded-2xl p-4">
              {orderSentItems.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-white pr-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col max-w-[120px]">
                    <span className="text-xs font-bold text-gray-900 truncate" title={item.name}>{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-medium">R$ {item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setOrderSentState(false);
                setOrderSentItems([]);
              }}
              className="bg-[#648A96] hover:bg-[#4A6A76] text-white py-4 px-8 w-full md:w-auto md:min-w-[320px] rounded-[16px] font-bold text-[15px] uppercase tracking-wider transition-colors shadow-lg cursor-pointer max-w-sm"
            >
              CONTINUAR NAVEGANDO
            </button>
            <p className="text-gray-600 font-medium text-sm mt-5 text-center">Um de nossos consultores responderá em breve.</p>
          </div>
        </div>
      )}`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/App.tsx', content);
