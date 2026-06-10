const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const helper = `const getQuickViewImages = (product: any) => {
  if (!product) return [];
  const activeColorName = product.color || product.colors?.[0]?.name;
  const activeColor = product.colors?.find((c: any) => c.name === activeColorName);
  const mainImage = activeColor?.image || product.image;
  if (activeColor?.gallery && activeColor.gallery.length > 0) {
    return [mainImage, ...activeColor.gallery].filter(Boolean);
  }
  return [mainImage, ...(product.gallery || [])].filter(Boolean);
};

export default function App() {`;

code = code.replace('export default function App() {', helper);

const oldExpr = `[(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.gallery || []), ...(quickViewProduct?.gallery || [])].filter(Boolean)`;
const newExpr = `getQuickViewImages(quickViewProduct)`;

code = code.split(oldExpr).join(newExpr);

fs.writeFileSync('src/App.tsx', code);
