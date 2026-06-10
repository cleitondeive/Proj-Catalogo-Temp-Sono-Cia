const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(/const hasDimensions = true;[\s\n]+const dLength = actualLength \|\| '-';[\s\n]+const dWidth = actualWidth \|\| '-';[\s\n]+const dHeight = actualHeight \|\| '-';[\s\n]+const dWeight = actualWeight \|\| '-';/g, `const actualLength = activeColorObj?.length || quickViewProduct.length;
                const actualWidth = activeColorObj?.width || quickViewProduct.width;
                const actualHeight = activeColorObj?.height || quickViewProduct.height;
                const actualWeight = activeColorObj?.weight || quickViewProduct.weight;
                const hasDimensions = Boolean(actualLength || actualWidth || actualHeight || actualWeight || quickViewProduct);

                const dLength = actualLength || '-';
                const dWidth = actualWidth || '-';
                const dHeight = actualHeight || '-';
                const dWeight = actualWeight || '-';`);
fs.writeFileSync('src/App.tsx', c);
