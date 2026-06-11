import React, { useState } from 'react';
import { Save, Phone, Mail, Instagram, Facebook, MapPin, Store } from 'lucide-react';
import UsersManager from './UsersManager';
import SystemLogs from './SystemLogs';
import { useStore } from '../../store';

export default function SettingsPage() {
  const { data, addLog } = useStore();
  const userId = localStorage.getItem('admin_user_id');
  const currentUser = data.users?.find(u => u.id === userId) || data.users?.[0];

  const [storeSettings, setStoreSettings] = useState({
    name: localStorage.getItem('sono_store_name') || 'Sono & Cia',
    phone: localStorage.getItem('sono_store_phone') || '5565981183473',
    email: localStorage.getItem('sono_store_email') || 'contato@sonoecia.com.br',
    instagram: localStorage.getItem('sono_store_instagram') || '@sonoecia',
    facebook: localStorage.getItem('sono_store_facebook') || 'SonoECiaBR',
    address: localStorage.getItem('sono_store_address') || 'Av. Principal, 1000 - Centro',
  });

  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('sono_store_name', storeSettings.name);
    localStorage.setItem('sono_store_phone', storeSettings.phone);
    localStorage.setItem('sono_store_email', storeSettings.email);
    localStorage.setItem('sono_store_instagram', storeSettings.instagram);
    localStorage.setItem('sono_store_facebook', storeSettings.facebook);
    localStorage.setItem('sono_store_address', storeSettings.address);
    if(addLog) addLog('Configurações Alteradas', 'Preferências da loja atualizadas', currentUser?.name || 'Admin', 'system');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">Configurações Gerais</h1>
        <p className="text-gray-500 mt-2">Gerencie as preferências da sua loja e informações de contato públicas.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-10">
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-blue" />
            Informações da Loja
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Nome da Loja</label>
              <input 
                type="text" 
                value={storeSettings.name} 
                onChange={e => setStoreSettings({...storeSettings, name: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-sm text-[#0F172A] font-medium" 
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Phone className="w-3 h-3 text-green-500" /> WhatsApp para Pedidos (Principal)</label>
              <input 
                type="text" 
                value={storeSettings.phone} 
                onChange={e => setStoreSettings({...storeSettings, phone: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-sm text-[#0F172A] font-medium" 
                placeholder="Ex: 5511999999999"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Mail className="w-3 h-3 text-brand-blue" /> E-mail de Recebimento de Pedidos (Anotação)</label>
              <input 
                type="email" 
                value={storeSettings.email} 
                onChange={e => setStoreSettings({...storeSettings, email: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-sm text-[#0F172A] font-medium" 
                placeholder="pedidos@sualoja.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
            Redes Sociais e Endereço
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Instagram className="w-3 h-3 text-pink-500" /> Instagram Oficial</label>
              <input 
                type="text" 
                value={storeSettings.instagram} 
                onChange={e => setStoreSettings({...storeSettings, instagram: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors text-sm text-[#0F172A] font-medium" 
                placeholder="@sualoja"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><Facebook className="w-3 h-3 text-blue-600" /> Facebook Oficial</label>
              <input 
                type="text" 
                value={storeSettings.facebook} 
                onChange={e => setStoreSettings({...storeSettings, facebook: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm text-[#0F172A] font-medium" 
                placeholder="/sualoja"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-400" /> Endereço Físico (Opcional)</label>
              <input 
                type="text" 
                value={storeSettings.address} 
                onChange={e => setStoreSettings({...storeSettings, address: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors text-sm text-[#0F172A] font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4">
          {success && (
            <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg animate-fade-in flex items-center gap-1.5 border border-emerald-100">
               <Save className="w-4 h-4" /> Configurações salvas
            </span>
          )}
          <button 
            onClick={handleSave}
            className="bg-[#0F172A] hover:bg-black text-white flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Save className="w-5 h-5" />
            Salvar Configurações
          </button>
        </div>
      </div>

      {currentUser?.role === 'admin' && <UsersManager />}
      {currentUser?.role === 'admin' && <SystemLogs />}
    </div>
  );
}
