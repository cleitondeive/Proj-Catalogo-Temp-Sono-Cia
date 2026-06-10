const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// 1. Add MessageSquare and Tag import if not present
if (!code.includes("import { Search, Filter, Plus, MoreHorizontal, Download, MessageSquare")) {
  code = code.replace(
    "import { Search, Filter, Plus, MoreHorizontal, Download",
    "import { Search, Filter, Plus, MoreHorizontal, Download, MessageSquare, Tag"
  );
}

// 2. We inject Smart Replies in col-span-8, before the Notes section.
const notesSectionMarker = '{/* Notes Section */}';
const smartRepliesSection = `
            {/* Smart Replies Section - A Cereja do Bolo */}
            <section className="space-y-4 mb-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-[0.1em] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-blue" />
                  Respostas Inteligentes
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Boas Vindas', text: \`Olá \${formData.name}! Vi que você se cadastrou na Euro Oferta. Como posso te ajudar hoje?\` },
                  { label: 'Recuperar Carrinho', text: \`Oi \${formData.name}! Seu carrinho está te esperando com produtos incríveis. Posso tirar alguma dúvida?\` },
                  { label: 'Pedido Enviado', text: \`Excelente notícia \${formData.name}! Seu pedido acabou de ser enviado. Acompanhe a entrega pelo código enviado no seu email.\` },
                  { label: 'Cobrança', text: \`Olá \${formData.name}. Verificamos um pagamento pendente para o seu pedido. Precisa de ajuda com o link de pagamento?\` },
                  { label: 'Fazer Upsell', text: \`Oi \${formData.name}, temos uma oferta exclusiva para clientes \${formData.vipLevel !== 'Nenhum' ? formData.vipLevel : 'especiais'} como você! Quer dar uma olhada?\` }
                ].map((msg, i) => (
                  <a 
                    key={i}
                    href={\`https://wa.me/55\${formData.phone.replace(/\\D/g, '')}?text=\${encodeURIComponent(msg.text)}\`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-green-50 text-green-700 hover:bg-green-500 hover:text-white border border-green-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    title="Enviar template no WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {msg.label}
                  </a>
                ))}
              </div>
            </section>
`;

if (!code.includes("Respostas Inteligentes")) {
  code = code.replace(notesSectionMarker, smartRepliesSection + "\n            " + notesSectionMarker);
}

// 3. Inject Tags into left column (`col-span-4`) after Follow-up or Status
// Let's add it right at the end of col-span-4.
const leftColumnEndMarker = `          </div>

          {/* Histórico e Notas (Coluna Direita) */}`;

const tagsSection = `
            {/* Tags Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Etiquetas</h3>
               <div className="flex flex-wrap gap-2">
                 {(formData.tags || []).map((tag: string, i: number) => (
                   <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                     {tag}
                     {isEditing && (
                       <button 
                         onClick={() => setFormData({...formData, tags: formData.tags.filter((t: string) => t !== tag)})}
                         className="hover:text-red-500"
                       ><X className="w-3 h-3" /></button>
                     )}
                   </span>
                 ))}
                 {isEditing && (
                   <button 
                     onClick={() => {
                        const t = prompt('Nova etiqueta (ex: URGENTE, ATACADO):');
                        if (t && t.trim()) setFormData({...formData, tags: [...(formData.tags || []), t.trim().toUpperCase()]});
                     }}
                     className="px-2 py-1 border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wider"
                   >
                     + Adicionar
                   </button>
                 )}
                 {!isEditing && (!formData.tags || formData.tags.length === 0) && (
                   <span className="text-xs text-gray-400 italic">Sem etiquetas</span>
                 )}
               </div>
            </div>
`;

if (!code.includes("Etiquetas") && !code.includes("Tags Section")) {
  code = code.replace(leftColumnEndMarker, tagsSection + "\n" + leftColumnEndMarker);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
