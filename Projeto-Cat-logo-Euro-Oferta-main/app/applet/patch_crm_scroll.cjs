const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

// Patch 1: Make CRM height fixed to screen to trigger internal scrollbars
code = code.replace('<div className="h-full flex flex-col pt-6 bg-[#F8F9FA]">', '<div className="h-[calc(100vh-72px)] lg:h-screen flex flex-col pt-4 lg:pt-6 bg-[#F8F9FA] overflow-hidden">');

// Patch 2: Add min-h-0 to Kanban board wrapper and history wrapper
code = code.replace('<div className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar">', '<div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-4 flex gap-4 snap-x custom-scrollbar">');

code = code.replace('<div className="flex-1 overflow-auto px-5 sm:px-8 pb-8 custom-scrollbar">', '<div className="flex-1 min-h-0 overflow-auto px-5 sm:px-8 pb-8 custom-scrollbar">');

// Patch 3: Make the Columns scrollbar visible and add min-h-0 to column just in case
code = code.split('<div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 hide-scrollbar relative">').join('<div className="flex-1 min-h-0 overflow-y-auto px-1 mx-2 pb-3 space-y-2.5 custom-scrollbar relative pr-2">');

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
console.log('patched scrollbars');
