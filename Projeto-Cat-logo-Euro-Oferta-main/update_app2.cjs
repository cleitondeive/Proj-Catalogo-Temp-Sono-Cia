const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Update SectionCarousel props to take addToCart
content = content.replace(
  /wishlist:\s*any\[\];\n\s*toggleWishlist:\s*\(product:\s*any,\s*e:\s*React\.MouseEvent\)\s*=>\s*void;\n\}\)\s*=>\s*\{/s,
  `wishlist: any[];
  toggleWishlist: (product: any, e: React.MouseEvent) => void;
  addToCart: (product: any, e: React.MouseEvent) => void;
}) => {`
);

content = content.replace(
  /wishlist,\n\s*toggleWishlist\n\}:\s*\{/s,
  `wishlist,
  toggleWishlist,
  addToCart
}: {`
);

// Add to Cart in SectionCarousel (button at line 335)
// It looks like:
// <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border border-gray-200 text-[#015294] flex items-center justify-center hover:bg-[#015294] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0">
content = content.replace(
  /<button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border border-gray-200 text-\[#015294\] flex items-center justify-center hover:bg-\[#015294\] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0">/g,
  `<button onClick={(e) => addToCart(product, e)} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border border-gray-200 text-[#015294] flex items-center justify-center hover:bg-[#015294] hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0">`
);

// Quick View adding addToCart
content = content.replace(
  /<button className="flex-\[4\] bg-\[#015294\] hover:bg-\[#013f71\] text-white py-3 md:py-2\.5 px-4 md:px-5 rounded-\[12px\] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 text-\[13px\] md:text-sm lg:text-\[15px\]">\s*<ShoppingCart className="w-4 h-4 md:w-\[18px\] md:h-\[18px\]" \/>\s*Adicionar ao Pedido\s*<\/button>/s,
  `<button onClick={(e) => addToCart(quickViewProduct, e)} className="flex-[4] bg-[#015294] hover:bg-[#013f71] text-white py-3 md:py-2.5 px-4 md:px-5 rounded-[12px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 text-[13px] md:text-sm lg:text-[15px]">
                  <ShoppingCart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  Adicionar ao Pedido
                </button>`
);

// At the bottom of App.jsx, pass addToCart to SectionCarousels
// `wishlist={wishlist} toggleWishlist={toggleWishlist}`
content = content.replace(
  /wishlist=\{wishlist\}\s+toggleWishlist=\{toggleWishlist\}/g,
  `wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart}`
);

fs.writeFileSync('src/App.tsx', content);
