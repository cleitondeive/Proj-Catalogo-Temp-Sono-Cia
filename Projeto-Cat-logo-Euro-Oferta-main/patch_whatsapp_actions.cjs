const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target1 = `                {[
                  { label: 'Boas Vindas', text: \`Olá \${formData.name}! Vi que você se cadastrou na Euro Oferta. Como posso te ajudar hoje?\` },
                  { label: 'Recuperar Carrinho', text: \`Oi \${formData.name}! Seu carrinho está te esperando com produtos incríveis. Posso tirar alguma dúvida?\` },
                  { label: 'Pedido Enviado', text: \`Excelente notícia \${formData.name}! Seu pedido acabou de ser enviado. Acompanhe a entrega pelo código enviado no seu email.\` },
                  { label: 'Fazer Upsell', text: \`Oi \${formData.name}, temos uma oferta exclusiva para clientes \${formData.vipLevel !== 'Nenhum' ? formData.vipLevel : 'especiais'} como você! Quer dar uma olhada?\` }
                ]`;

const replace1 = `                {[
                  { label: 'Boas Vindas', text: \`Olá \${formData.name}! Vi seu interesse em nossos produtos. Quer que eu te envie nosso catálogo atualizado?\` },
                  { label: 'Enviar Catálogo', text: \`Oi \${formData.name}! As novidades da semana já estão no catálogo. Posso te enviar o link para dar uma olhada?\` },
                  { label: 'Dúvidas e Medidas', text: \`Olá \${formData.name}! Ficou com alguma dúvida sobre tamanhos, cores ou disponibilidade dos produtos?\` },
                  { label: 'Condições Especiais', text: \`Oi \${formData.name}, temos condições ótimas de pagamento para você. Quer aproveitar nossa promoção de hoje?\` }
                ]`;

crm = crm.replace(target1, replace1);

fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('done saving fast actions');
