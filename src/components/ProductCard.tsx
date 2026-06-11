import React from 'react';
import { Heart, Search, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  wishlist: Product[];
  toggleWishlist: (product: Product, e: React.MouseEvent) => void;
  setQuickViewProduct: (product: Product) => void;
  setActiveImageIdx: (idx: number) => void;
  handleAddToCart: (product: Product, e: React.MouseEvent) => void;
  idx?: number;
  mobileVisibleCount?: number;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  wishlist,
  toggleWishlist,
  setQuickViewProduct,
  setActiveImageIdx,
  handleAddToCart,
  idx = 0,
  mobileVisibleCount = 999,
  className = ""
}) => {
  const [currentImage, setCurrentImage] = React.useState(product.image);
  const [isImageFading, setIsImageFading] = React.useState(false);
  const [activeColorIdx, setActiveColorIdx] = React.useState<number>(0);

  const handleColorSelect = (colorImg: string | undefined, colorIdx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (activeColorIdx === colorIdx) return;
    setActiveColorIdx(colorIdx);
    
    if (colorImg && colorImg !== currentImage) {
      setIsImageFading(true);
      setTimeout(() => {
        setCurrentImage(colorImg);
        setIsImageFading(false);
      }, 150);
    }
  };

  const displayPrice = product.colors && product.colors[activeColorIdx]?.price ? product.colors[activeColorIdx].price : product.price;
  const displayOriginalPrice = product.colors && product.colors[activeColorIdx]?.originalPrice ? product.colors[activeColorIdx].originalPrice : product.originalPrice;

  return (
    <div
      className={`group relative flex flex-col p-4 bg-white/70 backdrop-blur-sm rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/50 hover:border-gray-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 ${idx >= mobileVisibleCount ? 'hidden md:flex' : 'flex'} ${className}`}
    >
      <div className="relative w-full aspect-[4/3] object-cover sm:aspect-[5/4] rounded-[16px] overflow-hidden bg-[#F4F5F7] shrink-0 mb-4 isolate">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointers-none"></div>
        {product.tag && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] md:text-xs font-bold tracking-wider uppercase shadow-sm bg-brand-blue text-white" style={product.tagColor ? { backgroundColor: product.tagColor, color: '#fff' } : {}}>
              {product.tag}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <div className="relative group/heart flex items-center">
            <span className="absolute right-[calc(100%+8px)] opacity-0 group-hover/heart:opacity-100 translate-x-2 group-hover/heart:translate-x-0 transition-all duration-300 bg-gray-900 text-white text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium pointer-events-none shadow-xl flex items-center before:content-[''] before:absolute before:right-[-4px] before:top-1/2 before:-translate-y-1/2 before:border-y-[4px] before:border-y-transparent before:border-l-[4px] before:border-l-gray-900 z-50">
              Favoritar
            </span>
            <button 
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              onClick={(e) => toggleWishlist(product, e)}
            >
              <Heart className={`w-[18px] h-[18px] transition-transform duration-300 group-hover/heart:scale-110 ${wishlist.some(item => item.name === product.name) ? 'fill-red-500 text-red-500 scale-110' : ''}`} strokeWidth={2} />
            </button>
          </div>
          <div className="relative group/search flex items-center">
            <span className="absolute right-[calc(100%+8px)] opacity-0 group-hover/search:opacity-100 translate-x-2 group-hover/search:translate-x-0 transition-all duration-300 bg-gray-900 text-white text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium pointer-events-none shadow-xl flex items-center before:content-[''] before:absolute before:right-[-4px] before:top-1/2 before:-translate-y-1/2 before:border-y-[4px] before:border-y-transparent before:border-l-[4px] before:border-l-gray-900 z-50">
              Espiar
            </span>
            <button
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-400 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:text-brand-blue hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const productToView = product.colors && product.colors.length > 0 
                  ? { ...product, color: product.colors[activeColorIdx].name, image: currentImage, price: displayPrice, originalPrice: displayOriginalPrice }
                  : product;
                setQuickViewProduct(productToView);
                setActiveImageIdx(0);
              }}
            >
              <Search className="w-[18px] h-[18px] transition-transform duration-300 group-hover/search:scale-110" strokeWidth={2} />
            </button>
          </div>
        </div>

        <img
          src={currentImage}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${isImageFading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
          referrerPolicy="no-referrer"
          loading={idx < 4 ? undefined : "lazy"}
        />
      </div>

      <div className="flex flex-col relative w-full flex-1 justify-between">
        <div className="relative group/name block mb-3">
          <h3
            className="font-bold text-[18px] lg:text-[20px] text-[#0F172A] mb-1.5 line-clamp-2 leading-[1.3] font-serif cursor-pointer group-hover:text-brand-blue transition-colors duration-300"
            title={product.name}
            onClick={(e) => {
              e.preventDefault();
              const productToView = product.colors && product.colors.length > 0 
                  ? { ...product, color: product.colors[activeColorIdx].name, image: currentImage, price: displayPrice, originalPrice: displayOriginalPrice }
                  : product;
              setQuickViewProduct(productToView);
              setActiveImageIdx(0);
            }}
          >
            {product.name}
          </h3>
          
          {product.category && (
            <p className="text-[12px] font-medium text-gray-500 mb-2 uppercase tracking-wide">{product.category}</p>
          )}

          {product.colors && product.colors.length > 0 ? (
            <div className="flex gap-2 items-center mt-3 relative z-40">
              {product.colors.slice(0, 4).map((c: any, i: number) => (
                <div key={i} className="relative group/color flex items-center justify-center">
                  <button
                    onClick={(e) => handleColorSelect(c.image || product.image, i, e)}
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-300 ${activeColorIdx === i ? 'ring-2 ring-brand-blue ring-offset-2 scale-110 shadow-md' : 'border border-gray-200 shadow-sm hover:scale-110 hover:border-gray-300'}`}
                  >
                    <span 
                      className="w-full h-full rounded-full block border border-black/5"
                      style={{ backgroundColor: c.hex, backgroundImage: c.texture ? `url(${c.texture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  </button>
                  {/* Tooltip Cereja do Bolo */}
                  <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 pointer-events-none z-[100] min-w-max max-w-[160px] text-center bg-[#0F172A] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 group-hover/color:delay-150 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[4px] after:border-t-[#0F172A] after:border-x-[4px] after:border-x-transparent">
                    {c.name}
                  </span>
                </div>
              ))}
              {product.colors.length > 4 && (
                <span className="text-[11px] text-gray-400 font-medium ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          ) : product.color && product.color !== "" ? (
            <p className="text-[12px] text-[#64748B] font-medium">
              {product.color}
            </p>
          ) : null}
        </div>

        <div className="flex justify-between items-end w-full mt-auto gap-2">
          <div className="flex flex-col min-w-0 flex-1 relative">
            <div className={`transition-all duration-300 ${isImageFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {displayOriginalPrice && product.showPrice !== false && (
                <span className="text-[12px] md:text-[14px] font-semibold text-[#A0AEC0] line-through decoration-[#A0AEC0]/50 tracking-wide mb-1 truncate block">
                  R$ {displayOriginalPrice}
                </span>
              )}
              {product.showPrice !== false ? (
                <span className="text-[18px] md:text-[22px] font-extrabold text-[#0F172A] leading-none tracking-tight truncate block">
                  R$ {displayPrice}
                </span>
              ) : (
                <span className="text-[14px] font-extrabold text-brand-blue uppercase tracking-widest truncate block">
                  Sob Consulta
                </span>
              )}
            </div>
          </div>
          
          <div className="relative group/cartwrap flex items-center justify-center">
            <div className="absolute bottom-[calc(100%+8px)] right-0 opacity-0 group-hover/cartwrap:opacity-100 translate-y-2 group-hover/cartwrap:translate-y-0 transition-all duration-300 bg-gray-900 text-white text-[10px] whitespace-nowrap px-2.5 py-1.5 rounded-lg font-medium pointer-events-none shadow-xl flex items-center z-50 before:content-[''] before:absolute before:bottom-[-4px] before:right-4 before:border-x-[4px] before:border-x-transparent before:border-t-[4px] before:border-t-gray-900">
              Adicionar ao carrinho
            </div>
            <button
              onClick={(e) => {
                const productToAdd = product.colors && product.colors.length > 0 
                  ? { ...product, color: product.colors[activeColorIdx].name, image: currentImage, price: displayPrice, originalPrice: displayOriginalPrice }
                  : product;
                handleAddToCart(productToAdd, e);
              }}
              className="group/cartbtn shrink-0 w-11 h-11 md:w-12 md:h-12 bg-brand-blue text-white rounded-full flex justify-center items-center hover:bg-brand-blue-hover transition-all duration-500 shadow-[0_4px_14px_rgba(19,60,109,0.22)] hover:shadow-[0_8px_24px_rgba(13,40,74,0.35)] hover:-translate-y-1 relative overflow-hidden isolate cursor-pointer"
              aria-label="Adicionar ao Carrinho"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/0 via-white/30 to-brand-blue/0 -translate-x-[200%] group-hover/cartbtn:translate-x-[200%] transition-transform duration-1000 ease-in-out z-0"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 group-hover/cartbtn:opacity-100 transition-opacity duration-500 z-0"></div>
              <Plus className="w-[20px] h-[20px] md:w-6 md:h-6 relative z-10 group-hover/cartbtn:scale-110 group-hover/cartbtn:rotate-90 transition-all duration-500" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
