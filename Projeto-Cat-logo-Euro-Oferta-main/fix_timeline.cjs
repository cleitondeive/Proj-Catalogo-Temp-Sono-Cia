const fs = require('fs');

let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const targetModalTop = "const [noteImage, setNoteImage] = useState<string | null>(null);";
const replacementModalTop = `const [noteImage, setNoteImage] = useState<string | null>(null);
  const [timelineTab, setTimelineTab] = useState<'note' | 'schedule'>('note');

  const timelineItems = [
    ...(formData.notes || []).map((n) => ({ type: 'note', date: new Date(n.date).getTime(), data: n })),
    ...((lead).schedules || []).map((s) => ({ type: 'schedule', date: new Date(s.date).getTime(), data: s })),
    ...(lead.orders || []).map((o) => ({ type: 'order', date: new Date(o.createdAt).getTime(), data: o }))
  ].sort((a, b) => b.date - a.date);
`;
crm = crm.replace(targetModalTop, replacementModalTop);

const regexContent = /\{\/\* Histórico e Notas \(Coluna Direita\) \*\/\}([\s\S]*?)<\/div>\n      <\/div>\n    <\/div>\n  \);\n};\n/g;

const replacementBlock = `          {/* Linha do Tempo Unificada (Coluna Direita) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Smart Replies Fast Actions */}
            <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-2">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Fast Actions (WhatsApp)
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Boas Vindas', text: \`Olá \${formData.name}! Vi que você se cadastrou na Euro Oferta. Como posso te ajudar hoje?\` },
                  { label: 'Recuperar Carrinho', text: \`Oi \${formData.name}! Seu carrinho está te esperando com produtos incríveis. Posso tirar alguma dúvida?\` },
                  { label: 'Pedido Enviado', text: \`Excelente notícia \${formData.name}! Seu pedido acabou de ser enviado. Acompanhe a entrega pelo código enviado no seu email.\` },
                  { label: 'Fazer Upsell', text: \`Oi \${formData.name}, temos uma oferta exclusiva para clientes \${formData.vipLevel !== 'Nenhum' ? formData.vipLevel : 'especiais'} como você! Quer dar uma olhada?\` }
                ].map((msg, i) => (
                  <a 
                    key={i}
                    href={\`https://wa.me/55\${formData.phone.replace(/\\D/g, '')}?text=\${encodeURIComponent(msg.text)}\`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-500 hover:text-white border border-green-100 rounded-lg text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3" />
                    {msg.label}
                  </a>
                ))}
              </div>
            </section>

            {/* Composer Tabs */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button onClick={() => setTimelineTab('note')} className={\`flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors \${timelineTab === 'note' ? 'bg-[#0F172A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#0F172A]'}\`}>
                  <MessageCircle className="w-4 h-4" /> Registrar Nota
                </button>
                <button onClick={() => setTimelineTab('schedule')} className={\`flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors \${timelineTab === 'schedule' ? 'bg-[#0F172A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#0F172A]'}\`}>
                  <CalendarDays className="w-4 h-4" /> Agendar Tarefa
                </button>
              </div>

              <div className="p-4 bg-white focus-within:ring-2 focus-within:ring-[#0F172A]/10 transition-all">
                {timelineTab === 'note' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    {noteImage && (
                      <div className="relative inline-block mb-3">
                         <img src={noteImage} alt="Upload" className="h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                         <button onClick={() => setNoteImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform shadow-md"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 flex bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md transition-colors mr-2 cursor-pointer" title="Anexar Imagem">
                          <ImagePlus className="w-5 h-5" />
                          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </button>
                        <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()} placeholder="Adicionar nota, email enviado ou observação..." className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400" />
                      </div>
                      <button onClick={handleAddNote} className="px-6 py-2.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-sm disabled:opacity-50" disabled={!newNote.trim() && !noteImage}>Salvar Nota</button>
                    </div>
                  </div>
                )}
                
                {timelineTab === 'schedule' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Título da Tarefa</label>
                        <input type="text" value={scheduleData.title} onChange={e => setScheduleData({...scheduleData, title: e.target.value})} className="w-full px-3 py-2 focus:ring-2 focus:ring-[#0F172A]/20 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" placeholder="Ex: Ligar sobre carrinho abandonado" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Tipo de Contato</label>
                        <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0F172A]/20 transition-all">
                          <option value="whatsapp">WhatsApp</option>
                          <option value="call">Ligação</option>
                          <option value="email">E-mail</option>
                          <option value="meeting">Reunião Online</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Data / Hora de Vencimento</label>
                         <input type="datetime-local" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium outline-none focus:ring-2 focus:ring-[#0F172A]/20 transition-all" />
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-gray-100 pt-3">
                      <button onClick={handleAddSchedule} disabled={!scheduleData.title || !scheduleData.date} className="px-6 py-2.5 bg-[#0F172A] text-white rounded-lg text-xs font-bold hover:bg-black transition-all disabled:opacity-50 shadow-sm flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Agendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* The Unified Visual Timeline Feed */}
            <div className="relative border-l-2 border-gray-200/60 ml-[23px] sm:ml-[31px] mt-4 mb-8 space-y-8 pb-4">
               {timelineItems.length === 0 && (
                 <div className="ml-8 text-sm text-gray-400 italic">Nenhum evento registrado no histórico deste cliente.</div>
               )}
               
               {timelineItems.map((item, idx) => {
                 return (
                   <div key={idx} className="relative group">
                      {/* Timeline Node Context */}
                      <span className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-[14px] h-[14px] rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform">
                         {item.type === 'note' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500" />}
                         {item.type === 'schedule' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500" />}
                         {item.type === 'order' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500" />}
                      </span>

                      {/* Content Card */}
                      <div className="ml-6 sm:ml-8">
                         {item.type === 'note' && (
                           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300 transition-all">
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Nota
                                  <span className="text-gray-300">•</span>
                                  {new Date(item.data.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                               </div>
                               <button onClick={() => handleDeleteNote(item.data.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             </div>
                             {item.data.content && <p className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-wrap">{item.data.content}</p>}
                             {item.data.image && (
                               <div className="mt-3 max-w-[200px] rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => window.open(item.data.image, '_blank')}>
                                  <img src={item.data.image} className="w-full h-auto" alt="Anexo" />
                               </div>
                             )}
                           </div>
                         )}

                         {item.type === 'schedule' && (() => {
                            const sch = item.data;
                            const isOverdue = new Date(sch.date) < new Date() && !sch.completed;
                            return (
                              <div className={\`border rounded-xl p-4 transition-all \${sch.completed ? 'bg-gray-50/80 border-gray-200/60 opacity-80' : isOverdue ? 'bg-red-50/50 border-red-200/80 shadow-[0_2px_10px_rgba(239,68,68,0.05)]' : 'bg-white border-amber-200/50 shadow-[0_2px_10px_rgba(245,158,11,0.05)]'}\`}>
                                <div className="flex justify-between items-start mb-2.5">
                                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                                    <CalendarDays className={\`w-3.5 h-3.5 \${sch.completed ? 'text-gray-400' : isOverdue ? 'text-red-500' : 'text-amber-500'}\`} />
                                    <span className={sch.completed ? 'text-gray-400' : isOverdue ? 'text-red-600' : 'text-amber-600'}>
                                      {sch.completed ? 'Tarefa Concluída' : isOverdue ? 'Atrasado' : 'Agendado'}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">{new Date(sch.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button onClick={() => handleToggleSchedule(sch.id)} className={\`shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center border-2 transition-colors \${sch.completed ? 'bg-gray-300 border-gray-300' : isOverdue ? 'bg-white border-red-400 hover:bg-red-50' : 'bg-white border-amber-400 hover:bg-amber-50'}\`}>
                                     {sch.completed && <X className="w-4 h-4 text-white" />}
                                  </button>
                                  <div className="flex-1">
                                    <p className={\`text-sm font-bold \${sch.completed ? 'line-through text-gray-500' : 'text-[#0F172A]'}\`}>{sch.title}</p>
                                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 border border-gray-200/60 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded">{sch.type}</span>
                                  </div>
                                  {!sch.completed && sch.type === 'whatsapp' && (
                                     <a href={\`https://wa.me/55\${lead.phone.replace(/\\D/g, '')}?text=\${encodeURIComponent('Olá '+lead.name+', tudo bem? Aqui é da Euro Oferta.')}\`} target="_blank" rel="noreferrer" className="shrink-0 p-2 text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200/50 self-start" title="Abrir WhatsApp">
                                       <MessageCircle className="w-5 h-5" />
                                     </a>
                                  )}
                                </div>
                              </div>
                            )
                         })()}

                         {item.type === 'order' && (() => {
                           const o = item.data;
                           return (
                             <div className="bg-white border border-emerald-100 rounded-xl p-0 overflow-hidden shadow-[0_2px_15px_rgba(16,185,129,0.06)] group-hover:border-emerald-200 transition-colors">
                               <div className="bg-emerald-50/50 px-4 py-3 flex justify-between items-center border-b border-emerald-50">
                                 <div className="flex items-center gap-2">
                                   <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center"><Package className="w-4 h-4" /></div>
                                   <div>
                                     <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest leading-none mb-1">Pedido Finalizado</p>
                                     <p className="text-[10px] text-gray-500 font-medium">{new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                   <p className="text-sm font-bold text-[#0F172A]">R$ {o.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                 </div>
                               </div>
                               <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {o.items.map((i: any, c: number) => (
                                   <div key={c} className="flex items-center gap-3">
                                     {i.image ? <img src={i.image} className="w-10 h-10 rounded border border-gray-100 object-contain p-1" /> : <div className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center"><Package className="w-5 h-5 text-gray-300"/></div>}
                                     <div className="flex-1 min-w-0">
                                       <p className="text-[11px] font-bold text-[#0F172A] truncate">{i.name}</p>
                                       <p className="text-[10px] text-gray-500">{i.qty || 1}x {i.color || ''} {i.size || ''}</p>
                                     </div>
                                   </div>
                                 ))}
                                 <button onClick={() => generatePDF(o, lead)} className="col-span-full mt-2 py-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors border border-gray-200">
                                   <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                                 </button>
                               </div>
                             </div>
                           )
                         })()}
                      </div>
                   </div>
                 )
               })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
`;

crm = crm.replace(regexContent, replacementBlock);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('done!');
