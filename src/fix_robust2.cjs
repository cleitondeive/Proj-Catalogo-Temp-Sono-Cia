const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                const actualLength = (activeColorObj?.length && activeColorObj.length.trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && activeColorObj.width.trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && activeColorObj.height.trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && activeColorObj.weight.trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;`;

const replace = `                const actualLength = (activeColorObj?.length && String(activeColorObj.length).trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && String(activeColorObj.width).trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && String(activeColorObj.height).trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && String(activeColorObj.weight).trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;`;

code = code.split(target).join(replace);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed undefined errors in App.tsx');
