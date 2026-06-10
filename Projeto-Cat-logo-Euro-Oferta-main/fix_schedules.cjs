const fs = require('fs');
let crm = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const target1 = `  const [scheduleData, setScheduleData] = useState({ type: 'whatsapp', date: '', title: '' });

  const handleAddSchedule = () => {
    if (!scheduleData.title || !scheduleData.date) return;
    const newSchedule = { id: Math.random().toString(36).substring(2, 9), type: scheduleData.type as any, date: scheduleData.date, title: scheduleData.title, completed: false };
    const updatedSchedules = [...((lead as any).schedules || []), newSchedule];
    updateLead(lead.id, { schedules: updatedSchedules } as any);
    setShowScheduleForm(false);
    setScheduleData({ type: 'whatsapp', date: '', title: '' });
  };

  const handleToggleSchedule = (id: string) => {
    const updatedSchedules = ((lead as any).schedules || []).map((s: any) => s.id === id ? { ...s, completed: !s.completed } : s);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedules = ((lead as any).schedules || []).filter((s: any) => s.id !== id);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };`;

const replacement1 = `  const [scheduleData, setScheduleData] = useState({ type: 'whatsapp', date: '', title: '' });
  const [schedules, setSchedules] = useState<any[]>((lead as any).schedules || []);

  const handleAddSchedule = () => {
    if (!scheduleData.title || !scheduleData.date) return;
    const newSchedule = { id: Math.random().toString(36).substring(2, 9), type: scheduleData.type as any, date: scheduleData.date, title: scheduleData.title, completed: false };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
    setShowScheduleForm(false);
    setScheduleData({ type: 'whatsapp', date: '', title: '' });
  };

  const handleToggleSchedule = (id: string) => {
    const updatedSchedules = schedules.map((s: any) => s.id === id ? { ...s, completed: !s.completed } : s);
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter((s: any) => s.id !== id);
    setSchedules(updatedSchedules);
    updateLead(lead.id, { schedules: updatedSchedules } as any);
  };`;

const target2 = `  const timelineItems = [
    ...(formData.notes || []).map((n) => ({ type: 'note', date: new Date(n.date).getTime(), data: n })),
    ...((lead).schedules || []).map((s) => ({ type: 'schedule', date: new Date(s.date).getTime(), data: s })),`;

const replacement2 = `  const timelineItems = [
    ...(formData.notes || []).map((n) => ({ type: 'note', date: new Date(n.date).getTime(), data: n })),
    ...schedules.map((s) => ({ type: 'schedule', date: new Date(s.date).getTime(), data: s })),`;

crm = crm.replace(target1, replacement1);
crm = crm.replace(target2, replacement2);
fs.writeFileSync('src/admin/pages/CRM.tsx', crm);
console.log('Done!');
