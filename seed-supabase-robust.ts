import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfonwqmpatubcnpuxcyr.supabase.co';
const supabaseKey = 'sb_publishable_GidJwMFuH6e0-McO4fKBOA_zkmGd5S0';

const supabase = createClient(supabaseUrl, supabaseKey);

const today = new Date();
const formatIso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(today.getDate() + offsetDays);
  return d.toISOString();
};

const dateStr = (offsetDays: number) => {
  const d = new Date();
  d.setDate(today.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const seededProducts = [
  // === CATEGORY: COLCHÕES ===
  {
    id: "prod-colchao-1",
    name: "Colchão Gel-Tech Termorregulador Sensation",
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1200",
    originalPrice: "7.400,00",
    price: "5.890,00",
    tag: "Tecnologia do Sono",
    tagColor: "bg-blue-600 text-white",
    category: "Colchões",
    description: "Colchão premium com infusão de microcélulas de gel ativo termorregulador. Oferece dissipação térmica constante de calor corpóreo para um sono fresco, anatômico e reparador perfeito.",
    length: "1.98",
    width: "1.58",
    height: "0.32",
    weight: "35",
    stock: 12,
    sku: "COL-GEL-01",
    sizes: ["Casal (1.38m)", "Queen (1.58m)", "King (1.93m)"],
    colors: [{name: "Gel Soft", hex: "#E0F2FE"}],
    status: "active",
    isPromoted: true,
    showPrice: true,
    showStock: true,
    createdAt: formatIso(-5)
  },
  {
    id: "prod-colchao-2",
    name: "Colchão Látex Imperial Organic Hipoalergênico",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200",
    originalPrice: "8.900,00",
    price: "7.200,00",
    tag: "100% Orgânico",
    tagColor: "bg-green-600 text-white",
    category: "Colchões",
    description: "Estrutura premium em látex 100% natural, extraído de seringueiras sustentáveis. Antialérgico, anti-ácaro e com zonas de conforto progressivo que contornam perfeitamente a sua postura.",
    length: "1.98",
    width: "1.58",
    height: "0.28",
    weight: "42",
    stock: 8,
    sku: "COL-LAT-02",
    sizes: ["Queen (1.58m)", "King (1.93m)"],
    colors: [{name: "Algodão Cru", hex: "#FCFAF2"}],
    status: "active",
    isPromoted: true,
    showPrice: true,
    showStock: true,
    createdAt: formatIso(-4)
  },
  {
    id: "prod-colchao-3",
    name: "Colchão Ortopédico Titanium Max Spine Care",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200",
    originalPrice: "6.200,00",
    price: "4.980,00",
    tag: "Recomendado Orto",
    tagColor: "bg-teal-600 text-white",
    category: "Colchões",
    description: "Desenvolvido em parceria com especialistas da saúde da coluna. Molas ensacadas de fio de titânio de alta resistência oferecem sustentação ortopédica progressiva ideal para o corpo.",
    length: "1.98",
    width: "1.58",
    height: "0.34",
    weight: "38",
    stock: 15,
    sku: "COL-TIT-03",
    sizes: ["Casal (1.38m)", "Queen (1.58m)", "King (1.93m)"],
    status: "active",
    showPrice: true,
    createdAt: formatIso(-3)
  },
  {
    id: "prod-colchao-4",
    name: "Colchão Memory Foam Nuvem Celestial Lux",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200",
    originalPrice: "7.990,00",
    price: "6.100,00",
    tag: "Gravidade Zero",
    tagColor: "bg-indigo-600 text-white",
    category: "Colchões",
    description: "Desfrute de uma fantástica e revigorante sensação de gravidade zero. Espuma viscoelástica de memória celular de alta densidade desenvolvida para moldar-se sem deformar com o uso.",
    length: "2.03",
    width: "1.93",
    height: "0.36",
    weight: "48",
    stock: 5,
    sku: "COL-NUV-04",
    sizes: ["Queen (1.58m)", "King (1.93m)"],
    status: "active",
    showPrice: true,
    createdAt: formatIso(-2)
  },
  {
    id: "prod-colchao-5",
    name: "Travesseiro Anatômico Duplo Látex Soft",
    image: "https://images.unsplash.com/photo-1588046138717-d9eb1a34675b?auto=format&fit=crop&w=1200",
    originalPrice: "480,00",
    price: "380,00",
    tag: "Bambu Premium",
    category: "Colchões",
    description: "Núcleos duplos de puro látex higienizável e ultra-elástico. Revestido com nobre capa em tecido ecológico com fibra natural de bambu, promovendo toque sedoso e frescor incomparável.",
    length: "0.70",
    width: "0.50",
    height: "0.14",
    weight: "1.8",
    stock: 45,
    sku: "TRA-BAM-05",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-1)
  },
  {
    id: "prod-colchao-6",
    name: "Travesseiro Ergonômico Cervical Memory Gel",
    image: "https://images.unsplash.com/photo-1629806660144-84d94d3ec176?auto=format&fit=crop&w=1200",
    originalPrice: "390,00",
    price: "290,00",
    tag: "Alívio de Dores",
    category: "Colchões",
    description: "Contorno ergonômico anatômico que acomoda perfeitamente a nuca e a coluna cervical. Contém placa superior em gel de contato frio para evitar a transpiração e tensões musculares.",
    length: "0.60",
    width: "0.40",
    height: "0.12",
    weight: "1.5",
    stock: 30,
    sku: "TRA-CER-06",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },
  {
    id: "prod-colchao-7",
    name: "Pillow Top Pluma de Ganso Touch 400 Fios",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200",
    originalPrice: "1.800,00",
    price: "1.250,00",
    tag: "Conforto Hotel 5 Estrelas",
    category: "Colchões",
    description: "Camada matelassada espessa de 7cm preenchida com plumas ultraleves. Proporciona o abraço acolhedor dos leitos das suítes presidenciais na atual estrutura de sua cama de descanso.",
    length: "1.98",
    width: "1.58",
    height: "0.07",
    weight: "6.5",
    stock: 14,
    sku: "PILLOW-PLU-07",
    sizes: ["Casal (1.38m)", "Queen (1.58m)", "King (1.93m)"],
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },
  {
    id: "prod-colchao-8",
    name: "Protetor Impermeável Luxo Toque de Algodão Egípcio",
    image: "https://images.unsplash.com/photo-1605658607153-f77e23114f09?auto=format&fit=crop&w=1200",
    originalPrice: "450,00",
    price: "320,00",
    tag: "Protetor Noiseless",
    category: "Colchões",
    description: "Proteção à prova de líquidos totalmente silently-action (sem fazer ruídos plásticos). Feito com fios entrelaçados de algodão egípcio de alto requinte para respirar e proteger.",
    length: "1.98",
    width: "1.58",
    height: "0.40",
    weight: "1.2",
    stock: 25,
    sku: "PROT-IMP-08",
    sizes: ["Casal (1.38m)", "Queen (1.58m)", "King (1.93m)"],
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },

  // === CATEGORY: CAMAS ===
  {
    id: "prod-cama-1",
    name: "Cama Box Siena Baú Couro Floater",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200",
    originalPrice: "5.700,00",
    price: "4.290,00",
    tag: "Destaque da Coleção",
    tagColor: "bg-purple-600 text-white",
    category: "Camas",
    description: "Cama box com baú estruturada em madeira tratada de reflorestamento com pistões hidráulicos italianos silenciosos. Forrada em couro floater genuíno de altíssima durabilidade e luxo.",
    length: "1.98",
    width: "1.58",
    height: "0.42",
    weight: "75",
    stock: 7,
    sku: "CAM-BAU-01",
    sizes: ["Queen (1.58m)", "King (1.93m)"],
    colors: [{name: "Marrom Conhaque", hex: "#78350F"}, {name: "Preto Nero", hex: "#000000"}],
    status: "active",
    isPromoted: true,
    showPrice: true,
    createdAt: formatIso(-6)
  },
  {
    id: "prod-cama-2",
    name: "Cama King Size Imperatriz Capitonê Veludo",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200",
    originalPrice: "8.500,00",
    price: "6.800,00",
    tag: "Design Exclusivo",
    tagColor: "bg-yellow-600 text-white",
    category: "Camas",
    description: "Com uma cabeceira robusta de 1,45m de altura e meticulosamente acabada em autêntico capitonê feito à mão, esta cama redefine o glamour e o requinte clássico em seu quarto.",
    length: "2.03",
    width: "1.93",
    height: "1.45",
    weight: "90",
    stock: 4,
    sku: "CAM-IMP-02",
    sizes: ["Queen (1.58m)", "King (1.93m)"],
    colors: [{name: "Veludo Gelo", hex: "#F3F4F6"}, {name: "Cinza Imperial", hex: "#6B7280"}],
    status: "active",
    showPrice: true,
    createdAt: formatIso(-5)
  },
  {
    id: "prod-cama-3",
    name: "Cama Queen Florença Madeira Nobre Maciça",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200",
    originalPrice: "6.900,00",
    price: "5.400,00",
    tag: "Ecodesign",
    category: "Camas",
    description: "Estrutura imponente moldada inteiramente em madeira maciça de lei tratada. Oferece visual orgânico escandinavo sofisticado com detalhes de fixações invisíveis.",
    length: "1.98",
    width: "1.58",
    height: "1.10",
    weight: "85",
    stock: 5,
    sku: "CAM-FLO-03",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-4)
  },
  {
    id: "prod-cama-4",
    name: "Cabeceira Painel Paris Slim Linho Fino",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b355040?auto=format&fit=crop&w=1200",
    originalPrice: "2.400,00",
    price: "1.890,00",
    tag: "Pronto Envio",
    category: "Camas",
    description: "Placas modulares estofadas em linho cru que se unem na parede por sistema inteligente de encaixe ajustável. Deixa o quarto refinado e aconchegante de maneira limpa.",
    length: "1.60",
    width: "0.08",
    height: "0.90",
    weight: "18",
    stock: 12,
    sku: "CAB-PAR-04",
    colors: [{name: "Linho Cru", hex: "#EAE6DF"}, {name: "Fendi Escuro", hex: "#7E7C77"}],
    status: "active",
    showPrice: true,
    createdAt: formatIso(-3)
  },
  {
    id: "prod-cama-5",
    name: "Mesa de Cabeceira Ônix Lacada Preto Dourado",
    image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200",
    originalPrice: "1.200,00",
    price: "890,00",
    tag: "Estilo Contemporâneo",
    category: "Camas",
    description: "Estrutura moderna laqueada com multicamadas em alto brilho Nero Black. Possui pés finos em liga de zinco banhados a ouro 18K escovado e gavetas com trilhos telescópicos.",
    length: "0.50",
    width: "0.40",
    height: "0.60",
    weight: "12",
    stock: 20,
    sku: "MES-ONX-05",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-2)
  },
  {
    id: "prod-cama-6",
    name: "Cama de Solteiro Provence Entalhada à Mão",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200",
    originalPrice: "4.200,00",
    price: "3.100,00",
    tag: "Peça de Arte",
    category: "Camas",
    description: "Inspirada nos ricos casarões coloniais da Provença francesa. Detalhes minuciosos em molduras torneadas e acabamento de pátina branca desgastada clássica.",
    length: "1.88",
    width: "0.88",
    height: "1.05",
    weight: "50",
    stock: 3,
    sku: "CAM-PRO-06",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-1)
  },
  {
    id: "prod-cama-7",
    name: "Mesa de Cabeceira Ninho Ripado Freijó",
    image: "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=1200",
    originalPrice: "1.100,00",
    price: "790,00",
    tag: "Campanha Noites Lindas",
    category: "Camas",
    description: "Minimalismo quente brasileiro. Feito com lâminas de madeira freijó natural e nicho aberto de fácil acesso para armazenar seus livros preferidos ao lado de sua cama.",
    length: "0.45",
    width: "0.38",
    height: "0.55",
    weight: "10",
    stock: 18,
    sku: "MES-NIN-07",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },
  {
    id: "prod-cama-8",
    name: "Criado-Mudo Suspenso Loft Industrial Metal Wood",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200",
    originalPrice: "850,00",
    price: "650,00",
    tag: "Design Loft",
    category: "Camas",
    description: "Design compacto com fixação invisível na parede, unindo prancha maciça em cumaru com molduras soldadas à mão em ferro com tintura automotiva preto fosco.",
    length: "0.40",
    width: "0.32",
    height: "0.20",
    weight: "6",
    stock: 14,
    sku: "CRI-LOF-08",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },

  // === CATEGORY: ESTOFADOS ===
  {
    id: "prod-estofado-1",
    name: "Sofá Retrátil Istambul 2.50m Veludo Premium",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200",
    originalPrice: "4.990,00",
    price: "3.490,00",
    tag: "30% OFF",
    tagColor: "bg-red-600 text-white",
    category: "Estofados",
    description: "Sofá retrátil e reclinável revestido em veludo de alto padrão. Encosto com enchimento de silicone e molas ensacadas independentes no assento, garantindo a maciez e relaxamento máximo.",
    length: "2.50",
    width: "1.10",
    height: "1.02",
    weight: "65",
    stock: 6,
    sku: "SOF-IST-01",
    sizes: ["2.20m", "2.50m", "2.80m"],
    colors: [{name: "Cinza Premium", hex: "#9CA3AF"}, {name: "Bege Canela", hex: "#D1FAE5"}],
    status: "active",
    isPromoted: true,
    showPrice: true,
    createdAt: formatIso(-7)
  },
  {
    id: "prod-estofado-2",
    name: "Poltrona Costela Design Assinado Couro Legítimo",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200",
    originalPrice: "2.590,00",
    price: "1.890,00",
    tag: "Clássico Assinado",
    tagColor: "bg-[#0F172A] text-white",
    category: "Estofados",
    description: "Mítica poltrona costela com puff de apoio inclusos. Base em aço carbono e estrutura de ripas multilaminadas de tauari com almofadas gordas preenchidas com flocos de latex e couro legítimo.",
    length: "0.95",
    width: "0.90",
    height: "0.90",
    weight: "32",
    stock: 4,
    sku: "POL-COS-02",
    colors: [{name: "Caramelo Classic", hex: "#B45309"}, {name: "Preto Nero", hex: "#111827"}],
    status: "active",
    isPromoted: true,
    showPrice: true,
    createdAt: formatIso(-6)
  },
  {
    id: "prod-estofado-3",
    name: "Sofá Minimalista Oslo Linho de Alta Gramatura",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200",
    originalPrice: "5.800,00",
    price: "4.100,00",
    tag: "Alma Escandinava",
    category: "Estofados",
    description: "Design nórdico autêntico. Linhas retas e sofisticadas elevadas por finos pés em ligas metálicas ocultas e revestimento em linho belga encorpado para um ambiente contemporâneo incomparável.",
    length: "2.20",
    width: "0.90",
    height: "0.85",
    weight: "55",
    stock: 5,
    sku: "SOF-OSL-03",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-5)
  },
  {
    id: "prod-estofado-4",
    name: "Poltrona Giratória Shell Tecido Bouclé",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200",
    originalPrice: "2.300,00",
    price: "1.620,00",
    tag: "Tendência do Ano",
    category: "Estofados",
    description: "Um abraço tátil esculpido em formas orgânicas. Revestida em bouclé de toque ultra fofo, ideal para aconchego em cantos de leitura e suítes master.",
    length: "0.80",
    width: "0.80",
    height: "0.80",
    weight: "22",
    stock: 8,
    sku: "POL-SHE-04",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-4)
  },
  {
    id: "prod-estofado-5",
    name: "Sofá Chesterfield Vintage Couro Legítimo Aniline",
    image: "https://images.unsplash.com/photo-1605658607153-f77e23114f09?auto=format&fit=crop&w=1200",
    originalPrice: "12.000,00",
    price: "8.900,00",
    tag: "Alto Luxo Real",
    category: "Estofados",
    description: "Design clássico vitoriano britânico inglês de 1920. Estrutura de madeira entalhada maciça com aplicação artesanal de capitonê e tachas de bronze pontilhadas à mão.",
    length: "2.40",
    width: "0.95",
    height: "0.78",
    weight: "85",
    stock: 2,
    sku: "SOF-CHE-05",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-3)
  },
  {
    id: "prod-estofado-6",
    name: "Chaise Lounge Ergonômica Zen Velveteen",
    image: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&w=1200",
    originalPrice: "3.200,00",
    price: "2.450,00",
    tag: "Relaxamento Espacial",
    category: "Estofados",
    description: "Anatomia estudada para promover descompressão lombar imediata. Tapeçada em tecido aveludado de altíssima maciez e estrutura em curvas perfeitamente balanceadas.",
    length: "1.70",
    width: "0.75",
    height: "0.85",
    weight: "28",
    stock: 6,
    sku: "CHA-ZEN-06",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-2)
  },
  {
    id: "prod-estofado-7",
    name: "Puff Quadrado Decorativo Matelassê Couro",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200",
    originalPrice: "850,00",
    price: "590,00",
    tag: "Estilo",
    category: "Estofados",
    description: "Assento adicional multifuncional compacto e robusto. Costuras matelassadas em couro natural caramelo para servir de mesa de apoio ou banqueta de centro.",
    length: "0.55",
    width: "0.55",
    height: "0.42",
    weight: "8",
    stock: 15,
    sku: "PUF-MAT-07",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-1)
  },
  {
    id: "prod-estofado-8",
    name: "Banquete Recamier Barcelona Steel Couro",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200",
    originalPrice: "3.800,00",
    price: "2.800,00",
    tag: "Ícone Modernista",
    category: "Estofados",
    description: "Em homenagem à arquitetura de Mies van der Rohe. Prancha estofada com botões tensionados suspensa em pernas esculpidas curvas de aço inoxidável polido espelhado.",
    length: "1.50",
    width: "0.55",
    height: "0.45",
    weight: "24",
    stock: 3,
    sku: "REC-BAR-08",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },

  // === CATEGORY: MÓVEIS DE MADEIRA ===
  {
    id: "prod-madeira-1",
    name: "Mesa de Jantar Átrio Carvalho Maciço",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200",
    originalPrice: "6.200,00",
    price: "4.500,00",
    tag: "Tampo Chanfrado",
    tagColor: "bg-amber-700 text-white",
    category: "Móveis de Madeira",
    description: "Mesa suntuosa com tampo robusto oval chanfrado 40mm folheado em jacarandá ou carvalho natural. Pés esculpidos em pedestal escultórico que abriga perfeitamente as cadeiras ao redor.",
    length: "2.10",
    width: "1.00",
    height: "0.76",
    weight: "80",
    stock: 3,
    sku: "MES-ATR-01",
    sizes: ["1.80m", "2.20m", "2.40m"],
    status: "active",
    isPromoted: true,
    showPrice: true,
    createdAt: formatIso(-5)
  },
  {
    id: "prod-madeira-2",
    name: "Buffet Aparador Milão Carvalho Ripado Touch",
    image: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=1200",
    originalPrice: "3.900,00",
    price: "2.900,00",
    tag: "Lançamento Exclusivo",
    tagColor: "bg-teal-700 text-white",
    category: "Móveis de Madeira",
    description: "Amplo armário e organizador de talheres e louças finas. Possui quatro portas cobertas por ripas elegantes de freijó maciço, divisórias de vidro nobre e dobradiças anti-impacto amortecedoras.",
    length: "1.80",
    width: "0.45",
    height: "0.78",
    weight: "58",
    stock: 4,
    sku: "BUF-MIL-02",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-4)
  },
  {
    id: "prod-madeira-3",
    name: "Estante Modular Nápoles Freijó Bronze",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200",
    originalPrice: "4.500,00",
    price: "3.200,00",
    tag: "Arquitetura Própria",
    category: "Móveis de Madeira",
    description: "Estante ripada com prateleiras longas flutuantes em carvalho premium conectadas por delicadas e sólidas torres verticais anodizadas em bronze metalizado.",
    length: "1.60",
    width: "0.35",
    height: "2.10",
    weight: "62",
    stock: 6,
    sku: "EST-NAP-03",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-3)
  },
  {
    id: "prod-madeira-4",
    name: "Escrivaninha Oficina Oxford com Calhas Ocultas",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200",
    originalPrice: "2.800,00",
    price: "1.950,00",
    tag: "Home Office Luxo",
    category: "Móveis de Madeira",
    description: "Conectividade e ergonomia com sofisticação estética. Tampo revestido em couro e calha traseira pivotante em madeira para ocultar inteiramente fontes e cabos desorganizados.",
    length: "1.30",
    width: "0.65",
    height: "0.75",
    weight: "34",
    stock: 7,
    sku: "ESC-OXF-04",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-2)
  },
  {
    id: "prod-madeira-5",
    name: "Cadeira de Balanço Artesanal Nômade",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200",
    originalPrice: "1.400,00",
    price: "990,00",
    tag: "Trabalho Manual",
    category: "Móveis de Madeira",
    description: "Artesanato nacional autêntico. Balanço suave proporcionado por base com curvatura calculada matematicamente para o centro de gravidade perfeito e palha de vime natural trançada.",
    length: "0.90",
    width: "0.70",
    height: "1.00",
    weight: "16",
    stock: 4,
    sku: "CAD-NOM-05",
    status: "active",
    showPrice: true,
    createdAt: formatIso(-1)
  },
  {
    id: "prod-madeira-6",
    name: "Painel de TV Ripa Freijó com Rack Integrado",
    image: "https://images.unsplash.com/photo-1499933374294-4584d31ac0f5?auto=format&fit=crop&w=1200",
    originalPrice: "3.900,00",
    price: "2.600,00",
    tag: "Sob Encomenda",
    category: "Móveis de Madeira",
    description: "Painel ripado vertical inteiramente fatiado em madeira compensada mutiplanar ultra resistente de Freijó. Acompanha rack flutuante inferior com portas basculantes soft-close.",
    length: "2.20",
    width: "0.40",
    height: "1.80",
    weight: "70",
    stock: 5,
    sku: "PAI-TVF-06",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },
  {
    id: "prod-madeira-7",
    name: "Cristaleira de Vidro Clássica Ipê Amarelo",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200",
    originalPrice: "5.400,00",
    price: "4.190,00",
    tag: "Coleção Catedral",
    category: "Móveis de Madeira",
    description: "Uma jóia para colecionar suas memórias cristalizadas. Estrutura rígida de ipê nobre escuro com iluminação interna microLED quente embutida automatizada por sensor de presença.",
    length: "0.90",
    width: "0.42",
    height: "1.85",
    weight: "65",
    stock: 2,
    sku: "CRI-IPE-07",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  },
  {
    id: "prod-madeira-8",
    name: "Mesa de Centro Orgânica Seixo (Par Integrado)",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200",
    originalPrice: "2.100,00",
    price: "1.350,00",
    tag: "Formas Livres",
    category: "Móveis de Madeira",
    description: "Duas peças escultóricas com contornos inspirados nas pedras polidas por cachoeiras. Tampos maciços folheados de freijó e pés cônicos pretos de pátina carbonizada.",
    length: "1.10",
    width: "0.80",
    height: "0.35",
    weight: "18",
    stock: 10,
    sku: "MES-SEI-08",
    status: "active",
    showPrice: true,
    createdAt: formatIso(0)
  }
];

const seededLeads = [
  {
    id: "lead-m-1",
    name: "Mariana Souza Penha",
    phone: "(11) 98118-3473",
    email: "mariana.penha@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    status: "Novo Lead",
    source: "Instagram Oficial",
    createdAt: formatIso(-4),
    updatedAt: formatIso(-4),
    nextFollowUp: formatIso(1),
    totalSpent: 0,
    orders: [],
    vipLevel: "Cliente Potencial",
    tags: [
      { text: "Interesse Colchões", bg: "bg-blue-100", textCol: "text-blue-800" },
      { text: "Lead Quente", bg: "bg-red-100", textCol: "text-red-800" }
    ],
    notes: [
      { id: "n1", content: "Entrou em contato solicitando mais detalhes sobre a tecnologia do colchão Gel-Tech. Gostaria de saber sobre prazo de entrega em SP Capital.", date: formatIso(-4) }
    ],
    schedules: [
      { id: "s1", type: "whatsapp" as const, date: formatIso(1), title: "Enviar catálogo de preços atualizados sobre Gel-Tech", completed: false }
    ],
    favoriteProducts: ["prod-colchao-1"],
    assignee: "Consultora Sofia"
  },
  {
    id: "lead-m-2",
    name: "Dr. Roberto de Oliveira",
    phone: "(21) 99342-1243",
    email: "roberto.oli@uol.com.br",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    status: "Em Negociação",
    source: "Indicação Direta",
    createdAt: formatIso(-8),
    updatedAt: formatIso(-2),
    nextFollowUp: formatIso(0),
    totalSpent: 0,
    orders: [],
    vipLevel: "VIP Premium",
    tags: [
      { text: "Orçamento Grande", bg: "bg-purple-100", textCol: "text-purple-800" },
      { text: "Médico de Coluna", bg: "bg-teal-100", textCol: "text-teal-800" }
    ],
    notes: [
      { id: "n2-1", content: "Solicitou cotação para 3 colchões Látex Imperial Organic sob medida para casa de campo da família.", date: formatIso(-8) },
      { id: "n2-2", content: "Enviado orçamento total de R$ 21.600,00 com 10% de desconto por pix comercial.", date: formatIso(-3) }
    ],
    schedules: [
      { id: "s2", type: "call" as const, date: formatIso(0), title: "Ligar para confirmar aprovação de faturamento Pix", completed: false }
    ],
    favoriteProducts: ["prod-colchao-2"],
    estimatedValue: 21600,
    assignee: "Consultora Marina"
  },
  {
    id: "lead-m-3",
    name: "Ana Carolina Brandão",
    phone: "(31) 98877-6655",
    email: "ana.brandao@outlook.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    status: "Pedido Enviado",
    source: "Tráfego Google",
    createdAt: formatIso(-12),
    updatedAt: formatIso(-1),
    totalSpent: 5488,
    orders: [
      {
        id: "ord-101",
        orderNumber: "#PED-1001",
        leadId: "lead-m-3",
        items: [
          { productId: "prod-colchao-3", name: "Colchão Ortopédico Titanium Max", price: "4.980,00", qty: 1, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=120" },
          { productId: "prod-colchao-5", name: "Travesseiro Anatômico Duplo Látex Soft", price: "380,00", qty: 2, image: "https://images.unsplash.com/photo-1588046138717-d9eb1a34675b?auto=format&fit=crop&w=120" }
        ],
        total: 5488,
        status: "Finalizado",
        createdAt: formatIso(-12)
      }
    ],
    vipLevel: "Cliente Frequente",
    tags: [
      { text: "Comprador Ativo", bg: "bg-emerald-100", textCol: "text-emerald-800" }
    ],
    notes: [
      { id: "n3", content: "Pedido concluído pelo e-commerce. Solicitou entrega expressa devido à mudança agendada.", date: formatIso(-1) }
    ],
    schedules: [
      { id: "s3", type: "email" as const, date: formatIso(4), title: "Disparar pesquisa de satisfação NPS após entrega", completed: false }
    ],
    assignee: "Consultor Gabriel"
  },
  {
    id: "lead-m-4",
    name: "Carlos Eduardo Malta",
    phone: "(11) 99123-4567",
    email: "carlos.malta@hospital.com",
    status: "Pagamento Pendente",
    source: "Website Direto",
    createdAt: formatIso(-2),
    updatedAt: formatIso(-1),
    totalSpent: 12100,
    orders: [
      {
        id: "ord-102",
        orderNumber: "#PED-1002",
        leadId: "lead-m-4",
        items: [
          { productId: "prod-colchao-4", name: "Colchão Memory Foam Nuvem Celestial Lux", price: "6.100,00", qty: 1, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=120" },
          { productId: "prod-cama-2", name: "Cama King Size Imperatriz Capitonê Veludo", price: "6.800,00", qty: 1, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=120" }
        ],
        total: 12100,
        status: "pending",
        createdAt: formatIso(-2)
      }
    ],
    vipLevel: "VIP Premium",
    tags: [
      { text: "Aguardando Boleto", bg: "bg-amber-100", textCol: "text-amber-800" }
    ],
    notes: [
      { id: "n4", content: "Boleto bancário emitido. O cliente informou que o departamento financeiro efetuará a liquidação amanhã de manhã.", date: formatIso(-1) }
    ],
    schedules: [
      { id: "s4", type: "whatsapp" as const, date: formatIso(1), title: "Checar comprovante da compensação do boleto bancário", completed: false }
    ],
    assignee: "Consultor Lucas"
  },
  {
    id: "lead-m-5",
    name: "Fernanda Vasconcellos Silva",
    phone: "(11) 97412-3698",
    email: "fernanda.vas@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    status: "Venda Ganha",
    source: "Arquiteto Parceiro",
    createdAt: formatIso(-30),
    updatedAt: formatIso(-15),
    totalSpent: 18900,
    orders: [
      {
        id: "ord-103",
        orderNumber: "#PED-1003",
        leadId: "lead-m-5",
        items: [
          { productId: "prod-estofado-5", name: "Sofá Chesterfield Vintage Couro Legítimo", price: "8.900,00", qty: 1, image: "https://images.unsplash.com/photo-1605658607153-f77e23114f09?auto=format&fit=crop&w=120" },
          { productId: "prod-madeira-1", name: "Mesa de Jantar Átrio Carvalho Maciço", price: "4.500,00", qty: 1, image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=120" },
          { productId: "prod-cama-1", name: "Cama Box Siena Baú Couro Floater", price: "4.290,00", qty: 1, image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=120" },
          { productId: "prod-cama-5", name: "Mesa de Cabeceira Ônix Lacada Preto Dourado", price: "890,00", qty: 1, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=120" }
        ],
        total: 18900,
        status: "completed",
        createdAt: formatIso(-30)
      }
    ],
    vipLevel: "VIP Gold",
    tags: [
      { text: "Venda Recorde", bg: "bg-green-100", textCol: "text-green-800" },
      { text: "Comissão Concedida", bg: "bg-gray-100", textCol: "text-gray-800" }
    ],
    notes: [
      { id: "n5-1", content: "Parceria fechada com escritório de arquitetura de luxo. Entrega feita no endereço com fotógrafo de interiores profissional presente.", date: formatIso(-15) }
    ],
    schedules: [
      { id: "s5", type: "meeting" as const, date: formatIso(10), title: "Visita pós-obra para novos móveis complementares", completed: false }
    ],
    assignee: "Consultora Sofia"
  },
  {
    id: "lead-m-6",
    name: "Almirante Bruno Senna",
    phone: "(19) 98234-5678",
    email: "brunos@terra.com.br",
    status: "Pós-venda",
    source: "Recomendação Premium",
    createdAt: formatIso(-18),
    updatedAt: formatIso(-2),
    totalSpent: 4500,
    orders: [
      {
        id: "ord-104",
        orderNumber: "#PED-1004",
        leadId: "lead-m-6",
        items: [
          { productId: "prod-madeira-1", name: "Mesa de Jantar Átrio Carvalho Maciço", price: "4.500,00", qty: 1, image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=120" }
        ],
        total: 4500,
        status: "completed",
        createdAt: formatIso(-18)
      }
    ],
    vipLevel: "Cliente Frequente",
    tags: [
      { text: "Cliente Exigente", bg: "bg-amber-100", textCol: "text-amber-800" }
    ],
    notes: [
      { id: "n6", content: "Mesa entregue perfeitamente. Solicitou lustrador adicional local para reforço extra de impermeabilizante na madeira.", date: formatIso(-2) }
    ],
    schedules: [
      { id: "s6", type: "call" as const, date: formatIso(3), title: "Ligar para verificar se o lustrador cumpriu todo o cronograma técnico", completed: false }
    ],
    assignee: "Consultora Ana"
  },
  {
    id: "lead-m-7",
    name: "Luciana Guimarães Pompéia",
    phone: "(11) 99555-1212",
    email: "luciana.gui@me.com",
    status: "Venda Perdida",
    source: "WhatsApp Direct",
    createdAt: formatIso(-45),
    updatedAt: formatIso(-30),
    totalSpent: 0,
    orders: [],
    vipLevel: "Nenhum",
    tags: [
      { text: "Sem Contato", bg: "bg-gray-100", textCol: "text-gray-500" }
    ],
    notes: [
      { id: "n7", content: "O orçamento foi encaminhado em PDF contendo poltronas exclusivas, mas a arquiteta parceira optou por importação direta.", date: formatIso(-30) }
    ],
    schedules: [],
    assignee: "Consultor Lucas"
  },
  {
    id: "lead-m-8",
    name: "Claudio Ramos Filho",
    phone: "(21) 98122-3344",
    email: "claudio.ramos@uol.com.br",
    status: "Cancelado",
    source: "Tráfego Pago",
    createdAt: formatIso(-14),
    updatedAt: formatIso(-10),
    totalSpent: 0,
    orders: [],
    vipLevel: "Nenhum",
    tags: [
      { text: "Desistência por Mudança", bg: "bg-orange-100", textCol: "text-orange-800" }
    ],
    notes: [
      { id: "n8", content: "Comprou equivocadamente pelo site um modelo solteiro para colchão de casal. Solicitação de cancelamento integral efetuada e reembolsada em conta corrente.", date: formatIso(-10) }
    ],
    schedules: [],
    assignee: "Consultora Marina"
  },
  {
    id: "lead-m-9",
    name: "Amanda Silveira Costa",
    phone: "(41) 99766-8822",
    status: "Novo Lead",
    source: "Tráfego Pago",
    createdAt: formatIso(0),
    updatedAt: formatIso(0),
    totalSpent: 0,
    orders: [],
    vipLevel: "Nenhum",
    tags: [
      { text: "Sem Email", bg: "bg-red-50", textCol: "text-red-700" }
    ],
    notes: [],
    schedules: [],
    assignee: "Sem Responsável"
  },
  {
    id: "lead-m-10",
    name: "Juliana Mendes Rezende",
    phone: "(11) 98765-4321",
    email: "juliana.mendes@arquitetura.arq.br",
    status: "Em Negociação",
    source: "Indicação Arquiteto",
    createdAt: formatIso(-3),
    updatedAt: formatIso(-1),
    totalSpent: 0,
    orders: [],
    vipLevel: "VIP Gold",
    tags: [
      { text: "Arquiteta Boutique", bg: "bg-purple-100", textCol: "text-purple-800" }
    ],
    notes: [
      { id: "n10-1", content: "Montando projeto luminotécnico e estofados para cobertura nova de Alto Luxo em Moema. Visita agendada em showroom.", date: formatIso(-1) }
    ],
    schedules: [
      { id: "s10-1", type: "meeting" as const, date: formatIso(2), title: "Apresentar catálogo físico do showroom de freijó e estofados", completed: false }
    ],
    estimatedValue: 15400,
    assignee: "Consultora Sofia"
  }
];

const seededOrders = [
  ...seededLeads[2].orders,
  ...seededLeads[3].orders,
  ...seededLeads[4].orders,
  ...seededLeads[5].orders
];

const seededUsers = [
  { id: '1', name: 'Admin Master', email: 'admin@sonoecia.com.br', role: 'admin' as const, permissions: ['*'], createdAt: formatIso(-40) },
  { id: 'u-2', name: 'Consultora Sofia', email: 'sofia@sonoecia.com.br', role: 'manager' as const, permissions: ['crm', 'products'], createdAt: formatIso(-20), avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
  { id: 'u-3', name: 'Consultora Marina', email: 'marina@sonoecia.com.br', role: 'manager' as const, permissions: ['crm'], createdAt: formatIso(-18), avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
  { id: 'u-4', name: 'Consultor Gabriel', email: 'gabriel@sonoecia.com.br', role: 'viewer' as const, permissions: ['crm'], createdAt: formatIso(-15), avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" }
];

const seededLogs = [
  { id: "log-1", action: "Sincronização", details: "Banco restaurado e reestruturado no Supabase para Sono & Cia", user: "Sistema", type: "system" as const, timestamp: formatIso(0) },
  { id: "log-2", action: "Importação Catálogo", details: "Adicionado 8 produtos premium e completos em cada categoria", user: "Sistema", type: "create" as const, timestamp: formatIso(0) },
  { id: "log-3", action: "Sincronização CRM", details: "Importado 10 Leads ativos com históricos e followups reais", user: "Sistema", type: "create" as const, timestamp: formatIso(0) }
];

async function seedDatabase() {
  console.log('⌛ Iniciando Seeding do banco no Supabase no Web-Sono-Cia\'s Project...');

  const finalState = {
    products: seededProducts,
    leads: seededLeads,
    orders: seededOrders,
    users: seededUsers,
    logs: seededLogs
  };

  try {
    const { data, error } = await supabase
      .from('app_state')
      .upsert({
        id: 1,
        data: finalState,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('❌ Erro no Seeding:', error.message);
      console.error(error);
      return;
    }

    console.log('✅ SEED EXECUTADO COM SUCESSO ABSOLUTO!');
    console.log(`🚀 Foram inseridos com sucesso:`);
    console.log(`- ${seededProducts.length} Produtos Premium (8 por categoria)`);
    console.log(`- ${seededLeads.length} Leads completíssimos no CRM com históricos de followups`);
    console.log(`- ${seededOrders.length} Pedidos vinculados e monitorados`);
    console.log(`- ${seededUsers.length} Usuários gerenciadores`);
    console.log(`- ${seededLogs.length} Registros de Auditoria`);
    console.log('⚙️ O sistema da Sono & Cia está 100% calibrado, polido e pronto para receber tráfego profissional!');
  } catch (err: any) {
    console.error('💥 Erro no seeder:', err.message || err);
  }
}

seedDatabase();
