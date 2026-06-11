import React, { useState } from 'react';
import { useStore } from '../../store';
import { LeadStatus, Lead } from '../../types';
import { Search, Filter, Plus, MoreHorizontal, MessageSquare, MessageCircle, Clock, Star, MapPin, Tag, DollarSign, Package, ShoppingBag, X, Mail, Trash2, Printer, Download, Camera, ImagePlus, Paperclip, UploadCloud, Flame, Snowflake, CalendarDays, AlertCircle, Calendar, RotateCcw, PieChart, BarChart2, FileText, ArrowDownToLine, ArrowRight, Zap, Brain, Bot, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'Novo Lead', label: 'Novo Lead', color: 'bg-blue-500' },
  { id: 'Em Negociação', label: 'Em Negociação', color: 'bg-amber-500' },
  { id: 'Pedido Enviado', label: 'Pedido Enviado', color: 'bg-emerald-500' },
  { id: 'Pagamento Pendente', label: 'Pagamento Pend.', color: 'bg-orange-500' },
  { id: 'Venda Ganha', label: 'Venda Ganha', color: 'bg-green-600' },
  { id: 'Pós-venda', label: 'Pós-venda', color: 'bg-indigo-500' },
  { id: 'Venda Perdida', label: 'Venda Perdida', color: 'bg-red-600' },
  { id: 'Cancelado', label: 'Cancelado', color: 'bg-gray-500' }
];

const formatPhone = (v: string) => {
  let cleaned = v.replace(/\D/g, '');
  if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);
  if (cleaned.length > 2 && cleaned.length <= 6) cleaned = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
  else if (cleaned.length > 6 && cleaned.length <= 10) cleaned = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  else if (cleaned.length > 10) cleaned = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  return cleaned;
};

const getWhatsAppLink = (phoneStr: string, text: string, removeNine?: boolean) => {
  if (!phoneStr) return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  
  // Remove tudo que não for dígito
  let digits = phoneStr.replace(/\D/g, '');

  if (!digits) return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  // Se o número começar com 55 e tiver 12 ou 13 dígitos, remove provisoriamente o 55
  if (digits.startsWith('55') && digits.length >= 12) {
    digits = digits.substring(2);
  }

  // Agora temos um número nacional (ex: DDD + número)
  if (digits.length === 11) {
    // DDD de 2 dígitos + número de celular de 9 dígitos (ex: 65981346264)
    const ddd = parseInt(digits.substring(0, 2), 10);
    const ninthDigit = digits.charAt(2);

    // Por padrão, NUNCA removemos o nono dígito (pois a esmagadora maioria das contas modernas no Brasil já usa o nono dígito)
    // Apenas removemos se removeNine for explicitamente 'true' (definido pelo seletor manual do usuário)
    const shouldRemove = removeNine === true;

    if (shouldRemove && ninthDigit === '9') {
      digits = digits.substring(0, 2) + digits.substring(3);
    }
  }

  // Usar api.whatsapp.com/send para maior estabilidade em navegadores de celular e aplicativos do que o wa.me redirect
  return `https://api.whatsapp.com/send?phone=55${digits}&text=${encodeURIComponent(text)}`;
};

import { AdminUser } from '../../types';
import { CRMReportsView } from './CRMReportsView';

const DashboardTarefasView = ({ leads, onSelectLead, setFilter, setView }: { leads: Lead[], onSelectLead: (l: Lead) => void, setFilter: (f: string) => void, setView: (v: 'dashboard'|'kanban'|'history') => void }) => {
  const [activeTab, setActiveTab] = useState<'schedules'|'metrics'>('schedules');
  const todayStr = new Date().toISOString().split('T')[0];

  const allSchedules = leads.flatMap(l => 
    (l.schedules || []).map(s => ({ ...s, lead: l }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayTasks = allSchedules.filter(s => s.date.startsWith(todayStr) && !s.completed);
  const overdueTasks = allSchedules.filter(s => new Date(s.date) < new Date(todayStr) && !s.completed);
  const upcmyTasks = allSchedules.filter(s => new Date(s.date) > new Date(todayStr) && !s.completed);

  const totalValue = leads.reduce((acc, l) => acc + (l.orders || []).filter(o => o.status==='Finalizado').reduce((oAcc, o) => oAcc + o.total, 0) , 0);
  const wonCount = leads.filter(l => l.status === 'Venda Ganha').length;
  const lostCount = leads.filter(l => l.status === 'Venda Perdida' || l.status === 'Cancelado').length;
  const openCount = leads.length - wonCount - lostCount;

  return (
    <div className="flex-1 px-5 sm:px-8 pb-8 flex flex-col gap-6">
      
      {/* Top Cards for Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { setView('history'); setFilter('Vendas Ganhas'); }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="absolute top-0 right-0 p-4 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform"><DollarSign className="w-16 h-16" /></div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Valor Vendido Total</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">R$ {totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
        </div>
        <div 
          onClick={() => { setView('kanban'); setFilter('Negociações Abertas'); }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="absolute top-0 right-0 p-4 text-brand-blue opacity-10 group-hover:scale-110 transition-transform"><ShoppingBag className="w-16 h-16" /></div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Negócios Abertos</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">{openCount}</p>
        </div>
        <div 
          onClick={() => { setView('history'); setFilter('Vendas Ganhas'); }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="absolute top-0 right-0 p-4 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform"><Star className="w-16 h-16" /></div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Conversão / Ganhas</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0}% / {wonCount}</p>
        </div>
        <div 
          onClick={() => { setView('history'); setFilter('Perdidos/Cancelados'); }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="absolute top-0 right-0 p-4 text-red-500 opacity-10 group-hover:scale-110 transition-transform"><Trash2 className="w-16 h-16" /></div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Perdidos / Cancelados</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{lostCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Agenda do Vendedor (Follow-ups)</h2>
         </div>
         <div className="p-4 bg-white grow overflow-y-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Overdue */}
              <div className="flex flex-col gap-3">
                 <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Atrasados ({overdueTasks.length})</h3>
                 <div className="flex flex-col gap-2">
                    {overdueTasks.length === 0 ? <p className="text-xs text-gray-400 py-4 text-center border border-dashed rounded-xl">Sem atrasos!</p> : overdueTasks.map(t => (
                      <div key={t.id} onClick={() => onSelectLead(t.lead)} className="p-3 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-xl cursor-pointer transition-colors">
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-red-600 mb-1 inline-block">{new Date(t.date).toLocaleDateString()}</span>
                        <p className="text-sm font-bold text-[#0F172A]">{t.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{t.lead.name}</p>
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* Today */}
              <div className="flex flex-col gap-3">
                 <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> Para Hoje ({todayTasks.length})</h3>
                 <div className="flex flex-col gap-2">
                    {todayTasks.length === 0 ? <p className="text-xs text-gray-400 py-4 text-center border border-dashed rounded-xl">Nada agendado para hoje.</p> : todayTasks.map(t => (
                      <div key={t.id} onClick={() => onSelectLead(t.lead)} className="p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl cursor-pointer transition-colors shadow-sm">
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-blue-600 mb-1 inline-block">{t.type}</span>
                        <p className="text-sm font-bold text-[#0F172A]">{t.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{t.lead.name}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Upcoming */}
              <div className="flex flex-col gap-3">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-4 h-4"/> Próximos ({upcmyTasks.length})</h3>
                 <div className="flex flex-col gap-2">
                    {upcmyTasks.length === 0 ? <p className="text-xs text-gray-400 py-4 text-center border border-dashed rounded-xl">Nada futuro anotado.</p> : upcmyTasks.slice(0, 10).map(t => (
                      <div key={t.id} onClick={() => onSelectLead(t.lead)} className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl cursor-pointer transition-colors shadow-sm">
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-gray-500 mb-1 inline-block border border-gray-200">{new Date(t.date).toLocaleDateString()}</span>
                        <p className="text-sm font-bold text-[#0F172A]">{t.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{t.lead.name}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default function CRM({ currentUser }: { currentUser?: AdminUser }) {
  const { data, updateLeadStatus, updateLead, deleteLead, addLead, addLog } = useStore();
  const [viewMode, setViewMode] = React.useState<'dashboard'|'kanban'|'history'|'reports'>('dashboard');
  const hasCheckedStale = React.useRef(false);

  React.useEffect(() => {
    if (hasCheckedStale.current || !data.leads || data.leads.length === 0) return;
    const now = new Date().getTime();
    let madeChanges = false;
    
    data.leads.forEach(l => {
      if (l.status === 'Em Negociação' && l.updatedAt) {
        const days = Math.floor((now - new Date(l.updatedAt).getTime()) / (1000*3600*24));
        if (days >= 30) {
           updateLead(l.id, { 
             status: 'Cancelado', 
             notes: [...(l.notes || []), { id: Math.random().toString(), content: 'Arquivado automaticamente por inatividade superior a 30 dias (Regra de Stale Leads).', date: new Date().toISOString() }] 
           });
           if(addLog) addLog('CRM', `Lead ${l.name} arquivado automaticamente (>30 dias)`, 'Sistema', 'system');
           madeChanges = true;
        }
      }
    });
    
    hasCheckedStale.current = true;
  }, [data.leads, updateLead, addLog]);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', vipLevel: 'Nenhum' as any, source: 'Manual', status: 'Novo Lead' as any });
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>(['Cancelado', 'Venda Perdida']);
  const [displayLimits, setDisplayLimits] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'recent'|'value'|'urgent'>('recent');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advFilters, setAdvFilters] = useState({ assignee: 'Todos', source: 'Todas', vipLevel: 'Todos' });

  const allAssignees = React.useMemo(() => {
    const s = new Set<string>();
    data.leads.forEach(l => {
      if ((l as any).assignee) s.add((l as any).assignee);
    });
    return Array.from(s);
  }, [data.leads]);

  const toggleColumnCollapse = (stageId: string) => {
    setCollapsedColumns(prev => prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId]);
  };
  
  const loadMore = (stageId: string) => {
    setDisplayLimits(prev => ({ ...prev, [stageId]: (prev[stageId] || 20) + 20 }));
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddNewLead = () => {
    if (!newLeadData.name || !newLeadData.phone) return;
    addLead({
      ...newLeadData, 
      assignee: currentUser?.role !== 'admin' ? currentUser?.name : 'Sem Responsável'
    });
    setShowAddLead(false);
    showSuccess('Lead adicionado com sucesso!');
    setNewLeadData({ name: '', phone: '', email: '', vipLevel: 'Nenhum', source: 'Manual', status: 'Novo Lead' });
  };

  const filteredLeads = data.leads.filter(l => {
    const s = search.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const searchDigits = s.replace(/\D/g, '');
    const nameMatch = l.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(s);
    const emailMatch = l.email && l.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(s);
    const phoneMatch = searchDigits.length > 0 && l.phone && l.phone.replace(/\D/g, '').includes(searchDigits);
    
    let filterMatch = true;
    if (activeFilter === 'Sem Follow-up') filterMatch = !l.nextFollowUp;
    if (activeFilter === 'VIPs') filterMatch = l.vipLevel !== 'Nenhum';
    if (activeFilter === 'Frios') filterMatch = l.totalSpent === 0;
    if (activeFilter === 'Meus Leads') filterMatch = (l as any).assignee === (currentUser?.name || 'Meus Leads') || (l as any).assignee === 'Meus Leads';
    if (activeFilter === 'Vendas Ganhas') filterMatch = l.status === 'Venda Ganha';
    if (activeFilter === 'Perdidos/Cancelados') filterMatch = l.status === 'Venda Perdida' || l.status === 'Cancelado';
    if (activeFilter === 'Negociações Abertas') filterMatch = !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status);

    if (advFilters.assignee !== 'Todos' && ((l as any).assignee || 'Sem Responsável') !== advFilters.assignee) filterMatch = false;
    if (advFilters.source !== 'Todas' && (l.source || 'Manual') !== advFilters.source) filterMatch = false;
    if (advFilters.vipLevel !== 'Todos' && l.vipLevel !== advFilters.vipLevel) filterMatch = false;

    return (nameMatch || phoneMatch || emailMatch) && filterMatch;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleStatusChange = (id: string, status: string) => {
    updateLeadStatus(id, status as LeadStatus);
    if (status === 'Venda Ganha') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#34D399', '#059669', '#FBBF24'] });
    }
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      handleStatusChange(leadId, status);
    }
  };

  return (
    <div className="flex flex-col pt-4 lg:pt-6 bg-[#F8F9FA] min-h-full pb-10">
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {successMessage}
        </div>
      )}
      <div className="px-5 sm:px-8 pb-4 flex flex-col gap-4">
        {/* Row 1: Title and Main Actions */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <h1 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight shrink-0">CRM</h1>
              <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 shrink-0 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => setViewMode('dashboard')} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${viewMode === 'dashboard' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                >
                  Dashboard & Tarefas
                </button>
                <button 
                  onClick={() => setViewMode('kanban')} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${viewMode === 'kanban' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                >
                  Kanban
                </button>
                <button 
                  onClick={() => setViewMode('history')} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${viewMode === 'history' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                >
                  Histórico
                  {data.leads?.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length > 0 && (
                    <span className={`${viewMode === 'history' ? 'bg-gray-100 text-[#0F172A]' : 'bg-gray-200 text-gray-500'} px-1.5 py-0.5 rounded text-[9px]`}>{data.leads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length}</span>
                  )}
                </button>
                <button 
                  onClick={() => setViewMode('reports')} 
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${viewMode === 'reports' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  Relatórios
                </button>
              </div>
            </div>
            <p className="text-gray-500 mt-1">Gerencie leads, contatos e negociações em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setShowAddLead(true)} className="h-[42px] px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue-hover transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap cursor-pointer">
              <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Lead
            </button>
            <button 
              onClick={() => {
                const headers = ['Nome,Telefone,Email,Status,VIP,Total Gasto\n'];
                const csv = filteredLeads.map((l: any) => `"${l.name}","${l.phone}","${l.email || ''}","${l.status}","${l.vipLevel}","R$ ${l.totalSpent.toFixed(2)}"`).join('\n');
                const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'leads_sonoecia.csv';
                link.click();
                showSuccess('Leads exportados com sucesso!');
              }} 
              className="h-[42px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-gray-700 shrink-0 whitespace-nowrap"
              title="Exportar Leads (CSV)"
            >
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          </div>
        </div>
        
        {/* Row 2: Filters and Search */}
        <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center gap-3 w-full min-w-0">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 overflow-x-auto hide-scrollbar min-w-0 flex-1">
             {['Todos', 'Negociações Abertas', 'Meus Leads', 'Sem Follow-up', 'VIPs', 'Frios', 'Vendas Ganhas', 'Perdidos/Cancelados'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setActiveFilter(f)} 
                 className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${activeFilter === f ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:flex-none sm:w-[260px]">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar (nome, email, telefone)..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none w-full shadow-sm text-sm"
              />
            </div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-[42px] px-4 sm:px-5 py-2 border rounded-xl transition-colors shadow-sm flex items-center gap-2 font-bold shrink-0 text-sm ${showAdvancedFilters ? 'bg-brand-blue text-white border-brand-blue hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" /> <span>Filtros</span>
            </button>
            <div className="relative shrink-0 flex-1 sm:flex-initial">
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value as any)} 
                className="h-[42px] pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm outline-none font-bold text-gray-700 text-sm appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="recent">Mais Recentes</option>
                <option value="urgent">Mais Urgentes</option>
                <option value="value">Maior Valor</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4 lg:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in w-full">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vendedor (Responsável)</label>
              <select 
                value={advFilters.assignee}
                onChange={e => setAdvFilters(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue text-sm font-medium text-gray-700"
              >
                <option value="Todos">Todos os Vendedores</option>
                {allAssignees.map(a => <option key={a} value={a}>{a}</option>)}
                <option value="Sem Responsável">Sem Responsável</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Origem</label>
              <select 
                value={advFilters.source}
                onChange={e => setAdvFilters(prev => ({ ...prev, source: e.target.value }))}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue text-sm font-medium text-gray-700"
              >
                <option value="Todas">Todas as Origens</option>
                <option value="Manual">Manual</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Indicação">Indicação</option>
                <option value="Site">Site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nível VIP</label>
              <select 
                value={advFilters.vipLevel}
                onChange={e => setAdvFilters(prev => ({ ...prev, vipLevel: e.target.value }))}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue text-sm font-medium text-gray-700"
              >
                <option value="Todos">Todos os Níveis</option>
                <option value="Nenhum">Nenhum</option>
                <option value="Cliente Potencial">Cliente Potencial</option>
                <option value="Cliente Frequente">Cliente Frequente</option>
                <option value="VIP Premium">VIP Premium</option>
                <option value="VIP Gold">VIP Gold</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* AI Premium Insight */}
      <div className="px-5 sm:px-8 pb-5 lg:-mt-2">
        <div 
           onClick={() => { setViewMode('kanban'); setActiveFilter('Sem Follow-up'); setSortBy('urgent'); }}
           className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-[0_2px_10px_rgba(59,130,246,0.05)] cursor-pointer hover:shadow-[0_2px_15px_rgba(59,130,246,0.1)] hover:-translate-y-0.5 transition-all w-full"
        >
          <div className="flex items-center gap-3 w-full">
             <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex shrink-0 items-center justify-center text-blue-600 shadow-sm border border-blue-200/50">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
             </div>
             <div className="flex-1 w-full flex flex-col xl:flex-row xl:items-center xl:justify-between pr-2">
               <div>
                 <p className="text-[10px] font-bold text-blue-600 xl:uppercase tracking-widest leading-none xl:mb-1 mb-0.5 mt-0.5">Cereja do Bolo • Smart AI Insight</p>
                 <p className="text-[13px] font-medium text-[#0F172A] leading-snug lg:leading-normal">
                   Você tem <span className="font-bold underline decoration-blue-200 underline-offset-2 text-blue-700">{data.leads.filter((l: any) => !l.nextFollowUp && ['Novo Lead','Em Negociação'].includes(l.status)).length} leads</span> abertos sem follow-up marcado. 
                   Recomendamos priorizar {data.leads.filter((l: any) => !['Venda Perdida', 'Cancelado', 'Venda Ganha'].includes(l.status) && (l.vipLevel === 'VIP Premium' || l.vipLevel === 'VIP Gold')).length} perfis VIPs com alta intenção.
                 </p>
               </div>
               <div className="mt-2 xl:mt-0 flex items-center shrink-0 text-blue-600 text-xs font-bold gap-1 group-hover:gap-1.5 transition-all">
                  Resolver agora <ArrowRight className="w-3.5 h-3.5" />
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => { setViewMode('kanban'); setActiveFilter('Todos'); }}
          className="bg-white p-4 justify-between flex flex-col rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><DollarSign className="w-16 h-16" /></div>
           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Total em Pipeline</span>
           <span className="text-2xl font-bold text-[#0F172A]">
             R$ {data.leads.filter((l: any) => !['Venda Perdida', 'Cancelado', 'Venda Ganha'].includes(l.status)).reduce((acc: any, l: any) => acc + l.totalSpent, 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
           </span>
        </div>
        <div 
          onClick={() => { setViewMode('history'); setActiveFilter('Vendas Ganhas'); }}
          className="bg-white p-4 justify-between flex flex-col rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group"
        >
           <div className="absolute top-0 right-0 p-4 text-green-500 opacity-5 group-hover:scale-110 transition-transform"><DollarSign className="w-16 h-16" /></div>
           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Vendas Ganhas</span>
           <span className="text-2xl font-bold text-green-600">
             R$ {data.leads.filter((l: any) => l.status === 'Venda Ganha').reduce((acc: any, l: any) => acc + l.totalSpent, 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
           </span>
        </div>
        <div 
          onClick={() => { setViewMode('kanban'); setActiveFilter('Negociações Abertas'); }}
          className="bg-white p-4 justify-between flex flex-col rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all relative overflow-hidden group"
        >
           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Negociações Abertas</span>
           <div className="flex items-center gap-2">
             <span className="text-2xl font-bold text-[#0F172A]">{data.leads.filter((l: any) => !['Venda Perdida', 'Cancelado', 'Venda Ganha'].includes(l.status)).length}</span>
             <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full">Leads</span>
           </div>
        </div>
        <div 
          onClick={() => { setViewMode('history'); setActiveFilter('Vendas Ganhas'); }}
          className="bg-white p-4 justify-between flex flex-col rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all relative overflow-hidden group"
        >
           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Taxa de Conversão</span>
           <div className="flex items-center gap-2">
             <span className="text-2xl font-bold text-[#0F172A]">
               {data.leads.length > 0 ? Math.round((data.leads.filter((l: any) => l.status === 'Venda Ganha').length / data.leads.length) * 100) : 0}%
             </span>
           </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
      <div className="flex-1 overflow-x-auto px-5 sm:px-8 pb-4 flex gap-4 snap-x ">
        {STAGES.filter(s => !['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(s.id)).map(stage => {
          const stageLeads = filteredLeads.filter((l: any) => l.status === stage.id);
          
          const isCollapsed = collapsedColumns.includes(stage.id);

          let sortedLeads = [...stageLeads];
          if (sortBy === 'value') {
            sortedLeads.sort((a, b) => (b.estimatedValue || b.totalSpent || 0) - (a.estimatedValue || a.totalSpent || 0));
          } else if (sortBy === 'recent') {
            sortedLeads.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
          } else if (sortBy === 'urgent') {
            sortedLeads.sort((a, b) => {
               const aUrgent = !a.nextFollowUp ? 1 : 0;
               const bUrgent = !b.nextFollowUp ? 1 : 0;
               return bUrgent - aUrgent;
            });
          }
          
          const limit = displayLimits[stage.id] || 20;
          const displayedLeads = sortedLeads.slice(0, limit);
          const hasMore = sortedLeads.length > limit;

          if (isCollapsed) {
            return (
              <div 
                key={stage.id} 
                className="w-[60px] cursor-pointer shrink-0 flex flex-col bg-[#F1F5F9]/40 border border-gray-200/40 rounded-2xl snap-start items-center py-6 hover:bg-[#F1F5F9]/80 transition-colors"
                onClick={() => toggleColumnCollapse(stage.id)}
              >
                  <span className={`w-3 h-3 rounded-full ${stage.color} shadow-sm border border-black/5 mb-6`} />
                  <span className="font-bold text-[12px] text-gray-400 whitespace-nowrap -rotate-90 origin-center translate-y-[100px] inline-block tracking-widest uppercase">
                    {stage.label} <span className="ml-2 bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                  </span>
              </div>
            );
          }

          return (
            <div 
              key={stage.id} 
              className="w-[280px] shrink-0 flex flex-col bg-[#F1F5F9]/60 border border-gray-200/60 rounded-2xl snap-start"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#F1F5F9]/80 z-10 backdrop-blur rounded-t-2xl border-b border-gray-200/50 mb-2">
                <div className="flex flex-col gap-1 w-full mr-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.color} shadow-sm border border-black/5`} />
                    <h3 className="font-bold text-[13px] text-[#0F172A] tracking-tight truncate">{stage.label}</h3>
                    <span className="bg-white border border-gray-400/20 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{stageLeads.length}</span>
                  </div>
                  {/* Pipeline Value */}
                  <div className="text-[10px] font-bold tracking-widest text-[#0F172A]/40 uppercase mt-0.5">
                    R$ {stageLeads.reduce((acc: number, l: any) => acc + (l.estimatedValue || l.totalSpent || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <button onClick={() => toggleColumnCollapse(stage.id)} className="text-gray-400 hover:text-[#0F172A] transition-colors p-1 self-start -mt-1 -mr-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 px-1 mx-2 pb-3 space-y-2.5 relative">
                {displayedLeads.map((lead: any) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onDragStart={handleDragStart} 
                    onClick={() => setSelectedLead(lead)} 
                    onStatusChange={(status: any) => handleStatusChange(lead.id, status)} 
                    onDelete={() => {
                      deleteLead(lead.id);
                      showSuccess('Card excluído com sucesso!');
                    }}
                  />
                ))}
                
                {hasMore && (
                  <button onClick={() => loadMore(stage.id)} className="w-full py-2.5 text-xs font-bold text-gray-500 bg-white/50 border border-gray-200 border-dashed rounded-xl hover:bg-white hover:text-[#0F172A] transition-all flex items-center justify-center gap-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    Carregar Mais ({sortedLeads.length - limit})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      ) : viewMode === 'history' ? (
      <div className="flex-1 px-5 sm:px-8 pb-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto select-none">
          <table className="min-w-[800px] lg:min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="p-4 pl-6">Nome do Lead / Contato</th>
                <th className="p-4">Status Final</th>
                <th className="p-4">Valor Estimado</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Última Att.</th>
                <th className="p-4 pr-6 text-right w-36">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status)).length === 0 ? (
                <tr>
                   <td colSpan={6} className="p-12 text-center text-gray-500">
                     Nenhum lead no histórico com formato finalizado.
                   </td>
                </tr>
              ) : (
                (() => {
                  const items = [...filteredLeads.filter(l => ['Venda Ganha', 'Venda Perdida', 'Cancelado'].includes(l.status))];
                  if (sortBy === 'value') {
                    items.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
                  } else if (sortBy === 'recent') {
                    items.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
                  } else if (sortBy === 'urgent') {
                    items.sort((a, b) => {
                       const aUrgent = !a.nextFollowUp ? 1 : 0;
                       const bUrgent = !b.nextFollowUp ? 1 : 0;
                       return bUrgent - aUrgent;
                    });
                  }
                  return items;
                })().map(l => {
                  const stageObj = STAGES.find(s=>s.id===l.status);
                  const colorStr = stageObj ? stageObj.color : 'bg-gray-500';
                  const textColor = colorStr.replace('bg-', 'text-').replace('500', '600').replace('600', '600');
                  const bgColor = colorStr.replace('bg-', 'bg-').replace('500', '50').replace('600', '50');
                  
                  return (
                  <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                     <td className="p-4 pl-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-[#0F172A]">{l.name}</span>
                          <span className="text-xs text-gray-400 font-medium">{l.phone}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${textColor} ${bgColor} border-current/20`}>
                           {l.status}
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="font-bold text-sm text-[#0F172A]">
                          R$ {(l.totalSpent || 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="text-sm text-gray-600 font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg w-fit">{l.assignee || 'Sem Responsável'}</span>
                     </td>
                     <td className="p-4">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{new Date(l.updatedAt).toLocaleDateString()}</span>
                     </td>
                     <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedLead(l)} className="text-brand-blue hover:text-blue-700 font-bold text-[11px] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 hover:bg-blue-100">
                            Abrir
                          </button>
                          <button 
                            onClick={() => setLeadToDelete(l)}
                            className="p-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-lg transition-all"
                            title="Excluir cliente e histórico"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                     </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : viewMode === 'dashboard' ? (
      <DashboardTarefasView 
        leads={filteredLeads} 
        onSelectLead={(l) => { setSelectedLead(l); setViewMode('history'); }} 
        setFilter={setActiveFilter}
        setView={setViewMode}
      />
      ) : viewMode === 'reports' ? (
      <CRMReportsView leads={data.leads} />
      ) : null}

      {(() => {
        const activeLead = selectedLead ? data.leads.find(l => l.id === selectedLead.id) || selectedLead : null;
        return activeLead && <LeadDetailsModal lead={activeLead} onClose={() => setSelectedLead(null)} />;
      })()}

      {leadToDelete && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col shadow-2xl scale-in-center border border-gray-100 text-center relative">
            <button 
              onClick={() => setLeadToDelete(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Excluir Cliente?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed px-2">
              Tem certeza que deseja excluir o cliente <strong className="text-gray-900">{leadToDelete.name}</strong> e todo o seu histórico de vendas, logs e mensagens do CRM? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setLeadToDelete(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors border border-gray-200/50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteLead(leadToDelete.id);
                  if (addLog) {
                    addLog('CRM', `Cliente ${leadToDelete.name} e seu histórico foram excluídos permanentemente.`, 'Sistema', 'system');
                  }
                  setLeadToDelete(null);
                  showSuccess('Cliente excluído com sucesso!');
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddLead && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in px-4 py-6">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl scale-in-center">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A]">Novo Lead</h2>
              <button 
                onClick={() => setShowAddLead(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#0F172A] hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nome Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newLeadData.name} 
                  onChange={e => setNewLeadData({...newLeadData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="Ex: João Silva" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.phone} 
                  onChange={e => setNewLeadData({...newLeadData, phone: formatPhone(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="(00) 00000-0000" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                <input 
                  type="email" 
                  value={newLeadData.email} 
                  onChange={e => setNewLeadData({...newLeadData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-[15px]" 
                  placeholder="joao@exemplo.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
                  <select 
                    value={newLeadData.status} 
                    onChange={e => setNewLeadData({...newLeadData, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm appearance-none cursor-pointer"
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">VIP</label>
                  <select 
                    value={newLeadData.vipLevel} 
                    onChange={e => setNewLeadData({...newLeadData, vipLevel: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="Nenhum">Nenhum</option>
                    <option value="Cliente Potencial">Potencial</option>
                    <option value="Cliente Frequente">Frequente</option>
                    <option value="VIP Premium">Premium</option>
                    <option value="VIP Gold">Gold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Origem (Indicação, etc)</label>
                <select 
                  value={newLeadData.source} 
                  onChange={e => setNewLeadData({...newLeadData, source: e.target.value as any})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="Manual">Manual</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Indicação">Indicação (Boca a Boca)</option>
                  <option value="Site">Site</option>
                  <option value="Anúncio">Anúncio/Ads</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
               <button 
                 onClick={() => setShowAddLead(false)}
                 className="px-5 py-2.5 text-gray-600 font-bold text-sm hover:text-gray-900 transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleAddNewLead}
                 disabled={!newLeadData.name || !newLeadData.phone}
                 className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(1,82,148,0.2)] hover:shadow-[0_4px_20px_rgba(1,82,148,0.3)] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
               >
                 Salvar Lead
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const getLeadTemp = (lead: Lead) => {
  if (lead.vipLevel === 'VIP Gold' || lead.vipLevel === 'VIP Premium' || lead.totalSpent > 500) return { icon: <Flame className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />, color: 'bg-orange-50 border-orange-100' };
  if (lead.totalSpent > 0 || lead.vipLevel === 'Cliente Frequente') return { icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, color: 'bg-amber-50 border-amber-100' };
  return { icon: <Snowflake className="w-3.5 h-3.5 text-blue-400" />, color: 'bg-blue-50 border-blue-100' };
};

const LeadCard: React.FC<{ lead: Lead, onDragStart: (e: React.DragEvent, id: string) => void, onClick: () => void, onStatusChange?: (status: string) => void, onDelete?: () => void }> = ({ lead, onDragStart, onClick, onStatusChange, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const temp = getLeadTemp(lead);
  const isOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();
  
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={!isDeleting ? onClick : undefined}
      className={`bg-white p-3.5 rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border ${isOverdue ? 'border-red-200 hover:border-red-300' : 'border-gray-100/80 hover:border-brand-blue/30'} cursor-grab active:cursor-grabbing hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group select-none flex flex-col gap-2 relative`}
    >
      {isDeleting ? (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 rounded-[14px] flex flex-col items-center justify-center p-4 text-center animate-fade-in border border-red-100">
           <span className="text-xs font-bold text-[#0F172A] mb-3">Excluir este lead?</span>
           <div className="flex items-center gap-2">
             <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-colors">Excluir</button>
             <button onClick={(e) => { e.stopPropagation(); setIsDeleting(false); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold px-4 py-2 rounded-lg transition-colors">Cancelar</button>
           </div>
        </div>
      ) : null}
      
      {/* Automação de Cadência: Alerta Esfriando */}
      {(() => {
        const days = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24));
        if (lead.status === 'Em Negociação' && days >= 3) {
           return (
             <div className="absolute -top-2.5 -right-2.5 z-20 animate-bounce">
               <span className="flex items-center gap-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-xl shadow-lg border-2 border-white">
                 <AlertCircle className="w-3 h-3" /> Esfriando
               </span>
             </div>
           );
        }
        return null;
      })()}
      
      <div className="flex justify-between items-start z-10 w-full relative">
         <div className="flex-1 min-w-0 pr-2 flex gap-3">
           {lead.avatarUrl && !lead.avatarUrl.includes('pravatar.cc') ? (
             <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm relative group-hover:scale-105 transition-transform bg-gray-100 flex items-center justify-center">
               <img src={lead.avatarUrl} alt={lead.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
           ) : (
             <div className="w-10 h-10 rounded-full shrink-0 border-2 border-white shadow-sm overflow-hidden relative group-hover:scale-105 transition-transform bg-brand-blue/5 text-brand-blue flex items-center justify-center">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random&color=fff&bold=true&size=150`} alt={lead.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
           )}
           <div className="flex flex-col gap-0.5 min-w-0">
             <h4 className="font-bold text-[13px] text-[#0F172A] truncate leading-tight group-hover:text-brand-blue transition-colors">{lead.name}</h4>
             <a 
               href={getWhatsAppLink(lead.phone, `Olá ${lead.name}, aqui é da Sono & Cia! Agradecemos o seu pedido. Um de nossos consultores já vai dar o atendimento para finalizar o seu pedido.`)}
             target="_blank"
             rel="noreferrer"
             onClick={e => e.stopPropagation()}
             className="flex items-center w-fit gap-1.5 text-[10px] text-gray-400 hover:text-green-600 font-bold tracking-wide transition-colors group/wa bg-gray-50 hover:bg-green-50 px-2 py-0.5 rounded-full mt-0.5"
             title="Chamar no WhatsApp"
           >
             <MessageCircle className="w-3 h-3 text-green-500 group-hover/wa:scale-110 transition-transform" />
             {lead.phone}
           </a>
           </div>
         </div>
         
         <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border shadow-sm ${temp.color}`} title="Temperatura do Lead">
              {temp.icon}
            </div>
           {lead.vipLevel !== 'Nenhum' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 opacity-90" />}
           <button 
             onClick={(e) => { e.stopPropagation(); setIsDeleting(true); }}
             className="text-gray-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
             title="Excluir"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
           </button>
         </div>
      </div>
      
      
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 z-10 relative pointer-events-none">
          {lead.tags.slice(0, 3).map((tag: any, i: number) => {
    const tText = tag.text || tag;
    const tBg = tag.bg || 'bg-gray-100';
    const tTextCol = tag.textCol || 'text-[#0F172A]';
    return (
      <span key={i} className={`text-[8px] font-bold uppercase tracking-widest ${tTextCol} ${tBg} border border-gray-200/50 px-1.5 py-0.5 rounded shadow-sm`}>
        {tText}
      </span>
    );
})}
          {lead.tags.length > 3 && (
            <span className="text-[8px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">+{lead.tags.length - 3}</span>
          )}
        </div>
      )}

      {lead.orders && lead.orders.length > 0 && (() => {
        const finais = lead.orders.filter(o => o.status === 'Finalizado').length;
        const negoc = lead.orders.filter(o => o.status !== 'Finalizado').length;
        return (
          <div className="mt-1">
            <div className="flex flex-col gap-2.5 bg-gradient-to-b from-gray-50/80 to-white rounded-xl px-3 py-3 border border-gray-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group/orders transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover/orders:opacity-100 transition-opacity"></div>
               
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                   <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100/50 group-hover/orders:scale-110 transition-transform">
                     <ShoppingBag className="w-3 h-3 text-blue-500" />
                   </div>
                   <span>{lead.orders.length} Pedido{lead.orders.length > 1 ? 's' : ''}</span>
                 </div>
                 <div className="text-[11px] font-black text-[#0F172A] tracking-tight">
                   R$ {lead.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
               </div>
               
               {(finais > 0 || negoc > 0) && (
                 <div className="flex items-center justify-between gap-1.5 mt-0.5">
                   {finais > 0 && (
                     <div className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-emerald-50/80 rounded border border-emerald-100/50 flex-1 shadow-[inset_0_1px_rgba(255,255,255,1)] min-w-0">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                       <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-emerald-700 truncate">{finais} Finalizado{finais > 1 ? 's' : ''}</span>
                     </div>
                   )}
                   {negoc > 0 && (
                     <div className="flex items-center justify-center gap-1 px-1.5 py-1.5 bg-amber-50/80 rounded border border-amber-100/50 flex-1 shadow-[inset_0_1px_rgba(255,255,255,1)] min-w-0">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite] shrink-0"></span>
                       <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-amber-700 truncate">{negoc} Negociação</span>
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        );
      })()}

      {onStatusChange && (
        <select 
          value={lead.status}
          onClick={e => e.stopPropagation()}
          onChange={e => {
             e.stopPropagation();
             onStatusChange(e.target.value);
          }}
          className="w-full mt-1 bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer appearance-none text-center"
        >
          {STAGES.map(stage => (
            <option key={stage.id} value={stage.id}>{stage.label}</option>
          ))}
        </select>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider ${
            (() => {
              const daysParked = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24));
              if (daysParked >= 7) return 'bg-orange-50 text-orange-600 border border-orange-100';
              if (daysParked >= 3) return 'bg-amber-50 text-amber-600 border border-amber-100';
              return 'text-gray-400 bg-gray-50 border border-gray-100/50';
            })()
          }`} title="Tempo sem alteração de status/notas">
            <Clock className="w-2.5 h-2.5" />
            {(() => {
              const daysParked = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24));
              if (daysParked === 0) return 'Hoje';
              if (daysParked === 1) return 'Ontem';
              return `Há ${daysParked} d`;
            })()}
          </span>
          {(lead as any).assignee && (lead as any).assignee !== 'Sem Responsável' && (
            <span className="text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded shadow-sm max-w-[80px] truncate" title={(lead as any).assignee}>
              {(lead as any).assignee}
            </span>
          )}
        </div>
        <div className="flex -space-x-1.5">
           {(lead.orders || []).flatMap(o => o.items).slice(0, 3).map((item, i) => (
             <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm relative z-10 hover:z-20 transform hover:scale-110 transition-transform">
               <img src={item.image} className="w-full h-full object-cover" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export const LeadDetailsModal = ({ lead, onClose }: { lead: Lead, onClose: () => void }) => {
  const { data, updateLead, updateLeadStatus, updateOrder, deleteLead } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({ type: 'whatsapp', date: '', title: '' });
  const [schedules, setSchedules] = useState<any[]>((lead as any).schedules || []);

  const leadScore = React.useMemo(() => {
    let score = 25; // base mínima de captação
    if (lead.vipLevel === 'VIP Gold') score += 35;
    else if (lead.vipLevel === 'VIP Premium') score += 30;
    else if (lead.vipLevel === 'Cliente Frequente') score += 20;
    else if (lead.vipLevel === 'Cliente Potencial') score += 10;

    if (lead.totalSpent > 1500) score += 25;
    else if (lead.totalSpent > 500) score += 15;
    else if (lead.totalSpent > 0) score += 10;

    if (schedules.some(s => !s.completed)) score += 10;
    if (lead.notes && lead.notes.length > 0) score += Math.min(lead.notes.length * 3, 15);
    if (lead.email) score += 5;
    if (lead.phone && lead.phone.length > 9) score += 5;
    
    if (lead.source === 'Indicação') score += 10;
    else if (lead.source === 'WhatsApp') score += 5;

    return Math.min(score, 100);
  }, [lead.vipLevel, lead.totalSpent, schedules, lead.notes, lead.email, lead.phone, lead.source]);

  const tempInfo = React.useMemo(() => {
    if (leadScore >= 75) return { label: 'Super Quente (VIP)', color: 'text-red-500 bg-red-50 border-red-100' };
    if (leadScore >= 50) return { label: 'Quente', color: 'text-orange-500 bg-orange-50 border-orange-100' };
    if (leadScore >= 30) return { label: 'Morno', color: 'text-[#B45309] bg-amber-50 border-amber-100' };
    return { label: 'Frio', color: 'text-blue-500 bg-blue-50 border-blue-100' };
  }, [leadScore]);

  const handleAddSchedule = () => {
    if (!scheduleData.title || !scheduleData.date) return;
    const newSchedule = { id: Math.random().toString(36).substring(2, 9), type: scheduleData.type as any, date: scheduleData.date, title: scheduleData.title, completed: false };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
    setShowScheduleForm(false);
    setScheduleData({ type: 'whatsapp', date: '', title: '' });
  };

  const handleToggleSchedule = (id: string) => {
    const updatedSchedules = schedules.map((s: any) => s.id === id ? { ...s, completed: !s.completed } : s);
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter((s: any) => s.id !== id);
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };
  const [formData, setFormData] = useState({ phone: lead.phone, email: lead.email || '', notes: lead.notes || [], status: lead.status, avatarUrl: lead.avatarUrl || '', vipLevel: lead.vipLevel || 'Nenhum', assignee: (lead as any).assignee || 'Sem Responsável', estimatedValue: (lead as any).estimatedValue || '', tags: lead.tags || [], name: lead.name, source: lead.source || 'Manual' });
  const [newTag, setNewTag] = useState('');
  const [financeActiveTab, setFinanceActiveTab] = useState<'all' | 'closed' | 'negotiation'>('all');
  const [newTagColor, setNewTagColor] = useState({bg: 'bg-gray-100', textCol: 'text-gray-700'});
  const [isAddingTag, setIsAddingTag] = useState(false);
    const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '');
  const [noteImage, setNoteImage] = useState<string | null>(null);
  const [timelineTab, setTimelineTab] = useState<'note' | 'schedule'>('note');

  // CRM Elite Commercial Suite - Estados
  const [eliteTab, setEliteTab] = useState<'templates' | 'copilot' | 'tags'>('templates');
  const [templateCategory, setTemplateCategory] = useState<'abordagem' | 'objecoes' | 'fechamento' | 'posvendas'>('abordagem');
  const [activeTemplateText, setActiveTemplateText] = useState('');
  const [isAnalyzingCopilot, setIsAnalyzingCopilot] = useState(false);
  const [copilotAnalysis, setCopilotAnalysis] = useState<any | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedCopilot, setCopiedCopilot] = useState(false);

  // Tags Rápidas de WhatsApp - Estados
  const [fastTagSearch, setFastTagSearch] = useState('');
  const [selectedFastTagId, setSelectedFastTagId] = useState<string | null>(null);
  const [customTagMessage, setCustomTagMessage] = useState('');
  const [copiedFastTag, setCopiedFastTag] = useState(false);

  // Estado para controlar a remoção do 9º dígito no envio de mensagens de WhatsApp
  const initialRemoveNine = React.useMemo(() => {
    // Agora o padrão é sempre falso (manter o 9º dígito), que é compatível com 99% das contas modernas do WhatsApp
    return false;
  }, []);

  const [whatsappRemoveNine, setWhatsappRemoveNine] = useState(initialRemoveNine);

  const timelineItems = [
    ...(formData.notes || []).map((n) => ({ type: 'note', date: new Date(n.date).getTime(), data: n })),
    ...schedules.map((s) => ({ type: 'schedule', date: new Date(s.date).getTime(), data: s })),
    ...(lead.orders || []).map((o) => ({ type: 'order', date: new Date(o.createdAt).getTime(), data: o }))
  ].sort((a, b) => b.date - a.date);

  // CRM Elite Commercial Suite - Funções Auxiliares
  const getDynamicTemplates = () => {
    const nome = lead.name || '';
    const vendedor = formData.assignee !== 'Sem Responsável' ? formData.assignee : 'seu consultor';
    const origem = formData.source || 'Manual';
    const vip = lead.vipLevel !== 'Nenhum' ? lead.vipLevel : 'Especial';
    const valor = Number(formData.estimatedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    return {
      abordagem: [
        { 
          label: 'Boas-Vindas & Origem', 
          text: `Olá, ${nome}! Tudo bem? Vi que você chegou até nós via ${origem}. Me chamo ${vendedor} e sou seu consultor pessoal aqui na Sono & Cia! Como posso te ajudar na escolha do seu produto ideal hoje?`
        },
        { 
          label: 'Apresentação de Novidades', 
          text: `Oi, ${nome}! Passando para te contar que acabaram de chegar modelos exclusivos no nosso estoque! Como sei que você gosta de novidades e tem nível ${vip}, pensei em te mandar algumas fotos em primeira mão. Quer dar uma olhada?`
        }
      ],
      objecoes: [
        { 
          label: 'Objeção de Preço (Valor)', 
          text: `Compreendo perfeitamente, ${nome}. O valor reflete a nossa qualidade Premium estrutural, acabamento exclusivo em todas as etapas e garantia de satisfação Sono & Cia. Além disso, conseguimos facilidades incríveis de parcelamento ou desconto à vista no Pix. Que tal fazermos uma simulação sob medida pro seu orçamento hoje?`
        },
        { 
          label: 'Vou Pensar / Cônjuge', 
          text: `Sem problemas, ${nome}! É importante decidir com calma. Para te ajudar a avaliar em família, posso te enviar um catálogo de fotos detalhadas com as especificações? Ah, se fecharmos hoje, consigo adicionar um brinde especial da Sono & Cia para você!`
        }
      ],
      fechamento: [
        { 
          label: 'Gatilho de Escassez', 
          text: `Oi, ${nome}! Estou passando para te avisar que as unidades deste lote exclusivo já estão quase esgotas na Sono & Cia. Gostaria de reservar o seu agora mesmo antes que acabe? O envio pode ser feito de forma prioritária!`
        },
        { 
          label: 'Link de Pagamento / PIX', 
          text: `Perfeito, ${nome}! Tudo estruturado para envio. O valor total de fechamento ficou em R$ ${valor}. Gostaria que eu gerasse o link seguro de pagamento parcelado ou a chave Pix com desconto especial à vista para agilizarmos a expedição?`
        }
      ],
      posvendas: [
        { 
          label: 'Pós-Venda Satisfação', 
          text: `Olá, ${nome}! Passando para saber se o seu pedido chegou com total segurança e o que você achou dos produtos! Sua satisfação é o nosso maior objetivo aqui na Sono & Cia.`
        },
        { 
          label: 'Cupom de Recompra (Fidelidade)', 
          text: `Oi, ${nome}! Como forma de agradecimento pela sua parceria e classificação ${vip}, liberamos um cupom exclusivo de 10% de desconto na sua próxima compra ou para você indicar um amigo. Gostaria de ativar hoje?`
        }
      ]
    };
  };

  const templates = getDynamicTemplates();

  const handleTriggerAnalysis = () => {
    setIsAnalyzingCopilot(true);
    setTimeout(() => {
      const nome = lead.name;
      const origem = formData.source;
      const score = leadScore;
      const vip = lead.vipLevel;
      const gasto = lead.totalSpent;

      let perfil = '';
      let gatilho = '';
      let script = '';

      if (vip !== 'Nenhum' || gasto > 1000) {
        perfil = `Cliente de perfil Analítico e Exclusivo (VIP). Demonstra alto valor de engajamento com score de ${score}%. Gosta de atendimento altamente personalizado, produtos selecionados de tiragem única, privilégios de status e embalagens diferenciadas.`;
        gatilho = `Gatilho da Exclusividade & Prestígio. Enfatize que são peças selecionadas de estoque restrito e ofereça atendimento de concierge.`;
        script = `Olá, ${nome}! Como você é um de nossos clientes VIPs favoritos na Sono & Cia, separei por aqui duas alternativas de alto nível que acabaram de desembarcar em nosso estoque restrito. Gostaria que eu mostrasse os detalhes técnicos por chamada de vídeo ou fotos especiais?`;
      } else if (origem === 'Indicação') {
        perfil = `Cliente caloroso e relacional. Originado via Indicação de terceiros de alta confiança. Preza pela segurança, depoimentos positivos e garantia real do produto.`;
        gatilho = `Gatilho da Prova Social & Reciprocidade. Explique que foi indicado com muito carinho e que você preparou um acolhimento especial.`;
        script = `Oi, ${nome}! Que prazer falar com você. Fiquei muito feliz em saber que você veio por indicação! Para honrar essa recomendação, preparei uma cortesia exclusiva para seu primeiro pedido conosco. Gostaria de conferir qual é?`;
      } else {
        perfil = `Cliente Pragmático focado em agilidade e custo-benefício. Originado via ${origem}. Prefere respostas imediatas, fotos reais do produto em mãos e fechamento objetivo sem delongas.`;
        gatilho = `Gatilho da Escassez & Facilidade. Ofereça frete imediato gratuito e facilidade de Pix à vista com desconto.`;
        script = `Olá, ${nome}! Consegui liberar agora com o gerente de vendas um cupom surpresa de envio com frete grátis e despacho prioritário em até 24 horas para o seu CEP. Vamos aproveitar essa oportunidade e fechar seu pedido hoje?`;
      }

      setCopilotAnalysis({ perfil, gatilho, script });
      setIsAnalyzingCopilot(false);
    }, 1200);
  };

  const fastTagsList = React.useMemo(() => {
    const nome = lead.name || 'Cliente';
    const vendedor = formData.assignee !== 'Sem Responsável' ? formData.assignee : 'seu Consultor Sono & Cia';
    const origem = formData.source || 'Manual';
    const vip = lead.vipLevel && lead.vipLevel !== 'Nenhum' ? lead.vipLevel : 'Especial';
    const valor = Number(formData.estimatedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const dynamicLink = `https://sonoecia.com.br/pay/${lead.id}`;
    const trackingCode = `EU${lead.id.substring(0, 4).toUpperCase()}89270BR`;

    return [
      {
        id: 'boas-vindas',
        label: 'Primeiro Contato 👋',
        category: 'Status',
        color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        activeColor: 'ring-2 ring-green-600/20 border-green-600 bg-green-50/40 text-green-800',
        description: 'Primeira saudação para novos cadastros de leads.',
        template: `Olá, ${nome}! Tudo bem? Vi que você chegou até nós via ${origem}. Me chamo ${vendedor} e sou seu consultor pessoal aqui na Sono & Cia! Como posso te ajudar na escolha do seu produto ideal hoje?`
      },
      {
        id: 'retomada-quente',
        label: 'Retomada Leve 📞',
        category: 'Status',
        color: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] hover:bg-[#FEF3C7]',
        activeColor: 'ring-2 ring-amber-600/20 border-amber-600 bg-amber-50/40 text-amber-900',
        description: 'Chamar a atenção de leads parados sem pressionar.',
        template: `Oi, ${nome}! Tudo bem? Passando para te desejar um excelente dia! Ficou com alguma dúvida sobre o modelo de Sono & Cias que estávamos vendo? Caso já tenha decidido, consigo agilizar seu envio prioritário hoje mesmo!`
      },
      {
        id: 'oferta-pix',
        label: 'Oferta no Pix ⚡',
        category: 'Status',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
        activeColor: 'ring-2 ring-indigo-600/20 border-indigo-600 bg-indigo-50/40 text-indigo-900',
        description: 'Ativar desconto progressivo de Pix no valor estimado.',
        template: `Notícia boa, ${nome}! Consegui com o gerente Sono & Cia um desconto adicional exclusivo de 10% para pagamento à vista via Pix. O seu pedido fica especial em R$ ${valor} e com frete expresso por nossa conta. Vamos aproveitar hoje?`
      },
      {
        id: 'garantia-confianca',
        label: 'Garantias da Loja 🛡️',
        category: 'Objeções',
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        activeColor: 'ring-2 ring-blue-600/20 border-blue-600 bg-blue-50/40 text-blue-900',
        description: 'Deixar clientes novatos ou desconfiados mais seguros.',
        template: `Compreendo perfeitamente o receio, ${nome}! É super compreensível comprar online com cuidado. Na Sono & Cia nós garantimos 100% de satisfação: emitimos nota fiscal corporativa, seu pacote tem seguro de transporte total e, se o tamanho não ficar perfeito, a primeira troca é totalmente grátis!`
      },
      {
        id: 'escassez-lote',
        label: 'Lote Quase Acabando ⌛',
        category: 'Objeções',
        color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
        activeColor: 'ring-2 ring-rose-600/20 border-rose-600 bg-rose-50/40 text-rose-900',
        description: 'Gatilho tradicional de escassez pelo nível de afinidade.',
        template: `Olá, ${nome}! Estou passando rápido para te avisar que o lote promocional do seu interesse está com as últimas unidades disponíveis. Como você é classificado como ${vip}, decidi te alertar antes que zere. Gostaria de reservar o seu?`
      },
      {
        id: 'link-pagamento',
        label: 'Link de Checkout 💳',
        category: 'Logística',
        color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        activeColor: 'ring-2 ring-purple-600/20 border-purple-600 bg-purple-50/40 text-purple-900',
        description: 'Encurtar atalhos de compra enviando o link criptografado.',
        template: `Perfeito, ${nome}! Tudo reservado por aqui em seu nome. Para concluir o seu pedido de forma segura e imediata, é só clicar no link oficial da Sono & Cia: ${dynamicLink} . Assim que aprovar, já despachamos!`
      },
      {
        id: 'rastreio-envio',
        label: 'Código de Rastreio 🚚',
        category: 'Logística',
        color: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
        activeColor: 'ring-2 ring-slate-600/20 border-slate-600 bg-slate-100 text-slate-900',
        description: 'Compartilhar código de rastreamento simulado do cliente.',
        template: `Boa notícia, ${nome}! O seu pedido Sono & Cia já foi embalado com carinho e despachado. O código de rastreamento oficial brasileiro para acompanhar o trajeto em tempo real é: ${trackingCode}. Qualquer dúvida é só me acionar!`
      },
      {
        id: 'pos-venda-satisfacao',
        label: 'Acompanhar Feedback 🌟',
        category: 'Retenção',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        activeColor: 'ring-2 ring-emerald-600/20 border-emerald-600 bg-emerald-50/40 text-emerald-900',
        description: 'Contatar pós-venda para incentivar recompra ou avaliar.',
        template: `Olá, ${nome}! Tudo bem? Consta aqui que o seu pacote foi entregue hoje com sucesso! Como preparamos tudo à mão, queria muito saber: deu tudo certo? Ficou satisfeito com o produto? Sua avaliação é preciosa para nós!`
      }
    ];
  }, [lead.name, lead.id, lead.vipLevel, formData.source, formData.assignee, formData.estimatedValue]);


  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setFormData({ ...formData, avatarUrl: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };


  const handleDelete = () => {
    deleteLead(lead.id);
    onClose();
  };

  const handleSave = () => {
    updateLead(lead.id, { assignee: (formData as any).assignee, estimatedValue: (formData as any).estimatedValue, phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, vipLevel: formData.vipLevel, tags: formData.tags, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined, source: formData.source });
    if(formData.status !== lead.status) {
       updateLeadStatus(lead.id, formData.status as LeadStatus);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setNoteImage(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddNote = () => {
    if(!newNote.trim() && !noteImage) return;
    const note = { 
      id: Math.random().toString(36).substr(2, 9), 
      content: newNote, 
      date: new Date().toISOString(),
      ...(noteImage ? { image: noteImage } : {})
    };
    const updatedNotes = [note, ...(formData.notes || [])];
    setFormData({ ...formData, notes: updatedNotes });
    updateLead(lead.id, { notes: updatedNotes });
    setNewNote('');
    setNoteImage(null);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = (formData.notes || []).filter(n => n.id !== id);
    setFormData({ ...formData, notes: updatedNotes });
    updateLead(lead.id, { notes: updatedNotes });
  };
  
  const parsePrice = (priceVal: any) => {
    if (typeof priceVal === 'number') return priceVal;
    const match = (String(priceVal) || "0").match(/[\d.,]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/\./g, '').replace(',', '.')) || 0;
  };

  const generatePDF = (order: any, leadInfo: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Pedido #${order.id.slice(0,6).toUpperCase()} - Sono & Cia</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&family=Libre+Barcode+39&display=swap');
            body { font-family: 'Inter', sans-serif; color: #0F172A; padding: 40px; margin: 0 auto; max-width: 800px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9; position: relative; overflow: hidden; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 140px; color: rgba(1, 82, 148, 0.03); font-family: 'Playfair Display', serif; z-index: -1; white-space: nowrap; pointer-events: none;}
            .logo { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 600; color: #015294; margin-bottom: 5px; }
            .sub-logo { font-size: 13px; color: #64748B; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }
            .barcode { font-family: 'Libre Barcode 39', cursive; font-size: 40px; margin-top: 10px; color: #334155; }
            
            .grid { display: flex; justify-content: space-between; margin-bottom: 40px; gap: 20px; }
            .box { background: #f8fafc; padding: 25px; border-radius: 12px; flex: 1; border: 1px solid #e2e8f0; }
            .box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;}
            .box p { margin: 6px 0; font-size: 14px; color: #334155; }
            .box strong { font-weight: 600; color: #0F172A;}
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; margin-top: 30px; }
            th { text-align: left; padding: 15px; background: #f8fafc; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; border-bottom: 2px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
            td { padding: 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; vertical-align: middle; }
            .item-image { width: 60px; height: 60px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; padding: 4px; }
            .item-name { font-weight: 700; color: #0F172A; margin-bottom: 4px; }
            .item-meta { font-size: 12px; color: #64748B; }
            
            .total-row { display: flex; justify-content: flex-end; align-items: center; padding-top: 25px; border-top: 2px solid #f1f5f9; margin-top: 20px;}
            .total-label { font-size: 14px; color: #64748B; margin-right: 20px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
            .total-value { font-size: 32px; font-weight: 800; color: #015294; }
            
            .signatures { display: flex; justify-content: space-between; margin-top: 80px; gap: 40px; }
            .signature-box { flex: 1; text-align: center; }
            .signature-line { border-top: 1px solid #cbd5e1; margin-bottom: 10px; width: 80%; margin-left: auto; margin-right: auto;}
            .signature-name { font-size: 14px; font-weight: 600; color: #0F172A; }
            .signature-title { font-size: 12px; color: #64748B; }

            .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
            
            @media print {
              body { padding: 0; }
              .box { break-inside: avoid; }
              table { break-inside: auto; }
              tr { break-inside: avoid; break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">SONO & CIA</div>
          <div class="header">
            <div class="logo">Sono & Cia</div>
            <div class="sub-logo">Recibo de Pedido</div>
            <div class="barcode">*${order.id.slice(0,8).toUpperCase()}*</div>
          </div>
          
          <div class="grid">
            <div class="box">
              <h3>Dados do Cliente</h3>
              <p><strong>Nome:</strong> ${leadInfo.name}</p>
              <p><strong>Telefone:</strong> ${leadInfo.phone}</p>
              ${leadInfo.email ? `<p><strong>E-mail:</strong> ${leadInfo.email}</p>` : ''}
              <p style="margin-top: 15px; font-size: 12px; color:#64748B; font-weight: 500;">Registrado: ${new Date(leadInfo.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="box" style="text-align: right;">
              <h3>Detalhes do Pedido</h3>
              <p><strong>Número do Pedido:</strong> #${order.id.slice(0,8).toUpperCase()}</p>
              <p><strong>Data da Emissão:</strong> ${new Date(order.createdAt).toLocaleDateString()} às ${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              <p><strong>Status:</strong> ${order.status === 'sent' ? 'Enviado' : 'Processando'}</p>
              ${order.source ? `<p><strong>Origem/Canal:</strong> ${order.source}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 70px;">Imagem</th>
                <th>Produto</th>
                <th style="text-align: center;">Qtd</th>
                <th style="text-align: right;">Preço Un.</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || []).map(item => {
                const priceNum = parsePrice(item.price);
                const qtyNum = item.qty || 1;
                const subTotal = priceNum * qtyNum;
                return `
                <tr>
                  <td>
                    ${item.image ? `<img src="${item.image}" class="item-image" />` : '<div class="item-image" style="background:#f1f5f9"></div>'}
                  </td>
                  <td>
                    <div class="item-name">${item.name}</div>
                    <div class="item-meta">
                      ${item.color ? `Cor: ${item.color} | ` : ''}${item.size ? `Tam: ${item.size}` : ''}
                    </div>
                  </td>
                  <td style="text-align: center; font-weight: 600; font-size: 16px;">${qtyNum}</td>
                  <td style="text-align: right; color: #475569;">R$ ${priceNum.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td style="text-align: right; font-weight: 700; color: #0F172A; font-size: 16px;">R$ ${subTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                </tr>
              `;}).join('')}
            </tbody>
          </table>

          <div class="total-row">
            <div class="total-label">Subtotal Geral</div>
            <div class="total-value">R$ ${order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</div>
          </div>

          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-name">Consultor de Vendas</div>
              <div class="signature-title">Sono & Cia</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-name">${leadInfo.name}</div>
              <div class="signature-title">Cliente (Aceite)</div>
            </div>
          </div>

          <div class="footer">
            Sono & Cia &copy; ${new Date().getFullYear()} - Todos os direitos reservados.<br/>
            Este documento é o comprovante oficial de compra realizado via catálogo digital.
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 800);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in px-4 py-6 md:p-8">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-full flex flex-col shadow-2xl scale-in-center overflow-hidden border border-gray-100">
        
        {/* Header Superior */}
        <div className="px-6 py-4 md:px-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm group">
                  {(formData.avatarUrl || lead.avatarUrl) ? (
                    <img src={formData.avatarUrl || lead.avatarUrl} alt={lead.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-brand-blue flex items-center justify-center text-white font-bold text-lg">
                      {lead.name.charAt(0)}
                    </div>
                  )}
                  {isEditing && (
                    <div 
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <UploadCloud className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload} 
                  />
                )}
             </div>
             <div>
               <h2 className="text-xl font-bold text-[#0F172A]">{lead.name}</h2>
               <div className="flex items-center gap-3 text-sm mt-0.5">
                 <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Registrado em {new Date(lead.createdAt).toLocaleDateString()}</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <>
                <button onClick={() => setIsDeleting(true)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden md:block">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 text-[#0F172A] font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors hidden md:block">Editar</button>
              </>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-100"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex items-center justify-center p-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 text-center">
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
               <h3 className="text-lg font-bold text-[#0F172A] mb-2">Excluir este Lead?</h3>
               <p className="text-sm text-gray-500 mb-6">Esta ação é permanente. Todos os dados, histórico de pedidos e anotações deste cliente serão apagados.</p>
               <div className="flex gap-3">
                 <button onClick={() => setIsDeleting(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                 <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
               </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 hide-scrollbar">
          {/* Informações Pessoais (Coluna Esquerda) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Lead Score & Termômetro de Temperatura */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Lead Score / Temperatura</span>
                 <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1.5 leading-none ${tempInfo.color}`}>
                   {leadScore >= 75 ? (
                     <Flame className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse shrink-0" />
                   ) : leadScore >= 50 ? (
                     <Flame className="w-3.5 h-3.5 text-orange-500 fill-current shrink-0" />
                   ) : leadScore >= 30 ? (
                     <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                   ) : (
                     <Snowflake className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                   )}
                   {tempInfo.label}
                 </span>
               </div>
               <div className="relative">
                 <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${
                       leadScore >= 75 ? 'bg-gradient-to-r from-orange-500 to-red-500' : leadScore >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : leadScore >= 30 ? 'bg-gradient-to-r from-yellow-300 to-amber-500' : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                     }`}
                     style={{ width: `${leadScore}%` }}
                   />
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1.5">
                   <span>0% (Frio)</span>
                   <span className="font-extrabold text-[#0f172a] bg-white px-2 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100">{leadScore} Pts</span>
                   <span>100% (Quente)</span>
                 </div>
               </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informações de Contato</h3>
              {isEditing ? (
                 <div className="space-y-3">
                   <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: formatPhone(e.target.value)})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Telefone" />
                   <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" placeholder="E-mail" />
                 </div>
              ) : (
                <div className="space-y-3">
                  {formData.phone && (
                    <div className="p-3 mb-2 bg-emerald-50/25 border border-emerald-100/30 rounded-xl space-y-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] select-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800">Formato de Envio WhatsApp</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={whatsappRemoveNine} 
                            onChange={e => setWhatsappRemoveNine(e.target.checked)} 
                          />
                          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <p className="text-[9px] text-[#475569] font-medium leading-relaxed">
                        {whatsappRemoveNine 
                          ? "⚠️ Modo Alternativo (8 dígitos): Enviando sem o prefixo '9' após o DDD. Use caso o chat padrão dê erro de número inexistente." 
                          : "✨ Recomendado: Padrão moderno (9 dígitos) ativo. Funciona para a ampla maioria das contas do WhatsApp no Brasil."}
                      </p>
                    </div>
                  )}
                  <a href={getWhatsAppLink(formData.phone, `Olá ${lead.name}, aqui é da Sono & Cia! Agradecemos o seu pedido. Um de nossos consultores já vai dar o atendimento para finalizar o seu pedido.`, whatsappRemoveNine)} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-[#0F172A] hover:text-green-600 transition-colors group p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><MessageCircle className="w-4 h-4" /></div>
                    <span className="font-medium">{formData.phone}</span>
                  </a>
                  {formData.email && (
                    <a href={`mailto:${formData.email}`} className="flex items-center gap-3 text-sm text-[#0F172A] hover:text-brand-blue transition-colors group p-3 bg-gray-50 rounded-xl border border-gray-100" style={{wordBreak: "break-all"}}>
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Mail className="w-4 h-4" /></div>
                      <span className="font-medium">{formData.email}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Nível Vip Cliente</h3>
               {isEditing ? (
                  <select value={formData.vipLevel} onChange={e => setFormData({...formData, vipLevel: e.target.value as any})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none">
                    <option value="Nenhum">Nenhum</option>
                    <option value="Cliente Potencial">Cliente Potencial</option>
                    <option value="Cliente Frequente">Cliente Frequente</option>
                    <option value="VIP Premium">VIP Premium</option>
                    <option value="VIP Gold">VIP Gold</option>
                  </select>
               ) : (
                 lead.vipLevel !== 'Nenhum' ? (
                   <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${lead.vipLevel === 'VIP Gold' ? 'bg-gradient-to-r from-amber-100 to-yellow-200 text-amber-800 border-yellow-300' : lead.vipLevel === 'VIP Premium' ? 'bg-gradient-to-r from-gray-800 to-black text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                     <Star className={`w-3.5 h-3.5 ${lead.vipLevel === 'VIP Gold' ? 'text-amber-600' : lead.vipLevel === 'VIP Premium' ? 'text-gray-300' : 'text-gray-400'}`} />
                     {lead.vipLevel}
                   </div>
                 ) : (
                   <span className="text-[13px] text-gray-400 font-medium">Classificação Comum</span>
                 )
               )}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-blue-500" /> Responsável (Vendedor)</h3>
               {isEditing ? (
                  <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-700 bg-gray-50/50 appearance-none cursor-pointer">
                    <option value="Sem Responsável">Sem Responsável</option>
                    {data.users?.filter((u: any) => u.role !== 'viewer').map((u: any) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
               ) : (
                 <div className="text-[13px] text-[#0F172A] font-medium bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   {formData.assignee}
                 </div>
               )}
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Valor Estimado (Pipeline)</h3>
               {isEditing ? (
                  <input type="number" value={formData.estimatedValue} onChange={e => setFormData({...formData, estimatedValue: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-600 font-medium" placeholder="Ex: 5000" />
               ) : (
                 <div className="text-[14px] font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                   R$ {Number(formData.estimatedValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
               )}
            </div>

            {lead.orders && lead.orders.length > 0 && (
              <div className="space-y-2">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><ShoppingBag className="w-3.5 h-3.5 text-blue-500" /> Histórico de Pedidos</h3>
                 <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Total Gasto</p>
                     <p className="text-lg font-bold text-[#0F172A]">R$ {lead.totalSpent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-1">Pedidos</p>
                     <p className="text-lg font-bold text-blue-600">{lead.orders.length}</p>
                   </div>
                 </div>
              </div>
            )}

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>
               {isEditing ? (
                  <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-600 font-medium" />
               ) : (
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${!followUpDate ? 'bg-gray-100 text-gray-500' : (new Date(followUpDate) < new Date(new Date().setHours(0,0,0,0)) ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100')}`}>
                    {followUpDate ? new Date(followUpDate + 'T12:00:00').toLocaleDateString() : 'Não agendado'}
                    {followUpDate && new Date(followUpDate) < new Date(new Date().setHours(0,0,0,0)) && <AlertCircle className="w-3.5 h-3.5" />}
                 </div>
               )}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Origem / Indicação</h3>
               {isEditing ? (
                  <select 
                    value={formData.source} 
                    onChange={e => setFormData({...formData, source: e.target.value})} 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-700 bg-gray-50/50 cursor-pointer"
                  >
                    <option value="Manual">Manual</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Indicação">Indicação (Boca a Boca)</option>
                    <option value="Site">Site</option>
                    <option value="Anúncio">Anúncio/Ads</option>
                  </select>
               ) : (
                  <div className="text-[13px] text-[#0F172A] font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {formData.source || 'Manual'}
                  </div>
               )}
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status do Lead</h3>
               {isEditing ? (
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as LeadStatus})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none">
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Em Negociação">Em Negociação</option>
                    <option value="Pagamento Pendente">Pagamento Pendente</option>
                    <option value="Pedido Enviado">Pedido Enviado</option>
                    <option value="Venda Ganha">Venda Ganha</option>
                    <option value="Venda Perdida">Venda Perdida</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
               ) : (
                 <div className="inline-flex">
                   <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
                        ${lead.status === 'Novo Lead' ? 'bg-blue-50 text-blue-600' :
                        lead.status === 'Em Negociação' ? 'bg-purple-50 text-purple-600' :
                        lead.status === 'Pagamento Pendente' ? 'bg-yellow-50 text-yellow-600' :
                        lead.status === 'Pedido Enviado' ? 'bg-orange-50 text-orange-600' :
                        lead.status === 'Venda Ganha' ? 'bg-green-50 text-green-600' :
                        'bg-red-50 text-red-600'}
                    `}>
                     {lead.status}
                   </span>
                 </div>
               )}
            </div>

            {(() => {
              const orderList = lead.orders || [];
              const closedOrdersList = orderList.filter(o => o.status === 'Finalizado' || o.status === 'completed');
              const closedOrdersCount = closedOrdersList.length;
              const closedOrdersTotal = closedOrdersList.reduce((acc, o) => acc + (o.total || 0), 0);
              
              const openOrdersList = orderList.filter(o => o.status !== 'Finalizado' && o.status !== 'completed' && o.status !== 'cancelled');
              const openOrdersCount = openOrdersList.length;
              const openOrdersTotal = openOrdersList.reduce((acc, o) => acc + (o.total || 0), 0);

              const activeList = financeActiveTab === 'closed' 
                ? closedOrdersList 
                : financeActiveTab === 'negotiation' 
                  ? openOrdersList 
                  : orderList;

              return (
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <PieChart className="w-3.5 h-3.5 text-[#3B82F6]" /> Visão Comercial & Financeira
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {/* Card LTV Principal */}
                    <div 
                      onClick={() => setFinanceActiveTab('all')}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                        financeActiveTab === 'all'
                          ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#1E293B] text-white shadow-md'
                          : 'bg-white border-gray-100 hover:border-gray-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <p className={`text-[9px] uppercase font-extrabold tracking-wider mb-0.5 ${financeActiveTab === 'all' ? 'text-blue-300' : 'text-slate-400'}`}>
                          LTV / Total Gasto
                        </p>
                        <p className="text-xl font-black tracking-tight leading-none">
                          R$ {lead.totalSpent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                      <div className={`p-2 rounded-xl ${financeActiveTab === 'all' ? 'bg-white/10 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                        <DollarSign className="w-5 h-5 font-bold" />
                      </div>
                    </div>

                    {/* Botões / Mini-Cards para filtrar */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFinanceActiveTab(financeActiveTab === 'closed' ? 'all' : 'closed')}
                        className={`flex-1 p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between group outline-none select-none ${
                          financeActiveTab === 'closed'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-emerald-50/20 hover:bg-emerald-50/55 border-emerald-100/60 text-emerald-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-wider ${financeActiveTab === 'closed' ? 'text-emerald-150' : 'text-emerald-700/80'}`}>
                            Finalizados
                          </span>
                          <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                            financeActiveTab === 'closed' ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {closedOrdersCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className={`w-3 h-3 ${financeActiveTab === 'closed' ? 'text-white' : 'text-emerald-500'}`} />
                          <span className="text-xs font-black tracking-tight">
                            R$ {closedOrdersTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setFinanceActiveTab(financeActiveTab === 'negotiation' ? 'all' : 'negotiation')}
                        className={`flex-1 p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between group outline-none select-none ${
                          financeActiveTab === 'negotiation'
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                            : 'bg-amber-50/20 hover:bg-amber-50/55 border-amber-100/60 text-amber-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-wider ${financeActiveTab === 'negotiation' ? 'text-amber-150' : 'text-amber-700/80'}`}>
                            Negociação
                          </span>
                          <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                            financeActiveTab === 'negotiation' ? 'bg-white text-amber-600 animate-[pulse_1.5s_infinite]' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {openOrdersCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className={`w-3 h-3 ${financeActiveTab === 'negotiation' ? 'text-white' : 'text-amber-500'}`} />
                          <span className="text-xs font-black tracking-tight">
                            R$ {openOrdersTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Lista dinâmica de Pedidos expandida (Cereja do Bolo) */}
                    {orderList.length > 0 && (
                      <div className="bg-slate-50/40 rounded-xl border border-gray-100/60 overflow-hidden mt-1 select-none">
                        <div className="px-3 py-2 bg-slate-50/80 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-[9px] uppercase font-extrabold text-slate-500 tracking-wider">
                            {financeActiveTab === 'closed' ? '⚡ Pedidos Finalizados' : financeActiveTab === 'negotiation' ? '⏳ Em Negociação' : '📋 Todos os Pedidos'}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">
                            {activeList.length} Pedido{activeList.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="divide-y divide-gray-100 max-h-[160px] overflow-y-auto">
                          {activeList.map((o, idx) => {
                            const isFin = o.status === 'Finalizado' || o.status === 'completed';
                            return (
                              <div key={idx} className="p-2.5 hover:bg-white transition-all flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                      isFin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 font-extrabold animate-[pulse_2s_infinite]'
                                    }`}>
                                      {o.orderNumber || `#PED-${idx+1}`}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR') : ''}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-700">
                                    R$ {o.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-0.5 pl-1.5 border-l border-slate-200">
                                  {o.items?.map((item: any, i: number) => (
                                    <div key={i} className="text-[10px] text-gray-600 leading-tight">
                                      <span className="font-semibold text-slate-700">{item.qty || 1}x</span> {item.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                          
                          {activeList.length === 0 && (
                            <div className="p-4 text-center text-[10px] text-gray-400 font-semibold bg-gray-50/20">
                              Nenhum pedido encontrado nesta categoria.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {isEditing && (
              <div className="pt-4 flex gap-2">
                 <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm transition-colors">Cancelar</button>
                 <button onClick={handleSave} className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-lg text-sm">Salvar Alterações</button>
              </div>
            )}
            
            {/* Actions mobile */}
            <div className="md:hidden flex gap-2 pt-4 border-t border-gray-100">
              <button onClick={() => setIsEditing(true)} className="flex-1 py-2 bg-gray-100 text-[#0F172A] font-bold text-sm rounded-lg hover:bg-gray-200">Editar</button>
              <button onClick={() => setIsDeleting(true)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-5 h-5"/></button>
            </div>


            {/* Tags Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Etiquetas</h3>
               
               {isEditing && (
                 <div className="flex flex-col gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                   <div className="flex gap-2">
                     <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTag.trim()) {
                            setFormData({...formData, tags: [...(formData.tags || []), {text: newTag.trim().toUpperCase(), ...newTagColor}]});
                            setNewTag('');
                          }
                       }
                     }} placeholder="Nova etiqueta..." className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                     <button onClick={() => {
                        if (newTag.trim()) {
                           setFormData({...formData, tags: [...(formData.tags || []), {text: newTag.trim().toUpperCase(), ...newTagColor}]});
                           setNewTag('');
                        }
                     }} className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Adicionar</button>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor:</span>
                     <div className="flex gap-2">
                        {[
                          {bg: 'bg-gray-100', textCol: 'text-gray-700', hex: '#F3F4F6'},
                          {bg: 'bg-blue-100', textCol: 'text-blue-700', hex: '#DBEAFE'},
                          {bg: 'bg-emerald-100', textCol: 'text-emerald-700', hex: '#D1FAE5'},
                          {bg: 'bg-amber-100', textCol: 'text-amber-700', hex: '#FEF3C7'},
                          {bg: 'bg-red-100', textCol: 'text-red-700', hex: '#FEE2E2'},
                          {bg: 'bg-purple-100', textCol: 'text-purple-700', hex: '#F3E8FF'},
                          {bg: 'bg-pink-100', textCol: 'text-pink-700', hex: '#FCE7F3'}
                        ].map((c, i) => (
                           <button 
                             key={i}
                             onClick={() => setNewTagColor({bg: c.bg, textCol: c.textCol})}
                             className={`w-5 h-5 rounded-full border-2 transition-all ${newTagColor.bg === c.bg ? 'border-[#0F172A] scale-110' : 'border-transparent'}`}
                             style={{backgroundColor: c.hex}}
                             title={c.bg}
                           />
                        ))}
                     </div>
                   </div>
                 </div>
               )}

               <div className="flex flex-wrap gap-2">
                 {(formData.tags || []).map((tag: any, i: number) => {
    const tText = tag.text || tag;
    const tBg = tag.bg || 'bg-gray-100';
    const tTextCol = tag.textCol || 'text-[#0F172A]';
    return (
      <span key={i} className={`px-2 py-1 ${tBg} ${tTextCol} border border-gray-200/60 rounded flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}>
        <span className="text-[10px] font-bold uppercase tracking-widest">{tText}</span>
        {isEditing && (
          <button 
            onClick={() => setFormData({...formData, tags: (formData.tags || []).filter((t: any) => t !== tag)})}
            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-200"
          ><X className="w-3 h-3" /></button>
        )}
      </span>
    );
  })}
                 {!isEditing && (!formData.tags || formData.tags.length === 0) && (
                   <span className="text-xs text-gray-400 italic">Sem etiquetas</span>
                 )}
               </div>
            </div>

          </div>

                    {/* Linha do Tempo Unificada (Coluna Direita) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* CRM Elite Suite - Inteligência Pro e Ativação WhatsApp */}
            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-850 flex items-center justify-center text-white shadow-sm shrink-0">
                    <Zap className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#0F172A] leading-tight select-none">CRM Elite Suite</h3>
                    <p className="text-[9.5px] text-indigo-600 font-extrabold uppercase tracking-widest leading-none mt-0.5">Inteligência de Vendas</p>
                  </div>
                </div>
                
                {/* Abas da Suite */}
                <div className="flex bg-gray-100 p-0.5 rounded-xl self-start sm:self-center overflow-x-auto max-w-full hide-scrollbar shrink-0 select-none">
                  <button 
                    onClick={() => setEliteTab('templates')} 
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${eliteTab === 'templates' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}`}
                  >
                    Templates Dinâmicos
                  </button>
                  <button 
                    onClick={() => {
                      setEliteTab('copilot');
                      if(!copilotAnalysis) handleTriggerAnalysis();
                    }} 
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${eliteTab === 'copilot' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                  >
                    <Brain className="w-3.5 h-3.5" /> AI Insights
                  </button>
                  <button 
                    onClick={() => {
                      setEliteTab('tags');
                      setSelectedFastTagId(null);
                      setCustomTagMessage('');
                    }} 
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${eliteTab === 'tags' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-[#0F172A]'}`}
                  >
                    <Tag className="w-3.5 h-3.5" /> Tags Rápidas
                  </button>
                </div>
              </div>

              {/* Aba 1: Templates Dinâmicos */}
              {eliteTab === 'templates' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex border-b border-gray-100 pb-2 gap-1 overflow-x-auto hide-scrollbar">
                    {(['abordagem', 'objecoes', 'fechamento', 'posvendas'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setTemplateCategory(cat);
                          setActiveTemplateText('');
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border whitespace-nowrap transition-colors ${
                          templateCategory === cat 
                            ? 'bg-blue-50 border-blue-200 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {cat === 'abordagem' ? 'Abordagem' : cat === 'objecoes' ? 'Objeções' : cat === 'fechamento' ? 'Fechamento' : 'Pós-Venda'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {templates[templateCategory].map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTemplateText(t.text)}
                        className={`p-3 text-left bg-gray-50/50 hover:bg-gray-100/60 border border-gray-200/50 rounded-xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
                          activeTemplateText === t.text ? 'border-indigo-600 ring-2 ring-indigo-500/10 bg-indigo-50/10' : ''
                        }`}
                      >
                        <p className="text-[11px] font-extrabold text-[#0f172a] truncate flex items-center gap-1.5 uppercase tracking-wide">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {t.label}
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold leading-normal truncate mt-1">{t.text}</p>
                      </button>
                    ))}
                  </div>

                  {activeTemplateText ? (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Script Customizado</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeTemplateText);
                              setCopiedTemplate(true);
                              setTimeout(() => setCopiedTemplate(false), 2000);
                            }}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg text-gray-600 transition-colors shadow-sm flex items-center gap-1"
                          >
                            {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : null}
                            {copiedTemplate ? 'Copiado!' : 'Copiar'}
                          </button>
                          <a
                            href={getWhatsAppLink(formData.phone, activeTemplateText, whatsappRemoveNine)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Enviar
                          </a>
                        </div>
                      </div>
                      <textarea
                        value={activeTemplateText}
                        onChange={(e) => setActiveTemplateText(e.target.value)}
                        className="w-full h-24 p-3 bg-white border border-gray-200 rounded-xl text-xs text-[#334155] focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-bold italic text-center py-5">Selecione um script de vendas do WhatsApp acima para usá-lo com as variáveis dinâmicas do cliente.</p>
                  )}
                </div>
              )}

              {/* Aba 2: Sales AI Insights */}
              {eliteTab === 'copilot' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {isAnalyzingCopilot ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                      <p className="text-[10.5px] font-bold text-gray-500 tracking-widest animate-pulse uppercase">Analisando dados psicológicos de {lead.name}...</p>
                    </div>
                  ) : copilotAnalysis ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 space-y-1.5">
                        <h4 className="text-[9.5px] font-extrabold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                          <Brain className="w-4 h-4 text-indigo-500" /> Perfil de Compra
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-semibold">{copilotAnalysis.perfil}</p>
                      </div>

                      <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-100/40 space-y-1.5">
                        <h4 className="text-[9.5px] font-extrabold text-[#B45309] uppercase tracking-widest flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500" /> Gatilho Mental Recomendado
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-semibold">{copilotAnalysis.gatilho}</p>
                      </div>

                      <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/40 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[9.5px] font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                            <Bot className="w-4 h-4 text-emerald-500" /> Abordagem Hipnótica customizada
                          </h4>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(copilotAnalysis.script);
                              setCopiedCopilot(true);
                              setTimeout(() => setCopiedCopilot(false), 2000);
                            }}
                            className="bg-white hover:bg-gray-100 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 text-emerald-800"
                          >
                            {copiedCopilot ? <Check className="w-3 h-3 text-emerald-500" /> : null}
                            {copiedCopilot ? 'Copiado!' : 'Copiar'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white/70 p-3.5 rounded-xl border border-dashed border-emerald-200/50 leading-relaxed font-semibold font-serif">
                          "{copilotAnalysis.script}"
                        </p>
                        <div className="flex justify-end pr-0.5">
                          <a
                            href={getWhatsAppLink(formData.phone, copilotAnalysis.script, whatsappRemoveNine)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#10B981] hover:bg-[#059669] text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Enviar por WhatsApp
                          </a>
                        </div>
                      </div>

                      <div className="flex justify-center pb-1">
                        <button
                          onClick={handleTriggerAnalysis}
                          className="text-[10px] text-gray-400 hover:text-indigo-600 font-extrabold flex items-center gap-1 uppercase tracking-widest transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Recalcular Recomendações
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <button
                        onClick={handleTriggerAnalysis}
                        className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-850 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-widest"
                      >
                        Gerar Análise De Inteligência Do Lead
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Aba 3: Tags Rápidas de WhatsApp */}
              {eliteTab === 'tags' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest select-none">Tags de Ações Rápidas</span>
                      <p className="text-[10px] text-gray-400 font-bold">Respostas prontas personalizadas com dados reais do cliente.</p>
                    </div>
                    <div className="relative w-full sm:w-60 font-medium">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar tag..."
                        value={fastTagSearch}
                        onChange={(e) => setFastTagSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Lista de tags organizadas em grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {fastTagsList
                      .filter(tag => 
                        tag.label.toLowerCase().includes(fastTagSearch.toLowerCase()) || 
                        tag.category.toLowerCase().includes(fastTagSearch.toLowerCase()) ||
                        tag.description.toLowerCase().includes(fastTagSearch.toLowerCase())
                      )
                      .map((tag) => {
                        const isSelected = selectedFastTagId === tag.id;
                        return (
                          <button
                            key={tag.id}
                            onClick={() => {
                              setSelectedFastTagId(tag.id);
                              setCustomTagMessage(tag.template);
                            }}
                            className={`p-3 text-left border rounded-xl transition-all flex flex-col gap-1.5 ${
                              isSelected 
                                ? tag.activeColor 
                                : 'bg-white border-gray-200 hover:border-gray-300 shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`text-[9.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border ${tag.color}`}>
                                {tag.category}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div>
                              <h5 className="text-[11px] font-extrabold text-[#0f172a] flex items-center gap-1">
                                {tag.label}
                              </h5>
                              <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{tag.description}</p>
                            </div>
                          </button>
                        );
                      })
                    }
                  </div>

                  {/* Editor e Preview do Template Resolvido */}
                  {selectedFastTagId ? (
                    (() => {
                      const tag = fastTagsList.find(t => t.id === selectedFastTagId);
                      if (!tag) return null;
                      return (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 shadow-inner animate-in fade-in duration-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Script Ativo: <strong className="text-emerald-700">{tag.label}</strong>
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(customTagMessage);
                                  setCopiedFastTag(true);
                                  setTimeout(() => setCopiedFastTag(false), 2000);
                                }}
                                className="bg-white hover:bg-gray-100 border border-gray-200 text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg text-gray-600 transition-colors shadow-sm flex items-center gap-1"
                              >
                                {copiedFastTag ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : null}
                                {copiedFastTag ? 'Copiado!' : 'Copiar'}
                              </button>
                              <a
                                href={getWhatsAppLink(formData.phone, customTagMessage, whatsappRemoveNine)}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10.5px] font-extrabold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> Abrir WhatsApp
                              </a>
                            </div>
                          </div>
                          
                          <textarea
                            value={customTagMessage}
                            onChange={(e) => setCustomTagMessage(e.target.value)}
                            className="w-full h-28 p-3 bg-white border border-gray-200 rounded-xl text-xs text-[#334155] focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed font-semibold focus:border-transparent"
                          />
                          <div className="flex justify-between items-center text-[9px] text-[#64748B] font-bold px-1 select-none">
                            <span>💡 Variáveis mescladas de forma dinâmica.</span>
                            <span>{customTagMessage.length} caracteres</span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200 text-center space-y-2 select-none">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                        <Tag className="w-5 h-5 text-emerald-500 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wide">Mensagens Instantâneas de WhatsApp</p>
                        <p className="text-[10px] text-gray-400 font-bold max-w-sm mx-auto mt-0.5">Selecione uma das tags acima para carregar o script customizado com os dados de {lead.name} e enviar com um único clique.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Composer Tabs */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button onClick={() => setTimelineTab('note')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${timelineTab === 'note' ? 'bg-[#0F172A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#0F172A]'}`}>
                  <MessageCircle className="w-4 h-4" /> Registrar Nota
                </button>
                <button onClick={() => setTimelineTab('schedule')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors ${timelineTab === 'schedule' ? 'bg-[#0F172A] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#0F172A]'}`}>
                  <CalendarDays className="w-4 h-4" /> Agendar Tarefa
                </button>
              </div>

              <div className="p-4 bg-white focus-within:ring-2 focus-within:ring-[#0F172A]/10 transition-all">
                {timelineTab === 'note' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    {noteImage && (
                      <div className="relative inline-block mb-3">
                         <img src={noteImage} alt="Upload" className="h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                         <button onClick={() => setNoteImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform shadow-md"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 flex bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-brand-blue rounded-md transition-colors mr-2 cursor-pointer" title="Anexar Imagem">
                          <ImagePlus className="w-5 h-5" />
                          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </button>
                        <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()} placeholder="Adicionar nota, email enviado ou observação..." className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400" />
                      </div>
                      <button onClick={handleAddNote} className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-xs hover:bg-brand-blue-hover transition-all shadow-sm disabled:opacity-50 cursor-pointer" disabled={!newNote.trim() && !noteImage}>Salvar Nota</button>
                    </div>
                  </div>
                )}
                
                {timelineTab === 'schedule' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Título da Tarefa</label>
                        <input type="text" value={scheduleData.title} onChange={e => setScheduleData({...scheduleData, title: e.target.value})} className="w-full px-3 py-2 focus:ring-2 focus:ring-[#0F172A]/20 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none transition-all" placeholder="Ex: Ligar sobre carrinho abandonado" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Tipo de Contato</label>
                        <select value={scheduleData.type} onChange={e => setScheduleData({...scheduleData, type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0F172A]/20 transition-all">
                          <option value="whatsapp">WhatsApp</option>
                          <option value="call">Ligação</option>
                          <option value="email">E-mail</option>
                          <option value="meeting">Reunião Online</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Data / Hora de Vencimento</label>
                         <input type="datetime-local" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium outline-none focus:ring-2 focus:ring-[#0F172A]/20 transition-all" />
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-gray-100 pt-3">
                      <button onClick={handleAddSchedule} disabled={!scheduleData.title || !scheduleData.date} className="px-6 py-2.5 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-brand-blue-hover transition-all disabled:opacity-50 shadow-sm flex items-center gap-2 cursor-pointer">
                        <CalendarDays className="w-4 h-4" /> Agendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* The Unified Visual Timeline Feed */}
            <div className="relative border-l-2 border-gray-200/60 ml-[23px] sm:ml-[31px] mt-4 mb-8 space-y-8 pb-4">
               {timelineItems.length === 0 && (
                 <div className="ml-8 text-sm text-gray-400 italic">Nenhum evento registrado no histórico deste cliente.</div>
               )}
               
               {timelineItems.map((item, idx) => {
                 return (
                   <div key={idx} className="relative group">
                      {/* Timeline Node Context */}
                      <span className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-[14px] h-[14px] rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center group-hover:scale-125 transition-transform">
                         {item.type === 'note' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500" />}
                         {item.type === 'schedule' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500" />}
                         {item.type === 'order' && <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${item.data.status === 'Finalizado' ? 'bg-emerald-500' : 'bg-amber-500'}`} />}
                      </span>

                      {/* Content Card */}
                      <div className="ml-6 sm:ml-8">
                         {item.type === 'note' && (
                           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300 transition-all">
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Nota
                                  <span className="text-gray-300">•</span>
                                  {new Date(item.data.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                               </div>
                               <button onClick={() => handleDeleteNote(item.data.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             </div>
                             {item.data.content && <p className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-wrap">{item.data.content}</p>}
                             {item.data.image && (
                               <div className="mt-3 max-w-[200px] rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => window.open(item.data.image, '_blank')}>
                                  <img src={item.data.image} className="w-full h-auto" alt="Anexo" />
                               </div>
                             )}
                           </div>
                         )}

                         {item.type === 'schedule' && (() => {
                            const sch = item.data;
                            const isOverdue = new Date(sch.date) < new Date() && !sch.completed;
                            return (
                              <div className={`border rounded-xl p-4 transition-all ${sch.completed ? 'bg-gray-50/80 border-gray-200/60 opacity-80' : isOverdue ? 'bg-red-50/50 border-red-200/80 shadow-[0_2px_10px_rgba(239,68,68,0.05)]' : 'bg-white border-amber-200/50 shadow-[0_2px_10px_rgba(245,158,11,0.05)]'}`}>
                                <div className="flex justify-between items-start mb-2.5">
                                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                                    <CalendarDays className={`w-3.5 h-3.5 ${sch.completed ? 'text-gray-400' : isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                                    <span className={sch.completed ? 'text-gray-400' : isOverdue ? 'text-red-600' : 'text-amber-600'}>
                                      {sch.completed ? 'Tarefa Concluída' : isOverdue ? 'Atrasado' : 'Agendado'}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">{new Date(sch.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                  </div>
                                  <button onClick={() => handleDeleteSchedule(sch.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors opacity-0 group-hover:opacity-100" title="Excluir agendamento">
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                                </div>
                                <div className="flex gap-3">
                                  <button onClick={() => handleToggleSchedule(sch.id)} className={`shrink-0 mt-0.5 w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${sch.completed ? 'bg-gray-300 border-gray-300' : isOverdue ? 'bg-white border-red-400 hover:bg-red-50' : 'bg-white border-amber-400 hover:bg-amber-50'}`}>
                                     {sch.completed && <X className="w-4 h-4 text-white" />}
                                  </button>
                                  <div className="flex-1">
                                    <p className={`text-sm font-bold ${sch.completed ? 'line-through text-gray-500' : 'text-[#0F172A]'}`}>{sch.title}</p>
                                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 border border-gray-200/60 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded">{sch.type}</span>
                                  </div>
                                  {!sch.completed && sch.type === 'whatsapp' && (
                                     <a href={getWhatsAppLink(lead.phone, `Olá ${lead.name}, tudo bem? Aqui é da Sono & Cia.`, whatsappRemoveNine)} target="_blank" rel="noreferrer" className="shrink-0 p-2 text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200/50 self-start" title="Abrir WhatsApp">
                                       <MessageCircle className="w-5 h-5" />
                                     </a>
                                  )}
                                </div>
                              </div>
                            )
                         })()}

                         {item.type === 'order' && (() => {
                           const o = item.data;
                           const isFinalizado = o.status === 'Finalizado';
                           const borderColor = isFinalizado ? 'border-emerald-100' : 'border-amber-200';
                           const hoverBorderColor = isFinalizado ? 'group-hover:border-emerald-200' : 'group-hover:border-amber-300';
                           const shadowColor = isFinalizado ? 'shadow-[0_2px_15px_rgba(16,185,129,0.06)]' : 'shadow-[0_2px_15px_rgba(245,158,11,0.08)]';
                           const bgColor = isFinalizado ? 'bg-emerald-50/50' : 'bg-amber-50/50';
                           const innerBorderColor = isFinalizado ? 'border-emerald-50' : 'border-amber-100/50';
                           const iconBgColor = isFinalizado ? 'bg-emerald-100' : 'bg-amber-200/50';
                           const iconColor = isFinalizado ? 'text-emerald-600' : 'text-amber-700';
                           const titleColor = isFinalizado ? 'text-emerald-800' : 'text-amber-900';
                           const tagBgColor = isFinalizado ? 'bg-emerald-200/50' : 'bg-amber-200';
                           const tagTextColor = isFinalizado ? 'text-emerald-700' : 'text-amber-800';
                           const titleText = isFinalizado ? 'Pedido Finalizado' : 'Em Negociação';

                           return (
                             <div className={`bg-white border ${borderColor} rounded-xl p-0 overflow-hidden ${shadowColor} ${hoverBorderColor} transition-colors`}>
                               <div className={`${bgColor} px-4 py-3 flex justify-between items-center border-b ${innerBorderColor}`}>
                                 <div className="flex items-center gap-2">
                                   <div className={`w-7 h-7 rounded ${iconBgColor} ${iconColor} flex items-center justify-center`}><Package className="w-4 h-4" /></div>
                                   <div>
                                     <div className="flex items-center gap-1.5 mb-1">
                                       <p className={`text-[11px] font-bold ${titleColor} uppercase tracking-widest leading-none`}>{titleText}</p>
                                       {o.orderNumber && <span className={`${tagBgColor} ${tagTextColor} text-[9px] font-bold px-1.5 py-0.5 rounded uppercase`}>{o.orderNumber}</span>}
                                     </div>
                                     <p className="text-[10px] text-gray-500 font-medium">{new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                   <p className="text-sm font-bold text-[#0F172A]">R$ {o.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                 </div>
                               </div>
                               <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {o.items.map((i: any, c: number) => (
                                   <div key={c} className="flex items-center gap-3">
                                     {i.image ? <img src={i.image} className="w-10 h-10 rounded border border-gray-100 object-contain p-1" /> : <div className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center"><Package className="w-5 h-5 text-gray-300"/></div>}
                                     <div className="flex-1 min-w-0">
                                       <p className="text-[11px] font-bold text-[#0F172A] truncate">{i.name}</p>
                                       <p className="text-[10px] text-gray-500">{i.qty || 1}x {i.color || ''} {i.size || ''}</p>
                                     </div>
                                   </div>
                                 ))}
                                 <div className="col-span-full mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                   <button onClick={() => generatePDF(o, lead)} className={`${isFinalizado ? 'sm:col-span-1' : 'col-span-full'} py-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors border border-gray-200`}>
                                     <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                                   </button>
                                   {isFinalizado && (
                                     <button onClick={() => {
                                       updateOrder(o.id, { status: 'Em Negociação' });
                                       if (lead.status === 'Venda Ganha') {
                                           updateLeadStatus(lead.id, 'Em Negociação');
                                       }
                                     }} className="sm:col-span-1 py-2 w-full bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors border border-amber-200">
                                       <RotateCcw className="w-3.5 h-3.5" /> Reabrir Negociação
                                     </button>
                                   )}
                                 </div>
                               </div>
                             </div>
                           )
                         })()}
                      </div>
                   </div>
                 )
               })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
