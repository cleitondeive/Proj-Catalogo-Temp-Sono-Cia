const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const regex = /export type DataContextType = \{/;
const replacement = `export type DataContextType = {
  addLeadWithOrder: (lead: any, items: any, total: number) => void;`;

if (!code.includes('addLeadWithOrder')) {
  code = code.replace(regex, replacement);
  
  const injectRegex = /const updateLeadStatus =/;
  const injectCode = `
  const addLeadWithOrder = (partialLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orders' | 'notes' | 'tags'>, items: Order['items'], total: number) => {
    const newLead: Lead = {
      ...partialLead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSpent: total,
      orders: [],
      notes: [],
      tags: [],
      status: 'Pedido Enviado',
    };
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: newLead.id,
      items,
      total,
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    
    newLead.orders = [newOrder];
    
    setData(prev => {
      const updatedData = {
        ...prev,
        leads: [...prev.leads, newLead],
        orders: [...prev.orders, newOrder]
      };
      // Save synchronously to local storage to prevent navigation data loss
      try {
        localStorage.setItem('euro_store_data', JSON.stringify(updatedData));
      } catch (e) {}
      return updatedData;
    });
  };

  const updateLeadStatus =`;
  code = code.replace(injectRegex, injectCode);
  
  // also add into Provider value
  code = code.replace(/setOrders, addLead,/, 'setOrders, addLead, addLeadWithOrder,');
  fs.writeFileSync('src/store.tsx', code);
}
