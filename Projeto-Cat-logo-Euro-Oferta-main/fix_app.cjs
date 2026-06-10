const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const newLead = adminStore\.addLead\(\{[\s\S]*?vipLevel: 'Nenhum'\n\s*\}\);\s*adminStore\.addOrder\(newLead\.id, cart\.map[\s\S]*?\}\)\), getCartTotal\(\)\);/m;

const replacement = `adminStore.addLeadWithOrder({
                name: leadForm.name,
                phone: leadForm.phone,
                email: leadForm.email,
                avatarUrl: \`https://ui-avatars.com/api/?name=\${encodeURIComponent(leadForm.name)}&background=random&color=fff&bold=true&size=150\`,
                status: 'Pedido Enviado',
                source: 'WhatsApp Checkout',
                vipLevel: 'Nenhum'
              }, cart.map(p => ({
                productId: String(p.id || ''), 
                name: p.name, 
                price: p.price, 
                qty: p.qty || 1, 
                image: p.image,
                size: p.size,
                color: p.color
              })), getCartTotal());`;

console.log("Found match: ", regex.test(code));              
code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
