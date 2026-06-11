
export type FollowUpSchedule = {
  id: string;
  type: 'whatsapp' | 'call' | 'email' | 'meeting';
  date: string;
  title: string;
  completed: boolean;
};
export type ProductColorOption = {
  name: string;
  hex: string;
  image?: string;
  gallery?: string[];
  texture?: string;
  price?: string;
  originalPrice?: string;
  description?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  tags?: string; // Comma separated tags for the variation or single tag
};

export type Product = {
  id: string;
  name: string;
  image: string;
  gallery?: string[];
  originalPrice: string;
  price: string;
  tag?: string;
  tagColor?: string;
  category: string;
  description?: string;
  length?: string;
  width?: string;
  height?: string;
  stock?: number;
  sku?: string;
  sizes?: string[];
  colors?: ProductColorOption[];
  color?: string;
  size?: string;
  qty?: number;
  weight?: string;
  tags?: string;
  showPrice?: boolean;
  showStock?: boolean;
  hasVariations?: boolean;
  status: 'active' | 'draft' | 'out_of_stock';
  isPromoted?: boolean;
  isOffer?: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: string;
  qty: number;
  image: string;
  size?: string;
  color?: string;
};

export type LeadStatus = 'Novo Lead' | 'Em Negociação' | 'Pedido Enviado' | 'Pagamento Pendente' | 'Finalizado' | 'Pós-venda' | 'Cancelado' | 'Venda Ganha' | 'Venda Perdida';
export type VipLevel = 'Nenhum' | 'Cliente Potencial' | 'Cliente Frequente' | 'VIP Premium' | 'VIP Gold';

export type Lead = {
  id: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  nextFollowUp?: string;
  schedules?: FollowUpSchedule[];
  totalSpent: number;
  orders: Order[];
  notes: { id: string; content: string; date: string; image?: string }[];
  vipLevel: VipLevel;
  tags: {text: string, bg: string, textCol: string}[];
  favoriteProducts?: string[];
  estimatedValue?: number;
  assignee?: string;
};

export type Order = {
  id: string;
  orderNumber?: string;
  leadId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'sent' | 'completed' | 'cancelled' | 'Em Negociação' | 'Finalizado';
  createdAt: string;
};

export type AdminRole = 'admin' | 'manager' | 'viewer';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string; // local or link
  role: AdminRole;
  permissions: string[]; // e.g. 'products', 'crm', 'settings', 'metrics'
  createdAt: string;
  active?: boolean;
};

export type AppData = {
  products: Product[];
  leads: Lead[];
  orders: Order[];
  users: AdminUser[];
  logs: SystemLog[];
};

export type SystemLog = { id: string; action: string; details: string; user: string; timestamp: string; type?: 'auth'|'create'|'update'|'delete'|'system'; };
