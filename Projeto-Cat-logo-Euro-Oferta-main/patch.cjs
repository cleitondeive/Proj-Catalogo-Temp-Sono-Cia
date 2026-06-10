const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacements = [
  {
    find: `                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 text-[#1C202F] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white">
                   <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/hotspot:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </div>`,
    replaceTooltips: [
      `onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Sofá 3 Lugares Linho",
                      price: "3.100,00",
                      originalPrice: "3.900,00",
                      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
                      tag: "Destaque",
                    });
                  }}`,
      `onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Mesa de Centro Orgânica",
                      price: "1.250,00",
                      originalPrice: "1.600,00",
                      image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=600&q=80",
                    });
                  }}`,
      `onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Cama Estofada Premium",
                      price: "4.200,00",
                      originalPrice: "4.900,00",
                      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
                      tag: "Oferta Especial",
                    });
                  }}`,
      `onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct({
                      name: "Luminária de Chão Minimalista",
                      price: "850,00",
                      originalPrice: "1.100,00",
                      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                    });
                  }}`
    ]
  }
];

let currentIndex = 0;
code = code.replace(
  /                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white\/95 text-\[#1C202F\] flex items-center justify-center shadow-\[0_4px_12px_rgba\(0,0,0,0.15\)\] transition-transform duration-300 group-hover\/hotspot:scale-110 cursor-pointer relative z-10 pointer-events-auto border border-white">/g,
  (match) => {
    let toRet = match;
    if (currentIndex < 4) {
      toRet = match.replace('">', `" ${replacements[0].replaceTooltips[currentIndex]}>`);
    }
    currentIndex++;
    return toRet;
  }
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched correctly!');
