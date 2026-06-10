const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const start = code.indexOf('{wishlist.map((product, idx) => (\n                <div key={idx} className="group cursor-pointer');
const end = code.indexOf('                  </div>\n                </div>\n              ))}\n            </div>\n          )}');

if (start !== -1 && end !== -1) {
    code = code.substring(0, start) +
`{wishlist.map((product, idx) => (
                <ProductCard
                  key={idx}
                  idx={idx}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  setQuickViewProduct={setQuickViewProduct}
                  setActiveImageIdx={setActiveImageIdx}
                  handleAddToCart={addToCart}
                />
              ))}\n            </div>\n          )}` + code.substring(end + 95);
}

fs.writeFileSync('src/App.tsx', code);
