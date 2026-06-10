const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update getCartTotal
code = code.replace(
  `  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      const priceRegex = item.price?.match(/[\\d.,]+/) || ["0"];`,
  `  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.showPrice === false) return acc;
      const priceRegex = item.price?.match(/[\\d.,]+/) || ["0"];`
);

// Update WhatsApp text Generation
code = code.replace(
  '` + cart.map(p => `- ${p.qty || 1}x ${p.name} (R$ ${p.price})${p.color ? ` - Cor: ${p.color}` : \'\'}${p.size ? ` - Tam: ${p.size}` : \'\'}`).join(\'\\\\n\') + `',
  '` + cart.map(p => `- ${p.qty || 1}x ${p.name} (${p.showPrice === false ? \'Sob Consulta\' : \`R$ \${p.price}\`})${p.color ? ` - Cor: ${p.color}` : \'\'}${p.size ? ` - Tam: ${p.size}` : \'\'}`).join(\'\\\\n\') + `'
);

// Update Cart Order Sent item rendering at lines ~2617
code = code.replace(
  '<p className="text-xs text-brand-blue font-bold mt-0.5">{item.qty || 1}x R$ {item.price}</p>',
  '<p className="text-xs text-brand-blue font-bold mt-0.5">{item.qty || 1}x {item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}</p>'
);

// Update Cart Drawer Item Rendering at lines ~2732
code = code.replace(
  '<p className="text-[15px] font-bold text-gray-400">\n                          R$ {item.price}\n                        </p>',
  '<p className="text-[15px] font-bold text-gray-400">\n                          {item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}\n                        </p>'
);

// Update header cart rendering at line ~3468
code = code.replace(
  '<span className="text-[12px] md:text-[13px] text-gray-500 font-medium whitespace-nowrap">R$ {item.price}</span>',
  '<span className="text-[12px] md:text-[13px] text-gray-500 font-medium whitespace-nowrap">{item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}</span>'
);

// Optional: format the total text in WhatsApp 
code = code.replace(
  "Total: R$ ${getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}",
  "Total Estimado: R$ ${getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"
);


fs.writeFileSync('src/App.tsx', code);
