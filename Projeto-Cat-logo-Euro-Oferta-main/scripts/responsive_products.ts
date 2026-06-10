import fs from "fs";

let code = fs.readFileSync("src/admin/pages/ProductsManager.tsx", "utf-8");

// Fix header
code = code.replace(
  `className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20"`,
  `className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-white/80 backdrop-blur-md sticky top-0 z-20"`
);

// Fix inner padding
code = code.replace(
  `className="p-8 space-y-10 flex-1"`,
  `className="p-5 sm:p-8 space-y-8 sm:space-y-10 flex-1"`
);

// Fix grid 1
code = code.replace(
  `className="grid grid-cols-2 gap-6"`,
  `className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"`
);

// Fix image section flex
code = code.replace(
  `<div className="flex gap-8 items-start bg-gray-50/50 p-6 rounded-2xl border border-gray-100">`,
  `<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start bg-gray-50/50 p-5 sm:p-6 rounded-2xl border border-gray-100">`
);

// Fix grid 2 (pricing)
code = code.replace(
  `<div className="grid grid-cols-3 gap-6">`,
  `<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">`
);

// Fix grid 3 (variations)
code = code.replace(
  `<div className="grid grid-cols-2 gap-6">`,
  `<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">`
);

fs.writeFileSync("src/admin/pages/ProductsManager.tsx", code);
console.log("Updated ProductsManager.tsx responsiveness");
