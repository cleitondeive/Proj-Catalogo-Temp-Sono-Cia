const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if(!code.includes('import { motion } from "motion/react"')) {
    code = code.replace('import React', 'import { motion } from "motion/react";\nimport React');
}

// QuickView first block main image (around line 459 in grep output)
// We will replace <img src={[...] ...className="..." referrerPolicy="no-referrer" /> inside the first quickview.
// Let's use regex that targets the specific img block which has transition duration 500

const regexImg = /<img\s*\n\s*src=\{\s*\[\(quickViewProduct\?\.colors\?\.find.+?\]\.filter\(Boolean\)\[activeImageIdx\]\s*\}\s*\n\s*alt=\{quickViewProduct\.name\}\s*\n\s*className="max-w-full max-h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"\s*\n\s*referrerPolicy="no-referrer"\s*\n\s*\/>/g;

const replacementImg = `<motion.img
                    key={(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image || '') + activeImageIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={
                      [(quickViewProduct?.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.image || quickViewProduct?.image), ...(quickViewProduct?.gallery || [])].filter(Boolean)[activeImageIdx]
                    }
                    alt={quickViewProduct.name}
                    className="max-w-full max-h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />`;

if(code.match(regexImg)) {
    code = code.replace(regexImg, replacementImg);
    console.log("Replaced img with motion.img in quickview");
} else {
    console.log("Regex not found for img");
}

fs.writeFileSync('src/App.tsx', code);
