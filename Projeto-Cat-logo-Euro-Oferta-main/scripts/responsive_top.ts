import fs from "fs";

// --- Metrics.tsx ---
let metrics = fs.readFileSync("src/admin/pages/Metrics.tsx", "utf-8");

metrics = metrics.replace(
  `className="p-8 pb-32 max-w-7xl mx-auto space-y-8 animate-fade-in"`,
  `className="p-5 sm:p-8 pb-32 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in"`
);

metrics = metrics.replace(
  `className="flex justify-between items-end"`,
  `className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-3 sm:gap-0"`
);

metrics = metrics.replace(
  `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">`
);

metrics = metrics.replace(
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">`
);

fs.writeFileSync("src/admin/pages/Metrics.tsx", metrics);

// --- ProductsManager.tsx ---
let products = fs.readFileSync("src/admin/pages/ProductsManager.tsx", "utf-8");

products = products.replace(
  `className="p-8 pb-32 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#0F172A]"`,
  `className="p-5 sm:p-8 pb-32 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-[#0F172A]"`
);

products = products.replace(
  `className="flex justify-between items-end"`,
  `className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0"`
);

fs.writeFileSync("src/admin/pages/ProductsManager.tsx", products);

// --- CRM.tsx ---
let crm = fs.readFileSync("src/admin/pages/CRM.tsx", "utf-8");

crm = crm.replace(
  `className="px-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"`,
  `className="px-5 sm:px-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"`
);

crm = crm.replace(
  `className="px-8 pb-6 grid grid-cols-2 md:grid-cols-4 gap-4"`,
  `className="px-5 sm:px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"`
);

// Kanban board container
crm = crm.replace(
  `className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-8 flex gap-4 snap-x custom-scrollbar"`,
  `className="flex-1 overflow-x-auto overflow-y-hidden px-5 sm:px-8 pb-8 flex gap-4 snap-x custom-scrollbar"`
);

fs.writeFileSync("src/admin/pages/CRM.tsx", crm);

console.log("Updated top level containers");
