import React, { useState } from "react";
import { 
  X, Mail, Phone, MapPin, Clock, ArrowRight, Check, Send, 
  ChevronDown, ChevronUp, Search, MessageCircle, FileText, 
  ShieldCheck, HeartHandshake, Headphones, Sparkles, Building, Copy, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InstitutionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'fale-conosco' | 'endereco' | 'sobre' | 'central-ajuda' | 'politica' | 'termos';
  setActiveTab: (tab: 'fale-conosco' | 'endereco' | 'sobre' | 'central-ajuda' | 'politica' | 'termos') => void;
}

export default function InstitutionalModal({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab 
}: InstitutionalModalProps) {
  
  // Fale Conosco form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubject, setFormSubject] = useState("Dúvida Geral");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Central de Ajuda (FAQ) states
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Showroom copy states
  const [copiedShowroom, setCopiedShowroom] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedShowroom(index);
    setTimeout(() => setCopiedShowroom(null), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury API response / validation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Clear form
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormMessage("");

      // Autoclose submit state after 4 seconds
      setTimeout(() => setSubmitted(false), 4000);
    }, 1200);
  };

  const handleWhatsAppSend = () => {
    if (!formName || !formMessage) {
      alert("Por favor, preencha seu nome e mensagem para enviar via WhatsApp.");
      return;
    }
    const textMessage = `Olá, meu nome é ${formName}. \n📧 Email: ${formEmail || "Não informado"} \n📞 Tel: ${formPhone || "Não informado"} \n📌 Assunto: ${formSubject} \n\n💬 Mensagem:\n${formMessage}`;
    const encoded = encodeURIComponent(textMessage);
    window.open(`https://wa.me/5565992549622?text=${encoded}`, '_blank');
  };

  // Curated Sleep/Furniture FAQs
  const faqItems = [
    {
      q: "Como funciona o serviço de Entrega Agendada de colchões e camas?",
      a: "Para garantir máxima conveniência e pontualidade, nossa equipe premium realiza entregas programadas de segunda a sábado. Nós não apenas transportamos os seus itens, mas fazemos a montagem especializada completa, bem como o descarte ecológico das embalagens de forma 100% gratuita para capitais e regiões metropolitanas credenciadas."
    },
    {
      q: "Onde são fabricados os móveis de madeira de vocês?",
      a: "Toda a nossa curadoria de móveis de madeira maciça é concebida por artesãos moveleiros especialistas, utilizando madeiras certificadas com manejo ecológico responsável de lei. Cada peça recebe tratamentos exclusivos contra umidade, cupins e acabamento fosco manual de altíssima costura."
    },
    {
      q: "Qual a garantia dos produtos Sono & Cia?",
      a: "Nossos produtos possuem garantias diferenciadas para assegurar sua durabilidade. Oferecemos até 5 anos de garantia estrutural para camas de madeira e estofados, e até 10 anos de garantia para as molas e espumas de nossos Colchões Tecnológicos Premium. Travesseiros e enxovais contam com a garantia padrão de fábrica de 1 ano contra defeitos de costura."
    },
    {
      q: "Como recebo assessoria personalizada para escolher meu colchão?",
      a: "Nossos 'Sleep Specialists' (Consultores do Sono) estão de plantão online e em nossas lojas conceito. Analisamos detalhadamente suas preferências de firmeza, posição ao dormir e biotipo para indicar a tecnologia de conforto ideal (Látex Orgânico, Espuma de Memória Inteligente ou Molas Ensacadas Individuais)."
    },
    {
      q: "Vocês fazem estofados ou cabeceiras sob medida?",
      a: "Sim! Um de nossos grandes diferenciais é o atendimento personalizado sob medida. Você pode escolher dimensões personalizadas, tipos de madeiras nobres, densidades de estofamento sob medida e selecionar entre mais de 100 tecidos importados (linhos puros, veludos buclê e couros italianos)."
    },
    {
      q: "Quais são as políticas de trocas ou devoluções?",
      a: "Prezamos pelo seu bem-estar absoluto. Se você adquiriu um produto de linha e ele não atendeu às suas expectativas de conforto, você poderá solicitar o ajuste de firmeza ou troca em até 30 dias. Para produtos sob medida, nossa marcenaria interna de alta precisão ajustará o modelo sem custos adicionais nos primeiros 15 dias pós-entrega."
    }
  ];

  const filteredFaqs = faqItems.filter(
    item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
            item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const menuTabs = [
    { id: 'fale-conosco', label: 'Fale Conosco', icon: Headphones },
    { id: 'endereco', label: 'Nossos Endereços', icon: MapPin },
    { id: 'sobre', label: 'Sobre a Sono & Cia', icon: HeartHandshake },
    { id: 'central-ajuda', label: 'Central de Ajuda', icon: Sparkles },
    { id: 'politica', label: 'Política de Privacidade', icon: ShieldCheck },
    { id: 'termos', label: 'Termos de Uso', icon: FileText }
  ] as const;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        id="inst-modal-backdrop"
      />
      
      {/* Modal Box */}
      <div 
        className="bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-5.2xl h-[90vh] md:h-[680px] border border-gray-100 relative z-10 animate-[zoom-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"
        id="inst-modal-content"
      >
        {/* Close Button Mobile/Desktop */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-[#475569] hover:text-[#0F172A] transition-all duration-200 border border-gray-100 shadow-sm cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-[280px] bg-[#0A0D14] p-6 md:p-8 flex flex-col justify-between border-r border-white/5 shrink-0 select-none">
          <div>
            <div className="flex items-center gap-2 mb-8 md:mb-10">
              <div className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-blue" />
              </div>
              <h2 className="text-white text-[13px] md:text-[14px] font-bold tracking-[0.2em] uppercase">
                Atendimento VIP
              </h2>
            </div>

            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none snap-x whitespace-nowrap">
              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] md:text-[14px] font-semibold transition-all duration-300 snap-center cursor-pointer ${
                      isActive 
                        ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 scale-[1.02]' 
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/40'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex flex-col gap-4 pt-6 border-t border-white/5">
            <p className="text-white/40 text-[11px] font-bold tracking-[0.15em] uppercase">Fale Direto Conosco</p>
            <a 
              href="https://wa.me/5565992549622" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2.5 text-[13px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Assessoria</span>
            </a>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-[#FAFAFC] overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col">
          {/* Header Inside Panel */}
          <div className="mb-8 border-b border-gray-100 pb-5 shrink-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] font-black text-brand-blue">
                Sono &amp; Cia Curadoria
              </p>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#0F172A] tracking-tight">
              {menuTabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Dynamic Content Views */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'fale-conosco' && (
                <motion.div 
                  key="fale-conosco"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Left Form (7 columns) */}
                  <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                    {submitted ? (
                      <div className="py-12 px-4 text-center">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 animate-bounce">
                          <Check className="w-7 h-7 text-emerald-500" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Mensagem Recebida!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          Sua mensagem foi enviada para nossos curadores de atendimento. Responderemos no seu e-mail cadastrado em breve!
                        </p>
                        <button 
                          onClick={() => setSubmitted(false)}
                          className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-[13px] font-bold cursor-pointer hover:bg-black transition-colors"
                        >
                          Nova Mensagem
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <h3 className="text-[16px] font-bold text-[#0F172A] mb-3">Envie sua Mensagem por E-mail</h3>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1.5">Nome Completo</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Ex: João da Silva"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:bg-white rounded-xl px-4 py-3 text-[14px] outline-none font-medium text-gray-900 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1.5">E-mail de Contato</label>
                            <input 
                              type="email" 
                              required 
                              placeholder="joao@exemplo.com"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:bg-white rounded-xl px-4 py-3 text-[14px] outline-none font-medium text-gray-900 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1.5">Celular / WhatsApp</label>
                            <input 
                              type="tel" 
                              placeholder="(00) 00000-0000"
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                              className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:bg-white rounded-xl px-4 py-3 text-[14px] outline-none font-medium text-gray-900 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1.5">Assunto</label>
                          <select 
                            value={formSubject}
                            onChange={(e) => setFormSubject(e.target.value)}
                            className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:bg-white rounded-xl px-4 py-3 text-[14px] outline-none font-semibold text-gray-700 transition-all cursor-pointer"
                          >
                            <option>Dúvida Geral</option>
                            <option>Bespoke / Sob Medida</option>
                            <option>Acompanhar Pedido</option>
                            <option>Showrooms / Lojas</option>
                            <option>Outros Assuntos</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-1.5">Como podemos ajudar?</label>
                          <textarea 
                            required 
                            rows={4}
                            placeholder="Descreva aqui sua dúvida de forma detalhada..."
                            value={formMessage}
                            onChange={(e) => setFormMessage(e.target.value)}
                            className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:bg-white rounded-xl px-4 py-3 text-[14px] outline-none font-medium text-gray-900 resize-none transition-all"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-3 bg-brand-blue hover:bg-[#0F172A] text-white rounded-full font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-brand-blue/10 shrink-0"
                          >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? "Enviando..." : "Enviar E-mail"}</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={handleWhatsAppSend}
                            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                          >
                            <MessageCircle className="w-4 h-4 text-white" />
                            <span>Falar via WhatsApp VIP</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Right Contacts Cards (5 columns) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center shrink-0 border border-brand-blue/10">
                        <Phone className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">Ligue-nos Agora</h4>
                        <p className="text-gray-900 text-sm font-semibold mb-1">(65) 3025-6505 <span className="text-xs text-gray-400 font-normal">ou</span> (65) 9 9254-9622</p>
                        <p className="text-gray-400 text-xs">Atendimento corporativo e consultoria premium.</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center shrink-0 border border-brand-blue/10">
                        <Mail className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">Endereço de E-mail</h4>
                        <p className="text-gray-900 text-sm font-semibold mb-1">financeiro@sonoecia.com.br</p>
                        <p className="text-gray-400 text-xs">Faturamento, propostas e financeiro.</p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center shrink-0 border border-brand-blue/10">
                        <Clock className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">Segunda a Sexta</h4>
                        <p className="text-gray-900 text-sm font-semibold mb-1">08h às 17h <span className="text-xs text-gray-400 font-normal">(não fecha para almoço)</span></p>
                        <p className="text-gray-400 text-xs">Sábado: Atendimento somente por agendamento.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'endereco' && (
                <motion.div 
                  key="endereco"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                    Visite um de nossos showrooms luxuosos e faça um teste sensorial completo de nossos colchões exclusivos, estofados ergonômicos e design de madeira nobre.
                  </p>

                  <div className="max-w-2xl">
                    {/* Showroom Sede */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAFAFA] rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center pr-6 pt-6">
                        <Building className="w-6 h-6 text-gray-200" />
                      </div>
                      
                      <div>
                        <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-brand-blue/20">
                          Showroom Sede & Loja Física
                        </span>
                        <h3 className="text-[20px] font-bold text-[#0F172A] mb-3 font-serif">Nosso Endereço</h3>
                        <p className="text-gray-600 text-[14.5px] mb-6 leading-relaxed max-w-xl">
                          Av. Marechal Deodoro, 1721 - Bairro Quilombo - CEP: 78020-670 <br/>
                          <span className="text-gray-400 text-xs font-medium">(Lateral Loja Emilly Atual)</span> - Cuiabá - MT
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                          <div className="space-y-2.5">
                            <h4 className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider">Contato & Atendimento</h4>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                              <Phone className="w-4 h-4 text-brand-blue shrink-0" /> 
                              <span>(65) 3025-6505</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                              <Phone className="w-4 h-4 text-brand-blue shrink-0" /> 
                              <span>(65) 9 9254-9622</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                              <Mail className="w-4 h-4 text-brand-blue shrink-0" /> 
                              <span className="break-all text-xs">financeiro@sonoecia.com.br</span>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <h4 className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider">Horário de Funcionamento</h4>
                            <div className="flex items-start gap-2 text-xs font-semibold text-[#475569]">
                              <Clock className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" /> 
                              <div>
                                <p className="font-bold">Segunda a Sexta:</p>
                                <p className="text-gray-500 font-medium text-[11px]">08h às 17h <span className="text-[10px] text-gray-400 block">(não fecha para almoço)</span></p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs font-semibold text-[#475569]">
                              <Calendar className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" /> 
                              <div>
                                <p className="font-bold">Sábado:</p>
                                <p className="text-gray-500 font-medium text-[11px]">Atendimento somente por agendamento</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-6 mt-6 flex items-center justify-between gap-4">
                        <button 
                          onClick={() => handleCopyText("Av. Marechal Deodoro, 1721, Bairro Quilombo, Cuiabá - MT, CEP 78020-670", 0)}
                          className="text-[13px] font-bold text-gray-400 hover:text-brand-blue flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedShowroom === 0 ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-600 font-bold">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copiar Endereço</span>
                            </>
                          )}
                        </button>
                        <a 
                          href="https://maps.google.com/?q=Av.+Marechal+Deodoro,+1721+-+Bairro+Quilombo+-+Cuiaba+-+MT" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[13px] font-extrabold text-[#0D1B2A] hover:text-brand-blue flex items-center gap-1.5 transition-colors"
                        >
                          <span>Como Chegar</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-blue/5 border border-brand-blue/10 p-4 rounded-xl flex items-start gap-3 mt-4 animate-fade-in max-w-2xl">
                    <Sparkles className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                    <p className="text-brand-blue text-xs font-semibold leading-relaxed">
                      <strong>Estacionamento Privativo Cortesia:</strong> Nosso showroom conta com estacionamento privativo e atendimento totalmente personalizado com agendamento VIP para o seu conforto absoluto e tranquilidade durante as suas decisões de sono.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sobre' && (
                <motion.div 
                  key="sobre"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 max-w-3xl"
                >
                  <p className="text-gray-700 text-[15px] font-medium leading-relaxed font-serif text-justify">
                    &quot;Desde a nossa fundação em 1998, a Sono &amp; Cia estabelece o compromisso inabalável de converter as horas de repouso em rituais diários de altíssimo luxo, elegância e revitalização. Entendemos que dormir não é uma mera necessidade mecânica, mas sim uma arte sublime que dita a excelência da saúde do corpo e do espírito.&quot;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="text-brand-blue font-bold text-3xl mb-1 flex items-center justify-center font-serif">25+</div>
                      <div className="text-[#0F172A] font-extrabold text-[12px] uppercase tracking-wider">Anos de Histórias</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="text-brand-blue font-bold text-3xl mb-1 flex items-center justify-center font-serif">100%</div>
                      <div className="text-[#0F172A] font-extrabold text-[12px] uppercase tracking-wider">Madeiras Ecológicas</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                      <div className="text-brand-blue font-bold text-3xl mb-1 flex items-center justify-center font-serif">15k+</div>
                      <div className="text-[#0F172A] font-extrabold text-[12px] uppercase tracking-wider">Lares Transformados</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="font-serif font-bold text-[18px] text-[#0F172A]">Pilares da Nossa Curadoria de Luxo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-brand-blue font-bold text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Marcenaria sob Medida
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Estruturas forjadas com mós de reflorestamento, cortes computadorizados e junções precisas de altíssima durabilidade.
                        </p>
                      </div>
                      <div className="bg-white/80 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-brand-blue font-bold text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Ciência do Sono Avançada
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          Colchões com zoneamento ergonômico, espumas de densidade progressiva inteligente e termorregulação de grafeno.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'central-ajuda' && (
                <motion.div 
                  key="central-ajuda"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 flex flex-col h-full"
                >
                  {/* Search Bar FAQ */}
                  <div className="bg-white rounded-xl border border-gray-200/80 px-4 py-3 flex items-center shadow-sm w-full max-w-md shrink-0">
                    <Search className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar dúvidas frequentes..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-[14px] text-[#0F172A] placeholder-gray-400 font-medium"
                    />
                    {faqSearch && (
                      <button onClick={() => setFaqSearch("")} className="text-gray-400 hover:text-[#0F172A]">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Accordeon Items */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, index) => {
                        const isExpanded = expandedFaq === index;
                        return (
                          <div 
                            key={index}
                            className="bg-white border rounded-xl border-gray-100 overflow-hidden shadow-sm transition-all duration-300"
                          >
                            <button
                               onClick={() => setExpandedFaq(isExpanded ? null : index)}
                              className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-sm text-[#0F172A] hover:bg-[#FAF9FB] transition-colors"
                            >
                              <span className="pr-4">{faq.q}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-brand-blue shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                              )}
                            </button>
                            
                            <div 
                              className={`transition-all duration-300 ease-in-out ${
                                isExpanded ? 'max-h-56 border-t border-gray-50/80 py-4 px-5 bg-gray-50/30' : 'max-h-0 pointer-events-none'
                              } overflow-hidden`}
                            >
                              <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-gray-400">
                        Nenhuma resposta encontrada para sua busca. Use termos mais curtos ou entre em contato direto pelo formulário!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'politica' && (
                <motion.div 
                  key="politica"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 max-h-[420px] overflow-y-auto pr-2 text-gray-600 text-xs md:text-sm leading-relaxed"
                >
                  <p className="font-semibold text-gray-800">Última atualização: Junho de 2026</p>
                  <p>
                    A Sono &amp; Cia valoriza profundamente a privacidade e as escolhas de dados de seus clientes. Esta política estabelece de forma clara nossos compromissos com a Lei Geral de Proteção de Dados Pessoais (LGPD).
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">1. Coleta de Informações</h4>
                  <p>
                    Coletamos dados estritamente necessários para viabilizar o processamento de pedidos, entrega agendada e pós-venda personalizado. Isso emoldura: Nome completo, Cadastro de Pessoa Física (CPF), e-mail corporativo ou residencial, telefones e endereço geográfico detalhado.
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">2. Compartilhamento de Dados</h4>
                  <p>
                    Nunca negociamos, vendemos ou compartilhamos os dados de nossos seletos usuários para campanhas de marketing externas. Os dados fornecidos são partilhados estritamente com faturamento fiscal e empresas logísticas dedicadas à montagem residencial dos móveis encomendados.
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">3. Seus Direitos de Privacidade</h4>
                  <p>
                    Você pode, a qualquer instante, revogar seu termo de consentimento, solicitar o congelamento ou exclusão integral de seu cadastro em nossa base corporativa escrevendo para o correio oficial <em>contato@sonoecia.com.br</em>.
                  </p>
                </motion.div>
              )}

              {activeTab === 'termos' && (
                <motion.div 
                  key="termos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 max-h-[420px] overflow-y-auto pr-2 text-gray-600 text-xs md:text-sm leading-relaxed"
                >
                  <p className="font-semibold text-gray-800">Vigência a partir de: Junho de 2026</p>
                  <p>
                    Ao navegar por este portal de luxo ou encomendar obras na Sono &amp; Cia, você se prontifica a aceitar as seguintes condutas contratuais:
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">1. Produção Customizada Bespoke</h4>
                  <p>
                    No caso de estofados, sofás e camas sob medida fabricados especialmente para as escolhas de tecidos especificadas no fechamento, as plantas de marcenaria entram em vigor no dia subsequente ao pagamento. Ajustes dimensionais subsequentes podem acarretar acréscimos proporcionais no cronograma produtivo original.
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">2. Responsabilidade do Local de Entrega</h4>
                  <p>
                    Para acomodamento de grandes móveis de madeira ou cabeceiras extensas, o comprador é responsável por verificar se as passagens físicas, portas, elevadores e escadarias atendem à envergadura do produto solicitado. Nossa equipe realiza montagem terrestre, mas não içamos produtos por fachadas externas prediais.
                  </p>
                  <h4 className="font-bold text-gray-950 mt-4 text-[14px] uppercase tracking-wider">3. Métodos e prazos de Envio</h4>
                  <p>
                    Os prazos informados nas páginas promocionais referem-se à estimativa média logística e produtiva. Em caso de causas impeditivas imprevisíveis da natureza ou vias bloqueadas, nosso concierge entrará em contato fone para refazer o agendamento logístico mais assertivo para seu conforto.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
