const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

if (!code.includes('showScheduleForm')) {
  // Add states
  code = code.replace(
    'const [isDeleting, setIsDeleting] = useState(false);',
    'const [isDeleting, setIsDeleting] = useState(false);\n  const [showScheduleForm, setShowScheduleForm] = useState(false);\n  const [scheduleData, setScheduleData] = useState({ type: \'whatsapp\', date: \'\', title: \'\' });\n\n  const handleAddSchedule = () => {\n    if (!scheduleData.title || !scheduleData.date) return;\n    const newSchedule = { id: Math.random().toString(36).substring(2, 9), type: scheduleData.type as any, date: scheduleData.date, title: scheduleData.title, completed: false };\n    const updatedSchedules = [...(lead.schedules || []), newSchedule];\n    updateLead(lead.id, { schedules: updatedSchedules });\n    setShowScheduleForm(false);\n    setScheduleData({ type: \'whatsapp\', date: \'\', title: \'\' });\n  };\n\n  const handleToggleSchedule = (id: string) => {\n    const updatedSchedules = (lead.schedules || []).map(s => s.id === id ? { ...s, completed: !s.completed } : s);\n    updateLead(lead.id, { schedules: updatedSchedules });\n  };'
  );

  const rightInsert = `
            {/* Agendamentos Inteligentes (Cereja do Bolo) */}
            <section className="space-y-4 mb-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-[0.1em] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  Agenda & Follow-up
                </h3>
                <button 
                  onClick={() => setShowScheduleForm(!showScheduleForm)}
                  className="bg-brand-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Agendamento
                </button>
              </div>

              {showScheduleForm && (
                <div className="bg-white border border-brand-blue/30 rounded-xl p-4 animate-scale-in shadow-[0_4px_20px_rgba(37,99,235,0.1)] relative">
                  <button onClick={() => setShowScheduleForm(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"><X className="w-3 h-3" /></button>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Agendar Contato</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Título / Objetivo</label>
                      <input 
                        type="text" 
                        value={scheduleData.title} 
                        onChange={e => setScheduleData({...scheduleData, title: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50" 
                        placeholder="Ex: Confirmar interesse no item X"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Tipo de Contato</label>
                      <select 
                        value={scheduleData.type} 
                        onChange={e => setScheduleData({...scheduleData, type: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="call">Ligação</option>
                        <option value="email">E-mail</option>
                        <option value="meeting">Reunião Online</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Data / Hora Limite (Vencimento)</label>
                       <input 
                        type="datetime-local" 
                        value={scheduleData.date} 
                        onChange={e => setScheduleData({...scheduleData, date: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 font-medium text-gray-600" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end p-2 bg-gray-50 -mx-4 -mb-4 mt-2 rounded-b-xl border-t border-gray-100">
                    <button 
                      onClick={handleAddSchedule}
                      disabled={!scheduleData.title || !scheduleData.date}
                      className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-black transition-all disabled:opacity-50 shadow-sm"
                    >
                      Confirmar Agendamento
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {(!lead.schedules || lead.schedules.length === 0) && !showScheduleForm && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Nenhum follow-up agendado para este cliente.</p>
                  </div>
                )}
                
                {(lead.schedules || []).slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(sch => {
                  const isOverdue = new Date(sch.date) < new Date() && !sch.completed;
                  const schDateStr = new Date(sch.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                  
                  return (
                    <div key={sch.id} className={\`flex items-start gap-4 p-3.5 rounded-[14px] border transition-all \${sch.completed ? 'bg-gray-50 border-gray-100 opacity-60' : isOverdue ? 'bg-red-50 border-red-200 shadow-[0_2px_10px_rgba(239,68,68,0.1)]' : 'bg-white border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)]'}\`}>
                      <button 
                        onClick={() => handleToggleSchedule(sch.id)}
                        className={\`mt-1 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors \${sch.completed ? 'bg-[#0F172A] border-[#0F172A]' : isOverdue ? 'border-red-400 bg-white hover:bg-red-100' : 'border-gray-300 bg-white hover:border-[#0F172A]'}\`}
                      >
                        {sch.completed && <X className="w-4 h-4 text-white" />}
                      </button>
                      
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \${sch.type==='whatsapp'?'bg-green-100 text-green-700':sch.type==='call'?'bg-blue-100 text-blue-700':sch.type==='email'?'bg-purple-100 text-purple-700':'bg-orange-100 text-orange-700'}\`}>
                            {sch.type}
                          </span>
                          <span className={\`text-[11px] font-bold \${isOverdue && !sch.completed ? 'text-red-600' : 'text-gray-400'}\`}>
                            Vence: {schDateStr}
                          </span>
                          {isOverdue && !sch.completed && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 border border-red-200 px-2 py-0.5 rounded-md ml-auto animate-pulse">
                              <AlertCircle className="w-3 h-3" /> Atrasado
                            </span>
                          )}
                        </div>
                        <h4 className={\`text-sm font-bold \${sch.completed ? 'line-through text-gray-500' : 'text-[#0F172A]'}\`}>
                          {sch.title}
                        </h4>
                      </div>
                      
                      {!sch.completed && sch.type === 'whatsapp' && (
                         <a 
                           href={\`https://wa.me/55\${lead.phone.replace(/\\D/g, '')}?text=\${encodeURIComponent('Olá ' + lead.name + ', tudo bem? Aqui é da Euro Oferta.')}\`}
                           target="_blank" rel="noreferrer"
                           className="p-2.5 shrink-0 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 rounded-xl transition-all shadow-sm"
                           title="Lançar WhatsApp"
                         >
                           <MessageCircle className="w-5 h-5" />
                         </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
  `;

  code = code.replace(
    '{/* Smart Replies Section - A Cereja do Bolo */}',
    rightInsert + '\n\n            {/* Smart Replies Section - A Cereja do Bolo */}'
  );

  fs.writeFileSync('src/admin/pages/CRM.tsx', code);
}
