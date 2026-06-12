import React, { useState, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShoppingCart, 
  MessageCircle, 
  Search, 
  Check, 
  Info, 
  ChevronRight,
  Eye,
  ArrowRightLeft
} from 'lucide-react';
import { Product } from '../types';

interface PriceComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProductIds: string[];
  onAddProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onQuickView: (product: Product) => void;
  whatsappNumber: string;
}

export default function PriceComparatorModal({
  isOpen,
  onClose,
  products = [],
  selectedProductIds = [],
  onAddProduct,
  onRemoveProduct,
  onClearAll,
  onAddToCart,
  onQuickView,
  whatsappNumber
}: PriceComparatorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  // Active products to display in slots (max 4)
  const comparedProducts = useMemo(() => {
    return selectedProductIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  }, [selectedProductIds, products]);

  // Available products for adding (not already compared and active)
  const availableToCompare = useMemo(() => {
    return products.filter(
      p => p.status === 'active' && !selectedProductIds.includes(p.id)
    );
  }, [products, selectedProductIds]);

  // Filtered available products based on search in popover
  const filteredAvailable = useMemo(() => {
    if (!searchQuery.trim()) return availableToCompare;
    const lower = searchQuery.toLowerCase();
    return availableToCompare.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      (p.category && p.category.toLowerCase().includes(lower))
    );
  }, [availableToCompare, searchQuery]);

  // Parse price string like "3.490,00" to Float for calculations
  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return Infinity;
    const cleaned = priceStr.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? Infinity : parsed;
  };

  // Find cheapest compared product
  const cheapestProductId = useMemo(() => {
    if (comparedProducts.length <= 1) return null;
    let minPrice = Infinity;
    let cheapestId = null;

    comparedProducts.forEach(p => {
      if (p.showPrice !== false) {
        const price = parsePrice(p.price);
        if (price < minPrice) {
          minPrice = price;
          cheapestId = p.id;
        }
      }
    });

    return cheapestId;
  }, [comparedProducts]);

  // Calculate installment simulated price (up to 10 interest free)
  const getInstallment = (priceStr: string | undefined) => {
    const val = parsePrice(priceStr);
    if (val === Infinity || isNaN(val)) return null;
    const monthly = (val / 10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return `10x de ${monthly} sem juros`;
  };

  // Check if a row's values are identical across all compared products
  const hasDifference = (fieldAccessor: (p: Product) => any) => {
    if (comparedProducts.length <= 1) return true;
    const firstVal = fieldAccessor(comparedProducts[0]);
    return !comparedProducts.every(p => fieldAccessor(p) === firstVal);
  };

  // Trigger custom pre-filled WhatsApp link comparing selected products
  const handleConsultWhatsApp = (prod?: Product) => {
    let msg = '';
    if (prod) {
      msg = `Olá! Estive analisando o modelo *${prod.name}* no comparador de preços e gostaria de conversar sobre tamanhos sob medida e entrega.`;
    } else {
      const names = comparedProducts.map(p => `- ${p.name}`).join('\n');
      msg = `Olá Sono & Cia! Estou utilizando o Comparador de Preços do site e gostaria de tirar dúvidas e receber mais especificações sobre estes modelos:\n${names}`;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Spec rows structure
  const specRows = [
    {
      label: 'Preço Médio à Vista',
      key: 'price',
      accessor: (p: Product) => p.showPrice !== false ? `R$ ${p.price}` : 'Sob Consulta',
      highlightCheapest: true
    },
    {
      label: 'Opções de Parcelamento',
      key: 'installments',
      accessor: (p: Product) => p.showPrice !== false ? getInstallment(p.price) : 'Consulte condições'
    },
    {
      label: 'Desconto / Tag',
      key: 'tag',
      accessor: (p: Product) => p.tag || 'Sem desconto ativo'
    },
    {
      label: 'Categoria Curada',
      key: 'category',
      accessor: (p: Product) => p.category
    },
    {
      label: 'Largura',
      key: 'width',
      accessor: (p: Product) => p.width ? `${p.width}m` : 'Sob Medida / Personalizável'
    },
    {
      label: 'Comprimento',
      key: 'length',
      accessor: (p: Product) => p.length ? `${p.length}m` : 'Sob Medida / Personalizável'
    },
    {
      label: 'Altura / Espessura',
      key: 'height',
      accessor: (p: Product) => p.height ? `${p.height}m` : 'Padrão Regulável'
    },
    {
      label: 'Código de Fabricação (SKU)',
      key: 'sku',
      accessor: (p: Product) => p.sku || 'Disponível sob encomenda'
    },
    {
      label: 'Cores Disponíveis',
      key: 'colors',
      accessor: (p: Product) => p.colors && p.colors.length > 0 
        ? p.colors.map(c => c.name).join(', ') 
        : 'Consultar paleta de tecidos'
    },
    {
      label: 'Status de Estoque',
      key: 'stock',
      accessor: (p: Product) => p.stock && p.stock > 0 ? `${p.stock} unidades disponíveis` : 'Somente sob encomenda'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/60 backdrop-blur-md z-[110] flex items-center justify-center p-3 md:p-4 animate-fade-in text-left">
      {/* Container */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1240px] max-h-[94vh] md:max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
        
        {/* Modal Header */}
        <div className="px-4 py-4 md:px-8 md:py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8F9FA]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-sm shrink-0">
              <ArrowRightLeft className="w-4.5 h-4.5 md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg md:text-2xl text-[#0F172A] leading-tight">Comparador de Modelos VIP</h2>
              <p className="text-gray-500 text-[11px] md:text-sm mt-0.5 leading-snug">Analise paralelamente e descubra o modelo perfeito para sua noite reparadora.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap justify-between w-full md:w-auto mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              {comparedProducts.length > 1 && (
                <button
                  onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                  className={`py-1.5 px-2.5 md:px-4 rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showOnlyDifferences 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Diferenças</span>
                </button>
              )}

              {comparedProducts.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="py-1.5 px-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] md:text-xs font-bold transition-colors cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-auto md:ml-0"
              aria-label="Confirmar e Fechar"
            >
              <X className="w-5.5 h-5.5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Modal Core Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          
          {/* Empty State Banner when no products are selected */}
          {comparedProducts.length === 0 ? (
            <div className="py-10 px-4 md:py-16 md:px-6 text-center max-w-[620px] mx-auto flex flex-col items-center">
              <div className="w-16 h-16 md:w-22 md:h-22 rounded-full bg-[#F1F5F9] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 mb-6 md:mb-8 animate-pulse shrink-0">
                <ArrowRightLeft className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <h3 className="font-serif font-bold text-xl md:text-2xl text-[#0F172A] mb-3">Escolha e Compare Seus Favoritos</h3>
              <p className="text-gray-500 text-xs md:text-[15px] leading-relaxed mb-6 md:mb-8">
                Crie combinações exclusivas de colchões de altíssima tecnologia, estofados sob medida e acessórios de luxo, visualizando preços e medidas em tempo real.
              </p>

              {/* Quick List triggers adding products */}
              <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 md:p-5 text-left">
                <h4 className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recomendados para iniciar:</h4>
                <div className="space-y-2 max-h-[180px] md:max-h-[220px] overflow-y-auto pr-1">
                  {products.slice(0, 5).map(prod => (
                    <button
                      key={prod.id}
                      onClick={() => onAddProduct(prod.id)}
                      className="w-full flex items-center justify-between text-left p-2 rounded-xl bg-white border border-gray-100 hover:border-brand-blue/30 hover:shadow-xs transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-9 h-9 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate group-hover:text-brand-blue transition-colors">{prod.name}</p>
                          <p className="text-[10px] font-semibold text-gray-400 capitalize">{prod.category} • {prod.showPrice !== false ? `R$ ${prod.price}` : 'Sob Consulta'}</p>
                        </div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-brand-blue shrink-0 group-hover:scale-125 transition-transform ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            
            /* Responsive Grid Table - horizontal scroll container */
            <div className="w-full overflow-x-auto relative scrollbar-thin">
              <div className="min-w-[980px] lg:min-w-0 lg:w-full">
                <table className="w-full table-fixed border-collapse">
                  
                  {/* Visual Head Columns (Product Info cards sticky) */}
                  <thead className="sticky top-0 bg-white z-10 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                    <tr className="border-b border-gray-100">
                      {/* Index Label placeholder column (25% weight on desktop) */}
                      <th className="w-[150px] md:w-[20%] bg-[#F8F9FA] p-4 font-serif text-left text-[11px] font-black text-gray-400 uppercase tracking-widest align-bottom">
                        Modelo & Specs
                      </th>

                      {/* Columns for up to 4 compared products */}
                      {[0, 1, 2, 3].map(index => {
                        const prod = comparedProducts[index];

                        if (!prod) {
                          return (
                            <th key={`empty-col-${index}`} className="p-4 align-top w-[210px] md:w-[20%] border-l border-gray-100 bg-[#FAFAFC]/40">
                              <div className="relative h-full py-2">
                                <button
                                  onClick={() => setActiveSlotIndex(index)}
                                  className="w-full h-[200px] md:h-[240px] rounded-[20px] border-2 border-dashed border-gray-200 hover:border-brand-blue/40 flex flex-col items-center justify-center p-4 text-center bg-white hover:bg-gray-50/50 transition-all group cursor-pointer shadow-xs"
                                >
                                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-brand-blue/5 flex items-center justify-center shadow-xs border border-brand-blue/10 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all mb-3">
                                    <Plus className="w-4.5 h-4.5 text-brand-blue" />
                                  </div>
                                  <span className="text-xs md:text-[13px] font-bold text-gray-800">Adicionar</span>
                                  <span className="text-[9.5px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Comparar</span>
                                </button>

                                {/* Dropdown container inside empty column */}
                                {activeSlotIndex === index && (
                                  <div className="absolute top-[102%] left-0 right-0 max-h-[320px] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl z-20 p-3.5 flex flex-col animate-fade-in">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                      <input
                                        type="text"
                                        placeholder="Pesquisar catálogo..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="text-xs bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-400 font-medium"
                                        autoFocus
                                      />
                                      <button onClick={() => setActiveSlotIndex(null)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div className="space-y-1.5 overflow-y-auto flex-1 no-scrollbar max-h-[220px]">
                                      {filteredAvailable.length === 0 ? (
                                        <p className="text-[10px] text-gray-400 py-3 text-center font-bold">Nenhum disponível</p>
                                      ) : (
                                        filteredAvailable.map(item => (
                                          <button
                                            key={item.id}
                                            onClick={() => {
                                              onAddProduct(item.id);
                                              setActiveSlotIndex(null);
                                              setSearchQuery('');
                                            }}
                                            className="w-full flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-xl text-left transition-colors cursor-pointer group"
                                          >
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0 bg-gray-50" 
                                              referrerPolicy="no-referrer"
                                            />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-[11px] font-bold text-gray-800 truncate group-hover:text-brand-blue transition-colors">{item.name}</p>
                                              <p className="text-[9.5px] text-gray-400 font-bold capitalize leading-none">{item.category}</p>
                                            </div>
                                          </button>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </th>
                          );
                        }

                        const discount = prod.originalPrice && prod.price && prod.originalPrice !== prod.price
                          ? Math.round((1 - parsePrice(prod.price) / parsePrice(prod.originalPrice)) * 100)
                          : 0;

                        return (
                          <th key={prod.id} className="p-4 align-top w-[210px] md:w-[20%] border-l border-gray-100 relative group bg-white">
                            <div className="absolute top-2.5 right-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                              <button
                                onClick={() => onRemoveProduct(prod.id)}
                                className="w-7 h-7 bg-white hover:bg-red-50 border border-gray-150 hover:border-red-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md transition-all cursor-pointer hover:scale-105"
                                title="Remover comparação"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex flex-col text-left">
                              {/* Product Thumb */}
                              <div className="w-full h-28 md:h-32 bg-gray-55 rounded-xl overflow-hidden relative mb-3 border border-gray-100 group-hover:shadow-xs transition-shadow shrink-0">
                                <img 
                                  src={prod.image} 
                                  alt={prod.name} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  referrerPolicy="no-referrer"
                                />
                                {discount > 0 && (
                                  <span className="absolute bottom-2 left-2 bg-[#E11D48] text-white text-[8.5px] md:text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase leading-none shadow-xs">
                                    {discount}% OFF
                                  </span>
                                )}
                                {prod.isPromoted && (
                                  <span className="absolute top-2 left-2 bg-[#D97706] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider leading-none shadow-xs">
                                    VIP
                                  </span>
                                )}
                              </div>

                              {/* Product Title inside Header */}
                              <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">{prod.category}</p>
                              <h4 className="font-serif font-bold text-gray-950 text-[12.5px] md:text-[14px] leading-snug line-clamp-2 h-[38px] group-hover:text-brand-blue/90 transition-colors">
                                {prod.name}
                              </h4>
                              
                              {/* Quick visual rating / pricing context */}
                              <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                                {prod.showPrice !== false ? (
                                  <div className="flex items-baseline gap-0.5">
                                    <span className="text-brand-blue/60 text-[9px] font-extrabold uppercase">R$</span>
                                    <span className="text-brand-blue font-serif font-black text-[14.5px] md:text-[17px] leading-none">
                                      {prod.price}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[#059669] text-[10px] md:text-[11.5px] font-black uppercase tracking-wider leading-none">
                                    Sob Consulta
                                  </span>
                                )}
                                {cheapestProductId === prod.id && (
                                  <span className="bg-emerald-50 text-[#059669] text-[8.5px] md:text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5 shadow-xs">
                                    <Check className="w-2.5 h-2.5 shrink-0" /> Oferta
                                  </span>
                                )}
                              </div>

                              {/* CTAs inside sticky column */}
                              <div className="mt-4 flex flex-col gap-2">
                                {prod.showPrice !== false ? (
                                  <button
                                    onClick={(e) => onAddToCart(prod, e)}
                                    className="w-full py-2 px-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-[10px] md:text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-brand-blue/15 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                                  >
                                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                                    <span>Adicionar</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleConsultWhatsApp(prod)}
                                    className="w-full py-2 px-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-[10.5px] md:text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-[#10B981]/15 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>WhatsApp VIP</span>
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => onQuickView(prod)}
                                  className="w-full py-1.5 px-2 bg-white border border-gray-150 hover:border-gray-300 text-gray-500 hover:text-gray-800 text-[10px] md:text-[11px] font-bold flex items-center justify-center gap-1 rounded-xl shadow-xs transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3 h-3 shrink-0" />
                                  <span>Detalhes</span>
                                </button>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* Comparison Specs Rows */}
                  <tbody>
                    {specRows.map((row) => {
                      const rowDiff = hasDifference(row.accessor);
                      
                      // Filter out rows that are identical if the user enabled "Show Only Differences"
                      if (showOnlyDifferences && !rowDiff) {
                        return null;
                      }

                      return (
                        <tr key={row.key} className="border-b border-gray-100 hover:bg-gray-50/55 transition-colors group/row">
                          {/* Parameter Meta Title */}
                          <td className="p-2.5 md:p-3.5 bg-gray-55/35 align-middle text-[11px] md:text-xs font-bold text-gray-500 border-r border-gray-50">
                            <span className="flex items-center gap-1.5">
                              {row.label}
                              {showOnlyDifferences && rowDiff && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Valor diferente entre produtos" />
                              )}
                            </span>
                          </td>

                          {/* Product Cells */}
                          {[0, 1, 2, 3].map(index => {
                            const prod = comparedProducts[index];
                            if (!prod) {
                              return <td key={`empty-cell-${row.key}-${index}`} className="p-2.5 md:p-3.5 align-middle border-l border-gray-50 bg-[#FAFAFA]/10" />;
                            }

                            const displayValue = row.accessor(prod);
                            const isCheapestCell = row.highlightCheapest && prod.id === cheapestProductId;

                            return (
                              <td 
                                key={`cell-${prod.id}-${row.key}`} 
                                className={`p-2.5 md:p-3.5 align-middle border-l border-gray-100 text-[11px] md:text-xs text-gray-700 font-medium ${
                                  isCheapestCell 
                                    ? 'bg-[#E6FDF4]/50 text-[#0369A1] font-bold' 
                                    : ''
                                }`}
                              >
                                {isCheapestCell ? (
                                  <div className="flex flex-col">
                                    <span>{displayValue}</span>
                                    <span className="text-[8.5px] text-[#059669] font-extrabold uppercase mt-0.5 tracking-wide leading-none">Melhor Oferta</span>
                                  </div>
                                ) : (
                                  displayValue
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        {comparedProducts.length > 0 && (
          <div className="p-4 md:px-8 md:py-4 bg-gray-50 border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2 text-gray-500 text-[10.5px] md:text-xs text-center sm:text-left">
              <Info className="w-4 h-4 text-brand-blue shrink-0 hidden sm:block" />
              <span>Configure tecidos, densidades e medidas sob medida direto no WhatsApp oficial.</span>
            </div>

            <button
              onClick={() => handleConsultWhatsApp()}
              className="w-full sm:w-auto py-2.5 px-5 bg-[#10B981] hover:bg-[#059669] text-white text-xs md:text-sm font-extrabold rounded-xl shadow-lg hover:shadow-emerald-100/30 flex items-center justify-center gap-2 transition-all cursor-pointer border-none scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0" />
              <span>Gostei! Falar com Consultor</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
