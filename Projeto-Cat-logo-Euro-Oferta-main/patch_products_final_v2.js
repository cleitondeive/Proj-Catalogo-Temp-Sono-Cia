const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ProductsManager.tsx', 'utf8');
if (!code.includes('addLog')) {
  code = code.replace('const { data, setProducts } = useStore();', 'const { data, setProducts, addLog } = useStore();\n  const currentUserOption = data.users?.find(u => u.id === localStorage.getItem(\'admin_user_id\'))?.name || \'Admin\';');
  code = code.replace('setProducts(data.products.map(p => p.id === product.id ? { ...p, status: isActivating ? \'active\' : \'draft\' } : p));', 'if (addLog) addLog(\'Status Produto\', \'O produto \' + product.name + \' agora está \' + (isActivating ? \'ativo\' : \'oculto\'), currentUserOption, \'update\');\n    setProducts(data.products.map(p => p.id === product.id ? { ...p, status: isActivating ? \'active\' : \'draft\' } : p));');
  code = code.replace('setProducts(data.products.filter(p => p.id !== product.id));', 'if (addLog) addLog(\'Exclusão de Produto\', \'O produto \' + product.name + \' foi removido\', currentUserOption, \'delete\');\n                            setProducts(data.products.filter(p => p.id !== product.id));');
  code = code.replace('setProducts([newProduct, ...data.products]);', 'if (addLog) addLog(\'Produto Duplicado\', newProduct.name + \' usando \' + product.name, currentUserOption, \'create\');\n                            setProducts([newProduct, ...data.products]);');
  code = code.replace('setProducts(data.products.map(x => x.id === p.id ? p : x));', 'if (addLog) addLog(\'Produto Editado\', p.name + \' atualizado\', currentUserOption, \'update\');\n                setProducts(data.products.map(x => x.id === p.id ? p : x));');
  code = code.replace('setProducts([p, ...data.products]);', 'if (addLog) addLog(\'Novo Produto\', p.name + \' cadastrado\', currentUserOption, \'create\');\n                setProducts([p, ...data.products]);');
  fs.writeFileSync('src/admin/pages/ProductsManager.tsx', code);
}
