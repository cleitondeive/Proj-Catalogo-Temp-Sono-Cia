import fs from "fs";

let code = fs.readFileSync("src/admin/pages/CRM.tsx", "utf-8");

// Fix header
code = code.replace(
  `className="p-8 pb-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-20 flex justify-between items-start"`,
  `className="p-5 sm:p-8 sm:pb-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"`
);

// Body spacing
code = code.replace(
  `className="p-8 space-y-10"`,
  `className="p-5 sm:p-8 space-y-8 sm:space-y-10"`
);

// Grid stats
code = code.replace(
  `<div className="grid grid-cols-2 gap-4">`,
  `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`
);

fs.writeFileSync("src/admin/pages/CRM.tsx", code);
console.log("Updated CRM.tsx responsiveness");
