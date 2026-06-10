import React, { useState } from 'react';
import { Activity, Search, ShieldAlert, Key, Edit, Trash2, Clock, Filter, Calendar, Sparkles, Download } from 'lucide-react';
import { useStore } from '../../store';

export default function SystemLogs() {
  const { data } = useStore();
  const logs = data.logs || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredLogs = logs.filter(log => {
     if (!log.timestamp) return false;
     const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.user.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesType = typeFilter === 'all' || log.type === typeFilter;
     
     let logDate = '';
     try {
       logDate = new Date(log.timestamp).toISOString().split('T')[0];
     } catch (e) {}
     
     const matchesDate = !dateFilter || logDate === dateFilter;
     return matchesSearch && matchesType && matchesDate;
  });
  
  const todayLogs = logs.filter(l => {
     if(!l.timestamp) return false;
     try {
       return new Date(l.timestamp).toDateString() === new Date().toDateString();
     } catch(e) { return false; }
  });
  const deletionCount = filteredLogs.filter(l => l.type === 'delete').length;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'auth': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'create': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'update': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delete': return 'bg-red-50 text-red-600 border-red-100';
      case 'system': default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auth': return <Key className="w-3.5 h-3.5" />;
      case 'create': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'update': return <Edit className="w-3.5 h-3.5" />;
      case 'delete': return <Trash2 className="w-3.5 h-3.5" />;
      case 'system': default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-blue" />
            Logs do Sistema
          </h2>
          <p className="text-sm text-gray-500 mt-1">Rastreio de atividades, edições e cadastros na plataforma.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Pesquisar logs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue outline-none w-full md:w-64 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="relative flex items-center shrink-0">
            <Calendar className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
            <input 
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="pl-9 pr-2 sm:pr-8 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer min-w-[140px]"
              title="Filtrar por data"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="absolute right-2.5 text-gray-400 hover:text-red-500 font-bold p-1 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                title="Limpar data"
              >
                &times;
              </button>
            )}
          </div>
          
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
          >
            <option value="all">Todos os Eventos</option>
            <option value="auth">Autenticação</option>
            <option value="create">Criação</option>
            <option value="update">Atualização</option>
            <option value="delete">Exclusão</option>
            <option value="system">Sistema</option>
          </select>
          
          <button
            onClick={() => {
              const headers = ['Data,Hora,Ação,Tipo,Usuário,Detalhes\n'];
              const csv = filteredLogs.map((l) => `"${new Date(l.timestamp).toLocaleDateString()}","${new Date(l.timestamp).toLocaleTimeString()}","${l.action}","${l.type}","${l.user}","${l.details}"`).join('\n');
              const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `logs_sistema_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
            }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold text-sm shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Cereja do Bolo - Smart Insights */}
      <div className="bg-gradient-to-r from-brand-blue/5 to-purple-500/5 rounded-2xl p-4 md:p-5 mb-6 border border-brand-blue/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-3 relative z-10">
           <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-brand-blue/10 flex items-center justify-center shrink-0 group hover:scale-105 transition-transform">
             <Sparkles className="w-6 h-6 text-brand-blue group-hover:rotate-12 transition-transform" />
           </div>
           <div>
             <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">Insight dos Logs <span className="bg-brand-blue/10 text-brand-blue text-[9px] uppercase font-black px-1.5 py-0.5 rounded">Automático</span></h3>
             <p className="text-xs text-gray-500 mt-1 max-w-[500px]">
               Hoje tivemos <strong className="text-[#0F172A]">{todayLogs.length} eventos</strong> registrados no sistema. 
               {dateFilter && ` Exibindo ${filteredLogs.length} registros para a data selecionada (${dateFilter.split('-').reverse().join('/')}).`}
               {!dateFilter && deletionCount > 0 && ` Houve ${deletionCount} exclusões no histórico pesquisado.`}
               {!dateFilter && deletionCount === 0 && ` Nenhuma exclusão identificada neste escopo.`}
             </p>
           </div>
        </div>
        <div className="flex gap-2 shrink-0 w-full md:w-auto relative z-10">
          <div className="flex-1 md:flex-none bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Exibindo</span>
            <span className="text-base font-black text-[#0F172A]">{filteredLogs.length}</span>
          </div>
          {deletionCount > 0 && (
            <div className="flex-1 md:flex-none bg-red-50/50 px-4 py-2 rounded-xl border border-red-100 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-0.5">Exclusões</span>
              <span className="text-base font-black text-red-600">{deletionCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredLogs.length > 0 ? filteredLogs.map((log) => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
            <div className="flex items-start gap-4">
              <div className={"w-10 h-10 rounded-full flex items-center justify-center border shadow-sm shrink-0 " + getTypeStyle(log.type || 'system')}>
                {getTypeIcon(log.type || 'system')}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0F172A]">{log.action}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 bg-white px-1.5 py-0.5 rounded">
                    Por {log.user}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{log.details}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 shrink-0 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              {new Date(log.timestamp).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
        )) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
             <Activity className="w-8 h-8 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium">Nenhum log encontrado para esta filtragem.</p>
          </div>
        )}
      </div>
    </div>
  );
}
