import React, { useState } from 'react';
import { AdminUser, AdminRole } from '../../types';
import { useStore } from '../../store';
import { Users, UserPlus, Shield, Mail, Trash2, Edit2, KeyRound, Sparkles, TrendingUp, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Team({ currentUser }: { currentUser: AdminUser }) {
  const { data, addUser, updateUser, deleteUser, addLog } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    role: 'manager',
    password: '',
  });

  const [search, setSearch] = useState('');

  const filteredUsers = (data.users || []).filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) return;
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
      addLog('Usuário', `Editou usuário ${formData.name}`, currentUser.name, 'update');
    } else {
      if (!formData.password) return; // Need password for new user
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as AdminRole,
        permissions: formData.role === 'admin' ? ['all'] : ['crm', 'products'],
      });
      addLog('Usuário', `Adicionou usuário ${formData.name}`, currentUser.name, 'create');
    }
    
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'manager', password: '' });
  };

  const roleColors = {
    admin: 'bg-red-50 text-red-600 border-red-100',
    manager: 'bg-blue-50 text-blue-600 border-blue-100',
    viewer: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  const roleLabels = {
    admin: 'Administrador Master',
    manager: 'Vendedor / Gerente',
    viewer: 'Acesso Leitura'
  };

  // Cereja do bolo: Team metrics
  const activeSellers = data.users?.filter(u => u.role !== 'viewer').length || 0;
  const topSeller = data.users?.map(user => {
    const closed = data.leads.filter(l => l.assignee === user.name && l.status === 'Venda Ganha').reduce((acc, l) => acc + (l.totalSpent || 0), 0);
    return { name: user.name, closed };
  }).sort((a,b) => b.closed - a.closed)[0] || null;

  return (
    <div className="h-full flex flex-col pt-6 bg-[#F8F9FA]">
      <div className="px-5 sm:px-8 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">Gestão de Equipe</h1>
          <p className="text-gray-500 mt-1">Gerencie os acessos de vendedores e administradores.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-auto flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Buscar usuário..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none xl:w-[280px] w-full shadow-sm"
            />
          </div>
          <button onClick={() => {
            setFormData({ name: '', email: '', role: 'manager', password: '' });
            setEditingUser(null);
            setShowAddModal(true);
          }} className="h-[42px] px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2 font-bold text-xs uppercase tracking-wider group shrink-0 whitespace-nowrap">
            <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Adicionar Usuário
          </button>
        </div>
      </div>

      {/* AI Premium Insight - Cereja do bolo */}
      <div className="px-5 sm:px-8 pb-5">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-[0_2px_10px_rgba(16,185,129,0.05)]">
          <div className="flex items-center gap-3 w-full">
             <div className="w-10 h-10 rounded-lg bg-emerald-100/50 flex shrink-0 items-center justify-center text-emerald-600 shadow-sm border border-emerald-200/50">
               <TrendingUp className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-emerald-600 xl:uppercase tracking-widest leading-none mb-1">Cereja do Bolo • Performance da Equipe</p>
               <p className="text-[13px] font-medium text-[#0F172A] leading-snug">
                 Sua equipe possui <span className="font-bold">{activeSellers} vendedores/gerentes</span>. 
                 {topSeller && topSeller.closed > 0 ? (
                   <> O destaque atual é <span className="font-bold underline decoration-emerald-200 underline-offset-2">{topSeller.name}</span> com <span className="font-bold text-emerald-700">R$ {topSeller.closed.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span> em vendas convertidas!</>
                 ) : (
                   <> Distribua seus leads no CRM para começar a medir a performance de vendas.</>
                 )}
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-5 sm:px-8 pb-8 custom-scrollbar">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                <th className="p-4 pl-6 font-bold">Usuário</th>
                <th className="p-4 font-bold">Contato/Acesso</th>
                <th className="p-4 font-bold">Perfil (Role)</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 pr-6 text-right font-bold w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-sm">Nenhum usuário encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                           <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                        ) : (
                           <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue/80 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm text-sm border border-brand-blue/20">
                             {user.name.charAt(0).toUpperCase()}
                           </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0F172A] text-sm leading-tight">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Criado em {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${roleColors[user.role]} inline-flex items-center gap-1`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : null}
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Ativo
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => {
                             setEditingUser(user);
                             setFormData({ name: user.name, email: user.email, role: user.role });
                             setShowAddModal(true);
                           }}
                           className="p-1.5 hover:bg-white border-transparent hover:border-gray-200 border rounded-lg text-gray-400 hover:text-brand-blue shadow-sm transition-all"
                           title="Editar Usuário"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         {user.id !== currentUser.id && user.id !== 'admin-master' && (
                           <button 
                             onClick={() => {
                               if(window.confirm('Tem certeza que deseja excluir ' + user.name + '?')) {
                                 deleteUser(user.id);
                                 addLog('Usuário', \`Excluiu usuário \${user.name}\`, currentUser.name, 'delete');
                               }
                             }}
                             className="p-1.5 hover:bg-white border-transparent hover:border-red-200 border rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-all"
                             title="Excluir Usuário"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl scale-in-center">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#F8F9FA] rounded-t-2xl">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                {editingUser ? <Edit2 className="w-5 h-5 text-brand-blue" /> : <UserPlus className="w-5 h-5 text-brand-blue" />}
                {editingUser ? 'Editar Usuário' : 'Novo Usuário Vendedor'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none placeholder:text-gray-300 font-medium text-gray-700 shadow-sm"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">E-mail de Acesso</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none placeholder:text-gray-300 font-medium text-gray-700 shadow-sm"
                  placeholder="Ex: joao@loja.com"
                />
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Perfil de Acesso</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value as AdminRole})}
                  className="w-full px-3 py-2.5 sm:py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-700 font-medium shadow-sm appearance-none cursor-pointer bg-gray-50/50"
                  disabled={editingUser?.id === 'admin-master'}
                >
                  <option value="manager">Vendedor / Gerente (Acesso CRM)</option>
                  <option value="admin">Administrador Master</option>
                  <option value="viewer">Apenas Leitura</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Senha Provisória</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 sm:py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none font-medium text-gray-700 shadow-sm"
                      placeholder="Senha para este vendedor"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 rounded-b-2xl">
               <button 
                 onClick={() => setShowAddModal(false)}
                 className="px-5 py-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleSave}
                 disabled={!formData.name || !formData.email || (!editingUser && !formData.password)}
                 className="px-6 py-2 bg-[#0F172A] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
               >
                 <CheckCircle2 className="w-4 h-4" />
                 {editingUser ? 'Salvar Alterações' : 'Criar Vendedor'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
