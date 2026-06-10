const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The dimensions block currently present in App.tsx
// Let's replace the logic to be 100% reliable.
content = content.replace(/const hasDimensions = [\s\S]*?const dStock = quickViewProduct.showStock \? quickViewProduct.stock : null;/g, `
                const actualLength = activeColorObj?.length || quickViewProduct.length;
                const actualWidth = activeColorObj?.width || quickViewProduct.width;
                const actualHeight = activeColorObj?.height || quickViewProduct.height;
                const actualWeight = activeColorObj?.weight || quickViewProduct.weight;
                
                const hasDimensions = true;
                
                const dLength = actualLength || '-';
                const dWidth = actualWidth || '-';
                const dHeight = actualHeight || '-';
                const dWeight = actualWeight || '-';
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const dStock = quickViewProduct.showStock ? quickViewProduct.stock : null;`);

fs.writeFileSync('src/App.tsx', content);
