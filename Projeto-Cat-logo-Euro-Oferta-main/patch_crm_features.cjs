const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// 1. Add lucide imports
const importMatch = code.match(/import \{([^}]+)\} from 'lucide-react';/);
if (importMatch) {
  let icons = importMatch[1].split(',').map(i => i.trim());
  const newIcons = ['Flame', 'Snowflake', 'CalendarDays', 'AlertCircle', 'Calendar'];
  for (const ic of newIcons) {
    if (!icons.includes(ic)) icons.push(ic);
  }
  code = code.replace(importMatch[0], `import { ${icons.join(', ')} } from 'lucide-react';`);
}

// 2. Add quick filters state to CRM()
const crmStart = "const [selectedLead, setSelectedLead] = useState<Lead | null>(null);";
const quickFiltersState = `  const [activeFilter, setActiveFilter] = useState<'Todos'|'Sem Follow-up'|'VIPs'|'Frios'>('Todos');`;
code = code.replace(crmStart, crmStart + "\\n  " + quickFiltersState);

// Modify filteredLeads
const filterCode = `  const filteredLeads = data.leads.filter(l => {
    const s = search.toLowerCase().trim().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    const searchDigits = s.replace(/\\D/g, '');
    const nameMatch = l.name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').includes(s);
    const phoneMatch = searchDigits.length > 0 && l.phone.replace(/\\D/g, '').includes(searchDigits);
    
    let filterMatch = true;
    if (activeFilter === 'Sem Follow-up') filterMatch = !l.nextFollowUp;
    if (activeFilter === 'VIPs') filterMatch = l.vipLevel !== 'Nenhum';
    if (activeFilter === 'Frios') filterMatch = l.totalSpent === 0;

    return (nameMatch || phoneMatch) && filterMatch;
  });`;

code = code.replace(/const filteredLeads = data\.leads\.filter\(l => \{[\s\S]*?\}\);/, filterCode);

// Add quick filters UI next to search
const searchToolbar = `<div className="flex items-center gap-3">
          <div className="relative">`;
const newSearchToolbar = `<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm border border-gray-200/60 w-full sm:w-auto overflow-x-auto hide-scrollbar">
             {['Todos', 'Sem Follow-up', 'VIPs', 'Frios'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setActiveFilter(f as any)} 
                 className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap \${activeFilter === f ? 'bg-white shadow-sm text-[#0F172A]' : 'text-gray-500 hover:text-[#0F172A]'}\`}
               >
                 {f}
               </button>
             ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">`;
code = code.replace(searchToolbar, newSearchToolbar);
// close the extra div
code = code.replace(/<Filter className="w-4 h-4" \/> Filtros\n\s*<\/button>\n\s*<\/div>/, '<Filter className="w-4 h-4" /> Filtros\n          </button>\n          </div>\n        </div>');


// 3. LeadCard - Temperature and Follow-up UI
const getTemperatureFn = `
const getLeadTemp = (lead: Lead) => {
  if (lead.vipLevel === 'VIP Gold' || lead.vipLevel === 'VIP Premium' || lead.totalSpent > 500) return { icon: <Flame className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />, color: 'bg-orange-50 border-orange-100' };
  if (lead.totalSpent > 0 || lead.vipLevel === 'Cliente Frequente') return { icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, color: 'bg-amber-50 border-amber-100' };
  return { icon: <Snowflake className="w-3.5 h-3.5 text-blue-400" />, color: 'bg-blue-50 border-blue-100' };
};
`;
// inject before LeadCard
code = code.replace("const LeadCard: React.FC", getTemperatureFn + "\nconst LeadCard: React.FC");

const avatarUI = `{lead.avatarUrl && !lead.avatarUrl.includes('pravatar.cc') ? (`;
const tempAvatarUI = `const temp = getLeadTemp(lead);
  const isOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();
  
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={!isDeleting ? onClick : undefined}
      className={\`bg-white p-3.5 rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border \${isOverdue ? 'border-red-200 hover:border-red-300' : 'border-gray-100/80 hover:border-brand-blue/30'} cursor-grab active:cursor-grabbing hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all group select-none flex flex-col gap-2 relative\`}
    >
      {isDeleting ? (`;
code = code.replace(/return \([\s\S]*?\{isDeleting \? \(/, tempAvatarUI);


const badgeInject = `<div className="flex flex-col items-end gap-1">`;
const newBadgeInject = `<div className="flex flex-col items-end gap-1">
            <div className={\`flex items-center justify-center w-6 h-6 rounded-full border shadow-sm \${temp.color}\`} title="Temperatura do Lead">
              {temp.icon}
            </div>`;
code = code.replace(badgeInject, newBadgeInject);

const clockInject = `<span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
           <Clock className="w-2.5 h-2.5" />
           {new Date(lead.updatedAt).toLocaleDateString()}
         </span>`;
const newClockInject = `<div className="flex flex-col gap-0.5">
           <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
             <Clock className="w-2.5 h-2.5" />
             Atul: {new Date(lead.updatedAt).toLocaleDateString()}
           </span>
           {lead.nextFollowUp && (
             <span className={\`text-[9px] font-bold flex items-center gap-1 uppercase tracking-wider \${isOverdue ? 'text-red-500' : 'text-blue-500'}\`}>
               <CalendarDays className="w-2.5 h-2.5" />
               F-UP: {new Date(lead.nextFollowUp).toLocaleDateString()}
             </span>
           )}
         </div>`;
code = code.replace(clockInject, newClockInject);


// 4. Modal - Follow up date picker
const modalStateStart = "const [newNote, setNewNote] = useState('');";
const followUpState = `  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '');`;
code = code.replace(modalStateStart, followUpState);

const handleSaveModal = `updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl });`;
const handleSaveModalNew = `updateLead(lead.id, { phone: formData.phone, email: formData.email, notes: formData.notes, avatarUrl: formData.avatarUrl, nextFollowUp: followUpDate ? new Date(followUpDate + 'T12:00:00').toISOString() : undefined });`;
code = code.replace(handleSaveModal, handleSaveModalNew);

const statusBlock = `<div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status do Lead</h3>`;
const followUpEditor = `
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Próximo Follow-up</h3>
               {isEditing ? (
                  <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-600 font-medium" />
               ) : (
                 <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider \${!followUpDate ? 'bg-gray-100 text-gray-500' : (new Date(followUpDate) < new Date(new Date().setHours(0,0,0,0)) ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100')}\`}>
                    {followUpDate ? new Date(followUpDate + 'T12:00:00').toLocaleDateString() : 'Não agendado'}
                    {followUpDate && new Date(followUpDate) < new Date(new Date().setHours(0,0,0,0)) && <AlertCircle className="w-3.5 h-3.5" />}
                 </div>
               )}
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status do Lead</h3>`;
               
code = code.replace(statusBlock, followUpEditor);

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
console.log("Done patching CRM");
