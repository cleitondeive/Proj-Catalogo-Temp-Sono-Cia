import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { LayoutDashboard, Users, ShoppingBag, Package, Settings, LogOut, ChevronRight, Menu, X, Plus, Filter, Heart, MessageCircle, DollarSign, TrendingUp, Search, Share2, Maximize, Minimize, Copy, CheckCircle2 } from 'lucide-react';
import { Lead, Product, Order, AdminUser, AdminRole } from '../types';

import CRM from './pages/CRM';
import ProductsManager from './pages/ProductsManager';
import Metrics from './pages/Metrics';
import Auth from './components/Auth';
import SettingsPage from './pages/Settings';
import Team from './pages/Team';

export default function AdminDashboard({ onLogout, onBackToSite }: { onLogout: () => void, onBackToSite: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'products' | 'team' | 'orders' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareStoreModal, setShareStoreModal] = useState(false);
  const { data } = useStore();
  const userId = localStorage.getItem('admin_user_id');
  const currentUser = data.users?.find(u => u.id === userId) || data.users?.[0] || null;

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_user_id');
    onLogout();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const getRoleLabel = (role?: AdminRole) => {
    if (role === 'admin') return 'Admin Master';
    if (role === 'manager') return 'Gerente';
    if (role === 'viewer') return 'Visualizador';
    return 'Acesso Customizado';
  };

  const hasAccess = (tab: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.permissions.includes('*')) return true;
    return currentUser.permissions.includes(tab);
  };

  useEffect(() => {
    if (!hasAccess(activeTab)) {
      if (hasAccess('dashboard')) setActiveTab('dashboard');
      else if (hasAccess('crm')) setActiveTab('crm');
      else if (hasAccess('products')) setActiveTab('products');
      else if (hasAccess('settings')) setActiveTab('settings');
    }
  }, [currentUser, activeTab]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#0F172A] font-sans selection:bg-brand-blue selection:text-white overflow-hidden relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-100 p-4 absolute top-0 left-0 right-0 z-40">
        <div className="font-serif font-bold tracking-tight text-xl flex items-center gap-2">
          EuroOferta <span className="text-brand-blue font-light italic">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleFullscreen} className="p-2 rounded-xl text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors" title="Tela Cheia">
             {isFullscreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-gray-50 text-gray-600">
             <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 z-50 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50 h-[72px]">
           <div className="font-serif font-bold tracking-tight text-[19px] flex items-center gap-1.5">
             EuroOferta <span className="text-brand-blue font-light italic">Admin</span>
             <span className="relative flex h-2 w-2 ml-2 hidden lg:flex" title="Sistema Online">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
           </div>
           <div className="flex items-center gap-1">
             <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors hidden lg:block" title="Tela Cheia">
               {isFullscreen ? <Minimize className="w-4 h-4"/> : <Maximize className="w-4 h-4"/>}
             </button>
             <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
               <X className="w-5 h-5" />
             </button>
           </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
          {hasAccess('dashboard') && <NavItem active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}} icon={<LayoutDashboard />} label="Dashboard" />}
          {hasAccess('crm') && <NavItem active={activeTab === 'crm'} onClick={() => {setActiveTab('crm'); setIsSidebarOpen(false);}} icon={<Users />} label="CRM & Leads" />}
          {hasAccess('products') && <NavItem active={activeTab === 'products'} onClick={() => {setActiveTab('products'); setIsSidebarOpen(false);}} icon={<Package />} label="Produtos" />}
          {currentUser?.role === 'admin' && <NavItem active={activeTab === 'team' as any} onClick={() => {setActiveTab('team' as any); setIsSidebarOpen(false);}} icon={<Users />} label="Equipe & Acessos" />}
          {hasAccess('settings') && <NavItem active={activeTab === 'settings' as any} onClick={() => {setActiveTab('settings' as any); setIsSidebarOpen(false);}} icon={<Settings />} label="Configurações" />}
        </nav>

        <div className="p-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-3 py-2">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-blue-400 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white">
                {currentUser?.name.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-[#0F172A] leading-tight truncate">{currentUser?.name || 'Admin Master'}</span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase font-bold truncate">{getRoleLabel(currentUser?.role)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button onClick={() => setShareStoreModal(true)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-brand-blue transition-colors font-medium border border-transparent">
              <Share2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Compartilhar Loja</span>
            </button>
            <button onClick={onBackToSite} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#0F172A] transition-colors font-medium border border-transparent">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="text-sm">Ir para o Site</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium">
              <LogOut className="w-5 h-5 opacity-80" />
              <span className="text-sm">Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-[72px] lg:pt-0">
        {activeTab === 'dashboard' && <Metrics leads={data.leads} products={data.products} onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'crm' && <CRM currentUser={currentUser!} />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'team' as any && <Team currentUser={currentUser!} />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {shareStoreModal && (
        <ShareStoreModal onClose={() => setShareStoreModal(false)} />
      )}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer border ${active ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20 font-bold' : 'text-gray-500 hover:bg-gray-50 border-transparent font-medium'} w-full text-left`}
      title={label}
    >
      <div className={`${active ? 'text-brand-blue' : 'text-gray-400'} shrink-0`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5', strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className="whitespace-nowrap flex-1">{label}</span>
    </button>
  );
};

const ShareStoreModal = ({ onClose }: { onClose: () => void }) => {
  const [copying, setCopying] = useState(false);
  const shareUrl = window.location.origin;
  
  const textMsg = `*Vem conferir nossa loja!* 👇\n\n${shareUrl}\n\nEuroOferta - A sua loja de móveis!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textMsg);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between mb-4">
             <h3 className="font-bold text-xl text-[#0F172A] tracking-tight">Compartilhar Loja</h3>
             <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors"><X className="w-4 h-4" /></button>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 flex gap-4 items-center mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-blue flex items-center justify-center shrink-0">
               <span className="text-white font-serif font-bold text-2xl">E</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[15px] text-[#0F172A] leading-tight truncate">EuroOferta</h4>
              <span className="text-brand-blue text-xs mt-1 block truncate font-mono bg-blue-50 px-2 py-0.5 rounded-lg w-fit">{shareUrl.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                   <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
             </button>
             <button onClick={handleCopy} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-brand-blue transition-colors group">
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${copying ? 'bg-emerald-500' : 'bg-brand-blue'}`}>
                   {copying ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="text-xs font-bold">{copying ? 'Copiado!' : 'Copiar Link'}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
