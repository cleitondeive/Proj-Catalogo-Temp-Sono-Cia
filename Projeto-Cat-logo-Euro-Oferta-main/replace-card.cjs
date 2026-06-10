const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Block 1 (mobile horizontal scroll)
const start1 = code.indexOf('filteredProducts.map((product, idx) => (\n              <div\n                key={idx}\n                className={`w-full');
const end1 = code.indexOf('            ))\n          )}\n          {/* spacer for the last item to snap clearly */}');
if (start1 !== -1 && end1 !== -1) {
    code = code.substring(0, start1) + 
`filteredProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                idx={idx}
                product={product}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                setQuickViewProduct={setQuickViewProduct}
                setActiveImageIdx={setActiveImageIdx}
                handleAddToCart={addToCart}
                mobileVisibleCount={mobileVisibleCount}
                className={"w-full md:w-[280px] lg:w-[310px] xl:w-[330px] shrink-0 md:snap-start"}
              />
            ))\n          )}\n          {/* spacer for the last item to snap clearly */}` + code.substring(end1 + 86);
}

// Replace Block 2 (category grid)
const start2 = code.indexOf('{filteredProducts.map((product, idx) => (\n              <div\n                key={idx}\n                className="group relative flex flex-col p-4 md:p-5');
const end2 = code.indexOf('              </div>\n            ))}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n\nexport default function App() {');
if (start2 !== -1 && end2 !== -1) {
    code = code.substring(0, start2) + 
`{filteredProducts.map((product, idx) => (
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
            ))}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}\n\nexport default function App() {` + code.substring(end2 + 124);
}

fs.writeFileSync('src/App.tsx', code);
