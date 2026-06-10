const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will just use regex to remove multiple declarations.
content = content.replace(/const actualLength = activeColorObj\?\.length \|\| quickViewProduct\.length;\s+const actualWidth = activeColorObj\?\.width \|\| quickViewProduct\.width;\s+const actualHeight = activeColorObj\?\.height \|\| quickViewProduct\.height;\s+const actualWeight = activeColorObj\?\.weight \|\| quickViewProduct\.weight;\s+const hasDimensions = true;\s+const dLength = actualLength \|\| '-';\s+const dWidth = actualWidth \|\| '-';\s+const dHeight = actualHeight \|\| '-';\s+const dWeight = actualWeight \|\| '-';\s+const dTags = activeColorObj\?\.tags \|\| quickViewProduct\.tags;\s+const dStock = quickViewProduct\.showStock \? quickViewProduct\.stock : null;/g, `const hasDimensions = true;
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const dStock = quickViewProduct.showStock ? quickViewProduct.stock : null;`);

fs.writeFileSync('src/App.tsx', content);

