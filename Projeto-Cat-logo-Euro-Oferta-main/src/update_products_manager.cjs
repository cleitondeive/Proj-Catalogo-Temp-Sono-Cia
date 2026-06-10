const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');

const regexNewProduct = /onClick=\{\(\) => setEditingProduct\(\{ id: Math\.random\(\)\.toString\(\), name: '', price: '0,00', originalPrice: '', image: '', category: 'Estofados', status: 'active', createdAt: new Date\(\)\.toISOString\(\) \}\)\}/;

const replacementNewProduct = `onClick={() => setEditingProduct({ id: Math.random().toString(), name: '', price: '', originalPrice: '', image: '', category: '', status: 'active', createdAt: new Date().toISOString(), hasVariations: true, colors: [{ name: '', hex: '#000000', image: '', texture: '', price: '', originalPrice: '', description: '', length: '', width: '', height: '', tags: '' }] })}`;

if(code.match(regexNewProduct)) {
    code = code.replace(regexNewProduct, replacementNewProduct);
    console.log("Updated New Product initialization");
} else {
    console.log("Regex not found for new product");
}

fs.writeFileSync('src/admin/pages/ProductsManager.tsx', code);
