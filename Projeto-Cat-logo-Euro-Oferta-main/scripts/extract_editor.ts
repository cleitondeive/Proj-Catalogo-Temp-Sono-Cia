import fs from "fs";

let code = fs.readFileSync("src/admin/pages/ProductsManager.tsx", "utf-8");

const startIdx = code.indexOf('const ProductEditor =');
const text = code.substring(startIdx);
fs.writeFileSync("scripts/producteditor.txt", text);
console.log("Extracted ProductEditor");
