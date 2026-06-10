const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const replacement = `  const addLeadWithOrder = (partialLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'totalSpent' | 'orders' | 'notes' | 'tags'>, items: Order['items'], total: number) => {
    setData(prev => {
      const inputPhone = partialLead.phone.replace(/\\D/g, '');
      const existingLead = prev.leads.find(l => l.phone.replace(/\\D/g, '') === inputPhone);
      
      let finalLeadId;
      let newLeadsArray = [...prev.leads];
      let eventStatus = 'Pedido Enviado'; // ou Em Negociação

      if (existingLead) {
        finalLeadId = existingLead.id;
        // avoid circular tracking of addLog, but addLog itself has no deps, so we must just be careful
        const d = new Date();
        const newLogs = [...(prev.logs || []), {
          id: Math.random().toString(36).substr(2, 9),
          action: 'Pedido Adicional',
          details: \`Novo pedido do lead existente \${existingLead.name}\`,
          user: 'Sistema',
          type: 'create',
          timestamp: d.toISOString()
        }];
        
        newLeadsArray = newLeadsArray.map(l => {
          if (l.id === existingLead.id) {
            return {
              ...l,
              status: 'Pedido Enviado',
              updatedAt: d.toISOString(),
              totalSpent: l.totalSpent + total,
              source: partialLead.source || l.source
            };
          }
          return l;
        });
        prev.logs = newLogs; 
      } else {
        finalLeadId = Math.random().toString(36).substr(2, 9);
        const d = new Date();
        const newLogs = [...(prev.logs || []), {
          id: Math.random().toString(36).substr(2, 9),
          action: 'Novo Lead',
          details: 'Lead criado com primeiro pedido',
          user: 'Sistema',
          type: 'create',
          timestamp: d.toISOString()
        }];
        
        const newLead = {
          ...partialLead,
          id: finalLeadId,
          createdAt: d.toISOString(),
          updatedAt: d.toISOString(),
          totalSpent: total,
          orders: [],
          notes: [],
          tags: [],
          status: 'Pedido Enviado',
        };
        newLeadsArray.push(newLead);
        prev.logs = newLogs;
      }

      const orderD = new Date();
      prev.logs.push({
        id: Math.random().toString(36).substr(2, 9),
        action: 'Novo Pedido',
        details: 'Pedido efetuado',
        user: 'Sistema',
        type: 'create',
        timestamp: orderD.toISOString()
      });

      const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        leadId: finalLeadId,
        items,
        total,
        status: 'sent',
        createdAt: orderD.toISOString()
      };
      
      newLeadsArray = newLeadsArray.map(l => {
        if (l.id === finalLeadId) {
          return {
            ...l,
            orders: [...(l.orders || []), newOrder]
          };
        }
        return l;
      });

      const updatedData = {
        ...prev,
        leads: newLeadsArray,
        orders: [...prev.orders, newOrder],
        logs: prev.logs
      };
      
      try {
        localStorage.setItem('euro_store_data', JSON.stringify(updatedData));
      } catch (e) {}
      
      return updatedData;
    });
  };`;

const regex = /  const addLeadWithOrder = \([\s\S]*?\n  \};\n/;
if(regex.test(code)) {
  code = code.replace(regex, replacement + '\n');
  fs.writeFileSync('src/store.tsx', code);
  console.log('Successfully patched addLeadWithOrder via Regex.');
} else {
  console.log('Regex also failed.');
}
