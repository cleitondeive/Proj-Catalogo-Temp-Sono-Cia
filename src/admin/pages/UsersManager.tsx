import React, { useState, useRef } from 'react';
import { useStore } from '../../store';
import { AdminUser, AdminRole } from '../../types';
import { Plus, Edit2, Trash2, UsersIcon, Shield, Check, X, ShieldAlert, ShieldCheck, Image, Link, Upload, CheckCircle2 } from 'lucide-react';

export default function UsersManager() {
  const { data, addUser, updateUser, deleteUser } = useStore();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
    imageUploadMethod: 'url' as 'url' | 'local',
    role: 'manager' as AdminRole,
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'dashboard', label: 'Dashboard & Métricas' },
    { id: 'crm', label: 'CRM & Leads' },
    { id: 'products', label: 'Produtos' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'settings', label: 'Configurações' }
  ];

  const togglePermission = (permId: string) => {
    if (formData.permissions.includes(permId)) {
      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, permId] });
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      const updates: any = { ...formData };
      if (!updates.password) delete updates.password;
      updateUser(editingUser.id, updates);
      showSuccess('Usuário atualizado com sucesso!');
    } else {
      addUser({ ...formData });
      showSuccess('Usuário criado com sucesso!');
    }
    closeForm();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError("A imagem excede o limite de 2MB. Escolha um arquivo menor.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const editUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      avatarUrl: user.avatarUrl || '',
      imageUploadMethod: 'url',
      role: user.role,
      permissions: user.permissions
    });
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', avatarUrl: '', imageUploadMethod: 'url', role: 'manager', permissions: [] });
  };

  const getRoleBadge = (role: AdminRole) => {
    if (role === 'admin') return <span className="flex items-center gap-1 text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-md font-bold uppercase tracking-wider"><ShieldCheck className="w-3 h-3"/> Admin Master</span>;
    if (role === 'manager') return <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold uppercase tracking-wider"><Shield className="w-3 h-3"/> Gerente</span>;
    return <span className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider"><ShieldAlert className="w-3 h-3"/> Visualizador</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8 space-y-6 relative">
      {successMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in z-10">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in z-10">
          <X className="w-4 h-4" />
          {errorMessage}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-brand-blue" />
          Usuários do Sistema
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-5 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Nome</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-sm font-medium" placeholder="Ex: João Silva" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Email (Login)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-sm font-medium" placeholder="Ex: joao@loja.com" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Senha de Acesso {editingUser ? '(Deixe em branco para manter)' : ''}</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-sm font-medium" placeholder="Ex: SenhaForte123" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Nível de Acesso (Cargo)</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as AdminRole})} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-brand-blue outline-none text-sm font-medium">
                <option value="manager">Gerente (Acesso Personalizado)</option>
                <option value="viewer">Visualizador (Apenas Leitura)</option>
                <option value="admin">Administrador Master</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
               <label className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest block">Foto de Perfil</label>
               <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                  <button type="button" onClick={() => setFormData({...formData, imageUploadMethod: 'url'})} className={`text-[10px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${formData.imageUploadMethod === 'url' ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:text-[#0F172A]'}`}><Link className="w-3 h-3"/> URL</button>
                  <button type="button" onClick={() => setFormData({...formData, imageUploadMethod: 'local'})} className={`text-[10px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${formData.imageUploadMethod === 'local' ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:text-[#0F172A]'}`}><Upload className="w-3 h-3"/> Upload</button>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {formData.avatarUrl ? (
                     <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                     <Image className="w-5 h-5 text-gray-300" />
                  )}
               </div>
               
               {formData.imageUploadMethod === 'url' ? (
                  <input type="text" value={formData.avatarUrl} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-sm font-medium" placeholder="https://exemplo.com/foto.jpg" />
               ) : (
                  <div className="flex-1">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-200 border-dashed rounded-lg text-sm font-bold text-gray-500 hover:text-[#0F172A] hover:bg-gray-50 hover:border-gray-300 transition-all">
                       <Upload className="w-4 h-4" /> Selecionar Foto do Computador
                    </button>
                  </div>
               )}
            </div>
          </div>

          {formData.role !== 'admin' && (
            <div className="pt-2 border-t border-gray-200">
              <label className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest block mb-3">Permissões de Acesso</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availablePermissions.map(perm => {
                  const isChecked = formData.permissions.includes(perm.id) || formData.permissions.includes('*');
                  return (
                    <label key={perm.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isChecked ? 'bg-brand-blue/5 border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-brand-blue border-brand-blue text-white' : 'border-gray-300'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-bold leading-none">{perm.label}</span>
                      <input type="checkbox" className="hidden" checked={isChecked} onChange={() => togglePermission(perm.id)} disabled={formData.permissions.includes('*')} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
             <button onClick={closeForm} className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
             <button onClick={handleSave} className="px-5 py-2 text-xs font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-700 shadow-sm">Salvar Usuário</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {data.users?.map(user => (
          <div key={user.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold font-serif shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-[#0F172A]">{user.name}</h4>
                  {getRoleBadge(user.role)}
                </div>
                <p className="text-xs text-gray-500 font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end shrink-0 gap-2">
              {userToDelete === user.id ? (
                <div className="flex items-center gap-2 bg-red-50 p-1 rounded-lg border border-red-100 animate-fade-in">
                   <span className="text-xs font-medium text-red-600 px-2">Excluir usuário?</span>
                   <button onClick={() => { deleteUser(user.id); showSuccess('Usuário excluído!'); }} className="text-[10px] font-bold bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600">Sim</button>
                   <button onClick={() => setUserToDelete(null)} className="text-[10px] font-bold bg-white text-gray-600 border border-gray-200 px-2 py-1.5 rounded hover:bg-gray-50">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editUser(user)} className="p-2 text-gray-400 hover:text-brand-blue bg-gray-50 rounded-lg hover:bg-brand-blue/10 transition-colors" title="Editar">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {user.id !== '1' && ( // Prevent deleting the initial Master Admin
                    <button 
                      onClick={() => setUserToDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors" title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {(!data.users || data.users.length === 0) && (
          <p className="text-sm text-gray-500 py-4 text-center">Nenhum usuário cadastrado.</p>
        )}
      </div>
    </div>
  );
}
