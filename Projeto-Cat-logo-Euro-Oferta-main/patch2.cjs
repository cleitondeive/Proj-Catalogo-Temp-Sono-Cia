const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /POLTRONA DESIGN/g,
  'ILUMINAÇÃO'
);
code = code.replace(
  /Ver Detalhes/g,
  'Luminária Exclusiva'
);
code = code.replace(
  /R\$ 2\.800,00/g,
  'R$ 850,00'
);
code = code.replace(
  /name: "Luminária de Teto Luxo",[\s\n]*price: "2\.800,00",[\s\n]*originalPrice: "3\.500,00",[\s\n]*image: "https:\/\/images\.unsplash\.com\/photo-1598300042247-d088f8ab3a91\?auto=format&fit=crop&w=600&q=80",[\s\n]*tag: "Novidade",/g,
  `name: "Luminária de Teto Luxo",
                    price: "850,00",
                    originalPrice: "1.100,00",
                    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",`
);

fs.writeFileSync('src/App.tsx', code);
