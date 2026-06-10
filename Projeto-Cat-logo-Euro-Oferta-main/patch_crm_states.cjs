const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const stateTarget = `  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', vipLevel: 'Nenhum' as any, source: 'Manual', status: 'Novo Lead' as any });`;
const stateReplace = `  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', vipLevel: 'Nenhum' as any, source: 'Manual', status: 'Novo Lead' as any });
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>(['Cancelado', 'Venda Perdida']);
  const [displayLimits, setDisplayLimits] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'recent'|'value'|'urgent'>('recent');

  const toggleColumnCollapse = (stageId: string) => {
    setCollapsedColumns(prev => prev.includes(stageId) ? prev.filter(id => id !== stageId) : [...prev, stageId]);
  };
  
  const loadMore = (stageId: string) => {
    setDisplayLimits(prev => ({ ...prev, [stageId]: (prev[stageId] || 20) + 20 }));
  };`;

crm = crm.replace(stateTarget, stateReplace);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('States patched.');
