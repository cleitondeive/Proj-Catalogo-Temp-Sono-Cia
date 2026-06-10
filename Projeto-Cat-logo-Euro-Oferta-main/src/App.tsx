import {
  ProductCard } from './components/ProductCard';
import confetti from 'canvas-confetti';
import {
  Copy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Plus,
  Search,
  X,
  User,
  ShoppingCart,
  Home,
  MessageCircle,
  Trash2,
  Minus,
  SlidersHorizontal,
  Armchair,
  Package,
  BedDouble,
  Cloud,
  Sofa,
  Box,
  LayoutGrid,
  ArrowUp,
  Star,
  Sparkles,
  Instagram,
  CheckCircle2,
  Facebook,
  Smartphone,
  Truck,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Play,
  Calendar,
  ShieldCheck,
  Award,
  Lock,
  Layers,
  Maximize,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import AdminDashboard from "./admin/AdminDashboard";
import Auth from "./admin/components/Auth";
import { useStore } from "./store";

// Custom CSS for Ken Burns and Pulsing Dot
const customStyles = `
  @keyframes kenburns {
    0% { transform: scale(1); }
    100% { transform: scale(1.08); }
  }
  .animate-ken-burns {
    animation: kenburns 25s ease-in-out infinite alternate;
  }
  @keyframes pulseTheDot {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  .animate-status-pulse {
    animation: pulseTheDot 2s infinite;
  }
`;

const categories = [
  {
    name: "Móveis de\nMadeira",
    image:
      "https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=600&q=80",
    icon: Box,
  },
  {
    name: "Estofados",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    icon: Sofa,
  },
  {
    name: "Camas",
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=600&q=80",
    icon: BedDouble,
  },
  {
    name: "Colchões",
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80",
    icon: Package,
  },
  {
    name: "Travesseiros",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
    icon: Cloud,
  },
];

const storeSettings = {
  get whatsapp() { return localStorage.getItem('euro_store_phone') || '5565981183473'; },
  get name() { return localStorage.getItem('euro_store_name') || 'Euro Oferta'; }
};

const SectionCarousel = ({
  title,
  products,
  Icon,
  wishlist,
  toggleWishlist,
  addToCart,
  onViewCategory
}: {
  title: string;
  products: any[];
  Icon?: any;
  wishlist: any[];
  toggleWishlist: (product: any, e: React.MouseEvent) => void;
  addToCart: (product: any, e: React.MouseEvent) => void;
  onViewCategory?: () => void;
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showLocalSearchDropdown, setShowLocalSearchDropdown] = useState(false);
  const localSearchRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(8);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (localSearchRef.current && !localSearchRef.current.contains(event.target as Node)) {
        setShowLocalSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const localSearchResults = React.useMemo(() => {
    if (localSearchQuery.length < 2) return [];
    const normalizedQuery = localSearchQuery.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return products.filter(p => 
      p.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(normalizedQuery)
    ).slice(0, 5);
  }, [localSearchQuery, products]);


  const parsePrice = (priceStr: string) => {
    const parsed = parseFloat(priceStr.replace(/\./g, "").replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const { minPrice, maxPrice } = React.useMemo(() => {
    const prices = products.map((p) => parsePrice(p.price));
    return {
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 10000,
    };
  }, [products]);

  const [priceFilter, setPriceFilter] = useState<number>(maxPrice);

  useEffect(() => {
    setPriceFilter(maxPrice);
  }, [maxPrice]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => parsePrice(p.price) <= priceFilter);
  }, [products, priceFilter]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-16 md:mb-24 relative w-full group/carousel">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 mb-4 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 md:gap-4">
            {Icon ? (
              <div className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex items-center justify-center border border-gray-100 shrink-0 text-[#0F172A]">
                <Icon
                  className="w-5 h-5 md:w-[22px] md:h-[22px]"
                  strokeWidth={1.75}
                />
              </div>
            ) : null}
            <h2 className="text-[26px] md:text-[34px] font-bold font-serif text-[#0F172A] leading-none tracking-tight flex items-baseline gap-2 md:gap-3">
              {title}
              <span className="text-[16px] md:text-[20px] font-sans font-medium text-slate-400">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setShowFilter(!showFilter)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`flex flex-col md:flex-row items-start md:items-center gap-3 transition-all duration-300 z-[90] ${showFilter ? "max-h-96 opacity-100 mt-2 !overflow-visible" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100 md:mt-0 md:!overflow-visible overflow-hidden"}`}
        >
          {/* Local Search inside Carousel */}
          <div className="relative w-full md:w-auto" ref={localSearchRef}>
            <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-brand-blue focus-within:shadow-[0_4px_12px_rgba(1,82,148,0.08)] transition-all w-full md:w-[220px] lg:w-[260px] h-[40px] md:h-[44px]">
              <Search className="w-4 h-4 text-[#64748B] shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Pesquisar nesta seção..."
                value={localSearchQuery}
                onChange={(e) => {
                  setLocalSearchQuery(e.target.value);
                  if (e.target.value.length > 1) {
                    setShowLocalSearchDropdown(true);
                  } else {
                    setShowLocalSearchDropdown(false);
                  }
                }}
                className="bg-transparent border-none outline-none ml-2 text-[13px] font-medium w-full placeholder-[#94A3B8] text-[#0F172A]"
              />
            </div>

            {/* Local Search Dropdown */}
            {showLocalSearchDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[300px] md:min-w-[320px] bg-white rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-gray-100 z-[100] animate-fade-in-up overflow-hidden">
                {localSearchResults.length > 0 ? (
                  <div className="flex flex-col p-2">
                    {localSearchResults.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-[12px] cursor-pointer transition-all duration-300"
                        onClick={() => {
                           setQuickViewProduct(product);
                           setShowLocalSearchDropdown(false);
                           setLocalSearchQuery('');
                        }}
                      >
                        <div className="w-[44px] h-[44px] rounded-[8px] overflow-hidden shrink-0 bg-[#F8F9FA]">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-[#0F172A] truncate w-full tracking-tight">{product.name}</span>
                          <span className="text-[13px] font-bold text-brand-blue/80">{product.showPrice !== false ? `R$ ${product.price}` : 'Consulte'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 mr-1" strokeWidth={2} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center flex flex-col items-center">
                     <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                       <Search className="w-5 h-5 text-gray-300" />
                     </div>
                     <p className="text-gray-500 font-medium text-[13px]">Nenhum produto encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 bg-white p-1.5 pr-4 rounded-full border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] w-full md:w-auto hover:border-gray-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all group/filter">
            <div className="w-7 h-7 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0 hidden md:flex border border-gray-100/50">
              <SlidersHorizontal
                className="w-3.5 h-3.5 text-[#64748B]"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex flex-col w-full md:w-40 justify-center">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest hidden md:block">
                  Faixa de preço
                </span>
                <span className="text-[11px] font-semibold text-[#0F172A] md:hidden">
                  R$ {priceFilter.toLocaleString("pt-BR")}
                </span>
                <span className="text-[10px] font-bold text-[#1C202F] hidden md:block opacity-0 group-hover/filter:opacity-100 transition-opacity">
                  R$ {priceFilter.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={50}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full h-[3px] bg-[#F1F5F9] rounded-full appearance-none cursor-pointer accent-[#1C202F] hover:bg-[#E2E8F0] transition-colors"
                />
              </div>
            </div>
          </div>
          {onViewCategory && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onViewCategory();
              }}
              className="hidden md:flex items-center text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors group ml-1 cursor-pointer"
            >
              Ver coleção{" "}
              <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full">
        <button
          className="absolute left-[2%] top-[40%] -translate-y-[50%] z-30 w-[50px] h-[50px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full items-center justify-center text-[#0F172A] opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex cursor-pointer border border-gray-100"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={1.5} />
        </button>

        <button
          className="absolute right-[2%] top-[40%] -translate-y-[50%] z-30 w-[50px] h-[50px] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full items-center justify-center text-[#0F172A] opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex cursor-pointer border border-gray-100"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-7 h-7" strokeWidth={1.5} />
        </button>

        {/* Netflix Edge Fade Mask */}
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none hidden md:block" />

        <div
          ref={scrollContainerRef}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 md:flex md:overflow-x-auto hide-scrollbar w-full md:snap-x md:snap-mandatory pb-6 md:pb-12 px-4 md:pl-5 sm:pl-6 md:pr-5 sm:pr-6 md:scroll-smooth ${filteredProducts.length === 0 ? "flex items-center justify-center min-h-[300px] col-span-1 sm:col-span-2" : ""}`}
        >
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 font-serif">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500 max-w-sm text-sm">
                Não encontramos produtos para esta faixa de preço. Tente ajustar
                o filtro para ver mais opções.
              </p>
              <button
                className="mt-6 px-6 py-2.5 bg-brand-blue text-white font-bold rounded-full hover:bg-brand-blue-hover transition-colors"
                onClick={() => setPriceFilter(maxPrice)}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                idx={idx}
                product={product}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                setQuickViewProduct={setQuickViewProduct}
                setActiveImageIdx={setActiveImageIdx}
                handleAddToCart={addToCart}
                mobileVisibleCount={mobileVisibleCount}
                className={"w-full md:w-[280px] lg:w-[310px] xl:w-[330px] shrink-0 md:snap-start"}
              />
            ))
          )}
          {/* spacer for the last item to snap clearly */}
          <div className="w-[1px] shrink-0 hidden md:block" />
        </div>
        {filteredProducts.length > mobileVisibleCount && (
          <div className="w-full flex justify-center mt-2 mb-6 md:hidden px-4">
            <button 
              className="px-8 py-3 bg-brand-blue/10 text-brand-blue font-bold rounded-[14px] text-[13px] hover:bg-brand-blue hover:text-white transition-colors w-full"
              onClick={() => setMobileVisibleCount(prev => prev + 8)}
            >
              Ver mais produtos
            </button>
          </div>
        )}
      </div>

      {/* Quick view modal */}
      {quickViewProduct && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-[20px] md:rounded-[24px] shadow-2xl w-full max-w-[900px] overflow-y-auto overflow-x-hidden md:overflow-hidden relative flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] min-h-[440px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm border border-gray-100 cursor-pointer text-gray-500"
              onClick={() => setQuickViewProduct(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="md:w-1/2 h-auto flex flex-col bg-[#F5F5F5] p-5 lg:p-6 relative">
              <div className="absolute top-4 left-4 z-10 flex gap-3">
                <span className="bg-brand-blue text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Novo
                </span>
              </div>
              <div className="absolute top-4 right-14 md:right-4 lg:left-24 lg:right-auto z-10">
                <div className="group/badge relative bg-white/90 backdrop-blur-md border border-white/40 text-[#1C202F] text-[10px] md:text-[11px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-wide flex items-center gap-2 shadow-[0_8px_16px_rgba(0,0,0,0.06)] cursor-default overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000" />
                  <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-blue" />
                  <span>Design Assinado</span>
                </div>
              </div>

              <div className="w-full flex-1 flex flex-col justify-center mt-8 md:mt-10 mb-4 relative group">
                <div
                  className="w-full h-40 sm:h-48 md:h-[260px] flex items-center justify-center relative mb-3 md:mb-4 cursor-zoom-in"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                >
                  {activeImageIdx > 0 && (
                    <button
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1C202F] shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer -translate-x-2 group-hover:translate-x-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev: number) =>
                          Math.max(0, prev - 1),
                        );
                      }}
                    >
                      <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  )}
                  {activeImageIdx < getQuickViewImages(quickViewProduct).length - 1 && (
                    <button
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1C202F] shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer translate-x-2 group-hover:translate-x-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev: number) =>
                          Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1),
                        );
                      }}
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  )}
                  <motion.img
                    key={(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image || '') + activeImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={
                      getQuickViewImages(quickViewProduct)[activeImageIdx]
                    }
                    alt={quickViewProduct.name}
                    className="max-w-full max-h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px] pointer-events-none" />
                  <button className="absolute bottom-4 right-4 md:bottom-3 md:right-3 w-[42px] h-[42px] bg-white shadow-lg shadow-black/10 hover:bg-gray-50 rounded-full flex items-center justify-center text-[#1C202F] opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10 translate-y-2 group-hover:translate-y-0">
                    <ZoomIn className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 justify-center w-full mt-auto">
                {getQuickViewImages(quickViewProduct).map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-[60px] h-[60px] rounded-[14px] overflow-hidden transition-all cursor-pointer bg-white ${activeImageIdx === idx ? "ring-2 ring-offset-2 ring-[#7591A6] shadow-md scale-105" : "ring-1 ring-transparent hover:ring-gray-200 opacity-70 hover:opacity-100"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx(idx);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-gray-500 text-xs md:text-[13px] font-medium ml-1.5 md:ml-2">
                  (12 Avaliações)
                </span>
              </div>
              <h2 className="text-[22px] md:text-[26px] lg:text-[30px] font-serif font-bold text-[#1C202F] leading-[1.2] mb-1.5 md:mb-2">
                {quickViewProduct.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4">
                <span className="text-[10px] md:text-[11px] font-bold text-[#7591A6] tracking-widest uppercase">
                  Móveis de Madeira
                </span>
                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-status-pulse"></div>
                  <span className="text-[10px] font-bold tracking-wide">
                    {Math.floor(Math.random() * 25) + 12} pessoas estão a ver
                    esta peça agora
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="text-[24px] md:text-[28px] font-bold text-[#1C202F]">
                  {quickViewProduct.showPrice !== false ? `R$ ${quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.price || quickViewProduct.price}` : <span className="text-[18px] uppercase tracking-widest text-brand-blue">Consulte o Preço</span>}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.showPrice !== false && (
                <span className="text-sm md:text-base font-medium text-[#7591A6] line-through">
                  R$ {quickViewProduct.originalPrice}
                </span>
                )}
              </div>

              <p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">
                {quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.description || quickViewProduct.description || "Design escandinavo em madeira de carvalho maciço. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal."}
              </p>

              {(() => {
                const activeColorObj = quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name));
                const actualLength = (activeColorObj?.length && String(activeColorObj.length).trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && String(activeColorObj.width).trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && String(activeColorObj.height).trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && String(activeColorObj.weight).trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;
                const hasDimensions = Boolean(actualLength || actualWidth || actualHeight || actualWeight);

                const dLength = actualLength || '-';
                const dWidth = actualWidth || '-';
                const dHeight = actualHeight || '-';
                const dWeight = actualWeight || '-';
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const dStock = quickViewProduct.showStock ? quickViewProduct.stock : null;

                return (
                  <>
                  {hasDimensions && (
                    <div className="mb-5 flex items-center justify-between gap-2.5 animate-fade-in-up border border-gray-100 rounded-xl p-3 bg-gray-50/50" style={{ animationDelay: '50ms' }}>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Box className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Dimensões</span>
                        </div>
                        <div className="flex gap-2.5 md:gap-3">
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dLength}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dLength !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Compr.</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWidth}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWidth !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Largura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dHeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dHeight !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Altura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWeight !== '-' ? 'kg' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Peso</span>
                          </div>
                        </div>
                    </div>
                  )}

                  {dTags && (
                    <div className="mb-5 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       {dTags.split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                           <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] md:text-[11px] font-bold tracking-widest uppercase border border-brand-blue/10 cursor-default">
                              <Layers className="w-3 h-3" />
                              {tag.trim()}
                           </span>
                       ))}
                    </div>
                  )}

                  {dStock != null && dStock !== undefined && (
                    <div className="mb-4 md:mb-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                       <div className="flex items-center gap-2">
                         <div className="flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                         </div>
                         <span className="text-[10px] md:text-[11px] font-bold text-[#1E293B] uppercase tracking-widest mt-0.5">
                           Em Estoque 
                           <span className="text-gray-400 font-medium ml-1.5 hidden sm:inline-block">/ Pronta Entrega</span>
                         </span>
                       </div>
                       <div className="flex items-end gap-1 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100">
                         <span className="text-[13px] font-[800] text-[#0F172A] tabular-nums leading-none">{dStock}</span>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Unid.</span>
                       </div>
                    </div>
                  )}
                  </>
                );
              })()}

              {(quickViewProduct.colors?.length > 0 || quickViewProduct.sizes?.length > 0) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 mb-5 border border-gray-100 py-3 px-4 bg-[#FAFAFA] rounded-[16px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="flex-1 w-full">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.colors.length === 1 ? 'Cor' : 'Selecione a Cor'}
                    {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize truncate max-w-[120px]">- {quickViewProduct.color}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c: any, i: number) => {
                      const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                      return (
                      <div key={i} className="relative group/color">
                        <button
                          onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm ${isSelected ? 'border-[#0F172A] scale-110 ring-2 ring-transparent ring-offset-1' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}`}
                        >
                          <div className="w-[85%] h-[85%] rounded-full shadow-inner block" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </button>
                        <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max text-center bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-white/10 group-hover/color:delay-100 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                          {c.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </div>
                )}

                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="flex-1 w-full sm:pl-4 sm:border-l sm:border-gray-200">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.sizes.length === 1 ? 'Tamanho' : 'Selecione Tamanho'}
                    {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize truncate max-w-[80px]">- {quickViewProduct.size}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                        className={`px-3 py-1 rounded-[8px] text-[11px] font-bold border transition-all ${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
              )}

              {/* Action Block */}
              <div className="mt-auto pt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  {quickViewProduct.showPrice !== false ? (
                  <button onClick={(e) => addToCart(quickViewProduct, e)} className="flex-[4] bg-brand-blue hover:bg-brand-blue-hover text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(1,82,148,0.25)] hover:shadow-[0_6px_20px_rgba(1,82,148,0.35)] hover:-translate-y-0.5 group/btn">
                    <ShoppingCart className="w-[18px] h-[18px] transition-transform duration-300 group-hover/btn:-rotate-12" />
                    Adicionar ao Pedido
                  </button>
                  ) : (
                  <a 
                    href={`https://wa.me/55${storeSettings.whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de consultar o preço do produto: ${quickViewProduct.name} (SKU: ${quickViewProduct.sku || 'N/A'})`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-[4] bg-[#10B981] hover:bg-[#059669] text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 group/wa"
                  >
                    <MessageCircle className="w-[18px] h-[18px] transition-transform duration-300 group-hover/wa:scale-110" /> 
                    Consultar via WhatsApp
                  </a>
                  )}
                  <button 
                    className="flex-shrink-0 w-[54px] md:w-[60px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-[12px] transition-colors text-[#64748B] hover:text-red-500 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-sm group/wish"
                    title="Adicionar à Lista de Desejos"
                    onClick={(e) => toggleWishlist(quickViewProduct, e)}
                  >
                    <Heart
                      className={`w-[22px] h-[22px] transition-transform duration-300 group-hover/wish:scale-110 ${wishlist.some(item => item.name === quickViewProduct?.name) ? 'fill-red-500 text-red-500' : ''}`}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                
                {/* Shipping info below button */}
                <div className="flex items-center justify-center gap-2 mt-1 opacity-90 pb-2">
                  <Truck className="w-4 h-4 text-brand-blue" strokeWidth={2} />
                  <span className="text-[#475569] font-medium text-[12px] md:text-[13px]">
                    Entrega agendada para todo o <span className="font-bold text-brand-blue">Brasil</span>.
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-2 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-1.5 md:gap-2">
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-green-600 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">100% Segura</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-amber-500 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Garantia</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-brand-blue transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Entrega VIP</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for zooming */}
      {isZoomed && quickViewProduct && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 z-30 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-[90vw] h-[90vh] flex items-center justify-center">
            {activeImageIdx > 0 && (
              <button
                className="absolute left-0 md:-left-8 z-30 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.max(0, prev - 1));
                }}
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            <div className="relative group/lightbox flex items-center justify-center max-w-full max-h-full">
              <img
                src={
                  getQuickViewImages(quickViewProduct)[activeImageIdx]
                }
                alt={quickViewProduct.name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl cursor-zoom-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/lightbox:opacity-100 transition-duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-black/40 text-white/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl scale-75 group-hover/lightbox:scale-100 transition-all duration-300">
                  <ZoomOut className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {activeImageIdx < getQuickViewImages(quickViewProduct).length - 1 && (
              <button
                className="absolute right-0 md:-right-8 z-30 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1));
                }}
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            <div className="absolute bottom-[-10px] md:bottom-[-20px] left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button
                className={`p-2 rounded-full md:hidden ${activeImageIdx === 0 ? "text-white/30" : "text-white/80"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.max(0, prev - 1));
                }}
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeImageIdx === idx ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx(idx);
                    }}
                  />
                ))}
              </div>
              <button
                className={`p-2 rounded-full md:hidden ${activeImageIdx === getQuickViewImages(quickViewProduct).length - 1 ? "text-white/30" : "text-white/80"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1));
                }}
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

function CategoryPage({ 
  category, 
  products, 
  onBack, 
  wishlist, 
  toggleWishlist, 
  addToCart,
  setQuickViewProduct,
  setActiveImageIdx
}: { 
  category: any; 
  products: any[];
  onBack: () => void;
  wishlist: any[];
  toggleWishlist: (product: any, e: React.MouseEvent) => void;
  addToCart: (product: any, e: React.MouseEvent) => void;
  setQuickViewProduct: (product: any) => void;
  setActiveImageIdx: (idx: number) => void;
}) {
  const [showFilter, setShowFilter] = useState(false);
  const parsePrice = (priceStr: string) => {
    const parsed = parseFloat(priceStr.replace(/\./g, "").replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const { minPrice, maxPrice } = React.useMemo(() => {
    const prices = products.map((p) => parsePrice(p.price));
    return {
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 10000,
    };
  }, [products]);

  const [priceFilter, setPriceFilter] = useState<number>(maxPrice);

  useEffect(() => {
    setPriceFilter(maxPrice);
  }, [maxPrice]);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => parsePrice(p.price) <= priceFilter);
  }, [products, priceFilter]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 pt-[104px] md:pt-[116px]">
      {/* Hero Header */}
      <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-[#0F172A] mx-auto">
        <div className="absolute inset-0 bg-[#0F172A]/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
        <img 
          src={category.image} 
          alt={category.name} 
          className="absolute inset-0 w-full h-full object-cover object-[50%_40%] opacity-90 transition-transform duration-0 ease-out" 
          style={{ transform: `scale(1.05) translateY(${scrollY * 0.3}px)` }}
          referrerPolicy="no-referrer"
        />
        
        {/* Top bar back button */}
        <div className="absolute top-6 left-4 md:left-8 z-30">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[13px] md:text-[14px] font-bold transition-all shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar ao Catálogo</span>
            <span className="sm:hidden">Voltar</span>
          </button>
        </div>

        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full pt-12 md:pt-0" style={{ transform: `translateY(${scrollY * -0.15}px)` }}>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform animate-fade-in-up">
            <category.icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" strokeWidth={1} />
          </div>
          
          <div className="flex items-center gap-2 text-[#E2E8F0] tracking-[0.3em] font-medium text-[10px] md:text-[12px] uppercase mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={onBack}>Início</span>
            <span className="text-white/30">/</span>
            <span className="text-white drop-shadow-sm">{category.name.replace('\\n', ' ')}</span>
          </div>

          <h1 className="text-[42px] sm:text-6xl md:text-[80px] lg:text-[100px] font-serif font-bold text-white tracking-tight mb-4 md:mb-2 drop-shadow-2xl whitespace-pre-wrap leading-[1.05] max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {category.name.replace('\\n', ' ')}
          </h1>
          <p className="text-[#F1F5F9] text-[16px] md:text-[22px] font-light max-w-[320px] md:max-w-2xl drop-shadow-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Curadoria exclusiva de {category.name.replace('\\n', ' ').toLowerCase()} para transformar o seu espaço numa experiência ímpar.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 -mt-12 md:-mt-16 relative z-30 pb-4">
        {/* Controls Bar */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-[0_16px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between p-6 md:p-8 mb-10 md:mb-12 gap-8 border border-gray-100/50 backdrop-blur-sm mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto text-center md:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-blue/5 rounded-full flex items-center justify-center text-brand-blue shrink-0">
              <Package className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] md:text-[13px] text-gray-500 font-bold mb-1 uppercase tracking-widest hidden md:block">Coleção</p>
              <p className="text-xl md:text-2xl font-bold text-[#0F172A]">{filteredProducts.length} <span className="text-sm md:text-base font-normal text-gray-400 font-serif italic">descobertas</span></p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto px-2 md:px-0">
            <span className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] w-full md:w-auto text-center md:text-right hidden md:block">
              Filtrar por Valor
            </span>
            <div className="flex-1 md:w-64 w-full">
              <div className="flex justify-between items-end mb-3 md:mb-2">
                <span className="text-[14px] font-bold text-[#0F172A] w-full text-center md:text-left">Até R$ {priceFilter.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={50}
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-full h-[6px] md:h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-blue hover:bg-gray-300 transition-colors"
                title="Filtrar por Preço"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-20 h-20 bg-[#F8F9FA] rounded-[24px] rotate-3 flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <div className="-rotate-3">
                <Search className="w-10 h-10 text-gray-400" strokeWidth={1} />
              </div>
            </div>
            <h3 className="text-[28px] font-bold text-[#0F172A] mb-3 font-serif tracking-tight">
              Nenhuma peça encontrada
            </h3>
            <p className="text-gray-500 max-w-sm mb-8 text-[15px] leading-relaxed relative z-10">
              O design que procura não está disponível nesta faixa de valor. Ajuste o seu orçamento para explorar a nossa coleção exclusiva.
            </p>
            <button
               onClick={() => setPriceFilter(maxPrice)}
               className="bg-[#1C202F] text-white hover:bg-black px-8 py-3 rounded-full font-bold text-[14px] transition-all shadow-[0_8px_20px_rgba(28,32,47,0.2)] hover:scale-105 active:scale-95 relative z-10"
            >
              Ver todas as peças
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={idx}
                idx={idx}
                product={product}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                setQuickViewProduct={setQuickViewProduct}
                setActiveImageIdx={setActiveImageIdx}
                handleAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getQuickViewImages = (product: any) => {
  if (!product) return [];
  const activeColorName = product.color || product.colors?.[0]?.name;
  const activeColor = product.colors?.find((c: any) => c.name === activeColorName);
  const mainImage = activeColor?.image || product.image;
  if (activeColor?.gallery && activeColor.gallery.length > 0) {
    return [mainImage, ...activeColor.gallery].filter(Boolean);
  }
  return [mainImage, ...(product.gallery || [])].filter(Boolean);
};

export default function App() {
  const adminStore = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [leadFormErrors, setLeadFormErrors] = useState({ name: false, phone: false });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const formatPhone = (val: string) => {
    let raw = val.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);
    if (raw.length === 0) return '';
    if (raw.length <= 2) return `(${raw}`;
    if (raw.length <= 6) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    if (raw.length <= 10) return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  useEffect(() => {
    if (!adminStore.isLoading) {
      // Simulate initial loading for premium feel
      const timer = setTimeout(() => {
        setAppLoaded(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [adminStore.isLoading]);

  // Cart & Order Sent state
  const [cart, setCart] = useState<any[]>([]);
  const [orderSentState, setOrderSentState] = useState(false);
  const [orderSentItems, setOrderSentItems] = useState<any[]>([]);

  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.showPrice === false) return acc;
      const priceRegex = item.price?.match(/[\d.,]+/) || ["0"];
      if (!priceRegex) return acc;
      const priceStr = priceRegex[0].replace(/\./g, '').replace(',', '.');
      return acc + (parseFloat(priceStr) * (item.qty || 1));
    }, 0);
  };
  
  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const colorToUse = product.color || product.colors?.[0]?.name;
    const sizeToUse = product.size || product.sizes?.[0];
    const colorObj = product.colors?.find((c: any) => c.name === colorToUse);
    const priceToUse = colorObj?.price || product.price;

    const existingId = cart.findIndex(item => item.name === product.name && item.color === colorToUse && item.size === sizeToUse);
    
    if (existingId >= 0) {
      const newCart = [...cart];
      newCart[existingId] = { ...newCart[existingId], qty: (newCart[existingId].qty || 1) + 1 };
      setCart(newCart);
    } else {
      const imageToUse = colorObj?.image || product.image;
      setCart([...cart, { ...product, color: colorToUse, size: sizeToUse, price: priceToUse, image: imageToUse, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQty = (productName: string, color: string | undefined, size: string | undefined, delta: number) => {
    setCart(cart.map(item => {
      if (item.name === productName && item.color === color && item.size === size) {
        const currentQty = item.qty || 1;
        const newQty = currentQty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productName: string, color: string | undefined, size: string | undefined) => {
    setCart(cart.filter(item => !(item.name === productName && item.color === color && item.size === size)));
  };


  // Quick View states for Ambientes section
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [toast, setToast] = useState<{show: boolean, type: 'cart' | 'wishlist', title: string, message: string, image?: string}>({show: false, type: 'wishlist', title: '', message: ''});
  
  const showToast = (type: 'cart' | 'wishlist', title: string, message: string, image?: string) => {
    setToast({ show: true, type, title, message, image });
    
  };
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'category' | 'admin'>('home');
  const [isAdminAuth, setIsAdminAuth] = useState(() => localStorage.getItem('admin_auth') === 'true');
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const handleSelectCategory = (categoryId: string) => {
    const cat = categories.find(c => c.name === categoryId);
    if (cat) {
      setSelectedCategory(cat);
      setCurrentView('category');
      window.scrollTo(0, 0);
    }
  };
  
  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isHearted = wishlist.some(item => item.name === product.name);
    if (isHearted) {
      setWishlist(wishlist.filter(item => item.name !== product.name));
    } else {
      setWishlist([...wishlist, product]);
      showToast('wishlist', 'Salvo nos favoritos', product.name, product.image);
    }
  };

  const getWishlistTotal = () => {
    return wishlist.reduce((acc, item) => {
      const priceRegex = item.price?.match(/[\d.,]+/) || ["0"];
      if (!priceRegex) return acc;
      const priceStr = priceRegex[0].replace(/\./g, '').replace(',', '.');
      return acc + parseFloat(priceStr);
    }, 0);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allProducts = adminStore.data.products.filter(p => p.status === 'active');
  const estofados = allProducts.filter(p => p.category === 'Estofados');
  const camas = allProducts.filter(p => p.category === 'Camas');
  const colchoes = allProducts.filter(p => p.category === 'Colchões');
  const moveisMadeira = allProducts.filter(p => p.category === 'Móveis de Madeira');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      const results = allProducts.filter(p => 
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery)
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(results);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  if (currentView === 'admin') {
    if (adminStore.isLoading) {
       return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-brand-blue animate-spin" /></div>;
    }
    if (!isAdminAuth) {
      return <Auth onLogin={() => setIsAdminAuth(true)} onBack={() => setCurrentView('home')} />;
    }
    return <AdminDashboard onLogout={() => { setIsAdminAuth(false); setCurrentView('home'); }} onBackToSite={() => setCurrentView('home')} />;
  }

  return (
    <>
      {/* Premium Loader */}
      <div 
        className={`fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center transition-all duration-1000 ease-[0.83, 0, 0.17, 1] ${appLoaded ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex flex-col items-center">
           <Armchair className={`w-12 h-12 text-white mb-6 transition-all duration-700 ${appLoaded ? 'opacity-0 scale-90' : 'opacity-100 scale-100 animate-pulse'}`} strokeWidth={1} />
           <h1 className={`text-white font-serif text-3xl md:text-5xl font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-700 delay-100 ${appLoaded ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
             Euro
             <span className="font-light italic text-[#E2E8F0] tracking-wider">Oferta</span>
             <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-blue rounded-full mb-4"></span>
           </h1>
        </div>
        <div className={`absolute bottom-24 w-64 h-[1px] bg-white/20 overflow-hidden transition-opacity duration-500 ${appLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <div className="h-full bg-white w-full flex origin-left animate-[loader-progress_ease-in-out_forwards]" style={{ animationDuration: '1.4s' }} />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col md:hidden animate-fade-in">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <button 
              className="p-2 -ml-2 text-gray-500 hover:text-black"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <div className="flex-1 bg-gray-50 rounded-[20px] flex items-center px-4 py-2.5 border border-gray-100 focus-within:border-brand-blue/30 focus-within:bg-white transition-all">
              <Search className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.5} />
              <input 
                type="text"
                placeholder="Buscar produtos..."
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  handleSearchChange(e);
                  // Ensure dropdown doesn't show in mobile view since we list them below
                  setShowSearchDropdown(false);
                }}
                className="bg-transparent border-none outline-none ml-3 text-[16px] w-full placeholder-gray-400 text-[#0F172A] font-medium"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
            {searchQuery.length > 1 ? (
              searchResults.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Resultados da busca</div>
                  {searchResults.map((product, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-4 bg-white p-3 rounded-[16px] shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={() => {
                         setQuickViewProduct(product);
                         setIsMobileSearchOpen(false);
                         setSearchQuery('');
                      }}
                    >
                      <div className="w-16 h-16 rounded-[12px] overflow-hidden shrink-0 bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[15px] font-semibold text-[#0F172A] truncate w-full tracking-tight">{product.name}</span>
                        <span className="text-[14px] font-bold text-brand-blue">{product.showPrice !== false ? `R$ ${product.price}` : 'Consulte'}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" strokeWidth={2} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-24 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-500 text-sm">Não encontramos nada para &quot;{searchQuery}&quot;. Tente usar termos diferentes.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center pt-24 text-center opacity-50">
                 <Search className="w-12 h-12 text-gray-300 mb-4" />
                 <p className="text-gray-500 text-sm">Comece a digitar para procurar móveis, colchões e mais.</p>
              </div>
            )}
          </div>
        </div>
      )}
      {toast.show && (
        <div className="fixed top-24 right-4 md:right-8 z-[200] max-w-sm w-full animate-slide-in-right">
          <div className="bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] rounded-2xl p-4 border border-gray-100 flex items-start gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300" onClick={() => setToast(prev => ({...prev, show: false}))}>
            {toast.image ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F4F5F7]">
                <img src={toast.image} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-1">{toast.title}</p>
              <p className="text-[15px] font-bold text-gray-900 leading-tight truncate">{toast.message}</p>
              <p className="text-sm text-brand-blue font-medium mt-2 flex items-center gap-1">
                {toast.type === 'cart' ? 'Ver carrinho' : 'Ver favoritos'} <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    <div className="pb-20 md:pb-0">
      <style>{customStyles}</style>
      {/* Header Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out focus-within:translate-y-0 ${isScrolled ? "-translate-y-9" : "translate-y-0"}`}
      >
        {/* Announcement Bar */}
        <div className="bg-brand-blue text-white h-9 flex justify-between items-center px-4 md:px-8 2xl:px-12 3xl:px-16 text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.2em] w-full relative z-20">
          <div className="hidden md:flex items-center gap-4 w-1/3">
            <a
              href="#"
              className="hover:text-white/80 transition-opacity flex items-center group"
            >
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              className="hover:text-white/80 transition-opacity flex items-center group"
            >
              <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              className="hover:text-white/80 transition-opacity flex items-center group"
            >
              <svg
                className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.436 2.981 7.436 6.966 0 4.156-2.618 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.878c-.274 1.045-1.018 2.348-1.518 3.141 1.184.364 2.457.561 3.784.561 6.621 0 11.988-5.367 11.988-11.988C24 5.367 18.638 0 12.017 0z" />
              </svg>
            </a>
          </div>
          <div className="flex-1 flex justify-center items-center gap-1.5 md:gap-3 px-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
            <Sparkles
              className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 shrink-0"
              fill="currentColor"
            />
            <span className="truncate uppercase mt-[1px]">
              Entrega agendada para todo o Brasil.
            </span>
            <Sparkles
              className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 shrink-0"
              fill="currentColor"
            />
          </div>
          <div className="hidden md:flex gap-6 w-1/3 justify-end text-[10px] tracking-widest font-semibold text-white/90 uppercase">
            <a href="#" className="hover:text-white transition-opacity">
              Precisa de Ajuda?
            </a>
            <a href="#" className="hover:text-white transition-opacity">
              Nossas Lojas
            </a>
          </div>
        </div>

        {/* Main Nav */}
        <div
          className={`bg-white border-b border-gray-100 flex justify-between items-center px-4 md:px-8 2xl:px-12 3xl:px-16 w-full transition-all duration-300 relative z-10 shadow-sm ${isScrolled ? "py-3" : "py-5 md:py-6"}`}
        >
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-1 md:flex-none md:w-1/3">
            <button className="p-2 cursor-pointer hover:text-brand-blue transition-colors text-[#0F172A] md:hidden -ml-2">
              <Menu className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex flex-col relative w-full max-w-[320px] 2xl:max-w-[400px] 3xl:max-w-[500px]" ref={searchRef}>
              <div className="flex items-center bg-[#F8F9FA] rounded-[30px] px-5 py-3 2xl:py-4 3xl:py-5 w-full border border-gray-100 focus-within:border-brand-blue focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(1,82,148,0.08)] transition-all z-50">
                <Search
                  className="w-5 h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 text-gray-400 shrink-0"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none outline-none ml-3 text-[15px] 2xl:text-[18px] 3xl:text-[20px] w-full placeholder-gray-400 text-[#0F172A] font-medium"
                />
              </div>

              {/* Advanced Search Results Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[420px] bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-fade-in-up">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col p-2">
                      <div className="px-4 pt-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Produtos Encontrados</div>
                      {searchResults.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-[14px] cursor-pointer transition-all duration-300 hover:pl-5"
                          onClick={() => {
                             setQuickViewProduct(product);
                             setShowSearchDropdown(false);
                             setSearchQuery('');
                          }}
                        >
                          <div className="w-[52px] h-[52px] rounded-[10px] overflow-hidden shrink-0 bg-[#F8F9FA] shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[14px] font-bold text-[#0F172A] truncate w-full tracking-tight">{product.name}</span>
                            <span className="text-[13px] font-bold text-brand-blue/80">{product.showPrice !== false ? `R$ ${product.price}` : 'Consulte'}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 mr-2" strokeWidth={2} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center flex flex-col items-center">
                       <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                         <Search className="w-6 h-6 text-gray-300" />
                       </div>
                       <p className="text-gray-500 font-medium text-[14px]">Nenhum produto encontrado para</p>
                       <p className="text-[#0F172A] font-bold text-[15px]">&quot;{searchQuery}&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              className="md:hidden p-2 cursor-pointer hover:text-brand-blue transition-colors text-[#0F172A]"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-[2] md:w-1/3 flex justify-center shrink-0">
            <h1
              className="text-[24px] sm:text-[28px] md:text-[42px] 2xl:text-[52px] 3xl:text-[64px] font-bold tracking-[-0.04em] font-serif text-[#0F172A] cursor-pointer transition-all duration-300 whitespace-nowrap flex items-center"
              onClick={() => setCurrentView('home')}
            >
              Euro Oferta<span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-blue rounded-full inline-block ml-0.5 md:ml-1 mb-1 md:mb-2" />
            </h1>
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-5 2xl:gap-8 3xl:gap-10 flex-1 md:flex-none md:w-1/3">
            <button className="p-2 cursor-pointer hover:text-brand-blue transition-colors text-[#0F172A] hidden sm:block">
              <User className="w-[26px] h-[26px] 2xl:w-[32px] 2xl:h-[32px] 3xl:w-[40px] 3xl:h-[40px]" strokeWidth={1.5} />
            </button>
            <button 
              className="p-2 cursor-pointer hover:text-brand-blue transition-colors text-[#0F172A] relative"
              onClick={() => setCurrentView('wishlist')}
            >
              <Heart className="w-[26px] h-[26px] 2xl:w-[32px] 2xl:h-[32px] 3xl:w-[40px] 3xl:h-[40px]" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute max-md:top-0 md:-top-1 2xl:-top-2 3xl:-top-3 max-md:-right-0 md:-right-1 2xl:-right-2 3xl:-right-3 bg-red-500 text-white text-[11px] 2xl:text-[13px] 3xl:text-[15px] font-bold w-[20px] h-[20px] 2xl:w-[24px] 2xl:h-[24px] 3xl:w-[30px] 3xl:h-[30px] rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              className="p-2 cursor-pointer hover:text-brand-blue transition-colors text-[#0F172A] relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-[26px] h-[26px] 2xl:w-[32px] 2xl:h-[32px] 3xl:w-[40px] 3xl:h-[40px]" strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute max-md:top-0 md:-top-1 2xl:-top-2 3xl:-top-3 max-md:-right-0 md:-right-1 2xl:-right-2 3xl:-right-3 bg-brand-blue text-white text-[11px] 2xl:text-[13px] 3xl:text-[15px] font-bold w-[20px] h-[20px] 2xl:w-[24px] 2xl:h-[24px] 3xl:w-[30px] 3xl:h-[30px] rounded-full flex items-center justify-center shadow-sm">
                  {cart.reduce((sym, item) => sym + (item.qty || 1), 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Category Container (Beige Background) */}
      {currentView === 'home' ? (
      <>
      <div className="bg-gradient-to-b from-[#EFEDEB] to-[#FAFAFA] pt-[120px] md:pt-[160px] pb-10 md:pb-16 w-full relative overflow-hidden">
        {/* Hero Section */}
        <section className="max-w-[2400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 2xl:px-32 flex flex-col md:flex-row items-center justify-start md:justify-between gap-8 md:gap-10 lg:gap-16 2xl:gap-32 w-full min-h-[calc(100vh-160px)] lg:min-h-[600px] 2xl:min-h-[75vh]">
          <div className="z-20 w-full md:w-[48%] xl:w-[45%] 3xl:w-[40%] relative flex flex-col justify-center">
            {/* Efeito Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/4 w-[350px] 2xl:w-[500px] h-[350px] 2xl:h-[500px] bg-white/70 blur-[90px] rounded-full z-[-1] pointer-events-none" />

            <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-3 md:mb-5 text-[#64748B] inline-flex items-center gap-3 md:gap-4 mt-2 md:mt-0">
              <span className="w-6 md:w-8 h-[1px] bg-[#64748B]"></span>
              Lançamentos Exclusivos
            </span>
            <h2 className="text-[32px] sm:text-[38px] md:text-[48px] lg:text-[56px] xl:text-[64px] tracking-tight font-bold leading-[1.05] md:leading-[1.02] mb-3 md:mb-5 lg:mb-6 font-serif mt-1 md:mt-2 relative">
              <span className="text-[#0F172A] block">Coleção</span>
              <span className="text-brand-blue block italic pr-2">Outono</span>
              <span className="text-[#0F172A] block">Premium.</span>
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] text-gray-500 max-w-[400px] lg:max-w-[480px] mb-5 md:mb-8 lg:mb-10 leading-relaxed font-medium relative">
              Eleve a sofisticação da sua casa com peças que definem o padrão em
              conforto e design arquitetônico.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 lg:gap-6 relative">
              <button 
                onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-brand-blue bg-brand-blue text-white w-full sm:w-auto px-5 md:px-7 lg:px-8 py-3 md:py-3 lg:py-3.5 rounded-full text-[13px] lg:text-[14px] font-bold hover:bg-transparent hover:text-brand-blue transition-all duration-300 cursor-pointer shadow-[0_12px_24px_rgba(1,82,148,0.25)] hover:shadow-none inline-flex items-center justify-center group shrink-0"
              >
                Explorar Coleção
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Botão de Campanha (Multimídia) */}
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-3 lg:gap-4 group cursor-pointer w-full sm:w-auto justify-center sm:justify-start py-2 sm:py-0"
              >
                <div className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full border border-gray-200 bg-white shadow-md flex items-center justify-center group-hover:scale-105 group-hover:border-brand-blue flex-shrink-0 group-hover:shadow-[0_8px_16px_rgba(1,82,148,0.15)] transition-all duration-300">
                  <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-transparent border-l-brand-blue ml-1" />
                </div>
                <span className="text-[12px] md:text-[13px] font-bold tracking-wider text-[#0F172A] uppercase group-hover:text-brand-blue transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-brand-blue after:scale-x-0 group-hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                  Assistir Campanha
                </span>
              </button>
            </div>
          </div>
          <div className="md:w-[50%] lg:w-[55%] xl:w-[60%] w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] 2xl:h-[70vh] relative group flex justify-center items-center z-20 mt-8 md:mt-0">
            <div className="relative w-full h-full rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] outline outline-[3px] lg:outline-4 outline-white/80 outline-offset-[-3px] lg:outline-offset-[-4px]">
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
                alt="Quarto Luxuoso"
                className="w-full h-full object-cover grayscale-[0.3] brightness-[0.85] contrast-[1.1] transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

              {/* Hotspot 1: Bed */}
              <div className="absolute top-[45%] left-[50%] w-fit group/hotspot z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Cama Estofada Premium",
                      price: "4.200,00",
                      originalPrice: "4.900,00",
                      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
                      tag: "Oferta Especial",
                    });
                  }}>
                    <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                  <div
                    className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct({
                        name: "Cama Estofada Premium",
                        price: "4.200,00",
                        originalPrice: "4.900,00",
                        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
                        tag: "Oferta Especial",
                      });
                    }}
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                      CAMAS E CABECEIRAS
                    </span>
                    <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                      Cama Estofada Premium
                    </h4>
                    <div className="text-brand-blue font-bold text-[16px]">
                      R$ 4.200,00
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotspot 2: Lamp */}
              <div className="absolute top-[35%] left-[25%] w-fit group/hotspot z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Luminária de Chão Minimalista",
                      price: "850,00",
                      originalPrice: "1.100,00",
                      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                    });
                  }}>
                    <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                  <div
                    className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct({
                        name: "Luminária de Chão Minimalista",
                        price: "850,00",
                        originalPrice: "1.100,00",
                        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                      });
                    }}
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                      ILUMINAÇÃO
                    </span>
                    <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                      Luminária de Chão
                    </h4>
                    <div className="text-brand-blue font-bold text-[16px]">
                      R$ 850,00
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between z-20 pointer-events-none">
                <div>
                  <h3 className="text-white font-serif text-[32px] md:text-[40px] font-bold leading-tight mb-1 drop-shadow-md">
                    Quartos
                  </h3>
                  <p className="text-white/90 text-[14px] md:text-[16px] font-medium drop-shadow-sm">
                    O seu refúgio particular
                  </p>
                </div>
                <button
                   className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/40 bg-black/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#1C202F] transition-all duration-300 pointer-events-auto"
                   onClick={(e) => {
                     e.stopPropagation();
                     // go to quartos category logic if needed
                   }}
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Shop by Categories Section */}
      <section id="categorias" className="px-5 sm:px-6 py-16 md:py-24 bg-[#FAFAFA] relative z-20">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-8 xl:gap-12 items-start">
          <div className="lg:w-[260px] xl:w-[280px] flex flex-col justify-start items-start shrink-0 pt-0 lg:pt-8 w-full">
            <h2 className="text-[36px] md:text-[42px] font-bold text-[#0F172A] leading-[1.1] mb-6 md:mb-10 font-serif tracking-tight">
              Compre por <br className="hidden lg:block" />
              categorias
            </h2>

            <div className="flex items-center gap-4 mb-8 md:mb-12 w-full group cursor-pointer p-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1">
              <div className="w-[54px] h-[54px] rounded-xl border border-gray-100 bg-[#F8F9FA] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-brand-blue transition-colors duration-300">
                <Armchair
                  className="w-6 h-6 text-[#0F172A] group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[16px] leading-tight text-[#0F172A]">
                  200 +
                </span>
                <span className="text-[13px] text-gray-500 font-medium">
                  Produtos exclusivos
                </span>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center font-bold text-[12px] tracking-[0.25em] uppercase pb-1.5 border-b-[2px] border-[#0F172A] text-[#0F172A] hover:text-gray-500 hover:border-gray-500 transition-colors group"
            >
              TODAS AS CATEGORIAS
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="w-full lg:flex-1 relative min-w-0">
            <div className="absolute top-0 right-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-20 pointer-events-none lg:hidden" />

            <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-6 xl:gap-8 mt-6 lg:mt-0 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8 lg:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCategory(cat.name)}
                  className="w-[65vw] sm:w-full flex-shrink-0 snap-start flex flex-col group cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/5] bg-white flex items-center justify-center mb-4 sm:mb-5 transition-all duration-500 overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/60 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:border-gray-200/60">
                    <div className="absolute inset-0 bg-[#0F172A] mix-blend-overlay opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 z-10" />
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <ChevronRight className="w-5 h-5 text-[#0F172A]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start px-2 mt-1 w-full min-w-0">
                    <div className="flex items-center gap-2 xl:gap-3 w-full min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-full bg-[#f8f9fa] flex items-center justify-center border border-gray-100/80 shadow-sm group-hover:bg-white group-hover:border-gray-200 group-hover:shadow-md transition-all duration-300 shrink-0">
                        <cat.icon
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F172A]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-[17px] sm:text-[18px] xl:text-[19.5px] font-serif font-bold text-[#0F172A] leading-tight tracking-tight whitespace-pre-wrap text-left transition-all duration-300 group-hover:text-[#475569] group-hover:-translate-y-0.5 truncate w-full">
                        {cat.name.replace("\n", " ")}
                      </h3>
                    </div>
                    <div className="h-[2px] w-6 bg-transparent mt-3 transition-all duration-500 group-hover:bg-brand-blue group-hover:w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Pills */}
      <section className="py-4 px-4 sm:px-6 bg-white sticky top-[68px] md:top-[76px] z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:shadow-none">
        <div className="max-w-7xl mx-auto relative group">
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 w-full">
            {[
              { label: "Móveis de Madeira", id: "Móveis de\nMadeira" },
              { label: "Estofados", id: "Estofados" },
              { label: "Camas", id: "Camas" },
              { label: "Travesseiros", id: "Travesseiros" }
            ].map((filter, index) => (
              <button
                key={filter.label}
                onClick={() => handleSelectCategory(filter.id)}
                className="w-full md:w-auto px-2 md:px-6 py-2.5 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-[12px] md:text-[14px] transition-colors cursor-pointer border bg-white text-slate-700 border-gray-200 hover:border-brand-blue hover:text-white hover:bg-brand-blue shadow-sm"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Environments Inspiration */}
      <section className="w-full max-w-7xl mx-auto px-5 sm:px-6 mb-16 md:mb-24">
        <h2 className="text-[32px] md:text-[40px] font-serif font-bold text-[#0F172A] mb-8 md:mb-10 tracking-tight">
          Inspire-se por Ambientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          <div className="group relative h-[400px] md:h-[500px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg shadow-black/5">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
              alt="Sala de Estar"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.25,0.46,0.45,0.94] group-hover:scale-105"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C202F]/90 via-[#1C202F]/20 to-transparent pointer-events-none" />

            {/* Hotspot 1: Sofa */}
            <div className="absolute top-[40%] left-[55%] w-fit group/hotspot z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Sofá 3 Lugares Linho",
                      price: "3.100,00",
                      originalPrice: "3.900,00",
                      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
                      tag: "Destaque",
                    });
                  }}>
                   <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                <div
                  className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Sofá 3 Lugares Linho",
                      price: "3.100,00",
                      originalPrice: "3.900,00",
                      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
                      tag: "Destaque",
                    });
                  }}
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                    ESTOFADOS
                  </span>
                  <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                    Sofá 3 Lugares Linho
                  </h4>
                  <div className="text-brand-blue font-bold text-[16px]">
                    R$ 3.100,00
                  </div>
                </div>
              </div>
            </div>

            {/* Hotspot 2: Coffee Table */}
            <div className="absolute top-[75%] left-[45%] w-fit group/hotspot z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Mesa de Centro Orgânica",
                      price: "1.250,00",
                      originalPrice: "1.600,00",
                      image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=600&q=80",
                    });
                  }}>
                   <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                <div
                  className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Mesa de Centro Orgânica",
                      price: "1.250,00",
                      originalPrice: "1.600,00",
                      image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=600&q=80",
                    });
                  }}
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                    MESAS
                  </span>
                  <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                    Mesa de Centro Orgânica
                  </h4>
                  <div className="text-brand-blue font-bold text-[16px]">
                    R$ 1.250,00
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
              <div className="flex items-end justify-between pointer-events-auto cursor-pointer group" onClick={() => handleSelectCategory("Estofados")}>
                <div>
                  <h3 className="text-white text-[28px] md:text-[36px] font-serif font-bold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-1">
                    Sala de Estar
                  </h3>
                  <p className="text-white/80 text-[15px] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    Aconchego e elegância
                  </p>
                </div>

                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl hover:bg-white border border-white/20 hover:border-white rounded-full flex items-center justify-center text-white hover:text-[#0F172A] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95">
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative h-[400px] md:h-[500px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg shadow-black/5">
            <img
              src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1000&q=80"
              alt="Sala de Jantar"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.25,0.46,0.45,0.94] group-hover:scale-105"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C202F]/90 via-[#1C202F]/20 to-transparent pointer-events-none" />

            {/* Hotspot 1: Dining Table */}
            <div className="absolute top-[60%] left-[40%] w-fit group/hotspot z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Mesa de Jantar Escultural",
                      price: "6.500,00",
                      originalPrice: "8.200,00",
                      image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80",
                      tag: "Novidade",
                    });
                  }}>
                   <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>

              <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                <div
                  className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Mesa de Jantar Escultural",
                      price: "6.500,00",
                      originalPrice: "8.200,00",
                      image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80",
                      tag: "Novidade",
                    });
                  }}
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                    MESAS DE JANTAR
                  </span>
                  <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                    Mesa Escultural
                  </h4>
                  <div className="text-brand-blue font-bold text-[16px]">
                    R$ 6.500,00
                  </div>
                </div>
              </div>
            </div>

            {/* Hotspot 2: Chair */}
            <div className="absolute top-[48%] left-[65%] w-fit group/hotspot z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Cadeira Ergônomica Dark",
                      price: "1.400,00",
                      originalPrice: "1.800,00",
                      image: "https://images.unsplash.com/photo-1562184552-64f1ec58bd58?auto=format&fit=crop&w=600&q=80",
                    });
                  }}>
                   <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>

              <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
                <div
                  className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Cadeira Ergônomica Dark",
                      price: "1.400,00",
                      originalPrice: "1.800,00",
                      image: "https://images.unsplash.com/photo-1562184552-64f1ec58bd58?auto=format&fit=crop&w=600&q=80",
                    });
                  }}
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                    CADEIRAS
                  </span>
                  <h4 className="text-[#0F172A] font-bold text-[15px] mb-1 line-clamp-1">
                    Cadeira Ergônomica
                  </h4>
                  <div className="text-brand-blue font-bold text-[16px]">
                    R$ 1.400,00
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
              <div className="flex items-end justify-between pointer-events-auto cursor-pointer group" onClick={() => handleSelectCategory("Móveis de Madeira")}>
                <div>
                  <h3 className="text-white text-[28px] md:text-[36px] font-serif font-bold tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-1">
                    Sala de Jantar
                  </h3>
                  <p className="text-white/80 text-[15px] font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    Momentos inesquecíveis
                  </p>
                </div>

                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl hover:bg-white border border-white/20 hover:border-white rounded-full flex items-center justify-center text-white hover:text-[#0F172A] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95">
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Carousels */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <SectionCarousel title="Estofados" products={estofados} Icon={Sofa} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} onViewCategory={() => handleSelectCategory("Estofados")} />
          <SectionCarousel
            wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart}
            title="Móveis de Madeira"
            products={moveisMadeira}
            Icon={Box}
            onViewCategory={() => handleSelectCategory("Móveis de\nMadeira")}
          />
        </div>

        {/* Designer's Pick (Dark Mode) */}
        <section className="w-full bg-[#0F172A] text-white py-20 px-6 my-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7591A6]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <span className="text-[12px] font-bold tracking-[0.3em] uppercase mb-4 text-[#94A3B8] inline-flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#94A3B8]"></span>
                Designer's Pick
              </span>
              <h2 className="text-[40px] lg:text-[56px] font-bold font-serif leading-[1.1] mb-6 tracking-tight">
                Poltrona Costela <br />
                <span className="italic font-light text-slate-300">
                  Premium.
                </span>
              </h2>
              <p className="text-[#CBD5E1] text-[16px] lg:text-[18px] leading-relaxed mb-10 max-w-md font-light">
                Assinada e premiada. Uma peça que transcende a mobília,
                tornando-se o ponto focal absoluto de qualquer ambiente de alto
                padrão.
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-[14px] text-[#64748B] line-through decoration-[#64748B]/50 mb-1">
                    € 4.500,00
                  </span>
                  <span className="text-[32px] font-extrabold text-white leading-none">
                    R$ 3.800,00
                  </span>
                </div>
              </div>
              <button className="bg-white text-brand-blue px-10 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer">
                Adicionar ao Carrinho
              </button>
            </div>
            <div className="w-full md:w-1/2 relative group mt-8 md:mt-0">
              <div className="absolute inset-0 bg-white/5 rounded-[40px] transform rotate-3 group-hover:rotate-6 transition-transform duration-700 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80"
                alt="Poltrona Costela"
                className="w-full rounded-[40px] shadow-2xl relative z-10 group-hover:-translate-y-2 transition-transform duration-700 object-cover aspect-[4/3] md:aspect-auto md:h-[500px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <SectionCarousel
            wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart}
            title="Camas e Cabeceiras"
            products={camas}
            Icon={BedDouble}
            onViewCategory={() => handleSelectCategory("Camas")}
          />
          <SectionCarousel
            wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart}
            title="Colchões e Travesseiros"
            products={colchoes}
            Icon={Package}
            onViewCategory={() => handleSelectCategory("Colchões")}
          />
        </div>

        {/* Shop Our Instagram Section */}
        <section className="w-full py-16 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center mb-12">
            <h2 className="text-[36px] font-bold font-serif text-[#0F172A] mb-4 text-center">
              Shop Our Instagram
            </h2>
            <p className="text-gray-500 text-[16px] text-center max-w-lg mb-10">
              Inspire-se em como nossos clientes estão transformando seus
              espaços. Use a hashtag{" "}
              <span className="font-bold text-[#0F172A]">#MeuEuroOferta</span>.
            </p>
            <div className="w-full flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4 px-2">
              {[
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
              ].map((img, i) => (
                <div
                  key={i}
                  className="relative w-[75vw] sm:w-[280px] aspect-square shrink-0 group rounded-2xl overflow-hidden snap-center cursor-pointer shadow-sm"
                >
                  <img
                    src={img}
                    alt={`Social ${i}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                      <Heart className="w-7 h-7 fill-white text-white" />
                      <span>{Math.floor(Math.random() * 500) + 100}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Fake Instagram Icon using CSS shapes */}
                    <div className="w-6 h-6 border-[2px] border-white rounded-[6px] relative flex items-center justify-center">
                      <div className="w-2.5 h-2.5 border-[2px] border-white rounded-full"></div>
                      <div className="absolute top-1 right-1 w-[2px] h-[2px] bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* BottomNav Moved */}
            {/* Luxury Inspiration Banner */}
      <section className="px-4 sm:px-6 py-12 md:py-24 max-w-[1400px] mx-auto w-full">
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] rounded-[24px] md:rounded-[32px] overflow-hidden flex items-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] outline outline-4 outline-white/60 outline-offset-[-4px] group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80"
            alt="Design Exclusivo"
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-[0.85] contrast-[1.1] transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-brand-blue/10 mix-blend-multiply z-10 pointer-events-none" />

          {/* Hotspot 1: Sofá */}
          <div className="absolute top-[40%] left-[50%] md:top-[55%] md:left-[60%] w-fit group/hotspot z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white" onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct({
                  name: "Luminária de Teto Luxo",
                  price: "850,00",
                  originalPrice: "1.100,00",
                  image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                  tag: "Novidade",
                });
              }}>
                <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
              </div>
            </div>

            <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/hotspot:opacity-100 group-hover/hotspot:visible transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30 pointer-events-auto">
              <div
                className="bg-white/95 backdrop-blur-md min-w-[220px] rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] p-4 text-center cursor-pointer transform transition-transform hover:scale-105 border border-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct({
                    name: "Luminária de Teto Luxo",
                    price: "850,00",
                    originalPrice: "1.100,00",
                    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                    tag: "Novidade",
                  });
                }}
              >
                <div className="text-brand-blue font-bold text-[16px] mb-2">
                  R$ 850,00
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-1">
                  ILUMINAÇÃO
                </span>
                <h4 className="text-[#0F172A] font-bold text-[14px] line-clamp-1">
                  Luminária Exclusiva
                </h4>
              </div>
            </div>
          </div>

          <div className="relative z-20 w-full md:w-[65%] lg:w-[55%] p-8 md:p-14 lg:p-20 flex flex-col items-start justify-end md:justify-center h-full text-white pointer-events-none pb-12 md:pb-0">
            <span className="text-[11px] md:text-[13px] font-bold tracking-[0.4em] uppercase mb-4 md:mb-5 opacity-90 inline-block border-b border-white/30 pb-1.5">
              Design Exclusivo
            </span>
            <h2 className="text-[38px] sm:text-[44px] md:text-[52px] lg:text-[72px] font-serif font-bold leading-[1.05] tracking-tight mb-5 md:mb-6 drop-shadow-xl text-white">
              A Excelência do
              <br className="hidden sm:block" /> Feito à Mão
            </h2>
            <p className="text-[15px] sm:text-[16px] md:text-[17px] text-white/85 mb-8 md:mb-10 max-w-[460px] font-medium leading-[1.8] drop-shadow-md">
              Descubra móveis que unem o requinte clássico com o minimalismo contemporâneo. Cada peça é uma obra de arte pensada para transformar o seu espaço.
            </p>
            <button className="bg-white text-[#0F172A] px-8 py-3.5 sm:py-4 lg:py-[18px] lg:px-10 rounded-full font-bold hover:bg-gray-50 hover:scale-105 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.2)] cursor-pointer tracking-wide flex items-center gap-3 group/btn pointer-events-auto text-[14px] lg:text-[15px]">
              Explorar Coleção
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Opinião dos Clientes (Testimonials) */}
      <section className="py-20 px-6 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="text-[12px] font-bold tracking-[0.3em] uppercase mb-4 text-[#94A3B8] inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#94A3B8]"></span>
            Depoimentos
            <span className="w-8 h-[1px] bg-[#94A3B8]"></span>
          </span>
          <h2 className="text-[36px] lg:text-[48px] font-bold font-serif text-[#0F172A] mb-16">
            A Escolha dos{" "}
            <span className="italic text-brand-blue">Profissionais</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                text: "A qualidade dos acabamentos da Euro Oferta é algo que eu raramente encontro no mercado nacional. Meus projetos agora exigem esse nível de excelência.",
                name: "Laura Mendes",
                role: "Arquiteta de Interiores",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
              },
              {
                text: "Mais do que móveis, são obras de arte habitáveis. A poltrona Costela virou a assinatura visual dos meus últimos projetos corporativos de alto padrão.",
                name: "Carlos Figueiredo",
                role: "Design Director",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
              },
              {
                text: "Atendimento impecável, logística rápida e um design simplesmente irretocável. Meus clientes de luxo ficam sempre maravilhados com as entregas.",
                name: "Isabela Diniz",
                role: "Studio Designer",
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 md:p-10 rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100/60 flex flex-col items-center hover:-translate-y-2 transition-transform duration-500 group"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-500 font-medium italic text-lg leading-relaxed mb-8 flex-1 text-center">
                  "{t.text}"
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-slate-300 transition-colors">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-bold text-[#0F172A]">{t.name}</h4>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </>
      ) : currentView === 'category' && selectedCategory ? (
        <CategoryPage 
          category={selectedCategory} 
          products={
            selectedCategory?.name === "Móveis de\nMadeira" ? moveisMadeira :
            selectedCategory?.name === "Estofados" ? estofados :
            selectedCategory?.name === "Camas" ? camas :
            selectedCategory?.name === "Colchões" || selectedCategory?.name === "Travesseiros" ? colchoes :
            []
          }
          onBack={() => {
            setCurrentView('home');
            window.scrollTo(0, 0);
          }}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          setQuickViewProduct={setQuickViewProduct}
          setActiveImageIdx={setActiveImageIdx}
        />
      ) : (
        <div className="pt-28 pb-20 md:pt-36 md:pb-32 px-4 md:px-8 2xl:px-12 3xl:px-16 max-w-[1400px] mx-auto min-h-screen">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h2 className="text-[#1C202F] text-[36px] md:text-[48px] font-serif font-bold tracking-tight">Meus Desejos</h2>
                <span className="bg-[#F8F9FA] border border-gray-200 text-gray-600 text-sm md:text-base font-bold px-3.5 py-1.5 rounded-full mt-2 md:mt-0 shadow-sm">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
              {wishlist.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <button 
                    onClick={() => {
                        const baseUrl = window.location.origin;
                        navigator.clipboard.writeText(`Confira minha lista de desejos na Euro Oferta: ${wishlist.map(p => p.name).join(', ')}`);
                        showToast('wishlist', 'Link copiado!', 'Sua lista foi copiada para a área de transferência.');
                    }}
                    className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-brand-blue bg-white border border-gray-200 px-4 py-2 rounded-full transition-colors shadow-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    Compartilhar
                  </button>
                  <button 
                    onClick={() => {
                      wishlist.forEach(item => {
                        const itemExists = cart.find(cartItem => cartItem.name === item.name);
                        if (!itemExists) {
                          setCart(prev => [...prev, { ...item, qty: 1 }]);
                        }
                      });
                      setWishlist([]);
                      showToast('cart', 'Tudo no Carrinho!', 'Os itens foram movidos para o seu carrinho.');
                    }}
                    className="flex items-center gap-2 text-[13px] font-bold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue hover:text-white border border-brand-blue/20 px-4 py-2 rounded-full transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Mover todos para o carrinho
                  </button>
                </div>
              )}
            </div>
            <div className="w-full md:w-[320px] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-[-10px] md:mt-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {getWishlistTotal() >= 8000 ? (
                <>
                  <div className="flex items-center gap-2 text-[#00b873] font-bold mb-2 text-[15px]">
                    <Truck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    <span>Portes Grátis Desbloqueados!</span>
                  </div>
                  <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00b873] rounded-full w-full"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-600 font-medium mb-2 text-[13px] md:text-[14px]">
                    <Truck className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span>Faltam <strong>R$ {(8000 - getWishlistTotal()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para frete grátis</span>
                  </div>
                  <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min((getWishlistTotal() / 8000) * 100, 100)}%` }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[32px] border border-gray-100">
              <Heart className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1} />
              <p className="text-gray-500 text-lg">Sua lista de desejos está vazia.</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="mt-6 px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue-hover transition-colors"
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
              {wishlist.map((product, idx) => (
                <ProductCard
                  key={idx}
                  idx={idx}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  setQuickViewProduct={setQuickViewProduct}
                  setActiveImageIdx={setActiveImageIdx}
                  handleAddToCart={addToCart}
                />
              ))}
            </div>
            )}

          {wishlist.length > 0 && (
            <div className="max-w-[800px] bg-[#FAFAFA] rounded-[32px] p-8 md:p-12 mx-auto mt-16 border border-gray-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex-1 w-full text-center md:text-left z-10">
                <span className="text-[12px] font-bold uppercase tracking-widest text-[#64748B] mb-2 block">Resumo do Orçamento</span>
                <h3 className="font-bold font-serif text-[32px] md:text-[40px] text-[#0F172A] leading-tight mb-2">
                  R$ {getWishlistTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-[#64748B] font-medium text-[15px]">{wishlist.length} {wishlist.length === 1 ? 'peça selecionada' : 'peças selecionadas'}</p>
              </div>
              
              <div className="w-full md:w-auto z-10 flex flex-col items-center md:items-end w-full">
                <button 
                  className="w-full md:w-auto bg-[#0F172A] hover:bg-black text-white px-10 py-5 rounded-full font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 text-[14px] sm:text-[15px] shadow-[0_12px_24px_rgba(15,23,42,0.15)] hover:shadow-none hover:-translate-y-1"
                  onClick={() => {
                    wishlist.forEach(item => {
                       const itemExists = cart.find(cartItem => cartItem.name === item.name);
                       if (!itemExists) {
                         setCart(prev => [...prev, { ...item, qty: 1 }]);
                       }
                    });
                    setWishlist([]);
                    setShowLeadCapture(true);
                  }}
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  CONSULTAR DISPONIBILIDADE
                </button>
                <p className="text-center md:text-right text-gray-400 text-[13px] mt-4 max-w-[300px]">
                  Concierge dedicado via WhatsApp para condições especiais.
                </p>
              </div>
            </div>
          )}
        </div>
      )}



      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-between items-center px-4 py-3 z-40 pb-safe">
        <button className={`flex flex-col items-center ${currentView === 'home' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-900 transition-colors'}`} onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Home className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>
        <button 
          className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors"
          onClick={() => {
            setCurrentView('home');
            setTimeout(() => {
              document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          <LayoutGrid className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-medium mt-1">Categorias</span>
        </button>
        <button 
          className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors"
          onClick={() => {
            setCurrentView('home');
            setIsMobileSearchOpen(true);
          }}
        >
          <Search className="w-[22px] h-[22px]" />
          <span className="text-[10px] font-medium mt-1">Busca</span>
        </button>
        <button className={`flex flex-col items-center ${currentView === 'wishlist' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-900 transition-colors'}`} onClick={() => setCurrentView('wishlist')}>
          <div className="relative">
            <Heart className="w-[22px] h-[22px]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white leading-none">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Desejos</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors relative"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="relative">
            <ShoppingCart className="w-[22px] h-[22px]" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cart.reduce((sym, item) => sym + (item.qty || 1), 0)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Carrinho</span>
        </button>
      </nav>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="fixed inset-0 z-[110] flex justify-center items-center bg-black/60 backdrop-blur-md p-4 animate-fade-in md:items-center items-end" onClick={(e) => {
          if (e.target === e.currentTarget) setShowLeadCapture(false);
        }}>
          <div className="bg-white max-w-md w-full md:rounded-3xl rounded-t-3xl shadow-2xl p-8 relative  md:max-h-[85vh] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowLeadCapture(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 border border-gray-100 p-2 rounded-full transition-colors cursor-pointer bg-white z-10 shadow-sm">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-brand-blue" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 tracking-tight">Quase lá!</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Para prosseguirmos com seu pedido no WhatsApp, por favor, nos informe seus dados básicos.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (cart.length === 0) return;
              
              const errors = {
                name: leadForm.name.trim() === '',
                phone: leadForm.phone.replace(/\D/g, '').length < 10
              };
              setLeadFormErrors(errors);
              if (errors.name || errors.phone) return;
              
              const generatedOrderNum = adminStore.addLeadWithOrder({
                name: leadForm.name,
                phone: leadForm.phone,
                email: leadForm.email,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(leadForm.name)}&background=random&color=fff&bold=true&size=150`,
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
              })), getCartTotal());

              const text = `https://eurooferta.com.br/

💎 *NOVO PEDIDO - EURO OFERTA*
${generatedOrderNum ? `🔖 *ID DO PEDIDO:* ${generatedOrderNum}\n` : ''}
*👤 DADOS DO CLIENTE:*
▪️ *Nome:* ${leadForm.name}
▪️ *Telefone:* ${leadForm.phone}
${leadForm.email ? `▪️ *E-mail:* ${leadForm.email}\n` : ''}
*🛒 ITENS DO PEDIDO:*
${cart.map(p => {
  const priceRegex = (String(p.price) || "0").match(/[\d.,]+/);
  const priceStr = priceRegex ? priceRegex[0].replace(/\./g, '').replace(',', '.') : "0";
  const numPrice = parseFloat(priceStr) || 0;
  
  const optionsArray = [];
  if (p.color) optionsArray.push(`🎨 Cor: ${p.color}`);
  if (p.size) optionsArray.push(`📏 Tam: ${p.size}`);
  const optionsText = optionsArray.length > 0 ? optionsArray.join(' | ') + '\n' : '';

  return `🔹 *${p.qty || 1}x ${p.name}*
${optionsText}💰 Valor: ${p.showPrice === false ? 'Sob Consulta' : `R$ ${numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}`}).join('\n\n')}

*🧾 TOTAL DO PEDIDO:* R$ ${getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              
              const phone = localStorage.getItem('euro_store_phone') || '5565981183473';
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
              
              setShowLeadCapture(false);
              setIsCartOpen(false);
              setOrderSentItems([...cart]);
                            setOrderSentState(true);
              setCart([]);
              
              // Cereja do bolo: Confetti
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#015294', '#00b873', '#ffffff']
              });
            }} className="space-y-4">
               <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Nome Completo *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={leadForm.name} 
                    onChange={e => {
                       setLeadForm(f => ({...f, name: e.target.value}));
                       if (leadFormErrors.name && e.target.value.trim() !== '') setLeadFormErrors(e => ({ ...e, name: false }));
                    }} 
                    className={`w-full px-4 py-3 bg-gray-50 border ${leadFormErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-brand-blue'} rounded-xl focus:bg-white outline-none focus:ring-2 transition-colors`} 
                    placeholder="Ex: João da Silva"
                  />
                  {leadFormErrors.name && <span className="absolute -bottom-5 left-0 text-xs font-bold text-red-500">O nome é obrigatório.</span>}
                </div>
              </div>
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">WhatsApp *</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={leadForm.phone} 
                    onChange={e => {
                      const formatted = formatPhone(e.target.value);
                      setLeadForm(f => ({...f, phone: formatted}));
                      if (leadFormErrors.phone && formatted.replace(/\D/g, '').length >= 10) setLeadFormErrors(e => ({ ...e, phone: false }));
                    }} 
                    className={`w-full px-4 py-3 bg-gray-50 border ${leadFormErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-brand-blue'} rounded-xl focus:bg-white outline-none focus:ring-2 transition-colors`} 
                    placeholder="(00) 00000-0000"
                  />
                  {leadFormErrors.phone && <span className="absolute -bottom-5 left-0 text-xs font-bold text-red-500">Informe um número de telefone válido.</span>}
                </div>
              </div>
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">E-mail (Opcional)</label>
                <div className="relative">
                  <input type="email" value={leadForm.email} onChange={e => setLeadForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-brand-blue transition-colors" placeholder="joao@email.com"/>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-400" /> Resumo do Pedido
                </h4>
                
                {cart.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                     <p className="text-sm text-gray-500 font-medium">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 hide-scrollbar">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 group">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-white shadow-sm border border-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#0F172A] truncate" title={item.name}>{item.name}</p>
                            <p className="text-[11px] text-gray-500 font-medium">
                              {item.color && <span>Cor: {item.color} </span>}
                              {item.size && <span>Tam: {item.size}</span>}
                            </p>
                            <p className="text-xs text-brand-blue font-bold mt-0.5">{item.qty || 1}x {item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setCart(cart.filter((_, i) => i !== idx))} 
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-500">Total do Pedido</span>
                      <span className="text-lg font-bold text-brand-blue">R$ {getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </>
                )}
              </div>
              
              <button disabled={cart.length === 0} type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold py-4 rounded-xl shadow-[0_8px_16px_rgba(37,99,235,0.2)] hover:shadow-none hover:-translate-y-0.5 mt-6 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:hover:translate-y-0 active:scale-95">
                Continuar para WhatsApp <MessageCircle className="w-5 h-5 fill-white" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-[8px] transition-opacity"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md h-full shadow-[auto_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col translate-x-0 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 sm:px-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-serif tracking-tight text-[#0F172A]">
                  Sua Sacola
                </h2>
                <span className="bg-gray-100 text-gray-500 text-[13px] tracking-wide font-bold px-3 py-1 rounded-full uppercase">
                  {cart.reduce((sym, item) => sym + (item.qty || 1), 0)} {cart.reduce((sym, item) => sym + (item.qty || 1), 0) === 1 ? 'item' : 'itens'}
                </span>
              </div>
              <button
                className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-full hover:border-[#0F172A] transition-colors cursor-pointer"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="px-6 pt-5 pb-1">
              {getCartTotal() >= 8000 ? (
                <>
                  <div className="flex items-center gap-2 text-[#00b873] font-bold mb-2 text-[15px]">
                    <Truck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    <span>Portes Grátis Desbloqueados!</span>
                  </div>
                  <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00b873] rounded-full w-full"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 text-gray-600 font-medium mb-2 text-[14px]">
                    <div className="flex items-center gap-2">
                       <Truck className="w-[18px] h-[18px]" strokeWidth={2} />
                       <span>Faltam <strong>R$ {(8000 - getCartTotal()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para frete grátis</span>
                    </div>
                  </div>
                  <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min((getCartTotal() / 8000) * 100, 100)}%` }}></div>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cart.map((item, id) => (
                  <div
                    key={id}
                    className="flex gap-5 p-5 border border-gray-100/60 rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F8F9FA] rounded-[16px] overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="pr-8">
                        <h4 className="font-bold font-serif text-[18px] text-[#0F172A] leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        {(item.color || item.size) && (
                          <div className="flex gap-2 mb-1">
                            {item.color && <span className="text-[12px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-gray-100 rounded-md">Cor: {item.color}</span>}
                            {item.size && <span className="text-[12px] font-bold text-gray-500 uppercase px-2 py-0.5 bg-gray-100 rounded-md">Tam: {item.size}</span>}
                          </div>
                        )}
                        <p className="text-[15px] font-bold text-gray-400">
                          {item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-[#F8F9FA] rounded-full border border-gray-100 p-1">
                          <button onClick={() => updateCartQty(item.name, item.color, item.size, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-[#0F172A] cursor-pointer shadow-sm transition-all">
                            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                          <span className="w-8 text-center text-[15px] font-bold text-[#0F172A]">
                            {item.qty || 1}
                          </span>
                          <button onClick={() => updateCartQty(item.name, item.color, item.size, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-brand-blue cursor-pointer shadow-sm transition-all">
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.name, item.color, item.size)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-full cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 sm:p-8 bg-white border-t border-gray-100 shadow-[0_-4px_30px_-10px_rgba(0,0,0,0.08)] mt-auto">
              <div className="flex justify-between items-end mb-6">
                <div className="flex flex-col">
                   <span className="text-gray-400 text-[13px] font-bold uppercase tracking-wider mb-1">Total Estimado</span>
                   <span className="text-gray-500 text-[12px] sm:text-[13px]">Taxas e frete calculados no checkout</span>
                </div>
                <span className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#0F172A] leading-none tracking-tight">
                  R$ {getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button 
                  disabled={cart.length === 0}
                  onClick={() => setShowLeadCapture(true)}
                  className="w-full disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed bg-[#0F172A] hover:bg-black text-white flex items-center justify-center gap-3 py-4 sm:py-5 rounded-full font-bold text-[14px] sm:text-[15px] transition-all shadow-[0_12px_24px_rgba(15,23,42,0.2)] hover:shadow-none hover:-translate-y-1 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  FINALIZAR VIA WHATSAPP
                </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Features Block */}
      <section className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-brand-blue group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-[20px] md:text-[22px] font-bold font-serif text-[#0F172A] mb-3 tracking-tight">
                Entrega Premium
              </h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Logística especializada com montagem grátis em todo o território
                nacional.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <ShieldCheck
                  className="w-6 h-6 md:w-8 md:h-8 text-brand-blue group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-[20px] md:text-[22px] font-bold font-serif text-[#0F172A] mb-3 tracking-tight">
                Garantia Estendida
              </h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Até 5 anos de garantia estrutural para a sua tranquilidade e
                conforto.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-brand-blue group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-[20px] md:text-[22px] font-bold font-serif text-[#0F172A] mb-3 tracking-tight">
                Design Exclusivo
              </h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Assinatura de grandes nomes do design de interiores e materiais
                nobres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue py-16 md:py-20 text-white relative z-20">
        <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Brand Column */}
            <div className="flex flex-col items-start text-left">
              <h2 className="font-serif text-[32px] font-bold tracking-tight mb-6">Euro Oferta</h2>
              <p className="text-white/70 text-sm font-medium leading-relaxed mb-8 max-w-[280px]">
                A excelência em mobiliário e decoração, curadoria exclusiva das melhores peças para a sua casa. Trazemos o luxo do design europeu para o seu dia a dia.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5 text-white/80" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5 text-white/80" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Smartphone className="w-5 h-5 text-white/80" />
                </a>
              </div>
            </div>

            {/* Links 1 */}
            <div className="flex flex-col">
              <h3 className="font-bold text-[13px] tracking-[0.15em] mb-8 text-white uppercase">Departamentos</h3>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Móveis</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Decoração</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Iluminação</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Tapetes</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Exterior</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px] flex items-center gap-2">Pronta Entrega <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Novo</span></a></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div className="flex flex-col">
              <h3 className="font-bold text-[13px] tracking-[0.15em] mb-8 text-white uppercase">Atendimento</h3>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Central de Ajuda</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Trocas e Devoluções</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Acompanhar Pedido</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Fale Conosco</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Política de Privacidade</a></li>
                <li><a href="#" className="text-white/70 font-medium hover:text-white transition-colors text-[14px]">Termos de Uso</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col">
              <h3 className="font-bold text-[13px] tracking-[0.15em] mb-8 text-white uppercase">Newsletter</h3>
              <p className="text-white/70 text-[14px] font-medium leading-relaxed mb-6">
                Cadastre-se para receber novidades, inspirações e ofertas exclusivas no seu email.
              </p>
              <form className="relative mt-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all pr-14"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-brand-blue rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 ml-0.5" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              <span className="text-white/50 text-[13px] font-medium">&copy; 2026 Euro Oferta - Luxo Home. Todos os direitos reservados.</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-white/20"></span>
              <button 
                onClick={() => {
                  window.scrollTo(0, 0);
                  setCurrentView('admin');
                }} 
                className="text-white/60 hover:text-white transition-colors uppercase tracking-widest text-[10px] sm:text-[11px] cursor-pointer flex items-center gap-1.5 font-bold bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10"
              >
                <Lock className="w-3.5 h-3.5" strokeWidth={2.5} /> Área ADM
              </button>
            </div>
            <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Visa">VISA</div>
              <div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Mastercard">MASTERCARD</div>
              <div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Amex">AMEX</div>
              <div className="h-6 flex items-center justify-center px-2 bg-white/20 rounded text-[10px] font-bold text-white uppercase" title="Pix">PIX</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante "Voltar ao Topo" */}
      <button
        onClick={(e) => { e.preventDefault(); setCurrentView('home'); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className={`fixed bottom-20 md:bottom-8 left-4 md:left-8 w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(15,23,42,0.3)] cursor-pointer transition-all duration-500 z-[60] hover:scale-110 ${isScrolled && !isCartOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <ArrowUp className="w-5 h-5" strokeWidth={2} />
      </button>
      {/* Floating Action Button (Concierge VIP) */}
      <div
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[60] flex flex-col items-end gap-3 transition-opacity duration-300 ${isCartOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={() => { if (window.innerWidth >= 768) setIsFabOpen(true); }}
        onMouseLeave={() => { if (window.innerWidth >= 768) setIsFabOpen(false); }}
      >
        {/* Expanded Menu Actions */}
        <div
          className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom right-0 ${isFabOpen ? "scale-100 opacity-100 translate-y-0 pointer-events-auto" : "scale-75 opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <button className="bg-white border-2 border-brand-blue text-[#1C202F] px-5 py-3 rounded-full flex items-center gap-3 shadow-lg hover:bg-gray-50 transition-colors font-bold whitespace-nowrap group">
            <span className="text-[13px] md:text-[14px]">Agendar Visita</span>
            <Calendar className="w-5 h-5 text-[#475569] group-hover:text-brand-blue transition-colors" />
          </button>

          <button className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-lg transition-colors font-bold whitespace-nowrap">
            <span className="text-[13px] md:text-[14px]">WhatsApp VIP</span>
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Primary FAB Button */}
        <div className="relative flex items-center gap-4">
          {!isFabOpen && (
            <div className="hidden md:flex animate-fade-in items-center bg-white/90 backdrop-blur-sm text-[#0F172A] font-medium text-[13px] px-4 py-2.5 rounded-[12px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative after:content-[''] after:absolute after:top-1/2 after:-right-2 after:-translate-y-1/2 after:border-t-[6px] after:border-b-[6px] after:border-l-[8px] after:border-transparent after:border-l-white/90 pointer-events-none whitespace-nowrap">
              Precisa de ajuda?
            </div>
          )}
          <button
            className="bg-[#1C202F] hover:bg-black text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-transform hover:scale-105 active:scale-95 relative"
            onClick={() => setIsFabOpen(!isFabOpen)}
          >
            {/* Notification Pulse */}
            {!isFabOpen && (
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-blue border-2 border-[#1C202F]"></span>
              </span>
            )}
            
            {isFabOpen ? (
              <X className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Quick view modal */}
      {quickViewProduct && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-[20px] md:rounded-[24px] shadow-2xl w-full max-w-[900px] overflow-y-auto overflow-x-hidden md:overflow-hidden relative flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] min-h-[440px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm border border-gray-100 cursor-pointer text-gray-500"
              onClick={() => setQuickViewProduct(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="md:w-1/2 h-auto flex flex-col bg-[#F5F5F5] p-5 lg:p-6 relative">
              <div className="absolute top-4 left-4 z-10 flex gap-3">
                <span className="bg-brand-blue text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                  Novo
                </span>
              </div>
              <div className="absolute top-4 right-14 md:right-4 lg:left-24 lg:right-auto z-10">
                <div className="group/badge relative bg-white/90 backdrop-blur-md border border-white/40 text-[#1C202F] text-[10px] md:text-[11px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-wide flex items-center gap-2 shadow-[0_8px_16px_rgba(0,0,0,0.06)] cursor-default overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000" />
                  <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-blue" />
                  <span>Design Assinado</span>
                </div>
              </div>

              <div className="w-full flex-1 flex flex-col justify-center mt-8 md:mt-10 mb-4 relative group">
                <div
                  className="w-full h-40 sm:h-48 md:h-[260px] flex items-center justify-center relative mb-3 md:mb-4 cursor-zoom-in"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                >
                  {activeImageIdx > 0 && (
                    <button
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1C202F] shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer -translate-x-2 group-hover:translate-x-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev: number) =>
                          Math.max(0, prev - 1),
                        );
                      }}
                    >
                      <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  )}
                  {activeImageIdx < getQuickViewImages(quickViewProduct).length - 1 && (
                    <button
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-[#1C202F] shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer translate-x-2 group-hover:translate-x-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev: number) =>
                          Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1),
                        );
                      }}
                    >
                      <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  )}
                  <motion.img
                    key={(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image || '') + activeImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={
                      getQuickViewImages(quickViewProduct)[activeImageIdx]
                    }
                    alt={quickViewProduct.name}
                    className="max-w-full max-h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px] pointer-events-none" />
                  <button className="absolute bottom-4 right-4 md:bottom-3 md:right-3 w-[42px] h-[42px] bg-white shadow-lg shadow-black/10 hover:bg-gray-50 rounded-full flex items-center justify-center text-[#1C202F] opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10 translate-y-2 group-hover:translate-y-0">
                    <ZoomIn className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 justify-center w-full mt-auto">
                {getQuickViewImages(quickViewProduct).map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-[60px] h-[60px] rounded-[14px] overflow-hidden transition-all cursor-pointer bg-white ${activeImageIdx === idx ? "ring-2 ring-offset-2 ring-[#7591A6] shadow-md scale-105" : "ring-1 ring-transparent hover:ring-gray-200 opacity-70 hover:opacity-100"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx(idx);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-gray-500 text-xs md:text-[13px] font-medium ml-1.5 md:ml-2">
                  (12 Avaliações)
                </span>
              </div>
              <h2 className="text-[22px] md:text-[26px] lg:text-[30px] font-serif font-bold text-[#1C202F] leading-[1.2] mb-1.5 md:mb-2">
                {quickViewProduct.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4">
                <span className="text-[10px] md:text-[11px] font-bold text-[#7591A6] tracking-widest uppercase">
                  Móveis de Madeira
                </span>
                <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-status-pulse"></div>
                  <span className="text-[10px] font-bold tracking-wide">
                    {Math.floor(Math.random() * 25) + 12} pessoas estão a ver
                    esta peça agora
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="text-[24px] md:text-[28px] font-bold text-[#1C202F]">
                  {quickViewProduct.showPrice !== false ? `R$ ${quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.price || quickViewProduct.price}` : <span className="text-[18px] uppercase tracking-widest text-brand-blue">Consulte o Preço</span>}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.showPrice !== false && (
                <span className="text-sm md:text-base font-medium text-[#7591A6] line-through">
                  R$ {quickViewProduct.originalPrice}
                </span>
                )}
              </div>

              <p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">
                {quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.description || quickViewProduct.description || "Design escandinavo em madeira de carvalho maciço. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal."}
              </p>

              {(() => {
                const activeColorObj = quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name));
                const actualLength = (activeColorObj?.length && String(activeColorObj.length).trim() !== "") ? activeColorObj.length : quickViewProduct.length;
                const actualWidth = (activeColorObj?.width && String(activeColorObj.width).trim() !== "") ? activeColorObj.width : quickViewProduct.width;
                const actualHeight = (activeColorObj?.height && String(activeColorObj.height).trim() !== "") ? activeColorObj.height : quickViewProduct.height;
                const actualWeight = (activeColorObj?.weight && String(activeColorObj.weight).trim() !== "") ? activeColorObj.weight : quickViewProduct.weight;
                const hasDimensions = Boolean(actualLength || actualWidth || actualHeight || actualWeight);

                const dLength = actualLength || '-';
                const dWidth = actualWidth || '-';
                const dHeight = actualHeight || '-';
                const dWeight = actualWeight || '-';
                const dTags = activeColorObj?.tags || quickViewProduct.tags;
                const dStock = quickViewProduct.showStock ? quickViewProduct.stock : null;

                return (
                  <>
                  {hasDimensions && (
                    <div className="mb-5 flex items-center justify-between gap-2.5 animate-fade-in-up border border-gray-100 rounded-xl p-3 bg-gray-50/50" style={{ animationDelay: '50ms' }}>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Box className="w-4 h-4 text-gray-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Dimensões</span>
                        </div>
                        <div className="flex gap-2.5 md:gap-3">
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dLength}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dLength !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Compr.</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWidth}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWidth !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Largura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dHeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dHeight !== '-' ? 'm' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Altura</span>
                          </div>
                          <div className="w-px h-6 bg-gray-200 self-center"></div>
                          <div className="flex flex-col items-center justify-center">
                             <div className="flex items-baseline gap-0.5">
                               <span className="text-[12px] font-bold text-[#1E293B] tabular-nums leading-none">{dWeight}</span>
                               <span className="text-[9px] text-gray-400 font-medium leading-none">{dWeight !== '-' ? 'kg' : ''}</span>
                             </div>
                             <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-1">Peso</span>
                          </div>
                        </div>
                    </div>
                  )}

                  {dTags && (
                    <div className="mb-5 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                       {dTags.split(',').filter((t: string) => t.trim()).map((tag: string, idx: number) => (
                           <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] md:text-[11px] font-bold tracking-widest uppercase border border-brand-blue/10 cursor-default">
                              <Layers className="w-3 h-3" />
                              {tag.trim()}
                           </span>
                       ))}
                    </div>
                  )}

                  {dStock != null && dStock !== undefined && (
                    <div className="mb-4 md:mb-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                       <div className="flex items-center gap-2">
                         <div className="flex items-center justify-center">
                           <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                         </div>
                         <span className="text-[10px] md:text-[11px] font-bold text-[#1E293B] uppercase tracking-widest mt-0.5">
                           Em Estoque 
                           <span className="text-gray-400 font-medium ml-1.5 hidden sm:inline-block">/ Pronta Entrega</span>
                         </span>
                       </div>
                       <div className="flex items-end gap-1 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100">
                         <span className="text-[13px] font-[800] text-[#0F172A] tabular-nums leading-none">{dStock}</span>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Unid.</span>
                       </div>
                    </div>
                  )}
                  </>
                );
              })()}

              {(quickViewProduct.colors?.length > 0 || quickViewProduct.sizes?.length > 0) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4 mb-5 border border-gray-100 py-3 px-4 bg-[#FAFAFA] rounded-[16px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="flex-1 w-full">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.colors.length === 1 ? 'Cor' : 'Selecione a Cor'}
                    {quickViewProduct.color && <span className="text-gray-500 font-medium capitalize truncate max-w-[120px]">- {quickViewProduct.color}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c: any, i: number) => {
                      const isSelected = quickViewProduct.color === c.name || (!quickViewProduct.color && i===0);
                      return (
                      <div key={i} className="relative group/color">
                        <button
                          onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer shadow-sm ${isSelected ? 'border-[#0F172A] scale-110 ring-2 ring-transparent ring-offset-1' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}`}
                        >
                          <div className="w-[85%] h-[85%] rounded-full shadow-inner block" style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </button>
                        <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max text-center bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl border border-white/10 group-hover/color:delay-100 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                          {c.name}
                        </span>
                      </div>
                    )})}
                  </div>
                </div>
                )}

                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="flex-1 w-full sm:pl-4 sm:border-l sm:border-gray-200">
                  <span className="text-[10px] md:text-[10px] font-bold text-[#1C202F] uppercase tracking-widest mb-2 block flex items-center gap-2">
                    {quickViewProduct.sizes.length === 1 ? 'Tamanho' : 'Selecione Tamanho'}
                    {quickViewProduct.size && <span className="text-gray-500 font-medium capitalize truncate max-w-[80px]">- {quickViewProduct.size}</span>}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setQuickViewProduct({ ...quickViewProduct, size: s })}
                        className={`px-3 py-1 rounded-[8px] text-[11px] font-bold border transition-all ${quickViewProduct.size === s || (!quickViewProduct.size && i===0) ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
              )}

              {/* Action Block */}
              <div className="mt-auto pt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  {quickViewProduct.showPrice !== false ? (
                  <button onClick={(e) => addToCart(quickViewProduct, e)} className="flex-[4] bg-brand-blue hover:bg-brand-blue-hover text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(1,82,148,0.25)] hover:shadow-[0_6px_20px_rgba(1,82,148,0.35)] hover:-translate-y-0.5 group/btn">
                    <ShoppingCart className="w-[18px] h-[18px] transition-transform duration-300 group-hover/btn:-rotate-12" />
                    Adicionar ao Pedido
                  </button>
                  ) : (
                  <a 
                    href={`https://wa.me/55${storeSettings.whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de consultar o preço do produto: ${quickViewProduct.name} (SKU: ${quickViewProduct.sku || 'N/A'})`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-[4] bg-[#10B981] hover:bg-[#059669] text-white py-3.5 md:py-4 px-4 md:px-5 rounded-[12px] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 group/wa"
                  >
                    <MessageCircle className="w-[18px] h-[18px] transition-transform duration-300 group-hover/wa:scale-110" /> 
                    Consultar via WhatsApp
                  </a>
                  )}
                  <button 
                    className="flex-shrink-0 w-[54px] md:w-[60px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-[12px] transition-colors text-[#64748B] hover:text-red-500 hover:border-red-200 flex items-center justify-center cursor-pointer shadow-sm group/wish"
                    title="Adicionar à Lista de Desejos"
                    onClick={(e) => toggleWishlist(quickViewProduct, e)}
                  >
                    <Heart
                      className={`w-[22px] h-[22px] transition-transform duration-300 group-hover/wish:scale-110 ${wishlist.some(item => item.name === quickViewProduct?.name) ? 'fill-red-500 text-red-500' : ''}`}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                
                {/* Shipping info below button */}
                <div className="flex items-center justify-center gap-2 mt-1 opacity-90 pb-2">
                  <Truck className="w-4 h-4 text-brand-blue" strokeWidth={2} />
                  <span className="text-[#475569] font-medium text-[12px] md:text-[13px]">
                    Entrega agendada para todo o <span className="font-bold text-brand-blue">Brasil</span>.
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-2 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 gap-1.5 md:gap-2">
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-green-600 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">100% Segura</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-amber-500 transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Garantia</span>
                 </div>
                 <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-[#FAFBFB] transition-all duration-300 group/badge">
                    <div className="w-6 h-6 mb-1.5 flex items-center justify-center text-[#94A3B8] group-hover/badge:text-brand-blue transition-colors duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span className="text-[8px] font-bold text-[#64748B] group-hover/badge:text-[#1E293B] uppercase tracking-widest transition-colors">Entrega VIP</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for zooming */}
      {isZoomed && quickViewProduct && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 z-30 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-[90vw] h-[90vh] flex items-center justify-center">
            {activeImageIdx > 0 && (
              <button
                className="absolute left-0 md:-left-8 z-30 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.max(0, prev - 1));
                }}
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            <div className="relative group/lightbox flex items-center justify-center max-w-full max-h-full">
              <img
                src={
                  getQuickViewImages(quickViewProduct)[activeImageIdx]
                }
                alt={quickViewProduct.name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl cursor-zoom-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/lightbox:opacity-100 transition-duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-black/40 text-white/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl scale-75 group-hover/lightbox:scale-100 transition-all duration-300">
                  <ZoomOut className="w-8 h-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {activeImageIdx < getQuickViewImages(quickViewProduct).length - 1 && (
              <button
                className="absolute right-0 md:-right-8 z-30 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1));
                }}
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>
            )}

            <div className="absolute bottom-[-10px] md:bottom-[-20px] left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button
                className={`p-2 rounded-full md:hidden ${activeImageIdx === 0 ? "text-white/30" : "text-white/80"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.max(0, prev - 1));
                }}
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
              </button>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeImageIdx === idx ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx(idx);
                    }}
                  />
                ))}
              </div>
              <button
                className={`p-2 rounded-full md:hidden ${activeImageIdx === getQuickViewImages(quickViewProduct).length - 1 ? "text-white/30" : "text-white/80"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev: number) => Math.min(getQuickViewImages(quickViewProduct).length - 1, prev + 1));
                }}
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Order Sent Modal */}
      {orderSentState && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-[600px] max-h-[95vh] overflow-y-auto hide-scrollbar shadow-2xl flex flex-col items-center p-8 md:p-14 relative scale-in-center border border-gray-100 mx-auto">
            
            <button 
              onClick={() => {
                setOrderSentState(false);
                setOrderSentItems([]);
                setCurrentView('home');
                window.scrollTo(0, 0);
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </button>

            <div className="w-20 h-20 mb-4 md:mb-6 flex items-center justify-center mt-2 md:-mt-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#015294" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-sm">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-3 md:mb-4 text-center tracking-tight">Pedido Enviado!</h2>
            
            <p className="text-gray-600 font-medium text-center text-sm md:text-[17px] mb-8 max-w-[420px] leading-relaxed md:leading-8 px-2">
              Seu catálogo foi gerado com sucesso e enviado para um de nossos consultores.
            </p>

            <div className="w-full bg-gray-50/50 rounded-[24px] p-4 md:p-6 mb-8 md:mb-10 max-w-lg border border-gray-100/50">
              <div className="flex w-full gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
                {orderSentItems.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-white p-2.5 pr-5 rounded-2xl shadow-sm border border-gray-100/50 snap-start">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col max-w-[140px]">
                      <span className="text-[13px] md:text-[14px] font-bold text-gray-900 truncate" title={item.name}>{item.name}</span>
                      <span className="text-[12px] md:text-[13px] text-gray-500 font-medium whitespace-nowrap">{item.showPrice === false ? "Sob Consulta" : `R$ ${item.price}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setOrderSentState(false);
                setOrderSentItems([]);
                setCurrentView('home');
                window.scrollTo(0, 0);
              }}
              className="bg-brand-blue hover:bg-brand-blue-hover text-white py-4 md:py-5 px-8 w-full md:w-auto md:min-w-[340px] rounded-[18px] font-bold text-[14px] md:text-[15px] uppercase tracking-wider transition-colors shadow-xl shadow-[#015294]/20 cursor-pointer max-w-sm hover:-translate-y-1"
            >
              CONTINUAR NAVEGANDO
            </button>
            <p className="text-gray-500 font-medium text-xs md:text-sm mt-5 md:mt-6 text-center">Um de nossos consultores responderá em breve.</p>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8 animate-fade-in">
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black scale-in-center">
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 flex items-center justify-center rounded-full text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
            <iframe 
              className="w-full h-full border-0" 
              src="https://www.youtube.com/embed/WyQq6Gqfd4A?autoplay=1&mute=1" 
              title="Campanha Quartos Decorados | Design de Interiores" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}

    </div>
    </>
  );
}






































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































