const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The array that determines images for Quick View:
// We replace:
// [(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.gallery || [])]

// with a cleaner computation inside the components instead of inline, but because it's inline in many places, we'll do a regex replace. Let's make a cleaner helper or just do the regex replace.

// Let's replace the inline calculation with a call to a function or just replace the specific text.
// The text is:
// [(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.gallery || [])]

// The new logic:
// [(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.gallery || []), ...(quickViewProduct?.gallery || [])]

const targetToken = `[(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.gallery || [])]`;
const replaceToken = `[(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.gallery || []), ...(quickViewProduct?.gallery || [])]`;

code = code.split(targetToken).join(replaceToken);

fs.writeFileSync('src/App.tsx', code);
