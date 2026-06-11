import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppData, Product, Lead, Order, AdminUser } from './types';
import { initialProducts } from './initialData';
import { supabase } from './supabase';

const STORAGE_KEY = 'sono_ecia_data';

const saveDataToLocalStorage = (appData: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    if (e && typeof e === 'object' && ('name' in e || 'code' in e)) {
      const errName = (e as any).name || '';
      if (errName === 'QuotaExceededError' || errName === 'NS_ERROR_DOM_QUOTA_REACHED' || (e as any).code === 22) {
        console.warn('LocalStorage quota exceeded. Retrying with compressed/truncated log history...');
        try {
          const reducedData = {
            ...appData,
            logs: appData.logs ? appData.logs.slice(0, 20) : [],
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedData));
        } catch (retryError) {
          console.warn('LocalStorage quota still exceeded. Retrying with empty logs and trimmed leads/orders...');
          try {
            const minimalData = {
              ...appData,
              logs: [],
              leads: appData.leads ? appData.leads.slice(-20) : [],
              orders: appData.orders ? appData.orders.slice(-20) : [],
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
          } catch (finalError) {
            console.warn('LocalStorage full. Unable to write application state.');
          }
        }
        return;
      }
    }
    console.warn('Failed to save to localStorage', e);
  }
};

const getInitialLocalData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        products: parsed.products || [],
        leads: parsed.leads || [],
        orders: parsed.orders || [],
        logs: parsed.logs || [],
        users: parsed.users || [
          { id: '1', name: 'Admin Master', email: 'admin@sonoecia.com.br', role: 'admin', permissions: ['*'], createdAt: new Date().toISOString() }
        ]
      };
    } catch (e) {
      console.error("Failed to parse local app data", e);
    }
  }
  return { 
    products: initialProducts, 
    leads: [], 
    orders: [],
    logs: [],
    users: [
      { id: '1', name: 'Admin Master', email: 'admin@sonoecia.com.br', role: 'admin', permissions: ['*'], createdAt: new Date().toISOString() }
    ]
  };
};

export type DataContextType = {
  addLeadWithOrder: (lead: any, items: any, total: number) => string;
  data: AppData;
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setLeads: (leads: Lead[]) => void;
  setOrders: (orders: Order[]) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orders' | 'notes' | 'tags'>) => Lead;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addOrder: (leadId: string, items: Order['items'], total: number) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setUsers: (users: AdminUser[]) => void;
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => AdminUser;
  updateUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  addLog: (action: string, details: string, user: string, type?: 'auth'|'create'|'update'|'delete'|'system') => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialLocalData);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        const { data: remoteData, error } = await supabase
          .from('app_state')
          .select('data')
          .eq('id', 1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Erro ao carregar do Supabase:", error);
          return;
        }

        if (remoteData && remoteData.data && Object.keys(remoteData.data).length > 0) {
          const parsed = remoteData.data;
          setData({
            products: parsed.products || initialProducts,
            leads: parsed.leads || [],
            orders: parsed.orders || [],
        logs: parsed.logs || [],
        users: parsed.users || []
          });
        }
      } catch (err) {
        console.error("Supabase fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromSupabase();
  }, []);

  // Salvar alterações no Supabase e LocalStorage usando debounce simples
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    saveDataToLocalStorage(data);

    const timer = setTimeout(async () => {
      if(!isLoading) {
        try {
          await supabase.from('app_state').upsert({ id: 1, data, updated_at: new Date().toISOString() });
        } catch (e) {
          console.error('Supabase save failed', e);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, isLoading]);

  const setProducts = (products: Product[]) => setData(prev => ({ ...prev, products }));
  const setLeads = (leads: Lead[]) => setData(prev => ({ ...prev, leads }));
  const setOrders = (orders: Order[]) => setData(prev => ({ ...prev, orders }));

  const addLead = (partialLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orders' | 'notes' | 'tags'>) => {
    addLog('Novo Lead', 'Lead criado', 'Sistema', 'create');
    const newLead: Lead = {
      ...partialLead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSpent: 0,
      orders: [],
      notes: [],
      tags: [],
    };
    setData(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
    return newLead;
  };

  
  const addLeadWithOrder = (partialLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orders' | 'notes' | 'tags'>, items: Order['items'], total: number): string => {
    let generatedOrderNum = '';
    setData(prev => {
      const inputPhone = (partialLead.phone || '').replace(/\D/g, '');
      const existingLeadIndex = prev.leads.findIndex(l => (l.phone || '').replace(/\D/g, '') === inputPhone);
      
      let newLeadsArray = [...prev.leads];
      let finalLeadId;
      const d = new Date();
      const dStr = d.toISOString();
      let newLogs = [...(prev.logs || [])];

      let targetLead: Lead;
      
      if (existingLeadIndex >= 0) {
        targetLead = { ...newLeadsArray[existingLeadIndex] };
        finalLeadId = targetLead.id;
        
        newLogs.push({
          id: Math.random().toString(36).substr(2, 9),
          action: 'Pedido Adicional',
          details: `Novo pedido do lead existente ${targetLead.name}`,
          user: 'Sistema',
          type: 'create',
          timestamp: dStr
        });
        
        targetLead.status = 'Pedido Enviado';
        targetLead.updatedAt = dStr;
        targetLead.totalSpent = (targetLead.totalSpent || 0) + total;
        targetLead.orders = [...(targetLead.orders || [])]; 
        targetLead.source = partialLead.source || targetLead.source;
      } else {
        finalLeadId = Math.random().toString(36).substr(2, 9);
        
        newLogs.push({
          id: Math.random().toString(36).substr(2, 9),
          action: 'Novo Lead',
          details: 'Lead criado com primeiro pedido',
          user: 'Sistema',
          type: 'create',
          timestamp: dStr
        });
        
        targetLead = {
          ...partialLead,
          id: finalLeadId,
          createdAt: dStr,
          updatedAt: dStr,
          totalSpent: total,
          orders: [],
          notes: [],
          tags: [],
          status: 'Pedido Enviado',
        } as Lead;
      }

      newLogs.push({
        id: Math.random().toString(36).substr(2, 9),
        action: 'Novo Pedido',
        details: 'Pedido efetuado',
        user: 'Sistema',
        type: 'create',
        timestamp: dStr
      });

      const orderCount = prev.orders.length + 1;
      const orderNum = `#PED-${orderCount.toString().padStart(4, '0')}`;
      generatedOrderNum = orderNum;

      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        orderNumber: orderNum,
        leadId: finalLeadId,
        items: items,
        total: total,
        status: 'Em Negociação',
        createdAt: dStr
      };

      targetLead.orders.push(newOrder);

      if (existingLeadIndex >= 0) {
        newLeadsArray[existingLeadIndex] = targetLead;
      } else {
        newLeadsArray.push(targetLead);
      }

      const updatedData = {
        ...prev,
        leads: newLeadsArray,
        orders: [...prev.orders, newOrder],
        logs: newLogs
      };

      // Manually trigger storage event across tabs
      saveDataToLocalStorage(updatedData);
      try {
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
      
      return updatedData;
    });
    return generatedOrderNum;
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setData(prev => {
      const updatedLeads = prev.leads.map(l => {
        if (l.id === id) {
          const updatedLead = { ...l, status, updatedAt: new Date().toISOString() };
          if (status === 'Venda Ganha') {
            updatedLead.orders = updatedLead.orders?.map(o => ({ ...o, status: 'Finalizado' })) || [];
          }
          return updatedLead;
        }
        return l;
      });
      return {
        ...prev,
        leads: updatedLeads
      };
    });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setData(prev => {
      const updatedLeads = prev.leads.map(l => {
        if (l.id === id) {
          const updatedLead = { ...l, ...updates, updatedAt: new Date().toISOString() };
          if (updates.status === 'Venda Ganha' || updatedLead.status === 'Venda Ganha') {
            updatedLead.orders = updatedLead.orders?.map(o => ({ ...o, status: 'Finalizado' })) || [];
          }
          return updatedLead;
        }
        return l;
      });
      return {
        ...prev,
        leads: updatedLeads
      };
    });
  };

  const deleteLead = (id: string) => {
    addLog('Exclusão', 'ID ' + id, 'Sistema', 'delete');
    setData(prev => ({
      ...prev,
      leads: prev.leads.filter(l => l.id !== id)
    }));
  };

  const addOrder = (leadId: string, items: Order['items'], total: number) => {
    addLog('Novo Pedido', 'Pedido efetuado', 'Sistema', 'create');
    const orderCount = data.orders.length + 1;
    const orderNum = `#PED-${orderCount.toString().padStart(4, '0')}`;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: orderNum,
      leadId,
      items,
      total,
      status: 'Em Negociação',
      createdAt: new Date().toISOString()
    };
    setData(prev => {
      const updatedLeads = prev.leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            orders: [...l.orders, newOrder],
            totalSpent: l.totalSpent + total,
            updatedAt: new Date().toISOString(),
            status: 'Pedido Enviado' as Lead['status']
          };
        }
        return l;
      });
      return { ...prev, orders: [...prev.orders, newOrder], leads: updatedLeads };
    });
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setData(prev => {
      // First update the order in the global orders array
      const updatedOrders = prev.orders.map(o => o.id === id ? { ...o, ...updates } : o);
      
      // We also need to update the order inside the leads array
      const updatedLeads = prev.leads.map(l => {
        if (l.orders && l.orders.some(o => o.id === id)) {
          return {
            ...l,
            orders: l.orders.map(o => o.id === id ? { ...o, ...updates } : o)
          };
        }
        return l;
      });

      return {
        ...prev,
        orders: updatedOrders,
        leads: updatedLeads
      };
    });
  };

  
  const addLog = (action: string, details: string, user: string, type: 'auth'|'create'|'update'|'delete'|'system' = 'system') => {
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      details,
      user,
      type,
      timestamp: new Date().toISOString()
    };
    setData((prev: any) => ({
      ...prev,
      logs: [newLog, ...(prev.logs || [])].slice(0, 500)
    }));
  };

  const setUsers = (users: AdminUser[]) => setData(prev => ({ ...prev, users }));
  
  const addUser = (partialUser: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...partialUser,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, users: [...prev.users, newUser] }));
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<AdminUser>) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u)
    }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  };

  return (
    <DataContext.Provider value={{ data, isLoading, setProducts, setLeads, setOrders, addLead, addLeadWithOrder, updateLeadStatus, updateLead, deleteLead, addOrder, updateOrder, setUsers, addUser, updateUser, deleteUser, addLog }}>
      {children}
    </DataContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useStore must be used within DataProvider");
  return context;
};
