import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Check, 
  MessageCircle, 
  MapPin, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisitSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  adminStore: any;
}

export default function VisitSchedulingModal({
  isOpen,
  onClose,
  whatsappNumber,
  adminStore
}: VisitSchedulingModalProps) {
  const [step, setStep] = useState(1); // 1 = Form, 2 = Success confirm
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Create Portuguese date choices dynamically for the next 8 days (excluding Sundays)
  const dateOptions = useMemo(() => {
    const options = [];
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Check next 8 calendar days
    for (let i = 1; i <= 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Skip Sundays since the physical showroom is closed
      if (d.getDay() === 0) continue;
      
      options.push({
        id: `date-${i}`,
        dayName: daysOfWeek[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        formatted: d.toLocaleDateString('pt-BR'),
        fullText: `${daysOfWeek[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`
      });
    }
    return options.slice(0, 6); // Display up to 6 custom convenient choices
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]?.formatted || '');
  const [selectedPeriod, setSelectedPeriod] = useState<'manha' | 'tarde' | 'noite'>('tarde');
  const [goal, setGoal] = useState<'experiencia' | 'ortopedia' | 'sob-medida' | 'outro'>('experiencia');

  const [errors, setErrors] = useState({ name: false, phone: false });

  // Format phone field live
  const handlePhoneChange = (val: string) => {
    let raw = val.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);
    
    let formatted = '';
    if (raw.length === 0) formatted = '';
    else if (raw.length <= 2) formatted = `(${raw}`;
    else if (raw.length <= 6) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    else if (raw.length <= 10) formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    else formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    
    setPhone(formatted);
    if (errors.phone && raw.length >= 10) {
      setErrors(prev => ({ ...prev, phone: false }));
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name && val.trim().length >= 3) {
      setErrors(prev => ({ ...prev, name: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNameInvalid = name.trim().length < 3;
    const isPhoneInvalid = phone.replace(/\D/g, '').length < 10;
    
    if (isNameInvalid || isPhoneInvalid) {
      setErrors({
        name: isNameInvalid,
        phone: isPhoneInvalid
      });
      return;
    }

    const periodLabel = selectedPeriod === 'manha' ? 'Manhã (09h às 12h)' :
                        selectedPeriod === 'tarde' ? 'Tarde (13h às 18h)' : 'Noite (18h às 20h)';

    const goalLabel = goal === 'experiencia' ? 'Experimentar Linha Premium e Camas Articuladas' :
                      goal === 'ortopedia' ? 'Consultoria de Coluna & Biotipo Ortopédico' :
                      goal === 'sob-medida' ? 'Dúvidas Técnicas ou Modelo Sob Medida' : 'Outro / Orçamento Geral';

    const dateLabel = dateOptions.find(d => d.formatted === selectedDate)?.fullText || selectedDate;

    // 1. Save Lead locally to the CRM database using adminStore
    try {
      const newLead = adminStore.addLead({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        email: email.trim() || undefined,
        status: 'Novo Lead',
        source: 'Agendamento Showroom',
        vipLevel: 'Cliente Potencial'
      });

      // 2. Add an Audit Log
      adminStore.addLog(
        'Criar Agendamento', 
        `Agendamento de visita no showroom para ${name} em ${dateLabel} (${periodLabel})`, 
        'Cliente',
        'create'
      );
    } catch (err) {
      console.warn("Log saving skipped. Admin storage may not be initialized completely:", err);
    }

    // 3. Construct a beautiful, premium, bespoke Whatsapp Booking template
    const message = `*AGENDAMENTO DE VISITA SHOWROOM VIP* 👑
    
👤 *Nome Completo:* ${name}
📞 *WhatsApp:* ${phone}
📧 *E-mail:* ${email || 'Não informado'}

*RESERVA EXCLUSIVA:*
📅 *Data Escolhida:* ${dateLabel}
⏰ *Período Desejado:* ${periodLabel}
🎯 *Objetivo Principal:* ${goalLabel}

_Olá! Gostaria de confirmar nossa visita ao showroom exclusivo para experimentar os colchões e ter um atendimento exclusivo de bem-estar._`;

    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a safe manner
    window.open(url, '_blank', 'noreferrer,noopener');
    
    // Transition to success screen
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setName('');
    setPhone('');
    setEmail('');
    setErrors({ name: false, phone: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/65 backdrop-blur-md z-[120] flex items-center justify-center p-3 md:p-4 text-left">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[620px] max-h-[95vh] overflow-hidden flex flex-col border border-gray-150 relative">
        
        {/* Decorative Golden Ambient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#133c6d] to-amber-600" />

        {/* Header */}
        <div className="px-5 py-4 md:px-7 md:py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#133c6d]/10 flex items-center justify-center text-[#133c6d]">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base md:text-lg text-[#0F172A] tracking-tight">Agendar Visita ao Showroom</h3>
              <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Atendimento Consultivo Exclusivo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Wrap */}
        <div className="p-5 md:p-7 flex-1 overflow-y-auto no-scrollbar">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Info Header Box */}
              <div className="p-4 rounded-2xl bg-[#133c6d]/5 border border-[#133c6d]/15 flex gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 font-medium leading-relaxed">
                  Trabalhamos com <span className="font-extrabold text-[#111827]">Atendimento Premium</span>. 
                  Ao agendar, reservamos um consultor especialista em biotipo de coluna para orientar sua experiência entre as melhores marcas nacionais e importadas.
                </div>
              </div>

              {/* Personal details */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">1. Seus Dados de Contato</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1C202F] mb-1">Nome Completo <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white focus:outline-none transition-all text-xs font-semibold ${
                          errors.name 
                            ? 'border-red-400 focus:ring-2 focus:ring-red-150' 
                            : 'border-gray-200 focus:border-[#133c6d] focus:ring-2 focus:ring-[#133c6d]/10'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">Por favor, insira seu nome completo.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C202F] mb-1">WhatsApp / Celular <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(65) 99999-9999"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white focus:outline-none transition-all text-xs font-semibold ${
                          errors.phone 
                            ? 'border-red-400 focus:ring-2 focus:ring-red-150' 
                            : 'border-gray-200 focus:border-[#133c6d] focus:ring-2 focus:ring-[#133c6d]/10'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">Por favor, insira um celular válido.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1C202F] mb-1">E-mail <span className="text-gray-400 font-normal">(Opcional)</span></label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#133c6d] focus:ring-2 focus:ring-[#133c6d]/10 transition-all text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Date Choice Grid */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider flex items-center justify-between">
                  <span>2. Escolha o Melhor Dia</span>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase">Seg a Sáb, Exceto Domingos</span>
                </h4>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.formatted;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedDate(opt.formatted)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col justify-center items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#133c6d] bg-[#133c6d]/10 text-[#133c6d] ring-1 ring-[#133c6d]'
                            : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`text-[9px] uppercase font-black tracking-wider ${isSelected ? 'text-[#133c6d]' : 'text-gray-400'}`}>
                          {opt.dayName}
                        </span>
                        <span className={`text-base font-serif font-black my-0.5 ${isSelected ? 'text-[#133c6d]' : 'text-gray-800'}`}>
                          {opt.dayNum}
                        </span>
                        <span className={`text-[9px] font-extrabold ${isSelected ? 'text-[#133c6d]' : 'text-gray-500'}`}>
                          {opt.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period selection */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">3. Preferência de Período</h4>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'manha', label: 'Manhã', hour: '09h às 12h', desc: 'Atendimento calmo' },
                    { id: 'tarde', label: 'Tarde', hour: '13h às 18h', desc: 'Mais procurado' },
                    { id: 'noite', label: 'Noite', hour: '18h às 20h', desc: 'Horário executivo' }
                  ].map((p) => {
                    const isSelected = selectedPeriod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPeriod(p.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[80px] ${
                          isSelected
                            ? 'border-[#133c6d] bg-[#133c6d]/5 text-[#133c6d] ring-1 ring-[#133c6d]'
                            : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-extrabold ${isSelected ? 'text-[#133c6d]' : 'text-gray-800'}`}>{p.label}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-none">{p.hour}</p>
                        </div>
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-[#133c6d]/80' : 'text-gray-400'}`}>
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal selector */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">4. Seu Foco Principal</h4>
                
                <div className="space-y-2">
                  {[
                    { id: 'experiencia', label: 'Experimentar Colchões de Luxo & Articulados', desc: 'Para quem faz questão de deitar, sentir as matérias-primas e entender densidades' },
                    { id: 'ortopedia', label: 'Consultoria de Sono Ortopédica ou Dores nas Costas', desc: 'Suporte médico-ortopédico para reajuste postural de coluna e articulação' },
                    { id: 'sob-medida', label: 'Produtos Sob Medida (Medidas Especiais e Customizados)', desc: 'Para camas sob medida, barcos, trailers ou projetos de arquitetura específicos' },
                    { id: 'outro', label: 'Acessórios / Travesseiros / Orçamento Geral', desc: 'Travesseiros anatômicos, protetores premium e acessórios sob consulta' }
                  ].map((g) => {
                    const isSelected = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGoal(g.id as any)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#133c6d] bg-[#133c6d]/5'
                            : 'border-gray-150 hover:border-gray-200 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="pr-3">
                          <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-[#133c6d]' : 'text-gray-800'}`}>
                            {g.label}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">
                            {g.desc}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'border-[#133c6d] bg-[#133c6d] text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </form>
          ) : (
            
            /* Success confirmation screen */
            <div className="py-8 space-y-6 text-center max-w-[420px] mx-auto animate-fade-in">
              <div className="inline-flex w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle className="w-8 h-8 animate-pulse text-[#10B981]" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-black text-xl md:text-2xl text-gray-950">Seu Agendamento foi Iniciado!</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  As informações de seu agendamento premium foram registradas e uma solicitação de aprovação de data foi enviada ao seu **WhatsApp**.
                </p>
              </div>

              {/* Detail Card Summary */}
              <div className="bg-[#FAF9F5] border border-[#FEF3C7] rounded-2xl p-4.5 text-left space-y-2.5">
                <h5 className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">RESUMO DA SOLICITAÇÃO</h5>
                
                <div className="text-xs space-y-1.5 text-gray-700">
                  <p>👤 <span className="font-extrabold text-[#111827] ml-1">Cliente:</span> {name}</p>
                  <p>📅 <span className="font-extrabold text-[#111827] ml-1">Data Pré-Reservada:</span> {dateOptions.find(d => d.formatted === selectedDate)?.fullText || selectedDate}</p>
                  <p>⏰ <span className="font-extrabold text-[#111827] ml-1">Período:</span> {selectedPeriod === 'manha' ? 'Manhã (09h - 12h)' : selectedPeriod === 'tarde' ? 'Tarde (13h - 18h)' : 'Noite (18h - 20h)'}</p>
                  <p>🎯 <span className="font-extrabold text-[#111827] ml-1">Objetivo:</span> {goal === 'experiencia' ? 'Experimentar Colchões' : goal === 'ortopedia' ? 'Consultoria de Sono' : 'Mudança sob medida'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Precisa de ajustes?</p>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 bg-white hover:bg-gray-50 text-[#1C202F] text-xs font-bold border border-gray-200 rounded-xl transition-all cursor-pointer"
                >
                  Modificar Solicitação
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-4 md:px-7 md:py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shadow-inner">
          <div className="text-[10.5px] text-gray-400 font-extrabold uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#133c6d]" /> 
            <span>Ambiente Seguro</span>
          </div>

          <div className="flex items-center gap-2">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="py-2.5 px-5.5 bg-[#133c6d] hover:bg-[#0d284a] text-white text-xs font-black rounded-xl shadow-lg shadow-[#133c6d]/15 flex items-center gap-1.5 transition-all text-center cursor-pointer border-none"
                >
                  <span>Confirmar Agendamento</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-7.5 bg-[#133c6d] hover:bg-[#0d284a] text-white text-xs font-black rounded-xl transition-all cursor-pointer border-none"
              >
                Entendido, Fechar
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
