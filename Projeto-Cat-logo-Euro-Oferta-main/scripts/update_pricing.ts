import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf-8");

const targetPrice = `{quickViewProduct.showPrice !== false ? \`R$ \${quickViewProduct.price}\` : <span className="text-[18px] uppercase tracking-widest text-brand-blue">Consulte o Preço</span>}`;

const replacementPrice = `{quickViewProduct.showPrice !== false ? \`R$ \${quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.price || quickViewProduct.price}\` : <span className="text-[18px] uppercase tracking-widest text-brand-blue">Consulte o Preço</span>}`;

code = code.split(targetPrice).join(replacementPrice);

fs.writeFileSync("src/App.tsx", code);
console.log("Updated quick view internal pricing format.");
