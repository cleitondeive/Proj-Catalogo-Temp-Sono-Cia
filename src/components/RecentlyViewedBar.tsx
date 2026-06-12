import React, { useState } from 'react';
import { 
  Clock, 
  Trash2, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ShoppingCart, 
  Eye, 
  MessageCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface RecentlyViewedBarProps {
  products: Product[];
  recentIds: string[];
  onClear: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
}

export default function RecentlyViewedBar({
  products = [],
  recentIds = [],
  onClear,
  onQuickView,
  onAddToCart
}: RecentlyViewedBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Match IDs with actual active products
  const recentProducts = recentIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p && p.status === 'active')
    .slice(0, 5); // display up to 5 items

  if (recentProducts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 md:px-8 pointer-events-none">
      <div className="max-w-[1240px] mx-auto flex justify-end">
        
        <div className="w-full sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-md border border-gray-150 rounded-[20px] shadow-2xl pointer-events-auto overflow-hidden transition-all duration-300">
          
          {/* Bar Header Trigger */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2.5 bg-gray-50/95 border-b border-gray-150 flex items-center justify-between cursor-pointer hover:bg-gray-100/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-black text-[12.5px] text-[#0F172A] tracking-tight">Vistos Recentemente</span>
              <span className="text-[10px] bg-brand-blue text-white px-1.5 py-0.5 rounded-full font-bold">
                {recentProducts.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="text-gray-400 hover:text-gray-600">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 ml-1 animate-bounce" />}
              </div>
            </div>
          </div>

          {/* Expanded Carousel of Recents */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden bg-white"
              >
                <div className="p-3.5 space-y-3">
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                    {recentProducts.map(prod => {
                      const discount = prod.originalPrice && prod.price && prod.originalPrice !== prod.price
                        ? Math.round((1 - parseFloat(prod.price.replace(/[^\d]/g, '')) / parseFloat(prod.originalPrice.replace(/[^\d]/g, ''))) * 100)
                        : 0;

                      return (
                        <div 
                          key={prod.id}
                          className="w-[125px] flex-shrink-0 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-brand-blue/30 rounded-xl p-2 transition-all flex flex-col justify-between group"
                        >
                          <div className="w-full h-18 rounded-lg overflow-hidden relative border border-gray-100 bg-white shrink-0">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              referrerPolicy="no-referrer"
                            />
                            {discount > 0 && (
                              <span className="absolute bottom-1 left-1 bg-red-500 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded leading-none">
                                -{discount}%
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-left flex-1 flex flex-col justify-between">
                            <div className="min-w-0">
                              <p className="text-[8.5px] text-gray-400 font-extrabold uppercase truncate leading-none">{prod.category}</p>
                              <p className="text-[10.5px] font-bold text-[#0F172A] line-clamp-1 mt-0.5 leading-tight">{prod.name}</p>
                            </div>

                            <div className="mt-1.5 flex items-baseline justify-between gap-1 overflow-hidden">
                              <span className="text-[11px] font-extrabold text-brand-blue truncate">
                                {prod.showPrice !== false ? `R$ ${prod.price}` : 'Consulta'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1 mt-2 pt-1 border-t border-gray-100">
                              <button
                                onClick={() => onQuickView(prod)}
                                className="p-1 bg-white hover:bg-gray-100 text-gray-500 rounded-lg text-[8.5px] font-bold flex items-center justify-center cursor-pointer border border-gray-150"
                                title="Visualizar Detalhes"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              
                              <button
                                onClick={(e) => onAddToCart(prod, e)}
                                className="p-1 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-[8.5px] font-bold flex items-center justify-center cursor-pointer"
                                title="Adicionar ao carrinho"
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
