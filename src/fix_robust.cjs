const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `                const actualLength = activeColorObj?.length || quickViewProduct.length;
                const actualWidth = activeColorObj?.width || quickViewProduct.width;
                const actualHeight = activeColorObj?.height || quickViewProduct.height;
                const actualWeight = activeColorObj?.weight || quickViewProduct.weight;`;

const replacement1 = `                const actualLength = (activeColorObj?.length && activeColorObj.length.trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && activeColorObj.width.trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && activeColorObj.height.trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && activeColorObj.weight.trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;`;

code = code.split(target1).join(replacement1);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed robust fallbacks in App.tsx');
