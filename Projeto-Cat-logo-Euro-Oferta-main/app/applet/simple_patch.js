const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

if (!code.includes('showScheduleForm')) {
  code = code.replace(
    'const [isDeleting, setIsDeleting] = useState(false);',
    'const [isDeleting, setIsDeleting] = useState(false);\n  const [showScheduleForm, setShowScheduleForm] = useState(false);\n  const [scheduleData, setScheduleData] = useState({ type: \'whatsapp\', date: \'\', title: \'\' });\n\n  const handleAddSchedule = () => {\n    if (!scheduleData.title || !scheduleData.date) return;\n    const newSchedule = { id: Math.random().toString(36).substring(2, 9), type: scheduleData.type as any, date: scheduleData.date, title: scheduleData.title, completed: false };\n    const updatedSchedules = [...((lead as any).schedules || []), newSchedule];\n    updateLead(lead.id, { schedules: updatedSchedules } as any);\n    setShowScheduleForm(false);\n    setScheduleData({ type: \'whatsapp\', date: \'\', title: \'\' });\n  };\n\n  const handleToggleSchedule = (id: string) => {\n    const updatedSchedules = ((lead as any).schedules || []).map((s: any) => s.id === id ? { ...s, completed: !s.completed } : s);\n    updateLead(lead.id, { schedules: updatedSchedules } as any);\n  };'
  );

  const rightInsert = fs.readFileSync('patchData.txt', 'utf8');

  code = code.replace(
    '{/* Smart Replies Section - A Cereja do Bolo */}',
    rightInsert + '\n\n            {/* Smart Replies Section - A Cereja do Bolo */}'
  );

  fs.writeFileSync('src/admin/pages/CRM.tsx', code);
  console.log('Patched CRM.tsx successfully!');
} else {
  console.log('Already patched.');
}
