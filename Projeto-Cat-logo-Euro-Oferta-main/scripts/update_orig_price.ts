import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf-8");

const oldOrigPrice = `{quickViewProduct.originalPrice && quickViewProduct.showPrice !== false && (
                <span className="text-gray-400 line-through text-[14px]">
                  R$ {quickViewProduct.originalPrice}
                </span>
              )}`;

const newOrigPrice = `{((quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.originalPrice) || quickViewProduct.originalPrice) && quickViewProduct.showPrice !== false && (
                <span className="text-gray-400 line-through text-[14px]">
                  R$ {quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.originalPrice || quickViewProduct.originalPrice}
                </span>
              )}`;

code = code.split(oldOrigPrice).join(newOrigPrice);
fs.writeFileSync("src/App.tsx", code);
console.log("Updated originalPrice in quickview");
