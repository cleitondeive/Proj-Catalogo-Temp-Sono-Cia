import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Check, 
  MessageCircle, 
  User, 
  Users, 
  Activity, 
  Compass, 
  Info,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Product } from '../types';

interface MattressQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  whatsappNumber: string;
}

export default function MattressQuizModal({
  isOpen,
  onClose,
  products = [],
  onQuickView,
  onAddToCart,
  whatsappNumber
}: MattressQuizModalProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<'single' | 'couple' | null>(null);
  const [weight, setWeight] = useState<string | null>(null);
  const [firmness, setFirmness] = useState<'soft' | 'medium' | 'firm' | null>(null);
  const [position, setPosition] = useState<string | null>(null);

  const stepsCount = 4;

  const handleReset = () => {
    setStep(1);
    setProfile(null);
    setWeight(null);
    setFirmness(null);
    setPosition(null);
  };

  // Weight options based on usage
  const singleWeightOptions = [
    { label: 'Até 70 kg', value: '70kg', desc: 'Densidade sugerida D28 ou Molas Macias' },
    { label: '70 kg a 95 kg', value: '95kg', desc: 'Densidade sugerida D33 ou Molas Ensacadas Pocket' },
    { label: '95 kg a 120 kg', value: '120kg', desc: 'Densidade sugerida D45 ou Molas Superpocket de alta resistência' },
    { label: 'Acima de 120 kg', value: '150kg', desc: 'Estruturas de Molas Ortopédicas ou Espuma de Altíssima Densidade' }
  ];

  const coupleWeightOptions = [
    { label: 'Até 150 kg combinados', value: '70kg', desc: 'Molas Ensacadas Pocket (não transfere movimentos)' },
    { label: '150 kg a 200 kg combinados', value: '95kg', desc: 'Molas Pocket de alta sustentação ou D33 firme' },
    { label: '200 kg a 250 kg combinados', value: '120kg', desc: 'Molas Super Pocket reforçadas ou dupla camada de espuma' },
    { label: 'Acima de 250 kg combinados', value: '150kg', desc: 'Estrutura ortopédica premium ou D45/D50 luxo' }
  ];

  const weightOptions = profile === 'couple' ? coupleWeightOptions : singleWeightOptions;

  const firmnessOptions = [
    { 
      label: 'Firme / Ortopédico', 
      value: 'firm' as const, 
      desc: 'Máximo suporte para alinhamento da coluna e dores nas costas',
      tag: 'Suporte Máximo'
    },
    { 
      label: 'Intermediário / Equilibrado', 
      value: 'medium' as const, 
      desc: 'O equilíbrio perfeito entre o aconchego e a estabilidade postural',
      tag: 'Mais Procurado'
    },
    { 
      label: 'Macio / Aconchegante', 
      value: 'soft' as const, 
      desc: 'Sensação de flutuação, abraça os contornos do corpo com suavidade',
      tag: 'Nuvem Real'
    }
  ];

  const positionOptions = [
    { label: 'Dormir de Lado', value: 'lateral', desc: 'Requer alívio de pressão nos ombros e quadril' },
    { label: 'Dormir de Costas', value: 'supina', desc: 'Requer suporte firme na região lombar' },
    { label: 'Dormir de Bruços', value: 'pronada', desc: 'Requer superfície que evite curvar a espinha' },
    { label: 'Costumo variar de posição', value: 'mista', desc: 'Opção excelente de alta resiliência dinâmica' }
  ];

  // Calculated Results
  const result = useMemo(() => {
    if (step <= stepsCount) return null;

    let densidadeSugerida = '';
    let medidasRecomendadas = [] as string[];
    let tecnologiaDestaque = '';

    // Calculate density based on weight and profile
    if (weight === '70kg') {
      densidadeSugerida = 'D28 Soft ou Molas Ensacadas Adaptativas';
      tecnologiaDestaque = 'Molas Ensacadas (Pocket) Flex ou Espuma D28 Premium';
    } else if (weight === '95kg') {
      densidadeSugerida = 'D33 Pro ou Molas Ensacadas Independentes';
      tecnologiaDestaque = 'Molas Ensacadas Pocket Independentes com Pillow Top Generoso';
    } else if (weight === '120kg') {
      densidadeSugerida = 'D45 Firmeza Máxima ou Molas Extra Suporte';
      tecnologiaDestaque = 'Molas LFK ou Superpocket Reforçadas com Espuma de Alta Resilience (HR)';
    } else {
      densidadeSugerida = 'D45 Ortopédica ou Molas de Titânio';
      tecnologiaDestaque = 'Estrutura Ortopédica Multicamadas ou Molas Reforçadas com Placas de EPS e Látex';
    }

    // Adapt firmness
    if (firmness === 'soft') {
      tecnologiaDestaque += ' + Pillow Top de Látex Natural ou Viscoelástico (Nasa)';
    } else if (firmness === 'firm') {
      tecnologiaDestaque += ' + Isolamento Estrutural Firme';
    }

    if (profile === 'single') {
      medidasRecomendadas = ['Solteiro (0.88m x 1.88m)', 'Solteiro Americano (1.00m x 2.00m)', 'Viúva (1.28m x 1.88m)'];
    } else {
      medidasRecomendadas = ['Casal Padrão (1.38m x 1.88m)', 'Queen Size (1.58m x 1.98m)', 'King Size (1.93m x 2.03m)'];
    }

    // Query actual matching products in current store catalog
    // Find mattress cards
    const matches = products.filter(p => {
      if (p.status !== 'active') return false;
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const name = p.name.toLowerCase();

      const isMattress = cat.includes('colch') || cat.includes('cama') || name.includes('colch') || name.includes('cama');
      if (!isMattress) return false;

      // check firmness
      if (firmness === 'firm' && (desc.includes('firme') || name.includes('firme') || desc.includes('ortopé'))) return true;
      if (firmness === 'soft' && (desc.includes('macio') || desc.includes('látex') || desc.includes('pillow') || desc.includes('nasa'))) return true;
      if (firmness === 'medium' && (desc.includes('intermediário') || desc.includes('pocket') || desc.includes('equilibrado'))) return true;

      return true;
    }).slice(0, 3);

    // Fallback if no specific tags found
    const finalRecommendations = matches.length > 0 ? matches : products.filter(p => p.status === 'active' && (p.category || '').toLowerCase().includes('colch')).slice(0, 3);

    return {
      densidadeSugerida,
      medidasRecomendadas,
      tecnologiaDestaque,
      matches: finalRecommendations
    };
  }, [step, profile, weight, firmness, position, products]);

  const handleSendToWhatsApp = () => {
    if (!result) return;
    const profileTxt = profile === 'couple' ? 'Casal / Cônjuges' : 'Solteiro Masculino/Feminino';
    const weightTxt = weightOptions.find(o => o.value === weight)?.label || weight;
    const firmnessTxt = firmnessOptions.find(o => o.value === firmness)?.label || firmness;
    const positionTxt = positionOptions.find(o => o.value === position)?.label || position;

    const recommendedModels = result.matches.map(m => `- *${m.name}* (${m.showPrice !== false ? 'R$ ' + m.price : 'Sob Consulta'})`).join('\n');

    const message = `*DIAGNÓSTICO VIP - COLCHÃO IDEAL*
    
👤 *Perfil de Uso:* ${profileTxt}
⚖️ *Peso Corporal:* ${weightTxt}
☁️ *Tipo de Firmeza:* ${firmnessTxt}
💤 *Posição de Sono:* ${positionTxt}

*RECOMENDAÇÃO TÉCNICA:*
🛏️ *Crescimento/Suporte:* ${result.densidadeSugerida}
🌟 *Tecnologia Sugerida:* ${result.tecnologiaDestaque}
📏 *Medida Ideal:* ${result.medidasRecomendadas.join(' ou ')}

*MODELOS DO CATÁLOGO RECOMENDADOS:*
${recommendedModels}

Gostaria de saber a disponibilidade de entrega e valores promocionais de fábrica para estes modelos recomendados!`;

    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/60 backdrop-blur-md z-[110] flex items-center justify-center p-3 md:p-4 text-left">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[680px] max-h-[92vh] overflow-hidden flex flex-col border border-gray-100 relative">
        
        {/* Decorative Golden Ambient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

        {/* Header */}
        <div className="px-5 py-4 md:px-7 md:py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base md:text-lg text-[#0F172A]">Simulador de Sono VIP</h3>
              <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Encontre o colchão milimétrico ideal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step <= stepsCount && (
          <div className="px-5 md:px-7 pt-4 pb-2 bg-white flex items-center justify-between">
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Passo {step} de {stepsCount}
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-350 ${
                    i < step 
                      ? 'w-6 bg-amber-500' 
                      : i === step 
                        ? 'w-8 bg-amber-500 animate-pulse' 
                        : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Body Area */}
        <div className="p-5 md:p-7 flex-1 overflow-y-auto no-scrollbar">
          
          {/* STEP 1: Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center md:text-left">
                <h4 className="font-serif font-bold text-lg md:text-xl text-[#0F172A]">Para quem se destina o novo colchão?</h4>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Sua configuração determina a distribuição de movimentos e peso.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <button
                  onClick={() => { setProfile('single'); handleNext(); }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-350 cursor-pointer flex flex-col justify-between h-[160px] group ${
                    profile === 'single'
                      ? 'border-amber-500 bg-amber-50/20 shadow-xs'
                      : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    profile === 'single' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 group-hover:bg-amber-100/50 group-hover:text-amber-600'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm md:text-base text-gray-800 transition-colors group-hover:text-amber-600">Uso Individual</h5>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Solteiro, solteirão, viúva ou beliche sob medida.</p>
                  </div>
                </button>

                <button
                  onClick={() => { setProfile('couple'); handleNext(); }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-350 cursor-pointer flex flex-col justify-between h-[160px] group ${
                    profile === 'couple'
                      ? 'border-amber-500 bg-amber-50/20 shadow-xs'
                      : 'border-gray-150 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    profile === 'couple' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 group-hover:bg-amber-100/50 group-hover:text-amber-600'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm md:text-base text-gray-800 transition-colors group-hover:text-amber-600">Casal / Compartilhado</h5>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Dois cônjuges. Isolamento de ruído e estabilidade a dois.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Weight selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif font-bold text-lg md:text-xl text-[#0F172A]">Qual o peso corporal do usuário?</h4>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  {profile === 'couple' 
                    ? 'Selecione a faixa correspondente ao maior peso individual ou o somatório aproximado do casal.' 
                    : 'Para biotipo de solteiro. A densidade de sustentação ideal depende diretamente do peso.'}
                </p>
              </div>

              <div className="space-y-2.5">
                {weightOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setWeight(opt.value); handleNext(); }}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      weight === opt.value
                        ? 'border-amber-500 bg-amber-50/20'
                        : 'border-gray-150 hover:border-amber-200 hover:bg-amber-50/5'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <p className={`text-xs md:text-sm font-bold transition-colors ${
                        weight === opt.value ? 'text-amber-600 font-extrabold' : 'text-gray-800'
                      }`}>{opt.label}</p>
                      <p className="text-[10.5px] md:text-xs text-gray-400 font-semibold mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      weight === opt.value ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
                    }`}>
                      {weight === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Firmness preferences */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif font-bold text-lg md:text-xl text-[#0F172A]">Qual a sua preferência de conforto?</h4>
                <p className="text-gray-500 text-xs md:text-sm mt-1">A sensação que você deseja sentir ao deitar à noite para repousar.</p>
              </div>

              <div className="space-y-2.5">
                {firmnessOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFirmness(opt.value); handleNext(); }}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      firmness === opt.value
                        ? 'border-amber-500 bg-amber-50/20 shadow-xs'
                        : 'border-gray-150 hover:border-amber-200 hover:bg-amber-50/5'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs md:text-sm font-bold transition-colors ${
                          firmness === opt.value ? 'text-amber-600 font-extrabold' : 'text-gray-800'
                        }`}>{opt.label}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider">
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-[10.5px] md:text-xs text-gray-400 font-semibold mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      firmness === opt.value ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
                    }`}>
                      {firmness === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Position prefered */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-serif font-bold text-lg md:text-xl text-[#0F172A]">Como você costuma dormir a maior parte do tempo?</h4>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Sua postura de repouso determina os pontos de pressão corporal críticos.</p>
              </div>

              <div className="space-y-2.5">
                {positionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setPosition(opt.value); handleNext(); }}
                    className={`w-full p-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      position === opt.value
                        ? 'border-amber-500 bg-amber-50/20'
                        : 'border-gray-150 hover:border-amber-200 hover:bg-amber-50/5'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <p className={`text-xs md:text-sm font-bold transition-colors ${
                        position === opt.value ? 'text-amber-600 font-extrabold' : 'text-gray-800'
                      }`}>{opt.label}</p>
                      <p className="text-[10.5px] md:text-xs text-gray-400 font-semibold mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      position === opt.value ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300'
                    }`}>
                      {position === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESULT STEP */}
          {step > stepsCount && result && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center pb-2 border-b border-gray-100">
                <div className="inline-flex w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 items-center justify-center text-white mb-2 shadow-md animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-black text-xl md:text-2xl text-gray-900">Seu Diagnóstico Sono VIP está Pronto</h4>
                <p className="text-gray-400 font-semibold text-[10.5px] uppercase tracking-widest mt-1">Especificações Técnicas Calculadas</p>
              </div>

              {/* Specification Grid */}
              <div className="bg-[#FAF9F5] border border-[#FEF3C7]/60 rounded-2xl p-4.5 space-y-4 shadow-xs">
                <div>
                  <h5 className="text-[10px] uppercase font-black text-amber-600 tracking-widest mb-1.5">Conforto & Sustentação Sugerida</h5>
                  <p className="text-gray-900 font-bold text-sm md:text-base">{result.densidadeSugerida}</p>
                  <p className="text-gray-500 font-medium text-xs mt-0.5">{result.tecnologiaDestaque}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 border-t border-amber-200/20">
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-amber-600 tracking-widest mb-1">Medida Ideal Sugerida</h5>
                    <ul className="space-y-1">
                      {result.medidasRecomendadas.map((m, i) => (
                        <li key={i} className="text-xs text-gray-700 font-bold flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-black text-amber-600 tracking-widest mb-1">Dica de Conservação VIP</h5>
                    <p className="text-gray-500 font-medium text-[11px] leading-relaxed">
                      Girar o colchão a cada 15 dias nos primeiros 3 meses maximiza a adaptação e prolonga a durabilidade reparadora.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Mattress Matches from internal DB */}
              {result.matches.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-[10.5px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-4.5 h-4.5 text-amber-500" />
                    <span>Modelos Recomendados para Você:</span>
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.matches.map((item) => {
                      const finalDiscount = item.originalPrice && item.price && item.originalPrice !== item.price
                        ? Math.round((1 - parseFloat(item.price.replace(/[^\d]/g, '')) / parseFloat(item.originalPrice.replace(/[^\d]/g, ''))) * 100)
                        : 0;

                      return (
                        <div 
                          key={item.id} 
                          className="bg-white border border-gray-120 hover:border-amber-400 hover:shadow-md rounded-xl p-2.5 flex md:flex-col gap-2.5 md:gap-2 transition-all group relative overflow-hidden"
                        >
                          <div className="w-20 h-20 md:w-full md:h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                            {finalDiscount > 0 && (
                              <span className="absolute bottom-1 left-1 bg-[#E11D48] text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">
                                {finalDiscount}% OFF
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 shrink-0 flex flex-col justify-between text-left">
                            <div className="min-w-0">
                              <p className="text-[9px] text-[#D97706] font-bold uppercase">{item.category}</p>
                              <p className="text-[11.5px] md:text-xs font-black text-gray-800 line-clamp-1 group-hover:text-amber-600 transition-colors">{item.name}</p>
                              <p className="text-[11px] font-black text-brand-blue mt-0.5">
                                {item.showPrice !== false ? `R$ ${item.price}` : 'Consulte'}
                              </p>
                            </div>

                            <div className="flex gap-1.5 mt-2">
                              <button 
                                onClick={() => onQuickView(item)}
                                className="p-1 px-2.5 rounded-lg border border-gray-150 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Espiar</span>
                              </button>
                              
                              {item.showPrice !== false && (
                                <button 
                                  onClick={(e) => onAddToCart(item, e)}
                                  className="p-1 px-2 hover:translate-y-[-0.5px] rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  <span>Gostei</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-4 md:px-7 md:py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={handleBack}
                className="py-2 px-4 hover:bg-gray-200/70 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step <= stepsCount ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !profile) ||
                  (step === 2 && !weight) ||
                  (step === 3 && !firmness) ||
                  (step === 4 && !position)
                }
                className="py-2.5 px-5 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border-none"
              >
                <span>Avançar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50/5 text-gray-600 hover:text-amber-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Refazer Quiz
                </button>

                <button
                  onClick={handleSendToWhatsApp}
                  className="py-2.5 px-5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold rounded-xl shadow-lg hover:shadow-emerald-100/30 flex items-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Chamar Assessor VIP</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
