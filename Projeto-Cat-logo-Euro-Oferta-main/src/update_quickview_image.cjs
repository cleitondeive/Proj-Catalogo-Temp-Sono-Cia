const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexImageArray = /\[quickViewProduct\?\.image, \.\.\.\(quickViewProduct\?\.gallery \|\| \[\]\)]/g;
const replacementImageArray = `[(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.gallery || [])]`;

if(code.match(regexImageArray)) {
    code = code.replace(regexImageArray, replacementImageArray);
    console.log("Replaced image array generation");
} else {
    console.log("Regex not found for image array");
}

fs.writeFileSync('src/App.tsx', code);
